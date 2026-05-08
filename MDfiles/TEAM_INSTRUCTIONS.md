# Team Instructions - Study DAO Frontend

## For Your UI Teammate

### What They Should Do First

**Day 1-2: Setup**
```bash
cd frontend
npm install tailwindcss react-router-dom supabase firebase @magic-ext/react @solana/web3.js
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Then create folder structure:
```
src/pages/
src/contexts/
src/components/common/
src/components/features/
src/components/layout/
src/services/
src/hooks/
src/utils/
```

**Day 2-3: Build Contexts (Copy from FRONTEND_ARCHITECTURE.md)**
- ProgramContext (program, semester, subject, activeTab)
- AuthContext (user, wallet, isLoggedIn)
- ReputationContext (reputation sync)
- NotificationContext (toasts)

**Day 3-4: Build Reusable Components**
- Button.jsx (all variants)
- Card.jsx
- FileUploader.jsx
- Modal.jsx
- LoadingSpinner.jsx

**Day 4-5: Build Layout**
- Navbar.jsx
- Sidebar.jsx (navigation)
- MainLayout.jsx

**Day 5-7: Build Features**
- DocumentUpload.jsx (Notes + Lab Reports)
- DocumentCard.jsx
- DocumentList.jsx
- QuestionCard.jsx
- AnswerCard.jsx

---

## For Your Notes Team

### What They Should Do

**Backend Setup (Express.js in `/backend`)**

Day 1-2: Setup
```bash
npm init -y
npm install express cors dotenv supabase firebase-admin axios
```

Day 2-3: Endpoints
```javascript
POST /api/documents          // Upload document (calls your Solana API)
GET /api/documents           // List documents (filtered)
POST /api/documents/:id/upvote
GET /api/documents/:id
DELETE /api/documents/:id    // Only if user owns it
```

Day 4-5: Firebase Integration
```javascript
// backend/services/firebase.js
const admin = require('firebase-admin');
admin.initializeApp();

module.exports = {
  uploadFile: async (path, buffer) => {
    await admin.storage().bucket().file(path).save(buffer);
    return `https://storage.googleapis.com/${bucket}/${path}`;
  },
  deleteFile: async (path) => {
    await admin.storage().bucket().file(path).delete();
  }
};
```

Day 5-6: Supabase Integration
```javascript
// backend/services/supabase.js
const { createClient } = require('@supabase/supabase-js');

module.exports = {
  createDocument: async (data) => {
    const { data: result } = await supabase
      .from('documents')
      .insert([data]);
    return result;
  },
  // Similar functions for read/update/delete
};
```

Day 6-7: Call Your Solana API
```javascript
// POST /api/documents
async (req, res) => {
  // 1. Save to Supabase
  const doc = await supabase.createDocument(metadata);
  
  // 2. Claim reputation (call your Solana API)
  const repResponse = await axios.post('http://localhost:3000/api/claim-reputation', {
    user_wallet: req.body.user_wallet,
    reputation_amount: 10,  // or 15 for lab reports
    reason: 'upload_document'
  });
  
  // 3. Return response
  res.json({ success: true, document: doc, reputation: repResponse.data });
}
```

---

## For Your Q&A Team

### What They Should Do

**Backend Setup (Express endpoints)**

Day 1-2: Setup (same as notes team)

Day 2-3: Endpoints
```javascript
POST /api/questions          // Create question
GET /api/questions           // List questions (filtered)
POST /api/questions/:id/answer
GET /api/answers/:id
POST /api/answers/:id/upvote // This calls your Solana API
```

Day 4-5: Supabase Schema for Q&A
```javascript
// Create questions table (if not exists)
await supabase.query(`
  CREATE TABLE questions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    subject TEXT,
    title TEXT,
    content TEXT,
    upvotes INT DEFAULT 0,
    created_at TIMESTAMP
  );
`);

