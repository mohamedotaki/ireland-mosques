import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { getFromLocalDB, isKeyInLocalDB, LocalStorageKeys, removeFromLocalDB, saveToLocalDB } from '../utils/localDB';
import { useTranslation } from 'react-i18next';

// Define the types for the context value
interface ThemeContextType {
  theme: 'light' | 'dark';
  selectedTheme: 'light' | 'dark' | 'system_default';
  fontSize: number;
  toggleTheme: (theme: 'light' | 'dark' | 'system_default') => void;
  changeFontSize: (fontNumber: number) => void;
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
  const { i18n } = useTranslation();
  const savedTheme = getFromLocalDB(LocalStorageKeys.AppTheme);
  const [theme, setTheme] = useState<'light' | 'dark'>(savedTheme || getSystemDefaultTheme()); // Default theme is light
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'system_default'>(isKeyInLocalDB(LocalStorageKeys.AppTheme) ? savedTheme : 'system_default'); // Default theme is light
  const [fontSize, SetFontSize] = useState<number>(getFromLocalDB(LocalStorageKeys.FontSize) || 14); // Default font size

  const toggleTheme = (theme: 'light' | 'dark' | 'system_default') => {
    if (theme === "system_default") {
      setTheme(getSystemDefaultTheme());
      removeFromLocalDB(LocalStorageKeys.AppTheme);
      setSelectedTheme('system_default');
    } else {
      setTheme(theme);
      saveToLocalDB(LocalStorageKeys.AppTheme, theme);
      setSelectedTheme(theme);
    }
  };

  const changeFontSize = (fontSize: number) => {
    SetFontSize(fontSize);
    saveToLocalDB(LocalStorageKeys.FontSize, fontSize); // Save the updated font size
  };

  // Create a theme object with the dynamic font size
  const themeObject = createTheme({
    palette: {
      mode: theme, // Use the theme mode (light/dark)
    },
    direction: i18n.language === "ar" ? "rtl" : "ltr",
    typography: {
      fontSize, // Dynamically set the font size here
    },
  });

  return (
    <ThemeContext.Provider value={{ theme, selectedTheme, fontSize, toggleTheme, changeFontSize }}>
      {/* Apply the created theme to all components within the provider */}
      <MUIThemeProvider theme={themeObject}>
        {children}
      </MUIThemeProvider>
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
