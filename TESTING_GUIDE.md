# 🧪 Q&A System - Step-by-Step Testing Guide

## Part 1: Environment Setup (5 minutes)

### Step 1.1: Start Backend
```bash
# Open Terminal 1
cd d:\Colesseum_hackthon\study_dao_vault\backend
npm start
```

**Wait for:**
```
✓ Express server started on port 3000
✓ Socket.io server initialized
```

### Step 1.2: Start Frontend
```bash
# Open Terminal 2 (NEW terminal, don't close Terminal 1!)
cd d:\Colesseum_hackthon\study_dao_vault\frontend
npm run dev
```

**Wait for:**
```
Local: http://localhost:5173
Press q to quit
```

### Step 1.3: Open Browser
- Open Chrome/Edge/Firefox
- Go to **http://localhost:5173**
- Should see homepage

---

## Part 2: Authentication (3 minutes)

### Step 2.1: Sign In
1. Click "Sign In" button (top right or home page)
2. Choose "Continue with Google" or "Sign up with Email"
3. Complete login flow
4. Should redirect to home page

### Step 2.2: Verify Logged In
- [ ] Your email shows in top right
- [ ] "Sign In" button is gone
- [ ] You can see your profile

### Step 2.3: Check Backend Logs
**In Terminal 1 (Backend), look for:**
```
[Some socket connection log if socket auto-connects]
```

---

## Part 3: Navigate to Q&A Page (2 minutes)

### Step 3.1: Find Q&A Page
1. Look for "Q&A" or "Questions" link in navigation
2. If not visible in nav, try:
   - Go to URL: `http://localhost:5173/qa`
   - Or look in sidebar/menu

### Step 3.2: Initial State
**Should see:**
```
Study DAO Vault: Live Feed

[Connected] badge in top right

Ask a Question
[Textarea with placeholder]

[Dropdown: Semester]
[Dropdown: Subject]
[Post to Vault button]

Questions (0)
Recent questions from the community

No questions yet. Be the first to ask!
```

### Step 3.3: Check Browser Console
Open **F12 Dev Tools** > **Console** tab

**Should see:**
```
✅ Supabase initialized
🔗 Socket listeners setup
```

---

## Part 4: Create First Question (5 minutes)

### Step 4.1: Fill Question Form
1. Click textarea
2. Type: `What is the difference between var and const in JavaScript?`
3. Select Semester: `2024 Fall` (or any option)
4. Select Subject: `JavaScript` (or any option)

### Step 4.2: Submit Question
1. Click **"Post to Vault"** button
2. Should see:
   - Alert disappears
   - Form clears
   - New question appears **immediately** at top of feed

### Step 4.3: Check Questions Count
- Should change from `Questions (0)` → `Questions (1)`
- Should see your question card with:
  - Your email
  - Timestamp (seconds ago)
  - Course
  - Semester  
  - Your question text

### Step 4.4: Check Backend Logs
**In Terminal 1, should see:**
```
📝 New question received: What is the difference between var...
✓ Question broadcasted to all clients
```

### Step 4.5: Check Browser Console
**In F12 Console, should see:**
```
✅ Question saved to Supabase: [some-uuid-here]
📡 vault_update: {type: 'question', action: 'created', ...}
✅ New question added
```

---

## Part 5: Real-Time Sync Test (5 minutes)

### Step 5.1: Open Second Tab
1. Open new browser tab
2. Go to `http://localhost:5173/qa`
3. **Both tabs should show:**
   - Same question
   - `Questions (1)`
   - Same count

### Step 5.2: Post from Tab 2
1. In **Tab 2**, write new question: `How do I use useEffect hook?`
2. Select semester and subject
3. Click "Post to Vault"
4. New question appears in Tab 2

### Step 5.3: Check Sync
**In Tab 1 (WITHOUT refreshing):**
- New question should appear automatically
- Count changes to `Questions (2)`
- Both tabs now in sync

**Backend logs show:**
```
📝 New question received: How do I use useEffect...
✓ Question broadcasted to all clients
```

### Step 5.4: Result
✅ **Real-time sync working!** Questions posted in one tab instantly appear in other tabs.

---

## Part 6: Post a Reply (5 minutes)

### Step 6.1: Find Question
- Locate your first question in the feed
- Should have "Comment" or "Answer/Comment" button

