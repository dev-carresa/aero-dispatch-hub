
import { MeetingPoint } from "@/types/airport";

export const sampleMeetingPoints: MeetingPoint[] = [
  {
    id: 1,
    airportId: 1,
    terminal: "Terminal 2",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    pickupInstructions: "Meet at Arrivals level, near the Costa Coffee shop.",
    fleetId: 1,
    fleetName: "Executive Fleet",
    latitude: 51.4700,
    longitude: -0.4543,
    createdAt: "2023-03-10T09:00:00Z",
    updatedAt: "2023-03-10T09:00:00Z"
  },
  {
    id: 2,
    airportId: 1,
    terminal: "Terminal 5",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    pickupInstructions: "Driver will meet at the Starbucks in arrivals area with a name sign.",
    fleetId: 2,
    fleetName: "Standard Fleet",
    latitude: 51.4724,
    longitude: -0.4889,
    createdAt: "2023-03-12T10:15:00Z",
    updatedAt: "2023-03-12T10:15:00Z"
  },
  {
    id: 3,
    airportId: 2,
    terminal: "Terminal 4",
    imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    pickupInstructions: "Meet outside at the designated pickup area, driver will have digital sign.",
    fleetId: 1,
    fleetName: "Executive Fleet",
    latitude: 40.6413,
    longitude: -73.7781,
    createdAt: "2023-03-15T14:30:00Z",
    updatedAt: "2023-03-15T14:30:00Z"
  },
  {
    id: 4,
    airportId: 3,
    terminal: "Terminal 2E",
    imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    pickupInstructions: "Driver will wait at exit gate with company logo sign.",
    fleetId: 3,
    fleetName: "Premium Fleet",
    latitude: 49.0097,
    longitude: 2.5479,
    createdAt: "2023-03-20T11:45:00Z",
    updatedAt: "2023-03-20T11:45:00Z"
  },
  {
    id: 5,
    airportId: 4,
    terminal: "Terminal 3",
    imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    pickupInstructions: "Meet at the designated meeting point near exit 3, driver will contact you on arrival.",
    fleetId: 2,
    fleetName: "Standard Fleet",
    latitude: 25.2532,
    longitude: 55.3657,
    createdAt: "2023-03-25T08:20:00Z",
    updatedAt: "2023-03-25T08:20:00Z"
  }
];

// Helper function to get meeting points for a specific airport
export const getMeetingPointsByAirport = (airportId: number): MeetingPoint[] => {
  return sampleMeetingPoints.filter(mp => mp.airportId === airportId);
};

// Helper function to get a meeting point by ID
export const getMeetingPointById = (id: number): MeetingPoint | undefined => {
  return sampleMeetingPoints.find(mp => mp.id === id);
};
