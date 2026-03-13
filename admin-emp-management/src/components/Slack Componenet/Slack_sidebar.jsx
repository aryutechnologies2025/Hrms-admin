// import { useState } from "react";

// export default function Slack_sidebar({
//   users,
//   unread=[],
//   selectedUser,
//   onSelectUser,
// }) {
//   return (
//     <div className="w-72 bg-white border-r h-screen overflow-y-auto">
//       <div className="p-4 font-bold border-b">Chats</div>

//       {users.map((user) => (
//         <div
//           key={user._id}
//           onClick={() => onSelectUser(user)}
//           className={`p-4 cursor-pointer flex justify-between items-center
//             ${selectedUser?._id === user._id ? "bg-gray-100" : ""}
//             hover:bg-gray-50`}
//         >
//           <span>{user.name}</span>

//           {unread[user._id] > 0 && (
//             <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
//               {unread[user._id]}
//             </span>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default function Slack_sidebar({
//   users = [],
//   unread = {},
//   selectedUser,
//   onSelectUser,
//    onlineUsers = [],
// }) {
//   return (
//     <div className="w-72 bg-white border-r overflow-y-auto">
//       <div className="p-4 font-bold border-b">Chats</div>

//       {users.map((user) => {
//   const active = selectedUser?._id === user._id;
//   const count = unread[user._id] || 0;

//   const isOnline = onlineUsers.includes(user._id);

//   return (
//     <div
//       key={user._id}
//       onClick={() => onSelectUser(user)}
//       className={`px-4 py-3 cursor-pointer flex justify-between items-center
//         ${active ? "bg-gray-100" : "hover:bg-gray-50"}`}
//     >
//       <div className="flex items-center gap-2">
//         {/*  ONLINE / OFFLINE CIRCLE */}
//         <span
//           className={`w-2 h-2 rounded-full ${
//             isOnline ? "bg-green-500" : "bg-gray-400"
//           }`}
//         />

//         <span className={`${!isOnline ? "text-gray-400" : ""}`}>
//           {user.name}
//         </span>
//       </div>

//       {/*  UNREAD */}
//       {count > 0 && !active && (
//         <span className="bg-red-500 text-white text-xs px-2 rounded-full">
//           {count}
//         </span>
//       )}
//     </div>
//   );
// })}

//     </div>
//   );
// }
// export default function Slack_sidebar({
//   users,
//   selectedUser,
//   onSelectUser,
//   unread,
//   onlineUsers,
// }) {
//   return (
//     <div className="w-72 h-screen border-r flex flex-col bg-white">
//       {/* ===== HEADER (FIXED) ===== */}
//       <div className="p-4 font-semibold border-b sticky top-0 bg-white z-10">
//         Chats
//       </div>

//       {/* ===== USER LIST (SCROLLABLE) ===== */}
//       <div className="flex-1 overflow-y-auto">
//         {users.map((u) => (
//           <div
//             key={u._id}
//             onClick={() => onSelectUser(u)}
//             className={`px-4 py-3 cursor-pointer flex justify-between items-center
//               ${
//                 selectedUser?._id === u._id
//                   ? "bg-gray-100"
//                   : "hover:bg-gray-50"
//               }`}
//           >
//             {/* LEFT */}
//             <div className="flex items-center gap-2">
//               <span
//                 className={`h-2 w-2 rounded-full ${
//                   onlineUsers.includes(u._id)
//                     ? "bg-green-500"
//                     : "bg-gray-400"
//                 }`}
//               />
//               <span className="truncate">{u.name}</span>
//             </div>

//             {/* UNREAD COUNT */}
//             {unread?.[u._id] > 0 && (
//               <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
//                 {unread[u._id]}
//               </span>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default function Slack_sidebar({
//   users,
//   selectedUser,
//   onSelectUser,
//   unread,
//   onlineUsers,
// }) {
//   return (
//     <div className="w-72 h-screen border-r flex flex-col bg-white">
//       <div className="flex-1 overflow-y-auto">
//          {users.map(u => (
//         <div
//           key={u._id}
//           onClick={() => onSelectUser(u)}
//           className={`p-3 cursor-pointer ${
//             selectedUser?._id === u._id ? "bg-gray-200" : ""
//           }`}
//         >
//           <span
//             className={`inline-block h-2 w-2 rounded-full mr-2 ${
//               onlineUsers.includes(u._id) ? "bg-green-500" : "bg-gray-400"
//             }`}
//           />
//           {u.name}
//         </div>
//       ))}
//       </div>

//     </div>
//   );
// }

// export default function Slack_sidebar({
//   users,
//   selectedUser,
//   onSelectUser,
//   unread,
//   onlineUsers,
// }) {
//   return (

//     <div className="w-72 h-screen border-r flex flex-col bg-white">
//        <div className="flex-1 overflow-y-auto">
//       {users.map(u => (
//         <div
//           key={u._id}
//           onClick={() => onSelectUser(u)}
//           className={`flex justify-between items-center p-3 cursor-pointer
//             ${selectedUser?._id === u._id ? "bg-gray-200" : ""}`}
//         >
//           <div className="flex items-center gap-2">
//             <span
//               className={`h-2 w-2 rounded-full ${
//                 onlineUsers.includes(u._id)
//                   ? "bg-green-500"
//                   : "bg-gray-400"
//               }`}
//             />
//             {u.name}
//           </div>

//           {unread[u._id] > 0 && (
//             <span className="bg-red-500 text-white text-xs px-2 rounded-full">
//               {unread[u._id]}
//             </span>
//           )}
//         </div>
//       ))}
//       </div>
//     </div>
//   );
// }

// import { useState } from 'react';

// export default function SlackSidebar({
//   users,
//   selectedUser,
//   onSelectUser,
//   unread,
//   onlineUsers,
// }) {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [activeFilter, setActiveFilter] = useState('all');

//   const filteredUsers = users.filter(user => {
//     const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());

//     switch (activeFilter) {
//       case 'online':
//         return matchesSearch && onlineUsers.includes(user._id);
//       case 'unread':
//         return matchesSearch && (unread[user._id] > 0);
//       default:
//         return matchesSearch;
//     }
//   });

//   return (
//     <div className="w-80 h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 shadow-lg">
//       {/* Header */}
//       <div className="p-6 pb-4 border-b border-gray-200">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
//             Messages
//           </h2>
//           <div className="relative">
//             <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//             </span>
//             <input
//               type="text"
//               placeholder="Search messages..."
//               className="pl-10 pr-4 py-2 w-48 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-sm"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Filter Tabs */}
//         <div className="flex space-x-2 mb-4">
//           {['all', 'online', 'unread'].map((filter) => (
//             <button
//               key={filter}
//               onClick={() => setActiveFilter(filter)}
//               className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200 ${
//                 activeFilter === filter
//                   ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
//                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//               }`}
//             >
//               {filter}
//               {filter === 'unread' && (
//                 <span className="ml-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
//                   {Object.values(unread).reduce((a, b) => a + b, 0)}
//                 </span>
//               )}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Online Users Count */}
//       <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-y border-gray-100">
//         <div className="flex items-center justify-between">
//           <span className="text-sm font-medium text-gray-700">
//             Online Users
//           </span>
//           <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
//             {onlineUsers.length}
//           </span>
//         </div>
//       </div>

//       {/* Fixed Height Scrollable User List */}
//       <div className="flex-1 overflow-hidden">
//         <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
//           {filteredUsers.length > 0 ? (
//             filteredUsers.map((user) => (
//               <div
//                 key={user._id}
//                 onClick={() => onSelectUser(user)}
//                 className={`flex items-center justify-between p-4 mx-4 my-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
//                   selectedUser?._id === user._id
//                     ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 shadow-md'
//                     : 'hover:bg-gray-50 border border-transparent'
//                 }`}
//               >
//                 <div className="flex items-center space-x-3">
//                   {/* Profile Image Container */}
//                   <div className="relative">
//                     <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
//                       <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
//                         {user.name.charAt(0).toUpperCase()}
//                       </div>
//                     </div>

//                     {/* Online Status Indicator */}
//                    { console.log("onlineUsers", onlineUsers.includes(user._id),"user._id",user._id)}
//                     <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
//                       onlineUsers && onlineUsers.includes(user._id)
//                         ? 'bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse'
//                         : 'bg-gray-400'
//                     }`}>
//                       {onlineUsers.includes(user._id) && (
//                         <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></div>
//                       )}
//                     </div>
//                   </div>

//                   {/* User Info */}
//                   <div className="flex flex-col">
//                     <div className="flex items-center space-x-2">
//                       <span className={`font-semibold ${
//                         selectedUser?._id === user._id
//                           ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600'
//                           : 'text-gray-800'
//                       }`}>
//                         {user.name}
//                       </span>
//                       {unread[user._id] > 0 && !selectedUser?._id === user._id && (
//                         <span className="h-2 w-2 bg-red-500 rounded-full animate-bounce"></span>
//                       )}
//                     </div>
//                      <span className={`text-sm ${
//                       selectedUser?._id === user._id
//                         ? 'text-purple-500 font-medium'
//                         : 'text-gray-700'
//                     }`}>
//                      {user.type}
//                     </span>
//                     <span className={`text-sm ${
//                       selectedUser?._id === user._id
//                         ? 'text-purple-500 font-medium'
//                         : 'text-gray-500'
//                     }`}>
//                       {onlineUsers.includes(user._id)
//                         ? 'Online now'
//                         : 'Last seen recently'}
//                     </span>

