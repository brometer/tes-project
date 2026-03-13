import { createAuthClient } from "better-auth/react";

// For Better Auth, we need the base URL without the /api path suffix
// VITE_API_URL is like "https://api-alvin.vercel.app/api"
// We need just "https://api-alvin.vercel.app"
const apiUrl = import.meta.env.VITE_API_URL || '';
const baseURL = apiUrl
    ? apiUrl.replace(/\/api\/?$/, '')  // Only strip /api at the END of the URL
    : 'http://localhost:4000';

export const authClient = createAuthClient({
    baseURL,
});

export const { signIn, signUp, signOut, useSession } = authClient;
