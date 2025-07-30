import React, { useState } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, MapPin, Filter, BarChart3, TrendingUp, Award } from 'lucide-react';

const AttendanceHistory = ({ history }) => {
  const [filter, setFilter] = useState('all'); // all, present, absent
  const [sortOrder, setSortOrder] = useState('newest'); // newest, oldest

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getFilteredHistory = () => {
    let filtered = [...history];

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(record => record.status === filter);
    }

    // Apply sort order
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  };

  const getStatusIcon = (status) => {
    return status === 'present' ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    );
  };

  const getStatusBadge = (status) => {
    return status === 'present' ? (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
        Present
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
        Absent
      </span>
    );
  };

  const getAttendanceStats = () => {
    const totalSessions = history.length;
    const presentSessions = history.filter(h => h.status === 'present').length;
    const absentSessions = totalSessions - presentSessions;
    const attendanceRate = totalSessions > 0 ? Math.round((presentSessions / totalSessions) * 100) : 0;

    return {
      total: totalSessions,
      present: presentSessions,
      absent: absentSessions,
      rate: attendanceRate
    };
  };

  const filteredHistory = getFilteredHistory();
  const stats = getAttendanceStats();

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Attendance History
            </h2>
            <p className="text-purple-100 text-sm sm:text-base">
              Track your attendance records across all courses
            </p>
          </div>
          <div className="hidden sm:block">
            <BarChart3 className="w-12 h-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Rate */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 sm:p-6 text-white shadow-lg col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-200" />
            <span className="text-xs sm:text-sm text-blue-200 font-medium">Rate</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold mb-1">
            {stats.rate}%
          </div>
          <div className="text-xs sm:text-sm text-blue-100">
            Attendance Rate
          </div>
        </div>

        {/* Total Sessions */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            <span className="text-xs sm:text-sm text-gray-500 font-medium">Total</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            {stats.total}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            Total Sessions
          </div>
        </div>

        {/* Present */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
            <span className="text-xs sm:text-sm text-gray-500 font-medium">Present</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
            {stats.present}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            Sessions Attended
          </div>
        </div>

        {/* Absent */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
            <span className="text-xs sm:text-sm text-gray-500 font-medium">Missed</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-1">
            {stats.absent}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            Sessions Missed
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Filter className="w-5 h-5 mr-2 text-gray-600" />
              Filter & Sort
            </h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Filter
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Records</option>
                <option value="present">Present Only</option>
                <option value="absent">Absent Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="input-field"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* History Records Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Attendance Records
            </h3>
            <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              {filteredHistory.length} records
            </span>
          </div>
        </div>
        
        {filteredHistory.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredHistory.map((record) => (
              <div key={record.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1 mb-4 sm:mb-0">
                    <div className="mt-1 flex-shrink-0">
                      {getStatusIcon(record.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1 sm:mb-0">
                          {record.courseCode}
                        </h4>
                        {getStatusBadge(record.status)}
                      </div>
                      <p className="text-gray-600 text-sm sm:text-base mb-3">
                        {record.courseName}
                      </p>
                      
                      {/* Record Details */}
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {formatDate(record.date)}
                        </div>
                        {record.checkedInAt && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                            Checked in at {formatTime(record.checkedInAt)}
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          {record.location}
                        </div>
                      </div>
                      
                      {/* Verification Badges */}
                      {record.status === 'present' && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {record.qrVerified && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                              QR Verified
                            </span>
                          )}
                          {record.faceVerified && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                              Face Verified
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 sm:p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Records Found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {filter === 'all' 
                ? 'Your attendance history will appear here once you start attending classes.'
                : `No ${filter} records found. Try adjusting your filters.`
              }
            </p>
          </div>
        )}
      </div>

      {/* Course Breakdown Card */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-600" />
              Course Breakdown
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(
                history.reduce((acc, record) => {
                  if (!acc[record.courseCode]) {
                    acc[record.courseCode] = {
                      name: record.courseName,
                      total: 0,
                      present: 0
                    };
                  }
                  acc[record.courseCode].total++;
                  if (record.status === 'present') {
                    acc[record.courseCode].present++;
                  }
                  return acc;
                }, {})
              ).map(([courseCode, data]) => {
                const rate = Math.round((data.present / data.total) * 100);
                return (
                  <div key={courseCode} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                          {courseCode}
                        </h4>
                        <p className="text-gray-600 text-sm truncate">
                          {data.name}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-bold text-lg text-gray-900">
                          {rate}%
                        </div>
                        <div className="text-sm text-gray-600">
                          {data.present}/{data.total}
                        </div>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          rate >= 75 ? 'bg-green-500' : rate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${rate}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceHistory;