
import { supabase } from '@/integrations/supabase/client';

const db = supabase as any;

export const getSupplierDocuments = async (supplierId: string): Promise<any[]> => {
  try {
    const { data, error } = await db.from('supplier_documents').select('*').eq('supplier_id', supplierId).order('upload_date', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error in getSupplierDocuments:', error);
    throw error;
  }
};

export const uploadSupplierDocument = async (supplierId: string, documentData: any): Promise<any> => {
  try {
    const { data, error } = await db.from('supplier_documents').insert([{ supplier_id: supplierId, ...documentData, upload_date: new Date().toISOString() }]).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in uploadSupplierDocument:', error);
    throw error;
  }
};

export const updateSupplierDocument = async (documentId: string, updates: any): Promise<any> => {
  try {
    const { data, error } = await db.from('supplier_documents').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', documentId).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in updateSupplierDocument:', error);
    throw error;
  }
};

export const deleteSupplierDocument = async (documentId: string): Promise<void> => {
  try {
    const { error } = await db.from('supplier_documents').delete().eq('id', documentId);
    if (error) throw error;
  } catch (error) {
    console.error('Error in deleteSupplierDocument:', error);
    throw error;
  }
};

export const createModuleRelationship = async (
  sourceId: string, sourceType: string, targetId: string,
  targetType: string, relationshipType: string, createdBy: string
): Promise<any> => {
  try {
    const { data, error } = await db.from('module_relationships').insert([{
      source_id: sourceId, source_type: sourceType, target_id: targetId,
      target_type: targetType, relationship_type: relationshipType, created_by: createdBy
    }]).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in createModuleRelationship:', error);
    throw error;
  }
};

export default { getSupplierDocuments, uploadSupplierDocument, updateSupplierDocument, deleteSupplierDocument, createModuleRelationship };
