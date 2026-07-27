import Navbar from "../../components/Navbar/Navbar";
import HeroSection from "../../components/HeroSection/HeroSection";
import styles from "./Welcome.module.css";


function Welcome(){

 return(

    <div className={styles.page}>

       <Navbar/>
       <HeroSection/>

    </div>

 );

}


export default Welcome;