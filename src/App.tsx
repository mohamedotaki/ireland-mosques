import { useEffect } from 'react';
import './App.css';
import BottomNavigationBar from './navigation/BottomNavigation';
import { CssBaseline, Box, Container } from '@mui/material';
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
import AccountPage from './pages/Account';
import { getDateTimeString } from './utils/dateTime';

export default function App() {
  const { showPopup } = usePopup()

  interface appFirstLunchType {
    mosques: { [key: string]: mosquesDatabaseType };
    newUpdateDate: Date;
  }

  const appFirstLunch = async () => {
    saveToLocalDB(LocalStorageKeys.FirstLaunch, true)
    saveToLocalDB(LocalStorageKeys.TimeFormatIs24H, true)
    const { data, error } = await apiGet<appFirstLunchType>("app")
    if (data) {
      saveToLocalDB(LocalStorageKeys.LastDataUpdate, data.newUpdateDate)
      saveToLocalDB(LocalStorageKeys.MosquesData, data.mosques)
      const arrayOfMosques = Object.values(data.mosques)
      try {
        const closestMosque = await findClosestMosque(arrayOfMosques)

        saveToLocalDB(LocalStorageKeys.DefaultMosque, closestMosque || arrayOfMosques[0])
      } catch (error) {
        saveToLocalDB(LocalStorageKeys.DefaultMosque, arrayOfMosques[0])
      }
    } else {
      showPopup({ message: "Unable to get mosques details. please connect to internet and try later", type: "warning" })
    }

  }

  const checkForUpdate = async () => {
    const lastUpdate = getFromLocalDB(LocalStorageKeys.LastDataUpdate)
    if (lastUpdate) {
      const userLastUpdate = getDateTimeString(new Date(lastUpdate))
      const { data, error } = await apiGet<{ mosques: { [key: string]: mosquesDatabaseType }, newUpdateDate: Date }>(`app/checkForNewData`, { userLastUpdate })
      if (data) {
        const updatedMosquesIDs = Object.keys(data.mosques)
        if (updatedMosquesIDs.length > 0) {
          const localDBMosques = getFromLocalDB(LocalStorageKeys.MosquesData)
          updatedMosquesIDs.forEach((mosqueID) => {
            const updatedMosque = data.mosques[mosqueID]
            localDBMosques[mosqueID] = updatedMosque
          })
          saveToLocalDB(LocalStorageKeys.MosquesData, localDBMosques)
          saveToLocalDB(LocalStorageKeys.LastDataUpdate, data.newUpdateDate)
        }
      } else {
        showPopup({ message: "Unable to update mosques and prayers.", type: "warning" })
      }

    }
  }







  useEffect(() => {
    if (!isKeyInLocalDB(LocalStorageKeys.FirstLaunch)) {
      appFirstLunch()

    } else {
      checkForUpdate()
    }

  }, [])



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
              <Route path="/account" element={<AccountPage />} />




            </Routes>



          </Container>
        </Box>

        <BottomNavigationBar />


      </Box>
    </Router>

  );
}




