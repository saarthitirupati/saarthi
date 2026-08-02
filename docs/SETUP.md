# Saarthi Setup Guide

## Prerequisites
- Node.js (v18+)
- Python 3.10+
- A Supabase Project

## 1. Environment Variables

Create a `.env` file in the root directory for the Next.js frontend:
```env
# Frontend
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
BACKEND_URL=http://127.0.0.1:8000
```

Create a `.env` file in the `backend/` directory:
```env
# Backend
DATABASE_URL=postgresql://user:pass@host:port/db
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SECRET_KEY=your_secure_secret
```

## 2. Starting the Environment

### Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

### Frontend (Next.js)
```bash
# In a new terminal window at the project root
npm install
npm run dev
```

Visit `http://localhost:3000` to see the application.
