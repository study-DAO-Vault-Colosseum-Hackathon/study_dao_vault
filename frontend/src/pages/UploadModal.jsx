
import React, { useState } from "react";
import { compressPdfAndDownload, uploadDocument } from "../utils/api";
import { auth } from "../firebase/firebase";

export default function UploadModal({ onClose }) {
  const [form, setForm] = useState({
    title: "",
    course: "",
    semester: "",
    subject: "",
    file: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [compressing, setCompressing] = useState(false);
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
    setError("");
    setSuccess(false);
    try {
      // obtain ID token from Firebase client and pass it to backend
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
      await uploadDocument(form, token);
      setSuccess(true);
      setTimeout(onClose, 1200);
    } catch (err) {
      setError(err.message);
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
      await compressPdfAndDownload(form.file);
      setCompressSuccess("Compressed PDF downloaded to your browser's Downloads folder.");
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
          <input
            name="course"
            placeholder="Course"
            value={form.course}
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
            <button type="submit" disabled={submitting}>
              {submitting ? "Uploading..." : "Upload"}
            </button>
            <button
              type="button"
              onClick={handleCompressAndDownload}
              disabled={compressing}
              style={{ marginLeft: 8 }}
            >
              {compressing ? "Compressing..." : "Compress & Download PDF"}
            </button>
            <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>
              Cancel
            </button>
          </div>
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
};
