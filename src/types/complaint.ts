
import { UserRole } from "./user";

export type ComplaintStatus = "new" | "in_progress" | "resolved" | "closed";

export interface Complaint {
  id: string;
  reference: string;
  bookingReference: string;
  fleetId: number;
  fleetName: string;
  message: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  attachments: Attachment[];
  replies: ComplaintReply[];
}

export interface ComplaintReply {
  id: string;
  complaintId: string;
  senderId: number;
  senderName: string;
  senderRole: UserRole;
  message: string;
  timestamp: string;
  attachments: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt: string;
}
