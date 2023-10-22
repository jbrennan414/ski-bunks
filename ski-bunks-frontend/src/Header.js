import React from 'react'
import './Header.css'
import { useAuth0 } from "@auth0/auth0-react";
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const { user, isAuthenticated, isLoading } = useAuth0();
  const { logout } = useAuth0();
  const { loginWithRedirect } = useAuth0();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SkiBunks
          </Typography>
          {isAuthenticated ? (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar alt="skibunks_logo" src={user.picture} />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>My Reservations</MenuItem>
                { isLoading || !isAuthenticated && (<p>log in</p>)}
                <MenuItem onClick={() => logout({ logoutParams: {returnTo: window.location.origin }})}>Log Out</MenuItem>
              </Menu>
            </div>
          ) : (
            <Chip icon={<AccountCircle />} label="Sign In" variant="outlined" onClick={() => loginWithRedirect()} />
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}