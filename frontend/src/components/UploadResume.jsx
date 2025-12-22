import React, { useState } from "react";
import { uploadResume } from "../services/jobService";

function UploadResume({ jobId }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a PDF file");
      return;
    }

    try {
      await uploadResume(jobId, file);
      setMessage("Resume uploaded successfully");
    } catch (err) {
      setMessage(err.message || "Upload failed");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "520px",
        margin: "0 auto 30px",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.18)",
          backdropFilter: "blur(14px)",
          borderRadius: "18px",
          padding: "32px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
          color: "white",
        }}
      >
        <h3 style={{ marginBottom: "16px", textAlign: "center" }}>
          Upload Resume (PDF)
        </h3>

        <input
          type="file"
          accept=".pdf"
          className="file-input"
          onChange={(e) => setFile(e.target.files[0])}
          style={{
            width: "100%",
            marginBottom: "18px",
          }}
        />

        <button
          className="glass-button"
          style={{ width: "100%" }}
          onClick={handleUpload}
        >
          Upload
        </button>

        {message && (
          <p
            style={{
              marginTop: "14px",
              textAlign: "center",
              fontSize: "14px",
              opacity: 0.9,
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default UploadResume;
