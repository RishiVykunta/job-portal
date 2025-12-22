import React, { useEffect, useState } from "react";
import GlassCard from "./GlassCard";
import { getAllJobs, deleteJob } from "../services/adminService";

function AdminJobs() {
  const [jobs, setJobs] = useState([]);

  const loadJobs = async () => {
    const data = await getAllJobs();
    setJobs(data);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <GlassCard style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "25px" }}>All Jobs</h2>

      <table style={{ width: "100%", borderSpacing: "0 16px" }}>
        <thead>
          <tr style={{ textAlign: "left", opacity: 0.8 }}>
            <th>ID</th>
            <th>Title</th>
            <th>Company</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((j) => (
            <tr key={j.id}>
              <td>{j.id}</td>
              <td>{j.title}</td>
              <td>{j.company}</td>
              <td>{j.location}</td>
              <td>
                <button
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "6px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    deleteJob(j.id);
                    loadJobs();
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </GlassCard>
  );
}

export default AdminJobs;
