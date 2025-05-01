
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Function to ensure demo user exists
export const ensureDemoUserExists = async () => {
  const demoEmail = 'admin@example.com';
  const demoPassword = 'password';

  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', demoEmail)
      .maybeSingle();

    if (!existingUser) {
      // Create the user if it doesn't exist
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: demoEmail,
        password: demoPassword,
        email_confirm: true,
        user_metadata: {
          name: 'Admin User',
          role: 'Admin'
        }
      });

      if (authError) {
        console.error("Error creating demo user:", authError);
        return false;
      }

      console.log("Demo user created successfully");
      return true;
    }

    // If user exists, we need to update the password
    // Note: This usually requires admin privileges or a server function
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      { password: demoPassword }
    );

    if (updateError) {
      console.error("Error updating demo user password:", updateError);
      return false;
    }

    console.log("Demo user password updated successfully");
    return true;
  } catch (error) {
    console.error("Error in demo user setup:", error);
    return false;
  }
};

// Function to reset user password - can be called from admin UI
export const resetUserPassword = async (userId: string, newPassword: string) => {
  try {
    const { error } = await supabase.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    );
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error resetting password:', error);
    toast.error('Failed to reset password');
    return { success: false, error };
  }
};
