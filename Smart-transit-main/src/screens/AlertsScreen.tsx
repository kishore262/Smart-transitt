import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import { CommuterAlert } from '../utils/transitData';

export const AlertsScreen: React.FC = () => {
  const { alerts, setActiveTab, setFromLocation, setToLocation, setSelectedRouteId, setRoutesGenerated, showToast } = useTransit();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'Metro' | 'Bus' | 'MMTS'>('all');

  const filteredAlerts = alerts.filter(
    (alert) => selectedFilter === 'all' || alert.service === selectedFilter
  );

  const handleTakeAlternative = (alert: CommuterAlert) => {
    setFromLocation('Tarnaka');
    setToLocation('HITEC City');
    setSelectedRouteId(1); // switch to on-time Metro
    setRoutesGenerated(true);
    setActiveTab('home');
    showToast('Redirected to on-time Metro Route!');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Real-Time Commuter Advisory
          </span>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-slate-900 tracking-tight">
            Transit Alerts & Delays
          </h1>
          <p className="text-sm text-slate-500">
            Live service disruptions, traffic slowdowns, and schedule changes across Hyderabad.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Hyderabad Transit Network: 96% On Time</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['all', 'Metro', 'Bus', 'MMTS'] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setSelectedFilter(mode)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === mode
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {mode === 'all' ? 'All Services' : mode}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3.5">
        {filteredAlerts.map((alert) => {
          let statusBadge = (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              🟢 Normal
            </span>
          );

          if (alert.level === 'yellow') {
            statusBadge = (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                🟡 Delay Advisory
              </span>
            );
          } else if (alert.level === 'red') {
            statusBadge = (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                🔴 Service Alert
              </span>
            );
          }

          return (
            <div
              key={alert.id}
              className={`rounded-2xl p-5 border transition-all ${
                alert.level === 'yellow'
                  ? 'bg-amber-50/50 border-amber-200 shadow-xs'
                  : alert.level === 'red'
                  ? 'bg-rose-50/50 border-rose-200 shadow-xs'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {alert.service}
                    </span>
                    <span>•</span>
                    <span className="text-xs font-semibold text-slate-700">{alert.location}</span>
                    <span>•</span>
                    {statusBadge}
                  </div>

                  <h3 className="font-headline font-bold text-base text-slate-900">
                    {alert.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {alert.message}
                  </p>

                  {alert.hasAlternative && alert.alternativeRoute && (
                    <div className="mt-3 p-3 bg-white/90 rounded-xl border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="text-xs text-amber-900">
                        <strong className="font-bold">Smart Alternative:</strong> {alert.alternativeRoute}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleTakeAlternative(alert)}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
                      >
                        Plan Alternative
                      </button>
                    </div>
                  )}
                </div>

                <span className="text-xs text-slate-400 font-mono self-end sm:self-start">
                  {alert.timeAgo}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
