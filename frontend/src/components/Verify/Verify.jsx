import React, { useState } from "react";
import styles from "./Verify.module.css";
import { FaShieldAlt, FaSearch, FaQrcode } from "react-icons/fa";

function Verify() {

  const [certificateId, setcertificateId] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!certificateId) {
      setError("Please enter Verification ID");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setCertificate(null);

      const response = await fetch(
        `http://localhost:8051/api/certificates/${certificateId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Certificate not found");
      }

      const data = await response.json();

      setCertificate(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <FaShieldAlt />
        </div>

        <h2>Verify your Credential</h2>

        <p className={styles.subtitle}>
          Enter the credential verification ID to instantly verify its
          authenticity and view details.
        </p>

        <hr />

        <label>Verification ID</label>

        <div className={styles.inputBox}>
          <input
            type="text"
            placeholder="Enter your Credential Verification ID"
            value={certificateId}
            onChange={(e) => setcertificateId(e.target.value)}
          />

          <button className={styles.copyBtn}>
            
          </button>
        </div>

        <small>
          You can find the verification ID on your credential or certificate.
        </small>

        <button
          className={styles.verifyBtn}
          onClick={handleVerify}
        >
          Verify Credential <FaSearch />
        </button>

       
        {loading && <p>Verifying...</p>}

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        {certificate && (
          <div
            style={{
              marginTop: "20px",
              textAlign: "left",
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            <h3>Certificate Verified ✅</h3>

            <p>
              <strong>Certificate ID:</strong>{" "}
              {certificate.certificateId}
            </p>

            <p>
              <strong>Blockchain Hash:</strong>{" "}
              {certificate.hash}
            </p>

            {/* 
            <p>
              <strong>Learner Name:</strong>{" "}
              {certificate.learnerName}
            </p>

            <p>
              <strong>Course Name:</strong>{" "}
              {certificate.courseName}
            </p>

            <p>
              <strong>Institution:</strong>{" "}
              {certificate.institution}
            </p>
            */}
          </div>
        )}

        <div className={styles.or}>
          <span>Or</span>
        </div>

        <button className={styles.qrBtn}>
          <FaQrcode /> Scan QR Code
        </button>

        <div className={styles.footer}>
          All verifications are secure, tamper-proof and blockchain-verified.
        </div>
      </div>
    </div>
  );
}

export default Verify;