const boxes = document.querySelectorAll(".box");
const resetBtn = document.querySelector("#reset-btn");
const newGameBtn = document.querySelector("#new-btn");
const msgContainer = document.querySelector(".msg-container");
const msg = document.querySelector("#msg");
const drawMsg = document.querySelector("#draw-msg");
const startBtn = document.querySelector("#start-btn");
const playerInput = document.querySelector(".player-input");
const gameContainer = document.querySelector(".game-container");
const playerXName = document.querySelector("#playerX");
const playerOName = document.querySelector("#playerO");
const playerXDisplay = document.querySelector("#playerX-name");
const playerODisplay = document.querySelector("#playerO-name");
const playerXScore = document.querySelector(".player-x-score .score");
const playerOScore = document.querySelector(".player-o-score .score");
const themeToggle = document.querySelector("#theme-toggle");
const pvpBtn = document.querySelector("#pvp-btn");
const pvcBtn = document.querySelector("#pvc-btn");
const endGameBtn = document.querySelector("#end-game-btn");



// Sound effects
const winSound = document.getElementById("win-sound");
const drawSound = document.getElementById("draw-sound");
const clickSound = document.getElementById("click-sound");

let turnO = true;
let count = 0;
let scores = { playerX: 0, playerO: 0, computer: 0 };
let gameActive = false;
let gameMode = "pvp";

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  if (document.body.classList.contains("light-mode")) {
    themeToggle.textContent = "🌙 Dark Mode";
  } else {
    themeToggle.textContent = "☀️ Light Mode";
  }
});

// Game mode selection
pvpBtn.addEventListener("click", () => {
  clickSound.play();
  gameMode = "pvp";
  pvpBtn.classList.add("active");
  pvcBtn.classList.remove("active");
  playerOName.disabled = false;
  playerOName.placeholder = "Player O Name";
  playerOName.value = "";
  resetScores();
});

pvcBtn.addEventListener("click", () => {
  clickSound.play();
  gameMode = "pvc";
  pvcBtn.classList.add("active");
  pvpBtn.classList.remove("active");
  playerOName.disabled = true;
  playerOName.value = "Computer";
  playerOName.placeholder = "Computer";
  resetScores();
});

// Initialize game
startBtn.addEventListener("click", () => {
  clickSound.play();
  const xName = playerXName.value.trim() || "Player X";
  const oName = gameMode === "pvp" 
    ? (playerOName.value.trim() || "Player O") 
    : "Computer";
  
  playerXDisplay.textContent = xName;
  playerODisplay.textContent = oName;
  
  playerInput.classList.add("hide");
  gameContainer.classList.remove("hide");
  gameActive = true;
  
  resetGame();
  
  // If PVC mode and computer goes first
  if (gameMode === "pvc" && !turnO) {
    setTimeout(makeComputerMove, 500);
  }
});

// End game button
endGameBtn.addEventListener("click", () => {
  clickSound.play();
  gameContainer.classList.add("hide");
  playerInput.classList.remove("hide");
  resetGame();
});

const resetScores = () => {
  scores = { playerX: 0, playerO: 0, computer: 0 };
  playerXScore.textContent = "0";
  playerOScore.textContent = "0";
};

const resetGame = () => {
  turnO = true;
  count = 0;
  enableBoxes();
  msgContainer.classList.add("hide");
  msg.classList.remove("winner-animation");
  drawMsg.classList.add("hide");
  updateCurrentPlayerIndicator();
  
  boxes.forEach(box => {
    box.style.backgroundColor = "";
    box.classList.remove("x", "o", "winning-box");
    box.disabled = false;
    box.innerText = "";
  });
};

const updateCurrentPlayerIndicator = () => {
  document.querySelectorAll(".player-x-score, .player-o-score").forEach(el => {
    el.classList.remove("current-player");
  });
  
  if (turnO) {
    document.querySelector(".player-o-score").classList.add("current-player");
  } else {
    document.querySelector(".player-x-score").classList.add("current-player");
  }
};

