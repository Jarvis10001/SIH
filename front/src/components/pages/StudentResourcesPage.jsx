import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const StudentResourcesPage = () => {
  const [activeTab, setActiveTab] = useState('resources');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [myNotes, setMyNotes] = useState([]);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  // Theme classes for consistency
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
      danger: 'bg-red-600 hover:bg-red-700 text-white',
      success: 'bg-green-600 hover:bg-green-700 text-white'
    },
    input: 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-indigo-500',
    card: 'bg-gray-800 border border-gray-700'
  };

  // Mock study resources data
  const studyResources = [
    {
      id: 1,
      title: 'Data Structures & Algorithms - Complete Guide',
      description: 'Comprehensive guide covering arrays, linked lists, stacks, queues, trees, graphs, and algorithms with code examples.',
      category: 'Computer Science',
      subject: 'Data Structures',
      type: 'PDF',
      size: '15.2 MB',
      author: 'Dr. Sarah Wilson',
      uploadDate: '2025-09-15',
      downloads: 1247,
      rating: 4.8,
      tags: ['DSA', 'Algorithms', 'Programming', 'CS301'],
      fileUrl: '/resources/dsa-complete-guide.pdf',
      thumbnail: '/images/pdf-icon.png'
    },
    {
      id: 2,
      title: 'Database Design Tutorial Videos',
      description: 'Step-by-step video tutorials on database design, normalization, SQL queries, and database administration.',
      category: 'Computer Science',
      subject: 'Database Management',
      type: 'Video',
      size: '850 MB',
      author: 'Prof. Michael Chen',
      uploadDate: '2025-09-20',
      downloads: 892,
      rating: 4.7,
      tags: ['Database', 'SQL', 'DBMS', 'CS302'],
      fileUrl: '/resources/dbms-tutorials/',
      thumbnail: '/images/video-icon.png'
    },
    {
      id: 3,
      title: 'Machine Learning Lab Manual',
      description: 'Practical exercises and projects for machine learning including Python implementations and real-world datasets.',
      category: 'Computer Science',
      subject: 'Machine Learning',
      type: 'Document',
      size: '8.7 MB',
      author: 'Dr. Alex Thompson',
      uploadDate: '2025-09-18',
      downloads: 654,
      rating: 4.9,
      tags: ['ML', 'Python', 'AI', 'CS305'],
      fileUrl: '/resources/ml-lab-manual.pdf',
      thumbnail: '/images/doc-icon.png'
    },
    {
      id: 4,
      title: 'Software Engineering Best Practices',
      description: 'Industry best practices for software development lifecycle, testing, deployment, and project management.',
      category: 'Computer Science',
      subject: 'Software Engineering',
      type: 'eBook',
      size: '22.1 MB',
      author: 'Dr. Emily Davis',
      uploadDate: '2025-09-10',
      downloads: 1156,
      rating: 4.6,
      tags: ['SDLC', 'Testing', 'Project Management', 'CS303'],
      fileUrl: '/resources/se-best-practices.epub',
      thumbnail: '/images/ebook-icon.png'
    },
    {
      id: 5,
      title: 'Computer Networks Lab Simulations',
      description: 'Network simulation files using Cisco Packet Tracer and GNS3 for hands-on networking practice.',
      category: 'Computer Science',
      subject: 'Computer Networks',
      type: 'Simulation',
      size: '156 MB',
      author: 'Prof. James Rodriguez',
      uploadDate: '2025-09-22',
      downloads: 478,
      rating: 4.5,
      tags: ['Networking', 'Simulation', 'Cisco', 'CS304'],
      fileUrl: '/resources/network-simulations.zip',
      thumbnail: '/images/simulation-icon.png'
    },
    {
      id: 6,
      title: 'Mathematics for Computer Science',
      description: 'Essential mathematical concepts for computer science including discrete math, linear algebra, and statistics.',
      category: 'Mathematics',
      subject: 'Applied Mathematics',
      type: 'PDF',
      size: '18.9 MB',
      author: 'Prof. David Kumar',
      uploadDate: '2025-09-08',
      downloads: 2341,
      rating: 4.9,
      tags: ['Mathematics', 'Discrete Math', 'Linear Algebra', 'Statistics'],
      fileUrl: '/resources/math-for-cs.pdf',
      thumbnail: '/images/pdf-icon.png'
    },
    {
      id: 7,
      title: 'Technical Writing Guidelines',
      description: 'Complete guide for technical documentation, research papers, and professional communication.',
      category: 'Communication',
      subject: 'Technical Communication',
      type: 'Document',
      size: '5.4 MB',
      author: 'Dr. Robert Brown',
      uploadDate: '2025-09-25',
      downloads: 789,
      rating: 4.4,
      tags: ['Writing', 'Documentation', 'Communication', 'HS302'],
      fileUrl: '/resources/tech-writing-guide.docx',
      thumbnail: '/images/doc-icon.png'
    },
    {
      id: 8,
      title: 'Programming Interview Preparation',
      description: 'Collection of coding problems, solutions, and interview tips from top tech companies.',
      category: 'Career',
      subject: 'Interview Prep',
      type: 'Collection',
      size: '95.2 MB',
      author: 'Industry Experts',
      uploadDate: '2025-09-12',
      downloads: 3456,
      rating: 4.8,
      tags: ['Interview', 'Coding', 'Career', 'Programming'],
      fileUrl: '/resources/interview-prep/',
      thumbnail: '/images/folder-icon.png'
    }
  ];

  // Mock personal notes data
  const mockNotes = [
    {
      id: 1,
      title: 'DSA Quick Reference',
      subject: 'Data Structures',
      content: 'Quick reference notes for common data structures and algorithms...',
      createdDate: '2025-09-20',
      lastModified: '2025-09-25',
      tags: ['DSA', 'Reference', 'Algorithms'],
      category: 'Study Notes',
      isFavorite: true
    },
    {
      id: 2,
      title: 'Database Normalization Rules',
      subject: 'Database Management',
      content: 'Step-by-step process for database normalization from 1NF to BCNF...',
      createdDate: '2025-09-18',
      lastModified: '2025-09-22',
      tags: ['DBMS', 'Normalization', 'Database Design'],
      category: 'Study Notes',
      isFavorite: false
    },
    {
      id: 3,
      title: 'Machine Learning Project Ideas',
      subject: 'Machine Learning',
      content: 'Collection of interesting ML project ideas for final semester...',
      createdDate: '2025-09-15',
      lastModified: '2025-09-15',
      tags: ['ML', 'Projects', 'Ideas'],
      category: 'Project Notes',
      isFavorite: true
    },
    {
      id: 4,
      title: 'Software Testing Strategies',
      subject: 'Software Engineering',
      content: 'Different testing methodologies and when to use them...',
      createdDate: '2025-09-12',
      lastModified: '2025-09-20',
      tags: ['Testing', 'Software Engineering', 'QA'],
      category: 'Study Notes',
      isFavorite: false
    }
  ];

  useEffect(() => {
    setMyNotes(mockNotes);
  }, []);

  const categories = [
    'all',
    'Computer Science',
    'Mathematics',
    'Communication',
    'Career'
  ];

  const noteCategories = [
    'Study Notes',
    'Project Notes',
    'Research Notes',
    'Personal'
  ];

  const getFileTypeIcon = (type) => {
    const icons = {
      PDF: 'ri-file-pdf-line text-red-400',
      Video: 'ri-video-line text-blue-400',
      Document: 'ri-file-text-line text-green-400',
      eBook: 'ri-book-line text-purple-400',
      Simulation: 'ri-settings-3-line text-yellow-400',
      Collection: 'ri-folder-line text-gray-400'
    };
    return icons[type] || 'ri-file-line text-gray-400';
  };

  const formatFileSize = (size) => {
    return size;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredResources = studyResources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleResourceClick = (resource) => {
    setSelectedResource(resource);
    setShowResourceModal(true);
  };

  const handleNoteEdit = (note) => {
    setCurrentNote(note);
    setShowNoteEditor(true);
  };

  const handleNewNote = () => {
    setCurrentNote({
      title: '',
      subject: '',
      content: '',
      tags: [],
      category: 'Study Notes',
      isFavorite: false
    });
    setShowNoteEditor(true);
  };

  const saveNote = () => {
    if (currentNote.id) {
      // Edit existing note
      setMyNotes(prev => prev.map(note => 
        note.id === currentNote.id 
          ? { ...currentNote, lastModified: new Date().toISOString().split('T')[0] }
          : note
      ));
    } else {
      // Create new note
      const newNote = {
        ...currentNote,
        id: Date.now(),
        createdDate: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0]
      };
      setMyNotes(prev => [newNote, ...prev]);
    }
    setShowNoteEditor(false);
    setCurrentNote(null);
  };

  const deleteNote = (noteId) => {
    setMyNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const toggleNoteFavorite = (noteId) => {
    setMyNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, isFavorite: !note.isFavorite }
        : note
    ));
  };

  return (
    <div className={`min-h-screen ${themeClasses.background} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${themeClasses.text.primary} mb-2`}>
              Resources & Notes
            </h1>
            <p className={themeClasses.text.secondary}>
              Access study materials and manage your personal notes
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleNewNote}
              className={`px-4 py-2 rounded-lg ${themeClasses.button.primary} transition-colors flex items-center space-x-2`}
            >
              <i className="ri-add-line"></i>
              <span>New Note</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`${themeClasses.card} p-1 rounded-lg mb-6 flex`}>
          {[
            { id: 'resources', name: 'Study Resources', icon: 'ri-folder-line' },
            { id: 'notes', name: 'My Notes', icon: 'ri-sticky-note-line' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded transition-colors ${
                activeTab === tab.id 
                  ? themeClasses.button.primary 
                  : `${themeClasses.text.secondary} hover:bg-gray-700`
              }`}
            >
              <i className={tab.icon}></i>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <>
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
              </div>
              <div className="flex space-x-2 overflow-x-auto">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? themeClasses.button.primary
                        : themeClasses.button.secondary
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map(resource => (
                <motion.div
                  key={resource.id}
                  className={`${themeClasses.card} p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition-all duration-200`}
                  onClick={() => handleResourceClick(resource)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <i className={`${getFileTypeIcon(resource.type)} text-2xl`}></i>
                      <div>
                        <span className={`text-xs px-2 py-1 rounded ${themeClasses.surface} ${themeClasses.text.muted}`}>
                          {resource.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <i className="ri-star-fill text-sm"></i>
                      <span className={`text-sm ${themeClasses.text.muted}`}>{resource.rating}</span>
                    </div>
                  </div>

                  <h3 className={`font-semibold ${themeClasses.text.primary} mb-2 line-clamp-2`}>
                    {resource.title}
                  </h3>
                  <p className={`text-sm ${themeClasses.text.secondary} mb-3 line-clamp-3`}>
                    {resource.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {resource.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className={`text-xs px-2 py-1 rounded-full bg-indigo-900 ${themeClasses.accent}`}
                      >
                        {tag}
                      </span>
                    ))}
                    {resource.tags.length > 3 && (
                      <span className={`text-xs ${themeClasses.text.muted}`}>
                        +{resource.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className={themeClasses.text.muted}>
                      <i className="ri-user-line mr-1"></i>
                      {resource.author}
                    </div>
                    <div className={themeClasses.text.muted}>
                      <i className="ri-download-line mr-1"></i>
                      {resource.downloads}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className={themeClasses.text.muted}>
                      {formatFileSize(resource.size)}
                    </span>
                    <span className={themeClasses.text.muted}>
                      {formatDate(resource.uploadDate)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <>
            {/* Notes Filter */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-2">
                {noteCategories.map(category => (
                  <button
                    key={category}
                    className={`px-3 py-1 rounded text-sm ${themeClasses.button.secondary}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="flex space-x-2">
                <button className={`p-2 rounded ${themeClasses.button.secondary}`}>
                  <i className="ri-layout-grid-line"></i>
                </button>
                <button className={`p-2 rounded ${themeClasses.button.secondary}`}>
                  <i className="ri-list-unordered"></i>
                </button>
              </div>
            </div>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myNotes.map(note => (
                <motion.div
                  key={note.id}
                  className={`${themeClasses.card} p-4 rounded-lg hover:bg-gray-700 transition-all duration-200`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded ${themeClasses.surface} ${themeClasses.text.muted}`}>
                        {note.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleNoteFavorite(note.id)}
                        className={`p-1 rounded ${note.isFavorite ? 'text-yellow-400' : 'text-gray-500'}`}
                      >
                        <i className={`${note.isFavorite ? 'ri-star-fill' : 'ri-star-line'} text-sm`}></i>
                      </button>
                      <button
                        onClick={() => handleNoteEdit(note)}
                        className={`p-1 rounded text-gray-400 hover:text-indigo-400`}
                      >
                        <i className="ri-edit-line text-sm"></i>
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className={`p-1 rounded text-gray-400 hover:text-red-400`}
                      >
                        <i className="ri-delete-bin-line text-sm"></i>
                      </button>
                    </div>
                  </div>

                  <h3 className={`font-semibold ${themeClasses.text.primary} mb-2`}>
                    {note.title}
                  </h3>
                  <p className={`text-sm ${themeClasses.text.secondary} mb-3 line-clamp-3`}>
                    {note.content}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {note.tags.map(tag => (
                      <span
                        key={tag}
                        className={`text-xs px-2 py-1 rounded-full bg-purple-900 text-purple-300`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className={themeClasses.text.muted}>
                      {note.subject}
                    </span>
                    <span className={themeClasses.text.muted}>
                      {formatDate(note.lastModified)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Resource Details Modal */}
        {showResourceModal && selectedResource && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              className={`${themeClasses.card} p-6 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold ${themeClasses.text.primary}`}>
                  Resource Details
                </h3>
                <button
                  onClick={() => setShowResourceModal(false)}
                  className={`p-2 rounded-lg ${themeClasses.button.secondary} hover:bg-gray-600 transition-colors`}
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <i className={`${getFileTypeIcon(selectedResource.type)} text-3xl`}></i>
                  <div className="flex-1">
                    <h4 className={`text-lg font-semibold ${themeClasses.text.primary} mb-2`}>
                      {selectedResource.title}
                    </h4>
                    <p className={`${themeClasses.text.secondary} mb-4`}>
                      {selectedResource.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h5 className={`font-medium ${themeClasses.text.primary} mb-3`}>Details</h5>
                    <div className={`space-y-2 text-sm ${themeClasses.text.secondary}`}>
                      <div className="flex justify-between">
                        <span>Author:</span>
                        <span>{selectedResource.author}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Subject:</span>
                        <span>{selectedResource.subject}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <span>{selectedResource.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>File Size:</span>
                        <span>{selectedResource.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Upload Date:</span>
                        <span>{formatDate(selectedResource.uploadDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className={`font-medium ${themeClasses.text.primary} mb-3`}>Statistics</h5>
                    <div className={`space-y-2 text-sm ${themeClasses.text.secondary}`}>
                      <div className="flex justify-between">
                        <span>Downloads:</span>
                        <span>{selectedResource.downloads}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rating:</span>
                        <div className="flex items-center space-x-1">
                          <span>{selectedResource.rating}</span>
                          <i className="ri-star-fill text-yellow-400 text-xs"></i>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span>{selectedResource.type}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className={`font-medium ${themeClasses.text.primary} mb-3`}>Tags</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedResource.tags.map(tag => (
                      <span
                        key={tag}
                        className={`text-sm px-3 py-1 rounded-full bg-indigo-900 ${themeClasses.accent}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowResourceModal(false)}
                  className={`px-4 py-2 rounded-lg ${themeClasses.button.secondary} transition-colors`}
                >
                  Close
                </button>
                <button className={`px-4 py-2 rounded-lg ${themeClasses.button.primary} transition-colors`}>
                  <i className="ri-download-line mr-2"></i>
                  Download
                </button>
                <button className={`px-4 py-2 rounded-lg ${themeClasses.button.success} transition-colors`}>
                  <i className="ri-bookmark-line mr-2"></i>
                  Save to Favorites
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Note Editor Modal */}
        {showNoteEditor && currentNote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              className={`${themeClasses.card} p-6 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold ${themeClasses.text.primary}`}>
                  {currentNote.id ? 'Edit Note' : 'New Note'}
                </h3>
                <button
                  onClick={() => setShowNoteEditor(false)}
                  className={`p-2 rounded-lg ${themeClasses.button.secondary} hover:bg-gray-600 transition-colors`}
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                      Title
                    </label>
                    <input
                      type="text"
                      value={currentNote.title}
                      onChange={(e) => setCurrentNote(prev => ({ ...prev, title: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      placeholder="Enter note title..."
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                      Subject
                    </label>
                    <input
                      type="text"
                      value={currentNote.subject}
                      onChange={(e) => setCurrentNote(prev => ({ ...prev, subject: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      placeholder="Enter subject..."
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                    Category
                  </label>
                  <select
                    value={currentNote.category}
                    onChange={(e) => setCurrentNote(prev => ({ ...prev, category: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    {noteCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                    Content
                  </label>
                  <textarea
                    value={currentNote.content}
                    onChange={(e) => setCurrentNote(prev => ({ ...prev, content: e.target.value }))}
                    rows={12}
                    className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none`}
                    placeholder="Write your notes here..."
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={Array.isArray(currentNote.tags) ? currentNote.tags.join(', ') : ''}
                    onChange={(e) => setCurrentNote(prev => ({ 
                      ...prev, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) 
                    }))}
                    className={`w-full px-3 py-2 rounded-lg ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="Enter tags..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowNoteEditor(false)}
                  className={`px-4 py-2 rounded-lg ${themeClasses.button.secondary} transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={saveNote}
                  className={`px-4 py-2 rounded-lg ${themeClasses.button.primary} transition-colors`}
                >
                  <i className="ri-save-line mr-2"></i>
                  Save Note
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentResourcesPage;