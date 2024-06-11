import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Home = () => {
  const sections = [
    { name: 'Path-Finding Algorithms', path: '/path-finding-visualizer' },
    { name: 'Sorting Algorithms', path: '/sorting-visualizer' },
    { name: 'String Algorithms', path: '/string-visualizer' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Algorithm Visualizer</h1>
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
