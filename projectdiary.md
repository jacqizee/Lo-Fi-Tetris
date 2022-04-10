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

