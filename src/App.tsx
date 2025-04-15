import { useEffect, useState } from 'react';
import './App.css';
import BottomNavigationBar from './navigation/BottomNavigation';
import { CssBaseline, Box, Container } from '@mui/material';
import CustomAppBar from './navigation/AppBar';
import Prayers from './pages/Prayers';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { isKeyInLocalDB, LocalStorageKeys } from './utils/localDB';
import SettingsPage from './pages/Settings';
import AccountPage from './pages/Account';
import AppLoading from './pages/AppLoading';
import { isIOS, isInStandaloneMode } from './utils/device';
import InstallDialog from './components/InstallDialog';
import { useUpdate } from './hooks/UpdateContext';


let deferredPrompt: any;


export default function App() {
  const { loading, error, appFirstLaunch, checkForUpdate } = useUpdate();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);



  useEffect(() => {

    if (!isKeyInLocalDB(LocalStorageKeys.FirstLaunch)) {
      appFirstLaunch()
    } else {
      checkForUpdate()
    }

    // Handle Android install prompt
    const handler = (e: any) => {
      e.preventDefault();
      deferredPrompt = e;
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Show iOS install prompt manually
    if (isIOS() && !isInStandaloneMode()) {
      setShowInstallPrompt(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);

  })


  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      deferredPrompt = null;
    }
    setShowInstallPrompt(false);
  };

  const handleClose = () => {
    setShowInstallPrompt(false);
  };



  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <CssBaseline /> {/* This will apply global CSS resets */}

        {!loading ?
          <>
            <CustomAppBar />
            <InstallDialog open={showInstallPrompt} onInstall={handleInstallClick} onClose={handleClose} />

            <Box
              component="main"
              sx={{
                flexGrow: 1, paddingBottom: '60px',  // Adjust based on the height of your BottomNavigation
              }}
            >
              <Container maxWidth="lg">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/prayers" element={<Prayers />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/account" element={<AccountPage />} />
                </Routes>
              </Container>
            </Box>
            <BottomNavigationBar />
          </>
          : <AppLoading error={error} />}
      </Box>
    </Router>

  );
}




