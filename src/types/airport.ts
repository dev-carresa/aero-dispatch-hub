
export interface Airport {
  id: number;
  name: string;
  code: string;
  city: string;
  country: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  meetingPoints?: MeetingPoint[];
}

export interface MeetingPoint {
  id: number;
  airportId: number;
  terminal: string;
  imageUrl: string;
  pickupInstructions: string;
  fleetId?: number;
  fleetName?: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}
