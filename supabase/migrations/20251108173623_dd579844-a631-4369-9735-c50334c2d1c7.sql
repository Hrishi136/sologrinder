-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create table to store available avatar options
CREATE TABLE IF NOT EXISTS public.avatar_options (
  id SERIAL PRIMARY KEY,
  slot_number INTEGER UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.avatar_options ENABLE ROW LEVEL SECURITY;

-- Everyone can view avatar options
CREATE POLICY "Avatar options are viewable by everyone"
ON public.avatar_options
FOR SELECT
USING (true);

-- Only authenticated users can upload avatars
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Everyone can view avatars
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

-- Authenticated users can update their uploads
CREATE POLICY "Authenticated users can update avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars');

-- Authenticated users can delete avatars
CREATE POLICY "Authenticated users can delete avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'avatars');

-- Insert default placeholder slots
INSERT INTO public.avatar_options (slot_number, avatar_url)
VALUES 
  (1, NULL),
  (2, NULL),
  (3, NULL),
  (4, NULL),
  (5, NULL),
  (6, NULL),
  (7, NULL),
  (8, NULL)
ON CONFLICT (slot_number) DO NOTHING;