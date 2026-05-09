import React, { useMemo, useState } from "react";
import { FaCheckCircle, FaCloudUploadAlt, FaCompressAlt, FaFilePdf, FaSpinner, FaTimes } from "react-icons/fa";
import { compressPdfAndDownload, uploadDocument } from "../utils/api";
import { auth } from "../firebase/firebase";

const stageDefinitions = [
  { id: "preparing", label: "Preparing upload..." },
  { id: "compressing", label: "Compressing PDF..." },
  { id: "uploading", label: "Uploading..." },
  { id: "saving_metadata", label: "Saving metadata..." },
  { id: "done", label: "Upload complete." },
];

const buildInitialForm = (initialValues = {}) => ({
  title: "",
  course: initialValues.course || "",
  semester: initialValues.semester || "",
  subject: initialValues.subject || "",
  chapterTag: initialValues.chapterTag || "",
  type: initialValues.type || "note",
  file: null,
});

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

export default function UploadModal({ onClose, initialValues = {} }) {
  const [form, setForm] = useState(() => buildInitialForm(initialValues));
  const [submitting, setSubmitting] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState("preparing");
  const [uploadStageText, setUploadStageText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [compressSuccess, setCompressSuccess] = useState("");

  const activeStageIndex = useMemo(
    () => Math.max(stageDefinitions.findIndex((stage) => stage.id === uploadStage), 0),
    [uploadStage]
  );

  function updateFormField(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleChange(event) {
    const { name, value, files } = event.target;
    updateFormField(name, files ? files[0] : value);
  }

  function handleFileSelection(file) {
    if (!file) return;
    updateFormField("file", file);
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragActive(false);
    handleFileSelection(event.dataTransfer.files?.[0]);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);
    setUploadProgress(10);
    setUploadStage("preparing");
    setUploadStageText("Preparing upload...");

    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
      await uploadDocument(form, token, ({ stage, progress, message }) => {
        setUploadStage(stage);
        setUploadProgress(progress);
        setUploadStageText(message);
      });
      setSuccess(true);
      setUploadProgress(100);
      setUploadStage("done");
      setUploadStageText("Upload complete.");
      setTimeout(onClose, 1200);
    } catch (err) {
      setError(err.message);
      setUploadProgress(0);
      setUploadStage("preparing");
      setUploadStageText("");
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
      setCompressSuccess(`Compressed and downloaded. Saved ${result.savedPercent}% (${formatBytes(result.savedBytes)}).`);
    } catch (err) {
      setError(err.message);
    } finally {
      setCompressing(false);
    }
  }

  const isPdf = form.file?.type === "application/pdf" || form.file?.name?.toLowerCase().endsWith(".pdf");

  return (
    <div className="fixed inset-0 z-[1400] flex items-center justify-center bg-slate-950/80 px-4 py-8 backdrop-blur-md">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-[32px] border border-white/10 bg-[#08111f] text-white shadow-2xl shadow-black/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(124,58,237,0.22),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.18),_transparent_28%)]" />

        <div className="relative border-b border-white/10 px-6 py-5 sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
            aria-label="Close upload modal"
          >
            <FaTimes />
          </button>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-300">Upload preview</p>
          <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">Upload notes to EduVault</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Add a title, optional chapter tag, and your PDF. The backend will verify your token, compress PDFs when helpful,
            upload to Appwrite, and save metadata to Firestore.
          </p>
        </div>

        <div className="relative grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6 sm:px-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-200">Title</span>
                <input
                  name="title"
                  placeholder="Introduction to IT - Chapter 1 Summary"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
                />
              </label>

              <label>
                <span className="mb-2 block text-sm font-medium text-slate-200">Chapter tag</span>
                <input
                  name="chapterTag"
                  placeholder="Basics of IT"
                  value={form.chapterTag}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
                />
              </label>

              <label>
                <span className="mb-2 block text-sm font-medium text-slate-200">Resource type</span>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
                >
                  <option value="note">Note</option>
                  <option value="lab">Lab Report</option>
                </select>
              </label>

              <label>
                <span className="mb-2 block text-sm font-medium text-slate-200">Course</span>
                <select
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
                >
                  <option value="">Select course</option>
                  <option value="BSc CSIT">BSc CSIT</option>
                  <option value="BCA">BCA</option>
                </select>
              </label>

              <label>
                <span className="mb-2 block text-sm font-medium text-slate-200">Semester</span>
                <select
                  name="semester"
                  value={form.semester}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
                >
                  <option value="">Select semester</option>
                  {Array.from({ length: 8 }, (_, index) => (
                    <option key={index + 1} value={String(index + 1)}>
                      Semester {index + 1}
                    </option>
                  ))}
                </select>
              </label>

              <label className="sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-200">Subject</span>
                <input
                  name="subject"
                  placeholder="Introduction to Information Technology"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
                />
              </label>
            </div>

            <div
              onDragEnter={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={(event) => {
                event.preventDefault();
                setDragActive(false);
              }}
              onDrop={handleDrop}
              className={`rounded-[28px] border border-dashed p-6 transition ${
                dragActive ? "border-violet-400 bg-violet-500/10" : "border-white/15 bg-slate-950/60"
              }`}
            >
              <label className="flex cursor-pointer flex-col items-center justify-center text-center">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-2xl text-violet-300">
                  {form.file ? <FaFilePdf /> : <FaCloudUploadAlt />}
                </div>
                <span className="text-base font-semibold text-white">
                  {form.file ? form.file.name : "Drop your PDF here or click to browse"}
                </span>
                <span className="mt-2 text-sm text-slate-400">
                  {form.file
                    ? `${formatBytes(form.file.size)} • ${isPdf ? "PDF ready for optional compression" : "File ready to upload"}`
                    : "Supports PDF uploads. Compression kicks in automatically when it helps."}
                </span>
                <input
                  name="file"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleChange}
                  required
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={submitting || compressing}
                className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? <FaSpinner className="animate-spin" /> : <FaCloudUploadAlt />}
                {submitting ? "Uploading..." : "Upload"}
              </button>

              <button
                type="button"
                onClick={handleCompressAndDownload}
                disabled={compressing || submitting || !form.file}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {compressing ? <FaSpinner className="animate-spin" /> : <FaCompressAlt />}
                {compressing ? "Compressing..." : "Compress & Download PDF"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-white/10 bg-transparent px-5 py-3 text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:text-white"
              >
                Cancel
              </button>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
            )}

            {success && (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                <FaCheckCircle />
                Uploaded successfully.
              </div>
            )}

            {compressSuccess && (
              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
                {compressSuccess}
              </div>
            )}
          </form>

          <div className="border-t border-white/10 bg-slate-950/40 px-6 py-6 lg:border-l lg:border-t-0">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Upload stages</p>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>{uploadStageText || "Waiting for upload..."}</span>
                <span>{uploadProgress}%</span>
              </div>

              <div className="mt-6 space-y-3">
                {stageDefinitions.map((stage, index) => {
                  const isComplete = success || activeStageIndex > index;
                  const isActive = uploadStage === stage.id && !success;
                  return (
                    <div
                      key={stage.id}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                        isComplete
                          ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                          : isActive
                            ? "border-violet-400/30 bg-violet-500/10 text-violet-100"
                            : "border-white/10 bg-white/5 text-slate-400"
                      }`}
                    >
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-xs font-semibold">
                        {isComplete ? <FaCheckCircle /> : index + 1}
                      </span>
                      <span className="text-sm font-medium">{stage.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 rounded-[28px] border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
              <p className="font-semibold text-white">Preview metadata</p>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-400">Subject</span>
                  <span className="text-right text-white">{form.subject || "Not set"}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-400">Semester</span>
                  <span className="text-right text-white">{form.semester || "Not set"}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-400">Chapter tag</span>
                  <span className="text-right text-white">{form.chapterTag || "Optional"}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-400">File size</span>
                  <span className="text-right text-white">{formatBytes(form.file?.size)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
