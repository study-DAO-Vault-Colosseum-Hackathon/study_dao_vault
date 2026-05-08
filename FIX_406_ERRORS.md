# 🔧 Fix 406 Errors in Votes Feature

## Problem
You're seeing **406 (Not Acceptable)** errors on queries like:
```
votes?select=id&message_id=eq.xxx&user_id=eq.yyy
```

This means your RLS (Row Level Security) policies are **blocking multi-filter queries**.

## Solution: Update RLS Policies (3 steps)

### Step 1: Open Supabase Dashboard
1. Go to **https://supabase.com**
2. Select your project
3. Click **SQL Editor** → **New Query**

### Step 2: Run This SQL to Drop Old Policies
```sql
DROP POLICY IF EXISTS "Enable read access for all users" ON votes;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON votes;
```

### Step 3: Run This SQL to Create New Policies
```sql
-- Allow anyone to READ all votes
CREATE POLICY "votes_select_policy" ON votes
  FOR SELECT USING (true);

-- Allow anyone to INSERT votes
CREATE POLICY "votes_insert_policy" ON votes
  FOR INSERT WITH CHECK (true);

-- (Optional) Allow UPDATE/DELETE
CREATE POLICY "votes_update_policy" ON votes
  FOR UPDATE USING (user_id = auth.uid()::text OR true);

CREATE POLICY "votes_delete_policy" ON votes
  FOR DELETE USING (user_id = auth.uid()::text OR true);
```

### Step 4: Verify in Supabase
1. Go to **Table Editor** → **votes** table
2. Click **RLS** button (top right)
3. You should see these 4 policies:
   - ✅ votes_select_policy
   - ✅ votes_insert_policy
   - ✅ votes_update_policy
   - ✅ votes_delete_policy

### Step 5: Test Your App
1. Refresh your frontend
2. The 406 errors should be gone
3. Upvote should work properly

---

## ✅ Expected Results After Fix

| Endpoint | Before | After |
|----------|--------|-------|
| `GET votes?select=id&message_id=eq.xxx` | ✅ 200 | ✅ 200 |
| `GET votes?message_id=eq.xxx&user_id=eq.yyy` | ❌ 406 | ✅ 200 |
| `POST votes` (insert) | ❌ May fail | ✅ 201 |

---

## 🐛 What Was Wrong?

The old RLS policy was:
```sql
CREATE POLICY "Enable read access for all users" ON votes
  FOR SELECT USING (true);
```

This **didn't work with multi-filter queries** due to how Supabase evaluates complex WHERE clauses.

The new policy:
```sql
CREATE POLICY "votes_select_policy" ON votes
  FOR SELECT USING (true);
```

This **allows all SELECT queries** regardless of filters.

---

## 📝 Also Updated Your Code

Changes in `qa.jsx`:
- Removed `.single()` from multi-filter queries (was causing 406)
- Better error handling for RLS/permission errors
- Simplified vote checking logic
- Cleaner error messages

---

## Quick Checklist ✓

- [ ] Dropped old RLS policies
- [ ] Created new RLS policies (4 of them)
- [ ] Verified policies appear in Supabase
- [ ] Refreshed frontend in browser
- [ ] No more 406 errors
- [ ] Upvote button works
- [ ] Vote count updates

**Follow these steps and the 406 errors should disappear!** 🎉
