import React, { useState } from 'react';
import {
  FaArrowLeft,
  FaArrowRight,
  FaBookOpen,
  FaCheckCircle,
  FaClock,
  FaCode,
  FaComments,
  FaDatabase,
  FaFileAlt,
  FaLightbulb,
  FaQuestionCircle,
  FaSearch,
  FaStickyNote,
  FaUsers,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './HamoCSIT.css';

export default function HamoCSIT({ onSignOut }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState('semesters'); // 'semesters', 'subjects', 'detail'
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [activeTab, setActiveTab] = useState('Chapters');
  const [selectedChapterForNotes, setSelectedChapterForNotes] = useState(null);
  const [chapterSearchQuery, setChapterSearchQuery] = useState('');

  const allSemesters = [
    {
      number: 1,
      name: 'First Semester',
      topic: 'Fundamentals',
      progress: 100,
      subjects: [
        { code: 'CSC114', name: 'Introduction to Information Technology', desc: 'This course introduces fundamental concepts of Information Technology and computer science.', chapters: ['Basics of IT', 'Hardware Overview', 'Software Types', 'Computer Organization', 'Data Representation', 'Networks Intro', 'Internet Basics', 'Security Fundamentals', 'Database Intro', 'Web Intro', 'IT Career Paths'] },
        { code: 'CSC115', name: 'C Programming', desc: 'This course is designed to familiarize students to the techniques of programming in C.', chapters: ['Introduction to C', 'Data Types & Variables', 'Operators & Expressions', 'Control Flow', 'Functions', 'Arrays', 'Strings', 'Pointers', 'Structures', 'File I/O', 'Preprocessor'] },
        { code: 'CSC116', name: 'Digital Logic', desc: 'This course introduces the basic tools for the design of digital circuits and introducing...', chapters: ['Boolean Algebra', 'Logic Gates', 'Combinational Circuits', 'Sequential Circuits', 'Karnaugh Maps', 'Multiplexers', 'Arithmetic Circuits'] },
        { code: 'MTH117', name: 'Mathematics I', desc: 'This course makes students able to understand and formulate real-world problems into math...', chapters: ['Functions & Limits', 'Continuity & Derivatives', 'Differentiation Rules', 'Applications of Derivatives', 'Integration Basics', 'Definite Integrals', 'Integration Techniques', 'Sequences & Series', 'Vectors', 'Vector Calculus'] },
        { code: 'PHY118', name: 'Physics', desc: 'This course provides knowledge in physics and applies this knowledge to computer science...', chapters: ['Mechanics & Motion', 'Forces & Laws', 'Work & Energy', 'Momentum', 'Circular Motion', 'Gravity', 'Oscillations', 'Waves'] },
      ],
    },
    {
      number: 2,
      name: 'Second Semester',
      topic: 'Algorithms',
      progress: 85,
      subjects: [
        { code: 'CSC165', name: 'Discrete Structures', desc: 'The course covers fundamental concepts of discrete structure like introduce logic, proofs, sets, relations...', chapters: ['Logic & Proofs', 'Sets & Relations', 'Functions', 'Counting', 'Permutations', 'Combinations'] },
        { code: 'CSC166', name: 'Object Oriented Programming', desc: 'The course covers the basic concepts of object oriented programming using C++ programming language.', chapters: ['OOP Basics', 'Classes & Objects', 'Constructors & Destructors', 'Inheritance', 'Polymorphism', 'Encapsulation', 'File I/O', 'Templates'] },
        { code: 'CSC167', name: 'Microprocessor', desc: 'This course contains fundamental concepts of computer organization, basic I/O interfaces and Interrupts operations.', chapters: ['Microprocessor Basics', 'Architecture', 'Memory', 'I/O Interfaces', 'Interrupts', 'Instruction Set', 'Assembly'] },
        { code: 'MTH168', name: 'Mathematics II', desc: 'This course covers calculus, vector algebra and related mathematical tools used in computer science.', chapters: ['Matrices', 'Determinants', 'Linear Systems', 'Eigenvalues', 'Vector Spaces', 'Linear Transformations', 'Complex Numbers', 'Fourier Series', 'Partial Derivatives'] },
        { code: 'STA169', name: 'Statistics I', desc: 'This course introduces statistical tools and their application in computer science.', chapters: ['Data Collection', 'Descriptive Statistics', 'Probability', 'Distributions', 'Sampling', 'Hypothesis Testing'] },
      ],
    },
    {
      number: 3,
      name: 'Third Semester',
      topic: 'Web Dev',
      progress: 60,
      subjects: [
        { code: 'CSC206', name: 'Data Structures and Algorithms', desc: 'This course covers linear and non-linear data structures and various algorithms for searching and sorting.', chapters: ['Arrays & Lists', 'Stacks', 'Queues', 'Linked Lists', 'Trees', 'Graphs', 'Searching', 'Sorting', 'Dynamic Programming'] },
        { code: 'CSC207', name: 'Numerical Methods', desc: 'This course introduces numerical techniques for solving mathematical problems computationally.', chapters: ['Root Finding', 'Linear Systems', 'Interpolation', 'Differentiation', 'Integration', 'Optimization', 'ODE Solving', 'Error Analysis'] },
        { code: 'CSC208', name: 'Computer Architecture', desc: 'This course covers the design and organization of computer hardware systems.', chapters: ['CPU Design', 'Instruction Execution', 'Pipeline Architecture', 'Memory Hierarchy', 'Cache Design', 'Virtual Memory', 'I/O Systems', 'Parallel Computing'] },
        { code: 'CSC209', name: 'Computer Graphics', desc: 'This course covers 2D and 3D graphics programming and rendering techniques.', chapters: ['Graphics Basics', '2D Graphics', 'Transformations', '3D Graphics', 'Viewing', 'Rasterization', 'Shading', 'Texturing'] },
        { code: 'STA210', name: 'Statistics II', desc: 'This course covers advanced statistical concepts and their application in computing.', chapters: ['Confidence Intervals', 'T-Tests', 'ANOVA', 'Regression', 'Correlation', 'Chi-Square'] },
      ],
    },
    {
      number: 4,
      name: 'Fourth Semester',
      topic: 'Databases',
      progress: 45,
      subjects: [
        { code: 'CSC257', name: 'Theory of Computation', desc: 'This course introduces formal languages, automata theory, and computational complexity.', chapters: ['Regular Languages', 'DFA & NFA', 'Regular Expressions', 'Context-Free Languages', 'Pushdown Automata', 'Turing Machines', 'Decidability', 'Complexity Classes'] },
        { code: 'CSC258', name: 'Computer Networks', desc: 'This course covers data communication concepts, network protocols, and internet technologies.', chapters: ['Network Basics', 'Physical Layer', 'Data Link Layer', 'Network Layer', 'Transport Layer', 'Application Layer', 'Security', 'Wireless'] },
        { code: 'CSC259', name: 'Operating Systems', desc: 'This course covers process management, memory management, file systems, and OS design principles.', chapters: ['OS Basics', 'Processes & Threads', 'Scheduling', 'Memory Management', 'Virtual Memory', 'File Systems', 'I/O', 'Deadlocks', 'Security'] },
        { code: 'CSC260', name: 'Database Management Systems', desc: 'This course covers relational databases, SQL, normalization, and database design concepts.', chapters: ['Database Basics', 'ER Modeling', 'Relational Model', 'Normalization', 'SQL Basics', 'Queries', 'Indexing', 'Transactions', 'Tuning'] },
        { code: 'CSC261', name: 'Artificial Intelligence', desc: 'This course introduces AI concepts including search, knowledge representation, and machine learning basics.', chapters: ['AI Intro', 'Problem Solving', 'Search Algorithms', 'Knowledge Rep', 'Logical Reasoning', 'Machine Learning', 'Neural Networks', 'NLP'] },
      ],
    },
    {
      number: 5,
      name: 'Fifth Semester',
      topic: 'Systems',
      progress: 30,
      subjects: [
        { code: 'CSC314', name: 'Design and Analysis of Algorithms', desc: 'This course covers algorithm design paradigms, complexity analysis and advanced data structures.', chapters: ['Asymptotic Analysis', 'Divide & Conquer', 'Greedy Algorithms', 'Dynamic Programming', 'NP-Completeness', 'Approximation', 'Randomized Algorithms', 'Advanced Data Structures'] },
        { code: 'CSC315', name: 'System Analysis and Design', desc: 'This course covers software development methodologies, system analysis and design principles.', chapters: ['System Concepts', 'SDLC', 'Requirements', 'Design Principles', 'UML', 'Testing', 'Implementation', 'Maintenance'] },
        { code: 'CSC316', name: 'Cryptography', desc: 'This course covers cryptographic techniques, security protocols and information security principles.', chapters: ['Crypto Basics', 'Symmetric Encryption', 'Asymmetric Encryption', 'Hashing', 'Digital Signatures', 'Authentication', 'Key Exchange', 'SSL/TLS'] },
        { code: 'CSC317', name: 'Simulation and Modeling', desc: 'This course introduces simulation techniques and mathematical modeling of complex systems.', chapters: ['Modeling Basics', 'Discrete Events', 'Monte Carlo', 'System Dynamics', 'Validation', 'Performance Analysis', 'Optimization', 'Applications'] },
        { code: 'CSC318', name: 'Web Technology', desc: 'This course covers web development concepts, HTML, CSS, JavaScript and web frameworks.', chapters: ['Web Basics', 'HTML', 'CSS', 'JavaScript', 'DOM', 'AJAX', 'Frameworks', 'Responsive Design'] },
        { code: 'CSC319', name: 'Elective I', desc: 'Students choose an elective from: Multimedia Computing, Wireless Networking, Image Processing, etc.', chapters: ['Topic 1', 'Topic 2', 'Topic 3', 'Topic 4', 'Topic 5', 'Topic 6'] },
      ],
    },
    {
      number: 6,
      name: 'Sixth Semester',
      topic: 'Projects',
      progress: 15,
      subjects: [
        { code: 'CSC324', name: 'Software Engineering', desc: 'This course covers software development life cycle, project management, and quality assurance.', chapters: ['SE Principles', 'Planning', 'Requirements Analysis', 'Design Patterns', 'Testing Strategies', 'Quality Assurance', 'Project Mgmt', 'DevOps'] },
        { code: 'CSC365', name: 'Compiler Design and Construction', desc: 'This course covers lexical analysis, parsing, semantic analysis and code generation.', chapters: ['Lexical Analysis', 'Syntax Analysis', 'Semantic Analysis', 'Intermediate Code', 'Code Generation', 'Optimization', 'Error Handling', 'Tools'] },
        { code: 'CSC366', name: 'E-Governance', desc: 'This course covers digital government systems and e-governance frameworks.', chapters: ['E-Gov Basics', 'Systems', 'Security', 'Interoperability', 'Services', 'Integration', 'Case Studies'] },
        { code: 'CSC367', name: 'NET Centric Computing', desc: 'This course covers .NET framework and distributed computing concepts.', chapters: ['.NET Framework', 'C# Basics', 'Distributed Systems', 'Web Services', 'Azure', 'Microservices', 'Cloud'] },
        { code: 'CSC368', name: 'Technical Writing', desc: 'This course covers professional and technical communication for computing professionals.', chapters: ['Writing Basics', 'Documentation', 'Presentations', 'Reports', 'Manuals', 'Communication'] },
        { code: 'CSC369', name: 'Elective II', desc: 'Students choose an elective from: Applied Logic, E-Commerce, Automation and Robotics, Neural Networks, etc.', chapters: ['Topic 1', 'Topic 2', 'Topic 3', 'Topic 4', 'Topic 5', 'Topic 6'] },
      ],
    },
    {
      number: 7,
      name: 'Seventh Semester',
      topic: 'Specialization',
      progress: 0,
      subjects: [
        { code: 'CSC409', name: 'Advanced Java Programming', desc: 'This course covers enterprise Java development, Spring framework, and advanced OOP concepts.', chapters: ['Java Basics Review', 'Collections', 'Concurrency', 'Spring Framework', 'Dependency Injection', 'Enterprise Apps', 'Testing', 'Performance'] },
        { code: 'CSC410', name: 'Data Warehousing and Data Mining', desc: 'This course covers data warehouse design, OLAP and data mining techniques.', chapters: ['DW Concepts', 'OLAP', 'ETL', 'Schema Design', 'Data Mining Basics', 'Clustering', 'Classification', 'Association Rules'] },
        { code: 'CSC411', name: 'Principles of Management', desc: 'This course introduces management concepts and their application in IT organizations.', chapters: ['Management Basics', 'Planning', 'Organization', 'Leadership', 'Control', 'HR Mgmt', 'Finance', 'IT Mgmt'] },
        { code: 'CSC412', name: 'Project Work', desc: 'Students undertake a major software development project applying all learned skills.', chapters: ['Project Planning', 'Requirements', 'Design', 'Development', 'Testing', 'Deployment', 'Documentation', 'Presentation'] },
        { code: 'CSC413', name: 'Elective III', desc: 'Students choose an elective from: Information Retrieval, Database Administration, Network Security, etc.', chapters: ['Topic 1', 'Topic 2', 'Topic 3', 'Topic 4', 'Topic 5', 'Topic 6'] },
      ],
    },
    {
      number: 8,
      name: 'Eighth Semester',
      topic: 'Capstone',
      progress: 0,
      subjects: [
        { code: 'CSC461', name: 'Advanced Database', desc: 'This course covers advanced database systems including distributed databases and performance tuning.', chapters: ['Advanced Concepts', 'Distributed DB', 'Performance Tuning', 'Replication', 'Backup & Recovery', 'Security', 'NoSQL', 'NewSQL'] },
        { code: 'CSC462', name: 'Internship', desc: 'This course covers real-world practice in industry, applying theoretical and practical knowledge.', chapters: ['Company Overview', 'Project Intro', 'Development', 'Testing', 'Deployment', 'Learning', 'Reflection'] },
        { code: 'CSC463', name: 'Elective IV', desc: 'Students choose an elective from: Advanced Networking with IPv6, Game Technology, Cloud Computing, etc.', chapters: ['Topic 1', 'Topic 2', 'Topic 3', 'Topic 4', 'Topic 5', 'Topic 6'] },
        { code: 'CSC465', name: 'Elective V', desc: 'Students choose a second elective from: Distributed Networking, Mobile App Development, GIS, etc.', chapters: ['Topic 1', 'Topic 2', 'Topic 3', 'Topic 4', 'Topic 5', 'Topic 6'] },
      ],
    },
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
      icon: FaUsers,
      title: 'Community Forum',
      description: 'Connect with peers, ask questions, and collaborate on projects',
    },
    {
      icon: FaLightbulb,
      title: 'Expert Guidance',
      description: 'Access curated content from experienced instructors and mentors',
    },
  ];

  const semesters = allSemesters;

  const handleSemesterClick = (semester) => {
    setSelectedSemester(semester);
    setCurrentView('subjects');
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setCurrentView('detail');
    setActiveTab('Chapters');
    setSelectedChapterForNotes(null);
    setChapterSearchQuery('');
  };

  const handleBackClick = () => {
    if (currentView === 'detail') {
      setCurrentView('subjects');
      setSelectedSubject(null);
      setSelectedChapterForNotes(null);
      setChapterSearchQuery('');
    } else if (currentView === 'subjects') {
      setCurrentView('semesters');
      setSelectedSemester(null);
    }
  };

  const tabIcons = {
    'Chapters': <FaBookOpen />,
    'Syllabus': <FaFileAlt />,
    'Notes': <FaStickyNote />,
    'Q/A Feed': <FaComments />,
    'Question Banks': <FaQuestionCircle />,
  };
  const tabs = ['Chapters', 'Syllabus', 'Notes', 'Q/A Feed', 'Question Banks'];

  const handleChapterClick = (chapterName) => {
    setSelectedChapterForNotes(chapterName);
    setActiveTab('Notes');
  };


  const getCourseNature = (courseCode) => (courseCode.startsWith('CSC') ? 'Theory + Lab' : 'Theory');

  const hamroDetailedUnitsByCode = {
    CSC257: [
      { title: 'Unit 1. Basic Foundations', hours: '3 Hrs.', topics: ['Review of set theory, logic, functions and proofs', 'Automata, computability and complexity basics', 'Alphabets, strings, language and closure concepts'] },
      { title: 'Unit 2. Introduction to Finite Automata', hours: '8 Hrs.', topics: ['DFA, NFA and epsilon-NFA models', 'Equivalence and subset construction', 'Moore and Mealy machines'] },
      { title: 'Unit 3. Regular Expression', hours: '6 Hrs.', topics: ['Regular operators and algebraic rules', 'Conversion between regular expressions and automata', 'Pumping lemma and closure properties'] },
      { title: 'Unit 4. Context Free Grammar', hours: '9 Hrs.', topics: ['CFG, derivations and parse trees', 'Grammar simplification and normal forms', 'CFL pumping lemma and closure properties'] },
      { title: 'Unit 5. Push Down Automata', hours: '7 Hrs.', topics: ['PDA representation and operations', 'Acceptance by final state and empty stack', 'Conversion between CFG and PDA'] },
      { title: 'Unit 6. Turing Machine', hours: '10 Hrs.', topics: ['TM notation and language recognition', 'Variants of TM and equivalence', 'Universal TM and encoding concepts'] },
      { title: 'Unit 7. Undecidability and Intractability', hours: '5 Hrs.', topics: ['Complexity classes and reducibility', 'Cook theorem and satisfiability', 'Halting problem and undecidable problems'] },
    ],
    CSC261: [
      { title: 'Unit 1. Introduction', hours: '3 Hrs.', topics: ['AI perspectives and history', 'Foundations of AI', 'AI applications overview'] },
      { title: 'Unit 2. Intelligent Agents', hours: '4 Hrs.', topics: ['Agent structure and properties', 'PEAS and PAGE models', 'Types of agents and environments'] },
      { title: 'Unit 3. Problem Solving by Searching', hours: '9 Hrs.', topics: ['State-space formulation', 'Uninformed and informed search', 'Game playing and CSP'] },
      { title: 'Unit 4. Knowledge Representation', hours: '14 Hrs.', topics: ['Semantic nets, frames and rule systems', 'Propositional and predicate logic inference', 'Probabilistic reasoning and fuzzy logic'] },
      { title: 'Unit 5. Machine Learning', hours: '9 Hrs.', topics: ['Supervised, unsupervised, reinforcement learning', 'Naive Bayes and genetic algorithms', 'ANN, perceptron and backpropagation'] },
      { title: 'Unit 6. Applications of AI', hours: '6 Hrs.', topics: ['Expert systems', 'Natural language processing', 'Machine vision and robotics'] },
    ],
    CSC410: [
      { title: 'Unit 1. Introduction to Data Warehousing', hours: '5 Hrs.', topics: ['Data warehouse architecture and components', 'Multidimensional model and OLAP', 'Data marts and trends'] },
      { title: 'Unit 5. Mining Frequent Patterns', hours: '6 Hrs.', topics: ['Association rules and market basket analysis', 'Apriori and FP-growth', 'Correlation analysis and lift'] },
      { title: 'Unit 6. Classification and Prediction', hours: '10 Hrs.', topics: ['Decision trees and Bayesian classification', 'SVM and backpropagation', 'Evaluation metrics and validation'] },
      { title: 'Unit 8. Graph Mining and Social Network Analysis', hours: '5 Hrs.', topics: ['Graph mining algorithms', 'Social network link analysis', 'Trust and signed network concepts'] },
      { title: 'Unit 9. Mining Spatial, Multimedia, Text and Web Data', hours: '2 Hrs.', topics: ['Spatial and multimedia mining', 'Text mining basics', 'Web content/structure/usage mining'] },
    ],
  };

  const buildFallbackUnits = (chapters = [], subjectName = 'this course') => {
    if (!Array.isArray(chapters) || chapters.length === 0) return [];

    return chapters.map((chapterName, index) => ({
      title: `Unit ${index + 1}. ${chapterName}`,
      hours: `${index % 3 === 2 ? 4 : 3} Hrs.`,
      topics: [
        `${chapterName} fundamentals in ${subjectName}`,
        `Core methods, examples, and problem-solving of ${chapterName}`,
        `Important applications and exam-focused points of ${chapterName}`,
      ],
    }));
  };

  const buildSyllabus = (subject, semester) => ({
    courseTitle: subject.name,
    courseCode: subject.code,
    semester: semester.number,
    natureOfCourse: getCourseNature(subject.code),
    fullMarks: '60 + 20 + 20',
    passMarks: '24 + 8 + 8',
    creditHours: '3',
    description: subject.desc,
    objective:
      subject.objective ||
      `The main objective of this course is to provide students with strong conceptual and practical understanding of ${subject.name.toLowerCase()} for solving real-world computing problems.`,
    units: hamroDetailedUnitsByCode[subject.code] || buildFallbackUnits(subject.chapters, subject.name),
  });

  // VIEW 1: Semester Path
  if (currentView === 'semesters') {
    return (
    <div className="hamro-csit-container">
      {/* Navigation */}
      <nav className="hamro-navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <span className="brand-icon">₹</span>
            <span className="brand-name">EduChainNP</span>
          </div>
          <div className="navbar-right">
          <a href="#semesters" className="nav-link">Notes</a>
          <a href="#semesters" className="nav-link">Question</a>
          <a href="#semesters" className="nav-link">Q/A</a>
           <a href="#semesters" className="nav-link">CHapters Overall</a>
            {/* <a href="#semesters" className="nav-link">Semesters</a> */}
            <a href="#semesters" className="nav-link">Notices</a>
            
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
            <span className="banner-label">EduChainNP</span>
            <span className="banner-message">Decentralized Learning Platform: Master BSc CSIT with Blockchain-Verified Credentials</span>
          </div>
          <a href="#" className="banner-link">Explore Now →</a>
        </div>
      </section>

      {/* Semester Grid */}
      <section className="semesters-section" id="semesters">
        <div className="section-container">
          <h2 className="section-heading">Your Semester Path</h2>
          <div className="semesters-grid">
            {semesters.map((sem) => (
              <div key={sem.number} className="semester-card" onClick={() => handleSemesterClick(sem)} style={{ cursor: 'pointer' }}>
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
          <h2 className="section-heading">Why Choose EduChainNP</h2>
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
              <span className="footer-brand-name">EduChainNP</span>
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
            <p>&copy; 2026 EduChainNP For B.Sc. CSIT students in Nepal.</p>
          </div>
        </div>
      </footer>
    </div>
    );
  }

  // VIEW 2: Subject List
  if (currentView === 'subjects' && selectedSemester) {
    return (
      <div className="hamro-csit-container" style={{ background: '#ffffff', minHeight: '100vh' }}>
        {/* Subject List Section */}
        <section style={{ padding: '40px 32px', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <button 
              onClick={handleBackClick}
              style={{ 
                background: '#2ecc71', 
                border: 'none', 
                color: '#fff', 
                padding: '10px 20px', 
                borderRadius: '6px', 
                cursor: 'pointer', 
                fontSize: '14px', 
                fontWeight: '600'
              }}
            >
              ← Back to Semesters
            </button>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', color: '#1a1a1a' }}>
              {selectedSemester.name} — Subjects
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
            {selectedSemester.subjects.map((subject) => (
              <div
                key={subject.code}
                style={{
                  background: '#fff',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
                }}
              >
                {/* Subject Header */}
                <div style={{ padding: '20px 20px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, paddingRight: '16px' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px', margin: '0 0 8px' }}>
                      {subject.name}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#555', margin: 0, lineHeight: '1.5' }}>
                      {subject.desc}
                    </p>
                  </div>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: '#0d9e7e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: '#fff',
                      fontSize: '20px',
                      fontWeight: 'bold',
                    }}
                  >
                    ≡
                  </div>
                </div>

                {/* Subject Footer Info */}
                <div style={{ padding: '10px 20px 14px', display: 'flex', alignItems: 'center', gap: '20px', fontSize: '12px', color: '#333' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ color: '#0d9e7e' }}>≡</span> {subject.code}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ color: '#0d9e7e' }}>📚</span> Chapters : {subject.chapters}
                  </span>
                </div>

                {/* Action Row */}
                <div style={{ background: '#f0f4f8', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e8e8e8' }}>
                  <span style={{ fontSize: '20px' }}>★</span>
                  <button
                    onClick={() => handleSubjectClick(subject)}
                    style={{
                      background: '#0d9e7e',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 18px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    Explore Chapters →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // VIEW 3: Subject Detail
  if (currentView === 'detail' && selectedSemester && selectedSubject) {
    const syllabus = buildSyllabus(selectedSubject, selectedSemester);
    const isChaptersTab = activeTab === 'Chapters';
    const filteredChapters = selectedSubject.chapters.filter((chapterName) =>
      chapterName.toLowerCase().includes(chapterSearchQuery.trim().toLowerCase())
    );
    const completedCount = Math.min(3, selectedSubject.chapters.length);
    const estimatedHours = Math.max(6, Math.round(selectedSubject.chapters.length * 1.6));
    const heroDescription = `${selectedSubject.desc} This subject walks through ${selectedSubject.chapters.slice(0, 3).join(', ').toLowerCase()} and related concepts.`;

    return (
      <div className="hamro-csit-container" style={{ background: '#0b0f1d', minHeight: '100vh' }}>
        <div style={{ background: 'rgba(11, 15, 29, 0.96)', borderBottom: '1px solid rgba(148, 163, 184, 0.12)', padding: '14px 28px', position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(30, 41, 59, 0.45)', border: '1px solid rgba(139, 92, 246, 0.18)', color: '#cbd5e1', padding: '11px 18px', borderRadius: '16px', cursor: 'pointer', fontSize: '15px', fontWeight: '500' }}>
                <FaArrowLeft />
                <span>Back to Home</span>
              </button>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    whiteSpace: 'nowrap',
                    padding: '10px 15px',
                    borderRadius: '16px',
                    background: 'rgba(30, 41, 59, 0.45)',
                    border: activeTab === tab ? '1px solid rgba(168, 85, 247, 0.55)' : '1px solid rgba(139, 92, 246, 0.18)',
                    color: activeTab === tab ? '#c4b5fd' : '#9ca3af',
                    boxShadow: activeTab === tab ? 'inset 0 -2px 0 #9333ea' : 'none',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  {tabIcons[tab]}
                  <span>{tab}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <section style={{ padding: '26px 28px 40px', maxWidth: '1400px', margin: '0 auto', color: '#f8fafc' }}>
          <div style={{ padding: '4px 4px 22px' }}>
            <p style={{ margin: '0 0 14px', color: '#9333ea', textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '13px', fontWeight: '700' }}>
              {selectedSubject.code} - Semester {selectedSemester.number}
            </p>
            <h1 style={{ margin: 0, fontSize: 'clamp(1.8rem, 3vw, 3rem)', lineHeight: 1.12, color: '#f8fafc' }}>
              {selectedSubject.name}
            </h1>
            <p style={{ margin: '14px 0 0', maxWidth: '920px', color: 'rgba(226, 232, 240, 0.72)', fontSize: 'clamp(0.98rem, 1.4vw, 1.12rem)', lineHeight: 1.6 }}>
              {heroDescription}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '22px' }}>
              {[
                { icon: <FaBookOpen />, label: `${selectedSubject.chapters.length} chapters` },
                { icon: <FaClock />, label: `~${estimatedHours} hrs` },
                { icon: <FaLightbulb />, label: 'Beginner' },
                { icon: <FaCheckCircle />, label: `${completedCount} completed` },
              ].map((item) => (
                <div key={item.label} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '999px', background: 'rgba(49, 46, 129, 0.22)', border: '1px solid rgba(99, 102, 241, 0.2)', color: '#cbd5e1', fontSize: '13px', fontWeight: '500' }}>
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: '1px', background: 'rgba(148, 163, 184, 0.16)', marginBottom: '24px' }} />

          <div style={{ background: 'rgba(17, 24, 39, 0.65)', border: '1px solid rgba(99, 102, 241, 0.16)', borderRadius: '20px', padding: '26px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)' }}>
            {activeTab === 'Chapters' && (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ margin: '0 0 8px', color: 'rgba(148, 163, 184, 0.72)', textTransform: 'uppercase', letterSpacing: '0.16em', fontSize: '12px', fontWeight: '700' }}>
                    CSIT Curriculum Chapters
                  </p>
                  <h2 style={{ margin: 0, color: '#f8fafc', fontSize: '18px' }}>Chapters</h2>
                  <p style={{ margin: '8px 0 0', color: 'rgba(203, 213, 225, 0.68)', fontSize: '14px' }}>
                    <span style={{ color: '#c4b5fd', fontWeight: '700' }}>{selectedSubject.chapters.length} chapters</span> for {selectedSubject.name}
                  </p>
                </div>

                <div style={{ marginBottom: '22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(99, 102, 241, 0.24)', borderRadius: '16px', padding: '12px 16px' }}>
                    <FaSearch style={{ color: '#a78bfa', fontSize: '16px' }} />
                    <input
                      type="text"
                      value={chapterSearchQuery}
                      onChange={(event) => setChapterSearchQuery(event.target.value)}
                      placeholder="Search chapters..."
                      aria-label="Search chapters"
                      style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: '#f8fafc', fontSize: '15px' }}
                    />
                  </div>
                </div>

                {filteredChapters.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    {filteredChapters.map((chapterName, index) => {
                      const originalIndex = selectedSubject.chapters.indexOf(chapterName);
                      const chapterStatus = selectedChapterForNotes === chapterName
                        ? 'In progress'
                        : originalIndex < completedCount
                          ? 'Done'
                          : 'Locked';

                      return (
                        <button
                          key={`${selectedSubject.code}-${chapterName}`}
                          type="button"
                          onClick={() => handleChapterClick(chapterName)}
                          style={{
                            position: 'relative',
                            minHeight: '180px',
                            borderRadius: '18px',
                            border: selectedChapterForNotes === chapterName ? '1px solid #9333ea' : '1px solid rgba(99, 102, 241, 0.2)',
                            background: 'linear-gradient(180deg, rgba(20, 25, 55, 0.96), rgba(17, 24, 39, 0.92))',
                            padding: '20px 18px',
                            textAlign: 'left',
                            color: '#f8fafc',
                            cursor: 'pointer',
                            boxShadow: selectedChapterForNotes === chapterName ? '0 0 0 1px rgba(147, 51, 234, 0.45)' : 'none',
                          }}
                        >
                          <span style={{ position: 'absolute', right: '18px', top: '18px', width: '10px', height: '10px', border: '1px solid rgba(148, 163, 184, 0.28)', borderRadius: '2px' }} />
                          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '52px', height: '52px', borderRadius: '14px', marginBottom: '18px', background: 'rgba(76, 29, 149, 0.58)', color: '#c4b5fd', fontSize: '18px', fontWeight: '800' }}>
                            {String(originalIndex + 1).padStart(2, '0')}
                          </div>
                          <h3 style={{ margin: '0 0 20px', fontSize: '16px', lineHeight: 1.4 }}>{chapterName}</h3>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '7px 12px',
                            borderRadius: '999px',
                            fontSize: '12px',
                            fontWeight: '700',
                            background: chapterStatus === 'In progress' ? 'rgba(88, 28, 135, 0.62)' : 'rgba(76, 29, 149, 0.48)',
                            color: '#c084fc',
                          }}>
                            {chapterStatus}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ borderRadius: '18px', border: '1px solid rgba(99, 102, 241, 0.16)', background: 'rgba(15, 23, 42, 0.9)', padding: '22px 24px' }}>
                    <p style={{ margin: 0, color: 'rgba(203, 213, 225, 0.72)', fontSize: '16px' }}>No chapters matched your search.</p>
                  </div>
                )}
              </div>
            )}
              {activeTab === 'Syllabus' && (
                <div>
                  <div className="hamro-syllabus-paper">
                    <div className="hamro-syllabus-header">
                      <p>Tribhuvan University</p>
                      <p>Institute of Science and Technology</p>
                      <p>Bachelor of Science in Computer Science and Information Technology</p>
                    </div>

                    <div className="hamro-syllabus-meta">
                      <div className="hamro-syllabus-meta-left">
                        <p><span>Course Title:</span> {syllabus.courseTitle}</p>
                        <p><span>Course no:</span> {syllabus.courseCode}</p>
                        <p><span>Semester:</span> {syllabus.semester}</p>
                        <p><span>Nature of course:</span> {syllabus.natureOfCourse}</p>
                      </div>
                      <div className="hamro-syllabus-meta-right">
                        <p><span>Full Marks:</span> {syllabus.fullMarks}</p>
                        <p><span>Pass Marks:</span> {syllabus.passMarks}</p>
                        <p><span>Credit Hours:</span> {syllabus.creditHours}</p>
                      </div>
                    </div>

                    <p className="hamro-syllabus-text-block">
                      <strong>Course Description :</strong> {syllabus.description}
                    </p>
                    <p className="hamro-syllabus-text-block">
                      <strong>Course Objective :</strong> {syllabus.objective}
                    </p>
                    <p className="hamro-syllabus-text-block">
                      <strong>Source :</strong> HamroCSIT syllabus/subject notes (chapter-wise basis)
                    </p>

                    <h4 className="hamro-syllabus-contents-title">Course Contents:</h4>
                    <div className="hamro-syllabus-units">
                      {syllabus.units.map((unit) => (
                        <div key={unit.title} className="hamro-syllabus-unit">
                          <div className="hamro-syllabus-unit-header">
                            <h5>{unit.title}</h5>
                            <span>{unit.hours}</span>
                          </div>
                          <p>{unit.topics.join('; ')}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'Notes' && (
                <div>
                  <p style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '16px' }}>
                    📝 Study notes for <strong>{selectedSubject.name}</strong> ({selectedSubject.code})
                  </p>
                  {(() => {
                    const noteChapters = Array.isArray(selectedSubject?.chapters) ? selectedSubject.chapters : [];
                    const orderedNoteChapters = selectedChapterForNotes && noteChapters.includes(selectedChapterForNotes)
                      ? [selectedChapterForNotes, ...noteChapters.filter((chapterName) => chapterName !== selectedChapterForNotes)]
                      : noteChapters;

                    return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {orderedNoteChapters.map((chapterName, i) => (
                      <div
                        key={`${chapterName}-${i}`}
                        style={{
                          background: 'rgba(15, 23, 42, 0.9)',
                          border: chapterName === selectedChapterForNotes ? '1px solid #9333ea' : '1px solid rgba(99, 102, 241, 0.16)',
                          borderRadius: '18px',
                          padding: '14px 16px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#9333ea';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = chapterName === selectedChapterForNotes ? '#9333ea' : 'rgba(99, 102, 241, 0.16)';
                        }}
                      >
                        <span style={{ fontWeight: '500', color: '#f8fafc', fontSize: '14px' }}>
                          {chapterName} Notes
                        </span>
                        <span style={{ color: '#c084fc', fontSize: '12px' }}>{chapterName === selectedChapterForNotes ? '📌 Opened from Chapters' : '📄 View'}</span>
                      </div>
                    ))}
                  </div>
                    );
                  })()}
                </div>
              )}
              {activeTab === 'Q/A Feed' && (
                <div>
                  <p style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '16px' }}>
                    💬 Questions & Answers for <strong>{selectedSubject.name}</strong> ({selectedSubject.code})
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ background: 'rgba(15, 23, 42, 0.9)', borderRadius: '18px', padding: '16px', borderLeft: '4px solid #9333ea' }}>
                      <div style={{ fontWeight: '600', color: '#f8fafc', marginBottom: '8px' }}>Q: What is the scope of this course?</div>
                      <div style={{ color: '#cbd5e1', fontSize: '13px' }}>This course covers fundamental concepts and practical applications...</div>
                    </div>
                    <div style={{ background: 'rgba(15, 23, 42, 0.9)', borderRadius: '18px', padding: '16px', borderLeft: '4px solid #9333ea' }}>
                      <div style={{ fontWeight: '600', color: '#f8fafc', marginBottom: '8px' }}>Q: How are exams conducted?</div>
                      <div style={{ color: '#cbd5e1', fontSize: '13px' }}>Exams consist of theory and practical components...</div>
                    </div>
                    <div style={{ background: 'rgba(15, 23, 42, 0.9)', borderRadius: '18px', padding: '16px', borderLeft: '4px solid #9333ea' }}>
                      <div style={{ fontWeight: '600', color: '#f8fafc', marginBottom: '8px' }}>Q: Where can I find additional resources?</div>
                      <div style={{ color: '#cbd5e1', fontSize: '13px' }}>Additional resources are available in the Question Bank section...</div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'Question Banks' && (
                <div>
                  <p style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '16px' }}>
                    🗃️ Question bank for <strong>{selectedSubject.name}</strong> ({selectedSubject.code})
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <div style={{ background: 'rgba(15, 23, 42, 0.9)', borderRadius: '18px', padding: '16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', border: '2px solid rgba(99, 102, 241, 0.16)' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#9333ea'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.16)'; }}>
                       <div style={{ fontSize: '28px', marginBottom: '8px' }}>❓</div>
                       <div style={{ fontWeight: '600', color: '#f8fafc', fontSize: '14px' }}>Short Questions</div>
                     </div>
                    <div style={{ background: 'rgba(15, 23, 42, 0.9)', borderRadius: '18px', padding: '16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', border: '2px solid rgba(99, 102, 241, 0.16)' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#9333ea'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.16)'; }}>
                       <div style={{ fontSize: '28px', marginBottom: '8px' }}>📝</div>
                       <div style={{ fontWeight: '600', color: '#f8fafc', fontSize: '14px' }}>Long Questions</div>
                     </div>
                    <div style={{ background: 'rgba(15, 23, 42, 0.9)', borderRadius: '18px', padding: '16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', border: '2px solid rgba(99, 102, 241, 0.16)' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#9333ea'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.16)'; }}>
                       <div style={{ fontSize: '28px', marginBottom: '8px' }}>💻</div>
                       <div style={{ fontWeight: '600', color: '#f8fafc', fontSize: '14px' }}>Practical</div>
                     </div>
                  </div>
                </div>
              )}
            </div>
        </section>
      </div>
    );
  }

  // Fallback
  return null;
}
