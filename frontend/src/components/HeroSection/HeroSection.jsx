import FeatureList from "../FeatureList/FeatureList";
import LoginCard from "../LoginCard/LoginCard";

import styles from "./HeroSection.module.css";


function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.left}>
        <h1>
          Welcome Back to Credify
        </h1>


        <p>
          Empowering trust through blockchain secured
          credentials and instant verification.
        </p>


        <FeatureList />

      </div>



      <div className={styles.right}>

        <LoginCard />

      </div>


    </section>

  );

}


export default HeroSection;