import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';

export const NetworkStatus: React.FC = () => {
  const { incidentLogs, addIncidentLog, showToast, isSimulatedJam } = useTransit();
  const [activeSimulation, setActiveSimulation] = useState<string | null>(
    isSimulatedJam ? 'signal_begumpet' : null
  );
  const [isSyncing, setIsSyncing] = useState(false);

  // Dynamic values based on active simulation
  const [blueHeadway, setBlueHeadway] = useState('2.8');
  const [redHeadway, setRedHeadway] = useState('3.5');
  const [blueAlertText, setBlueAlertText] = useState(
    'Peak Express dispatch: 24 rakes in circulation. Extra rake ready at Uppal Depot.'
  );

  const handleSyncRadar = () => {
    setIsSyncing(true);
    showToast('Syncing satellite radar with 1,420 buses & 57 trainsets...');
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Radar & telemetry streams synchronized (41ms latency)');
    }, 1000);
  };

  const handleInjectDisruption = (type: string) => {
    setActiveSimulation(type);
    const timeNow = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    if (type === 'signal_begumpet') {
      setBlueHeadway('4.2');
      setBlueAlertText('Signal clearance in progress near Begumpet. Automatic headway regulation active.');
      addIncidentLog({
        time: timeNow,
        type: 'warning',
        text: 'SIMULATION: Begumpet Signal Hold initiated. Headway stretched to 4.2m (+4 min auto shift).',
        corridor: 'Corridor III Blue',
      });
      showToast('Simulation: Begumpet Signal Hold active');
    } else if (type === 'rain_malakpet') {
      addIncidentLog({
        time: timeNow,
        type: 'warning',
        text: 'SIMULATION: Malakpet storm drain surge. 32 TGSRTC Buses redirected to Route 222 Alt.',
        corridor: 'TGSRTC Fleet',
      });
      showToast('Simulation: Malakpet Waterlogging divert active');
    } else if (type === 'rake_miyapur') {
      setRedHeadway('3.8');
      addIncidentLog({
        time: timeNow,
        type: 'info',
        text: 'SIMULATION: Miyapur depot swap executed with zero line stagnation (Standby #29 deployed).',
        corridor: 'Corridor I Red',
      });
      showToast('Simulation: Miyapur rake maintenance active');
    }
  };

  const handleResetSimulation = () => {
    setActiveSimulation(null);
    setBlueHeadway('2.8');
    setRedHeadway('3.5');
    setBlueAlertText('Peak Express dispatch: 24 rakes in circulation. Extra rake ready at Uppal Depot.');
    const timeNow = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    addIncidentLog({
      time: timeNow,
      type: 'cleared',
      text: 'AI simulation cleared. Transit grid reset to nominal schedule.',
      corridor: 'Transit Grid',
    });
    showToast('Simulation cleared: All corridors nominal');
  };

  return (
    <div className="flex flex-col w-full">
      {/* Operational Sub-Header Bar */}
      <div className="w-full bg-surface-container-lowest/80 backdrop-blur-md px-4 md:px-margin-desktop py-space-sm flex flex-wrap items-center justify-between gap-space-md border-b border-surface-container-high/30">
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-space-xs">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-tertiary"></span>
            </span>
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight uppercase">
              Transit Telemetry Engine
            </span>
          </div>
          <span className="font-label-caps text-label-caps px-space-xs py-0.5 rounded bg-surface-container-high text-primary tracking-wider border border-primary/20">
            SEC-HYD-RT-STREAM
          </span>
          <span className="hidden md:inline font-telemetry-sm text-telemetry-sm text-on-surface-variant">
            HMRL · TGSRTC · SCR-MMTS · HMDA
          </span>
        </div>

        <div className="flex items-center gap-space-sm">
          <div className="flex items-center gap-space-xs px-space-sm py-space-xs rounded bg-surface-container text-tertiary font-telemetry-sm text-telemetry-sm border border-tertiary/20">
            <span className="material-symbols-outlined text-[15px]">sensors</span>
            <span>GTFS-RT: 41ms JITTER</span>
          </div>
          <button
            onClick={handleSyncRadar}
            className="flex items-center gap-space-xs px-space-sm py-space-xs rounded bg-surface-container-high hover:bg-surface-bright text-on-surface transition-colors font-label-md text-label-md cursor-pointer border border-surface-container-highest"
          >
            <span className={`material-symbols-outlined text-[15px] ${isSyncing ? 'animate-spin' : ''}`}>
              autorenew
            </span>
            <span className="hidden sm:inline">Sync Radar</span>
          </button>
        </div>
      </div>

      <div className="w-full px-4 md:px-margin-desktop py-space-md space-y-space-md">
        {/* Top Telemetry KPI Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
          {/* Card 1: Hyderabad Metro */}
          <div className="relative overflow-hidden rounded-xl bg-surface-container-low/90 backdrop-blur-lg p-space-md shadow-md border border-surface-container-high/30">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary shadow-[0_0_12px_rgba(78,222,163,0.5)]"></div>
            <div className="flex items-start justify-between">
              <div className="space-y-space-xs">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-tertiary">subway</span>
                  Hyderabad Metro (HMRL)
                </span>
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-headline-xl text-headline-xl text-on-surface tracking-tight">98.4%</span>
                  <span className="font-telemetry-sm text-telemetry-sm text-tertiary font-semibold uppercase">
                    On-Time
                  </span>
                </div>
              </div>
              <span className="font-label-caps text-label-caps px-space-xs py-0.5 rounded-full bg-tertiary-container/30 text-tertiary uppercase flex items-center gap-1 border border-tertiary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>Nominal
              </span>
            </div>
            <div className="mt-space-sm pt-space-xs flex items-center justify-between font-telemetry-sm text-telemetry-sm text-on-surface-variant border-t border-surface-container-high/20">
              <span>57 Trainsets in Circulation</span>
              <span className="text-primary font-semibold">Headway 3.2m</span>
            </div>
          </div>

          {/* Card 2: TGSRTC Fleet */}
          <div className="relative overflow-hidden rounded-xl bg-surface-container-low/90 backdrop-blur-lg p-space-md shadow-md border border-surface-container-high/30">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary shadow-[0_0_12px_rgba(76,215,246,0.5)]"></div>
            <div className="flex items-start justify-between">
              <div className="space-y-space-xs">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-secondary">directions_bus</span>
                  TGSRTC City Bus Fleet
                </span>
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-headline-xl text-headline-xl text-on-surface tracking-tight">2,840</span>
                  <span className="font-telemetry-sm text-telemetry-sm text-secondary font-semibold uppercase">
                    Active Buses
                  </span>
                </div>
              </div>
              <span className="font-label-caps text-label-caps px-space-xs py-0.5 rounded-full bg-secondary-container/20 text-secondary uppercase flex items-center gap-1 border border-secondary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>Secunderabad Mod
              </span>
            </div>
            <div className="mt-space-sm pt-space-xs flex items-center justify-between font-telemetry-sm text-telemetry-sm text-on-surface-variant border-t border-surface-container-high/20">
              <span>91.8% Sched Adherence</span>
              <span className="text-tertiary font-semibold">412 EV Buses</span>
            </div>
          </div>

          {/* Card 3: MMTS Commuter Rail */}
          <div className="relative overflow-hidden rounded-xl bg-surface-container-low/90 backdrop-blur-lg p-space-md shadow-md border border-surface-container-high/30">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_12px_rgba(147,204,255,0.5)]"></div>
            <div className="flex items-start justify-between">
              <div className="space-y-space-xs">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-primary">train</span>
                  MMTS Suburban Rail
                </span>
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-headline-xl text-headline-xl text-on-surface tracking-tight">124</span>
                  <span className="font-telemetry-sm text-telemetry-sm text-primary font-semibold uppercase">
                    Daily Runs
                  </span>
                </div>
              </div>
              <span className="font-label-caps text-label-caps px-space-xs py-0.5 rounded-full bg-primary-container/20 text-primary uppercase flex items-center gap-1 border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>On Schedule
              </span>
            </div>
            <div className="mt-space-sm pt-space-xs flex items-center justify-between font-telemetry-sm text-telemetry-sm text-on-surface-variant border-t border-surface-container-high/20">
              <span>Falaknuma ↔ Lingampalli</span>
              <span className="text-tertiary font-semibold">94.2% Punctual</span>
            </div>
          </div>

          {/* Card 4: First/Last Mile Micro-Mobility */}
          <div className="relative overflow-hidden rounded-xl bg-surface-container-low/90 backdrop-blur-lg p-space-md shadow-md border border-surface-container-high/30">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary-container shadow-[0_0_12px_rgba(3,181,211,0.5)]"></div>
            <div className="flex items-start justify-between">
              <div className="space-y-space-xs">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-secondary-container">electric_moped</span>
                  Micro-mobility & Feeders
                </span>
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-headline-xl text-headline-xl text-on-surface tracking-tight">1,240</span>
                  <span className="font-telemetry-sm text-telemetry-sm text-secondary-container font-semibold uppercase">
                    Units Live
                  </span>
                </div>
              </div>
              <span className="font-label-caps text-label-caps px-space-xs py-0.5 rounded-full bg-secondary-container/20 text-secondary-container uppercase flex items-center gap-1 border border-secondary-container/30">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>High Demand
              </span>
            </div>
            <div className="mt-space-sm pt-space-xs flex items-center justify-between font-telemetry-sm text-telemetry-sm text-on-surface-variant border-t border-surface-container-high/20">
              <span>T-Hub / Cyber Towers Feeders</span>
              <span className="text-secondary font-semibold">96.4% Fleet SOC</span>
            </div>
          </div>
        </div>

        {/* Main Command Console: Line-by-Line Grid & Interactive Radar Simulator */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md">
          {/* Left 8 Columns: Live Corridors Stream */}
          <div className="xl:col-span-8 space-y-space-md">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">timeline</span>
                <h2 className="font-headline-md text-headline-md text-on-surface">Corridor Telemetry & Line Headways</h2>
              </div>
              <div className="flex items-center gap-space-xs text-on-surface-variant font-label-caps text-label-caps">
                <span className="w-2 h-2 rounded-full bg-tertiary"></span>LIVE GTFS-RT SYNC
              </div>
            </div>

            {/* Corridor I: Red Line */}
            <div className="rounded-xl bg-surface-container/70 backdrop-blur-md p-space-md shadow-md transition-all duration-300 hover:bg-surface-container border border-surface-container-high/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm">
                  <span className="px-space-sm py-1 rounded bg-error/20 text-error font-label-caps text-label-caps uppercase tracking-wider font-bold border border-error/30">
                    M-RED
                  </span>
                  <div>
                    <div className="flex items-center gap-space-xs">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">Corridor I: Miyapur ↔ LB Nagar</h3>
                      <span className="font-label-caps text-label-caps text-outline">29.2 KM · 27 STN</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Primary North-West to South-East Spine via Ameerpet, Punjagutta, MGBS
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-space-md">
                  <div className="text-right">
                    <span className="font-label-caps text-label-caps text-outline uppercase">Active Headway</span>
                    <div className="font-telemetry-lg text-telemetry-lg text-on-surface">
                      {redHeadway} <span className="text-body-sm font-normal text-on-surface-variant">mins</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-caps text-label-caps text-outline uppercase">Pax Density</span>
                    <div className="font-telemetry-lg text-telemetry-lg text-tertiary">74%</div>
                  </div>
                  <span className="px-space-xs py-1 rounded bg-tertiary/10 text-tertiary font-label-caps text-label-caps uppercase flex items-center gap-1 border border-tertiary/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>Smooth
                  </span>
                </div>
              </div>

              {/* Luminous Line Segment Tracker */}
              <div className="mt-space-md pt-space-xs">
                <div className="relative flex items-center justify-between py-space-xs">
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-surface-container-highest rounded"></div>
                  <div className="absolute left-0 w-2/3 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-error/60 via-error to-error/20 rounded"></div>
                  {/* Stations */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-error ring-4 ring-error/20"></div>
                    <span className="font-label-caps text-label-caps text-on-surface mt-1">Miyapur</span>
                    <span className="font-telemetry-sm text-[10px] text-tertiary">Orig Depot</span>
                  </div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-surface-variant"></div>
                    <span className="font-label-caps text-label-caps text-on-surface-variant mt-1">Kukatpally</span>
                  </div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center shadow-[0_0_12px_rgba(147,204,255,0.6)]">
                      <span className="material-symbols-outlined text-[10px] text-on-primary">sync_alt</span>
                    </div>
                    <span className="font-label-caps text-label-caps text-primary font-bold mt-1">Ameerpet (X)</span>
                    <span className="font-telemetry-sm text-[10px] text-primary">Arr: 2m, 5m</span>
                  </div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-surface-variant"></div>
                    <span className="font-label-caps text-label-caps text-on-surface-variant mt-1">Khairatabad</span>
                  </div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[9px] text-on-secondary">directions_bus</span>
                    </div>
                    <span className="font-label-caps text-label-caps text-secondary font-bold mt-1">MGBS (X)</span>
                  </div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-error"></div>
                    <span className="font-label-caps text-label-caps text-on-surface mt-1">LB Nagar</span>
                    <span className="font-telemetry-sm text-[10px] text-on-surface-variant">Terminal</span>
                  </div>
                </div>
              </div>

              <div className="mt-space-sm flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant bg-surface-container-low px-space-sm py-space-xs rounded border border-surface-container-high/20">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-tertiary text-[15px]">info</span>
                  <span>Platform 1 elevators nominal. 18 trainsets operating at planned speed curve.</span>
                </div>
                <span className="font-telemetry-sm text-telemetry-sm text-outline">TELEMETRY ID: HMR-C1-RT</span>
              </div>
            </div>

            {/* Corridor III: Blue Line (Heavy Load) */}
            <div className="rounded-xl bg-surface-container/70 backdrop-blur-md p-space-md shadow-md transition-all duration-300 hover:bg-surface-container border border-surface-container-high/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm">
                  <span className="px-space-sm py-1 rounded bg-primary/20 text-primary font-label-caps text-label-caps uppercase tracking-wider font-bold border border-primary/30">
                    M-BLU
                  </span>
                  <div>
                    <div className="flex items-center gap-space-xs">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">
                        Corridor III: Nagole ↔ Raidurg (HITEC City)
                      </h3>
                      <span className="font-label-caps text-label-caps text-outline">27.0 KM · 23 STN</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Key Tech Arterial: Secunderabad, Begumpet, Jubilee Hills, Madhapur, Cyber Towers
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-space-md">
                  <div className="text-right">
                    <span className="font-label-caps text-label-caps text-outline uppercase">Active Headway</span>
                    <div className="font-telemetry-lg text-telemetry-lg text-primary">
                      {blueHeadway} <span className="text-body-sm font-normal text-on-surface-variant">mins</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-caps text-label-caps text-outline uppercase">Pax Density</span>
                    <div className="font-telemetry-lg text-telemetry-lg text-secondary-fixed">
                      89% <span className="text-body-sm font-normal text-error">(High)</span>
                    </div>
                  </div>
                  <span className="px-space-xs py-1 rounded bg-primary-container/20 text-primary font-label-caps text-label-caps uppercase flex items-center gap-1 border border-primary/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>Peak Surge
                  </span>
                </div>
              </div>

              {/* Luminous Line Segment Tracker */}
              <div className="mt-space-md pt-space-xs">
                <div className="relative flex items-center justify-between py-space-xs">
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-surface-container-highest rounded"></div>
                  <div className="absolute left-0 w-5/6 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-primary/60 via-primary to-secondary rounded"></div>
                  {/* Stations */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-primary"></div>
                    <span className="font-label-caps text-label-caps text-on-surface mt-1">Nagole</span>
                    <span className="font-telemetry-sm text-[10px] text-on-surface-variant">Depot Feed</span>
                  </div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[9px] text-on-secondary">train</span>
                    </div>
                    <span className="font-label-caps text-label-caps text-secondary font-bold mt-1">Secunderabad</span>
                  </div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center shadow-[0_0_12px_rgba(147,204,255,0.6)]">
                      <span className="material-symbols-outlined text-[10px] text-on-primary">sync_alt</span>
                    </div>
                    <span className="font-label-caps text-label-caps text-primary font-bold mt-1">Ameerpet (X)</span>
                  </div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-surface-variant"></div>
                    <span className="font-label-caps text-label-caps text-on-surface-variant mt-1">Madhapur</span>
                  </div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-secondary-fixed flex items-center justify-center shadow-[0_0_14px_rgba(76,215,246,0.6)] animate-pulse">
                      <span className="material-symbols-outlined text-[10px] text-surface-container-lowest">
                        apartment
                      </span>
                    </div>
                    <span className="font-label-caps text-label-caps text-secondary-fixed font-bold mt-1">HITEC City</span>
                    <span className="font-telemetry-sm text-[10px] text-tertiary">Arr: Now, 3m</span>
                  </div>
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-primary"></div>
                    <span className="font-label-caps text-label-caps text-on-surface mt-1">Raidurg</span>
                    <span className="font-telemetry-sm text-[10px] text-on-surface-variant">Mindspace</span>
                  </div>
                </div>
              </div>

              <div className="mt-space-sm flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant bg-surface-container-low px-space-sm py-space-xs rounded border border-surface-container-high/20">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-[15px]">campaign</span>
                  <span>{blueAlertText}</span>
                </div>
                <span className="font-telemetry-sm text-telemetry-sm text-outline">TELEMETRY ID: HMR-C3-EXPRESS</span>
              </div>
            </div>

            {/* Corridor II: Green Line & Multimodal Bus Corridors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {/* Green Line */}
              <div className="rounded-xl bg-surface-container/70 backdrop-blur-md p-space-md shadow-md border border-surface-container-high/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="px-space-xs py-0.5 rounded bg-tertiary/20 text-tertiary font-label-caps text-label-caps uppercase font-bold border border-tertiary/20">
                      M-GRN
                    </span>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface">JBS Parade ↔ MGBS</h4>
                  </div>
                  <span className="font-label-caps text-label-caps px-space-xs py-0.5 rounded bg-tertiary/10 text-tertiary border border-tertiary/20">
                    Nominal
                  </span>
                </div>
                <div className="mt-space-sm grid grid-cols-3 gap-space-xs text-center font-telemetry-sm text-telemetry-sm">
                  <div className="bg-surface-container-low p-space-xs rounded">
                    <span className="text-outline block text-[10px]">HEADWAY</span>
                    <span className="text-on-surface font-semibold">6.0 min</span>
                  </div>
                  <div className="bg-surface-container-low p-space-xs rounded">
                    <span className="text-outline block text-[10px]">RAKES</span>
                    <span className="text-on-surface font-semibold">8 Units</span>
                  </div>
                  <div className="bg-surface-container-low p-space-xs rounded">
                    <span className="text-outline block text-[10px]">PAX DENSITY</span>
                    <span className="text-tertiary font-semibold">58%</span>
                  </div>
                </div>
                <div className="mt-space-sm font-body-sm text-body-sm text-on-surface-variant flex items-center justify-between">
                  <span>
                    Next MGBS arrivals: <strong className="text-primary font-telemetry-sm">1m, 7m</strong>
                  </span>
                  <span className="text-outline font-label-caps text-[10px]">11 KM · 9 STN</span>
                </div>
              </div>

              {/* TGSRTC Trunk Routes */}
              <div className="rounded-xl bg-surface-container/70 backdrop-blur-md p-space-md shadow-md border border-surface-container-high/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="px-space-xs py-0.5 rounded bg-secondary/20 text-secondary font-label-caps text-label-caps uppercase font-bold border border-secondary/20">
                      TGSRTC
                    </span>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface">10H & 222L Trunk Corridors</h4>
                  </div>
                  <span className="font-label-caps text-label-caps px-space-xs py-0.5 rounded bg-secondary-container/20 text-secondary border border-secondary/20">
                    84 Live
                  </span>
                </div>
                <div className="mt-space-sm grid grid-cols-3 gap-space-xs text-center font-telemetry-sm text-telemetry-sm">
                  <div className="bg-surface-container-low p-space-xs rounded">
                    <span className="text-outline block text-[10px]">AVG SPEED</span>
                    <span className="text-on-surface font-semibold">21 km/h</span>
                  </div>
                  <div className="bg-surface-container-low p-space-xs rounded">
                    <span className="text-outline block text-[10px]">BOTTLENECK</span>
                    <span className="text-error font-semibold">Begumpet</span>
                  </div>
                  <div className="bg-surface-container-low p-space-xs rounded">
                    <span className="text-outline block text-[10px]">FREQUENCY</span>
                    <span className="text-secondary font-semibold">4.5 min</span>
                  </div>
                </div>
                <div className="mt-space-sm font-body-sm text-body-sm text-on-surface-variant flex items-center justify-between">
                  <span>Sec'bad ↔ Kondapur & Patancheru</span>
                  <span className="text-tertiary font-label-caps text-[10px]">GTFS LIVE GPS</span>
                </div>
              </div>
            </div>

            {/* Pushpak Airport Liner Strip */}
            <div className="rounded-xl bg-surface-container-low/80 backdrop-blur-md p-space-md flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md border border-surface-container-high/30">
              <div className="flex items-center gap-space-md">
                <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0 text-secondary">
                  <span className="material-symbols-outlined text-[22px]">flight_takeoff</span>
                </div>
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-headline-sm text-headline-sm text-on-surface">
                      RGIA Pushpak Airport Liner
                    </span>
                    <span className="font-label-caps text-label-caps px-space-xs py-0.5 rounded bg-tertiary/20 text-tertiary border border-tertiary/20">
                      100% Punctual
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    48 AC Electric Luxury Coaches running via PVNR Elevated Expressway & ORR · 20-min headway
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-space-sm shrink-0">
                <div className="text-right">
                  <span className="font-label-caps text-label-caps text-outline uppercase block">
                    Next Pushpak Departure
                  </span>
                  <span className="font-telemetry-md text-telemetry-md text-tertiary font-semibold">
                    JBS: 4m · Shilparamam: 9m
                  </span>
                </div>
              </div>
            </div>

            {/* Station Crowd Density & Turnstile Load Telemetry */}
            <div className="rounded-xl bg-surface-container/70 backdrop-blur-md p-space-md shadow-md space-y-space-md border border-surface-container-high/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    Station Turnstile Telemetry & Hub Concourse Saturation
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Real-time gate ingress, escalator load, and passenger clearance dwell time
                  </p>
                </div>
                <span className="font-label-caps text-label-caps text-on-surface-variant bg-surface-container px-space-xs py-1 rounded">
                  5 HYD HUBS
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-sm">
                {/* Hub 1: Ameerpet */}
                <div className="bg-surface-container-low p-space-sm rounded-lg space-y-space-xs border border-surface-container-high/20">
                  <div className="flex justify-between items-center">
                    <span className="font-label-caps text-label-caps text-on-surface font-semibold">Ameerpet (X)</span>
                    <span className="font-telemetry-sm text-telemetry-sm text-secondary font-bold">82%</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: '82%' }}></div>
                  </div>
                  <div className="flex justify-between font-telemetry-sm text-[10px] text-on-surface-variant">
                    <span>142 pax/min</span>
                    <span className="text-tertiary">Wait: 1.5m</span>
                  </div>
                </div>

                {/* Hub 2: HITEC City */}
                <div className="bg-surface-container-low p-space-sm rounded-lg space-y-space-xs border border-surface-container-high/20">
                  <div className="flex justify-between items-center">
                    <span className="font-label-caps text-label-caps text-on-surface font-semibold">HITEC City</span>
                    <span className="font-telemetry-sm text-telemetry-sm text-error font-bold">88%</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                    <div className="bg-error h-full rounded-full transition-all duration-500" style={{ width: '88%' }}></div>
                  </div>
                  <div className="flex justify-between font-telemetry-sm text-[10px] text-on-surface-variant">
                    <span>Skywalk Busy</span>
                    <span className="text-error">Gates Aux +4</span>
                  </div>
                </div>

                {/* Hub 3: Secunderabad */}
                <div className="bg-surface-container-low p-space-sm rounded-lg space-y-space-xs border border-surface-container-high/20">
                  <div className="flex justify-between items-center">
                    <span className="font-label-caps text-label-caps text-on-surface font-semibold">Sec'bad Jct</span>
                    <span className="font-telemetry-sm text-telemetry-sm text-primary font-bold">79%</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: '79%' }}></div>
                  </div>
                  <div className="flex justify-between font-telemetry-sm text-[10px] text-on-surface-variant">
                    <span>IR + MMTS Int</span>
                    <span className="text-primary">Steady Flow</span>
                  </div>
                </div>

                {/* Hub 4: MGBS */}
                <div className="bg-surface-container-low p-space-sm rounded-lg space-y-space-xs border border-surface-container-high/20">
                  <div className="flex justify-between items-center">
                    <span className="font-label-caps text-label-caps text-on-surface font-semibold">MGBS IMLT</span>
                    <span className="font-telemetry-sm text-telemetry-sm text-tertiary font-bold">68%</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                    <div className="bg-tertiary h-full rounded-full transition-all duration-500" style={{ width: '68%' }}></div>
                  </div>
                  <div className="flex justify-between font-telemetry-sm text-[10px] text-on-surface-variant">
                    <span>Interstate Bus</span>
                    <span className="text-tertiary">Clear Concourse</span>
                  </div>
                </div>

                {/* Hub 5: Raidurg */}
                <div className="bg-surface-container-low p-space-sm rounded-lg space-y-space-xs border border-surface-container-high/20">
                  <div className="flex justify-between items-center">
                    <span className="font-label-caps text-label-caps text-on-surface font-semibold">Raidurg Hub</span>
                    <span className="font-telemetry-sm text-telemetry-sm text-secondary font-bold">74%</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: '74%' }}></div>
                  </div>
                  <div className="flex justify-between font-telemetry-sm text-[10px] text-on-surface-variant">
                    <span>Mindspace Out</span>
                    <span className="text-secondary">Egress Ok</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right 4 Columns: Interactive Disruption Radar & Simulation Controls */}
          <div className="xl:col-span-4 space-y-space-md">
            {/* Live Visual Radar Canvas Card */}
            <div className="rounded-xl bg-surface-container/70 backdrop-blur-md p-space-md shadow-md relative overflow-hidden border border-surface-container-high/30">
              <div className="flex items-center justify-between mb-space-sm">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-[20px]">radar</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Greater Hyderabad Live Radar</h3>
                </div>
                <span className="font-label-caps text-label-caps px-space-xs py-0.5 rounded bg-surface-container-high text-secondary border border-secondary/20">
                  360° SWEEP
                </span>
              </div>

              {/* Radar Viewport with SVG Scanning Visual */}
              <div className="relative w-full aspect-square rounded-xl bg-surface-container-lowest overflow-hidden flex items-center justify-center border border-surface-container-high/30">
                {/* Background Map Vector Context */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity pointer-events-none"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDsakIsG8pIf4V5YIwGP2JY9QWboCg5Q26P-gCL8wNmHaiv4wVHPS5j1UlTl6O2_pubeRptclVAJHnY_zQK57KSl0314NEDX4Gj26qj3M75Hwrvc82ZuUtB4XiwairSKUral6XSkWYEO63_kECD4vvYPEcXvrzJmKRjr_mLkexbJi_JwElXMqoKxjfw7eVl8LRLBa8RlDcIcE8GS6q5YD4LPyPlvapFCb3A7j_8kreH3W2PY2XHIr5w')`,
                  }}
                ></div>

                {/* SVG Radar Sweep and Transit Nodes */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
                  <defs>
                    <radialGradient cx="50%" cy="50%" id="radarSweep" r="50%">
                      <stop offset="0%" stopColor="#4cd7f6" stopOpacity="0.25"></stop>
                      <stop offset="70%" stopColor="#3198dc" stopOpacity="0.08"></stop>
                      <stop offset="100%" stopColor="#0a122a" stopOpacity="0"></stop>
                    </radialGradient>
                  </defs>

                  {/* Range Rings */}
                  <circle cx="200" cy="200" fill="none" opacity="0.6" r="170" stroke="#2c344d" strokeDasharray="4 4"></circle>
                  <circle cx="200" cy="200" fill="none" opacity="0.8" r="120" stroke="#2c344d" strokeDasharray="3 3"></circle>
                  <circle cx="200" cy="200" fill="none" opacity="0.5" r="70" stroke="#3f4850"></circle>
                  <circle cx="200" cy="200" fill="none" opacity="0.7" r="20" stroke="#4cd7f6"></circle>

                  {/* Radar Crosshairs */}
                  <line opacity="0.5" stroke="#2c344d" strokeWidth="1" x1="20" x2="380" y1="200" y2="200"></line>
                  <line opacity="0.5" stroke="#2c344d" strokeWidth="1" x1="200" x2="200" y1="20" y2="380"></line>

                  {/* Rotating Scanning Wedge */}
                  <g className="radar-sweep-anim">
                    <path d="M 200 200 L 380 200 A 180 180 0 0 0 327 72 Z" fill="url(#radarSweep)"></path>
                    <line opacity="0.8" stroke="#4cd7f6" strokeWidth="1.5" x1="200" x2="380" y1="200" y2="200"></line>
                  </g>

                  {/* Live Dynamic Blips */}
                  {/* Ameerpet */}
                  <g transform="translate(190, 185)">
                    <circle className="animate-pulse" fill="#4cd7f6" r="5"></circle>
                    <circle fill="none" opacity="0.5" r="12" stroke="#4cd7f6" strokeWidth="0.75"></circle>
                    <text fill="#dbe1ff" fontFamily="JetBrains Mono" fontSize="9" fontWeight="600" x="8" y="4">
                      AMP (Hub)
                    </text>
                  </g>

                  {/* HITEC City */}
                  <g transform="translate(115, 230)">
                    <circle className="animate-pulse" fill="#93ccff" r="5.5"></circle>
                    <circle fill="none" opacity="0.5" r="14" stroke="#93ccff" strokeWidth="0.75"></circle>
                    <text fill="#93ccff" fontFamily="JetBrains Mono" fontSize="9" fontWeight="600" x="9" y="4">
                      HITEC
                    </text>
                  </g>

                  {/* Secunderabad */}
                  <g transform="translate(265, 145)">
                    <circle className="animate-pulse" fill="#4edea3" r="5"></circle>
                    <text fill="#4edea3" fontFamily="JetBrains Mono" fontSize="9" fontWeight="600" x="8" y="4">
                      SC JCT
                    </text>
                  </g>

                  {/* RGIA Corridor Point */}
                  <g transform="translate(220, 320)">
                    <circle fill="#acedff" r="4"></circle>
                    <text fill="#bfc7d2" fontFamily="JetBrains Mono" fontSize="8" x="8" y="4">
                      PVNR EXPRESS
                    </text>
                  </g>
                </svg>

                {/* Bottom Floating Radar Coordinates Badge */}
                <div className="absolute bottom-2 left-2 right-2 bg-surface-container-lowest/80 backdrop-blur-md px-space-xs py-1 rounded flex items-center justify-between font-label-caps text-[9px] text-on-surface-variant border border-surface-container-high/30">
                  <span>LAT: 17.3850° N</span>
                  <span>LON: 78.4867° E</span>
                  <span className="text-tertiary">RADIUS: 35 KM</span>
                </div>
              </div>
            </div>

            {/* Disruption Injection Console */}
            <div className="rounded-xl bg-surface-container/70 backdrop-blur-md p-space-md shadow-md space-y-space-md border border-surface-container-high/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-error text-[20px]">bolt</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">AI Disruption Simulator</h3>
                </div>
                <span className="font-label-caps text-label-caps text-outline bg-surface-container px-space-xs py-0.5 rounded border border-surface-container-high">
                  DYNAMIC LOAD SHIFT
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Trigger scenario stress-tests to preview how the HMUMA AI auto-redistributes feeder buses, adjusts
                headways, and reroutes passengers in real time.
              </p>

              {/* Interactive Action Buttons */}
              <div className="grid grid-cols-1 gap-space-xs">
                <button
                  onClick={() => handleInjectDisruption('signal_begumpet')}
                  className={`w-full text-left p-space-sm rounded-lg transition-all flex items-start gap-space-sm cursor-pointer border ${
                    activeSimulation === 'signal_begumpet'
                      ? 'bg-secondary-container/20 border-secondary'
                      : 'bg-surface-container-high hover:bg-surface-bright border-surface-container-highest'
                  }`}
                >
                  <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5">traffic</span>
                  <div>
                    <span className="font-headline-sm text-headline-sm text-on-surface block text-[13px] leading-tight">
                      Simulate Signal Delay at Begumpet
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">
                      Corridor III Blue line interlock delay (+4 min auto headway shift)
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => handleInjectDisruption('rain_malakpet')}
                  className={`w-full text-left p-space-sm rounded-lg transition-all flex items-start gap-space-sm cursor-pointer border ${
                    activeSimulation === 'rain_malakpet'
                      ? 'bg-primary-container/20 border-primary'
                      : 'bg-surface-container-high hover:bg-surface-bright border-surface-container-highest'
                  }`}
                >
                  <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">flood</span>
                  <div>
                    <span className="font-headline-sm text-headline-sm text-on-surface block text-[13px] leading-tight">
                      Simulate Waterlogging at Malakpet
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">
                      Divert 32 TGSRTC buses onto Chaderghat alternate loop
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => handleInjectDisruption('rake_miyapur')}
                  className={`w-full text-left p-space-sm rounded-lg transition-all flex items-start gap-space-sm cursor-pointer border ${
                    activeSimulation === 'rake_miyapur'
                      ? 'bg-tertiary-container/20 border-tertiary'
                      : 'bg-surface-container-high hover:bg-surface-bright border-surface-container-highest'
                  }`}
                >
                  <span className="material-symbols-outlined text-tertiary text-[20px] mt-0.5">build</span>
                  <div>
                    <span className="font-headline-sm text-headline-sm text-on-surface block text-[13px] leading-tight">
                      Simulate Rake Maintenance at Miyapur
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">
                      Hot standby deployment from Uppal depot in 180 seconds
                    </span>
                  </div>
                </button>
              </div>

              {activeSimulation && (
                <div className="p-space-sm rounded-lg bg-secondary-container/20 text-on-surface space-y-space-xs border border-secondary/30">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-secondary uppercase font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">psychology</span> AI DYNAMIC RECOVERY ACTIVE
                    </span>
                    <button
                      onClick={handleResetSimulation}
                      className="font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface underline cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                  <p className="font-body-sm text-body-sm text-secondary-fixed text-[12px] leading-snug">
                    {activeSimulation === 'signal_begumpet' &&
                      'AI Alert: Signal bottleneck at Begumpet. Blue Line headways temporarily modulated to 4.2m. Auto-dispatching 8 TGSRTC feeder shuttles along Inner Ring Road.'}
                    {activeSimulation === 'rain_malakpet' &&
                      'AI Alert: Waterlogging detected at Malakpet ROB. 32 TGSRTC buses rerouted via Chaderghat bridge. Passenger alert triggered on Hyderabad Transit App.'}
                    {activeSimulation === 'rake_miyapur' &&
                      'AI Alert: Miyapur Rake #14 undergoing emergency pantograph check. Standby Rake #29 rolled out from Uppal depot in 140s.'}
                  </p>
                </div>
              )}
            </div>

            {/* Real-Time Disruption Ticker Log */}
            <div className="rounded-xl bg-surface-container/70 backdrop-blur-md p-space-md shadow-md space-y-space-sm border border-surface-container-high/30">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-primary">feed</span>
                  Live Incident Log Feed
                </span>
                <span className="font-telemetry-sm text-[10px] text-tertiary">FEED 100% ACTIVE</span>
              </div>
              <div className="space-y-space-xs font-telemetry-sm text-telemetry-sm max-h-56 overflow-y-auto no-scrollbar">
                {incidentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-space-xs rounded bg-surface-container-low flex items-start gap-space-xs border-l-2 border-secondary"
                  >
                    <span className="text-secondary shrink-0 font-bold">{log.time}</span>
                    <span className="text-on-surface-variant">{log.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
