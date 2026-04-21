import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import githubLogo from '../assets/github-mark-white.svg';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "U"; // fallback

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="nav-brand">
        <img src={githubLogo} alt="Github Logo" />
        <h3>CodeVault</h3>
      </Link>

      <div className="nav-links">

        {/* If logged in */}
        {token ? (
          <>
            {/* Dashboard */}
            <Link
              to="/"
              className={`nav-btn ${location.pathname === "/" ? "active" : ""}`}
            >
              Dashboard
            </Link>

            {/* Profile with avatar */}
            <Link to="/profile" className="nav-btn">
                Profile
            </Link>

            {/* Logout */}
            <button className="nav-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          /* If not logged in */
          <Link to="/auth" className="nav-btn">
            Login
          </Link>
        )}

      </div>
    </nav>
  );
};

export default Navbar;