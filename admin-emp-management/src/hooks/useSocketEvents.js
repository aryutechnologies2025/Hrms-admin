import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { connectSocket } from "../services/socket";
import { incrementDM, incrementChannel } from "../redux/chatSlice";
import {
  playSound,
  showBrowserNotification,
  updateTabTitle
} from "../notifications/notificationManager";

export default function useSocketEvents({
  currentUser,
  selectedUser,
  selectedChannel
}) {

  const dispatch = useDispatch();


  useEffect(() => {

    if (!currentUser?._id) return;

    const socket = connectSocket(currentUser._id);

    const handleDMNotification = (msg) => {

      if (msg.senderId === currentUser._id) return;

      const chatOpen =
        selectedUser?._id === msg.senderId;

      if (!chatOpen) {

        dispatch(incrementDM(msg.senderId));

        updateTabTitle();

      }

      playSound();

      if (document.hidden && !chatOpen) {

        showBrowserNotification(
          "New Message",
          msg.text || "New message"
        );

      }

    };

    const handleChannelNotification = (msg) => {

      if (msg.senderId === currentUser._id) return;

      const channelOpen =
        selectedChannel?._id === msg.channelId;

      if (!channelOpen) {

        dispatch(incrementChannel(msg.channelId));

        updateTabTitle();

      }

      playSound();

      if (document.hidden && !channelOpen) {

        showBrowserNotification(
          "Channel Message",
          msg.text || "New message"
        );

      }

    };

    socket.on("dm_notification", handleDMNotification);
    socket.on("channel_notification", handleChannelNotification);

    return () => {

      socket.off("dm_notification", handleDMNotification);
      socket.off("channel_notification", handleChannelNotification);

    };

  }, [currentUser, selectedUser, selectedChannel]);

}