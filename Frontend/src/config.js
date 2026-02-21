// Frontend/src/config.js
//
// Single place to control which backend URL is used.
// In development: uses localhost.
// In production (Vercel): reads from the VITE_BACKEND_URL environment variable.
//
// To set it on Vercel:
//   Project Settings → Environment Variables → add VITE_BACKEND_URL=https://your-app.onrender.com

const backendURL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

export default backendURL;