# EduChain — Implementation Roadmap & Deployment Plan

---

## 1. Development Timeline (25 Days)

### Phase 1: Smart Contract Foundation (Days 1–7)

**Goal**: Deploy agentic scoring contract locally, all instructions tested & audited.

| Day | Task | Deliverable |
|-----|------|-------------|
| 1–2 | Anchor program setup + state account structures | Platform, UserReputation, ActionReceipt PDAs defined |
| 3–4 | Implement 5 instructions (init, fund, add_relayer, apply_reputation, set_top10) | All instructions compile without errors |
| 5 | Replay protection testing (ActionReceipt PDA idempotency) | Verify duplicate event_id is rejected |
| 6 | Error handling + security audit | Unauthorized relayer, invalid points, seed validation checked |
| 7 | Local test script (localnet) | All 5 instructions pass on localnet |

**Acceptance Criteria**:
- ✅ `cargo build` compiles cleanly
- ✅ `cargo test` passes all tests
- ✅ Replay protection verified (duplicate event_id rejected)
- ✅ Relayer authorization enforced
- ✅ No arbitrary point injection possible

---

### Phase 2: Devnet Deployment & Admin Setup (Days 8–11)

**Goal**: Deploy program to devnet, initialize platform, setup admin dashboard.

| Day | Task | Deliverable |
|-----|------|-------------|
| 8 | Deploy to devnet, capture program ID | Update declare_id!() in lib.rs |
| 9 | Admin wallet setup (Magic Link) + fund with devnet SOL | Admin can call privileged instructions |
| 10 | Initialize platform + fund SolReserve | Platform PDA created, 2 SOL in vault |
| 11 | Add Octane as authorized relayer | Octane whitelisted to submit transactions |

**Acceptance Criteria**:
- ✅ Program deployed to devnet
- ✅ Admin wallet initialized with Magic Link
- ✅ Platform PDA exists on devnet
- ✅ SolReserve holds 2 SOL
- ✅ Octane relayer is authorized

---

### Phase 3: Backend Integration (Days 12–16)

**Goal**: Build Node.js backend APIs for team to integrate.

| Day | Task | Deliverable |
|-----|------|-------------|
| 12 | Setup Express server + Solana Web3.js | `/api/` endpoint skeleton |
| 13 | Implement reputation submission API | `POST /api/actions/reputation` (relayer-signed) |
| 14 | Implement user reputation fetch | `GET /api/user/:wallet/reputation` |
| 15 | Implement leaderboard fetch | `GET /api/leaderboard/top10` |
| 16 | Admin endpoints (fund, add relayer, set top10) | `POST /api/admin/*` protected endpoints |

**Acceptance Criteria**:
- ✅ Backend runs locally (npm start)
- ✅ All endpoints tested with curl
- ✅ Relayer reimbursement working (check SolReserve balance)
- ✅ Top 10 leaderboard updates correctly

---

### Phase 4: Frontend Integration (Days 17–21)

**Goal**: Integrate Anup + Samit's feeds with backend reputation APIs.

| Day | Task | Deliverable |
|-----|------|-------------|
| 17 | Anup: Upload notes → backend submission | User upload triggers apply_reputation_action |
| 18 | Anup: Upvote/downvote submission | User votes sync with backend |
| 19 | Samit: Post question/answer → backend | Question/answer posts trigger reputation actions |
| 20 | Samit: Accept answer → backend | Answer acceptance triggers +20 points |
| 21 | Swastik: Leaderboard + badge display | Top 10 fetched from backend, user badge shown |

**Acceptance Criteria**:
- ✅ Upload creates ActionReceipt PDA on-chain
- ✅ Upvote/downvote reflects points on-chain
- ✅ User's badge tier updates on-chain
- ✅ Leaderboard displays top 10 correctly
- ✅ No replay attacks (duplicate submissions rejected)

---

### Phase 5: End-to-End Testing (Days 22–24)

**Goal**: Full platform testing with 10+ test users, edge case coverage.

| Day | Task | Deliverable |
|-----|------|-------------|
| 22 | Create 10 test users | Test user wallets generated |
| 23 | Simulate realistic workflows | 5 uploads, 10 upvotes, 5 Q&A posts per user |
| 24 | Verify badge progression, leaderboard accuracy | All tiers correct, top 10 accurate, no gaming |

