import {Routes,Route} from "react-router-dom"
import './App.css'
import HeroSection from './components/HeroSection/HeroSection'
import LoginCard from './components/LoginCard/LoginCard'
import NavBar from './components/Navbar/Navbar'
import Welcome from './pages/Welcome/Welcome'
import Register from './pages/Register/Register'
import Contact from './pages/Contact/Contact'
import Verify from './pages/Verify/Verify'
import VerifyPage from "./pages/Verify/Verify"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/verify" element={<VerifyPage />} />
    </Routes>
  );
}

export default App
