export type UserRole = 'Admin' | 'Manager' | 'Driver' | 'Fleet' | 'Support' | 'Accounting' | 'Client';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  last_sign_in_at?: string;
  phone?: string;
  address?: string;
  status?: 'active' | 'inactive' | 'pending';
  metadata?: Record<string, any>;
}
