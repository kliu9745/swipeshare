import React from 'react';
import Card from '../common/Card';
import { User, Star } from 'lucide-react';

export const UserProfile = ({ user = {} }) => {
  return (
    <div className="space-y-4">
      <Card className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-blue-600" />
        </div>
        <div className="font-bold text-lg text-gray-900">{user.name || 'Student Name'}</div>
        <div className="text-sm text-gray-600">{user.email || 'student@cornell.edu'}</div>
        
        <div className="flex items-center justify-center gap-1 mt-2">
          {Array(5).fill(0).map((_, i) => (
            <Star 
              key={i}
              className={`w-4 h-4 ${
                i < (user.rating || 4) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-sm text-gray-600 ml-2">{user.rating || 4.0}</span>
        </div>
      </Card>

      <Card variant="bordered">
        <h3 className="font-semibold text-gray-900 mb-3">Account Stats</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Reliability Score</span>
            <span className="font-semibold text-gray-900">{user.reliability || 'High'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Completion Rate</span>
            <span className="font-semibold text-gray-900">{user.completionRate || 98}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Member Since</span>
            <span className="font-semibold text-gray-900">{user.memberSince || 'Nov 2024'}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserProfile;
