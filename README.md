# Battleship Stretch Project

## Game logic
#battleship logic

### initialization:
* for each player:
  * get a board size
  * get how many ships
    * for each ship, get size (implement later: limit how many ships and sizes based on board size)
      * get start coordinate of ship
      * calculate end coordinate of ship and place. if valid => fill in board. if invalid => ask again
      * display board
* implement later: auto placement of ships

### playing phase

* clickable elements:
  * ship grid squares
  * buttons

1. state = 0
  * this is the pre-game phase. Players are able to choose single or multiplayer options (multiplayer not implemented yet)
  * ship grid squares: inactive
  * buttons: clickable
    * top button: single player
    * buttom button: multiplayer (not implemented)

2. state = 1
  * this is the setup phase. Players place their ships one by one starting from carrier
  * ship grid squares: active top
    * different ships will have different placement shadows
    * once all ships are placed, move onto state 2
  * buttons: clickable
    * top button: vertical
    * bottom button: horizontal

3. state = 2
  * play phase. player shoots at opponent's board
  * ship grid squares: active bottom
    * only blank squares are clickable
  * buttons: inactive




#### player 1 turn:
* pick a coordinate
  * check if within bounds => if false, ask again
  * check if coordinate is occupied =>
    * if true, change coordinate to hit
    * if false, change coordinate to miss
    * change ship object hit points

#### ai player turn:
* first turn: pick a random coordinate within a set possibility grid
  * follow check logic to update board
  * if hit, subsequent turns will try to go horizontally or vertically from hit coordinate
    * 'on_the_hunt = true'
    * if hit again, keep going in that direction until miss
      * then go other direction until miss
      * 'on_the_hunt = false'

##### On the Hunt Logic
1. normal:
  hunt = false
2. 1st hit:
  hunt = true
  huntStage = 1
  hunt[1] = coords
  huntPossibilities = check coords against board to eliminate direction(s)
  huntDirection = random(huntPossibilities)
  3. fire in huntDirection
    * if hit
      huntDirection = no change
      huntStage = 2
      huntPossibilities = take out current and perpendicular directions
        4. fire in same direction
          * if hit
            nothing changes; repeat firings
          * if miss
            huntDirection = opposite direction
            huntStage = 3
              5. hit in direction until miss
                * on miss
                  hunt = false
    * if miss
      huntDirection = opposite direction if valid; else random direction
      huntPossibilities = take out current direction
        4. fire in opposite direction
          * if hit
            huntStage = 2
          * if miss
            huntDirection = take out direction; pick random out of perpendicular directions
            huntStage = 3
        5. fire in perpendicular direction
          * if hit
            huntStage = 2
          * if miss
            huntStage = 3
            huntDirection = take out direction; should only have one direction left






* win/loss condition: if all ships are all destroyed



## Notes
