import React from "react";
import Battleship from "./components/Battleship";
import "./styles/Ship.css"; // Import the CSS file

type ShipsProps = {
  player: string,
  ships: Battleship[]
};

const Ships = ({player, ships}: ShipsProps) => {
  return (
    <div className={`ships-container ${player === "player" ? "player" : "computer"}`}>
      {ships.sort((a, b) => a.getLength - b.getLength).map((ship, i) => (
        <div className="ship-wrapper" key={i}>
          {ship.getParts.map((_, j) => (
            <div className={`part ${ship.isSunk() ? "sunk" : ""}`} key={j}></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Ships;
