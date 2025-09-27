import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TeacherGradesPage = () => {
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('1');
  const [gradeMode, setGradeMode] = useState('view'); // 'view', 'edit', 'upload'
  const [studentsData, setStudentsData] = useState([]);
  const [teacherBranches, setTeacherBranches] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingGrades, setEditingGrades] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState('all');

  // Theme classes
  const themeClasses = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white',
    secondary: 'bg-gray-800 text-gray-200',
    accent: 'text-indigo-400',
    background: 'bg-gray-900',
    surface: 'bg-gray-800',
    border: 'border-gray-700',
    text: {
      primary: 'text-gray-100',
      secondary: 'text-gray-300',
      muted: 'text-gray-400'
    },
    button: {
      primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-200',
      success: 'bg-green-600 hover:bg-green-700 text-white',
      warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white'
    },
    card: 'bg-gray-800 border border-gray-700'
  };

  // Mock teacher branches and subjects data
  const mockTeacherBranches = [
    {
      id: 'cse-2021',
      branchName: 'Computer Science Engineering',
      year: '2021',
      semester: 1,
      subjects: [
        { id: 'cs101', name: 'Programming Fundamentals', credits: 4 },
        { id: 'cs102', name: 'Data Structures', credits: 4 }
      ],
      totalStudents: 45
    },
    {
      id: 'cse-2022',
      branchName: 'Computer Science Engineering', 
      year: '2022',
      semester: 3,
      subjects: [
        { id: 'cs301', name: 'Database Management Systems', credits: 4 },
        { id: 'cs302', name: 'Computer Networks', credits: 3 }
      ],
      totalStudents: 38
    },
    {
      id: 'ece-2021',
      branchName: 'Electronics & Communication',
      year: '2021',
      semester: 1,
      subjects: [
        { id: 'ec101', name: 'Circuit Analysis', credits: 4 },
        { id: 'ec102', name: 'Electronic Devices', credits: 3 }
      ],
      totalStudents: 32
    },
    {
      id: 'me-2022',
      branchName: 'Mechanical Engineering',
      year: '2022',
      semester: 3,
      subjects: [
        { id: 'me301', name: 'Thermodynamics', credits: 4 },
        { id: 'me302', name: 'Fluid Mechanics', credits: 3 }
      ],
      totalStudents: 29
    }
  ];

  // Mock student grades data with branch information
  const mockStudentGrades = [
    {
      id: 1,
      rollNo: 'CSE21001',
      name: 'Arjun Sharma',
      email: 'arjun.sharma@college.edu',
      branch: 'cse-2021',
      branchName: 'Computer Science Engineering',
      year: '2021',
      semester: 1,
      assignments: {
        assignment1: { score: 85, maxScore: 100, submitted: true },
        assignment2: { score: 78, maxScore: 100, submitted: true },
        midterm: { score: 88, maxScore: 100, submitted: true },
        project: { score: 92, maxScore: 100, submitted: true },
        final: { score: null, maxScore: 100, submitted: false }
      },
      attendance: 94.5,
      overallGrade: 'A',
      gpa: 3.8
    },
    {
      id: 2,
      rollNo: 'CSE21002',
      name: 'Priya Patel',
      email: 'priya.patel@college.edu',
      branch: 'cse-2021',
      branchName: 'Computer Science Engineering',
      year: '2021',
      semester: 1,
      assignments: {
        assignment1: { score: 92, maxScore: 100, submitted: true },
        assignment2: { score: 89, maxScore: 100, submitted: true },
        midterm: { score: 94, maxScore: 100, submitted: true },
        project: { score: 96, maxScore: 100, submitted: true },
        final: { score: null, maxScore: 100, submitted: false }
      },
      attendance: 98.2,
      overallGrade: 'A+',
      gpa: 4.0
    },
    {
      id: 3,
      rollNo: 'CSE22001',
      name: 'Rohit Kumar',
      email: 'rohit.kumar@college.edu',
      branch: 'cse-2022',
      branchName: 'Computer Science Engineering',
      year: '2022',
      semester: 3,
      assignments: {
        assignment1: { score: 72, maxScore: 100, submitted: true },
        assignment2: { score: 75, maxScore: 100, submitted: true },
        midterm: { score: 69, maxScore: 100, submitted: true },
        project: { score: 81, maxScore: 100, submitted: true },
        final: { score: null, maxScore: 100, submitted: false }
      },
      attendance: 87.3,
      overallGrade: 'B',
      gpa: 3.0
    },
    {
      id: 4,
      rollNo: 'ECE21001',
      name: 'Sneha Reddy',
      email: 'sneha.reddy@college.edu',
      branch: 'ece-2021',
      branchName: 'Electronics & Communication',
      year: '2021',
      semester: 1,
      assignments: {
        assignment1: { score: 88, maxScore: 100, submitted: true },
        assignment2: { score: 91, maxScore: 100, submitted: true },
        midterm: { score: 86, maxScore: 100, submitted: true },
        project: { score: 94, maxScore: 100, submitted: true },
        final: { score: null, maxScore: 100, submitted: false }
      },
      attendance: 96.1,
      overallGrade: 'A',
      gpa: 3.7
    },
    {
      id: 5,
      rollNo: 'ME22001',
      name: 'Vikash Singh',
      email: 'vikash.singh@college.edu',
      branch: 'me-2022',
      branchName: 'Mechanical Engineering',
      year: '2022',
      semester: 3,
      assignments: {
        assignment1: { score: 65, maxScore: 100, submitted: true },
        assignment2: { score: 68, maxScore: 100, submitted: true },
        midterm: { score: 71, maxScore: 100, submitted: true },
        project: { score: 73, maxScore: 100, submitted: true },
        final: { score: null, maxScore: 100, submitted: false }
      },
      attendance: 82.7,
      overallGrade: 'C+',
      gpa: 2.5
    }
  ];

  const assignmentTypes = [
    { id: 'all', name: 'All Assignments' },
    { id: 'assignment1', name: 'Assignment 1' },
    { id: 'assignment2', name: 'Assignment 2' },
    { id: 'midterm', name: 'Mid-term Exam' },
    { id: 'project', name: 'Final Project' },
    { id: 'final', name: 'Final Exam' }
  ];

  useEffect(() => {
    setTeacherBranches(mockTeacherBranches);
    setStudentsData(mockStudentGrades);
    if (mockTeacherBranches.length > 0) {
      setSelectedBranch(mockTeacherBranches[0].id);
      if (mockTeacherBranches[0].subjects.length > 0) {
        setSelectedSubject(mockTeacherBranches[0].subjects[0].id);
      }
    }
  }, []);

  const handleGradeEdit = (studentId, assignmentType, newScore) => {
    setEditingGrades(prev => ({
      ...prev,
      [`${studentId}_${assignmentType}`]: newScore
    }));
  };

  const saveGradeChanges = () => {
    // In a real app, this would make an API call
    const updatedStudents = studentsData.map(student => {
      const updatedAssignments = { ...student.assignments };
      
      Object.keys(editingGrades).forEach(key => {
        if (key.startsWith(`${student.id}_`)) {
          const assignmentType = key.split('_')[1];
          updatedAssignments[assignmentType] = {
            ...updatedAssignments[assignmentType],
            score: parseFloat(editingGrades[key]) || 0
          };
        }
      });

      return {
        ...student,
        assignments: updatedAssignments
      };
    });

    setStudentsData(updatedStudents);
    setEditingGrades({});
    setGradeMode('view');
  };

  const calculateClassAverage = (assignmentType) => {
    if (assignmentType === 'all') {
      const allScores = studentsData.flatMap(student => 
        Object.values(student.assignments)
          .filter(assignment => assignment.score !== null)
          .map(assignment => (assignment.score / assignment.maxScore) * 100)
      );
      return allScores.length > 0 ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1) : 0;
    } else {
      const scores = studentsData
        .map(student => student.assignments[assignmentType])
        .filter(assignment => assignment && assignment.score !== null)
        .map(assignment => (assignment.score / assignment.maxScore) * 100);
      return scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;
    }
  };

  const getGradeColor = (grade) => {
    const gradeColors = {
      'A+': 'text-green-400',
      'A': 'text-green-300',
      'B+': 'text-yellow-300',
      'B': 'text-yellow-400',
      'C+': 'text-orange-300',
      'C': 'text-orange-400',
      'D': 'text-red-400',
      'F': 'text-red-500'
    };
    return gradeColors[grade] || 'text-gray-400';
  };

  const filteredStudents = studentsData.filter(student => {
    const branchMatch = !selectedBranch || student.branch === selectedBranch;
    const searchMatch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    return branchMatch && searchMatch;
  });

  const getCurrentBranch = () => {
    return teacherBranches.find(branch => branch.id === selectedBranch);
  };

  const getCurrentSubject = () => {
    const branch = getCurrentBranch();
    return branch?.subjects.find(subject => subject.id === selectedSubject);
  };

  const getAvailableSubjects = () => {
    const branch = getCurrentBranch();
    return branch?.subjects || [];
  };

  return (
    <div className={`min-h-screen ${themeClasses.background} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${themeClasses.text.primary} mb-2`}>
              Grade Management
            </h1>
            <p className={themeClasses.text.secondary}>
              Manage student grades and academic performance
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowUploadModal(true)}
              className={`px-4 py-2 rounded-lg ${themeClasses.button.primary} transition-colors`}
            >
              <i className="ri-upload-line mr-2"></i>
              Bulk Upload
            </button>

            <button
              onClick={() => setGradeMode(gradeMode === 'edit' ? 'view' : 'edit')}
              className={`px-4 py-2 rounded-lg ${
                gradeMode === 'edit' ? themeClasses.button.success : themeClasses.button.secondary
              } transition-colors`}
            >
              <i className={`${gradeMode === 'edit' ? 'ri-save-line' : 'ri-edit-line'} mr-2`}></i>
              {gradeMode === 'edit' ? 'Save Changes' : 'Edit Grades'}
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className={`${themeClasses.card} p-6 rounded-lg mb-8`}>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                Branch & Year
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => {
                  setSelectedBranch(e.target.value);
                  const branch = teacherBranches.find(b => b.id === e.target.value);
                  if (branch && branch.subjects.length > 0) {
                    setSelectedSubject(branch.subjects[0].id);
                  }
                }}
                className={`w-full px-3 py-2 rounded-lg ${themeClasses.surface} ${themeClasses.border} ${themeClasses.text.primary} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                {teacherBranches.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.branchName} - {branch.year}
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
              >
                {getAvailableSubjects().map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                Semester
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg ${themeClasses.surface} ${themeClasses.border} ${themeClasses.text.primary} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
                <option value="7">Semester 7</option>
                <option value="8">Semester 8</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                Assignment
              </label>
              <select
                value={selectedAssignment}
                onChange={(e) => setSelectedAssignment(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg ${themeClasses.surface} ${themeClasses.border} ${themeClasses.text.primary} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                {assignmentTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                Search Students
              </label>
              <input
                type="text"
                placeholder="Search by name or roll no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg ${themeClasses.surface} ${themeClasses.border} ${themeClasses.text.primary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                Class Average
              </label>
              <div className={`px-3 py-2 rounded-lg ${themeClasses.surface} ${themeClasses.text.primary} font-semibold text-center`}>
                {calculateClassAverage(selectedAssignment)}%
              </div>
            </div>
          </div>

          {/* Branch and Subject Info */}
          <div className="mt-4 p-4 bg-indigo-900/20 rounded-lg border border-indigo-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <span className="text-sm font-medium text-indigo-300">Current Branch:</span>
                  <span className={`ml-2 ${themeClasses.text.primary} font-semibold`}>
                    {getCurrentBranch()?.branchName} - {getCurrentBranch()?.year}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-indigo-300">Subject:</span>
                  <span className={`ml-2 ${themeClasses.text.primary} font-semibold`}>
                    {getCurrentSubject()?.name}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-indigo-300">Credits:</span>
                  <span className={`ml-2 ${themeClasses.text.primary} font-semibold`}>
                    {getCurrentSubject()?.credits}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-indigo-300">Total Students:</span>
                <span className={`ml-2 text-lg ${themeClasses.text.primary} font-bold`}>
                  {filteredStudents.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Grade Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className={`${themeClasses.card} p-6 rounded-lg text-center`}>
            <i className="ri-user-line text-3xl text-blue-400 mb-2"></i>
            <h3 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
              {filteredStudents.length}
            </h3>
            <p className={themeClasses.text.secondary}>Students in Branch</p>
          </div>

          <div className={`${themeClasses.card} p-6 rounded-lg text-center`}>
            <i className="ri-star-line text-3xl text-green-400 mb-2"></i>
            <h3 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
              {filteredStudents.filter(s => s.overallGrade.includes('A')).length}
            </h3>
            <p className={themeClasses.text.secondary}>A Grades</p>
          </div>

          <div className={`${themeClasses.card} p-6 rounded-lg text-center`}>
            <i className="ri-alarm-warning-line text-3xl text-yellow-400 mb-2"></i>
            <h3 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
              {filteredStudents.filter(s => ['C', 'D', 'F'].includes(s.overallGrade)).length}
            </h3>
            <p className={themeClasses.text.secondary}>Need Attention</p>
          </div>

          <div className={`${themeClasses.card} p-6 rounded-lg text-center`}>
            <i className="ri-calendar-check-line text-3xl text-purple-400 mb-2"></i>
            <h3 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
              {filteredStudents.length > 0 ? (filteredStudents.reduce((sum, s) => sum + s.attendance, 0) / filteredStudents.length).toFixed(1) : 0}%
            </h3>
            <p className={themeClasses.text.secondary}>Avg Attendance</p>
          </div>

          <div className={`${themeClasses.card} p-6 rounded-lg text-center`}>
            <i className="ri-book-line text-3xl text-indigo-400 mb-2"></i>
            <h3 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
              {teacherBranches.length}
            </h3>
            <p className={themeClasses.text.secondary}>Total Branches</p>
          </div>
        </div>

        {/* Grades Table */}
        <div className={`${themeClasses.card} rounded-lg overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${themeClasses.surface} border-b ${themeClasses.border}`}>
                <tr>
                  <th className={`px-6 py-4 text-left font-semibold ${themeClasses.text.primary}`}>
                    Student
                  </th>
                  <th className={`px-6 py-4 text-center font-semibold ${themeClasses.text.primary}`}>
                    Assignment 1
                  </th>
                  <th className={`px-6 py-4 text-center font-semibold ${themeClasses.text.primary}`}>
                    Assignment 2
                  </th>
                  <th className={`px-6 py-4 text-center font-semibold ${themeClasses.text.primary}`}>
                    Mid-term
                  </th>
                  <th className={`px-6 py-4 text-center font-semibold ${themeClasses.text.primary}`}>
                    Project
                  </th>
                  <th className={`px-6 py-4 text-center font-semibold ${themeClasses.text.primary}`}>
                    Final
                  </th>
                  <th className={`px-6 py-4 text-center font-semibold ${themeClasses.text.primary}`}>
                    Attendance
                  </th>
                  <th className={`px-6 py-4 text-center font-semibold ${themeClasses.text.primary}`}>
                    Grade
                  </th>
                  <th className={`px-6 py-4 text-center font-semibold ${themeClasses.text.primary}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border-b ${themeClasses.border} hover:bg-gray-750 transition-colors`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full ${themeClasses.primary} flex items-center justify-center font-semibold`}>
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className={`font-medium ${themeClasses.text.primary}`}>
                            {student.name}
                          </p>
                          <p className={`text-sm ${themeClasses.text.muted}`}>
                            {student.rollNo}
                          </p>
                        </div>
                      </div>
                    </td>

                    {['assignment1', 'assignment2', 'midterm', 'project', 'final'].map(assignmentType => (
                      <td key={assignmentType} className="px-6 py-4 text-center">
                        {gradeMode === 'edit' ? (
                          <input
                            type="number"
                            min="0"
                            max={student.assignments[assignmentType]?.maxScore || 100}
                            value={editingGrades[`${student.id}_${assignmentType}`] ?? student.assignments[assignmentType]?.score ?? ''}
                            onChange={(e) => handleGradeEdit(student.id, assignmentType, e.target.value)}
                            className={`w-16 px-2 py-1 rounded ${themeClasses.surface} ${themeClasses.text.primary} text-center text-sm`}
                            placeholder={student.assignments[assignmentType]?.score ? '' : 'N/A'}
                          />
                        ) : (
                          <span className={`font-medium ${
                            student.assignments[assignmentType]?.score !== null
                              ? themeClasses.text.primary
                              : themeClasses.text.muted
                          }`}>
                            {student.assignments[assignmentType]?.score !== null
                              ? `${student.assignments[assignmentType].score}/${student.assignments[assignmentType].maxScore}`
                              : 'Pending'
                            }
                          </span>
                        )}
                      </td>
                    ))}

                    <td className="px-6 py-4 text-center">
                      <span className={`font-medium ${themeClasses.text.primary}`}>
                        {student.attendance}%
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className={`text-lg font-bold ${getGradeColor(student.overallGrade)}`}>
                        {student.overallGrade}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          className={`p-2 rounded ${themeClasses.button.secondary} hover:bg-indigo-600 transition-colors`}
                          title="View Details"
                        >
                          <i className="ri-eye-line text-sm"></i>
                        </button>
                        <button
                          className={`p-2 rounded ${themeClasses.button.secondary} hover:bg-green-600 transition-colors`}
                          title="Send Message"
                        >
                          <i className="ri-mail-line text-sm"></i>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {gradeMode === 'edit' && Object.keys(editingGrades).length > 0 && (
          <div className="fixed bottom-8 right-8">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center space-x-4"
            >
              <button
                onClick={() => setEditingGrades({})}
                className={`px-6 py-3 rounded-lg ${themeClasses.button.danger} shadow-lg`}
              >
                Cancel Changes
              </button>
              <button
                onClick={saveGradeChanges}
                className={`px-6 py-3 rounded-lg ${themeClasses.button.success} shadow-lg`}
              >
                <i className="ri-save-line mr-2"></i>
                Save All Changes
              </button>
            </motion.div>
          </div>
        )}

        {/* Bulk Upload Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`${themeClasses.card} rounded-lg p-6 w-full max-w-md`}
              >
                <h3 className={`text-xl font-semibold ${themeClasses.text.primary} mb-4`}>
                  Bulk Grade Upload
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                      Assignment Type
                    </label>
                    <select className={`w-full px-3 py-2 rounded-lg ${themeClasses.surface} ${themeClasses.border} ${themeClasses.text.primary}`}>
                      <option>Assignment 1</option>
                      <option>Assignment 2</option>
                      <option>Mid-term Exam</option>
                      <option>Final Project</option>
                      <option>Final Exam</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                      Upload CSV File
                    </label>
                    <div className={`border-2 border-dashed ${themeClasses.border} rounded-lg p-6 text-center`}>
                      <i className="ri-file-upload-line text-3xl text-gray-400 mb-2"></i>
                      <p className={themeClasses.text.muted}>
                        Drop your CSV file here or click to browse
                      </p>
                      <input type="file" accept=".csv" className="hidden" />
                      <button className={`mt-2 px-4 py-2 ${themeClasses.button.primary} rounded-lg text-sm`}>
                        Browse Files
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button
                      onClick={() => setShowUploadModal(false)}
                      className={`px-4 py-2 ${themeClasses.button.secondary} rounded-lg`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setShowUploadModal(false)}
                      className={`px-4 py-2 ${themeClasses.button.primary} rounded-lg`}
                    >
                      Upload Grades
                    </button>
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

export default TeacherGradesPage;