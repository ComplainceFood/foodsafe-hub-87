
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Loader2 } from 'lucide-react';
import { Facility } from '@/types/facility';
import { fetchFacilities } from '@/utils/supabaseHelpers';

interface FacilitySelectorProps {
  organizationId?: string | null;
  value?: string | null;
  onChange?: (facilityId: string) => void;
  disabled?: boolean;
  className?: string; // Added className prop
}

const FacilitySelector: React.FC<FacilitySelectorProps> = ({
  organizationId,
  value,
  onChange,
  disabled = false,
  className
}) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useUser();
  
  // Use the organization ID from props or fallback to the user's organization
  const activeOrgId = organizationId || user?.organization_id;

  useEffect(() => {
    if (activeOrgId) {
      loadFacilities(activeOrgId);
    }
  }, [activeOrgId, user]);

  const loadFacilities = async (orgId: string) => {
    try {
      setLoading(true);
      const facilitiesData = await fetchFacilities(orgId);
      setFacilities(facilitiesData);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load facilities',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFacilityChange = (facilityId: string) => {
    if (onChange) {
      onChange(facilityId);
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-10 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (facilities.length === 0) {
    return (
      <div className={`text-sm text-muted-foreground py-2 ${className}`}>
        No facilities available
      </div>
    );
  }

  return (
    <Select 
      value={value || undefined} 
      onValueChange={handleFacilityChange}
      disabled={disabled || facilities.length === 0}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select Facility" />
      </SelectTrigger>
      <SelectContent>
        {facilities.map((facility) => (
          <SelectItem key={facility.id} value={facility.id}>
            {facility.name}
            {facility.facility_type && <span className="text-muted-foreground ml-2">({facility.facility_type})</span>}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FacilitySelector;
