import { useState, useEffect, useCallback } from 'react';
import { 
  Product, 
  Component, 
  Recall, 
  RecallSchedule,
  ProductGenealogy,
  GraphData,
  TraceabilityNotification,
  TreeNode,
  RecallSimulation,
  SupplyChainPartner
} from '@/types/traceability';
import { 
  fetchProducts, 
  fetchComponents, 
  fetchRecalls, 
  fetchRecallSchedules,
  fetchProductById,
  fetchComponentById,
  fetchRecallById,
  fetchProductGenealogy,
  fetchSupplyChainData,
  fetchRecallSimulations,
  fetchNotifications,
  fetchProductComponents,
  fetchAffectedProducts,
  fetchProductByBatchLot,
  createProduct,
  createComponent,
  createGenealogyLink,
  createRecall,
  createRecallSimulation,
  createRecallSchedule,
  createNotification,
  sendBulkNotifications
} from '@/services/traceabilityService';

export const useTraceability = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [recalls, setRecalls] = useState<Recall[]>([]);
  const [recallSchedules, setRecallSchedules] = useState<RecallSchedule[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [selectedRecall, setSelectedRecall] = useState<Recall | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<RecallSchedule | null>(null);
  const [genealogyTree, setGenealogyTree] = useState<TreeNode | null>(null);
  const [supplyChainData, setSupplyChainData] = useState<GraphData | null>(null);
  const [recallSimulations, setRecallSimulations] = useState<RecallSimulation[]>([]);
  const [notifications, setNotifications] = useState<TraceabilityNotification[]>([]);
  const [productComponents, setProductComponents] = useState<Component[]>([]);
  const [affectedProducts, setAffectedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  // Load all products
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts();
      setProducts(data || []);
      return data;
    } catch (err) {
      setError(err);
      console.error("Error loading products:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load all components
  const loadComponents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchComponents();
      setComponents(data || []);
      return data;
    } catch (err) {
      setError(err);
      console.error("Error loading components:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load all recalls
  const loadRecalls = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecalls();
      setRecalls(data || []);
      return data;
    } catch (err) {
      setError(err);
      console.error("Error loading recalls:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load all recall schedules
  const loadRecallSchedules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecallSchedules();
      setRecallSchedules(data || []);
      return data;
    } catch (err) {
      setError(err);
      console.error("Error loading recall schedules:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load a specific product by ID
  const loadProduct = useCallback(async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProductById(productId);
      return data;
    } catch (err) {
      setError(err);
      console.error("Error loading product:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load a specific component by ID
  const loadComponent = useCallback(async (componentId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchComponentById(componentId);
      return data;
    } catch (err) {
      setError(err);
      console.error("Error loading component:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load a specific recall by ID
  const loadRecall = useCallback(async (recallId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecallById(recallId);
      return data;
    } catch (err) {
      setError(err);
      console.error("Error loading recall:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load product by batch/lot number
  const loadProductByBatchLot = useCallback(async (batchLotNumber: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProductByBatchLot(batchLotNumber);
      return data;
    } catch (err) {
      setError(err);
      console.error("Error loading product by batch/lot:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load genealogy tree for a product
  const loadGenealogyTree = useCallback(async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProductGenealogy(productId);
      if (data) {
      const treeNode: TreeNode = {
          id: productId,
          name: "Product Root",
          type: "product",
          children: Array.isArray(data) ? data.map((item: any) => ({
            id: item.component_id || item.id || `node-${Math.random()}`,
            name: item.components?.name || "Unknown",
            type: "component" as const
          })) : []
        };
        setGenealogyTree(treeNode);
      }
      return data;
    } catch (err) {
      setError(err);
      console.error("Error loading genealogy tree:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load supply chain visualization data
  const loadSupplyChainVisualization = useCallback(async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSupplyChainData();
      if (data) {
        const graphData: GraphData = {
          nodes: Array.isArray(data.nodes) ? data.nodes : [],
          edges: Array.isArray(data.links) ? data.links.map((link: any) => ({
            source: link.source,
            target: link.target,
            type: link.type,
            id: `${link.source}-${link.target}`,
            label: link.type || 'connects to'
          })) : []
        };
        setSupplyChainData(graphData);
      }
      return data;
    } catch (err) {
      setError(err);
      console.error("Error loading supply chain data:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load recall simulations for a recall
  const loadRecallSimulations = useCallback(async (recallId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecallSimulations();
      setRecallSimulations(data || []);
      return data;
    } catch (err) {
      setError(err);
      console.error("Error loading recall simulations:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load notifications for a recall
  const loadNotifications = useCallback(async (recallId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications();
      setNotifications(data || []);
      return data;
    } catch (err) {
      setError(err);
      console.error("Error loading notifications:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load components for a product (by batch/lot number)
  const loadProductComponents = useCallback(async (batchLotNumber: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProductComponents(batchLotNumber);
      const mapped = (data || []).map((item: any) => item.components || item);
      setProductComponents(mapped);
      return data;
    } catch (err) {
      setError(err);
      console.error("Error loading product components:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load affected products for a component (by batch/lot number)
  const loadAffectedProducts = useCallback(async (batchLotNumber: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAffectedProducts(batchLotNumber);
      setAffectedProducts(data || []);
      return data;
    } catch (err) {
      setError(err);
      console.error("Error loading affected products:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new product
  const addProduct = useCallback(async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createProduct(productData);
      if (data) {
        setProducts(prev => [data, ...prev]);
      }
      return data;
    } catch (err) {
      setError(err);
      console.error("Error adding product:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new component
  const addComponent = useCallback(async (componentData: Omit<Component, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createComponent(componentData);
      if (data) {
        setComponents(prev => [data, ...prev]);
      }
      return data;
    } catch (err) {
      setError(err);
      console.error("Error adding component:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a genealogy link
  const addGenealogyLink = useCallback(async (genealogyData: Omit<ProductGenealogy, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createGenealogyLink(genealogyData);
      return data;
    } catch (err) {
      setError(err);
      console.error("Error adding genealogy link:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new recall
  const addRecall = useCallback(async (recallData: Omit<Recall, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createRecall(recallData);
      if (data) {
        setRecalls(prev => [data, ...prev]);
      }
      return data;
    } catch (err) {
      setError(err);
      console.error("Error adding recall:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a recall simulation
  const addRecallSimulation = useCallback(async (simulationData: Omit<RecallSimulation, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createRecallSimulation(simulationData);
      if (data) {
        setRecallSimulations(prev => [data, ...prev]);
      }
      return data;
    } catch (err) {
      setError(err);
      console.error("Error adding recall simulation:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a recall schedule
  const addRecallSchedule = useCallback(async (scheduleData: Omit<RecallSchedule, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createRecallSchedule(scheduleData);
      if (data) {
        setRecallSchedules(prev => [data, ...prev]);
      }
      return data;
    } catch (err) {
      setError(err);
      console.error("Error adding recall schedule:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a notification
  const addNotification = useCallback(async (notificationData: Omit<TraceabilityNotification, 'id' | 'created_at' | 'sent_at' | 'status'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createNotification(notificationData);
      if (data) {
        setNotifications(prev => [data, ...prev]);
      }
      return data;
    } catch (err) {
      setError(err);
      console.error("Error adding notification:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Send bulk notifications
  const sendAllNotifications = useCallback(async (recallId: string, subject: string, message: string, createdBy: string) => {
    setLoading(true);
    setError(null);
    try {
      const notificationParams = {
        recallId,
        subject,
        message,
        createdBy
      };
      const data = await sendBulkNotifications([notificationParams]);
      return data;
    } catch (err) {
      setError(err);
      console.error("Error sending bulk notifications:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    components,
    recalls,
    recallSchedules,
    selectedProduct,
    selectedComponent,
    selectedRecall,
    selectedSchedule,
    genealogyTree,
    supplyChainData,
    recallSimulations,
    notifications,
    productComponents,
    affectedProducts,
    loading,
    error,
    
    loadProducts,
    loadComponents,
    loadRecalls,
    loadRecallSchedules,
    loadProduct,
    loadComponent,
    loadRecall,
    loadGenealogyTree,
    loadSupplyChainVisualization,
    loadRecallSimulations,
    loadNotifications,
    loadProductComponents,
    loadAffectedProducts,
    loadProductByBatchLot,
    
    addProduct,
    addComponent,
    addGenealogyLink,
    addRecall,
    addRecallSimulation,
    addRecallSchedule,
    addNotification,
    sendAllNotifications,
    
    setSelectedProduct,
    setSelectedComponent,
    setSelectedRecall
  };
};
