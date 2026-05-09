// Upvote a document
export async function upvoteDocument(docId, token) {
    const res = await fetch(`${BASE_URL}/documents/${docId}/upvote`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Upvote failed (${res.status})`);
    }
    return await res.json();
}

// Downvote a document
export async function downvoteDocument(docId, token) {
    const res = await fetch(`${BASE_URL}/documents/${docId}/downvote`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Downvote failed (${res.status})`);
    }
    return await res.json();
}
const BASE_URL = import.meta.env.PROD
    ? `${import.meta.env.VITE_API_URL}/api`
    : "http://localhost:3000/api";

// Utility for API calls (fetch wrapper, can add auth token logic here)
export async function uploadDocument(form, token) {
    const data = new FormData();
    data.append("title", form.title);
    data.append("course", form.course);
    data.append("semester", form.semester);
    data.append("subject", form.subject);
    data.append("file", form.file);

    const res = await fetch(`${BASE_URL}/documents/upload`, {
        method: "POST",
        body: data,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Upload failed (${res.status})`);
    }
    return await res.json();
}

export async function compressPdfAndDownload(file, quality = "screen") {
    if (!file) {
        throw new Error("Please select a PDF file first.");
    }

    const data = new FormData();
    data.append("pdf", file);
    data.append("quality", quality);

    const res = await fetch(`${BASE_URL}/compress-pdf`, {
        method: "POST",
        body: data,
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Compression failed (${res.status})`);
    }

    const blob = await res.blob();
    const contentDisposition = res.headers.get("content-disposition") || "";
    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
    const defaultName = `${file.name.replace(/\.pdf$/i, "")}.compressed.pdf`;
    const downloadName = filenameMatch?.[1] || defaultName;

    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);

    const originalBytes = Number(res.headers.get("x-original-bytes")) || file.size;
    const compressedBytes = Number(res.headers.get("x-compressed-bytes")) || blob.size;
    const savedBytes = Math.max(0, originalBytes - compressedBytes);
    const savedPercent = originalBytes > 0 ? Number(((savedBytes / originalBytes) * 100).toFixed(2)) : 0;

    return {
        success: true,
        filename: downloadName,
        originalBytes,
        compressedBytes,
        savedBytes,
        savedPercent,
    };
}

export async function fetchFeed({ search = "", feedType = "All" } = {}) {
    // TODO: Implement backend endpoint for filtering if needed
    const res = await fetch(`${BASE_URL}/documents`);
    if (!res.ok) throw new Error("Failed to fetch feed");
    const payload = await res.json();
    const docs = Array.isArray(payload) ? payload : (payload.documents || []);
    // Filter client-side for now
    return docs.filter(doc => {
        const matchesType =
            feedType === "All" ||
            (feedType === "Notes" && doc.type === "note") ||
            (feedType === "Lab Reports" && doc.type === "lab");
        const matchesSearch =
            !search ||
            doc.title.toLowerCase().includes(search.toLowerCase()) ||
            doc.subject.toLowerCase().includes(search.toLowerCase());
        return matchesType && matchesSearch;
    });
}
import { getAuth } from "firebase/auth";

const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");

const resolveBaseUrl = () => {
    if (import.meta.env.DEV) {
        return "/api";
    }

    const configuredUrl = trimTrailingSlash(import.meta.env.VITE_API_URL || "");
    if (!configuredUrl) {
        return "/api";
    }

    return configuredUrl.endsWith("/api")
        ? configuredUrl
        : `${configuredUrl}/api`;
};

const BASE_URL = resolveBaseUrl();

const parseError = async (response, fallbackMessage) => {
    const text = await response.text();
    try {
        const json = JSON.parse(text);
        return json.error || json.message || fallbackMessage;
    } catch {
        return text || fallbackMessage;
    }
};

