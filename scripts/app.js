
function init() {

  // ! Creating the Grid

  const mainWidth = 10
  const mainHeight = 20
  const nextWidth = 4
  const nextHeight = 3
  const mainCellCount = mainWidth * mainHeight
  const mainCells = []
  const nextCellCount = nextWidth * nextHeight
  const nextCells = []
  const mainGrid = document.querySelector('#main-grid')
  const nextGrid = document.querySelector('#next-grid')

  function createGrid(grid, cellCount, cellArray) {
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('div')
      cell.innerHTML = i
      grid.appendChild(cell)
      cell.dataset.index = i
      cellArray.push(cell)
    }
  }

  // ! Game Functionality

  const startButton = document.querySelector('#start')
  startButton.addEventListener('click', gameStart)
  window.addEventListener('keydown', handleKeyDown)

  const highScore = document.querySelector('#highscore')
  let gameOn = false
  let playerScore = document.querySelector('#score')
  let playerLevel = document.querySelector('#level')
  let playerLines = document.querySelector('#lines')
  let currentShape = null
  let nextShape = null
  let intervalSpeed = 250
  let timeoutInterval


  class Tetromino {
    constructor(startingPosition, shape) {
      this.currentPosition = startingPosition,
      this.startingPosition = startingPosition,
      this.active = shape + '-active',
      this.inactive = shape + '-paused',
      this.nextPosition = []
    }
  }

  const tetrominoO = new Tetromino([4, 5, 14, 15],'o')
  const tetrominoL = new Tetromino([4, 14, 24, 25], 'l')
  const tetrominoJ = new Tetromino([5, 15, 24, 25], 'j')
  const tetrominoT = new Tetromino([4, 13, 14, 15], 't')
  const tetrominoZ = new Tetromino([3, 4, 14, 15], 'z')
  const tetrominoS = new Tetromino([4, 5, 13, 14], 's')
  const tetrominoI = new Tetromino([3, 4, 5, 6], 'i')
  const allTetrominos = [tetrominoO, tetrominoL, tetrominoJ, tetrominoT, tetrominoZ, tetrominoS, tetrominoI]

  function gameStart() {
    gameOn = true
    // startButton.disabled = true
    // releaseTetromino()
    setTimeout(releaseTetromino, intervalSpeed)
  }
  
  function removeTetromino() {
    currentShape.currentPosition.forEach(index => {
      mainCells[index].classList.remove(currentShape.active)
    })
  }

  function addTetromino() {
    currentShape.currentPosition.forEach(index => {
      mainCells[index].classList.add(currentShape.active)
    })
  }

  function deactivateTetromino(currentPosition) {
    currentPosition.forEach(index => {
      mainCells[index].classList.add(currentShape.inactive)
      mainCells[index].classList.remove(currentShape.active)
    })
  }

  function releaseTetromino() {

    // Check for active shape
    if (mainCells.some(cell => cell.className.includes('active'))) {
      // check if at bottom of grid OR if next spot contains a shape
      if (currentShape.nextPosition.some(index => index >= mainCellCount) || currentShape.nextPosition.some(index => mainCells[index].className.includes('paused'))) {
        removeTetromino()
        deactivateTetromino(currentShape.currentPosition)
        currentShape = nextShape
        console.log('reach bottom/other shape')
      } else { // if both conditions above are false, lower shape by one row
        removeTetromino()
        currentShape.currentPosition = currentShape.nextPosition
        addTetromino()
        currentShape.nextPosition = currentShape.currentPosition.map(index => index + mainWidth)
        console.log('lowered by one row')
      }
      timeoutInterval = setTimeout(releaseTetromino, intervalSpeed)
    } else { // if no active cells
      console.log('releaseTetromino does not include active')
      nextShape === null ? currentShape = allTetrominos[Math.floor((Math.random() * 7))] : currentShape = nextShape
      if (nextShape !== null) {
        removeNext()
      }
      nextShape = allTetrominos[Math.floor((Math.random() * 7))]
      nextShape.currentPosition = nextShape.startingPosition
      console.log(currentShape, nextShape)
      previewNext()
      if (nextShape.currentPosition.some(index => mainCells[index].className.includes('inactive'))) {
        console.log('no room for new shape! end of game')
        window.alert('Game over!')
        nextShape = ''
      }
      addTetromino()
      currentShape.nextPosition = currentShape.currentPosition.map(index => index + mainWidth)
      timeoutInterval = setTimeout(releaseTetromino, intervalSpeed)
      console.log('no active cells, shape dropped')
    }
  }

  // Interval: checks if there is an active shape in the grid,
  //   * if no (ex. start of game), drop a shape at top. Shapes always start at the same positions, so we can 
  //    * if yes, check if shape is touching another shape or if shape has reached the bottom of the screen OR if there is a shape in the first row of the grid
  //       * if touching another shape/reached bottom, leave the shape and start dropping another shape
  //        if there is a shape currently in first row, end the game
  //      *  if no to both, remove current shape then return it one row lower
    
  function previewNext() {
    const adjustedTetro = nextShape.startingPosition.map(index => {
      if (index > 20) {
        return index -= 15
      } else if (index > 10) {
        return index -= 9
      } else {
        return index -= 3
      }
    })
    adjustedTetro.forEach(index => nextCells[index].classList.add(nextShape.active))
    console.log('preview next shape fired')
  }

  function removeNext() {
    console.log('next shape removed')
    nextCells.forEach(index => index.classList.remove(nextShape.active))
  }

  function handleKeyDown(event) {
    if (mainCells.some(cell => cell.className.includes('active'))) {
      if (event.code === 'ArrowUp') {
        rotateTetromino()
      } else if (event.code === 'ArrowDown' || event.code === 'ArrowRight' || event.code === 'ArrowLeft') {
        moveTetromino(event.code)
      }
    }
  }

  function rotateTetromino() {
    console.log('rotate')
  }

  function moveTetromino(arrowDirection) {
    let shifted
    if (currentShape.nextPosition.every(index => index < mainCellCount)) {
      removeTetromino()
      if (arrowDirection === 'ArrowDown') {
        shifted = currentShape.currentPosition.map(index => index + mainWidth)
        if (!shifted.some(index => mainCells[index].className.includes('paused'))) {
          currentShape.currentPosition = currentShape.nextPosition
        }
        console.log('moved down')
      }
      if (arrowDirection === 'ArrowRight' && !currentShape.currentPosition.some(index => (index % mainWidth) === 9)) {
        shifted = currentShape.currentPosition.map(index => index + 1)
        if (!shifted.some(index => mainCells[index].className.includes('paused'))) {
          currentShape.currentPosition = currentShape.currentPosition.map(index => index + 1)
        }
        console.log('moved right')
      }
      if (arrowDirection === 'ArrowLeft' && !currentShape.currentPosition.some(index => (index % mainWidth) === 0)) {
        shifted = currentShape.currentPosition.map(index => index - 1)
        if (!shifted.some(index => mainCells[index].className.includes('paused'))) {
          currentShape.currentPosition = currentShape.currentPosition.map(index => index - 1)
        }
        console.log('moved left')
      }
      currentShape.nextPosition = currentShape.currentPosition.map(index => index + mainWidth)
      addTetromino()
    }
  }

  // ! Function Execution

  createGrid(mainGrid, mainCellCount, mainCells)
  createGrid(nextGrid, nextCellCount, nextCells)

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
//*    start button -> starts the game
//    replay button -> replay the game

// keydown:
//*    up -> rotate element via roateElement function
//*    left -> move shape to left
//*    right -> move shape to right
//*    down -> move shape down one line

// ? Extra Features - if there's time
// play sound effect when a line is cleared
// sound effect when player levels up/speed increases
// play/pause background music button
// column shading indicating where the shape will drop
// save a shape that can be swapped with current shape later (probably no time??)



window.addEventListener('DOMContentLoaded', init)
