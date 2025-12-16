import React, { useState, useEffect, useRef } from "react";

import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
DataTable.use(DT);

import axios from "../api/axiosConfig";
import { API_URL } from "../config";
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
import { Checkbox } from "primereact/checkbox";
import { IoIosArrowForward } from "react-icons/io";
import { capitalizeFirstLetter } from "../utils/StringCaps";

const Reliving_list_details = () => {
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

  const closeAddModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAddModalOpen(false), 250); // Delay to trigger animation
  };

  const closeEditModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsEditModalOpen(false), 250);
    setErrors("");
  };

  const [dropdownTitle, setDropdownTitle] = useState("");
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState("");
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
  // console.log("clientdetails", clientdetails);

  const fetchProject = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/reliving/view-relivinglist`,
        {withCredentials: true}
      );
      // console.log("re", response);
      if (response.data.success) {
        setClientdetails(response.data.data);
      } else {
        setErrors("Failed to fetch roles.");
      }
    } catch (err) {
      setErrors("Failed to fetch roles.");
    }
  };

  // Open and close modals

  // const handleAddOption = () => {
  //   if (dropdownTitle.trim() !== "") {
  //     setOptions((prev) => [...prev, { option: dropdownTitle }]);
  //     setDropdownTitle("");
  //   }
  // };

  const [optionError, setOptionError] = useState("");

  const handleAddOption = () => {
    if (dropdownTitle.trim() === "") {
      setOptionError("Option cannot be empty");
      return;
    }
    setOptions((prev) => [...prev, { option: dropdownTitle }]);
    setDropdownTitle("");
    setOptionError(""); // clear error after adding
  };

  const [leaveType, setLeaveType] = useState("");
  const [titleType, setTitleType] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [status, setStatus] = useState("");
  const [selectedInputType, setSelectedInputType] = useState("");

  //   const [errors, setErrors] = useState({});

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        name: leaveType,
        type: selectedInputType,
        options: options.map((opt) => ({ option: opt.option })),
      };

      const response = await axios.post(
        `${API_URL}/api/reliving/create-relivinglist`,
        formData, {withCredentials: true}
      );
      // console.log("response:", response);
      Swal.fire({
        icon: "success",
        title: "Status added successfully!",
        showConfirmButton: true,
        timer: 1500,
      });

      setIsAddModalOpen(false);
      fetchProject();
      setLeaveType("");
      setTitleType("");
      setOptions([]);
      setSelectedInputType("");

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
  // states for edit
  const [editid, setEditid] = useState(null);
  const [leaveTypeEdit, setLeaveTypeEdit] = useState("");
  const [selectedInputTypeEdit, setSelectedInputTypeEdit] = useState("");
  const [optionsEdit, setOptionsEdit] = useState([]);
  const [dropdownTitleEdit, setDropdownTitleEdit] = useState("");
  const [optionErrorEdit, setOptionErrorEdit] = useState("");
  const openEditModal = (row) => {
    setEditid(row._id);
    setLeaveTypeEdit(row.name);
    setSelectedInputTypeEdit(row.type);
    setOptionsEdit(row.options || []);
    setIsEditModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const handleAddOptionEdit = () => {
    if (dropdownTitleEdit.trim() === "") {
      setOptionErrorEdit("Option cannot be empty");
      return;
    }
    setOptionsEdit((prev) => [...prev, { option: dropdownTitleEdit }]);
    setDropdownTitleEdit("");
    setOptionErrorEdit("");
  };


  // const closeEditModal = () => {
  //   setIsEditModalOpen(false);
  //   setErrors("");
  // };

  const handlesubmitedit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        name: leaveTypeEdit,
        type: selectedInputTypeEdit,
        // options: optionsEdit.map((opt) => ({ option: opt.option })),
        options: optionsEdit
          .map((opt) => {
            if (!opt) return null;
            if (typeof opt === "string") return { option: opt };
            if (opt.option !== undefined) return { option: opt.option };
            return null;
          })
          .filter(Boolean),
      };

      const response = await axios.put(
        `${API_URL}/api/reliving/edit-relivinglist/${editid}`,
        formData, {withCredentials: true}
      );
      // console.log("response:", response);
      Swal.fire({
        icon: "success",
        title: "Status Update successfully!",
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
      text: "Do you want to delete this Status?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(
          `${API_URL}/api/reliving/delete-relivinglist/${id}`,
          {withCredentials: true}
        );
        Swal.fire("Deleted!", "The Status has been deleted.", "success");
        // console.log("res", res);
        setClientdetails((prev) => prev.filter((item) => item._id !== id));
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
      title: "Title",
      data: "name",
    },
    {
      title: "Input Field",
      data: "type",
    },

    // {
    //   title: "Lable",
    //   data: "options",
    //   render: (data) => {
    //     // data is expected to be an array of objects with 'option' property
    //     if (Array.isArray(data)) {
    //       return data.map((opt) => opt.option).join(", ") || "-";
    //     }
    //     return "";
    //   },
    // },
    {
      title: "Label",
      data: "options",
      render: (data) => {
        if (Array.isArray(data)) {
          return data.join(", ") || "-"; // join strings directly
        }
        return "-";
      },
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
                    title="Edit"
                    onClick={() => openEditModal(row)}
                  />
                  <MdOutlineDeleteOutline
                    className="text-red-600 text-xl cursor-pointer"
                    title="Delete"
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

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-2 md:px-5 pt-2 md:pt-5">
      <div>

        <div className="cursor-pointer">
          <Mobile_Sidebar />

        </div>
        <div className="flex justify-end mt-2 md:mt-0 gap-1 items-center">
          <p
            className="text-sm text-gray-500"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </p>
          <p>{">"}</p>
          <p
            className="text-sm text-gray-500"
            onClick={() => navigate("/releiving-letter")}
          >
            Relieving List
          </p>
          <p>{">"}</p>

          <p className="text-sm text-blue-500">Relieving Details</p>
        </div>
        {/* Add Button */}
        <div className="flex justify-between mt-2 md:mt-4 mb-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">Relieving Details</h1>
          </div>
          <div className="flex justify-between gap-2">
            <button
              onClick={() =>
                navigate(-1)
              }
              className="bg-gray-500 hover:bg-gray-600 px-3 py-2 text-white w-20 rounded-2xl"
            >
              Back
            </button>
            <button
              onClick={openAddModal}
              className="bg-blue-500 hover:bg-blue-600 px-3 py-2 text-white w-20 rounded-2xl"
            >
              Add
            </button>
          </div>
        </div>
        <div className="datatable-container">
          {/* Responsive wrapper for the table */}
          <div className="table-scroll-container" id="datatable">
            <DataTable
              data={clientdetails}
              columns={columns}
              // sortable
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
              <div className="p-2 md:p-5">
                <h2 className="text-xl font-semibold mb-4">Add Relieving Details </h2>

                {/* Title */}
                <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-2">
                    Title<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={leaveType}
                    // required
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {/* {errors.type && (
                  <p className="text-red-500 text-sm mb-4">{errors.type}</p>
                )} */}
                </div>

                {/* Input field type selection */}
                <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-2">
                    Input Field<span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4 flex-wrap w-[50%]">
                    {["radio", "checkbox", "dropdown", "input", "textarea"].map(
                      (type) => (
                        <label key={type} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="inputType"
                            value={type}
                            checked={selectedInputType === type}
                            onChange={(e) =>
                              setSelectedInputType(e.target.value)
                            }
                            className="text-blue-500"
                          />
                          <span>{capitalizeFirstLetter(type)}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* DropDown / Radio / Checkbox Values */}
                {(selectedInputType === "dropdown" ||
                  selectedInputType === "radio" ||
                  selectedInputType === "checkbox") && (
                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        {selectedInputType} Values{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[50%]">
                        <div className="flex gap-2 mb-2 ">
                          <input
                            type="text"
                            value={dropdownTitle}
                            onChange={(e) => {
                              setDropdownTitle(e.target.value);
                              // setTitleType(e.target.value);
                              if (optionError) setOptionError("");
                            }}
                            placeholder={`Enter ${selectedInputType} option`}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
      ${optionError ? "border-red-500" : "border-gray-300 focus:ring-blue-500"
                              }`}
                          />
                          <button
                            type="button"
                            onClick={handleAddOption}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                          >
                            Add
                          </button>
                        </div>

                        {/* Show added values as chips */}
                        <div className="flex flex-wrap gap-2">
                          {options.map((opt, idx) => (
                            <span
                              key={idx}
                              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center"
                            >
                              {opt.option}
                              <button
                                type="button"
                                className="ml-2 text-red-500 hover:text-red-700"
                                onClick={() =>
                                  setOptions((prev) =>
                                    prev.filter((_, i) => i !== idx)
                                  )
                                }
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                      {/* {errors.dropdown && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.dropdown}
                    </p>
                  )} */}
                    </div>
                  )}

                {/* Buttons */}
                <div className="flex justify-end gap-2 mt-4 w-[100%] md:w-[80%]">
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
              <div className="p-2 md:p-5">
                <h2 className="text-xl font-semibold mb-4">Edit Relieving Details</h2>

                {/* Title */}
                <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-2">
                    Title<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={leaveTypeEdit}
                    onChange={(e) => setLeaveTypeEdit(e.target.value)}
                    className="w-[60%] md:w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {/* {errors.title && (
                  <p className="text-red-500 text-sm mb-4">{errors.title}</p>
                )} */}
                </div>

                {/* Input field type */}
                <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-2">
                    Input Field<span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4 flex-wrap w-[60%] md:w-[50%]">
                    {["radio", "checkbox", "dropdown", "input", "textarea"].map(
                      (type) => (
                        <label key={type} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="inputTypeEdit"
                            value={type}
                            checked={selectedInputTypeEdit === type}
                            onChange={(e) =>
                              setSelectedInputTypeEdit(e.target.value)
                            }
                            className="text-blue-500"
                          />
                          <span>{capitalizeFirstLetter(type)}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* DropDown / Radio / Checkbox Values */}
                {(selectedInputTypeEdit === "dropdown" ||
                  selectedInputTypeEdit === "radio" ||
                  selectedInputTypeEdit === "checkbox") && (
                    <div className="mb-3  flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        {selectedInputTypeEdit} Values{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        {" "}
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={dropdownTitleEdit}
                            onChange={(e) => {
                              setDropdownTitleEdit(e.target.value);
                              if (optionErrorEdit) setOptionErrorEdit("");
                            }}
                            placeholder={`Enter ${selectedInputTypeEdit} option`}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
                      ${optionErrorEdit
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                              }`}
                          />
                          <button
                            type="button"
                            onClick={handleAddOptionEdit}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                          >
                            Add
                          </button>
                        </div>
                        {optionErrorEdit && (
                          <p className="text-red-500 text-sm mt-1">
                            {optionErrorEdit}
                          </p>
                        )}
                        {/* Show added options */}
                        <div className="flex flex-wrap gap-2">
                          {optionsEdit.map((opt, idx) => {
                            const value = typeof opt === "string" ? opt : opt.option || "";
                            return (
                              <span
                                key={idx}
                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center"
                              >
                                {value}
                                <button
                                  type="button"
                                  className="ml-2 text-red-500 hover:text-red-700"
                                  onClick={() =>
                                    setOptionsEdit((prev) => prev.filter((_, i) => i !== idx))
                                  }
                                >
                                  &times;
                                </button>
                              </span>
                            );
                          })}
                        </div>

                      </div>
                    </div>
                  )}

                {/* Buttons */}
                <div className="flex justify-end gap-2 mt-4 w-[90%] md:w-[80%] ">
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
      </div>

      <Footer />
    </div>
  );
};
export default Reliving_list_details;
