import {Routes,Route} from "react-router-dom"
import './App.css'
import HeroSection from './components/HeroSection/HeroSection'
import LoginCard from './components/LoginCard/LoginCard'
import NavBar from './components/Navbar/Navbar'
import Welcome from './pages/Welcome/Welcome'
import Register from './pages/Register/Register'
import Contact from './pages/Contact/Contact'
import InstitutionPortal from "./pages/InstitutionPortal/InstitutionPortal";

function App() {
  return (
    <Ro utes>
      <Route path="/" element={<Welcome />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/mod/institution" element={<InstitutionPortal />} />
    </Routes>

  );
}

export default App
