import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Verifying.module.css";

function Verifying() {
  const location = useLocation();
  const navigate = useNavigate();

  const certificateId = location.state?.certificateId;

  useEffect(() => {
    if (!certificateId) {
      navigate("/mod/verify");
      return;
    }

    const verifyCertificate = async () => {
      try {
        const response = await fetch(
          `http://${import.meta.env.VITE_API_HOST}:8051/api/certificates/${certificateId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Keep verifying page visible for at least 1.5 seconds
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Certificate not found
        if (response.status === 404) {
          navigate("/mod/verification-failure", {
            state: {
              certificateId: certificateId,
              message: "Certificate not found.",
            },
          });

          return;
        }

        // Other backend errors
        if (!response.ok) {
          navigate("/mod/verification-failure", {
            state: {
              certificateId: certificateId,
              message: "Unable to verify certificate.",
            },
          });

          return;
        }

        // Success
        const data = await response.json();

        navigate("/mod/verification-success", {
          state: {
            certificate: data,
          },
        });
      } catch (error) {
        console.error("Verification error:", error);

        navigate("/mod/verification-failure", {
          state: {
            certificateId: certificateId,
            message: "Unable to connect to verification server.",
          },
        });
      }
    };

    verifyCertificate();
  }, [certificateId, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.loader}></div>

        <h2>Verifying Credential</h2>

        <p>
          Please wait while we verify your credential
          against the blockchain.
        </p>

        <span>
          This may take a few moments...
        </span>

        <p>
          Verification ID: <strong>{certificateId}</strong>
        </p>
      </div>
    </div>
  );
}

export default Verifying;