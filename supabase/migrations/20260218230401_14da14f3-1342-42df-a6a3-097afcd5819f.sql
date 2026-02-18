
-- =============================================
-- PROFILES TABLE (auto-created on signup)
-- =============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'user',
  department TEXT,
  organization_id TEXT,
  status TEXT DEFAULT 'active',
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- NON-CONFORMANCES TABLE
-- =============================================
CREATE TABLE public.non_conformances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  assigned_to TEXT,
  department TEXT,
  location TEXT,
  root_cause TEXT,
  item_name TEXT NOT NULL DEFAULT '',
  item_id TEXT,
  item_category TEXT DEFAULT 'Other',
  reason_category TEXT,
  reason_details TEXT,
  resolution_details TEXT,
  risk_level TEXT DEFAULT 'Medium',
  severity TEXT,
  priority TEXT,
  immediate_action TEXT,
  corrective_action TEXT,
  preventive_action TEXT,
  capa_id TEXT,
  due_date TIMESTAMPTZ,
  closed_date TIMESTAMPTZ,
  reported_date TIMESTAMPTZ DEFAULT now(),
  review_date TIMESTAMPTZ,
  resolution_date TIMESTAMPTZ,
  quantity NUMERIC,
  quantity_on_hold NUMERIC,
  units TEXT,
  tags TEXT[]
);

ALTER TABLE public.non_conformances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view NCs" ON public.non_conformances FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create NCs" ON public.non_conformances FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Authenticated users can update NCs" ON public.non_conformances FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete NCs" ON public.non_conformances FOR DELETE TO authenticated USING (auth.uid() = created_by);

CREATE TRIGGER update_nc_updated_at BEFORE UPDATE ON public.non_conformances FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- NC Activities
CREATE TABLE public.nc_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  non_conformance_id UUID REFERENCES public.non_conformances(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  performed_by TEXT NOT NULL,
  performed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  previous_status TEXT,
  new_status TEXT,
  comments TEXT
);

ALTER TABLE public.nc_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view NC activities" ON public.nc_activities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can create NC activities" ON public.nc_activities FOR INSERT TO authenticated WITH CHECK (true);

-- NC Attachments
CREATE TABLE public.nc_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  non_conformance_id UUID REFERENCES public.non_conformances(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  description TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  uploaded_by TEXT NOT NULL
);

ALTER TABLE public.nc_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view NC attachments" ON public.nc_attachments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can create NC attachments" ON public.nc_attachments FOR INSERT TO authenticated WITH CHECK (true);

-- =============================================
-- AUDITS TABLE
-- =============================================
CREATE TABLE public.audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Scheduled',
  audit_type TEXT DEFAULT 'Internal',
  start_date TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  completion_date TIMESTAMPTZ,
  assigned_to TEXT,
  created_by UUID REFERENCES auth.users(id),
  department TEXT,
  scope TEXT,
  findings_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view audits" ON public.audits FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can create audits" ON public.audits FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Auth users can update audits" ON public.audits FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete audits" ON public.audits FOR DELETE TO authenticated USING (auth.uid() = created_by);

