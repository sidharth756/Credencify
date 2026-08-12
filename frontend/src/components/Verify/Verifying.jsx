import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaShieldAlt, FaLock } from "react-icons/fa";
import { FiFileText, FiCheckCircle } from "react-icons/fi";
import { GrStatusPlaceholder } from "react-icons/gr"; // Fallback node icon
import { MdOutlineSecurity } from "react-icons/md";
import styles from "./Verifying.module.css";

function Verifying() {
  const location = useLocation();
  const navigate = useNavigate();
  const certificateId = location.state?.certificateId;

  // 1 = Fetching, 2 = Validating, 3 = Blockchain, 4 = Finalizing
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (!certificateId) {
      navigate("/mod/verify");
      return;
    }

    const getRandomDelay = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

    const verifyCertificate = async () => {
      try {
        // ---- STEP 1: Fetching Credential ----
        setCurrentStep(1);
        const response = await fetch(
          `http://${import.meta.env.VITE_API_HOST}:8051/api/certificates/${certificateId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Keep Fetching step active for random visual progress (800ms - 1800ms)
        await new Promise((resolve) => setTimeout(resolve, getRandomDelay(800, 1800)));

        if (response.status === 404) {
          // If not found, skip directly to failure
          navigate("/mod/verification-failure", {
            state: {
              certificateId: certificateId,
              message: "Certificate not found in records.",
            },
          });
          return;
        }

        if (!response.ok) {
          navigate("/mod/verification-failure", {
            state: {
              certificateId: certificateId,
              message: "Unable to verify certificate details.",
            },
          });
          return;
        }

        const data = await response.json();

        // ---- STEP 2: Validating Data ----
        setCurrentStep(2);
        await new Promise((resolve) => setTimeout(resolve, getRandomDelay(600, 1200)));

        // ---- STEP 3: Checking Blockchain ----
        setCurrentStep(3);
        await new Promise((resolve) => setTimeout(resolve, getRandomDelay(1000, 2000)));

        // ---- STEP 4: Finalizing Result ----
        setCurrentStep(4);
        await new Promise((resolve) => setTimeout(resolve, getRandomDelay(500, 1000)));

        // Redirect to success
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
        
        {/* Glowing Shield Spinner */}
        <div className={styles.spinnerWrapper}>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerIcon}>
            <FaShieldAlt />
          </div>
        </div>

        <h2>Verifying Credential</h2>
        <p className={styles.subtitle}>
          Please wait while we verify the authenticity of the credential on our secure Network.
        </p>

        {/* Stepper Steps */}
        <div className={styles.stepper}>
          
          {/* Step 1: Fetching */}
          <div className={`${styles.step} ${currentStep === 1 ? styles.active : currentStep > 1 ? styles.completed : ""}`}>
            <div className={styles.circle}>
              <FiFileText />
            </div>
            <span className={styles.stepLabel}>Fetching Credential</span>
            <span className={styles.stepStatus}>
              {currentStep > 1 ? "Completed" : currentStep === 1 ? "In Progress" : "Pending"}
            </span>
          </div>

          <div className={`${styles.line} ${currentStep > 1 ? styles.lineActive : styles.lineDotted}`}></div>

          {/* Step 2: Validating */}
          <div className={`${styles.step} ${currentStep === 2 ? styles.active : currentStep > 2 ? styles.completed : ""}`}>
            <div className={styles.circle}>
              <MdOutlineSecurity />
            </div>
            <span className={styles.stepLabel}>Validating Data</span>
            <span className={styles.stepStatus}>
              {currentStep > 2 ? "Completed" : currentStep === 2 ? "In Progress" : "Pending"}
            </span>
          </div>

          <div className={`${styles.line} ${currentStep > 2 ? styles.lineActive : styles.lineDotted}`}></div>

          {/* Step 3: Blockchain */}
          <div className={`${styles.step} ${currentStep === 3 ? styles.active : currentStep > 3 ? styles.completed : ""}`}>
            <div className={styles.circle}>
              <FaShieldAlt />
            </div>
            <span className={styles.stepLabel}>Checking Blockchain</span>
            <span className={styles.stepStatus}>
              {currentStep > 3 ? "Completed" : currentStep === 3 ? "In Progress" : "Pending"}
            </span>
          </div>

          <div className={`${styles.line} ${currentStep > 3 ? styles.lineActive : styles.lineDotted}`}></div>

          {/* Step 4: Finalizing */}
          <div className={`${styles.step} ${currentStep === 4 ? styles.active : currentStep > 4 ? styles.completed : ""}`}>
            <div className={styles.circle}>
              <FiCheckCircle />
            </div>
            <span className={styles.stepLabel}>Finalizing Result</span>
            <span className={styles.stepStatus}>
              {currentStep === 4 ? "In Progress" : "Pending"}
            </span>
          </div>

        </div>

        {/* Secured & Trusted Box */}
        <div className={styles.infoBox}>
          <div className={styles.infoIcon}>
            <FaShieldAlt />
          </div>
          <div className={styles.infoText}>
            <h4>Secured & Trusted Verification</h4>
            <p>We are verifying this credential using blockchain technology to ensure authenticity and prevent tampering.</p>
          </div>
        </div>

        <hr />

        {/* Lock Footer */}
        <div className={styles.footer}>
          <FaLock size={10} />
          <span>This verification is encrypted and secure. Please do not close the window.</span>
        </div>

      </div>
    </div>
  );
}

export default Verifying;