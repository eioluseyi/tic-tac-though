import React from "react";
import io from "socket.io-client";
import { FourIndicesType, RotateType, TurnType } from "src/types";
let socket: ReturnType<typeof io>;

export const useSocket = () => {
  const [socketState, setSocketState] = React.useState<ReturnType<typeof io>>();

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      setSocketState(socket);
    });
  };

  React.useEffect(() => {
    socketInitializer();
  }, []);

  React.useEffect(() => {
    if (socket) socket.emit("check", "Checkmate");
  }, [socket]);

  return socketState;
};

export const useRandomRotateClass = () => {
  const [randomRotateClass, setRandomRotateClass] =
    React.useState<RotateType>("rotate-0");

  const randomizeRotateClass = () => {
    const rand = Math.floor(Math.random() * 4) as FourIndicesType;

    let newVal: RotateType = `rotate-${rand}`;

    while (newVal === randomRotateClass) {
      newVal = randomizeRotateClass();
    }

    setRandomRotateClass(newVal);
    return newVal;
  };

  return { randomRotateClass, randomizeRotateClass };
};

export const useGameCharacters = (arr: TurnType[]) => {
  let index = 0;

  const [currentTurn, setCurrentTurn] = React.useState<TurnType>(arr[index]);

  const fetchNextTurn = React.useCallback(() => {
    if (index >= arr.length) {
      index = 0; // reset the index to 0
    }

    setCurrentTurn(arr[index++]);
  }, []);

  return { currentTurn, fetchNextTurn };
};
