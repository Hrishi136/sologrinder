-- Create table for tracking daily login sessions
CREATE TABLE public.user_login_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  login_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, login_date)
);

-- Enable RLS
ALTER TABLE public.user_login_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for user login sessions
CREATE POLICY "Users can view their own login sessions" 
ON public.user_login_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own login sessions" 
ON public.user_login_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to track daily login
CREATE OR REPLACE FUNCTION public.track_daily_login()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_login_sessions (user_id, login_date)
  VALUES (auth.uid(), CURRENT_DATE)
  ON CONFLICT (user_id, login_date) DO NOTHING;
END;
$$;