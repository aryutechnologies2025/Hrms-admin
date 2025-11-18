// import { useState, useEffect } from "react";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import { Editor } from "primereact/editor";
// import { FileUpload } from "primereact/fileupload";
// import { MultiSelect } from "primereact/multiselect";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Swal from "sweetalert2";
// // import { capitalizeFirstLetter } from "../StringCaps";
// import { API_URL } from "../../config";
// import { Dropdown } from "primereact/dropdown";
// import { VscTasklist } from "react-icons/vsc";
// import { FaTasks } from "react-icons/fa";
// import { GoProjectSymlink } from "react-icons/go";
// import { PiFlagBannerFill } from "react-icons/pi";
// import { GiPin } from "react-icons/gi";
// import { PiFlagPennantFill } from "react-icons/pi";
// import { VscDebugConsole } from "react-icons/vsc";
// import Button_Loader from "../Button_Loader";
// import Footer from "../Footer";
// import { toast } from "react-toastify";

// // const initialData = {
// //   columns: {
// //     todo: {
// //       id: "todo",
// //       title: "To Do",
// //       items:alldata.taskToDo.map((value)=>{return(value.title)}),
// //     },
// //     inprogress: {
// //       id: "inprogress",
// //       title: "In Progress",
// //       items: ["Task 4", "Task 5"],
// //     },
// //     inreview: {
// //       id: "inreview",
// //       title: "In Review",
// //       items: ["Task 4", "Task 5"],
// //     },
// //     done: {
// //       id: "done",
// //       title: "Done",
// //       items: ["Task 4", "Task 5"],
// //     },
// //   },
// //   columnOrder: ["todo", "inprogress", "inreview", "done"],
// // };

// const TaskList = () => {
//   const [data, setData] = useState(null);
//   const [error, setError] = useState("");
//   const [buttonLoading, setButtonLoading] = useState(false);

//   // Fetch tasks from API and format data

//   // Handle drag and drop
//   // const onDragEnd = (result) => {
//   //   const { source, destination } = result;
//   //   if (!destination) return;

//   //   const sourceCol = data.columns[source.droppableId];
//   //   const destCol = data.columns[destination.droppableId];
//   //   const sourceItems = [...sourceCol.items];
//   //   const destItems = [...destCol.items];

//   //   const [movedItem] = sourceItems.splice(source.index, 1);

//   //   if (source.droppableId === destination.droppableId) {
//   //     sourceItems.splice(destination.index, 0, movedItem);
//   //     setData({
//   //       ...data,
//   //       columns: {
//   //         ...data.columns,
//   //         [sourceCol.id]: {
//   //           ...sourceCol,
//   //           items: sourceItems,
//   //         },
//   //       },
//   //     });
//   //   } else {
//   //     destItems.splice(destination.index, 0, movedItem);
//   //     setData({
//   //       ...data,
//   //       columns: {
//   //         ...data.columns,
//   //         [sourceCol.id]: {
//   //           ...sourceCol,
//   //           items: sourceItems,
//   //         },
//   //         [destCol.id]: {
//   //           ...destCol,
//   //           items: destItems,
//   //         },
//   //       },
//   //     });
//   //   }
//   // };

//   // const onDragEnd = async (result) => {
//   //   const { source, destination } = result;
//   //   if (!destination) return;

//   //   const sourceCol = data.columns[source.droppableId];
//   //   const destCol = data.columns[destination.droppableId];
//   //   const sourceItems = [...sourceCol.items];
//   //   const destItems = [...destCol.items];

//   //   const [movedItem] = sourceItems.splice(source.index, 1);

//   //   if (source.droppableId === destination.droppableId) {
//   //     // Same column — just reorder
//   //     sourceItems.splice(destination.index, 0, movedItem);
//   //     setData((prevData) => ({
//   //       ...prevData,
//   //       columns: {
//   //         ...prevData.columns,
//   //         [sourceCol.id]: {
//   //           ...sourceCol,
//   //           items: sourceItems,
//   //         },
//   //       },
//   //     }));
//   //   } else {
//   //     // Cross-column move — update state & send API
//   //     destItems.splice(destination.index, 0, movedItem);
//   //     setData((prevData) => ({
//   //       ...prevData,
//   //       columns: {
//   //         ...prevData.columns,
//   //         [sourceCol.id]: {
//   //           ...sourceCol,
//   //           items: sourceItems,
//   //         },
//   //         [destCol.id]: {
//   //           ...destCol,
//   //           items: destItems,
//   //         },
//   //       },
//   //     }));

//   //     //  Map column ID to backend status
//   //     const statusMap = {
//   //       inprogress: "in-progress",
//   //       inreview: "in-review",
//   //       todo: "todo",
//   //       done: "done",
//   //     };
//   //     const newStatus = statusMap[destCol.id] || destCol.id;

//   //     const now = new Date().toISOString();
//   //     let updatedStartTime = movedItem.startTime;
//   //     let updatedStopTime = movedItem.endTime;

//   //     if (newStatus === "in-progress" && !updatedStartTime) {
//   //       updatedStartTime = now;
//   //     } else if (newStatus === "in-review" && !updatedStopTime) {
//   //       updatedStopTime = now;
//   //     }

//   //     const payload = {
//   //       status: newStatus,
//   //       startTime: updatedStartTime,
//   //       endTime: updatedStopTime,
//   //       updatedAt: now,
//   //     };

//   //     try {
//   //       const response = await axios.patch(
//   //         `${API_URL}api/task/updated-status/${movedItem.taskId}`,
//   //         payload
//   //       );
//   //       console.log("Status updated via drag:", response.data);
//   //     } catch (error) {
//   //       console.error("Error updating status via drag:", error);
//   //       Swal.fire({
//   //         icon: "error",
//   //         title: "Error",
//   //         text: "Failed to update task status after dragging.",
//   //       });
//   //     }
//   //   }
//   // };

//   const onDragEnd = async (result) => {
//     const { source, destination } = result;
//     if (!destination) return;

//     // if (destination.droppableId === "inreview") return;
//     // if (destination.droppableId === "inprogress") return;
//     // if (source.droppableId === "inprogress") return;
//     // if (source.droppableId === "inreview") return;

//     const sourceCol = data.columns[source.droppableId];
//     const destCol = data.columns[destination.droppableId];
//     const sourceItems = [...sourceCol.items];
//     const destItems = [...destCol.items];

//     const [movedItem] = sourceItems.splice(source.index, 1);

//     if (source.droppableId === destination.droppableId) {
//       // Reorder within same column
//       sourceItems.splice(destination.index, 0, movedItem);
//       setData((prevData) => ({
//         ...prevData,
//         columns: {
//           ...prevData.columns,
//           [sourceCol.id]: {
//             ...sourceCol,
//             items: sourceItems,
//           },
//         },
//       }));
//     } else {
//       // Move to different column — update backend
//       destItems.splice(destination.index, 0, movedItem);
//       setData((prevData) => ({
//         ...prevData,
//         columns: {
//           ...prevData.columns,
//           [sourceCol.id]: {
//             ...sourceCol,
//             items: sourceItems,
//           },
//           [destCol.id]: {
//             ...destCol,
//             items: destItems,
//           },
//         },
//       }));

