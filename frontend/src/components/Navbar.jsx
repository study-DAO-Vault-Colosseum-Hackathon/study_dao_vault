import React, { useEffect, useState } from 'react';
import { FaCog, FaGoogle, FaSignOutAlt, FaTimes, FaUserCircle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import NavHeader from '@/components/ui/nav-header';
import './Navbar.css';

const Navbar = ({ user = null, onSignOut, onNavLinkClick }) => {
  const [activeLink, setActiveLink] = useState('/');
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const [activeUserPanel, setActiveUserPanel] = useState('profile');
  
  const navigate = useNavigate();
  const location = useLocation();

  // User Data Helpers
  const userName = user?.displayName || user?.email?.split('@')[0] || 'Student';
  const userEmail = user?.email || 'No email connected';
  const userWalletAddress =
    user?.walletAddress ||
    user?.address ||
    user?.publicKey ||
    user?.wallet?.address ||
    user?.uid ||
    'Wallet not connected';
    
  const formattedWalletAddress =
    userWalletAddress.length > 9
      ? `${userWalletAddress.slice(0, 3)}...${userWalletAddress.slice(-3)}`
      : userWalletAddress;
      
  const userInitial = userName.charAt(0).toUpperCase();

  // Define Links: Routes start with "/", Section IDs do not.
  const links = [
    { label: 'Home', value: '/' },
    { label: 'Programs', value: 'programs' },
    { label: 'About us', value: 'about' },
    { label: 'QA', value: '/qa' },
  ];

  // Logic to handle highlighting based on current URL
  useEffect(() => {
    const path = location.pathname;

    if (path === '/qa') {
      setActiveLink('/qa');
    } else if (path === '/study-dao') {
      setActiveLink('programs');
    } else if (path === '/hamro-csit') {
      setActiveLink('about');
    } else {
      setActiveLink('/');
    }

    setIsUserPanelOpen(false);
  }, [location.pathname]);

  // Accessibility: Close panel on Escape key
  useEffect(() => {
    if (!isUserPanelOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsUserPanelOpen(false);
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isUserPanelOpen]);

  const handleNavClick = (linkValue) => {
    setActiveLink(linkValue);

    if (linkValue.startsWith('/')) {
      // 1. Internal Routing
      navigate(linkValue);
    } else {
      // 2. Single Page Scrolling
      if (location.pathname !== '/') {
        // If we are on /qa, go home first, then scroll
        navigate('/');
        setTimeout(() => {
          document.getElementById(linkValue)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        // If already home, just scroll
        document.getElementById(linkValue)?.scrollIntoView({ behavior: 'smooth' });
      }
    }

    if (onNavLinkClick) {
      onNavLinkClick(linkValue);
    }
  };

  const handleUserPanelOpen = () => {
    setActiveUserPanel('profile');
    setIsUserPanelOpen(true);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left Side - Logo */}
        <div className="navbar-left">
          <div className="navbar-logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
            <div className="navbar-logo-badge">
              <img
                src="/logo_Hackthon.jpeg"
                alt="EduChainNP logo"
                className="navbar-logo-image"
              />
            </div>
          </div>
        </div>

        {/* Center - Combined Nav (Router + Scroll) */}
        <div className="navbar-center">
          <NavHeader
            items={links}
            activeItem={activeLink}
            onItemClick={handleNavClick}
          />
        </div>

        {/* Right Side - User Controls */}
        <div className="navbar-right">
          {!user ? (
            <button className="google-signin-btn" onClick={() => navigate('/study-dao')}>
              <FaGoogle className="google-icon" />
              <span>Sign In</span>
            </button>
          ) : (
            <button
              type="button"
              className="user-menu user-menu-trigger"
              onClick={handleUserPanelOpen}
              aria-expanded={isUserPanelOpen}
            >
              <div className="user-avatar">{userInitial}</div>
              <div className="user-details">
                <span className="user-name">{userName}</span>
                <span className="user-email">{formattedWalletAddress}</span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* User Panel Drawer */}
      {user && (
        <>
          <div
            className={`user-panel-backdrop ${isUserPanelOpen ? 'open' : ''}`}
            onClick={() => setIsUserPanelOpen(false)}
          />

          <aside className={`user-panel-drawer ${isUserPanelOpen ? 'open' : ''}`}>
            <div className="user-panel-header">
              <div>
                <p className="user-panel-eyebrow">Account menu</p>
                <h2>{userName}</h2>
              </div>
              <button className="user-panel-close" onClick={() => setIsUserPanelOpen(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="user-panel-scroll-area">
              <div className="user-panel-summary">
                <div className="user-panel-avatar">{userInitial}</div>
                <div>
                  <p className="user-panel-name">{userName}</p>
                  <p className="user-panel-wallet">{formattedWalletAddress}</p>
                </div>
              </div>

              <div className="user-panel-tabs">
                <button
                  className={`user-panel-tab ${activeUserPanel === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveUserPanel('profile')}
                >
                  <FaUserCircle /> <span>Profile</span>
                </button>
                <button
                  className={`user-panel-tab ${activeUserPanel === 'settings' ? 'active' : ''}`}
                  onClick={() => setActiveUserPanel('settings')}
                >
                  <FaCog /> <span>Settings</span>
                </button>
              </div>

              <div className="user-panel-content">
                {activeUserPanel === 'profile' ? (
                  <div className="user-panel-section">
                    <div className="user-panel-row"><span>Name</span><strong>{userName}</strong></div>
                    <div className="user-panel-row"><span>Email</span><strong>{userEmail}</strong></div>
                    <div className="user-panel-row"><span>Wallet</span><strong>{userWalletAddress}</strong></div>
                  </div>
                ) : (
                  <div className="user-panel-section">
                    <div className="user-panel-row"><span>Status</span><strong>Connected</strong></div>
                    <div className="user-panel-row"><span>Provider</span><strong>Google</strong></div>
                  </div>
                )}
              </div>
            </div>

            <button
              className="user-panel-signout"
              onClick={() => {
                setIsUserPanelOpen(false);
                onSignOut?.();
              }}
            >
              <FaSignOutAlt />
              <span>Sign Out</span>
            </button>
          </aside>
        </>
      )}
    </nav>
  );
};

export default Navbar;