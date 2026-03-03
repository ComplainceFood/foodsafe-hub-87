
import { supabase } from '@/integrations/supabase/client';
import { StandardName, StandardRequirement } from '@/types/supplier';

const db = supabase as any;

export const fetchStandardRequirements = async (standard: StandardName): Promise<StandardRequirement[]> => {
  const { data, error } = await db
    .from('standard_requirements')
    .select('*')
    .or(`standard.eq.${standard},standard.eq.all`);
  
  if (error) {
    console.error(`Error fetching requirements for ${standard}:`, error);
    throw new Error('Failed to fetch standard requirements');
  }
  
  return (data || []).map((req: any) => ({
    standard: req.standard as StandardName,
    name: req.name,
    description: req.description,
    category: req.category
  }));
};

export const addStandardRequirement = async (requirement: StandardRequirement): Promise<void> => {
  const { error } = await db.from('standard_requirements').insert({
    standard: requirement.standard, name: requirement.name,
    description: requirement.description, category: requirement.category
  });
  if (error) { console.error('Error adding standard requirement:', error); throw new Error('Failed to add standard requirement'); }
};

export const updateStandardRequirement = async (id: string, requirement: Partial<StandardRequirement>): Promise<void> => {
  const { error } = await db.from('standard_requirements').update({
    standard: requirement.standard, name: requirement.name,
    description: requirement.description, category: requirement.category,
    updated_at: new Date().toISOString()
  }).eq('id', id);
  if (error) { console.error(`Error updating standard requirement ${id}:`, error); throw new Error('Failed to update standard requirement'); }
};

export const deleteStandardRequirement = async (id: string): Promise<void> => {
  const { error } = await db.from('standard_requirements').delete().eq('id', id);
  if (error) { console.error(`Error deleting standard requirement ${id}:`, error); throw new Error('Failed to delete standard requirement'); }
};

export default { fetchStandardRequirements, addStandardRequirement, updateStandardRequirement, deleteStandardRequirement };
