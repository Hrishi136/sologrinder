-- Create table to store shadow army images (URLs only, not the actual images)
CREATE TABLE public.shadow_army_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shadow_key TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shadow_army_images ENABLE ROW LEVEL SECURITY;

-- Anyone can view shadow images (they are game assets)
CREATE POLICY "Shadow images are viewable by everyone" 
ON public.shadow_army_images 
FOR SELECT 
USING (true);

-- Only service role can insert/update (admin only)
CREATE POLICY "Service role can manage shadow images" 
ON public.shadow_army_images 
FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');