
import { DriverComment } from "../types/driverComment";

export const sampleDriverComments: DriverComment[] = [
  {
    id: "DC-001",
    driverId: 1,
    driverName: "Michael Rodriguez",
    bookingReference: "B10005",
    comment: "Customer requested multiple stops that weren't in the original booking. I accommodated but it added 20 minutes to the trip.",
    createdAt: "2025-04-26T14:30:00Z",
    status: "unread"
  },
  {
    id: "DC-002",
    driverId: 2,
    driverName: "Sarah Thompson",
    bookingReference: "B10018",
    comment: "The pickup location had no parking space. Had to circle around for 10 minutes until customer came out.",
    createdAt: "2025-04-25T09:45:00Z",
    status: "read"
  },
  {
    id: "DC-003",
    driverId: 5,
    driverName: "James Wilson",
    bookingReference: "B10022",
    comment: "Construction on main route forced me to take detour. GPS wasn't updated with the road closure.",
    createdAt: "2025-04-24T16:20:00Z",
    status: "read"
  },
  {
    id: "DC-004",
    driverId: 3,
    driverName: "David Brown",
    comment: "App crashed twice during my shift today. Had to restart phone each time.",
    createdAt: "2025-04-23T11:05:00Z",
    status: "unread"
  },
  {
    id: "DC-005",
    driverId: 1,
    driverName: "Michael Rodriguez",
    bookingReference: "B10042",
    comment: "Customer was extremely satisfied with the service and mentioned they'll request me specifically for future bookings.",
    createdAt: "2025-04-22T18:15:00Z",
    status: "read"
  }
];
