import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiHome, FiLogOut, FiUsers, FiFileText, FiCheckCircle,
  FiAlertTriangle, FiSettings, FiActivity, FiCalendar,
  FiChevronDown, FiArrowUpRight, FiBell, FiRefreshCw
} from "react-icons/fi";
import { FaShieldAlt, FaUniversity, FaTimesCircle } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";
import { BsBarChartLine } from "react-icons/bs";
import s from "./AdminDashboard.module.css";

const GW = "http://" + window.location.hostname + ":9000";

/* ─── Sidebar nav ─── */
const NAV = [
  { id: "dashboard",     icon: <FiHome />,           label: "Dashboard"        },
  { id: "institutions",  icon: <FaUniversity />,     label: "Institutions"     },
  { id: "users",         icon: <FiUsers />,          label: "Users"            },
  { id: "certificates",  icon: <FiFileText />,       label: "Certificates"     },
  { id: "verifications", icon: <FiCheckCircle />,    label: "Verifications"    },
  { id: "mismatches",    icon: <FiAlertTriangle />,  label: "Mismatch Reports" },
  { id: "revocations",   icon: <FaTimesCircle />,    label: "Revocations"      },
  { id: "analytics",     icon: <BsBarChartLine />,   label: "Analytics"        },
  { id: "audit",         icon: <FiActivity />,       label: "Audit Logs"       },
  { id: "health",        icon: <MdOutlineSecurity />,label: "System Health"    },
  { id: "settings",      icon: <FiSettings />,       label: "Settings"         },
];

/* ─── SVG chart helpers ─── */
const CHART_PTS = [
  [55,168],[85,162],[110,148],[140,153],[168,140],[198,133],
  [228,125],[258,130],[290,116],[320,110],[350,103],[380,96],[412,82],[444,56],
];
function polyline(pts)  { return pts.map(p => p.join(",")).join(" "); }
function areaPath(pts)  {
  return `M ${pts[0][0]},${pts[0][1]} ` +
    pts.slice(1).map(p=>`L ${p[0]},${p[1]}`).join(" ") +
    ` L ${pts[pts.length-1][0]},160 L ${pts[0][0]},160 Z`;
}

/* ─── Donut segments ─── */
const DONUT_COLORS = ["#22c55e","#3b82f6","#f59e0b","#a855f7"];

function buildDonut(valid, invalid, pending, revoked) {
  const total = valid + invalid + pending + revoked || 1;
  const circ  = 376;
  const vals  = [valid, invalid, pending, revoked];
  let offset  = 0;
  return vals.map((v, i) => {
    const dash   = Math.round((v / total) * circ);
    const seg    = { color: DONUT_COLORS[i], dash, offset: -offset };
    offset += dash;
    return seg;
  });
}

/* ─── Status badge ─── */
function StatusBadge({ status }) {
  const cls = status === "ISSUED"    ? s.tagIssued
            : status === "OPEN"      ? s.tagOpen
            : status === "IN REVIEW" ? s.tagReview
            : status === "REVOKED"   ? s.tagRevoked
            :                          s.tagResolved;
  return <span className={cls}>{status}</span>;
}

/* ─── Under-development placeholder ─── */
function UnderDev({ title }) {
  return (
    <div className={s.underDev}>
      <div className={s.underDevIcon}>🚧</div>
      <h3>{title}</h3>
      <p>This section is currently under development and will be available soon.</p>
      <span className={s.underDevBadge}>Coming Soon</span>
    </div>
  );
}

