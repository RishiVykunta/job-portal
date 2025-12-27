import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import Button from '../components/Button';
import Alert from '../components/Alert';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
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
      const response = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );
      const role = response.data.user.role;
      
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'recruiter') {
        navigate('/recruiter/jobs');
      } else {
        navigate('/candidate/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Register</h1>
        {error && <Alert type="danger" message={error} onClose={() => setError('')} />}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Enter your password (min 6 characters)"
            />
          </div>
          <div className="form-group role-select-group">
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>
          <Button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
        <p className="auth-switch">
          Already have an account? <span onClick={() => navigate('/login')}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
