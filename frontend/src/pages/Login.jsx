import React, { useState } from "react";
import GlassCard from "../components/GlassCard";
import { loginUser } from "../services/authService";
import "./Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");
      const data = await loginUser(email, password);

      localStorage.setItem("token", data.token);
      onLogin(); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <GlassCard>
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
        Login
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <input
          type="email"
          placeholder="Email"
          className="glass-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="glass-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p style={{ color: "salmon", textAlign: "center", margin: 0 }}>
            {error}
          </p>
        )}

        <button
          className="glass-button"
          style={{ marginTop: "10px" }}
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </GlassCard>
  );
}

export default Login;
