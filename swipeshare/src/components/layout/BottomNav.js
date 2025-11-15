import React from 'react';
import { Home, Gift, Inbox, QrCode } from 'lucide-react';
import './BottomNav.css';

export const BottomNav = ({ currentView, onNavigate, inboxCount = 0 }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'transfer', icon: Gift, label: 'Transfer' },
    { id: 'inbox', icon: Inbox, label: 'Inbox', badge: inboxCount },
    { id: 'myswipes', icon: QrCode, label: 'My Swipes' }
  ];

  return (
    <div className="bottom-nav">
      <div className="bottom-nav-content">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`nav-item ${currentView === item.id ? 'nav-item-active' : ''}`}
            >
              <div className="nav-icon-wrapper">
                <Icon className="nav-icon" />
                {item.badge > 0 && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </div>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;