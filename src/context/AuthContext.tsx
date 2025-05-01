
import React, { createContext, useContext } from 'react';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signOut: () => {}
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthContext.Provider value={{ user: null, loading: false, signOut: () => {} }}>
      {children}
    </AuthContext.Provider>
  );
};
