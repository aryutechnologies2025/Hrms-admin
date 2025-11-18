import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useEffect, useState } from "react";
import { BsBellFill } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { BsCalendar4 } from "react-icons/bs";
import { CiDeliveryTruck, CiBoxList } from "react-icons/ci";
import sample from "../../assets/sample.jpg";
import Footer from "../Footer";
import axios from "axios";
import { API_URL } from "../../config";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css"; // PrimeReact theme
import "primereact/resources/primereact.min.css"; // PrimeReact core CSS
import { InputText } from "primereact/inputtext";
import Mobile_Sidebar from "../Mobile_Sidebar";
import Loader from "../Loader";
import { TfiPencilAlt } from "react-icons/tfi";
import Swal from "sweetalert2";

import { MdOutlineDeleteOutline } from "react-icons/md";

const Request_details = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [approvedRejectedList, setApprovedRejectedList] = useState([]);
  // console.log("approvedRejectedList",approvedRejectedList)

  const [pendingRequestList, setPendingRequestList] = useState([]);
  console.log("pendingRequestList",pendingRequestList);

  const [loading, setLoading] = useState(true); // State to manage loading
  const [leaveRequestNotesToEmployee, setLeaveRequestNotesToEmployee] =
    useState("");

  const [selectedId, setSelectedId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [employeeRequest, setEmployeeRequest] = useState({
    name: "",
    subject: "",
    message: "",
    status: "",
    notes: "",
  });

  const handleEditClick = (rowData) => {
    setSelectedId(rowData._id);
    setEmployeeRequest({
      name: rowData?.employeeId?.employeeName,
      subject: rowData?.subject,
      message: rowData?.message,
      status: rowData?.status,
      notes: rowData?.notes,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      let response = await axios.put(
        `${API_URL}/api/employeeRequest/update-employeerequest/${selectedId}`,
        {
          status: employeeRequest.status,
          notes: employeeRequest.notes,
        }
      );

      // console.log("Response:", response.data);
      setShowModal(false);

      Swal.fire({
        icon: "success",
        title: "Updated successfully!",
        text: "Employee Request has been updated.",
        confirmButtonText: "OK",

        // Reload the page after Swal confirmation
      });
      fetchApproveRejectList();
    } catch (error) {
      console.error("API Error:", error);

      // Optional: Show error alert
      Swal.fire({
        icon: "error",
        title: "Update failed!",
        text: "Something went wrong. Please try again.",
      });
    }
  };

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
          `${API_URL}/api/employeerequest/delete-employeerequest/${id}`
        );
        Swal.fire("Deleted!", "The request has been deleted.", "success");

        setApprovedRejectedList((prev) =>
          prev.filter((item) => item._id !== id)
        );
        // fetchProject();
      } catch (err) {
        console.error("Failed to delete:", err);
        Swal.fire("Error", "There was an error deleting the request.", "error");
      }
    } else {
      Swal.fire(
        "Cancelled",
        "Request has been successfully aborted. :)",
        "info"
      );
    }
  };

  const columns = [
    {
      field: "profile",
      header: "Employee Id",
      body: (rowData) => rowData.employeeId?.employeeId || "-",
    },
    {
      field: "updatedAt",
      header: "Date",
      body: (rowData) => {
    const d = new Date(rowData.updatedAt);      // string → Date object
    return d.toLocaleDateString("en-GB").replace(/\//g, "-");
    // output: 15-09-2025
  },
      // body: (rowData) => rowData.employeeId?.employeeName || "-",
    },
    {
      field: "employeeName",
      header: "Name",
      body: (rowData) => rowData.employeeId?.employeeName || "-",
    },
    // {
    //   field: "role_name",
    //   header: "Role",
    // },
    { field: "subject", header: "Subject" },
    {
      field: "status",
      header: "Status",
      body: (rowData) => {
        const textAndBorderColor = rowData.status
          .toLowerCase()
          .includes("new leave")
          ? "text-blue-600 border rounded-full border-blue-600"
          : rowData.status.toLowerCase().includes("approved")
          ? "text-green-600 border rounded-full border-green-600"
          : rowData.status.toLowerCase().includes("rejected")
          ? "text-red-600 border rounded-full border-red-600"
          : rowData.status.toLowerCase().includes("later")
          ? "text-yellow-600 border rounded-full border-yellow-600"
          : "text-red-600 border rounded-full border-red-600";
        return (
          <div
            style={{
              display: "inline-block",
              padding: "2px",
              // color: textAndBorderColor,
              // border: `1px solid ${textAndBorderColor}`,

              textAlign: "center",
              width: "100px",
              fontSize: "16px",
            }}
            className={`capitalize ${textAndBorderColor}`}
          >
            {rowData.status}
          </div>
        );
      },
    },
    {
      field: "notes",
      header: "Notes",
      body: (rowData) => rowData.notes || "-",
    },
    {
      field: "",
      header: "Action",
      body: (rowData) => (
        <div className="flex justify-center gap-4 text-xl">
          <TfiPencilAlt
            className="text-blue-600 cursor-pointer hover:text-blue-800"
            onClick={() => handleEditClick(rowData)}
          />

          <MdOutlineDeleteOutline
            className="text-red-600 cursor-pointer hover:text-red-800"
            onClick={() => handleDelete(rowData._id)}
          />
        </div>
      ),
    },
  ];

  const [addLeaveRequestModalOpen, setAddLeaveRequestModalOpen] =
    useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const openAddLeaveRequestModal = () => {
    if (pendingRequestList.length > 0) {
      setAddLeaveRequestModalOpen(true);
      setTimeout(() => setIsAnimating(true), 10); // Delay to trigger animation
    }
  };
  const closeAddLeaveRequestModal = () => {
    setExpandedIndex(null);
    setIsAnimating(false);
    setTimeout(() => setAddLeaveRequestModalOpen(false), 250); // Delay to trigger animation
  };

  const [expandedIndex, setExpandedIndex] = useState(null);
  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const fetchApproveRejectList = async () => {
    try {
      let response = await axios.get(
        `${API_URL}/api/employeeRequest/view-employeerequest`
      );
      setApprovedRejectedList(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchPendingRequestList = async () => {
    try {
      setLoading(true);
      let response = await axios.get(
        `${API_URL}/api/employeeRequest/view-employeerequest`,
        {
          // headers: {
          //   Authorization: `Bearer ${localStorage.getItem("token")}`,
          // },
          params: {
            type: "pending",
          },
        }
      );
      setPendingRequestList(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApproveRejectList();
    fetchPendingRequestList();
  }, []);

  const onCLickApprovedOrRejectButton = async (status, id) => {
    try {
      let response = await axios.put(
        `${API_URL}/api/employeeRequest/update-employeerequest/${id}`,
        {
          status: status,
          notes: leaveRequestNotesToEmployee,
        }
      );
      fetchPendingRequestList();
      addLeaveRequestModalOpen();
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeSelect = async (e) => {
    try {
      let response = await axios.get(
        `${API_URL}/api/emp-attendances/leave-filter`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            leave_type: e.target.value,
          },
        }
      );

      // console.log(response.data.data);
      setApprovedRejectedList(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add or remove the 'overflow-hidden' class on the <body> based on modal state
    if (addLeaveRequestModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Clean up on component unmount
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [addLeaveRequestModalOpen]);

  const [isVisible, setIsVisible] = useState(true);

  const handleReject = (status, id) => {
    setIsVisible(false);
    setTimeout(() => {
      onCLickApprovedOrRejectButton(status, id);
      setIsVisible(true);
    }, 300);
  };

  const handleApprove = (status, id) => {
    setIsVisible(false);
    setTimeout(() => {
      onCLickApprovedOrRejectButton(status, id);
      setIsVisible(true);
    }, 300);
  };

  const handlelater = (status, id) => {
    setIsVisible(false);
    setTimeout(() => {
      onCLickApprovedOrRejectButton(status, id);
      setIsVisible(true);
    }, 300);
  };

  const [leave, setLeaves] = useState([]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/leaveType/get-leavetype `
      );
      // console.log(response);
      if (response.data.success) {
        setLeaves(response.data.data);
        setLoading(false);
      } else {
        setErrors("Failed to fetch roles.");
      }
    } catch (err) {
      setErrors("Failed to fetch roles.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  function convertTo24Hour(timeStr) {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes, seconds] = time.split(":");

    hours = parseInt(hours, 10);
    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  }

  let navigate = useNavigate();

  return (
    <div className="flex flex-col justify-between overflow-x-hidden bg-gray-100 px-5 pt-2 md:pt-5 min-h-screen  w-screen">
      {loading ? (
        <Loader />
      ) : (
        <>
      <div>
        <Mobile_Sidebar />

        {/* breadcrumb */}
        <div className="flex gap-2 items-center cursor-pointer mt-6">
          <p
            className="text-sm text-gray-500"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </p>
          <p>{">"}</p>

          <p className="text-sm text-blue-500">Request</p>
        </div>

        <div>
          <div className="flex flex-wrap md:flex-row justify-between">
            <p className="text-2xl md:text-3xl font-semibold mt-3 md:mt-8">
              Request
            </p>

            <div className="flex items-center gap-5 justify-end mt-4 md:mt-8 ">
              
              <button
                onClick={openAddLeaveRequestModal}
                className="md:ml-0 w-fit cursor-pointer px-5 md:px-7 py-0.5 md:py-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 font-medium"
              >
                {pendingRequestList?.length > 0
                  ? pendingRequestList?.length
                  : "0"}{" "}
                {pendingRequestList?.length > 0 ? "requests" : "request"}
              </button>
            </div>
          </div>
        </div>

        <div className="w-full mx-auto relative">
          {/* Global Search Input */}
          <div className="mt-3 md:mt-8 flex md:justify-end">
            <InputText
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search"
              className="px-2 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Table Container with Relative Position */}
          <div className="relative mt-4">
            {/* Loader Overlay */}
            {loading && <Loader />}

            {/* DataTable */}
            <DataTable
              className="mt-8"
              value={approvedRejectedList}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 20]}
              globalFilter={globalFilter}
              globalFilterFields={[
                "employeeId.employeeId",
                "employeeId.employeeName",
              ]}
              showGridlines
              resizableColumns
            >
              {columns.map((col, index) => (
                <Column
                  key={index}
                  field={col.field}
                  header={col.header}
                  body={col.body}
                  style={{
                    minWidth: "150px",
                    wordWrap: "break-word",
                    overflow: "hidden",
                    whiteSpace: "normal",
                  }}
                />
              ))}
            </DataTable>
          </div>
        </div>

        {addLeaveRequestModalOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
            {/* Overlay */}
            <div
              className="absolute inset-0 "
              onClick={closeAddLeaveRequestModal}
            ></div>

            <div
              className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[70vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${
                isAnimating ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full  mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                title="Toggle Sidebar"
                onClick={closeAddLeaveRequestModal}
              >
                <IoIosArrowForward className="w-3 h-3" />
              </div>

              <div className="px-5 lg:px-14 py-10">
                <p className="text-2xl md:text-3xl font-medium">
                  Employee Request
                </p>

                {pendingRequestList.map((item, index) => (
                  <div className="mt-5" key={index}>
                    {/* Accordion Header */}
                    <div
                      onClick={() => toggleAccordion(index)}
                      className="cursor-pointer bg-gray-100 flex flex-wrap justify-between items-center px-2 py-2 sm:px-4 sm:py-4 rounded-xl border-2 border-gray-200"
                    >
                      <div className="flex flex-col sm:flex-row gap-2">
                        <span className="font-normal md:font-medium">
                          {item?.employeeId?.employeeName}
                        </span>

                        <span className="font-normal md:font-medium">
                          {item?.subject}
                        </span>
                      </div>
                        <div className="flex gap-3">
                       <div>
                          {new Date(item.updatedAt).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                            weekday: "long",
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          })}
                        </div>

                      <svg
                        className={`w-5 h-5 transition-transform ${
                          expandedIndex === index ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                      </div>
                    </div>

                    {/* Accordion Content */}
                    {expandedIndex === index && (
                      <div
                        className={`flex flex-col px-5 gap-3 mt-5 transition ease-out duration-1000 ${
                          isVisible ? "opacity-100 " : "opacity-0 "
                        }`}
                      >
                        {/* Content here */}
                        <div className="flex flex-col lg:flex-row gap-1 justify-between">
                          {/* <div className="flex flex-col"> */}
                          <label
                            className="font-medium text-sm"
                            htmlFor="jobTitle"
                          >
                            EMPLOYEE NAME
                          </label>
                          {/* <p className="text-sm">Employee name</p> */}
                          {/* </div> */}
                          <input
                            value={item?.employeeId?.employeeName}
                            type="text"
                            readOnly
                            id="jobTitle"
                            className="border-2 rounded-xl px-4 text-sm border-gray-300 outline-none h-10 w-full md:w-96"
                          />
                        </div>

                        {/* <div className="flex flex-col lg:flex-row gap-1 justify-between">
                          <label
                            className="font-medium text-sm"
                            htmlFor="companyName"
                          >
                            EMPLOYEE DEPARTMENT
                          </label>
                    
                          <input
                            type="text"
                            value={item?.employeeId?.roleId?.departmentId?.name}
                            readOnly
                            id="companyName"
                            className="border-2 rounded-xl px-4 text-sm border-gray-300 outline-none h-10 w-full md:w-96"
                          />
                        </div> */}

                        {/* <div className="flex flex-col lg:flex-row gap-1 justify-between">
                          <label
                            className="font-medium text-sm"
                            htmlFor="companyName"
                          >
                            EMPLOYEE ROLE
                          </label>
                         
                          <input
                            type="text"
                            id="companyName"
                            value={item?.employeeId?.roleId?.name}
                            readOnly
                            className="border-2 rounded-xl px-4 text-sm border-gray-300 outline-none h-10 w-full md:w-96"
                          />
                        </div> */}

                        <div className="flex flex-col lg:flex-row gap-1 justify-between">
                          {/* <div className="flex flex-col"> */}
                          <label
                            className="font-medium text-sm"
                            htmlFor="previousSalary"
                          >
                            Subject
                          </label>
                          {/* <p className="text-sm">days</p> */}
                          {/* </div> */}
                          <input
                            type="text"
                            id="previousSalary"
                            readOnly
                            value={item?.subject}
                            className="border-2 rounded-xl px-4 text-sm border-gray-300 outline-none h-10 w-full md:w-96"
                          />
                        </div>

                        <div className="flex flex-col lg:flex-row gap-1 justify-between">
                          {/* <div className="flex flex-col"> */}
                          <label
                            className="font-medium text-sm"
                            htmlFor="responsibilities"
                          >
                            Message
                          </label>
                          {/* <p className="text-sm">Short description</p> */}
                          {/* </div> */}

                          {/* <div className=" border-2 border-gray-300 rounded-xl  w-full md:w-96"> */}
                          <textarea
                            cols="2"
                            readOnly
                            className="border-2 rounded-xl py-2 px-4 h-[150px] text-sm border-gray-300 outline-none  w-full md:w-96"
                            value={item.message}
                          />
                          {/* </div> */}
                        </div>

                        <div className="flex flex-col lg:flex-row gap-1 justify-between">
                          <label
                            className="font-medium text-sm "
                            htmlFor="responsibilities"
                          >
                            NOTES
                          </label>
                          {/* <p className="text-sm">Short description</p> */}

                          <textarea
                            cols="2"
                            placeholder="Add notes to employee"
                            className="border-2 text-sm rounded-xl py-2 px-4  border-gray-300 outline-none  w-full md:w-96"
                            value={leaveRequestNotesToEmployee}
                            onChange={(e) =>
                              setLeaveRequestNotesToEmployee(e.target.value)
                            }
                          />
                        </div>

                        <div className="flex flex-wrap md:justify-end gap-2 md:gap-5">
                          <button
                            onClick={
                              () => handleApprove("approved", item._id)
                              // onCLickApprovedOrRejectButton("approved", item.id)
                            }
                            className="px-8 py-2 text-sm rounded-full bg-green-600 font-bold text-white"
                          >
                            Approve
                          </button>
                          {/* <button
                            onClick={() =>
                              onCLickApprovedOrRejectButton("rejected", item.id)
                            }
                            className="px-8 py-2 text-sm rounded-full bg-red-500 font-bold text-white"
                          >
                            Reject
                          </button> */}

                          <button
                            onClick={() => handleReject("rejected", item._id)}
                            className="px-8 py-2 text-sm rounded-full bg-red-500 font-bold text-white hover:bg-red-600 transition-all"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handlelater("later", item._id)}
                            className="px-8 py-2 text-sm rounded-full bg-yellow-500 font-bold text-white hover:bg-yellow-600 transition-all"
                          >
                            Later
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* edit request popup */}
        {showModal && (
          <div
            onClick={() => setShowModal(false)}
            className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-lg px-8 p-6 w-[600px] overflow-y-auto h-[580px]"
            >
              <h2 className="text-xl font-semibold mb-4">Edit Request</h2>

              <div className="flex justify-between gap-4 w-full">
                <div className=" w-full">
                  <label className="block mb-1 font-medium">
                    Employee Name
                  </label>
                  <input
                    className="w-full border-2 rounded-lg border-gray-300  px-3 py-2"
                    value={employeeRequest.name}
                    // onChange={(e) => setSubleavetype(e.target.value)}
                    readOnly
                    disabled
                  />
                </div>

                <div className=" w-full">
                  <label className="block mb-1 font-medium">Subject</label>
                  <input
                    className="w-full border-2 rounded-lg border-gray-300  px-3 py-2"
                    value={employeeRequest.subject}
                    // onChange={(e) => setSubleavetype(e.target.value)}
                    readOnly
                    disabled
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="block mb-1 font-medium">Message</label>
                <textarea
                  className="w-full border-2 rounded-lg border-gray-300  px-3 py-2"
                  rows="3"
                  value={employeeRequest.message}
                  // onChange={(e) => setTextareaValue(e.target.value)}
                  readOnly
                  disabled
                />
              </div>

              <div className="mt-3">
                <label className="block mb-1 font-medium">Notes</label>
                <textarea
                  className="w-full border-2 rounded-lg border-gray-300  px-3 py-2"
                  rows="3"
                  value={employeeRequest?.notes}
                  onChange={(e) =>
                    setEmployeeRequest({
                      ...employeeRequest,
                      notes: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mt-3">
                <label htmlFor="">Status</label>
                <select
                  className="w-full border-2 rounded-lg capitalize border-gray-300  px-3 py-2"
                  value={employeeRequest.status}
                  onChange={(e) =>
                    setEmployeeRequest({
                      ...employeeRequest,
                      status: e.target.value,
                    })
                  }
                >
                  {["approved", "rejected", "later"].map((data, index) => (
                    <option key={index} value={data}>
                      {data}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-5">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                >
                  Update
                </button>
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

export default Request_details;
