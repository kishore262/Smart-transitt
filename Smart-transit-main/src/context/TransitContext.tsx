import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  COMMUTER_ROUTES,
  RouteOption,
  INITIAL_SAVED_ROUTES,
  SavedRoute,
  INITIAL_ALERTS,
  CommuterAlert,
} from '../utils/transitData';
import { HYDERABAD_LOCATION_NAMES } from '../utils/hyderabadGeo';

export type AppTab = 'home' | 'my-routes' | 'alerts' | 'profile' | 'admin';

export interface IncidentLog {
  id: string;
  time: string;
  type: 'info' | 'warning' | 'delay' | 'cleared';
  text: string;
  corridor?: string;
}

export interface TransitAsset {
  id: string;
  code: string;
  name: string;
  type: 'metro' | 'bus' | 'mmts';
  line: 'BLUE' | 'RED' | 'BUS' | 'MMTS' | string;
  model: string;
  config: string;
  sector: string;
  headwayDrift: string;
  speed: string;
  loadFactor: number;
  driftStatus: 'nominal' | 'delay' | 'disruption';
  scadaHealth: string;
  scadaStatus: string;
  actionTaken?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  mobile: string;
  avatarColor: string;
  avatarIcon: string;
  isGuest: boolean;
  joinedDate: string;
}

export interface PassengerInfo {
  id: string;
  name: string;
  age: number;
  type: 'Adult' | 'Senior' | 'Student' | 'Child';
}

export type TicketStatus = 'Valid' | 'Verified / Scanned' | 'Completed';

export interface BookedTicket {
  id: string; // e.g. HST-2026-4892
  routeTitle: string;
  from: string;
  to: string;
  mode: 'Metro' | 'Bus' | 'MMTS' | 'Multi-Modal';
  lineOrBusNo?: string;
  boardingStop?: string;
  destinationStop?: string;
  duration: string;
  unitFare: number;
  totalFare: string; // e.g. "₹135"
  passengers: PassengerInfo[];
  bookingDate: string;
  bookingTime: string;
  status: TicketStatus;
  verifiedAt?: string;
  transfersText?: string;
}

const DEFAULT_USER: UserProfile = {
  name: 'Jash',
  email: 'jash@example.com',
  mobile: '+91 98765 43210',
  avatarColor: 'from-blue-600 to-indigo-700',
  avatarIcon: 'person',
  isGuest: false,
  joinedDate: 'October 2026',
};

const INITIAL_INCIDENT_LOGS: IncidentLog[] = [
  {
    id: 'log-1',
    time: '14:22:10',
    type: 'info',
    text: 'Ameerpet Line 1 ⇄ 3 transfer headway synchronized to 3.5m',
    corridor: 'Corridor III',
  },
  {
    id: 'log-2',
    time: '14:18:45',
    type: 'warning',
    text: 'Begumpet Flyover surface congestion reported on Bus Route 10H',
    corridor: 'Trunk Bus',
  },
  {
    id: 'log-3',
    time: '14:12:00',
    type: 'info',
    text: 'SCR MMTS Local 47154 departed Sitafalmandi on schedule',
    corridor: 'MMTS Commuter',
  },
];

const INITIAL_ASSETS: TransitAsset[] = [
  {
    id: 'HM-BL-014',
    code: 'HM-BL-014',
    name: 'HM-BL-014 (Metro Line 3)',
    type: 'metro',
    line: 'BLUE',
    model: 'Hyundai Rotem 3-Car Rake',
    config: 'CBTC GoA2 Active',
    sector: 'Begumpet ⇄ Ameerpet',
    headwayDrift: '+0.0s (Nominal)',
    speed: '48 km/h',
    loadFactor: 64,
    driftStatus: 'nominal',
    scadaHealth: '100% OK',
    scadaStatus: 'Nominal',
  },
  {
    id: 'TG-10H-842',
    code: 'TG-10H-842',
    name: 'TG-10H-842 (TGSRTC Express)',
    type: 'bus',
    line: 'BUS',
    model: 'Olectra K9 Electric Low-Floor',
    config: 'ITS GPS Connected',
    sector: 'Begumpet Flyover Junction',
    headwayDrift: '+8.2 min delay',
    speed: '24 km/h',
    loadFactor: 88,
    driftStatus: 'delay',
    scadaHealth: '94% Telemetry',
    scadaStatus: 'Slow Traffic',
  },
  {
    id: 'MMTS-S1-09',
    code: 'MMTS-S1-09',
    name: 'MMTS-S1-09 (SCR Local)',
    type: 'mmts',
    line: 'MMTS',
    model: 'ICF 12-Car EMU Commuter',
    config: 'SCR Solid State Interlocking',
    sector: 'Sitafalmandi ⇄ Hi-Tech MMTS',
    headwayDrift: '+1.5 min buffer',
    speed: '56 km/h',
    loadFactor: 72,
    driftStatus: 'nominal',
    scadaHealth: '98% Signal OK',
    scadaStatus: 'Nominal',
  },
];

