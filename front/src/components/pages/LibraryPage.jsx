import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { themeClasses, iconClasses } from '../../styles/theme';

const LibraryPage = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [issuedBooks, setIssuedBooks] = useState([]);
    const [bookHistory, setBookHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    // Mock data for demonstration
    useEffect(() => {
        // Current issued books
        setIssuedBooks([
            { 
                id: 1, 
                title: 'Data Structures and Algorithms', 
                author: 'Thomas H. Cormen', 
                isbn: '978-0262033848',
                category: 'Computer Science',
                issueDate: '2024-09-15', 
                dueDate: '2024-10-15', 
                status: 'issued',
                daysLeft: 18,
                renewalCount: 0,
                maxRenewals: 2,
                coverImage: null
            },
            { 
                id: 2, 
                title: 'Introduction to Machine Learning', 
                author: 'Alpaydin Ethem', 
                isbn: '978-0262028189',
                category: 'Computer Science',
                issueDate: '2024-09-10', 
                dueDate: '2024-10-10', 
                status: 'overdue',
                daysLeft: -7,
                renewalCount: 1,
                maxRenewals: 2,
                coverImage: null
            },
            { 
                id: 3, 
                title: 'Linear Algebra and Its Applications', 
                author: 'David C. Lay', 
                isbn: '978-0321982384',
                category: 'Mathematics',
                issueDate: '2024-09-20', 
                dueDate: '2024-10-20', 
                status: 'issued',
                daysLeft: 23,
                renewalCount: 0,
                maxRenewals: 2,
                coverImage: null
            }
        ]);

        // Book history (returned books)
        setBookHistory([
            { 
                id: 4, 
                title: 'Introduction to Computer Science', 
                author: 'John Smith', 
                issueDate: '2024-08-15', 
                returnDate: '2024-09-10', 
                status: 'returned',
                fine: 0
            },
            { 
                id: 5, 
                title: 'Physics Fundamentals', 
                author: 'Albert Johnson', 
                issueDate: '2024-07-20', 
                returnDate: '2024-08-25', 
                status: 'returned',
                fine: 25 // Late return fine
            },
            { 
                id: 6, 
                title: 'Chemistry Basics', 
                author: 'Robert Brown', 
                issueDate: '2024-06-10', 
                returnDate: '2024-07-08', 
                status: 'returned',
                fine: 0
            }
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

    const getStatusBadge = (book) => {
        if (book.status === 'overdue') {
            return (
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">
                    {Math.abs(book.daysLeft)} days overdue
                </span>
            );
        } else if (book.daysLeft <= 3) {
            return (
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Due in {book.daysLeft} days
                </span>
            );
        } else {
            return (
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {book.daysLeft} days left
                </span>
            );
        }
    };

    const handleRenewBook = (bookId) => {
        setIssuedBooks(books => books.map(book => {
            if (book.id === bookId && book.renewalCount < book.maxRenewals) {
                const newDueDate = new Date(book.dueDate);
                newDueDate.setDate(newDueDate.getDate() + 14); // Extend by 14 days
                
                return {
                    ...book,
                    dueDate: newDueDate.toISOString().split('T')[0],
                    renewalCount: book.renewalCount + 1,
                    daysLeft: book.daysLeft + 14,
                    status: 'issued' // Reset status if it was overdue
                };
            }
            return book;
        }));
    };

    const calculateFine = (book) => {
        if (book.status === 'overdue') {
            return Math.abs(book.daysLeft) * 2; // ₹2 per day fine
        }
        return 0;
    };

    const totalFines = issuedBooks.reduce((total, book) => total + calculateFine(book), 0);

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
                            <p className={`text-sm font-medium ${themeClasses.mutedText}`}>Books Issued</p>
                            <p className="text-3xl font-bold text-white">{issuedBooks.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center">
                            <i className={`ri-book-mark-line ${iconClasses.primary} text-xl`}></i>
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
                            <p className={`text-sm font-medium ${themeClasses.mutedText}`}>Books Due Soon</p>
                            <p className="text-3xl font-bold text-white">
                                {issuedBooks.filter(book => book.daysLeft <= 3 && book.status !== 'overdue').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/30 rounded-xl flex items-center justify-center">
                            <i className={`ri-time-line ${iconClasses.warning} text-xl`}></i>
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
                            <p className={`text-sm font-medium ${themeClasses.mutedText}`}>Overdue Books</p>
                            <p className="text-3xl font-bold text-white">
                                {issuedBooks.filter(book => book.status === 'overdue').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center">
                            <i className={`ri-error-warning-line ${iconClasses.danger} text-xl`}></i>
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
                            <p className={`text-sm font-medium ${themeClasses.mutedText}`}>Total Fines</p>
                            <p className="text-3xl font-bold text-white">₹{totalFines}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center justify-center">
                            <i className={`ri-money-rupee-circle-line ${iconClasses.danger} text-xl`}></i>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <div className={themeClasses.primaryCard}>
                <h3 className={`${themeClasses.secondaryHeading} mb-4`}>Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => setActiveView('issued')}
                        className={`${themeClasses.primaryButton} p-4 text-left`}
                    >
                        <i className="ri-book-open-line text-xl mb-2 block"></i>
                        <span className="font-semibold">My Books</span>
                        <p className="text-sm text-indigo-200 mt-1">View issued books</p>
                    </button>

                    <button
                        onClick={() => setActiveView('history')}
                        className={`${themeClasses.secondaryButton} p-4 text-left`}
                    >
                        <i className="ri-history-line text-xl mb-2 block"></i>
                        <span className="font-semibold">History</span>
                        <p className="text-sm text-slate-400 mt-1">View past transactions</p>
                    </button>

                    <button
                        onClick={() => setActiveView('search')}
                        className={`${themeClasses.secondaryButton} p-4 text-left`}
                    >
                        <i className="ri-search-line text-xl mb-2 block"></i>
                        <span className="font-semibold">Search Books</span>
                        <p className="text-sm text-slate-400 mt-1">Browse library catalog</p>
                    </button>
                </div>
            </div>

            {/* Current Books Summary */}
            {issuedBooks.length > 0 && (
                <div className={themeClasses.primaryCard}>
                    <h3 className={`${themeClasses.secondaryHeading} mb-4`}>Currently Issued Books</h3>
                    <div className="space-y-3">
                        {issuedBooks.slice(0, 3).map((book) => (
                            <div key={book.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-500/30">
                                        <i className={`ri-book-line text-lg ${iconClasses.primary}`}></i>
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{book.title}</p>
                                        <p className="text-sm text-slate-400">by {book.author}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {getStatusBadge(book)}
                                    <p className="text-xs text-slate-400 mt-1">Due: {book.dueDate}</p>
                                </div>
                            </div>
                        ))}
                        
                        {issuedBooks.length > 3 && (
                            <button
                                onClick={() => setActiveView('issued')}
                                className="w-full text-center py-2 text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
                            >
                                View all {issuedBooks.length} books →
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    const renderIssuedBooks = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className={themeClasses.secondaryHeading}>My Issued Books</h2>
                <button
                    onClick={() => setActiveView('dashboard')}
                    className={`${themeClasses.secondaryButton} px-4 py-2`}
                >
                    <i className="ri-arrow-left-line mr-2"></i>
                    Back
                </button>
            </div>

            <div className={themeClasses.primaryCard}>
                <div className="space-y-4">
                    {issuedBooks.map((book) => (
                        <div key={book.id} className="p-4 bg-gray-700/30 rounded-xl border border-slate-600/30">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-20 bg-gray-600 rounded-lg flex items-center justify-center border border-slate-600">
                                        <i className={`ri-book-line text-2xl ${iconClasses.primary}`}></i>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white text-lg">{book.title}</h3>
                                        <p className="text-slate-300">by {book.author}</p>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                                            <span>ISBN: {book.isbn}</span>
                                            <span>Category: {book.category}</span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-2 text-sm">
                                            <span className="text-slate-400">Issued: {book.issueDate}</span>
                                            <span className="text-slate-400">Due: {book.dueDate}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-end gap-3">
                                    {getStatusBadge(book)}
                                    
                                    {book.status === 'overdue' && (
                                        <div className="text-center">
                                            <p className="text-red-400 text-sm font-medium">Fine: ₹{calculateFine(book)}</p>
                                            <p className="text-red-300 text-xs">₹2 per day</p>
                                        </div>
                                    )}
                                    
                                    <div className="flex flex-col gap-2">
                                        {book.renewalCount < book.maxRenewals && book.status !== 'overdue' && (
                                            <button
                                                onClick={() => handleRenewBook(book.id)}
                                                className={`${themeClasses.primaryButton} px-4 py-2 text-sm`}
                                            >
                                                <i className="ri-refresh-line mr-1"></i>
                                                Renew ({book.renewalCount}/{book.maxRenewals})
                                            </button>
                                        )}
                                        
                                        <p className="text-xs text-slate-400 text-center">
                                            Renewals: {book.renewalCount}/{book.maxRenewals}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderHistory = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className={themeClasses.secondaryHeading}>Book History</h2>
                <button
                    onClick={() => setActiveView('dashboard')}
                    className={`${themeClasses.secondaryButton} px-4 py-2`}
                >
                    <i className="ri-arrow-left-line mr-2"></i>
                    Back
                </button>
            </div>

            <div className={themeClasses.primaryCard}>
                <div className="space-y-4">
                    {bookHistory.map((book) => (
                        <div key={book.id} className="p-4 bg-gray-700/30 rounded-xl border border-slate-600/30">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
                                        <i className={`ri-book-line text-lg ${iconClasses.success}`}></i>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">{book.title}</h4>
                                        <p className="text-slate-300 text-sm">by {book.author}</p>
                                        <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                                            <span>Issued: {book.issueDate}</span>
                                            <span>Returned: {book.returnDate}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="text-right">
                                    <span className="px-3 py-1 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                        Returned
                                    </span>
                                    {book.fine > 0 && (
                                        <p className="text-red-400 text-sm mt-1">Fine: ₹{book.fine}</p>
                                    )}
                                </div>
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
                <h2 className={themeClasses.secondaryHeading}>Search Library Catalog</h2>
                <button
                    onClick={() => setActiveView('dashboard')}
                    className={`${themeClasses.secondaryButton} px-4 py-2`}
                >
                    <i className="ri-arrow-left-line mr-2"></i>
                    Back
                </button>
            </div>

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

                <div className="text-center py-12">
                    <i className={`ri-search-line text-6xl ${iconClasses.muted} mb-4`}></i>
                    <h3 className="text-xl font-semibold text-white mb-2">Search Library Catalog</h3>
                    <p className="text-slate-400">
                        Enter keywords to search for books in our library catalog. You can search by title, author, ISBN, or category.
                    </p>
                    <div className="mt-4 text-sm text-slate-500">
                        <p>• Use specific keywords for better results</p>
                        <p>• Search by ISBN for exact matches</p>
                        <p>• Browse by category to discover new books</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={themeClasses.primaryHeading}>Library Dashboard</h1>
                    <p className={themeClasses.bodyText}>Manage your book issues, renewals, and browse the catalog</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2">
                {[
                    { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line' },
                    { id: 'issued', label: 'My Books', icon: 'ri-book-open-line' },
                    { id: 'history', label: 'History', icon: 'ri-history-line' },
                    { id: 'search', label: 'Search Catalog', icon: 'ri-search-line' }
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
                    {activeView === 'issued' && renderIssuedBooks()}
                    {activeView === 'history' && renderHistory()}
                    {activeView === 'search' && renderSearchBooks()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default LibraryPage;