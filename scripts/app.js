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
      grid.appendChild(cell)
      cell.dataset.index = i
      cellArray.push(cell)
    }
  }

  createGrid(mainGrid, mainCellCount, mainCells)
  createGrid(nextGrid, nextCellCount, nextCells)

  // ! Sound Effects

  const audioLineClear = new Audio('./media/audio/clear-line.wav')
  const audioGameOver = new Audio('./media/audio/game-over.wav')
  const audioLevelUp = new Audio('./media/audio/level-up.wav')
  const audioNoMovement = new Audio('./media/audio/pause-tetro.wav')
  const audioRotate = new Audio('./media/audio/movement.wav')
  const audioMovement = new Audio('./media/audio/rotate-shape.wav')
  const audioStart = new Audio('./media/audio/game-start.wav')
  const audioBackground = new Audio('./media/audio/background-music.mp3')
  audioBackground.loop = true

  let musicOn
  let musicStart = 0
  const musicButton = document.querySelector('.music')
  musicButton.addEventListener('click', controlMusic)
  
  function startMusic() {
    musicOn = true
    audioBackground.play()
    audioBackground.volume = 0.25
  }
  
  function controlMusic () {
    if (musicOn === true) {
      musicOn = false
      audioBackground.pause()
      musicButton.src = './media/play-button.png'
    } else {
      musicOn = true
      audioBackground.play()
      musicButton.src = './media/pause-button.png'
    }
    
  }
  
  // ! Game Over Modal

  const modalContainer = document.querySelector('.modal-container')
  window.addEventListener('click', function(event) {
    if (event.target === modalContainer) {
      modalContainer.style.display = 'none'
    }
  })

  // ! High Score

  const highScoreSpan = document.querySelector('#high-score')
  const highScoreMsg = document.querySelector('.high-score-msg')
  let highScore
  localStorage.getItem('highscore') ? highScore = localStorage.getItem('highscore') : highScore = 0

  highScoreSpan.innerHTML = highScore

  // ! Game Functionality

  const buttons = document.querySelectorAll('button')
  buttons.forEach(btn => btn.addEventListener('keyup', (e) => e.preventDefault()))
  const startButton = document.querySelector('#start')
  const resetButton = document.querySelector('#reset')
  startButton.addEventListener('click', gameStart)
  resetButton.addEventListener('click', gameReset)
  window.addEventListener('keydown', handleKeyDown)

  let gameOn = false
  let playerScore = 0
  let playerLevel = 1
  let pointsToLevel = 500
  let playerLines = 0
  let currentShape = null
  let nextShape = null
  let intervalSpeed = 750
  let timeoutInterval

  class Tetromino {
    constructor(startingPosition, shape) {
      this.currentPosition = startingPosition,
      this.startingPosition = startingPosition,
      this.nextPosition = [],
      this.shape = shape,
      this.active = shape + '-active',
      this.inactive = shape + '-paused',
      this.startingRotationPosition = [3, 4, 5, 6]
    }
  }

  function generateTetro() {
    switch (Math.floor((Math.random() * 7))) {
      case 0:
        return new Tetromino([4, 5, 14, 15], 'o')
      case 1:
        return new Tetromino([4, 14, 24, 25], 'l')
      case 2:
        return new Tetromino([5, 15, 24, 25], 'j')
      case 3:
        return new Tetromino([4, 13, 14, 15], 't')
      case 4:
        return new Tetromino([4, 5, 15, 16], 'z')
      case 5:
        return new Tetromino([4, 5, 13, 14], 's')
      case 6:
        return new Tetromino([3, 4, 5, 6], 'i')
    }
  }

  // ! Functions

  function gameStart() {
    if (musicStart === 0) {
      startMusic()
      musicStart = 1
    }
    if (startButton.innerHTML === 'Pause') {
      gamePause()
    } else if (startButton.innerHTML === 'Start') {
      gameOn = true
      startButton.innerHTML = 'Pause'
      setTimeout(releaseTetromino, intervalSpeed)
      audioStart.play()
    } else if (startButton.innerHTML === 'Replay') {
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
    gameOn = false
    gamePause()
    updateSpans()
    removeTetromino()
    nextShape = null
    currentShape = null
    mainCells.forEach(cell => cell.className = '')
    nextCells.forEach(cell => cell.className = '')
    highScoreMsg.style.display = 'none'

    gameOn = false
    playerScore = 0
    playerLevel = 1
    pointsToLevel = 500
    playerLines = 0
    intervalSpeed = 750
    timeoutInterval
  }
  
  function addTetromino() {
    currentShape.currentPosition.forEach(index => {
      mainCells[index].classList.add(currentShape.active)
    })
    currentShape.nextPosition = currentShape.currentPosition.map(index => index + mainWidth)
  }

  function deactivateTetromino() {
    currentShape.currentPosition.forEach(index => {
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
        deactivateTetromino()
        audioNoMovement.play()
        clearLine()
        currentShape = nextShape
      } else { // if both conditions above are false, lower shape by one row
        removeTetromino()
        currentShape.currentPosition = currentShape.nextPosition
        addTetromino()
      }
      timeoutInterval = setTimeout(releaseTetromino, intervalSpeed)
    } else { // if no active cells
      nextShape === null ? currentShape = generateTetro() : currentShape = nextShape
      removeNext()
      nextShape = generateTetro()
      previewNext()
      if (currentShape.startingPosition.some(index => mainCells[index].className.includes('paused'))) { // Game Over
        audioGameOver.play()
        currentShape.currentPosition.forEach(index => {
          mainCells[index].classList.add(currentShape.active)
        })
        gamePause()
        if (playerScore > highScore) {
          localStorage.setItem('highscore', playerScore)
          highScoreSpan.innerHTML = playerScore
          highScoreMsg.style.display = 'block'
        }
        
        modalContainer.style.display = 'block'
        startButton.innerHTML = 'Replay'
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
        audioRotate.play()
        rotateTetromino()
      } else if (event.code === 'ArrowDown' || event.code === 'ArrowRight' || event.code === 'ArrowLeft') {
        audioMovement.play()
        moveTetromino(event.code)
      }
    }
  }

  function rotateTetromino() {
    if (gameOn) {
      const rotationArray = []
      const rotatedArray = [[], [], [], []]
      const yChange = Math.floor(currentShape.currentPosition[0] / mainWidth)
      let tempPosition = currentShape.currentPosition.slice()
      let rotationIndex = []
      currentShape.currentPosition.forEach(index => rotationIndex.push(index % 10))
      rotationIndex = rotationIndex.sort()
      let lowestColumn = rotationIndex[0]

      lowestColumn <= mainWidth - currentShape.currentPosition.length ? lowestColumn += yChange * mainWidth : lowestColumn = mainWidth - currentShape.currentPosition.length + (yChange * mainWidth)

      // Vertically Centering Tetromino in Rotation Array to Prevent Piece Shift Right
      let rotationArrayBase = [lowestColumn, lowestColumn + 1, lowestColumn + 2, lowestColumn + 3]
      if (rotationArrayBase[0] > mainWidth - 1 && !rotationArrayBase.map(index => index + mainWidth * 2).some(index => mainCells[index].className.includes('active'))) {
        if (rotationArrayBase[0] > mainWidth * 2 - 1 && !rotationArrayBase.map(index => index + mainWidth).some(index => mainCells[index].className.includes('active'))) {
          rotationArrayBase = rotationArrayBase.map(index => index - mainWidth * 2)
        } else { 
          rotationArrayBase = rotationArrayBase.map(index => index - mainWidth)
        }
      }

      const columnThree = [rotationArrayBase[2], rotationArrayBase[2] + mainWidth, rotationArrayBase[2] + mainWidth * 2, rotationArrayBase[2] + mainWidth * 3]
      const columnFour = [rotationArrayBase[3], rotationArrayBase[3] + mainWidth, rotationArrayBase[3] + mainWidth * 2, rotationArrayBase[3] + mainWidth * 3]

      // Horizontally Centering Tetromino in Rotation Array to Prevent Piece Shift Right
      if (rotationIndex[0] > 0 && rotationIndex[3] < 9 && !columnFour.some(index => mainCells[index].className.includes('active'))) {
        rotationArrayBase = rotationArrayBase.map(index => index - 1)
      }

      removeTetromino()

      // Create Inital Rotation Array
      rotationArray.push(rotationArrayBase,
        rotationArrayBase.map(index => index + mainWidth),
        rotationArrayBase.map(index => index + (mainWidth * 2)),
        rotationArrayBase.map(index => index + (mainWidth * 3)))

      // Create Rotated Array (rotates the inital Rotation Array counter-clockwise)
      const maxIndex = rotationArray.length - 1
      for (let i = 0; i < rotationArray.length; i++) {
        rotatedArray[0].push(rotationArray[0][i] + (maxIndex * ((maxIndex * i) + 1)))
        rotatedArray[1].push(rotationArray[1][i] + ((i - 1) * 10) + -(i - 2))
        rotatedArray[2].push(rotationArray[2][i] + ((i - 2) * 10) + -(i - 1))
        rotatedArray[3].push(rotationArray[3][i] + (maxIndex * ((maxIndex * (i - maxIndex)) - 1)))
      }

      // Update Current Position to Rotated Position
      for (let i = 0; i < rotationArray.length; i++) {
        if (rotationArray[0].includes(tempPosition[i])) {
          tempPosition[i] = rotatedArray[0][rotationArray[0].indexOf(tempPosition[i])]
        } else if (rotationArray[1].includes(tempPosition[i])) {
          tempPosition[i] = rotatedArray[1][rotationArray[1].indexOf(tempPosition[i])]
        } else if (rotationArray[2].includes(tempPosition[i])) {
          tempPosition[i] = rotatedArray[2][rotationArray[2].indexOf(tempPosition[i])]
        } else if (rotationArray[3].includes(tempPosition[i])) {
          tempPosition[i] = rotatedArray[3][rotationArray[3].indexOf(tempPosition[i])]
        }
      } tempPosition.sort((a, b) => a - b)

      // Prevent Rotation Beyond Bottom of Grid
      if (tempPosition.some(index => index > mainCellCount)) {
        if (tempPosition.some(index => index > mainCellCount + mainWidth)) {
          tempPosition = tempPosition.map(index => index - (mainWidth * 2))
        } else {
          tempPosition = tempPosition.map(index => index - mainWidth)
        }
      }

      // Prevent Rotation if Paused Piece in the Way
      if (!tempPosition.some(index => mainCells[index].className.includes('paused'))) {
        currentShape.currentPosition = tempPosition
      } else if (!tempPosition.some(index => mainCells[index + 1].className.includes('paused'))) {
        currentShape.currentPosition = tempPosition.map(index => index + 1)
      } else if (!tempPosition.some(index => mainCells[index - 1].className.includes('paused'))) {
        currentShape.currentPosition = tempPosition.map(index => index - 1)
      } else if (!tempPosition.some(index => mainCells[index + 1].className.includes('paused'))) {
        currentShape.currentPosition = tempPosition.map(index => index + 2)
      } else if (!tempPosition.some(index => mainCells[index - 1].className.includes('paused'))) {
        currentShape.currentPosition = tempPosition.map(index => index - 2)
      }

      addTetromino()
    }
  }

  function moveTetromino(arrowDirection) {
    if (gameOn) {
      if (currentShape.nextPosition.every(index => index < mainCellCount)) {
        removeTetromino()
        if (arrowDirection === 'ArrowDown') {
          currentShape.currentPosition.map(index => index + mainWidth)
          if (!currentShape.currentPosition.map(index => index + mainWidth).some(index => mainCells[index].className.includes('paused'))) {
            currentShape.currentPosition = currentShape.nextPosition
          }
        }
        if (arrowDirection === 'ArrowRight' && !currentShape.currentPosition.some(index => (index % mainWidth) === 9)) {
          if (!currentShape.currentPosition.map(index => index + 1).some(index => mainCells[index].className.includes('paused'))) {
            currentShape.currentPosition = currentShape.currentPosition.map(index => index + 1)
          }
        }
        if (arrowDirection === 'ArrowLeft' && !currentShape.currentPosition.some(index => (index % mainWidth) === 0)) {
          if (!currentShape.currentPosition.map(index => index - 1).some(index => mainCells[index].className.includes('paused'))) {
            currentShape.currentPosition = currentShape.currentPosition.map(index => index - 1)
          }
        }
        addTetromino()
      }
    }
  }

  function clearLine() {
    const gridRows = []
    let multiplier = 1
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
        playerScore += 50 * multiplier
        multiplier++
        playerLines += 1
        levelCheck()
        updateSpans()
        audioLineClear.play()
      }
    }
  }
  
  function levelCheck() {
    if (playerScore >= pointsToLevel) {
      playerLevel++
      audioLevelUp.play()
      pointsToLevel += 500
      intervalSpeed = intervalSpeed * 0.90
    }
  }

  function updateSpans() {
    document.querySelectorAll('#score').forEach(span => span.innerHTML = playerScore)
    document.querySelector('#lines').innerHTML = playerLines
    document.querySelector('#level').innerHTML = playerLevel
  }
}

window.addEventListener('DOMContentLoaded', init)
