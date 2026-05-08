# EduChainNP Vault

A secure full-stack application for managing a Study DAO Vault on Solana with Firebase authentication and backend token verification.

## Project Structure

```
Edu_Chain_NP vault/
├── frontend/          # React + Vite frontend
├── backend/           # Node.js + Express backend
└── study_dao_vault/   # Solana program (Anchor)
```

---

## Prerequisites

- Node.js (v18+)
- npm or yarn
- Firebase project setup
- Solana wallet (for future blockchain integration)

---

## Frontend Setup

### 1. Navigate to Frontend Folder
```powershell
cd frontend
```

### 2. Install Dependencies
```powershell
npm install
```

### 3. Setup Environment Variables
Copy the example file:
```powershell
cp .env.example .env
```

Edit `.env` with your values:
```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Run Development Server
```powershell
npm run dev
```

The frontend will be available at `http://localhost:5173`

---

## Backend Setup

### 1. Navigate to Backend Folder
```powershell
cd backend
```

### 2. Install Dependencies
```powershell
npm install
```

### 3. Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Navigate to **Project Settings** → **Service Accounts**
3. Click **Generate New Private Key**
4. Save the downloaded JSON file as `serviceAccountKey.json` in the `backend/` folder

⚠️ **IMPORTANT:** This file contains your Firebase project secrets. **NEVER commit it to GitHub.**

### 4. Setup Environment Variables
Copy the example file:
```powershell
cp .env.example .env
```

Edit `.env` with your values:
```env
PORT=3000
NODE_ENV=development
```

### 5. Run Development Server
```powershell
npm run dev
```

The backend will be available at `http://localhost:3000`

---

## How It Works

### Authentication Flow

1. **Frontend**: User clicks "Login with Google"
2. **Firebase**: Google popup appears, user authenticates
3. **Frontend**: Gets Firebase ID Token from Google
4. **Frontend**: Sends token to backend in `Authorization` header
5. **Backend**: Verifies token with Firebase Admin SDK
6. **Backend**: Returns user data (email, uid)
7. **Frontend**: Displays vault information securely

### Security

- ✅ Frontend tokens are verified by backend
- ✅ Only authenticated users can access protected routes
- ✅ Service account key is kept secret (in `.env`)
- ✅ CORS is configured for local development

---

## Important Notes

### `.env` Files - DO NOT COMMIT

Both `frontend/.env` and `backend/.env` are in `.gitignore` because they contain environment-specific values.

### `serviceAccountKey.json` - KEEP SECRET

This file contains your Firebase project's master credentials. **Never push it to GitHub.**

It should be in `backend/.gitignore` and only exist locally on your machine.

### `.env.example` Files - Safe to Commit

These files show what environment variables are needed without exposing secrets. Teammates can copy these to create their own `.env` files.

---

## Running Both Servers

You need **two separate terminals**:

### Terminal 1 - Backend
```powershell
cd backend
npm run dev
```

### Terminal 2 - Frontend
```powershell
cd frontend
npm run dev
```

Then open your browser to `http://localhost:5173`

---

## Project Features

### Current (Implemented ✅)

- [x] Google Sign-In with Firebase
- [x] Backend token verification
- [x] Protected API routes
- [x] Full-stack authentication
- [x] Environment variable configuration

### Upcoming (In Progress)

- [ ] Solana PDA integration
- [ ] Vault data storage
- [ ] Transaction handling
- [ ] DAO governance features

---

## Solana Integration

Once you've set up Firebase authentication, the next step is integrating Solana:

1. **Accounts**: Read about Solana accounts in [Solana Docs](https://docs.solana.com/developing/programming-model/accounts)
2. **PDAs**: Learn about Program Derived Addresses [here](https://docs.solana.com/developing/programming-model/calling-between-programs#program-derived-addresses)
3. **Your Vault**: Use the Firebase UID as a seed to generate unique PDAs for each user's vault

---

## Troubleshooting

### Backend won't start: "Cannot find module 'serviceAccountKey.json'"
- Make sure `serviceAccountKey.json` exists in the `backend/` folder
- Re-download it from Firebase Console if needed

### Frontend gets 404 for `/api/vault-status`
- Make sure backend is running on port 3000
- Check that `VITE_API_URL` in `frontend/.env` is correct
- Clear browser cache and refresh

### "Port 3000 already in use"
```powershell
Get-Process node | Stop-Process -Force
```

### Login popup doesn't appear
- Check that Firebase is properly configured in `frontend/src/firebase/firebase.js`
- Make sure Google OAuth is enabled in Firebase Console

---

## File Structure

```
backend/
├── src/
│   └── index.js              # Main Express server
├── middleware/
│   └── auth.js               # Token verification middleware
├── utils/
│   └── firebase.js           # Firebase Admin initialization
├── routes/
│   ├── auth.js
│   ├── qa.js
│   └── resources.js
├── .env                       # Local environment variables (git ignored)
├── .env.example               # Example environment variables
├── package.json
└── README.md

frontend/
├── src/
│   ├── App.jsx              # Main app component
│   ├── pages/
│   │   ├── Home.jsx         # Dashboard with vault status
│   │   └── Login.jsx        # Login page
│   ├── utils/
│   │   └── api.js           # API client with token handling
│   ├── firebase/
│   │   └── firebase.js      # Firebase configuration
│   └── main.jsx
├── .env                      # Local environment variables (git ignored)
├── .env.example              # Example environment variables
├── package.json
└── vite.config.js
```

---

## Next Steps for Tuesday Call

1. ✅ Frontend login working
2. ✅ Backend token verification working
3. ⬜ Read Solana Accounts & PDAs documentation
4. ⬜ Design vault PDA structure
5. ⬜ Plan token deposit/withdrawal logic

---

## Questions?

Ask your teammates or refer to:
- [Firebase Docs](https://firebase.google.com/docs)
- [Solana Docs](https://docs.solana.com/)
- [Express.js Docs](https://expressjs.com/)
