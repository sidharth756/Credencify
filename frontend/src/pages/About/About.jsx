import React from 'react';
import Navbar from '../../components/Navbar/Navbar';

function AboutPage() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: "calc(100vh - 72px)", background: "#f8fafc", padding: "60px", fontFamily: "Outfit, sans-serif" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", background: "white", padding: "40px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
          <h1 style={{ color: "#173b6d", fontSize: "32px", marginBottom: "16px" }}>About Credencify</h1>
          <p style={{ color: "#64748b", fontSize: "18px", lineHeight: "1.6" }}>
            We are working on this page...
          </p>
        </div>
      </div>
    </>
  );
}

export default AboutPage;
