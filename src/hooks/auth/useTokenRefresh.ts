import { supabase } from "@/integrations/supabase/client";
import { Session } from '@supabase/supabase-js';

// Add the missing updateSessionExpiry function here
const updateSessionExpiry = (expiresIn: number): void => {
  const sessionStr = localStorage.getItem('supabase.auth.session');
  if (!sessionStr) return;
  
  const session = JSON.parse(sessionStr);
  const updatedSession = {
    ...session,
    expires_at: Math.floor(Date.now() / 1000) + expiresIn
  };
  
  localStorage.setItem('supabase.auth.session', JSON.stringify(updatedSession));
};

export const useTokenRefresh = (setSession) => {
  const refreshToken = async (): Promise<void> => {
    try {
      console.log("Refreshing token...");
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        console.error("Token refresh failed:", error);
        throw error;
      }

      if (data?.session) {
        console.log("Token refreshed successfully.");
        
        // Update session expiry in localStorage
        updateSessionExpiry(data.session.expires_in);
        
        // Update the session state
        setSession(data.session);
      }
    } catch (error) {
      console.error("Error during token refresh:", error);
    }
  };

  return { refreshToken };
};
