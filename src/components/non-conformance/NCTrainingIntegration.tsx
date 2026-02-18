
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface NCTrainingIntegrationProps {
  ncId: string;
  ncTitle: string;
  ncDescription: string;
  severity?: string;
  category?: string;
}

const NCTrainingIntegration: React.FC<NCTrainingIntegrationProps> = ({
  ncId,
  ncTitle,
  ncDescription,
  severity = 'medium',
  category = 'general'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [trainingTitle, setTrainingTitle] = useState(`Remedial Training: ${ncTitle}`);

  const handleCreateTraining = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('training_records')
        .insert({
          title: trainingTitle,
          description: `Training related to NC: ${ncTitle}. ${ncDescription || ''}`,
          training_type: 'Compliance',
          category: category,
          status: 'Not Started',
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          created_by: user?.id,
        });

      if (error) throw error;
      
      toast.success('Training record created successfully');
      setShowForm(false);
    } catch (error) {
      console.error('Error creating training:', error);
      toast.error('Failed to create training record');
    } finally {
      setIsLoading(false);
    }
  };

  if (!showForm) {
    return (
      <div className="mt-4">
        <Button onClick={() => setShowForm(true)} className="w-full" variant="outline">
          <BookOpen className="mr-2 h-4 w-4" />
          Assign Remedial Training
        </Button>
      </div>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          Assign Remedial Training
        </CardTitle>
        <CardDescription>Create training assignments based on this non-conformance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-md">
            <h4 className="text-sm font-medium">{ncTitle}</h4>
            <p className="text-xs text-muted-foreground mt-1">{ncDescription}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Training Title</label>
            <input 
              className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
              value={trainingTitle}
              onChange={(e) => setTrainingTitle(e.target.value)}
            />
          </div>

          <Button className="w-full" onClick={handleCreateTraining} disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Training Record'}
          </Button>
          
          <Button className="w-full" variant="outline" onClick={() => setShowForm(false)} disabled={isLoading}>
            <ClipboardList className="mr-2 h-4 w-4" />Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NCTrainingIntegration;
