# Study DAO - Solana Implementation Plan (14 Days)

## Overview
Build gasless on-chain reputation system for Study DAO with Magic Link authentication. 4 team members: UI, Notes Sharing, Q&A Features, and Solana (you). Last 3-4 days reserved for pitch/video/report.

## Realistic Timeline
- **Working Days Available:** ~10-11 days (reserve last 3-4 for pitch prep)
- **Estimated Effort:** 60-70 hours core, ~75-90 realistic with contingencies
- **Daily Commitment:** 4-6 hours/day (doable with proper sleep)

---

## Phase Breakdown & Schedule

### Phase 1: Anchor Setup (Days 1-3)
**Objective:** Get boilerplate right. Everything waits for this.

**Tasks:**
- Initialize Anchor project (`anchor init tu-study-dao`)
- Setup Cargo.toml with dependencies
- Configure Anchor.toml (cluster = devnet)
- Setup .env with keypairs, RPC endpoints
- Verify build works: `anchor build` (0 errors)

**Time:** 8-10 hours
**Risk:** MEDIUM (Rust/Anchor learning curve)
**Blocker:** If compilation fails, nothing else works

---

## Phase 2: Core On-Chain Logic (Days 4-7)
**Objective:** Build immutable reputation system + gasless mechanism.

#### Days 4-5: Platform & SolReserve PDAs (2 days, 6h)
- Define `Platform` PDA (singleton, admin authority)
- Define `SolReserve` PDA (vault with seed derivation)
- Write `init_platform()` instruction
- Write `fund_vault()` instruction
- Test locally with anchor test

#### Days 5-6: UserReputation PDA & claim_reputation (2 days, 8h)
- Define `UserReputation` struct (reputation_score, uploads, answers, last_claim)
- Implement `claim_reputation()` instruction
- Account validation & state updates
- Emit `ReputationClaimed` event
- Test: create PDA → claim points → verify state

#### Day 7: Vault CPI Transfer (1 day, 6h)
- **THE CRITICAL PART:** Implement CPI from claim_reputation to SolReserve
- Use `invoke_signed` to transfer SOL from vault to Relayer (fee reimbursement)
- Add fee estimation (fixed: 5,000 lamports for MVP)
- Test: Verify Relayer account balance increases after claim

**Phase 2 Total:** 20-24 hours
**Risk:** HIGH (CPI transfer is tricky, needs extensive testing)
**Key Insight:** SolReserve is a PDA owned by program → program can sign on its behalf

---

## Phase 3: Badges & Gamification (Days 8-9)
**Objective:** Unlock badges when reputation milestones hit.

**Tasks:**
- Define `Badge` PDA struct (badge_type, awarded_at, user_wallet)
- Implement `mint_badge()` instruction
- Setup thresholds (50 points = Bronze, 100 = Silver)
- Auto-trigger badge minting when user hits threshold
- Test: Claim 50 points → Bronze badge auto-awarded

**Time:** 6-8 hours
**Risk:** LOW (simple CRUD on PDA)
**MVP Optimization:** Skip real NFT minting. Just store metadata. Add Metaplex cNFTs post-hackathon.

---

## Phase 4: Backend Relayer (Days 10-12)
**Objective:** Connect Anchor program to Express backend.

#### Day 10: Transaction Builder Setup (1.5 days, 2-3h)
- Generate Anchor IDL from program
- Setup `/api/claim-reputation` endpoint
- Build unsigned transaction using Anchor client
- Call `getSimulationUnits` for fee estimation
- Load Relayer keypair from .env
- Check SolReserve balance before proceeding

#### Day 11: Relayer Signing & Broadcasting (1.5 days, 4h)
- Add Relayer keypair signing as fee payer
- Broadcast to devnet with retry logic
- Error handling (vault depleted, simulation failed, invalid wallet)
- Comprehensive logging for audit trail
- Test: Call endpoint → transaction on devnet explorer

**Phase 4 Total:** 12-16 hours
**Risk:** MEDIUM (web3.js API calls can be finicky)
**Blocker:** UI team needs this by Day 11

---

## Phase 5: Integration & Full Testing (Days 12-13)
**Objective:** Connect frontend ↔ backend ↔ on-chain.

#### Day 12: PDA ↔ Supabase Sync (1 day, 3h)
- Setup sync service (cron every 10s OR Helius webhook)
- Query UserReputation PDAs from devnet
- Upsert to Supabase users table
- Create `reputation_transactions` audit log table
- Test: Claim on-chain → sync within 10s → verify Supabase

#### Day 13: Full End-to-End Testing (1 day, 3-4h)
- Coordinate with UI team: Magic login → upload → claim → see rep on profile
- Test with 3-4 teammates simultaneously
- Find integration bugs
- Fix blocking issues

**Phase 5 Total:** 8-10 hours
**Risk:** HIGH (depends on other teams being ready)
**Critical:** This is your first real test with the full system

---

## Phase 6: Polish & Debugging (Days 13-14)
**Objective:** Make system robust for demo.

**Tasks (parallel with Phase 5):**
- Error handling & edge cases (vault depleted, rate limiting, double-spend)
- Load testing (10 users claiming simultaneously)
- Monitor Relayer account balance
- Optimize PDA queries
- Fix bugs found during testing
- Document setup steps for team

