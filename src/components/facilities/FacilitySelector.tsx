
import React, { useState, useEffect } from 'react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { fetchFacilities } from '@/services/facilityService';
import { Facility } from '@/types/facility';
import { Loader2 } from 'lucide-react';

interface FacilitySelectorProps {
  organizationId?: string;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFacilities = async () => {
      if (!organizationId) {
        setFacilities([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchFacilities(organizationId);
        console.log('Loaded facilities:', data);
        setFacilities(data);
        
        // If there's only one facility and no value is selected, select it automatically
        if (data.length === 1 && !value) {
          onChange(data[0].id);
        }
      } catch (err) {
        console.error('Error loading facilities:', err);
        setError('Failed to load facilities');
      } finally {
        setLoading(false);
      }
    };

    loadFacilities();
  }, [organizationId, value, onChange]);

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled || loading}
    >
      <SelectTrigger className={className || "w-full"}>
        <SelectValue placeholder="Select facility">
          {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {error ? (
          <SelectItem value="error" disabled>{error}</SelectItem>
        ) : loading ? (
          <SelectItem value="loading" disabled>Loading...</SelectItem>
        ) : facilities.length === 0 ? (
          <SelectItem value="none" disabled>No facilities available</SelectItem>
        ) : (
          <SelectGroup>
            <SelectLabel>Facilities</SelectLabel>
            {facilities.map((facility) => (
              <SelectItem key={facility.id} value={facility.id}>
                {facility.name}
              </SelectItem>
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
};

export default FacilitySelector;
