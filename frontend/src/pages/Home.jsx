import { useState, useEffect } from 'react';
import getApiClient from '../utils/api';
import NotesFeed from '../components/NotesFeed';

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

  return (
    <div style={{ minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
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

        <div style={{ marginTop: 24 }}>
          <h2>Notes / Lab Reports</h2>
          <NotesFeed />
        </div>
      </div>
    </div>
  );
}

export default Home;