import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function StringVisualizer() {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);

  const stringAlgorithms = [
    { name: 'kmp', displayName: 'Knuth-Morris-Pratt (KMP)', description: 'An efficient string matching algorithm that preprocesses the pattern to determine the shifts of the pattern itself for avoiding unnecessary comparisons.' },
    { name: 'rabinKarp', displayName: 'Rabin-Karp', description: 'A string matching algorithm that uses hashing to find any one of a set of pattern strings in a text.' },
    { name: 'longestCommonSubstring', displayName: 'Longest Common Substring', description: 'Finds the longest string (or strings) that is a substring of two or more strings.' },
    { name: 'zAlgorithm', displayName: 'Z Algorithm', description: 'An algorithm for pattern matching that uses a Z array which stores the length of the longest substring starting from each position that is also a prefix of the text.' },
    { name: 'ahoCorasick', displayName: 'Aho-Corasick', description: 'A string matching algorithm that constructs a finite state machine for a set of strings and uses it to search for all occurrences of the strings in a text.' },
  ];

  const handleAlgorithm = (algorithm) => {
    if (isRunning) return;
    setIsRunning(true);
    console.log(`Starting ${algorithm}`);
    // Implement the algorithm's logic here
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">String Algorithms Visualizer</h2>
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
    </div>
  );
}

export default StringVisualizer;
