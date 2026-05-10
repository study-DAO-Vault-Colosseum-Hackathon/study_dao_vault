-- Run this SQL in your Supabase project's SQL Editor
-- https://supabase.co -> study_dao_vault project -> SQL Editor

-- Create questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text,
  course text,
  semester text,
  subject text,
  tags jsonb DEFAULT '[]'::jsonb,
  user_id text,
  user_email text,
  upvotes integer DEFAULT 0,
  downvotes integer DEFAULT 0,
  reply_count integer DEFAULT 0,
  votes jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create replies table
CREATE TABLE IF NOT EXISTS public.replies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id uuid REFERENCES public.questions(id) ON DELETE CASCADE,
  content text NOT NULL,
  parent_id uuid,
  user_id text,
  user_email text,
  upvotes integer DEFAULT 0,
  downvotes integer DEFAULT 0,
  votes jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create votes table (optional but recommended)
CREATE TABLE IF NOT EXISTS public.votes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id uuid REFERENCES public.questions(id) ON DELETE CASCADE,
  reply_id uuid REFERENCES public.replies(id) ON DELETE CASCADE,
  user_id text,
  vote_type text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read (anyone can read)
CREATE POLICY "Allow public read on questions" ON public.questions
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on replies" ON public.replies
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on votes" ON public.votes
  FOR SELECT USING (true);

-- Create RLS policies for authenticated insert (only authenticated users can insert)
CREATE POLICY "Allow authenticated insert on questions" ON public.questions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on replies" ON public.replies
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on votes" ON public.votes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create RLS policies for user update/delete (users can only update/delete their own)
CREATE POLICY "Allow users to update own questions" ON public.questions
  FOR UPDATE USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Allow users to delete own questions" ON public.questions
  FOR DELETE USING (auth.uid()::text = user_id);

CREATE POLICY "Allow users to update own replies" ON public.replies
  FOR UPDATE USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Allow users to delete own replies" ON public.replies
  FOR DELETE USING (auth.uid()::text = user_id);

-- Create indexes for better performance
CREATE INDEX idx_questions_course_semester ON public.questions(course, semester);
CREATE INDEX idx_questions_subject ON public.questions(subject);
CREATE INDEX idx_questions_user_email ON public.questions(user_email);
CREATE INDEX idx_questions_created_at ON public.questions(created_at DESC);
CREATE INDEX idx_replies_question_id ON public.replies(question_id);
CREATE INDEX idx_replies_user_email ON public.replies(user_email);
CREATE INDEX idx_replies_created_at ON public.replies(created_at DESC);
