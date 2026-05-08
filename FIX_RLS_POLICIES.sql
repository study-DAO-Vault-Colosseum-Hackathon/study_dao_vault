-- Drop existing policies (if any) to avoid conflicts
DROP POLICY IF EXISTS "Enable read access for all users" ON votes;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON votes;

-- NEW POLICIES - These allow all operations without authentication checks
-- Policy 1: Allow anyone to READ all votes
CREATE POLICY "votes_select_policy" ON votes
  FOR SELECT USING (true);

-- Policy 2: Allow anyone to INSERT votes
CREATE POLICY "votes_insert_policy" ON votes
  FOR INSERT WITH CHECK (true);

-- Policy 3: Allow users to UPDATE their own votes (optional, for future unvote feature)
CREATE POLICY "votes_update_policy" ON votes
  FOR UPDATE USING (user_id = auth.uid()::text OR true) 
  WITH CHECK (user_id = auth.uid()::text OR true);

-- Policy 4: Allow users to DELETE their own votes (optional)
CREATE POLICY "votes_delete_policy" ON votes
  FOR DELETE USING (user_id = auth.uid()::text OR true);
