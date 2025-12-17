
// import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { API_URL } from "../../config";
// import { v4 as uuidv4 } from "uuid";

// export default function Slack_chatwindow({
//   currentUser,
//   selectedUser,
//   socket,
// }) {
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//   const bottomRef = useRef(null);

//   /* -------------------- LOAD CHAT HISTORY -------------------- */
//   useEffect(() => {
//     if (!selectedUser) return;

//     axios
//       .get(
//         `${API_URL}/api/messages/dm/${currentUser.employeeId}/${selectedUser._id}`
//       )
//       .then((res) => setMessages(res.data.data || []));
//   }, [selectedUser, currentUser]);

//   /* -------------------- JOIN DM ROOM -------------------- */
//   useEffect(() => {
//     if (!socket || !selectedUser) return;

//     socket.emit("join_dm", {
//       senderId: currentUser.employeeId,
//       receiverId: selectedUser._id,
//     });
//   }, [socket, selectedUser, currentUser]);

//   /* -------------------- RECEIVE MESSAGE -------------------- */
//   useEffect(() => {
//     if (!socket) return;

//     const handler = (msg) => {
//       const me = currentUser.employeeId;
//       const other = selectedUser?._id;

//       if (
//         !(
//           (msg.senderId === me && msg.receiverId === other) ||
//           (msg.senderId === other && msg.receiverId === me)
//         )
//       ) {
//         return;
//       }

//       setMessages((prev) => {
//         const index = prev.findIndex(
//           (m) => m.clientId && m.clientId === msg.clientId
//         );

//         // replace optimistic message
//         if (index !== -1) {
//           const copy = [...prev];
//           copy[index] = { ...msg, pending: false };
//           return copy;
//         }

//         return [...prev, msg];
//       });
//     };

//     socket.on("receive_dm", handler);
//     return () => socket.off("receive_dm", handler);
//   }, [socket, selectedUser, currentUser]);

//   /* -------------------- MARK SEEN (WHEN CHAT OPENS) -------------------- */
//   useEffect(() => {
//     if (!socket || !selectedUser) return;

//     socket.emit("mark_seen", {
//       senderId: selectedUser._id,          // other user
//       receiverId: currentUser.employeeId,  // me
//     });
//   }, [selectedUser, socket, currentUser]);

//   /* -------------------- SEEN CONFIRMATION -------------------- */
//   useEffect(() => {
//     if (!socket || !selectedUser) return;

//     const handler = ({ senderId, receiverId }) => {
//       if (senderId !== currentUser.employeeId) return;
//       if (receiverId !== selectedUser._id) return;

//       setMessages((prev) =>
//         prev.map((msg) =>
//           msg.senderId === currentUser.employeeId &&
//           msg.receiverId === selectedUser._id
//             ? { ...msg, seen: true, pending: false }
//             : msg
//         )
//       );
//     };

//     socket.on("messages_seen", handler);
//     return () => socket.off("messages_seen", handler);
//   }, [socket, selectedUser, currentUser]);

//   /* -------------------- AUTO SCROLL -------------------- */
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   /* -------------------- SEND MESSAGE -------------------- */
//   // const sendMessage = () => {
//   //   if (!text.trim()) return;

//   //   const clientId = uuidv4();

//   //   setMessages((prev) => [
//   //     ...prev,
//   //     {
//   //       clientId,
//   //       senderId: currentUser.employeeId,
//   //       receiverId: selectedUser._id,
//   //       text,
//   //       pending: true,
//   //       seen: false,
//   //     },
//   //   ]);

//   //   socket.emit("send_dm", {
//   //     clientId,
//   //     senderId: currentUser.employeeId,
//   //     receiverId: selectedUser._id,
//   //     text,
//   //   });

//   //   setText("");
//   // };
//   const sendMessage = () => {
//     if (!text.trim()) return;
//   const clientId = uuidv4();

//   setMessages((p) => [
//     ...p,
//     {
//       clientId,
//       senderId: currentUser.employeeId,
//       receiverId: selectedUser._id,
//       text,
//       pending: true,
//       delivered: false,
//       seen: false,
//     },
//   ]);

//   socket.emit("send_dm", {
//     clientId,
//     senderId: currentUser.employeeId,
//     receiverId: selectedUser._id,
//     text,
//   });

//   setText("");
// };


//   /* -------------------- EMPTY STATE -------------------- */
//   if (!selectedUser) {
//     return (
//       <div className="flex-1 flex items-center justify-center">
//         Select a user
//       </div>
//     );
//   }

//   /* -------------------- UI -------------------- */
//   return (
//     <div className="flex-1 flex flex-col">
//       <div className="p-4 border-b font-semibold">
//         {selectedUser.name}
//       </div>

