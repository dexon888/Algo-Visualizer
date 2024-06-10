// src/pages/PathFindingVisualizer.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function PathFindingVisualizer() {
  const navigate = useNavigate();
  const [grid, setGrid] = useState([]);
  const [numRows, setNumRows] = useState(20);
  const [numCols, setNumCols] = useState(20);

  useEffect(() => {
    generateNewGrid();
  }, [numRows, numCols]);

  const generateNewGrid = () => {
    const newGrid = Array.from({ length: numRows }, () =>
      Array.from({ length: numCols }, () => ({
        isStart: false,
        isEnd: false,
        isWall: false,
        isVisited: false,
        distance: Infinity,
        previousNode: null,
      }))
    );

    // Place the start node
    const startRow = Math.floor(Math.random() * numRows);
    const startCol = Math.floor(Math.random() * numCols);
    newGrid[startRow][startCol].isStart = true;

    // Place the end node
    let endRow, endCol;
    do {
      endRow = Math.floor(Math.random() * numRows);
      endCol = Math.floor(Math.random() * numCols);
    } while (endRow === startRow && endCol === startCol);
    newGrid[endRow][endCol].isEnd = true;

    // Place some random walls
    for (let i = 0; i < numRows * numCols * 0.2; i++) { // 20% of the grid will be walls
      const wallRow = Math.floor(Math.random() * numRows);
      const wallCol = Math.floor(Math.random() * numCols);
      if (!newGrid[wallRow][wallCol].isStart && !newGrid[wallRow][wallCol].isEnd) {
        newGrid[wallRow][wallCol].isWall = true;
      }
    }

    setGrid(newGrid);
  };

  const renderGrid = () => {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${numCols}, 20px)` }}>
        {grid.map((row, rowIndex) =>
          row.map((node, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`node ${node.isStart ? 'node-start' : ''} ${node.isEnd ? 'node-end' : ''} ${
                node.isWall ? 'node-wall' : ''
              }`}
              style={{
                width: 20,
                height: 20,
                border: '1px solid black',
                backgroundColor: node.isStart
                  ? 'green'
                  : node.isEnd
                  ? 'red'
                  : node.isWall
                  ? 'black'
                  : 'white',
              }}
            ></div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Path-Finding Visualizer</h2>
      <div className="mb-4">
        <button onClick={generateNewGrid} className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg m-2">
          Generate New Grid
        </button>
        <button onClick={() => navigate('/')} className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-lg m-2">
          Back to Home
        </button>
      </div>
      <div id="grid-container" className="w-full h-full bg-white shadow-md">
        {renderGrid()}
      </div>
    </div>
  );
}

export default PathFindingVisualizer;
