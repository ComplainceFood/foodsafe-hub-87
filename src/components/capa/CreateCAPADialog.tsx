
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CreateCAPADialogProps } from '@/types/capa';
import { CAPAPriority, CAPASource } from '@/types/enums';

const CreateCAPADialog: React.FC<CreateCAPADialogProps> = ({ open, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<CAPAPriority>(CAPAPriority.Medium);
  const [source, setSource] = useState<CAPASource>(CAPASource.InternalReport);
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const capaData = {
      title,
      description,
      priority,
      source,
      due_date: dueDate,
      assigned_to: assignedTo
    };
    
    onSubmit(capaData);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority(CAPAPriority.Medium);
    setSource(CAPASource.InternalReport);
    setDueDate('');
    setAssignedTo('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New CAPA</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter CAPA title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">Description</label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue that requires corrective/preventive action"
              rows={4}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="priority" className="block text-sm font-medium">Priority</label>
              <Select value={priority} onValueChange={(value) => setPriority(value as CAPAPriority)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CAPAPriority.Low}>Low</SelectItem>
                  <SelectItem value={CAPAPriority.Medium}>Medium</SelectItem>
                  <SelectItem value={CAPAPriority.High}>High</SelectItem>
                  <SelectItem value={CAPAPriority.Critical}>Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="source" className="block text-sm font-medium">Source</label>
              <Select value={source} onValueChange={(value) => setSource(value as CAPASource)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CAPASource.Audit}>Audit</SelectItem>
                  <SelectItem value={CAPASource.CustomerComplaint}>Customer Complaint</SelectItem>
                  <SelectItem value={CAPASource.NonConformance}>Non-Conformance</SelectItem>
                  <SelectItem value={CAPASource.InternalReport}>Internal Report</SelectItem>
                  <SelectItem value={CAPASource.SupplierIssue}>Supplier Issue</SelectItem>
                  <SelectItem value={CAPASource.RegulatoryInspection}>Regulatory Inspection</SelectItem>
                  <SelectItem value={CAPASource.Other}>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="dueDate" className="block text-sm font-medium">Due Date</label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="assignedTo" className="block text-sm font-medium">Assigned To</label>
              <Input
                id="assignedTo"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="Enter person responsible"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Create CAPA</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCAPADialog;
