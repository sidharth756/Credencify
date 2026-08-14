import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FiGrid, FiUser, FiSettings, FiLogOut, FiChevronDown, FiBell } from "react-icons/fi";
import styles from "./Navbar.module.css";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  // Load user from localStorage and listen for login state changes
  useEffect(() => {
    const checkUser = () => {
      const saved = localStorage.getItem("user");
      setUser(saved ? JSON.parse(saved) : null);
    };

    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, [location.pathname]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
    navigate("/");
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  // Don't show navbar on mod admin pages (they have their own full layout)
  if (location.pathname.startsWith("/mod")) return null;

  return (
    <header className={styles.navbar}>
      <div className={styles.logo} onClick={() => navigate("/")}>
        <h2>Credencify</h2>
      </div>

      <nav className={styles.navlinks}>
        <Link to="/" className={location.pathname === "/" ? styles.activeLink : ""}>Home</Link>
        <Link to="/contact" className={location.pathname === "/contact" ? styles.activeLink : ""}>Contact</Link>
        <Link to="/verify" className={location.pathname === "/verify" || location.pathname.startsWith("/verifying") || location.pathname.startsWith("/verification") ? styles.activeLink : ""}>Verify Credential</Link>
        <Link to="/about" className={location.pathname === "/about" ? styles.activeLink : ""}>About us</Link>
      </nav>

      <div className={styles.rightNav}>
        {user ? (
          <div className={styles.userMenu} ref={dropdownRef}>
            <div 
              className={styles.navBellWrapper} 
              ref={notifRef}
              onClick={() => setNotificationsOpen(prev => !prev)}
            >
              <FiBell className={styles.navBellIcon} />
              <span className={styles.navBellBadge}>0</span>
            </div>

            {notificationsOpen && (
              <div className={styles.notifDropdown}>
                <div className={styles.notifTitle}>Notifications</div>
                <div className={styles.notifEmpty}>
                  No new notifications.<br />We will alert you here when credential verifications or audits trigger system updates.
                </div>
              </div>
            )}

            <div
              className={styles.profilePillTrigger}
              onClick={() => setDropdownOpen(prev => !prev)}
            >
              <div className={styles.avatar}>
                {getInitials(user.fullName)}
              </div>
              <div className={styles.navUserInfoText}>
                <span className={styles.navUserName}>{user.role === "ADMIN" ? "Admin User" : user.fullName}</span>
                <span className={styles.navUserSubtitle}>{user.role === "ADMIN" ? "Super Admin" : user.role}</span>
              </div>
              <FiChevronDown className={styles.dropdownChevron} />
            </div>

            {dropdownOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownUserRow}>
                  <div className={styles.dropdownAvatarLarge}>
                    {getInitials(user.fullName)}
                  </div>
                  <div className={styles.dropdownUserInfo}>
                    <div className={styles.dropdownName}>{user.fullName}</div>
                    <div className={styles.dropdownEmail}>{user.email || "user@example.com"}</div>
                  </div>
                </div>

                <div className={styles.dropdownMenuBox}>
                  <button
                    className={`${styles.dropdownItem} ${location.pathname === "/dashboard" && (!location.state || location.state?.view === "overview") ? styles.activeDropdownItem : ""}`}
                    onClick={() => { setDropdownOpen(false); navigate("/dashboard", { state: { view: "overview" } }); }}
                  >
                    <FiGrid className={styles.itemIcon} /> Dashboard
                  </button>

                  <button
                    className={`${styles.dropdownItem} ${location.pathname === "/dashboard" && location.state?.view === "profile" ? styles.activeDropdownItem : ""}`}
                    onClick={() => { setDropdownOpen(false); navigate("/dashboard", { state: { view: "profile" } }); }}
                  >
                    <FiUser className={styles.itemIcon} /> Profile
                  </button>

                  <button
                    className={`${styles.dropdownItem} ${location.pathname === "/dashboard" && location.state?.view === "settings" ? styles.activeDropdownItem : ""}`}
                    onClick={() => { setDropdownOpen(false); navigate("/dashboard", { state: { view: "settings" } }); }}
                  >
                    <FiSettings className={styles.itemIcon} /> Settings
                  </button>

                  <div className={styles.dropdownDivider}></div>

                  <button className={`${styles.dropdownItem} ${styles.logoutItem}`} onClick={handleLogout}>
                    <FiLogOut className={styles.itemIcon} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button className={styles.signinbtn} onClick={() => navigate("/")}>
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}

export default NavBar;