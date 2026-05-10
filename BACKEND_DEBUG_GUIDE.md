# 🐛 Backend Debug Guide

## Expected Console Logs on Startup

When you run `npm start` in backend, you should see:

```
✓ Express server started on port 3000
✓ Socket.io server initialized
✓ CORS enabled for: http://localhost:5173, http://localhost:5174, http://localhost:5175, http://localhost:5176, http://localhost:5177
✓ Supabase client initialized
```

---

## Expected Logs on User Connection

When frontend connects to backend:

```
[Socket Connection] New client connected: socket_id_here
[Socket Connection] Total connected clients: 1
```

---

## Expected Logs on Question Posted

When user posts question:

```
[Event] new_question received: {
  title: "My Question",
  content: "Full question text",
  course: "BSc CSIT",
  semester: "2024 Fall",
  subject: "JavaScript"
}
[Database] Inserting question to Supabase
[Success] Question saved with ID: question_uuid_here
[Broadcast] Sending vault_update to all clients
```

---

## Expected Logs on Reply Posted

```
[Event] new_reply received: {
  question_id: "xxx",
  content: "Reply text",
  parent_id: null
}
[Database] Inserting reply to Supabase
[Success] Reply saved with ID: reply_uuid_here
[Broadcast] Sending vault_update to all clients
```

---

## If Something Is Missing

### ❌ No "Express server started"
- [ ] Check port 3000 is not in use: `netstat -an | grep 3000`
- [ ] Try different port in backend/src/index.js

### ❌ No "Socket.io server initialized"
- [ ] Check `require('socket.io')` is present
- [ ] Verify Socket.io installed: `npm list socket.io`
- [ ] Reinstall: `npm install socket.io`

### ❌ No socket connection logs
- [ ] Check CORS origins in backend/src/index.js
- [ ] Verify frontend is trying to connect
- [ ] Check browser console for connection errors

### ❌ No "Inserting question" when posting
- [ ] Question not reaching backend (socket not connected)
- [ ] Error in event handler (check for try-catch errors)
- [ ] Supabase client not initialized

---

## Debug Output - Add to backend/src/index.js

Add these log statements to see more details:

```javascript
// At top of new_question handler:
console.log('[Event] new_question received:', {
  title: questionData.title,
  email: questionData.user_email,
  timestamp: new Date().toISOString()
});

// Before Supabase insert:
console.log('[Database] Inserting question to Supabase...');

// After successful insert:
console.log('[Success] Question saved with ID:', result.id);
console.log('[Success] Now broadcasting to', io.engine.clientsCount, 'clients');

// When broadcasting:
io.emit('vault_update', {
  type: 'question',
  action: 'created',
  data: result,
  timestamp: new Date().toISOString()
});
console.log('[Broadcast] vault_update sent to all clients');
```

---

## Network Tab Debug

Open browser F12 > Network tab:

1. Filter by "Websocket"
2. Look for connection to `localhost:3000` or similar
3. Should see WebSocket connection **open** (not failed)
4. When you post question, should see a message sent

---

## Supabase Debug

Add logging to qaService.js:

```javascript
async function createQuestion(questionData) {
  console.log('[Supabase] Creating question:', questionData.title);
  
  const { data, error } = await supabase
    .from('questions')
    .insert([questionData])
    .select();
  
  if (error) {
    console.error('[Supabase Error]', error.message);
    throw error;
  }
  
  console.log('[Supabase Success] Question created with ID:', data[0].id);
  return data[0];
}
```

---

## Full Request → Response Flow

```
Frontend Form Submit
    ↓
Check if user logged in
    ↓
Collect form data
    ↓
Emit 'new_question' socket event
    ↓
[BACKEND] Receive event handler
    ↓
Insert to Supabase
    ↓
Get saved record with ID
    ↓
Broadcast 'vault_update' to all clients
    ↓
[FRONTEND] Receive vault_update
    ↓
Add to messages state
    ↓
Re-render with new question
    ↓
User sees question immediately
```

Each step should log. If a step is missing, that's where the issue is.

---

## Common Issues & Fixes

| Problem | Log | Fix |
|---------|-----|-----|
| Socket not connecting | No "New client connected" | Check CORS, check frontend URL |
| Question not saving | Error in console | Check Supabase credentials |
| No UI update | Broadcast sent but no change | Check if listener registered |
| Questions showing 0 | But backend saved question | Check fetch query, check RLS |

---

## Enable Maximum Logging

Add at top of backend/src/index.js:

```javascript
// Socket.io debug
const socketDebug = require('debug');
socketDebug.enable('socket.io:*');

// All events logged
io.on('connection', (socket) => {
  console.log('[SOCKET] Connected:', socket.id);
  
  socket.on('*', (event) => {
    console.log('[EVENT] Received:', event[0], event[1]);
  });
});
```

Now every socket event will be logged with full details.
