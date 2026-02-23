
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface TrainingAutomationConfig {
  id: string;
  enabled: boolean;
  documentChangesTrigger: boolean;
  newEmployeeTrigger: boolean;
  roleChangeTrigger: boolean;
  rules: any[];
  created_at: string;
  updated_at: string;
  created_by: string;
}

// Stub implementation — training_automation_config table does not exist yet.
// This hook returns a sensible default so the UI renders without errors.
export const useTrainingConfig = () => {
  const [config, setConfig] = useState<TrainingAutomationConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      // No DB table yet — use in-memory default
      const defaultConfig: TrainingAutomationConfig = {
        id: 'default',
        enabled: true,
        documentChangesTrigger: true,
        newEmployeeTrigger: true,
        roleChangeTrigger: true,
        rules: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'system'
      };
      setConfig(defaultConfig);
    } catch (err) {
      console.error('Error fetching training config:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch training configuration'));
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConfig = async (updates: Partial<TrainingAutomationConfig>) => {
    try {
      if (!config) throw new Error('Cannot update: configuration not loaded');
      const updatedConfig = { ...config, ...updates, updated_at: new Date().toISOString() };
      setConfig(updatedConfig);
      toast.success('Training automation configuration updated');
      return true;
    } catch (err) {
      console.error('Error updating config:', err);
      setError(err instanceof Error ? err : new Error('Failed to update configuration'));
      toast.error('Failed to update configuration');
      return false;
    }
  };

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return { config, loading, error, updateConfig, refreshConfig: fetchConfig };
};
