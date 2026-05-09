# EduChain — Technical Stack & Architecture

---

## 1. Frontend Stack

### Framework
- **React** (JavaScript, not TypeScript)
- **Vite** (build tool for speed)
- **Tailwind CSS** (styling)
- **Framer Motion** (animations, hamburger menu)

### Key Libraries
- **Magic Link**: Authentication (email-based custodial wallets)
- **Appwrite SDK**: File uploads (notes, lab reports)
- **Supabase JS Client**: Real-time Q&A sync
- **Solana Web3.js**: Blockchain interaction (read balances, leaderboard)
- **React Query**: Data fetching + caching

### Components
- **Feed Display**: Lazy-loaded posts (notes, lab reports, Q&A)
- **Upload Modal**: File selection + compression preview
- **Leaderboard**: Top 10 users + user's current points/badge
- **Admin Dashboard**: Visible only to admin wallet
- **Hierarchy Menu**: Programs (CSIT/BCA) → Semesters → Subjects

---

## 2. Backend Stack

### Runtime
- **Node.js** (JavaScript runtime)
- **Express** (HTTP API framework)

### Core Libraries
- **@solana/web3.js**: Blockchain interaction
- **@project-serum/anchor**: Anchor program interaction
- **dotenv**: Environment variable management
- **cors**: Cross-origin request handling

### APIs & Utilities

#### Reputation Service
```javascript
submitReputationAction(user, actionType, eventId)
  - Calls apply_reputation_action on Solana
  - Handles retries + error logging
  - Returns transaction signature
```

#### User Fetching
```javascript
getUserReputation(wallet)
  - Reads UserReputation PDA from chain
  - Returns: points, badge_tier, is_top10, counters
```

#### Leaderboard
```javascript
getTopTenUsers()
  - Fetches all UserReputation accounts
  - Sorts by points DESC
  - Returns top 10 with badges
```

#### Admin Functions (Protected)
```javascript
initPlatform(adminWallet, initialFunding)
  - Creates Platform + SolReserve accounts
  - One-time setup
  
fundVault(adminWallet, solAmount)
  - Tops up SolReserve for relayer reimbursement
  
addRelayer(adminWallet, relayerPubkey)
  - Adds new authorized relayer
  
setTop10(adminWallet, userWallets)
  - Marks users for top10 leaderboard + Singularity badge
```

### Deployment
- **Hosting**: Vercel (Backend as serverless functions) or self-hosted Node.js
- **Environment**: Devnet (testing) → Mainnet (production)

---

## 3. Blockchain Stack

### Smart Contracts
- **Language**: Rust
- **Framework**: Anchor (simplifies Solana smart contract development)
- **Network**: Solana (devnet first, then mainnet)

### Program Instructions

| Instruction | Signer | Purpose |
|-------------|--------|---------|
| `init_platform` | Admin | Create Platform + SolReserve (one-time) |
| `fund_vault` | Admin | Deposit SOL for relayer reimbursement |
| `add_relayer` | Admin | Add authorized relayer to Vec |
| `apply_reputation_action` | Relayer | Score user action + update reputation |
| `set_top10` | Admin | Mark top 10 users + unlock Singularity tier |

### Account Structures

**Platform**
```rust
pub struct Platform {
    pub authority: Pubkey,                    // Admin wallet
    pub authorized_relayers: Vec<Pubkey>,    // List of relayers (max 20)
    pub total_users_count: u64,
    pub total_reputation_distributed: u64,
}
```

**SolReserve**
```rust
pub struct SolReserve {
    pub platform: Pubkey,
    pub total_inflow: u64,      // Total SOL deposited
    pub total_outflow: u64,     // Total SOL paid to relayers
}
```

**UserReputation**
```rust
pub struct UserReputation {
    pub wallet: Pubkey,
    pub reputation_score: u64,
    pub badge_tier: u8,                      // 0–4 (Spark to Singularity)
    pub is_top10: bool,
    pub total_notes_uploads: u32,
    pub total_lab_reports_uploads: u32,
    pub total_questions: u32,
    pub total_answers: u32,
    pub total_accepted_answers: u32,
    pub founding_member_bonus_claimed: bool, // One-time
    pub current_login_streak_days: u32,
}
```

**ActionReceipt** (Replay Protection)
```rust
pub struct ActionReceipt {
    pub event_id: [u8; 32],  // blake3 hash (unique per action)
    pub points_delta: i32,   // Points awarded/deducted
    pub timestamp: i64,
}
```

### Program ID & Deployment
- **Mainnet Program ID**: TBD (to be deployed post-testing)
- **Devnet Program ID**: TBD (deployed first for testing)
- **Local Program ID**: TBD (localnet)

---

## 4. Storage Stack

### Appwrite (File Storage)
- **What**: Notes, lab reports, past papers
- **Structure**: 
  - Original file (full quality)
  - Compressed file (preview)
- **Access**: Authenticated users only
- **CDN**: Appwrite built-in CDN for fast delivery

