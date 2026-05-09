import React, { useState } from 'react';
import { FaGoogle, FaGithub, FaDiscord, FaMicrosoft, FaApple, FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { magic } from '../utils/magic';
import './Auth.css';

export default function Auth({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleMagicLogin = async (e) => {
    e.preventDefault();
    if (!email || !magic) return;

    setIsLoggingIn(true);
    try {
      // 1. Trigger Magic Link login
      const didToken = await magic.auth.loginWithMagicLink({ email });
      
      // 2. Send DID token to backend for verification
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${didToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // The App.jsx will handle the user state update via verifyWithBackend if we redirect,
        // but for immediate feedback we can do it here too.
        if (onLoginSuccess) onLoginSuccess(data);
        navigate('/study-dao');
      } else {
        throw new Error('Backend verification failed');
      }
    } catch (err) {
      console.error('Magic Link login failed', err);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    if (!magic) {
        alert('Magic SDK not initialized properly.');
        return;
    }
    
    try {
      // Use window.location.origin to ensure the redirect goes back to the home page
      // where App.jsx will handle the result.
      await magic.oauth.loginWithRedirect({
        provider,
        redirectURI: `${window.location.origin}/`, 
      });
    } catch (err) {
      console.error(`${provider} login failed`, err);
      alert(`${provider} login failed: ${err.message}`);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" role="main">
        <header className="auth-header">
          <h1 className="platform-title">EduChainNP</h1>
          <p className="platform-tag">Your creative workspace</p>
        </header>

        <form onSubmit={handleMagicLogin} className="magic-form">
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
            />
          </div>
          <button type="submit" className="auth-btn magic" disabled={isLoggingIn}>
            {isLoggingIn ? 'Sending link...' : 'Continue with Email'}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="auth-buttons">
          <button className="auth-btn google" onClick={() => handleSocialLogin('google')}>
            <FaGoogle className="provider-icon" />
            <span>Continue with Google</span>
          </button>

          <div className="social-grid">
            <button className="social-btn" onClick={() => handleSocialLogin('github')} title="GitHub">
              <FaGithub />
            </button>
            <button className="social-btn" onClick={() => handleSocialLogin('discord')} title="Discord">
              <FaDiscord />
            </button>
            <button className="social-btn" onClick={() => handleSocialLogin('microsoft')} title="Microsoft">
              <FaMicrosoft />
            </button>
            <button className="social-btn" onClick={() => handleSocialLogin('apple')} title="Apple">
              <FaApple />
            </button>
          </div>
        </div>

        <footer className="auth-footer">
          <p>By continuing, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.</p>
        </footer>
      </div>
    </div>
  );
}
