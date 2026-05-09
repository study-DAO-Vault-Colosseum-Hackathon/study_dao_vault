import { getAuth } from "firebase/auth";

const BASE_URL = import.meta.env.PROD
    ? `${import.meta.env.VITE_API_URL}/api`
    : "http://localhost:3000/api";

const parseError = async (response, fallbackMessage) => {
    const text = await response.text();
    try {
        const json = JSON.parse(text);
        return json.error || json.message || fallbackMessage;
    } catch {
        return text || fallbackMessage;
    }
};

export async function fetchFeed({ search = "", feedType = "All" } = {}) {
    const res = await fetch(`${BASE_URL}/documents`);
    if (!res.ok) {
        const message = await parseError(res, `Failed to fetch feed (${res.status})`);
        throw new Error(message);
    }

    const payload = await res.json();
    const docs = Array.isArray(payload) ? payload : (payload.documents || []);

    return docs.filter((doc) => {
        const type = (doc.type || "").toLowerCase();
        const title = (doc.title || "").toLowerCase();
        const subject = (doc.subject || "").toLowerCase();
        const normalizedSearch = search.toLowerCase();

        const matchesType =
            feedType === "All" ||
            (feedType === "Notes" && type === "note") ||
            (feedType === "Lab Reports" && type === "lab");

        const matchesSearch =
            !normalizedSearch ||
            title.includes(normalizedSearch) ||
            subject.includes(normalizedSearch);

        return matchesType && matchesSearch;
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
    data.append("type", form.type);
    data.append("file", form.file);

    if (onStageChange) {
        onStageChange({ stage: "uploading", progress: 70, message: "Uploading file..." });
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
        onStageChange({ stage: "done", progress: 100, message: "Upload complete." });
    }

    return res.json();
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