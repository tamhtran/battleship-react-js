import Battleship from "./Battleship";

class Gameboard {
  private size: number; //number of tiles in one dimension
  private tiles: (boolean | Battleship)[][]; //false if not shot, true if missed, Battleship if hit
  private ships: Battleship[]; //array of Battleship objects

  constructor(size: number) {
    this.size = size;
    this.tiles = Array.from({ length: size }, () =>
      new Array(size).fill(false)
    ); // all tiles are empty at the beginning
    this.ships = [];
  }

  // ... [Getters]
  get getTiles(): (boolean | Battleship)[][] {
    return this.tiles;
  }

  get getSize(): number {
    return this.size;
  }

  get getShips(): Battleship[] {
    return this.ships;
  }

  /**
   * Retrieves the board states, which includes the positions of ships that have been hit, ships that have not been hit,
   * missed shots, and unshot tiles.
   *
   * @returns An object containing the board states with their corresponding positions.
   */
  get getGameboardStates(): { [state: string]: [number, number][] } {
    const states: { [state: string]: [number, number][] } = {
      shipHit: [],
      shipNotHit: [],
      missed: [],
      unShot: [],
    };

    for (let i = 0; i < this.size; ++i) {
      for (let j = 0; j < this.size; ++j) {
        this.addTileToState(i, j, states);
      }
    }

    return states;
  }
  /**
     * Resets the gameboard to its initial state.
     */
  resetGameboard(): void {
    this.tiles = Array.from({ length: this.size }, () => 
        new Array(this.size).fill(false)
    );
    this.ships = [];
}


/**
 * Determines and returns an array of valid tiles for ship placement.
 * 
 * @returns An array of valid tiles represented as [number, number][].
 */
  get getValidTiles(): [number, number][] {
    const valid: [number, number][] = [];
    const offset = [-1, 0, 1]; // Offset to check surrounding tiles

    for (let i = 0; i < this.size; ++i) {
      for (let j = 0; j < this.size; ++j) {
        if (this.isTileValidForPlacement(i, j, offset)) {
          valid.push([i, j]);
        }
      }
    }
    return valid;
  }

  // Helper method used in getBoardStates to determine the state of a tile and add it to the appropriate category.
  private addTileToState(
    x: number,
    y: number,
    states: { [state: string]: [number, number][] }
  ): void {
    const tile = this.tiles[x][y];

    if (typeof tile === "boolean") {
      tile ? states.missed.push([x, y]) : states.unShot.push([x, y]);
      return;
    }

    const partIndex = this.calculatePartIndex(tile, x, y);
    tile.getParts[partIndex]
      ? states.shipHit.push([x, y])
      : states.shipNotHit.push([x, y]);
  }

  // Helper method to calculate the index of the ship part based on its position.
  private calculatePartIndex(ship: Battleship, x: number, y: number): number {
    const [originX, originY] = ship.getOrigin;
    return ship.getIsVertical ? x - originX : y - originY;
  }

  // Helper method Check if a tile is within board boundaries
  isWithinBoard(x: number, y: number): boolean {
    return x >= 0 && x < this.size && y >= 0 && y < this.size;
  }

  //Helper method Check if a tile is empty
  private isTileEmpty(x: number, y: number): boolean {
    return this.isWithinBoard(x, y) && this.tiles[x][y] === false;
  }

  // Helper method to check if a tile is valid for ship placement
  private isTileValidForPlacement(
    x: number,
    y: number,
    offset: number[]
  ): boolean {
    for (let dx of offset) {
      for (let dy of offset) {
        if (!this.isTileEmpty(x + dx, y + dy)) {
          return false;
        }
      }
    }
    return true;
  }


