import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.column}>
          <h4 className={styles.columnTitle}>Quick links</h4>
          <ul className={styles.linkList}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/verify">Verify Credentials</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4 className={styles.columnTitle}>Resources</h4>
          <ul className={styles.linkList}>
            <li><a href="#privacy">Privacy policy</a></li>
            <li><a href="#terms">Terms & Conditions</a></li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4 className={styles.columnTitle}>Contact</h4>
          <ul className={styles.linkList}>
            <li>contact@credencify.in</li>
            <li>+91 8994236021</li>
          </ul>
        </div>
      </div>

      <div className={styles.copyrightBar}>
        © 2026 Credencify. All Rights Reserved
      </div>
    </footer>
  );
}
