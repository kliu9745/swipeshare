import React, { useState } from 'react';
import SwipeCard from '../components/swipes/SwipeCard';
import QRCodeModal from '../components/swipes/QRCodeModal';
import Card from '../components/common/Card';

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
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Incoming Swipes</h2>
        <p className="text-gray-600">Meals shared with you</p>
      </div>

      {incomingSwipes.length > 0 ? (
        <div className="space-y-4">
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
        <Card className="text-center py-8">
          <p className="text-gray-600">No incoming swipes yet.</p>
          <p className="text-sm text-gray-500">When someone sends you a swipe, it will appear here.</p>
        </Card>
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
