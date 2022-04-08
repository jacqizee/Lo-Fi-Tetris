
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
  let intervalSpeed = 500
  let movementX
  let movementY


  class Tetromino {
    constructor(currentPosition, color) {
      this.currentPosition = currentPosition,
      this.color = color + '-active',
      this.inactiveColor = color + '-inactive',
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
    releaseTetromino()
    // setTimeout(releaseTetromino(), intervalSpeed)
  }
  
  function removeTetromino(status) {
    currentShape.currentPosition.forEach(index => {
      mainCells[index].classList.remove(currentShape.color)
      mainCells[index].classList.remove(status)
    })
  }

  function addTetromino(status) {
    currentShape.currentPosition.forEach(index => {
      mainCells[index].classList.add(currentShape.color)
      mainCells[index].classList.add(status)
    })
  }

  function deactivateTetromino(currentPosition) {
    currentPosition.forEach(index => {
      mainCells[index].classList.add(currentShape.inactiveColor)
      mainCells[index].classList.remove(currentShape.activeColor)
    })
  }

  function releaseTetromino() {
    if (mainCells.some(cell => cell.className.includes('active'))) {
      const currentPosition = currentShape.currentPosition.map(index => index + mainWidth)
      const nextPosition = currentShape.currentPosition.map(index => index + (mainWidth * 2))
      console.log('current position', currentPosition, 'next position', nextPosition)
      if (nextPosition.some(index => index >= mainCellCount)) {
        removeTetromino('active')
        deactivateTetromino(currentPosition)
        console.log(currentPosition, 'reached bottom', mainCells)
      } else if (nextPosition.some(index => mainCells[index].className.includes('inactive'))) {
        deactivateTetromino()
        console.log('touching a shape')
      } else {
        removeTetromino('active')
        currentShape.currentPosition = currentPosition
        addTetromino('active')
        currentShape.nextPosition = nextPosition
        console.log('firing')
      }
    } else { // if no active cells
      if (nextShape === null) { // if no next shape aka start of game
        currentShape = allTetrominos[Math.floor((Math.random() * 7))]
      } else { // if yes next shape, make current shape the next shape and set new next shape
        removeNext()
        currentShape = nextShape
      }
      nextShape = allTetrominos[Math.floor((Math.random() * 7))]
      previewNext()
      addTetromino('active')
    }
  }

  // function releaseTetromino() {
  //   if (mainCells.some(cell => cell.className.includes('active'))) {
  //     const pendingPosition = currentShape.currentPosition.map(index => index + mainWidth)
  //     if (pendingPosition.some(item => item >= mainCellCount - mainWidth)) {
  //       addTetromino('inactive')
  //       console.log('pending', pendingPosition, 'current', currentShape.currentPosition, 'bottom reached', mainCells)
  //     }

  //     currentShape.nextPosition = pendingPosition // if active shape exists, map next position one row down
  //     removeTetromino('active')
  //     currentShape.currentPosition = currentShape.nextPosition
      
  //     setTimeout(releaseTetromino, intervalSpeed)
  //   } else {

  //     // check if currentShape exists, sets current/next shape
  //     nextShape === null ? currentShape = allTetrominos[Math.floor((Math.random() * 7))] : currentShape = nextShape
  //     nextShape = allTetrominos[Math.floor((Math.random() * 7))]
      
  //     removeNext()
  //     previewNext()
  //   }
  //   addTetromino('active')
  // }


        // if next position is at bottom {
      //   remove current shape, add next shape but with inactive
      //   remove active class, add inactive class
      // } if next position is overlapping an inactive shape {
      //     remove active class, add inactive class
      //   } 
        
      // } 
    // Interval: checks if there is an active shape in the grid,
  //   * if no (ex. start of game), drop a shape at top. Shapes always start at the same positions, so we can 
  //    if yes, check if shape is touching another shape or if shape has reached the bottom of the screen OR if there is a shape in the first row of the grid
  //        if touching another shape/reached bottom, leave the shape and start dropping another shape
  //        if there is a shape currently in first row, end the game
  //        if no to both, remove current shape then return it one row lower
    
  function previewNext() {
    nextShape.currentPosition.forEach(index => {
      if (index > 20) {
        index -= 15
      } else if (index > 10) {
        index -= 9
      } else {
        index -= 3
      }
      nextCells[index].classList.add(nextShape.color)
    })
  }

  function removeNext() {
    if (nextShape !== null) {
      nextShape.currentPosition.forEach(index => {
        if (index > 20) {
          index -= 15
        } else if (index > 10) {
          index -= 9
        } else {
          index -= 3
        }
        nextCells[index].classList.remove(nextShape.color)
      })
    }
  }


  function handleKeyDown(event) {
    if (event.code === 'ArrowUp') {
      rotateTetromino()
    } else if (event.code === 'ArrowDown' || event.code === 'ArrowRight' || event.code === 'ArrowLeft') {
      moveTetromino(event.code)
    }
  }

  function rotateTetromino() {
    console.log('rotate')
  }

  function moveTetromino(arrowDirection) {
    console.log('current position:', currentShape.currentPosition)
    console.log('next position:', currentShape.nextPosition)
    removeTetromino('active')
    if (arrowDirection === 'ArrowRight' && !currentShape.currentPosition.some(index => (index % mainWidth) === 9)) {
      currentShape.currentPosition = currentShape.currentPosition.map(index => index + 1)
    }
    if (arrowDirection === 'ArrowLeft' && !currentShape.currentPosition.some(index => (index % mainWidth) === 0)) {
      currentShape.currentPosition = currentShape.currentPosition.map(index => index - 1)
    }
    if (arrowDirection === 'ArrowDown' && currentShape.currentPosition.every(index => index < mainCellCount - mainWidth)) {
      currentShape.currentPosition = currentShape.currentPosition.map(index => index + 10)
    }
    addTetromino()
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
