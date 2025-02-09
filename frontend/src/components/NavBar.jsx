import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

export default function NavBar() {
  const location = useLocation();

  return (
    <AppBar position="sticky" sx={{ background: 'transparent', boxShadow: 'none' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '8px 16px',
          borderRadius: '24px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.9)',
          width: 'fit-content',
          margin: '10px auto',
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
          {location.pathname === "/report" ? (
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
              to="/report"
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
