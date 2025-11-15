import React from 'react';
import { Home, Gift, Inbox, QrCode } from 'lucide-react';

export const BottomNav = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'transfer', label: 'Transfer', icon: Gift },
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'myswipes', label: 'My Swipes', icon: QrCode }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 safe-area-bottom">
      <div className="flex justify-around items-center max-w-2xl mx-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 transition ${
                isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-semibold">{item.label}</span>
              {item.id === 'inbox' && (
                <span className="absolute -top-1 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  1
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
