import React, { useEffect, useState } from "react";
import { BsPeople } from "react-icons/bs";
import { FaChevronDown, FaChevronRight, FaPlus } from "react-icons/fa6";
import { MultiSelect } from "primereact/multiselect";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import { API_URL } from "../../config";

// const API_URL = "http://192.168.0.116:5009";

export default function Sidebar({ setActiveChat }) {
    const [employees, setEmployees] = useState([]);
    const [channels, setChannels] = useState([]);

    const [activeUser, setActiveUser] = useState(null);
    const [activeChannel, setActiveChannel] = useState(null);

    const [showDM, setShowDM] = useState(true);
    const [showChannels, setShowChannels] = useState(true);

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [newChannelName, setNewChannelName] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState([]);

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

                const transformed = Employees.map((e) => ({
                    id: e._id,
                    employeeId: e.employeeId,
                    employee_Name: e.employeeName,
                    employee_Image: e.photo
                        ? `${API_URL}/api/uploads/${e.photo}`
                        : "",
                    online: e.dutyStatus === 1,
                    unreadCount: e.unreadCount || 0,
                }));

                setEmployees(transformed);
            } catch (e) {
                console.error("Failed loading employees", e);
            }
        };

        fetchEmployees();
    }, []);

    // -------------------------------
    // LOAD CHANNELS (OPTIONAL API)
    // -------------------------------
    useEffect(() => {
        // If you have channels in DB → load here
        // setChannels(responseFromAPI);
    }, []);

    // -------------------------------
    // Create Channel
    // -------------------------------
    const handleCreateChannel = () => {
        if (!newChannelName.trim()) {
            alert("Channel must have a name!");
            return;
        }

        if (selectedEmployee.length === 0) {
            alert("Select at least one employee!");
            return;
        }

        const newChannel = {
            id: Date.now().toString(),
            name: newChannelName,
            members: selectedEmployee,
        };

        setChannels((prev) => [...prev, newChannel]);
        setOpenCreateModal(false);
        setNewChannelName("");
        setSelectedEmployee([]);
    };

    // Multiselect options
    const msEmployees = employees.map((e) => ({
        label: e.employee_Name,
        value: e.id,
    }));

    return (
        <div className="w-64 bg-white shadow-md h-screen p-4 overflow-y-auto">
            {/* ---------------------------
                CREATE CHANNEL BUTTON
            ---------------------------- */}
            <div className="flex justify-between items-center">
                <h2 className="font-bold text-lg">Messaging</h2>
                <button
                    className="p-2 bg-blue-600 text-white rounded"
                    onClick={() => setOpenCreateModal(true)}
                >
                    <FaPlus />
                </button>
            </div>

            {/* ---------------------------
                DIRECT MESSAGES (HEADER)
            ---------------------------- */}
            <div
                className="mt-5 flex justify-between items-center cursor-pointer"
                onClick={() => setShowDM(!showDM)}
            >
                <h3 className="font-semibold flex items-center gap-2">
                    <BsPeople /> Direct Messages
                </h3>
                {showDM ? <FaChevronDown /> : <FaChevronRight />}
            </div>

            {/* ---------------------------
                DIRECT MESSAGES LIST
            ---------------------------- */}
            {showDM && (
                <div className="mt-2 space-y-1">
                    {employees.map((emp) => {
                        const isActive = activeUser === emp.id;

                        return (
                            <div
                                key={emp.id}
                                onClick={() => {
                                    setActiveUser(emp.id);
                                    setActiveChannel(null);

                                    setActiveChat({
                                        type: "dm",
                                        employeeId: emp.id,
                                        title: emp.employee_Name,
                                        avatar: emp.employee_Image,
                                        online: emp.online,
                                    });
                                }}
                                className={`flex items-center justify-between px-2 py-2 rounded-md cursor-pointer transition 
                                ${
                                    isActive
                                        ? "bg-gray-200"
                                        : "hover:bg-gray-100"
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <img
                                            src={emp.employee_Image}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        {emp.online && (
                                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></span>
                                        )}
                                    </div>

                                    <span className="truncate text-sm">
                                        {emp.employee_Name}
                                    </span>
                                </div>

                                {emp.unreadCount > 0 && (
                                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                        {emp.unreadCount}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ---------------------------
                CHANNELS HEADER
            ---------------------------- */}
            <div
                className="mt-6 flex justify-between items-center cursor-pointer"
                onClick={() => setShowChannels(!showChannels)}
            >
                <h3 className="font-semibold flex items-center gap-2">
                    <FaChevronRight /> Channels
                </h3>
                {showChannels ? <FaChevronDown /> : <FaChevronRight />}
            </div>

            {/* ---------------------------
                CHANNELS LIST
            ---------------------------- */}
            {showChannels && (
                <div className="mt-2 space-y-1">
                    {channels.map((ch) => {
                        const isActive = activeChannel === ch.id;

                        return (
                            <div
                                key={ch.id}
                                onClick={() => {
                                    setActiveChannel(ch.id);
                                    setActiveUser(null);

                                    setActiveChat({
                                        type: "channel",
                                        title: ch.name,
                                        channelId: ch.id,
                                    });
                                }}
                                className={`px-2 py-2 rounded-md cursor-pointer 
                                ${
                                    isActive
                                        ? "bg-gray-200"
                                        : "hover:bg-gray-100"
                                }`}
                            >
                                #{ch.name}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ---------------------------
                CREATE CHANNEL MODAL
            ---------------------------- */}
            <Dialog
                header="Create Channel"
                visible={openCreateModal}
                onHide={() => setOpenCreateModal(false)}
                style={{ width: "30vw" }}
            >
                <div className="space-y-4 mt-4">
                    <input
                        type="text"
                        value={newChannelName}
                        onChange={(e) => setNewChannelName(e.target.value)}
                        placeholder="Enter channel name"
                        className="w-full p-2 border rounded"
                    />

                    <MultiSelect
                        value={selectedEmployee}
                        onChange={(e) => setSelectedEmployee(e.value)}
                        options={msEmployees}
                        filter
                        placeholder="Select Employees"
                        className="w-full border rounded"
                    />

                    <button
                        onClick={handleCreateChannel}
                        className="w-full bg-blue-600 text-white py-2 rounded"
                    >
                        Create
                    </button>
                </div>
            </Dialog>
        </div>
    );
}
