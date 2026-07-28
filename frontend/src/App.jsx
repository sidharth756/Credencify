import { useState } from 'react'
import './App.css'
<<<<<<< HEAD
import NavBar from './components/Navbar/Navbar'
=======
import NavBar from './components/Navbar'
import Welcome from './pages/Welcome/Welcome'
import SignIn from './pages/SignIn/SignIn'

>>>>>>> f46a7b0 (Fixed import fails, merged pages and component with navbar, added subfolder for each component)

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
<<<<<<< HEAD
=======
    
    <Welcome/>
    
>>>>>>> f46a7b0 (Fixed import fails, merged pages and component with navbar, added subfolder for each component)
    </>
  )
}

export default App
