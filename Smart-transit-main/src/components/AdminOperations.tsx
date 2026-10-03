import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import { TabType } from './Header';

interface AdminOperationsProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenPushpak: () => void;
  onOpenSos: () => void;
}

export const AdminOperations: React.FC<AdminOperationsProps> = ({
  onNavigateTab,
  onOpenPushpak,
  onOpenSos,
}) => {
  const { assets, updateAssetAction, addIncidentLog, showToast, isSimulatedJam } = useTransit();

  const [targetCorridor, setTargetCorridor] = useState('Corridor III: Blue Line (Nagole - Raidurg)');
  const [severity, setSeverity] = useState('Minor Delay');
  const [delayEst, setDelayEst] = useState('15 mins buffer');
  const [affectedSector, setAffectedSector] = useState('Begumpet Interchange');
  const [bulletinText, setBulletinText] = useState(
    'Corridor III: 8-min headway regulation in effect at Begumpet. Commuters advised to utilize Ameerpet transfer or TGSRTC Electric Feeder 10H.'
  );
  const [dispatchFeedback, setDispatchFeedback] = useState<string | null>(null);
  const [showProtocolModal, setShowProtocolModal] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'delayed'>('all');

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    const timeNow = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    addIncidentLog({
      time: timeNow,
      type: severity.includes('Suspension') || severity.includes('Major') ? 'warning' : 'info',
      text: `BROADCAST [${targetCorridor} - ${affectedSector}]: ${bulletinText}`,
      corridor: targetCorridor,
    });
    setDispatchFeedback(`Advisory successfully transmitted to 42,910 commuter terminals (${affectedSector}).`);
    showToast(`Broadcast sent to ${affectedSector} corridor display network.`);
    setTimeout(() => {
      setDispatchFeedback(null);
    }, 4500);
  };

  const handleTriggerAiReroute = () => {
    setDispatchFeedback('AI Engine: Dynamic alternative routing patterns injected into TGSRTC feeder matrix.');
    showToast('AI Dynamic Reroute Engine engaged across Greater Hyderabad grid.');
    const timeNow = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    addIncidentLog({
      time: timeNow,
      type: 'info',
      text: `AI REROUTE DISPATCH: Dynamic loop balancing enabled for ${affectedSector}.`,
      corridor: 'AI Dispatch',
    });
    setTimeout(() => {
      setDispatchFeedback(null);
    }, 4500);
  };

  const handleResetTemplate = () => {
    setBulletinText(
      'Corridor III: 8-min headway regulation in effect at Begumpet. Commuters advised to utilize Ameerpet transfer or TGSRTC Electric Feeder 10H.'
    );
  };

  const displayedAssets =
    filterMode === 'delayed'
      ? assets.filter((a) => a.driftStatus === 'delay' || a.loadFactor > 80)
      : assets;

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-background">
      {/* OCC Specialized Sidebar */}
      <aside className="w-full lg:w-72 bg-surface-container-lowest border-r border-[#2c344d]/40 flex flex-col pt-4 pb-6 shadow-xl shrink-0">
        <div className="px-6 pb-6 flex items-center gap-space-sm border-b border-[#2c344d]/30">
          <div className="w-3 h-3 rounded-full bg-tertiary animate-pulse"></div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-on-surface">OCC CONTROL</span>
            <span className="font-label-caps text-label-caps text-secondary">CYBERABAD METRO HUB</span>
          </div>
        </div>

        <div className="px-6 py-3 mb-4 bg-surface-container-low/60 border-b border-[#2c344d]/30">
          <div className="font-label-caps text-label-caps text-outline">CONTROLLER SESSION</div>
          <div className="font-telemetry-sm text-telemetry-sm text-tertiary">OFFICER: HMR-DISP-409</div>
          <div className="font-telemetry-sm text-telemetry-sm text-on-surface-variant">BAND: SECURE-RT-NET 04</div>
        </div>

        <nav className="flex-1 px-4 space-y-space-xs overflow-y-auto">
          <div className="px-2 py-1 font-label-caps text-label-caps text-outline uppercase">Corridor Navigation</div>
          <button
            onClick={() => onNavigateTab('multimodal-journey-planner')}
            className="w-full flex items-center gap-space-sm px-4 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all text-left text-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">alt_route</span>
            Multimodal Journey Planner
          </button>
          <button
            onClick={() => onNavigateTab('live-transit-network-status')}
            className="w-full flex items-center gap-space-sm px-4 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all text-left text-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">radar</span>
            Live Transit Network Status
          </button>
          <button
            onClick={() => onNavigateTab('mobility-and-green-analytics')}
            className="w-full flex items-center gap-space-sm px-4 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all text-left text-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">eco</span>
            Mobility & Green Analytics
          </button>
          <button
            className="w-full flex items-center gap-space-sm px-4 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-semibold transition-all text-left text-sm shadow-[0_0_12px_rgba(49,152,220,0.35)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">shield</span>
            Admin Transit Operations
          </button>

          <div className="pt-4 px-2 py-1 font-label-caps text-label-caps text-outline uppercase">Specialized Fleets</div>
          <button
            onClick={onOpenPushpak}
            className="w-full flex items-center gap-space-sm px-4 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all text-left text-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">flight_takeoff</span>
            Airport Express Pushpak
          </button>
          <button
            onClick={onOpenSos}
            className="w-full flex items-center gap-space-sm px-4 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all text-left text-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">e911_emergency</span>
            SOS Fleet Coordination
          </button>
        </nav>

        <div className="px-4 pt-4 mt-auto border-t border-surface-container-high/40">
          <div className="bg-surface-container p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
              <span className="font-telemetry-sm text-telemetry-sm text-on-surface">OCC Node: Active</span>
            </div>
            <span className="font-label-caps text-label-caps text-primary">TG-TEL</span>
          </div>
        </div>
      </aside>

      {/* Main Operations Console Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-4 md:px-margin-desktop py-space-lg flex flex-col gap-space-lg">
          {/* Mission Control Header Banner */}
          <div className="bg-surface-container-low rounded-xl p-space-lg shadow-xl relative overflow-hidden border border-surface-container-high/30">
            <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent blur-3xl pointer-events-none"></div>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md relative z-10">
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center gap-space-sm flex-wrap">
                  <span className="px-space-xs py-0.5 rounded bg-tertiary-container text-on-tertiary font-label-caps text-label-caps uppercase tracking-wider font-bold">
                    LIVE TELEMETRY
                  </span>
                  <span className="font-telemetry-sm text-telemetry-sm text-on-surface-variant font-medium tracking-wide">
                    TELANGANA UNIFIED TRANSIT OCC • SHIFT 01 ACTIVE
                  </span>
                  <span className="font-telemetry-sm text-telemetry-sm text-outline">|</span>
                  <span className="font-telemetry-sm text-telemetry-sm text-secondary font-semibold">
                    ID: HMRL-OCC-902
                  </span>
                </div>
                <div className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  Mission Control & Unified Dispatch Stream
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Real-time SCADA circuit interlocking, cross-modal telemetry feeds, and dynamic commuter advisory
                  broadcasting for Cyberabad Hub.
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-space-sm">
                <div className="flex items-center gap-space-xs bg-surface-container px-space-md py-space-sm rounded-lg shadow-sm border border-tertiary/20">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-ping"></span>
                  <div className="flex flex-col">
                    <span className="font-label-caps text-label-caps text-outline">GTFS-RT SYNC</span>
                    <span className="font-telemetry-sm text-telemetry-sm text-tertiary font-semibold">100% Online</span>
                  </div>
                </div>

                <div className="flex items-center gap-space-xs bg-surface-container px-space-md py-space-sm rounded-lg shadow-sm border border-secondary/20">
                  <span className="material-symbols-outlined text-secondary text-[18px]">cell_tower</span>
                  <div className="flex flex-col">
                    <span className="font-label-caps text-label-caps text-outline">VHF DISPATCH</span>
                    <span className="font-telemetry-sm text-telemetry-sm text-on-surface font-semibold">CH-04 Clear</span>
                  </div>
                </div>

                <div className="flex items-center gap-space-xs bg-surface-container px-space-md py-space-sm rounded-lg shadow-sm border border-primary/20">
                  <span className="material-symbols-outlined text-primary text-[18px]">bolt</span>
                  <div className="flex flex-col">
                    <span className="font-label-caps text-label-caps text-outline">SCADA GRID</span>
                    <span className="font-telemetry-sm text-telemetry-sm text-primary font-semibold">25kV OHE Nom</span>
                  </div>
                </div>

                <button
                  onClick={() => showToast('Force SCADA Interlocking Sync executed across all 3 corridors.')}
                  className="flex items-center justify-center p-space-sm rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-bright transition-all shadow-sm cursor-pointer border border-surface-container-highest"
                  title="Force Interlocking Sync"
                >
                  <span className="material-symbols-outlined text-[20px]">sync</span>
                </button>
              </div>
            </div>
          </div>

          {/* Central Operations Split: Grid Table vs Right Incident Dispatcher */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg">
            {/* Left 8 Cols */}
            <div className="xl:col-span-8 flex flex-col gap-space-lg">
              {/* Active Corridor Asset Grid */}
              <div className="bg-surface-container-low rounded-xl shadow-xl overflow-hidden flex flex-col border border-surface-container-high/30">
                <div className="p-space-lg bg-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-space-md border-b border-surface-container-high/40">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-2 h-6 bg-primary rounded-full"></div>
                    <div>
                      <span className="font-headline-sm text-headline-sm text-on-surface">Active Corridor Asset Grid</span>
                      <span className="font-telemetry-sm text-telemetry-sm text-on-surface-variant block">
                        SCADA Connected • Automatic Train Supervision (ATS)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-label-caps text-label-caps px-space-sm py-1 bg-surface-container-high text-secondary rounded-lg border border-secondary/20">
                      {displayedAssets.length} MONITORED UNITS
                    </span>
                    <button
                      onClick={() => setFilterMode(filterMode === 'all' ? 'delayed' : 'all')}
                      className={`px-space-md py-space-xs rounded-lg font-label-md text-label-md transition-colors flex items-center gap-1 cursor-pointer border ${
                        filterMode === 'delayed'
                          ? 'bg-secondary text-on-secondary border-secondary'
                          : 'bg-surface-container-highest text-on-surface hover:bg-surface-bright border-surface-container-high'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">tune</span>
                      {filterMode === 'delayed' ? 'Showing High Load/Delay' : 'Filter Delayed'}
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[780px]">
                    <thead>
                      <tr className="bg-surface-container-lowest text-on-surface-variant font-label-caps text-label-caps uppercase border-b border-surface-container-high/30">
                        <th className="py-space-md px-space-lg">Line / Unit ID</th>
                        <th className="py-space-md px-space-md">Model & Config</th>
                        <th className="py-space-md px-space-md">Geofence Sector</th>
                        <th className="py-space-md px-space-md">Headway Drift</th>
                        <th className="py-space-md px-space-md">Load Factor</th>
                        <th className="py-space-md px-space-md">SCADA Health</th>
                        <th className="py-space-md px-space-lg text-right">Quick Dispatch</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-high/20 text-on-surface font-body-sm text-body-sm">
                      {displayedAssets.map((asset) => {
                        const lineBg =
                          asset.line === 'BLUE'
                            ? 'bg-primary'
                            : asset.line === 'RED'
                            ? 'bg-error'
                            : asset.line === 'BUS'
                            ? 'bg-error'
                            : 'bg-tertiary';

                        const driftBadge =
                          asset.driftStatus === 'nominal'
                            ? 'bg-tertiary-container text-on-tertiary'
                            : asset.driftStatus === 'delay'
                            ? 'bg-error-container text-on-error'
                            : 'bg-surface-container text-primary';

                        return (
                          <tr key={asset.id} className="hover:bg-surface-container/60 transition-colors group">
                            <td className="py-space-md px-space-lg">
                              <div className="flex items-center gap-space-sm">
                                <div className={`w-1.5 h-8 ${lineBg} rounded-full`}></div>
                                <div className="flex flex-col">
                                  <span className="font-telemetry-md text-telemetry-md font-bold text-primary">
                                    {asset.code}
                                  </span>
                                  <span className="font-label-caps text-label-caps text-outline">
                                    {asset.line === 'BLUE'
                                      ? 'HYD METRO BLUE'
                                      : asset.line === 'RED'
                                      ? 'HYD METRO RED'
                                      : asset.line === 'BUS'
                                      ? 'TGSRTC E-BUS'
                                      : 'SCR SUBURBAN'}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md">
                              <div className="flex flex-col">
                                <span className="font-body-md text-body-md text-on-surface font-medium">
                                  {asset.model}
                                </span>
                                <span className="font-label-caps text-label-caps text-on-surface-variant">
                                  {asset.config}
                                </span>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md">
                              <div className="flex items-center gap-space-xs text-on-surface">
                                <span className="material-symbols-outlined text-secondary text-[16px]">navigation</span>
                                <span className="font-telemetry-sm text-telemetry-sm">{asset.sector}</span>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md">
                              <span className={`px-space-xs py-0.5 rounded font-telemetry-sm text-telemetry-sm font-semibold ${driftBadge}`}>
                                {asset.headwayDrift}
                              </span>
                            </td>
                            <td className="py-space-md px-space-md">
                              <div className="flex flex-col gap-1 w-24">
                                <div className="flex justify-between font-label-caps text-label-caps">
                                  <span
                                    className={
                                      asset.loadFactor > 85
                                        ? 'text-error font-bold'
                                        : asset.loadFactor > 60
                                        ? 'text-secondary font-bold'
                                        : 'text-tertiary font-bold'
                                    }
                                  >
                                    {asset.loadFactor}%
                                  </span>
                                  <span className="text-outline">
                                    {asset.loadFactor > 85 ? 'CRITICAL' : asset.loadFactor > 75 ? 'CROWDED' : 'NOMINAL'}
                                  </span>
                                </div>
                                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      asset.loadFactor > 85
                                        ? 'bg-error'
                                        : asset.loadFactor > 70
                                        ? 'bg-secondary'
                                        : 'bg-tertiary'
                                    }`}
                                    style={{ width: `${asset.loadFactor}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="py-space-md px-space-md">
                              <div className="flex items-center gap-1 font-telemetry-sm text-telemetry-sm text-tertiary">
                                <span className="material-symbols-outlined text-[14px]">
                                  {asset.scadaHealth === 'battery' ? 'battery_charging_full' : 'electric_bolt'}
                                </span>
                                <span>{asset.scadaStatus}</span>
                              </div>
                            </td>
                            <td className="py-space-md px-space-lg text-right">
                              {asset.line === 'BLUE' && (
                                <button
                                  onClick={() => updateAssetAction(asset.code, 'Signal Priority Granted at Ameerpet')}
                                  className="px-space-sm py-1 rounded bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-all shadow-sm cursor-pointer"
                                >
                                  Signal Priority
                                </button>
                              )}
                              {asset.line === 'BUS' && (
                                <button
                                  onClick={() => updateAssetAction(asset.code, 'Rerouted to Outer Slip Road via Punjagutta')}
                                  className="px-space-sm py-1 rounded bg-surface-container-high text-secondary font-label-md text-label-md hover:bg-surface-bright transition-all shadow-sm cursor-pointer border border-secondary/30"
                                >
                                  Reroute Bus
                                </button>
                              )}
                              {asset.line === 'MMTS' && (
                                <button
                                  onClick={() => updateAssetAction(asset.code, 'Rake Held for 90s for Corridor Synchronization')}
                                  className="px-space-sm py-1 rounded bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-bright transition-all shadow-sm cursor-pointer border border-surface-container-highest"
                                >
                                  Hold Rake
                                </button>
                              )}
                              {asset.line === 'RED' && (
                                <button
                                  onClick={() => updateAssetAction(asset.code, 'Commuter Concourse Advisory Sent')}
                                  className="px-space-sm py-1 rounded bg-surface-container-high text-primary font-label-md text-label-md hover:bg-surface-bright transition-all shadow-sm cursor-pointer border border-primary/30"
                                >
                                  Commuter Alert
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sub 2-col analytics: AFC Turnstile Flow & PEB Monitor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                {/* AFC Turnstile Flow */}
                <div className="bg-surface-container-low rounded-xl p-space-lg shadow-xl flex flex-col justify-between border border-surface-container-high/30">
                  <div className="flex items-center justify-between mb-space-md">
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-primary text-[22px]">contactless</span>
                      <span className="font-headline-sm text-headline-sm text-on-surface">AFC Turnstile Flow</span>
                    </div>
                    <span className="font-telemetry-sm text-telemetry-sm text-tertiary font-bold">14,280 taps/hr</span>
                  </div>

                  <div className="relative h-28 w-full flex items-end">
                    <svg className="w-full h-full overflow-visible text-primary" preserveAspectRatio="none" viewBox="0 0 300 80">
                      <path
                        d="M0 60 Q 40 40, 80 50 T 160 30 T 220 15 T 300 25"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      ></path>
                      <path
                        d="M0 60 Q 40 40, 80 50 T 160 30 T 220 15 T 300 25 L 300 80 L 0 80 Z"
                        fill="currentColor"
                        fillOpacity="0.08"
                      ></path>
                      <circle className="fill-secondary animate-pulse" cx="220" cy="15" r="4.5"></circle>
                    </svg>
                  </div>

                  <div className="flex justify-between items-center pt-space-sm font-label-caps text-label-caps text-on-surface-variant border-t border-surface-container-high/20">
                    <span>12:00</span>
                    <span>13:30</span>
                    <span>15:00</span>
                    <span className="text-secondary font-bold">16:42 (PEAK HITEC)</span>
                  </div>
                </div>

                {/* PEB Monitor Node */}
                <div className="bg-surface-container-low rounded-xl p-space-lg shadow-xl flex flex-col justify-between border border-surface-container-high/30">
                  <div className="flex items-center justify-between mb-space-md">
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-error text-[22px]">emergency</span>
                      <span className="font-headline-sm text-headline-sm text-on-surface">PEB Monitor Node</span>
                    </div>
                    <span className="px-space-xs py-0.5 rounded bg-tertiary-container text-on-tertiary font-label-caps text-label-caps">
                      ALL CHANNELS NORMAL
                    </span>
                  </div>

                  <div className="space-y-space-xs py-space-xs">
                    <div className="p-space-sm rounded-lg bg-surface-container flex items-center justify-between border border-surface-container-high/30">
                      <div className="flex items-center gap-space-xs">
                        <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                        <span className="font-body-sm text-body-sm text-on-surface">Begumpet Platform 1 Box #03</span>
                      </div>
                      <span className="font-telemetry-sm text-telemetry-sm text-on-surface-variant">Standby</span>
                    </div>
                    <div className="p-space-sm rounded-lg bg-surface-container flex items-center justify-between border border-surface-container-high/30">
                      <div className="flex items-center gap-space-xs">
                        <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                        <span className="font-body-sm text-body-sm text-on-surface">Ameerpet Concourse Interlock #01</span>
                      </div>
                      <span className="font-telemetry-sm text-telemetry-sm text-on-surface-variant">Standby</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-space-xs border-t border-surface-container-high/20">
                    <span className="font-label-caps text-label-caps text-outline">SCADA AUDIO LINE 09</span>
                    <span className="font-telemetry-sm text-telemetry-sm text-primary flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[14px]">graphic_eq</span> 0 active calls
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Spatial Radar + Incident Dispatcher Form */}
            <div className="xl:col-span-4 flex flex-col gap-space-lg">
              {/* Spatial Platform Radar */}
              <div className="bg-surface-container-low rounded-xl p-space-lg shadow-xl flex flex-col relative overflow-hidden border border-surface-container-high/30">
                <div className="flex items-center justify-between mb-space-md">
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-secondary text-[22px]">radar</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface">Spatial Platform Radar</span>
                  </div>
                  <span className="font-label-caps text-label-caps text-tertiary animate-pulse">LIVE TRACKING</span>
                </div>

                <div className="relative w-full h-52 bg-surface-container-lowest rounded-xl overflow-hidden flex items-center justify-center p-space-sm border border-surface-container-high/40">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full border border-surface-container/20"></div>
                    <div className="w-32 h-32 rounded-full border border-surface-container/40 absolute"></div>
                    <div className="w-16 h-16 rounded-full border border-surface-container/60 absolute"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-surface-container-high/40"></div>
                    <div className="h-full w-0.5 bg-surface-container-high/40 absolute"></div>
                  </div>

                  {/* Blip HM-BL-014 */}
                  <div
                    onClick={() => showToast('Tracking Blue Line Trainset HM-BL-014 near Ameerpet')}
                    className="absolute top-1/4 left-1/3 flex flex-col items-center group cursor-pointer"
                  >
                    <span className="w-3 h-3 rounded-full bg-primary animate-ping absolute"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-primary relative"></span>
                    <span className="font-label-caps text-label-caps text-on-surface bg-surface-container-high px-1 rounded mt-1 shadow border border-primary/30">
                      HM-BL-014
                    </span>
                  </div>

                  {/* Jam alert Begumpet */}
                  {isSimulatedJam && (
                    <div
                      onClick={() => showToast('Surface Roadblock at Begumpet Flyover (+19m delay)')}
                      className="absolute bottom-1/3 right-1/4 flex flex-col items-center group cursor-pointer"
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-error animate-pulse absolute"></span>
                      <span className="w-3 h-3 rounded-full bg-error relative"></span>
                      <span className="font-label-caps text-label-caps bg-error-container text-on-error px-1 rounded mt-1 shadow font-bold border border-error">
                        JAM: BEGUMPET
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 bg-surface-container-low/90 backdrop-blur-md p-space-xs rounded-lg shadow-sm border border-surface-container-high/30">
                    <span className="font-label-caps text-label-caps text-secondary block">CORRIDOR RADIUS</span>
                    <span className="font-telemetry-sm text-telemetry-sm text-on-surface font-semibold">5.8 KM COVERAGE</span>
                  </div>
                </div>

                <div className="mt-space-md p-space-sm bg-surface-container rounded-lg flex items-center justify-between border border-surface-container-high/30">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-error text-[18px]">warning</span>
                    <span className="font-body-sm text-body-sm text-on-surface">Crowd density hotspot: Begumpet N</span>
                  </div>
                  <span className="font-label-caps text-label-caps text-error bg-error-container/20 px-space-xs py-0.5 rounded border border-error/30 font-bold">
                    LVL 4
                  </span>
                </div>
              </div>

              {/* Incident Dispatcher Form */}
              <div className="bg-surface-container-low rounded-xl p-space-lg shadow-xl flex flex-col gap-space-md border border-surface-container-high/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-secondary-fixed-dim text-[22px]">campaign</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface">Incident Dispatcher</span>
                  </div>
                  <span className="font-label-caps text-label-caps text-outline bg-surface-container px-2 py-0.5 rounded">
                    SECURE BUS
                  </span>
                </div>

                <form onSubmit={handleBroadcast} className="flex flex-col gap-space-md">
                  <div className="flex flex-col gap-1">
                    <label className="font-label-caps text-label-caps text-on-surface-variant">
                      TARGET CORRIDOR / SERVICE
                    </label>
                    <select
                      value={targetCorridor}
                      onChange={(e) => setTargetCorridor(e.target.value)}
                      className="bg-surface-container-lowest text-on-surface font-body-sm text-body-sm p-space-sm rounded-lg border border-surface-container-high/40 focus:outline-none focus:border-primary transition-all cursor-pointer"
                    >
                      <option value="Corridor III: Blue Line (Nagole - Raidurg)">Corridor III: Blue Line (Nagole - Raidurg)</option>
                      <option value="Corridor I: Red Line (Miyapur - LB Nagar)">Corridor I: Red Line (Miyapur - LB Nagar)</option>
                      <option value="TGSRTC 10H (Secunderabad - Kondapur)">TGSRTC Feeder 10H (Secunderabad - Kondapur)</option>
                      <option value="Airport Pushpak (RGIA Express Fleet)">Airport Pushpak (RGIA Express Fleet)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-space-sm">
                    <div className="flex flex-col gap-1">
                      <label className="font-label-caps text-label-caps text-on-surface-variant">SEVERITY LEVEL</label>
                      <select
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value)}
                        className="bg-surface-container-lowest text-on-surface font-body-sm text-body-sm p-space-sm rounded-lg border border-surface-container-high/40 focus:outline-none focus:border-primary transition-all cursor-pointer"
                      >
                        <option value="Minor Delay">🟡 Minor Delay</option>
                        <option value="Normal Advisory">🟢 Normal Advisory</option>
                        <option value="Major Diversion">🟠 Major Diversion</option>
                        <option value="Corridor Suspension">🔴 Suspension</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-label-caps text-label-caps text-on-surface-variant">DELAY ESTIMATION</label>
                      <select
                        value={delayEst}
                        onChange={(e) => setDelayEst(e.target.value)}
                        className="bg-surface-container-lowest text-on-surface font-body-sm text-body-sm p-space-sm rounded-lg border border-surface-container-high/40 focus:outline-none focus:border-primary transition-all cursor-pointer"
                      >
                        <option value="5 mins buffer">5 mins buffer</option>
                        <option value="15 mins buffer">15 mins buffer</option>
                        <option value="30+ mins critical">30+ mins critical</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-label-caps text-label-caps text-on-surface-variant">AFFECTED SECTOR</label>
                    <select
                      value={affectedSector}
                      onChange={(e) => setAffectedSector(e.target.value)}
                      className="bg-surface-container-lowest text-on-surface font-body-sm text-body-sm p-space-sm rounded-lg border border-surface-container-high/40 focus:outline-none focus:border-primary transition-all cursor-pointer"
                    >
                      <option value="Begumpet Interchange">Begumpet Interchange</option>
                      <option value="Ameerpet Junction Node">Ameerpet Junction Node</option>
                      <option value="HITEC City Terminal">HITEC City Terminal</option>
                      <option value="Secunderabad East / West">Secunderabad East / West</option>
                      <option value="MGBS Central Hub">MGBS Central Hub</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <label className="font-label-caps text-label-caps text-on-surface-variant">COMMUTER PUSH BULLETIN</label>
                      <button
                        type="button"
                        onClick={handleResetTemplate}
                        className="font-label-caps text-label-caps text-primary cursor-pointer hover:underline"
                      >
                        Reset Template
                      </button>
                    </div>
                    <textarea
                      value={bulletinText}
                      onChange={(e) => setBulletinText(e.target.value)}
                      rows={3}
                      className="bg-surface-container-lowest text-on-surface font-telemetry-sm text-telemetry-sm p-space-sm rounded-lg border border-surface-container-high/40 focus:outline-none focus:border-primary transition-all resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-space-xs pt-space-xs">
                    <button
                      type="submit"
                      className="w-full py-space-sm px-space-md rounded-lg bg-primary text-on-primary font-headline-sm text-headline-sm hover:bg-primary-container transition-all flex items-center justify-center gap-space-xs shadow-md cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">cell_tower</span>
                      <span>Broadcast Commuter Bulletin</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleTriggerAiReroute}
                      className="w-full py-space-sm px-space-md rounded-lg bg-surface-container-high text-secondary font-label-md text-label-md hover:bg-surface-bright transition-all flex items-center justify-center gap-space-xs shadow-sm cursor-pointer border border-secondary/30"
                    >
                      <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                      <span>Trigger AI Dynamic Reroute Engine</span>
                    </button>
                  </div>
                </form>

                {dispatchFeedback && (
                  <div className="p-space-sm rounded-lg bg-tertiary-container text-on-tertiary font-telemetry-sm text-telemetry-sm flex items-center gap-space-xs animate-fadeIn border border-tertiary">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>{dispatchFeedback}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Integrated Emergency Interlock Network (IEIN) Bottom Bar */}
          <div className="bg-surface-container-low rounded-xl p-space-lg shadow-xl flex flex-col md:flex-row items-center justify-between gap-space-md border border-surface-container-high/30">
            <div className="flex items-center gap-space-md">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/30">
                <span className="material-symbols-outlined text-[24px]">security</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface">
                  Integrated Emergency Interlock Network (IEIN)
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Connected to Hyderabad Traffic Police (Cyberabad Command), SDRF Emergency Response, and HMR Station Master Consoles.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-space-sm shrink-0">
              <span className="font-label-caps text-label-caps text-outline bg-surface-container px-2 py-1 rounded">
                CIRCUIT: INTEGRATED-OCC-TG
              </span>
              <button
                onClick={() => setShowProtocolModal(true)}
                className="px-space-md py-space-xs rounded-lg bg-surface-container-highest text-on-surface font-label-md text-label-md hover:bg-surface-bright transition-colors cursor-pointer border border-surface-container-high"
              >
                Protocol Manual
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Manual Modal */}
      {showProtocolModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container rounded-xl max-w-xl w-full p-6 border border-primary/30 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">menu_book</span>
                <h3 className="font-headline-md text-headline-md text-on-surface">IEIN Standard Operating Protocol</h3>
              </div>
              <button
                onClick={() => setShowProtocolModal(false)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              <p>
                <strong className="text-on-surface">Level 1 - Minor Congestion:</strong> Automatic headway modulation via CBTC ATS systems (+60 to +120 seconds). Auxiliary passenger gates opened on platform levels.
              </p>
              <p>
                <strong className="text-on-surface">Level 2 - Surface Roadblock:</strong> Dynamic coordination between HMRL Metro and TGSRTC feeder matrix. Buses rerouted away from choke points to outer ring feeders.
              </p>
              <p>
                <strong className="text-on-surface">Level 3 - Station Interlock / Evacuation:</strong> Immediate 25kV traction power hold, SDRF units dispatched with emergency vehicle escorts, and turnstiles opened to free egress.
              </p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowProtocolModal(false)}
                className="px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold text-sm cursor-pointer"
              >
                Close Protocol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
