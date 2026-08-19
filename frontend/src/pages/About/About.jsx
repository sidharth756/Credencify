import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./About.module.css";
import {
  FiShield,
  FiZap,
  FiLock,
  FiCheckCircle,
  FiAward,
  FiGlobe,
  FiCpu,
} from "react-icons/fi";
import { FaUniversity, FaGraduationCap } from "react-icons/fa";

const techStack = [
  { icon: <FiCpu size={22} color="#1d4ed8" />, label: "Blockchain", sub: "Immutable on-chain records" },
  { icon: <FiZap size={22} color="#7c3aed" />, label: "AI", sub: "Fraud detection" },
  { icon: <FiShield size={22} color="#059669" />, label: "QB Verify", sub: "Instant authenticity checks" },
  { icon: <FiLock size={22} color="#d97706" />, label: "IPFS", sub: "Decentralised certificate storage" },
];

const whyItems = [
  {
    icon: <FiShield size={26} color="#1d4ed8" />,
    title: "Immutable Records",
    desc: "Once registered, certificate records cannot be secretly modified.",
  },
  {
    icon: <FiCheckCircle size={26} color="#1d4ed8" />,
    title: "Transparency",
    desc: "Employees can independently verify credentials.",
  },
  {
    icon: <FiLock size={26} color="#1d4ed8" />,
    title: "Trust without Middlemen",
    desc: "We find and do not depend blindly on a middleman for manual approval.",
  },
];

const stats = [
  { icon: <FiZap size={24} color="#ffffff" />, value: "Instant", label: "Credential Verification", sub: "Designed for speed and reliability", bg: "#3b82f6" },
  { icon: <FiGlobe size={24} color="#ffffff" />, value: "Global", label: "Institution Connectivity", sub: "Designed to seamlessly connect institutions", bg: "#6366f1" },
  { icon: <FiShield size={24} color="#ffffff" />, value: "Secure", label: "Blockchain", sub: "Data proven for trust and transparency", bg: "#0ea5e9" },
];

const brands = [
  { name: "udemy", color: "#ec5252" },
  { name: "simplilearn", color: "#1d4ed8" },
  { name: "GUVI", color: "#16a34a" },
  { name: "educative", color: "#7c3aed" },
  { name: "Vedantu", color: "#ea580c" },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <Navbar />

      {/* ─── 1. HERO ─── */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroLeft}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowDot} />
              About Us
            </div>
            <h1 className={styles.heroTitle}>
              Empowering seamless credential verification with secure digital records.
            </h1>
            <p className={styles.heroSub}>
              Credencify is on a mission to eliminate credential fraud by anchoring every certificate to a transparent, tamper-proof blockchain registry — verifiable by anyone, anywhere, in seconds.
            </p>
            <div className={styles.heroCtas}>
              <button className={styles.primaryBtn} onClick={() => navigate("/verify")}>
                Verify a Credential
              </button>
              <button className={styles.outlineBtn} onClick={() => navigate("/contact")}>
                Contact Us
              </button>
            </div>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.missionVisionGrid}>
              <div className={styles.mvCard}>
                <div className={styles.mvIcon}><FiAward size={24} color="#1d4ed8" /></div>
                <h3 className={styles.mvTitle}>Our Mission</h3>
                <p className={styles.mvDesc}>
                  To establish a secure and reputed digital credential eco-system and to ensure transparency of educational and professional credentials by offering a credential based trust examination.
                </p>
              </div>
              <div className={styles.mvCard}>
                <div className={styles.mvIcon}><FiGlobe size={24} color="#7c3aed" /></div>
                <h3 className={styles.mvTitle}>Our Vision</h3>
                <p className={styles.mvDesc}>
                  To become a leading platform for digital credential verification and to create a globally accepted and trusted digital ecosystem in which fraud has no room to operate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. TRUST GAP BANNER ─── */}
      <section className={styles.trustBanner}>
        <div className={styles.trustContainer}>
          <h2 className={styles.trustTitle}>The Trust Gap in Digital Credentials</h2>
          <p className={styles.trustSub}>
            Every year, millions of digital certificates are issued, yet verifying them remains slow, manual, and vulnerable to fraud.
          </p>
        </div>
      </section>

      {/* ─── 3. POWERED BY TECH ─── */}
      <section className={styles.section}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionEyebrow}>Powered by secure Technologies</div>
          <div className={styles.techGrid}>
            {techStack.map((t, i) => (
              <div key={i} className={styles.techCard}>
                <div className={styles.techIconBox}>{t.icon}</div>
                <div className={styles.techLabel}>{t.label}</div>
                <div className={styles.techSub}>{t.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. WHY BLOCKCHAIN ─── */}
      <section className={styles.sectionAlt}>
        <div className={styles.sectionContainer}>
          <div className={styles.whyRow}>
            <div className={styles.whyLeft}>
              <h2 className={styles.sectionTitle}>Why Blockchain Based Verification?</h2>
              <div className={styles.whyList}>
                {whyItems.map((w, i) => (
                  <div key={i} className={styles.whyItem}>
                    <div className={styles.whyIcon}>{w.icon}</div>
                    <div>
                      <div className={styles.whyItemTitle}>{w.title}</div>
                      <div className={styles.whyItemDesc}>{w.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.whyRight}>
              <div className={styles.blockchainVisual}>
                <div className={styles.blockchainNode}>
                  <FiCpu size={36} color="#1d4ed8" />
                  <span>Blockchain</span>
                </div>
                <div className={styles.blockchainRing1} />
                <div className={styles.blockchainRing2} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. KEY STATS ─── */}
      <section className={styles.section}>
        <div className={styles.sectionContainer}>
          <div className={styles.statsGrid}>
            {stats.map((s, i) => (
              <div key={i} className={styles.statCard}>
                <div className={styles.statIconBox} style={{ background: s.bg }}>
                  {s.icon}
                </div>
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
                <div className={styles.statSub}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. TRUSTED INSTITUTIONS ─── */}
      <section className={styles.brandsSection}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle} style={{ textAlign: "center" }}>Our trusted Institutions</h2>
          <div className={styles.brandsRow}>
            {brands.map((b, i) => (
              <div key={i} className={styles.brandItem} style={{ color: b.color }}>
                {b.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
