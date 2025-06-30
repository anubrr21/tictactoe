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

// Sound effects
const winSound = document.getElementById("win-sound");
const drawSound = document.getElementById("draw-sound");
const clickSound = document.getElementById("click-sound");

let turnO = true;
let count = 0;
let scores = { X: 0, O: 0 };
let gameActive = false;

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

// Initialize game
startBtn.addEventListener("click", () => {
  clickSound.play();
  const xName = playerXName.value.trim() || "Player X";
  const oName = playerOName.value.trim() || "Player O";
  
  playerXDisplay.textContent = xName;
  playerODisplay.textContent = oName;
  
  playerInput.classList.add("hide");
  gameContainer.classList.remove("hide");
  gameActive = true;
  
  // Highlight first player
  updateCurrentPlayerIndicator();
});

const resetGame = () => {
  turnO = true;
  count = 0;
  enableBoxes();
  msgContainer.classList.add("hide");
  msg.classList.remove("winner-animation");
  drawMsg.classList.add("hide");
  updateCurrentPlayerIndicator();
  
  // Reset box colors and animations
  boxes.forEach(box => {
    box.style.backgroundColor = "";
    box.classList.remove("x", "o", "winning-box");
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

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (!gameActive) return;
    
    clickSound.play();
    
    if (turnO) {
      box.innerText = "O";
      box.classList.add("o");
      turnO = false;
    } else {
      box.innerText = "X";
      box.classList.add("x");
      turnO = true;
    }
    box.disabled = true;
    count++;
    
    // Add animation class
    box.classList.add("animate__animated", "animate__rubberBand");
    box.addEventListener("animationend", () => {
      box.classList.remove("animate__animated", "animate__rubberBand");
    });
    
    updateCurrentPlayerIndicator();
    
    let isWinner = checkWinner();
    
    if (count === 9 && !isWinner) {
      gameDraw();
    }
  });
});

const gameDraw = () => {
  drawSound.play();
  msgContainer.classList.remove("hide");
  drawMsg.classList.remove("hide");
  disableBoxes();
};

const disableBoxes = () => {
  for (let box of boxes) {
    box.disabled = true;
  }
};

const enableBoxes = () => {
  for (let box of boxes) {
    box.disabled = false;
    box.innerText = "";
    box.classList.remove("x", "o", "winning-box");
  }
};

const showWinner = (winner) => {
  winSound.play();
  const winnerName = winner === "X" ? playerXDisplay.textContent : playerODisplay.textContent;
  msg.innerHTML = `🎉 <span class="winner">${winnerName}</span> wins! 🎉`;
  msg.classList.add("winner-animation");
  msgContainer.classList.remove("hide");
  disableBoxes();
  
  // Update scores
  scores[winner]++;
  if (winner === "X") {
    playerXScore.textContent = scores.X;
  } else {
    playerOScore.textContent = scores.O;
  }
};

const checkWinner = () => {
  for (let pattern of winPatterns) {
    let pos1Val = boxes[pattern[0]].innerText;
    let pos2Val = boxes[pattern[1]].innerText;
    let pos3Val = boxes[pattern[2]].innerText;
    
    if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
      if (pos1Val === pos2Val && pos2Val === pos3Val) {
        // Highlight winning boxes
        for (let i of pattern) {
          boxes[i].classList.add("winning-box");
          boxes[i].style.backgroundColor = pos1Val === "X" ? "#ede9fe" : "#ecfdf5";
        }
        
        showWinner(pos1Val);
        return true;
      }
    }
  }
};

newGameBtn.addEventListener("click", () => {
  clickSound.play();
  resetGame();
});

resetBtn.addEventListener("click", () => {
  clickSound.play();
  scores = { X: 0, O: 0 };
  playerXScore.textContent = "0";
  playerOScore.textContent = "0";
  resetGame();
});