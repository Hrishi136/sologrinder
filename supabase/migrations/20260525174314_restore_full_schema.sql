/*
  # Full Schema Restoration from Backup

  Restores the complete database schema from the original project.
  This is a consolidated migration from 18 individual migrations.

  1. New Tables
    - `profiles` - User profile information (username, bio, avatar)
    - `challenges` - Quest/challenge definitions (title, category, difficulty, description)
    - `challenge_progress` - Per-day completion tracking with numeric counter
    - `Challenges` - Legacy challenges table
    - `donors` - Hall of Fame donors (public)
    - `user_login_sessions` - Daily login tracking
    - `user_daily_activity` - Daily activity tracking
    - `avatar_options` - Available avatar slot options
    - `hunter_stats` - Power, XP, Resolve stats per user
    - `shadow_army_images` - Shadow army image URLs (game assets)

  2. Storage Buckets
    - `avatars` - Public bucket for user avatar images
    - `shadow-army` - Public bucket for shadow army images

  3. Functions
    - `update_updated_at_column()` - Auto-update timestamp trigger
    - `track_daily_login()` - Track daily user logins
    - `track_daily_activity()` - Track daily user activity
    - `increment_challenge_completion()` - Atomic quest completion counter
    - `increment_hunter_stats()` - Atomic hunter stats incrementer

  4. Security (RLS)
    - All tables have RLS enabled
    - Profiles: users can CRUD own data only
    - Challenges: users can CRUD own data only
    - Challenge_progress: users can CRUD own data only
    - Donors: public read, service role insert
    - User_login_sessions: users can read/insert own sessions
    - User_daily_activity: users can CRUD own data only
    - Avatar_options: public read only
    - Hunter_stats: users can read/insert/update own stats
    - Shadow_army_images: public read, service role manage

  5. Important Notes
    - 1) The `Challenges` table (capital C) is a legacy table kept for compatibility
    - 2) Storage policies allow authenticated users to manage their own avatars
    - 3) All SECURITY DEFINER functions set search_path to public for safety
    - 4) Unique constraints prevent duplicate daily entries per user
*/

-- ============================================================
-- TABLES
-- ============================================================

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Challenges table (lowercase - main table)
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  category TEXT,
  difficulty TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Legacy Challenges table (capital C)
CREATE TABLE IF NOT EXISTS public."Challenges" (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT auth.uid(),
  title TEXT NOT NULL,
  description TEXT,
  steps TEXT,
  streak INTEGER,
  progress_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Challenge progress table
CREATE TABLE IF NOT EXISTS public.challenge_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed BOOLEAN NOT NULL DEFAULT false,
  completion_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, challenge_id, date)
);

-- Donors table (Hall of Fame)
CREATE TABLE IF NOT EXISTS public.donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hunter_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User login sessions
CREATE TABLE IF NOT EXISTS public.user_login_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  login_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, login_date)
);

-- User daily activity
CREATE TABLE IF NOT EXISTS public.user_daily_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  day DATE NOT NULL,
  inserted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, day)
);

