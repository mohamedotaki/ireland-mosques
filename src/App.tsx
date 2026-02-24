import { useEffect, useRef, useState } from 'react';
import './App.css';
import BottomNavigationBar from './navigation/BottomNavigation';
import { CssBaseline, Box, Container, useTheme, useMediaQuery } from '@mui/material';
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
import Desktop from './pages/Desktop';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function App() {
  const { loading, error, appFirstLaunch, checkForUpdate, record_active_user } = useUpdate();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md")); // md = 960px
  useEffect(() => {
    // First time app setup or update check
    if (!isKeyInLocalDB(LocalStorageKeys.FirstLaunch)) {
      appFirstLaunch();
    } else {
      checkForUpdate();
      record_active_user()
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
                  <Route path="*" element={isDesktop ? <Desktop /> : <Prayers />} />
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
