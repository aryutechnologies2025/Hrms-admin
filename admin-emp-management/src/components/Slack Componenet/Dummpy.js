// main working
// import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { v4 as uuidv4 } from "uuid";
// import { API_URL } from "../../config";
// import CircularProgress from "./CircleProgress";

// export const formatSize = (bytes = 0) => {
//   if (bytes === 0) return "0 KB";
//   const k = 1024;
//   const sizes = ["B", "KB", "MB", "GB"];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return (bytes / Math.pow(k, i)).toFixed(1) + " " + sizes[i];
// };

// export const getFileIcon = (type = "", name = "") => {
//   if (type.startsWith("image")) return "🖼️";
//   if (type.startsWith("video")) return "🎥";
//   if (type.startsWith("audio")) return "🎵";
//   if (type.includes("pdf")) return "📕";
//   if (type.includes("word")) return "📄";
//   if (type.includes("excel") || type.includes("sheet")) return "📊";
//   if (type.includes("zip") || name.endsWith(".zip")) return "🗜️";
//   return "📎";
// };

// export function DocumentCard({ file, url }) {
//   return (
//     <a
//       href={url}
//       target="_blank"
//       rel="noreferrer"
//       className="flex items-center gap-3 p-3 rounded-lg bg-[#e7f0ff] max-w-xs hover:bg-[#dce9ff]"
//     >
//       {/* ICON */}
//       <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded">
//         <span className="text-xl">{getFileIcon(file.type)}</span>
//       </div>

//       {/* INFO */}
//       <div className="flex-1 overflow-hidden">
//         <p className="text-sm font-medium truncate">{file.name}</p>
//         {file.size && (
//           <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
//         )}
//       </div>
//     </a>
//   );
// }

// export default function Slack_chatwindow({
//   socket,
//   currentUser,
//   selectedUser,
//   onlineUsers,
// }) {
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//   const bottomRef = useRef();
//   const [isTyping, setIsTyping] = useState(false);
//   const typingTimeoutRef = useRef(null);
//   const [files, setFiles] = useState([]);
//   const fileInputRef = useRef(null);
//   const [progressMap, setProgressMap] = useState({});
//   const controllersRef = useRef({});

//   const me = currentUser?.employeeId;
//   const other = selectedUser?._id;

//   useEffect(() => {
//     return () => {
//       socket.emit("stop_typing", {
//         senderId: me,
//         receiverId: other,
//       });
//     };
//   }, [selectedUser]);

//   /* JOIN + LOAD */
//   useEffect(() => {
//     if (!socket || !selectedUser) return;

//     socket.emit("join_dm", { senderId: me, receiverId: other });

//     axios
//       .get(`${API_URL}/api/messages/dm/${me}/${other}`)
//       .then((res) => setMessages(res.data.data || []));

//     // MARK SEEN WHEN CHAT OPENS
//     socket.emit("mark_seen", {
//       senderId: other,
//       receiverId: me,
//     });
//   }, [selectedUser]);

//   /* MARK MESSAGES AS DELIVERED */
//   useEffect(() => {
//     if (!socket) return;

//     const onDelivered = ({ senderId, receiverId, deliveredAt }) => {
//       setMessages((prev) =>
//         prev.map((m) =>
//           m.senderId === senderId &&
//           m.receiverId === receiverId &&
//           !m.deliveredAt
//             ? { ...m, deliveredAt }
//             : m
//         )
//       );
//     };

//     socket.on("messages_delivered", onDelivered);
//     return () => socket.off("messages_delivered", onDelivered);
//   }, [socket]);

//   /* RECEIVE MESSAGE */
//   useEffect(() => {
//     if (!socket) return;

//     socket.on("receive_dm", (msg) => {
//       if (
//         (msg.senderId === me && msg.receiverId === other) ||
//         (msg.senderId === other && msg.receiverId === me)
//       ) {
//         setMessages((prev) => [...prev, msg]);

//         if (msg.senderId === other) {
//           socket.emit("mark_seen", {
//             senderId: other,
//             receiverId: me,
//           });
//         }
//       }
//     });

//     return () => socket.off("receive_dm");
//   }, [socket, selectedUser]);

//   /* 🔵 BLUE TICK */
//   useEffect(() => {
//     if (!socket) return;

//     socket.on("messages_seen", ({ senderId, receiverId, seenAt }) => {
//       setMessages((prev) =>
//         prev.map((m) =>
//           m.senderId === senderId && m.receiverId === receiverId && !m.seenAt
//             ? { ...m, seenAt }
//             : m
//         )
//       );
//     });

//     return () => socket.off("messages_seen");
//   }, [socket]);

//   // const sendMessage = () => {
//   //   if (!text.trim()) return;

//   //   socket.emit("send_dm", {
//   //     clientId: uuidv4(),
//   //     senderId: me,
//   //     receiverId: other,
//   //     text,
//   //   });

//   //   socket.emit("stop_typing", {
//   //     senderId: me,
//   //     receiverId: other,
//   //   });

//   //   setText("");
//   // };

//   // const sendMessage = async () => {
//   //   if (!text && !files.length) return;

//   //   const formData = new FormData();
//   //   formData.append("senderId", me);
//   //   formData.append("receiverId", other);
//   //   formData.append("text", text);
//   //   formData.append("clientId", uuidv4());

//   //   files.forEach((file) => {
//   //     formData.append("files", file); // 🔥 MUST MATCH MULTER
//   //   });

//   //   const res = await axios.post(`${API_URL}/api/messages/send`, formData, {
//   //     headers: {
//   //     "Content-Type": "multipart/form-data",
//   //   },
//   //   onUploadProgress: (e) => {
//   //     const percent = Math.round((e.loaded * 100) / e.total);
//   //     setUploadProgress({ total: percent });
//   //   },
//   //   });

//   //   // socket.emit("send_dm", res.data.data);
//   //   // ✅ SOCKET ONLY NOTIFIES
//   //   if (res.data.success && res.data.data) {
//   //     socket.emit("new_message", res.data.data);
//   //   }

//   //   setText("");
//   //   setFiles([]);
//   //   setUploadProgress({});
//   // };

//   // const sendMessage = async () => {
//   //   if (!text && files.length === 0) return;

//   //   const formData = new FormData();
//   //   formData.append("senderId", me);
//   //   formData.append("receiverId", other);
//   //   formData.append("text", text);

//   //   const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);

//   //   files.forEach(({ file }) => {
//   //     formData.append("files", file);
//   //   });

//   //   const res = await axios.post(`${API_URL}/api/messages/send`, formData, {
//   //     headers: {
//   //       "Content-Type": "multipart/form-data",
//   //     },

//   //     onUploadProgress: (e) => {
//   //       const uploaded = e.loaded;

//   //       let cumulative = 0;
//   //       const map = {};

