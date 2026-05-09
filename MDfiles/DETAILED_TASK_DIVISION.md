# Study DAO - Detailed Task Division & Requirements

## 📋 Project Overview

**Study DAO** is a decentralized knowledge-sharing platform for TU BSc CSIT & BCA students built on Solana (Devnet) with gasless transactions. The app allows students to share notes, lab reports, ask questions, and earn reputation/badges.

**Team:** 4 people
- **Solana Backend:** You (14-day plan)
- **Friend 1:** Notes Sharing + Lab Reports
- **Friend 2:** Q&A + Supabase Database Management
- **Friend 3:** UI Design + Reusable Components

**Timeline:** 14 days (Days 1-14 work, Last 3-4 for pitch/videos/report)

---

## 🔄 Tech Stack

### Frontend Stack
- **Framework:** React 19
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State Management:** Context API (4 contexts)
- **Auth:** Magic.link (@magic-ext/react)
- **Database Client:** @supabase/supabase-js
- **File Storage:** Firebase SDK
- **Solana:** @solana/web3.js
- **File Compression:** pdf-lib, browser-image-compression, pako
- **Rich Text:** TBD (optional, for Q&A editor)

### Backend Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** Supabase (PostgreSQL)
- **Database Client:** @supabase/supabase-js
- **File Storage:** Firebase Admin SDK
- **RPC:** Helius (Solana Devnet)
- **External APIs:** Magic.link
- **Smart Contracts:** Anchor (Rust)

### Infrastructure
- **Frontend Hosting:** Vercel or Netlify (TBD)
- **Backend Hosting:** Railway or Render (TBD)
- **On-Chain:** Solana Devnet
- **Auth Wallets:** Magic.link custodial wallets
- **File Storage:** Firebase (5GB free) + Supabase (1GB free)

---

## 🏗️ Database Schema (Supabase)

### 1. Core Tables

#### users
```sql
id UUID PRIMARY KEY
wallet_address TEXT UNIQUE
email TEXT
is_anonymous BOOLEAN DEFAULT FALSE
reputation_score INT DEFAULT 0 -- synced from Solana
total_uploads INT DEFAULT 0
total_answers INT DEFAULT 0
total_questions INT DEFAULT 0
created_at TIMESTAMP
updated_at TIMESTAMP
```

#### documents (Notes + Lab Reports)
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES users(id)
program TEXT -- 'bsc-csit' or 'bca'
semester INT -- 1-8
subject_id UUID REFERENCES subjects(id)
chapter_id UUID REFERENCES chapters(id)
document_type TEXT -- 'notes' or 'lab-reports'
title TEXT
description TEXT
file_url TEXT -- link to Firebase Storage
file_size INT -- in KB (after compression)
file_format TEXT -- '.pdf', '.docx', etc
is_anonymous BOOLEAN DEFAULT FALSE
upvotes INT DEFAULT 0
downvotes INT DEFAULT 0
created_at TIMESTAMP
updated_at TIMESTAMP
```

#### questions
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES users(id)
program TEXT
semester INT
subject_id UUID REFERENCES subjects(id)
title TEXT
content TEXT -- raw question text
is_anonymous BOOLEAN DEFAULT FALSE
upvotes INT DEFAULT 0
view_count INT DEFAULT 0
created_at TIMESTAMP
updated_at TIMESTAMP
```

#### answers
```sql
id UUID PRIMARY KEY
question_id UUID REFERENCES questions(id)
user_id UUID REFERENCES users(id)
content TEXT
is_anonymous BOOLEAN DEFAULT FALSE
upvotes INT DEFAULT 0
downvotes INT DEFAULT 0
is_accepted BOOLEAN DEFAULT FALSE
created_at TIMESTAMP
updated_at TIMESTAMP
```

#### replies (Main replies/sub-replies)
```sql
id UUID PRIMARY KEY
parent_reply_id UUID REFERENCES replies(id) -- NULL if main reply
document_id UUID REFERENCES documents(id) -- for notes replies
question_id UUID REFERENCES questions(id) -- for Q&A replies
answer_id UUID REFERENCES answers(id) -- if reply to answer
user_id UUID REFERENCES users(id)
content TEXT
is_anonymous BOOLEAN DEFAULT FALSE
upvotes INT DEFAULT 0
downvotes INT DEFAULT 0
created_at TIMESTAMP
updated_at TIMESTAMP
```

