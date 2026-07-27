import { useState } from 'react'
import NavBar from './components/Navbar/Navbar'// import viteLogo from './assets/vite.svg'
import SignIn from "./pages/SignIn/SignIn";
// import heroImg from './assets/hero.png'
import './App.css'
import Welcome from "./pages/Welcome/Welcome";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Welcome />
    </>
  )
}

export default App
