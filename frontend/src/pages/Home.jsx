import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Box, Button, Grid } from '@mui/material';
import '../App.css';

const Home = () => {
  const sections = [
    { name: 'Path-Finding Algorithms', path: '/path-finding-visualizer' },
    { name: 'Sorting Algorithms', path: '/sorting-visualizer' },
    { name: 'String Algorithms', path: '/string-visualizer' },
  ];

  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);
  const [backspace, setBackspace] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  const texts = ["Algorithm Visualizer", "Tool for Algorithm Comprehension"];

  useEffect(() => {
    const typingSpeed = 150;
    const backspaceSpeed = 100;
    const delay = 1000;

    const handleTyping = () => {
      if (backspace) {
        if (index > 0) {
          setDisplayText(prev => prev.slice(0, -1));
          setIndex(prev => prev - 1);
        } else {
          setBackspace(false);
          setTextIndex(prev => (prev + 1) % texts.length);
        }
      } else {
        if (index < texts[textIndex].length) {
          setDisplayText(prev => prev + texts[textIndex][index]);
          setIndex(prev => prev + 1);
        } else {
          setTimeout(() => setBackspace(true), delay);
        }
      }
    };

    const timer = setTimeout(handleTyping, backspace ? backspaceSpeed : typingSpeed);

    return () => clearTimeout(timer);
  }, [index, backspace, textIndex, texts]);

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        bgcolor: 'background.paper',
        backgroundImage: 'url(/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Typography
        variant="h2"
        component="h1"
        sx={{
          mb: 8,
          fontWeight: 'bold',
          color: 'white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        }}
      >
        {displayText}
      </Typography>
      <Grid container spacing={3}>
        {sections.map((section) => (
          <Grid item xs={12} sm={6} md={4} key={section.name}>
            <Link to={section.path} style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  py: 2,
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  },
                }}
              >
                {section.name}
              </Button>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
