

// import { useState } from "react";

// export default function Slack_sidebar({
//   users,
//   unread,
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

import { useState } from 'react';

export default function SlackSidebar({
  users,
  selectedUser,
  onSelectUser,
  unread,
  onlineUsers,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (activeFilter) {
      case 'online':
        return matchesSearch && onlineUsers.includes(user._id);
      case 'unread':
        return matchesSearch && (unread[user._id] > 0);
      default:
        return matchesSearch;
    }
  });

  return (
    <div className="w-80 h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 shadow-lg">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Messages
          </h2>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search messages..."
              className="pl-10 pr-4 py-2 w-48 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-4">
          {['all', 'online', 'unread'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200 ${
                activeFilter === filter
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter}
              {filter === 'unread' && (
                <span className="ml-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                  {Object.values(unread).reduce((a, b) => a + b, 0)}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Online Users Count */}
      <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-y border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Online Users
          </span>
          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {onlineUsers.length}
          </span>
        </div>
      </div>

      {/* Fixed Height Scrollable User List */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => onSelectUser(user)}
                className={`flex items-center justify-between p-4 mx-4 my-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
                  selectedUser?._id === user._id
                    ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 shadow-md'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Profile Image Container */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    
                    {/* Online Status Indicator */}
                   { console.log("onlineUsers", onlineUsers.includes(user._id),"user._id",user._id)}
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      onlineUsers && onlineUsers.includes(user._id)
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse'
                        : 'bg-gray-400'
                    }`}>
                      {onlineUsers.includes(user._id) && (
                        <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></div>
                      )}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <span className={`font-semibold ${
                        selectedUser?._id === user._id 
                          ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600'
                          : 'text-gray-800'
                      }`}>
                        {user.name}
                      </span>
                      {unread[user._id] > 0 && !selectedUser?._id === user._id && (
                        <span className="h-2 w-2 bg-red-500 rounded-full animate-bounce"></span>
                      )}
                    </div>
                     <span className={`text-sm ${
                      selectedUser?._id === user._id
                        ? 'text-purple-500 font-medium'
                        : 'text-gray-700'
                    }`}>
                     {user.type}
                    </span>
                    <span className={`text-sm ${
                      selectedUser?._id === user._id
                        ? 'text-purple-500 font-medium'
                        : 'text-gray-500'
                    }`}>
                      {onlineUsers.includes(user._id)
                        ? 'Online now'
                        : 'Last seen recently'}
                    </span>
                    
                  </div>
                </div>

                {/* Unread Message Count */}
                {unread[user._id] > 0 && (
                  <div className="flex flex-col items-end space-y-1">
                    <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md transform hover:scale-110 transition-transform">
                      {unread[user._id]}
                    </span>
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <div className="w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg font-medium">No users found</p>
              <p className="text-sm">Try changing your search or filter</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white p-4">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <p className="font-semibold text-gray-800">You</p>
              <p className="text-sm text-green-600 font-medium">Active now</p>
            </div>
          </div>
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}