import Gameboard from "../Gameboard";
import Battleship from "../Battleship";


describe("Gameboard", () => {
    let gameboard: Gameboard;

    beforeEach(() => {
        gameboard = new Gameboard(10);
    });

    describe("placeShip", () => {
        it("should place a ship on the board", () => {
            gameboard.placeShip(3, [0, 0], true);
            const tiles = gameboard.getTiles;
            expect(tiles[0][0]).toBeInstanceOf(Battleship);
            expect(tiles[1][0]).toBeInstanceOf(Battleship);
            expect(tiles[2][0]).toBeInstanceOf(Battleship);
        });

        it("should throw an error if the ship placement is invalid", () => {
            gameboard.placeShip(3, [0, 0], true);
            expect(() => {
                gameboard.placeShip(4, [0, 0], true);
            }).toThrowError("Invalid ship placement");
        });
    });

    describe("removeShip", () => {
        it("should remove a ship from the board", () => {
            gameboard.placeShip(3, [0, 0], true);
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
            gameboard.placeShip(3, [1, 1], true); // Place a vertical ship
            expect(gameboard.rotateShip([1, 1])).toBe(true);
            // Expect the ship to be horizontal now
            expect(gameboard.getTiles[1][1]).toBeInstanceOf(Battleship);
            expect(gameboard.getTiles[1][2]).toBeInstanceOf(Battleship);
            expect(gameboard.getTiles[1][3]).toBeInstanceOf(Battleship);
        });
    
        it("should fail to rotate a ship due to collision", () => {
            gameboard.placeShip(3, [1, 1], true); // Place a vertical ship
            gameboard.placeShip(3, [0, 2], true); // Place another ship that will collide upon rotation
            expect(gameboard.rotateShip([1, 1])).toBe(false);
            // Expect the original ship to remain vertical
            expect(gameboard.getTiles[1][1]).toBeInstanceOf(Battleship);
            expect(gameboard.getTiles[2][1]).toBeInstanceOf(Battleship);
            expect(gameboard.getTiles[3][1]).toBeInstanceOf(Battleship);
        });
    });

    describe("moveShip", () => {
        it("should successfully move a ship", () => {
            gameboard.placeShip(3, [0, 0], false);
            expect(gameboard.moveShip([0, 0], [2, 2])).toBe(true);
            expect(gameboard.getTiles[2][2]).toBeInstanceOf(Battleship);
            expect(gameboard.getTiles[2][3]).toBeInstanceOf(Battleship);
            expect(gameboard.getTiles[2][4]).toBeInstanceOf(Battleship);
        });
    
        it("should fail to move a ship due to invalid new location", () => {
            gameboard.placeShip(3, [0, 0], false);
            expect(gameboard.moveShip([0, 0], [9, 9])).toBe(false); // Invalid move due to out of bounds
            expect(gameboard.getTiles[0][0]).toBeInstanceOf(Battleship); // Original position should remain unchanged
        });
    });
    
    describe("getAttacked", () => {
        it("should hit a ship", () => {
            gameboard.placeShip(3, [0, 0], false);
            expect(gameboard.getAttacked([0, 0])).toBe(true);
            expect(gameboard.getGameboardStates.shipHit).toContainEqual([0, 0]);
        });
    
        it("should miss any ship", () => {
            gameboard.placeShip(3, [0, 0], false);
            expect(gameboard.getAttacked([5, 5])).toBe(true);
            expect(gameboard.getGameboardStates.missed).toContainEqual([5, 5]);
        });
    
        it("should handle invalid attack on already hit or missed tile", () => {
            gameboard.placeShip(3, [0, 0], false);
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
            gameboard.placeShip(1, [1, 0], false);
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
    
        // it("should fail to distribute ships on a highly congested board", () => {
        //      // Pre-fill the board to create a congested scenario
        //     for (let i = 0; i < 9; i++) {
        //         for (let j = 0; j < 9; j++) {
        //             gameboard.placeShip(1, [i, j], false);
        //         }
        //     }
        //     const result = gameboard.generateRandomShips([2, 3, 3, 4, 5]);
        //     expect(result).toBe(false);
        // });
    });

    // describe("Helper Methods", () => {
    //     describe("isWithinBoard", () => {
    //         it("should return true for valid coordinates", () => {
    //             expect(gameboard.isWithinBoard(5, 5)).toBe(true);
    //         });
    
    //         it("should return false for invalid coordinates", () => {
    //             expect(gameboard.isWithinBoard(10, 10)).toBe(false);
    //         });
    //     });
    
    //     describe("isTileEmpty", () => {
    //         it("should return true for empty tile", () => {
    //             expect(gameboard.isTileEmpty(5, 5)).toBe(true);
    //         });
    
    //         it("should return false for occupied tile", () => {
    //             gameboard.placeShip(2, [5, 5], false);
    //             expect(gameboard.isTileEmpty(5, 5)).toBe(false);
    //         });
    //     });
    
    //     describe("isTileValidForPlacement", () => {
    //         it("should return false if adjacent to another ship", () => {
    //             gameboard.placeShip(2, [5, 5], false);
    //             expect(gameboard.isTileValidForPlacement(4, 5, [-1, 0, 1])).toBe(false);
    //         });
    
    //         it("should return true for a valid placement location", () => {
    //             expect(gameboard.isTileValidForPlacement(1, 1, [-1, 0, 1])).toBe(true);
    //         });
    //     });
    // });

    // describe("getValidTiles", () => {
    //     it("should correctly identify all valid tiles for ship placement", () => {
    //         const validTiles = gameboard.getValidTiles;
    //         expect(validTiles.length).toBeGreaterThan(0);
    //     });
    
    //     it("should exclude tiles adjacent to or occupied by ships", () => {
    //         gameboard.placeShip(3, [5, 5], false);
    //         const validTiles = gameboard.getValidTiles;
    //         expect(validTiles).not.toContainEqual([5, 5]);
    //         expect(validTiles).not.toContainEqual([4, 5]);
    //         expect(validTiles).not.toContainEqual([6, 7]);
    //     });
    // });

    describe("getGameboardStates", () => {
        it("should accurately reflect the current state of the board", () => {
            gameboard.placeShip(2, [0, 0], false);
            gameboard.getAttacked([0, 0]);
            gameboard.getAttacked([3, 3]);
    
            const states = gameboard.getGameboardStates;
            expect(states.shipHit).toContainEqual([0, 0]);
            expect(states.shipNotHit).toContainEqual([0, 1]);
            expect(states.missed).toContainEqual([3, 3]);
            expect(states.unShot).toContainEqual([1, 1]);
        });
    });
    
    describe("resetGameboard", () => {
        it("should reset the gameboard", () => {
            gameboard.placeShip(2, [0, 0], false);
            gameboard.getAttacked([0, 0]);
            gameboard.getAttacked([3, 3]);
            gameboard.resetGameboard();
    
            const states = gameboard.getGameboardStates;
            expect(states.shipHit).toEqual([]);
            expect(states.shipNotHit).toEqual([]);
            expect(states.missed).toEqual([]);
            // expect(states.unShot).toEqual([]);

            // Additionally, ensure the tiles and ships arrays are reset
        expect(gameboard.getTiles.every(row => row.every(tile => tile === false))).toBe(true);
        expect(gameboard.getShips.length).toBe(0);
        });
    });    
    
    
});
