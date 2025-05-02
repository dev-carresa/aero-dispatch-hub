
import React, { createContext } from 'react';
import { AuthContextType } from '@/types/auth';
import { useAuthProvider } from '@/hooks/useAuthProvider';

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signIn: async () => null,
  signOut: async () => {}, 
  isAuthenticated: false,
  session: null,
  isLoggingOut: false,
  authError: null,
  isAuthActionInProgress: false,
  resetSession: async () => false // Modifié pour retourner un boolean
});

// Export the useAuth hook for components to use
export const useAuth = () => {
  return React.useContext(AuthContext);
};

// Export the AuthProvider component to wrap the app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the custom hook to get all auth-related state and functions
  const authState = useAuthProvider();

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};
