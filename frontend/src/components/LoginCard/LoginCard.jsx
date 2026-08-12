import styles from "./LoginCard.module.css";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom"

function LoginCard() {

  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1.0/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      }
      );

      if (response.ok) {
        alert("Login Sucessfull! Redirecting");
        navigate("/mod/institution");
      }
      else {
        setError("Invalid email or password. Please try again.");
        const errorText = await response.text();
        alert("Login Failed :" + errorText);

      }

    } catch (err) {
      console.error(err);
      alert("Failed to Connect backend");
    }
  };


  return (
    <div className={styles.card}>

      <h2>
        Sign In
      </h2>

      <p className={styles.subtitle}>
        Welcome back! Please enter your details.
      </p>

      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fee2e2",
            borderRadius: "8px",
            padding: "10px 14px",
            color: "#991b1b",
            fontSize: "14px",
            fontFamily: "'Alexandria', sans-serif",
            fontWeight: "400",
            marginBottom: "15px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Enter your email"
          onChange={handleChange}
          style={{ outline: error ? "1.5px solid red" : "none" }} />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          style={{ outline: error ? "1.5px solid red" : "none" }}
        />

        <div className={styles.options}>
          <label className={styles.remember}>
            <input type="checkbox" />
            Remember me
          </label>

          <a href="#">
            Forgot password?
          </a>

        </div>
        <button className={styles.signButton}>
          Sign In
        </button>

        <div className={styles.divider}>
          <span></span>Or Sign in with<span></span>
        </div>

        <button className={styles.socialButton}>
          <img
            src="https://img.icons8.com/color/48/google-logo.png"
            alt="Google"
            className={`${styles.logoimg} ${styles.googleIcon}`}
          />
          <span>Continue with Google</span>
        </button>

        <button className={styles.socialButton}>
          <img
            src="https://img.icons8.com/color/48/microsoft.png"
            alt="Microsoft"
            className={`${styles.logoimg} ${styles.microsoftIcon}`}
          />
          <span className={styles.mcText}>Continue with Microsoft</span>
        </button>

        <p className={styles.register}>
          Don't have an account?
          <a href="/register"> Register</a>
        </p>

      </form>
    </div>
  );
}
export default LoginCard;