import React from 'react';
import UserProfile from '../components/profile/UserProfile';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import './ProfileView.css';

export const ProfileView = ({ user = {}, onLogout = null }) => {
  const profileUser = {
    name: user.name || 'Jordan Smith',
    email: user.email || 'jordan@cornell.edu',
    rating: user.rating || 4.8,
    reliability: user.reliability || 'High',
    completionRate: user.completionRate || 98,
    memberSince: user.memberSince || 'Nov 2024',
    swipesShared: user.swipesShared || 24,
    studentsHelped: user.studentsHelped || 18,
    badges: user.badges || [
      { id: 'badge_1', name: '🌟 Super Donor', variant: 'success' },
      { id: 'badge_2', name: '💯 Reliable', variant: 'default' },
      { id: 'badge_3', name: '🤝 Community Helper', variant: 'default' }
    ]
  };

  return (
    <div className="profile-view">
      <div className="profile-header">
        <h2 className="profile-title">Profile</h2>
      </div>

      {/* User Profile */}
      <UserProfile user={profileUser} />

      {/* Statistics */}
      <div className="profile-section">
        <h3 className="profile-section-title">Impact Summary</h3>
        <Card variant="bordered">
          <div className="impact-grid">
            <div className="impact-stat">
              <div className="impact-value-blue">{profileUser.swipesShared}</div>
              <div className="impact-label">Total Swipes Shared</div>
            </div>
            <div className="impact-stat">
              <div className="impact-value-green">{profileUser.studentsHelped}</div>
              <div className="impact-label">Students Helped</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Achievements */}
      <div className="profile-section">
        <h3 className="profile-section-title">Badges & Achievements</h3>
        <Card variant="bordered">
          <div className="badges-container">
            {profileUser.badges.map(badge => (
              <Badge key={badge.id} variant={badge.variant}>
                {badge.name}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      {/* Settings */}
      <div className="profile-section">
        <h3 className="profile-section-title">Account</h3>
        <Card variant="bordered">
          <div className="settings-menu">
            <button className="settings-item">
              ⚙️ Settings
            </button>
            <button className="settings-item">
              📞 Help & Support
            </button>
            <button 
              onClick={onLogout}
              className="settings-item settings-item-danger"
            >
              🚪 Sign Out
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfileView;