// Create answers table
await supabase.query(`
  CREATE TABLE answers (
    id UUID PRIMARY KEY,
    question_id UUID REFERENCES questions(id),
    user_id UUID REFERENCES users(id),
    content TEXT,
    upvotes INT DEFAULT 0,
    is_accepted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP
  );
`);
```

Day 5-7: Implement upvote logic
```javascript
// POST /api/answers/:id/upvote
async (req, res) => {
  // 1. Increment upvote count in Supabase
  await supabase
    .from('answers')
    .update({ upvotes: supabase.rpc('increment', { row_id: answerId }) })
    .eq('id', answerId);
  
  // 2. Claim reputation for answerer (+5 per upvote)
  const answer = await supabase.from('answers').select('user_id').eq('id', answerId).single();
  
  const repResponse = await axios.post('http://localhost:3000/api/claim-reputation', {
    user_wallet: answerUser.wallet_address,
    reputation_amount: 5,  // +5 per upvote
    reason: 'answer_upvoted'
  });
  
  res.json({ success: true, upvotes: newUpvotes, reputation: repResponse.data });
}
```

---

## Data Flow (How It All Connects)

### Upload Notes Flow:
1. **Frontend:** User uploads file
2. **FileUploader:** Compresses file (pdf-lib, imageCompression)
3. **Frontend:** Sends to `/api/documents` (Express backend)
4. **Backend:** Uploads to Firebase Storage
5. **Backend:** Saves metadata to Supabase
6. **Backend:** Calls your Solana API `/api/claim-reputation` (+10 rep)
7. **Solana:** Updates UserReputation PDA on-chain
8. **Backend (Sync Service):** Reads PDA, updates Supabase users.reputation_score
9. **Frontend:** Fetches from Supabase, shows updated reputation

### Upvote Answer Flow:
1. **Frontend:** User clicks upvote on answer
2. **Frontend:** Calls `/api/answers/:id/upvote` (Express backend)
3. **Backend:** Increments upvotes in Supabase
4. **Backend:** Calls your Solana API `/api/claim-reputation` (+5 rep to answer author)
5. **Solana:** Updates UserReputation PDA
6. **Sync Service:** Reads PDA, updates Supabase
7. **Frontend:** Shows "+5 reputation earned" notification

---

## Critical Integration Points

### Solana API Expected by Teams:

**Endpoint 1: `/api/claim-reputation` (POST)**
```
Request:
{
  user_wallet: "4vJ9JU1bJJE24gosQv4ow4KFNuQVLSMT6DjVVKqdD1xs",
  reputation_amount: 10,
  reason: "upload_document" | "answer_upvoted" | "question_asked"
}

Response:
{
  success: true,
  transaction_hash: "5Uj...abc",
  reputation_new: 45,
  badges: ["bronze_contributor"]
}
```

**Endpoint 2: `/api/get-user-reputation` (GET)**
```
Request:
?user_wallet=4vJ9JU1bJJE24gosQv4ow4KFNuQVLSMT6DjVVKqdD1xs

Response:
{
  reputation_score: 45,
  total_uploads: 3,
  total_answers: 5,
  total_upvotes_received: 20,
  badges: ["bronze_contributor"]
}
```

Your job: Implement these two endpoints and have them ready by Day 10.

---

## Timeline Alignment

**Week 1:**
- UI Team: Build folder structure + contexts + reusable components
- Notes Team: Build backend endpoints for upload/list/upvote
- Q&A Team: Build backend endpoints for Q&A
- Solana Team: Build Anchor program + Platform PDA + UserReputation

**Week 2:**
- UI Team: Integration with Magic Link + Supabase queries
- Notes Team: Connect Firebase file storage
- Q&A Team: Implement upvote → Solana API call
- Solana Team: Build /api/claim-reputation endpoint + sync service

**Week 2.5 (Days 12-13):**
- ALL TEAMS: Full E2E testing together
- Fix integration bugs
- Polish UI

**Week 3 (Day 14+):**
- All demo-ready

---

## Troubleshooting

**"Frontend can't upload to Firebase"**
→ Check: Firebase config in `.env`
→ Check: Firebase auth credentials

**"Solana API returns 500"**
→ Check: Relayer keypair has SOL
→ Check: SolReserve has SOL
→ Check: Transaction logs for error

**"Supabase not syncing reputation"**
→ Check: Sync service is running
→ Check: Can you read UserReputation PDAs from Solana?

**"File upload too slow"**
→ Add compression (pdf-lib, imageCompression)
→ Check file size after compression

---

## Files to Share with Team

1. `FRONTEND_ARCHITECTURE.md` → UI team reads this
2. This file (`TEAM_INSTRUCTIONS.md`) → Notes + Q&A teams read this
3. `SOLANA_PLAN.md` → You keep this for reference

---

Good luck! Questions? Ask in your team chat. 🚀
