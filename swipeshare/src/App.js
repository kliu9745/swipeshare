import React, { useState } from 'react';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import HomeView from './views/HomeView';
import TransferView from './views/TransferView';
import InboxView from './views/InboxView';
import MySwipesView from './views/MySwipesView';
import ProfileView from './views/ProfileView';

const SwipeShareApp = () => {
  const [currentView, setCurrentView] = useState('home');

  // Mock data
  const mySwipes = [
    {
      id: 'swipe_001',
      recipient: 'Jamie Chen',
      status: 'pending',
      validUntil: 'Today, 8:00 PM',
      location: 'Any dining hall',
      createdAt: 'Nov 15, 2:34 PM'
    },
    {
      id: 'swipe_002',
      recipient: 'Alex Kumar',
      status: 'completed',
      validUntil: 'Nov 14, 8:00 PM',
      location: 'North Dining',
      createdAt: 'Nov 14, 6:12 PM'
    }
  ];

  const incomingSwipes = [
    {
      id: 'swipe_003',
      donor: 'Sarah Williams',
      code: 'SWIPE-NK7H-92JD-4KLP',
      validUntil: 'Today, 8:00 PM',
      location: 'Any dining hall',
      message: 'Hope this helps! Enjoy your meal 😊',
      hoursLeft: 4.5
    }
  ];

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleProfileClick = () => {
    setCurrentView('profile');
  };

  const handleLogout = () => {
    console.log('User logged out');
    // Handle logout logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <Header onProfileClick={handleProfileClick} />

      {/* Main Content */}
      <div className="max-w-2xl mx-auto">
        {currentView === 'home' && <HomeView onNavigate={handleNavigate} mySwipes={mySwipes} />}
        {currentView === 'transfer' && <TransferView onTransfer={null} />}
        {currentView === 'inbox' && <InboxView incomingSwipes={incomingSwipes} />}
        {currentView === 'myswipes' && <MySwipesView mySwipes={mySwipes} />}
        {currentView === 'profile' && <ProfileView onLogout={handleLogout} />}
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentView={currentView} onNavigate={handleNavigate} />
    </div>
  );
};

export default SwipeShareApp;
