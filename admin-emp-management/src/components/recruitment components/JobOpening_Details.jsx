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
import { IoIosArrowForward, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Loader from "../Loader";
import { Dropdown } from "primereact/dropdown";
const JobOpening_Details = () => {
  const navigate = useNavigate();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  console.log("errors", errors)
  const [isAnimating, setIsAnimating] = useState(false);
  const [jobOpeningDetails, setJobOpeningDetails] = useState([]);
  console.log("jobOpening", jobOpeningDetails);
  const [loading, setLoading] = useState(true); // State to manage loading




  // View

  useEffect(() => {
    fetchJobOpening();
    fetchJobType();
  }, []);

  const [dropDown, setDropDown] = useState("");
  console.log("projectname:", dropDown);


  const fetchJobType = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/job-type/view-job-Account-name`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

      });
      // console.log("response:", response)
      const projectName = response.data.
        getFinanceName
        .map((emp) => ({
          label: emp.name,
          value: emp._id,
        }));
      setDropDown(projectName)


    } catch (error) {
      console.error("Project fetch error:", error);
    }
  };


  const fetchJobOpening = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/job-type/view-jobopening`
      );
      console.log("job opening Response:", response);

      // Adjust based on your API response structure

      setJobOpeningDetails(response.data.getJobOpening);
      setLoading(false);

    } catch (err) {
      console.error("Error fetching Job opening:", err);
      setErrors("Failed to fetch job opening.");
      setLoading(false);

      setJobOpeningDetails([]);
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


  const [status, setStatus] = useState("");
  const [jobType, setJobType] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobRequirement, setJobRequirement] = useState("");
  const [startFrom, setStartFrom] = useState("");
  const [endingTo, setEndingTo] = useState("");
  const [note, setNote] = useState("");
  const [salaryPerMonth, setSalaryPerMonth] = useState("");


  console.log("checking:", status, jobType, jobTitle, jobDescription, jobRequirement, startFrom, endingTo, note,)

  // Create

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const formdata = {
        jobTitle: jobTitle,
        jobType: jobType,
        jobDescription: jobDescription,
        jobRequirement: jobRequirement,
        startFrom: startFrom,
        endingTo: endingTo,
        note: note,
        status: status,
      };

      const response = await axios.post(
        `${API_URL}/api/job-type/create-jobopening`,
        formdata
      );

      console.log("response:", response);

      setIsAddModalOpen(false);

      setStatus("");
      setJobTitle("");
      setJobType("");
      setJobDescription("");
      setJobRequirement("");
      setStartFrom("");
      setEndingTo("");
      setNote("");
      setErrors("");

      fetchJobOpening();

      toast.success("Job opening created successfully.");

    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error("Error submitting form:", err);
        toast.error("Failed to create Job Opening.");
      }
    }
  };

  // Edit  

  const [statusEdit, setStatusEdit] = useState("");
  const [jobTypeEdit, setJobTypeEdit] = useState("");
  const [jobTitleEdit, setJobTitleEdit] = useState("");
  const [jobDescriptionEdit, setJobDescriptionEdit] = useState("");
  const [jobRequirementEdit, setJobRequirementEdit] = useState("");
  const [startFromEdit, setStartFromEdit] = useState("");
  const [endingToEdit, setEndingToEdit] = useState("");
  const [noteEdit, setNoteEdit] = useState("");
  const [editId, setEditid] = useState("");

  const openEditModal = (row) => {
    console.log("rowData", row);

    setEditid(row._id);
    setStatusEdit(row.status);
    setJobDescriptionEdit(row.jobDescription);
    setJobRequirementEdit(row.jobRequirement);
    setJobTitleEdit(row.jobTitle);
    setJobTypeEdit(row.jobType);
    setStartFromEdit(row.startFrom);
    setEndingToEdit(row.endingTo);
    setNoteEdit(row.note);
    setIsEditModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const handlesubmitedit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        status: statusEdit,
        jobTitle: jobTitleEdit,
        jobType: jobTypeEdit,
        jobDescription: jobDescriptionEdit,
        jobRequirement: jobRequirementEdit,
        startFrom: startFromEdit,
        endingTo: endingToEdit,
        note: noteEdit,
      };

      const response = await axios.put(
        `${API_URL}/api/job-type/edit-jobopening/${editId}`,
        formData
      );
      console.log("response:", response);

      setIsEditModalOpen(false);
      fetchJobOpening();
      setErrors({});
      toast.success("Job opening updated successfully.");
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error("Error submitting form:", err);
        toast.error("Failed to update Job opening.");
      }
    }
  };

  // Delete
  const deleteJobOpening = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this interview status?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_URL}/api/job-type/delete-jobopening/${id}`)
          .then((response) => {
            if (response.data) {
              toast.success("Job Opening has been deleted.");
              fetchJobOpening();
            } else {
              Swal.fire("Error!", "Failed to delete Job Opening.", "error");
            }
          })
          .catch((error) => {
            console.error("Error deleting Job Opening:", error);
            Swal.fire("Error!", "Failed to delete Job Opening.", "error");
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
      title: "Job Type",
      data: null,
      render: (row) => row.jobType?.name || "-",
    },
    {
      title: "Job Title",
      data: null,
      render: (row) => row.jobTitle || "-",
    },
    {
      title: "Job Description",
      data: null,
      render: (row) => row.jobDescription || "-",
    },
    {
      title: "Job Requirement",
      data: null,
      render: (row) => row.jobRequirement || "-",
    },
    {
      title: "Start From",
      data: null,

 render: (row) => {
    if (!row.startFrom) return "-";

    const date = new Date(row.startFrom);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  },    },
    {
      title: "Ending To",
      data: null,
      // render: (row) => row.endingTo || "-",
       render: (row) => {
    if (!row.endingTo) return "-";

    const date = new Date(row.endingTo);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  },  

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
                      deleteJobOpening(row._id);
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
              <IoIosArrowForward className="w-3 h-3" />
              <p className="text-sm text-blue-500">Job Opening</p>
            </div>

            {/* Add Button */}
            <div className="flex justify-between mt-8">
              <div className="">
                <h1 className="text-2xl md:text-3xl font-semibold">Job Opening</h1>
              </div>

              <button
                onClick={openAddModal}
                className="px-3 py-2 text-white bg-blue-500 hover:bg-blue-600 font-medium w-20 rounded-2xl"
              >
                Add
              </button>
            </div>

            <div className="datatable-container">
              {/* Responsive wrapper for the table */}
              <div className="table-scroll-container" id="datatable">
                <DataTable
                  data={jobOpeningDetails}
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
                  </div>

                  <div className="p-5">
                    <h2 className="text-xl font-semibold mb-4">Add Job Opening</h2>

                    <div className="mt-5 flex flex-wrap md:flex-nowrap justify-between items-center ">

                      <label className="block text-md font-medium mb-2">
                        Job Type <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[50%]">
                        <Dropdown
                          value={jobType}
                          onChange={(e) => setJobType(e.value)}
                          options={dropDown}
                          optionValue="value"
                          optionLabel="label"
                          filter
                          placeholder="Select a job Type"
                          className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.
                          jobTitle
                          && (
                            <p className="text-red-500 text-sm mb-4">{errors.jobType}</p>
                          )}
                      </div>


                    </div>



                    {/* job title */}
                    <div className="mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Job Title <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[50%]">
                        <input
                          type="text"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          placeholder="Enter Title Name "
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.
                          jobTitle
                          && (
                            <p className="text-red-500 text-sm mb-4">{errors.jobTitle}</p>
                          )}
                      </div>
                    </div>

                    {/* job description */}
                    <div className="mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Job Description <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[50%]">
                        <textarea
                          type="text"
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          placeholder="Enter Description "
                          className="w-full px-3 py-2 h-36 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.jobDescription && (
                          <p className="text-red-500 text-sm mb-4">{errors.jobDescription}</p>
                        )}
                      </div>
                    </div>

                    {/*  job requirement */}

                    <div className="mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Job Requirement <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[50%]">
                        <textarea
                          type="text"
                          value={jobRequirement}
                          onChange={(e) => setJobRequirement(e.target.value)}
                          placeholder="Enter Requirement "
                          className="w-full px-3 py-2 h-36 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.jobRequirement && (
                          <p className="text-red-500 text-sm mb-4">{errors.jobRequirement}</p>
                        )}
                      </div>
                    </div>

                    {/* salary per month */}

                    <div className="mt-5 justify-between items-center">

                      {/* start from */}
                      <div className="mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                        <label for="start" className="block text-md font-medium mb-2">
                          Start From  <span className="text-red-500">*</span>
                        </label>
                        <div className="w-full md:w-[50%]">
                          <input
                            type="date"
                            value={startFrom}
                            onChange={(e) => setStartFrom(e.target.value)}
                            placeholder=" "
                            id="start"
                            name="start"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {errors.startFrom && (
                            <p className="text-red-500 text-sm mb-4">{errors.startFrom}</p>
                          )}
                        </div>
                      </div>

                      {/* ending to */}

                      <div className="mt-3 flex flex-wrap md:flex-nowrap justify-between items-center">
                        <label for="end" className="block text-md font-medium mb-2">
                          Ending To  <span className="text-red-500">*</span>
                        </label>
                        <div className="w-full md:w-[50%]">
                          <input
                            type="date"
                            value={endingTo}
                            onChange={(e) => setEndingTo(e.target.value)}
                            min={startFrom}
                            placeholder=""
                            id="date"
                            name="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {errors.endingTo && (
                            <p className="text-red-500 text-sm mb-4">{errors.endingTo}</p>
                          )}
                        </div>
                      </div>
                    </div>


                    {/* Notes */}

                    <div className="mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Notes <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[50%]">
                        <textarea
                          type="text"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="Enter Notes "
                          className="w-full px-3 h-36 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                         {errors.note && (
                          <p className="text-red-500 text-sm mb-4 ">
                            {errors.note}
                          </p>
                        )}
                        
                      </div>
                    </div>

                    {/* {error.rolename && <p className="error">{error.rolename}</p>} */}

                    <div className="mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <div className="">
                        <label
                          htmlFor="status"
                          className="block text-md font-medium mb-2 mt-3"
                        >
                          Status <span className="text-red-500">*</span>
                        </label>

                      </div>
                      <div className="w-full md:w-[50%]">
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
                  </div>

                  <div className="p-5">
                    <h2 className="text-xl font-semibold mb-4">Edit Job Opening</h2>

                    <div className="mt-5 flex flex-wrap md:flex-nowrap justify-between items-center ">

                      <label className="block text-md font-medium mb-2">
                        Job Type <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[50%]">
                        <Dropdown
                          value={jobTypeEdit}
                          onChange={(e) => setJobTypeEdit(e.value)}
                          options={dropDown}
                          optionValue="value"
                          optionLabel="label"
                          filter
                          placeholder="Select a job Type"
                          className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.
                          jobTitle
                          && (
                            <p className="text-red-500 text-sm mb-4">{errors.jobType}</p>
                          )}
                      </div>


                    </div>



                    {/* job title */}
                    <div className="mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Job Title <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[50%]">
                        <input
                          type="text"
                          value={jobTitleEdit}
                          onChange={(e) => setJobTitleEdit(e.target.value)}
                          placeholder="Enter Title Name "
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.
                          jobTitle
                          && (
                            <p className="text-red-500 text-sm mb-4">{errors.jobTitle}</p>
                          )}
                      </div>
                    </div>

                    {/* job description */}
                    <div className="mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Job Description <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[50%]">
                        <textarea
                          type="text"
                          value={jobDescriptionEdit}
                          onChange={(e) => setJobDescriptionEdit(e.target.value)}
                          placeholder="Enter Description "
                          className="w-full px-3 py-2 h-32 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.jobDescription && (
                          <p className="text-red-500 text-sm mb-4">{errors.jobDescription}</p>
                        )}
                      </div>
                    </div>

                    {/*  job requirement */}

                    <div className="mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Job Requirement <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[50%]">
                        <textarea
                          type="text"
                          value={jobRequirementEdit}
                          onChange={(e) => setJobRequirementEdit(e.target.value)}
                          placeholder="Enter Requirement "
                          className="w-full px-3 py-2 h-36 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.jobRequirement && (
                          <p className="text-red-500 text-sm mb-4">{errors.jobRequirement}</p>
                        )}
                      </div>
                    </div>

                    {/* salary per month */}

                    <div className="mt-5 justify-between items-center">

                      {/* start from */}
                      <div className="mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Start From  <span className="text-red-500">*</span>
                        </label>
                        <div className="w-full md:w-[50%]">
                          <input
                            type="date"
                            value={startFromEdit}
                            onChange={(e) => setStartFromEdit(e.target.value)}
                            placeholder=" "
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {errors.startFrom && (
                            <p className="text-red-500 text-sm mb-4">{errors.startFrom}</p>
                          )}
                        </div>
                      </div>

                      {/* ending to */}

                      <div className="mt-3 flex flex-wrap md:flex-nowrap justify-between items-center">
                        <label className="block text-md font-medium mb-2">
                          Ending To  <span className="text-red-500">*</span>
                        </label>
                        <div className="w-full md:w-[50%]">
                          <input
                            type="date"
                            value={endingToEdit}
                            onChange={(e) => setEndingToEdit(e.target.value)}
                            min={startFromEdit}
                            placeholder=""
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {errors.endingTo && (
                            <p className="text-red-500 text-sm mb-4">{errors.endingTo}</p>
                          )}
                        </div>
                      </div>
                    </div>


                    {/* Notes */}

                    <div className="mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <label className="w-full md:w-0 block text-md font-medium mb-2">
                        Notes <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[50%]">
                        <textarea
                          type="text"
                          value={noteEdit}
                          onChange={(e) => setNoteEdit(e.target.value)}
                          placeholder="Enter Notes "
                          className="w-full px-3 h-36 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.note && (
                          <p className="text-red-500 text-sm mb-4">{errors.note}</p>
                        )}
                      </div>
                    </div>

                    {/* {error.rolename && <p className="error">{error.rolename}</p>} */}

                    <div className="mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <div className="">
                        <label
                          htmlFor="status"
                          className="block text-md font-medium mb-2 mt-3"
                        >
                          Status <span className="text-red-500">*</span>
                        </label>

                      </div>
                      <div className="w-full md:w-[50%]">
                        <select
                          name="status"
                          id="status"
                          onChange={(e) => {
                            setStatusEdit(e.target.value);
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

export default JobOpening_Details;



