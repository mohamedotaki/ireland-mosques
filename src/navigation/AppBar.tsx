import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import LoginIcon from '@mui/icons-material/Login';
import logo from "../assets/logo.png"
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Menu } from '@mui/material';
import SettingsPage from '../pages/Settings';
const pages = ['Products', 'Pricing', 'Blog'];


function CustomAppBar() {
  const navigate = useNavigate();  // <-- hook for navigation
  const { user/* , signout */ } = useAuth()

  /*   const settings = [
      { name: 'Account', function: signout },
      { name: 'Logout', function: signout }
    ]; */


  /*   const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElUser(event.currentTarget);
    };
   */
  const handleSignin = (event: React.MouseEvent<HTMLElement>) => {
    navigate('/account');
  };

  /*   const handleCloseNavMenu = () => {
      setAnchorElNav(null);
    }; */

  /*   const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    }; */

  /*   const handleMenuItemClick = (fun: () => void) => {
      fun();
      setAnchorElUser(null);
    }; */

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ cursor: "pointer", display: { xs: 'flex', md: 'flex' }, mr: 1 }} onClick={() => navigate("/")}
          >
            <img src={logo} alt="Logo" style={{ height: 45, width: 45 }} />
          </Box>
          <Typography
            onClick={() => navigate("/")}
            variant="h6"
            noWrap
            component="a"
            sx={{
              cursor: "pointer",
              fontSize: 18,
              flexGrow: 1,
              mr: 2,
              display: { xs: 'flex', md: 'flex' },
              fontFamily: "serif",
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {process.env.REACT_APP_NAME}
          </Typography>



          <Box sx={{ flexGrow: 0, display: "flex" }}>

            <SettingsMenu />
            {user ?
              <IconButton onClick={handleSignin} sx={{ p: 0 }}>
                <Avatar alt={user?.name} src="/static/images/avatar/2.jpg" />
              </IconButton> :
              <IconButton onClick={handleSignin} sx={{ p: 0 }}>
                <LoginIcon sx={{ fontSize: 30 }} />
              </IconButton>
            }

          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default CustomAppBar;


const SettingsMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ display: { xs: "none", md: "flex" } }}
      >
        <SettingsOutlinedIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
          },
        }}
      >
        <SettingsPage floating={true} />
      </Menu>
    </div>
  )
}
