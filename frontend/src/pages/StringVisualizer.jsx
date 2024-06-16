import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Button, TextField, Box, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import '../App.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1e88e5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#000000',
      paper: '#121212',
    },
    text: {
      primary: '#ffffff',
    },
  },
});

function StringVisualizer() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [pattern, setPattern] = useState('');
  const [result, setResult] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const stringAlgorithms = [
    { name: 'kmp', displayName: 'Knuth-Morris-Pratt (KMP)', description: 'An efficient string matching algorithm that preprocesses the pattern to determine the shifts of the pattern itself for avoiding unnecessary comparisons.' },
    { name: 'rabinKarp', displayName: 'Rabin-Karp', description: 'A string matching algorithm that uses hashing to find any one of a set of pattern strings in a text.' },
    { name: 'longestCommonSubstring', displayName: 'Longest Common Substring', description: 'Finds the longest string (or strings) that is a substring of two or more strings.' },
    { name: 'zAlgorithm', displayName: 'Z Algorithm', description: 'An algorithm for pattern matching that uses a Z array which stores the length of the longest substring starting from each position that is also a prefix of the text.' },
    { name: 'ahoCorasick', displayName: 'Aho-Corasick', description: 'A string matching algorithm that constructs a finite state machine for a set of strings and uses it to search for all occurrences of the strings in a text.' },
  ];

  const handleTextChange = (e) => setText(e.target.value);
  const handlePatternChange = (e) => setPattern(e.target.value);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const visualizeKMP = async () => {
    setIsRunning(true);
    setResult('');

    const lps = Array(pattern.length).fill(0);
    let j = 0;

    // Compute LPS array
    const computeLPSArray = () => {
      let len = 0;
      let i = 1;
      while (i < pattern.length) {
        if (pattern[i] === pattern[len]) {
          len++;
          lps[i] = len;
          i++;
        } else {
          if (len !== 0) {
            len = lps[len - 1];
          } else {
            lps[i] = 0;
            i++;
          }
        }
      }
    };

    computeLPSArray();

    let i = 0;
    while (i < text.length) {
      if (pattern[j] === text[i]) {
        i++;
        j++;
      }

      if (j === pattern.length) {
        setResult(`Pattern found at index ${i - j}`);
        await delay(1000);
        j = lps[j - 1];
      } else if (i < text.length && pattern[j] !== text[i]) {
        if (j !== 0) {
          j = lps[j - 1];
        } else {
          i++;
        }
      }
      setResult(`Checking character at index ${i}`);
      await delay(500);
    }

    if (j !== pattern.length) {
      setResult('Pattern not found');
    }

    setIsRunning(false);
  };

  const handleAlgorithm = (algorithm) => {
    if (isRunning) return;
    setResult('');
    switch (algorithm) {
      case 'kmp':
        visualizeKMP();
        break;
      default:
        setIsRunning(false);
        break;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="md"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          backgroundColor: 'background.default',
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            mb: 4,
            fontWeight: 'bold',
            color: 'text.primary',
          }}
        >
          String Algorithms Visualizer
        </Typography>
        <Box
          component="div"
          sx={{
            mb: 4,
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <TextField
            label="Enter text"
            variant="outlined"
            value={text}
            onChange={handleTextChange}
            sx={{ backgroundColor: 'background.paper' }}
          />
          <TextField
            label="Enter pattern (for KMP)"
            variant="outlined"
            value={pattern}
            onChange={handlePatternChange}
            sx={{ backgroundColor: 'background.paper' }}
          />
        </Box>
        <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate('/')}
              sx={{
                px: 4,
                py: 2,
                mb: 2,
              }}
            >
              Back to Home
            </Button>
          </Grid>
          {stringAlgorithms.map((algo) => (
            <Grid item key={algo.name}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAlgorithm(algo.name)}
                disabled={isRunning}
                sx={{
                  px: 4,
                  py: 2,
                  mb: 2,
                }}
              >
                {algo.displayName}
              </Button>
            </Grid>
          ))}
        </Grid>
        <Box
          component="div"
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'background.paper',
            padding: 2,
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" color="text.primary">
            Result: {result}
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default StringVisualizer;
