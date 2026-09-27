const menu = document.getElementById("menu");
const gameScreen = document.getElementById("gameScreen");
const gameOver = document.getElementById("gameOver");

const playButton = document.getElementById("playButton");
const restartButton = document.getElementById("restartButton");
const jumpButton = document.getElementById("jumpButton");

const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");

const scoreText = document.getElementById("score");
const finalScore = document.getElementById("finalScore");
const livesText = document.getElementById("lives");

let score = 0;
let lives = 3;
let playing = false;
let jumping = false;
let obstacleX = -100;

let gameLoop;
let scoreLoop;

function startGame() {

  menu.style.display = "none";
  gameOver.style.display = "none";
  gameScreen.style.display = "block";

  score = 0;
  lives = 3;
  obstacleX = window.innerWidth + 100;

  scoreText.textContent = score;
  livesText.textContent = lives;

  playing = true;

  obstacle.style.right = "auto";
  obstacle.style.left = obstacleX + "px";

  gameLoop = requestAnimationFrame(updateGame);

  scoreLoop = setInterval(() => {

    if (!playing) return;

    score++;

    scoreText.textContent = score;

  }, 500);
}

function updateGame() {

  if (!playing) return;

  obstacleX -= 6;

  obstacle.style.left = obstacleX + "px";

  if (obstacleX < -100) {
    obstacleX = window.innerWidth + Math.random() * 300;
  }

  checkCollision();

  gameLoop = requestAnimationFrame(updateGame);
}

function jump() {

  if (!playing || jumping) return;

  jumping = true;

  player.style.transition = "bottom 0.35s ease-out";
  player.style.bottom = "55%";

  setTimeout(() => {

    player.style.transition = "bottom 0.35s ease-in";
    player.style.bottom = "35%";

  }, 350);

  setTimeout(() => {
    jumping = false;
  }, 700);
}

function checkCollision() {

  if (jumping) return;

  const playerRect = player.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();

  if (
    playerRect.right > obstacleRect.left + 15 &&
    playerRect.left < obstacleRect.right - 15 &&
    playerRect.bottom > obstacleRect.top + 15
  ) {

    hitObstacle();
  }
}

function hitObstacle() {

  obstacleX = window.innerWidth + 200;

  lives--;

  livesText.textContent = lives;

  if (lives <= 0) {
    endGame();
  }
}

function endGame() {

  playing = false;

  cancelAnimationFrame(gameLoop);
  clearInterval(scoreLoop);

  finalScore.textContent = score;

  gameOver.style.display = "flex";
}

playButton.addEventListener("click", startGame);

restartButton.addEventListener("click", startGame);

jumpButton.addEventListener("click", jump);

document.addEventListener("touchstart", function(event) {

  if (!playing) return;

  if (event.target === jumpButton) return;

  jump();

});

document.addEventListener("keydown", function(event) {

  if (event.code === "Space" || event.code === "ArrowUp") {
    jump();
  }

});
