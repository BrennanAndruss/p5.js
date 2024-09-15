let backgroundColor = 20;

// BALL AND PLATFORM

let ballSpeed = 4;
let ballStartingX = 200;
let ballStartingY = 325;

const ball = {
  x: ballStartingX,
  y: ballStartingY,
  xSpeed: ballSpeed,
  ySpeed: ballSpeed,
  size: 15,

  drawBall() {
    noStroke();
    fill(255);
    circle(this.x, this.y, this.size);
  },

  ballMovement() {
    // Bounce ball off the edges of the screen
    if (this.x >= width - this.size) {
      this.xSpeed = ballSpeed * -1;
    } else if (this.x <= this.size) {
      this.xSpeed = ballSpeed;
    }

    if (this.y <= this.size) {
      this.ySpeed = ballSpeed;
    }

    // Update position
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }
}

let platformSpeed = 6;
let platformStartingX = 200;
let platformStartingY = 350;

const platform = {
  x: platformStartingX,
  y: platformStartingY,
  speed: platformSpeed,
  width: 40,
  height: 10,

  drawPlatform() {
    noStroke();
    fill(255);
    rectMode(CENTER);
    rect(this.x, this.y, this.width, this.height);
  },

  platformMovement() {
    // Move the platform based on player input
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
    }

    // Make sure the platform stays on screen
    if (this.x < this.width / 2) {
      this.x = this.width / 2;
    } else if (this.x > width - this.width / 2) {
      this.x = width - this.width / 2
    }
  }
}


// BOARD OF BRICKS

let brickHeight = 10;

const board = {
  columns: 12,
  brickBoard: [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []
  ],

  // Generate the board, creating 8 rows and 12 columns of bricks
  generateBoard() {
    let xCenter = width / this.columns / 2;
    let brickWidth = width / this.columns;
    for (let row = 0; row < this.brickBoard.length; row += 1) {
      for (let column = 0; column < this.columns; column += 1) {
        let xPos = xCenter + (brickWidth * column);
        let yPos = 55 + (brickHeight * row);
        let brickColor = assignColor(row);
        // Create each brick and add it to correct nested array
        brick = new Brick(xPos, yPos, brickColor);
        this.brickBoard[row].push(brick);
        this.brickBoard[row][column].determineColor(brickColor);
      }
    }
  },

  // Draw each brick on the canvas, using methods from the brick class
  drawBoard() {
    for (let row = 0; row < this.brickBoard.length; row += 1) {
      for (let column = 0; column < this.brickBoard[row].length; column += 1) {
        this.brickBoard[row][column].drawBrick();
      }
    }
  }
}

// Helper function for generating the board
function assignColor(row) {
  if (row < 2) {
    return 'red';
  } else if (row < 4) {
    return 'orange';
  } else if (row < 6) {
    return 'yellow';
  } else if (row < 8) {
    return 'green';
  }
}


// BRICK CLASS

class Brick {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.width = width / board.columns;
    this.height = brickHeight;
    this.points = 0;
    this.r = 0;
    this.g = 0;
    this.b = 0;
  }

  determineColor(color) {
    // Based on color, set the point and RGB values
    switch (color) {
      case 'red':
        this.points = 7;
        this.r = 255;
        this.g = 0;
        this.b = 0;
        break;

      case 'orange':
        this.points = 5;
        this.r = 255;
        this.g = 165;
        this.b = 15;
        break;

      case 'yellow':
        this.points = 3;
        this.r = 255;
        this.g = 255;
        this.b = 0;
        break;

      case 'green':
        this.points = 1;
        this.r = 0;
        this.g += 255;
        this.b = 0;
        break;

      default:
        break;
    }
  }

  // Draw brick on the canvas
  drawBrick() {
    stroke(backgroundColor);
    strokeWeight(2)
    fill(this.r, this.g, this.b);
    rectMode(CENTER);
    rect(this.x, this.y, this.width, this.height);
  }
}


// COLLISIONS AND SCORE

let score = 0;
let highScore = 0;

function determineHighScore() {
  if (score > highScore) {
    highScore = score;
  }
}

// Show score

function showScore() {
  // Score
  textSize(25);
  textAlign(LEFT);
  fill(255)
  text(score, 10, 25);
  // Best score
  textSize(15);
  textAlign(RIGHT);
  text(`High score: ${highScore}`, 390, 20);
}

leniency = 2.5;

// If the ball collides with the platform, bounce it up
function bounce() {
  // Check for collision
  if (platform.y - ball.y <= ball.size && platform.y - ball.y > 0) {
    if (abs(ball.x - platform.x) <= (platform.width / 2) + leniency) {
      ball.ySpeed = ballSpeed * -1;

      // If the ball is on the left side of the platform, bounce it left
      if (ball.x - platform.x <= 0) {
        ball.xSpeed = ballSpeed * -1;
      }
      // If the ball is on the right side of the platform, bounce it right
      else if (ball.x - platform.x > 0) {
        ball.xSpeed = ballSpeed;
      }
    }
  }
}

