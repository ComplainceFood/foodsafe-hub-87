
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const db = supabase as any;

export interface ApprovalWorkflow {
  id: string;
  supplier_id: string;
  status: string;
  current_step: number;
  initiated_at: string;
  completed_at?: string;
  initiated_by: string;
  approvers?: string[];
  approval_history?: Record<string, any>;
  notes?: string;
  due_date?: string;
  updated_at?: string;
}

export const fetchApprovalWorkflows = async (): Promise<ApprovalWorkflow[]> => {
  try {
    const { data, error } = await db
      .from('supplier_approval_workflows')
      .select('*, suppliers (name, category, country)')
      .order('initiated_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching approval workflows:', error);
    toast.error('Failed to load approval workflows');
    throw error;
  }
};

export const fetchApprovalWorkflowById = async (id: string): Promise<ApprovalWorkflow | null> => {
  try {
    const { data, error } = await db
      .from('supplier_approval_workflows')
      .select('*, suppliers (*)')
      .eq('id', id).single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching approval workflow with ID ${id}:`, error);
    toast.error('Failed to load approval workflow details');
    throw error;
  }
};

export const createApprovalWorkflow = async (
  supplierId: string, initiatedBy: string, approvers: string[], dueDate?: string
): Promise<ApprovalWorkflow> => {
  try {
    const { data: existing } = await db
      .from('supplier_approval_workflows')
      .select('id, status')
      .eq('supplier_id', supplierId)
      .in('status', ['in_progress', 'pending']);
    
    if (existing && existing.length > 0) {
      toast.error('There is already an active approval workflow for this supplier');
      throw new Error('Duplicate workflow');
    }
    
    const { data, error } = await db.from('supplier_approval_workflows').insert({
      supplier_id: supplierId, status: 'in_progress', current_step: 1,
      initiated_by: initiatedBy, initiated_at: new Date().toISOString(),
      approvers, approval_history: {
        steps: [
          { step: 1, name: 'Document Review', status: 'current', started_at: new Date().toISOString() },
          { step: 2, name: 'Compliance Verification', status: 'pending' },
          { step: 3, name: 'Quality Evaluation', status: 'pending' },
          { step: 4, name: 'Final Approval', status: 'pending' }
        ]
      },
      due_date: dueDate, updated_at: new Date().toISOString()
    }).select().single();
    
    if (error) throw error;
    
    await db.from('suppliers').update({ status: 'Pending', updated_at: new Date().toISOString() }).eq('id', supplierId);
    
    return data;
  } catch (error: any) {
    if (error.message !== 'Duplicate workflow') {
      console.error('Error creating approval workflow:', error);
      toast.error('Failed to create approval workflow');
    }
    throw error;
  }
};

export const advanceWorkflowStep = async (
  workflowId: string, approver: string, notes?: string
): Promise<ApprovalWorkflow> => {
  try {
    const { data: workflow, error: fetchError } = await db
      .from('supplier_approval_workflows').select('*').eq('id', workflowId).single();
    if (fetchError) throw fetchError;
    
    const currentStep = workflow.current_step;
    const approvalHistory = workflow.approval_history || { steps: [] };
    
    const updatedSteps = approvalHistory.steps.map((step: any) => {
      if (step.step === currentStep) {
        return { ...step, status: 'completed', completed_at: new Date().toISOString(), approved_by: approver, notes };
      } else if (step.step === currentStep + 1) {
        return { ...step, status: 'current', started_at: new Date().toISOString() };
      }
      return step;
    });
    
    const isLastStep = !approvalHistory.steps.some((step: any) => step.step === currentStep + 1);
    const newStatus = isLastStep ? 'approved' : 'in_progress';
    
    const { data, error } = await db.from('supplier_approval_workflows').update({
      current_step: isLastStep ? currentStep : currentStep + 1,
      status: newStatus,
      approval_history: { ...approvalHistory, steps: updatedSteps },
      updated_at: new Date().toISOString(),
      completed_at: isLastStep ? new Date().toISOString() : null
    }).eq('id', workflowId).select().single();
    
    if (error) throw error;
    
    if (isLastStep) {
      await db.from('suppliers').update({
        status: 'Active', compliance_status: 'Approved', updated_at: new Date().toISOString()
      }).eq('id', workflow.supplier_id);
    }
    
    return data;
  } catch (error) {
    console.error(`Error advancing workflow with ID ${workflowId}:`, error);
    toast.error('Failed to advance approval workflow');
    throw error;
  }
};

export const rejectWorkflow = async (
  workflowId: string, rejectedBy: string, reason: string
): Promise<ApprovalWorkflow> => {
  try {
    const { data: workflow, error: fetchError } = await db
      .from('supplier_approval_workflows').select('*').eq('id', workflowId).single();
    if (fetchError) throw fetchError;
    
    const currentStep = workflow.current_step;
    const approvalHistory = workflow.approval_history || { steps: [] };
    
    const updatedSteps = approvalHistory.steps.map((step: any) => {
      if (step.step === currentStep) {
        return { ...step, status: 'rejected', rejected_at: new Date().toISOString(), rejected_by: rejectedBy, rejection_reason: reason };
      }
      return step;
    });
    
    const { data, error } = await db.from('supplier_approval_workflows').update({
      status: 'rejected',
      approval_history: { ...approvalHistory, steps: updatedSteps },
      updated_at: new Date().toISOString(),
      notes: `Rejected in step ${currentStep}: ${reason}`
    }).eq('id', workflowId).select().single();
    
    if (error) throw error;
    
    await db.from('suppliers').update({
      status: 'Suspended', compliance_status: 'Rejected', updated_at: new Date().toISOString()
    }).eq('id', workflow.supplier_id);
    
    return data;
  } catch (error) {
    console.error(`Error rejecting workflow with ID ${workflowId}:`, error);
    toast.error('Failed to reject approval workflow');
    throw error;
  }
};

export const editWorkflowStep = async (
  workflowId: string, newStep: number, reason: string, updatedBy: string
): Promise<ApprovalWorkflow> => {
  try {
    const { data: workflow, error: fetchError } = await db
      .from('supplier_approval_workflows').select('*').eq('id', workflowId).single();
    if (fetchError) throw fetchError;
    
    const currentStep = workflow.current_step;
    if (newStep > currentStep) throw new Error('Cannot advance steps through the edit function');
    if (workflow.status === 'approved' || workflow.status === 'rejected') throw new Error('Cannot edit completed or rejected workflows');
    
    const approvalHistory = workflow.approval_history || { steps: [] };
    
    const updatedSteps = approvalHistory.steps.map((step: any) => {
      if (step.step === currentStep) return { ...step, status: 'pending', started_at: null };
      if (step.step === newStep) return { ...step, status: 'current', started_at: new Date().toISOString() };
      if (step.step > newStep && step.step < currentStep) return { ...step, status: 'pending', started_at: null, completed_at: null };
      return step;
    });
    
    const editHistory = approvalHistory.edits || [];
    editHistory.push({ timestamp: new Date().toISOString(), edited_by: updatedBy, previous_step: currentStep, new_step: newStep, reason });
    
    const { data, error } = await db.from('supplier_approval_workflows').update({
      current_step: newStep, status: 'in_progress',
      approval_history: { ...approvalHistory, steps: updatedSteps, edits: editHistory },
      updated_at: new Date().toISOString(),
      notes: `${workflow.notes || ''}\n\nWorkflow edited: moved from step ${currentStep} to step ${newStep}. Reason: ${reason}`
    }).eq('id', workflowId).select().single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error(`Error editing workflow step for workflow ID ${workflowId}:`, error);
    toast.error(error.message || 'Failed to edit approval workflow step');
    throw error;
  }
};

export default { fetchApprovalWorkflows, fetchApprovalWorkflowById, createApprovalWorkflow, advanceWorkflowStep, rejectWorkflow, editWorkflowStep };
