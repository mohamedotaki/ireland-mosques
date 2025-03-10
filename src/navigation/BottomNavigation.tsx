import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FeedIcon from '@mui/icons-material/Feed';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import PersonIcon from '@mui/icons-material/Person';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';


export default function BottomNavigationBar() {
  const [value, setValue] = React.useState(1);
  const navigate = useNavigate(); // useNavigate hook for navigation

  const handleNavigation = (event:any, newValue:number) => {
    setValue(newValue);
    // Navigate to the respective route
    if (newValue === 0) {
      navigate('/'); // News
    } else if (newValue === 1) {
      navigate('/prayers'); // Prayers
    } else if (newValue === 2) {
      navigate('/settings'); // Account
    }
  };

  return (
     <Box sx={{  bottom:0,right:0,left:0, position:"fixed" }}>
      <BottomNavigation
        value={value}
        onChange={handleNavigation}
       
      >
        <BottomNavigationAction label="Home" icon={<FeedIcon />} />
        <BottomNavigationAction label="Prayers" icon={<WatchLaterIcon />} />
        <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
      </BottomNavigation>
    </Box> 

  );
}
