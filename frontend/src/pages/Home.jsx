function Home({ onSignOut }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button type="button" onClick={onSignOut} style={{ padding: '12px 20px', fontSize: '16px', cursor: 'pointer' }}>
        Logout
      </button>
    </div>
  );
}

export default Home;
