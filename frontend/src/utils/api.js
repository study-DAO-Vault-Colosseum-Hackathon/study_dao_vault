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

const getApiClient = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        throw new Error("User not authenticated");
    }

    const token = await user.getIdToken();
    const BASE_URL = import.meta.env.PROD 
        ? `${import.meta.env.VITE_API_URL}/api` 
        : "http://localhost:3000/api";
    return {
        get: async (endpoint) => {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            return response.json();
        },
        post: async (endpoint, body) => {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
            return response.json();
        }
    };
};

export default getApiClient;