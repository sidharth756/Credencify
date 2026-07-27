import NavBar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import LoginCard from "../components/LoginCard";
// import "../styles/SignIn.css";

function SignIn() {
  return (
    <>
      <NavBar />

      <div className="signin-page">
        <HeroSection />
        <LoginCard />
      </div>
    </>
  );
}

export default SignIn;