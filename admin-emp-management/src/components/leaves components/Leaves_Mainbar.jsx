import React, { useRef } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useEffect, useState } from "react";
import { BsBellFill } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import Footer from "../Footer";
import axios from "axios";
import { API_URL } from "../../config";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css"; // PrimeReact theme
import "primereact/resources/primereact.min.css"; // PrimeReact core CSS
import { InputText } from "primereact/inputtext";
import Mobile_Sidebar from "../Mobile_Sidebar";
import Loader from "../Loader";
import { TfiPencilAlt } from "react-icons/tfi";
import Swal from "sweetalert2";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { useDateUtils  } from "../../hooks/useDateUtils";


const Leaves_Mainbar = () => {
  const formatDateTime = useDateUtils();

  const [globalFilter, setGlobalFilter] = useState("");
  const [approvedRejectedList, setApprovedRejectedList] = useState([]);
  console.log("approvedRejectedList", approvedRejectedList);
  const [pendingRequestList, setPendingRequestList] = useState([]);
  console.log("pendingRequestList", pendingRequestList);

  const [loading, setLoading] = useState(true); // State to manage loading
  const [leaveRequestNotesToEmployee, setLeaveRequestNotesToEmployee] =
    useState("");
  const [selectedLeaveType, setSelectedLeaveType] = useState([]);

  const [selectedId, setSelectedId] = useState(null);
  console.log("selectedId", selectedId);

  const [showModal, setShowModal] = useState(false);
  const [dropdownValue, setDropdownValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [permissionStartTime, setPermissionStartTime] = useState("");
  const [permissionEndTime, setPermissionEndTime] = useState("");

  const [leaveType, setLeavetype] = useState("");
  const [subleavetype, setSubleavetype] = useState([]);
  let navigate = useNavigate();
  const handleEditClick = (rowData) => {
    console.log("Clicked row ID:", rowData);
    setLeavetype(rowData.leaveType);
    setSubleavetype(rowData.leaveDuration);
    setSelectedId(rowData._id);
    setDropdownValue(rowData.status);
    setTextareaValue(rowData.note);
    setStartDate(rowData.startDate || "");
    setEndDate(rowData.endDate || "");
    setPermissionStartTime(rowData.startTime || "");
    setPermissionEndTime(rowData.endTime || "");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    // console.log("Dropdown:", dropdownValue);
    // console.log("Textarea:", textareaValue);
    // console.log("ID:", selectedId);

    try {
      const response = await axios.put(
        `${API_URL}/api/leave/update-status/${selectedId}`,
        {
          status: dropdownValue,
          note: textareaValue,
          subLeaveType: subleavetype,
          startDate: startDate,
          endDate: endDate,
          startTime: permissionStartTime,
          endTime: permissionEndTime,
        }
      );

      // console.log("Response:", response.data);
      setShowModal(false);

      Swal.fire({
        icon: "success",
        title: "Updated successfully!",
        text: "Leave status has been updated.",
        confirmButtonText: "OK",

        // Reload the page after Swal confirmation
      });
      fetchApproveRejectList();
    } catch (error) {
      console.error("API Error:", error);

      // Optional: Show error alert
      Swal.fire({
        icon: "error",
        title: "Update failed!",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  const handleDelete = async (id) => {
    // console.log("editid", id);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this leave?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(
          `${API_URL}/api/leave/delete-leave/${id}`
        );
        Swal.fire("Deleted!", "The leave has been deleted.", "success");
        console.log("res", res);
        setApprovedRejectedList((prev) =>
          prev.filter((item) => item._id !== id)
        );
        // fetchProject();
      } catch (err) {
        console.error("Failed to delete:", err);
        Swal.fire("Error", "There was an error deleting the Leave.", "error");
      }
    } else {
      Swal.fire("Cancelled", "Your Client is safe :)", "info");
    }
  };

  const [reasonVisible, setReasonVisible] = useState(false);
  const [reason, setReason] = useState("");
  const [subLeaveTypeVisible, setSubLeaveTypeVisible] = useState(false);
  const [subLeaveType, setSubLeaveType] = useState("");

  const [noteContent, setNoteContent] = useState("");
  const [noteVisible, setNoteVisible] = useState(false);

  const columns = [
    {
      field: "S.No",
      header: "S.No",
      body: (_rowData, { rowIndex }) => rowIndex + 1,
    },
    {
      field: "profile",
      header: "Employee Id",
      body: (rowData) => rowData.employeeId?.employeeId || "-",
    },
    {
      field: "employeeName",
      header: "Name",
      body: (rowData) => rowData.employeeId?.employeeName || "-",
    },
    // {
    //   field: "role_name",
    //   header: "Role",
    // },
    // { field: "department", header: "Department" },
    { field: "leaveType", header: "Type" },
    {
      field: "subLeaveType",
      header: "Leave Type",
      body: (rowData) => {
        return (
          <button
            className="p-button-text  p-button-sm"
            onClick={() => {
              setSubLeaveType(rowData.leaveDuration);
              setSubLeaveTypeVisible(true);
            }}
          >
            <FaEye />
          </button>
        );
      },
    },
    {
      field: "period",
      header: "Period",
      body: (rowData) => {
       

        return (
          <div>
            {formatDateTime(rowData.startDate)} - {formatDateTime(rowData.endDate)}
          </div>
        );
      },
    },

    {
      field: "duration",
      header: "Duration",
      body: (rowData) => {
        return rowData.startTime !== null && rowData.endTime != null ? (
          <div>
            {rowData.startTime} - {rowData.endTime}
          </div>
        ) : (
          <div>-</div>
        );
      },
    },
    {
      field: "leaveReason",
      header: "Reason",
      body: (rowData) => {
        return (
          <button
            className="p-button-text p-button-sm"
            onClick={() => {
              setReason(rowData);
              setReasonVisible(true);
            }}
          >
            <FaEye />
          </button>
        );
      },
    },
    {
      field: "status",
      header: "Status",
      body: (rowData) => {
        const textAndBorderColor = rowData.status
          .toLowerCase()
          .includes("new leave")
          ? "text-blue-600 border rounded-full border-blue-600 font-size: 12px; font-weight: 500 "
          : rowData.status.toLowerCase().includes("approved")
            ? "text-green-600 border rounded-full border-green-600 font-size: 12px; font-weight: 500"
            : rowData.status.toLowerCase().includes("pending")
              ? "text-yellow-600 border rounded-full border-yellow-600 font-size: 12px; font-weight: 500"
              : rowData.status.toLowerCase().includes("new leave")
                ? "text-blue-600 border rounded-full border-blue-600 font-size: 12px; font-weight: 500"
                : "text-red-600 border rounded-full border-red-600 font-size: 12px; font-weight: 500";
        return (
          <div
            style={{
              display: "inline-block",
              padding: "2px",
              // color: textAndBorderColor,
              // border: `1px solid ${textAndBorderColor}`,

              textAlign: "center",
              width: "100px",
              fontSize: "16px",
            }}
            className={`capitalize ${textAndBorderColor}`}
          >
            {rowData.status}
          </div>
        );
      },
    },
    // { field: "note", header: "Notes", body: (rowData) => rowData.note || "-" },
    // States

    {
      field: "note",
      header: "Notes",
      body: (rowData) => {
        return (
          <button
            className="p-button-text p-button-sm"
            onClick={() => {
              setNoteContent(rowData || "");
              setNoteVisible(true);
            }}
          // disabled={!rowData.note} // optional: disable if no note
          >
            <FaEye />
          </button>
        );
      },
    },
    {
      field: "",
      header: "Action",
      body: (rowData) => (
        <div className="flex justify-center gap-4 text-xl">
          <TfiPencilAlt
            className="text-blue-600 cursor-pointer hover:text-blue-800"
            onClick={() => handleEditClick(rowData)}
          />

          <MdOutlineDeleteOutline
            className="text-red-600 cursor-pointer hover:text-red-800"
            onClick={() => handleDelete(rowData._id)}
          />
        </div>
      ),
    },
  ];

  const [addLeaveRequestModalOpen, setAddLeaveRequestModalOpen] =
    useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const openAddLeaveRequestModal = () => {
    if (pendingRequestList.length > 0) {
      setAddLeaveRequestModalOpen(true);
      setTimeout(() => setIsAnimating(true), 10); // Delay to trigger animation
    }
  };
  const closeAddLeaveRequestModal = () => {
    setExpandedIndex(null);
    setIsAnimating(false);
    setTimeout(() => setAddLeaveRequestModalOpen(false), 250); // Delay to trigger animation
  };

  const [expandedIndex, setExpandedIndex] = useState(null);
  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const fetchApproveRejectList = async () => {
    try {
      let response = await axios.get(`${API_URL}/api/leave/all-approve-reject`);
      setApprovedRejectedList(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const [allleavecount, setAllleavecount] = useState([]);
  console.log("allleavecount", allleavecount);

  const fetchPendingRequestList = async () => {
    try {
      setLoading(true);
      let response = await axios.get(
        `${API_URL}/api/leave/all-leave-pending-list`,
        {
          // headers: {
          //   Authorization: `Bearer ${localStorage.getItem("token")}`,
          // },
          params: {
            status: "pending",
          },
        }
      );
      console.log("responseaaa", response)
      setPendingRequestList(response.data.data);
      setAllleavecount(response.data.leaveSettings[0]);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchApproveRejectList();
    fetchPendingRequestList();
  }, []);

  const onCLickApprovedOrRejectButton = async (status, id, index) => {
    try {
      console.log("test ", pendingRequestList);

      let response = await axios.put(
        `${API_URL}/api/leave/update-status/${id}`,
        {
          status: status,
          note: leaveRequestNotesToEmployee,
          subLeaveType: pendingRequestList[index].leaveDuration,
        }
      );
      fetchPendingRequestList();
      fetchApproveRejectList();
      setLeaveRequestNotesToEmployee("");
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeSelect = async (e) => {
    try {
      let response = await axios.get(
        `${API_URL}/api/emp-attendances/leave-filter`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            leave_type: e.target.value,
          },
        }
      );

      // console.log(response.data.data);
      setApprovedRejectedList(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Add or remove the 'overflow-hidden' class on the <body> based on modal state
    if (addLeaveRequestModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Clean up on component unmount
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [addLeaveRequestModalOpen]);

  const [isVisible, setIsVisible] = useState(true);

  const handleReject = (status, id, index) => {
    setIsVisible(false);
    setTimeout(() => {
      onCLickApprovedOrRejectButton(status, id, index);
      setIsVisible(true);
    }, 300);
  };

  const handleApprove = (status, id, index) => {
    setIsVisible(false);
    setTimeout(() => {
      onCLickApprovedOrRejectButton(status, id, index);
      setIsVisible(true);
    }, 300);
  };

  const [leave, setLeaves] = useState([]);
  console.log("leave", leave);

  const fetchProject = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/leaveType/get-leavetype `
      );
      console.log(response);
      if (response.data.success) {
        setLeaves(response.data.data);
      } else {
        setErrors("Failed to fetch roles.");
      }
    } catch (err) {
      setErrors("Failed to fetch roles.");
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  function convertTo24Hour(timeStr) {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes, seconds] = time.split(":");

    hours = parseInt(hours, 10);
    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  }

  function capitalizeFirstLetter(string) {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  return (
    <div className="flex flex-col justify-between overflow-x-hidden bg-gray-100 px-5 pt-2 md:pt-5 min-h-screen  w-screen">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <Mobile_Sidebar />

            {/* breadcrumb */}
            <div className="flex gap-2 items-center cursor-pointer md:mt-4">
              <p
                className="text-sm text-gray-500"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </p>
              <p>{">"}</p>

              <p className="text-sm text-blue-500">Leaves</p>
            </div>
            

            <div>
              <div className="flex flex-wrap md:flex-row justify-between">
                <span className="text-2xl md:text-3xl font-semibold mt-2 md:mt-8">
                  Leaves
                </span>

                <div className="relative md:mt-8 flex ">
                  {/* Desktop Buttons */}
                  <div className="hidden md:flex flex-wrap items-center gap-5">
                    <NavLink
                      to="/leave-option"
                      className="px-7 py-2 font-medium rounded-full text-white bg-blue-500 hover:bg-blue-600"
                    >
                      Add Leave
                    </NavLink>
                    <NavLink
                      to="/leave-type"
                      className="px-7 py-2 font-medium rounded-full text-white bg-blue-500 hover:bg-blue-600"
                    >
                      Leave Type
                    </NavLink>
                    <NavLink
                      to="/leave-report"
                      className="px-7 py-2 font-medium rounded-full text-white bg-blue-500 hover:bg-blue-600"
                    >
                      Leave Report
                    </NavLink>
                    <button
                      onClick={openAddLeaveRequestModal}
                      className="px-7 py-2 font-medium rounded-full text-white bg-blue-500 hover:bg-blue-600"
                    >
                      {pendingRequestList?.length > 0
                        ? pendingRequestList.length
                        : "0"}{" "}
                      {pendingRequestList?.length > 0 ? "requests" : "request"}
                    </button>
                  </div>

                  {/* Mobile Hamburger */}
                  <div className="md:hidden relative mt-4 md:mt-0 " ref={menuRef}>
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                    >
                      {menuOpen ? <IoClose size={22} /> : <GiHamburgerMenu size={22} />}
                    </button>

                    {menuOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg p-3 flex flex-col gap-2 z-50 transition-all duration-200 ease-out transform origin-top scale-100">
                        <NavLink
                          to="/leave-option"
                          onClick={() => setMenuOpen(false)}
                          className="px-3 py-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 text-sm text-center"
                        >
                          Add Leave
                        </NavLink>
                        <NavLink
                          to="/leave-type"
                          onClick={() => setMenuOpen(false)}
                          className="px-3 py-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 text-sm text-center"
                        >
                          Leave Type
                        </NavLink>
                        <NavLink
                          to="/leave-report"
                          onClick={() => setMenuOpen(false)}
                          className="px-3 py-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 text-sm text-center"
                        >
                          Leave Report
                        </NavLink>
                        <button
                          onClick={() => {
                            openAddLeaveRequestModal();
                            setMenuOpen(false);
                          }}
                          className="px-3 py-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 text-sm text-center"
                        >
                          {pendingRequestList?.length > 0
                            ? pendingRequestList.length
                            : "0"}{" "}
                          {pendingRequestList?.length > 0 ? "requests" : "request"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* edit popup */}

            {showModal && (
              <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-[560px] h-[520px] overflow-y-auto">
                  <h2 className="text-lg font-semibold mb-4">Edit Details</h2>
                  <div className="flex flex-wrap md:flex-nowrap gap-1 md:gap-3">
                    <div className="mb-2 md:mb-4 w-full">
                      <label className="block mb-1 font-medium">Start Date</label>
                      <input
                        type="date"
                        className="w-full border-2 rounded-lg border-gray-300 px-1 md:px-3 md:py-2"
                        value={
                          startDate
                            ? new Date(startDate).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>

                    <div className="mb-2 md:mb-4 w-full">
                      <label className="block mb-1 font-medium">End Date</label>
                      <input
                        type="date"
                        className="w-full border-2 rounded-lg border-gray-300  px-1 md:px-3 md:py-2"
                        value={
                          endDate
                            ? new Date(endDate).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>

                  {leaveType === "Permission" && (
                    <div className="flex flex-wrap gap-3">
                      <div className="mb-2 md:mb-4 w-full">
                        <label className="block mb-1 font-medium">Start Time</label>
                        <input
                          type="time"
                          className="w-full border-2 rounded-lg border-gray-300  px-1 md:px-3 md:py-2"
                          // value={permissionStartTime}
                          value={
                            permissionStartTime
                              ? convertTo24Hour(permissionStartTime) // "01:51:00 PM" → "13:51"
                              : ""
                          }
                          onChange={(e) => setPermissionStartTime(e.target.value)}
                        />
                      </div>

                      <div className="mb-2 md:mb-4 w-full">
                        <label className="block md:mb-1 font-medium">End Time</label>
                        <input
                          type="time"
                          className="w-full border-2 rounded-lg border-gray-300 px-1 md:px-3 md:py-2"
                          value={
                            permissionEndTime
                              ? convertTo24Hour(permissionEndTime)
                              : ""
                          }
                          onChange={(e) => setPermissionEndTime(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                  {/* leave */}
                  {/* {leaveType === "Permission" && (
                <div className="mb-4">
                  <label className="block mb-1 font-medium">
                    Select leave Option{" "}
                  </label>
                  <select
                    className="w-full border-2 rounded-lg border-gray-300  px-3 py-2"
                    value={subleavetype}
                    onChange={(e) => setSubleavetype(e.target.value)}
                  >
                    <option value="">Status</option>
                    {leave.map((leaveType) => (
                      <option key={leaveType.shotKey} value={leaveType.shotKey}>
                        {leaveType.type}
                      </option>
                    ))}
                  </select>
                </div>
              )} */}
                  <label htmlFor="" className="block mb-1 font-medium">
                    Leave Duration
                  </label>
                  <div className="">
                    {subleavetype.map((data, lindex) => (
                      <div className="flex flex-wrap gap-4 mb-4">
                        <input
                          type="text"
                          id="startWork"
                          value={data?.date?.split("T")[0]}
                          readOnly
                          className="border-2 w-full md:w-36 text-sm rounded-xl px-4 border-gray-300 outline-none"
                        />
                        <div className="flex flex-col w-full lg:flex-row gap-1 justify-between">
                          <select
                            value={data?.subLeaveType}
                            onChange={(e) => {
                              console.log("subLeaveType", subleavetype);
                              const updated = [...subleavetype];
                              updated[lindex].subLeaveType = e.target.value;
                              console.log("updated", updated);
                              setSubleavetype(updated);
                            }}
                            className="border-2 rounded-xl px-4 text-sm border-gray-300 outline-none h-10 w-full "
                          >
                            <option value="">Select Leave Type</option>
                            {leave.map((leaveType) => (
                              <option
                                key={leaveType.shotKey}
                                value={leaveType.shotKey}
                              >
                                {leaveType.type}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <label className="block mb-1 font-medium">Select Option</label>
                    <select
                      className="w-full border-2 rounded-lg border-gray-300 px-1 md:px-3 md:py-2"
                      value={dropdownValue}
                      onChange={(e) => setDropdownValue(e.target.value)}
                    >
                      <option value="">Status</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block mb-1 font-medium">Notes</label>
                    <textarea
                      className="w-full border-2 rounded-lg border-gray-300  px-3 py-2"
                      rows="2"
                      value={textareaValue}
                      onChange={(e) => setTextareaValue(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowModal(false)}
                      className=" bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="w-full mx-auto relative">
              {/* Global Search Input */}
              <div className="md:mt-8 flex md:justify-end">
                <InputText
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Search"
                  className="px-2 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Table Container with Relative Position */}
              <div className="relative mt-4">
                {/* Loader Overlay */}
                {loading && <Loader />}

                {/* DataTable */}
                <DataTable
                  className="mt-8"
                  value={approvedRejectedList}
                  paginator
                  rows={10}
                  rowsPerPageOptions={[5, 10, 20]}
                  globalFilter={globalFilter}
                  globalFilterFields={[
                    "employeeId.employeeId",
                    "employeeId.employeeName",
                  ]}
                  showGridlines
                  resizableColumns
                  emptyMessage="No result found"
                >
                  {columns.map((col, index) => (
                    <Column
                      key={index}
                      field={col.field}
                      header={col.header}
                      body={col.body}
                      sortable
                      style={{
                        minWidth: "150px",
                        wordWrap: "break-word",
                        overflow: "hidden",
                        whiteSpace: "normal",
                      }}
                    />
                  ))}
                </DataTable>

                {reasonVisible ? (
                  <>
                    <div
                      onClick={() => setReasonVisible(!reasonVisible)}
                      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50"
                    >
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-lg shadow-lg py-6 px-8 w-[800px] max-h-[500px] overflow-y-auto"
                      >
                        <div className="flex items-center justify-between text-wrap">
                          <h2 className="text-xl font-semibold">
                            Reason{" "}
                            <span className="text-sm font-normal">
                              ({reason.employeeId.employeeName} -{" "}
                              {reason.employeeId.employeeId})
                            </span>
                          </h2>

                          <span
                            onClick={() => setReasonVisible(!reasonVisible)}
                            className="bg-gray-100 w-7 text-lg cursor-pointer h-7 flex justify-center items-center rounded-full"
                          >
                            <IoClose />
                          </span>
                        </div>
                        <p className="mt-4 text-[16px] break-words  ">
                          {reason.leaveReason}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
                {subLeaveTypeVisible ? (
                  <>
                    <div
                      onClick={() => setSubLeaveTypeVisible(!subLeaveTypeVisible)}
                      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50"
                    >
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-lg shadow-lg py-3 md:py-6 px-4 md:px-8 w-[300px] md:w-[800px] max-h-[900px] md:max-h-[500px] overflow-y-auto"
                      >
                        <div className="flex items-center justify-between text-wrap">
                          <h2 className="text-xl font-semibold">
                            LeaveType
                            {/* <span className="text-sm font-normal">
                          ({reason.employeeId.employeeName} -{" "}
                          {reason.employeeId.employeeId})
                        </span> */}
                          </h2>
                          {console.log("data 123", subLeaveType)}
                          {subLeaveType &&
                            subLeaveType.map((value, index) => {
                              return (
                                <div key={index}>
                                  <p>
                                    Date:
                                    {value.date.split("T")[0].replaceAll("-", "/")}
                                  </p>
                                  <p>subLeaveType:{value.subLeaveType}</p>
                                </div>
                              );
                            })}

                          <span
                            onClick={() => setSubLeaveTypeVisible(false)}
                            className="bg-gray-100 w-7 text-lg cursor-pointer h-7 flex justify-center items-center rounded-full"
                          >
                            <IoClose />
                          </span>
                        </div>
                        {/* <p className="mt-4 text-[16px] break-words  ">
                      {reason.leaveReason}
                    </p> */}
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}

                {noteVisible && (
                  <div
                    onClick={() => setNoteVisible(false)}
                    className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50"
                  >
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="bg-white rounded-lg shadow-lg py-3 md:py-6 px-3 md:px-8 w-[300px] md:w-[800px] max-h-[800px] md:max-h-[500px] overflow-y-auto"
                    >
                      <div className="flex items-center justify-between text-wrap">
                        <h2 className="text-xl font-semibold">Note </h2>
                        <span
                          onClick={() => setNoteVisible(false)}
                          className="bg-gray-100 w-7 text-lg cursor-pointer h-7 flex justify-center items-center rounded-full"
                        >
                          <IoClose />
                        </span>
                      </div>
                      <p className="mt-4 text-[16px] break-words">
                        {noteContent.note || "-"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {addLeaveRequestModalOpen && (
              <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
                {/* Overlay */}
                <div
                  className="absolute inset-0 "
                  onClick={closeAddLeaveRequestModal}
                ></div>

                <div
                  className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[70vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                  <div
                    className="w-6 h-6 rounded-full  mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                    title="Toggle Sidebar"
                    onClick={closeAddLeaveRequestModal}
                  >
                    <IoIosArrowForward className="w-3 h-3" />
                  </div>

                  <div className="px-5 lg:px-14 py-10">
                    <p className="text-2xl md:text-3xl font-medium">
                      Leave Request
                    </p>

                    {pendingRequestList.map((item, index) => (
                      <div className="mt-5" key={index}>
                        {/* Accordion Header */}
                        <div
                          onClick={() => toggleAccordion(index)}
                          className={`${new Date(item.startDate) <= new Date()
                              ? "bg-red-100 text-red-600"
                              : ""
                            } cursor-pointer bg-gray-100 flex flex-wrap justify-between items-center px-2 py-2 sm:px-4 sm:py-4 rounded-xl border-2 border-gray-200`}
                        >
                          <div className="flex gap-4">
                            <div className="flex flex-col sm:flex-row gap-2">
                              <span className={`font-normal md:font-medium`}>
                                {capitalizeFirstLetter(
                                  item.employeeId?.employeeName
                                )}
                              </span>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <span className="font-normal md:font-medium">
                                {capitalizeFirstLetter(item.leaveType)}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <div>
                              {formatDateTime(item?.updatedAt)}{"  "}
                              {new Date(item.updatedAt).toLocaleString("en-IN", {
                                timeZone: "Asia/Kolkata",
                                weekday: "long",
                                // year: "numeric",
                                // month: "numeric",
                                // day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                              })}
                              
                            </div>

                            <svg
                              className={`w-5 h-5 transition-transform ${expandedIndex === index ? "rotate-180" : ""
                                }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>

                        {/* Accordion Content */}
                        {expandedIndex === index && (
                          <div
                            className={`flex flex-col px-5 gap-3 mt-5 transition ease-out duration-1000 ${isVisible ? "opacity-100 " : "opacity-0 "
                              }`}
                          >
                            {/* Content here */}
                            <div className="flex flex-col lg:flex-row gap-1 justify-between">
                              {/* <div className="flex flex-col"> */}
                              <label
                                className="font-medium text-sm"
                                htmlFor="jobTitle"
                              >
                                EMPLOYEE NAME
                              </label>
                              {/* <p className="text-sm">Employee name</p> */}
                              {/* </div> */}
                              <input
                                value={item?.employeeId?.employeeName}
                                type="text"
                                readOnly
                                id="jobTitle"
                                className="border-2 rounded-xl px-4 text-sm border-gray-300 outline-none h-10 w-full md:w-96"
                              />
                            </div>

                            <div className="flex flex-col lg:flex-row gap-1 justify-between">
                              {/* <div className="flex flex-col"> */}
                              <label
                                className="font-medium text-sm"
                                htmlFor="companyName"
                              >
                                EMPLOYEE DEPARTMENT
                              </label>
                              {/* <p className="text-sm">Select Department</p> */}
                              {/* </div> */}
                              <input
                                type="text"
                                value={item?.employeeId?.roleId?.departmentId?.name}
                                readOnly
                                id="companyName"
                                className="border-2 rounded-xl px-4 text-sm border-gray-300 outline-none h-10 w-full md:w-96"
                              />
                            </div>

                            <div className="flex flex-col lg:flex-row gap-1 justify-between">
                              {/* <div className="flex flex-col"> */}
                              <label
                                className="font-medium text-sm"
                                htmlFor="companyName"
                              >
                                EMPLOYEE ROLE
                              </label>
                              {/* <p className="text-sm">Select Role</p> */}
                              {/* </div> */}
                              <input
                                type="text"
                                id="companyName"
                                value={item?.employeeId?.roleId?.name}
                                readOnly
                                className="border-2 rounded-xl px-4 text-sm border-gray-300 outline-none h-10 w-full md:w-96"
                              />
                            </div>

                            <div className="flex flex-col lg:flex-row gap-1 justify-between">
                              {/* <div className="flex flex-col"> */}
                              <label
                                className="font-medium text-sm"
                                htmlFor="previousSalary"
                              >
                                LEAVE TYPE
                              </label>
                              {/* <p className="text-sm">Select Leave Type</p> */}
                              {/* </div>/ */}
                              <input
                                type="text"
                                id="previousSalary"
                                value={item?.leaveType}
                                readOnly
                                className="border-2 rounded-xl text-sm px-4 border-gray-300 outline-none h-10 w-full md:w-96"
                              />
                            </div>

                            <div className="flex flex-col lg:flex-row gap-1 justify-between">
                              {/* <div className="flex flex-col"> */}
                              <label
                                className="font-medium text-sm"
                                htmlFor="previousSalary"
                              >
                                HOW MANY DAYS
                              </label>
                              {/* <p className="text-sm">days</p> */}
                              {/* </div> */}
                              <input
                                type="text"
                                id="previousSalary"
                                readOnly
                                value={item?.totalLeaveDays}
                                className="border-2 rounded-xl px-4 text-sm border-gray-300 outline-none h-10 w-full md:w-96"
                              />
                            </div>

                            {item.leaveType == "permission" ? (
                              <div className="flex flex-col lg:flex-row gap-1 justify-between">
                                {/* <div className="flex flex-col"> */}
                                <label
                                  className="font-medium text-sm"
                                  htmlFor="previousSalary"
                                >
                                  Total Duration
                                </label>
                                {/* <p className="text-sm">days</p> */}
                                {/* </div> */}
                                <input
                                  type="text"
                                  id="previousSalary"
                                  readOnly
                                  value={item.totalDuration}
                                  className="border-2 rounded-xl px-4 text-sm border-gray-300 outline-none h-10 w-full md:w-96"
                                />
                              </div>
                            ) : (
                              ""
                            )}

                            <div className="flex flex-col lg:flex-row gap-1 justify-between">
                              {/* <div className="flex flex-col"> */}
                              <label
                                className="font-medium text-sm"
                                htmlFor="periodOfWork"
                              >
                                PERIOD OF LEAVE
                              </label>
                              {/* <p className="text-sm">Select Period</p> */}
                              {/* </div> */}
                              <div className="">
                                <div className="flex gap-3  h-10 w-full md:w-96">
                                  <input
                                    type="text"
                                    id="startWork"
                                    value={formatDateTime(item.startDate)}
                                    readOnly
                                    className="border-2 w-[50%] text-sm rounded-xl px-4 border-gray-300 outline-none"
                                  />
                                  <input
                                    type="text"
                                    id="endWork"
                                    value={formatDateTime(item.endDate.split("T")[0])}
                                    readOnly
                                    className="border-2 w-[50%] text-sm rounded-xl px-4 border-gray-300 outline-none"
                                  />
                                </div>
                                <div className="flex gap-3  h-10 w-full md:w-96 mt-3">
                                  <input
                                    type="text"
                                    id="startWork"
                                    value={item.startTime ? item.startTime : "-"}
                                    readOnly
                                    className="border-2 w-[50%] text-sm rounded-xl px-4 border-gray-300 outline-none"
                                  />
                                  <input
                                    type="text"
                                    id="endWork"
                                    value={item.endTime ? item.endTime : "-"}
                                    readOnly
                                    className="border-2 w-[50%] text-sm rounded-xl px-4 border-gray-300 outline-none"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-1 justify-between">
                              {/* <div className="flex flex-col"> */}
                              <label
                                className="font-medium text-sm"
                                htmlFor="responsibilities"
                              >
                                LEAVE REASON
                              </label>
                              {/* <p className="text-sm">Short description</p> */}
                              {/* </div> */}

                              {/* <div className=" border-2 border-gray-300 rounded-xl  w-full md:w-96"> */}
                              <textarea
                                cols="2"
                                readOnly
                                className="border-2 rounded-xl py-2 px-4 h-[150px] text-sm border-gray-300 outline-none  w-full md:w-96"
                                value={item.leaveReason}
                              />
                              {/* </div> */}
                            </div>

                            <div className="flex flex-col lg:flex-row gap-1 justify-between">
                              <label
                                className="font-medium text-sm "
                                htmlFor="responsibilities"
                              >
                                NOTES
                              </label>
                              {/* <p className="text-sm">Short description</p> */}

                              <textarea
                                cols="2"
                                placeholder="Add notes to employee"
                                className="border-2 text-sm rounded-xl py-2 px-4  border-gray-300 outline-none  w-full md:w-96"
                                value={leaveRequestNotesToEmployee}
                                onChange={(e) =>
                                  setLeaveRequestNotesToEmployee(e.target.value)
                                }
                              />
                            </div>

                            <div className="flex flex-wrap justify-between gap-2 md:gap-">
                              <label className="font-medium text-sm " htmlFor="">
                                LEAVE DURATION
                              </label>

                              <div className="flex flex-col items-start gap-2  w-full md:w-96">
                                <div className="flex flex-wrap md:flex-nowrap gap-2 justify-start">
                                  <div className="bg-green-100 w-24 flex flex-col justify-between items-center p-2 rounded-sm">
                                    <h2>CL</h2>
                                    <span>
                                      {allleavecount.casual_leave - item.cl}/{item.cl_month}
                                    </span>
                                  </div>
                                  <div className="bg-blue-100 w-24 flex flex-col justify-between items-center p-2">
                                    <h2>CO</h2> { }
                                    <span>
                                      {allleavecount.complementary_leave - item.co}/{item.co_month}
                                    </span>
                                  </div>
                                  {allleavecount.unhappy_leave_option !== "No" && (
                                    <div className="bg-orange-100 w-24 flex flex-col justify-between items-center p-2">
                                      <h2>UH</h2>
                                      <span>
                                        {allleavecount.unhappy_leave - item.unHappy}/{item.unHappy_month}
                                      </span>
                                    </div>
                                  )}

                                  <div className="bg-purple-100 w-24 flex flex-col justify-between items-center p-2 rounded-sm">
                                    <h2>PR</h2>
                                    <span>{allleavecount.permission}/{item.permission_month}</span>
                                  </div>
                                </div>
                                {item?.leaveDuration.map((data, lindex) => (
                                  <div className="flex gap-4">
                                    <input
                                      type="text"
                                      id="startWork"
                                      value={formatDateTime(data.date)}
                                      readOnly
                                      className="border-2 w-36   text-sm rounded-xl px-4 border-gray-300 outline-none"
                                    />

                                    <div className="flex flex-col lg:flex-row gap-1 justify-between">
                                      {/* <div className="flex flex-col"> */}

                                      <select
                                        // value={selectedLeaveType}
                                        onChange={(e) => {
                                          setPendingRequestList((prev) => {
                                            const newList = [...prev]; // clone the array
                                            const updatedItem = {
                                              ...newList[index],
                                            }; // clone the object at the target index
                                            const updatedLeaveDuration = [
                                              ...updatedItem.leaveDuration,
                                            ]; // clone the leaveDuration array
                                            updatedLeaveDuration[
                                              lindex
                                            ].subLeaveType = e.target.value; // update the specific leaveDuration item
                                            updatedItem.leaveDuration =
                                              updatedLeaveDuration; // assign updated leaveDuration back
                                            newList[index] = updatedItem; // assign updated item back to the list
                                            return newList; // return the updated list
                                          });
                                        }}
                                        className="border-2 rounded-xl px-4 text-sm border-gray-300 outline-none h-10 w-full "
                                      >
                                        <option value="">Select Leave Type</option>
                                        {leave.map((leaveType) => (
                                          <option
                                            key={leaveType.shotKey}
                                            value={leaveType.shotKey}
                                          >
                                            {leaveType.type}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex flex-wrap md:justify-end gap-2 md:gap-5">
                              <button
                                onClick={
                                  () => handleApprove("approved", item._id, index)
                                  // onCLickApprovedOrRejectButton("approved", item.id)
                                }
                                className="px-8 py-2 text-sm rounded-full bg-green-600 font-bold text-white"
                              >
                                Approve
                              </button>
                              {/* <button
                            onClick={() =>
                              onCLickApprovedOrRejectButton("rejected", item.id)
                            }
                            className="px-8 py-2 text-sm rounded-full bg-red-500 font-bold text-white"
                          >
                            Reject
                          </button> */}

                              <button
                                onClick={() =>
                                  handleReject("rejected", item._id, index)
                                }
                                className="px-8 py-2 text-sm rounded-full bg-red-500 font-bold text-white hover:bg-red-600 transition-all"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      <Footer />
    </div>
  );
};

export default Leaves_Mainbar;

