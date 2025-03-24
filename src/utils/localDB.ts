// Enum for the valid keys
export enum LocalStorageKeys {
  FirstLaunch = "firstLaunch",
  AppTheme = "AppTheme",
  MosquesData = "MosquesData",
  TimeFormatIs24H = "TimeFormatIs24H",
  DefaultMosque = "DefaultMosque",
  FontSize = "FontSize",
  AppLanguage = "AppLanguage",
  user = "User"



}


// Save a value to localStorage
export const saveToLocalDB = (key: LocalStorageKeys, value: any) => {
  try {
    // Convert value to string before saving
    const stringifiedValue = JSON.stringify(value);
    localStorage.setItem(key, stringifiedValue);
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

// Retrieve a value from localStorage
export const getFromLocalDB = (key: LocalStorageKeys) => {
  try {
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value); // Parse the stored JSON string
    }
    return null; // Return null if the key doesn't exist
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return null;
  }
};

// Remove a value from localStorage
export const removeFromLocalDB = (key: LocalStorageKeys) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from localStorage:", error);
  }
};

// Clear all data from localStorage
export const clearLocalDB = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};

// Check if a key exists in localStorage
export const isKeyInLocalDB = (key: LocalStorageKeys): boolean => {
  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error("Error checking key in localStorage:", error);
    return false;
  }
};