//       const statusMap = {
//         inprogress: "in-progress",
//         inreview: "in-review",
//         todo: "todo",
//         done: "done",
//       };

//       const newStatus = statusMap[destCol.id] || destCol.id;
//       const now = new Date().toISOString();

//       let updatedStartTime = movedItem.startTime;
//       let updatedStopTime = movedItem.endTime;

//       if (newStatus === "in-progress" && !updatedStartTime) {
//         updatedStartTime = now;
//       } else if (newStatus === "in-review" && !updatedStopTime) {
//         updatedStopTime = now;
//       }

//       const payload = {
//         status: newStatus,
//         startTime: updatedStartTime,
//         endTime: updatedStopTime,
//         updatedAt: now,
//         updatedBy: superUser ? employeeemail : employeeId,
//       };

//       try {
//         const response = await axios.patch(
//           `${API_URL}/api/task/updated-status/${movedItem.taskId}`,
//           payload
//         );
//         //       console.log("Dragged Task Object:", movedItem);
//         // console.log("Calling PATCH on:", `${API_URL}api/task/updated-status/${movedItem.taskId}`);
//         toast.success("Task status updated successfully");
//         console.log("Status updated via drag:", response.data);
//       } catch (error) {
//         console.error("Error updating status via drag:", error);
//         toast.error(error?.response?.data?.message || "Failed to update task status after dragging.");
//       }
//     }
//   };

//   const navigate = useNavigate();
//   const employeeDetails = JSON.parse(localStorage.getItem("hrmsuser"));
//   // console.log("employeeDetails:", employeeDetails.email);

//   const employeeemail = employeeDetails._id;
//   console.log("employeeemail:", employeeemail);
//   const superUser = employeeDetails?.superUser;
//   const employeeId = employeeDetails.employeeId;
//   // console.log("employeeemail:", employeeemail);

//   // const [data, setData] = useState(initialData);

//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);

//   const openAddModal = () => {
//     setIsAddModalOpen(true);
//   };
//   const closeAddModal = () => {
//     setIsAddModalOpen(false);
//   };

//   // const onDragEnd = (result) => {
//   //   const { source, destination } = result;

//   //   if (!destination) return;
//   //   if (destination.droppableId === "done") return;
//   //   if (source.droppableId === "done") return;

//   //   const sourceCol = data.columns[source.droppableId];
//   //   const destCol = data.columns[destination.droppableId];

//   //   if (sourceCol === destCol) {
//   //     const newItems = Array.from(sourceCol.items);
//   //     const [movedItem] = newItems.splice(source.index, 1);
//   //     newItems.splice(destination.index, 0, movedItem);

//   //     const newCol = {
//   //       ...sourceCol,
//   //       items: newItems,
//   //     };

//   //     setData({
//   //       ...data,
//   //       columns: {
//   //         ...data.columns,
//   //         [newCol.id]: newCol,
//   //       },
//   //     });
//   //   } else {
//   //     const sourceItems = Array.from(sourceCol.items);
//   //     const destItems = Array.from(destCol.items);
//   //     const [movedItem] = sourceItems.splice(source.index, 1);
//   //     destItems.splice(destination.index, 0, movedItem);

//   //     setData({
//   //       ...data,
//   //       columns: {
//   //         ...data.columns,
//   //         [sourceCol.id]: { ...sourceCol, items: sourceItems },
//   //         [destCol.id]: { ...destCol, items: destItems },
//   //       },
//   //     });
//   //   }
//   // };

//   const [currentDate, setCurrentDate] = useState("");

//   useEffect(() => {
//     const today = new Date().toISOString().split("T")[0];
//     // console.log(today)
// // setDateFilter
//     setCurrentDate(today);
//   }, []);

//   // const handleNavigate = (item) => {

//   //   navigate("/tasklist-details");
//   // };

//   const handleNavigate = (item) => {
//     // console.log("item", item);
//     const filters = {
//       project: projectname,
//       assignee: assignTo,
//     };

//     sessionStorage.setItem("taskListFilters", JSON.stringify(filters));

//     window.open(`/tasklist-details_client/${item.taskId}`);
//     window.scrollTo({
//       top: 0,
//       behavior: "instant",
//     });
//   };

//   useEffect(() => {
//     // Restore filters from session storage when component mounts
//     const savedFilters = sessionStorage.getItem("taskListFilters");

//     if (savedFilters) {
//       const filters = JSON.parse(savedFilters);
//       console.log("filters", filters);
//       setAssignTo(filters.assignee);
//       // setProjectName(filters.project);
//       // handleRoleChange(filters.project.name);

//       // Clear the stored filters after restoring
//       sessionStorage.removeItem("taskListFilters");
//     }
//   }, []);

//   // handlsumbit

//   const [projectname, setProjectName] = useState("");
//   console.log("projectname",projectname);
//   const [projectDescription, setProjectDescription] = useState("");
//   const [projecttile, setProjecttiltle] = useState("");
//   const [priority, setPriority] = useState("");
//   //  const [priority, setPriority] = useState("");
//   const [status, setStatus] = useState("");
//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [assignTo, setAssignTo] = useState("");
//   const [projectManagerName, setProjectManagerName] = useState("");

//   const handleRoleChange = (name) => {
//     // const selectedRoleName = e.target.value;
//     setProjectName(name);
//     const selectedRole = roles.find((role) => role.name === name);
//     if (selectedRole) {
//       setProjectManagerName(selectedRole.projectManager || "");
//     } else {
//       setProjectManagerName("");
//     }
//   };

//   const [employeeOption, setEmployeeOption] = useState(null);
//   const [dateFilter, setDateFilter] = useState("");

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
//       const employeeName = response.data.data.map((emp) => ({
//         label: emp.employeeName,
//         value: emp._id,
//       }));
//       // console.log("employeeemail", employeeemail);

//       setEmployeeOption(employeeName);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     // fetchData();
//     fetchEmployeeList();
//     const today = new Date().toISOString().split("T")[0];
//     setDateFilter(today);
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const selectedProject = roles.find((role) => role.name === projectname);
//     const projectId = selectedProject?._id || "";

//     try {
//       const formData = new FormData();
//       formData.append("dueDate", currentDate);
//       formData.append("projectName", projectname);
//       formData.append("description", projectDescription);
//       formData.append("status", "todo");
//       formData.append("title", projecttile);
//       formData.append("assignedTo", assignTo);
//       formData.append("createdBy", employeeemail);
//       formData.append("priority", priority);
//       formData.append("projectId", projectId);
//       formData.append("projectManagerId", projectManagerName);
//       uploadedFiles.forEach((file) => {
//         formData.append("document[]", file);
//       });

//       const response = await axios.post(
//         `${API_URL}/api/task/create-task`,
//         formData
//       );

//       console.log("response", response);
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
//   const [project, setProject] = useState([]);
//   // console.log("roles", project.value);
// const allProjectIds = project.map((proj) => proj.value);

// const allProjectIdsString = allProjectIds.join(",");
//   console.log("allProjectIds",allProjectIdsString);

//   const fetchProject = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/api/project/view-projects-id`,{
//         params: { clientId: employeeemail },
//       });
//       console.log("clientID", employeeemail);
//       // console.log(response);
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
//   }, []);

//   const [projectTaskCount, setProjectTaskCount] = useState(null);

