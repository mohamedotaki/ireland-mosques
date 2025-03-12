import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Popup from '../components/Popup';

type PopupProps ={
  message:string;
  type: "success" | "info" | "warning" | "error";
  show:boolean;
}

type ShowPopupProps ={
  message:string;
  type: "success" | "info" | "warning" | "error";
}

// Define the props for the ThemeProvider component
interface PopupProviderProps {
  children: ReactNode;
}

interface PopupContextType {
  showPopup: ({message,type}:ShowPopupProps) => void;
}

// Create the context with default values
const PopupContext = createContext<PopupContextType | undefined>(undefined);



// Provide the context to the app
export const PopupProviderWrapper: React.FC<PopupProviderProps> = ({ children }) => {
  const [popupData, setPopupData] = useState<PopupProps>({message:"",type:"success",show:false});


  const showPopup = ({type,message}:ShowPopupProps) => {
    setPopupData({message,type,show:true});
  };
  const closePopup = () => {
    setPopupData({message:"",type:popupData.type,show:false});
  };

  return (
    <PopupContext.Provider value={{ showPopup }}>
      <Popup message={popupData.message} type={popupData.type} show={popupData.show} onClose={closePopup}/>
      {children}
    </PopupContext.Provider>
  );
};

// Custom hook to use the theme context
export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
