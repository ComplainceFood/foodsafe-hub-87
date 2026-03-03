import { supabase } from '@/integrations/supabase/client';
import { SupplierDocument, StandardName } from '@/types/supplier';
import { v4 as uuidv4 } from 'uuid';

const db = supabase as any;

const determineDocumentStatus = (expiryDate: string | null): 'Valid' | 'Expiring Soon' | 'Expired' => {
  if (!expiryDate) return 'Valid';
  const expiry = new Date(expiryDate);
  const now = new Date();
  const daysUntilExpiry = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntilExpiry < 0) return 'Expired';
  if (daysUntilExpiry < 30) return 'Expiring Soon';
  return 'Valid';
};

export const fetchSupplierDocuments = async (supplierId: string): Promise<SupplierDocument[]> => {
  const { data, error } = await db.from('supplier_documents').select('*').eq('supplier_id', supplierId);
  if (error) { console.error(`Error fetching documents for supplier ${supplierId}:`, error); throw new Error('Failed to fetch supplier documents'); }
  return (data || []).map((doc: any) => ({
    id: doc.id, supplier_id: doc.supplier_id, name: doc.name, type: doc.type,
    upload_date: doc.upload_date, expiry_date: doc.expiry_date, status: doc.status,
    file_path: doc.file_path, file_size: doc.file_size, standard: doc.standard as StandardName || undefined,
    fileName: doc.file_path, uploadDate: doc.upload_date, expiryDate: doc.expiry_date, supplier: doc.supplier_id
  }));
};

export const fetchAllDocuments = async (standard?: StandardName): Promise<SupplierDocument[]> => {
  let query = db.from('supplier_documents').select('*, suppliers(name)');
  if (standard && standard !== 'all') query = query.eq('standard', standard);
  const { data, error } = await query;
  if (error) { console.error('Error fetching all supplier documents:', error); throw new Error('Failed to fetch supplier documents'); }
  return (data || []).map((doc: any) => ({
    id: doc.id, supplier_id: doc.supplier_id, name: doc.name, type: doc.type,
    upload_date: doc.upload_date, expiry_date: doc.expiry_date, status: doc.status,
    file_path: doc.file_path, file_size: doc.file_size, standard: doc.standard as StandardName || undefined,
    fileName: doc.file_path, uploadDate: doc.upload_date, expiryDate: doc.expiry_date,
    supplier: doc.suppliers?.name || doc.supplier_id
  }));
};

export const uploadSupplierDocument = async (
  supplierId: string,
  document: { name: string; type: string; expiryDate?: string; standard?: StandardName; file: File; }
): Promise<SupplierDocument> => {
  const documentId = uuidv4();
  const fileExtension = document.file.name.split('.').pop();
  const filePath = `${supplierId}/${documentId}.${fileExtension}`;
  
  const { error: storageError } = await supabase.storage.from('attachments').upload(filePath, document.file);
  if (storageError) { console.error('Error uploading document to storage:', storageError); throw new Error('Failed to upload document file'); }
  
  const { data: { publicUrl } } = supabase.storage.from('attachments').getPublicUrl(filePath);
  const status = document.expiryDate ? determineDocumentStatus(document.expiryDate) : 'Valid';
  
  const { data, error } = await db.from('supplier_documents').insert({
    id: documentId, supplier_id: supplierId, name: document.name, type: document.type,
    expiry_date: document.expiryDate, status, file_name: document.file.name,
    file_path: publicUrl, file_size: document.file.size, standard: document.standard
  }).select().single();
  
  if (error) { console.error('Error saving document metadata:', error); throw new Error('Failed to save document metadata'); }
  
  return {
    id: data.id, supplier_id: data.supplier_id, name: data.name, type: data.type,
    upload_date: data.upload_date, expiry_date: data.expiry_date, status: data.status,
    file_path: data.file_path, file_size: data.file_size, standard: data.standard as StandardName || undefined,
    fileName: data.file_path, uploadDate: data.upload_date, expiryDate: data.expiry_date, supplier: supplierId
  };
};

export const updateDocumentStatus = async (documentId: string, status: string): Promise<void> => {
  const { error } = await db.from('supplier_documents').update({ status, updated_at: new Date().toISOString() }).eq('id', documentId);
  if (error) { console.error(`Error updating status for document ${documentId}:`, error); throw new Error('Failed to update document status'); }
};

export const deleteSupplierDocument = async (documentId: string): Promise<void> => {
  const { data, error: fetchError } = await db.from('supplier_documents').select('file_path').eq('id', documentId).maybeSingle();
  if (fetchError) { console.error(`Error fetching document ${documentId}:`, fetchError); throw new Error('Failed to fetch document for deletion'); }
  
  if (data && data.file_path) {
    const pathMatch = data.file_path.match(/\/attachments\/([^?]+)/);
    if (pathMatch && pathMatch[1]) {
      await supabase.storage.from('attachments').remove([pathMatch[1]]);
    }
  }
  
  const { error } = await db.from('supplier_documents').delete().eq('id', documentId);
  if (error) { console.error(`Error deleting document ${documentId}:`, error); throw new Error('Failed to delete document from database'); }
};

export const fetchDocumentStatistics = async () => {
  const { data, error } = await db.from('supplier_documents').select('status');
  if (error) { console.error('Error fetching document statistics:', error); throw new Error('Failed to fetch document statistics'); }
  const stats = { validCount: 0, expiringCount: 0, expiredCount: 0, pendingCount: 0 };
  (data || []).forEach((doc: any) => {
    if (doc.status === 'Valid') stats.validCount++;
    else if (doc.status === 'Expiring Soon') stats.expiringCount++;
    else if (doc.status === 'Expired') stats.expiredCount++;
    else if (doc.status === 'Pending Review') stats.pendingCount++;
  });
  return stats;
};

export default { fetchSupplierDocuments, fetchAllDocuments, uploadSupplierDocument, updateDocumentStatus, deleteSupplierDocument, fetchDocumentStatistics };
