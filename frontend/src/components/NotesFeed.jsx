import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaBookOpen,
  FaCloudUploadAlt,
  FaDownload,
  FaEye,
  FaFileAlt,
  FaFilePdf,
  FaSearch,
  FaTag,
  FaTrash,
  FaUserCircle,
  FaFire,
  FaStar,
} from "react-icons/fa";
import { Sparkles, TrendingUp } from "lucide-react";
import UploadModal from "./UploadModal";
import Toast from "./Toast";
import ConfirmDialog from "./ConfirmDialog";
import { fetchFeed, upvoteDocument, downvoteDocument, deleteDocument } from "../utils/api";
import { auth } from "../firebase/firebase";
import "./NotesFeed.css";

const typeOptions = ["All", "Notes", "Lab Reports"];
const sortOptions = [
  { id: "latest", label: "Latest", icon: FaArrowDown },
  { id: "voted", label: "Most Voted", icon: FaFire },
  { id: "downloaded", label: "Most Downloaded", icon: FaDownload },
];

// Debounce utility
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const formatBytes = (bytes) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

const formatUploader = (owner = {}) => {
  if (owner.email) {
    return owner.email.split("@")[0];
  }

  if (owner.uid) {
    return `User ${owner.uid.slice(0, 6)}`;
  }

  return "Unknown uploader";
};

const getTypeLabel = (type) => {
  if (type === "lab") return "Lab Report";
  return "Note";
};

