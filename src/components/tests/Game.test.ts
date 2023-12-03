import Game from '../Game';
import Player from '../Player';
import Gameboard from '../Gameboard';


describe('Game', () => {
    let game: Game;

    beforeEach(() => {
        game = new Game([2, 3, 3], 10);
    });

    it('should initialize correctly', () => {        
        // game = new Game([2, 3, 3], 10);
        expect(game.getInit).toBeFalsy();
        expect(game.getTurn).toBe(0);
        expect(game.getWinner).toBe(-1);
        expect(game.getShips).toEqual([3,3,2]);
    });

    it('should initialize game when conditions are met', () => {
        game.init();
        expect(game.getInit).toBeTruthy();
    });

    it('should get the current and opponent players', () => {
        expect(game.getCurrentPlayer).toBeInstanceOf(Player);
        expect(game.getOpponent).toBeInstanceOf(Player);
    });

    it('should switch turns correctly', () => {
        game.next();
        expect(game.getTurn).toBe(1);
    });

    it('should handle player turns', () => {
        const location: [number, number] = [1, 1];
        // Mocking getAttacked to return true
        jest.spyOn(game.getOpponent.getBoard, 'getAttacked').mockReturnValue(true);
        expect(game.playerTurn(location)).toBeTruthy();
    });

    it('should handle computer turns', () => {
        // Mocking chooseAttack and getAttacked
        jest.spyOn(game.getCurrentPlayer, 'chooseAttack').mockReturnValue([2, 2]);
        jest.spyOn(game.getOpponent.getBoard, 'getAttacked').mockReturnValue(true);
        game.computerTurn();
        // Expect some assertion here
    });

    it('should check for a winner', () => {
        // Mocking allSunk to simulate a winning scenario
        jest.spyOn(game.getOpponent.getBoard, 'allSunk').mockReturnValue(true);
        expect(game.isWinner()).toBe(game.getTurn);
    });

    it('should allow setting a winner', () => {
        game.setWinner = 1;
        expect(game.getWinner).toBe(1);
    });
});
