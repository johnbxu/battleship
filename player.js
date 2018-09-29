class Player {
  constructor(name) {
    this.name = "Player_" + name;
    this.boardSize = 0;
    this.board = []; // board state
    this.enemyBoard = []; // player's view of enemy board
    // ships state
    this.ships = {
      Carrier: {
        name: 'Carrier',
        size: 5,
        damage: 0,
        sunk: false,
        placed: false,
        coords: [],
      },
      Battleship: {
        name: 'Battleship',
        size: 4,
        damage: 0,
        sunk: false,
        placed: false,
        coords: [],
      },
      Cruiser: {
        name: 'Cruiser',
        size: 3,
        damage: 0,
        sunk: false,
        placed: false,
        coords: [],
      },
      Submarine: {
        name: 'Submarine',
        size: 3,
        damage: 0,
        sunk: false,
        placed: false,
        coords: [],
      },
      Destroyer: {
        name: 'Destroyer',
        size: 2,
        damage: 0,
        sunk: false,
        placed: false,
        coordinates: [],
      },
    };
    // this.allPlaced = function allPlaced() {
    //   for (ship in this.ships)
    // };
    // displays current board state
    this.drawBoard = function drawBoard(player) {
      console.log([player].board);
    };
    // function that places a ship given size, start location and direction
    this.placeShip = function placeShip(shipName, startCoord, direction) {
      const shipSize = this.ships[shipName].size;
      const endCoord = this.shipEndCoord(shipSize, startCoord, direction);
      const shipCoordsArray = this.shipCoords(startCoord, endCoord, direction).slice(0);
      if (this.ships[shipName].placed) {
        console.log('This ship was placed already');
      } else if (this.checkShipValidity(shipSize, startCoord, direction) && this.checkShipCollision(shipCoordsArray)) {
        this.initShip(shipName, shipCoordsArray);
        for (let i = 0; i < shipCoordsArray.length; i += 1) {
          this.board[shipCoordsArray[i][0]][shipCoordsArray[i][1]] = 1;
        }
        // logic for ship placement: fills coordinates between start and end coordinates
      } else {
        console.log('invalid placement');
      }
    };
    this.initEmptyBoard = function initEmptyBoard(player, size) {
      if (player === 'self') {
        for (let x = 0; x < size; x += 1) {
          const row = [];
          for (let y = 0; y < size; y += 1) {
            row.push(0);
          }
          this.board.push(row);
        }
        this.boardSize = size;
      }
      if (player === 'enemy') {
        for (let x = 0; x < size; x += 1) {
          const row = [];
          for (let y = 0; y < size; y += 1) {
            row.push(0);
          }
          this.enemyBoard.push(row);
        }
      }
    };
    this.initShip = function initShip(shipName, shipCoordsArray) {
      this.ships[shipName].coordinates = [...shipCoordsArray];
      this.ships[shipName].placed = true;
    };
    this.checkShipCollision = function checkShipCollision(shipCoords) {
      for (let i = 0; i < shipCoords.length; i += 1) {
        if (this.board[shipCoords[i][0]][shipCoords[i][1]] === 1) {
          return false;
        }
      }
      return true;
    };
    this.shipCoords = function shipCoords(startCoord, endCoord, direction) {
      const shipCoords = [];
      if (direction === 'up') {
        for (let i = startCoord[0]; i >= endCoord[0]; i -= 1) {
          shipCoords.push([i, startCoord[1]]);
        }
      } else if (direction === 'down') {
        for (let i = startCoord[0]; i <= endCoord[0]; i += 1) {
          shipCoords.push([i, startCoord[1]]);
        }
      } else if (direction === 'left') {
        for (let i = startCoord[1]; i >= endCoord[1]; i -= 1) {
          shipCoords.push([startCoord[0], i]);
        }
      } else if (direction === 'right') {
        for (let i = startCoord[1]; i <= endCoord[1]; i += 1) {
          shipCoords.push([startCoord[0], i]);
        }
      }
      return shipCoords;
    };
    this.checkShipValidity = function checkShipValidity(shipSize, startCoord, direction) {
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
    };
    this.outOfBounds = function checkShipValidity(coord) {
      return (!(coord[0] >= 0 && coord[0] <= this.board.length)
        || !(coord[1] >= 0 && coord[1] <= this.board[0].length));
    };
    this.shipEndCoord = function shipEndCoord(shipSize, startCoord, direction) {
      const endCoord = startCoord.slice(0);
      if (direction === 'up') {
        endCoord[0] -= shipSize - 1;
      } else if (direction === 'down') {
        endCoord[0] += shipSize - 1;
      } else if (direction === 'left') {
        endCoord[1] -= shipSize - 1;
      } else if (direction === 'right') {
        endCoord[1] += shipSize - 1;
      }
      return endCoord;
    };
    this.checkHit = function checkHit(player, coord) {
      // check if coord is contained in their board
      // update enemy board based on result
      // update enemy ship states on hit
      // pass turn
      const y = coord[0];
      const x = coord[1];
      if (player.board[y][x] === 1) {
        this.enemyBoard[y][x] = 2;
        player.board[y][x] = 2;
        console.log('Hit!');
        this.updateEnemyShip(player, coord);
        return true;
      }
      console.log('Miss');
      this.enemyBoard[y][x] = 3;
      return false;
    };
    this.updateEnemyShip = function updateEnemyShip(player, coord) {
      // const y = coord[0];
      // const x = coord[1];
      for (let ship in player.ships) {
        const shipCoords = JSON.stringify(player.ships[ship].coordinates);
        const shipCoord = JSON.stringify(coord);
        if (shipCoords.indexOf(shipCoord) != -1) {
          player.ships[ship].damage += 1;
        }
        if (player.ships[ship].damage === player.ships[ship].size) {
          player.ships[ship].sunk = true;
        }
      }
    }
  }
}

module.exports = Player;
