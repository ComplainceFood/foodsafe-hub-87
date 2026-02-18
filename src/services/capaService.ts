
import { CAPA, CAPAActivity } from '@/types/capa';
import { CAPAStats } from '@/types/capa';
import { getCAPAStats, getCAPAById, fetchAllCAPAs, createCAPA, updateCAPA } from '@/services/capa/capaService';

// Function to return all CAPAs from the database
export const getCAPAs = async (): Promise<CAPA[]> => {
  return fetchAllCAPAs();
};

// Function to get CAPA activities (mock for now)
export const getCAPAActivities = async (capaId: string): Promise<CAPAActivity[]> => {
  return [];
};

// Re-export functions from capaService
export { getCAPAStats, getCAPAById, createCAPA, updateCAPA };

// Export the getCAPA function for single document (alias for getCAPAById)
export const getCAPA = getCAPAById;
