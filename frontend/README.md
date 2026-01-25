# WanderLust Frontend

React frontend for the WanderLust Airbnb-like project. Uses React Router, Axios, and plain CSS. No TypeScript.

## Run

1. Start the backend on `http://localhost:5001`.
2. From `frontend/` run:
   - `npm install` (if needed)
   - `npm run dev`
3. Open `http://localhost:5173`. The dev server proxies `/api` to the backend.

## Build

- `npm run build` — outputs to `dist/`. Serve the static files and proxy `/api` to the backend (e.g. nginx, or serve from the same Express app).

## Structure

```
src/
├── api/axios.js        # Axios instance, baseURL /api, Bearer token
├── components/         # Navbar, ProtectedRoute, ListingCard, ListingMap
├── pages/              # Home, ListingDetails, Login, Signup, CreateListing, MyBookings, HostBookings
├── routes/AppRoutes.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## Pages

- `/` — All listings (cards: image, title, location, price)
- `/listings/:id` — Listing detail, map, booking form, reviews (owner: no book/review)
- `/login`, `/signup` — Auth; signup auto-logs in
- `/listings/new` — Create listing (protected; file image → base64)
- `/my-bookings` — Guest bookings
- `/host-bookings` — Bookings on your listings

Auth: JWT in `localStorage`, `Authorization: Bearer <token>` on requests. Logout clears token and redirects to login.
