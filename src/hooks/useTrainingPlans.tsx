
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TrainingPlan } from '@/types/training';
import { supabase } from '@/integrations/supabase/client';

export function useTrainingPlans() {
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTrainingPlans = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('training_plans')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Transform database data to match our TrainingPlan interface
        const transformedPlans: TrainingPlan[] = (data || []).map(plan => ({
          id: plan.id,
          name: plan.name,
          description: plan.description,
          targetRoles: plan.target_roles || [],
          coursesIncluded: plan.courses || [],
          durationDays: plan.duration_days || 0,
          isRequired: plan.is_required || false,
          priority: plan.priority || 'medium',
          status: plan.status,
          startDate: plan.start_date,
          endDate: plan.end_date,
          isAutomated: plan.is_automated,
          automationTrigger: plan.automation_trigger,
          createdBy: plan.created_by,
          created_by: plan.created_by,
          createdDate: plan.created_at,
          created_at: plan.created_at,
          updated_at: plan.updated_at,
          courses: plan.courses,
          targetDepartments: plan.target_departments,
          relatedStandards: plan.related_standards,
          target_departments: plan.target_departments,
          duration_days: plan.duration_days,
          target_roles: plan.target_roles,
          is_required: plan.is_required,
          is_automated: plan.is_automated,
          start_date: plan.start_date,
          end_date: plan.end_date,
          automation_trigger: plan.automation_trigger,
          related_standards: plan.related_standards
        }));
        
        setPlans(transformedPlans);
      } catch (err) {
        console.error('Error fetching training plans:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch training plans'));
        toast({
          title: 'Error',
          description: 'Failed to load training plans. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingPlans();
  }, [toast]);

  const createTrainingPlan = async (planData: Partial<TrainingPlan>): Promise<TrainingPlan | null> => {
    try {
      setLoading(true);
      
      // Convert from our interface to the database schema
      const dbPlan = {
        name: planData.name,
        description: planData.description,
        target_roles: planData.targetRoles || planData.target_roles,
        courses: planData.coursesIncluded || planData.courses,
        duration_days: planData.durationDays || planData.duration_days,
        is_required: planData.isRequired || planData.is_required,
        priority: planData.priority,
        status: planData.status,
        start_date: planData.startDate || planData.start_date,
        end_date: planData.endDate || planData.end_date,
        is_automated: planData.isAutomated || planData.is_automated,
        automation_trigger: planData.automationTrigger || planData.automation_trigger,
        target_departments: planData.targetDepartments || planData.target_departments,
        related_standards: planData.relatedStandards || planData.related_standards,
        created_by: planData.createdBy || planData.created_by || 'Current User'
      };
      
      const { data, error } = await supabase
        .from('training_plans')
        .insert(dbPlan)
        .select()
        .single();
        
      if (error) throw error;
      
      // Transform database response to match our TrainingPlan interface
      const newPlan: TrainingPlan = {
        id: data.id,
        name: data.name,
        description: data.description,
        targetRoles: data.target_roles || [],
        coursesIncluded: data.courses || [],
        durationDays: data.duration_days || 0,
        isRequired: data.is_required || false,
        priority: data.priority || 'medium',
        status: data.status,
        startDate: data.start_date,
        endDate: data.end_date,
        isAutomated: data.is_automated,
        automationTrigger: data.automation_trigger,
        createdBy: data.created_by,
        created_by: data.created_by,
        createdDate: data.created_at,
        created_at: data.created_at,
        updated_at: data.updated_at,
        courses: data.courses,
        targetDepartments: data.target_departments,
        relatedStandards: data.related_standards,
        target_departments: data.target_departments,
        duration_days: data.duration_days,
        target_roles: data.target_roles,
        is_required: data.is_required,
        is_automated: data.is_automated,
        start_date: data.start_date,
        end_date: data.end_date,
        automation_trigger: data.automation_trigger,
        related_standards: data.related_standards
      };
      
      setPlans(prev => [newPlan, ...prev]);
      
      toast({
        title: 'Success',
        description: 'Training plan created successfully.',
      });
      
      return newPlan;
    } catch (err) {
      console.error('Error creating training plan:', err);
      toast({
        title: 'Error',
        description: 'Failed to create training plan. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateTrainingPlan = async (
    planId: string,
    updates: Partial<TrainingPlan>
  ): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Convert from our interface to the database schema
      const dbUpdates = {
        name: updates.name,
        description: updates.description,
        target_roles: updates.targetRoles || updates.target_roles,
        courses: updates.coursesIncluded || updates.courses,
        duration_days: updates.durationDays || updates.duration_days,
        is_required: updates.isRequired || updates.is_required,
        priority: updates.priority,
        status: updates.status,
        start_date: updates.startDate || updates.start_date,
        end_date: updates.endDate || updates.end_date,
        is_automated: updates.isAutomated || updates.is_automated,
        automation_trigger: updates.automationTrigger || updates.automation_trigger,
        target_departments: updates.targetDepartments || updates.target_departments,
        related_standards: updates.relatedStandards || updates.related_standards,
        created_by: updates.createdBy || updates.created_by || 'Current User'
      };
      
      const { error } = await supabase
        .from('training_plans')
        .update(dbUpdates)
        .eq('id', planId);
        
      if (error) throw error;
      
      // Update the local state
      setPlans(prevPlans => 
        prevPlans.map(plan => 
          plan.id === planId ? { ...plan, ...updates } : plan
        )
      );
      
      toast({
        title: 'Success',
        description: 'Training plan updated successfully.',
      });
      
      return true;
    } catch (err) {
      console.error('Error updating training plan:', err);
      toast({
        title: 'Error',
        description: 'Failed to update training plan. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    plans,
    loading,
    error,
    createTrainingPlan,
    updateTrainingPlan
  };
}
