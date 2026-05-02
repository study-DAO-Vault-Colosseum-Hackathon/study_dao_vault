import React from 'react';
import './StudyDAO.css';
import LandingPage from './LandingPage';

const BRAND_NAME = 'NOTES';
const TAGLINE = 'your thoughts, kept';
const Heading='We maintain the highest standards of privacy and security. Your login credentials are used exclusively to create and secure your wallet.'

const providers = [
  {
    id: 'google',
    label: 'Google',
    className: 'google',
    ariaLabel: 'Continue with Google',
    icon: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path fill="#ffffff" d="M21.35 11.1H12v2.98h5.35a4.56 4.56 0 0 1-1.98 3.08v2.56h3.21c1.88-1.73 2.97-4.28 2.97-7.31 0-.9-.08-1.58-.2-2.31Z" />
        <path fill="#ffffff" d="M12 22c2.7 0 4.97-.9 6.63-2.43l-3.21-2.56c-.89.6-2.02.95-3.42.95-2.63 0-4.86-1.78-5.65-4.19H2.98v2.62C4.63 19.54 8 22 12 22Z" opacity="0.96" />
        <path fill="#ffffff" d="M6.35 13.77a5.95 5.95 0 0 1 0-3.54V7.61H2.98a9.99 9.99 0 0 0 0 8.78l3.37-2.62Z" opacity="0.96" />
        <path fill="#ffffff" d="M12 5.88c1.46 0 2.77.5 3.8 1.47l2.83-2.82A9.72 9.72 0 0 0 12 2C8 2 4.63 4.46 2.98 7.61l3.37 2.62C7.14 7.66 9.37 5.88 12 5.88Z" opacity="0.96" />
      </svg>
    ),
  },
  {
    id: 'github',
    label: 'GitHub',
    className: 'github',
    ariaLabel: 'Continue with GitHub',
    icon: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path fill="#ffffff" d="M12 .5a11.5 11.5 0 0 0-3.64 22.4c.57.1.78-.25.78-.56v-2.1c-3.18.69-3.85-1.3-3.85-1.3-.52-1.34-1.28-1.7-1.28-1.7-1.05-.73.08-.72.08-.72 1.17.08 1.8 1.2 1.8 1.2 1.04 1.79 2.74 1.27 3.41.97.1-.76.4-1.28.74-1.57-2.52-.29-5.17-1.28-5.17-5.7 0-1.26.45-2.3 1.2-3.1-.12-.3-.52-1.47.11-3.05 0 0 .98-.32 3.2 1.2a11.2 11.2 0 0 1 5.83 0c2.22-1.52 3.2-1.2 3.2-1.2.63 1.58.23 2.75.11 3.05.75.8 1.2 1.84 1.2 3.1 0 4.43-2.66 5.41-5.2 5.69.41.35.79 1.08.79 2.18v3.23c0 .31.21.67.78.56A11.5 11.5 0 0 0 12 .5Z" />
      </svg>
    ),
  },
  {
    id: 'discord',
    label: 'Discord',
    className: 'discord',
    ariaLabel: 'Continue with Discord',
    icon: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path fill="#ffffff" d="M19.5 5.2A16.3 16.3 0 0 0 15.9 4l-.18.37a14.2 14.2 0 0 1 2.36 1.12 12 12 0 0 0-7.08-1.05 12.4 12.4 0 0 0-5.16 1.04A14.6 14.6 0 0 1 8.17 4l-.18-.37a16.3 16.3 0 0 0-3.6 1.2C2.7 8.3 2.16 11.67 2.4 15.02a16.3 16.3 0 0 0 4.9 2.48l.58-.96c-.72-.27-1.4-.6-2.05-.97.17-.12.33-.24.49-.38 3.94 1.86 8.29 1.86 12.2 0 .16.14.32.26.49.38-.65.37-1.33.7-2.05.97l.58.96a16.3 16.3 0 0 0 4.9-2.48c.31-3.88-.5-7.22-2.36-9.82Zm-10.1 8.45c-.9 0-1.63-.84-1.63-1.88s.73-1.88 1.64-1.88c.9 0 1.63.84 1.63 1.88s-.73 1.88-1.64 1.88Zm5.38 0c-.9 0-1.63-.84-1.63-1.88s.73-1.88 1.64-1.88c.9 0 1.63.84 1.63 1.88s-.73 1.88-1.64 1.88Z" />
      </svg>
    ),
  },
  {
    id: 'microsoft',
    label: 'Microsoft',
    className: 'microsoft',
    ariaLabel: 'Continue with Microsoft',
    icon: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="3" y="3" width="8" height="8" fill="#f25022" />
        <rect x="13" y="3" width="8" height="8" fill="#7fba00" />
        <rect x="3" y="13" width="8" height="8" fill="#00a4ef" />
        <rect x="13" y="13" width="8" height="8" fill="#ffb900" />
      </svg>
    ),
  },
  {
    id: 'apple',
    label: 'Apple',
    className: 'apple',
    ariaLabel: 'Continue with Apple',
    icon: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path fill="#ffffff" d="M16.7 13.1c0-1.76 1.01-3.28 2.55-4.13-1.02-1.42-2.58-2.26-4.05-2.26-1.6 0-2.33.76-3.41.76-1.12 0-2-.76-3.37-.76-2.1 0-4.28 1.83-4.28 5.25 0 2.14.83 4.41 1.85 5.88.87 1.22 1.61 2.07 2.7 2.07 1.05 0 1.47-.68 2.78-.68 1.34 0 1.69.66 2.78.66 1.09 0 1.82-.9 2.5-1.97.77-1.17 1.09-2.3 1.09-2.36-.02-.01-2.09-.8-2.14-3.46Zm-2.2-5.87c.72-.86 1.22-2.03 1.09-3.19-1.04.04-2.32.69-3.06 1.55-.67.75-1.25 1.93-1.1 3.08 1.14.08 2.33-.58 3.07-1.44Z" />
      </svg>
    ),
  },
];

