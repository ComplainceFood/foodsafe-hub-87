
import { supabase } from '@/integrations/supabase/client';

export interface Audit {
  id: string;
  title: string;
  description?: string;
  status: string;
  audit_type: string;
  start_date?: string;
  due_date?: string;
  completion_date?: string;
  assigned_to?: string;
  created_by?: string;
  department?: string;
  scope?: string;
  findings_count: number;
  created_at: string;
  updated_at: string;
}

export interface AuditFinding {
  id: string;
  audit_id: string;
  description: string;
  severity: string;
  status: string;
  due_date?: string;
  assigned_to?: string;
  evidence?: string;
  capa_id?: string;
  created_at: string;
  updated_at: string;
}

export const fetchAudits = async (): Promise<Audit[]> => {
  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as Audit[];
};

export const createAudit = async (audit: Partial<Audit>): Promise<Audit> => {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('audits')
    .insert({ ...audit, created_by: user?.id })
    .select()
    .single();
  if (error) throw error;
  return data as unknown as Audit;
};

export const fetchAuditById = async (id: string): Promise<Audit> => {
  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as unknown as Audit;
};

export const updateAudit = async (id: string, updates: Partial<Audit>): Promise<Audit> => {
  const { data, error } = await supabase
    .from('audits')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as Audit;
};

export const deleteAudit = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('audits').delete().eq('id', id);
  if (error) throw error;
  return true;
};

export const fetchAuditFindings = async (auditId: string): Promise<AuditFinding[]> => {
  const { data, error } = await supabase
    .from('audit_findings')
    .select('*')
    .eq('audit_id', auditId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as AuditFinding[];
};

export const createFinding = async (finding: Partial<AuditFinding>): Promise<AuditFinding> => {
  const { data, error } = await supabase
    .from('audit_findings')
    .insert(finding)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as AuditFinding;
};

export const updateFinding = async (id: string, updates: Partial<AuditFinding>): Promise<AuditFinding> => {
  const { data, error } = await supabase
    .from('audit_findings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as AuditFinding;
};

export const deleteFinding = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('audit_findings').delete().eq('id', id);
  if (error) throw error;
  return true;
};

export const exportAuditReport = async (auditId: string, format: string) => {
  return { url: `export-${auditId}.${format}` };
};

export default {
  fetchAudits,
  createAudit,
  fetchAuditById,
  updateAudit,
  deleteAudit,
  fetchAuditFindings,
  createFinding,
  updateFinding,
  deleteFinding,
  exportAuditReport
};
