import API_URL from '../config/api';
import { getToken } from '../utils/auth';

export const getJobs = async (page = 1, limit = 10, search = '') => {
  const token = getToken();
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
  });

  const response = await fetch(`${API_URL}/jobs?${queryParams}`, {
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

export const getJobById = async (id) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/jobs/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to fetch job');
  }

  return data;
};

export const createJob = async (title, company, location, description) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ title, company, location, description }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to create job');
  }

  return data;
};

export const getRecruiterJobs = async () => {
  const token = getToken();
  const response = await fetch(`${API_URL}/jobs/recruiter/my-jobs`, {
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

export const applyToJob = async (jobId) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/jobs/${jobId}/apply`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to apply to job');
  }

  return data;
};

export const getAppliedJobs = async () => {
  const token = getToken();
  const response = await fetch(`${API_URL}/jobs/applied/list`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to fetch applied jobs');
  }

  return data;
};

export const getJobApplications = async (jobId) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/jobs/${jobId}/applications`, {
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