// Initial realistic demo booked tickets history
const INITIAL_BOOKED_TICKETS: BookedTicket[] = [
  {
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
    passengers: [
      { id: 'p-1', name: 'Jash', age: 28, type: 'Adult' },
    ],
    bookingDate: '03 Oct 2026',
    bookingTime: '08:30 AM',
    status: 'Valid',
    transfersText: '1 transfer (Ameerpet)',
  },
  {
    id: 'HST-2026-8314',
    routeTitle: 'TGSRTC Bus 10H Express via Begumpet',
    from: 'Secunderabad',
    to: 'Gachibowli',
    mode: 'Bus',
    lineOrBusNo: 'Bus 10H Express',
    boardingStop: 'Secunderabad Station Bus Bay 3',
    destinationStop: 'Gachibowli Junction',
    duration: '62 min',
    unitFare: 30,
    totalFare: '₹90',
    passengers: [
      { id: 'p-1', name: 'Jash', age: 28, type: 'Adult' },
      { id: 'p-2', name: 'Sneha', age: 26, type: 'Adult' },
      { id: 'p-3', name: 'Rohan', age: 8, type: 'Child' },
    ],
    bookingDate: '02 Oct 2026',
    bookingTime: '02:15 PM',
    status: 'Verified / Scanned',
    verifiedAt: '02:22 PM',
    transfersText: 'Direct (0 transfers)',
  },
  {
    id: 'HST-2026-6190',
    routeTitle: 'SCR MMTS Suburban Local 47154',
    from: 'Begumpet',
    to: 'Lingampalli',
    mode: 'MMTS',
    lineOrBusNo: 'SCR MMTS Local 47154',
    boardingStop: 'Begumpet Platform 2',
    destinationStop: 'Lingampalli Station',
    duration: '38 min',
    unitFare: 20,
    totalFare: '₹40',
    passengers: [
      { id: 'p-1', name: 'Jash', age: 28, type: 'Adult' },
      { id: 'p-2', name: 'Aditya', age: 29, type: 'Adult' },
    ],
    bookingDate: '01 Oct 2026',
    bookingTime: '10:45 AM',
    status: 'Completed',
    verifiedAt: '10:52 AM',
    transfersText: 'Direct (0 transfers)',
  },
];

interface TransitContextType {
  // Navigation & Tabs
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;

  // Authentication & Commuter Profile
  isAuthenticated: boolean;
  currentUser: UserProfile;
  loginUser: (emailOrMobile: string, name?: string, mobile?: string) => void;
  signUpUser: (name: string, email: string, mobile: string) => void;
  continueAsGuest: () => void;
  updateUserProfile: (updated: Partial<UserProfile>) => void;
  logoutUser: () => void;

  // Search & Journey Planning
  fromLocation: string;
  setFromLocation: (loc: string) => void;
  toLocation: string;
  setToLocation: (loc: string) => void;
  swapLocations: () => void;
  travelPreference: 'fastest' | 'cheapest' | 'transfers';
  setTravelPreference: (pref: 'fastest' | 'cheapest' | 'transfers') => void;

  // Route State
  routesGenerated: boolean;
  setRoutesGenerated: (val: boolean) => void;
  selectedRouteId: number;
  setSelectedRouteId: (id: number) => void;
  currentRoute: RouteOption;

  // Saved Routes
  savedRoutes: SavedRoute[];
  saveCurrentRoute: () => void;
  planSavedRoute: (route: SavedRoute) => void;

