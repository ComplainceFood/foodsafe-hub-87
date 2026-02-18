
import { useState } from 'react';

// Types for reference data
export interface DocumentStatusType {
  id: number;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface DocumentCategoryType {
  id: number;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface DocumentPermissionType {
  id: number;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

// Default statuses used when no DB table exists
const defaultStatuses: DocumentStatusType[] = [
  { id: 1, name: 'Draft', description: 'Document is being drafted', sort_order: 1, is_active: true },
  { id: 2, name: 'In Review', description: 'Document is under review', sort_order: 2, is_active: true },
  { id: 3, name: 'Approved', description: 'Document has been approved', sort_order: 3, is_active: true },
  { id: 4, name: 'Published', description: 'Document is published', sort_order: 4, is_active: true },
  { id: 5, name: 'Archived', description: 'Document is archived', sort_order: 5, is_active: true },
];

const defaultCategories: DocumentCategoryType[] = [
  { id: 1, name: 'Policy', description: 'Policy documents', sort_order: 1, is_active: true },
  { id: 2, name: 'Procedure', description: 'Procedure documents', sort_order: 2, is_active: true },
  { id: 3, name: 'Work Instruction', description: 'Work instructions', sort_order: 3, is_active: true },
  { id: 4, name: 'Form', description: 'Forms and templates', sort_order: 4, is_active: true },
  { id: 5, name: 'Record', description: 'Quality records', sort_order: 5, is_active: true },
];

const defaultPermissions: DocumentPermissionType[] = [
  { id: 1, name: 'View', description: 'Can view the document', sort_order: 1, is_active: true },
  { id: 2, name: 'Edit', description: 'Can edit the document', sort_order: 2, is_active: true },
  { id: 3, name: 'Approve', description: 'Can approve the document', sort_order: 3, is_active: true },
];

export function useDocumentStatuses() {
  const [statuses] = useState<DocumentStatusType[]>(defaultStatuses);
  return { statuses, loading: false, error: null };
}

export function useDocumentCategories() {
  const [categories] = useState<DocumentCategoryType[]>(defaultCategories);
  return { categories, loading: false, error: null };
}

export function useDocumentPermissions() {
  const [permissions] = useState<DocumentPermissionType[]>(defaultPermissions);
  return { permissions, loading: false, error: null };
}
