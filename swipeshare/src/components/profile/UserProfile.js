import React from 'react';
import { User, Star } from 'lucide-react';
import './UserProfile.css';

export const UserProfile = ({ user = {} }) => {
  return (
    <div className="user-profile">
      <div className="user-profile-card">
        <div className="user-avatar">
          <User className="user-avatar-icon" />
        </div>
        <div className="user-name">{user.name || 'Student Name'}</div>
        <div className="user-email">{user.email || 'student@cornell.edu'}</div>
        
        <div className="user-rating">
          {Array(5).fill(0).map((_, i) => (
            <Star 
              key={i}
              className={`user-star ${
                i < (user.rating || 4) ? 'user-star-filled' : 'user-star-empty'
              }`}
            />
          ))}
          <span className="user-rating-text">{user.rating || 4.0}</span>
        </div>
      </div>

      <div className="user-stats-card">
        <h3 className="user-stats-title">Account Stats</h3>
        <div className="user-stats-list">
          <div className="user-stat-row">
            <span className="user-stat-label">Reliability Score</span>
            <span className="user-stat-value">{user.reliability || 'High'}</span>
          </div>
          <div className="user-stat-row">
            <span className="user-stat-label">Completion Rate</span>
            <span className="user-stat-value">{user.completionRate || 98}%</span>
          </div>
          <div className="user-stat-row">
            <span className="user-stat-label">Member Since</span>
            <span className="user-stat-value">{user.memberSince || 'Nov 2024'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
