import API_URL from '../config/api';
import { getToken } from '../utils/auth';

export const uploadResume = async (file) => {
  const token = getToken();
  const formData = new FormData();
  formData.append('resume', file);

  const response = await fetch(`${API_URL}/resume/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to upload resume');
  }

  return data;
};

export const downloadResume = async (userId) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/resume/download/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to download resume');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `resume_${userId}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const getResumePreview = async (userId = null) => {
  const token = getToken();
  const url = userId 
    ? `${API_URL}/resume/preview?userId=${userId}`
    : `${API_URL}/resume/preview`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to get resume preview');
  }

  return data;
};
