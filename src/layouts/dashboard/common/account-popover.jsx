import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useAuthStore } from 'src/stores';

const GUEST_MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
    path: '/',
  },
  {
    label: 'Login',
    icon: 'eva:log-in-fill',
    path: '/login',
  },
];

const LOGGED_IN_MENU_OPTIONS = [
  // {
  //   label: 'Home',
  //   icon: 'eva:home-fill',
  //   path: '/',
  // },
  // {
  //   label: 'Profile',
  //   icon: 'eva:person-fill',
  //   path: '/profile',
  // },
  // {
  //   label: 'Settings',
  //   icon: 'eva:settings-2-fill',
  //   path: '/settings',
  // },
];

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();
  const { auth, logoutUser } = useAuthStore((state) => ({
    auth: state.auth,
    logoutUser: state.logoutUser,
  }));

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = () => {
    logoutUser();
    handleClose();
    navigate('/'); // Redirect to home after logout
  };

  const handleMenuItemClick = (path) => {
    handleClose();
    navigate(path);
  };

  const menuOptions = auth.status === 'authorized' ? LOGGED_IN_MENU_OPTIONS : GUEST_MENU_OPTIONS;

  const getAvatarLetter = () => {
    if (auth.status === 'authorized' && auth.user) {
      return auth.user.name ? auth.user.name.charAt(0).toUpperCase() : 'U';
    }
    return '⁝';
  };

  const getDisplayName = () => {
    if (auth.status === 'authorized' && auth.user) {
      return auth.user.name || 'User';
    }
    return 'Please Login';
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={auth.status === 'authorized' && auth.user ? auth.user.photoURL : null}
          alt={getDisplayName()}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {getAvatarLetter()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {getDisplayName()}
          </Typography>
          {auth.status === 'authorized' && auth.user && auth.user.email && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {auth.user.email}
            </Typography>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {menuOptions.map((option) => (
          <MenuItem key={option.label} onClick={() => handleMenuItemClick(option.path)}>
            {option.label}
          </MenuItem>
        ))}

        {auth.status === 'authorized' && (
          <>
            <Divider sx={{ borderStyle: 'dashed', m: 0 }} />
            <MenuItem disableRipple disableTouchRipple onClick={handleLogout} sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}>
              Logout
            </MenuItem>
          </>
        )}
      </Popover>
    </>
  );
}
