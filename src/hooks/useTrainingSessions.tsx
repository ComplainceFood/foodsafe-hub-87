
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
        .from('training_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map database records to TrainingSession objects
      const mappedSessions: TrainingSession[] = data.map(session => ({
        ...session,
        completion_status: stringToTrainingStatus(session.completion_status as string)
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
      
      // Ensure required fields are present
      const requiredData = {
        title: sessionData.title || 'Untitled Session',
        training_type: sessionData.training_type || 'Other',
        assigned_to: sessionData.assigned_to || [],
        created_by: sessionData.created_by || 'system'
      };
      
      // Convert enum to string for database storage
      const completion_status = sessionData.completion_status ? 
        trainingStatusToString(sessionData.completion_status) : 
        trainingStatusToString(TrainingStatus.NotStarted);
      
      const newSession = {
        ...sessionData,
        ...requiredData,
        completion_status
      };
      
      // Use object instead of array for insert, and cast any string values that need to be enum values in the db
      const { data, error } = await supabase
        .from('training_sessions')
        .insert({...newSession, completion_status: completion_status as any})
        .select()
        .single();
      
      if (error) throw error;
      
      // Add the new session to the state
      const convertedSession = {
        ...data,
        completion_status: stringToTrainingStatus(data.completion_status as string)
      } as TrainingSession;
      
      setSessions(prev => [convertedSession, ...prev]);
      
      toast.success('Training session created successfully');
      
      return data;
    } catch (err) {
      console.error('Error creating training session:', err);
      
      toast.error('Failed to create training session');
      
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSessionStatus = useCallback(async (sessionId: string, newStatus: TrainingStatus) => {
    try {
      setLoading(true);
      
      const statusString = trainingStatusToString(newStatus);
      
      const { data, error } = await supabase
        .from('training_sessions')
        .update({ completion_status: statusString as any })
        .eq('id', sessionId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update the session in the state
      setSessions(prev => 
        prev.map(session => 
          session.id === sessionId ? { ...session, completion_status: newStatus } : session
        )
      );
      
      toast.success(`Training session status updated to ${trainingStatusToString(newStatus)}`);
      
      return data;
    } catch (err) {
      console.error('Error updating training session status:', err);
      
      toast.error('Failed to update training session status');
      
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sessions,
    loading,
    error,
    fetchSessions,
    createSession,
    updateSessionStatus
  };
};

export default useTrainingSessions;
