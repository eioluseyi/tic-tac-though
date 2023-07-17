export type UserType = {
  uuid: string;
  name: string;
  character?: "X" | "O";
};

export type BoardArrayType = ("" | UserType["character"])[];

export type GameSessionType = {
  sessionId: string;
  state: "NEW" | "IN_PROGRESS" | "COMPLETED";
  result?: {
    type: "WIN" | "DRAW";
    winArray?: number[];
  };
  turnUUID: string;
  users: Array<UserType>;
  boardArray: BoardArrayType;
};
