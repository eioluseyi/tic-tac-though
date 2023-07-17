export type CellType = { index: number };

export type TurnType = "X" | "O" | "";

export type BoardPropsType = {
  setGameOver: (e: boolean) => void;
  setWinner: (e: TurnType) => void;
  newGame: boolean;
  setNewGame: (e: boolean) => void;
};

export type FourIndicesType = 0 | 1 | 2 | 3;

export type RotateType = `rotate-${FourIndicesType}`;
