#battleship logic

##initialization:
* for each player:
  * get a board size
  * get how many ships
    * for each ship, get size (implement later: limit how many ships and sizes based on board size)
      * get start coordinate of ship
      * calculate end coordinate of ship and place. if valid => fill in board. if invalid => ask again
      * display board
* implement later: auto placement of ships

##playing phase
while (!gameEnd) {
  while (turn === p1) {
    player 1's turn
  }
}
  while (turn === p2) {
    player 2's turn
  }
}

###player 1 turn:
* pick a coordinate
  * check if within bounds => if false, ask again
  * check if coordinate is occupied =>
    * if true, change coordinate to hit
    * if false, change coordinate to miss
    * change ship object hit points

###ai player turn:
* first turn: pick a random coordinate within a set possibility grid
  * follow check logic to update board
  * if hit, subsequent turns will try to go horizontally or vertically from hit coordinate
    * 'on_the_hunt = true'
    * if hit again, keep going in that direction until miss
      * then go other direction until miss
      * 'on_the_hunt = false'




* win/loss condition: if all ships are all destroyed

