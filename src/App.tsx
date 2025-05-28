import { useEffect, useRef, useState } from 'react';
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
import UpdateNotification from './components/UpdateNotification';
import { PrayerTimes, CalculationMethod, Coordinates, Madhab } from 'adhan';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function App() {
  const { loading, error, appFirstLaunch, checkForUpdate } = useUpdate();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<{[key:string]:string}>();

  useEffect(() => {
    // First time app setup or update check
    if (!isKeyInLocalDB(LocalStorageKeys.FirstLaunch)) {
      appFirstLaunch();
    } else {
      checkForUpdate();
    }

    // Android install prompt handler
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      setShowInstallPrompt(true);
    };

    // Visibility change: check for updates when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkForUpdate();
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // iOS install prompt
    if (isIOS() && !isInStandaloneMode()) {
      setShowInstallPrompt(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = deferredPromptRef.current;
    if (promptEvent) {
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      deferredPromptRef.current = null;
    }
    setShowInstallPrompt(false);
  };

  const handleClose = () => {
    setShowInstallPrompt(false);
  };


  useEffect(() => {
    // Example coordinates (Makkah)
    const coordinates = new Coordinates(53.764013, -8.763586); 
    const params = CalculationMethod.NorthAmerica();
    const date = new Date("2025 05 01");
    const dateComponents = date;
    params.madhab = "shafi"
    params.adjustments.fajr = -3
    params.adjustments.sunrise = -1
    params.adjustments.dhuhr = 2
    params.adjustments.asr = -1
    params.adjustments.isha = -2


    const prayerTimes = new PrayerTimes(coordinates, dateComponents, params);

    console.log(prayerTimes)

    setPrayerTimes({
      fajr: prayerTimes.fajr.toLocaleTimeString(),
      sunrise: prayerTimes.sunrise.toLocaleTimeString(),
      dhuhr: prayerTimes.dhuhr.toLocaleTimeString(),
      asr: prayerTimes.asr.toLocaleTimeString(),
      maghrib: prayerTimes.maghrib.toLocaleTimeString(),
      isha: prayerTimes.isha.toLocaleTimeString(),
    });
  }, []);
  console.log(prayerTimes)

  return (
    <Router>
      <UpdateNotification />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <CssBaseline />

        {!loading ? (
          <>
            <CustomAppBar />
            <InstallDialog open={showInstallPrompt} onInstall={handleInstallClick} onClose={handleClose} />

            <Box
              component="main"
              sx={{
                flexGrow: 1,
                paddingBottom: 'calc(60px + env(safe-area-inset-bottom))',
              }}
            >
              <Container maxWidth="lg">
                <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path="/" element={<Prayers />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/account" element={<AccountPage />} />
                </Routes>
              </Container>
            </Box>
            <BottomNavigationBar />
          </>
        ) : (
          <AppLoading error={error} />
        )}
      </Box>
    </Router>
  );
}
