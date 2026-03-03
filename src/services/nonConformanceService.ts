
import { NonConformance, NCActivity, NCAttachment, NCStats } from '@/types/non-conformance';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Get all non-conformances with real-time data
export const getAllNonConformances = async () => {
  try {
    const { data, error } = await supabase
      .from('non_conformances')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [] };
  } catch (error) {
    console.error('Error fetching non-conformances:', error);
    throw error;
  }
};

// Get non-conformance by ID
export const getNonConformanceById = async (id: string): Promise<NonConformance> => {
  try {
    const { data, error } = await supabase
      .from('non_conformances')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error(`Non-conformance with ID ${id} not found`);
    
    return data as NonConformance;
  } catch (error) {
    console.error('Error fetching non-conformance:', error);
    throw error;
  }
};

// Create non-conformance
export const createNonConformance = async (data: Partial<NonConformance>): Promise<NonConformance> => {
  try {
    const insertData = {
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      reported_date: data.reported_date || new Date().toISOString(),
      status: data.status || 'On Hold'
    } as any;

    const { data: newNC, error } = await supabase
      .from('non_conformances')
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;
    return newNC as NonConformance;
  } catch (error) {
    console.error('Error creating non-conformance:', error);
    throw error;
  }
};

// Update non-conformance
export const updateNonConformance = async (id: string, data: Partial<NonConformance>): Promise<NonConformance> => {
  try {
    const { data: updatedNC, error } = await supabase
      .from('non_conformances')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updatedNC as NonConformance;
  } catch (error) {
    console.error('Error updating non-conformance:', error);
    throw error;
  }
};

// Delete non-conformance
export const deleteNonConformance = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('non_conformances')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting non-conformance:', error);
    throw error;
  }
};

// Fetch NC activities
export const fetchNCActivities = async (nonConformanceId: string): Promise<NCActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('nc_activities')
      .select('*')
      .eq('non_conformance_id', nonConformanceId)
      .order('performed_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching NC activities:', error);
    throw error;
  }
};

// Fetch NC attachments
export const fetchNCAttachments = async (nonConformanceId: string): Promise<NCAttachment[]> => {
  try {
    const { data, error } = await supabase
      .from('nc_attachments')
      .select('*')
      .eq('non_conformance_id', nonConformanceId)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching NC attachments:', error);
    throw error;
  }
};

// Upload NC attachment
export const uploadNCAttachment = async (
  nonConformanceId: string,
  file: File,
  description?: string
): Promise<NCAttachment> => {
  try {
    const { data: newAttachment, error } = await supabase
      .from('nc_attachments')
      .insert([{
        non_conformance_id: nonConformanceId,
        file_name: file.name,
        file_path: `/attachments/${nonConformanceId}/${file.name}`,
        file_type: file.type,
        file_size: file.size,
        description: description || '',
        uploaded_at: new Date().toISOString(),
        uploaded_by: 'Current User'
      }])
      .select()
      .single();

    if (error) throw error;
    return newAttachment as NCAttachment;
  } catch (error) {
    console.error('Error uploading attachment:', error);
    throw error;
  }
};

// Fetch NC stats for dashboard
export const fetchNCStats = async (): Promise<NCStats> => {
  try {
    const { data: nonConformances, error } = await supabase
      .from('non_conformances')
      .select('*');

    if (error) throw error;

    const ncs = nonConformances || [];
    
    // Calculate stats from real data
    const stats: NCStats = {
      total: ncs.length,
      byStatus: {},
      byCategory: {},
      byReasonCategory: {},
      byRiskLevel: {},
      overdue: 0,
      pendingReview: 0,
      recentlyResolved: 0,
      totalQuantityOnHold: 0,
      recentItems: ncs.slice(0, 5)
    };

    // Calculate status distribution
    ncs.forEach(nc => {
      const status = nc.status || 'Unknown';
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
      
      const category = nc.item_category || 'Unknown';
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
      
      const reasonCategory = nc.reason_category || 'Unknown';
      stats.byReasonCategory[reasonCategory] = (stats.byReasonCategory[reasonCategory] || 0) + 1;
      
      const riskLevel = nc.risk_level || 'Unknown';
      stats.byRiskLevel[riskLevel] = (stats.byRiskLevel[riskLevel] || 0) + 1;
      
      // Add to quantity on hold
      if (nc.quantity_on_hold) {
        stats.totalQuantityOnHold += Number(nc.quantity_on_hold);
      }
      
      // Count pending review
      if (nc.status === 'Under Review') {
        stats.pendingReview++;
      }
      
      // Count recently resolved (last 30 days)
      if (nc.resolution_date) {
        const resolvedDate = new Date(nc.resolution_date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        if (resolvedDate > thirtyDaysAgo) {
          stats.recentlyResolved++;
        }
      }
    });
    
    return stats;
  } catch (error) {
    console.error('Error fetching NC stats:', error);
    throw error;
  }
};
