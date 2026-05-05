import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
} from 'firebase/auth';
import LandingPage from './LandingPage';

const PROVIDERS = [
  { id: 'google', label: 'Google', icon: 'G' },
  { id: 'github', label: 'GitHub', icon: '◆' },
  { id: 'discord', label: 'Discord', icon: '◉' },
  { id: 'microsoft', label: 'Microsoft', icon: '⊞' },
  { id: 'apple', label: 'Apple', icon: '◆' },
];

export default function EduChainNP({ onGoogleSignIn }) {
  const navigate = useNavigate();
  const [showLandingPage] = React.useState(false);
  const [stars] = React.useState(() => 
    Array.from({ length: 60 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.4,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }))
  );

  const handleProviderClick = async (providerId) => {
    try {
      let provider;
      switch (providerId) {
        case 'google':
          provider = new GoogleAuthProvider();
          provider.addScope('profile');
          provider.addScope('email');
          break;
        case 'github':
          provider = new GithubAuthProvider();
          provider.addScope('user:email');
          break;
        case 'discord':
          provider = new OAuthProvider('discord.com');
          provider.addScope('identify email');
          break;
        case 'microsoft':
          provider = new OAuthProvider('microsoft.com');
          provider.addScope('openid profile email');
          break;
        case 'apple':
          provider = new OAuthProvider('apple.com');
          break;
        default:
          throw new Error(`Unknown provider: ${providerId}`);
      }

      const result = await signInWithPopup(auth, provider);
      if (result && result.user) {
        console.log(`Successfully authenticated: ${result.user.email}`);
        console.log('Navigating to /hamro-csit...');
        navigate('/hamro-csit', { replace: true });
      } else {
        throw new Error('No user returned from sign-in');
      }
    } catch (error) {
      console.error(`Sign-in failed for ${providerId}:`, error);
      alert(`Sign-in failed: ${error.message}`);
    }
  };

  if (showLandingPage) {
    return <LandingPage onGoogleSignIn={onGoogleSignIn} />;
  }

  return (
    <div className="study-dao-page">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .study-dao-page {
          min-height: 100vh;
          background: #0a1628;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: 'Georgia', 'Garamond', serif;
          color: #c9a227;
        }

        /* Starfield Background */
        .starfield {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .star {
          position: absolute;
          background: #ffffff;
          border-radius: 50%;
          animation: twinkle var(--duration, 3s) ease-in-out var(--delay, 0s) infinite;
        }

        @keyframes twinkle {
          0%, 100% { opacity: var(--opacity, 0.4); }
          50% { opacity: 1; }
        }

        .content-wrapper {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 600px;
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: fadeIn 1s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Logo Ring */
        .logo-section {
          position: relative;
          width: 140px;
          height: 140px;
          margin-bottom: 30px;
          animation: logoFadeIn 1s ease-out 0.2s forwards;
          opacity: 0;
        }

        @keyframes logoFadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

        .logo-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid #c9a227;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 64px;
          font-weight: bold;
          color: #c9a227;
          animation: rotateRing 20s linear infinite;
        }

        @keyframes rotateRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .logo-glow {
          position: absolute;
          width: 110%;
          height: 110%;
          border: 1px solid rgba(201, 162, 39, 0.3);
          border-radius: 50%;
          animation: pulseGlow 3s ease-in-out infinite;
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }

        /* Title Section */
        .title-section {
          text-align: center;
          margin-bottom: 40px;
          animation: titleFadeIn 1s ease-out 0.4s forwards;
          opacity: 0;
        }

        @keyframes titleFadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .main-title {
          font-size: 3rem;
          font-weight: 700;
          letter-spacing: 8px;
          color: #c9a227;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .tagline {
          font-size: 0.95rem;
          color: rgba(201, 162, 39, 0.7);
          font-style: italic;
          letter-spacing: 2px;
        }

        /* Book Illustration */
        .book-section {
          margin-bottom: 50px;
          animation: bookFadeIn 1s ease-out 0.6s forwards;
          opacity: 0;
        }

        @keyframes bookFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .book-container {
          position: relative;
          width: 200px;
          height: 150px;
          cursor: pointer;
          perspective: 1200px;
        }

        .book {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          animation: bookBounce 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes bookBounce {
          0% { transform: translateY(30px) scale(0.8); opacity: 0; }
          60% { transform: translateY(-5px) scale(1); }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }

        .book-container:hover .book {
          animation: bookHover 0.6s ease-out forwards;
        }

        @keyframes bookHover {
          0% { transform: translateY(0) scale(1); filter: brightness(1); }
          100% { transform: translateY(-15px) scale(1.05); filter: brightness(1.2); }
        }

        .book-spine {
          position: absolute;
          left: 50%;
          top: 0;
          width: 6px;
          height: 100%;
          background: linear-gradient(90deg, #8b6f47, #c9a227, #8b6f47);
          transform: translateX(-50%);
          box-shadow: 0 0 20px rgba(201, 162, 39, 0.6);
          animation: spineGlow 2s ease-in-out infinite;
          z-index: 10;
        }

        @keyframes spineGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(201, 162, 39, 0.6); }
          50% { box-shadow: 0 0 40px rgba(201, 162, 39, 1); }
        }

        .book-page {
          position: absolute;
          width: 95px;
          height: 100%;
          background: linear-gradient(90deg, #f5ede3 0%, #f9f3ec 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          padding: 12px 8px;
          border-radius: 2px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        .book-page-left {
          left: 0;
          border-radius: 0 2px 2px 0;
          animation: pageFlipLeftSeq 5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
          transform-origin: right center;
        }

        .book-page-right {
          right: 0;
          border-radius: 2px 0 0 2px;
          animation: pageFlipRightSeq 5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
          transform-origin: left center;
        }

        @keyframes pageFlipLeftSeq {
          0%, 10% { transform: rotateY(0deg) rotateZ(0deg); }
          25%, 30% { transform: rotateY(-180deg) rotateZ(1deg); }
          45%, 100% { transform: rotateY(0deg) rotateZ(0deg); }
        }

        @keyframes pageFlipRightSeq {
          0%, 35% { transform: rotateY(0deg) rotateZ(0deg); }
          50%, 55% { transform: rotateY(180deg) rotateZ(-1deg); }
          70%, 100% { transform: rotateY(0deg) rotateZ(0deg); }
        }

        .page-lines {
          display: flex;
          flex-direction: column;
          gap: 5px;
          width: 100%;
        }

        .line {
          height: 1px;
          background: rgba(139, 111, 71, 0.3);
          width: 85%;
        }

        /* Divider */
        .divider-section {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 40px;
          animation: dividerFadeIn 1s ease-out 0.8s forwards;
          opacity: 0;
        }

        @keyframes dividerFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgba(201, 162, 39, 0), #c9a227, rgba(201, 162, 39, 0));
        }

        .divider-text {
          font-size: 0.85rem;
          color: rgba(201, 162, 39, 0.6);
          letter-spacing: 2px;
          white-space: nowrap;
          text-transform: uppercase;
        }

        /* Sign-in Buttons */
        .buttons-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 40px;
          animation: buttonsFadeIn 1s ease-out 1s forwards;
          opacity: 0;
        }

        @keyframes buttonsFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .signin-btn {
          width: 100%;
          padding: 14px 20px;
          background: rgba(10, 22, 40, 0.6);
          border: 2px solid #c9a227;
          border-radius: 8px;
          color: #c9a227;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 1px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
          font-family: 'Segoe UI', sans-serif;
        }

        .signin-btn:hover {
          background: rgba(201, 162, 39, 0.15);
          box-shadow: 0 0 15px rgba(201, 162, 39, 0.4);
          transform: translateY(-2px);
        }

        .signin-btn:active {
          transform: translateY(0);
        }

        .btn-icon {
          font-size: 1.1rem;
        }

        /* Footer */
        .footer-section {
          text-align: center;
          margin-top: 30px;
          animation: footerFadeIn 1s ease-out 1.2s forwards;
          opacity: 0;
        }

        @keyframes footerFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .footer-links {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 12px;
        }

        .footer-link {
          color: rgba(201, 162, 39, 0.7);
          text-decoration: none;
          font-size: 0.85rem;
          transition: color 0.3s ease;
          font-family: 'Segoe UI', sans-serif;
        }

        .footer-link:hover {
          color: #c9a227;
        }

        .footer-credit {
          font-size: 0.8rem;
          color: rgba(201, 162, 39, 0.5);
          margin-top: 10px;
          font-family: 'Segoe UI', sans-serif;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .content-wrapper {
            padding: 30px 16px;
          }

          .main-title {
            font-size: 2.2rem;
            letter-spacing: 4px;
          }

          .tagline {
            font-size: 0.85rem;
          }

          .logo-section {
            width: 110px;
            height: 110px;
            margin-bottom: 25px;
          }

          .logo-ring {
            font-size: 48px;
          }

          .book-container {
            width: 160px;
            height: 120px;
          }

          .divider-text {
            font-size: 0.75rem;
          }

          .signin-btn {
            padding: 12px 16px;
            font-size: 0.9rem;
          }

          .footer-links {
            gap: 15px;
          }
        }
      `}</style>

      {/* Starfield */}
      <div className="starfield">
        {stars.map((star, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              '--opacity': star.opacity,
              '--duration': `${star.duration}s`,
              '--delay': `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="content-wrapper">
        {/* Logo */}
        <div className="logo-section">
          <div className="logo-glow" />
          <div className="logo-ring">S</div>
        </div>

        {/* Title */}
        <div className="title-section">
          <h1 className="main-title">EDUCHAIN NP</h1>
          <p className="tagline">your knowledge · your reputation</p>
        </div>

        {/* Book */}
        <div className="book-section">
          <div className="book-container">
            <div className="book">
              <div className="book-spine" />
              <div className="book-page book-page-left">
                <div className="page-lines">
                  <div className="line" />
                  <div className="line" />
                  <div className="line" />
                  <div className="line" />
                  <div className="line" />
                  <div className="line" />
                </div>
              </div>
              <div className="book-page book-page-right">
                <div className="page-lines">
                  <div className="line" />
                  <div className="line" />
                  <div className="line" />
                  <div className="line" />
                  <div className="line" />
                  <div className="line" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="divider-section">
          <div className="divider-line" />
          <span className="divider-text">Sign In To Continue</span>
          <div className="divider-line" />
        </div>

        {/* Sign-in Buttons */}
        <div className="buttons-section">
          {PROVIDERS.map((provider) => (
            <button
              key={provider.id}
              className="signin-btn"
              onClick={() => handleProviderClick(provider.id)}
            >
              <span className="btn-icon">{provider.icon}</span>
              <span>Continue with {provider.label}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="footer-section">
          <div className="footer-links">
            <a href="#terms" className="footer-link">
              Terms of Service
            </a>
            <span style={{ color: 'rgba(201, 162, 39, 0.3)' }}>·</span>
            <a href="#privacy" className="footer-link">
              Privacy Policy
            </a>
          </div>
          <div className="footer-credit">
            Powered by Solana Devnet · Gasless transactions
          </div>
        </div>
      </div>
    </div>
  );
}
