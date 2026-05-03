import React, { useState } from 'react';
import { FaLightbulb, FaCheckCircle, FaFire, FaCheck, FaGoogle, FaBook, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import TutorHeroSection from './TutorHeroSection';
import './StudyDAO.css';

export default function LandingPage({ onGoogleSignIn, user, onSignOut }) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('Notes');

  // Redirect to StudyDAO if user is already signed in
  React.useEffect(() => {
    if (user) {
      navigate("/study-dao");
    }
  }, [user, navigate]);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleGoogleSignIn = () => {
    onGoogleSignIn();
  };

  const handleCosmicBook = () => {
    navigate("/cosmic-book");
  };

  const leaderboardData = [
    { rank: 1, initials: 'SR', name: 'Swastik Rawat', points: 2450, color: '#fbbf24' },
    { rank: 2, initials: 'AB', name: 'Anup Bhattarai', points: 2180, color: '#fb923c' },
    { rank: 3, initials: 'BJ', name: 'Bijesh', points: 1920, color: '#f97316' },
    { rank: 4, initials: 'SM', name: 'Samit', points: 1650, color: '#ea580c' },
  ];

  const filters = ['Notes', 'Starred', 'Download', 'NFTs', 'Badges'];

  const nftBadges = [
    
    { icon: '⭐', label: 'Excellence Badge' },
    { icon: '🎨', label: 'Featured Work' },
    
  ];

  const qaItems = [
    {
      question: 'How do I get started?',
      answer: 'Click on "Get Started" button to create your account and complete your academic profile. You can then browse programs and start learning.',
    },
    {
      question: 'Are the courses certified?',
      answer: 'Yes! Upon completion, you receive certificates and NFT badges that verify your achievements on the blockchain.',
    },
    {
      question: 'Can I access courses offline?',
      answer: 'Premium members can download courses for offline access. All courses are available 24/7 on the platform.',
    },
  ];

  return (
    <div className="study-dao-container">
      {/* Hero Section - Blue Theme with Leaderboard */}
      <section className="hero-section-original">
        <div className="hero-background-gradient"></div>
        <div className="hero-background-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>

        <div className="hero-content-grid">
          {/* Left Content */}
          <div className="hero-left-content">
            <div className="hero-tagline">
              <span className="tagline-icon">✦</span>
              Your Learning Revolution Starts Here
            </div>
            
            <h1 className="hero-heading-original">
              Master in Your Field <br />Build Your Future
            </h1>

            <p className="hero-description">
              Every note you take is a credential you earn
            </p>

            <div className="hero-cta-group">
              <button className="btn-primary-original" onClick={() => scrollToSection('actions-section')}>
                Start Learning Now
              </button>
              <button className="btn-secondary-original">
                Explore Courses
              </button>
            </div>

            {/* Stats */}
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">10k+</div>
                <div className="stat-label">Active Learners</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Verified Courses</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">99%</div>
                <div className="stat-label">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Side - Leaderboard (Desktop Only) */}
          <div className="hero-right-leaderboard hero-leaderboard-desktop">
            <div className="leaderboard-header">
              <h3 className="leaderboard-title">🏆 Top Contributors</h3>
              <p className="leaderboard-subtitle">Leading the community</p>
            </div>

            <div className="leaderboard-items">
              {leaderboardData.map((entry) => (
                <div key={entry.rank} className="leaderboard-entry">
                  <div className="entry-rank">
                    <span className="rank-badge">{entry.rank}</span>
                  </div>

                  <div
                    className="entry-avatar"
                    style={{ backgroundColor: entry.color }}
                  >
                    {entry.initials}
                  </div>

                  <div className="entry-info">
                    <h4 className="entry-name">{entry.name}</h4>
                    <div className="entry-points">
                      <FaFire className="fire-icon" />
                      <span>{entry.points}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="filter-section">
        <div className="filter-container">
          <div className="filter-tabs">
            {filters.map((filter) => (
              <button
                key={filter}
                className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Registration & Actions Section - Flowchart */}
      <section className="actions-section" id="actions-section">
        <div className="section-container">
          <h2 className="section-heading">Registration & Actions Flow</h2>
          
          {/* Flowchart Container */}
          <div className="flowchart-container">
            {/* Step 1 */}
            <div className="flow-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3 className="step-title">Visit Study DAO</h3>
                <p className="step-description">Student visits Study DAO platform</p>
              </div>
            </div>

            {/* Arrow */}
            <div className="flow-arrow">→</div>

            {/* Step 2 */}
            <div className="flow-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3 className="step-title">Sign In via Magic.link</h3>
                <p className="step-description">Google / GitHub / Discord authentication</p>
              </div>
            </div>

            {/* Arrow */}
            <div className="flow-arrow">→</div>

            {/* Step 3 */}
            <div className="flow-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3 className="step-title">Custodial Wallet Created</h3>
                <p className="step-description">Magic.link manages keypair securely</p>
              </div>
            </div>

            {/* Arrow */}
            <div className="flow-arrow">→</div>

            {/* Step 4 */}
            <div className="flow-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3 className="step-title">Claim Badge</h3>
                <p className="step-description">Earn your first achievement badge</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Leaderboard Section - Before Badges */}
      <section className="hero-right-leaderboard hero-leaderboard-mobile">
        <div className="leaderboard-header">
          <h3 className="leaderboard-title">🏆 Top Contributors</h3>
          <p className="leaderboard-subtitle">Leading the community</p>
        </div>

        <div className="leaderboard-items">
          {leaderboardData.map((entry) => (
            <div key={entry.rank} className="leaderboard-entry">
              <div className="entry-rank">
                <span className="rank-badge">{entry.rank}</span>
              </div>

              <div
                className="entry-avatar"
                style={{ backgroundColor: entry.color }}
              >
                {entry.initials}
              </div>

              <div className="entry-info">
                <h4 className="entry-name">{entry.name}</h4>
                <div className="entry-points">
                  <FaFire className="fire-icon" />
                  <span>{entry.points}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/*Badges Section */}
      <section className="nft-badges-section" id="nft-badges-section">
        <div className="section-container">
          <h2 className="section-heading">Badges</h2>
          <div className="nft-badges-grid">
            {nftBadges.map((item, index) => (
              <div key={index} className="nft-badge-card">
                <div className="badge-icon">{item.icon}</div>
                <p className="badge-label">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Q&A Section */}
      <section className="qa-section" id="qa-section">
        <div className="section-container qa-container">
          <h2 className="section-heading">Frequently Asked Questions</h2>
          <div className="qa-grid">
            {qaItems.map((item, index) => (
              <div key={index} className="qa-card">
                <h4 className="qa-question">{item.question}</h4>
                <p className="qa-answer">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tutor Hero Section */}
      <TutorHeroSection />

      {/* CTA Section */}
      <section className="cta-section" aria-labelledby="cta-heading">
        <div className="cta-content">
          <h2 id="cta-heading" className="cta-headline">Ready to Join Study DAO?</h2>
          <p className="cta-subtitle">Start learning, collaborating, and earning rewards today</p>
        </div>
        <svg className="wave-divider" viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M0,40 Q300,20 600,40 T1200,40 L1200,120 L0,120 Z" />
        </svg>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-grid">
            {/* Column 1: Brand */}
            <div className="footer-column">
              <div className="footer-brand">
                <div className="footer-brand-mark">DAO</div>
                <span className="footer-brand-name">Study DAO</span>
              </div>
              <p className="footer-tagline">Decentralized Learning for Everyone</p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="footer-column">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#programs">Programs</a></li>
                <li><a href="#terms">Terms</a></li>
              </ul>
            </div>

            {/* Column 3: Connect */}
            <div className="footer-column">
              <h3>Connect</h3>
              <ul>
                <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                <li><a href="https://discord.com" target="_blank" rel="noopener noreferrer">Discord</a></li>
                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                <li><a href="mailto:hello@studydao.com">Email</a></li>
              </ul>
            </div>

           
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom">
            <p>© 2026 Study DAO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
