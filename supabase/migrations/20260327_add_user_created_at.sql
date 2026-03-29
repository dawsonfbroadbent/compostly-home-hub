-- Add created_at timestamp to user_account so we can track when users signed up
ALTER TABLE public.user_account
  ADD COLUMN IF NOT EXISTS created_at timestamp with time zone NOT NULL DEFAULT now();
