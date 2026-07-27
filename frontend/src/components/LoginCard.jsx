function LoginCard() {
  return (
    <section>
      <h2>SIGN IN</h2>
      <label>Email</label>
      <input
        type="email"
        placeholder="Enter your email"
      />

      <label>Password</label>
      <input
        type="password"
        placeholder="Enter your password"
      />

      <div>
        <label>
          <input type="checkbox" />
          Remember Me
        </label>

        <a href="#">Forgot Password?</a>
      </div>
      <button>Sign In</button>

      <p>or sign in with</p>
      <button>Continue with Google</button>
      <button>Continue with Microsoft</button>
      <p>Don't have an account? <a href="#"> Register</a>
      </p>

    </section>
  );
}

export default LoginCard;