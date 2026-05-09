-- Run this SQL in your Supabase SQL Editor to create the votes table

CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Ensure one vote per user per message (unique constraint)
  UNIQUE(message_id, user_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_votes_message_id ON votes(message_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);

-- Optional: Add RLS (Row Level Security) policies if needed
-- Enable RLS on votes table
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read votes
CREATE POLICY "Enable read access for all users" ON votes
  FOR SELECT USING (true);

-- Allow authenticated users to insert votes
CREATE POLICY "Enable insert for authenticated users" ON votes
  FOR INSERT WITH CHECK (true);
