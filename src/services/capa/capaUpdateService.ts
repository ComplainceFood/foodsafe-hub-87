
import { CAPA } from '@/types/capa';
import { supabase } from '@/integrations/supabase/client';
import { stringToCAPASource } from '@/utils/typeAdapters';
import { CAPAStatus } from '@/types/enums';

export const updateCAPA = async (
  id: string,
  capaData: Partial<CAPA>
): Promise<CAPA | null> => {
  try {
    if (capaData.source && typeof capaData.source === 'string') {
      capaData.source = stringToCAPASource(capaData.source);
    }
    
    const { data, error } = await supabase
      .from('capas')
      .update(capaData as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data as unknown as CAPA;
  } catch (error) {
    console.error('Failed to update CAPA:', error);
    return null;
  }
};

export const completeCAPA = async (
  id: string,
  completionDetails: {
    completionNotes: string;
    completedBy: string;
    effectivenessCriteriaMet?: boolean;
  }
): Promise<CAPA | null> => {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('capas')
      .update({
        status: 'Completed',
        updated_at: now,
      } as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data as unknown as CAPA;
  } catch (error) {
    console.error('Failed to complete CAPA:', error);
    return null;
  }
};
