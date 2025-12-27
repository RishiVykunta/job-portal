import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated, getRoleFromToken } from './utils/auth';
import { ROLES } from './utils/constants';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterJobs from './pages/RecruiterJobs';
import PostJob from './pages/PostJob';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const userRole = getRoleFromToken();
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/jobs" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    const role = getRoleFromToken();
    if (role === ROLES.ADMIN) {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (role === ROLES.RECRUITER) {
      return <Navigate to="/recruiter/jobs" replace />;
    } else {
      return <Navigate to="/jobs" replace />;
    }
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute allowedRoles={[ROLES.CANDIDATE, ROLES.RECRUITER, ROLES.ADMIN]}>
                <Jobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.CANDIDATE, ROLES.RECRUITER, ROLES.ADMIN]}>
                <JobDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.CANDIDATE]}>
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs"
            element={
              <ProtectedRoute allowedRoles={[ROLES.RECRUITER]}>
                <RecruiterJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/post-job"
            element={
              <ProtectedRoute allowedRoles={[ROLES.RECRUITER]}>
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/jobs" replace />} />
          <Route path="*" element={<Navigate to="/jobs" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
