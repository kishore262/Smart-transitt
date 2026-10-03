import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';

export const PushpakModal: React.FC = () => {
  const { activeModal, setActiveModal, showToast } = useTransit();
  const [selectedRoute, setSelectedRoute] = useState('AC-2');
  const [ticketBooked, setTicketBooked] = useState(false);

  if (activeModal !== 'pushpak') return null;

  const routes = [
    {
      id: 'AC-1',
      title: 'JBS Parade Ground ↔ RGIA Airport',
      via: 'via Secunderabad, Begumpet, Lakdikapul, PVNR Expressway',
      nextDep: '4 mins (JBS Platform 3)',
      fare: '₹250',
      duration: '45 mins',
      busNo: 'TG-PUSHPAK-108',
      seats: 19,
    },
    {
      id: 'AC-2',
      title: 'Shilparamam / HITEC City ↔ RGIA Airport',
      via: 'via Mindspace, Gachibowli ORR, Shamshabad Express',
      nextDep: '9 mins (Cyber Towers Stop)',
      fare: '₹300',
      duration: '38 mins',
      busNo: 'TG-PUSHPAK-214',
      seats: 27,
    },
    {
      id: 'AC-3',
      title: 'Secunderabad Stn ↔ RGIA Airport',
      via: 'via Tarnaka, Habsiguda, LB Nagar, Chandrayangutta',
      nextDep: '14 mins (Secunderabad West)',
      fare: '₹275',
      duration: '52 mins',
      busNo: 'TG-PUSHPAK-302',
      seats: 32,
    },
  ];

  const currentRouteObj = routes.find((r) => r.id === selectedRoute) || routes[1];

  const handleBook = () => {
    setTicketBooked(true);
    showToast(`Pushpak Airport Pass reserved on ${currentRouteObj.busNo}!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface-container rounded-2xl max-w-2xl w-full border border-secondary/40 shadow-2xl overflow-hidden flex flex-col relative animate-fadeIn">
        {/* Header */}
        <div className="p-space-lg bg-surface-container-high flex items-center justify-between border-b border-surface-container-highest">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center border border-secondary/30">
              <span className="material-symbols-outlined text-[24px]">flight_takeoff</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline-md text-headline-md text-on-surface">Pushpak Airport Liner</h3>
                <span className="px-2 py-0.5 rounded bg-tertiary/20 text-tertiary font-label-caps text-label-caps">
                  100% PUNCTUAL
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Luxury Electric Air-conditioned Express to Rajiv Gandhi International Airport (RGIA).
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveModal(null);
              setTicketBooked(false);
            }}
            className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface hover:bg-surface-bright flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-space-lg space-y-space-md max-h-[75vh] overflow-y-auto no-scrollbar">
          {!ticketBooked ? (
            <>
              <div>
                <span className="font-label-caps text-label-caps text-outline uppercase block mb-2">
                  Select Airport Corridor Route
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {routes.map((route) => {
                    const isSelected = selectedRoute === route.id;
                    return (
                      <div
                        key={route.id}
                        onClick={() => setSelectedRoute(route.id)}
                        className={`p-space-md rounded-xl transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-surface-container-highest border-secondary shadow-md'
                            : 'bg-surface-container-low hover:bg-surface-container border-surface-container-high/30'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-headline-sm text-headline-sm text-on-surface">
                                {route.title}
                              </span>
                              <span className="font-telemetry-sm text-telemetry-sm text-secondary font-semibold">
                                ({route.id})
                              </span>
                            </div>
                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{route.via}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-headline-md text-headline-md text-primary block">{route.fare}</span>
                            <span className="font-telemetry-sm text-telemetry-sm text-on-surface-variant">
                              {route.duration}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-surface-container-high/40 flex items-center justify-between text-xs font-telemetry-sm">
                          <span className="text-tertiary flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">timer</span> Next Departure: {route.nextDep}
                          </span>
                          <span className="text-on-surface-variant">
                            {route.seats} seats available • {route.busNo}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Luggage & Amenities Strip */}
              <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high/30 flex items-center justify-between text-xs text-on-surface-variant">
                <span className="flex items-center gap-1 text-primary">
                  <span className="material-symbols-outlined text-[16px]">luggage</span> 2 Check-in Bags Allowed Free
                </span>
                <span className="flex items-center gap-1 text-secondary">
                  <span className="material-symbols-outlined text-[16px]">wifi</span> Free 5G Onboard Wi-Fi
                </span>
                <span className="flex items-center gap-1 text-tertiary">
                  <span className="material-symbols-outlined text-[16px]">power</span> USB Charging at Every Seat
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <span className="text-xs text-on-surface-variant">Total Payable:</span>
                  <div className="font-headline-lg text-headline-lg text-primary">{currentRouteObj.fare}</div>
                </div>
                <button
                  onClick={handleBook}
                  className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-fixed text-on-primary font-headline-sm text-headline-sm transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">airplane_ticket</span>
                  <span>Instant Boarding Pass</span>
                </button>
              </div>
            </>
          ) : (
            <div className="py-6 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-tertiary/20 text-tertiary flex items-center justify-center border border-tertiary">
                <span className="material-symbols-outlined text-[36px]">check_circle</span>
              </div>
              <div>
                <h4 className="font-headline-md text-headline-md text-on-surface">Airport Express Pass Confirmed!</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Coach <strong className="text-secondary">{currentRouteObj.busNo}</strong> arriving in{' '}
                  <strong className="text-tertiary">{currentRouteObj.nextDep}</strong>.
                </p>
              </div>

              {/* Boarding Card Box */}
              <div className="w-full max-w-sm bg-surface-container-lowest p-4 rounded-xl border border-secondary/40 text-left space-y-2">
                <div className="flex justify-between border-b border-surface-container-high pb-2">
                  <div>
                    <span className="font-label-caps text-label-caps text-outline">PASSENGER PASS</span>
                    <div className="font-headline-sm text-headline-sm text-on-surface">{currentRouteObj.title}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-caps text-label-caps text-outline">FARE</span>
                    <div className="text-primary font-bold">{currentRouteObj.fare}</div>
                  </div>
                </div>
                <div className="flex items-center justify-center py-2">
                  <div className="w-32 h-32 bg-white p-2 rounded-lg flex items-center justify-center">
                    {/* Simulated QR Code SVG */}
                    <svg viewBox="0 0 100 100" className="w-full h-full text-black" fill="currentColor">
                      <rect x="0" y="0" width="30" height="30" />
                      <rect x="5" y="5" width="20" height="20" fill="white" />
                      <rect x="10" y="10" width="10" height="10" />
                      <rect x="70" y="0" width="30" height="30" />
                      <rect x="75" y="5" width="20" height="20" fill="white" />
                      <rect x="80" y="10" width="10" height="10" />
                      <rect x="0" y="70" width="30" height="30" />
                      <rect x="5" y="75" width="20" height="20" fill="white" />
                      <rect x="10" y="80" width="10" height="10" />
                      <rect x="40" y="10" width="10" height="20" />
                      <rect x="55" y="15" width="10" height="10" />
                      <rect x="40" y="40" width="20" height="20" />
                      <rect x="70" y="40" width="10" height="15" />
                      <rect x="40" y="70" width="15" height="15" />
                      <rect x="65" y="65" width="20" height="10" />
                      <rect x="65" y="80" width="25" height="10" />
                    </svg>
                  </div>
                </div>
                <p className="font-telemetry-sm text-[10px] text-center text-outline">
                  Scan at bus front conductor terminal. Valid for today's departure.
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveModal(null);
                  setTicketBooked(false);
                }}
                className="px-6 py-2 rounded-lg bg-surface-container-highest text-on-surface text-sm cursor-pointer hover:bg-surface-bright"
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
