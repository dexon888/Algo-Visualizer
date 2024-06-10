// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Algorithm Visualizer</h1>
      <div className="space-y-4">
        <Link to="/sorting">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg">
            Sorting Algorithms
          </button>
        </Link>
        {/* Add more algorithm categories here as needed */}
      </div>
    </div>
  );
}

export default Home;
