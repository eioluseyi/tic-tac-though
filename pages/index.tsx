import { SetStateAction, useEffect, useState } from "react";
import io from "socket.io-client";
let socket: ReturnType<typeof io>;

const Home = () => {
  const [input, setInput] = useState("");

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("update-input", (msg) => {
      setInput(msg);
    });
  };

  const onChangeHandler = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setInput(e.target.value);
    socket.emit("input-change", e.target.value);
  };

  useEffect(() => {
    socketInitializer();
  }, []);

  return (
    <input
      placeholder="Type something"
      value={input}
      onChange={onChangeHandler}
    />
  );
};

export default Home;
