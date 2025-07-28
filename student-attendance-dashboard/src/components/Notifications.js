import React from 'react';
import { Bell, Calendar, AlertTriangle, Info, CheckCircle, Check, CheckCheck } from 'lucide-react';

const Notifications = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'session':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'reminder':
        return <Bell className="w-5 h-5 text-yellow-600" />;
      case 'system':
        return <Info className="w-5 h-5 text-blue-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationBg = (type, unread) => {
    const baseClasses = unread ? 'border-l-4' : 'border-l-4 border-transparent';
    
    switch (type) {
      case 'session':
        return `${baseClasses} ${unread ? 'border-blue-500 bg-blue-50' : 'bg-white'}`;
      case 'reminder':
        return `${baseClasses} ${unread ? 'border-yellow-500 bg-yellow-50' : 'bg-white'}`;
      case 'system':
        return `${baseClasses} ${unread ? 'border-blue-500 bg-blue-50' : 'bg-white'}`;
      case 'success':
        return `${baseClasses} ${unread ? 'border-green-500 bg-green-50' : 'bg-white'}`;
      case 'warning':
        return `${baseClasses} ${unread ? 'border-orange-500 bg-orange-50' : 'bg-white'}`;
      default:
        return `${baseClasses} ${unread ? 'border-gray-500 bg-gray-50' : 'bg-white'}`;
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Notifications
          </h2>
          <p className="text-gray-600">
            {unreadCount > 0 
              ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
              : 'You\'re all caught up!'
            }
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="btn-secondary text-sm py-2 px-3 touch-manipulation"
          >
            <CheckCheck className="w-4 h-4 mr-1" />
            Mark All Read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`card transition-all duration-200 ${getNotificationBg(notification.type, notification.unread)}`}
            >
              <div className="card-body">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`text-sm font-medium ${notification.unread ? 'text-gray-900' : 'text-gray-700'} mb-1`}>
                          {notification.title}
                        </h4>
                        <p className={`text-sm ${notification.unread ? 'text-gray-700' : 'text-gray-600'} mb-2`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {notification.time}
                        </p>
                      </div>
                      
                      {notification.unread && (
                        <button
                          onClick={() => onMarkAsRead(notification.id)}
                          className="ml-4 p-1 text-gray-400 hover:text-gray-600 rounded touch-manipulation"
                          aria-label="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Visual indicator for unread */}
                    {notification.unread && (
                      <div className="absolute top-4 right-4">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Notifications
            </h3>
            <p className="text-gray-600">
              You'll see notifications here when there are updates about your classes and attendance.
            </p>
          </div>
        )}
      </div>

      {/* Notification Settings */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">
            Notification Preferences
          </h3>
        </div>
        <div className="card-body space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Session Reminders</div>
              <div className="text-sm text-gray-600">Get notified about upcoming classes</div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                id="session-reminders"
                defaultChecked
                className="sr-only"
              />
              <label
                htmlFor="session-reminders"
                className="flex items-center cursor-pointer"
              >
                <div className="w-10 h-6 bg-blue-600 rounded-full relative transition-colors duration-200">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform duration-200"></div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Attendance Alerts</div>
              <div className="text-sm text-gray-600">Reminders to mark attendance</div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                id="attendance-alerts"
                defaultChecked
                className="sr-only"
              />
              <label
                htmlFor="attendance-alerts"
                className="flex items-center cursor-pointer"
              >
                <div className="w-10 h-6 bg-blue-600 rounded-full relative transition-colors duration-200">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform duration-200"></div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">System Updates</div>
              <div className="text-sm text-gray-600">Information about app updates and features</div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                id="system-updates"
                defaultChecked
                className="sr-only"
              />
              <label
                htmlFor="system-updates"
                className="flex items-center cursor-pointer"
              >
                <div className="w-10 h-6 bg-gray-300 rounded-full relative transition-colors duration-200">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-transform duration-200"></div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;