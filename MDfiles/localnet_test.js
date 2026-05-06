/**
 * EduChain LocalNet Test Script
 * 
 * Tests all 5 Anchor program instructions on localnet:
 * 1. init_platform - Initialize platform with admin authority
 * 2. add_relayer - Add authorized relayers to platform
 * 3. fund_vault - Deposit SOL into SolReserve PDA
 * 4. apply_reputation_action - Award reputation points to user and create ActionReceipt
 * 5. set_top10_status - Mark user as top 10 and update badge tier
 * 
 * Account mapping:
 *   Platform -> platform PDA
 *   SolReserve -> sol_reserve PDA
 *   UserReputation -> user_reputation PDA
 *   ActionReceipt -> action_receipt PDA
 * 
 * Run: node localnet_test.js
 */

const anchor = require("@coral-xyz/anchor");
const { SystemProgram, PublicKey, Keypair, Transaction } = anchor.web3;
const fs = require("fs");

// ============================================================================
// CONFIG - UPDATE THESE VALUES AFTER DEPLOYMENT
// ============================================================================

// ⚠️ IMPORTANT: Replace with your actual Program ID from deployment
const PROGRAM_ID = new PublicKey("ExY4RXQaD86GyNpofZy9PJV32QKPaDRnzcvByLDb8bTZ");

// LocalNet RPC
const RPC_URL = "http://localhost:8899";

// Update with correct keypair path (your wallet)
const WALLET_PATH = process.env.HOME + "/.config/solana/id.json";

// ============================================================================
// SETUP
// ============================================================================

async function getProvider() {
  const connection = new anchor.web3.Connection(RPC_URL, "confirmed");
  
  // Load keypair from filesystem
  const keypairBuffer = fs.readFileSync(WALLET_PATH);
  const keypair = Keypair.fromSecretKey(Buffer.from(JSON.parse(keypairBuffer.toString())));
  
  const wallet = new anchor.Wallet(keypair);
  
  return new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
    preflightCommitment: "confirmed",
  });
}

async function getProgram(provider) {
  // Try to load IDL from target/idl/study_dao_vault.json
  let idl;
  try {
    const idlPath = "./target/idl/study_dao_vault.json";
    idl = JSON.parse(fs.readFileSync(idlPath, "utf-8"));
  } catch (e) {
    console.warn("⚠️  IDL not found. Using minimal IDL. Some features may not work.");
    idl = {
      version: "0.1.0",
      name: "study_dao_vault",
      instructions: [],
    };
  }

  return new anchor.Program(idl, PROGRAM_ID, provider);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateEventId() {
  /**
   * Generate unique event ID for replay protection
   * Format: blake3(content_id + action + timestamp)
   * For testing, we use: blake3(Math.random() + timestamp)
   */
  const crypto = require("crypto");
  const input = Math.random().toString() + Date.now().toString();
  return crypto.createHash("sha256").update(input).digest();
}

function getAdminPDA(program) {
  /**
   * Platform PDA
   * Seeds: ["platform"]
   * Matches: PLATFORM_SEED in constants.rs
   */
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("platform")],
    program.programId
  );
  return pda;
}

function getSolReservePDA(program, platformPDA) {
  /**
   * SolReserve PDA
   * Seeds: ["vault", platform.key()]
   * Matches: seeds = [SOL_RESERVE_SEED, platform.key().as_ref()] in init_platform.rs
   */
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), platformPDA.toBuffer()],
    program.programId
  );
  return pda;
}

function getUserReputationPDA(program, userPubkey) {
  /**
   * UserReputation PDA
   * Seeds: ["reputation", user.key()]
   * Matches: seeds = [USER_REPUTATION_SEED, user.key().as_ref()] in apply_reputation_action.rs
   */
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("reputation"), userPubkey.toBuffer()],
    program.programId
  );
  return pda;
}

function getActionReceiptPDA(program, userPubkey, eventId) {
  /**
   * ActionReceipt PDA (for replay protection)
   * Seeds: ["action_receipt", user.key(), event_id]
   * Matches: seeds = [ACTION_RECEIPT_SEED, user.key().as_ref(), event_id.as_ref()]
   */
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("action_receipt"), userPubkey.toBuffer(), eventId],
    program.programId
  );
  return pda;
}

