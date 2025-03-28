import { supabase } from '@/integrations/supabase/client';
import { CAPA, CAPAStatus, CAPAPriority, CAPASource, CAPAEffectivenessRating, CAPAStats } from '@/types/capa';

// Map frontend status values to database status values
const mapStatusToDb = (status: CAPAStatus): string => {
  const statusMap: Record<CAPAStatus, string> = {
    'open': 'Open',
    'in-progress': 'In Progress',
    'closed': 'Closed',
    'verified': 'Verified'
  };
  return statusMap[status] || 'Open';
};

// Map database status values to frontend status values
const mapStatusFromDb = (dbStatus: string): CAPAStatus => {
  const dbStatusLower = dbStatus.toLowerCase();
  if (dbStatusLower === 'in progress') return 'in-progress';
  if (['open', 'closed', 'verified'].includes(dbStatusLower)) {
    return dbStatusLower as CAPAStatus;
  }
  return 'open';
};

/**
 * Fetch all CAPA items with optional filtering
 */
export const fetchCAPAs = async (filters?: {
  status?: string;
  priority?: string;
  source?: string;
  dueDate?: string;
  searchQuery?: string;
}): Promise<CAPA[]> => {
  let query = supabase
    .from('capa_actions')
    .select('*')
    .order('created_at', { ascending: false });

  // Apply filters if provided
  if (filters) {
    if (filters.status && filters.status !== 'all') {
      // Map frontend status to database status format
      const dbStatus = filters.status === 'in-progress' ? 'In Progress' : 
                       filters.status.charAt(0).toUpperCase() + filters.status.slice(1);
      query = query.ilike('status', dbStatus);
    }

    if (filters.priority && filters.priority !== 'all') {
      query = query.eq('priority', filters.priority);
    }

    if (filters.source && filters.source !== 'all') {
      query = query.eq('source', filters.source);
    }

    if (filters.dueDate && filters.dueDate !== 'all') {
      const today = new Date().toISOString().split('T')[0];
      
      if (filters.dueDate === 'overdue') {
        query = query.lt('due_date', today);
      } else if (filters.dueDate === 'today') {
        query = query.eq('due_date', today);
      } else if (filters.dueDate === 'upcoming') {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        query = query
          .gt('due_date', today)
          .lte('due_date', nextWeek.toISOString().split('T')[0]);
      }
    }

    if (filters.searchQuery) {
      query = query.or(`title.ilike.%${filters.searchQuery}%, description.ilike.%${filters.searchQuery}%`);
    }
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching CAPAs:', error);
    throw error;
  }
  
  // Map database records to CAPA type
  return data.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    source: item.source as CAPASource,
    sourceId: item.source_id || '',
    priority: item.priority as CAPAPriority,
    status: mapStatusFromDb(item.status),
    assignedTo: item.assigned_to,
    department: '', // Not available in current database schema
    dueDate: item.due_date,
    createdDate: item.created_at,
    lastUpdated: item.updated_at,
    completedDate: item.completion_date,
    rootCause: item.root_cause || '',
    correctiveAction: item.corrective_action || '',
    preventiveAction: item.preventive_action || '',
    verificationMethod: '', // Not available in current database schema
    verificationDate: item.verification_date,
    verifiedBy: '', // Not available in current database schema
    effectivenessRating: undefined, // Not available in current database schema
    effectivenessScore: undefined, // Not available in current database schema
    relatedDocuments: [], // Not available in current database schema
    relatedTraining: [], // Not available in current database schema
    fsma204Compliant: false // Not available in current database schema
  }));
};

/**
 * Fetch a single CAPA by ID
 */
