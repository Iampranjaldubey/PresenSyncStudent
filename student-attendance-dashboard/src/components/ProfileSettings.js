import React, { useState } from 'react';
import { User, Mail, BookOpen, LogOut, Camera, Edit3, Save, X, Shield, Settings, Info } from 'lucide-react';

const ProfileSettings = ({ user, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState({
    name: user.name,
    email: user.email,
    studentId: user.studentId
  });
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // In a real app, this would make an API call to update the user profile
    console.log('Saving profile data:', editingData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingData({
      name: user.name,
      email: user.email,
      studentId: user.studentId
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  const handleProfilePictureChange = () => {
    // In a real app, this would open a file picker or camera
    const newPicture = `https://ui-avatars.com/api/?name=${encodeURIComponent(editingData.name)}&background=${Math.floor(Math.random()*16777215).toString(16)}&color=fff`;
    setProfilePicture(newPicture);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Profile & Settings
        </h2>
        <p className="text-gray-600">
          Manage your account information and preferences
        </p>
      </div>

      {/* Profile Information */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Profile Information
            </h3>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-secondary text-sm py-2 px-3 touch-manipulation"
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="btn-success text-sm py-2 px-3 touch-manipulation"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="btn-secondary text-sm py-2 px-3 touch-manipulation"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="card-body">
          {/* Profile Picture */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-blue-100">
                <img
                  src={profilePicture}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff`;
                  }}
                />
              </div>
              {isEditing && (
                <button
                  onClick={handleProfilePictureChange}
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 touch-manipulation"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                {isEditing ? editingData.name : user.name}
              </h4>
              <p className="text-sm text-gray-600">
                Student ID: {isEditing ? editingData.studentId : user.studentId}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editingData.name}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">{user.name}</span>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editingData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your email"
                />
              ) : (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">{user.email}</span>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                Student ID
              </label>
              {isEditing ? (
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={editingData.studentId}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your student ID"
                />
              ) : (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <BookOpen className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">{user.studentId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">
            Enrolled Courses
          </h3>
        </div>
        <div className="card-body">
          <div className="space-y-3">
            {user.enrolledCourses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{course.code}</div>
                  <div className="text-sm text-gray-600">{course.name}</div>
                </div>
                <div className="badge-success">Active</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* App Settings */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">
            <Settings className="w-5 h-5 inline mr-2" />
            App Settings
          </h3>
        </div>
        <div className="card-body space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Face Verification</div>
              <div className="text-sm text-gray-600">Require face verification for attendance</div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                id="face-verification"
                defaultChecked
                className="sr-only"
              />
              <label
                htmlFor="face-verification"
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
              <div className="font-medium text-gray-900">Location Verification</div>
              <div className="text-sm text-gray-600">Verify location when marking attendance</div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                id="location-verification"
                defaultChecked
                className="sr-only"
              />
              <label
                htmlFor="location-verification"
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
              <div className="font-medium text-gray-900">Dark Mode</div>
              <div className="text-sm text-gray-600">Use dark theme (coming soon)</div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                id="dark-mode"
                disabled
                className="sr-only"
              />
              <label
                htmlFor="dark-mode"
                className="flex items-center cursor-not-allowed opacity-50"
              >
                <div className="w-10 h-6 bg-gray-300 rounded-full relative transition-colors duration-200">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-transform duration-200"></div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">
            <Shield className="w-5 h-5 inline mr-2" />
            Security
          </h3>
        </div>
        <div className="card-body space-y-3">
          <button className="w-full btn-secondary text-left touch-manipulation">
            Change Password
          </button>
          <button className="w-full btn-secondary text-left touch-manipulation">
            Privacy Settings
          </button>
          <button className="w-full btn-secondary text-left touch-manipulation">
            Data Export
          </button>
        </div>
      </div>

      {/* About */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">
            <Info className="w-5 h-5 inline mr-2" />
            About
          </h3>
        </div>
        <div className="card-body space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">App Version</span>
            <span className="text-gray-900">1.0.0</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Last Updated</span>
            <span className="text-gray-900">Dec 2024</span>
          </div>
          <button className="w-full btn-secondary text-left touch-manipulation">
            Terms of Service
          </button>
          <button className="w-full btn-secondary text-left touch-manipulation">
            Privacy Policy
          </button>
          <button className="w-full btn-secondary text-left touch-manipulation">
            Contact Support
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="card border-red-200">
        <div className="card-body">
          <button
            onClick={handleLogout}
            className="w-full btn-danger touch-manipulation"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
          <p className="text-sm text-gray-600 text-center mt-2">
            You'll need to sign in again to access your account
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;