
function init() {

  const mainWidth = 10
  const mainHeight = 20
  const nextWidth = 4
  const nextHeight = 3
  const mainCellCount = mainWidth * mainHeight
  const mainCells = []
  const nextCellCount = nextWidth * nextHeight
  const nextCells = []

  function createGrid(grid, cellCount, cellArray) {
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('div')
      cell.innerHTML = i
      grid.appendChild(cell)
      cell.dataset.index = i
      cellArray.push(cell)
    }
    console.log('grid-created')
  }

  function handleKeyDown(event) {
    if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
      moveHorizontal()
    }
    if (event.code === 'ArrowUp') {
      rotateTetromino()
    }
    if (event.code === 'ArrowDown') {
      moveDown()
    }
  }

  function rotateTetromino() {
    console.log('rotate')
  }

  function moveHorizontal() {
    console.log('move')
  }

  function moveDown() {
    console.log('move down')
  }

  class Tetromino {
    constructor(startPosition, color) {
      this.startPosition = startPosition,
      this.color = color
    }
  }

  const tetriminoO = new Tetromino([4, 5, 14, 15], 'red')
  const tetriminoL = new Tetromino([4, 14, 24, 25], 'red')
  const tetriminoJ = new Tetromino([5, 15, 24, 25], 'red')
  const tetriminoT = new Tetromino([4, 13, 14, 15], 'red')
  const tetriminoZ = new Tetromino([3, 4, 14, 15], 'red')
  const tetriminoS = new Tetromino([4, 5, 13, 14], 'red')
  const tetriminoI = new Tetromino([3, 4, 5, 6], 'red')




  const mainGrid = document.querySelector('#main-grid')
  const nextGrid = document.querySelector('#next-grid')
  const highScore = document.querySelector('#highscore')
  let playerScore = document.querySelector('#score')
  let playerLevel = document.querySelector('#level')
  let playerLines = document.querySelector('#lines')
  let currentShape
  let nextShape
  let intervalSpeed = 2000
  let movementX
  let movementY

  createGrid(mainGrid, mainCellCount, mainCells)
  createGrid(nextGrid, nextCellCount, nextCells)

  window.addEventListener('keydown', handleKeyDown)

}

// TODO: Notes
// When the user clicks start, an interval needs to begin running to start dropping shapes in the grid. Shapes will drop from the top center
// In order to do that, we need to randomly pick a shape, then we need it to drop down line by line every few seconds
// User should be able to move it side by side (w/ left + right keys) or speed the drop down (w/ down key).
// User should also be able to rotate the shape as it falls down, but shape needs to be able to remain in the grid and also continue falling from the last position
// Once a shape hits the bottom or touches a placed shape, we need a new shape to drop down
// When the bottom line is fully filled, we need it to clear the row and move all grid items down one row, also increasing points and lines completed
// after a certain score or lines complete is reached, we can increase the level and increase the speed of the interval
// If the player is too slow and the shapes reach the top, the game should automatically end


// TODO: Variables
//* playerScore - tracks score of user
//* playerLevel - tracks level of user
//* playerLines - tracks # of completed lines
//* highScore - tracks highest local score
//* width - width of grid (10)
//* height - height of grid (20)
//* currentShape - current tetrimino shape
//* nextShape - next tetrimino shape
//* intervalSpeed - speed of shape drop, decreasing as user levels up
//* movementY = how many rows we've moved downwards
//* movementX = how many columsn we've moved left or right

// Elements
//* tetrisGrid = querySelect the grid div so we can make the grid


// TODO: Functions

// Interval: checks if there is an active shape in the grid,
//    if no (ex. start of game), drop a shape at top. Shapes always start at the same positions, so we can 
//    if yes, check if shape is touching another shape or if shape has reached the bottom of the screen OR if there is a shape in the first row of the grid
//        if touching another shape/reached bottom, leave the shape and start dropping another shape
//        if there is a shape currently in first row, end the game
//        if no to both, remove current shape then return it one row lower


// generateShape:
//    random number to pick a tetrimino shape for current and next shape

// moveShape:
//    if right arrow, moves shape right 1, if left arrow clicked, moves shape left 1. if down arrow clicked, moves shape down 1

// rotateElement:
//    needs to rotate shape 90deg clockwise....
//    removes current shape and replaces it with rotated shape (will have set dimensions, which will add vertical movement and add/minus horizontal movement)

// clearLine:
//    when a line is completely filled, remove line and shift all elements above it down

// gameOver:
//    when blocks reach the top and there's no space left, end the game


// TODO: Events
// click:
//    start button -> starts the game
//    replay button -> replay the game

// keydown:
//    up -> rotate element via roateElement function
//    left -> move shape to left
//    right -> move shape to right
//    down -> move shape down one line

// ? Extra Features - if there's time
// play sound effect when a line is cleared
// sound effect when player levels up/speed increases
// play/pause background music button
// column shading indicating where the shape will drop
// save a shape that can be swapped with current shape later (probably no time??)



window.addEventListener('DOMContentLoaded', init)
