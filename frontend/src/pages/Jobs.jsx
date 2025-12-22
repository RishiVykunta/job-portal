import React, { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import UploadResume from "../components/UploadResume";
import PostJob from "./PostJob";
import { fetchJobs, applyToJob } from "../services/jobService";

function Jobs({ role }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPostJob, setShowPostJob] = useState(false);

  
  const [appliedJobs, setAppliedJobs] = useState([]);

  const [search, setSearch] = useState("");

  
  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await fetchJobs();
      setJobs(data);
    } catch (err) {
      setError(err.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

 
  const handleApply = async (jobId) => {
    try {
      await applyToJob(jobId);

      setAppliedJobs((prev) =>
        prev.includes(jobId) ? prev : [...prev, jobId]
      );
    } catch (err) {
      if (err.response?.status === 409) {
        
        setAppliedJobs((prev) =>
          prev.includes(jobId) ? prev : [...prev, jobId]
        );
        alert("You have already applied for this job");
      } else {
        alert("Failed to apply. Please try again.");
      }
    }
  };

  if (showPostJob) {
    return (
      <PostJob
        onClose={() => {
          setShowPostJob(false);
          loadJobs();
        }}
      />
    );
  }

  if (loading) return <p style={{ color: "white" }}>Loading jobs...</p>;
  if (error) return <p style={{ color: "salmon" }}>{error}</p>;

  
  const filteredJobs = jobs.filter((job) =>
    `${job.title} ${job.company} ${job.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Candidate search */}
      {role === "candidate" && (
        <input
          type="text"
          placeholder="Search jobs (title, company, location)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="glass-input"
          style={{
            marginBottom: "30px",
            width: "100%",
            maxWidth: "460px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      )}

      {/* Recruiter post job */}
      {role === "recruiter" && (
        <button
          style={{
            marginBottom: "30px",
            padding: "12px 26px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          onClick={() => setShowPostJob(true)}
        >
          + Post Job
        </button>
      )}

      {/* Job list */}
      <div style={{ display: "grid", gap: "26px" }}>
        {filteredJobs.length === 0 && (
          <p style={{ color: "white", textAlign: "center" }}>
            No jobs found
          </p>
        )}

        {filteredJobs.map((job) => {
          const alreadyApplied = appliedJobs.includes(job.id);

          return (
            <div key={job.id}>
              <JobCard
                job={job}
                showApply={role === "candidate"}
                alreadyApplied={alreadyApplied}
                onApply={handleApply}
              />

              {/* Upload resume AFTER apply */}
              {role === "candidate" && alreadyApplied && (
                <UploadResume jobId={job.id} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Jobs;