//   //       files.forEach(({ file, tempId }) => {
//   //         cumulative += file.size;

//   //         const percent = Math.min(
//   //           100,
//   //           Math.round(
//   //             ((uploaded - (cumulative - file.size)) / file.size) * 100
//   //           )
//   //         );

//   //         map[tempId] = Math.max(0, percent);
//   //       });

//   //       setProgressMap(map);
//   //     },
//   //   });
//   //   //   // ✅ SOCKET ONLY NOTIFIES
//   //   if (res.data.success && res.data.data) {
//   //     socket.emit("new_message", res.data.data);
//   //   }

//   //   setFiles([]);
//   //   setProgressMap({});
//   //   setText("");
//   // };

//   const sendMessage = async () => {
//     if (!text && files.length === 0) return;

//     const formData = new FormData();
//     formData.append("senderId", me);
//     formData.append("receiverId", other);
//     formData.append("text", text);

//     files.forEach(({ file }) => {
//       formData.append("files", file);
//     });

//     const controller = new AbortController();

//     // attach SAME controller to all files
//     files.forEach(({ tempId }) => {
//       controllersRef.current[tempId] = controller;
//     });

//     const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);

//     try {
//       const res = await axios.post(`${API_URL}/api/messages/send`, formData, {
//         signal: controller.signal,

//         headers: {
//           "Content-Type": "multipart/form-data",
//         },

//         onUploadProgress: (e) => {
//           let uploaded = e.loaded;
//           let cumulative = 0;
//           const map = {};

//           files.forEach(({ file, tempId }) => {
//             const start = cumulative;
//             const end = cumulative + file.size;
//             cumulative = end;

//             const percent =
//               uploaded <= start
//                 ? 0
//                 : uploaded >= end
//                 ? 100
//                 : Math.round(((uploaded - start) / file.size) * 100);

//             map[tempId] = percent;
//           });

//           setProgressMap(map);
//         },
//       });

//       // ✅ Notify via socket ONLY after success
//       if (res.data?.success) {
//         socket.emit("new_message", res.data.data);
//       }

//       // cleanup
//       setFiles([]);
//       setProgressMap({});
//       controllersRef.current = {};
//       setText("");
//     } catch (err) {
//       if (err.name === "CanceledError") {
//         console.log("Upload cancelled");
//       } else {
//         console.error(err);
//       }
//     }
//   };

//   useEffect(() => {
//     if (!socket) return;

//     socket.on("typing", ({ senderId }) => {
//       if (senderId === other) {
//         setIsTyping(true);
//       }
//     });

//     socket.on("stop_typing", ({ senderId }) => {
//       if (senderId === other) {
//         setIsTyping(false);
//       }
//     });

//     return () => {
//       socket.off("typing");
//       socket.off("stop_typing");
//     };
//   }, [socket, other]);
//   const handleTyping = (e) => {
//     setText(e.target.value);

//     socket.emit("typing", {
//       senderId: me,
//       receiverId: other,
//     });

//     // 🔥 Auto stop after 1.5 seconds idle
//     if (typingTimeoutRef.current) {
//       clearTimeout(typingTimeoutRef.current);
//     }

//     typingTimeoutRef.current = setTimeout(() => {
//       socket.emit("stop_typing", {
//         senderId: me,
//         receiverId: other,
//       });
//     }, 1500);
//   };

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   if (!selectedUser) return <div className="flex-1">Select chat</div>;

//   const formatSize = (bytes = 0) => {
//     if (bytes < 1024) return bytes + " B";
//     if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
//     return (bytes / (1024 * 1024)).toFixed(1) + " MB";
//   };
//   const handleFileSelect = (e) => {
//     const selected = Array.from(e.target.files).map((file) => ({
//       file,
//       tempId: crypto.randomUUID(),
//     }));

//     setFiles((prev) => [...prev, ...selected]);
//   };
//   const cancelUpload = (tempId) => {
//     controllersRef.current[tempId]?.abort();

//     setFiles((prev) => prev.filter((f) => f.tempId !== tempId));
//     setProgressMap((p) => {
//       const copy = { ...p };
//       delete copy[tempId];
//       return copy;
//     });

//     delete controllersRef.current[tempId];
//   };

//   return (
//     <div className="flex-1 flex flex-col">
//       <div className="flex-1 p-4 overflow-y-auto">
//         {messages.map((m) => {
//           const isMe = m.senderId === me;
//           return (
//             <div
//               key={m._id || m.clientId}
//               className={`mb-2 ${isMe ? "text-right" : ""}`}
//             >
//               <div
//                 className={`inline-block px-3 py-2 rounded

//                 }`}
//               >
//                 {m.text}
//                 {/* images and file previous */}

//                 {/* MESSAGE FILES */}
//                 {Array.isArray(m.files) &&
//                   m.files.map((f, idx) => {
//                     const icon = getFileIcon(f.type, f.name);
//                     const src = `http://localhost:5000${f.url}`;

//                     return (
//                       <div
//                         key={idx}
//                         className={`mt-2 max-w-xs   py-2 ${
//                           isMe ? "bg-blue-600 text-white" : "bg-gray-200"
//                         }`}
//                       >
//                         {/* IMAGE */}
//                         {f.type.startsWith("image") && (
//                           <div className="relative inline-block">
//                             <img src={src} className="rounded max-w-xs" />
//                             <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
//                               {formatSize(f.size)}
//                             </span>
//                           </div>
//                         )}

//                         {/* VIDEO */}
//                         {f.type.startsWith("video") && (
//                           <div>
//                             <video controls className="rounded max-w-xs">
//                               <source src={src} />
//                             </video>
//                             <span className="text-xs text-gray-500">
//                               {formatSize(f.size)}
//                             </span>
//                           </div>
//                         )}

//                         {/* AUDIO */}
//                         {f.type.startsWith("audio") && (
//                           <div>
//                             <audio controls src={src} />
//                             <span className="text-xs text-gray-500">
//                               {formatSize(f.size)}
//                             </span>
//                           </div>
//                         )}

//                         {/* DOCUMENT / ZIP / OTHER */}
//                         {!f.type.startsWith("image") &&
//                           !f.type.startsWith("video") &&
//                           !f.type.startsWith("audio") && (
//                             <a
//                               href={src}
//                               target="_blank"
//                               className="flex items-center gap-2 p-2 border rounded bg-gray-50"
//                             >
//                               <span className="text-xl">{icon}</span>
//                               <div className="flex flex-col text-sm">
//                                 <span className="truncate max-w-[160px]">
//                                   {f.name}
//                                 </span>
//                                 <span className="text-xs text-gray-500">
//                                   {formatSize(f.size)}
//                                 </span>
//                               </div>
//                             </a>
//                           )}
//                       </div>
//                     );
//                   })}

