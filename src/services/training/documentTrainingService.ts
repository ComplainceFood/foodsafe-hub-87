
import { supabase } from '@/integrations/supabase/client';
import { DocumentControlIntegration } from '@/types/training';

const db = supabase as any;

const documentTrainingService = {
  handleDocumentUpdate: async (documentUpdate: DocumentControlIntegration): Promise<boolean> => {
    try {
      if (documentUpdate.trainingRequired) {
        const { data: employees, error: employeeError } = await supabase
          .from('profiles').select('id, full_name')
          .in('role', documentUpdate.affectedRoles || []);
        if (employeeError) throw employeeError;
        
        if (employees && employees.length > 0) {
          const { data: course, error: courseError } = await db
            .from('training_courses').select('id').eq('document_id', documentUpdate.documentId).single();
          if (courseError && courseError.code !== 'PGRST116') throw courseError;
          
          let courseId = course?.id;
          
          if (!courseId) {
            const { data: newCourse, error: newCourseError } = await db
              .from('training_courses').insert({
                title: `${documentUpdate.documentTitle} Training`,
                description: `Training for ${documentUpdate.changeType.toLowerCase()} document: ${documentUpdate.documentTitle}`,
                document_id: documentUpdate.documentId, duration_hours: 1, created_by: 'System'
              }).select('id').single();
            if (newCourseError) throw newCourseError;
            courseId = newCourse?.id;
          }
          
          if (courseId) {
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + (documentUpdate.trainingDeadlineDays || 30));
            const assignments = employees.map((emp: any) => ({
              employee_id: emp.id, employee_name: emp.full_name, course_id: courseId,
              due_date: dueDate.toISOString(), status: 'Not Started', assigned_by: 'System',
            }));
            const { error: assignError } = await db.from('training_records').insert(assignments);
            if (assignError) throw assignError;
          }
        }
      }
      return true;
    } catch (error) {
      console.error('Error handling document update for training:', error);
      return false;
    }
  },
  
  getDocumentTrainingNotifications: async () => {
    try {
      const { data, error } = await db.from('training_records')
        .select('*').eq('status', 'Not Started').is('notification_sent', false);
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting document training notifications:', error);
      return [];
    }
  },
};

export default documentTrainingService;
