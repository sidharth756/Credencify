import HeroSection from "../../components/HeroSection";
import LoginCard from "../../components/LoginCard";
import Navbar from "../../components/Navbar";

import styles from "./Welcome.module.css";

function Welcome() {
  return (
    <>
      <Navbar />

      <main className={styles.container}>
        <HeroSection />
        <LoginCard />
      </main>
    </>
  );
}

export default Welcome;