import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import AdminDashboard from "./pages/AdminDashboard";


const getRoleFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch {
    return null;
  }
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      setRole(getRoleFromToken());
    }
  }, []);

  
  if (isLoggedIn) {
   
    if (role === "admin") {
      return (
        <div className="app-container">
          <AdminDashboard />

          <button
            style={{
              marginTop: "30px",
              padding: "12px 24px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            onClick={() => {
              localStorage.removeItem("token");
              setIsLoggedIn(false);
              setRole(null);
            }}
          >
            Logout
          </button>
        </div>
      );
    }

    
    return (
      <div className="app-container">
        <Jobs role={role} />

        <button
          style={{
            marginTop: "30px",
            padding: "12px 24px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          onClick={() => {
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            setRole(null);
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  
  return (
    <div className="app-container">
      {showLogin ? (
        <Login
          onLogin={() => {
            setIsLoggedIn(true);
            setRole(getRoleFromToken());
          }}
        />
      ) : (
        <Register onSwitchToLogin={() => setShowLogin(true)} />

      )}

      <p
        style={{
          color: "white",
          marginTop: "22px",
          cursor: "pointer",
          textAlign: "center",
          fontSize: "15px",
        }}
        onClick={() => setShowLogin(!showLogin)}
      >
        {showLogin
          ? "Don't have an account? Register"
          : "Already have an account? Login"}
      </p>
    </div>
  );
}

export default App;
