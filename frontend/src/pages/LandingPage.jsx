import React, { useState } from 'react';
import { FaLightbulb, FaCheckCircle, FaFire, FaCheck, FaGoogle, FaBook, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AnimatedMenu from '../components/AnimatedMenu';
import GenerativeMountainScene from '../components/GenerativeMountainScene';
import TutorHeroSection from './TutorHeroSection';
import HoverFooter from '../components/HoverFooter';
import './EduChainNP.css';

export default function LandingPage({ onGoogleSignIn, user, onSignOut }) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('Notes');

  // Redirect to EduChainNP if user is already signed in
  React.useEffect(() => {
    if (user) {
      navigate("/educhain-np");
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

  const filters = ['Notes', 'Starred', 'Download','Badges'];

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

  const earnPointsData = [
    { icon: '📝', action: 'Upload notes', points: '+10' },
    { icon: '🔬', action: 'Upload lab report', points: '+10' },
    { icon: '👍', action: 'Upvote a post', points: '+5' },
    { icon: '👎', action: 'Downvote a post', points: '-2' },
    { icon: '❓', action: 'Post a question', points: '+10' },
    { icon: '🔥', action: 'Question upvoted', points: '+1' },
    { icon: '💬', action: 'Post an answer', points: '+10' },
    { icon: '⬆️', action: 'Answer upvoted', points: '+2' },
    { icon: '✅', action: 'Answer marked accepted', points: '+20' },
    { icon: '🎉', action: 'Founding member bonus', points: '+25' },
  ];

  return (
    <>
      <AnimatedMenu user={user} onSignOut={onSignOut} onGoogleSignIn={handleGoogleSignIn} />
      <div className="educhain-container">
      {/* Hero Section - Mountain Scene Background */}
      <section className="hero-section-original">
        <GenerativeMountainScene />
        
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
      <section className="actions-section" id="Registration Flow & actions-section">
        <div className="section-container">
          <h2 className="section-heading">Registration Flow & Actions Flow</h2>
          
          <div className="actions-flow-wrapper">
            {/* Left: Registration Flow */}
            <div className="flow-left">
              {/* <h3 className="flow-column-title">Registration Flow</h3> */}
              {/* Flowchart Container */}
              <div className="flowchart-container">
                {/* Step 1 */}
                <div className="flow-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3 className="step-title">Visit EduChainNP</h3>
                    <p className="step-description">Student visits EduChainNP platform</p>
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

            {/* Right: How you earn points */}
            <div className="flow-right">
              <h3 className="earn-points-heading">How you earn points</h3>
              <p className="earn-points-subtitle">Every action counts toward your on-chain reputation</p>
              
              <div className="earn-points-table">
                <div className="table-header">
                  <div className="table-col-action">Action</div>
                  <div className="table-col-points">Points</div>
                </div>
                
                {earnPointsData.map((item, index) => (
                  <div key={index} className="table-row">
                    <div className="table-col-action">
                      <span className="point-icon">{item.icon}</span>
                      <span>{item.action}</span>
                    </div>
                    <div className={`table-col-points ${item.points.includes('-') ? 'negative' : 'positive'}`}>
                      {item.points}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Leaderboard Section - Before Badges */}

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

      {/* Badge Tier Progression Section */}
      <section className="badge-tier-section">
        <div className="section-container">
          <h2 className="badge-tier-heading">Badge tier progression</h2>
          <p className="badge-tier-subtitle">Contribute more, rank higher, earn your place in EduChainNP</p>
          
          <div className="badge-tiers-container">
            <div className="badge-tier-item tier-spark">
              <div className="tier-icon">⚡</div>
              <h3 className="tier-name">Spark</h3>
              <p className="tier-range">0 – 99 pts</p>
            </div>

            <div className="badge-tier-item tier-current">
              <div className="tier-icon">●</div>
              <h3 className="tier-name">Current</h3>
              <p className="tier-range">100 – 349 pts</p>
            </div>

            <div className="badge-tier-item tier-core">
              <div className="tier-icon">🌿</div>
              <h3 className="tier-name">Core</h3>
              <p className="tier-range">350 – 799 pts</p>
            </div>

            <div className="badge-tier-item tier-supernova">
              <div className="tier-icon">✨</div>
              <h3 className="tier-name">Supernova</h3>
              <p className="tier-range">800 – 1499 pts</p>
            </div>

            <div className="badge-tier-item tier-singularity">
              <div className="tier-icon">💎</div>
              <h3 className="tier-name">Singularity</h3>
              <p className="tier-range">1500+ & Top 10</p>
            </div>
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

      {/* Hover Footer */}
      <HoverFooter />
      </div>
    </>
  );
}
