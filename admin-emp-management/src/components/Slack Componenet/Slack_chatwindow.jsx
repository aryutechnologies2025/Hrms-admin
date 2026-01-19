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

// working code with show more less feature
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

//     socket.emit("mark_seen", {
//       senderId: other,
//       receiverId: me,
//     });
//   }, [selectedUser]);

//   useEffect(() => {
//     if (!socket || !selectedChannel || !currentUser?._id) return;

//     const channelId = selectedChannel._id;

//     // 🔹 Join channel room
//     socket.emit("join_channel", { channelId });

//     // 🔹 Fetch channel messages
//     const fetchMessages = async () => {
//       try {
//         const res = await axios.get(
//           `${API_URL}/api/messages/channel/${channelId}`
//         );
//         setMessages(res.data.data || []);

//         // 🔹 Mark messages as seen (DB)
//         // await axios.post(`${API_URL}/api/messages/channel-seen`, {
//         //   channelId,
//         //   userId: currentUser._id,
//         // });

//         // 🔹 Notify via socket (real-time tick)
//         socket.emit("channel_seen", {
//           channelId,
//           userId: currentUser._id,
//         });
//       } catch (err) {
//         console.error("Channel load error:", err);
//       }
//     };

//     fetchMessages();

//     // ✅ CLEANUP (VERY IMPORTANT)
//     return () => {
//       socket.emit("leave_channel", { channelId });
//     };
//   }, [socket, selectedChannel]);

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

//     const handleReceiveChannelMessage = (msg) => {
//       if (msg.channelId !== selectedChannel._id) return;

//       console.log("RECEIVED CHANNEL MESSAGE:", msg);

//       setMessages((prev) => [...prev, msg]);

//       // 🔵 auto mark seen ONLY if user is viewing this channel
//       socket.emit("channel_seen", {
//         channelId: selectedChannel._id,
//         userId: currentUser._id,
//       });
//     };

//     socket.on("receive_channel_message", handleReceiveChannelMessage);

//     return () => {
//       socket.off("receive_channel_message", handleReceiveChannelMessage);
//     };
//   }, [socket, selectedChannel]);

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

//   // useEffect(() => {
//   //   if (!socket || !selectedChannel) return;

//   //   socket.on("channel_seen_update", ( value ) => {
//   //     console.log("CHANNEL SEEN UPDATE RECEIVED:", value);
//   //     setMessages((prev) =>
//   //       prev.map((msg) => {
//   //         if (
//   //           msg.channelId !== value?.channelId ||
//   //           msg.senderId === value?.senderId
//   //         ) {
//   //           return msg;
//   //         }

//   //         // if (msg.seenBy.includes(senderId)) return msg;

//   //         // const updatedSeenBy = [...msg.seenBy, senderId];

//   //         return {
//   //           ...msg,
//   //           // seenBy: updatedSeenBy,

//   //         };
//   //       })
//   //     );
//   //   });

//   //   return () => socket.off("channel_seen_update");
//   // }, [socket, selectedChannel]);

//   // useEffect(() => {
//   //   if (!socket || !selectedChannel) return;

//   //   const handleSeenUpdate = ({ channelId, updatedMessages }) => {
//   //     if (channelId !== selectedChannel._id) return;

//   //     setMessages(updatedMessages);
//   //   };

//   //   socket.on("channel_seen_update", handleSeenUpdate);

//   //   return () => {
//   //     socket.off("channel_seen_update", handleSeenUpdate);
//   //   };
//   // }, [socket, selectedChannel]);

//   useEffect(() => {
//     if (!socket || !selectedChannel) return;

//     const handleSeenUpdate = ({ channelId, messageId, isSeenByAll }) => {
//       if (channelId !== selectedChannel._id) return;

//       setMessages((prev) =>
//         prev.map((msg) =>
//           msg._id === messageId ? { ...msg, isSeenByAll } : msg
//         )
//       );
//     };

//     socket.on("channel_seen_update", handleSeenUpdate);

//     return () => {
//       socket.off("channel_seen_update", handleSeenUpdate);
//     };
//   }, [socket, selectedChannel]);

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
//       const res = await axios.post(
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
//       // console.log("entering socket emit for channel or dm 4444",res);
//       if (res.data?.success) {
//         // console.log("entering socket emit for channel or dm ggg");
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

