import API_BASE_URL from "../config";

const API_URL = `${API_BASE_URL}/api/admin`;

const getToken = () => localStorage.getItem("token");

export const getAllUsers = async () => {
  const response = await fetch(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch users");
  }

  return data;
};

export const deleteUser = async (userId) => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete user");
  }

  return data;
};

export const getAllJobs = async () => {
  const response = await fetch(`${API_URL}/jobs`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch jobs");
  }

  return data;
};

export const deleteJob = async (jobId) => {
  const response = await fetch(`${API_URL}/jobs/${jobId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete job");
  }

  return data;
};

export const getAllApplications = async () => {
  const response = await fetch(`${API_URL}/applications`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch applications");
  }

  return data;
};
