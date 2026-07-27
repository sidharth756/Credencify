import Navbar from "../../components/Navbar/Navbar";
import LoginCard from "../../components/LoginCard/LoginCard";
import styles from "./SignIn.module.css";


function SignIn(){

    return(
        <div className={styles.page}>

            <Navbar/>

            <LoginCard/>

        </div>
    )
}


export default SignIn;