### Supabase (Real-Time Q&A)
- **What**: Question posts, answers, reply chains
- **Tables**:
  - `questions`: post_id, user_wallet, title, content, created_at
  - `answers`: answer_id, question_id, user_wallet, content, accepted, created_at
  - `replies`: reply_id, answer_id, user_wallet, content, created_at
- **Real-Time**: WebSocket listeners for new answers/replies
- **Access**: Row-level security (RLS) for user data

### On-Chain State (Solana)
- **UserReputation PDAs**: Reputation scores, badge tiers (immutable, auditable)
- **ActionReceipt PDAs**: Proof of scored actions (replay protection)
- **Platform PDA**: Admin config + authorized relayers

---

## 5. Authentication & Authorization

### User Auth (Magic Link)
```
Email → Magic Link → Custodial Wallet → Solana Pubkey
```
- Users don't manage private keys
- Email-based login for familiar UX
- Backend gets user's Solana wallet from Magic Link session

### Admin Auth
```
Hardcoded ADMIN_WALLET constant
↓
Check if user's wallet === ADMIN_WALLET
↓
If true, show admin dashboard + unlock admin endpoints
```

### Relayer Auth (Solana Program Level)
```
Relayer submits transaction
↓
Smart contract checks: is_relayer_authorized?
↓
Authorized relayers stored in Platform.authorized_relayers Vec
↓
If authorized, process transaction + reimburse relayer
```

---

## 6. Data Flow (User Uploads Note)

```
1. User logs in via Magic Link
   ↓
2. User clicks "Upload Note"
   ↓
3. Frontend shows upload modal
   - Select file (PDF, DOCX, PPT)
   - Select chapter/subject filter
   - Preview compressed version
   ↓
4. User submits
   ↓
5. Frontend uploads to Appwrite
   - Store original + compressed versions
   ↓
6. Backend generates event_id
   - blake3(file_id || "upload_note" || timestamp)
   ↓
7. Backend calls apply_reputation_action on Solana
   - Relayer signs transaction
   - User's wallet passed as instruction param
   ↓
8. Smart contract processes:
   - Derive UserReputation PDA from user wallet
   - Check ActionReceipt (already scored?)
   - If new → Create ActionReceipt, add +10 points
   - Update badge tier if points crossed threshold
   - Transfer reimbursement to relayer from SolReserve
   ↓
9. Program emits ReputationUpdated event
   ↓
10. Frontend listens + updates:
    - User's points display
    - User's badge tier display
    - Post count in profile
    ↓
11. Leaderboard updates (real-time via listener)
```

---

## 7. Deployment Topology

### Localnet (Local Machine)
- Solana validator (local)
- Program deployed locally
- Backend connects to localnet RPC
- For testing only

### Devnet (Solana Labs)
- Solana network (persistent, resets nightly)
- Program deployed to devnet
- Real testing (multi-user, relayers)
- Pre-launch validation

### Mainnet (Production)
- Solana network (permanent)
- Program deployed to mainnet
- Real users, real SOL
- Long-term platform

---

## 8. Security Measures

### Smart Contract Level
- **Replay Protection**: ActionReceipt PDAs prevent double-scoring
- **Signer Checks**: Only authorized relayers can call scoring functions
- **Owner Checks**: Users can only modify their own reputation accounts
- **Seed Constraints**: PDA derivation prevents account confusion

### Backend Level
- **API Authentication**: Admin endpoints require Magic Link session
- **Rate Limiting**: Prevent spam reputation submissions
- **Input Validation**: Event IDs, points, user wallets validated
- **Error Logging**: All failures logged for debugging

### Frontend Level
- **CORS**: Restrict API calls to authorized domains
- **Session Expiry**: Magic Link sessions expire after inactivity
- **XSS Prevention**: Sanitize all user inputs before display

---

## 9. Performance Optimizations

| Optimization | Where | Why |
|---|---|---|
| Lazy Loading | Feed (Notes, Lab Reports, Q&A) | Load only visible posts |
| Compressed Previews | File uploads | Fast preview without full download |
| Image CDN | Appwrite built-in | Global fast file delivery |
| Caching | React Query | Reduce API calls |
| Index Leaderboard | Solana Program | Fast top10 lookups |
| PDA Derivation | Client-side | Avoid extra RPC calls |

---

## 10. Monitoring & Maintenance

### Metrics to Track
- Program execution time (per instruction)
- Relayer reimbursement costs
- SolReserve balance (alert if low)
- Active users (daily, monthly)
- Reputation distribution (fairness check)

### Regular Maintenance
- **Weekly**: Check relayer fund levels, top10 accuracy
- **Monthly**: Update top10 leaderboard via `set_top10`
- **Quarterly**: Audit replay protection, badge calculations

---

## Summary

EduChain's tech stack prioritizes:
- ✅ **Simplicity**: React + JS, no TypeScript complexity
- ✅ **Speed**: Solana for low-latency scoring
- ✅ **Security**: On-chain replay protection + admin auth
- ✅ **Scalability**: Agentic contract handles unlimited users
- ✅ **User Experience**: Magic Link + zero gas friction

This is a production-ready architecture for a Web3 education platform.