//                 {isMe && (
//                   <div className="text-xs">
//                     {!m.deliveredAt && "✔"}
//                     {m.deliveredAt && !m.seenAt && "✔✔"}
//                     {m.seenAt && <span className="text-blue-300">✔✔</span>}
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//         <div ref={bottomRef} />
//       </div>

//       {/* <div className="p-3 border-t  gap-2">
//         <div>
//           {isTyping && (
//             <div className="px-4 pb-1 text-sm text-gray-500 italic">
//               {selectedUser.name} is typing...
//             </div>
//           )}
//         </div>
//         <input
//           value={text}
//           onChange={handleTyping}
//           className="flex-1 border rounded px-3"
//         /> */}

//       {/*
//         <input
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           className="flex-1 border px-3"
//         /> */}
//       {/* <button onClick={sendMessage}>Send</button>
//       </div> */}
//       {/* TYPING */}
//       {isTyping && (
//         <div className="text-sm px-3 text-gray-500">
//           {selectedUser.name} is typing...
//         </div>
//       )}

//       {/* FILE PREVIEW (WhatsApp style) */}
//       {/* import { getFileIcon } from "../utils/fileIcons"; */}

//       {/* import DocumentCard from "./DocumentCard"; */}

//       {/* FILE PREVIEW */}
//       {files.length > 0 && (
//         <div className="flex gap-2 p-2 overflow-x-auto border-t">
//           {files.map(({ file, tempId }, i) => {
//             const url = URL.createObjectURL(file);
//             const icon = getFileIcon(file.type, file.name);
//             const progress = progressMap[tempId] || 0;

//             return (
//               <div
//                 key={i}
//                 className="relative w-20 h-20 rounded border bg-gray-100"
//               >
//                 {/* REMOVE */}
//                 <button
//                   onClick={() =>
//                     setFiles((prev) => prev.filter((_, idx) => idx !== i))
//                   }
//                   className="absolute -top-2 -right-2 bg-black text-white w-5 h-5 rounded-full text-xs"
//                 >
//                   ✕
//                 </button>

//                 {/* IMAGE */}
//                 {file.type.startsWith("image") && (
//                   <>
//                     <img
//                       src={url}
//                       className="w-full h-full rounded object-cover"
//                     />
//                     <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded">
//                       {formatSize(file.size)}
//                     </span>
//                   </>
//                 )}

//                 {/* VIDEO */}
//                 {file.type.startsWith("video") && (
//                   <div className="flex flex-col items-center justify-center h-full">
//                     🎥
//                     <span className="text-[10px]">{formatSize(file.size)}</span>
//                   </div>
//                 )}

//                 {/* AUDIO */}
//                 {file.type.startsWith("audio") && (
//                   <div className="flex flex-col items-center justify-center h-full">
//                     🎵
//                     <span className="text-[10px]">{formatSize(file.size)}</span>
//                   </div>
//                 )}

//                 {/* DOCUMENT / ZIP / OTHER */}
//                 {!file.type.startsWith("image") &&
//                   !file.type.startsWith("video") &&
//                   !file.type.startsWith("audio") && (
//                     <div className="flex flex-col items-center justify-center h-full text-center px-1">
//                       <span className="text-xl">{icon}</span>
//                       <span className="text-[9px] truncate w-full">
//                         {file.name}
//                       </span>
//                       <span className="text-[9px] text-gray-500">
//                         {formatSize(file.size)}
//                       </span>
//                     </div>
//                   )}

//                 {progress < 100 && (
//                   <>
//                     <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
//                       <CircularProgress percent={progress} />
//                     </div>

//                     <button
//                       onClick={() => cancelUpload(tempId)}
//                       className="absolute top-1 right-1 bg-black/70 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center"
//                     >
//                       ✕
//                     </button>
//                   </>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* INPUT BAR */}
//       <div className="border-t p-2 flex items-center gap-2">
//         <input
//           type="file"
//           multiple
//           ref={fileInputRef}
//           accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
//           style={{ display: "none" }}
//           onChange={(e) => handleFileSelect(e)}
//         />

//         <button onClick={() => fileInputRef.current.click()}>📎</button>
// {/*
//         <input
//           value={text}
//           onChange={handleTyping}
//           placeholder="Type a message"
//           className="flex-1 border rounded-full px-4 py-2"
//         /> */}
//         <textarea
//           value={text}
//           placeholder="Type a message"
//           rows={1}
//           className="flex-1 resize-none border rounded-lg px-4 py-2
//              focus:outline-none focus:ring-1 focus:ring-blue-500"
//           onChange={handleTyping}
//           onInput={(e) => {
//             e.target.style.height = "auto";
//             e.target.style.height = e.target.scrollHeight + "px";
//           }}
//           onKeyDown={(e) => {
//             // ENTER = SEND (Slack behavior)
//             if (e.key === "Enter" && !e.shiftKey) {
//               e.preventDefault();
//               sendMessage();
//             }
//           }}
//         />

//         <button onClick={sendMessage} className="text-blue-600 font-bold">
//           ➤
//         </button>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { v4 as uuidv4 } from "uuid";
// import { API_URL } from "../../config";
// import CircularProgress from "./CircleProgress";
// import {
//   Send,
//   Paperclip,
//   Smile,
//   Image,
//   Video,
//   Mic,
//   X,
//   Check,
//   CheckCheck,
//   Phone,
//   MoreVertical,
//   Download,
//   Camera,
//   ChevronDown, // Add this
//   ChevronUp,
// } from "lucide-react";
// const MessageText = ({ text, isMe }) => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const MAX_LENGTH = 300; // Characters to show before truncation

//   // If text is short enough, show it fully
//   if (!text || text.length <= MAX_LENGTH) {
//     return (
//       <p
//         className={`whitespace-pre-wrap break-words text-[15px] leading-relaxed ${
//           isMe ? "text-white" : "text-gray-800"
//         }`}
//       >
//         {text}
//       </p>
//     );
//   }

//   // Split text into displayed part
//   const displayedText = isExpanded ? text : `${text.substring(0, MAX_LENGTH)}`;

//   const remainingChars = text.length - MAX_LENGTH;

//   return (
//     <div className="relative">
//       {/* Text Content */}
//       <p
//         className={`whitespace-pre-wrap break-words text-[15px] leading-relaxed ${
//           isMe ? "text-white" : "text-gray-800"
//         }`}
//       >
//         {displayedText}
//         {!isExpanded && (
//           <span className={`${isMe ? "text-blue-200/60" : "text-gray-500/60"}`}>
//             ...
//           </span>
//         )}
//       </p>

//       {/* Gradient Fade Effect (only when collapsed) */}
//       {!isExpanded && (
//         <div
//           className={`absolute bottom-0 right-0 h-6 w-20 pointer-events-none ${
//             isMe
//               ? "bg-gradient-to-l from-blue-600/40 to-transparent"
//               : "bg-gradient-to-l from-white to-transparent"
//           }`}
//         />
//       )}

