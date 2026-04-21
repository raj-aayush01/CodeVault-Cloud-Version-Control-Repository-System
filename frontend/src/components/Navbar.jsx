import React from 'react';
import { Link } from 'react-router-dom';

import githubLogo from '../assets/github-mark-white.svg';

import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/" className="nav-brand">
                <img src={githubLogo} alt="Github Logo" />
                <h3>GitHub</h3>
            </Link>

            <div className="nav-links">
                <Link to="/create" className="nav-btn">
                    + Create a Repository
                </Link>

                <Link to="/profile" className="nav-avatar">
                    <span>Profile</span>
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;