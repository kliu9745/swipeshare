import React from 'react';
import { User } from 'lucide-react';

export const Header = ({ onProfileClick }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-600">SwipeShare</h1>
        <button 
          onClick={onProfileClick}
          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
        >
          <User className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default Header;
