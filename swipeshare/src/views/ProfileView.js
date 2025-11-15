import React from 'react';
import UserProfile from '../components/profile/UserProfile';
import Badge from '../components/common/Badge';
import { mockUsers } from '../data/mockData';
import './ProfileView.css';

export const ProfileView = ({ onLogout = null }) => {
  const currentUser = mockUsers.currentUser;

  return (
    <div className="profile-view">
      <div className="profile-header">
        <h2 className="profile-title">Profile</h2>
      </div>

      {/* User Profile */}
      <UserProfile user={currentUser} />

      {/* Statistics */}
      <div className="profile-section">
        <h3 className="profile-section-title">Impact Summary</h3>
        <div className="profile-stats-card">
          <div className="profile-stats-grid">
            <div className="profile-stat">
              <div className="profile-stat-value profile-stat-blue">{currentUser.swipesShared}</div>
              <div className="profile-stat-label">Total Swipes Shared</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value profile-stat-green">{currentUser.studentsHelped}</div>
              <div className="profile-stat-label">Students Helped</div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="profile-section">
        <h3 className="profile-section-title">Badges & Achievements</h3>
        <div className="profile-badges-card">
          <div className="profile-badges">
            {currentUser.badges.map(badge => (
              <Badge key={badge.id} variant={badge.variant}>{badge.name}</Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="profile-section">
        <h3 className="profile-section-title">Account</h3>
        <div className="profile-settings-card">
          <div className="profile-settings-list">
            <button className="profile-settings-item">
              ⚙️ Settings
            </button>
            <button className="profile-settings-item">
              📞 Help & Support
            </button>
            <button 
              onClick={onLogout}
              className="profile-settings-item profile-settings-logout"
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
