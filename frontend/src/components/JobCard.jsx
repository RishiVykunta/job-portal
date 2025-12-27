import React from 'react';
import './JobCard.css';

const JobCard = ({ job, onView, onApply, isApplied = false, showActions = true, applicantCount }) => {
  return (
    <div className="job-card">
      <div className="job-card-header">
        <h3 className="job-title">{job.title}</h3>
        {isApplied && <span className="applied-badge">Applied</span>}
        {applicantCount !== undefined && applicantCount !== null && (
          <span className="applicant-count-badge">{applicantCount} {applicantCount === 1 ? 'Applicant' : 'Applicants'}</span>
        )}
      </div>
      <div className="job-card-body">
        <p className="job-company">📍 {job.company}</p>
        <p className="job-location">🏢 {job.location}</p>
        {job.salary && <p className="job-salary">💰 {job.salary}</p>}
        <p className="job-description">
          {job.description && job.description.length > 150
            ? `${job.description.substring(0, 150)}...`
            : job.description}
        </p>
        {job.skills_required && (
          <p className="job-skills">
            <strong>Skills:</strong> {job.skills_required.length > 100
              ? `${job.skills_required.substring(0, 100)}...`
              : job.skills_required}
          </p>
        )}
        {job.recruiter_name && (
          <p className="job-recruiter">Posted by: {job.recruiter_name}</p>
        )}
        <p className="job-date">
          Posted: {new Date(job.created_at).toLocaleDateString()}
        </p>
      </div>
      {showActions && (
        <div className="job-card-actions">
          <button className="btn-view" onClick={() => onView(job.id)}>
            View Details
          </button>
          {onApply && !isApplied && (
            <button className="btn-apply" onClick={() => onApply(job.id)}>
              Apply Now
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default JobCard;

