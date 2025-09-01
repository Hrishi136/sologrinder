-- Create user_daily_activity table for tracking unique login days
CREATE TABLE public.user_daily_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  day DATE NOT NULL,
  inserted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, day)
);

-- Enable Row Level Security
ALTER TABLE public.user_daily_activity ENABLE ROW LEVEL SECURITY;

-- Create policies for user_daily_activity
CREATE POLICY "Users can view their own activity" 
ON public.user_daily_activity 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity" 
ON public.user_daily_activity 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity" 
ON public.user_daily_activity 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activity" 
ON public.user_daily_activity 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for better performance on user_id, day queries
CREATE INDEX idx_user_daily_activity_user_day ON public.user_daily_activity(user_id, day);

-- Create function to track daily activity
CREATE OR REPLACE FUNCTION public.track_daily_activity()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.user_daily_activity (user_id, day)
  VALUES (auth.uid(), CURRENT_DATE)
  ON CONFLICT (user_id, day) DO NOTHING;
END;
$$;