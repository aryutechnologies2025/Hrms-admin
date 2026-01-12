import React, { useState, useEffect, useRef, useMemo } from "react";

import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
DataTable.use(DT);
import axios from "../../api/axiosConfig";
import { API_URL } from "../../config";
// import { capitalizeFirstLetter } from "../../StringCaps";
import { TfiPencilAlt } from "react-icons/tfi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FileUpload } from "primereact/fileupload";
import { MultiSelect } from "primereact/multiselect";
import { FaEye } from "react-icons/fa";
import { Editor } from "primereact/editor";
import { FaTrash } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { Dropdown } from "primereact/dropdown";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import Loader from "../Loader";
import { FaLink } from "react-icons/fa";
import { VscTasklist } from "react-icons/vsc";
import { FaTasks } from "react-icons/fa";
import { GoProjectSymlink } from "react-icons/go";
import { LuLink } from "react-icons/lu";
import { useDateUtils } from "../../hooks/useDateUtils";
import { capitalizeFirstLetter } from "../../utils/StringCaps";
import { toast, ToastContainer } from "react-toastify";
// import { set } from "react-datepicker/dist/date_utils";
// import { set } from "react-datepicker/dist/date_utils";
// import { set } from "react-datepicker/dist/date_utils";

const Bidding_details = () => {
  // const location = useLocation();
  // const ids = window.location.pathname.split("/")[2]
  // console.log("rowdeatsils",ids);
  const navigate = useNavigate();
  const formatDateTime = useDateUtils();

  // const [ids, setIds] = useState([]);
  //   console.log("ids",ids);

  // useEffect(() => {
  //   // Retrieve IDs from localStorage when the page loads
  //   const storedIds = localStorage.getItem("biddingIds");

  //   if (storedIds) {
  //     setIds(JSON.parse(storedIds));

  //   }
  // }, []);

  // const location = useLocation();

  const employeeIds = window.location.pathname.split("/")[2];
  // console.log("window.location.pathname", employeeIds);

  // Fetch roles from the API
  useEffect(() => {
    fetchProject();
  }, []);

  useEffect(() => {
    fetchAccTechList();
  }, []);

  //   const [status, setStatus] = useState("");
  const storedDetatis = localStorage.getItem("hrmsuser");
  const parsedDetails = JSON.parse(null);
  const userid = parsedDetails ? parsedDetails.id : null;
  const [errors, setErrors] = useState({});
   const [isAnimating, setIsAnimating] = useState(false);
  const [accountdetails, setAccountdetails] = useState([]);
  // console.log("accountdetails", accountdetails);
  const [loading, setLoading] = useState(true);
  const [carddata, setCarddata] = useState([]);
  const [editid, setEditid] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [salesdate, setSalesDate] = useState("");
    const [biddingDetails, setBiddingDetails] = useState({
    _id: "",
    date: "",
    account: "",
    client: "",
    employeeId: "",
    link: "",
    reply: "",
    status: "",
    technology: "",
    noOfConnections: "",
    noOfboots: "",
    country: "",
    state: "",
    timezone: "",
    salesdate: "",
  });
  // console.log("carddata", carddata);
  const getFirstDayOfMonth = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    return `${year}-${month}-01`;
  };

  const getToday = () => {
    return new Date().toISOString().split("T")[0];
  };

  const [accountBidderOptions, setAccountBidderOptions] = useState(null);
  const [technologyBidderOptions, setTechnologyBidderOptions] = useState(null);
  const [accountBidder, setAccountBidder] = useState(null);
  // console.log("technologyBidderOptions", technologyBidderOptions);
  const [accountfilter, setAccountfilter] = useState("");
  const [techfilter, setTechfilter] = useState("");
  const [fromDate, setFromDate] = useState(getFirstDayOfMonth());
  const [toDate, setToDate] = useState(getToday());
  const [createdBy, setCreatedBy] = useState("");
  const [statusfilter, setStatusfilter] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  // console.log("selectedInvoiceId", selectedInvoiceId);
  
  const fetchProject = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/bidder/view-employee-bidder`,
        {
          withCredentials: true,
          params: {
            account: accountfilter,
            technology: techfilter,
            status: statusfilter,
            fromDate: fromDate,
            toDate: toDate,
            createdBy: createdBy,
          },
        }
      );
      // console.log(response);
      if (response.data.success) {
        setAccountdetails(response.data.data);
        setCarddata(response.data?.AllTotalDetails);
        setLoading(false);
      } else {
        setErrors("Failed to fetch roles.");
      }
    } catch (err) {
      setErrors("Failed to fetch roles.");
      setLoading(false);
    }
  };

  const handleSave = async (roleId) => {
     const {
       date,
       account,
       client,
       employeeId,
       link,
       reply,
       status,
       technology,
       noOfConnections,
     } = biddingDetails;
     console.log(roleId);
     // if (biddingDetails.name.length <= 0) {
     //   setErrors((prevErrors) => ({
     //     ...prevErrors,
     //     name: ["Role name is required"],
     //   }));
     //   return;
     // }
 
     try {
       // Assuming you're sending a PUT request to update the role
       await axios.put(`${API_URL}/api/bidder/edit-employee-bidder/${roleId}`, {
         date,
         account,
         client,
         employeeId,
         link,
         reply,
         status,
         technology,
         noOfConnections: noOfConnections,
         // created_by: userid,
       }, { withCredentials: true });
 
       setBiddingDetails({
         date: "",
         account: "",
         client: "",
         employeeId: "",
         link: "",
         reply: "",
         status: "",
         technology: "",
       });
 
 
       setIsEditModalOpen(false);
       fetchProject();
       setErrors({});
       toast.success("Role name updated successfully.");
     } catch (err) {
       if (err.response && err.response.data && err.response.data.errors) {
         setErrors(err.response.data.errors);
       } else {
         console.error("Error submitting form:", err);
       }
     }
   };

  const handleDelete = async (id) => {
    // console.log("editid", id);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this Status ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(
          `${API_URL}/api/bidder/delete-employee-bidder/${id}`,
          { withCredentials: true }
        );
        Swal.fire("Deleted!", "The Status has been deleted.", "success");
        // console.log("res", res);
        setAccountdetails((prev) => prev.filter((item) => item._id !== id));
        // fetchProject();
      } catch (err) {
        console.error("Failed to delete:", err);
        Swal.fire("Error", "There was an error deleting the Status.", "error");
      }
    } else {
      Swal.fire("Cancelled", "Your Status is safe :)", "info");
    }
  };

  // all account anf tech filietr

  const fetchAccTechList = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/bidder/view-account-technology-bidder`,
        { withCredentials: true }
      );

      // console.log("response", response);

      const accountBidderOptions = response.data.data?.accountBidder?.map(
        (data) => ({
          label: data.name,
          value: data._id,
        })
      );
      const technologyBidderOptions = response.data.data?.technologyBidder?.map(
        (data) => ({
          label: data.name,
          value: data._id,
        })
      );

      const bidderEmp = response.data.data?.bidder?.map((data) => ({
        label: data.employeeName,
        value: data._id,
      }));

      setTechnologyBidderOptions(technologyBidderOptions);
      setAccountBidderOptions(accountBidderOptions);
      setAccountBidder(bidderEmp);
    } catch (err) {
      setErrors("Failed to fetch biddingList.");
    }
  };

  const handleReset = async () => {
    setAccountfilter("");
    setTechfilter("");
    setStatusfilter("");
    setFromDate("");
    setToDate("");
    setCreatedBy("");

    try {
      const response = await axios.get(
        `${API_URL}/api/bidder/view-employee-bidder`,
        {
          withCredentials: true,
          params: {
            account: "",
            technology: "",
            status: "",
            fromDate: "",
            toDate: "",
            createdBy: "",
          },
        }
      );
      // console.log(response);
      if (response.data.success) {
        setAccountdetails(response.data.data);
        setCarddata(response.data?.AllTotalDetails);
        setLoading(false);
      } else {
        setErrors("Failed to fetch roles.");
      }
    } catch (err) {
      setErrors("Failed to fetch roles.");
      setLoading(false);
    }
  };

  // filter

  const statusOptions = [
    { label: "Submitted", value: "submitted" },
    { label: "Responded", value: "responded" },
    { label: "Requirements", value: "requirements" },
    { label: "Follow-Up", value: "follow_up" },
    { label: "Sales Converted", value: "sales_converted" },
    { label: "Unqualified", value: "unqualified" },
  ];
 const openEditModal = (row) => {
    console.log(row);

    setBiddingDetails({
      id: row._id,
      date: row.date,
      account: row.account._id,
      client: row.client,
      employeeId: row.employeeId,
      link: row.link,
      reply: row.reply,
      status: row.status,
      noOfConnections: row.noOfConnections,
      technology: row.technology._id,
      noOfboots: row.noOfBoost,
      country: row.country,
      state: row.state,
      timezone: row.timezone,
      salesdate: row.salesdate,

    });
    setIsEditModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeEditModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsEditModalOpen(false), 250);
    setErrors({});
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
      title: "Client",
      data: null,
      render: (row) => row.client || "-",
    },
    {
      title: "Date",
      data: null,
      render: (row) => {
        if (!row.date) return "-";
        return formatDateTime(row.date);
      },
    },

    {
      title: "Account",
      data: null,
      render: (row) => row.account?.name || "-",
    },
    {
      title: "Technology",
      data: null,
      render: (row) => row.technology?.name || "-",
    },

    // {
    //   title: "Reply",
    //   data: null,
    //   render: (row) => row.reply || "-",
    // },
    {
      title: "Link",
      data: "link",
      render: (data, type, row) => {
        const id = `link-icon-${row._id || Math.random()}`;
        setTimeout(() => {
          const container = document.getElementById(id);
          if (container) {
            if (!container._root) {
              container._root = createRoot(container);
            }
            container._root.render(
              <a
                href={data}
                target="_blank"
                rel="noopener noreferrer"
                title="Open Link"
              >
                <LuLink className="text-blue-600 size-5 items-center cursor-pointer" />
              </a>
            );
          }
        }, 0);
        return `<div id="${id}"></div>`;
      },
    },

    {
      title: "No of connects",
      data: null,
      render: (row) => row.noOfConnections || "-",
    },
    {
      title: "No of Boosts",
      data: null,
      render: (row) => row.noOfBoost || "-",
    },

    {
      title: "Created By",
      data: null,
      render: (row) => row.createdBy?.employeeName || "-",
    },

    // {
    //   title: "Status",
    //   data: "status",
    //   render: (data, type, row) => {
    //     const textColor =
    //       data === "Completed"
    //         ? "text-green-600 border rounded-full border-green-600"
    //         : "text-red-600 border rounded-full border-red-600";

    //     return `<div class="${textColor}" style="display: inline-block; padding: 2px; color: ${textColor}; border: 1px solid ${textColor}; text-align: center; width:100px; font-size: 16px;">
    //               ${data === "Completed" ? "Completed" : "Pending"}
    //             </div>`;
    //   },
    // },
    {
      title: "Status",
      data: "status",
      render: (data) => capitalizeFirstLetter(data) || "-",
    },
    {
      title: "Action",
      data: null,
      render: (data, type, row) => {
        const id = `actions-${row.sno || Math.random()}`;
        setTimeout(() => {
          const container = document.getElementById(id);
          if (container) {
            if (!container._root) {
              container._root = createRoot(container);
            }
            container._root.render(
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
                  <FaEye
                    className="cursor-pointer"
                    title="View"
                    onClick={() => {
                      setSelectedInvoiceId(row);
                      setIsOpen(true);
                    }}
                  />
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
              </div>
            );
          }
        }, 0);
        return `<div id="${id}"></div>`;
      },
    },

    // {
    //   title: "Action",
    //   data: null,
    //   render: (data, type, row) => {
    //     const id = `actions-${row.sno || Math.random()}`;
    //     setTimeout(() => {
    //       const container = document.getElementById(id);
    //       if (container && !container.hasChildNodes()) {
    //         ReactDOM.render(
    //           <div
    //             className="action-container"
    //             style={{
    //               display: "flex",
    //               gap: "15px",
    //               alignItems: "flex-end",
    //               justifyContent: "center",
    //             }}
    //           >
    //             {/* <div className="cursor-pointer">
    //               <FaEye

    //               />
    //             </div> */}
    //             <div
    //               className="modula-icon-edit  flex gap-2"
    //               style={{
    //                 color: "#000",
    //               }}
    //             >
    //               <TfiPencilAlt
    //                 className="cursor-pointer"
    //                 onClick={() => openEditModal(row)}
    //               />
    //               <MdOutlineDeleteOutline
    //                 className="text-red-600 text-xl cursor-pointer"
    //                 onClick={() => handleDelete(row._id)}
    //               />
    //             </div>

    //             {/* <div className="modula-icon-del" style={{
    //               color: "red"
    //             }}>
    //               <RiDeleteBin6Line
    //                 onClick={() => handleDelete(row.id)}
    //               />
    //             </div> */}
    //           </div>,
    //           container
    //         );
    //       }
    //     }, 0);
    //     return `<div id="${id}"></div>`;
    //   },
    // },
  ];

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-2 md:pt-10">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <div className="cursor-pointer">
              <Mobile_Sidebar />
            </div>
            <div className="flex justify-end mt-2 md:mt-0 gap-1 items-center">
              <p
                className="text-sm text-gray-500 cursor-pointer"
                onClick={() => navigate("/")}
              >
                Dashboard
              </p>
              <p>{">"}</p>
              <p className="text-sm text-blue-500">Bidding Details</p>
              <p>{">"}</p>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold mt-1 md:mt-4 mb-2 md:mb-3">
              Bidding Details
            </h1>

            {/* <div className="flex  flex-wrap  md:flex-nowrap justify-around  gap-5 my-8 text-[#6b7280] ">
              <div className="flex justify-between bg-[#f3f4f610]    border px-8 py-6 rounded-lg shadow-sm w-full">
                <div className="">
                  <h2 className="text-[16px]  font-semibold">Total Connects Spent</h2>
                  <p className="text-[14px]  mt-2 ">{carddata.totalConnections}</p>
                </div>
                <div className="flex ">
                  <span className="text-blue-500 w-12 h-12 text-2xl bg-blue-200/30  rounded-full flex justify-center items-center">
                    <GoProjectSymlink />
                  </span>
                </div>
              </div>
              <div className="flex justify-between bg-[#f3f4f610] border px-8 py-6 rounded-lg shadow-sm w-full">
                <div className="">
                  <h2 className="text-[16px]   font-semibold">
                    How Many Reply
                  </h2>
                  <p className="text-[14px]  mt-2">{carddata.replyYes}</p>
                </div>
                <div className="flex">
                  <span className="text-blue-500 w-12 h-12 text-2xl bg-blue-200/30  rounded-full flex justify-center items-center">
                    {" "}
                    <VscTasklist />
                  </span>
                </div>
              </div>
              <div className="flex justify-between bg-[#f3f4f610]  border px-8 py-6 rounded-lg shadow-sm w-full">
                <div className="">
                  <h2 className="text-[16px]  font-semibold ">
                    No Of Sales Converted
                  </h2>
                  <p className="ext-[14px]  mt-2">{carddata.salesConverted}</p>
                </div>
                <div className="flex">
                  <span className="text-blue-500 w-12 h-12 text-2xl bg-blue-200/30  rounded-full flex justify-center items-center">
                    {" "}
                    <FaTasks />
                  </span>
                </div>
              </div>
              <div className="flex justify-between bg-[#f3f4f610]  border px-8 py-6 rounded-lg shadow-sm w-full">
                <div className="">
                  <h2 className="text-[16px]  font-semibold">No Of Boost</h2>
                  <p className="ext-[14px]  mt-2">{carddata.totalBoost}</p>
                </div>
                <div className="flex">
                  <span className="text-blue-500 w-12 h-12 text-2xl bg-blue-200/30  rounded-full flex justify-center items-center">
                    {" "}
                    <FaTasks />
                  </span>
                </div>
              </div>
            </div> */}

            {/* filter */}
            <div className=" p-1  flex flex-wrap gap-4 items-end mb-6">
              {/* Account Filter */}
              <div className="flex flex-col w-full md:w-48">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Account
                </label>
                <Dropdown
                  value={accountfilter}
                  onChange={(e) => setAccountfilter(e.value)}
                  options={accountBidderOptions}
                  optionLabel="label"
                  appendTo="self"
                  placeholder="Select an Account"
                  className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Technology Filter */}
              <div className="flex flex-col w-full md:w-48">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Technology
                </label>
                <Dropdown
                  value={techfilter}
                  onChange={(e) => setTechfilter(e.value)}
                  options={technologyBidderOptions}
                  optionLabel="label"
                  appendTo="self"
                  placeholder="Select an Account"
                  className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Created By Filter */}
              <div className="flex flex-col w-full md:w-48">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Bidder
                </label>
                <Dropdown
                  value={createdBy}
                  onChange={(e) => setCreatedBy(e.value)}
                  options={accountBidder}
                  optionLabel="label"
                  appendTo="self"
                  placeholder="Select an Bidder"
                  className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Date Filter */}
              {/* From Date Filter */}
              <div className="flex flex-col w-full md:w-48">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* To Date Filter */}
              <div className="flex flex-col w-full md:w-48">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  min={fromDate}
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status Filter */}
              <div className="flex flex-col w-full md:w-48">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Dropdown
                  value={statusfilter}
                  onChange={(e) => setStatusfilter(e.value)}
                  options={statusOptions}
                  optionLabel="label"
                  appendTo="self"
                  placeholder="Select Status"
                  className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-3 sm:mt-6">
                <button
                  onClick={fetchProject}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg shadow transition duration-150"
                >
                  Submit
                </button>
                <button
                  onClick={handleReset}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-5 py-2 rounded-lg shadow transition duration-150"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8 text-gray-700">
              {/* Card 1 */}
              <div className="flex items-center gap-5 bg-white border rounded-xl px-6 py-5 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xl">
                  <GoProjectSymlink />
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">
                    Total Connects Spent
                  </h2>
                  <p className="text-xl font-semibold text-gray-600 mt-1">
                    {carddata.totalConnections}
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="flex items-center gap-5 bg-white border rounded-xl px-6 py-5 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-xl">
                  <VscTasklist />
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">
                    Replies Received
                  </h2>
                  <p className="text-xl font-semibold text-gray-600 mt-1">
                    {carddata.replyYes}
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="flex items-center gap-5 bg-white border rounded-xl px-6 py-5 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 text-xl">
                  <FaTasks />
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">
                    Sales Converted
                  </h2>
                  <p className="text-xl font-semibold text-gray-600 mt-1">
                    {carddata.salesConverted}
                  </p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="flex items-center gap-5 bg-white border rounded-xl px-6 py-5 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 text-xl">
                  <FaTasks />
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500">
                    Total Boosts
                  </h2>
                  <p className="text-xl font-semibold text-gray-600 mt-1">
                    {carddata.totalBoost}
                  </p>
                </div>
              </div>
            </div>

            {/* Add Button */}
            {/* <div className="flex justify-between mt-8 mb-3">
          <h1 className="text-2xl md:text-3xl font-semibold">Technology</h1>
          <button
            onClick={openAddModal}
            className="bg-blue-600 px-3 py-2 text-white w-20 rounded-2xl"
          >
            Add
          </button>
        </div> */}

            <div className="datatable-container mt-8">
              {/* Responsive wrapper for the table */}
              <div className="table-scroll-container" id="datatable">
                <DataTable
                  data={accountdetails}
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

            {isOpen && selectedInvoiceId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-2 border-b">
                    <h2 className="text-base font-semibold text-gray-800">
                      Bidding Details
                    </h2>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-gray-700 text-lg"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Body */}
                  <div className="px-4 py-3 max-h-[75vh] overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      {/* Item */}
                      <div>
                        <p className="text-[11px] font-semibold uppercase text-gray-500">
                          Client
                        </p>
                        <p className="text-gray-900 font-medium truncate">
                          {capitalizeFirstLetter(
                            selectedInvoiceId.client || "-"
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase text-gray-500">
                          Account
                        </p>
                        <p className="text-gray-900 font-medium truncate">
                          {selectedInvoiceId.account?.name || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase text-gray-500">
                          Date
                        </p>
                        <p className="text-gray-900 font-medium">
                          {selectedInvoiceId.date
                            ? new Date(
                                selectedInvoiceId.date
                              ).toLocaleDateString("en-GB")
                            : "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase text-gray-500">
                          Created By
                        </p>
                        <p className="text-gray-900 font-medium">
                          {selectedInvoiceId.createdBy?.employeeName}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase text-gray-500">
                          Status
                        </p>
                        <span className="inline-block text-xs px-2 py-[2px] rounded bg-blue-100 text-blue-700 capitalize">
                          {selectedInvoiceId.status || "-"}
                        </span>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase text-gray-500">
                          Technology
                        </p>
                        <p className="text-gray-900 font-medium truncate">
                          {selectedInvoiceId.technology?.name || "-"}
                        </p>
                      </div>

                      {/* Full width */}
                      <div className="sm:col-span-2">
                        <p className="text-[11px] font-semibold uppercase text-gray-500">
                          Link
                        </p>
                        {selectedInvoiceId.link ? (
                          <a
                            href={selectedInvoiceId.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline break-all font-medium"
                          >
                            {selectedInvoiceId.link}
                          </a>
                        ) : (
                          <p className="text-gray-900 font-medium">-</p>
                        )}
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase text-gray-500">
                          Boost
                        </p>
                        <p className="text-gray-900 font-medium">
                          {selectedInvoiceId.noOfBoost || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase text-gray-500">
                          Connections
                        </p>
                        <p className="text-gray-900 font-medium">
                          {selectedInvoiceId.noOfConnections || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase text-gray-500">
                          Country
                        </p>
                        <p className="text-gray-900 font-medium">
                          {selectedInvoiceId.country || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase text-gray-500">
                          State
                        </p>
                        <p className="text-gray-900 font-medium">
                          {selectedInvoiceId.state || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase text-gray-500">
                          Timezone
                        </p>
                        <p className="text-gray-900 font-medium">
                          {selectedInvoiceId.timezone || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase text-gray-500">
                          Sales Date
                        </p>
                        <p className="text-gray-900 font-medium">
                          {selectedInvoiceId.salesdate
                            ? new Date(
                                selectedInvoiceId.salesdate
                              ).toLocaleDateString("en-GB")
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2 border-t flex justify-end">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-1.5 text-sm rounded bg-gray-800 text-white hover:bg-gray-900"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

           {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
                  <div className="absolute inset-0" onClick={closeEditModal}></div>
                  <div
                    className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[55vw] bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
                      }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full mt-2 ms-2 border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                      title="Toggle Sidebar"
                      onClick={closeEditModal}
                    >
                      <IoIosArrowForward className="w-3 h-3" />
                    </div>
                    <div className="px-5 lg:px-14 py-10">
                      <p className="text-2xl md:text-3xl font-medium">
                        Edit Bidding Details
                      </p>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSave(biddingDetails.id);
                        }}
                      >
                        <div className="mt-10 flex justify-between items-center">
                          <div>
                            <label
                              htmlFor="date"
                              className="block text-md font-medium mb-2"
                            >
                              Date <span className="text-red-500">*</span>
                            </label>
                           
                          </div>
                          <div className="relative w-[300px]">
                            <input
                              id="date"
                              type="date"
                              value={biddingDetails.date}
                              onChange={(e) =>
                                setBiddingDetails({
                                  ...biddingDetails,
                                  date: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                            />
                          </div>
                        </div>

                        <div className="mt-3 flex justify-between items-center">
                          <div>
                            <label
                              htmlFor="acc"
                              className="block text-md font-medium mb-2 mt-3"
                            >
                              Account Name <span className="text-red-500">*</span>
                            </label>
                           
                          </div>
                          <div className="w-[300px]">
                            <Dropdown
                              value={biddingDetails.account}
                              onChange={(e) =>
                                setBiddingDetails({
                                  ...biddingDetails,
                                  account: e.value,
                                })
                              }
                              options={accountBidderOptions}
                              optionLabel="label"
                              appendTo="self"
                              placeholder="Select an Account"
                              className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                            />
                          </div>
                        </div>

                        <div className="mt-8 flex justify-between items-center">
                          <div>
                            <label
                              htmlFor="Client"
                              className="block text-md font-medium mb-2 mt-3"
                            >
                              Client Name <span className="text-red-500">*</span>
                            </label>
                           
                          </div>
                          <div className="w-[300px]">
                            <input
                              type="text"
                              id="Client"
                              name="Client"
                              value={biddingDetails.client}
                              onChange={(e) =>
                                setBiddingDetails({
                                  ...biddingDetails,
                                  client: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                            />
                          </div>
                        </div>

                        <div className="mt-8 flex justify-between items-center">
                          <div>
                            <label
                              htmlFor="Technology"
                              className="block text-md font-medium mb-2 mt-3"
                            >
                              Technology <span className="text-red-500">*</span>
                            </label>
                           
                          </div>
                          <div className="w-[300px]">
                            <Dropdown
                              value={biddingDetails.technology}
                              onChange={(e) =>
                                setBiddingDetails({
                                  ...biddingDetails,
                                  technology: e.value,
                                })
                              }
                              options={technologyBidderOptions}
                              optionLabel="label"
                              appendTo="self"
                              placeholder="Select a Technology"
                              className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                            />
                          </div>
                        </div>


                        {/* country */}
                        <div className="mt-3 flex justify-between items-center">
                          <div>
                            <label
                              htmlFor="country"
                              className="block text-md font-medium mb-2 mt-3"
                            >
                              Country
                            </label>
                          </div>
                          <div className="w-[300px]">
                            <input
                              type="text"
                              id="country"
                              name="country"
                              onChange={(e) =>
                                setBiddingDetails({
                                  ...biddingDetails,
                                  country: e.target.value,
                                })
                              }
                              value={biddingDetails?.country}
                              placeholder="Enter a Country"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* state */}

                        <div className="mt-3 flex justify-between items-center">
                          <div>
                            <label
                              htmlFor="state"
                              className="block text-md font-medium mb-2 mt-3"
                            >
                              State
                            </label>
                          </div>
                          <div className="w-[300px]">
                            <input
                              type="text"
                              id="state"
                              name="state"
                              onChange={(e) =>
                                setBiddingDetails({
                                  ...biddingDetails,
                                  state: e.target.value,
                                })
                              }
                              value={biddingDetails?.state}
                              placeholder="Enter a State"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* time Zone */}

                        <div className="mt-3 flex justify-between items-center">
                          <div>
                            <label
                              htmlFor="timezone"
                              className="block text-md font-medium mb-2 mt-3"
                            >
                              Time Zone
                            </label>
                          </div>
                          <div className="w-[300px]">
                            <input
                              type="text"
                              id="timezone"
                              name="timezone"
                              onChange={(e) =>
                                setBiddingDetails({
                                  ...biddingDetails,
                                  timeZone: e.target.value,
                                })
                              }
                              value={biddingDetails?.timezone}

                              placeholder="Enter a Time Zone"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* <div className="mt-8 flex justify-between items-center">
                    <div>
                      <label
                        htmlFor="reply"
                        className="block text-md font-medium mb-2 mt-3"
                      >
                        Reply <span className="text-red-500">*</span>
                      </label>
                      {errors.reply && (
                        <p className="text-red-500 text-sm mb-4 mt-1">
                          {errors.reply}
                        </p>
                      )}
                    </div>
                    <div className="w-[300px] flex gap-6">
                      <div className="flex gap-2">
                        <input
                          onChange={() =>
                            setBiddingDetails({
                              ...biddingDetails,
                              reply: "yes",
                            })
                          }
                          type="radio"
                          id="yes-edit"
                          name="reply"
                          checked={biddingDetails.reply === "yes"}
                        />
                        <label htmlFor="yes-edit">Yes</label>
                      </div>
                      <div className="flex gap-2">
                        <input
                          onChange={() =>
                            setBiddingDetails({
                              ...biddingDetails,
                              reply: "no",
                            })
                          }
                          type="radio"
                          id="no-edit"
                          name="reply"
                          checked={biddingDetails.reply === "no"}
                        />
                        <label htmlFor="no-edit">No</label>
                      </div>
                    </div>
                  </div> */}

                        <div className="mt-8 flex justify-between items-center">
                          <div>
                            <label
                              htmlFor="connections"
                              className="block text-md font-medium mb-2 mt-3"
                            >
                              No.Of Connects{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            {errors.noOfConnections && (
                              <p className="text-red-500 text-sm mb-4 mt-1">
                                {errors.noOfConnections}
                              </p>
                            )}
                          </div>
                          <div className="w-[300px]">
                            <input
                              type="number"
                              id="connections"
                              onChange={(e) =>
                                setBiddingDetails({
                                  ...biddingDetails,
                                  noOfConnections: e.target.value,
                                })
                              }
                              name="connections"
                              value={biddingDetails?.noOfConnections}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div className="mt-8 flex justify-between items-center">
                          <div>
                            <label
                              htmlFor="Boots"
                              className="block text-md font-medium mb-2 mt-3"
                            >
                              No.Of Boosts{" "}
                              <span className="text-red-500">*</span>
                            </label>
                         
                          </div>
                          <div className="w-[300px]">
                            <input
                              type="number"
                              id="Boots"
                              onChange={(e) =>
                                setBiddingDetails({
                                  ...biddingDetails,
                                  noOfboots: e.target.value,
                                })
                              }
                              name="connections"
                              value={biddingDetails.noOfboots}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div className="mt-8 flex justify-between items-center">
                          <div>
                            <label
                              htmlFor="link"
                              className="block text-md font-medium mb-2 mt-3"
                            >
                              Link <span className="text-red-500">*</span>
                            </label>
                           
                          </div>
                          <div className="w-[300px]">
                            <input
                              type="text"
                              id="link"
                              name="link"
                              value={biddingDetails.link}
                              onChange={(e) =>
                                setBiddingDetails({
                                  ...biddingDetails,
                                  link: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* <div className="mt-8 flex justify-between items-center">
                    <div>
                      <label
                        htmlFor="bidding"
                        className="block text-md font-medium mb-2 mt-3"
                      >
                        Bidding
                      </label>
                    </div>
                    <div className="w-[300px]">
                      <input
                        type="text"
                        id="bidding"
                        name="bidding"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div> */}

                        <div className="mt-8 flex justify-between items-center">
                          <div>
                            <label
                              htmlFor="status"
                              className="block text-md font-medium mb-2 mt-3"
                            >
                              Status
                            </label>
                          </div>
                          <div className="w-[300px]">
                            <select
                              name="status"
                              id="status"
                              value={biddingDetails.status}
                              onChange={(e) =>
                                setBiddingDetails({
                                  ...biddingDetails,
                                  status: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            >
                              <option value="">Select Status</option>

                              {statusOptions.map((item) => (
                                <option key={item.value} value={item.value}>
                                  {item.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        {biddingDetails.status === "sales_converted" && (
                          <div className="mt-3 flex justify-between items-center">
                            <div>
                              <label
                                htmlFor="date"
                                className="block text-md font-medium mb-2"
                              >
                                Sales Date <span className="text-red-500">*</span>
                              </label>
                              {errors.salesdate && (
                                <p className="w-[300px] text-red-500 text-sm mb-4 mt-1">
                                  {errors.salesdate}
                                </p>
                              )}
                            </div>
                            <div className="relative w-[300px]">
                              <input
                                id="date"
                                type="date"
                                value={salesdate}
                                onChange={(e) => setSalesDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end gap-2 mt-14">
                          <button
                            type="button"
                            onClick={closeEditModal}
                            className="bg-red-100 hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                          >
                            Submit
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
          </div>

          <Footer />
        </>
      )}
    </div>
  );
};
export default Bidding_details;
