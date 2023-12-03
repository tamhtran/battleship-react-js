import Gameboard from "../Gameboard";
import Battleship from "../Battleship";


describe("Gameboard", () => {
    let gameboard: Gameboard;

    beforeEach(() => {
        gameboard = new Gameboard(10);
    });

    describe("placeShip", () => {
        it("should place a ship on the board", () => {
             gameboard.placeShip(2, [2, 2], false);
            const tiles = gameboard.getTiles;
            expect(tiles[2][2]).toBeInstanceOf(Battleship);
            expect(tiles[2][1]).toBeInstanceOf(Battleship);
        });

        it("should throw an error if the ship placement is invalid", () => {
            expect(() => {
                gameboard.placeShip(4, [0, 0], true);
            }).toThrow("Invalid ship placement");
        });
    });

    describe("removeShip", () => {
        it("should remove a ship from the board", () => {
            gameboard.placeShip(3, [0, 2], false);
            const removedShip = gameboard.removeShip([0, 0]);
            expect(removedShip).toBeInstanceOf(Battleship);
            const tiles = gameboard.getTiles;
            expect(tiles[0][0]).toBe(false);
            expect(tiles[1][0]).toBe(false);
            expect(tiles[2][0]).toBe(false);
        });

        it("should do nothing if the tile does not contain a ship", () => {
            const removedShip = gameboard.removeShip([0, 0]);
            expect(removedShip).toBeUndefined();
        });
    });

    describe("rotateShip", () => {
        it("should successfully rotate a ship", () => {
            gameboard.placeShip(3, [4, 4], false);         
            expect(  gameboard.rotateShip([4, 4])).toBe(true);
            // Expect the ship to be horizontal now
            expect(gameboard.getTiles[4][4]).toBeInstanceOf(Battleship);
            expect(gameboard.getTiles[3][4]).toBeInstanceOf(Battleship);
            expect(gameboard.getTiles[2][4]).toBeInstanceOf(Battleship);
        });
    
        it("should fail to rotate a ship due to collision", () => {
            gameboard.placeShip(3, [4, 4], true); // Place a vertical ship
            gameboard.placeShip(3, [4, 6], true); // Place another ship that will collide upon rotation
            expect(gameboard.rotateShip([4, 6])).toBe(false);
            // Expect the original ship to remain vertical
            expect(gameboard.getTiles[4][6]).toBeInstanceOf(Battleship);
            expect(gameboard.getTiles[3][6]).toBeInstanceOf(Battleship);
            expect(gameboard.getTiles[2][6]).toBeInstanceOf(Battleship);
        });
    });

    describe("moveShip", () => {
        it("should successfully move a ship", () => {
            gameboard.placeShip(3, [0, 2], false);
            expect(gameboard.moveShip([0, 2], [2, 2])).toBe(true);
            expect(gameboard.getTiles[2][0]).toBeInstanceOf(Battleship);
            expect(gameboard.getTiles[2][1]).toBeInstanceOf(Battleship);
            expect(gameboard.getTiles[2][2]).toBeInstanceOf(Battleship);
        });
    
        it("should fail to move a ship due to invalid new location", () => {
            gameboard.placeShip(3, [0, 2], false);
            expect(gameboard.moveShip([0, 2], [0, 0])).toBe(false); // Invalid move due to out of bounds
            expect(gameboard.getTiles[0][0]).toBeInstanceOf(Battleship); // Original position should remain unchanged
        });
    });
    
    describe("getAttacked", () => {
        it("should hit a ship", () => {
            gameboard.placeShip(3, [0, 2], false);
            expect(gameboard.getAttacked([0, 0])).toBe(true);
            expect(gameboard.getBoardStates.shipHit).toContainEqual([0, 0]);
        });
    
        it("should miss any ship", () => {
            gameboard.placeShip(3, [0, 2], false);
            expect(gameboard.getAttacked([5, 5])).toBe(true);
            expect(gameboard.getBoardStates.missed).toContainEqual([5, 5]);
        });
    
        it("should handle invalid attack on already hit or missed tile", () => {
            gameboard.placeShip(3, [0, 2], false);
            gameboard.getAttacked([0, 0]); // Hit
            expect(gameboard.getAttacked([0, 0])).toBe(false); // Invalid because already hit
        });
    });
    

    describe("allSunk", () => {
        it("should return true when all ships are sunk", () => {
            gameboard.placeShip(1, [0, 0], false);
            gameboard.getAttacked([0, 0]);
            expect(gameboard.allSunk()).toBe(true);
        });
    
        it("should return false when some ships are still not sunk", () => {
            gameboard.placeShip(1, [0, 0], false);
            gameboard.placeShip(1, [2, 1], false);
            gameboard.getAttacked([0, 0]); // Only one ship is hit
            expect(gameboard.allSunk()).toBe(false);
        });
    });


    describe("generateRandomShips", () => {
        it("should successfully distribute ships", () => {
            const result = gameboard.generateRandomShips([2, 3, 3, 4, 5]);
            expect(result).toBe(true);
            expect(gameboard.getShips.length).toBe(5);
        });
    
        it("should fail to distribute ships on a highly congested board", () => {
             // Pre-fill the board to create a congested scenario
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (i%2 === 0 && j%2 === 0 && i !== j) {
                    gameboard.placeShip(1, [i, j], false);
                    }
                }
            }
            const result = gameboard.generateRandomShips([2, 3, 3, 4, 5]);
            expect(result).toBe(false);
        });
    });
    
});
