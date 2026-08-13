import styles from "./Register.module.css";
import { FaUserCircle, FaUniversity, FaGraduationCap } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("LEARNER"); // Default role
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/v1.0/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: role
        })
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/"); // Redirect to Sign In page
        }, 1500);
      } else {
        const errorText = await response.text();
        setError(errorText || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to authentication server.");
    }
  };

  return (
    <>
      <div className={styles.container}>
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
            <p className={styles.roleTitle}>Register as</p>
            <div className={styles.roleButtons}>
              <button 
                type="button"
                className={`${styles.roleBtn} ${role === "INSTITUTION" ? styles.active : ""}`}
                onClick={() => setRole("INSTITUTION")}
              >
                <FaUniversity />
                Institution / Academy
              </button>

              <button 
                type="button"
                className={`${styles.roleBtn} ${role === "LEARNER" ? styles.active : ""}`}
                onClick={() => setRole("LEARNER")}
              >
                <FaGraduationCap />
                Learner
              </button>
            </div>
          </div>

          {/* Success or Error Feedback Alerts */}
          {success && (
            <div style={{
              backgroundColor: "#dcfce7",
              border: "1px solid #bbf7d0",
              borderRadius: "8px",
              padding: "10px 14px",
              color: "#15803d",
              fontSize: "14px",
              marginBottom: "15px",
              textAlign: "center"
            }}>
              Registration Successful! Redirecting to Sign In...
            </div>
          )}

          {error && (
            <div style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fee2e2",
              borderRadius: "8px",
              padding: "10px 14px",
              color: "#991b1b",
              fontSize: "14px",
              marginBottom: "15px",
              textAlign: "center"
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form className={styles.form} onSubmit={handleRegister}>
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
              />
            </div>

            <div className={styles.checkbox}>
              <input type="checkbox" required />
              <span>
                I agree to the
                <a href="#"> Terms of Service </a>
                and
                <a href="#"> Privacy Policy</a>
              </span>
            </div>

            <button type="submit" className={styles.createBtn}>
              Create Account
            </button>
          </form>

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
            <a href="/"> Sign In</a>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;