import React, { useState } from 'react';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import HomeView from './views/HomeView';
import TransferView from './views/TransferView';
import InboxView from './views/InboxView';
import MySwipesView from './views/MySwipesView';
import ProfileView from './views/ProfileView';
import { mockMySwipes, mockIncomingSwipes } from './data/mockData';
import './App.css';

const SwipeShareApp = () => {
  const [currentView, setCurrentView] = useState('home');

  // Use mock data
  const mySwipes = mockMySwipes;
  const incomingSwipes = mockIncomingSwipes;

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
    <div className="app-container">
      {/* Header */}
      <Header onProfileClick={handleProfileClick} />

      {/* Main Content */}
      <div className="app-content">
        {currentView === 'home' && <HomeView onNavigate={handleNavigate} mySwipes={mySwipes} />}
        {currentView === 'transfer' && <TransferView onTransfer={null} />}
        {currentView === 'inbox' && <InboxView incomingSwipes={incomingSwipes} />}
        {currentView === 'myswipes' && <MySwipesView mySwipes={mySwipes} />}
        {currentView === 'profile' && <ProfileView onLogout={handleLogout} />}
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentView={currentView} onNavigate={handleNavigate} inboxCount={incomingSwipes.length} />
    </div>
  );
};

export default SwipeShareApp;
