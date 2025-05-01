
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from "@/types/user";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => void;
  isAuthenticated: boolean;
}

const mockUser: User = {
  id: "1",
  name: "Demo User",
  email: "user@example.com",
  role: "Admin"
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signOut: () => {},
  isAuthenticated: false
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(mockUser);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
