
import { Complaint } from "../types/complaint";

export const sampleComplaints: Complaint[] = [
  {
    id: "C-001",
    reference: "COMP-001",
    bookingReference: "B10001",
    fleetId: 1,
    fleetName: "Premium Fleet Services",
    message: "Driver was 30 minutes late for pickup. Customer had to wait in the rain.",
    status: "new",
    createdAt: "2025-04-25T09:30:00Z",
    updatedAt: "2025-04-25T09:30:00Z",
    attachments: [
      {
        id: "A-001",
        name: "ticket_receipt.pdf",
        size: 235000,
        type: "application/pdf",
        url: "/placeholders/document.pdf",
        createdAt: "2025-04-25T09:30:00Z"
      }
    ],
    replies: []
  },
  {
    id: "C-002",
    reference: "COMP-002",
    bookingReference: "B10015",
    fleetId: 2,
    fleetName: "City Cab Co.",
    message: "Vehicle was not clean. Found trash from previous passengers.",
    status: "in_progress",
    createdAt: "2025-04-23T14:15:00Z",
    updatedAt: "2025-04-24T10:20:00Z",
    attachments: [
      {
        id: "A-002",
        name: "car_interior.jpg",
        size: 1250000,
        type: "image/jpeg",
        url: "/placeholders/car_interior.jpg",
        createdAt: "2025-04-23T14:15:00Z"
      }
    ],
    replies: [
      {
        id: "R-001",
        complaintId: "C-002",
        senderId: 2,
        senderName: "Fleet Manager",
        senderRole: "Fleet",
        message: "We apologize for the inconvenience. We have spoken with the driver and will ensure all vehicles are properly cleaned between rides.",
        timestamp: "2025-04-24T10:20:00Z",
        attachments: []
      }
    ]
  },
  {
    id: "C-003",
    reference: "COMP-003",
    bookingReference: "B10022",
    fleetId: 1,
    fleetName: "Premium Fleet Services",
    message: "Driver took a longer route than necessary, increasing the fare.",
    status: "resolved",
    createdAt: "2025-04-20T18:45:00Z",
    updatedAt: "2025-04-22T11:30:00Z",
    attachments: [
      {
        id: "A-003",
        name: "route_map.png",
        size: 950000,
        type: "image/png",
        url: "/placeholders/map.png",
        createdAt: "2025-04-20T18:45:00Z"
      }
    ],
    replies: [
      {
        id: "R-002",
        complaintId: "C-003",
        senderId: 1,
        senderName: "Fleet Support",
        senderRole: "Fleet",
        message: "We've reviewed the route and agree it wasn't optimal. We've issued a partial refund.",
        timestamp: "2025-04-21T09:15:00Z",
        attachments: []
      },
      {
        id: "R-003",
        complaintId: "C-003",
        senderId: 4,
        senderName: "System Admin",
        senderRole: "Admin",
        message: "Case resolved with partial refund. Customer has been notified.",
        timestamp: "2025-04-22T11:30:00Z",
        attachments: [
          {
            id: "A-004",
            name: "refund_receipt.pdf",
            size: 180000,
            type: "application/pdf",
            url: "/placeholders/document.pdf",
            createdAt: "2025-04-22T11:30:00Z"
          }
        ]
      }
    ]
  },
  {
    id: "C-004",
    reference: "COMP-004",
    bookingReference: "B10030",
    fleetId: 3,
    fleetName: "Express Transport",
    message: "Driver was rude to the passenger and refused to help with luggage.",
    status: "closed",
    createdAt: "2025-04-18T08:20:00Z",
    updatedAt: "2025-04-20T15:45:00Z",
    attachments: [],
    replies: [
      {
        id: "R-004",
        complaintId: "C-004",
        senderId: 3,
        senderName: "Fleet Manager",
        senderRole: "Fleet",
        message: "We take this matter seriously and have spoken with the driver. We apologize for the unpleasant experience.",
        timestamp: "2025-04-19T10:30:00Z",
        attachments: []
      },
      {
        id: "R-005",
        complaintId: "C-004",
        senderId: 4,
        senderName: "System Admin",
        senderRole: "Admin",
        message: "We've offered the customer a discount on their next booking as compensation.",
        timestamp: "2025-04-20T15:45:00Z",
        attachments: []
      }
    ]
  },
  {
    id: "C-005",
    reference: "COMP-005",
    bookingReference: "B10035",
    fleetId: 2,
    fleetName: "City Cab Co.",
    message: "Wrong vehicle showed up for the booking. We requested a van but got a sedan.",
    status: "new",
    createdAt: "2025-04-27T11:10:00Z",
    updatedAt: "2025-04-27T11:10:00Z",
    attachments: [],
    replies: []
  }
];
