import React from 'react';
import { FaGoogle, FaGithub, FaDiscord, FaMicrosoft, FaApple } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

export default function Auth({ onGoogleSignIn, onGithubSignIn, onDiscordSignIn, onMicrosoftSignIn, onAppleSignIn }) {
  const navigate = useNavigate();

  const handleProviderSignIn = async (provider) => {
    try {
      // Call the provided handler if present
      if (provider === 'google' && onGoogleSignIn) await onGoogleSignIn();
      if (provider === 'github' && onGithubSignIn) await onGithubSignIn();
      if (provider === 'discord' && onDiscordSignIn) await onDiscordSignIn();
      if (provider === 'microsoft' && onMicrosoftSignIn) await onMicrosoftSignIn();
      if (provider === 'apple' && onAppleSignIn) await onAppleSignIn();
    } catch (err) {
      console.error('Sign in failed', err);
    }

    // After sign-in, go to the Notes icon page (StudyDAO route shows NotesIcon)
    navigate('/study-dao');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" role="main">
        <header className="auth-header">
          <h1 className="platform-title">Study DAO</h1>
          <p className="platform-tag">Your creative workspace</p>
          <p className="privacy-note">We value your privacy. Your login credentials will help to make it easier to personalize your experience.</p>
        </header>

        <div className="auth-buttons">
          <button className="auth-btn google" onClick={() => handleProviderSignIn('google')}>
            <FaGoogle className="provider-icon" />
            <span>Sign in with Google</span>
          </button>

          <button className="auth-btn github" onClick={() => handleProviderSignIn('github')}>
            <FaGithub className="provider-icon" />
            <span>Sign in with GitHub</span>
          </button>

          <button className="auth-btn discord" onClick={() => handleProviderSignIn('discord')}>
            <FaDiscord className="provider-icon" />
            <span>Sign in with Discord</span>
          </button>

          <button className="auth-btn microsoft" onClick={() => handleProviderSignIn('microsoft')}>
            <FaMicrosoft className="provider-icon" />
            <span>Sign in with Microsoft</span>
          </button>

          <button className="auth-btn apple" onClick={() => handleProviderSignIn('apple')}>
            <FaApple className="provider-icon" />
            <span>Sign in with Apple</span>
          </button>
        </div>

        <footer className="auth-footer">
          <p>By continuing, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.</p>
        </footer>
      </div>
    </div>
  );
}
