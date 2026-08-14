import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./VerificationFailure.module.css";

function VerificationFailure() {

  const location = useLocation();
  const navigate = useNavigate();

  const certificateId = location.state?.certificateId;

  const message =
    location.state?.message ||
    "Certificate verification failed.";

  return (

    <div className={styles.container}>

      <div className={styles.card}>

        <div className={styles.failureIcon}>
          ✕
        </div>

        <h2>Verification Failed</h2>

        <p className={styles.subtitle}>
          {message}
        </p>

        {certificateId && (
          <div className={styles.verificationId}>

            <span>Verification ID</span>

            <strong>{certificateId}</strong>

          </div>
        )}

        <p className={styles.info}>
          The certificate could not be verified.
          Please check the Verification ID and try again.
        </p>

        <button
          className={styles.button}
          onClick={() => navigate("/verify")}
        >
          Try Again
        </button>

      </div>

    </div>

  );
}

export default VerificationFailure;