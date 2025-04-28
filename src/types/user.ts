
export type User = {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Driver" | "Fleet" | "Dispatcher";
  status: "active" | "inactive";
  lastActive: string;
  imageUrl: string;
};
