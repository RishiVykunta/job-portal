const API_URL = "http://localhost:5000/api/admin";


export const getAllUsers = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch users");
  }

  return data;
};

export const deleteUser = async (userId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `http://localhost:5000/api/admin/users/${userId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete user");
  }

  return data;
};

export const getAllJobs = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    "http://localhost:5000/api/admin/jobs",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch jobs");
  }

  return data;
};


export const deleteJob = async (jobId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `http://localhost:5000/api/admin/jobs/${jobId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete job");
  }

  return data;
};

export const getAllApplications = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    "http://localhost:5000/api/admin/applications",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch applications");
  }

  return data;
};
