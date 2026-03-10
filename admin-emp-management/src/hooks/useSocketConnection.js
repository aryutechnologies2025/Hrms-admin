import { useEffect } from "react";
import { connectSocket } from "../services/socket";

export default function useSocketConnection(currentUser) {

  useEffect(() => {

    if (!currentUser?._id) return;

    const socket = connectSocket(currentUser._id);

    socket.on("connect", () => {

      console.log("Socket connected:", socket.id);

      socket.emit("join_user", {
        userId: currentUser._id
      });

      socket.emit("user_online", currentUser._id);
   


    });

    return () => {
      socket.off("connect");
    };

  }, [currentUser]);

}