import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <AppBar position="sticky" sx={{ 
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      py: 1
    }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5" sx={{ 
          fontWeight: 700,
          letterSpacing: '-0.5px',
          color: 'white'
        }}>
          FraudShield
        </Typography>
        
        <div>
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
        </div>
      </Toolbar>
    </AppBar>
  );
}