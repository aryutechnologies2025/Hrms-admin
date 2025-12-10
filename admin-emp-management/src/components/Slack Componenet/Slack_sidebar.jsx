

// import React, { useState } from "react";
// import {
//     ChevronDown,
//     ChevronRight,
//     Hash,
//     Lock,
//     Plus,
//     Pencil,
//     Trash2, MessageCircle,
// } from "lucide-react";
// import { MultiSelect } from "primereact/multiselect";


// export default function Slack_sidebar() {
//     const [showChannels, setShowChannels] = useState(true);
//     const [showDM, setShowDM] = useState(true);
//     const [activeUser, setActiveUser] = useState("Dipi");

//     const [showCreateModal, setShowCreateModal] = useState(false);
//     const [newChannelName, setNewChannelName] = useState("");
//     const [editingChannel, setEditingChannel] = useState(null);
//     const [selectedEmployee, setSelectedEmployee] = useState("");


//     const [channels, setChannels] = useState([
//         { id: 1, name: "general", private: false, createdBy: "John Doe" },
//         { id: 2, name: "management", private: true, createdBy: "Emma Watson" },
//     ]);

//     const employees = [
//         "Dipi",
//         "Abdul Rahman",
//         "Arun",
//         "Barathkrishnamoorthy",
//         "Heyram",
//         "IYYAPPAN A",
//         "kanimozhi",
//         "Komadurai P",
//         "Moni",
//         "S.SUBA SHREE",
//         "Venu",
//         "Yuvaraj",
//         "bharathwaj (you)",
//     ];

//     const directMessages = [
//         "Dipi",
//         "Abdul Rahman",
//         "Arun",
//         "Barathkrishnamoorthy",
//         "Heyram",
//         "IYYAPPAN A",
//         "kanimozhi",
//         "Komadurai P",
//         "Moni",
//         "S.SUBA SHREE",
//         "Venu",
//         "Yuvaraj",
//         "bharathwaj (you)",
//     ];

//     const handleChannelInput = (e) => {
//         setNewChannelName(e.target.value.toLowerCase().replace(/\s+/g, "-"));
//     };

//     const createChannel = () => {
//         if (!newChannelName.trim() || !selectedEmployee) {
//             alert("Please enter channel name & select employee!");
//             return;
//         }

//         if (editingChannel) {
//             setChannels(
//                 channels.map((ch) =>
//                     ch.id === editingChannel.id
//                         ? { ...ch, name: newChannelName, createdBy: selectedEmployee }
//                         : ch
//                 )
//             );
//         } else {
//             const newChannel = {
//                 id: Date.now(),
//                 name: newChannelName,
//                 private: false,
//                 createdBy: selectedEmployee,
//             };
//             setChannels([...channels, newChannel]);
//         }

//         setNewChannelName("");
//         setSelectedEmployee("");
//         setEditingChannel(null);
//         setShowCreateModal(false);
//     };

//     const editChannel = (channel) => {
//         setEditingChannel(channel);
//         setNewChannelName(channel.name);
//         setSelectedEmployee(channel?.createdBy);
//         setShowCreateModal(true);
//     };

//     const deleteChannel = (id) => {
//         if (window.confirm("Are you sure you want to delete this channel?")) {
//             setChannels(channels.filter((ch) => ch.id !== id));
//         }
//     };

//     return (
//         <div className="w-[30%] bg-white text-black flex flex-col border-r border-gray-300">

//             {/* Workspace Title */}
//             <div className="p-4 pb-3 text-lg font-semibold border-b border-gray-300 bg-white">
//                 Aryu Enterprises Pvt Ltd
//             </div>

//             {/* Scroll Area */}
//             <div className="flex-1 overflow-y-auto px-3 pt-4 pb-6 space-y-6">

//                 {/* Starred */}
//                 <div className="flex items-center gap-2 text-gray-500 text-xs uppercase cursor-pointer">
//                     <MessageCircle size={14} />  {/* Icon added */}
//                     Threads
//                 </div>

//                 {/* Channels */}
//                 <div>

