// src/pages/Home.js (or MainScreen.js)
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Algorithm Visualizer</h1>
      <div className="mb-4">
        <Link to="/sorting-visualizer" className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg m-2">
          Sorting Algorithms
        </Link>
        <Link to="/pathfinding-visualizer" className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg m-2">
          Path-Finding Algorithms
        </Link>
      </div>
    </div>
  );
}

export default Home;
