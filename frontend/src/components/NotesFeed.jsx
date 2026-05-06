import React, { useState, useEffect } from 'react';
import UploadModal from './UploadModal';
import { fetchFeed, upvoteDocument, downvoteDocument } from '../utils/api';
import { auth } from '../firebase/firebase';

export default function NotesFeed() {
  const [showModal, setShowModal] = useState(false);
  const [feedType, setFeedType] = useState('All');
  const [search, setSearch] = useState('');
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadFeed() {
    setLoading(true);
    setError('');
    try {
      const docs = await fetchFeed({ search, feedType });
      setFeed(docs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFeed();
    // eslint-disable-next-line
  }, [search, feedType, showModal]);

  async function handleVote(docId, type) {
    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
      if (!token) throw new Error('Not authenticated');
      if (type === 'upvote') {
        await upvoteDocument(docId, token);
      } else {
        await downvoteDocument(docId, token);
      }
      loadFeed();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          type="text"
          placeholder="Search notes/lab reports..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />

        <select value={feedType} onChange={e => setFeedType(e.target.value)}>
          <option>All</option>
          <option>Notes</option>
          <option>Lab Reports</option>
        </select>

        <button onClick={() => setShowModal(true)}>Upload</button>
      </div>

      <div style={{ margin: '24px 0' }}>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : feed.length === 0 ? (
          <div>No documents found.</div>
        ) : (
          feed.map(doc => (
            <div key={doc.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 600 }}>{doc.title}</div>
              <div style={{ color: '#555' }}>{doc.course} | Sem {doc.semester} | {doc.subject}</div>
              <div style={{ marginTop: 8 }}>
                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">View PDF</a>
              </div>
              <div style={{ marginTop: 8, fontSize: 13, color: '#888', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span>Upvotes: {doc.upvotes || 0}</span>
                <button onClick={() => handleVote(doc.id, 'upvote')}>Upvote</button>
                <span>Downvotes: {doc.downvotes || 0}</span>
                <button onClick={() => handleVote(doc.id, 'downvote')}>Downvote</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && <UploadModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
