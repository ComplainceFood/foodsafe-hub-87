
// Stub implementation — KPI tables do not exist yet. Returns mock data.

export interface ProductionData { id?: string; month: string; target: number; actual: number; }
export interface QualityData { id?: string; month: string; defect_rate: number; return_rate: number; }
export interface SafetyData { id?: string; month: string; incidents: number; near_misses: number; }
export interface KpiMetric { id?: string; metric_name: string; metric_value: number; metric_target?: number; metric_unit?: string; trend?: number; trend_period?: string; progress_value?: number; icon: string; category: string; }
export type KpiDataSource = 'manual' | 'haccp' | 'audit' | 'non_conformance' | 'capa' | 'supplier' | 'training';

export const fetchProductionData = async (): Promise<ProductionData[]> => [];
export const fetchQualityData = async (): Promise<QualityData[]> => [];
export const fetchSafetyData = async (): Promise<SafetyData[]> => [];
export const fetchKpiMetrics = async (): Promise<KpiMetric[]> => [];
export const fetchAllKpiData = async () => ({
  productionData: [] as ProductionData[],
  qualityData: [] as QualityData[],
  safetyData: [] as SafetyData[],
  kpiMetrics: [] as KpiMetric[],
});
export const clearKpiCache = () => {};
export const updateKpiMetric = async (id: string, updates: Partial<Omit<KpiMetric, 'id'>>): Promise<KpiMetric | null> => null;
export const addProductionDataPoint = async (dataPoint: Omit<ProductionData, 'id'>): Promise<ProductionData | null> => null;
export const addQualityDataPoint = async (dataPoint: Omit<QualityData, 'id'>): Promise<QualityData | null> => null;
export const addSafetyDataPoint = async (dataPoint: Omit<SafetyData, 'id'>): Promise<SafetyData | null> => null;
