import { useEffect, useRef } from "react";
import { connectSocket } from "../services/socket";

export default function useSocketNotifications(currentUser) {

  const socketRef = useRef(null);

  useEffect(() => {

    if (!currentUser?._id) return;

    socketRef.current = connectSocket(currentUser._id);

    const socket = socketRef.current;

    const handleDM = (msg) => {

      if (msg.senderId === currentUser._id) return;

      if (document.hidden) {

        new Notification("New Message", {
          body: msg.text || "New message"
        });

      }

      console.log("DM received", msg);
    };

    const handleChannel = (msg) => {

      if (msg.senderId === currentUser._id) return;

      if (document.hidden) {

        new Notification("Channel Message", {
          body: msg.text || "New message"
        });

      }

      console.log("Channel message", msg);
    };

    socket.on("receive_dm", handleDM);
    socket.on("receive_channel_message", handleChannel);

    return () => {
      socket.off("receive_dm", handleDM);
      socket.off("receive_channel_message", handleChannel);
    };
  }, [currentUser]);
}



// import { useEffect } from "react";
// import { connectSocket } from "../services/socket";

// export default function useSocketNotifications(currentUser) {

//   useEffect(() => {

//     if (!currentUser?._id) return;

//     const socket = connectSocket(currentUser._id);

//     const handleDMNotification = (msg) => {

//       // ignore own message
//       if (msg.senderId === currentUser._id) return;

//       if (Notification.permission === "granted") {

//         new Notification("New Message", {
//           body: msg.text || "New message",
//           icon: "/chat-icon.png"
//         });

//       }

//       console.log("DM notification", msg);
//     };

//     const handleChannelNotification = (msg) => {

//       if (msg.senderId === currentUser._id) return;

//       if (Notification.permission === "granted") {

//         new Notification(`Channel message`, {
//           body: msg.text || "New message",
//           icon: "/chat-icon.png"
//         });

//       }

//       console.log("Channel notification", msg);
//     };

//     socket.on("dm_notification", handleDMNotification);
//     socket.on("channel_notification", handleChannelNotification);

//     return () => {

//       socket.off("dm_notification", handleDMNotification);
//       socket.off("channel_notification", handleChannelNotification);

//     };

//   }, [currentUser]);

// }