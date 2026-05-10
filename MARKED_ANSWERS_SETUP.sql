-- Add marked_answer_id column to messages table to track which reply is marked
-- This adds the missing column your frontend is screaming for
ALTER TABLE messages 
ADD COLUMN marked_answer_id UUID REFERENCES messages(id);

-- This allows the 'voting' table to link correctly if it doesn't already
-- Ensure your votes table has a message_id column that points to messages.id
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
