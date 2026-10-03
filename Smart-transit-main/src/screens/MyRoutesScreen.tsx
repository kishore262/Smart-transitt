import React, { useState } from 'react';
import { useTransit, BookedTicket } from '../context/TransitContext';
import { SavedRoute } from '../utils/transitData';

export const MyRoutesScreen: React.FC = () => {
  const {
    savedRoutes,
    planSavedRoute,
    bookedTickets,
    openTicketModal,
    verifyTicket,
    setActiveTab,
  } = useTransit();

  // Active view: 'saved' | 'tickets'
  const [activeSection, setActiveSection] = useState<'tickets' | 'saved'>('tickets');

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-fadeIn font-body text-slate-900">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Commuter Travel Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-slate-900 tracking-tight">
            My Routes &amp; Tickets
          </h1>
          <p className="text-sm text-slate-500">
            View your active bookings with 2 QR codes, conductor scan history, and saved corridors.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('home')}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Plan New Journey</span>
        </button>
      </div>

      {/* Segmented Switcher: Booked Tickets vs Saved Routes */}
      <div className="flex bg-slate-100 p-1 rounded-2xl w-full max-w-md">
        <button
          type="button"
          onClick={() => setActiveSection('tickets')}
          className={`flex-1 py-2 px-3 text-xs sm:text-sm font-headline font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeSection === 'tickets'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
          <span>Booked Tickets ({bookedTickets.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('saved')}
          className={`flex-1 py-2 px-3 text-xs sm:text-sm font-headline font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeSection === 'saved'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">bookmark</span>
          <span>Saved Routes ({savedRoutes.length})</span>
        </button>
      </div>

      {/* ========================================================
          SECTION 1: BOOKED TICKETS & JOURNEY PASS HISTORY
          ======================================================== */}
      {activeSection === 'tickets' && (
        <div className="space-y-4">
          {bookedTickets.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[26px]">confirmation_number</span>
              </div>
              <h3 className="font-headline font-bold text-base text-slate-900">
                No Booked Tickets Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Book a transit ticket for Metro, TGSRTC, or MMTS from the Home screen. Every booking generates Two QR Codes with multi-passenger support.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              >
                <span>Book First Journey</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {bookedTickets.map((ticket: BookedTicket) => {
                const isVerified = ticket.status === 'Verified / Scanned';
                const isCompleted = ticket.status === 'Completed';

                return (
                  <div
                    key={ticket.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-all space-y-4"
                  >
                    {/* Top Row: Booking ID, Mode, Status */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                          {ticket.id}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1">
                          <span>
                            {ticket.mode === 'Metro'
                              ? '🚇 Metro'
                              : ticket.mode === 'Bus'
                              ? '🚌 TGSRTC Bus'
                              : ticket.mode === 'MMTS'
                              ? '🚆 MMTS'
                              : '🔄 Multi-Modal'}
                          </span>
                        </span>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                          isVerified
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : isCompleted
                            ? 'bg-slate-100 text-slate-700 border-slate-200'
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isVerified
                              ? 'bg-emerald-500'
                              : isCompleted
                              ? 'bg-slate-400'
                              : 'bg-blue-500 animate-pulse'
                          }`}
                        />
                        <span>
                          {isVerified
                            ? `Verified / Scanned ${ticket.verifiedAt ? `(${ticket.verifiedAt})` : ''}`
                            : ticket.status}
                        </span>
                      </span>
                    </div>

                    {/* Route Path & Fare */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2 text-base sm:text-lg font-headline font-extrabold text-slate-900">
                          <span>{ticket.from}</span>
                          <span className="text-blue-600">→</span>
                          <span>{ticket.to}</span>
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          {ticket.lineOrBusNo || ticket.routeTitle} · {ticket.duration}
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="text-lg font-headline font-extrabold text-emerald-700">
                          {ticket.totalFare}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {ticket.passengers.length} Passenger{ticket.passengers.length > 1 ? 's' : ''} (₹{ticket.unitFare} ea)
                        </div>
                      </div>
                    </div>

                    {/* Passenger Manifest Summary */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-bold text-slate-700">Passengers:</span>
                        {ticket.passengers.map((p, idx) => (
                          <span
                            key={p.id}
                            className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 text-slate-800"
                          >
                            {idx + 1}. {p.name} ({p.type})
                          </span>
                        ))}
                      </div>

                      <div className="text-slate-500 font-mono text-[11px]">
                        Booked: {ticket.bookingDate} · {ticket.bookingTime}
                      </div>
                    </div>

                    {/* Action Buttons: View 2 QRs + Conductor Scan Simulation */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => openTicketModal(ticket)}
                        className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-headline font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                        <span>View Ticket &amp; 2 QR Codes</span>
                      </button>

                      {!isVerified && !isCompleted && (
                        <button
                          type="button"
                          onClick={() => verifyTicket(ticket.id)}
                          className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-headline font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[17px]">qr_code_scanner</span>
                          <span>Simulate Conductor Scan</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          SECTION 2: SAVED ROUTES LIST
          ======================================================== */}
      {activeSection === 'saved' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedRoutes.map((route: SavedRoute) => (
              <div
                key={route.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{route.icon}</span>
                      <h3 className="font-headline font-bold text-base text-slate-900">{route.title}</h3>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      {route.fare}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                    <span className="text-slate-900 font-bold">{route.from}</span>
                    <span className="text-slate-400">→</span>
                    <span className="text-slate-900 font-bold">{route.to}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-blue-600">directions_transit</span>
                      {route.preferredMode}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-slate-500">timer</span>
                      ~{route.avgTime}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => planSavedRoute(route)}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-headline font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer border border-blue-200"
                >
                  <span className="material-symbols-outlined text-[18px]">alt_route</span>
                  <span>Plan Route</span>
                </button>
              </div>
            ))}
          </div>

          {/* Helpful Tip */}
          <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200 text-xs text-slate-600 flex items-center gap-3">
            <span className="material-symbols-outlined text-blue-600 text-[20px]">lightbulb</span>
            <span>
              Tip: You can save any route from the Home screen by clicking <strong>Save to My Routes</strong> in the Journey Details section.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
