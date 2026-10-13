import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // ব্রাউজার বা লোকাল এনভায়রনমেন্ট অনুযায়ী অটোমেটিক বেস ইউআরএল ধরে নেবে
  baseURL: typeof window !== "undefined" ? window.location.origin : process.env.BETTER_URL,
});