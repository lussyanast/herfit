import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: false, // tetap false karena kita pakai Bearer token, bukan cookie
    headers: {
        Accept: "application/json",
    },
});

// Interceptor untuk menyisipkan Authorization header dari localStorage
instance.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default instance;