  // Ship Placement and Movement
  ////////////////////////////////////////////////////////
  /**
   *  Places a ship on the board. It checks if the placement is valid and updates the tiles array with the Battleship object.
   *
   * @param shipLength The length of the ship.
   * @param location The starting location of the ship as [x, y] coordinates.
   * @param isVertical Specifies whether the ship is placed vertically (true) or horizontally (false).
   * @throws Error if the ship placement is invalid.
   */
  placeShip(
    shipLength: number,
    location: [number, number],
    isVertical: boolean
  ): void {
    // Constructing the ship and verifying the ship length does not exceed board boundaries
    const ship = new Battleship(shipLength, location, isVertical);
    for (let i = 0; i < shipLength; i++) {
      const [x, y] = isVertical
        ? [location[0] + i, location[1]]
        : [location[0], location[1] + i];
      if (!this.isWithinBoard(x, y) || !this.isTileEmpty(x, y)) {
        throw new Error("Invalid ship placement.");
      }
    }

    // Placing the ship on the board
    for (let i = 0; i < shipLength; i++) {
      const [x, y] = isVertical
        ? [location[0] + i, location[1]]
        : [location[0], location[1] + i];
      this.tiles[x][y] = ship;
    }

    // Adding the ship to the list of ships
    this.ships.push(ship);
  }

  // Helper method to clear the ship from the board.
  private clearShipFromBoard(
    shipLength: number,
    originX: number,
    originY: number,
    shipIsVertical: boolean
  ): void {
    for (let i = 0; i < shipLength; i++) {
      const x = shipIsVertical ? originX + i : originX;
      const y = shipIsVertical ? originY : originY + i;
      this.tiles[x][y] = false;
    }
  }

  /**
   * Removes a ship from the board at the specified location.
   * If the tile at the location does not contain a ship, nothing happens.
   *
   * @param location - The location of the ship to be removed.
   * @returns The removed ship, if any.
   */
  removeShip(location: [number, number]): void | Battleship {
    const tileContent = this.tiles[location[0]][location[1]];

    // Return early if the tile does not contain a ship.
    if (!(tileContent instanceof Battleship)) return;

    const ship = tileContent;
    const shipLength = ship.getLength;
    const [originX, originY] = ship.getOrigin;
    const shipIsVertical = ship.getIsVertical;

    // Clear the ship from the board.
    this.clearShipFromBoard(shipLength, originX, originY, shipIsVertical);

    // Remove the ship from the ships array.
    this.ships = this.ships.filter((s) => s !== ship);

    return ship;
  }

  /**
   * Rotates a ship on the board.
   * @param location The location of the ship to rotate.
   * @returns True if the ship was successfully rotated, false otherwise.
   */
  rotateShip(location: [number, number]): boolean {
    const ship = this.removeShip(location);
    if (ship) {
      try {
        this.placeShip(ship.getLength, ship.getOrigin, !ship.getIsVertical);
        return true;
      } catch {
        this.placeShip(ship.getLength, ship.getOrigin, ship.getIsVertical);
        return false;
      }
    }
    return false;
  }

  /**
   * Moves a ship from one position to another on the board.
   *
   * @param from - The starting position of the ship as an array of [row, column].
   * @param to - The destination position of the ship as an array of [row, column].
   * @returns True if the ship was successfully moved, false otherwise.
   */
  moveShip(from: [number, number], to: [number, number]): boolean {
    const ship = this.removeShip(from);
    if (ship) {
      try {
        this.placeShip(ship.getLength, to, ship.getIsVertical);
        return true;
      } catch {
        //place back to original location if new location is invalid
        this.placeShip(ship.getLength, from, ship.getIsVertical);
        return false;
      }
    }
    return false;
  }


  //Helper method
  private checkAllSurroundingTiles(
    ship: Battleship,
    callback: (x: number, y: number) => void
  ): void {
    const shipLength = ship.getLength;
    const [originX, originY] = ship.getOrigin;
    const isVertical = ship.getIsVertical;
    const offsets = [-1, 0, 1];

    // Loop through each part of the ship
    for (let i = 0; i < shipLength; i++) {
      const partX = isVertical ? originX + i : originX;
      const partY = isVertical ? originY : originY + i;

      // Check and apply the callback to all surrounding tiles
      offsets.forEach((dx) => {
        offsets.forEach((dy) => {
          if (dx === 0 && dy === 0) return; // Skip the ship part itself
          const x = partX + dx;
          const y = partY + dy;
          if (this.isWithinBoard(x, y)) {
            callback(x, y);
          }
        });
      });
    }
  }

