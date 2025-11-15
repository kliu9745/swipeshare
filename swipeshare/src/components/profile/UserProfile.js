import React from 'react';
import Card from '../common/Card';
import { User, Star } from 'lucide-react';
import './UserProfile.css';

export const UserProfile = ({ user = {} }) => {
  return (
    <div className="user-profile">
      <Card className="user-profile-card">
        <div className="user-avatar">
          <User className="user-avatar-icon" />
        </div>
        <div className="user-name">{user.name || 'Student Name'}</div>
        <div className="user-email">{user.email || 'student@cornell.edu'}</div>
        
        <div className="user-rating">
          {Array(5).fill(0).map((_, i) => (
            <Star 
              key={i}
              className={`rating-star ${
                i < (user.rating || 4) ? 'rating-star-filled' : 'rating-star-empty'
              }`}
            />
          ))}
          <span className="rating-value">{user.rating || 4.0}</span>
        </div>
      </Card>

      <Card variant="bordered">
        <h3 className="stats-title">Account Stats</h3>
        <div className="stats-list">
          <div className="stat-row">
            <span className="stat-label">Reliability Score</span>
            <span className="stat-value">{user.reliability || 'High'}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Completion Rate</span>
            <span className="stat-value">{user.completionRate || 98}%</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Member Since</span>
            <span className="stat-value">{user.memberSince || 'Nov 2024'}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserProfile;