//   // const projectIdToSend = projectname && projectname.length >=0
//   //   ? projectname  // if user selected a project, send that
//   //   : allProjectIdsString;

//   //  const projectIdToSend = projectname && projectname.length > 0
//   //       ? projectname
//   //       : allProjectIdsString;

//   const handleSearch = async () => {
//     try {
//       setButtonLoading(true);
//       const payload = {
//         employeeId: employeeemail,
//         projectId: projectname,
//          day: dateFilter,
//       };

//       console.log(payload);
//       const response = await axios.get(
//         `${API_URL}/api/task/particular-all-task-status-id`,
//         { params: payload }
//       );

//       // console.log("Full API response:", response.data.data);

//       const allTasks = response.data.data;
//       console.log("Extracted task data:", allTasks);
//       const allCounts = response.data;
//       setProjectTaskCount(allCounts.counts);

//       const formattedData = {
//         columns: {
//           todo: {
//             id: "todo",
//             title: "To Do",
//             items: allTasks.taskToDo || [],
//           },
//           inprogress: {
//             id: "inprogress",
//             title: "In Progress",
//             items: allTasks.taskInProcess || [],
//           },
//           inreview: {
//             id: "inreview",
//             title: "In Review",
//             items: allTasks.taskInReview || [],
//           },
//           done: {
//             id: "done",
//             title: "Done",
//             items: allTasks.taskDone || [],
//           },
//           completed: {
//             id: "completed",
//             title: "Closed",
//             items: allTasks.taskCompleted || [],
//           },
//           block: {
//             id: "block",
//             title: "Blocked",
//             items: allTasks.taskBlock || [],
//           },
//         },
//         columnOrder: [
//           "todo",
//           "inprogress",
//           "inreview",
//           "done",
//           "completed",
//           "block",
//         ],
//       };

//       setData(formattedData);
//       setButtonLoading(false);
//     } catch (err) {
//       console.error("Fetch error:", err?.response || err.message);
//       setError("Error fetching tasks.");
//     }
//   };

//   useEffect(() => {
//     handleSearch();
//   }, []);

//   const getStatusCircle = (status) => {
//     switch (status.toLowerCase()) {
//       case "todo":
//         return (
//           <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
//         );
//       case "inprogress":
//         return (
//           <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
//         );
//       case "inreview":
//         return (
//           <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
//         );
//       case "done":
//         return (
//           <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
//         );
//       case "completed":
//         return (
//           <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
//         );
//       case "block":
//         return (
//           <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
//         );
//       default:
//         return (
//           <span className="inline-block w-2 h-2 rounded-full bg-gray-500 mr-2"></span>
//         );
//     }
//   };

//   // const filteredEmployees = projectname
//   //   ? employeeOption.filter((emp) =>
//   //       projectname.teamMembers.includes(emp.value)
//   //     )
//   //   : employeeOption;

//   // project.find((role) => role === projectname)?.teamMembers ||
//   //             employeeOption
//   const projectFilter = project.filter((proj) => proj.value == projectname);

//   const filteredEmployees = projectname
//     ? employeeOption.filter(
//         (emp) =>
//           projectFilter[0].teamMembers.includes(emp.value) ||
//           projectFilter[0].projectManager.includes(emp.value)
//       )
//     : employeeOption;

//   return (
//     <div className="w-full overflow-hidden">
//       <div>
//         {buttonLoading ? (
//           <div className="flex justify-center items-center w-full h-screen">
//             <div className="w-12 h-12 border-4 border-blue-500 rounded-full animate-ping"></div>
//           </div>
//         ) : (
//           <div className=" p-5 w-full mt-10 ">
//             <div className="flex gap-2 items-center cursor-pointer">
//               <p
//                 className="text-sm text-gray-500"
//                 onClick={() => navigate("/dashboard")}
//               >
//                 Dashboard
//               </p>

//               <p>{">"}</p>
//               <p className="text-sm text-blue-500">Task List</p>
//             </div>

//             <div className="flex justify-between mt-8 mb-4">
//               <div className="flex gap-8">

//                 <Dropdown
//                   value={projectname}
//                   onChange={(e) => setProjectName(e.value)}
//                   options={project}
//                   optionLabel="label"
//                   filter
//                   placeholder="Select a Project"
//                   className="w-[300px]  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />

//                 <input
//                   type="date"
//                   className="px-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
//                   value={dateFilter}
//                   max={new Date().toISOString().split('T')[0]}
//                   onChange={(e) => setDateFilter(e.target.value)}
//                 />
//                 <button
//                   onClick={handleSearch}
//                   className=" text-white bg-blue-500 hover:bg-blue-600 font-medium  rounded-lg px-4"
//                 >
//                   Search
//                 </button>
//               </div>

//               <div className="flex gap-5 px-4">
//                 {/* <button
//                   className="bg-red-500 hover:bg-red-600 px-4 text-white  rounded-2xl"
//                   onClick={() => navigate("/close-details-client")}
//                 >
//                   Close Lists
//                 </button> */}
//                 <button
//                   className="bg-gray-600 hover:bg-gray-500 px-4 text-white  rounded-2xl"
//                   onClick={() => navigate("/task-details-client")}
//                 >
//                   Task List
//                 </button>
//               </div>
//             </div>

//              <DragDropContext >
//               <div className="flex gap-3 overflow-x-auto  ">
//                 {data &&
//                   data.columnOrder.map((columnId) => {
//                     const column = data.columns[columnId];

//                     return (
//                       <div
//                         key={column.id}
//                         className="w-[19.2%] h-[600px] bg-gray-100/80 shadow-sm rounded-md p-2 flex-shrink-0 relative "
//                       >
//                         <h2 className=" p-2 flex items-center sticky top-0 gap-1 mb-3 border-b-2 pb-2 border-gray-300">
//                           {getStatusCircle(column.id)}
//                           <span className=" text-[#6b7280] uppercase text-[12px] font-bold ">
//                             {" "}
//                             {column.title}
//                           </span>
//                           <span className="text-sm  bg-[#0515240f] text-[#292929] px-[4px] rounded-md">
//                             {column?.items?.length}
//                           </span>
//                         </h2>

//                         <Droppable droppableId={column.id}>
//                           {(provided) => (
//                             <div
//                               ref={provided.innerRef}
//                               {...provided.droppableProps}
//                               className={`h-[520px] overflow-y-auto pr-1 hide-scrollbar `}
//                             >
//                               {column.items.map((item, index) => (
//                                 <Draggable
//                                   key={item._id}
//                                   draggableId={item._id}
//                                   index={index}
//                                 >
//                                   {(provided) => (
//                                     <div
//                                       ref={provided.innerRef}
//                                       {...provided.draggableProps}
//                                       {...provided.dragHandleProps}
//                                       onClick={() => handleNavigate(item)}
//                                       className="bg-white rounded-sm shadow-[0px_6px_42px_-23px_rgba(0,_0,_0,_0.1)]   p-3 mb-2  hover:scale-[1.06] duration-300  cursor-pointer m-1"
//                                     >
//                                       {/* <div>{capitalizeFirstLetter(item.title)}</div> */}

