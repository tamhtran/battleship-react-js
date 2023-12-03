import Player from "../Player";
import Gameboard from "../Gameboard";
// import { expect, jest, test } from "@jest/globals";

// Mock the Gameboard module
// jest.mock('../Gameboard', () => {
//     return jest.fn().mockImplementation(() => {
//         return {
//             //    // Mock the getGameboardStates as a getter
//             //    getGameboardStates: jest.fn().mockImplementation(
//             //     () =>  {
//             //         const states: { [state: string]: [number, number][] } = {
//             //             shipHit: [[1, 1], [2, 2], [3, 3]], // Multiple hit locations
//             //             shipNotHit: [],
//             //             missed: [],
//             //             unShot: [[4, 4], [5, 5], [6, 6]]
//             //           };
//             //     return states
//             // }),
//             isWithinBoard: jest.fn().mockReturnValue(true),
//             isAttackable: jest.fn().mockImplementation((x, y) => ![[1, 1], [2, 2], [3, 3]].some(hit => hit[0] === x && hit[1] === y)),
//         };
//     });
// });


describe('Player', () => {

    it("should able to do a simple chooseAttack test", () => {
        const player = new Player(new Gameboard(1), "player");
        const enemyBoard = new Gameboard(1);
        expect(player.chooseAttack(enemyBoard)).toEqual([0, 0]);
    });
    

    // it('should choose an attack location considering multiple hit ships', () => {
    //     const board = new Gameboard(10);
    //     const player = new Player(board, "player");
        
    //     jest.spyOn(board, 'getGameboardStates', 'get').mockReturnValue(
    //         {
    //                         shipHit: [[1, 1], [2, 2], [3, 3]], // Multiple hit locations
    //                         shipNotHit: [],
    //                         missed: [],
    //                         unShot: [[4, 4], [5, 5], [6, 6]]
    //                       });

    //     const attackLocation = player.chooseAttack(board);
    //     expect(attackLocation).toEqual(expect.any(Array));
    //     expect(attackLocation.length).toBe(2);
    //     expect([[1, 1], [2, 2], [3, 3]]).not.toContainEqual(attackLocation); // The chosen location should not be one of the already hit locations
    // });


    // it('should choose a valid attack location', () => {
    //     const mockGetGameboardStates = jest.fn().mockReturnValue({
    //         shipHit: [[1, 1]],
    //         shipNotHit: [],
    //         missed: [],
    //         unShot: [[2, 2], [3, 3], [4, 4]]
    //     });
    //     const mockIsWithinBoard = jest.fn().mockReturnValue(true);
    //     const mockReceiveAttack = jest.fn().mockReturnValue(true);
    //     jest.mock('../Gameboard', () => {
    //         return jest.fn().mockImplementation(() => {
    //             return {
    //                 getGameboardStates: mockGetGameboardStates,
    //                 isWithinBoard: mockIsWithinBoard,
    //                 receiveAttack: mockReceiveAttack
    //             };
    //         });
    //     });
    
    //     const board = new Gameboard(10);
    //     const player = new Player(board, "player");
    //     const attackLocation = player.chooseAttack(board);
    //     expect(attackLocation).toEqual(expect.any(Array));
    //     expect(attackLocation.length).toBe(2);


    // });


    // it('should choose an attack location near a damaged ship', () => {
    //     const mockGetGameboardStates = jest.fn().mockReturnValue({
    //         shipHit: [[1, 1]],
    //         shipNotHit: [[2, 2]],
    //         missed: [],
    //         unShot: [[3, 3], [4, 4]]
    //     });
    //     const mockIsWithinBoard = jest.fn().mockReturnValue(true);
    //     const mockReceiveAttack = jest.fn((x, y) => x !== 1 || y !== 1); // Mark [1,1] as not attackable (already hit)

    //     jest.mock('../Gameboard', () => {
    //         return jest.fn().mockImplementation(() => {
    //             return {
    //                 getGameboardStates: mockGetGameboardStates,
    //                 isWithinBoard: mockIsWithinBoard,
    //                 isAttackable: mockReceiveAttack
    //             };
    //         });
    //     });

    //     const board = new Gameboard(10);
    //     const player = new Player(board, "player");
    //     const attackLocation = player.chooseAttack(board);
    //     expect(attackLocation).not.toEqual([1, 1]); // Should not attack already hit location
    // });

    // it('should choose a random attack location if no ships have been hit', () => {
    //     const mockGetGameboardStates = jest.fn().mockReturnValue({
    //         shipHit: [],
    //         shipNotHit: [[2, 2]],
    //         missed: [],
    //         unShot: [[3, 3], [4, 4]]
    //     });

    //     jest.mock('../Gameboard', () => {
    //         return jest.fn().mockImplementation(() => {
    //             return {
    //                 getGameboardStates: mockGetGameboardStates
    //             };
    //         });
    //     });

    //     const board = new Gameboard(10);
    //     const player = new Player(board, "player");
    //     const attackLocation = player.chooseAttack(board);
    //     expect(attackLocation).toEqual(expect.any(Array));
    // });

    // it('should not attack already missed locations', () => {
    //     const mockGetGameboardStates = jest.fn().mockReturnValue({
    //         shipHit: [],
    //         shipNotHit: [],
    //         missed: [[2, 2]],
    //         unShot: [[3, 3], [4, 4]]
    //     });

    //     jest.mock('../Gameboard', () => {
    //         return jest.fn().mockImplementation(() => {
    //             return {
    //                 getGameboardStates: mockGetGameboardStates
    //             };
    //         });
    //     });

    //     const board = new Gameboard(10);
    //     const player = new Player(board, "player");
    //     const attackLocation = player.chooseAttack(board);
    //     expect(attackLocation).not.toEqual([2, 2]); // Should not attack already missed location
    // });

    // it('should correctly initialize a player with a board and a name', () => {
    //     const player = new Player(new Gameboard(10), "Test Player");
    //     expect(player.getBoard).toBeInstanceOf(Gameboard);
    //     expect(player.getName).toBe('Test Player');
    // });
    

    // test("simple constructor test", () => {
    //     const player = new Player(new Gameboard(1), "player");
    //     expect(player.getName).toEqual("player");
    //     expect(player.getBoard).toBeInstanceOf(Gameboard);
    // });


});


