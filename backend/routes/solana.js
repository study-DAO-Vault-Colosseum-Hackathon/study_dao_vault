const express = require('express');
const anchor = require('@coral-xyz/anchor');
const { SystemProgram, PublicKey, Connection, Keypair } = anchor.web3;
const fs = require('fs');
const path = require('path');
const { authenticateMagic } = require('../middleware/magic-auth');
const {
  getPlatformPDA,
  getSolReservePDA,
  getUserReputationPDA,
  getActionReceiptPDA,
  generateEventId,
  PROGRAM_ID,
} = require('../src/pda');

const router = express.Router();

// 🚨 HARDCODE YOUR MAGIC WALLET ADDRESS HERE
// This is the address of the Google account you sign in with on the frontend.
const OWNER_MAGIC_ADDRESS = "PASTE_YOUR_MAGIC_SOLANA_ADDRESS_HERE";

let program = null;

// Initialize program once
async function initProgram() {
  if (program) return program;

  try {
    const connection = new Connection(process.env.RPC_URL, 'confirmed');
    
    // Load your Solana CLI wallet from .env
    let wallet;
    if (process.env.SOLANA_CLI_PRIVATE_KEY) {
      try {
        const secretKey = Uint8Array.from(JSON.parse(process.env.SOLANA_CLI_PRIVATE_KEY));
        const keypair = Keypair.fromSecretKey(secretKey);
        wallet = new anchor.Wallet(keypair);
        console.log(`Using CLI Wallet: ${keypair.publicKey.toBase58()}`);
      } catch (e) {
        console.error("Failed to parse SOLANA_CLI_PRIVATE_KEY. Falling back to dummy wallet.");
        wallet = new anchor.Wallet(Keypair.generate());
      }
    } else {
      console.warn("SOLANA_CLI_PRIVATE_KEY not found in .env. Using dummy wallet (will fail transactions).");
      wallet = new anchor.Wallet(Keypair.generate());
    }

    const provider = new anchor.AnchorProvider(connection, wallet, {
      commitment: 'confirmed',
      preflightCommitment: 'confirmed',
    });

    // Load IDL
    const idlPath = path.join(__dirname, '../idl/study_dao_vault.json');
    const idl = JSON.parse(fs.readFileSync(idlPath, 'utf-8'));
    idl.address = PROGRAM_ID.toBase58();

    program = new anchor.Program(idl, provider);
    console.log('Program initialized with CLI provider');
    return program;
  } catch (error) {
    console.error('Failed to initialize program:', error);
    throw error;
  }
}

/**
 * Middleware to ensure only the hardcoded Owner (Magic Wallet) can call a route.
 */
function ensureOwner(req, res, next) {
  if (req.user.walletAddress !== OWNER_MAGIC_ADDRESS) {
    return res.status(403).json({ 
      error: "Access Denied: Only the platform owner can perform this action." 
    });
  }
  next();
}