const makeComputerMove = () => {
  if (!gameActive || gameMode !== "pvc" || turnO) return;
  
  const emptyBoxes = Array.from(boxes).filter(box => box.innerText === "");
  if (emptyBoxes.length === 0) return;

  const board = Array.from(boxes).map(box => box.innerText);
  
  // 1. Check for winning move
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "X";
      if (checkWin(board, "X")) {
        simulateComputerClick(i);
        return;
      }
      board[i] = "";
    }
  }
  
  // 2. Check for blocking move
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "O";
      if (checkWin(board, "O")) {
        simulateComputerClick(i);
        return;
      }
      board[i] = "";
    }
  }
  
  // 3. Take center if available
  if (board[4] === "") {
    simulateComputerClick(4);
    return;
  }
  
  // 4. Take a corner if available
  const corners = [0, 2, 6, 8];
  const emptyCorners = corners.filter(i => board[i] === "");
  if (emptyCorners.length > 0) {
    const randomCorner = emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
    simulateComputerClick(randomCorner);
    return;
  }
  
  // 5. Take any available edge
  const edges = [1, 3, 5, 7];
  const emptyEdges = edges.filter(i => board[i] === "");
  if (emptyEdges.length > 0) {
    const randomEdge = emptyEdges[Math.floor(Math.random() * emptyEdges.length)];
    simulateComputerClick(randomEdge);
    return;
  }
};

const simulateComputerClick = (index) => {
  const box = boxes[index];
  clickSound.play();
  
  box.innerText = "X";
  box.classList.add("x");
  box.disabled = true;
  count++;
  
  box.classList.add("animate__animated", "animate__rubberBand");
  box.addEventListener("animationend", () => {
    box.classList.remove("animate__animated", "animate__rubberBand");
  });
  
  const board = Array.from(boxes).map(box => box.innerText);
  
  if (checkWin(board, "X")) {
    showWinner("X");
    return;
  } else if (count === 9) {
    gameDraw();
    return;
  }
  
  turnO = true;
  updateCurrentPlayerIndicator();
};

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (!gameActive || (gameMode === "pvc" && !turnO)) return;
    
    clickSound.play();
    
    box.innerText = turnO ? "O" : "X";
    box.classList.add(turnO ? "o" : "x");
    box.disabled = true;
    count++;
    
    box.classList.add("animate__animated", "animate__rubberBand");
    box.addEventListener("animationend", () => {
      box.classList.remove("animate__animated", "animate__rubberBand");
    });
    
    const currentPlayer = turnO ? "O" : "X";
    const board = Array.from(boxes).map(box => box.innerText);
    
    if (checkWin(board, currentPlayer)) {
      showWinner(currentPlayer);
      return;
    } else if (count === 9) {
      gameDraw();
      return;
    }
    
    turnO = !turnO;
    updateCurrentPlayerIndicator();
    
    if (gameMode === "pvc" && !turnO) {
      setTimeout(makeComputerMove, 500);
    }
  });
});

const checkWin = (board, player) => {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] === player && board[b] === player && board[c] === player) {
      for (let i of pattern) {
        boxes[i].classList.add("winning-box");
        boxes[i].style.backgroundColor = player === "X" ? "#ede9fe" : "#ecfdf5";
      }
      return true;
    }
  }
  return false;
};

const gameDraw = () => {
  drawSound.play();
  msgContainer.classList.remove("hide");
  drawMsg.classList.remove("hide");
  disableBoxes();
};

const disableBoxes = () => {
  gameActive = false;
  boxes.forEach(box => {
    box.disabled = true;
  });
};

const enableBoxes = () => {
  gameActive = true;
  boxes.forEach(box => {
    box.disabled = false;
  });
};

const showWinner = (winner) => {
  winSound.play();
  
  let winnerName;
  if (gameMode === "pvp") {
    winnerName = winner === "X" ? playerXDisplay.textContent : playerODisplay.textContent;
    scores[winner === "X" ? "playerX" : "playerO"]++;
    playerXScore.textContent = scores.playerX;
    playerOScore.textContent = scores.playerO;
  } else {
    if (winner === "X") {
      winnerName = "Computer";
      scores.computer++;
      playerOScore.textContent = scores.computer;
    } else {
      winnerName = playerXDisplay.textContent;
      scores.playerX++;
      playerXScore.textContent = scores.playerX;
    }
  }
  
  msg.innerHTML = `🎉 <span class="winner">${winnerName}</span> wins! 🎉`;
  msg.classList.add("winner-animation");
  msgContainer.classList.remove("hide");
  disableBoxes();
};

newGameBtn.addEventListener("click", () => {
  clickSound.play();
  resetGame();
  if (gameMode === "pvc" && !turnO) {
    setTimeout(makeComputerMove, 500);
  }
});

resetBtn.addEventListener("click", () => {
  clickSound.play();
  resetScores();
  resetGame();
});
