import styles from "./LoginCard.module.css";

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

        <label>
          Email
        </label>

        <input 
          type="email"
          placeholder="Enter your email"
        />


        <label>
          Password
        </label>

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
          <span></span>
          OR
          <span></span>
        </div>


        <button className={styles.socialButton}>
          Continue with Google
        </button>


        <button className={styles.socialButton}>
          Continue with Microsoft
        </button>


        <p className={styles.register}>
          Don't have an account?
          <a href="#">
            Register
          </a>
        </p>


      </form>


    </div>
  );
}


export default LoginCard;