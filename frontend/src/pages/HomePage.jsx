import React, { useState } from "react";

import UploadModal from "./UploadModal";
import { fetchFeed } from "../utils/api";
import { useEffect } from "react";

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [feedType, setFeedType] = useState("All");
  const [search, setSearch] = useState("");
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadFeed() {
    setLoading(true);
    setError("");
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

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search notes/lab reports..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: "60%", margin: "16px", padding: "8px" }}
      />

      {/* Feed Type Selector */}
      <select value={feedType} onChange={e => setFeedType(e.target.value)}>
        <option>All</option>
        <option>Notes</option>
        <option>Lab Reports</option>
      </select>

      {/* Upload Button */}
      <button onClick={() => setShowModal(true)} style={{ marginLeft: 16 }}>
        Upload
      </button>

      {/* Feed List */}
      <div style={{ margin: "24px 0" }}>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : feed.length === 0 ? (
          <div>No documents found.</div>
        ) : (
          feed.map(doc => (
            <div key={doc.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 600 }}>{doc.title}</div>
              <div style={{ color: "#555" }}>{doc.course} | Sem {doc.semester} | {doc.subject}</div>
              <div style={{ marginTop: 8 }}>
                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">View PDF</a>
              </div>
              <div style={{ marginTop: 8, fontSize: 13, color: "#888" }}>
                Upvotes: {doc.upvotes || 0} | Downvotes: {doc.downvotes || 0}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {showModal && <UploadModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
