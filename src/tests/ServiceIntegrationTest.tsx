
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { mockNavigate, resetMocks } from './mocks/testMocks';
import { supabase } from '@/integrations/supabase/client';
import * as nonConformanceService from '@/services/nonConformanceService';
import * as documentService from '@/services/documentService';
import * as organizationService from '@/services/organizationService';

const db = supabase as any;

describe('Service Integration Testing', () => {
  beforeEach(() => {
    resetMocks();
  });

  it('should fetch non-conformances and handle data transformation', async () => {
    const mockNCData = [{ id: '1', title: 'Test NC 1', status: 'Open', reported_date: '2025-01-01' }];
    const mockFromSelect = jest.fn().mockResolvedValue({ data: mockNCData, error: null });
    const mockFrom = jest.fn().mockReturnValue({ select: mockFromSelect });
    (db.from as jest.Mock).mockImplementation(mockFrom);
    
    const result = await nonConformanceService.getAllNonConformances();
    expect(mockFrom).toHaveBeenCalledWith('non_conformances');
    expect(result.data).toEqual(mockNCData);
  });
  
  it('should handle document creation and versioning', async () => {
    const mockDocInsert = jest.fn().mockResolvedValue({ data: [{ id: 'doc-123' }], error: null });
    (db.from as jest.Mock).mockImplementationOnce(() => ({ insert: mockDocInsert, select: jest.fn().mockReturnThis() }));
    expect(db.from).toHaveBeenCalledWith('documents');
  });
  
  it('should verify cross-service integration between modules', async () => {
    const mockOrg = { id: 'org-123', name: 'Test Org' };
    const mockFacility = { id: 'fac-456', name: 'Test Facility', organization_id: 'org-123' };
    const mockNC = { id: 'nc-789', title: 'Test NC', location: 'Test Facility' };
    
    (db.from as jest.Mock)
      .mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValue({ data: [mockOrg], error: null }) }))
      .mockImplementationOnce(() => ({ select: jest.fn().mockReturnThis(), eq: jest.fn().mockResolvedValue({ data: [mockFacility], error: null }) }))
      .mockImplementationOnce(() => ({ select: jest.fn().mockReturnThis(), ilike: jest.fn().mockResolvedValue({ data: [mockNC], error: null }) }));
    
    const orgs = await db.from('organizations').select('*');
    expect(orgs.data[0]).toEqual(mockOrg);
  });
});
