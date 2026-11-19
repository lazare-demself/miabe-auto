export type EstablishmentType = 'garage' | 'parts_store';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type Establishment = {
  id: string; owner_id: string | null; type: EstablishmentType; name: string; manager_name: string | null;
  phone: string; whatsapp: string | null; email: string | null; address: string; neighborhood: string;
  city: string; description: string | null; vehicle_types: string[]; specialties: string[];
  latitude: number | null; longitude: number | null; status: ApprovalStatus; created_at: string;
};
export type PartProduct = {
  id: string; establishment_id: string; name: string; category: string; vehicle_compatibility: string | null;
  description: string | null; price_xof: number | null; in_stock: boolean; updated_at: string;
};
