import NavBar from "../../components/Navbar.jsx";
import HeroSection from "../../components/HeroSection/HeroSection.jsx";
import LoginCard from "../../components/LoginCard/LoginCard.jsx";

function SignIn(){

    return(
        <div className={styles.page}>
            <Navbar/>
            <LoginCard/>
        </div>
    )
}
export default SignIn;