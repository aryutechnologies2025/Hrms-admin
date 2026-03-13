import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket } from "../services/socket";
import { incrementDM, incrementChannel } from "../redux/chatSlice";
import {
  playSound,
  showBrowserNotification,
  updateTabTitle,
} from "../notifications/notificationManager";
import { API_URL } from "../config";
import axios from "axios";

export default function useSocketEvents({
  currentUser,
  selectedUser,
  selectedChannel,
}) {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const slackActivePage = useSelector((state) => state.chat.slackActivePage);
  /* LOAD USERS */
  useEffect(() => {
    if (!currentUser) return;
    axios
      .get(`${API_URL}/api/employees/all-users`, {
        params: {
          userId: currentUser?._id,
          type: currentUser?.superUser ? "superAdmin" : currentUser?.type,
        },
      })
      .then((res) => setUsers(res.data.data || []));
    console.log("users", users);
  }, []);

  useEffect(() => {
    if (!currentUser?._id) return;

    const socket = connectSocket(currentUser._id);

    // const handleDMNotification = (msg) => {

    //   if (msg.senderId === currentUser._id) return;

    //   const chatOpen =
    //     selectedUser?._id === msg.senderId;

    //   if (!chatOpen) {

    //     dispatch(incrementDM(msg.senderId));

    //     updateTabTitle();

    //   }
    //   if(!chatOpen){
    //       playSound();
    //   }

    //   if(document.hidden && !chatOpen) {

    //     showBrowserNotification(
    //       "Aryu DM Message",
    //       msg.text || "New message"
    //     );

    //   }

    // };

    const handleDMNotification = (msg) => {
      if (msg.senderId === currentUser._id) return;

      const chatOpen = slackActivePage && selectedUser?._id === msg.senderId;

      if (chatOpen) return;
      // find sender name from users list
      const sender = users.find((u) => String(u._id) === String(msg.senderId));
      console.log("sender", users, msg, sender);
      const senderName = sender?.name || "User";

      dispatch(incrementDM(msg.senderId));

      playSound();

      if (document.hidden || !slackActivePage) {
        showBrowserNotification(
          `Message from ${senderName}`,
          msg.text || "New message or Files",
        );
      } else {
        // Slack open but different chat
        showBrowserNotification("Aryu DM Message", msg.text || "New message or Files");
      }

      updateTabTitle();
    };

    const handleChannelNotification = (msg) => {
      // Ignore messages sent by current user
      if (msg.senderId === currentUser._id) return;

      const channelOpen =
        slackActivePage && selectedChannel?._id === msg.channelId;

      // If Slack open AND same channel open → no notification
      if (channelOpen) return;
      const sender = users.find((u) => String(u._id) === String(msg.senderId));
      const senderName = sender?.name || "User";

      // Update unread badge
      dispatch(incrementChannel(msg.channelId));

      // Play sound
      playSound();

      // Show browser notification
      if (document.hidden || !slackActivePage || !channelOpen) {
        showBrowserNotification(
          `${senderName} from Channel`,
          msg.text || "New message",
        );
      }

      // Update tab title
      updateTabTitle();
    };

    socket.on("dm_notification", handleDMNotification);
    socket.on("channel_notification", handleChannelNotification);

    return () => {
      socket.off("dm_notification", handleDMNotification);
      socket.off("channel_notification", handleChannelNotification);
    };
  }, [currentUser, selectedUser, selectedChannel]);
}
