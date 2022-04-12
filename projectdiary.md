Day 0: playing tetris, wireframing, and pseudocode
    Instead of jumping straight into coding the game once selecting my game choice, I spent my entire day one thinking through what I would need to get Tetris working. I knew this was going to be a bigger beast of a project compared to the assignements I had done before, so wanted to structure out my plan before jumping into VSCode.
    I first made the wireframe for the HTML structure of the game, then I played a few different versions of Tetris online (for research purposes!). I outlined the features I wanted to replicate, and the basic functionality of the pieces that I would need to account for. Then, I started outlining what variables, events, intervals, and functions I would need and what they would need to be able to do (and not do).
    The functions that stumped me the most at this point was figuring out how to rotate pieces, how to drop one active piece at a time, and how to clear a line and shift all pieces above it down a line.


Day 1: start of coding
    Today I submitted my wireframe and pseudocode for review, and once approved I jumped into coding. Not going to lie, was pretty excited to finally crack into the plan I had outlined!
    By the end of the day, I added in the grids in the game, began putting together the interval to drop pieces, and added in a function to move pieces horizontally when the left/right arrows are pressed and down when the down arrow is pressed.
    The rotate, clear, and shift functions are still actively in the back of my mind, and the general idea is getting clearer and clearer. Can't wait to start cracking into them tomorrow!

Day 2:
    I spend the day fixing bugs I had found with the drop interval and the horizontal/vertical piece movement. While pieces weren't overlapping if you let the interval run, I found that moving the pieces via the arrow buttons led to pieces overlapping. I fixed this by more clearly defining the current position of the tetromino globally so that the current position and next position is always updated when a piece is moved.
    I also updated the drop piece function to pause tetrominos once they touch the bottom of the grid, or if their next position would overlap with an paused tetromino.

Day 3:
    Today I updated the interval to end the game when the grid is filled and there is no space for the next shape to drop. I spent the rest of the day taking my mind off the project for a bit, though did spend a fair amount of time brainstorming ideas on how to approach rotating tetronimos and clearing lines when filled.

Day 4:
    To wrap up the weekend, I spent a fair amount of time today still juggling ideas about tetromino rotation (stuck between either trying to create a function that will rotate all pieces with some type of math, or by individually typing in each roation shape's array... hard coding it with the individual arrays is less flexible and would take more time, but would probably be the easier approach in terms of complexity).
    To take my mind off rotation, I finished the day by writing a function to clear lines when they're filled with tetrominos, then shifting all the lines above it down to fill the space. Took a bit of thought but was able to tackle this with a couple of while loops.
    Additionally, I added in a pause button (realized it would be an easy feature to implement, and also found it helpful to be able to pause the game so I could take a look at the console at a specific moment in time).

Day 5:
    Today I was still strategizing my plan for how to approach rotating shapes. The two options I've boiled it down to is either 1. hard-coding each rotation and keeping track of the active tetromino's state of rotation, or 2. creating some time of moving grid/matrix that I can use to rotate pieces no matter where they are and what position.
    To take my mind off rotation for a day, I allowed today to be more of a CSS-heavy day, so I focused more on styling and adding sound effects.

Day 6:
    Today, I finally allowed myself to tackle rotations, and I decided given I still have a two days before the deadline, I would try with the more complex method of creating a matrix of sorts that would allow me to rotate any piece no matter the current rotation state it was in. After a lot of trial and error (and lots of pen on paper to figure out working equations), I was able to create this matrix and rotate pieces! I think while this method took a lot longer to get to, the code itself was relatively simple to implement since I had really mulled over this for days (though I definitely was pulling my hair out at times! Definitely a rollercoaster of feelings of success and failure).
    

Day 7:



Pre-Project Start Notes:
TODO: Notes
When the user clicks start, an interval needs to begin running to start dropping shapes in the grid. Shapes will drop from the top center
In order to do that, we need to randomly pick a shape, then we need it to drop down line by line every few seconds
User should be able to move it side by side (w/ left + right keys) or speed the drop down (w/ down key).
User should also be able to rotate the shape as it falls down, but shape needs to be able to remain in the grid and also continue falling from the last position
Once a shape hits the bottom or touches a placed shape, we need a new shape to drop down
When the bottom line is fully filled, we need it to clear the row and move all grid items down one row, also increasing points and lines completed
after a certain score or lines complete is reached, we can increase the level and increase the speed of the interval
If the player is too slow and the shapes reach the top, the game should automatically end


TODO: Variables
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

Elements
//* tetrisGrid = querySelect the grid div so we can make the grid


TODO: Functions

Interval: checks if there is an active shape in the grid,
   if no (ex. start of game), drop a shape at top. Shapes always start at the same positions, so we can 
   if yes, check if shape is touching another shape or if shape has reached the bottom of the screen OR if there is a shape in the first row of the grid
       if touching another shape/reached bottom, leave the shape and start dropping another shape
       if there is a shape currently in first row, end the game
       if no to both, remove current shape then return it one row lower


generateShape:
   random number to pick a tetrimino shape for current and next shape

moveShape:
   if right arrow, moves shape right 1, if left arrow clicked, moves shape left 1. if down arrow clicked, moves shape down 1

rotateElement:
   needs to rotate shape 90deg clockwise....
   removes current shape and replaces it with rotated shape (will have set dimensions, which will add vertical movement and add/minus horizontal movement)

clearLine:
   when a line is completely filled, remove line and shift all elements above it down

gameOver:
   when blocks reach the top and there's no space left, end the game


TODO: Events
click:
  start button -> starts the game
  replay button -> replay the game

keydown:
//*    up -> rotate element via roateElement function
//*    left -> move shape to left
//*    right -> move shape to right
//*    down -> move shape down one line

? Extra Features - if there's time
play sound effect when a line is cleared
sound effect when player levels up/speed increases
play/pause background music button
column shading indicating where the shape will drop
save a shape that can be swapped with current shape later (probably no time??)