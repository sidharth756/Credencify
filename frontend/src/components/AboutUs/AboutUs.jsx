import styles from "./AboutUs.module.css";
import {
  FaShieldAlt,
  FaGlobe,
  FaBolt,
  FaLock,
  FaCheckCircle,
  FaDatabase,
} from "react-icons/fa";

import certificate from "./assets/certificate.svg";

const AboutUs = () => {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <h5 className={styles.heading}>ABOUT US</h5>

        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.left}>
            <h2>
              Empowering seamless credential verification with secure digital
              records.
            </h2>

            <p>
              Credencify uses Blockchain, Artificial Intelligence and QR
              verification to create tamper-proof digital certificates that are
              easy to verify, impossible to forge and trusted by institutions,
              employers and learners worldwide.
            </p>
          </div>

          <div className={styles.right}>
            <img src={certificate} alt="Certificate" />
          </div>
        </div>

        {/* Mission Vision */}
        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>Our Mission</h3>

            <p>
              To establish a trusted and secure digital ecosystem where
              academic and professional credentials can be instantly verified,
              reducing fraud and increasing confidence.
            </p>
          </div>

          <div className={styles.card}>
            <h3>Our Vision</h3>

            <p>
              To become the global platform for secure credential verification
              using Blockchain, Artificial Intelligence and decentralized
              technologies.
            </p>
          </div>
        </div>

        {/* Trust Gap */}
        <div className={styles.trust}>
          <h2>The Trust Gap in Digital Credentials</h2>

          <p>
            Every year, millions of digital certificates are issued, yet
            verifying them remains slow, manual and vulnerable to fraud.
          </p>
        </div>

        {/* Powered By */}
        <div className={styles.powered}>
          <h3>Powered by Secure Technologies</h3>

          <div className={styles.techGrid}>
            <div className={styles.techCard}>
              <FaDatabase className={styles.icon} />
              <h4>Blockchain</h4>
              <p>Tamper-proof decentralized records.</p>
            </div>

            <div className={styles.techCard}>
              <FaShieldAlt className={styles.icon} />
              <h4>AI</h4>
              <p>Fraud risk analysis.</p>
            </div>

            <div className={styles.techCard}>
              <FaCheckCircle className={styles.icon} />
              <h4>QR Verify</h4>
              <p>Instant authenticity checks.</p>
            </div>

            <div className={styles.techCard}>
              <FaGlobe className={styles.icon} />
              <h4>IPFS</h4>
              <p>Decentralized certificate storage.</p>
            </div>
          </div>
        </div>

        {/* Why Blockchain */}
        <div className={styles.blockchainSection}>
          <div className={styles.features}>
            <h2>WHY BLOCKCHAIN BASED VERIFICATION?</h2>

            <div>
              <FaDatabase className={styles.icon} />
              <h4>Immutable Records</h4>
              <p>Certificate records cannot be secretly modified.</p>
            </div>

            <div>
              <FaCheckCircle className={styles.icon} />
              <h4>Transparency</h4>
              <p>Employers can independently verify credentials.</p>
            </div>

            <div>
              <FaLock className={styles.icon} />
              <h4>Trust without Middlemen</h4>
              <p>No dependence on manual approval.</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottomGrid}>
          <div>
            <FaBolt className={styles.bottomIcon} />
            <h3>Instant</h3>
            <p>Credential Verification</p>
          </div>

          <div>
            <FaGlobe className={styles.bottomIcon} />
            <h3>Global</h3>
            <p>Institution Connectivity</p>
          </div>

          <div>
            <FaShieldAlt className={styles.bottomIcon} />
            <h3>Secure</h3>
            <p>Blockchain Protected</p>
          </div>
        </div>

        {/* Institutions */}
        <div className={styles.institutions}>
          <h4>Our Trusted Institutions</h4>

          <div className={styles.logoRow}>
            <span>Udemy</span>
            <span>Simplilearn</span>
            <span>GUVI</span>
            <span>Educative</span>
            <span>Vedantu</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;