import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import LoginIcon from '@mui/icons-material/Login';
import logo from "../assets/logo.png"
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

const pages = ['Products', 'Pricing', 'Blog'];


function CustomAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();  // <-- hook for navigation
  const { user, signout } = useAuth()
  const settings = [
    { name: 'Account', function: signout },
    { name: 'Logout', function: signout }
  ];


  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleSignin = (event: React.MouseEvent<HTMLElement>) => {
    navigate('/account');
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuItemClick = (fun: () => void) => {
    fun();
    setAnchorElUser(null);
  };

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: 'flex', md: 'flex' }, mr: 1 }}>
            <img src={logo} alt="Logo" style={{ height: 45, width: 45 }} />
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              fontSize: 15,
              flexGrow: 1,
              mr: 2,
              display: { xs: 'flex', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Ballyhaunis
          </Typography>


          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
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
