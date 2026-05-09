# LocalNet Testing - Quick Reference Card

## 🚀 Start Here (5 minutes)

### Terminal 1: Start Validator
```bash
solana-test-validator
```
Keep running. Shows program deployments, transactions, errors.

### Terminal 2: Configure & Deploy

```bash
# Set RPC to local
solana config set --url http://localhost:8899

# Fund wallet
solana airdrop 100

# Navigate to Anchor project
cd ~/code_playground/MyWebDev/studyDAOvault/study_dao_vault

# Build
anchor build

# Deploy
anchor deploy
# 👀 Copy the PROGRAM_ID from output
```

### Terminal 3: Run Tests

```bash
# Option A: If you placed test script in app/
node app/localnet_test.js

# Option B: If in MDfiles/
node ../MDfiles/localnet_test.js
```

---

## 📋 Before Running Tests

**IMPORTANT**: Update these in `localnet_test.js`:

1. **Line 22** - Update PROGRAM_ID:
```javascript
const PROGRAM_ID = new PublicKey("PASTE_YOUR_PROGRAM_ID_HERE");
```

2. **Line 28** - Verify wallet path (usually correct):
```javascript
const WALLET_PATH = process.env.HOME + "/.config/solana/id.json";
```

3. **Line 32** - Update RPC if needed:
```javascript
const RPC_URL = "http://localhost:8899";
```

---

## ✅ What Each Test Does

| Test | What It Tests | Success Indicator |
|------|---------------|-------------------|
| `init_platform` | Platform creation with admin authority | "Platform initialized" + authority shown |
| `add_relayer` | Adding authorized relayer | "Relayer added" + relayer address shown |
| `fund_vault` | Depositing SOL to SolReserve | "Vault funded" + balance shown |
| `apply_reputation_action` | Awarding points to user | "Reputation action applied" + score shown |
| `set_top10` | Setting leaderboard top 10 | "Top 10 leaderboard set" + count shown |

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "RPC connection failed" | Make sure Terminal 1 is running `solana-test-validator` |
| "Program not found" | Copy PROGRAM_ID from `anchor deploy` output, update line 22 |
| "Insufficient funds" | Run `solana airdrop 100` again |
| "IDL not found" | IDL will auto-generate. If errors persist, run `anchor build` again |
| "Transaction failed" | Check validator Terminal 1 for error details |

---

## 📊 Expected Output

```
══════════════════════════════════════════════════════════════════════
EduChain LocalNet Test Suite
══════════════════════════════════════════════════════════════════════

🔌 Connecting to localnet...
✅ Connected to localnet at http://localhost:8899
   Wallet: [YOUR_PUBKEY]
   Balance: 100 SOL

📦 Loading program...
✅ Program ID: [PROGRAM_ID]

--- Testing init_platform ---
✅ Platform initialized
   Transaction: [SIGNATURE]
   Authority: [YOUR_PUBKEY]
   Platform PDA: [PDA]
   Vault capacity: 100 SOL
   User count: 0

--- Testing add_relayer ---
✅ Relayer added
   Transaction: [SIGNATURE]
   Relayer address: [RELAYER_PUBKEY]
   Total relayers: 1

--- Testing fund_vault ---
✅ Vault funded
   Transaction: [SIGNATURE]
   Deposited: 10 SOL
   SolReserve balance: 10 SOL

--- Testing apply_reputation_action ---
✅ Reputation action applied
   Transaction: [SIGNATURE]
   User: [USER_PUBKEY]
   Points awarded: 15
   Action: UploadPastPaper
   User total score: 15
   Badge tier: 1

--- Testing set_top10 ---
✅ Top 10 leaderboard set
   Transaction: [SIGNATURE]
   Top 10 users set successfully
   Top 10 count: 10

══════════════════════════════════════════════════════════════════════
📊 Test Summary: 5/5 passed
✅ All tests passed!
```

---

## 🔄 Cleanup & Reset

If you want to restart fresh:

```bash
# Stop validator (Ctrl+C in Terminal 1)

# Clear ledger
rm -rf /tmp/test-ledger-*

# Restart validator
solana-test-validator
```

---

## 📝 Manual Testing (Without Script)

Want to test individual functions manually? Use Solana CLI:

```bash
# Initialize platform (replace with your values)
solana program invoke [PROGRAM_ID] \
  --instruction-data "[INSTRUCTION_DATA_HEX]" \
  --signer [WALLET_PATH]

# Check account balance
solana account [PDA_ADDRESS]

# Check transaction details
solana confirm [TRANSACTION_SIGNATURE]
```

---

## 📞 Need Help?

1. **Validator not starting?**
   ```bash
   # Check if port 8899 is already in use
   lsof -i :8899
   # Kill if needed: kill [PID]
   ```

2. **Want to see transactions in detail?**
   ```bash
   # In Terminal 1, validator shows all activity
   # Look for "Processing transaction" logs
   ```

3. **Need to inspect an account?**
   ```bash
   solana account [PUBKEY]
   ```

---

**Next Step**: After all tests pass, deploy to devnet and integrate with frontend!
