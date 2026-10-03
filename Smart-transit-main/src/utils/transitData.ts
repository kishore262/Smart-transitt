export interface StepItem {
  id: number;
  instruction: string;
  detail: string;
  mode: 'walk' | 'metro' | 'bus' | 'mmts' | 'transfer';
  time: string;
  isTransfer?: boolean;
}

export interface RouteOption {
  id: number;
  preferenceCategory: 'fastest' | 'cheapest' | 'transfers';
  badgeTitle: string;
  title: string;
  summaryPath: string;
  duration: string;
  fare: string;
  transfersCount: number;
  transferText: string;
  modes: ('metro' | 'bus' | 'mmts' | 'walk')[];
  statusType: 'ontime' | 'delay' | 'disruption';
  statusText: string;
  aiReason: string;
  hasAlternative?: boolean;
  alternativeSuggestionId?: number;
  steps: StepItem[];
}

export const COMMUTER_ROUTES: Record<number, RouteOption> = {
  1: {
    id: 1,
    preferenceCategory: 'fastest',
    badgeTitle: 'FASTEST',
    title: 'Metro Blue Line Direct via Ameerpet',
    summaryPath: 'Tarnaka → Metro → HITEC City',
    duration: '48 min',
    fare: '₹45',
    transfersCount: 1,
    transferText: '1 transfer (Ameerpet)',
    modes: ['walk', 'metro', 'walk'],
    statusType: 'ontime',
    statusText: '🟢 On time (3.5 min headway)',
    aiReason: 'Recommended because it is fast, has only 1 transfer, and has no current delays along the Blue Line viaduct.',
    steps: [
      {
        id: 1,
        instruction: 'Walk 5 min',
        detail: 'Walk 200m from Tarnaka junction to Metro Gate 2 concourse.',
        mode: 'walk',
        time: '5 min',
      },
      {
        id: 2,
        instruction: 'Take Metro: Tarnaka → Ameerpet',
        detail: 'Board Blue Line Train (Towards Raidurg) from Platform 1. Pass 8 stations.',
        mode: 'metro',
        time: '18 min',
      },
      {
        id: 3,
        instruction: 'Change Metro at Ameerpet',
        detail: 'Cross-platform concourse transfer to Line 3 Cyberabad platform.',
        mode: 'transfer',
        time: '4 min',
        isTransfer: true,
      },
      {
        id: 4,
        instruction: 'Continue Metro: Ameerpet → HITEC City',
        detail: 'Blue Line train direct to HITEC City station (Cyber Towers exit).',
        mode: 'metro',
        time: '16 min',
      },
      {
        id: 5,
        instruction: 'Walk 5 min to destination',
        detail: 'Take covered pedestrian skywalk direct to Cyber Towers Gate 1.',
        mode: 'walk',
        time: '5 min',
      },
    ],
  },

  2: {
    id: 2,
    preferenceCategory: 'cheapest',
    badgeTitle: 'CHEAPEST',
    title: 'Direct TGSRTC Metro Express 10H',
    summaryPath: 'Tarnaka → Bus → HITEC City',
    duration: '62 min',
    fare: '₹30',
    transfersCount: 0,
    transferText: '0 transfers (Direct Bus)',
    modes: ['walk', 'bus', 'walk'],
    statusType: 'delay',
    statusText: '🟡 8 min delay near Begumpet Flyover',
    aiReason: 'Recommended if you want to save money with a single direct bus ride and zero station transfers.',
    hasAlternative: true,
    alternativeSuggestionId: 1,
    steps: [
      {
        id: 1,
        instruction: 'Walk 3 min to Tarnaka Bus Stand',
        detail: 'Main road boarding bay opposite railway gate.',
        mode: 'walk',
        time: '3 min',
      },
      {
        id: 2,
        instruction: 'Board Bus 10H / 127K Direct',
        detail: 'TGSRTC Metro Express via SP Road, Begumpet Flyover & Jubilee Checkpost.',
        mode: 'bus',
        time: '54 min',
      },
      {
        id: 3,
        instruction: 'Alight at Cyber Towers Stop',
        detail: 'Walk 100m to Cyber Towers entrance.',
        mode: 'walk',
        time: '5 min',
      },
    ],
  },

  3: {
    id: 3,
    preferenceCategory: 'transfers',
    badgeTitle: 'FEWEST TRANSFERS',
    title: 'MMTS Commuter Rail + Green Feeder',
    summaryPath: 'Tarnaka → MMTS → Bus → HITEC City',
    duration: '55 min',
    fare: '₹35',
    transfersCount: 1,
    transferText: '1 transfer (Hi-Tech MMTS)',
    modes: ['walk', 'mmts', 'bus', 'walk'],
    statusType: 'ontime',
    statusText: '🟢 On time (Punctual Railway Corridor)',
    aiReason: 'Recommended for minimal station congestion with dedicated suburban rail tracks and synchronized green electric shuttle.',
    steps: [
      {
        id: 1,
        instruction: 'Walk 6 min to Sitafalmandi Station',
        detail: 'Reach Platform 2 MMTS commuter terminal.',
        mode: 'walk',
        time: '6 min',
      },
      {
        id: 2,
        instruction: 'Take MMTS Train: Sitafalmandi → Hi-Tech City',
        detail: 'Suburban rail run via Secunderabad, Begumpet, Sanathnagar to Hi-Tech City MMTS.',
        mode: 'mmts',
        time: '34 min',
      },
      {
        id: 3,
        instruction: 'Transfer to Green Electric Shuttle',
        detail: 'Synchronized feeder bay at station exit.',
        mode: 'transfer',
        time: '3 min',
        isTransfer: true,
      },
      {
        id: 4,
        instruction: 'Feeder Bus to Cyber Towers',
        detail: 'Short electric coach down Hitec City Main Road.',
        mode: 'bus',
        time: '8 min',
      },
      {
        id: 5,
        instruction: 'Walk 4 min to destination',
        detail: 'Arrival at Cyber Towers.',
        mode: 'walk',
        time: '4 min',
      },
    ],
  },
};

