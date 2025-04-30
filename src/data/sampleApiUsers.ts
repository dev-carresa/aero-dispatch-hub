
import { ApiUser } from "@/types/apiUser";

export const sampleApiUsers: ApiUser[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    company: "Example Corp",
    phone: "+1234567890",
    country: "United States",
    serviceType: "api_access",
    apiKey: "uk_aPi7Ke3yExAmP1e9876",
    secretKey: "sk_S3cR3tK3yExAmP1e54321",
    status: "active",
    notes: "Primary API user for Example Corp integration",
    createdAt: "2023-08-15T10:30:00Z",
    lastUsed: "2023-10-28T15:45:22Z"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@techfirm.com",
    company: "Tech Firm Inc",
    phone: "+9876543210",
    country: "Canada",
    serviceType: "white_label",
    apiKey: "uk_aPi7Ke3yExAmP1e1234",
    secretKey: "sk_S3cR3tK3yExAmP1e98765",
    status: "active",
    notes: "White-label service integration",
    createdAt: "2023-09-20T14:20:00Z",
    lastUsed: "2023-10-29T09:12:35Z"
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert@globalsolutions.net",
    company: "Global Solutions",
    phone: "+4455667788",
    country: "United Kingdom",
    serviceType: "both",
    apiKey: "uk_aPi7Ke3yExAmP1e5678",
    secretKey: "sk_S3cR3tK3yExAmP1e12345",
    status: "inactive",
    notes: "Access temporarily suspended",
    createdAt: "2023-07-05T08:45:00Z",
    lastUsed: "2023-10-15T11:30:18Z"
  },
  {
    id: 4,
    name: "Maria Garcia",
    email: "maria@innovatetech.co",
    company: "InnovateTech",
    phone: "+3399887766",
    country: "Spain",
    serviceType: "api_access",
    apiKey: "uk_aPi7Ke3yExAmP1e2468",
    secretKey: "sk_S3cR3tK3yExAmP1e13579",
    status: "active",
    notes: "",
    createdAt: "2023-10-01T16:15:00Z",
    lastUsed: "2023-10-30T08:22:47Z"
  },
  {
    id: 5,
    name: "David Kim",
    email: "david.kim@eastcorp.co.kr",
    company: "East Corp",
    phone: "+8210987654",
    country: "South Korea",
    serviceType: "white_label",
    apiKey: "uk_aPi7Ke3yExAmP1e3691",
    secretKey: "sk_S3cR3tK3yExAmP1e24680",
    status: "inactive",
    notes: "Awaiting contract renewal",
    createdAt: "2023-06-12T09:30:00Z",
    lastUsed: "2023-09-28T17:40:12Z"
  }
];
