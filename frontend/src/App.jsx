import { useState } from 'react'
import NavBar from './components/Navbar'// import viteLogo from './assets/vite.svg'
import SignIn from "./pages/SignIn";
// import heroImg from './assets/hero.png'
import './App.css'
import Welcome from "./pages/Welcome";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <SignIn /> */}
      {/* <div>Credencify</div> */}
      <Welcome />
      {/* <NavBar /> */}
    </>
  )
}

export default App
