
import { 
  hasStoredSession as checkStoredSession 
} from '@/services/sessionStorageService';
import { supabase } from '@/integrations/supabase/client';

/**
 * Helper function to check if local storage has auth token
 */
export const hasStoredSession = (): boolean => {
  return checkStoredSession();
};

/**
 * Helper function to reset the session
 */
export const resetSession = async (): Promise<void> => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error("Error refreshing session:", error);
      throw error;
    }
    
    console.log("Session reset successfully:", data);
    return;
  } catch (error) {
    console.error("Error in resetSession:", error);
    throw error;
  }
};
