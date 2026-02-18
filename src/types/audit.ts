
export type AuditStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'On Hold' | 'Open';
export type AuditType = 'Internal' | 'External' | 'Supplier' | 'Regulatory' | 'Gap Analysis';
export type FindingSeverity = 'Critical' | 'Major' | 'Minor' | 'Observation';
export type FindingStatus = 'Open' | 'In Progress' | 'Closed' | 'Verified';

export interface Audit {
  id: string;
  title: string;
  description?: string;
  status: AuditStatus | string;
  start_date?: string;
  due_date?: string;
  completion_date?: string;
  audit_type?: string;
  assigned_to?: string;
  created_by?: string;
  department?: string;
  scope?: string;
  findings_count?: number;
  created_at?: string;
  updated_at?: string;
  // Legacy camelCase aliases
  startDate?: string;
  dueDate?: string;
  completionDate?: string;
  auditType?: string;
  assignedTo?: string;
  createdBy?: string;
  findings?: number;
  relatedStandard?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
  scheduledDate?: string;
}

export interface AuditFinding {
  id: string;
  audit_id?: string;
  description: string;
  evidence?: string;
  severity: FindingSeverity | string;
  status: FindingStatus | string;
  assigned_to?: string;
  due_date?: string;
  capa_id?: string;
  created_at?: string;
  updated_at?: string;
  // Legacy camelCase aliases
  auditId?: string;
  assignedTo?: string;
  dueDate?: string;
  capaId?: string;
  createdAt?: string;
  updatedAt?: string;
}
