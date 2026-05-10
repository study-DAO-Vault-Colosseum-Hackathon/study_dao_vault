/**
 * Manual Socket.io Test Script
 * Tests that backend socket broadcasting works correctly
 * 
 * Run: node test-socket-emit.js
 */

const io = require('socket.io-client');

// Connect to backend
const socket = io('http://localhost:3000', {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});

console.log('🔌 Connecting to Socket.io server on port 3000...\n');

// Listen for connection
socket.on('connect', () => {
  console.log('✅ Connected to backend socket server!');
  console.log(`Socket ID: ${socket.id}\n`);
  
  // Test 1: Emit a new_question event
  console.log('📤 TEST 1: Emitting new_question event...');
  const testQuestion = {
    id: `test-${Date.now()}`,
    message: 'Test Question: What is 2 + 2?',
    user_name: 'TestBot',
    user_email: 'test@example.com',
    user_id: 'test-user-123',
    is_question: true,
    parent_id: null,
    created_at: new Date().toISOString()
  };
  
  socket.emit('new_question', testQuestion);
  console.log('  → Sent:', JSON.stringify(testQuestion, null, 2));
  
  // Listen for the vault_update broadcast
  socket.on('vault_update', (data) => {
    console.log('\n📡 TEST 1 RESULT: Received vault_update event!');
    console.log('  Data:', JSON.stringify(data, null, 2));
    console.log('\n✅ TEST 1 PASSED: Backend is broadcasting correctly!\n');
    
    // Test 2: Test reply event
    console.log('📤 TEST 2: Emitting new_reply event...');
    const testReply = {
      id: `reply-${Date.now()}`,
      message: 'Test Reply: The answer is 4!',
      user_name: 'TestBot2',
      user_email: 'test2@example.com',
      user_id: 'test-user-456',
      is_question: false,
      parent_id: testQuestion.id,
      created_at: new Date().toISOString()
    };
    
    socket.emit('new_reply', testReply);
    console.log('  → Sent:', JSON.stringify(testReply, null, 2));
  });
  
  // Timeout after 5 seconds
  setTimeout(() => {
    console.log('\n⏱️  Timeout - closing connection...');
    socket.disconnect();
    process.exit(0);
  }, 5000);
});

socket.on('disconnect', () => {
  console.log('\n🔌 Disconnected from server');
});

socket.on('error', (error) => {
  console.error('\n❌ Socket error:', error);
  process.exit(1);
});

socket.on('connect_error', (error) => {
  console.error('\n❌ Connection error:', error);
  process.exit(1);
});

console.log('⏳ Waiting for connection (timeout in 10 seconds)...\n');

setTimeout(() => {
  if (!socket.connected) {
    console.error('\n❌ Failed to connect to backend socket server!');
    console.error('Make sure backend is running with: cd backend && npm start');
    process.exit(1);
  }
}, 10000);