  // Multi-Passenger Ticket Bookings & 2-QR System
  bookedTickets: BookedTicket[];
  activeTicket: BookedTicket | null;
  setActiveTicket: (ticket: BookedTicket | null) => void;
  createBooking: (bookingInput: {
    from: string;
    to: string;
    routeTitle: string;
    mode: 'Metro' | 'Bus' | 'MMTS' | 'Multi-Modal';
    lineOrBusNo?: string;
    boardingStop?: string;
    destinationStop?: string;
    duration: string;
    unitFare: number;
    passengers: PassengerInfo[];
    transfersText?: string;
  }) => BookedTicket;
  verifyTicket: (ticketId: string) => void;
  openBookingModal: (route?: RouteOption) => void;
  openTicketModal: (ticket: BookedTicket) => void;

  // Commuter Alerts
  alerts: CommuterAlert[];

  // Incidents & Assets (Admin telemetry)
  incidentLogs: IncidentLog[];
  addIncidentLog: (log: Omit<IncidentLog, 'id'>) => void;
  isSimulatedJam: boolean;
  setIsSimulatedJam: (val: boolean) => void;
  assets: TransitAsset[];
  updateAssetAction: (id: string, action: string) => void;

  // Modals & Navigation HUD
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  modalData: any;
  setModalData: (data: any) => void;

  // Reusable Guided Smooth Scrolling
  scrollToSection: (sectionId: string) => void;

  // Toasts
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const TransitContext = createContext<TransitContextType | undefined>(undefined);

export const TransitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<AppTab>('home');

