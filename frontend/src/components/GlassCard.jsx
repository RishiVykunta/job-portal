import React from "react";

function GlassCard({ children }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "620px",          
        minHeight: "320px",        
        padding: "40px 32px",
        borderRadius: "20px",
        background: "rgba(255,255,255,0.18)",
        backdropFilter: "blur(14px)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
}

export default GlassCard;