**Acceptance Criteria**:
- ✅ 100% of test users have correct reputation scores
- ✅ Badge tiers match point thresholds
- ✅ Leaderboard sorted correctly
- ✅ No race conditions or inconsistencies
- ✅ Relayer reimbursement accurate (no SOL loss)

---

### Phase 6: Launch & Go-Live (Day 25)

**Goal**: Deploy to mainnet, announce to students.

| Item | Status |
|------|--------|
| Program deployed to mainnet | ✅ Go/No-Go decision |
| Platform initialized on mainnet | ✅ Admin wallet ready |
| Octane (or external relayer) authorized | ✅ Relayer live |
| Landing page live + students invited | ✅ Growth phase begins |

---

## 2. Deployment Checklist

### Pre-Launch
- [ ] All 5 instructions tested on devnet
- [ ] Replay protection verified (cannot double-score same event)
- [ ] Relayer authorization enforced (unauthorized relayer rejected)
- [ ] Admin can only call privileged instructions
- [ ] SolReserve balance > 1 SOL (relayer reimbursement ready)
- [ ] Top 10 badge tier logic correct (Singularity requires 1500+ AND top10=true)
- [ ] No arbitrary point injection (hardcoded point values only)
- [ ] All team members can call backend APIs
- [ ] Frontend components fetch from backend successfully

### Launch Day
- [ ] Admin deploys program to mainnet
- [ ] Platform PDA initialized on mainnet
- [ ] SolReserve funded (2+ SOL)
- [ ] Octane whitelisted as authorized relayer
- [ ] Backend connected to mainnet RPC
- [ ] First 10 test users registered successfully
- [ ] First reputation transaction succeeds (user uploads, points awarded)
- [ ] Leaderboard displays correctly

### Post-Launch (First Week)
- [ ] Monitor SolReserve balance (auto-alert if < 0.5 SOL)
- [ ] Verify no replay attacks (duplicate event_ids tracked)
- [ ] Check badge tier accuracy (spot check 10 users)
- [ ] Monitor relayer fees (average cost per transaction)
- [ ] Gather user feedback (UI/UX improvements)

---

## 3. Test Scenarios

### Scenario 1: Normal User Flow
```
1. User uploads note
   ✓ Backend generates event_id
   ✓ Calls apply_reputation_action
   ✓ User gains +10 points
   ✓ Badge tier Spark assigned

2. User upvotes note
   ✓ Upvoter gains +5 points
   ✓ Post author gains +5 points (upvote received)

3. User posts question
   ✓ Asker gains +1 point

4. Another user answers
   ✓ Answerer gains +10 points
   
5. Question owner accepts answer
   ✓ Answerer gains +20 points (total +30)

Expected: All point allocations correct, badge tiers updated
```

### Scenario 2: Replay Attack Prevention
```
1. First submission: event_id = blake3(file_id || "upload" || timestamp)
   ✓ ActionReceipt PDA created
   ✓ +10 points awarded

2. Network error, backend retries with same event_id
   ✓ ActionReceipt PDA already exists
   ✓ Contract rejects with "ActionAlreadyScored" error
   ✓ No double-scoring

Expected: User gets +10 points exactly once
```

### Scenario 3: Unauthorized Relayer
```
1. Attacker (not in authorized_relayers) submits transaction
   ✓ Contract checks: attacker_pubkey in authorized_relayers?
   ✓ No, reject with "UnauthorizedRelayer" error
   ✓ Transaction fails, SolReserve not drained

Expected: Only authorized relayers can submit
```

### Scenario 4: Badge Tier Progression
```
1. User at 0 points → Spark tier
2. User uploads 5 notes → +50 points (total 50) → Still Spark
3. User uploads 5 more notes → +50 points (total 100) → Upgrades to Current tier
4. User uploads 25 notes + 5 answers → total 350 points → Upgrades to Core tier
5. Admin marks user in top10 (after hitting 1500 pts) → Upgrades to Singularity tier

Expected: Badge tiers match thresholds exactly
```

### Scenario 5: Leaderboard Accuracy
```
1. 10 users have varying reputation scores (50, 150, 300, 400, 600, 800, 900, 1000, 1200, 1500)
2. Admin calls set_top10([user9, user10, user8, user7, user6, user5, user4, user3, user2, user1])
   ✓ Top 10 users marked with is_top10 = true
   ✓ User10 (1500 pts + top10) upgrades to Singularity
   
Expected: Leaderboard displays top 10, Singularity tier awarded correctly
```

---

## 4. Performance Targets

