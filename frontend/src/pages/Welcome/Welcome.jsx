import HeroSection from "../../components/HeroSection/HeroSection.jsx";
import LoginCard from "../../components/LoginCard/LoginCard.jsx";
import Navbar from "../../components/Navbar.jsx";

import styles from "./Welcome.module.css";

function Welcome() {
  return (
    <>
      <Navbar />

      <main className={styles.container}>
        <HeroSection />
      </main>
    </>
  );
}

export default Welcome;
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