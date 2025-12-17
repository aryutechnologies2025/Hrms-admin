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
import Mobile_Sidebar from "../../components/Mobile_Sidebar";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FileUpload } from "primereact/fileupload";
import { MultiSelect } from "primereact/multiselect";
import { FaEye } from "react-icons/fa";
import { Editor } from "primereact/editor";
import { FaArrowLeft, FaArrowRight, FaFolderOpen, FaTrash } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import { ImCancelCircle } from "react-icons/im";
import { FiEye, FiEyeOff } from "react-icons/fi";

const SubUserListClient = () => {
  const navigate = useNavigate();
  const employeeDetails = JSON.parse(localStorage.getItem("hrmsuser"));

  const employeeemail = employeeDetails._id;
  const superUser = employeeDetails?.superUser;
  const employeeId = employeeDetails.employeeId;
  // console.log("employeeDetails:", employeeDetails);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  // Fetch roles from the API
  useEffect(() => {
    fetchProject(1);
  }, []);

  //   const [status, setStatus] = useState("");
  const storedDetatis = localStorage.getItem("hrmsuser");
  const parsedDetails = JSON.parse(null);
  const userid = parsedDetails ? parsedDetails.id : null;

  const [taskdetails, setTaskdetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10); // entries per page
  const [totalTasks, setTotalTasks] = useState(0);

  const [projectNameFilter, setProjectNameFilter] = useState("");

  const fetchProjectlist = async (page = 1, limitValue = limit, type = "") => {
    setButtonLoading(true);
    try {
      const payload = {
        // projectId: projectNameFilter || "",
        // day: dateFilter || "",
        // toDate: toDateFilter || "",
        // taskId: taskIdFilter || "",
        page,
        // searchTerm: searchTerm || "",
        // todayTaskDate,
        // status,
        limit: limitValue || 10,
      };

      const response = await axios.get(
        `${API_URL}/api/clientsubuser/all-subusers/${employeeemail}`,
        {
          params: payload,
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const { data, pagination } = response.data;
        setTaskdetails(data);
        setCurrentPage(pagination.currentPage);
        setTotalPages(pagination.totalPages);
        setTotalTasks(pagination.totalUers || data.length);
        setLimit(limitValue);
      } else {
        setErrors("Failed to fetch subusers.");
      }
    } catch (err) {
      console.error(err);
      setErrors("Failed to fetch subusers.");
    } finally {
      setButtonLoading(false);
    }
  };

  // Open and close modals
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    // resetForm();
  };

  //sub user client
  const [projectname, setProjectName] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [password, setPassword] = useState("");
  const [subType, setSubType] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});

  const [clearTriggered, setClearTriggered] = useState(false);

  const fetchEmployeeList = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/employees/all-employees`,
        {
          withCredentials: true,
        }
      );

      // const employeeIds = response.data.data.map(emp => `${emp.employeeId} - ${emp.employeeName}`);
      // const employeeemail = response.data.data.map((emp) => emp.email);
      // console.log("employeeemail", employeeemail);
      const employeeName = response.data.data.map((emp) => ({
        label: emp.employeeName,
        value: emp._id,
      }));
      setEmployeeOption(employeeName);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjectlist(1);
    fetchEmployeeList();
  }, []);

  const [project, setProject] = useState([]);

  //  useEffect trigger to clear all filter date
  useEffect(() => {
    if (clearTriggered) {
      fetchProjectlist(1); // Refresh data
      setClearTriggered(false); // Reset trigger
    }
  }, [clearTriggered]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/project/view-projects-id`,
        {
          params: { clientId: employeeemail },
          withCredentials: true,
        }
      );
      // console.log("clientID", employeeemail);
      // console.log(response);
      if (response.data.success) {
        const projectName = response.data.data.map((emp) => ({
          label: emp.name,
          value: emp._id,
          teamMembers: emp.teamMembers,
          projectManager: emp.projectManager,
        }));
        setProject(projectName);
      } else {
        setErrors("Failed to fetch project.");
      }
    } catch (err) {
      setErrors("Failed to fetch project.");
    }
  };
  useEffect(() => {
    // fetchProjectall();
    fetchProject();
  }, []);

  //   const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("employeeemail in subuser:");

    try {
      const newErrors = {};

      // === Frontend Validation ===
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // const strongPasswordRegex =
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      // Field Validations
      if (!name.trim()) newErrors.name = "Please provide a name";

      if (!email.trim()) {
        newErrors.email = "Please provide an email";
      } else if (!emailRegex.test(email)) {
        newErrors.email = "Please provide a valid email address";
      }

      if (!password.trim()) {
        newErrors.password = "Please provide a password";
      } 

      // if (!subType.trim()) newErrors.subType = "Please provide a subtype";

      // projectname is MULTI-SELECT (Array)
      if (!projectname || projectname.length === 0) {
        newErrors.projectname = "Please select at least one project";
      }

      if (status === "") newErrors.status = "Please select a valid status";

      // If errors exist → stop
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      // console.log("projectname selected:", projectname);
      // Multi-select project list
      // const projectIds = projectname.map((item) => item.value);

      const payload = {
        name,
        email,
        password,
        projectId: projectname, // <-- fixed | sending array of project IDs
        clientId: employeeemail,
        type: "client",
        subType:"subUser",
        status,
      };

      const response = await axios.post(
        `${API_URL}/api/clientsubuser/create-subuser`,
        payload, {withCredentials: true}
      );

      // console.log("response subuser:", response);

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "User Created!",
          text: "The user has been successfully added.",
          confirmButtonColor: "#3085d6",
        });

        // Reset form
        setName("");
        setEmail("");
        setPassword("");
        setProjectName([]); // multi-select must reset to empty array
        setStatus("");
        setSubType("");
        setErrors({});

        closeAddModal();
        fetchProjectlist();
      }
    } catch (err) {
      console.error("Error submitting form:", err.response);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Something went wrong while creating the user.",
        });
      }
    }
  };

  const [userData, setUserData] = useState({
    // currentDate:"",
    id: "",
    projectId:[],
    name: "",
    status: "",
    subType: "",
    email: "",
  });

  const openEditModal = (row) => {
    // console.log("row", row);
    const ArrayofProjectId=row?.projectId?.map((item)=>item?._id);
    // console.log("ArrayofProjectId", ArrayofProjectId);
    // console.log("row.projectId", row.projectId);
    setUserData({
      id: row._id,
      projectId:ArrayofProjectId || [],
      email: row.email,
      name: row.name,
      assignTo: row.assignedTo?._id,
      status: row.status,
      subType: row.subType,
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handlesubmitedit = async (e) => {
    e.preventDefault();
    try {
      
      const newErrors = {};

      // === Frontend Validation ===
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      //  Field Validations
      if (!userData.name.trim()) newErrors.name = "Please provide a name";
      if (!userData.email.trim()) {
        newErrors.email = "Please provide an email";
      } else if (!emailRegex.test(userData.email)) {
        newErrors.email = "Please provide a valid email address";
      }

      // if (!password.trim()) {
      //   newErrors.password = "Please provide a password";
      // } else if (!strongPasswordRegex.test(password)) {
      //   newErrors.password = "Password requires letters, numbers, symbols.";
      // }


      if (!userData.projectId) newErrors.projectId = "Please select a project";

      if (userData.status === "")
        newErrors.status = "Please select a valid status";

      // If any errors exist, stop submission
      if (Object.keys(newErrors).length > 0) {
        setEditErrors(newErrors);
        return;
      }
      // console.log("aaa");
      
      const payload = {
        name: userData.name,
        email: userData.email,
        projectId: userData.projectId,
        // clientId:employeeemail,
        type: "client",
        status: userData.status,
      };

      const response = await axios.put(
        `${API_URL}/api/clientsubuser/update-subuser/${userData.id}`,
        payload, {withCredentials: true}
      );

      // console.log("response:", response);
      Swal.fire({
        icon: "success",
        title: "Client Update successfully!",
        showConfirmButton: true,
        timer: 1500,
      });

      setIsEditModalOpen(false);
      fetchProject();
      fetchProjectlist();
      setUploadedFiles([]);
      //   fetchProject();
      setEditErrors({});
    } catch (err) {
      if (err.response?.data?.errors) {
        setEditErrors(err.response.data.errors);
      } else {
        console.error("Error submitting form:", err);
      }
    }
  };

  // Validate Status dynamically
  const validateStatus = (value) => {
    const newErrors = { ...errors };
    if (!value) {
      newErrors.status = ["Status is required"];
    } else {
      delete newErrors.status;
    }
    setErrors(newErrors);
  };

  const handleDelete = async (id) => {
    // console.log("editid", id);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this task?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(
          `${API_URL}/api/clientsubuser/delete-subuser/${id}`,
          {withCredentials: true}
        );
        Swal.fire("Success", "The role has been deleted Successfully!");
        fetchProjectlist();
      } catch (err) {
        console.error("Failed to delete:", err);
        Swal.fire("Error", "There was an error deleting the task.", "error");
      }
    } else {
      Swal.fire("Cancelled", "Your role is safe :)", "info");
    }
  };

  //   console.log("edit modal", roleDetails);

  window.navigateToTask = function (taskId) {
    window.location.href = `/tasklist-details/${taskId}`;
  };