#### reply_images (Single images in replies - Supabase storage)
```sql
id UUID PRIMARY KEY
reply_id UUID REFERENCES replies(id)
image_url TEXT -- Supabase Storage URL
file_size INT -- in KB
created_at TIMESTAMP
```

### 2. Metadata Tables (Friend 2 manages)

#### programs
```sql
id UUID PRIMARY KEY
name TEXT -- 'BSc CSIT', 'BCA'
abbreviation TEXT -- 'csit', 'bca'
```

#### semesters
```sql
id UUID PRIMARY KEY
semester_number INT -- 1-8
```

#### subjects
```sql
id UUID PRIMARY KEY
program_id UUID REFERENCES programs(id)
semester_id UUID REFERENCES semesters(id)
name TEXT -- 'Programming', 'Discrete Math'
code TEXT -- 'CSC201'
course_structure TEXT -- 'old' or 'new'
```

#### chapters
```sql
id UUID PRIMARY KEY
subject_id UUID REFERENCES subjects(id)
chapter_number INT
chapter_name TEXT -- 'Introduction to C', etc
```

#### vote_history (Track upvotes/downvotes)
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES users(id)
document_id UUID REFERENCES documents(id) -- NULL if not document
question_id UUID REFERENCES questions(id) -- NULL if not question
answer_id UUID REFERENCES answers(id) -- NULL if not answer
reply_id UUID REFERENCES replies(id) -- NULL if not reply
vote_type TEXT -- 'upvote' or 'downvote'
created_at TIMESTAMP
```

#### reputation_transactions
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES users(id)
action TEXT -- 'upload_notes', 'answer_upvoted', 'question_asked', etc
reputation_earned INT
reference_id UUID -- document_id or question_id or answer_id
created_at TIMESTAMP
```

---

## 🎯 Task Breakdown by Team Member

### Anup: Notes Sharing + Lab Reports Backend

**Duration:** 14 days

#### Week 1 (Days 1-7):
- **Day 1-2:** Setup Express backend, dependencies (supabase, firebase-admin, axios)
- **Day 2-3:** Setup Firebase Admin SDK integration
- **Day 3-4:** Build compression logic (pdf-lib integration on backend)
- **Day 4-5:** Build endpoints:
  - `POST /api/documents` (upload with file compression)
  - `GET /api/documents` (list with filters)
  - `GET /api/documents/:id` (single document)
  - `DELETE /api/documents/:id` (delete own)
- **Day 5-6:** Build upvote/downvote logic:
  - `POST /api/documents/:id/upvote`
  - `POST /api/documents/:id/downvote`
- **Day 6-7:** Call Solana API for reputation:
  - When note uploaded → `POST /api/claim-reputation` (+10 rep)
  - When note upvoted → `POST /api/claim-reputation` (+5 rep to uploader)

#### Week 2 (Days 8-14):
- **Day 8-9:** Integration testing with UI
- **Day 10-11:** Implement file decompression on download
- **Day 11-12:** Add file type validation (only allow: pdf, docx, xlsx, txt, pptx, jpg, png, jpeg)
- **Day 12-13:** Implement image-to-PDF conversion (ilovepdf API or pdf-lib)
- **Day 13-14:** End-to-end testing with full team, bug fixes

#### Key Features:
- ✅ Lossless file compression (pdf-lib, browser-image-compression)
- ✅ Upload to Firebase with compressed files
- ✅ Metadata saved to Supabase (title, subject, chapter, file_url)
- ✅ Download returns decompressed original quality file
- ✅ Chapter filter tags (from Supabase chapters table)
- ✅ Multiple file type support (pdf, docx, xlsx, pptx, images)
- ✅ Image to PDF conversion
- ✅ Upvote/downvote tracking
- ✅ Anonymous posting support

#### Deliverables:
- Express backend running on localhost:3000
- 6 endpoints fully functional
- File compression working (40-60% size reduction expected)
- Integration with your Solana `/api/claim-reputation` endpoint

---

### Samit: Q&A + Supabase Management

**Duration:** 14 days

