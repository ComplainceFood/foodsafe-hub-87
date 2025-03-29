
import { supabase } from '@/integrations/supabase/client';
import { Role, UserRole } from '@/types/role';

export const fetchRoles = async (): Promise<Role[]> => {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
  
  return data as Role[];
};

export const fetchRoleById = async (id: string): Promise<Role> => {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching role:', error);
    throw error;
  }
  
  return data as Role;
};

export const createRole = async (role: Omit<Role, 'id'>): Promise<Role> => {
  // Ensure required fields are provided
  const roleData = {
    name: role.name,
    level: role.level || "organization", // Default to organization level
    description: role.description,
    permissions: role.permissions,
    organization_id: role.organization_id
  };

  const { data, error } = await supabase
    .from('roles')
    .insert(roleData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating role:', error);
    throw error;
  }
  
  return data as Role;
};

export const updateRole = async (id: string, updates: Partial<Role>): Promise<Role> => {
  const { data, error } = await supabase
    .from('roles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating role:', error);
    throw error;
  }
  
  return data as Role;
};

export const deleteRole = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('roles')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};

export const assignRoleToUser = async (
  userId: string, 
  roleId: string, 
  organizationId?: string, 
  facilityId?: string, 
  departmentId?: string
): Promise<UserRole> => {
  const { data, error } = await supabase
    .from('user_roles')
    .insert({
      user_id: userId,
      role_id: roleId,
      organization_id: organizationId,
      facility_id: facilityId,
      department_id: departmentId,
      assigned_by: (await supabase.auth.getUser()).data.user?.id
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error assigning role to user:', error);
    throw error;
  }
  
  return data as UserRole;
};

export const removeRoleFromUser = async (userRoleId: string): Promise<void> => {
  const { error } = await supabase
    .from('user_roles')
    .delete()
    .eq('id', userRoleId);
  
  if (error) {
    console.error('Error removing role from user:', error);
    throw error;
  }
};

export const getUserRoles = async (userId: string): Promise<UserRole[]> => {
  const { data, error } = await supabase
    .rpc('get_user_roles', { _user_id: userId });
  
  if (error) {
    console.error('Error fetching user roles:', error);
    throw error;
  }
  
  // Transform the data to match the UserRole interface
  const userRoles: UserRole[] = (data as any[]).map(role => ({
    id: role.role_id, // Using role_id as the id since we don't have a direct id field
    user_id: userId,
    role_id: role.role_id,
    role_name: role.role_name,
    permissions: role.permissions,
    organization_id: role.organization_id,
    facility_id: role.facility_id,
    department_id: role.department_id,
    // We don't have assigned_by and created_at in the response, so leaving them undefined
  }));
  
  return userRoles;
};

export const checkUserPermission = async (
  userId: string, 
  permission: string,
  organizationId?: string,
  facilityId?: string,
  departmentId?: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .rpc('has_permission', { 
      _user_id: userId, 
      _permission: permission,
      _org_id: organizationId || null,
      _facility_id: facilityId || null,
      _department_id: departmentId || null
    });
  
  if (error) {
    console.error('Error checking user permission:', error);
    throw error;
  }
  
  return data as boolean;
};

export const checkUserRole = async (
  userId: string, 
  roleName: string,
  organizationId?: string,
  facilityId?: string,
  departmentId?: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .rpc('has_role', { 
      _user_id: userId, 
      _role_name: roleName,
      _org_id: organizationId || null,
      _facility_id: facilityId || null,
      _department_id: departmentId || null
    });
  
  if (error) {
    console.error('Error checking user role:', error);
    throw error;
  }
  
  return data as boolean;
};

/**
 * Creates a role bypassing RLS using an RPC function
 */
export const createRoleWithRPC = async (role: Omit<Role, 'id'>): Promise<Role> => {
  try {
    // Use the generic 'functions.invoke' method instead of 'rpc' to avoid typing issues
    const { data, error } = await supabase.functions.invoke("create-role", {
      body: {
        name: role.name,
        description: role.description || '',
        level: role.level || 'organization',
        permissions: role.permissions || {}
      }
    });
    
    if (error) {
      console.error('Error creating role through RPC:', error);
      throw error;
    }
    
    // We need to cast the result to Role since it's coming from a custom function
    return data as unknown as Role;
  } catch (error) {
    console.error('Exception creating role through RPC:', error);
    throw error;
  }
};

/**
 * Assigns a role to a user bypassing RLS using an RPC function
 */
export const assignRoleToUserWithRPC = async (
  userId: string, 
  roleId: string, 
  assignedBy: string,
  organizationId?: string, 
  facilityId?: string, 
  departmentId?: string
): Promise<boolean> => {
  try {
    // Use the generic 'functions.invoke' method instead of 'rpc'
    const { data, error } = await supabase.functions.invoke("assign-user-role", {
      body: {
        userId,
        roleId,
        assignedBy,
        organizationId: organizationId || null,
        facilityId: facilityId || null,
        departmentId: departmentId || null
      }
    });
    
    if (error) {
      console.error('Error assigning role to user through RPC:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Exception assigning role to user through RPC:', error);
    throw error;
  }
};
