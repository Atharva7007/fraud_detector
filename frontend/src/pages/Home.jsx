import { Container, Typography, Button, Card, CardContent, Stack, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShieldLogo from '../assets/Shield_Logo.png'; // Ensure the path is correct
import BlurText from '../assets/BlurText';

export default function Home() {
  const navigate = useNavigate();

  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(to bottom right, #000000, #4b0082)',
      position: 'relative' // This is necessary for absolute positioning of logos
    }}>
      
      {/* Centered Shield Logo */}
      <Box
        component="img"
        src={ShieldLogo}
        alt="Shield Logo"
        sx={{
          height: 180,
          position: 'absolute',
          top: '5%',
          transform: 'scaleX(-1)', // Optionally flip the logo for variety
          boxShadow: '0 4px 10px rgba(0,0,0,0.5)', // Reflection-like shadow
        }}
      />

      <Container maxWidth="sm" sx={{ textAlign: 'center', position: 'relative' }}>
        <Typography variant="h2" sx={{
          fontWeight: 700,
          color: 'white',
          mb: 4
        }}>
          Fraud Shield
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
          <Card sx={{
            width: 300,
            textAlign: 'center',
            p: 4,
            bgcolor: 'rgba(255,255,255,1)',
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.2)'
          }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Check Fraud
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/CheckFraud')}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  borderRadius: '12px',
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Check Fraud
              </Button>
            </CardContent>
          </Card>

          <Card sx={{
            width: 300,
            textAlign: 'center',
            p: 4,
            bgcolor: 'rgba(255,255,255,1)',
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.2)'
          }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Report Fraud
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/Report')}
                sx={{
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
                  borderRadius: '12px',
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 20px rgba(255, 107, 107, 0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Report Fraud
              </Button>
            </CardContent>
          </Card>
        </Stack>

        <br />

        <i style={{ color: "white", fontSize: "20px" }}>
          <BlurText
            text="Fraud never sleeps, but neither do we—scan, detect, and shield in seconds!"
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-2xl mb-8"
          />
        </i>
      </Container>
    </div>
  );
}
