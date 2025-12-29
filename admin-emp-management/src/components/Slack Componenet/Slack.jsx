

// // // import { useEffect, useState, useRef } from "react";
// // // import axios from "axios";
// // // import { API_URL } from "../../config";
// // // import { connectSocket } from "../../services/socket";
// // // import Slack_chatwindow from "./Slack_chatwindow";
// // // import Slack_sidebar from "./Slack_sidebar";


// // // export default function Slack() {
// // //   const socketRef = useRef(null);

// // //   const [currentUser, setCurrentUser] = useState(null);
// // //   const [users, setUsers] = useState([]);
// // //   const [selectedUser, setSelectedUser] = useState(null);
// // //   const [unread, setUnread] = useState({});

// // //   //  Logged-in user
// // //   useEffect(() => {
// // //     const user = JSON.parse(localStorage.getItem("hrmsuser"));
// // //     if (user?.employeeId
// // // ) setCurrentUser(user);
// // //   }, []);

// // //   //  Socket connect ONCE
// // //   useEffect(() => {
// // //     if (!currentUser?.employeeId) return;

// // //     socketRef.current = connectSocket();

// // //     socketRef.current.on("receive_dm", (msg) => {
// // //       if (
// // //         msg.senderId !== currentUser.employeeId &&
// // //         msg.senderId !== selectedUser?._id
// // //       ) {
// // //         setUnread((prev) => ({
// // //           ...prev,
// // //           [msg.senderId]: (prev[msg.senderId] || 0) + 1,
// // //         }));
// // //       }
// // //     });

// // //     return () => socketRef.current.disconnect();
// // //   }, [currentUser]);

// // //   // 👥 Fetch users
// // //   useEffect(() => {
// // //     if (!currentUser?.employeeId) return;

// // //     axios
// // //       .get(`${API_URL}/api/employees/all-users`)
// // //       .then((res) => setUsers(res.data.data || []));
// // //   }, [currentUser]);

// // //   // 👆 Sidebar click
// // //   const handleSelectUser = (user) => {
// // //     setSelectedUser(user);
// // //     setUnread((prev) => ({ ...prev, [user._id]: 0 }));
// // //   };

// // //   if (!currentUser) {
// // //     return (
// // //       <div className="h-screen flex items-center justify-center">
// // //         Loading chat...
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="flex h-screen bg-gray-100">
// // //       <Slack_sidebar
// // //         users={users}
// // //         unread={unread}
// // //         selectedUser={selectedUser}
// // //         onSelectUser={handleSelectUser}
// // //       />

// // //       <Slack_chatwindow
// // //         currentUser={currentUser}
// // //         selectedUser={selectedUser}
// // //         socket={socketRef}
// // //       />
// // //     </div>
// // //   );
// // // }

// // import { useEffect, useState, useRef } from "react";
// // import axios from "axios";
// // import { API_URL } from "../../config";
// // import { connectSocket } from "../../services/socket";
// // import Slack_chatwindow from "./Slack_chatwindow";
// // import Slack_sidebar from "./Slack_sidebar";

// // export default function Slack() {
// //   const socketRef = useRef(null);

// //   const [currentUser, setCurrentUser] = useState(null);
// //   const [users, setUsers] = useState([]);
// //   const [selectedUser, setSelectedUser] = useState(null);
// //   const [unread, setUnread] = useState({});

// //   // 🔐 Load logged-in user
// //   useEffect(() => {
// //     const user = JSON.parse(localStorage.getItem("hrmsuser"));
// //     if (user?.employeeId) setCurrentUser(user);
// //   }, []);

// //   // 🔌 CONNECT SOCKET ONCE (NO DISCONNECT)
// //   useEffect(() => {
// //     if (!currentUser?.employeeId) return;

// //     if (!socketRef.current) {
// //       socketRef.current = connectSocket();

// //       socketRef.current.on("connect", () => {
// //         console.log("✅ Socket connected:", socketRef.current.id);
// //       });