### Step 6.2: Add Reply
1. Click comment button/input
2. Type: `I think const is preferred because it prevents reassignment`
3. Click "Post" or "Send"

### Step 6.3: Verify Reply
- [ ] Reply appears below question
- [ ] Shows your email and timestamp
- [ ] Reply text visible
- [ ] No errors in console

### Step 6.4: Check Backend Logs
**Should see:**
```
💬 New reply received for question: [question-id]
✓ Reply broadcasted to all clients
```

### Step 6.5: Check Other Tab
- Tab 1 should show reply automatically
- No need to refresh

---

## Part 7: Refresh Persistence Test (3 minutes)

### Step 7.1: Refresh Page
- In Tab 1, press **F5** (refresh)
- Page reloads

### Step 7.2: Check Data
**Should see:**
- `Questions (2)` count preserved
- Both questions still visible
- All replies still there
- No data lost

### Step 7.3: Check Source
**Data came from:** Supabase (not socket)
- This proves questions are persistent
- Not just in memory

---

## Part 8: Supabase Verification (3 minutes)

### Step 8.1: Login to Supabase
1. Go to https://supabase.co
2. Login with same account
3. Select `study_dao_vault` project

### Step 8.2: Check Questions Table
1. Click **"Tables"** in left sidebar
2. Click **"questions"**
3. Should see:
   - All questions you posted
   - Timestamps
   - User emails
   - Course/Semester/Subject values

### Step 8.3: Check Replies Table
1. Click **"replies"** table
2. Should see:
   - All replies you posted
   - Linked to question_id
   - Your email and timestamp

---

## Summary Test Checklist

| Step | Test | Expected | Status |
|------|------|----------|--------|
| 1.1 | Backend starts | Port 3000 running | ✅ |
| 1.2 | Frontend starts | Vite server on 5173 | ✅ |
| 2.1 | User login | Redirects after auth | ✅ |
| 2.2 | Email visible | Shows your email | ✅ |
| 3.1 | Q&A page loads | Form and feed visible | ✅ |
| 3.2 | Connection badge | Shows "Connected" | ✅ |
| 4.1 | Post question | Saved to Supabase | ✅ |
| 4.2 | UI updates | Question appears immediately | ✅ |
| 4.3 | Count changes | Shows "Questions (1)" | ✅ |
| 5.1 | Tab 2 opens | Shows same data | ✅ |
| 5.2 | Post from Tab 2 | Question appears instantly | ✅ |
| 5.3 | Tab 1 syncs | Auto-updates without refresh | ✅ |
| 6.1 | Reply posted | Appears under question | ✅ |
| 6.2 | Other tabs | Show reply automatically | ✅ |
| 7.1 | Refresh page | Data persists | ✅ |
| 8.1 | Supabase | Questions visible in DB | ✅ |

---

## 🎉 Success Criteria

**If ALL tests pass (all ✅):**
- ✅ Q&A system fully operational
- ✅ Real-time sync working
- ✅ Data persisting properly
- ✅ Backend/Frontend/Database integrated

**If ANY test fails (❌):**
1. Note which step failed
2. Check browser console (F12) for errors
3. Check backend terminal for errors  
4. Look at relevant debug guide section
5. Restart both backend and frontend

---

## Common Issues During Testing

| Issue | Cause | Fix |
|-------|-------|-----|
| "Questions (0)" after posting | Data not loading from DB | Check Supabase credentials |
| No "Connected" badge | Socket not connecting | Check CORS in backend |
| Real-time not working | Socket event not received | Check both terminals for errors |
| Reply button missing | Component not rendering | Check browser console for errors |
| Page won't load | Frontend not running | Restart: `npm run dev` |
| Can't sign in | Auth not configured | Check Firebase config |

---

## Performance Expectations

- **Post question:** <500ms (appears instantly)
- **Real-time sync:** <100ms between tabs
- **Supabase insert:** <1 second total
- **Page reload:** <2 seconds
- **Socket connection:** <500ms on page load

If any operation takes much longer, check:
- Network tab (F12) for slow requests
- Browser console for errors
- Backend terminal for processing logs

---

## After Everything Works

Once all tests pass:
1. ✅ System is ready for production
2. ✅ Can add more features  
3. ✅ Can deploy to server
4. ✅ User testing can begin

Celebrate! 🎉 You've built a real-time Q&A system!