export async function fetchFeed({
    search = "",
    feedType = "All",
    course = "",
    semester = "",
    subject = "",
} = {}) {
    const res = await fetch(`${BASE_URL}/documents`);
    if (!res.ok) {
        const message = await parseError(res, `Failed to fetch feed (${res.status})`);
        throw new Error(message);
    }

    const payload = await res.json();
    const docs = Array.isArray(payload) ? payload : (payload.documents || []);
    const normalizedSearch = search.toLowerCase();
    const normalizedCourse = course.toLowerCase();
    const normalizedSemester = String(semester).toLowerCase();
    const normalizedSubject = subject.toLowerCase();

    return docs.filter((doc) => {
        const type = (doc.type || "").toLowerCase();
        const title = (doc.title || "").toLowerCase();
        const documentSubject = (doc.subject || "").toLowerCase();
        const documentCourse = (doc.course || "").toLowerCase();
        const documentSemester = String(doc.semester || "").toLowerCase();
        const documentChapterTag = (doc.chapterTag || "").toLowerCase();

        const matchesType =
            feedType === "All" ||
            (feedType === "Notes" && type === "note") ||
            (feedType === "Lab Reports" && type === "lab");

        const matchesSearch =
            !normalizedSearch ||
            title.includes(normalizedSearch) ||
            documentSubject.includes(normalizedSearch) ||
            documentChapterTag.includes(normalizedSearch);

        const matchesCourse =
            !normalizedCourse || documentCourse === normalizedCourse;

        const matchesSemester =
            !normalizedSemester || documentSemester === normalizedSemester;

        const matchesSubject =
            !normalizedSubject || documentSubject === normalizedSubject;

        return matchesType && matchesSearch && matchesCourse && matchesSemester && matchesSubject;
    });
}

export async function uploadDocument(form, token, onStageChange) {
    if (onStageChange) {
        onStageChange({ stage: "preparing", progress: 10, message: "Preparing upload..." });
    }

    const data = new FormData();
    data.append("title", form.title);
    data.append("course", form.course);
    data.append("semester", form.semester);
    data.append("subject", form.subject);
    data.append("chapterTag", form.chapterTag || "");
    data.append("type", form.type);
    data.append("file", form.file);

    const isPdf = form.file?.type === "application/pdf" || form.file?.name?.toLowerCase().endsWith(".pdf");
    if (isPdf && onStageChange) {
        onStageChange({ stage: "compressing", progress: 35, message: "Compressing PDF..." });
    }

    if (onStageChange) {
        onStageChange({ stage: "uploading", progress: 68, message: "Uploading..." });
    }

    const res = await fetch(`${BASE_URL}/documents/upload`, {
        method: "POST",
        body: data,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    if (!res.ok) {
        const message = await parseError(res, `Upload failed (${res.status})`);
        throw new Error(message);
    }

    if (onStageChange) {
        onStageChange({ stage: "saving_metadata", progress: 92, message: "Saving metadata..." });
    }

    const payload = await res.json();

    if (onStageChange) {
        onStageChange({ stage: "done", progress: 100, message: "Upload complete." });
    }

    return payload;
}

export async function compressPdfAndDownload(file, quality = "screen") {
    if (!file) {
        throw new Error("Please select a PDF file first.");
    }

    const data = new FormData();
    data.append("pdf", file);
    data.append("quality", quality);

    const res = await fetch(`${BASE_URL}/compress-pdf`, {
        method: "POST",
        body: data,
    });

    if (!res.ok) {
        const message = await parseError(res, `Compression failed (${res.status})`);
        throw new Error(message);
    }

    const blob = await res.blob();
    const contentDisposition = res.headers.get("content-disposition") || "";
    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
    const defaultName = `${file.name.replace(/\.pdf$/i, "")}.compressed.pdf`;
    const downloadName = filenameMatch?.[1] || defaultName;

    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);

    const originalBytes = Number(res.headers.get("x-original-bytes")) || file.size;
    const compressedBytes = Number(res.headers.get("x-compressed-bytes")) || blob.size;
    const savedBytes = Math.max(0, originalBytes - compressedBytes);
    const savedPercent = originalBytes > 0
        ? Number(((savedBytes / originalBytes) * 100).toFixed(2))
        : 0;

    return {
        success: true,
        filename: downloadName,
        originalBytes,
        compressedBytes,
        savedBytes,
        savedPercent,
    };
}

export async function upvoteDocument(docId, token) {
    const res = await fetch(`${BASE_URL}/documents/${docId}/upvote`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
        const message = await parseError(res, `Upvote failed (${res.status})`);
        throw new Error(message);
    }

    return res.json();
}

export async function downvoteDocument(docId, token) {
    const res = await fetch(`${BASE_URL}/documents/${docId}/downvote`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
        const message = await parseError(res, `Downvote failed (${res.status})`);
        throw new Error(message);
    }

    return res.json();
}

export async function deleteDocument(docId, token) {
    const res = await fetch(`${BASE_URL}/documents/${docId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
        const message = await parseError(res, `Delete failed (${res.status})`);
        throw new Error(message);
    }

    return res.json();
}

const getApiClient = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        throw new Error("User not authenticated");
    }

    const token = await user.getIdToken();
    return {
        get: async (endpoint) => {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            return response.json();
        },
        post: async (endpoint, body) => {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            return response.json();
        },
    };
};

export default getApiClient;