//       {/* Show More/Less Button */}
//       <button
//         onClick={(e) => {
//           e.stopPropagation();
//           setIsExpanded(!isExpanded);
//         }}
//         className={`mt-1 text-sm font-medium flex items-center gap-1 hover:underline focus:outline-none ${
//           isMe
//             ? "text-blue-200 hover:text-white"
//             : "text-blue-600 hover:text-blue-800"
//         }`}
//       >
//         {isExpanded ? (
//           <>
//             <ChevronUp className="w-3.5 h-3.5" />
//             Show Less
//           </>
//         ) : (
//           <>
//             <ChevronDown className="w-3.5 h-3.5" />
//             Show {remainingChars}+ more
//           </>
//         )}
//       </button>
//     </div>
//   );
// };

// export const formatSize = (bytes = 0) => {
//   if (bytes === 0) return "0 KB";
//   const k = 1024;
//   const sizes = ["B", "KB", "MB", "GB"];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return (bytes / Math.pow(k, i)).toFixed(1) + " " + sizes[i];
// };

// export const getFileIcon = (type = "", name = "") => {
//   if (type.startsWith("image")) return "🖼️";
//   if (type.startsWith("video")) return "🎥";
//   if (type.startsWith("audio")) return "🎵";
//   if (type.includes("pdf")) return "📕";
//   if (type.includes("word")) return "📄";
//   if (type.includes("excel") || type.includes("sheet")) return "📊";
//   if (type.includes("zip") || name.endsWith(".zip")) return "🗜️";
//   return "📎";
// };

// export function DocumentCard({ file, url }) {
//   return (
//     <a
//       href={url}
//       target="_blank"
//       rel="noreferrer"
//       className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 max-w-xs hover:from-blue-100 hover:to-indigo-100 transition-all group"
//     >
//       <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-sm">
//         <span className="text-xl">{getFileIcon(file.type)}</span>
//       </div>
//       <div className="flex-1 overflow-hidden">
//         <p className="text-sm font-semibold text-gray-800 truncate">
//           {file.name}
//         </p>
//         {file.size && (
//           <p className="text-xs text-gray-500 mt-1">{formatSize(file.size)}</p>
//         )}
//       </div>
//       <Download className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
//     </a>
//   );
// }

// export default function Slack_chatwindow({
//   socket,
//   currentUser,
//   selectedUser,
//   onlineUsers,
//   selectedChannel,
// }) {
//   console.log("Selected Channel in Chat Window:", selectedChannel);
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//   const bottomRef = useRef();
//   const [isTyping, setIsTyping] = useState(false);
//   const typingTimeoutRef = useRef(null);
//   const [files, setFiles] = useState([]);
//   const fileInputRef = useRef(null);
//   const [progressMap, setProgressMap] = useState({});
//   const controllersRef = useRef({});
//   const [showActions, setShowActions] = useState(false);

//   const me = currentUser?._id;
//   const other = selectedUser?._id;

//   // All existing useEffect hooks remain the same...
//   useEffect(() => {
//     return () => {
//       socket.emit("stop_typing", {
//         senderId: me,
//         receiverId: other,
//       });
//     };
//   }, [selectedUser]);

//   // JOIN + LOAD

//   useEffect(() => {
//     if (!socket || !selectedUser) return;

//     socket.emit("join_dm", { senderId: me, receiverId: other });

//     axios
//       .get(`${API_URL}/api/messages/dm/${me}/${other}`)
//       .then((res) => setMessages(res.data.data || []));

//     socket.emit("mark_seen",{
//       senderId: other,
//       receiverId: me,
//     });
//   }, [selectedUser]);

//   //   useEffect(() => {
//   //   if (!selectedChannel) return;

//   //   axios
//   //     .get(`${API_URL}/api/messages/channel/${selectedChannel._id}`)
//   //     .then(res => setMessages(res.data.data || []));

//   //   socket.emit("join_channel", selectedChannel._id);
//   // }, [selectedChannel]);

//   // joining chaneel and loading messages

//   // useEffect(() => {
//   //   if (!socket || !selectedChannel) return;
//   //   console.log("Joining channel:", selectedChannel._id);

//   //   socket.emit("join_channel", {
//   //     channelId: selectedChannel._id,
//   //   });

//   //   axios
//   //     .get(`${API_URL}/api/messages/channel/${selectedChannel._id}`)
//   //     .then((res) => setMessages(res.data.data || []));
//   // }, [selectedChannel]);

//   // joining chaneel and loading messages

// useEffect(() => {
//   if (!socket || !selectedChannel || !currentUser?._id) return;

//   const channelId = selectedChannel._id;

//   // 🔹 Join channel room
//   socket.emit("join_channel", { channelId });

//   // 🔹 Fetch channel messages
//   const fetchMessages = async () => {
//     try {
//       const res = await axios.get(
//         `${API_URL}/api/messages/channel/${channelId}`
//       );
//       setMessages(res.data.data || []);

//       // 🔹 Mark messages as seen (DB)
//       // await axios.post(`${API_URL}/api/messages/channel-seen`, {
//       //   channelId,
//       //   userId: currentUser._id,
//       // });

//       // 🔹 Notify via socket (real-time tick)
//       socket.emit("channel_seen", {
//         channelId,
//         userId: currentUser._id,
//       });
//     } catch (err) {
//       console.error("Channel load error:", err);
//     }
//   };

//   fetchMessages();

//   // ✅ CLEANUP (VERY IMPORTANT)
//   return () => {
//     socket.emit("leave_channel", { channelId });
//   };
// }, [socket, selectedChannel, currentUser?._id]);


//   // useEffect(() => {
//   //   if (!socket) return;

//   //   const onDelivered = ({ senderId, receiverId, deliveredAt }) => {
//   //     setMessages((prev) =>
//   //       prev.map((m) =>
//   //         m.senderId === senderId &&
//   //         m.receiverId === receiverId &&
//   //         !m.deliveredAt
//   //           ? { ...m, deliveredAt }
//   //           : m
//   //       )
//   //     );
//   //   };

//   //   socket.on("messages_delivered", onDelivered);
//   //   return () => socket.off("messages_delivered", onDelivered);
//   // }, [socket]);

//   // useEffect(() => {
//   //   if (!socket) return;

//   //   socket.on("receive_dm", (msg) => {
//   //     if (
//   //       (msg.senderId === me && msg.receiverId === other) ||
//   //       (msg.senderId === other && msg.receiverId === me)
//   //     ) {
//   //       setMessages((prev) => [...prev, msg]);

//   //       if (msg.senderId === other) {
//   //         socket.emit("mark_seen", {
//   //           senderId: other,
//   //           receiverId: me,
//   //         });
//   //       }
//   //     }
//   //   });

