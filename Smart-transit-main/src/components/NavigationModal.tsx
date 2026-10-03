import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';

export const NavigationModal: React.FC = () => {
  const { activeModal, setActiveModal, showToast } = useTransit();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (activeModal !== 'navigation') return null;

  const steps = [
    {
      title: 'Walk 200m to Tarnaka Metro Gate 2',
      detail: 'Take Concourse Escalator to Platform 1 ticketing gates.',
      time: '3 min',
      icon: 'directions_walk',
      color: 'text-tertiary',
    },
    {
      title: 'Board Blue Line Train (Towards Raidurg)',
      detail: 'Platform 1 • Trainset M-304 arriving now • 8 stops to Ameerpet.',
      time: '14 min',
      icon: 'subway',
      color: 'text-primary',
    },
    {
      title: 'Ameerpet Interchange Transfer',
      detail: 'Alight at Ameerpet. Take cross-platform bridge towards Corridor III West.',
      time: '4 min',
      icon: 'transfer_within_a_station',
      color: 'text-secondary',
    },
    {
      title: 'Board Connecting Express to HITEC City',
      detail: 'Platform 3 • Direct express through Jubilee Hills & Madhapur.',
      time: '12 min',
      icon: 'subway',
      color: 'text-primary',
    },
    {
      title: 'Alight at HITEC City & Take Covered Skywalk',
      detail: 'Follow signs to Cyber Towers Gate 1 / Mindspace Pedestrian Spine.',
      time: '5 min',
      icon: 'apartment',
      color: 'text-tertiary',
    },
  ];

  const currentStep = steps[currentStepIndex];

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      showToast(`Navigating to Step ${currentStepIndex + 2}`);
    } else {
      showToast('You have arrived at HITEC City Cyber Towers!');
      setActiveModal(null);
      setCurrentStepIndex(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface-container rounded-2xl max-w-xl w-full border border-primary/50 shadow-2xl overflow-hidden flex flex-col relative animate-fadeIn">
        {/* Top HUD Banner */}
        <div className="p-space-lg bg-surface-container-high border-b border-surface-container-highest flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="w-3 h-3 rounded-full bg-tertiary animate-ping"></span>
            <div>
              <span className="font-label-caps text-label-caps text-primary uppercase block">
                ACTIVE MULTIMODAL GUIDANCE
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface">Live Navigation HUD</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="font-label-caps text-label-caps text-outline block">EST ARRIVAL</span>
              <span className="font-telemetry-md text-telemetry-md text-secondary font-bold">09:26 AM</span>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="ml-3 w-8 h-8 rounded-full bg-surface-container-highest text-on-surface hover:bg-surface-bright flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Current Instruction Spotlight */}
        <div className="p-space-lg space-y-space-md">
          <div className="p-space-lg bg-surface-container-lowest rounded-xl border border-primary/30 flex items-start gap-space-md relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 text-primary flex items-center justify-center shrink-0 border border-primary/40 shadow-lg">
              <span className="material-symbols-outlined text-[32px]">{currentStep.icon}</span>
            </div>
            <div className="space-y-1">
              <span className="font-label-caps text-label-caps text-tertiary uppercase font-bold">
                STEP {currentStepIndex + 1} OF {steps.length} • {currentStep.time}
              </span>
              <h4 className="font-headline-md text-headline-md text-on-surface leading-tight">
                {currentStep.title}
              </h4>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {currentStep.detail}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between font-label-caps text-label-caps text-on-surface-variant">
              <span>Tarnaka Departure</span>
              <span>Ameerpet X-fer</span>
              <span>Cyber Towers</span>
            </div>
            <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Real-time Telemetry strip */}
          <div className="grid grid-cols-3 gap-2 text-center font-telemetry-sm text-xs text-on-surface-variant bg-surface-container-low p-3 rounded-xl border border-surface-container-high/30">
            <div>
              <span className="text-outline block">SPEED</span>
              <span className="text-on-surface font-bold text-sm">62 km/h</span>
            </div>
            <div>
              <span className="text-outline block">TRAINSET</span>
              <span className="text-primary font-bold text-sm">M-304</span>
            </div>
            <div>
              <span className="text-outline block">LINE STATUS</span>
              <span className="text-tertiary font-bold text-sm">Nominal (Clear)</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between gap-space-sm">
            <button
              onClick={() => setActiveModal(null)}
              className="px-5 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-md text-label-md cursor-pointer border border-surface-container-highest"
            >
              Exit Guidance
            </button>
            <button
              onClick={handleNextStep}
              className="flex-1 py-2.5 px-6 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-headline-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{currentStepIndex === steps.length - 1 ? 'Finish Trip' : 'Simulate Next Step'}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
