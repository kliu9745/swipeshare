// import React, { useState } from 'react';
// import { initializeTestData, runAllTests } from './data/testData';
// import Header from './components/layout/Header';
// import BottomNav from './components/layout/BottomNav';
// import HomeView from './views/HomeView';
// import TransferView from './views/TransferView';
// import InboxView from './views/InboxView';
// import MySwipesView from './views/MySwipesView';
// import ProfileView from './views/ProfileView';
// import { mockMySwipes, mockIncomingSwipes } from './data/mockData';
// import './App.css';

// const SwipeShareApp = () => {
//   const [currentView, setCurrentView] = useState('home');

//   // Use mock data
//   const mySwipes = mockMySwipes;
//   const incomingSwipes = mockIncomingSwipes;

//   const handleNavigate = (view) => {
//     setCurrentView(view);
//   };

//   const handleProfileClick = () => {
//     setCurrentView('profile');
//   };

//   const handleLogout = () => {
//     console.log('User logged out');
//     // Handle logout logic here
//   };

//   return (
//     <div className="app-container">
//       {/* Header */}
//       <Header onProfileClick={handleProfileClick} />

//       {/* Main Content */}
//       <div className="app-content">
//         {currentView === 'home' && <HomeView onNavigate={handleNavigate} mySwipes={mySwipes} />}
//         {currentView === 'transfer' && <TransferView onTransfer={null} />}
//         {currentView === 'inbox' && <InboxView incomingSwipes={incomingSwipes} />}
//         {currentView === 'myswipes' && <MySwipesView mySwipes={mySwipes} />}
//         {currentView === 'profile' && <ProfileView onLogout={handleLogout} />}
//       </div>

//       {/* Bottom Navigation */}
//       <BottomNav currentView={currentView} onNavigate={handleNavigate} inboxCount={incomingSwipes.length} />
//     </div>
//   );
// };

// export default SwipeShareApp;

import React, { useState, useEffect } from 'react';
import { initializeTestData, runAllTests, mockMySwipes, mockIncomingSwipes, mockUsers } from './data/testdata'; // Fixed import
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import HomeView from './views/HomeView';
import TransferView from './views/TransferView';
import InboxView from './views/InboxView';
import MySwipesView from './views/MySwipesView';
import ProfileView from './views/ProfileView';
// Services for managing transfers and user stats
import transferService from './services/swipe/transferService';
import userService from './services/user/userService';
// import { mockMySwipes, mockIncomingSwipes } from './data/mockData';
import './App.css';

const SwipeShareApp = () => {
  const [currentView, setCurrentView] = useState('home');
  // eslint-disable-next-line no-unused-vars
  const [incomingSwipes, setIncomingSwipes] = useState([...mockIncomingSwipes]); // Make mutable
  const [mySwipes, setMySwipes] = useState([...mockMySwipes]); // Make mutable for active transfers

  // Frontend mock data (replace with API calls in production)
  const currentUser = mockUsers.currentUser;

  const handleNavigate = (view) => setCurrentView(view);
  const handleProfileClick = () => setCurrentView('profile');
  const handleLogout = () => console.log('User logged out');

  // Handle swipe actions (cancel, use, view-qr, etc.)
  const handleSwipeAction = (action, swipeId) => {
    switch (action) {
      case 'cancel':
        // Remove from mySwipes
        setMySwipes(prev => prev.filter(s => s.id !== swipeId));
        console.log(`✅ Transfer cancelled: ${swipeId}`);
        break;
      case 'use':
        // Mark as used in incomingSwipes
        // Would update status to COMPLETED in real app
        console.log(`✅ Swipe marked as used: ${swipeId}`);
        break;
      case 'view-qr':
        console.log(`📱 View QR code: ${swipeId}`);
        break;
      default:
        break;
    }
  };

  // --- Dev-only test data initialization ---
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      initializeTestData();

      // Expose test functions to window for console access
      window.testSwipeShare = {
        initData: initializeTestData,
        runAll: runAllTests,
        // Stub functions for frontend testing
        testMatching: () => console.log('testMatching stub'),
        testTransfer: () => console.log('testTransfer stub')
      };

      console.log('🧪 Test functions available: window.testSwipeShare');
    }
  }, []);

  return (
    <div className="app-container">
      {/* Header */}
      <Header onProfileClick={handleProfileClick} />

      {/* Main Content */}
      <div className="app-content">
        {currentView === 'home' && <HomeView onNavigate={handleNavigate} mySwipes={mySwipes} onSwipeAction={handleSwipeAction} />}
        {currentView === 'transfer' && <TransferView onTransfer={null} currentUser={currentUser} onMatchSelected={(match) => {
          // Create actual transfer in service
          const recipientId = match.recipientId || match.userId;
          const recipientName = match.recipient || match.name;
          
          const transfer = transferService.createTransfer({
            donorId: currentUser.id,
            donor: currentUser.name,
            recipientId: recipientId,
            recipient: recipientName,
            quantity: match.quantity,
            code: match.code,
            validUntil: match.validUntil,
            location: match.location,
            message: match.message,
            status: 'ACTIVE'
          });

          // Update donor stats (increment swipesShared)
          const donor = userService.getUserById(currentUser.id);
          if (donor) {
            donor.stats.swipesShared = (donor.stats.swipesShared || 0) + match.quantity;
            console.log(`✅ Updated ${donor.name}'s swipesShared to ${donor.stats.swipesShared}`);
          }

          // Update recipient stats (increment swipesReceived and mealsGiven)
          const recipient = userService.getUserById(recipientId);
          if (recipient) {
            recipient.stats.swipesReceived = (recipient.stats.swipesReceived || 0) + match.quantity;
            recipient.stats.mealsGiven = (recipient.stats.mealsGiven || 0) + match.quantity;
            console.log(`✅ Updated ${recipient.name}'s swipesReceived to ${recipient.stats.swipesReceived} and mealsGiven to ${recipient.stats.mealsGiven}`);
          }

          // Add transfer to mySwipes (active transfers) - map match to transfer format
          const newSwipe = {
            id: transfer.id,
            donorId: currentUser.id,
            recipientId: match.recipientId || match.userId,
            recipient: match.recipient || match.name,
            status: 'pending',
            validUntil: match.validUntil,
            location: match.location || 'Any dining hall',
            createdAt: new Date().toLocaleString(),
            expiresAt: match.expiresAt || new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
          };
          
          setMySwipes(prev => [...prev, newSwipe]);
          
          // Navigate to myswipes to show the new active transfer
          setCurrentView('myswipes');
        }} />}
        {currentView === 'inbox' && <InboxView incomingSwipes={incomingSwipes} onSwipeAction={handleSwipeAction} />}
        {currentView === 'myswipes' && <MySwipesView mySwipes={mySwipes} onSwipeAction={handleSwipeAction} />}
        {currentView === 'profile' && <ProfileView onLogout={handleLogout} />}
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        currentView={currentView}
        onNavigate={handleNavigate}
        inboxCount={incomingSwipes.length}
      />
    </div>
  );
};

export default SwipeShareApp;