export default function StudyDAO({ onGoogleSignIn }) {
  const [showAnimation, setShowAnimation] = React.useState(false);
  const [showLoading, setShowLoading] = React.useState(false);
  const [loadingProgress, setLoadingProgress] = React.useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = React.useState(0);
  const [showLandingPage, setShowLandingPage] = React.useState(false);

  const loadingMessages = [
    'Verifying your account…',
    'Fetching your profile…',
    'Loading the platform…'
  ];

  const handleStartAnimation = () => {
    setShowAnimation(true);
  };

  const handleProviderClick = (providerId) => {
    // Show loading overlay
    setShowLoading(true);
    setLoadingProgress(0);
    setLoadingMessageIndex(0);

    // Simulate progress bar
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 30;
      });
    }, 200);

    // Rotate messages
    const messageInterval = setInterval(() => {
      setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 800);

    // After 2.5 seconds, complete the loading and show landing page
    setTimeout(() => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      setLoadingProgress(100);
      
      // Brief pause then show landing page
      setTimeout(() => {
        setShowLoading(false);
        setShowLandingPage(true);
      }, 300);
    }, 2500);

    if (providerId === 'google' && onGoogleSignIn) {
      // Trigger the actual sign-in after showing the animation
      setTimeout(() => {
        onGoogleSignIn();
      }, 2800);
    }
  };

  React.useEffect(() => {
    if (showAnimation) {
      const particlesContainer = document.getElementById('particles-container');
      if (particlesContainer) {
        for (let i = 0; i < 80; i++) {
          const particle = document.createElement('div');
          particle.className = 'particle';
          const angle = (i / 80) * Math.PI * 2;
          const distance = 300 + Math.random() * 400;
          const tx = Math.cos(angle) * distance;
          const ty = Math.sin(angle) * distance;
          const size = 2 + Math.random() * 6;
          const duration = 2 + Math.random() * 2;
          
          particle.style.setProperty('--tx', `${tx}px`);
          particle.style.setProperty('--ty', `${ty}px`);
          particle.style.width = `${size}px`;
          particle.style.height = `${size}px`;
          particle.style.left = `50%`;
          particle.style.top = `50%`;
          particle.style.animationDuration = `${duration}s`;
          particle.style.animationDelay = `${0.8 + Math.random() * 0.5}s`;
          
          particlesContainer.appendChild(particle);
        }
      }
    }
  }, [showAnimation]);

  return (
    <>
      {showLandingPage ? (
        <LandingPage onGoogleSignIn={onGoogleSignIn} />
      ) : (
        <main className="notes-premium-page">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .notes-premium-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0d1424 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          position: relative;
          overflow: hidden;
          font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
          color: #fff;
          padding: 28px 20px 40px;
        }

        .auth-stage {
          position: relative;
          width: 100%;
          max-width: 760px;
          min-height: 560px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 24px;
        }

        /* ============= INITIAL MINIMAL STATE ============= */
        .initial-state {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
          background: transparent;
          opacity: 1;
          transition: opacity 0.8s ease-out;
        }

        .initial-state.hidden {
          opacity: 0;
          pointer-events: none;
        }

        .minimal-sign-in-btn {
          padding: 18px 56px;
          font-size: 1.1rem;
          font-weight: 600;
          letter-spacing: 2px;
          color: #fbbf24;
          background: transparent;
          border: 2px solid #fbbf24;
          border-radius: 60px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.3), inset 0 0 20px rgba(251, 191, 36, 0.1);
          position: relative;
          overflow: hidden;
        }

        .minimal-sign-in-btn:hover {
          border-color: #fef08a;
          color: #fef08a;
          box-shadow: 0 0 40px rgba(251, 191, 36, 0.6), inset 0 0 30px rgba(251, 191, 36, 0.2);
        }

        /* ============= CINEMATIC ANIMATION ============= */
        .animation-container {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 20;
          opacity: 0;
          pointer-events: none;
          background: linear-gradient(135deg, rgba(10, 14, 39, 0.18) 0%, rgba(26, 31, 58, 0.18) 50%, rgba(13, 20, 36, 0.18) 100%);
        }

        .animation-container.active {
          opacity: 1;
          pointer-events: auto;
        }

        /* Golden light burst */
        .light-burst {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, #fef08a 0%, #fbbf24 30%, transparent 70%);
          opacity: 0;
          animation: burstExpand 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes burstExpand {
          0% { opacity: 0; transform: scale(0); }
          40% { opacity: 1; }
          100% { opacity: 0; transform: scale(2.5); }
        }

        /* Ancient book */
        .enchanted-book {
          position: relative;
          width: 280px;
          height: 200px;
          animation: bookRise 1.5s ease-out 0.4s forwards;
          opacity: 0;
          z-index: 10;
        }

        @keyframes bookRise {
          from { opacity: 0; transform: translateY(100px) scale(0.8); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .book-spine {
          position: absolute;
          left: 50%;
          top: 0;
          width: 8px;
          height: 100%;
          background: linear-gradient(90deg, #d97706, #f59e0b, #d97706);
          transform: translateX(-50%);
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.6);
        }

        .book-page {
          position: absolute;
          width: 140px;
          height: 200px;
          background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: -2px 10px 30px rgba(0, 0, 0, 0.5);
        }

        .book-page-left {
          left: 0;
          border-radius: 0 8px 8px 0;
          animation: pageFlipLeft 2s ease-in-out 0.6s infinite;
          transform-origin: right center;
          box-shadow: -5px 10px 40px rgba(251, 191, 36, 0.4);
        }

        .book-page-right {
          right: 0;
          border-radius: 8px 0 0 8px;
          animation: pageFlipRight 2s ease-in-out 0.6s infinite;
          transform-origin: left center;
          box-shadow: 5px 10px 40px rgba(251, 191, 36, 0.4);
        }

        @keyframes pageFlipLeft {
          0%, 100% { transform: rotateY(0deg); }
          50% { transform: rotateY(-180deg); }
        }

        @keyframes pageFlipRight {
          0%, 100% { transform: rotateY(0deg); }
          50% { transform: rotateY(180deg); }
        }

        .page-lines {
          position: absolute;
          width: 90%;
          height: 80%;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          opacity: 0.6;
        }

        .line {
          height: 2px;
          background: rgba(139, 69, 19, 0.4);
          border-radius: 1px;
          width: 85%;
        }

        /* Light beam */
        .light-beam {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          animation: beamRadiate 1.5s ease-out 0.8s forwards;
        }

        @keyframes beamRadiate {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(3); }
        }

        .beam-ray {
          position: absolute;
          background: linear-gradient(90deg, transparent, #fef08a, transparent);
          opacity: 0.8;
          filter: blur(8px);
        }

        .beam-ray-1 { width: 100%; height: 2px; top: 50%; left: 0; }
        .beam-ray-2 { width: 2px; height: 100%; left: 50%; top: 0; }
        .beam-ray-3 { width: 141%; height: 141%; top: -20.5%; left: -20.5%; background: conic-gradient(from 0deg, transparent, #fbbf24, transparent); }

        /* Ethereal owl */
        .ethereal-owl {
          position: absolute;
          width: 200px;
          height: 200px;
          opacity: 0;
          animation: owlEmerge 1.8s ease-out 1s forwards;
          filter: drop-shadow(0 0 30px rgba(251, 191, 36, 0.8)) drop-shadow(0 0 60px rgba(251, 191, 36, 0.4));
        }

        @keyframes owlEmerge {
          0% { opacity: 0; transform: translate(0, 60px) scale(0.5); }
          50% { opacity: 1; }
          100% { opacity: 1; transform: translate(0, 0) scale(1); }
        }

        /* Magical particles */
        .magical-particles {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          background: radial-gradient(circle, #fef08a, #fbbf24, transparent);
          border-radius: 50%;
          opacity: 0;
          animation: particleFloat 3s ease-out forwards;
          filter: blur(0.5px);
        }

        @keyframes particleFloat {
          0% { opacity: 0.8; }
          100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0); }
        }

        /* ============= MAIN CONTENT ============= */
        .premium-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 600px;
          margin: 10px auto 0;
          opacity: 0;
          animation: contentFadeIn 0.8s ease-out 5s forwards;
        }

        @keyframes contentFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Background particles */
        .notes-premium-page::before,
        .notes-premium-page::after {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .notes-premium-page::before {
          background: 
            radial-gradient(2px 2px at 20px 30px, #ecc94b, rgba(236, 201, 75, 0)),
            radial-gradient(2px 2px at 60px 70px, #f6ad55, rgba(246, 173, 85, 0)),
            radial-gradient(1px 1px at 50px 50px, #fff, rgba(255, 255, 255, 0)),
            radial-gradient(1px 1px at 130px 80px, #ecc94b, rgba(236, 201, 75, 0)),
            radial-gradient(2px 2px at 90px 10px, #f6ad55, rgba(246, 173, 85, 0));
          background-repeat: repeat;
          background-size: 200px 200px;
          animation: floatParticles 20s linear infinite;
          opacity: 0.5;
        }

        .notes-premium-page::after {
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="0.5" fill="%23ecc94b" opacity="0.3"/></svg>');
          animation: floatParticles 30s linear infinite reverse;
          opacity: 0.3;
        }

        @keyframes floatParticles {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(50px, 50px) rotate(180deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }

        /* Logo Section */
        .logo-container {
          position: relative;
          width: 240px;
          height: 240px;
          margin-bottom: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-rings {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }

        .logo-ring-outer {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2px solid rgba(236, 201, 75, 0.3);
          border-radius: 50%;
          animation: rotateRing 20s linear infinite;
        }

        .logo-ring-middle {
          position: absolute;
          width: 85%;
          height: 85%;
          border: 1px solid rgba(236, 201, 75, 0.2);
          border-radius: 50%;
          top: 7.5%;
          left: 7.5%;
          animation: rotateRing 15s linear infinite reverse;
        }

        .logo-ring-inner {
          position: absolute;
          width: 70%;
          height: 70%;
          border: 1px solid rgba(236, 201, 75, 0.15);
          border-radius: 50%;
          top: 15%;
          left: 15%;
          animation: rotateRing 10s linear infinite;
        }

        @keyframes rotateRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .logo-glow {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(236, 201, 75, 0.2), transparent 70%);
          filter: blur(20px);
          animation: pulseGlow 3s ease-in-out infinite;
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        .logo-svg {
          position: absolute;
          width: 160px;
          height: 160px;
          filter: drop-shadow(0 0 20px rgba(236, 201, 75, 0.6)) drop-shadow(0 0 40px rgba(236, 201, 75, 0.3));
          animation: floatLogo 4s ease-in-out infinite;
        }

        @keyframes floatLogo {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        /* Title Section */
        .title-section {
          text-align: center;
          margin-bottom: 40px;
        }

        .premium-title {
          font-size: 4rem;
          font-weight: 700;
          letter-spacing: 8px;
          background: linear-gradient(180deg, #ecc94b 0%, #f6ad55 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 12px;
          text-shadow: 0 0 30px rgba(236, 201, 75, 0.4);
          filter: drop-shadow(0 0 20px rgba(236, 201, 75, 0.3));
        }

        .premium-subtitle {
          font-size: 1.1rem;
          color: rgba(236, 201, 75, 0.8);
          font-style: italic;
          letter-spacing: 2px;
          font-weight: 300;
        }

        /* Indicator Dots */
        .indicator-dots {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-bottom: 40px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(236, 201, 75, 0.3);
          transition: all 0.3s ease;
        }

        .dot.active {
          background: #ecc94b;
          box-shadow: 0 0 12px rgba(236, 201, 75, 0.8);
          width: 24px;
          border-radius: 4px;
        }

        /* Buttons Container */
        .auth-buttons-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
          margin-bottom: 40px;
        }

        .premium-button {
          width: 100%;
          padding: 16px 24px;
          border: none;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .premium-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: inherit;
          border-radius: inherit;
          filter: brightness(1.2);
          opacity: 0;
          transition: opacity 0.3s;
          z-index: -1;
        }

        .premium-button:hover::before {
          opacity: 1;
        }

        .premium-button:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
        }

        .premium-button:active {
          transform: translateY(-2px);
        }

        .premium-button svg {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .premium-button.google {
          background: linear-gradient(135deg, #6c47ff 0%, #7c55ff 100%);
          color: #fff;
          box-shadow: 0 8px 20px rgba(108, 71, 255, 0.3);
        }

        .premium-button.google:hover {
          box-shadow: 0 12px 32px rgba(108, 71, 255, 0.5);
        }

        .premium-button.github {
          background: #1a1a1a;
          color: #fff;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(236, 201, 75, 0.1);
        }

        .premium-button.github:hover {
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(236, 201, 75, 0.2);
          border-color: rgba(236, 201, 75, 0.3);
        }

        .premium-button.discord {
          background: linear-gradient(135deg, #5865f2 0%, #6d77ff 100%);
          color: #fff;
          box-shadow: 0 8px 20px rgba(88, 101, 242, 0.3);
        }

        .premium-button.discord:hover {
          box-shadow: 0 12px 32px rgba(88, 101, 242, 0.5);
        }

        .premium-button.microsoft {
          background: #f5f5f5;
          color: #1a1a1a;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .premium-button.microsoft:hover {
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(236, 201, 75, 0.15);
          background: #fff;
        }

        .premium-button.apple {
          background: #000;
          color: #fff;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(236, 201, 75, 0.1);
        }

        .premium-button.apple:hover {
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.7), 0 0 20px rgba(236, 201, 75, 0.2);
          border-color: rgba(236, 201, 75, 0.3);
        }

        /* Footer */
        .premium-footer {
          text-align: center;
          font-size: 0.85rem;
          color: rgba(236, 201, 75, 0.6);
          margin-top: 20px;
        }

        .premium-footer a {
          color: rgba(236, 201, 75, 0.9);
          text-decoration: none;
          transition: all 0.2s;
          font-weight: 500;
        }

        .premium-footer a:hover {
          color: #ecc94b;
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .premium-title {
            font-size: 2.5rem;
            letter-spacing: 4px;
          }

          .premium-subtitle {
            font-size: 0.95rem;
          }

          .logo-container {
            width: 180px;
            height: 180px;
            margin-bottom: 30px;
          }

          .logo-svg {
            width: 120px;
            height: 120px;
          }

          .premium-button {
            padding: 14px 20px;
            font-size: 0.95rem;
          }

          .auth-buttons-container {
            gap: 12px;
            margin-bottom: 30px;
          }

          .minimal-sign-in-btn {
            padding: 14px 40px;
            font-size: 1rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 1ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 1ms !important;
          }
        }

        /* ============= LOADING OVERLAY ============= */
        .loading-overlay {
          position: fixed;
          inset: 0;
          background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0d1424 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeInOverlay 0.3s ease-out forwards;
        }

        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 32px;
        }

        /* Spinning Ring */
        .loading-ring {
          width: 120px;
          height: 120px;
          border: 4px solid rgba(236, 201, 75, 0.2);
          border-top-color: #ecc94b;
          border-right-color: #f6ad55;
          border-bottom-color: rgba(236, 201, 75, 0.1);
          border-radius: 50%;
          animation: spinRing 2s linear infinite;
        }

        @keyframes spinRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Loading Title */
        .loading-title {
          font-size: 3.5rem;
          font-weight: 700;
          letter-spacing: 8px;
          background: linear-gradient(180deg, #ecc94b 0%, #f6ad55 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          animation: pulseTitleGlow 2s ease-in-out infinite;
        }

        @keyframes pulseTitleGlow {
          0%, 100% { 
            filter: drop-shadow(0 0 20px rgba(236, 201, 75, 0.3));
            text-shadow: 0 0 30px rgba(236, 201, 75, 0.2);
          }
          50% { 
            filter: drop-shadow(0 0 40px rgba(236, 201, 75, 0.6));
            text-shadow: 0 0 60px rgba(236, 201, 75, 0.4);
          }
        }

        /* Loading Message */
        .loading-message {
          font-size: 1.1rem;
          color: rgba(236, 201, 75, 0.9);
          letter-spacing: 1px;
          margin: 0;
          min-height: 28px;
          animation: fadeInOut 0.8s ease-in-out infinite;
        }

        @keyframes fadeInOut {
          0%, 10% { opacity: 0; }
          20%, 80% { opacity: 1; }
          90%, 100% { opacity: 0; }
        }

        /* Progress Bar Container */
        .progress-bar-container {
          width: 280px;
          height: 6px;
          background: rgba(236, 201, 75, 0.15);
          border-radius: 3px;
          overflow: hidden;
          border: 1px solid rgba(236, 201, 75, 0.3);
          box-shadow: inset 0 0 20px rgba(236, 201, 75, 0.1);
        }

        /* Progress Bar Fill */
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #ecc94b 0%, #f6ad55 100%);
          border-radius: 3px;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 20px rgba(236, 201, 75, 0.6);
        }

        /* Progress Percentage */
        .progress-percentage {
          font-size: 0.95rem;
          color: rgba(236, 201, 75, 0.7);
          letter-spacing: 2px;
          margin: 0;
          font-weight: 500;
        }

        @media (max-width: 480px) {
          .loading-ring {
            width: 100px;
            height: 100px;
            border-width: 3px;
          }

          .loading-title {
            font-size: 2.5rem;
            letter-spacing: 4px;
          }

          .loading-message {
            font-size: 1rem;
          }

          .progress-bar-container {
            width: 240px;
          }
        }
      `}</style>

      <div className="auth-stage">
        {/* INITIAL STATE */}
        <div className={`initial-state ${showAnimation ? 'hidden' : ''}`}>
          <button className="minimal-sign-in-btn" onClick={handleStartAnimation}>
            SIGN IN
          </button>
        </div>

        {/* ANIMATION SEQUENCE */}
        <div className={`animation-container ${showAnimation ? 'active' : ''}`}>
          <div className="magical-particles" id="particles-container"></div>
          <div className="light-burst"></div>

          <div className="light-beam">
            <div className="beam-ray beam-ray-1"></div>
            <div className="beam-ray beam-ray-2"></div>
            <div className="beam-ray beam-ray-3"></div>
          </div>

          <svg className="ethereal-owl" viewBox="0 0 240 260" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="crestGlow" cx="50%" cy="46%" r="56%">
                <stop offset="0%" stopColor="#fffad8" stopOpacity="1" />
                <stop offset="18%" stopColor="#ffe16d" stopOpacity="0.96" />
                <stop offset="45%" stopColor="#f0aa27" stopOpacity="0.72" />
                <stop offset="100%" stopColor="#6e3614" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="phoenixGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fffdf4" stopOpacity="1" />
                <stop offset="28%" stopColor="#ffe57f" stopOpacity="0.99" />
                <stop offset="60%" stopColor="#f0a01f" stopOpacity="0.98" />
                <stop offset="100%" stopColor="#bf690f" stopOpacity="0.96" />
              </linearGradient>
              <linearGradient id="phoenixDark" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fff5d8" stopOpacity="1" />
                <stop offset="55%" stopColor="#f2b748" stopOpacity="0.98" />
                <stop offset="100%" stopColor="#d98210" stopOpacity="0.96" />
              </linearGradient>
              <linearGradient id="bookGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fff9e3" stopOpacity="1" />
                <stop offset="45%" stopColor="#ffd96f" stopOpacity="0.98" />
                <stop offset="100%" stopColor="#e3a12d" stopOpacity="0.96" />
              </linearGradient>
              <filter id="crestFilter">
                <feGaussianBlur stdDeviation="4" result="blur1" />
                <feGaussianBlur stdDeviation="9" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <circle cx="120" cy="128" r="114" fill="#0a1530" opacity="0.88" />
            <circle cx="120" cy="128" r="116" fill="none" stroke="#31426a" strokeWidth="1.4" opacity="0.9" />
            <circle cx="120" cy="128" r="134" fill="none" stroke="#d0a13a" strokeWidth="1.2" opacity="0.54" />
            <circle cx="120" cy="128" r="152" fill="none" stroke="#d0a13a" strokeWidth="0.8" opacity="0.28" />

            <g filter="url(#crestFilter)">
              <circle cx="120" cy="126" r="100" fill="url(#crestGlow)" opacity="0.92" />

              <path d="M 120 77 C 110 90 104 106 103 124 C 113 118 120 115 120 115 C 120 115 127 118 137 124 C 136 106 130 90 120 77 Z" fill="url(#phoenixGold)" opacity="0.98" />
              <path d="M 120 82 C 114 92 110 101 109 110 C 115 108 120 106 120 106 C 120 106 125 108 131 110 C 130 101 126 92 120 82 Z" fill="#fff9e6" opacity="0.85" />

              <path d="M 102 112 C 90 100 74 92 56 87 C 64 97 70 106 74 114 C 68 115 60 117 51 122 C 64 130 77 136 91 139 C 95 131 99 122 102 112 Z" fill="url(#phoenixGold)" opacity="0.97" />
              <path d="M 138 112 C 150 100 166 92 184 87 C 176 97 170 106 166 114 C 172 115 180 117 189 122 C 176 130 163 136 149 139 C 145 131 141 122 138 112 Z" fill="url(#phoenixGold)" opacity="0.97" />

              <path d="M 92 98 C 79 80 69 64 64 47 C 78 50 91 59 103 74 C 100 83 96 91 92 98 Z" fill="#fff8e6" opacity="0.94" />
              <path d="M 148 98 C 161 80 171 64 176 47 C 162 50 149 59 137 74 C 140 83 144 91 148 98 Z" fill="#fff8e6" opacity="0.94" />

              <path d="M 121 103 L 114 112 L 121 117 L 128 112 Z" fill="#cc7412" stroke="#8b4c0d" strokeWidth="0.6" />
              <path d="M 120 118 C 116 125 114 132 114 140 C 114 148 116 155 120 162 C 124 155 126 148 126 140 C 126 132 124 125 120 118 Z" fill="#fff3c8" opacity="0.88" />

              <path d="M 86 166 L 116 178 L 116 210 L 82 196 L 78 178 Z" fill="url(#phoenixDark)" stroke="#8c4e11" strokeWidth="1" />
              <path d="M 154 166 L 124 178 L 124 210 L 158 196 L 162 178 Z" fill="url(#phoenixDark)" stroke="#8c4e11" strokeWidth="1" />
              <path d="M 108 176 L 108 210 L 88 202 L 88 184 Z" fill="#fff3cf" opacity="0.86" />
              <path d="M 132 176 L 132 210 L 152 202 L 152 184 Z" fill="#fff3cf" opacity="0.86" />
              <rect x="118" y="176" width="4" height="34" fill="#8b4e10" opacity="0.96" />
              <rect x="112" y="177" width="4" height="32" fill="#f6d27b" opacity="0.82" />

              <path d="M 120 178 C 108 176 97 167 89 155 C 82 145 77 132 74 120 C 83 125 90 132 96 141 C 102 150 111 157 120 160 C 129 157 138 150 144 141 C 150 132 157 125 166 120 C 163 132 158 145 151 155 C 143 167 132 176 120 178 Z" fill="none" stroke="#ffd86f" strokeWidth="1.5" opacity="0.58" />

              <path d="M 72 54 C 56 64 46 78 41 94 C 52 90 62 89 72 92 C 66 81 66 67 72 54 Z" fill="#ffd35d" opacity="0.82" />
              <path d="M 168 54 C 184 64 194 78 199 94 C 188 90 178 89 168 92 C 174 81 174 67 168 54 Z" fill="#ffd35d" opacity="0.82" />

              <circle cx="120" cy="126" r="2.2" fill="#fffce4" opacity="0.96" />

              <circle cx="120" cy="104" r="2.4" fill="#fff7cd" opacity="0.95" />
            </g>

            <g opacity="0.9">
              <circle cx="46" cy="72" r="1.7" fill="#ffd97e" />
              <circle cx="194" cy="70" r="1.7" fill="#ffd97e" />
              <circle cx="40" cy="182" r="1.7" fill="#ffd25a" />
              <circle cx="200" cy="180" r="1.7" fill="#ffd25a" />
              <circle cx="84" cy="40" r="1.4" fill="#fff2c0" />
              <circle cx="156" cy="38" r="1.4" fill="#fff2c0" />
              <circle cx="120" cy="16" r="2.2" fill="#ffd15a" />
            </g>
          </svg>
        </div>
      </div>

      {/* MAIN PREMIUM CONTENT */}
      <div className="premium-content">
        <div className="title-section">
          <h1 className="premium-title">{BRAND_NAME}</h1>
          <p className="premium-subtitle">{TAGLINE}</p>
        </div>

        <div className="indicator-dots">
          <div className="dot active"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>

        <div className="auth-buttons-container">
          {providers.map((provider) => (
            <button
              key={provider.id}
              className={`premium-button ${provider.className}`}
              type="button"
              aria-label={provider.ariaLabel}
              onClick={() => handleProviderClick(provider.id)}
            >
              <span className="button-icon">{provider.icon}</span>
              <span>{provider.label}</span>
            </button>
          ))}
        </div>

        <div className="premium-footer">
          By continuing, you agree to our{' '}
          <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.
        </div>
      </div>

      {/* FULL-SCREEN LOADING OVERLAY */}
      {showLoading && (
        <div className="loading-overlay">
          <div className="loading-container">
            {/* Spinning Ring */}
            <div className="loading-ring"></div>

            {/* NOTES Title */}
            <h2 className="loading-title">NOTES</h2>

            {/* Status Message */}
            <p className="loading-message">{loadingMessages[loadingMessageIndex]}</p>

            {/* Progress Bar */}
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>

            {/* Progress Percentage */}
            <p className="progress-percentage">{Math.round(loadingProgress)}%</p>
          </div>
        </div>
      )}
    </main>
      )}
    </>
  );
}