// ============================================================================
// TEST FUNCTIONS
// ============================================================================

async function test_init_platform(program, provider) {
  console.log("\n--- Testing init_platform ---");
  
  try {
    const platformPDA = getAdminPDA(program);
    const solReservePDA = getSolReservePDA(program, platformPDA);

    // Call init_platform instruction (exact name from Anchor)
    const tx = await program.methods
      .initPlatform(10) // relayer_capacity for dynamic Vec<Pubkey>
      .accounts({
        platform: platformPDA,
        sol_reserve: solReservePDA,
        authority: provider.wallet.publicKey,
        system_program: SystemProgram.programId,
      })
      .rpc();

    console.log("✅ Platform initialized");
    console.log(`   Transaction: ${tx}`);

    // Fetch and display ALL Platform fields
    const platformAccount = await program.account.platform.fetch(platformPDA);
    console.log(`   Authority: ${platformAccount.authority.toBase58()}`);
    console.log(`   Total users count: ${platformAccount.total_users_count}`);
    console.log(`   Total reputation distributed: ${platformAccount.total_reputation_distributed}`);
    console.log(`   Created at: ${platformAccount.created_at}`);
    console.log(`   Updated at: ${platformAccount.updated_at}`);
    console.log(`   Authorized relayers: ${platformAccount.authorized_relayers.map(r => r.toBase58()).join(", ")}`);

    // Fetch and display ALL SolReserve fields
    const solReserveAccount = await program.account.solReserve.fetch(solReservePDA);
    console.log(`   SolReserve platform: ${solReserveAccount.platform.toBase58()}`);
    console.log(`   SolReserve total_inflow: ${solReserveAccount.total_inflow}`);
    console.log(`   SolReserve total_outflow: ${solReserveAccount.total_outflow}`);
    console.log(`   SolReserve created_at: ${solReserveAccount.created_at}`);
    console.log(`   SolReserve last_withdraw_ts: ${solReserveAccount.last_withdraw_ts}`);

    return true;
  } catch (error) {
    console.log(`❌ init_platform failed: ${error.message}`);
    return false;
  }
}

async function test_add_relayer(program, provider) {
  console.log("\n--- Testing add_relayer ---");
  
  try {
    const platformPDA = getAdminPDA(program);
    
    // Generate test relayer pubkey
    const relayerKeypair = Keypair.generate();
    const relayerPubkey = relayerKeypair.publicKey;

    // Call add_relayer instruction (exact name from Anchor)
    const tx = await program.methods
      .addRelayer(relayerPubkey)
      .accounts({
        platform: platformPDA,
        authority: provider.wallet.publicKey,
      })
      .rpc();

    console.log("✅ Relayer added");
    console.log(`   Transaction: ${tx}`);
    console.log(`   Relayer address: ${relayerPubkey.toBase58()}`);

    // Fetch and display Platform.authorized_relayers
    const platformAccount = await program.account.platform.fetch(platformPDA);
    console.log(`   Total authorized relayers: ${platformAccount.authorized_relayers.length}`);
    console.log(`   Relayers: ${platformAccount.authorized_relayers.map(r => r.toBase58()).join(", ")}`);

    return true;
  } catch (error) {
    console.log(`❌ add_relayer failed: ${error.message}`);
    return false;
  }
}

