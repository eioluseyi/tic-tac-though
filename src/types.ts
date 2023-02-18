export type CellType = { row: number; col: number };

export type TurnType = { isWinner: boolean; value: "X" | "O" | "" };

export type BoardPropsType = {
  setGameOver: (e: boolean) => void;
  setWinner: (e: TurnType["value"]) => void;
};

export type WinDirectionType =
  | "horizontal"
  | "vertical"
  | "diagonalLTR"
  | "diagonalRTL";
