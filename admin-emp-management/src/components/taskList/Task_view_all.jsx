import React from "react";
import { useState, useEffect, useRef } from "react";

import Mobile_Sidebar from "../Mobile_Sidebar";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import { Editor } from "primereact/editor";
import { FileUpload } from "primereact/fileupload";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext"; // PrimeReact InputText
import { HiOutlineArrowTurnUpLeft } from "react-icons/hi2";

import { FaPlus } from "react-icons/fa";
// files

import axios, { all } from "axios";
import PDF from "../../assets/document/pdf.svg";
import Excel from "../../assets/document/excel.svg";
import ppt from "../../assets/document/ppt.svg";
import Word from "../../assets/document/word.svg";
import Image from "../../assets/document/image.svg";
import Sav from "../../assets/document/sav-file-format.png";
import Zip from "../../assets/document/folderimage.jpg"
import { useParams } from "react-router-dom";
import { capitalizeFirstLetter } from "../../utils/StringCaps";
// import { dateFormat } from "../../dateformat";
import Swal from "sweetalert2";
import { FaEye } from "react-icons/fa";
import { API_URL } from "../../config";
import DOMPurify from "dompurify";
import { saveAs } from "file-saver";
import { TbLogs } from "react-icons/tb";
import Papa from "papaparse";
import { FaFileExport, FaUpload, FaUser } from "react-icons/fa6";
import { toast } from "react-toastify";
import { PiFlagPennantFill } from "react-icons/pi";
import { AiFillDelete, AiTwotoneDelete } from "react-icons/ai";
import { Dropdown } from "primereact/dropdown";
import { useDateUtils } from "../../hooks/useDateUtils";
import { FiCopy } from "react-icons/fi";


