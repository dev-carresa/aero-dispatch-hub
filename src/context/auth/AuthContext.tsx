
import { createContext, useContext } from 'react';
import { AuthContextType } from "./types";

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signIn: async () => {},
  signOut: async () => {},
  isAuthenticated: false,
  session: null,
  authError: null
});

// Hook for using auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Export provider from its own file
export { AuthProvider } from './AuthProvider';
