import React from "react";
import { BoardPropsType, CellType, TurnType, WinDirectionType } from "./types";

const initialBoardValues = (): TurnType[][]  => [
  [
    { isWinner: false, value: "" },
    { isWinner: false, value: "" },
    { isWinner: false, value: "" }
  ],
  [
    { isWinner: false, value: "" },
    { isWinner: false, value: "" },
    { isWinner: false, value: "" }
  ],
  [
    { isWinner: false, value: "" },
    { isWinner: false, value: "" },
    { isWinner: false, value: "" }
  ]
];

const Board = React.forwardRef(
  ({ setGameOver, setWinner }: BoardPropsType, boardRef) => {
    const [isWindowReady, setIsWindowReady] = React.useState<boolean>(false);
    const [boardMatrix, setBoardMatrix] = React.useState<TurnType[][]>(
      initialBoardValues()
    );
    const [lastChecked, setLastChecked] = React.useState<CellType>({
      row: 0,
      col: 0
    });
    const [currentTurn, setCurrentTurn] = React.useState<TurnType["value"]>(
      "X"
    );
    const [rotateClass, setRotateClass] = React.useState("rotate-0");

    const clickBoxCount = React.useRef(0);

    const handleGameOver = () => {
      setGameOver(true);
      clickBoxCount.current = 0;
    };

    const getRandomRotateClass = () => {
      let newVal = `rotate-${Math.floor(Math.random() * 4)}`;

      while (newVal === rotateClass) {
        newVal = getRandomRotateClass();
      }

      return newVal;
    };

    React.useImperativeHandle(boardRef, () => ({
      newGame: () => {
        setGameOver(false);
        setBoardMatrix(
          isWindowReady
            ? structuredClone(initialBoardValues())
            : initialBoardValues()
        );
        setLastChecked({ row: 0, col: 0 });
        setWinner("");
      }
    }));

    const win = React.useCallback(
      (
        winner: TurnType["value"],
        winDirection: WinDirectionType,
        { row, col }: CellType
      ) => {
        switch (winDirection) {
          case "vertical": {
            setBoardMatrix((e) => {
              const newArray = structuredClone(e);

              newArray[0][col].isWinner = true;
              newArray[1][col].isWinner = true;
              newArray[2][col].isWinner = true;

              return newArray;
            });
            break;
          }
          case "horizontal": {
            setBoardMatrix((e) => {
              const newArray = structuredClone(e);

              newArray[row][0].isWinner = true;
              newArray[row][1].isWinner = true;
              newArray[row][2].isWinner = true;

              return newArray;
            });
            break;
          }
          case "diagonalLTR": {
            setBoardMatrix((e) => {
              const newArray = structuredClone(e);

              newArray[0][0].isWinner = true;
              newArray[1][1].isWinner = true;
              newArray[2][2].isWinner = true;

              return newArray;
            });
            break;
          }
          case "diagonalRTL": {
            setBoardMatrix((e) => {
              const newArray = structuredClone(e);

              newArray[0][2].isWinner = true;
              newArray[1][1].isWinner = true;
              newArray[2][0].isWinner = true;

              return newArray;
            });
            break;
          }
        }

        setWinner(winner);
        handleGameOver();
      },
      [setGameOver, setWinner]
    );

    const checkWin = React.useCallback(() => {
      const { row, col } = lastChecked;

      if (!boardMatrix[row][col].value) return;

      // Vertical (Top to bottom)
      if (
        boardMatrix[0][col].value === boardMatrix[1][col].value &&
        boardMatrix[1][col].value === boardMatrix[2][col].value &&
        boardMatrix[1][col].value !== ""
      )
        return win(boardMatrix[row][col].value, "vertical", { row, col });

      // Horizontal (Left to right)
      if (
        boardMatrix[row][0].value === boardMatrix[row][1].value &&
        boardMatrix[row][1].value === boardMatrix[row][2].value &&
        boardMatrix[row][1].value !== ""
      )
        return win(boardMatrix[row][col].value, "horizontal", { row, col });

      // Diagonal (Left to right)
      if (
        boardMatrix[0][0].value === boardMatrix[1][1].value &&
        boardMatrix[1][1].value === boardMatrix[2][2].value &&
        boardMatrix[1][1].value !== ""
      )
        return win(boardMatrix[row][col].value, "diagonalLTR", { row, col });

      // Diagonal (Right to left)
      if (
        boardMatrix[0][2].value === boardMatrix[1][1].value &&
        boardMatrix[1][1].value === boardMatrix[2][0].value &&
        boardMatrix[1][1].value !== ""
      )
        return win(boardMatrix[row][col].value, "diagonalRTL", { row, col });

      if (clickBoxCount.current === 9) return handleGameOver();
      setRotateClass(() => getRandomRotateClass());
    }, [boardMatrix, win, lastChecked, handleGameOver]);

    const clickBox = ({ row, col }: CellType) => {
      if (boardMatrix[row][col].value) return;

      clickBoxCount.current++;

      setBoardMatrix((e) => {
        const newArray = structuredClone(e);

        newArray[row][col].value = currentTurn;

        return newArray;
      });

      setCurrentTurn((e) => {
        if (e === "X") return "O";

        if (e === "O") return "X";

        // Fail safe 💀
        return "";
      });

      setLastChecked({ row, col });
    };

    React.useEffect(() => {
      setIsWindowReady(true);
      setBoardMatrix(structuredClone(initialBoardValues()));
    }, []);

    React.useEffect(() => {
      checkWin();
    }, [lastChecked]);

    return (
      <>
        <div className={`game-board ${rotateClass}`} data-player={currentTurn}>
          {boardMatrix.map((rows, row) => (
            <div key={row} className="board-row">
              {rows.map((cell, col) => (
                <button
                  key={col}
                  className={`board-cell ${
                    cell.isWinner ? "winner" : ""
                  } delay-${row} delay-${col}`}
                  onClick={() => clickBox({ row, col })}
                >
                  {cell.value}
                </button>
              ))}
            </div>
          ))}
        </div>
        <br />
        <br />
        <h3>{`${currentTurn}'s turn`}</h3>
      </>
    );
  }
);

export default Board;