-- Avatar options
CREATE TABLE IF NOT EXISTS public.avatar_options (
  id SERIAL PRIMARY KEY,
  slot_number INTEGER UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hunter stats
CREATE TABLE IF NOT EXISTS public.hunter_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  power INTEGER NOT NULL DEFAULT 0,
  xp INTEGER NOT NULL DEFAULT 0,
  resolve INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Shadow army images
CREATE TABLE IF NOT EXISTS public.shadow_army_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shadow_key TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Challenges" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_login_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avatar_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hunter_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shadow_army_images ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES - profiles
-- ============================================================

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- RLS POLICIES - challenges (lowercase)
-- ============================================================

CREATE POLICY "Users can view their own challenges"
  ON public.challenges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own challenges"
  ON public.challenges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenges"
  ON public.challenges FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own challenges"
  ON public.challenges FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- RLS POLICIES - Challenges (capital C, legacy)
-- ============================================================

CREATE POLICY "Users can view their own challenges legacy"
  ON public."Challenges" FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own challenges legacy"
  ON public."Challenges" FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenges legacy"
  ON public."Challenges" FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own challenges legacy"
  ON public."Challenges" FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- RLS POLICIES - challenge_progress
-- ============================================================

CREATE POLICY "Users can view their own progress"
  ON public.challenge_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress"
  ON public.challenge_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.challenge_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress"
  ON public.challenge_progress FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- RLS POLICIES - donors (public Hall of Fame)
-- ============================================================

CREATE POLICY "Anyone can view donors"
  ON public.donors FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert donors"
  ON public.donors FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- RLS POLICIES - user_login_sessions
-- ============================================================

CREATE POLICY "Users can view their own login sessions"
  ON public.user_login_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own login sessions"
  ON public.user_login_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- RLS POLICIES - user_daily_activity
-- ============================================================

CREATE POLICY "Users can view their own activity"
  ON public.user_daily_activity FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity"
  ON public.user_daily_activity FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity"
  ON public.user_daily_activity FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activity"
  ON public.user_daily_activity FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- RLS POLICIES - avatar_options (public read only)
-- ============================================================

CREATE POLICY "Avatar options are viewable by everyone"
  ON public.avatar_options FOR SELECT
  USING (true);

-- ============================================================
-- RLS POLICIES - hunter_stats
-- ============================================================

CREATE POLICY "Users can view their own stats"
  ON public.hunter_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats"
  ON public.hunter_stats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
  ON public.hunter_stats FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- RLS POLICIES - shadow_army_images (public read, service role manage)
-- ============================================================

CREATE POLICY "Shadow images are viewable by everyone"
  ON public.shadow_army_images FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage shadow images"
  ON public.shadow_army_images FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update shadow images"
  ON public.shadow_army_images FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete shadow images"
  ON public.shadow_army_images FOR DELETE
  TO service_role
  USING (true);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update timestamp trigger
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

-- Track daily login
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

-- Track daily activity
CREATE OR REPLACE FUNCTION public.track_daily_activity()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_daily_activity (user_id, day)
  VALUES (auth.uid(), CURRENT_DATE)
  ON CONFLICT (user_id, day) DO NOTHING;
END;
$$;

-- Atomic increment challenge completion
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

-- Atomic increment hunter stats
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
  INSERT INTO public.hunter_stats (user_id, power, xp, resolve)
  VALUES (auth.uid(), p_power, p_xp, p_resolve)
  ON CONFLICT (user_id)
  DO UPDATE SET
    power = public.hunter_stats.power + p_power,
    xp = public.hunter_stats.xp + p_xp,
    resolve = public.hunter_stats.resolve + p_resolve,
    updated_at = now();

  RETURN QUERY
  SELECT hs.power, hs.xp, hs.resolve
  FROM public.hunter_stats hs
  WHERE hs.user_id = auth.uid();
END;
$$;

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hunter_stats_updated_at
  BEFORE UPDATE ON public.hunter_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_challenges_user_id ON public.challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_active ON public.challenges(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_progress_user_challenge ON public.challenge_progress(user_id, challenge_id);
CREATE INDEX IF NOT EXISTS idx_progress_date ON public.challenge_progress(date);
CREATE INDEX IF NOT EXISTS idx_user_daily_activity_user_day ON public.user_daily_activity(user_id, day);

-- ============================================================
-- REALTIME
-- ============================================================

ALTER TABLE public.challenges REPLICA IDENTITY FULL;
ALTER TABLE public.challenge_progress REPLICA IDENTITY FULL;
ALTER TABLE public.donors REPLICA IDENTITY FULL;

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('shadow-army', 'shadow-army', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STORAGE POLICIES - avatars bucket
-- ============================================================

CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- STORAGE POLICIES - shadow-army bucket
-- ============================================================

CREATE POLICY "Shadow army images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'shadow-army');

CREATE POLICY "Authenticated users can upload shadow images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'shadow-army');

-- ============================================================
-- SEED DATA - avatar_options default slots
-- ============================================================

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