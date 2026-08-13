import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiHome, FiSearch, FiPlusCircle, FiSettings } from "react-icons/fi";
import NavBar from "../../components/Navbar/Navbar";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const navigate = useNavigate();

  // Temporary mock logged-in user. You can toggle role to see different dashboards!
  const [user, setUser] = useState({
    name: "Harvard University",
    email: "admin@harvard.edu",
    role: "INSTITUTION", // Can be: 'INSTITUTION', 'LEARNER', 'VERIFIER'
  });

  // State to hold fetched certificates/logs
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stats derived from data
  const [stats, setStats] = useState({
    total: 0,
    issued: 0,
    revoked: 0,
    failed: 0,
  });

  // Mock API fetch simulation for learning
  useEffect(() => {
    setLoading(true);
    // Simulating API call: GET /api/certificates
    setTimeout(() => {
      // Clear fake data to show empty states during development
      let dataList = [];
      setCertificates(dataList);
      
      setStats({
        total: 0,
        issued: 0,
        revoked: 0,
        failed: 0,
      });
      setLoading(false);
    }, 400);
  }, [user.role]);

  // Handle mock role toggling for testing
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    let name = "Harvard University";
    let email = "admin@harvard.edu";
    
    if (selectedRole === "LEARNER") {
      name = "Alex Rivera";
      email = "alex.rivera@example.com";
    } else if (selectedRole === "VERIFIER") {
      name = "Google Recruiting";
      email = "hr@google.com";
    }

    setUser({
      role: selectedRole,
      name: name,
      email: email,
    });
  };

  return (
    <>
      <NavBar />
      <div className={styles.dashboardContainer}>
        
        {/* Sidebar Nav */}
        <aside className={styles.sidebar}>
          <div>
            <div className={styles.sidebarBrand}>Credencify Dashboard</div>
            <nav className={styles.sidebarMenu}>
              <a className={`${styles.menuItem} ${styles.menuItemActive}`}>
                <FiHome /> Overview
              </a>
              <a className={styles.menuItem} onClick={() => navigate("/mod/verify")}>
                <FiSearch /> Verify Portal
              </a>
              {user.role === "INSTITUTION" && (
                <a className={styles.menuItem} onClick={() => navigate("/mod/institution")}>
                  <FiPlusCircle /> Issue Credential
                </a>
              )}
              <a className={styles.menuItem}>
                <FiSettings /> Settings
              </a>
            </nav>
          </div>
          
          <div className={styles.sidebarUser}>
            <span className={styles.userName}>{user.name}</span>
            <span className={styles.userRole}>{user.role}</span>
          </div>
        </aside>

        {/* Main Panel */}
        <main className={styles.mainContent}>
          
          <header className={styles.header}>
            <div>
              <h1>Welcome back, {user.name}!</h1>
              <p>Here is your portal status for today.</p>
            </div>
            
            {/* Hackathon Role Switcher */}
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Test View Role:</span>
              <select 
                value={user.role} 
                onChange={handleRoleChange}
                style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
              >
                <option value="INSTITUTION">Institution Dashboard</option>
                <option value="LEARNER">Learner Dashboard</option>
                <option value="VERIFIER">Verifier Dashboard</option>
              </select>
            </div>
          </header>

          {/* Stats Widgets */}
          <section className={styles.statsGrid}>
            {user.role === "INSTITUTION" && (
              <>
                <div className={styles.statCard}>
                  <div className={styles.statTitle}>Total Issued</div>
                  <div className={styles.statValue}>{stats.total}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statTitle}>Success (Active)</div>
                  <div className={styles.statValue} style={{ color: "#16a34a" }}>{stats.issued}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statTitle}>Revoked</div>
                  <div className={styles.statValue} style={{ color: "#dc2626" }}>{stats.revoked}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statTitle}>Failures</div>
                  <div className={styles.statValue} style={{ color: "#4b5563" }}>{stats.failed}</div>
                </div>
              </>
            )}

            {user.role === "LEARNER" && (
              <>
                <div className={styles.statCard}>
                  <div className={styles.statTitle}>Verified Credentials Owned</div>
                  <div className={styles.statValue} style={{ color: "#2563eb" }}>{stats.total}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statTitle}>Issuing Organizations</div>
                  <div className={styles.statValue}>2</div>
                </div>
              </>
            )}

            {user.role === "VERIFIER" && (
              <>
                <div className={styles.statCard}>
                  <div className={styles.statTitle}>Total Requests Processed</div>
                  <div className={styles.statValue}>{stats.total}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statTitle}>Valid Certificates Found</div>
                  <div className={styles.statValue} style={{ color: "#16a34a" }}>{stats.issued}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statTitle}>Mismatches Flagged</div>
                  <div className={styles.statValue} style={{ color: "#dc2626" }}>{stats.revoked}</div>
                </div>
              </>
            )}
          </section>

          {/* Recently Actions Table */}
          <section className={styles.sectionCard}>
            {user.role === "INSTITUTION" && (
              <>
                <div className={styles.sectionTitle}>Recently Issued Credentials</div>
                {loading ? <p>Loading data...</p> : (
                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Learner Name</th>
                          <th>Course Name</th>
                          <th>Blockchain Hash</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {certificates.length === 0 ? (
                          <tr>
                            <td colSpan="6" style={{ textAlign: "center", color: "#64748b", padding: "30px 10px" }}>
                              No credentials issued yet.
                            </td>
                          </tr>
                        ) : (
                          certificates.map(cert => (
                            <tr key={cert.id}>
                              <td>{cert.id}</td>
                              <td>{cert.learnerName}</td>
                              <td>{cert.courseName}</td>
                              <td className={styles.hashCell}>{cert.hash}</td>
                              <td>
                                <span className={`${styles.badge} ${
                                  cert.status === "ISSUED" ? styles.badgeIssued :
                                  cert.status === "REVOKED" ? styles.badgeRevoked :
                                  cert.status === "PENDING" ? styles.badgePending : styles.badgeFailed
                                }`}>{cert.status}</span>
                              </td>
                              <td>{cert.date}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {user.role === "LEARNER" && (
              <>
                <div className={styles.sectionTitle}>My Verified Credentials</div>
                {loading ? <p>Loading credentials...</p> : (
                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Credential ID</th>
                          <th>Issuer</th>
                          <th>Course Title</th>
                          <th>Blockchain Hash</th>
                          <th>Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {certificates.length === 0 ? (
                          <tr>
                            <td colSpan="6" style={{ textAlign: "center", color: "#64748b", padding: "30px 10px" }}>
                              No verified credentials owned.
                            </td>
                          </tr>
                        ) : (
                          certificates.map(cert => (
                            <tr key={cert.id}>
                              <td>{cert.id}</td>
                              <td>{cert.institutionName}</td>
                              <td>{cert.courseName}</td>
                              <td className={styles.hashCell}>{cert.hash}</td>
                              <td>{cert.date}</td>
                              <td>
                                <button 
                                  className={styles.actionBtn} 
                                  style={{ padding: "6px 12px", fontSize: "12px" }}
                                  onClick={() => navigate(`/mod/verify`)}
                                >
                                  View Live Verification
                                </button>
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

            {user.role === "VERIFIER" && (
              <>
                <div className={styles.sectionTitle}>Verification Logs</div>
                {loading ? <p>Loading logs...</p> : (
                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Target ID</th>
                          <th>Checked By</th>
                          <th>Result</th>
                          <th>Remarks</th>
                          <th>Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {certificates.length === 0 ? (
                          <tr>
                            <td colSpan="5" style={{ textAlign: "center", color: "#64748b", padding: "30px 10px" }}>
                              No verification checks performed yet.
                            </td>
                          </tr>
                        ) : (
                          certificates.map((log, idx) => (
                            <tr key={idx}>
                              <td>{log.id}</td>
                              <td>{log.verifierOrg}</td>
                              <td>
                                <span className={`${styles.badge} ${
                                  log.status === "VERIFIED" ? styles.badgeIssued : styles.badgeRevoked
                                }`}>{log.status}</span>
                              </td>
                              <td>{log.remarks}</td>
                              <td>{log.date}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </section>

        </main>
      </div>
    </>
  );
}

export default Dashboard;
