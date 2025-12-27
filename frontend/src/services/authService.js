import API_URL from '../config/api';
import { saveToken } from '../utils/auth';

export const register = async (name, email, password, role) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password, role }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Registration failed');
  }

  if (data.data.token) {
    saveToken(data.data.token);
  }

  return data;
};

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Login failed');
  }

  if (data.data.token) {
    saveToken(data.data.token);
  }

  return data;
};

export const getProfile = async () => {
  const token = localStorage.getItem('job_portal_token');
  const response = await fetch(`${API_URL}/auth/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to get profile');
  }

  return data;
};
