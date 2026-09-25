<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/077b9889-34f3-46c2-929a-373398496f90

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env.local`. Enable Email auth in Supabase; enable Google auth too if you want the Google button.
4. Run [supabase/schema.sql](supabase/schema.sql) in the Supabase SQL Editor to create video storage, marketplace orders, 5% commission settings, Pakistan delivery rates, escrow/wallet settlement, product reviews, RLS, and realtime publication settings.
5. Add `http://localhost:3000` to Supabase Authentication URL Configuration, then run the app:
   `npm run dev`

## Production security

The browser uses only the Supabase anon key (`VITE_SUPABASE_ANON_KEY`); it is
safe to expose because database access is enforced by RLS. Never place
`SUPABASE_SERVICE_ROLE_KEY` in a `VITE_` variable or browser module. Keep it
only in the deployment secret manager or the ignored `.env.local` file for
server-side tooling. Production builds are minified, omit source maps and
console/debugger statements, and Vercel sends restrictive security headers.

Run `supabase/schema.sql` after deploying schema changes. RLS is the security
boundary; client-side checks are only UX safeguards.

The initial marketplace rules are doorstep delivery only, with base courier rates of Rs. 160 same-city or Rs. 200 major inter-city, Rs. 60 per additional kilogram above 1kg, and Rs. 50 for remote zones. Seller funds move through 9-day escrow, 3-4 day processing settlement, then available payout; the commission is an internal 5% seller deduction.

PikPok also ships as an installable PWA through `public/manifest.webmanifest` and `public/sw.js`.
