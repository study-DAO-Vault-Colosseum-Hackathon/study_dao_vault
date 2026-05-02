import React from 'react';
import { FaGoogle, FaGithub, FaDiscord, FaMicrosoft, FaApple } from 'react-icons/fa';
import '../pages/Auth.css';

export default function SocialAuthPanel({ onGoogle, onGithub, onDiscord, onMicrosoft, onApple }) {
  return (
    <div style={{ width: 680, display: 'flex', justifyContent: 'center', marginTop: 12 }}>
      <div style={{ width: 420 }}>
        <div className="auth-buttons">
          <button className="auth-btn google" onClick={onGoogle}>
            <FaGoogle className="provider-icon" />
            <span>Continue with Google</span>
          </button>

          <button className="auth-btn github" onClick={onGithub}>
            <FaGithub className="provider-icon" />
            <span>Continue with GitHub</span>
          </button>

          <button className="auth-btn discord" onClick={onDiscord}>
            <FaDiscord className="provider-icon" />
            <span>Continue with Discord</span>
          </button>

          <button className="auth-btn microsoft" onClick={onMicrosoft}>
            <FaMicrosoft className="provider-icon" />
            <span>Continue with Microsoft</span>
          </button>

          <button className="auth-btn apple" onClick={onApple}>
            <FaApple className="provider-icon" />
            <span>Continue with Apple</span>
          </button>
        </div>
      </div>
    </div>
  );
}
