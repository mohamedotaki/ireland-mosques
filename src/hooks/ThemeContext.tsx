import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { createTheme, Theme } from '@mui/material/styles';
import { getFromLocalDB, isKeyInLocalDB, LocalStorageKeys, removeFromLocalDB, saveToLocalDB } from '../utils/localDB';

// Define the types for the context value
interface ThemeContextType {
  theme: 'light' | 'dark';
  selectedTheme:'light' | 'dark' | 'system_default';
  toggleTheme: (theme:'light' | 'dark' | 'system_default') => void;
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Define the props for the ThemeProvider component
interface ThemeProviderProps {
  children: ReactNode;
}

const getSystemDefaultTheme = (): 'light' | 'dark' => {
  const isLightTheme = window.matchMedia('(prefers-color-scheme: light)').matches;
  return isLightTheme ? 'light' : 'dark';
};

// Provide the context to the app
export const ThemeProviderWrapper: React.FC<ThemeProviderProps> = ({ children }) => {
  const savedTheme = getFromLocalDB(LocalStorageKeys.AppTheme);
  const [theme, setTheme] = useState<'light' | 'dark'>( savedTheme|| getSystemDefaultTheme()); // Default theme is light
  const [selectedTheme,setSelectedTheme] = useState<'light' | 'dark' | 'system_default'>(isKeyInLocalDB(LocalStorageKeys.AppTheme)?savedTheme:'system_default'); // Default theme is light

 
  const toggleTheme = (theme:'light' | 'dark' | 'system_default') => {
    if(theme === "system_default"){
      setTheme(getSystemDefaultTheme());
      removeFromLocalDB(LocalStorageKeys.AppTheme)
      setSelectedTheme('system_default')

    }else{
      setTheme(theme);
      saveToLocalDB(LocalStorageKeys.AppTheme,theme)
      setSelectedTheme(theme)
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, selectedTheme,toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
