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
    renderBars();
  }, [data]);

  const renderBars = () => {
    const svg = d3.select('#d3-container')
      .selectAll('svg')
      .data([data])
      .join(
        enter => enter.append('svg')
          .attr('width', 500)
          .attr('height', 300)
      );

    svg.selectAll('rect')
      .data(data)
      .join(
        enter => enter.append('rect')
          .attr('x', (d, i) => i * 25)
          .attr('y', d => 300 - d * 3)
          .attr('width', 20)
          .attr('height', d => d * 3)
          .attr('fill', 'teal'),
        update => update
          .attr('x', (d, i) => i * 25)
          .attr('y', d => 300 - d * 3)
          .attr('width', 20)
          .attr('height', d => d * 3)
          .attr('fill', 'teal')
      );
  };

  const handleSort = (algorithm) => {
    switch (algorithm) {
      case 'selectionSort':
        selectionSort();
        break;
      // Add cases for other algorithms here
      default:
        break;
    }
  };

  const selectionSort = async () => {
    let arr = [...data];
    const svg = d3.select('#d3-container').select('svg');
    const rects = svg.selectAll('rect').data(arr);

    for (let i = 0; i < arr.length; i++) {
      let minIndex = i;
      for (let j = i + 1; j < arr.length; j++) {
        rects.attr('fill', (d, idx) => (idx === j || idx === minIndex ? 'red' : 'teal'));
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
        await new Promise(resolve => setTimeout(resolve, 100)); // Pause for visualization
      }
      if (minIndex !== i) {
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        setData([...arr]);
        rects.data(arr)
          .attr('y', d => 300 - d * 3)
          .attr('height', d => d * 3)
          .attr('fill', 'teal');
        await new Promise(resolve => setTimeout(resolve, 100)); // Pause for visualization
      }
    }

    // Revert all bars to the default color after sorting
    rects.attr('fill', 'teal');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Sorting Visualizer</h2>
      <div className="mb-4">
        <button onClick={() => handleSort('selectionSort')} className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg m-2">
          Selection Sort
        </button>
        {/* Add more buttons for other sorting algorithms here */}
      </div>
      <div id="d3-container" className="w-full h-full bg-white shadow-md"></div>
    </div>
  );
}

export default SortingVisualizer;
