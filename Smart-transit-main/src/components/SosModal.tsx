import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';

export const SosModal: React.FC = () => {
  const { activeModal, setActiveModal, showToast, addIncidentLog } = useTransit();
  const [alertSent, setAlertSent] = useState(false);

  if (activeModal !== 'sos') return null;

  const handleSendSilentAlert = () => {
    setAlertSent(true);
    const timeNow = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    addIncidentLog({
      time: timeNow,
      type: 'warning',
      text: 'EMERGENCY ALERT: Commuter initiated Station Marshal Assistance at Cyber Towers Gate 1.',
      corridor: 'Station Security',
    });
    showToast('Transit Marshals & Station Supervisor dispatched to your location!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface-container rounded-2xl max-w-lg w-full border border-error/50 shadow-[0_0_30px_rgba(225,29,72,0.35)] overflow-hidden flex flex-col relative animate-fadeIn">
        {/* Header */}
        <div className="p-space-lg bg-error-container/20 flex items-center justify-between border-b border-error/30">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-xl bg-error text-on-error flex items-center justify-center shadow-lg animate-pulse">
              <span className="material-symbols-outlined text-[24px]">sos</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-md text-headline-md text-on-surface">Emergency Transit Response</h3>
                <span className="px-2 py-0.5 rounded bg-error/20 text-error font-label-caps text-label-caps font-bold">
                  24x7 ACTIVE
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Cyberabad Command, She Teams, and HMR Station Protection.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveModal(null);
              setAlertSent(false);
            }}
            className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface hover:bg-surface-bright flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-space-lg space-y-space-md">
          {/* Geolocation Tag */}
          <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex items-center justify-between font-telemetry-sm text-xs">
            <div className="flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-secondary text-[16px]">location_on</span>
              <span>Detected Sector: Tarnaka Metro Platform 1 Concourse</span>
            </div>
            <span className="text-tertiary">GPS LOCK ACCURATE</span>
          </div>

          {!alertSent ? (
            <>
              {/* Helplines Grid */}
              <div className="space-y-2">
                <a
                  href="tel:112"
                  className="w-full p-space-md rounded-xl bg-error-container/30 hover:bg-error-container/40 border border-error/40 flex items-center justify-between transition-colors cursor-pointer text-left block"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-error text-[24px]">local_police</span>
                    <div>
                      <div className="font-headline-sm text-headline-sm text-on-surface">Call 112 National Helpline</div>
                      <span className="text-xs text-on-surface-variant">Police, Medical & Fire Emergency Dispatch</span>
                    </div>
                  </div>
                  <span className="text-error font-bold font-telemetry-md">TAP TO CALL</span>
                </a>

                <a
                  href="tel:04023332555"
                  className="w-full p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container-high border border-surface-container-high/30 flex items-center justify-between transition-colors cursor-pointer text-left block"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[24px]">subway</span>
                    <div>
                      <div className="font-headline-sm text-headline-sm text-on-surface">Metro Security Control</div>
                      <span className="text-xs text-on-surface-variant">040-23332555 (Direct Station Desk)</span>
                    </div>
                  </div>
                  <span className="text-primary font-bold font-telemetry-md">CALL</span>
                </a>

                <a
                  href="tel:04027852435"
                  className="w-full p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container-high border border-surface-container-high/30 flex items-center justify-between transition-colors cursor-pointer text-left block"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary text-[24px]">shield_person</span>
                    <div>
                      <div className="font-headline-sm text-headline-sm text-on-surface">Telangana She Teams</div>
                      <span className="text-xs text-on-surface-variant">Dedicated Women & Children Transit Safety Wing</span>
                    </div>
                  </div>
                  <span className="text-secondary font-bold font-telemetry-md">CALL</span>
                </a>
              </div>

              {/* Silent Alert Dispatch Button */}
              <div className="pt-2">
                <button
                  onClick={handleSendSilentAlert}
                  className="w-full py-3 px-4 rounded-xl bg-error hover:bg-error/90 text-white font-headline-sm text-headline-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                  <span>Dispatch Station Marshals to My Location</span>
                </button>
                <p className="font-telemetry-sm text-[10px] text-center text-on-surface-variant mt-2">
                  Sends high-priority dispatch signal with your GPS coordinates directly to OCC monitors.
                </p>
              </div>
            </>
          ) : (
            <div className="py-4 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-tertiary/20 text-tertiary flex items-center justify-center mx-auto border border-tertiary">
                <span className="material-symbols-outlined text-[36px]">verified</span>
              </div>
              <div>
                <h4 className="font-headline-md text-headline-md text-on-surface">Marshals Dispatched</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                  Station security supervisor on Platform 1 has acknowledged your alert. ETA is{' '}
                  <strong className="text-tertiary">under 90 seconds</strong>. Stay in well-lit concourse area.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveModal(null);
                  setAlertSent(false);
                }}
                className="px-6 py-2 rounded-lg bg-surface-container-highest text-on-surface text-sm cursor-pointer"
              >
                Close Window
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
