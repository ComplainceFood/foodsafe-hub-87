
import { Facility } from '@/types/facility';

// Stub implementation — facilities table does not exist yet.
const inMemoryFacilities: Facility[] = [];

export const getFacilities = async (): Promise<Facility[]> => {
  return [...inMemoryFacilities];
};

export const getFacilityById = async (id: string): Promise<Facility | null> => {
  return inMemoryFacilities.find(f => f.id === id) || null;
};

export const createFacility = async (facilityData: Partial<Facility>): Promise<Facility> => {
  const newFacility: Facility = {
    id: crypto.randomUUID(),
    organization_id: facilityData.organization_id || '',
    name: facilityData.name || '',
    ...facilityData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as Facility;
  inMemoryFacilities.push(newFacility);
  return newFacility;
};

export const updateFacility = async (id: string, facilityData: Facility): Promise<Facility> => {
  const idx = inMemoryFacilities.findIndex(f => f.id === id);
  if (idx === -1) throw new Error('Facility not found');
  inMemoryFacilities[idx] = { ...inMemoryFacilities[idx], ...facilityData, updated_at: new Date().toISOString() };
  return inMemoryFacilities[idx];
};

export const deleteFacility = async (id: string): Promise<boolean> => {
  const idx = inMemoryFacilities.findIndex(f => f.id === id);
  if (idx !== -1) inMemoryFacilities.splice(idx, 1);
  return true;
};

export const getFacilitiesByOrganization = async (organizationId: string): Promise<Facility[]> => {
  return inMemoryFacilities.filter(f => f.organization_id === organizationId);
};

export const updateFacilityStatus = async (id: string, status: string): Promise<Facility | null> => {
  const idx = inMemoryFacilities.findIndex(f => f.id === id);
  if (idx === -1) return null;
  inMemoryFacilities[idx] = { ...inMemoryFacilities[idx], status, updated_at: new Date().toISOString() };
  return inMemoryFacilities[idx];
};

export default {
  getFacilities, getFacilityById, createFacility, updateFacility, deleteFacility,
  getFacilitiesByOrganization, updateFacilityStatus
};
