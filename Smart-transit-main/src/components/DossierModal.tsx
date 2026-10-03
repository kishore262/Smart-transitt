import React from 'react';
import { useTransit } from '../context/TransitContext';
import { TransitLogo } from './Logo';

export const DossierModal: React.FC = () => {
  const { activeModal, setActiveModal, modalData, showToast } = useTransit();

  if (activeModal !== 'dossier' && activeModal !== 'badge') return null;

  const isBadge = activeModal === 'badge';

  const handlePrintDownload = () => {
    showToast(isBadge ? 'Eco-Badge image saved!' : 'Civic Dossier PDF export generated!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface-container rounded-2xl max-w-xl w-full border border-primary/40 shadow-2xl overflow-hidden flex flex-col relative animate-fadeIn">
        {/* Header */}
        <div className="p-space-lg bg-surface-container-high flex items-center justify-between border-b border-surface-container-highest">
          <div className="flex items-center gap-space-sm">
            <TransitLogo size={32} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  {isBadge ? 'Telangana Eco-Commuter Badge' : 'Government of Telangana Civic Dossier'}
                </h3>
              </div>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                {isBadge ? 'Official Decarbonization Credential' : 'HMUMA Metropolitan Transport Audit'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface hover:bg-surface-bright flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-space-lg space-y-space-md">
          {isBadge ? (
            /* Badge Certificate */
            <div className="p-6 rounded-2xl bg-gradient-to-br from-surface-container-lowest via-surface-container to-surface-container-low border-2 border-tertiary/40 shadow-xl flex flex-col items-center text-center space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="w-16 h-16 rounded-full bg-tertiary/20 text-tertiary flex items-center justify-center border border-tertiary/50">
                <span className="material-symbols-outlined text-[36px]">workspace_premium</span>
              </div>

              <div>
                <span className="font-label-caps text-label-caps text-tertiary font-bold tracking-widest block uppercase">
                  CERTIFIED GREEN COMMUTER
                </span>
                <h3 className="font-headline-lg text-headline-lg text-on-surface mt-1">
                  Greater Hyderabad Urban Hero
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mt-1">
                  Commended by the Hyderabad Metropolitan Urban Mobility Authority for active public transit patronage.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 w-full pt-2">
                <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high/40">
                  <span className="font-label-caps text-label-caps text-on-surface-variant block">CO₂ AVOIDED</span>
                  <span className="font-telemetry-lg text-telemetry-lg text-tertiary font-bold">
                    {modalData?.co2 || '84 kg'}
                  </span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high/40">
                  <span className="font-label-caps text-label-caps text-on-surface-variant block">NEEM TREES</span>
                  <span className="font-telemetry-lg text-telemetry-lg text-secondary font-bold">
                    {modalData?.trees || '4.2'} Trees
                  </span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high/40">
                  <span className="font-label-caps text-label-caps text-on-surface-variant block">RATING</span>
                  <span className="font-telemetry-lg text-telemetry-lg text-primary font-bold">Class A+</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between w-full border-t border-surface-container-high/40 font-telemetry-sm text-[10px] text-outline">
                <span>ISSUED: 2026-10-03</span>
                <span>AUTHENTICITY ID: HMUMA-ECO-77492</span>
              </div>
            </div>
          ) : (
            /* Civic Dossier */
            <div className="space-y-4">
              <div className="p-4 bg-surface-container-lowest rounded-xl border border-surface-container-high/40 space-y-3 font-body-sm text-body-sm">
                <div className="flex justify-between border-b border-surface-container-high pb-2">
                  <span className="text-on-surface font-semibold">Audit Period:</span>
                  <span className="font-telemetry-sm text-primary font-bold">Last 30 Operational Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Metro Rail Total Punctuality:</span>
                  <span className="font-telemetry-sm text-tertiary font-semibold">98.4% (Benchmark &gt;95%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">TGSRTC Active Bus Fleet:</span>
                  <span className="font-telemetry-sm text-secondary font-semibold">2,840 Units (412 EV Low-Floor)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Direct Community Fuel Saved:</span>
                  <span className="font-telemetry-sm text-on-surface font-semibold">₹42.6 Lakhs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Active Decarbonization Footprint:</span>
                  <span className="font-telemetry-sm text-tertiary font-semibold">342.8 Metric Tonnes CO₂e</span>
                </div>
              </div>

              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                This document conforms to the Telangana State Smart Cities Mission and HMDA urban decongestion guidelines
                for Cyberabad and Greater Hyderabad.
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-space-sm pt-2">
            <button
              onClick={handlePrintDownload}
              className="flex-1 py-2.5 px-4 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-headline-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">file_download</span>
              <span>{isBadge ? 'Download Digital Badge' : 'Export Official PDF'}</span>
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="px-5 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-md text-label-md cursor-pointer border border-surface-container-highest"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