// If the ball collides with a brick, bounce it down, destroy the brick, and add to the score

function destroyAboveBelow() {
  // Check each brick to see if the ball collides with it
  for (let row = 0; row < board.brickBoard.length; row += 1) {
    for (let column = 0; column < board.brickBoard[row].length; column += 1) {
      // Check for a collision from above or below
      if (abs(ball.y - board.brickBoard[row][column].y) <= ball.size) {
        if (abs(ball.x - board.brickBoard[row][column].x) <= board.brickBoard[row][column].width / 2) {
          ball.ySpeed *= -1;
          score += board.brickBoard[row][column].points;
          board.brickBoard[row].splice(column, 1);
        }
      }
    }
  }
}

function destroySides() {
  // Check each brick to see if the ball collides with it
  for (let row = 0; row < board.brickBoard.length; row += 1) {
    for (let column = 0; column < board.brickBoard[row].length; column += 1) {
      // Check for a collision from the right
      if (ball.xSpeed === ballSpeed * -1) {
        if (abs(ball.x - (board.brickBoard[row][column].x + board.brickBoard[row][column].width / 2)) <= ball.size) {
          if (abs(ball.y - board.brickBoard[row][column].y) <= board.brickBoard[row][column].height / 2) {
            ball.xSpeed *= -1;
            score += board.brickBoard[row][column].points;
            board.brickBoard[row].splice(column, 1);
          }
        }
      } else if (ball.xSpeed === ballSpeed) {
        if (abs(ball.x - (board.brickBoard[row][column].x - board.brickBoard[row][column].width / 2)) <= ball.size) {
          if (abs(ball.y - board.brickBoard[row][column].y) <= board.brickBoard[row][column].height / 2) {
            ball.xSpeed *= -1;
            score += board.brickBoard[row][column].points;
            board.brickBoard[row].splice(column, 1);
          }
        }
      }
    }
  }
}


// START, END, AND RESTART GAME

let isGameActive = true;
let isGameStarted = false;


// Starting the game
function startScreen() {
  textSize(25);
  textAlign(CENTER);
  fill(255)
  text('Press Enter to Start', width/2, height/2);
}

function start() {
  if (keyIsDown(ENTER)) {
    isGameStarted = true;
  }
}

// Ending the game

maxScore = 384;

function endScreen(maxScore) {
  textSize(25);
  textAlign(CENTER);
  fill(255)
  // Check to see if the player won
  if (score === maxScore) {
    text('You Win!', width/2, height/2);
  }
  else {
    text('Game Over', width/2, height/2);
  }
}

// Win and loss conditions

function lose() {
  if (ball.y >= height - ball.size) {
    isGameActive = false;
  }
}

function win(maxScore) {
  if (score === maxScore) {
    isGameActive = false;
  }
}

// Restarting the game

function restart() {
  if (keyIsDown(ENTER)) {
    restartGame();    
    isGameActive = true;
  }
}

function restartGame() {
  // Regenerate the board
  for (let row = 0; row < board.brickBoard.length; row += 1) {
    board.brickBoard[row].splice(0)
  }
  board.generateBoard();
  
  // Return everything to its starting position
  ball.x = ballStartingX;
  ball.y = ballStartingY;
  ball.xSpeed = ballSpeed;
  ball.ySpeed = ballSpeed;
  platform.x = platformStartingX;
  platform.y = platformStartingY;
  
  // Reset the score
  score = 0;
}

function restartScreen() {
  textSize(15);
  textAlign(CENTER);
  fill(255)
  text('Press Enter to Restart', width/2, height/2 + 25);
}

// SET UP AND RUN PROGRAM

function setup() {
  createCanvas(400, 400);
  // Generate the board
  board.generateBoard();
  
}

function draw() {
  background(backgroundColor);
  
  // Starting the game
  if (isGameStarted === false) {
    startScreen();
    start();
  }
  
  // Restarting the game
  if (isGameActive === false) {
    restartScreen();
    restart();
  }
  
  // Show the score
  determineHighScore();
  showScore();

  // Draw the bricks
  board.drawBoard();

  // Draw the platform
  if (isGameStarted === true && isGameActive === true) {
    platform.platformMovement();
  }
  platform.drawPlatform();

  // Check for Collisions
  bounce();
  destroyAboveBelow();
  destroySides();

  // Draw the ball
  if (isGameStarted === true) {
    ball.ballMovement();
  }
  ball.drawBall();
  
  // Check to see if the game has ended
  win(maxScore);
  lose();
  if (isGameActive === false) {
    endScreen(maxScore);
  }
}