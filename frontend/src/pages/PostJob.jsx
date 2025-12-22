import React, { useState } from "react";

function PostJob() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          company,
          location,
          description, // ✅ NOW USED
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to post job");
        return;
      }

      alert("Job posted successfully");

      setTitle("");
      setCompany("");
      setLocation("");
      setDescription("");
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "40px auto",
        background: "rgba(255,255,255,0.15)",
        padding: "20px",
        borderRadius: "12px",
        backdropFilter: "blur(10px)",
      }}
    >
      <h3 style={{ color: "white", textAlign: "center" }}>
        Post a Job
      </h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginTop: "10px" }}
        />

        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginTop: "10px" }}
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginTop: "10px" }}
        />

        <textarea
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            borderRadius: "6px",
            fontFamily: "inherit",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "15px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Post Job
        </button>
      </form>
    </div>
  );
}

export default PostJob;
