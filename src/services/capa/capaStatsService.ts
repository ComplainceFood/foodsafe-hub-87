
import { CAPAStats } from "@/types/capa";
import { CAPAPriority, CAPASource } from "@/types/enums";
import { supabase } from "@/integrations/supabase/client";

export const fetchCAPAStats = async (): Promise<CAPAStats> => {
  try {
    const { data, error } = await supabase.from('capas').select('*');
    
    if (error) throw error;
    
    const stats: CAPAStats = {
      total: 0,
      open: 0,
      inProgress: 0,
      completed: 0,
      overdue: 0,
      openCount: 0,
      closedCount: 0,
      overdueCount: 0,
      pendingVerificationCount: 0,
      effectivenessRate: 0,
      byStatus: {},
      byPriority: {
        [CAPAPriority.Low]: 0,
        [CAPAPriority.Medium]: 0,
        [CAPAPriority.High]: 0,
        [CAPAPriority.Critical]: 0
      },
      bySource: {
        [CAPASource.Audit]: 0,
        [CAPASource.CustomerComplaint]: 0,
        [CAPASource.InternalReport]: 0,
        [CAPASource.NonConformance]: 0,
        [CAPASource.RegulatoryInspection]: 0,
        [CAPASource.SupplierIssue]: 0,
        [CAPASource.Other]: 0
      },
      byMonth: {},
      byDepartment: {},
      recentActivities: []
    };
    
    if (!data || data.length === 0) return stats;
    
    stats.total = data.length;
    
    data.forEach((capa: any) => {
      if (capa.status === 'Open') { stats.openCount!++; stats.open++; }
      else if (capa.status === 'Closed' || capa.status === 'Completed') { stats.closedCount!++; stats.completed++; }
      else if (capa.status === 'Overdue') { stats.overdueCount!++; stats.overdue++; }
      else if (capa.status === 'In Progress') { stats.inProgress++; }
      else if (capa.status === 'Pending Verification') { stats.pendingVerificationCount!++; }
      
      if (capa.priority) {
        const priority = capa.priority as CAPAPriority;
        if (priority in stats.byPriority) stats.byPriority[priority]++;
      }
      if (capa.source) {
        const source = capa.source as CAPASource;
        if (source in stats.bySource) stats.bySource[source]++;
      }
    });
    
    return stats;
  } catch (error) {
    console.error("Error fetching CAPA statistics:", error);
    throw error;
  }
};
