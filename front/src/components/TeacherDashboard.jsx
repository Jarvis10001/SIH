import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';
import TeacherSidebar from './teacher/TeacherSidebar';
import TeacherTopNav from './teacher/TeacherTopNav';
import TeacherDashboardHome from './teacher/pages/TeacherDashboardHome';
import TeacherProfile from './teacher/pages/TeacherProfile';
import TeacherCourses from './teacher/pages/TeacherCourses';
import TeacherStudents from './teacher/pages/TeacherStudents';
import TeacherAssignments from './teacher/pages/TeacherAssignments';
import TeacherAttendance from './teacher/pages/TeacherAttendance';
import TeacherGradesPage from './teacher/TeacherGradesPage';
import TeacherTimetablePage from './teacher/TeacherTimetablePage';
import TeacherResourcesPage from './teacher/TeacherResourcesPage';
import TeacherReports from './teacher/pages/TeacherReports';
import TeacherSettings from './teacher/pages/TeacherSettings';
import { themeClasses } from '../styles/theme';
import axios from 'axios';

// Create a wrapper component to use the context
const TeacherDashboardContent = () => {
  const { isOpen } = useSidebar();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('teacherToken');
    const teacherData = localStorage.getItem('teacherData');

    if (!token) {   
      navigate('/teacher/login');
      return;
    }

    if (teacherData) {
      setTeacher(JSON.parse(teacherData));
      setLoading(false);
    } else {
      // Fetch teacher data from API
      fetchTeacherData(token);
    }
  }, [navigate]);

  const fetchTeacherData = async (token) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/teacher/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setTeacher(response.data.teacher);
        localStorage.setItem('teacherData', JSON.stringify(response.data.teacher));
      }
    } catch (error) {
      console.error('Error fetching teacher data:', error);
      // If token is invalid, redirect to login
      if (error.response?.status === 401) {
        localStorage.removeItem('teacherToken');
        localStorage.removeItem('teacherData');
        navigate('/teacher/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.pageBackground}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className={themeClasses.text.secondary}>Loading teacher dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={themeClasses.dashboardLayout}>
      <TeacherSidebar />
      <div className={`flex-1 transition-all duration-300 md:duration-700 ml-0 ${
        isOpen ? 'md:ml-72' : 'md:ml-20'
      }`}>
        <TeacherTopNav />
        <main className="px-4 py-6 md:p-6">
          <Routes>
            <Route path="/" element={<TeacherDashboardHome />} />
            <Route path="/profile" element={<TeacherProfile />} />
            <Route path="/courses" element={<TeacherCourses />} />
            <Route path="/students" element={<TeacherStudents />} />
            <Route path="/assignments" element={<TeacherAssignments />} />
            <Route path="/attendance" element={<TeacherAttendance />} />
            <Route path="/grades" element={<TeacherGradesPage />} />
            <Route path="/schedule" element={<TeacherTimetablePage />} />
            <Route path="/resources" element={<TeacherResourcesPage />} />
            <Route path="/reports" element={<TeacherReports />} />
            <Route path="/settings" element={<TeacherSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// Main Dashboard Layout Component
const TeacherDashboard = () => {
  return (
    <SidebarProvider>
      <TeacherDashboardContent />
    </SidebarProvider>
  );
};

export default TeacherDashboard;