async function test_fund_vault(program, provider) {
  console.log("\n--- Testing fund_vault ---");
  
  try {
    const platformPDA = getAdminPDA(program);
    const solReservePDA = getSolReservePDA(program, platformPDA);
    const depositAmount = new anchor.BN(10 * anchor.web3.LAMPORTS_PER_SOL); // 10 SOL

    // Call fund_vault instruction (exact name from Anchor)
    const tx = await program.methods
      .fundVault(depositAmount)
      .accounts({
        platform: platformPDA,
        sol_reserve: solReservePDA,
        authority: provider.wallet.publicKey,
        system_program: SystemProgram.programId,
      })
      .rpc();

    console.log("✅ Vault funded");
    console.log(`   Transaction: ${tx}`);

    // Fetch and display ALL SolReserve fields
    const solReserveAccount = await program.account.solReserve.fetch(solReservePDA);
    console.log(`   SolReserve platform: ${solReserveAccount.platform.toBase58()}`);
    console.log(`   SolReserve total_inflow: ${solReserveAccount.total_inflow}`);
    console.log(`   SolReserve total_outflow: ${solReserveAccount.total_outflow}`);
    console.log(`   SolReserve created_at: ${solReserveAccount.created_at}`);
    console.log(`   SolReserve last_withdraw_ts: ${solReserveAccount.last_withdraw_ts}`);

    // Get account balance for verification
    const connection = provider.connection;
    const balanceLamports = await connection.getBalance(solReservePDA);
    const balanceSOL = balanceLamports / anchor.web3.LAMPORTS_PER_SOL;
    console.log(`   Account balance: ${balanceSOL} SOL`);

    return true;
  } catch (error) {
    console.log(`❌ fund_vault failed: ${error.message}`);
    return false;
  }
}

async function test_apply_reputation_action(program, provider) {
  console.log("\n--- Testing apply_reputation_action ---");
  
  try {
    // Generate test user
    const userKeypair = Keypair.generate();
    const userPubkey = userKeypair.publicKey;

    const platformPDA = getAdminPDA(program);
    const userRepPDA = getUserReputationPDA(program, userPubkey);
    const eventId = generateEventId();
    const actionReceiptPDA = getActionReceiptPDA(program, userPubkey, eventId);

    // Points: 10 for uploading notes (from state.rs)
    const actionPoints = new anchor.BN(10);
    const actionType = 0; // ReputationAction::UploadNotes

    // Call apply_reputation_action instruction (exact name from Anchor)
    const tx = await program.methods
      .applyReputationAction(actionType, eventId, userPubkey, actionPoints)
      .accounts({
        platform: platformPDA,
        sol_reserve: getSolReservePDA(program, platformPDA),
        user_reputation: userRepPDA,
        action_receipt: actionReceiptPDA,
        user: userPubkey,
        relayer: provider.wallet.publicKey,
        system_program: SystemProgram.programId,
      })
      .rpc();

    console.log("✅ Reputation action applied");
    console.log(`   Transaction: ${tx}`);

    // Fetch and display ALL UserReputation fields
    const userRepAccount = await program.account.userReputation.fetch(userRepPDA);
    console.log(`   UserReputation wallet: ${userRepAccount.wallet.toBase58()}`);
    console.log(`   registration_index: ${userRepAccount.registration_index}`);
    console.log(`   reputation_score: ${userRepAccount.reputation_score}`);
    console.log(`   total_notes_uploads: ${userRepAccount.total_notes_uploads}`);
    console.log(`   total_lab_reports_uploads: ${userRepAccount.total_lab_reports_uploads}`);
    console.log(`   total_questions: ${userRepAccount.total_questions}`);
    console.log(`   total_answers: ${userRepAccount.total_answers}`);
    console.log(`   total_accepted_answers: ${userRepAccount.total_accepted_answers}`);
    console.log(`   last_claim_ts: ${userRepAccount.last_claim_ts}`);
    console.log(`   last_updated: ${userRepAccount.last_updated}`);
    console.log(`   badge_tier: ${Object.keys(userRepAccount.badge_tier)[0]}`);
    console.log(`   is_top10: ${userRepAccount.is_top10}`);
    console.log(`   founding_member_bonus_claimed: ${userRepAccount.founding_member_bonus_claimed}`);
    console.log(`   current_login_streak_days: ${userRepAccount.current_login_streak_days}`);
    console.log(`   total_actions_processed: ${userRepAccount.total_actions_processed}`);

    // Fetch and display ActionReceipt fields
    const actionReceiptAccount = await program.account.actionReceipt.fetch(actionReceiptPDA);
    console.log(`   ActionReceipt user: ${actionReceiptAccount.user.toBase58()}`);
    console.log(`   ActionReceipt actor: ${actionReceiptAccount.actor.toBase58()}`);
    console.log(`   ActionReceipt action: ${actionReceiptAccount.action}`);
    console.log(`   ActionReceipt points_delta: ${actionReceiptAccount.points_delta}`);
    console.log(`   ActionReceipt timestamp: ${actionReceiptAccount.timestamp}`);

    return true;
  } catch (error) {
    console.log(`❌ apply_reputation_action failed: ${error.message}`);
    return false;
  }
}

