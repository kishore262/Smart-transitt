import React, { useState } from 'react';
import { useTransit, AppTab } from '../context/TransitContext';
import { TransitLogo } from './Logo';

export type TabType = 'multimodal-journey-planner' | 'live-transit-network-status' | 'mobility-and-green-analytics' | 'admin-transit-operations';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, alerts, currentUser } = useTransit();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Count active yellow/red alerts
  const alertCount = alerts.filter((a) => a.level !== 'green').length;

  const navItems: { id: AppTab; label: string; icon: string; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: 'directions_transit' },
    { id: 'my-routes', label: 'My Routes', icon: 'bookmark' },
    { id: 'alerts', label: 'Alerts', icon: 'notifications', badge: alertCount },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <header className="sticky top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <TransitLogo size={34} />
          <div className="flex flex-col">
            <span className="font-headline font-bold text-slate-900 text-lg sm:text-xl tracking-tight leading-none group-hover:text-blue-600 transition-colors">
              Hyderabad Smart Transit
            </span>
            <span className="text-[11px] text-slate-500 font-sans tracking-normal mt-0.5">
              Public Transport Companion
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links: Home | My Routes | Alerts | Profile */}
        <nav className="hidden md:flex items-center gap-1 font-medium text-sm">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.id === 'profile' ? (
                  <span
                    className={`w-5 h-5 rounded-full bg-gradient-to-br ${
                      currentUser?.avatarColor || 'from-blue-600 to-indigo-700'
                    } text-white text-[10px] font-bold flex items-center justify-center shrink-0`}
                  >
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'P'}
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                )}
                <span>{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Right side: Discrete Admin switch & Mobile menu toggle */}
        <div className="flex items-center gap-2">
          {/* Discrete Admin Link (kept separate from normal commuter flow) */}
          <button
            onClick={() => setActiveTab(activeTab === 'admin' ? 'home' : 'admin')}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
              activeTab === 'admin'
                ? 'bg-slate-800 text-white border-slate-900'
                : 'text-slate-500 hover:text-slate-800 bg-slate-50 border-slate-200'
            }`}
            title="Switch to Transit Operations Console"
          >
            <span className="material-symbols-outlined text-[14px]">shield</span>
            <span>{activeTab === 'admin' ? 'Back to Commuter App' : 'Admin Console'}</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle navigation"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 bg-white border-t border-slate-200 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-sm font-medium ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-xs font-bold">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setActiveTab(activeTab === 'admin' ? 'home' : 'admin');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-slate-800"
            >
              <span className="material-symbols-outlined text-[16px]">shield</span>
              <span>{activeTab === 'admin' ? 'Exit Admin Mode' : 'Admin Operations Console'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
