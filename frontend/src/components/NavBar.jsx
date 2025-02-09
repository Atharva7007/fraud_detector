import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import ShieldLogo from '../assets/Shield_Logo.png'; // Adjust the path as needed

export default function NavBar() {
  const location = useLocation();

  return (
    <AppBar position="sticky" sx={{ background: 'transparent', boxShadow: 'none', marginTop: '10px' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        {/* Logo on the top left, positioned absolutely to avoid shifting center content */}
        <Box
          component="img"
          src={ShieldLogo}
          alt="Shield Logo"
          sx={{ height: 150, position: 'absolute', left: 16 }}
        />

        {/* Centered Buttons */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '8px 16px',
          borderRadius: '24px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.9)',
          width: 'fit-content',
        }}>
          <Button 
            component={Link} 
            to="/"
            sx={{ 
              color: 'black',
              fontWeight: 600,
              mx: 1.5,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Home
          </Button>
          {location.pathname === "/Report" ? (
            <Button 
              component={Link} 
              to="/CheckFraud"
              sx={{ 
                color: 'black',
                fontWeight: 600,
                mx: 1.5,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              CheckFraud
            </Button>
          ) : (
            <Button 
              component={Link} 
              to="/Report"
              sx={{ 
                color: 'black',
                fontWeight: 600,
                mx: 1.5,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Report
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
