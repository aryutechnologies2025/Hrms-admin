// socket.js
import { io } from "socket.io-client";

const SOCKET_URL =  "http://192.168.0.116:5009";

export function connectSocket(token) {
  const socket = io(SOCKET_URL, {
    auth: { token },           // IMPORTANT → same as backend handshake.auth.token
    transports: ["websocket"], // optional but stable
  });
  console.log("socket 3",socket)

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  return socket;
}
