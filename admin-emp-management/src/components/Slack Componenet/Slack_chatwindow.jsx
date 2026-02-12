import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { API_URL } from "../../config";
import CircularProgress from "./CircleProgress";
import {
  Send,
  Paperclip,
  Smile,
  Image,
  Video,
  Mic,
  X,
  Check,
  CheckCheck,
  Phone,
  MoreVertical,
  Download,
  Camera,
  ChevronDown, // Add this
  ChevronUp,
  MessageSquare,
  Pencil,
  Trash2,
  CornerUpRight,
  Eye,
  Share2,
  Copy,
} from "lucide-react";
import { use } from "react";
import { BsViewStacked } from "react-icons/bs";

const renderSlackStyleText = (text) => {
  if (!text) return null;

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    //  use match, NOT test
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline hover:text-blue-300 break-all"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }

    return <span key={index}>{part}</span>;
  });
};

const MessageText = ({ text, isMe }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 300;

  if (!text) return null;

  const isLong = text.length > MAX_LENGTH;
  const displayedText = isExpanded ? text : text.slice(0, MAX_LENGTH);
  const remainingChars = text.length - MAX_LENGTH;

  return (
    <div className="relative">
      <p
        className={`whitespace-pre-wrap break-words text-[15px] leading-relaxed ${
          isMe ? "text-black" : "text-gray-800"
        }`}
      >
        {renderSlackStyleText(displayedText)}

        {!isExpanded && isLong && (
          <span className={`${isMe ? "text-blue-200/60" : "text-gray-500/60"}`}>
            ...
          </span>
        )}
      </p>

      {!isExpanded && isLong && (
        <div
          className={`absolute bottom-0 right-0 h-6 w-20 pointer-events-none ${
            isMe
              ? "bg-gradient-to-l from-blue-600/40 to-transparent"
              : "bg-gradient-to-l from-white to-transparent"
          }`}
        />
      )}

      {isLong && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className={`mt-1 text-sm font-medium flex items-center gap-1 hover:underline ${
            isMe
              ? "text-blue-200 hover:text-white"
              : "text-blue-600 hover:text-blue-800"
          }`}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              Show {remainingChars}+ more
            </>
          )}
        </button>
      )}
    </div>
  );
};

export const formatSize = (bytes = 0) => {
  if (bytes === 0) return "0 KB";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(1) + " " + sizes[i];
};

export const getFileIcon = (type = "", name = "") => {
  if (type.startsWith("image")) return "🖼️";
  if (type.startsWith("video")) return "🎥";
  if (type.startsWith("audio")) return "🎵";
  if (type.includes("pdf")) return "📕";
  if (type.includes("word")) return "📄";
  if (type.includes("excel") || type.includes("sheet")) return "📊";
  if (type.includes("zip") || name.endsWith(".zip")) return "🗜️";
  return "📎";
};

