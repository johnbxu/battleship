$(function() {

  const state = 0;
  class Player {
    constructor(name) {
      this.name = `Player_ ${name}`;
      this.boardSize = 0;
      this.board = []; // board state
      this.enemyBoard = []; // player's view of enemy board
      this.hunt = { // onTheHunt AI object
        hunt: false,
        huntStage: 0,
        huntDirection: '',
        huntPossibilities: ['up', 'down', 'left', 'right'],
        hunts: [],
        huntHits: [],
      };
      this.shotsHistory = [];
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
      // helper function to log board state
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
        } else if (this.checkShipValidity(shipSize, startCoord, direction)
          && this.checkShipCollision(shipCoordsArray)) {
          this.initShip(shipName, shipCoordsArray);
          // logic for ship placement: fills coordinates between start and end coordinates
          for (let i = 0; i < shipCoordsArray.length; i += 1) {
            this.board[shipCoordsArray[i][0]][shipCoordsArray[i][1]] = 1;
          }
        } else {
          console.log('invalid placement');
        }
      };

      // user ship placement functions
      // this.

      // creates an empty board
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
      // initiates coordinates for a ship after placement and changes placement status
      this.initShip = function initShip(shipName, shipCoordsArray) {
        this.ships[shipName].coordinates = [...shipCoordsArray];
        this.ships[shipName].placed = true;
        for (const coord of shipCoordsArray) {
          $(this.toId(coord)).css('background-color', 'yellow');
        }
      };
      // during placement of a ship, checks if a ship is already present
      this.checkShipCollision = function checkShipCollision(shipCoords) {
        for (let i = 0; i < shipCoords.length; i += 1) {
          if (this.board[shipCoords[i][0]][shipCoords[i][1]] === 1) {
            return false;
          }
        }
        return true;
      };
      // takes start + end coordinates and generates all coordinates for the ship
      this.shipCoords = function shipCoords(startCoord, endCoord, direction) {
        const shipCoords = [];
        if (direction === 'down') {
          for (let i = startCoord[0]; i <= endCoord[0]; i += 1) {
            shipCoords.push([i, startCoord[1]]);
          }
        } else if (direction === 'right') {
          for (let i = startCoord[1]; i <= endCoord[1]; i += 1) {
            shipCoords.push([startCoord[0], i]);
          }
        }
        return shipCoords;
      };
      // checks if ship placement will be out of bounds
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
      // helper function for checking if ship is out of bounds
      this.outOfBounds = function outOfBounds(coord) {
        return !(coord[0] >= 0 && coord[0] < this.board.length && coord[1] >= 0 && coord[1] < this.board.length);
      };
      // takes ship size, start coordinate and direction, and generates end coordinate
      this.shipEndCoord = function shipEndCoord(shipSize, startCoord, direction) {
        const endCoord = startCoord.slice(0);
        if (direction === 'down') {
          endCoord[0] += shipSize - 1;
        } else if (direction === 'right') {
          endCoord[1] += shipSize - 1;
        }
        return endCoord;
      };
      // player takes a shot at enemy coordinate, and checks if hit or miss. If hit, update boards
      this.checkHit = function checkHit(player, coord) {
        const y = coord[0];
        const x = coord[1];
        let jqCoord = this.toId(coord);
        if (player.board[y][x] === 1) {
          this.enemyBoard[y][x] = 2;
          player.board[y][x] = 2;
          console.log('Hit!');
          this.updateEnemyShip(player, coord);
          this.shotsHistory.push(coord);
          $(jqCoord).css('background-color', 'red');
          return true;
        } else {
          console.log('Miss');
          this.enemyBoard[y][x] = 3;
          $(jqCoord).css('background-color', 'blue');

          return false;
        }
      };

      // updates enemy player's board and ship states to reflect a hit
      this.updateEnemyShip = function updateEnemyShip(player, coord) {
        // const y = coord[0];
        // const x = coord[1];
        Object.keys(player.ships).forEach((ship) => {
          const shipCoords = JSON.stringify(player.ships[ship].coordinates);
          const shipCoord = JSON.stringify(coord);
          if (shipCoords.indexOf(shipCoord) !== -1) {
            player.ships[ship].damage += 1;
          }
          if (player.ships[ship].damage === player.ships[ship].size) {
            player.ships[ship].sunk = true;
          }
        });
      };

      this.randomHuntDirection = function randomHuntDirection(directions) { return directions[Math.floor(Math.random()*4)]; };
      this.deleteDirection = function deleteDirection (directions, direction) { return directions.filter(d => d !== direction); };
      this.pickRandomCoord = function pickRandomCoord (coords) { return coords[Math.floor(Math.random() * coords.length)]; };
      this.pickNextHit = (board) => {
        const possibles = [];
        for (let i = 0; i < board.length; i += 1) {
          for (let j = 0; j < board.length; j += 1) {
            if (board[i][j] === 0) { possibles.push ([i, j]); }
          }
        }
        return this.pickRandomCoord(possibles);
      };
      this.aiTurn = function aiTurn(player) {
        if (this.hunt.huntStage === 0) {
          const nextHit = this.pickNextHit(this.enemyBoard);
          this.checkHit(player, nextHit);
        }
        else if (this.hunt.huntStage === 1) {

        }
      };
      // // onTheHuntAI behaviour (implement later)
      // this.checkHunt = function checkHunt() {
      //   if (this.hunt === true) {

      //   }
      // };
      this.randomHit = () => {
        let randomCoord = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
        while (JSON.stringify(this.shotsHistory).indexOf(JSON.stringify(randomCoord)) !== -1) {
          randomCoord = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
        }
        console.log(randomCoord);
        return randomCoord;
      };
      // // place a ship in a random coordinate (to implement later)
      // this.placeRandomShip = (shipName) {

      // }

      // helper function to translate coordinate to html id
      this.toId = (coord) => {
        return '#' + coord.toString().replace(',', '');
      };
      this.toCoord = (id) => {
        const arr = [];
        arr.push (Number(id[0]));
        arr.push (Number(id[1]));
        return arr;
      };

    }
  }


  const player1 = new Player('1');
  const player2 = new Player('2');

  // tests


  player1.initEmptyBoard('self', 10);
  player1.initEmptyBoard('enemy', 10);
  // player1.placeShip('Carrier', [0, 0], 'down');
  // player1.placeShip('Battleship', [0, 1], 'down');
  // player1.placeShip('Destroyer', [0, 3], 'down');
  // player1.placeShip('Cruiser', [0, 4], 'down');
  // player1.placeShip('Submarine', [0, 5], 'down');

  player2.initEmptyBoard('enemy', 10);
  player2.initEmptyBoard('self', 10);
  player2.placeShip('Carrier', [1, 0], 'down');
  player2.placeShip('Battleship', [1, 1], 'down');
  player2.placeShip('Destroyer', [1, 3], 'down');
  player2.placeShip('Cruiser', [1, 4], 'down');
  player2.placeShip('Submarine', [1, 5], 'down');






  if (state === 0) {

    console.log('place first ship');
    if (player1.ships.Carrier.placed === false) {
      $('.square').click(function(event){
        const coord = player1.toCoord((event.target.id));
        player1.placeShip('Carrier', coord, 'down');
      });
    }

  }

  // console.log(player2);

  // player1.checkHit(player2, [3, 5]);
  // player1.checkHit(player2, [3, 6]);
  // player1.checkHit(player2, [3, 7]);
  // player1.checkHit(player2, [4, 5]);
  // player1.checkHit(player2, [5, 5]);
  // player1.checkHit(player2, [6, 5]);
  // player1.checkHit(player2, [7, 5]);
  // player1.checkHit(player2, [8, 5]);
  // player1.checkHit(player2, player1.randomHit());

  // console.log('------------player 1 enemy board--------');
  // console.log(player1.enemyBoard);
  // console.log('----------------------------------------');

  // console.log('------------player 2 board--------------');
  // console.log(player2.board);
  // console.log('----------------------------------------');
  // console.log('------------player 2 ships--------------');
  // console.log(player2.ships);
  // console.log('----------------------------------------');


  // console.log(player1.ships.Battleship.coordinates);
  // console.log(player1.ships[0].coords);


  /* Implementation of console inputs  - to do later
  // const initialize = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout,
  // });

  // initialize.question('Please place the carrier and indicate
  // which direction to place it [up, down, left, right]', (coord)
  // => {
  //   player1.placeShip(5, coord[0], coord[1]);
  //   console.log(coord[0]);
  //   console.log(coord[1]);
  //   player1.drawBoard();
  //   initialize.close();
  // });
  */


  // execution
  // player1.initEmptyBoard('self', 10);
  // player1.initEmptyBoard('enemy', 10);
  // player2.initEmptyBoard('self', 10);



  const hunt = {
    hunt: false,
    huntStage: 0,
    huntDirection: '',
    huntPossibilities: ['up', 'down', 'left', 'right'],
    hunts: [],
    huntHits: [],
  };




  player2.aiTurn(player1);
  player2.aiTurn(player1);
  player2.aiTurn(player1);
  player2.aiTurn(player1);
  player2.aiTurn(player1);
  player2.aiTurn(player1);
  player2.aiTurn(player1);
  player2.aiTurn(player1);
  player2.aiTurn(player1);
  player2.aiTurn(player1);
  player2.aiTurn(player1);
  player2.aiTurn(player1);
  player2.aiTurn(player1);
  player2.aiTurn(player1);
  player2.aiTurn(player1);
  player2.aiTurn(player1);
  player2.aiTurn(player1);
  console.log('------------player 1 board--------------');
  console.log(player1.board);
  console.log('----------------------------------------');
  console.log('------------player 1 enemy board--------------');
  console.log(player1.enemyBoard);
  console.log('----------------------------------------');
  console.log('------------player 2 board--------');
  console.log(player2.board);
  console.log('----------------------------------------');
  console.log('------------player 2 enemy board--------');
  console.log(player2.enemyBoard);
  console.log('----------------------------------------');

});