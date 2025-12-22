const API_URL = "http://localhost:5000/api";


const getToken = () => localStorage.getItem("token");


export const fetchJobs = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/jobs", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return res.json();
};


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


export const uploadResume = async (jobId, file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await fetch(`${API_URL}/resume/${jobId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Resume upload failed");
  return res.json();
};