CREATE TRIGGER update_audits_updated_at BEFORE UPDATE ON public.audits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Audit Findings
CREATE TABLE public.audit_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES public.audits(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  severity TEXT DEFAULT 'Minor',
  status TEXT DEFAULT 'Open',
  due_date TIMESTAMPTZ,
  assigned_to TEXT,
  evidence TEXT,
  capa_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_findings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view findings" ON public.audit_findings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can create findings" ON public.audit_findings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update findings" ON public.audit_findings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete findings" ON public.audit_findings FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_findings_updated_at BEFORE UPDATE ON public.audit_findings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- CAPA TABLE
-- =============================================
CREATE TABLE public.capas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Open',
  priority TEXT DEFAULT 'Medium',
  source TEXT DEFAULT 'Internal Report',
  source_reference TEXT,
  root_cause TEXT,
  corrective_action TEXT,
  preventive_action TEXT,
  effectiveness_criteria TEXT,
  assigned_to TEXT,
  created_by UUID REFERENCES auth.users(id),
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.capas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view CAPAs" ON public.capas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can create CAPAs" ON public.capas FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Auth users can update CAPAs" ON public.capas FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete CAPAs" ON public.capas FOR DELETE TO authenticated USING (auth.uid() = created_by);

CREATE TRIGGER update_capas_updated_at BEFORE UPDATE ON public.capas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- COMPLAINTS TABLE
-- =============================================
CREATE TABLE public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'New',
  priority TEXT DEFAULT 'Medium',
  category TEXT DEFAULT 'Other',
  source TEXT,
  customer_name TEXT,
  customer_contact TEXT,
  product_name TEXT,
  batch_lot_number TEXT,
  assigned_to TEXT,
  created_by UUID REFERENCES auth.users(id),
  resolution TEXT,
  resolution_date TIMESTAMPTZ,
  capa_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view complaints" ON public.complaints FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can create complaints" ON public.complaints FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Auth users can update complaints" ON public.complaints FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete complaints" ON public.complaints FOR DELETE TO authenticated USING (auth.uid() = created_by);

CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON public.complaints FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- TRACEABILITY TABLES (Products, Components, Recalls)
-- =============================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT,
  batch_number TEXT,
  lot_number TEXT,
  category TEXT,
  status TEXT DEFAULT 'Active',
  manufactured_date TIMESTAMPTZ,
  expiry_date TIMESTAMPTZ,
  supplier_id TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view products" ON public.products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can create products" ON public.products FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Auth users can update products" ON public.products FOR UPDATE TO authenticated USING (true);

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  supplier TEXT,
  batch_number TEXT,
  lot_number TEXT,
  status TEXT DEFAULT 'Active',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view components" ON public.components FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can create components" ON public.components FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Auth users can update components" ON public.components FOR UPDATE TO authenticated USING (true);

CREATE TRIGGER update_components_updated_at BEFORE UPDATE ON public.components FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.product_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  component_id UUID REFERENCES public.components(id) ON DELETE CASCADE NOT NULL,
  quantity NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.product_components ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view product_components" ON public.product_components FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can create product_components" ON public.product_components FOR INSERT TO authenticated WITH CHECK (true);

CREATE TABLE public.recalls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'Draft',
  severity TEXT DEFAULT 'Medium',
  affected_products TEXT[],
  affected_batches TEXT[],
  initiated_by UUID REFERENCES auth.users(id),
  initiated_date TIMESTAMPTZ DEFAULT now(),
  completion_date TIMESTAMPTZ,
  notification_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.recalls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view recalls" ON public.recalls FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can create recalls" ON public.recalls FOR INSERT TO authenticated WITH CHECK (auth.uid() = initiated_by);
CREATE POLICY "Auth users can update recalls" ON public.recalls FOR UPDATE TO authenticated USING (true);

CREATE TRIGGER update_recalls_updated_at BEFORE UPDATE ON public.recalls FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- DOCUMENTS TABLE
-- =============================================
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  status TEXT DEFAULT 'Draft',
  category TEXT,
  version TEXT DEFAULT '1.0',
  file_path TEXT,
  file_type TEXT,
  created_by UUID REFERENCES auth.users(id),
  approved_by TEXT,
  department TEXT,
  tags TEXT[],
  expiry_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view documents" ON public.documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can create documents" ON public.documents FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Auth users can update documents" ON public.documents FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete documents" ON public.documents FOR DELETE TO authenticated USING (auth.uid() = created_by);

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- SUPPLIERS TABLE
-- =============================================
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  status TEXT DEFAULT 'Active',
  risk_level TEXT DEFAULT 'Low',
  category TEXT,
  certification TEXT[],
  last_audit_date TIMESTAMPTZ,
  next_audit_date TIMESTAMPTZ,
  rating NUMERIC,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view suppliers" ON public.suppliers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can create suppliers" ON public.suppliers FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Auth users can update suppliers" ON public.suppliers FOR UPDATE TO authenticated USING (true);

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- TRAINING TABLE
-- =============================================
CREATE TABLE public.training_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  training_type TEXT DEFAULT 'Other',
  category TEXT,
  status TEXT DEFAULT 'Not Started',
  assigned_to TEXT,
  trainer TEXT,
  due_date TIMESTAMPTZ,
  completion_date TIMESTAMPTZ,
  score NUMERIC,
  department TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.training_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view training" ON public.training_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can create training" ON public.training_records FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Auth users can update training" ON public.training_records FOR UPDATE TO authenticated USING (true);

CREATE TRIGGER update_training_updated_at BEFORE UPDATE ON public.training_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
