
export type ApiUserStatus = "active" | "inactive";
export type ServiceType = "api_access" | "white_label" | "both";

export type ApiUser = {
  id: number;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  country: string;
  serviceType: ServiceType;
  apiKey: string;
  secretKey?: string; // Will be masked in UI
  status: ApiUserStatus;
  notes?: string;
  createdAt: string;
  lastUsed?: string;
};
