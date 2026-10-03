import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  HYDERABAD_LOCATIONS,
  DEMO_ROUTE_GEOMETRIES,
  generateApproximatePath,
  RouteGeometrySegment,
  TransitStopMarker,
} from '../utils/hyderabadGeo';

interface TransitMapProps {
  fromLocationName: string;
  toLocationName: string;
  selectedRouteId: number | null;
  showRoutePath: boolean;
  className?: string;
  onSelectStation?: (name: string) => void;
}

export const HyderabadTransitMap: React.FC<TransitMapProps> = ({
  fromLocationName,
  toLocationName,
  selectedRouteId = 1,
  showRoutePath = true,
  className = '',
  onSelectStation,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Expanded map state for mobile/desktop theater viewing
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [activeVehicleInfo, setActiveVehicleInfo] = useState<{
    mode: string;
    label: string;
    speed: string;
    currentStation: string;
  }>({
    mode: 'metro',
    label: 'Blue Line Train 102',
    speed: '42 km/h',
    currentStation: 'Tarnaka',
  });

  // Track the full sequence of coordinates for the active route simulation
  const routeWaypointsRef = useRef<[number, number][]>([]);

  // 1. Initialize Leaflet map instance once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered at central Hyderabad transit nexus (Ameerpet / Hussain Sagar / Secunderabad triangle)
    const map = L.map(mapContainerRef.current, {
      center: [17.4300, 78.4600],
      zoom: 12,
      minZoom: 10,
      maxZoom: 18,
      zoomControl: false, // Custom placed zoom control below
    });

    // Add zoom control at bottom-right for clean mobile ergonomics
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Standard high-resolution OpenStreetMap tile layer (reliable, zero API key needed)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> · HMDA Hyderabad Transit',
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    // Invalidate size once DOM layout finishes rendering
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Invalidate map size whenever user toggles Expand Map
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [isExpanded]);

  // 2. Render route, station stops, markers, and path lines
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    // Stop previous simulation loop while re-rendering
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (vehicleMarkerRef.current) {
      vehicleMarkerRef.current.remove();
      vehicleMarkerRef.current = null;
    }

    layerGroup.clearLayers();

    const fromLoc = HYDERABAD_LOCATIONS[fromLocationName] || HYDERABAD_LOCATIONS['Tarnaka'];
    const toLoc = HYDERABAD_LOCATIONS[toLocationName] || HYDERABAD_LOCATIONS['HITEC City'];

    const allPoints: L.LatLngExpression[] = [];
    const flattenedWaypoints: [number, number][] = [];

    // Helper: Create stylish, crisp custom HTML DivIcons
    const createBadgeIcon = (
      label: string,
      type: 'start' | 'dest' | 'transfer' | 'metro-stop' | 'bus-stop' | 'mmts-stop',
      subtext?: string
    ) => {
      let bg = 'bg-emerald-600';
      let border = 'border-emerald-700';
      let symbol = '🟢';
      let zIndex = 900;

      if (type === 'dest') {
        bg = 'bg-rose-600';
        border = 'border-rose-700';
        symbol = '🔴';
        zIndex = 1000;
      } else if (type === 'transfer') {
        bg = 'bg-amber-600';
        border = 'border-amber-700';
        symbol = '🔄';
        zIndex = 950;
      } else if (type === 'metro-stop') {
        bg = 'bg-blue-600';
        border = 'border-blue-700';
        symbol = '🚇';
        zIndex = 800;
      } else if (type === 'bus-stop') {
        bg = 'bg-emerald-600';
        border = 'border-emerald-700';
        symbol = '🚌';
        zIndex = 800;
      } else if (type === 'mmts-stop') {
        bg = 'bg-purple-600';
        border = 'border-purple-700';
        symbol = '🚆';
        zIndex = 800;
      }

      const isStationDot = type.includes('stop');

      if (isStationDot) {
        return L.divIcon({
          className: 'custom-station-dot',
          html: `
            <div class="group relative flex items-center justify-center cursor-pointer" style="transform: translate(-50%, -50%);">
              <div class="w-4 h-4 rounded-full ${bg} border-2 border-white shadow-md flex items-center justify-center text-[8px] text-white">
              </div>
              <div class="hidden group-hover:flex absolute bottom-5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] font-sans font-semibold px-2 py-1 rounded shadow-lg whitespace-nowrap z-50 pointer-events-none border border-slate-700">
                ${symbol} ${label}
              </div>
            </div>
          `,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
      }

      return L.divIcon({
        className: 'custom-transit-pin',
        html: `
          <div class="flex flex-col items-center group cursor-pointer" style="transform: translate(-50%, -100%);">
            <div class="px-2.5 py-1 rounded-full ${bg} text-white font-sans text-xs font-extrabold shadow-lg border ${border} flex items-center gap-1.5 whitespace-nowrap ring-2 ring-white">
              <span>${symbol}</span>
              <span>${label}</span>
            </div>
            ${
              subtext
                ? `<span class="bg-white/95 text-slate-800 text-[10px] font-mono px-1.5 py-0.5 rounded shadow-sm border border-slate-200 mt-0.5 font-bold tracking-tight">${subtext}</span>`
                : ''
            }
            <div class="w-2.5 h-2.5 ${bg} rotate-45 -mt-1.5 shadow-sm border-r border-b ${border}"></div>
          </div>
        `,
        iconSize: [140, 50],
        iconAnchor: [70, 50],
      });
    };

    // 1. Draw Starting Point Marker
    if (fromLoc) {
      const startMarker = L.marker(fromLoc.coords, {
        icon: createBadgeIcon(fromLoc.name, 'start', 'STARTING LOCATION'),
        zIndexOffset: 1000,
      }).addTo(layerGroup);
      startMarker.bindPopup(`
        <div class="p-1">
          <div class="font-bold text-xs text-emerald-800 uppercase tracking-wide">Starting Point</div>
          <div class="font-bold text-sm text-slate-900">${fromLoc.name}</div>
          <div class="text-xs text-slate-500 mt-0.5">${fromLoc.description || 'Hyderabad Transit Grid'}</div>
        </div>
      `);
      allPoints.push(fromLoc.coords);
    }

    // 2. Draw Destination Marker
    if (toLoc) {
      const destMarker = L.marker(toLoc.coords, {
        icon: createBadgeIcon(toLoc.name, 'dest', 'DESTINATION'),
        zIndexOffset: 1000,
      }).addTo(layerGroup);
      destMarker.bindPopup(`
        <div class="p-1">
          <div class="font-bold text-xs text-rose-800 uppercase tracking-wide">Destination</div>
          <div class="font-bold text-sm text-slate-900">${toLoc.name}</div>
          <div class="text-xs text-slate-500 mt-0.5">${toLoc.description || 'Hyderabad Transit Grid'}</div>
        </div>
      `);
      allPoints.push(toLoc.coords);
    }

    // 3. Draw Route Geometry & Transport Modes
    if (showRoutePath && selectedRouteId) {
      let segments: RouteGeometrySegment[] = [];

      // If Tarnaka -> HITEC City (or Madhapur/Raidurg), use verified high-precision predefined road/metro/mmts geometry
      const isTarnakaToCyberabad =
        (fromLocationName === 'Tarnaka' &&
          (toLocationName === 'HITEC City' || toLocationName === 'Madhapur' || toLocationName === 'Raidurg')) ||
        (fromLocationName === 'HITEC City' && toLocationName === 'Tarnaka');

      if (isTarnakaToCyberabad && DEMO_ROUTE_GEOMETRIES[selectedRouteId]) {
        segments = DEMO_ROUTE_GEOMETRIES[selectedRouteId];
      } else if (fromLoc && toLoc) {
        const mode = selectedRouteId === 2 ? 'bus' : selectedRouteId === 3 ? 'mmts' : 'metro';
        segments = generateApproximatePath(fromLoc.coords, toLoc.coords, mode);
      }

      // Draw each segment of the journey
      segments.forEach((seg, sIdx) => {
        let color = '#2563eb'; // Blue for Metro
        let weight = 6;
        let dashArray = undefined;
        let opacity = 0.95;

        if (seg.mode === 'bus') {
          color = '#16a34a'; // Green for Bus
          weight = 6;
        } else if (seg.mode === 'mmts') {
          color = '#9333ea'; // Purple for MMTS
          weight = 6;
          dashArray = '8, 8';
        } else if (seg.mode === 'walk') {
          color = '#64748b'; // Slate for Walking
          weight = 4;
          dashArray = '4, 6';
          opacity = 0.85;
        }

        // Draw soft glow under-polyline for clear contrast
        L.polyline(seg.path, {
          color: seg.mode === 'metro' ? '#93c5fd' : seg.mode === 'bus' ? '#86efac' : '#d8b4fe',
          weight: weight + 4,
          opacity: 0.4,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(layerGroup);

        // Draw prominent main route polyline
        const polyline = L.polyline(seg.path, {
          color,
          weight,
          dashArray,
          opacity,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(layerGroup);

        polyline.bindPopup(`
          <div class="p-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">${seg.mode.toUpperCase()} SEGMENT</span>
            <div class="font-bold text-xs text-slate-800">${seg.label}</div>
          </div>
        `);

        // Add to bounding box array and simulation waypoints
        seg.path.forEach((pt) => {
          allPoints.push(pt);
          flattenedWaypoints.push(pt);
        });

        // Draw intermediate transit stops along this segment if available
        if (seg.stops && seg.stops.length > 0) {
          seg.stops.forEach((stop: TransitStopMarker) => {
            // Transfer point gets a standout interchange pin
            if (stop.isInterchange) {
              const interchangeMarker = L.marker(stop.coords, {
                icon: createBadgeIcon(stop.name, 'transfer', 'INTERCHANGE POINT'),
                zIndexOffset: 950,
              }).addTo(layerGroup);
              interchangeMarker.bindPopup(`
                <div class="p-1.5">
                  <div class="flex items-center gap-1 text-xs font-bold text-amber-700">
                    <span class="material-symbols-outlined text-[16px]">sync_alt</span>
                    <span>TRANSFER POINT</span>
                  </div>
                  <div class="font-bold text-sm text-slate-900 mt-0.5">${stop.name}</div>
                  <div class="text-xs text-slate-600 mt-1">${stop.description}</div>
                </div>
              `);
            } else {
              // Regular intermediate station gets a discreet station dot
              const stopType =
                stop.mode === 'metro' ? 'metro-stop' : stop.mode === 'bus' ? 'bus-stop' : 'mmts-stop';
              const stationMarker = L.marker(stop.coords, {
                icon: createBadgeIcon(stop.name, stopType),
                zIndexOffset: 750,
              }).addTo(layerGroup);
              stationMarker.bindPopup(`
                <div class="p-1">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">${stop.mode.toUpperCase()} STATION</span>
                  <div class="font-bold text-xs text-slate-900">${stop.name}</div>
                  <div class="text-[11px] text-slate-500 mt-0.5">${stop.description}</div>
                </div>
              `);
            }
          });
        }
      });

      routeWaypointsRef.current = flattenedWaypoints;

      // 4. Initialize Simulated Transport Movement Vehicle Marker
      if (flattenedWaypoints.length >= 2) {
        const vehicleMode = selectedRouteId === 2 ? 'bus' : selectedRouteId === 3 ? 'mmts' : 'metro';
        const vehicleLabel =
          selectedRouteId === 2
            ? '🚌 Bus 10H'
            : selectedRouteId === 3
            ? '🚆 MMTS 47154'
            : '🚇 Metro Train 102';

        const vehicleIcon = L.divIcon({
          className: 'custom-vehicle-marker',
          html: `
            <div class="flex items-center gap-1.5 bg-slate-900 text-white font-sans text-xs font-bold px-2.5 py-1 rounded-full shadow-2xl border-2 border-white ring-2 ${
              vehicleMode === 'metro'
                ? 'ring-blue-500'
                : vehicleMode === 'bus'
                ? 'ring-emerald-500'
                : 'ring-purple-500'
            } animate-pulse" style="transform: translate(-50%, -50%);">
              <span class="w-2 h-2 rounded-full ${
                vehicleMode === 'metro' ? 'bg-blue-400' : vehicleMode === 'bus' ? 'bg-emerald-400' : 'bg-purple-400'
              } animate-ping"></span>
              <span>${vehicleLabel}</span>
            </div>
          `,
          iconSize: [130, 32],
          iconAnchor: [65, 16],
        });

        const startPt = flattenedWaypoints[0];
        const vehicleMarker = L.marker(startPt, {
          icon: vehicleIcon,
          zIndexOffset: 1200,
        }).addTo(layerGroup);

        vehicleMarkerRef.current = vehicleMarker;

        // Start smooth waypoint interpolation loop
        let currentWaypointIndex = 0;
        let progress = 0;

        const animateVehicle = () => {
          if (!isSimulating) {
            animFrameIdRef.current = requestAnimationFrame(animateVehicle);
            return;
          }

          if (currentWaypointIndex >= flattenedWaypoints.length - 1) {
            // Loop back to start after brief pause
            currentWaypointIndex = 0;
            progress = 0;
          }

          const p1 = flattenedWaypoints[currentWaypointIndex];
          const p2 = flattenedWaypoints[currentWaypointIndex + 1];

          if (p1 && p2) {
            // Calculate step distance based on simSpeed
            const stepDelta = 0.015 * simSpeed;
            progress += stepDelta;

            if (progress >= 1) {
              progress = 0;
              currentWaypointIndex += 1;
            }

            const lat = p1[0] + (p2[0] - p1[0]) * progress;
            const lng = p1[1] + (p2[1] - p1[1]) * progress;

            if (vehicleMarkerRef.current) {
              vehicleMarkerRef.current.setLatLng([lat, lng]);
            }
          }

          animFrameIdRef.current = requestAnimationFrame(animateVehicle);
        };

        animFrameIdRef.current = requestAnimationFrame(animateVehicle);
      }
    }

    // 5. Automatically pan & fit bounds to the entire route
    if (allPoints.length === 1) {
      map.flyTo(allPoints[0], 14, { duration: 0.8 });
    } else if (allPoints.length > 1) {
      const bounds = L.latLngBounds(allPoints);
      map.flyToBounds(bounds, {
        padding: [50, 50],
        maxZoom: 14,
        duration: 0.9,
      });
    }
  }, [fromLocationName, toLocationName, selectedRouteId, showRoutePath, isSimulating, simSpeed]);

  // Recenter Route Bounds Handler
  const handleRecenter = useCallback(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.invalidateSize();

    const fromLoc = HYDERABAD_LOCATIONS[fromLocationName];
    const toLoc = HYDERABAD_LOCATIONS[toLocationName];

    if (fromLoc && toLoc) {
      const bounds = L.latLngBounds([fromLoc.coords, toLoc.coords]);
      mapInstanceRef.current.flyToBounds(bounds, {
        padding: [55, 55],
        maxZoom: 14,
        duration: 0.8,
      });
    } else if (fromLoc) {
      mapInstanceRef.current.flyTo(fromLoc.coords, 14, { duration: 0.8 });
    } else {
      mapInstanceRef.current.flyTo([17.4300, 78.4600], 12, { duration: 0.8 });
    }
  }, [fromLocationName, toLocationName]);

  // Toggle Live Simulation Play / Pause
  const toggleSimulation = () => {
    setIsSimulating((prev) => !prev);
  };

  // Toggle 1x / 2x Speed
  const toggleSpeed = () => {
    setSimSpeed((prev) => (prev === 1 ? 2 : 1));
  };

  return (
    <div
      className={`relative z-0 isolate rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 transition-all duration-300 ${
        isExpanded ? 'h-[580px] sm:h-[640px]' : className || 'h-[380px] sm:h-[460px]'
      }`}
    >
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-800">Hyderabad Live Map</span>
          <span className="text-slate-300">|</span>
          <span className="text-[11px] text-blue-700 font-semibold font-mono">
            {selectedRouteId === 1
              ? '🚇 Blue Line Metro'
              : selectedRouteId === 2
              ? '🚌 Bus 10H Express'
              : '🚆 MMTS Suburban'}
          </span>
        </div>

        {/* Live Simulation Controls */}
        <div className="hidden sm:flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-1 rounded-xl border border-slate-200 shadow-sm text-xs">
          <button
            type="button"
            onClick={toggleSimulation}
            title={isSimulating ? 'Pause Vehicle Simulation' : 'Play Vehicle Simulation'}
            className="p-1 hover:bg-slate-100 rounded-lg text-slate-700 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-blue-600">
              {isSimulating ? 'pause' : 'play_arrow'}
            </span>
            <span className="text-[11px] font-bold">{isSimulating ? 'Pause' : 'Play'}</span>
          </button>

          <span className="text-slate-300">|</span>

          <button
            type="button"
            onClick={toggleSpeed}
            title="Toggle Simulation Speed"
            className="px-1.5 py-0.5 hover:bg-slate-100 rounded text-[11px] font-mono font-bold text-slate-600 cursor-pointer"
          >
            {simSpeed}x Speed
          </button>
        </div>
      </div>

      {/* Top-Right Action Buttons: Recenter & Theater Mode */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5">
        {/* Recenter Button */}
        <button
          type="button"
          onClick={handleRecenter}
          title="Recenter and Fit Full Route"
          className="bg-white/95 hover:bg-slate-50 text-slate-700 hover:text-blue-700 px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-1 font-semibold text-xs transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] text-blue-600">center_focus_strong</span>
          <span className="hidden sm:inline">Fit Route</span>
        </button>

        {/* Expand / Collapse Map View */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? 'Collapse Map' : 'Expand Full Map View'}
          className="bg-white/95 hover:bg-slate-50 text-slate-700 hover:text-blue-700 p-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] text-slate-700">
            {isExpanded ? 'fullscreen_exit' : 'fullscreen'}
          </span>
        </button>
      </div>

      {/* Bottom Transport Legend & Controls Strip */}
      <div className="absolute bottom-3 left-3 right-14 z-[1000] bg-white/95 backdrop-blur-md p-2 sm:p-2.5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 font-semibold text-slate-800">
            <span className="w-3.5 h-1.5 bg-blue-600 rounded-full inline-block shadow-xs"></span>
            <span>🚇 Metro</span>
          </span>
          <span className="flex items-center gap-1 font-semibold text-slate-800">
            <span className="w-3.5 h-1.5 bg-emerald-600 rounded-full inline-block shadow-xs"></span>
            <span>🚌 Bus</span>
          </span>
          <span className="flex items-center gap-1 font-semibold text-slate-800">
            <span className="w-3.5 h-1.5 bg-purple-600 rounded-full inline-block border-t border-dashed shadow-xs"></span>
            <span>🚆 MMTS</span>
          </span>
          <span className="flex items-center gap-1 font-semibold text-slate-800">
            <span className="w-3.5 h-1 bg-slate-500 rounded-full inline-block border-b border-dotted"></span>
            <span>🚶 Walk</span>
          </span>
          <span className="flex items-center gap-1 font-semibold text-amber-700">
            <span className="material-symbols-outlined text-[14px]">sync_alt</span>
            <span>Transfer Point</span>
          </span>
        </div>

        <div className="text-[11px] text-slate-500 hidden md:inline">
          Real Hyderabad GPS · Click stations for turnstile & platform info
        </div>
      </div>

      {/* The Leaflet Container Element */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
