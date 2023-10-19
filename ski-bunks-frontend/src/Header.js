import React from 'react'
import './Header.css'
import { useAuth0 } from "@auth0/auth0-react";

export default function Header() {

  const { user, isAuthenticated, isLoading } = useAuth0();

  const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();
    return <button onClick={() => loginWithRedirect()}>Log In</button>;
  };

  const LogoutButton = () => {
    const { logout } = useAuth0();

    return (
      <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
        Log Out
      </button>
    );
  };

  return (
    <div className='header'>
      <img id="header-logo" src={require('./assets/skibunks_logo.png')} alt='skibunks_logo' />
      { isLoading && (
          <div className='profile-section'>
            <p>Loading...</p>
          </div>
        )}
      { !isLoading && isAuthenticated && (
          <div className='profile-section'>
            <img id="header-profile-pic" src={user.picture} alt={user.name} />
            <LogoutButton />
          </div>
        )}
      { !isLoading && !isAuthenticated && (
          <div className='profile-section'>
            <LoginButton />
          </div>
        )}
    </div>
  )
}
