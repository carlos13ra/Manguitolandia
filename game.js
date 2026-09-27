const menu = document.getElementById("menu");
const gameScreen = document.getElementById("gameScreen");
const gameOver = document.getElementById("gameOver");

const playButton = document.getElementById("playButton");
const restartButton = document.getElementById("restartButton");
const jumpButton = document.getElementById("jumpButton");

const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");

const scoreText = document.getElementById("score");
const livesText = document.getElementById("lives");
const finalScore = document.getElementById("finalScore");

let playing = false;
let jumping = false;

let score = 0;
let lives = 3;

let obstacleX = 0;
let speed = 7;

let animation;
let scoreTimer;


/* =========================
   INICIAR
========================= */

function startGame() {

  menu.style.display = "none";

  gameOver.style.display = "none";

  gameScreen.style.display = "block";

  score = 0;

  lives = 3;

  speed = 7;

  jumping = false;

  playing = true;

  scoreText.textContent = score;

  livesText.textContent = lives;

  obstacleX = window.innerWidth + 150;

  obstacle.style.left = obstacleX + "px";

  player.style.bottom = "35%";

  clearInterval(scoreTimer);

  scoreTimer = setInterval(() => {

    if (!playing) return;

    score++;

    scoreText.textContent = score;

    /* Cada cierto tiempo aumenta la velocidad */

    if (score % 20 === 0) {
      speed += .5;
    }

  }, 500);

  cancelAnimationFrame(animation);

  animation = requestAnimationFrame(updateGame);
}


/* =========================
   BUCLE
========================= */

function updateGame() {

  if (!playing) return;

  obstacleX -= speed;

  obstacle.style.left = obstacleX + "px";


  /* Cuando sale de pantalla */

  if (obstacleX < -120) {

    obstacleX =
      window.innerWidth +
      100 +
      Math.random() * 400;
  }


  checkCollision();

  animation = requestAnimationFrame(updateGame);
}


/* =========================
   SALTO
========================= */

function jump() {

  if (!playing || jumping) return;

  jumping = true;

  player.style.bottom = "58%";


  setTimeout(() => {

    player.style.bottom = "35%";

  }, 350);


  setTimeout(() => {

    jumping = false;

  }, 700);
}


/* =========================
   COLISIÓN
========================= */

function checkCollision() {

  if (jumping) return;

  const p = player.getBoundingClientRect();

  const o = obstacle.getBoundingClientRect();


  const collision =
    p.right > o.left + 15 &&
    p.left < o.right - 15 &&
    p.bottom > o.top + 20 &&
    p.top < o.bottom;


  if (collision) {

    loseLife();

    obstacleX =
      window.innerWidth +
      250;
  }
}


/* =========================
   PERDER VIDA
========================= */

function loseLife() {

  lives--;

  livesText.textContent = lives;


  /* Pequeña animación */

  player.style.transform = "translateX(-8px)";

  setTimeout(() => {

    player.style.transform = "translateX(8px)";

  }, 70);

  setTimeout(() => {

    player.style.transform = "translateX(0)";

  }, 140);


  if (lives <= 0) {

    endGame();
  }
}


/* =========================
   GAME OVER
========================= */

function endGame() {

  playing = false;

  cancelAnimationFrame(animation);

  clearInterval(scoreTimer);

  finalScore.textContent = score;

  gameOver.style.display = "flex";
}


/* =========================
   CONTROLES
========================= */

playButton.addEventListener(
  "click",
  startGame
);

restartButton.addEventListener(
  "click",
  startGame
);

jumpButton.addEventListener(
  "click",
  jump
);


/* TOCAR PANTALLA */

document.addEventListener(
  "touchstart",
  function(event) {

    if (!playing) return;

    if (event.target === jumpButton) return;

    jump();

  }
);


/* TECLADO */

document.addEventListener(
  "keydown",
  function(event) {

    if (
      event.code === "Space" ||
      event.code === "ArrowUp"
    ) {

      jump();

    }

  }
);
