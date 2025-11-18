import React, { useState, useEffect, useRef,useMemo } from "react";

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
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import Loader from "../Loader";

const Connect_details = () => {
  const navigate = useNavigate();

  // const location = useLocation();

  const employeeIds = window.location.pathname.split("/")[2];
  //   console.log("window.location.pathname", employeeIds);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [isAnimating, setIsAnimating] = useState(false);

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10); // Delay to trigger animation
  };

  const closeAddModal = () => {
    setErrors({});
    setIsAnimating(false);
    setTimeout(() => setIsAddModalOpen(false), 250); // Delay to trigger animation
  };

  const closeEditModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsEditModalOpen(false), 250);
    setErrors("");
  };

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
  //   console.log("accountdetails", accountdetails);
  const [loading, setLoading] = useState(true);

  const fetchProject = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/bidder/view-connect-purchased`
      );
      console.log(response);
      if (response.data.success) {
        setAccountdetails(response.data.data);
        setLoading(false);
      } else {
        setErrors("Failed to fetch roles.");
      }
    } catch (err) {
      setErrors("Failed to fetch roles.");
      setLoading(false);
    }
  };

  const [accountoption, setAccountOption] = useState(null);

  const [date, setDate] = useState("");
  const [accountname, setAccountname] = useState(null);
  const [connects, setConnects] = useState("");
  const [amount, setAmount] = useState("");

  const fetchEmployeeList = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/bidder/view-account-technology-bidder`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("response", response.data.data);

      const employeeemail = response.data.data.accountBidder.map((emp) => ({
        label: emp.name,
        value: emp._id,
        data: emp, //
      }));
      // console.log("employeeemail", response.data.data);
      setAccountOption(employeeemail);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEmployeeList();
  }, []);

  //   const [errors, setErrors] = useState({});

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        date: date,
        account: accountname,
        noOfConnections: connects,
        amount: amount,
      };

      const response = await axios.post(
        `${API_URL}/api/bidder/create-connect-purchased`,
        formData
      );
      console.log("response:", response);
      Swal.fire({
        icon: "success",
        title: "Status added successfully!",
        showConfirmButton: true,
        timer: 1500,
      });

      setIsAddModalOpen(false);
      fetchProject();
      setDate("");
      setAccountname("");
      setConnects("");
      setAmount("");

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
  const [dateedit, setDateedit] = useState("");
  const [accountnameedit, setAccountnameedit] = useState("");
  const [connectsedit, setConnectsedit] = useState("");
  const [amountedit, setAmountedit] = useState("");
  const [editid, setEditid] = useState([]);

  //   console.log("editid", editid);

  const openEditModal = (row) => {
    console.log("rowData", row);

    setEditid(row._id);
    setDateedit(row.date);

    setAccountnameedit(row.account._id);
    setConnectsedit(row.noOfConnections);
    setAmountedit(row.amount);

    setIsEditModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  // const closeEditModal = () => {
  //   setIsEditModalOpen(false);
  //   setErrors("");
  // };

  const handlesubmitedit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        date: dateedit,
        account: accountnameedit,
        noOfConnections: connectsedit,
        amount: amountedit,
      };

      const response = await axios.put(
        `${API_URL}/api/bidder/edit-connect-purchased/${editid}`,
        formData
      );
      console.log("response:", response);
      Swal.fire({
        icon: "success",
        title: "Status Update successfully!",
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
      text: "Do you want to delete this Status ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(
          `${API_URL}/api/bidder/delete-connect-purchased/${id}`
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

    const [filters, setFilters] = useState({
      account: "",
      
      date: "",
      
    });


  
    // Temporary values before submit
    const [temp, setTemp] = useState(filters);

      const accounts = [
    ...new Set(accountdetails.map((r) => r.account?.name).filter(Boolean)),
  ];
    const filteredData = useMemo(() => {
      return accountdetails.filter(
        (r) =>
          (!filters.account || r.account?.name === filters.account) &&
      
          (!filters.date ||
            new Date(r.date).toLocaleDateString("en-GB") ===
              new Date(filters.date).toLocaleDateString("en-GB")) 
      
      );
    }, [accountdetails, filters]);
  
    const handleSubmit = () => setFilters(temp);
    const handleReset = () => {
      setTemp({
        account: "",
        
        
        date: "",
     
      });
      setFilters({
        account: "",
        
        
        date: "",
     
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
      title: "Connects",
      data: "noOfConnections",
    },

    {
      title: "Amount",
      data: "amount",
      render: (data) => {
        if (data == null) return "-";
        return new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(data);
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
              <p className=" text-blue-500">Connects</p>
              <p>{">"}</p>
            </div>

            {/* Add Button */}
            <div className="flex justify-between mt-8 mb-3">
              <h1 className="text-2xl md:text-3xl font-semibold">Connects</h1>
              <button
                onClick={openAddModal}
                className="px-3 py-2  text-white bg-blue-500 hover:bg-blue-600 font-medium w-20 rounded-2xl"
              >
                Add
              </button>
            </div>

             <div className=" p-1  flex flex-wrap gap-4 items-end mb-6">
              {/* Account Filter */}
              <div className="flex flex-col w-40 md:w-48">
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
               <div className="flex flex-col w-40 md:w-48">
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

            <div className="datatable-container">
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
            {/* Add Modal */}
            {isAddModalOpen && (
              <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
                {/* Overlay */}
                <div
                  className="absolute inset-0 "
                  onClick={closeAddModal}
                ></div>

                <div
                  className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${
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
                  <div className="p-5">
                    <h2 className="text-xl font-semibold mb-4">Add Connects</h2>

                    {/* date */}
                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        Date<span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          placeholder="Enter Date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.date && (
                          <p className="text-red-500 text-sm mb-4">
                            {errors.date}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* account */}

                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        Account<span className="text-red-500">*</span>
                      </label>

                      <div className="w-[60%] md:w-[50%]">
                        <Dropdown
                          value={accountname}
                          onChange={(e) => setAccountname(e.value)}
                          options={accountoption}
                          optionValue="value"
                          optionLabel="label"
                          filter
                          placeholder="Select Account"
                          maxSelectedLabels={3}
                          className="w-full   border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          display="chip"
                        />
                        {errors.account && (
                          <p className="text-red-500 text-sm mb-4">
                            {errors.account}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* connects */}

                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        No of Connects<span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="number"
                          value={connects}
                          onChange={(e) => setConnects(e.target.value)}
                          placeholder="Enter Connect "
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.noOfConnections && (
                          <p className="text-red-500 text-sm mb-4">
                            {errors.noOfConnections}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* amount */}
                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        Amount<span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="Number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Enter Amount "
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.amount && (
                          <p className="text-red-500 text-sm mb-4">
                            {errors.amount}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 mt-4">
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
                <div
                  className="absolute inset-0 "
                  onClick={closeEditModal}
                ></div>

                <div
                  className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${
                    isAnimating ? "translate-x-0" : "translate-x-full"
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
                    <h2 className="text-xl font-semibold mb-4">
                      Edit Connects
                    </h2>

                    {/* date */}
                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        Date<span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="date"
                          value={dateedit}
                          onChange={(e) => setDateedit(e.target.value)}
                          placeholder="Enter Date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.date && (
                          <p className="text-red-500 text-sm mb-4">
                            {errors.date}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* account */}

                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        Account<span className="text-red-500">*</span>
                      </label>

                      <div className="w-[60%] md:w-[50%]">
                        <Dropdown
                          value={accountnameedit}
                          onChange={(e) => setAccountnameedit(e.value)}
                          options={accountoption}
                          optionValue="value"
                          optionLabel="label"
                          filter
                          placeholder="Select Account"
                          maxSelectedLabels={3}
                          className="w-full   border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          display="chip"
                        />
                        {errors.account && (
                          <p className="text-red-500 text-sm mb-4">
                            {errors.account}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* connects */}

                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        No of Connects<span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="number"
                          value={connectsedit}
                          onChange={(e) => setConnectsedit(e.target.value)}
                          placeholder="Enter Connect "
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.noOfConnections && (
                          <p className="text-red-500 text-sm mb-4">
                            {errors.noOfConnections}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* amount */}
                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        Amount<span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="Number"
                          value={amountedit}
                          onChange={(e) => setAmountedit(e.target.value)}
                          placeholder="Enter Amount "
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.amount && (
                          <p className="text-red-500 text-sm mb-4">
                            {errors.amount}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 mt-4">
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

            {/* View Modal */}
            {isViewModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-5 px-8 rounded-xl w-[800px] h-[500px] overflow-y-auto relative">
                  <div className="flex justify-between items-center ">
                    <h2 className="text-lg font-semibold mb-4 flex gap-4">
                      View Project
                      {roleDetails.status == "1" ? (
                        <span className="text-green-600 font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          InActive
                        </span>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        </>
      )}

      <Footer />
    </div>
  );
};
export default Connect_details;
