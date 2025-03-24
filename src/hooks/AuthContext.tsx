import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getFromLocalDB, LocalStorageKeys, removeFromLocalDB, saveToLocalDB } from '../utils/localDB';
import { UserType } from '../types/user';
import { apiGet, apiPost } from '../utils/api';

// Define types for our auth state
interface User {
  id?: string;
  name?: string;
  email?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthContextType {
  isAuth: boolean;
  user: User | null;
  login: (user: UserType) => void;
  logout: () => void;
}

// Create the context with proper typing
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component with proper typing
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });

  // Use effect to check for saved login status in localStorage
  useEffect(() => {
    const storedUser = getFromLocalDB(LocalStorageKeys.user);
    if (storedUser) {
      setAuthState({ isAuthenticated: true, user: storedUser });
    }
  }, []);

  // Login function
  const login = (user: UserType) => {
    saveToLocalDB(LocalStorageKeys.user, user);
    setAuthState({ isAuthenticated: true, user });
  };

  // Logout function
  const logout = async () => {
    const { data, error } = await apiGet('auth/signout');
    console.log(data, error)
    if (data) {
      removeFromLocalDB(LocalStorageKeys.user);
      setAuthState({ isAuthenticated: false, user: null });
      return
    }

  };

  return (
    <AuthContext.Provider value={{ isAuth: authState.isAuthenticated, user: authState.user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context with proper error handling
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
