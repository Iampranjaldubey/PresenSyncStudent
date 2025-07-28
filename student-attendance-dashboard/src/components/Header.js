import React from 'react';
import { Bell } from 'lucide-react';

const Header = ({ user, unreadNotifications, onNotificationClick }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 safe-top">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100">
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff`;
                }}
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 truncate">
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
            className="relative p-2 text-gray-400 hover:text-gray-600 touch-manipulation rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label={`Notifications ${unreadNotifications > 0 ? `(${unreadNotifications} unread)` : ''}`}
          >
            <Bell className="w-6 h-6" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;