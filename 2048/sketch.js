const cw = 500;
const ch = 575;
const s = 400; // Size of board
const lm = cw - s - 50; // Left margin
const tm = ch - s - 50; // Top margin
let u; // Placeholder for empty spaces


// BOARD

const game = {
  board: [
    [u, u, u, u],
    [u, u, u, u],
    [u, u, u, u],
    [u, u, u, u]
  ],
  score: 0,
  best: 0,
  gameOver: false,
  
  draw() {
    // Draw the UI
    fill(187, 173, 160);
    stroke(187, 173, 160);
    strokeWeight(10);
    rect(lm, tm - 100, s*2/5, 50, 5);
    rect(lm + s*3/5, tm - 100, s*2/5, 50, 5);
    
    fill(205, 193, 180);
    textAlign(CENTER);
    textSize(20);
    textStyle(NORMAL);
    text("SCORE", lm, tm - 95, s*2/5);
    text("BEST", lm + s*3/5, tm - 95, s*2/5);
    
    fill(255);
    textSize(30);
    textStyle(BOLD);
    text(this.score, lm, tm - 75, s*2/5);
    text(this.best, lm + s*3/5, tm - 75, s*2/5);
    
    // Draw the board
    fill(205, 193, 180);
    square(lm, tm, s, 5);
    
    // Draw the grid spaces
    noFill();
    stroke(187, 173, 160);
    strokeWeight(10);
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        square(c * s/4 + lm, r * s/4 + tm, s/4, 10);
      }
    }
    
    // Draw the tiles
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c]) {
          this.board[r][c].draw();
        }
      }
    }
  },
  
  moveLeft() {
    // Variable to set direction of iteration through columns
    let direction = 1;
    let validMove = false;
    
    // Start from second leftmost column, move left through columns
    for (let c = 1; c < 4; c += direction) {
      // Default direction is right
      direction = 1;
      for (let r = 0; r < 4; r++) {
        // Check if there is a tile at current space
        if (this.board[r][c]) {
          
          // Check for empty space to the left
          if (!this.board[r][c - 1]) {
            // Move tile
            this.createTile(r, c - 1, this.board[r][c].v);
            this.board[r][c] = u;
            // Switch direction
            if (c != 1) {
              direction = -1;
            }
            validMove = true;
          }
          
          // Check for a like tile to the left that has yet to merge
          else if (this.board[r][c - 1].v == this.board[r][c].v && this.board[r][c - 1].canMerge && this.board[r][c].canMerge) {
            // Move tile left and merge
            this.createTile(r, c - 1, this.board[r][c].v * 2);
            this.board[r][c] = u;
            // Set canMerge to false, add score, and switch direction
            this.board[r][c - 1].canMerge = false;
            this.score += this.board[r][c - 1].v;
            if (c != 1) {
              direction = -1;
            }
            validMove = true;
          }
        }
      }
    }
    
    // Create new tile on valid moves
    if (validMove) {
      this.createRandomTile();
      this.resetState();
      this.checkState();
    }
  },
  
  moveRight() {
    // Variable to set direction of iteration through columns
    let direction = -1;
    let validMove = false;
     
    // Start from second rightmost column, move right through columns
    for (let c = 2; c >= 0; c += direction) {
      // Default direction is left
      direction = -1;
      for (let r = 0; r < 4; r++) {
        // Check for a tile at current space
        if (this.board[r][c]) {
          
          // Check for empty space to the right
          if (!this.board[r][c + 1]) {
            // Move tile right
            this.createTile(r, c + 1, this.board[r][c].v);
            this.board[r][c] = u;
            // Switch direction
            if (c != 2) {
              direction = 1;
            }
            validMove = true;
          }
          
          // Check for a like tile to the right that has yet to merge
          else if (this.board[r][c + 1].v == this.board[r][c].v && this.board[r][c + 1].canMerge && this.board[r][c].canMerge) {
            // Move tile right and merge
            this.createTile(r, c + 1, this.board[r][c].v * 2);
            this.board[r][c] = u;
            // Set canMerge to false, add score, and switch direction
            this.board[r][c + 1].canMerge = false;
            this.score += this.board[r][c + 1].v;
            if (c != 2) {
              direction = 1;
            }
            validMove = true;
          }
        }
      }
    }
    // Create new tile on valid moves
    if (validMove) {
      this.createRandomTile();
      this.resetState();
      this.checkState();
    }
  },
  
  moveUp() {
    // Variable to set direction of iteration through rows
    let direction = 1;
    let validMove = false;
    
    // Start from second to top row, move down the rows
    for (let r = 1; r < 4; r += direction) {
      // Default direction is down
      direction = 1;
      for (let c = 0; c < 4; c++) {
        // Check for a tile at current space
        if (this.board[r][c]) {
          
          // Check for empty space above
          if (!this.board[r - 1][c]) {
            // Move tile up
            this.createTile(r - 1, c, this.board[r][c].v);
            this.board[r][c] = u;
            // Switch direction
            if (r != 1) {
              direction = -1;
            }
            validMove = true;
          }

          // Check for a like tile above that has yet to merge
          else if (this.board[r - 1][c].v == this.board[r][c].v && this.board[r - 1][c].canMerge && this.board[r][c].canMerge) {
            // Move tile up and merge
            this.createTile(r - 1, c, this.board[r][c].v * 2);
            this.board[r][c] = u;
            // Set canMerge to false, add score, and switch direction
            this.board[r - 1][c].canMerge = false;
            this.score += this.board[r - 1][c].v;
            if (r != 1) {
              direction = -1;
            }
            validMove = true;
          }
        }
      }
    }
    
    // Create new tile on valid moves
    if (validMove) {
      this.createRandomTile();
      this.resetState();
      this.checkState();
    }
  },
  
  moveDown() {
    // Variable to set direction of iteration through rows
    let validMove = false;
    let direction = -1;
    
    // Start from second to bottom row, move up the rows
    for (let r = 2; r >= 0; r += direction) {
      // Default direction is up
      direction = -1;
      for (let c = 0; c < 4; c++) {
        // Check if there is a tile at current space
        if (this.board[r][c]) {
          
          // Check for empty space below
          if (!this.board[r + 1][c]) {
            // Move tile down
            this.createTile(r + 1, c, this.board[r][c].v);
            this.board[r][c] = u;
            // Switch direction
            if (r != 2) {
              direction = 1;
            }
            validMove = true;
          }
          
          // Check for a like tile below that has yet to merge
          else if (this.board[r + 1][c].v == this.board[r][c].v && this.board[r + 1][c].canMerge && this.board[r][c].canMerge) {
            // Move tile down and merge
            this.createTile(r + 1, c, this.board[r][c].v * 2);
            this.board[r][c] = u;
            // Set canMerge to false, add score, and switch direction
            this.board[r + 1][c].canMerge = false;
            this.score += this.board[r + 1][c].v;
            if (r != 2) {
              direction = 1;
            }
            validMove = true;
          }
        }
      }
    }
    
    // Create new tile on valid moves
    if (validMove) {
      this.createRandomTile();
      this.resetState();
      this.checkState();
    }
  },
  
  createTile(r, c, v) {
    this.board[r][c] = new Tile(r, c, v);
  },
  
  createRandomTile() {
    while (true) {
      let v = random() < 0.9? 2 : 4;
      let r = random([0, 1, 2, 3]);
      let c = random([0, 1, 2, 3]);
      
      // Only place 
      if(!this.board[r][c]) {
        this.createTile(r, c, v);
        break;
      }
    }
  },
  
  checkState() {
    // Check for new best score
    if (this.score > this.best) {
      this.best = this.score;
    }
    
    // Check for any empty spaces or like tiles on sides
    for (let r = 0; r < 4; r++) {
      for (let c = 1; c < 4; c++) {
        if (!this.board[r][c - 1] || !this.board[r][c]) {
          return;
        }
        if (this.board[r][c - 1].v == this.board[r][c].v) {
          return;
        }
      }
    }
    
    // Check for any empty spaces or like tiles on the top and bottom
    for (let c = 0; c < 4; c++) {
      for (let r = 1; r < 4; r++) {
        if (!this.board[r - 1][c] || !this.board[r][c]) {
          return;
        }
        if (this.board[r - 1][c].v == this.board[r][c].v) {
          return;
        }
      }
    }
    
    // End game
    this.endGame();
  },
  
  resetState() {
    // Set canMerge to true on all tiles
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c]) {
          this.board[r][c].canMerge = true;
        }
      }
    }
  },
  
  endGame() {
    // Set gamestate and load end screen
    console.log("game over");
    console.log("enter to restart");
    this.gameOver = true;
  },
  
  newGame() {
    // Reset score
    this.score = 0;
    
    // Clear board
    this.board = [
      [u, u, u, u],
      [u, u, u, u],
      [u, u, u, u],
      [u, u, u, u]
    ];
    
    // Generate two random tiles
    this.createRandomTile();
    this.createRandomTile();
  }
}


