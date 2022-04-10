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
    The deadline is tomorrow, and I have all 