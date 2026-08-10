import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./VerificationSuccess.module.css";

function VerificationSuccess() {

  const location = useLocation();
  const navigate = useNavigate();

  const certificate = location.state?.certificate;

  if (!certificate) {

    return (
      <div className={styles.container}>

        <div className={styles.card}>

          <div className={styles.errorIcon}>
            ⚠️
          </div>

          <h2>Certificate Information Not Available</h2>

          <p>
            We could not find the certificate information.
          </p>

          <button
            className={styles.button}
            onClick={() => navigate("/mod/verify")}
          >
            Back to Verification
          </button>

        </div>

      </div>
    );
  }

  return (

    <div className={styles.container}>

      <div className={styles.card}>

        <div className={styles.successIcon}>
          ✓
        </div>

        <h2>Certificate Verified</h2>

        <p className={styles.subtitle}>
          This credential has been successfully verified.
        </p>

        <div className={styles.details}>

          <div className={styles.detailRow}>
            <span>Certificate ID</span>
            <strong>{certificate.certificateId}</strong>
          </div>

          <div className={styles.detailRow}>
            <span>Learner Name</span>
            <strong>{certificate.learnerName}</strong>
          </div>

          <div className={styles.detailRow}>
            <span>Course Name</span>
            <strong>{certificate.courseName}</strong>
          </div>

          <div className={styles.detailRow}>
            <span>Institution</span>
            <strong>{certificate.institutionName}</strong>
          </div>

          <div className={styles.detailRow}>
            <span>Status</span>
            <strong>{certificate.status}</strong>
          </div>

          <div className={styles.detailRow}>
            <span>Issued At</span>
            <strong>{certificate.issuedAt}</strong>
          </div>

          <div className={styles.hashRow}>
            <span>Blockchain Hash</span>
            <strong>{certificate.hash}</strong>
          </div>

        </div>

        <button
          className={styles.button}
          onClick={() => navigate("/mod/verify")}
        >
          Verify Another Credential
        </button>

      </div>

    </div>

  );
}

export default VerificationSuccess;