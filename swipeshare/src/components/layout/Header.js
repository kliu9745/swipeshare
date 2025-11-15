import React from 'react';
import { User } from 'lucide-react';
import './Header.css';

export const Header = ({ onProfileClick }) => {
  return (
    <div className="header">
      <div className="header-content">
        <h1 className="header-title">SwipeShare</h1>
        <button 
          onClick={onProfileClick}
          className="header-profile-button"
        >
          <User className="header-profile-icon" />
        </button>
      </div>
    </div>
  );
};

export default Header;
