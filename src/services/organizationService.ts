import { Organization } from '@/types/organization';

// Stub implementation — organizations table does not exist yet.
// Returns empty arrays / throws on missing data to keep the UI functional.

const inMemoryOrgs: Organization[] = [];

export const fetchOrganizations = async (): Promise<Organization[]> => {
  return inMemoryOrgs;
};

export const fetchOrganizationsByLocation = async (
  country?: string, state?: string, city?: string
): Promise<Organization[]> => {
  return inMemoryOrgs.filter(o => {
    if (country && (o as any).country !== country) return false;
    if (state && (o as any).state !== state) return false;
    if (city && (o as any).city !== city) return false;
    return true;
  });
};

export const fetchOrganizationById = async (id: string): Promise<Organization> => {
  const org = inMemoryOrgs.find(o => o.id === id);
  if (!org) throw new Error('Organization not found');
  return org;
};

export const createOrganization = async (organization: Partial<Organization>): Promise<Organization> => {
  const newOrg: Organization = {
    id: crypto.randomUUID(),
    name: organization.name || '',
    ...organization,
  } as Organization;
  inMemoryOrgs.push(newOrg);
  return newOrg;
};

export const updateOrganization = async (id: string, updates: Partial<Organization>): Promise<Organization> => {
  const idx = inMemoryOrgs.findIndex(o => o.id === id);
  if (idx === -1) throw new Error('Organization not found');
  inMemoryOrgs[idx] = { ...inMemoryOrgs[idx], ...updates };
  return inMemoryOrgs[idx];
};

export const deleteOrganization = async (id: string): Promise<void> => {
  const idx = inMemoryOrgs.findIndex(o => o.id === id);
  if (idx !== -1) inMemoryOrgs.splice(idx, 1);
};
