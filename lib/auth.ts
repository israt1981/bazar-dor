import { betterAuth } from "better-auth";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "https://mellifluous-halva-bb6954.netlify.app",
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: ["https://mellifluous-halva-bb6954.netlify.app"],
  
  // ১. ইমেইল এবং পাসওয়ার্ড অথেন্টিকেশন এনাবল করার জন্য এটি যুক্ত করতে হবে
  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
});