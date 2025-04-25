import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FeedIcon from '@mui/icons-material/Feed';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNavigationBar() {
  const [value, setValue] = React.useState(1); // default to Home
  const navigate = useNavigate();
  const location = useLocation(); // get current location
  const path = location.pathname;

  // Set the value based on the current path
  React.useEffect(() => {
    if (path === '/home') {
      setValue(0); // Home
    } else if (path === '/') {
      setValue(1); // Prayers
    } else if (path === '/settings') {
      setValue(2); // Settings
    }
  }, [path]); // Effect runs whenever the path changes

  const handleNavigation = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (newValue === 0) {
      navigate('/home'); // Home
    } else if (newValue === 1) {
      navigate('/'); // Prayers
    } else if (newValue === 2) {
      navigate('/settings'); // Settings
    }
  };

  return (
    <Box sx={{ bottom: 0, right: 0, left: 0, position: "fixed", display: { md: 'none' }, paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <BottomNavigation value={value} onChange={handleNavigation}>
        <BottomNavigationAction label="Home" icon={<FeedIcon sx={{ fontSize: 30 }} />} />
        <BottomNavigationAction label="Prayers" icon={<WatchLaterIcon sx={{ fontSize: 30 }} />} />
        <BottomNavigationAction label="Settings" icon={<SettingsIcon sx={{ fontSize: 30 }} />} />
      </BottomNavigation>
    </Box>
  );
}
