-- Create hunter_stats table to persist Power, XP, Resolve
CREATE TABLE public.hunter_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  power INTEGER NOT NULL DEFAULT 0,
  xp INTEGER NOT NULL DEFAULT 0,
  resolve INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hunter_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own stats"
ON public.hunter_stats
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats"
ON public.hunter_stats
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
ON public.hunter_stats
FOR UPDATE
USING (auth.uid() = user_id);

-- Create function to atomically increment hunter stats
CREATE OR REPLACE FUNCTION public.increment_hunter_stats(
  p_power INTEGER DEFAULT 0,
  p_xp INTEGER DEFAULT 0,
  p_resolve INTEGER DEFAULT 0
)
RETURNS TABLE(power INTEGER, xp INTEGER, resolve INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Upsert: insert if not exists, update if exists
  INSERT INTO public.hunter_stats (user_id, power, xp, resolve)
  VALUES (auth.uid(), p_power, p_xp, p_resolve)
  ON CONFLICT (user_id)
  DO UPDATE SET
    power = public.hunter_stats.power + p_power,
    xp = public.hunter_stats.xp + p_xp,
    resolve = public.hunter_stats.resolve + p_resolve,
    updated_at = now();

  -- Return the updated stats
  RETURN QUERY
  SELECT hs.power, hs.xp, hs.resolve
  FROM public.hunter_stats hs
  WHERE hs.user_id = auth.uid();
END;
$$;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_hunter_stats_updated_at
BEFORE UPDATE ON public.hunter_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();