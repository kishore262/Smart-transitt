import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTransit, PassengerInfo } from '../context/TransitContext';

export const BookingModal: React.FC = () => {
  const { activeModal, setActiveModal, modalData, currentUser, createBooking, showToast } =
    useTransit();

  const isOpen = activeModal === 'booking';

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  // Allow Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setActiveModal]);

  // Booking form state
  const [passengerCount, setPassengerCount] = useState<number>(1);
  const [isFamilyBooking, setIsFamilyBooking] = useState<boolean>(false);
  const [passengers, setPassengers] = useState<PassengerInfo[]>([
    {
      id: 'p-1',
      name: currentUser?.name || 'Jash',
      age: 28,
      type: 'Adult',
    },
  ]);

  // Sync passenger list when count changes
  const handleCountChange = (newCount: number) => {
    const clamped = Math.max(1, Math.min(10, newCount));
    setPassengerCount(clamped);
    if (clamped > 1) {
      setIsFamilyBooking(true);
    }

    setPassengers((prev) => {
      const updated = [...prev];
      if (clamped > updated.length) {
        for (let i = updated.length; i < clamped; i++) {
          updated.push({
            id: `p-${i + 1}`,
            name: '',
            age: 25,
            type: 'Adult',
          });
        }
      } else {
        updated.splice(clamped);
      }
      return updated;
    });
  };

  // Update specific passenger field
  const handlePassengerChange = (
    index: number,
    field: keyof PassengerInfo,
    val: string | number
  ) => {
    setPassengers((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: val,
      };
      return copy;
    });
  };

  // Auto-fill demo family passengers
  const handleAutoFillFamily = () => {
    setIsFamilyBooking(true);
    setPassengerCount(3);
    setPassengers([
      { id: 'p-1', name: currentUser?.name || 'Jash', age: 28, type: 'Adult' },
      { id: 'p-2', name: 'Sneha', age: 26, type: 'Adult' },
      { id: 'p-3', name: 'Rohan', age: 8, type: 'Child' },
    ]);
    showToast('Auto-filled 3 family members (Jash, Sneha, Rohan)');
  };

  if (!isOpen) return null;

  const data = modalData || {};
  const from = data.from || 'Tarnaka';
  const to = data.to || 'HITEC City';
  const mode = data.mode || 'Metro';
  const unitFare = Number(data.unitFare) || 45;
  const duration = data.duration || '48 min';
  const routeTitle = data.routeTitle || `${mode} Transit Route`;
  const transfersText = data.transfersText || 'Direct';

  const totalFare = unitFare * passengerCount;

  // Mode-adaptive metadata
  const isBus = mode === 'Bus';
  const isMetro = mode === 'Metro';
  const isMMTS = mode === 'MMTS';
  const isMultiModal = mode === 'Multi-Modal';

  // Handle Form Submit
  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();

    // Fill default names if left empty
    const sanitizedPassengers: PassengerInfo[] = passengers.map((p, idx) => ({
      ...p,
      name: p.name.trim() || (idx === 0 ? currentUser?.name || 'Passenger 1' : `Passenger ${idx + 1}`),
    }));

    let lineOrBusNo = 'Corridor III (Blue Line)';
    let boardingStop = `${from} Station`;
    let destinationStop = `${to} Station`;

    if (isBus) {
      lineOrBusNo = 'TGSRTC Bus 10H Express';
      boardingStop = `${from} Bus Bay`;
      destinationStop = `${to} Bus Stop`;
    } else if (isMMTS) {
      lineOrBusNo = 'SCR MMTS Suburban Local 47154';
      boardingStop = `${from} Platform 2`;
      destinationStop = `${to} Station`;
    } else if (isMultiModal) {
      lineOrBusNo = 'Combined Metro + TGSRTC Feeder';
      boardingStop = `${from} Metro Gate`;
      destinationStop = `${to} Destination`;
    }

    createBooking({
      from,
      to,
      routeTitle,
      mode,
      lineOrBusNo,
      boardingStop,
      destinationStop,
      duration,
      unitFare,
      passengers: sanitizedPassengers,
      transfersText,
    });
  };

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      onClick={() => setActiveModal(null)}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      style={{ margin: 0 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 bg-white text-slate-900 rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]"
      >
        {/* Top Accent Strip */}
        <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 w-full shrink-0" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 block">
              HYD SMART TRANSIT AI
            </span>
            <h2 id="booking-modal-title" className="text-lg sm:text-xl font-headline font-bold text-slate-900">
              Book Transit Ticket
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setActiveModal(null)}
            title="Close (Esc)"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleConfirm} className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* 1. ROUTE & TRANSPORT MODE ADAPTIVE CARD */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-xs font-bold shadow-xs">
                <span>{isMetro ? '🚇 Metro' : isBus ? '🚌 TGSRTC Bus' : isMMTS ? '🚆 MMTS' : '🔄 Multi-Modal'}</span>
              </span>
              <span className="text-xs font-mono font-bold text-blue-900 bg-white px-2 py-0.5 rounded-md border border-blue-200">
                ₹{unitFare} / passenger
              </span>
            </div>

            <div className="flex items-center gap-2 text-base sm:text-lg font-headline font-extrabold text-slate-900">
              <span>{from}</span>
              <span className="text-blue-600">→</span>
              <span>{to}</span>
            </div>

            {/* Mode-Adaptive Details */}
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1 border-t border-blue-100/80">
              <div>
                <span className="font-semibold text-slate-500 block">
                  {isBus ? 'Bus Service:' : isMetro ? 'Metro Line:' : isMMTS ? 'Train Service:' : 'Transit Segments:'}
                </span>
                <span className="font-bold text-slate-800">
                  {isBus ? 'TGSRTC Bus 10H Express' : isMetro ? 'Corridor III (Blue Line)' : isMMTS ? 'SCR MMTS Local' : 'Metro + Bus Linked'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block">Travel Duration:</span>
                <span className="font-bold text-slate-800">{duration} · {transfersText}</span>
              </div>
            </div>
          </div>

          {/* 2. PASSENGER SELECTOR & FAMILY TOGGLE */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-headline font-bold text-slate-900">
                  Number of Passengers
                </h3>
                <p className="text-xs text-slate-500">
                  Select 1 to 10 passengers for this booking
                </p>
              </div>

              {/* Number Stepper (+ and - controls) */}
              <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-slate-200 shadow-xs self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleCountChange(passengerCount - 1)}
                  disabled={passengerCount <= 1}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 font-bold text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
                >
                  −
                </button>
                <span className="w-8 text-center font-headline font-extrabold text-slate-900 text-base">
                  {passengerCount}
                </span>
                <button
                  type="button"
                  onClick={() => handleCountChange(passengerCount + 1)}
                  disabled={passengerCount >= 10}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 font-bold text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* "Travelling with Family & Friends?" option */}
            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFamilyBooking || passengerCount > 1}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsFamilyBooking(checked);
                    if (checked && passengerCount === 1) {
                      handleCountChange(2);
                    } else if (!checked) {
                      handleCountChange(1);
                    }
                  }}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-800">
                  Travelling with Family &amp; Friends?
                </span>
              </label>

              <button
                type="button"
                onClick={handleAutoFillFamily}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                Demo: 3 Family Members
              </button>
            </div>
          </div>

          {/* 3. INDIVIDUAL PASSENGER DETAILS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Passenger Details ({passengerCount})
              </h3>
              <span className="text-[11px] text-slate-400">
                Generated under single Booking ID
              </span>
            </div>

            <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1">
              {passengers.map((passenger, idx) => (
                <div
                  key={passenger.id}
                  className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs grid grid-cols-12 gap-2.5 items-center"
                >
                  <div className="col-span-1 flex items-center justify-center">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                  </div>

                  {/* Name Input */}
                  <div className="col-span-6">
                    <input
                      type="text"
                      value={passenger.name}
                      onChange={(e) => handlePassengerChange(idx, 'name', e.target.value)}
                      placeholder={idx === 0 ? 'Passenger 1 (You)' : `Passenger ${idx + 1} Name`}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Age Input */}
                  <div className="col-span-2">
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={passenger.age}
                      onChange={(e) => handlePassengerChange(idx, 'age', parseInt(e.target.value) || 25)}
                      placeholder="Age"
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-center font-mono font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Category Dropdown */}
                  <div className="col-span-3">
                    <select
                      value={passenger.type}
                      onChange={(e) => handlePassengerChange(idx, 'type', e.target.value as any)}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Adult">Adult</option>
                      <option value="Senior">Senior (60+)</option>
                      <option value="Student">Student</option>
                      <option value="Child">Child (under 12)</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. PASSENGER SUMMARY & FARE CALCULATION */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Booking Summary
            </h4>
            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex flex-wrap gap-1.5">
                {passengers.map((p, idx) => (
                  <span
                    key={p.id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 font-medium"
                  >
                    <strong>{idx + 1}.</strong> {p.name || `Passenger ${idx + 1}`} ({p.age}y, {p.type})
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">
                {passengerCount} Passenger{passengerCount > 1 ? 's' : ''} × ₹{unitFare}
              </span>
              <span className="text-base sm:text-lg font-headline font-extrabold text-blue-700">
                Total: ₹{totalFare}
              </span>
            </div>
          </div>

          {/* 5. TWO QR NOTICE */}
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0 mt-0.5">
              qr_code_2
            </span>
            <div>
              <span className="font-bold block">Generates 2 Distinct QR Codes:</span>
              <span className="text-emerald-800 leading-tight">
                1) <strong>Booking Confirmation QR</strong> (digital receipt) &nbsp;•&nbsp; 2) <strong>Conductor Scan QR</strong> (validation for turnstile &amp; bus conductor).
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-headline font-bold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
              <span>Confirm Booking &amp; Generate 2 QRs (₹{totalFare})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-headline font-semibold text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
