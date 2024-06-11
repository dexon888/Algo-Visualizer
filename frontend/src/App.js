import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PathFindingVisualizer from './pages/PathFindingVisualizer';
import SortingVisualizer from './pages/SortingVisualizer';
import StringVisualizer from './pages/StringVisualizer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/path-finding-visualizer" element={<PathFindingVisualizer />} />
        <Route path="/sorting-visualizer" element={<SortingVisualizer />} />
        <Route path="/string-visualizer" element={<StringVisualizer />} /> {/* Add the new route */}
      </Routes>
    </Router>
  );
}

export default App;