  // Authentication & Profile state with localStorage persistence
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const storedAuth = localStorage.getItem('hyd_transit_auth');
      return storedAuth === 'true';
    } catch {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem('hyd_transit_user');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return DEFAULT_USER;
  });

  // Search & Journey Planning
  const [fromLocation, setFromLocation] = useState<string>('Tarnaka');
  const [toLocation, setToLocation] = useState<string>('HITEC City');
  const [travelPreference, setTravelPreference] = useState<'fastest' | 'cheapest' | 'transfers'>('fastest');

  const [routesGenerated, setRoutesGenerated] = useState<boolean>(true); // default true for instant rich demo
  const [selectedRouteId, setSelectedRouteId] = useState<number>(1);
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>(INITIAL_SAVED_ROUTES);
  const [alerts] = useState<CommuterAlert[]>(INITIAL_ALERTS);

  // Multi-Passenger Ticket Bookings
  const [bookedTickets, setBookedTickets] = useState<BookedTicket[]>(() => {
    try {
      const stored = localStorage.getItem('hyd_transit_bookings');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return INITIAL_BOOKED_TICKETS;
  });

  const [activeTicket, setActiveTicket] = useState<BookedTicket | null>(() => {
    return bookedTickets[0] || null;
  });

  const [incidentLogs, setIncidentLogs] = useState<IncidentLog[]>(INITIAL_INCIDENT_LOGS);
  const [isSimulatedJam, setIsSimulatedJam] = useState<boolean>(true);
  const [assets, setAssets] = useState<TransitAsset[]>(INITIAL_ASSETS);

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentRoute = COMMUTER_ROUTES[selectedRouteId] || COMMUTER_ROUTES[1];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Auth Functions
  const loginUser = (emailOrMobile: string, name?: string, mobile?: string) => {
    let resolvedName = name || 'Jash';
    let resolvedEmail = emailOrMobile.includes('@') ? emailOrMobile : 'jash@example.com';
    let resolvedMobile = !emailOrMobile.includes('@') ? emailOrMobile : mobile || '+91 98765 43210';

    if (!name && emailOrMobile.includes('@')) {
      const prefix = emailOrMobile.split('@')[0];
      resolvedName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }

    const newUser: UserProfile = {
      name: resolvedName,
      email: resolvedEmail,
      mobile: resolvedMobile,
      avatarColor: 'from-blue-600 to-indigo-700',
      avatarIcon: 'person',
      isGuest: false,
      joinedDate: 'October 2026',
    };

    setCurrentUser(newUser);
    setIsAuthenticated(true);
    setActiveTab('home');

    try {
      localStorage.setItem('hyd_transit_auth', 'true');
      localStorage.setItem('hyd_transit_user', JSON.stringify(newUser));
    } catch {}

    showToast(`Welcome back, ${resolvedName}!`);
  };

  const signUpUser = (name: string, email: string, mobile: string) => {
    const newUser: UserProfile = {
      name: name.trim() || 'Jash',
      email: email.trim() || 'jash@example.com',
      mobile: mobile.trim() || '+91 98765 43210',
      avatarColor: 'from-emerald-600 to-teal-700',
      avatarIcon: 'badge',
      isGuest: false,
      joinedDate: 'October 2026',
    };

    setCurrentUser(newUser);
    setIsAuthenticated(true);
    setActiveTab('home');

    try {
      localStorage.setItem('hyd_transit_auth', 'true');
      localStorage.setItem('hyd_transit_user', JSON.stringify(newUser));
    } catch {}

    showToast(`Account created! Welcome to Hyderabad Smart Transit, ${newUser.name}.`);
  };

  const continueAsGuest = () => {
    const guestUser: UserProfile = {
      name: 'Guest User',
      email: 'guest@hydtransit.ai',
      mobile: '—',
      avatarColor: 'from-slate-600 to-slate-800',
      avatarIcon: 'person_outline',
      isGuest: true,
      joinedDate: 'October 2026',
    };

    setCurrentUser(guestUser);
    setIsAuthenticated(true);
    setActiveTab('home');

    try {
      localStorage.setItem('hyd_transit_auth', 'true');
      localStorage.setItem('hyd_transit_user', JSON.stringify(guestUser));
    } catch {}

    showToast('Browsing as Guest. You can plan any route across Hyderabad!');
  };

  const updateUserProfile = (updated: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      const nextUser = { ...prev, ...updated };
      try {
        localStorage.setItem('hyd_transit_user', JSON.stringify(nextUser));
      } catch {}
      return nextUser;
    });
    showToast('Profile updated successfully');
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('hyd_transit_auth');
    } catch {}
    showToast('Logged out of Hyderabad Smart Transit');
  };

  // Ticket Booking Functions
  const createBooking = (bookingInput: {
    from: string;
    to: string;
    routeTitle: string;
    mode: 'Metro' | 'Bus' | 'MMTS' | 'Multi-Modal';
    lineOrBusNo?: string;
    boardingStop?: string;
    destinationStop?: string;
    duration: string;
    unitFare: number;
    passengers: PassengerInfo[];
    transfersText?: string;
  }): BookedTicket => {
    const passengerCount = Math.max(1, bookingInput.passengers.length);
    const calculatedTotal = bookingInput.unitFare * passengerCount;

    // Generate unique booking ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `HST-2026-${randomSuffix}`;

    const now = new Date();
    const bookingDate = '03 Oct 2026';
    const bookingTime = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newTicket: BookedTicket = {
      id: bookingId,
      routeTitle: bookingInput.routeTitle,
      from: bookingInput.from,
      to: bookingInput.to,
      mode: bookingInput.mode,
      lineOrBusNo: bookingInput.lineOrBusNo,
      boardingStop: bookingInput.boardingStop,
      destinationStop: bookingInput.destinationStop,
      duration: bookingInput.duration,
      unitFare: bookingInput.unitFare,
      totalFare: `₹${calculatedTotal}`,
      passengers: bookingInput.passengers,
      bookingDate,
      bookingTime,
      status: 'Valid',
      transfersText: bookingInput.transfersText || 'Direct (0 transfers)',
    };

    setBookedTickets((prev) => {
      const updated = [newTicket, ...prev];
      try {
        localStorage.setItem('hyd_transit_bookings', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setActiveTicket(newTicket);
    setActiveModal('qr-ticket');

    showToast(`Booking ${bookingId} confirmed! Generated 2 QR codes for ${passengerCount} passenger${passengerCount > 1 ? 's' : ''}.`);

    return newTicket;
  };

  // Conductor Scan Simulation
  const verifyTicket = (ticketId: string) => {
    const target = bookedTickets.find((t) => t.id === ticketId);
    if (!target) return;

    if (target.status === 'Verified / Scanned') {
      showToast(`Ticket ${ticketId} is already verified and scanned.`);
      return;
    }

    const verificationTime = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    setBookedTickets((prev) => {
      const updated = prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: 'Verified / Scanned' as TicketStatus,
              verifiedAt: verificationTime,
            }
          : t
      );
      try {
        localStorage.setItem('hyd_transit_bookings', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setActiveTicket((prev) =>
      prev && prev.id === ticketId
        ? {
            ...prev,
            status: 'Verified / Scanned',
            verifiedAt: verificationTime,
          }
        : prev
    );

    showToast(`Ticket Verified ✓ Conductor scan accepted at ${verificationTime}.`);
  };

  const openBookingModal = (route?: RouteOption) => {
    const selected = route || currentRoute;
    const mode: 'Metro' | 'Bus' | 'MMTS' | 'Multi-Modal' =
      selected.modes.length > 2 && selected.modes.includes('metro') && selected.modes.includes('bus')
        ? 'Multi-Modal'
        : selected.modes.includes('metro')
        ? 'Metro'
        : selected.modes.includes('bus')
        ? 'Bus'
        : selected.modes.includes('mmts')
        ? 'MMTS'
        : 'Metro';

    const unitFareNum = parseInt(selected.fare.replace(/\D/g, '') || '45', 10);

    setModalData({
      routeTitle: selected.title,
      from: fromLocation || 'Tarnaka',
      to: toLocation || 'HITEC City',
      mode,
      unitFare: unitFareNum,
      duration: selected.duration,
      transfersText: selected.transferText,
      badgeTitle: selected.badgeTitle,
    });

    setActiveModal('booking');
  };

  const openTicketModal = (ticket: BookedTicket) => {
    setActiveTicket(ticket);
    setActiveModal('qr-ticket');
  };

  const swapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
    showToast(`Swapped: ${toLocation} ⇄ ${temp}`);
  };

  const scrollToSection = (sectionId: string) => {
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 120);
  };

  const saveCurrentRoute = () => {
    const newRoute: SavedRoute = {
      id: `fav-${Date.now()}`,
      icon: '⭐',
      title: `${fromLocation} → ${toLocation}`,
      from: fromLocation,
      to: toLocation,
      preferredMode: currentRoute.badgeTitle,
      avgTime: currentRoute.duration,
      fare: currentRoute.fare,
    };
    setSavedRoutes((prev) => [newRoute, ...prev]);
    showToast(`Saved route: ${fromLocation} → ${toLocation}`);
  };

  const planSavedRoute = (route: SavedRoute) => {
    setFromLocation(route.from);
    setToLocation(route.to);
    setRoutesGenerated(true);
    setActiveTab('home');
    scrollToSection('route-results-section');
    showToast(`Loaded saved route: ${route.title}`);
  };

  const addIncidentLog = (log: Omit<IncidentLog, 'id'>) => {
    const newLog: IncidentLog = {
      id: `log-${Date.now()}`,
      ...log,
    };
    setIncidentLogs((prev) => [newLog, ...prev]);
  };

  const updateAssetAction = (id: string, action: string) => {
    setAssets((prev) =>
      prev.map((asset) => (asset.id === id ? { ...asset, actionTaken: action } : asset))
    );
    showToast(`Action dispatched for ${id}: ${action}`);
  };

  return (
    <TransitContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isAuthenticated,
        currentUser,
        loginUser,
        signUpUser,
        continueAsGuest,
        updateUserProfile,
        logoutUser,
        fromLocation,
        setFromLocation,
        toLocation,
        setToLocation,
        swapLocations,
        travelPreference,
        setTravelPreference,
        routesGenerated,
        setRoutesGenerated,
        selectedRouteId,
        setSelectedRouteId,
        currentRoute,
        savedRoutes,
        saveCurrentRoute,
        planSavedRoute,
        bookedTickets,
        activeTicket,
        setActiveTicket,
        createBooking,
        verifyTicket,
        openBookingModal,
        openTicketModal,
        alerts,
        incidentLogs,
        addIncidentLog,
        isSimulatedJam,
        setIsSimulatedJam,
        assets,
        updateAssetAction,
        activeModal,
        setActiveModal,
        modalData,
        setModalData,
        scrollToSection,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </TransitContext.Provider>
  );
};

export const useTransit = () => {
  const context = useContext(TransitContext);
  if (!context) {
    throw new Error('useTransit must be used within a TransitProvider');
  }
  return context;
};