// //       socketRef.current.on("receive_dm", (msg) => {
// //         // If chat not open → increase unread
// //         if (
// //           msg.senderId !== currentUser.employeeId &&
// //           msg.senderId !== selectedUser?._id
// //         ) {
// //           setUnread((prev) => ({
// //             ...prev,
// //             [msg.senderId]: (prev[msg.senderId] || 0) + 1,
// //           }));
// //         }
// //       });
// //     }
// //   }, [currentUser, selectedUser]);

// //   // 👥 Fetch users
// //   useEffect(() => {
// //     if (!currentUser?.employeeId) return;

// //     axios
// //       .get(`${API_URL}/api/employees/all-users`)
// //       .then((res) => setUsers(res.data.data || []));
// //   }, [currentUser]);

// //   // 👆 Sidebar click
// //   const handleSelectUser = (user) => {
// //     setSelectedUser(user);
// //     setUnread((prev) => ({
// //       ...prev,
// //       [user._id]: 0,
// //     }));
// //   };

// //   if (!currentUser) {
// //     return (
// //       <div className="h-screen flex items-center justify-center">
// //         Loading chat...
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="flex h-screen bg-gray-100">
// //       <Slack_sidebar
// //         users={users}
// //         unread={unread}
// //         selectedUser={selectedUser}
// //         onSelectUser={handleSelectUser}
// //       />

// //       <Slack_chatwindow
// //         currentUser={currentUser}
// //         selectedUser={selectedUser}
// //         socket={socketRef}
// //       />
// //     </div>
// //   );
// // }

// import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { API_URL } from "../../config";
// import { connectSocket } from "../../services/socket";
// import Slack_chatwindow from "./Slack_chatwindow";
// import Slack_sidebar from "./Slack_sidebar";

// export default function Slack() {
//   const socketRef = useRef(null);

//   const [currentUser, setCurrentUser] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [unread, setUnread] = useState({});

//   //  Load logged user
//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("hrmsuser"));
//     if (user?.employeeId) setCurrentUser(user);
//   }, []);

//   //  CONNECT SOCKET ONCE ( VERY IMPORTANT)
//   useEffect(() => {
//     if (!currentUser?.employeeId) return;
//     if (socketRef.current) return; //  prevent reconnect

//     socketRef.current = connectSocket();

//     socketRef.current.on("receive_dm", (msg) => {
//       // increase unread if chat not open
//       if (msg.senderId !== selectedUser?._id) {
//         setUnread((prev) => ({
//           ...prev,
//           [msg.senderId]: (prev[msg.senderId] || 0) + 1,
//         }));
//       }
//     });

//     //  DO NOT DISCONNECT HERE
//   }, [currentUser]);

//   // 👥 Load users
//   useEffect(() => {
//     if (!currentUser?.employeeId) return;

//     axios
//       .get(`${API_URL}/api/employees/all-users`)
//       .then((res) => setUsers(res.data.data || []));
//   }, [currentUser]);

//   // 👆 Sidebar click
//   const handleSelectUser = (user) => {
//     setSelectedUser(user);

//     // reset unread
//     setUnread((prev) => ({
//       ...prev,
//       [user._id]: 0,
//     }));
//   };

//   if (!currentUser) {
//     return <div className="h-screen flex items-center justify-center">Loading…</div>;
//   }

//   return (
//     <div className="flex h-screen">
//       <Slack_sidebar
//         users={users}
//         unread={unread}
//         selectedUser={selectedUser}
//         onSelectUser={handleSelectUser}
//       />

//       <Slack_chatwindow
//         currentUser={currentUser}
//         selectedUser={selectedUser}
//         socket={socketRef}
//       />
//     </div>
//   );
// }

// import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { API_URL } from "../../config";
// import { connectSocket } from "../../services/socket";
// import Slack_sidebar from "./Slack_sidebar";
// import Slack_chatwindow from "./Slack_chatwindow";

