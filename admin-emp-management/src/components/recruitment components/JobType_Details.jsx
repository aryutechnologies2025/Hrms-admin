import React, { useState, useEffect } from "react";

import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
DataTable.use(DT);
import axios from "../../api/axiosConfig";
import { API_URL } from "../../config";
import { TfiPencilAlt } from "react-icons/tfi";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from "react-icons/io";
import Loader from "../Loader";


const JobType_Details = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const storedDetatis = localStorage.getItem("hrmsuser");
  const parsedDetails = JSON.parse(null);
  const userid = parsedDetails ? parsedDetails.id : null;
  const [errors, setErrors] = useState({});
  console.log("errors:", errors);
  const [isAnimating, setIsAnimating] = useState(false);
  const [jobTypeDetails, setJobTypeDetails] = useState([])
  console.log("jobTypeDetails", jobTypeDetails)
  const [loading, setLoading] = useState(true); // State to manage loading
  


  //  view
  useEffect(() => {
    fetchJobType();
  }, []);
  const fetchJobType = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/job-type/view-jobtype`
      );
      console.log(response);


      setJobTypeDetails(response.data?.jobType)
              setLoading(false);


    } catch (err) {
      setErrors("Failed to fetch JobType.");
              setLoading(false);

    }
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeAddModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAddModalOpen(false), 250);
  };



  const closeEditModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsEditModalOpen(false), 250);
  };

  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  // console.log("chech:", nameEdit, statusEdit);


// create
  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const formdata = {
        name: name,
        status: status,

      };

      const response = await axios.post(
        `${API_URL}/api/job-type/create-jobtype`,
        formdata
      );


      setIsAddModalOpen(false);
      setName("");
      setStatus("");
      setErrors("");
      fetchJobType();

      toast.success(" Job Type created successfully.");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error("Error submitting form:", err);
      }
    }
  };


  //  edit  
  const [nameEdit, setNameEdit] = useState("");
  const [statusEdit, setStatusEdit] = useState("");
  const [editId, setEditid] = useState("");

  const openEditModal = (row) => {
    console.log("rowData", row);

    setEditid(row._id);
    setNameEdit(row.name);

    setStatusEdit(row.status);

    setIsEditModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };


  const handlesubmitedit = async (e) => {
    e.preventDefault();
      setErrors({});

  // Client-side validation
  const newErrors = {};
  if (!nameEdit.trim()) {
    newErrors.name = "Name is required.";
  }
  if (!statusEdit) {
    newErrors.status = "Status is required.";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }
    try {
      const formData = {
        name: nameEdit,
        status: statusEdit,
      };

      const response = await axios.put(
        `${API_URL}/api/job-type/edit-jobtype/${editId}`,
        formData
      );
      console.log("response:", response);
      

      setIsEditModalOpen(false);
      fetchJobType();
      setErrors({});
      toast.success("JobType updated successfully.");
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error("Error submitting form:", err);
        toast.error("Failed to update JobType.");
      }
    }
  };





// delete

  const deleteRoles = (editId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this JobType?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_URL}/api/job-type/delete-jobtype/${editId}`)
          .then((response) => {
            if (response.data) {
              toast.success("JobType has been deleted.");
              fetchJobType(); // Refresh the job type
            } else {
              Swal.fire("Error!", "Failed to delete JobType.", "error");
            }
          })
          .catch((error) => {
            // console.error("Error deleting role:", error);
            Swal.fire("Error!", "Failed to delete JobType.", "error");
          });
      }
    });
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
      title: "Name",
      data: "name",
    },

    {
      title: "Status",
      data: "status",
      render: (data, type, row) => {
        const textColor =
          data === "1"
            ? "text-green-600 border rounded-full border-green-600"
            : "text-red-600 border rounded-full border-red-600";
        return `<div class="${textColor}" style="display: inline-block; border: 1px solid ${textColor}; text-align: center; width:100px; font-size: 12px; font-weight: 500">
                  ${data === "1" ? "ACTIVE" : "INACTIVE"}
                </div>`;
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
                <div
                  className="modula-icon-edit flex gap-2"
                  style={{
                    color: "#000",
                  }}
                >
                  <TfiPencilAlt
                    className="cursor-pointer "
                    onClick={() => {
                      openEditModal(
                        row
                      );
                    }}
                  />
                  <MdOutlineDeleteOutline
                    className="text-red-600 text-xl cursor-pointer"
                    onClick={() => {
                      deleteRoles(row._id);
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



  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-2 md:pt-10">
      {loading ? (
              <Loader />
            ) : (
              <>
      <div>
        <Mobile_Sidebar />

        <div className="flex gap-2 text-sm items-center">
              <p
                className="text-sm text-gray-500"
                onClick={() => navigate("/dashboard-Recruitment")}
              >
                Dashboard
              </p>
          <p>{">"}</p>

          <p className="text-sm text-blue-500">Job Type</p>
        </div>

        {/* Add Button */}
        <div className="flex justify-between mt-8">
          <div className="">
            <h1 className="text-2xl md:text-3xl font-semibold">Job Type</h1>
          </div>

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
              data={jobTypeDetails}
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
              </div>

              <div className="p-5">
                <p className="text-2xl md:text-3xl font-medium">Job Type</p>
                <div className="mt-5 flex justify-between items-center">
                  <label className="block text-md font-medium mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <div className="w-[50%]">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter Your Name "
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mb-4">{errors.name}</p>
                    )}
                  </div>
                </div>


                {/* {error.rolename && <p className="error">{error.rolename}</p>} */}

                <div className="mt-5 flex justify-between items-center">
                  <div className="">
                    <label
                      htmlFor="status"
                      className="block text-md font-medium mb-2 mt-3"
                    >
                      Status <span className="text-red-500">*</span>
                    </label>
                    
                  </div>
                  <div className="w-[50%]">
                    <select
                      name="status"
                      id="status"
                      onChange={(e) => {
                        setStatus(e.target.value);
                        validateStatus(e.target.value); // Validate status dynamically
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a status</option>
                      <option value="1">Active</option>
                      <option value="0">InActive</option>
                    </select>
                    {errors.status && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {errors.status}
                      </p>
                    )}
                  </div>
                </div>
                {/* {error.status && <p className="error">{error.status}</p>} */}

                <div className="flex  justify-end gap-2 mt-14">
                  <button
                    onClick={closeAddModal}
                    className="bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
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

        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
            {/* Overlay */}
            <div className="absolute inset-0 " onClick={closeEditModal}></div>

            <div
              className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[53vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
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
                <p className="text-2xl md:text-3xl font-medium">JobType Edit</p>
                <div className="mt-5 flex justify-between items-center">
                  <label className="block text-md font-medium mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <div className="w-[50%]">
                    <input
                      type="text"
                      value={nameEdit}
                      onChange={(e) => setNameEdit(e.target.value)}
                      placeholder="Enter Your Name "
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mb-4">{errors.name}</p>
                    )}
                  </div>
                </div>


                {/* {error.rolename && <p className="error">{error.rolename}</p>} */}

                <div className="mt-5 flex justify-between items-center">
                  <div className="">
                    <label
                      htmlFor="status"
                      className="block text-md font-medium mb-2 mt-3"
                    >
                      Status <span className="text-red-500">*</span>
                    </label>
                    
                  </div>
                  <div className="w-[50%]">
                    <select
                      name="status"
                      id="status"
                      value={statusEdit}
                      onChange={(e) => {
                        setStatusEdit(e.target.value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a status</option>
                      <option value="1">Active</option>
                      <option value="0">InActive</option>
                    </select>
                    {errors.status && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {errors.status}
                      </p>
                    )}
                  </div>
                </div>
                {/* {error.status && <p className="error">{error.status}</p>} */}

                <div className="flex  justify-end gap-2 mt-14">
                  <button
                    onClick={closeEditModal}
                    className="bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                    onClick={handlesubmitedit}
                  >
                    Submit
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
export default JobType_Details;

