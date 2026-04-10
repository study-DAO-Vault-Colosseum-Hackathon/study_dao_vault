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