//       <div className="flex-1 overflow-y-auto p-4 space-y-2">
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             className={`flex ${
//               msg.senderId === currentUser.employeeId
//                 ? "justify-end"
//                 : "justify-start"
//             }`}
//           >
//             <div
//               className={`px-3 py-2 rounded max-w-xs ${
//                 msg.senderId === currentUser.employeeId
//                   ? "bg-blue-500 text-white"
//                   : "bg-gray-200"
//               }`}
//             >
//               {msg.text}

//               {/* TICKS */}
//               <div className="text-xs text-right mt-1">
//                <div className="text-xs text-right mt-1">
//   {msg.pending && "⏳"}

//   {!msg.pending && msg.delivered && !msg.seen && (
//     msg.receiverOnline ? "✔✔" : "✔"
//   )}

//   {msg.seen && <span className="text-blue-600">✔✔</span>}
// </div>

//               </div>
//             </div>
//           </div>
//         ))}
//         <div ref={bottomRef} />
//       </div>

//       <div className="p-4 border-t flex gap-2">
//         <input
//           className="flex-1 border rounded px-3 py-2"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           placeholder="Type message..."
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-blue-600 text-white px-4 rounded"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { API_URL } from "../../config";

export default function Slack_chatwindow({ socket, currentUser, selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  /* ---------------- LOAD CHAT + JOIN ROOM ---------------- */
  useEffect(() => {
    if (!selectedUser || !socket) return;

    axios
      .get(
        `${API_URL}/api/messages/dm/${currentUser.employeeId}/${selectedUser._id}`
      )
      .then((res) => setMessages(res.data.data || []));

    socket.emit("join_dm", {
      senderId: currentUser.employeeId,
      receiverId: selectedUser._id,
    });

    // mark seen when opening chat
    socket.emit("mark_seen", {
      senderId: selectedUser._id,
      receiverId: currentUser.employeeId,
    });
  }, [selectedUser, socket, currentUser]);

  /* ---------------- RECEIVE MESSAGE ---------------- */
  useEffect(() => {
    if (!socket || !selectedUser) return;

    const onReceive = (msg) => {
      const me = currentUser.employeeId;
      const other = selectedUser._id;

      // ignore other chats
      if (
        !(
          (msg.senderId === me && msg.receiverId === other) ||
          (msg.senderId === other && msg.receiverId === me)
        )
      ) {
        return;
      }

      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.clientId === msg.clientId);
        if (idx !== -1) {
          const copy = [...prev];
          copy[idx] = {
            ...copy[idx],
            pending: false,
            receiverOnline: msg.receiverOnline,
          };
          return copy;
        }
        return [...prev, msg];
      });
    };

    socket.on("receive_dm", onReceive);
    return () => socket.off("receive_dm", onReceive);
  }, [socket, selectedUser, currentUser]);



  /* ---------------- SEEN CONFIRMATION ---------------- */
  useEffect(() => {
    if (!socket || !selectedUser) return;

    const onSeen = ({ senderId, receiverId }) => {
      // only my sent messages in this chat
      if (
        senderId !== currentUser.employeeId ||
        receiverId !== selectedUser._id
      )
        return;

      setMessages((prev) =>
        prev.map((m) =>
          m.senderId === currentUser.employeeId &&
          m.receiverId === selectedUser._id
            ? { ...m, seen: true }
            : m
        )
      );
    };

    socket.on("messages_seen", onSeen);
    return () => socket.off("messages_seen", onSeen);
  }, [socket, selectedUser, currentUser]);

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = () => {
    if (!text.trim()) return;

    const clientId = uuidv4();

    setMessages((p) => [
      ...p,
      {
        clientId,
        senderId: currentUser.employeeId,
        receiverId: selectedUser._id,
        text,
        pending: true,
        seen: false,
        receiverOnline: false,
      },
    ]);

    socket.emit("send_dm", {
      clientId,
      senderId: currentUser.employeeId,
      receiverId: selectedUser._id,
      text,
    });

    setText("");
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((m) => (
          <div
            key={m.clientId || m._id}
            className={`mb-2 ${
              m.senderId === currentUser.employeeId
                ? "text-right"
                : "text-left"
            }`}
          >
            <div className="inline-block px-3 py-2 rounded bg-gray-200">
              {m.text}
            </div>

            {m.senderId === currentUser.employeeId && (
              <div className="text-xs mt-1">
                {m.pending && "⏳"}
                {!m.pending && !m.seen && (m.receiverOnline ? "✔✔" : "✔")}
                {m.seen && <span className="text-blue-600">✔✔</span>}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 flex gap-2 border-t">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded px-2"
          placeholder="Type a message"
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4">
          Send
        </button>
      </div>
    </div>
  );
}

