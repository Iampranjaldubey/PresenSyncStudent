import React from 'react';
import { Bell } from 'lucide-react';

const Header = ({ user, unreadNotifications, onNotificationClick }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 safe-top sticky top-0 z-30">
      <div className="container mx-auto max-w-7xl">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            {/* User Info */}
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-blue-100 flex-shrink-0 ring-2 ring-white shadow-sm">
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff`;
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                  Welcome, {user.name.split(' ')[0]}
                </h1>
                <p className="text-sm text-gray-500 truncate">
                  ID: {user.studentId}
                </p>
              </div>
            </div>

            {/* Notification Bell */}
            <button
              onClick={onNotificationClick}
              className="relative p-3 text-gray-400 hover:text-gray-600 touch-manipulation rounded-xl hover:bg-gray-50 transition-all duration-200 flex-shrink-0"
              style={{ minHeight: '44px', minWidth: '44px' }}
              aria-label={`Notifications ${unreadNotifications > 0 ? `(${unreadNotifications} unread)` : ''}`}
            >
              <Bell className="w-6 h-6" />
              {unreadNotifications > 0 && (
                <>
                  {/* Notification Badge */}
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold border-2 border-white">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                  {/* Pulse Animation */}
                  <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 animate-ping opacity-75"></span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;