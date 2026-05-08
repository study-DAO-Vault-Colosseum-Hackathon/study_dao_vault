# StudyColosseum — Phase 3 Team Task Division & Integration Guide

## Platform Overview
**StudyColosseum** is a peer-to-peer study resource platform with reputation-driven merit scoring.
- **3 Feeds**: Notes, Lab Reports, QnA
- **Reputation System**: Points awarded for contributions + community feedback
- **Badges**: 5 tier system (Spark → Singularity) based on points + top-10 ranking
- **Blockchain**: Solana-based scoring with relayer-based fee model (users don't pay TX fees)

---

## Task 1: Anup — Notes & Lab Reports Feed

### Features to Implement
- **Upload Modal**: Chapter filters, subject filters, file type selection (PDF, DOCX, PPT, XLS, PNG, JPG)
  - Must inform users: "Original quality available on download; preview uses compressed version"
- **Feed Display**: Posts with upvote/downvote buttons, compressed file previews, lazy loading
- **Comments**: Optional; text-only, no voting, no onchain sync
- **Empty States**: Use shared sad Wumpus component
- **Anonymous Posting**: UI toggle only (no onchain changes)

### Tech Stack
- **Frontend**: React + JavaScript
- **Storage**: Firestore only (independent from Samit's Supabase)
- **File Compression**: GhostScript API or similar
- **Performance**: Lazy loading, compressed previews, pagination

### Onchain Actions to Sync
| Action | Points | Triggered By |
|--------|--------|-------------|
| UploadNotes | +10 | User uploads note |
| UploadLabReports | +10 | User uploads lab report |
| UploadUpvote | +5 | User upvotes a post |
| UploadDownvote | -2 | User downvotes a post |

### What You Need from Bijesh
- Utility function to submit upvote/downvote event (you provide event ID; he calls `apply_reputation_action`)
- Event ID format: `blake3(post_id || "upvote" || timestamp)` or similar unique identifier
- Function to display upvote count + badge tier of post author

### Constraints
- **Do NOT reuse Samit's Supabase logic** — independent Firestore setup
- **Do NOT call onchain program directly** — use Bijesh's utility functions only

---

## Task 2: Samit — QnA Feed

### Features to Implement
- **Post Modal**: Question text + chapter/subject filters
- **Question Cards**: 
  - Upvote button only (no downvote; psychological safety)
  - Empty state if no answers yet
- **Answer Section**:
  - Upvote + Accept buttons only (no downvote)
  - Question owner can mark up to **1 answer as accepted** (maximum; drives prestige)
  - Accept button disabled after limit reached(i.e. one of the answers is accepted, so disable accept btn for all other answers)
  - Accepted answer permanently marked with "Accepted" badge
- **Reply Chains**: Real-time text chat under each answer (no voting; Supabase only)
- **Anonymous Posting**: UI toggle for questions and answers (no onchain changes)
- **Real-Time Updates**: Use Supabase Realtime for answers + reply chains

### Tech Stack
- **Frontend**: React + JavaScript
- **Storage**: Supabase only (independent from Anup's Firestore)
- **Real-Time**: Supabase Realtime or WebSocket
- **Chat**: Supabase with timestamp-ordered replies

### Onchain Actions to Sync
| Action | Points | Triggered By |
|--------|--------|-------------|
| QuestionPosted | +10 | User posts question |
| QuestionUpvoted | +1 | User upvotes question |
| AnswerPosted | +10 | User posts top-level answer |
| AnswerUpvoted | +2 | User upvotes answer |
| AnswerMarkedAccepted | +20 | Question owner marks answer accepted |

**NOT synced onchain**: Reply chains, comment-like replies (text storage in Supabase only)

### What You Need from Bijesh
- Utility function to submit question/answer/upvote/accept events (you provide event ID; he calls `apply_reputation_action`)
- Event ID format: `blake3(question_id || "posted" || timestamp)` for question; `blake3(answer_id || "upvoted" || timestamp)` for upvotes, etc.
- Function to display answer author's badge tier + point balance
- Function to mark answer as accepted (calls `apply_reputation_action` with AnswerMarkedAccepted action)

### Constraints
- **Do NOT reuse Anup's Firestore logic** — independent Supabase setup
- **Do NOT call onchain program directly** — use Bijesh's utility functions only
- **No downvotes** on questions or answers (intentional for community safety)
- **Reply chains are text-only** — no upvote/downvote; stored in Supabase only

---

## Task 3: Bijesh — Solana Integration, APIs & Deployment

### Responsibilities

#### A. Localnet Testing
- Write backend test script to verify all 5 onchain instructions work correctly
- Test error cases: replay attacks, unauthorized relayers, invalid founding member claims
- Log transaction hashes for debugging
- Verify account balances before/after each instruction

#### B. RPC & Utilities
- Setup RPC endpoints (devnet selection)
- Create utility library for teammates:
  - `submitReputationAction(user, actionType, eventId)` → calls onchain + handles retries
  - `getUserReputation(wallet)` → returns points + badge tier
  - `getTopTenUsers()` → returns top 10 leaderboard
  - Handle RPC response delays + timeouts gracefully

#### C. Magic Link Integration
- Setup Magic Link authentication for admin + users
- Manage auth state & session persistence across platform
- Provide auth context to Swastik + others

#### D. Admin Setup & Backend Endpoints
- **Admin Dashboard**: Visible only to hardcoded admin wallet
  - Display admin wallet balance + SolReserve vault balance
  - Button to fund vault (calls backend)
  - Button to add relayer (calls backend)
  - Button to set top10 (calls backend)
- **Backend Endpoints** (Express or similar):
  - `POST /api/admin/init-platform` → calls onchain `init_platform`
  - `POST /api/admin/fund-vault` → calls onchain `fund_vault`
  - `POST /api/admin/add-relayer` → calls onchain `add_relayer`
  - `POST /api/actions/reputation` → calls onchain `apply_reputation_action` (used by Anup + Samit)
  - `POST /api/admin/set-top10` → calls onchain `set_top10`
- **Octane Integration**: Add Octane as authorized relayer on devnet

#### E. Event ID Generation & Idempotency
- Event IDs must be unique per scoreable action (recommend: `blake3(content_id || action || timestamp)`)
- No user-supplied arbitrary points; all points from onchain constants
- Replay protection: same event_id = rejected by onchain program (ActionReceipt PDA)

#### F. Deployment Sequence
1. Test locally (localnet + backend script)
2. Deploy to devnet (update program ID in anchor.toml + lib.rs)
3. Admin wallet inits platform on devnet (different PDAs than localnet)
4. Fund vault + add Octane relayer
5. Integrate backend endpoints with Anup + Samit

### Key Constraints
- Relayer always pays TX fee; reimbursed from SolReserve
- Points must come from onchain action mapping (not user input)
- All instructions must be secure: signer checks, ownership checks, seed validation
- Emit events for reputation updates (for debugging + frontend listening)

---

## Task 4: Swastik — Homepage & Navigation

### Homepage Changes

#### Remove
- All DAO-related content (platform is now consumer-centric)
- NFT UI/text (devnet NFTs have no value)
- Privacy policy, Terms & Conditions, Cookies policy links

#### Add/Improve
1. **Hero Section**: Explain StudyColosseum purpose (peer-to-peer study + merit rewards)
2. **Leaderboard Section**: 
   - Display top 10 users (from onchain `set_top10`)
   - Keep visually compact (not full-screen)
   - Just below leaderboard: If user logged in, show their points + badge tier; if not, keep breathing room
3. **Badge Tiers Explanation** (replaces NFT section):
   - Spark: 0–99 points
   - Current: 100–349 points
   - Core: 350–799 points
   - Supernova: 800–1499 points
   - Singularity: 1500+ points AND top10=true
4. **Points Distribution Table**:
   - Show point awards for each action (uploads, upvotes, answers, etc.)
   - Make it visually scannable (cards or table)
5. **Platform Naming**: 
   - Rename to **StudyColosseum or something cool name if u want** (ties to hackathon; implies merit-based ranking)

#### Navigation Changes
- Move "Programs" from navbar → Programs menu (glowing, to attract users) in top-left corner, just below the logo under the navbar 
- **Hierarchy**: Programs > Program Names (CSIT/BCA) > Semesters > Subjects
- Each level shows ">" indicator; clicking expands to "^" (inverted)
- Long names use "..." truncation (e.g., "Data Structure And...")
- Design inspired by Solana Docs sidebar
- When menu opens, homepage blurred (Gaussian blur, semi-transparent)
- Menu is dismissable (click outside or X button)

#### Rules & Regulations
- Remove all policy text
- Add link to "Rules & Regulations" (rules only, no privacy/cookies)
- Rules popup shows once on first login (Bijesh handles this via auth state)

### Tech Stack
- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion (for hamburger/hierarchy expand/collapse)
- **Icons**: Lucide React or similar

### What You Need from Bijesh
- User's onchain reputation (`getReputation(wallet)` call to `/api/user/{wallet}/reputation`)
- Top 10 leaderboard data (`getTopTenUsers()`)
- Auth context indicating if user is logged in + their wallet address
- **Do NOT handle authentication** — Bijesh manages Magic Link auth

### Constraints
- **Do NOT modify onchain program** — Bijesh's responsibility
- **Coordinate with Bijesh** on auth state + user reputation display

---

## Integration Touchpoints

### Anup → Bijesh
- Generate event ID for each upvote/downvote: `blake3(post_id || "upvote" || timestamp)`
- Call Bijesh's `submitReputationAction()` utility
- Display upvote count + post author's badge

### Samit → Bijesh
- Generate event IDs for question/answer/upvote/accept events
- Call Bijesh's `submitReputationAction()` utility
- Display answer author's badge + marked accepted status
- Handle accept button state (disabled after limit or acceptance)

### Bijesh → All
- Provide utility library (auth, reputation fetch, leaderboard fetch)
- Provide backend endpoints for reputation sync
- Provide admin dashboard UI component

### Swastik → Bijesh
- Call `getReputation(wallet)` to display user's points + badge below leaderboard
- Call `getTopTenUsers()` to populate leaderboard
- Receive auth context indicating logged-in status

---

## Deployment Phases

### Phase 1: Localnet Testing (Bijesh)
- Deploy program locally
- Run test script: all 5 instructions pass
- Verify no replay attacks, unauthorized access, or invalid claims
- Estimate: 2–3 days

### Phase 2: Devnet Deployment (Bijesh)
- Deploy program to devnet
- Admin wallet inits platform
- Fund vault + add Octane
- Estimate: 1 day

### Phase 3: Integration (Anup + Samit + Bijesh)
- Backend endpoints live
- Anup integrates upvote/downvote submission
- Samit integrates question/answer/accept submission
- Estimate: 3–5 days

### Phase 4: Frontend Integration (Swastik + All)
- Leaderboard + reputation display live
- Admin dashboard visible to admin wallet
- Full end-to-end: user action → reputation sync → leaderboard update
- Estimate: 2–3 days

### Phase 5: Launch & Monitoring
- Rules & Regulations popup on first login
- Monitor relayer fund depletion + top10 accuracy
- Handle edge cases discovered post-launch

---

## Key Details by Role

### Answer Acceptance Logic (Samit)
- Question owner can accept **up to 1 answer max** (scarcity = prestige)
- Once 1 answer marked accepted, disable accept button on others
- Accepted answer gets permanent "Accepted" badge
- Future: Allow moderator role to accept (if needed)

### Anonymous Posting (All)
- Frontend UI toggle: "Post anonymously"
- No onchain changes; purely frontend obfuscation
- Author's wallet still synced to onchain event (for reputation)

### Comments Section (Anup)
- Optional; text-only, no voting
- Not synced onchain (local Firestore storage)
- No relayer/reputation mechanic

### Reply Chains (Samit)
- Real-time chat under each answer (Supabase Realtime)
- Text-only, no voting or scoring
- Not synced onchain
- Stored in Supabase only

---

## Quick Checklist Before Launch

- [ ] Bijesh: All 5 onchain instructions tested locally + deployed to devnet
- [ ] Bijesh: Backend utility library + endpoints live
- [ ] Bjesh: Magic Link + Octane relayer configured
- [ ] Anup: Notes/Lab Reports feed UI complete + Firestore storage working
- [ ] Anup: Upvote/downvote submission calling Bijesh's utilities
- [ ] Samit: QnA feed UI complete + Supabase storage working
- [ ] Samit: Question/answer/accept submission calling Bijesh's utilities
- [ ] Swastik: Homepage redesign complete + navigation hierarchy working
- [ ] Swastik: Leaderboard + user reputation display pulling from Bijesh's API
- [ ] All: End-to-end flow tested (upload → reputation sync → leaderboard update)
- [ ] All: Error handling & empty states tested on all components
- [ ] Bijesh: Rules & Regulations popup gates first-time login

---

## Questions & Decisions

**Q: What should the platform be named?**
**A:** **StudyColosseum** (recommended). Ties to hackathon, implies merit-based ranking. Alternative: StudyVault.

**Q: How many answers can be marked accepted?**
**A:** **1 per question (max).** Drives prestige and clarity. Future: can increase to 3 if needed.

**Q: Should comments on notes/lab reports have upvote/downvote?**
**A:** **No.** Text-only, no scoring. Keeps UI simple and avoids onchain complexity.

**Q: Should reply chains in QnA have voting?**
**A:** **No.** Text-only, no upvote/downvote. Avoids onchain bloat and keeps focus on main answers.

**Q: Why no downvote for QnA questions/answers?**
**A:** Psychological safety. Downvotes discourage participation. Neutral (no vote) suffices. Downvotes only apply to upload posts (notes/lab reports).

**Q: Who can mark an answer accepted?**
**A:** Question owner (MVP). Future: moderator role may also be able to mark (if added).

**Q: Is anonymous posting an onchain feature?**
**A:** No. Frontend UI only. User's wallet still synced onchain for reputation (author hidden from UI, not blockchain).

---

**Last Updated**: Phase 3 Kickoff
**Team**: Anup (Notes/Lab Reports), Samit (QnA), Bijesh (Solana), Swastik (Frontend)
