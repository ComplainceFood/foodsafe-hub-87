import { supabase } from '@/integrations/supabase/client';
import { Role, UserRole } from '@/types/role';

const db = supabase as any;

export const fetchRoles = async (): Promise<Role[]> => {
  const { data, error } = await db.from('roles').select('*').order('name');
  if (error) { console.error('Error fetching roles:', error); throw error; }
  return data as Role[];
};

export const fetchRoleById = async (id: string): Promise<Role> => {
  const { data, error } = await db.from('roles').select('*').eq('id', id).single();
  if (error) { console.error('Error fetching role:', error); throw error; }
  return data as Role;
};

export const createRole = async (role: Omit<Role, 'id'>): Promise<Role> => {
  const { data, error } = await db.from('roles').insert({
    name: role.name, level: role.level || "organization",
    description: role.description, permissions: role.permissions,
    organization_id: role.organization_id
  }).select().single();
  if (error) { console.error('Error creating role:', error); throw error; }
  return data as Role;
};

export const updateRole = async (id: string, updates: Partial<Role>): Promise<Role> => {
  const { data, error } = await db.from('roles').update(updates).eq('id', id).select().single();
  if (error) { console.error('Error updating role:', error); throw error; }
  return data as Role;
};

export const deleteRole = async (id: string): Promise<void> => {
  const { error } = await db.from('roles').delete().eq('id', id);
  if (error) { console.error('Error deleting role:', error); throw error; }
};

export const assignRoleToUser = async (
  userId: string, roleId: string, organizationId?: string,
  facilityId?: string, departmentId?: string
): Promise<UserRole> => {
  const { data, error } = await db.from('user_roles').insert({
    user_id: userId, role_id: roleId,
    organization_id: organizationId, facility_id: facilityId,
    department_id: departmentId,
    assigned_by: (await supabase.auth.getUser()).data.user?.id
  }).select().single();
  if (error) { console.error('Error assigning role:', error); throw error; }
  return data as UserRole;
};

export const removeRoleFromUser = async (userRoleId: string): Promise<void> => {
  const { error } = await db.from('user_roles').delete().eq('id', userRoleId);
  if (error) { console.error('Error removing role:', error); throw error; }
};

export const getUserRoles = async (userId: string): Promise<UserRole[]> => {
  const { data, error } = await db.rpc('get_user_roles', { _user_id: userId });
  if (error) { console.error('Error fetching user roles:', error); throw error; }
  return (data as any[]).map(role => ({
    id: role.role_id, user_id: userId, role_id: role.role_id,
    role_name: role.role_name, permissions: role.permissions,
    organization_id: role.organization_id, facility_id: role.facility_id,
    department_id: role.department_id,
  }));
};

export const checkUserPermission = async (
  userId: string, permission: string,
  organizationId?: string, facilityId?: string, departmentId?: string
): Promise<boolean> => {
  const { data, error } = await db.rpc('has_permission', {
    _user_id: userId, _permission: permission,
    _org_id: organizationId || null, _facility_id: facilityId || null,
    _department_id: departmentId || null
  });
  if (error) { console.error('Error checking permission:', error); throw error; }
  return data as boolean;
};

export const checkUserRole = async (
  userId: string, roleName: string,
  organizationId?: string, facilityId?: string, departmentId?: string
): Promise<boolean> => {
  const { data, error } = await db.rpc('has_role', {
    _user_id: userId, _role_name: roleName,
    _org_id: organizationId || null, _facility_id: facilityId || null,
    _department_id: departmentId || null
  });
  if (error) { console.error('Error checking role:', error); throw error; }
  return data as boolean;
};

export const createRoleWithRPC = async (role: Omit<Role, 'id'>): Promise<Role> => {
  const { data, error } = await supabase.functions.invoke("create-role", {
    body: { name: role.name, description: role.description || '', level: role.level || 'organization', permissions: role.permissions || {} }
  });
  if (error) { console.error('Error creating role via edge function:', error); throw error; }
  return data as Role;
};

export const assignRoleToUserWithRPC = async (
  userId: string, roleId: string, assignedBy: string,
  organizationId?: string, facilityId?: string, departmentId?: string
): Promise<boolean> => {
  const { data, error } = await supabase.functions.invoke("assign-user-role", {
    body: { userId, roleId, assignedBy, organizationId: organizationId || null, facilityId: facilityId || null, departmentId: departmentId || null }
  });
  if (error) { console.error('Error assigning role via edge function:', error); throw error; }
  return true;
};
