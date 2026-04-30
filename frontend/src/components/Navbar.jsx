import React, { useState } from 'react';
import { FaGoogle, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ user = null, onGoogleSignIn, onSignOut }) => {
  const [activeLink, setActiveLink] = useState('Home');

  const links = ['Home', 'Programs', 'Contact Us', 'Help', 'About Us'];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left Side - Logo and Brand */}
        <div className="navbar-left">
          <div className="navbar-logo">
            <div className="logo-circle">📚</div>
            <span className="brand-text">Study DAO</span>
          </div>
        </div>

        {/* Center - Navigation Links */}
        <div className="navbar-center">
          <ul className="nav-links">
            {links.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className={`nav-link ${activeLink === link ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveLink(link);
                  }}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side - Google Sign-In or Logout Button */}
        <div className="navbar-right">
          {user ? (
            <div className="user-menu">
              <span className="user-email">{user.displayName || user.email}</span>
              <button className="logout-btn" onClick={onSignOut}>
                <FaSignOutAlt className="logout-icon" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button className="google-signin-btn" onClick={onGoogleSignIn}>
              <FaGoogle className="google-icon" />
              <span>Continue with Google</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
