import { useState } from 'react';
import { Container, TextField, Button, Typography, CircularProgress } from '@mui/material';
import NavBar from '../components/NavBar';

export default function Report() {
  const [reportText, setReportText] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
  
    try {
      const response = await fetch('http://localhost:8000/report_fraud/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: reportText, email_id: email }), // Send both fields to the backend
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit report');
      }
  
      const data = await response.json();
      alert(data.message); // Show success message from the backend
      setReportText(''); // Clear the input field
      setEmail(''); // Clear the email field
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
          backdropFilter: 'blur(10px)',
        }}>
          <Typography variant="h4" sx={{
            fontWeight: 700,
            mb: 3,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
          }}>
            Submit Report
          </Typography>

          <TextField
            fullWidth
            label="Fruadulent Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px'
              }
            }}
          />

          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="Provide detailed information about the fraudulent activity..."
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px'
              }
            }}
          />

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !reportText || !email}
            sx={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '12px',
              px: 6,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              display: 'block',
              mx: 'auto',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Submit Report'}
          </Button>
        </div>
      </Container>
    </>
  );
}
