import React, { useEffect, useMemo, useState } from "react";
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
} from "react-icons/fa";
import { Sparkles } from "lucide-react";
import UploadModal from "./UploadModal";
import Toast from "./Toast";
import ConfirmDialog from "./ConfirmDialog";
import { fetchFeed, upvoteDocument, downvoteDocument, deleteDocument } from "../utils/api";
import { auth } from "../firebase/firebase";

const typeOptions = ["All", "Notes", "Lab Reports"];

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
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

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
      const docs = await fetchFeed({ search, feedType, subject, course, semester });
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
  }, [search, feedType, showModal, subject, course, semester]);

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

  return (
    <div className="relative mx-auto w-full max-w-6xl rounded-[32px] border border-white/10 bg-[#06101e]/95 p-6 text-white shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
      <div className="absolute inset-0 -z-10 rounded-[32px] bg-[radial-gradient(circle_at_top_right,_rgba(139,92,246,0.18),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.12),_transparent_26%)]" />

      <div className="flex flex-col gap-8">
        <div className="rounded-[28px] border border-white/10 bg-slate-950/40 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-violet-300">Live backend feed</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">{heading}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">{description}</p>

          <div className="mt-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1729] px-4 py-3">
              <FaSearch className="text-slate-500" />
              <input
                type="text"
                placeholder="Search uploaded documents..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {!hideFeedTypeFilter && (
                <div className="flex rounded-2xl border border-white/10 bg-[#0b1729] p-1">
                  {typeOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFeedType(option)}
                      className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                        feedType === option
                          ? "bg-violet-600 text-white shadow-lg shadow-violet-900/30"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:bg-violet-500"
              >
                <FaCloudUploadAlt />
                Upload
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[28px] border border-white/10 bg-slate-950/40 p-16 text-center text-slate-300">
            Loading notes feed...
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-200">{error}</div>
        ) : feed.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-white/15 bg-slate-950/40 px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
              <FaBookOpen className="text-2xl" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold text-white">No documents found.</h3>
            <p className="mt-3 text-sm text-slate-400">
              Upload the first note for this subject to seed the live Firestore-backed feed.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {feed.map((doc) => {
              const sizeLabel = formatBytes(doc.uploadedBytes || doc.originalBytes || 0);
              const chapterTag = doc.chapterTag || defaultChapterTag || "General";
              const uploader = formatUploader(doc.owner);
              const isOwner = auth.currentUser?.uid && doc.owner?.uid === auth.currentUser.uid;

              return (
                <article
                  key={doc.id}
                  className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/55 p-6 transition hover:border-violet-400/30 hover:bg-slate-950/75"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(139,92,246,0.14),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.12),_transparent_26%)] opacity-0 transition group-hover:opacity-100" />

                  <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-200">
                          {doc.mimeType === "application/pdf" ? <FaFilePdf className="text-xl" /> : <FaFileAlt className="text-xl" />}
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-semibold text-white sm:text-xl">{doc.title || doc.fileName}</h3>
                          <p className="mt-1 text-sm text-slate-400">{doc.fileName || "Uploaded document"}</p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-200">
                          <FaTag />
                          {chapterTag}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                          {getTypeLabel(doc.type)}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                          {sizeLabel}
                        </span>
                        {doc.wasCompressed ? (
                          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                            <Sparkles size={14} />
                            Compressed {doc.savedPercent ? `${doc.savedPercent}%` : ""}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                        <span className="inline-flex items-center gap-2">
                          <FaUserCircle className="text-slate-500" />
                          {uploader}
                        </span>
                        <span>{doc.course || course || "BSc CSIT"}</span>
                        <span>Semester {doc.semester || semester || "1"}</span>
                        <span>{doc.subject || subject}</span>
                      </div>
                    </div>

                    <div className="relative flex flex-col gap-3 lg:w-[220px]">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                      >
                        <FaEye />
                        View PDF
                      </a>

                      <a
                        href={doc.downloadUrl || doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
                      >
                        <FaDownload />
                        Download
                      </a>

                      {isOwner ? (
                        <button
                          type="button"
                          onClick={() => handleDelete(doc.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100 transition hover:bg-red-500/20"
                        >
                          <FaTrash />
                          Delete
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <div className="relative mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
                    <button
                      type="button"
                      onClick={() => handleVote(doc.id, "upvote")}
                      className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
                    >
                      <FaArrowUp />
                      {doc.upvotes || 0}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleVote(doc.id, "downvote")}
                      className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-500/20"
                    >
                      <FaArrowDown />
                      {doc.downvotes || 0}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <UploadModal
          onClose={() => setShowModal(false)}
          initialValues={uploadInitialValues}
        />
      )}

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirmation Dialog */}
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