function Task_view_all() {
  const employeeDetails = JSON.parse(localStorage.getItem("hrmsuser"));
  // console.log("employeeDetails:", employeeDetails.email);
  const formatDateTime = useDateUtils();

  const employeeemail = employeeDetails?.email;
  const employeeeId = employeeDetails?._id;
  const { taskId } = useParams();

  console.log("Task ID:", taskId);

  const navigate = useNavigate();

  const [status, setStatus] = useState("");
  const [startTime, setStartTime] = useState("");
  // console.log("startTime", startTime);

  const [stopTime, setStopTime] = useState("");
  // subTask List
  const [assignTo, setAssignTo] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [assignToChange, setAssignToChange] = useState("");

  // const handleStatusChange = (e) => {
  //   const newStatus = e.target.value;
  //   setStatus(newStatus);

  //   const now = new Date().toISOString(); // Full ISO timestamp

  //   if (newStatus === "In Progress" && !startTime) {
  //     setStartTime(now);
  //   } else if (newStatus === "Review" && !stopTime) {
  //     setStopTime(now);
  //   }
  // };

  //   files all icon

  const getFileIcon = (type) => {
    const imageFormats = [
      "jpg",
      "png",
      "gif",
      "jpeg",
      "svg",
      "txt",
      "PNG",
      "JPG",
      "SVG",
      "MP4",
      "zip"
    ];
    const excelFormats = ["xlsx", "xls", "csv"];
    const wordFormats = ["docx", "doc", "word"];
    const pptFormats = ["ppt", "pptx"];
    const SavFormats = ["sav"];
    const zipFormats = ["zip"];

    const commonClass = "w-7 h-7 object-contain";

    if (imageFormats.includes(type)) {
      return type !== "mp4" ? (
        <img src={Image} className={commonClass} alt="Image" />
      ) : (
        <LuFileVideo2 className="text-xl text-blue-600" />
      );
    }
    if (SavFormats.includes(type)) {
      return <img src={Sav} className={commonClass} alt="Image" />;
    }

    if (excelFormats.includes(type)) {
      return <img src={Excel} className={commonClass} alt="Excel" />;
    }

    if (wordFormats.includes(type)) {
      return <img src={Word} className={commonClass} alt="Word" />;
    }

    if (pptFormats.includes(type)) {
      return <img src={ppt} className={commonClass} alt="ppt" />;
    }

    if (zipFormats.includes(type)) {
      return <img src={Zip} className={commonClass} alt="zip" />;
    }

    if (type === "pdf") {
      return <img src={PDF} className={commonClass} alt="PDF" />;
    }

    return null;
  };

  // all data fetch in api to taskid

  const [alldata, setAlldata] = useState([]);

  const [pauseProject, setpauseProject] = useState("");

  const [holddata, setHolddata] = useState([]);
  const [projectManager, setProjectManager] = useState([]);

  // console.log("holddata", holddata);

  console.log("alldata", alldata);

  const fetchProjectall = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/task/particular-task/${taskId}`
      );
      console.log("response", response);
      if (response.data.success) {
        setAlldata(response?.data?.data);
        setStatus(response?.data?.data?.status);
        setStartTime(response?.data?.data?.startTime);
        setStopTime(response?.data?.data?.endTime);
        const pauseComments = response?.data?.data?.pauseComments;
        if (pauseComments && pauseComments.length > 0) {
          const lastPauseCondition =
            pauseComments[pauseComments.length - 1].pauseCondition;
          setpauseProject(lastPauseCondition);
        }
        setHolddata(response?.data?.data?.pauseComments);
        setProjectManager(response?.data?.data?.projectManagerId);
        setTester(response?.data?.data?.testerStatus || "-");
        setSubTasks(response?.data?.data?.subtasks || []);
        setAssignToChange(response?.data?.data?.assignedTo?._id || "");
        setMessage(response?.data?.data?.comments || "");
      } else {
        console.log("Failed to fetch roles.");
      }
    } catch (error) {
      console.log("Failed to fetch roles.");
    }
  };
  useEffect(() => {
    fetchProjectall();
  }, []);

  // remove tagss

  function stripHtmlTags(str) {
    if (!str) return "";
    return str.replace(/<[^>]*>/g, "");
  }
  console.log("assignToChange 123", assignToChange);
  // download image to see

  const handleCommonFileDownload = (filePath) => {
    try {
      const imageUrl = `${API_URL}/api/uploads/others/${filePath}`;
      window.open(imageUrl, "_blank");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to open image",
        text: error.message,
        showConfirmButton: true,
      });
    }
  };

  const handleCommonFilecommon = (filePath) => {
    try {
      const imageUrl = `${API_URL}/api/uploads/others/${filePath}`;
      window.open(imageUrl, "_blank");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to open image",
        text: error.message,
        showConfirmButton: true,
      });
    }
  };

  // status changes

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    const now = new Date().toISOString();
    let updatedStartTime = startTime;
    let updatedStopTime = stopTime;

    if (newStatus === "in-progress" && !startTime) {
      updatedStartTime = now;
      setStartTime(now);
    } else if (newStatus === "in-review" && !stopTime) {
      updatedStopTime = now;
      setStopTime(now);
    }

    const payload = {
      status: newStatus,
      startTime: updatedStartTime,
      endTime: updatedStopTime,
      updatedAt: now,
      updatedBy: employeeeId,
    };

    // console.log("payload", payload);

    try {
      const response = await axios.patch(
        `${API_URL}/api/task/updated-status/${taskId}`,
        payload
      );

      console.log("Status updated:", response.data);

      toast.success("Task status updated successfully");
      fetchProjectlogs();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update task status."
      );
      fetchProjectall();
    }
  };
  const handleAssignedtoChange = async (e) => {
    console.log("coming asss");
    const newAssignedTo = e.value;
    console.log("newAssignedTo", newAssignedTo);
    setAssignToChange(newAssignedTo);

    const now = new Date().toISOString();
    // let updatedStartTime = startTime;
    // let updatedStopTime = stopTime;

    // if (newStatus === "in-progress" && !startTime) {
    //   updatedStartTime = now;
    //   setStartTime(now);
    // } else if (newStatus === "in-review" && !stopTime) {
    //   updatedStopTime = now;
    //   setStopTime(now);
    // }
    console.log("coming asss 1");
    const payload = {
      assignedTo: newAssignedTo,
      // startTime: updatedStartTime,
      // endTime: updatedStopTime,
      updatedAt: now,
      updatedBy: employeeeId,
    };

    console.log("coming asss 2,", payload);
    try {
      const response = await axios.patch(
        `${API_URL}/api/task/updated-status/${taskId}`,
        payload
      );

      console.log("Assigned updated:", response.data);

      toast.success("Task assigned updated successfully");
      fetchProjectlogs();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update task  asssignedTo."
      );
      fetchProjectall();
    }
  };

  // messages
  const [message, setMessage] = useState([]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/project/view-projects`);
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
    } catch (err) {
      setErrors("Failed to fetch project.");
    }
  };

  useEffect(() => {
    // fetchProjectall();
    fetchProject();
  }, []);

  const [editorContent, setEditorContent] = useState("");
  // const fileUploadRef = useR/ef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileUploadRef = useRef(null);
  const [errors, setErrors] = useState("");
  ///subtask list
  const [project, setProject] = useState([]);
  const [employeeOption, setEmployeeOption] = useState(null);
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
    fetchEmployeeList();
  }, []);
  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("comment", editorContent);
    formData.append("createdBy", employeeeId);
    formData.append("taskId", taskId);

    uploadedFiles.forEach((file) => {
      formData.append("document[]", file);
    });

    try {
      const response = await axios.post(
        `${API_URL}/api/task/task-comments`,
        formData
      );

      console.log("Upload success:", response.data);
      // alert("Submitted successfully!");
      setEditorContent("");
      setUploadedFiles([]);
      fileUploadRef.current?.clear();
      fetchProject();
      fetchProjectall();
    } catch (error) {
      setErrors(error.response.data.errors.error);
      console.error("Upload error:", error.errors);
      // alert("Upload failed!");
    }
  };

  const getTimeDifference = (startTime, stopTime) => {
    if (!startTime || !stopTime) return "";

    const start = new Date(startTime);
    const stop = new Date(stopTime);

    if (isNaN(start) || isNaN(stop)) return "Invalid time";

    let diff = stop - start;

    // Prevent negative values (e.g., if stop is before start)
    if (diff < 0) return "Stop before Start";

    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hrs}h ${mins}m ${secs}s`;
  };

  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState("");

  //  useEffect trigger to clear all filter date

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

  // useEffect(() => {
  //   // fetchProjectall();
  //   fetchProject();
  // }, []);

  console.log("alldata?.projectIdFilter", alldata?.projectIdFilter);
  // const filteredEmployees = (() => {
  //   const selectedRole = project.find(
  //     (proj) =>console.log( proj.value) proj.value === alldata?.projectIdFilter
  //   );
  //   console.log("selectedRole", selectedRole);

  //   return selectedRole
  //     && employeeOption.filter(
  //         (emp) =>
  //           selectedRole.teamMembers?.includes(emp.value) ||
  //           selectedRole.projectManager.includes(emp.value)
  //       )

  // })();

  //  const handleholdChange = (e) => {
  //   const selectedValue = e.target.value;
  //   setpauseProject(selectedValue);

  //   // if (selectedValue === "hold") {
  //   //   setShowModal(true);
  //   // } else if (selectedValue === "restart") {
  //   //   // Immediately calcl API without modal
  //   //   setNote(""); // No note required for restart
  //   //   handleholdSubmit("restart");
  //   // }

  //   if (selectedValue === "hold") {
  //     setShowModal(true);
  //   } else if (selectedValue === "restart") {
  //     setNote("");
  //     setShowModal(false);
  //     // handleholdSubmit("restart");
  //   }
  // };
  const filteredEmployees = (() => {
    console.log("project", project);
    const selectedRole = project.find((proj) => {
      // console.log("hhhhh", proj.value);
      return proj.value === alldata?.projectIdFilter;
    });

    console.log("selectedRole", selectedRole);

    return (
      selectedRole &&
      employeeOption.filter(
        (emp) =>
          selectedRole.teamMembers?.includes(emp.value) ||
          selectedRole.projectManager.includes(emp.value)
      )
    );
  })();

  const handleholdChange = (e) => {
    const selectedValue = e.target.value;
    setpauseProject(selectedValue);

    if (selectedValue === "hold") {
      setShowModal(true); // Show custom modal with textarea
    } else if (selectedValue === "restart") {
      setNote(""); // Clear note just in case
      // Show confirmation popup for restart
      setShowModal(true);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setpauseProject("");
    setNote("");
  };

  // const handleholdSubmit = async () => {
  //   //  const status = statusOverride || pauseProject; statusOverride = null
  //   const payload = {
  //     pauseProject: pauseProject,
  //     note: note,
  //   };

  //   console.log("Submitted payload:", payload);

  //   try {
  //     const response = await axios.put(
  //       `${API_URL}api/task/task-pasusecondition/${taskId}`,
  //       payload
  //     );

  //     console.log("Status updated:", response.data);
  //      Swal.fire({
  //     title: "Are you sure?",
  //     text: "Do you want to restart this project?",
  //     icon: "question",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, Restart",
  //   })
  //     setShowModal(false);
  //     setNote("");
  //   } catch (error) {
  //     console.error("Update failed:", error);
  //     alert("Failed to update task status");
  //   }
  // };

  const handleholdSubmit = async () => {
    const actionText =
      pauseProject === "hold" ? "hold this project" : "restart this project";
    const confirmButtonText =
      pauseProject === "hold" ? "Yes, Hold" : "Yes, Restart";

    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${actionText}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
    });

    if (result.isConfirmed) {
      const payload = {
        pauseProject: pauseProject,
        note: note,
        updatedBy: employeeeId,
      };

      console.log("Submitted payload:", payload);

      try {
        const response = await axios.put(
          `${API_URL}/api/task/task-pasusecondition/${taskId}`,
          payload
        );

        console.log("Status updated:", response.data);

        toast.success(
          `Project ${pauseProject === "hold" ? "held" : "restarted"
          } successfully.`
        );

        setShowModal(false);
        setNote("");
        fetchProjectall();
        fetchProjectlogs();
      } catch (error) {
        console.error("Update failed:", error);
        toast.error("Failed to update task status.");
      }
    }
  };

  const [showPopup, setShowPopup] = useState(false);

  const handleClick = () => {
    setShowPopup(true);
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  const [showPopuplogs, setShowPopuplogs] = useState(false);

  const handleClicklogs = () => {
    setShowPopuplogs(true);
  };

  const handleCloselogs = () => {
    setShowPopuplogs(false);
  };

  const [logs, setLogs] = useState([]);
  console.log("logs", logs);

  const fetchProjectlogs = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/task/tasklogs/${taskId}`
      );
      console.log(response.data);
      if (response.data.success) {
        setLogs(response.data.data);
      } else {
        console.log("Failed to fetch logs.");
      }
    } catch (err) {
      console.log("Failed to fetch logs.");
    }
  };

  useEffect(() => {
    fetchProjectlogs();
  }, []);

  const exportToCSV = () => {
    const csvData = Papa.unparse(
      logs.map((item, index) => ({
        SNo: index + 1,
        Status: item.status,
        "Updated At": new Date(item.updatedAt).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        "Updated By": item.updatedBy,
      }))
    );

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    // saveAs(blob, "logs.csv");
    saveAs(blob, `logs-${employeeemail}.csv`);
  };

  function formatHtml(html) {
    return DOMPurify.sanitize(html);
  }

  const [tester, setTester] = useState([]);

  const handleTesterChange = async (e) => {
    const value = e.target.value;
    setTester(value); // update the state

    const confirmText = value === "0" ? "Yet Not Started" : "Started";

    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to set tester status to '${confirmText}'?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Yes, ${confirmText}`,
    });

    if (result.isConfirmed) {
      const payload = {
        taskId: taskId,
        testerStatus: value,
        updatedBy: employeeemail,
      };

      try {
        const response = await axios.put(
          `${API_URL}/api/task/updated-tester-status`,
          payload
        );
        console.log(response);

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Tester status updated to '${confirmText}'`,
        });

        setShowModal(false);
        fetchProjectlogs();
        fetchProjectall();
      } catch (error) {
        console.error("Update failed:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update task status.",
        });
      }
    }
  };

  function onClickCard(employeeId) {
    window.open(`/employeedetails/${employeeId}`, "_blank");

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }

  const fileInputRef = useRef();

  const handleIconClick = () => {
    fileInputRef.current.click(); // programmatically trigger file input
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    console.log(selectedFiles);
    setUploadedFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const [subTasks, setSubTasks] = useState([]);

  const [newTask, setNewTask] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const openPopup = () => setIsAddingTask(true);
  const closePopup = () => setIsAddingTask(false);

  // Handle adding a new task
  // const handleAddTask = () => {
  //   try {
  //     let validationErrors = {};

  // // --- Validation Rules ---
  // if (!newTask?.trim()) {
  //   validationErrors.title = "Task title is required.";
  // }

  // if (!assignTo) {
  //   validationErrors.assignTo = "Please select an employee.";
  // }

  // if (!projectDescription?.trim()) {
  //   validationErrors.projectDescription = "Task description is required.";
  // }

  // if (!priority) {
  //   validationErrors.priority = "Please select a priority.";
  // }

  // // If validation fails, stop and show errors
  // if (Object.keys(validationErrors).length > 0) {
  //   setErrors(validationErrors);
  //   return;
  // }
  //     const payload = {
  //       taskId: alldata._id,
  //       title: newTask,
  //       createdById: employeeeId,
  //       projectId: alldata.projectIdFilter,
  //       assignTo: assignTo,
  //       projectManagerId: alldata.projectManagerId?._id,
  //       projectDescription,
  //       priority,
  //     };
  //     const response = axios.post(
  //       `${API_URL}/api/subtasks/create-subtask`,
  //       payload
  //     );
  //     fetchProjectall();
  //     setProjectDescription("");

  //   } catch (error) {
  //     console.log("error to add subtask");
  //   }
  //   setNewTask("");
  //   setAssignTo("");
  //   setIsAddingTask(false);
  // };

  const handleAddTask = async () => {
    try {
      let validationErrors = {};

      // Validation Rules
      if (!newTask?.trim()) {
        validationErrors.title = "Task title is required.";
      }

      if (!assignTo) {
        validationErrors.assignTo = "Please select an employee.";
      }

      if (!projectDescription?.trim()) {
        validationErrors.projectDescription = "Task description is required.";
      }

      if (!priority) {
        validationErrors.priority = "Please select a priority.";
      }

      // If validation fails
      if (Object.keys(validationErrors).length > 0) {
        // const errorMessage = Object.values(validationErrors)
        //   .map((msg) => `• ${msg}`)
        //   .join("<br>");

        // Swal.fire({
        //   icon: "error",
        //   title: "Validation Error",
        //   html: errorMessage,
        // });

        setErrors(validationErrors);
        return;
      }

      const payload = {
        taskId: alldata._id,
        title: newTask,
        createdById: employeeeId,
        projectId: alldata.projectIdFilter,
        assignTo,
        projectManagerId: alldata.projectManagerId?._id,
        projectDescription,
        priority,
      };

      await axios.post(`${API_URL}/api/subtasks/create-subtask`, payload);

      await fetchProjectall();

      Swal.fire({
        icon: "success",
        title: "Task Added!",
        timer: 1200,
        showConfirmButton: false,
      });

      // Reset values
      setNewTask("");
      setAssignTo("");
      setProjectDescription("");
      setPriority("");
      setIsAddingTask(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to add task",
        text: "Something went wrong. Please try again.",
      });
      // console.log(error);
    }
  };

  const handleSubTaskStatus = (id, value) => {
    try {
      const payload = {
        status: value,
        updatedBy: employeeeId,
      };
      const response = axios.put(
        `${API_URL}/api/subtasks/update-subtask/${id}`,
        payload
      );
      fetchProjectall();
      toast.success("SubTask status updated successfully");
    } catch (error) {
      console.log("error to update subtask status");
      toast.error(
        error?.response?.data?.message || "Failed to update subtask status."
      );
    }
  };

  const handleDeleteSubTask = (id) => {
    try {
      const response = axios.delete(
        `${API_URL}/api/subtasks/delete-subtask/${id}`
      );
      fetchProjectall();
      toast.success("SubTask deleted successfully");
    } catch (error) {
      console.log("error to delete subtask status");
      toast.error(
        error?.response?.data?.message || "Failed to delete subtask ."
      );
    }
  };

  const columns = [
    {
      field: "title",
      header: "Sub Task",
    },
    {
      field: "projectDescription",
      header: "Description",
      body: (rowData) => (
        <div
          className="text-sm"
          dangerouslySetInnerHTML={{
            __html: rowData?.projectDescription || "-",
          }}
        />
      ),
    },
    {
      field: "status",
      header: "priority",
      body: (rowData) => (
        <div className="flex items-center justify-center gap-1">
          <div
            className={`flex gap-1 px-2 rounded-sm justify-center items-center font-semibold capitalize ${rowData.priority === "high"
              ? "text-red-500 bg-red-100"
              : rowData.priority === "medium"
                ? "text-orange-400 bg-orange-100"
                : rowData.priority === "low"
                  ? "text-yellow-300 bg-yellow-100"
                  : "text-gray-500"
              }`}
          >
            <span className="font-normal">{rowData.priority}</span>
            <PiFlagPennantFill />
          </div>
        </div>
      ),
    },
    {
      field: "AssignTo",
      header: "Assign To",
      body: (rowData) => (
        <div className="flex items-center justify-center gap-1">
          <div>
            <span className="font-normal">
              {rowData?.assignedTo?.employeeName || "-"}
            </span>
          </div>
        </div>
      ),
    },
    {
      field: "status",
      header: "Status",
      body: (rowData) => (
        <div className="flex items-center justify-center gap-1">
          {/* Status Indicator */}
          {rowData?.status === "todo" ? (
            <span className="bg-blue-600 w-2 h-2 rounded-full"></span>
          ) : rowData?.status === "in-progress" ? (
            <span className="bg-orange-500 w-2 h-2 rounded-full"></span>
          ) : (
            <span className="bg-green-600 w-2 h-2 rounded-full"></span>
          )}

          {/* Select with options */}
          <select
            className="px-2 py-1 border rounded border-none cursor-pointer outline-none"
            value={rowData?.status} // Set the select value based on rowData.status
            onChange={(e) => handleSubTaskStatus(rowData._id, e.target.value)} // Handle status change
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      ),
    },
    {
      field: "action",
      header: "Action",
      body: (rowData) => (
        <>
          {" "}
          <button
            onClick={() => handleDeleteSubTask(rowData._id)}
            className="text-xl text-red-500 hover:text-red-600 hover:scale-105 "
          >
            <AiFillDelete />
          </button>
        </>
      ),
    },
  ];

  const handleCopy = () => {
    const fullUrl = `https://employee.aryutechnologies.com/tasklist-details/${alldata?.taskId}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success("Task URL copied!");
  };
  return (
    <>
      {" "}
      <div className="h-full w-screen flex flex-col justify-between bg-gray-100 ">
        <div className="px-3 py-3 md:px-7 lg:px-10 xl:px-12 md:py-10 ">
          <Mobile_Sidebar />

          <div className="flex gap-2 items-center cursor-pointer mb-3">
            <p
              className="text-sm text-gray-500"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </p>
            <p>{">"}</p>
            <p
              className="text-sm text-gray-500"
              onClick={() => navigate("/task-list")}
            >
              Task List
            </p>
            <p>{">"}</p>
            <p className="text-sm text-blue-500">Task View</p>
          </div>
          {/* task details*/}
          <section className="flex flex-wrap md:flex-nowrap bg-white rounded-2xl">
            {/* left side */}
            <div
              className="w-full md:w-[64%] pt-5 md:pt-10 relative 
               md:border-r-6 md:border-gray-400 
               border-b-2 border-gray-300 md:border-b-0"
            >
              <h2 className="text-gray-600 text-[20px] md:text-[22px] px-4 md:px-10 font-bold">
                Details
              </h2>

              <div className="h-[540px] overflow-y-scroll md:mr-2 px-4 md:px-10">
                {/* project title */}
                <div className="mt-6 md:mt-8">
                  <span className="font-bold text-[15px] md:text-[16px] text-gray-500">
                    Task Title :
                  </span>
                  <span className="text-gray-500 text-[14px] ml-2 break-words">
                    {alldata?.title}
                  </span>
                </div>

                {/* project description */}
                <div className="mt-4 md:mt-6">
                  <span className="text-[15px] md:text-[16px] text-gray-500 font-bold">
                    Task Description:
                  </span>
                  {/* <div
                    className="text-gray-500 text-[14px] w-full md:w-[90%] mt-2 leading-relaxed break-words "
                    dangerouslySetInnerHTML={{
                      __html: formatHtml(alldata?.description),
                    }}
                  ></div> */}
                  <div
                    className="custom-html text-gray-500 text-[14px] w-full md:w-[90%] mt-2 leading-relaxed break-words"
                    dangerouslySetInnerHTML={{
                      __html: formatHtml(alldata?.description),
                    }}
                  ></div>
                </div>

                {/* attachment */}
                {alldata.document && alldata.document.length > 0 && (
                  <div className="mt-6 flex flex-col sm:flex-row gap-2 ">
                    <span className="text-[15px] md:text-[16px] text-gray-500 font-bold">
                      Attachment:
                    </span>
                    <div className="flex gap-2 flex-wrap">
                      {alldata?.document.map((doc, idx) => {
                        const extension = doc.filepath
                          ?.split(".")
                          .pop()
                          .toLowerCase();
                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() =>
                              handleCommonFileDownload(doc.filepath)
                            }
                          >
                            {getFileIcon(extension)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* subtask details */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[15px] md:text-[16px] text-gray-500 font-bold">
                      Sub task items
                    </span>
                    <button
                      className="text-gray-500 hover:text-gray-600 hover:scale-105"
                      onClick={() => setIsAddingTask(!isAddingTask)}
                    >
                      <FaPlus className="inline-block" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <DataTable
                      value={subTasks}
                      showGridlines
                      tableStyle={{ minWidth: "40rem" }}
                      resizableColumns
                      columnResizeMode="fit"
                      scrollable
                      scrollHeight="200px"
                      className="border border-gray-300 rounded-md shadow-md text-sm"
                    >
                      {columns.map((col, index) => (
                        <Column
                          key={index}
                          field={col.field}
                          header={col.header}
                          body={col.body}
                          style={
                            index === 0
                              ? {
                                minWidth: "200px",
                                maxWidth: "300px",
                                wordWrap: "break-word",
                                whiteSpace: "normal",
                                overflow: "visible",
                              }
                              : {}
                          }
                        />
                      ))}
                    </DataTable>
                  </div>

                  {isAddingTask && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                        {/* Close Button */}
                        <button
                          onClick={closePopup}
                          className="absolute top-3 right-3 text-red-500 hover:text-black text-xl"
                        >
                          ×
                        </button>

                        <h2 className="text-lg font-bold mb-4">SUB TASK </h2>
                        <div>
                          {/* Task Input */}
                          <label className="block text-sm font-medium mb-2">
                            Title <span className="text-red-500">*</span>
                          </label>
                          <InputText
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Enter task title"
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleAddTask()
                            }
                            className="p-inputtext-sm py-2 px-3 border rounded-md w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        {errors.title && (
                          <p className="text-red-500 text-sm">{errors.title}</p>
                        )}

                        {/* Assign To Dropdown */}
                        <div className="my-4">
                          <label className="block text-sm font-medium mb-2">
                            Assign To <span className="text-red-500">*</span>
                          </label>

                          <Dropdown
                            value={assignTo}
                            onChange={(e) => setAssignTo(e.value)}
                            options={filteredEmployees}
                            placeholder="Select Employee"
                            filter
                            className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        {errors.assignTo && (
                          <p className="text-red-500 text-sm">
                            {errors.assignTo}
                          </p>
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
                            onTextChange={(e) =>
                              setProjectDescription(e.htmlValue)
                            }
                            style={{ height: "100px" }}
                          />
                        </div>
                        {errors.projectDescription && (
                          <p className="text-red-500 text-sm">
                            {errors.projectDescription}
                          </p>
                        )}

                        {/* {error.rolename && <p className="error">{error.rolename}</p>} */}
                        {/* {errors.description && (
                          <p className="text-red-500 text-sm mb-4">
                            {errors.description}
                          </p>
                        )} */}
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
                        {errors.priority && (
                          <p className="text-red-500 text-sm">
                            {errors.priority}
                          </p>
                        )}

                        {/* {error.status && <p className="error">{error.status}</p>} */}
                        {/* {errors.priority && (
                  <p className="text-red-500 text-sm mb-4">{errors.priority}</p>
                )} */}

                        {/* Submit Button */}
                        <div className="flex justify-end mt-1">
                          <button
                            onClick={() => {
                              handleAddTask();
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-bold"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* comments */}
                <div className="mt-6 h-auto">
                  <h2 className="text-[15px] md:text-[16px] text-gray-500 font-bold">
                    Comments:
                  </h2>
                  <div className="mt-5 space-y-4">
                    {message.map((msg) => (
                      <div
                        key={msg.id}
                        className="space-x-2 flex flex-col sm:flex-row items-start sm:space-x-2 w-full sm:w-[90%] pb-6"
                      >
                        {/* <img
                          src={`${API_URL}/api/uploads/${msg.photo}`}
                          alt={msg.name}
                          className="w-10 h-10 rounded-full shadow-md mb-2 sm:mb-0"
                        /> */}
                        {msg.photo ? (
                          <img
                            src={`${API_URL}/api/uploads/${msg.photo}`}
                            alt={msg.name}
                            className="w-10 h-10 rounded-full shadow-md mb-2 sm:mb-0"
                          />
                        ) : (
                          <FaUser className="w-10 h-10 rounded-full shadow-md mb-2 sm:mb-0 text-gray-400 pt-2 bg-gray-100" />
                        )}

                        <div className="bg-gray-100/70 p-3 sm:p-4 rounded-lg shadow-sm w-full sm:w-[600px] space-y-2">
                          <p className="text-sm font-semibold text-gray-800 capitalize">
                            {msg.name}
                          </p>
                          <p
                            className="text-sm break-words text-gray-700"
                            dangerouslySetInnerHTML={{
                              __html: formatHtml(msg.comment),
                            }}
                          ></p>

                          {msg.document && Array.isArray(msg.document) && (
                            <div className="flex gap-1 flex-wrap">
                              {msg.document.map((doc, idx) => {
                                const extension = doc.filepath
                                  ?.split(".")
                                  .pop()
                                  .toLowerCase();
                                return (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-1 cursor-pointer p-2 hover:bg-gray-100"
                                    onClick={() =>
                                      handleCommonFilecommon(doc.filepath)
                                    }
                                  >
                                    {getFileIcon(extension)}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          <div className="flex justify-between text-xs text-gray-500 pt-1 border-t border-gray-300">
                            <span></span>
                            <span>
                              {/* {formatDateTime(msg.createdAt)} */}

                              {msg.createdAt ? (
                                <>
                                  {formatDateTime(msg.createdAt)} <br />
                                  {new Date(msg.createdAt).toLocaleTimeString(
                                    "en-IN",
                                    {
                                      timeZone: "Asia/Kolkata",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                      hour12: true,
                                    }
                                  )}
                                </>
                              ) : (
                                ""
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:mt-7 md:absolute bottom-0 w-full bg-white p-2 border-t border-gray-300">
                <div className="w-full">
                  <div className="flex justify-between items-center gap-2 flex-wrap md:flex-nowrap ">
                    <p className="text-gray-700 text-sm">
                      {uploadedFiles?.length > 0
                        ? `${uploadedFiles?.length} files`
                        : ""}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-300/50 p-1 rounded-full text-2xl cursor-pointer hover:scale-105">
                        <FaUpload
                          onClick={handleIconClick}
                          className="text-gray-600 p-1 text-2xl cursor-pointer"
                        />
                        <input
                          type="file"
                          ref={fileInputRef}
                          multiple
                          style={{ display: "none" }}
                          onChange={handleFileChange}
                        />
                      </div>
                      <button
                        className="bg-blue-600 text-sm md:text-md px-3 py-1 hover:scale-105 duration-200 text-white rounded-2xl"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </div>

                  {/* <div className="text-end">
                    <span className="text-red-600 text-sm">{errors}</span>
                  </div> */}
                </div>

                <Editor
                  value={editorContent}
                  onTextChange={(e) => setEditorContent(e.htmlValue)}
                  placeholder="Add a comment..."
                  style={{ height: "100px" }}
                  className="border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                />
              </div>
            </div>

            {/* right side */}
            <div className="w-full md:w-[36%] pt-4 px-4 md:px-8 pb-10 bg-gray-100/20">
              {/* status */}
              <div className="max-w-md mx-auto space-y-5">
                <div className="flex justify-start md:justify-end gap-4">
                  <div
                    onClick={handleCopy} className="
        flex items-center gap-2 
        text-gray-600 
        cursor-pointer 
        hover:text-blue-600 
        transition 
        duration-200 
        md:justify-end 
        justify-start
      "
                    title="Click to copy task link"
                  >
                    <span className="font-medium">Copied Link</span>
                    <FiCopy className="text-xl" />
                  </div>
                  <div className="flex justify-start md:justify-end text-gray-500 text-lg">
                    #{alldata?.taskId}
                  </div>
                </div>
                <div className="flex justify-between md:justify-end">
                  <TbLogs
                    onClick={handleClicklogs}
                    className="cursor-pointer"
                    title="View "
                  />
                </div>
                <div className="flex flex-wrap md:flex-nowrap items-center space-x-4">
                  <div className="w-full md:w-1/2 font-bold text-[14px]  text-gray-500">
                    Project Name
                  </div>
                  <div className="w-full">
                    <input
                      type="text"
                      value={alldata?.projectId?.name}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled
                    />
                  </div>
                </div>
                {/* Status */}
                <div className="flex flex-wrap md:flex-nowrap items-center space-x-4">
                  <div className="w-full md:w-1/2 font-bold text-[14px] text-gray-500">
                    Status
                  </div>

                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={status}
                    onChange={handleStatusChange}
                  >
                    <option value="" disabled>
                      Select option
                    </option>
                    <option value="todo">TO DO</option>

                    <option value="in-progress">IN PROGRESS</option>
                    <option value="in-review">IN REVIEW</option>
                    <option value="done">DONE</option>
                    <option value="block">BLOCKED</option>
                    <option value="completed">CLOSE</option>
                  </select>
                </div>
                {status === "in-review" && (
                  <div className="flex items-center space-x-4">
                    <div className="w-1/2 font-bold text-[14px]  text-gray-500">
                      Tester
                    </div>

                    <select
                      className="w-full border border-gray-300 bg-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={tester}
                      onChange={handleTesterChange}
                      disabled
                    >
                      {/* <option value="" disabled>
                        Select option
                      </option> */}
                      <option value="0">Yet Not Started</option>
                      <option value="1">Started</option>
                    </select>
                  </div>
                )}

                {/* Start Time */}
                <div className="flex flex-wrap md:flex-nowrap items-center space-x-4">
                  <div className="w-full md:w-1/2 font-bold text-[14px]  text-gray-500">
                    Start Time
                  </div>
                  <input
                    type="text"
                    value={
                      startTime
                        ? new Date(startTime).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                        : ""
                    }
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                  />
                </div>

                {/* Stop Time */}
                <div className="flex flex-wrap md:flex-nowrap items-center space-x-4">
                  <div className="w-full md:w-1/2 font-bold text-[14px]  text-gray-500">
                    End Time
                  </div>
                  <input
                    type="text"
                    value={
                      stopTime
                        ? new Date(stopTime).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                        : ""
                    }
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                  />
                </div>

                {/* end time */}

                <div className="flex flex-wrap md:flex-nowrap items-center space-x-4">
                  <div className="w-full md:w-1/2 font-bold text-[14px]  text-gray-500">
                    Worked Time
                  </div>
                  <input
                    type="text"
                    value={getTimeDifference(startTime, stopTime)}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                  />
                </div>

                {/* hold */}

                <div className="flex flex-wrap md:flex-nowrap items-center space-x-4">
                  <div className="w-full md:w-1/2 font-bold text-[14px]  text-gray-500">
                    Pause
                  </div>

                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={pauseProject}
                    onChange={handleholdChange}
                  >
                    <option value="" disabled selected={pauseProject === ""}>
                      Select option
                    </option>

                    <option
                      value="hold"
                      style={{
                        display:
                          pauseProject === "" || pauseProject === "restart"
                            ? "block"
                            : "none", // Show 'Hold' if empty or 'restart' is selected
                      }}
                    >
                      Hold
                    </option>

                    <option
                      value="restart"
                      style={{
                        display: pauseProject === "hold" ? "block" : "none", // Show 'Restart' if empty or 'hold' is selected
                      }}
                    >
                      Restart
                    </option>
                  </select>
                </div>

                {/* <div className="flex justify-end">
                  <FaEye
                    onClick={handleClick}
                    className="cursor-pointer"
                    title="View "
                  />
                </div> */}

                {/* Assign To */}
                <div className="flex flex-wrap md:flex-nowrap items-center space-x-4">
                  <div className="w-full md:w-1/2 font-bold text-[14px]  text-gray-500">
                    Assigned To
                  </div>
                  <div
                    className="w-full py-2 text-gray-700 text-[14px] cursor-pointer hover:text-blue-500"
                  // onClick={() => onClickCard(alldata?.assignedTo?._id)}
                  >
                    {/* {alldata?.assignedTo?.employeeName} */}
                    <Dropdown
                      value={assignToChange} // must be the email for edit mode to work
                      onChange={handleAssignedtoChange}
                      filter
                      options={filteredEmployees}
                      placeholder="Select Employee"
                      className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* created by */}
                <div className="flex flex-wrap md:flex-nowrap items-center space-x-4">
                  <div className="w-full md:w-1/2 font-bold text-[14px]  text-gray-500">
                    Created By
                  </div>
                  <div className="w-full py-2 text-gray-700 text-[14px]">
                    {alldata.createdById?.employeeName}
                  </div>
                </div>

                {/* reporter */}

                <div className="flex flex-wrap md:flex-nowrap items-center space-x-4">
                  <div className="w-full md:w-1/2 font-bold text-[14px]  text-gray-500">
                    Reporter By
                  </div>
                  <div className="w-full py-2 text-gray-700 text-[14px]">
                    {alldata?.projectManagerId?.projectManagerName}
                  </div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap items-center space-x-4">
                  <div className="w-full md:w-1/2 font-bold text-[14px]  text-gray-500">
                    Priority
                  </div>
                  <div className="w-full py-2 text-gray-700">
                    <div
                      className={`font-semibold px-2  rounded-md inline-block capitalize
                          ${alldata.priority === "high"
                          ? "text-[#c8212f] bg-[#ffebee] "
                          : alldata.priority === "medium"
                            ? "text-[#e65200] bg-[#ffa60142]"
                            : alldata.priority === "low"
                              ? "text-[#7d6a14] bg-[#ffea0059]"
                              : "text-gray-700 bg-gray-100"
                        }`}
                    >
                      {alldata.priority}
                    </div>
                  </div>
                </div>

                {/* Task Created Date and Time */}
                <div className="flex flex-wrap md:flex-nowrap items-center space-x-4 mt-4">
                  <div className="w-full md:w-1/2 font-bold text-[14px]  text-gray-500">
                    Created Date and Time
                  </div>
                  <div className="w-full py-2 text-gray-700">
                    {new Date(alldata.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* hold notes */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl w-full max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                <h2 className="text-lg font-bold mb-4 text-gray-800">
                  Add Note <span className="text-red-500">*</span>
                </h2>
                <textarea
                  rows="4"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded mb-4"
                  placeholder="Please explain why the project is on hold..."
                ></textarea>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={handleCancel}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleholdSubmit()}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* hold view table */}

          {showPopup && (
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
              onClick={handleClose}
            >
              <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Details</h2>
                  <button
                    className="text-gray-500 hover:text-red-500 text-2xl"
                    onClick={handleClose}
                  >
                    &times;
                  </button>
                </div>

                <table className="min-w-full border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">S.No</th>
                      <th className="p-2 border">Status</th>
                      <th className="p-2 border">Date</th>
                      <th className="p-2 border">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holddata?.length > 0 ? (
                      holddata.map((item, index) => (
                        <tr key={index} className="text-sm text-gray-700">
                          <td className="p-2 border text-center">
                            {index + 1}
                          </td>
                          <td className="p-2 border text-center">
                            <span
                              className={`px-2 py-1 rounded font-semibold ${item.pauseCondition === "hold"
                                ? "text-red-600"
                                : item.pauseCondition === "restart"
                                  ? "text-green-600"
                                  : "text-gray-600"
                                }`}
                            >
                              {capitalizeFirstLetter(item.pauseCondition)}
                            </span>
                          </td>
                          <td className="p-2 border text-center">
                            {item.time ? formatDateTime(item.time) : ""}
                          </td>
                          <td className="p-2 border">
                            {capitalizeFirstLetter(item.note)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="p-4 text-center text-gray-400"
                        >
                          No data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* all logs */}

          {showPopuplogs && (
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
              onClick={handleCloselogs}
            >
              <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Details</h2>
                  <div className="flex flex-col justify-end"></div>
                  <button
                    className="text-gray-500 hover:text-red-500 text-2xl"
                    onClick={handleCloselogs}
                  >
                    &times;
                  </button>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={exportToCSV}
                    className="mb-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md flex items-center gap-2"
                  >
                    <FaFileExport />
                  </button>
                </div>

                <table className="min-w-full border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">S.No </th>
                      <th className="p-2 border">Status</th>
                      <th className="p-2 border">Date</th>
                      <th className="p-2 border">Notes</th>

                      <th className="p-2 border">User</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs?.length > 0 ? (
                      logs.map((item, index) => (
                        <tr key={index} className="text-sm text-gray-700">
                          <td className="p-2 border text-center">
                            {index + 1}
                          </td>
                          <td className="p-2 border text-center">
                            <span
                              className={`px-2 py-1 rounded font-semibold ${item.status === "hold"
                                ? "text-red-600"
                                : item.status === "restart"
                                  ? "text-green-600"
                                  : "text-gray-600"
                                }`}
                            >
                              {/* {capitalizeFirstLetter(
                                item.status.replace(/[^a-zA-Z0-9 ]/g, " ")
                              )} */}
                              {item.status === "start"
                                ? "Tester Started"
                                : capitalizeFirstLetter(
                                  item.status.replace(/[^a-zA-Z0-9 ]/g, " ")
                                )}
                            </span>
                          </td>
                          <td className="p-2 border text-center">
                            {item.updatedAt ? (
                              <>
                                {formatDateTime(item.updatedAt)} <br />
                                {new Date(item.updatedAt).toLocaleTimeString(
                                  "en-IN",
                                  {
                                    timeZone: "Asia/Kolkata",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true,
                                  }
                                )}
                              </>
                            ) : (
                              ""
                            )}
                          </td>
                          <td className="p-2 border">
                            {capitalizeFirstLetter(item.note || "-")}
                          </td>
                          <td className="p-2 border capitalize">
                            {item?.updatedBy?.employeeName}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="p-4 text-center text-gray-400"
                        >
                          No data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Task_view_all;
