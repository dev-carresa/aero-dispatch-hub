
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole, UserStatus, DriverAvailability } from "@/types/user";
import { toast } from "sonner";

// Fetch users from Supabase
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      throw error;
    }

    // Map Supabase data to User type, ensuring correct ID handling
    if (data) {
      const mappedUsers: User[] = data.map(profile => ({
        id: profile.id, // Store the ID as a string
        name: profile.name || (profile.first_name && profile.last_name ? `${profile.first_name} ${profile.last_name}` : 'No Name'),
        firstName: profile.first_name,
        lastName: profile.last_name,
        email: profile.email,
        role: profile.role as UserRole,
        status: profile.status as UserStatus,
        lastActive: profile.last_active || 'Never',
        imageUrl: profile.image_url || '',
        phone: profile.phone,
        nationality: profile.nationality,
        dateOfBirth: profile.date_of_birth,
        fleetId: profile.fleet_id ? Number(profile.fleet_id) : undefined,
        countryCode: profile.country_code,
        vehicleType: profile.vehicle_type,
        driverAvailability: profile.driver_availability as DriverAvailability || 'offline'
      }));
      return mappedUsers;
    }
    return [];
  } catch (error) {
    console.error('Error fetching users:', error);
    toast.error('Failed to fetch users');
    throw error;
  }
};

// Update driver availability - fixed to ensure ID is properly handled
export const updateDriverAvailability = async (
  userId: string | number, 
  newStatus: string
): Promise<void> => {
  try {
    // Convert userId to string if it's a number
    const id = typeof userId === 'number' ? userId.toString() : userId;
    
    const { error } = await supabase
      .from('profiles')
      .update({ driver_availability: newStatus })
      .eq('id', id);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error updating driver status:', error);
    throw error;
  }
};

// Toggle user active/inactive status - fixed to ensure ID is properly handled
export const toggleUserActiveStatus = async (
  userId: string | number, 
  currentStatus: UserStatus
): Promise<void> => {
  const newUserStatus = currentStatus === "active" ? "inactive" : "active";
  
  try {
    // Convert userId to string if it's a number
    const id = typeof userId === 'number' ? userId.toString() : userId;
    
    const { error } = await supabase
      .from('profiles')
      .update({ status: newUserStatus })
      .eq('id', id);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};
