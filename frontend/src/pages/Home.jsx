import { useState, useEffect } from 'react';
import getApiClient from '../utils/api';
import { FaStickyNote, FaStar, FaDownload, FaImage, FaMedal, FaLightbulb, FaCheckCircle, FaFire, FaQrcode } from 'react-icons/fa';
import './Home.css';

function Home({ user, onSignOut }) {
  const [vaultData, setVaultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVaultData = async () => {
      try {
        const apiClient = await getApiClient();
        const data = await apiClient.get('/vault-status');
        setVaultData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (user) {
      fetchVaultData();
    }
  }, [user]);

  // Mock leaderboard data
  const leaderboardData = [
    { rank: 1, initials: 'AJ', name: 'Swastik Rawat', score: 2450 },
    { rank: 2, initials: 'SM', name: 'Anup Bhattarai', score: 2180 },
    { rank: 3, initials: 'DK', name: 'Rajan Pantha', score: 1920 },
    { rank: 4, initials: 'ER', name: 'Bijesh', score: 1750 },
    { rank: 5, initials: 'MC', name: 'Bibek MAgar', score: 1620 }
  ];

  // Mock NFTs & Badges data
  const nftsAndBadges = [
    { id: 1, icon: FaImage, title:'NET Level 1'},
    { id: 2, icon: FaMedal, title: 'Excellence Badge',},
    { id: 3, icon: FaStar, title: 'Featured Work',},
    { id: 4, icon: FaDownload, title: 'Download Badge',}
  ];

  // Action buttons data
  const actionButtons = [
    { label: 'Notes', icon: FaStickyNote },
    { label: 'Starred', icon: FaStar },
    { label: 'Download', icon: FaDownload },
    { label: 'NFTs', icon: FaImage },
    { label: 'Badges', icon: FaMedal }
  ];

  // Registration & Actions data
  const registrationCards = [
    {
      id: 1,
      icon: FaLightbulb,
      color: 'pink',
      heading: 'Join Student Community',
      description: 'Unlock exclusive study guides, join peer-to-peer discussion groups, and access past year question papers..'
    },
    {
      id: 2,
      icon: FaCheckCircle,
      color: 'green',
      heading: 'Complete Academic Profile',
      description: 'Add your current courses, grade level, and learning interests to get personalized study recommendations'
    },
    {
      id: 3,
      icon: FaFire,
      color: 'yellow',
      heading: 'Start Learning',
      description: 'Begin your first lesson, take a practice quiz, or watch video lectures to earn your first academic badge.'
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          {/* Left Side */}
          <div className="hero-left">
            <div className="badge">
              ✦ PLATFORM LAUNCH 2026
            </div>
            <h1 className="hero-heading">
              Your Creative Hub for Animations & PSA
            </h1>
            <p className="hero-subtext">
              Explore innovative animations, learn from creators, and share your creative projects with a vibrant community.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary">Get Started</button>
              <button className="btn-secondary">Browse Programs</button>
            </div>
          </div>

          {/* Right Side - Leaderboard Card */}
          <div className="hero-right">
            <div className="leaderboard-card">
              <h3 className="leaderboard-title">Leaderboard</h3>
              <div className="leaderboard-list">
                {leaderboardData.map((entry) => (
                  <div key={entry.rank} className="leaderboard-item">
                    <span className="rank-number">{entry.rank}</span>
                    <div className="initials-circle">{entry.initials}</div>
                    <div className="user-info">
                      <p className="user-name">{entry.name}</p>
                    </div>
                    <span className="user-score">{entry.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Action Buttons Row */}
      <section className="action-buttons-section">
        <div className="action-buttons-container">
          {actionButtons.map((btn) => {
            const IconComponent = btn.icon;
            return (
              <button key={btn.label} className="action-button">
                <IconComponent className="button-icon" />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* NFTs & Badges Section */}
      <section className="nfts-badges-section">
        <div className="nfts-badges-container">
          <h2 className="section-title">NFTs & Badges</h2>
          <div className="nfts-grid">
            {nftsAndBadges.map((item) => {
              const IconComponent = item.icon;
              return (
                <div key={item.id} className="nft-card">
                  <div className="nft-icon-wrapper">
                    <IconComponent className="nft-icon" />
                  </div>
                  <div className="nft-content">
                    <h3 className="nft-title">{item.title}</h3>
                    <p className="nft-subtitle">{item.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Registration & Actions Section */}
      <section className="registration-section">
        <div className="registration-container">
          <h2 className="section-title">Registration & Actions</h2>
          
          {/* Registration Cards */}
          <div className="registration-cards">
            {registrationCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <div key={card.id} className="registration-card">
                  <div className={`reg-icon-box reg-icon-${card.color}`}>
                    <IconComponent className="reg-icon" />
                  </div>
                  <h3 className="reg-heading">{card.heading}</h3>
                  <p className="reg-description">{card.description}</p>
                  <a href="#" className="reg-link">Register now →</a>
                </div>
              );
            })}
          </div>

          {/* QR Code Card */}
          <div className="qr-card">
            <div className="qr-content">
              <FaQrcode className="qr-large-icon" />
              <div className="qr-text">
                <h3 className="qr-title">Quick Access QR Code</h3>
                <p className="qr-subtext">Scan to share your profile and creative work instantly</p>
              </div>
            </div>
            <button className="qr-button">Generate QR</button>
          </div>
        </div>
      </section>

      {/* Original Content Below */}
      <div style={{ maxWidth: '600px', margin: '40px auto' }}>
        <h1>Welcome, {user?.email}!</h1>

        {loading && <p>Loading vault data...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {vaultData && (
          <div style={{
            border: '1px solid #ccc',
            padding: '20px',
            borderRadius: '8px',
            marginTop: '20px'
          }}>
            <h2>Vault Status</h2>
            <pre>{JSON.stringify(vaultData, null, 2)}</pre>
          </div>
        )}

        <button 
          type="button" 
          onClick={onSignOut}
          style={{
            marginTop: '20px',
            padding: '12px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Home;