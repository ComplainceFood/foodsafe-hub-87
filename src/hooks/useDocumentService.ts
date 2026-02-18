
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Document, 
  DocumentVersion, 
  DocumentComment,
  DocumentFilter,
  DocumentAccess,
} from '@/types/document';
import { DocumentStatus, CheckoutStatus } from '@/types/enums';
import { 
  documentStatusToString, 
  stringToDocumentStatus, 
} from '@/utils/documentAdapters';

export const useDocumentService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const getDocuments = useCallback(async (filter?: DocumentFilter): Promise<Document[]> => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase.from('documents').select('*');
      
      if (filter) {
        if (filter.category) {
          const categories = Array.isArray(filter.category) ? filter.category : [filter.category];
          query = query.in('category', categories);
        }
        if (filter.status) {
          const statuses = Array.isArray(filter.status) ? filter.status : [filter.status];
          const statusStrings = statuses.map(status => documentStatusToString(status));
          query = query.in('status', statusStrings as any);
        }
        if (filter.createdBy) query = query.eq('created_by', filter.createdBy);
        if (filter.createdAfter) query = query.gte('created_at', filter.createdAfter);
        if (filter.createdBefore) query = query.lte('created_at', filter.createdBefore);
        if (filter.expiringBefore) query = query.lte('expiry_date', filter.expiringBefore);
        if (filter.searchTerm) query = query.or(`title.ilike.%${filter.searchTerm}%,description.ilike.%${filter.searchTerm}%`);
      }
      
      const { data, error: queryError } = await query.order('updated_at', { ascending: false });
      if (queryError) throw queryError;
      
      return (data || []).map(item => ({
        ...item,
        file_name: item.title || '',
        file_size: 0,
        status: stringToDocumentStatus(item.status as string),
        checkout_status: CheckoutStatus.Available,
      })) as unknown as Document[];
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  
  const getDocumentById = useCallback(async (id: string): Promise<Document | null> => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: queryError } = await supabase.from('documents').select('*').eq('id', id).single();
      if (queryError) throw queryError;
      if (!data) return null;
      return {
        ...data,
        file_name: data.title || '',
        file_size: 0,
        status: stringToDocumentStatus(data.status as string),
        checkout_status: CheckoutStatus.Available,
      } as unknown as Document;
    } catch (err) {
      console.error(`Error fetching document with ID ${id}:`, err);
      setError('Failed to load document.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const checkoutDocument = useCallback(async (documentId: string, userId: string, userName: string): Promise<boolean> => {
    // Checkout not supported without checkout_status column - stub
    console.log('Document checkout not yet supported');
    return true;
  }, []);
  
  const checkinDocument = useCallback(async (documentId: string, userId: string, userName: string, comment?: string): Promise<boolean> => {
    console.log('Document checkin not yet supported');
    return true;
  }, []);
  
  const getDocumentVersions = useCallback(async (documentId: string): Promise<DocumentVersion[]> => {
    // No document_versions table yet
    return [];
  }, []);
  
  const createDocument = useCallback(async (document: Partial<Document>): Promise<Document | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error: insertError } = await supabase
        .from('documents')
        .insert({
          title: document.title || 'Untitled Document',
          description: document.description || '',
          content: (document as any).content || '',
          status: 'Draft',
          category: document.category || 'Other',
          version: '1.0',
          file_path: document.file_path || '',
          file_type: document.file_type || 'text/plain',
          created_by: user?.id,
          department: document.department || '',
          tags: document.tags || [],
        })
        .select()
        .single();
      
      if (insertError) throw insertError;
      return { ...data, file_name: data.title, file_size: 0 } as unknown as Document;
    } catch (err) {
      console.error('Error creating document:', err);
      setError('Failed to create document.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const getDocumentComments = useCallback(async (documentId: string): Promise<DocumentComment[]> => {
    // No document_comments table yet
    return [];
  }, []);
  
  const createDocumentComment = useCallback(async (documentId: string, userId: string, userName: string, content: string): Promise<DocumentComment | null> => {
    // No document_comments table yet
    return null;
  }, []);
  
  const deleteDocument = useCallback(async (documentId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const { error: deleteError } = await supabase.from('documents').delete().eq('id', documentId);
      if (deleteError) throw deleteError;
      return true;
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete document.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const getDownloadUrl = useCallback(async (documentId: string, fileName: string): Promise<string | null> => {
    return null; // Storage not configured yet
  }, []);
  
  const fetchAccess = useCallback(async (documentId: string): Promise<DocumentAccess[]> => {
    return []; // No document_access table yet
  }, []);
  
  const grantAccess = useCallback(async (documentId: string, userId: string, permissionLevel: string, grantedBy: string): Promise<DocumentAccess | null> => {
    return null;
  }, []);
  
  const revokeAccess = useCallback(async (accessId: string): Promise<boolean> => {
    return false;
  }, []);
  
  return {
    loading, error,
    getDocuments, getDocumentById,
    checkoutDocument, checkinDocument,
    getDocumentVersions, createDocument,
    getDocumentComments, createDocumentComment,
    deleteDocument, getDownloadUrl,
    fetchAccess, grantAccess, revokeAccess
  };
};

export default useDocumentService;
