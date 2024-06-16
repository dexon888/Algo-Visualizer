import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Button, ThemeProvider } from '@mui/material';
import Slider from '@mui/material/Slider';
import { createTheme } from '@mui/material/styles';
import '../App.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1e88e5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#000000',
      paper: '#121212',
    },
    text: {
      primary: '#ffffff',
    },
  },
});

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
        heuristic: Infinity,
        totalCost: Infinity,
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
    console.log("Depth-First Search started");
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

    setIsRunning(false);
  };

  const breadthFirstSearch = async () => {
    console.log("Breadth-First Search started");
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

    setIsRunning(false);
  };

  const dijkstra = async () => {
    console.log("Dijkstra's Algorithm started");
    const startNode = grid.flat().find(node => node.isStart);
    const endNode = grid.flat().find(node => node.isEnd);

    if (!startNode || !endNode) return;

    startNode.distance = 0;
    const unvisitedNodes = grid.flat().filter(node => !node.isWall);
    const visitedNodesInOrder = [];

    while (unvisitedNodes.length > 0) {
      unvisitedNodes.sort((a, b) => a.distance - b.distance);
      const currentNode = unvisitedNodes.shift();

      if (currentNode.distance === Infinity) break;

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
          const alt = currentNode.distance + 1;
          if (alt < neighbor.distance) {
            neighbor.distance = alt;
            neighbor.previousNode = currentNode;
          }
        }
      }

      await delay(50);
      setGrid([...grid]);
    }

    setIsRunning(false);
  };

  const aStar = async () => {
    console.log("A* Algorithm started");
    const startNode = grid.flat().find(node => node.isStart);
    const endNode = grid.flat().find(node => node.isEnd);

    if (!startNode || !endNode) return;

    startNode.distance = 0;
    startNode.heuristic = heuristic(startNode, endNode);
    startNode.totalCost = startNode.heuristic;
    const openSet = [startNode];

    while (openSet.length > 0) {
      openSet.sort((a, b) => a.totalCost - b.totalCost);
      const currentNode = openSet.shift();

      if (currentNode.isWall || currentNode.isVisited) continue;

      currentNode.isVisited = true;

      if (currentNode === endNode) {
        await visualizePath(currentNode);
        return;
      }

      const { row, col } = currentNode;
      const neighbors = getNeighbors(row, col);

      for (const neighbor of neighbors) {
        if (!neighbor.isVisited && !neighbor.isWall) {
          const tentativeGScore = currentNode.distance + 1;
          if (tentativeGScore < neighbor.distance) {
            neighbor.previousNode = currentNode;
            neighbor.distance = tentativeGScore;
            neighbor.heuristic = heuristic(neighbor, endNode);
            neighbor.totalCost = neighbor.distance + neighbor.heuristic;
            if (!openSet.includes(neighbor)) {
              openSet.push(neighbor);
            }
          }
        }
      }

      await delay(50);
      setGrid([...grid]);
    }

    setIsRunning(false);
  };

  const bellmanFord = async () => {
    console.log("Bellman-Ford Algorithm started");
    const startNode = grid.flat().find(node => node.isStart);
    const endNode = grid.flat().find(node => node.isEnd);

    if (!startNode || !endNode) return;

    startNode.distance = 0;
    const allNodes = grid.flat();
    const visitedNodesInOrder = [];

    for (let i = 1; i <= allNodes.length - 1; i++) {
      let hasUpdated = false;
      for (const currentNode of allNodes) {
        if (currentNode.isWall || currentNode.distance === Infinity) continue;

        const { row, col } = currentNode;
        const neighbors = getNeighbors(row, col);

        for (const neighbor of neighbors) {
          if (neighbor.isWall) continue;

          const newDistance = currentNode.distance + 1; // Assuming all edges have weight 1
          if (newDistance < neighbor.distance) {
            neighbor.distance = newDistance;
            neighbor.previousNode = currentNode;
            hasUpdated = true;
            visitedNodesInOrder.push(neighbor);
          }
        }
      }
      if (!hasUpdated) break;
    }

    await visualizePath(endNode);
    setIsRunning(false);
  };

  const heuristic = (node, endNode) => {
    return Math.abs(node.row - endNode.row) + Math.abs(node.col - endNode.col);
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
    console.log(`Starting ${algorithm}`);
    setIsRunning(true);
    switch (algorithm) {
      case 'dfs':
        depthFirstSearch();
        break;
      case 'bfs':
        breadthFirstSearch();
        break;
      case 'dijkstra':
        dijkstra();
        break;
      case 'astar':
        aStar();
        break;
      case 'bellmanford':
        bellmanFord();
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

  const algorithms = [
    { name: 'dfs', displayName: 'Depth-First Search', description: 'Explores a graph by expanding the deepest node in the frontier.' },
    { name: 'bfs', displayName: 'Breadth-First Search', description: 'Explores a graph by expanding the shallowest nodes first.' },
    { name: 'dijkstra', displayName: 'Dijkstra\'s Algorithm', description: 'Finds the shortest path between nodes in a graph.' },
    { name: 'astar', displayName: 'A* Algorithm', description: 'Finds the shortest path using heuristics to optimize the search.' },
    { name: 'bellmanford', displayName: 'Bellman-Ford Algorithm', description: 'Finds the shortest paths from a single source node to all other nodes, even with negative weights.' },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="md"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          backgroundColor: 'background.default',
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            mb: 4,
            fontWeight: 'bold',
            color: 'text.primary',
          }}
        >
          Path-Finding Visualizer
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={generateNewGrid}
              sx={{
                px: 4,
                py: 2,
                mb: 2,
              }}
            >
              Generate New Grid
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate('/')}
              sx={{
                px: 4,
                py: 2,
                mb: 2,
              }}
            >
              Back to Home
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={3} justifyContent="center">
          {algorithms.map((algo) => (
            <Grid item key={algo.name}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAlgorithm(algo.name)}
                disabled={isRunning}
                sx={{
                  px: 4,
                  py: 2,
                  mb: 2,
                }}
              >
                {algo.displayName}
              </Button>
            </Grid>
          ))}
        </Grid>
        <div
          id="grid-container"
          className="w-full h-full"
          style={{ backgroundColor: theme.palette.background.default }}
        >
          {renderGrid()}
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default PathFindingVisualizer;
