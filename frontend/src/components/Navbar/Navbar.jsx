import React from 'react'
import styles from "./Navbar.module.css";
function NavBar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>
          <h2>Credencify</h2>
      </div>
        <nav className={styles.navlinks}>
            <a href="/">Home</a>
            <a href="#">Contact</a>
            <a href="/mod/verify">Verify Credential</a>
            <a href="#">About us</a>
        </nav>
        <button className={styles.signinbtn}>Sign In</button>

    </header>
  )
}

export default NavBar