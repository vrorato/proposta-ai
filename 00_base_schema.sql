-- 00_base_schema.sql
-- Base schema for PropostaAI reconstructed from PRD.md

-- 1. Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name text,
  email text,
  company_name text,
  company_document text,
  company_address text,
  phone text,
  website text,
  company_logo_url text,
  brand_primary_color text,
  brand_secondary_color text,
  brand_font text DEFAULT 'sans',
  default_tone text DEFAULT 'profissional',
  default_currency text DEFAULT 'BRL',
  default_expiration_days integer DEFAULT 15,
  default_payment_terms text,
  default_terms_conditions text,
  digital_signature_url text,
  professional_description text,
  main_services text,
  professional_differentials text,
  portfolio_links text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. Proposals Table
CREATE TABLE IF NOT EXISTS public.proposals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  title text,
  language text DEFAULT 'pt-BR',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  finalized_at timestamptz
);

ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can perform all actions on own proposals" ON public.proposals
  FOR ALL USING (auth.uid() = user_id);

-- 3. Proposal Clients Table
CREATE TABLE IF NOT EXISTS public.proposal_clients (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id uuid REFERENCES public.proposals(id) ON DELETE CASCADE UNIQUE NOT NULL,
  client_name text NOT NULL,
  client_company text,
  client_email text,
  client_phone text,
  client_notes text,
  segment text
);

ALTER TABLE public.proposal_clients ENABLE ROW LEVEL SECURITY;

-- 4. Proposal Services Table
CREATE TABLE IF NOT EXISTS public.proposal_services (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id uuid REFERENCES public.proposals(id) ON DELETE CASCADE UNIQUE NOT NULL,
  service_description text NOT NULL,
  scope text,
  deliverables text,
  estimated_hours integer,
  deadline text,
  complexity text,
  category text,
  differentials text,
  extra_info text,
  tone text
);

ALTER TABLE public.proposal_services ENABLE ROW LEVEL SECURITY;

-- 5. Proposal AI Suggestions Table
CREATE TABLE IF NOT EXISTS public.proposal_ai_suggestions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id uuid REFERENCES public.proposals(id) ON DELETE CASCADE UNIQUE NOT NULL,
  suggested_value numeric,
  suggested_value_min numeric,
  suggested_value_max numeric,
  suggested_structure jsonb,
  suggested_tone text,
  reasoning text,
  suggested_expiration text,
  suggested_payment_terms text,
  user_approved boolean DEFAULT false,
  user_adjusted_value numeric,
  user_adjusted_tone text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.proposal_ai_suggestions ENABLE ROW LEVEL SECURITY;

-- 6. Proposal Finals Table
CREATE TABLE IF NOT EXISTS public.proposal_finals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id uuid REFERENCES public.proposals(id) ON DELETE CASCADE UNIQUE NOT NULL,
  final_content text NOT NULL,
  final_value numeric NOT NULL,
  pdf_url text,
  version integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.proposal_finals ENABLE ROW LEVEL SECURITY;

-- 7. Templates Table
CREATE TABLE IF NOT EXISTS public.templates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL,
  description text,
  structure jsonb NOT NULL,
  default_tone text,
  is_system boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Templates visible to all if system or owned" ON public.templates
  FOR SELECT USING (is_system = true OR user_id = auth.uid());

CREATE POLICY "Users can manage own templates" ON public.templates
  FOR ALL USING (user_id = auth.uid() AND is_system = false);

-- Helper Policies for Join Tables
CREATE POLICY "RLS Client access" ON public.proposal_clients
  FOR ALL USING (EXISTS (SELECT 1 FROM public.proposals WHERE id = proposal_id AND user_id = auth.uid()));

CREATE POLICY "RLS Services access" ON public.proposal_services
  FOR ALL USING (EXISTS (SELECT 1 FROM public.proposals WHERE id = proposal_id AND user_id = auth.uid()));

CREATE POLICY "RLS AI Suggestions access" ON public.proposal_ai_suggestions
  FOR ALL USING (EXISTS (SELECT 1 FROM public.proposals WHERE id = proposal_id AND user_id = auth.uid()));

CREATE POLICY "RLS Finals access" ON public.proposal_finals
  FOR ALL USING (EXISTS (SELECT 1 FROM public.proposals WHERE id = proposal_id AND user_id = auth.uid()));

-- Profile Creation Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
