-- Fix quest completion tracking to be a per-day numeric counter

-- 1) Add numeric completion counter (do not rely on boolean completed)
ALTER TABLE public.challenge_progress
ADD COLUMN IF NOT EXISTS completion_count INTEGER NOT NULL DEFAULT 0;

-- 2) Drop the incorrect uniqueness constraint that blocks multiple users and multiple completions patterns
ALTER TABLE public.challenge_progress
DROP CONSTRAINT IF EXISTS challenge_progress_challenge_id_date_key;

-- 3) Enforce one row per user/challenge/day (so we can atomically increment completion_count)
ALTER TABLE public.challenge_progress
ADD CONSTRAINT challenge_progress_user_challenge_date_key
UNIQUE (user_id, challenge_id, date);

-- 4) Atomic increment helper (returns the new completion_count for that day)
CREATE OR REPLACE FUNCTION public.increment_challenge_completion(
  p_challenge_id UUID,
  p_day DATE DEFAULT CURRENT_DATE
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  INSERT INTO public.challenge_progress (user_id, challenge_id, date, completed, completion_count)
  VALUES (auth.uid(), p_challenge_id, p_day, TRUE, 1)
  ON CONFLICT (user_id, challenge_id, date)
  DO UPDATE SET
    completion_count = public.challenge_progress.completion_count + 1,
    completed = TRUE
  RETURNING completion_count INTO new_count;

  RETURN new_count;
END;
$$;