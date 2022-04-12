
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

  // ! Sound Effects

  const audioLineClear = new Audio('./media/clear-line.wav')
  const audioGameOver = new Audio('./media/game-over.wav')
  const audioLevelUp = new Audio('./media/level-up-1.wav')
  const audioNoMovement = new Audio('./media/no-movement.wav')
  const audioRotate = new Audio('./media/movement.wav')
  const audioMovement = new Audio('./media/rotateshape.wav')

  // ! Game Functionality

  const startButton = document.querySelector('#start')
  const pauseButton = document.querySelector('#pause')
  startButton.addEventListener('click', gameStart)
  pauseButton.addEventListener('click', gamePause)
  window.addEventListener('keydown', handleKeyDown)

  let highScore = document.querySelector('#highscore')
  let gameOn = false
  let gameOver = false
  let playerScore = 0
  let playerLevel = 0
  let playerLines = 0
  let currentShape = null
  let nextShape = null
  let intervalSpeed = 250
  let timeoutInterval
  let xChange = 0

  class Tetromino {
    constructor(startingPosition, shape, rotationArray = [3, 4, 5, 6]) {
      this.currentPosition = startingPosition,
      this.startingPosition = startingPosition,
      this.shape = shape,
      this.active = shape + '-active',
      this.inactive = shape + '-paused',
      // this.currentRotationPosition = [rotationArray,
      //   rotationArray.map(index => index + mainWidth),
      //   rotationArray.map(index => index + mainWidth * 2),
      //   rotationArray.map(index => index + mainWidth * 3)],
      // this.startingRotationPosition = this.currentRotationPosition,
      this.currentRotationPosition = [3, 4, 5, 6],
      this.startingRotationPosition = rotationArray,
      this.rotationState = 0,
      this.nextPosition = []
    }
  }

  const tetrominoO = new Tetromino([4, 5, 14, 15], 'o')
  const tetrominoL = new Tetromino([4, 14, 24, 25], 'l')
  const tetrominoJ = new Tetromino([5, 15, 24, 25], 'j')
  const tetrominoT = new Tetromino([4, 13, 14, 15], 't')
  const tetrominoZ = new Tetromino([4, 5, 15, 16], 'z')
  const tetrominoS = new Tetromino([4, 5, 13, 14], 's')
  const tetrominoI = new Tetromino([3, 4, 5, 6], 'i')
  const allTetrominos = [tetrominoO, tetrominoL, tetrominoJ, tetrominoT, tetrominoZ, tetrominoS, tetrominoI]
  console.log(allTetrominos)

  // ! Functions

  function gameStart() {
    gameOn = true
    startButton.disabled = true
    pauseButton.disabled = false
    setTimeout(releaseTetromino, intervalSpeed)
    if (gameOver === true) {
      mainCells.forEach(cell => cell.className = '')
      // clear player score, level, and lines
    }
  }

  function gamePause() {
    gameOn = false
    startButton.disabled = false
    pauseButton.disabled = true
    clearInterval(timeoutInterval)
  }
  
  function addTetromino() {
    currentShape.currentPosition.forEach(index => {
      mainCells[index].classList.add(currentShape.active)
    })
    currentShape.nextPosition = currentShape.currentPosition.map(index => index + mainWidth)
  }

  function deactivateTetromino(currentPosition) {
    currentPosition.forEach(index => {
      mainCells[index].classList.add(currentShape.inactive)
      mainCells[index].classList.remove(currentShape.active)
    })
  }

  function removeTetromino() {
    currentShape.currentPosition.forEach(index => {
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
        audioNoMovement.play()
        clearLine()
        currentShape = nextShape
        xChange = 0
      } else { // if both conditions above are false, lower shape by one row
        removeTetromino()
        currentShape.currentPosition = currentShape.nextPosition
        addTetromino()
      }
      timeoutInterval = setTimeout(releaseTetromino, intervalSpeed)
    } else { // if no active cells
      nextShape === null ? currentShape = allTetrominos[Math.floor((Math.random() * allTetrominos.length))] : currentShape = nextShape
      removeNext()
      nextShape = allTetrominos[Math.floor((Math.random() * allTetrominos.length))]
      // nextShape = allTetrominos[6]
      nextShape.currentPosition = nextShape.startingPosition
      previewNext()
      if (currentShape.startingPosition.some(index => mainCells[index].className.includes('paused'))) {
        audioGameOver.play()
        gamePause()
        gameOver = true
        window.alert('Game over!')
        currentShape.currentPosition.forEach(index => {
          mainCells[index].classList.add(currentShape.active)
        })
        return
      }
      addTetromino()
      timeoutInterval = setTimeout(releaseTetromino, intervalSpeed)
    }
  }

  function previewNext() {
    const indexForPreview = nextShape.startingPosition.map(index => {
      if (index > 20) {
        return index -= 15
      } else if (index > 10) {
        return index -= 9
      } else {
        return index -= 3
      }
    })
    indexForPreview.forEach(index => nextCells[index].classList.add(nextShape.active))
  }

  function removeNext() {
    if (nextShape !== null) {
      nextCells.forEach(index => index.classList.remove(nextShape.active))
    }
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
    audioRotate.play()
    let testArray = []
    const yChange = Math.floor(currentShape.currentPosition[0] / mainWidth)
    testArray.push(currentShape.startingRotationPosition.map(index => index + mainWidth + (yChange * mainWidth)),
      currentShape.startingRotationPosition.map(index => index + mainWidth * 2),
      currentShape.startingRotationPosition.map(index => index + mainWidth * 3),
      currentShape.startingRotationPosition.map(index => index + mainWidth * 4))
    console.log(testArray)
    
  }

  // function rotateTetromino() {
    // const yChange = Math.floor(currentShape.currentPosition[0] / mainWidth)
    // console.log('x change', xChange, 'y change', yChange, 'starting rotation position', currentShape.startingRotationPosition)
    // currentShape.currentRotationPosition = [currentShape.startingRotationPosition.map(index => index + (yChange * mainWidth) + xChange),
    //   currentShape.currentRotationPosition.map(index => index + mainWidth),
    //   currentShape.currentRotationPosition.map(index => index + mainWidth * 2),
    //   currentShape.currentRotationPosition.map(index => index + mainWidth * 3)]

    // console.log('y * width', yChange * mainWidth)
    // console.log('current rotation array', currentShape.currentRotationPosition)
    // console.log('rotate')

    // for (let i = 0; i < 4; i++) {
    //   currentShape.currentRotationPosition
    // }
    // currentShape.currentRotationPosition[0][0] += 3
    // currentShape.currentRotationPosition[0][1] += 12
    // currentShape.currentRotationPosition[0][2] += 21
    // currentShape.currentRotationPosition[0][3] += 30

    // if (currentShape.shape === 'i') {
    //   removeTetromino()
    //   if (currentShape.rotationState === 0) {
    //     for (let i = 1; i < 4; i++) {
    //       currentShape.currentPosition[i] = currentShape.currentPosition[i] + (mainWidth * i) - i
    //       currentShape.nextPosition[i] = currentShape.currentPosition[i] + (mainWidth * i) - i + mainWidth
    //     }
    //     currentShape.rotationState = 1
    //   } else if (currentShape.rotationState === 1) {
    //     for (let i = 1; i < 4; i++) {
    //       currentShape.currentPosition[i] = currentShape.currentPosition[i] - (mainWidth * i) + i
    //       currentShape.nextPosition[i] = currentShape.currentPosition[i] - (mainWidth * i) + i + mainWidth
    //     }
    //     currentShape.rotationState = 0
    //   }
    //   addTetromino()
    //   console.log(currentShape.currentPosition, currentShape.rotationState)
    // }
    // if (currentShape.shape === 't') {
    //   if (currentShape.rotationState === 0) {

    //     currentShape.rotationState = 1
    //   }
    // }
  // }

  function moveTetromino(arrowDirection) {
    if (gameOn) {
      let shifted
      if (currentShape.nextPosition.every(index => index < mainCellCount)) {
        removeTetromino()
        if (arrowDirection === 'ArrowDown') {
          shifted = currentShape.currentPosition.map(index => index + mainWidth)
          if (!shifted.some(index => mainCells[index].className.includes('paused'))) {
            currentShape.currentPosition = currentShape.nextPosition
          }
        }
        if (arrowDirection === 'ArrowRight' && !currentShape.currentPosition.some(index => (index % mainWidth) === 9)) {
          shifted = currentShape.currentPosition.map(index => index + 1)
          if (!shifted.some(index => mainCells[index].className.includes('paused'))) {
            currentShape.currentPosition = currentShape.currentPosition.map(index => index + 1)
            xChange += 1
          }
        }
        if (arrowDirection === 'ArrowLeft' && !currentShape.currentPosition.some(index => (index % mainWidth) === 0)) {
          shifted = currentShape.currentPosition.map(index => index - 1)
          if (!shifted.some(index => mainCells[index].className.includes('paused'))) {
            currentShape.currentPosition = currentShape.currentPosition.map(index => index - 1)
            xChange -= 1
          }
        }
        addTetromino()
        audioMovement.play()
      }
    }
  }

  function clearLine() {
    const gridRows = []
    for (let row = 0; row < mainCellCount; row += 10) {
      gridRows.push(mainCells.slice(row, row + mainWidth))
    }
    for (let row = mainHeight - 1; row > 0; row--) {
      while (gridRows[row].every(cell => cell.className.includes('paused'))) {
        let currentRow = row
        while (currentRow > 0) {
          for (let column = 0; column < mainWidth; column++) {
            gridRows[currentRow][column].className = gridRows[currentRow - 1][column].className
          }
          currentRow -= 1
        }
        updateScore()
        audioLineClear.play()
      }
    }
  }

  function updateScore() {
    playerScore += 100
    document.querySelector('#score').innerHTML = playerScore
    playerLines += 1
    document.querySelector('#lines').innerHTML = playerLines
  }

  createGrid(mainGrid, mainCellCount, mainCells)
  createGrid(nextGrid, nextCellCount, nextCells)

}

window.addEventListener('DOMContentLoaded', init)
