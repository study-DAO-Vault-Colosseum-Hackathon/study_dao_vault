import React, { useState } from 'react';
import { FaLightbulb, FaCheckCircle, FaFire, FaCheck } from 'react-icons/fa';
import TutorHeroSection from './TutorHeroSection';
import './StudyDAO.css';

const StudyDAO = () => {
  const [activeFilter, setActiveFilter] = useState('Notes');

  const leaderboardData = [
    { rank: 1, initials: 'SR', name: 'Swastik Rawat', points: 2450, color: '#fbbf24' },
    { rank: 2, initials: 'AB', name: 'Anup Bhattarai', points: 2180, color: '#fb923c' },
    { rank: 3, initials: 'BJ', name: 'Bijesh', points: 1920, color: '#f97316' },
    { rank: 4, initials: 'SM', name: 'Samit', points: 1650, color: '#ea580c' },
  ];

  const filters = ['Notes', 'Starred', 'Download', 'NFTs', 'Badges'];

  const nftBadges = [
    { icon: '🏅', label: 'NFT Level 1' },
    { icon: '⭐', label: 'Excellence Badge' },
    { icon: '🎨', label: 'Featured Work' },
    { icon: '📥', label: 'Download Badge' },
  ];

  const actions = [
    {
      icon: FaLightbulb,
      color: '#ec4899',
      title: 'Join Student Community',
      description: 'Unlock exclusive study guides, join peer-to-peer discussion groups, and access past year question papers.',
    },
    {
      icon: FaCheckCircle,
      color: '#10b981',
      title: 'Complete Academic Profile',
      description: 'Add your current courses, grade level, and learning interests to get personalized study recommendations.',
    },
    {
      icon: FaFire,
      color: '#f59e0b',
      title: 'Start Learning',
      description: 'Begin your first lesson, take a practice quiz, or watch video lectures to earn your first academic badge.',
    },
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
      {/* Hero Section - Minimal Clean */}
      <section className="hero-section-minimal">
        <div className="hero-content-minimal">
          {/* Left Content */}
          <div className="hero-left-minimal">
            <div className="badge-pill-minimal">
              <span>✦</span> PLATFORM LAUNCH 2026
            </div>
            <h1 className="hero-heading-minimal">Dare to Dream, Learn to Achieve.</h1>
            <p className="hero-subtitle-minimal">
              Bridging the gap between student ambition and a lifetime of professional success.
            </p>
            <div className="cta-buttons-minimal">
              <button className="btn btn-primary-minimal">Get Started</button>
              <button className="btn btn-secondary-minimal">Browse Programs</button>
            </div>

            {/* Trust Badges */}
            <div className="trust-badges">
              <div className="trust-badge">
                <FaCheck className="badge-checkmark" />
                <span>Verified Instructors</span>
              </div>
              <div className="trust-badge">
                <FaCheck className="badge-checkmark" />
                <span>100% Secure</span>
              </div>
              <div className="trust-badge">
                <FaCheck className="badge-checkmark" />
                <span>Lifetime Access</span>
              </div>
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

      {/* Leaderboard Section */}
      <section className="leaderboard-section">
        <div className="leaderboard-container">
          <h2 className="leaderboard-heading">Leaderboard</h2>
          <div className="leaderboard-list">
            {leaderboardData.map((entry) => (
              <div key={entry.rank} className="leaderboard-item">
                <div className="leaderboard-rank">
                  <span className="rank-number">{entry.rank}</span>
                </div>
                <div 
                  className="leaderboard-avatar"
                  style={{ backgroundColor: entry.color }}
                >
                  {entry.initials}
                </div>
                <div className="leaderboard-info">
                  <h4 className="leaderboard-name">{entry.name}</h4>
                  <p className="leaderboard-description">Active Member</p>
                </div>
                <div className="leaderboard-points">
                  <FaFire className="fire-icon" />
                  <span>{entry.points}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NFTs & Badges Section */}
      <section className="nft-badges-section">
        <div className="section-container">
          <h2 className="section-heading">NFTs & Badges</h2>
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

      {/* Registration & Actions Section */}
      <section className="actions-section">
        <div className="section-container">
          <h2 className="section-heading">Registration & Actions</h2>
          <div className="actions-grid">
            {actions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <div key={index} className="action-card">
                  <div className="action-icon" style={{ color: action.color }}>
                    <IconComponent size={48} />
                  </div>
                  <h3 className="action-title">{action.title}</h3>
                  <p className="action-description">{action.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Q&A Section */}
      <section className="qa-section">
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
    </div>
  );
};

export default StudyDAO;
