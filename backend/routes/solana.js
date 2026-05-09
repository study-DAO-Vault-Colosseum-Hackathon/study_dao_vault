const express = require('express');
const anchor = require('@coral-xyz/anchor');
const { SystemProgram, PublicKey, Connection } = anchor.web3;
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

let program = null;

// Initialize program once
async function initProgram() {
  if (program) return program;

  try {
    const connection = new Connection(process.env.RPC_URL, 'confirmed');
    
    // Create a dummy wallet for read-only operations
    const dummyKeypair = anchor.web3.Keypair.generate();
    const wallet = new anchor.Wallet(dummyKeypair);

    const provider = new anchor.AnchorProvider(connection, wallet, {
      commitment: 'confirmed',
      preflightCommitment: 'confirmed',
    });

    // Load IDL
    const idlPath = path.join(__dirname, '../idl/study_dao_vault.json');
    const idl = JSON.parse(fs.readFileSync(idlPath, 'utf-8'));
    idl.address = PROGRAM_ID.toBase58();

    program = new anchor.Program(idl, provider);
    console.log('✅ Program initialized');
    return program;
  } catch (error) {
    console.error('Failed to initialize program:', error);
    throw error;
  }
}

// 📌 Init Platform (Admin only)
router.post('/init-platform', authenticateMagic, async (req, res) => {
  try {
    const prog = await initProgram();
    const platformPDA = getPlatformPDA();
    const solReservePDA = getSolReservePDA(platformPDA);
    const authority = new PublicKey(req.user.walletAddress);

    console.log(`Initializing platform with authority: ${authority.toBase58()}`);

    const tx = await prog.methods
      .initPlatform()
      .accounts({
        platform: platformPDA,
        solReserve: solReservePDA,
        authority: authority,
        systemProgram: SystemProgram.programId,
      })
      .signers([]) // Relayer will sign
      .rpc()
      .catch(err => {
        throw new Error(`Transaction failed: ${err.message}`);
      });

    res.json({
      success: true,
      tx,
      platformOwner: authority.toBase58(),
      platformPDA: platformPDA.toBase58(),
      solReservePDA: solReservePDA.toBase58(),
    });
  } catch (error) {
    console.error('Init platform error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 📌 Fund Vault
router.post('/fund-vault', authenticateMagic, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const prog = await initProgram();
    const platformPDA = getPlatformPDA();
    const solReservePDA = getSolReservePDA(platformPDA);
    const authority = new PublicKey(req.user.walletAddress);

    console.log(`Funding vault with ${amount} lamports from ${authority.toBase58()}`);

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

// 📌 Add Relayer (for Octane, etc.)
router.post('/add-relayer', authenticateMagic, async (req, res) => {
  try {
    const { relayerAddress } = req.body;

    if (!relayerAddress) {
      return res.status(400).json({ error: 'Relayer address is required' });
    }

    const prog = await initProgram();
    const platformPDA = getPlatformPDA();
    const authority = new PublicKey(req.user.walletAddress);

    console.log(`Adding relayer: ${relayerAddress}`);

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

// 📌 Apply Reputation Action
router.post('/reputation-action', authenticateMagic, async (req, res) => {
  try {
    const { actionType, userPubkey, eventIdHex } = req.body;

    if (!actionType || !userPubkey) {
      return res.status(400).json({ 
        error: 'actionType and userPubkey are required' 
      });
    }

    const prog = await initProgram();
    const platformPDA = getPlatformPDA();
    const userPubkeyObj = new PublicKey(userPubkey);
    const userRepPDA = getUserReputationPDA(userPubkeyObj);
    
    // Use provided eventId or generate new one
    const eventId = eventIdHex ? Buffer.from(eventIdHex, 'hex') : generateEventId();
    const actionReceiptPDA = getActionReceiptPDA(userPubkeyObj, eventId);
    const solReservePDA = getSolReservePDA(platformPDA);
    const relayer = new PublicKey(req.user.walletAddress);

    console.log(`Applying reputation action for user: ${userPubkey}`);

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

// 📌 Set Top 10 Status
router.post('/set-top10', authenticateMagic, async (req, res) => {
  try {
    const { userPubkey, isTop10 } = req.body;

    if (!userPubkey) {
      return res.status(400).json({ error: 'User pubkey is required' });
    }

    const prog = await initProgram();
    const platformPDA = getPlatformPDA();
    const userPubkeyObj = new PublicKey(userPubkey);
    const userRepPDA = getUserReputationPDA(userPubkeyObj);
    const authority = new PublicKey(req.user.walletAddress);

    console.log(`Setting top10 status for ${userPubkey} to ${isTop10}`);

    const tx = await prog.methods
      .setTop10Status(isTop10 || false)
      .accounts({
        platform: platformPDA,
        userReputation: userRepPDA,
        authority: authority,
      })
      .rpc();

    res.json({ success: true, tx });
  } catch (error) {
    console.error('Set top10 error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 📌 Get Platform State (public)
router.get('/platform-state', async (req, res) => {
  try {
    const prog = await initProgram();
    const platformPDA = getPlatformPDA();
    const platformAccount = await prog.account.platform.fetch(platformPDA);

    res.json({
      platform: platformPDA.toBase58(),
      totalUsersCount: platformAccount.totalUsersCount.toString(),
      totalReputationDistributed: platformAccount.totalReputationDistributed.toString(),
      authorizedRelayers: platformAccount.authorizedRelayers.map(r => r.toBase58()),
      createdAt: platformAccount.createdAt.toString(),
      updatedAt: platformAccount.updatedAt.toString(),
    });
  } catch (error) {
    console.error('Get platform state error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 📌 Get User Reputation (public)
router.get('/user-reputation/:userPubkey', async (req, res) => {
  try {
    const prog = await initProgram();
    const userPubkeyObj = new PublicKey(req.params.userPubkey);
    const userRepPDA = getUserReputationPDA(userPubkeyObj);
    const userRepAccount = await prog.account.userReputation.fetch(userRepPDA);

    res.json({
      wallet: userRepAccount.wallet.toBase58(),
      reputationScore: userRepAccount.reputationScore.toString(),
      badgeTier: Object.keys(userRepAccount.badgeTier)[0],
      isTop10: userRepAccount.isTop10,
      totalNotesUploads: userRepAccount.totalNotesUploads.toString(),
      totalLabReportsUploads: userRepAccount.totalLabReportsUploads.toString(),
      totalQuestions: userRepAccount.totalQuestions.toString(),
      totalAnswers: userRepAccount.totalAnswers.toString(),
      totalAcceptedAnswers: userRepAccount.totalAcceptedAnswers.toString(),
      totalActionsProcessed: userRepAccount.totalActionsProcessed.toString(),
      lastUpdated: userRepAccount.lastUpdated.toString(),
    });
  } catch (error) {
    console.error('Get user reputation error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