**Time:** 6-10 hours
**Risk:** VARIABLE (depends on bugs that surface)
**Advice:** Budget extra time. Real bugs always emerge.

---

## Anchor Program Structure

```
programs/tu-study-dao/src/
├── lib.rs                    (~50 lines: entry point)
├── state.rs                  (~120 lines: Platform, SolReserve, UserReputation, Badge)
├── instructions/
│   ├── mod.rs
│   ├── init_platform.rs      (~60 lines)
│   ├── fund_vault.rs         (~50 lines)
│   ├── claim_reputation.rs   (~150 lines: core logic + CPI)
│   └── mint_badge.rs         (~100 lines)
└── events/
    └── mod.rs                (~30 lines: ReputationClaimed event)

tests/integration.rs          (~300-400 lines of tests)
```

**Total:** ~600-700 lines of Rust + ~300-400 lines of tests

---

## Critical Path (What Blocks What)

```
Days 1-3: Anchor Setup
   ↓
Days 4-5: Platform + SolReserve PDAs
   ↓
Days 5-6: UserReputation + claim_reputation
   ↓
Day 7: Vault CPI Transfer
   ↓
Days 10-11: Relayer Backend
   ↓
Day 12: Supabase Sync
   ↓
Day 13: Full Integration Test
   ↓
Day 14: Ready for Demo
```

**Days 8-9 (Badges)** can run in parallel without blocking.

---

## Features Depending on On-Chain

✅ **Reputation System:** UserReputation PDA → Supabase leaderboard
✅ **Gasless Transactions:** Vault CPI reimbursement
✅ **Badges/Achievements:** Auto-award at milestones
✅ **Upload Incentives:** Notes team calls `/api/claim-reputation` (+10 points)
✅ **Q&A Incentives:** Q&A team calls `/api/claim-reputation` (+5 per upvote)

---

## Infrastructure Setup Checklist

Before Day 1:

- [ ] Install Rust: `https://www.rust-lang.org/tools/install`
- [ ] Install Solana CLI: `https://docs.solana.com/cli/install-solana-cli`
- [ ] Install Anchor: `npm install -g @coral-xyz/anchor-cli`
- [ ] Verify: `anchor --version` (0.29.0+)
- [ ] Generate admin keypair: `solana-keygen new`
- [ ] Get 5 SOL: Request from team or faucet
- [ ] Get Helius API key: `https://www.helius.dev/` (free tier)
- [ ] Create .env with: RELAYER_SECRET_KEY, ADMIN_WALLET, HELIUS_API_KEY

---

## Team Coordination Points

- **Day 9:** Chat with UI team about when they need `/api/claim-reputation`
- **Day 10:** Provide test endpoint for UI team to integrate against
- **Day 12:** Full integration test with all teammates present
- **Day 13:** Demo practice with full flow

---

## Contingencies & Risk Mitigation

| Task | Risk | Mitigation |
|------|------|-----------|
| Anchor Setup | MEDIUM | Start Day 0, pair with teammate |
| CPI Transfer | HIGH | Test extensively, ask for help if stuck >1h |
| Supabase Sync | HIGH | Prepare schema early, cache in Redis if slow |
| Full Integration | HIGH | Mock endpoints for UI team if backend late |

---

## Time Estimates

- **Core On-Chain:** 60-70 hours
- **Realistic Total:** 75-90 hours (includes contingencies)
- **Per Day:** 4-6.5 hours (manageable)

---

## Key Decisions to Make Now

1. **Sync method:** Helius webhook or cron polls? (MVP: cron)
2. **Fee model:** Fixed (5k lamports) or variable? (MVP: fixed)
3. **NFT badges:** Real NFTs or metadata only? (MVP: metadata)
4. **Reputation amounts:** +10 for upload, +5 per upvote? (Confirm with team)

---

## Done When

✅ Anchor program compiles with 0 errors
✅ All instructions tested locally (`anchor test` passes)
✅ `/api/claim-reputation` endpoint working on devnet
✅ Reputation synced to Supabase within 10 seconds
✅ Full end-to-end flow tested with teammates
✅ System handles edge cases (vault depleted, rate limiting, etc.)
✅ Ready for demo day with no critical bugs

---

## Notes

- **Most Critical Task:** Vault CPI Transfer (Day 7). This is what makes it "gasless." Spend extra time here.
- **Biggest Risk:** Team coordination on Day 12. Have UI team ready to test at 11:00 AM, not 5:00 PM.
- **Quick Wins:** Badges are low-risk. Implement first if you get ahead of schedule.
- **Avoid:** Skip Metaplex cNFTs, custom serialization, over-optimization. Get it working first, optimize later.

---

## Quick Reference: What to Do Right Now

**Before Day 1:**

- [ ] Install Rust
- [ ] Install Solana CLI
- [ ] Install Anchor
- [ ] Generate keypairs
- [ ] Get Helius API key
- [ ] Ask team: When do you need `/api/claim-reputation`?
- [ ] Ask team: What reputation amounts per action?
- [ ] Create git repo for program
- [ ] Create .env template

**Day 1 Goal:** Have `anchor build` compile with 0 errors

**By Day 7:** Have CPI transfer working and tested

**By Day 10:** Have `/api/claim-reputation` endpoint returning 200

**By Day 13:** Have full flow working end-to-end

---

Good luck! 🚀
