import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiShield, FiDatabase, FiCpu, FiLogOut, FiActivity, FiTool } from "react-icons/fi";
import styles from "./Mods.module.css";

const GW = "http://" + window.location.hostname + ":9000";

export default function Mods() {
    const navigate = useNavigate();

    // Check if admin is authenticated — always start fresh (no auto-login from stale session)
    const [admin, setAdmin] = useState(null);

    // Form inputs
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [loadingLogin, setLoadingLogin] = useState(false);

    // Dashboard states
    const [users, setUsers] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [activeTab, setActiveTab] = useState("overview"); // overview, ai-logs, system

    // AI Audit states
    const [auditFile, setAuditFile] = useState(null);
    const [auditStep, setAuditStep] = useState("idle"); // idle, scanning, results
    const [scanProgress, setScanProgress] = useState(0);
    const [scanLogs, setScanLogs] = useState([]);
    const [auditResult, setAuditResult] = useState(null);
    const [auditError, setAuditError] = useState("");

    // System health states
    const [systemHealth, setSystemHealth] = useState([]);
    const [loadingHealth, setLoadingHealth] = useState(false);

    // Fetch registered users for the overview dashboard
    useEffect(() => {
        if (!admin) return;

        const fetchUsers = async () => {
            setLoadingData(true);
            try {
                const response = await fetch(`${GW}/api/v1.0/users`);
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    console.error("Failed to load users");
                }
            } catch (err) {
                console.error("Error connecting to gateway:", err);
            } finally {
                setLoadingData(false);
            }
        };

        fetchUsers();
    }, [admin]);

    // Handle Admin Sign In
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginError("");
        setLoadingLogin(true);

        try {
            const response = await fetch(`${GW}/api/v1.0/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.role === "ADMIN") {
                    localStorage.setItem("adminUser", JSON.stringify(data));
                    setAdmin(data);
                } else {
                    setLoginError("Access Denied: You do not have administrator permissions.");
                }
            } else {
                const errorData = await response.json().catch(() => null);
                setLoginError(errorData ? errorData.message : "Incorrect email or password.");
            }
        } catch (err) {
            console.error("Login connection error:", err);
            setLoginError("Failed to connect to authentication server. Is the gateway running?");
        } finally {
            setLoadingLogin(false);
        }
    };

    // Handle Sign Out
    const handleLogout = () => {
        localStorage.removeItem("adminUser");
        setAdmin(null);
        setEmail("");
        setPassword("");
        setLoginError("");
    };

    // Fetch System Health status
    const fetchSystemHealth = async () => {
        setLoadingHealth(true);
        try {
            const response = await fetch(`${GW}/api/v1.0/verify/system-health`);
            if (response.ok) {
                const data = await response.json();
                setSystemHealth(data);
            }
        } catch (e) {
            console.error("System health fetch error:", e);
        } finally {
            setLoadingHealth(false);
        }
    };

    useEffect(() => {
        if (admin && activeTab === "system") {
            fetchSystemHealth();
        }
    }, [admin, activeTab]);

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
        setScanLogs(["[INFO] Uploaded document: " + file.name, "[INFO] Initializing document layout analysis..."]);
        
        let apiDone = false;
        let apiResult = null;
        let apiError = "";

        const formData = new FormData();
        formData.append("file", file);

        fetch(`${GW}/api/v1.0/verify/ai-audit`, {
            method: "POST",
            body: formData
        })
        .then(async (res) => {
            if (res.ok) {
                apiResult = await res.json();
            } else {
                const data = await res.json().catch(() => null);
                apiError = data?.message || "Failed to process AI audit. Verify layout structure and try again.";
            }
            apiDone = true;
        })
        .catch(err => {
            apiError = "Connection to verification service lost.";
            apiDone = true;
        });

        // Running OCR steps animation
        const steps = [
            { p: 15, msg: "[OCR] Format parsed successfully. Reading layout coordinates..." },
            { p: 35, msg: "[OCR] Running optical character recognition decoders..." },
            { p: 55, msg: "[ENTITY] Identifying recipient name, authority details, and issue date..." },
            { p: 75, msg: "[BLOCKCHAIN] Analyzing layout payload signature against on-chain block hash..." },
            { p: 90, msg: "[SECURITY] Contacting on-chain trie registry..." },
            { p: 100, msg: "[AUDIT] Calculations finalized. Compiling anomaly report..." }
        ];

        let currentProgress = 0;
        let stepIdx = 0;

        const interval = setInterval(() => {
            currentProgress += 5;
            if (currentProgress > 100) currentProgress = 100;
            setScanProgress(currentProgress);

            if (stepIdx < steps.length && currentProgress >= steps[stepIdx].p) {
                setScanLogs(prev => [...prev, steps[stepIdx].msg]);
                stepIdx++;
            }

            if (currentProgress >= 100 && apiDone) {
                clearInterval(interval);
                if (apiError) {
                    setAuditError(apiError);
                    setAuditStep("idle");
                    setAuditFile(null);
                } else {
                    setAuditResult(apiResult);
                    setAuditStep("results");
                }
            }
        }, 150);
    };

    // Render Login Page if not authenticated
    if (!admin) {
        return (
            <div className={styles.loginContainer}>
                <div className={styles.loginCard}>
                    <div className={styles.loginIcon}>
                        <FiShield />
                    </div>
                    <h2>Admin Console</h2>
                    <p className={styles.loginSubtitle}>
                        Authenticate with system administrator credentials to access dashboard logs.
                    </p>

                    {loginError && <div className={styles.loginErrorBox}>{loginError}</div>}

                    <form onSubmit={handleLoginSubmit}>
                        <div className={styles.inputGroup}>
                            <label>Admin Email</label>
                            <input
                                type="email"
                                placeholder="admin@credencify.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className={styles.loginButton} disabled={loadingLogin}>
                            {loadingLogin ? "Authenticating..." : "Sign In to Console"}
                        </button>
                    </form>

                    <div className={styles.backLink} onClick={() => navigate("/")}>
                        Return to Welcome Page
                    </div>
                </div>
            </div>
        );
    }

    // Render Admin Dashboard Console
    const stats = {
        total: users.length,
        institutions: users.filter(u => u.role === "INSTITUTION").length,
        learners: users.filter(u => u.role === "LEARNER").length,
        admins: users.filter(u => u.role === "ADMIN").length
    };

    return (
        <div className={styles.dashboardContainer}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div>
                    <div className={styles.sidebarBrand}>
                        <FiShield style={{ marginRight: "8px" }} /> Credencify Admin
                    </div>
                    <nav className={styles.sidebarMenu}>
                        <a 
                            className={`${styles.menuItem} ${activeTab === "overview" ? styles.menuItemActive : ""}`}
                            onClick={() => setActiveTab("overview")}
                        >
                            <FiUsers /> System Registry
                        </a>
                        <a 
                            className={`${styles.menuItem} ${activeTab === "ai-logs" ? styles.menuItemActive : ""}`}
                            onClick={() => setActiveTab("ai-logs")}
                        >
                            <FiCpu /> AI Verifier Engine
                        </a>
                        <a 
                            className={`${styles.menuItem} ${activeTab === "system" ? styles.menuItemActive : ""}`}
                            onClick={() => setActiveTab("system")}
                        >
                            <FiActivity /> System Health
                        </a>
                    </nav>
                </div>
                
                <div className={styles.sidebarUser}>
                    <span className={styles.userName}>{admin.fullName || "Administrator"}</span>
                    <span className={styles.userRole}>SYSTEM {admin.role}</span>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        <FiLogOut style={{ marginRight: "6px" }} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Panel */}
            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <div>
                        <h1>Console Control Room</h1>
                        <p>Real-time oversight of all microservices, blockchain hashing, and system records.</p>
                    </div>
                </header>

                {/* Metrics Cards */}
                <section className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statTitle}>Total Registered Accounts</div>
                        <div className={styles.statValue} style={{ color: "#1e5aa8" }}>{stats.total}</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statTitle}>Registered Academies</div>
                        <div className={styles.statValue} style={{ color: "#16a34a" }}>{stats.institutions}</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statTitle}>Active Learners</div>
                        <div className={styles.statValue} style={{ color: "#ca8a04" }}>{stats.learners}</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statTitle}>System Admins</div>
                        <div className={styles.statValue} style={{ color: "#dc2626" }}>{stats.admins}</div>
                    </div>
                </section>

                {/* Conditional tab rendering */}
                <section className={styles.sectionCard}>
                    {activeTab === "overview" && (
                        <>
                            <div className={styles.sectionTitle}>System Users Registry</div>
                            {loadingData ? <p>Loading accounts...</p> : (
                                <div className={styles.tableWrapper}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>User ID / Learner ID</th>
                                                <th>Name</th>
                                                <th>Email Address</th>
                                                <th>Role</th>
                                                <th>Verification Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" style={{ textAlign: "center", color: "#64748b", padding: "30px 10px" }}>
                                                        No registered users found in database.
                                                    </td>
                                                </tr>
                                            ) : (
                                                users.map((sysUser) => (
                                                    <tr key={sysUser.id}>
                                                        <td style={{ fontWeight: "600", color: "#1e293b" }}>{sysUser.userId}</td>
                                                        <td>{sysUser.fullName}</td>
                                                        <td>{sysUser.email}</td>
                                                        <td>
                                                            <span className={`${styles.badge} ${
                                                                sysUser.role === "ADMIN" ? styles.badgeAdmin :
                                                                sysUser.role === "INSTITUTION" ? styles.badgeInst : styles.badgeLearner
                                                            }`}>{sysUser.role}</span>
                                                        </td>
                                                        <td>
                                                            <span className={`${styles.badge} ${styles.badgeActive}`}>ACTIVE</span>
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

                    {activeTab === "ai-logs" && (
                        <div className={styles.aiAuditSection}>
                            <div className={styles.sectionHeader}>
                                <h3 className={styles.sectionTitle}>AI Credential Auditor Console</h3>
                                <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 16px 0" }}>
                                    Cross-audit physical and digital files against secure on-chain registers.
                                </p>
                            </div>

                            {/* IDLE: Upload Zone */}
                            {auditStep === "idle" && (
                                <div className={styles.uploadZone} onClick={() => document.getElementById("ai-file-upload").click()}>
                                    <input
                                        type="file"
                                        id="ai-file-upload"
                                        onChange={handleFileChange}
                                        accept=".pdf,.png,.jpg,.jpeg"
                                        style={{ display: "none" }}
                                    />
                                    <FiCpu className={styles.uploadIcon} />
                                    <h4>Verify Document Authenticity</h4>
                                    <p>Select or drag and drop your certificate document (PDF, PNG, JPG)</p>
                                    <span className={styles.uploadBtn}>Upload Certificate</span>
                                </div>
                            )}

                            {/* SCANNING: Scanning View */}
                            {auditStep === "scanning" && (
                                <div className={styles.scanningScreen}>
                                    <div className={styles.radarWrapper}>
                                        <div className={styles.radarScanLine}></div>
                                        <FiCpu className={styles.radarIcon} />
                                    </div>
                                    <h4>AI Engine Analyzing Document...</h4>
                                    
                                    <div className={styles.progressBarBg}>
                                        <div className={styles.progressBarFill} style={{ width: `${scanProgress}%` }}></div>
                                    </div>
                                    <div style={{ textAlign: "right", fontSize: "12px", color: "#64748b", margin: "4px 0 15px 0" }}>
                                        {scanProgress}% Processed
                                    </div>

                                    <div className={styles.terminalLogs}>
                                        {scanLogs.map((log, idx) => (
                                            <div key={idx} className={styles.terminalRow}>{log}</div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* RESULTS: Score and Comparison */}
                            {auditStep === "results" && auditResult && (
                                <div className={styles.resultsScreen}>
                                    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                                        {/* Score Widget */}
                                        <div className={styles.scoreWidget}>
                                            <div className={styles.scoreRing} style={{
                                                borderColor: auditResult.matchScore === 100 ? "#16a34a" : auditResult.matchScore >= 70 ? "#ca8a04" : "#dc2626"
                                            }}>
                                                <span>{auditResult.matchScore}%</span>
                                                <small>Match Score</small>
                                            </div>
                                            <h4 style={{ margin: "16px 0 6px 0" }}>
                                                {auditResult.matchScore === 100 ? "Verified Authentic" : auditResult.matchScore >= 70 ? "Verification Warning" : "Suspected Tampering"}
                                            </h4>
                                            <p style={{ fontSize: "12px", color: "#64748b", margin: 0, textAlign: "center" }}>
                                                {auditResult.matchScore === 100 ? "Document matches on-chain cryptographic registers exactly." : "Discrepancy detected between layout text and ledger registry."}
                                            </p>
                                        </div>

                                        {/* Comparison Table */}
                                        <div style={{ flex: 1, minWidth: "300px" }}>
                                            <h4 style={{ margin: "0 0 12px 0", color: "#1e293b" }}>OCR Ledger Comparison</h4>
                                            <div className={styles.tableWrapper}>
                                                <table className={styles.table}>
                                                    <thead>
                                                        <tr>
                                                            <th>Field</th>
                                                            <th>Extracted (OCR)</th>
                                                            <th>On-Chain Registry</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td><strong>Certificate ID</strong></td>
                                                            <td><code style={{ color: "#2563eb" }}>{auditResult.certificateId}</code></td>
                                                            <td><code style={{ color: "#2563eb" }}>{auditResult.certificateId}</code></td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Learner Name</strong></td>
                                                            <td style={{ color: auditResult.comparisons.learnerName_extracted !== auditResult.comparisons.learnerName_registered ? "#dc2626" : "inherit" }}>
                                                                {auditResult.comparisons.learnerName_extracted}
                                                            </td>
                                                            <td>{auditResult.comparisons.learnerName_registered}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Program Title</strong></td>
                                                            <td style={{ color: auditResult.comparisons.courseName_extracted !== auditResult.comparisons.courseName_registered ? "#dc2626" : "inherit" }}>
                                                                {auditResult.comparisons.courseName_extracted}
                                                            </td>
                                                            <td>{auditResult.comparisons.courseName_registered}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Issuing Academy</strong></td>
                                                            <td style={{ color: auditResult.comparisons.institutionName_extracted !== auditResult.comparisons.institutionName_registered ? "#ca8a04" : "inherit" }}>
                                                                {auditResult.comparisons.institutionName_extracted}
                                                            </td>
                                                            <td>{auditResult.comparisons.institutionName_registered}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Ledger Status</strong></td>
                                                            <td>
                                                                <span className={auditResult.status === "REVOKED" ? styles.badgeAdmin : styles.badgeActive}>
                                                                    {auditResult.status}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className={auditResult.status === "REVOKED" ? styles.badgeAdmin : styles.badgeActive}>
                                                                    {auditResult.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Anomaly Logs Console */}
                                    <div style={{ marginTop: "24px" }}>
                                        <h4 style={{ margin: "0 0 10px 0" }}>Security Audits Logs</h4>
                                        <div className={styles.terminalLogs}>
                                            {auditResult.anomalies.map((anomaly, idx) => (
                                                <div key={idx} className={styles.terminalRow} style={{
                                                    color: anomaly.includes("CRITICAL") ? "#fca5a5" : anomaly.includes("WARNING") ? "#fef08a" : "#bbf7d0"
                                                }}>{anomaly}</div>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                                        <button className={styles.loginButton} style={{ width: "auto", padding: "10px 24px" }}
                                            onClick={() => { setAuditStep("idle"); setAuditFile(null); setAuditResult(null); }}>
                                            Audit Another Document
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "system" && (
                        <div className={styles.systemHealthSection}>
                            <div className={styles.sectionHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                <div>
                                    <h3 className={styles.sectionTitle}>System Telemetry Monitors</h3>
                                    <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>Live health-check connection status of all network nodes.</p>
                                </div>
                                <button className={styles.loginButton} style={{ width: "auto", padding: "6px 14px", fontSize: "13px" }} onClick={fetchSystemHealth} disabled={loadingHealth}>
                                    {loadingHealth ? "Refreshing..." : "Refresh Status"}
                                </button>
                            </div>

                            {loadingHealth ? (
                                <p style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Querying telemetry nodes...</p>
                            ) : (
                                <div className={styles.healthGrid}>
                                    {systemHealth.map((node, index) => (
                                        <div key={index} className={styles.healthCard}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <span className={styles.nodeName}>{node.name}</span>
                                                <span className={`${styles.statusDot} ${node.status === "Healthy" ? styles.statusDotGreen : styles.statusDotRed}`}></span>
                                            </div>
                                            <div className={styles.nodeDetails}>
                                                Status: <strong style={{ color: node.status === "Healthy" ? "#16a34a" : "#dc2626" }}>{node.status}</strong>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}