export interface SavedRoute {
  id: string;
  icon: string;
  title: string;
  from: string;
  to: string;
  preferredMode: string;
  avgTime: string;
  fare: string;
}

export const INITIAL_SAVED_ROUTES: SavedRoute[] = [
  {
    id: 'fav-1',
    icon: '🏠',
    title: 'Home → Work',
    from: 'Tarnaka',
    to: 'HITEC City',
    preferredMode: 'Metro Blue Line',
    avgTime: '48 min',
    fare: '₹45',
  },
  {
    id: 'fav-2',
    icon: '🎓',
    title: 'Tarnaka → JNTU',
    from: 'Tarnaka',
    to: 'JNTU',
    preferredMode: 'Metro Line 3 ⇄ Line 1',
    avgTime: '52 min',
    fare: '₹50',
  },
  {
    id: 'fav-3',
    icon: '💼',
    title: 'Secunderabad → Gachibowli',
    from: 'Secunderabad',
    to: 'Gachibowli',
    preferredMode: 'Bus 216 / Feeder',
    avgTime: '46 min',
    fare: '₹35',
  },
];

export interface CommuterAlert {
  id: string;
  service: 'Metro' | 'Bus' | 'MMTS';
  level: 'green' | 'yellow' | 'red';
  title: string;
  location: string;
  message: string;
  timeAgo: string;
  hasAlternative?: boolean;
  alternativeRoute?: string;
}

export const INITIAL_ALERTS: CommuterAlert[] = [
  {
    id: 'alert-1',
    service: 'Metro',
    level: 'green',
    title: 'Corridor III (Nagole ⇄ Raidurg)',
    location: 'Ameerpet ⇄ HITEC City',
    message: 'All 24 trainsets running on optimal 3.5 min headway. Elevators and turnstiles nominal.',
    timeAgo: 'Just now',
  },
  {
    id: 'alert-2',
    service: 'Bus',
    level: 'yellow',
    title: 'TGSRTC Route 10H & 127K Surface Delay',
    location: 'Begumpet Flyover',
    message: 'Slow moving traffic near Begumpet Flyover adding approximately 8 minutes to bus journey.',
    timeAgo: '4 min ago',
    hasAlternative: true,
    alternativeRoute: 'Metro Corridor III via Ameerpet saves 14 mins.',
  },
  {
    id: 'alert-3',
    service: 'MMTS',
    level: 'yellow',
    title: 'MMTS Commuter Rail Signal Precedence',
    location: 'Sanathnagar ⇄ Bharat Nagar',
    message: 'Falaknuma - Lingampalli locals running with minor 4 to 5 min clearance delay.',
    timeAgo: '12 min ago',
  },
  {
    id: 'alert-4',
    service: 'Metro',
    level: 'green',
    title: 'Cyber Towers Skywalk Air Conditioning',
    location: 'HITEC City Metro Gate 1',
    message: 'Covered pedestrian skywalk to Cyber Towers is open with active cooling and moving walkways operational.',
    timeAgo: '20 min ago',
  },
];
