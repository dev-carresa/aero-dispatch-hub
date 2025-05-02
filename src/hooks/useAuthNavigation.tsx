
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * A hook to provide navigation functions for authentication flows
 * This hook must be used within a component wrapped by a Router
 */
export const useAuthNavigation = () => {
  const navigate = useNavigate();
  
  const navigateToLogin = useCallback(() => {
    navigate('/', { replace: true });
  }, [navigate]);
  
  const navigateToDashboard = useCallback(() => {
    navigate('/dashboard', { replace: true });
  }, [navigate]);
  
  return {
    navigateToLogin,
    navigateToDashboard,
  };
};
