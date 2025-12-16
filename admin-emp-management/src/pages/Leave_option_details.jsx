import React, { useState, useEffect, useRef } from "react";

import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
DataTable.use(DT);

import axios from "../api/axiosConfig";
import { API_URL } from "../config";
// import { capitalizeFirstLetter } from "../../StringCaps";
import { TfiPencilAlt } from "react-icons/tfi";
import { RiDeleteBin6Line } from "react-icons/ri";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";
import Footer from "../components/Footer";
import Mobile_Sidebar from "../components/Mobile_Sidebar";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FileUpload } from "primereact/fileupload";
import { MultiSelect } from "primereact/multiselect";
import { FaEye } from "react-icons/fa";
import { Editor } from "primereact/editor";
import { FaTrash } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import Loader from "../components/Loader";

const Leave_option_details = () => {
  const navigate = useNavigate();

  // const location = useLocation();
  const [employeeOption, setEmployeeOption] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEmployeeList = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/employees/all-employees`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log("response",response)

      // const employeeIds = response.data.data.map(emp => `${emp.employeeId} - ${emp.employeeName}`);
      // const employeeemail = response.data.data.map((emp) => emp.email);
      const employeeemail = response.data.data.map((emp) => ({
        label: emp.employeeName, // what you show in dropdown
        value: emp._id, // or emp.employeeId (whatever your API has as unique id)
      }));
      // console.log("employeeemail", response.data.data);
      setEmployeeOption(employeeemail);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const [leave, setLeaves] = useState([]);
  // console.log("leave", leave);

  const fetchProjectleave = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/leaveType/get-leavetype `,
        {withCredentials: true}
      );
      // console.log(response);
      if (response.data.success) {
        setLeaves(response.data.data);
        setLoading(false);
      } else {
        setErrors("Failed to fetch roles.");
      }
    } catch (err) {
      setErrors("Failed to fetch roles.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectleave();
    fetchEmployeeList();
  }, []);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10); // Delay to trigger animation
  };

  const closeAddModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAddModalOpen(false), 250); // Delay to trigger animation
  };

  const closeEditModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsEditModalOpen(false), 250);
    setErrors("");
  };

  const [roles, setRoles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Fetch roles from the API
  useEffect(() => {
    fetchProject();
  }, []);

  // console.log("roles", roles);

  //   const [status, setStatus] = useState("");
  const storedDetatis = localStorage.getItem("hrmsuser");
  const parsedDetails = JSON.parse(null);
  const userid = parsedDetails ? parsedDetails.id : null;
  const [errors, setErrors] = useState({});

  const [notedetails, setNotedetails] = useState([]);
  // console.log("notedetails", notedetails);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/leave/admin-get-leave`,{withCredentials: true});
      // console.log(response);
      if (response.data.success) {
        setNotedetails(response.data.data);
        setLoading(false);
      } else {
        setErrors("Failed to fetch roles.");
      }
    } catch (err) {
      setErrors("Failed to fetch roles.");
      setLoading(false);
    }
  };

  // Open and close modals
  // const openAddModal = () => {
  //   setIsAddModalOpen(true);
  // };
  // const closeAddModal = () => {
  //   setIsAddModalOpen(false);
  //   setErrors("");
  //   setSelectedLeaveTypes({});
  // };

  //
  const [date, setDate] = useState("");
  const [enddate, setEnddate] = useState("");

  const [notes, setNotes] = useState("");
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
  // console.log("selectedEmployeeDetails",selectedEmployeeDetails)
  const [selectedLeaveType, setSelectedLeaveType] = useState("");
  const [endTime, setEndtime] = useState("");
  const [startTime, setStartTime] = useState("");

  // Auto-calculate revised salary

  //   const [errors, setErrors] = useState({});

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const today = new Date();
      const [startHours, startMinutes] = startTime.split(":");
      const [endHours, endMinutes] = endTime.split(":");

      const formattedStartTime = new Date(today);
      formattedStartTime.setHours(parseInt(startHours));
      formattedStartTime.setMinutes(parseInt(startMinutes));
      formattedStartTime.setSeconds(0);

      const formattedEndTime = new Date(today);
      formattedEndTime.setHours(parseInt(endHours));
      formattedEndTime.setMinutes(parseInt(endMinutes));
      formattedEndTime.setSeconds(0);

      const formData = {
        employeeId: selectedEmployeeDetails,
        leaveType: selectedLeaveType,
        startDate: date,
        endDate: enddate,
        note: notes,
        // subLeaveType:selectedLeaveType,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        leaveDurationType:
          selectedLeaveType == "leave" ? selectedLeaveTypes : [],
      };

      const response = await axios.post(
        `${API_URL}/api/leave/admin-add-leave`,
        formData, {withCredentials: true}
      );
      // console.log("response:", response);
      Swal.fire({
        icon: "success",
        title: "Leave added successfully!",
        showConfirmButton: true,
        timer: 1500,
      });

      setIsAddModalOpen(false);
      fetchProject();
      setDate("");

      setSelectedEmployeeDetails("");
      setSelectedLeaveType("");
      setEnddate("");
      setNotes("");
      setStartTime("");
      setEndtime("");
      setSelectedLeaveTypes({});

      //   fetchProject();
      setErrors({});
    } catch (err) {
      setErrors(err.response.data.errors);
      // if (err.response?.data?.errors) {
      //   setErrors(err.response.data.errors);
      // } else {
      //   console.error("Error submitting form:", err);
      // }
    }
  };

  //   edit

  //

  const [dateedit, setDateedit] = useState("");
  const [notesedit, setNotesedit] = useState("");
  const [enddateedit, setEnddateedit] = useState("");
  // console.log("enddateedit",enddateedit)

  const [selectedEmployeeDetailsedit, setSelectedEmployeeDetailsedit] =
    useState(null);
  // console.log("selectedEmployeeDetails",selectedEmployeeDetails)
  const [selectedLeaveTypeedit, setSelectedLeaveTypeedit] = useState("");
  const [endTimeedit, setEndtimeedit] = useState("");
  const [startTimeedit, setStartTimeedit] = useState("");

  const [leaveDurationTypeEdit, setLeaveDurationTypeEdit] = useState([]);

  const [editid, setEditid] = useState([]);

  // console.log("editid", editid);

  const openEditModal = (row) => {
    // console.log("rowData", row);
    setDateedit(row.startDate);
    setEnddateedit(row.endDate);
    setNotesedit(row.note);
    setSelectedEmployeeDetailsedit(row.employeeId?._id);
    setSelectedLeaveTypeedit(row.leaveType);
    setStartTimeedit(row.startTime);
    setEndtimeedit(row.endTime);
    setLeaveDurationTypeEdit(row.leaveDuration);

    setEditid(row._id);

    setIsEditModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  // const closeEditModal = () => {
  //   setIsEditModalOpen(false);
  //   setErrors("");
  // };

  const handlesubmitedit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        employeeId: selectedEmployeeDetailsedit,
        leaveType: "leave",
        startDate: dateedit,
        endDate: enddateedit,
        note: notesedit,
        // subLeaveType:selectedLeaveType,
        startTime: startTimeedit,
        endTime: endTimeedit,
        subLeaveType: leaveDurationTypeEdit,
      };
      const response = await axios.put(
        `${API_URL}/api/leave/update-status/${editid}`,
        formData, {withCredentials: true}
      );
      // console.log("response:", response);
      Swal.fire({
        icon: "success",
        title: "Leave Update successfully!",
        showConfirmButton: true,
        timer: 1500,
      });

      setIsEditModalOpen(false);
      fetchProject();

      //   fetchProject();
      setErrors({});
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error("Error submitting form:", err);
      }
    }
  };

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

  // Validate Status dynamically

  const handleDelete = async (id) => {
    // console.log("editid", id);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this Leave?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(
          `${API_URL}/api/leave/delete-leave/${id}`,
          {withCredentials: true}
        );
        Swal.fire("Deleted!", "The Leave has been deleted.", "success");
        // console.log("res", res);
        // setNotedetails((prev) => prev.filter((item) => item._id !== _id));
        // fetchProject();
        fetchProject();
      } catch (err) {
        console.error("Failed to delete:", err);
        Swal.fire("Error", "There was an error deleting the Leave.", "error");
      }
    } else {
      Swal.fire("Cancelled", "Your Leave is safe :)", "info");
    }
  };

  const columns = [
    {
      title: "Sno",
      data: null,
      render: function (data, type, row, meta) {
        return meta.row + 1;
      },
    },
    {
      title: "Employee Name",
      data: "employeeId",
      render: (data) => (data && data.employeeName ? data.employeeName : "-"),
    },

    {
      title: "StartDate",
      data: "startDate",
      render: (data) => {
        if (!data) return "";
        return new Date(data).toLocaleDateString("en-GB");
      },
    },
    {
      title: "Date",
      data: "endDate",
      render: (data) => {
        if (!data) return "";
        return new Date(data).toLocaleDateString("en-GB");
      },
    },
    {
      title: "Leave Type",
      data: "leaveDuration",
      render: (data) => (data && data.length > 0 ? data[0].subLeaveType : "-"),
    },
    {
      title: "Duration",
      data: null,
      render: (data, type, row) => {
        if (!row.startTime || !row.endTime) return "-";
        return `${row.startTime} - ${row.endTime}`;
      },
    },

    {
      title: "Note",
      data: "note",
      render: (data) => data || "-",
    },

    {
      title: "Action",
      data: null,
      render: (data, type, row) => {
        const id = `actions-${row.sno || Math.random()}`;
        setTimeout(() => {
          const container = document.getElementById(id);
          if (container && !container.hasChildNodes()) {
            ReactDOM.render(
              <div
                className="action-container"
                style={{
                  display: "flex",
                  gap: "15px",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                {/* <div className="cursor-pointer">
                  <FaEye

                  />
                </div> */}
                <div
                  className="modula-icon-edit  flex gap-2"
                  style={{
                    color: "#000",
                  }}
                >
                  <TfiPencilAlt
                    className="cursor-pointer"
                    onClick={() => openEditModal(row)}
                  />
                  <MdOutlineDeleteOutline
                    className="text-red-600 text-xl cursor-pointer"
                    onClick={() => handleDelete(row._id)}
                  />
                </div>

                {/* <div className="modula-icon-del" style={{
                  color: "red"
                }}>
                  <RiDeleteBin6Line
                    onClick={() => handleDelete(row.id)}
                  />
                </div> */}
              </div>,
              container
            );
          }
        }, 0);
        return `<div id="${id}"></div>`;
      },
    },
  ];

  // conutry list

  //   const [selectedCountry, setSelectedCountry] = useState(null);

  const getDateRange = (start, end) => {
    const range = [];
    let current = new Date(start);
    const endDate = new Date(end);

    while (current <= endDate) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, "0");
      const day = String(current.getDate()).padStart(2, "0");

      range.push(`${year}-${month}-${day}`);

      current.setDate(current.getDate() + 1);
    }

    return range;
  };

  const dateRange =
    date && enddate && selectedLeaveType === "leave"
      ? getDateRange(date, enddate)
      : [];

  const [selectedLeaveTypes, setSelectedLeaveTypes] = useState({});
  // console.log("selectedLeaveTypes", selectedLeaveTypes);
  const handleLeaveTypeChange = (date, value) => {
    setSelectedLeaveTypes((prev) => ({
      ...prev,
      [date]: value,
    }));
  };

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-2 md:pt-10">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>


            <div className="cursor-pointer">
              <Mobile_Sidebar />
              
            </div>
            <div className="flex justify-end mt-2 md:mt-0 gap-1 items-center ">
                <p
                  className="text-sm text-gray-500"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </p>
                <p>{">"}</p>

                <p
                  onClick={() => navigate("/leaves")}
                  className="text-sm text-gray-500 cursor-pointer "
                >
                  Leave
                </p>
                <p>{">"}</p>

                <p className="text-sm text-blue-500">Add Leave</p>
              </div>

            {/* Add Button */}
            <div className="flex justify-between mt-2 md:mt-4 mb-1 md:mb-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold">Add Leave</h1>
              </div>
              <div className="flex justify-between gap-2 ">
                <button
                  onClick={() =>
                    navigate(-1)
                  }
                  className="bg-gray-500 hover:bg-gray-600  px-2 md:px-3 py-2  text-white font-medium w-20 rounded-2xl"
                >
                  Back
                </button>
                <button
                  onClick={openAddModal}
                  className=" px-2 md:px-3 py-2  text-white bg-blue-500 hover:bg-blue-600 font-medium w-20 rounded-2xl"
                >
                  Add
                </button>
                </div>
              </div>

              <div className="datatable-container">
                {/* Responsive wrapper for the table */}
                <div className="table-scroll-container" id="datatable">
                  <DataTable
                    data={notedetails}
                    columns={columns}
                    options={{
                      paging: true,
                      searching: true,
                      ordering: true,
                      scrollX: true,
                      responsive: true,
                      autoWidth: false,
                    }}
                    className="display nowrap bg-white"
                  />
                </div>
              </div>
              {/* Add Modal */}
              {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
                  {/* Overlay */}
                  <div className="absolute inset-0 " onClick={closeAddModal}></div>

                  <div
                    className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
                      }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full  mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                      title="Toggle Sidebar"
                      onClick={closeAddModal}
                    >
                      <IoIosArrowForward className="w-3 h-3" />
                    </div>{" "}
                    <div className="p-3 md:p-5">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold ">Add Leave Option</h2>
                        {/* <button
                    onClick={closeAddModal}
                    className="text-[22px] hover:bg-red-200 duration-300 bg-red-100 text-red-600 rounded-full p-1"
                  >
                    <IoClose />
                  </button> */}
                      </div>

                      {/* add employee */}

                      <div className="mb-3 flex justify-between ">
                        <label
                          htmlFor="employee_name"
                          className="block text-sm font-medium mb-2"
                        >
                          Employee Name
                        </label>

                        <Dropdown
                          value={selectedEmployeeDetails}
                          onChange={(e) => setSelectedEmployeeDetails(e.target.value)}
                          options={employeeOption}
                          // optionLabel="email"
                          filter
                          placeholder="Select Employees"
                          maxSelectedLabels={3}
                          className="w-[50%]   border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          display="chip"
                        />
                      </div>
                      <div className="mb-3 flex justify-between">
                        <label className="font-medium text-sm  mb-1 block">
                          Select Type
                        </label>
                        <select
                          value={selectedLeaveType}
                          onChange={(e) => setSelectedLeaveType(e.target.value)}
                          className="border-2 rounded-xl px-4 text-sm border-gray-300 outline-none h-10 w-[50%]"
                        >
                          <option value="" disabled>
                            Select Type
                          </option>
                          <option value="leave">Leave</option>
                          <option value="Permission">Permission</option>
                        </select>
                      </div>

                      <div className="gap-2">
                        {" "}
                        <div className="mb-3 flex justify-between w-full ">
                          <label className="block text-sm font-medium mb-2">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        {errors.date && (
                          <p className="text-red-500 text-sm mb-4">{errors.date}</p>
                        )}
                        <div className="mb-3 flex justify-between w-full">
                          <label className="block text-sm font-medium mb-2">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={enddate}
                            onChange={(e) => setEnddate(e.target.value)}
                            className="w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        {errors.date && (
                          <p className="text-red-500 text-sm mb-4">{errors.date}</p>
                        )}
                      </div>

                      {selectedLeaveType === "leave" && (
                        <>
                          <div className="flex justify-between">
                            <label htmlFor="" className="text-sm font-medium mb-2">
                              Leave Duration
                            </label>
                            <div className="flex flex-col">
                              {dateRange.map((d) => (
                                <div key={d} className="mb-4 flex gap-4 items-center">
                                  <label className="no-wr font-medium text-sm mb-1">
                                    {d}
                                  </label>
                                  <select
                                    value={selectedLeaveTypes[d] || ""}
                                    onChange={(e) =>
                                      handleLeaveTypeChange(d, e.target.value)
                                    }
                                    className="border-2 rounded-xl px-4 text-sm border-gray-300 outline-none h-10 w-[220px]"
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
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                      {/* timing */}
                      {selectedLeaveType === "Permission" && (
                        <div className=" gap-2 ">
                          {" "}
                          <div className="mb-3 flex justify-between w-full">
                            <label className="block text-sm font-medium mb-2">
                              From Time
                            </label>
                            <input
                              type="time"
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value)}
                              className="w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          {/* {errors.date && (
                    <p className="text-red-500 text-sm mb-4">{errors.date}</p>
                  )} */}
                          <div className="mb-3 flex justify-between w-full">
                            <label className="block text-sm font-medium mb-2">
                              To Time
                            </label>
                            <input
                              type="time"
                              value={endTime}
                              onChange={(e) => setEndtime(e.target.value)}
                              className="w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          {/* {errors.date && (
                    <p className="text-red-500 text-sm mb-4">{errors.date}</p>
                  )} */}
                        </div>
                      )}
                      <div className="mb-3 flex justify-between">
                        <label className="block text-sm font-medium mb-2">
                          Notes
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={4}
                        ></textarea>
                      </div>
                      {errors.notes && (
                        <p className="text-red-500 text-sm mb-4">{errors.notes}</p>
                      )}

                      {/* Buttons */}
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={closeAddModal}
                          className="bg-red-100 duration-300 hover:bg-red-200 text-sm text-red-600 px-5 py-2 font-semibold rounded-full"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handlesubmit}
                          className="bg-blue-600 duration-300 hover:bg-blue-700 text-white px-5 py-2 font-semibold rounded-full"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Modal */}
              {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
                  {/* Overlay */}
                  <div className="absolute inset-0 " onClick={closeEditModal}></div>

                  <div
                    className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
                      }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full  mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                      title="Toggle Sidebar"
                      onClick={closeEditModal}
                    >
                      <IoIosArrowForward className="w-3 h-3" />
                    </div>{" "}
                    <div className="p-5">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold ">Edit Leave</h2>
                        {/* <button
                    onClick={closeEditModal}
                    className="text-[22px] hover:bg-red-200 duration-300 bg-red-100 text-red-600 rounded-full p-1"
                  >
                    <IoClose />
                  </button> */}
                      </div>
                      <div className="mb-3 flex justify-between">
                        <label
                          htmlFor="employee_name"
                          className="block text-sm font-medium mb-2"
                        >
                          Employee Name
                        </label>

                        <Dropdown
                          value={selectedEmployeeDetailsedit}
                          onChange={(e) =>
                            setSelectedEmployeeDetailsedit(e.target.value)
                          }
                          options={employeeOption}
                          // optionLabel="email"
                          filter
                          placeholder="Select Employees"
                          maxSelectedLabels={3}
                          className="w-[50%]   border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          display="chip"
                          disabled
                        />
                      </div>

                      <div className="mb-3 flex justify-between">
                        <label className="font-medium text-sm  mb-1 block">
                          Select Type
                        </label>
                        <select
                          value={selectedLeaveTypeedit}
                          onChange={(e) => setSelectedLeaveTypeedit(e.target.value)}
                          className="border-2 rounded-xl px-2 md:px-4 text-sm border-gray-300 outline-none h-10 w-[50%]"
                          disabled
                        >
                          <option value="" disabled>
                            Select Type
                          </option>
                          <option value="leave">Leave</option>
                          <option value="Permission">Permission</option>
                        </select>
                      </div>
                      <div className=" gap-2">
                        {" "}
                        <div className="mb-3 w-full flex justify-between">
                          <label className="block text-sm font-medium mb-2">
                            Start Date
                          </label>
                          <input
                            type="date"
                            // value={dateedit}
                            value={
                              dateedit
                                ? new Date(dateedit).toISOString().split("T")[0]
                                : ""
                            }
                            onChange={(e) => setDateedit(e.target.value)}
                            className="w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled
                          />
                        </div>
                        {errors.date && (
                          <p className="text-red-500 text-sm mb-4">{errors.date}</p>
                        )}
                        <div className="mb-3 w-full flex justify-between">
                          <label className="block text-sm font-medium mb-2">
                            End Date
                          </label>
                          <input
                            type="date"
                            // value={enddateedit}
                            value={
                              enddateedit
                                ? new Date(enddateedit).toISOString().split("T")[0]
                                : ""
                            }
                            onChange={(e) => setEnddateedit(e.target.value)}
                            className="w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled
                          />
                        </div>
                        {errors.date && (
                          <p className="text-red-500 text-sm mb-4">{errors.date}</p>
                        )}
                      </div>

                      {selectedLeaveTypeedit === "leave" && (
                        <div className="flex flex-wrap justify-between">
                          <label htmlFor="" className="text-sm font-medium mb-2">
                            Leave Duration
                          </label>
                          <div className="flex flex-col">
                            {leaveDurationTypeEdit.map((d, index) => (
                              <div
                                key={d.date || index}
                                className="mb-4 md:ml-2 flex items-center"
                              >
                                <label className="no-wr w-full font-medium text-sm mb-1">
                                  {d.date.split("T")[0]}
                                </label>
                                <select
                                  value={d.subLeaveType || ""}
                                  onChange={(e) =>
                                    setLeaveDurationTypeEdit((prev) => {
                                      const updated = [...prev];
                                      updated[index].subLeaveType = e.target.value;
                                      return updated;
                                    })
                                  }
                                  className="border-2 rounded-xl px-7 md:px-4 py-2 ml-9 md:ml-0 text-sm border-gray-300 outline-none h-10 w-full"
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
                            ))}
                          </div>
                        </div>
                      )}

                      {/* timing */}
                      {selectedLeaveTypeedit === "Permission" && (
                        <div className=" gap-2 ">
                          {" "}
                          <div className="mb-3 w-full flex justify-between">
                            <label className="block text-sm font-medium mb-2">
                              From Time
                            </label>
                            <input
                              type="time"
                              value={
                                startTimeedit
                                  ? convertTo24Hour(startTimeedit) // "01:51:00 PM" → "13:51"
                                  : ""
                              }
                              onChange={(e) => setStartTimeedit(e.target.value)}
                              className="w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          {/* {errors.date && (
                    <p className="text-red-500 text-sm mb-4">{errors.date}</p>
                  )} */}
                          <div className="mb-3 w-full flex justify-between">
                            <label className="block text-sm font-medium mb-2">
                              To Time
                            </label>
                            <input
                              type="time"
                              value={
                                endTimeedit
                                  ? convertTo24Hour(endTimeedit) // "01:51:00 PM" → "13:51"
                                  : ""
                              }
                              onChange={(e) => setEndtimeedit(e.target.value)}
                              className="w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          {/* {errors.date && (
                    <p className="text-red-500 text-sm mb-4">{errors.date}</p>
                  )} */}
                        </div>
                      )}
                      <div className="mb-3 flex justify-between">
                        <label className="block text-sm font-medium mb-2">
                          Notes
                        </label>
                        <textarea
                          value={notesedit}
                          onChange={(e) => setNotesedit(e.target.value)}
                          className="w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={4}
                        ></textarea>
                      </div>
                      {errors.notes && (
                        <p className="text-red-500 text-sm mb-4">{errors.notes}</p>
                      )}

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={closeEditModal}
                          className="bg-red-100 hover:bg-red-200 text-sm text-red-600 px-5 py-2 font-semibold rounded-full"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handlesubmitedit}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 font-semibold rounded-full"
                        >
                          Update
                        </button>
                      </div>
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
      export default Leave_option_details;
