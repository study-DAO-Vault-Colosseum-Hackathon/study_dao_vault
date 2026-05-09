import React, { useCallback, useEffect, useState, Suspense } from 'react';
import {
  FaArrowLeft,
  FaBook,
  FaCheck,
  FaCheckCircle,
  FaComments,
  FaFileAlt,
  FaFire,
  FaFlask,
  FaListUl,
  FaQuestionCircle,
  FaSearch,
  FaSignOutAlt,
  FaStickyNote,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import TutorHeroSection from './TutorHeroSection';
import HoverFooter from '../components/HoverFooter';
import GenerativeMountainScene from '../components/ui/mountain-scene';
import FeaturesCards from '../components/ui/feature-shader-cards';
import SubjectShaderCards from '../components/ui/subject-shader-cards';
import NotesFeed from '../components/NotesFeed';
import QAFeed from '../components/QAFeed';
import { useQA } from '../hooks/useQA';
import './EduChainNP.css';

const semesters = Array.from({ length: 8 }, (_, index) => index + 1);
const semesterPreviewImage = '/image.png';
const defaultCourseName = 'BSc CSIT';

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

const subjectChaptersByName = {
  'Introduction to Information Technology': ['Basics of IT', 'Hardware Overview', 'Software Types', 'Computer Organization', 'Data Representation', 'Networks Intro', 'Internet Basics', 'Security Fundamentals', 'Database Intro', 'Web Intro', 'IT Career Paths'],
  'C Programming': ['Introduction to C', 'Data Types & Variables', 'Operators & Expressions', 'Control Flow', 'Functions', 'Arrays', 'Strings', 'Pointers', 'Structures', 'File I/O', 'Preprocessor'],
  'Digital Logic': ['Boolean Algebra', 'Logic Gates', 'Combinational Circuits', 'Sequential Circuits', 'Karnaugh Maps', 'Multiplexers', 'Arithmetic Circuits'],
  'Mathematics I': ['Functions & Limits', 'Continuity & Derivatives', 'Differentiation Rules', 'Applications of Derivatives', 'Integration Basics', 'Definite Integrals', 'Integration Techniques', 'Sequences & Series', 'Vectors', 'Vector Calculus'],
  'Physics': ['Mechanics & Motion', 'Forces & Laws', 'Work & Energy', 'Momentum', 'Circular Motion', 'Gravity', 'Oscillations', 'Waves'],
  'Discrete Structure': ['Logic & Proofs', 'Sets & Relations', 'Functions', 'Counting', 'Permutations', 'Combinations'],
  'Object-Oriented Programming': ['OOP Basics', 'Classes & Objects', 'Constructors & Destructors', 'Inheritance', 'Polymorphism', 'Encapsulation', 'File I/O', 'Templates'],
  'Microprocessor': ['Microprocessor Basics', 'Architecture', 'Memory', 'I/O Interfaces', 'Interrupts', 'Instruction Set', 'Assembly'],
  'Mathematics II': ['Matrices', 'Determinants', 'Linear Systems', 'Eigenvalues', 'Vector Spaces', 'Linear Transformations', 'Complex Numbers', 'Fourier Series', 'Partial Derivatives'],
  'Statistics I': ['Data Collection', 'Descriptive Statistics', 'Probability', 'Distributions', 'Sampling', 'Hypothesis Testing'],
  'Data Structure and algorithm': ['Arrays & Lists', 'Stacks', 'Queues', 'Linked Lists', 'Trees', 'Graphs', 'Searching', 'Sorting', 'Dynamic Programming'],
  'Numerical Method': ['Root Finding', 'Linear Systems', 'Interpolation', 'Differentiation', 'Integration', 'Optimization', 'ODE Solving', 'Error Analysis'],
  'Computer Architecture': ['CPU Design', 'Instruction Execution', 'Pipeline Architecture', 'Memory Hierarchy', 'Cache Design', 'Virtual Memory', 'I/O Systems', 'Parallel Computing'],
  'Computer Graphics': ['Graphics Basics', '2D Graphics', 'Transformations', '3D Graphics', 'Viewing', 'Rasterization', 'Shading', 'Texturing'],
  'Statistics II': ['Confidence Intervals', 'T-Tests', 'ANOVA', 'Regression', 'Correlation', 'Chi-Square'],
  'Theory Of Computation': ['Regular Languages', 'DFA & NFA', 'Regular Expressions', 'Context-Free Languages', 'Pushdown Automata', 'Turing Machines', 'Decidability', 'Complexity Classes'],
  'Computer Networks': ['Network Basics', 'Physical Layer', 'Data Link Layer', 'Network Layer', 'Transport Layer', 'Application Layer', 'Security', 'Wireless'],
  'Database MAnagement System': ['Database Basics', 'ER Modeling', 'Relational Model', 'Normalization', 'SQL Basics', 'Queries', 'Indexing', 'Transactions', 'Tuning'],
  'Operating System': ['OS Basics', 'Processes & Threads', 'Scheduling', 'Memory Management', 'Virtual Memory', 'File Systems', 'I/O', 'Deadlocks', 'Security'],
  'Artificial Intelligence': ['AI Intro', 'Problem Solving', 'Search Algorithms', 'Knowledge Rep', 'Logical Reasoning', 'Machine Learning', 'Neural Networks', 'NLP'],
  'Design adn Analysis of Algorithms': ['Asymptotic Analysis', 'Divide & Conquer', 'Greedy Algorithms', 'Dynamic Programming', 'NP-Completeness', 'Approximation', 'Randomized Algorithms', 'Advanced Data Structures'],
  'System Analysis and Design': ['System Concepts', 'SDLC', 'Requirements', 'Design Principles', 'UML', 'Testing', 'Implementation', 'Maintenance'],
  'Cryptography': ['Crypto Basics', 'Symmetric Encryption', 'Asymmetric Encryption', 'Hashing', 'Digital Signatures', 'Authentication', 'Key Exchange', 'SSL/TLS'],
  'Simulation and Modeling': ['Modeling Basics', 'Discrete Events', 'Monte Carlo', 'System Dynamics', 'Validation', 'Performance Analysis', 'Optimization', 'Applications'],
  'Web Technology': ['Web Basics', 'HTML', 'CSS', 'JavaScript', 'DOM', 'AJAX', 'Frameworks', 'Responsive Design'],
  'Software Engineering': ['SE Principles', 'Planning', 'Requirements Analysis', 'Design Patterns', 'Testing Strategies', 'Quality Assurance', 'Project Mgmt', 'DevOps'],
  'Compiler Design and Construction': ['Lexical Analysis', 'Syntax Analysis', 'Semantic Analysis', 'Intermediate Code', 'Code Generation', 'Optimization', 'Error Handling', 'Tools'],
  'E-Governance': ['E-Gov Basics', 'Systems', 'Security', 'Interoperability', 'Services', 'Integration', 'Case Studies'],
  'NET Centric Computing': ['.NET Framework', 'C# Basics', 'Distributed Systems', 'Web Services', 'Azure', 'Microservices', 'Cloud'],
  'Technical Writing': ['Writing Basics', 'Documentation', 'Presentations', 'Reports', 'Manuals', 'Communication'],
  'Elective II': ['Topic 1', 'Topic 2', 'Topic 3', 'Topic 4', 'Topic 5', 'Topic 6'],
  'Advanced Java Programming': ['Java Basics Review', 'Collections', 'Concurrency', 'Spring Framework', 'Dependency Injection', 'Enterprise Apps', 'Testing', 'Performance'],
  'Data Warehousing and Data Mining': ['DW Concepts', 'OLAP', 'ETL', 'Schema Design', 'Data Mining Basics', 'Clustering', 'Classification', 'Association Rules'],
  'Principles of Management': ['Management Basics', 'Planning', 'Organization', 'Leadership', 'Control', 'HR Mgmt', 'Finance', 'IT Mgmt'],
  'Project Work': ['Project Planning', 'Requirements', 'Design', 'Development', 'Testing', 'Deployment', 'Documentation', 'Presentation'],
  'Network Security': ['Security Fundamentals', 'Threat Modeling', 'Cryptographic Protocols', 'Network Defense', 'Security Monitoring', 'Incident Response'],
  'Advanced Database': ['Advanced Concepts', 'Distributed DB', 'Performance Tuning', 'Replication', 'Backup & Recovery', 'Security', 'NoSQL', 'NewSQL'],
  'Internship': ['Company Overview', 'Project Intro', 'Development', 'Testing', 'Deployment', 'Learning', 'Reflection'],
  'Advanced Networking With IPV6': ['IPv6 Fundamentals', 'Addressing and Subnetting', 'Routing with IPv6', 'Transition Mechanisms', 'Security in IPv6'],
  'Decision Support System and Expert System': ['Decision Models', 'Knowledge Base', 'Inference Engine', 'Expert System Design', 'Applications and Evaluation'],
};

export default function LandingPage({
  onGoogleSignIn,
  user,
  onSignOut,
  isProgramsSidebarOpen = false,
  selectedSemester = null,
  showSemesterTrigger = false,
  navRequest = null,
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
  const [selectedChapterForNotes, setSelectedChapterForNotes] = useState(null);
  const [chapterSearchQuery, setChapterSearchQuery] = useState('');
  
  // Initialize Q&A hook at component level
  const qaData = useQA(selectedSubject?.name || '');
  const shouldBlurHomepage = isProgramsSidebarOpen && selectedSemester === null;
  const shouldShiftMainContent = isProgramsSidebarOpen && selectedSemester !== null;
  const userDisplayName = user?.displayName || user?.email?.split('@')[0] || 'Student';
  const userInitials = userDisplayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'ST';

  const scrollToSection = useCallback((sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

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

  useEffect(() => {
    if (!navRequest?.target) {
      return;
    }

    setShowSubjectsView(false);
    setSelectedSubject(null);
    setSelectedChapterForNotes(null);
    setChapterSearchQuery('');

    if (navRequest.target === 'home') {
      onCloseProgramsSidebar();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (navRequest.target === 'programs') {
      onOpenProgramsSidebar();
      return;
    }

    if (navRequest.target === 'about-us') {
      onCloseProgramsSidebar();
      scrollToSection('about-us-section');
    }
  }, [navRequest, onCloseProgramsSidebar, onOpenProgramsSidebar, scrollToSection]);

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
             onSubjectClick={(subject) => {
               setSelectedSubject(subject);
               setActiveTab('Chapters');
               setSelectedChapterForNotes(null);
               setChapterSearchQuery('');
             }}
           />
        </div>
      </section>
    );
  };

  const renderSubjectDetailView = () => {
    const tabs = ['Chapters', 'Syllabus', 'Notes/Lab', 'Q&A', 'Question Banks'];
    const tabIcons = {
      Chapters: FaListUl,
      Syllabus: FaFileAlt,
      'Notes/Lab': FaStickyNote,
      'Q&A': FaQuestionCircle,
      'Question Banks': FaComments,
    };
    const selectedSubjectChapters = (selectedSubject && subjectChaptersByName[selectedSubject.name]) || [];
    const normalizedChapterQuery = chapterSearchQuery.trim().toLowerCase();
    const filteredChapters = normalizedChapterQuery
      ? selectedSubjectChapters.filter((chapter) => chapter.toLowerCase().includes(normalizedChapterQuery))
      : selectedSubjectChapters;
    const completedCount = Math.min(3, selectedSubjectChapters.length);
    const estimatedHours = Math.max(6, Math.round(selectedSubjectChapters.length * 1.6));
    const heroDescription = selectedSubjectChapters.length > 0
      ? `${selectedSubject?.name} covers ${selectedSubjectChapters.slice(0, 3).join(', ').toLowerCase()} and more through a structured chapter flow.`
      : `Explore the complete learning path for ${selectedSubject?.name}.`;

    const handleChapterClick = (chapter) => {
      setSelectedChapterForNotes(chapter);
      setActiveTab('Notes');
    };

    const getChapterStatus = (chapterIndex, chapterName) => {
      if (selectedChapterForNotes === chapterName) {
        return 'In progress';
      }

      if (chapterIndex < completedCount) {
        return 'Done';
      }

      return 'Locked';
    };

    const renderEmptyState = (message) => (
      <div className="subject-detail-empty-state">
        <p>{message}</p>
      </div>
    );

    const renderChapterCards = () => (
      <>
        <div className="subject-detail-section-heading">
          <p className="subject-detail-section-label">CSIT Curriculum Chapters</p>
          <h2>Chapters</h2>
          <p>
            <span>{selectedSubjectChapters.length} chapters</span> for {selectedSubject?.name}
          </p>
        </div>

        <div className="subject-detail-search-row">
          <div className="subject-detail-search-box">
            <FaSearch className="subject-detail-search-icon" />
            <input
              type="text"
              value={chapterSearchQuery}
              onChange={(event) => setChapterSearchQuery(event.target.value)}
              placeholder="Search chapters..."
              aria-label="Search chapters"
            />
          </div>
        </div>

        {filteredChapters.length > 0 ? (
          <div className="subject-detail-chapter-grid">
            {filteredChapters.map((chapter, filteredIndex) => {
              const chapterIndex = selectedSubjectChapters.indexOf(chapter);
              const chapterStatus = getChapterStatus(chapterIndex, chapter);
              const isActive = selectedChapterForNotes === chapter;

              return (
                <button
                  key={`${selectedSubject?.name}-${chapter}-${filteredIndex}`}
                  type="button"
                  className={`subject-detail-chapter-card ${isActive ? 'active' : ''}`}
                  onClick={() => handleChapterClick(chapter)}
                >
                  <span className="subject-detail-card-corner" />
                  <div className="subject-detail-chapter-number">{String(chapterIndex + 1).padStart(2, '0')}</div>
                  <h3>{chapter}</h3>
                  <span className={`subject-detail-status-badge ${chapterStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                    {chapterStatus}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          renderEmptyState('No chapters matched your search.')
        )}
      </>
    );

    const renderNotesPanel = () => (
      <NotesFeed
        defaultFeedType="Notes"
        initialSearch={selectedChapterForNotes || ''}
        defaultChapterTag={selectedChapterForNotes || ''}
        subject={selectedSubject?.name || ''}
        course={defaultCourseName}
        semester={selectedSemesterNumber ? String(selectedSemesterNumber) : ''}
        hideFeedTypeFilter
        heading={`${selectedSubject?.name} Notes`}
        description={`Showing uploaded notes for ${selectedSubject?.name} from Semester ${selectedSemesterNumber ?? '--'}.${
          selectedChapterForNotes ? ` Searching for chapter: ${selectedChapterForNotes}.` : ""
        }`}
      />
    );

    const renderLabPanel = () => (
      <NotesFeed
        defaultFeedType="Lab Reports"
        initialSearch={selectedChapterForNotes || ''}
        defaultChapterTag={selectedChapterForNotes || ''}
        subject={selectedSubject?.name || ''}
        course={defaultCourseName}
        semester={selectedSemesterNumber ? String(selectedSemesterNumber) : ''}
        hideFeedTypeFilter
        heading={`${selectedSubject?.name} Lab Reports`}
        description={`Showing uploaded lab reports for ${selectedSubject?.name} from Semester ${selectedSemesterNumber ?? '--'}.${
          selectedChapterForNotes ? ` Searching for chapter: ${selectedChapterForNotes}.` : ""
        }`}
      />
    );

    const renderSimplePanel = (label, title, description) => (
      <div className="subject-detail-stack">
        <div className="subject-detail-section-heading">
          <p className="subject-detail-section-label">{label}</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="subject-detail-info-panel">
          <p>{title} content for {selectedSubject?.name} will appear here.</p>
        </div>
      </div>
    );

    const renderQAFeed = () => (
      <div className="subject-detail-stack">
        <QAFeed
          questions={qaData.questions}
          replies={qaData.replies}
          loading={qaData.loading}
          onAskQuestion={qaData.askQuestion}
          onReplyToQuestion={qaData.replyToQuestion}
          onVote={qaData.vote}
          selectedSubject={selectedSubject}
          semesterNumber={selectedSemesterNumber}
        />
      </div>
    );

    const renderQuestionBanks = () => (
      renderSimplePanel('Practice', 'Question Banks', `Practice important questions and problem sets for ${selectedSubject?.name}.`)
    );

    return (
      <section className="subject-detail-shell">
        <div className="subject-detail-topbar">
          <button
            type="button"
            className="subject-detail-back-button"
            onClick={() => {
              setSelectedSubject(null);
              setSelectedChapterForNotes(null);
              setChapterSearchQuery('');
            }}
          >
            <FaArrowLeft />
            <span>Back to Subjects</span>
          </button>

          <div className="subject-detail-tabs">
            {tabs.map((tab) => {
              const TabIcon = tabIcons[tab];
              
              // Special render for Notes/Lab toggle
              if (tab === 'Notes/Lab') {
                return (
                  <div
                    key={tab}
                    className={`subject-detail-tab ${activeTab === 'Notes' || activeTab === 'Lab' ? 'active' : ''}`}
                    style={{ display: 'flex', padding: 0, overflow: 'hidden' }}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveTab('Notes')}
                      className={`subject-detail-tab-half ${activeTab === 'Notes' ? 'active' : ''}`}
                      style={{
                        flex: 1,
                        borderRadius: '6px 0 0 6px',
                        padding: '8px 12px',
                        fontSize: '14px',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        border: 'none',
                        background: activeTab === 'Notes' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                        color: activeTab === 'Notes' ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <TabIcon />
                      <span>Notes</span>
                    </button>
                    <div style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.2)', margin: '0 4px' }} />
                    <button
                      type="button"
                      onClick={() => setActiveTab('Lab')}
                      className={`subject-detail-tab-half ${activeTab === 'Lab' ? 'active' : ''}`}
                      style={{
                        flex: 1,
                        borderRadius: '0 6px 6px 0',
                        padding: '8px 12px',
                        fontSize: '14px',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        border: 'none',
                        background: activeTab === 'Lab' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                        color: activeTab === 'Lab' ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <FaFlask />
                      <span>Lab</span>
                    </button>
                  </div>
                );
              }
              
              // Regular tab rendering
              return (
                <button
                  key={tab}
                  type="button"
                  className={`subject-detail-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  <TabIcon />
                  <span>{tab}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="subject-detail-content">
          <div className="subject-detail-hero">
            <p className="subject-detail-code">
              {selectedSubject?.code} - Semester {selectedSemesterNumber ?? '--'}
            </p>
            <h1>{selectedSubject?.name}</h1>
            <p className="subject-detail-description">{heroDescription}</p>

            <div className="subject-detail-hero-stats">
              <div className="subject-detail-pill">
                <FaBook />
                <span>{selectedSubjectChapters.length} chapters</span>
              </div>
              <div className="subject-detail-pill">
                <FaFire />
                <span>~{estimatedHours} hrs</span>
              </div>
              <div className="subject-detail-pill">
                <FaCheckCircle />
                <span>Beginner</span>
              </div>
              <div className="subject-detail-pill">
                <FaCheck />
                <span>{completedCount} completed</span>
              </div>
            </div>
          </div>

          <div className="subject-detail-divider" />

          <div className="subject-detail-panel">
            {activeTab === 'Chapters' && renderChapterCards()}
            {activeTab === 'Syllabus' && renderSimplePanel('Course Structure', 'Syllabus', `View the syllabus roadmap for ${selectedSubject?.name}.`)}
            {activeTab === 'Q&A' && renderQAFeed()}
            {activeTab === 'Question Banks' && renderQuestionBanks()}
            {activeTab === 'Notes' && renderNotesPanel()}
            {activeTab === 'Lab' && renderLabPanel()}
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
      <section className="hero-section-original" id="home-section">
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
              <button type="button" className="btn-primary-visual">
                Start Learning Now
              </button>
              {!user && (
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
      <section className="actions-section" id="programs-section">
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
      <div id="about-us-section">
        <TutorHeroSection />

        {/* Hover Footer */}
        <HoverFooter />
      </div>

      </>
      )}
      </div>

      {isProgramsSidebarOpen && (
        <button
          type="button"
          className="programs-sidebar-backdrop"
          onClick={onCloseProgramsSidebar}
          aria-label="Close programs sidebar"
        />
      )}

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