//   const renderTick = (msg) => {
//     console.log("Rendering tick for message:", msg);
//     if (!msg.deliveredAt) {
//       return "✔";
//     }

//     // if (msg.seenBy.length === 0) {
//     //   return "✔✔"; // delivered gray
//     // }

//     if (msg.isSeenByAll) {
//       return <span style={{ color: "#0b93f6" }}>✔✔</span>; // BLUE
//     }

//     return "✔✔"; // seen by some (gray)
//   };
//   console.log(" Message Rendering Chat Window with selectedChannel:", messages);

//   return (
//     <div className="flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50/50">
//       {/* Chat Header */}
//       <div className="px-6 py-4 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="relative">
//               <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
//                { console.log("Rendering header with selectedUser name:",
//                 selectedUser
//               )}
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
//                     {/* dm tick */}
//                     {/* Message Status and Time */}
//                     {selectedUser && (
//                       <div
//                         className={`flex items-center justify-end gap-2 mt-2 ${
//                           isMe ? "text-blue-100" : "text-gray-500"
//                         }`}
//                       >
//                         <span className="text-xs">{time}</span>
//                         {isMe && (
//                           <div className="flex items-center">
//                             {!m.deliveredAt && (
//                               <Check className="w-3.5 h-3.5" />
//                             )}
//                             {m.deliveredAt && !m.seenAt && (
//                               <CheckCheck className="w-3.5 h-3.5" />
//                             )}
//                             {m.seenAt && (
//                               <CheckCheck className="w-3.5 h-3.5 text-[#03f4fc]" />
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     )}
//                     {/* channel tick */}
//                     {selectedChannel && m.senderId==me &&(

//                       <div>
//                         <div className="message-footer">{renderTick(m)}</div>
//                       </div>
//                     )}
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

import { useEffect, useRef, useState } from "react";
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

