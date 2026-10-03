import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';

export const GreenAnalytics: React.FC = () => {
  const { setActiveModal, setModalData, showToast } = useTransit();

  const [commuteDays, setCommuteDays] = useState(5);
  const [commuteDist, setCommuteDist] = useState(18);
  const [badgeCopied, setBadgeCopied] = useState(false);

  // Dynamic calculations based on commute inputs:
  const monthlyDays = commuteDays * 4.3;
  const totalKmMonthly = commuteDist * 2 * monthlyDays;
  const monthlySavings = Math.round(totalKmMonthly * 10.2);
  const co2ReducedKg = Math.round(totalKmMonthly * 0.11);
  const hoursGained = Math.round((totalKmMonthly / 28) * 0.45);
  const annualCash = Math.round(monthlySavings * 12);
  const neemTrees = (co2ReducedKg / 20).toFixed(1);

  const handleGenerateBadge = () => {
    setModalData({
      co2: `${co2ReducedKg} kg`,
      savings: `₹${monthlySavings.toLocaleString('en-IN')}`,
      trees: neemTrees,
      score: 'Class A+',
    });
    setActiveModal('badge');
    setBadgeCopied(true);
    showToast('Telangana Eco-Badge Certificate ready to share!');
    setTimeout(() => setBadgeCopied(false), 3000);
  };

  const handleExportDossier = () => {
    setActiveModal('dossier');
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full px-4 md:px-margin-desktop py-space-lg flex flex-col gap-space-xl">
        {/* Header Title & Ribbon */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
          <div className="space-y-space-xs">
            <div className="flex items-center gap-space-sm font-label-caps text-label-caps tracking-widest text-primary uppercase">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Civic Telemetry Stream · Greater Hyderabad Metropolitan Zone
            </div>
            <div className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
              Mobility & Sustainability Intelligence
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
              Aggregated GTFS-RT network diagnostics, decarbonization indices, and multimodal commute optimization across
              HMRL, TGSRTC, and MMTS.
            </p>
          </div>

          <div className="flex items-center gap-space-sm self-start lg:self-auto shrink-0">
            <div className="bg-surface-container-high px-space-md py-space-xs rounded-lg flex items-center gap-space-xs text-on-surface-variant font-telemetry-sm text-telemetry-sm border border-surface-container-highest">
              <span className="material-symbols-outlined text-[16px] text-tertiary">cloud_done</span>
              <span>AUTONOMOUS AUDIT: V2.42</span>
            </div>
            <button
              onClick={handleExportDossier}
              className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-space-md py-space-xs rounded-lg flex items-center gap-space-xs transition-colors shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Export Telangana Civic Dossier</span>
            </button>
          </div>
        </div>

        {/* 4 Top KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
          {/* Card 1 */}
          <div className="bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between shadow-sm relative overflow-hidden group hover:bg-surface-container transition-colors border border-surface-container-high/30">
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-primary/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-space-xs text-primary font-label-caps text-label-caps uppercase">
                <span className="material-symbols-outlined text-[18px]">route</span>
                AI JOURNEYS
              </div>
              <span className="font-telemetry-sm text-telemetry-sm text-tertiary font-semibold bg-tertiary/10 px-space-xs py-0.5 rounded border border-tertiary/20">
                +14.2% WoW
              </span>
            </div>
            <div className="my-space-md">
              <div className="font-headline-xl text-headline-xl text-on-surface tracking-tight">148,290</div>
              <div className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">
                Optimized multimodal paths planned today across 3 transit corridors.
              </div>
            </div>
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[84%] rounded-full"></div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between shadow-sm relative overflow-hidden group hover:bg-surface-container transition-colors border border-surface-container-high/30">
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-tertiary/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-space-xs text-tertiary font-label-caps text-label-caps uppercase">
                <span className="material-symbols-outlined text-[18px]">eco</span>
                CO₂ DISPLACED
              </div>
              <span className="font-telemetry-sm text-telemetry-sm text-tertiary font-semibold bg-tertiary/10 px-space-xs py-0.5 rounded border border-tertiary/20">
                ACTIVE NET
              </span>
            </div>
            <div className="my-space-md">
              <div className="font-headline-xl text-headline-xl text-on-surface tracking-tight">342.8 MT</div>
              <div className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">
                Direct emissions avoided; equivalent to <span className="text-tertiary font-medium">15,400 Neem trees</span> in Telangana.
              </div>
            </div>
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
              <div className="bg-tertiary h-full w-[92%] rounded-full"></div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between shadow-sm relative overflow-hidden group hover:bg-surface-container transition-colors border border-surface-container-high/30">
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-secondary/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-space-xs text-secondary font-label-caps text-label-caps uppercase">
                <span className="material-symbols-outlined text-[18px]">currency_rupee</span>
                COMMUTER WALLET
              </div>
              <span className="font-telemetry-sm text-telemetry-sm text-secondary font-semibold bg-secondary/10 px-space-xs py-0.5 rounded border border-secondary/20">
                COMMUNITY SAVINGS
              </span>
            </div>
            <div className="my-space-md">
              <div className="font-headline-xl text-headline-xl text-on-surface tracking-tight">₹42.6 Lakhs</div>
              <div className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">
                Direct fuel and surge cab spend saved compared to private transit.
              </div>
            </div>
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
              <div className="bg-secondary h-full w-[78%] rounded-full"></div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between shadow-sm relative overflow-hidden group hover:bg-surface-container transition-colors border border-surface-container-high/30">
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-primary-fixed-dim/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-space-xs text-primary-fixed-dim font-label-caps text-label-caps uppercase">
                <span className="material-symbols-outlined text-[18px]">timelapse</span>
                TRANSIT EFFICIENCY
              </div>
              <span className="font-telemetry-sm text-telemetry-sm text-primary font-semibold bg-primary/10 px-space-xs py-0.5 rounded border border-primary/20">
                SYNC ENGINE
              </span>
            </div>
            <div className="my-space-md">
              <div className="font-headline-xl text-headline-xl text-on-surface tracking-tight">28.4 Mins</div>
              <div className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">
                Average commuter latency saved through multimodal synchronized hubs.
              </div>
            </div>
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary-fixed-dim h-full w-[88%] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Modal Split Distribution Donut & Top Corridors List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
          {/* Modal Split Donut (5 cols) */}
          <div className="lg:col-span-5 bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between shadow-sm border border-surface-container-high/30">
            <div className="space-y-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-headline-sm text-on-surface">Modal Split Distribution</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">TODAY · 148.2K RIDES</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Real-time load split across public grid operators.
              </p>
            </div>

            <div className="my-space-lg flex flex-col sm:flex-row items-center justify-around gap-space-lg">
              <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-surface-container-highest"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="38"
                    stroke="currentColor"
                    strokeWidth="12"
                  ></circle>
                  {/* HMRL 51% (dasharray ~ 121.7 of 238.8) */}
                  <circle
                    className="text-primary"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="38"
                    stroke="currentColor"
                    strokeDasharray="121.7 238.8"
                    strokeDashoffset="0"
                    strokeWidth="12"
                  ></circle>
                  {/* TGSRTC 36% (dasharray ~ 86.0) */}
                  <circle
                    className="text-secondary"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="38"
                    stroke="currentColor"
                    strokeDasharray="86.0 238.8"
                    strokeDashoffset="-121.7"
                    strokeWidth="12"
                  ></circle>
                  {/* MMTS 9% (dasharray ~ 21.5) */}
                  <circle
                    className="text-tertiary"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="38"
                    stroke="currentColor"
                    strokeDasharray="21.5 238.8"
                    strokeDashoffset="-207.7"
                    strokeWidth="12"
                  ></circle>
                  {/* EV / Feeders 4% (dasharray ~ 9.5) */}
                  <circle
                    className="text-tertiary-fixed"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="38"
                    stroke="currentColor"
                    strokeDasharray="9.5 238.8"
                    strokeDashoffset="-229.2"
                    strokeWidth="12"
                  ></circle>
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="font-telemetry-lg text-telemetry-lg text-on-surface font-bold">148.3K</span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant">TOTAL TRIPS</span>
                </div>
              </div>

              <div className="flex flex-col gap-space-sm w-full max-w-[210px]">
                <div className="flex items-center justify-between text-body-sm font-body-sm">
                  <div className="flex items-center gap-space-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0"></span>
                    <span className="text-on-surface">Metro (HMRL)</span>
                  </div>
                  <span className="font-telemetry-sm text-telemetry-sm text-on-surface-variant font-semibold">51%</span>
                </div>
                <div className="flex items-center justify-between text-body-sm font-body-sm">
                  <div className="flex items-center gap-space-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary shrink-0"></span>
                    <span className="text-on-surface">TGSRTC Buses</span>
                  </div>
                  <span className="font-telemetry-sm text-telemetry-sm text-on-surface-variant font-semibold">36%</span>
                </div>
                <div className="flex items-center justify-between text-body-sm font-body-sm">
                  <div className="flex items-center gap-space-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary shrink-0"></span>
                    <span className="text-on-surface">MMTS Suburban</span>
                  </div>
                  <span className="font-telemetry-sm text-telemetry-sm text-on-surface-variant font-semibold">9%</span>
                </div>
                <div className="flex items-center justify-between text-body-sm font-body-sm">
                  <div className="flex items-center gap-space-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed shrink-0"></span>
                    <span className="text-on-surface">EV Autos/Bikes</span>
                  </div>
                  <span className="font-telemetry-sm text-telemetry-sm text-on-surface-variant font-semibold">4%</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container p-space-md rounded-lg flex items-start gap-space-sm border border-tertiary/20">
              <span className="material-symbols-outlined text-[20px] text-tertiary shrink-0 mt-0.5">electric_meter</span>
              <div className="space-y-0.5">
                <span className="font-label-caps text-label-caps text-tertiary uppercase font-bold">
                  Feed Surge Observation
                </span>
                <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                  Electric modal share increased by <span className="text-tertiary font-semibold">22%</span> following launch of
                  TGSRTC Cyber EV feeders connecting HITEC City and Raidurg.
                </p>
              </div>
            </div>
          </div>

          {/* Top Corridors List (7 cols) */}
          <div className="lg:col-span-7 bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between shadow-sm border border-surface-container-high/30">
            <div className="flex items-center justify-between">
              <div className="space-y-space-xs">
                <span className="font-headline-sm text-headline-sm text-on-surface">Top Transit Corridors</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Ranked by passenger density, corridor throughput & punctuality.
                </p>
              </div>
              <span className="font-telemetry-sm text-telemetry-sm text-secondary bg-surface-container px-space-sm py-space-xs rounded-lg border border-secondary/20">
                GTFS-RT LIVE
              </span>
            </div>

            <div className="my-space-md flex flex-col gap-space-sm">
              {/* Corridor 1 */}
              <div className="p-space-sm bg-surface-container hover:bg-surface-container-high rounded-lg flex items-center justify-between gap-space-md transition-colors border border-surface-container-high/30">
                <div className="flex items-center gap-space-md min-w-0">
                  <span className="font-telemetry-lg text-telemetry-lg text-primary font-bold w-5 text-center">01</span>
                  <div className="min-w-0">
                    <div className="font-body-md text-body-md font-semibold text-on-surface truncate">
                      Nagole / Uppal Hub ↔ HITEC City / Cyber Towers
                    </div>
                    <div className="flex items-center gap-space-sm text-on-surface-variant font-telemetry-sm text-telemetry-sm mt-0.5">
                      <span className="text-primary font-medium">HMR Blue Line</span>
                      <span>•</span>
                      <span>Avg 38m</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-space-xl shrink-0 text-right">
                  <div className="hidden sm:block">
                    <span className="font-telemetry-md text-telemetry-md text-on-surface block font-semibold">42.4k</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">DAILY PASS</span>
                  </div>
                  <div className="w-20 text-right">
                    <span className="font-telemetry-md text-telemetry-md text-tertiary block font-semibold">98.7%</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">ON-TIME</span>
                  </div>
                </div>
              </div>

              {/* Corridor 2 */}
              <div className="p-space-sm bg-surface-container hover:bg-surface-container-high rounded-lg flex items-center justify-between gap-space-md transition-colors border border-surface-container-high/30">
                <div className="flex items-center gap-space-md min-w-0">
                  <span className="font-telemetry-lg text-telemetry-lg text-primary font-bold w-5 text-center">02</span>
                  <div className="min-w-0">
                    <div className="font-body-md text-body-md font-semibold text-on-surface truncate">
                      Miyapur ↔ Ameerpet ↔ MGBS Central
                    </div>
                    <div className="flex items-center gap-space-sm text-on-surface-variant font-telemetry-sm text-telemetry-sm mt-0.5">
                      <span className="text-error font-medium">HMR Red Line</span>
                      <span>•</span>
                      <span>Avg 32m</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-space-xl shrink-0 text-right">
                  <div className="hidden sm:block">
                    <span className="font-telemetry-md text-telemetry-md text-on-surface block font-semibold">34.1k</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">DAILY PASS</span>
                  </div>
                  <div className="w-20 text-right">
                    <span className="font-telemetry-md text-telemetry-md text-tertiary block font-semibold">97.9%</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">ON-TIME</span>
                  </div>
                </div>
              </div>

              {/* Corridor 3 */}
              <div className="p-space-sm bg-surface-container hover:bg-surface-container-high rounded-lg flex items-center justify-between gap-space-md transition-colors border border-surface-container-high/30">
                <div className="flex items-center gap-space-md min-w-0">
                  <span className="font-telemetry-lg text-telemetry-lg text-primary font-bold w-5 text-center">03</span>
                  <div className="min-w-0">
                    <div className="font-body-md text-body-md font-semibold text-on-surface truncate">
                      Secunderabad Jn ↔ Gachibowli Financial District
                    </div>
                    <div className="flex items-center gap-space-sm text-on-surface-variant font-telemetry-sm text-telemetry-sm mt-0.5">
                      <span className="text-secondary font-medium">TGSRTC Express + MMTS</span>
                      <span>•</span>
                      <span>Avg 48m</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-space-xl shrink-0 text-right">
                  <div className="hidden sm:block">
                    <span className="font-telemetry-md text-telemetry-md text-on-surface block font-semibold">26.8k</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">DAILY PASS</span>
                  </div>
                  <div className="w-20 text-right">
                    <span className="font-telemetry-md text-telemetry-md text-secondary block font-semibold">92.4%</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">ON-TIME</span>
                  </div>
                </div>
              </div>

              {/* Corridor 4 */}
              <div className="p-space-sm bg-surface-container hover:bg-surface-container-high rounded-lg flex items-center justify-between gap-space-md transition-colors border border-surface-container-high/30">
                <div className="flex items-center gap-space-md min-w-0">
                  <span className="font-telemetry-lg text-telemetry-lg text-primary font-bold w-5 text-center">04</span>
                  <div className="min-w-0">
                    <div className="font-body-md text-body-md font-semibold text-on-surface truncate">
                      LB Nagar ↔ Hitec City / Durgam Cheruvu
                    </div>
                    <div className="flex items-center gap-space-sm text-on-surface-variant font-telemetry-sm text-telemetry-sm mt-0.5">
                      <span className="text-error font-medium">HMR Red-Blue Interchange</span>
                      <span>•</span>
                      <span>Avg 45m</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-space-xl shrink-0 text-right">
                  <div className="hidden sm:block">
                    <span className="font-telemetry-md text-telemetry-md text-on-surface block font-semibold">24.3k</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">DAILY PASS</span>
                  </div>
                  <div className="w-20 text-right">
                    <span className="font-telemetry-md text-telemetry-md text-tertiary block font-semibold">96.5%</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">ON-TIME</span>
                  </div>
                </div>
              </div>

              {/* Corridor 5 */}
              <div className="p-space-sm bg-surface-container hover:bg-surface-container-high rounded-lg flex items-center justify-between gap-space-md transition-colors border border-surface-container-high/30">
                <div className="flex items-center gap-space-md min-w-0">
                  <span className="font-telemetry-lg text-telemetry-lg text-primary font-bold w-5 text-center">05</span>
                  <div className="min-w-0">
                    <div className="font-body-md text-body-md font-semibold text-on-surface truncate">
                      RGIA Airport ↔ JBS Parade Ground / Hitec
                    </div>
                    <div className="flex items-center gap-space-sm text-on-surface-variant font-telemetry-sm text-telemetry-sm mt-0.5">
                      <span className="text-tertiary font-medium">Pushpak Airport Shuttle</span>
                      <span>•</span>
                      <span>Avg 42m</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-space-xl shrink-0 text-right">
                  <div className="hidden sm:block">
                    <span className="font-telemetry-md text-telemetry-md text-on-surface block font-semibold">12.2k</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">DAILY PASS</span>
                  </div>
                  <div className="w-20 text-right">
                    <span className="font-telemetry-md text-telemetry-md text-tertiary block font-semibold">99.1%</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">ON-TIME</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-space-xs text-on-surface-variant font-telemetry-sm text-telemetry-sm border-t border-surface-container-high/20">
              <span>MEASURED OVER 30 CONSECUTIVE OPERATIONAL DAYS</span>
              <button
                onClick={() => showToast('Full 38 Corridors Report loaded into memory.')}
                className="text-primary cursor-pointer hover:underline"
              >
                View All 38 Corridors →
              </button>
            </div>
          </div>
        </div>

        {/* Peak Commute Density Heatmap */}
        <div className="bg-surface-container-low rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-surface-container-high/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
            <div>
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-sm text-headline-sm text-on-surface">Peak Commute Density Heatmap</span>
                <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Hour-by-hour network volume matrix across Cyberabad & Secunderabad hubs.
              </p>
            </div>
            <div className="bg-surface-container-high px-space-md py-space-xs rounded-lg flex items-center gap-space-sm self-start md:self-auto border border-surface-container-highest">
              <span className="material-symbols-outlined text-[18px] text-error">electric_bolt</span>
              <span className="font-telemetry-sm text-telemetry-sm text-on-surface">
                Autonomous Surge: <span className="text-primary font-semibold">+14 Rakes</span> &{' '}
                <span className="text-secondary font-semibold">40 Feeders</span> deployed during Peak Bands
              </span>
            </div>
          </div>

          <div className="overflow-x-auto w-full pb-space-sm">
            <div className="min-w-[760px] flex flex-col gap-1.5 font-telemetry-sm text-telemetry-sm">
              {/* Header Hours */}
              <div className="grid grid-cols-19 gap-1 text-center font-label-caps text-label-caps text-on-surface-variant mb-1">
                <div className="text-left font-semibold">DAY</div>
                <div>06h</div>
                <div>07h</div>
                <div>08h</div>
                <div className="text-error font-bold">09h</div>
                <div className="text-error font-bold">10h</div>
                <div>11h</div>
                <div>12h</div>
                <div>13h</div>
                <div>14h</div>
                <div>15h</div>
                <div>16h</div>
                <div className="text-error font-bold">17h</div>
                <div className="text-error font-bold">18h</div>
                <div className="text-error font-bold">19h</div>
                <div className="text-error font-bold">20h</div>
                <div>21h</div>
                <div>22h</div>
                <div>23h</div>
              </div>

              {/* Rows MON to SUN */}
              {/* MON */}
              <div className="grid grid-cols-19 gap-1 items-center">
                <span className="text-on-surface font-semibold text-left">MON</span>
                <div className="h-7 rounded bg-surface-container" title="06:00 - 24% load"></div>
                <div className="h-7 rounded bg-primary/20" title="07:00 - 42% load"></div>
                <div className="h-7 rounded bg-secondary/40" title="08:00 - 68% load"></div>
                <div className="h-7 rounded bg-error/90 shadow-sm" title="09:00 - Peak Overload: 96%"></div>
                <div className="h-7 rounded bg-error/80" title="10:00 - High Load: 88%"></div>
                <div className="h-7 rounded bg-primary/40" title="11:00 - 54% load"></div>
                <div className="h-7 rounded bg-primary/20" title="12:00 - 38% load"></div>
                <div className="h-7 rounded bg-surface-container" title="13:00 - 28% load"></div>
                <div className="h-7 rounded bg-primary/20" title="14:00 - 36% load"></div>
                <div className="h-7 rounded bg-primary/30" title="15:00 - 46% load"></div>
                <div className="h-7 rounded bg-secondary/50" title="16:00 - 72% load"></div>
                <div className="h-7 rounded bg-error/80" title="17:00 - High Load: 86%"></div>
                <div className="h-7 rounded bg-error/95 shadow-sm" title="18:00 - Evening Peak: 98%"></div>
                <div className="h-7 rounded bg-error/85" title="19:00 - 89% load"></div>
                <div className="h-7 rounded bg-secondary/50" title="20:00 - 66% load"></div>
                <div className="h-7 rounded bg-primary/30" title="21:00 - 45% load"></div>
                <div className="h-7 rounded bg-surface-container" title="22:00 - 25% load"></div>
                <div className="h-7 rounded bg-surface-container-lowest" title="23:00 - 12% load"></div>
              </div>

              {/* TUE */}
              <div className="grid grid-cols-19 gap-1 items-center">
                <span className="text-on-surface font-semibold text-left">TUE</span>
                <div className="h-7 rounded bg-surface-container"></div>
                <div className="h-7 rounded bg-primary/20"></div>
                <div className="h-7 rounded bg-secondary/40"></div>
                <div className="h-7 rounded bg-error/90"></div>
                <div className="h-7 rounded bg-error/85"></div>
                <div className="h-7 rounded bg-primary/40"></div>
                <div className="h-7 rounded bg-primary/20"></div>
                <div className="h-7 rounded bg-surface-container"></div>
                <div className="h-7 rounded bg-surface-container"></div>
                <div className="h-7 rounded bg-primary/30"></div>
                <div className="h-7 rounded bg-secondary/50"></div>
                <div className="h-7 rounded bg-error/85"></div>
                <div className="h-7 rounded bg-error/90"></div>
                <div className="h-7 rounded bg-error/80"></div>
                <div className="h-7 rounded bg-secondary/50"></div>
                <div className="h-7 rounded bg-primary/30"></div>
                <div className="h-7 rounded bg-surface-container"></div>
                <div className="h-7 rounded bg-surface-container-lowest"></div>
              </div>

              {/* WED */}
              <div className="grid grid-cols-19 gap-1 items-center">
                <span className="text-on-surface font-semibold text-left">WED</span>
                <div className="h-7 rounded bg-surface-container"></div>
                <div className="h-7 rounded bg-primary/20"></div>
                <div className="h-7 rounded bg-secondary/50"></div>
                <div className="h-7 rounded bg-error/95"></div>
                <div className="h-7 rounded bg-error/90"></div>
                <div className="h-7 rounded bg-primary/50"></div>
                <div className="h-7 rounded bg-primary/30"></div>
                <div className="h-7 rounded bg-surface-container"></div>
                <div className="h-7 rounded bg-primary/20"></div>
                <div className="h-7 rounded bg-primary/40"></div>
                <div className="h-7 rounded bg-secondary/60"></div>
                <div className="h-7 rounded bg-error/90"></div>
                <div className="h-7 rounded bg-error/95"></div>
                <div className="h-7 rounded bg-error/85"></div>
                <div className="h-7 rounded bg-secondary/60"></div>
                <div className="h-7 rounded bg-primary/30"></div>
                <div className="h-7 rounded bg-surface-container"></div>
                <div className="h-7 rounded bg-surface-container-lowest"></div>
              </div>

              {/* THU */}
              <div className="grid grid-cols-19 gap-1 items-center">
                <span className="text-on-surface font-semibold text-left">THU</span>
                <div className="h-7 rounded bg-surface-container"></div>
                <div className="h-7 rounded bg-primary/20"></div>
                <div className="h-7 rounded bg-secondary/50"></div>
                <div className="h-7 rounded bg-error/90"></div>
                <div className="h-7 rounded bg-error/85"></div>
                <div className="h-7 rounded bg-primary/40"></div>
                <div className="h-7 rounded bg-primary/20"></div>
                <div className="h-7 rounded bg-surface-container"></div>
                <div className="h-7 rounded bg-surface-container"></div>
                <div className="h-7 rounded bg-primary/40"></div>
                <div className="h-7 rounded bg-secondary/60"></div>
                <div className="h-7 rounded bg-error/90"></div>
                <div className="h-7 rounded bg-error/90"></div>
                <div className="h-7 rounded bg-error/80"></div>
                <div className="h-7 rounded bg-secondary/50"></div>
                <div className="h-7 rounded bg-primary/30"></div>
                <div className="h-7 rounded bg-surface-container"></div>
                <div className="h-7 rounded bg-surface-container-lowest"></div>
              </div>

              {/* FRI */}
              <div className="grid grid-cols-19 gap-1 items-center">
                <span className="text-on-surface font-semibold text-left">FRI</span>
                <div className="h-7 rounded bg-surface-container"></div>
                <div className="h-7 rounded bg-primary/20"></div>
                <div className="h-7 rounded bg-secondary/40"></div>
                <div className="h-7 rounded bg-error/85"></div>
                <div className="h-7 rounded bg-error/75"></div>
                <div className="h-7 rounded bg-primary/30"></div>
                <div className="h-7 rounded bg-primary/30"></div>
                <div className="h-7 rounded bg-surface-container"></div>
                <div className="h-7 rounded bg-primary/30"></div>
                <div className="h-7 rounded bg-secondary/40"></div>
                <div className="h-7 rounded bg-error/80"></div>
                <div className="h-7 rounded bg-error/95"></div>
                <div className="h-7 rounded bg-error/95"></div>
                <div className="h-7 rounded bg-error/90"></div>
                <div className="h-7 rounded bg-secondary/70"></div>
                <div className="h-7 rounded bg-primary/50"></div>
                <div className="h-7 rounded bg-primary/30"></div>
                <div className="h-7 rounded bg-surface-container"></div>
              </div>

              {/* SAT */}
              <div className="grid grid-cols-19 gap-1 items-center">
                <span className="text-on-surface font-semibold text-left">SAT</span>
                <div className="h-7 rounded bg-surface-container"></div>
                <div className="h-7 rounded bg-surface-container"></div>
                <div className="h-7 rounded bg-primary/20"></div>
                <div className="h-7 rounded bg-primary/30"></div>
                <div className="h-7 rounded bg-primary/40"></div>
                <div className="h-7 rounded bg-secondary/40"></div>
                <div className="h-7 rounded bg-secondary/50"></div>
                <div className="h-7 rounded bg-secondary/50"></div>
                <div className="h-7 rounded bg-secondary/50"></div>
                <div className="h-7 rounded bg-secondary/50"></div>
                <div className="h-7 rounded bg-secondary/50"></div>
                <div className="h-7 rounded bg-secondary/60"></div>
                <div className="h-7 rounded bg-secondary/60"></div>
                <div className="h-7 rounded bg-secondary/50"></div>
                <div className="h-7 rounded bg-primary/40"></div>
                <div className="h-7 rounded bg-primary/30"></div>
                <div className="h-7 rounded bg-surface-container"></div>
                <div className="h-7 rounded bg-surface-container"></div>
              </div>

              {/* SUN */}
              <div className="grid grid-cols-19 gap-1 items-center">
                <span className="text-on-surface font-semibold text-left">SUN</span>
                <div className="h-7 rounded bg-surface-container-lowest"></div>
                <div className="h-7 rounded bg-surface-container"></div>
                <div className="h-7 rounded bg-surface-container"></div>
                <div className="h-7 rounded bg-primary/20"></div>
                <div className="h-7 rounded bg-primary/20"></div>
                <div className="h-7 rounded bg-primary/30"></div>
                <div className="h-7 rounded bg-primary/40"></div>
                <div className="h-7 rounded bg-primary/40"></div>
                <div className="h-7 rounded bg-primary/40"></div>
                <div className="h-7 rounded bg-primary/40"></div>
                <div className="h-7 rounded bg-primary/40"></div>
                <div className="h-7 rounded bg-secondary/40"></div>
                <div className="h-7 rounded bg-secondary/40"></div>
                <div className="h-7 rounded bg-primary/30"></div>
                <div className="h-7 rounded bg-primary/30"></div>
                <div className="h-7 rounded bg-surface-container"></div>
                <div className="h-7 rounded bg-surface-container"></div>
                <div className="h-7 rounded bg-surface-container-lowest"></div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-space-md pt-space-xs text-on-surface-variant font-telemetry-sm text-telemetry-sm border-t border-surface-container-high/20">
            <div className="flex items-center gap-space-md flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-surface-container"></span>Low Flow (&lt;30%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-primary/40"></span>Nominal (30-65%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-secondary/60"></span>Dense (65-85%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-error/90"></span>Critical Peak (&gt;85%)
              </span>
            </div>
            <div className="font-label-caps text-label-caps text-outline">
              SENSOR SYNC: AMQ-SEC-092 • RT-LATENCY: 340ms
            </div>
          </div>
        </div>

        {/* Personal Commute Impact Calculator */}
        <div className="bg-surface-container-low rounded-xl p-space-lg shadow-sm border border-surface-container-high/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            {/* Controls Side */}
            <div className="lg:col-span-5 space-y-space-md">
              <div className="space-y-space-xs">
                <div className="flex items-center gap-space-xs text-tertiary font-label-caps text-label-caps uppercase">
                  <span className="material-symbols-outlined text-[16px]">calculate</span>
                  Interactive Simulator
                </div>
                <div className="font-headline-md text-headline-md text-on-surface">
                  Personal Commute Impact Calculator
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Adjust your daily transit pattern to project financial dividends, carbon offsets, and recovered
                  productivity.
                </p>
              </div>

              <div className="space-y-space-lg pt-space-xs">
                <div>
                  <div className="flex justify-between items-center mb-space-xs font-body-sm text-body-sm text-on-surface">
                    <span>Weekly Commute Frequency</span>
                    <span className="font-telemetry-md text-telemetry-md text-primary font-bold">
                      {commuteDays} {commuteDays === 1 ? 'Day / Week' : 'Days / Week'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="7"
                    value={commuteDays}
                    onChange={(e) => setCommuteDays(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-on-surface-variant font-label-caps text-label-caps mt-1">
                    <span>1 Day</span>
                    <span>3 Days</span>
                    <span>5 Days</span>
                    <span>7 Days</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-space-xs font-body-sm text-body-sm text-on-surface">
                    <span>One-way Commute Distance</span>
                    <span className="font-telemetry-md text-telemetry-md text-secondary font-bold">
                      {commuteDist} km
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="50"
                    value={commuteDist}
                    onChange={(e) => setCommuteDist(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary"
                  />
                  <div className="flex justify-between text-on-surface-variant font-label-caps text-label-caps mt-1">
                    <span>3 km (Local feeder)</span>
                    <span>25 km (Cross-city)</span>
                    <span>50 km (Airport/Outer)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Projection Output Side */}
            <div className="lg:col-span-7 bg-surface-container p-space-lg rounded-xl flex flex-col justify-between gap-space-lg border border-surface-container-high/40">
              <div>
                <span className="font-label-caps text-label-caps text-primary uppercase block mb-space-xs font-bold">
                  Projected Monthly Dividends vs. Private Cab
                </span>
                <div className="font-headline-lg text-headline-lg text-on-surface">
                  You save <span className="text-tertiary">₹{monthlySavings.toLocaleString('en-IN')}</span>/month & reduce{' '}
                  <span className="text-secondary">{co2ReducedKg} kg</span> CO₂!
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs leading-relaxed">
                  Plus you gain approximately <span className="text-primary font-semibold">{hoursGained} hours</span> of
                  productive or rest time not lost behind the wheel in traffic.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm text-center">
                <div className="bg-surface-container-high p-space-md rounded-lg border border-surface-container-highest">
                  <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">
                    ANNUAL CASH BENEFIT
                  </span>
                  <span className="font-telemetry-lg text-telemetry-lg text-tertiary font-bold">
                    ₹{annualCash.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="bg-surface-container-high p-space-md rounded-lg border border-surface-container-highest">
                  <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">
                    NEEM TREES OFFSET
                  </span>
                  <span className="font-telemetry-lg text-telemetry-lg text-secondary font-bold">
                    {neemTrees} Trees
                  </span>
                </div>
                <div className="bg-surface-container-high p-space-md rounded-lg border border-surface-container-highest">
                  <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">
                    CONGESTION SCORE
                  </span>
                  <span className="font-telemetry-lg text-telemetry-lg text-primary font-bold">Class A+</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-space-sm pt-space-xs">
                <button
                  onClick={handleGenerateBadge}
                  className="w-full sm:w-auto bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-space-lg py-space-sm rounded-lg flex items-center justify-center gap-space-xs transition-colors shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Generate Telangana Eco-Badge</span>
                </button>
                {badgeCopied && (
                  <span className="font-telemetry-sm text-telemetry-sm text-tertiary animate-fadeIn">
                    Badge token copied to clipboard!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2 Rich Photo Feature Banners (Hotlinked from HTML) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          {/* Card 1: Electric bus charging depot */}
          <div className="relative rounded-xl overflow-hidden shadow-md h-64 flex flex-col justify-end p-space-lg border border-surface-container-high/30">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAC6dRnHkHI6lFlKfQUl28KsHEujBzfS_9cNJfhFJSPPU8VR0H0Rc0blVt9qG0IXDqLENXqVu_4csmrlj_w2uiFLRrIjuy_r5_7OJ2n2wHGk_gHcfhcSe08mHD8ylCTSTsclIxsXdwETTgdBLyjFMT7ATKQ24N0007XxanRStDmWOraaL0p4WziBQW5916n8Buogsx6UvrvBx_dxRyZu7aot2FW6hOwhOjdF6LMLIrxQSDyJxKTxB4c')`,
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
            <div className="relative space-y-1">
              <span className="bg-surface-container/80 backdrop-blur-md px-space-sm py-0.5 rounded text-tertiary font-label-caps text-label-caps inline-block border border-tertiary/20">
                TGSRTC CYBER EV FLEET
              </span>
              <div className="font-headline-sm text-headline-sm text-on-surface">
                Autonomous Bus Fleet Decarbonization
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                Over 240 electric feeders deployed across Miyapur, Kondapur, and RGIA corridors running 100% on regional
                solar grid offsets.
              </p>
            </div>
          </div>

          {/* Card 2: Hyderabad Metro Rail */}
          <div className="relative rounded-xl overflow-hidden shadow-md h-64 flex flex-col justify-end p-space-lg border border-surface-container-high/30">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCGhnLN4iKVjqOSsmi8D5IOI3VvawDwbiVHb6XVZux9tv1ALAdod6r2pewE0GmKyn9P4hZlOpRAaoM8CTAKhrVlS9RzHGHJxjH76HQogR2iYDQCXBtJxzaSZ4-UIP7qDyvEElUSEu4WhIrxizTMFm6THVa5yCS2adcmB_bxRSY_UTOHGLF1jbkWfjVNrkgoza4DEDMcq1FtH5kqyDKWVGOxKwW8AwAGl44pvOAsJXuIQaWL6JTsFWLn')`,
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
            <div className="relative space-y-1">
              <span className="bg-surface-container/80 backdrop-blur-md px-space-sm py-0.5 rounded text-primary font-label-caps text-label-caps inline-block border border-primary/20">
                HMRL RAPID ARTERY
              </span>
              <div className="font-headline-sm text-headline-sm text-on-surface">
                Regenerative Braking Power Feedback
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                Elevated Blue and Red line rakes recover 34% of traction energy during station approaches, directly
                powering concourse illumination.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
