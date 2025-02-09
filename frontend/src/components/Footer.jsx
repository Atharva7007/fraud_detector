// Footer.jsx
import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import HACKNC from '../assets/Hack_NCState_Logo.png'

export default function Footer() {
  return (
    <AppBar
      position="sticky"
      sx={{
        top: 'auto',
        bottom: 0,
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        py: 1,
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography
          variant="body2"
          sx={{
            color: 'white',
            fontWeight: 600,
          }}
        >
          © Made with <span style={{ fontSize: '20px', color: 'red' }}>❤️</span> for{' '}
        <img 
          src={HACKNC} 
          alt="HACKNC Logo" 
          style={{ width: 'px', height: '69px', verticalAlign: 'middle', marginLeft: '5px' }}
        />
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
