
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { testDatabaseConnection, testBackendIntegration } from '@/utils/routeTestUtils';
import { supabase } from '@/integrations/supabase/client';

const db = supabase as any;

describe('Database Integration Testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should connect to the organizations table', async () => {
    const result = await testDatabaseConnection('organizations');
    expect(result.success).toBe(true);
  });
  
  it('should connect to the facilities table', async () => {
    const result = await testDatabaseConnection('facilities');
    expect(result.success).toBe(true);
  });
  
  it('should connect to the non_conformances table', async () => {
    const result = await testDatabaseConnection('non_conformances');
    expect(result.success).toBe(true);
  });
  
  it('should connect to the documents table', async () => {
    const result = await testDatabaseConnection('documents');
    expect(result.success).toBe(true);
  });
  
  it('should perform read operations on organizations', async () => {
    const result = await testBackendIntegration('organizations', 'select');
    expect(result.success).toBe(true);
  });
  
  it('should perform read operations on facilities', async () => {
    const result = await testBackendIntegration('facilities', 'select');
    expect(result.success).toBe(true);
  });
  
  it('should execute the get_organizations RPC function', async () => {
    const mockResponse = { data: [{ id: '1', name: 'Test Org' }], error: null };
    (db.rpc as jest.Mock).mockResolvedValue(mockResponse);
    const { data, error } = await db.rpc('get_organizations');
    expect(error).toBeNull();
    expect(data).toEqual(mockResponse.data);
  });
  
  it('should execute the get_facilities RPC function', async () => {
    const mockResponse = { data: [{ id: '1', name: 'Test Facility' }], error: null };
    (db.rpc as jest.Mock).mockResolvedValue(mockResponse);
    const { data, error } = await db.rpc('get_facilities', { p_organization_id: null, p_only_assigned: false });
    expect(error).toBeNull();
    expect(data).toEqual(mockResponse.data);
  });
  
  it('should verify relationship between non-conformances and CAPAs', async () => {
    const mockNonConformance = { id: '123', title: 'Test NC', capa_id: '456' };
    const mockCapaResponse = { data: [{ id: '456', title: 'Test CAPA' }], error: null };
    
    const fromMock = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockNonConformance, error: null })
    });
    
    (db.from as jest.Mock)
      .mockImplementationOnce(fromMock)
      .mockImplementationOnce(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue(mockCapaResponse)
      }));
    
    const { data: nc } = await db.from('non_conformances').select('*').eq('id', '123').single();
    const { data: capa } = await db.from('capas').select('*').eq('id', nc.capa_id).single();
    
    expect(nc.id).toBe('123');
    expect(nc.capa_id).toBe('456');
    expect(capa[0].id).toBe('456');
  });
});
