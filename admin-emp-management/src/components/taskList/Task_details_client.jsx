// import React, { useState, useEffect, useRef } from "react";

// import DataTable from "datatables.net-react";
// import DT from "datatables.net-dt";
// import "datatables.net-responsive-dt/css/responsive.dataTables.css";
// DataTable.use(DT);

// import axios from "../../api/axiosConfig";
// import { API_URL } from "../../config";
// // import { capitalizeFirstLetter } from "../../StringCaps";
// import { TfiPencilAlt } from "react-icons/tfi";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import ReactDOM from "react-dom";
// import Swal from "sweetalert2";
// import Footer from "../../components/Footer";
// import Mobile_Sidebar from "../../components/Mobile_Sidebar";
// import { MdOutlineDeleteOutline } from "react-icons/md";
// import { FileUpload } from "primereact/fileupload";
// import { MultiSelect } from "primereact/multiselect";
// import { FaEye } from "react-icons/fa";
// import { Editor } from "primereact/editor";
// import { FaTrash } from "react-icons/fa6";
// import { IoMdClose } from "react-icons/io";
// import { Dropdown } from "primereact/dropdown";
// import { useNavigate } from "react-router-dom";
// import { ImCancelCircle } from "react-icons/im";

// const Task_details_client = () => {
//   const navigate = useNavigate();
//   const employeeDetails = JSON.parse(localStorage.getItem("hrmsuser"));

//   const employeeemail = employeeDetails._id;
//   const superUser = employeeDetails?.superUser;
//   const employeeId = employeeDetails.employeeId;
//   // console.log("employeeDetails:", employeeDetails);

//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [buttonLoading, setButtonLoading] = useState(false);

//   // Fetch roles from the API
//   useEffect(() => {
//     fetchProject();
//   }, []);

//   //   const [status, setStatus] = useState("");
//   const storedDetatis = localStorage.getItem("hrmsuser");
//   const parsedDetails = JSON.parse(null);
//   const userid = parsedDetails ? parsedDetails.id : null;

//   const [taskdetails, setTaskdetails] = useState([]);
//   // console.log("taskdetails", taskdetails);

//   const fetchProjectlist = async () => {
//     setButtonLoading(true);
//     try {
//       const response = await axios.get(`${API_URL}/api/task/all-tasklist-id`, {
//         params: { clientId: employeeemail },
//       });
//       // console.log(response);
//       if (response.data.success) {
//         setTaskdetails(response.data.data);
//         setButtonLoading(false);
//       } else {
//         setErrors("Failed to fetch roles.");
//         setButtonLoading(false);
//       }
//     } catch (err) {
//       setErrors("Failed to fetch roles.");
//       setButtonLoading(false);
//     }
//   };

//   // Open and close modals
//   const openAddModal = () => {
//     setIsAddModalOpen(true);
//   };
//   const closeAddModal = () => {
//     setIsAddModalOpen(false);
//     resetForm();
//   };

//   const [currentDate, setCurrentDate] = useState("");

//   useEffect(() => {
//     const today = new Date().toISOString().split("T")[0];
//     // console.log(today)

//     setCurrentDate(today);
//   }, []);

//   const [dueDate, setDueDate] = useState("");
//   const [projectname, setProjectName] = useState("");
//   const [projectDescription, setProjectDescription] = useState("");
//   const [projecttile, setProjecttiltle] = useState("");
//   const [priority, setPriority] = useState("");
//   const [status, setStatus] = useState("");
//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [assignTo, setAssignTo] = useState("");

//   const [employeeOption, setEmployeeOption] = useState(null);

//   const fetchEmployeeList = async () => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/api/employees/all-employees`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       // const employeeIds = response.data.data.map(emp => `${emp.employeeId} - ${emp.employeeName}`);
//       // const employeeemail = response.data.data.map((emp) => emp.email);
//       // console.log("employeeemail", employeeemail);
//       const employeeName = response.data.data.map((emp) => ({
//         label: emp.employeeName,
//         value: emp._id,
//       }));
//       setEmployeeOption(employeeName);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchProjectlist();
//     fetchEmployeeList();
//   }, []);

//   const [project, setProject] = useState([]);

//   const fetchProject = async () => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/api/project/view-projects-id`,
//         {
//           params: { clientId: employeeemail },
//         }
//       );
//       console.log("response1", response);
//       if (response.data.success) {
//         const projectName = response.data.data.map((emp) => ({
//           label: emp.name,
//           value: emp._id,
//           teamMembers: emp.teamMembers,
//           projectManager: emp.projectManager,
//         }));

//         setProject(projectName);
//       } else {
//         setErrors("Failed to fetch project.");
//       }
//     } catch (err) {
//       setErrors("Failed to fetch project.");
//     }
//   };

//   useEffect(() => {
//     // fetchProjectall();
//     fetchProject();
//     setDueDate(new Date().toISOString().split("T")[0]);
//   }, []);

//   //   const [errors, setErrors] = useState({});

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const selectedProject = project.find((proj) => proj.value == projectname);
//     const projectId = selectedProject?.label || "";

//     try {
//       const formData = new FormData();
//       formData.append("startDate", currentDate); //current date
//       formData.append("dueDate", dueDate);
//       formData.append("projectName", projectId);
//       formData.append("description", projectDescription);
//       formData.append("status", "todo");
//       formData.append("title", projecttile);
//       formData.append("assignedTo", assignTo);
//       formData.append("createdById", employeeemail);
//       formData.append("priority", priority);
//       formData.append("projectId", projectname);
//       formData.append("projectManagerId", projectManagerName);
//       uploadedFiles.forEach((file) => {
//         formData.append("document[]", file);
//       });

//       // formData.append(
//       //   "taskDetails",
//       //   JSON.stringify({
//       //     title: projecttile,
//       //     description: projectDescription,
//       //     assignedTo: employeeemail,
//       //     projectId,
//       //     projectName: projectname,
//       //     status,
//       //     priority,
//       //     dueDate: currentDate,
//       //   })
//       // );

//       const response = await axios.post(
//         `${API_URL}/api/task/create-task`,
//         formData
//       );

//       Swal.fire({
//         icon: "success",
//         title: "Task Created!",
//         text: "Your task has been successfully created.",
//         confirmButtonColor: "#3085d6",
//       });
//       closeAddModal();
//       setProjectName("");
//       setProjecttiltle("");
//       setProjectDescription("");
//       setStatus("");

//       setPriority("");
//       setUploadedFiles([]);
//       setCurrentDate(new Date().toISOString().split("T")[0]);
//       setErrors({});
//       fetchProjectlist();
//     } catch (err) {
//       if (err.response?.data?.errors) {
//         setErrors(err.response.data.errors);
//       } else {
//         console.error("Error submitting form:", err);
//         Swal.fire({
//           icon: "error",
//           title: "Oops!",
//           text: "Something went wrong while creating the task.",
//         });
//       }
//     }
//   };

//   const [taskData, setTaskData] = useState({
//     // currentDate:"",
//     id: "",
//     project: "",
//     taskTitle: "",
//     description: "",
//     assignTo: "",
//     priority: "",
//     document: [],
//     startDate: "",
//     dueDate: "",
//   });

//   const openEditModal = (row) => {
//     // console.log("row", row);
//     setTaskData({
//       id: row._id,
//       // currentDate: row.currentDate,
//       project: row.projectId?._id,
//       taskTitle: row.title,
//       description: row.description,
//       assignTo: row.assignedTo?._id,
//       priority: row.priority,
//       document: row.document,
//       startDate: row?.startDate?.split("T")[0],
//       dueDate: row?.dueDate?.split("T")[0],
//     });
//     setIsEditModalOpen(true);
//   };

//   const validateStatusedit = (value) => {
//     const newErrors = { ...errors };
//     if (!value) {
//       newErrors.statusedit = ["Status is required"];
//     } else {
//       delete newErrors.statusedit;
//     }
//     setErrors(newErrors);
//   };

//   const closeEditModal = () => {
//     setIsEditModalOpen(false);
//   };

//   const handlesubmitedit = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();

//       formData.append("projectName", taskData.project);
//       formData.append("title", taskData.taskTitle);
//       formData.append("dueDate", taskData.dueDate);
//       formData.append("description", taskData.description);
//       formData.append("assignedTo", taskData.assignTo);
//       formData.append("priority", priority);

//       uploadedFiles.forEach((file) => {
//         formData.append("document[]", file);
//       });

