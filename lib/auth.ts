import { betterAuth } from "better-auth";

export const auth = betterAuth({
  // Netlify ba live production url thikmoto paor jonno baseURL add kora holo
  baseURL: process.env.BETTER_AUTH_URL,
  // database configuration and other settings...
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