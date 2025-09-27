import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import DashboardHome from './pages/DashboardHome';
import AdmissionForm from './pages/AdmissionFormNew';
import PaymentPage from './pages/PaymentPage';
import LibraryPage from './pages/LibraryPage';
import GradesPage from './pages/GradesPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import CalendarPage from './pages/CalendarPage';
import TimetablePage from './pages/TimetablePage';
import StudentResourcesPage from './pages/StudentResourcesPage';
import StudentQueriesPage from './pages/StudentQueriesPage';
import AdminQueriesPage from './admin/AdminQueriesPage';
import AdminDashboard from './admin/AdminDashboard';
import TeacherGradesPage from './teacher/TeacherGradesPage';
import TeacherTimetablePage from './teacher/TeacherTimetablePage';
import TeacherResourcesPage from './teacher/TeacherResourcesPage';
import StudentAttendance from './student/StudentAttendance';
import HostelSelection from './HostelSelection';
import axios from 'axios';


// Create a wrapper component to use the context
const DashboardContent = () => {
  const { isOpen } = useSidebar();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {   
      navigate('/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
      setLoading(false);
    } else {
      // Fetch user data from API
      fetchUserData(token);
    }
  }, [navigate]);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // If token is invalid, redirect to login
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 overflow-x-hidden">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 md:duration-700 ml-0 ${
        isOpen ? 'md:ml-72' : 'md:ml-20'
      }`}>
        <TopNav />
        <main className="px-4 py-6 md:p-6">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/admission" element={<AdmissionForm />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/hostel" element={<HostelSelection />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/faculty" element={<FacultyPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/assignments" element={<AssignmentsPage />} />
            <Route path="/attendance" element={<StudentAttendance />} />
            <Route path="/grades" element={<GradesPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/timetable" element={<TimetablePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/resources" element={<StudentResourcesPage />} />
            <Route path="/queries" element={<StudentQueriesPage />} />
            <Route path="/admin/queries" element={<AdminQueriesPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/teacher/grades" element={<TeacherGradesPage />} />
            <Route path="/teacher/timetable" element={<TeacherTimetablePage />} />
            <Route path="/teacher/resources" element={<TeacherResourcesPage />} />
            <Route path="/events" element={<AnnouncementsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// Main component that provides the context
const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
};

// Placeholder components until they're implemented
const StudentsPage = () => (
  <div className="bg-gray-800 border border-slate-700 rounded-xl p-6 shadow-sm">
    <h1 className="text-2xl font-bold text-white mb-4">Students Management</h1>
    <p className="text-slate-400">Student management functionality will be implemented here.</p>
  </div>
);

const FacultyPage = () => (
  <div className="bg-gray-800 border border-slate-700 rounded-xl p-6 shadow-sm">
    <h1 className="text-2xl font-bold text-white mb-4">Faculty Management</h1>
    <p className="text-slate-400">Faculty management functionality will be implemented here.</p>
  </div>
);

const CoursesPage = () => (
  <div className="bg-gray-800 border border-slate-700 rounded-xl p-6 shadow-sm">
    <h1 className="text-2xl font-bold text-white mb-4">Courses Management</h1>
    <p className="text-slate-400">Course management functionality will be implemented here.</p>
  </div>
);

const AssignmentsPage = () => (
  <div className="bg-gray-800 border border-slate-700 rounded-xl p-6 shadow-sm">
    <h1 className="text-2xl font-bold text-white mb-4">Assignments</h1>
    <p className="text-slate-400">Assignment management functionality will be implemented here.</p>
  </div>
);

const ReportsPage = () => (
  <div className="bg-gray-800 border border-slate-700 rounded-xl p-6 shadow-sm">
    <h1 className="text-2xl font-bold text-white mb-4">Reports & Analytics</h1>
    <p className="text-slate-400">Reporting functionality will be implemented here.</p>
  </div>
);

const SettingsPage = () => (
  <div className="bg-gray-800 border border-slate-700 rounded-xl p-6 shadow-sm">
    <h1 className="text-2xl font-bold text-white mb-4">Settings</h1>
    <p className="text-slate-400">Settings functionality will be implemented here.</p>
  </div>
);

const ProfilePage = () => {
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  
  return (
    <div className="bg-gray-800 border border-slate-700 rounded-xl p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-white mb-4">Profile</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300">Name</label>
          <p className="mt-1 text-sm text-white">{userData?.name || 'Not provided'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300">Email</label>
          <p className="mt-1 text-sm text-white">{userData?.email || 'Not provided'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300">Role</label>
          <p className="mt-1 text-sm text-white">{userData?.role || 'User'}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;