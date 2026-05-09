import React, { useEffect, useState } from 'react';
import { FaCog, FaGoogle, FaSignOutAlt, FaTimes, FaUserCircle, FaCopy, FaCheck } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import NavHeader from '@/components/ui/nav-header';
import './Navbar.css';

const Navbar = ({ user = null, onSignOut, onNavLinkClick }) => {
  const [activeLink, setActiveLink] = useState('Home');
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const [activeUserPanel, setActiveUserPanel] = useState('profile');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userName = user?.displayName || user?.email?.split('@')[0] || 'Student';
  const userEmail = user?.email || 'No email connected';
  const userWalletAddress =
    user?.walletAddress ||
    user?.address ||
    user?.publicKey ||
    user?.wallet?.address ||
    user?.uid ||
    'Wallet not connected';

  const handleCopy = () => {
    if (userWalletAddress && userWalletAddress !== 'Wallet not connected') {
      navigator.clipboard.writeText(userWalletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  const formattedWalletAddress =
    userWalletAddress.length > 9
      ? `${userWalletAddress.slice(0, 3)}...${userWalletAddress.slice(-3)}`
      : userWalletAddress;
  const userInitial = userName.charAt(0).toUpperCase();

  const links = [
    { label: 'Home', value: 'Home' },
    { label: 'Programs', value: 'Programs' },
    { label: 'About us', value: 'About us' },
  ];

  useEffect(() => {
    if (location.pathname === '/study-dao') {
      setActiveLink('Programs');
      setIsUserPanelOpen(false);
      return;
    }

    if (location.pathname === '/hamro-csit') {
      setActiveLink('About us');
      setIsUserPanelOpen(false);
      return;
    }

    setIsUserPanelOpen(false);
    setActiveLink('Home');
  }, [location.pathname]);

  useEffect(() => {
    if (!isUserPanelOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsUserPanelOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isUserPanelOpen]);

  const handleNavClick = (link) => {
    setActiveLink(link);
    if (onNavLinkClick) {
      onNavLinkClick(link);
    }
  };

  const handleUserPanelOpen = () => {
    setActiveUserPanel('profile');
    setIsUserPanelOpen(true);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left Side - Logo and Brand */}
        <div className="navbar-left">
          <div className="navbar-logo">
            <div className="navbar-logo-badge">
              <img
                src="/logo_Hackthon.jpeg"
                alt="EduChainNP logo"
                className="navbar-logo-image"
              />
            </div>
          </div>
        </div>

        {/* Center - Navigation Links */}
        <div className="navbar-center">
          <NavHeader
            items={links}
            activeItem={activeLink}
            onItemClick={handleNavClick}
          />
        </div>

        {/* Right Side - User Info or Sign-In */}
        <div className="navbar-right">
          {!user && (
            <button className="auth-trigger-btn" onClick={() => navigate('/auth')}>
              <span>Login / Sign Up</span>
            </button>
          )}

          {user && (
            <button
              type="button"
              className="user-menu user-menu-trigger"
              onClick={handleUserPanelOpen}
              aria-expanded={isUserPanelOpen}
              aria-label="Open user menu"
            >
              <div className="user-avatar" aria-hidden="true">
                {userInitial}
              </div>
              <div className="user-details">
                <span className="user-name">{userName}</span>
                <span className="user-email">{formattedWalletAddress}</span>
              </div>
            </button>
          )}
        </div>
      </div>

      {user && (
        <>
          <button
            type="button"
            className={`user-panel-backdrop ${isUserPanelOpen ? 'open' : ''}`}
            onClick={() => setIsUserPanelOpen(false)}
            aria-label="Close user panel"
          />

          <aside className={`user-panel-drawer ${isUserPanelOpen ? 'open' : ''}`}>
            <div className="user-panel-header">
              <div>
                <p className="user-panel-eyebrow">Account menu</p>
                <h2>{userName}</h2>
              </div>

              <button
                type="button"
                className="user-panel-close"
                onClick={() => setIsUserPanelOpen(false)}
                aria-label="Close user panel"
              >
                <FaTimes />
              </button>
            </div>

            <div className="user-panel-scroll-area">
              <div className="user-panel-summary">
                <div className="user-panel-avatar">{userInitial}</div>
                <div className="user-panel-info-stack">
                  <p className="user-panel-name">{userName}</p>
                  <div className="user-panel-wallet-wrapper">
                    <p className="user-panel-wallet">{formattedWalletAddress}</p>
                    <button className="copy-address-btn" onClick={handleCopy} title="Copy Address">
                      {copied ? <FaCheck className="copied-icon" /> : <FaCopy />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="user-panel-tabs">
                <button
                  type="button"
                  className={`user-panel-tab ${activeUserPanel === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveUserPanel('profile')}
                >
                  <FaUserCircle />
                  <span>Profile</span>
                </button>

                <button
                  type="button"
                  className={`user-panel-tab ${activeUserPanel === 'settings' ? 'active' : ''}`}
                  onClick={() => setActiveUserPanel('settings')}
                >
                  <FaCog />
                  <span>Settings</span>
                </button>
              </div>

              <div className="user-panel-content">
                {activeUserPanel === 'profile' ? (
                  <div className="user-panel-section">
                    <div className="user-panel-row">
                      <span>Name</span>
                      <strong>{userName}</strong>
                    </div>
                    <div className="user-panel-row">
                      <span>Email</span>
                      <strong>{userEmail}</strong>
                    </div>
                    <div className="user-panel-row">
                      <span>Wallet</span>
                      <strong>{userWalletAddress}</strong>
                    </div>
                  </div>
                ) : (
                  <div className="user-panel-section">
                    <div className="user-panel-row">
                      <span>Profile visibility</span>
                      <strong>Public</strong>
                    </div>
                    <div className="user-panel-row">
                      <span>Wallet status</span>
                      <strong>{userWalletAddress === 'Wallet not connected' ? 'Not connected' : 'Connected'}</strong>
                    </div>
                    <div className="user-panel-row">
                      <span>Sign-in provider</span>
                      <strong>Google</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              className="user-panel-signout"
              onClick={() => {
                setIsUserPanelOpen(false);
                if (onSignOut) {
                  onSignOut();
                }
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
