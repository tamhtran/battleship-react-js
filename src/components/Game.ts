import Player from "./Player";
import Gameboard from "./Gameboard";

/*
The Game class is responsible for orchestrating the Battleship game, managing players, their turns, the game's initialization, and determining the winner.
*/

class Game {
  private shipSizes: number[];  // Array of ship sizes to be used in the game
  private players: Player[];    // Array to hold the two players
  private currentPlayer: 0 | 1; // Index to track the current player (0 or 1)
  private initialized: boolean; // Flag to check if the game has been initialized
  private winner: -1 | 0 | 1;   // Indicates the winner (-1 for no winner yet, 0 or 1 for respective players)

  constructor(shipSizes: number[], size: number) {
    this.shipSizes = shipSizes; // Set ship sizes
    // Initialize players with gameboards
    this.players = [
      new Player(new Gameboard(size), "Player"),
      new Player(new Gameboard(size), "Computer")
    ];
    this.currentPlayer = 0;     // Start with player 0
    this.initialized = false;   // Initially not initialized
    this.winner = -1;           // No winner at the start

    // Distribute ships for both players
    this.players[0].getBoard.generateRandomShips(this.shipSizes);
    this.players[1].getBoard.generateRandomShips(this.shipSizes);
  }

  // Initializes the game if conditions are met
  init(): void {
    if(this.players[0].getBoard.getShips.length === this.shipSizes.length && !this.initialized) {
      this.initialized = true;
    }
  }

  // Getter for the current player
  get getCurrentPlayer(): Player {
    return this.players[this.currentPlayer];
  }

  // Getter for the opponent player
  get getOpponent(): Player {
    return this.players[1 - this.currentPlayer];
  }

  // Getter for the current turn
  get getTurn(): 0 | 1 {
    return this.currentPlayer;
  }

  // Getter for the winner
  get getWinner(): -1 | 0 | 1 {
    return this.winner;
  }

  // Setter for the winner
  set setWinner(winner: -1 | 0 | 1) {
    this.winner = winner;
  }

  // Getter to check if game is initialized
  get getInit(): boolean {
    return this.initialized;
  }

  // Getter for ship sizes
  get getShips(): number[] {
    return this.shipSizes;
  }

  // Get a player by index
  getPlayer(index: 0 | 1): Player {
    return this.players[index];
  }

  // Switch to the next player's turn
  next(): void {
    this.currentPlayer = (1 - this.currentPlayer) as 0 | 1;
  }

  // Execute a player's turn with the given attack location
  playerTurn(location: [number, number]): boolean {
    return this.getOpponent.getBoard.getAttacked(location);
  }

  // Execute the computer player's turn
  computerTurn(): void {
    let attack: [number, number];
    let success = false;
    do {
      // Choose an attack location and attempt the attack
      attack = (this.getCurrentPlayer.chooseAttack(this.getOpponent.getBoard)) as [number, number];
      success = this.getOpponent.getBoard.getAttacked(attack);
    } while(!success);
  }

  // Check if there is a winner
  isWinner(): -1 | 0 | 1 {
    return this.getOpponent.getBoard.allSunk() ? this.currentPlayer : -1;
  }
}

export default Game;