#### Week 1 (Days 1-7):
- **Day 1-2:** Supabase project setup, schema design
- **Day 2-3:** Create all tables (see schema above)
- **Day 3-4:** Build Q&A endpoints:
  - `POST /api/questions` (create question)
  - `GET /api/questions` (list with filters)
  - `GET /api/questions/:id` (get single)
  - `POST /api/questions/:id/upvote`
- **Day 4-5:** Build answer endpoints:
  - `POST /api/questions/:id/answer` (post answer)
  - `POST /api/answers/:id/upvote`
  - `POST /api/answers/:id/accept` (mark accepted)
- **Day 5-6:** Build reply/comment system:
  - `POST /api/replies` (post reply to any post)
  - `POST /api/replies/:id/upvote`
  - Thread/chain logic (parent_reply_id for sub-replies)
- **Day 6-7:** Setup Supabase Storage (1GB for reply images)

#### Week 2 (Days 8-14):
- **Day 8-9:** Complex query implementation:
  - Search across questions (full-text)
  - Reply threading queries
  - Filter by subject/semester/program
  - Sort by newest/most upvoted/unanswered
- **Day 10-11:** Implement image upload to replies:
  - `POST /api/replies/:id/image` (single image per reply)
  - Compress image before storing
  - Store in Supabase 1GB storage
- **Day 11-12:** Call Solana API for reputation:
  - When answer posted → `POST /api/claim-reputation` (+5 rep)
  - When answer upvoted → `POST /api/claim-reputation` (+5 rep to answerer)
- **Day 12-13:** Integration testing with Solana endpoints
- **Day 13-14:** End-to-end testing, bug fixes

#### Key Features:
- ✅ Reddit-like Q&A system
- ✅ Question threads with multiple answers
- ✅ Answer marking as "accepted"
- ✅ Sub-replies (reply to reply) with threading
- ✅ Upvote/downvote per item (question, answer, reply)
- ✅ Single image per reply (stored in Supabase)
- ✅ Anonymous posting
- ✅ Complex filtering & search
- ✅ Integration with Solana reputation

#### Metadata Management:
- ✅ Create & maintain all metadata tables (programs, semesters, subjects, chapters)
- ✅ Provide endpoints for metadata queries:
  - `GET /api/subjects`
  - `GET /api/subjects/:id/chapters`
  - `GET /api/programs`

#### Deliverables:
- Supabase database fully configured
- All tables with proper relationships
- 10+ endpoints for Q&A functionality
- Image upload to Supabase storage working
- Complex query builder for filtering/search

---

### Swastik: UI Design + Reusable Components

**Duration:** 14 days

#### Week 1 (Days 1-7):
- **Day 1-2:** Folder structure setup + Tailwind configuration
- **Day 2-3:** Create 4 contexts (copy from FRONTEND_ARCHITECTURE.md):
  - ProgramContext (program, semester, subject, activeTab)
  - AuthContext (user, wallet, isLoggedIn)
  - ReputationContext (reputation, badges)
  - NotificationContext (showNotification)
- **Day 3-4:** Build reusable primitive components:
  - Button.jsx (variants: primary, secondary, danger, success; sizes: sm, md, lg)
  - Card.jsx (generic container)
  - FileUploader.jsx (drag-drop, accepts configurable file types)
  - Modal.jsx
  - LoadingSpinner.jsx
  - ConfirmDialog.jsx
- **Day 4-5:** Build layout components:
  - Navbar.jsx (with auth buttons: Google, GitHub, Discord, Apple, Microsoft)
  - Sidebar.jsx (program/semester/subject navigation)
  - MainLayout.jsx (wrapper for pages)
- **Day 5-6:** Build universal component:
  - VoteComponent.jsx (reusable upvote/downvote, used in notes, Q&A, replies)
  - ReplySection.jsx (for main replies + sub-replies threading)
- **Day 6-7:** Build page structure:
  - ProgramsPage.jsx (select BSc CSIT or BCA)
  - SemesterPage.jsx (select semester 1-8)
  - SubjectPage.jsx (list all subjects)
  - SubjectDetailPage.jsx (main content area with tabs)