//                     <div className="flex justify-between items-center text-gray-500 text-xs uppercase cursor-pointer">
//                         <div
//                             className="flex items-center gap-2"
//                             onClick={() => setShowChannels(!showChannels)}
//                         >
//                             {showChannels ? (
//                                 <ChevronDown size={14} />
//                             ) : (
//                                 <ChevronRight size={14} />
//                             )}
//                             Channels
//                         </div>

//                         <Plus
//                             size={18}
//                             className="cursor-pointer hover:text-black transition"
//                             onClick={() => {
//                                 setEditingChannel(null);
//                                 setNewChannelName("");
//                                 setSelectedEmployee("");
//                                 setShowCreateModal(true);
//                             }}
//                         />
//                     </div>

//                     {showChannels && (
//                         <div className="mt-3 space-y-2">
//                             {channels.map((ch) => (
//                                 <div
//                                     key={ch.id}
//                                     className="flex items-center justify-between p-2 rounded-md cursor-pointer
//                   bg-gray-100 hover:bg-gray-200 transition group"
//                                 >
//                                     <div className="flex items-center gap-2">
//                                         {ch.private ? <Lock size={16} /> : <Hash size={16} />}
//                                         <span className="text-sm">{ch.name}</span>
//                                     </div>

//                                     <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition">
//                                         <Pencil
//                                             size={16}
//                                             className="text-black cursor-pointer"
//                                             onClick={() => editChannel(ch)}
//                                         />
//                                         <Trash2
//                                             size={16}
//                                             className="text-red-500 cursor-pointer"
//                                             onClick={() => deleteChannel(ch.id)}
//                                         />
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>

//                 {/* Direct messages */}
//                 <div>
//                     <div
//                         className="flex items-center gap-2 text-gray-500 text-xs uppercase cursor-pointer"
//                         onClick={() => setShowDM(!showDM)}
//                     >
//                         {showDM ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
//                         Direct messages
//                     </div>

//                     {showDM && (
//                         <div className="mt-3 space-y-1">
//                             {directMessages.map((name) => (
//                                 <div
//                                     key={name}
//                                     onClick={() => setActiveUser(name)}
//                                     className={`flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer transition 
//                   ${activeUser === name
//                                             ? "bg-gray-200 text-black"
//                                             : "hover:bg-gray-100"
//                                         }`}
//                                 >
//                                     <div className="w-7 h-7 rounded-full bg-gray-300 text-black font-bold text-xs flex items-center justify-center">
//                                         {name.charAt(0)}
//                                     </div>
//                                     <span className="truncate text-sm">{name}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>

//                 {/* Apps */}
//                 <div>
//                     <div className="flex items-center gap-2 text-gray-400 text-xs uppercase">
//                         <ChevronDown size={14} /> Apps
//                     </div>
//                 </div>
//             </div>

//             {/* Create/Edit Modal */}
//             {showCreateModal && (
//                 <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//                     <div className="bg-white text-black p-6 rounded-xl w-[330px] border border-gray-300 shadow-2xl">
//                         <h3 className="text-lg font-semibold mb-4">
//                             {editingChannel ? "Edit Channel" : "Create Channel"}
//                         </h3>

//                         <input
//                             type="text"
//                             placeholder="Enter channel name"
//                             value={newChannelName}
//                             onChange={handleChannelInput}
//                             className="w-full border border-gray-300 bg-white text-black px-3 py-2 rounded-md mb-4 focus:ring-2 focus:ring-gray-400"
//                         />

//                         {/* <select
//                             value={selectedEmployee}
//                             onChange={(e) => setSelectedEmployee(e.target.value)}
//                             className="w-full border border-gray-300 bg-white text-black px-3 py-2 rounded-md mb-4 focus:ring-2 focus:ring-gray-400"
//                         >
//                             <option value="">Select Employee</option>
//                             {employees.map((emp, index) => (
//                                 <option key={index} value={emp}>
//                                     {emp}
//                                 </option>
//                             ))}
//                         </select> */}

//                         <MultiSelect
//                             value={selectedEmployee}
//                             onChange={(e) => setSelectedEmployee(e.target.value)}
//                             options={employees}
//                             // optionLabel="label"
//                             filter
//                             placeholder="Select Employees"
//                             maxSelectedLabels={3}
//                             className="w-full text-black  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             display="chip"
//                         />


