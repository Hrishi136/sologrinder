-- Add bio field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN bio TEXT,
ADD COLUMN avatar_url TEXT;

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();