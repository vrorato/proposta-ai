-- 01_fix_missing_columns.sql

-- Fix Proposals table
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft';
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS language text DEFAULT 'pt-BR';

-- Fix Profiles table (Exhaustive check)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_document text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_address text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_logo_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS brand_primary_color text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS brand_secondary_color text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS brand_font text DEFAULT 'sans';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS default_tone text DEFAULT 'profissional';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS default_currency text DEFAULT 'BRL';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS default_expiration_days integer DEFAULT 15;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS default_payment_terms text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS default_terms_conditions text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS digital_signature_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS professional_description text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS main_services text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS professional_differentials text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS portfolio_links text;

-- Fix Proposal Clients
ALTER TABLE public.proposal_clients ADD COLUMN IF NOT EXISTS segment text;

-- Fix Proposal Services
ALTER TABLE public.proposal_services ADD COLUMN IF NOT EXISTS differentials text;
ALTER TABLE public.proposal_services ADD COLUMN IF NOT EXISTS extra_info text;
ALTER TABLE public.proposal_services ADD COLUMN IF NOT EXISTS tone text;

-- Fix AI Suggestions
ALTER TABLE public.proposal_ai_suggestions ADD COLUMN IF NOT EXISTS suggested_expiration text;
ALTER TABLE public.proposal_ai_suggestions ADD COLUMN IF NOT EXISTS suggested_payment_terms text;
