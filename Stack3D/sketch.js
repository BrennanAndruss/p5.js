/*
CANVAS AND COORDINATE SYSTEM VARIABLES
*/

const cw = 400;
const ch = 400;
const bg = 10;
const originX = ch/2;
const originY = ch/3;
const conversionX = 0.5 * 1.4;
const conversionY = 0.5;


/*
STACK CLASS
*/

let stack;
const maxBlocks = 16; // reduce unneccesary lag
const numColors = 45;
const startSize = 150;

class Stack {
  constructor() {
    this.blocks = [];
    this.curr = null;
    this.prev = null;
    this.nextAxis = random([-1, 1]);
    this.nextDisX = 0;
    this.nextDisY = 0;
    this.nextHue = 0;
    this.nextSx = startSize;
    this.nextSy = startSize;
  }
  
  draw() {
    for (let i = 0; i < this.blocks.length; i++) {
      this.blocks[i].draw();
    }
  }
  
  move() {
    this.blocks[this.blocks.length - 1].move();
  }
  
  placeBlock() {
    // Move each block down
    for (let i = 0; i < this.blocks.length; i++) {
      this.blocks[i].depth++;
    }
    
    // Save properties of previous and current block
    this.prev = this.curr;
    this.curr = this.blocks[this.blocks.length - 1]
    
    if (this.prev != null) {
      // X-axis movement
      if (this.curr.axis == -1) {
        // Check for overlap on the top left
        if (this.curr.disX < this.prev.disX) { 
          this.curr.sx -= (this.prev.disX - this.curr.disX);
          this.curr.disX = this.prev.disX; // fix me
        }
        // Check for overlap on the bottom right
        else if (this.curr.x1 > this.prev.x1) {
          this.curr.sx -= (this.curr.disX - this.prev.disX);
        }
        this.nextSx = this.curr.sx;
        
      // Y-axis movement
      } else {
        // Check for overlap on the top right
        if (this.curr.disY > this.prev.disY) {
          this.curr.sy -= (this.curr.disY - this.prev.disY);
          this.curr.disY = this.prev.disY;
        }
        // Check for overlap on the bottom left
        else if (this.curr.disY < this.prev.disY) {
          this.curr.sy -= (this.prev.disY - this.curr.disY);
        }
        this.nextSy = this.curr.sy;
      }
      
      // Check if placement was successful
      if (this.curr.sx <= 0 || this.curr.sy <= 0) {
        // End game if there was no overlap
        game.gameOver = true;
        console.log("GAME OVER");
        this.blocks.splice(this.blocks.length - 1, 1)
      }
      
      else {
        // Add score for successful placement
        game.score++;
        
        // Set properties of new block
        this.nextHue = (this.nextHue + 360/numColors) % 360;
        this.nextAxis *= -1;
        if (this.nextAxis == -1) {
          this.nextDisX = 100 * random([-1, 1]);
          this.nextDisY = this.curr.disY;
        }
        else {
          this.nextDisX = this.curr.disX;
          this.nextDisY = 100 * random([-1, 1]);
        }
        // Add new block to stack
        this.addBlock();
      }
    }
  }
  
  // IDEA: add the block params as params for the function
  addBlock() {
    // Add new block to stack
    let block = new Block (this.nextAxis, this.nextDisX, this.nextDisY, this.nextSx, this.nextSy, this.nextHue);
    this.blocks.push(block);
    
    // Remove blocks as they go offscreen
    if (this.blocks.length > maxBlocks) {
      this.blocks.splice(0, 1);
    }
  }
}


/*
BLOCK CLASS
*/

const blockHeight = 15;
const blockSpeed = 3;

class Block {
  // constructor(axis, disX, disY, sx, sy, h)
  constructor(axis, disX, disY, sx, sy, h) {
    // Axis of movement (-1 = x, 1 = y)
    this.axis = axis;
    // Distance of top coordinate from origin
    this.disX = disX;
    this.disY = disY;
    this.speed = blockSpeed;
    // Size of block in each axis
    this.sx = sx;
    this.sy = sy;
    this.sz = blockHeight;
    this.hue = h;
    // Coordinates for drawing
    // Order: top vertex, left vertex, bottom vertex, right vertex
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.x3 = 0;
    this.y3 = 0;
    this.x4 = 0;
    this.y4 = 0;
    // Depth: layers from top of the stack
    this.depth = 0;
  }
  
