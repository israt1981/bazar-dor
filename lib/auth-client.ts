import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Netlify ba local environment theke dynamic baseURL neyara jonno
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://mellifluous-halva-bb6954.netlify.app",
});