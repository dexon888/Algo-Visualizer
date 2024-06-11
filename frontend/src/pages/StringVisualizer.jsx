import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">String Algorithms Visualizer</h2>
      <div className="mb-4">
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Enter text"
          className="px-4 py-2 border rounded-lg shadow-lg m-2"
        />
        <input
          type="text"
          value={pattern}
          onChange={handlePatternChange}
          placeholder="Enter pattern (for KMP)"
          className="px-4 py-2 border rounded-lg shadow-lg m-2"
        />
      </div>
      <div className="mb-4">
        <button onClick={() => navigate('/')} className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-lg m-2">
          Back to Home
        </button>
        {stringAlgorithms.map((algo) => (
          <div className="tooltip" key={algo.name}>
            <button
              onClick={() => handleAlgorithm(algo.name)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg m-2"
              disabled={isRunning}
            >
              {algo.displayName}
            </button>
            <span className="tooltiptext">{algo.description}</span>
          </div>
        ))}
      </div>
      <div className="w-full mb-4 flex items-center justify-center">
        <label className="mr-2">Result:</label>
        <div className="px-4 py-2 border rounded-lg shadow-lg bg-white">{result}</div>
      </div>
    </div>
  );
}

export default StringVisualizer;