// export default function Slack() {
//   const socketRef = useRef(null);

//   const [currentUser, setCurrentUser] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [unread, setUnread] = useState({});

//   // 🔐 Load logged user
//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("hrmsuser"));
//     if (user?.employeeId) setCurrentUser(user);
//   }, []);

//   // 👥 Fetch users
//   useEffect(() => {
//     if (!currentUser?.employeeId) return;

//     axios
//       .get(`${API_URL}/api/employees/all-users`)
//       .then((res) => setUsers(res.data.data || []));
//   }, [currentUser]);

//   // 🔢 Fetch unread counts (DB)
//   useEffect(() => {
//     if (!currentUser?.employeeId) return;

//     axios
//       .get(`${API_URL}/api/messages/unread/${currentUser.employeeId}`)
//       .then((res) => {
//         const map = {};
//         res.data.data.forEach((u) => {
//           map[u._id] = u.count;
//         });
//         setUnread(map);
//       });
//   }, [currentUser]);

//   // 🔌 Socket
//   useEffect(() => {
//     if (!currentUser?.employeeId) return;

//     socketRef.current = connectSocket();

//     socketRef.current.on("receive_dm", (msg) => {
//       if (msg.senderId === currentUser.employeeId) return;

//       if (selectedUser?._id !== msg.senderId) {
//         setUnread((prev) => ({
//           ...prev,
//           [msg.senderId]: (prev[msg.senderId] || 0) + 1,
//         }));
//       }
//     });

//     return () => socketRef.current.disconnect();
//   }, [currentUser, selectedUser]);

//   // 👆 Click user
//   const handleSelectUser = async (user) => {
//     setSelectedUser(user);

//     // Reset local unread
//     setUnread((prev) => ({ ...prev, [user._id]: 0 }));

//     // Mark messages as seen in DB
//     await axios.post(`${API_URL}/api/messages/seen`, {
//       senderId: user._id,
//       receiverId: currentUser.employeeId,
//     });
//   };

//   if (!currentUser) {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         Loading chat...
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <Slack_sidebar
//         users={users}
//         unread={unread}
//         selectedUser={selectedUser}
//         onSelectUser={handleSelectUser}
//       />

//       <Slack_chatwindow
//         currentUser={currentUser}
//         selectedUser={selectedUser}
//         socket={socketRef}
//       />
//     </div>
//   );
// }

// import { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import { API_URL } from "../../config";
// import { connectSocket } from "../../services/socket";
// import Slack_sidebar from "./Slack_sidebar";
// import Slack_chatwindow from "./Slack_chatwindow";

// export default function Slack() {
//   const socket = useMemo(() => connectSocket(), []);

//   const [currentUser, setCurrentUser] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [unread, setUnread] = useState({});
//   const [onlineUsers, setOnlineUsers] = useState([]);

//   /* Load current user */
//   useEffect(() => {
//     const u = JSON.parse(localStorage.getItem("hrmsuser"));
//     if (u?.employeeId) setCurrentUser(u);
//   }, []);

//   /* Online users */
//   useEffect(() => {
//     if (!socket || !currentUser) return;

//     socket.emit("user_online",currentUser.employeeId);

//     socket.on("online_users", (users) => {
//       setOnlineUsers(users);
//     });

//     return () => socket.off("online_users");
//   }, [socket, currentUser]);

//   /* Fetch all users */
//   useEffect(() => {
//     if (!currentUser) return;
//     axios
//       .get(`${API_URL}/api/employees/all-users`)
//       .then((res) => setUsers(res.data.data || []));
//   }, [currentUser]);

//   /* Socket unread messages */
//   useEffect(() => {
//     if (!socket || !currentUser) return;

//     const handler = (msg) => {
//       if (msg.receiverId !== currentUser.employeeId) return;
      
//       if (selectedUser?._id === msg.senderId) return;
//       setUnread((prev) => ({
//         ...prev,
//         [msg.senderId]: (prev[msg.senderId] || 0) + 1,
//       }));
//     };