//                   </div>
//                 </div>

//                 {/* Unread Message Count */}
//                 {unread[user._id] > 0 && (
//                   <div className="flex flex-col items-end space-y-1">
//                     <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md transform hover:scale-110 transition-transform">
//                       {unread[user._id]}
//                     </span>
//                     <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <div className="flex flex-col items-center justify-center h-64 text-gray-500">
//               <div className="w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                 <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <p className="text-lg font-medium">No users found</p>
//               <p className="text-sm">Try changing your search or filter</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white p-4">
//         <div className="flex items-center justify-between px-4">
//           <div className="flex items-center space-x-3">
//             <div className="relative">
//               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500"></div>
//               <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//             </div>
//             <div>
//               <p className="font-semibold text-gray-800">You</p>
//               <p className="text-sm text-green-600 font-medium">Active now</p>
//             </div>
//           </div>
//           <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
//             <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

///////////////////end
//
// Edit Channel Modal
// function EditChannelModal({
//   channel,
//   onClose,
//   currentUser,
//   setChaneel,
//   socket,
// }) {

//   console.log("channel in edit modal", channel);
//   const [name, setName] = useState(channel.name);
//   const [employeeOption, setEmployeeOption] = useState([]);
//   const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState([]);

//   useEffect(() => {
//     fetchEmployeeList();
//   }, []);

//   const fetchEmployeeList = async () => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/api/employees/all-users`,
//         {
//           params: {
//             userId: currentUser?._id,
//             type: currentUser?.superUser ? "superAdmin" : currentUser?.type,
//           },
//         },
//         {
//           withCredentials: true,
//         },
//       );
//       console.log("response in edit modal", response);
//       // const employeeIds = response.data.data.map(emp => `${emp.employeeId} - ${emp.employeeName}`);
//       const employeeemail = response.data.data
//         .filter((val) => val._id != currentUser?._id)
//         .map((emp) => ({
//           label: emp.name,
//           value: emp._id,
//         }));
//       console.log("employeeemail", employeeemail);
//       setEmployeeOption(employeeemail);

//       // const selected = channel.members.map((m) => ({
//       //   label: m.name,
//       //   value: m._id,
//       // }));

//       // const selected = channel.members.map((m) => m._id);

// setSelectedEmployeeDetails(channel.members || []);

//     } catch (error) {
//       console.log(error);
//       // setLoading(false);
//     }
//   };

// console.log("selected", selectedEmployeeDetails);
//   // const handleUpdate = async () => {
//   //   try {
//   //     console.log("update res", selectedEmployeeDetails);
//   //     const res = await axios.put(
//   //       `${API_URL}/api/channel/update-channel/${channel._id}`,
//   //       {
//   //         name,
//   //         members: selectedEmployeeDetails,
//   //       },
//   //     );

//   //     if (res.data.success) {
//   //       setChaneel((prev) =>
//   //         prev.map((ch) => (ch._id === channel._id ? res.data.data : ch)),
//   //       );
//   //     }
//   //     onClose();
//   //   } catch (err) {
//   //     console.log("update error", err);
//   //   }
//   // };

// const handleUpdate = async () => {
//   // ✅ Prevent empty name
//   if (!name.trim()) {
//     Swal.fire({
//       icon: "warning",
//       title: "Channel name required",
//     });
//     return;
//   }
//   try {
//     // ✅ Loading alert
//     Swal.fire({
//       title: "Updating...",
//       allowOutsideClick: false,
//       didOpen: () => {
//         Swal.showLoading();
//       },
//     });

//     const res = await axios.put(
//       `${API_URL}/api/channel/update-channel/${channel._id}`,
//       {
//         name,
//         members: selectedEmployeeDetails, // already IDs 👍
//       }
//     );

//     if (res.data.success) {
//       setChaneel((prev) =>
//         prev.map((ch) => (ch._id === channel._id ? res.data.data : ch))
//       );

//       Swal.fire({
//         icon: "success",
//         title: "Channel Updated!",
//         timer: 1500,
//         showConfirmButton: false,
//       });

//       onClose();
//     }
//   } catch (err) {
//     console.log("update error", err);

//     Swal.fire({
//       icon: "error",
//       title: "Update Failed",
//       text: "Something went wrong.",
//     });
//   }
// };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl w-96 p-6 shadow-xl">
//         <h2 className="text-lg font-bold mb-4">Edit Channel</h2>

//         <input
//           className="w-full border rounded px-3 py-2 mb-4"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />

//         <MultiSelect
//           value={selectedEmployeeDetails}
//           onChange={(e) => setSelectedEmployeeDetails(e.value)}
//           options={employeeOption}
//           optionLabel="label"
//           optionValue="value" // ⭐ THIS IS THE FIX
//           filter
//           placeholder="Select Employees"
//           // maxSelectedLabels={3}
//           className="w-full border border-gray-300 rounded-lg"
//           display="chip"
//         />

//         <div className="flex justify-end gap-2 mt-4">
//           <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
//             Cancel
//           </button>
//           <button
//             onClick={handleUpdate}
//             className="px-4 py-2 bg-blue-600 text-white rounded"
//           >
//             Update
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

/* ---------------- SECTION HEADER ---------------- */
// function SectionHeader({ title, open, onToggle, rightAction, currentUser }) {
//   return (
//     <div
//       onClick={onToggle}
//       className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100"
//     >
//       <div className="flex items-center gap-2">
//         <span className={`transition-transform ${open ? "rotate-90" : ""}`}>
//           ▶
//         </span>
//         <span className="font-semibold text-gray-700">{title}</span>
//       </div>
//       {currentUser && currentUser.superUser && rightAction}
//     </div>
//   );
// }

// function SectionHeader({
//   title,
//   open,
//   onToggle,
//   rightAction,
//   currentUser,
//   icon: LeftIcon, // optional left icon
// }) {
//   return (
//     <div
//       onClick={onToggle}
//       className="
//         group
//         flex items-center justify-between
//         px-4 py-2 mx-2 mt-2
//         rounded-lg
//         cursor-pointer
//         transition-all
//         hover:bg-slate-100
//       "
//     >
//       {/* LEFT SIDE */}
//       <div className="flex items-center gap-2">
//         {/* Optional left icon */}
//         {LeftIcon && (
//           <LeftIcon size={16} className="text-slate-500" />
//         )}

//         {/* Title */}
//         <span className="text-sm font-medium text-slate-700">
//           {title}
//         </span>
//          {/* Arrow (right → down when open) */}
//         <ChevronRight
//           size={14}
//           className={`
//             text-slate-400
//             transition-transform duration-200
//             ${open ? "rotate-90" : ""}
//           `}
//         />
//       </div>

//       {/* RIGHT ACTION (admin only) */}
//       {currentUser?.superUser && rightAction && (
//         <div
//           onClick={(e) => e.stopPropagation()}
//           className="opacity-0 group-hover:opacity-100 transition"
//         >
//           {rightAction}
//         </div>
//       )}
//     </div>
//   );
// }

