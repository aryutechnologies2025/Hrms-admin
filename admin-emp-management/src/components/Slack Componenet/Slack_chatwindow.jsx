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
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { MultiSelect } from "primereact/multiselect";
import Swal from "sweetalert2";

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
              ? "bg-gradient from-blue-600/40 to-transparent"
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
              ? " text-blue-600 hover:text-blue-800"
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

//create or edit and delete
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 w-full">
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
        
        Swal.fire({
          icon: "success",
          title: "Channel Updated!",
          timer: 1500,
          showConfirmButton: false,
        });
        // setChannelRefresh((prev) => !prev);
        window.location.reload();
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
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

export default function Slack_chatwindow({
  socket,
  currentUser,
  selectedUser,
  onlineUsers = [],
  selectedChannel,
  users = [],
  channels = [],
  onSelectUser,
  onSelectChannel,
  setChannelUnread,
  activeThread,
  setActiveThread,
  setMobileView,
  mobileView,
  favorites = { dm: [], channels: [] },
  setChaneel,
  setChannelRefresh ,
  setFavorites,
}) {
  console.log("Selected Channel in Chat Window:", selectedChannel);
    const [cursor, setCursor] = useState(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const containerRef = useRef()
  const isInitialLoad = useRef(true)

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

  // handle Drag and Drop
  const [isDragging, setIsDragging] = useState(false);

  // edit channel
  const [editChannel, setEditChannel] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
     const handleEditChannel = (channel) => {
    console.log("Editing channel:", channel);
    setEditChannel(channel);
    setShowEditModal(true);
  };
  

  // view channel members
  const me = currentUser?._id;
  const other = selectedUser?._id;

  /* ---------------- HELPERS ---------------- */

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

  const isDMFavorite = (id) => favorites.dm.some((f) => f._id === id);

  const isChannelFavorite = (id) =>
    favorites.channels.some((f) => f._id === id);

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
  // useEffect(() => {
  //   return () => {
  //     socket.emit("stop_typing", {
  //       senderId: me,
  //       receiverId: other,
  //     });
  //   };
  // }, [selectedUser]);

  // JOIN + LOAD

  // useEffect(() => {
  //   if (!socket || !selectedUser) return;
  //   setActiveThread(null);
  //   socket.emit("join_dm", { senderId: me, receiverId: other });

  //   axios
  //     .get(`${API_URL}/api/messages/dm/${me}/${other}`)
  //     .then((res) => setMessages(res.data.data || []));

  //   socket.emit("mark_seen", {
  //     senderId: other,
  //     receiverId: me,
  //   });
  // }, [selectedUser]);

  // useEffect(() => {
  //   if (!socket || !selectedChannel || !currentUser?._id) return;
  //   setActiveThread(null);

  //   const channelId = selectedChannel._id;

  //   // 🔹 Join channel room
  //   socket.emit("join_channel", { channelId });

  //   // 🔹 Fetch channel messages
  //   const fetchMessages = async () => {
  //     try {
  //       const res = await axios.get(
  //         `${API_URL}/api/messages/channel/${channelId}`,
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

  //   //  CLEANUP (VERY IMPORTANT)
  //   return () => {
  //     socket.emit("leave_channel", { channelId });
  //   };
  // }, [socket, selectedChannel]);


    useEffect(() => {
  if (!socket || !selectedUser) return;

  setActiveThread(null);
  socket.emit("join_dm", { senderId: me, receiverId: other });

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/messages/dm/${me}/${other}?limit=30`
      );

      setMessages(res.data.data || []);
      setCursor(res.data.nextCursor || null);

      setTimeout(() => {
        containerRef.current.scrollTop =
          containerRef.current.scrollHeight;
      }, 100);

    } catch (err) {
      console.error(err);
    }
  };

  fetchMessages();

  socket.emit("mark_seen", {
    senderId: other,
    receiverId: me,
  });

}, [selectedUser]);
console.log("containerRef.current.scrollTop",containerRef.current);
useEffect(() => {
  if (!socket || !selectedChannel || !currentUser?._id) return;

  setActiveThread(null);

  const channelId = selectedChannel._id;

  socket.emit("join_channel", { channelId });

  const fetchMessages = async () => {
    try {

      const res = await axios.get(
        `${API_URL}/api/messages/channel/${channelId}?limit=30`
      );

      setMessages(res.data.data || []);
      setCursor(res.data.nextCursor || null);

      setTimeout(() => {
        containerRef.current.scrollTop =
          containerRef.current.scrollHeight;
      }, 100);

      socket.emit("channel_seen", {
        channelId,
        userId: currentUser._id,
      });

    } catch (err) {
      console.error("Channel load error:", err);
    }
  };

  fetchMessages();

  return () => {
    socket.emit("leave_channel", { channelId });
  };

}, [socket, selectedChannel]);


const mergeMessages = (oldMessages, newMessages) => {
  const map = new Map();

  [...oldMessages, ...newMessages].forEach((m) => {
    const key = m._id || m.clientId;
    map.set(key, m);
  });

  return Array.from(map.values()).sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
};

// loading old message
const loadOlderMessages = async () => {

  if (!cursor || loadingMore) return;

  const container = containerRef.current;
  const prevHeight = container.scrollHeight;

  setLoadingMore(true);

  try {

    let url;

    if (selectedChannel) {
      url = `${API_URL}/api/messages/channel/${selectedChannel._id}?cursor=${cursor}`;
    } else {
      url = `${API_URL}/api/messages/dm/${me}/${other}?cursor=${cursor}`;
    }

    const res = await axios.get(url);

    const newMessages = res.data.data || [];

    // setMessages(prev => [...newMessages, ...prev]);
    setMessages(prev => mergeMessages(prev, newMessages));
    setCursor(res.data.nextCursor);

    requestAnimationFrame(() => {
      const newHeight = container.scrollHeight;
      container.scrollTop = newHeight - prevHeight;
    });

  } catch (err) {
    console.error(err);
  }

  setLoadingMore(false);
};
console.log("container.scrollTop",containerRef?.current);

// detecting scroll 
useEffect(() => {

  const container = containerRef.current;

  if (!container) return;

const handleScroll = () => {
  console.log("enter scrool",container.scrollTop)
    if (container.scrollTop <= 50) {
      console.log("enter scrool 223")
      loadOlderMessages();
    }
  };

  container.addEventListener("scroll", handleScroll);

  return () => {
    container.removeEventListener("scroll", handleScroll);
  };

}, [cursor, selectedUser, selectedChannel]);


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
        // setMessages((prev) => [...prev, msg]);
        setMessages((prev) => mergeMessages(prev, [msg]));

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

      // setMessages((prev) => [...prev, msg]);
      setMessages((prev) => mergeMessages(prev, [msg]));

      //  auto mark seen ONLY if user is viewing this channel
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
      console.log("entering messages_seen with:", senderId, receiverId, seenAt);
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

  // useEffect(() => {
  //   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);
  useEffect(() => {
  if (isInitialLoad.current) {
    bottomRef.current?.scrollIntoView()
    isInitialLoad.current = false
  }
}, [messages])

  useEffect(() => {
    bottomRefTheard.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadReplies]);

  // paste event listener for main chat
  //   useEffect(() => {

  //     const pasteListener = (e) => {
  //       handlePaste(e);
  //     };

  //     window.addEventListener("paste", pasteListener);

  //     return () => {
  //       window.removeEventListener("paste", pasteListener);
  //     };
  //   }, []);
  //   // thread paste event listener
  //   useEffect(() => {
  //   if (!activeThread) return;

  //   const pasteListenerThread = (e) => {
  //     handlePasteThread(e);
  //   };

  //   window.addEventListener("paste", pasteListenerThread);

  //   return () =>
  //     window.removeEventListener("paste", pasteListenerThread);
  // }, [activeThread]);
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

  // main file copy and past;
  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    console.log("Pasted items:", e.clipboardData, items);

    const pastedFiles = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) pastedFiles.push(file);
      }
    }

    if (pastedFiles.length > 0) {
      e.preventDefault();

      const formatted = pastedFiles.map((file) => ({
        file,
        tempId: crypto.randomUUID(),
      }));

      setFiles((prev) => [...prev, ...formatted]);
    }
  };
  // edit main chat paste
  const handleEditPaste = (e) => {
    const items = e.clipboardData.items;
    console.log("Pasted items:", e.clipboardData, items);

    const pastedFiles = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) pastedFiles.push(file);
      }
    }

    if (pastedFiles.length > 0) {
      e.preventDefault();

      const formatted = pastedFiles.map((file) => ({
        file,
        tempId: crypto.randomUUID(),
      }));

      setEditFiles((prev) => [...prev, ...formatted]);
    }
  };

  const handleEditDrop = async (e) => {
    e.preventDefault();

    const items = e.dataTransfer.items;
    const allFiles = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.kind === "file") {
        const entry = item.webkitGetAsEntry();
        if (entry) {
          await readEntry(entry, allFiles);
        }
      }
    }

    if (allFiles.length > 0) {
      const formatted = allFiles.map((file) => ({
        file,
        tempId: crypto.randomUUID(),
      }));

      setEditFiles((prev) => [...prev, ...formatted]);
    }
  };

  // handle  drag
  const handleDrop = async (e) => {
    e.preventDefault();

    const items = e.dataTransfer.items;
    const allFiles = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.kind === "file") {
        const entry = item.webkitGetAsEntry();
        if (entry) {
          await readEntry(entry, allFiles);
        }
      }
    }

    if (allFiles.length > 0) {
      const formatted = allFiles.map((file) => ({
        file,
        tempId: crypto.randomUUID(),
      }));

      setFiles((prev) => [...prev, ...formatted]);
    }
  };

  const readEntry = (entry, fileList) => {
    return new Promise((resolve) => {
      if (entry.isFile) {
        entry.file((file) => {
          fileList.push(file);
          resolve();
        });
      } else if (entry.isDirectory) {
        const reader = entry.createReader();
        reader.readEntries(async (entries) => {
          for (const ent of entries) {
            await readEntry(ent, fileList);
          }
          resolve();
        });
      }
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // handle thread paste
  const handlePasteThread = (e) => {
    const items = e.clipboardData.items;
    const pastedFiles = [];

    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === "file") {
        const file = items[i].getAsFile();
        if (file) pastedFiles.push(file);
      }
    }

    if (pastedFiles.length > 0) {
      e.preventDefault();

      const formatted = pastedFiles.map((file) => ({
        file,
        tempId: crypto.randomUUID(),
      }));

      setFilesThread((prev) => [...prev, ...formatted]);
    }
  };

  // handle thread copy and paste
  const handleEditThreadPaste = (e) => {
    const items = e.clipboardData.items;
    const pastedFiles = [];

    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === "file") {
        const file = items[i].getAsFile();
        if (file) pastedFiles.push(file);
      }
    }

    if (pastedFiles.length > 0) {
      e.preventDefault();

      const formatted = pastedFiles.map((file) => ({
        file,
        tempId: crypto.randomUUID(),
      }));

      setEditFilesThread((prev) => [...prev, ...formatted]);
    }
  };

  // const handleDropThread = (e) => {
  //   e.preventDefault();

  //   const files = Array.from(e.dataTransfer.files);

  //   const formatted = files.map((file) => ({
  //     file,
  //     tempId: crypto.randomUUID(),
  //   }));

  //   setFilesThread((prev) => [...prev, ...formatted]);
  // };
  const handleDropThread = async (e) => {
    e.preventDefault();

    const items = e.dataTransfer.items;
    const allFiles = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.kind === "file") {
        const entry = item.webkitGetAsEntry();
        if (entry) {
          await readEntry(entry, allFiles);
        }
      }
    }

    if (allFiles.length > 0) {
      const formatted = allFiles.map((file) => ({
        file,
        tempId: crypto.randomUUID(),
      }));

      setFilesThread((prev) => [...prev, ...formatted]);
    }
  };

  // thread drag over
  const handleEditThreadDrop = async (e) => {
    e.preventDefault();

    const items = e.dataTransfer.items;
    const allFiles = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.kind === "file") {
        const entry = item.webkitGetAsEntry();
        if (entry) {
          await readEntry(entry, allFiles);
        }
      }
    }

    if (allFiles.length > 0) {
      const formatted = allFiles.map((file) => ({
        file,
        tempId: crypto.randomUUID(),
      }));

      setEditFilesThread((prev) => [...prev, ...formatted]);
    }
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
    console.log("Rendering tick for message 12333:", msg);

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

  // // thread
  // const ThreadInput = ({ parentMessage, currentUser, socket }) => {
  //   const [textThread, setTextThread] = useState("");
  //   const fileRefThread = useRef();
  //   const [filesThread, setFilesThread] = useState([]);

  //   const sendReply = async () => {
  //     if (!text && files.length === 0) return;
  //     const fd = new FormData();
  //     fd.append("senderId", currentUser._id);
  //     fd.append("parentMessageId", parentMessage._id);
  //     fd.append("receiverId", parentMessage.receiverId || "");
  //     fd.append("channelId", parentMessage.channelId || "");
  //     fd.append("text", text);

  //     files.forEach((f) => fd.append("files", f));

  //     const res = await axios.post(`${API_URL}/api/messages/send`, fd);

  //     // if (res.data?.success) {
  //     //   console.log("coming")
  //     //   socket.emit("thread_reply", res.data.data);
  //     // }
  //     if (res.data?.success) {
  //       socket.emit("thread_reply", res.data.data);
  //     }

  //     setText("");
  //     setFiles([]);
  //   };

  //   return (
  //     <div className="flex gap-2">
  //       <input
  //         value={text}
  //         onChange={(e) => setText(e.target.value)}
  //         placeholder="Reply…"
  //         className="flex-1 border rounded px-2 py-1"
  //       />
  //       <button onClick={() => fileRef.current.click()}>📎</button>
  //       <button onClick={sendReply} className="text-blue-600">
  //         Send
  //       </button>

  //       <input
  //         type="file"
  //         hidden
  //         multiple
  //         ref={fileRef}
  //         onChange={(e) => setFiles([...files, ...Array.from(e.target.files)])}
  //       />
  //     </div>
  //   );
  // };

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

  // Delete channel
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

      //  Success alert
      Swal.fire({
        title: "Deleted!",
        text: "Channel has been deleted.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
       window.location.reload();
    } catch (err) {
      console.log(err);

      Swal.fire({
        title: "Error!",
        text: "Failed to delete channel.",
        icon: "error",
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col  h-full bg-gradient-to-br from-gray-50 to-white border w-full relative md:w-[40vw]  ">
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
            {/* <button
  onClick={() => setMobileView("sidebar")}
  className="md:hidden mr-2"
>
  ←
</button> */}
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

      <div className="flex  overflow-hidden h-[100vh]">
        <div className="flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50/50 h-[100vh]  w-full md:w-[35vw]">
          {/* Chat Header */}
          {console.log("showForwardDropdown:", showForwardDropdown)}
          {showForwardDropdown && (
            <div
              className="absolute top-10 right-2 
    w-[95%] sm:w-[420px] 
    bg-white border rounded-xl shadow-xl 
    z-[100] max-h-[80vh] 
    flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* CLOSE BUTTON */}
              <div className="flex justify-end p-2 border-b">
                <button
                  onClick={() => {
                    setShowForwardDropdown(false);
                    setForwardMessage(null);
                  }}
                  className="text-red-500 text-lg"
                >
                  ✕
                </button>
              </div>

              {/* HEADER */}
              <div className="px-4 py-2 text-lg font-semibold text-gray-600 border-b">
                Forward to…
              </div>

              {/* SEARCH (fixed) */}
              <div className="border-b px-3 py-2">
                <input
                  value={searchForward}
                  onChange={(e) => setSearchForward(e.target.value)}
                  placeholder="Search people or channels"
                  className="w-full px-3 py-2 text-sm border rounded-md outline-none focus:ring focus:ring-blue-200"
                />
              </div>

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

              {/* SCROLLABLE LIST */}
              <div className="flex-1 overflow-y-auto">
                {/* USERS */}
                {sortedUsers.length > 0 && (
                  <>
                    <div className="px-3 py-2 text-xs text-gray-400 uppercase">
                      People
                    </div>

                    {USER_TYPE_ORDER.map((type) => {
                      const usersByType = sortedUsers.filter(
                        (u) => u.type === type,
                      );

                      if (usersByType.length === 0) return null;

                      return (
                        <div key={type}>
                          <div className="px-3 py-1 text-sm font-semibold text-blue-900 uppercase">
                            {type}
                          </div>

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
                    <div className="px-3 py-2 text-xs text-gray-400 uppercase">
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

          <div className="px-4 md:px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between">
            {/* LEFT SECTION */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile Back */}
              <button
                onClick={() => setMobileView("sidebar")}
                className="md:hidden p-1 rounded-full hover:bg-gray-100 border text-white bg-gray-500/80"
                tooltip="Back to conversations"
              >
                ←
              </button>

              {/* Avatar */}

              
              {selectedUser
              
                ?  <span
                className=" cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteDM(selectedUser);
                      }}
                    >
                      {isDMFavorite(selectedUser._id) ? "⭐" : "☆"}
                    </span>
                : <span
                  className=" cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteChannel(selectedChannel);
                      }}
                    >
                      {isChannelFavorite(selectedChannel._id) ? "⭐" : "☆"}
                    </span>}
                    
              {selectedUser && (
                <div className="relative flex-shrink-0">
                  <div
                    className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 
                      flex items-center justify-center text-white font-semibold text-lg shadow-sm"
                  >
                    {selectedUser?.name?.charAt(0)?.toUpperCase() ||
                      selectedChannel?.name?.charAt(0)?.toUpperCase()}
                  </div>

                  {/* {selectedUser && (
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
            ${
              onlineUsers?.includes(String(selectedUser?._id))
                ? "bg-green-500"
                : "bg-gray-400"
            }`}
                  />
                )} */}
                </div>
              )}

              {/* Name & Status */}
              <div className="min-w-0">
                <h2 className="font-semibold text-gray-800 text-base truncate">
                  {/* {selectedUser?.name
                    ? selectedUser.name.length > 12
                      ? selectedUser.name.slice(0, 12) + "..."
                      : selectedUser.name
                    : selectedChannel?.name.length > 12
                      ? "#" + selectedChannel.name.slice(0, 12) + "..."
                      : `# ${selectedChannel?.name}`} */}
                      <div className="max-w-[300px]md:max-w-[450px] truncate">
  {selectedUser?.name || `# ${selectedChannel?.name}`}