//   //   return () => socket.off("receive_dm");
//   // }, [socket, selectedUser]);

//   // useEffect(() => {
//   //   if (!socket) return;

//   //   socket.on("messages_seen", ({ senderId, receiverId, seenAt }) => {
//   //     setMessages((prev) =>
//   //       prev.map((m) =>
//   //         m.senderId === senderId && m.receiverId === receiverId && !m.seenAt
//   //           ? { ...m, seenAt }
//   //           : m
//   //       )
//   //     );
//   //   });

//   //   return () => socket.off("messages_seen");
//   // }, [socket]);

//   // const sendMessage = async () => {
//   //   if (!text && files.length === 0) return;

//   //   const formData = new FormData();
//   //   formData.append("senderId", me);
//   //   formData.append("receiverId", other);
//   //   formData.append("text", text);

//   //   files.forEach(({ file }) => {
//   //     formData.append("files", file);
//   //   });

//   //   const controller = new AbortController();

//   //   files.forEach(({ tempId }) => {
//   //     controllersRef.current[tempId] = controller;
//   //   });

//   //   const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);

//   //   try {
//   //     const res = await axios.post(`${API_URL}/api/messages/send`, formData, {
//   //       signal: controller.signal,

//   //       headers: {
//   //         "Content-Type": "multipart/form-data",
//   //       },

//   //       onUploadProgress: (e) => {
//   //         let uploaded = e.loaded;
//   //         let cumulative = 0;
//   //         const map = {};

//   //         files.forEach(({ file, tempId }) => {
//   //           const start = cumulative;
//   //           const end = cumulative + file.size;
//   //           cumulative = end;

//   //           const percent =
//   //             uploaded <= start
//   //               ? 0
//   //               : uploaded >= end
//   //               ? 100
//   //               : Math.round(((uploaded - start) / file.size) * 100);

//   //           map[tempId] = percent;
//   //         });

//   //         setProgressMap(map);
//   //       },
//   //     });

//   //     if (res.data?.success) {
//   //       socket.emit("new_message", res.data.data);
//   //     }

//   //     setFiles([]);
//   //     setProgressMap({});
//   //     controllersRef.current = {};
//   //     setText("");
//   //   } catch (err) {
//   //     if (err.name === "CanceledError") {
//   //       console.log("Upload cancelled");
//   //     } else {
//   //       console.error(err);
//   //     }
//   //   }
//   // };

//   // /* ✅ blue TICK dm*/
//   useEffect(() => {
//     if (!socket || !selectedUser) return;

//     const onDelivered = ({ senderId, receiverId, deliveredAt }) => {
//       setMessages((prev) =>
//         prev.map((m) =>
//           m.senderId === senderId &&
//           m.receiverId === receiverId &&
//           !m.deliveredAt
//             ? { ...m, deliveredAt }
//             : m
//         )
//       );
//     };

//     socket.on("messages_delivered", onDelivered);
//     return () => socket.off("messages_delivered", onDelivered);
//   }, [socket]);

//   /* RECEIVE MESSAGE dm*/
//   useEffect(() => {
//     if (!socket || !selectedUser) return;

//     socket.on("receive_dm", (msg) => {
//       if (
//         (msg.senderId === me && msg.receiverId === other) ||
//         (msg.senderId === other && msg.receiverId === me)
//       ) {
//         setMessages((prev) => [...prev, msg]);

//         if (msg.senderId === other) {
//           socket.emit("mark_seen", {
//             senderId: other,
//             receiverId: me,
//           });
//         }
//       }
//     });

//     return () => socket.off("receive_dm");
//   }, [socket, selectedUser]);

//   /* RECEIVE MESSAGE channel*/
//   useEffect(() => {
//     if (!socket || !selectedChannel) return;

//     socket.on("receive_channel_message", (msg) => {
//       if (
//         (msg.channelId === selectedChannel._id)
        
//       ) {
//         console.log("RECEIVED CHANNEL MESSAGE:", msg);
//         setMessages((prev) => [...prev, msg]);

//         if (msg.senderId === other) {
//           socket.emit("mark_seen", {
//             senderId: other,
//             receiverId: me,
//           });
//         }
//       }
//     });

//     return () => socket.off("receive_channel_message");
//   }, [socket, selectedUser]);

//   /* 🔵 BLUE TICK dm*/
//   useEffect(() => {
//     if (!socket) return;

//     socket.on("messages_seen", ({ senderId, receiverId, seenAt }) => {
//       setMessages((prev) =>
//         prev.map((m) =>
//           m.senderId === senderId && m.receiverId === receiverId && !m.seenAt
//             ? { ...m, seenAt }
//             : m
//         )
//       );
//     });

//     return () => socket.off("messages_seen");
//   }, [socket]);

// // 🔵 BLUE TICK channel*/
//   useEffect(() => {
//   if (!socket) return;

//   socket.on("channel_seen_update", ({ channelId, userId }) => {
//     setMessages((prev) =>
//       prev.map((m) =>
//         m.channelId === channelId
//           ? { ...m, seenBy: [...new Set([...(m.seenBy || []), userId])] }
//           : m
//       )
//     );
//   });

//   return () => socket.off("channel_seen_update");
// }, [socket]);




//   const sendMessage = async () => {
//     if (!text && files.length === 0) return;

//     const formData = new FormData();
//     formData.append("senderId", me);
//     formData.append("receiverId", other || null);
//     formData.append("channelId", selectedChannel ? selectedChannel._id : null);
//     formData.append("text", text);

//     files.forEach(({ file }) => {
//       formData.append("files", file);
//     });

//     const controller = new AbortController();

//     // attach SAME controller to all files
//     files.forEach(({ tempId }) => {
//       controllersRef.current[tempId] = controller;
//     });

//     const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);

//     //    const res = await axios.post(
//     //   selectedChannel
//     //     ? `${API_URL}/api/messages/send-channel`
//     //     : `${API_URL}/api/messages/send`,
//     //   formData,
//     //   { headers: { "Content-Type": "multipart/form-data" } }
//     // );

//     // if(res.data?.success) {
//     //   socket.emit(
//     //     selectedChannel ? "new_channel_message" : "new_message",
//     //     res.data.data
//     //   );
//     // }

//     try {
//       const res =await axios.post(
//         selectedChannel
//           ? `${API_URL}/api/messages/send`
//           : `${API_URL}/api/messages/send`,
//         formData,
//         {
//           signal: controller.signal,

//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//           onUploadProgress: (e) => {
//             let uploaded = e.loaded;
//             let cumulative = 0;
//             const map = {};

//             files.forEach(({ file, tempId }) => {
//               const start = cumulative;
//               const end = cumulative + file.size;
//               cumulative = end;

//               const percent =
//                 uploaded <= start
//                   ? 0
//                   : uploaded >= end
//                   ? 100
//                   : Math.round(((uploaded - start) / file.size) * 100);

