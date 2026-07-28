import Navbar from "../../components/Navbar/Navbar";
import styles from "./Register.module.css";

import { FaUserCircle } from "react-icons/fa";
import { FaUniversity } from "react-icons/fa";
import { FaGraduationCap } from "react-icons/fa";

function Register() {
  return (
    <>
      <Navbar />

      <main className={styles.container}>
        <div className={styles.card}>

          <div className={styles.icon}>
              <FaUserCircle />
          </div>

          <h1>Create your account</h1>

          <p className={styles.subtitle}>
            Join Credify and be a part of a trusted credential ecosystem
          </p>

          {/* Role Selection */}
          <div className={styles.roleSection}>
            <p className={styles.roleTitle}>
              Register as
            </p>

            <div className={styles.roleButtons}>

              <button className={styles.roleBtn}>
                <FaUniversity />
                Institution / Academy
              </button>

              <button className={`${styles.roleBtn} ${styles.active}`}>
                <FaGraduationCap />
                Learner
              </button>

            </div>

          </div>

          {/* Form */}

          <form className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
              />
            </div>
          </form>

          <div className={styles.checkbox}>
            <input type="checkbox" />
            <span>
              I agree to the
              <a href="#"> Terms of Service </a>
              and
              <a href="#"> Privacy Policy</a>
            </span>

          </div>

          <button className={styles.createBtn}>
            Create Account
          </button>

          <div className={styles.divider}>
            <span></span>
            or sign up with
            <span></span>
          </div>

<div className={styles.socialButtons}>

  <button className={styles.socialButton}>
    <img
      src="https://img.icons8.com/color/48/google-logo.png"
      alt="Google"
      className={`${styles.logoImg} ${styles.googleIcon}`}
    />
    <span>Continue with Google</span>
  </button>

  <button className={styles.socialButton}>
    <img
      src="https://img.icons8.com/color/48/microsoft.png"
      alt="Microsoft"
      className={`${styles.logoImg} ${styles.microsoftIcon}`}
    />
    <span className={styles.microsoftText}>
      Continue with Microsoft
    </span>
  </button>

</div>

          <p className={styles.bottomText}>
            Have an account?
            <a href="#"> Sign In</a>
          </p>

        </div>
      </main>
    </>
  );
}
export default Register;