</div>
                </h2>

                {/* <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
              
                  {selectedUser && (
                    <>
                      {onlineUsers?.includes(selectedUser?._id) ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Online
                        </span>
                      ) : (
                        <span>Last seen recently</span>
                      )}
                    </>
                  )}

                  {selectedChannel && (
                    <span className="text-blue-600 font-medium">
                      {messages.length} messages
                    </span>
                  )}
                </div> */}
              </div>
            </div>
           
          

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-2">
              {selectedChannel && (
                <MembersAvatarStack
                  members={channelMembers}
                  setFuntionOpen={(val) => setOpen(val)}
                />
              )}
            </div>

             {
              selectedChannel && currentUser?.superUser&&
                <div className="flex gap-5"> 
                <div className="flex items-center gap-2">

  {/* EDIT */}
  <button
    onClick={(e) => {
      e.stopPropagation();
      handleEditChannel(selectedChannel);
    }}
    className="flex items-center justify-center
    w-8 h-8 rounded-md
    text-blue-500 bg-blue-50
    hover:bg-blue-100 hover:text-blue-600
    transition duration-200"
  >
    <FiEdit size={16} />
  </button>

  {/* DELETE */}
  <button
    onClick={(e) => {
      e.stopPropagation();
      handleDeleteChannel(selectedChannel?._id);
    }}
    className="flex items-center justify-center
    w-8 h-8 rounded-md
    text-red-500 bg-red-50
    hover:bg-red-100 hover:text-red-600
    transition duration-200"
  >
    <FiTrash2 size={16} />
  </button>

</div></div>
            }

            {/* adding vedio call */}
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

          {/*  Hover Actions */}

          {/* Messages Container */}
          <div  ref={containerRef} className="flex-1 px-1 md:p-6 py-2 overflow-y-scroll overflow-x-hidden bg-gradient-to-b from-white to-gray-50/30 w-[100vw] md:w-full">
            <div  className="w-full mx-auto space-y-3 ">
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
                            className="mt-2 text-xs text-yellow-500 hover:text-gray-300"
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
                        <audio src={url} controls className="w-full " />
                      ) : file.type === "application/pdf" ? (
                        <iframe
                          src={url}
                          title="pdf"
                          className="w-full h-[250px] sm:h-[350px] rounded-xl"
                        />
                      ) : (
                        <div className="w-[50%] h-full flex flex-col items-center justify-center p-3">
                          <span className="text-2xl mb-2">{icon}</span>

                          <p className="text-sm sm:text-base md:text-lg font-medium">
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
                  // accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                  accept="*"
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
                    className="w-full border border-gray-300 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none max-h-32 bg-gray-50 text-gray-900 placeholder-gray-500  "
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                    onDrop={(e) => {
                      handleDrop(e);
                      setIsDragging(false);
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={() => setIsDragging(false)}
                    onPaste={handlePaste}
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
          <div className="flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50/50 overflow-hidden h-[100vh] w-full md:w-[50%]  ">
            {activeThread && (
              <div
                className="border-b  flex flex-col  overflow-hidden h-[100vh] w-full 
                 fixed inset-0 md:static md:inset-auto z-50 bg-white p-2 
    "
              >
                {/* HEADER */}
                <div className="p-2 py-3 border-b flex justify-between items-center w-full sticky top-0 z-20 bg-white">
                  <div>
                    <h3 className="font-semibold text-gray-800">Thread</h3>
                    <p className="text-xs text-gray-500">Replies to message</p>
                  </div>
                  {/* <button
                    onClick={() => setActiveThread(null)}
                    className="text-blue-500 hover:text-red-500"
                  >
                    ✕
                  </button> */}
                  <button
                    onClick={() => {
                      setActiveThread(null);
                      setMobileView("chat");
                    }}
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
                                isMe
                                  ? "bg-gray-200/70 text-black rounded-br-lg"
                                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-lg"
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
                              {/*  Hover Actions */}
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
                                    onPaste={handleEditThreadPaste}
                                    onDrop={(e) => {
                                      handleEditThreadDrop(e);
                                      setIsDragging(false);
                                    }}
                                    onDragOver={handleDragOver}
                                    onDragLeave={() => setIsDragging(false)}
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
                                                className="rounded-xl w-full max-h-[300px] sm:max-h-[350px] object-contain shadow-sm"
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
                                                  setSelectedForwardFile(f); //  only this file
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
                                  {/* <div>
                                    {" "}
                                    <span className="text-xs text-gray-600">
                                      {date}
                                    </span>
                                  </div> */}
                                  <div className="flex gap">
                                    {/* <span className="text-xs">{time}</span> */}
                                    {/* {console.log(
                                      "Rendering ticks for message:",
                                      m.seenAt,
                                    )} */}
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
                              {selectedChannel  && (m.threadReplyCount > 0 || m.senderId == me) && (
                                <div
                                  className={` gap-2 mt-2 ${
                                    isMe ? "text-blue-100" : "text-gray-500"
                                  }`}
                                >
                                  <div className="flex items-center justify-end gap-2">
                                    {/* <div>
                                      {" "}
                                      <span className="text-xs text-gray-600">
                                        {date}
                                      </span>
                                    </div> */}
                                    <div className="flex gap-3">
                                      {/* <span className="text-xs text-gray-600">
                                        {time}
                                      </span> */}
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
                                className="rounded-xl w-full max-h-[300px] sm:max-h-[350px] object-contain shadow-sm"
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
                <div className="px-6 py-3 border-t bg-white">
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
                        // accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                        accept="*"
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
                          className="w-full border border-gray-300 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none max-h-32 bg-gray-50 text-gray-900 placeholder-gray-500 whitespace-pre-wrap break-words"
                          onInput={(e) => {
                            e.target.style.height = "auto";
                            e.target.style.height =
                              e.target.scrollHeight + "px";
                          }}
                          onDrop={(e) => {
                            handleDropThread(e);
                          }}
                          onDragOver={(e) => e.preventDefault()}
                          onPaste={handlePasteThread}
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
                  <div className="mt-3 text-center">
                <p className="text-xs text-gray-500">
                  Press <span className="font-semibold">Enter</span> to send •{" "}
                  <span className="font-semibold">Shift + Enter</span> for new
                  line
                </p>
              </div>
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
