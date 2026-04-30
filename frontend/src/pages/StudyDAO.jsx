import React from 'react';
import SocialAuthPanel from '../components/SocialAuthPanel';

const NotesIcon = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f5f0eb' }}>
      <svg viewBox="0 0 680 420" width="680" height="420" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: '100%', height: 'auto' }}>
        <defs>
          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-15px); }
            }

            @keyframes halo-pulse-inner {
              0% {
                r: 140px;
                opacity: 1;
              }
              100% {
                r: 185px;
                opacity: 0;
              }
            }

            @keyframes halo-pulse-outer {
              0% {
                r: 160px;
                opacity: 0.8;
              }
              100% {
                r: 225px;
                opacity: 0;
              }
            }

            @keyframes page-turn-left {
              0%, 100% { d: path('M 220 120 L 300 120 Q 300 180 300 240 L 220 240 Z'); }
              50% { d: path('M 215 125 Q 245 140 265 160 Q 260 190 255 240 L 220 240 Z'); }
            }

            @keyframes page-turn-right {
              0%, 100% { d: path('M 380 120 L 460 120 L 460 240 Q 460 180 380 240 Z'); }
              50% { d: path('M 415 160 Q 430 140 455 125 L 455 240 Q 430 190 415 160 Z'); }
            }

            @keyframes line-fade {
              0%, 10%, 100% { opacity: 1; }
              45%, 55% { opacity: 0.3; }
            }

            @keyframes sparkle-burst-1 {
              0% {
                transform: translate(0, 0) scale(1);
                opacity: 1;
              }
              100% {
                transform: translate(-25px, -35px) scale(0);
                opacity: 0;
              }
            }

            @keyframes sparkle-burst-2 {
              0% {
                transform: translate(0, 0) scale(1);
                opacity: 1;
              }
              100% {
                transform: translate(0, -40px) scale(0);
                opacity: 0;
              }
            }

            @keyframes sparkle-burst-3 {
              0% {
                transform: translate(0, 0) scale(1);
                opacity: 1;
              }
              100% {
                transform: translate(25px, -35px) scale(0);
                opacity: 0;
              }
            }

            @keyframes pulse-dot {
              0%, 100% {
                r: 5px;
                opacity: 0.4;
              }
              50% {
                r: 8px;
                opacity: 1;
              }
            }

            .floating-group {
              animation: float 3.2s ease-in-out infinite;
            }

            .halo-inner {
              animation: halo-pulse-inner 3.2s ease-out infinite;
            }

            .halo-outer {
              animation: halo-pulse-outer 3.2s ease-out infinite;
            }

            .page-left {
              animation: page-turn-left 4s ease-in-out 0.3s infinite;
            }

            .page-right {
              animation: page-turn-right 4s ease-in-out 0.3s infinite;
            }

            .page-lines {
              animation: line-fade 4s ease-in-out 0.3s infinite;
            }

            .sparkle-1 {
              animation: sparkle-burst-1 1.2s ease-out 0.4s infinite;
            }

            .sparkle-2 {
              animation: sparkle-burst-2 1.2s ease-out 0.7s infinite;
            }

            .sparkle-3 {
              animation: sparkle-burst-3 1.2s ease-out 1.1s infinite;
            }

            .dot-1 {
              animation: pulse-dot 2.2s ease-in-out infinite;
            }

            .dot-2 {
              animation: pulse-dot 2.2s ease-in-out 0.3s infinite;
            }

            .dot-3 {
              animation: pulse-dot 2.2s ease-in-out 0.6s infinite;
            }

            .notes-text {
              font-family: Georgia, serif;
              font-weight: 700;
              font-size: 48px;
              fill: #8C4028;
              letter-spacing: 8px;
              text-anchor: middle;
            }

            .subtitle-text {
              font-family: Georgia, serif;
              font-size: 18px;
              fill: #A83E26;
              text-anchor: middle;
              letter-spacing: 1px;
            }
          `}</style>
        </defs>

        {/* Halo Rings */}
        <circle cx="340" cy="180" r="140" fill="none" stroke="#C9573A" strokeWidth="2" opacity="0.6" className="halo-inner" />
        <circle cx="340" cy="180" r="160" fill="none" stroke="#A83E26" strokeWidth="2" opacity="0.4" className="halo-outer" />

        {/* Main Icon Group with Float Animation */}
        <g className="floating-group">
          {/* Background Circle */}
          <circle cx="340" cy="180" r="130" fill="#EDE4DA" />

          {/* Book Spine */}
          <line x1="340" y1="120" x2="340" y2="240" stroke="#8C4028" strokeWidth="3" />

          {/* Left Page */}
          <path
            d="M 220 120 L 300 120 Q 300 180 300 240 L 220 240 Z"
            fill="#C9573A"
            stroke="#8C4028"
            strokeWidth="2"
            className="page-left"
          />

          {/* Right Page */}
          <path
            d="M 380 120 L 460 120 L 460 240 Q 460 180 380 240 Z"
            fill="#A83E26"
            stroke="#8C4028"
            strokeWidth="2"
            className="page-right"
          />

          {/* Left Page Lines */}
          <g className="page-lines">
            <line x1="235" y1="145" x2="285" y2="145" stroke="#EDE4DA" strokeWidth="1.5" opacity="0.7" />
            <line x1="230" y1="165" x2="290" y2="165" stroke="#EDE4DA" strokeWidth="1.5" opacity="0.7" />
            <line x1="232" y1="185" x2="288" y2="185" stroke="#EDE4DA" strokeWidth="1.5" opacity="0.7" />
            <line x1="235" y1="205" x2="285" y2="205" stroke="#EDE4DA" strokeWidth="1.5" opacity="0.7" />
            <line x1="240" y1="225" x2="280" y2="225" stroke="#EDE4DA" strokeWidth="1.5" opacity="0.7" />
          </g>

          {/* Right Page Lines */}
          <g className="page-lines">
            <line x1="395" y1="145" x2="445" y2="145" stroke="#EDE4DA" strokeWidth="1.5" opacity="0.7" />
            <line x1="390" y1="165" x2="450" y2="165" stroke="#EDE4DA" strokeWidth="1.5" opacity="0.7" />
            <line x1="392" y1="185" x2="448" y2="185" stroke="#EDE4DA" strokeWidth="1.5" opacity="0.7" />
            <line x1="395" y1="205" x2="445" y2="205" stroke="#EDE4DA" strokeWidth="1.5" opacity="0.7" />
            <line x1="400" y1="225" x2="440" y2="225" stroke="#EDE4DA" strokeWidth="1.5" opacity="0.7" />
          </g>

          {/* Sparkle 1 (Top Left) */}
          <g className="sparkle-1" transform="translate(290, 90)">
            <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" fill="#C9573A" />
          </g>

          {/* Sparkle 2 (Top Center) */}
          <g className="sparkle-2" transform="translate(340, 80)">
            <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" fill="#C9573A" />
          </g>

          {/* Sparkle 3 (Top Right) */}
          <g className="sparkle-3" transform="translate(390, 90)">
            <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" fill="#C9573A" />
          </g>

          {/* Pulsing Dots */}
          <circle cx="300" cy="285" r="5" fill="#C9573A" className="dot-1" />
          <circle cx="340" cy="285" r="5" fill="#C9573A" className="dot-2" />
          <circle cx="380" cy="285" r="5" fill="#C9573A" className="dot-3" />
        </g>

        {/* "NOTES" Wordmark */}
        <text x="340" y="340" className="notes-text">NOTES</text>

        {/* Subtitle */}
        <text x="340" y="375" className="subtitle-text">your thoughts, kept</text>
      </svg>
    </div>
  );
};

const StudyDAO = () => {
  const handleNoop = () => {};

  return (
    <div>
      <NotesIcon />
      {/* Social auth panel under the Notes icon (non-intrusive) */}
      <SocialAuthPanel
        onGoogle={handleNoop}
        onGithub={handleNoop}
        onDiscord={handleNoop}
        onMicrosoft={handleNoop}
        onApple={handleNoop}
      />
    </div>
  );
};

export default StudyDAO;
