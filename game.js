$(function() {

  let state = 0;
  let shipsPlaced = 0;
  let turnTracker = 0;
  let players = 1;
  class Player {
    constructor(name) {
      this.name = `Player_${name}`;
      this.boardSize = 0;
      this.board = []; // board state
      this.enemyBoard = []; // player's view of enemy board
      this.hunt = { // onTheHunt AI object
        hunt: false,
        huntStage: 0,
        currDirection: '',
        firstDirection: '',
        huntPossibilities: ['up', 'down', 'left', 'right'],
        currHunt: [],
        huntMisses: [],
        firstHit: [],
      };
      this.shotsHistory = [];
      // ships state
      this.shipsSunk = [];
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
          $('.text').html('This ship was placed already');
        } else if (this.checkShipValidity(shipSize, startCoord, direction)
          && this.checkShipCollision(shipCoordsArray)) {
          this.initShip(shipName, shipCoordsArray);
          // logic for ship placement: fills coordinates between start and end coordinates
          for (let i = 0; i < shipCoordsArray.length; i += 1) {
            this.board[shipCoordsArray[i][0]][shipCoordsArray[i][1]] = 1;
          }
        } else {
          $('.text').html('invalid placement');
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
        if(this.name == 'Player_1') {
          for (const coord of shipCoordsArray) {
            let id = this.toId(coord).slice(0, 1) + 'b' + this.toId(coord).slice(1, 3);
            $(id).css('background-color', 'yellow');
          }
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
          $('.text').html('ship start location is out of bounds');
          return false;
        }
        if (this.outOfBounds(endCoord)) {
          $('.text').html('ship end location is out of bounds');
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
        if (this.enemyBoard[y][x] !== 0) {
          return false;
        } else if (player.board[y][x] === 1) {
          player.board[y][x] = 2;
          this.enemyBoard[y][x] = 2;
          this.updateEnemyShip(player, coord);
          this.shotsHistory.push(coord);
          if (this.name === 'Player_1') {
            $('.text').html('Hit!');
            $(jqCoord).css('background-color', 'red');
          } else {
            $(jqCoord.slice(0, 1) + 'b' + jqCoord.slice(1, 3)).css('background-color', 'red');
          }

          if (player.shipsSunk.length === 5) {
            state = 3;
          }
          return true;
        } else if (player.board[y][x] === 0) {
          this.enemyBoard[y][x] = 3;
          if (this.name === 'Player_1') {
            $('.text').html('Miss');
            $(jqCoord).css('background-color', 'blue');
          } else {
            $(jqCoord.slice(0, 1) + 'b' + jqCoord.slice(1, 3)).css('background-color', 'blue');
          }
          return true;
        }
      };

      // updates enemy player's board and ship states to reflect a hit
      this.updateEnemyShip = function updateEnemyShip(player, coord) {
        Object.keys(player.ships).forEach((ship) => {
          const shipCoords = JSON.stringify(player.ships[ship].coordinates);
          const shipCoord = JSON.stringify(coord);
          if (shipCoords.indexOf(shipCoord) !== -1) {
            player.ships[ship].damage += 1;
          }
          if (player.ships[ship].damage === player.ships[ship].size && !player.ships[ship].sunk) {
            player.ships[ship].sunk = true;
            player.shipsSunk.push(ship);
            $('.sunkList').append(`<p>${ship}</p>`);
          }
        });
      };
      this.randomNextHit = (board) => {
        const possibles = [];
        for (let i = 0; i < board.length; i += 1) {
          for (let j = 0; j < board.length; j += 1) {
            if (board[i][j] === 0) { possibles.push ([i, j]); }
          }
        }
        return this.pickRandomCoord(possibles);
      };
      this.pickRandomCoord = function pickRandomCoord (coords) { return coords[Math.floor(Math.random() * coords.length)]; };

      this.randomHuntDirection = function randomHuntDirection(directions) { return directions[Math.floor(Math.random()*4)]; };
      this.deleteDirection = function deleteDirection (directions, direction) { return directions.filter(d => d !== direction); };
      this.pickHuntDirection = function pickHuntDirection (firstHitCoords) {
        if (firstHitCoords[0] === 0) {
          this.hunt.huntPossibilities.filter(ele => !(ele == 'up'));
        }
        if (firstHitCoords[0] === 9) {
          this.hunt.huntPossibilities.filter(ele => !(ele == 'down'));
        }
        if (firstHitCoords[1] === 0) {
          this.hunt.huntPossibilities.filter(ele => !(ele == 'left'));
        }
        if (firstHitCoords[1] === 9) {
          this.hunt.huntPossibilities.filter(ele => !(ele == 'right'));
        }
        const direction = this.hunt.huntPossibilities[Math.floor(Math.random() * this.hunt.huntPossibilities.length)];
        return direction;
      };
      this.huntNext = function (direction, currentHunt) {
        let hitCoord;
        if (direction == 'up') {
          hitCoord = [currentHunt[0] - 1, currentHunt[1]];
        } else if (direction == 'down') {
          hitCoord = [currentHunt[0] + 1, currentHunt[1]];
        } else if (direction == 'left') {
          hitCoord = [currentHunt[0], currentHunt[1] - 1];
        } else if (direction == 'right') {
          hitCoord = [currentHunt[0], currentHunt[1] + 1];
        }
        return hitCoord;
      };
      this.checkValid = function (coord) { return !(coord[0] < 0 || coord[0] > 9 || coord[1] < 0 || coord[1] > 9); };

// --------------------------------problem----------------------------------------//
// huntStage isn't being advanced correctly
      this.aiTurn = function aiTurn(player) {
        if (this.hunt.huntStage === 0) {
          const thisHit = this.randomNextHit(this.enemyBoard);
          this.checkHit(player, thisHit);
          // if (player.board[thisHit[0]][thisHit[1]] === 2) {
          //   this.hunt.huntStage = 1;
          //   this.hunt.firstHit = thisHit;
          //   this.hunt.currHunt = thisHit;
          //   this.hunt.huntDirection = this.pickHuntDirection(thisHit);
          //   this.hunt.firstDirection = this.hunt.huntDirection;
          //   this.deleteDirection(this.hunt.huntPossibilities, this.hunt.huntDirection);
          // }
        }
        else if (this.hunt.huntStage === 1) {
          // const thisHit;
          // do {
          //   thisHit = this.huntNext(this.hunt.huntDirection, this.hunt.currHunt);
          //   if (this.checkValid(thisHit)) {
          //     this.checkHit(player1, thisHit);
          //     this.hunt.currHunt = thisHit;
          //     if (player.board[thisHit[0]][thisHit[1]] === 2) {

          //     }
          //   } else {
          //     this.hunt.deleteDirection(this.hunt.huntDirection);
          //     this.hunt.huntDirection = this.pickHuntDirection(thisHit);
          //   }
          // } while (!this.checkValid(thisHit));
        }
        turnTracker = 1;
      };



      this.randomHit = () => {
        let randomCoord = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
        while (JSON.stringify(this.shotsHistory).indexOf(JSON.stringify(randomCoord)) !== -1) {
          randomCoord = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
        }
        return randomCoord;
      };
      // // place a ship in a random coordinate (to implement later)
      // this.placeRandomShip = (shipName) {

      // }

      // helper functions to translate between coordinate and html element id
      this.toId = (coord) => {
        return '#' + coord.toString().replace(',', '');
      };
      this.toCoord = (id) => {
        const arr = [];
        arr.push(Number(id.replace('b', '')[0]));
        arr.push(Number(id.replace('b', '')[1]));
        return arr;
      };

    }
  }

  const shipNames = {
    0: 'Carrier',
    1: 'Battleship',
    2: 'Cruiser',
    3: 'Submarine',
    4: 'Destroyer',
  };
  const shipSizes = {
    0: 5,
    1: 4,
    2: 3,
    3: 3,
    4: 2,
  };
  const opposites = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left',
  };


  // game state functions
  const shipHover = (ship, coord, direction) => {
    const end = player1.shipEndCoord(shipSizes[ship], coord, direction);
    const coords = player1.shipCoords(coord, end, direction);
    return ids = coords.map(ele => player1.toId(ele));

  };
  const placeShip = (player, ship, coord, orientation) => {
    const shipName = shipNames[ship];
    if (!player.ships[shipName].placed) {
      player.placeShip(shipName, coord, orientation);
      if (player.ships[shipName].placed) {
        if (shipsPlaced < 4) { $('.text').html('Place ' + shipNames[ship + 1]); }
        if (shipsPlaced == 4) { $('.text').html('Click on a square to shoot'); }
        shipsPlaced += 1;
      }
    }
  };

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


  // this handles button clicks
  let direction = 'down';
  $('#btnOne').click(function(){
    if (state === 0) {
      // pre-game
      state = 1;
      $('#btnOne').html('Vertical');
      $('#btnTwo').html('Horizontal');
      $('.text').html('Place Carrier');
    }
    else if (state === 1) {
      // setup: this button will switch placement direction to vertical
      direction = 'down';
    }
    else {
      // play phase
    }
  });
  $('#btnTwo').click(function(){
    if (state === 0) {
    // pre-game - set players to two (not implemented)
      players = 2;
      $('#topTitle').html('Player 1\'s Board');
      $('#botTitle').html('Player 2\'s Board');
    }
    if (state === 1) {
      // setup: this button will switch placement direction to horizontal
      direction = 'right';
    }
  });

  // this handles square clicks
  $('.square').click(function(event){
    if (state === 1 && $(event.target).parents().hasClass('bottom')) {
      const coord = player1.toCoord((event.target.id));
      placeShip(player1, shipsPlaced, coord, direction);
      if (shipsPlaced === 5) {
        state = 2;
        turnTracker = 1;
        $('#btnOne').remove();
        $('#btnTwo').remove();
        $('.layout').prepend('<h3 style="padding-left: 10px;">Ships Sunk:</h3>');
      }
    }
    if (state === 2 && turnTracker === 1) {
      if ($(event.target).parents().hasClass('top')) {
        if (player1.checkHit(player2, player1.toCoord(event.target.id))) {
          turnTracker = 2;
        }
        if (turnTracker === 2) {
          player2.aiTurn(player1);
        }
      }
      if (state === 3) {
        if (player1.ships.shipsSunk === 5){
          alert ('You Lost!');
        } else {
          alert('You"ve Won!');
        }
        $('.sunkList').append('<button onclick="window.location.reload()">Play Again</button>');
      }
    }
  });

  // mouseover
  $('.square').hover(
    function(event) {
      if ($(event.target).parents().hasClass('bottom') && state === 1) {
        const coord = player1.toCoord(event.target.id);
        const ids = shipHover(shipsPlaced, coord, direction).filter(ele => ele.length === 3);
        for (let id of ids) {
          $(id.slice(0, 1) + 'b' + id.slice(1, 3)).addClass('highlight');
        }
      }

    }, function(event) {

      if ($(event.target).parents().hasClass('bottom') && state === 1) {
        const coord = player1.toCoord(event.target.id);
        const ids = shipHover(shipsPlaced, coord, direction);
        for (let id of ids) {
          $(id.slice(0, 1) + 'b' + id.slice(1, 3)).removeClass('highlight');
        }
      }

    }
  );
});


