import React from 'react';
import { TransitProvider, useTransit, AppTab } from './context/TransitContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoginScreen } from './screens/LoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { MyRoutesScreen } from './screens/MyRoutesScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AdminOperations } from './components/AdminOperations';
import { PushpakModal } from './components/PushpakModal';
import { SosModal } from './components/SosModal';
import { BookingModal } from './components/BookingModal';
import { QrTicketModal } from './components/QrTicketModal';
import { NavigationModal } from './components/NavigationModal';
import { DossierModal } from './components/DossierModal';

const AppContent: React.FC = () => {
  const {
    isAuthenticated,
    activeTab,
    setActiveTab,
    setActiveModal,
    toastMessage,
    setToLocation,
  } = useTransit();

  const handleCorridorSelect = (corridor: string) => {
    setToLocation(corridor);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user is not logged in, render the dynamic Hyderabad transit Login Screen
  if (!isAuthenticated) {
    return (
      <div className="w-screen h-screen overflow-x-hidden overflow-y-auto lg:overflow-hidden bg-slate-900 text-slate-900 flex flex-col font-body selection:bg-blue-600 selection:text-white">
        <LoginScreen />

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 backdrop-blur-xl border border-blue-500/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
            <span className="text-xs font-medium">{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-body selection:bg-blue-600 selection:text-white">
      {/* Top Header - persistently displays navigation tabs */}
      <Header />

      {/* Main Viewport */}
      <main className="w-full min-h-[calc(100vh-64px)] flex-1 flex flex-col pb-12">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'my-routes' && <MyRoutesScreen />}
        {activeTab === 'alerts' && <AlertsScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
        {activeTab === 'admin' && (
          <AdminOperations
            onNavigateTab={(tab: any) => {
              if (tab === 'multimodal-journey-planner') setActiveTab('home');
              else if (tab === 'live-transit-network-status') setActiveTab('alerts');
              else setActiveTab('home');
            }}
            onOpenPushpak={() => setActiveModal('pushpak')}
            onOpenSos={() => setActiveModal('sos')}
          />
        )}
      </main>

      {/* Footer - present on commuter screens */}
      {activeTab !== 'admin' && (
        <Footer
          onCorridorSelect={handleCorridorSelect}
          onCallSos={() => setActiveModal('sos')}
        />
      )}

      {/* Interactive Global Modals */}
      <PushpakModal />
      <SosModal />
      <BookingModal />
      <QrTicketModal />
      <NavigationModal />
      <DossierModal />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 backdrop-blur-xl border border-blue-500/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <TransitProvider>
      <AppContent />
    </TransitProvider>
  );
}

