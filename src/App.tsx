import React, { useEffect } from 'react';
import './App.css';
import BottomNavigationBar from './navigation/BottomNavigation';
import { ThemeProvider, CssBaseline, Button, Box, Container, Typography } from '@mui/material';
import CustomAppBar from './navigation/AppBar';
import Prayers from './pages/Prayers';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { getFromLocalDB, isKeyInLocalDB, LocalStorageKeys, saveToLocalDB } from './utils/localDB';
import { apiGet } from './utils/api';
import { mosquesDatabaseType } from './types';
import SettingsPage from './pages/Settings';
import findClosestMosque from './utils/findClosestMosque';
import { usePopup } from './hooks/PopupContext';
import { defaultMosque } from './types/defaults';
import SignInSignUpPage from './pages/SignInSignUpPage';


export default function App() {
  const { showPopup } = usePopup()

  interface appFirstLunchType {
    mosques: Array<mosquesDatabaseType>
  }

  const appFirstLunch = async () => {
    if (!isKeyInLocalDB(LocalStorageKeys.FirstLaunch)) {
      saveToLocalDB(LocalStorageKeys.FirstLaunch, true)
      const { data, error } = await apiGet<appFirstLunchType>("app")
      if (data) {
        saveToLocalDB(LocalStorageKeys.MosquesData, data?.mosques)
        try {
          const closestMosque = await findClosestMosque(data?.mosques)
          saveToLocalDB(LocalStorageKeys.DefaultMosque, closestMosque)

        } catch (error) {
          saveToLocalDB(LocalStorageKeys.DefaultMosque, defaultMosque)
        }
      } else {
        showPopup({ message: "Unable to get mosques details. please connect to internet and try later", type: "warning" })
      }

      //Set Default Values
      saveToLocalDB(LocalStorageKeys.TimeFormatIs24H, true)



    }

  }

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
              <Route path="/signin" element={<SignInSignUpPage />}
              />

            </Routes>



          </Container>
        </Box>

        <BottomNavigationBar />


      </Box>
    </Router>

  );
}




