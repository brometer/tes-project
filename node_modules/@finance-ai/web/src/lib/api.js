import axios from 'axios';

// Create an Axios instance configured to talk to our backend API
// During Vercel deployment, the API will be available at the same domain under /api
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
    baseURL,
    // very important: withCredentials sends Better Auth cookies automatically
    withCredentials: true, 
});

// Response interceptor for catching global authorization errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // If the backend says we're unauthorized, the session is likely expired or invalid.
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.warn("API Auth Error: Session may be invalid or expired.");
            // If the user isn't already on the login page, we could force a reload to let 
            // the ProtectedRoute and AuthContext handle the redirect back to /login
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
