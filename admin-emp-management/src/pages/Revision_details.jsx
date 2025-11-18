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

const Revision_details = () => {
  const navigate = useNavigate();

  // const location = useLocation();

  const employeeIds = window.location.pathname.split("/")[2];
  console.log("window.location.pathname", employeeIds);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [roles, setRoles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Fetch roles from the API
  useEffect(() => {
    fetchProject();
  }, []);

  console.log("roles", roles);

  const [projectname, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

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
        `${API_URL}/api/revision/view-revision/${employeeIds}`
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

  //
  const [revisionDate, setRevisionDate] = useState("");
  const [percentage, setPercentage] = useState("");
  const [currentSalary, setCurrentSalary] = useState("");
  const [revisedSalary, setRevisedSalary] = useState("");
  const [nextRevisionDate, setNextRevisionDate] = useState("");
  const [revisionNotes, setRevisionNotes] = useState("");
    const [inputMode, setInputMode] = useState("percentage"); // or "revised"


  // Auto-calculate revised salary
 useEffect(() => {
    if (
      inputMode === "percentage" &&
      currentSalary &&
      percentage &&
      !isNaN(currentSalary) &&
      !isNaN(percentage)
    ) {
      const calculated =
        parseFloat(currentSalary) +
        (parseFloat(currentSalary) * parseFloat(percentage)) / 100;
      setRevisedSalary(calculated.toFixed(2));
    }
  }, [currentSalary, percentage]);

  // When revised salary is edited, calculate percentage
  useEffect(() => {
    if (
      inputMode === "revised" &&
      currentSalary &&
      revisedSalary &&
      !isNaN(currentSalary) &&
      !isNaN(revisedSalary)
    ) {
      const calculated =
        ((parseFloat(revisedSalary) - parseFloat(currentSalary)) /
          parseFloat(currentSalary)) *
        100;
      setPercentage(calculated.toFixed(2));
    }
  }, [currentSalary, revisedSalary]);


  //   const [errors, setErrors] = useState({});

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        employeeId: employeeIds,
        revision_date: revisionDate,
        percentage,
        current_salary: currentSalary,
        revised_salary: revisedSalary,
        next_revision_date: nextRevisionDate,
        revision_notes: revisionNotes,
      };

      const response = await axios.post(
        `${API_URL}/api/revision/create-revision`,
        formData
      );
      console.log("response:", response);
      Swal.fire({
        icon: "success",
        title: "Revision added successfully!",
        showConfirmButton: true,
        timer: 1500,
      });

      setIsAddModalOpen(false);
      fetchProject();
      setRevisionNotes("");
      setNextRevisionDate("");
      setRevisedSalary("");
      setCurrentSalary("");
      setPercentage("");
      setRevisionDate("");

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
  const [revisionDateedit, setRevisionDateedit] = useState("");
  const [percentageedit, setPercentageedit] = useState("");
  const [currentSalaryedit, setCurrentSalaryedit] = useState("");
  const [revisedSalaryedit, setRevisedSalaryedit] = useState("");
  const [nextRevisionDateedit, setNextRevisionDateedit] = useState("");
  const [revisionNotesedit, setRevisionNotesedit] = useState("");
  const [editInputMode, setEditInputMode] = useState("percentage"); 

  const [editid, setEditid] = useState([]);

  console.log("editid", editid);

  const openEditModal = (row) => {
    console.log("rowData", row);

    setEditid(row.id);

    setRevisionDateedit(row.revision_date || "");
    setPercentageedit(row.percentage || "");
    setCurrentSalaryedit(row.current_salary || "");
    setRevisedSalaryedit(row.revised_salary || "");
    setNextRevisionDateedit(row.next_revision_date || "");
    setRevisionNotesedit(row.revision_notes || "");
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setErrors("");
  };

// CTC + Percentage → Revised Salary
useEffect(() => {
  if (
    editInputMode === "percentage" &&
    currentSalaryedit &&
    percentageedit &&
    !isNaN(currentSalaryedit) &&
    !isNaN(percentageedit)
  ) {
    const calculated =
      parseFloat(currentSalaryedit) +
      (parseFloat(currentSalaryedit) * parseFloat(percentageedit)) / 100;
    setRevisedSalaryedit(calculated.toFixed(2));
  }
}, [currentSalaryedit, percentageedit]);

// CTC + Revised Salary → Percentage
useEffect(() => {
  if (
    editInputMode === "revised" &&
    currentSalaryedit &&
    revisedSalaryedit &&
    !isNaN(currentSalaryedit) &&
    !isNaN(revisedSalaryedit)
  ) {
    const calculated =
      ((parseFloat(revisedSalaryedit) - parseFloat(currentSalaryedit)) /
        parseFloat(currentSalaryedit)) *
      100;
    setPercentageedit(calculated.toFixed(2));
  }
}, [currentSalaryedit, revisedSalaryedit]);


  const handlesubmitedit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        employeeId: employeeIds,

        revision_date: revisionDateedit,
        current_salary: currentSalaryedit,
        percentage: percentageedit,
        revised_salary: revisedSalaryedit,
        next_revision_date: nextRevisionDateedit,
        revision_notes: revisionNotesedit,
      };

      const response = await axios.put(
        `${API_URL}/api/revision/edit-revision/${editid}`,
        formData
      );
      console.log("response:", response);
      Swal.fire({
        icon: "success",
        title: "Revision Update successfully!",
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
      text: "Do you want to delete this Revision?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(
          `${API_URL}/api/revision/delete-revision/${id}`
        );
        Swal.fire("Deleted!", "The Revision has been deleted.", "success");
        console.log("res", res);
        setClientdetails((prev) => prev.filter((item) => item.id !== id));
        // fetchProject();
      } catch (err) {
        console.error("Failed to delete:", err);
        Swal.fire(
          "Error",
          "There was an error deleting the Revision.",
          "error"
        );
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
      title: "Employee Name",
      data: "employeeName",
    },
    {
      title: "Revision Date",
      data: "revision_date",
      render: (data) => {
        if (!data) return "";
        return new Date(data).toLocaleDateString("en-GB");
      },
    },
    {
      title: "Current Salary",
      data: "current_salary",
    },
    {
  title: "Percentage",
  data: "percentage",
  render: function (data, type, row) {
    return data != null ? `${data}%` : "";
  }
},

    {
      title: "Revised Salary",
      data: "revised_salary",
    },
    {
      title: "Next Revision Date",
      data: "next_revision_date",
      render: (data) => {
        if (!data) return "";
        return new Date(data).toLocaleDateString("en-GB");
      },
    },
    {
      title: "Revision Notes",
      data: "revision_notes",
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
                    onClick={() => handleDelete(row.id)}
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

  const countryOptions = [
    { name: "United States", code: "US" },
    { name: "India", code: "IN" },
    { name: "China", code: "CN" },
    { name: "Brazil", code: "BR" },
    { name: "Indonesia", code: "ID" },
    { name: "Pakistan", code: "PK" },
    { name: "Nigeria", code: "NG" },
    { name: "Bangladesh", code: "BD" },
    { name: "Russia", code: "RU" },
    { name: "Mexico", code: "MX" },
    { name: "United Kingdom", code: "UK" }, // added UK
  ];

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

          <p className="text-sm text-blue-500">Revision</p>
        </div>

        {/* Add Button */}
        <div className="flex justify-between mt-8 mb-3">
          <h1 className="text-2xl md:text-3xl font-semibold">Revision</h1>
          <button
            onClick={openAddModal}
            className="bg-blue-600 px-3 py-2 text-white w-20 rounded-2xl"
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
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" >
            <div className="bg-white p-5 rounded-xl w-[500px] h-[380px] md:w-[700px] md:h-[580px] overflow-y-auto px-8 py-6">
              <h2 className="text-xl font-semibold mb-4">Add Revision</h2>

              {/* Revision Date */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-2">
                  Revision Date
                </label>
                <input
                  type="date"
                  value={revisionDate}
                  onChange={(e) => setRevisionDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Current Salary */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-2">
                  CTC
                </label>
                <input
                  type="number"
                  value={currentSalary}
                  onChange={(e) => setCurrentSalary(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Percentage */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-2">
                  Percentage
                </label>
                <input
                  type="number"
                  value={percentage}
            onChange={(e) => {
            setInputMode("percentage");
            setPercentage(e.target.value);
          }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 "
                />
              </div>

              {/* Revised Salary (Auto-calculated) */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-2">
                  Revised Salary
                </label>
                <input
                  type="number"
                  value={revisedSalary}
                   onChange={(e) => {
            setInputMode("revised");
            setRevisedSalary(e.target.value);
          }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg "
                />
              </div>

              {/* Next Revision Date */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-2">
                  Next Revision Date
                </label>
                <input
                  type="date"
                  value={nextRevisionDate}
                  onChange={(e) => setNextRevisionDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Revision Notes */}
              <div className="mb-3">
                <label className="block text-sm font-medium mb-2">
                  Revision Notes
                </label>
                <textarea
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2">
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
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 " >
            <div className="bg-white p-5 rounded-xl w-[500px] h-[380px] md:w-[700px] md:h-[580px] overflow-y-auto px-8 py-6">
              <h2 className="text-xl font-semibold mb-4">Edit Revision</h2>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-2">
                  Revision Date
                </label>
                <input
                  type="date"
                  // value={revisionDateedit}
                  value={
                    revisionDateedit
                      ? new Date(revisionDateedit).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => setRevisionDateedit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-2">
                  CTC
                </label>
                <input
                  type="number"
                  value={currentSalaryedit}
                  onChange={(e) => setCurrentSalaryedit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-2">
                  Percentage
                </label>
                <input
                  type="number"
                  value={percentageedit}
                  onChange={(e) => {
      setEditInputMode("percentage");
      setPercentageedit(e.target.value);
    }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 "
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-2">
                  Revised Salary
                </label>
                <input
                  type="number"
                  value={revisedSalaryedit}
                   onChange={(e) => {
      setEditInputMode("revised");
      setRevisedSalaryedit(e.target.value);
    }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg "
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-2">
                  Next Revision Date
                </label>
                <input
                  type="date"
                  // value={nextRevisionDateedit}
                  value={
                    nextRevisionDateedit
                      ? new Date(nextRevisionDateedit)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) => setNextRevisionDateedit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-2">
                  Revision Notes
                </label>
                <textarea
                  value={revisionNotesedit}
                  onChange={(e) => setRevisionNotesedit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                ></textarea>
              </div>

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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:outline-none focus:ring-2 focus:ring-blue-500"
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
export default Revision_details;