export default function NotesFeed({
  defaultFeedType = "All",
  initialSearch = "",
  subject = "",
  course = "",
  semester = "",
  heading = "Community Documents",
  description = "Browse uploaded notes and lab reports.",
  hideFeedTypeFilter = false,
  defaultChapterTag = "",
}) {
  const [showModal, setShowModal] = useState(false);
  const [feedType, setFeedType] = useState(defaultFeedType);
  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState("latest");
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  // Debounce search input
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    setFeedType(defaultFeedType);
  }, [defaultFeedType]);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  async function loadFeed() {
    setLoading(true);
    setError("");
    try {
      const docs = await fetchFeed({ search: debouncedSearch, feedType, subject, course, semester });
      
      // Sort documents
      const sorted = sortDocuments(docs, sortBy);
      setFeed(sorted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const sortDocuments = useCallback((docs, sortType) => {
    const docsCopy = [...docs];
    switch (sortType) {
      case "voted":
        return docsCopy.sort((a, b) => {
          const aVotes = (a.upvotes || 0) - (a.downvotes || 0);
          const bVotes = (b.upvotes || 0) - (b.downvotes || 0);
          return bVotes - aVotes;
        });
      case "downloaded":
        return docsCopy.sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0));
      case "latest":
      default:
        return docsCopy.sort((a, b) => new Date(b.uploadedAt || 0) - new Date(a.uploadedAt || 0));
    }
  }, []);

  useEffect(() => {
    loadFeed();
    // eslint-disable-next-line
  }, [debouncedSearch, feedType, sortBy, showModal, subject, course, semester]);

  async function handleVote(docId, type) {
    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
      if (!token) throw new Error("Not authenticated");

      const result = type === "upvote"
        ? await upvoteDocument(docId, token)
        : await downvoteDocument(docId, token);

      setFeed((previous) => previous.map((doc) => {
        if (doc.id !== docId) return doc;
        return {
          ...doc,
          upvotes: result.upvotes !== undefined ? result.upvotes : doc.upvotes,
          downvotes: result.downvotes !== undefined ? result.downvotes : doc.downvotes,
        };
      }));
      
      const voteType = type === 'upvote' ? 'Upvoted' : 'Downvoted';
      setToast({ type: 'success', message: `${voteType} successfully!` });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to vote' });
    }
  }

  async function handleDelete(docId) {
    setConfirmDialog({
      title: 'Delete Document',
      message: 'Are you sure you want to delete this document? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDangerous: true,
      onConfirm: async () => {
        try {
          const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
          if (!token) throw new Error("Not authenticated");

          await deleteDocument(docId, token);
          setFeed((previous) => previous.filter((doc) => doc.id !== docId));
          setConfirmDialog(null);
          setToast({ type: 'success', message: 'Document deleted successfully!' });
        } catch (err) {
          setToast({ type: 'error', message: err.message || 'Failed to delete' });
          setConfirmDialog(null);
        }
      },
      onCancel: () => setConfirmDialog(null),
    });
  }

  const uploadInitialValues = useMemo(() => ({
    course,
    semester: semester ? String(semester) : "",
    subject,
    chapterTag: defaultChapterTag || initialSearch || "",
    type: defaultFeedType === "Lab Reports" ? "lab" : "note",
  }), [course, semester, subject, defaultChapterTag, initialSearch, defaultFeedType]);

  // Skeleton Loader Component
  const SkeletonCard = () => (
    <div className="notes-feed__skeleton-card">
      <div className="skeleton skeleton-thumb" />
      <div className="skeleton-content">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-text" style={{ width: "80%" }} />
        <div className="skeleton skeleton-text" style={{ width: "60%" }} />
      </div>
    </div>
  );

  // Empty State Component
  const EmptyState = () => (
    <div className="notes-feed__empty-state">
      <div className="empty-state-icon">
        <FaBookOpen />
      </div>
      <h3>Be the First to Contribute!</h3>
      <p>No documents yet. Share your notes or lab reports to help the community learn.</p>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="empty-state-cta"
      >
        <FaCloudUploadAlt />
        Upload Your First Document
      </button>
    </div>
  );

  return (
    <div className="notes-feed-container">
      {/* Header Section */}
      <div className="notes-feed__header">
        <div className="header-content">
          <span className="header-label">Live Backend Feed</span>
          <h2 className="header-title">{heading}</h2>
          <p className="header-description">{description}</p>
        </div>
      </div>

      {/* Search & Controls Section */}
      <div className="notes-feed__controls">
        <div className="controls-row">
          {/* Search Input with Live Indicator */}
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by title, subject, chapter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            {search && <div className="search-indicator" />}
          </div>

          {/* Upload Button with Pulse Animation */}
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="upload-button pulse-animation"
          >
            <FaCloudUploadAlt />
            <span>Upload</span>
          </button>
        </div>

        {/* Filters Row */}
        <div className="filters-row">
          {/* Feed Type Filter */}
          {!hideFeedTypeFilter && (
            <div className="filter-group">
              <span className="filter-label">Type:</span>
              <div className="filter-buttons">
                {typeOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFeedType(option)}
                    className={`filter-btn ${feedType === option ? "active" : ""}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sort Filter */}
          <div className="filter-group">
            <span className="filter-label">Sort:</span>
            <div className="filter-buttons">
              {sortOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSortBy(option.id)}
                    className={`filter-btn ${sortBy === option.id ? "active" : ""}`}
                    title={option.label}
                  >
                    <Icon size={16} />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="notes-feed__content">
        {error && (
          <div className="error-banner">
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="documents-grid">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : feed.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="results-info">
              <p>{feed.length} document{feed.length !== 1 ? "s" : ""} found</p>
            </div>
            <div className="documents-grid">
              {feed.map((doc) => {
                const sizeLabel = formatBytes(doc.uploadedBytes || doc.originalBytes || 0);
                const chapterTag = doc.chapterTag || defaultChapterTag || "General";
                const uploader = formatUploader(doc.owner);
                const isOwner = auth.currentUser?.uid && doc.owner?.uid === auth.currentUser.uid;
                const voteScore = (doc.upvotes || 0) - (doc.downvotes || 0);
                const uploadDate = doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "Recently";

                return (
                  <article key={doc.id} className="document-card">
                    {/* Card Header with Thumbnail */}
                    <div className="card-header">
                      <div className="card-thumbnail">
                        <div className="thumbnail-icon">
                          {doc.mimeType === "application/pdf" ? (
                            <FaFilePdf />
                          ) : (
                            <FaFileAlt />
                          )}
                        </div>
                        {doc.wasCompressed && (
                          <div className="compressed-badge">
                            <Sparkles size={12} />
                          </div>
                        )}
                      </div>

                      <div className="card-meta-top">
                        <span className="badge-type">{getTypeLabel(doc.type)}</span>
                        {voteScore > 5 && (
                          <span className="badge-trending">
                            <FaFire size={12} />
                            Trending
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="card-body">
                      <h3 className="card-title">{doc.title || doc.fileName}</h3>
                      <p className="card-filename">{doc.fileName}</p>

                      {/* Tags */}
                      <div className="card-tags">
                        <span className="tag tag-chapter">
                          <FaTag size={12} />
                          {chapterTag}
                        </span>
                        <span className="tag tag-size">{sizeLabel}</span>
                      </div>

                      {/* Metadata */}
                      <div className="card-metadata">
                        <span className="metadata-item">
                          <FaUserCircle />
                          {uploader}
                        </span>
                        <span className="metadata-item separator">•</span>
                        <span className="metadata-item">{uploadDate}</span>
                      </div>
                    </div>

                    {/* Card Stats */}
                    <div className="card-stats">
                      <div className="stat">
                        <FaDownload size={14} />
                        <span>{doc.downloadCount || 0}</span>
                      </div>
                      <div className="stat">
                        <FaEye size={14} />
                        <span>{doc.viewCount || 0}</span>
                      </div>
                      <div className={`stat ${voteScore > 0 ? "positive" : voteScore < 0 ? "negative" : ""}`}>
                        <FaStar size={14} />
                        <span>{voteScore}</span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="card-actions">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn action-view"
                      >
                        <FaEye />
                        View
                      </a>

                      <a
                        href={doc.downloadUrl || doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn action-download"
                      >
                        <FaDownload />
                        Download
                      </a>

                      <button
                        type="button"
                        onClick={() => handleVote(doc.id, "upvote")}
                        className="action-btn action-vote upvote"
                        title="Upvote this document"
                      >
                        <FaArrowUp />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleVote(doc.id, "downvote")}
                        className="action-btn action-vote downvote"
                        title="Downvote this document"
                      >
                        <FaArrowDown />
                      </button>

                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => handleDelete(doc.id)}
                          className="action-btn action-delete"
                          title="Delete this document"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>

      {showModal && (
        <UploadModal
          onClose={() => setShowModal(false)}
          initialValues={uploadInitialValues}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={confirmDialog.confirmText}
          cancelText={confirmDialog.cancelText}
          isDangerous={confirmDialog.isDangerous}
          onConfirm={confirmDialog.onConfirm}
          onCancel={confirmDialog.onCancel}
        />
      )}
    </div>
  );
}
