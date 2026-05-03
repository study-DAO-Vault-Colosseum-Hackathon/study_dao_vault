import { useNavigate } from 'react-router-dom';

export default function SubjectHub() {
  const navigate = useNavigate();

  return (
    <main className="notes-premium-page">
      <div className="auth-stage" style={{ width: '100%', maxWidth: '960px' }}>
        <section
          style={{
            width: '100%',
            padding: '40px',
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            backdropFilter: 'blur(16px)',
            color: '#fff',
            textAlign: 'center',
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.35)',
          }}
        >
          <p style={{ letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.72, marginBottom: '12px' }}>
            Study Hub
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', margin: '0 0 16px' }}>Choose a subject to continue</h1>
          <p style={{ maxWidth: '640px', margin: '0 auto 28px', lineHeight: 1.7, opacity: 0.85 }}>
            The subject workspace is available. This screen keeps the app functional while the detailed subject views load.
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              padding: '12px 22px',
              borderRadius: '999px',
              border: 'none',
              background: '#fbbf24',
              color: '#111827',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Back to Home
          </button>
        </section>
      </div>
    </main>
  );
}