//               map[tempId] = percent;
//             });

//             setProgressMap(map);
//           },
//         }
//       );

//       // ✅ Notify via socket ONLY after success
//       // if (res.data?.success) {
//       //   socket.emit("new_message", res.data.data);
//       // }
//       console.log("entering socket emit for channel or dm 4444",res);
//       if (res.data?.success) {
//         console.log("entering socket emit for channel or dm ggg");
//         socket.emit(
//           selectedChannel ? "new_channel_message" : "new_message",
//           res.data.data
//         );
//       }
//       // cleanup
//       setFiles([]);
//       setProgressMap({});
//       controllersRef.current = {};
//       setText("");
//     } catch (err) {
//       if (err.name === "CanceledError") {
//         console.log("Upload cancelled");
//       } else {
//         console.error(err);
//       }
//     }
//   };

//   useEffect(() => {
//     if (!socket) return;

//     socket.on("typing", ({ senderId }) => {
//       if (senderId === other) {
//         setIsTyping(true);
//       }
//     });

//     socket.on("stop_typing", ({ senderId }) => {
//       if (senderId === other) {
//         setIsTyping(false);
//       }
//     });

//     return () => {
//       socket.off("typing");
//       socket.off("stop_typing");
//     };
//   }, [socket, other]);

//   const handleTyping = (e) => {
//     setText(e.target.value);

//     socket.emit("typing", {
//       senderId: me,
//       receiverId: other,
//     });

//     if (typingTimeoutRef.current) {
//       clearTimeout(typingTimeoutRef.current);
//     }