//       // const formData = {
//       //   projectName: taskData.project,
//       //   title: taskData.taskTitle,
//       //   description: taskData.description,
//       //   assignedTo: taskData.assignTo,
//       //   priority: taskData.priority,
//       //   document : uploadedFiles
//       // };

//       const response = await axios.put(
//         `${API_URL}/api/task/update-task/${taskData.id}`,
//         formData
//       );
//       // console.log("response:", response);
//       Swal.fire({
//         icon: "success",
//         title: "Client Update successfully!",
//         showConfirmButton: true,
//         timer: 1500,
//       });

//       setIsEditModalOpen(false);
//       fetchProject();
//       fetchProjectlist();
//       setUploadedFiles([]);

//       //   fetchProject();
//       setErrors({});
//     } catch (err) {
//       if (err.response?.data?.errors) {
//         setErrors(err.response.data.errors);
//       } else {
//         console.error("Error submitting form:", err);
//       }
//     }
//   };

//   // Validate Status dynamically
//   const validateStatus = (value) => {
//     const newErrors = { ...errors };
//     if (!value) {
//       newErrors.status = ["Status is required"];
//     } else {
//       delete newErrors.status;
//     }
//     setErrors(newErrors);
//   };

//   const handleDelete = async (id) => {
//     // console.log("editid", id);

//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "Do you want to delete this task?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "Cancel",
//     });

//     if (result.isConfirmed) {
//       try {
//         const res = await axios.delete(`${API_URL}/api/task/delete-task/${id}`);
//         Swal.fire("Success", "The role has been deleted Successfully!");

//         fetchProjectlist();
//       } catch (err) {
//         console.error("Failed to delete:", err);
//         Swal.fire("Error", "There was an error deleting the task.", "error");
//       }
//     } else {
//       Swal.fire("Cancelled", "Your role is safe :)", "info");
//     }
//   };

//   //   console.log("edit modal", roleDetails);

//   window.navigateToTask = function (taskId) {
//     window.location.href = `/tasklist-details_client/${taskId}`;
//   };

//   // function onClickCard(employeeId) {
//   //   localStorage.setItem("selectedEmployeeId", employeeId);
//   //   console.log("employeeId", employeeId);
//   //   window.open("/employeedetails", "_blank");
//   // }

//   // function onClickCard(employeeId) {
//   //   navigate("/employeedetails", {
//   //     state: { employeeId },
//   //   });
//   //   console.log(employeeId)

//   //   window.scrollTo({
//   //     top: 0,
//   //     behavior: "instant",
//   //   });
//   // }

//   function onClickCard(employeeId) {
//     // Open in new tab with query param
//     window.open(`/employeedetails/${employeeId}`, "_blank");

//     // Optional: Scroll current page to top
//     window.scrollTo({
//       top: 0,
//       behavior: "instant",
//     });
//   }

//   const columns = [
//     {
//       title: "Sno",
//       data: null,
//       render: function (data, type, row, meta) {
//         return meta.row + 1;
//       },
//     },

//     {
//       title: "Task ID",
//       data: "taskId",
//       render: function (data, type, row) {
//         return `<a 
//               href="/tasklist-details/${row.taskId}" 
//               target="_blank" 
//               style="color: #2563eb; text-decoration: underline; cursor: pointer;"
//             >
//               ${row.taskId}
//             </a>`;
//       },
//     },

//     {
//       title: "Project Name",
//       data: "projectName",
//       render: function (data, type, row) {
//         return `<div>${row?.projectId?.name}</div>`;
//       },
//     },
//     {
//       title: "Assigned To",
//       data: null, // Changed from "employeeName" to null since we're handling data manually
//       render: (data, type, row) => {
//         // Safely access properties with optional chaining
//         const displayName =
//           [row?.assignedTo?.employeeName].find(
//             (value) => value && value.trim()
//           ) || "N/A";

//         const id = `assigned-to-${
//           row?.assignedTo?.employeeName || row?.id || Date.now()
//         }`;

//         return `<div id="${id}">${displayName}</div>`;
//       },
//       createdCell: (td, cellData, rowData, row, col) => {
//         const displayName =
//           [rowData?.assignedTo?.employeeName].find(
//             (value) => value && value.trim()
//           ) || "N/A";

//         ReactDOM.render(
//           <span
//             style={{ cursor: "pointer", color: "black" }}
//             onMouseOver={(e) => (e.target.style.color = "blue")}
//             onMouseOut={(e) => (e.target.style.color = "black")}
//             onClick={() => onClickCard(rowData?.assignedTo?._id)}
//           >
//             {displayName}
//           </span>,
//           td
//         );
//       },
//     },

//     {
//       title: "Title",
//       data: "title",
//     },
//     {
//       title: "Status",
//       data: "status",
//     },
//     {
//       title: "Priority",
//       data: "priority",
//       render: function (data, type, row) {
//         let color = "";
//         let text = "";
//         switch (data.toLowerCase()) {
//           case "high":
//             color = "bg-red-50";
//             text = "text-red-600";
//             break;
//           case "medium":
//             color = "bg-orange-50";
//             text = "text-orange-600";
//             break;
//           case "low":
//             color = "bg-yellow-50";
//             text = "text-yellow-600";
//             break;
//           default:
//             color = "gray";
//         }
//         return `<span class="${color} ${text} text-md font-extralight" style="padding: 4px 8px; border-radius: 6px;">${data}</span>`;
//       },
//     },

//     // {
//     //   title: "Status",
//     //   data: "status",
//     //   render: (data, type, row) => {
//     //     const textColor = data === "1" ? "green" : "red";
//     //     return `<div style="display: inline-block; padding: 4px 8px; color: ${textColor}; border: 1px solid ${textColor}; border-radius: 50px; text-align: center; width:100px; font-size: 10px; font-weight: 700;">
//     //               ${data === "1" ? "Active" : "InActive"}
//     //             </div>`;
//     //   },
//     // },

//     {
//       title: "Action",
//       data: null,
//       render: (data, type, row) => {
//         const id = `actions-${row.sno || Math.random()}`;
//         setTimeout(() => {
//           const container = document.getElementById(id);
//           if (container && !container.hasChildNodes()) {
//             ReactDOM.render(
//               <div
//                 className="action-container"
//                 style={{
//                   display: "flex",
//                   gap: "15px",
//                   alignItems: "flex-end",
//                   justifyContent: "center",
//                 }}
//               >
//                 {/* <div className="cursor-pointer">
//                   <FaEye
                    
//                   />
//                 </div> */}
//                 <div
//                   className="modula-icon-edit  flex gap-2"
//                   style={{
//                     color: "#000",
//                   }}
//                 >
//                   <TfiPencilAlt
//                     className="cursor-pointer"
//                     onClick={() => openEditModal(row)}
//                   />
//                   <MdOutlineDeleteOutline
//                     className="text-red-600 text-xl cursor-pointer"
//                     onClick={() => handleDelete(row._id)}
//                   />
//                 </div>

//                 {/* <div className="modula-icon-del" style={{
//                   color: "red"
//                 }}>
//                   <RiDeleteBin6Line
//                     onClick={() => handleDelete(row.id)}
//                   />
//                 </div> */}
//               </div>,
//               container
//             );
//           }
//         }, 0);
//         return `<div id="${id}"></div>`;
//       },
//     },
//   ];

//   const header = (
//     <>
//       <span className="ql-formats">
//         <select className="ql-header" defaultValue="">
//           <option value="1" />
//           <option value="2" />
//           <option value="" />
//         </select>
//       </span>
//       <span className="ql-formats">
//         <button className="ql-bold" />
//         <button className="ql-italic" />
//         <button className="ql-underline" />
//       </span>
//       <span className="ql-formats">
//         <select className="ql-color" />
//         <select className="ql-background" />
//       </span>
//       <span className="ql-formats">
//         <button className="ql-list" value="ordered" />
//         <button className="ql-list" value="bullet" />
//       </span>
//       <span className="ql-formats">
//         <button className="ql-link" />
//       </span>
//     </>
//   );

//   const priorityOption = ["Low", "Medium", "High", "Critical"];

//   // conutry list

//   //   const [selectedCountry, setSelectedCountry] = useState(null);

//   const countryOptions = [
//     { name: "United States", code: "US" },
//     { name: "India", code: "IN" },
//     { name: "China", code: "CN" },
//     { name: "Brazil", code: "BR" },
//     { name: "Indonesia", code: "ID" },
//     { name: "Pakistan", code: "PK" },
//     { name: "Nigeria", code: "NG" },
//     { name: "Bangladesh", code: "BD" },
//     { name: "Russia", code: "RU" },
//     { name: "Mexico", code: "MX" },
//     { name: "United Kingdom", code: "UK" }, // added UK
//   ];

