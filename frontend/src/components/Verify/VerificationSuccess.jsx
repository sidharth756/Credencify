import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiCheck, FiCopy, FiLock, FiUser, FiFileText, FiAward, FiCalendar, FiShield, FiExternalLink, FiShare2, FiRefreshCw, FiCpu } from "react-icons/fi";
import styles from "./VerificationSuccess.module.css";

function VerificationSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const certificate = location.state?.certificate;

  // Hard Copy Audit State
  const [auditFile, setAuditFile] = useState(null);
  const [auditStep, setAuditStep] = useState("idle"); // idle, scanning, results
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState([]);
  const [auditResult, setAuditResult] = useState(null);
  const [auditError, setAuditError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    setIsLoggedIn(!!savedUser);
  }, []);

  const handleCopyId = () => {
    const idToCopy = certificate?.certificateId || "CRT-1001";
    navigator.clipboard.writeText(idToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAuditFile(file);
      triggerAiAudit(file);
    }
  };

  const triggerAiAudit = async (file) => {
    setAuditError("");
    setAuditResult(null);
    setAuditStep("scanning");
    setScanProgress(0);
    setScanLogs(["[INFO] File received: " + file.name, "[INFO] Sending to AI OCR service..."]);
    setScanProgress(10);

    const savedUser = localStorage.getItem("user");
    let verifiedBy = "Anonymous (Public)";
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.fullName) verifiedBy = `${u.fullName} (${u.role || "USER"})`;
      } catch(e) {}
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("expectedCertificateId", certificate?.certificateId ?? "");
    formData.append("verifiedBy", verifiedBy);
    const GW = "http://" + window.location.hostname + ":9000";

    let result = null;
    let error = "";

    try {
      setScanLogs(prev => [...prev, "[OCR] Running EasyOCR on document — please wait, this may take 20-40 seconds on CPU..."]);
      setScanProgress(20);

      const res = await fetch(`${GW}/api/v1.0/verify/ai-audit`, {
        method: "POST",
        body: formData,
      });

      setScanProgress(85);
      setScanLogs(prev => [...prev, "[INFO] Response received from AI service."]);

      if (res.ok) {
        result = await res.json();
      } else {
        const data = await res.json().catch(() => null);
        error = data?.message || data?.detail || "AI service failed to parse the document.";
      }
    } catch (err) {
      error = "Could not connect to the AI verification service. Make sure all services are running.";
    }

    setScanProgress(100);

    if (error) {
      setScanLogs(prev => [...prev, `[ERROR] ${error}`]);
      setTimeout(() => {
        setAuditError(error);
        setAuditStep("error");
      }, 800);
      return;
    }

    // Show real extracted content in terminal
    const r = result;
    setScanLogs(prev => [
      ...prev,
      "[NER] SpaCy NLP entity extraction complete.",
      "[COMPARISON] Comparing against blockchain registry...",
      "─────────────────────────────────────────",
      "[EXTRACTED] ✅ OCR Extraction Complete:",
      `  Certificate ID : ${r?.certificateId ?? r?.qrCertificateId ?? "Not detected"}`,
      `  QR Code ID     : ${r?.qrCertificateId ?? "No QR code found"}`,
      `  Learner Name   : ${r?.learnerName ?? "Not detected"}`,
      `  Course         : ${r?.courseName ?? "Not detected"}`,
      `  Institution    : ${r?.institutionName ?? "Not detected"}`,
      "─────────────────────────────────────────",
      `[RAW TEXT] ${r?.rawText ? r.rawText.slice(0, 400) + (r.rawText.length > 400 ? "..." : "") : "No text extracted"}`,
      "─────────────────────────────────────────",
      `[COMPLETED] Match score: ${r?.matchScore ?? 0}%`,
    ]);

    // Wait 2 seconds so user can read the terminal before results card appears
    setTimeout(() => {
      setAuditResult(result);
      setAuditStep("results");
    }, 2000);
  };

  if (!certificate) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyCard}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2>Certificate Information Not Available</h2>
          <p>The verification session has expired or the page was refreshed. Please re-verify your certificate to view results.</p>
          <button className={styles.primaryBtn} onClick={() => navigate("/verify")}>
            Back to Verification
          </button>
        </div>
      </div>
    );
  }

  const certIdDisplay = certificate.certificateId || "CRT-1001";

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        
        {/* Header Hero Section */}
        <div className={styles.heroHeader}>
          <div className={styles.shieldRingContainer}>
            <div className={styles.glowBgArea}></div>
            <div className={styles.orbitRingOuter}>
              <div className={styles.dotOuter1}></div>
              <div className={styles.dotOuter2}></div>
              <div className={styles.dotOuter3}></div>
            </div>
            <div className={styles.orbitRingInner}>
              <div className={styles.dotInner1}></div>
              <div className={styles.dotInner2}></div>
            </div>
            <div className={styles.shieldCenterIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.shieldSvg}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
          </div>

          <div className={styles.headerText}>
            <h1>
              <span className={styles.verifiedGreenText}>Verified</span> Credential
            </h1>
            <p className={styles.subtitleText}>
              The credential is authentic and has been verified on <strong className={styles.brandBlueText}>Credencify</strong>
            </p>

            <div className={styles.idBadgeRow}>
              <span className={styles.badgeLabel}>
                <FiCheck className={styles.smallCheck} /> Verification ID
              </span>
              <span className={styles.badgeDivider}>|</span>
              <span className={styles.badgeIdValue}>{certIdDisplay}</span>
              <button className={styles.copyBtn} onClick={handleCopyId}>
                <FiCopy /> {copied ? "Copied!" : "Copy ID"}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.dividerLine}></div>

        {/* 2-Column Details Grid */}
        <div className={styles.columnsGrid}>
          
          {/* Left Column: Public Details */}
          <div className={styles.publicColumn}>
            <h3 className={styles.columnTitle}>VERIFIED DETAILS (PUBLIC)</h3>
            
            <div className={styles.detailsList}>
              <div className={styles.detailRowInline}>
                <div className={styles.fieldLabel}>
                  <FiUser className={styles.fieldIcon} /> Recipient Name
                </div>
                <div className={styles.fieldValueBold}>{certificate.learnerName || "Saravanan M"}</div>
              </div>

              <div className={styles.detailRowInline}>
                <div className={styles.fieldLabel}>
                  <FiFileText className={styles.fieldIcon} /> Credential Title
                </div>
                <div className={styles.fieldValueBold}>{certificate.courseName || "Full Stack Development Certification"}</div>
              </div>

              <div className={styles.detailRowInline}>
                <div className={styles.fieldLabel}>
                  <FiAward className={styles.fieldIcon} /> Issuer
                </div>
                <div className={styles.fieldValueBold}>{certificate.institutionName || "GuVi Certifications"}</div>
              </div>
            </div>

            <div className={styles.publicBanner}>
              <div className={styles.bannerIcon}>
                <FiShield />
              </div>
              <div className={styles.bannerText}>
                <strong>These details are publicly available</strong>
                <span>
                  {!isLoggedIn && (
                    <a onClick={() => navigate("/")} className={styles.bannerLink}> Sign in </a>
                  )}
                  {isLoggedIn ? " Full access unlocked as signed-in user." : " to view more information about this credential"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: More Details (Conditional Logged-In / Locked) */}
          <div className={styles.privateColumn}>
            <h3 className={styles.columnTitle}>
              More Details <FiLock className={styles.lockTitleIcon} />
            </h3>

            {isLoggedIn ? (
              /* LOGGED IN VIEW */
              <div className={styles.detailsList}>
                <div className={styles.detailRowInline}>
                  <div className={styles.fieldLabel}>
                    <FiCalendar className={styles.fieldIcon} /> Issue Date
                  </div>
                  <div className={styles.fieldValueBold}>
                    {certificate.issuedAt ? new Date(certificate.issuedAt).toLocaleDateString() : "Active"}
                  </div>
                </div>

                <div className={styles.detailRowInline}>
                  <div className={styles.fieldLabel}>
                    <FiShield className={styles.fieldIcon} /> Credential ID
                  </div>
                  <div className={styles.fieldValueBold}>{certificate.certificateId}</div>
                </div>

                <div className={styles.detailRowInline}>
                  <div className={styles.fieldLabel}>
                    <FiCheck className={styles.fieldIcon} /> Status
                  </div>
                  <div className={styles.fieldValueBold}>
                    <span className={styles.activeStatusPill}>{certificate.status || "ISSUED"}</span>
                  </div>
                </div>

                {certificate.hash && (
                  <div className={styles.hashBox}>
                    <span>Blockchain Ledger Hash</span>
                    <code>{certificate.hash}</code>
                  </div>
                )}
              </div>
            ) : (
              /* PUBLIC / NOT LOGGED IN VIEW (Blurred/Locked) */
              <div>
                <div className={styles.lockedSkeletonList}>
                  <div className={styles.skeletonRow}>
                    <div className={styles.fieldLabel}><FiLock className={styles.skeletonLock} /> Issue Date</div>
                    <div className={styles.skeletonBar}></div>
                  </div>
                  <div className={styles.skeletonRow}>
                    <div className={styles.fieldLabel}><FiLock className={styles.skeletonLock} /> Credential ID</div>
                    <div className={styles.skeletonBar}></div>
                  </div>
                  <div className={styles.skeletonRow}>
                    <div className={styles.fieldLabel}><FiLock className={styles.skeletonLock} /> Status</div>
                    <div className={styles.skeletonBar}></div>
                  </div>
                </div>

                {/* Locked Callout Banner */}
                <div className={styles.lockedCallout}>
                  <div className={styles.lockBoxIcon}>
                    <FiLock />
                  </div>
                  <div className={styles.lockBoxContent}>
                    <h4>Sign in to view additional credential details</h4>
                    <p>Get full access to issue date, credential ID, status and more</p>
                    <button className={styles.signInMoreBtn} onClick={() => navigate("/")}>
                      Sign in to view more
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hard Copy Physical Audit Section */}
        <div className={styles.hardCopyAuditSection}>
          <h3 style={{ margin: "0 0 8px 0", color: "#1b2b52", fontSize: "18px", fontWeight: "700" }}>
            Verify Printed Hard Copy
          </h3>
          <p style={{ margin: "0 0 16px 0", color: "#64748b", fontSize: "14px", lineHeight: "1.5" }}>
            Employer Audit: Upload a photo or scan of the physical hard copy certificate to verify its contents against the blockchain record.
          </p>

          {auditStep === "idle" && (
            <div className={styles.uploadZone} onClick={() => document.getElementById("hard-copy-upload").click()}>
              <input
                type="file"
                id="hard-copy-upload"
                onChange={handleFileChange}
                accept=".png,.jpg,.jpeg,.pdf"
                style={{ display: "none" }}
              />
              <FiCpu className={styles.uploadIcon} />
              <h4>Audit Physical Certificate</h4>
              <p>Click to upload certificate photo or PDF (PNG, JPG, PDF)</p>
            </div>
          )}

          {auditStep === "scanning" && (
            <div className={styles.scanningScreen}>
              <div className={styles.progressBarBg}>
                <div className={styles.progressBarFill} style={{ width: `${scanProgress}%` }}></div>
              </div>
              <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 10px 0" }}>
                {scanProgress < 90
                  ? `AI Model Analyzing Physical Layout... ${scanProgress}%`
                  : scanProgress < 100
                    ? `⏳ Waiting for EasyOCR to finish on CPU... (${scanProgress}%)`
                    : `✅ Processing complete!`
                }
              </p>
              <div
                ref={el => { if (el) el.scrollTop = el.scrollHeight; }}
                style={{
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: "12px",
                  color: "#94a3b8",
                  textAlign: "left",
                  width: "100%",
                  minHeight: "200px",
                  maxHeight: "360px",
                  overflowY: "auto",
                  boxSizing: "border-box",
                  lineHeight: "1.6",
                }}
              >
                {scanLogs.map((log, idx) => (
                  <div key={idx} style={{
                    color: log.startsWith("[ERROR]") ? "#f87171"
                      : log.startsWith("[EXTRACTED]") ? "#4ade80"
                      : log.startsWith("[RAW TEXT]") ? "#e2e8f0"
                      : log.startsWith("[COMPLETED]") ? "#34d399"
                      : log.startsWith("[WAITING]") ? "#fbbf24"
                      : log.startsWith("─") ? "#334155"
                      : log.startsWith("  ") ? "#a5f3fc"
                      : "#94a3b8",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}>{log}</div>
                ))}
              </div>
            </div>
          )}

          {auditStep === "error" && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "16px" }}>
              <h4 style={{ margin: "0 0 8px 0", color: "#b91c1c", fontSize: "14px" }}>⚠️ Audit Failed</h4>
              <p style={{ margin: "0 0 12px 0", color: "#7f1d1d", fontSize: "13px" }}>{auditError}</p>
              <button
                className={styles.copyBtn}
                style={{ background: "#fca5a5", borderColor: "#f87171", color: "#7f1d1d", padding: "6px 14px", height: "auto" }}
                onClick={() => { setAuditStep("idle"); setAuditFile(null); setAuditError(""); }}
              >
                Try Again
              </button>
            </div>
          )}

          {auditStep === "results" && auditResult && (
            <div className={styles.resultsScreen}>
              <div className={styles.auditSummaryRow}>
                <div className={`${styles.verdictBadge} ${
                  (auditResult.matchScore ?? 0) === 100
                    ? styles.verdictBadgeSuccess
                    : (auditResult.matchScore ?? 0) >= 70
                      ? styles.verdictBadgeWarning
                      : styles.verdictBadgeDanger
                }`}>
                  Verdict: {
                    (auditResult.matchScore ?? 0) === 100
                      ? "100% Authentic Match"
                      : (auditResult.matchScore ?? 0) >= 70
                        ? "Verification Warning"
                        : "Tampering Suspected!"
                  } ({auditResult.matchScore ?? 0}%)
                </div>
                <button
                  className={styles.copyBtn}
                  style={{ background: "#f1f5f9", borderColor: "#cbd5e1", color: "#64748b", padding: "6px 14px", height: "auto" }}
                  onClick={() => { setAuditStep("idle"); setAuditFile(null); setAuditResult(null); }}
                >
                  Audit Another Copy
                </button>
              </div>

              {/* Anomaly list */}
              <div style={{ background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "16px" }}>
                <h4 style={{ margin: "0 0 12px 0", color: "#1e293b", fontSize: "14px" }}>AI Verification Logs</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {(auditResult.anomalies ?? []).length === 0 && (
                    <div style={{ fontSize: "13px", color: "#64748b" }}>No anomalies detected.</div>
                  )}
                  {(auditResult.anomalies ?? []).map((anomaly, idx) => (
                    <div key={idx} style={{
                      fontSize: "13px",
                      color: anomaly.includes("CRITICAL") ? "#b91c1c" : anomaly.includes("WARNING") ? "#a16207" : "#15803d",
                      fontWeight: anomaly.includes("CRITICAL") || anomaly.includes("WARNING") ? "600" : "400",
                      textAlign: "left"
                    }}>
                      {anomaly}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info line */}
        <div className={styles.bottomFooterInfo}>
          <FiLock size={12} style={{ marginRight: "6px" }} />
          This verification is encrypted, secure, tamper-proof and blockchain-verified.
        </div>

      </div>
    </div>
  );
}

export default VerificationSuccess;