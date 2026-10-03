import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import { TransitLogo } from '../components/Logo';

export const LoginScreen: React.FC = () => {
  const { loginUser, signUpUser, continueAsGuest, showToast } = useTransit();

  // Mode: 'login' or 'signup'
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Form inputs
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign up fields
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupMobile, setSignupMobile] = useState('');

  // Form state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot password dialog
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // Handle Login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const identifier = emailOrMobile.trim();
    if (!identifier) {
      setErrorMessage('Please enter your email address or mobile number.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      loginUser(identifier);
      setIsSubmitting(false);
    }, 250);
  };

  // Handle Sign Up submission
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!signupMobile.trim() || signupMobile.length < 8) {
      setErrorMessage('Please enter a valid mobile number.');
      return;
    }
    if (!password.trim() || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      signUpUser(fullName, signupEmail, signupMobile);
      setIsSubmitting(false);
    }, 250);
  };

  // Pre-fill sample credentials for rapid evaluation
  const handleDemoFill = () => {
    if (mode === 'login') {
      setEmailOrMobile('jash@example.com');
      setPassword('Hyderabad2026!');
      setErrorMessage(null);
      showToast('Demo credentials filled (jash@example.com)');
    } else {
      setFullName('Jash');
      setSignupEmail('jash@example.com');
      setSignupMobile('9876543210');
      setPassword('Hyderabad2026!');
      setErrorMessage(null);
      showToast('Sample registration details filled');
    }
  };

  return (
    <div className="w-screen h-screen min-h-screen overflow-x-hidden overflow-y-auto lg:overflow-hidden bg-slate-900 flex flex-col lg:flex-row font-body text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Dynamic Keyframe Animations for Slow, Elegant Transit Movement */}
      <style>{`
        @keyframes floatMetro {
          0% { transform: translate(50px, 120px); }
          50% { transform: translate(320px, 120px); }
          100% { transform: translate(540px, 120px); }
        }
        @keyframes floatBus {
          0% { transform: translate(130px, 210px); }
          50% { transform: translate(330px, 210px); }
          100% { transform: translate(510px, 210px); }
        }
        @keyframes pulseRing {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 0.2; }
        }
        @keyframes slowDash {
          to { stroke-dashoffset: -100; }
        }
        .anim-dash {
          animation: slowDash 24s linear infinite;
        }
        .anim-metro-mover {
          animation: floatMetro 16s ease-in-out infinite alternate;
        }
        .anim-bus-mover {
          animation: floatBus 19s ease-in-out infinite alternate;
        }
        .anim-pulse-ring {
          animation: pulseRing 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      {/* ========================================================
          LEFT VISUAL AREA: 100% HEIGHT ON DESKTOP (~55% WIDTH)
          LARGE, BEAUTIFUL HYDERABAD PUBLIC TRANSPORT VISUAL
          ======================================================== */}
      <div className="w-full lg:w-[54%] xl:w-[56%] bg-gradient-to-br from-[#070e22] via-[#0d1838] to-[#081026] text-white p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden shrink-0 min-h-[380px] lg:min-h-full">
        {/* Subtle Background City Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Subtle Minimal Hyderabad Skyline Silhouette at Base */}
        <div className="absolute bottom-0 left-0 right-0 h-44 opacity-25 pointer-events-none select-none overflow-hidden">
          <svg
            viewBox="0 0 800 180"
            preserveAspectRatio="none"
            className="w-full h-full text-blue-950 fill-current"
          >
            {/* Charminar Arch & Minarets Silhouette */}
            <path d="M 60 180 L 60 90 L 70 85 L 70 40 L 75 35 L 75 180 Z" opacity="0.6" />
            <path d="M 125 180 L 125 35 L 130 40 L 130 85 L 140 90 L 140 180 Z" opacity="0.6" />
            <path d="M 75 90 C 75 65, 125 65, 125 90 L 125 180 L 75 180 Z" opacity="0.8" />
            <rect x="85" y="105" width="30" height="75" rx="15" fill="#070e22" />

            {/* Secunderabad Station Clocks & Gables */}
            <path d="M 180 180 L 180 110 L 210 80 L 240 110 L 240 180 Z" opacity="0.5" />
            <rect x="205" y="95" width="10" height="10" rx="5" fill="#3b82f6" opacity="0.3" />

            {/* Cyber Towers & HITEC City Towers Silhouette */}
            <path d="M 330 180 L 330 65 L 365 45 L 400 65 L 400 180 Z" opacity="0.7" />
            <rect x="345" y="80" width="15" height="15" rx="3" fill="#38bdf8" opacity="0.25" />
            <rect x="370" y="80" width="15" height="15" rx="3" fill="#38bdf8" opacity="0.25" />
            <path d="M 420 180 L 420 85 L 450 85 L 450 180 Z" opacity="0.5" />
            <path d="M 465 180 L 465 50 L 510 50 L 510 180 Z" opacity="0.6" />
            <path d="M 530 180 L 530 95 L 565 75 L 600 95 L 600 180 Z" opacity="0.5" />

            {/* Buddha Statue of Hussain Sagar Silhouette */}
            <path d="M 680 180 L 680 130 C 680 110, 710 110, 710 130 L 710 180 Z" opacity="0.5" />
            <circle cx="695" cy="100" r="10" opacity="0.5" />
          </svg>
        </div>

        {/* TOP BRANDING & HYDERABAD IDENTITY */}
        <div className="relative z-10 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-400/30 text-xs font-semibold text-blue-200 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Hyderabad, Telangana</span>
            <span className="text-blue-400/60">•</span>
            <span className="text-blue-300 font-normal">Multimodal Transit</span>
          </div>

          <div className="pt-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-headline font-extrabold tracking-tight text-white leading-tight">
              Move smarter across Hyderabad
            </h1>
            <p className="text-xs sm:text-sm text-blue-200/90 font-medium tracking-wide mt-1">
              Bus • Metro • MMTS • Walking
            </p>
          </div>
        </div>

        {/* ========================================================
            CENTER: LARGE, MODERN CONNECTED TRANSIT ILLUSTRATION
            Fills the available visual area with clean large graphics
            ======================================================== */}
        <div className="relative z-10 my-auto py-6 sm:py-8 w-full max-w-xl mx-auto flex flex-col items-center justify-center">
          {/* Visual Canvas */}
          <div className="relative w-full h-[280px] sm:h-[320px] lg:h-[350px]">
            {/* SVG Connecting Network Tracks */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 620 320"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Metro Blue Line Gradient */}
                <linearGradient id="metroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>

                {/* TGSRTC Bus Line Gradient */}
                <linearGradient id="busGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>

                {/* MMTS Suburban Rail Gradient */}
                <linearGradient id="mmtsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>

              {/* 1. METRO CORRIDOR (Blue Line: Tarnaka ➔ Ameerpet ➔ HITEC City ➔ Raidurg) */}
              <path
                d="M 60 120 L 310 120 L 560 120"
                stroke="url(#metroGrad)"
                strokeWidth="6"
                strokeLinecap="round"
              />
              {/* Inner track dashed accent */}
              <path
                d="M 60 120 L 560 120"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeDasharray="8 6"
                strokeOpacity="0.7"
                className="anim-dash"
              />

              {/* 2. TGSRTC BUS CORRIDOR (Green Line: Secunderabad ➔ Ameerpet ➔ Cyber Towers) */}
              <path
                d="M 120 210 L 310 210 L 520 210"
                stroke="url(#busGrad)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M 120 210 L 520 210"
                stroke="#ffffff"
                strokeWidth="1"
                strokeDasharray="6 8"
                strokeOpacity="0.5"
              />

              {/* 3. MMTS SUBURBAN RAIL (Purple Line: Secunderabad Junction ➔ Hi-Tech MMTS) */}
              <path
                d="M 120 60 C 200 40, 420 40, 520 60"
                stroke="url(#mmtsGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="6 4"
              />

              {/* 4. WALKING / INTERCHANGE CONNECTORS (Slate Dotted Lines linking hubs) */}
              <path
                d="M 310 60 L 310 270"
                stroke="#94a3b8"
                strokeWidth="2.5"
                strokeDasharray="4 4"
                strokeOpacity="0.8"
              />
              <path
                d="M 120 60 L 120 210"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray="3 3"
                strokeOpacity="0.5"
              />
              <path
                d="M 520 60 L 520 210"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray="3 3"
                strokeOpacity="0.5"
              />

              {/* STATION NODE 1: Tarnaka (East Metro Station) */}
              <circle cx="60" cy="120" r="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
              <circle cx="60" cy="120" r="3.5" fill="#ffffff" />

              {/* STATION NODE 2: Secunderabad (Rail & Bus Terminal) */}
              <circle cx="120" cy="60" r="7" fill="#1e293b" stroke="#a855f7" strokeWidth="2.5" />
              <circle cx="120" cy="210" r="6" fill="#1e293b" stroke="#10b981" strokeWidth="2" />

              {/* CENTRAL INTERCHANGE HUB: Ameerpet (Line 1 ⇄ Line 3 ⇄ TGSRTC Buses) */}
              <circle
                cx="310"
                cy="120"
                r="18"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                className="anim-pulse-ring"
              />
              <circle cx="310" cy="120" r="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="3.5" />
              <circle cx="310" cy="120" r="4.5" fill="#ffffff" />

              {/* STATION NODE 4: HITEC City & Raidurg (West IT Corridor) */}
              <circle cx="520" cy="120" r="7" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
              <circle cx="520" cy="60" r="6" fill="#1e293b" stroke="#a855f7" strokeWidth="2" />
              <circle cx="520" cy="210" r="6" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
              <circle cx="560" cy="120" r="7" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            </svg>

            {/* DYNAMIC MOVING VEHICLE 1: METRO TRAIN (Glides along Blue Line) */}
            <div className="absolute top-0 left-0 w-8 h-8 anim-metro-mover pointer-events-none -mt-4 -ml-4 flex items-center justify-center">
              <div className="w-8 h-8 rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-500/50 flex items-center justify-center text-sm border border-blue-200">
                🚇
              </div>
            </div>

            {/* DYNAMIC MOVING VEHICLE 2: TGSRTC BUS (Glides along Green Line) */}
            <div className="absolute top-0 left-0 w-8 h-8 anim-bus-mover pointer-events-none -mt-4 -ml-4 flex items-center justify-center">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/50 flex items-center justify-center text-sm border border-emerald-200">
                🚌
              </div>
            </div>

            {/* HYDERABAD LOCATION LABELS (Carefully spaced & recognizable) */}
            {/* Label 1: Tarnaka */}
            <div className="absolute left-2 sm:left-4 top-[78px] text-left">
              <span className="text-xs font-bold text-white tracking-wide block">
                Tarnaka
              </span>
              <span className="text-[10px] text-blue-300 font-mono">Metro Blue Line</span>
            </div>

            {/* Label 2: Secunderabad */}
            <div className="absolute left-[70px] sm:left-[85px] top-[14px] text-left">
              <span className="text-xs font-bold text-purple-200 tracking-wide block">
                Secunderabad
              </span>
              <span className="text-[10px] text-purple-300/80 font-mono">MMTS · Railway</span>
            </div>

            {/* Label 3: Ameerpet Central Interchange */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[148px] text-center">
              <div className="px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-blue-400/50 text-[10px] font-extrabold uppercase tracking-wider text-blue-300 inline-block shadow-md">
                Ameerpet Interchange
              </div>
              <span className="text-[10px] text-slate-300 block mt-0.5">
                Metro ⇄ Bus ⇄ Walking Hub
              </span>
            </div>

            {/* Label 4: HITEC City & Raidurg */}
            <div className="absolute right-2 sm:right-4 top-[78px] text-right">
              <span className="text-xs font-bold text-white tracking-wide block">
                HITEC City
              </span>
              <span className="text-[10px] text-blue-300 font-mono">Raidurg Terminal</span>
            </div>

            {/* Label 5: Gachibowli / Financial District Bus End */}
            <div className="absolute right-6 sm:right-10 bottom-[54px] text-right">
              <span className="text-xs font-bold text-emerald-300 tracking-wide block">
                Gachibowli
              </span>
              <span className="text-[10px] text-emerald-400/80 font-mono">TGSRTC Express</span>
            </div>

            {/* First / Last Mile Pedestrian Note */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300">
              <span>🚶</span>
              <span>First &amp; Last Mile Integrated Walking Links</span>
            </div>
          </div>

          {/* LARGE 4-MODE TRANSIT PILLARS */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-4 pt-2">
            {/* Metro Pillar */}
            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md p-3 rounded-2xl border border-white/15 transition-all text-left flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600/90 border border-blue-400 flex items-center justify-center text-lg shrink-0">
                🚇
              </div>
              <div>
                <span className="text-xs font-extrabold text-white block leading-tight">
                  Metro
                </span>
                <span className="text-[10px] text-blue-200 leading-none">3 Corridors</span>
              </div>
            </div>

            {/* TGSRTC Bus Pillar */}
            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md p-3 rounded-2xl border border-white/15 transition-all text-left flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600/90 border border-emerald-400 flex items-center justify-center text-lg shrink-0">
                🚌
              </div>
              <div>
                <span className="text-xs font-extrabold text-white block leading-tight">
                  TGSRTC
                </span>
                <span className="text-[10px] text-emerald-200 leading-none">City Buses</span>
              </div>
            </div>

            {/* MMTS Pillar */}
            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md p-3 rounded-2xl border border-white/15 transition-all text-left flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-600/90 border border-purple-400 flex items-center justify-center text-lg shrink-0">
                🚆
              </div>
              <div>
                <span className="text-xs font-extrabold text-white block leading-tight">
                  MMTS
                </span>
                <span className="text-[10px] text-purple-200 leading-none">Suburban</span>
              </div>
            </div>

            {/* Walking Pillar */}
            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md p-3 rounded-2xl border border-white/15 transition-all text-left flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-700/90 border border-slate-400 flex items-center justify-center text-lg shrink-0">
                🚶
              </div>
              <div>
                <span className="text-xs font-extrabold text-white block leading-tight">
                  Walking
                </span>
                <span className="text-[10px] text-slate-300 leading-none">First / Last</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM NETWORK TELEMETRY STRIP */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-blue-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-white">One Connected Network</span>
            <span className="text-white/30">•</span>
            <span className="text-blue-300">57 Metro Stations · 44 MMTS Stops</span>
          </div>

          <span className="text-[11px] text-blue-300/80 font-mono">
            Hyderabad Metropolitan Authority
          </span>
        </div>
      </div>

      {/* ========================================================
          RIGHT LOGIN PANEL: 100% HEIGHT ON DESKTOP (~45% WIDTH)
          CLEAN, FOCUSED LOGIN / SIGN UP FORM
          ======================================================== */}
      <div className="w-full lg:w-[46%] xl:w-[44%] bg-white flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 h-full overflow-y-auto">
        {/* Main Form Wrapper */}
        <div className="max-w-md w-full mx-auto my-auto space-y-6">
          {/* Header Brand & Titles */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <TransitLogo size={32} />
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600">
                HYD SMART TRANSIT AI
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-headline font-extrabold text-slate-900 tracking-tight">
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {mode === 'login'
                ? 'Sign in to access saved journeys, commuter pass & live transit alerts'
                : 'Join Hyderabad Smart Transit for seamless multimodal commuting'}
            </p>
          </div>

          {/* Login / Sign Up Segmented Switch */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 animate-fadeIn">
              <span className="material-symbols-outlined text-[18px] text-red-600 shrink-0">
                error
              </span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ================= LOGIN FORM ================= */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email / Mobile Input */}
              <div className="space-y-1">
                <label
                  htmlFor="emailOrMobile"
                  className="block text-xs font-bold text-slate-700"
                >
                  Email / Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[18px]">
                    person
                  </span>
                  <input
                    id="emailOrMobile"
                    type="text"
                    value={emailOrMobile}
                    onChange={(e) => setEmailOrMobile(e.target.value)}
                    placeholder="Enter email or mobile number"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password Input with Eye Visibility Toggle */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-bold text-slate-700"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[18px]">
                    lock
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-headline font-bold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Login</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ================= SIGN UP FORM ================= */
            <form onSubmit={handleSignUp} className="space-y-3.5">
              {/* Full Name */}
              <div className="space-y-1">
                <label htmlFor="fullName" className="block text-xs font-bold text-slate-700">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[18px]">
                    badge
                  </span>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Jash"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label
                  htmlFor="signupEmail"
                  className="block text-xs font-bold text-slate-700"
                >
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[18px]">
                    mail
                  </span>
                  <input
                    id="signupEmail"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="e.g. jash@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="space-y-1">
                <label
                  htmlFor="signupMobile"
                  className="block text-xs font-bold text-slate-700"
                >
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[18px]">
                    smartphone
                  </span>
                  <input
                    id="signupMobile"
                    type="tel"
                    value={signupMobile}
                    onChange={(e) => setSignupMobile(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label
                  htmlFor="signupPassword"
                  className="block text-xs font-bold text-slate-700"
                >
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[18px]">
                    lock
                  </span>
                  <input
                    id="signupPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password (min 6 characters)"
                    className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-headline font-bold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Sign Up</span>
                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Separator Divider */}
          <div className="relative flex items-center justify-center py-0.5">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-xs text-slate-400 font-semibold uppercase tracking-wider">
              or
            </span>
          </div>

          {/* CONTINUE AS GUEST BUTTON */}
          <button
            type="button"
            onClick={continueAsGuest}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-500">
              travel_explore
            </span>
            <span>Continue as Guest</span>
          </button>

          {/* Toggle Between Login & Sign Up link */}
          <div className="text-center text-xs text-slate-600 pt-0.5">
            {mode === 'login' ? (
              <span>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage(null);
                  }}
                  className="font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                >
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                  }}
                  className="font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                >
                  Log In
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Bottom Quick Test Helper */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Prototype Demo Mode</span>
          <button
            type="button"
            onClick={handleDemoFill}
            className="text-blue-600 hover:text-blue-800 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
            <span>Fill sample credentials</span>
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-base text-slate-900">
                Reset Password
              </h3>
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your registered email address or mobile number to receive a temporary recovery OTP.
            </p>
            <input
              type="text"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="name@example.com or 10-digit mobile"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  showToast(`Password reset link sent to ${forgotEmail || 'your email'}!`);
                  setShowForgotPassword(false);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
              >
                Send Reset Code
              </button>
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
