import React, { useState } from 'react';
import { Home, History, User, Bell, QrCode } from 'lucide-react';
import Header from './Header';
import SessionList from './SessionList';
import QRScanner from './QRScanner';
import AttendanceHistory from './AttendanceHistory';
import ProfileSettings from './ProfileSettings';
import Notifications from './Notifications';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Session Available',
      message: 'CS101 - Lecture starts in 30 minutes',
      time: '10 minutes ago',
      unread: true,
      type: 'session'
    },
    {
      id: 2,
      title: 'Attendance Reminder',
      message: 'Don\'t forget to mark your attendance for Mathematics class',
      time: '1 hour ago',
      unread: true,
      type: 'reminder'
    },
    {
      id: 3,
      title: 'System Update',
      message: 'New face verification feature is now available',
      time: '2 hours ago',
      unread: false,
      type: 'system'
    }
  ]);

  const [sessions, setSessions] = useState([
    {
      id: 1,
      courseCode: 'CS101',
      courseName: 'Computer Science 101',
      instructor: 'Dr. Smith',
      date: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
      duration: 90,
      location: 'Room A-201',
      status: 'upcoming',
      canCheckIn: true,
      qrCode: 'CS101_2024_SESSION_001'
    },
    {
      id: 2,
      courseCode: 'MATH201',
      courseName: 'Advanced Mathematics',
      instructor: 'Prof. Johnson',
      date: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      duration: 120,
      location: 'Room B-105',
      status: 'upcoming',
      canCheckIn: false,
      qrCode: 'MATH201_2024_SESSION_002'
    },
    {
      id: 3,
      courseCode: 'PHY101',
      courseName: 'Physics Fundamentals',
      instructor: 'Dr. Brown',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      duration: 75,
      location: 'Lab C-301',
      status: 'scheduled',
      canCheckIn: false,
      qrCode: 'PHY101_2024_SESSION_003'
    }
  ]);

  const [attendanceHistory, setAttendanceHistory] = useState([
    {
      id: 1,
      courseCode: 'CS101',
      courseName: 'Computer Science 101',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      status: 'present',
      checkedInAt: new Date(Date.now() - 24 * 60 * 60 * 1000 + 5 * 60 * 1000),
      location: 'Room A-201'
    },
    {
      id: 2,
      courseCode: 'MATH201',
      courseName: 'Advanced Mathematics',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      status: 'present',
      checkedInAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 1000),
      location: 'Room B-105'
    },
    {
      id: 3,
      courseCode: 'PHY101',
      courseName: 'Physics Fundamentals',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      status: 'absent',
      location: 'Lab C-301'
    },
    {
      id: 4,
      courseCode: 'CS101',
      courseName: 'Computer Science 101',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      status: 'present',
      checkedInAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 1000),
      location: 'Room A-201'
    }
  ]);

  const [showQRScanner, setShowQRScanner] = useState(false);

  const unreadNotifications = notifications.filter(n => n.unread).length;

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, unread: false }))
    );
  };

  const handleAttendanceMarked = (sessionId, qrData, location, faceVerified) => {
    // Update session status
    setSessions(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? { ...session, status: 'attended', canCheckIn: false }
          : session
      )
    );

    // Add to attendance history
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      const newAttendanceRecord = {
        id: Date.now(),
        courseCode: session.courseCode,
        courseName: session.courseName,
        date: new Date(),
        status: 'present',
        checkedInAt: new Date(),
        location: location || session.location,
        faceVerified,
        qrVerified: true
      };

      setAttendanceHistory(prev => [newAttendanceRecord, ...prev]);

      // Add success notification
      const newNotification = {
        id: Date.now(),
        title: 'Attendance Marked',
        message: `Successfully marked attendance for ${session.courseName}`,
        time: 'Just now',
        unread: true,
        type: 'success'
      };

      setNotifications(prev => [newNotification, ...prev]);
    }

    setShowQRScanner(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <SessionList 
            sessions={sessions}
            onScanQR={() => setShowQRScanner(true)}
            user={user}
          />
        );
      case 'history':
        return <AttendanceHistory history={attendanceHistory} />;
      case 'notifications':
        return (
          <Notifications 
            notifications={notifications}
            onMarkAsRead={markNotificationAsRead}
            onMarkAllAsRead={markAllNotificationsAsRead}
          />
        );
      case 'profile':
        return <ProfileSettings user={user} onLogout={onLogout} />;
      default:
        return (
          <SessionList 
            sessions={sessions}
            onScanQR={() => setShowQRScanner(true)}
            user={user}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        user={user} 
        unreadNotifications={unreadNotifications}
        onNotificationClick={() => setActiveTab('notifications')}
      />

      {/* Main Content */}
      <main className="pb-20 safe-bottom">
        {renderContent()}
      </main>

      {/* Floating Action Button for QR Scanner */}
      {activeTab === 'home' && !showQRScanner && (
        <button
          onClick={() => setShowQRScanner(true)}
          className="fab touch-manipulation"
          aria-label="Scan QR Code"
        >
          <QrCode className="w-6 h-6" />
        </button>
      )}

      {/* Mobile Navigation */}
      <nav className="mobile-nav">
        <button
          onClick={() => setActiveTab('home')}
          className={`mobile-nav-item ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <Home className="w-5 h-5 mb-1" />
          <span className="text-xs">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`mobile-nav-item ${activeTab === 'history' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <History className="w-5 h-5 mb-1" />
          <span className="text-xs">History</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`mobile-nav-item relative ${activeTab === 'notifications' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <Bell className="w-5 h-5 mb-1" />
          {unreadNotifications > 0 && (
            <span className="absolute top-0 right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {unreadNotifications > 9 ? '9+' : unreadNotifications}
            </span>
          )}
          <span className="text-xs">Alerts</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`mobile-nav-item ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <User className="w-5 h-5 mb-1" />
          <span className="text-xs">Profile</span>
        </button>
      </nav>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScanner
          onScanSuccess={handleAttendanceMarked}
          onClose={() => setShowQRScanner(false)}
          sessions={sessions}
        />
      )}
    </div>
  );
};

export default Dashboard;