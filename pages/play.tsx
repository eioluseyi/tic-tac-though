import React from "react";
import Board from "src/Board";
import "src/assets/css/play.css";
import "public/assets/css/board.css";
import router from "next/router";

export default function App() {
  const [winner, setWinner] = React.useState("");
  const [gameOver, setGameOver] = React.useState(false);
  const [newGame, setNewGame] = React.useState<boolean>(false);

  return (
    <div className={`App ${gameOver ? "game-over" : ""}`}>
      <button className="" onClick={router.back}>
        &lt;
      </button>
      <h1 className="app-header">
        Tic Tac <span className="text-highlight">though</span>..
      </h1>
      <br />
      <br />
      <Board
        {...{
          setGameOver,
          setWinner,
          newGame,
          setNewGame,
        }}
      />
      <h4>{gameOver ? (winner ? winner + " won!" : "Game Over!") : ""}</h4>
      <button className="game-action" onClick={() => setNewGame(true)}>
        ↻
      </button>
    </div>
  );
}
