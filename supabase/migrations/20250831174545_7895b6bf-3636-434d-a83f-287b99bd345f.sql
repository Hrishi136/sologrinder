-- Fix search path for existing functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix search path for track_daily_login function
CREATE OR REPLACE FUNCTION public.track_daily_login()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_login_sessions (user_id, login_date)
  VALUES (auth.uid(), CURRENT_DATE)
  ON CONFLICT (user_id, login_date) DO NOTHING;
END;
$$;