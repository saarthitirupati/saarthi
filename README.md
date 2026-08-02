# 🪔 Saarthi — Tirumala Yatra Companion

> **Smart, Transparent, Real-Time Decision Engine for Tirumala & Tirupati Pilgrims**

Saarthi is a full-stack, real-time pilgrim companion built to reduce anxiety, eliminate unpredictable wait times, and provide honest, transparent guidance for visitors to Tirumala & Tirupati.

---

## 🌟 Key Features

- **Live Operational Engine**: Real-time crowd wait times, Darshan queue speeds, SSD token availability, weather alerts, and Laddu stock tracking.
- **Saarthi Decision Engine**: Contextual recommendations that evaluate weather disruptions, token releases, and peak queue hours to guide pilgrims on the safest, fastest routes.
- **Modern Classic Aesthetic**: Designed with a sleek, premium visual hierarchy, glassmorphism elements, crisp typography, and vector icon imagery.
- **Dynamic Places & Realtime Hydration**: Hybrid data engine pairing static precision data with live Supabase database sync, supporting instant soft/hard deletion handling across all client sessions.
- **Unified Admin Briefing (`/saarthiadmin`)**: Secure operational dashboard to broadcast real-time queue status, SSD counter token releases, and critical pilgrim advisories.
- **Today's Spiritual Companion**: Daily Keerthanas, Annamayya trivia, divine reflection quotes, and sacred calendar insights tailored to each weekday and festival.

---

## 🚀 Quick Start

### 1. Start FastAPI Backend
```bash
cd backend
python -m uvicorn app.main:app --port 8000 --reload
```

### 2. Start Next.js Frontend
```bash
npm install
npm run dev
```

The app will be live at `http://localhost:3000`.

---

## 🏗️ Tech Stack & Architecture

- **Frontend**: Next.js 16 (App Router, Turbopack, Framer Motion, Lucide Icons)
- **Backend**: FastAPI (Python 3.10+, Pydantic v2, Uvicorn)
- **Database**: Supabase PostgreSQL & Real-time Subscriptions
- **Styling**: Vanilla CSS Modules & Modern Utility Design System

---

## 🔒 Admin Panel

Access the operational admin dashboard at `/saarthiadmin` to update live queue metrics, broadcast alerts, manage SSD token schedules, and edit place records in real time.

---

## 📜 Documentation

- [Architecture Overview](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Database Schema](docs/DATABASE.md)
- [Setup & Environment](docs/SETUP.md)
