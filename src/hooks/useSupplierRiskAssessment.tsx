
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface RiskAssessment {
  id: string;
  supplier_id: string;
  assessed_by: string;
  assessment_date: string;
  overall_score: number;
  risk_level: string;
  food_safety_score: number;
  quality_system_score: number;
  regulatory_score: number;
  delivery_score: number;
  traceability_score: number;
  notes?: string;
  next_assessment_date?: string;
  risk_factors?: any;
  created_at: string;
  updated_at: string;
  suppliers?: { name: string };
}

export interface RiskStatistics {
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  totalAssessments: number;
}

export function useSupplierRiskAssessment(supplierId?: string) {
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [statistics, setStatistics] = useState<RiskStatistics>({
    highRiskCount: 0, mediumRiskCount: 0, lowRiskCount: 0, totalAssessments: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadAssessments = async () => {
    // No supplier_risk_assessments table yet - return empty
    setAssessments([]);
    setIsLoading(false);
  };

  const createRiskAssessment = async (assessment: any) => {
    toast.info('Risk assessment feature coming soon');
    return null;
  };

  useEffect(() => { loadAssessments(); }, [supplierId]);

  return { assessments, statistics, isLoading, error, loadAssessments, createRiskAssessment };
}
