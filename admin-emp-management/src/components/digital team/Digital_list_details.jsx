import React, { useState, useEffect, useRef, useMemo } from "react";

import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
DataTable.use(DT);
import { IoClose } from "react-icons/io5";
import { FaFileDownload } from "react-icons/fa";

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
import { FaTrash } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { use } from "react";
import { useDateUtils } from "../../hooks/useDateUtils";
import { createRoot } from "react-dom/client";
import { FaMoneyCheckAlt } from "react-icons/fa";

import { FaFileInvoice } from "react-icons/fa";
import { capitalizeFirstLetter } from "../../utils/StringCaps";
import { IoIosArrowForward } from "react-icons/io";

import { useSearchParams } from "react-router-dom";
import Sales_invoice from "../../components/invoice desgins/Sales_invoice";
import Export_invoice from "../../components/invoice desgins/Export_invoice";
import Performa_invoice from "../../components/invoice desgins/Performa_invoice";
import Invoice from "../../components/invoice desgins/Invoice_download";
import { toast, ToastContainer } from "react-toastify";
import { BsDownload } from "react-icons/bs";


// import Loader from "../components/Loader";

// customize table

// import { MultiSelect } from "primereact/multiselect";

const Digital_list_details = () => {
  const navigate = useNavigate();
  const formatDateTime = useDateUtils();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isAnimating, setIsAnimating] = useState(false);

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeAddModal = () => {
    setErrors({});
    setIsAnimating(false);
    setTimeout(() => setIsAddModalOpen(false), 250);
  };

  const closeEditModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsEditModalOpen(false), 250);
    setErrors("");
  };

  const [accountdetails, setAccountdetails] = useState([]);

  // console.log("accountdetails",accountdetails)

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/project/get-project-name`,
        { withCredentials: true },
      );
      // console.log("project list", response);
      if (response.data.success) {
        const ProjectOptions = response.data.data.map((emp) => ({
          label: emp.name,
          value: emp._id,
        }));

        setAccountdetails(ProjectOptions);
        setLoading(false);
      }
    } catch (err) {
      setErrors("Failed to fetch roles.");
    }
  };

  //   const [status, setStatus] = useState("");

  const storedDetails = localStorage.getItem("hrmsuser");
  const parsedDetails = storedDetails ? JSON.parse(storedDetails) : null;
  let user = parsedDetails ? parsedDetails : null;

  const [errors, setErrors] = useState({});
  const [projectFilter, setProjectFilter] = useState("");
  const [taskId, setTaskId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [postType, setPostType] = useState("");
  const [postUrl, setPostUrl] = useState("");
  const [postDate, setPostDate] = useState("");
  const [status, setStatus] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  //   console.log("uploadedFiles", uploadedFiles);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setUploadedFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveFile = (indexToRemove) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove),
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!projectFilter) newErrors.projectFilter = "Project is required";
    if (!taskId.trim()) newErrors.taskId = "Task ID is required";
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description) newErrors.description = "Description is required";
    if (!postType) newErrors.postType = "Post Type is required";
    if (!postUrl.trim()) newErrors.postUrl = "Post URL is required";
    if (!postDate) newErrors.postDate = "Post Date is required";
    if (!status) newErrors.status = "Status is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const formData = new FormData();
      formData.append("projectId", projectFilter);
      formData.append("taskId", taskId);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("postType", postType);
      formData.append("postUrl", postUrl);
      formData.append("postDate", postDate);
      formData.append("status", status);
      formData.append("createdBy", user._id);

      uploadedFiles.forEach((file) => {
        formData.append("digitalMarketingDocuments", file);
      });

      console.log("formData", formData);

      const response = await axios.post(
        `${API_URL}/api/digital-marketing/create-digitalMarketing`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      //   console.log("response", response);
      toast.success("Created Successfully!");
      setIsAddModalOpen(false);

      fetchDigital();

      setTaskId("");
      setTitle("");
      setDescription("");
      setPostType("");
      setPostUrl("");
      setPostDate("");
      setStatus("pending");
      setUploadedFiles([]);
    } catch (err) {
      console.error("API Error:", err);

      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        toast.error(err.response?.data?.message || "Something went wrong");
      }
    }
  };

  //   table data

  useEffect(() => {
    fetchDigital();
  }, []);

  const [digitalMarketing, setDigitalMarketing] = useState([]);
  console.log("digitalMarketing", digitalMarketing);
  const fetchDigital = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/digital-marketing/view-digitalMarketing`,
        { withCredentials: true },
      );
      // console.log("project list", response);
      if (response.data.success) {
         

        setDigitalMarketing(response.data.data);
      }
    } catch (err) {
      setErrors("Failed to fetch roles.");
    }
  };

  const columns = [
    {
      key: "sno",
      title: "Sno",
      data: null,
      render: function (data, type, row, meta) {
        return meta.row + 1;
      },
    },

    {
      key: "taskId",
      title: "Task Id",
      data: "taskId",
       render: (data) => data || "-",
    //   render: (data) => data?.taskId || "-",
    },

    {
      key: "project",
      title: "Project Name",
      data: "projectId",
       render: (data) => data || "-",
    //   render: (data) => data?.projectId || "-",
    },
    {
      key: "title",
      title: "Title",
      data: "title",
       render: (data) => data || "-",
    },

  
    {
      key: "description",
      title: "Description",
      data: "description",
       render: (data) => data || "-",
    //   render: (data) => (data ? formatDateTime(data) : "-"),
    },

    {
      key: "postType",
      title: "Post Type",
      data: "postType",
       render: (data) => data || "-",
    //   render: (data) => (data ? formatDateTime(data) : "-"),
    },


 {
  key: "documents",
  title: "Document",
  data: "documents",
  render: (documents, type, row) => {
    const id = `documents-${row._id}`;

    setTimeout(() => {
      const container = document.getElementById(id);
      if (!container) return;

      if (!container._root) {
        container._root = createRoot(container);
      }

      const file = Array.isArray(documents) ? documents[0] : documents;

      container._root.render(
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {file?.filepath ? (
            <BsDownload
              className="cursor-pointer text-black text-lg"
              title={file.originalName}
              onClick={() =>
                window.open(
                  `${API_URL}/api/uploads/${file.filepath}`,
                  "_blank"
                )
              }
            />
          ) : (
            <span>-</span>
          )}
        </div>
      );
    }, 0);

    return `<div id="${id}"></div>`;
  },
},

{
  key: "postUrl",
  title: "Post URL",
  data: "postUrl",
  render: (data) => {
    if (!data) return "-";

    return `
      <a href="${data}" target="_blank" rel="noopener noreferrer">
        ${data}
      </a>
    `;
  }
},

    {
      key: "postDate",
      title: "Post Date",
      data: "postDate",
      render: (data) => (data ? formatDateTime(data) : "-"),
    },


      {
      title: "Status",
      data: "status",
      render: (data, type, row) => {
        const textColor =
          data === "1"
            ? "text-green-600 border rounded-full border-green-600"
            : "text-red-600 border rounded-full border-red-600";
        return `<div class="${textColor}"  style="display: inline-block; padding: 2px;  text-align: center; width:100px; font-size: 12px; font-weight:500 ">
                  ${data === "1" ? "Active" : "InActive"}
                </div>`;
      },
    },

    

    {
      key: "action",
      title: "Action",
      data: null,
      render: (data, type, row) => {
        const id = `actions-${row.sno || Math.random()}`;
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
                {/* <div className="cursor-pointer">
                  <FaEye
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedInvoiceId(row);
                      setIsOpen(true);
                    }}
                  />
                </div>
                <div
                  className="modula-icon-edit  flex gap-2"
                  style={{
                    color: "#000",
                  }}
                >
                  <TfiPencilAlt
                    className="cursor-pointer"
                    onClick={() => handleEdit(row)}
                  />
                  <MdOutlineDeleteOutline
                    className="text-red-600 text-xl cursor-pointer"
                    onClick={() => handleDelete(row._id)}
                  />
                </div> */}

                <div className="modula-icon-del" style={{
                  color: "red"
                }}>
                  <RiDeleteBin6Line
                    onClick={() => handleDelete(row.id)}
                  />
                </div>
              </div>,
              // container
            );
          }
        }, 0);
        return `<div id="${id}"></div>`;
      },
    },
  ];

  const handleDelete = async (id) => {
    console.log("editid", id);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(
          `${API_URL}/api/digital-marketing/delete-digitalMarketing/${id}`,
          { withCredentials: true },
        );
        Swal.fire("Deleted!", "The  has been deleted.", "success");
        // console.log("res", res);
        // setNotedetails((prev) => prev.filter((item) => item._id !== _id));
        // fetchProject();
        fetchDigital();
      } catch (err) {
        console.error("Failed to delete:", err);
        Swal.fire("Error", "There was an error deleting.", "error");
      }
    } else {
      Swal.fire("Cancelled", "Your  is safe :)", "info");
    }
  };
  const [showDropdown, setShowDropdown] = useState(false);
  // const [visibleCols, setVisibleCols] = useState(
  //     columns.reduce((acc, col) => ({ ...acc, [col.key]: true }), {})
  //   );
  const [visibleCols, setVisibleCols] = useState({
      sno: true,
  taskId: true,
  project: true,
  title: true,
  description: true,
  postType: true,
  documents:false,
  postUrl: true,
  postDate: true,
  status: true,
  action: true,
  });

  const filteredColumns = useMemo(() => {
    return columns.filter((col) => visibleCols[col.key]);
  }, [visibleCols]);

  // Table force refresh
  const [tableKey, setTableKey] = useState(0);
  const handleToggleColumn = (key) => {
    setVisibleCols((prev) => ({ ...prev, [key]: !prev[key] }));
    setTableKey((prev) => prev + 1); // 🔥 Force DataTable remount
  };

  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-2 md:pt-10 overflow-x-auto">
      {/* {loading ? (
        <Loader />
      ) : (
        <> */}

      <div className="cursor-pointer">
        <Mobile_Sidebar />

        <ToastContainer />

        <div className="flex justify-end mt-2 md:mt-0 gap-1 items-center">
          <p
            className="text-sm text-gray-500"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </p>
          <p>{">"}</p>

          <p className="text-sm text-blue-500">Digital Marketing List</p>
        </div>

        {/* Add Button */}
        <div className="flex justify-between mt-1 md:mt-4 mb-2 md:mb-3">
          <h1 className="text-2xl md:text-3xl font-semibold">
            Digital Marketing List
          </h1>
          <button
            // onClick={openAddModal}
            onClick={openAddModal}
            className="px-3 py-2 text-white bg-blue-500 hover:bg-blue-600 font-medium w-20 rounded-2xl"
          >
            Add
          </button>
        </div>

     

        <div className="flex flex-wrap items-center gap-4 ">
          {/* Column Dropdown */}
          <div className="relative inline-block" ref={dropdownRef}>
            <button
              className="px-4 py-2 border rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Columns ⬇
            </button>

            {showDropdown && (
              <div className="absolute z-20 mt-2 w-60 bg-white border border-blue-500 rounded-lg shadow-lg p-3 transition-all duration-300">
                <h3 className="text-blue-600 font-semibold mb-2 text-sm">
                  Toggle Columns
                </h3>
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                  {columns.map((col) => (
                    <label
                      key={col.key}
                      className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 rounded px-2 py-1 transition-colors duration-150"
                    >
                      <input
                        type="checkbox"
                        checked={visibleCols[col.key]}
                        onChange={() => handleToggleColumn(col.key)}
                        className="accent-blue-600 w-4 h-4"
                      />
                      <span className="text-gray-700 text-sm">{col.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="datatable-container">
          {/* Responsive wrapper for the table */}
          <div className="table-scroll-container" id="datatable">
            <DataTable
              // key={tableKey}
              key={tableKey}
                data={digitalMarketing}
              // columns={columns}
              columns={filteredColumns}
            //   columns={activeColumns}

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
                <h2 className="text-xl font-semibold mb-4">Add Task</h2>

                <div className="mb-3 flex  justify-between">
                  <label className="text-sm font-semibold mb-1 text-gray-700">
                    Project<span className="text-red-500">*</span>
                  </label>
                  <div className="w-[50%]">
                    <Dropdown
                      value={projectFilter}
                      onChange={(e) => setProjectFilter(e.value)}
                      options={accountdetails}
                      filter
                      optionLabel="label"
                      placeholder="Select a Project"
                      className="w-[300px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.projectFilter && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.projectFilter}
                      </p>
                    )}
                  </div>
                </div>

                {/* Task ID */}
                <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-1">
                    Task ID<span className="text-red-500">*</span>
                  </label>
                  <div className="w-[50%]">
                    <input
                      type="text"
                      value={taskId}
                      onChange={(e) => setTaskId(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.taskId && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.taskId}
                      </p>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-1">
                    Title<span className="text-red-500">*</span>
                  </label>
                  <div className="w-[50%]">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.title}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-3 flex justify-between">
                  <label className="font-medium mt-4 block">
                    Description<span className="text-red-500">*</span>
                  </label>

                  <div className="w-full md:w-[50%] rounded-lg">
                    <Editor
                      style={{ height: "100px" }}
                      id="description"
                      name="description"
                      text={description}
                      value={description}
                      onTextChange={(e) => setDescription(e.htmlValue)}
                      className="w-full border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-3 flex justify-between  ">
                  <label className="block text-md font-medium mb-2 mt-3">
                    Upload Files
                  </label>

                  <div className="w-[60%] md:w-[50%] rounded-lg">
                    <input type="file" multiple onChange={handleFileChange} />
                    {/* {errors.description && (
                        <p className="text-red-500 text-sm">
                          {errors.description}
                        </p>
                      )} */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center rounded-full border p-2 w-[80%] px-3"
                          >
                            <span className="truncate text-sm text-gray-800">
                              📄 {file.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(index)}
                              className="text-red-500 hover:text-red-700 font-semibold text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Post Type Dropdown */}
                <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-1">
                    Post Type <span className="text-red-500">*</span>
                  </label>
                  <div className="w-[50%]">
                    <select
                      value={postType}
                      onChange={(e) => setPostType(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Post Type</option>
                      <option value="Video">Video</option>
                      <option value="Carousel">Carousel</option>
                      <option value="Image">Image</option>
                      <option value="Reel">Reel</option>
                    </select>
                    {errors.postType && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.postType}
                      </p>
                    )}
                  </div>
                </div>

                {/* Post URL */}
                <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-1">
                    Post URL<span className="text-red-500">*</span>
                  </label>
                  <div className="w-[50%]">
                    <input
                      type="url"
                      value={postUrl}
                      onChange={(e) => setPostUrl(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.postUrl && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.postUrl}
                      </p>
                    )}
                  </div>
                </div>

                {/* Post Date */}
                <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-1">
                    Post Date<span className="text-red-500">*</span>
                  </label>
                  <div className="w-[50%]">
                    <input
                      type="date"
                      value={postDate}
                      onChange={(e) => setPostDate(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.postDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.postDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-1">
                    Status<span className="text-red-500">*</span>
                  </label>
                  <div className="w-[50%]">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Status</option>
                      <option value="1">Active</option>
                      <option value="0">InActive</option>
                    </select>
                    {errors.status && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.status}
                      </p>
                    )}
                  </div>
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
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 font-semibold rounded-full"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};
export default Digital_list_details;
