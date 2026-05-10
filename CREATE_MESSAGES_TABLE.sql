-- Create messages table for Q&A functionality
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  content text NOT NULL,
  input text,
  semester text DEFAULT 'N/A',
  subject text DEFAULT 'General',
  user_name text,
  user_id text,
  photo_url text DEFAULT 'https://ui-avatars.com/api/?name=User',
  parent_id uuid,
  is_question boolean DEFAULT true,
  is_main_answer boolean DEFAULT false,
  upvotes integer DEFAULT 0,
  downvotes integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow public read
CREATE POLICY "Allow public read on messages" ON public.messages
  FOR SELECT USING (true);

-- Allow authenticated insert
CREATE POLICY "Allow authenticated insert on messages" ON public.messages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update/delete own messages
CREATE POLICY "Allow users to update own messages" ON public.messages
  FOR UPDATE USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Allow users to delete own messages" ON public.messages
  FOR DELETE USING (auth.uid()::text = user_id);

-- Create indexes for performance
CREATE INDEX idx_messages_parent_id ON public.messages(parent_id);
CREATE INDEX idx_messages_user_id ON public.messages(user_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_messages_is_question ON public.messages(is_question);
CREATE INDEX idx_messages_semester_subject ON public.messages(semester, subject);
