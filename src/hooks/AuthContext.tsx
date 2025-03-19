import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types for our auth state
interface User {
  // Add appropriate user properties based on your application
  id?: string;
  name?: string;
  email?: string;
  // Add other user properties as needed
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthContextType {
  authState: AuthState;
  login: (user: User) => void;
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
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setAuthState({ isAuthenticated: true, user: JSON.parse(storedUser) });
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('user'); // Remove invalid data
      }
    }
  }, []);

  // Login function
  const login = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    setAuthState({ isAuthenticated: true, user });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setAuthState({ isAuthenticated: false, user: null });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
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
