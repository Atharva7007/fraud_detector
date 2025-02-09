import React, { useState } from 'react';
import { Box, Button } from '@mui/material';

export default function NavBar() {
  const [selected, setSelected] = useState("home"); // Track active option

  const handleSelection = (option) => {
    setSelected(option);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '8px 16px',
        borderRadius: '24px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.9)',
        width: 'fit-content',
        margin: '10px auto',
      }}
    >
      <Button
        onClick={() => handleSelection("home")}
        sx={{
          backgroundColor: selected === "home" ? "#6366f1" : "transparent",
          color: selected === "home" ? "white" : "#6366f1",
          fontWeight: 600,
          borderRadius: '50%',
          minWidth: '56px',
          height: '56px',
          margin: '0 8px',
          '&:hover': {
            backgroundColor: selected === "home" ? "#4f46e5" : "rgba(99, 102, 241, 0.1)",
          },
        }}
      >
        Home
      </Button>
      <Button
        onClick={() => handleSelection("report")}
        sx={{
          backgroundColor: selected === "report" ? "#6366f1" : "transparent",
          color: selected === "report" ? "white" : "#6366f1",
          fontWeight: 600,
          borderRadius: '50%',
          minWidth: '56px',
          height: '56px',
          margin: '0 8px',
          '&:hover': {
            backgroundColor: selected === "report" ? "#4f46e5" : "rgba(99, 102, 241, 0.1)",
          },
        }}
      >
        Report
      </Button>
    </Box>
  );
}
