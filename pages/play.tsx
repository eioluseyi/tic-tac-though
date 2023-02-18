import "../src/assets/css/play.css";
import Board from "../src/Board";
import React from "react";

export default function App() {
  const [winner, setWinner] = React.useState("");
  const [gameOver, setGameOver] = React.useState(false);

  const boardRef = React.useRef<{ [key: string]: any }>();

  const newGame = () => boardRef.current && boardRef.current.newGame();

  return (
    <div className={`App ${gameOver ? "game-over" : ""}`}>
      <h1 className="app-header">
        Tic Tac <span className="text-highlight">though</span>..
      </h1>
      <br />
      <br />
      <Board
        {...{
          setGameOver,
          setWinner
        }}
        ref={boardRef}
      />
      <h4>{gameOver ? (winner ? winner + " won!" : "Game Over!") : ""}</h4>
      <button className="game-action" onClick={newGame}>
        ↻{/* {gameOver ? "New Game" : "Restart"} */}
      </button>
    </div>
  );
}
