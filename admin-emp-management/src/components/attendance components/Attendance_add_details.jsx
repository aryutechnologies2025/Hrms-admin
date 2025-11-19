import React, { useState, useEffect, useRef } from "react";

import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
DataTable.use(DT);

import axios from "../../api/axiosConfig";
import { API_URL } from "../../config";
// import { capitalizeFirstLetter } from "../../StringCaps";
import { TfiPencilAlt } from "react-icons/tfi";
import { RiDeleteBin6Line } from "react-icons/ri";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";
import Footer from "../../components/Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FileUpload } from "primereact/fileupload";
import { MultiSelect } from "primereact/multiselect";
import { FaEye } from "react-icons/fa";
import { Editor } from "primereact/editor";
import { FaTrash } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import Attendance_add_main from "./Attendance_add_main";
import { IoClose } from "react-icons/io5";
import Loader from "../Loader";
import { dateUtils } from "../../utils/dateUtils";

const Attendance_add_details = () => {
  const navigate = useNavigate();
  const formatDateTime = dateUtils();

  // const location = useLocation();

  const employeeIds = window.location.pathname.split("/")[2];
  console.log("window.location.pathname", employeeIds);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);

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

  // Fetch roles from the API
  useEffect(() => {
    fetchProject();
  }, []);

  //   const [status, setStatus] = useState("");
  const storedDetatis = localStorage.getItem("hrmsuser");
  const parsedDetails = JSON.parse(null);
  const userid = parsedDetails ? parsedDetails.id : null;
  const [errors, setErrors] = useState({});

  const [clientdetails, setClientdetails] = useState([]);
  console.log("clientdetails", clientdetails);

  const fetchProject = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/attendance/view-mark-by-admin`
      );

      setClientdetails(response.data);
      setLoading(false);
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
  // };

  const [employeeOption, setEmployeeOption] = useState(null);

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
      // console.log("response", response.data.data);

      const employeeemail = response.data.data.map((emp) => ({
        label: emp.employeeName,
        value: emp._id,
        data: emp, //
      }));
      // console.log("employeeemail", response.data.data);
      setEmployeeOption(employeeemail);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    //  fetchProjectleave();
    fetchEmployeeList();
  }, []);

  // Top of your component
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
  const [date, setDate] = useState("");
  const [loginTime, setLoginTime] = useState("");
  const [logoutTime, setLogoutTime] = useState("");
  const [notes, setNotes] = useState("");

  //   const [errors, setErrors] = useState({});

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const loginDateObj = new Date(`${date}T${loginTime}`);
      const logoutDateObj = new Date(`${date}T${logoutTime}`);
      console.log("dates", loginDateObj, logoutDateObj);

      const formData = {
        employeeId: selectedEmployeeDetails,
        dateTime: date,
        shift: "Day Shift",
        workType: "OD",
        login: loginDateObj.toISOString(),
        logout: logoutDateObj.toISOString(),
        comments: notes,
      };

      const response = await axios.post(
        `${API_URL}/api/attendance/mark-by-admin`,
        formData
      );
      console.log("response:", response);
      Swal.fire({
        icon: "success",
        title: "Attendance added successfully!",
        showConfirmButton: true,
        timer: 1500,
      });

      setIsAddModalOpen(false);
      fetchProject();
      setSelectedEmployeeDetails("");
      setDate("");
      setLoginTime("");
      setLogoutTime("");
      setNotes("");
      // setStatus("");

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
  const [leaveTypeEdit, setLeaveTypeEdit] = useState("");
  const [shortCodeEdit, setShortCodeEdit] = useState("");
  const [statusEdit, setStatusEdit] = useState("");

  const [editid, setEditid] = useState([]);

  console.log("editid", editid);

  const openEditModal = (row) => {
    console.log("rowData", row);

    setEditid(row._id);
    setLeaveTypeEdit(row.type);
    setShortCodeEdit(row.shotKey);
    setStatusEdit(row.status);

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
        type: leaveTypeEdit,
        shotKey: shortCodeEdit,
        status: statusEdit,
      };

      const response = await axios.put(
        `${API_URL}/api/leaveType/edit-leavetype/${editid}`,
        formData
      );
      console.log("response:", response);
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

  // Validate Status dynamically

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
          `${API_URL}/api/leaveType/delete-leavetype/${id}`
        );
        Swal.fire("Deleted!", "The Leave has been deleted.", "success");
        console.log("res", res);
        setClientdetails((prev) => prev.filter((item) => item._id !== id));
        // fetchProject();
      } catch (err) {
        console.error("Failed to delete:", err);
        Swal.fire("Error", "There was an error deleting the Leave.", "error");
      }
    } else {
      Swal.fire("Cancelled", "Your Leave is safe :)", "info");
    }
  };

  const [contentVisible, setContentVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");

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
      data: null,
      render: (row) => row.employeeId?.employeeName || "-",
    },
    {
      title: "Work Type",
      data: "workType",
    },
    {
      title: "Date",
      data: null,
      render: (row) => {
        if (!row.date) return "-";
        return formatDateTime(row.date)
      },
    },
    {
      title: "Login Time",
      data: null,
      render: (row) => {
        const loginEntry = row.entries?.find((e) => e.reason === "Login");
        if (!loginEntry) return "-";

        const date = new Date(loginEntry.time);
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // convert 0 -> 12 for midnight
        return `${hours}:${minutes} ${ampm}`;
      },
    },

    {
      title: "Logut Time",
      data: null,
      render: (row) => {
        const loginEntry = row.entries?.find((e) => e.reason === "Logout");
        if (!loginEntry) return "-";

        const date = new Date(loginEntry.time);
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // convert 0 -> 12 for midnight
        return `${hours}:${minutes} ${ampm}`;
      },
    },

    {
      title: "Notes",
      data: null,
      render: (data, type, row) => {
        const id = `content-${row.sno || Math.random()}`;

        setTimeout(() => {
          const container = document.getElementById(id);
          if (container && !container.hasChildNodes()) {
            ReactDOM.render(
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FaEye
                  className="cursor-pointer text-black text-xl"
                  title="Open"
                  onClick={() => {
                    setSelectedContent(row.comments);
                    setContentVisible(true);
                  }}
                />
              </div>,
              container
            );
          }
        }, 0);

        return `<div id="${id}"></div>`;
      },
    },
  ];

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-2 md:pt-10">
      {loading ? (
        <Loader />
      ) : (
        <>
      <div>
        <Mobile_Sidebar />

        <div className="flex gap-2 items-center cursor-pointer text-sm">
          <p
            className=" text-gray-500 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Dashboard
          </p>
          <p>{">"}</p>
          <p
            className=" text-gray-500 cursor-pointer"
            onClick={() => navigate("/attendance")}
          >
            Attendance
          </p>
          <p>{">"}</p>
          <p className=" text-blue-500">Attendance Add</p>
        </div>

        {/* Add Button */}
        <div className="flex justify-between mt-8 mb-3">
          <h1 className="text-2xl md:text-3xl font-semibold">Attendance Add</h1>
          <button
            onClick={openAddModal}
            className=" px-3 py-2  text-white bg-blue-500 hover:bg-blue-600 font-medium w-20 rounded-2xl"
          >
            Add
          </button>
        </div>

        <div className="datatable-container">
          {/* Responsive wrapper for the table */}
          <div className="table-scroll-container" id="datatable">
            <DataTable
              data={clientdetails}
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
          {contentVisible && (
            <div
              onClick={() => setContentVisible(false)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Reason
                  </h2>
                  <button
                    onClick={() => setContentVisible(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition"
                  >
                    <IoClose className="text-xl" />
                  </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
                  <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
                    {selectedContent || "No reason provided."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
            {/* Overlay */}
            <div className="absolute inset-0 " onClick={closeAddModal}></div>

            <div
              className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${
                isAnimating ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full  mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                title="Toggle Sidebar"
                onClick={closeAddModal}
              >
                <IoIosArrowForward className="w-3 h-3" />
              </div>
              <div className="p-5">
                <h2 className="text-xl font-semibold mb-4">Add Addendance</h2>

                {/* Leave Type */}
                <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-2">
                    Employee Name<span className="text-red-500">*</span>
                  </label>
                  <Dropdown
                    value={selectedEmployeeDetails}
                    onChange={(e) => setSelectedEmployeeDetails(e.target.value)}
                    options={employeeOption}
                    optionValue="value"
                    optionLabel="label"
                    filter
                    placeholder="Select Employees"
                    maxSelectedLabels={3}
                    className="w-[50%]   border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    display="chip"
                  />
                  {errors.type && (
                    <p className="text-red-500 text-sm mb-4">{errors.type}</p>
                  )}
                </div>

                {/* date */}

                <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-2">
                    Date<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.shotKey && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.shotKey}
                    </p>
                  )}
                </div>

                <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-2">
                    Login Time<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={loginTime}
                    onChange={(e) => setLoginTime(e.target.value)}
                    className="w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.shotKey && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.shotKey}
                    </p>
                  )}
                </div>

                <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-2">
                    Log Out
                  </label>
                  <input
                    type="time"
                    value={logoutTime}
                    onChange={(e) => setLogoutTime(e.target.value)}
                    className="w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.status && (
                    <p className="text-red-500 text-sm mb-4">{errors.status}</p>
                  )}
                </div>

                <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-2">
                    Notes
                  </label>
                  <textarea
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.status && (
                    <p className="text-red-500 text-sm mb-4">{errors.status}</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={closeAddModal}
                    className="bg-red-100 hover:bg-red-200 text-sm text-red-600 px-5 py-2 font-semibold rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlesubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 font-semibold rounded-full"
                  >
                    Save
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
              className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${
                isAnimating ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full  mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                title="Toggle Sidebar"
                onClick={closeEditModal}
              >
                <IoIosArrowForward className="w-3 h-3" />
              </div>
              <div className="p-5">
                <h2 className="text-xl font-semibold mb-4">Edit Leave Type</h2>

                {/* Leave Type */}
                <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-2">
                    Leave Type
                  </label>
                  <input
                    type="text"
                    value={leaveTypeEdit}
                    onChange={(e) => setLeaveTypeEdit(e.target.value)}
                    className="w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.type && (
                    <p className="text-red-500 text-sm mb-4">{errors.type}</p>
                  )}
                </div>

                {/* Short Code */}
                <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-2">
                    Short Code
                  </label>
                  <input
                    type="text"
                    value={shortCodeEdit}
                    onChange={(e) => setShortCodeEdit(e.target.value)}
                    className="w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.shotKey && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.shotKey}
                    </p>
                  )}
                </div>

                {/* Status Dropdown */}
                <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-2">
                    Status
                  </label>
                  <select
                    value={statusEdit}
                    onChange={(e) => setStatusEdit(e.target.value)}
                    className="w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="1">Active</option>
                    <option value="0">InActive</option>
                  </select>
                  {errors.status && (
                    <p className="text-red-500 text-sm mb-4">{errors.status}</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2 mt-4">
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
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {isViewModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 px-8 rounded-xl w-[800px] h-[500px] overflow-y-auto relative">
              <div className="flex justify-between items-center ">
                <h2 className="text-lg font-semibold mb-4 flex gap-4">
                  View Project
                  {roleDetails.status == "1" ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-600 font-semibold">InActive</span>
                  )}
                </h2>
                <div
                  className="flex mb-4 text-2xl text-red-600 cursor-pointer bg-gray-200 p-1 rounded-full absolute right-2 top-2"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  <IoMdClose />
                </div>
              </div>

              <div className="card flex justify-between gap-4">
                <div className="w-[40%]">
                  <label className="block text-md font-medium mb-2">
                    Project Name :
                  </label>
                  <input
                    disabled
                    type="text"
                    value={roleDetails.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="my-2">
                    <label
                      htmlFor="employee_name"
                      className="block text-md font-medium "
                    >
                      Add Employees to the project :
                    </label>

                    {roleDetails.teamMembers.map((email, index) => (
                      <div className="text-sm mt-3 p-1 px-3 bg-gray-200 rounded-2xl inline-block ">
                        {index + 1}. {email}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-[55%]">
                  <label htmlFor="" className="text-md font-medium ">
                    Project Description :
                  </label>
                  <Editor
                    value={roleDetails.projectDescription}
                    className="text-md font-medium w-full pb-2 mt-2 rounded-lg"
                    style={{ height: "200px" }}
                    headerTemplate={true}
                    modules={{
                      toolbar: false, // Hide toolbar
                    }}
                    readOnly={true} // Make editor read-only
                  />
                </div>
              </div>
              <label
                htmlFor="demo"
                className="block text-md font-medium mb-2 mt-4 "
              >
                Uploaded Files :
              </label>

              <div className="flex flex-wrap mt-2 gap-2">
                {roleDetails?.document?.map((doc, index) => (
                  <div
                    key={index}
                    className="relative w-28 h-24 border rounded overflow-hidden group"
                  >
                    <a
                      href={`${API_URL}/api/uploads/others/${doc.filepath}`}
                      target="_blank"
                    >
                      <img
                        src={`${API_URL}/api/uploads/others/${doc.filepath}`}
                        alt={doc.originalName}
                        className="w-full h-full object-cover"
                      />
                    </a>
                    <span className="text-[10px] absolute bottom-0 left-0 bg-black text-white px-1 truncate w-full">
                      {doc.originalName}
                    </span>
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
export default Attendance_add_details;