//     socket.on("receive_dm", handler);
//     return () => socket.off("receive_dm", handler);
//   }, [socket, currentUser, selectedUser]);

//   /* Fetch unread counts from DB */
//   useEffect(() => {
//     if (!currentUser) return;

//     axios
//       .get(`${API_URL}/api/messages/unread/${currentUser.employeeId}`)
//       .then((res) => {
//         const map = {};
//         (res.data.data || []).forEach((i) => {
//           map[i._id] = i.count;
//         });
//         setUnread(map);
//       });
//   }, [currentUser]);

//   /* Open chat */
//   // const handleSelectUser = async (user) => {
//   //   setSelectedUser(user);
//   //   setUnread((p) => ({ ...p, [user._id]: 0 }));

//   //   await axios.post(`${API_URL}/api/messages/seen`, {
//   //     senderId: user._id,
//   //     receiverId: currentUser.employeeId,
//   //   });

//   //   socket.emit("mark_seen", {
//   //     senderId: user._id,
//   //     receiverId: currentUser.employeeId,
//   //   });
//   // };
//   // Slack.jsx
// // const handleSelectUser = async (user) => {
// //   setSelectedUser(user);
// //   setUnread((p) => ({ ...p, [user._id]: 0 }));

// //   // ✅ ONLY PLACE SEEN IS TRIGGERED
// //   await axios.post(`${API_URL}/api/messages/seen`, {
// //     senderId: user._id,
// //     receiverId: currentUser.employeeId,
// //   });

// //   socket.emit("mark_seen", {
// //     senderId: user._id,
// //     receiverId: currentUser.employeeId,
// //   });
// // };
// // const handleSelectUser = async(user) => {
// //   setSelectedUser(user);
// //   setUnread((p) => ({ ...p, [user._id]: 0 }));
// //    await axios.post(`${API_URL}/api/messages/seen`,{
// //     senderId: user._id,
// //     receiverId: currentUser.employeeId,
// //   });

// //   socket.emit("mark_seen", {
// //     senderId: user._id,
// //     receiverId: currentUser.employeeId,
// //   });
// // };

// const handleSelectUser = async(user) => {
//   setSelectedUser(user);
//   setUnread((p) => ({ ...p, [user._id]: 0 }));
  
//   // Mark messages as seen
//   await axios.post(`${API_URL}/api/messages/seen`, {
//     senderId: user._id,
//     receiverId: currentUser.employeeId,
//   });

//   socket.emit("mark_seen", {
//     senderId: user._id,
//     receiverId: currentUser.employeeId,
//   });
// };


//   if (!currentUser) return <div>Loading chat...</div>;

//   return (
//     <div className="flex h-screen">
//       <Slack_sidebar
//         users={users}
//         unread={unread}
//         selectedUser={selectedUser}
//         onSelectUser={handleSelectUser}
//         onlineUsers={onlineUsers}
//       />

//       <Slack_chatwindow
//         currentUser={currentUser}
//         selectedUser={selectedUser}
//         socket={socket}
//         onlineUsers={onlineUsers}
//       />
//     </div>
//   );
// }

// workimg main
// import { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import { connectSocket } from "../../services/socket";
// import Slack_sidebar from "./Slack_sidebar";
// import Slack_chatwindow from "./Slack_chatwindow";
// import { API_URL } from "../../config";

// export default function Slack() {
//   const socket = useMemo(() => connectSocket(), []);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [unread, setUnread] = useState({});
//   const [onlineUsers, setOnlineUsers] = useState([]);

//   useEffect(() => {
//     const u = JSON.parse(localStorage.getItem("hrmsuser"));
//     if (u?.employeeId) setCurrentUser(u);
//   }, []);

//   useEffect(() => {
//     if (!socket || !currentUser) return;

//     socket.emit("user_online", currentUser.employeeId);
//     socket.on("online_users", setOnlineUsers);

