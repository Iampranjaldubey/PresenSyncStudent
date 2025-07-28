import React, { useState } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, MapPin, Filter } from 'lucide-react';

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
      <span className="badge-success">Present</span>
    ) : (
      <span className="badge-danger">Absent</span>
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
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Attendance History
        </h2>
        <p className="text-gray-600">
          Track your attendance records across all courses
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {stats.rate}%
            </div>
            <div className="text-sm text-gray-600">
              Attendance Rate
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">
              Total Sessions
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {stats.present}
            </div>
            <div className="text-sm text-gray-600">
              Present
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {stats.absent}
            </div>
            <div className="text-sm text-gray-600">
              Absent
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Filter & Sort
            </h3>
            <Filter className="w-5 h-5 text-gray-400" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
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

      {/* History List */}
      <div className="space-y-3">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((record) => (
            <div key={record.id} className="card hover:shadow-md transition-shadow duration-200">
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="mt-1">
                      {getStatusIcon(record.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {record.courseCode}
                        </h4>
                        {getStatusBadge(record.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {record.courseName}
                      </p>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(record.date)}
                        </div>
                        {record.checkedInAt && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-2" />
                            Checked in at {formatTime(record.checkedInAt)}
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-2" />
                          {record.location}
                        </div>
                      </div>
                      
                      {/* Verification badges */}
                      {record.status === 'present' && (
                        <div className="flex items-center space-x-2 mt-3">
                          {record.qrVerified && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              QR Verified
                            </span>
                          )}
                          {record.faceVerified && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Face Verified
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Records Found
            </h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Your attendance history will appear here once you start attending classes.'
                : `No ${filter} records found. Try adjusting your filters.`
              }
            </p>
          </div>
        )}
      </div>

      {/* Course breakdown */}
      {history.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              Course Breakdown
            </h3>
          </div>
          <div className="card-body">
            {/* Group by course and show stats */}
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
                <div key={courseCode} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div>
                    <div className="font-medium text-gray-900">{courseCode}</div>
                    <div className="text-sm text-gray-600">{data.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{rate}%</div>
                    <div className="text-sm text-gray-600">{data.present}/{data.total}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceHistory;