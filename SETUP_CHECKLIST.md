# ✅ Q&A System - Complete Setup Checklist

## 🚀 Quick Start (Run These Commands)

### Backend Terminal:
```bash
cd backend
npm install socket.io
npm start
# Should show: ✓ Express server started on port 3000
#             ✓ Socket.io server initialized
```

### Frontend Terminal:
```bash
cd frontend
npm run dev
# Should show: ✓ Local: http://localhost:5173
```

---

## 📋 Verification Checklist

### 1. ✅ Backend Running
- [ ] Terminal shows port 3000 listening
- [ ] See "Socket.io server initialized"
- [ ] No errors in backend console

### 2. ✅ Frontend Running  
- [ ] Page loads at http://localhost:5173
- [ ] No console errors (F12)
- [ ] "Connected" status shown in Q&A header

### 3. ✅ Supabase Connection
Open browser console (F12) and paste:
```javascript
const { supabase } = await import('/src/supabase/supabaseClient.js');
const { data, error } = await supabase.from('questions').select('count');
console.log('Supabase:', !error ? '✅ Connected' : '❌ Error: ' + error.message);
```

### 4. ✅ Authentication
- [ ] Login/Sign in button visible
- [ ] Click to sign in with Google/Firebase
- [ ] After signin, username shows in top right

### 5. ✅ Post a Question
- [ ] Fill in: Title, Semester, Subject
- [ ] Click "Post to Vault"
- [ ] Should see:
  - Immediate UI update with your question
  - "Questions (1)" count increases
  - No error alerts

### 6. ✅ Real-time Sync
- [ ] Open same page in 2 browser tabs
- [ ] Post question in Tab 1
- [ ] Tab 2 should update **without refresh**

### 7. ✅ Data Persistence
- [ ] Refresh page
- [ ] Questions still visible
- [ ] Data loaded from Supabase ✓

---

## 🔧 Troubleshooting

### "Questions (0)" showing even after posting?
1. Check browser console (F12)
2. Look for errors
3. Check if "Connected" shows in header
4. Verify Supabase credentials in .env files

### Socket not connecting?
```javascript
// In browser console:
const { socket } = useContext(SocketContext);
console.log('Socket ID:', socket.id);
console.log('Connected:', socket.connected);
```

### Supabase can't read tables?
```sql
-- Run in Supabase SQL Editor:
SELECT * FROM questions LIMIT 1;
SELECT * FROM replies LIMIT 1;
-- Should work without errors
```

### Questions table doesn't exist?
Create it in Supabase with:
```sql
CREATE TABLE questions (
  id uuid default gen_random_uuid() primary key,
  title text,
  content text,
  course text,
  semester text,
  subject text,
  tags jsonb default '[]',
  user_id text,
  user_email text,
  upvotes integer default 0,
  downvotes integer default 0,
  reply_count integer default 0,
  votes jsonb default '[]',
  created_at timestamp default now(),
  updated_at timestamp default now()
);

CREATE TABLE replies (
  id uuid default gen_random_uuid() primary key,
  question_id uuid references questions(id),
  content text,
  parent_id uuid,
  user_id text,
  user_email text,
  upvotes integer default 0,
  downvotes integer default 0,
  votes jsonb default '[]',
  created_at timestamp default now(),
  updated_at timestamp default now()
);
```

---

## 📱 Expected Behavior

**Before Posting:**
```
Ask a Question
Get help from the community
[Textarea]
[Post to Vault]

Questions (0)
Recent questions from the community

No questions yet. Be the first to ask!
```

**After Posting:**
```
Ask a Question
...

Questions (1)
Recent questions from the community

[Question Card]
  User: email • timestamp
  Course • Semester
  Question Title
  Question Content
  ▲ 0 Answer/Comment
```

---

## 🎯 If Everything Still Not Working

1. **Check .env files** - Make sure Supabase credentials are correct
2. **Restart both** - Stop backend/frontend and restart
3. **Clear cache** - Ctrl+Shift+Del in browser
4. **Check console** - Look for red error messages in F12
5. **Verify Supabase** - Login to dashboard and check tables exist

---

## ✨ System Components

- ✅ **Frontend**: React + Socket.io Client + Supabase Client
- ✅ **Backend**: Express + Socket.io Server + Q&A Service
- ✅ **Database**: Supabase (PostgreSQL) for persistence
- ✅ **Real-time**: Socket.io for instant updates
- ✅ **Auth**: Firebase for user authentication
