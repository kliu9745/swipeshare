import React from 'react';
import { Plus, Gift, Inbox } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ImpactStats from '../components/profile/ImpactStats';
import SwipeCard from '../components/swipes/SwipeCard';

export const HomeView = ({ onNavigate, mySwipes = [] }) => {
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
      {/* Hero Section with Stats */}
      <ImpactStats stats={mockStats} />

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Quick Actions</h3>
        <Button 
          variant="primary"
          size="full"
          onClick={() => onNavigate('transfer')}
          className="justify-between p-4"
        >
          <div className="flex items-center gap-3">
            <Gift className="w-6 h-6" />
            <div className="text-left">
              <div className="font-semibold">Transfer Swipe</div>
              <div className="text-sm text-blue-100">Help someone today</div>
            </div>
          </div>
          <Plus className="w-5 h-5" />
        </Button>

        <Button 
          variant="secondary"
          size="full"
          onClick={() => onNavigate('inbox')}
          className="justify-between p-4"
        >
          <div className="flex items-center gap-3">
            <Inbox className="w-6 h-6 text-gray-700" />
            <div className="text-left">
              <div className="font-semibold text-gray-900">View Inbox</div>
              <div className="text-sm text-gray-500">1 new swipe</div>
            </div>
          </div>
        </Button>
      </div>

      {/* Recent Activity */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Recent Activity</h3>
        <div className="space-y-2">
          {mySwipes.slice(0, 2).map(swipe => (
            <SwipeCard key={swipe.id} swipe={swipe} type="outgoing" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeView;
