//variables


//variable for player
var player1 = {
  //board state
  "board": [],
  //ships state
  "ships": []

};



//functions

//displays current board state
function drawBoard(player){
  console.log(player.board);
}

//creates an empty board
function initEmptyBoard(player, size){
  for (var x = 0; x < size; x++){
    var row = [];
    for (var y = 0; y < size; y++){
      row.push(0);
    }
    player.board.push(row);
  }
}

function initShipObj(player, shipSize, shipCoords){
  player.ships.push({
    'size': shipSize,
    'placed': true,
    'damage': 0,
    'sunk': false,
    'coords': shipCoords.slice(0)
  });
}
//places a ship of a given size, start coordinate and direction on the board
function placeShip(player, shipSize, startCoord, direction){
  var endCoord = shipEndCoord(shipSize, startCoord, direction);
  var x = shipCoords(startCoord, endCoord, direction).slice(0);

  if (checkShipValidity(player.board, shipSize, startCoord, direction) && checkShipCollision(player, x)){
    initShipObj(player, shipSize, x);
    for (var i = 0; i < x.length; i++){
      player.board[x[i][0]][x[i][1]] = 1;
    }
    //logic for ship placement: fills coordinates between start and end coordinates
  } else {
      console.log('invalid placement');
  }
}

function checkShipCollision(player, shipCoords){
  for (var i = 0; i < shipCoords.length; i++){
    if (player.board[shipCoords[i][0]][shipCoords[i][1]] === 1){
      return false;
    }
  }
  return true;
}

function shipCoords(startCoord, endCoord, direction){
  var shipCoords = [];
  if (direction == 'up'){
    for (var i = startCoord[0]; i > endCoord[0]; i--){
      shipCoords.push([i, startCoord[1]]);
    }
  } else if (direction == 'down'){
    for (var i = startCoord[0]; i < endCoord[0]; i++){
      shipCoords.push([i, startCoord[1]]);
    }
  } else if (direction == 'left'){
    for (var i = startCoord[1]; i > endCoord[1]; i--){
      shipCoords.push([startCoord[0], i]);
    }
  } else if (direction == 'right'){
    for (var i = startCoord[1]; i < endCoord[1]; i++){
      shipCoords.push([startCoord[0], i]);

    }
  }
  return shipCoords;
}

function checkShipValidity(board, shipSize, startCoord, direction){
  var endCoord = shipEndCoord(shipSize, startCoord, direction);
  if (outOfBounds(board, startCoord)){
    console.log('ship start location is out of bounds');
    return false;
  }
  if (outOfBounds(board, endCoord)){
    console.log('ship end location is out of bounds');
    return false;
  }

  return true;
}

function outOfBounds(board, coord){
  return (!(coord[0] >= 0 && coord[0] <= board.length) || !(coord[1] >= 0 && coord[1] <= board[0].length)) ? true : false;
}

function shipEndCoord(shipSize, startCoord, direction){
  var endCoord = startCoord.slice(0);
  if (direction == 'up'){
    endCoord[0] -= shipSize;
  } else if (direction == 'down'){
    endCoord[0] += shipSize;
  } else if (direction == 'left'){
    endCoord[1] -= shipSize;
  } else if (direction == 'right'){
    endCoord[1] += shipSize;
  }

  return endCoord;
}


//tests
initEmptyBoard(player1, 10);
placeShip(player1, 3, [3,5], 'right');
placeShip(player1, 3, [3,5], 'left');
//placeShip(player1, 3, [3,5], 'down');
drawBoard(player1);
console.log(player1);
console.log(player1.ships[0].coords);