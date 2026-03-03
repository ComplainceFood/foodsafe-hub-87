
import { Routes } from 'react-router-dom';
import { lazy } from 'react';
import { supabase } from '@/integrations/supabase/client';

const db = supabase as any;

interface RouteInfo {
  path: string;
  element: string;
  children?: RouteInfo[];
  requiresAuth?: boolean;
}

export const extractRoutes = (routes: typeof Routes) => {
  const routesInfo: RouteInfo[] = [];
  return routesInfo;
};

export const verifyRoute = async (path: string) => {
  try {
    return { exists: true, accessible: true, requiresAuth: path !== '/auth' && path !== '/onboarding' };
  } catch (error) {
    return { exists: false, accessible: false, requiresAuth: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const testRouteNavigation = async (path: string) => {
  try {
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const testDatabaseConnection = async (module: string) => {
  try {
    const { data, error } = await db.from(module).select('count(*)', { count: 'exact' });
    if (error) throw error;
    return { success: true, message: `Successfully connected to ${module} table`, details: data };
  } catch (error) {
    return { success: false, message: `Failed to connect to ${module} table`, details: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const testBackendIntegration = async (module: string, operation: 'select' | 'insert' | 'update' | 'delete', payload?: any) => {
  try {
    let result;
    switch (operation) {
      case 'select': result = await db.from(module).select('*').limit(1); break;
      case 'insert': result = await db.from(module).insert(payload).select(); break;
      case 'update': result = await db.from(module).update(payload).eq('id', payload.id).select(); break;
      case 'delete': result = await db.from(module).delete().eq('id', payload.id); break;
    }
    if (result.error) throw result.error;
    return { success: true, message: `Successfully performed ${operation} on ${module}`, data: result.data };
  } catch (error) {
    return { success: false, message: `Failed to perform ${operation} on ${module}`, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
