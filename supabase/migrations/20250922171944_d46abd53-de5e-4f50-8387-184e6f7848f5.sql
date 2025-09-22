-- Add difficulty column to challenges table to properly store quest difficulty
ALTER TABLE public.challenges 
ADD COLUMN difficulty text;

-- Add description column to challenges table to store quest descriptions
ALTER TABLE public.challenges 
ADD COLUMN description text;