const showProjectPopup = (projects) => {
  const projectNames = projects
    ?.map((p) => p.name)
    .join(", ");

  Swal.fire({
    title: "Assigned Projects",
    html: `<b>${projectNames || "No projects assigned"}</b>`,
    icon: "info",
    confirmButtonText: "Close"
  });
};

  const columns = [
    {
      title: "S.No",
      data: null,
      render: function (data, type, row, meta) {
        return (currentPage - 1) * limit + (meta.row + 1);
      },
    },
    {
      title: "Name",
      data: "name",
      render: (data) => `<span>${data || "N/A"}</span>`,
    },
    {
      title: "Email",
      data: "email",
      render: (data) => `<span>${data || "N/A"}</span>`,
    },
   {
  title: "Project",
  data: "projectId",
  render: function (data, type, row) {
    const id = `project-popup-${row._id}`;

    setTimeout(() => {
      const container = document.getElementById(id);
      if (container && !container.hasChildNodes()) {
        ReactDOM.render(
          <div>
            <span
              className="cursor-pointer text-blue-500 text-lg"
              onClick={() => showProjectPopup(row.projectId)}
            >
             <FaEye/>
            </span>
          </div>,
          container
        );
      }
    }, 0);

    return `<div id="${id}"></div>`;
  },
}
,
    {
      title: "Client",
      data: "clientId",
      render: function (data, type, row) {
        return `<span>${row?.clientId?.client_name || "N/A"}</span>`;
      },
    },
    {
      title: "Status",
      data: "status",
      render: function (data) {
        const colorClass =
          data === "1"
            ? "text-green-600 bg-green-50"
            : "text-red-600 bg-red-50";
        return `<span class="${colorClass} px-2 py-1 rounded-md">${
          data == "1" ? "Active" : "inActive"
        }</span>`;
      },
    },
    {
      title: "Actions",
      data: null,
      render: (data, type, row) => {
        const id = `actions-${row._id}`;
        setTimeout(() => {
          const container = document.getElementById(id);
          if (container && !container.hasChildNodes()) {
            ReactDOM.render(
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TfiPencilAlt
                  className="cursor-pointer text-blue-600"
                  onClick={() => openEditModal(row)}
                />
                <MdOutlineDeleteOutline
                  className="cursor-pointer text-red-600"
                  onClick={() => handleDelete(row._id)}
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

  const [projectManagerName, setProjectManagerName] = useState("");

  //   const handleRoleChange = (name) => {
  //     // const selectedRoleName = e.target.value;
  //     setProjectName(name);
  //     const selectedRole = project.find((proj) => proj.value === name);

  //     if (selectedRole) {
  //       setProjectManagerName(selectedRole.projectManager || "");
  //     } else {
  //       setProjectManagerName("");
  //     }
  //   };

  //   const resetForm = () => {
  //     setProjectName("");
  //     setProjecttiltle("");
  //     setProjectDescription("");
  //     setAssignTo("");
  //     setPriority("");
  //     setUploadedFiles([]);
  //     setErrors({});
  //   };

  return (
    <>
      <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-2 md:pt-10">
        <div>
          <Mobile_Sidebar />

          <div className="flex gap-2 items-center cursor-pointer">
            <p
              className="text-sm text-gray-500"
              onClick={() => navigate("/client-dashboard")}
            >
              Dashboard
            </p>
            <p>{">"}</p>
            <p className="text-sm text-blue-500">User List</p>
          </div>

          {/* Add Button */}
          <div className="flex justify-between mt-8 mb-3">
            <h1 className="text-2xl md:text-3xl font-semibold">User List</h1>
            <button
              onClick={openAddModal}
              className="bg-blue-600 px-3 py-2 text-white w-20 rounded-2xl"
            >
              Add
            </button>
          </div>

          {/* test */}

          <div className="datatable-container">
            {/* Responsive wrapper for the table */}
            <div className="table-scroll-container" id="datatable">
              {buttonLoading ? (
                <div className="flex justify-center items-center w-full h-screen">
                  <div className="w-12 h-12 border-4 border-blue-500 rounded-full animate-ping"></div>
                </div>
              ) : (
                <DataTable
                  data={taskdetails}
                  columns={columns}
                  options={{
                    paging: false,
                    searching: true,
                    ordering: true,
                    scrollX: true,
                    responsive: true,
                    autoWidth: false,
                  }}
                  className="display nowrap bg-white"
                  emptyMessage="No Data Found"
                />
              )}

              <div className="flex justify-between items-center mb-2">
                {/* Show entries dropdown */}
                <div>
                  Show{" "}
                  <select
                    value={limit}
                    onChange={(e) =>
                      fetchProjectlist(1, parseInt(e.target.value))
                    }
                    style={{ padding: "4px 8px", borderRadius: "4px" }}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>{" "}
                  entries
                </div>

                {/* Showing text */}
                <div>
                  Showing {(currentPage - 1) * limit + 1} to{" "}
                  {Math.min(currentPage * limit, totalTasks)} of {totalTasks}{" "}
                  entries
                </div>
              </div>

              <div className="flex justify-end">
                <div className="d-flex justify-content-between align-items-center mt-3">
                  {/* Left empty or info text */}
                  <span></span>

                  <div className="flex justify-between items-center mt-4">
                    {/* Left side (empty or info text) */}
                    <span></span>

                    {/* Pagination Buttons */}
                    <div className="flex items-center space-x-2">
                      {/* Prev Button */}
                      <button
                        disabled={currentPage === 1}
                        onClick={() => fetchProjectlist(currentPage - 1, limit)}
                        className={`px-3 py-1 rounded border 
        ${
          currentPage === 1
            ? " border-gray-200 cursor-not-allowed  bg-blue-600 text-white font-medium"
            : " hover:bg-blue-700 border-gray-300 bg-blue-600 text-white font-medium"
        }`}
                      >
                        ‹ {/* Left Arrow */}
                      </button>

                      {/* Current Page (Active Style like DataTable) */}
                      <span className="px-3 py-1 rounded bg-blue-600 text-white font-medium">
                        {currentPage}
                      </span>

                      {/* Total Pages (Disabled look) */}
                      <span className="px-3 py-1 rounded bg-blue-600 text-white font-medium">
                        / {totalPages}
                      </span>

                      {/* Next Button */}
                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => fetchProjectlist(currentPage + 1, limit)}
                        className={`px-3 py-1 rounded border 
        ${
          currentPage === totalPages
            ? " border-gray-200 cursor-not-allowed bg-blue-600 text-white font-medium"
            : " hover:bg-blue-700 border-gray-300 bg-blue-600 text-white font-medium"
        }`}
                      >
                        › {/* Right Arrow */}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Add Modal */}
          {isAddModalOpen && (
            <div
              onClick={() => closeAddModal()}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-5 rounded-xl w-[680px] h-[580px] overflow-y-auto"
              >
                {/* Header */}
                <div className="flex justify-between items-center gap-2">
                  <h2 className="text-xl font-semibold mb-4">Add User</h2>
                  <div
                    onClick={closeAddModal}
                    className="text-red-500 cursor-pointer"
                  >
                    <ImCancelCircle className="size-6" />
                  </div>
                </div>

                {/* Name */}
                <div className="my-2">
                  <label
                    htmlFor="employee_name"
                    className="block text-sm font-medium mb-2"
                  >
                    Name
                  </label>
                  <input
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="employee_name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="my-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email
                  </label>
                  <input
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="off"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="my-2 relative">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-2"
                  >
                    Password
                  </label>

                  <input
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <span
                    className="absolute right-3 top-12 transform -translate-y-1/2 cursor-pointer text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </span>
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                </div>

                {/* SubType */}
                {/* <div className="my-2">
                  <label
                    htmlFor="subtype"
                    className="block text-sm font-medium mb-2"
                  >
                    SubType
                  </label>
                  <input
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="subtype"
                    name="subtype"
                    type="text"
                    value={subType}
                    onChange={(e) => setSubType(e.target.value)}
                  />
                  {errors.subType && (
                    <p className="text-red-500 text-sm">{errors.subType}</p>
                  )}
                </div> */}

                {/* Project Dropdown */}
                <p className="block text-sm font-medium mb-2">
                  Project <span className="text-red-500">*</span>
                </p>
                {isAddModalOpen && (
                  <div
                    onClick={() => closeAddModal()}
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                  >
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="bg-white p-5 rounded-xl w-[680px] h-[580px] overflow-y-auto"
                    >
                      {/* Header */}
                      <div className="flex justify-between items-center gap-2">
                        <h2 className="text-xl font-semibold mb-4">Add User</h2>
                        <div
                          onClick={closeAddModal}
                          className="text-red-500 cursor-pointer"
                        >
                          <ImCancelCircle className="size-6" />
                        </div>
                      </div>

                      {/* Name */}
                      <div className="my-2">
                        <label
                          htmlFor="employee_name"
                          className="block text-sm font-medium mb-2"
                        >
                          Name
                        </label>
                        <input
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          id="employee_name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm">{errors.name}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="my-2">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium mb-2"
                        >
                          Email
                        </label>
                        <input
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete="off"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm">{errors.email}</p>
                        )}
                      </div>

                      {/* Password */}
                      <div className="my-2 relative">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium mb-2"
                        >
                          Password
                        </label>

                        <input
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="new-password"
                        />
                        <span
                          className="absolute right-3 top-12 transform -translate-y-1/2 cursor-pointer text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <FiEyeOff size={20} />
                          ) : (
                            <FiEye size={20} />
                          )}
                        </span>
                        {errors.password && (
                          <p className="text-red-500 text-sm">
                            {errors.password}
                          </p>
                        )}
                      </div>

                      {/* SubType */}
                      {/* <div className="my-2">
                        <label
                          htmlFor="subtype"
                          className="block text-sm font-medium mb-2"
                        >
                          SubType
                        </label>
                        <input
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          id="subtype"
                          name="subtype"
                          type="text"
                          value={subType}
                          onChange={(e) => setSubType(e.target.value)}
                        />
                        {errors.subType && (
                          <p className="text-red-500 text-sm">
                            {errors.subType}
                          </p>
                        )}
                      </div> */}

                      {/* Project Dropdown */}
                      <p className="block text-sm font-medium mb-2">
                        Project <span className="text-red-500">*</span>
                      </p>
                      {/* <Dropdown
                        value={projectname}
                        onChange={(e) => {
                          // handleRoleChange(e.value);
                          setProjectName(e.value);
                        }}
                        options={project}
                        filter
                        optionLabel="label"
                        placeholder="Select a Project"
                        className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      /> */}
                      <MultiSelect
                        value={projectname}
                        onChange={(e) => setProjectName(e.value)}
                        options={project}
                        optionLabel="label"
                        filter
                        maxSelectedLabels={3}
                        placeholder="Select a Project"
                        className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        display="chip"
                      />

                      {errors.projectname && (
                        <p className="text-red-500 text-sm mb-4">
                          {errors.projectname}
                        </p>
                      )}

                      {/* Status */}
                      <div className="my-2">
                        <label
                          htmlFor="status"
                          className="block text-sm font-medium mb-2"
                        >
                          Status
                        </label>
                        <select
                          id="status"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select the State</option>
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
                        </select>
                        {errors.status && (
                          <p className="text-red-500 text-sm">
                            {errors.status}
                          </p>
                        )}
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-2 justify-end mt-2">
                        <button
                          onClick={closeAddModal}
                          className="bg-red-100 hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                        >
                          Cancel
                        </button>
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                          onClick={handleSubmit}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {/* Status */}
                <div className="my-2">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium mb-2"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select the State</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                  {errors.status && (
                    <p className="text-red-500 text-sm">{errors.status}</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-2 justify-end mt-2">
                  <button
                    onClick={closeAddModal}
                    className="bg-red-100 hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                    onClick={handleSubmit}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {isEditModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-5 rounded-xl w-[680px] h-[580px] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center gap-2 mb-4">
                  <h2 className="text-xl font-semibold">Edit User</h2>
                  <div
                    onClick={() => setIsEditModalOpen(false)}
                    className="text-red-500 cursor-pointer"
                  >
                    <ImCancelCircle className="size-6" />
                  </div>
                </div>

                {/* Name */}
                <div className="my-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={userData.name}
                    onChange={(e) =>
                      setUserData({ ...userData, name: e.target.value })
                    }
                  />
                  {editErrors.name && (
                    <p className="text-red-500 text-sm">{editErrors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="my-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={userData.email}
                    onChange={(e) =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                  />
                  {editErrors.email && (
                    <p className="text-red-500 text-sm">{editErrors.email}</p>
                  )}
                </div>

                {/* SubType */}
                {/* <div className="my-2">
                  <label
                    htmlFor="subType"
                    className="block text-sm font-medium mb-2"
                  >
                    SubType
                  </label>
                  <input
                    id="subType"
                    type="text"
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={userData.subType}
                    onChange={(e) =>
                      setUserData({ ...userData, subType: e.target.value })
                    }
                  />
                  {editErrors.subType && (
                    <p className="text-red-500 text-sm">{editErrors.subType}</p>
                  )}
                </div> */}

                {/* Project Dropdown */}
                <div className="my-2">
                  <label className="block text-sm font-medium mb-2">
                    Project
                  </label>
                  {/* <Dropdown
                    value={userData.projectId}
                    onChange={(e) =>
                      setUserData({ ...userData, projectId: e.value })
                    }
                    options={project}
                    filter
                    optionLabel="label"
                    placeholder="Select a Project"
                    className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  /> */}
                  <MultiSelect
                    value={userData.projectId}
                    onChange={(e) =>
                      setUserData((row) => ({
                        ...row,
                        projectId: e.value,
                      }))
                    }
                    options={project}
                    // optionLabel="email"
                    filter
                    placeholder="Select a Project"
                    maxSelectedLabels={3}
                    className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    display="chip"
                  />
                  {editErrors.projectname && (
                    <p className="text-red-500 text-sm">
                      {editErrors.projectname}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div className="my-2">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium mb-2"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    value={userData.status}
                    onChange={(e) =>
                      setUserData({ ...userData, status: e.target.value })
                    }
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select the State</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                  {editErrors.status && (
                    <p className="text-red-500 text-sm">{editErrors.status}</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-2 justify-end mt-4">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="bg-red-100 hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlesubmitedit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
};
export default SubUserListClient;
