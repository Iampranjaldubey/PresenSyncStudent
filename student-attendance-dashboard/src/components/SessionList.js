import React from 'react';
import { Clock, MapPin, User as UserIcon, QrCode, CheckCircle } from 'lucide-react';

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
          <span className="badge-success">Ready to Check In</span>
        ) : (
          <span className="badge-warning">Upcoming</span>
        );
      case 'attended':
        return <span className="badge-success">Attended</span>;
      case 'scheduled':
        return <span className="badge-warning">Scheduled</span>;
      default:
        return null;
    }
  };

  const upcomingSessions = sessions.filter(s => s.status === 'upcoming' || s.status === 'scheduled');
  const attendedSessions = sessions.filter(s => s.status === 'attended');

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}!
        </h2>
        <p className="text-gray-600">
          {upcomingSessions.length > 0 
            ? `You have ${upcomingSessions.length} upcoming session${upcomingSessions.length !== 1 ? 's' : ''}`
            : 'No upcoming sessions today'
          }
        </p>
      </div>

      {/* Quick Action Card */}
      {upcomingSessions.some(s => s.canCheckIn) && (
        <div className="card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="card-body text-center">
            <QrCode className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Ready to Check In?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Scan the QR code to mark your attendance
            </p>
            <button
              onClick={onScanQR}
              className="btn-primary touch-manipulation"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Scan QR Code
            </button>
          </div>
        </div>
      )}

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Sessions
          </h3>
          <div className="space-y-3">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="card hover:shadow-md transition-shadow duration-200">
                <div className="card-body">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {session.courseCode}
                        </h4>
                        {getStatusBadge(session)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {session.courseName}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <UserIcon className="w-4 h-4 mr-1" />
                          {session.instructor}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {session.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(session.date)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatTime(session.date)}
                      </div>
                      <div className="text-xs text-blue-600 font-medium mt-1">
                        {getTimeUntilSession(session.date)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {session.duration} minutes
                    </div>
                    
                    {session.canCheckIn && (
                      <button
                        onClick={onScanQR}
                        className="btn-success text-sm py-2 px-4 touch-manipulation"
                      >
                        <QrCode className="w-4 h-4 mr-1" />
                        Check In
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recently Attended */}
      {attendedSessions.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recently Attended
          </h3>
          <div className="space-y-3">
            {attendedSessions.slice(0, 3).map((session) => (
              <div key={session.id} className="card">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {session.courseCode}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {session.courseName}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(session.date)} at {formatTime(session.date)}
                        </div>
                      </div>
                    </div>
                    <span className="badge-success">Attended</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {upcomingSessions.length === 0 && attendedSessions.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Sessions Today
          </h3>
          <p className="text-gray-600">
            Check back later for upcoming classes
          </p>
        </div>
      )}
    </div>
  );
};

export default SessionList;