//                         <div className="text-xs text-gray-500 mb-4 mt-2">
//                             Channel URL: <b>#{newChannelName || "your-channel"}</b>
//                         </div>

//                         <div className="flex justify-end gap-3">
//                             <button
//                                 className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
//                                 onClick={() => setShowCreateModal(false)}
//                             >
//                                 Cancel
//                             </button>

//                             <button
//                                 className="px-3 py-1 rounded bg-black text-white hover:bg-gray-800"
//                                 onClick={createChannel}
//                             >
//                                 {editingChannel ? "Update" : "Create"}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }



import React, { useEffect, useState } from "react";
import {
    ChevronDown,
    ChevronRight,
    Hash,
    Lock,
    Plus,
    Pencil,
    Trash2,
    MessageCircle,
    CloudCog,
} from "lucide-react";
import { MultiSelect } from "primereact/multiselect";
import axios from "axios";
import { API_URL } from "../../config";

export default function Slack_sidebar({ setActiveChat }) {



    const [showChannels, setShowChannels] = useState(true);
    const [showDM, setShowDM] = useState(true);
    const [activeUser, setActiveUser] = useState("Dipi");

    // console.log("activeUser",activeUser)

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newChannelName, setNewChannelName] = useState("");
    const [editingChannel, setEditingChannel] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [channelType, setChannelType] = useState("common");

    const [channels, setChannels] = useState([
        // { id: 1, name: "general", private: false, createdBy: "John Doe" },
        { id: 2, name: "management", private: true, createdBy: "Emma Watson" },
    ]);

    const employees = [
        "Dipi", "Abdul Rahman", "Arun", "Barathkrishnamoorthy", "Heyram",
        "IYYAPPAN A", "kanimozhi", "Komadurai P", "Moni", "S.SUBA SHREE",
        "Venu", "Yuvaraj", "bharathwaj (you)"
    ];
    const [employeesa, setEmployees] = useState([]);
    // console.log("employeed checking", employeesa);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/api/employees/all-active-employees`,

            );

            // console.log("response", response);

            const Employees = response.data.data;

            if (response.data.success) {
                const transformedData = Employees.map((employee) => ({
                    id: employee._id,
                    employeeId: employee.employeeId,

                    employee_Image: employee.photo
                        ? `${API_URL}/api/uploads/${employee.photo}`
                        : sample,
                    employee_Name: employee.employeeName,

                    employee_dutyStatus: employee.dutyStatus,

                    online: true,
                    unreadCount: "2",

                }));
                const sortedData = transformedData.sort((a, b) =>
                    a.employee_Name.localeCompare(b.employee_Name)
                );
                // console.log("transformedData", transformedData);
                //  setEmployees(transformedData);
                // Sort before filtering

                // Filter only active
                const filterData = sortedData.filter(
                    (data) => data.employee_dutyStatus == 1
                );

                setEmployees(filterData);


            } else {
                console.log("Failed to fetch employees.");
            }
        } catch (err) {


            console.log("Error fetching employees:", err);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const employeeAvatars = {
        "Dipi": "https://photosmint.com/wp-content/uploads/2025/03/Indian-Beauty-DP.jpeg",
        "Abdul Rahman": "https://randomuser.me/api/portraits/men/74.jpg",
        "Arun": "https://randomuser.me/api/portraits/men/12.jpg",
        "Barathkrishnamoorthy": "https://randomuser.me/api/portraits/men/23.jpg",
        "Heyram": "https://randomuser.me/api/portraits/men/44.jpg",
        "IYYAPPAN A": "https://randomuser.me/api/portraits/men/55.jpg",
        "kanimozhi": "https://randomuser.me/api/portraits/women/65.jpg",
        "Komadurai P": "https://randomuser.me/api/portraits/men/32.jpg",
        "Moni": "https://randomuser.me/api/portraits/women/72.jpg",
        "S.SUBA SHREE": "https://randomuser.me/api/portraits/women/25.jpg",
        "Venu": "https://randomuser.me/api/portraits/men/66.jpg",
        "Yuvaraj": "https://randomuser.me/api/portraits/men/11.jpg",
        "bharathwaj (you)": "https://images.unsplash.com/photo-1552642986-ccb41e7059e7?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGFuZHNvbWUlMjBtYW58ZW58MHx8MHx8fDA%3D"
    };

    const directMessages = [...employeesa];

    // const directMessages = employees.map((emp) => ({
    //     name: emp,
    //     avatar: employeeAvatars[emp] || "https://via.placeholder.com/50"
    // }));

    const handleChannelInput = (e) => {
        setNewChannelName(e.target.value.toLowerCase().replace(/\s+/g, "-"));
    };

    const createChannel = () => {
        if (!newChannelName.trim() || !selectedEmployee) {
            alert("Please enter channel name & select employee!");
            return;
        }
 const isPrivate = channelType === "private";
        if (editingChannel) {
            setChannels(
                channels.map((ch) =>
                    ch.id === editingChannel.id
                        ? { ...ch, name: newChannelName, createdBy: selectedEmployee,private: isPrivate }
                        : ch
                )
            );
        } else {
            const newChannel = {
                id: Date.now(),
                name: newChannelName,
                private: isPrivate,
                createdBy: selectedEmployee,
            };
            setChannels([...channels, newChannel]);
        }

        setNewChannelName("");
        setSelectedEmployee("");
        setChannelType("common")
        setEditingChannel(null);
        setShowCreateModal(false);
    };

    const editChannel = (channel) => {
        setEditingChannel(channel);
        setNewChannelName(channel.name);
        setSelectedEmployee(channel?.createdBy);
        setChannelType(channel.private ? "private" : "common");
        setShowCreateModal(true);
    };

    const deleteChannel = (id) => {
        if (window.confirm("Are you sure you want to delete this channel?")) {
            setChannels(channels.filter((ch) => ch.id !== id));
        }
    };


    return (
        <div className="w-[30%] bg-white text-black flex flex-col border-r border-gray-300">

            {/* Workspace Title */}
            <div className="p-4 pb-3 text-lg font-semibold border-b border-gray-300 bg-white">
                Aryu Enterprises Pvt Ltd
            </div>

            <div className="flex-1 overflow-y-auto px-3 pt-4 pb-6 space-y-6">

                {/* THREADS */}
                <div
                    onClick={() =>
                        setActiveChat({
                            title: "Threads",
                            avatar: "https://cdn-icons-png.flaticon.com/512/709/709699.png",
                            type: "threads",
                        })
                    }
                    className="flex items-center gap-2 text-gray-500 text-xs uppercase cursor-pointer"
                >
                    <MessageCircle size={14} />
                    Threads
                </div>

                <div
                    onClick={() =>
                        setActiveChat({
                            title: "General",
                            avatar: "https://cdn-icons-png.flaticon.com/512/709/709699.png",
                            type: "General",
                        })
                    }
                    className="flex items-center gap-2 text-gray-500 text-xs uppercase cursor-pointer"
                >
                    #
                    General
                </div>

                {/* CHANNELS */}
                <div>
                    <div className="flex justify-between items-center text-gray-500 text-xs uppercase cursor-pointer">
                        <div
                            className="flex items-center gap-2"
                            onClick={() => setShowChannels(!showChannels)}
                        >
                            {showChannels ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            Channels
                        </div>

                        <Plus
                            size={18}
                            className="cursor-pointer hover:text-black"
                            onClick={() => {
                                setEditingChannel(null);
                                setNewChannelName("");
                                setSelectedEmployee("");
                                setShowCreateModal(true);
                            }}
                        />
                    </div>

                    {showChannels && (
                        <div className="mt-3 space-y-2">
                            {channels.map((ch) => (
                                <div
                                    key={ch.id}
                                    onClick={() =>
                                        setActiveChat({
                                            title: ch.name,
                                            avatar: "https://cdn-icons-png.flaticon.com/512/906/906343.png",
                                            type: "channel",
                                        })
                                    }
                                    className="flex items-center justify-between p-2 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer group"
                                >
                                    <div className="flex items-center gap-2">
                                        {ch.private ? <Lock size={16} /> : <Hash size={16} />}
                                        <span className="text-sm">{ch.name}</span>
                                    </div>

                                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100">
                                        <Pencil
                                            size={16}
                                            className="cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                editChannel(ch);
                                            }}
                                        />
                                        <Trash2
                                            size={16}
                                            className="text-red-500 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteChannel(ch.id);
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* DIRECT MESSAGES */}
                {/* DIRECT MESSAGES */}
                <div>
                    <div
                        className="flex items-center gap-2 text-gray-500 text-xs uppercase cursor-pointer"
                        onClick={() => setShowDM(!showDM)}
                    >
                        {showDM ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        Direct messages
                    </div>

                    {showDM && (
                        // <div className="mt-3 space-y-1">
                        //     {directMessages.map((dm) => (
                        //         <div
                        //             key={dm.name}
                        //             onClick={() => {
                        //                 setActiveUser(dm.
                        //                     employee_Name
                        //                 );
                        //                 setActiveChat({
                        //                     title: dm.
                        //                         employee_Name
                        //                     ,
                        //                     avatar: dm.employee_Image
                        //                     ,
                        //                     type: "dm",
                        //                 });
                        //             }}
                        //             className={`flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer
                        // ${activeUser === dm.name ? "bg-gray-200" : "hover:bg-gray-100"}`}
                        //         >
                        //             <img
                        //                 src={dm.employee_Image
                        //                 }
                        //                 alt={dm.employee_Name}
                        //                 className="w-7 h-7 rounded-full"
                        //             />
                        //             <span className="truncate text-sm">{dm.employee_Name}</span>
                        //         </div>
                        //     ))}
                        // </div>


                        <div className="mt-3 space-y-1">
                            {directMessages.map((dm) => {
                                const isActive = activeUser === dm.employee_Name; // FIXED

                                return (
                                    <div
                                        key={dm.employee_Name}
                                        onClick={() => {
                                            setActiveUser(dm.employee_Name);
                                            setActiveChat({
                                                title: dm.employee_Name,
                                                avatar: dm.employee_Image,
                                                online:dm.online,
                                                type: "dm",
                                            });
                                        }}
                                        className={`flex items-center justify-between px-2 py-2 rounded-md cursor-pointer
          ${isActive ? "bg-gray-200" : "hover:bg-gray-100"}`}
                                    >
                                        {/* LEFT: Avatar + Name */}
                                        <div className="flex items-center gap-2">
                                            <div className="relative">
                                                <img
                                                    src={dm.employee_Image}
                                                    alt={dm.employee_Name}
                                                    className="w-7 h-7 rounded-full"
                                                />

                                                {/* GREEN ONLINE DOT */}
                                                {dm.online && (
                                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                                                )}
                                            </div>

                                            <span className="truncate text-sm">{dm.employee_Name}</span>
                                        </div>

                                        {/* UNREAD MESSAGE BADGE */}
                                        {dm.unreadCount > 0 && (
                                            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                                                {dm.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                    )}
                </div>

            </div>

            {/* CREATE/EDIT CHANNEL MODAL */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-[50%] border shadow-2xl">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingChannel ? "Edit Channel" : "Create Channel"}
                        </h3>

                        <input
                            type="text"
                            placeholder="Enter channel name"
                            value={newChannelName}
                            onChange={handleChannelInput}
                            className="w-full border px-3 py-2 rounded-md mb-4"
                        />

                        <MultiSelect
                            value={selectedEmployee}
                            onChange={(e) => setSelectedEmployee(e.value)}
                            options={employees}
                            filter
                            placeholder="Select Employees"
                            className="w-full border rounded-lg"
                            display="chip"
                        />

                         <div className="flex items-center gap-6 my-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="channelType"
                                    value="common"
                                    checked={channelType === "common"}
                                    onChange={() => setChannelType("common")}
                                />
                                <span className="flex items-center gap-1 text-sm">
                                    <Hash size={14} /> Common
                                </span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="channelType"
                                    value="private"
                                    checked={channelType === "private"}
                                    onChange={() => setChannelType("private")}
                                />
                                <span className="flex items-center gap-1 text-sm">
                                    <Lock size={14} /> Private
                                </span>
                            </label>
                        </div>

                        <div className="text-xs text-gray-500 mt-3 mb-4">
                            Channel URL: <b>#{newChannelName || "your-channel"}</b>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                className="px-3 py-1 rounded bg-gray-200"
                                onClick={() => setShowCreateModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="px-3 py-1 rounded bg-black text-white"
                                onClick={createChannel}
                            >
                                {editingChannel ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