//   const [projectManagerName, setProjectManagerName] = useState("");
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

//   // const filteredEmployees = projectname ? employeeOption.filter((emp) =>
//   //       projectFilter[0].teamMembers.includes(emp.value) ||
//   //       projectFilter[0].projectManager.includes(emp.value)
//   //     )
//   //   : employeeOption;

//   const filteredEmployees = (() => {
//     const selectedRole = project.find((proj) => proj.value === projectname);
//     return selectedRole
//       ? employeeOption.filter(
//           (emp) =>
//             selectedRole.teamMembers?.includes(emp.value) ||
//             selectedRole.projectManager.includes(emp.value)
//         )
//       : employeeOption;
//   })();

//   const resetForm = () => {
//     setProjectName("");
//     setProjecttiltle("");
//     setProjectDescription("");
//     setAssignTo("");
//     setPriority("");
//     setUploadedFiles([]);
//     setErrors({});
//   };

//   const fileInputRef = useRef(null);

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setUploadedFiles((prev) => [...prev, ...selectedFiles]);
//     fileInputRef.current.value = ""; // reset input to clear file preview
//   };

//   const handleDeleteTaskFile = async (index, filePathToDelete, id) => {
//     // Show confirmation dialog
//     // const isConfirmed = window.confirm('Are you sure you want to delete this role?');
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "Do you want to delete this file?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "Cancel",
//     });

//     // If user confirms, proceed with deletion
//     if (result.isConfirmed) {
//       // if (isConfirmed) {
//       // try {
//       //   const response = await axios.delete(
//       //     `${API_URL}/api/roles/delete/${userid}?index=${index}`
//       //   );

//       //   setProject(project.filter((role) => role.id !== roleId));
//       //   fetchRoles();
//       // } catch (error) {
//       //   console.error("Error deleting role:", error);
//       // }

//       try {
//         const res = await axios.delete(
//           `${API_URL}/api/task/delete-task-file/${id}/${index}`,
//           {
//             // backend should accept this
//           }
//         );
//         setTaskData((prev) => ({
//           ...prev,
//           document: prev.document.filter((_, i) => i !== index),
//         }));
//         // setUploadedFiles([]);

//         // if (res.status === 200) {
//         //   // Remove the file from frontend state
//         //   const updatedDocs = roleDetails.document.filter(
//         //     (doc) => doc.index !== index
//         //   );
//         //   setRoleDetails((prev) => ({
//         //     ...prev,
//         //     document: updatedDocs,
//         //   }));
//         // }
//       } catch (err) {
//         console.error("Failed to delete file:", err);
//       }
//     } else {
//       Swal.fire("Cancelled", "Your document is safe :)", "info");
//     }
//   };

//   return (
//     <>
//       {buttonLoading ? (
//         <div className="flex justify-center items-center w-full h-screen">
//           <div className="w-12 h-12 border-4 border-blue-500 rounded-full animate-ping"></div>
//         </div>
//       ) : (
//         <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-2 md:pt-10">
//           <div>
//             <Mobile_Sidebar />

//             <div className="flex gap-2 items-center cursor-pointer">
//               <p
//                 className="text-sm text-gray-500"
//                 onClick={() => navigate("/dashboard")}
//               >
//                 Dashboard
//               </p>
//               <p>{">"}</p>
//               <p
//                 className="text-sm text-gray-500"
//                 onClick={() => navigate("/task-list-client")}
//               >
//                 Task List
//               </p>
//               <p>{">"}</p>

//               <p className="text-sm text-blue-500">Task Details</p>
//             </div>

//             {/* Add Button */}
//             <div className="flex justify-between mt-8 mb-3">
//               <h1 className="text-2xl md:text-3xl font-semibold">
//                 Task Details
//               </h1>
//               <button
//                 onClick={openAddModal}
//                 className="bg-blue-600 px-3 py-2 text-white w-20 rounded-2xl"
//               >
//                 Add
//               </button>
//             </div>

//             <div className="datatable-container">
//               {/* Responsive wrapper for the table */}
//               <div className="table-scroll-container" id="datatable">
//                 <DataTable
//                   data={taskdetails}
//                   columns={columns}
//                   options={{
//                     paging: true,
//                     searching: true,
//                     ordering: true,
//                     scrollX: true,
//                     responsive: true,
//                     autoWidth: false,
//                   }}
//                   className="display nowrap bg-white"
//                   emptyMessage="No Data Found"
//                 />
//               </div>
//             </div>
//             {/* Add Modal */}
//             {isAddModalOpen && (
//               <div
//                 onClick={() => setIsAddModalOpen(false)}
//                 className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
//               >
//                 <div
//                   onClick={(e) => e.stopPropagation()}
//                   className="bg-white p-5 rounded-xl w-[680px] h-[580px] overflow-y-auto"
//                 >
//                   <div className="flex justify-between items-center gap-2 ">
//                     <h2 className="text-xl font-semibold mb-4">Add Task</h2>
//                     <div
//                       onClick={closeAddModal}
//                       className="text-red-500 cursor-pointer"
//                     >
//                       <ImCancelCircle className="size-6 " />
//                     </div>
//                   </div>
//                   <div className="my-2">
//                     <label
//                       htmlFor="employee_name"
//                       className="block text-sm font-medium mb-2"
//                     >
//                       Current Date <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       className="w-full px-2 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       id="current_date"
//                       type="date"
//                       value={currentDate}
//                       readOnly
//                       disabled
//                     />
//                   </div>
//                   <div className="my-2">
//                     <label
//                       htmlFor="employee_name"
//                       className="block text-sm font-medium mb-2"
//                     >
//                       Due Date
//                     </label>
//                     <input
//                       className="w-full px-2 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       id="current_date"
//                       type="date"
//                       value={dueDate}
//                       onChange={(e) => {
//                         setDueDate(e.target.value);
//                       }}
//                       min={currentDate}
//                     />
//                   </div>
//                   <p className="block text-sm font-medium mb-2">
//                     Project <span className="text-red-500">*</span>
//                   </p>
//                   {/* <select
//                     name="status"
//                     id="status"
//                     value={projectname}
//                     onChange={(e) => {
//                       setProjectName(e.target.value);
//                       handleRoleChange(e.target.value);
//                     }}
//                     className="w-full px-2 py-2 cursor-pointer  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select a Project</option>
//                     {project.map((role) => (
//                       <option key={role._id} value={role.name}>
//                         {role.name}
//                       </option>
//                     ))}
//                   </select>  */}
//                   <Dropdown
//                     value={projectname}
//                     onChange={(e) => {
//                       handleRoleChange(e.value);
//                       setProjectName(e.value);
//                     }}
//                     options={project}
//                     filter
//                     optionLabel="label"
//                     placeholder="Select a Project"
//                     className="w-full  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   {errors.projectName && (
//                     <p className="text-red-500 text-sm mb-4">
//                       {errors.projectName}
//                     </p>
//                   )}
//                   <label
//                     htmlFor="roleName"
//                     className="block text-sm font-medium mb-2 mt-3"
//                   >
//                     Task Title <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     // id="rolename"
//                     value={projecttile}
//                     onChange={(e) => setProjecttiltle(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   {/* {error.rolename && <p className="error">{error.rolename}</p>} */}
//                   {errors.title && (
//                     <p className="text-red-500 text-sm mb-4">{errors.title}</p>
//                   )}
//                   <label
//                     htmlFor="roleName"
//                     className="block text-sm font-medium mb-2 mt-2"
//                   >
//                     Description <span className="text-red-500">*</span>
//                   </label>
//                   <div className="card">
//                     <Editor
//                       value={projectDescription}
//                       onTextChange={(e) => setProjectDescription(e.htmlValue)}
//                       style={{ height: "200px" }}
//                     />
//                   </div>
//                   {/* {error.rolename && <p className="error">{error.rolename}</p>} */}
//                   {errors.description && (
//                     <p className="text-red-500 text-sm mb-4">
//                       {errors.description}
//                     </p>
//                   )}
//                   <div className="my-2">
//                     <label
//                       htmlFor="employee_name"
//                       className="block text-sm font-medium mb-2"
//                     >
//                       Assign To
//                     </label>
//                     <Dropdown
//                       value={assignTo}
//                       onChange={(e) => setAssignTo(e.value)}
//                       options={projectname ? filteredEmployees : []}
//                       placeholder="Select Employee"
//                       filter
//                       className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />

//                     {errors.assignedTo && (
//                       <p className="text-red-500 text-sm mb-4">
//                         {errors.assignedTo}
//                       </p>
//                     )}
//                     {/* <input
//                 className="w-full px-2 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={employeeemail}
//               ></input> */}
//                   </div>

//                   {/* <p className="block text-sm font-medium mb-2">Status</p>
//             <select
//               name="status"
//               id="status"
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//               className="w-full px-2 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select a status</option>
//               <option value="todo">To DO</option>
//               <option value="inprogress">In Progress</option>
//               <option value="inreview">In Review</option>
//               <option value="done">Done</option>
//               <option value="blocked">Blocked</option>
//             </select> */}

//                   <p className="block text-sm font-medium mb-2 mt-3">
//                     Priority <span className="text-red-500">*</span>
//                   </p>
//                   <select
//                     name="status"
//                     id="status"
//                     value={priority}
//                     onChange={(e) => setPriority(e.target.value)}
//                     className="w-full px-2 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select a Priority</option>
//                     <option value="high">High</option>
//                     <option value="medium">Medium</option>
//                     <option value="low">Low</option>
//                   </select>
//                   {/* {error.status && <p className="error">{error.status}</p>} */}
//                   {errors.priority && (
//                     <p className="text-red-500 text-sm mb-4">
//                       {errors.priority}
//                     </p>
//                   )}

//                   <label
//                     htmlFor="demo"
//                     className="block text-sm font-medium mb-2 mt-4 "
//                   >
//                     Upload Files
//                   </label>
//                   {/* <FileUpload
//                 name="demo[]"
//                 // url="/api/upload"
//                 multiple
//                 accept="image/*"
//                 maxFileSize={1000000}
//                 auto={false}
//                 showUploadButton={false}
//                 showCancelButton={false}
//                 onSelect={(e) =>
//                   setUploadedFiles((prev) => [...prev, ...e.files])
//                 }
//                 chooseLabel="Upload"
//                 className="overflow-y-scroll h-40"
//               /> */}
//                   <input
//                     type="file"
//                     multiple
//                     ref={fileInputRef}
//                     onChange={handleFileChange}
//                     style={{ display: "none" }}
//                   />

//                   {/* Custom upload button */}
//                   <button
//                     onClick={() => fileInputRef.current.click()}
//                     className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded mt-2"
//                   >
//                     Upload Files
//                   </button>
//                   {errors.error && (
//                     <span className="text-red-500 ml-2 text-sm">
//                       {errors.error}
//                     </span>
//                   )}
//                   <ul className="mt-3 gap-3 flex">
//                     {uploadedFiles.map((file, index) => (
//                       <li
//                         key={index}
//                         className=" items-center bg-blue-50 rounded-full gap-3 flex px-4  "
//                       >
//                         <button
//                           onClick={() =>
//                             setUploadedFiles((prev) =>
//                               prev.filter((_, i) => i !== index)
//                             )
//                           }
//                           className="text-red-500 hover:text-red-700 font-bold text-2xl"
//                         >
//                           ×
//                         </button>
//                         <span className="text-sm">{file.name}</span>
//                       </li>
//                     ))}
//                   </ul>

//                   <div className="flex gap-2 justify-end mt-2">
//                     <button
//                       onClick={closeAddModal}
//                       className=" bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 font-semibold rounded-full"
//                       onClick={handleSubmit}
//                     >
//                       Save
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Edit Modal */}
//             {isEditModalOpen && (
//               <div
//                 // onClick={() => setIsEditModalOpen(false)}
//                 className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
//               >
//                 <div
//                   // onClick={(e) => e.stopPropagation()}
//                   className="bg-white p-5 rounded-xl w-[680px] h-[580px] overflow-y-auto"
//                 >
//                   <div className="flex justify-between items-center gap-2 ">
//                     <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
//                     <div
//                       onClick={closeEditModal}
//                       className="text-red-500 cursor-pointer"
//                     >
//                       <ImCancelCircle className="size-6 " />
//                     </div>
//                   </div>
//                   <div className="my-2">
//                     <label
//                       htmlFor="employee_name"
//                       className="block text-sm font-medium mb-2"
//                     >
//                       Task Created Date
//                     </label>
//                     <input
//                       className="w-full px-2 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       id="current_date"
//                       type="date"
//                       value={taskData.startDate}
//                       readOnly
//                       disabled
//                     />
//                   </div>
//                   <div className="my-2">
//                     <label
//                       htmlFor="employee_name"
//                       className="block text-sm font-medium mb-2"
//                     >
//                       Due Date
//                     </label>
//                     <input
//                       className="w-full px-2 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       id="current_date"
//                       type="date"
//                       value={taskData?.dueDate}
//                       onChange={(e) => {
//                         setTaskData({
//                           ...taskData,
//                           dueDate: e.target.value,
//                         });
//                       }}
//                       min={currentDate}
//                     />
//                   </div>
//                   <p className="block text-sm font-medium mb-2">
//                     Project <span className="text-red-500">*</span>
//                   </p>
//                   {/* <select
//                     name="status"
//                     id="status"
//                     value={taskData.project}
//                     onChange={(e) =>
//                       setTaskData({
//                         ...taskData,
//                         project: e.target.value,
//                       })
//                     }
//                     className="w-full px-2 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select a Project</option>
//                     {project.map((role) => (
//                       <option key={role._id} value={role.name}>
//                         {role.name}
//                       </option>
//                     ))}
//                   </select> */}
//                   <Dropdown
//                     value={taskData.project}
//                     onChange={(e) =>
//                       setTaskData({
//                         ...taskData,
//                         project: e.value,
//                       })
//                     }
//                     filter
//                     options={project}
//                     optionLabel="label"
//                     placeholder="Select a Project"
//                     className="w-full  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   {errors.projectName && (
//                     <p className="text-red-500 text-sm mb-4">
//                       {errors.projectName}
//                     </p>
//                   )}
//                   <label
//                     htmlFor="roleName"
//                     className="block text-sm font-medium mb-2 mt-3"
//                   >
//                     Task Title <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     // id="rolename"
//                     value={taskData.taskTitle}
//                     onChange={(e) =>
//                       setTaskData({
//                         ...taskData,
//                         taskTitle: e.target.value,
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                   {/* {error.rolename && <p className="error">{error.rolename}</p>} */}
//                   {errors.title && (
//                     <p className="text-red-500 text-sm mb-4">{errors.title}</p>
//                   )}
//                   <label
//                     htmlFor="roleName"
//                     className="block text-sm font-medium mb-2 mt-2"
//                   >
//                     Description <span className="text-red-500">*</span>
//                   </label>
//                   <div className="card">
//                     <Editor
//                       value={taskData.description}
//                       // onTextChange={(e) => setProjectDescription(e.htmlValue)}
//                       onTextChange={(e) =>
//                         setTaskData({
//                           ...taskData,
//                           description: e.htmlValue,
//                         })
//                       }
//                       style={{ height: "200px" }}
//                     />
//                   </div>
//                   {/* {error.rolename && <p className="error">{error.rolename}</p>} */}
//                   {errors.description && (
//                     <p className="text-red-500 text-sm mb-4">
//                       {errors.description}
//                     </p>
//                   )}
//                   <div className="my-2">
//                     <label
//                       htmlFor="employee_name"
//                       className="block text-sm font-medium mb-2"
//                     >
//                       Assign To <span className="text-red-500">*</span>
//                     </label>
//                     <Dropdown
//                       value={taskData.assignTo} // must be the email for edit mode to work
//                       onChange={(e) =>
//                         setTaskData({
//                           ...taskData,
//                           assignTo: e.value, // use e.value, not e.target.value
//                         })
//                       }
//                       filter
//                       options={filteredEmployees}
//                       placeholder="Select Employee"
//                       className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />

//                     {errors.assignedTo && (
//                       <p className="text-red-500 text-sm mb-4">
//                         {errors.assignedTo}
//                       </p>
//                     )}
//                     {/* <input
//                 className="w-full px-2 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={employeeemail}
//               ></input> */}
//                   </div>

//                   {/* <p className="block text-sm font-medium mb-2">Status</p>
//             <select
//               name="status"
//               id="status"
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//               className="w-full px-2 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select a status</option>
//               <option value="todo">To DO</option>
//               <option value="inprogress">In Progress</option>
//               <option value="inreview">In Review</option>
//               <option value="done">Done</option>
//               <option value="blocked">Blocked</option>
//             </select> */}

//                   <p className="block text-sm font-medium mb-2 mt-3">
//                     Priority <span className="text-red-500">*</span>
//                   </p>
//                   <select
//                     name="status"
//                     id="status"
//                     value={taskData.priority}
//                     onChange={(e) =>
//                       setTaskData({
//                         ...taskData,
//                         priority: e.target.value,
//                       })
//                     }
//                     className="w-full px-2 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select a Priority</option>
//                     <option value="high">High</option>
//                     <option value="medium">Medium</option>
//                     <option value="low">Low</option>
//                   </select>
//                   {/* {error.status && <p className="error">{error.status}</p>} */}
//                   {errors.priority && (
//                     <p className="text-red-500 text-sm mb-4">
//                       {errors.priority}
//                     </p>
//                   )}

//                   <label
//                     htmlFor="demo"
//                     className="block text-sm font-medium mb-2 mt-4 "
//                   >
//                     Upload Files
//                   </label>
//                   {/* <FileUpload
//                 name="demo[]"
//                 // url="/api/upload"
//                 multiple
//                 accept="image/*"
//                 maxFileSize={1000000}
//                 auto={false}
//                 showUploadButton={false}
//                 showCancelButton={false}
//                 onSelect={(e) =>
//                   setUploadedFiles((prev) => [...prev, ...e.files])
//                 }
//                 chooseLabel="Upload"
//                 className="overflow-y-scroll h-40"
//               /> */}
//                   <input
//                     type="file"
//                     multiple
//                     ref={fileInputRef}
//                     onChange={handleFileChange}
//                     style={{ display: "none" }}
//                   />

//                   {/* Custom upload button */}
//                   <button
//                     onClick={() => fileInputRef.current.click()}
//                     className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded mt-2"
//                   >
//                     Upload Files
//                   </button>
//                   {errors.error ? (
//                     <span className="text-red-500 text-sm mb-4 ml-2">
//                       {errors.error}
//                     </span>
//                   ) : (
//                     ""
//                   )}
//                   <ul className="mt-3 gap-3 flex">
//                     {uploadedFiles.map((file, index) => (
//                       <li
//                         key={index}
//                         className=" items-center bg-blue-50 rounded-full gap-3 flex px-4  "
//                       >
//                         <button
//                           onClick={() =>
//                             setUploadedFiles((prev) =>
//                               prev.filter((_, i) => i !== index)
//                             )
//                           }
//                           className="text-red-500 hover:text-red-700 font-bold text-2xl"
//                         >
//                           ×
//                         </button>
//                         <span className="text-sm">{file.name}</span>
//                       </li>
//                     ))}
//                   </ul>
//                   {/* Show existing uploaded document previews */}
//                   <div className="flex flex-wrap mt-2 gap-2">
//                     {taskData?.document?.map((doc, index) => (
//                       <div
//                         key={index}
//                         className="relative w-28 h-24 border rounded overflow-hidden group"
//                       >
//                         <a
//                           href={`${API_URL}/api/uploads/others/${doc.filepath}`}
//                           target="_blank"
//                         >
//                           <img
//                             src={`${API_URL}/api/uploads/others/${doc.filepath}`}
//                             alt={doc.originalName}
//                             className="w-full h-full object-cover"
//                           />
//                         </a>
//                         <span className="text-[10px] absolute bottom-0 left-0 bg-black text-white px-1 truncate w-full">
//                           {doc.originalName}
//                         </span>
//                         {/* Delete Icon */}
//                         <button
//                           onClick={() =>
//                             handleDeleteTaskFile(
//                               index,
//                               doc.filepath,
//                               taskData.id
//                             )
//                           }
//                           className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs opacity-80 hover:opacity-100"
//                           title="Delete file"
//                         >
//                           <FaTrash />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="flex gap-2 justify-end mt-3">
//                     <button
//                       onClick={() => setIsEditModalOpen(false)}
//                       className=" bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 font-semibold rounded-full"
//                       onClick={handlesubmitedit}
//                     >
//                       Update
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <Footer />
//         </div>
//       )}
//     </>
//   );
// };
// export default Task_details_client;


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
import { FaArrowLeft, FaArrowRight, FaTrash } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import { ImCancelCircle } from "react-icons/im";

