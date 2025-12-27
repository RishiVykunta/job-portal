import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../services/jobService';
import Button from '../components/Button';
import Alert from '../components/Alert';
import './PostJob.css';

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    salary: '',
    skills_required: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createJob(
        formData.title,
        formData.company,
        formData.location,
        formData.description,
        formData.salary,
        formData.skills_required
      );
      navigate('/recruiter/jobs');
    } catch (err) {
      setError(err.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job-container">
      <div className="post-job-card">
        <h1>Post a New Job</h1>
        {error && <Alert type="danger" message={error} onClose={() => setError('')} />}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Job Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Software Engineer"
            />
          </div>
          <div className="form-group">
            <label>Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              placeholder="Company name"
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., Bangalore, Karnataka"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="10"
              placeholder="Job description, requirements, responsibilities..."
            />
          </div>
          <div className="form-group">
            <label>Salary</label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g., ₹5,00,000 - ₹7,00,000 per year"
            />
          </div>
          <div className="form-group">
            <label>Skills Required</label>
            <textarea
              name="skills_required"
              value={formData.skills_required}
              onChange={handleChange}
              rows="4"
              placeholder="e.g., JavaScript, React, Node.js, SQL, Communication skills..."
            />
          </div>
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => navigate('/recruiter/jobs')}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Posting...' : 'Post Job'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;