  draw() {
    noStroke();
    
    // Set coordinates of top face
    this.convertDis();  
    
    // Quad order: top vertex, left vertex, bottom vertex, right vertex
    // Top face
    fill(this.hue, 100, 100);
    quad(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3, this.x4, this.y4);
    
    // Left face
    fill(this.hue, 85, 75);
    quad(this.x2, this.y2, this.x2, this.y2 + this.sz, this.x3, this.y3 + this.sz, this.x3, this.y3);
    
    // Right face
    fill(this.hue, 70, 50);
    quad(this.x4, this.y4, this.x3, this.y3, this.x3, this.y3 + this.sz, this.x4, this.y4 + this.sz);
  }
  
  convertDis() {
    // Set coordinates of top point
    // Moving on x-axis
    if (this.axis == -1) {
      this.x1 = originX + this.disX * conversionX + this.disY * conversionX;
      this.y1 = originY + this.disX * conversionY - this.disY * conversionY + this.sz * (this.depth - 1);
    }
    
    // Moving on y-axis
    else {
      this.x1 = originX + this.disY * conversionX + this.disX * conversionX;
      this.y1 = originY - this.disY * conversionY + this.disX * conversionY + this.sz * (this.depth - 1);
    }
    
    // Set remaining coordinates based on top point
    this.x2 = this.x1 - this.sy * conversionX;
    this.y2 = this.y1 + this.sy * conversionY;
    this.x3 = this.x1 - this.sy * conversionX + this.sx * conversionX;
    this.y3 = this.y1 + this.sy * conversionY + this.sx * conversionY;
    this.x4 = this.x1 + this.sx * conversionX;
    this.y4 = this.y1 + this.sx * conversionY;
  }
  
  move() {
    // IDEA: bounce at certain distance from edge of block or at edge of screen no matter the size
    // Move along x-axis
    if (this.axis == -1) {
      this.disX += this.speed;
      if (this.disX < -100 || this.disX > 100) {
        this.speed *= -1;
      }
    } 
    // Move along y-axis
    else {
      this.disY += this.speed;
      if (this.disY > 100 || this.disY < -100) {
        this.speed *= -1;
      }
    }
  }
}


/*
CONTROLS
*/

function keyPressed() {
  if (keyCode == 32 && /*gameStarted &&*/ !game.gameOver) {
    stack.placeBlock();
  }
  
  // variable testing
  /*
  if (keyCode == 17) {
    console.log(stack.blocks[stack.blocks.length - 1].disX);
    console.log(stack.blocks[stack.blocks.length - 1].disY);
  }
  */
}


/*
GAME CLASS
*/

class Game {
  constructor() {
    this.gameOver = false;
    this.stack = null;
    this.score = 0;
    this.highScore = 0;
  }
  
  newGame() {
    // Create and set up a new stack
    this.stack = new Stack();
    this.stack.addBlock();
    this.stack.placeBlock();
    this.stack.nextHue = 360/numColors; // hard coded bug fix
    this.stack.addBlock();
    
    this.gameOver = false;
  }
  
  setHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
  }
  
  showScore() {
    fill (255);
    textSize(25);
    
    // Current score
    textAlign(LEFT);
    text(this.score, 10, 25);
    
    // High score
    textAlign(RIGHT);
    text("HI " + this.highScore, cw - 10, 25);
  }
  
  showEndScreen() {
    fill (255);
    textSize(25);
    textAlign(CENTER);
    
    // Game over message
    
    // Start over message
  }
}


/*
TITLE SCREEN
*/

let gameStarted = false;

function showStartScreen() {
  
}

// onclick function to start the game
let game = new Game();

/*
SETUP AND RUN GAME
*/

function setup() {
  createCanvas(cw, ch);
  colorMode(HSB);
  
  // Set up the stack
  stack = new Stack();
  stack.addBlock();
  stack.placeBlock();
  stack.nextHue = 360/numColors; // hard code fix for bug lol
  stack.addBlock();
  
  gameOver = false;
}

function draw() {
  background(bg);
  
  // Score
  game.setHighScore();
  game.showScore();
  
  // Stack
  if (!game.gameOver) {
    stack.move();
  }
  stack.draw();
  
  // Start and end screens
  if (!gameStarted) {
    showStartScreen();
  }
}