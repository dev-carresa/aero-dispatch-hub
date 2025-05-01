
import { toast } from "sonner";
import { SimpleUser } from "../types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch users from the database
 */
export async function fetchUsers(): Promise<SimpleUser[]> {
  try {
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, name, email, role');
      
    if (profilesError) {
      throw profilesError;
    }
    
    const usersData = profilesData.map((profile: any) => {
      const initials = profile.name
        ? profile.name
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : 'XX';
        
      // Generate a consistent color based on the user id
      const colors = ['blue', 'green', 'purple', 'red', 'amber', 'pink', 'indigo', 'cyan'];
      const colorIndex = profile.id 
        ? Math.abs(profile.id.charCodeAt(0) % colors.length)
        : 0;
      
      return {
        id: profile.id,
        name: profile.name || 'Unknown User',
        email: profile.email || 'No email',
        initials,
        color: colors[colorIndex],
        role: profile.role ? profile.role.toLowerCase() : 'customer'
      };
    });
    
    return usersData;
  } catch (error) {
    console.error("Error fetching users:", error);
    toast.error("Failed to load users");
    
    // Fallback to mock users if database access fails
    return getMockUsers();
  }
}

/**
 * Get mock users for fallback
 */
export function getMockUsers(): SimpleUser[] {
  return [
    {
      id: "1",
      name: "Admin User",
      email: "admin@transport-co.com",
      initials: "AD",
      color: "blue",
      role: "admin"
    },
    {
      id: "2",
      name: "Jane Doe",
      email: "jane@transport-co.com",
      initials: "JD",
      color: "green",
      role: "driver"
    },
    {
      id: "3",
      name: "Mike Smith",
      email: "mike@transport-co.com",
      initials: "MS",
      color: "purple",
      role: "fleet"
    }
  ];
}
