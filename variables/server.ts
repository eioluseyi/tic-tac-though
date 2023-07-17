import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { GameSessionType, UserType } from "types/common";

const handler = {
  get(target: { [x: string]: any }, key: string | number) {
    return target[key];
  },
  set(target: { [x: string]: any }, key: string | number, value: any) {
    target[key] = value;
    // console.log("Set Object");
    return true;
  },
};

export const sessionList: GameSessionType[] = new Proxy([], {
  get(target, key: string | symbol) {
    return target[key];
  },
  set(target, key, value) {
    if (typeof value === "object" && value !== null) {
      target[key] = new Proxy(value, handler);
    } else {
      target[key] = value;
    }
    return true;
  },
});

export const userList: UserType[] = new Proxy([], {
  get(target, key: string | symbol) {
    return target[key];
  },
  set(target, key, value) {
    // console.log("Target: ", target, " Key: ", key, " Value: ", value);
    if (typeof value === "object" && value !== null) {
      target[key] = new Proxy(value, handler);
    } else {
      target[key] = value;
    }
    // console.log("Value: ", target, value);
    return true;
  },
});
export const socketHandler: {
  socket: Socket | null;
  io?: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
} = { socket: null };
