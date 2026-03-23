-- Migration: Split address text field into structured address fields
-- Adds street_address, city, state, zip_code columns and removes old address column

ALTER TABLE public.user_account
  ADD COLUMN IF NOT EXISTS street_address varchar(255),
  ADD COLUMN IF NOT EXISTS city varchar(100),
  ADD COLUMN IF NOT EXISTS state varchar(2),
  ADD COLUMN IF NOT EXISTS zip_code varchar(10);

-- Migrate existing data: copy address text into street_address as a fallback
UPDATE public.user_account SET street_address = address WHERE address IS NOT NULL AND street_address IS NULL;

ALTER TABLE public.user_account DROP COLUMN IF EXISTS address;
