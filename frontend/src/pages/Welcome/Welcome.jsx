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