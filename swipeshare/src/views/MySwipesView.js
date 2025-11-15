import React from 'react';
import { QrCode } from 'lucide-react';
import ImpactStats from '../components/profile/ImpactStats';
import SwipeCard from '../components/swipes/SwipeCard';
import Card from '../components/common/Card';

export const MySwipesView = ({ mySwipes = [], onSwipeAction = null }) => {
  const mockStats = {
    planName: 'Unlimited Plan',
    daysLeft: 87,
    thisWeekUsed: 10,
    thisWeekTotal: 14,
    weekProgress: 71,
    swipesShared: 12,
    mealsGiven: 12
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Meal Swipes</h2>
        <p className="text-gray-600">Track your transfers</p>
      </div>

      {/* Plan Overview */}
      <ImpactStats stats={mockStats} />

      {/* Active Transfers */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Active Transfers</h3>
        {mySwipes.length > 0 ? (
          <div className="space-y-2">
            {mySwipes.map(swipe => (
              <SwipeCard 
                key={swipe.id}
                swipe={swipe} 
                type="outgoing"
                onAction={onSwipeAction}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-8">
            <p className="text-gray-600">No active transfers yet.</p>
            <p className="text-sm text-gray-500">Start by creating a transfer above.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MySwipesView;
