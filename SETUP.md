# Quick Start Guide - Study DAO Vault

Welcome! This guide will help you set up the Study DAO Vault project on your local machine. Follow these steps carefully.

---

## Prerequisites

Before you start, make sure you have:

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Firebase Account** (free tier works)
- **Git**

Verify your Node.js version:
```powershell
node --version
npm --version
```

---

## Step 1: Clone the Repository

```powershell
git clone https://github.com/YOUR_USERNAME/study-dao-vault.git
cd study-dao-vault
```

---

## Step 2: Backend Setup

### 2.1 Install Dependencies
```powershell
cd backend
npm install
```

### 2.2 Get Firebase Service Account Key

⚠️ **IMPORTANT:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** → **Service Accounts** tab
4. Click **Generate New Private Key**
5. Save the downloaded JSON file as `serviceAccountKey.json` in the `backend/` folder

**SECURITY:** This file is secret! Never push it to GitHub. It's in `.gitignore` so it won't be committed.

### 2.3 Create Environment File
```powershell
cp .env.example .env
```

The `.env` file will contain:
```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**No changes needed!** These defaults work for local development.

### 2.4 Verify Structure

You should have:
```
backend/
├── .env                    ← You created this (git ignored)
├── .env.example            ← Reference file
├── serviceAccountKey.json  ← You downloaded this (git ignored)
├── middleware/
│   └── auth.js
├── utils/
│   └── firebase.js
├── src/
│   └── index.js
├── package.json
└── Dockerfile
```

### 2.5 Start Backend
```powershell
npm run dev
```

You should see:
```
Server listening on port 3000
Environment: development
Allowing CORS from: http://localhost:5173
```

✅ Backend is running!

---

## Step 3: Frontend Setup

**Open a NEW terminal** (keep backend running):

### 3.1 Navigate to Frontend
```powershell
cd ../frontend
```

### 3.2 Install Dependencies
```powershell
npm install
```

### 3.3 Create Environment File
```powershell
cp .env.example .env
```

The `.env` file will contain:
```env
VITE_API_URL=http://localhost:3000
VITE_API_PROXY_TARGET=http://localhost:3000
```

**No changes needed!** This points to your local backend.

### 3.4 Start Frontend
```powershell
npm run dev
```

You should see:
```
  VITE v...... dev server running at:

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

✅ Frontend is running!

---

## Step 4: Test the Application

1. Open your browser: `http://localhost:5173`
2. Click **"Continue with Google"**
3. Sign in with your Google account
4. You should see:
   ```
   Welcome, your-email@gmail.com!
   Vault Status
   {"message":"Welcome your-email@gmail.com","userId":"..."}
   ```

✅ Everything is working!

---

## Troubleshooting

### Backend Won't Start

**Error:** `Cannot find module 'serviceAccountKey.json'`

**Fix:**
1. Make sure `serviceAccountKey.json` exists in the `backend/` folder
2. Download it again from Firebase Console

**Error:** `Error: Cannot find module 'dotenv'`

**Fix:**
```powershell
npm install dotenv
```

---

### Frontend Won't Start

**Error:** `[plugin:vite:import-analysis] Failed to resolve import...`

**Fix:**
```powershell
npm install
```

---

### CORS Error in Browser

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Fix:**
1. Make sure backend is running on port 3000
2. Check that `FRONTEND_URL` in `backend/.env` matches your frontend URL
3. Restart both servers

---

### Login Doesn't Work

**Error:** Google popup doesn't appear

**Fix:**
1. Check that you have the right Firebase project configured in `frontend/src/firebase/firebase.js`
2. Make sure Google sign-in is enabled in Firebase Console

---

### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Fix:**
```powershell
# Kill the process using port 3000
Get-Process node | Stop-Process -Force

# Or change to a different port
# Update backend/.env: PORT=3001
```

---

## File Structure Overview

```
study-dao-vault/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx        (Dashboard page)
│   │   │   └── Login.jsx       (Login page)
│   │   ├── utils/
│   │   │   └── api.js          (API client with token handling)
│   │   ├── firebase/
│   │   │   └── firebase.js     (Firebase config)
│   │   └── App.jsx
│   ├── .env                    (Local config - git ignored)
│   ├── .env.example            (Reference for teammates)
│   ├── .env.production         (Production config)
│   └── package.json
│
├── backend/
│   ├── src/
│   │   └── index.js            (Express server)
│   ├── middleware/
│   │   └── auth.js             (Token verification)
│   ├── utils/
│   │   └── firebase.js         (Firebase Admin SDK)
│   ├── .env                    (Local config - git ignored)
│   ├── .env.example            (Reference for teammates)
│   ├── .env.production         (Production config)
│   ├── serviceAccountKey.json  (Firebase credentials - git ignored)
│   └── package.json
│
├── study_dao_vault/            (Solana program)
│
├── README.md                   (Project overview)
├── SETUP.md                    (This file - setup guide)
└── .gitignore                  (Prevents pushing secrets)
```

---

## Common Commands

### Development

```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Building for Production

```powershell
# Frontend
npm run build

# Backend
npm start
```

### Running with Docker

```powershell
docker-compose up --build
```

---

## Environment Variables

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:3000
VITE_API_PROXY_TARGET=http://localhost:3000
```

### Backend (`.env`)
```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Do NOT commit these files!** They're in `.gitignore`.

---

## Security Notes

✅ **What's Protected:**
- `.env` files (local configuration)
- `serviceAccountKey.json` (Firebase master key)
- All credentials

❌ **What's Public (Safe to Share):**
- `.env.example` files
- `.env.production` (with placeholder domains)
- Code and configuration templates

---

## Authentication Flow

1. **User logs in** on frontend with Google
2. **Firebase creates** an ID Token
3. **Frontend sends token** to backend in request headers
4. **Backend verifies token** with Firebase Admin SDK
5. **Backend returns** authenticated user data
6. **Frontend displays** vault information

See [README.md](./README.md) for detailed architecture info.

---

## Next Steps

1. ✅ Set up locally (this guide)
2. ⬜ Read about Solana Accounts & PDAs
3. ⬜ Design vault smart contract
4. ⬜ Integrate blockchain interactions

---

## Questions?

- Check [README.md](./README.md) for architecture details
- See [Firebase Docs](https://firebase.google.com/docs)
- Check [Solana Docs](https://docs.solana.com/)
- Ask your teammates on Slack/Discord

---

## Useful Links

- [Firebase Console](https://console.firebase.google.com/)
- [Solana Documentation](https://docs.solana.com/)
- [Node.js](https://nodejs.org/)
- [Vite](https://vitejs.dev/)
- [Express.js](https://expressjs.com/)

---

**Welcome to the team! Happy coding!** 🚀
