import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';

export const ProfileScreen: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    logoutUser,
    savedRoutes,
    planSavedRoute,
    showToast,
    setActiveModal,
    setActiveTicket,
  } = useTransit();

  // Edit Profile mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editEmail, setEditEmail] = useState(currentUser.email);
  const [editMobile, setEditMobile] = useState(currentUser.mobile);
  const [editPassword, setEditPassword] = useState('••••••••');
  const [editAvatarColor, setEditAvatarColor] = useState(
    currentUser.avatarColor || 'from-blue-600 to-indigo-700'
  );
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Logout confirmation dialog state
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Smart card balance & settings
  const [smartCardBalance, setSmartCardBalance] = useState<number>(340);
  const [autoRecharge, setAutoRecharge] = useState<boolean>(true);
  const [metroDelayAlerts, setMetroDelayAlerts] = useState<boolean>(true);
  const [accessibleRoutes, setAccessibleRoutes] = useState<boolean>(false);

  // Available avatar color options
  const avatarOptions = [
    { label: 'Transit Blue', color: 'from-blue-600 to-indigo-700', icon: 'person' },
    { label: 'Emerald TGSRTC', color: 'from-emerald-600 to-teal-700', icon: 'directions_bus' },
    { label: 'MMTS Purple', color: 'from-purple-600 to-violet-800', icon: 'train' },
    { label: 'Amber Metro', color: 'from-amber-600 to-orange-700', icon: 'commute' },
  ];

  // Open Edit Mode
  const handleStartEdit = () => {
    setEditName(currentUser.isGuest ? '' : currentUser.name);
    setEditEmail(currentUser.isGuest ? '' : currentUser.email);
    setEditMobile(currentUser.isGuest ? '' : currentUser.mobile);
    setEditPassword('••••••••');
    setEditAvatarColor(currentUser.avatarColor);
    setIsEditing(true);
    setUpdateSuccess(false);
  };

  // Save Profile Changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editName.trim()) {
      showToast('Please enter your full name');
      return;
    }
    if (!editEmail.trim() || !editEmail.includes('@')) {
      showToast('Please enter a valid email address');
      return;
    }

    updateUserProfile({
      name: editName.trim(),
      email: editEmail.trim(),
      mobile: editMobile.trim() || '+91 98765 43210',
      avatarColor: editAvatarColor,
      isGuest: false, // If guest edited their profile, they become a registered user!
    });

    setIsEditing(false);
    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 4000);
  };

  // Top-Up Transit Pass
  const handleTopUp = (amount: number) => {
    setSmartCardBalance((prev) => prev + amount);
    showToast(`Added ₹${amount} to Hyderabad Metro & TGSRTC Smart Card!`);
  };

  // Open Tap & Pay QR
  const handleShowCardQR = () => {
    setActiveTicket({
      id: 'HST-NCMC-4892',
      routeTitle: 'Hyderabad Transit Smart Card',
      from: 'All Hyderabad Lines',
      to: 'Citywide Network',
      mode: 'Multi-Modal',
      lineOrBusNo: 'NCMC RuPay Mobility Pass',
      duration: 'Unlimited Pass',
      unitFare: smartCardBalance,
      totalFare: '₹' + smartCardBalance,
      passengers: [{ id: 'p-1', name: currentUser?.name || 'Cardholder', age: 28, type: 'Adult' }],
      bookingDate: '03 Oct 2026',
      bookingTime: 'Continuous Access',
      status: 'Valid',
      transfersText: 'Valid across Metro, Bus & MMTS',
    });
    setActiveModal('qr-ticket');
  };

  // Perform Logout
  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    logoutUser();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-fadeIn font-body text-slate-900">
      {/* Page Title & Breadcrumb */}
      <div>
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          Commuter Account
        </span>
        <h1 className="text-2xl sm:text-3xl font-headline font-bold text-slate-900 tracking-tight">
          My Profile & Settings
        </h1>
        <p className="text-sm text-slate-500">
          Manage your passenger identity, saved journeys, transit pass, and notification preferences.
        </p>
      </div>

      {/* Confirmation Banner for Profile Update */}
      {updateSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-emerald-600 text-[22px]">
              check_circle
            </span>
            <span className="text-sm font-bold">Profile updated successfully</span>
          </div>
          <button
            type="button"
            onClick={() => setUpdateSuccess(false)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* GUEST BANNER (If logged in as Guest) */}
      {currentUser.isGuest && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-amber-600 text-[24px] mt-0.5">
              account_circle
            </span>
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                Create an account to save your profile and journeys.
              </h3>
              <p className="text-xs text-amber-800 mt-0.5 leading-snug">
                You are currently browsing as a Guest. Register with your name and mobile number to save your favorite routes and auto-recharge settings.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleStartEdit}
            className="shrink-0 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Create Account
          </button>
        </div>
      )}

      {/* ========================================================
          1. PROFILE INFORMATION CARD (VIEW & EDIT)
          ======================================================== */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-lg font-headline font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[20px]">badge</span>
            <span>Profile Information</span>
          </h2>

          {!isEditing && (
            <button
              type="button"
              onClick={handleStartEdit}
              className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-blue-200"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {/* --- VIEW MODE --- */}
        {!isEditing ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* User Avatar */}
            <div className="relative">
              <div
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${currentUser.avatarColor || 'from-blue-600 to-indigo-700'} text-white flex items-center justify-center text-3xl font-headline font-bold shadow-md`}
              >
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'G'}
              </div>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white" title="Active Account">
                <span className="material-symbols-outlined text-[12px]">check</span>
              </span>
            </div>

            {/* Profile Details List */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Name
                </span>
                <span className="text-sm sm:text-base font-bold text-slate-900 truncate block">
                  {currentUser.name}
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Email
                </span>
                <span className="text-sm sm:text-base font-semibold text-slate-800 truncate block">
                  {currentUser.email}
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Mobile
                </span>
                <span className="text-sm sm:text-base font-semibold text-slate-800 font-mono truncate block">
                  {currentUser.mobile}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* --- EDIT MODE FORM --- */
          <form onSubmit={handleSaveProfile} className="space-y-5 animate-fadeIn">
            {/* Avatar Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Choose Profile Photo / Avatar Color
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {avatarOptions.map((opt) => (
                  <button
                    key={opt.color}
                    type="button"
                    onClick={() => setEditAvatarColor(opt.color)}
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${opt.color} text-white flex items-center justify-center cursor-pointer transition-transform ${
                      editAvatarColor === opt.color
                        ? 'ring-4 ring-blue-400 scale-105 shadow-md'
                        : 'opacity-80 hover:opacity-100'
                    }`}
                    title={opt.label}
                  >
                    <span className="material-symbols-outlined text-[18px]">{opt.icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label htmlFor="editName" className="block text-xs font-bold text-slate-700">
                  Full Name
                </label>
                <input
                  id="editName"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label htmlFor="editEmail" className="block text-xs font-bold text-slate-700">
                  Email Address
                </label>
                <input
                  id="editEmail"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                  required
                />
              </div>

              {/* Mobile */}
              <div className="space-y-1">
                <label htmlFor="editMobile" className="block text-xs font-bold text-slate-700">
                  Mobile Number
                </label>
                <input
                  id="editMobile"
                  type="text"
                  value={editMobile}
                  onChange={(e) => setEditMobile(e.target.value)}
                  placeholder="Enter mobile number"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label htmlFor="editPassword" className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <input
                  id="editPassword"
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Change password"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                />
              </div>
            </div>

            {/* Action Buttons: Save Changes & Cancel */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-headline font-bold text-sm shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">check</span>
                <span>Save Changes</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ========================================================
          2. SAVED JOURNEYS (QUICK ACCESS)
          ======================================================== */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-headline font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500 text-[20px]">bookmark</span>
            <span>Saved Journeys</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {savedRoutes.length} saved
          </span>
        </div>

        {savedRoutes.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">
            No saved journeys yet. Star routes during journey planning to access them here instantly.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedRoutes.map((route) => (
              <div
                key={route.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5 truncate">
                  <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                    {route.from} → {route.to}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>{route.avgTime}</span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-700">{route.fare}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => planSavedRoute(route)}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Plan
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================
          3. COMMUTE PREFERENCES
          ======================================================== */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-headline font-bold text-slate-900 flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-600 text-[20px]">tune</span>
          <span>Preferences</span>
        </h2>

        <div className="space-y-3 divide-y divide-slate-100">
          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Push Notifications for Metro Delays
              </div>
              <div className="text-xs text-slate-500">
                Alerts when Corridors I, II, or III experience headway drift over 5 mins
              </div>
            </div>
            <input
              type="checkbox"
              checked={metroDelayAlerts}
              onChange={(e) => setMetroDelayAlerts(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Auto-Recharge at ₹50 Threshold
              </div>
              <div className="text-xs text-slate-500">
                Prevents turnstile gate rejections during peak morning hours
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoRecharge}
              onChange={(e) => setAutoRecharge(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Accessible Wheelchair Routes
              </div>
              <div className="text-xs text-slate-500">
                Prioritizes stations with operational elevators and step-free platform access
              </div>
            </div>
            <input
              type="checkbox"
              checked={accessibleRoutes}
              onChange={(e) => setAccessibleRoutes(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* ========================================================
          4. NOTIFICATIONS
          ======================================================== */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <h2 className="text-base font-headline font-bold text-slate-900 flex items-center gap-2">
          <span className="material-symbols-outlined text-purple-600 text-[20px]">
            notifications_active
          </span>
          <span>Notifications</span>
        </h2>
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-blue-600">sms</span>
            <span>SMS route status dispatched to {currentUser.mobile || 'registered phone'}</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-white px-2 py-0.5 rounded-full border border-blue-200">
            Active
          </span>
        </div>
      </div>

      {/* ========================================================
          5. TRANSIT SMART CARD (NCMC RUPAY)
          ======================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-sm">
              HYD
            </span>
            <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-blue-200">
              One City · One Pass
            </span>
          </div>
          <span className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded-full border border-white/20">
            NCMC RuPay Enabled
          </span>
        </div>

        <div className="mt-8 space-y-1">
          <span className="text-xs text-blue-200 uppercase tracking-wider">Pass Balance</span>
          <div className="text-3xl sm:text-4xl font-headline font-extrabold tracking-tight">
            ₹{smartCardBalance}.00
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/15">
          <div className="text-xs font-mono text-blue-200">
            Card No: •••• •••• •••• 4892 · {currentUser.name}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShowCardQR}
              type="button"
              className="px-3.5 py-1.5 rounded-xl bg-white text-blue-900 font-bold text-xs hover:bg-blue-50 transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">qr_code</span>
              <span>Tap & Pay QR</span>
            </button>
            <button
              onClick={() => handleTopUp(200)}
              type="button"
              className="px-3.5 py-1.5 rounded-xl bg-blue-500/40 hover:bg-blue-500/60 text-white font-bold text-xs border border-white/20 transition-colors cursor-pointer"
            >
              + Recharge ₹200
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          6. LOGOUT SECTION & CONFIRMATION
          ======================================================== */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-headline font-bold text-sm border border-red-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Logout</span>
        </button>
      </div>

      {/* ========================================================
          LOGOUT CONFIRMATION DIALOG MODAL
          ======================================================== */}
      {showLogoutConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-2xl text-center animate-fadeIn"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
              <span className="material-symbols-outlined text-[24px]">logout</span>
            </div>

            <div>
              <h3 className="font-headline font-bold text-lg text-slate-900">
                Are you sure you want to logout?
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                You will return to the Login screen. Your saved routes and commuter data will remain safe.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-headline font-bold text-sm shadow-xs transition-colors cursor-pointer"
              >
                Logout
              </button>

              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-headline font-semibold text-sm transition-colors cursor-pointer"
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
