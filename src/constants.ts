import { TurnType } from "src/types";

export const initialBoardValues = (): TurnType[] => Array(9).fill("");

export const playerCharacters: TurnType[] = ["X", "O"];
