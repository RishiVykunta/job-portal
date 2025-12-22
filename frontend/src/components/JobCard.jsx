import React from "react";

function JobCard({ job, onApply, showApply, alreadyApplied }) {
  if (!job) return null;

  return (
    <div
      className="job-card"
      style={{
        background: "rgba(255,255,255,0.16)",
        backdropFilter: "blur(12px)",
        borderRadius: "18px",
        padding: "22px 24px",
        boxShadow: "0 14px 32px rgba(0,0,0,0.18)",
        color: "white",
      }}
    >
      {/* Title */}
      <h3 style={{ margin: "0 0 6px", fontSize: "19px" }}>
        {job.title}
      </h3>

      {/* Company + Location */}
      <p
        style={{
          margin: "0 0 8px",
          fontSize: "14px",
          opacity: 0.9,
        }}
      >
        {job.company} • {job.location}
      </p>

      {/* Posted date */}
      <p
        style={{
          fontSize: "12.5px",
          opacity: 0.7,
          marginBottom: "12px",
        }}
      >
        Posted on:{" "}
        {job.created_at
          ? new Date(job.created_at).toLocaleDateString()
          : "N/A"}
      </p>

      {/* Description */}
      {job.description && (
        <p
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            opacity: 0.85,
            marginBottom: "16px",
          }}
        >
          {job.description}
        </p>
      )}

      {/* Apply / Already Applied */}
      {showApply && (
        alreadyApplied ? (
          <button
            disabled
            style={{
              padding: "10px 18px",
              borderRadius: "10px",
              border: "none",
              background: "rgba(255,255,255,0.25)",
              color: "#ddd",
              cursor: "not-allowed",
            }}
          >
            Already Applied
          </button>
        ) : (
          <button
            className="glass-button"
            onClick={() => onApply(job.id)}
          >
            Apply
          </button>
        )
      )}
    </div>
  );
}

export default JobCard;