export function DocumentCard({ file, url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 max-w-xs hover:from-blue-100 hover:to-indigo-100 transition-all group"
    >
      <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-sm">
        <span className="text-xl">{getFileIcon(file.type)}</span>
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-sm font-semibold text-gray-800 truncate">
          {file.name}
        </p>
        {file.size && (
          <p className="text-xs text-gray-500 mt-1">{formatSize(file.size)}</p>
        )}
      </div>
      <Download className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}
const ActionButton = ({ children, title, danger, onClick }) => (
  <button
    title={title}
    onClick={onClick}
    className={`p-1.5 rounded-lg transition-colors
      ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-100"
      }`}
  >
    {children}
  </button>
);

const FileActions = ({ src, isMe, onDelete, onForward }) => {
  console.log("FileActions rendered with src:", onForward);
  const handleDownload = async () => {
    try {
      const response = await fetch(src, { mode: "cors" });

      const blob = await response.blob();

      // 🔥 Extract filename from URL
      const urlParts = src.split("/");
      const originalName = urlParts[urlParts.length - 1];

      // 🔥 Fallback if URL has no filename
      const fileName = originalName.includes(".")
        ? originalName
        : `download.${blob.type.split("/")[1] || "png"}`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = fileName;

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition z-10">
      {/* Download */}
      {/* <a
        href={src}
        download
        className="p-1 bg-black/60 rounded-full text-white hover:bg-black/80"
      > */}
      <button
        onClick={handleDownload}
        className="p-1 bg-black/60 rounded-full text-white hover:bg-black/80"
      >
        <Download className="w-4 h-4" />
      </button>

      {/* </a> */}

      {/* Share */}
      <button
        onClick={() => navigator.clipboard.writeText(src)}
        className="p-1 bg-black/60 rounded-full text-white hover:bg-black/80"
      >
        <Share2 className="w-4 h-4" />
      </button>

      {/* 🔥 Forward */}
      <button
        onClick={onForward}
        className="p-1 bg-blue-600/70 rounded-full text-white hover:bg-blue-700"
      >
        <CornerUpRight className="w-4 h-4" />
      </button>

      {/* Delete */}
      {isMe && (
        <button
          onClick={onDelete}
          className="p-1 bg-red-600/70 rounded-full text-white hover:bg-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export function MembersAvatarStack({ members = [], setFuntionOpen }) {
  // const [open, setOpen] = useState(false);
  console.log("hhhh", setFuntionOpen);

  const visible = members.slice(0, 3);
  const remaining = members.length - visible.length;

  return (
    <>
      {/* Avatar stack */}
      <div
        className="flex -space-x-3 cursor-pointer"
        onClick={() => setFuntionOpen(true)}
      >
        {visible.map((m, i) => (
          <div
            key={m._id}
            className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-semibold border-2 border-white shadow"
            title={m.name}
            style={{ zIndex: 10 - i }}
          >
            {m.name?.charAt(0).toUpperCase()}
          </div>
        ))}

        {remaining > 0 && (
          <div className="w-9 h-9 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-xs font-semibold border-2 border-white">
            +{remaining}
          </div>
        )}
      </div>

      {/* Popup */}
      {/* {open && <MembersModal members={members} onClose={() => setOpen(false)} />} */}
    </>
  );
}

export default function Slack_chatwindow({
  socket,
  currentUser,
  selectedUser,
  onlineUsers,
  selectedChannel,
  users = [],
  channels = [],
  onSelectUser,
  onSelectChannel,
  setChannelUnread,
  activeThread,
  setActiveThread,
}) {
  console.log("Selected Channel in Chat Window:", selectedChannel);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef();
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const fileInputRefThread = useRef(null);
  const [progressMap, setProgressMap] = useState({});
  const controllersRef = useRef({});
  const [showActions, setShowActions] = useState(false);
  const editFileRef = useRef(null);
  const [open, setOpen] = useState(false);

  // message icons
  const [hoveredMessageId, setHoveredMessageId] = useState(null);

  // edit text and file
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editFiles, setEditFiles] = useState([]);

  //   //Thread edit text and file
  const [editingMessageIdThread, setEditingMessageIdThread] = useState(null);
  const [editTextThread, setEditTextThread] = useState("");
  const [editFilesThread, setEditFilesThread] = useState([]);
  const editFileRefThread = useRef(null);
  // THREAD
  const bottomRefTheard = useRef();

  // meassage forwarding
  const [showForwardDropdown, setShowForwardDropdown] = useState(false);
  const [forwardMessage, setForwardMessage] = useState(null);
  const [searchForward, setSearchForward] = useState("");

  // single user + channel file and  forwarding
  const [selectedForwardFile, setSelectedForwardFile] = useState(null);
  const [threadReplies, setThreadReplies] = useState([]);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchForward.toLowerCase()),
  );

  const filteredChannels = channels.filter((c) =>
    c.name.toLowerCase().includes(searchForward.toLowerCase()),
  );

  // set seen by state
  const [seenByUsers, setSeenByUsers] = useState([]);
  const [showSeenPopup, setShowSeenPopup] = useState(false);
  const [activeSeenMessage, setActiveSeenMessage] = useState(null);
  const [channelMembers, setChannelMembers] = useState([]);

  // Thread
  const [textThread, setTextThread] = useState("");
  const fileRefThread = useRef();
  const [filesThread, setFilesThread] = useState([]);

  // view channel members
  const me = currentUser?._id;
  const other = selectedUser?._id;

  // text forwording
  const TextActions = ({ text, message }) => {
    return (
      <div
        className="absolute -top-3 -right-6 flex flex-col gap-1
                    opacity-0 group-hover:opacity-100 transition z-10"
      >
        {/* Copy text */}
        <button
          onClick={() => navigator.clipboard.writeText(text)}
          className="p-1 bg-black/60 rounded-full text-white hover:bg-black/80"
          title="Copy"
        >
          <Copy className="w-4 h-4" />
        </button>

        {/* Forward text */}
        <button
          onClick={() => {
            setForwardMessage(message);
            setSelectedForwardFile(null); // 🔥 text only
            setShowForwardDropdown(true);
          }}
          className="p-1 bg-black/60 rounded-full text-white hover:bg-black/80"
          title="Forward"
        >
          <CornerUpRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  // channel open
  const openChannel = (channel) => {
    onSelectChannel(channel);

    socket.emit("join_channel", { channelId: channel._id });

    setChannelUnread((prev) => ({
      ...prev,
      [channel._id]: 0,
    }));

    socket.emit("channel_seen", {
      channelId: channel._id,
      userId: currentUser._id,
    });
  };

  // All existing useEffect hooks remain the same...
  useEffect(() => {
    return () => {
      socket.emit("stop_typing", {
        senderId: me,
        receiverId: other,
      });
    };
  }, [selectedUser]);

  // JOIN + LOAD

  useEffect(() => {
    if (!socket || !selectedUser) return;
    setActiveThread(null);
    socket.emit("join_dm", { senderId: me, receiverId: other });

    axios
      .get(`${API_URL}/api/messages/dm/${me}/${other}`)
      .then((res) => setMessages(res.data.data || []));

    socket.emit("mark_seen", {
      senderId: other,
      receiverId: me,
    });
  }, [selectedUser]);

  useEffect(() => {
    if (!socket || !selectedChannel || !currentUser?._id) return;
    setActiveThread(null);

    const channelId = selectedChannel._id;

    // 🔹 Join channel room
    socket.emit("join_channel", { channelId });

    // 🔹 Fetch channel messages
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/messages/channel/${channelId}`,
        );
        setMessages(res.data.data || []);

        // 🔹 Mark messages as seen (DB)
        // await axios.post(`${API_URL}/api/messages/channel-seen`, {
        //   channelId,
        //   userId: currentUser._id,
        // });

        // 🔹 Notify via socket (real-time tick)
        socket.emit("channel_seen", {
          channelId,
          userId: currentUser._id,
        });
      } catch (err) {
        console.error("Channel load error:", err);
      }
    };

    fetchMessages();

    //  CLEANUP (VERY IMPORTANT)
    return () => {
      socket.emit("leave_channel", { channelId });
    };
  }, [socket, selectedChannel]);

  // /*  Channel View Members*/
  useMemo(() => {
    if (!selectedChannel || !selectedChannel?._id) return;
    async function allChannelMember() {
      try {
        const respone = await axios.get(
          `${API_URL}/api/channel/channel-members/${selectedChannel?._id}`,
        );
        if (respone.data.success) {
          setChannelMembers(respone.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    allChannelMember();
  }, [selectedChannel]);

  useEffect(() => {
    if (!socket) return;

    const onDelivered = ({ senderId, receiverId, deliveredAt }) => {
      console.log("messages_delivered", senderId, receiverId, deliveredAt);
      setMessages((prev) =>
        prev.map((m) =>
          m.senderId === senderId &&
          m.receiverId === receiverId &&
          !m.deliveredAt
            ? { ...m, deliveredAt }
            : m,
        ),
      );
    };

    socket.on("messages_delivered", onDelivered);
    return () => socket.off("messages_delivered", onDelivered);
  }, [socket]);

  /* RECEIVE MESSAGE dm*/
  useEffect(() => {
    if (!socket || !selectedUser) return;

    socket.on("receive_dm", (msg) => {
      if (
        (msg.senderId === me && msg.receiverId === other) ||
        (msg.senderId === other && msg.receiverId === me)
      ) {
        setMessages((prev) => [...prev, msg]);

        if (msg.senderId === other) {
          socket.emit("mark_seen", {
            senderId: other,
            receiverId: me,
          });
        }
      }
    });
    return () => socket.off("receive_dm");
  }, [socket, selectedUser]);

  /* RECEIVE MESSAGE channel*/
  useEffect(() => {
    if (!socket || !selectedChannel) return;

    const handleReceiveChannelMessage = (msg) => {
      if (msg.channelId !== selectedChannel._id) return;

      console.log("RECEIVED CHANNEL MESSAGE:", msg);

      setMessages((prev) => [...prev, msg]);

      // 🔵 auto mark seen ONLY if user is viewing this channel
      socket.emit("channel_seen", {
        channelId: selectedChannel._id,
        userId: currentUser._id,
      });
    };

    socket.on("receive_channel_message", handleReceiveChannelMessage);

    return () => {
      socket.off("receive_channel_message", handleReceiveChannelMessage);
    };
  }, [socket, selectedChannel]);

  /*  BLUE TICK dm*/
  useEffect(() => {
    if (!socket) return;

    socket.on("messages_seen", ({ senderId, receiverId, seenAt }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.senderId === senderId && m.receiverId === receiverId && !m.seenAt
            ? { ...m, seenAt }
            : m,
        ),
      );
    });
    return () => socket.off("messages_seen");
  }, [socket]);

  useEffect(() => {
    if (!socket || !selectedChannel) return;

    const handleSeenUpdate = ({ channelId, messageId, isSeenByAll }) => {
      if (channelId !== selectedChannel._id) return;

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, isSeenByAll } : msg,
        ),
      );
    };

    socket.on("channel_seen_update", handleSeenUpdate);

    return () => {
      socket.off("channel_seen_update", handleSeenUpdate);
    };
  }, [socket, selectedChannel]);

  //   useEffect(() => {
  //   const close = () => setShowForwardDropdown(false);
  //   if (showForwardDropdown) {
  //     window.addEventListener("click", close);
  //   }
  //   return () => window.removeEventListener("click", close);
  // }, [showForwardDropdown]);

  const sendMessage = async () => {
    if (!text && files.length === 0) return;
    const formData = new FormData();
    formData.append("senderId", me);
    formData.append("receiverId", other || null);
    formData.append("channelId", selectedChannel ? selectedChannel._id : null);
    formData.append("text", text);
    files.forEach(({ file }) => {
      formData.append("files", file);
    });

    const controller = new AbortController();

    // attach SAME controller to all files
    files.forEach(({ tempId }) => {
      controllersRef.current[tempId] = controller;
    });

    const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);

    try {
      const res = await axios.post(
        selectedChannel
          ? `${API_URL}/api/messages/send`
          : `${API_URL}/api/messages/send`,
        formData,
        {
          signal: controller.signal,

          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (e) => {
            let uploaded = e.loaded;
            let cumulative = 0;
            const map = {};

            files.forEach(({ file, tempId }) => {
              const start = cumulative;
              const end = cumulative + file.size;
              cumulative = end;

              const percent =
                uploaded <= start
                  ? 0
                  : uploaded >= end
                    ? 100
                    : Math.round(((uploaded - start) / file.size) * 100);

              map[tempId] = percent;
            });

            setProgressMap(map);
          },
        },
      );

      //  Notify via socket ONLY after success
      if (res.data?.success) {
        // console.log("entering socket emit for channel or dm ggg");
        socket.emit(
          selectedChannel ? "new_channel_message" : "new_message",
          res.data.data,
        );
      }
      // cleanup
      setFiles([]);
      setProgressMap({});
      controllersRef.current = {};
      setText("");
    } catch (err) {
      if (err.name === "CanceledError") {
        console.log("Upload cancelled");
      } else {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("typing", ({ senderId }) => {
      if (senderId === other) {
        setIsTyping(true);
      }
    });

    socket.on("stop_typing", ({ senderId }) => {
      if (senderId === other) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, [socket, other]);

  const handleTyping = (e) => {
    setText(e.target.value);

    socket.emit("typing", {
      senderId: me,
      receiverId: other,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", {
        senderId: me,
        receiverId: other,
      });
    }, 1500);
  };

  const handleTypingThread = (e) => {
    setTextThread(e.target.value);

    socket.emit("typing", {
      senderId: me,
      receiverId: other,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", {
        senderId: me,
        receiverId: other,
      });
    }, 1500);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    bottomRefTheard.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadReplies]);

  // main chat files
  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files).map((file) => ({
      file,
      tempId: crypto.randomUUID(),
    }));
    setFiles((prev) => [...prev, ...selected]);
  };
  // thread files
  const handleFileSelectThread = (e) => {
    const selected = Array.from(e.target.files).map((file) => ({
      file,
      tempId: crypto.randomUUID(),
    }));
    setFilesThread((prev) => [...prev, ...selected]);
  };

  const cancelUploadThread = (tempId) => {
    controllersRef.current[tempId]?.abort();
    setFilesThread((prev) => prev.filter((f) => f.tempId !== tempId));
    setProgressMap((p) => {
      const copy = { ...p };
      delete copy[tempId];
      return copy;
    });
    delete controllersRef.current[tempId];
  };

  const cancelUpload = (tempId) => {
    controllersRef.current[tempId]?.abort();
    setFiles((prev) => prev.filter((f) => f.tempId !== tempId));
    setProgressMap((p) => {
      const copy = { ...p };
      delete copy[tempId];
      return copy;
    });
    delete controllersRef.current[tempId];
  };

  const removeFileThread = (index) => {
    setFilesThread((prev) => prev.filter((_, idx) => idx !== index));
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleKeyDownThread = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendReplyThread();
    }
  };

  // message Action buttons toggle
  useEffect(() => {
    if (!socket) return;

    const handleMessageDeleted = ({ messageId, parentMessageId }) => {
      if (parentMessageId) {
        setThreadReplies((prev) =>
          prev.map((m) =>
            m._id === messageId
              ? { ...m, isDelete: true, text: "", files: [] }
              : m,
          ),
        );
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m._id === messageId
              ? { ...m, isDelete: true, text: "", files: [] }
              : m,
          ),
        );
      }
    };

    socket.on("message_deleted", handleMessageDeleted);

    return () => {
      socket.off("message_deleted", handleMessageDeleted);
    };
  }, [socket]);

  // delete images

  // useEffect(() => {
  //   if (!socket) return;

  //   socket.on("message_file_deleted", ({ messageId, fileId }) => {
  //     setMessages((prev) =>
  //       prev.map((m) =>
  //         m._id === messageId
  //           ? {
  //               ...m,
  //               files: m.files.filter(
  //                 (f) => f._id !== fileId
  //               ),isDeleteFile:true,
  //             }
  //           : m
  //       )
  //     );
  //   });

  //   return () => socket.off("message_file_deleted");
  // }, [socket]);
  useEffect(() => {
    if (!socket) return;

    const onFileDeleted = ({ messageId, fileId, parentMessageId }) => {
      if (parentMessageId) {
        setThreadReplies((prev) =>
          prev.map((m) =>
            m._id === messageId
              ? {
                  ...m,
                  files: m.files.map((f) =>
                    f._id === fileId ? { ...f, isDeleteFile: true } : f,
                  ),
                }
              : m,
          ),
        );
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m._id === messageId
              ? {
                  ...m,
                  files: m.files.map((f) =>
                    f._id === fileId ? { ...f, isDeleteFile: true } : f,
                  ),
                }
              : m,
          ),
        );
      }
    };

    socket.on("message_file_deleted", onFileDeleted);

    return () => {
      socket.off("message_file_deleted", onFileDeleted);
    };
  }, [socket]);

  // Edit action useEffect
  useEffect(() => {
    if (!socket) return;
    socket.on("message_edited", (updatedMessage) => {
      if (updatedMessage.parentMessageId) {
        setThreadReplies((prev) =>
          prev.map((m) => (m._id === updatedMessage._id ? updatedMessage : m)),
        );
      } else {
        setMessages((prev) =>
          prev.map((m) => (m._id === updatedMessage._id ? updatedMessage : m)),
        );
      }
    });

    return () => socket.off("message_edited");
  }, [socket]);

  // thread message
  const sendReplyThread = async () => {
    if (!textThread && filesThread.length === 0) return;
    const fd = new FormData();
    fd.append("senderId", currentUser._id);
    fd.append("parentMessageId", activeThread._id);
    fd.append("receiverId", activeThread.receiverId || "");
    fd.append("channelId", activeThread.channelId || "");
    fd.append("text", textThread);
    console.log("filesThread", filesThread);

    filesThread.forEach(({ file }) => fd.append("files", file));

    const controller = new AbortController();

    // attach SAME controller to all files
    filesThread.forEach(({ tempId }) => {
      controllersRef.current[tempId] = controller;
    });

    const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);

    try {
      const res = await axios.post(
        selectedChannel
          ? `${API_URL}/api/messages/send`
          : `${API_URL}/api/messages/send`,
        fd,
        {
          signal: controller.signal,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (e) => {
            let uploaded = e.loaded;
            let cumulative = 0;
            const map = {};

            filesThread.forEach(({ file, tempId }) => {
              const start = cumulative;
              const end = cumulative + file.size;
              cumulative = end;

              const percent =
                uploaded <= start
                  ? 0
                  : uploaded >= end
                    ? 100
                    : Math.round(((uploaded - start) / file.size) * 100);

              map[tempId] = percent;
            });
            setProgressMap(map);
          },
        },
      );

      //  Notify via socket ONLY after success
      // if (res.data?.success) {
      //   // console.log("entering socket emit for channel or dm ggg");
      //   socket.emit(
      //     selectedChannel ? "new_channel_message" : "new_message",
      //     res.data.data,
      //   );
      // }
      // // leanup
      // setFiles([]);
      if (res.data?.success) {
        socket.emit("thread_reply", res.data.data);
      }

      setTextThread("");
      setFilesThread([]);
      setProgressMap({});
      controllersRef.current = {};
    } catch (err) {
      if (err.name === "CanceledError") {
        console.log("Upload cancelled");
      } else {
        console.error(err);
      }
    }

    // const res = await axios.post(`${API_URL}/api/messages/send`, fd);

    // if (res.data?.success) {
    //   console.log("coming")
    //   socket.emit("thread_reply", res.data.data);
    // }
  };

  // thread
  useEffect(() => {
    if (!activeThread) return;

    const fetchThreadMessages = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/messages/messages/thread/${activeThread._id}`,
        );
        setThreadReplies(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch thread messages", error);
      }
    };
    fetchThreadMessages();
  }, [activeThread]);

  // console.log("active thread",activeThread && activeThread._id,threadReplies);
  // socket update
  // useEffect(() => {
  //   if (!socket) return;

  //   socket.on("thread_reply", (reply) => {
  //     if (String(reply.parentMessageId) === String(activeThread?._id)) {
  //       setThreadReplies((prev) => [...prev, reply]);
  //     }
  //     // update count in main chat
  //     setMessages((prev) =>
  //       prev.map((m) =>
  //         m._id === reply.parentMessageId
  //           ? { ...m, threadReplyCount: m.threadReplyCount + 1 }
  //           : m
  //       )
  //     );
  //   });

  //   return () => socket.off("thread_reply");
  // }, [socket, activeThread]);

  useEffect(() => {
    if (!socket) return;

    const onThreadReply = (reply) => {
      // 🔒 Only replies for active thread
      if (String(reply.parentMessageId) === String(activeThread?._id)) {
        setThreadReplies((prev) => {
          const exists = prev.some((r) => String(r._id) === String(reply._id));
          if (exists) return prev;
          return [...prev, reply];
        });
      }

      // 🔢 Update reply count ONLY ONCE
      setMessages((prev) =>
        prev.map((m) =>
          String(m._id) === String(reply.parentMessageId)
            ? {
                ...m,
                threadReplyCount: (m.threadReplyCount || 0) + 1,
                lastThreadReplyAt: reply.createdAt,
              }
            : m,
        ),
      );
    };

    socket.on("thread_reply", onThreadReply);
    return () => socket.off("thread_reply", onThreadReply);
  }, [socket, activeThread]);

  // if (!selectedUser && !selectedChannel) {
  //   return (
  //     <div className=" flex  items-center justify-center bg-gradient-to-br from-gray-50 to-white h-100 border">
  //       <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center mb-6">
  //         <Send className="w-12 h-12 text-gray-400" />
  //       </div>
  //       <h3 className="text-xl font-semibold text-gray-700 mb-2">
  //         Welcome to Aryu Chat
  //       </h3>
  //       <p className="text-gray-500">
  //         Select a conversation to start messaging
  //       </p>
  //     </div>
  //   );
  // }
  const USER_TYPE_ORDER = ["employee", "admin", "client", "clientSubUser"];

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    return USER_TYPE_ORDER.indexOf(a.type) - USER_TYPE_ORDER.indexOf(b.type);
  });

  if (!selectedUser && !selectedChannel) {
    return (
      // <div className="w-full">
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-50 to-white border">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center mb-6">
          <Send className="w-12 h-12 text-gray-400" />
        </div>

        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Welcome to Aryu Chat
        </h3>

        <p className="text-gray-500">
          Select a conversation to start messaging
        </p>
      </div>
      // </div>
    );
  }

  //   const renderTick = (msg) => {
  //   console.log("Rendering tick for message:", msg);

  //   if (!msg.deliveredAt) {
  //     return <Check className="w-3.5 h-3.5" />;
  //   }

  //   if (msg.isSeenByAll) {
  //     return <CheckCheck className="w-3.5 h-3.5 text-[#03f4fc]" />;
  //   }

  //   return <CheckCheck className="w-3.5 h-3.5 text-gray-500" />;
  // };

  const renderTick = (msg) => {
    console.log("Rendering tick for message:", msg);

    if (!msg.deliveredAt) {
      return <Check className="w-3.5 h-3.5" />;
    } else if (msg.isSeenByAll) {
      return <CheckCheck className="w-3.5 h-3.5 text-[#3549fa]" />;
    } else {
      return <CheckCheck className="w-3.5 h-3.5 text-gray-500" />;
    }
  };

  console.log(" Message Rendering Chat Window with selectedChannel:", messages);

  // meassage Action buttons

  const handleDeleteMessage = async (messageId, parentMessageId = null) => {
    try {
      const res = await axios.patch(
        `${API_URL}/api/messages/messages/${messageId}/delete`,
      );

      if (parentMessageId) {
        setThreadReplies((prev) =>
          prev.map((m) =>
            m._id === messageId
              ? { ...m, isDelete: true, text: "", files: [] }
              : m,
          ),
        );
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m._id === messageId
              ? { ...m, isDelete: true, text: "", files: [] }
              : m,
          ),
        );
      }

      socket.emit("message_deleted", { messageId, parentMessageId });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFile = async (messageId, fileId) => {
    try {
      await axios.delete(`${API_URL}/api/messages/messages/delete-file`, {
        params: {
          messageId,
          fileId,
        },
      });
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // edit text and file
  const handleSaveEdit = async (messageId) => {
    if (!editText.trim() && editFiles.length === 0) return;
    const formData = new FormData();
    formData.append("messageId", messageId);
    formData.append("text", editText);
    editFiles.forEach(({ file }) => formData.append("files", file));
    try {
      const res = await axios.patch(
        `${API_URL}/api/messages/messages/edit`, // make sure backend route exists
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (res.data.success) {
        setMessages((prev) =>
          prev.map((m) => (m._id === messageId ? res.data.data : m)),
        );
        socket.emit("message_edited", res.data.data);
        setEditingMessageId(null);
        setEditText("");
        setEditFiles([]);
      }
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  const handleSaveEditThread = async (messageId) => {
    if (!editTextThread.trim() && editFilesThread.length === 0) return;
    const formData = new FormData();
    formData.append("messageId", messageId);
    formData.append("text", editTextThread);
    editFilesThread.forEach(({ file }) => formData.append("files", file));
    try {
      const res = await axios.patch(
        `${API_URL}/api/messages/messages/edit`, // make sure backend route exists
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (res.data.success) {
        setThreadReplies((prev) =>
          prev.map((m) => (m._id === messageId ? res.data.data : m)),
        );
        socket.emit("message_edited", res.data.data);
        setEditingMessageIdThread(null);
        setEditTextThread("");
        setEditFilesThread([]);
      }
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  const handleForward = async (receiverId, channelId, message) => {
    try {
      if (!message) return;

      const formData = new FormData();

      formData.append("senderId", currentUser._id);
      formData.append("receiverId", receiverId || "");
      formData.append("channelId", channelId || "");
      formData.append("isForwarded", true);

      // 🔹 text only when forwarding full message
      formData.append("text", selectedForwardFile ? "" : message.text || "");

      // 🔹 decide files
      let filesToForward = [];

      if (selectedForwardFile) {
        if (!selectedForwardFile.isDeleteFile) {
          filesToForward = [selectedForwardFile];
        }
      } else {
        filesToForward = message.files?.filter((f) => !f.isDeleteFile) || [];
      }

      // 🔹 convert URL → File
      for (const f of filesToForward) {
        const file = await urlToFile(f.url, f.name, f.type);
        formData.append("files", file);
      }

      const res = await axios.post(`${API_URL}/api/messages/send`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        socket.emit(
          channelId ? "new_channel_message" : "new_message",
          res.data.data,
        );
      }
      // cleanup
      setShowForwardDropdown(false);
      setForwardMessage(null);
      setSelectedForwardFile(null);
    } catch (err) {
      console.error("Forward failed", err);
    }
  };

  // image url to file object
  const urlToFile = async (url, filename, type) => {
    const res = await fetch(`${API_URL}/api${url}`);
    const blob = await res.blob();
    return new File([blob], filename, { type });
  };

  // thread
  const ThreadInput = ({ parentMessage, currentUser, socket }) => {
    const [textThread, setTextThread] = useState("");
    const fileRefThread = useRef();
    const [filesThread, setFilesThread] = useState([]);

    const sendReply = async () => {
      if (!text && files.length === 0) return;
      const fd = new FormData();
      fd.append("senderId", currentUser._id);
      fd.append("parentMessageId", parentMessage._id);
      fd.append("receiverId", parentMessage.receiverId || "");
      fd.append("channelId", parentMessage.channelId || "");
      fd.append("text", text);

      files.forEach((f) => fd.append("files", f));

      const res = await axios.post(`${API_URL}/api/messages/send`, fd);

      // if (res.data?.success) {
      //   console.log("coming")
      //   socket.emit("thread_reply", res.data.data);
      // }
      if (res.data?.success) {
        socket.emit("thread_reply", res.data.data);
      }

      setText("");
      setFiles([]);
    };

    return (
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Reply…"
          className="flex-1 border rounded px-2 py-1"
        />
        <button onClick={() => fileRef.current.click()}>📎</button>
        <button onClick={sendReply} className="text-blue-600">
          Send
        </button>

        <input
          type="file"
          hidden
          multiple
          ref={fileRef}
          onChange={(e) => setFiles([...files, ...Array.from(e.target.files)])}
        />
      </div>
    );
  };

  // seen by Api fetch
  const fetchSeenBy = async (messageId) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/messages/messages/seen-by/${messageId}`,
      );

      if (res.data.success) {
        console.log("res.data.success", res.data.success);
        setSeenByUsers(res.data.data);
        setActiveSeenMessage(messageId);
        setShowSeenPopup(true);
      }
    } catch (err) {
      console.error("Seen by fetch error", err);
    }
  };

  return (
    <div className="flex-1 flex flex-col  h-full bg-gradient-to-br from-gray-50 to-white border w-full relative  ">
      {/* channel pop  */}
      {selectedChannel && open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          {/* click outside to close */}

          <div className="relative bg-white w-full max-w-md mx-4 rounded-xl shadow-xl  max-h-[80vh] overflow-y-auto ">
            <div className="absolute inset-0" onClick={() => setOpen(false)} />
            <div className="sticky top-0 z-10 p-3 bg-white border-b flex justify-around items-center">
              <div>
                <h3 className="font-bold text-lg">Channel Members</h3>
              </div>
              <div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-500  hover:text-red-400 "
                >
                  ✕
                </button>
                <div></div>
              </div>
            </div>
            {channelMembers &&
              channelMembers.map((m) => (
                <div
                  key={m._id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-gray-100"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
                    {m.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.email}</p>
                  </div>
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                    {m.role}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {showSeenPopup && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
          onClick={() => setShowSeenPopup(false)}
        >
          <div
            className="bg-white w-72 rounded-xl shadow-xl p-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Seen by</h3>

              <button
                onClick={() => setShowSeenPopup(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={16} />
              </button>
            </div>

            {seenByUsers.length === 0 ? (
              <p className="text-sm text-gray-500">No one has seen this yet</p>
            ) : (
              <ul className="space-y-2 max-h-52 overflow-y-auto">
                {seenByUsers.map((u) => (
                  <li key={u._id} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                      {u.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="text-sm font-medium">{u.name}</p>
                      {/* <p className="text-xs text-gray-500">
                  Seen at {new Date(u.seenAt).toLocaleTimeString()}
                </p> */}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <div className="flex  overflow-scroll">
        <div className="flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50/50 overflow-scroll h-[100vh] w-full ">
          {/* Chat Header */}
          {console.log("showForwardDropdown:", showForwardDropdown)}
          {showForwardDropdown && (
            <div
              className="absolute top-10 right-2 w-[90%] bg-white border rounded-xl shadow-xl z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end w-full pr-5 p-2">
                <button
                  onClick={() => {
                    setShowForwardDropdown(false);
                    setForwardMessage(null);
                  }}
                  className="  flex justify-end  text-red-500"
                >
                  ✕
                </button>
              </div>

              {/* HEADER */}
              <div className="px-3 py-2 text-[20px] font-semibold text-gray-500 border-b">
                Forward to…
              </div>

              {/* SEARCH */}
              <input
                value={searchForward}
                onChange={(e) => setSearchForward(e.target.value)}
                placeholder="Search people or channels"
                className="w-full px-3 py-2 text-sm border-b outline-none"
              />

              {/* MESSAGE PREVIEW */}
              {forwardMessage && (
                <div className="px-3 py-2 bg-gray-50 border-b">
                  <p className="text-xs text-gray-600 truncate">
                    {forwardMessage.text || "📎 Attachment"}
                  </p>
                  {forwardMessage.files?.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {forwardMessage.files.slice(0, 3).map((f) => (
                        <span
                          key={f._id}
                          className="text-[10px] bg-gray-200 px-1 rounded"
                        >
                          {f.type.startsWith("image") ? "🖼" : "📄"}
                        </span>
                      ))}
                      {forwardMessage.files.length > 3 && (
                        <span className="text-[10px] text-gray-500">
                          +{forwardMessage.files.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* SCROLL AREA */}
              <div className="max-h-64 overflow-y-auto">
                {/* USERS */}
                {/* {sortedUsers.length > 0 && (
                <>
                  <div className="px-3 py-1 text-xs text-gray-400">People</div>
                  {sortedUsers.map((u) => (
                    <button
                      key={u._id}
                      onClick={() => {
                        onSelectUser?.(u);
                        handleForward(u._id, null, forwardMessage);
                      }}
                      className="w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-100 text-sm"
                    >
                      👤 {u.name}
                    </button>
                  ))}
                </>
              )} */}

                {sortedUsers.length > 0 && (
                  <>
                    <div className="px-3 py-1 text-xs text-gray-400">
                      People
                    </div>
                    {USER_TYPE_ORDER.map((type) => {
                      const usersByType = sortedUsers.filter(
                        (u) => u.type === type,
                      );

                      if (usersByType.length === 0) return null;

                      return (
                        <div key={type}>
                          {/* Type Header */}
                          <div className="px-3 py-1 text-[15px] font-semibold text-blue-900  uppercase">
                            {type}
                          </div>

                          {/* Users */}
                          {usersByType.map((u) => (
                            <button
                              key={u._id}
                              onClick={() => {
                                onSelectUser?.(u);
                                handleForward(u._id, null, forwardMessage);
                              }}
                              className="w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-100 text-sm"
                            >
                              👤 {u.name}
                              {/* {u.online && (
                <span className="ml-auto h-2 w-2 rounded-full bg-green-500" />
              )} */}
                            </button>
                          ))}
                        </div>
                      );
                    })}
                  </>
                )}

                {/* CHANNELS */}
                {filteredChannels.length > 0 && (
                  <>
                    <div className="px-3 py-1 text-[15px] font-semibold text-blue-900  uppercase">
                      Channels
                    </div>
                    {filteredChannels.map((c) => (
                      <button
                        key={c._id}
                        onClick={() => {
                          openChannel(c);
                          handleForward(null, c._id, forwardMessage);
                        }}
                        className="w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-100 text-sm"
                      >
                        # {c.name}
                      </button>
                    ))}
                  </>
                )}

                {/* EMPTY */}
                {filteredUsers.length === 0 &&
                  filteredChannels.length === 0 && (
                    <div className="px-3 py-6 text-center text-sm text-gray-400">
                      No results found
                    </div>
                  )}
              </div>
            </div>
          )}

          <div className="px-6 py-4 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 ">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {/* {console.log(
                    "Rendering header with selectedUser name:",
                    selectedUser,
                  )} */}
                    {selectedUser && selectedUser?.name.charAt(0).toUpperCase()}
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      selectedUser &&
                      onlineUsers &&
                      onlineUsers.includes(selectedUser._id)
                        ? "bg-green-500 animate-pulse"
                        : "bg-gray-400"
                    }`}
                  />
                </div>

                <div>
                  <h2 className="font-bold text-gray-800 text-lg">
                    <h2 className="font-bold">
                      {console.log(
                        "Rendering header with selectedUser channel:",
                        selectedChannel?.name,
                      )}
                      {(selectedUser && selectedUser?.name) ||
                        `# ${selectedChannel && selectedChannel?.name}`}
                    </h2>
                  </h2>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-500">
                      {onlineUsers && onlineUsers.includes(selectedUser._id) ? (
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>{" "}
                          Online now
                        </span>
                      ) : (
                        "Last seen recently"
                      )}
                    </p>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-blue-600 font-medium">
                      {messages.length} messages
                    </span>
                  </div>
                </div>
              </div>
              {/* <div className="flex items-center space-x-2">
            <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
              <Video className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowActions(!showActions)}
              className="p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div> */}
              {selectedChannel && (
                <MembersAvatarStack
                  members={channelMembers}
                  setFuntionOpen={(val) => setOpen(val)}
                />
              )}
            </div>
          </div>

          {/*  Hover Actions */}

          {/* Messages Container */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gradient-to-b from-white to-gray-50/30 w-full ">
            <div className="w-full mx-auto space-y-3">
              {messages.map((m) => {
                const isMe = m.senderId === me;
                const time = m.createdAt
                  ? new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "";
                const date = m.createdAt
                  ? new Date(m.createdAt).toLocaleDateString([], {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })
                  : "";

                return (
                  <div
                    key={m._id || m.clientId}
                    className={`flex ${
                      isMe ? "justify-end" : "justify-start"
                    } group`}
                  >
                    <div
                      className={`max-w-[70%] lg:max-w-[60%] ${
                        isMe ? "ml-auto" : ""
                      }`}
                    >
                      <div
                        className={`relative rounded-2xl px-4 py-3 shadow-sm cursor-pointer ${
                          isMe?"bg-[#DBEAFE] text-black rounded-br-lg"
                            // ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-lg"
                            : "bg-white text-gray-800 border border-gray-200 rounded-bl-lg"
                        }`}
                        onMouseEnter={() =>
                          setHoveredMessageId(m._id || m.clientId)
                        }
                        onMouseLeave={() => setHoveredMessageId(null)}
                      >
                        {/* 🔥 Hover Actions */}
                        {!m.isDelete &&
                          isMe &&
                          hoveredMessageId === (m._id || m.clientId) && (
                            <div
                              className={`absolute -top-9 ${
                                isMe ? "right-2" : "left-2"
                              }
    flex items-center gap-1
    bg-white border border-gray-200
    rounded-xl shadow-lg
    px-1.5 py-1
    z-30
    opacity-0 group-hover:opacity-100
    transition-all duration-150`}
                            >
                              {/* THREAD */}
                              {/* <ActionButton title="Reply in thread">
                            <MessageSquare size={14} />
                          </ActionButton> */}
                              {isMe && (
                                <ActionButton
                                  title="Reply in thread"
                                  onClick={() => setActiveThread(m)}
                                >
                                  <MessageSquare size={14} />
                                </ActionButton>
                              )}

                              {/* EDIT */}
                              {/* {isMe && (
                            <ActionButton title="Edit message">
                              <Pencil size={14} />
                            </ActionButton>
                          )} */}
                              {isMe && (
                                <ActionButton
                                  title="Edit message"
                                  onClick={() => {
                                    setEditingMessageId(m._id);
                                    setEditText(m.text || "");
                                    setEditFiles([]); // new files only
                                  }}
                                >
                                  <Pencil size={14} />
                                </ActionButton>
                              )}

                              {/* DELETE */}
                              {/* {isMe && (
      <ActionButton danger title="Delete message">
        <Trash2 size={14} />
      </ActionButton>
    )} */}
                              {isMe && (
                                <ActionButton
                                  danger
                                  title="Delete message"
                                  onClick={() => handleDeleteMessage(m._id)}
                                >
                                  <Trash2 size={14} />
                                </ActionButton>
                              )}

                              {/* FORWARD
                          <ActionButton
                            title="Forward"
                            onClick={() => openForwardMessage(m._id)}
                          >
                            <CornerUpRight size={14} />
                          </ActionButton> */}
                              {isMe && (
                                <ActionButton
                                  title="Forward"
                                  onClick={() => {
                                    setForwardMessage(m);
                                    setShowForwardDropdown(true);
                                  }}
                                >
                                  <CornerUpRight size={14} />
                                </ActionButton>
                              )}

                              {/* SEEN */}
                              {/* <ActionButton title="Seen by">
                              <Eye size={14} />
                            </ActionButton> */}
                              {isMe && (
                                <ActionButton
                                  title="Seen by"
                                  onClick={() => fetchSeenBy(m._id)}
                                >
                                  <Eye size={14} />
                                </ActionButton>
                              )}
                            </div>
                          )}

                        {/* {m.text && (
                      <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
                        {m.text}
                      </p>
                    )} */}
                        {/* {m.isDelete ? (
                      <p className="italic text-sm text-gray-400 select-none">
                        This message was deleted
                      </p>
                    ) : (
                      m.text && <MessageText text={m.text} isMe={isMe} />
                    )} */}
                        {editingMessageId === m._id ? (
                          <div className="space-y-2">
                            {/* Edit Text */}
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full border rounded-lg p-2 text-sm text-black"
                              rows={2}
                            />

                            {/* Edit Files */}
                            <div className="flex flex-wrap gap-2">
                              {editFiles.map(({ file, tempId }, idx) => {
                                const url = URL.createObjectURL(file);
                                const icon = getFileIcon(file.type, file.name);
                                return (
                                  <div
                                    key={tempId}
                                    className="relative w-20 h-20 rounded-lg overflow-hidden border shadow-sm"
                                  >
                                    {/* <img
                                      src={url}
                                      alt={file.name}
                                      className="w-full h-full object-cover"
                                    /> */}
                                    {/* const type = file.type; */}

                                    {file.type.startsWith("image/") ? (
                                      <img
                                        src={url}
                                        className="w-full h-full object-cover"
                                        alt="preview"
                                      />
                                    ) : file.type.startsWith("video/") ? (
                                      <video
                                        src={url}
                                        controls
                                        className="w-full h-full object-cover"
                                      />
                                    ) : file.type.startsWith("audio/") ? (
                                      <audio
                                        src={url}
                                        controls
                                        className="w-full "
                                      />
                                    ) : file.type === "application/pdf" ? (
                                      <iframe
                                        src={url}
                                        title="pdf"
                                        className="w-full h-full"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex flex-col items-center justify-center p-3">
                                        <span className="text-2xl mb-2">
                                          {icon}
                                        </span>

                                        <p className="text-xs text-center font-medium truncate w-full">
                                          {file.name
                                            .split(".")
                                            .slice(0, -1)
                                            .join(".")}
                                        </p>

                                        <p className="text-[11px] text-gray-500 mt-1">
                                          {formatSize(file.size)}
                                        </p>
                                      </div>
                                    )}

                                    <button
                                      onClick={() =>
                                        setEditFiles((prev) =>
                                          prev.filter(
                                            (f) => f.tempId !== tempId,
                                          ),
                                        )
                                      }
                                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                    >
                                      ×
                                    </button>
                                  </div>
                                );
                              })}

                              <button
                                onClick={() => editFileRef.current.click()}
                                className="w-15 h-10 p-5 flex items-center justify-center rounded-lg border border-gray-300  hover:bg-gray-100 hover:text-black"
                              >
                                + Add
                              </button>
                              <input
                                type="file"
                                multiple
                                ref={editFileRef}
                                className="hidden"
                                onChange={(e) => {
                                  const newFiles = Array.from(
                                    e.target.files,
                                  ).map((file) => ({
                                    file,
                                    tempId: crypto.randomUUID(),
                                  }));
                                  setEditFiles((prev) => [
                                    ...prev,
                                    ...newFiles,
                                  ]);
                                }}
                              />
                            </div>

                            <div className="flex justify-end gap-2 mt-2">
                              <button
                                onClick={() => setEditingMessageId(null)}
                                className="text-sm bg-red-500 text-white p-1  rounded-md "
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveEdit(m._id)}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* {m.text && <MessageText text={m.text} isMe={isMe} />} */}
                            {m.isDelete ? (
                              <p className="italic text-sm text-red-400 select-none">
                                This message was deleted
                              </p>
                            ) : m.text ? (
                              <div className="relative group max-w-fit">
                                <MessageText text={m.text.trim()} isMe={isMe} />

                                {/* TEXT ACTIONS */}
                                {isMe && (
                                  <TextActions text={m.text} message={m} />
                                )}
                              </div>
                            ) : null}

                            {/* existing files rendering here */}
                          </>
                        )}

                        {/* 
                    {m.text && (
                      <div className="mb-1">
                        <MessageText text={m.text} isMe={isMe} />
                      </div>
                    )} */}

                        {/* Files */}

                        {/* editingMessageId === m._id && */}

                        {editingMessageId !== m._id &&
                          m.files.map((f) => {
                            const src = `${API_URL}/api${f.url}`;

                            return (
                              <div key={f._id} className="mt-3 relative group">
                                {/* 🔥 FILE DELETED PLACEHOLDER */}
                                {f.isDeleteFile ? (
                                  <div className="italic text-red-400 text-sm p-3 rounded-lg bg-gray-100">
                                    🗑 File deleted
                                  </div>
                                ) : (
                                  <>
                                    {/* IMAGE */}
                                    {f.type.startsWith("image") && (
                                      <div className="relative">
                                        <img
                                          src={src}
                                          className="rounded-xl max-w-full h-auto shadow-sm"
                                          alt={f.name}
                                        />

                                        <FileActions
                                          src={src}
                                          isMe={isMe}
                                          onDelete={() =>
                                            handleDeleteFile(m._id, f._id)
                                          }
                                          onForward={() => {
                                            setForwardMessage(m); // parent message
                                            setSelectedForwardFile(f); // 🔥 only this file
                                            setShowForwardDropdown(true);
                                          }}
                                        />
                                      </div>
                                    )}

                                    {/* VIDEO */}
                                    {f.type.startsWith("video") && (
                                      <div className="relative rounded-xl overflow-hidden">
                                        <video controls className="w-full">
                                          <source src={src} type={f.type} />
                                        </video>

                                        <FileActions
                                          src={src}
                                          isMe={isMe}
                                          onDelete={() =>
                                            handleDeleteFile(m._id, f._id)
                                          }
                                          onForward={() => {
                                            setForwardMessage(m); // parent message
                                            setSelectedForwardFile(f); // 🔥 only this file
                                            setShowForwardDropdown(true);
                                          }}
                                        />
                                      </div>
                                    )}

                                    {/* AUDIO */}
                                    {f.type.startsWith("audio") && (
                                      <div className="relative p-3 bg-black/5 rounded-lg">
                                        <audio
                                          controls
                                          className="w-full"
                                          src={src}
                                        />

                                        <FileActions
                                          src={src}
                                          isMe={isMe}
                                          onDelete={() =>
                                            handleDeleteFile(m._id, f._id)
                                          }
                                          onForward={() => {
                                            setForwardMessage(m); // parent message
                                            setSelectedForwardFile(f); // 🔥 only this file
                                            setShowForwardDropdown(true);
                                          }}
                                        />
                                      </div>
                                    )}

                                    {/* application/pdf */}
                                    {f.type.startsWith("application/pdf") && (
                                      <div className="relative p-3 bg-black/5 rounded-lg">
                                        {/* <audio
                                          controls
                                          className="w-full"
                                          src={src}
                                        /> */}
                                        <iframe
                                          src={src}
                                          title="pdf"
                                          className="w-full h-full"
                                        />

                                        <FileActions
                                          src={src}
                                          isMe={isMe}
                                          onDelete={() =>
                                            handleDeleteFile(m._id, f._id)
                                          }
                                          onForward={() => {
                                            setForwardMessage(m); // parent message
                                            setSelectedForwardFile(f); // 🔥 only this file
                                            setShowForwardDropdown(true);
                                          }}
                                        />
                                      </div>
                                    )}

                                    {/* DOCUMENT / OTHER */}
                                    {!f.type.startsWith("image") &&
                                      !f.type.startsWith("video") &&
                                      !f.type.startsWith("audio") &&
                                      !f.type.startsWith("application/pdf") && (
                                        <div
                                          className={`relative flex items-center gap-3 p-3 rounded-xl ${
                                            isMe
                                              ? "bg-blue-500/20 hover:bg-blue-500/30"
                                              : "bg-gray-100 hover:bg-gray-200"
                                          } transition-colors`}
                                        >
                                          <span className="text-xl">
                                            {getFileIcon(f.type, f.name)}
                                          </span>

                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                              {f.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              {formatSize(f.size)}
                                            </p>
                                          </div>

                                          {/* <FileActions
                                        src={src}
                                        isMe={isMe}
                                        onDelete={() =>
                                          handleDeleteFile(m._id, f._id)
                                        }
                                      /> */}
                                          <FileActions
                                            src={src}
                                            isMe={isMe}
                                            onDelete={() =>
                                              handleDeleteFile(m._id, f._id)
                                            }
                                            onForward={() => {
                                              setForwardMessage(m); // parent message
                                              setSelectedForwardFile(f); // 🔥 only this file
                                              setShowForwardDropdown(true);
                                            }}
                                          />
                                        </div>
                                      )}
                                  </>
                                )}
                              </div>
                            );
                          })}

                        {/* dm tick */}
                        {/* Message Status and Time */}
                        {/* {selectedUser && (
                        <div
                          className={`flex items-center justify-end gap-2 mt-2 ${
                            isMe ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          <span className="text-xs">{time}</span>
                         
                          {isMe && (
                            <div className="flex items-center">
                              {m.seenAt ? (
                                <CheckCheck className="w-3.5 h-3.5 text-[#03f4fc]" />
                              ) : m.deliveredAt && !m.seenAt ? (
                                <CheckCheck className="w-3.5 h-3.5" />
                              ) : (
                                <Check className="w-3.5 h-3.5" />
                              )}
                            </div>
                          )}
                        </div>
                      )} */}
                        {/* channel tick */}
                        {/* {selectedChannel && m.senderId == me && (
                        <div>
                          <div className="message-footer">{renderTick(m)}</div>
                        </div>
                      )} */}
                        {/* dm tick */}
                        {/* Message Status and Time */}
                        {selectedUser && (
                          <div
                            className={`flex items-center justify-end gap-2 mt-2 ${
                              isMe ? "text-black-800" : "text-gray-500"
                            }`}
                          >
                            <div>
                              {" "}
                              <span className="text-xs">{date}</span>
                            </div>
                            <div className="flex gap">
                              <span className="text-xs">{time}</span>
                              {console.log(
                                "Rendering ticks for message:",
                                m.seenAt,
                              )}
                              {/* {isMe && (
                              <div className="flex items-center">
                                {!m.deliveredAt && !m.seenAt && (
                                  <Check className="w-3.5 h-3.5" />
                                )}
                                {m.deliveredAt && !m.seenAt && (
                                  <CheckCheck className="w-3.5 h-3.5" />
                                )}
                                {m.seenAt && (
                                  <CheckCheck className="w-3.5 h-3.5 text-[#03f4fc]" />
                                )}
                              </div>
                            )} */}
                              {/* {isMe && (
                            <div className="flex items-center">
                              {m.seenAt ? (
                                <CheckCheck className="w-3.5 h-3.5 text-[#03f4fc]" />
                              ) : m.deliveredAt && !m.seenAt ? (
                                <CheckCheck className="w-3.5 h-3.5" />
                              ) : (
                                <Check className="w-3.5 h-3.5" />
                              )}
                            </div>
                          )} */}
                              {isMe && (
                                <div className="flex items-center">
                                  {(() => {
                                    if (!m.deliveredAt) {
                                      return <Check className="w-3.5 h-3.5" />;
                                    } else if (m.deliveredAt && !m.seenAt) {
                                      return (
                                        <CheckCheck className="w-3.5 h-3.5" />
                                      );
                                    } else if (m.seenAt) {
                                      return (
                                        <CheckCheck className="w-3.5 h-3.5 text-[#3549fa]" />
                                      );
                                    }
                                    return <Check className="w-3.5 h-3.5" />;
                                  })()}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {/* channel tick */}
                        {selectedChannel && (
                          <div
                            className={` gap-2 mt-2 ${
                              isMe ? "text-black-800" : "text-gray-500"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mt-2">
                              <div>
                                {" "}
                                <span className="text-xs">{date}</span>
                              </div>
                              <div className="flex gap-3">
                                <span className="text-xs">{time}</span>
                                {m.senderId == me && (
                                  <div className="message-footer">
                                    {renderTick(m)}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div
                              className="text-xs"
                              onClick={() => setActiveThread(m)}
                            >
                              Thread : {m.threadReplyCount}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                     <div ref={bottomRef} />
                  </div>
                  
                );
              })}
             
            </div>
          </div>

          {/* Typing Indicator */}
          {isTyping && (
            <div className="px-6 py-2">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="flex space-x-1">
                  <div
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
                <span>{selectedUser.name} is typing...</span>
              </div>
            </div>
          )}

          {/* File Preview Section */}
          {files.length > 0 && (
            <div className="px-6 py-3 border-t bg-white/90 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">
                  Preparing to send ({files.length})
                </span>
                <button
                  onClick={() => setFiles([])}
                  className="text-sm text-red-500 hover:text-red-600 font-medium"
                >
                  Clear all
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {files.map(({ file, tempId }, i) => {
                  const url = URL.createObjectURL(file);
                  const icon = getFileIcon(file.type, file.name);
                  const progress = progressMap[tempId] || 0;

                  return (
                    <div
                      key={i}
                      className="relative flex-shrink-0 w-28 h-28 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden group"
                    >
                      {progress < 100 ? (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10">
                          <CircularProgress percent={progress} size={45} />
                          <button
                            onClick={() => cancelUpload(tempId)}
                            className="mt-2 text-xs text-white hover:text-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => removeFile(i)}
                          className="absolute top-2 right-2 z-10 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                      {/* {file.type.startsWith("image") ? (
                        <img
                          src={url}
                          className="w-full h-full object-cover"
                          alt="Preview"
                        />
                      ) :
                       (
                        <div className="w-full h-full flex flex-col items-center justify-center p-3">
                          <span className="text-2xl mb-2">{icon}</span>
                          <p className="text-xs text-center font-medium truncate w-full">
                            {file.name.split(".").slice(0, -1).join(".")}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-1">
                            {formatSize(file.size)}
                          </p>
                        </div>
                      )} */}

                      {file.type.startsWith("image/") ? (
                        <img
                          src={url}
                          className="w-full h-full object-cover"
                          alt="preview"
                        />
                      ) : file.type.startsWith("video/") ? (
                        <video
                          src={url}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : file.type.startsWith("audio/") ? (
                        <audio src={url} controls className="w-full " />
                      ) : file.type === "application/pdf" ? (
                        <iframe
                          src={url}
                          title="pdf"
                          className="w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-3">
                          <span className="text-2xl mb-2">{icon}</span>

                          <p className="text-xs text-center font-medium truncate w-full">
                            {file.name.split(".").slice(0, -1).join(".")}
                          </p>

                          <p className="text-[11px] text-gray-500 mt-1">
                            {formatSize(file.size)}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="px-6 py-4 border-t bg-white">
            <div className="flex items-end gap-3">
              {/* File Upload Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.click();
                    }
                  }}
                  className="p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              {/* Text Input */}
              <div className="flex-1 relative">
                <div className="relative">
                  <textarea
                    value={text}
                    onChange={handleTyping}
                    onKeyDown={handleKeyDown}
                    placeholder={`Message ${
                      (selectedUser && selectedUser?.name) ||
                      (selectedChannel && "#" + selectedChannel?.name)
                    }...`}
                    rows={1}
                    className="w-full border border-gray-300 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none max-h-32 bg-gray-50 text-gray-900 placeholder-gray-500"
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                  />
                  <button
                    onClick={() => setText("")}
                    className={`absolute right-3 top-3 p-1 rounded-full hover:bg-gray-200 transition-colors ${
                      text ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Send Button */}
              <button
                onClick={sendMessage}
                disabled={!text.trim() && files.length === 0}
                className={`p-3 rounded-full transition-all duration-200 ${
                  text.trim() || files.length > 0
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {/* Helper Text */}
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                Press <span className="font-semibold">Enter</span> to send •{" "}
                <span className="font-semibold">Shift + Enter</span> for new
                line
              </p>
            </div>
          </div>
        </div>

        {/* Thread component */}

        {activeThread && (
          <div className="flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50/50 overflow-scroll">
            {activeThread && (
              <div className=" border-b  flex flex-col w-full overflow-hidden h-[100vh] ">
                {/* HEADER */}
               <div className="p-2 py-5 border-b flex justify-between items-center w-full sticky top-0 z-20 bg-white">

                  <div>
                    <h3 className="font-semibold text-gray-800">Thread</h3>
                    <p className="text-xs text-gray-500">Replies to message</p>
                  </div>
                  <button
                    onClick={() => setActiveThread(null)}
                    className="text-blue-500 hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
               
                {/* REPLIES */}
              <div className="flex-1 flex flex-col  p-4 md:p-6 overflow-y-auto bg-gradient-to-b from-white to-gray-50/30 gap-2  ">

                 
                  {threadReplies &&
                    threadReplies.map((m, index) => {
                      const isMe = m.senderId === me;
                      const time = m.createdAt
                        ? new Date(m.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "";
                      const date = m.createdAt
                        ? new Date(m.createdAt).toLocaleDateString([], {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                          })
                        : "";

                      return (
                        <div
                          key={m._id || m.clientId}
                          className={`flex ${
                            isMe ? "justify-end" : "justify-start"
                          } group`}
                        >
                          <div
                            className={`max-w-[70%] lg:max-w-[60%] ${
                              isMe ? "ml-auto" : ""
                            }`}
                          >
                            <div
                              className={`relative rounded-2xl px-4 py-3 shadow-sm cursor-pointer ${
                                isMe?"bg-[#DBEAFE] text-black rounded-br-lg"
                                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-lg"
                              }`}
                              onMouseEnter={() =>
                                setHoveredMessageId(m._id || m.clientId)
                              }
                              onMouseLeave={() => setHoveredMessageId(null)}
                            >
                              {/* 🔥 Hover Actions */}
                              {index != 0 &&
                                !m.isDelete &&
                                isMe &&
                                hoveredMessageId === (m._id || m.clientId) && (
                                  <div
                                    className={`absolute -top-6 ${
                                      isMe ? "right-2" : "left-2"
                                    }
    flex items-center gap-1
    bg-white border border-gray-200
    rounded-xl shadow-lg
    px-1.5 py-1
    z-[50]
    opacity-0 group-hover:opacity-100
    transition-all duration-150`}
                                  >
                                    {/* THREAD */}
                                    {/* <ActionButton title="Reply in thread">
                            <MessageSquare size={14} />
                          </ActionButton> */}
                                    {/* {isMe && (
                                    <ActionButton
                                      title="Reply in thread"
                                      onClick={() => setActiveThread(m)}
                                    >
                                      <MessageSquare size={14} />
                                    </ActionButton>
                                  )} */}

                                    {/* EDIT */}
                                    {/* {isMe && (
                            <ActionButton title="Edit message">
                              <Pencil size={14} />
                            </ActionButton>
                          )} */}
                                    {isMe && (
                                      <ActionButton
                                        title="Edit message"
                                        onClick={() => {
                                          setEditingMessageIdThread(m._id);
                                          setEditTextThread(m.text || "");
                                          setEditFilesThread([]); // new files only
                                        }}
                                      >
                                        <Pencil size={14} />
                                      </ActionButton>
                                    )}

                                    {/* DELETE */}
                                    {/* {isMe && (
      <ActionButton danger title="Delete message">
        <Trash2 size={14} />
      </ActionButton>
    )} */}
                                    {isMe && (
                                      <ActionButton
                                        danger
                                        title="Delete message"
                                        onClick={() =>
                                          handleDeleteMessage(
                                            m._id,
                                            m.parentMessageId,
                                          )
                                        }
                                      >
                                        <Trash2 size={14} />
                                      </ActionButton>
                                    )}

                                    {/* FORWARD
                          <ActionButton
                            title="Forward"
                            onClick={() => openForwardMessage(m._id)}
                          >
                            <CornerUpRight size={14} />
                          </ActionButton> */}
                                    {isMe && (
                                      <ActionButton
                                        title="Forward"
                                        onClick={() => {
                                          setForwardMessage(m);
                                          setShowForwardDropdown(true);
                                        }}
                                      >
                                        <CornerUpRight size={14} />
                                      </ActionButton>
                                    )}

                                    {/* SEEN */}
                                    {/* <ActionButton title="Seen by">
                              <Eye size={14} />
                            </ActionButton> */}
                                    {isMe && (
                                      <ActionButton
                                        title="Seen by"
                                        onClick={() => fetchSeenBy(m._id)}
                                      >
                                        <Eye size={14} />
                                      </ActionButton>
                                    )}
                                  </div>
                                )}

                              {/* {m.text && (
                      <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
                        {m.text}
                      </p>
                    )} */}
                              {/* {m.isDelete ? (
                      <p className="italic text-sm text-gray-400 select-none">
                        This message was deleted
                      </p>
                    ) : (
                      m.text && <MessageText text={m.text} isMe={isMe} />
                    )} */}
                              {editingMessageIdThread === m._id ? (
                                <div className="space-y-2">
                                  {/* Edit Text */}
                                  <textarea
                                    value={editTextThread}
                                    onChange={(e) =>
                                      setEditTextThread(e.target.value)
                                    }
                                    className="w-full border rounded-lg p-2 text-sm text-black"
                                    rows={2}
                                  />
                                  {/* Edit Files */}
                                  <div className="flex flex-wrap gap-2">
                                    {editFilesThread.map(
                                      ({ file, tempId }, idx) => {
                                        const url = URL.createObjectURL(file);
                                        return (
                                          <div
                                            key={tempId}
                                            className="relative w-20 h-20 rounded-lg overflow-hidden border shadow-sm"
                                          >
                                            {/* <img
                                            src={url}
                                            alt={file.name}
                                            className="w-full h-full object-cover"
                                          /> */}
                                            {file.type.startsWith("image/") ? (
                                              <img
                                                src={url}
                                                className="w-full h-full object-cover"
                                                alt="preview"
                                              />
                                            ) : file.type.startsWith(
                                                "video/",
                                              ) ? (
                                              <video
                                                src={url}
                                                controls
                                                className="w-full h-full object-cover"
                                              />
                                            ) : file.type.startsWith(
                                                "audio/",
                                              ) ? (
                                              <audio
                                                src={url}
                                                controls
                                                className="w-full "
                                              />
                                            ) : file.type ===
                                              "application/pdf" ? (
                                              <iframe
                                                src={url}
                                                title="pdf"
                                                className="w-full h-full"
                                              />
                                            ) : (
                                              <div className="w-full h-full flex flex-col items-center justify-center p-3">
                                                <span className="text-2xl mb-2">
                                                  {icon}
                                                </span>

                                                <p className="text-xs text-center font-medium truncate w-full">
                                                  {file.name
                                                    .split(".")
                                                    .slice(0, -1)
                                                    .join(".")}
                                                </p>

                                                <p className="text-[11px] text-gray-500 mt-1">
                                                  {formatSize(file.size)}
                                                </p>
                                              </div>
                                            )}

                                            <button
                                              onClick={() =>
                                                setEditFilesThread((prev) =>
                                                  prev.filter(
                                                    (f) => f.tempId !== tempId,
                                                  ),
                                                )
                                              }
                                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                            >
                                              ×
                                            </button>
                                          </div>
                                        );
                                      },
                                    )}

                                    <button
                                      onClick={() =>
                                        editFileRefThread.current.click()
                                      }
                                      className="w-15 h-10 p-5 flex items-center justify-center rounded-lg border border-gray-300  hover:bg-gray-100 hover:text-black"
                                    >
                                      + Add
                                    </button>
                                    <input
                                      type="file"
                                      multiple
                                      ref={editFileRefThread}
                                      className="hidden"
                                      onChange={(e) => {
                                        const newFiles = Array.from(
                                          e.target.files,
                                        ).map((file) => ({
                                          file,
                                          tempId: crypto.randomUUID(),
                                        }));
                                        setEditFilesThread((prev) => [
                                          ...prev,
                                          ...newFiles,
                                        ]);
                                      }}
                                    />
                                  </div>

                                  <div className="flex justify-end gap-2 mt-2">
                                    <button
                                      onClick={() =>
                                        setEditingMessageIdThread(null)
                                      }
                                      className="text-sm bg-red-500 text-white p-1  rounded-md "
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleSaveEditThread(m._id)
                                      }
                                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  {/* {m.text && <MessageText text={m.text} isMe={isMe} />} */}
                                  {m.isDelete ? (
                                    <p className="italic text-sm text-red-400 select-none">
                                      This message was deleted
                                    </p>
                                  ) : m.text ? (
                                    <div className="relative group max-w-fit">
                                      <MessageText
                                        text={m.text.trim()}
                                        isMe={isMe}
                                      />

                                      {/* TEXT ACTIONS */}
                                      {isMe && (
                                        <TextActions
                                          text={m.text}
                                          message={m}
                                        />
                                      )}
                                    </div>
                                  ) : null}

                                  {/* existing files rendering here */}
                                </>
                              )}

                              {/* 
                    {m.text && (
                      <div className="mb-1">
                        <MessageText text={m.text} isMe={isMe} />
                      </div>
                    )} */}

                              {/* Files */}

                              {/* editingMessageId === m._id && */}

                              {editingMessageIdThread !== m._id &&
                                m.files.map((f) => {
                                  const src = `${API_URL}/api${f.url}`;
                                  return (
                                    <div
                                      key={f._id}
                                      className="mt-3 relative group"
                                    >
                                      {/* 🔥 FILE DELETED PLACEHOLDER */}
                                      {f.isDeleteFile ? (
                                        <div className="italic text-red-400 text-sm p-3 rounded-lg bg-gray-100">
                                          🗑 File deleted
                                        </div>
                                      ) : (
                                        <>
                                          {/* IMAGE */}
                                          {f.type.startsWith("image") && (
                                            <div className="relative">
                                              <img
                                                src={src}
                                                className="rounded-xl max-w-full h-auto shadow-sm"
                                                alt={f.name}
                                              />

                                              <FileActions
                                                src={src}
                                                isMe={isMe}
                                                onDelete={() =>
                                                  handleDeleteFile(m._id, f._id)
                                                }
                                                onForward={() => {
                                                  setForwardMessage(m); // parent message
                                                  setSelectedForwardFile(f); // 🔥 only this file
                                                  setShowForwardDropdown(true);
                                                }}
                                              />
                                            </div>
                                          )}

                                          {/* VIDEO */}
                                          {f.type.startsWith("video") && (
                                            <div className="relative rounded-xl overflow-hidden">
                                              <video
                                                controls
                                                className="w-full"
                                              >
                                                <source
                                                  src={src}
                                                  type={f.type}
                                                />
                                              </video>

                                              <FileActions
                                                src={src}
                                                isMe={isMe}
                                                onDelete={() =>
                                                  handleDeleteFile(m._id, f._id)
                                                }
                                                onForward={() => {
                                                  setForwardMessage(m); // parent message
                                                  setSelectedForwardFile(f); //  only this file
                                                  setShowForwardDropdown(true);
                                                }}
                                              />
                                            </div>
                                          )}

                                          {/* AUDIO */}
                                          {f.type.startsWith("audio") && (
                                            <div className="relative p-3 bg-black/5 rounded-lg">
                                              <audio
                                                controls
                                                className="w-full"
                                                src={src}
                                              />

                                              <FileActions
                                                src={src}
                                                isMe={isMe}
                                                onDelete={() =>
                                                  handleDeleteFile(m._id, f._id)
                                                }
                                                onForward={() => {
                                                  setForwardMessage(m); // parent message
                                                  setSelectedForwardFile(f); // 🔥 only this file
                                                  setShowForwardDropdown(true);
                                                }}
                                              />
                                            </div>
                                          )}
                                          {/* application/pdf */}
                                          {f.type.startsWith(
                                            "application/pdf",
                                          ) && (
                                            <div className="relative p-3 bg-black/5 rounded-lg">
                                              {/* <audio
                                          controls
                                          className="w-full"
                                          src={src}
                                        /> */}
                                              <iframe
                                                src={src}
                                                title="pdf"
                                                className="w-full h-full"
                                              />

                                              <FileActions
                                                src={src}
                                                isMe={isMe}
                                                onDelete={() =>
                                                  handleDeleteFile(m._id, f._id)
                                                }
                                                onForward={() => {
                                                  setForwardMessage(m); // parent message
                                                  setSelectedForwardFile(f); // 🔥 only this file
                                                  setShowForwardDropdown(true);
                                                }}
                                              />
                                            </div>
                                          )}

                                          {/* DOCUMENT / OTHER */}
                                          {!f.type.startsWith("image") &&
                                            !f.type.startsWith("video") &&
                                            !f.type.startsWith("audio") &&
                                            !f.type.startsWith(
                                              "application/pdf",
                                            ) && (
                                              <div
                                                className={`relative flex items-center gap-3 p-3 rounded-xl ${
                                                  isMe
                                                    ? "bg-blue-500/20 hover:bg-blue-500/30"
                                                    : "bg-gray-100 hover:bg-gray-200"
                                                } transition-colors`}
                                              >
                                                <span className="text-xl">
                                                  {getFileIcon(f.type, f.name)}
                                                </span>

                                                <div className="flex-1 min-w-0">
                                                  <p className="text-sm font-medium truncate">
                                                    {f.name}
                                                  </p>
                                                  <p className="text-xs text-gray-500">
                                                    {formatSize(f.size)}
                                                  </p>
                                                </div>

                                                {/* <FileActions
                                        src={src}
                                        isMe={isMe}
                                        onDelete={() =>
                                          handleDeleteFile(m._id, f._id)
                                        }
                                      /> */}
                                                <FileActions
                                                  src={src}
                                                  isMe={isMe}
                                                  onDelete={() =>
                                                    handleDeleteFile(
                                                      m._id,
                                                      f._id,
                                                    )
                                                  }
                                                  onForward={() => {
                                                    setForwardMessage(m); // parent message
                                                    setSelectedForwardFile(f); // 🔥 only this file
                                                    setShowForwardDropdown(
                                                      true,
                                                    );
                                                  }}
                                                />
                                              </div>
                                            )}
                                        </>
                                      )}
                                    </div>
                                  );
                                })}

                              {/* dm tick */}
                              {/* Message Status and Time */}
                              {/* {selectedUser && (
                        <div
                          className={`flex items-center justify-end gap-2 mt-2 ${
                            isMe ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          <span className="text-xs">{time}</span>
                         
                          {isMe && (
                            <div className="flex items-center">
                              {m.seenAt ? (
                                <CheckCheck className="w-3.5 h-3.5 text-[#03f4fc]" />
                              ) : m.deliveredAt && !m.seenAt ? (
                                <CheckCheck className="w-3.5 h-3.5" />
                              ) : (
                                <Check className="w-3.5 h-3.5" />
                              )}
                            </div>
                          )}
                        </div>
                      )} */}
                              {/* channel tick */}
                              {/* {selectedChannel && m.senderId == me && (
                        <div>
                          <div className="message-footer">{renderTick(m)}</div>
                        </div>
                      )} */}
                              {/* dm tick */}
                              {/* Message Status and Time */}
                              {selectedUser && (
                                <div
                                  className={`flex items-center justify-end gap-2 mt-2 ${
                                    isMe ? "text-black-800" : "text-gray-500"
                                  }`}
                                >
                                  <div>
                                    {" "}
                                    <span className="text-xs">{date}</span>
                                  </div>
                                  <div className="flex gap">
                                    <span className="text-xs">{time}</span>
                                    {console.log(
                                      "Rendering ticks for message:",
                                      m.seenAt,
                                    )}
                                    {/* {isMe && (
                              <div className="flex items-center">
                                {!m.deliveredAt && !m.seenAt && (
                                  <Check className="w-3.5 h-3.5" />
                                )}
                                {m.deliveredAt && !m.seenAt && (
                                  <CheckCheck className="w-3.5 h-3.5" />
                                )}
                                {m.seenAt && (
                                  <CheckCheck className="w-3.5 h-3.5 text-[#03f4fc]" />
                                )}
                              </div>
                            )} */}
                                    {/* {isMe && (
                            <div className="flex items-center">
                              {m.seenAt ? (
                                <CheckCheck className="w-3.5 h-3.5 text-[#03f4fc]" />
                              ) : m.deliveredAt && !m.seenAt ? (
                                <CheckCheck className="w-3.5 h-3.5" />
                              ) : (
                                <Check className="w-3.5 h-3.5" />
                              )}
                            </div>
                          )} */}
                                    {isMe && (
                                      <div className="flex items-center">
                                        {(() => {
                                          if (!m.deliveredAt) {
                                            return (
                                              <Check className="w-3.5 h-3.5" />
                                            );
                                          } else if (
                                            m.deliveredAt &&
                                            !m.seenAt
                                          ) {
                                            return (
                                              <CheckCheck className="w-3.5 h-3.5" />
                                            );
                                          } else if (m.seenAt) {
                                            return (
                                              <CheckCheck className="w-3.5 h-3.5 text-[#03f4fc]" />
                                            );
                                          }
                                          return (
                                            <Check className="w-3.5 h-3.5" />
                                          );
                                        })()}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              {/* channel tick */}
                              {selectedChannel && (
                                <div
                                  className={` gap-2 mt-2 ${
                                    isMe ? "text-blue-100" : "text-gray-500"
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-2 mt-2">
                                    <div>
                                      {" "}
                                      <span className="text-xs">{date}</span>
                                    </div>
                                    <div className="flex gap-3">
                                      <span className="text-xs">{time}</span>
                                      {m.senderId == me && (
                                        <div className="message-footer">
                                          {renderTick(m)}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  {/* <div
                                  className="text-sm underline"
                                  onClick={() => setActiveThread(m)}
                                >
                                  Thread Count:{m.threadReplyCount}
                                </div> */}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  <div ref={bottomRefTheard} />
                  {/* </div> */}
                </div>
                <div />

                {/* THREAD INPUT */}
                {/* <div className="p-3 border-t">
              <ThreadInput
                parentMessage={activeThread}
                currentUser={currentUser}
                socket={socket}
              />
            </div> */}

                {/* thread files */}
                {filesThread.length > 0 && (
                  <div className="px-6 py-3 border-t bg-white/90 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700">
                        Preparing to send ({filesThread.length})
                      </span>
                      <button
                        onClick={() => setFilesThread([])}
                        className="text-sm text-red-500 hover:text-red-600 font-medium"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {filesThread.map(({ file, tempId }, i) => {
                        const url = URL.createObjectURL(file);
                        const icon = getFileIcon(file.type, file.name);
                        const progress = progressMap[tempId] || 0;

                        return (
                          <div
                            key={i}
                            className="relative flex-shrink-0 w-28 h-28 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden group"
                          >
                            {progress < 100 ? (
                              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10">
                                <CircularProgress
                                  percent={progress}
                                  size={45}
                                />
                                <button
                                  onClick={() => cancelUploadThread(tempId)}
                                  className="mt-2 text-xs text-white hover:text-gray-300"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => removeFileThread(i)}
                                className="absolute top-2 right-2 z-10 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}

                            {file.type.startsWith("image") ? (
                              <img
                                src={url}
                                className="w-full h-full object-cover"
                                alt="Preview"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center p-3">
                                <span className="text-2xl mb-2">{icon}</span>
                                <p className="text-xs text-center font-medium truncate w-full">
                                  {file.name.split(".").slice(0, -1).join(".")}
                                </p>
                                <p className="text-[11px] text-gray-500 mt-1">
                                  {formatSize(file.size)}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="px-6 py-4 border-t bg-white">
                  <div className="flex items-end gap-3">
                    {/* File Upload Button */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          if (fileInputRefThread.current) {
                            fileInputRefThread.current.click();
                          }
                        }}
                        className="p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
                      >
                        <Paperclip className="w-5 h-5" />
                      </button>

                      <input
                        type="file"
                        multiple
                        ref={fileInputRefThread}
                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                        className="hidden"
                        onChange={handleFileSelectThread}
                      />
                    </div>

                    {/* Text Input */}
                    <div className="flex-1 relative">
                      <div className="relative">
                        <textarea
                          value={textThread}
                          onChange={handleTypingThread}
                          onKeyDown={handleKeyDownThread}
                          placeholder={`Message ${
                            (selectedUser && selectedUser?.name) ||
                            (selectedChannel && "#" + selectedChannel?.name)
                          }...`}
                          rows={1}
                          className="w-full border border-gray-300 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none max-h-32 bg-gray-50 text-gray-900 placeholder-gray-500"
                          onInput={(e) => {
                            e.target.style.height = "auto";
                            e.target.style.height =
                              e.target.scrollHeight + "px";
                          }}
                        />
                        <button
                          onClick={() => setTextThread("")}
                          className={`absolute right-3 top-3 p-1 rounded-full hover:bg-gray-200 transition-colors ${
                            text ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>

                    {/* Send Button */}
                    <button
                      onClick={sendReplyThread}
                      disabled={!textThread.trim() && filesThread.length === 0}
                      className={`p-3 rounded-full transition-all duration-200 ${
                        textThread.trim() || filesThread.length > 0
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Helper Text */}
                  {/* <div className="mt-3 text-center">
                <p className="text-xs text-gray-500">
                  Press <span className="font-semibold">Enter</span> to send •{" "}
                  <span className="font-semibold">Shift + Enter</span> for new
                  line
                </p>
              </div> */}
                </div>
                {/* { console.log("test open",showSeenPopup)} */}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
