
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';
import { Role } from '@/types/role';

const db = supabase as any;

export const giveUserDeveloperAccess = async (userId: string): Promise<boolean> => {
  try {
    let developerRole: Role | null = null;
    
    const { data: existingRoles, error: roleQueryError } = await db
      .from('roles').select('*').eq('name', 'Developer').single();
    
    if (roleQueryError || !existingRoles) {
      const fullPermissions: Record<string, boolean> = {
        admin: true, 'dashboard.view': true, 'documents.create': true, 'documents.view': true,
        'documents.edit': true, 'documents.delete': true, 'haccp.view': true, 'training.view': true,
        'internal_audits.view': true, 'supplier_management.view': true, 'traceability.view': true,
        'capa.view': true, 'complaint_management.view': true, 'reports.view': true, 'standards.view': true,
        'non_conformance.view': true, 'organization.view': true, 'facilities.view': true,
        'users.view': true, 'users.create': true, 'users.edit': true, 'users.delete': true, 'users.status': true,
        'roles.view': true, 'roles.create': true, 'roles.edit': true, 'roles.delete': true,
        'departments.view': true, 'departments.create': true, 'departments.edit': true, 'departments.delete': true,
      };
      
      const response = await supabase.functions.invoke("create-role", {
        body: { name: 'Developer', description: 'Full system access for development purposes', level: 'organization', permissions: fullPermissions }
      });
      
      if (response.error) throw response.error;
      developerRole = response.data as Role;
    } else {
      developerRole = existingRoles as Role;
    }
    
    if (!developerRole || !developerRole.id) return false;
    
    const response = await supabase.functions.invoke("assign-user-role", {
      body: { userId, roleId: developerRole.id, assignedBy: userId }
    });
    if (response.error) throw response.error;
    
    await supabase.from('profiles').update({ role: 'Developer' } as any).eq('id', userId);
    
    return true;
  } catch (error) {
    console.error('Error giving user developer access:', error);
    return false;
  }
};

export const createQATechnicianRole = async (): Promise<Role | null> => {
  try {
    const { data: existingRoles, error: roleQueryError } = await db
      .from('roles').select('*').eq('name', 'QA Technician').single();
    
    if (!roleQueryError && existingRoles) return existingRoles as Role;
    
    const qaPermissions: Record<string, boolean> = {
      'dashboard.view': true, 'documents.view': true, 'haccp.view': true, 'training.view': true,
      'internal_audits.view': true, 'supplier_management.view': true, 'traceability.view': true,
      'capa.view': true, 'complaint_management.view': true, 'non_conformance.view': true, 'standards.view': true,
    };
    
    const { data: newRole, error } = await db.from('roles').insert({
      name: 'QA Technician', description: 'Quality assurance staff that performs quality checks and monitors compliance',
      level: 'facility', permissions: qaPermissions
    }).select().single();
    
    if (error) throw error;
    return newRole as Role;
  } catch (error) {
    console.error('Error creating QA Technician role:', error);
    return null;
  }
};

export const assignRoleToUser = async (
  userId: string, roleId: string, organizationId?: string, facilityId?: string, departmentId?: string
): Promise<boolean> => {
  try {
    const { data: existing, error: checkError } = await db
      .from('user_roles').select('*').eq('user_id', userId).eq('role_id', roleId);
    if (checkError) throw checkError;
    
    if (!existing || existing.length === 0) {
      const { error } = await db.from('user_roles').insert({
        user_id: userId, role_id: roleId, organization_id: organizationId,
        facility_id: facilityId, department_id: departmentId, assigned_by: userId
      });
      if (error) throw error;
    }
    return true;
  } catch (error) {
    console.error('Error assigning role to user:', error);
    return false;
  }
};

export const getUserRole = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.from('profiles').select('role').eq('id', userId).single();
    if (error) throw error;
    return (data as any)?.role || null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<boolean> => {
  try {
    const { error } = await supabase.from('profiles').update(updates as any).eq('id', userId);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};