async function test_set_top10_status(program, provider) {
  console.log("\n--- Testing set_top10_status ---");
  
  try {
    // Generate test user
    const userKeypair = Keypair.generate();
    const userPubkey = userKeypair.publicKey;

    const platformPDA = getAdminPDA(program);
    const userRepPDA = getUserReputationPDA(program, userPubkey);

    // First create user reputation by applying an action
    console.log("   Pre-requisite: Creating user reputation...");
    const eventId = generateEventId();
    const actionReceiptPDA = getActionReceiptPDA(program, userPubkey, eventId);

    await program.methods
      .applyReputationAction(0, eventId, userPubkey, new anchor.BN(10))
      .accounts({
        platform: platformPDA,
        sol_reserve: getSolReservePDA(program, platformPDA),
        user_reputation: userRepPDA,
        action_receipt: actionReceiptPDA,
        user: userPubkey,
        relayer: provider.wallet.publicKey,
        system_program: SystemProgram.programId,
      })
      .rpc();

    // Now call set_top10_status instruction (exact name from Anchor)
    const tx = await program.methods
      .setTop10Status(true) // Mark as top 10
      .accounts({
        platform: platformPDA,
        user_reputation: userRepPDA,
        authority: provider.wallet.publicKey,
      })
      .rpc();

    console.log("✅ Top 10 status updated");
    console.log(`   Transaction: ${tx}`);

    // Fetch and display ALL UserReputation fields after update
    const userRepAccount = await program.account.userReputation.fetch(userRepPDA);
    console.log(`   is_top10: ${userRepAccount.is_top10}`);
    console.log(`   badge_tier: ${Object.keys(userRepAccount.badge_tier)[0]}`);
    console.log(`   reputation_score: ${userRepAccount.reputation_score}`);
    console.log(`   last_updated: ${userRepAccount.last_updated}`);

    return true;
  } catch (error) {
    console.log(`❌ set_top10_status failed: ${error.message}`);
    return false;
  }
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runAllTests() {
  console.log("═".repeat(70));
  console.log("EduChain LocalNet Test Suite");
  console.log("═".repeat(70));

  try {
    // Connect to provider
    console.log("\n🔌 Connecting to localnet...");
    const provider = await getProvider();
    console.log(`✅ Connected to localnet at ${RPC_URL}`);
    console.log(`   Wallet: ${provider.wallet.publicKey.toBase58()}`);

    // Get balance
    const balance = await provider.connection.getBalance(provider.wallet.publicKey);
    const balanceSOL = balance / anchor.web3.LAMPORTS_PER_SOL;
    console.log(`   Balance: ${balanceSOL} SOL`);

    // Load program
    console.log(`\n📦 Loading program...`);
    const program = await getProgram(provider);
    console.log(`✅ Program ID: ${program.programId.toBase58()}`);

    // Run tests in sequence
    const results = [];
    results.push(await test_init_platform(program, provider));
    results.push(await test_add_relayer(program, provider));
    results.push(await test_fund_vault(program, provider));
    results.push(await test_apply_reputation_action(program, provider));
    results.push(await test_set_top10_status(program, provider));

    // Summary
    console.log("\n" + "═".repeat(70));
    const passed = results.filter((r) => r).length;
    const total = results.length;
    console.log(`📊 Test Summary: ${passed}/${total} passed`);

    if (passed === total) {
      console.log("✅ All tests passed!");
      process.exit(0);
    } else {
      console.log(`⚠️  ${total - passed} test(s) failed`);
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Test suite failed:", error);
    process.exit(1);
  }
}

// ============================================================================
// RUN
// ============================================================================

runAllTests();
