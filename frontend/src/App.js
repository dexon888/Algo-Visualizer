// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SortingVisualizer from './pages/SortingVisualizer';
import PathFindingVisualizer from './pages/PathFindingVisualizer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sorting-visualizer" element={<SortingVisualizer />} />
        <Route path="/pathfinding-visualizer" element={<PathFindingVisualizer />} />
      </Routes>
    </Router>
  );
}

export default App;
