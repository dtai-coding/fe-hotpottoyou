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

// Mock account data for logged-in state
const account = {
  displayName: 'John Doe',
  email: 'john.doe@example.com',
  photoURL: 'https://via.placeholder.com/150',
};

const GUEST_MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
  },
  {
    label: 'Login',
    icon: 'eva:log-in-fill',
  },
  {
    label: 'Register',
    icon: 'eva:person-add-fill',
  },
];

const LOGGED_IN_MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const [isGuest, setIsGuest] = useState(true);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = () => {
    setIsGuest(true);
    handleClose();
  };

  const menuOptions = isGuest ? GUEST_MENU_OPTIONS : LOGGED_IN_MENU_OPTIONS;

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
          src={isGuest ? null : account.photoURL}
          alt={isGuest ? 'Guest' : account.displayName}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {isGuest ? 'G' : account.displayName.charAt(0).toUpperCase()}
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
            {isGuest ? 'Guest' : account.displayName}
          </Typography>
          {!isGuest && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {account.email}
            </Typography>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {menuOptions.map((option) => (
          <MenuItem key={option.label} onClick={handleClose}>
            {option.label}
          </MenuItem>
        ))}

        {!isGuest && (
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
