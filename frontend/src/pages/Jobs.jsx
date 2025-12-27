import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobs, applyToJob, getAppliedJobs } from '../services/jobService';
import { getRoleFromToken, removeToken } from '../utils/auth';
import { ROLES } from '../utils/constants';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import Button from '../components/Button';
import './Jobs.css';

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const role = getRoleFromToken();

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getJobs(currentPage, 10, search);
      setJobs(response.data.jobs);
      setTotalPages(response.data.pagination.totalPages);
    } catch (err) {
      setError(err.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [currentPage, search]);

  const loadAppliedJobs = useCallback(async () => {
    try {
      const response = await getAppliedJobs();
      const appliedIds = new Set(response.data.map((job) => job.id));
      setAppliedJobIds(appliedIds);
    } catch (err) {
      console.error('Failed to load applied jobs:', err);
    }
  }, []);

  useEffect(() => {
    loadJobs();
    if (role === ROLES.CANDIDATE) {
      loadAppliedJobs();
    }
  }, [loadJobs, loadAppliedJobs, role]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadJobs();
  };

  const handleApply = async (jobId) => {
    try {
      await applyToJob(jobId);
      setAppliedJobIds((prev) => new Set([...prev, jobId]));
      alert('Application submitted successfully!');
    } catch (err) {
      alert(err.message || 'Failed to apply to job');
    }
  };

  const handleViewJob = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  if (loading && jobs.length === 0) {
    return <LoadingSpinner message="Loading jobs..." />;
  }

  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <h1>Job Portal</h1>
        <div className="header-actions">
          {role === ROLES.RECRUITER && (
            <Button onClick={() => navigate('/recruiter/jobs')} variant="secondary">
              My Jobs
            </Button>
          )}
          <Button onClick={handleLogout} variant="danger">
            Logout
          </Button>
        </div>
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search jobs by title, company, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <Button type="submit">Search</Button>
      </form>

      <div className="jobs-list">
        {jobs.length === 0 ? (
          <p className="no-jobs">No jobs found</p>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onView={handleViewJob}
              onApply={role === ROLES.CANDIDATE ? handleApply : null}
              isApplied={appliedJobIds.has(job.id)}
              showActions={true}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            variant="secondary"
          >
            Previous
          </Button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            variant="secondary"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Jobs;

