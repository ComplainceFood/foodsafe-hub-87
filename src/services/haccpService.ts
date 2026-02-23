
// Stub implementation — haccp_plans and ccps tables do not exist yet.

export interface HaccpPlan {
  id: string;
  title: string;
  description: string;
  product_scope: string;
  created_by: string;
  status: string;
  ccp_count: number;
  created_at: string;
  updated_at: string;
  version: number;
  approved_by?: string;
  approved_date?: string;
  last_review_date?: string;
  next_review_date?: string;
  review_frequency?: string;
}

export interface CriticalControlPoint {
  id: string;
  haccp_plan_id: string;
  step_number: number;
  step_description: string;
  hazard_description: string;
  critical_limits: string;
  monitoring_procedure: string;
  corrective_actions: string;
  verification_activities: string;
  record_keeping: string;
  created_at: string;
  updated_at: string;
}

const inMemoryPlans: HaccpPlan[] = [];
const inMemoryCCPs: CriticalControlPoint[] = [];

export const fetchHaccpPlans = async (): Promise<HaccpPlan[]> => {
  return [...inMemoryPlans];
};

export const fetchHaccpPlanById = async (planId: string): Promise<HaccpPlan | null> => {
  return inMemoryPlans.find(p => p.id === planId) || null;
};

export const fetchCriticalControlPoints = async (planId: string): Promise<CriticalControlPoint[]> => {
  return inMemoryCCPs.filter(c => c.haccp_plan_id === planId);
};

export const createHaccpPlan = async (plan: Partial<HaccpPlan>): Promise<HaccpPlan | null> => {
  const newPlan: HaccpPlan = {
    id: crypto.randomUUID(),
    title: plan.title || '',
    description: plan.description || '',
    product_scope: plan.product_scope || '',
    created_by: plan.created_by || 'system',
    status: plan.status || 'Draft',
    ccp_count: 0,
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...plan,
  } as HaccpPlan;
  inMemoryPlans.push(newPlan);
  return newPlan;
};

export const updateHaccpPlan = async (planId: string, updates: Partial<HaccpPlan>): Promise<HaccpPlan | null> => {
  const idx = inMemoryPlans.findIndex(p => p.id === planId);
  if (idx === -1) return null;
  inMemoryPlans[idx] = { ...inMemoryPlans[idx], ...updates, updated_at: new Date().toISOString() };
  return inMemoryPlans[idx];
};

export const addCriticalControlPoint = async (ccp: Partial<CriticalControlPoint>): Promise<CriticalControlPoint | null> => {
  const newCCP: CriticalControlPoint = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...ccp,
  } as CriticalControlPoint;
  inMemoryCCPs.push(newCCP);
  return newCCP;
};
