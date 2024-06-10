import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function PathFindingVisualizer() {
  const navigate = useNavigate();
  const [grid, setGrid] = useState([]);
  const [numRows, setNumRows] = useState(20);
  const [numCols, setNumCols] = useState(20);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    generateNewGrid();
  }, [numRows, numCols]);

  const generateNewGrid = () => {
    const newGrid = Array.from({ length: numRows }, (_, row) =>
      Array.from({ length: numCols }, (_, col) => ({
        row,
        col,
        isStart: false,
        isEnd: false,
        isWall: false,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        previousNode: null,
      }))
    );

    const startRow = Math.floor(Math.random() * numRows);
    const startCol = Math.floor(Math.random() * numCols);
    newGrid[startRow][startCol].isStart = true;

    let endRow, endCol;
    do {
      endRow = Math.floor(Math.random() * numRows);
      endCol = Math.floor(Math.random() * numCols);
    } while (endRow === startRow && endCol === startCol);
    newGrid[endRow][endCol].isEnd = true;

    for (let i = 0; i < numRows * numCols * 0.2; i++) {
      const wallRow = Math.floor(Math.random() * numRows);
      const wallCol = Math.floor(Math.random() * numCols);
      if (!newGrid[wallRow][wallCol].isStart && !newGrid[wallRow][wallCol].isEnd) {
        newGrid[wallRow][wallCol].isWall = true;
      }
    }

    setGrid(newGrid);
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const depthFirstSearch = async () => {
    const startNode = grid.flat().find(node => node.isStart);
    const endNode = grid.flat().find(node => node.isEnd);

    if (!startNode || !endNode) return;

    const stack = [startNode];
    const visitedNodesInOrder = [];

    while (stack.length > 0) {
      const currentNode = stack.pop();

      if (!currentNode || currentNode.isWall || currentNode.isVisited) continue;

      currentNode.isVisited = true;
      visitedNodesInOrder.push(currentNode);

      if (currentNode === endNode) {
        await visualizePath(currentNode);
        return;
      }

      const { row, col } = currentNode;
      const neighbors = getNeighbors(row, col);

      for (const neighbor of neighbors) {
        if (!neighbor.isVisited) {
          neighbor.previousNode = currentNode;
          stack.push(neighbor);
        }
      }

      await delay(50);
      setGrid([...grid]);
    }
  };

  const breadthFirstSearch = async () => {
    const startNode = grid.flat().find(node => node.isStart);
    const endNode = grid.flat().find(node => node.isEnd);

    if (!startNode || !endNode) return;

    const queue = [startNode];
    const visitedNodesInOrder = [];

    while (queue.length > 0) {
      const currentNode = queue.shift();

      if (!currentNode || currentNode.isWall || currentNode.isVisited) continue;

      currentNode.isVisited = true;
      visitedNodesInOrder.push(currentNode);

      if (currentNode === endNode) {
        await visualizePath(currentNode);
        return;
      }

      const { row, col } = currentNode;
      const neighbors = getNeighbors(row, col);

      for (const neighbor of neighbors) {
        if (!neighbor.isVisited) {
          neighbor.previousNode = currentNode;
          queue.push(neighbor);
        }
      }

      await delay(50);
      setGrid([...grid]);
    }
  };

  const getNeighbors = (row, col) => {
    const neighbors = [];
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < numRows - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < numCols - 1) neighbors.push(grid[row][col + 1]);
    return neighbors;
  };

  const visualizePath = async (endNode) => {
    let currentNode = endNode;
    while (currentNode !== null) {
      if (!currentNode.isStart && !currentNode.isEnd) {
        currentNode.isPath = true;
      }
      currentNode = currentNode.previousNode;
      await delay(50);
      setGrid(grid.map(row => row.map(cell => cell.row === currentNode?.row && cell.col === currentNode?.col ? currentNode : cell)));
    }
    setIsRunning(false);
  };

  const handleAlgorithm = (algorithm) => {
    if (isRunning) return;
    setIsRunning(true);
    switch (algorithm) {
      case 'dfs':
        depthFirstSearch();
        break;
      case 'bfs':
        breadthFirstSearch();
        break;
      default:
        setIsRunning(false);
        break;
    }
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
              } ${node.isVisited ? 'node-visited' : ''} ${node.isPath ? 'node-path' : ''}`}
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
                  : node.isPath
                  ? 'yellow'
                  : node.isVisited
                  ? 'lightblue'
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
        <button
          onClick={() => handleAlgorithm('dfs')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg m-2"
          disabled={isRunning}
        >
          Depth-First Search
        </button>
        <button
          onClick={() => handleAlgorithm('bfs')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg m-2"
          disabled={isRunning}
        >
          Breadth-First Search
        </button>
      </div>
      <div id="grid-container" className="w-full h-full bg-white shadow-md">
        {renderGrid()}
      </div>
    </div>
  );
}

export default PathFindingVisualizer;