#### Week 2 (Days 8-14):
- **Day 8-9:** Build feature components (Notes section):
  - DocumentCreateCard.jsx (Facebook-style "What notes do you want to share?")
  - DocumentUploadModal.jsx (form with chapter filter)
  - DocumentCard.jsx (card showing note + upvotes + download button)
  - DocumentList.jsx (list with filters sidebar)
  - EmptyState.jsx (sad wumpus + "No notes available")
- **Day 9-10:** Build Q&A components:
  - QuestionCreateCard.jsx
  - QuestionModal.jsx
  - QuestionCard.jsx
  - AnswerCard.jsx (with "Mark as Accepted" if owner)
  - ReplyThread.jsx (main reply + sub-replies)
- **Day 10-11:** Build auth flow:
  - Magic Link integration
  - 5 social buttons (Google, GitHub, Discord, Apple, Microsoft)
  - Login modal (show only when trying to interact without auth)
  - User profile page (optional for MVP)
- **Day 11-12:** Build landing page:
  - Homepage (not login)
  - Allow anonymous browsing
  - Show notes, questions, leaderboard
  - Chapters section with chapter cards
  - Click chapter → filter notes by chapter
- **Day 12-13:** Responsive design:
  - Mobile-first (< 640px)
  - Tablet refinements (640px - 1024px)
  - Desktop enhancements (> 1024px)
  - Test on real devices
- **Day 13-14:** Polish & integration testing

#### Key Features:
- ✅ 4 contexts only (no context bloat)
- ✅ Reusable components (Button, Card, FileUploader, VoteComponent)
- ✅ App structure: TU > Program > Semester > Subject
- ✅ Tabs: Chapters (landing), Syllabus, Notes, Lab Reports, Q&A, Question Bank
- ✅ Magic Link auth (5 social buttons)
- ✅ Anonymous browsing
- ✅ Auth state management (show/hide features based on login)
- ✅ Chapter cards with click-to-filter
- ✅ Facebook-style create cards
- ✅ Empty states with sad wumpus
- ✅ Mobile-first responsive design
- ✅ Tailwind styling (no custom CSS except where necessary)

#### Deliverables:
- Complete React app with folder structure
- 20+ reusable components
- All pages functional
- Mobile, tablet, desktop responsive
- Magic Link authentication integrated

---

### Bijesh: Solana Backend + Integration

**Duration:** 14 days (see SOLANA_PLAN.md for detailed breakdown)

#### Week 1 (Days 1-7):
- **Days 1-3:** Anchor project setup
- **Days 4-5:** Platform + SolReserve PDAs
- **Days 5-6:** UserReputation PDA + claim_reputation instruction
- **Day 7:** Vault CPI Transfer (gasless mechanism)