export const fetchCAPAById = async (id: string): Promise<CAPA> => {
  const { data, error } = await supabase
    .from('capa_actions')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching CAPA with ID ${id}:`, error);
    throw error;
  }
  
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    source: data.source as CAPASource,
    sourceId: data.source_id || '',
    priority: data.priority as CAPAPriority,
    status: mapStatusFromDb(data.status),
    assignedTo: data.assigned_to,
    department: '', // Not available in current database schema
    dueDate: data.due_date,
    createdDate: data.created_at,
    lastUpdated: data.updated_at,
    completedDate: data.completion_date,
    rootCause: data.root_cause || '',
    correctiveAction: data.corrective_action || '',
    preventiveAction: data.preventive_action || '',
    verificationMethod: '', // Not available in current database schema
    verificationDate: data.verification_date,
    verifiedBy: '', // Not available in current database schema
    effectivenessRating: undefined, // Not available in current database schema
    effectivenessScore: undefined, // Not available in current database schema
    relatedDocuments: [], // Not available in current database schema
    relatedTraining: [], // Not available in current database schema
    fsma204Compliant: false // Not available in current database schema
  };
};

/**
 * Create a new CAPA
 */
export const createCAPA = async (capa: Omit<CAPA, 'id' | 'createdDate' | 'lastUpdated'>): Promise<CAPA> => {
  // Map CAPA type to database schema
  const dbRecord = {
    title: capa.title,
    description: capa.description,
    source: capa.source,
    source_id: capa.sourceId,
    priority: capa.priority,
    // Convert frontend status to the format expected by the database
    status: mapStatusToDb(capa.status as CAPAStatus),
    assigned_to: capa.assignedTo,
    due_date: capa.dueDate,
    completion_date: capa.completedDate,
    root_cause: capa.rootCause,
    corrective_action: capa.correctiveAction,
    preventive_action: capa.preventiveAction,
    verification_date: capa.verificationDate,
    effectiveness_criteria: '',
    effectiveness_verified: false,
    created_by: (await supabase.auth.getUser()).data.user?.id || 'system'
  };

  const { data, error } = await supabase
    .from('capa_actions')
    .insert(dbRecord)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating CAPA:', error);
    throw error;
  }
  
  // Return the created CAPA with generated ID and timestamps
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    source: data.source as CAPASource,
    sourceId: data.source_id || '',
    priority: data.priority as CAPAPriority,
    status: mapStatusFromDb(data.status),
    assignedTo: data.assigned_to,
    department: '', // Not available in current database schema
    dueDate: data.due_date,
    createdDate: data.created_at,
    lastUpdated: data.updated_at,
    completedDate: data.completion_date,
    rootCause: data.root_cause || '',
    correctiveAction: data.corrective_action || '',
    preventiveAction: data.preventive_action || '',
    verificationMethod: '', // Not available in current database schema
    verificationDate: data.verification_date,
    verifiedBy: '', // Not available in current database schema
    effectivenessRating: undefined, // Not available in current database schema
    effectivenessScore: undefined, // Not available in current database schema
    relatedDocuments: [], // Not available in current database schema
    relatedTraining: [], // Not available in current database schema
    fsma204Compliant: false // Not available in current database schema
  };
};

/**
 * Update an existing CAPA
 */
export const updateCAPA = async (id: string, updates: Partial<CAPA>): Promise<CAPA> => {
  // Map CAPA type to database schema
  const dbUpdates: any = {};
  
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.source !== undefined) dbUpdates.source = updates.source;
  if (updates.sourceId !== undefined) dbUpdates.source_id = updates.sourceId;
  if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
  if (updates.status !== undefined) {
    // Convert frontend status to the format expected by the database
    dbUpdates.status = mapStatusToDb(updates.status as CAPAStatus);
  }
  if (updates.assignedTo !== undefined) dbUpdates.assigned_to = updates.assignedTo;
  if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
  if (updates.completedDate !== undefined) dbUpdates.completion_date = updates.completedDate;
  if (updates.rootCause !== undefined) dbUpdates.root_cause = updates.rootCause;
  if (updates.correctiveAction !== undefined) dbUpdates.corrective_action = updates.correctiveAction;
  if (updates.preventiveAction !== undefined) dbUpdates.preventive_action = updates.preventiveAction;
  if (updates.verificationDate !== undefined) dbUpdates.verification_date = updates.verificationDate;

  const { data, error } = await supabase
    .from('capa_actions')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating CAPA with ID ${id}:`, error);
    throw error;
  }
  
  // Return the updated CAPA
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    source: data.source as CAPASource,
    sourceId: data.source_id || '',
    priority: data.priority as CAPAPriority,
    status: mapStatusFromDb(data.status),
    assignedTo: data.assigned_to,
    department: '', // Not available in current database schema
    dueDate: data.due_date,
    createdDate: data.created_at,
    lastUpdated: data.updated_at,
    completedDate: data.completion_date,
    rootCause: data.root_cause || '',
    correctiveAction: data.corrective_action || '',
    preventiveAction: data.preventive_action || '',
    verificationMethod: '', // Not available in current database schema
    verificationDate: data.verification_date,
    verifiedBy: '', // Not available in current database schema
    effectivenessRating: undefined, // Not available in current database schema
    effectivenessScore: undefined, // Not available in current database schema
    relatedDocuments: [], // Not available in current database schema
    relatedTraining: [], // Not available in current database schema
    fsma204Compliant: false // Not available in current database schema
  };
};

/**
 * Delete a CAPA
 */
export const deleteCAPA = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('capa_actions')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting CAPA with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get CAPA statistics
 */
export const getCAPAStats = async (): Promise<CAPAStats> => {
  // Get all CAPAs for statistics
  const { data, error } = await supabase
    .from('capa_actions')
    .select('*');

  if (error) {
    console.error('Error fetching CAPA statistics:', error);
    throw error;
  }

  // Calculate statistics
  const today = new Date().toISOString().split('T')[0];
  const stats: CAPAStats = {
    total: data.length,
    byStatus: {
      open: 0,
      'in-progress': 0,
      closed: 0,
      verified: 0
    },
    byPriority: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    },
    bySource: {
      audit: 0,
      haccp: 0,
      supplier: 0,
      complaint: 0,
      traceability: 0
    },
    overdue: 0,
    averageClosureTime: 0,
    effectivenessRating: {
      effective: 0,
      partiallyEffective: 0,
      notEffective: 0
    },
    fsma204ComplianceRate: 0
  };

  // Process data
  data.forEach(item => {
    // Map database status to frontend status format
    const statusKey = mapStatusFromDb(item.status);
    if (stats.byStatus[statusKey] !== undefined) {
      stats.byStatus[statusKey]++;
    }

    // Count by priority
    if (stats.byPriority[item.priority as CAPAPriority] !== undefined) {
      stats.byPriority[item.priority as CAPAPriority]++;
    }

    // Count by source
    if (stats.bySource[item.source as CAPASource] !== undefined) {
      stats.bySource[item.source as CAPASource]++;
    }

    // Count overdue items - status is lowercase in DB, compare lowercase
    if (
      (statusKey === 'open' || statusKey === 'in-progress') && 
      item.due_date && 
      item.due_date < today
    ) {
      stats.overdue++;
    }
  });

  return stats;
};
