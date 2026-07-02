# EduChainNP

[Live Demo](https://educhainnp.web.app/)  
**Note: Platform is desktop only. Mobile is not yet supported/optimized.**

---

A peer-to-peer academic knowledge platform for university students in Nepal — share notes, lab reports, and Q&A, earning on-chain reputation and badges.  
_This is a Solana Frontier 2026 hackathon submission, built by a university team in Nepal._

---

## 🖥️ Tech Stack

**Frontend**
- React (TypeScript & JavaScript)
- Tailwind CSS
- Firebase Hosting & Auth

**Backend** (Deployed on Render)
- Express.js (REST API)
  - Routes: `/api/documents`, `/api/documents/upload`, `/api/compress-pdf`, `/api/vault-status`, `/api/resources`
  - Auth via Firebase ID token middleware

**Data Storage**
- Appwrite Cloud Storage (files: PDF, DOCX, PPT, XLS, PNG, JPG)
- Firestore (document metadata)
- Supabase (QnA + real-time reply chains)

**Blockchain**
- Solana smart contract (Anchor/Rust, deployed to devnet)
  - 5 on-chain instructions
  - Relayer pays transaction fees; reimbursed from on-chain vault
  - User reputation points & badges

---

## 🚀 Features (What's Built)

- **Authentication:** Signup/Login with Firebase Auth (all actions require auth)
- **Notes & Lab Reports Feed:** Upload, fetch, display, filter by type or search query
    - Files stored in Appwrite; metadata in Firestore
    - PDF compression (Ghostscript, server-side, preserves storage)
- **QnA Feed:** Post questions (subject/chapter filtered), answer them, mark accepted answer; all with upvotes (no downvotes)
    - Real-time reply chains (text-only, via Supabase Realtime)
- **Reputation & Badges (On-Chain, Solana):**
    - Points for uploads, answers, accepted answers, etc.
    - Merit badge tiers: Spark, Current, Core, Supernova, Singularity
    - Relayer-enabled gasless flow (backend reimburses transaction fees)
    - Replay protection (no double submissions)
- **Backend:** Express with robust authentication middleware, live endpoints for all features above

---

## ⚠️ What’s Not Built Yet

- **Solana Integration:** Smart contract is live/devnet, but not yet connected to frontend. Reputation & badges will be powered from-chain post-hackathon. See “Known Issues” below.
- **Leaderboard UI:** Backend logic exists for top 10 users, but no frontend/UI yet.
- **Profile Display:** User reputation, badge tier—UI not built.
- **Anonymous Posting:** Designed, not implemented.
- **Institution Dashboard:** (Engagement dashboard for university admins/HODs)—designed only.
- **Admin Dashboard:** Backend endpoints exist for vault funding, relayer ops, leaderboard admin, but no UI.
- **Mobile Support:** Desktop-only; mobile/responsive views unoptimized.
- **Rules & Regulations:** Popup on first login planned, not implemented.

---

## ❗️ Known Issues & Transparent Postmortem

**Magic Link/Solana Wallet Integration:**  
The primary technical blocker: Magic Link SDK returned Ethereum wallet addresses, not Solana addresses, even with correct `@magic-ext/solana` setup. This broke the ability for users to partially sign Solana transactions, blocking the intended gasless relayer workflow.  
> We spent significant time diagnosing this; the Solana program is fully built, deployed, and tested locally, but connecting it to the frontend was impossible before the submission deadline.  
**For hackathon delivery, we used Firebase Auth as a fallback — on-chain reputation and badges will ship immediately post-hackathon, once Magic Link/Solana wallet config is fixed.**

---

## 🛠️ How to Run Locally
npm run dev

### 1. Clone the repo
```bash
git clone <this-repo-url>
cd study_dao_vault
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```
**Environment variables (`.env`):**
- `REACT_APP_API_URL=<your_backend_api_url>`
- `FIREBASE_API_KEY=...`
- `FIREBASE_AUTH_DOMAIN=...`
- *(other Firebase config keys as per your project)*

Start development server:
```bash
npm start
```

### 3. Backend Setup
```bash
cd backend
npm install
```
**Environment variables (`.env`):**
- `APPWRITE_ENDPOINT=...`
- `APPWRITE_PROJECT_ID=...`
- `APPWRITE_BUCKET_ID=...`
- `APPWRITE_API_KEY=...`
- `FIREBASE_SERVICE_ACCOUNT=...`
- `SUPABASE_URL=...`
- `SUPABASE_ANON_KEY=...`

Run backend server:
```bash
node src/index.js
# or
npm run dev
```

### 4. Solana Program Setup (Anchor)
- Install Anchor, Rust, Solana CLI if not already
- Build and deploy to devnet:
    ```bash
    anchor build
    anchor deploy --provider.cluster devnet
    ```
- Update `Anchor.toml` and `lib.rs` with your devnet program ID

- Run tests:
    ```bash
    anchor test
    ```

### 5. How to Run
- Frontend: `npm start` (in `frontend` directory)
- Backend: `node src/index.js` or `npm run dev` (in `backend` directory)
- Smart contract: `anchor test` and verify on devnet explorer

---

## 👨‍💻 Team

- **Bijesh** — Solana Anchor program, relayer/gasless flow, Express backend, deployment
- **Anup** — Notes/Lab Reports, Express routes, Appwrite/Firestore integration, PDF compression
- **Samit** — QnA feed, Supabase real-time reply chains
- **Swastik** — React frontend, navigation, Tailwind CSS, homepage

---

## ⛳️ Hackathon Context

_Submitted to **Solana Frontier 2026** as a university hackathon team from Nepal. EduChainNP is a proof-of-concept and not a commercial product. We welcome feedback, collaboration, or partnership inquiries._

---

**Thank you for reviewing our project! We value transparency — see "Known Issues" above for complete, honest status.**
