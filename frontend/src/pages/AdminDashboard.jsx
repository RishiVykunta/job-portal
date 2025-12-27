import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllUsers,
  deleteUser,
  getAllJobs,
  deleteJob,
  getAllApplications,
  getAnalytics,
} from '../services/adminService';
import { removeToken } from '../utils/auth';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import Button from '../components/Button';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'users') {
        const response = await getAllUsers();
        setUsers(response.data);
      } else if (activeTab === 'jobs') {
        const response = await getAllJobs();
        setJobs(response.data);
      } else if (activeTab === 'applications') {
        const response = await getAllApplications();
        setApplications(response.data);
      } else if (activeTab === 'analytics') {
        const response = await getAnalytics();
        setAnalytics(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    setDeleting(`user-${userId}`);
    try {
      await deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
      alert('User deleted successfully');
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    setDeleting(`job-${jobId}`);
    try {
      await deleteJob(jobId);
      setJobs(jobs.filter((j) => j.id !== jobId));
      alert('Job deleted successfully');
    } catch (err) {
      alert(err.message || 'Failed to delete job');
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  if (loading && !analytics) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <Button onClick={handleLogout} variant="danger">
          Logout
        </Button>
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`tab ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          Jobs
        </button>
        <button
          className={`tab ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          Applications
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'analytics' && analytics && (
          <div className="analytics-dashboard">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-value">{analytics.counts.totalUsers}</p>
                <div className="stat-breakdown">
                  <span>Candidates: {analytics.counts.users.candidate}</span>
                  <span>Recruiters: {analytics.counts.users.recruiter}</span>
                  <span>Admins: {analytics.counts.users.admin}</span>
                </div>
              </div>
              <div className="stat-card">
                <h3>Total Jobs</h3>
                <p className="stat-value">{analytics.counts.jobs}</p>
              </div>
              <div className="stat-card">
                <h3>Total Applications</h3>
                <p className="stat-value">{analytics.counts.applications}</p>
              </div>
            </div>

            <div className="recent-section">
              <h2>Recent Jobs</h2>
              <div className="recent-list">
                {analytics.recentJobs.map((job) => (
                  <div key={job.id} className="recent-item">
                    <h4>{job.title}</h4>
                    <p>{job.company} - {job.location}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="recent-section">
              <h2>Recent Applications</h2>
              <div className="recent-list">
                {analytics.recentApplications.map((app) => (
                  <div key={app.id} className="recent-item">
                    <h4>{app.job_title}</h4>
                    <p>{app.candidate_name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>{user.role}</span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={deleting === `user-${user.id}`}
                      >
                        {deleting === `user-${user.id}` ? 'Deleting...' : 'Delete'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Recruiter</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.id}</td>
                    <td>{job.title}</td>
                    <td>{job.company}</td>
                    <td>{job.location}</td>
                    <td>{job.recruiter_name}</td>
                    <td>{new Date(job.created_at).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleDeleteJob(job.id)}
                        disabled={deleting === `job-${job.id}`}
                      >
                        {deleting === `job-${job.id}` ? 'Deleting...' : 'Delete'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Candidate</th>
                  <th>Candidate Email</th>
                  <th>Applied At</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.id}</td>
                    <td>{app.job_title}</td>
                    <td>{app.job_company}</td>
                    <td>{app.candidate_name}</td>
                    <td>{app.candidate_email}</td>
                    <td>{new Date(app.applied_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

