import React, { useState } from 'react';
import Boards from "./Boards";
import Game from "./components/Game";
import { FaWater } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './styles/App.css'; // Import custom CSS

const App = () => {
  // Define ship sizes and initialize game-related state variables
  const ships: number[] = [5, 4, 3, 3, 2]; // Ship sizes

  //INTIALIZE SERVERAL PIECES OF STATE
  const [game, setGame] = useState<Game>(new Game(ships, 10)); // Game instance
  const [display, setDisplay] = useState<string>('Move/Rotate ships'); // Display message
  const [turn, setTurn] = useState<0 | 1>(game.getTurn); // Current turn
  const [init, setInit] = useState<boolean>(game.getInit); // Game initialization status
  const [reset, setReset] = useState<boolean>(false); // Reset flag

  // Updates the display message based on the game state (e.g., whose turn it is, if the game is not initialized, or if there's a winner).
  const updateDisplay = () => {
    if (!game.getInit) {
      setDisplay('Move/Rotate ships');
    } else if (game.getWinner !== -1) {
      setDisplay(`${game.getPlayer(game.getWinner).getName} won!`);
    } else if (game.getInit) {
      setDisplay(`${game.getCurrentPlayer.getName} turn`);
    }
  };

  // Updates the turn and refreshes the display
  const updateTurn = () => {
    setTurn(game.getTurn);
    updateDisplay();
  };

  // Updates the game initialization status
  const updateInit = () => {
    setInit(game.getInit);
  };

  // Initializes the game and updates relevant state
  const initGame = () => {
    game.init();
    updateDisplay();
    updateInit();
    setReset(false);
  };

  // Resets the game to start a new game
  const restartGame = async () => {
    setGame(new Game(ships, 10));
    setReset(true);
    setDisplay("Move/Rotate ships");
    setInit(false);
  };

  return (
    <div className="app">
    <div className="header-wrapper">
      <div className="title">
        <FaWater/><h1 className="header">Battleship</h1><FaWater/>
      </div>
    </div>
    <div className="display-wrapper">
      <div className="display">
        <h2 className="display-text">{display}</h2>
      </div>
    </div>
    <Boards game={game} updateTurn={updateTurn} turn={turn} init={init} reset={reset} />
    <div className="buttons">
    {
          !init ? <button className="startGame" type="button" onClick={initGame}>Start Game</button>
          : game.getTurn === 0 || game.getWinner !== -1 ? <button className="startGame" type="button" onClick={restartGame}>Restart Game</button>
            : <button className="startGame disabled" type="button">Restart Game</button>
        }
    </div>
  </div>
  );
}

export default App;
