import React from 'react';
import './TutorHeroSection.css';

const TutorHeroSection = () => {
  return (
    <section className="tutor-hero-section">
      {/* A+ Circle SVG */}
      <svg className="a-plus-circle" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');
          </style>
        </defs>
        <circle cx="60" cy="60" r="55" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray="5,5" opacity="0.8" />
        <text x="60" y="75" textAnchor="middle" fontSize="48" fontFamily="Caveat, cursive" fontWeight="700" fill="#22c55e">
          A+
        </text>
      </svg>

      {/* Decorative Elements */}
      <div className="decorative-element rocket-emoji">🚀</div>
      <div className="decorative-element crown-emoji">👑</div>
      <div className="decorative-element plant-emoji">🌿</div>
      <div className="decorative-element star-emoji">⭐</div>
      <div className="decorative-element sparkle-emoji">✦</div>
      <div className="decorative-element orb-emoji">🔵</div>
      <div className="decorative-element diamond-emoji">💠</div>

      {/* Main Content */}
      <div className="hero-content">
        <h1 className="hero-heading">AND THAT'S WHEN THE A'S START SHOWING UP</h1>
        
        <button className="cta-button">Get started</button>
        
        <h2 className="hero-subheading">But Great Tutors Go Beyond Explanations</h2>
      </div>
    </section>
  );
};

export default TutorHeroSection;
