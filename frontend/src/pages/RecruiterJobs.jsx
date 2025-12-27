import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecruiterJobs, getJobApplications } from '../services/jobService';
import { downloadResume } from '../services/resumeService';
import { removeToken } from '../utils/auth';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import Button from '../components/Button';
import './RecruiterJobs.css';

const RecruiterJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplications, setShowApplications] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getRecruiterJobs();
      setJobs(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplications = async (jobId) => {
    try {
      const response = await getJobApplications(jobId);
      setApplications(response.data);
      setSelectedJob(jobId);
      setShowApplications(true);
    } catch (err) {
      alert(err.message || 'Failed to load applications');
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  if (loading) {
    return <LoadingSpinner message="Loading your jobs..." />;
  }

  return (
    <div className="recruiter-jobs-container">
      <div className="recruiter-jobs-header">
        <h1>My Posted Jobs</h1>
        <div className="header-actions">
          <Button onClick={() => navigate('/recruiter/post-job')} variant="secondary">
            Post New Job
          </Button>
          <Button onClick={handleLogout} variant="danger">
            Logout
          </Button>
        </div>
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

      {!showApplications ? (
        <>
          {jobs.length === 0 ? (
            <div className="no-jobs">
              <p>You haven't posted any jobs yet.</p>
              <Button onClick={() => navigate('/recruiter/post-job')}>Post Your First Job</Button>
            </div>
          ) : (
            <div className="jobs-list">
              {jobs.map((job) => (
                <div key={job.id} className="job-item">
                  <JobCard job={job} showActions={false} />
                  <Button
                    onClick={() => handleViewApplications(job.id)}
                    variant="secondary"
                    className="view-applications-btn"
                  >
                    View Applications
                  </Button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="applications-view">
          <Button
            onClick={() => {
              setShowApplications(false);
              setSelectedJob(null);
              setApplications([]);
            }}
            variant="secondary"
            className="back-button"
          >
            ← Back to Jobs
          </Button>
          <h2>Applications for Job ID: {selectedJob}</h2>
          {applications.length === 0 ? (
            <p className="no-applications">No applications yet</p>
          ) : (
            <div className="applications-list">
              {applications.map((app) => (
                <div key={app.id} className="application-card">
                  <div className="application-info">
                    <h3>{app.candidate_name}</h3>
                    <p>Email: {app.candidate_email}</p>
                    <p>Applied on: {new Date(app.applied_at).toLocaleDateString()}</p>
                  </div>
                  {app.resume_path && (
                    <Button
                      onClick={async () => {
                        try {
                          await downloadResume(app.candidate_id);
                        } catch (err) {
                          alert(err.message || 'Failed to download resume');
                        }
                      }}
                      variant="secondary"
                    >
                      Download Resume
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecruiterJobs;

