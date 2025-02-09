import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <AppBar position="sticky" sx={{ 
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      py: 1
    }}>
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
              color: 'white',
              fontWeight: 600,
              mx: 1.5,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Home
          </Button>
          <Button 
            component={Link} 
            to="/report"
            sx={{ 
              color: 'white',
              fontWeight: 600,
              mx: 1.5,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Report
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}