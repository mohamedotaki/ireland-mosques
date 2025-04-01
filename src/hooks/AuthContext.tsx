import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getFromLocalDB, LocalStorageKeys, removeFromLocalDB, saveToLocalDB } from '../utils/localDB';
import { UserType } from '../types/user';
import { apiGet, apiPost } from '../utils/api';
import { SigninType, SignupType } from '../types/authTyps';

// Define types for our auth state

interface AuthContextType {
  user: UserType | null;
  signout: () => void;
  signin: (user: SigninType) => void;
  signup: (user: SignupType) => void;
  verify: (code: string) => void;

}

// Create the context with proper typing
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component with proper typing
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);

  // Use effect to check for saved login status in localStorage
  useEffect(() => {
    const storedUser = getFromLocalDB(LocalStorageKeys.user);
    if (storedUser) {
      setUser(storedUser);
    }
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
    const { data, error } = await apiPost<SigninType, { user: UserType }>('auth/signin', user)
    if (data) {
      saveToLocalDB(LocalStorageKeys.user, user);
      setUser(data.user);
    } else {
      return error
    }
  }

  const signup = async (user: SignupType) => {
    const { data, error } = await apiPost<{ user: SignupType }, { user: UserType }>('auth/signup', { user })
    console.log(data, error)

    if (data) {
      saveToLocalDB(LocalStorageKeys.user, user);
      setUser(data.user);
    } else {
      return error
    }
  }


  const verify = async (code: string) => {
    const { data, error } = await apiPost<string, string>('auth/verify', "sad")
    /*  if (data) {
       saveToLocalDB(LocalStorageKeys.user, user);
       setUser(data.user);
     } else {
       return error
     } */
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
    <AuthContext.Provider value={{ user, signout, signin, signup, verify }}>
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
