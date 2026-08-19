import styles from "./LoginCard.module.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const GW = "http://" + window.location.hostname + ":9000";

function LoginCard() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${GW}/api/v1.0/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        window.dispatchEvent(new Event("storage"));
        navigate("/");
      } else {
        setError(data.message || "Invalid email or password. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to server. Is the gateway running on port 9000?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h2>Sign In</h2>
      <p className={styles.subtitle}>Welcome back! Please enter your details.</p>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className={styles.errorAlert}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          placeholder="Enter your email"
          onChange={handleChange}
          required
          className={error ? styles.inputError : ""}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
          className={error ? styles.inputError : ""}
        />

        <div className={styles.options}>
          <label className={styles.remember}>
            <input type="checkbox" /> Remember me
          </label>
          <a href="#">Forgot password?</a>
        </div>

        <button className={styles.signButton} disabled={loading}>
          {loading ? <span className={styles.spinner}></span> : "Sign In"}
        </button>

        <div className={styles.divider}>
          <span></span>Or sign in with<span></span>
        </div>        <button type="button" className={styles.socialButton}>
          <img src="https://img.icons8.com/color/48/google-logo.png" alt="Google" className={`${styles.logoimg} ${styles.googleIcon}`} />
          <span>Continue with Google</span>
        </button>

        <button type="button" className={styles.socialButton}>
          <img src="https://img.icons8.com/color/48/microsoft.png" alt="Microsoft" className={`${styles.logoimg} ${styles.microsoftIcon}`} />
          <span className={styles.mcText}>Continue with Microsoft</span>
        </button>

        <p className={styles.register}>
          Don't have an account? <Link to="/register"> Register</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginCar