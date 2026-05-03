import React, { useState } from 'react';
import { FaSearch, FaArrowRight, FaCode, FaDatabase, FaNetwork, FaLightbulb } from 'react-icons/fa';
import './HamoCSIT.css';

export default function HamoCSIT({ onSignOut }) {
  const [searchQuery, setSearchQuery] = useState('');

  const semesters = [
    { number: 1, name: 'First Semester', topic: 'Fundamentals', progress: 100 },
    { number: 2, name: 'Second Semester', topic: 'Algorithms', progress: 85 },
    { number: 3, name: 'Third Semester', topic: 'Web Dev', progress: 60 },
    { number: 4, name: 'Fourth Semester', topic: 'Databases', progress: 45 },
    { number: 5, name: 'Fifth Semester', topic: 'Systems', progress: 30 },
    { number: 6, name: 'Sixth Semester', topic: 'Projects', progress: 15 },
    { number: 7, name: 'Seventh Semester', topic: 'Specialization', progress: 0 },
    { number: 8, name: 'Eighth Semester', topic: 'Capstone', progress: 0 },
  ];

  const features = [
    {
      icon: FaCode,
      title: 'Interactive Coding',
      description: 'Practice with live code editors and instant feedback for all subjects',
    },
    {
      icon: FaDatabase,
      title: 'Study Materials',
      description: 'Comprehensive notes, slides, and resources organized by semester',
    },
    {
      icon: FaNetwork,
      title: 'Community Forum',
      description: 'Connect with peers, ask questions, and collaborate on projects',
    },
    {
      icon: FaLightbulb,
      title: 'Expert Guidance',
      description: 'Access curated content from experienced instructors and mentors',
    },
  ];

  return (
    <div className="hamro-csit-container">
      {/* Navigation */}
      <nav className="hamro-navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <span className="brand-icon">₹</span>
            <span className="brand-name">Hamro CSIT</span>
          </div>
          <div className="navbar-right">
            <a href="#semesters" className="nav-link">Semesters</a>
            <a href="#resources" className="nav-link">Resources</a>
            <a href="#community" className="nav-link">Community</a>
            <button className="nav-cta-btn" onClick={onSignOut}>Sign Out</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hamro-hero">
        <div className="hero-container">
          {/* Background Decoration */}
          <svg className="hero-decoration" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.03">
              <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="1"/>
              <circle cx="200" cy="200" r="120" fill="none" stroke="currentColor" strokeWidth="1"/>
              <circle cx="200" cy="200" r="60" fill="none" stroke="currentColor" strokeWidth="1"/>
              <line x1="200" y1="20" x2="200" y2="380" stroke="currentColor" strokeWidth="1"/>
              <line x1="20" y1="200" x2="380" y2="200" stroke="currentColor" strokeWidth="1"/>
            </g>
          </svg>

          {/* Eyebrow Badge */}
          <div className="eyebrow-badge">
            <span className="pulsing-dot"></span>
            <span className="badge-text">Welcome to Your Learning Journey</span>
          </div>

          {/* Headline */}
          <h1 className="hero-headline">
            Master <span className="green-accent">B.Sc. CSIT</span> with Premium Resources
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            A developer tool meets academic platform. Everything you need to excel in Computer Science.
          </p>

          {/* Search Bar */}
          <div className="hero-search">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search courses, notes, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="search-btn">
              <FaArrowRight size={16} />
            </button>
          </div>

          {/* Stats Strip */}
          <div className="stats-strip">
            <div className="stat-item">
              <div className="stat-number">8</div>
              <div className="stat-label">Semesters</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">120+</div>
              <div className="stat-label">Courses</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Resources</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">2.5k+</div>
              <div className="stat-label">Community</div>
            </div>
          </div>
        </div>
      </section>

      {/* Update Banner */}
      <section className="update-banner">
        <div className="banner-content">
          <div className="banner-text">
            <span className="banner-label">Latest Update</span>
            <span className="banner-message">New DSA Module Released: Master Data Structures in 30 Days</span>
          </div>
          <a href="#" className="banner-link">View Now →</a>
        </div>
      </section>

      {/* Semester Grid */}
      <section className="semesters-section" id="semesters">
        <div className="section-container">
          <h2 className="section-heading">Your Semester Path</h2>
          <div className="semesters-grid">
            {semesters.map((sem) => (
              <div key={sem.number} className="semester-card">
                <div className="semester-header">
                  <div className="semester-number">{sem.number}</div>
                  <span className="semester-pill">{sem.topic}</span>
                </div>
                <h3 className="semester-name">{sem.name}</h3>
                <div className="progress-container">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${sem.progress}%` }}></div>
                  </div>
                  <span className="progress-text">{sem.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section" id="resources">
        <div className="section-container">
          <h2 className="section-heading">Why Choose Hamro CSIT</h2>
          <div className="features-grid">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const isFeatured = index === 0;
              return (
                <div key={index} className={`feature-card ${isFeatured ? 'featured' : ''}`}>
                  <div className="feature-icon">
                    <IconComponent size={24} />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="community-section" id="community">
        <div className="section-container">
          <h2 className="section-heading">Join the Community</h2>
          <p className="community-description">
            Connect with thousands of B.Sc. CSIT students, share knowledge, collaborate on projects, and grow together.
          </p>
          <button className="cta-button">Enter Community Forum</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="hamro-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="footer-brand-icon">₹</span>
              <span className="footer-brand-name">Hamro CSIT</span>
            </div>
            <p className="footer-tagline">Built by developers, for students.</p>
          </div>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Hamro CSIT. For B.Sc. CSIT students in Nepal.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
