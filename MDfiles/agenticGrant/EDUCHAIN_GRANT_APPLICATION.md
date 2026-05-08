# EduChain — Agentic Engineering Grant Application

**Superteam Agentic Engineering Grant**  
**Submitted by**: Bijesh-09 (Team Lead)  
**Project**: EduChain  
**Date**: May 4, 2026

---

## 1. Executive Summary

**EduChain** is a Solana-powered peer-to-peer study resource platform where students earn on-chain reputation for knowledge-sharing. We use agentic automation and intelligent routing to solve education fragmentation while maintaining zero friction for users.

**Problem**: TU CSIT students waste 2-5 hours searching for past papers, notes, and answers across 50+ WhatsApp groups. 30% can't find resources when needed. Knowledge disappears when seniors graduate.

**Solution**: Decentralized platform with:
- **Automated reputation scoring** via Solana smart contracts
- **Intelligent feed routing** (Notes, Lab Reports, Q&A)
- **Community-driven quality control** (upvote/downvote)
- **Relayer-abstracted transactions** (users don't pay gas)
- **Merit-based leaderboarding** (top 10 contributors + 5-tier badges)

**Agentic Innovation**: Smart contracts autonomously track user actions, calculate reputation, assign badges, and reimburse relayers—no manual admin intervention after setup.

---

## 2. Problem Statement

### 2.1 Fragmentation Crisis
- **50+ WhatsApp groups** with no central archive
- Past exam papers **lost in 1000+ messages** per group
- Google Drive links **expire after graduation**
- **No quality signal**: Can't tell which notes are reliable
- **No incentive alignment**: Smart students answer same questions repeatedly

### 2.2 User Impact
- Students spend **2-5 hours** finding resources (vs. 10 seconds ideal)
- **30% can't find resources** when needed (exam prep risk)
- **Knowledge decay**: Seniors delete drives; resources vanish
- **Unequal access**: Resources hoard in friend groups, not institution-wide

### 2.3 Institutional Impact
- **Redundant Q&A**: Same questions asked every semester
- **No institutional memory**: Knowledge doesn't compound
- **No way to identify top contributors**: Can't recognize quality helpers

---

## 3. Solution: EduChain Platform

### 3.1 Core Features

#### **3 Feeds for Knowledge Sharing**
1. **Notes Feed**: Upload semester-specific study notes (PDF, DOCX, PPT)
   - Organized by chapter/subject/semester
   - Compressed file preview + original download
   - Community upvote/downvote for quality

2. **Lab Reports Feed**: Share completed assignments & solutions
   - Similar to Notes (filters, uploads, voting)
   - File compression for performance

3. **Q&A Feed**: Stack Overflow-style questions & answers
   - Post questions → Get answers (real-time)
   - Mark best answer (question owner)
   - Reply chains (text-only, no voting)

### 3.2 Reputation & Gamification

**Point System** (automated via Solana):
- Upload past paper: **+15 pts** (rarest, highest demand)
- Upload notes/lab report: **+10 pts** (standard)
- Post answer: **+10 pts** (encourage participation)
- Answer marked accepted: **+20 pts** (quality bonus)
- Upvote received: **+5 pts** (upload) / **+2 pts** (answer)
- Question posted: **+1 pt** (engagement)
- Downvote received: **-2 pts** (light penalty)

**5-Tier Badge System** (Elemental Knowledge):
- **Spark** (0–99 pts): Initial contribution
- **Current** (100–349 pts): Steady helper
- **Core** (350–799 pts): Reliable source
- **Supernova** (800–1499 pts): Massive impact
- **Singularity** (1500+ pts + top10): Ultimate contributor

**Top 10 Leaderboard**: Monthly recognition for highest contributors

### 3.3 User Experience (Zero Crypto Friction)
- **Email login via Magic Link** (no wallet complexity)
- Users don't pay gas fees (relayer model)
- Blockchain reputation is **visible but abstracted**
- All actions feel like Web2 (smooth UX)

---

## 4. Agentic Engineering Implementation

### 4.1 What Makes This Agentic?

**Autonomous Reputation Scoring**:
- Smart contract **automatically calculates points** based on action type
- No admin manually reviews or awards points
- **Replay-attack prevention**: ActionReceipt PDAs ensure idempotency
- **Self-healing incentives**: Badge tier progression is deterministic (no intervention needed)

**Intelligent Relayer Network**:
- Multiple authorized relayers (Octane + custom relayers)
- Smart contract **automatically reimburses** relayers from SolReserve
- Admin doesn't manually manage each transaction
- **Fee abstraction**: Users feel gasless (relayer front-loads, contract pays back)

**Automated Leaderboard Management**:
- Admin calls `set_top10` once per month
- Contract **automatically flags** users in top 10 + eligible for Singularity badge
- Badge upgrades happen automatically when points cross thresholds

**Event-Driven Architecture**:
- Every user action (upload, upvote, answer, accept) generates **unique ActionReceipt PDA**
- Prevents double-counting (idempotency built-in)
- Backend doesn't need complex state management—contract enforces truthfulness

### 4.2 Why Agentic Matters

**Without Agentic Design** (Manual):
- Admin manually awards points → error-prone, unfair
- Admin manages every relayer transaction → bottleneck
- Duplicate claims require manual audit → expensive
- Badge assignment needs admin review → not scalable

**With Agentic Design** (EduChain)**:
- ✅ Points awarded automatically by contract rules
- ✅ Relayer network self-manages via smart contract
- ✅ Replay protection is cryptographic (unhackable)
- ✅ Badge progression is algorithmic (fair, transparent)
- ✅ Scales to 10,000+ users with zero added overhead

---

## 5. Technical Architecture

### 5.1 Tech Stack

| Component | Technology | Why |
|-----------|-----------|-----|
| **Frontend** | React + JavaScript | Fast iteration, large team support |
| **Backend** | Node.js + Express | Real-time APIs, relayer coordination |
| **Blockchain** | Solana (Anchor) | Low-cost, high-speed, agentic-friendly |
| **Smart Contracts** | Rust (Anchor framework) | Type-safe, auditable, deterministic |
| **Storage** | Appwrite | Open-source, self-hosted, no billing concerns |
| **Auth** | Magic Link | Custodial wallets, email login, seamless UX |
| **Real-Time** | Supabase (Q&A sync) | WebSocket support, persistent connections |

### 5.2 Data Flow

```
User Action (Upload/Upvote/Answer)
    ↓
Frontend generates event_id: blake3(content_id || action || timestamp)
    ↓
Backend calls apply_reputation_action (relayer-signed)
    ↓
Solana Smart Contract:
  - Derives ActionReceipt PDA from event_id
  - If PDA exists → REJECT (replay protection)
  - If new → CREATE ActionReceipt PDA
  - Fetch user's UserReputation account
  - Add points based on action type (from constants)
  - Check badge tier thresholds
  - Update UserReputation account
  - Transfer reimbursement to relayer from SolReserve
  - Emit ReputationUpdated event
    ↓
Frontend listens for event
    ↓
Update leaderboard, badge display, points balance
```

### 5.3 Smart Contract Accounts

| Account | Owner | Purpose |
|---------|-------|---------|
| **Platform** | Admin | Central config (authority, relayers, user count) |
| **SolReserve** | Admin | Holds SOL for relayer reimbursement |
| **UserReputation** | User | Stores points, badge tier, contribution counters |
| **ActionReceipt** | Program | Immutable record of scored action (replay protection) |

---

## 6. Deployment & Launch

### 6.1 Phase Timeline

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| **Phase 1: Localnet Testing** | 3–5 days | All 5 instructions tested, replay protection verified |
| **Phase 2: Devnet Deploy** | 1–2 days | Program deployed, admin inits platform, fund vault |
| **Phase 3: Team Integration** | 3–5 days | Backend endpoints live, frontend integrated |
| **Phase 4: E2E Testing** | 2–3 days | User action → reputation → leaderboard verified |
| **Phase 5: Mainnet Ready** | 1 day | Final audit + Go/No-Go decision |

### 6.2 Go-to-Market

**Target Users**: TU CSIT students (500–5000 active)  
**Incentive**: Free platform + reputation badges  
**Adoption Strategy**: Announce at TU + partner WhatsApp groups  
**Retention**: Leaderboard + monthly top10 recognition

---

## 7. Why Agentic Engineering Wins Here

### 7.1 Scalability
- Manual reputation = bottleneck at 100 users
- Agentic reputation = scales to 100,000 users for same cost

### 7.2 Security
- Agentic idempotency (ActionReceipt PDAs) prevents exploit attacks
- Manual validation = humans make mistakes
- Smart contract = cryptographic guarantees

### 7.3 User Trust
- Transparent, algorithmic scoring (no hidden admin bias)
- Blockchain proves fairness (immutable, auditable)
- Reputation is portable (user owns it)

### 7.4 Developer Velocity
- Once deployed, no admin work needed (set-and-forget)
- Team focuses on frontend + user acquisition
- Smart contract handles all backend reputation logic

---

## 8. Success Metrics (By Launch)

| Metric | Target | Why It Matters |
|--------|--------|---|
| Users registered | 50–100 | Proof of concept validation |
| Files uploaded | 50+ | Resource library viability |
| Q&A posts | 50+ | Engagement signal |
| Community votes | 100+ | Upvote/downvote participation |
| Avg. points/user | 50+ | Reputation system active |
| Smart contract uptime | 99.9% | Agentic reliability |
| Zero replay attacks | 100% | Security verification |

---

## 9. Why We Need This Grant

**AI + Agentic Automation** powers EduChain's core innovation:
- ✅ Smart contract logic is **AI-assisted** (generated + audited by Claude)
- ✅ Backend utilities are **AI-scaffolded** (relayer coordination, event routing)
- ✅ Frontend is **AI-accelerated** (component generation, feed optimization)

This grant enables:
1. **Faster deployment** (AI speeds up contract testing + iteration)
2. **Better security** (AI-driven audit + vulnerability detection)
3. **Scalable infrastructure** (AI handles edge cases before launch)
4. **Team leverage** (4 students can punch above their weight with agentic tools)

**Without this grant**: Estimated 2–3x slower development, higher risk of bugs.

---

## 10. Team & Commitment

**Team**: 4 TU BSc CSIT students (3rd semester)  
**Founder Fit**: We ARE the target users (built for ourselves first)  
**Timeline**: Deployed by May 11, 2026 (Colosseum Frontier Hackathon)  
**Post-Hackathon**: Maintain platform for TU community (long-term)

---

## Conclusion

**EduChain** demonstrates how **agentic engineering transforms education**:
- **Smart contracts** autonomously score reputation
- **Relayer networks** eliminate user friction
- **Community feedback** ensures quality
- **Blockchain** guarantees fairness & portability

We're not just building an app—we're building an **autonomous, fair, scalable** institution for knowledge-sharing.

**Vote: Yes ✅ to fund the future of student collaboration.**

---

**Contact**: bijesh-09 (GitHub)  
**Repository**: study_dao_vault (GitHub)  
**Live Demo**: TBD (devnet link post-deployment)