/* ─── Loading spinner ─── */
function Spinner() {
  return <div className={s.spinner}><div className={s.spinnerRing}/></div>;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState("dashboard");
  const [ddOpen, setDdOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = (user.fullName || "AU").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);

  /* ── State: dashboard overview ── */
  const [loading, setLoading]                 = useState(true);
  const [statsData, setStatsData]             = useState(null);
  const [certOverview, setCertOverview]       = useState(null);
  const [recentCerts, setRecentCerts]         = useState([]);
  const [topInstitutions, setTopInstitutions] = useState([]);
  const [healthList, setHealthList]           = useState([]);
  const [chartData, setChartData]             = useState([]);
  const [fetchErrors, setFetchErrors]         = useState([]);   // track which endpoints failed

  /* ── State: sub-views ── */
  const [allUsers, setAllUsers]               = useState([]);
  const [allCerts, setAllCerts]               = useState([]);
  const [revokedCerts, setRevokedCerts]       = useState([]);
  const [subLoading, setSubLoading]           = useState(false);
  const [subError, setSubError]               = useState("");

  /* ── State: Institution details & Audit logs ── */
  const [selectedInst, setSelectedInst]       = useState(null);
  const [instCerts, setInstCerts]             = useState([]);
  const [loadingInstCerts, setLoadingInstCerts] = useState(false);
  const [verificationLogs, setVerificationLogs] = useState([]);
  const [aiAuditLogs, setAiAuditLogs]         = useState([]);

  /* ── Fetch dashboard overview data ── */
  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    const errors = [];
    try {
      const [statsRes, overviewRes, recentRes, topRes, healthRes, chartRes] = await Promise.allSettled([
        fetch(`${GW}/api/v1.0/admin/stats`),
        fetch(`${GW}/api/certificates/admin/overview`),
        fetch(`${GW}/api/certificates/admin/recent`),
        fetch(`${GW}/api/certificates/admin/top-institutions`),
        fetch(`${GW}/api/v1.0/verify/system-health`),
        fetch(`${GW}/api/certificates/admin/chart-data`),
      ]);

      if (statsRes.status === "fulfilled" && statsRes.value.ok)
        setStatsData(await statsRes.value.json());
      else errors.push("Auth Service (admin/stats)");

      if (overviewRes.status === "fulfilled" && overviewRes.value.ok)
        setCertOverview(await overviewRes.value.json());
      else errors.push("Credential Service (admin/overview)");

      if (recentRes.status === "fulfilled" && recentRes.value.ok)
        setRecentCerts(await recentRes.value.json());
      else errors.push("Credential Service (admin/recent)");

      if (topRes.status === "fulfilled" && topRes.value.ok)
        setTopInstitutions(await topRes.value.json());
      else errors.push("Credential Service (top-institutions)");

      if (healthRes.status === "fulfilled" && healthRes.value.ok)
        setHealthList(await healthRes.value.json());
      else errors.push("Verification Service (system-health)");

      if (chartRes.status === "fulfilled" && chartRes.value.ok)
        setChartData(await chartRes.value.json());
      else errors.push("Credential Service (chart-data)");

    } catch(e) { console.error("Dashboard fetch error:", e); }
    finally {
      setFetchErrors(errors);
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  /* ── Fetch sub-view data when sidebar tab changes ── */
  const handleInstClick = async (inst) => {
    setSelectedInst(inst);
    setLoadingInstCerts(true);
    setInstCerts([]);
    try {
      const res = await fetch(`${GW}/api/certificates/institution/${inst.userId}`);
      if (res.ok) {
        setInstCerts(await res.json());
      } else {
        console.error("Failed to load institution certificates");
      }
    } catch (e) {
      console.error("Error loading institution certificates:", e);
    } finally {
      setLoadingInstCerts(false);
    }
  };

  useEffect(() => {
    const fetchSubView = async () => {
      setSubLoading(true);
      setSubError("");
      try {
        if (active === "users" || active === "institutions") {
          const r = await fetch(`${GW}/api/v1.0/users`);
          if (r.ok) setAllUsers(await r.json());
          else setSubError(`HTTP ${r.status} — Auth service may need restarting.`);
        }
        if (active === "certificates") {
          const r = await fetch(`${GW}/api/certificates/admin/all`);
          if (r.ok) setAllCerts(await r.json());
          else setSubError(`HTTP ${r.status} — Credential service may need restarting (new endpoints require restart).`);
        }
        if (active === "revocations") {
          const r = await fetch(`${GW}/api/certificates/admin/revoked`);
          if (r.ok) setRevokedCerts(await r.json());
          else setSubError(`HTTP ${r.status} — Credential service may need restarting.`);
        }
        if (active === "audit" || active === "verifications" || active === "mismatches") {
          const [vRes, aRes] = await Promise.all([
            fetch(`${GW}/api/v1.0/verify/logs`),
            fetch(`${GW}/api/v1.0/verify/audit-logs`)
          ]);
          if (vRes.ok && aRes.ok) {
            setVerificationLogs(await vRes.json());
            setAiAuditLogs(await aRes.json());
          } else {
            setSubError("Failed to fetch verification or audit logs. Verify the verification-service status.");
          }
        }
      } catch(e) {
        setSubError(`Cannot connect to gateway (${GW}). Ensure all services are running.`);
        console.error("Sub-view fetch error:", e);
      } finally { setSubLoading(false); }
    };

    if (active !== "dashboard") fetchSubView();
  }, [active]);

  function logout() {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  }

  /* ── Derived stats ── */
  const institutions   = statsData?.institutionsCount ?? 0;
  const certsIssued    = certOverview?.certificatesIssued ?? 0;
  const certsRevoked   = certOverview?.revokedCertificates ?? 0;
  const totalVerifs    = 0; // no verification log table yet
  const mismatchCount  = 0;

  /* ── Donut ── */
  const donutSegs = buildDonut(
    certOverview?.certificatesActive ?? 0,
    0, 0,
    certOverview?.revokedCertificates ?? 0
  );
  const totalDonut = (certOverview?.certificatesActive ?? 0) + (certOverview?.revokedCertificates ?? 0);

  /* ── Top institution max ── */
  const maxCount = topInstitutions.length > 0 ? (topInstitutions[0].count || 1) : 1;

  /* ── Dynamic Area Chart Points ── */
  const chartMax = chartData.length > 0 ? Math.max(...chartData.map(d => d.count), 0) : 10;
  const graphMax = chartMax > 0 ? chartMax : 10;

  // Format Y-axis labels dynamically
  const yLabels = [
    { text: String(graphMax), y: 25 },
    { text: String(Math.round(graphMax * 0.75)), y: 58.75 },
    { text: String(Math.round(graphMax * 0.5)), y: 92.5 },
    { text: String(Math.round(graphMax * 0.25)), y: 126.25 },
    { text: "0", y: 160 }
  ];

  // Dynamic Chart Points (Last 14 Days)
  const displayChartData = chartData.length > 0 ? chartData : Array.from({ length: 14 }, (_, i) => ({ date: `Day ${i+1}`, count: 0 }));
  const chartPts = displayChartData.map((d, i) => {
    const x = 45 + (i / (displayChartData.length - 1 || 1)) * 445;
    const y = 160 - (d.count / graphMax) * 135;
    return [x, y];
  });

  // Pick ticks for X-axis dynamically to avoid crowding
  const xLabels = [];
  if (displayChartData.length > 0) {
    const step = Math.max(1, Math.floor(displayChartData.length / 4));
    for (let i = 0; i < displayChartData.length; i += step) {
      if (xLabels.length < 5) {
        xLabels.push({
          text: displayChartData[i].date,
          x: 45 + (i / (displayChartData.length - 1 || 1)) * 445
        });
      }
    }
    // Make sure the last day is always displayed as the final label
    if (xLabels.length > 0 && xLabels[xLabels.length - 1].text !== displayChartData[displayChartData.length - 1].date) {
      xLabels[xLabels.length - 1] = {
        text: displayChartData[displayChartData.length - 1].date,
        x: 490
      };
    }
  }

  const institutionUsers = allUsers.filter(u => u.role === "INSTITUTION");

  return (
    <div className={s.shell}>

      {/* ══ TOP NAVBAR ══ */}
      <header className={s.topbar}>
        <Link to="/" className={s.topbarLogo}>Credencify</Link>
        <nav className={s.topbarNav}>
          <Link to="/"       className={s.navLink}>Home</Link>
          <Link to="/contact" className={s.navLink}>Contact</Link>
          <Link to="/verify"  className={s.navLink}>Verify Credential</Link>
          <Link to="/about"   className={s.navLink}>About us</Link>
        </nav>
        <div className={s.topbarRight}>
          <div className={s.bellWrap} onClick={() => setNotifOpen(v => !v)}>
            <FiBell className={s.bellIcon} />
            <span className={s.bellBadge}>0</span>
          </div>

          {notifOpen && (
            <div className={s.notifDropdown}>
              <div className={s.notifTitle}>Notifications</div>
              <div className={s.notifEmpty}>
                No new notifications.<br />System security alerts and audit notifications will be displayed here.
              </div>
            </div>
          )}
          <div className={s.profilePill} onClick={() => setDdOpen(v=>!v)}>
            <div className={s.avatar}>{initials}</div>
            <div className={s.userText}>
              <span className={s.userName}>Admin User</span>
              <span className={s.userSub}>Super Admin</span>
            </div>
            <FiChevronDown className={s.chevron} />
          </div>
          {ddOpen && (
            <div className={s.dropdown}>
              <div className={s.ddHeader}>
                <div className={s.ddAvatar}>{initials}</div>
                <div>
                  <div className={s.ddName}>{user.fullName || "Admin User"}</div>
                  <div className={s.ddEmail}>{user.email || "admin@credencify.com"}</div>
                </div>
              </div>
              <div className={s.ddDivider}/>
              <button className={`${s.ddItem} ${active==="dashboard"?s.ddItemActive:""}`} onClick={()=>{setActive("dashboard");setDdOpen(false);}}>
                <FiHome/> Dashboard
              </button>
              <button className={s.ddItem} onClick={()=>{setActive("settings");setDdOpen(false);}}>
                <FiSettings/> Settings
              </button>
              <div className={s.ddDivider}/>
              <button className={`${s.ddItem} ${s.ddLogout}`} onClick={logout}>
                <FiLogOut/> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ══ BODY ══ */}
      <div className={s.body}>

        {/* ── SIDEBAR ── */}
        <aside className={s.sidebar}>
          <div className={s.sideTop}>
            <p className={s.sideLabel}>ADMIN PANEL</p>
            <nav className={s.sideNav}>
              {NAV.map(n => (
                <button key={n.id}
                  className={`${s.sideItem} ${active===n.id?s.sideItemActive:""}`}
                  onClick={()=>setActive(n.id)}>
                  <span className={s.sideIcon}>{n.icon}</span>
                  {n.label}
                </button>
              ))}
            </nav>
          </div>
          <div className={s.sideBottom}>
            <div className={s.promoCard}>
              <div className={s.promoIcon}><FaShieldAlt /></div>
              <p className={s.promoTitle}>Secure. Transparent. Trusted.</p>
              <p className={s.promoSub}>Blockchain backed credential ecosystem.</p>
            </div>
            <button className={s.logoutBtn} onClick={logout}>
              <FiLogOut/> Logout
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className={s.main}>

          {/* ════ DASHBOARD VIEW ════ */}
          {active === "dashboard" && (
            <>
              <div className={s.pageHead}>
                <div>
                  <h1 className={s.pageTitle}>Admin Dashboard</h1>
                  <p className={s.pageSub}>Welcome back, Admin! Here's what's happening with Credencify.</p>
                </div>
                <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
                  <button className={s.refreshBtn} onClick={fetchDashboard} title="Refresh data">
                    <FiRefreshCw size={14}/> Refresh
                  </button>
                  <button className={s.dateBtn}>
                    <FiCalendar size={14}/>
                    Live Data
                    <FiChevronDown size={13}/>
                  </button>
                </div>
              </div>

              {loading ? <Spinner /> : (
                <>
                  {/* SERVICE CONNECTIVITY BANNER */}
                  {fetchErrors.length > 0 && (
                    <div className={s.errorBanner}>
                      <div className={s.errorBannerIcon}>⚠️</div>
                      <div className={s.errorBannerBody}>
                        <strong>Some services are unreachable or need restarting:</strong>
                        <ul className={s.errorList}>
                          {fetchErrors.map((e,i) => <li key={i}>{e}</li>)}
                        </ul>
                        <p>
                          <b>Why certificates may not show:</b> New API endpoints were added to credential-service.
                          You must <b>restart credential-service</b> for them to load.
                          After restart, click <b>Refresh</b> above.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* STAT CARDS */}
                  <div className={s.statRow}>
                    <StatCard icon={<FaUniversity/>} iconCls={s.icBlue}
                      label="Institutions" value={institutions.toLocaleString()}
                      delta={`${institutions}`} sub="Total Registered" />
                    <StatCard icon={<FiFileText/>} iconCls={s.icGreen}
                      label="Certificates Issued" value={Number(certsIssued).toLocaleString()}
                      delta={`${certsIssued} total`} sub="All Time" />
                    <StatCard icon={<FiCheckCircle/>} iconCls={s.icSky}
                      label="Verifications" value={totalVerifs.toLocaleString()}
                      delta="Real-time" sub="This Month" />
                    <StatCard icon={<FiAlertTriangle/>} iconCls={s.icAmber}
                      label="Mismatch Reports" value={mismatchCount.toLocaleString()}
                      delta="Reported" sub="This Month" />
                    <StatCard icon={<FaTimesCircle/>} iconCls={s.icPurple}
                      label="Revoked Certificates" value={Number(certsRevoked).toLocaleString()}
                      delta={`${certsRevoked} revoked`} sub="Total Revoked" />
                  </div>

                  {/* MIDDLE ROW */}
                  <div className={s.midRow}>
                    {/* Area Chart */}
                    <div className={s.card} style={{flex:"2 1 0"}}>
                      <div className={s.cardHead}>
                        <span className={s.cardTitle}>Certificates Issued Overview</span>
                        <select className={s.filterSel}>
                          <option>This Month</option>
                          <option>Last Month</option>
                          <option>This Year</option>
                        </select>
                      </div>
                      <svg viewBox="0 0 500 185" className={s.areaChart}>
                        <defs>
                          <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%"   stopColor="#3b82f6" stopOpacity="0.28"/>
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.01"/>
                          </linearGradient>
                        </defs>
                        {[25,58.75,92.5,126.25,160].map((y, idx)=>(
                          <line key={idx} x1="45" y1={y} x2="490" y2={y} stroke="#f1f5f9" strokeDasharray="3 3"/>
                        ))}
                        <line x1="45" y1="160" x2="490" y2="160" stroke="#e2e8f0"/>
                        {yLabels.map((lbl, idx) => (
                          <text key={idx} x="40" y={lbl.y + 4} textAnchor="end" className={s.axisText}>{lbl.text}</text>
                        ))}
                        {xLabels.map((lbl, idx) => (
                          <text key={idx} x={lbl.x} y="178" textAnchor="middle" className={s.axisText}>{lbl.text}</text>
                        ))}
                        <path d={areaPath(chartPts)} fill="url(#ag)"/>
                        <polyline points={polyline(chartPts)} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
                        {chartPts.map(([cx,cy],i)=>(
                          <circle key={i} cx={cx} cy={cy}
                            r={i===chartPts.length-1?5:3.5}
                            fill="#2563eb" stroke="#fff"
                            strokeWidth={i===chartPts.length-1?2:1.5}/>
                        ))}
                      </svg>
                    </div>

                    {/* Donut */}
                    <div className={s.card} style={{flex:"1.4 1 0"}}>
                      <div className={s.cardHead}>
                        <span className={s.cardTitle}>Certificate Summary</span>
                      </div>
                      <div className={s.donutRow}>
                        <div className={s.donutWrap}>
                          <svg viewBox="0 0 160 160" className={s.donutSvg}>
                            {totalDonut === 0 ? (
                              <circle cx="80" cy="80" r="60" fill="none" stroke="#e2e8f0" strokeWidth="22"/>
                            ) : donutSegs.map((d,i)=>(
                              <circle key={i} cx="80" cy="80" r="60" fill="none"
                                stroke={d.color} strokeWidth="22"
                                strokeDasharray={`${d.dash} ${376-d.dash}`}
                                strokeDashoffset={d.offset}
                                style={{transform:"rotate(-90deg)",transformOrigin:"80px 80px"}}/>
                            ))}
                          </svg>
                          <div className={s.donutCenter}>
                            <span className={s.donutNum}>{totalDonut.toLocaleString()}</span>
                            <span className={s.donutSub}>Total</span>
                          </div>
                        </div>
                        <div className={s.donutLegend}>
                          {[
                            {label:"Issued",  val:certOverview?.certificatesActive??0, color:DONUT_COLORS[0]},
                            {label:"Revoked", val:certOverview?.revokedCertificates??0, color:DONUT_COLORS[3]},
                          ].map((d,i)=>(
                            <div key={i} className={s.legendRow}>
                              <span className={s.legendDot} style={{background:d.color}}/>
                              <span className={s.legendLabel}>{d.label}</span>
                              <span className={s.legendVal}>
                                {Number(d.val).toLocaleString()}
                                {totalDonut>0?` (${Math.round(d.val/totalDonut*100)}%)`:""}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* System Health */}
                    <div className={s.card} style={{flex:"1 1 0"}}>
                      <div className={s.cardHead}>
                        <span className={s.cardTitle}>System Health</span>
                      </div>
                      <div className={s.healthList}>
                        {healthList.map(h=>(
                          <div key={h.name} className={s.healthRow}>
                            <span className={s.healthName}>{h.name}</span>
                            <span className={`${s.healthBadge} ${h.status==="Healthy"?s.healthGreen:s.healthRed}`}>
                              <span className={s.greenDot}>●</span> {h.status}
                            </span>
                          </div>
                        ))}
                      </div>
                      <button className={s.viewHealthBtn} onClick={()=>setActive("health")}>
                        📊 View System Health &nbsp;→
                      </button>
                    </div>
                  </div>

                  {/* BOTTOM ROW */}
                  <div className={s.botRow}>
                    {/* Recent Certificates */}
                    <div className={s.card} style={{flex:"1.5 1 0"}}>
                      <div className={s.cardHead}>
                        <span className={s.cardTitle}>Recent Certificates</span>
                        <button className={s.viewAllBtn} onClick={()=>setActive("certificates")}>View All</button>
                      </div>
                      {recentCerts.length === 0 ? (
                        <p className={s.emptyMsg}>No certificates issued yet.</p>
                      ) : (
                        <table className={s.table}>
                          <thead><tr>
                            <th>Certificate ID</th><th>Learner</th><th>Institution</th><th>Issued On</th><th>Status</th>
                          </tr></thead>
                          <tbody>
                            {recentCerts.map(r=>(
                              <tr key={r.certificateId}>
                                <td className={s.blueLink}>{r.certificateId}</td>
                                <td>{r.learnerName}</td>
                                <td>{r.institutionName}</td>
                                <td>{r.issuedOn}</td>
                                <td><StatusBadge status={r.status}/></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>

                    {/* Top Institutions */}
                    <div className={s.card} style={{flex:"1 1 0"}}>
                      <div className={s.cardHead}>
                        <span className={s.cardTitle}>Top Institutions</span>
                        <button className={s.viewAllBtn} onClick={()=>setActive("institutions")}>View All</button>
                      </div>
                      {topInstitutions.length === 0 ? (
                        <p className={s.emptyMsg}>No certificate data yet.</p>
                      ) : (
                        <div className={s.instList}>
                          {topInstitutions.map((inst,i)=>(
                            <div key={i} className={s.instRow}>
                              <div className={s.instTopLine}>
                                <span className={s.instName}>{i+1}. {inst.name}</span>
                                <span className={s.instCount}>{Number(inst.count).toLocaleString()}</span>
                              </div>
                              <div className={s.barTrack}>
                                <div className={s.barFill} style={{width:`${inst.percentage||Math.round(inst.count/maxCount*100)}%`}}/>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <footer className={s.footer}>
                    <span>© 2024 Credencify. All rights reserved.</span>
                    <span>Version 1.0.0</span>
                  </footer>
                </>
              )}
            </>
          )}

          {/* ════ INSTITUTIONS VIEW ════ */}
          {active === "institutions" && (
            <>
              <div className={s.pageHead}>
                <div>
                  <h1 className={s.pageTitle}>Institutions</h1>
                  <p className={s.pageSub}>All registered institution accounts in the system.</p>
                </div>
              </div>
              <div className={s.card}>
                {subError && <div className={s.subErrorBox}>{subError}</div>}
                {subLoading ? <Spinner/> : (
                  <table className={s.table}>
                    <thead><tr>
                      <th>Institution ID</th><th>Full Name</th><th>Email</th><th>Status</th><th>Registered</th>
                    </tr></thead>
                    <tbody>
                      {institutionUsers.length === 0 ? (
                        <tr><td colSpan="5" className={s.emptyCell}>No institutions registered yet.</td></tr>
                      ) : institutionUsers.map(u=>(
                        <tr key={u.userId} onClick={() => handleInstClick(u)} style={{ cursor: "pointer" }}>
                          <td className={s.blueLink}>{u.userId}</td>
                          <td>{u.fullName}</td>
                          <td>{u.email}</td>
                          <td><span className={s.tagIssued}>{u.status || "ACTIVE"}</span></td>
                          <td>{u.createAt ? new Date(u.createAt).toLocaleDateString("en-US",{month:"short",day:"2-digit",year:"numeric"}) : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {/* ════ USERS VIEW ════ */}
          {active === "users" && (
            <>
              <div className={s.pageHead}>
                <div>
                  <h1 className={s.pageTitle}>All Users</h1>
                  <p className={s.pageSub}>Complete registry of all users: learners, institutions, and admins.</p>
                </div>
              </div>
              <div className={s.card}>
                {subError && <div className={s.subErrorBox}>{subError}</div>}
                {subLoading ? <Spinner/> : (
                  <table className={s.table}>
                    <thead><tr>
                      <th>User ID</th><th>Full Name</th><th>Email</th><th>Role</th><th>Status</th>
                    </tr></thead>
                    <tbody>
                      {allUsers.length === 0 ? (
                        <tr><td colSpan="5" className={s.emptyCell}>No users found.</td></tr>
                      ) : allUsers.map(u=>(
                        <tr key={u.userId}>
                          <td className={s.blueLink}>{u.userId}</td>
                          <td>{u.fullName}</td>
                          <td>{u.email}</td>
                          <td>
                            <span className={
                              u.role==="ADMIN"?s.tagRevoked:
                              u.role==="INSTITUTION"?s.tagReview:s.tagIssued}>
                              {u.role}
                            </span>
                          </td>
                          <td><span className={s.tagIssued}>{u.status || "ACTIVE"}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {/* ════ CERTIFICATES VIEW ════ */}
          {active === "certificates" && (
            <>
              <div className={s.pageHead}>
                <div>
                  <h1 className={s.pageTitle}>All Certificates</h1>
                  <p className={s.pageSub}>Complete list of all issued certificates in the system.</p>
                </div>
              </div>
              <div className={s.card}>
                {subError && <div className={s.subErrorBox}>{subError}</div>}
                {subLoading ? <Spinner/> : (
                  <table className={s.table}>
                    <thead><tr>
                      <th>Certificate ID</th><th>Learner</th><th>Course</th><th>Institution</th><th>Issued On</th><th>Status</th>
                    </tr></thead>
                    <tbody>
                      {allCerts.length === 0 ? (
                        <tr><td colSpan="6" className={s.emptyCell}>No certificates found.</td></tr>
                      ) : allCerts.map(c=>(
                        <tr key={c.certificateId}>
                          <td className={s.blueLink}>{c.certificateId}</td>
                          <td>{c.learnerName}</td>
                          <td>{c.courseName}</td>
                          <td>{c.institutionName}</td>
                          <td>{c.issuedOn}</td>
                          <td><StatusBadge status={c.status}/></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {/* ════ VERIFICATIONS VIEW ════ */}
          {active === "verifications" && (
            <>
              <div className={s.pageHead}>
                <div>
                  <h1 className={s.pageTitle}>Verifications</h1>
                  <p className={s.pageSub}>Real-time cryptographic verification log history.</p>
                </div>
              </div>

              {subError && <div className={s.subErrorBox}>{subError}</div>}
              {subLoading ? <Spinner/> : (
                <div className={s.card}>
                  <div className={s.cardHead}>
                    <span className={s.cardTitle}>Cryptographic Lookup History</span>
                  </div>
                  <table className={s.table}>
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Certificate ID</th>
                        <th>Type</th>
                        <th>Verified By</th>
                        <th>Match Score</th>
                        <th>Status</th>
                        <th>Blockchain Ledger Hash</th>
                      </tr>
                    </thead>
                    <tbody>
                      {verificationLogs.length === 0 ? (
                        <tr><td colSpan="7" className={s.emptyCell}>No registry verifications logged yet.</td></tr>
                      ) : verificationLogs.map(l => (
                        <tr key={l.id}>
                          <td>{new Date(l.verifiedAt).toLocaleString()}</td>
                          <td style={{ fontWeight: "700" }}>{l.certificateId}</td>
                          <td>
                            <span 
                              style={{
                                background: l.verificationType === "AI_HARD_COPY_OCR" ? "#eff6ff" : "#f1f5f9",
                                color: l.verificationType === "AI_HARD_COPY_OCR" ? "#1d4ed8" : "#475569",
                                padding: "3px 8px",
                                borderRadius: "6px",
                                fontWeight: "600",
                                fontSize: "11.5px"
                              }}
                            >
                              {l.verificationType === "AI_HARD_COPY_OCR" ? "AI OCR Audit" : "Digital Hash"}
                            </span>
                          </td>
                          <td style={{ fontWeight: "500", color: "#334155" }}>
                            {l.verifiedBy || "Anonymous (Public)"}
                          </td>
                          <td style={{ fontWeight: "700", color: (l.matchScore === null || l.matchScore === 100) ? "#16a34a" : l.matchScore >= 70 ? "#ca8a04" : "#dc2626" }}>
                            {l.matchScore !== null && l.matchScore !== undefined ? `${l.matchScore}%` : "100%"}
                          </td>
                          <td>
                            <span 
                              style={{
                                background: (l.status === "VERIFIED" || l.status === "AUTHENTIC") ? "#e6f4ea" : (l.status === "NOT_FOUND" || l.status === "TAMPERED") ? "#fce8e6" : "#fef7e0",
                                color: (l.status === "VERIFIED" || l.status === "AUTHENTIC") ? "#137333" : (l.status === "NOT_FOUND" || l.status === "TAMPERED") ? "#c5221f" : "#b06000",
                                padding: "4px 8px",
                                borderRadius: "6px",
                                fontWeight: "600",
                                fontSize: "12px"
                              }}
                            >
                              {l.status}
                            </span>
                          </td>
                          <td style={{ fontFamily: "monospace", fontSize: "11px", color: "#64748b", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {l.blockchainHash || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* ════ MISMATCH REPORTS ════ */}
          {active === "mismatches" && (
            <>
              <div className={s.pageHead}>
                <div>
                  <h1 className={s.pageTitle}>Mismatch Reports</h1>
                  <p className={s.pageSub}>AI anomaly detection alerts and tampered document reports.</p>
                </div>
              </div>

              {subError && <div className={s.subErrorBox}>{subError}</div>}
              {subLoading ? <Spinner/> : (
                <div className={s.card}>
                  <div className={s.cardHead}>
                    <span className={s.cardTitle}>Detected Layout & Data Mismatches</span>
                  </div>
                  <table className={s.table}>
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Certificate ID</th>
                        <th>Uploaded File</th>
                        <th>Match Score</th>
                        <th>Verdict</th>
                        <th>Discrepancies / Anomalies</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aiAuditLogs.filter(l => l.verdict !== "AUTHENTIC" || l.matchScore < 100).length === 0 ? (
                        <tr><td colSpan="6" className={s.emptyCell}>No document mismatches or tampering detected!</td></tr>
                      ) : aiAuditLogs.filter(l => l.verdict !== "AUTHENTIC" || l.matchScore < 100).map(l => (
                        <tr key={l.id}>
                          <td>{new Date(l.auditedAt).toLocaleString()}</td>
                          <td style={{ fontWeight: "700" }}>{l.certificateId}</td>
                          <td style={{ fontSize: "12px", color: "#64748b" }}>{l.uploadedFileName}</td>
                          <td>
                            <span style={{ fontWeight: "700", color: l.matchScore >= 70 ? "#ca8a04" : "#dc2626" }}>
                              {l.matchScore}%
                            </span>
                          </td>
                          <td>
                            <span 
                              style={{
                                background: l.verdict === "MISMATCH" ? "#fef7e0" : "#fce8e6",
                                color: l.verdict === "MISMATCH" ? "#b06000" : "#c5221f",
                                padding: "4px 8px",
                                borderRadius: "6px",
                                fontWeight: "600",
                                fontSize: "12px"
                              }}
                            >
                              {l.verdict}
                            </span>
                          </td>
                          <td style={{ fontSize: "12px", color: "#b91c1c", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {l.anomalies || "Layout mismatch detected"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* ════ REVOCATIONS ════ */}
          {active === "revocations" && (
            <>
              <div className={s.pageHead}>
                <div>
                  <h1 className={s.pageTitle}>Revocations</h1>
                  <p className={s.pageSub}>All certificates that have been revoked from the system.</p>
                </div>
              </div>
              <div className={s.card}>
                {subError && <div className={s.subErrorBox}>{subError}</div>}
                {subLoading ? <Spinner/> : (
                  <table className={s.table}>
                    <thead><tr>
                      <th>Certificate ID</th><th>Learner</th><th>Course</th><th>Institution</th><th>Issued On</th><th>Status</th>
                    </tr></thead>
                    <tbody>
                      {revokedCerts.length === 0 ? (
                        <tr><td colSpan="6" className={s.emptyCell}>No revoked certificates found.</td></tr>
                      ) : revokedCerts.map(c=>(
                        <tr key={c.certificateId}>
                          <td className={s.blueLink}>{c.certificateId}</td>
                          <td>{c.learnerName}</td>
                          <td>{c.courseName}</td>
                          <td>{c.institutionName}</td>
                          <td>{c.issuedOn}</td>
                          <td><StatusBadge status="REVOKED"/></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {/* ════ ANALYTICS ════ */}
          {active === "analytics" && (
            <>
              <div className={s.pageHead}><h1 className={s.pageTitle}>Analytics</h1></div>
              <UnderDev title="Analytics Under Development" />
            </>
          )}

          {/* ════ AUDIT LOGS ════ */}
          {active === "audit" && (
            <>
              <div className={s.pageHead}>
                <div>
                  <h1 className={s.pageTitle}>Audit Logs</h1>
                  <p className={s.pageSub}>Complete historic records of cryptographic verifications and AI layout audits.</p>
                </div>
              </div>

              {subError && <div className={s.subErrorBox}>{subError}</div>}
              {subLoading ? <Spinner/> : (
                <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                  {/* Section 1: AI Hard Copy Audits */}
                  <div className={s.card}>
                    <div className={s.cardHead}>
                      <span className={s.cardTitle}>AI Layout Hard-Copy Audits</span>
                    </div>
                    <table className={s.table}>
                      <thead>
                        <tr>
                          <th>Timestamp</th>
                          <th>Certificate ID</th>
                          <th>Uploaded File</th>
                          <th>Match Score</th>
                          <th>Verdict</th>
                          <th>Recipient Extracted</th>
                        </tr>
                      </thead>
                      <tbody>
                        {aiAuditLogs.length === 0 ? (
                          <tr><td colSpan="6" className={s.emptyCell}>No hard copy audits logged yet.</td></tr>
                        ) : aiAuditLogs.map(l => (
                          <tr key={l.id}>
                            <td>{new Date(l.auditedAt).toLocaleString()}</td>
                            <td style={{ fontWeight: "700" }}>{l.certificateId}</td>
                            <td style={{ fontSize: "12px", color: "#64748b" }}>{l.uploadedFileName}</td>
                            <td>
                              <span 
                                style={{ 
                                  fontWeight: "700",
                                  color: l.matchScore === 100 ? "#16a34a" : l.matchScore >= 70 ? "#ca8a04" : "#dc2626"
                                }}
                              >
                                {l.matchScore}%
                              </span>
                            </td>
                            <td>
                              <span 
                                style={{
                                  background: l.verdict === "AUTHENTIC" ? "#e6f4ea" : l.verdict === "MISMATCH" ? "#fef7e0" : "#fce8e6",
                                  color: l.verdict === "AUTHENTIC" ? "#137333" : l.verdict === "MISMATCH" ? "#b06000" : "#c5221f",
                                  padding: "4px 8px",
                                  borderRadius: "6px",
                                  fontWeight: "600",
                                  fontSize: "12px"
                                }}
                              >
                                {l.verdict}
                              </span>
                            </td>
                            <td>{l.extractedName || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Section 2: Cryptographic Lookup Logs */}
                  <div className={s.card}>
                    <div className={s.cardHead}>
                      <span className={s.cardTitle}>Cryptographic Registry Checks</span>
                    </div>
                    <table className={s.table}>
                      <thead>
                        <tr>
                          <th>Timestamp</th>
                          <th>Certificate ID</th>
                          <th>Type</th>
                          <th>Verified By</th>
                          <th>Match Score</th>
                          <th>Status</th>
                          <th>Blockchain Ledger Hash</th>
                        </tr>
                      </thead>
                      <tbody>
                        {verificationLogs.length === 0 ? (
                          <tr><td colSpan="7" className={s.emptyCell}>No registry verifications logged yet.</td></tr>
                        ) : verificationLogs.map(l => (
                          <tr key={l.id}>
                            <td>{new Date(l.verifiedAt).toLocaleString()}</td>
                            <td style={{ fontWeight: "700" }}>{l.certificateId}</td>
                            <td>
                              <span 
                                style={{
                                  background: l.verificationType === "AI_HARD_COPY_OCR" ? "#eff6ff" : "#f1f5f9",
                                  color: l.verificationType === "AI_HARD_COPY_OCR" ? "#1d4ed8" : "#475569",
                                  padding: "3px 8px",
                                  borderRadius: "6px",
                                  fontWeight: "600",
                                  fontSize: "11.5px"
                                }}
                              >
                                {l.verificationType === "AI_HARD_COPY_OCR" ? "AI OCR Audit" : "Digital Hash"}
                              </span>
                            </td>
                            <td style={{ fontWeight: "500", color: "#334155" }}>
                              {l.verifiedBy || "Anonymous (Public)"}
                            </td>
                            <td style={{ fontWeight: "700", color: (l.matchScore === null || l.matchScore === 100) ? "#16a34a" : l.matchScore >= 70 ? "#ca8a04" : "#dc2626" }}>
                              {l.matchScore !== null && l.matchScore !== undefined ? `${l.matchScore}%` : "100%"}
                            </td>
                            <td>
                              <span 
                                style={{
                                  background: (l.status === "VERIFIED" || l.status === "AUTHENTIC") ? "#e6f4ea" : (l.status === "NOT_FOUND" || l.status === "TAMPERED") ? "#fce8e6" : "#fef7e0",
                                  color: (l.status === "VERIFIED" || l.status === "AUTHENTIC") ? "#137333" : (l.status === "NOT_FOUND" || l.status === "TAMPERED") ? "#c5221f" : "#b06000",
                                  padding: "4px 8px",
                                  borderRadius: "6px",
                                  fontWeight: "600",
                                  fontSize: "12px"
                                }}
                              >
                                {l.status}
                              </span>
                            </td>
                            <td style={{ fontFamily: "monospace", fontSize: "11px", color: "#64748b", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {l.blockchainHash || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ════ SYSTEM HEALTH ════ */}
          {active === "health" && (
            <>
              <div className={s.pageHead}>
                <div>
                  <h1 className={s.pageTitle}>System Health</h1>
                  <p className={s.pageSub}>Live health status of all Credencify microservices.</p>
                </div>
                <button className={s.refreshBtn} onClick={fetchDashboard}><FiRefreshCw size={14}/> Refresh</button>
              </div>
              <div className={s.card}>
                <div className={s.healthList}>
                  {healthList.map(h=>(
                    <div key={h.name} className={s.healthRowLarge}>
                      <span className={s.healthName}>{h.name}</span>
                      <span className={`${s.healthBadge} ${h.status==="Healthy"?s.healthGreen:s.healthRed}`}>
                        <span className={s.greenDot}>●</span> {h.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ════ SETTINGS ════ */}
          {active === "settings" && (
            <>
              <div className={s.pageHead}><h1 className={s.pageTitle}>Settings</h1></div>
              <UnderDev title="Settings Under Development" />
            </>
          )}

        </main>
      </div>

      {/* ── Slide-in Drawer for Selected Institution ── */}
      {selectedInst && (
        <div className={s.drawerOverlay} onClick={() => setSelectedInst(null)}>
          <div className={s.drawerContent} onClick={e => e.stopPropagation()}>
            <div className={s.drawerHeader}>
              <h2>Institution Profile</h2>
              <button className={s.drawerCloseBtn} onClick={() => setSelectedInst(null)}>
                &times;
              </button>
            </div>

            <div className={s.drawerBody}>
              <div className={s.drawerSection}>
                <div className={s.drawerSectionTitle}>General Information</div>
                <div className={s.drawerInfoGrid}>
                  <div className={s.drawerInfoItem}>
                    <span className={s.drawerLabel}>Institution ID</span>
                    <span className={s.drawerValue}>{selectedInst.userId}</span>
                  </div>
                  <div className={s.drawerInfoItem}>
                    <span className={s.drawerLabel}>Full Name / Academy</span>
                    <span className={s.drawerValue}>{selectedInst.fullName}</span>
                  </div>
                  <div className={s.drawerInfoItem}>
                    <span className={s.drawerLabel}>Email Address</span>
                    <span className={s.drawerValue}>{selectedInst.email}</span>
                  </div>
                  <div className={s.drawerInfoItem}>
                    <span className={s.drawerLabel}>Account Status</span>
                    <span className={s.drawerValue} style={{ color: "#16a34a" }}>
                      {selectedInst.status || "ACTIVE"}
                    </span>
                  </div>
                </div>
              </div>

              <div className={s.drawerSection}>
                <div className={s.drawerSectionTitle}>Issued Certificates</div>
                {loadingInstCerts ? (
                  <p style={{ fontSize: "13px", color: "#64748b" }}>Loading issued credentials...</p>
                ) : instCerts.length === 0 ? (
                  <p style={{ fontSize: "13px", color: "#94a3b8", fontStyle: "italic" }}>
                    No certificates issued by this institution yet.
                  </p>
                ) : (
                  <div className={s.drawerCertList}>
                    {instCerts.map(c => (
                      <div key={c.certificateId} className={s.drawerCertCard}>
                        <div className={s.drawerCertHeader}>
                          <span className={s.drawerCertId}>{c.certificateId}</span>
                          <span 
                            style={{ 
                              fontSize: "11px", 
                              fontWeight: "700", 
                              color: c.status === "REVOKED" ? "#ef4444" : "#16a34a",
                              background: c.status === "REVOKED" ? "#fef2f2" : "#f0fdf4",
                              padding: "2px 6px",
                              borderRadius: "4px"
                            }}
                          >
                            {c.status}
                          </span>
                        </div>
                        <div className={s.drawerCertCourse}>{c.courseName}</div>
                        <div className={s.drawerCertLearner}>Recipient: {c.learnerName}</div>
                        <div className={s.drawerCertDate}>
                          Issued: {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Stat card ── */
function StatCard({ icon, iconCls, label, value, delta, sub }) {
  return (
    <div className={s.statCard}>
      <div className={`${s.statIcon} ${iconCls}`}>{icon}</div>
      <div className={s.statBody}>
        <span className={s.statLabel}>{label}</span>
        <div className={s.statValRow}>
          <span className={s.statNum}>{value}</span>
          <span className={`${s.statDelta} ${s.deltaGreen}`}>
            <FiArrowUpRight size={12}/> {delta}
          </span>
        </div>
        <span className={s.statSub}>{sub}</span>
      </div>
    </div>
  );
}
