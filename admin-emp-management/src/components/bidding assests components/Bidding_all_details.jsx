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
import ReactDOM from "react-dom";
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
const Bidding_all_details = () => {

  // const location = useLocation();
  const ids = window.location.pathname.split("/")[2]
  console.log("rowdeatsils",ids);
  const navigate = useNavigate();

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
  console.log("window.location.pathname", employeeIds);

  // Fetch roles from the API
  useEffect(() => {
    fetchProject();
  }, []);

  //   const [status, setStatus] = useState("");
  const storedDetatis = localStorage.getItem("hrmsuser");
  const parsedDetails = JSON.parse(null);
  const userid = parsedDetails ? parsedDetails.id : null;
  const [errors, setErrors] = useState({});
  

  const [accountdetails, setAccountdetails] = useState([]);
  console.log("accountdetails", accountdetails);
  const [loading, setLoading] = useState(true);
  const [carddata, setCarddata] = useState([]);
  console.log("carddata", carddata);

  const fetchProject = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/bidder/view-employee-bidder`,{
            params:{
                ids:ids,
                bidder:"bidder",
            }
        }
      );
      console.log(response);
      if (response.data.success) {
        setAccountdetails(response.data.data);
        setCarddata(response.data);
        setLoading(false);
      } else {
        setErrors("Failed to fetch roles.");
      }
    } catch (err) {
      setErrors("Failed to fetch roles.");
      setLoading(false);
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
          `${API_URL}/api/bidder/delete-employee-bidder/${id}`
        );
        Swal.fire("Deleted!", "The Status has been deleted.", "success");
        console.log("res", res);
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

  // filter
  const [filters, setFilters] = useState({
    account: "",
    technology: "",
    createdBy: "",
    date: "",
    status: "",
    reply: "",
  });

  // Temporary values before submit
  const [temp, setTemp] = useState(filters);

  // unique values
  const accounts = [
    ...new Set(accountdetails.map((r) => r.account?.name).filter(Boolean)),
  ];
  const techs = [
    ...new Set(accountdetails.map((r) => r.technology?.name).filter(Boolean)),
  ];
  const creators = [
    ...new Set(
      accountdetails.map((r) => r.createdBy?.employeeName).filter(Boolean)
    ),
  ];
  const statusOptions = [
    ...new Set(accountdetails.map((r) => r.status).filter(Boolean)),
  ];
  const replyOptions = [
    ...new Set(accountdetails.map((r) => r.reply).filter(Boolean)),
  ];

  // Filter data after submit
  const filteredData = useMemo(() => {
    return accountdetails.filter(
      (r) =>
        (!filters.account || r.account?.name === filters.account) &&
        (!filters.technology || r.technology?.name === filters.technology) &&
        (!filters.createdBy ||
          r.createdBy?.employeeName === filters.createdBy) &&
        (!filters.date ||
          new Date(r.date).toLocaleDateString("en-GB") ===
            new Date(filters.date).toLocaleDateString("en-GB")) &&
        (!filters.status || r.status === filters.status) &&
        (!filters.reply ||
          r.reply?.toLowerCase().includes(filters.reply.toLowerCase())) // New line
    );
  }, [accountdetails, filters]);

  const handleSubmit = () => setFilters(temp);
  const handleReset = () => {
    setTemp({
      account: "",
      technology: "",
      createdBy: "",
      date: "",
      status: "",
      reply: "",
    });
    setFilters({
      account: "",
      technology: "",
      createdBy: "",
      date: "",
      status: "",
      reply: "",
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
      title: "Client",
      data: null,
      render: (row) => row.client || "-",
    },
    {
      title: "Date",
      data: null,
      render: (row) => {
        if (!row.date) return "-";
        return new Date(row.date)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .replace(/\//g, "-");
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

    {
      title: "Reply",
      data: null,
      render: (row) => row.reply || "-",
    },
    {
      title: "Link",
      data: "link",
      render: function (data, type, row) {
        if (data) {
          return `<a href="${data}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">Click Me</a>`;
        }
        return "";
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

    {
      title: "Status",
      data: "status",
      render: (data, type, row) => {
        const textColor =
          data === "Completed"
            ? "text-green-600 border rounded-full border-green-600"
            : "text-red-600 border rounded-full border-red-600";

        return `<div class="${textColor}" style="display: inline-block; padding: 2px; color: ${textColor}; border: 1px solid ${textColor}; text-align: center; width:100px; font-size: 16px;">
                  ${data === "Completed" ? "Completed" : "Pending"}
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
            <Mobile_Sidebar />

            <div className="flex gap-2 items-center cursor-pointer">
              <p
                className=" text-gray-500 cursor-pointer"
                onClick={() => navigate("/")}
              >
                Dashboard
              </p>
              <p>{">"}</p>
              <p className=" text-blue-500">Bidding Details</p>
              <p>{">"}</p>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold mt-8">
              Bidding Details
            </h1>

            <div className="flex justify-around  gap-5 my-8 text-[#6b7280] ">
              <div className="flex justify-between bg-[#f3f4f610]    border px-8 py-6 rounded-lg shadow-sm w-full">
                <div className="">
                  <h2 className="text-[16px]  font-semibold">No Of Connects</h2>
                  <p className="text-[14px]  mt-2 ">{carddata.noOfConnects}</p>
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
                  <p className="text-[14px]  mt-2">{carddata.reply}</p>
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
                  <p className="ext-[14px]  mt-2">12</p>
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
                  <p className="ext-[14px]  mt-2">{carddata.noOfBoosts}</p>
                </div>
                <div className="flex">
                  <span className="text-blue-500 w-12 h-12 text-2xl bg-blue-200/30  rounded-full flex justify-center items-center">
                    {" "}
                    <FaTasks />
                  </span>
                </div>
              </div>
            </div>
            {/* filter */}
            <div className=" p-1  flex flex-wrap gap-4 items-end mb-6">
              {/* Account Filter */}
              <div className="flex flex-col w-48">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Account
                </label>
                <select
                  value={temp.account}
                  onChange={(e) =>
                    setTemp({ ...temp, account: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Accounts</option>
                  {accounts.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>

              {/* Technology Filter */}
              <div className="flex flex-col w-48">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Technology
                </label>
                <select
                  value={temp.technology}
                  onChange={(e) =>
                    setTemp({ ...temp, technology: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Technologies</option>
                  {techs.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Created By Filter */}
              <div className="flex flex-col w-48">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Created By
                </label>
                <select
                  value={temp.createdBy}
                  onChange={(e) =>
                    setTemp({ ...temp, createdBy: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Creators</option>
                  {creators.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Reply Filter */}
              <div className="flex flex-col w-48">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Reply
                </label>
                <input
                  type="text"
                  value={temp.reply}
                  onChange={(e) => setTemp({ ...temp, reply: e.target.value })}
                  placeholder="Search reply"
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date Filter */}
              <div className="flex flex-col w-48">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={temp.date}
                  onChange={(e) => setTemp({ ...temp, date: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status Filter */}
              <div className="flex flex-col w-48">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={temp.status}
                  onChange={(e) => setTemp({ ...temp, status: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Status</option>
                  {statusOptions.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-3 sm:mt-6">
                <button
                  onClick={handleSubmit}
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
                  data={filteredData}
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
          </div>

          <Footer />
        </>
      )}
    </div>
  );
};
export default Bidding_all_details;
