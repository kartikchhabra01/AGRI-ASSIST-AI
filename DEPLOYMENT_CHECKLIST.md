# AGRI ASSIST AI deployment checklist

## Frontend

- Set `VITE_API_URL` to the deployed backend URL, including `/api`.
- Run `npm ci` and `npm run build` in `frontend`.
- Deploy the generated `frontend/dist` directory.
- Configure SPA fallback so `/dashboard`, `/chat`, and `/settings` serve `index.html`.

## Backend

- Set `NODE_ENV=production` and `PORT`.
- Set `MONGO_URI` to the production MongoDB connection string.
- Set a strong, unique `JWT_SECRET`.
- Set `GEMINI_API_KEY` and retain the existing model configuration.
- Set `CORS_ORIGIN` to the exact deployed frontend origin (no trailing slash).
- Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_CALLBACK_URL` if Google sign-in is enabled.
- Run `npm ci --omit=dev` and `npm start` in `backend`.

## Validation

- Confirm the backend root endpoint responds successfully.
- Register or sign in, then verify Dashboard, Settings, AI Chat, image upload, rename/delete chat, and advisory history.
- Confirm Open-Meteo works for a saved farm location and that missing locations show the expected empty state.
- Test microphone permission and speech recognition in Chrome or Edge over HTTPS.
- Confirm the browser has no failed API requests and the backend logs contain no secret values.
