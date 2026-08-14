import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiHome, FiSearch, FiPlusCircle, FiLogOut,
  FiFileText, FiCheckCircle, FiAlertTriangle, FiUser, FiSettings
} from "react-icons/fi";
import { FaShieldAlt, FaQrcode } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";
import InstitutionForm from "../../components/InstitutionForm/InstitutionForm";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./Dashboard.module.css";

const GW = "http://" + window.location.hostname + ":9000";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // Load user strictly from localStorage — ProtectedRoute ensures this exists
  const [user] = useState(() => {
    const saved = localStorage.getItem("user");
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    return {
      name: parsed.fullName || "User",
      email: parsed.email || "",
      role: parsed.role || "LEARNER",
      userId: parsed.userId || ""
    };
  });

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState(location.state?.view || "overview");

  // Missing verification & dashboard stats states
  const [stats, setStats] = useState({ total: 0, issued: 0, revoked: 0, failed: 0 });
  const [verifyCertificateId, setVerifyCertificateId] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [verificationStep, setVerificationStep] = useState("input"); // input, scanning, success, failure
  const [verifyCurrentStep, setVerifyCurrentStep] = useState(1);
  const [verifyResult, setVerifyResult] = useState(null);

  // Search & Filter list states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedCertForView, setSelectedCertForView] = useState(null);

  useEffect(() => {
    if (location.state?.view) {
      setActiveView(location.state.view);
    }
  }, [location.state]);

  // Profile management state
  const [profileData, setProfileData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    userId: user?.userId || "",
    role: user?.role || "",
    password: "",
    dob: "",
    gender: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    institutionCode: "",
    registrationNumber: "",
    contactNumber: "",
    websiteUrl: ""
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [profileError, setProfileError] = useState("");

  // Fetch real profile data from backend API
  const fetchProfile = useCallback(async () => {
    if (!user?.userId) return;
    try {
      const res = await fetch(`${GW}/api/v1.0/profile/${user.userId}`);
      if (res.ok) {
        const data = await res.json();
        setProfileData({
          fullName: data.fullName || user.name,
          email: data.email || user.email,
          userId: data.userId || user.userId,
          role: data.role || user.role,
          password: "",
          dob: data.dob || "",
          gender: data.gender || "",
          phoneNumber: data.phoneNumber || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          country: data.country || "",
          postalCode: data.postalCode || "",
          institutionCode: data.institutionCode || "",
          registrationNumber: data.registrationNumber || "",
          contactNumber: data.contactNumber || "",
          websiteUrl: data.websiteUrl || ""
        });
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
    }
  }, [user]);

  useEffect(() => {
    if (activeView === "profile" || activeView === "settings") {
      fetchProfile();
    }
  }, [activeView, fetchProfile]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setProfileMsg("");
    setProfileError("");

    try {
      const res = await fetch(`${GW}/api/v1.0/profile/${user.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: profileData.fullName,
          email: profileData.email,
          password: profileData.password || undefined,
          dob: profileData.dob,
          gender: profileData.gender,
          phoneNumber: profileData.phoneNumber,
          address: profileData.address,
          city: profileData.city,
          state: profileData.state,
          country: profileData.country,
          postalCode: profileData.postalCode,
          institutionCode: profileData.institutionCode,
          registrationNumber: profileData.registrationNumber,
          contactNumber: profileData.contactNumber,
          websiteUrl: profileData.websiteUrl
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setProfileMsg("Profile updated successfully!");
        const saved = JSON.parse(localStorage.getItem("user") || "{}");
        saved.fullName = updated.fullName;
        saved.email = updated.email;
        localStorage.setItem("user", JSON.stringify(saved));
        window.dispatchEvent(new Event("storage"));
      } else {
        const errData = await res.json();
        setProfileError(errData.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Update profile error:", err);
      setProfileError("Network error. Failed to connect to server.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Guard: if no user in state, navigate away (ProtectedRoute handles role checking at route level)
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      let endpoint = "";
      if (user.role === "INSTITUTION") {
        endpoint = `${GW}/api/certificates/institution/${user.userId}`;
      } else if (user.role === "LEARNER") {
        endpoint = `${GW}/api/certificates/learner/id/${user.userId}`;
      } else if (user.role === "ADMIN") {
        endpoint = `${GW}/api/v1.0/users`;
      } else {
        setLoading(false);
        return;
      }

      const response = await fetch(endpoint);
      if (response.ok) {
        const dataList = await response.json();
        setCertificates(dataList);

        if (user.role === "INSTITUTION") {
          setStats({
            total: dataList.length,
            issued: dataList.filter(c => c.status === "ISSUED").length,
            revoked: dataList.filter(c => c.status === "REVOKED").length,
            failed: 0,
          });
        } else if (user.role === "LEARNER") {
          const uniqueIssuers = new Set(dataList.map(c => c.institutionName)).size;
          setStats({
            total: dataList.length,
            issued: dataList.length,
            revoked: uniqueIssuers,
            failed: 0,
          });
        } else if (user.role === "ADMIN") {
          setStats({
            total: dataList.length,
            issued: dataList.filter(u => u.role === "INSTITUTION").length,
            revoked: dataList.filter(u => u.role === "LEARNER").length,
            failed: dataList.filter(u => u.role === "ADMIN").length,
          });
        }
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const getRandomDelay = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

  const handleVerify = async (certId) => {
    const idToVerify = certId || verifyCertificateId.trim();
    if (!idToVerify) {
      setVerifyError("Please enter a Verification ID.");
      return;
    }
    if (certId) setVerifyCertificateId(certId);

    setVerifyError("");
    setVerificationStep("scanning");
    setVerifyCurrentStep(1);

    try {
      await new Promise(r => setTimeout(r, getRandomDelay(800, 1600)));
      const response = await fetch(`${GW}/api/v1.0/verify/${idToVerify}`);

      if (response.status === 404) {
        setVerifyError("Certificate not found in network registries.");
        setVerificationStep("failure");
        return;
      }
      if (!response.ok) {
        let msg = "Unable to verify credential integrity.";
        try { const d = await response.json(); msg = d.message || msg; } catch {}
        setVerifyError(msg);
        setVerificationStep("failure");
        return;
      }

      const data = await response.json();

      setVerifyCurrentStep(2);
      await new Promise(r => setTimeout(r, getRandomDelay(600, 1200)));

      setVerifyCurrentStep(3);
      await new Promise(r => setTimeout(r, getRandomDelay(1000, 1800)));

      setVerifyResult(data);
      setVerificationStep("success");
    } catch (err) {
      console.error(err);
      setVerifyError("Failed to connect to verification server.");
      setVerificationStep("failure");
    }
  };

  const handleVerifyFromForm = (e) => {
    e.preventDefault();
    handleVerify(null);
  };

  /* ── Certificates List Handlers ── */
  const filteredCertificates = certificates.filter(cert => {
    const q = searchQuery.toLowerCase();
    const idMatches = cert.certificateId?.toLowerCase().includes(q) || false;
    const courseMatches = cert.courseName?.toLowerCase().includes(q) || false;
    const learnerMatches = cert.learnerName?.toLowerCase().includes(q) || false;
    const institutionMatches = cert.institutionName?.toLowerCase().includes(q) || false;
    const textMatches = idMatches || courseMatches || learnerMatches || institutionMatches;

    if (statusFilter === "ALL") return textMatches;
    if (statusFilter === "REVOKED") return textMatches && cert.status === "REVOKED";
    if (statusFilter === "ISSUED") return textMatches && (cert.status === "ISSUED" || !cert.status);
    return textMatches;
  });

  const handleViewPDF = (cert) => {
    setSelectedCertForView(cert);
  };

  const handleRevokeClick = async (certId) => {
    if (!window.confirm(`Are you sure you want to revoke certificate ${certId}? This action is permanent and will be logged on the blockchain.`)) {
      return;
    }
    try {
      const response = await fetch(`${GW}/api/certificates/${certId}/revoke`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      });
      if (response.ok) {
        alert(`Certificate ${certId} has been successfully revoked.`);
        fetchDashboardData(); // Refresh stats and list
      } else {
        alert("Failed to revoke certificate. Please try again.");
      }
    } catch (e) {
      console.error(e);
      alert("Network error. Failed to connect to server.");
    }
  };

  const avatarInitials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : "U";

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className={styles.dashboardContainer}>

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div>
          <div className={styles.sidebarTitleHeader}>
            {user.role} DASHBOARD
          </div>
          <nav className={styles.sidebarMenu}>
            <a
              className={`${styles.menuItem} ${activeView === "overview" ? styles.menuItemActive : ""}`}
              onClick={() => setActiveView("overview")}
            >
              <FiHome /> Overview
            </a>
            <a
              className={`${styles.menuItem} ${activeView === "certificates" ? styles.menuItemActive : ""}`}
              onClick={() => setActiveView("certificates")}
            >
              <FiFileText /> {user.role === "INSTITUTION" ? "Issued Certificates" : "My Certificates"}
            </a>
            <a
              className={`${styles.menuItem} ${activeView === "verify" ? styles.menuItemActive : ""}`}
              onClick={() => {
                setActiveView("verify");
                setVerificationStep("input");
                setVerifyCertificateId("");
                setVerifyError("");
                setVerifyResult(null);
              }}
            >
              <FiSearch /> Verification History
            </a>
            <a
              className={`${styles.menuItem} ${activeView === "profile" ? styles.menuItemActive : ""}`}
              onClick={() => setActiveView("profile")}
            >
              <FiUser /> Profile
            </a>
            <a
              className={`${styles.menuItem} ${activeView === "settings" ? styles.menuItemActive : ""}`}
              onClick={() => setActiveView("settings")}
            >
              <FiSettings /> Settings
            </a>
            {user.role === "INSTITUTION" && (
              <a
                className={`${styles.menuItem} ${activeView === "issue" ? styles.menuItemActive : ""}`}
                onClick={() => setActiveView("issue")}
              >
                <FiPlusCircle /> Issue Credential
              </a>
            )}
          </nav>
        </div>

        <div className={styles.sidebarBottomLogout}>
          <button className={styles.sidebarLogoutBtn} onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div>
            <h1>Welcome back, {user.name}!</h1>
            <p>
              {user.role === "INSTITUTION" && "Manage and issue verifiable credentials below."}
              {user.role === "LEARNER" && "Your blockchain-secured credentials."}
              {user.role === "ADMIN" && "System overview and user management."}
            </p>
          </div>
          <div className={styles.headerBadge}>
            <span className={styles.rolePill}>{user.role}</span>
          </div>
        </header>

        {/* VIEW: OVERVIEW */}
        {activeView === "overview" && (
          <>
            {/* Overview Stats Cards matching reference image */}
            <section className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={`${styles.statIconBox} ${styles.blueBox}`}>
                  <FiFileText />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statTitle}>Certificates</div>
                  <div className={styles.statValue}>{certificates.length}</div>
                  <div className={styles.statSub}>Total Certificates</div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={`${styles.statIconBox} ${styles.greenBox}`}>
                  <FiCheckCircle />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statTitle}>Verified</div>
                  <div className={styles.statValue}>{certificates.filter(c => c.status === "ISSUED" || !c.status).length}</div>
                  <div className={styles.statSub}>Successfully Verified</div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={`${styles.statIconBox} ${styles.amberBox}`}>
                  <FiAlertTriangle />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statTitle}>Pending</div>
                  <div className={styles.statValue}>{certificates.filter(c => c.status === "PENDING").length}</div>
                  <div className={styles.statSub}>Awaiting Verification</div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={`${styles.statIconBox} ${styles.redBox}`}>
                  <FiLogOut style={{ transform: "rotate(90deg)" }} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statTitle}>Expired</div>
                  <div className={styles.statValue}>{certificates.filter(c => c.status === "REVOKED" || c.status === "EXPIRED").length}</div>
                  <div className={styles.statSub}>No Longer Valid</div>
                </div>
              </div>
            </section>

            {/* Recent Certificates Table matching reference image */}
            <section className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.recentTitle}>Recent Certificates</h3>
                <button className={styles.viewAllBtn} onClick={() => setActiveView("certificates")}>
                  View All
                </button>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Certificate ID</th>
                      <th>Course / Program</th>
                      <th>Issued By</th>
                      <th>Issued On</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificates.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                          No credentials found for your account ID: <strong>{user.userId}</strong>
                        </td>
                      </tr>
                    ) : (
                      certificates.map(cert => (
                        <tr key={cert.id || cert.certificateId}>
                          <td className={styles.certIdBlue}>{cert.certificateId}</td>
                          <td>{cert.courseName || "Full Stack Development"}</td>
                          <td>{cert.institutionName || "Credencify Academy"}</td>
                          <td>{cert.createdAt ? new Date(cert.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "May 12, 2024"}</td>
                          <td>
                            <span className={cert.status === "REVOKED" ? styles.pillExpired : styles.pillVerified}>
                              {cert.status === "REVOKED" ? "Expired" : "Verified"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

              {user.role === "ADMIN" && (
                <>
                  <div className={styles.sectionTitle}>All Registered System Users</div>
                  {loading ? (
                    <div className={styles.loadingRow}>Loading system users...</div>
                  ) : (
                    <div className={styles.tableWrapper}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>User ID / Learner ID</th>
                            <th>Full Name</th>
                            <th>Email Address</th>
                            <th>System Role</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {certificates.length === 0 ? (
                            <tr>
                              <td colSpan="5" className={styles.emptyCell}>No system users found.</td>
                            </tr>
                          ) : (
                            certificates.map(sysUser => (
                              <tr key={sysUser.id}>
                                <td style={{ fontWeight: "600" }}>{sysUser.userId}</td>
                                <td>{sysUser.fullName}</td>
                                <td>{sysUser.email}</td>
                                <td>
                                  <span className={`${styles.badge} ${
                                    sysUser.role === "ADMIN" ? styles.badgeFailed :
                                    sysUser.role === "INSTITUTION" ? styles.badgePending : styles.badgeIssued
                                  }`}>{sysUser.role}</span>
                                </td>
                                <td>
                                  <span className={`${styles.badge} ${styles.badgeIssued}`}>{sysUser.status || "ACTIVE"}</span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
          </>
        )}

        {/* VIEW: CERTIFICATES DIRECTORY */}
        {activeView === "certificates" && (
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <h3 className={styles.recentTitle}>
                {user.role === "INSTITUTION" ? "Issued Certificates Directory" : "My Secured Certificates"}
              </h3>
              
              {/* Search & Filters */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div className={styles.searchWrapper} style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="Search by ID, Course, Learner..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ padding: "8px 12px 8px 32px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", width: "240px" }}
                  />
                  <FiSearch style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                </div>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", background: "white" }}
                >
                  <option value="ALL">All Status</option>
                  <option value="ISSUED">Active / Issued</option>
                  <option value="REVOKED">Revoked / Expired</option>
                </select>
              </div>
            </div>

            {/* List Table */}
            <div className={styles.tableWrapper} style={{ marginTop: "16px" }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Certificate ID</th>
                    <th>Course / Program</th>
                    {user.role === "INSTITUTION" ? <th>Learner Name</th> : <th>Issued By</th>}
                    <th>Issued On</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCertificates.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                        No certificates match your search query or filter.
                      </td>
                    </tr>
                  ) : (
                    filteredCertificates.map(cert => (
                      <tr key={cert.id || cert.certificateId}>
                        <td className={styles.certIdBlue}>{cert.certificateId}</td>
                        <td>{cert.courseName || "Full Stack Development"}</td>
                        {user.role === "INSTITUTION" ? (
                          <td>{cert.learnerName || "N/A"}</td>
                        ) : (
                          <td>{cert.institutionName || "Credencify Academy"}</td>
                        )}
                        <td>
                          {cert.createdAt ? new Date(cert.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "May 12, 2024"}
                        </td>
                        <td>
                          <span className={cert.status === "REVOKED" ? styles.pillExpired : styles.pillVerified}>
                            {cert.status === "REVOKED" ? "Expired" : "Verified"}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                            {/* Verify Action */}
                            <button
                              onClick={() => {
                                setVerifyCertificateId(cert.certificateId);
                                setActiveView("verify");
                                handleVerify(cert.certificateId);
                              }}
                              className={styles.viewAllBtn}
                              style={{ padding: "4px 8px", fontSize: "12px", border: "1px solid #3b82f6", color: "#3b82f6", background: "transparent" }}
                            >
                              Verify
                            </button>

                            {/* View PDF Layout */}
                            <button
                              onClick={() => handleViewPDF(cert)}
                              className={styles.viewAllBtn}
                              style={{ padding: "4px 8px", fontSize: "12px", border: "1px solid #10b981", color: "#10b981", background: "transparent" }}
                            >
                              View
                            </button>

                            {/* Revoke Action */}
                            {user.role === "INSTITUTION" && cert.status !== "REVOKED" && (
                              <button
                                onClick={() => handleRevokeClick(cert.certificateId)}
                                className={styles.viewAllBtn}
                                style={{ padding: "4px 8px", fontSize: "12px", border: "1px solid #ef4444", color: "#ef4444", background: "transparent" }}
                              >
                                Revoke
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW: ISSUE CREDENTIAL */}
        {activeView === "issue" && (
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>Issue a New Credential</div>
            </div>
            <InstitutionForm
              hideTitle={true}
              onSuccess={() => {
                fetchDashboardData();
                setActiveView("overview");
              }}
            />
          </div>
        )}

        {/* VIEW: VERIFY PORTAL */}
        {activeView === "verify" && (
          <div className={styles.sectionCard}>
            {/* INPUT */}
            {verificationStep === "input" && (
              <div className={styles.verifyContainer}>
                <h2>Verify a Credential</h2>
                <p className={styles.verifySubtitle}>
                  Enter the credential ID to verify its authenticity on the Credencify blockchain.
                </p>

                <form onSubmit={handleVerifyFromForm} className={styles.verifyForm}>
                  <div className={styles.verifyInputWrapper}>
                    <input
                      type="text"
                      placeholder="Enter Certificate ID (e.g. CERT-1001)"
                      value={verifyCertificateId}
                      onChange={e => setVerifyCertificateId(e.target.value)}
                      required
                    />
                  </div>
                  {verifyError && <p className={styles.errorAlert}>{verifyError}</p>}
                  <button type="submit" className={styles.verifySubmitBtn}>
                    Verify Credential <FiSearch style={{ marginLeft: "6px" }} />
                  </button>
                </form>

                <div className={styles.verifyOr}><span>Or</span></div>
                <button type="button" className={styles.verifyQrBtn}>
                  <FaQrcode /> Scan QR Code
                </button>
              </div>
            )}

            {/* SCANNING */}
            {verificationStep === "scanning" && (
              <div className={styles.scanningContainer}>
                <div className={styles.spinnerWrapper}>
                  <div className={styles.spinnerRing}></div>
                  <div className={styles.spinnerIcon}><FaShieldAlt /></div>
                </div>
                <h2>Verifying Credential</h2>
                <p className={styles.verifySubtitle}>
                  Please wait while we audit the credential on-chain.
                </p>
                <div className={styles.stepper}>
                  <div className={`${styles.step} ${verifyCurrentStep === 1 ? styles.activeStep : verifyCurrentStep > 1 ? styles.completedStep : ""}`}>
                    <FiFileText /><span>Fetching</span>
                  </div>
                  <div className={`${styles.step} ${verifyCurrentStep === 2 ? styles.activeStep : verifyCurrentStep > 2 ? styles.completedStep : ""}`}>
                    <MdOutlineSecurity /><span>Validating</span>
                  </div>
                  <div className={`${styles.step} ${verifyCurrentStep === 3 ? styles.activeStep : verifyCurrentStep > 3 ? styles.completedStep : ""}`}>
                    <FaShieldAlt /><span>Blockchain Audit</span>
                  </div>
                </div>
              </div>
            )}

            {/* SUCCESS */}
            {verificationStep === "success" && verifyResult && (
              <div className={styles.successContainer}>
                <div className={styles.successIcon}>✓</div>
                <h2>Certificate Verified</h2>
                <p className={styles.verifySubtitle}>This credential has been successfully verified on-chain.</p>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}><span>Certificate ID</span><strong>{verifyResult.certificateId}</strong></div>
                  <div className={styles.detailItem}><span>Learner Name</span><strong>{verifyResult.learnerName}</strong></div>
                  <div className={styles.detailItem}><span>Course Title</span><strong>{verifyResult.courseName}</strong></div>
                  <div className={styles.detailItem}><span>Institution</span><strong>{verifyResult.institutionName}</strong></div>
                  <div className={styles.detailItem}><span>Status</span><strong style={{ color: "#16a34a" }}>{verifyResult.status || "VERIFIED"}</strong></div>
                  <div className={styles.detailItem}><span>Issued At</span><strong>{verifyResult.issuedAt ? new Date(verifyResult.issuedAt).toLocaleDateString() : "N/A"}</strong></div>
                  <div className={styles.hashBlock}><span>On-Chain Ledger Hash</span><code>{verifyResult.hash}</code></div>
                </div>
                <button className={styles.verifySubmitBtn} style={{ marginTop: "20px" }}
                  onClick={() => { setVerificationStep("input"); setVerifyCertificateId(""); setVerifyResult(null); }}>
                  Verify Another Credential
                </button>
              </div>
            )}

            {/* FAILURE */}
            {verificationStep === "failure" && (
              <div className={styles.failureContainer}>
                <div className={styles.failureIcon}>✕</div>
                <h2>Verification Failed</h2>
                <p className={styles.errorAlert} style={{ marginTop: "10px" }}>{verifyError}</p>
                <p style={{ color: "#64748b", fontSize: "14px", marginTop: "10px" }}>
                  The certificate ID could not be found or hash does not match. Check the ID and try again.
                </p>
                <button className={styles.verifySubmitBtn} style={{ marginTop: "20px", background: "#4b5563" }}
                  onClick={() => { setVerificationStep("input"); setVerifyError(""); }}>
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW: SETTINGS (Under Development Notice) */}
        {activeView === "settings" && (
          <div className={styles.sectionCard} style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: "42px", marginBottom: "12px" }}>⚙️</div>
            <h3 className={styles.recentTitle} style={{ marginBottom: "8px" }}>Settings Page Under Development</h3>
            <p style={{ color: "#64748b", fontSize: "14px", maxWidth: "480px", margin: "0 auto 20px auto" }}>
              We are actively building advanced security preferences, multi-factor authentication (MFA), and email notification preferences.
            </p>
            <span style={{ display: "inline-block", background: "#fef3c7", color: "#b45309", padding: "6px 16px", borderRadius: "20px", fontWeight: "600", fontSize: "13px" }}>
              🚧 Feature Under Active Development
            </span>
          </div>
        )}

        {/* VIEW: PROFILE (Real Data Fetch & Edit API) */}
        {activeView === "profile" && (
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.recentTitle}>User Profile Details</h3>
            </div>

            <form onSubmit={handleProfileUpdate} className={styles.profileForm}>
              {profileMsg && <div className={styles.profileSuccessBanner}>{profileMsg}</div>}
              {profileError && <div className={styles.errorAlert}>{profileError}</div>}

              <div className={styles.profileRowGrid}>
                <div className={styles.inputGroup}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={e => setProfileData({ ...profileData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>User / Learner ID (Read Only)</label>
                  <input
                    type="text"
                    value={profileData.userId}
                    disabled
                    style={{ background: "#f1f5f9", cursor: "not-allowed" }}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Account Role (Read Only)</label>
                  <input
                    type="text"
                    value={profileData.role}
                    disabled
                    style={{ background: "#f1f5f9", cursor: "not-allowed" }}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Phone Number</label>
                  <input
                    type="text"
                    value={profileData.phoneNumber}
                    onChange={e => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    value={profileData.dob}
                    onChange={e => setProfileData({ ...profileData, dob: e.target.value })}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Gender</label>
                  <select
                    value={profileData.gender}
                    onChange={e => setProfileData({ ...profileData, gender: e.target.value })}
                    style={{ padding: "11px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "white" }}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label>City</label>
                  <input
                    type="text"
                    value={profileData.city}
                    onChange={e => setProfileData({ ...profileData, city: e.target.value })}
                    placeholder="Enter city"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>State / Province</label>
                  <input
                    type="text"
                    value={profileData.state}
                    onChange={e => setProfileData({ ...profileData, state: e.target.value })}
                    placeholder="Enter state"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Country</label>
                  <input
                    type="text"
                    value={profileData.country}
                    onChange={e => setProfileData({ ...profileData, country: e.target.value })}
                    placeholder="Enter country"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Postal / Zip Code</label>
                  <input
                    type="text"
                    value={profileData.postalCode}
                    onChange={e => setProfileData({ ...profileData, postalCode: e.target.value })}
                    placeholder="Enter postal code"
                  />
                </div>

                <div className={styles.inputGroup} style={{ gridColumn: "1 / -1" }}>
                  <label>Residential Address</label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={e => setProfileData({ ...profileData, address: e.target.value })}
                    placeholder="Enter full address"
                  />
                </div>

                <div className={styles.inputGroup} style={{ gridColumn: "1 / -1" }}>
                  <label>New Password (Leave blank to keep unchanged)</label>
                  <input
                    type="password"
                    value={profileData.password}
                    onChange={e => setProfileData({ ...profileData, password: e.target.value })}
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div style={{ marginTop: "24px" }}>
                <button type="submit" className={styles.actionBtn} disabled={updatingProfile}>
                  {updatingProfile ? "Saving Profile..." : "Save Profile Changes"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
      </div>

      {/* Selected Certificate Modal for View / Print */}
      {selectedCertForView && (
        <div className={styles.modalOverlay} onClick={() => setSelectedCertForView(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={() => setSelectedCertForView(null)}>&times;</button>
            <div className={styles.certificateDesign}>
              <div className={styles.certBorderOuter}>
                <div className={styles.certBorderInner}>
                  <div className={styles.certBadge}>
                    <FaShieldAlt style={{ marginRight: "6px" }} /> SECURED
                  </div>
                  <div className={styles.certHeader}>
                    <h2>VERIFIABLE CREDENTIAL</h2>
                    <p className={styles.certSubtitle}>SECURED BY CREDENCIFY BLOCKCHAIN ECOSYSTEM</p>
                  </div>
                  
                  <div className={styles.certBody}>
                    <p className={styles.certTextLabel}>This certifies that</p>
                    <h3 className={styles.certRecipientName}>{selectedCertForView.learnerName || "Learner Name"}</h3>
                    <p className={styles.certTextLabel}>has successfully completed the program</p>
                    <h4 className={styles.certCourseName}>{selectedCertForView.courseName || "Course Name"}</h4>
                    <p className={styles.certTextLabel}>offered by</p>
                    <h5 className={styles.certInstitutionName}>{selectedCertForView.institutionName || "Institution Name"}</h5>
                  </div>

                  <div className={styles.certFooter}>
                    <div className={styles.certSignatures}>
                      <div className={styles.certSigLine}>
                        <div className={styles.certSigImg} style={{ fontFamily: "cursive" }}>
                          {selectedCertForView.institutionName?.substring(0, 15)} Rep
                        </div>
                        <span>Authorized Signatory</span>
                      </div>

                      {/* Verification QR Code Link */}
                      <div className={styles.certSigLine}>
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(
                            `${window.location.protocol}//${window.location.host}/verify?id=${selectedCertForView.certificateId}`
                          )}`}
                          alt="Verification QR Code"
                          style={{ width: "60px", height: "60px", marginBottom: "6px" }}
                        />
                        <span>Scan to Verify</span>
                      </div>

                      <div className={styles.certSigLine}>
                        <div className={styles.certSigImg} style={{ color: "#2563eb", fontWeight: "bold" }}>
                          Credencify Verified
                        </div>
                        <span>Proof Registry</span>
                      </div>
                    </div>

                    <div className={styles.certMeta}>
                      <div><span>Certificate ID:</span> <strong>{selectedCertForView.certificateId}</strong></div>
                      <div><span>Issued On:</span> <strong>{selectedCertForView.createdAt ? new Date(selectedCertForView.createdAt).toLocaleDateString() : "May 12, 2024"}</strong></div>
                      <div style={{ wordBreak: "break-all" }}><span>Verification Hash:</span> <code style={{ fontSize: "11px", color: "#64748b" }}>{selectedCertForView.certificateHash}</code></div>
                    </div>
                  </div>
                  
                  {selectedCertForView.status === "REVOKED" && (
                    <div className={styles.revokedWatermark}>
                      REVOKED
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <button className={styles.actionBtn} onClick={() => window.print()}>
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
