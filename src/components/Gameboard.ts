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

  // Returns an object with four arrays, each representing different states of the game board tiles: shipHit, shipNotHit, missed, and notShot.
  get getBoardStates(): { [state: string]: [number, number][] } {
    const states: { [state: string]: [number, number][] } = {
      shipHit: [],
      shipNotHit: [],
      missed: [],
      notShot: [],
    };

    for(let i = 0; i < this.size; ++i) {
      for(let j = 0; j < this.size; ++j) {
        const tile = this.tiles[i][j];
        if(typeof tile === "boolean") {
          if(!tile) {
            states.notShot.push([i, j]);
          }
          else {
            states.missed.push([i, j]);
          }
        }
        else {
          const shipParts = tile.getParts;
          const shipOrigin = tile.getOrigin;
          const partToHit = shipOrigin[0] - i + (shipOrigin[1] - j);
          if(!shipParts[partToHit]) {
            states.shipNotHit.push([i, j]);
          }
          else {
            states.shipHit.push([i, j]);
          }
        }
      }
    }
    return states;
  }

  //Determines and returns an array of valid tiles for ship placement. 
  // It checks surrounding tiles to ensure a ship can be placed without overlapping or being adjacent to other ships.
  get getValidTiles(): [number, number][] {
    const valid: [number, number][] = []; // valid = eventually contain all the coordinates of tiles where a ship can start.
    const offset: [number, number][] = [ // offset = coordinate offsets representing all 8 directions around a tile (including diagonals).
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    // Iterate Over the Board
    // For each tile, check if all surrounding tiles are valid.  
    // If so, the current tile is added to the valid array.
    for(let i = 0; i < this.size; ++i) {
      for(let j = 0; j < this.size; ++j) {
        if(

          //Boundary Condition: If the surrounding tile is outside the board (checks like i + off[0] < 0), it's considered a valid surrounding tile for this purpose (since it's not interfering with any other ship).
          offset.every((off) => {
            if(
              i + off[0] < 0 ||
              i + off[0] > this.size - 1 ||
              j + off[1] < 0 ||
              j + off[1] > this.size - 1
            ) {
              return true;
            }
            // Check for Empty Tiles: If a surrounding tile is on the board, it must be false (indicating no ship is placed there) to be considered valid.
            return this.tiles[i + off[0]][j + off[1]] === false;
          })
        ) {
          // all surrounding tiles are valid, the current tile is added to the valid array.
          valid.push([i, j]);
        }
      }
    }
    return valid;
  }

  // Ship Placement and Movement

  /**
   *  Places a ship on the board. It checks if the placement is valid and updates the tiles array with the Battleship object.
   *
   * @param shipLength The length of the ship.
   * @param location The starting location of the ship as [x, y] coordinates.
   * @param isVertical Specifies whether the ship is placed vertically (true) or horizontally (false).
   * @throws Error if the ship placement is invalid.
   */placeShip(shipLength: number, location: [number, number], rotated: boolean): void {
  // Check for valid placement locations on the board (tiles not yet shot)
  const validPlacement = this.getBoardStates.notShot;

  // Create a new Battleship object
  const battleship = new Battleship(shipLength, [location[0], location[1]], rotated);

  // Calculate offsets for the placement of each part of the ship
  const placementOffset: [number, number][] = Array.from(
    { length: shipLength },
    (_, k) => (rotated ? [k, 0] : [0, k])
  );

  // Define offsets for surrounding tiles of each ship part
  const contactOffset: number[][] = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];

  // Iterate over each part of the ship to validate placement
  placementOffset.forEach((placement) => {
    // Check if the placement is within valid areas
    if (!validPlacement.some(
      (tile) => tile[0] === location[0] - placement[0] &&
                tile[1] === location[1] - placement[1]
    )) {
      throw new Error("Invalid ship placement.");
    }

    // Check for adjacent ships or out-of-boundary placements
    contactOffset.forEach((contact) => {
      const adjustedX = location[0] - placement[0] + contact[0];
      const adjustedY = location[1] - placement[1] + contact[1];

          // adjustedX < 0 || adjustedX > this.size - 1 ||
          // adjustedY < 0 || adjustedY > this.size - 1 ||

      if ( (adjustedX >= 0 && adjustedX <= this.size - 1) && (adjustedY >= 0 && adjustedY <= this.size - 1) && 
          (this.tiles[adjustedX][adjustedY])) {
        throw new Error("Invalid ship placement.");
      }
    });
  });

  // Place the ship on the board
  placementOffset.forEach((placement) => {
    this.tiles[location[0] - placement[0]][location[1] - placement[1]] = battleship;
  });

  // Add the ship to the list of ships on the board
  this.ships.push(battleship);
}

  /**
   * Removes a ship from the board at the specified location.
   * If the tile at the location does not contain a ship, nothing happens.
   *
   * @param location - The location of the ship to be removed.
   * @returns The removed ship, if any.
   */  
  removeShip(location: number[]): void | Battleship {
    if(typeof this.tiles[location[0]][location[1]] === "boolean") return;

    const ship = this.tiles[location[0]][location[1]] as Battleship;
    const shipLength = ship.getLength;
    const shipOrigin = ship.getOrigin;
    const shipRotated = ship.getRotated;
    const offset: [number, number][] = Array.from(
      {length: shipLength},
      (_, k) => (shipRotated ? [k, 0] : [0, k])
    );

    offset.forEach((off) => {
      this.tiles[shipOrigin[0] - off[0]][shipOrigin[1] - off[1]] = false;
    });
    this.ships = this.ships.filter((ship) =>
      ship.getLength !== shipLength ||
      ship.getOrigin[0] !== shipOrigin[0] ||
      ship.getOrigin[1] !== shipOrigin[1] ||
      ship.getRotated !== shipRotated
    );

    return ship;
  }

  /**
   * Rotates a ship on the board.
   * @param location The location of the ship to rotate.
   * @returns True if the ship was successfully rotated, false otherwise.
   */
  rotateShip(location: [number, number]): boolean {
    const ship = this.removeShip(location);
    if(ship) {
      try {
        this.placeShip(ship.getLength, ship.getOrigin, !ship.getRotated);
        return true;
      }
      catch {
        this.placeShip(ship.getLength, ship.getOrigin, ship.getRotated);
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
    if(ship) {
      try {
        this.placeShip(ship.getLength, to, ship.getRotated);
        return true;
      }
      catch {
        this.placeShip(ship.getLength, from, ship.getRotated);
        return false;
      }
    }
    return false;
  }

  // Gameplay Mechanics

/**
   * Receives an attack at the specified location on the board.Updates the board state based on whether the attack hits a ship or misses.
   *
   * @param location - The coordinates of the attack in the form [row, column].
   * @returns True if the attack is valid and hits a ship, false otherwise.
   */  
  getAttacked(location: [number, number]): boolean {
    const state = this.getBoardStates;
    const validAttacks = [...state.shipNotHit, ...state.notShot];
    if(!validAttacks.some((attack) => attack[0] === location[0] && attack[1] === location[1])) {
      return false;
    }
    if(state.notShot.find((el) => el[0] === location[0] && el[1] === location[1])) {
      this.tiles[location[0]][location[1]] = true;
      return true;
    }
    if(state.shipNotHit.find((el) => el[0] === location[0] && el[1] === location[1])) {
      const tile = this.tiles[location[0]][location[1]];
      (tile as Battleship).hit(
        ((tile as Battleship).getOrigin[0] - location[0]) + ((tile as Battleship).getOrigin[1] - location[1])
      );
      this.markAroundSunk(tile as Battleship);
      return true;
    }
    return false;
  }

/**
 * Checks if all the ships on the board are sunk.
 * @returns {boolean} True if all ships are sunk, false otherwise.
 */  allSunk(): boolean {
    return this.ships.every((ship) => ship.isSunk());
  }

  //  Automatically places the specified ships on the board in random locations.
  generateRandomShips(ships: number[]): boolean {
    const done: boolean[] = [];
    ships
      .sort((a, b) => b - a)
      .forEach((len) => {
        let success = false;
        const tried: [[number, number], boolean][] = [];
        let location: [number, number] = [
          Math.floor(Math.random() * this.size),
          Math.floor(Math.random() * this.size)
        ];
        let rotated: boolean = Math.random() < .5;
        const find = () => {
          return tried.find((el) =>
            el[0][0] === location[0] && el[0][1] === location[1] && el[1] === rotated
          );
        }
        do {
          try {
            do {
              location = [
                Math.floor(Math.random() * this.size),
                Math.floor(Math.random() * this.size)
              ];
              rotated = Math.random() < .5;
            } while(
              find()
            );
            this.placeShip(len, location, rotated);
            success = true;
          }
          catch {
            tried.push([location, rotated]);
            success = false;
          }
        } while(!success && tried.length < this.size * this.size);
        done.push(success);
      });
    return done.every((d) => d);
  }

  // : Marks tiles around a sunk ship as 'missed' shots, to indicate that no other ships can be adjacent to the sunk ship.
  private markAroundSunk(ship: Battleship): void {
    if(ship.isSunk()) {
      const origin = ship.getOrigin;
      const partsOffset = Array.from({length: ship.getLength}, (_, k) => ship.getRotated ? [k, 0] : [0, k]);
      const aroundOffset: number[][] = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ];
      partsOffset.forEach((part) => {
        aroundOffset.forEach((around) => {
          if(
            origin[0] - part[0] + around[0] < 0 ||
            origin[0] - part[0] + around[0] > this.size - 1 ||
            origin[1] - part[1] + around[1] < 0 ||
            origin[1] - part[1] + around[1] > this.size - 1
          ) {
            return;
          }
          if(!this.tiles[origin[0] - part[0] + around[0]][origin[1] - part[1] + around[1]]) {
            this.tiles[origin[0] - part[0] + around[0]][origin[1] - part[1] + around[1]] = true;
          }
        });
      });
    }
  }
}

export default Gameboard;