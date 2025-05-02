
import { supabase } from "@/integrations/supabase/client";
import { updateSessionExpiry } from '@/services/sessionStorageService';

export const useTokenRefresh = () => {
  // Rafraîchir silencieusement le token
  const refreshToken = async (): Promise<boolean> => {
    try {
      console.log("Rafraîchissement silencieux du token...");
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("Erreur lors du rafraîchissement du token:", error);
        return false;
      }
      
      if (data?.session) {
        // Mettre à jour les dates d'expiration dans le stockage local
        const expiresIn = data.session.expires_in || 3600;
        updateSessionExpiry(expiresIn);
        
        console.log("Token rafraîchi avec succès");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Erreur inattendue lors du rafraîchissement du token:", error);
      return false;
    }
  };

  return { refreshToken };
};
