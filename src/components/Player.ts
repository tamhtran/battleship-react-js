import Gameboard from "./Gameboard";
import Battleship from "./Battleship";

class Player {

    private board: Gameboard;  // Each player has a Gameboard instance
    private name: string;      // Name of the player
  
    constructor(board: Gameboard, name: string) {
      this.board = board;      // Initializing the player's board
      this.name = name;        // Setting the player's name
    }
  
    // Getter to access the player's gameboard
    get getBoard(): Gameboard {
      return this.board;
    }
  
    // Getter to access the player's name
    get getName(): string {
      return this.name;
    }
  
    // Method for choosing an attack location
    chooseAttack(opponentBoard: Gameboard): number[]  {
      // Extracting board states from the opponent's board
      const { shipHit, shipNotHit, unShot } = opponentBoard.getGameboardStates;
  
      // Find potential attack positions near damaged ships
      let potentialAttacks = this.findPotentialAttacks(shipHit, opponentBoard);
  
      // If no potential attacks, choose randomly from unshot tiles
      if (potentialAttacks.length === 0) {
        potentialAttacks = [...shipNotHit, ...unShot];
      }
  
      // Return a random attack position from the potential attacks
      return potentialAttacks[Math.floor(Math.random() * potentialAttacks.length)];
    }
  
    // Private helper method to find potential attacks around hit ship parts
    private findPotentialAttacks(shipHit: [number, number][], board: Gameboard): [number, number][] {
      const potentialAttacks: [number, number][] = [];
  
      // Loop through each hit part and check if the ship is not sunk
      shipHit.forEach((hit) => {
        if (!(board.getTiles[hit[0]][hit[1]] as Battleship).isSunk()) {
          // Add valid surrounding tiles to potential attacks
          this.addSurroundingTiles(hit, potentialAttacks, board);
        }
      });
  
      return potentialAttacks;
    }
  
    // Adds surrounding tiles to the list of potential attacks
    private addSurroundingTiles(
      position: [number, number],
      potentialAttacks: [number, number][],
      board: Gameboard
    ) {
      const [x, y] = position;
      const offsets = [[-1, 0], [0, -1], [0, 1], [1, 0]];
  
      // Checking each surrounding tile
      offsets.forEach(([dx, dy]) => {
        const newX = x + dx;
        const newY = y + dy;
        // If the tile is attackable, add it to potential attacks
        if (board.isWithinBoard(newX, newY) && this.isAttackable(newX, newY, board)) {
          potentialAttacks.push([newX, newY]);
        }
      });
    }
  
    // Check if a given tile is a valid target for an attack
    private isAttackable(x: number, y: number, board: Gameboard): boolean {
      const tile = board.getTiles[x][y];
      return typeof tile === 'boolean' && !tile; // Tile is attackable if it is unshot
    }
  }
  
export default Player;
