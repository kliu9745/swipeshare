import React from 'react';
import { Home, Gift, Inbox, QrCode } from 'lucide-react';
import './BottomNav.css';

export const BottomNav = ({ currentView, onNavigate, inboxCount = 0 }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'transfer', label: 'Transfer', icon: Gift },
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'myswipes', label: 'My Swipes', icon: QrCode }
  ];

  return (
    <div className="bottom-nav">
      <div className="bottom-nav-content">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
            >
              <Icon className="nav-icon" />
              <span className="nav-label">{item.label}</span>
              {item.id === 'inbox' && inboxCount > 0 && (
                <span className="nav-badge">
                  {inboxCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
