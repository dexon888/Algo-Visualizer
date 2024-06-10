// src/pages/SortingVisualizer.js
import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import '../App.css'; // Make sure to import your CSS file

function SortingVisualizer() {
  const [data, setData] = useState([]);
  const [numBars, setNumBars] = useState(20);
  const [isSorting, setIsSorting] = useState(false);
  const [delay, setDelay] = useState(100);
  const navigate = useNavigate(); // Use useNavigate for navigation

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

  const delayExecution = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSort = (algorithm) => {
    if (isSorting) return;
    setIsSorting(true);
    switch (algorithm) {
      case 'selectionsort':
        selectionSort();
        break;
      case 'bubblesort':
        bubbleSort();
        break;
      case 'insertionsort':
        insertionSort();
        break;
      case 'mergesort':
        mergeSort();
        break;
      case 'quicksort':
        quickSort();
        break;
      case 'countingsort':
        countingSort();
        break;
      case 'heapsort':
        heapSort();
        break;
      default:
        setIsSorting(false);
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
        await delayExecution(delay); 
      }
      if (minIndex !== i) {
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        setData([...arr]);
        rects.data(arr)
          .attr('y', d => 300 - d * 3)
          .attr('height', d => d * 3)
          .attr('fill', 'teal');
        await delayExecution(delay);
      }
    }
    rects.attr('fill', 'teal');
    setIsSorting(false);
  };

  const bubbleSort = async () => {
    let arr = [...data];
    const svg = d3.select('#d3-container').select('svg');
    const rects = svg.selectAll('rect').data(arr);

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        rects.attr('fill', (d, idx) => (idx === j || idx === j + 1 ? 'red' : 'teal'));
        await delayExecution(delay);

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setData([...arr]);
          rects.data(arr)
            .attr('y', d => 300 - d * 3)
            .attr('height', d => d * 3);
          await delayExecution(delay);
        }
      }
    }
    rects.attr('fill', 'teal');
    setIsSorting(false);
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
        await delayExecution(delay);
        j = j - 1;
      }
      arr[j + 1] = key;
      setData([...arr]);
      rects.data(arr)
        .attr('y', d => 300 - d * 3)
        .attr('height', d => d * 3);
      await delayExecution(delay);
    }
    rects.attr('fill', 'teal');
    setIsSorting(false);
  };

  const mergeSort = async () => {
    let arr = [...data];
    await mergeSortHelper(arr, 0, arr.length - 1);
    setData([...arr]);
    const svg = d3.select('#d3-container').select('svg');
    const rects = svg.selectAll('rect').data(arr);
    rects.attr('fill', 'teal');
    setIsSorting(false);
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
      await delayExecution(delay);

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
      await delayExecution(delay);
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
      await delayExecution(delay);
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
    setIsSorting(false);
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
      await delayExecution(delay);

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setData([...arr]);
        rects.data(arr)
          .attr('y', d => 300 - d * 3)
          .attr('height', d => d * 3);
        await delayExecution(delay);
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setData([...arr]);
    rects.data(arr)
      .attr('y', d => 300 - d * 3)
      .attr('height', d => d * 3);
    await delayExecution(delay);
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

    for (let i = 0; i < arr.length; i++) {
      count[arr[i] - min]++;
      rects.attr('fill', (d, idx) => (idx === i ? 'red' : 'teal'));
      await delayExecution(delay);
    }

    for (let i = 1; i < count.length; i++) {
      count[i] += count[i - 1];
    }

    for (let i = arr.length - 1; i >= 0; i--) {
      output[count[arr[i] - min] - 1] = arr[i];
      count[arr[i] - min]--;
      setData([...output]);
      rects.data(output)
        .attr('y', d => 300 - d * 3)
        .attr('height', d => d * 3)
        .attr('fill', 'teal');
      await delayExecution(delay);
    }

    setData([...output]);
    rects.attr('fill', 'teal');
    setIsSorting(false);
  };

  const heapSort = async () => {
    let arr = [...data];
    const n = arr.length;
    const svg = d3.select('#d3-container').select('svg');
    const rects = svg.selectAll('rect').data(arr);

    const heapify = async (arr, n, i) => {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < n && arr[left] > arr[largest]) {
        largest = left;
      }

      if (right < n && arr[right] > arr[largest]) {
        largest = right;
      }

      if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        setData([...arr]);
        rects.data(arr)
          .attr('y', d => 300 - d * 3)
          .attr('height', d => d * 3)
          .attr('fill', 'teal');
        await delayExecution(delay);
        await heapify(arr, n, largest);
      }
    };

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await heapify(arr, n, i);
    }

    for (let i = n - 1; i > 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      setData([...arr]);
      rects.data(arr)
        .attr('y', d => 300 - d * 3)
        .attr('height', d => d * 3)
        .attr('fill', 'teal');
      await delayExecution(delay);
      await heapify(arr, i, 0);
    }

    setData([...arr]);
    rects.attr('fill', 'teal');
    setIsSorting(false);
  };

  const algorithms = [
    { name: 'Selection Sort', description: 'A simple comparison-based sorting algorithm.' },
    { name: 'Bubble Sort', description: 'A comparison-based algorithm that repeatedly swaps adjacent elements.' },
    { name: 'Insertion Sort', description: 'Builds the sorted array one item at a time.' },
    { name: 'Merge Sort', description: 'A divide-and-conquer algorithm that splits the array into halves.' },
    { name: 'Quick Sort', description: 'A fast divide-and-conquer sorting algorithm.' },
    { name: 'Counting Sort', description: 'A non-comparison-based sorting algorithm.' },
    { name: 'Heap Sort', description: 'A comparison-based algorithm that uses a binary heap data structure.' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Sorting Visualizer</h2>
      <div className="mb-4">
        <button onClick={generateNewArray} className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg m-2">
          Generate New Array
        </button>
        <button onClick={() => navigate('/')} className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-lg m-2">
          Back to Home
        </button>
        {algorithms.map((algo) => (
          <div className="tooltip" key={algo.name}>
            <button
              onClick={() => handleSort(algo.name.replace(' ', '').toLowerCase())}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg m-2"
              disabled={isSorting}
            >
              {algo.name}
            </button>
            <span className="tooltiptext">{algo.description}</span>
          </div>
        ))}
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
