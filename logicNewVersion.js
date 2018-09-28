// variables
// variable for player
const player1 = {
  boardSize: 0,
  board: [], // board state
  enemyBoard: [], // player's view of enemy board
  // ships state
  ships: {
    1: {

    },
    2: {

    },
    3: {

    },
    4: {

    },
    5: {

    },
  },
  // displays current board state
  drawBoard() {
    console.log(this.board);
  },
  // function that places a ship given size, start location and direction
  placeShip(shipSize, startCoord, direction) {
    const endCoord = this.shipEndCoord(shipSize, startCoord, direction);
    const shipCoordsArray = this.shipCoords(startCoord, endCoord, direction).slice(0);
    if (this.checkShipValidity(shipSize, startCoord, direction) && this.checkShipCollision(shipCoordsArray)) {
      // this.initShip(shipSize, x);
      for (let i = 0; i < shipCoordsArray.length; i++) {
        this.board[shipCoordsArray[i][0]][shipCoordsArray[i][1]] = 1;
      }
      // logic for ship placement: fills coordinates between start and end coordinates
    } else {
      console.log('invalid placement');
    }
  },
  initEmptyBoard(size) {
    for (let x = 0; x < size; x += 1) {
      const row = [];
      for (let y = 0; y < size; y++) {
        row.push(0);
      }
      this.board.push(row);
    }
  },
  checkShipCollision(shipCoords) {
    for (let i = 0; i < shipCoords.length; i++) {
      if (this.board[shipCoords[i][0]][shipCoords[i][1]] === 1) {
        return false;
      }
    }
    return true;
  },
  shipCoords(startCoord, endCoord, direction) {
    const shipCoords = [];
    if (direction === 'up') {
      for (let i = startCoord[0]; i > endCoord[0]; i--) {
        shipCoords.push([i, startCoord[1]]);
      }
    } else if (direction === 'down') {
      for (let i = startCoord[0]; i < endCoord[0]; i++) {
        shipCoords.push([i, startCoord[1]]);
      }
    } else if (direction === 'left') {
      for (let i = startCoord[1]; i > endCoord[1]; i--) {
        shipCoords.push([startCoord[0], i]);
      }
    } else if (direction === 'right') {
      for (let i = startCoord[1]; i < endCoord[1]; i++) {
        shipCoords.push([startCoord[0], i]);
      }
    }
    return shipCoords;
  },
  checkShipValidity(shipSize, startCoord, direction) {
    const endCoord = this.shipEndCoord(shipSize, startCoord, direction);
    if (this.outOfBounds(startCoord)) {
      console.log('ship start location is out of bounds');
      return false;
    }
    if (this.outOfBounds(endCoord)) {
      console.log('ship end location is out of bounds');
      return false;
    }

    return true;
  },
  outOfBounds(coord) {
    return (!(coord[0] >= 0 && coord[0] <= this.board.length) || !(coord[1] >= 0 && coord[1] <= this.board[0].length));
  },
  shipEndCoord(shipSize, startCoord, direction) {
    const endCoord = startCoord.slice(0);
    if (direction === 'up') {
      endCoord[0] -= shipSize;
    } else if (direction === 'down') {
      endCoord[0] += shipSize;
    } else if (direction === 'left') {
      endCoord[1] -= shipSize;
    } else if (direction === 'right') {
      endCoord[1] += shipSize;
    }
    return endCoord;
  },
};


// functions



// tests
player1.initEmptyBoard(player1, 10);
player1.placeShip(player1, 3, [3, 5], 'right');
player1.placeShip(player1, 3, [3, 5], 'left');
// placeShip(player1, 3, [3,5], 'down');
player1.drawBoard(player1);
console.log(player1);
console.log(player1.ships[0].coords);
