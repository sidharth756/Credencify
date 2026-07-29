import {Routes,Route} from "react-router-dom"
import './App.css'
import HeroSection from './components/HeroSection/HeroSection'
import LoginCard from './components/LoginCard/LoginCard'
import NavBar from './components/Navbar/Navbar'
import Welcome from './pages/Welcome/Welcome'
import Register from './pages/Register/Register'
import AboutUs from "./pages/AboutUs/AboutUs"

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Welcome/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/about" element={<AboutUs/>}/>
    </Routes>
    </>

  )
}

export default App
