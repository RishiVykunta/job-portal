import API_URL from '../config/api';
import { saveToken } from '../utils/auth';

export const register = async (name, email, password, role) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, role }),
    });

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      throw new Error(`Failed to connect to server at ${API_URL}/auth/register. Please check if the backend is running and the API URL is correct.`);
    }

    if (!response.ok) {
      throw new Error(data.error?.message || data.error?.details?.join(', ') || 'Registration failed');
    }

    if (data.data.token) {
      saveToken(data.data.token);
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Network error: Unable to connect to the server at ${API_URL}/auth/register. Please check your connection and ensure the backend is running. If you're in production, make sure REACT_APP_API_URL is set correctly.`);
    }
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      throw new Error(`Failed to connect to server at ${API_URL}/auth/login. Please check if the backend is running and the API URL is correct.`);
    }

    if (!response.ok) {
      throw new Error(data.error?.message || data.error?.details?.join(', ') || 'Login failed');
    }

    if (data.data.token) {
      saveToken(data.data.token);
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Network error: Unable to connect to the server at ${API_URL}/auth/login. Please check your connection and ensure the backend is running. If you're in production, make sure REACT_APP_API_URL is set correctly.`);
    }
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const token = localStorage.getItem('job_portal_token');
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      throw new Error(`Failed to connect to server. Please check if the backend is running.`);
    }

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get profile');
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the server. Please check your connection and ensure the backend is running.');
    }
    throw error;
  }
};
