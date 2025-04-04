
export interface Facility {
  id: string;
  name: string;
  description?: string | null;
  address?: string | null;
  organization_id: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  contact_email?: string | null;
  contact_phone?: string | null;
  location_data?: Record<string, any> | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  zipcode?: string | null;
  facility_type?: string | null;
}
