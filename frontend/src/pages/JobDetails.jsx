import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById, applyToJob, getAppliedJobs } from '../services/jobService';
import { getRoleFromToken } from '../utils/auth';
import { ROLES } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import Button from '../components/Button';
import './JobDetails.css';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isApplied, setIsApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const role = getRoleFromToken();

  const loadJob = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getJobById(id);
      setJob(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load job');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const checkAppliedStatus = useCallback(async () => {
    try {
      const response = await getAppliedJobs();
      const appliedIds = response.data.map((job) => job.id);
      setIsApplied(appliedIds.includes(parseInt(id)));
    } catch (err) {
      console.error('Failed to check applied status:', err);
    }
  }, [id]);

  useEffect(() => {
    loadJob();
    if (role === ROLES.CANDIDATE) {
      checkAppliedStatus();
    }
  }, [loadJob, checkAppliedStatus, role]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await applyToJob(id);
      setIsApplied(true);
      alert('Application submitted successfully!');
    } catch (err) {
      alert(err.message || 'Failed to apply to job');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading job details..." />;
  }

  if (error || !job) {
    return (
      <div className="job-details-container">
        <Alert type="danger" message={error || 'Job not found'} />
        <Button onClick={() => navigate('/jobs')}>Back to Jobs</Button>
      </div>
    );
  }

  return (
    <div className="job-details-container">
      <Button onClick={() => navigate('/jobs')} variant="secondary" className="back-button">
        ← Back to Jobs
      </Button>

      <div className="job-details-card">
        <div className="job-details-header">
          <h1>{job.title}</h1>
          {isApplied && <span className="applied-badge">Applied</span>}
        </div>

        <div className="job-details-body">
          <div className="detail-row">
            <span className="detail-label">Company:</span>
            <span className="detail-value">{job.company}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Location:</span>
            <span className="detail-value">{job.location}</span>
          </div>
          {job.salary && (
            <div className="detail-row">
              <span className="detail-label">Salary:</span>
              <span className="detail-value">{job.salary}</span>
            </div>
          )}
          {job.applicant_count !== undefined && job.applicant_count !== null && (
            <div className="detail-row">
              <span className="detail-label">Applicants:</span>
              <span className="detail-value">
                {job.applicant_count} {job.applicant_count === 1 ? 'Applicant' : 'Applicants'}
              </span>
            </div>
          )}
          {job.recruiter_name && (
            <div className="detail-row">
              <span className="detail-label">Posted by:</span>
              <span className="detail-value">{job.recruiter_name}</span>
            </div>
          )}
          {job.recruiter_email && (
            <div className="detail-row">
              <span className="detail-label">Recruiter Email:</span>
              <span className="detail-value">
                <a href={`mailto:${job.recruiter_email}`}>{job.recruiter_email}</a>
              </span>
            </div>
          )}
          <div className="detail-row">
            <span className="detail-label">Posted on:</span>
            <span className="detail-value">
              {new Date(job.created_at).toLocaleDateString()}
            </span>
          </div>

          <div className="job-description-section">
            <h3>Description</h3>
            <p className="job-description">{job.description}</p>
          </div>

          {job.skills_required && (
            <div className="job-skills-section">
              <h3>Skills Required</h3>
              <p className="job-skills">{job.skills_required}</p>
            </div>
          )}

          {role === ROLES.CANDIDATE && (
            <div className="apply-section">
              {isApplied ? (
                <p className="already-applied">You have already applied to this job</p>
              ) : (
                <Button onClick={handleApply} disabled={applying} size="large">
                  {applying ? 'Applying...' : 'Apply Now'}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;

