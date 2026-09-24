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
4. Run [supabase/schema.sql](supabase/schema.sql) in the Supabase SQL Editor to create video storage, posts, likes, comments, RLS, and realtime publication settings.
5. Add `http://localhost:3000` to Supabase Authentication URL Configuration, then run the app:
   `npm run dev`
