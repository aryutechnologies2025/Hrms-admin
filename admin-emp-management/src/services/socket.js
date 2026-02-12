// socket.js
// import { io } from "socket.io-client";

// const SOCKET_URL =  "http://192.168.0.116:5009";

// export function connectSocket(token) {
//     //  Prevent multiple connections
//   if (socket) return socket;
//   const socket = io(SOCKET_URL, {
//     // auth: { token },           // IMPORTANT → same as backend handshake.auth.token
//     transports: ["websocket"], // optional but stable
//          withCredentials: true,
//   });
//   console.log("socket 3",socket)

//   socket.on("connect", () => {
//     console.log("Socket connected:", socket.id);
//   });

//   socket.on("disconnect", () => {
//     console.log("Socket disconnected");
//   });
//   return socket;
// }

// src/services/socket.js
import { io } from "socket.io-client";

// const SOCKET_URL = "http://192.168.0.116:5000";

const SOCKET_URL = "https://hrms.aryuprojects.com";//staging socket
// const SOCKET_URL = "https://portal.aryutechnologies.com";//live socket

let socket = null;

export function connectSocket(token) {
  //  Prevent multiple connections
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    transports: ["websocket"],
      timeout: 20000,
    // withCredentials: true,
    //  enable later when JWT ready
    // auth: { token },
  });

  socket.on("connect", () => {
    console.log(" Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log(" Socket disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  return socket;
}
