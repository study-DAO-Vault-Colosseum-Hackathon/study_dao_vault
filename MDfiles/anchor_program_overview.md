# Anchor Program Overview

## Accounts

### Platform (Admin-controlled)
- **authority**: Admin wallet (can init, fund, add relayers, set top10)
- **authorized_relayers**: List of relayer wallets (e.g., Octane) that can call `apply_reputation_action`
- **total_users_count**: Total users registered
- **total_reputation_distributed**: Sum of all reputation points awarded

### SolReserve (Admin-funded)
- **platform**: Reference to platform account
- **total_inflow**: Total SOL deposited by admin
- **total_outflow**: Total SOL paid to relayers as fees
- Holds SOL to reimburse relayers (5000 lamports per action)

### UserReputation (User-owned)
- **wallet**: User's public key
- **reputation_score**: Total points (0–10k+)
- **badge_tier**: Spark → Current → Core → Supernova → Singularity (based on score)
- **is_top10**: Admin flag; true if user in top 10 (upgrades to Singularity if score ≥1500)
- **Counters**: total_notes_uploads, total_lab_reports_uploads, total_questions, total_answers, total_accepted_answers
- **founding_member_bonus_claimed**: One-time bonus (first 100 users, +25 pts)
- **current_login_streak_days**: Daily login counter (disabled this phase)

### ActionReceipt (Replay protection)
- **event_id**: Unique event identifier (prevents duplicate scoring)
- **points_delta**: Points awarded/deducted for this action
- **timestamp**: When action occurred

---

## Instructions

### init_platform
- **Called by**: Admin (via backend)
- **Does**: Creates platform and sol_reserve accounts; initializes admin as authority
- **One-time**: Yes (at launch)

### fund_vault
- **Called by**: Admin (via backend)
- **Does**: Transfers SOL from admin wallet to SolReserve
- **Effect**: Increases vault balance for relayer reimbursement

### add_relayer
- **Called by**: Admin (via backend)
- **Does**: Adds a new relayer to authorized_relayers list
- **Example**: Add Octane relayer after platform init
- **Max**: 20 relayers

### apply_reputation_action
- **Called by**: Backend on behalf of user (relayer pays fee)
- **Does**: Awards reputation points for user actions:
  - UploadNotes (+10), UploadLabReports (+10)
  - UploadUpvote (+5), UploadDownvote (-2)
  - QuestionPosted (+10), QuestionUpvoted (+1)
  - AnswerPosted (+10), AnswerUpvoted (+2), AnswerMarkedAccepted (+20)
  - FoundingMemberClaim (+25, one-time)
- **Safety**: Checks event_id uniqueness (prevents replays)
- **Relayer fee**: 5000 lamports paid from SolReserve to relayer

### set_top10_status
- **Called by**: Admin (via frontend button)
- **Does**: Marks user as top10; recalculates badge tier
- **Effect**: If user has ≥1500 points AND is_top10=true, upgrades to Singularity tier

---

## Data Flow

```
User Action (e.g., posts question)
    ↓
Backend validates user, generates event_id
    ↓
Backend calls apply_reputation_action (signed by relayer)
    ↓
Program:
  1. Checks relayer is authorized
  2. Verifies event_id is unique (replay check)
  3. Awards points based on action
  4. Updates UserReputation score & badge
  5. Transfers 5000 lamports to relayer from SolReserve
    ↓
Frontend shows updated score/badge
    ↓
Admin periodically sets top10 users (manual leaderboard)
```

---

## Badge Tier Progression

| Tier | Points | Condition |
|------|--------|-----------|
| Spark | 0–99 | Default |
| Current | 100–349 | ~5 meaningful actions |
| Core | 350–799 | ~15 actions |
| Supernova | 800–1499 | Senior contributor |
| Singularity | 1500+ **AND** is_top10 | Elite (top 10 users) |

---

## Key Features

- **No downvotes for Q&A**: Encourages participation (questions/answers only have upvotes, not downvotes)
- **No comment scoring**: Comments in notes/lab reports are not scoreable this phase
- **Founding member bonus**: +25 pts, one-time, limited to first 100 users
- **Replay protection**: Each action has unique event_id; same event_id cannot be scored twice
- **Relayer model**: Users never pay fees; backend relayer pays, reimbursed from vault
