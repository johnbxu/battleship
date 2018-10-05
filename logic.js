const Player = require('./player');


const player1 = new Player('1');
const player2 = new Player('2');

// tests


player1.initEmptyBoard('self', 10);
player1.initEmptyBoard('enemy', 10);
player1.placeShip('Cruiser', [0, 0], 'right');
player1.placeShip('Battleship', [0, 7], 'left');
player1.placeShip('Carrier', [2, 5], 'down');
player1.placeShip('Submarine', [9, 8], 'down');
player1.placeShip('Destroyer', [8, 2], 'down');

player2.initEmptyBoard('self', 10);
player2.placeShip('Cruiser', [3, 5], 'right');
player2.placeShip('Battleship', [1, 3], 'left');
player2.placeShip('Carrier', [4, 3], 'down');
player2.placeShip('Submarine', [9, 8], 'up');
player2.placeShip('Destroyer', [0, 9], 'down');
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

console.log('------------player 1 board--------------');
console.log(player1.board);
console.log('----------------------------------------');
console.log('------------player 1 enemy board--------');
console.log(player1.enemyBoard);
console.log('----------------------------------------');

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

const randomHuntDirection = (directions) => directions[Math.floor(Math.random()*4)];
const deleteDirection = (directions, direction) => directions.filter(d => d !== direction);
const pickRandomCoord = (coords) => {
  return coords[Math.floor(Math.random() * coords.length)];
};

const pickNextHit = (board) => {
  const possibles = [];
  for (let i = 0; i < board.length; i += 1) {
    for (let j = 0; j < board.length; j += 1) {
      if (board[i][j] === 0) { possibles.push ([i, j]); }
    }
  }
  return pickRandomCoord(possibles);
};
const aiTurn = () => {
  if (hunt.huntStage === 0) {
    player1.checkHit(player2, pickNextHit(player1.enemyBoard));
  }
  else if (huntStage === 1) {

  }
};


aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
aiTurn();
console.log('------------player 1 enemy board--------');
console.log(player1.enemyBoard);
console.log('----------------------------------------');
