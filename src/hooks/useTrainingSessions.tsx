
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { trainingStatusToString, stringToTrainingStatus } from '@/utils/trainingAdapters';
import { supabase } from '@/integrations/supabase/client';
import { TrainingStatus } from '@/types/enums';

export interface TrainingSession {
  id: string;
  title: string;
  description: string;
  training_type: string;
  training_category?: string;
  assigned_to: string[];
  department?: string;
  start_date: string | null;
  due_date: string | null;
  completion_status: TrainingStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
  materials_id?: string[];
}

export const useTrainingSessions = () => {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('training_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedSessions: TrainingSession[] = (data || []).map((record: any) => ({
        id: record.id,
        title: record.title || '',
        description: record.description || '',
        training_type: record.training_type || 'Other',
        department: record.department,
        assigned_to: record.assigned_to ? [record.assigned_to] : [],
        start_date: record.created_at,
        due_date: record.due_date,
        completion_status: stringToTrainingStatus(record.status || 'Not Started'),
        created_by: record.created_by || 'system',
        created_at: record.created_at,
        updated_at: record.updated_at,
      }));

      setSessions(mappedSessions);
    } catch (err) {
      console.error('Error fetching training sessions:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      toast.error('Failed to fetch training sessions');
    } finally {
      setLoading(false);
    }
  }, []);

  const createSession = useCallback(async (sessionData: Partial<TrainingSession>) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      const status = sessionData.completion_status
        ? trainingStatusToString(sessionData.completion_status)
        : 'Not Started';

      const { data, error } = await supabase
        .from('training_records')
        .insert({
          title: sessionData.title || 'Untitled Session',
          description: sessionData.description || '',
          training_type: sessionData.training_type || 'Other',
          department: sessionData.department,
          assigned_to: sessionData.assigned_to?.[0] || null,
          due_date: sessionData.due_date,
          status,
          created_by: user?.id,
        } as any)
        .select()
        .single();

      if (error) throw error;

      await fetchSessions();
      toast.success('Training session created successfully');
      return data;
    } catch (err) {
      console.error('Error creating training session:', err);
      toast.error('Failed to create training session');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchSessions]);

  const updateSessionStatus = useCallback(async (sessionId: string, newStatus: TrainingStatus) => {
    try {
      setLoading(true);
      const statusString = trainingStatusToString(newStatus);

      const { data, error } = await supabase
        .from('training_records')
        .update({ status: statusString } as any)
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;

      setSessions(prev =>
        prev.map(session =>
          session.id === sessionId ? { ...session, completion_status: newStatus } : session
        )
      );

      toast.success(`Training session status updated to ${statusString}`);
      return data;
    } catch (err) {
      console.error('Error updating training session status:', err);
      toast.error('Failed to update training session status');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { sessions, loading, error, fetchSessions, createSession, updateSessionStatus };
};

export default useTrainingSessions;
