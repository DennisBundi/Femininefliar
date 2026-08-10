export interface Customer {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  addresses: { label: string; details: string }[];
  wishlistCount: number;
}
