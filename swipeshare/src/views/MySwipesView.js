import React from 'react';
import ImpactStats from '../components/profile/ImpactStats';
import SwipeCard from '../components/swipes/SwipeCard';
import { mockImpactStats } from '../data/mockData';
import './MySwipesView.css';

export const MySwipesView = ({ mySwipes = [], onSwipeAction = null }) => {
  const stats = mockImpactStats;

  return (
    <div className="myswipes-view">
      <div className="myswipes-header">
        <h2 className="myswipes-title">Your Meal Swipes</h2>
        <p className="myswipes-subtitle">Track your transfers</p>
      </div>

      {/* Plan Overview */}
      <ImpactStats stats={stats} />

      {/* Active Transfers */}
      <div className="myswipes-transfers">
        <h3 className="myswipes-section-title">Active Transfers</h3>
        {mySwipes.length > 0 ? (
          <div className="myswipes-list">
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
          <div className="myswipes-empty">
            <p className="myswipes-empty-text">No active transfers yet.</p>
            <p className="myswipes-empty-subtext">Start by creating a transfer above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySwipesView;
