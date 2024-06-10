// src/pages/SortingVisualizer.js
import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

function SortingVisualizer() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Initialize data
    setData([...Array(20)].map(() => Math.floor(Math.random() * 100)));
  }, []);

  useEffect(() => {
    // D3 visualization code here
    const svg = d3.select('#d3-container')
      .append('svg')
      .attr('width', 500)
      .attr('height', 300);

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * 25)
      .attr('y', d => 300 - d * 3)
      .attr('width', 20)
      .attr('height', d => d * 3)
      .attr('fill', 'teal');
  }, [data]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Sorting Visualizer</h2>
      <div id="d3-container" className="w-full h-full bg-white shadow-md"></div>
    </div>
  );
}

export default SortingVisualizer;
