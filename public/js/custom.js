const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio || 1;

// Set the canvas width and height based on it's size in the window
canvas.width = canvas.offsetWidth * dpr;
canvas.height = canvas.offsetHeight * dpr;
ctx.scale(dpr, dpr);

// Define cell size and grid dimensions
const numRows = Math.floor(canvas.height);
const numCols = Math.floor(canvas.width);

// Function to initialize the grid
function createGrid() {
  const grid = [];
  for (let i = 0; i < numRows; i++) {
    grid[i] = [];
    for (let j = 0; j < numCols; j++) {
      grid[i][j] = Math.random() > 0.7 ? 1 : 0; // Random initialization
    }
  }
  return grid;
}

let animationId;
let isRunning;
let grid = createGrid();
const desiredFPS = 60;
const frameInterval = 1000 / desiredFPS;
let lastFrameTime = 0;

// Function to draw the grid
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (grid[i][j] === 1) {
        ctx.fillStyle = "white";
        ctx.fillRect(j * 1, i * 1, 1, 1);
      }
    }
  }
}

// Function to update the grid based on Conway's rules
function updateGrid() {
  const newGrid = [];
  for (let i = 0; i < numRows; i++) {
    newGrid[i] = [];
    for (let j = 0; j < numCols; j++) {
      const neighbors = countNeighbors(i, j);
      if (grid[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
        newGrid[i][j] = 0;
      } else if (grid[i][j] === 0 && neighbors === 3) {
        newGrid[i][j] = 1;
      } else {
        newGrid[i][j] = grid[i][j];
      }
    }
  }
  grid = newGrid;
}

// Function to count live neighbors of a cell
function countNeighbors(row, col) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const r = row + i;
      const c = col + j;
      if (
        r >= 0 &&
        r < numRows &&
        c >= 0 &&
        c < numCols &&
        !(i === 0 && j === 0)
      ) {
        count += grid[r][c];
      }
    }
  }
  return count;
}

function resizeCanvas() {
  pause();
  setTimeout(() => {
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    play();
  }, 2000);
}

const togglePause = () => {
  if (!isRunning) {
    isRunning = true;
    mainLoop();
    return;
  }
  isRunning = false;
  cancelAnimationFrame(animationId);
};

const restart = () => {
  cancelAnimationFrame(animationId);
  grid = createGrid();
  drawGrid();
  isRunning = true;
  animationId = requestAnimationFrame(mainLoop);
};

// Main loop to update and draw the grid
function mainLoop(timestamp) {
  if (timestamp - lastFrameTime >= frameInterval) {
    lastFrameTime = timestamp;
    updateGrid();
    drawGrid();
  }
  if (isRunning) {
    animationId = requestAnimationFrame(mainLoop);
  }
}

document
  .getElementById("playPauseButton")
  .addEventListener("click", () => togglePause());

document
  .getElementById("restartButton")
  .addEventListener("click", () => restart());

window.addEventListener("resize", resizeCanvas);

isRunning = true;
animationId = requestAnimationFrame(mainLoop);
