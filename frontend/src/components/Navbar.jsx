import React from 'react'
import './Navbar.css'
function NavBar() {
  return (
    <header className='navbar'>
      <div className="logo">
          <h2>Credencify</h2>

      </div>

        <nav className='nav-links'>
            <a href="">Home</a>
            <a href="">Contact</a>
            <a href="">Verify Credential</a>
            <a href="">About us</a>
            <a href="">Sign In</a>
        </nav>
        <button className='signin-btn'>Sign In</button>

    </header>
  )
}

export default NavBar