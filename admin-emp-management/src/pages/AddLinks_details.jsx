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

const AddLinks_details = () => {
  const navigate = useNavigate();

  // const location = useLocation();

  const employeeIds = window.location.pathname.split("/")[2];
  console.log("window.location.pathname", employeeIds);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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
        `${API_URL}/api/link/view-link`
      );
      console.log(response);
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
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setErrors("");
  };
 const[categoryall ,setCategoryall] =useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  //   const [errors, setErrors] = useState({});

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        title: title,
        url:url,
        category:categoryall,
      };

      const response = await axios.post(
        `${API_URL}/api/link/create-link`,
        formData
      );
      console.log("response:", response);
      Swal.fire({
        icon: "success",
        title: "Link added successfully!",
        showConfirmButton: true,
        timer: 1500,
      });

      setIsAddModalOpen(false);
      fetchProject();
      setTitle("");
      setUrl("");
      setStatus("");

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
   const[categoryalledit ,setCategoryalledit] =useState("");
  const [titleedit, setTitleedit] = useState("");
  const [urledit, setUrledit] = useState("");

  const [editid, setEditid] = useState([]);

  console.log("editid", editid);

  const openEditModal = (row) => {
    console.log("rowData", row);

    setEditid(row._id);
    setCategoryalledit(row.category);
    setTitleedit(row.title);
    setUrledit(row.url);

    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setErrors("");
  };

  const handlesubmitedit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        title: titleedit,
        url:urledit,
        category:categoryalledit,
      };

      const response = await axios.put(
        `${API_URL}/api/link/edit-linkdetails/${editid}`,
        formData
      );
      console.log("response:", response);
      Swal.fire({
        icon: "success",
        title: "Link Update successfully!",
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
          `${API_URL}/api/link/delete-link/${id}`
        );
        Swal.fire("Deleted!", "The link has been deleted.", "success");
        console.log("res", res);
        setClientdetails((prev) => prev.filter((item) => item._id !== id));
        // fetchProject();
      } catch (err) {
        console.error("Failed to delete:", err);
        Swal.fire("Error", "There was an error deleting the link.", "error");
      }
    } else {
      Swal.fire("Cancelled", "Your Client is safe :)", "info");
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
      title: "Category",
      data: "category",
    },
    {
      title: "Title",
      data: "title",
    },
     {
  title: "URL",
  data: "url",
  render: function (data, type, row) {
    if (data) {
      return `<a href="${data}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">Click Me</a>`;
    }
    return "";
  }
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
  const [category, setCategory] = useState([]);
  console.log("category", category);

  const fetchProjectcat = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/link/get-title-from-category `
      );
      console.log(response);
      if (response.data.success) {
        setCategory(response.data.data);
      } else {
        setErrors("Failed to fetch roles.");
      }
    } catch (err) {
      setErrors("Failed to fetch roles.");
    }
  };

  useEffect(() => {
    fetchProjectcat();
  }, []);

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-2 md:pt-10">
      <div>
        <Mobile_Sidebar />

        <div className="flex gap-2 items-center cursor-pointer">
          <p
            className="text-sm text-gray-500"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </p>
          <p>{">"}</p>
          <p
            className="text-sm text-gray-500"
            onClick={() => navigate("/links")}
          >
            Links 
          </p>
          <p>{">"}</p>

          <p className="text-sm text-blue-500">Link List</p>
        </div>

        {/* Add Button */}
        <div className="flex justify-between mt-8 mb-3">
          <h1 className="text-2xl md:text-3xl font-semibold">Link</h1>
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
        </div>
        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-xl w-[400px] h-[400px] overflow-y-auto px-8 py-6">
              <h2 className="text-xl font-semibold mb-4">Add Item</h2>

              {/* Title */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-2">Category</label>

                <select
                  value={categoryall}
                  onChange={(e) => setCategoryall(e.target.value)}
                  className="border-2 rounded-xl px-4 text-sm border-gray-300 outline-none h-10 w-full "
                >
                  <option value="">Select Title</option>
                  {category.map((category) => (
                    <option key={category.title} value={category.title}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* title */}

               <div className="mb-3">
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* URL */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-2">URL</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status */}
             

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
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-xl w-[400px] h-[400px] overflow-y-auto px-8 py-6">
              <h2 className="text-xl font-semibold mb-4">Edit Link</h2>

             {/* Title */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-2">Category</label>

                <select
                  value={categoryalledit}
                  onChange={(e) => setCategoryalledit(e.target.value)}
                  className="border-2 rounded-xl px-4 text-sm border-gray-300 outline-none h-10 w-full "
                >
                  <option value="">Select Title</option>
                  {category.map((category) => (
                    <option key={category.title} value={category.title}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* title */}

               <div className="mb-3">
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={titleedit}
                  onChange={(e) => setTitleedit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* URL */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-2">URL</label>
                <input
                  type="text"
                  value={urledit}
                  onChange={(e) => setUrledit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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

      <Footer />
    </div>
  );
};
export default AddLinks_details;
