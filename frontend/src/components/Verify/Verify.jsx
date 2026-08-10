import React, { useState } from "react";
import styles from "./Verify.module.css";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaQrcode } from "react-icons/fa";

function Verify() {

  const [certificateId, setCertificateId] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleVerify = () => {

    if (!certificateId.trim()) {
      setError("Please enter Verification ID");
      return;
    }

    setError("");

    navigate("/mod/verifying", {
      state: {
        certificateId: certificateId.trim(),
      },
    });
  };

  return (
    <div className={styles.container}>

      <div className={styles.card}>

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
            onChange={(e) => setCertificateId(e.target.value)}
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

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
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