//                                       <div className="flex flex-col gap-4">
//                                         {" "}
//                                         <span className="truncate text-wrap text-[14px]  flex items-center justify-between">
//                                           {item.title.length > 40
//                                             ? `${item.title.substring(
//                                                 0,
//                                                 40
//                                               )}...`
//                                             : item.title}
//                                           {item.testerStatus == 1 ? (
//                                             <VscDebugConsole className="text-2xl text-green-950" />
//                                           ) : (
//                                             ""
//                                           )}
//                                         </span>
//                                         <div>
//                                           <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium shadow-sm">
//                                             {item.assignedTo?.employeeName
//                                               ?.length > 16
//                                               ? `${item.assignedTo?.employeeName.substring(
//                                                   0,
//                                                   20
//                                                 )}...`
//                                               : item.assignedTo?.employeeName}
//                                           </span>
//                                         </div>
//                                         <div className="">
//                                           <span className="text-[10px]  bg-blue-100 rounded-full px-1 py-[2px]">
//                                             {item.projectId?.name?.length > 16
//                                               ? `${item.projectId?.name?.substring(
//                                                   0,
//                                                   16
//                                                 )}...`
//                                               : item.projectId?.name}
//                                           </span>
//                                         </div>
//                                         <div className="flex justify-between w-full">
//                                           <span className="text-sm flex gap-2 items-center">
//                                             #{item.taskId}
//                                             <span className="text-xs">
//                                               ({item.createdAt.split("T")[0]})
//                                             </span>
//                                           </span>
//                                           <div
//                                             className={`font-semibold capitalize ${
//                                               item.priority === "high"
//                                                 ? "text-red-500"
//                                                 : item.priority === "medium"
//                                                 ? "text-orange-400"
//                                                 : item.priority === "low"
//                                                 ? "text-yellow-300"
//                                                 : "text-gray-500"
//                                             }`}
//                                           >
//                                             <PiFlagPennantFill />
//                                             {/* <PiFlagBannerFill className="text-xl" /> */}
//                                           </div>
//                                         </div>
//                                       </div>
//                                     </div>
//                                   )}
//                                 </Draggable>
//                               ))}

//                               {provided.placeholder}
//                             </div>
//                           )}
//                         </Droppable>
//                       </div>
//                     );
//                   })}
//               </div>
//             </DragDropContext>
//           </div>
//         )}
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default TaskList;

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Editor } from "primereact/editor";
import { FileUpload } from "primereact/fileupload";
import { MultiSelect } from "primereact/multiselect";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
// import { capitalizeFirstLetter } from "../StringCaps";
import { API_URL } from "../../config";
import { Dropdown } from "primereact/dropdown";
import { VscLayersActive, VscTasklist } from "react-icons/vsc";
import { FaTasks } from "react-icons/fa";
import { GoProjectSymlink } from "react-icons/go";
import { PiFlagBannerFill } from "react-icons/pi";
import { GiPin } from "react-icons/gi";
import { PiFlagPennantFill } from "react-icons/pi";
import { VscDebugConsole } from "react-icons/vsc";
import Button_Loader from "../Button_Loader";
import Footer from "../Footer";
import { toast } from "react-toastify";
import { IoPauseCircleOutline } from "react-icons/io5";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { RiFileCloseLine } from "react-icons/ri";
import {
  FaArrowDown,
  FaArrowRight,
  FaArrowUp,
  FaCheck,
  FaClipboardList,
  FaEye,
  FaLock,
  FaSpinner,
} from "react-icons/fa6";

// const initialData = {
//   columns: {
//     todo: {
//       id: "todo",
//       title: "To Do",
//       items:alldata.taskToDo.map((value)=>{return(value.title)}),
//     },
//     inprogress: {
//       id: "inprogress",
//       title: "In Progress",
//       items: ["Task 4", "Task 5"],
//     },
//     inreview: {
//       id: "inreview",
//       title: "In Review",
//       items: ["Task 4", "Task 5"],
//     },
//     done: {
//       id: "done",
//       title: "Done",
//       items: ["Task 4", "Task 5"],
//     },
//   },
//   columnOrder: ["todo", "inprogress", "inreview", "done"],
// };

