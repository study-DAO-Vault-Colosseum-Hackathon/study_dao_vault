# LocalNet Testing Guide for EduChain

## Overview
This guide walks you through testing the Anchor program locally on Solana localnet before deploying to devnet.

---

## Step 1: Install Solana CLI (if not already installed)

```bash
# Check if installed
solana --version

# If not installed:
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Add to PATH
export PATH="/home/bijesh-09/.local/share/solana/install/active_release/bin:$PATH"

# Verify
solana --version
```

---

## Step 2: Start Solana LocalNet

### Option A: Using Solana CLI (Recommended for first time)

```bash
# Start localnet validator
solana-test-validator

# Keep this terminal running. Output will show:
# Ledger location: /tmp/test-ledger-xxxxx
# Log: /tmp/test-ledger-xxxxx/validator.log
# Identity: [YOUR_VALIDATOR_PUBKEY]
```

### Option B: Using Docker (Alternative)

```bash
docker run -d --name solana-localnet \
  -p 8899:8899 \
  -p 8900:8900 \
  solanalabs/solana:latest \
  solana-test-validator --host 0.0.0.0
```

---

## Step 3: Configure Solana CLI for LocalNet

### In a NEW terminal (not the validator one):

```bash
# Set local RPC
solana config set --url http://localhost:8899

# Verify
solana config get
# Should output:
# Config File: /home/bijesh-09/.config/solana/cli/config.yml
# RPC URL: http://localhost:8899
# WebSocket URL: ws://localhost:8900 (computed)
# Keypair Path: /home/bijesh-09/.config/solana/id.json
# Commitment: confirmed
```

---

## Step 4: Fund Your Local Wallet

```bash
# Airdrop 100 SOL to your wallet (only works on localnet)
solana airdrop 100

# Verify balance
solana balance

# Should show: 100 SOL
```

---

## Step 5: Build & Deploy Anchor Program

```bash
# Navigate to your Anchor workspace
cd /mnt/c/Users/Asus/Desktop/code_playground/MyWebDev/studyDAOvault/study_dao_vault

# Build the program
anchor build

# Deploy to localnet
anchor deploy

# Output will show:
# Deploying cluster: http://localhost:8899
# Upgrade authority: [YOUR_PUBKEY]
# Deploying program "study_dao_vault"...
# Program deployed to: [PROGRAM_ID]

# ⚠️ IMPORTANT: Copy this PROGRAM_ID
```

---

## Step 6: Update IDL and Program ID

After deployment, update your test script with the correct program ID:

```bash
# Get the program ID
solana address -k target/deploy/study_dao_vault-keypair.json

# Update Anchor.toml with this ID
# Also update your test script (step 8)
```

---

## Step 7: Install Node.js Dependencies (if not done)

```bash
cd /mnt/c/Users/Asus/Desktop/code_playground/MyWebDev/studyDAOvault/study_dao_vault

# Install deps
yarn install
# or
npm install
```

---

## Step 8: Run the Test Script

### Copy `localnet_test.js` to your workspace:

```bash
# Put the test script in your project root or app/ folder
cp localnet_test.js ./app/

# Run it
node app/localnet_test.js
```

---

## Step 9: Understanding Test Output

### Successful output should show:

```
✅ Connected to localnet at http://localhost:8899
✅ Program ID: [PROGRAM_ID]
✅ Admin wallet: [ADMIN_PUBKEY]

--- Testing init_platform ---
✅ Platform initialized
   Authority: [ADMIN_PUBKEY]
   Vault capacity: 100
   User count: 0

--- Testing add_relayer ---
✅ Relayer added: [RELAYER_PUBKEY]
   Total relayers: 1

--- Testing fund_vault ---
✅ Vault funded: 10 SOL deposited
   SolReserve balance: 10 SOL

--- Testing apply_reputation_action ---
✅ Reputation action applied
   User score increased: 15 points
   Total score: 15

--- Testing set_top10 ---
✅ Top 10 leaderboard set
   Top users: [USER1, USER2, ...]

✅ All tests passed!
```

---

## Step 10: Troubleshooting

### Error: "Unable to confirm transaction"
**Solution**: Make sure localnet validator is running. Check output in validator terminal.

### Error: "Program not found at [PROGRAM_ID]"
**Solution**: 
1. Redeploy the program: `anchor deploy`
2. Update the program ID in test script

### Error: "Insufficient funds"
**Solution**: Airdrop more SOL
```bash
solana airdrop 100
```

### Error: "RPC connection failed"
**Solution**: Verify localnet is running and RPC URL is correct
```bash
solana config get
solana ping
```

### Validator crashing?
**Solution**: Restart validator
```bash
# Stop current validator (Ctrl+C in validator terminal)
# Clear ledger and restart
rm -rf /tmp/test-ledger-*
solana-test-validator
```

---

## Step 11: What to Test

### ✅ Test These Functions:

1. **init_platform** - Initializes the platform with admin authority
2. **add_relayer** - Adds authorized relayers
3. **fund_vault** - Deposits SOL into SolReserve
4. **apply_reputation_action** - Awards points to user
5. **set_top10** - Sets top 10 leaderboard

### ✅ Test These Scenarios:

| Scenario | Expected Outcome |
|----------|-----------------|
| Init platform twice | Should fail (already initialized) |
| Add duplicate relayer | Should fail (already exists) |
| Add 21st relayer | Should fail (max 20) |
| Apply action without relayer auth | Should fail (Unauthorized) |
| Award +15 points for upload | User score: 15 |
| Award +10 points for answer | User score: 25 |
| Apply same action twice (replay) | Should fail (ActionReceipt PDA exists) |
| Set top 10 without being admin | Should fail (Unauthorized) |
| Fund vault multiple times | SolReserve balance increases |

---

## Step 12: After Testing

### Cleanup (if needed):

```bash
# Stop validator
# In validator terminal: Ctrl+C

# Clean build artifacts
cd study_dao_vault
cargo clean

# Delete localnet ledger
rm -rf /tmp/test-ledger-*
```

### Next Steps:

After localnet testing passes:
1. Deploy to devnet
2. Update RPC URL in frontend/backend
3. Integrate with team members
4. Run end-to-end testing with Magic Link wallet

---

## Quick Reference: Solana Commands

```bash
# Check balance
solana balance

# Airdrop SOL
solana airdrop 100

# Get pubkey
solana address

# Check config
solana config get

# Set RPC
solana config set --url http://localhost:8899

# Check transaction status
solana confirm [SIGNATURE]

# View account
solana account [PUBKEY]
```

---

## File Structure

```
study_dao_vault/
├── programs/
│   └── study_dao_vault/
│       └── src/
│           ├── lib.rs
│           ├── state.rs
│           ├── error.rs
│           └── instructions/
│               ├── init_platform.rs
│               ├── add_relayer.rs
│               ├── fund_vault.rs
│               ├── apply_reputation_action.rs
│               └── set_top10.rs
├── app/
│   └── localnet_test.js  ← Your test script
├── Anchor.toml
└── Cargo.toml
```

---

## Expected Timeline

- **Step 1-4**: 5 minutes (setup)
- **Step 5-6**: 10 minutes (build & deploy)
- **Step 8**: 5 minutes (run tests)
- **Step 10-12**: Debugging as needed

**Total**: ~30 minutes first time, ~5 minutes on subsequent runs.