#### Week 2 (Days 8-14):
- **Days 8-9:** Badge PDA + mint_badge instruction
- **Days 10-11:** Express backend for:
  - `POST /api/claim-reputation` (claims reputation on-chain)
  - `GET /api/get-user-reputation` (gets user's reputation from PDA)
  - `GET /api/leaderboard` (top contributors)
- **Day 12:** Supabase sync service:
  - Reads UserReputation PDAs every 5 seconds
  - Updates Supabase users.reputation_score
- **Days 13-14:** Integration testing + polish

#### Key Deliverables:
- Anchor program (Platform, UserRep, Badge PDAs)
- Gasless transaction mechanism (Vault CPI)
- 3 Express endpoints
- Supabase sync service
- Ready for integration with all teams

---

## 🔄 Integration Points

### How Teams Connect:

```
Frontend (Swastik)
   ↓
   → Calls /api/documents (Friend 1)
   → Calls /api/questions (Friend 2)
   → Calls /api/claim-reputation (You)
   ↓
Backend (Anup, Samit, Bijesh)
   ↓
   → Saves to Supabase (Friend 2 schema)
   → Saves files to Firebase (Friend 1 handles)
   → Calls Solana program (You)
   ↓
On-Chain (Bijesh Anchor program)
   ↓
   → Updates UserReputation PDA
   → Emits event
   ↓
Sync Service (Bijesh)
   ↓
   → Reads PDA
   → Updates Supabase users.reputation_score
   ↓
Frontend (Swastik)
   ↓
   → Queries Supabase, shows updated reputation
```

### Critical Dates:

| Date | Milestone | Owner(s) |
|------|-----------|----------|
| Day 3 | Folder structure ready | All |
| Day 7 | Core logic complete | Anup, Samit, Bijesh |
| Day 10 | All endpoints ready | Anup, Samit, Bijesh |
| Day 11 | Auth integration done | Swastik + Magic |
| Day 12 | Full E2E testing | All together |
| Day 13 | Bug fixes + polish | All |
| Day 14 | Demo ready | All |

### File Routing:

**Upload Notes:**
1. Frontend → POST /api/documents (to Anup)
2. Anup → Compress → Firebase Storage
3. Anup → Save metadata to Supabase (via Samit)
4. Anup → POST /api/claim-reputation (to You)
5. Bijesh → Update PDA → Emit event
6. Bijesh (sync service) → Read PDA → Update Supabase
7. Frontend → Query Supabase → Show updated rep

---

## 📊 Feature Checklist

### Notes + Lab Reports (Anup)
- [ ] File upload with compression
- [ ] File decompression on download
- [ ] Chapter filter tags
- [ ] Subject/semester/program filters
- [ ] Sort by upvotes (default)
- [ ] Create card (Facebook style)
- [ ] Multiple file types support
- [ ] Image to PDF conversion
- [ ] Upvote/downvote
- [ ] Anonymous posting

### Q&A (Samit)
- [ ] Reddit-like question posting
- [ ] Multiple answers per question
- [ ] Mark answer as accepted
- [ ] Reply chains (threading)
- [ ] Upvote/downvote per item
- [ ] Single image in replies
- [ ] Anonymous posting
- [ ] Search & filter questions
- [ ] Complex query support

### UI Design (Swastik)
- [ ] 4 contexts (no bloat)
- [ ] Reusable components
- [ ] Program/Semester/Subject navigation
- [ ] Chapter cards (landing page)
- [ ] Magic Link auth (5 buttons)
- [ ] Anonymous browsing
- [ ] Create cards (notes, Q&A)
- [ ] VoteComponent (reusable)
- [ ] Reply threads
- [ ] Empty states (sad wumpus)
- [ ] Mobile-first responsive
- [ ] Navbar + Sidebar

### Solana Backend (Bijesh)
- [ ] Anchor program (3 PDAs)
- [ ] Gasless mechanism (Vault CPI)
- [ ] 3 Express endpoints
- [ ] Supabase sync service
- [ ] Integration with other endpoints

---

## 📝 Notes & Best Practices

### File Compression
- **Use:** pdf-lib (PDF), browser-image-compression (images), pako (gzip)
- **Don't use:** ilovepdf API (unnecessary cost)
- **Expected savings:** 40-60% reduction

### File Storage Strategy
- **Firebase:** Large files (PDFs, DOCX, XLSX, images converted to PDF) - 5GB free
- **Supabase:** Small reply images only - 1GB free

### Anonymous Posting
- Store `is_anonymous` flag in database
- Frontend hides user_id if true
- Backend still tracks user_id for moderation

### Pagination
- Use pagination (20 items per page) instead of infinite scroll for mobile
- Easier to implement and debug

### API Naming Conventions
- Use RESTful conventions (GET/POST/DELETE)
- Use `/api/documents` not `/api/getNotes`
- Use `/api/documents/:id/upvote` not `/api/upvoteDocument`

### Error Handling
- Return meaningful error messages
- Include HTTP status codes (400, 401, 404, 500)
- Log errors for debugging

### Testing
- Test each endpoint independently
- Test with multiple file types
- Test with large files (stress test)
- Test with multiple users simultaneously

---

## 🚀 Deployment (Post-Hackathon)

- Frontend: Vercel
- Backend: Railway or Render
- Database: Keep Supabase free tier (upgrade later)
- Storage: Keep Firebase free tier (upgrade later)
- Smart contract: Mainnet migration (security audit first)

---

## 🎯 Final Checklist

- [ ] All teammates understand their tasks
- [ ] Tech stack confirmed
- [ ] Database schema approved
- [ ] API endpoints documented
- [ ] Integration points clear
- [ ] Timeline aligned
- [ ] Daily standups scheduled
- [ ] Git repo ready
- [ ] Environment variables configured
- [ ] Solana environment setup (Rust, Anchor, keypairs)

---

**Last Updated:** April 27, 2026
**Status:** Ready for implementation
**Next Step:** Day 1 - Setup & initialization
