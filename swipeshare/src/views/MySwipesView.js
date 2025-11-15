import React from 'react';
import ImpactStats from '../components/profile/ImpactStats';
import SwipeCard from '../components/swipes/SwipeCard';
import './MySwipesView.css';

export const MySwipesView = ({ mySwipes = [], impactStats = {}, onSwipeAction = null }) => {
  const stats = {
    planName: impactStats.planName || 'Unlimited Plan',
    daysLeft: impactStats.daysLeft || 87,
    thisWeekUsed: impactStats.thisWeekUsed || 10,
    thisWeekTotal: impactStats.thisWeekTotal || 14,
    weekProgress: impactStats.weekProgress || 71,
    swipesShared: impactStats.swipesShared || 12,
    mealsGiven: impactStats.mealsGiven || 12
  };

  return (
    <div className="myswipes-view">
      <div className="myswipes-header">
        <h2 className="myswipes-title">Your Meal Swipes</h2>
        <p className="myswipes-subtitle">Track your transfers</p>
      </div>

      {/* Plan Overview */}
      <ImpactStats stats={stats} />

      {/* Active Transfers */}
      <div className="transfers-section">
        <h3 className="section-title">Active Transfers</h3>
        {mySwipes.length > 0 ? (
          <div className="transfers-list">
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
          <div className="transfers-empty">
            <p className="empty-message">No active transfers yet.</p>
            <p className="empty-submessage">Start by creating a transfer above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySwipesView;