// 📌 Init Platform (Owner only)
router.post('/init-platform', authenticateMagic, ensureOwner, async (req, res) => {
  try {
    const prog = await initProgram();
    const platformPDA = getPlatformPDA();
    const solReservePDA = getSolReservePDA(platformPDA);
    
    // Since the backend CLI wallet is the signer, we use its address as the authority
    const authority = prog.provider.wallet.publicKey;

    console.log(`Initializing platform with CLI wallet as authority: ${authority.toBase58()}`);

    const tx = await prog.methods
      .initPlatform()
      .accounts({
        platform: platformPDA,
        solReserve: solReservePDA,
        authority: authority,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    res.json({ success: true, tx, owner: authority.toBase58() });
  } catch (error) {
    console.error('Init platform error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 📌 Fund Vault (Owner only)
router.post('/fund-vault', authenticateMagic, ensureOwner, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ error: 'Amount is required' });

    const prog = await initProgram();
    const platformPDA = getPlatformPDA();
    const solReservePDA = getSolReservePDA(platformPDA);
    const authority = prog.provider.wallet.publicKey;

    const tx = await prog.methods
      .fundVault(new anchor.BN(amount))
      .accounts({
        platform: platformPDA,
        solReserve: solReservePDA,
        authority: authority,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    res.json({ success: true, tx });
  } catch (error) {
    console.error('Fund vault error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 📌 Add Relayer (Owner only)
router.post('/add-relayer', authenticateMagic, ensureOwner, async (req, res) => {
  try {
    const { relayerAddress } = req.body;
    if (!relayerAddress) return res.status(400).json({ error: 'Relayer address is required' });

    const prog = await initProgram();
    const platformPDA = getPlatformPDA();
    const authority = prog.provider.wallet.publicKey;

    const tx = await prog.methods
      .addRelayer(new PublicKey(relayerAddress))
      .accounts({
        platform: platformPDA,
        authority: authority,
      })
      .rpc();

    res.json({ success: true, tx });
  } catch (error) {
    console.error('Add relayer error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 📌 Apply Reputation Action (Any authenticated user can trigger, but CLI wallet pays)
router.post('/reputation-action', authenticateMagic, async (req, res) => {
  try {
    const { actionType, userPubkey, eventIdHex } = req.body;
    if (!actionType || !userPubkey) return res.status(400).json({ error: 'Missing parameters' });

    const prog = await initProgram();
    const platformPDA = getPlatformPDA();
    const userPubkeyObj = new PublicKey(userPubkey);
    const userRepPDA = getUserReputationPDA(userPubkeyObj);
    const eventId = eventIdHex ? Buffer.from(eventIdHex, 'hex') : generateEventId();
    const actionReceiptPDA = getActionReceiptPDA(userPubkeyObj, eventId);
    const solReservePDA = getSolReservePDA(platformPDA);
    
    // The CLI wallet acts as the relayer and pays for the tx
    const relayer = prog.provider.wallet.publicKey;

    const tx = await prog.methods
      .applyReputationAction(actionType, eventId, userPubkeyObj)
      .accounts({
        platform: platformPDA,
        solReserve: solReservePDA,
        userReputation: userRepPDA,
        actionReceipt: actionReceiptPDA,
        user: userPubkeyObj,
        relayer: relayer,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    res.json({ success: true, tx });
  } catch (error) {
    console.error('Reputation action error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 📌 5. Get Platform & Owner State (Owner Only)
router.get('/platform-state', authenticateMagic, ensureOwner, async (req, res) => {
  try {
    const prog = await initProgram();
    const platformPDA = getPlatformPDA();
    const solReservePDA = getSolReservePDA(platformPDA);
    
    const platformAccount = await prog.account.platform.fetch(platformPDA);
    const vaultBalance = await prog.provider.connection.getBalance(solReservePDA);
    const cliBalance = await prog.provider.connection.getBalance(prog.provider.wallet.publicKey);

    // Fetch Magic Owner Balance
    const ownerMagicPubkey = new PublicKey(OWNER_MAGIC_ADDRESS);
    let ownerBalance = 0;
    try {
      ownerBalance = await prog.provider.connection.getBalance(ownerMagicPubkey);
    } catch (e) {}

    res.json({
      platform: platformPDA.toBase58(),
      vaultBalance: (vaultBalance / 1e9).toFixed(4), 
      ownerMagicBalance: (ownerBalance / 1e9).toFixed(4),
      cliPayerBalance: (cliBalance / 1e9).toFixed(4),
      totalUsersCount: platformAccount.totalUsersCount.toString(),
      relayerCount: platformAccount.authorizedRelayers.length,
      authorizedRelayers: platformAccount.authorizedRelayers.map(r => r.toBase58()),
      totalReputationDistributed: platformAccount.totalReputationDistributed.toString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Get User Reputation (Public)
router.get('/user-reputation/:userPubkey', async (req, res) => {
  try {
    const prog = await initProgram();
    const userPubkeyObj = new PublicKey(req.params.userPubkey);
    const userRepPDA = getUserReputationPDA(userPubkeyObj);
    const userRepAccount = await prog.account.userReputation.fetch(userRepPDA);

    res.json({
      wallet: userRepAccount.wallet.toBase58(),
      registrationIndex: userRepAccount.registrationIndex.toString(),
      reputationScore: userRepAccount.reputationScore.toString(),
      
      // Upload & Activity Counts
      totalNotesUploads: userRepAccount.totalNotesUploads,
      totalLabReportsUploads: userRepAccount.totalLabReportsUploads,
      totalQuestions: userRepAccount.totalQuestions,
      totalAnswers: userRepAccount.totalAnswers,
      totalAcceptedAnswers: userRepAccount.totalAcceptedAnswers,
      totalActionsProcessed: userRepAccount.totalActionsProcessed.toString(),

      // Stats & Status
      badgeTier: Object.keys(userRepAccount.badgeTier)[0],
      isTop10: userRepAccount.isTop10,
      foundingMemberBonusClaimed: userRepAccount.foundingMemberBonusClaimed,
      currentLoginStreakDays: userRepAccount.currentLoginStreakDays,

      // Timestamps
      lastClaimTs: userRepAccount.lastClaimTs.toString(),
      lastUpdated: userRepAccount.lastUpdated.toString(),
    });
  } catch (error) {
    console.error('Get user reputation error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
