const rulesBtn = document.getElementById('rules-btn')
const closeBtn = document.getElementById('close-btn')
const rules = document.getElementById('rules')
const canvas = document.getElementById('canvas')
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d')

let score = 0;

const brickRowCount = 9;
const brickColCount = 6;


// NOTE Create ball properties

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2 + 20,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
}

// NOTE Create paddle properties

const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 30,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0
}

// NOTE Create brick properties

const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true
}

// NOTE Create bricks

const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

// NOTE Draw ball to canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = '#1d2d44';
  ctx.fill();
  ctx.closePath();
}

// NOTE Draw paddle to canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = '#1d2d44';
  ctx.fill();
  ctx.closePath();
}

// NOTE Draw bricks on canvas
function drawBricks() {
  bricks.forEach(column => {
    column.forEach(brick => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? '#1d2d44' : 'transparent';
      ctx.fill();
      ctx.closePath;
    })
  })
}
// NOTE Draw score

function drawScore() {
  ctx.font = '20px Ubuntu';
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 35)
}

// NOTE Move paddle on canvas
function movePaddle() {
  paddle.x += paddle.dx;

  // Wall detection
  // Right wall
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }
  // Left wall
  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

// NOTE Move ball on canvas
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision detection
  // x-axis/right and left walls
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }
  // y-axis/top and bottom walls
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  // Paddle collision detection
  if (ball.x - ball.size > paddle.x && ball.x + ball.size < paddle.x + paddle.w && ball.y + ball.size > paddle.y) {
    ball.dy = -ball.speed;
  }

  // Brick collision detection
  bricks.forEach(column => {
    column.forEach(brick => {
      if (brick.visible) {
        if (ball.x - ball.size > brick.x && // Left side of brick collision check
          ball.x + ball.size < brick.x + brick.w && // Right side of brick collision check
          ball.y + ball.size > brick.y && // Top of brick collision check
          ball.y - ball.size < brick.y + brick.h) { // Bottom of brick collision check
          ball.dy *= -1;
          brick.visible = false;
          increaseScore();
        }
      }
    })
  })

  // Hitting bottom wall triggers a game over
  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }
}

// NOTE Increase score
function increaseScore() {
  score++;
  if (score % (brickRowCount * brickRowCount) === 0) {
    showAllBricks();
  }
}

// NOTE Show all bricks
function showAllBricks() {
  bricks.forEach(column => {
    column.forEach(brick => {
      brick.visible = true;
    })
  })
}
// NOTE Draw everything to canvas
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall()
  drawPaddle()
  drawScore()
  drawBricks();
}

// NOTE Update canvas drawing and animation
function update() {
  movePaddle();
  moveBall();

  // Draw everything to canvas
  draw();

  requestAnimationFrame(update);
}
update();

// NOTE Keydown/keyup events
function keyDown(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    paddle.dx = paddle.speed;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    paddle.dx = -paddle.speed;
  }
}

function keyUp(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft') {
    paddle.dx = 0;
  }
}


// NOTE Keyboard event listeners

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// NOTE Rules show/hide event listeners

rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));