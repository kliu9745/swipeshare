import React, { useState } from 'react';
import SwipeCard from '../components/swipes/SwipeCard';
import QRCodeModal from '../components/swipes/QRCodeModal';
import './InboxView.css';

export const InboxView = ({ incomingSwipes = [], onSwipeAction = null }) => {
  const [selectedSwipe, setSelectedSwipe] = useState(null);
  const [showQR, setShowQR] = useState(false);

  const handleSwipeAction = (action, swipeId) => {
    const swipe = incomingSwipes.find(s => s.id === swipeId);
    
    switch (action) {
      case 'view-qr':
        setSelectedSwipe(swipe);
        setShowQR(true);
        break;
      case 'use':
        console.log('Marked swipe as used:', swipeId);
        break;
      default:
        break;
    }
    
    onSwipeAction && onSwipeAction(action, swipeId);
  };

  return (
    <div className="inbox-view">
      <div className="inbox-header">
        <h2 className="inbox-title">Incoming Swipes</h2>
        <p className="inbox-subtitle">Meals shared with you</p>
      </div>

      {incomingSwipes.length > 0 ? (
        <div className="inbox-list">
          {incomingSwipes.map(swipe => (
            <SwipeCard 
              key={swipe.id}
              swipe={swipe} 
              type="incoming"
              onAction={handleSwipeAction}
            />
          ))}
        </div>
      ) : (
        <div className="inbox-empty">
          <p className="empty-message">No incoming swipes yet.</p>
          <p className="empty-submessage">When someone sends you a swipe, it will appear here.</p>
        </div>
      )}

      <QRCodeModal 
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        swipe={selectedSwipe}
      />
    </div>
  );
};

export default InboxView;
