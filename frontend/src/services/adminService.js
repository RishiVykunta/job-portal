import API_URL from '../config/api';
import { getToken } from '../utils/auth';

export const getAllUsers = async () => {
  const token = getToken();
  const response = await fetch(`${API_URL}/admin/users`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to fetch users');
  }

  return data;
};

export const deleteUser = async (userId) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to delete user');
  }

  return data;
};

export const getAllJobs = async () => {
  const token = getToken();
  const response = await fetch(`${API_URL}/admin/jobs`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to fetch jobs');
  }

  return data;
};

export const deleteJob = async (jobId) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/admin/jobs/${jobId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to delete job');
  }

  return data;
};

export const getAllApplications = async () => {
  const token = getToken();
  const response = await fetch(`${API_URL}/admin/applications`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to fetch applications');
  }

  return data;
};

export const getAnalytics = async () => {
  const token = getToken();
  const response = await fetch(`${API_URL}/admin/analytics`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to fetch analytics');
  }

  return data;
};
