import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import heroImg from "../../assets/home-page-image.png";
import styles from "./Welcome.module.css";
import { 
  FiCheckCircle, 
  FiArrowRight, 
  FiShield, 
  FiZap, 
  FiLock, 
  FiFileText, 
  FiUsers,
  FiCpu,
  FiSearch
} from "react-icons/fi";
import { FaUniversity, FaGraduationCap } from "react-icons/fa";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className={styles.welcomePage}>
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroLeft}>
            <div className={styles.heroEyebrow}>
              <span className={styles.eyebrowDot}></span>
              Blockchain-Powered Platform
            </div>
            <h1 className={styles.heroTitle}>
              Building Trust in Digital Credentials with Blockchain
            </h1>
            <p className={styles.heroSubtitle}>
              Credencify is a blockchain-powered platform that enables institutions to issue secure digital credentials while allowing employers and organizations to verify their authenticity instantly.
            </p>
            <div className={styles.heroActions}>
              <button 
                className={styles.verifyBtn} 
                onClick={() => navigate("/verify")}
              >
                Verify Credentials
              </button>
              <button 
                className={styles.getStartedBtn} 
                onClick={() => navigate("/register")}
              >
                Get Started
              </button>
            </div>
            <div className={styles.heroChecklist}>
              <div className={styles.checkItem}>
                <FiCheckCircle className={styles.checkIcon} />
                <span>Tamper-Proof Record</span>
              </div>
              <div className={styles.checkItem}>
                <FiCheckCircle className={styles.checkIcon} />
                <span>Instant Verification</span>
              </div>
              <div className={styles.checkItem}>
                <FiCheckCircle className={styles.checkIcon} />
                <span>Trusted by Institutions</span>
              </div>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.heroImageWrapper}>
              <img 
                src={heroImg} 
                alt="Digital Certificate 3D Podium" 
                className={styles.heroImg}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. METRICS BANNER */}
      <section className={styles.metricsBanner}>
        <div className={styles.metricsContainer}>
          <div className={styles.metricItem}>
            <div className={styles.metricIconWrap}>
              <FaGraduationCap size={22} />
            </div>
            <div className={styles.metricText}>
              <div className={styles.metricVal}>10,000+</div>
              <div className={styles.metricLabel}>Credentials Issued</div>
            </div>
          </div>

          <div className={styles.metricItem}>
            <div className={styles.metricIconWrap}>
              <FaUniversity size={20} />
            </div>
            <div className={styles.metricText}>
              <div className={styles.metricVal}>100+</div>
              <div className={styles.metricLabel}>Partner Institution</div>
            </div>
          </div>

          <div className={styles.metricItem}>
            <div className={styles.metricIconWrap}>
              <FiUsers size={20} />
            </div>
            <div className={styles.metricText}>
              <div className={styles.metricVal}>7500+</div>
              <div className={styles.metricLabel}>Registered Learners</div>
            </div>
          </div>

          <div className={styles.metricItem}>
            <div className={styles.metricIconWrap}>
              <FiShield size={20} />
            </div>
            <div className={styles.metricText}>
              <div className={styles.metricVal}>14000+</div>
              <div className={styles.metricLabel}>Verifications Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className={styles.section}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>How it works</h2>
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepHeader}>1. Institution Issue Credentials</div>
              <div className={styles.stepIconBox}>
                <FaUniversity size={30} color="#1d4ed8" />
              </div>
              <p className={styles.stepDesc}>
                Institution create and authorize credential data
              </p>
            </div>

            <div className={styles.arrowWrap}>
              <FiArrowRight size={22} className={styles.arrowIcon} />
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepHeader}>2. Credential Generated</div>
              <div className={styles.stepIconBox}>
                <FiFileText size={30} color="#1d4ed8" />
              </div>
              <p className={styles.stepDesc}>
                A Tamper-proof digital certificate is generated with meta data
              </p>
            </div>

            <div className={styles.arrowWrap}>
              <FiArrowRight size={22} className={styles.arrowIcon} />
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepHeader}>3. Blockchain Registration</div>
              <div className={styles.stepIconBox}>
                <FiCpu size={30} color="#1d4ed8" />
              </div>
              <p className={styles.stepDesc}>
                The unique credential hash is permanently recorded on the public block chain
              </p>
            </div>

            <div className={styles.arrowWrap}>
              <FiArrowRight size={22} className={styles.arrowIcon} />
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepHeader}>4. Instant Verification</div>
              <div className={styles.stepIconBox}>
                <FiSearch size={30} color="#1d4ed8" />
              </div>
              <p className={styles.stepDesc}>
                Employer and authorities instantly verify authenticity and integrity of the credentials
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE CREDENCIFY SECTION */}
      <section className={styles.sectionAlt}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Why choose Credencify</h2>
          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <div className={styles.whyIconBox}>
                <FiShield size={34} color="#1d4ed8" />
              </div>
              <h3 className={styles.whyCardTitle}>Tamper-Proof</h3>
              <p className={styles.whyCardDesc}>
                Blockchain-secured credentials.
              </p>
            </div>

            <div className={styles.whyCard}>
              <div className={styles.whyIconBox}>
                <FiZap size={34} color="#1d4ed8" />
              </div>
              <h3 className={styles.whyCardTitle}>Instant Verification</h3>
              <p className={styles.whyCardDesc}>
                Verify within seconds
              </p>
            </div>

            <div className={styles.whyCard}>
              <div className={styles.whyIconBox}>
                <FaUniversity size={32} color="#1d4ed8" />
              </div>
              <h3 className={styles.whyCardTitle}>Trusted Institutions</h3>
              <p className={styles.whyCardDesc}>
                Issued only by Approved Institutions
              </p>
            </div>

            <div className={styles.whyCard}>
              <div className={styles.whyIconBox}>
                <FiLock size={34} color="#1d4ed8" />
              </div>
              <h3 className={styles.whyCardTitle}>Secure Platform</h3>
              <p className={styles.whyCardDesc}>
                Modern authentication and encryption data
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. OUR TRUSTED INSTITUTIONS SECTION */}
      <section className={styles.section}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Our trusted Institutions</h2>
          <div className={styles.brandLogosRow}>
            <div className={styles.brandLogoItem} style={{ color: "#ec5252" }}>
              udemy
            </div>
            <div className={styles.brandLogoItem} style={{ color: "#1d4ed8" }}>
              simplilearn
            </div>
            <div className={styles.brandLogoItem} style={{ color: "#16a34a" }}>
              GUVI
            </div>
            <div className={styles.brandLogoItem} style={{ color: "#7c3aed" }}>
              educative
            </div>
            <div className={styles.brandLogoItem} style={{ color: "#ea580c" }}>
              Vedantu
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <Footer />
    </div>
  );
}

export default Welcome;