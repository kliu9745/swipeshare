import React from 'react';
import { Gift, Inbox, User, Clock, CheckCircle } from 'lucide-react';
import './HomeView.css';

// Individual Components
const HeroSection = ({ swipesShared, daysLeft }) => (
  <div className="hero-section">
    <h2 className="hero-title">Welcome back!</h2>
    <p className="hero-subtitle">Share meals, build community</p>
    <div className="hero-stats">
      <div className="hero-stat-card">
        <div className="hero-stat-value">{swipesShared}</div>
        <div className="hero-stat-label">Swipes Shared</div>
      </div>
      <div className="hero-stat-card">
        <div className="hero-stat-value">{daysLeft}</div>
        <div className="hero-stat-label">Days Left</div>
      </div>
    </div>
  </div>
);

const QuickActionsSection = ({ onTransferClick, onInboxClick }) => (
  <div className="quick-actions">
    <h3 className="section-title">Quick Actions</h3>
    <button 
      onClick={onTransferClick}
      className="action-button action-button-primary"
    >
      <div className="action-button-content">
        <Gift className="action-icon" />
        <div className="action-text">
          <div className="action-title">Transfer Swipe</div>
          <div className="action-subtitle">Help someone today</div>
        </div>
      </div>
    </button>
    <button 
      onClick={onInboxClick}
      className="action-button action-button-secondary"
    >
      <div className="action-button-content">
        <Inbox className="action-icon-secondary" />
        <div className="action-text">
          <div className="action-title-secondary">View Inbox</div>
          <div className="action-subtitle-secondary">1 new swipe</div>
        </div>
      </div>
    </button>
  </div>
);

const ActivityCard = ({ recipient, status, createdAt }) => (
  <div className="activity-card">
    <div className="activity-header">
      <div className="activity-user">
        <div className="activity-avatar">
          <User className="activity-avatar-icon" />
        </div>
        <div>
          <div className="activity-recipient">{recipient}</div>
          <div className="activity-time">{createdAt}</div>
        </div>
      </div>
      {status === 'completed' ? (
        <CheckCircle className="activity-status-completed" />
      ) : (
        <Clock className="activity-status-pending" />
      )}
    </div>
    <div className="activity-status-text">
      {status === 'completed' ? '✓ Completed' : 'Pending use'}
    </div>
  </div>
);

// Main Component
const HomeView = ({ impactStats = {}, mySwipes = [], onNavigate = () => {} }) => {
  const recentActivity = mySwipes.length > 0 ? mySwipes : [
    { id: 1, recipient: 'Jamie Chen', status: 'pending', createdAt: 'Nov 15, 2:34 PM' },
    { id: 2, recipient: 'Alex Kumar', status: 'completed', createdAt: 'Nov 14, 6:12 PM' }
  ];
  
  return (
    <div className="home-view">
      <HeroSection 
        swipesShared={impactStats.swipesShared || 12} 
        daysLeft={impactStats.daysLeft || 87} 
      />
      <QuickActionsSection 
        onTransferClick={() => onNavigate('transfer')}
        onInboxClick={() => onNavigate('inbox')}
      />
      <div className="recent-activity">
        <h3 className="section-title">Recent Activity</h3>
        <div className="activity-list">
          {recentActivity.map(activity => (
            <ActivityCard key={activity.id} {...activity} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeView;