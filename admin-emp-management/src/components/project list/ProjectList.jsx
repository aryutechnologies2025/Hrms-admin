import React, { useState, useEffect, useRef } from "react";

import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
DataTable.use(DT);
import Loader from "../Loader";
import axios from "../../api/axiosConfig";
import { API_URL } from "../../config";
import { capitalizeFirstLetter } from "../../utils/StringCaps";
import { TfiPencilAlt } from "react-icons/tfi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";
import Footer from "../Footer";
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
import { FaFilePen } from "react-icons/fa6";

const ProjectList = () => {
  const user = JSON.parse(localStorage.getItem("hrmsuser"));

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]); // Add filtered roles state
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [text, setText] = useState("");
  const [clientName, setClientName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [teamManager, setTeamManager] = useState("");
  const [budget, setBudget] = useState("");
  const [gst, setGst] = useState("");
  const [fullpayment, setFullpayment] = useState(0);
  const [gstno, setGstno] = useState([]);
  const [priority, setPriority] = useState("");

  const [employeeOption, setEmployeeOption] = useState(null);
  const [clientOption, setClientOption] = useState(null);

  const [paymentType, setPaymentType] = useState("");
  const [recurringDays, setRecurringDays] = useState("");
  const [currency, setCurrency] = useState("");

  // Filter states
  const [filters, setFilters] = useState({
    status: "",
  });
  const [tempFilters, setTempFilters] = useState(filters);

  // Status options
  const statusOptions = [
    { label: "Active", value: "1" },
    { label: "Inactive", value: "0" },
  ];

  useEffect(() => {
    const budgetValue = Number(budget) || 0;
    const final =
      gst === "gst" ? budgetValue + (budgetValue * gstno) / 100 : budgetValue;

    setFullpayment(final);
  }, [budget, gst, gstno]);

  const fetchEmployeeList = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/employees/all-employees`,
        {
          withCredentials: true,
        }
      );

      const employeeemail = response.data.data.map((emp) => ({
        label: emp.employeeName,
        value: emp._id,
      }));
      setEmployeeOption(employeeemail);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  
  const fetchClientList = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/client/view-clientdetails`,
        {params:{dropDown:true}, withCredentials: true}
      );

      const clientName = response.data.data.map((emp) => ({
        label: emp.client_name,
        value: emp._id,
      }));
      setGstno(response.data?.setting?.[0]?.gst_percent || "");
      setClientOption(clientName);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeList();
    fetchClientList();
  }, []);

  // Fetch roles from the API
  useEffect(() => {
    fetchProject();
  }, []);

  const [projectname, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const [status, setStatus] = useState("");
  const storedDetatis = localStorage.getItem("hrmsuser");
  const parsedDetails = JSON.parse(null);
  const userid = parsedDetails ? parsedDetails.id : null;
  const [errors, setErrors] = useState({});

  const fetchProject = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/project/view-projects`,
        {withCredentials: true}
      );
      if (response.data.success) {
        setRoles(response.data.data);
        setFilteredRoles(response.data.data); // Initialize filtered roles
        setLoading(false);
      } else {
        setErrors("Failed to fetch roles.");
      }
    } catch (err) {
      setErrors("Failed to fetch roles.");
      setLoading(false);
    }
  };

  // Apply filters whenever filters state changes
  useEffect(() => {
    applyFilters();
  }, [filters, roles]);

  const applyFilters = () => {
    let filtered = [...roles];
    
    // Filter by status
    if (filters.status !== "") {
      filtered = filtered.filter(role => role.status === filters.status);
    }
    
    setFilteredRoles(filtered);
  };

  const [roleDetails, setRoleDetails] = useState({
    name: "",
    status: "",
    id: "",
    projectDescription: "",
    teamMembers: [],
    document: [],
    clientName: "",
    startDate: "",
    endDate: "",
    budget: "",
    currency: "",
    projectManager: "",
    priority: "",
    fullpayment: "",
    gstType: "",
    paymentType: "",
    recurringDays: "",
  });

  const openViewModal = (
    id,
    name,
    status,
    projectDescription,
    teamMembers,
    document,
    clientName,
    startDate,
    endDate,
    budget,
    currency,
    projectManager,
    priority
  ) => {
    setRoleDetails({
      name,
      status,
      id,
      projectDescription,
      teamMembers,
      document,
      clientName,
      startDate,
      endDate,
      budget,
      currency,
      projectManager,
      priority,
    });

    setIsViewModalOpen(true);
  };
  
  const openEditModal = (
    id,
    name,
    status,
    projectDescription,
    teamMembers,
    document,
    clientName,
    startDate,
    endDate,
    budget,
    currency,
    projectManager,
    priority,
    gst_amount,
    gst,
    paymentType,
    recurringDays
  ) => {
    setRoleDetails({
      name,
      status,
      id,
      projectDescription,
      teamMembers,
      document,
      clientName,
      startDate,
      endDate,
      budget,
      currency,
      projectManager,
      priority,
      fullpayment: gst_amount,
      gstType: gst,
      paymentType: paymentType,
      recurringDays: recurringDays,
    });
    setIsEditModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeEditModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsEditModalOpen(false), 250);
    setUploadedFiles([]);
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("name", projectname);
      formData.append("projectDescription", text);
      formData.append("status", status);
      formData.append("createdByAdmin", user._id);
      clientName.length > 0 ? formData.append("clientName", clientName) : "";
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("priority", priority.toLowerCase());
      formData.append("budget", budget);
      formData.append("currency", currency);
      formData.append("gst_amount", fullpayment);
      formData.append("gst", gst);
      formData.append("paymentType", paymentType);
      formData.append(
        "recurringDays",
        paymentType == "one-time" ? "" : recurringDays
      );
      formData.append("projectManager", teamManager);

      // Add selected employee details
      if (selectedEmployeeDetails && selectedEmployeeDetails.length > 0) {
        selectedEmployeeDetails.forEach((email, index) => {
          formData.append(`teamMembers[]`, email);
        });
      }

      uploadedFiles.forEach((file) => {
        formData.append("document[]", file);
      });

      const response = await axios.post(
        `${API_URL}/api/project/create-project`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true
        }
      );

      setIsAddModalOpen(false);
      fetchProject();
      setErrors({});
      setRoleDetails({
        name: "",
        status: "",
        id: "",
        projectDescription: "",
        teamMembers: [],
        document: "",
        clientName: "",
        startDate: "",
        endDate: "",
        budget: "",
        projectManager: "",
      });
      setStatus("");
      setPriority("");
      setBudget("");
      setSelectedEmployeeDetails(null);
      setTeamManager("");
      setEndDate("");
      setStartDate("");
      setClientName("");
      setText("");
      setProjectName("");
      setUploadedFiles([]);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error("Error submitting form:", err);
      }
    }
  };

  const handleSave = async (roleId) => {
    const {
      name,
      status,
      projectDescription,
      teamMembers,
      document,
      priority,
      clientName,
      budget,
      currency,
      startDate,
      endDate,
      projectManager,
      gstType,
      paymentType,
      recurringDays,
      fullpayment,
    } = roleDetails;
    try {
      const formData = new FormData();

      const user = JSON.parse(localStorage.getItem("hrmsuser"));

      formData.append("name", name);
      formData.append("projectDescription", projectDescription);
      formData.append("status", status);
      formData.append("clientName", clientName);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("priority", priority);
      formData.append("budget", budget);
      formData.append("projectManager", projectManager);
      formData.append("paymentType", paymentType);
      formData.append("recurringDays", recurringDays);
      formData.append("gst", gstType);
      formData.append("gst_amount", fullpayment);
      formData.append("currency", currency);

      // Add selected employee details
      if (teamMembers && teamMembers.length > 0) {
        teamMembers.forEach((email, index) => {
          formData.append(`teamMembers[]`, email);
        });
      } else {
        formData.append(`teamMembers`, null);
      }

      // Add uploaded files
      uploadedFiles.forEach((file) => {
        formData.append("document[]", file);
      });

      await axios.put(
        `${API_URL}/api/project/update-project/${roleId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setIsEditModalOpen(false);
      fetchProject();
      setErrors({});
      setUploadedFiles([]);
      setRoleDetails({
        name: "",
        status: "",
        id: "",
        projectDescription: "",
        teamMembers: [],
        document: "",
        clientName: "",
        startDate: "",
        endDate: "",
        budget: "",
        projectManager: "",
      });
      setStatus("");
      setPriority("");
      setBudget("");
      setSelectedEmployeeDetails(null);
      setTeamManager("");
      setEndDate("");
      setStartDate("");
      setClientName("");
      setText("");
      setProjectName("");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error("Error submitting form:", err);
      }
    }
  };

  // Validate Role Name dynamically
  const validateRoleName = (value) => {
    const newErrors = { ...errors };
    if (!value) {
      newErrors.name = ["Project name is required"];
    } else {
      delete newErrors.name;
    }
    setErrors(newErrors);
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

  const handleDelete = async (index, filePathToDelete, id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this file?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(
          `${API_URL}/api/project/delete-project-file/${id}/${index}`,
          {
            withCredentials: true
          }
        );
        setRoleDetails((prev) => ({
          ...prev,
          document: prev.document.filter((_, i) => i !== index),
        }));
      } catch (err) {
        console.error("Failed to delete file:", err);
      }
    } else {
      Swal.fire("Cancelled", "Your document is safe :)", "info");
    }
  };

  const rolesWithSno = filteredRoles.map((role, index) => ({ // Use filteredRoles instead of roles
    ...role,
    Sno: index + 1,
  }));

  const deleteProject = (roleId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this role?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_URL}/api/project/delete-project/${roleId}`,{withCredentials: true})
          .then((response) => {
            if (response.data.success) {
              Swal.fire("Deleted!", "Project has been deleted.", "success");
              fetchProject();
            } else {
              Swal.fire("Error!", "Failed to delete Project.", "error");
            }
          })
          .catch((error) => {
            console.error("Error Department role:", error);
            Swal.fire("Error!", "Failed to Department role.", "error");
          });
      }
    });
  };

  const columns = [
    {
      title: "S.no",
      data: "Sno",
    },
    {
      title: "Project Name",
      data: "name",
    },
    {
      title: "Client Name",
      data: "clientName",
      render: (value, row) => {
        return `<div>${value?.client_name || "Unknown"}</div>`;
      },
    },
    {
      title: "Budget",
      data: "budget",
      render: (data, type, row) => {
        const currencyLabel =
          currencyOptions.find((option) => option.value === row.currency)
            ?.label || "";

        return `${currencyLabel ? currencyLabel + " " : ""}${data}`;
      },
    },
    {
      title: "Notes",
      data: null,
      render: (data, type, row) => {
        const id = `notes-${row._id || Math.random()}`;
        setTimeout(() => {
          const container = document.getElementById(id);
          if (container) {
            if (!container._root) {
              container._root = createRoot(container);
            }
            container._root.render(
              <div
                className="action-container"
                style={{
                  display: "flex",
                  gap: "15px",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <div
                  className="modula-icon-edit flex gap-2"
                  style={{
                    color: "#000",
                  }}
                >
                  <FaFilePen
                    className="cursor-pointer"
                    onClick={() => handleEditClick(row)}
                  />
                </div>
              </div>,
              container
            );
          }
        }, 0);
        return `<div id="${id}"></div>`;
      },
    },
    {
      title: "Status",
      data: "status",
      render: (data, type, row) => {
        // Fixed: Use data directly instead of row.status
        const statusValue = data;
        const isActive = statusValue === "1" || statusValue === 1;
        const textColor = isActive
          ? "text-green-600 border rounded-full border-green-600"
          : "text-red-600 border rounded-full border-red-600";
        return `<div class="${textColor}" style="display: inline-block; padding: 2px; text-align: center; width:100px; font-size: 12px; font-weight: 500 ">
                  ${isActive ? "Active" : "InActive"}
                </div>`;
      },
    },
    {
      title: "Action",
      data: null,
      render: (data, type, row) => {
        const id = `actions-${row._id || Math.random()}`;
        setTimeout(() => {
          const container = document.getElementById(id);
          if (container) {
            if (!container._root) {
              container._root = createRoot(container);
            }
            container._root.render(
              <div
                className="action-container"
                style={{
                  display: "flex",
                  gap: "15px",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <div className="cursor-pointer">
                  <FaEye
                    onClick={() => {
                      openViewModal(
                        row._id,
                        row.name,
                        row.status,
                        row.projectDescription,
                        row.teamMembers,
                        row.document,
                        row.clientName,
                        row.startDate,
                        row.endDate,
                        row.budget,
                        row.projectManager,
                        row.priority
                      );
                    }}
                  />
                </div>
                <div
                  className="modula-icon-edit flex gap-2"
                  style={{
                    color: "#000",
                  }}
                >
                  <TfiPencilAlt
                    className="cursor-pointer"
                    onClick={() => {
                      openEditModal(
                        row._id,
                        row.name,
                        row.status,
                        row.projectDescription,
                        row.teamMembers,
                        row.document,
                        row.clientName._id,
                        row.startDate,
                        row.endDate,
                        row.budget,
                        row.currency,
                        row.projectManager,
                        row.priority,
                        row.gst_amount,
                        row.gst,
                        row.paymentType,
                        row.recurringDays
                      );
                    }}
                  />
                  <MdOutlineDeleteOutline
                    className="text-red-600 text-xl cursor-pointer"
                    onClick={() => {
                      deleteProject(row._id);
                    }}
                  />
                </div>
              </div>,
              container
            );
          }
        }, 0);
        return `<div id="${id}"></div>`;
      },
    },
  ];

  const header = (
    <>
      <span className="ql-formats">
        <select className="ql-header" defaultValue="">
          <option value="1" />
          <option value="2" />
          <option value="" />
        </select>
      </span>
      <span className="ql-formats">
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
      </span>
      <span className="ql-formats">
        <select className="ql-color" />
        <select className="ql-background" />
      </span>
      <span className="ql-formats">
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
      </span>
      <span className="ql-formats">
        <button className="ql-link" />
      </span>
    </>
  );

  const priorityOption = ["low", "medium", "high", "critical"];

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.files || e.target.files);
    setUploadedFiles((prev) => [...prev, ...selectedFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  let navigate = useNavigate();

  const [isAnimating, setIsAnimating] = useState(false);

  // Open and close modals
  const openAddModal = () => {
    setIsAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };
  
  const closeAddModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAddModalOpen(false), 250);
    setUploadedFiles([]);
  };

  useEffect(() => {
    if (isAddModalOpen || isEditModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isAddModalOpen, isEditModalOpen]);

  useEffect(() => {
    const budgetValue = Number(roleDetails.budget) || 0;

    const final =
      roleDetails.gstType === "gst"
        ? budgetValue + (budgetValue * gstno) / 100
        : budgetValue;

    setRoleDetails((prev) => ({
      ...prev,
      fullpayment: final,
    }));
  }, [roleDetails.budget, roleDetails.gstType, gstno]);

  const currencyOptions = [
    { label: "USD ($)", value: "USD" },
    { label: "EUR (€)", value: "EUR" },
    { label: "GBP (£)", value: "GBP" },
    { label: "INR (₹)", value: "INR" },
  ];

  const handleEditClick = (row) => {
    navigate(`/project-note-details/${row._id}`, {
      state: { row },   
    });
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

            <div className="flex justify-end gap-1 mt-3 md:mt-0 items-center">
              <p
                className="text-sm text-gray-500 cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </p>
              <p>{">"}</p>
              <p className="text-sm text-blue-500">Project List</p>
            </div>

            {/* Add Button */}
            <div className="flex justify-between mt-2 md:mt-4 mb-1 md:mb-3">
              <h1 className="text-2xl md:text-3xl font-semibold">
                Project List
              </h1>
              <button
                onClick={openAddModal}
                className="px-3 py-2 text-white bg-blue-500 hover:bg-blue-600 font-medium w-20 rounded-2xl"
              >
                Add
              </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 flex-wrap mb-4 items-end">
              <div className="flex flex-col w-40 md:w-48">
                <label className="text-sm font-medium mb-1">Status</label>
                <Dropdown
                  value={tempFilters.status}
                  onChange={(e) => setTempFilters({ ...tempFilters, status: e.value })}
                  options={statusOptions}
                  placeholder="All Status"
                  className="w-full border border-gray-300 rounded-lg"
                />
              </div>

              <button
                onClick={() => setFilters(tempFilters)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Apply Filters
              </button>

              <button
                onClick={() => {
                  setTempFilters({ status: "" });
                  setFilters({ status: "" });
                }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Reset
              </button>
            </div>

            <div className="datatable-container">
              {/* Responsive wrapper for the table */}
              <div className="table-scroll-container" id="datatable">
                <DataTable
                  data={rolesWithSno}
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
              <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 ">
                {/* Overlay */}
                <div className="absolute inset-0" onClick={closeAddModal}></div>

                <div
                  className={`fixed  top-0 right-0 h-screen overflow-y-auto w-full bg-white shadow-lg  transform transition-transform duration-500 ease-in-out  ${
                    isAnimating ? "translate-x-0" : "translate-x-full"
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-full  mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer "
                    title="Toggle Sidebar"
                    onClick={closeAddModal}
                  >
                    <IoIosArrowForward className="w-3 h-3" />
                  </div>
                  <div className="px-5 lg:px-14 py-3 md:py-10 mb-20 md:mb-0">
                    <div className="flex justify-between items-center gap-2 ">
                      <h2 className="text-xl font-semibold mb-4">
                        Add Project
                      </h2>
                    </div>
                    <label
                      htmlFor="roleName"
                      className="block text-sm font-medium mb-2"
                    >
                      Project Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="rolename"
                      name="rolename"
                      onChange={(e) => {
                        setProjectName(e.target.value);
                      }}
                      className="w-full px-3 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {/* {error.rolename && <p className="error">{error.rolename}</p>} */}
                    {errors.name && (
                      <p className="text-red-500 text-sm mb-4">{errors.name}</p>
                    )}

                    {/* <input
                type="text"
                id="clientname"
                name="clientname"
                placeholder=""
                value={clientName}
                onChange={(e) => {
                  setClientName(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              /> */}
                    {/* clinet and project manger */}

                    <div className="flex flex-wrap md:flex-nowrap gap-3 pt-2">
                      <div className="w-full">
                        {" "}
                        <label
                          htmlFor="roleName"
                          className="block text-sm font-medium my-2"
                        >
                          Client Name <span className="text-red-500">*</span>
                        </label>
                        <Dropdown
                          value={clientName}
                          onChange={(e) => setClientName(e.value)}
                          options={clientOption}
                          optionLabel="label"
                          // placeholder="Select a Employee"
                          filter
                          className="w-full  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.clientName && (
                          <p className="text-red-500 text-sm mb-4">
                            {errors.clientName}
                          </p>
                        )}
                      </div>
                      <div className="my-2 w-full">
                        <label
                          htmlFor="employee_name"
                          className="block text-sm font-medium mb-2"
                        >
                          Project Manager{" "}
                          <span className="text-red-500">*</span>
                        </label>

                        <Dropdown
                          value={teamManager}
                          onChange={(e) => setTeamManager(e.value)}
                          options={employeeOption}
                          optionLabel="label"
                          filter
                          // placeholder="Select a Employee"
                          className="w-full  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.projectManager && (
                          <p className="text-red-500 text-sm mb-4">
                            {errors.projectManager}
                          </p>
                        )}
                      </div>
                    </div>
                    <label
                      htmlFor="roleName"
                      className="block text-sm font-medium mb-2 mt-2"
                    >
                      Description
                    </label>
                    {/* decripton */}
                    <div className="card">
                      <Editor
                        value={text}
                        onTextChange={(e) => setText(e.htmlValue)}
                        style={{ height: "200px" }}
                        headerTemplate={header}
                      />
                    </div>
                    {/* start date and end date */}
                    <div className="flex flex-wrap md:flex-nowrap gap-3 my-2 pt-2">
                      <div className="flex flex-col w-full">
                        <label htmlFor="" className=" text-sm font-medium mb-2">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => {
                            setStartDate(e.target.value);
                          }}
                          className=" px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {/* {errors.startDate && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.startDate}
                    </p>
                  )} */}
                      </div>
                      <div className="flex flex-col w-full">
                        <label htmlFor="" className=" text-sm font-medium mb-2">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => {
                            setEndDate(e.target.value);
                          }}
                          min={startDate}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {/* {errors.endDate && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.endDate}
                    </p>
                  )} */}
                      </div>
                    </div>


                    {/* emplopyre and buget */}
                    <div className="flex flex-wrap md:flex-nowrap gap-3  pt-2">
                      <div className="my-2 w-full md:w-[50%]">
                        <label
                          htmlFor="employee_name"
                          className="block text-sm font-medium mb-2"
                        >
                          Add Employees to the project
                        </label>


                        <MultiSelect
                          value={selectedEmployeeDetails}
                          onChange={(e) => setSelectedEmployeeDetails(e.value)}
                          options={employeeOption}
                          optionLabel="label"
                          filter
                          placeholder="Select Employees"
                          maxSelectedLabels={3}
                          className="w-full   border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          display="chip"
                        />
                      </div>

                      <div className="my-2 w-full md:w-[50%]">
                        <label
                          htmlFor="employee_name"
                          className="block text-sm font-medium mb-2"
                        >
                          Budget
                        </label>
                        <div className="flex gap-2">
                          <Dropdown
                            value={currency}
                            options={currencyOptions}
                            onChange={(e) => setCurrency(e.value)}
                            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-28"
                            placeholder=""
                          />
                          <input
                            type="number"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none px-3 py-2 border mt-0 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap gap-3 pt-2 items-center">
                      {/* full amount */}

                      <div className="my-2 w-full md:w-[50%]">
                        <label className="block text-sm font-medium mb-2">
                          Full Payment
                        </label>


                        <input
                          type="text"
                          value={fullpayment.toFixed(2)}
                          disabled
                          className="w-full px-3 py-2 border border-gray-100 rounded-lg bg-gray-300"
                        />
                      </div>
                      {/* gstin  */}


                      <div className="my-4 w-full md:w-[50%]">
                        <div className="">
                          <div className="flex gap-6">
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="radio"
                                name="gstOption"
                                value="gst"
                                checked={gst === "gst"}
                                onChange={(e) => setGst(e.target.value)}
                                className="text-black cursor-pointer"
                              />
                              <span className="w-full">With GST</span>
                            </label>

                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="radio"
                                name="gstOption"
                                value="without_gst"
                                checked={gst === "without_gst"}
                                onChange={(e) => setGst(e.target.value)}
                                className="text-black cursor-pointer"
                              />
                              <span clas>Without GST</span>
                            </label>
                          </div>

                          {errors.gst && (
                            <p className="text-red-500 text-sm mb-4">
                              {errors.gst}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* pority and status */}
                    <div className="flex flex-wrap md:flex-nowrap gap-3 pt-2">
                      <div className="my-2 w-full">
                        <label
                          htmlFor="employee_name"
                          className="block text-sm font-medium mb-2"
                        >
                          Priority
                        </label>
                        <Dropdown
                          value={priority}
                          onChange={(e) => setPriority(e.value)}
                          options={priorityOption}
                          optionLabel="name"
                          // placeholder="Select a Employee"
                          className="w-full  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="w-full my-2">
                        <p className="block text-sm font-medium mb-2">
                          Status <span className="text-red-500">*</span>
                        </p>
                        <select
                          name="status"
                          id="status"
                          onChange={(e) => {
                            setStatus(e.target.value);
                            validateStatus(e.target.value); // Validate status dynamically
                          }}
                          className="w-full px-2 py-2 h-[42px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select a status</option>
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
                        </select>
                        {/* {error.status && <p className="error">{error.status}</p>} */}
                        {errors.status && (
                          <p className="text-red-500 text-sm mb-4">
                            {errors.status}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* payment type */}

                    <div className="">
                      <div className="flex gap-3 pt-2 ">
                        <div className="w-full">
                          <h2 className="block text-sm font-medium mb-2">
                            Payment Type <span className="text-red-500">*</span>
                          </h2>
                          <div className="flex flex-wrap md:flex-nowrap items-center gap-6 mb-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="paymentType"
                                value="one-time"
                                checked={paymentType === "one-time"}
                                onChange={() => setPaymentType("one-time")}
                                className="text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="text-gray-700">One-Time</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="paymentType"
                                value="recurring"
                                checked={paymentType === "recurring"}
                                onChange={() => setPaymentType("recurring")}
                                className="text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="text-gray-700">Recurring</span>
                            </label>
                          </div>
                          {errors.paymentType && (
                            <p className="text-red-500 text-sm mb-4">
                              {errors.paymentType}
                            </p>
                          )}
                        </div>

                        {/* Dropdown for Recurring */}
                        {paymentType === "recurring" && (
                          <div className="transition-all duration-300 w-full">
                            <label className="block text-sm font-medium mb-2">
                              Select Next Payment Days{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={recurringDays}
                              onChange={(e) => setRecurringDays(e.target.value)}
                              className="w-full px-2 py-2 h-[42px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Choose days</option>
                              {Array.from({ length: 30 }, (_, i) => i + 1).map(
                                (day) => (
                                  <option key={day} value={day}>
                                    {day} {day === 1 ? "Day" : "Days"}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>

                    <label
                      htmlFor="demo"
                      className="block text-sm font-medium mb-2 mt-4 "
                    >
                      Upload Files
                    </label>
                    <input
                      type="file"
                      multiple
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />

                    {/* Custom upload button */}
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 md:px-5 md:py-2 rounded mt-2"
                    >
                      Upload Files
                    </button>
                    {errors.error ? (
                      <span className="text-red-500 text-xs ml-2">
                        {errors?.error}
                      </span>
                    ) : (
                      ""
                    )}
                    <ul className="mt-3 gap-3 flex flex-wrap">
                      {uploadedFiles.map((file, index) => (
                        <li
                          key={index}
                          className=" items-center bg-blue-50 rounded-full gap-3 flex px-4  "
                        >
                          <button
                            onClick={() =>
                              setUploadedFiles((prev) =>
                                prev.filter((_, i) => i !== index)
                              )
                            }
                            className="text-red-500 hover:text-red-700 font-bold text-2xl"
                          >
                            ×
                          </button>
                          <span className="text-sm">{file.name}</span>
                        </li>
                      ))}
                    </ul>
                    {/* <FileUpload
                name="demo[]"
                multiple
                accept="image/*"
                auto
                showUploadButton={false}
                showCancelButton={false}
                onSelect={(e) => {
                  const newFiles = e.files;
                  setUploadedFiles((prevFiles) => {
                    const updatedFiles = [...prevFiles, ...newFiles];
                    console.log("Updated files:", updatedFiles); // ✅ This will show correct value
                    return updatedFiles;
                  });
                }}
                // onClear={() => {
                //   setUploadedFiles([]);
                //   console.log("All files cleared");
                // }}
                chooseLabel="Upload"
                className="overflow-y-scroll h-40"
              /> */}

                    <div className="flex gap-2 mt-4 justify-end">
                      <button
                        onClick={closeAddModal}
                        className=" bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                        onClick={handlesubmit}
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
                <div
                  className="absolute inset-0 "
                  onClick={closeEditModal}
                ></div>

                <div
                  className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[full] md:w-[60vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${
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


                  <div className="px-5 lg:px-14 py-2 md:py-5 mb-20 md:mb-0">
                    <p className="text-2xl md:text-3xl font-medium">
                      Edit Project
                    </p>

                    <div className="mt-2 md:mt-4 rounded-lg ">
                      <div className="">
                        <div className="flex justify-between items-center "></div>
                        <label className="block text-sm font-medium mb-2">
                          Project Name <span className="text-red-500">*</span>

                        </label>
                        <input
                          type="text"
                          value={roleDetails.name}
                          onChange={(e) => {
                            setRoleDetails({
                              ...roleDetails,
                              name: e.target.value,
                            });
                            validateRoleName(e.target.value); // Validate dynamically
                          }}
                          className="w-full px-3  border py-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mb-4">
                            {errors.name}
                          </p>
                        )}
                        {/* client and project manager */}
                        <div className="flex flex-wrap md:flex-nowrap gap-3">
                          <div className="w-full">
                            <label
                              htmlFor="roleName"
                              className="block text-sm font-medium my-2"
                            >
                              Client Name{" "}
                              <span className="text-red-500">*</span>
                            </label>

                            <Dropdown
                              value={roleDetails.clientName}
                              onChange={(e) => {
                                setRoleDetails({
                                  ...roleDetails,
                                  clientName: e.value,
                                });
                              }}
                              options={clientOption}
                              filter
                              optionLabel="label"
                              // placeholder="Select a Employee"
                              className="w-full  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.clientName && (
                              <p className="text-red-500 text-sm mb-4">
                                {errors.clientName}
                              </p>
                            )}
                          </div>

                          <div className="my-2 w-full">
                            <label
                              htmlFor="employee_name"
                              className="block text-sm font-medium mb-2"
                            >
                              Project Manager{" "}
                              <span className="text-red-500">*</span>
                            </label>

                            <Dropdown
                              value={roleDetails.projectManager}
                              onChange={(e) => {
                                setRoleDetails({
                                  ...roleDetails,
                                  projectManager: e.value,
                                });
                              }}
                              filter
                              options={employeeOption}
                              optionLabel="label"
                              // placeholder="Select a Employee"
                              className="w-full  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* decription */}
                        <label
                          htmlFor="roleName"
                          className="block text-sm font-medium mb-2 mt-2"
                        >
                          Description
                        </label>
                        <div className="card">
                          <Editor
                            value={roleDetails.projectDescription}
                            onTextChange={(e) => {
                              setRoleDetails({
                                ...roleDetails,
                                projectDescription: e.htmlValue ?? "",
                              });
                              setText(e.htmlValue);
                            }}
                            style={{ height: "200px" }}
                            headerTemplate={header}
                          />
                        </div>
                        {/* start and end date */}


                        <div className="flex flex-wrap md:flex-nowrap gap-3 my-2">
                          <div className="flex flex-col w-full ">
                            <label
                              htmlFor=""
                              className=" text-sm font-medium mb-2"
                            >
                              Start Date
                            </label>
                            <input
                              type="date"
                              value={
                                roleDetails.startDate
                                  ? roleDetails.startDate.split("T")[0]
                                  : ""
                              }
                              onChange={(e) => {
                                setRoleDetails({
                                  ...roleDetails,
                                  startDate: e.target.value,
                                });
                              }}
                              className="px-2 py-2 md:px-3 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.startDate && (
                              <p className="text-red-500 text-sm mb-4">
                                {errors.startDate}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col w-full">
                            <label
                              htmlFor=""
                              className=" text-sm font-medium mb-2"
                            >
                              End Date
                            </label>
                            <input
                              type="date"
                              value={
                                roleDetails.endDate
                                  ? roleDetails.endDate.split("T")[0]
                                  : ""
                              }
                              onChange={(e) => {
                                setRoleDetails({
                                  ...roleDetails,
                                  endDate: e.target.value,
                                });
                              }}
                              min={
                                roleDetails.startDate
                                  ? roleDetails.startDate.split("T")[0]
                                  : ""
                              }
                              className="px-2 py-2 md:px-3 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.endDate && (
                              <p className="text-red-500 text-sm mb-4">
                                {errors.endDate}
                              </p>
                            )}
                          </div>
                        </div>


                        <div className="flex flex-wrap md:flex-nowrap gap-3">
                          <div className="my-2 w-full md:w-[50%]">
                            <label
                              htmlFor="employee_name"
                              className="block text-sm font-medium mb-2"
                            >
                              Add Employees to the project
                            </label>

                            <MultiSelect
                              value={roleDetails.teamMembers}
                              onChange={(e) =>
                                setRoleDetails((row) => ({
                                  ...row,
                                  teamMembers: e.value,
                                }))
                              }
                              options={employeeOption}
                              // optionLabel="email"
                              filter
                              placeholder="Select Employees"
                              maxSelectedLabels={3}
                              className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              display="chip"
                            />
                          </div>
                          <div className="my-2 w-full md:w-[50%]">
                            <label
                              htmlFor="employee_name"
                              className="block text-sm font-medium mb-2"
                            >
                              Budget
                            </label>
                            <div className="flex gap-2">
                              <Dropdown
                                value={roleDetails.currency}
                                options={currencyOptions}
                                onChange={(e) => {
                                  setRoleDetails((row) => ({
                                    ...row,
                                    currency: e.value,
                                  }));
                                }}
                                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-28"
                                placeholder=""
                              />
                              <input
                                type="number"
                                value={roleDetails.budget}
                                onChange={(e) => {
                                  setRoleDetails((row) => ({
                                    ...row,
                                    budget: e.target.value,
                                  }));
                                }}
                                className="mt-0 px-3 w-full py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                        </div>

                        <div className="flex flex-wrap md:flex-nowrap gap-3 pt-2 items-center">
                          {/* full amount */}


                          <div className="my-2 w-full md:w-[50%]">
                            <label className="block text-sm font-medium mb-2">
                              Full Payment
                            </label>

                            <input
                              type="text"
                              value={roleDetails.fullpayment}
                              disabled
                              className="w-full px-3 py-2 border border-gray-100 rounded-lg bg-gray-300"
                            />
                          </div>
                          {/* gstin  */}

                          <div className="my-4 w-[50%]">
                            <div className=" ">
                              <div className="flex gap-6">
                                <label className="flex items-center gap-1 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="gstOption"
                                    value="gst"
                                    checked={roleDetails.gstType === "gst"}
                                    onChange={(e) =>
                                      setRoleDetails((row) => ({
                                        ...row,
                                        gstType: e.target.value,
                                      }))
                                    }
                                    className="text-black cursor-pointer"
                                  />
                                  <span>With GST</span>
                                </label>

                                <label className="flex items-center gap-1 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="gstOption"
                                    value="without_gst"
                                    checked={
                                      roleDetails.gstType === "without_gst"
                                    }
                                    onChange={(e) =>
                                      setRoleDetails((row) => ({
                                        ...row,
                                        gstType: e.target.value,
                                      }))
                                    }
                                    className="text-black cursor-pointer"
                                  />
                                  <span>Without GST</span>
                                </label>
                              </div>

                              {errors.gst && (
                                <p className="text-red-500 text-sm mb-4">
                                  {errors.gst}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap md:flex-nowrap gap-3">
                          <div className="my-2 w-full">
                            <label
                              htmlFor="employee_name"
                              className="block text-sm font-medium mb-2 "
                            >
                              Priority
                            </label>
                            <Dropdown
                              value={roleDetails.priority}
                              onChange={(e) =>
                                setRoleDetails((row) => ({
                                  ...row,
                                  priority: e.target.value,
                                }))
                              }
                              options={priorityOption}
                              optionLabel="name"
                              // placeholder="Select a Employee"
                              className="w-full  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div className="w-full my-3">
                            <p>
                              Status <span className="text-red-500">*</span>
                            </p>
                            <select
                              name="status"
                              id="status"
                              value={roleDetails.status}
                              onChange={(e) => {
                                setRoleDetails({
                                  ...roleDetails,
                                  status: e.target.value,
                                });
                                validateStatus(e.target.value); // Validate dynamically
                              }}
                              className="w-full h-10 rounded-lg px-1 outline border-0 border-gray-300 outline-gray-300"
                            >
                              <option
                                selected={roleDetails.status == "1"}
                                value="1"
                              >
                                Active
                              </option>
                              <option
                                selected={roleDetails.status == "-0"}
                                value="0"
                              >
                                InActive
                              </option>
                            </select>
                            {errors.status && (
                              <p className="text-red-500 text-sm mb-4">
                                {errors.status}
                              </p>
                            )}
                          </div>
                        </div>


                        <div className="">
                          <div className="flex gap-3 pt-2 ">
                            <div className="w-full">
                              <h2 className="block text-sm font-medium mb-2">
                                Payment Type{" "}
                                <span className="text-red-500">*</span>
                              </h2>
                              <div className="flex items-center gap-6 mb-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="paymentType"
                                    value="one-time"
                                    checked={
                                      roleDetails.paymentType === "one-time"
                                    }
                                    onChange={(e) =>
                                      setRoleDetails({
                                        ...roleDetails,
                                        paymentType: e.target.value,
                                      })
                                    }
                                    className="text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <span className="text-gray-700">
                                    One-Time
                                  </span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="paymentType"
                                    value="recurring"
                                    checked={
                                      roleDetails.paymentType === "recurring"
                                    }
                                    onChange={(e) =>
                                      setRoleDetails({
                                        ...roleDetails,
                                        paymentType: e.target.value,
                                      })
                                    }
                                    className="text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <span className="text-gray-700">
                                    Recurring
                                  </span>
                                </label>
                              </div>
                              {errors.paymentType && (
                                <p className="text-red-500 text-sm mb-4">
                                  {errors.paymentType}
                                </p>
                              )}
                            </div>

                            {/* Dropdown for Recurring */}
                            {roleDetails.paymentType === "recurring" && (
                              <div className="transition-all duration-300 w-full">
                                <label className="block text-sm font-medium mb-2">
                                  Select Next Payment Days{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <select
                                  value={roleDetails.recurringDays}
                                  onChange={(e) =>
                                    setRoleDetails({
                                      ...roleDetails,
                                      recurringDays: e.target.value,
                                    })
                                  }
                                  className="w-full px-2 py-2 h-[42px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Choose days</option>
                                  {Array.from(
                                    { length: 30 },
                                    (_, i) => i + 1
                                  ).map((day) => (
                                    <option key={day} value={day}>
                                      {day} {day === 1 ? "Day" : "Days"}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>
                        </div>


                        <label
                          htmlFor="demo"
                          className="block text-sm font-medium mb-2 mt-4 "
                        >
                          Upload Files
                        </label>

                        <input
                          type="file"
                          multiple
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />

                        {/* Custom upload button */}
                        <button
                          onClick={() => fileInputRef.current.click()}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded mt-2"
                        >
                          Upload Files
                        </button>
                        {errors.error && (
                          <span className="text-red-500 text-xs mb-4 ml-2">
                            {errors.error}
                          </span>
                        )}
                        <ul className="mt-3 gap-3 flex">
                          {uploadedFiles.map((file, index) => (
                            <li
                              key={index}
                              className=" items-center bg-blue-50 rounded-full gap-3 flex px-4  "
                            >
                              <button
                                onClick={() =>
                                  setUploadedFiles((prev) =>
                                    prev.filter((_, i) => i !== index)
                                  )
                                }
                                className="text-red-500 hover:text-red-700 font-bold text-2xl"
                              >
                                ×
                              </button>
                              <span className="text-sm">{file.name}</span>
                            </li>
                          ))}
                        </ul>
                        {/* Show existing uploaded document previews */}
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
                              {/* Delete Icon */}
                              <button
                                onClick={() =>
                                  handleDelete(
                                    index,
                                    doc.filepath,
                                    roleDetails.id
                                  )
                                }
                                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs opacity-80 hover:opacity-100"
                                title="Delete file"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2 justify-end mt-3">
                          <button
                            onClick={closeEditModal}
                            className=" bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSave(roleDetails.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                          >
                            Update
                          </button>
                        </div>
                      </div>
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
                        <span className="text-green-600 font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          InActive
                        </span>
                      )}
                    </h2>
                    <div
                      className="flex mb-4 text-2xl text-red-600 cursor-pointer bg-gray-200 p-1 rounded-full absolute right-2 top-2"
                      onClick={() => setIsViewModalOpen(false)}
                    >
                      <IoMdClose />
                    </div>
                  </div>

                  <div className="card flex flex-wrap md:flex-nowrap justify-between gap-8">
                    <div className="w-full md:w-[45%]">
                      <label className="block text-md font-medium mb-2">
                        Project Name :
                      </label>
                      <input
                        disabled
                        type="text"
                        value={roleDetails.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex gap-2 md:gap-0">
                      <label className="block text-md font-medium mb-2">
                        Project Manager :
                      </label>
                      <div className="text-sm p-1 px-2 bg-gray-100 rounded-2xl inline-block mb-2">
                        {roleDetails.projectManager}
                      </div>
                      </div>

                      <div className="my-2">
                        <label
                          htmlFor="employee_name"
                          className="block text-md font-medium "
                        >
                          Add Employees to the project :
                        </label>

                        {roleDetails.teamMembers.map((email, index) => (
                          <div className="text-sm mt-3 p-1 px-2 bg-gray-100 rounded-2xl inline-block ">
                            {index + 1}. {email}
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 mt-3">
                        <label htmlFor="">Budget :</label>
                        <p>₹ {roleDetails?.budget}</p>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <label htmlFor="">Priority :</label>
                        <p>{roleDetails?.priority}</p>
                      </div>
                    </div>
                    <div className="w-full md:w-[54%]">
                      <label className="block text-md font-medium mb-2">
                        Client Name :
                      </label>
                      <input
                        disabled
                        type="text"
                        value={roleDetails.clientName?.client_name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex mb-2">
                        <div className="">
                          <label htmlFor="">Start Date:</label>
                          <input
                            type="date"
                            className="p-1"
                            value={
                              roleDetails.startDate
                                ? roleDetails.startDate.split("T")[0]
                                : ""
                            }
                            disabled
                          />
                        </div>
                        <div className="">
                          <label htmlFor="">End Date:</label>
                          <input
                            type="date"
                            className="p-1"
                            value={
                              roleDetails.endDate
                                ? roleDetails.endDate.split("T")[0]
                                : ""
                            }
                            disabled
                          />
                        </div>
                      </div>
                      <label htmlFor="" className="text-md font-medium ">
                        Project Description :
                      </label>
                      <Editor
                        value={roleDetails.projectDescription}
                        className="text-md font-medium w-full pb-2 mt-2 rounded-lg"
                        style={{ height: "auto" }}
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

export default ProjectList;