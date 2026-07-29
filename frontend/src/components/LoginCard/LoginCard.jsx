import styles from "./LoginCard.module.css";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft } from "react-icons/fa";

function LoginCard() {

  return (
    <div className={styles.card}>

      <h2>
        Sign In
      </h2>

      <p className={styles.subtitle}>
        Welcome back! Please enter your details.
      </p>

      <form>
        <label>Email</label>
        <input type="email" placeholder="Enter your email"/>

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
        />

        <div className={styles.options}>
          <label className={styles.remember}>
            <input type="checkbox"/>
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