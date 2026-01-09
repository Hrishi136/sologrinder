-- Create storage bucket for shadow army images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('shadow-army', 'shadow-army', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view shadow army images
CREATE POLICY "Shadow army images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'shadow-army');

-- Allow authenticated users to upload (for initial setup)
CREATE POLICY "Authenticated users can upload shadow images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'shadow-army' AND auth.role() = 'authenticated');