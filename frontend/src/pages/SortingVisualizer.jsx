// src/pages/SortingVisualizer.js
import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

function SortingVisualizer() {
  const [data, setData] = useState([]);
  const [numBars, setNumBars] = useState(20);

  useEffect(() => {
    generateNewArray();
  }, [numBars]);

  useEffect(() => {
    renderBars();
  }, [data]);

  const generateNewArray = () => {
    const newData = [...Array(parseInt(numBars))].map(() => Math.floor(Math.random() * 100));
    setData(newData);
  };

  const handleNumBarsChange = (event) => {
    setNumBars(event.target.value);
  };

  const renderBars = () => {
    const svgWidth = 600;
    const svgHeight = 300;
    const barWidth = svgWidth / data.length - 2;

    const svg = d3.select('#d3-container')
      .selectAll('svg')
      .data([data])
      .join(
        enter => enter.append('svg')
          .attr('width', svgWidth)
          .attr('height', svgHeight)
          .attr('style', 'display: block; margin: 0 auto;')
      );

    svg.selectAll('rect')
      .data(data)
      .join(
        enter => enter.append('rect')
          .attr('x', (d, i) => i * (svgWidth / data.length))
          .attr('y', d => svgHeight - d * 3)
          .attr('width', barWidth)
          .attr('height', d => d * 3)
          .attr('fill', 'teal'),
        update => update
          .attr('x', (d, i) => i * (svgWidth / data.length))
          .attr('y', d => svgHeight - d * 3)
          .attr('width', barWidth)
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
      case 'mergeSort':
        mergeSort();
        break;
      case 'quickSort':
        quickSort();
        break;
      case 'countingSort':
        countingSort();
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

  const mergeSort = async () => {
    let arr = [...data];
    await mergeSortHelper(arr, 0, arr.length - 1);
    setData([...arr]);
    const svg = d3.select('#d3-container').select('svg');
    const rects = svg.selectAll('rect').data(arr);
    rects.attr('fill', 'teal');
  };

  const mergeSortHelper = async (arr, left, right) => {
    if (left >= right) {
      return;
    }
    const middle = Math.floor((left + right) / 2);
    await mergeSortHelper(arr, left, middle);
    await mergeSortHelper(arr, middle + 1, right);
    await merge(arr, left, middle, right);
  };

  const merge = async (arr, left, middle, right) => {
    const leftArray = arr.slice(left, middle + 1);
    const rightArray = arr.slice(middle + 1, right + 1);

    let i = 0, j = 0, k = left;
    const svg = d3.select('#d3-container').select('svg');
    const rects = svg.selectAll('rect').data(arr);

    while (i < leftArray.length && j < rightArray.length) {
      rects.attr('fill', (d, idx) => (idx === k ? 'red' : 'teal'));
      await new Promise(resolve => setTimeout(resolve, 100)); // Pause for visualization

      if (leftArray[i] <= rightArray[j]) {
        arr[k] = leftArray[i];
        i++;
      } else {
        arr[k] = rightArray[j];
        j++;
      }
      setData([...arr]);
      rects.data(arr)
        .attr('y', d => 300 - d * 3)
        .attr('height', d => d * 3);
      k++;
    }

    while (i < leftArray.length) {
      rects.attr('fill', (d, idx) => (idx === k ? 'red' : 'teal'));
      await new Promise(resolve => setTimeout(resolve, 100)); // Pause for visualization
      arr[k] = leftArray[i];
      setData([...arr]);
      rects.data(arr)
        .attr('y', d => 300 - d * 3)
        .attr('height', d => d * 3);
      i++;
      k++;
    }

    while (j < rightArray.length) {
      rects.attr('fill', (d, idx) => (idx === k ? 'red' : 'teal'));
      await new Promise(resolve => setTimeout(resolve, 100)); // Pause for visualization
      arr[k] = rightArray[j];
      setData([...arr]);
      rects.data(arr)
        .attr('y', d => 300 - d * 3)
        .attr('height', d => d * 3);
      j++;
      k++;
    }
  };

  const quickSort = async () => {
    let arr = [...data];
    await quickSortHelper(arr, 0, arr.length - 1);
    setData([...arr]);
    const svg = d3.select('#d3-container').select('svg');
    const rects = svg.selectAll('rect').data(arr);
    rects.attr('fill', 'teal');
  };

  const quickSortHelper = async (arr, low, high) => {
    if (low < high) {
      let pi = await partition(arr, low, high);
      await quickSortHelper(arr, low, pi - 1);
      await quickSortHelper(arr, pi + 1, high);
    }
  };

  const partition = async (arr, low, high) => {
    let pivot = arr[high];
    let i = (low - 1);
    const svg = d3.select('#d3-container').select('svg');
    const rects = svg.selectAll('rect').data(arr);

    for (let j = low; j < high; j++) {
      rects.attr('fill', (d, idx) => (idx === j || idx === high ? 'red' : (idx === i + 1 ? 'yellow' : 'teal')));
      await new Promise(resolve => setTimeout(resolve, 100)); // Pause for visualization

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setData([...arr]);
        rects.data(arr)
          .attr('y', d => 300 - d * 3)
          .attr('height', d => d * 3);
        await new Promise(resolve => setTimeout(resolve, 100)); // Pause for visualization
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setData([...arr]);
    rects.data(arr)
      .attr('y', d => 300 - d * 3)
      .attr('height', d => d * 3);
    await new Promise(resolve => setTimeout(resolve, 100)); // Pause for visualization
    return i + 1;
  };

  const countingSort = async () => {
    let arr = [...data];
    let max = Math.max(...arr);
    let min = Math.min(...arr);
    let range = max - min + 1;
    let count = new Array(range).fill(0);
    let output = new Array(arr.length).fill(0);

    const svg = d3.select('#d3-container').select('svg');
    const rects = svg.selectAll('rect').data(arr);

    // Store count of each element
    for (let i = 0; i < arr.length; i++) {
      count[arr[i] - min]++;
      rects.attr('fill', (d, idx) => (idx === i ? 'red' : 'teal'));
      await new Promise(resolve => setTimeout(resolve, 100)); // Pause for visualization
    }

    // Store cumulative count
    for (let i = 1; i < count.length; i++) {
      count[i] += count[i - 1];
    }

    // Find the index of each element in the output array
    for (let i = arr.length - 1; i >= 0; i--) {
      output[count[arr[i] - min] - 1] = arr[i];
      count[arr[i] - min]--;
      setData([...output]);
      rects.data(output)
        .attr('y', d => 300 - d * 3)
        .attr('height', d => d * 3)
        .attr('fill', 'teal');
      await new Promise(resolve => setTimeout(resolve, 100)); // Pause for visualization
    }

    setData([...output]);

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
        <button onClick={() => handleSort('mergeSort')} className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg m-2">
          Merge Sort
        </button>
        <button onClick={() => handleSort('quickSort')} className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg m-2">
          Quick Sort
        </button>
        <button onClick={() => handleSort('countingSort')} className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg m-2">
          Counting Sort
        </button>
      </div>
      <div className="w-full mb-4 flex items-center justify-center">
        <label className="mr-2">Number of Bars: {numBars}</label>
        <input type="range" min="5" max="100" value={numBars} onChange={handleNumBarsChange} className="w-1/2" />
      </div>
      <div id="d3-container" className="w-full h-full bg-white shadow-md"></div>
    </div>
  );
}

export default SortingVisualizer;
