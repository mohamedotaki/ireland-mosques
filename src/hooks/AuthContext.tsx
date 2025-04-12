import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getFromLocalDB, LocalStorageKeys, removeFromLocalDB, saveToLocalDB } from '../utils/localDB';
import { apiGet, apiPost } from '../utils/api';
import { SigninType, SignupType, UserType } from '../types/authTyps';

// Define types for our auth state

interface AuthContextType {
  user: UserType | null;
  signout: () => void;
  signin: (user: SigninType) => void;
  signup: (user: SignupType) => void;
  verify: (code: string) => void;
  updateUser: (user: UserType) => void;


}

// Create the context with proper typing
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component with proper typing
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(getFromLocalDB(LocalStorageKeys.user || null));

  // Use effect to check for saved login status in localStorage
  useEffect(() => {

  }, []);



  // Logout function
  const signout = async () => {
    const { data, error } = await apiGet('auth/signout');
    if (data) {
      removeFromLocalDB(LocalStorageKeys.user);
      setUser(null);
    }

  };

  const signin = async (user: SigninType) => {
    const UUID = getFromLocalDB(LocalStorageKeys.UUID)
    const { data, error } = await apiPost<{ user: SigninType, UUID: string }, { user: UserType }>('auth/signin', { user, UUID })
    if (data) {
      saveToLocalDB(LocalStorageKeys.user, data.user);
      setUser(data.user);
    } else {
      return error
    }
  }

  const updateUser = async (user: UserType) => {
    saveToLocalDB(LocalStorageKeys.user, user);
    setUser(user);
  }
  const signup = async (user: SignupType) => {
    const { data, error } = await apiPost<{ user: SignupType }, { user: UserType }>('auth/signup', { user })
    if (data) {
      saveToLocalDB(LocalStorageKeys.user, data.user);
      setUser(data.user);
    } else {
      return error
    }
  }


  const verify = async (code: string) => {
    const UUID = getFromLocalDB(LocalStorageKeys.UUID)
    const { data, error } = await apiPost<{ user: UserType | null, code: string, UUID: string }, { user: UserType | null }>('auth/verify', { user, code, UUID })
    if (data) {
      saveToLocalDB(LocalStorageKeys.user, data.user);
      setUser(data.user);
      return undefined
    } else {
      if (error === "Too many attempts") {
        removeFromLocalDB(LocalStorageKeys.user);
        setUser(null);
      }
      return error as string
    }
  }


  /*   const signup =async (user:)=>{
       const { data, error } = await apiPost('auth/signup', { user })
       if (data) {
         setVerification(true)
       } else {
         setError(error || "")
       }
    } */


  return (
    <AuthContext.Provider value={{ user, signout, signin, signup, verify, updateUser }}>
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
