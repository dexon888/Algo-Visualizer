import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">{displayText}</h1>
      {sections.map((section) => (
        <Link
          key={section.name}
          to={section.path}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg mb-4"
        >
          {section.name}
        </Link>
      ))}
    </div>
  );
};

export default Home;
