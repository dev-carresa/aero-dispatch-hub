
import React, { createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContextType } from '@/types/auth';
import { useAuthProvider } from '@/hooks/useAuthProvider';

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signIn: async () => {}, // Updated to return Promise to match the interface
  signOut: async () => {},
  isAuthenticated: false,
  session: null,
  isLoggingOut: false,
  authError: null
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

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};
