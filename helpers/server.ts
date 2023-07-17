import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { CallbackType } from "types/server";

import { randomUUID } from "crypto";
import { RequestResponseType } from "types/server";
import { generateString } from "utils/server";
import { sessionList, socketHandler, userList } from "variables/server";
import { BoardArrayType, GameSessionType, UserType } from "types/common";

const getUser = (userId: string) => userList.find((el) => el.uuid === userId);

const getSession = (sessionId: string) =>
  sessionList.find((el) => el.sessionId === sessionId);

const userExists = (userId: string): boolean => Boolean(getUser(userId));

const userNameExists = (userName: string): boolean =>
  Boolean(
    userList.find((el) => el.name.toLowerCase() === userName.toLowerCase())
  );

const isSessionOwner = (userId: string, session: GameSessionType): boolean =>
  Boolean(session.users[0].uuid === userId);

export const handleRequest = {
  success: (message: string, data: object = {}): RequestResponseType => {
    if (socketHandler.io) {
      socketHandler.io.emit("updated-userlist", userList);
      socketHandler.io.emit("updated-sessionlist", sessionList);
    }

    return {
      data,
      message,
      success: true,
    };
  },
  error: (message: string, data: object = {}): RequestResponseType => {
    if (socketHandler.io) {
      socketHandler.io.emit("updated-userlist", userList);
      socketHandler.io.emit("updated-sessionlist", sessionList);
    }

    return {
      data,
      message,
      success: false,
    };
  },
};

export const addUser = (userName: string): RequestResponseType => {
  if (!userName) return handleRequest.error("Username cannot be empty");
  if (userNameExists(userName))
    return handleRequest.error("Username already taken");

  const user: UserType = {
    uuid: randomUUID(),
    name: userName,
    character: "X",
  };

  userList.push(user);

  return handleRequest.success("User successfully added", { user });
};

export const removeUser = (userId: string): RequestResponseType => {
  if (!userId) return handleRequest.error("UUID cannot be empty");
  if (!userExists(userId)) return handleRequest.error("User does not exist");

  const newUserList: UserType[] = userList.filter((el) => el.uuid !== userId);

  userList.length = 0;
  userList.push(...newUserList);

  return handleRequest.success("User successfully removed");
};

export const addSession = (userId: UserType["uuid"]): RequestResponseType => {
  const user = getUser(userId);
  const sessionId = generateString();

  if (!user) return handleRequest.error("User doesn't exist");

  const session: GameSessionType = {
    sessionId,
    users: [user],
    boardArray: Array(9).fill(""),
    state: "NEW",
    turnUUID: user.uuid,
  };

  sessionList.push(session);

  return handleRequest.success("Session created successfully", session);
};

export const removeSession = (
  userId: UserType["uuid"],
  sessionId: string,
  force?: boolean
): RequestResponseType => {
  const session = getSession(sessionId);

  if (!session) return handleRequest.error("Session doesn't exist");
  if (!force && !isSessionOwner(userId, session))
    return handleRequest.error("This user can't remove this session");

  const newSessionList: GameSessionType[] = sessionList.filter(
    (el) => el.sessionId !== sessionId
  );

  sessionList.length = 0;
  sessionList.push(...newSessionList);

  return handleRequest.success("Session removed successfully", session);
};

export const joinSession = (
  sessionId: GameSessionType["sessionId"],
  userId: UserType["uuid"]
): RequestResponseType => {
  const user = userList.find((el) => el.uuid === userId);
  const session = getSession(sessionId);

  if (!user) return handleRequest.error("User doesn't exist");
  if (!session) return handleRequest.error("This session doesn't exist");
  if (session.users.length === 2)
    return handleRequest.error("Session is full already");
  if (session.users.find((el: { uuid: string }) => el.uuid === userId))
    return handleRequest.error("User already in this session");

  session.users.push(user);

  return handleRequest.success("Session joined successfully", session);
};

export const leaveSession = (
  sessionId: GameSessionType["sessionId"],
  userId: UserType["uuid"]
): RequestResponseType => {
  const user = getUser(userId);
  const session = getSession(sessionId);

  if (!user) return handleRequest.error("User doesn't exist");
  if (!session) return handleRequest.error("This session doesn't exist");
  if (!session.users.find((el: { uuid: string }) => el.uuid === userId))
    return handleRequest.error("User is not in this session");
  if (session.users.length === 1) {
    removeSession("", sessionId, true);
    return handleRequest.success("Session left successfully");
  }

  const newSessionUsers = session.users.filter(
    (el: { uuid: string }) => el.uuid !== userId
  );

  session.users = newSessionUsers;

  return handleRequest.success("Session left successfully", session);
};

export function useSocketListeners(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, any>
) {
  socketHandler.socket = socket;
  socket.emit("connection", handleRequest.success("Connection successful"));

  //   -------------------------------------------------------------------->

  socket.on(
    "add-user",
    ({ userName }: { userName: string }, callback?: CallbackType) => {
      if (callback) return callback(addUser(userName));
      return addUser(userName);
    }
  );

  socket.on(
    "remove-user",
    ({ userName }: { userName: string }, callback?: CallbackType) => {
      if (callback) return callback(removeUser(userName));
      return removeUser(userName);
    }
  );

  socket.on(
    "add-session",
    ({ userId }: { userId: string }, callback?: CallbackType) => {
      if (callback) return callback(addSession(userId));
      return addSession(userId);
    }
  );

  socket.on(
    "remove-session",
    (
      { userId, sessionId }: { userId: string; sessionId: string },
      callback?: CallbackType
    ) => {
      if (callback) return callback(removeSession(userId, sessionId));
      return removeSession(userId, sessionId);
    }
  );

  socket.on(
    "join-session",
    (
      { sessionId, userId }: { sessionId: string; userId: string },
      callback?: CallbackType
    ) => {
      if (callback) return callback(joinSession(sessionId, userId));
      return joinSession(sessionId, userId);
    }
  );

  socket.on(
    "leave-session",
    (
      { sessionId, userId }: { sessionId: string; userId: string },
      callback?: CallbackType
    ) => {
      if (callback) return callback(joinSession(sessionId, userId));
      return joinSession(sessionId, userId);
    }
  );

  socket.on(
    "set-board-array",
    ({ boardArray }: { boardArray: BoardArrayType }) => {
      socket.emit("set-board-array", boardArray);
    }
  );
}
