
import React, { createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContextType } from '@/types/auth';
import { useAuthProvider } from '@/hooks/useAuthProvider';
import { checkPermission } from '@/lib/permissions';

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signIn: async () => {},
  signOut: async () => {},
  isAuthenticated: false,
  session: null,
  isLoggingOut: false,
  authError: null,
  hasPermission: () => false
});

// Export the useAuth hook for components to use
export const useAuth = () => {
  return React.useContext(AuthContext);
};

// Export the AuthProvider component to wrap the app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get the navigate function from React Router
  const navigate = useNavigate();
  
  // Use the custom hook to get all auth-related state and functions
  const authState = useAuthProvider(navigate);

  // Add the hasPermission function to the auth state
  const enhancedAuthState = {
    ...authState,
    hasPermission: (permission: string) => {
      if (!authState.user) return false;
      return checkPermission(authState.user.role, permission);
    }
  };

  return (
    <AuthContext.Provider value={enhancedAuthState}>
      {children}
    </AuthContext.Provider>
  );
};
