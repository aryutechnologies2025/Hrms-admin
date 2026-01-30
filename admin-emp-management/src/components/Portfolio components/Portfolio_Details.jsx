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
import Loader from "../Loader";

const Portfolio_Details = () => {
  const navigate = useNavigate();

  // const location = useLocation();

  const employeeIds = window.location.pathname.split("/")[2];
  // console.log("window.location.pathname", employeeIds);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [isAnimating, setIsAnimating] = useState(false);

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10); // Delay to trigger animation
  };

 const fetchTechnology = async () => {
  try {
    const res = await axios.get(
      `${API_URL}/api/technology-Portfolio/view-technology-portfolio`,
      { withCredentials: true }
    );

    if (res.data.success) {
      const activeTech = res.data.data
        .filter(item => item.status === "1")
        .map(item => ({
          label: item.name,   
          value: item._id,
        }));

      setTechnologies(activeTech);
    }
  } catch (err) {
    console.error("Failed To Fetch Technology", err);
  }
};


  const closeAddModal = () => {
    setErrors({});
    setTechnologies([]);
    setTitle("");
    setLink("");
    setDocuments([]);
    setStatus("");
    setIsAnimating(false);
    setTimeout(() => setIsAddModalOpen(false), 250); // Delay to trigger animation
  };

  
  // Fetch roles from the API
  useEffect(() => {
    fetchPortfolio();
    fetchTechnology();
  }, []);

  //   const [status, setStatus] = useState("");
  const storedDetatis = localStorage.getItem("hrmsuser");
  const parsedDetails = storedDetatis ? JSON.parse(storedDetatis) : null;
const userid = parsedDetails?.id ?? null;
  const [errors, setErrors] = useState({});

const [portfolioDetails, setPortfolioDetails] = useState([]);
  // console.log("accountdetails", accountdetails);
  const [loading, setLoading] = useState(true);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/technology-Portfolio/view-technology-portfolio-project`,
        {withCredentials: true}
      );
      // console.log(response);
      if (response.data.success) {
        setPortfolioDetails(response.data.data);
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
  // };

  const [technologies, setTechnologies] = useState([]);
 const [selectedTechnology, setSelectedTechnology] = useState(null);
console.log("Technologies:", technologies);
console.log("Selected:", selectedTechnology);


  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [documents, setDocuments] = useState([]);
  const [status, setStatus] = useState("");

     // File handlers for Add
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setDocuments(prevFiles => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveFile = (indexToRemove) => {
    setDocuments(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };
  //   const [errors, setErrors] = useState({});

const handlesubmit = async (e) => {
  e.preventDefault();
  setErrors({});

    const newErrors = {};
    if (!selectedTechnology) newErrors.technology = "Technology is required";
    if (!title) newErrors.title = "Title is required";
    if (!link) newErrors.link = "Link is required";
    if (!status) newErrors.status = "Status is required";

     if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
 try {
      const formData = new FormData();
      formData.append("technologyPortfolio", selectedTechnology);
      formData.append("title", title);
      formData.append("link", link);
      formData.append("status", status);

     
  documents.forEach((documents) =>{
    formData.append("portfolioDocuments", documents); // document
  });

   const response = await axios.post(
      `${API_URL}/api/technology-Portfolio/create-technology-portfolio-project`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    toast.success("Portfolio Created Successfully!");
    
    closeAddModal();
    fetchPortfolio();
  } catch (err) {
    console.log("ERROR:", err);
    setErrors(err.response?.data?.errors || {});
    toast.error(err.response?.data?.message || "Failed to create portfolio");
  }
};


  //   edit

  //
  const [technologyEdit, setTechnologyEdit] = useState("");
  const [titleEdit, setTitleEdit] = useState("");
const [linkEdit, setLinkEdit] = useState("");
const [documentsEdit, setDocumentsEdit] = useState([]); 
console.log("documentsEdit", documentsEdit);

  const [statusEdit, setStatusEdit] = useState("");

  const [editid, setEditid] = useState([]);

  // console.log("editid", editid);

  const openEditModal = (row) => {
    console.log("rowData", row);
    setEditid(row._id);
    setTechnologyEdit(row.technologyPortfolio?._id  || "");
    setTitleEdit(row.title || "");
    setLinkEdit(row.link || "");
    setDocumentsEdit(Array.isArray(row.documents) ? row.documents : []);

    setStatusEdit(row.status || "");

    setIsEditModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

 const closeEditModal = () => {
  setEditid("");
    setTechnologyEdit("");
    setTitleEdit("");
    setLinkEdit("");
    setDocumentsEdit([]);
    setStatusEdit("");
    setIsAnimating(false);
    setTimeout(() => setIsEditModalOpen(false), 250);
    setErrors({});
  };

  const [viewData, setViewData] = useState(null);
  // View modal handlers
  const openViewModal = (row) => {
    console.log("VIEW ROW",row)
    setViewData(row);
    setIsViewModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeViewModal = () => {
    setViewData(null);
    setIsAnimating(false);
    setTimeout(() => setIsViewModalOpen(false), 250);
  };

  // File handlers for Edit
  const handleFileChangeEdit = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setDocumentsEdit(prevFiles => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveFileEdit = (indexToRemove) => {
    setDocumentsEdit(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

const handlesubmitedit = async (e) => {
  e.preventDefault();
 setErrors({});

    try {
      const formData = new FormData();
      formData.append("technology", technologyEdit);
      formData.append("title", titleEdit);
      formData.append("link", linkEdit);
      formData.append("status", statusEdit);

   // Append new files
      documentsEdit.forEach(doc => {
       
        if (doc.name) {
          formData.append("portfolioDocuments", doc);
        }
      });

  const response = await axios.put(
    `${API_URL}/api/technology-Portfolio/edit-technology-portfolio-project/${editid}`,
    formData,
    {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  if (response.data.success) {
        Swal.fire("Updated", "Portfolio updated successfully", "success");
        closeEditModal();
        fetchPortfolio();
      }
    } catch (err) {
      console.error("Update error:", err);
      setErrors(err.response?.data?.errors || {});
      toast.error(err.response?.data?.message || "Failed to update portfolio");
    }
  };


  // Validate Status dynamically

  const handleDelete = async (id) => {
    // console.log("editid", id);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this Status ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(
          `${API_URL}/api/technology-Portfolio/delete-technology-portfolio-project/${id}`,
          {withCredentials: true}
        );
        Swal.fire("Deleted!", "The Status has been deleted.", "success");
        // console.log("res", res);
        setPortfolioDetails((prev) => prev.filter((item) => item._id !== id));
        // fetchProject();
      } catch (err) {
        console.error("Failed to delete:", err);
        Swal.fire("Error", "There was an error deleting the Status.", "error");
      }
    } else {
      Swal.fire("Cancelled", "Your Status is safe :)", "info");
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
      title: "Technology",
      // data: "technology",
      render: (data, type, row) =>
    row.technologyPortfolio?.name || "-",
    },
    {
      title: "Title",
      data: "title", // Changed from "name" to "title"
      render: (data) => data || "-",
    },

    {
      title: "Link",
      data: "link",
      render: (data) => data ? `<a href="${data}" target="_blank" class="text-blue-600">View Link</a>` : "-",
    },
    
    {
      title: "Status",
      data: "status",
      render: (data, type, row) => {
        const textColor =
          data === "1"
            ? "text-green-600 border rounded-full border-green-600"
            : "text-red-600 border rounded-full border-red-600";

        return `<div class="${textColor}" style="display: inline-block; padding: 2px; color: ${textColor}; border: 1px solid ${textColor}; text-align: center; width:100px; font-size: 12px; font-weight:500">
                  ${data === "1" ? "Active" : "InActive"}
                </div>`;
      },
    },

   {
      title: "Actions",
      data: null,
      render: (data, type, row) => {
        const id = `actions-${row._id}`;
        setTimeout(() => {
          const container = document.getElementById(id);
          if (container && !container._root) {
            container._root = createRoot(container);
            container._root.render(
              <div className="flex items-center justify-center gap-3">
                <FaEye 
                  className="text-blue-600 cursor-pointer text-lg"
                  title="View"
                  onClick={() => openViewModal(row)}
                />
                <TfiPencilAlt
                  className="text-gray-600 cursor-pointer text-lg"
                  title="Edit"
                  onClick={() => openEditModal(row)}
                />
                <MdOutlineDeleteOutline
                  className="text-red-600 cursor-pointer text-xl"
                  title="Delete"
                  onClick={() => handleDelete(row._id)}
                />
              </div>
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
            

            <div className="cursor-pointer">
              <Mobile_Sidebar />
              
            </div>
            <div className="flex justify-end mt-2 md:mt-0 gap-1 items-center">
              <p
                className=" text-gray-500 cursor-pointer"
                onClick={() => navigate("/")}
              >
                Dashboard
              </p>
              <p>{">"}</p>
              <p className=" text-blue-500">Portfolio</p>
              <p>{">"}</p>
              </div>

            {/* Add Button */}
            <div className="flex justify-between mt-1 md:mt-4 mb-2 md:mb-3">
              <h1 className="text-2xl md:text-3xl font-semibold">Portfolio</h1>
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
                  data={portfolioDetails}
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
                <div
                  className="absolute inset-0 "
                  onClick={closeAddModal}
                ></div>

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
                    <h2 className="text-xl font-semibold mb-4">
                      Add Portfolio
                    </h2>

                    {/* technology */}
                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        Technology<span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <Dropdown
                          value={selectedTechnology}
                          onChange={(e) => setSelectedTechnology(e.value)}
                          options={technologies}
                          filter
                         optionLabel="label"
  optionValue="value"
  placeholder="Select A Technology "
                          className="uniform-field w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2"

                        />
                        {errors.technology && (
                          <p className="text-red-500 text-sm mb-4">
                            {errors.technology}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* title */}
                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        Title<span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter Name "
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mb-4">
                            {errors.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* link */}
                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        Link<span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="text"
                          value={link}
                          onChange={(e) => setLink(e.target.value)}
                          placeholder="Enter Link"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.link && (
                          <p className="text-red-500 text-sm mb-4">
                            {errors.link}
                          </p>
                        )}
                      </div>
                    </div>

                 {/* Documents */}
                    <div className="mb-3 ">
                      <div className="flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        Images <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                      />
                      </div>
                      </div>

                      
                      {documents.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {documents.map((file, index) => (
                            <div
                              key={index}
                              className="flex  items-center justify-between bg-gray-50 px-3 py-2 rounded-full"
                            >
                              <span className="text-sm truncate text-gray-800">📄{file.name}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(index)}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                 ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Status Dropdown */}
                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        
                        Status<span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        >
                          <option value="">Select Status</option>
                          <option value="1">Active</option>
                          <option value="0">InActive</option>
                        </select>
                        {errors.status && (
                          <p className="text-red-500 text-sm mb-4">
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
                <div
                  className="absolute inset-0 "
                  onClick={closeEditModal}
                ></div>

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
                    <h2 className="text-xl font-semibold mb-4">
                      Edit Portfolio
                    </h2>

                    {/* Technology */}

                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        Technology
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <Dropdown
                          options={technologies} 
                          value={technologyEdit}
                          onChange={(e) => setTechnologyEdit(e.value)}
                          optionLabel="label"
  optionValue="value"
                          placeholder="Select A Technology"
                          filter
                          className="uniform-field w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        {errors.technology && (
                          <p className="text-red-500 text-sm mb-4">
                            {errors.technology}
                          </p>
                        )}
                      </div>
                    </div>


                    {/* Title */}
                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        Title
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="text"
                          value={titleEdit}
                          onChange={(e) => setTitleEdit(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.title && (
                          <p className="text-red-500 text-sm mb-4">
                            {errors.title}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* link */}
                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        Link
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="text"
                          value={linkEdit}
                          onChange={(e) => setLinkEdit(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.link && (
                          <p className="text-red-500 text-sm mb-4">
                            {errors.link}
                          </p>
                        )}
                      </div>
                    </div>
                    
{/* Documents */}
<div className="mb-4 flex justify-between items-start">
  <label className="block text-sm font-medium">
    Images
  </label>

  {/* RIGHT COLUMN */}
  <div className="w-[60%] md:w-[50%] space-y-3">

    {/* File Input */}
    <input
      type="file"
      multiple
      onChange={handleFileChangeEdit}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    {/* Existing documents */}
    {documentsEdit?.filter(doc => doc.filepath)?.length > 0 && (
      <div className="space-y-2">
        {/* <p className="text-sm text-gray-600">Existing files:</p> */}

        {documentsEdit
          .filter(doc => doc.filepath)
          .map((doc, index) => (
            <div
              key={index}
              className="flex items-center justify-between
                         bg-gray-50 px-3 py-2 rounded-md"
            >
              <span className="text-sm truncate">
                {doc.originalName}
              </span>

              <a
                href={`${API_URL}/api/uploads/portfolioDocuments/${doc.filepath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-sm"
              >
                View
              </a>
            </div>
          ))}
      </div>
    )}

    {/* New documents */}
    {documentsEdit?.filter(doc => doc.name)?.length > 0 && (
      <div className="space-y-2">
        {/* <p className="text-sm text-gray-600">New files:</p> */}

        {documentsEdit
          .filter(doc => doc.name)
          .map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between
                         bg-gray-50 px-3 py-2 rounded-md"
            >
              <span className="text-sm truncate">
                {file.name}
              </span>

              <button
                type="button"
                onClick={() => handleRemoveFileEdit(index)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>
          ))}
      </div>
    )}
  </div>
</div>


                    {/* Status Dropdown */}
                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        Status
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <select
                          value={statusEdit}
                          onChange={(e) => setStatusEdit(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Status</option>
                          <option value="1">Active</option>
                          <option value="0">InActive</option>
                        </select>
                        {errors.status && (
                          <p className="text-red-500 text-sm mb-4">
                            {errors.status}
                          </p>
                        )}
                      </div>
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
          {isViewModalOpen && viewData && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
                 {/* Background Overlay */}
    <div
      className="absolute inset-0"
      onClick={() => {
        setIsAnimating(false);
        setTimeout(() => setIsViewModalOpen(false), 250);
      }}
    />

    {/* Side Modal */}
    <div
             
                className={`h-screen w-full sm:w-3/4 md:w-1/2 lg:w-1/3 bg-white shadow-xl transform transition-transform duration-300 ${
                  isAnimating ? "translate-x-0" : "translate-x-full"
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">View Portfolio</h2>
                    <button onClick={closeViewModal} className="text-gray-500 hover:text-gray-700">
                      <IoMdClose className="text-2xl" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-gray-600">Technology:</label>
                      <p>{viewData.technologyPortfolio?.name || "-"}</p>
                    </div>

                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-gray-600">Title:</label>
                      <p className="mt-1">{viewData.title || "-"}</p>
                    </div>

                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-gray-600">Link:</label>
                      {viewData.link ? (
                        <a
                          href={viewData.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline mt-1 block"
                        >
                          {viewData.link}
                        </a>
                      ) : (
                        <p className="mt-1">-</p>
                      )}
                    </div>

                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-gray-600">Images:</label>
                      <div className="flex flex-col gap-2 text-right">
    {Array.isArray(viewData.documents) && viewData.documents.length > 0 ? (
      viewData.documents.map((doc, index) => {
        const fileUrl = `${API_URL}/api/uploads/portfolioDocuments/${doc.filepath}`;

        return (
          <div key={index} className="flex gap-3 items-center justify-end">
            {/* View */}
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              {doc.originalName}
            </a>
            {/* <a
                href={`${API_URL}/api/uploads/portfolioDocuments/${doc.filepath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-sm"
              >
                View
              </a> */}

            {/* Download */}
            <a
              href={fileUrl}
              download={doc.originalName}
              className="text-green-600 hover:underline text-xs"
            >
              Download
            </a>
          </div>
        );
      })
    ) : (

  <p>No documents</p>
)}
  </div>
                    </div>

                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-gray-600">Status:</label>
                      <span className={`mt-1 inline-block px-3 py-1 rounded-full text-sm ${
                        viewData.status === "1" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {viewData.status === "1" ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div
                      className="flex mb-4 text-2xl text-red-600 cursor-pointer bg-gray-200 p-1 rounded-full absolute right-2 top-2"
                      onClick={() => setIsViewModalOpen(false)}
                    >
                      {/* <IoMdClose /> */}
                    </div>
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
export default Portfolio_Details;
