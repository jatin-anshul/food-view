# FoodView — Food Reel Platform

A short-form video platform for food, built with a React frontend and a Node.js/Express backend. Food partners upload meal reels; users can scroll through them, like, save, comment, and search — all in a TikTok/Reels-style UI.

---

## Features

### Users
- Register and log in
- Scroll a full-screen vertical reel feed with auto-play
- **Like** and **save** any food reel (icons stay highlighted across sessions)
- **Comment** on reels — with relative timestamps and avatar initials
- **Delete** their own comments
- **Search** food by name or description with debounced live results
- View a **Saved** page with a 2-column video grid and a fullscreen modal player
- Visit the food partner's store profile from any reel

### Food Partners
- Register and log in
- Upload food reels (name, description, video file)
- **Like** and **save** reels (same as users)
- **Delete** any comment on their own food items
- Public profile page showing total meals uploaded and unique customers served

### General
- Bottom navigation bar — Home · Search · Saved — shared across all pages
- Mobile-first responsive design with iOS safe-area support
- Auto-play / pause on scroll using IntersectionObserver

---

## Tech Stack

| Layer      | Technology |
|------------|-----------|
| Frontend   | React 19, React Router 7, Axios, Vite |
| Backend    | Node.js, Express 5 |
| Database   | MongoDB + Mongoose 9 |
| Auth       | JWT (HTTP-only cookies) |
| Storage    | ImageKit (video uploads) |
| Styling    | Plain CSS, mobile-first |

---

## Project Structure

```
Zomato/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js        # register, login, logout, /me
│   │   │   ├── food.controller.js        # feed, like, save, comment, search
│   │   │   └── food-partner.controller.js
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js        # authUser, authFoodPartner, authAny
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── foodpartner.model.js
│   │   │   ├── food.model.js
│   │   │   ├── likes.model.js
│   │   │   ├── save.model.js
│   │   │   └── comment.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── food.routes.js
│   │   │   └── food-partner.routes.js
│   │   ├── services/
│   │   │   └── storage.service.js        # ImageKit upload wrapper
│   │   ├── db/
│   │   │   └── db.js
│   │   └── app.js
│   ├── server.js
│   ├── .env
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── BottomNav.jsx
    │   ├── pages/
    │   │   ├── general/
    │   │   │   ├── Home.jsx              # reel feed + comment drawer
    │   │   │   ├── Search.jsx            # search page
    │   │   │   └── Saved.jsx             # saved reels grid
    │   │   ├── food-partner/
    │   │   │   ├── Profile.jsx
    │   │   │   └── CreateFood.jsx
    │   │   ├── UserLogin.jsx
    │   │   ├── UserRegister.jsx
    │   │   ├── FoodPartnerLogin.jsx
    │   │   └── FoodPartnerRegister.jsx
    │   ├── routes/
    │   │   └── AppRoutes.jsx
    │   └── styles/
    │       ├── reels.css
    │       ├── profile.css
    │       ├── auth.css
    │       ├── create-food.css
    │       ├── theme.css
    │       └── variables.css
    └── index.html
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- An [ImageKit](https://imagekit.io) account for video storage

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd Zomato
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file (copy from `.env.example`):

```env
JWT_SECRET=your_jwt_secret_here
MONGODB_URI=mongodb://localhost:27017/zomato
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

Start the backend:

```bash
npm start
```

The server runs on `http://localhost:3000`.

### 3. Set up the frontend

```bash
cd ../frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/user/register` | — | Register a user |
| POST | `/user/login` | — | Log in as user |
| GET | `/user/logout` | — | Log out |
| POST | `/food-partner/register` | — | Register a food partner |
| POST | `/food-partner/login` | — | Log in as food partner |
| GET | `/food-partner/logout` | — | Log out |
| GET | `/me` | — | Get current session identity |

### Food — `/api/food`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | — | Get all food reels |
| POST | `/` | Food Partner | Upload a new reel |
| GET | `/search?q=` | — | Search reels by name / description |
| GET | `/saved` | User or FP | Get saved reels for current actor |
| GET | `/my-interactions` | User or FP | Get liked and saved food IDs |
| POST | `/like` | User or FP | Toggle like on a reel |
| POST | `/save` | User or FP | Toggle save on a reel |
| POST | `/comment` | User | Add a comment |
| GET | `/:foodId/comments` | — | Get comments for a reel |
| DELETE | `/comment/:commentId` | User or FP | Delete a comment |

### Food Partner — `/api/food-partner`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/:id` | — | Get partner profile, food items, and customer count |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `MONGODB_URI` | MongoDB connection string |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public API key |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private API key |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint for your account |

---

## Scripts

### Backend
```bash
npm start   # run with node
```

### Frontend
```bash
npm run dev      # development server (Vite)
npm run build    # production build
npm run preview  # preview production build
npm run lint     # ESLint
```
