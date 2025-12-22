import { useState } from "react";

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 409) {
        setError(data.message || "User already exists");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      alert("Registration successful! Please login.");
      onSwitchToLogin(); 

    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>

        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Full Name" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

          <select name="role" onChange={handleChange}>
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
          </select>

          {error && <p style={{ color: "salmon" }}>{error}</p>}

          <button className="auth-btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <span onClick={onSwitchToLogin}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
