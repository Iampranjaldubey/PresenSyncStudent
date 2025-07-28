import React from 'react';
import { Clock, MapPin, User as UserIcon, QrCode, CheckCircle, Calendar, BookOpen } from 'lucide-react';

const SessionList = ({ sessions, onScanQR, user }) => {
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getTimeUntilSession = (date) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 0) {
      return 'Started';
    } else if (diffMins < 60) {
      return `${diffMins}m`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const remainingMins = diffMins % 60;
      return hours > 24 ? `${Math.floor(hours / 24)}d` : `${hours}h ${remainingMins}m`;
    }
  };

  const getStatusBadge = (session) => {
    switch (session.status) {
      case 'upcoming':
        return session.canCheckIn ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
            Ready to Check In
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
            Upcoming
          </span>
        );
      case 'attended':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
            Attended
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            Scheduled
          </span>
        );
      default:
        return null;
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const upcomingSessions = sessions.filter(s => s.status === 'upcoming' || s.status === 'scheduled');
  const attendedSessions = sessions.filter(s => s.status === 'attended');

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              {getGreeting()}!
            </h2>
            <p className="text-blue-100 text-sm sm:text-base">
              {upcomingSessions.length > 0 
                ? `You have ${upcomingSessions.length} upcoming session${upcomingSessions.length !== 1 ? 's' : ''}`
                : 'No upcoming sessions today'
              }
            </p>
          </div>
          <div className="hidden sm:block">
            <Calendar className="w-12 h-12 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Quick Action Card */}
      {upcomingSessions.some(s => s.canCheckIn) && (
        <div className="bg-white rounded-2xl border border-green-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-green-100">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              <h3 className="text-lg font-semibold text-green-800">
                Ready to Check In
              </h3>
            </div>
          </div>
          <div className="p-6 text-center">
            <QrCode className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Mark Your Attendance
            </h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Scan the QR code to quickly mark your attendance with location and face verification
            </p>
            <button
              onClick={onScanQR}
              className="w-full sm:w-auto btn-primary text-lg py-3 px-8 touch-manipulation"
            >
              <QrCode className="w-5 h-5 mr-2" />
              Scan QR Code
            </button>
          </div>
        </div>
      )}

      {/* Upcoming Sessions Card */}
      {upcomingSessions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                Upcoming Sessions
              </h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                {upcomingSessions.length}
              </span>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                {/* Session Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4">
                  <div className="flex-1 mb-3 sm:mb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1 sm:mb-0">
                        {session.courseCode}
                      </h4>
                      {getStatusBadge(session)}
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base mb-3">
                      {session.courseName}
                    </p>
                  </div>
                  
                  {/* Date & Time */}
                  <div className="text-right sm:ml-6 min-w-0">
                    <div className="text-lg font-semibold text-gray-900">
                      {formatDate(session.date)}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {formatTime(session.date)}
                    </div>
                    <div className="text-xs font-medium text-blue-600 mt-1 bg-blue-50 px-2 py-1 rounded-full inline-block">
                      {getTimeUntilSession(session.date)}
                    </div>
                  </div>
                </div>

                {/* Session Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{session.instructor}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{session.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm sm:col-span-2">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{session.duration} minutes</span>
                  </div>
                </div>
                
                {/* Action Button */}
                {session.canCheckIn && (
                  <div className="flex justify-end">
                    <button
                      onClick={onScanQR}
                      className="btn-success text-sm py-2 px-6 touch-manipulation"
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      Check In Now
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently Attended Card */}
      {attendedSessions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Recently Attended
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {attendedSessions.slice(0, 3).map((session) => (
              <div key={session.id} className="p-6 flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                    {session.courseCode}
                  </h4>
                  <p className="text-gray-600 text-sm truncate">
                    {session.courseName}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDate(session.date)} at {formatTime(session.date)}
                  </div>
                </div>
                <span className="badge-success text-xs">Attended</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {upcomingSessions.length === 0 && attendedSessions.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            No Sessions Today
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Check back later for upcoming classes or contact your administrator if you think this is an error.
          </p>
        </div>
      )}
    </div>
  );
};

export default SessionList;