const TaskList = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [taskLoading, setTaskLoading] = useState(false);
  const [employeeIdfilter, setemployeeIdfilter] = useState("");
  // Fetch tasks from API and format data

  // Handle drag and drop
  // const onDragEnd = (result) => {
  //   const { source, destination } = result;
  //   if (!destination) return;

  //   const sourceCol = data.columns[source.droppableId];
  //   const destCol = data.columns[destination.droppableId];
  //   const sourceItems = [...sourceCol.items];
  //   const destItems = [...destCol.items];

  //   const [movedItem] = sourceItems.splice(source.index, 1);

  //   if (source.droppableId === destination.droppableId) {
  //     sourceItems.splice(destination.index, 0, movedItem);
  //     setData({
  //       ...data,
  //       columns: {
  //         ...data.columns,
  //         [sourceCol.id]: {
  //           ...sourceCol,
  //           items: sourceItems,
  //         },
  //       },
  //     });
  //   } else {
  //     destItems.splice(destination.index, 0, movedItem);
  //     setData({
  //       ...data,
  //       columns: {
  //         ...data.columns,
  //         [sourceCol.id]: {
  //           ...sourceCol,
  //           items: sourceItems,
  //         },
  //         [destCol.id]: {
  //           ...destCol,
  //           items: destItems,
  //         },
  //       },
  //     });
  //   }
  // };

  // const onDragEnd = async (result) => {
  //   const { source, destination } = result;
  //   if (!destination) return;

  //   const sourceCol = data.columns[source.droppableId];
  //   const destCol = data.columns[destination.droppableId];
  //   const sourceItems = [...sourceCol.items];
  //   const destItems = [...destCol.items];

  //   const [movedItem] = sourceItems.splice(source.index, 1);

  //   if (source.droppableId === destination.droppableId) {
  //     // Same column — just reorder
  //     sourceItems.splice(destination.index, 0, movedItem);
  //     setData((prevData) => ({
  //       ...prevData,
  //       columns: {
  //         ...prevData.columns,
  //         [sourceCol.id]: {
  //           ...sourceCol,
  //           items: sourceItems,u
  //         },
  //       },
  //     }));
  //   } else {
  //     // Cross-column move — update state & send API
  //     destItems.splice(destination.index, 0, movedItem);
  //     setData((prevData) => ({
  //       ...prevData,
  //       columns: {
  //         ...prevData.columns,
  //         [sourceCol.id]: {
  //           ...sourceCol,
  //           items: sourceItems,
  //         },
  //         [destCol.id]: {
  //           ...destCol,
  //           items: destItems,
  //         },
  //       },
  //     }));

  //     //  Map column ID to backend status
  //     const statusMap = {
  //       inprogress: "in-progress",
  //       inreview: "in-review",
  //       todo: "todo",
  //       done: "done",
  //     };
  //     const newStatus = statusMap[destCol.id] || destCol.id;

  //     const now = new Date().toISOString();
  //     let updatedStartTime = movedItem.startTime;
  //     let updatedStopTime = movedItem.endTime;

  //     if (newStatus === "in-progress" && !updatedStartTime) {
  //       updatedStartTime = now;
  //     } else if (newStatus === "in-review" && !updatedStopTime) {
  //       updatedStopTime = now;
  //     }

  //     const payload = {
  //       status: newStatus,
  //       startTime: updatedStartTime,
  //       endTime: updatedStopTime,
  //       updatedAt: now,
  //     };

  //     try {
  //       const response = await axios.patch(
  //         `${API_URL}api/task/updated-status/${movedItem.taskId}`,
  //         payload
  //       );
  //       console.log("Status updated via drag:", response.data);
  //     } catch (error) {
  //       console.error("Error updating status via drag:", error);
  //       Swal.fire({
  //         icon: "error",
  //         title: "Error",
  //         text: "Failed to update task status after dragging.",
  //       });
  //     }
  //   }
  // };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    // if (destination.droppableId === "inreview") return;
    // if (destination.droppableId === "inprogress") return;
    // if (source.droppableId === "inprogress") return;
    // if (source.droppableId === "inreview") return;

    const sourceCol = data.columns[source.droppableId];
    const destCol = data.columns[destination.droppableId];
    const sourceItems = [...sourceCol.items];
    const destItems = [...destCol.items];

    const [movedItem] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      // Reorder within same column
      sourceItems.splice(destination.index, 0, movedItem);
      setData((prevData) => ({
        ...prevData,
        columns: {
          ...prevData.columns,
          [sourceCol.id]: {
            ...sourceCol,
            items: sourceItems,
          },
        },
      }));
    } else {
      // Move to different column — update backend
      destItems.splice(destination.index, 0, movedItem);
      setData((prevData) => ({
        ...prevData,
        columns: {
          ...prevData.columns,
          [sourceCol.id]: {
            ...sourceCol,
            items: sourceItems,
          },
          [destCol.id]: {
            ...destCol,
            items: destItems,
          },
        },
      }));

      const statusMap = {
        inprogress: "in-progress",
        inreview: "in-review",
        todo: "todo",
        done: "done",
      };
      const newStatus = statusMap[destCol.id] || destCol.id;
      const now = new Date().toISOString();

      let updatedStartTime = movedItem.startTime;
      let updatedStopTime = movedItem.endTime;

      if (newStatus === "in-progress" && !updatedStartTime) {
        updatedStartTime = now;
      } else if (newStatus === "in-review" && !updatedStopTime) {
        updatedStopTime = now;
      }

      const payload = {
        status: newStatus,
        startTime: updatedStartTime,
        endTime: updatedStopTime,
        updatedAt: now,
        updatedBy: superUser ? employeeemail : employeeId,
      };

      try {
        const response = await axios.patch(
          `${API_URL}/api/task/updated-status/${movedItem.taskId}`,
          payload
        );
        //       console.log("Dragged Task Object:", movedItem);
        // console.log("Calling PATCH on:", `${API_URL}api/task/updated-status/${movedItem.taskId}`);
        toast.success("Task status updated successfully");
        console.log("Status updated via drag:", response.data);
      } catch (error) {
        console.error("Error updating status via drag:", error);
        toast.error(
          error?.response?.data?.message ||
            "Failed to update task status after dragging."
        );
      }
    }
  };

  const navigate = useNavigate();
  const employeeDetails = JSON.parse(localStorage.getItem("hrmsuser"));
  // console.log("employeeDetails:", employeeDetails.email);

  const employeeemail = employeeDetails.subType
    ? employeeDetails?.client?._id
    : employeeDetails._id;
  const superUser = employeeDetails?.superUser;
  const employeeId = employeeDetails.employeeId;
  // console.log("employeeemail:", employeeemail);

  // const [data, setData] = useState(initialData);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    // console.log(today)

    setCurrentDate(today);
  }, []);

  const handleNavigate = (item) => {
    const filters = {
      project: projectname,
      assignee: assignTo,
    };

    sessionStorage.setItem("taskListFilters", JSON.stringify(filters));

    window.open(`/tasklist-details_client/${item.taskId}`);
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  };

  useEffect(() => {
    // Restore filters from session storage when component mounts
    const savedFilters = sessionStorage.getItem("taskListFilters");

    if (savedFilters) {
      const filters = JSON.parse(savedFilters);
      console.log(filters);
      setAssignTo(filters.assignee);
      // setProjectName(filters.project);
      // handleRoleChange(filters.project.name);

      // Clear the stored filters after restoring
      sessionStorage.removeItem("taskListFilters");
    }
  }, []);

  // handlsumbit

  const [projectname, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projecttile, setProjecttiltle] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [assignTo, setAssignTo] = useState("");
  const [projectManagerName, setProjectManagerName] = useState("");

  const handleRoleChange = (name) => {
    // const selectedRoleName = e.target.value;
    setProjectName(name);
    const selectedRole = roles.find((role) => role.name === name);
    if (selectedRole) {
      setProjectManagerName(selectedRole.projectManager || "");
    } else {
      setProjectManagerName("");
    }
  };

  const [employeeOption, setEmployeeOption] = useState(null);
  const [dateFilter, setDateFilter] = useState("");
  const [toDateFilter, setToDateFilter] = useState("");
  const [taskIdFilter, setTaskIdFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [todayTaskDate, setTodaytaskDate] = useState("");
  const [count, setCount] = useState([]);
  const [isTodayClicked, setIsTodayClicked] = useState(false);
  const [isTodayMode, setIsTodayMode] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [triggerClearSearch, setTriggerClearSearch] = useState(false); // 👈 flag to trigger refresh

  //  Runs only AFTER state has been cleared
  useEffect(() => {
    if (triggerClearSearch) {
      handleSearchClick(1);
      setTriggerClearSearch(false);
    }
  }, [triggerClearSearch]);

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
      const employeeName = response.data.data.map((emp) => ({
        label: emp.employeeName,
        value: emp._id,
      }));
      // console.log("employeeemail", employeeemail);

      setEmployeeOption(employeeName);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // fetchData();
    fetchEmployeeList();
  }, []);

  useEffect(() => {
    if (todayTaskDate) {
      handleSearch(1);
    }
  }, [todayTaskDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedProject = roles.find((role) => role.name === projectname);
    const projectId = selectedProject?._id || "";

    try {
      const formData = new FormData();
      formData.append("dueDate", currentDate);
      formData.append("projectName", projectname);
      formData.append("description", projectDescription);
      formData.append("status", "todo");
      formData.append("title", projecttile);
      formData.append("assignedTo", assignTo);
      formData.append("createdBy", employeeemail);
      formData.append("priority", priority);
      formData.append("projectId", projectId);
      formData.append("projectManagerId", projectManagerName);
      uploadedFiles.forEach((file) => {
        formData.append("document[]", file);
      });

      const response = await axios.post(
        `${API_URL}/api/task/create-task`,
        formData
      );

      console.log("response", response);
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
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error("Error submitting form:", err);
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Something went wrong while creating the task.",
        });
      }
    }
  };

  const [project, setProject] = useState([]);
  console.log("roles", project);

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

  const [projectTaskCount, setProjectTaskCount] = useState(null);

  const statusMap = {
    todo: "todo",
    inprogress: "in-progress",
    inreview: "in-review",
    done: "done",
    completed: "completed",
    block: "block",
  };

  // const handleSearch = async (pageNum = 1) => {
  //   setCount("");
  //   if (taskLoading) return;
  //   // setTaskLoading(true);
  //   if (pageNum === 1) setTaskLoading(true);
  //   if (pageNum === 1) {
  //     setData(null);
  //     setPage(1);
  //   }
  //   try {
  //     // setButtonLoading(true);
  //     let payload = {
  //       employeeId: assignTo || "",
  //       projectId: projectname || "",
  //       day: dateFilter || "",
  //       toDate: toDateFilter || "",
  //       taskId: taskIdFilter || "",
  //       page: pageNum,
  //       searchTerm: searchTerm || "",
  //       todayTaskDate: todayTaskDate,
  //       limit: 10,
  //     };
  //     // let payload = today
  //     //   ? {
  //     //       todayTaskDate, // only todayTaskDate sent
  //     //       page: pageNum,
  //     //       limit: 10,
  //     //       employeeId: "",
  //     //       projectId: "",
  //     //       day: "",
  //     //       toDate: "",
  //     //       taskId: "",
  //     //     }
  //     //   : {
  //     //       employeeId: assignTo || "",
  //     //       projectId: projectname || "",
  //     //       day: dateFilter || "",
  //     //       toDate: toDateFilter || "",
  //     //       taskId: taskIdFilter || "",
  //     //       page: pageNum,
  //     //       searchTerm: searchTerm || "",
  //     //       todayTaskDate: null, // clear todayTaskDate when doing normal search
  //     //       limit: 10,
  //     //       todayTaskDate: "",
  //     //     };

  //     console.log(payload);
  //     const response = await axios.get(
  //       `${API_URL}/api/task/particular-all-task-status`,
  //       { params: payload }
  //     );

  //     console.log("Full API response:", response.data.data);
  //     setCount(response.data.counts);

  //     const allTasks = response.data.data;

  //     const allCounts = response.data;
  //     setProjectTaskCount(allCounts.counts);
  //     const pagination = response.data.pagination;
  //     const formattedData = {
  //       columns: {
  //         todo: {
  //           id: "todo",
  //           title: "To Do",
  //           items: allTasks.taskToDo || [],
  //         },
  //         inprogress: {
  //           id: "inprogress",
  //           title: "In Progress",
  //           items: allTasks.taskInProcess || [],
  //         },
  //         inreview: {
  //           id: "inreview",
  //           title: "In Review",
  //           items: allTasks.taskInReview || [],
  //         },
  //         done: {
  //           id: "done",
  //           title: "Done",
  //           items: allTasks.taskDone || [],
  //         },
  //         completed: {
  //           id: "completed",
  //           title: "Closed",
  //           items: allTasks.taskCompleted || [],
  //         },
  //         block: {
  //           id: "block",
  //           title: "Blocked",
  //           items: allTasks.taskBlock || [],
  //         },
  //       },
  //       columnOrder: [
  //         "todo",
  //         "inprogress",
  //         "inreview",
  //         "done",
  //         "completed",
  //         "block",
  //       ],
  //     };

  //     // Handling first page load (reset data) vs appending new data (subsequent pages)
  //     if (pageNum === 1) {
  //       setData({
  //         ...formattedData,
  //         statusCounts: response.data.data.statusCounts || {},
  //       });
  //     } else {
  //       setData((prevData) => {
  //         if (!prevData) {
  //           return {
  //             ...formattedData,
  //             statusCounts: response.data.data.statusCounts || {},
  //           };
  //         }

  //         const updated = {
  //           ...prevData,
  //           columns: { ...prevData.columns }, // Spread the columns to avoid direct mutation
  //         };

  //         console.log("updated", updated);

  //         // Append new items only if not empty
  //         for (let key in formattedData.columns) {
  //           const newItems = formattedData.columns[key].items;
  //           if (newItems.length > 0) {
  //             updated.columns[key] = {
  //               ...updated.columns[key], // Preserve other data in the column
  //               items: [
  //                 ...updated.columns[key].items, // Old items
  //                 ...newItems, // New items
  //               ],
  //             };
  //           }
  //         }

  //         // Update statusCounts carefully to prevent overwriting or duplicating data
  //         updated.statusCounts =
  //           response.data.data.statusCounts || prevData.statusCounts;

  //         return updated;
  //       });
  //     }

  //     // Smooth scroll adjustment
  //     // requestAnimationFrame(() => {
  //     //   if (scrollContainer) {
  //     //     const newScrollHeight = scrollContainer.scrollHeight;
  //     //     const scrollDiff = newScrollHeight - prevScrollHeight;
  //     //     scrollContainer.scrollTop += scrollDiff; // maintain scroll position
  //     //   }
  //     // });

  //     // Update pagination
  //     setHasMore(pagination.currentPage < pagination.totalPages);
  //     setPage(pagination.currentPage);
  //   } catch (err) {
  //     console.error("Fetch error:", err?.response || err.message);
  //     setError("Error fetching tasks.");
  //   } finally {
  //     if (pageNum === 1) setTaskLoading(false);
  //   }
  // };

  const handleSearch = async (
    pageNum = 1,
    isToday = isTodayMode,
    todayDate = ""
  ) => {
    setCount("");
    if (taskLoading) return;

    if (pageNum === 1) setTaskLoading(true);
    if (pageNum === 1) {
      setData(null);
      setPage(1);
    }
    try {
      let payload;
      // if (isToday) {
      //   //  Today mode — keep date across pages
      //   payload = {
      //     todayTaskDate: todayDate || todayTaskDate,
      //     page: pageNum,
      //     limit: 10,
      //   };
      // } else {
      //   //  Normal search
      //   payload = {
      //     employeeId: assignTo || "",
      //     projectId: projectname || "",
      //     day: dateFilter || "",
      //     toDate: toDateFilter || "",
      //     taskId: taskIdFilter || "",
      //     page: pageNum,
      //     searchTerm: searchTerm || "",
      //     todayTaskDate: "", // explicitly clear
      //     limit: 10,
      //   };
      // }
      if (isToday) {
        //  Today mode — keep todayTaskDate + include other filters if present
        payload = {
          todayTaskDate: todayDate || todayTaskDate, // always include today's date
          employeeId: assignTo || "", // include if selected
          projectId: projectname || "",
          day: dateFilter || "",
          toDate: toDateFilter || "",
          taskId: taskIdFilter || "",
          searchTerm: searchTerm || "",
          page: pageNum,
          limit: 10,
        };
      } else {
        //  Normal search — clear todayTaskDate completely
        payload = {
          employeeId: employeeemail || "",
          subUserId:employeeDetails.subType ? employeeDetails._id : "",
          projectId: projectname || "",
          day: dateFilter || "",
          toDate: toDateFilter || "",
          taskId: taskIdFilter || "",
          searchTerm: searchTerm || "",
          // todayTaskDate: "", // explicitly cleared
          page: pageNum,
          limit: 10,
        };
      }

      console.log("Payload sent:", payload);

      const response = await axios.get(
        `${API_URL}/api/task/particular-all-task-status-id`,
        { params: payload }
      );

      const allTasks = response.data.data;
      const pagination = response.data.pagination;

      setCount(response.data.counts);
      setProjectTaskCount(response.data.counts);

      const formattedData = {
        columns: {
          todo: { id: "todo", title: "To Do", items: allTasks.taskToDo || [] },
          inprogress: {
            id: "inprogress",
            title: "In Progress",
            items: allTasks.taskInProcess || [],
          },
          inreview: {
            id: "inreview",
            title: "In Review",
            items: allTasks.taskInReview || [],
          },
          done: { id: "done", title: "Done", items: allTasks.taskDone || [] },
          completed: {
            id: "completed",
            title: "Closed",
            items: allTasks.taskCompleted || [],
          },
          block: {
            id: "block",
            title: "Blocked",
            items: allTasks.taskBlock || [],
          },
        },
        columnOrder: [
          "todo",
          "inprogress",
          "inreview",
          "done",
          "completed",
          "block",
        ],
      };

      if (pageNum === 1) {
        setData({
          ...formattedData,
          statusCounts: allTasks.statusCounts || {},
        });
      } else {
        setData((prevData) => {
          if (!prevData) {
            return {
              ...formattedData,
              statusCounts: allTasks.statusCounts || {},
            };
          }

          const updated = {
            ...prevData,
            columns: { ...prevData.columns },
          };

          for (let key in formattedData.columns) {
            const newItems = formattedData.columns[key].items;
            if (newItems.length > 0) {
              updated.columns[key] = {
                ...updated.columns[key],
                items: [...updated.columns[key].items, ...newItems],
              };
            }
          }

          updated.statusCounts = allTasks.statusCounts || prevData.statusCounts;
          return updated;
        });
      }

      setHasMore(pagination.currentPage < pagination.totalPages);
      setPage(pagination.currentPage);
    } catch (err) {
      console.error("Fetch error:", err?.response || err.message);
      setError("Error fetching tasks.");
    } finally {
      if (pageNum === 1) setTaskLoading(false);
    }
  };

  useEffect(() => {
    setData(null);
    setPage(1);
    handleSearch(1);
  }, []);

  useEffect(() => {
    const scrollContainer = document.querySelector(".kanban-scroll");
    let timeout;

    const handleScroll = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (
          scrollContainer.scrollTop + scrollContainer.clientHeight >=
          scrollContainer.scrollHeight - 100
        ) {
          if (hasMore && !taskLoading) {
            handleSearch(page + 1);
          }
        }
      }, 100); // delay 100ms to make it smoother
    };

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
      if (timeout) clearTimeout(timeout);
    };
  }, [hasMore, taskLoading, page]);

  const getStatusCircle = (status) => {
    switch (status.toLowerCase()) {
      case "todo":
        return (
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
        );
      case "inprogress":
        return (
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
        );
      case "inreview":
        return (
          <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
        );
      case "done":
        return (
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
        );
      case "completed":
        return (
          <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
        );
      case "block":
        return (
          <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
        );
      default:
        return (
          <span className="inline-block w-2 h-2 rounded-full bg-gray-500 mr-2"></span>
        );
    }
  };

  // const filteredEmployees = projectname
  //   ? employeeOption.filter((emp) =>
  //       projectname.teamMembers.includes(emp.value)
  //     )
  //   : employeeOption;

  // project.find((role) => role === projectname)?.teamMembers ||
  //             employeeOption
  const projectFilter = project.filter((proj) => proj.value == projectname);

  const filteredEmployees = projectname
    ? employeeOption.filter(
        (emp) =>
          projectFilter[0].teamMembers.includes(emp.value) ||
          projectFilter[0].projectManager.includes(emp.value)
      )
    : employeeOption;

  // const handleTodayClick = () => {
  //   const today = new Date().toISOString().split("T")[0];
  //   setTodaytaskDate(today);
  //   setIsTodayClicked(true);
  //   // Pass the date directly so it works instantly
  //   handleSearch(1, true, today);
  // };

  // const handleSearchClick = () => {
  //   setTodaytaskDate(""); // clear
  //   setIsTodayClicked(false);
  //   handleSearch(1, false);
  // };
  const handleTodayClick = () => {
    const today = new Date().toISOString().split("T")[0];
    setTodaytaskDate(today);
    setIsTodayMode(true); //  now we know pagination is in Today mode
    handleSearch(1, true, today);
  };

  const handleSearchClick = () => {
    setTodaytaskDate("");
    setIsTodayMode(false); //  switch back to normal mode
    handleSearch(1, false);
  };
  const loadMore = () => {
    if (hasMore && !taskLoading) {
      handleSearch(page + 1, isTodayMode);
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <div>
        {buttonLoading ? (
          <div className="flex justify-center items-center w-full h-screen">
            <div className="w-12 h-12 border-4 border-blue-500 rounded-full animate-ping"></div>
          </div>
        ) : (
          <div className="p-5 w-full md:mt-10 ">
            <Mobile_Sidebar />

            <div className="flex gap-2 items-center cursor-pointer">
              <p
                className="text-sm text-gray-500"
                onClick={() => navigate("/client-dashboard")}
              >
                Dashboard
              </p>

              <p>{">"}</p>
              <p className="text-sm text-blue-500">Task List</p>
            </div>

            {/* add */}

            {/* <div className="flex flex-wrap md:flex-nowrap justify-between mt-8 mb-4">
              <div className="flex flex-wrap md:flex-nowrap gap-5 md:gap-8">

                <Dropdown
                  value={projectname}
                  onChange={(e) => setProjectName(e.value)}
                  options={project}
                  optionLabel="label"
                  filter
                  placeholder="Select a Project"
                  className="w-full md:w-[300px]  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Dropdown
                  value={assignTo}
                  onChange={(e) => setAssignTo(e.value)}
                  // options={
                  //   project.find((role) => role === projectname)?.teamMembers ||
                  //   employeeOption
                  // }
                  options={filteredEmployees}
                  filter
                  optionLabel="label"
                  placeholder="Select a Employee"
                  className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <label>From Date</label>
                   <input
                  type="date"
                  className="px-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer "
                  value={dateFilter}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDateFilter(e.target.value)}
                />

                </div>
                <div>
                   <label>To Date</label>
                  <input
                  type="date"
                  placeholder="TaskId"
                  className="px-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer "
                  value={toDateFilter}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setToDateFilter(e.target.value)}
                />
                  
                </div>
               
                
                 <input
                  type="text"
                  className="px-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer "
                  value={taskIdFilter}
                  // max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setTaskIdFilter(e.target.value)}
                />
                <button
                  onClick={()=>handleSearch(1)}
                  className=" text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg px-5 md:px-4"
                >
                  Search
                </button>
              </div>

              <div className="flex gap-5 mt-5 md:mt-0">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg px-7 md:px-4 py-1 md:py-0"
                  onClick={() => navigate("/close-details")}
                >
                  Close Lists
                </button>
                <button
                  className="bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-lg px-6 md:px-4 py-1 md:py-0"
                  onClick={() => navigate("/task-details")}
                >
                  Task List
                </button>
              </div>
            </div> */}
            <div className="flex flex-col md:flex-row justify-between mt-8 mb-4 gap-5 md:gap-0">
              {/* Filters Section */}
              <div className="flex flex-col md:flex-row flex-wrap gap-4 md:gap-5 items-start md:items-center w-full md:w-auto">
                {/* Project Dropdown */}
                <Dropdown
                  value={projectname}
                  onChange={(e) => setProjectName(e.value)}
                  options={project}
                  optionLabel="label"
                  filter
                  placeholder="Select a Project"
                  className="w-full md:w-[300px] border border-gray-300 rounded-lg text-gray-700 text-sm px-3 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Task ID */}
                <input
                  type="text"
                  placeholder="Task ID"
                  className="w-full md:w-[200px] border border-gray-300 rounded-lg text-gray-700 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full md:w-[150px] border border-gray-300 rounded-lg text-gray-700 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Action Buttons */}
                <div className="flex w-full md:w-auto gap-3 justify-start md:justify-end">
                  {/* Search Button */}
                  {/* <button
                    onClick={() => handleSearchClick()}
                    className="w-full md:w-auto text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg px-5 py-2 transition-all"
                  >
                    Search
                  </button> */}
                  <button
                    onClick={handleSearchClick}
                    className="w-full md:w-auto text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg px-5 py-2 transition-all"
                  >
                    Search
                  </button>

                  {/* Clear All Button */}
                  <button
                    onClick={() => {
                      setAssignTo(null);
                      setProjectName(null);
                      setTaskIdFilter("");
                      setDateFilter("");
                      setToDateFilter("");
                      setSearchTerm("");

                      // Optionally refresh your data or reset view:
                      setTriggerClearSearch(true);
                    }}
                    className="w-full md:w-auto text-white bg-gray-500 hover:bg-gray-600 font-medium rounded-lg px-5 py-2 transition-all"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>

            <div>
              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row justify-end gap-3 mt-4 md:mt-0 mb-3">
                {/* <button
                  className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg px-4 py-1 md:px-7 md:py-2 text-sm md:text-base"
                  onClick={() => navigate("/close-details")}
                >
                  Close Lists
                </button> */}
                <button
                  className="w-full md:w-auto bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-lg px-4 py-1 md:px-6 md:py-2 text-sm md:text-base"
                  onClick={() => navigate("/task-details-client")}
                >
                  Task List
                </button>
              </div>
            </div>

            <DragDropContext>
              {/* Outer Scroll (Vertical) */}
              <div className="kanban-scroll h-[600px] rounded-md w-full overflow-y-auto  scroll-smooth  pr-6">
                {/* Inner Scroll (Horizontal Columns) */}
                <div className="flex gap-4 min-w-max rounded-md ">
                  {data &&
                    data.columnOrder.map((columnId) => {
                      console.log("columnId", data);

                      const column = data.columns[columnId];
                      const apiCount =
                        data.statusCounts?.[statusMap[columnId]] || 0;
                      // console.log("api count 123",apiCount);
                      return (
                        <div
                          key={column.id}
                          className="w-[19.2%] bg-gray-100/80 shadow-sm rounded-md px-2 flex-shrink-0 relative flex flex-col"
                        >
                          {/* Sticky Header */}
                          <h2 className="p-2  pt-2 flex items-center gap-1 mb-2 border-b-2 rounded-t-lg-md border-gray-300 sticky top-0 bg-gray-100/90 backdrop-blur-sm z-10">
                            {getStatusCircle(column.id)}
                            <span className="text-[#6b7280] uppercase text-[12px] font-bold">
                              {column.title}
                            </span>
                            <span className="text-sm bg-[#0515240f] text-[#292929] px-[4px] rounded-md">
                              {/* {itemCount} */}
                              {apiCount}
                            </span>
                          </h2>

                          {/* Tasks */}

                          <Droppable droppableId={column.id}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="h-full "
                              >
                                {column.items
                                  // .filter((item) => {
                                  //   if (searchTerm.trim() === "") return true;
                                  //   return (
                                  //     item.assignedTo?.employeeName
                                  //       ?.toLowerCase()
                                  //       .includes(searchTerm.toLowerCase()) ||
                                  //     item.taskId
                                  //       ?.toLowerCase()
                                  //       .includes(searchTerm.toLowerCase())
                                  //   );
                                  // })
                                  .map((item, index) => (
                                    <Draggable
                                      key={`${column.id}-${item._id}`} // unique key
                                      draggableId={`${column.id}-${item._id}`}
                                      index={index}
                                    >
                                      {(provided) => (
                                        <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        onClick={() => handleNavigate(item)}
                                        className="bg-white rounded-sm shadow-[0px_6px_42px_-23px_rgba(0,_0,_0,_0.1)] p-3 mb-2 hover:scale-[1.03] duration-300 cursor-pointer m-1"
                                      >
                                        <div className="flex flex-col  gap-2">
                                         <div className="flex justify-between">
                                           <span className="truncate max-w-48 text-wrap text-[14px] flex items-center justify-between">
                                            {item.title.length > 44
                                              ? `${item.title.substring(
                                                  0,
                                                  44
                                                )}...`
                                              : item.title}
                                            </span>
                                            <div className="">
                                                <span className="">
                                             {item.testerStatus == 1 && (
                                              <VscDebugConsole
                                                className="text-2xl text-green-950"
                                                title="Testing"
                                              />
                                            )}
                                           </span>
                                            {item.pauseComments?.length > 0 &&
                                              item.pauseComments[
                                                item.pauseComments.length - 1
                                              ]?.pauseCondition === "hold" && (
                                                <IoPauseCircleOutline
                                                  className="text-xl text-red-700"
                                                  title="On Hold"
                                                />
                                              )}
                                            </div>
                                         </div>

                                          <div className="flex justify-between items-center"> 
                                            <span
                                              className={`text-xs px-2 py-1 rounded-full font-medium shadow-sm ${
                                                item.assignedTo?.employeeName
                                                  ? "bg-gray-100 text-gray-700"
                                                  : "bg-red-100 text-red-700"
                                              }`}
                                            >
                                              {item.assignedTo?.employeeName ? item.assignedTo?.employeeName.length > 10
                                              ? `${item.assignedTo?.employeeName.substring(
                                                  0,
                                                  10
                                                )}...`
                                              : item.assignedTo?.employeeName : "Not Assigned"}
                                            </span>
                                             <div>
                                            <span className="text-[10px] bg-blue-100 rounded-full px-1 py-[2px]">
                                               {item.projectId?.name ? item.projectId?.name.length > 10
                                              ? `${item.projectId?.name.substring(
                                                  0,
                                                  10
                                                )}...`
                                              : item.projectId?.name : "-"}
                                            </span>
                                          </div>
                                          </div>

                                         

                                          <div className="flex justify-between w-full mt-1">
                                            <span className="text-xs flex gap-2 items-center">
                                              #{item.taskId}
                                              <span className="text-xs">
                                                ({item.createdAt.split("T")[0]})
                                              </span>
                                            </span>
                                            <div
                                              className={`font-semibold capitalize ${
                                                item.priority === "high"
                                                  ? "text-red-500"
                                                  : item.priority === "medium"
                                                  ? "text-orange-400"
                                                  : item.priority === "low"
                                                  ? "text-yellow-300"
                                                  : "text-gray-500"
                                              }`}
                                            >
                                              <PiFlagPennantFill />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      )}
                                    </Draggable>
                                  ))}

                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      );
                    })}
                </div>

                {/* Loader */}
                {taskLoading && (
                  <div className="text-center py-3 text-gray-500 text-sm">
                    Loading more tasks...
                  </div>
                )}
              </div>
            </DragDropContext>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TaskList;
