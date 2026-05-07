import React, { useState } from "react";
import { compressPdfAndDownload, uploadDocument } from "../utils/api";
import { auth } from "../firebase/firebase";

export default function UploadModal({ onClose }) {
  const [form, setForm] = useState({
    title: "",
    course: "",
    semester: "",
    subject: "",
    type: "",
    file: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStageText, setUploadStageText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [compressSuccess, setCompressSuccess] = useState("");

  function handleChange(e) {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setUploadProgress(10);
    setUploadStageText("Preparing upload...");
    setError("");
    setSuccess(false);
    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
      const isPdf = form.file?.type === "application/pdf" || form.file?.name?.toLowerCase().endsWith(".pdf");
      if (isPdf) {
        setUploadProgress(40);
        setUploadStageText("Compressing PDF...");
      }
      await uploadDocument(form, token, ({ progress, message }) => {
        setUploadProgress(progress);
        setUploadStageText(message);
      });
      setSuccess(true);
      setUploadProgress(100);
      setUploadStageText("Upload completed.");
      setTimeout(onClose, 1200);
    } catch (err) {
      setError(err.message);
      setUploadStageText("");
      setUploadProgress(0);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCompressAndDownload() {
    setError("");
    setCompressSuccess("");

    if (!form.file) {
      setError("Please choose a PDF file before compressing.");
      return;
    }

    setCompressing(true);
    try {
      const result = await compressPdfAndDownload(form.file, "screen");
      setCompressSuccess(
        `Compressed and downloaded. Saved ${result.savedPercent}% (${result.savedBytes} bytes).`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setCompressing(false);
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Upload Note / Lab Report</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <select
            name="course"
            value={form.course}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">Select course</option>
            <option value="BSc CSIT">BSc CSIT</option>
            <option value="BCA">BCA</option>
          </select>

          <select
            name="semester"
            value={form.semester}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">Select semester</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">Select resource type</option>
            <option value="note">Note</option>
            <option value="lab">Lab Report</option>
          </select>
          <input
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            name="file"
            type="file"
            accept="application/pdf"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <div style={{ marginTop: 12 }}>
            <button type="submit" disabled={submitting || compressing}>
              {submitting ? "Uploading..." : "Upload"}
            </button>
            <button
              type="button"
              onClick={handleCompressAndDownload}
              disabled={compressing || submitting}
              style={{ marginLeft: 8 }}
            >
              {compressing ? "Compressing..." : "Compress & Download PDF"}
            </button>
            <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>
              Cancel
            </button>
          </div>
          {submitting && (
            <div style={styles.progressWrapper}>
              <div style={styles.progressTrack}>
                <div style={{ ...styles.progressFill, width: `${uploadProgress}%` }} />
              </div>
              <div style={styles.progressText}>{uploadStageText}</div>
            </div>
          )}
          {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
          {success && <div style={{ color: "green", marginTop: 8 }}>Uploaded!</div>}
          {compressSuccess && <div style={{ color: "green", marginTop: 8 }}>{compressSuccess}</div>}
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    borderRadius: 8,
    padding: 32,
    minWidth: 320,
    boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
  },
  input: {
    display: "block",
    width: "100%",
    margin: "8px 0",
    padding: 8,
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  progressWrapper: {
    marginTop: 12,
  },
  progressTrack: {
    width: "100%",
    height: 8,
    borderRadius: 999,
    background: "#e5e7eb",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "#2563eb",
    transition: "width 0.3s ease",
  },
  progressText: {
    marginTop: 6,
    fontSize: 12,
    color: "#374151",
  },
};
