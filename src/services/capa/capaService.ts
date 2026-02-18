
import { CAPA, CAPAStats } from '@/types/capa';
import { supabase } from '@/integrations/supabase/client';

export const getCAPAStats = async (): Promise<CAPAStats> => {
  const { data, error } = await supabase.from('capas').select('*');
  
  if (error) throw error;
  
  const capas = data || [];
  const stats: CAPAStats = {
    total: capas.length,
    open: capas.filter(c => c.status === 'Open').length,
    completed: capas.filter(c => c.status === 'Closed' || c.status === 'Completed').length,
    overdue: capas.filter(c => c.status === 'Overdue').length,
    inProgress: capas.filter(c => c.status === 'In Progress').length,
    openCount: capas.filter(c => c.status === 'Open').length,
    closedCount: capas.filter(c => c.status === 'Closed' || c.status === 'Completed').length,
    overdueCount: capas.filter(c => c.status === 'Overdue').length,
    pendingVerificationCount: capas.filter(c => c.status === 'Pending Verification').length,
    effectivenessRate: 0,
    byPriority: {},
    bySource: {},
    byDepartment: {},
    byStatus: {},
    byMonth: {},
    recentActivities: []
  };

  capas.forEach(c => {
    stats.byStatus[c.status] = (stats.byStatus[c.status] || 0) + 1;
    if (c.priority) stats.byPriority[c.priority] = (stats.byPriority[c.priority] || 0) + 1;
    if (c.source) stats.bySource[c.source] = (stats.bySource[c.source] || 0) + 1;
  });

  return stats;
};

export const getCAPAById = async (id: string): Promise<CAPA | null> => {
  const { data, error } = await supabase
    .from('capas')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching CAPA:', error);
    return null;
  }
  
  return data as unknown as CAPA;
};

export const createCAPA = async (capa: Partial<CAPA>): Promise<CAPA> => {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('capas')
    .insert({ ...capa, created_by: user?.id })
    .select()
    .single();
  if (error) throw error;
  return data as unknown as CAPA;
};

export const updateCAPA = async (id: string, updates: Partial<CAPA>): Promise<CAPA> => {
  const { data, error } = await supabase
    .from('capas')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as CAPA;
};

export const fetchAllCAPAs = async (): Promise<CAPA[]> => {
  const { data, error } = await supabase
    .from('capas')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as CAPA[];
};
