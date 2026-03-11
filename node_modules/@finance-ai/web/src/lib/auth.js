import { createAuthClient } from "better-auth/react";

const baseURL = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api', '') 
    : 'http://localhost:4000';

export const authClient = createAuthClient({
    baseURL, // Backend API server URL
});

export const { signIn, signUp, signOut, useSession } = authClient;
