import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        },
    },
    trustedOrigins: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://tes-project-web-hv7u.vercel.app",
        "https://finance-alvin.vercel.app",
        ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
    ],
});
