
import { supabase } from '@/integrations/supabase/client';

// Products
export const fetchProducts = async () => {
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const createProduct = async (product: any) => {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase.from('products').insert({ ...product, created_by: user?.id }).select().single();
  if (error) throw error;
  return data;
};

export const fetchProductById = async (id: string) => {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const updateProduct = async (id: string, updates: any) => {
  const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  return true;
};

// Components
export const fetchComponents = async () => {
  const { data, error } = await supabase.from('components').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const fetchComponentById = async (id: string) => {
  const { data, error } = await supabase.from('components').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const createComponent = async (component: any) => {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase.from('components').insert({ ...component, created_by: user?.id }).select().single();
  if (error) throw error;
  return data;
};

// Product-Component links
export const fetchProductComponents = async (productId: string) => {
  const { data, error } = await supabase
    .from('product_components')
    .select('*, components(*)')
    .eq('product_id', productId);
  if (error) throw error;
  return data || [];
};

export const createGenealogyLink = async (link: any) => {
  const { data, error } = await supabase.from('product_components').insert(link).select().single();
  if (error) throw error;
  return data;
};

// Recalls
export const fetchRecalls = async () => {
  const { data, error } = await supabase.from('recalls').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const fetchRecallById = async (id: string) => {
  const { data, error } = await supabase.from('recalls').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const createRecall = async (recall: any) => {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase.from('recalls').insert({ ...recall, initiated_by: user?.id }).select().single();
  if (error) throw error;
  return data;
};

// Search by batch/lot
export const fetchProductByBatchLot = async (batchLot: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`batch_number.ilike.%${batchLot}%,lot_number.ilike.%${batchLot}%`);
  if (error) throw error;
  return data || [];
};

// Supply chain data (aggregated from products + components)
export const fetchSupplyChainData = async () => {
  const products = await fetchProducts();
  const components = await fetchComponents();
  return {
    nodes: [
      ...products.map((p: any) => ({ id: p.id, name: p.name, type: 'product' })),
      ...components.map((c: any) => ({ id: c.id, name: c.name, type: 'component' }))
    ],
    links: []
  };
};

// Affected products by component
export const fetchAffectedProducts = async (componentId: string) => {
  const { data, error } = await supabase
    .from('product_components')
    .select('*, products(*)')
    .eq('component_id', componentId);
  if (error) throw error;
  return data || [];
};

export const fetchProductGenealogy = async (productId: string) => {
  return fetchProductComponents(productId);
};

// Stubs for features that don't need separate tables
export const fetchRecallSchedules = async () => [];
export const fetchRecallSimulations = async () => [];
export const fetchNotifications = async () => [];
export const createRecallSimulation = async (simulation: any) => ({ id: crypto.randomUUID(), ...simulation });
export const createRecallSchedule = async (schedule: any) => ({ id: crypto.randomUUID(), ...schedule });
export const createNotification = async (notification: any) => ({ id: crypto.randomUUID(), ...notification });
export const sendBulkNotifications = async (notifications: any[]) => notifications.map(n => ({ id: crypto.randomUUID(), ...n }));

export default {
  fetchProducts, createProduct, fetchProductById, updateProduct, deleteProduct,
  fetchComponents, fetchComponentById, createComponent,
  fetchProductComponents, createGenealogyLink,
  fetchRecalls, fetchRecallById, createRecall,
  fetchProductByBatchLot, fetchSupplyChainData, fetchAffectedProducts, fetchProductGenealogy,
  fetchRecallSchedules, fetchRecallSimulations, fetchNotifications,
  createRecallSimulation, createRecallSchedule, createNotification, sendBulkNotifications
};
