import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { hasStoredSession } from '@/services/sessionStorageService';

// Add the missing isSessionValid function
const isSessionValid = (): boolean => {
  const sessionStr = localStorage.getItem('supabase.auth.session');
  if (!sessionStr) return false;
  
  const session = JSON.parse(sessionStr);
  if (!session.expires_at) return false;
  
  return session.expires_at * 1000 > Date.now();
};

export const useSessionCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = () => {
      if (!hasStoredSession() || !isSessionValid()) {
        toast.error("Session expirée. Veuillez vous reconnecter.");
        navigate('/');
      }
    };

    checkSession();
  }, [navigate]);
};
