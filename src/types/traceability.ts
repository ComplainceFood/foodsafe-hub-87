export type RecallStatus = 'Draft' | 'In Progress' | 'Completed' | 'Cancelled' | 'Scheduled';
export type RecallType = 'Mock' | 'Actual' | 'Test';
export type NotificationStatus = 'Pending' | 'Sent' | 'Failed' | 'Delivered' | 'Read';
export type PartnerType = 'Supplier' | 'Manufacturer' | 'Distributor' | 'Retailer';

export interface Product {
  id: string;
  name: string;
  description?: string;
  category?: string;
  sku?: string;
  batch_number?: string;
  lot_number?: string;
  batch_lot_number?: string;
  manufacturing_date?: string;
  manufactured_date?: string;
  expiry_date?: string;
  supplier_id?: string;
  status?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  quantity?: number;
  units?: string;
  attributes?: Record<string, any>;
}

export interface Component {
  id: string;
  name: string;
  description?: string;
  category?: string;
  batch_number?: string;
  lot_number?: string;
  batch_lot_number?: string;
  supplier?: string;
  supplier_id?: string;
  received_date?: string;
  expiry_date?: string;
  status?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  quantity?: number;
  units?: string;
  attributes?: Record<string, any>;
}

export interface Recall {
  id: string;
  title: string;
  description?: string;
  recall_type?: RecallType;
  recall_reason?: string;
  status?: string;
  severity?: string;
  initiated_by?: string;
  initiated_date?: string;
  initiated_at?: string;
  completion_date?: string;
  completed_at?: string;
  affected_products?: string[] | Record<string, any>;
  affected_batches?: string[];
  notification_sent?: boolean;
  corrective_actions?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RecallSchedule {
  id: string;
  title: string;
  description?: string;
  recall_type?: RecallType;
  is_recurring?: boolean;
  recurrence_interval?: number;
  recurrence_pattern?: string;
  one_time_date?: string;
  last_executed_at?: string;
  next_execution_at?: string;
  assigned_users?: string[];
  status?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductGenealogy {
  id: string;
  product_id: string;
  component_id: string;
  quantity?: number;
  units?: string;
  notes?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TreeNode {
  id: string;
  name: string;
  type: 'product' | 'component' | 'supplier';
  children?: TreeNode[];
  data?: any;
}

export interface GraphNode {
  id: string;
  name: string;
  type: string;
  label?: string;
  data?: any;
}

export interface GraphEdge {
  source: string;
  target: string;
  type?: string;
  id?: string;
  label?: string;
  data?: any;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface TraceabilityNotification {
  id: string;
  recall_id?: string;
  subject: string;
  message: string;
  recipient_type: string;
  recipient_id?: string;
  recipient_email?: string;
  status?: NotificationStatus;
  created_by?: string;
  sent_at?: string;
  created_at?: string;
}

export interface RecallSimulation {
  id: string;
  recall_id?: string;
  simulation_date?: string;
  results?: Record<string, any>;
  duration?: number;
  success_rate?: number;
  bottlenecks?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SupplyChainPartner {
  id: string;
  name: string;
  partner_type: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  status?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export type ChartData = {
  name: string;
  value: number;
  fill?: string;
};