//
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import axios from "axios";
import { MultiSelect } from "primereact/multiselect";
import { FiEdit, FiTrash2 } from "react-icons/fi"; // Feather icon (recommended)
import Swal from "sweetalert2";
import { Group, Lock } from "lucide-react";
import { BsGlobeCentralSouthAsia, BsPeople } from "react-icons/bs";
import { GiAllForOne } from "react-icons/gi";
import { Star, Hash, MessageCircle, Plus } from "lucide-react";
import { ChevronRight } from "lucide-react";
import {
  clearChannel,
  clearDM,
  setSelectedChannel,
  setSelectedUser,
} from "../../redux/chatSlice";
import { useDispatch } from "react-redux";
/* ---------------- MODAL ---------------- */
function CreateChannelModal({
  onClose,
  currentUser,
  setChaneel,
  socket,
  setChannelRefresh,
}) {
  const [name, setName] = useState("");
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);

  const [employeeOption, setEmployeeOption] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [channelType, setChaneelType] = useState();

  // useEffect(() => {
  //   if (!socket) return;
  //   socket.on("channel_created", (newChannel) => {
  //     setChaneel((prev) => {
  //       const exists = prev.find((c) => c._id === newChannel._id);
  //       if (exists) return prev;
  //       return [...prev, newChannel];
  //     });
  //   });
  //   return () => {
  //     socket.off("channel_created");
  //   };
  // }, []);

  // const fetchEmployeeList = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${API_URL}/api/employees/all-users`,
  //       {
  //         params: {
  //           userId: currentUser?._id,
  //           type: currentUser?.superUser ? "superAdmin" : currentUser?.type,
  //         },
  //       },
  //       {
  //         withCredentials: true,
  //       },
  //     );
  //     // const employeeIds = response.data.data.map(emp => `${emp.employeeId} - ${emp.employeeName}`);
  //     const employeeemail = response.data.data
  //       .filter((val) => val._id != currentUser?._id)
  //       .map((emp) => ({
  //         label: emp.name,
  //         value: emp._id,
  //       }));
  //     setEmployeeOption(employeeemail);
  //   } catch (error) {
  //     console.log(error);
  //     setLoading(false);
  //   }
  // };
  const fetchEmployeeList = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/employees/all-users`, {
        params: {
          userId: currentUser?._id,
          type: currentUser?.superUser ? "superAdmin" : currentUser?.type,
        },
        withCredentials: true,
      });

      // Remove current user
      const filtered = response.data.data.filter(
        (emp) => emp._id !== currentUser?._id,
      );
      // 1️ Group users by type
      const grouped = filtered.reduce((acc, emp) => {
        if (!acc[emp.type]) acc[emp.type] = [];

        acc[emp.type].push({
          label: emp.name,
          value: emp._id,
        });
        return acc;
      }, {});

      // 2️ Define required order
      const ORDER = ["employee", "admin", "client", "clientSubUser"];

      // 3️ Convert to PrimeReact MultiSelect group format
      const groupArray = ORDER.filter((type) => grouped[type]) // keep only existing types
        .map((type) => ({
          label:
            type === "clientSubUser"
              ? "Client Sub User"
              : type.charAt(0).toUpperCase() + type.slice(1),
          items: grouped[type].sort((a, b) => a.label.localeCompare(b.label)),
        }));

      setEmployeeOption(groupArray);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // fetchData();
    fetchEmployeeList();
  }, []);

  // const handleCreate = async () => {
  //   if (!name.trim()) return;
  //   try {
  //     const res = await axios.post(`${API_URL}/api/channel/create-channel`, {
  //       name,
  //       createdBy: currentUser._id,
  //       members: selectedEmployeeDetails,
  //     });
  //     console.log("res", res);
  //     if (res.data.success && res.data.data) {
  //       setChaneel((prev) => [...prev, res.data.data]);
  //     }
  //   } catch (err) {
  //     console.log("error while creating channel", err);
  //   }
  //   // onCreate(name);
  //   onClose();
  // };

  const handleCreate = async () => {
    console.log("selectedEmployeeDetails");
    // Validate name
    if (!name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Channel name required",
      });
      return;
    }

    try {
      // Loading popup
      Swal.fire({
        title: "Creating Channel...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      let members = selectedEmployeeDetails;

      // ✅ auto select for general
      if (channelType === "general") {
        members = employeeOption
          .filter(
            (group) =>
              group.label.toLowerCase() === "employee" ||
              group.label.toLowerCase() === "admin",
          )
          .flatMap((group) => group.items.map((item) => item.value));
      }

      const res = await axios.post(`${API_URL}/api/channel/create-channel`, {
        name,
        createdBy: currentUser._id,
        members: members,
        channelType: channelType,
      });

      if (res.data.success && res.data.data) {
        console.log("res", res.data.data);
        // setChaneel((prev) => [...prev,{name,members: selectedEmployeeDetails}]);
        setChannelRefresh((prev) => !prev);
        //  Optional realtime emit
        // socket?.emit("channel-created", newChannel);

        //  Success
        Swal.fire({
          icon: "success",
          title: "Channel Created!",
          timer: 1500,
          showConfirmButton: false,
        });

        onClose(); // close only after success
      }
    } catch (err) {
      console.log("error while creating channel", err);

      const errorMessage = err?.response?.data?.message || "";

      //  Detect Mongo duplicate error
      if (errorMessage.includes("E11000")) {
        Swal.fire({
          icon: "error",
          title: "Duplicate Channel",
          text: "Channel name already exists. Please choose another name.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Creation Failed",
          text: "Something went wrong.",
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 w-[100vw]">
      <div className="bg-white rounded-xl w-96 p-6 shadow-xl">
        <h2 className="text-lg font-bold mb-4">Create Channel</h2>
        <label
          htmlFor="employee_name"
          className="block text-sm font-medium mb-2"
        >
          Channel Name
        </label>
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="channel-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label
          htmlFor="employee_name"
          className="block text-sm font-medium mb-2"
        >
          Channel type
        </label>

        {/* <select
          onChange={(e) => setChaneelType(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        >
          <option value="private">Private</option>
          <option value="general">General</option>
        </select> */}
        <select
          value={channelType || ""}
          onChange={(e) => setChaneelType(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        >
          <option value="" disabled hidden>
            Select Type
          </option>
          <option value="private">Private</option>
          <option value="general">General</option>
        </select>

        {channelType !== "general" && (
          <div className="flex flex-wrap md:flex-nowrap gap-3  pt-2">
            <div className="my-2 w-full ">
              <label
                htmlFor="employee_name"
                className="block text-sm font-medium mb-2"
              >
                Add Employees
              </label>

              {/* <MultiSelect
              value={selectedEmployeeDetails}
              onChange={(e) => setSelectedEmployeeDetails(e.value)}
              options={employeeOption}
              optionLabel="label"
              filter
              placeholder="Select Employees"
              maxSelectedLabels={3}
              className="w-full   border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              display="chip"
            /> */}

              <MultiSelect
                value={selectedEmployeeDetails}
                onChange={(e) => setSelectedEmployeeDetails(e.value)}
                options={employeeOption}
                optionGroupLabel="label" // Heading
                optionGroupChildren="items" // Items under heading
                filter
                placeholder="Select Employees"
                display="chip"
                className="w-full border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-3">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded bg-purple-600 text-white"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

function EditChannelModal({
  channel,
  onClose,
  currentUser,
  setChaneel,
  setChannelRefresh,
}) {
  const [name, setName] = useState("");
  const [employeeOption, setEmployeeOption] = useState([]);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState([]);
  const [channelType, setChaneelType] = useState();
  /* ------------------------------------------------ */
  /*  Sync state when channel arrives */
  /* ------------------------------------------------ */

  useEffect(() => {
    if (channel) {
      setName(channel.name || "");
      setSelectedEmployeeDetails(channel.members || []); //  IDs only
      setChaneelType(channel?.channelType);
    }
  }, [channel]);

  /* ------------------------------------------------ */
  /*  Fetch Employees */
  /* ------------------------------------------------ */

  useEffect(() => {
    fetchEmployeeList();
  }, []);

  // const fetchEmployeeList = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${API_URL}/api/employees/all-users`,
  //       {
  //         params: {
  //           userId: currentUser?._id,
  //           type: currentUser?.superUser
  //             ? "superAdmin"
  //             : currentUser?.type,
  //         },
  //         withCredentials: true, // ✅ FIXED AXIOS
  //       }
  //     );

  //     const employeeemail = response.data.data
  //       // .filter((val) => val._id !== currentUser?._id)
  //       .map((emp) => ({
  //         label: emp.name,
  //         value: emp._id,
  //       }));

  //     setEmployeeOption(employeeemail);
  //   } catch (error) {
  //     console.log("Employee fetch error:", error);
  //   }
  // };

  const fetchEmployeeList = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/employees/all-users`, {
        params: {
          userId: currentUser?._id,
          type: currentUser?.superUser ? "superAdmin" : currentUser?.type,
        },
        withCredentials: true,
      });

      // Filter out current user
      const filtered = response.data.data;
      // .filter(
      //   (val) => val._id !== currentUser?._id
      // );

      // Group by type
      const grouped = filtered.reduce((acc, emp) => {
        if (!acc[emp.type]) acc[emp.type] = [];
        acc[emp.type].push({
          label: emp.name,
          value: emp._id,
        });
        return acc;
      }, {});

      // // Transform into array of groups for MultiSelect
      // const groupArray = Object.keys(grouped).map((key) => ({
      //   label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize
      //   items: grouped[key],
      // }));
      const ORDER = ["employee", "admin", "client", "clientSubUser"];

      // 3️⃣ Convert to PrimeReact MultiSelect group format
      const groupArray = ORDER.filter((type) => grouped[type]) // keep only existing types
        .map((type) => ({
          label:
            type === "clientSubUser"
              ? "Client Sub User"
              : type.charAt(0).toUpperCase() + type.slice(1),
          items: grouped[type].sort((a, b) => a.label.localeCompare(b.label)),
        }));

      setEmployeeOption(groupArray);
    } catch (error) {
      console.error(error);
    }
  };

  /* ------------------------------------------------ */
  /*  UPDATE CHANNEL */
  /* ------------------------------------------------ */

  const handleUpdate = async () => {
    if (!name.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Channel name required",
      });
    }

    try {
      Swal.fire({
        title: "Updating...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      let members = selectedEmployeeDetails;

      //  auto select for general
      if (channelType === "general") {
        members = employeeOption
          .filter(
            (group) =>
              group.label.toLowerCase() === "employee" ||
              group.label.toLowerCase() === "admin",
          )
          .flatMap((group) => group.items.map((item) => item.value));
      }

      const res = await axios.put(
        `${API_URL}/api/channel/update-channel/${channel._id}`,
        {
          name,
          members: members, //  already IDs
          channelType: channelType,
        },
      );

      if (res.data.success) {
        //       setChaneel((prev) =>
        //   prev.map((ch) =>
        //     ch._id === channel._id
        //       ? {
        //           ...ch, // keep existing fields
        //           name,
        //           members: selectedEmployeeDetails,
        //         }
        //       : ch
        //   )
        // );
        setChannelRefresh((prev) => !prev);
        Swal.fire({
          icon: "success",
          title: "Channel Updated!",
          timer: 1500,
          showConfirmButton: false,
        });
        onClose();
      }
    } catch (err) {
      console.log("update error", err);

      //  Duplicate name check
      if (err?.response?.data?.message?.includes("E11000")) {
        Swal.fire({
          icon: "error",
          title: "Duplicate Channel",
          text: "Channel name already exists.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "Something went wrong.",
        });
      }
    }
  };

  /* ------------------------------------------------ */

  if (!channel) return null; //  Prevent crash

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 w-[100vw]">
      <div className="bg-white rounded-xl w-96 p-6 shadow-xl">
        <h2 className="text-lg font-bold mb-4">Edit Channel</h2>

        {/* Channel Name */}

        <label
          htmlFor="employee_name"
          className="block text-sm font-medium mb-2"
        >
          Channel Name
        </label>
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Channel name"
        />
        {console.log("selectedEmployeeDetails", selectedEmployeeDetails)}
        {/* MultiSelect */}
        {/* <MultiSelect
          value={selectedEmployeeDetails} // ✅ ["id1","id2"]
          onChange={(e) =>
            setSelectedEmployeeDetails(e.value)
          }
          options={employeeOption}
          optionLabel="label"
          optionValue="value"
          filter
          placeholder="Select Employees"
          className="w-full border border-gray-300 rounded-lg"
          display="chip"
        /> */}
        {/* <MultiSelect
          value={selectedEmployeeDetails}
          onChange={(e) => setSelectedEmployeeDetails(e.value)}
          options={employeeOption}
          optionLabel="label"
          optionValue="value" // ⭐ THIS IS THE FIX
          filter
          placeholder="Select Employees"
          // maxSelectedLabels={3}
          className="w-full border border-gray-300 rounded-lg"
          display="chip"
        /> */}

        <div>
          <label
            htmlFor="employee_name"
            className="block text-sm font-medium mb-2"
          >
            Channel type
          </label>

          <select
            value={channelType || ""}
            onChange={(e) => setChaneelType(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4"
          >
            <option value="" disabled hidden>
              Select Type
            </option>
            <option value="private">Private</option>
            <option value="general">General</option>
          </select>
        </div>

        {channelType !== "general" && (
          <div>
            <label
              htmlFor="employee_name"
              className="block text-sm font-medium mb-2"
            >
              Channel Member
            </label>

            <MultiSelect
              value={selectedEmployeeDetails}
              onChange={(e) => setSelectedEmployeeDetails(e.value)}
              options={employeeOption}
              optionGroupLabel="label" // Heading
              optionGroupChildren="items" // Items under heading
              filter
              placeholder="Select Employees"
              display="chip"
              className="w-full border border-gray-300 rounded-lg"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  open,
  onToggle,
  rightAction,
  currentUser,
  icon: LeftIcon,
}) {
  return (
    <div
      onClick={onToggle}
      className="
        sticky top-0 z-30
        bg-white
        group
        flex items-center justify-between
        px-4  mx-2 mt-1
        rounded-lg
        cursor-pointer
        transition-all
        hover:bg-slate-100
      "
    >
      <div className="flex items-center gap-2">
        {LeftIcon && <LeftIcon size={16} className="text-slate-500" />}

        <span className="text-sm font-medium text-slate-700">{title}</span>

        <ChevronRight
          size={14}
          className={`text-slate-400 transition-transform ${open ? "rotate-90" : ""}`}
        />
      </div>

      {currentUser?.superUser && rightAction && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 transition"
        >
          {rightAction}
        </div>
      )}
    </div>
  );
}

/* ---------------- MAIN SIDEBAR ---------------- */
// export default function SlackSidebar({
//   users = [],
//   channels = [],
//   selectedUser,
//   selectedChannel,
//   onSelectUser,
//   onSelectChannel,
//   unread = {},
//   onlineUsers = [],
//   onCreateChannel,
//   currentUser,
//   setChannelUnread,
//   channelUnread,
//    favorites,
//   setFavorites,
// }) {
//   console.log("channels in sidebar", channels,"channelUnread",channelUnread);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filter, setFilter] = useState("all");

//   const [dmOpen, setDmOpen] = useState(true);
//   const [channelOpen, setChannelOpen] = useState(true);
//   const [showChannelModal, setShowChannelModal] = useState(false);

//   /* ---------------- FILTER USERS ---------------- */
//   const filteredUsers = users.filter((u) => {
//     const match = u.name.toLowerCase().includes(searchTerm.toLowerCase());

//     if (filter === "online") return match && onlineUsers.includes(u._id);
//     if (filter === "unread") return match && unread[u._id] > 0;
//     return match;
//   });

//   /* ---------------- COUNT CHANNEL UNREAD ---------------- */
// //  const openChannel = (channel) => {
// //   onSelectChannel(channel);

// //   // Clear unread locally
// //   setChannelUnread((prev) => ({
// //     ...prev,
// //     [channel._id]: 0,
// //   }));

// //   // 🔥 Inform backend (THIS WAS BROKEN)
// //   socket.emit("channel_seen", {
// //     channelId: channel._id,
// //     userId: currentUser._id,
// //   });
// // };
// const openChannel = (channel) => {
//   onSelectChannel(channel);

//   // JOIN FIRST
//   socket.emit("join_channel", {
//     channelId: channel._id,
//   });

//   // clear locally
//   setChannelUnread((prev) => ({
//     ...prev,
//     [channel._id]: 0,
//   }));

//   // MARK SEEN
//   socket.emit("channel_seen", {
//     channelId: channel._id,
//     userId: currentUser._id,
//   });
// };

// const toggleFavoriteDM = async (dmId) => {
//   const res = await axios.post(`${API_URL}/api/favorites/dm`, {
//     userId: currentUser._id,
//     dmId,
//   });

//   if (res.data.success) {
//     setFavorites(res.data.data);
//   }
// };

// const toggleFavoriteChannel = async (channelId) => {
//   const res = await axios.post(`${API_URL}/api/favorites/channel`, {
//     userId: currentUser._id,
//     channelId,
//   });

//   if (res.data.success) {
//     setFavorites(res.data.data);
//   }
// };

//   return (
//     <div className="w-80 h-screen flex flex-col border-r bg-white">
//       {/* ---------------- HEADER ---------------- */}
//       <div className="p-4 border-b">
//         <h2 className="text-xl font-bold mb-3">Messages</h2>

//         <input
//           className="w-full px-3 py-2 rounded bg-gray-100 mb-3"
//           placeholder="Search..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />

//         <div className="flex gap-2">
//           {["all", "online", "unread"].map((f) => (
//             <button
//               key={f}
//               onClick={() => setFilter(f)}
//               className={`px-3 py-1 rounded-full text-sm ${
//                 filter === f ? "bg-purple-600 text-white" : "bg-gray-100"
//               }`}
//             >
//               {f}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ---------------- SCROLL AREA ---------------- */}
//       <div className="flex-1 overflow-y-auto">
//         {/* -------- DIRECT MESSAGES -------- */}
//         <SectionHeader
//           title="Direct Messages"
//           open={dmOpen}
//           onToggle={() => setDmOpen((p) => !p)}
//         />

//         {dmOpen &&
//           filteredUsers.map((user) => (
//             <div
//               key={user._id}
//               onClick={() => onSelectUser(user)}
//               className={`mx-3 my-1 p-3 rounded-lg cursor-pointer flex justify-between items-center ${
//                 selectedUser?._id === user._id
//                   ? "bg-purple-100"
//                   : "hover:bg-gray-100"
//               }`}
//             >
//               <div className="flex items-center gap-2">
//                 <span
//                   className={`w-2 h-2 rounded-full ${
//                     onlineUsers.includes(user._id)
//                       ? "bg-green-500"
//                       : "bg-gray-400"
//                   }`}
//                 />
//                 <span>{user.name}</span>
//               </div>

//               {unread[user._id] > 0 && (
//                 <span className="bg-red-500 text-white text-xs px-2 rounded-full">
//                   {unread[user._id]}
//                 </span>
//               )}
//             </div>
//           ))}

//         {/* -------- CHANNELS -------- */}
//         <SectionHeader
//           title="Channels"
//           open={channelOpen}
//           onToggle={() => setChannelOpen((p) => !p)}
//           rightAction={
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setShowChannelModal(true);
//               }}
//               className="text-xl"
//             >
//               +
//             </button>
//           }
//         />

//         {channelOpen &&
//           // channels.map((ch) => (
//           //   <div
//           //     key={ch._id}
//           //     onClick={() => onSelectChannel(ch)}
//           //     className={`mx-3 my-1 p-3 rounded-lg cursor-pointer ${
//           //       selectedChannel?._id === ch._id
//           //         ? "bg-blue-100"
//           //         : "hover:bg-gray-100"
//           //     }`}
//           //   >
//           //     # {ch?.name}
//           //   </div>
//           // ))
//           channels.map((ch) => (
//   <div
//     key={ch._id}
//     onClick={() => openChannel(ch)}
//     className={`mx-3 my-1 p-3 rounded-lg cursor-pointer flex justify-between items-center
//       ${
//         selectedChannel?._id === ch._id
//           ? "bg-blue-100"
//           : "hover:bg-gray-100"
//       }`}
//   >
//     <span># {ch.name}</span>

//     {channelUnread && channelUnread[ch?._id] > 0 && (
//       <span className="bg-red-500 text-white text-xs px-2 rounded-full">
//         {channelUnread[ch._id]}
//       </span>
//     )}
//   </div>
// ))}

//       </div>

//       {/* ---------------- FOOTER ---------------- */}
//       <div className="p-4 border-t text-sm text-gray-500">
//         Online users: {onlineUsers.length}
//       </div>

//       {/* ---------------- MODAL ---------------- */}
//       {showChannelModal && (
//         <CreateChannelModal
//           onClose={() => setShowChannelModal(false)}
//           onCreate={onCreateChannel}
//           currentUser={currentUser}
//         />
//       )}
//     </div>
//   );
// }

// export default function SlackSidebar({
//   socket,
//   users = [],
//   channels = [],
//   favorites = { dm: [], channels: [] },
//   setFavorites,
//   selectedUser,
//   selectedChannel,
//   onSelectUser,
//   onSelectChannel,
//   unread = {},
//   onlineUsers = [],
//   currentUser,
//   channelUnread = {},
//   setChannelUnread,
//   setChaneel={setChaneel},

// }) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filter, setFilter] = useState("all");
//   const [dmOpen, setDmOpen] = useState(true);
//   const [channelOpen, setChannelOpen] = useState(true);
//    const [showChannelModal, setShowChannelModal] = useState(false);

//   /* ---------------- FILTER USERS ---------------- */
//   const filteredUsers = users.filter((u) => {
//     const match = u.name.toLowerCase().includes(searchTerm.toLowerCase());
//     if (filter === "online") return match && onlineUsers.includes(u._id);
//     if (filter === "unread") return match && unread[u._id] > 0;
//     return match;
//   });

//   /* ---------------- OPEN CHANNEL ---------------- */
//   const openChannel = (channel) => {
//     onSelectChannel(channel);

//     socket.emit("join_channel", { channelId: channel._id });

//     setChannelUnread((prev) => ({
//       ...prev,
//       [channel._id]: 0,
//     }));

//     socket.emit("channel_seen", {
//       channelId: channel._id,
//       userId: currentUser._id,
//     });
//   };

//   /* ---------------- FAVORITES ---------------- */
//   const toggleFavoriteDM = async (dmId) => {
//   const res = await axios.post(`${API_URL}/api/favorites/dm`, {
//     userId: currentUser._id,
//     dmId,
//   });

//   if (res.data.success) {
//     setFavorites(res.data.data); // ✅ FULL populated object
//   }
// };

//   const toggleFavoriteChannel = async (channelId) => {
//   const res = await axios.post(`${API_URL}/api/favorites/channel`, {
//     userId: currentUser._id,
//     channelId,
//   });

//   if (res.data.success) {
//     setFavorites(res.data.data); // ✅ FULL populated object
//   }
// };

//   return (
//     <div className="w-80 h-screen flex flex-col border-r bg-white">
//       {/* ---------------- HEADER ---------------- */}
//       <div className="p-4 border-b">
//         <h2 className="text-xl font-bold mb-3">Messages</h2>

//         <input
//           className="w-full px-3 py-2 rounded bg-gray-100 mb-3"
//           placeholder="Search..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />

//         <div className="flex gap-2">
//           {["all", "online", "unread"].map((f) => (
//             <button
//               key={f}
//               onClick={() => setFilter(f)}
//               className={`px-3 py-1 rounded-full text-sm ${
//                 filter === f ? "bg-purple-600 text-white" : "bg-gray-100"
//               }`}
//             >
//               {f}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ---------------- BODY ---------------- */}
//       <div className="flex-1 overflow-y-auto">

//         {/* ⭐ FAVORITES */}
//         {(favorites.dm.length > 0 || favorites.channels.length > 0) && (
//           <>
//             <SectionHeader title="Favorites" open />
//             {favorites.channels.length && favorites.channels.map((ch) => (
//               <div
//                 key={ch._id}
//                 onClick={() => openChannel(ch)}
//                 className="mx-3 my-1 p-3 rounded-lg cursor-pointer hover:bg-yellow-100"
//               >
//                 ⭐ # {ch.name}
//               </div>
//             ))}
//             {favorites.dm.length && favorites.dm.map((u) => (
//               <div
//                 key={u._id}
//                 onClick={() => onSelectUser(u)}
//                 className="mx-3 my-1 p-3 rounded-lg cursor-pointer hover:bg-yellow-100"
//               >
//                 ⭐ {u.employeeName}
//               </div>
//             ))}
//           </>
//         )}

//         {/* 💬 DIRECT MESSAGES */}
//         <SectionHeader
//           title="Direct Messages"
//           open={dmOpen}
//           onToggle={() => setDmOpen((p) => !p)}
//         />

//         {dmOpen &&
//           Array.isArray(filteredUsers)  &&filteredUsers.map((u) => (
//             <div
//               key={u._id}
//               onClick={() => onSelectUser(u)}
//               className={`mx-3 my-1 p-3 rounded-lg cursor-pointer flex justify-between items-center ${
//                 selectedUser?._id === u._id
//                   ? "bg-purple-100"
//                   : "hover:bg-gray-100"
//               }`}
//             >
//               <div className="flex items-center gap-2">
//                 <span
//                   className={`w-2 h-2 rounded-full ${
//                     onlineUsers.includes(u._id)
//                       ? "bg-green-500"
//                       : "bg-gray-400"
//                   }`}
//                 />
//                 <span>{u.name}</span>
//               </div>

//               <div className="flex items-center gap-2">
//                 {unread[u._id] > 0 && (
//                   <span className="bg-red-500 text-white text-xs px-2 rounded-full">
//                     {unread[u._id]}
//                   </span>
//                 )}
//                 <span
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleFavoriteDM(u._id);
//                   }}
//                 >
//                   {favorites.dm.some((f) => f._id === u._id) ? "⭐" : "☆"}
//                 </span>
//               </div>
//             </div>
//           ))}

//         {/* #️⃣ CHANNELS */}
//         <SectionHeader
//           title="Channels"
//           open={channelOpen}
//           onToggle={() => setChannelOpen((p) => !p)}
//         />

//         {channelOpen &&
//           channels.map((ch) => (
//             <div
//               key={ch._id}
//               onClick={() => openChannel(ch)}
//               className={`mx-3 my-1 p-3 rounded-lg cursor-pointer flex justify-between items-center ${
//                 selectedChannel?._id === ch._id
//                   ? "bg-blue-100"
//                   : "hover:bg-gray-100"
//               }`}
//             >
//               <span># {ch.name}</span>

//               <div className="flex items-center gap-2">
//                 {channelUnread[ch._id] > 0 && (
//                   <span className="bg-red-500 text-white text-xs px-2 rounded-full">
//                     {channelUnread[ch._id]}
//                   </span>
//                 )}
//                 <span
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleFavoriteChannel(ch._id);
//                   }}
//                 >
//                   {favorites.channels.some((f) => f._id === ch._id)
//                     ? "⭐"
//                     : "☆"}
//                 </span>
//               </div>
//             </div>
//           ))}
//       </div>
//       {/* ---------------- MODAL ---------------- */}
//       {showChannelModal && (
//         <CreateChannelModal
//           onClose={() => setShowChannelModal(false)}
//           onCreate={onCreateChannel}
//           currentUser={currentUser}
//         />
//       )}

//       {/* ---------------- FOOTER ---------------- */}
//       <div className="p-4 border-t text-sm text-gray-500">
//         Online users: {onlineUsers.length}
//       </div>
//     </div>
//   );
// }

// export default function SlackSidebar({
//   socket,
//   users = [],
//   channels = [],
//   setChaneel = { setChaneel },
//   favorites = { dm: [], channels: [] },
//   setFavorites,
//   selectedUser,
//   selectedChannel,
//   onSelectUser,
//   onSelectChannel,
//   unread = {},
//   onlineUsers = [],
//   currentUser,
//   channelUnread = {},
//   setChannelUnread,
//   onCreateChannel,
// }) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filter, setFilter] = useState("all");
//   const [dmOpen, setDmOpen] = useState(true);
//   const [favoritesOpen, setFavoritesOpen] = useState(false);
//   const [channelOpen, setChannelOpen] = useState(false);
//   const [showChannelModal, setShowChannelModal] = useState(false);
//   users=[...users,...channels,...favorites.dm,...favorites.channels];
//   console.log("onlineUsers", onlineUsers, users);
//   // helper function
//   const isOnline = (id) => onlineUsers.includes(String(id));

//   /* ---------------- FILTER USERS ---------------- */
//   const filteredUsers = users.filter((u) => {
//     const name = u.name || "";
//     const match = name.toLowerCase().includes(searchTerm.toLowerCase());

//     if (filter === "online")
//       return match && onlineUsers.includes(String(u?._id));
//     if (filter === "unread") return match && unread[u._id] > 0;

//     return match;
//   });

//   /* ---------------- OPEN CHANNEL ---------------- */
//   const openChannel = (channel) => {
//     onSelectChannel(channel);

//     socket.emit("join_channel", { channelId: channel._id });

//     setChannelUnread((prev) => ({
//       ...prev,
//       [channel._id]: 0,
//     }));

//     socket.emit("channel_seen", {
//       channelId: channel._id,
//       userId: currentUser._id,
//     });
//   };

//   /* ---------------- FAVORITES API ---------------- */
//   const toggleFavoriteDM = async (user) => {
//     const res = await axios.post(`${API_URL}/api/favorites/dm`, {
//       userId: currentUser?._id,
//       userModel:
//         currentUser?.type == "employee"
//           ? "Employee"
//           : currentUser?.type == "admin"
//             ? "AdminUser"
//             : currentUser?.type == "client"
//               ? "ClientDetails"
//               : "ClientSubUser", // Employee | User | Client
//       dmId: user._id,
//       dmModel:
//         user.type == "employee"
//           ? "Employee"
//           : user.type == "admin"
//             ? "AdminUser"
//             : user?.type == "client"
//               ? "ClientDetails"
//               : "ClientSubUser",
//     });

//     if (res.data.success) {
//       setFavorites(res.data.data);
//     }
//   };

//   const toggleFavoriteChannel = async (channel) => {
//     const res = await axios.post(`${API_URL}/api/favorites/channel`, {
//       userId: currentUser._id,
//       userModel:
//         currentUser?.type == "employee"
//           ? "Employee"
//           : currentUser?.type == "admin"
//             ? "AdminUser"
//             : "ClientDetails",
//       channelId: channel._id,
//       channelModel: "Channel",
//     });

//     if (res.data.success) {
//       setFavorites(res.data.data);
//     }
//   };

//   /* ---------------- HELPERS ---------------- */
//   const isDMFavorite = (id) => favorites.dm.some((f) => f._id === id);

//   const isChannelFavorite = (id) =>
//     favorites.channels.some((f) => f._id === id);

//   return (
//     <div className="w-80 h-screen flex flex-col border-r bg-white">
//       {/* ---------------- HEADER ---------------- */}
//       <div className="p-4 border-b">
//         <h2 className="text-xl font-bold mb-3">Messages</h2>

//         <input
//           className="w-full px-3 py-2 rounded bg-gray-100 mb-3"
//           placeholder="Search..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />

//         <div className="flex gap-2">
//           {["all", "online"].map((f) => (
//             <button
//               key={f}
//               onClick={() => setFilter(f)}
//               className={`px-3 py-1 rounded-full text-sm ${
//                 filter === f ? "bg-purple-600 text-white" : "bg-gray-100"
//               }`}
//             >
//               {f}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ---------------- BODY ---------------- */}
//       <div className="flex-1 overflow-y-auto">
//         <SectionHeader
//           title="Favorites"
//           open={favoritesOpen}
//           onToggle={() => setFavoritesOpen((p) => !p)}
//         />
//         {/* ⭐ FAVORITES */}

//         {favoritesOpen &&
//           (favorites.dm.length > 0 || favorites.channels.length > 0) && (
//             <>
//               {/* Favorite Channels */}
//               {favorites.channels.map((ch) => (
//                 <div
//                   key={ch._id}
//                   onClick={() => openChannel(ch)}
//                   className="mx-3 my-1 p-3 rounded-lg cursor-pointer hover:bg-yellow-100 flex justify-between items-center"
//                 >
//                   ⭐ # {ch.name}
//                   <div className="flex items-center gap-2">
//                     {channelUnread[ch._id] > 0 && (
//                       <span className="bg-red-500 text-white text-xs px-2 rounded-full">
//                         {channelUnread[ch._id]}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               ))}

//               {/* Favorite DMs */}
//               {favorites.dm.map((u) => (
//                 <div
//                   key={u._id}
//                   onClick={() => onSelectUser(u)}
//                   className="mx-3 my-1 p-3 rounded-lg cursor-pointer hover:bg-yellow-100 flex justify-between items-center"
//                 >
//                   ⭐ {u.name}
//                   <div>
//                     {unread[u._id] > 0 && (
//                       <span className="bg-red-500 text-white text-xs px-2 rounded-full">
//                         {unread[u._id]}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </>
//           )}

//         {/* #️⃣ CHANNELS */}
//         {/* <SectionHeader
//           title="Channels"
//           open={channelOpen}
//           onToggle={() => setChannelOpen((p) => !p)}
//         /> */}
//         <SectionHeader
//           title="Channels"
//           open={channelOpen}
//           onToggle={() => setChannelOpen((p) => !p)}
//           currentUser={currentUser}
//           rightAction={
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setShowChannelModal(true);
//               }}
//               className="text-xl"
//             >
//               +
//             </button>
//           }
//         />

//         {channelOpen &&
//           channels.map((ch) => (
//             <div
//               key={ch._id}
//               onClick={() => openChannel(ch)}
//               className={`mx-3 my-1 p-3 rounded-lg cursor-pointer flex justify-between items-center ${
//                 selectedChannel?._id === ch._id
//                   ? "bg-blue-100"
//                   : "hover:bg-gray-100"
//               }`}
//             >
//               <span># {ch.name}</span>

//               <div className="flex items-center gap-2">
//                 {channelUnread[ch._id] > 0 && (
//                   <span className="bg-red-500 text-white text-xs px-2 rounded-full">
//                     {channelUnread[ch._id]}
//                   </span>
//                 )}

//                 <span
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleFavoriteChannel(ch);
//                   }}
//                 >
//                   {isChannelFavorite(ch._id) ? "⭐" : "☆"}
//                 </span>
//               </div>
//             </div>
//           ))}

//         {/* 💬 DIRECT MESSAGES */}
//         <SectionHeader
//           title="Direct Messages"
//           open={dmOpen}
//           onToggle={() => setDmOpen((p) => !p)}
//         />

//         {/* {dmOpen &&
//           filteredUsers.map((u) => ( */}
//         {dmOpen &&
//           [...filteredUsers]
//             .sort((a, b) => {
//               const aOnline = isOnline(a._id);
//               const bOnline = isOnline(b._id);

//               // 🟢 Online users first
//               if (aOnline && !bOnline) return -1;
//               if (!aOnline && bOnline) return 1;

//               // 🔔 More unread messages first
//               const aUnread = unread[a._id] || 0;
//               const bUnread = unread[b._id] || 0;
//               if (aUnread !== bUnread) return bUnread - aUnread;

//               // 🔤 Optional: alphabetical
//               return a.name.localeCompare(b.name);
//             })
//             .map((u) => (
//               <div className="py-3">
//                 <div
//                   key={u._id}
//                   onClick={() => onSelectUser(u)}
//                   className={`mx-3 my-1 p-2 rounded-lg cursor-pointer flex justify-between items-center ${
//                     selectedUser?._id === u._id
//                       ? "bg-purple-100"
//                       : "hover:bg-gray-100"
//                   }`}
//                 >
//                   <div className="flex items-center gap-2">
//                     {console.log(
//                       "onlineUsers.includes(String(u._id))",
//                       onlineUsers.includes(String(u._id)),
//                       onlineUsers,
//                       u._id,
//                     )}
//                     <span
//                       className={`w-2 h-2 rounded-full ${
//                         onlineUsers.includes(String(u._id))
//                           ? "bg-green-500"
//                           : "bg-gray-400"
//                       }`}
//                     />
//                     <span>{u.name}</span>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     {unread[u._id] > 0 && (
//                       <span className="bg-red-500 text-white text-xs px-2 rounded-full">
//                         {unread[u._id]}
//                       </span>
//                     )}

//                     <span
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         toggleFavoriteDM(u);
//                       }}
//                     >
//                       {isDMFavorite(u._id) ? "⭐" : "☆"}
//                     </span>
//                   </div>
//                 </div>
//                 <div>
//                   <p className="mx-5  text-blue-600">{u?.type}</p>
//                 </div>
//               </div>
//             ))}
//       </div>

//       {/* ---------------- FOOTER ---------------- */}
//       <div className="p-4 border-t text-sm text-gray-500">
//         Online users: {onlineUsers.length}
//       </div>
//       {showChannelModal && (
//         <CreateChannelModal
//           onClose={() => setShowChannelModal(false)}
//           onCreate={onCreateChannel}
//           currentUser={currentUser}
//           setChaneel={setChaneel}
//           socket={socket}
//         />
//       )}
//     </div>
//   );
// }

export default function SlackSidebar({
  socket,
  users = [],
  channels = [],
  setChaneel = { setChaneel },
  favorites = { dm: [], channels: [] },
  setFavorites,
  selectedUser,
  selectedChannel,
  onSelectUser,
  onSelectChannel,
  unread = {},
  onlineUsers = [],
  currentUser,
  channelUnread = {},
  setChannelUnread,
  onCreateChannel,
  setChannelRefresh,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [dmOpen, setDmOpen] = useState(true);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [channelOpen, setChannelOpen] = useState(false);
  const [showChannelModal, setShowChannelModal] = useState(false);
  // edit channels and users array to single array
  const [editChannel, setEditChannel] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // redux dispatch
  const dispatch = useDispatch();

  console.log("onlineUsers", onlineUsers, users);
  // helper function
  const isOnline = (id) => onlineUsers.includes(String(id));
  console.log("after create channel selected ", channels);

  /* ---------------- FILTER USERS ---------------- */
  const filteredUsers = users.filter((u) => {
    const name = u.name || "";
    const match = name.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "online")
      return match && onlineUsers.includes(String(u?._id));
    if (filter === "unread") return match && unread[u._id] > 0;
    return match;
  });

  console.log("filteredUsers", filteredUsers);

  // filter channels based on search term
  const filteredChannels = channels.filter((ch) => {
    const name = ch.name || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  // FILTER FAVORITE CHANNELS AND DMS
  const favoriteDMs = favorites.dm.filter((dm) => {
    const match = (dm.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (filter === "online") {
      return match && onlineUsers.includes(String(dm?._id));
    }

    if (filter === "unread") {
      return match && unread[dm._id] > 0;
    }
    return match;
  });

  const favoriteChannels = favorites.channels.filter((ch) =>
    (ch.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );
  /* ---------------- OPEN CHANNEL ---------------- */
  const openChannel = (channel) => {
    // onSelectChannel(channel);
    dispatch(setSelectedUser(null)); // close DM
    dispatch(setSelectedChannel(channel)); // set active channel

    dispatch(clearChannel(channel._id)); // clear unread

    onSelectChannel(channel); // UI / API logic

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

  /* ---------------- FAVORITES API ---------------- */
  const toggleFavoriteDM = async (user) => {
    const res = await axios.post(`${API_URL}/api/favorites/dm`, {
      userId: currentUser?._id,
      userModel:
        currentUser?.type == "employee"
          ? "Employee"
          : currentUser?.type == "admin"
            ? "AdminUser"
            : "ClientDetails", // Employee | User | Client
      dmId: user._id,
      // dmModel:
      //   user.type == "employee"
      //     ? "Employee"
      //     : user.type == "admin"
      //     ? "AdminUser"
      //     : "ClientDetails",
      dmModel:
        user.type == "employee"
          ? "Employee"
          : user.type == "admin"
            ? "AdminUser"
            : user?.type == "client"
              ? "ClientDetails"
              : "ClientSubUser",
    });

    if (res.data.success) {
      setFavorites(res.data.data);
    }
  };

  const toggleFavoriteChannel = async (channel) => {
    const res = await axios.post(`${API_URL}/api/favorites/channel`, {
      userId: currentUser._id,
      userModel:
        currentUser?.type == "employee"
          ? "Employee"
          : currentUser?.type == "admin"
            ? "AdminUser"
            : "ClientDetails",
      channelId: channel._id,
      channelModel: "Channel",
    });

    if (res.data.success) {
      setFavorites(res.data.data);
    }
  };

  console.log("favorites 1233", favorites);
  /* ---------------- HELPERS ---------------- */
  const isDMFavorite = (id) => favorites.dm.some((f) => f._id === id);

  const isChannelFavorite = (id) =>
    favorites.channels.some((f) => f._id === id);

  // Dm Lable
  const DM_GROUPS = [
    { key: "admin", label: "Admin" },
    { key: "employee", label: "Employee" },
    { key: "client", label: "Client" },
    { key: "clientSubUser", label: "Client Sub User" },
  ];

  // Accordion state

  const [openGroups, setOpenGroups] = useState({
    admin: false,
    employee: false,
    client: false,
    client_sub_user: false,
  });

  const toggleGroup = (key) => {
    setOpenGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // // helper function to sort users
  // const sortUsers = (a, b) => {
  //   const aOnline = isOnline(a._id);
  //   const bOnline = isOnline(b._id);

  //   if (aOnline && !bOnline) return -1;
  //   if (!aOnline && bOnline) return 1;

  //   const aUnread = unread[a._id] || 0;
  //   const bUnread = unread[b._id] || 0;
  //   if (aUnread !== bUnread) return bUnread - aUnread;

  //   return a.name.localeCompare(b.name);
  // };
  const sortUsers = (a, b) => {
    const aOnline = isOnline(a._id);
    const bOnline = isOnline(b._id);

    if (aOnline && !bOnline) return -1;
    if (!aOnline && bOnline) return 1;

    const aUnread = unread[a._id] || 0;
    const bUnread = unread[b._id] || 0;
    if (aUnread !== bUnread) return bUnread - aUnread;

    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  };

  // Group users by type
  const groupedUsers = DM_GROUPS.map((group) => ({
    ...group,
    users: filteredUsers.filter((u) => u.type === group.key).sort(sortUsers),
  }));
  // edit channel handler

  const handleEditChannel = (channel) => {
    console.log("Editing channel:", channel);
    setEditChannel(channel);
    setShowEditModal(true);
  };

  // delete channel handler
  // const handleDeleteChannel = async (id) => {
  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to delete this channel?",
  //   );

  //   if (!confirmDelete) return;

  //   try {
  //     await axios.delete(`${API_URL}/api/channel/${id}`);

  //     setChaneel((prev) => prev.filter((ch) => ch._id !== id));
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const handleDeleteChannel = async (id) => {
    const result = await Swal.fire({
      title: "Delete Channel?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_URL}/api/channel/${id}`);

      setChaneel((prev) => prev.filter((ch) => ch._id !== id));

      // ✅ Success alert
      Swal.fire({
        title: "Deleted!",
        text: "Channel has been deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.log(err);

      Swal.fire({
        title: "Error!",
        text: "Failed to delete channel.",
        icon: "error",
      });
    }
  };

  // total unread count for channels
  const totalChannelUnread = filteredChannels.reduce((total, ch) => {
    return total + (channelUnread[ch._id] || 0);
  }, 0);

  // total unread count for DMs
  const favoriteChannelUnread = favoriteChannels.reduce((total, ch) => {
    return total + (channelUnread[ch._id] || 0);
  }, 0);

  const favoriteDMUnread = favoriteDMs.reduce((total, u) => {
    return total + (unread[u._id] || 0);
  }, 0);

  const totalFavoritesUnread = favoriteChannelUnread + favoriteDMUnread;

  return (
    <div className="w-full h-screen flex flex-col border-r bg-white rounded-md overflow-hidden scrollbar-hide">
      {/* ---------------- HEADER ---------------- */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold mb-3">Messages</h2>

        <input
          className="w-full px-3 py-2 rounded bg-gray-100 mb-3 border border-gray-300"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2">
          {["all", "online"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === f ? " bg-indigo-500 text-white" : "bg-gray-100"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ---------------- BODY ---------------- */}
      <div className="flex-1 overflow-y-auto">
        {/* <SectionHeader
          title="Favorites"
          open={favoritesOpen}
          onToggle={() => setFavoritesOpen((p) => !p)}
        /> */}
        <SectionHeader
          title={
            <div className="flex items-center gap-2">
              <span>Favorites</span>

              {totalFavoritesUnread > 0 && (
                <span className="bg-purple-700 text-white text-xs px-2 rounded-full">
                  {totalFavoritesUnread}
                </span>
              )}
            </div>
          }
          icon={Star}
          open={favoritesOpen}
          onToggle={() => setFavoritesOpen((p) => !p)}
        />
        {/* ⭐ FAVORITES */}
        <div className="overflow-y-scroll scroll px-5 max-h-[50%] p-1 scrollbar-hide  border-b ">
          {favoritesOpen &&
            (favoriteDMs.length > 0 || favoriteChannels.length > 0) && (
              <>
                {/* Favorite Channels */}
                {[...favoriteChannels]
                  .sort((a, b) => {
                    const aUnread = channelUnread[a._id] || 0;
                    const bUnread = channelUnread[b._id] || 0;

                    if (aUnread !== bUnread) {
                      return bUnread - aUnread;
                    }

                    return a.name.localeCompare(b.name, undefined, {
                      sensitivity: "base",
                    });
                  })
                  .map((ch) => (
                    <div
                      key={`fav-channel-${ch._id}`}
                      onClick={() => openChannel(ch)}
                      className="mx-3 my-1  rounded-lg cursor-pointer hover:bg-yellow-100 text-sm flex justify-between items-center"
                    >
                      <div>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavoriteChannel(ch);
                          }}
                        >
                          {isChannelFavorite(ch._id) ? "⭐" : "☆"}
                        </span>
                        {/* #{ch?.name?.length > 6 ? ch?.name?.slice(0, 6) + "..." : ch?.name} */}
                        <span className="w-[180px] truncate"># {ch.name}</span>
                      </div>
                      <div className="">
                        {channelUnread[ch._id] > 0 && (
                          <span className="bg-purple-700 text-white text-xs px-2 rounded-full">
                            {channelUnread[ch._id]}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                {favoriteDMs.length > 0 && <hr />}
                {/* Favorite DMs */}
                {[...favoriteDMs]
                  .sort((a, b) => {
                    const aUnread = unread[a._id] || 0;
                    const bUnread = unread[b._id] || 0;

                    if (aUnread !== bUnread) {
                      return bUnread - aUnread; // higher unread first
                    }

                    return a.name.localeCompare(b.name, undefined, {
                      sensitivity: "base",
                    });
                  })
                  .map((u) => (
                    <div
                      key={`fav-dm-id-${u._id}`}
                      // onClick={() => onSelectUser(u)}
                      onClick={() => {
                        dispatch(setSelectedChannel(null)); // close channel
                        dispatch(setSelectedUser(u)); // set active DM
                        dispatch(clearDM(u._id)); // clear unread count
                        onSelectUser(u); // UI / API logic
                      }}
                      className="mx-3 my-1  rounded-lg cursor-pointer hover:bg-yellow-100 text-sm flex justify-between items-center"
                    >
                      <div>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavoriteDM(u);
                          }}
                        >
                          {isDMFavorite(u._id) ? "⭐" : "☆"}
                        </span>{" "}
                        {/* {u.name.length > 6 ? u.name.slice(0, 6) + "..." : u.name} */}
                        <span className="w-[180px] truncate">{u.name}</span>
                      </div>
                      <div>
                        {unread[u._id] > 0 && (
                          <span className="bg-purple-700 text-white text-xs px-2 rounded-full">
                            {unread[u._id]}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </>
            )}
        </div>

        {/* #️⃣ CHANNELS */}
        {/* <SectionHeader
          title="Channels"
          open={channelOpen}
          onToggle={() => setChannelOpen((p) => !p)}
        /> */}

        {/* <SectionHeader
          title="Channels"
          open={channelOpen}
          onToggle={() => setChannelOpen((p) => !p)}
          currentUser={currentUser}
          rightAction={
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowChannelModal(true);
              }}
              className="text-xl"
            >
              +
            </button>
          }
        /> */}
        <SectionHeader
          title={
            <div className="flex items-center justify-between gap-2">
              <span>Channels</span>

              {totalChannelUnread > 0 && (
                <span className="bg-purple-700 text-white text-xs px-2 rounded-full">
                  {totalChannelUnread}
                </span>
              )}
            </div>
          }
          icon={Hash}
          open={channelOpen}
          onToggle={() => setChannelOpen((p) => !p)}
          currentUser={currentUser}
          rightAction={
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowChannelModal(true);
              }}
              className="text-xl"
            >
              <Plus size={16} />
            </button>
          }
        />
        <div
          className={`overflow-scroll max-h-[50%] scrollbar-hide p-1  border-b `}
        >
          {channelOpen &&
            [...filteredChannels]
              .sort((a, b) => {
                const aUnread = channelUnread[a._id] || 0;
                const bUnread = channelUnread[b._id] || 0;

                if (aUnread !== bUnread) {
                  return bUnread - aUnread; // higher unread first
                }

                return a.name.localeCompare(b.name, undefined, {
                  sensitivity: "base",
                });
              })
              .map((ch) => (
                <div
                  key={`channel-${ch._id}`}
                  onClick={() => openChannel(ch)}
                  className={`mx-3 my-1 px-3 rounded-lg cursor-pointer flex justify-between items-center text-sm  ${
                    selectedChannel?._id === ch._id
                      ? "bg-blue-100"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex gap-2">
                    {ch.channelType == "private" ? (
                      <Lock className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <BsPeople className="w-4 h-4 text-green-500" />
                    )}
                    <span className="w-[180px] truncate"># {ch.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteChannel(ch);
                      }}
                    >
                      {isChannelFavorite(ch._id) ? "⭐" : "☆"}
                    </span>
                    {/* <span
                    className="text-blue-400 hover:text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditChannel(ch);
                    }}
                  >
                    <FiEdit size={14} />
                  </span>

                  <span>
                    <FiTrash2
                      size={14}
                      className="text-red-400 hover:text-red-600 cursor-pointer transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChannel(ch._id);
                      }}
                    />
                  </span> */}

                    {channelUnread[ch._id] > 0 && (
                      <span className="bg-purple-700 text-white text-xs px-2 rounded-full">
                        {channelUnread[ch._id]}
                      </span>
                    )}
                  </div>
                </div>
              ))}
        </div>

        {/* 💬 DIRECT MESSAGES */}
        <SectionHeader
          title="Direct Messages"
          open={dmOpen}
          onToggle={() => setDmOpen((p) => !p)}
          icon={MessageCircle}
        />

        {/* {dmOpen &&
          filteredUsers.map((u) => ( */}
        {dmOpen &&
          groupedUsers.map((group) => {
            const groupUnread = group.users.reduce((total, user) => {
              return total + (unread[user._id] || 0);
            }, 0);

            return (
              <div
                key={group.key}
                className={`mb-2 max-h-72 overflow-y-auto relative scrollbar-hide`}
              >
                {/* Accordion Header */}
                {/* <div
                onClick={() => toggleGroup(group.key)}
                className="px-4 py-2 cursor-pointer font-semibold hover:bg-slate-50 hover:rounded rounded-lg flex justify-between items-center position-striky"
              >
                <span>{group.label}</span>
                <span>{openGroups[group.key] ? "▾" : "▸"}</span>
              </div> */}
                {/* GROUP HEADER (STICKY) */}
                <div
                  onClick={() => toggleGroup(group.key)}
                  className="
          sticky top-0 z-20
          bg-white
          pl-5 pr-2 pt-1
          font-semibold
          flex justify-between items-center
          cursor-pointer
          border-b
          scrollbar-hide
        "
                >
                  <div className="flex items-center gap-2 text-sm">
                    <div>
                      <span>{group.label}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {groupUnread > 0 && (
                      <span className="bg-purple-700 text-white text-xs px-2 py-0.5 rounded-full">
                        {groupUnread}
                      </span>
                    )}
                    <span>{openGroups[group.key] ? "▾" : "▸"}</span>
                  </div>
                </div>

                {/* Accordion Body */}
                {openGroups[group.key] &&
                  group.users.map((u) => (
                    <div key={`dm-${u._id}`} className="my-1">
                      <div
                        onClick={() => {
                          dispatch(setSelectedChannel(null)); // close channel
                          dispatch(setSelectedUser(u)); // set active DM
                          dispatch(clearDM(u._id)); // clear unread count
                          onSelectUser(u); // UI / API logic
                        }}
                        className={`mx-3 rounded-lg cursor-pointer flex justify-between items-center text-sm   ${
                          selectedUser?._id === u._id
                            ? "bg-purple-100"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {/* <span
                          className={`w-2 h-2 rounded-full ${
                            isOnline(u._id) ? "bg-green-500" : "bg-gray-400"
                          }`}
                        /> */}
                          <div className="relative">
                            {u.photo ? (
                              <img
                                // src={u.photo}
                                src={`${API_URL}/api/uploads/employeesImages/${u.photo}`}
                                alt={u.name}
                                className="w-6 h-6 rounded-full object-contain border"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full  bg-indigo-500 text-white flex items-center justify-center text-xs font-semibold">
                                {u.name?.charAt(0).toUpperCase()}
                              </div>
                            )}

                            {/* Online indicator */}
                            <span
                              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                                isOnline(u._id) ? "bg-green-500" : "bg-gray-400"
                              }`}
                            />
                          </div>
                          {/* <span>
                            {u.name
  ? (u.name.length > 12
      ? u.name.slice(0, 12) + "..."
      : u.name
    ).charAt(0).toUpperCase() +
    (u.name.length > 12
      ? u.name.slice(0, 12) + "..."
      : u.name
    ).slice(1)
  : ""}
                            {u._id == currentUser._id && " ( You )"}
                          </span> */}
                          <span className="max-w-[200px] truncate block">
                            {u.name}
                            {u._id == currentUser._id && " ( You )"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 ">
                          {unread[u._id] > 0 && (
                            <span className="  bg-purple-700 text-white  text-xs px-2 rounded-full">
                              {unread[u._id]}
                            </span>
                          )}
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavoriteDM(u);
                            }}
                          >
                            {isDMFavorite(u._id) ? "⭐" : "☆"}
                          </span>
                        </div>
                      </div>

                      {/* <p className="mx-5 text-blue-600 text-xs">{u.type}</p> */}
                    </div>
                  ))}
              </div>
            );
          })}
      </div>

      {/* ---------------- FOOTER ---------------- */}
      <div className="p-4 border-t text-sm text-gray-500">
        Online users: {onlineUsers.length}
      </div>
      {showChannelModal && (
        <CreateChannelModal
          onClose={() => setShowChannelModal(false)}
          onCreate={onCreateChannel}
          currentUser={currentUser}
          setChaneel={setChaneel}
          socket={socket}
          setChannelRefresh={setChannelRefresh}
        />
      )}
      {showEditModal && (
        <EditChannelModal
          channel={editChannel}
          onClose={() => setShowEditModal(false)}
          currentUser={currentUser}
          setChaneel={setChaneel}
          socket={socket}
          setChannelRefresh={setChannelRefresh}
        />
      )}
    </div>
  );
}