//     return () => socket.off("online_users");
//   }, [socket, currentUser]);

//   useEffect(() => {
//     if (!currentUser) return;
//     axios.get(`${API_URL}/api/employees/all-users`)
//       .then(res => setUsers(res.data.data || []));
//   }, [currentUser]);

//   // frontend (Slack.jsx)
// useEffect(() => {
//   if (!socket || !currentUser) return;

//   const onReceive = (msg) => {
//     if (msg.receiverId !== currentUser.employeeId) return;

//     // ❗ If chat NOT open → increment unread
//     if (selectedUser?._id !== msg.senderId) {
//       setUnread((prev) => ({
//         ...prev,
//         [msg.senderId]: (prev[msg.senderId] || 0) + 1,
//       }));
//     }
//   };

//   socket.on("receive_dm", onReceive);
//   return () => socket.off("receive_dm", onReceive);
// }, [socket, currentUser, selectedUser]);

// const handleSelectUser = async (user) => {
//   setSelectedUser(user);

//   // 1️⃣ Clear unread immediately
//   setUnread((prev) => ({ ...prev, [user._id]: 0 }));

//   // 2️⃣ Mark seen in DB
//   await axios.post(`${API_URL}/api/messages/seen`, {
//     senderId: user._id,
//     receiverId: currentUser.employeeId,
//   });

//   // 3️⃣ Notify sender (blue tick)
//   socket.emit("mark_seen", {
//     senderId: user._id,
//     receiverId: currentUser.employeeId,
//   });
// };


//   return (
//     <div className="flex h-screen">
//       <Slack_sidebar
//         users={users}
//         selectedUser={selectedUser}
//         unread={unread}
//         onlineUsers={onlineUsers}
//         onSelectUser={handleSelectUser}
//       />

//       <Slack_chatwindow
//         socket={socket}
//         currentUser={currentUser}
//         selectedUser={selectedUser}
//         onlineUsers={onlineUsers}
//       />
//     </div>
//   );
// }

// working main with unread from db
// import { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import { connectSocket } from "../../services/socket";
// import Slack_sidebar from "./Slack_sidebar";
// import Slack_chatwindow from "./Slack_chatwindow";
// import { API_URL } from "../../config";

// export default function Slack() {
//   const socket = useMemo(() => connectSocket(), []);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const [unread, setUnread] = useState({});

//   /* LOAD CURRENT USER */
//   useEffect(() => {
//     const u = JSON.parse(localStorage.getItem("hrmsuser"));
//     if (u?.employeeId) setCurrentUser(u);
//   }, []);

//   /* ONLINE USERS */
//   useEffect(() => {
//     if (!socket || !currentUser) return;
//     socket.emit("user_online", currentUser.employeeId);
//     socket.on("online_users", setOnlineUsers);

//     return () => socket.off("online_users");
//   }, [socket, currentUser]);

//   /* LOAD USERS */
//   useEffect(() => {
//     if (!currentUser) return;
//     axios.get(`${API_URL}/api/employees/all-users`)
//       .then(res => setUsers(res.data.data || []));
//   }, [currentUser]);

//   /* LOAD UNREAD FROM DB */
//   useEffect(() => {
//     if(!currentUser) return;

//     axios.get(`${API_URL}/api/messages/unread/${currentUser.employeeId}`)
//       .then(res => {
//         const map = {};
//         res.data.data.forEach(i => map[i._id] = i.count);
//         setUnread(map);
//       });
//   }, [currentUser]);

//   /* RECEIVE MESSAGE → INCREASE UNREAD */
//   useEffect(() => {
//     if (!socket || !currentUser) return;

//     const onReceive = (msg) => {
//       if(msg.receiverId !== currentUser.employeeId) return;
//       // chat not open
//       if(selectedUser?._id !== msg.senderId)
//       {
//         setUnread(prev => ({
//           ...prev,
//           [msg.senderId]: (prev[msg.senderId] || 0) + 1,
//         }));
//       }
//     };