//     typingTimeoutRef.current = setTimeout(() => {
//       socket.emit("stop_typing", {
//         senderId: me,
//         receiverId: other,
//       });
//     }, 1500);
//   };

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleFileSelect = (e) => {
//     const selected = Array.from(e.target.files).map((file) => ({
//       file,
//       tempId: crypto.randomUUID(),
//     }));
//     setFiles((prev) => [...prev, ...selected]);
//   };

//   const cancelUpload = (tempId) => {
//     controllersRef.current[tempId]?.abort();
//     setFiles((prev) => prev.filter((f) => f.tempId !== tempId));
//     setProgressMap((p) => {
//       const copy = { ...p };
//       delete copy[tempId];
//       return copy;
//     });
//     delete controllersRef.current[tempId];
//   };

//   const removeFile = (index) => {
//     setFiles((prev) => prev.filter((_, idx) => idx !== index));
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   // if (!selectedUser) {
//   //   return (
//   //     <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white">
//   //       <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center mb-6">
//   //         <Send className="w-12 h-12 text-gray-400" />
//   //       </div>
//   //       <h3 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Aryu Chat</h3>
//   //       <p className="text-gray-500">Select a conversation to start messaging</p>
//   //     </div>
//   //   );
//   // }
//   if (!selectedUser && !selectedChannel) {
//     return (
//       <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white">
//         <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center mb-6">
//           <Send className="w-12 h-12 text-gray-400" />
//         </div>
//         <h3 className="text-xl font-semibold text-gray-700 mb-2">
//           Welcome to Aryu Chat
//         </h3>
//         <p className="text-gray-500">
//           Select a conversation to start messaging
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50/50">
//       {/* Chat Header */}
//       <div className="px-6 py-4 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="relative">
//               <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
//                 {selectedUser && selectedUser?.name.charAt(0).toUpperCase()}
//               </div>
//               <div
//                 className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
//                   selectedUser &&
//                   onlineUsers &&
//                   onlineUsers.includes(selectedUser._id)
//                     ? "bg-green-500 animate-pulse"
//                     : "bg-gray-400"
//                 }`}
//               />
//             </div>
//             <div>
//               <h2 className="font-bold text-gray-800 text-lg">
//                 <h2 className="font-bold">
//                   {console.log(
//                     "Rendering header with selectedUser channel:",
//                     selectedChannel?.name
//                   )}
//                   {(selectedUser && selectedUser?.name) ||
//                     `# ${selectedChannel && selectedChannel?.name}`}
//                 </h2>
//               </h2>
//               <div className="flex items-center space-x-2">
//                 <p className="text-sm text-gray-500">
//                   {onlineUsers && onlineUsers.includes(selectedUser._id) ? (
//                     <span className="flex items-center">
//                       <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>{" "}
//                       Online now
//                     </span>
//                   ) : (
//                     "Last seen recently"
//                   )}
//                 </p>
//                 <span className="text-gray-300">•</span>
//                 <span className="text-sm text-blue-600 font-medium">
//                   {messages.length} messages
//                 </span>
//               </div>
//             </div>
//           </div>
//           {/* <div className="flex items-center space-x-2">
//             <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
//               <Phone className="w-5 h-5" />
//             </button>
//             <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
//               <Video className="w-5 h-5" />
//             </button>
//             <button 
//               onClick={() => setShowActions(!showActions)}
//               className="p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
//             >
//               <MoreVertical className="w-5 h-5" />
//             </button>
//           </div> */}
//         </div>
//       </div>

//       {/* Messages Container */}
//       <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gradient-to-b from-white to-gray-50/30">
//         <div className="max-w-4xl mx-auto space-y-3">
//           {messages.map((m) => {
//             const isMe = m.senderId === me;
//             const time = m.createdAt
//               ? new Date(m.createdAt).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })
//               : "";

//             return (
//               <div
//                 key={m._id || m.clientId}
//                 className={`flex ${
//                   isMe ? "justify-end" : "justify-start"
//                 } group`}
//               >
//                 <div
//                   className={`max-w-[70%] lg:max-w-[60%] ${
//                     isMe ? "ml-auto" : ""
//                   }`}
//                 >
//                   {/* Message Bubble */}
//                   <div
//                     className={`relative rounded-2xl px-4 py-3 shadow-sm ${
//                       isMe
//                         ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-lg"
//                         : "bg-white text-gray-800 border border-gray-200 rounded-bl-lg"
//                     }`}
//                   >
//                     {/* {m.text && (
//                       <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
//                         {m.text}
//                       </p>
//                     )} */}
//                     {m.text && (
//                       <div className="mb-1">
//                         <MessageText text={m.text} isMe={isMe} />
//                       </div>
//                     )}

//                     {/* Files */}
//                     {Array.isArray(m.files) &&
//                       m.files.map((f, idx) => {
//                         const icon = getFileIcon(f.type, f.name);
//                         const src = `http://localhost:5000${f.url}`;

//                         return (
//                           <div key={idx} className="mt-3">
//                             {f.type.startsWith("image") && (
//                               <div className="relative group">
//                                 <img
//                                   src={src}
//                                   className="rounded-xl max-w-full h-auto shadow-sm"
//                                   alt="Attachment"
//                                 />
//                                 <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
//                                   <a
//                                     href={src}
//                                     download
//                                     className="p-2 bg-black/60 rounded-full text-white hover:bg-black/80"
//                                   >
//                                     <Download className="w-4 h-4" />
//                                   </a>
//                                 </div>
//                               </div>
//                             )}

//                             {f.type.startsWith("video") && (
//                               <div className="relative rounded-xl overflow-hidden">
//                                 <video controls className="w-full">
//                                   <source src={src} type={f.type} />
//                                 </video>
//                               </div>
//                             )}

//                             {f.type.startsWith("audio") && (
//                               <div className="p-3 bg-black/5 rounded-lg">
//                                 <audio controls className="w-full" src={src} />
//                               </div>
//                             )}

//                             {!f.type.startsWith("image") &&
//                               !f.type.startsWith("video") &&
//                               !f.type.startsWith("audio") && (
//                                 <a
//                                   href={src}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className={`flex items-center gap-3 p-3 rounded-xl ${
//                                     isMe
//                                       ? "bg-blue-500/20 hover:bg-blue-500/30"
//                                       : "bg-gray-100 hover:bg-gray-200"
//                                   } transition-colors group`}
//                                 >
//                                   <div
//                                     className={`p-2 rounded-lg ${
//                                       isMe ? "bg-white/20" : "bg-gray-200"
//                                     }`}
//                                   >
//                                     <span className="text-xl">{icon}</span>
//                                   </div>
//                                   <div className="flex-1 min-w-0">
//                                     <p className="text-sm font-medium truncate">
//                                       {f.name}
//                                     </p>
//                                     <p className="text-xs text-gray-500 mt-1">
//                                       {formatSize(f.size)}
//                                     </p>
//                                   </div>
//                                   <Download className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
//                                 </a>
//                               )}
//                           </div>
//                         );
//                       })}

//                     {/* Message Status and Time */}
//                     <div
//                       className={`flex items-center justify-end gap-2 mt-2 ${
//                         isMe ? "text-blue-100" : "text-gray-500"
//                       }`}
//                     >
//                       <span className="text-xs">{time}</span>
//                       {isMe && (
//                         <div className="flex items-center">
//                           {!m.deliveredAt && <Check className="w-3.5 h-3.5" />}
//                           {m.deliveredAt && !m.seenAt && (
//                             <CheckCheck className="w-3.5 h-3.5" />
//                           )}
//                           {m.seenAt && (
//                             <CheckCheck className="w-3.5 h-3.5 text-[#03f4fc]" />
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//           <div ref={bottomRef} />
//         </div>
//       </div>

//       {/* Typing Indicator */}
//       {isTyping && (
//         <div className="px-6 py-2">
//           <div className="flex items-center space-x-2 text-sm text-gray-500">
//             <div className="flex space-x-1">
//               <div
//                 className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
//                 style={{ animationDelay: "0ms" }}
//               />
//               <div
//                 className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
//                 style={{ animationDelay: "150ms" }}
//               />
//               <div
//                 className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
//                 style={{ animationDelay: "300ms" }}
//               />
//             </div>
//             <span>{selectedUser.name} is typing...</span>
//           </div>
//         </div>
//       )}

//       {/* File Preview Section */}
//       {files.length > 0 && (
//         <div className="px-6 py-3 border-t bg-white/90 backdrop-blur-sm">
//           <div className="flex items-center justify-between mb-3">
//             <span className="text-sm font-semibold text-gray-700">
//               Preparing to send ({files.length})
//             </span>
//             <button
//               onClick={() => setFiles([])}
//               className="text-sm text-red-500 hover:text-red-600 font-medium"
//             >
//               Clear all
//             </button>
//           </div>
//           <div className="flex gap-3 overflow-x-auto pb-2">
//             {files.map(({ file, tempId }, i) => {
//               const url = URL.createObjectURL(file);
//               const icon = getFileIcon(file.type, file.name);
//               const progress = progressMap[tempId] || 0;

//               return (
//                 <div
//                   key={i}
//                   className="relative flex-shrink-0 w-28 h-28 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden group"
//                 >
//                   {progress < 100 ? (
//                     <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10">
//                       <CircularProgress percent={progress} size={45} />
//                       <button
//                         onClick={() => cancelUpload(tempId)}
//                         className="mt-2 text-xs text-white hover:text-gray-300"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   ) : (
//                     <button
//                       onClick={() => removeFile(i)}
//                       className="absolute top-2 right-2 z-10 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
//                     >
//                       <X className="w-3 h-3" />
//                     </button>
//                   )}

//                   {file.type.startsWith("image") ? (
//                     <img
//                       src={url}
//                       className="w-full h-full object-cover"
//                       alt="Preview"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex flex-col items-center justify-center p-3">
//                       <span className="text-2xl mb-2">{icon}</span>
//                       <p className="text-xs text-center font-medium truncate w-full">
//                         {file.name.split(".").slice(0, -1).join(".")}
//                       </p>
//                       <p className="text-[11px] text-gray-500 mt-1">
//                         {formatSize(file.size)}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* Input Area */}
//       <div className="px-6 py-4 border-t bg-white">
//         <div className="flex items-end gap-3">
//           {/* File Upload Button */}
//           <div className="relative">
//             <button
//               onClick={() => fileInputRef.current.click()}
//               className="p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
//             >
//               <Paperclip className="w-5 h-5" />
//             </button>
//             <input
//               type="file"
//               multiple
//               ref={fileInputRef}
//               accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
//               className="hidden"
//               onChange={handleFileSelect}
//             />
//           </div>

//           {/* Quick Action Buttons */}
//           {/* <div className="flex items-center gap-1">
//             <button className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
//               <Camera className="w-5 h-5" />
//             </button>
//             <button className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
//               <Mic className="w-5 h-5" />
//             </button>
//           </div> */}

//           {/* Text Input */}
//           <div className="flex-1 relative">
//             <div className="relative">
//               <textarea
//                 value={text}
//                 onChange={handleTyping}
//                 onKeyDown={handleKeyDown}
//                 placeholder={`Message ${
//                   (selectedUser && selectedUser?.name) ||
//                   (selectedChannel && "#" + selectedChannel?.name)
//                 }...`}
//                 rows={1}
//                 className="w-full border border-gray-300 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none max-h-32 bg-gray-50 text-gray-900 placeholder-gray-500"
//                 onInput={(e) => {
//                   e.target.style.height = "auto";
//                   e.target.style.height = e.target.scrollHeight + "px";
//                 }}
//               />
//               <button
//                 onClick={() => setText("")}
//                 className={`absolute right-3 top-3 p-1 rounded-full hover:bg-gray-200 transition-colors ${
//                   text ? "opacity-100" : "opacity-0"
//                 }`}
//               >
//                 <X className="w-4 h-4 text-gray-500" />
//               </button>
//             </div>
//           </div>

//           {/* Send Button */}
//           <button
//             onClick={sendMessage}
//             disabled={!text.trim() && files.length === 0}
//             className={`p-3 rounded-full transition-all duration-200 ${
//               text.trim() || files.length > 0
//                 ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
//                 : "bg-gray-200 text-gray-400 cursor-not-allowed"
//             }`}
//           >
//             <Send className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Helper Text */}
//         <div className="mt-3 text-center">
//           <p className="text-xs text-gray-500">
//             Press <span className="font-semibold">Enter</span> to send •{" "}
//             <span className="font-semibold">Shift + Enter</span> for new line
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


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
                     data-id={m._id}
                    className={`flex ${
                      isMe ? "justify-end" : "justify-start"
                    } group`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] lg:max-w-[55%] ${
                        isMe ? "ml-auto" : ""
                      }`}
                    >
                      <div
                        className={`relative rounded-2xl px-4 py-3 shadow-sm cursor-pointer ${
                          isMe
                            ? "bg-gray-200/80 text-black rounded-br-lg"
                            : // : // ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-lg"
                              "bg-white text-gray-800 border border-gray-200 rounded-bl-lg"
                        }`}
                        onMouseEnter={() =>
                          setHoveredMessageId(m._id || m.clientId)
                        }
                        onMouseLeave={() => setHoveredMessageId(null)}
                      >
                        {/* Particular user name */}
                       <div className="flex gap-3 items-start mb-2">
  {/* Avatar */}
  <div
    className={`w-7 h-7  flex items-center justify-center 
      ${isMe ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-gray-500"}
      text-white rounded-full font-semibold`}
  >
    {isMe
      ? currentUser?.name?.charAt(0)?.toUpperCase()
      : (selectedUser?.name || m.senderName || "U")
          .charAt(0)
          .toUpperCase()}
  </div>

  {/* Message Meta */}
  <div className="flex flex-col">
    {/* Name */}
    <div className="font-semibold md:text-xs  text-black">
      {isMe
        ? currentUser?.name
        : selectedUser?.name || m.senderName || "User"}
    </div>

    {/* Date + Time + Tick */}
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <span className="text-[10px]">{date}</span>
      <span className="text-[10px]">{time}</span>

      {/* {isMe && (
        <div className="flex items-center">
          {!m.deliveredAt ? (
            <Check className="w-3.5 h-3.5" />
          ) : m.deliveredAt && !m.seenAt ? (
            <CheckCheck className="w-3.5 h-3.5" />
          ) : (
            <CheckCheck className="w-3.5 h-3.5 text-[#3549fa]" />
          )}
        </div>
      )} */}
    </div>

    {/* Thread (only for channel) */}
    {/* {selectedChannel && (
      <div
        className="text-xs text-blue-500 cursor-pointer mt-1"
        onClick={() => setActiveThread(m)}
      >
        Thread : {m.threadReplyCount}
      </div>
    )} */}
  </div>
</div>

                        {/* 🔥 Hover Actions */}
                        {!m.isDelete &&
                         
                          hoveredMessageId === (m._id || m.clientId) && (
                            <div
                              className={`absolute -top-9  ${
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
                              { selectedChannel && (
                                <ActionButton
                                  title="Reply in thread"
                                  onClick={() => {
                                    setActiveThread(m);
                                    setMobileView("thread");
                                  }}
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
                          <div className="space-y-2 ">
                            {/* Edit Text */}
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full border rounded-lg p-2 text-sm text-black"
                              rows={2}
                              onPaste={handleEditPaste}
                              onDrop={(e) => {
                                handleEditDrop(e);
                                setIsDragging(false);
                              }}
                              onDragOver={handleDragOver}
                              onDragLeave={() => setIsDragging(false)}
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
                                        className="rounded-xl w-full max-h-[300px] sm:max-h-[350px] object-contain shadow-sm"
                                        alt="preview"
                                      />
                                    ) : file.type.startsWith("video/") ? (
                                      <video
                                        src={url}
                                        controls
                                        className="rounded-xl w-full max-h-[300px] sm:max-h-[350px] object-contain shadow-sm"
                                      />
                                    ) : file.type.startsWith("audio/") ? (
                                      <audio
                                        src={url}
                                        controls
                                        className="rounded-xl w-full max-h-[300px] sm:max-h-[350px] object-contain shadow-sm"
                                      />
                                    ) : file.type === "application/pdf" ? (
                                      <iframe
                                        src={url}
                                        title="pdf"
                                        className="w-full h-[250px] sm:h-[350px] rounded-xl"
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
                              <div className="relative group max-w-full break-words">
                                <MessageText text={m.text.trim()} isMe={isMe} />

                                {/* TEXT ACTIONS */}
                                {/* {isMe && ( */}
                                  <TextActions text={m.text} message={m} />
                                {/* )} */}
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
                                          className="rounded-xl w-full max-h-[300px] sm:max-h-[350px] object-contain shadow-sm"
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
                                          className="w-full h-[250px] sm:h-[350px] rounded-xl"
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
                                            <p className="text-xs sm:text-sm md:text-base font-medium break-words line-clamp-2">
                                              {f.name}
                                            </p>

                                            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
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
                                              setSelectedForwardFile(f); // only this file
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
                        {selectedUser  && (m.threadReplyCount > 0 || m.senderId == me)&& (
                          <div
                            className={`flex items-center justify-end gap-2  ${
                              isMe ? "text-black-800" : "text-gray-500"
                            }`}
                          >
                            
                            <div className=" ">
                             
                              {isMe && (
                                <div className="flex items-center">
                                  {(() => {
                                    if (!m.deliveredAt) {
                                      return <Check className="w-3.5 h-3.5" />;
                                    } else if (m.deliveredAt && !m.seenAt) {
                                      console.log(
                                        "Message delivered but not seen:",
                                        m,
                                      );
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
                       
                          <div>
                            {/* channel tick */}
                    {selectedChannel && (m.threadReplyCount > 0 || m.senderId == me) && (
  <div
    className={`flex items-center justify-between mt-2 text-xs gap-1 ${
      isMe ? "text-black-800" : "text-gray-500"
    }`}
  >
    {/* Thread replies */}
    <div>
      {m.threadReplyCount > 0 && (
        <div
          className="flex items-center gap-1 text-blue-500 cursor-pointer group"
          onClick={() => setActiveThread(m)}
        >
          <span>{m.threadReplyCount} replies</span>

          <span className="opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-blue-700 hover:underline">
            (view thread)
          </span>
        </div>
      )}
    </div>

    {/* Tick */}
    {m.senderId == me && (
      <div className="flex items-center">
        {renderTick(m)}
      </div>
    )}
  </div>
)}
                          </div>
                        
                        
                      </div>
                    </div>
                    <div ref={bottomRef} />
                  </div>
                );
              })}