import Player from "../Player";
import Gameboard from "../Gameboard";
// import { expect, jest, test } from "@jest/globals";


describe('Player', () => {


    it('should choose a valid attack location', () => {
        const getGameboardStates = jest.fn().mockReturnValue({
            shipHit: [[1, 1]],
            shipNotHit: [],
            missed: [],
            unShot: [[2, 2], [3, 3], [4, 4]]
        });
        const isWithinBoard = jest.fn().mockReturnValue(true);
        const receiveAttack = jest.fn().mockReturnValue(true);
        jest.mock('../Gameboard', () => {
            return jest.fn().mockImplementation(() => {
                return {
                    getGameboardStates: getGameboardStates,
                    isWithinBoard: isWithinBoard,
                    receiveAttack: receiveAttack
                };
            });
        });
    
        const board = new Gameboard(10);
        const player = new Player(board, "player");
        const attackLocation = player.chooseAttack(board);
        expect(attackLocation).toEqual(expect.any(Array));
        expect(attackLocation.length).toBe(2);


    });
    

    it('should correctly initialize a player with a board and a name', () => {
        const player = new Player(new Gameboard(10), "Test Player");
        expect(player.getBoard).toBeInstanceOf(Gameboard);
        expect(player.getName).toBe('Test Player');
    });
    

    test("simple constructor test", () => {
        const player = new Player(new Gameboard(1), "player");
        expect(player.getName).toEqual("player");
        expect(player.getBoard).toBeInstanceOf(Gameboard);
    });

    test("simple chooseAttack test", () => {
        const player = new Player(new Gameboard(1), "player");
        const enemyBoard = new Gameboard(1);
        expect(player.chooseAttack(enemyBoard)).toEqual([0, 0]);
    });
    
});


