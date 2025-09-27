import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { themeClasses, iconClasses } from '../../../styles/theme';

const TeacherStudents = () => {
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Teacher's branches and subjects data - consistent with other components
  const teacherBranches = [
    {
      id: 'all',
      name: 'All Branches',
      subjects: []
    },
    {
      id: 'cse-2021',
      name: 'CSE 2021 Batch',
      branchName: 'Computer Science Engineering',
      year: '2021',
      subjects: [
        { id: 'cs101', name: 'Programming Fundamentals' },
        { id: 'cs102', name: 'Data Structures' }
      ]
    },
    {
      id: 'cse-2022',
      name: 'CSE 2022 Batch', 
      branchName: 'Computer Science Engineering',
      year: '2022',
      subjects: [
        { id: 'cs301', name: 'Database Management Systems' },
        { id: 'cs302', name: 'Computer Networks' }
      ]
    },
    {
      id: 'ece-2021',
      name: 'ECE 2021 Batch',
      branchName: 'Electronics & Communication',
      year: '2021',
      subjects: [
        { id: 'ec101', name: 'Circuit Analysis' },
        { id: 'ec102', name: 'Electronic Devices' }
      ]
    },
    {
      id: 'me-2022',
      name: 'ME 2022 Batch',
      branchName: 'Mechanical Engineering', 
      year: '2022',
      subjects: [
        { id: 'me301', name: 'Thermodynamics' },
        { id: 'me302', name: 'Fluid Mechanics' }
      ]
    }
  ];

  // Mock student data organized by branch
  const mockStudents = [
    // CSE 2021 Batch Students
    {
      id: 'STU001',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@college.edu',
      rollNumber: 'CSE21001',
      branch: 'cse-2021',
      branchName: 'CSE 2021 Batch',
      phone: '+91 9876543210',
      subjects: ['cs101', 'cs102'],
      attendance: 92,
      assignments: { submitted: 8, pending: 1, total: 9 },
      lastActive: '2024-01-15',
      status: 'Active'
    },
    {
      id: 'STU002', 
      name: 'Priya Patel',
      email: 'priya.patel@college.edu',
      rollNumber: 'CSE21002',
      branch: 'cse-2021',
      branchName: 'CSE 2021 Batch',
      phone: '+91 9876543211',
      subjects: ['cs101', 'cs102'],
      attendance: 88,
      assignments: { submitted: 7, pending: 2, total: 9 },
      lastActive: '2024-01-14',
      status: 'Active'
    },
    // CSE 2022 Batch Students
    {
      id: 'STU003',
      name: 'Arjun Kumar',
      email: 'arjun.kumar@college.edu',
      rollNumber: 'CSE22001',
      branch: 'cse-2022',
      branchName: 'CSE 2022 Batch',
      phone: '+91 9876543212',
      subjects: ['cs301', 'cs302'],
      attendance: 95,
      assignments: { submitted: 10, pending: 0, total: 10 },
      lastActive: '2024-01-15',
      status: 'Active'
    },
    {
      id: 'STU004',
      name: 'Sneha Gupta',
      email: 'sneha.gupta@college.edu',
      rollNumber: 'CSE22002',
      branch: 'cse-2022',
      branchName: 'CSE 2022 Batch',
      phone: '+91 9876543213',
      subjects: ['cs301', 'cs302'],
      attendance: 90,
      assignments: { submitted: 9, pending: 1, total: 10 },
      lastActive: '2024-01-13',
      status: 'Active'
    },
    // ECE 2021 Batch Students
    {
      id: 'STU005',
      name: 'Vikash Singh',
      email: 'vikash.singh@college.edu',
      rollNumber: 'ECE21001',
      branch: 'ece-2021',
      branchName: 'ECE 2021 Batch',
      phone: '+91 9876543214',
      subjects: ['ec101', 'ec102'],
      attendance: 87,
      assignments: { submitted: 6, pending: 2, total: 8 },
      lastActive: '2024-01-12',
      status: 'Active'
    },
    // ME 2022 Batch Students
    {
      id: 'STU006',
      name: 'Anita Reddy',
      email: 'anita.reddy@college.edu',
      rollNumber: 'ME22001',
      branch: 'me-2022',
      branchName: 'ME 2022 Batch',
      phone: '+91 9876543215',
      subjects: ['me301', 'me302'],
      attendance: 94,
      assignments: { submitted: 8, pending: 0, total: 8 },
      lastActive: '2024-01-15',
      status: 'Active'
    }
  ];

  // Filter students based on selected branch, subject, and search term
  const filteredStudents = mockStudents.filter(student => {
    const matchesBranch = selectedBranch === 'all' || student.branch === selectedBranch;
    const matchesSubject = selectedSubject === 'all' || student.subjects.includes(selectedSubject);
    const matchesSearch = searchTerm === '' || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesBranch && matchesSubject && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    totalStudents: filteredStudents.length,
    averageAttendance: Math.round(filteredStudents.reduce((sum, student) => sum + student.attendance, 0) / filteredStudents.length) || 0,
    activeStudents: filteredStudents.filter(s => s.status === 'Active').length,
    pendingAssignments: filteredStudents.reduce((sum, student) => sum + student.assignments.pending, 0)
  };

  return (
    <div className={`min-h-screen ${themeClasses.background}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${themeClasses.text.primary}`}>My Students</h1>
            <p className={`${themeClasses.text.secondary} mt-2`}>
              Manage students across branches and subjects
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${themeClasses.primaryCard} p-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${themeClasses.text.secondary}`}>Total Students</p>
                <p className={`text-3xl font-bold ${themeClasses.text.primary} mt-1`}>
                  {stats.totalStudents}
                </p>
              </div>
              <div className={`p-3 rounded-full ${themeClasses.surface}`}>
                <i className={`ri-group-line text-2xl ${iconClasses.primary}`}></i>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${themeClasses.primaryCard} p-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${themeClasses.text.secondary}`}>Avg. Attendance</p>
                <p className={`text-3xl font-bold ${themeClasses.text.primary} mt-1`}>
                  {stats.averageAttendance}%
                </p>
              </div>
              <div className={`p-3 rounded-full ${themeClasses.surface}`}>
                <i className={`ri-calendar-check-line text-2xl ${iconClasses.success}`}></i>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${themeClasses.primaryCard} p-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${themeClasses.text.secondary}`}>Active Students</p>
                <p className={`text-3xl font-bold ${themeClasses.text.primary} mt-1`}>
                  {stats.activeStudents}
                </p>
              </div>
              <div className={`p-3 rounded-full ${themeClasses.surface}`}>
                <i className={`ri-user-line text-2xl ${iconClasses.primary}`}></i>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${themeClasses.primaryCard} p-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${themeClasses.text.secondary}`}>Pending Tasks</p>
                <p className={`text-3xl font-bold ${themeClasses.text.primary} mt-1`}>
                  {stats.pendingAssignments}
                </p>
              </div>
              <div className={`p-3 rounded-full ${themeClasses.surface}`}>
                <i className={`ri-clipboard-line text-2xl ${iconClasses.warning}`}></i>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className={`${themeClasses.primaryCard} p-6 mb-6`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                Branch & Year
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => {
                  setSelectedBranch(e.target.value);
                  setSelectedSubject('all'); // Reset subject when branch changes
                }}
                className={`w-full px-3 py-2 rounded-lg ${themeClasses.surface} ${themeClasses.border} ${themeClasses.text.primary} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                {teacherBranches.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg ${themeClasses.surface} ${themeClasses.border} ${themeClasses.text.primary} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                disabled={selectedBranch === 'all'}
              >
                <option value="all">All Subjects</option>
                {selectedBranch !== 'all' && teacherBranches.find(b => b.id === selectedBranch)?.subjects?.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                Search Students
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, roll number, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full px-3 py-2 pl-10 rounded-lg ${themeClasses.surface} ${themeClasses.border} ${themeClasses.text.primary} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                <i className={`ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 ${iconClasses.neutral}`}></i>
              </div>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className={`${themeClasses.primaryCard}`}>
          <div className="p-6 border-b border-gray-600">
            <h2 className={`text-xl font-semibold ${themeClasses.text.primary}`}>
              Students ({filteredStudents.length})
            </h2>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center">
              <i className={`ri-user-line text-6xl ${iconClasses.neutral} mb-4`}></i>
              <p className={`text-lg ${themeClasses.text.secondary}`}>No students found</p>
              <p className={`${themeClasses.text.secondary}`}>
                Try adjusting your filters or search term
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={themeClasses.surface}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-sm font-medium ${themeClasses.text.secondary}`}>
                      Student Info
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-medium ${themeClasses.text.secondary}`}>
                      Branch & Year
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-medium ${themeClasses.text.secondary}`}>
                      Attendance
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-medium ${themeClasses.text.secondary}`}>
                      Assignments
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-medium ${themeClasses.text.secondary}`}>
                      Last Active
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-medium ${themeClasses.text.secondary}`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {filteredStudents.map((student, index) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white font-medium">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className={`font-medium ${themeClasses.text.primary}`}>
                              {student.name}
                            </p>
                            <p className={`text-sm ${themeClasses.text.secondary}`}>
                              {student.rollNumber}
                            </p>
                            <p className={`text-sm ${themeClasses.text.secondary}`}>
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`font-medium ${themeClasses.text.primary}`}>
                          {student.branchName}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            student.attendance >= 90 ? 'bg-green-500' :
                            student.attendance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <span className={`font-medium ${
                            student.attendance >= 90 ? 'text-green-400' :
                            student.attendance >= 75 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {student.attendance}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className={`font-medium ${themeClasses.text.primary}`}>
                            {student.assignments.submitted}/{student.assignments.total}
                          </p>
                          <p className={`text-sm ${themeClasses.text.secondary}`}>
                            {student.assignments.pending} pending
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`text-sm ${themeClasses.text.secondary}`}>
                          {new Date(student.lastActive).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowStudentModal(true);
                          }}
                          className={`px-3 py-1 text-sm ${themeClasses.button.secondary} rounded-lg transition-colors`}
                        >
                          <i className="ri-eye-line mr-1"></i>
                          View
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Student Details Modal */}
        <AnimatePresence>
          {showStudentModal && selectedStudent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowStudentModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`${themeClasses.primaryCard} rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
              >
                <div className="p-6 border-b border-gray-600">
                  <div className="flex items-center justify-between">
                    <h2 className={`text-xl font-semibold ${themeClasses.text.primary}`}>
                      Student Details
                    </h2>
                    <button
                      onClick={() => setShowStudentModal(false)}
                      className={`${themeClasses.text.secondary} hover:${themeClasses.text.primary} transition-colors`}
                    >
                      <i className="ri-close-line text-2xl"></i>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-xl">
                        {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
                        {selectedStudent.name}
                      </h3>
                      <p className={`${themeClasses.text.secondary}`}>
                        {selectedStudent.rollNumber} • {selectedStudent.branchName}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className={`font-semibold ${themeClasses.text.primary} mb-3`}>
                        Contact Information
                      </h4>
                      <div className="space-y-2">
                        <p className={`${themeClasses.text.secondary}`}>
                          <span className="font-medium">Email:</span> {selectedStudent.email}
                        </p>
                        <p className={`${themeClasses.text.secondary}`}>
                          <span className="font-medium">Phone:</span> {selectedStudent.phone}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className={`font-semibold ${themeClasses.text.primary} mb-3`}>
                        Academic Status
                      </h4>
                      <div className="space-y-2">
                        <p className={`${themeClasses.text.secondary}`}>
                          <span className="font-medium">Status:</span> 
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                            selectedStudent.status === 'Active' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {selectedStudent.status}
                          </span>
                        </p>
                        <p className={`${themeClasses.text.secondary}`}>
                          <span className="font-medium">Last Active:</span> {new Date(selectedStudent.lastActive).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className={`font-semibold ${themeClasses.text.primary} mb-3`}>
                        Attendance Record
                      </h4>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-2 ${
                          selectedStudent.attendance >= 90 ? 'bg-green-500' :
                          selectedStudent.attendance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className={`text-2xl font-bold ${
                          selectedStudent.attendance >= 90 ? 'text-green-400' :
                          selectedStudent.attendance >= 75 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {selectedStudent.attendance}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className={`font-semibold ${themeClasses.text.primary} mb-3`}>
                        Assignment Progress
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className={`${themeClasses.text.secondary}`}>Submitted</span>
                          <span className={`font-medium ${themeClasses.text.primary}`}>
                            {selectedStudent.assignments.submitted}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`${themeClasses.text.secondary}`}>Pending</span>
                          <span className={`font-medium ${
                            selectedStudent.assignments.pending > 0 ? 'text-red-400' : themeClasses.text.primary
                          }`}>
                            {selectedStudent.assignments.pending}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`${themeClasses.text.secondary}`}>Total</span>
                          <span className={`font-medium ${themeClasses.text.primary}`}>
                            {selectedStudent.assignments.total}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-600">
                    <h4 className={`font-semibold ${themeClasses.text.primary} mb-3`}>
                      Enrolled Subjects
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudent.subjects.map(subjectId => {
                        const subject = teacherBranches.find(b => b.id === selectedStudent.branch)
                          ?.subjects.find(s => s.id === subjectId);
                        return (
                          <span
                            key={subjectId}
                            className={`px-3 py-1 text-sm ${themeClasses.surface} ${themeClasses.text.primary} rounded-full border ${themeClasses.border}`}
                          >
                            {subject?.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TeacherStudents;