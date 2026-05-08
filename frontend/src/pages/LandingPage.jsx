import React, { useEffect, useState, Suspense } from 'react';
import { FaLightbulb, FaCheckCircle, FaFire, FaCheck, FaBook, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import TutorHeroSection from './TutorHeroSection';
import HoverFooter from '../components/HoverFooter';
import GenerativeMountainScene from '../components/ui/mountain-scene';
import FeaturesCards from '../components/ui/feature-shader-cards';
import SubjectShaderCards from '../components/ui/subject-shader-cards';
import './EduChainNP.css';

const semesters = Array.from({ length: 8 }, (_, index) => index + 1);
const semesterPreviewImage = '/together-classroom.jpg';

const semesterSubjects = {
  1: [
    { name: 'Introduction to Information Technology', code: 'CSC101' },
    { name: 'C Programming', code: 'CSC102' },
    { name: 'Digital Logic', code: 'CSC103' },
    { name: 'Mathematics I', code: 'MATH101' },
    { name: 'Physics', code: 'PHY101' }
  ],
  2: [
    { name: 'Discrete Structure',code:'CSC165'},
    { name: 'Object-Oriented Programming', code: 'CSC166' },
    { name: 'Microprocessor', code: 'CSC167' },
    { name: 'Mathematics II', code: 'MATH168' },
    { name: 'Statistics I', code: 'CHM169' }
  ],
  3: [
    { name: 'Data Structure and algorithm', code: 'CSC211' },
    { name: 'Numerical Method', code: 'CSC212' },
    { name: 'Computer Architecture', code: 'CSC213' },
    { name: 'Computer Graphics', code: 'MATH214' },
    { name: 'Statistics II', code: 'CSC215' }
  ],
  4: [
    { name: 'Theory Of Computation', code: 'CSC262' },
    { name: 'Computer Networks',code:'263' },
    { name: 'Database MAnagement System', code: 'CSC265' },
    { name: 'Operating System', code: 'CSC264' },
    { name: 'Artificial Intelligence', code: 'CSC266'}
  ],
  5: [
    { name: 'Design adn Analysis of Algorithms', code: 'CSC314' },
    { name: 'System Analysis and Design', code: 'CSC315' },
    { name: 'Cryptography', code: 'CSC316' },
    { name: 'Simulation and Modeling', code: 'CSC317' },
    { name: 'Web Technology', code: 'CSC318' }
  ],
  6: [
    { name: 'Software Engineering', code: 'CSC364' },
    { name: 'Compiler Design and Construction', code: 'CSC365' },
    { name: 'E-Governance', code: 'CSC366' },
    { name: 'NET Centric Computing', code: 'CSC367' },
    { name: 'Technical Writing', code: 'CSC368' },
    { name: 'Elective II', code: 'CSC369' }
  ],
  7: [
    { name: 'Advanced Java Programming', code: 'CSC409' },
    { name: 'Data Warehousing and Data Mining', code: 'CSC410' },
    { name: 'Principles of Management', code: 'CSC411' },
    { name: 'Project Work', code: 'CSC412' },
    { name: 'Network Security', code: 'CSC413' }
  ],
  8: [
    { name: 'Advanced Database', code: 'CSC461' },
    { name: 'Internship', code: 'CSC462' },
    { name: 'Advanced Networking With IPV6', code: 'CSC463' },
    { name: 'Decision Support System and Expert System', code: 'CSC469' }
  ]
};

export default function LandingPage({
  onGoogleSignIn,
  user,
  onSignOut,
  isProgramsSidebarOpen = false,
  selectedSemester = null,
  showSemesterTrigger = false,
  onSemesterSelect = () => {},
  onShowSemesterTriggerChange = () => {},
  onOpenProgramsSidebar = () => {},
  onCloseProgramsSidebar = () => {},
}) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('Notes');
  const [isSemesterDropdownOpen, setIsSemesterDropdownOpen] = useState(false);
  const [showSemesters, setShowSemesters] = useState(false);
  const [showSubjectsView, setShowSubjectsView] = useState(false);
  const [selectedSemesterNumber, setSelectedSemesterNumber] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [activeTab, setActiveTab] = useState('Chapters');
  const shouldBlurHomepage = isProgramsSidebarOpen && selectedSemester === null;
  const shouldShiftMainContent = isProgramsSidebarOpen && selectedSemester !== null;
  const userDisplayName = user?.displayName || user?.email?.split('@')[0] || 'Student';
  const userInitials = userDisplayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'ST';

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleExploreCourseClick = () => {
    onOpenProgramsSidebar();
  };

  const handleCosmicBook = () => {
    navigate("/cosmic-book");
  };

  useEffect(() => {
    if (!showSemesterTrigger) {
      setIsSemesterDropdownOpen(false);
      return;
    }
    setIsSemesterDropdownOpen(true);
  }, [showSemesterTrigger]);

  useEffect(() => {
    if (!isProgramsSidebarOpen) {
      setIsSemesterDropdownOpen(false);
      setShowSemesters(false);
    }
  }, [isProgramsSidebarOpen]);

  const handleSemesterClick = (semesterNumber) => {
    setSelectedSemesterNumber(semesterNumber);
    setShowSubjectsView(true);
    onCloseProgramsSidebar();
  };

  const handleProgramClick = () => {
    setIsSemesterDropdownOpen(!isSemesterDropdownOpen);
    setShowSemesters(false);
  };

  const leaderboardData = [
    { rank: 1, initials: 'SR', name: 'Swastik Rawat', points: 2450, color: '#fbbf24' },
    { rank: 2, initials: 'AB', name: 'Anup Bhattarai', points: 2180, color: '#fb923c' },
    { rank: 3, initials: 'BJ', name: 'Bijesh', points: 1920, color: '#f97316' },
    { rank: 4, initials: 'SM', name: 'Samit Shrestha', points: 1650, color: '#ea580c' },
  ];
  const leaderboardPoints =
    leaderboardData.find(
      (entry) => user?.displayName && entry.name.toLowerCase() === user.displayName.toLowerCase()
    )?.points ?? 120;

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

  const renderSemesterDetailView = () => (
    <section className="semester-image-view">
      <img
        src={semesterPreviewImage}
        alt={`BSc CSIT Semester ${selectedSemester} preview`}
        className="semester-image-photo"
      />
      <div className="semester-image-meta">
        <p>Tribhuvan University • BSc CSIT</p>
        <h2>Semester {selectedSemester}</h2>
      </div>
    </section>
  );

  const renderSubjectsView = () => {
    const subjects = semesterSubjects[selectedSemesterNumber] || [];

    return (
      <section style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)',
        zIndex: 1300,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto'
      }}>
        <div style={{ padding: '40px 30px', color: '#fff' }}>
          <button 
            onClick={() => setShowSubjectsView(false)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '40px',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.1)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            ← Back to Semesters
          </button>
          <h1 style={{ fontSize: '3rem', marginBottom: '15px', fontWeight: 'bold' }}>
            Semester {selectedSemesterNumber}
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', marginBottom: '50px' }}>
            {subjects.length} subjects • Explore and learn
          </p>

          <SubjectShaderCards 
            subjects={subjects}
            onSubjectClick={(subject) => setSelectedSubject(subject)}
          />
        </div>
      </section>
    );
  };

  const renderSubjectDetailView = () => {
    const tabs = ['Chapters', 'Syllabus', 'Notes', 'Q/A Feed', 'Question Banks'];
    return (
      <section style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        background: '#050b18',
        zIndex: 1400,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto'
      }}>
        <div style={{ padding: '30px', color: '#fff' }}>
          <button 
            onClick={() => setSelectedSubject(null)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            ← Back to Subjects
          </button>

          <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>
            {selectedSubject?.name}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '30px' }}>
            {selectedSubject?.code}
          </p>

          {/* Navigation Tabs */}
          <div style={{
            display: 'flex',
            gap: '15px',
            borderBottom: '1px solid rgba(255,255,255,0.2)',
            marginBottom: '30px',
            overflowX: 'auto',
            paddingBottom: '15px'
          }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.6)',
                  padding: '10px 0',
                  borderBottom: activeTab === tab ? '2px solid #a855f7' : 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: activeTab === tab ? '600' : '400',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            borderRadius: '12px',
            padding: '30px',
            minHeight: '400px'
          }}>
            {activeTab === 'Chapters' && (
              <div>
                <h3 style={{ marginBottom: '20px' }}>Chapters</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)' }}>Chapters content for {selectedSubject?.name}</p>
              </div>
            )}
            {activeTab === 'Syllabus' && (
              <div>
                <h3 style={{ marginBottom: '20px' }}>Syllabus</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)' }}>Syllabus content for {selectedSubject?.name}</p>
              </div>
            )}
            {activeTab === 'Notes' && (
              <div>
                <h3 style={{ marginBottom: '20px' }}>Notes</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)' }}>Study notes for {selectedSubject?.name}</p>
              </div>
            )}
            {activeTab === 'Q/A Feed' && (
              <div>
                <h3 style={{ marginBottom: '20px' }}>Questions & Answers</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)' }}>Q&A feed for {selectedSubject?.name}</p>
              </div>
            )}
            {activeTab === 'Question Banks' && (
              <div>
                <h3 style={{ marginBottom: '20px' }}>Question Banks</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)' }}>Question banks for {selectedSubject?.name}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  };

  return (
    <>
      {selectedSubject && renderSubjectDetailView()}
      {showSubjectsView && !selectedSubject && renderSubjectsView()}
      <div className="educhain-container">
      <div
        className={`landing-main-content ${shouldBlurHomepage ? 'landing-main-content-blurred' : ''} ${shouldShiftMainContent ? 'landing-main-content-semester-selected' : ''}`}
      >
      {selectedSemester ? (
        renderSemesterDetailView()
      ) : (
      <>
      {/* Hero Section - Mountain Scene Background */}
      <section className="hero-section-original">
        <Suspense fallback={<div className="absolute inset-0 w-full h-full z-0" />}>
          <GenerativeMountainScene />
        </Suspense>
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
        
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
              {user ? (
                <div className="hero-user-pill">
                  <span className="hero-user-pill-label">Signed in as</span>
                  <span className="hero-user-pill-name">{userDisplayName}</span>
                </div>
              ) : (
                <button className="btn-secondary-original" onClick={handleExploreCourseClick}>
                  Explore Course
                </button>
              )}
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

            {user && (
              <div className="leaderboard-user-summary">
                <div className="leaderboard-user-avatar">{userInitials}</div>
                <div className="leaderboard-user-info">
                  <p className="leaderboard-user-name">{userDisplayName}</p>
                  <p className="leaderboard-user-points">Badge Points: {leaderboardPoints}</p>
                </div>
                <button type="button" className="leaderboard-user-signout" onClick={onSignOut}>
                  <FaSignOutAlt />
                </button>
              </div>
            )}
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
                    <h3 className="step-title">Non-Custodial Wallet Created</h3>
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
      </>
      )}
      </div>

      <aside className={`programs-sidebar ${isProgramsSidebarOpen ? 'open' : ''}`}>
        <button
          type="button"
          className="programs-sidebar-close"
          onClick={onCloseProgramsSidebar}
          aria-label="Close programs sidebar"
        >
          ×
        </button>

        <div className="programs-sidebar-header">
          <div className="programs-sidebar-primary">
            <div className="programs-sidebar-avatar">TU</div>
            <div>
              <h3>Tribhuvan University</h3>
              <div className="programs-program-row">
                <button
                  type="button"
                  className="programs-program-button"
                  onClick={handleProgramClick}
                >
                  BSc CSIT
                </button>
                <button
                  type="button"
                  className="programs-animated-icon programs-animated-icon-button"
                  onClick={handleProgramClick}
                  aria-label="Show semester options"
                >
                  <span className="programs-animated-chevron" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {isSemesterDropdownOpen && (
          <div className="programs-semester-list">
            <button
              type="button"
              className="programs-semester-trigger"
              onClick={() => setShowSemesters(!showSemesters)}
            >
              <span>Semester</span>
              <span className="programs-semester-icon" aria-hidden="true">
                <span className="programs-semester-icon-chevron" />
              </span>
            </button>

            {showSemesters && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {semesters.map((semesterNumber) => (
                  <button
                    key={semesterNumber}
                    type="button"
                    className={`programs-semester-item ${selectedSemester === semesterNumber ? 'active' : ''}`}
                    onClick={() => handleSemesterClick(semesterNumber)}
                  >
                    <span className="programs-semester-circle">{semesterNumber}</span>
                    <span>Semester {semesterNumber}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </aside>
      </div>
    </>
  );
}
