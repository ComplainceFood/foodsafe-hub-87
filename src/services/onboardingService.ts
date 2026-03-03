
import { supabase } from '@/integrations/supabase/client';
import { OnboardingInvite } from '@/types/onboarding';
import { v4 as uuidv4 } from 'uuid';

export const createInvite = async (
  email: string,
  organizationId: string,
  facilityId?: string,
  departmentId?: string,
  roleId?: string
): Promise<OnboardingInvite> => {
  const user = (await supabase.auth.getUser()).data.user;
  
  if (!user) {
    throw new Error('Not authenticated');
  }

  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  const invite: Omit<OnboardingInvite, 'id'> = {
    email,
    organization_id: organizationId,
    facility_id: facilityId,
    department_id: departmentId,
    role_id: roleId,
    invited_by: user.id,
    expires_at: expiresAt.toISOString(),
    token,
    used: false
  };
  
  const { data, error } = await (supabase as any)
    .from('onboarding_invites')
    .insert(invite)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating invite:', error);
    throw error;
  }
  
  return data as OnboardingInvite;
};

export const getInviteByToken = async (token: string): Promise<OnboardingInvite | null> => {
  const { data, error } = await (supabase as any)
    .from('onboarding_invites')
    .select('*')
    .eq('token', token)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching invite:', error);
    throw error;
  }
  
  return data as OnboardingInvite;
};

export const markInviteAsUsed = async (token: string): Promise<void> => {
  const { error } = await (supabase as any)
    .from('onboarding_invites')
    .update({ used: true })
    .eq('token', token);
  
  if (error) {
    console.error('Error marking invite as used:', error);
    throw error;
  }
};

export const getOrganizationInvites = async (organizationId: string): Promise<OnboardingInvite[]> => {
  const { data, error } = await (supabase as any)
    .from('onboarding_invites')
    .select('*')
    .eq('organization_id', organizationId)
    .order('invited_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching organization invites:', error);
    throw error;
  }
  
  return data as OnboardingInvite[];
};

export const deleteInvite = async (id: string): Promise<void> => {
  const { error } = await (supabase as any)
    .from('onboarding_invites')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting invite:', error);
    throw error;
  }
};
