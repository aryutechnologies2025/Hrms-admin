import { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Editor } from "primereact/editor";
import { FileUpload } from "primereact/fileupload";
// import { MultiSelect } from "primereact/multiselect";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import axios from "axios";
import Swal from "sweetalert2";
import { capitalizeFirstLetter } from "../StringCaps";
import { Dropdown } from "primereact/dropdown";
import { VscTasklist } from "react-icons/vsc";
import { FaTasks } from "react-icons/fa";
import { GoProjectSymlink } from "react-icons/go";
import { PiFlagBannerFill } from "react-icons/pi";
import { GiPin } from "react-icons/gi";
import { PiFlagPennantFill } from "react-icons/pi";
import { VscDebugConsole } from "react-icons/vsc";
import ButtonLoader from "../ButtonLoader";
import { MdOutlineCancel } from "react-icons/md";
import Footer from "../Footer";
import { IoIosArrowForward } from "react-icons/io";

import { toast, ToastContainer } from "react-toastify";

import { HiExclamationCircle } from "react-icons/hi";
import { IoPauseCircleOutline } from "react-icons/io5";

const TaskList = () => {
  const navigate = useNavigate();
  const employeeDetails = JSON.parse(localStorage.getItem("hrms_employee"));
  // console.log("employeeDetails:", employeeDetails.email);

  const employeemail = employeeDetails.email;
  const employeeId = employeeDetails._id;
  const employeeRole = employeeDetails?.department?.name;
  console.log("employeeRole", employeeRole);

  const [isRestored, setIsRestored] = useState(false);

  const [data, setData] = useState(null);
  console.log("data", data);
  const [error, setError] = useState("");
  const [projectfilter, setProjectfilter] = useState("");
  const [count, setCount] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [taskLoading, setTaskLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  // console.log("count", count);

  const fetchTasks = async (pageNum = 1) => {
    setCount("");
    if (taskLoading) return;
    // setTaskLoading(true);
    if (pageNum === 1) setTaskLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}api/task/particular-all-task-status`,
        {
          params: {
            projectId: projectfilter,
            employeeId: employeeId,
            day: dateFilter,
            searchTerm: searchTerm,
            page: pageNum,
            limit: 10, // or whatever number backend expects
          },
        }
      );

      setCount(response.data.counts);
      console.log("apidata", response);

      const allTasks = response.data.data;
      console.log("allTasks", allTasks);
      const pagination = response.data.pagination;

      const formattedData = {
        columns: {
          todo: {
            id: "todo",
            title: "To Do",
            items: allTasks.taskToDo || [],
          },
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
          done: {
            id: "done",
            title: "Done",
            items: allTasks.taskDone || [],
          },
          block: {
            id: "block",
            title: "Blocked",
            items: allTasks.taskBlock || [],
          },
        },
        columnOrder: ["todo", "inprogress", "inreview", "done", "block"],
      };

      // Handling first page load (reset data) vs appending new data (subsequent pages)
      if (pageNum === 1) {
        setData({
          ...formattedData,
          statusCounts: response.data.data.statusCounts || {},
        });
      } else {
        setData((prevData) => {
          if (!prevData) {
            return {
              ...formattedData,
              statusCounts: response.data.data.statusCounts || {},
            };
          }

          const updated = {
            ...prevData,
            columns: { ...prevData.columns }, // Spread the columns to avoid direct mutation
          };

          console.log("updated", updated);

          // Append new items only if not empty
          for (let key in formattedData.columns) {
            const newItems = formattedData.columns[key].items;
            if (newItems.length > 0) {
              updated.columns[key] = {
                ...updated.columns[key], // Preserve other data in the column
                items: [
                  ...updated.columns[key].items, // Old items
                  ...newItems, // New items
                ],
              };
            }
          }

          // Update statusCounts carefully to prevent overwriting or duplicating data
          updated.statusCounts =
            response.data.data.statusCounts || prevData.statusCounts;

          return updated;
        });
      }

      // Smooth scroll adjustment
      // requestAnimationFrame(() => {
      //   if (scrollContainer) {
      //     const newScrollHeight = scrollContainer.scrollHeight;
      //     const scrollDiff = newScrollHeight - prevScrollHeight;
      //     scrollContainer.scrollTop += scrollDiff; // maintain scroll position
      //   }
      // });

      // Update pagination
      setHasMore(pagination.currentPage < pagination.totalPages);
      setPage(pagination.currentPage);
    } catch (err) {
      console.error("Fetch error:", err?.response || err.message);
      setError("Error fetching tasks.");
    } finally {
      if (pageNum === 1) setTaskLoading(false);
    }
  };

  // scroller call useeffect

  useEffect(() => {
    setData(null);
    setPage(1);
    fetchTasks(1);
  }, [projectfilter, employeeId, dateFilter]);

  // useEffect(() => {
  //   const scrollContainer = document.querySelector(".kanban-scroll");

  //   const handleScroll = () => {
  //     if (
  //       scrollContainer.scrollTop + scrollContainer.clientHeight >=
  //       scrollContainer.scrollHeight - 60
  //     ) {
  //       if (hasMore && !taskLoading) {
  //         fetchTasks(page + 1);
  //       }
  //     }
  //   };

  //   if (scrollContainer) {
  //     scrollContainer.addEventListener("scroll", handleScroll);
  //   }

  //   return () => {
  //     if (scrollContainer) {
  //       scrollContainer.removeEventListener("scroll", handleScroll);
  //     }
  //   };
  // }, [hasMore, taskLoading, page]);
  //  calling task api when user scroll
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
            fetchTasks(page + 1);
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
  // smooth scrolling effect
  // useEffect(() => {
  //   const scrollContainer = document.querySelector(".kanban-scroll");
  //   if (!scrollContainer) return;

  //   const prevHeight = scrollContainer.scrollHeight;

  //   const observer = new MutationObserver(() => {
  //     const newHeight = scrollContainer.scrollHeight;
  //     if (newHeight > prevHeight) {
  //       scrollContainer.scrollTo({
  //         top: prevHeight,
  //         behavior: "smooth", // smooth scroll
  //       });
  //     }
  //   });

  //   observer.observe(scrollContainer, { childList: true, subtree: true });

  //   return () => observer.disconnect();
  // }, [data]);

  useEffect(() => {
    const savedFilters = sessionStorage.getItem("taskListFilters");

    if (savedFilters) {
      const filters = JSON.parse(savedFilters);
      console.log("savedfilters:", filters);
      setProjectfilter(filters?.projectfilter);
      setDateFilter(filters?.dateFilter);
      setSearchTerm(filters?.searchTerm);

      // Clear the stored filters after restoring
      sessionStorage.removeItem("taskListFilters");
      // setTimeout(() => {
      //   fetchTasks()
      // }, 1000);
    } else {
      fetchTasks();
    }
  }, []);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      fetchTasks();
    }, 600); // Adjust delay as needed

    return () => clearTimeout(debounceTimeout); // Cleanup on new keystroke
  }, [projectfilter, dateFilter, searchTerm]);

  const handleNavigate = (item) => {
    const filters = {
      projectfilter: projectfilter,
      dateFilter: dateFilter,
      searchTerm: searchTerm,
    };
    console.log("item", filters);
    sessionStorage.setItem("taskListFilters", JSON.stringify(filters));
    navigate(`/tasklist-details/${item.taskId}`);
    // window.open(`/tasklist-details/${item.taskId}`);

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    // if (destination.droppableId === "done") return;
    // if (source.droppableId === "done") return;

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
      // destItems.splice(destination.index, 0, movedItem);
      destItems.unshift(movedItem);
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
        block: "block",
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
        updatedBy: employeeId,
      };

      try {
        const response = await axios.patch(
          `${API_URL}api/task/updated-status/${movedItem.taskId}`,
          payload
        );
        //       console.log("Dragged Task Object:", movedItem);
        // console.log("Calling PATCH on:", `${API_URL}api/task/updated-status/${movedItem.taskId}`);

        // console.log("Status updated via drag:", response.data);
        toast.success("Status updated successfully");
        fetchTasks();
      } catch (error) {
        console.error("Error updating status via drag:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Something went wrong";

        toast.error(errorMessage);
        fetchTasks();
      }
    }
  };

  // const n  avigate = useNavigate();

  // console.log("employeeemail:", employeeemail);

  // const [data, setData] = useState(initialData);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };
  const closeAddModal = () => {
    setIsAnimating(false);
    setProjectName("");
    setProjecttiltle("");
    setProjectDescription("");
    setStatus("");

    setPriority("");
    setUploadedFiles([]);
    setCurrentDate(new Date().toISOString().split("T")[0]);
    setErrors({});
    setTimeout(() => setIsAddModalOpen(false), 250);
  };

  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    // console.log(today)

    setCurrentDate(today);
  }, []);

  // handlsumbit
  const [dueDate, setDueDate] = useState("");
  const [projectname, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projecttile, setProjecttiltle] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  // console.log("errors",errors)
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState([]);

  const statusMap = {
    todo: "todo",
    inprogress: "in-progress",
    inreview: "in-review",
    done: "done",
    block: "block",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedProject = project.find((role) => role.value === projectname);
    const projectId = selectedProject?.value || "";
    setButtonLoading(true);
    try {
      const formData = new FormData();
      formData.append("startDate", currentDate);
      formData.append("dueDate", dueDate);
      formData.append("projectName", projectname);
      formData.append("description", projectDescription);
      formData.append("status", "todo");
      formData.append("title", projecttile);
      formData.append("projectManagerId", projectManagerName);
      formData.append("assignedTo", selectedEmployeeDetails);
      formData.append("priority", priority);
      formData.append("projectId", projectId);
      // formData.append("createdBy", employeemail);
      // formData.append("createdByName", employeeDetails.employeeName);
      formData.append("createdById", employeeId);

      uploadedFiles.forEach((file) => {
        formData.append("document[]", file);
      });

      // formData.append(
      //   "taskDetails",
      //   JSON.stringify({
      //     title: projecttile,
      //     description: projectDescription,
      //     assignedTo: employeeemail,
      //     projectId,
      //     projectName: projectname,
      //     status,
      //     priority,
      //     dueDate: currentDate,
      //   })
      // );

      const response = await axios.post(
        `${API_URL}api/task/create-task`,
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
      fetchTasks();
      setButtonLoading(false);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        console.log("errors", err.response.data.errors);
      } else {
        console.error("Error submitting form:", err);
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Something went wrong while creating the task.",
        });
      }
      setButtonLoading(false);
    }
  };
  const [project, setProject] = useState([]);
  const [projectManagerName, setProjectManagerName] = useState("");

  const handleRoleChange = (value) => {
    setProjectName(value);
    assignedToList(value);

    const selectedRole = project.find((role) => role.value === value);

    if (selectedRole) {
      setProjectManagerName(selectedRole.projectManager || "");
    } else {
      setProjectManagerName("");
    }
  };

  const fetchEmployeeList = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/employees/all-employees`,
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

      setEmployeeList(employeeName);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProject = async () => {
    const empId = JSON.parse(localStorage.getItem("hrms_employee"))._id;
    try {
      const response = await axios.get(`${API_URL}api/project/view-projects`);
      // console.log(response);
      if (response.data.success) {
        const filterProject = response.data.data.filter(
          (data) =>
            data.teamMembers.some((member) => member === empId) ||
            data.projectManager === empId
        );
        const project = filterProject.map((emp) => ({
          label: emp.name,
          value: emp._id,
          teamMembers: emp.teamMembers,
          projectManager: emp.projectManager,
        }));
        console.log(project);

        setProject(project);
      } else {
        setErrors("Failed to fetch project.");
      }
    } catch (err) {
      setErrors("Failed to fetch project.");
    }
  };

  useEffect(() => {
    // fetchProjectall();
    fetchEmployeeList();
    fetchProject();
  }, []);

  // employee

  const [employeeOption, setEmployeeOption] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  // console.log("employeeemail", employeeOption);

  const assignedToList = (projectName) => {
    if (projectName.length > 0) {
      const filterproject = project.filter((data) => data.value == projectName);
      console.log("hello", filterproject);

      // const teamMembers = filterproject[0].teamMembers || [];
      // const projectManager = filterproject[0].projectManager;

      const filteredEmployees = employeeList.filter(
        (emp) =>
          filterproject[0].teamMembers.includes(emp.value) ||
          filterproject[0].projectManager.includes(emp.value)
      );

      setEmployeeOption(filteredEmployees);
    } else {
      setEmployeeOption("");
    }
  };

  const clearFilter = () => {
    setProjectfilter("");
    setDateFilter("");
    setSearchTerm("");
  };

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

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setUploadedFiles((prev) => [...prev, ...selectedFiles]);
    fileInputRef.current.value = ""; // reset input to clear file preview
  };

  useEffect(() => {
    // Add or remove the 'overflow-hidden' class on the <body> based on modal state
    if (isAddModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Clean up on component unmount
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isAddModalOpen]);

  return (
    <div className="w-full">
      <ToastContainer />
      {taskLoading ? (
        <div className="flex justify-center items-center w-full h-screen">
          <div className="w-12 h-12 border-4 border-blue-500 rounded-full animate-ping"></div>
        </div>
      ) : (
        <div className=" p-5 w-full mt-10">
          <div className="flex gap-2 items-center cursor-pointer">
            <p className="text-sm text-blue-500">Task List</p>
            <p>{">"}</p>
          </div>
          <div className="flex justify-around  gap-8 my-8 ">
            <div className="flex justify-between   border px-8 py-6 rounded-lg shadow-sm w-full">
              <div className="">
                <h2 className="text-[16px] text-gray-500  font-semibold">
                  Total Project
                </h2>
                <p className="text-[14px]] mt-2 text-gray-500 ">
                  {count?.totalProjectCount}
                </p>
              </div>
              <div className="flex">
                <span className="text-blue-500 w-12 h-12 text-2xl bg-blue-200/30  rounded-full flex justify-center items-center">
                  <GoProjectSymlink />
                </span>
              </div>
            </div>
            <div className="flex justify-between  border px-8 py-6 rounded-lg shadow-sm w-full">
              <div className="">
                <h2 className="text-[16px] text-gray-500   font-semibold">
                  Total Tasks
                </h2>
                <p className="text-[14px] mt-2 text-gray-500 ">
                  {count?.totalUserTasks}
                </p>
              </div>
              <div className="flex">
                <span className="text-blue-500 w-12 h-12 text-2xl bg-blue-200/30  rounded-full flex justify-center items-center">
                  {" "}
                  <VscTasklist />
                </span>
              </div>
            </div>
            <div className="flex justify-between  border px-8 py-6 rounded-lg shadow-sm w-full">
              <div className="">
                <h2 className="ttext-[16px] text-gray-500   font-semibold">
                  Today Tasks
                </h2>
                <p className="text-[14px] mt-2 text-gray-500 ">
                  {count?.todayTasks}
                </p>
              </div>
              <div className="flex">
                <span className="text-blue-500 w-12 h-12 text-2xl bg-blue-200/30  rounded-full flex justify-center items-center">
                  {" "}
                  <FaTasks />
                </span>
              </div>
            </div>
          </div>

          {/* add */}

          <div className="flex justify-between mt-8 mb-6">
            <div className="flex gap-4">
              <Dropdown
                value={projectfilter}
                onChange={(e) => {
                  setProjectfilter(e.value);
                }}
                options={project}
                optionLabel="label"
                placeholder="Select a Project"
                className="w-[300px]  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="date"
                className="px-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />

              {employeeRole === "Software Testing" && (
                <input
                  type="text"
                  placeholder="Search by Task Id/Assignee..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-2 w-[250px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 "
                />
              )}
              {employeeRole !== "Software Testing" && (
                <input
                  type="text"
                  placeholder="Search by Task Id"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-2 w-[250px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 "
                />
              )}

              {/* <button
            className="bg-blue-600 text-white  rounded-lg px-4"
            onClick={fetchTasks}
          >
            Search
          </button> */}
              <button
                className="bg-gray-500  hover:bg-gray-600 duration-300  text-white rounded-lg px-4 py-2"
                onClick={clearFilter}
              >
                All Clear
              </button>
            </div>
            {employeeRole === "Software Testing" && (
              <button
                onClick={openAddModal}
                className="bg-blue-500 hover:bg-blue-600 duration-300  px-3 py-2 text-white w-20 rounded-2xl"
              >
                Add
              </button>
            )}
          </div>

          {isAddModalOpen && (
            <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
              {/* Overlay */}
              <div className="absolute inset-0 " onClick={closeAddModal}></div>

              <div
                className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[55vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${
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

                <div className="px-5 lg:px-14 py-10">
                  <div className="flex justify-between items-center gap-2 ">
                    <h2 className="text-xl font-semibold mb-4">Add Task</h2>
                  </div>

                  <div className=" flex  gap-4 w-full">
                    <div className="my-2 w-full">
                      <label
                        htmlFor="employee_name"
                        className="block text-sm font-medium mb-2"
                      >
                        Current Date
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
                    <div className="my-2 w-full">
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
                        onChange={(e) => setDueDate(e.target.value)}
                        min={currentDate}
                      />
                    </div>
                  </div>

                  <div className="my-2 w-full">
                    <p className="block text-sm font-medium mb-2">
                      Project <span className="text-red-500">*</span>
                    </p>

                    <Dropdown
                      value={projectname}
                      onChange={(e) => {
                        handleRoleChange(e.value);
                      }}
                      options={project}
                      optionLabel="label"
                      filter
                      appendTo="self"
                      placeholder="Select a Project"
                      className="w-full  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.projectName && (
                      <p className="text-red-500 text-sm mb-4">
                        {errors.projectName}
                      </p>
                    )}
                  </div>

                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium mb-2"
                  >
                    Task Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={projecttile}
                    onChange={(e) => setProjecttiltle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

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
                  {errors.description && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.description}
                    </p>
                  )}

                  <div className="flex gap-4">
                    <div className="my-2 w-full">
                      <label
                        htmlFor="employee_name"
                        className="block text-sm font-medium mb-2"
                      >
                        Assign To
                      </label>

                      <Dropdown
                        value={selectedEmployeeDetails}
                        onChange={(e) =>
                          setSelectedEmployeeDetails(e.target.value)
                        }
                        options={employeeOption}
                        optionLabel="label"
                        filter
                        appendTo="self"
                        placeholder="Select Employees"
                        maxSelectedLabels={3}
                        className="w-full  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        display="chip"
                      />
                      {errors.assignedTo && (
                        <p className="text-red-500 text-sm mb-4">
                          {errors.assignedTo}
                        </p>
                      )}
                    </div>

                    <div className="w-full">
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
                        <p className="text-red-500 text-sm mb-4">
                          {errors.priority}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="">
                    <div className="w-full">
                      {/* Hidden input */}
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
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded mt-6"
                      >
                        Upload Files
                      </button>
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
                    </div>

                    <div className="flex justify-end mt-4 gap-2">
                      <button
                        onClick={closeAddModal}
                        className=" bg-red-100  hover:bg-red-200 text-red-600   px-4 md:px-5 py-2 font-semibold rounded-full"
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                        onClick={handleSubmit}
                      >
                        {buttonLoading ? <ButtonLoader /> : "Submit"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DragDropContext onDragEnd={onDragEnd}>
            {/* Outer Scroll (Vertical) */}
            <div className="kanban-scroll h-[600px] w-full overflow-y-auto overflow-x-hidden scroll-smooth custom-scrollbar pr-6">
              {/* Inner Scroll (Horizontal Columns) */}
              <div className="flex gap-4 min-w-max ">
                {data &&
                  data.columnOrder.map((columnId) => {
                    console.log("columnId", data);

                    const column = data.columns[columnId];
                    const apiCount =
                      data.statusCounts?.[statusMap[columnId]] || 0;

                    return (
                      <div
                        key={column.id}
                        className="w-[19.2%] bg-gray-100/80 shadow-sm rounded-md px-2 flex-shrink-0 relative flex flex-col"
                      >
                        {/* Sticky Header */}
                        <h2 className="p-2 pt-2 flex items-center gap-1 mb-2 border-b-2 rounded-t-lg-md border-gray-300 sticky top-0 bg-gray-100/90 backdrop-blur-sm z-10">
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

                        <Droppable droppableId={column.id} className="">
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="h-full"
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
                                        <div className="flex flex-col gap-2">
                                          <span className="truncate text-wrap text-[14px] flex items-center justify-between">
                                            {item.title.length > 16
                                              ? `${item.title.substring(
                                                  0,
                                                  16
                                                )}...`
                                              : item.title}
                                            {item.testerStatus == 1 && (
                                              <VscDebugConsole
                                                className="text-2xl text-green-950"
                                                title="Testing"
                                              />
                                            )}
                                            {item.pauseComments?.length > 0 &&
                                              item.pauseComments[
                                                item.pauseComments.length - 1
                                              ]?.pauseCondition === "hold" && (
                                                <IoPauseCircleOutline
                                                  className="text-xl text-red-700"
                                                  title="On Hold"
                                                />
                                              )}
                                          </span>

                                          <div>
                                            <span
                                              className={`text-xs px-2 py-1 rounded-full font-medium shadow-sm ${
                                                item.assignedTo?.employeeName
                                                  ? "bg-gray-100 text-gray-700"
                                                  : "bg-red-100 text-red-700"
                                              }`}
                                            >
                                              {item.assignedTo?.employeeName ||
                                                "Not Assigned"}
                                            </span>
                                          </div>

                                          <div>
                                            <span className="text-[10px] bg-blue-100 rounded-full px-1 py-[2px]">
                                              {item.projectId?.name}
                                            </span>
                                          </div>

                                          <div className="flex justify-between w-full">
                                            <span className="text-sm flex gap-2 items-center">
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
      <Footer />
    </div>
  );
};

export default TaskList;
