# বাজার দর (BazarDor)

A responsive Next.js application designed to track and compare essential daily commodity market prices in Bangladesh.

## Technologies Used
- Next.js (App Router)
- TypeScript & JavaScript
- Tailwind CSS
- BetterAuth & React Hot Toast
- Lucide React Icons

## Key Features
1. **Dynamic Navbar & Price Ticker**: Real-time category navigation and infinite marquee price ticker.
2. **Interactive Hero & Market Grids**: Quick access to top risers (*আজ দাম বেড়েছে ▲*), top fallers (*আজ দাম কমেছে ▼*), and all products.
3. **Category Filtering & Sorting**: Filter products by category with custom sorting (Default, Low-to-High, High-to-Low) handling Bengali numbers accurately.
4. **Product Details & Bazar Breakdown**: Detailed product views with min/max price summaries and bazar-specific price comparisons.
5. **Authentication & Profile Management**: Secure Sign-in, Sign-up, social login flows, and profile info update capabilities.

## Authentication Deployment

The auth client uses the current browser origin and the default `/api/auth` endpoint. Do not hardcode the deployment URL or reference `BETTER_AUTH_URL` in `lib/auth-client.ts`; this keeps the client usable across local development, production, and deploy previews without embedding the server configuration in client bundles.

Keep `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, and OAuth credentials in the server environment. `lib/auth.ts` is marked server-only to prevent accidental imports into client components. Netlify secrets scanning remains enabled; no scanning exclusions are required for this client configuration.
