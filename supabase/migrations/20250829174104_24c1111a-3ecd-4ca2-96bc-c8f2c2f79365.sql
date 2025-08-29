-- Create donors table for Hall of Fame
CREATE TABLE public.donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hunter_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view donors (public Hall of Fame)
CREATE POLICY "Anyone can view donors" 
ON public.donors 
FOR SELECT 
USING (true);

-- Create policy for inserting donors (for admin use)
CREATE POLICY "Service role can insert donors" 
ON public.donors 
FOR INSERT 
WITH CHECK (true);

-- Enable realtime for donors table
ALTER TABLE public.donors REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.donors;