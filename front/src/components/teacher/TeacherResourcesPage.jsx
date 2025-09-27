import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TeacherResourcesPage = () => {
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list'
  const [uploadedResources, setUploadedResources] = useState([]);
  const [teacherBranches, setTeacherBranches] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    branch: '',
    subject: '',
    category: 'lecture-notes',
    tags: '',
    file: null
  });

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

  const teacherBranchesData = [
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

  const categories = [
    { id: 'all', name: 'All Categories', icon: 'ri-folder-line' },
    { id: 'lecture-notes', name: 'Lecture Notes', icon: 'ri-file-text-line' },
    { id: 'assignments', name: 'Assignments', icon: 'ri-clipboard-line' },
    { id: 'exams', name: 'Exams & Quizzes', icon: 'ri-file-edit-line' },
    { id: 'presentations', name: 'Presentations', icon: 'ri-slideshow-line' },
    { id: 'videos', name: 'Video Lectures', icon: 'ri-video-line' },
    { id: 'projects', name: 'Project Guidelines', icon: 'ri-tools-line' },
    { id: 'reference', name: 'Reference Materials', icon: 'ri-book-line' }
  ];

  // Mock uploaded resources with branch and subject data
  const mockResources = [
    {
      id: 1,
      title: 'Introduction to Programming Fundamentals',
      description: 'Comprehensive overview of programming concepts for CSE first year students',
      branch: 'cse-2021',
      branchName: 'CSE 2021 Batch',
      subject: 'cs101',
      subjectName: 'Programming Fundamentals',
      category: 'lecture-notes',
      categoryName: 'Lecture Notes',
      fileName: 'intro_programming.pdf',
      fileSize: '2.4 MB',
      fileType: 'pdf',
      uploadDate: '2025-09-25',
      downloads: 142,
      tags: ['fundamentals', 'programming', 'variables', 'loops'],
      isPublic: true,
      lastModified: '2025-09-25 10:30 AM'
    },
    {
      id: 2,
      title: 'Database Design Assignment',
      description: 'Assignment covering ER diagrams and normalization for third year CSE students',
      branch: 'cse-2022',
      branchName: 'CSE 2022 Batch',
      subject: 'cs301',
      subjectName: 'Database Management Systems',
      category: 'assignments',
      categoryName: 'Assignments',
      fileName: 'db_design_assignment.pdf',
      fileSize: '1.8 MB',
      fileType: 'pdf',
      uploadDate: '2025-09-24',
      downloads: 89,
      tags: ['database', 'ER-diagram', 'normalization', 'SQL'],
      isPublic: true,
      lastModified: '2025-09-24 02:15 PM'
    },
    {
      id: 3,
      title: 'Circuit Analysis Presentation',
      description: 'PowerPoint presentation on Kirchhoff\'s laws and circuit theorems',
      branch: 'ece-2021',
      branchName: 'ECE 2021 Batch',
      subject: 'ec101',
      subjectName: 'Circuit Analysis',
      category: 'presentations',
      categoryName: 'Presentations',
      fileName: 'circuit_analysis.pptx',
      fileSize: '5.2 MB',
      fileType: 'pptx',
      uploadDate: '2025-09-23',
      downloads: 156,
      tags: ['circuits', 'kirchhoff', 'analysis', 'theorems'],
      isPublic: true,
      lastModified: '2025-09-23 11:45 AM'
    },
    {
      id: 4,
      title: 'Thermodynamics Midterm Study Guide',
      description: 'Comprehensive study guide covering first and second laws of thermodynamics',
      branch: 'me-2022',
      branchName: 'ME 2022 Batch',
      subject: 'me301',
      subjectName: 'Thermodynamics',
      category: 'exams',
      categoryName: 'Exams & Quizzes',
      fileName: 'thermo_study_guide.pdf',
      fileSize: '3.1 MB',
      fileType: 'pdf',
      uploadDate: '2025-09-22',
      downloads: 203,
      tags: ['thermodynamics', 'laws', 'energy', 'entropy'],
      isPublic: true,
      lastModified: '2025-09-22 04:20 PM'
    },
    {
      id: 5,
      title: 'Data Structures Video Tutorial',
      description: 'Video tutorial demonstrating linked list implementation and operations',
      branch: 'cse-2021',
      branchName: 'CSE 2021 Batch',
      subject: 'cs102',
      subjectName: 'Data Structures',
      category: 'videos',
      categoryName: 'Video Lectures',
      fileName: 'linked_lists.mp4',
      fileSize: '125 MB',
      fileType: 'mp4',
      uploadDate: '2025-09-21',
      downloads: 78,
      tags: ['data-structures', 'linked-list', 'implementation', 'tutorial'],
      isPublic: true,
      lastModified: '2025-09-21 09:30 AM'
    }
  ];

  useEffect(() => {
    setUploadedResources(mockResources);
    setTeacherBranches(teacherBranchesData);
  }, []);

  const getAvailableSubjects = () => {
    if (selectedBranch === 'all') return [{ id: 'all', name: 'All Subjects' }];
    const branch = teacherBranches.find(b => b.id === selectedBranch);
    return branch?.subjects ? [{ id: 'all', name: 'All Subjects' }, ...branch.subjects] : [{ id: 'all', name: 'All Subjects' }];
  };

  const filteredResources = uploadedResources.filter(resource => {
    const branchMatch = selectedBranch === 'all' || resource.branch === selectedBranch;
    const subjectMatch = selectedSubject === 'all' || resource.subject === selectedSubject;
    const categoryMatch = selectedCategory === 'all' || resource.category === selectedCategory;
    return branchMatch && subjectMatch && categoryMatch;
  });

  const getFileIcon = (fileType) => {
    const icons = {
      pdf: 'ri-file-pdf-line',
      doc: 'ri-file-word-line',
      docx: 'ri-file-word-line',
      ppt: 'ri-slideshow-line',
      pptx: 'ri-slideshow-line',
      xlsx: 'ri-file-excel-line',
      mp4: 'ri-video-line',
      mp3: 'ri-file-music-line',
      zip: 'ri-file-zip-line',
      jpg: 'ri-image-line',
      png: 'ri-image-line',
      txt: 'ri-file-text-line'
    };
    return icons[fileType] || 'ri-file-line';
  };

  const getFileTypeColor = (fileType) => {
    const colors = {
      pdf: 'text-red-400',
      doc: 'text-blue-400',
      docx: 'text-blue-400',
      ppt: 'text-orange-400',
      pptx: 'text-orange-400',
      xlsx: 'text-green-400',
      mp4: 'text-purple-400',
      mp3: 'text-pink-400',
      zip: 'text-yellow-400',
      jpg: 'text-cyan-400',
      png: 'text-cyan-400',
      txt: 'text-gray-400'
    };
    return colors[fileType] || 'text-gray-400';
  };

  const handleUpload = () => {
    const selectedBranchData = teacherBranches.find(b => b.id === uploadForm.branch);
    const selectedSubjectData = selectedBranchData?.subjects.find(s => s.id === uploadForm.subject);

    const newResource = {
      id: Date.now(),
      ...uploadForm,
      branchName: selectedBranchData?.name || '',
      subjectName: selectedSubjectData?.name || '',
      categoryName: categories.find(c => c.id === uploadForm.category)?.name || '',
      fileName: uploadForm.file?.name || 'unknown_file.pdf',
      fileSize: '2.1 MB', // Mock size
      fileType: uploadForm.file?.name?.split('.').pop() || 'pdf',
      uploadDate: new Date().toISOString().split('T')[0],
      downloads: 0,
      tags: uploadForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      isPublic: true,
      lastModified: new Date().toLocaleString()
    };

    setUploadedResources([newResource, ...uploadedResources]);
    setShowUploadModal(false);
    setUploadForm({
      title: '',
      description: '',
      branch: '',
      subject: '',
      category: 'lecture-notes',
      tags: '',
      file: null
    });
  };

  const deleteResource = (resourceId) => {
    setUploadedResources(uploadedResources.filter(r => r.id !== resourceId));
  };

  const downloadResource = (resource) => {
    // In a real app, this would trigger actual file download
    console.log(`Downloading: ${resource.fileName}`);
    const updatedResources = uploadedResources.map(r =>
      r.id === resource.id ? { ...r, downloads: r.downloads + 1 } : r
    );
    setUploadedResources(updatedResources);
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredResources.map((resource, index) => (
        <motion.div
          key={resource.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${themeClasses.card} p-6 rounded-lg hover:shadow-xl transition-all duration-300 group`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-full ${themeClasses.surface} ${getFileTypeColor(resource.fileType)}`}>
              <i className={`${getFileIcon(resource.fileType)} text-2xl`}></i>
            </div>
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => downloadResource(resource)}
                className="p-2 rounded bg-green-600 hover:bg-green-700 text-white transition-colors"
                title="Download"
              >
                <i className="ri-download-line text-sm"></i>
              </button>
              <button
                onClick={() => {
                  setSelectedResource(resource);
                  setShowResourceModal(true);
                }}
                className="p-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                title="View Details"
              >
                <i className="ri-eye-line text-sm"></i>
              </button>
              <button
                onClick={() => deleteResource(resource.id)}
                className="p-2 rounded bg-red-600 hover:bg-red-700 text-white transition-colors"
                title="Delete"
              >
                <i className="ri-delete-bin-line text-sm"></i>
              </button>
            </div>
          </div>

          <h3 className={`font-semibold ${themeClasses.text.primary} mb-2 line-clamp-2`}>
            {resource.title}
          </h3>

          <p className={`text-sm ${themeClasses.text.muted} mb-4 line-clamp-2`}>
            {resource.description}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex flex-col">
                <span className={themeClasses.text.secondary}>{resource.branchName}</span>
                <span className={`text-xs ${themeClasses.text.muted}`}>{resource.subjectName}</span>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${themeClasses.surface} ${themeClasses.text.secondary}`}>
                {resource.categoryName}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className={themeClasses.text.muted}>{resource.fileSize}</span>
              <span className={themeClasses.text.muted}>{resource.uploadDate}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <div className="flex items-center space-x-4 text-sm">
              <span className={`${themeClasses.text.muted} flex items-center`}>
                <i className="ri-download-line mr-1"></i>
                {resource.downloads}
              </span>
              <span className={`${themeClasses.text.muted} flex items-center`}>
                <i className="ri-price-tag-3-line mr-1"></i>
                {resource.tags.length}
              </span>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${resource.isPublic ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
              {resource.isPublic ? 'Public' : 'Private'}
            </span>
          </div>

          {resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {resource.tags.slice(0, 3).map(tag => (
                <span key={tag} className={`px-2 py-1 text-xs rounded ${themeClasses.surface} ${themeClasses.text.muted}`}>
                  {tag}
                </span>
              ))}
              {resource.tags.length > 3 && (
                <span className={`px-2 py-1 text-xs rounded ${themeClasses.surface} ${themeClasses.text.muted}`}>
                  +{resource.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {filteredResources.map((resource, index) => (
        <motion.div
          key={resource.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`${themeClasses.card} p-6 rounded-lg hover:shadow-lg transition-all group`}
        >
          <div className="flex items-center space-x-6">
            <div className={`p-4 rounded-full ${themeClasses.surface} ${getFileTypeColor(resource.fileType)}`}>
              <i className={`${getFileIcon(resource.fileType)} text-2xl`}></i>
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={`font-semibold ${themeClasses.text.primary} mb-1`}>
                    {resource.title}
                  </h3>
                  <p className={`text-sm ${themeClasses.text.muted} mb-2`}>
                    {resource.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className={themeClasses.text.secondary}>{resource.branchName}</span>
                    <span className={themeClasses.text.secondary}>{resource.subjectName}</span>
                    <span className={themeClasses.text.secondary}>{resource.categoryName}</span>
                    <span className={themeClasses.text.muted}>{resource.fileSize}</span>
                    <span className={themeClasses.text.muted}>{resource.uploadDate}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => downloadResource(resource)}
                    className="p-2 rounded bg-green-600 hover:bg-green-700 text-white transition-colors"
                    title="Download"
                  >
                    <i className="ri-download-line"></i>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedResource(resource);
                      setShowResourceModal(true);
                    }}
                    className="p-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    title="View Details"
                  >
                    <i className="ri-eye-line"></i>
                  </button>
                  <button
                    onClick={() => deleteResource(resource.id)}
                    className="p-2 rounded bg-red-600 hover:bg-red-700 text-white transition-colors"
                    title="Delete"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <div className="text-center">
                <div className={`font-semibold ${themeClasses.text.primary}`}>
                  {resource.downloads}
                </div>
                <div className={themeClasses.text.muted}>Downloads</div>
              </div>
              <div className="text-center">
                <div className={`font-semibold ${themeClasses.text.primary}`}>
                  {resource.tags.length}
                </div>
                <div className={themeClasses.text.muted}>Tags</div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className={`min-h-screen ${themeClasses.background} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${themeClasses.text.primary} mb-2`}>
              Teaching Resources
            </h1>
            <p className={themeClasses.text.secondary}>
              Upload and manage resources for your students
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className={`px-6 py-3 ${themeClasses.button.primary} rounded-lg transition-colors`}
          >
            <i className="ri-add-line mr-2"></i>
            Upload Resource
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className={`${themeClasses.card} p-6 rounded-lg text-center`}>
            <i className="ri-file-line text-3xl text-blue-400 mb-2"></i>
            <h3 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
              {uploadedResources.length}
            </h3>
            <p className={themeClasses.text.secondary}>Total Resources</p>
          </div>

          <div className={`${themeClasses.card} p-6 rounded-lg text-center`}>
            <i className="ri-download-line text-3xl text-green-400 mb-2"></i>
            <h3 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
              {uploadedResources.reduce((sum, r) => sum + r.downloads, 0)}
            </h3>
            <p className={themeClasses.text.secondary}>Total Downloads</p>
          </div>

          <div className={`${themeClasses.card} p-6 rounded-lg text-center`}>
            <i className="ri-book-line text-3xl text-purple-400 mb-2"></i>
            <h3 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
              {teacherBranches.length - 1}
            </h3>
            <p className={themeClasses.text.secondary}>Branches</p>
          </div>

          <div className={`${themeClasses.card} p-6 rounded-lg text-center`}>
            <i className="ri-folder-line text-3xl text-yellow-400 mb-2"></i>
            <h3 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
              {categories.length - 1}
            </h3>
            <p className={themeClasses.text.secondary}>Categories</p>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className={`${themeClasses.card} p-6 rounded-lg mb-8`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
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
                  className={`px-3 py-2 rounded-lg ${themeClasses.surface} ${themeClasses.border} ${themeClasses.text.primary} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
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
                  className={`px-3 py-2 rounded-lg ${themeClasses.surface} ${themeClasses.border} ${themeClasses.text.primary} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
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
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`px-3 py-2 rounded-lg ${themeClasses.surface} ${themeClasses.border} ${themeClasses.text.primary} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
                title="Grid View"
              >
                <i className="ri-grid-line"></i>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
                title="List View"
              >
                <i className="ri-list-check"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Resources Display */}
        <div className="mb-8">
          {filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <i className="ri-folder-open-line text-6xl text-gray-400 mb-4"></i>
              <h3 className={`text-xl ${themeClasses.text.secondary} mb-2`}>
                No resources found
              </h3>
              <p className={themeClasses.text.muted}>
                {selectedBranch === 'all' && selectedCategory === 'all'
                  ? "Upload your first teaching resource to get started"
                  : "Try adjusting your filters or upload resources for this branch/category"
                }
              </p>
            </div>
          ) : (
            viewMode === 'grid' ? renderGridView() : renderListView()
          )}
        </div>

        {/* Upload Modal */}
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
                className={`${themeClasses.card} rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto`}
              >
                <h3 className={`text-xl font-semibold ${themeClasses.text.primary} mb-6`}>
                  Upload New Resource
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                      Resource Title
                    </label>
                    <input
                      type="text"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                      placeholder="Enter a descriptive title for your resource"
                      className={`w-full px-3 py-2 rounded-lg ${themeClasses.surface} ${themeClasses.border} ${themeClasses.text.primary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                      Description
                    </label>
                    <textarea
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                      placeholder="Provide a detailed description of the resource content"
                      rows={3}
                      className={`w-full px-3 py-2 rounded-lg ${themeClasses.surface} ${themeClasses.border} ${themeClasses.text.primary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                        Branch & Year
                      </label>
                      <select
                        value={uploadForm.branch}
                        onChange={(e) => {
                          setUploadForm({...uploadForm, branch: e.target.value, subject: ''}); // Reset subject when branch changes
                        }}
                        className={`w-full px-3 py-2 rounded-lg ${themeClasses.surface} ${themeClasses.border} ${themeClasses.text.primary} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      >
                        <option value="">Select a branch</option>
                        {teacherBranches.slice(1).map(branch => (
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
                        value={uploadForm.subject}
                        onChange={(e) => setUploadForm({...uploadForm, subject: e.target.value})}
                        className={`w-full px-3 py-2 rounded-lg ${themeClasses.surface} ${themeClasses.border} ${themeClasses.text.primary} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        disabled={!uploadForm.branch}
                      >
                        <option value="">Select a subject</option>
                        {uploadForm.branch && teacherBranches.find(b => b.id === uploadForm.branch)?.subjects?.map(subject => (
                          <option key={subject.id} value={subject.id}>
                            {subject.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                      Category
                    </label>
                    <select
                      value={uploadForm.category}
                      onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                      className={`w-full px-3 py-2 rounded-lg ${themeClasses.surface} ${themeClasses.border} ${themeClasses.text.primary} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    >
                      {categories.slice(1).map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={uploadForm.tags}
                      onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
                      placeholder="e.g., algorithms, programming, data-structures"
                      className={`w-full px-3 py-2 rounded-lg ${themeClasses.surface} ${themeClasses.border} ${themeClasses.text.primary} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.secondary} mb-2`}>
                      Upload File
                    </label>
                    <div className={`border-2 border-dashed ${themeClasses.border} rounded-lg p-8 text-center hover:border-indigo-500 transition-colors`}>
                      <i className="ri-file-upload-line text-4xl text-gray-400 mb-4"></i>
                      <p className={`${themeClasses.text.muted} mb-2`}>
                        Drop your file here or click to browse
                      </p>
                      <input
                        type="file"
                        onChange={(e) => setUploadForm({...uploadForm, file: e.target.files[0]})}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xlsx,.mp4,.mp3,.jpg,.png,.zip"
                      />
                      <button
                        onClick={() => document.querySelector('input[type="file"]').click()}
                        className={`px-4 py-2 ${themeClasses.button.primary} rounded-lg text-sm`}
                      >
                        Choose File
                      </button>
                      {uploadForm.file && (
                        <p className={`mt-2 text-sm ${themeClasses.text.secondary}`}>
                          Selected: {uploadForm.file.name}
                        </p>
                      )}
                    </div>
                  </div>
                {/* </div> */}

                <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-600">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className={`px-4 py-2 ${themeClasses.button.secondary} rounded-lg`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={!uploadForm.title || !uploadForm.branch || !uploadForm.subject || !uploadForm.file}
                    className={`px-6 py-2 ${
                      uploadForm.title && uploadForm.branch && uploadForm.subject && uploadForm.file
                        ? themeClasses.button.primary
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    } rounded-lg transition-colors`}
                  >
                    <i className="ri-upload-line mr-2"></i>
                    Upload Resource
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resource Details Modal */}
        <AnimatePresence>
          {showResourceModal && selectedResource && (
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
                className={`${themeClasses.card} rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-4 rounded-full ${themeClasses.surface} ${getFileTypeColor(selectedResource.fileType)}`}>
                      <i className={`${getFileIcon(selectedResource.fileType)} text-3xl`}></i>
                    </div>
                    <div>
                      <h3 className={`text-xl font-semibold ${themeClasses.text.primary}`}>
                        {selectedResource.title}
                      </h3>
                      <p className={`${themeClasses.text.secondary} mt-1`}>
                        {selectedResource.fileName}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowResourceModal(false)}
                    className="p-2 rounded hover:bg-gray-700 transition-colors"
                  >
                    <i className={`ri-close-line text-xl ${themeClasses.text.muted}`}></i>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className={`font-medium ${themeClasses.text.secondary} mb-2`}>Description</h4>
                    <p className={themeClasses.text.primary}>{selectedResource.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className={`font-medium ${themeClasses.text.secondary} mb-2`}>Branch & Year</h4>
                      <p className={themeClasses.text.primary}>{selectedResource.branchName}</p>
                    </div>
                    <div>
                      <h4 className={`font-medium ${themeClasses.text.secondary} mb-2`}>Subject</h4>
                      <p className={themeClasses.text.primary}>{selectedResource.subjectName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className={`font-medium ${themeClasses.text.secondary} mb-2`}>Category</h4>
                      <p className={themeClasses.text.primary}>{selectedResource.categoryName}</p>
                    </div>
                    <div>
                      <h4 className={`font-medium ${themeClasses.text.secondary} mb-2`}>File Type</h4>
                      <p className={themeClasses.text.primary}>{selectedResource.fileType?.toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h4 className={`font-medium ${themeClasses.text.secondary} mb-2`}>File Size</h4>
                      <p className={themeClasses.text.primary}>{selectedResource.fileSize}</p>
                    </div>
                    <div>
                      <h4 className={`font-medium ${themeClasses.text.secondary} mb-2`}>Downloads</h4>
                      <p className={themeClasses.text.primary}>{selectedResource.downloads}</p>
                    </div>
                    <div>
                      <h4 className={`font-medium ${themeClasses.text.secondary} mb-2`}>Upload Date</h4>
                      <p className={themeClasses.text.primary}>{selectedResource.uploadDate}</p>
                    </div>
                  </div>

                  {selectedResource.tags.length > 0 && (
                    <div>
                      <h4 className={`font-medium ${themeClasses.text.secondary} mb-3`}>Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedResource.tags.map(tag => (
                          <span key={tag} className={`px-3 py-1 text-sm rounded-full ${themeClasses.surface} ${themeClasses.text.primary} border ${themeClasses.border}`}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-600">
                  <button
                    onClick={() => setShowResourceModal(false)}
                    className={`px-4 py-2 ${themeClasses.button.secondary} rounded-lg`}
                  >
                    Close
                  </button>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => downloadResource(selectedResource)}
                      className={`px-4 py-2 ${themeClasses.button.success} rounded-lg`}
                    >
                      <i className="ri-download-line mr-2"></i>
                      Download
                    </button>
                    <button
                      onClick={() => {
                        deleteResource(selectedResource.id);
                        setShowResourceModal(false);
                      }}
                      className={`px-4 py-2 ${themeClasses.button.danger} rounded-lg`}
                    >
                      <i className="ri-delete-bin-line mr-2"></i>
                      Delete
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

export default TeacherResourcesPage;