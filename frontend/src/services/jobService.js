import API_BASE_URL from "../config";

const API_URL = `${API_BASE_URL}/api`;

const getToken = () => localStorage.getItem("token");

/**
 * FETCH ALL JOBS
 */
export const fetchJobs = async () => {
  const res = await fetch(`${API_URL}/jobs`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return res.json();
};

/**
 * POST JOB (recruiter)
 */
export const postJob = async (jobData) => {
  const res = await fetch(`${API_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(jobData),
  });

  if (!res.ok) throw new Error("Failed to post job");
  return res.json();
};

/**
 * APPLY TO JOB (candidate)
 */
export const applyToJob = async (jobId) => {
  const res = await fetch(`${API_URL}/jobs/${jobId}/apply`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to apply");
  return res.json();
};

/**
 * UPLOAD RESUME (candidate)
 */
export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await fetch(`${API_URL}/resume/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Resume upload failed");
  return res.json();
};
