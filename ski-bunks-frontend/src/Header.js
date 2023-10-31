import React from 'react'
import './Header.css'
import { useAuth0 } from "@auth0/auth0-react";
import { Avatar, Chip, AppBar, Box, Toolbar, Typography, IconButton, MenuItem, Menu } from '@mui/material';
import { Link } from 'react-router-dom';
import { AccountCircle } from '@mui/icons-material';

import Cart from './Cart';

export default function Header(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const { user, isAuthenticated } = useAuth0();
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
        <Toolbar style={{ display:"flex", justifyContent:'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'white'}}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              SkiBunks
            </Typography>
          </Link>
          {isAuthenticated ? (
            <div className="cart-and-avatar">
              {/* <Cart /> */}
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
                <MenuItem onClick={() => handleClose()}>
                <Link to="/reservations" style={{ textDecoration: 'none', color: 'black'}}>My Reservations</Link>
                  </MenuItem>
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