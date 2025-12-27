import React, { useEffect, useState } from "react";
import GlassCard from "./GlassCard";
import { getAllApplications } from "../services/adminService";

function AdminApplications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    getAllApplications().then(setApps);
  }, []);

  return (
    <GlassCard style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "25px" }}>All Applications</h2>

      <table style={{ width: "100%", borderSpacing: "0 16px" }}>
        <thead>
          <tr style={{ textAlign: "left", opacity: 0.8 }}>
            <th>ID</th>
            <th>Candidate</th>
            <th>Job</th>
            <th>Company</th>
            <th>Status</th>
            <th>Applied On</th>
          </tr>
        </thead>

        <tbody>
          {apps.map((a) => (
            <tr key={a.application_id}>
              <td>{a.application_id}</td>
              <td>{a.candidate_email}</td>
              <td>{a.title}</td>
              <td>{a.company}</td>
              <td>{a.status}</td>
              <td>{new Date(a.applied_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </GlassCard>
  );
}




export default AdminApplications;
