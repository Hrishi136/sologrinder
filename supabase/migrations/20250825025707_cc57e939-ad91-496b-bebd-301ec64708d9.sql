-- Create challenges table
CREATE TABLE public.challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create challenge_progress table
CREATE TABLE public.challenge_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(challenge_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for challenges
CREATE POLICY "Users can view their own challenges" 
ON public.challenges 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own challenges" 
ON public.challenges 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenges" 
ON public.challenges 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own challenges" 
ON public.challenges 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for challenge_progress
CREATE POLICY "Users can view their own progress" 
ON public.challenge_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress" 
ON public.challenge_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.challenge_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress" 
ON public.challenge_progress 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX idx_challenges_user_id ON public.challenges(user_id);
CREATE INDEX idx_challenges_active ON public.challenges(user_id, is_active);
CREATE INDEX idx_progress_user_challenge ON public.challenge_progress(user_id, challenge_id);
CREATE INDEX idx_progress_date ON public.challenge_progress(date);

-- Enable realtime for both tables
ALTER TABLE public.challenges REPLICA IDENTITY FULL;
ALTER TABLE public.challenge_progress REPLICA IDENTITY FULL;