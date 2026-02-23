
import { supabase } from '@/integrations/supabase/client';
import { TrainingRecord, TrainingSession } from '@/types/training';
import { TrainingStatus } from '@/types/enums';
import { v4 as uuidv4 } from 'uuid';

export const fetchTrainingSessions = async (): Promise<TrainingSession[]> => {
  const { data, error } = await supabase
    .from('training_records')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching training sessions:', error);
    throw new Error('Failed to fetch training sessions');
  }

  return (data || []) as unknown as TrainingSession[];
};

export const fetchTrainingRecords = async (): Promise<TrainingRecord[]> => {
  const { data, error } = await supabase
    .from('training_records')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching training records:', error);
    throw new Error('Failed to fetch training records');
  }

  return (data || []) as unknown as TrainingRecord[];
};

export const createTrainingSession = async (session: Partial<TrainingSession>): Promise<TrainingSession> => {
  if (!session.title) throw new Error('Missing required fields for training session');

  const { data, error } = await supabase
    .from('training_records')
    .insert({
      title: session.title,
      description: session.description || '',
      training_type: session.training_type || 'Other',
      status: 'Not Started',
      created_by: session.created_by,
    } as any)
    .select()
    .single();

  if (error) throw new Error('Failed to create training session');
  return data as unknown as TrainingSession;
};

export const createTrainingRecord = async (record: Partial<TrainingRecord>): Promise<TrainingRecord> => {
  const { data, error } = await supabase
    .from('training_records')
    .insert({
      title: (record as any).title || 'Training Record',
      status: (record.status || 'Not Started') as string,
    } as any)
    .select()
    .single();

  if (error) throw new Error('Failed to create training record');
  return data as unknown as TrainingRecord;
};

export const fetchRelatedTraining = async (sourceId: string, sourceType: string = 'non_conformance'): Promise<any[]> => {
  return [];
};

export const subscribeToTrainingUpdates = (callback: (payload: any) => void) => {
  const channel = supabase
    .channel('public:training_records')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'training_records' }, callback)
    .subscribe();
  return () => { supabase.removeChannel(channel); };
};

export const updateTrainingStatus = async (
  recordId: string, newStatus: TrainingStatus, score?: number, notes?: string
): Promise<TrainingRecord> => {
  const updates: any = { status: newStatus as string };
  if (newStatus === TrainingStatus.Completed) {
    updates.completion_date = new Date().toISOString();
    if (score !== undefined) updates.score = score;
  }

  const { data, error } = await supabase
    .from('training_records')
    .update(updates)
    .eq('id', recordId)
    .select()
    .single();

  if (error) throw new Error('Failed to update training status');
  return data as unknown as TrainingRecord;
};

export default {
  fetchTrainingSessions, fetchTrainingRecords, createTrainingSession,
  createTrainingRecord, fetchRelatedTraining, subscribeToTrainingUpdates, updateTrainingStatus
};
