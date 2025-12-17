

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

<<<<<<< HEAD
export default function Slack_sidebar({
  users = [],
  unread = {},
  selectedUser,
  onSelectUser,
   onlineUsers = [],
}) {
  return (
    <div className="w-72 bg-white border-r overflow-y-auto">
      <div className="p-4 font-bold border-b">Chats</div>
=======
    // -------------------------------
    // LOAD EMPLOYEES
    // -------------------------------
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/employees/all-active-employees`,
                    {withCredentials: true}
                );
                const Employees = res.data.data;
>>>>>>> 7f68fc69bfb12f55d3962a81ef7d79021cef1fd9

      {/* {users.map((user) => {
        const active = selectedUser?._id === user._id;
        const count = unread[user._id] || 0;

        return (
          <div
            key={user._id}
            onClick={() => onSelectUser(user)}
            className={`px-4 py-3 cursor-pointer flex justify-between
              ${active ? "bg-gray-100" : "hover:bg-gray-50"}`}
          >
            <span>{user.name}</span>

            {count > 0 && !active && (
              <span className="bg-red-500 text-white text-xs px-2 rounded-full">
                {count}
              </span>
            )}
          </div>
        );
      })} */}
      {users.map((user) => {
  const active = selectedUser?._id === user._id;
  const count = unread[user._id] || 0;

  const isOnline = onlineUsers.includes(user._id);

  return (
    <div
      key={user._id}
      onClick={() => onSelectUser(user)}
      className={`px-4 py-3 cursor-pointer flex justify-between items-center
        ${active ? "bg-gray-100" : "hover:bg-gray-50"}`}
    >
      <div className="flex items-center gap-2">
        {/*  ONLINE / OFFLINE CIRCLE */}
        <span
          className={`w-2 h-2 rounded-full ${
            isOnline ? "bg-green-500" : "bg-gray-400"
          }`}
        />

        <span className={`${!isOnline ? "text-gray-400" : ""}`}>
          {user.name}
        </span>
      </div>

      {/*  UNREAD */}
      {count > 0 && !active && (
        <span className="bg-red-500 text-white text-xs px-2 rounded-full">
          {count}
        </span>
      )}
    </div>
  );
})}

    </div>
  );
}

