
import { Department } from '@/types/department';

// Stub implementation — departments table does not exist yet.
const inMemoryDepartments: Department[] = [];

export const fetchDepartments = async (
  organizationId?: string,
  facilityId?: string
): Promise<Department[]> => {
  return inMemoryDepartments.filter(d => {
    if (organizationId && d.organization_id !== organizationId) return false;
    if (facilityId && d.facility_id !== facilityId) return false;
    return true;
  });
};

export const fetchDepartmentById = async (id: string): Promise<Department> => {
  const dept = inMemoryDepartments.find(d => d.id === id);
  if (!dept) throw new Error('Department not found');
  return dept;
};

export const createDepartment = async (department: Partial<Department>): Promise<Department> => {
  const newDept: Department = {
    id: crypto.randomUUID(),
    name: department.name || '',
    ...department,
  } as Department;
  inMemoryDepartments.push(newDept);
  return newDept;
};

export const updateDepartment = async (id: string, updates: Partial<Department>): Promise<Department> => {
  const idx = inMemoryDepartments.findIndex(d => d.id === id);
  if (idx === -1) throw new Error('Department not found');
  inMemoryDepartments[idx] = { ...inMemoryDepartments[idx], ...updates };
  return inMemoryDepartments[idx];
};

export const deleteDepartment = async (id: string): Promise<void> => {
  const idx = inMemoryDepartments.findIndex(d => d.id === id);
  if (idx !== -1) inMemoryDepartments.splice(idx, 1);
};
