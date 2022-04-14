# Project 1: Tetris

## Overview
This was the first project for the Software Engineering Immersive course with GA. We were given a timeline of one week to pick a game from a list of options then re-create it, and I chose Tetris. I found the solo project to be an incredible learning experience in brainstorming, designing, then executing a project from start to finish, and I learned many valuable lessons along the way.

## The Brief

**Timeframe:**
* 7 days

**General Brief:**
* Design logic for winning & visually display which player won
* Use Javascript for DOM manipulation
* Use semantic markup for HTML and CSS

**Tetris-Specific Brief:**
* The game should stop if a Tetrimino fills the highest row of the game board
* The player should be able to rotate each Tetrimino about its own axis
* If a line is completed it should be removed and the pieces above should take its place

## Technologies Used
**Front End:**
* JavaScript (ES6+)
* HTML5 & HTML5 Audio
* CSS3
**Dev Tools:**
* VSCode
* Eslint
* Git
* GitHub
* Google Fonts
* Google Chrome Dev Tools

## Controls & Features
* Start Button
* Key Up Rotates the Tetromino
* Key Down Lowers Tetromino
* Key Left/Right Moves the Tetromino Left/Right
* Reset Button
* Audio & Audio Controls
* Persistent High Score Using Local Storage
* Speed Increases as Player Levels Up

## Instructions
* Tetris is a puzzle game where the player has to fit different shaped blocks (called Tetriminos) together so that they make a complete line across the playing board. Once a line is achieved it is removed from the game board and the player's score is increased
* The player can move the Tetriminos left and right and rotate them clockwise in 90º increments
* The aim of the game is to get as many points as possible before the game board is filled with Tetriminos

## Approach
Selecting Tetris as my game of choice for the project definitely put me way outside my comfort zone, but I selected it to push myself to see if I could rise to the challenge within a week.

### Initial Steps: Day 0 - Day 1

Before jumping right into coding, I played several different versions of Tetris to remind myself of the features and note what I would want to replicate for my game. Then, I drew out a wireframe to map the different semantic and non-semantic HTML elements, then moved into pseudocoding how I thought I should approach the problem.

Despite itching to jump into coding, I spent the entire first day on pseudocode since I knew if I didn't plan out my approach I was bound to hit roadblocks. Initally I mapped out that I would need:
* An interval which lowers the active tetromino by one row every second or so. The interval would need to check if the piece could be lowered, and if not i.e. reaching the bottom of the grid or another tetromino piece, freeze the tetromino in place.
* Randomly generate a tetromino and be able to move it left, right, and down as it falls down the board
* Clear rows when full, shifting all elements above the row down
* End the game when there is no room for a new tetromino to drop

Once I had mapped out a plan for how I planned to approach each item listed, I allowed myself to get cracking on the coding.

### Grid Creation and Initial Functions Day 1 - Day 
