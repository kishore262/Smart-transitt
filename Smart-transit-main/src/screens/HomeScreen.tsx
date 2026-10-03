import React, { useState, useRef, useEffect } from 'react';
import { useTransit } from '../context/TransitContext';
import { HYDERABAD_LOCATION_NAMES } from '../utils/hyderabadGeo';
import { COMMUTER_ROUTES, RouteOption } from '../utils/transitData';
import { HyderabadTransitMap } from '../components/HyderabadTransitMap';

export const HomeScreen: React.FC = () => {
  const {
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
    saveCurrentRoute,
    setActiveModal,
    setModalData,
    scrollToSection,
    showToast,
    openBookingModal,
  } = useTransit();

  const [validationError, setValidationError] = useState<string | null>(null);
  const [currentStage, setCurrentStage] = useState<'plan' | 'preference' | 'routes' | 'journey'>('plan');
  
  // Track route being transitioned into view for immediate visual feedback
  const [transitioningRouteId, setTransitioningRouteId] = useState<number | null>(null);
  // Numeric trigger to ensure navigation executes on EVERY single click, even if same route re-selected
  const [navigationTrigger, setNavigationTrigger] = useState<number>(0);

  const carouselRef = useRef<HTMLDivElement>(null);
  const journeySectionRef = useRef<HTMLElement>(null);

  // Quick chips for popular commuter hubs
  const popularHubs = ['Tarnaka', 'Ameerpet', 'HITEC City', 'Secunderabad', 'MGBS', 'JNTU', 'Gachibowli'];

  // Scroll carousel left or right
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // STEP 1: Handle selecting "From" location
  const handleSelectFrom = (val: string) => {
    setFromLocation(val);
    setValidationError(null);
    showToast(`Starting location: ${val}`);

    // If destination already chosen, automatically advance to Step 2 (Preference)
    if (toLocation && toLocation !== val) {
      setCurrentStage('preference');
      scrollToSection('travel-preference-section');
    }
  };

  // STEP 1: Handle selecting "To" location
  const handleSelectTo = (val: string) => {
    setToLocation(val);
    setValidationError(null);
    showToast(`Destination: ${val}`);

    // Both locations selected: automatically advance to Step 2 (Preference)
    if (fromLocation && fromLocation !== val) {
      setCurrentStage('preference');
      scrollToSection('travel-preference-section');
    }
  };

  // STEP 2: Handle selecting preference
  const handleSelectPreference = (pref: 'fastest' | 'cheapest' | 'transfers') => {
    setTravelPreference(pref);
    showToast(`Preference set to ${pref.toUpperCase()}`);

    // Set corresponding default route
    if (pref === 'fastest') setSelectedRouteId(1);
    else if (pref === 'cheapest') setSelectedRouteId(2);
    else if (pref === 'transfers') setSelectedRouteId(3);

    // Auto-generate routes and automatically transition to Step 3 (Routes)
    setRoutesGenerated(true);
    setCurrentStage('routes');
    scrollToSection('route-results-section');
  };

  // Handle "Find My Route" click
  const handleFindRoutes = () => {
    if (!fromLocation) {
      setValidationError('Please choose your starting location.');
      scrollToSection('search-section');
      return;
    }
    if (!toLocation) {
      setValidationError('Please choose your destination.');
      scrollToSection('search-section');
      return;
    }
    if (fromLocation === toLocation) {
      setValidationError('Starting point and destination cannot be identical.');
      scrollToSection('search-section');
      return;
    }

    setValidationError(null);
    setRoutesGenerated(true);
    setCurrentStage('routes');
    showToast(`Finding optimal routes for ${fromLocation} → ${toLocation}...`);

    // Smoothly scroll down to the Horizontal Route Results section
    scrollToSection('route-results-section');
  };

  // STEP 3: Handle selecting a route card
  // SINGLE CLICK executes the complete flow:
  // 1. Immediately sets route as selected
  // 2. Provides instant button visual feedback: "Opening Route..."
  // 3. Updates route details, map, timeline, and AI recommendation
  // 4. Triggers automatic transition to Journey Details + Map
  const handleSelectRouteCard = (routeId: number) => {
    setTransitioningRouteId(routeId);
    setSelectedRouteId(routeId);
    setRoutesGenerated(true);
    setCurrentStage('journey');
    setNavigationTrigger((prev) => prev + 1);

    showToast(`Selected ${COMMUTER_ROUTES[routeId].badgeTitle}: ${COMMUTER_ROUTES[routeId].summaryPath}`);
  };

  // RELIABLE STATE-DRIVEN EFFECT FOR AUTOMATIC TRANSITION AFTER RENDERING
  // Guarantees that Journey Details exists and DOM has updated before smooth-scrolling
  useEffect(() => {
    if (navigationTrigger === 0) return;

    let rafId: number;
    let timerId: NodeJS.Timeout;

    // Use requestAnimationFrame to coordinate with browser repaint
    rafId = requestAnimationFrame(() => {
      // Small timeout to allow React to mount/update the DOM and Leaflet to settle
      timerId = setTimeout(() => {
        const targetEl = journeySectionRef.current || document.getElementById('journey-details-section');
        if (targetEl) {
          const headerOffset = 76; // Sticky header offset
          const rect = targetEl.getBoundingClientRect();
          const targetY = window.pageYOffset + rect.top - headerOffset;

          window.scrollTo({
            top: Math.max(0, targetY),
            behavior: 'smooth',
          });
        }
        // Reset transitioning indicator once scroll has commenced
        setTransitioningRouteId(null);
      }, 50);
    });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
    };
  }, [navigationTrigger, selectedRouteId]);

  // Handle "View Alternative" on delayed routes (reuses the same reliable single-click flow)
  const handleViewAlternative = (alternativeId: number) => {
    handleSelectRouteCard(alternativeId);
    showToast(`Switched to faster on-time alternative: ${COMMUTER_ROUTES[alternativeId].badgeTitle}`);
  };

  // Handle Navigation Modal
  const handleStartNavigation = () => {
    setModalData({
      routeTitle: currentRoute.title,
      origin: fromLocation,
      destination: toLocation,
      duration: currentRoute.duration,
      fare: currentRoute.fare,
      steps: currentRoute.steps,
    });
    setActiveModal('navigation');
  };

  // Handle Ticket Booking & 2-QR modal view
  const handleBuyTicket = (targetRoute?: RouteOption) => {
    openBookingModal(targetRoute || currentRoute);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* 0. GUIDED STAGE PROGRESS INDICATOR (Plan → Preferences → Routes → Journey) */}
      <nav
        aria-label="Journey Progress"
        className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-xs flex items-center justify-between overflow-x-auto scrollbar-none"
      >
        <div className="flex items-center gap-1 sm:gap-2 min-w-max text-xs sm:text-sm font-semibold">
          {/* Step 1: Plan */}
          <button
            type="button"
            onClick={() => {
              setCurrentStage('plan');
              scrollToSection('search-section');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              currentStage === 'plan'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px] font-bold">
              1
            </span>
            <span>Plan</span>
          </button>

          <span className="text-slate-300">→</span>

          {/* Step 2: Preferences */}
          <button
            type="button"
            onClick={() => {
              setCurrentStage('preference');
              scrollToSection('travel-preference-section');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              currentStage === 'preference'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px] font-bold">
              2
            </span>
            <span>Preferences</span>
          </button>

          <span className="text-slate-300">→</span>

          {/* Step 3: Routes */}
          <button
            type="button"
            onClick={() => {
              if (routesGenerated) {
                setCurrentStage('routes');
                scrollToSection('route-results-section');
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              currentStage === 'routes'
                ? 'bg-blue-600 text-white shadow-xs'
                : routesGenerated
                ? 'text-slate-700 hover:bg-slate-100'
                : 'text-slate-400 cursor-not-allowed opacity-60'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px] font-bold">
              3
            </span>
            <span>Routes</span>
          </button>

          <span className="text-slate-300">→</span>

          {/* Step 4: Journey & Map */}
          <button
            type="button"
            onClick={() => {
              if (routesGenerated) {
                setCurrentStage('journey');
                setNavigationTrigger((prev) => prev + 1);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              currentStage === 'journey'
                ? 'bg-blue-600 text-white shadow-xs'
                : routesGenerated
                ? 'text-slate-700 hover:bg-slate-100'
                : 'text-slate-400 cursor-not-allowed opacity-60'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px] font-bold">
              4
            </span>
            <span>Your Journey</span>
          </button>
        </div>

        {/* Quick summary chip */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
          <span>{fromLocation || 'Tarnaka'}</span>
          <span>→</span>
          <span>{toLocation || 'HITEC City'}</span>
        </div>
      </nav>

      {/* 1. SEARCH SECTION (STEP 1: PLAN) */}
      <section
        id="search-section"
        className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-5 scroll-mt-20 transition-all"
      >
        <div className="space-y-1">
          <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase">
            Step 1 · Where are you going?
          </span>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-slate-900 tracking-tight">
            Plan Your Hyderabad Transit Journey
          </h1>
          <p className="text-sm text-slate-500">
            Choose your origin and destination. We will automatically find the best multimodal connections.
          </p>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-2 animate-fadeIn">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{validationError}</span>
          </div>
        )}

        {/* Input Fields with Swap Button */}
        <div className="relative space-y-3">
          {/* Starting Location (From) */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span>From: Starting Location</span>
            </label>
            <div className="relative">
              <select
                value={fromLocation}
                onChange={(e) => handleSelectFrom(e.target.value)}
                className="w-full px-4 py-3.5 pr-10 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
              >
                <option value="">-- Choose Starting Point --</option>
                {HYDERABAD_LOCATION_NAMES.map((name) => (
                  <option key={`from-${name}`} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Swap Button Floating in the middle */}
          <div className="flex justify-end sm:justify-center -my-1 relative z-10">
            <button
              onClick={swapLocations}
              type="button"
              title="Swap Locations"
              className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 w-9 h-9 rounded-full shadow-sm flex items-center justify-center transition-transform hover:rotate-180 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">swap_vert</span>
            </button>
          </div>

          {/* Destination Location (To) */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
              <span>To: Destination</span>
            </label>
            <div className="relative">
              <select
                value={toLocation}
                onChange={(e) => handleSelectTo(e.target.value)}
                className="w-full px-4 py-3.5 pr-10 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
              >
                <option value="">-- Choose Destination --</option>
                {HYDERABAD_LOCATION_NAMES.map((name) => (
                  <option key={`to-${name}`} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Quick Location Chips */}
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Quick Interchange Hubs:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {popularHubs.map((hub) => (
              <button
                key={hub}
                type="button"
                onClick={() => handleSelectTo(hub)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  toLocation === hub
                    ? 'bg-blue-600 text-white border-blue-600 font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {hub}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. TRAVEL PREFERENCE SECTION (STEP 2: PREFERENCE) */}
      <section
        id="travel-preference-section"
        className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-4 scroll-mt-20 transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase">
              Step 2 · Travel Preference
            </span>
            <h2 className="text-lg sm:text-xl font-headline font-bold text-slate-900">
              How would you like to travel?
            </h2>
            <p className="text-xs text-slate-500">
              Click a travel style to immediately generate and preview corresponding routes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Fastest */}
          <button
            type="button"
            onClick={() => handleSelectPreference('fastest')}
            className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center sm:flex-col sm:items-start gap-3 hover:-translate-y-0.5 ${
              travelPreference === 'fastest'
                ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                : 'bg-slate-50/70 hover:bg-slate-100/70 border-slate-200 text-slate-700'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                travelPreference === 'fastest' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">bolt</span>
            </div>
            <div>
              <span className="font-headline font-bold text-sm sm:text-base text-slate-900 block">
                Fastest
              </span>
              <span className="text-xs text-slate-500 block">Shortest travel duration (~48 min)</span>
            </div>
          </button>

          {/* Cheapest */}
          <button
            type="button"
            onClick={() => handleSelectPreference('cheapest')}
            className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center sm:flex-col sm:items-start gap-3 hover:-translate-y-0.5 ${
              travelPreference === 'cheapest'
                ? 'bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-600/20 shadow-xs'
                : 'bg-slate-50/70 hover:bg-slate-100/70 border-slate-200 text-slate-700'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                travelPreference === 'cheapest' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </div>
            <div>
              <span className="font-headline font-bold text-sm sm:text-base text-slate-900 block">
                Cheapest
              </span>
              <span className="text-xs text-slate-500 block">Lowest ticket fare (~₹30 direct bus)</span>
            </div>
          </button>

          {/* Fewer Transfers */}
          <button
            type="button"
            onClick={() => handleSelectPreference('transfers')}
            className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center sm:flex-col sm:items-start gap-3 hover:-translate-y-0.5 ${
              travelPreference === 'transfers'
                ? 'bg-purple-50/90 border-purple-600 ring-2 ring-purple-600/20 shadow-xs'
                : 'bg-slate-50/70 hover:bg-slate-100/70 border-slate-200 text-slate-700'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                travelPreference === 'transfers' ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">sync_disabled</span>
            </div>
            <div>
              <span className="font-headline font-bold text-sm sm:text-base text-slate-900 block">
                Fewer Transfers
              </span>
              <span className="text-xs text-slate-500 block">Direct or dedicated rail (~₹35)</span>
            </div>
          </button>
        </div>

        {/* Find My Route Action Button */}
        <div id="find-routes-section" className="pt-2">
          <button
            onClick={handleFindRoutes}
            type="button"
            className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-headline font-bold text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">directions</span>
            <span>Find My Route</span>
          </button>
        </div>
      </section>

      {/* 3. HORIZONTAL ROUTE OPTIONS (STEP 3: ROUTES) */}
      {routesGenerated && (
        <section id="route-results-section" className="space-y-4 pt-2 scroll-mt-20 animate-fadeIn">
          {/* Header Row with Carousel Nav Buttons */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                Step 3 · Choose Your Route
              </span>
              <h2 className="text-xl sm:text-2xl font-headline font-bold text-slate-900">
                Available Routes for {fromLocation} → {toLocation}
              </h2>
              <p className="text-xs text-slate-500">
                A single click on <strong>View Route</strong> immediately updates the map and opens your complete journey.
              </p>
            </div>

            {/* Carousel navigation buttons for smaller screens */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollCarousel('left')}
                className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer shadow-xs"
                title="Previous route"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel('right')}
                className="w-8 h-8 rounded-full border border-slate-300 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer shadow-xs"
                title="Next route"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>

          {/* AI Recommendation Banner (Compact, friendly 1-2 sentences) */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50/70 border border-blue-200 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wide">
                AI Recommendation for {travelPreference.toUpperCase()}
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-snug">
                {currentRoute.aiReason}
              </p>
            </div>
          </div>

          {/* HORIZONTAL ROUTE CARDS: Row of 3 on Desktop, Swipeable Carousel on Mobile */}
          <div
            ref={carouselRef}
            className="flex md:grid md:grid-cols-3 gap-3.5 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-none"
          >
            {[1, 2, 3].map((id) => {
              const route = COMMUTER_ROUTES[id];
              const isSelected = selectedRouteId === id;
              const isTransitioning = transitioningRouteId === id;

              return (
                <div
                  key={route.id}
                  onClick={() => handleSelectRouteCard(route.id)}
                  className={`min-w-[280px] sm:min-w-[320px] md:min-w-0 snap-center shrink-0 md:shrink rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 ${
                    isSelected
                      ? 'bg-blue-50/50 border-blue-600 ring-2 ring-blue-600/20 shadow-md'
                      : isTransitioning
                      ? 'bg-blue-50/30 border-blue-400 ring-2 ring-blue-400/20 shadow-sm'
                      : 'bg-white hover:bg-slate-50/90 border-slate-200 shadow-xs hover:shadow'
                  }`}
                >
                  {/* Top category & Status */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[11px] font-extrabold tracking-wider uppercase ${
                          route.id === 1
                            ? 'bg-blue-100 text-blue-800'
                            : route.id === 2
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {route.badgeTitle}
                      </span>
                      <span className="text-[11px] font-medium text-slate-600 truncate max-w-[140px]">
                        {route.statusText.split(' ')[0]} {route.statusText.includes('delay') ? 'Delay' : 'On time'}
                      </span>
                    </div>

                    {/* Summary Path */}
                    <h3 className="font-headline font-bold text-base sm:text-lg text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {route.summaryPath}
                    </h3>

                    {/* Specs Row: Time • Fare • Transfers */}
                    <div className="flex items-center gap-2 text-xs text-slate-600 font-medium py-1">
                      <span className="font-bold text-slate-900 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-blue-600">schedule</span>
                        {route.duration}
                      </span>
                      <span>•</span>
                      <span className="font-bold text-emerald-700">{route.fare}</span>
                      <span>•</span>
                      <span className="text-slate-500">{route.transferText.split('(')[0].trim()}</span>
                    </div>
                  </div>

                  {/* Mode Badges & View Route Action Button */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-xs">
                      {route.modes.includes('metro') && (
                        <span className="p-1 bg-blue-100 text-blue-700 rounded-md" title="Metro">
                          🚇
                        </span>
                      )}
                      {route.modes.includes('bus') && (
                        <span className="p-1 bg-emerald-100 text-emerald-700 rounded-md" title="Bus">
                          🚌
                        </span>
                      )}
                      {route.modes.includes('mmts') && (
                        <span className="p-1 bg-purple-100 text-purple-700 rounded-md" title="MMTS">
                          🚆
                        </span>
                      )}
                      {route.modes.includes('walk') && (
                        <span className="p-1 bg-slate-100 text-slate-600 rounded-md" title="Walk">
                          🚶
                        </span>
                      )}
                    </div>

                    {/* Interactive Buttons: View QR Ticket + View Route */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuyTicket(route);
                        }}
                        title="View QR Ticket for this route"
                        className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-colors cursor-pointer flex items-center justify-center shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[17px]">qr_code_2</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectRouteCard(route.id);
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : isTransitioning
                            ? 'bg-blue-500 text-white animate-pulse'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-blue-700'
                        }`}
                      >
                        {isTransitioning ? (
                          <>
                            <span className="material-symbols-outlined text-[15px] animate-spin">progress_activity</span>
                            <span>Opening Route...</span>
                          </>
                        ) : isSelected ? (
                          <>
                            <span className="material-symbols-outlined text-[15px]">check_circle</span>
                            <span>Viewing Route ✓</span>
                          </>
                        ) : (
                          <>
                            <span>View Route</span>
                            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. JOURNEY DETAILS & DYNAMIC MAP (STEP 4: TWO-COLUMN DESKTOP LAYOUT) */}
      {routesGenerated && (
        <section
          ref={journeySectionRef}
          id="journey-details-section"
          className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6 scroll-mt-24 animate-fadeIn"
        >
          {/* Header Row: "## Your Journey" */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Step 4 · Your Journey Details
                </span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-blue-800 uppercase tracking-wider">
                  {currentRoute.badgeTitle}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {currentRoute.statusText}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-headline font-bold text-slate-900 mt-1">
                Your Journey: {currentRoute.summaryPath}
              </h2>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 mt-1.5 font-medium">
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-blue-600">schedule</span>
                  {currentRoute.duration}
                </span>
                <span>•</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">payments</span>
                  {currentRoute.fare}
                </span>
                <span>•</span>
                <span className="text-slate-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-purple-600">sync_alt</span>
                  {currentRoute.transferText}
                </span>
              </div>
            </div>

            {/* Action Buttons: View QR Ticket & Save Route */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => handleBuyTicket()}
                type="button"
                className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-blue-600">confirmation_number</span>
                <span>Book Ticket &amp; 2 QRs</span>
              </button>

              <button
                onClick={saveCurrentRoute}
                type="button"
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px] text-amber-500">bookmark</span>
                <span>Save Route</span>
              </button>
            </div>
          </div>

          {/* Real-time delay warning with Alternative suggestion if delayed */}
          {currentRoute.hasAlternative && currentRoute.alternativeSuggestionId && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-amber-600 text-[20px] mt-0.5">warning</span>
                <div>
                  <h4 className="text-sm font-bold text-amber-900">Route Advisory</h4>
                  <p className="text-xs text-amber-800 leading-snug">
                    Your selected Bus route has an 8-min delay near Begumpet Flyover. We recommend Metro Corridor III to save 14 minutes.
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleViewAlternative(currentRoute.alternativeSuggestionId!)}
                type="button"
                className="shrink-0 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
              >
                View Alternative
              </button>
            </div>
          )}

          {/* TWO-COLUMN LAYOUT ON DESKTOP:
              LEFT: Step-by-Step Directions
              RIGHT: Real Hyderabad Leaflet Map */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN (Turn-by-turn directions & actions) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-headline font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[20px] text-blue-600">alt_route</span>
                  <span>Step-by-Step Directions</span>
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  {currentRoute.steps.length} segments
                </span>
              </div>

              {/* Vertical Timeline */}
              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {currentRoute.steps.map((step, idx) => {
                  let badgeBg = 'bg-blue-600 text-white';
                  if (step.mode === 'walk') badgeBg = 'bg-slate-400 text-white';
                  if (step.mode === 'bus') badgeBg = 'bg-emerald-600 text-white';
                  if (step.mode === 'mmts') badgeBg = 'bg-purple-600 text-white';
                  if (step.isTransfer) badgeBg = 'bg-amber-500 text-white ring-2 ring-amber-300';

                  return (
                    <div key={step.id} className="relative group">
                      {/* Node Dot */}
                      <div
                        className={`absolute -left-6 top-1 w-5 h-5 rounded-full ${badgeBg} flex items-center justify-center text-[10px] font-bold shadow-xs`}
                      >
                        {idx + 1}
                      </div>

                      <div className="space-y-0.5 bg-slate-50/60 p-2.5 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs sm:text-sm font-bold text-slate-900">
                            {step.instruction}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 font-mono shrink-0">
                            {step.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{step.detail}</p>
                        {step.isTransfer && (
                          <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-amber-700">
                            <span className="material-symbols-outlined text-[13px]">sync_alt</span>
                            <span>Key Transfer Point</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons: Start Navigation & Buy QR */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={handleStartNavigation}
                  type="button"
                  className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-headline font-bold text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">navigation</span>
                  <span>Start Navigation</span>
                </button>

                <button
                  onClick={() => handleBuyTicket()}
                  type="button"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-headline font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
                >
                  <span className="material-symbols-outlined text-[18px] text-blue-600">confirmation_number</span>
                  <span>Book Multi-Passenger Ticket &amp; 2 QRs ({currentRoute.fare})</span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN (Real Interactive Hyderabad Leaflet Map) */}
            <div id="map-section" className="lg:col-span-7 space-y-2 scroll-mt-24 relative z-0">
              <div className="flex items-center justify-between text-xs text-slate-600 pb-1">
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-blue-600">map</span>
                  <span>Hyderabad Geographic Route Map</span>
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Showing: <strong className="text-blue-700 font-semibold">{currentRoute.badgeTitle}</strong>
                </span>
              </div>

              {/* The Real Leaflet OpenStreetMap Component */}
              <HyderabadTransitMap
                fromLocationName={fromLocation}
                toLocationName={toLocation}
                selectedRouteId={selectedRouteId}
                showRoutePath={true}
                className="h-[380px] sm:h-[480px] lg:h-[540px] w-full"
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
