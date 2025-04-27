import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getFromLocalDB, LocalStorageKeys, removeFromLocalDB, saveToLocalDB } from '../utils/localDB';
import { apiGet, apiPost } from '../utils/api';
import { settingsType, SigninType, SignupType, UserType } from '../types/authTyps';
import i18n from '../services/i18n';
import { useTheme } from './ThemeContext';
import { usePopup } from './PopupContext';
import { getDeviceID } from '../utils/deviceID';

// Define types for our auth state

interface AuthContextType {
  user: UserType | null;
  signout: () => Promise<void>;
  signin: (user: SigninType) => Promise<string | undefined>;
  signup: (user: SignupType) => Promise<string | undefined>;
  verify: (code: string) => Promise<boolean>;
  resendVerificationCode: () => Promise<boolean>;
  updateUser: (user: UserType) => void;
  loading: boolean;


}

// Create the context with proper typing
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component with proper typing
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(getFromLocalDB(LocalStorageKeys.user || null));
  const { toggleTheme, changeFontSize } = useTheme();
  const [loading, setLoading] = useState(false);
  const { showPopup } = usePopup()




  const updateUser = async (user: UserType) => {
    saveToLocalDB(LocalStorageKeys.user, user);
    setUser(user);
  }


  // Logout function
  const signout = async () => {
    setLoading(true)
    const { data } = await apiGet('auth/signout');
    if (data) {
      removeFromLocalDB(LocalStorageKeys.user);
      setUser(null);
      setLoading(false)

    } else {
      setLoading(false)
    }

  };

  const signin = async (user: SigninType) => {
    setLoading(true)
    const UUID = getDeviceID()
    const { data, error } = await apiPost<{ user: SigninType, UUID: string }, { message: string, user: UserType }>('auth/signin', { user, UUID })
    if (data) {
      showPopup({ message: data.message, type: "success" })
      saveToLocalDB(LocalStorageKeys.AppSettings, data.user.settings)
      i18n.changeLanguage(data.user.settings.language); // Change language dynamically    
      toggleTheme(data.user.settings.theme)
      changeFontSize(data.user.settings.fontSize)
      updateUser(data.user);
      setLoading(false)
      return undefined;

    } else {
      showPopup({ message: error || "Error during signin. Please try again later.", type: "error" })

      setLoading(false)
    }
  }



  const signup = async (user: SignupType) => {
    setLoading(true)
    const { data, error } = await apiPost<{ user: SignupType }, { message: string, user: UserType }>('auth/signup', { user })
    if (data) {
      showPopup({ message: data.message, type: "success" })
      saveToLocalDB(LocalStorageKeys.user, data.user);
      setUser(data.user);
      setLoading(false)
      return undefined;

    } else {
      showPopup({ message: error || "Error during signup. Please try again later.", type: "error" })
      setLoading(false)


    }
  }


  const verify = async (code: string) => {
    setLoading(true)
    const UUID = getDeviceID()
    const { data, error } = await apiPost<{ user: UserType | null, code: string, UUID: string }, { message: string, user: UserType }>('auth/verify', { user, code, UUID })
    if (data) {
      showPopup({ message: data.message, type: "success" })
      updateUser(data.user)
      setLoading(false)
      return true;
    } else {
      showPopup({ message: error || "Error during email verification. Please try again later.", type: "error" })
      setLoading(false)
      return false;
    }
  }


  const resendVerificationCode = async () => {
    setLoading(true)
    const { data, error } = await apiPost<{ user: UserType | null }, { message: string }>('auth/resend-verification', { user })
    if (data) {
      setLoading(false)
      showPopup({ message: data.message, type: "success" })
      return true;
    } else {
      setLoading(false)
      showPopup({ message: error || "Error during email verification. Please try again later.", type: "error" })
      return false;
    }
  }








  return (
    <AuthContext.Provider value={{ user, signout, signin, signup, verify, updateUser, resendVerificationCode, loading }}>
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
