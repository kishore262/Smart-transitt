import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTransit, BookedTicket } from '../context/TransitContext';
import { QRCodeRenderer } from './QRCodeRenderer';

export const QrTicketModal: React.FC = () => {
  const { activeModal, setActiveModal, activeTicket, verifyTicket, showToast } = useTransit();

  const isOpen = activeModal === 'qr-ticket';

  // Active QR focus: 'both' | 'confirmation' | 'conductor'
  const [activeTab, setActiveTab] = useState<'both' | 'confirmation' | 'conductor'>('both');

  // Zoomed QR Modal: 'confirmation' | 'conductor' | null
  const [enlargedQr, setEnlargedQr] = useState<'confirmation' | 'conductor' | null>(null);

  // Verification celebration visual
  const [justVerified, setJustVerified] = useState<boolean>(false);

  // 1. Lock background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // 2. Allow Escape key to close the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (enlargedQr) {
          setEnlargedQr(null);
        } else if (isOpen) {
          setActiveModal(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, enlargedQr, setActiveModal]);

  if (!isOpen) return null;

  // Derive dynamic or fallback ticket data
  const ticket: BookedTicket = activeTicket || {
    id: 'HST-2026-4892',
    routeTitle: 'Metro Blue Line Direct via Ameerpet',
    from: 'Tarnaka',
    to: 'HITEC City',
    mode: 'Metro',
    lineOrBusNo: 'Corridor III (Blue Line)',
    boardingStop: 'Tarnaka Metro Gate 2',
    destinationStop: 'HITEC City Concourse',
    duration: '48 min',
    unitFare: 45,
    totalFare: '₹45',
    passengers: [{ id: 'p-1', name: 'Jash', age: 28, type: 'Adult' }],
    bookingDate: '03 Oct 2026',
    bookingTime: '08:30 AM',
    status: 'Valid',
    transfersText: '1 transfer (Ameerpet)',
  };

  const isVerified = ticket.status === 'Verified / Scanned';
  const passengerCount = ticket.passengers.length;

  // QR 1 — BOOKING CONFIRMATION PAYLOAD
  const confirmationPayload = JSON.stringify({
    qrType: 'BOOKING_CONFIRMATION',
    bookingId: ticket.id,
    authority: 'HYD SMART TRANSIT AI',
    route: `${ticket.from} → ${ticket.to}`,
    mode: ticket.mode,
    service: ticket.lineOrBusNo || `${ticket.mode} Service`,
    passengersCount: passengerCount,
    passengerNames: ticket.passengers.map((p) => p.name).join(', '),
    totalFare: ticket.totalFare,
    date: ticket.bookingDate,
    time: ticket.bookingTime,
    status: ticket.status,
  });

  // QR 2 — CONDUCTOR SCAN VALIDATION PAYLOAD
  const conductorScanPayload = JSON.stringify({
    qrType: 'CONDUCTOR_SCAN',
    ticketId: ticket.id,
    validationHash: `VALID-${ticket.id}-${ticket.bookingTime}`,
    origin: ticket.from,
    destination: ticket.to,
    mode: ticket.mode,
    manifest: ticket.passengers.map((p) => ({ n: p.name, a: p.age, t: p.type })),
    totalPaid: ticket.totalFare,
    status: ticket.status,
    scannedAt: ticket.verifiedAt || null,
  });

  // Handle Conductor Scan Simulation
  const handleSimulateScan = () => {
    if (isVerified) {
      showToast(`Ticket ${ticket.id} is already verified and scanned.`);
      return;
    }
    verifyTicket(ticket.id);
    setJustVerified(true);
    setTimeout(() => setJustVerified(false), 3500);
  };

  // Handle Download ticket action
  const handleDownload = () => {
    try {
      const passengerListText = ticket.passengers
        .map((p, idx) => `  ${idx + 1}. ${p.name} (Age: ${p.age}, Type: ${p.type})`)
        .join('\n');

      const ticketContent = `
=============================================
           HYD SMART TRANSIT AI
          DIGITAL TRANSIT TICKET
=============================================
Booking ID:     ${ticket.id}
Route:          ${ticket.from} → ${ticket.to}
Transport Mode: ${ticket.mode} (${ticket.lineOrBusNo || ''})
Date & Time:    ${ticket.bookingDate} · ${ticket.bookingTime}
Total Fare:     ${ticket.totalFare}
Ticket Status:  ${ticket.status} ${ticket.verifiedAt ? `(Scanned at ${ticket.verifiedAt})` : ''}

PASSENGERS (${passengerCount}):
${passengerListText}

QR CODES INCLUDED:
1. Booking Confirmation QR (Receipt & Itinerary)
2. Conductor Scan QR (Turnstile & Bus Conductor Gate Checkpoint)

Scan at AFC turnstiles or show to TGSRTC / Metro Conductor.
Authority: Hyderabad Metropolitan Urban Mobility Authority
=============================================
      `.trim();

      const blob = new Blob([ticketContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${ticket.id}-Hyderabad-Transit-Ticket.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(`Ticket ${ticket.id} downloaded successfully!`);
    } catch {
      showToast('Digital Ticket saved to device!');
    }
  };

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ticket-heading"
      onClick={() => setActiveModal(null)}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      style={{ margin: 0 }}
    >
      {/* Centered Ticket Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 bg-white text-slate-900 rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[94vh]"
      >
        {/* Top Accent Strip */}
        <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 w-full shrink-0" />

        {/* Modal Header */}
        <div className="pt-4 px-5 pb-3 flex items-center justify-between border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200">
              HYD
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 block">
                HYD SMART TRANSIT AI
              </span>
              <h2 id="ticket-heading" className="text-base sm:text-lg font-headline font-bold text-slate-900 leading-tight">
                Digital Transit Ticket
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                isVerified
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-blue-50 text-blue-800 border-blue-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${isVerified ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`}
              />
              <span>{isVerified ? 'Ticket Verified ✓' : 'Valid · Ready to Scan'}</span>
            </span>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              title="Close (Esc)"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Verification Success Toast Banner inside modal */}
        {justVerified && (
          <div className="p-3 bg-emerald-600 text-white text-xs font-bold flex items-center justify-between px-5 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>Ticket Verified Successfully! All {passengerCount} passenger{passengerCount > 1 ? 's' : ''} authorized for entry.</span>
            </div>
            <span className="text-[11px] font-mono opacity-90">{ticket.verifiedAt}</span>
          </div>
        )}

        {/* Scrollable Ticket Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* 1. JOURNEY & TICKET SPECS */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs font-extrabold text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                {ticket.id}
              </span>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <span className="px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-200 font-bold">
                  {ticket.mode === 'Metro' ? '🚇 Metro' : ticket.mode === 'Bus' ? '🚌 Bus' : ticket.mode === 'MMTS' ? '🚆 MMTS' : '🔄 Multi-Modal'}
                </span>
                <span>•</span>
                <span className="font-bold text-emerald-700 text-sm">{ticket.totalFare}</span>
                <span>•</span>
                <span>{passengerCount} Passenger{passengerCount > 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-lg sm:text-xl font-headline font-extrabold text-slate-900">
              <span>{ticket.from}</span>
              <span className="text-blue-600">→</span>
              <span>{ticket.to}</span>
            </div>

            {/* Passenger Names List */}
            <div className="pt-2 border-t border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-bold text-slate-700">Passenger Manifest:</span>
                <span>{ticket.bookingDate} · {ticket.bookingTime}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ticket.passengers.map((p, idx) => (
                  <span
                    key={p.id}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-2xs"
                  >
                    <strong className="text-blue-700">{idx + 1}.</strong> {p.name} ({p.age}y, {p.type})
                  </span>
                ))}
              </div>
            </div>

            {/* Verification Timestamp if scanned */}
            {ticket.verifiedAt && (
              <div className="pt-2 border-t border-emerald-200 flex items-center justify-between text-xs text-emerald-800 font-semibold bg-emerald-50/70 p-2 rounded-xl">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                  <span>Conductor Scanned &amp; Cleared</span>
                </span>
                <span className="font-mono">{ticket.verifiedAt}</span>
              </div>
            )}
          </div>

          {/* 2. QR VIEW TAB SELECTOR */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Two QR Codes for this Booking:
            </h3>

            <div className="flex bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('both')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'both' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Both QRs
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('confirmation')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'confirmation' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Booking QR
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('conductor')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'conductor' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. Conductor QR
              </button>
            </div>
          </div>

          {/* 3. THE TWO QR SECTIONS */}
          <div
            className={`grid gap-4 ${
              activeTab === 'both' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-sm mx-auto'
            }`}
          >
            {/* ========================================================
                QR 1 — BOOKING CONFIRMATION QR
                ======================================================== */}
            {(activeTab === 'both' || activeTab === 'confirmation') && (
              <div className="bg-slate-50 rounded-2xl p-4 border border-blue-200/80 flex flex-col items-center text-center space-y-3 relative hover:border-blue-400 transition-colors group">
                {/* QR 1 Label & Badge */}
                <div className="space-y-0.5 w-full">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase tracking-wider border border-blue-200">
                    QR 1 — Confirmation
                  </span>
                  <h4 className="text-sm font-headline font-bold text-slate-900">
                    Booking Confirmation QR
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Used to confirm and view complete booking details &amp; receipt
                  </p>
                </div>

                {/* QR Code Graphic (Click to Enlarge) */}
                <div
                  onClick={() => setEnlargedQr('confirmation')}
                  className="p-2.5 bg-white rounded-2xl border-2 border-blue-200 shadow-xs cursor-pointer group-hover:shadow-md transition-shadow relative"
                  title="Click to view large Booking Confirmation QR"
                >
                  <QRCodeRenderer
                    value={confirmationPayload}
                    size={activeTab === 'both' ? 180 : 220}
                    className="w-[160px] h-[160px] sm:w-[180px] sm:h-[180px]"
                  />
                  <div className="absolute inset-0 bg-blue-600/5 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-2 py-1 rounded bg-slate-900/80 text-white text-[10px] font-bold">
                      Tap to Enlarge
                    </span>
                  </div>
                </div>

                {/* QR 1 Metadata Summary */}
                <div className="w-full bg-white p-2.5 rounded-xl border border-slate-200 text-left text-[11px] space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Booking ID:</span>
                    <span className="font-mono font-bold text-slate-900">{ticket.id}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Passengers:</span>
                    <span className="font-bold text-slate-900">{passengerCount} Person{passengerCount > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Total Fare:</span>
                    <span className="font-extrabold text-blue-700">{ticket.totalFare}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEnlargedQr('confirmation')}
                  className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                  <span>View Large Confirmation QR</span>
                </button>
              </div>
            )}

            {/* ========================================================
                QR 2 — CONDUCTOR SCAN VALIDATION QR
                ======================================================== */}
            {(activeTab === 'both' || activeTab === 'conductor') && (
              <div className="bg-slate-50 rounded-2xl p-4 border border-emerald-300 flex flex-col items-center text-center space-y-3 relative hover:border-emerald-500 transition-colors group">
                {/* QR 2 Label & Badge */}
                <div className="space-y-0.5 w-full">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-200">
                    QR 2 — Validation
                  </span>
                  <h4 className="text-sm font-headline font-bold text-slate-900">
                    Conductor Scan QR
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Official validation QR for conductor &amp; automated turnstile gate
                  </p>
                </div>

                {/* QR Code Graphic (Click to Enlarge) */}
                <div
                  onClick={() => setEnlargedQr('conductor')}
                  className="p-2.5 bg-white rounded-2xl border-2 border-emerald-300 shadow-xs cursor-pointer group-hover:shadow-md transition-shadow relative"
                  title="Click to view large Conductor Scan QR"
                >
                  <QRCodeRenderer
                    value={conductorScanPayload}
                    size={activeTab === 'both' ? 180 : 220}
                    className="w-[160px] h-[160px] sm:w-[180px] sm:h-[180px]"
                  />
                  <div className="absolute inset-0 bg-emerald-600/5 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-2 py-1 rounded bg-slate-900/80 text-white text-[10px] font-bold">
                      Tap to Enlarge
                    </span>
                  </div>
                </div>

                {/* QR 2 Status & Conductor Action */}
                <div className="w-full bg-white p-2.5 rounded-xl border border-slate-200 text-left text-[11px] space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Validation Status:</span>
                    <span className={`font-bold ${isVerified ? 'text-emerald-700' : 'text-blue-700'}`}>
                      {ticket.status}
                    </span>
                  </div>
                  {ticket.verifiedAt && (
                    <div className="flex justify-between text-slate-600">
                      <span>Scanned Time:</span>
                      <span className="font-mono font-bold text-emerald-700">{ticket.verifiedAt}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Manifest Verified:</span>
                    <span className="font-bold text-slate-900">{passengerCount} Name{passengerCount > 1 ? 's' : ''} Checked</span>
                  </div>
                </div>

                {/* SIMULATE CONDUCTOR SCAN BUTTON */}
                <button
                  type="button"
                  onClick={handleSimulateScan}
                  disabled={isVerified}
                  className={`w-full py-2.5 px-3 rounded-xl font-headline font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isVerified
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">
                    {isVerified ? 'check_circle' : 'qr_code_scanner'}
                  </span>
                  <span>
                    {isVerified ? `Ticket Verified ✓ (${ticket.verifiedAt})` : 'Simulate Conductor Scan'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-headline font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Download Ticket &amp; QRs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-headline font-semibold text-xs sm:text-sm border border-slate-300 transition-colors cursor-pointer text-center"
          >
            Close
          </button>
        </div>
      </div>

      {/* ========================================================
          ENLARGED INDIVIDUAL QR MODAL (When tapping either QR)
          ======================================================== */}
      {enlargedQr && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setEnlargedQr(null)}
          className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 bg-white text-slate-900 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-center flex flex-col items-center"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setEnlargedQr(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center text-sm font-bold cursor-pointer"
            >
              ✕
            </button>

            {/* Title & Badge */}
            <div className="space-y-1">
              <span
                className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                  enlargedQr === 'confirmation'
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                }`}
              >
                {enlargedQr === 'confirmation' ? 'Booking Confirmation QR' : 'Conductor Scan QR'}
              </span>
              <h3 className="font-headline font-bold text-lg text-slate-900">
                {ticket.from} → {ticket.to}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {ticket.id} · {ticket.totalFare} ({passengerCount} Pax)
              </p>
            </div>

            {/* LARGE QR DISPLAY (240px x 240px) */}
            <div className="p-3 bg-white rounded-2xl border-2 border-slate-300 shadow-md">
              <QRCodeRenderer
                value={enlargedQr === 'confirmation' ? confirmationPayload : conductorScanPayload}
                size={240}
                className="w-[220px] h-[220px]"
              />
            </div>

            {/* Conductor Simulation button if Conductor QR is open */}
            {enlargedQr === 'conductor' && (
              <button
                type="button"
                onClick={handleSimulateScan}
                disabled={isVerified}
                className={`w-full py-2.5 px-4 rounded-xl font-headline font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isVerified
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">
                  {isVerified ? 'check_circle' : 'qr_code_scanner'}
                </span>
                <span>
                  {isVerified ? `Ticket Verified ✓ (${ticket.verifiedAt})` : 'Simulate Conductor Scan'}
                </span>
              </button>
            )}

            <p className="text-xs text-slate-500 leading-tight">
              {enlargedQr === 'confirmation'
                ? 'Scan to view passenger manifest & payment receipt.'
                : 'Present this QR code at AFC turnstiles or bus conductor reader.'}
            </p>

            <button
              type="button"
              onClick={() => setEnlargedQr(null)}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
            >
              Back to Ticket Card
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(modalContent, document.body);
};
