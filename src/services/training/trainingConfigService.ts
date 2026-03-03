
import { supabase } from '@/integrations/supabase/client';
import { TrainingAutomationConfig } from '@/types/training';

const db = supabase as any;

const trainingConfigService = {
  getAutomationConfig: async (): Promise<TrainingAutomationConfig | null> => {
    try {
      const { data, error } = await db.from('training_automation_config').select('*').limit(1).single();
      if (error) {
        if (error.code === 'PGRST116') {
          return await trainingConfigService.updateAutomationConfig({
            enabled: true, rules: [], documentChangesTrigger: true,
            newEmployeeTrigger: true, roleCangeTrigger: true
          });
        }
        throw error;
      }
      return data as TrainingAutomationConfig;
    } catch (error) {
      console.error('Error getting training automation config:', error);
      return null;
    }
  },
  
  updateAutomationConfig: async (config: Partial<TrainingAutomationConfig>): Promise<TrainingAutomationConfig | null> => {
    try {
      const { data: existingConfig, error: checkError } = await db
        .from('training_automation_config').select('id').limit(1).single();
      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      
      let result;
      if (existingConfig) {
        const { data, error } = await db.from('training_automation_config')
          .update(config).eq('id', existingConfig.id).select('*').single();
        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await db.from('training_automation_config')
          .insert(config).select('*').single();
        if (error) throw error;
        result = data;
      }
      return result as TrainingAutomationConfig;
    } catch (error) {
      console.error('Error updating training automation config:', error);
      return null;
    }
  },
};

export default trainingConfigService;
