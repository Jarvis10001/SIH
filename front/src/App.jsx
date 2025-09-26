import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LandingPage from './components/LandingPage'
import Navbar from './components/Navbar'
import SignUp from './components/SignUp'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import AdminLogin from './components/admin/AdminLogin'
import AdminDashboard from './components/admin/AdminDashboard'
import TeacherLogin from './components/teacher/TeacherLogin'
import TeacherDashboard from './components/TeacherDashboard'
import ClerkLogin from './components/clerk/ClerkLogin'
import ClerkDashboard from './components/clerk/ClerkDashboard'

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page Route */}
        <Route 
          path="/" 
          element={
            <>
              <Navbar />
              <LandingPage />
            </>
          } 
        />
        
        {/* Authentication Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard/*" element={<Dashboard />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        {/* Teacher Routes */}
        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route path="/teacher/dashboard/*" element={<TeacherDashboard />} />
        
        {/* Clerk Routes */}
        <Route path="/clerk/login" element={<ClerkLogin />} />
        <Route path="/clerk/dashboard" element={<ClerkDashboard />} />
        
        {/* Catch all route - redirect to home */}
        <Route path="*" element={
          <>
            <Navbar />
            <LandingPage />
          </>
        } />
      </Routes>
      
      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  )
}

export default App


