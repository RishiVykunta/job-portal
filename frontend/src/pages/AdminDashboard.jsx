import React, { useState } from "react";
import AdminUsers from "../components/AdminUsers";
import AdminJobs from "../components/AdminJobs";
import AdminApplications from "../components/AdminApplications";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");

  const tabStyle = (tab) => ({
    padding: "12px 26px",
    borderRadius: "14px",
    border: "none",
    cursor: "pointer",
    background:
      activeTab === tab
        ? "rgba(255,255,255,0.95)"
        : "rgba(255,255,255,0.25)",
    color: activeTab === tab ? "#000" : "#fff",
    fontWeight: "600",
    fontSize: "15px",
  });

  return (
    <div style={{ paddingBottom: "60px" }}>
      <h1
        style={{
          textAlign: "center",
          color: "white",
          marginTop: "40px",
          letterSpacing: "1.2px",
        }}
      >
        Admin Dashboard
      </h1>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "30px",
          marginBottom: "40px",
        }}
      >
        <button style={tabStyle("users")} onClick={() => setActiveTab("users")}>
          Users
        </button>
        <button style={tabStyle("jobs")} onClick={() => setActiveTab("jobs")}>
          Jobs
        </button>
        <button
          style={tabStyle("applications")}
          onClick={() => setActiveTab("applications")}
        >
          Applications
        </button>
      </div>

      {/* Content */}
      {activeTab === "users" && <AdminUsers />}
      {activeTab === "jobs" && <AdminJobs />}
      {activeTab === "applications" && <AdminApplications />}
    </div>
  );
}

export default AdminDashboard;