| Metric | Target | Actual (Post-Launch) |
|--------|--------|-------------------|
| Time to award reputation (submit → on-chain) | < 5 seconds | TBD |
| Relayer cost per transaction | < 0.001 SOL (~$0.02) | TBD |
| SolReserve balance (minimum) | > 0.5 SOL | TBD |
| Transaction success rate | > 99% | TBD |
| Leaderboard update latency | < 10 seconds | TBD |

---

## 5. Rollback & Contingency Plans

### If Replay Protection Fails
```
Issue: ActionReceipt PDA not preventing duplicates
Response:
  1. Pause apply_reputation_action instruction
  2. Audit all existing ActionReceipt PDAs
  3. Remove duplicates (program data migration)
  4. Fix PDA derivation logic
  5. Redeploy program
  6. Resume operations
```

### If Relayer Runs Out of SOL
```
Issue: SolReserve balance < 0.0001 SOL (can't reimburse relayers)
Response:
  1. Alert admin immediately (automated monitoring)
  2. Admin calls fund_vault, deposits 2 SOL
  3. SolReserve replenished
  4. Relayer operations resume
```

### If Unauthorized Relayer Submits Transaction
```
Issue: Attacker submits as unauthorized relayer
Response:
  1. Contract rejects transaction automatically
  2. No points awarded, no SolReserve drained
  3. Transaction fails, user sees error
  4. Backend logs unauthorized attempt
  5. No action needed (self-protecting)
```

---

## 6. Maintenance Schedule (Post-Launch)

### Daily
- Monitor SolReserve balance (auto-alert if < 1 SOL)
- Check transaction success rate
- Verify no replay attacks

### Weekly
- Audit top 10 leaderboard accuracy
- Check average relayer fees
- Review error logs

### Monthly
- Call set_top10 to update leaderboard
- Award Singularity badges to top performers
- Cleanup old ActionReceipt PDAs (optional, for space savings)

### Quarterly
- Security audit (replay protection, authorization checks)
- Capacity planning (if user growth rapid)
- Update documentation for new team members

---

## 7. Success Metrics (By Launch)

| Metric | Target |
|--------|--------|
| Users registered | 50–100 |
| Files uploaded | 50+ |
| Q&A posts | 50+ |
| Upvotes/downvotes | 100+ |
| Reputation actions on-chain | 200+ |
| Avg points/user | 50+ |
| Smart contract uptime | 99.9% |
| Zero replay attacks | 100% |
| Authorized relayer enforcement | 100% |

---

## 8. Post-Launch Roadmap (Future Phases)

### Phase 6 (After Hackathon)
- [ ] Marketing push (TU announcements)
- [ ] Integrate with TU email system (auto-verification)
- [ ] Organize first "Contribution Month" (special badges)

### Phase 7 (2–3 Weeks Post-Launch)
- [ ] Gather user feedback
- [ ] Add comments section to notes/lab reports (if time)
- [ ] Implement daily login streak tracking (if needed)

### Phase 8 (1–2 Months Post-Launch)
- [ ] Analyze usage patterns (which resources most helpful?)
- [ ] Introduce moderator role (trusted users can accept answers for TAs)
- [ ] Plan NFT/certificate system (post-hackathon)

---

## 9. Team Roles During Deployment

| Role | Responsibility | Owner |
|------|---|---|
| **Solana Core** | Deploy, test smart contracts, setup admin | Bijesh |
| **Backend Lead** | Build APIs, connect frontend to contract | Bijesh |
| **Frontend Lead** | Integrate reputation calls, display leaderboard | Swastik |
| **Notes/Lab Reports** | Submit upvote/downvote events | Anup |
| **Q&A Lead** | Submit question/answer/accept events | Samit |

---

## 10. Launch Day Sequence

```
T-1 Hour: Final checks (SolReserve funded, relayer authorized, all APIs live)
T-0: Admin initializes platform on mainnet
T+5 min: Backend confirms platform PDA created
T+10 min: Announce on TU WhatsApp groups + Discord
T+15 min: First 10 test users sign up
T+20 min: First user uploads note (reputation action triggered)
T+25 min: Leaderboard displays first score
T+1 Hour: Verify no issues, no exploits, no errors
T+2 Hours: Celebrate 🎉 (platform is live!)
```

---

**Status**: Ready to Deploy ✅  
**Deployment Target**: May 11, 2026 (Colosseum Frontier Hackathon)  
**Contingency**: If issues arise, rollback to devnet for fixes (1–2 day delay acceptable)
