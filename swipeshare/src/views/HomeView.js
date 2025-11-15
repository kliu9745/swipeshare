import React from 'react';
import { Gift, Inbox, User, Clock, CheckCircle, Plus } from 'lucide-react';
import { mockUsers, mockMySwipes, mockIncomingSwipes } from '../data/mockData';
import './HomeView.css';

const HomeView = ({ onNavigate }) => {
  const currentUser = mockUsers.currentUser;
  const recentActivity = mockMySwipes.slice(0, 2);
  
  return (
    <div className="home-view">
      {/* Hero Section */}
      <div className="hero-section">
        <h2 className="hero-title">Welcome back, {currentUser.name.split(' ')[0]}!</h2>
        <p className="hero-subtitle">Share meals, build community</p>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-value">{currentUser.swipesShared}</div>
            <div className="hero-stat-label">Swipes Shared</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">{currentUser.planDaysRemaining}</div>
            <div className="hero-stat-label">Days Left</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section">
        <h3 className="section-title">Quick Actions</h3>
        <div className="quick-actions">
          <button 
            className="action-button action-button-primary"
            onClick={() => onNavigate && onNavigate('transfer')}
          >
            <div className="action-button-content">
              <Gift className="action-icon" />
              <div className="action-text">
                <div className="action-title">Transfer Swipe</div>
                <div className="action-subtitle">Help someone today</div>
              </div>
            </div>
            <Plus className="action-arrow" />
          </button>
          
          <button 
            className="action-button action-button-secondary"
            onClick={() => onNavigate && onNavigate('inbox')}
          >
            <div className="action-button-content">
              <Inbox className="action-icon-secondary" />
              <div className="action-text">
                <div className="action-title-secondary">View Inbox</div>
                <div className="action-subtitle-secondary">{mockIncomingSwipes.length} new {mockIncomingSwipes.length === 1 ? 'swipe' : 'swipes'}</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="section">
        <h3 className="section-title">Recent Activity</h3>
        <div className="activity-list">
          {recentActivity.map(activity => (
            <div key={activity.id} className="activity-card">
              <div className="activity-header">
                <div className="activity-user">
                  <div className="activity-avatar">
                    <User className="activity-avatar-icon" />
                  </div>
                  <div>
                    <div className="activity-name">{activity.recipient}</div>
                    <div className="activity-time">{activity.createdAt}</div>
                  </div>
                </div>
                {activity.status === 'completed' ? (
                  <CheckCircle className="activity-status-completed" />
                ) : (
                  <Clock className="activity-status-pending" />
                )}
              </div>
              <div className="activity-status-text">
                {activity.status === 'completed' ? '✓ Completed' : 'Pending use'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeView;