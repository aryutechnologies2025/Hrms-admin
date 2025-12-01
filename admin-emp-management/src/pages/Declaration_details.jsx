import React, { useState, useEffect, useRef } from "react";

import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
DataTable.use(DT);

import axios from ".././api/axiosConfig";
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
import { BsDownload } from "react-icons/bs";
import Declaration_pdf from "../pages/Declaration_pdf";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { IoIosArrowForward } from "react-icons/io";
import { AiFillPrinter } from "react-icons/ai";
import Loader from "../components/Loader";



const Declaration_details = () => {
  const navigate = useNavigate();

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

  const [roles, setRoles] = useState([]);
  // const [uploadedFiles, setUploadedFiles] = useState([]);

  // Fetch roles from the API
  useEffect(() => {
    fetchProject();
  }, []);

  console.log("roles", roles);

  //   const [status, setStatus] = useState("");
  const storedDetatis = localStorage.getItem("hrmsuser");
  const parsedDetails = JSON.parse(null);
  const userid = parsedDetails ? parsedDetails.id : null;
  const [errors, setErrors] = useState({});

  const [notedetails, setNotedetails] = useState([]);
  console.log("notedetails", notedetails);

  const fetchProject = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/declaration/view-declarationlist`
      );
      console.log(response);
      if (response.data.success) {
        setNotedetails(response.data.data);
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

  //

  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
  const [employeeOption, setEmployeeOption] = useState(null);
  console.log("employeeOption", employeeOption)
  const [empId, setEmpId] = useState("");
  const [designation, setDesignation] = useState("");
  const [certificateName, setCertificateName] = useState("");
  const [certificateNo, setCertificateNo] = useState("");
  const [selectedEmpData, setSelectedEmpData] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);


  const fetchEmployeeList = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/employees/all-active-employees`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("response", response.data.data);

      const employeeemail = response.data.data.map((emp) => ({
        label: emp.employeeName,
        value: emp._id,
        data: emp, //
      }));
      // console.log("employeeemail", response.data.data);
      setEmployeeOption(employeeemail);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleEmployeeChange = (e) => {
    setSelectedEmployeeDetails(e.value);

    const selectedEmp = employeeOption.find(
      (opt) => opt.value === e.value
    )?.data;

    if (selectedEmp) {
      console.log("selectedEmp", selectedEmp)
      setEmpId(selectedEmp.employeeId || "");
      setDesignation(selectedEmp.role?.name || "");
      setSelectedEmpData(selectedEmp);
    }
  };

  useEffect(() => {
    //  fetchProjectleave();
    fetchEmployeeList();
  }, []);

  // Auto-calculate revised salary

  //   const [errors, setErrors] = useState({});


  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setUploadedFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveFile = (indexToRemove) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };


  const handlesubmit = async (e) => {
    e.preventDefault();

    if (!selectedEmpData) {
      Swal.fire({
        icon: "warning",
        title: "Please select an employee!",
        timer: 1500,
      });
      return;
    }

    try {
      // const formData = {
      //   empId: selectedEmpData._id,
      //   employeeName: selectedEmpData.employeeName,

      //   employeeId: selectedEmpData.employeeId,
      //   designation: selectedEmpData.role?.name,
      //   certificateName: certificateName,
      //   certificateNo: certificateNo,

      // };

      const formData = new FormData();

      formData.append("empId", selectedEmpData._id);
      formData.append("employeeName", selectedEmpData.employeeName);
      formData.append("employeeId", selectedEmpData.employeeId);
      formData.append("designation", selectedEmpData.role?.name);

      formData.append("certificateName", certificateName);
      formData.append("certificateNo", certificateNo);

      // Attach files
      uploadedFiles.forEach((file) => {
        formData.append("document[]", file);
      });

      console.log("Payload:", formData);

      const response = await axios.post(
        `${API_URL}/api/declaration/create-declarationlist`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("response:", response.data);

      Swal.fire({
        icon: "success",
        title: "Declaration added successfully!",
        showConfirmButton: true,
        timer: 1500,
      });

      setIsAddModalOpen(false);
      fetchProject();
      setCertificateName("");
      setCertificateNo("");
      setSelectedEmployeeDetails(null);
      setEmpId("");
      setDesignation("");
    } catch (err) {
      console.error("Error:", err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        Swal.fire({
          icon: "error",
          title: "Something went wrong!",
        });
      }
    }
  };

  //   edit

  //

  const [editEmpId, setEditEmpId] = useState("");
  const [editDesignation, setEditDesignation] = useState("");
  const [editCertificateName, setEditCertificateName] = useState("");
  const [editCertificateNo, setEditCertificateNo] = useState("");
  const [editEmployeeData, setEditEmployeeData] = useState(null);

  const [attachment, setAttachment] = useState(null);

  // console.log("attachment",attachment)
  const [existingAttachment, setExistingAttachment] = useState(null);



  const [editid, setEditid] = useState([]);

  console.log("editid", editid);

  const openEditModal = (data) => {
    // console.log("data", data)
    setEditid(data._id);
    setEditEmpId(data.employeeId || "");
    setEditDesignation(data.designation || "");
    setEditCertificateName(data.certificateName || "");
    setEditCertificateNo(data.certificateNo || "");
    setEditEmployeeData(data.employeeName || "");
    setExistingAttachment(data.documents?.[0] || null);
    setAttachment(null);
    setIsEditModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };
  // const closeEditModal = () => {
  //   setIsEditModalOpen(false);
  //   setErrors("");
  // };

  const handleFileChangeedit = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setAttachment((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];

    setAttachment(file);          // new file
    setExistingAttachment(null);  // hide old file immediately
  };


  const handleRemoveFileedit = () => {
    setAttachment(null);                // remove new file
    setExistingAttachment(data.documents[0]); // restore old file
  };

  const handlesubmitedit = async (e) => {
    e.preventDefault();
    try {
      // const formData = {
      //   // employeeId: employeeIds,

      //   certificateName: editCertificateName,
      //   certificateNo: editCertificateNo,
      // };

      const formData = new FormData();

      formData.append("certificateName", editCertificateName);
      formData.append("certificateNo", editCertificateNo);

      if (attachment) {
        formData.append("document[]", attachment);
      }
//       if (attachment.length >= 0) {
//   formData.append("document", attachment[0]); 
// }


      if (!attachment && !existingAttachment) {
        formData.append("document", "");
      }


      const response = await axios.put(
        `${API_URL}/api/declaration/edit-declarationlist/${editid}`,
        formData
      );
      console.log("response:", response);
      Swal.fire({
        icon: "success",
        title: "Declaration Update successfully!",
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
      text: "Do you want to delete this Declaration?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(
          `${API_URL}/api/declaration/delete-declarationlist/${id}`
        );
        Swal.fire("Deleted!", "The Declaration has been deleted.", "success");
        console.log("res", res);
        // setNotedetails((prev) => prev.filter((item) => item._id !== _id));
        // fetchProject();
        fetchProject();
      } catch (err) {
        console.error("Failed to delete:", err);
        Swal.fire(
          "Error",
          "There was an error deleting the Declaration.",
          "error"
        );
      }
    } else {
      Swal.fire("Cancelled", "Your Declaration is safe :)", "info");
    }
  };

  const handledownload = async (row) => {
    // Create hidden container
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    document.body.appendChild(container);

    // Render your component
    ReactDOM.render(<Declaration_pdf row={row} />, container);

    // Wait for DOM to render
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Capture with html2canvas (lower scale for smaller size)
    const canvas = await html2canvas(container, { scale: 1.5 }); // scale 1 is enough
    const imgData = canvas.toDataURL("image/jpeg", 0.7); // JPEG, lower quality

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

    const employeeName = row.employeeName || "Employee";
    const fileName = `${employeeName}-Declaration.pdf`;
    pdf.save(fileName);

    // Clean up
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
  };

  //  const handledownload = (row) => {
  //     navigate("/Declaration-pdf", { state: { row } });
  //   };





  const handlePrint = async (row) => {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    document.body.appendChild(container);
    ReactDOM.render(<Declaration_pdf row={row} />, container);

    // give React time to paint
    await new Promise((r) => setTimeout(r, 100));

    // 2️⃣ Capture to canvas
    const canvas = await html2canvas(container, { scale: 1.5 });
    const imgData = canvas.toDataURL("image/jpeg", 0.7);

    // 3️⃣ Create the PDF in memory
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

    const blob = pdf.output("blob");
    const url = URL.createObjectURL(blob);

    // 4️⃣ Hidden iframe for printing
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);

    // 5️⃣ Print and clean up after user action
    iframe.onload = () => {
      const win = iframe.contentWindow;

      const cleanUp = () => {
        URL.revokeObjectURL(url);
        document.body.removeChild(iframe);
        ReactDOM.unmountComponentAtNode(container);
        document.body.removeChild(container);
        win.removeEventListener("afterprint", cleanUp);
      };

      // fires when user prints OR cancels
      win.addEventListener("afterprint", cleanUp);

      win.focus();
      win.print();
    };
  };


const handledownloadDocument = (documents) => {
  if (!documents || documents.length === 0) return;

  const doc = documents[0]; 
  if (!doc.filepath) return;


  

  // Construct file URL
  const url = `${API_URL}/uploads/others/${doc.filepath}`;

  // Create temporary link to trigger download
  const link = document.createElement("a");
  link.href = url;
  link.download = doc.originalName || "document"; 
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};




  const columns = [
    {
      title: "Sno",
      data: null,
      render: function (data, type, row, meta) {
        return meta.row + 1;
      },
    },

    // {
    //   title: "Date",
    //   data: "date",
    //   render: (data) => {
    //     if (!data) return "";
    //     return new Date(data).toLocaleDateString("en-GB");
    //   },
    // },
    {
      title: "employee Id",
      data: "employeeId",
    },
    {
      title: "Employee Name",
      data: "employeeName",
    },

    {
      title: "designation",
      data: "designation",
    },
    {
      title: "certificate Name",
      data: "certificateName",
    },
    {
      title: "certificate No",
      data: "certificateNo",
    },


    {
      title: "Documents",
      data: null,
      render: (data, type, row) => {
        const id = `Documents-${row.sno || Math.random()}`;
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
                
                  <BsDownload
                    className="cursor-pointer"
                    title="Download"
                    onClick={() => handledownloadDocument(row.documents)}
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
                  <BsDownload
                    className="cursor-pointer"
                    title="Download"
                    onClick={() => handledownload(row)}
                  />
                  <AiFillPrinter
                    className="cursor-pointer"
                    title="Print"
                    // onClick={handlePrint}
                    onClick={() => handlePrint(row)}
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

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-full min-h-screen px-3 md:px-5 pt-2 md:pt-10 overflow-x-auto">
      {loading ? (
        <Loader />
      ) : (
        <>
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
                onClick={() => navigate("/employees")}
                className="text-sm text-gray-500 cursor-pointer "
              >
                Employees
              </p>
              <p>{">"}</p>

              <p className="text-sm text-blue-500">Declaration</p>
            </div>

            {/* Add Button */}
            <div className="flex justify-between mt-8 mb-3">
              <h1 className="text-2xl md:text-3xl font-semibold">Declaration</h1>
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
                  data={notedetails}
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
                  </div>{" "}
                  <div className="p-5">
                    <h2 className="text-xl font-semibold mb-4">
                      Add Declaration
                    </h2>

                    {/* Revision Date */}
                    <div className="mb-3 flex justify-between ">
                      <label
                        htmlFor="employee_name"
                        className="block text-sm font-medium mb-2"
                      >
                        Employee Name
                      </label>

                      <Dropdown
                        value={selectedEmployeeDetails}
                        onChange={handleEmployeeChange}
                        options={employeeOption}
                        // optionLabel="email"
                        filter
                        placeholder="Select Employees"
                        maxSelectedLabels={3}
                        className="w-[50%]   border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        display="chip"
                      />
                    </div>

                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        Emp id
                      </label>
                      <input
                        type="text"
                        value={empId}
                        readOnly
                        className="w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {/* desgination */}

                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        Desgination
                      </label>
                      <input
                        type="text"
                        value={designation}
                        readOnly
                        className="w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        Certificate Name
                      </label>
                      <input
                        type="text"
                        value={certificateName}
                        onChange={(e) => setCertificateName(e.target.value)}
                        className="w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        Certificate No
                      </label>
                      <input
                        type="text"
                        value={certificateNo}
                        onChange={(e) => setCertificateNo(e.target.value)}
                        className="w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>



                    <div className="mb-3 mt-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        Attachment                    </label>
                      <div className="w-[50%]  rounded-lg">
                        <input type="file" multiple onChange={handleFileChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {errors.description && (
                          <p className="text-red-500 text-sm">
                            {errors.description}
                          </p>
                        )}
                        {uploadedFiles.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {uploadedFiles.map((file, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center rounded-full border p-2 w-[80%] px-3"
                              >
                                <span className="truncate text-sm text-gray-800">
                                  📄 {file.originalName}
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

                    {/* Revision Notes */}
                    {/* <div className="mb-3">
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                ></textarea>
              </div>
               {errors.notes && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.notes}
                    </p>
                  )} */}

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
                  </div>{" "}
                  <div className="p-5">
                    <h2 className="text-xl font-semibold mb-4">
                      Edit Declaration
                    </h2>

                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        Employee Name
                      </label>
                      <input
                        type="text"
                        value={editEmployeeData}
                        disabled
                        // onChange={(e) => setEditDesignation(e.target.value)}
                        className="w-[50%] px-3 py-2 border border-gray-300  bg-gray-200 rounded-lg"
                      />
                    </div>

                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        Emp ID
                      </label>
                      <input
                        type="text"
                        value={editEmpId}
                        disabled
                        onChange={(e) => setEditEmpId(e.target.value)}
                        className="w-[50%] px-3 py-2 border border-gray-300  bg-gray-200 rounded-lg"
                      />
                    </div>

                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        Designation
                      </label>
                      <input
                        type="text"
                        value={editDesignation}
                        disabled
                        onChange={(e) => setEditDesignation(e.target.value)}
                        className="w-[50%] px-3 py-2 border border-gray-300  bg-gray-200 rounded-lg"
                      />
                    </div>

                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        Certificate Name
                      </label>
                      <input
                        type="text"
                        value={editCertificateName}
                        onChange={(e) => setEditCertificateName(e.target.value)}
                        className="w-[50%] px-3 py-2 border border-gray-300  rounded-lg"
                      />
                    </div>

                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        Certificate No
                      </label>
                      <input
                        type="text"
                        value={editCertificateNo}
                        onChange={(e) => setEditCertificateNo(e.target.value)}
                        className="w-[50%] px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>


                    {/* attachamnet */}

                    <div className="mb-3 mt-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">Attachment</label>

                      <div className="w-[50%]">
                        {/* Show Existing File ONLY if no new file selected */}
                        {existingAttachment && !attachment && (
                          <div className="flex justify-between items-center rounded-full border p-2 w-full px-3 mb-3">
                            <a
                              href={`${API_URL}/uploads/others/${existingAttachment.filepath}`}
                              target="_blank"
                              className="text-blue-600 underline truncate"
                            >
                              📄 {existingAttachment.originalName}
                            </a>
                          </div>
                        )}

                        {/* Upload New File */}
                        <input
                          type="file"
                          onChange={handleEditFileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {/* Show NEW file */}
                        {attachment && (
                          <div className="mt-3 flex justify-between items-center rounded-full border p-2 w-full px-3">
                            <span className="text-sm truncate">📄 {attachment.name}</span>

                            <button
                              type="button"
                              onClick={handleRemoveFileedit}
                              className="text-red-500 hover:text-red-700 font-semibold text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
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
              </div>
            )}
          </div>
        </>
      )}
      <Footer />
    </div>
  );
};
export default Declaration_details;
