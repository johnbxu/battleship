const readline = require('readline');
const Player = require('./player');

const player1 = new Player('1');
const player2 = new Player('2');

// tests


player1.initEmptyBoard('self', 10);
player1.initEmptyBoard('enemy', 10);
player1.placeShip('Cruiser', [3, 5], 'right');
player1.placeShip('Battleship', [1, 3], 'left');
player1.placeShip('Carrier', [4, 3], 'down');
player1.placeShip('Submarine', [9, 8], 'up');
player1.placeShip('Destroyer', [0, 9], 'down');

player2.initEmptyBoard('self', 10);
player2.placeShip('Cruiser', [3, 5], 'right');
player2.placeShip('Battleship', [1, 3], 'left');
player2.placeShip('Carrier', [4, 3], 'down');
player2.placeShip('Submarine', [9, 8], 'up');
player2.placeShip('Destroyer', [0, 9], 'down');
// console.log(player2);

player1.checkHit(player2, [3, 5]);
player1.checkHit(player2, [3, 6]);
player1.checkHit(player2, [3, 7]);
player1.checkHit(player2, [4, 5]);
player1.checkHit(player2, [5, 5]);
player1.checkHit(player2, [6, 5]);
player1.checkHit(player2, [7, 5]);
player1.checkHit(player2, [8, 5]);
console.log(player1.board);
console.log(player1.enemyBoard);
console.log(player2.board);
console.log(player2.ships);


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
