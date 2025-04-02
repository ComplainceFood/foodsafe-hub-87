
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { StandardName } from '@/types/supplier';
import { supabase } from '@/integrations/supabase/client';

interface StandardRequirement {
  id: string;
  standard: string;
  name: string;
  description: string;
  category: string;
}

interface StandardRequirementsProps {
  standard: StandardName;
}

const StandardRequirements: React.FC<StandardRequirementsProps> = ({
  standard
}) => {
  const [requirements, setRequirements] = useState<StandardRequirement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchRequirements = async () => {
      setIsLoading(true);
      try {
        const {
          data,
          error
        } = await supabase.from('standard_requirements').select('*').eq('standard', standard);
        if (error) throw error;
        setRequirements(data || []);
      } catch (error) {
        console.error('Error fetching standard requirements:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequirements();
  }, [standard]);

  // Fallback content for empty database
  const getFallbackRequirements = () => {
    switch (standard) {
      case 'SQF':
        return [{
          id: '1',
          standard: 'SQF',
          name: 'Food Safety Plan',
          category: 'Documentation',
          description: 'Comprehensive HACCP-based food safety plan'
        }, {
          id: '2',
          standard: 'SQF',
          name: 'Management Responsibility',
          category: 'Leadership',
          description: 'Commitment from senior management'
        }, {
          id: '3',
          standard: 'SQF',
          name: 'Food Safety System',
          category: 'System',
          description: 'Documented system for food safety'
        }];
      case 'BRC GS2':
        return [{
          id: '1',
          standard: 'BRC GS2',
          name: 'Senior Management Commitment',
          category: 'Leadership',
          description: 'Demonstrated commitment to standard'
        }, {
          id: '2',
          standard: 'BRC GS2',
          name: 'Food Safety Plan',
          category: 'Documentation',
          description: 'HACCP-based plan'
        }, {
          id: '3',
          standard: 'BRC GS2',
          name: 'Site Standards',
          category: 'Facilities',
          description: 'Physical standards for safety'
        }];
      case 'FSSC 22000':
        return [{
          id: '1',
          standard: 'FSSC 22000',
          name: 'Management System',
          category: 'System',
          description: 'Food safety management system'
        }, {
          id: '2',
          standard: 'FSSC 22000',
          name: 'PRPs',
          category: 'Prerequisites',
          description: 'Prerequisite programs'
        }, {
          id: '3',
          standard: 'FSSC 22000',
          name: 'HACCP',
          category: 'Documentation',
          description: 'HACCP principles and critical control points'
        }];
      default:
        return [];
    }
  };
  
  const displayRequirements = requirements.length > 0 ? requirements : getFallbackRequirements();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{standard} Requirements</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {displayRequirements.map((req) => (
              <div key={req.id} className="border rounded-md p-3 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      {req.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{req.description}</p>
                  </div>
                  <div className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                    {req.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StandardRequirements;