const Task_details_client = () => {
 
  const navigate = useNavigate();
  const employeeDetails = JSON.parse(localStorage.getItem("hrmsuser"));

  // const employeeemail = employeeDetails._id;
  let employeeemail;
  if(employeeDetails && employeeDetails.subType){
   employeeemail = employeeDetails?.client?._id;
  }
  else{
    employeeemail = employeeDetails?._id;
  }
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
  //  const [status, setStatus] = useState("");
  // const [priority, setPriority] = useState("");

  // console.log("taskdetails", taskdetails);

  // const fetchProjectlist = async () => {
  //   setButtonLoading(true);
  //   try {
  //     const response = await axios.get(`${API_URL}/api/task/all-tasklist`);
  //     // console.log(response);
  //     if (response.data.success) {
  //       setTaskdetails(response.data.data);
  //       setButtonLoading(false);
  //     } else {
  //       setErrors("Failed to fetch roles.");
  //       setButtonLoading(false);
  //     }
  //   } catch (err) {
  //     setErrors("Failed to fetch roles.");
  //     setButtonLoading(false);
  //   }
  // };
  const [projectNameFilter,setProjectNameFilter]=useState("");
  const fetchProjectlist = async (page = 1, limitValue = limit, type = "") => {
    console.log("hello 1234");
    setButtonLoading(true);

    try {
      let payload = {
        // employeeId: assignTo || "",
        projectId: projectNameFilter || "",
        day: dateFilter || "",
        toDate: toDateFilter || "",
        taskId: taskIdFilter || "",
        page: page,
        searchTerm: searchTerm || "",
        todayTaskDate: todayTaskDate,
        status: status,
        priority: priorityFilter,
        limit: 10,
        limitValue: type,
        clientId:employeeemail
      };

       const response = await axios.get(`${API_URL}/api/task/all-tasklist-id`, {
     
        params: payload,
      });

      if (response.data.success) {
        setTaskdetails(response.data.data);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
        setTotalTasks(response.data.pagination.totalTasks);
        setLimit(limitValue); // update limit if changed
      } else {
        setErrors("Failed to fetch tasks.");
      }
    } catch (err) {
      setErrors("Failed to fetch tasks.");
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
    resetForm();
  };

  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    // console.log(today)

    setCurrentDate(today);
  }, []);

  const [dueDate, setDueDate] = useState("");
  const [projectname, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projecttile, setProjecttiltle] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [assignTo, setAssignTo] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [toDateFilter, setToDateFilter] = useState("");
  const [taskIdFilter, setTaskIdFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [todayTaskDate, setTodaytaskDate] = useState("");
  const [priorityFilter,setPriorityFilter]=useState();

  const [employeeOption, setEmployeeOption] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [clearTriggered, setClearTriggered] = useState(false);

  const fetchEmployeeList = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/employees/all-employees`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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

  // const fetchProject = async () => {
  //   try {
  //     const response = await axios.get(`${API_URL}/api/project/view-projects`);
  //     // console.log(response);
  //     if (response.data.success) {
  //       const projectName = response.data.data.map((emp) => ({
  //         label: emp.name,
  //         value: emp._id,
  //         teamMembers: emp.teamMembers,
  //         projectManager: emp.projectManager,
  //       }));

  //       setProject(projectName);
  //     } else {
  //       setErrors("Failed to fetch project.");
  //     }
  //   } catch (err) {
  //     setErrors("Failed to fetch project.");
  //   }
  // };

  // const fetchProject = async () => {
  //   try {
  //     const response = await axios.get(`${API_URL}/api/project/view-projects-id`,{
  //       params: { clientId: employeeemail },
  //     });
  //     console.log("clientID", employeeemail);
  //     // console.log(response);
  //     if (response.data.success) {
  //       const projectName = response.data.data.map((emp) => ({
  //         label: emp.name,
  //         value: emp._id,
  //         teamMembers: emp.teamMembers,
  //         projectManager: emp.projectManager,
  //       }));
  //       setProject(projectName);
  //     } else {
  //       setErrors("Failed to fetch project.");
  //     }
  //   } catch (err) {
  //     setErrors("Failed to fetch project.");
  //   }
  // };
   const fetchProject = async () => {
    try {
      console.log("coming", employeeDetails.subType);

      if (employeeDetails.subType == "subuser") {
        console.log("coming 12344");
        const response = await axios.get(
          `${API_URL}/api/project/clientsubuser`,
          {
            params: { clientId: employeeemail, subUserId: employeeDetails._id },
          }
        );
        console.log("55555", response);
        if (response.data.success) {
          const projectName = response.data.data.map((emp) => ({
            label: emp.name,
            value: emp._id,
            teamMembers: emp.teamMembers,
            projectManager: emp.projectManager,
          }));
          setProject(projectName);
        } else {
          console.log("error subuser api");
          setErrors("Failed to fetch project.");
        }
      } else {
        const response = await axios.get(
          `${API_URL}/api/project/view-projects-id`,
          {
            params: { clientId: employeeemail },
          }
        );
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

  const selectedProject = project.find((proj) => proj.value == projectname);
  const projectId = selectedProject?.label || "";

  try {
    const formData = new FormData();
    formData.append("startDate", currentDate);
    formData.append("dueDate", dueDate);
    formData.append("projectName", projectId);
    formData.append("description", projectDescription);
    formData.append("status", "todo");
    formData.append("title", projecttile);
    formData.append("assignedTo", assignTo);
    formData.append("createdById", employeeDetails?._id);
    formData.append("priority", priority);
    formData.append("projectId", projectname);
    formData.append("projectManagerId", projectManagerName);

    uploadedFiles.forEach((file) => {
      formData.append("document[]", file);
    });

    const response = await axios.post(`${API_URL}/api/task/create-task`, formData);

    // 🧩 Check if backend actually reports success
    if (response.data.success === true) {
      Swal.fire({
        icon: "success",
        title: "Task Created!",
        text: "Your task has been successfully created.",
        confirmButtonColor: "#3085d6",
      });

      closeAddModal();
      setProjectName("");
      setProjecttiltle("");
      setProjectDescription("");
      setStatus("");
      setPriority("");
      setUploadedFiles([]);
      setCurrentDate(new Date().toISOString().split("T")[0]);
      setErrors({});
      fetchProjectlist();
    } else {
      // ❌ Handle server-side logical errors
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: response.data.message || "Something went wrong while creating the task.",
      });
    }
  } catch (err) {
    // 🧨 Network or server crash error
    if (err.response?.data?.errors) {
      setErrors(err.response.data.errors);
    }

    Swal.fire({
      icon: "error",
      title: "Oops!",
      text: err.response?.data?.message || "Something went wrong while creating the task.",
    });

    console.error("Error submitting form:", err);
  }
};


  const [taskData, setTaskData] = useState({
    // currentDate:"",
    id: "",
    project: "",
    taskTitle: "",
    description: "",
    assignTo: "",
    priority: "",
    document: [],
    startDate: "",
    dueDate: "",
  });

  const openEditModal = (row) => {
    // console.log("row", row);
    setTaskData({
      id: row._id,
      // currentDate: row.currentDate,
      project: row.projectId?._id,
      taskTitle: row.title,
      description: row.description,
      assignTo: row.assignedTo?._id,
      priority: row.priority,
      document: row.document,
      startDate: row?.startDate?.split("T")[0],
      dueDate: row?.dueDate?.split("T")[0],
    });
    setIsEditModalOpen(true);
  };

  const validateStatusedit = (value) => {
    const newErrors = { ...errors };
    if (!value) {
      newErrors.statusedit = ["Status is required"];
    } else {
      delete newErrors.statusedit;
    }
    setErrors(newErrors);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handlesubmitedit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("projectName", taskData.project);
      formData.append("title", taskData.taskTitle);
      formData.append("dueDate", taskData.dueDate);
      formData.append("description", taskData.description);
      formData.append("assignedTo", taskData.assignTo);
      formData.append("priority", taskData.priority);

      uploadedFiles.forEach((file) => {
        formData.append("document[]", file);
      });

      // const formData = {
      //   projectName: taskData.project,
      //   title: taskData.taskTitle,
      //   description: taskData.description,
      //   assignedTo: taskData.assignTo,
      //   priority: taskData.priority,
      //   document : uploadedFiles
      // };

      const response = await axios.put(
        `${API_URL}/api/task/update-task/${taskData.id}`,
        formData
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
        const res = await axios.delete(`${API_URL}/api/task/delete-task/${id}`);
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
    window.location.href = `/tasklist-details_client/${taskId}`;
  };

  // function onClickCard(employeeId) {
  //   localStorage.setItem("selectedEmployeeId", employeeId);
  //   console.log("employeeId", employeeId);
  //   window.open("/employeedetails", "_blank");
  // }

  // function onClickCard(employeeId) {
  //   navigate("/employeedetails", {
  //     state: { employeeId },
  //   });
  //   console.log(employeeId)

  //   window.scrollTo({
  //     top: 0,
  //     behavior: "instant",
  //   });
  // }

  function onClickCard(employeeId) {
    // Open in new tab with query param
    window.open(`/employeedetails/${employeeId}`, "_blank");

    // Optional: Scroll current page to top
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }

  const columns = [
    {
      title: "Sno",
      data: null,
      render: function (data, type, row, meta) {
        return (currentPage - 1) * limit + (meta.row + 1);
      },
    },

    {
      title: "Task ID",
      data: "taskId",
      render: function (data, type, row) {
        return `<a 
              href="/tasklist-details_client/${row.taskId}" 
              target="_blank" 
              style="color: #2563eb; text-decoration: underline; cursor: pointer;"
            >
              ${row.taskId}
            </a>`;
      },
    },
    {
      title: "Project Name",
      data: "projectName",
      render: function (data, type, row) {
        return `<div>${row?.projectId?.name}</div>`;
      },
    },
    {
      title: "Assigned To",
      data: null, // Changed from "employeeName" to null since we're handling data manually
      render: (data, type, row) => {
        // Safely access properties with optional chaining
        const displayName =
          [row?.assignedTo?.employeeName].find(
            (value) => value && value.trim()
          ) || "N/A";

        const id = `assigned-to-${
          row?.assignedTo?.employeeName || row?.id || Date.now()
        }`;

        return `<div id="${id}">${displayName}</div>`;
      },
      createdCell: (td, cellData, rowData, row, col) => {
        const displayName =
          [rowData?.assignedTo?.employeeName].find(
            (value) => value && value.trim()
          ) || "N/A";

        ReactDOM.render(
          <span
            // style={{ cursor: "pointer", color: "black" }}
            onMouseOver={(e) => (e.target.style.color = "blue")}
            onMouseOut={(e) => (e.target.style.color = "black")}
            onClick={() => onClickCard(rowData?.assignedTo?._id)}
          >
            {displayName}
          </span>,
          td
        );
      },
    },

    {
      title: "Title",
      data: "title",
    },
    {
      title: "Status",
      data: "status",
    },
    {
      title: "Priority",
      data: "priority",
      render: function (data, type, row) {
        let color = "";
        let text = "";
        switch (data.toLowerCase()) {
          case "high":
            color = "bg-red-50";
            text = "text-red-600";
            break;
          case "medium":
            color = "bg-orange-50";
            text = "text-orange-600";
            break;
          case "low":
            color = "bg-yellow-50";
            text = "text-yellow-600";
            break;
          default:
            color = "gray";
        }
        return `<span class="${color} ${text} text-md font-extralight" style="padding: 4px 8px; border-radius: 6px;">${data}</span>`;
      },
    },

    // {
    //   title: "Status",
    //   data: "status",
    //   render: (data, type, row) => {
    //     const textColor = data === "1" ? "green" : "red";
    //     return `<div style="display: inline-block; padding: 4px 8px; color: ${textColor}; border: 1px solid ${textColor}; border-radius: 50px; text-align: center; width:100px; font-size: 10px; font-weight: 700;">
    //               ${data === "1" ? "Active" : "InActive"}
    //             </div>`;
    //   },
    // },

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

  const priorityOption = ["Low", "Medium", "High", "Critical"];

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

  const [projectManagerName, setProjectManagerName] = useState("");
  const handleRoleChange = (name) => {
    // const selectedRoleName = e.target.value;
    setProjectName(name);
    const selectedRole = project.find((proj) => proj.value === name);

    if (selectedRole) {
      setProjectManagerName(selectedRole.projectManager || "");
    } else {
      setProjectManagerName("");
    }
  };

  // const filteredEmployees = projectname ? employeeOption.filter((emp) =>
  //       projectFilter[0].teamMembers.includes(emp.value) ||
  //       projectFilter[0].projectManager.includes(emp.value)
  //     )
  //   : employeeOption;

  const filteredEmployees = (() => {
    const selectedRole = project.find((proj) => proj.value === projectname);
    return selectedRole
      ? employeeOption.filter(
          (emp) =>
            selectedRole.teamMembers?.includes(emp.value) ||
            selectedRole.projectManager.includes(emp.value)
        )
      : employeeOption;
  })();

  const resetForm = () => {
    setProjectName("");
    setProjecttiltle("");
    setProjectDescription("");
    setAssignTo("");
    setPriority("");
    setUploadedFiles([]);
    setErrors({});
  };

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setUploadedFiles((prev) => [...prev, ...selectedFiles]);
    fileInputRef.current.value = ""; // reset input to clear file preview
  };

  const handleDeleteTaskFile = async (index, filePathToDelete, id) => {
    // Show confirmation dialog
    // const isConfirmed = window.confirm('Are you sure you want to delete this role?');
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this file?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    // If user confirms, proceed with deletion
    if (result.isConfirmed) {
      // if (isConfirmed) {
      // try {
      //   const response = await axios.delete(
      //     `${API_URL}/api/roles/delete/${userid}?index=${index}`
      //   );

      //   setProject(project.filter((role) => role.id !== roleId));
      //   fetchRoles();
      // } catch (error) {
      //   console.error("Error deleting role:", error);
      // }

      try {
        const res = await axios.delete(
          `${API_URL}/api/task/delete-task-file/${id}/${index}`,
          {
            // backend should accept this
          }
        );
        setTaskData((prev) => ({
          ...prev,
          document: prev.document.filter((_, i) => i !== index),
        }));
        // setUploadedFiles([]);

        // if (res.status === 200) {
        //   // Remove the file from frontend state
        //   const updatedDocs = roleDetails.document.filter(
        //     (doc) => doc.index !== index
        //   );
        //   setRoleDetails((prev) => ({
        //     ...prev,
        //     document: updatedDocs,
        //   }));
        // }
      } catch (err) {
        console.error("Failed to delete file:", err);
      }
    } else {
      Swal.fire("Cancelled", "Your document is safe :)", "info");
    }
  };

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
            <p
              className="text-sm text-gray-500"
              onClick={() => navigate("/task-list-client")}
            >
              Task Details
            </p>
            <p>{">"}</p>

            <p className="text-sm text-blue-500">Task List</p>
          </div>
          {/* search filter */}
          <div className="flex flex-col md:flex-row justify-between mt-8 mb-4 gap-5 md:gap-0">
            {/* Filters Section */}
            <div className="flex flex-col md:flex-row flex-wrap gap-4 md:gap-5 items-start md:items-center w-full md:w-auto">
              {/* Project Dropdown */}
              <Dropdown
                value={projectNameFilter}
                onChange={(e) => setProjectNameFilter(e.value)}
                options={project}
                optionLabel="label"
                filter
                placeholder="Select a Project"
                className="w-full md:w-[220px] border border-gray-300 rounded-md text-gray-700 text-sm px-3 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Employee Dropdown */}
              {/* <Dropdown
                value={assignTo}
                onChange={(e) => setAssignTo(e.value)}
                options={filteredEmployees}
                filter
                optionLabel="label"
                placeholder="Select Employee"
                className="w-full md:w-[220px] border border-gray-300 rounded-md text-gray-700 text-sm px-3 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              /> */}

              {/* Task ID */}
              <input
                type="text"
                placeholder="Task ID"
                className="w-full md:w-[180px] border border-gray-300 rounded-md text-gray-700 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={taskIdFilter}
                onChange={(e) => setTaskIdFilter(e.target.value)}
              />

              {/* From Date */}
              <div className="relative w-full md:w-[150px]">
                {!dateFilter && !showDatePicker && (
                  <span className="absolute left-3 top-2.5 text-gray-400 text-sm pointer-events-none">
                    From Date
                  </span>
                )}
                <input
                  type={showDatePicker ? "date" : "text"}
                  onFocus={() => setShowDatePicker(true)}
                  onBlur={(e) => {
                    if (!e.target.value) setShowDatePicker(false);
                  }}
                  placeholder=""
                  className="w-full border border-gray-300 rounded-md text-gray-700 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  value={dateFilter}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>

              {/* To Date */}
              <div className="relative w-full md:w-[150px]">
                {!toDateFilter && !showToDatePicker && (
                  <span className="absolute left-3 top-2.5 text-gray-400 text-sm pointer-events-none">
                    To Date
                  </span>
                )}
                <input
                  type={showToDatePicker ? "date" : "text"}
                  onFocus={() => setShowToDatePicker(true)}
                  onBlur={(e) => {
                    if (!e.target.value) setShowToDatePicker(false);
                  }}
                  placeholder=""
                  className="w-full border border-gray-300 rounded-md text-gray-700 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  value={toDateFilter}
                  min={dateFilter}
                  onChange={(e) => setToDateFilter(e.target.value)}
                />
              </div>

              {/* Status Dropdown */}
              <select
                className="w-full md:w-[180px] border border-gray-300 rounded-md text-gray-700 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="in-review">In Review</option>
                <option value="done">Done</option>
                <option value="completed">Completed</option>
                <option value="blocked">Blocked</option>
              </select>

              {/* Priority Dropdown */}
              <select
                className="w-full md:w-[180px] border border-gray-300 rounded-md text-gray-700 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="">Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              {/* Search Box */}
              <input
                type="text"
                placeholder="Search..."
                className="w-full md:w-[180px] border border-gray-300 rounded-md text-gray-700 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Buttons Section */}
              <div className="flex gap-3">
                {/* Search Button */}
                <button
                  onClick={() => fetchProjectlist(1)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-6 py-2 text-sm transition-all duration-200 shadow-sm focus:ring-2 focus:ring-blue-500"
                >
                  Search
                </button>

                {/* ✅ Clear All Button */}
                <button
                  onClick={() => {
                    setProjectName(null);
                    setAssignTo(null);
                    setTaskIdFilter("");
                    setDateFilter("");
                    setToDateFilter("");
                    setStatus("");
                    setPriorityFilter("");
                    setSearchTerm("");
                   setClearTriggered(true); 
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-md px-6 py-2 text-sm transition-all duration-200 shadow-sm focus:ring-2 focus:ring-gray-400"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* Add Button */}
          <div className="flex justify-between mt-8 mb-3">
            <h1 className="text-2xl md:text-3xl font-semibold">Task List</h1>
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
              {/* <DataTable
                  data={taskdetails}
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
                  emptyMessage="No Data Found"
                /> */}
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
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-5 rounded-xl w-[680px] h-[580px] overflow-y-auto"
              >
                <div className="flex justify-between items-center gap-2 ">
                  <h2 className="text-xl font-semibold mb-4">Add Task</h2>
                  <div
                    onClick={closeAddModal}
                    className="text-red-500 cursor-pointer"
                  >
                    <ImCancelCircle className="size-6 " />
                  </div>
                </div>
                <div className="my-2">
                  <label
                    htmlFor="employee_name"
                    className="block text-sm font-medium mb-2"
                  >
                    Current Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full px-2 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="current_date"
                    type="date"
                    value={currentDate}
                    readOnly
                    disabled
                  />
                </div>
                <div className="my-2">
                  <label
                    htmlFor="employee_name"
                    className="block text-sm font-medium mb-2"
                  >
                    Due Date
                  </label>
                  <input
                    className="w-full px-2 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="current_date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => {
                      setDueDate(e.target.value);
                    }}
                    min={currentDate}
                  />
                </div>
                <p className="block text-sm font-medium mb-2">
                  Project <span className="text-red-500">*</span>
                </p>

                <Dropdown
                  value={projectname}
                  onChange={(e) => {
                    handleRoleChange(e.value);
                    setProjectName(e.value);
                  }}
                  options={project}
                  filter
                  optionLabel="label"
                  placeholder="Select a Project"
                  className="w-full  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.projectName && (
                  <p className="text-red-500 text-sm mb-4">
                    {errors.projectName}
                  </p>
                )}
                <label
                  htmlFor="roleName"
                  className="block text-sm font-medium mb-2 mt-3"
                >
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  // id="rolename"
                  value={projecttile}
                  onChange={(e) => setProjecttiltle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* {error.rolename && <p className="error">{error.rolename}</p>} */}
                {errors.title && (
                  <p className="text-red-500 text-sm mb-4">{errors.title}</p>
                )}
                <label
                  htmlFor="roleName"
                  className="block text-sm font-medium mb-2 mt-2"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <div className="card">
                  <Editor
                    value={projectDescription}
                    onTextChange={(e) => setProjectDescription(e.htmlValue)}
                    style={{ height: "200px" }}
                  />
                </div>
                {/* {error.rolename && <p className="error">{error.rolename}</p>} */}
                {errors.description && (
                  <p className="text-red-500 text-sm mb-4">
                    {errors.description}
                  </p>
                )}
                <div className="my-2">
                  <label
                    htmlFor="employee_name"
                    className="block text-sm font-medium mb-2"
                  >
                    Assign To
                  </label>
                  <Dropdown
                    value={assignTo}
                    onChange={(e) => setAssignTo(e.value)}
                    // options={filteredEmployees}
                     options={projectname ? filteredEmployees : []}
                    placeholder="Select Employee"
                    filter
                    className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {errors.assignedTo && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.assignedTo}
                    </p>
                  )}
                  {/* <input
                className="w-full px-2 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={employeeemail}
              ></input> */}
                </div>

                {/* <p className="block text-sm font-medium mb-2">Status</p>
            <select
              name="status"
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-2 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a status</option>
              <option value="todo">To DO</option>
              <option value="inprogress">In Progress</option>
              <option value="inreview">In Review</option>
              <option value="done">Done</option>
              <option value="blocked">Blocked</option>
            </select> */}

                <p className="block text-sm font-medium mb-2 mt-3">
                  Priority <span className="text-red-500">*</span>
                </p>
                <select
                  name="status"
                  id="status"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-2 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                {/* {error.status && <p className="error">{error.status}</p>} */}
                {errors.priority && (
                  <p className="text-red-500 text-sm mb-4">{errors.priority}</p>
                )}

                <label
                  htmlFor="demo"
                  className="block text-sm font-medium mb-2 mt-4 "
                >
                  Upload Files
                </label>
                {/* <FileUpload
                name="demo[]"
                // url="/api/upload"
                multiple
                accept="image/*"
                maxFileSize={1000000}
                auto={false}
                showUploadButton={false}
                showCancelButton={false}
                onSelect={(e) =>
                  setUploadedFiles((prev) => [...prev, ...e.files])
                }
                chooseLabel="Upload"
                className="overflow-y-scroll h-40"
              /> */}
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
                  <span className="text-red-500 ml-2 text-sm">
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

                <div className="flex gap-2 justify-end mt-2">
                  <button
                    onClick={closeAddModal}
                    className=" bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
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
            <div
              // onClick={() => setIsEditModalOpen(false)}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div
                // onClick={(e) => e.stopPropagation()}
                className="bg-white p-5 rounded-xl w-[680px] h-[580px] overflow-y-auto"
              >
                <div className="flex justify-between items-center gap-2 ">
                  <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
                  <div
                    onClick={closeEditModal}
                    className="text-red-500 cursor-pointer"
                  >
                    <ImCancelCircle className="size-6 " />
                  </div>
                </div>
                <div className="my-2">
                  <label
                    htmlFor="employee_name"
                    className="block text-sm font-medium mb-2"
                  >
                    Task Created Date
                  </label>
                  <input
                    className="w-full px-2 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="current_date"
                    type="date"
                    value={taskData.startDate}
                    readOnly
                    disabled
                  />
                </div>
                <div className="my-2">
                  <label
                    htmlFor="employee_name"
                    className="block text-sm font-medium mb-2"
                  >
                    Due Date
                  </label>
                  <input
                    className="w-full px-2 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="current_date"
                    type="date"
                    value={taskData?.dueDate}
                    onChange={(e) => {
                      setTaskData({
                        ...taskData,
                        dueDate: e.target.value,
                      });
                    }}
                    min={currentDate}
                  />
                </div>
                <p className="block text-sm font-medium mb-2">
                  Project <span className="text-red-500">*</span>
                </p>
                {/* <select
                    name="status"
                    id="status"
                    value={taskData.project}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        project: e.target.value,
                      })
                    }
                    className="w-full px-2 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a Project</option>
                    {project.map((role) => (
                      <option key={role._id} value={role.name}>
                        {role.name}
                      </option>
                    ))}
                  </select> */}
                <Dropdown
                  value={taskData.project}
                  onChange={(e) =>
                    setTaskData({
                      ...taskData,
                      project: e.value,
                    })
                  }
                  filter
                  options={project}
                  optionLabel="label"
                  placeholder="Select a Project"
                  className="w-full  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.projectName && (
                  <p className="text-red-500 text-sm mb-4">
                    {errors.projectName}
                  </p>
                )}
                <label
                  htmlFor="roleName"
                  className="block text-sm font-medium mb-2 mt-3"
                >
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  // id="rolename"
                  value={taskData.taskTitle}
                  onChange={(e) =>
                    setTaskData({
                      ...taskData,
                      taskTitle: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* {error.rolename && <p className="error">{error.rolename}</p>} */}
                {errors.title && (
                  <p className="text-red-500 text-sm mb-4">{errors.title}</p>
                )}
                <label
                  htmlFor="roleName"
                  className="block text-sm font-medium mb-2 mt-2"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <div className="card">
                  <Editor
                    value={taskData.description}
                    // onTextChange={(e) => setProjectDescription(e.htmlValue)}
                    onTextChange={(e) =>
                      setTaskData({
                        ...taskData,
                        description: e.htmlValue,
                      })
                    }
                    style={{ height: "200px" }}
                  />
                </div>
                {/* {error.rolename && <p className="error">{error.rolename}</p>} */}
                {errors.description && (
                  <p className="text-red-500 text-sm mb-4">
                    {errors.description}
                  </p>
                )}
                <div className="my-2">
                  <label
                    htmlFor="employee_name"
                    className="block text-sm font-medium mb-2"
                  >
                    Assign To <span className="text-red-500">*</span>
                  </label>
                  <Dropdown
                    value={taskData.assignTo} // must be the email for edit mode to work
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        assignTo: e.value, // use e.value, not e.target.value
                      })
                    }
                    filter
                    options={filteredEmployees}
                    placeholder="Select Employee"
                    className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {errors.assignedTo && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.assignedTo}
                    </p>
                  )}
                  {/* <input
                className="w-full px-2 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={employeeemail}
              ></input> */}
                </div>

                {/* <p className="block text-sm font-medium mb-2">Status</p>
            <select
              name="status"
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-2 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a status</option>
              <option value="todo">To DO</option>
              <option value="inprogress">In Progress</option>
              <option value="inreview">In Review</option>
              <option value="done">Done</option>
              <option value="blocked">Blocked</option>
            </select> */}

                <p className="block text-sm font-medium mb-2 mt-3">
                  Priority <span className="text-red-500">*</span>
                </p>
                <select
                  name="status"
                  id="status"
                  value={taskData.priority}
                  onChange={(e) =>
                    setTaskData({
                      ...taskData,
                      priority: e.target.value,
                    })
                  }
                  className="w-full px-2 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                {/* {error.status && <p className="error">{error.status}</p>} */}
                {errors.priority && (
                  <p className="text-red-500 text-sm mb-4">{errors.priority}</p>
                )}

                <label
                  htmlFor="demo"
                  className="block text-sm font-medium mb-2 mt-4 "
                >
                  Upload Files
                </label>
                {/* <FileUpload
                name="demo[]"
                // url="/api/upload"
                multiple
                accept="image/*"
                maxFileSize={1000000}
                auto={false}
                showUploadButton={false}
                showCancelButton={false}
                onSelect={(e) =>
                  setUploadedFiles((prev) => [...prev, ...e.files])
                }
                chooseLabel="Upload"
                className="overflow-y-scroll h-40"
              /> */}
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
                {errors.error ? (
                  <span className="text-red-500 text-sm mb-4 ml-2">
                    {errors.error}
                  </span>
                ) : (
                  ""
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
                  {taskData?.document?.map((doc, index) => (
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
                          handleDeleteTaskFile(index, doc.filepath, taskData.id)
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
                    onClick={() => setIsEditModalOpen(false)}
                    className=" bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                    onClick={handlesubmitedit}
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
export default Task_details_client;