  private markAroundSunk(ship: Battleship): void {
    if (ship.isSunk()) {
      this.checkAllSurroundingTiles(ship, (x, y) => {
        if (this.isWithinBoard(x, y) && !this.tiles[x][y]) {
          this.tiles[x][y] = true;
        }
      });
    }
  }

  // Game Mechanics
  ////////////////////////////////////////////////////////
  /**
   * Receives an attack at the specified location on the board.Updates the board state based on whether the attack hits a ship or misses.
   *
   * @param location - The coordinates of the attack in the form [row, column].
   * @returns True if the attack is valid and hits a ship, false otherwise.
   */
  getAttacked(location: [number, number]): boolean {
    const state = this.getGameboardStates;
    const validAttacks = [...state.shipNotHit, ...state.unShot];
    if (
      !validAttacks.some(
        (attack) => attack[0] === location[0] && attack[1] === location[1]
      )
    ) {
      return false;
    }
    if (
      state.unShot.find((el) => el[0] === location[0] && el[1] === location[1])
    ) {
      this.tiles[location[0]][location[1]] = true;
      return true;
    }
    if (
      state.shipNotHit.find(
        (el) => el[0] === location[0] && el[1] === location[1]
      )
    ) {
      const tile = this.tiles[location[0]][location[1]];
      (tile as Battleship).hit(
        (tile as Battleship).getOrigin[0] -
          location[0] +
          ((tile as Battleship).getOrigin[1] - location[1])
      );
      this.markAroundSunk(tile as Battleship);
      return true;
    }
    return false;
  }

/**
 * Checks if all the ships on the board are sunk.
 * @returns {boolean} True if all ships are sunk, false otherwise.
 */
  allSunk(): boolean {
    return this.ships.every((ship) => ship.isSunk());
  }

  //  Automatically places the specified ships on the board in random locations.
  generateRandomShips(ships: number[]): boolean {
    return ships.slice()
      .sort((a, b) => b - a)
      .every((shipLength) => this.tryToPlaceShip(shipLength));
  }

  // Helper method to try to place a ship on the board.
  private tryToPlaceShip(shipLength: number): boolean {
    const triedPositions: Set<string> = new Set();
    let attempts = 0;
    const maxAttempts = 100; // Arbitrary max attempts to prevent near-infinite loops

    while (attempts < maxAttempts) {
      const location: [number, number] = this.getRandomLocation();
      const isVertical: boolean = Math.random() < 0.5;
      
      const positionKey = `${location[0]}-${location[1]}-${isVertical}`;

      if (!triedPositions.has(positionKey)) {
        triedPositions.add(positionKey);
        if (this.canPlaceShip(shipLength, location, isVertical)) {
          this.placeShip(shipLength, location, isVertical);
          return true;
        }
      }
      attempts++;
    }

    return false;
  }

  // Helper method to generate a random location on the board.
  private getRandomLocation(): [number, number] {
    return [
      Math.floor(Math.random() * this.size),
      Math.floor(Math.random() * this.size),
    ];
  }

  // Helper method to check if a ship can be placed at a location.
    private canPlaceShip(
        shipLength: number,
        location: [number, number],
        isVertical: boolean
    ): boolean {
        for (let i = 0; i < shipLength; i++) {
            const [x, y] = isVertical
                ? [location[0] + i, location[1]]
                : [location[0], location[1] + i];

            if (!this.isWithinBoard(x, y) || !this.isTileEmpty(x, y)) {
                return false;
            }
        }

        return true;
    }
}

export default Gameboard;