const MessageText = ({ text, isMe }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 300; // Characters to show before truncation

  // If text is short enough, show it fully
  if (!text || text.length <= MAX_LENGTH) {
    return (
      <p
        className={`whitespace-pre-wrap break-words text-[15px] leading-relaxed ${
          isMe ? "text-white" : "text-gray-800"
        }`}
      >
        {text}
      </p>
    );
  }

  // Split text into displayed part
  const displayedText = isExpanded ? text : `${text.substring(0, MAX_LENGTH)}`;

  const remainingChars = text.length - MAX_LENGTH;

  return (
    <div className="relative">
      {/* Text Content */}
      <p
        className={`whitespace-pre-wrap break-words text-[15px] leading-relaxed ${
          isMe ? "text-white" : "text-gray-800"
        }`}
      >
        {displayedText}
        {!isExpanded && (
          <span className={`${isMe ? "text-blue-200/60" : "text-gray-500/60"}`}>
            ...
          </span>
        )}
      </p>

      {/* Gradient Fade Effect (only when collapsed) */}
      {!isExpanded && (
        <div
          className={`absolute bottom-0 right-0 h-6 w-20 pointer-events-none ${
            isMe
              ? "bg-gradient-to-l from-blue-600/40 to-transparent"
              : "bg-gradient-to-l from-white to-transparent"
          }`}
        />
      )}

      {/* Show More/Less Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className={`mt-1 text-sm font-medium flex items-center gap-1 hover:underline focus:outline-none ${
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

// const handleDeleteFile = (messageId, fileId) => {
//   console.log("Deleting file:", fileId, "from message:", messageId);
//   // if (!window.confirm("Delete this file?")) return;

//   socket.emit("delete_message_file", {
//     messageId,
//     fileId,
//   });
// };

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
  const [progressMap, setProgressMap] = useState({});
  const controllersRef = useRef({});
  const [showActions, setShowActions] = useState(false);
  const editFileRef = useRef(null);

  // message icons
  const [hoveredMessageId, setHoveredMessageId] = useState(null);

  // edit text and file
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editFiles, setEditFiles] = useState([]);

  // meassage forwarding
  const [showForwardDropdown, setShowForwardDropdown] = useState(false);
  const [forwardMessage, setForwardMessage] = useState(null);
  const [searchForward, setSearchForward] = useState("");

  // single user + channel file and  forwarding
  const [selectedForwardFile, setSelectedForwardFile] = useState(null);
  const [threadReplies, setThreadReplies] = useState([]);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchForward.toLowerCase())
  );

  const filteredChannels = channels.filter((c) =>
    c.name.toLowerCase().includes(searchForward.toLowerCase())
  );

  // set seen by state
  const [seenByUsers, setSeenByUsers] = useState([]);
  const [showSeenPopup, setShowSeenPopup] = useState(false);
  const [activeSeenMessage, setActiveSeenMessage] = useState(null);

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

    const channelId = selectedChannel._id;

    // 🔹 Join channel room
    socket.emit("join_channel", { channelId });

    // 🔹 Fetch channel messages
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/messages/channel/${channelId}`
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

    // ✅ CLEANUP (VERY IMPORTANT)
    return () => {
      socket.emit("leave_channel", { channelId });
    };
  }, [socket, selectedChannel]);

  // /* ✅ blue TICK dm*/

  useEffect(() => {
    if (!socket || !selectedUser) return;

    const onDelivered = ({ senderId, receiverId, deliveredAt }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.senderId === senderId &&
          m.receiverId === receiverId &&
          !m.deliveredAt
            ? { ...m, deliveredAt }
            : m
        )
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

  /* 🔵 BLUE TICK dm*/
  useEffect(() => {
    if (!socket) return;

    socket.on("messages_seen", ({ senderId, receiverId, seenAt }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.senderId === senderId && m.receiverId === receiverId && !m.seenAt
            ? { ...m, seenAt }
            : m
        )
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
          msg._id === messageId ? { ...msg, isSeenByAll } : msg
        )
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
        }
      );

      // ✅ Notify via socket ONLY after success
      if (res.data?.success) {
        // console.log("entering socket emit for channel or dm ggg");
        socket.emit(
          selectedChannel ? "new_channel_message" : "new_message",
          res.data.data
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files).map((file) => ({
      file,
      tempId: crypto.randomUUID(),
    }));
    setFiles((prev) => [...prev, ...selected]);
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

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // message Action buttons toggle
  useEffect(() => {
    if (!socket) return;

    const handleMessageDeleted = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId
            ? { ...m, isDelete: true, text: "", files: [] }
            : m
        )
      );
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

    const onFileDeleted = ({ messageId, fileId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId
            ? {
                ...m,
                files: m.files.map((f) =>
                  f._id === fileId ? { ...f, isDeleteFile: true } : f
                ),
              }
            : m
        )
      );
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
      setMessages((prev) =>
        prev.map((m) => (m._id === updatedMessage._id ? updatedMessage : m))
      );
    });

    return () => socket.off("message_edited");
  }, [socket]);

  // thread
  useEffect(() => {
    if (!activeThread) return;

    axios
      .get(`${API_URL}/api/messages/messages/thread/${activeThread._id}`)
      .then((res) => setThreadReplies(res.data.data || []));
  }, [activeThread]);
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
            : m
        )
      );
    };

    socket.on("thread_reply", onThreadReply);
    return () => socket.off("thread_reply", onThreadReply);
  }, [socket, activeThread]);

  if (!selectedUser && !selectedChannel) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white">
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
    );
  }

  const renderTick = (msg) => {
    console.log("Rendering tick for message:", msg);
    if (!msg.deliveredAt) {
      return "✔";
    }

    // if (msg.seenBy.length === 0) {
    //   return "✔✔"; // delivered gray
    // }

    if (msg.isSeenByAll) {
      return <span style={{ color: "#0b93f6" }}>✔✔</span>; // BLUE
    }

    return "✔✔"; // seen by some (gray)
  };
  console.log(" Message Rendering Chat Window with selectedChannel:", messages);

  // meassage Action buttons

  const handleDeleteMessage = async (messageId) => {
    try {
      const res = await axios.patch(
        `${API_URL}/api/messages/messages/${messageId}/delete`
      );

      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId
            ? { ...m, isDelete: true, text: "", files: [] }
            : m
        )
      );

      socket.emit("message_deleted", { messageId });
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
        }
      );

      if (res.data.success) {
        setMessages((prev) =>
          prev.map((m) => (m._id === messageId ? res.data.data : m))
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
          res.data.data
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
    const [text, setText] = useState("");
    const fileRef = useRef();
    const [files, setFiles] = useState([]);

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
        `${API_URL}/api/messages/messages/seen-by/${messageId}`
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
    <div className="flex h-full">
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

      <div className="flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50/50">
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
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b">
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
              {filteredUsers.length > 0 && (
                <>
                  <div className="px-3 py-1 text-xs text-gray-400">People</div>
                  {filteredUsers.map((u) => (
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
              )}

              {/* CHANNELS */}
              {filteredChannels.length > 0 && (
                <>
                  <div className="px-3 py-1 text-xs text-gray-400">
                    Channels
                  </div>
                  {filteredChannels.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => {
                        openChannel(ch);
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
              {filteredUsers.length === 0 && filteredChannels.length === 0 && (
                <div className="px-3 py-6 text-center text-sm text-gray-400">
                  No results found
                </div>
              )}
            </div>
          </div>
        )}

        <div className="px-6 py-4 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {console.log(
                    "Rendering header with selectedUser name:",
                    selectedUser
                  )}
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
                      selectedChannel?.name
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
          </div>
        </div>

        {/* 🔥 Hover Actions */}

        {/* Messages Container */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gradient-to-b from-white to-gray-50/30">
          <div className="max-w-4xl mx-auto space-y-3">
            {messages.map((m) => {
              const isMe = m.senderId === me;
              const time = m.createdAt
                ? new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
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
                        isMe
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-lg"
                          : "bg-white text-gray-800 border border-gray-200 rounded-bl-lg"
                      }`}
                      onMouseEnter={() =>
                        setHoveredMessageId(m._id || m.clientId)
                      }
                      onMouseLeave={() => setHoveredMessageId(null)}
                    >
                      {/* 🔥 Hover Actions */}
                      {!m.isDelete &&
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
                              return (
                                <div
                                  key={tempId}
                                  className="relative w-20 h-20 rounded-lg overflow-hidden border shadow-sm"
                                >
                                  <img
                                    src={url}
                                    alt={file.name}
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    onClick={() =>
                                      setEditFiles((prev) =>
                                        prev.filter((f) => f.tempId !== tempId)
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
                                const newFiles = Array.from(e.target.files).map(
                                  (file) => ({
                                    file,
                                    tempId: crypto.randomUUID(),
                                  })
                                );
                                setEditFiles((prev) => [...prev, ...newFiles]);
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
                            <p className="italic text-sm text-gray-400 select-none">
                              This message was deleted
                            </p>
                          ) : m.text ? (
                            <div className="relative group max-w-fit">
                              <MessageText text={m.text} isMe={isMe} />

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
                                <div className="italic text-gray-400 text-sm p-3 rounded-lg bg-gray-100">
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

                                  {/* DOCUMENT / OTHER */}
                                  {!f.type.startsWith("image") &&
                                    !f.type.startsWith("video") &&
                                    !f.type.startsWith("audio") && (
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
                      {selectedUser && (
                        <div
                          className={`flex items-center justify-end gap-2 mt-2 ${
                            isMe ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          <span className="text-xs">{time}</span>
                          {/* {isMe && (
                            <div className="flex items-center">
                              {!m.deliveredAt && (
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
                      )}
                      {/* channel tick */}
                      {selectedChannel && m.senderId == me && (
                        <div>
                          <div className="message-footer">{renderTick(m)}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
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
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
                className="p-2.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              {/* <input
              type="file"
              hidden
              multiple
              ref={fileInputRef}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileSelect}
            /> */}
              <input
                type="file"
                multiple
                ref={fileInputRef}
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {/* Quick Action Buttons */}
            {/* <div className="flex items-center gap-1">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
              <Camera className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
              <Mic className="w-5 h-5" />
            </button>
          </div> */}

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
              <span className="font-semibold">Shift + Enter</span> for new line
            </p>
          </div>
        </div>
      </div>
      {activeThread && (
        <div className="w-[380px] border-l bg-white flex flex-col">
          {/* HEADER */}
          <div className="p-4 border-b flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-800">Thread</h3>
              <p className="text-xs text-gray-500">Replies to message</p>
            </div>

            <button
              onClick={() => setActiveThread(null)}
              className="text-gray-500 hover:text-red-500"
            >
              ✕
            </button>
          </div>

          {/* PARENT MESSAGE ONLY */}
          <div className="p-4 bg-gray-50 border-b">
            {activeThread.text && (
              <MessageText
                text={activeThread.text}
                isMe={activeThread.senderId === me}
              />
            )}

            {/* FILES OF PARENT */}
            {activeThread.files?.map((f) => {
              const src = `${API_URL}/api${f.url}`;
              if (f.isDeleteFile) {
                return (
                  <p key={f._id} className="text-sm italic text-gray-400">
                    🗑 File deleted
                  </p>
                );
              }

              return (
                <div key={f._id} className="mt-2">
                  {f.type.startsWith("image") ? (
                    <img src={src} className="rounded-lg max-w-full" />
                  ) : (
                    <a href={src} download className="text-sm text-blue-600">
                      📎 {f.name}
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          {/* REPLIES */}
          {/* <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages
        .filter((m) => m.parentMessageId === activeThread._id)
        .map((reply) => {
          const isMe = reply.senderId === me;
          return (
            <div
              key={reply._id}
              className={`max-w-[85%] ${
                isMe ? "ml-auto text-right" : ""
              }`}
            >
              {reply.text && (
                <MessageText text={reply.text} isMe={isMe} />
              )}

              {reply.files?.map((f) => {
                const src = `http://localhost:5000${f.url}`;
                return (
                  <div key={f._id} className="mt-2">
                    {f.type.startsWith("image") ? (
                      <img
                        src={src}
                        className="rounded-lg max-w-full"
                      />
                    ) : (
                      <a
                        href={src}
                        download
                        className="text-xs text-blue-600"
                      >
                        📎 {f.name}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
    </div> */}
          {/* REPLIES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* {threadReplies.map((reply) => {
              const isMe = reply.senderId === me;

              return (
                <div key={reply._id} className={isMe ? "text-right" : ""}>
                  {reply.text && <MessageText text={reply.text} isMe={isMe} />}

                  {reply.files?.map((f) => {
                    const src = `http://localhost:5000${f.url}`;
                    return f.type.startsWith("image") ? (
                      <img key={f._id} src={src} className="rounded-lg mt-2" />
                    ) : (
                      <a
                        key={f._id}
                        href={src}
                        download
                        className="text-sm text-blue-600"
                      >
                        📎 {f.name}
                      </a>
                    );
                  })}
                </div>
              );
            })} */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* {console.log("threadReplies ", threadReplies)} */}
              {threadReplies &&
                threadReplies.map((reply, index) => {
                  const isMe = reply.senderId === me;

                  return (
                    <div key={index} className={isMe ? "text-right" : ""}>
                      {/* TEXT */}
                      {/* <p>aaaa</p> */}
                      {reply.text && (
                        // <MessageText text={reply.text} isMe={isMe} />
                        // <MessageText text={reply.text} isMe={isMe} />
                        <p>{reply.text}</p>
                      )}
                      {console.log("coming", reply.text)}
                      {/* FILES */}
                      {reply.files?.map((f) => {
                        if (f.isDeleteFile) {
                          return (
                            <p
                              key={f._id}
                              className="text-xs italic text-gray-400 mt-1"
                            >
                              🗑 File deleted
                            </p>
                          );
                        }

                        const src = `${API_URL}/api${f.url}`;

                        if (f.type.startsWith("image")) {
                          return (
                            <img
                              key={f._id}
                              src={src}
                              className="rounded-lg mt-2 max-w-full"
                            />
                          );
                        }

                        return (
                          <a
                            key={f._id}
                            href={src}
                            download
                            className="block text-sm text-blue-600 mt-1"
                          >
                            📎 {f.name}
                          </a>
                        );
                      })}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* THREAD INPUT */}
          <div className="p-3 border-t">
            <ThreadInput
              parentMessage={activeThread}
              currentUser={currentUser}
              socket={socket}
            />
          </div>
          {/* { console.log("test open",showSeenPopup)} */}
        </div>
      )}
    </div>
  );
}
