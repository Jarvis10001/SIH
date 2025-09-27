import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { themeClasses, iconClasses } from '../../styles/theme';

const LibraryManagement = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [books, setBooks] = useState([]);
    const [issuedBooks, setIssuedBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('issue'); // 'issue' or 'return'
    const [selectedBook, setSelectedBook] = useState(null);
    const [studentInfo, setStudentInfo] = useState({ email: '', studentId: '', name: '' });

    // Mock data for demonstration
    useEffect(() => {
        setBooks([
            { id: 1, title: 'Introduction to Computer Science', author: 'John Smith', isbn: '978-0123456789', category: 'Computer Science', available: true, totalCopies: 5, availableCopies: 3 },
            { id: 2, title: 'Data Structures and Algorithms', author: 'Jane Doe', isbn: '978-0987654321', category: 'Computer Science', available: true, totalCopies: 3, availableCopies: 1 },
            { id: 3, title: 'Physics Fundamentals', author: 'Albert Johnson', isbn: '978-0456789123', category: 'Physics', available: false, totalCopies: 2, availableCopies: 0 },
            { id: 4, title: 'Advanced Mathematics', author: 'Maria Garcia', isbn: '978-0321654987', category: 'Mathematics', available: true, totalCopies: 4, availableCopies: 2 },
            { id: 5, title: 'Chemistry Basics', author: 'Robert Brown', isbn: '978-0654321987', category: 'Chemistry', available: true, totalCopies: 6, availableCopies: 4 },
            { id: 6, title: 'English Literature', author: 'Sarah Wilson', isbn: '978-0789123456', category: 'Literature', available: true, totalCopies: 8, availableCopies: 6 }
        ]);

        setIssuedBooks([
            { id: 1, bookTitle: 'Introduction to Computer Science', studentName: 'Alice Johnson', studentEmail: 'alice.johnson@college.edu', studentId: 'CS2021001', issueDate: '2024-09-20', dueDate: '2024-10-20', status: 'issued' },
            { id: 2, bookTitle: 'Data Structures and Algorithms', studentName: 'Bob Smith', studentEmail: 'bob.smith@college.edu', studentId: 'CS2021002', issueDate: '2024-09-18', dueDate: '2024-10-18', status: 'overdue' },
            { id: 3, bookTitle: 'Physics Fundamentals', studentName: 'Carol Davis', studentEmail: 'carol.davis@college.edu', studentId: 'PH2021001', issueDate: '2024-09-15', dueDate: '2024-10-15', status: 'overdue' }
        ]);
    }, []);

    const inputClasses = `
        w-full p-3 rounded-xl 
        bg-gray-700 border-2 border-slate-600
        focus:border-indigo-500
        focus:ring-4 focus:ring-indigo-500/10 
        focus:bg-gray-600
        hover:border-indigo-500/30
        transition-all duration-300 ease-in-out
        text-white placeholder-slate-400
        focus:placeholder-indigo-400/70
        focus:shadow-lg focus:shadow-indigo-500/5
        outline-none
    `;

    const getDaysOverdue = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = today - due;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const handleIssueBook = (book) => {
        setSelectedBook(book);
        setModalType('issue');
        setShowModal(true);
    };

    const handleReturnBook = (issuedBook) => {
        setSelectedBook(issuedBook);
        setModalType('return');
        setShowModal(true);
    };

    const submitIssueBook = () => {
        // This would typically make an API call
        const newIssuedBook = {
            id: issuedBooks.length + 1,
            bookTitle: selectedBook.title,
            studentName: studentInfo.name,
            studentEmail: studentInfo.email,
            studentId: studentInfo.studentId,
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
            status: 'issued'
        };

        setIssuedBooks([...issuedBooks, newIssuedBook]);
        
        // Update book availability
        setBooks(books.map(book => 
            book.id === selectedBook.id 
                ? { ...book, availableCopies: book.availableCopies - 1, available: book.availableCopies > 1 }
                : book
        ));

        setShowModal(false);
        setStudentInfo({ email: '', studentId: '', name: '' });
        setSelectedBook(null);
    };

    const submitReturnBook = () => {
        // This would typically make an API call
        setIssuedBooks(issuedBooks.filter(book => book.id !== selectedBook.id));
        
        // Find the book in our books array and update availability
        const bookTitle = selectedBook.bookTitle;
        setBooks(books.map(book => 
            book.title === bookTitle 
                ? { ...book, availableCopies: book.availableCopies + 1, available: true }
                : book
        ));

        setShowModal(false);
        setSelectedBook(null);
    };

    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.includes(searchQuery)
    );

    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={themeClasses.primaryCard}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${themeClasses.mutedText}`}>Total Books</p>
                            <p className="text-3xl font-bold text-white">{books.reduce((acc, book) => acc + book.totalCopies, 0)}</p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center">
                            <i className={`ri-book-line ${iconClasses.primary} text-xl`}></i>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={themeClasses.primaryCard}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${themeClasses.mutedText}`}>Available Books</p>
                            <p className="text-3xl font-bold text-white">{books.reduce((acc, book) => acc + book.availableCopies, 0)}</p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                            <i className={`ri-book-open-line ${iconClasses.success} text-xl`}></i>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={themeClasses.primaryCard}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${themeClasses.mutedText}`}>Issued Books</p>
                            <p className="text-3xl font-bold text-white">{issuedBooks.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/30 rounded-xl flex items-center justify-center">
                            <i className={`ri-book-mark-line ${iconClasses.warning} text-xl`}></i>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={themeClasses.primaryCard}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${themeClasses.mutedText}`}>Overdue Books</p>
                            <p className="text-3xl font-bold text-white">{issuedBooks.filter(book => book.status === 'overdue').length}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center">
                            <i className={`ri-error-warning-line ${iconClasses.danger} text-xl`}></i>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <div className={themeClasses.primaryCard}>
                <h3 className={`${themeClasses.secondaryHeading} mb-4`}>Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => setActiveView('issue')}
                        className={`${themeClasses.primaryButton} p-4 text-left`}
                    >
                        <i className="ri-book-add-line text-xl mb-2 block"></i>
                        <span className="font-semibold">Issue Book</span>
                        <p className="text-sm text-indigo-200 mt-1">Issue a book to student</p>
                    </button>

                    <button
                        onClick={() => setActiveView('return')}
                        className={`${themeClasses.secondaryButton} p-4 text-left`}
                    >
                        <i className="ri-book-read-line text-xl mb-2 block"></i>
                        <span className="font-semibold">Return Book</span>
                        <p className="text-sm text-slate-400 mt-1">Process book returns</p>
                    </button>

                    <button
                        onClick={() => setActiveView('search')}
                        className={`${themeClasses.secondaryButton} p-4 text-left`}
                    >
                        <i className="ri-search-line text-xl mb-2 block"></i>
                        <span className="font-semibold">Search Books</span>
                        <p className="text-sm text-slate-400 mt-1">Find books in catalog</p>
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className={themeClasses.primaryCard}>
                <h3 className={`${themeClasses.secondaryHeading} mb-4`}>Recent Issued Books</h3>
                <div className="space-y-3">
                    {issuedBooks.slice(0, 5).map((book) => (
                        <div key={book.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    book.status === 'overdue' ? 'bg-red-500/20 border border-red-500/30' : 'bg-emerald-500/20 border border-emerald-500/30'
                                }`}>
                                    <i className={`ri-book-line text-lg ${
                                        book.status === 'overdue' ? iconClasses.danger : iconClasses.success
                                    }`}></i>
                                </div>
                                <div>
                                    <p className="font-medium text-white">{book.bookTitle}</p>
                                    <p className="text-sm text-slate-400">{book.studentName} ({book.studentId})</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-sm font-medium ${
                                    book.status === 'overdue' ? 'text-red-400' : 'text-slate-300'
                                }`}>
                                    {book.status === 'overdue' ? `${getDaysOverdue(book.dueDate)} days overdue` : `Due: ${book.dueDate}`}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderIssueBook = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className={themeClasses.secondaryHeading}>Issue Book</h2>
                <button
                    onClick={() => setActiveView('dashboard')}
                    className={`${themeClasses.secondaryButton} px-4 py-2`}
                >
                    <i className="ri-arrow-left-line mr-2"></i>
                    Back
                </button>
            </div>

            {/* Search Books */}
            <div className={themeClasses.primaryCard}>
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search books by title, author, ISBN, or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={inputClasses}
                        />
                    </div>
                    <button className={`${themeClasses.primaryButton} px-6 py-3`}>
                        <i className="ri-search-line"></i>
                    </button>
                </div>

                {/* Books List */}
                <div className="space-y-4">
                    {filteredBooks.map((book) => (
                        <div key={book.id} className="p-4 bg-gray-700/30 rounded-xl border border-slate-600/30">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-white">{book.title}</h3>
                                    <p className="text-slate-300">by {book.author}</p>
                                    <div className="flex items-center gap-4 mt-2 text-sm">
                                        <span className="text-slate-400">ISBN: {book.isbn}</span>
                                        <span className="text-slate-400">Category: {book.category}</span>
                                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                            book.available 
                                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                        }`}>
                                            {book.available ? `${book.availableCopies} Available` : 'Not Available'}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleIssueBook(book)}
                                    disabled={!book.available}
                                    className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                                        book.available
                                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg'
                                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    {book.available ? 'Issue Book' : 'Unavailable'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderReturnBook = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className={themeClasses.secondaryHeading}>Return Book</h2>
                <button
                    onClick={() => setActiveView('dashboard')}
                    className={`${themeClasses.secondaryButton} px-4 py-2`}
                >
                    <i className="ri-arrow-left-line mr-2"></i>
                    Back
                </button>
            </div>

            {/* Issued Books List */}
            <div className={themeClasses.primaryCard}>
                <h3 className="text-lg font-semibold text-white mb-4">Currently Issued Books</h3>
                <div className="space-y-4">
                    {issuedBooks.map((book) => (
                        <div key={book.id} className="p-4 bg-gray-700/30 rounded-xl border border-slate-600/30">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-white">{book.bookTitle}</h4>
                                    <div className="mt-2 space-y-1">
                                        <p className="text-slate-300">Student: {book.studentName}</p>
                                        <p className="text-slate-400 text-sm">Email: {book.studentEmail}</p>
                                        <p className="text-slate-400 text-sm">Student ID: {book.studentId}</p>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="text-slate-400">Issued: {book.issueDate}</span>
                                            <span className={`px-2 py-1 rounded-lg font-medium ${
                                                book.status === 'overdue' 
                                                    ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                            }`}>
                                                {book.status === 'overdue' 
                                                    ? `${getDaysOverdue(book.dueDate)} days overdue` 
                                                    : `Due: ${book.dueDate}`
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleReturnBook(book)}
                                    className={`${themeClasses.primaryButton} px-6 py-2`}
                                >
                                    Return Book
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderSearchBooks = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className={themeClasses.secondaryHeading}>Search Books</h2>
                <button
                    onClick={() => setActiveView('dashboard')}
                    className={`${themeClasses.secondaryButton} px-4 py-2`}
                >
                    <i className="ri-arrow-left-line mr-2"></i>
                    Back
                </button>
            </div>

            {/* Search Interface */}
            <div className={themeClasses.primaryCard}>
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search books by title, author, ISBN, or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={inputClasses}
                        />
                    </div>
                    <button className={`${themeClasses.primaryButton} px-6 py-3`}>
                        <i className="ri-search-line"></i>
                    </button>
                </div>

                {/* Results */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">
                        Search Results ({filteredBooks.length} books found)
                    </h3>
                    {filteredBooks.map((book) => (
                        <div key={book.id} className="p-4 bg-gray-700/30 rounded-xl border border-slate-600/30">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <h4 className="font-semibold text-white">{book.title}</h4>
                                    <p className="text-slate-300">by {book.author}</p>
                                    <p className="text-slate-400 text-sm mt-1">Category: {book.category}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-sm">ISBN: {book.isbn}</p>
                                    <p className="text-slate-400 text-sm">Total Copies: {book.totalCopies}</p>
                                    <p className="text-slate-400 text-sm">Available: {book.availableCopies}</p>
                                </div>
                                <div className="flex items-center justify-end">
                                    <span className={`px-3 py-2 rounded-xl text-sm font-medium ${
                                        book.available 
                                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                    }`}>
                                        {book.available ? 'Available' : 'Not Available'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={themeClasses.primaryHeading}>Library Management</h1>
                    <p className={themeClasses.bodyText}>Manage book issues, returns, and track student records</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2">
                {[
                    { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line' },
                    { id: 'issue', label: 'Issue Book', icon: 'ri-book-add-line' },
                    { id: 'return', label: 'Return Book', icon: 'ri-book-read-line' },
                    { id: 'search', label: 'Search Books', icon: 'ri-search-line' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveView(tab.id)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                            activeView === tab.id
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'bg-gray-700/30 text-slate-300 hover:bg-gray-700/50 hover:text-white'
                        }`}
                    >
                        <i className={tab.icon}></i>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeView}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeView === 'dashboard' && renderDashboard()}
                    {activeView === 'issue' && renderIssueBook()}
                    {activeView === 'return' && renderReturnBook()}
                    {activeView === 'search' && renderSearchBooks()}
                </motion.div>
            </AnimatePresence>

            {/* Issue/Return Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className={`${themeClasses.primaryCard} max-w-md w-full`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className={`${themeClasses.secondaryHeading} mb-4`}>
                                {modalType === 'issue' ? 'Issue Book' : 'Return Book'}
                            </h3>

                            {modalType === 'issue' ? (
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-slate-300 mb-2">Book: <span className="font-semibold text-white">{selectedBook?.title}</span></p>
                                        <p className="text-slate-400 text-sm">by {selectedBook?.author}</p>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-slate-300 font-medium block mb-1">Student Name</label>
                                            <input
                                                type="text"
                                                value={studentInfo.name}
                                                onChange={(e) => setStudentInfo({...studentInfo, name: e.target.value})}
                                                placeholder="Enter student full name"
                                                className={inputClasses}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-slate-300 font-medium block mb-1">Student Email</label>
                                            <input
                                                type="email"
                                                value={studentInfo.email}
                                                onChange={(e) => setStudentInfo({...studentInfo, email: e.target.value})}
                                                placeholder="student@college.edu"
                                                className={inputClasses}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-slate-300 font-medium block mb-1">Student ID</label>
                                            <input
                                                type="text"
                                                value={studentInfo.studentId}
                                                onChange={(e) => setStudentInfo({...studentInfo, studentId: e.target.value})}
                                                placeholder="e.g., CS2021001"
                                                className={inputClasses}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={submitIssueBook}
                                            disabled={!studentInfo.name || !studentInfo.email || !studentInfo.studentId}
                                            className={`${themeClasses.primaryButton} flex-1 disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            Issue Book
                                        </button>
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className={`${themeClasses.secondaryButton} px-6 py-3`}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-slate-300 mb-2">Book: <span className="font-semibold text-white">{selectedBook?.bookTitle}</span></p>
                                        <p className="text-slate-300 mb-1">Student: <span className="font-semibold text-white">{selectedBook?.studentName}</span></p>
                                        <p className="text-slate-400 text-sm">ID: {selectedBook?.studentId}</p>
                                        <p className="text-slate-400 text-sm">Issue Date: {selectedBook?.issueDate}</p>
                                        {selectedBook?.status === 'overdue' && (
                                            <p className="text-red-400 text-sm font-medium mt-2">
                                                ⚠️ This book is {getDaysOverdue(selectedBook.dueDate)} days overdue
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={submitReturnBook}
                                            className={`${themeClasses.primaryButton} flex-1`}
                                        >
                                            Confirm Return
                                        </button>
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className={`${themeClasses.secondaryButton} px-6 py-3`}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LibraryManagement;