//     socket.on("receive_dm", onReceive);
//     return () => socket.off("receive_dm", onReceive);
//   }, [socket, currentUser, selectedUser]);

//   /* OPEN CHAT */
//   const handleSelectUser = async (user) => {
//     setSelectedUser(user);

//     // clear unread immediately
//     setUnread(prev => ({ ...prev, [user._id]: 0 }));

//     // mark seen
//     await axios.post(`${API_URL}/api/messages/seen`, {
//       senderId: user._id,
//       receiverId: currentUser.employeeId,
//     });

//     socket.emit("mark_seen", {
//       senderId: user._id,
//       receiverId: currentUser.employeeId,
//     });
//   };

//   return (
//     <div className="flex h-screen">
//       <Slack_sidebar
//         users={users}
//         selectedUser={selectedUser}
//         unread={unread}
//         onlineUsers={onlineUsers}
//         onSelectUser={handleSelectUser}
//       />

//       <Slack_chatwindow
//         socket={socket}
//         currentUser={currentUser}
//         selectedUser={selectedUser}
//       />
//     </div>
//   );
// }


//Besting working main with unread from db
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { connectSocket } from "../../services/socket";
import Slack_sidebar from "./Slack_sidebar";
import Slack_chatwindow from "./Slack_chatwindow";
import { API_URL } from "../../config";

export default function Slack() {
  const socket = useMemo(() => connectSocket(), []);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unread, setUnread] = useState({});

  /* LOAD CURRENT USER */
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("hrmsuser"));
    if (u?._id) setCurrentUser(u);
  }, []);

  /* ONLINE USERS */
  useEffect(() => {
    if (!socket || !currentUser) return;
    socket.emit("user_online", currentUser._id);
    socket.on("online_users", setOnlineUsers);

    return () => socket.off("online_users");
  }, [socket, currentUser]);

  /* LOAD USERS */
  useEffect(() => {
    if (!currentUser) return;
    axios.get(`${API_URL}/api/employees/all-users`)
      .then(res => setUsers(res.data.data || []));
      console.log("users",users);
  }, [currentUser]);

  /* LOAD UNREAD FROM DB */
  useEffect(() => {
    if(!currentUser) return;

    axios.get(`${API_URL}/api/messages/unread/${currentUser._id}`)
      .then(res => {
        const map = {};
        res.data.data.forEach(i => map[i._id] = i.count);
        setUnread(map);
      });
  }, [currentUser]);

  /* RECEIVE MESSAGE → INCREASE UNREAD */
  useEffect(() => {
    if (!socket || !currentUser) return;

    const onReceive = (msg) => {
      if(msg.receiverId !== currentUser._id) return;
      // chat not open
      if(selectedUser?._id !== msg.senderId)
      {
        setUnread(prev => ({
          ...prev,
          [msg.senderId]: (prev[msg.senderId] || 0) + 1,
        }));
      }
    };

    socket.on("receive_dm", onReceive);
    return () => socket.off("receive_dm", onReceive);
  }, [socket, currentUser, selectedUser]);

  /* OPEN CHAT */
  const handleSelectUser = async (user) => {
    setSelectedUser(user);

    // clear unread immediately
    setUnread(prev => ({ ...prev, [user._id]: 0 }));

    // mark seen
    await axios.post(`${API_URL}/api/messages/seen`, {
      senderId: user._id,
      receiverId: currentUser._id,
    });

    socket.emit("mark_seen", {
      senderId: user._id,
      receiverId: currentUser._id,
    });
  };

  return (
    <div className="flex h-screen">
      <Slack_sidebar
        users={users}
        selectedUser={selectedUser}
        unread={unread}
        onlineUsers={onlineUsers}
        onSelectUser={handleSelectUser}
      />

      <Slack_chatwindow
        socket={socket}
        currentUser={currentUser}
        selectedUser={selectedUser}
      />
    </div>
  );
}

