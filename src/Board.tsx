import React from "react";
import { useRouter } from "next/router";
import { getCellClasses, getWinArray } from "src/utils";
import { BoardPropsType, CellType, TurnType } from "src/types";
import { useGameCharacters, useRandomRotateClass, useSocket } from "src/hooks";
import { initialBoardValues, playerCharacters } from "src/constants";

const Board = ({
  setGameOver,
  setWinner,
  newGame,
  setNewGame,
}: BoardPropsType) => {
  const [boardArray, setBoardArray] = React.useState<TurnType[]>(
    initialBoardValues()
  );
  const [winArray, setWinArray] = React.useState<number[]>([]);

  const { query } = useRouter();
  const myTurn = React.useRef(false);
  const { currentTurn, fetchNextTurn } = useGameCharacters(playerCharacters);
  const { randomRotateClass, randomizeRotateClass } = useRandomRotateClass();

  const setPieceCount = boardArray ? boardArray.filter((e) => e).length : 0;

  const socket = useSocket();

  const handleGameOver = (gameOverType: "WIN" | "DRAW") => {
    if (gameOverType === "WIN") setWinner(boardArray[winArray[0]]);
    setGameOver(true);
  };

  const setPiece = ({ index }: CellType) => {
    if (boardArray[index]) return;

    setBoardArray((e) => {
      const newArray = [...e];
      newArray[index] = currentTurn;
      return newArray;
    });
  };

  const handleMultiplayer = React.useCallback(
    (mpType?: "NEW_GAME") => {
      if (socket) {
        if (mpType === "NEW_GAME") {
          return socket.emit("set-new-game");
        }
        socket.emit("set-board-array", boardArray);
      }
    },
    [socket, boardArray]
  );

  const joinGame = () => {
    if (socket) socket.emit("join-game", query.uid);
  };

  React.useEffect(() => {
    // getSessionData(query.id, ())
    if (socket)
      socket.on("updated-sessionlist", (res) => {
        const sesh = res.find(
          (ssn: { sessionId: string | string[] | undefined }) =>
            ssn.sessionId === query.id
        );

        console.log(
          sesh.turnUUID,
          JSON.parse(localStorage.getItem("userState") || "").uuid
        );

        if (sesh)
          myTurn.current =
            sesh.turnUUID ===
            JSON.parse(localStorage.getItem("userState") || "").uuid;
      });
  }, [query, socket]);

  React.useEffect(() => {
    const __winArray = getWinArray(boardArray);
    setWinArray(__winArray);

    if (myTurn.current || newGame) handleMultiplayer();
    if (newGame) setNewGame(false);

    if (boardArray.filter((e) => e).length) myTurn.current = !myTurn.current;

    if (__winArray.length) return;
    if (setPieceCount === 9) return handleGameOver("DRAW");

    randomizeRotateClass();
    fetchNextTurn();
  }, [boardArray]);

  React.useEffect(() => {
    if (winArray.length) return handleGameOver("WIN");
  }, [winArray]);

  React.useEffect(() => {
    if (!newGame) return;

    setGameOver(false);
    setBoardArray([...initialBoardValues()]);
    setWinner("");
  }, [newGame]);

  React.useEffect(() => {
    if (socket)
      socket.on("set-board-array", (boardMatrix) => {
        setBoardArray(boardMatrix || Array(9).fill(""));
      });

    joinGame();
  }, [socket]);

  console.log(myTurn.current);

  return (
    <>
      <div
        className={`game-board ${randomRotateClass}`}
        data-player={currentTurn}
      >
        {boardArray.map((cell, index) => (
          <button
            key={index}
            className={getCellClasses(index, winArray.includes(index))}
            onClick={() => myTurn.current && setPiece({ index })}
          >
            <div className="cell-text">{cell}</div>
          </button>
        ))}
      </div>
      <br />
      <br />
      <h3>
        {myTurn.current
          ? `Your turn (${currentTurn})`
          : `${currentTurn}'s turn`}
      </h3>
    </>
  );
};

export default React.memo(Board);
