import React from 'react';
import UserProfile from '../components/profile/UserProfile';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

export const ProfileView = ({ onLogout = null }) => {
  const mockUser = {
    name: 'Jordan Smith',
    email: 'jordan@cornell.edu',
    rating: 4.8,
    reliability: 'High',
    completionRate: 98,
    memberSince: 'Nov 2024'
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
      </div>

      {/* User Profile */}
      <UserProfile user={mockUser} />

      {/* Statistics */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Impact Summary</h3>
        <Card variant="bordered">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">24</div>
              <div className="text-sm text-gray-600 mt-1">Total Swipes Shared</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">18</div>
              <div className="text-sm text-gray-600 mt-1">Students Helped</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Achievements */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Badges & Achievements</h3>
        <Card variant="bordered">
          <div className="flex flex-wrap gap-2">
            <Badge variant="success">🌟 Super Donor</Badge>
            <Badge variant="default">💯 Reliable</Badge>
            <Badge variant="default">🤝 Community Helper</Badge>
          </div>
        </Card>
      </div>

      {/* Settings */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Account</h3>
        <Card variant="bordered">
          <div className="space-y-3">
            <button className="w-full text-left text-gray-900 font-medium hover:text-blue-600 transition">
              ⚙️ Settings
            </button>
            <button className="w-full text-left text-gray-900 font-medium hover:text-blue-600 transition">
              📞 Help & Support
            </button>
            <button 
              onClick={onLogout}
              className="w-full text-left text-red-600 font-medium hover:text-red-700 transition"
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
