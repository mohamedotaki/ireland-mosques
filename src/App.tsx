import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import CustomButton from './components/Button';
import BottomNavigationBar from './navigation/BottomNavigation';
import { ThemeProvider, CssBaseline, Button, Box, Container, Typography } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useTheme } from './hooks/ThemeContext';
import CustomAppBar from './navigation/AppBar';
import Prayers from './pages/Prayers';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { getFromLocalDB, isKeyInLocalDB, LocalStorageKeys, saveToLocalDB } from './utils/localDB';
import { apiGet } from './utils/api';
import { locales } from 'moment';
import { mosquesDatabaseType } from './types';
import SettingsPage from './pages/Settings';
import findClosestMosque from './utils/findClosestMosque';
import { usePopup } from './hooks/PopupContext';


export default function App() {


  useEffect(() => {
    appFirstLunch()
  }, [])
  // Create the themes



  return (
    <Router>

      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <CssBaseline /> {/* This will apply global CSS resets */}

        <CustomAppBar />
        <Box
          component="main"
          sx={{
            flexGrow: 1, paddingBottom: '60px',  // Adjust based on the height of your BottomNavigation
          }}
        >
          <Container maxWidth="lg">
            {/* Your content goes here */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/prayers" element={<Prayers />} />
              <Route path="/settings" element={<SettingsPage />} />

            </Routes>



          </Container>
        </Box>

        <BottomNavigationBar />


      </Box>
    </Router>

  );
}


interface appFirstLunchType {
  mosques: mosquesDatabaseType
}

const appFirstLunch = async () => {
  if (isKeyInLocalDB(LocalStorageKeys.FirstLaunch)) {
    //get mosques data
    saveToLocalDB(LocalStorageKeys.FirstLaunch, true)
    const { data, error } = await apiGet<appFirstLunchType>("app")
    if (!error) {
      saveToLocalDB(LocalStorageKeys.MosquesData, data?.mosques)
    }

    //Set Default Values
    saveToLocalDB(LocalStorageKeys.TimeFormatIs24H, true)



  }

}

