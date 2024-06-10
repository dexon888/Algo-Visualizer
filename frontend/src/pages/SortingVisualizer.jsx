// src/pages/SortingVisualizer.js
import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

function SortingVisualizer() {
  const [data, setData] = useState([]);

  useEffect(() => {
    generateNewArray();
  }, []);

  useEffect(() => {
    renderBars();
  }, [data]);

  const generateNewArray = () => {
    setData([...Array(20)].map(() => Math.floor(Math.random() * 100)));
  };

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
      case 'bubbleSort':
        bubbleSort();
        break;
      case 'insertionSort':
        insertionSort();
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

  const bubbleSort = async () => {
    let arr = [...data];
    const svg = d3.select('#d3-container').select('svg');
    const rects = svg.selectAll('rect').data(arr);

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        rects.attr('fill', (d, idx) => (idx === j || idx === j + 1 ? 'red' : 'teal'));
        await new Promise(resolve => setTimeout(resolve, 100)); // Pause for visualization

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setData([...arr]);
          rects.data(arr)
            .attr('y', d => 300 - d * 3)
            .attr('height', d => d * 3);
          await new Promise(resolve => setTimeout(resolve, 100)); // Pause for visualization
        }
      }
    }

    // Revert all bars to the default color after sorting
    rects.attr('fill', 'teal');
  };

  const insertionSort = async () => {
    let arr = [...data];
    const svg = d3.select('#d3-container').select('svg');
    const rects = svg.selectAll('rect').data(arr);

    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;

      while (j >= 0 && arr[j] > key) {
        rects.attr('fill', (d, idx) => (idx === j || idx === j + 1 ? 'red' : 'teal'));
        arr[j + 1] = arr[j];
        setData([...arr]);
        rects.data(arr)
          .attr('y', d => 300 - d * 3)
          .attr('height', d => d * 3);
        await new Promise(resolve => setTimeout(resolve, 100)); // Pause for visualization
        j = j - 1;
      }
      arr[j + 1] = key;
      setData([...arr]);
      rects.data(arr)
        .attr('y', d => 300 - d * 3)
        .attr('height', d => d * 3);
      await new Promise(resolve => setTimeout(resolve, 100)); // Pause for visualization
    }

    // Revert all bars to the default color after sorting
    rects.attr('fill', 'teal');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Sorting Visualizer</h2>
      <div className="mb-4">
        <button onClick={generateNewArray} className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg m-2">
          Generate New Array
        </button>
        <button onClick={() => handleSort('selectionSort')} className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg m-2">
          Selection Sort
        </button>
        <button onClick={() => handleSort('bubbleSort')} className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg m-2">
          Bubble Sort
        </button>
        <button onClick={() => handleSort('insertionSort')} className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg m-2">
          Insertion Sort
        </button>
        {/* Add more buttons for other sorting algorithms here */}
      </div>
      <div id="d3-container" className="w-full h-full bg-white shadow-md"></div>
    </div>
  );
}

export default SortingVisualizer;
