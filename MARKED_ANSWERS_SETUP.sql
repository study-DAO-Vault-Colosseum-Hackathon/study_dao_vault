-- Add marked_answer_id column to messages table to track which reply is marked
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS marked_answer_id UUID REFERENCES messages(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_marked_answer_id ON messages(marked_answer_id);

-- Optional: Create a separate marked_answers table for better tracking (alternative approach)
-- Uncomment if you prefer this approach instead of the column above
/*
CREATE TABLE IF NOT EXISTS marked_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  answer_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  marked_by TEXT NOT NULL, -- user_id who marked it
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(question_id) -- Only one marked answer per question
);

CREATE INDEX idx_marked_answers_question ON marked_answers(question_id);
*/
