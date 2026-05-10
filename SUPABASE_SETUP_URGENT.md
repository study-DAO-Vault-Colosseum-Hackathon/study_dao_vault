# 🚀 URGENT: Create Supabase Tables

## Problem Found
The Q&A system failed because **Supabase tables don't exist**:
```
Error: Could not find the table 'public.questions' in the schema cache
```

## Solution: Create Tables Now

### Step 1: Open Supabase
1. Go to https://supabase.co
2. Login
3. Select **study_dao_vault** project
4. Click **SQL Editor** (left sidebar)

### Step 2: Create Tables
1. Click **New Query**
2. Copy the entire SQL from [CREATE_SUPABASE_TABLES.sql](CREATE_SUPABASE_TABLES.sql)
3. Paste into the SQL editor
4. Click **▶️ RUN** (top right, green button)

### Step 3: Verify
1. Click **Tables** in left sidebar
2. Should see:
   - `questions` table
   - `replies` table
   - `votes` table (optional)

### Step 4: Test Again
1. Go back to browser: http://localhost:5173/
2. Refresh page (F5)
3. Post a question again
4. Should work now! ✓

---

## If You See Errors

### "Error: Already exists"
- Tables already created (OK to ignore)
- Continue to Step 4

### "Permission denied"
- Your Supabase user doesn't have permission
- Ask team member with admin access to run SQL

### "Function auth not found"
- Supabase JWT extension not enabled
- Create policies without `auth.uid()` check:
  ```sql
  CREATE POLICY "Allow insert questions" ON public.questions
    FOR INSERT WITH CHECK (true);
  ```

---

## What Gets Created

| Table | Purpose |
|-------|---------|
| `questions` | Stores Q&A questions |
| `replies` | Stores replies/answers |
| `votes` | Tracks up/down votes |

Each table has:
- ✓ Auto-generated UUID ID
- ✓ User tracking (user_id, user_email)
- ✓ Timestamps (created_at, updated_at)
- ✓ Vote counting (upvotes, downvotes)
- ✓ RLS policies for security
- ✓ Indexes for fast queries

---

## After Tables Are Created

The Q&A system will:
1. ✅ Save questions to Supabase
2. ✅ Broadcast via Socket.io
3. ✅ Update all connected clients
4. ✅ Load questions on page refresh

---

**DO THIS FIRST BEFORE CONTINUING TESTS!**