// TILES

class Tile {
  constructor(r, c, v) {
    this.r = r;
    this.c = c;
    this.x = c * s/4 + lm;
    this.y = r * s/4 + tm;  
    this.v = v;    
    this.tc = 0;
    this.ts = 0;
    this.to = 0;
    this.col = this.setColor(v);
    this.canMerge = true;
    this.setText(v);
  }
  
  // Set corresponding tile color
  setColor(v) {  
    switch (v) {
      case 2:
        return [238,228,218];
        
      case 4:
        return [238,225,201];
      
      case 8:
        return [243, 178, 122];
      
      case 16:
        return [246, 150, 100];
        
      case 32:
        return [247, 124, 95];
        
      case 64:
        return [247, 95, 59];
        
      default:
        return [237, 208, 115];
    }
  }
  
  // Set text color, size, and offset
  setText(v) {
    if (v <= 4) {
      this.tc = 0;
    } else {
      this.tc = 255;
    }
    if (v < 1000) {
      this.ts = s/8;
      this.to = s/12;
    } else {
      this.ts = s/12;
      this.to = s/10;
    }
  }
  
  draw() {
    // Tile
    fill(this.col[0], this.col[1], this.col[2]);
    stroke(187, 173, 160);
    strokeWeight(10);
    square(this.x, this.y, s/4, 10);
    
    // Text
    fill(this.tc);
    noStroke();
    textAlign(CENTER);
    textSize(this.ts);
    textStyle(BOLD);
    text(this.v, this.x, this.y + this.to, s/4);
  }
}


// PLAYER CONTROLS

function keyPressed() {
  if (keyCode == RIGHT_ARROW) {
    game.moveRight();
  } else if (keyCode == LEFT_ARROW) {
    game.moveLeft();
  } else if (keyCode == UP_ARROW) {
    game.moveUp();
  } else if (keyCode == DOWN_ARROW) {
    game.moveDown();
  } 
  
  // test
  else if (keyCode == ENTER) {
    console.log("w");
    console.log(game.gameOver);
    if (game.gameOver) {
      game.newGame();
    }
  }
}


// SETUP AND RUN

function setup() {
  createCanvas(cw, ch);
  game.newGame();
}

function draw() {
  background(250, 248, 240);
  game.draw();
}