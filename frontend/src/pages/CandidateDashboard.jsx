import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppliedJobs } from '../services/jobService';
import { removeToken } from '../utils/auth';
import ResumeUpload from '../components/ResumeUpload';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import './CandidateDashboard.css';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppliedJobs();
  }, []);

  const loadAppliedJobs = async () => {
    try {
      const response = await getAppliedJobs();
      setAppliedJobs(response.data);
    } catch (err) {
      console.error('Failed to load applied jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="candidate-dashboard-container">
      <div className="candidate-header">
        <h1>Candidate Dashboard</h1>
        <div className="header-actions">
          <Button onClick={() => navigate('/jobs')} variant="secondary">
            Browse Jobs
          </Button>
          <Button onClick={handleLogout} variant="danger">
            Logout
          </Button>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section-card">
          <h2>Upload Resume</h2>
          <ResumeUpload onUploadSuccess={loadAppliedJobs} />
        </div>

        <div className="section-card">
          <h2>Applied Jobs ({appliedJobs.length})</h2>
          {appliedJobs.length === 0 ? (
            <p className="no-applications">You haven't applied to any jobs yet.</p>
          ) : (
            <div className="applied-jobs-list">
              {appliedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onView={(id) => navigate(`/jobs/${id}`)}
                  isApplied={true}
                  showActions={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;

