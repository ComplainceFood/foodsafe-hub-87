
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Facility } from '@/types/facility';
import FacilityForm from './FacilityForm';

interface FacilityAddDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (facility: Facility) => void;
  initialData?: Partial<Facility>;
}

const FacilityAddDialog: React.FC<FacilityAddDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData = {},
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isNewFacility = !initialData.id;

  const handleSubmit = async (data: Partial<Facility>) => {
    setIsLoading(true);
    try {
      if (!data.name) {
        throw new Error("Facility name is required");
      }
      
      // Create facility object locally (no DB table for facilities yet)
      const result: Facility = {
        id: initialData.id || crypto.randomUUID(),
        name: data.name,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Facility;

      toast({
        title: isNewFacility ? "Facility Created" : "Facility Updated",
        description: `The facility has been successfully ${isNewFacility ? 'created' : 'updated'}.`,
      });
      
      onSuccess(result);
      onClose();
    } catch (error: any) {
      console.error('Error saving facility:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save facility.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isNewFacility ? 'Add New Facility' : 'Edit Facility'}</DialogTitle>
          <DialogDescription>
            {isNewFacility ? 'Create a new facility to manage in the system.' : 'Update the facility details and information.'}
          </DialogDescription>
        </DialogHeader>
        <FacilityForm onSubmit={handleSubmit} initialData={initialData} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  );
};

export default FacilityAddDialog;
