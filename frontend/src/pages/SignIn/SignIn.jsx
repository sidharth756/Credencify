import React from "react";
import Navbar from "../../components/Navbar/Navbar.jsx";
import LoginCard from "../../components/LoginCard/LoginCard.jsx";
import styles from "./SignIn.module.css";

function SignIn() {
  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <LoginCard />
      </div>
    </div>
  );
}

export default SignIn;