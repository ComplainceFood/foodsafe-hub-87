import { TrainingStatus, TrainingType, TrainingCategory } from '@/types/enums';

export interface Training {
  id: string;
  title: string;
  description?: string;
  status: TrainingStatus;
  type: TrainingType;
  category?: TrainingCategory;
  start_date: string;
  due_date?: string;
  completion_date?: string;
  completion_score?: number;
  assigned_to: string[];
  created_by: string;
  created_at: string;
  updated_at?: string;
  completion_certificate?: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
  required_roles?: string[];
  department_id?: string;
}

export interface TrainingRecord {
  id: string;
  session_id: string;
  employee_id: string;
  employee_name: string;
  status: TrainingStatus;
  assigned_date: string;
  due_date: string;
  completed_date?: string;
  score?: number;
  notes?: string;
}

export interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  target_roles: string[];
  target_departments: string[];
  courses: string[];
  duration_days: number;
  is_required: boolean;
  priority: string;
  status: string;
  start_date: string;
  end_date: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_automated: boolean;
  required_for?: string[];
  // Adding missing properties that were causing errors
  targetRoles?: string[];
  targetDepartments?: string[];
  durationDays?: number;
  isRequired?: boolean;
  startDate?: string;
  endDate?: string;
  coursesIncluded?: string[];
}

export interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  duration_hours: number;
  duration_minutes: number;
  passing_score: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingSession {
  id: string;
  title: string;
  description: string;
  status: string;
  startDate: string;
  participants: string[];
  training_type: string;
  completion_status: TrainingStatus;
  assigned_to: string[];
  created_by: string;
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
}

export interface TrainingRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  course_id: string;
  session_id: string;
  status: TrainingStatus;
  assigned_date: string;
  due_date: string;
  completed_date?: string;
  score?: number;
  pass_threshold?: number;
  notes?: string;
}

export interface Employee {
  id: string;
  full_name: string;
  email: string;
  role: string;
  department?: string;
  hire_date?: string;
  status: 'active' | 'inactive';
  [key: string]: any;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: TrainingCategory;
  duration_hours: number;
  materials?: string[];
  [key: string]: any;
}

export interface AutoAssignRule {
  id: string;
  name: string;
  conditions: {
    key: string;
    operator: '=' | '!=' | '>' | '<' | '>=' | '<=';
    value: string | number;
  }[];
  action: {
    type: 'assign_training';
    training_id: string;
  };
  enabled: boolean;
}

export interface TrainingAutomationConfig {
  id: string;
  enabled: boolean;
  rules: AutoAssignRule[];
  documentChangesTrigger: boolean;
  newEmployeeTrigger: boolean;
  roleCangeTrigger: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface DocumentControlIntegration {
  documentId: string;
  documentTitle: string;
  changeType: 'new' | 'update' | 'archive';
  version: string;
  trainingRequired: boolean;
  affectedRoles?: string[];
  trainingDeadlineDays?: number;
}

export interface Certification {
  id: string;
  employeeId: string;
  employee_name: string;
  certificationName: string;
  name: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'revoked';
  issuer: string;
  documentId?: string;
}

export enum TrainingPriority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Critical = "Critical"
}

export interface DepartmentStat {
  department: string;
  name: string;
  completed: number;
  overdue: number;
  total?: number;
  compliance: number;
  totalAssigned: number;
  complianceRate: number;
}

export type TrainingCompletionStatus = 'not-started' | 'in-progress' | 'completed' | 'overdue' | 'cancelled';

export type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';

// Re-export enums from types/enums for better compatibility
export { TrainingStatus, TrainingType, TrainingCategory };
