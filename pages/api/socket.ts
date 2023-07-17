// import { NextApiRequest, NextApiResponse } from "next";
import { useSocketListeners } from "helpers/server";
import { NextApiRequest } from "next";
import { Server } from "socket.io";
import { socketHandler } from "variables/server";

const SocketHandler = (_req: NextApiRequest, res: any) => {
  // NextApiResponse
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    socketHandler.io = io;

    io.on("connection", useSocketListeners);
  }
  res.end();
};

export default SocketHandler;
