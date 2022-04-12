
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
  const resetButton = document.querySelector('#reset')
  startButton.addEventListener('click', gameStart)
  resetButton.addEventListener('click', gameReset)
  window.addEventListener('keydown', handleKeyDown)

  let highScore = document.querySelector('#highscore')
  let gameOn = false
  let playerScore = 0
  let playerLevel = 0
  let playerLines = 0
  let currentShape = null
  let nextShape = null
  let intervalSpeed = 250
  let timeoutInterval
  let xChange = 0

  class Tetromino {
    constructor(startingPosition, shape) {
      this.currentPosition = startingPosition,
      this.startingPosition = startingPosition,
      this.nextPosition = [],
      this.active = shape + '-active',
      this.inactive = shape + '-paused',
      this.startingRotationPosition = [3, 4, 5, 6]
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

  // ! Functions

  function gameStart() {
    if (startButton.innerHTML === 'Pause') {
      gamePause()
    } else if (startButton.innerHTML === 'Start') {
      console.log(currentShape, nextShape)
      gameOn = true
      startButton.innerHTML = 'Pause'
      setTimeout(releaseTetromino, intervalSpeed)
    } else if (startButton.innerHTML === 'Reset') {
      gameReset()
      startButton.innerHTML = 'Start'
    }
  }

  function gamePause() {
    gameOn = false
    clearInterval(timeoutInterval)
    startButton.innerHTML = 'Start'
  }

  function gameReset() {
    gamePause()
    resetStats()
    updateSpans()
    gameOn = false
    nextShape = null
    currentShape = null
    mainCells.forEach(cell => cell.className = '')
    nextCells.forEach(cell => cell.className = '')
    console.log(mainCells, nextCells)
  }

  function resetStats() {
    gameOn = false
    playerScore = 0
    playerLevel = 0
    playerLines = 0
    currentShape = null
    nextShape = null
    intervalSpeed = 250
    timeoutInterval
    xChange = 0
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
      nextShape == null ? currentShape = allTetrominos[Math.floor((Math.random() * allTetrominos.length))] : currentShape = nextShape
      removeNext()
      nextShape = allTetrominos[Math.floor((Math.random() * allTetrominos.length))]
      nextShape.currentPosition = nextShape.startingPosition
      previewNext()
      if (currentShape.startingPosition.some(index => mainCells[index].className.includes('paused'))) {
        audioGameOver.play()
        currentShape.currentPosition.forEach(index => {
          mainCells[index].classList.add(currentShape.active)
        })
        gamePause()
        window.alert('Game over!')
        startButton.innerHTML = 'Reset'
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
    
    const rotationArray = []
    const rotatedArray = [[], [], [], []]
    const yChange = Math.floor(currentShape.currentPosition[0] / mainWidth)
    const changeInPosition = (yChange * mainWidth) + xChange

    // Create Inital Rotation Array
    rotationArray.push(currentShape.startingRotationPosition.map(index => index + changeInPosition),
      currentShape.startingRotationPosition.map(index => index + changeInPosition + mainWidth),
      currentShape.startingRotationPosition.map(index => index + changeInPosition + mainWidth * 2),
      currentShape.startingRotationPosition.map(index => index + changeInPosition + mainWidth * 3))
    const maxIndex = rotationArray.length - 1
    
    // Create Rotated Array (rotates the inital Rotation Array clockwise)
    for (let i = 0; i < rotationArray.length; i++) {
      rotatedArray[0].push(rotationArray[0][i] + (maxIndex * ((maxIndex * i) + 1)))
      rotatedArray[1].push(rotationArray[1][i] + ((i - 1) * 10) + -(i - 2))
      rotatedArray[2].push(rotationArray[2][i] + ((i - 2) * 10) + -(i - 1))
      rotatedArray[3].push(rotationArray[3][i] + (maxIndex * ((maxIndex * (i - maxIndex)) - 1)))
    }
    
    console.log('rotationArray', rotationArray, 'rotated array', rotatedArray, 'currentshape', currentShape.currentPosition)

    for (let i = 0; i < 4; i++) {
      removeTetromino()
      if (rotationArray[0].includes(currentShape.currentPosition[i])) {
        currentShape.currentPosition[i] = rotatedArray[0][rotationArray[0].indexOf(currentShape.currentPosition[i])]
      } else if (rotationArray[1].includes(currentShape.currentPosition[i])) {
        currentShape.currentPosition[i] = rotatedArray[1][rotationArray[1].indexOf(currentShape.currentPosition[i])]
      } else if (rotationArray[2].includes(currentShape.currentPosition[i])) {
        currentShape.currentPosition[i] = rotatedArray[2][rotationArray[2].indexOf(currentShape.currentPosition[i])]
      } else if (rotationArray[3].includes(currentShape.currentPosition[i])) {
        currentShape.currentPosition[i] = rotatedArray[3][rotationArray[3].indexOf(currentShape.currentPosition[i])]
      }
    } currentShape.currentPosition.sort(function(a, b){return a - b})
    currentShape.currentPosition = currentShape.currentPosition.map(index => index - mainWidth)
    addTetromino()
    console.log(currentShape.currentPosition)

    // for (let array = 0; array < rotationArray.length; array++) {
    //   removeTetromino()
    //   for (let i = 0; i < currentShape.currentPosition.length; i++) {
    //     if (rotationArray[0].includes(currentShape.currentPosition[i])) {
    //       const cellIndex = rotationArray[0].indexOf(currentShape.currentPosition[i])
    //       currentShape.currentPosition[i] = rotatedArray[0][cellIndex]
    //     }
    //     if (rotationArray[1].includes(currentShape.currentPosition[i])) {
    //       const cellIndex = rotationArray[1].indexOf(currentShape.currentPosition[i])
    //       currentShape.currentPosition[i] = rotatedArray[1][cellIndex]
    //     }
    //     if (rotationArray[2].includes(currentShape.currentPosition[i])) {
    //       const cellIndex = rotationArray[2].indexOf(currentShape.currentPosition[i])
    //       currentShape.currentPosition[i] = rotatedArray[2][cellIndex]
    //     }
    //     if (rotationArray[3].includes(currentShape.currentPosition[i])) {
    //       const cellIndex = rotationArray[3].indexOf(currentShape.currentPosition[i])
    //       currentShape.currentPosition[i] = rotatedArray[3][cellIndex]
    //     }
    //   }


      // for (let i = 0; i < currentShape.currentPosition.length; i++) {
      //   if (rotationArray[array].includes(currentShape.currentPosition[i])) {
      //     const cellIndex = rotationArray[array].indexOf(currentShape.currentPosition[i])
      //     console.log('cell index', cellIndex)
      //     currentShape.currentPosition[i] = rotatedArray[array][cellIndex]
      //   }
    //   // }
    //   addTetromino()
    // } console.log('current shape', currentShape.currentPosition)


    // removeTetromino()
    // currentShape.currentPosition[i] += 2
    // addTetromino()
    // console.log('contains active')
  }

  // function rotateTetromino() {
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
        playerScore += 100
        playerLines += 1
        updateSpans()
        audioLineClear.play()
      }
    }
  }

  function updateSpans() {
    document.querySelector('#score').innerHTML = playerScore
    document.querySelector('#lines').innerHTML = playerLines
  }

  createGrid(mainGrid, mainCellCount, mainCells)
  createGrid(nextGrid, nextCellCount, nextCells)

}

window.addEventListener('DOMContentLoaded', init)
