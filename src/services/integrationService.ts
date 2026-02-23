
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const createCAPAFromNC = async (nonConformanceId: string, userId: string) => {
  try {
    const { data: nc, error: ncError } = await supabase
      .from('non_conformances')
      .select('*')
      .eq('id', nonConformanceId)
      .single();
    
    if (ncError || !nc) throw new Error(ncError?.message || 'Non-Conformance not found');

    const { data: capa, error: capaError } = await supabase
      .from('capas')
      .insert({
        title: `CAPA for NC: ${nc.title}`,
        description: `CAPA created from non-conformance: ${nc.description || nc.title}`,
        source: 'Non Conformance',
        priority: nc.priority || 'Medium',
        status: 'Open',
        assigned_to: nc.assigned_to || userId,
        created_by: userId,
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        root_cause: nc.reason_details || '',
      } as any)
      .select()
      .single();
    
    if (capaError || !capa) throw new Error(capaError?.message || 'Failed to create CAPA');

    await supabase
      .from('non_conformances')
      .update({ capa_id: capa.id, updated_at: new Date().toISOString() })
      .eq('id', nonConformanceId);

    await supabase
      .from('nc_activities')
      .insert({
        non_conformance_id: nonConformanceId,
        action: `CAPA created (ID: ${capa.id})`,
        performed_by: userId
      });

    return capa.id;
  } catch (error) {
    console.error('Error creating CAPA from NC:', error);
    throw error;
  }
};

export const linkCAPAToNC = async (nonConformanceId: string, capaId: string, userId: string) => {
  try {
    const { data: capa, error: capaError } = await supabase
      .from('capas')
      .select('id, title')
      .eq('id', capaId)
      .single();
    
    if (capaError || !capa) throw new Error(capaError?.message || 'CAPA not found');

    await supabase
      .from('non_conformances')
      .update({ capa_id: capaId, updated_at: new Date().toISOString() })
      .eq('id', nonConformanceId);

    await supabase
      .from('nc_activities')
      .insert({
        non_conformance_id: nonConformanceId,
        action: `Linked to existing CAPA (ID: ${capaId})`,
        performed_by: userId
      });

    return capa.id;
  } catch (error) {
    console.error('Error linking CAPA to NC:', error);
    throw error;
  }
};

export const getRelatedCAPAs = async (nonConformanceId: string) => {
  try {
    const { data: nc } = await supabase
      .from('non_conformances')
      .select('capa_id')
      .eq('id', nonConformanceId)
      .single();

    if (!nc?.capa_id) return [];

    const { data: capas, error } = await supabase
      .from('capas')
      .select('*')
      .eq('id', nc.capa_id);
    
    if (error) throw error;
    return capas || [];
  } catch (error) {
    console.error('Error getting related CAPAs:', error);
    throw error;
  }
};

export const getRelatedNonConformances = async (capaId: string) => {
  try {
    const { data, error } = await supabase
      .from('non_conformances')
      .select('*')
      .eq('capa_id', capaId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting related Non-Conformances:', error);
    throw error;
  }
};
