const { PublicKey } = require('@solana/web3.js');
const crypto = require('crypto');

const PROGRAM_ID = new PublicKey(process.env.PROGRAM_ID);

function getPlatformPDA() {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('platform')],
    PROGRAM_ID
  );
  return pda;
}

function getSolReservePDA(platformPDA) {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('vault'), platformPDA.toBuffer()],
    PROGRAM_ID
  );
  return pda;
}

function getUserReputationPDA(userPubkey) {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('reputation'), userPubkey.toBuffer()],
    PROGRAM_ID
  );
  return pda;
}

function getActionReceiptPDA(userPubkey, eventId) {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('action_receipt'), userPubkey.toBuffer(), eventId],
    PROGRAM_ID
  );
  return pda;
}

function generateEventId() {
  const input = Math.random().toString() + Date.now().toString();
  return crypto.createHash('sha256').update(input).digest();
}

module.exports = {
  getPlatformPDA,
  getSolReservePDA,
  getUserReputationPDA,
  getActionReceiptPDA,
  generateEventId,
  PROGRAM_ID,
};
