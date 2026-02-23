
import { Complaint, ComplaintFilter } from '@/types/complaint';
import { ComplaintStatus, ComplaintCategory, ComplaintPriority } from '@/types/enums';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const fetchComplaints = async (filters?: ComplaintFilter): Promise<Complaint[]> => {
  try {
    let query = supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (filters) {
      if (filters.status) {
        if (Array.isArray(filters.status)) query = query.in('status', filters.status);
        else query = query.eq('status', filters.status);
      }
      if (filters.category) {
        if (Array.isArray(filters.category)) query = query.in('category', filters.category);
        else query = query.eq('category', filters.category);
      }
      if (filters.priority) {
        if (Array.isArray(filters.priority)) query = query.in('priority', filters.priority);
        else query = query.eq('priority', filters.priority);
      }
      if (filters.dateRange) {
        query = query.gte('created_at', filters.dateRange.start).lte('created_at', filters.dateRange.end);
      }
      if (filters.searchTerm) {
        query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%,customer_name.ilike.%${filters.searchTerm}%`);
      }
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as unknown as Complaint[];
  } catch (error) {
    console.error('Error fetching complaints:', error);
    toast({ title: "Failed to load complaints", description: "There was an error fetching the complaints data.", variant: "destructive" });
    return [];
  }
};

export const fetchComplaintById = async (id: string): Promise<Complaint> => {
  const { data, error } = await supabase.from('complaints').select('*').eq('id', id).single();
  if (error) throw error;
  return data as unknown as Complaint;
};

export const createComplaint = async (complaint: Omit<Complaint, 'id' | 'created_at' | 'updated_at'>): Promise<Complaint> => {
  const { data, error } = await supabase.from('complaints').insert(complaint as any).select().single();
  if (error) throw error;
  return data as unknown as Complaint;
};

export const updateComplaint = async (id: string, updates: Partial<Complaint>): Promise<Complaint> => {
  const { id: _, created_at, updated_at, ...updateData } = updates;
  const { data, error } = await supabase
    .from('complaints')
    .update({ ...updateData, updated_at: new Date().toISOString() } as any)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as Complaint;
};

export const updateComplaintStatus = async (id: string, status: string, userId: string): Promise<Complaint> => {
  const { data, error } = await supabase
    .from('complaints')
    .update({ status, updated_at: new Date().toISOString(), resolution_date: status === 'Resolved' ? new Date().toISOString() : null } as any)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as Complaint;
};

// Stub — complaint_activities table does not exist
export const fetchComplaintActivities = async (complaintId: string) => {
  return [];
};

export const addComplaintActivity = async (complaintId: string, activityType: string, description: string, userId: string) => {
  console.log('Activity logged (in-memory):', { complaintId, activityType, description, userId });
  return { id: crypto.randomUUID(), complaint_id: complaintId, action_type: activityType, description, performed_by: userId };
};

export const createCAPAFromComplaint = async (complaintId: string, userId: string) => {
  const complaint = await fetchComplaintById(complaintId);
  
  const { data: capa, error: capaError } = await supabase
    .from('capas')
    .insert({
      title: `CAPA for ${complaint.title}`,
      description: (complaint as any).description,
      source: 'Customer Complaint',
      priority: 'Medium',
      status: 'Open',
      created_by: userId,
      assigned_to: (complaint as any).assigned_to || userId,
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    } as any)
    .select()
    .single();
    
  if (capaError) throw capaError;
  
  await supabase
    .from('complaints')
    .update({ capa_id: capa.id, updated_at: new Date().toISOString() } as any)
    .eq('id', complaintId);
  
  return capa;
};

export const getComplaintStatistics = async () => {
  const { data, error } = await supabase.from('complaints').select('status, category, priority');
  if (error) throw error;
  
  const stats = {
    total: data.length,
    byStatus: {} as Record<string, number>,
    byCategory: {} as Record<string, number>,
    byPriority: {} as Record<string, number>,
    openHighPriority: 0,
    avgResolutionTime: 0
  };
  
  data.forEach((c: any) => {
    stats.byStatus[c.status] = (stats.byStatus[c.status] || 0) + 1;
    if (c.category) stats.byCategory[c.category] = (stats.byCategory[c.category] || 0) + 1;
    if (c.priority) stats.byPriority[c.priority] = (stats.byPriority[c.priority] || 0) + 1;
    if ((c.status === 'New' || c.status === 'Under_Investigation') && (c.priority === 'High' || c.priority === 'Critical')) {
      stats.openHighPriority++;
    }
  });
  
  return stats;
};

export default {
  fetchComplaints, fetchComplaintById, createComplaint, updateComplaint,
  updateComplaintStatus, fetchComplaintActivities, addComplaintActivity,
  createCAPAFromComplaint, getComplaintStatistics
};
