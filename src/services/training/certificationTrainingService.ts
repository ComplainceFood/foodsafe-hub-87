
import { supabase } from '@/integrations/supabase/client';

const db = supabase as any;

const certificationTrainingService = {
  processExpiringCertifications: async (daysThreshold: number = 30): Promise<boolean> => {
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + daysThreshold);
      
      const { data: certifications, error } = await db
        .from('certifications').select('*').eq('status', 'Valid')
        .lt('expiry_date', expiryDate.toISOString()).eq('reminder_sent', false);
      if (error) throw error;
      
      if (certifications && certifications.length > 0) {
        const { error: updateError } = await db
          .from('certifications').update({ reminder_sent: true })
          .in('id', certifications.map((cert: any) => cert.id));
        if (updateError) throw updateError;
        console.log(`Processed ${certifications.length} expiring certifications`);
      }
      return true;
    } catch (error) {
      console.error('Error processing expiring certifications:', error);
      return false;
    }
  },
  
  createRemediationTraining: async (failedAssessmentIds: string[]): Promise<boolean> => {
    try {
      const { data: failedAssessments, error } = await db
        .from('training_progress').select('*, assignment:assignment_id(employee_id, employee_name, course_id)')
        .in('id', failedAssessmentIds).eq('pass_fail', false);
      if (error) throw error;
      
      if (failedAssessments && failedAssessments.length > 0) {
        const remediationAssignments = failedAssessments.map((assessment: any) => {
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + 14);
          return {
            employee_id: assessment.assignment?.employee_id,
            employee_name: assessment.assignment?.employee_name,
            course_id: assessment.assignment?.course_id,
            due_date: dueDate.toISOString(), status: 'Not Started',
            assigned_by: 'System', is_remediation: true, original_assessment_id: assessment.id
          };
        });
        
        const { error: insertError } = await db.from('training_records').insert(remediationAssignments);
        if (insertError) throw insertError;
      }
      return true;
    } catch (error) {
      console.error('Error creating remediation training:', error);
      return false;
    }
  },
};

export default certificationTrainingService;
