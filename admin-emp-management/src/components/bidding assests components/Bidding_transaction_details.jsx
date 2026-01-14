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
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import Loader from "../Loader";
import { useDateUtils } from "../../hooks/useDateUtils";

const Bidding_transaction_details = () => {
  const navigate = useNavigate();
  const formatDateTime = useDateUtils();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [isAnimating, setIsAnimating] = useState(false);

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeAddModal = () => {
    setErrors({});
    setIsAnimating(false);
    setTimeout(() => setIsAddModalOpen(false), 250);
  };

  const closeEditModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsEditModalOpen(false), 250);
    setErrors("");
  };

  // const location = useLocation();

  const employeeIds = window.location.pathname.split("/")[2];
  //   console.log("window.location.pathname", employeeIds);

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
  // console.log("accountdetails", accountdetails);
  const [loading, setLoading] = useState(true);

  //api filter for params value

  const [selectedClients, setSelectedClients] = useState("");

  const [selectedContracts, setSelectedContracts] = useState("");

  const [selectedTxnTypes, setSelectedTxnTypes] = useState("");

  const [accountfilter, setAccountfilter] = useState("");

  console.log("accountfilter", accountfilter);
  const [createdBy, setCreatedBy] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchProject = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/bidder/get-import-bidding-excel-report`,
        {
          withCredentials: true,
          params: {
            fromDate: fromDate,
            toDate: toDate,
            account: accountfilter,
            transactionType: selectedTxnTypes,
            client: selectedClients,
            contractType: selectedContracts,
            createdBy: createdBy,
          },
        }
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

  const handleReset = async () => {
    setFromDate("");
    setToDate("");
    setAccountfilter("");
    setSelectedTxnTypes([]);
    setSelectedClients([]);
    setSelectedContracts([]);
    setCreatedBy("");

    //   setLoading(true);
    setErrors(null);

    try {
      const response = await axios.get(
        `${API_URL}/api/bidder/get-import-bidding-excel-report`,
        {
          withCredentials: true,
          params: {
            fromDate: "",
            toDate: "",
            account: "",
            transactionType: [],
            client: [],
            contractType: [],
            createdBy: "",
          },
        }
      );

      if (response.data.success) {
        setAccountdetails(response.data.data);
      } else {
        setErrors("Failed to fetch data.");
      }
    } catch (err) {
      setErrors("Failed to fetch data.");
    } finally {
      // setLoading(false);
    }
  };

  // filter alll api showing to data in api
  const [accountBidderOptions, setAccountBidderOptions] = useState(null);
  // console.log("accountBidderOptions", accountBidderOptions);
  // const [technologyBidderOptions, setTechnologyBidderOptions] = useState(null);
  const [accountBidder, setAccountBidder] = useState(null);

  // console.log("accountBidderOptions", accountBidder);

  const [transactionType, setTransactionType] = useState(null);
  const [clientdropdown, setClient] = useState(null);
  const [contractType, setContractType] = useState(null);

  // console.log("accountBidderOptions", contractType);

  const fetchAccTechList = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/bidder/view-account-technology-bidder`,
        { withCredentials: true }
      );

      // console.log("responseefsdg", response);
      //  setClient(response.data.data?.client);

      const accountBidderOptions = response.data.data?.accountBidder?.map(
        (data) => ({
          label: data.name,
          value: data._id,
        })
      );

      // setTechnologyBidderOptions(technologyBidderOptions);
      setAccountBidderOptions(accountBidderOptions);
    } catch (err) {
      setErrors("Failed to fetch biddingList.");
    }
  };

  useEffect(() => {
    fetchAccTechList();
  }, []);

  useEffect(() => {
    if (accountfilter) {
      fetchAllTechList(accountfilter);
    }
  }, [accountfilter]);
  const fetchAllTechList = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/bidder/get-transaction-bidder`,
        {
          withCredentials: true,
          params: {
            account: accountfilter,
          },
        }
      );

      // console.log("responseefsdg", response);

      setTransactionType(response.data.data?.transactionType);

      const bidderEmp = response.data.data?.bidder?.map((data) => ({
        label: data.employeeName,
        value: data._id,
      }));

      const clients = Array.isArray(response.data.data?.client)
        ? response.data.data.client.map((client) => ({
            label: client,
            value: client,
          }))
        : [];

      const contractType = Array.isArray(response.data.data?.description)
        ? response.data.data.description.map((client) => ({
            label: client,
            value: client,
          }))
        : [];

      setClient(clients);

      setContractType(contractType);

      // setTechnologyBidderOptions(technologyBidderOptions);
      // setAccountBidderOptions(accountBidderOptions);
      setAccountBidder(bidderEmp);
    } catch (err) {
      setErrors("Failed to fetch biddingList.");
    }
  };

  // add data
  const [accountoption, setAccountOption] = useState(null);

  const [accountname, setAccountname] = useState(null);
  // console.log(object)

  const [file, setFile] = useState(null);

  const fetchEmployeeList = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/bidder/view-account-technology-bidder`,
        {
          withCredentials: true,
        }
      );
      // console.log("response", response.data.data);

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
      const formData = new FormData();

      formData.append("account", accountname);
      // formData.append("accountUpworkName", accountname);

      formData.append("file", file);

      const response = await axios.post(
        `${API_URL}/api/bidder/import-bidding-report`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Uploaded successfully!",
        timer: 1500,
      });

      setIsAddModalOpen(false);
      setAccountname("");
      setFile(null);
      setErrors({});
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  // console.log("selectedInvoiceId", selectedInvoiceId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullSummary, setFullSummary] = useState("");

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
        return formatDateTime(row.date);
      },
    },

    {
      title: "Type",
      data: "transactionType",
      // render: (row) => row.account?.name || "-",
    },
    // {
    //     title: "Contract/Details",
    //     data: "transactionSummary",
    // },
    {
      title: "Contract / Details",
      data: null,
      render: (data, type, row) => {
        const id = `summary-${row.sno || Math.random()}`;

        setTimeout(() => {
          const container = document.getElementById(id);
          if (container) {
            if (!container._root) {
              container._root = createRoot(container);
            }

            const fullText = row.transactionSummary || "-";
            const shortText =
              fullText.length > 12
                ? fullText.substring(0, 12) + "..."
                : fullText;

            container._root.render(
              <span
                className="cursor-pointer hover:text-blue-600 hover:underline"
                title="Click to view full details"
                onClick={() => {
                  setFullSummary(fullText);
                  setIsModalOpen(true);
                }}
              >
                {shortText}
              </span>
            );
          }
        }, 0);

        return `<div id="${id}"></div>`;
      },
    },

    {
      title: "Client",
      data: "clientTeam",
      render: (data) => data || "-",
    },
    {
      title: "Amount",
      data: "amountDollar",
      render: (data) => `$${data}` || "-",
      // render: (data) => {
      //     if (data == null) return "-";
      //     return new Intl.NumberFormat("en-IN", {
      //         style: "dollar",
      //         currency: "USD",
      //         minimumFractionDigits: 0,
      //         maximumFractionDigits: 0,
      //     }).format(data);
      // },
    },
    {
      title: "Withdrawn",
      data: "amountINR",
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

    // {
    //     title: "Status",
    //     data: "status",
    //     render: (data, type, row) => {
    //         const textColor =
    //             data === "1"
    //                 ? "text-green-600 border rounded-full border-green-600"
    //                 : "text-red-600 border rounded-full border-red-600";

    //         return `<div class="${textColor}" style="display: inline-block; padding: 2px; color: ${textColor}; border: 1px solid ${textColor}; text-align: center; width:100px; font-size: 12px; font-weight:500">
    //           ${data === "1" ? "Active" : "InActive"}
    //         </div>`;
    //     },
    // },

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
                    onClick={() => {
                      setSelectedInvoiceId(row);
                      setIsOpen(true);
                    }}
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
  ];

  // const clients = [
  //     { id: 1, name: "ABC Corp" },
  //     { id: 2, name: "XYZ Solutions" },
  //     { id: 3, name: "Global Tech" },
  // ];

  const [showMoreClients, setShowMoreClients] = useState(false);
  const [showMoreTxn, setShowMoreTxn] = useState(false);
  const [showMoreContracts, setShowMoreContracts] = useState(false);

  const ITEMS_LIMIT = 10;

  // Generic function to render items with show more/less
  const renderItems = (items, type, showMore, setShowMore) => {
    const visibleItems = showMore ? items : items.slice(0, ITEMS_LIMIT);

    return (
      <>
        {visibleItems.map((item) => {
          let label = item;
          if (type === "clients") {
            label = clientdropdown.find((c) => c.value === item)?.label || item;
          } else if (type === "contracts") {
            label = contractType.find((c) => c.value === item)?.label || item;
          }

          return (
            <div
              key={item}
              className={`flex items-center gap-2 ${
                type === "clients"
                  ? "bg-blue-100"
                  : type === "transactions"
                  ? "bg-green-100"
                  : "bg-purple-100"
              } px-3 py-1 rounded-full text-sm`}
            >
              <span>{label}</span>
              <button
                onClick={() => {
                  if (type === "clients")
                    setSelectedClients(
                      selectedClients.filter((val) => val !== item)
                    );
                  else if (type === "transactions")
                    setSelectedTxnTypes(
                      selectedTxnTypes.filter((t) => t !== item)
                    );
                  else
                    setSelectedContracts(
                      selectedContracts.filter((val) => val !== item)
                    );
                }}
                className="text-red-600 font-bold"
              >
                ✕
              </button>
            </div>
          );
        })}

        {items.length > ITEMS_LIMIT && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="text-sm text-gray-500 hover:underline"
          >
            {showMore ? "Show Less" : `+${items.length - ITEMS_LIMIT} More`}
          </button>
        )}
      </>
    );
  };

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
              <p className="text-sm text-blue-500">Bidding Transaction</p>
              <p>{">"}</p>
            </div>

            {/* Add Button */}
            <div className="flex justify-between mt-1 md:mt-4 mb-2 md:mb-3">
              <h1 className="text-2xl md:text-3xl font-semibold">
                Bidding Transaction
              </h1>
              <button
                onClick={openAddModal}
                className="px-3 py-2  text-white bg-blue-500 hover:bg-blue-600 font-medium w-20 rounded-2xl"
              >
                Add
              </button>
            </div>

            <div className="p-1 flex justify-between items-end mb-6">
              <div className="flex flex-wrap gap-2 mt-1 ">
                {/* accounts */}
                <div className="flex flex-col w-full md:w-48">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Account
                  </label>
                  {/* <Dropdown
                    value={accountfilter}
                    onChange={(e) => setAccountfilter(e.value)}
                    options={accountBidderOptions}
                    optionLabel="label"
                    appendTo="self"
                    placeholder="Select an Account"
                    className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  /> */}
                  <MultiSelect
                    value={accountfilter}
                    onChange={(e) => setAccountfilter(e.value)}
                    options={accountBidderOptions}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select Account"
                    filter
                    display="chip"
                    maxSelectedLabels={2}
                    className="w-full rounded-lg border border-gray-300"
                    panelClassName="txn-panel"
                    // filter
                    filterPlaceholder="Search..."
                    pt={{
                      root: {
                        className: "w-full  rounded-lg border border-gray-300",
                      },
                      label: { className: "text-gray-700 px-3" },
                      trigger: { className: "text-gray-500" },
                      input: { className: "h-11" },
                      token: {
                        className:
                          "bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md",
                      },
                      item: {
                        className:
                          "text-sm text-gray-700 hover:bg-gray-100 px-3 py-2",
                      },
                    }}
                  />
                </div>
                {/* From Date */}
                <div className="flex flex-col w-40 md:w-48">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="h-11 border border-gray-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* To Date */}
                <div className="flex flex-col w-40 md:w-48">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="h-11 border border-gray-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Transaction Type */}
                <div className="flex flex-col w-40 md:w-48">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Transaction Type
                  </label>
                  <MultiSelect
                    value={selectedTxnTypes}
                    onChange={(e) => setSelectedTxnTypes(e.value)}
                    options={transactionType}
                    // optionLabel="name"
                    placeholder="Select Type"
                    display="chip"
                    className="w-full   rounded-lg border border-gray-300"
                    panelClassName="txn-panel"
                    filter
                    maxSelectedLabels={2}
                    filterPlaceholder="Search..."
                    pt={{
                      root: {
                        className: "w-full  rounded-lg border border-gray-300",
                      },
                      label: { className: "text-gray-700 px-3" },
                      trigger: { className: "text-gray-500" },
                      input: { className: "h-11" },
                      token: {
                        className:
                          "bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md",
                      },
                      item: {
                        className:
                          "text-sm text-gray-700 hover:bg-gray-100 px-3 py-2",
                      },
                    }}
                  />
                </div>

                {/* Client */}
                <div className="flex flex-col w-48 md:w-60">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Client
                  </label>
                  <MultiSelect
                    value={selectedClients}
                    onChange={(e) => setSelectedClients(e.value)}
                    options={clientdropdown}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select Client"
                    filter
                    display="chip"
                    maxSelectedLabels={2}
                    className="w-full rounded-lg border border-gray-300"
                    panelClassName="txn-panel"
                    // filter
                    filterPlaceholder="Search..."
                    pt={{
                      root: {
                        className: "w-full  rounded-lg border border-gray-300",
                      },
                      label: { className: "text-gray-700 px-3" },
                      trigger: { className: "text-gray-500" },
                      input: { className: "h-11" },
                      token: {
                        className:
                          "bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md",
                      },
                      item: {
                        className:
                          "text-sm text-gray-700 hover:bg-gray-100 px-3 py-2",
                      },
                    }}
                  />
                </div>

                {/* Contract */}
                <div className="flex flex-col w-48 md:w-60">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Contract
                  </label>
                  <MultiSelect
                    value={selectedContracts}
                    onChange={(e) => setSelectedContracts(e.value)}
                    options={contractType}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select Contract"
                    filter
                    display="chip"
                    maxSelectedLabels={2}
                    className="w-full rounded-lg border border-gray-300"
                    panelClassName="txn-panel"
                    // filter
                    filterPlaceholder="Search..."
                    pt={{
                      root: {
                        className: "w-full  rounded-lg border border-gray-300",
                      },
                      label: { className: "text-gray-700 px-3" },
                      trigger: { className: "text-gray-500" },
                      input: { className: "h-11" },
                      token: {
                        className:
                          "bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md",
                      },
                      item: {
                        className:
                          "text-sm text-gray-700 hover:bg-gray-100 px-3 py-2",
                      },
                    }}
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

                <div className="flex gap-3 ml-auto mt-3 sm:mt-6">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
                    onClick={fetchProject}
                  >
                    Apply
                  </button>
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-lg shadow"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Buttons */}
            </div>

            <div className="mt-5 space-y-3">
              {/* Clients */}
              {selectedClients.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-gray-600">
                    Clients
                  </span>
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {selectedClients.length} selected
                  </span>
                  {renderItems(
                    selectedClients,
                    "clients",
                    showMoreClients,
                    setShowMoreClients
                  )}
                </div>
              )}

              {/* Transaction Types */}
              {selectedTxnTypes.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-gray-600">
                    Transaction
                  </span>
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    {selectedTxnTypes.length} selected
                  </span>
                  {renderItems(
                    selectedTxnTypes,
                    "transactions",
                    showMoreTxn,
                    setShowMoreTxn
                  )}
                </div>
              )}

              {/* Contracts */}
              {selectedContracts.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-gray-600">
                    Contracts
                  </span>
                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                    {selectedContracts.length} selected
                  </span>
                  {renderItems(
                    selectedContracts,
                    "contracts",
                    showMoreContracts,
                    setShowMoreContracts
                  )}
                </div>
              )}
            </div>

            {/* ================= CLEAR ALL ================= */}
            {(selectedClients.length ||
              selectedTxnTypes.length ||
              selectedContracts.length) > 0 && (
              <button
                onClick={() => {
                  setSelectedClients([]);
                  setSelectedTxnTypes([]);
                  setSelectedContracts([]);
                }}
                className="mt-4 text-sm text-red-600 underline"
              >
                Clear All Filters
              </button>
            )}

            <div className="datatable-container">
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
                    <h2 className="text-xl font-semibold mb-4">Add File</h2>

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
                        Choose a file<span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="file"
                          onChange={(e) => setFile(e.target.files[0])}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
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

            {/* view */}

            {isOpen && selectedInvoiceId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]">
                  {/* Close Button */}
                  <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
                    onClick={() => setIsOpen(false)}
                  >
                    ✖
                  </button>

                  {/* Title */}
                  <h2 className="text-2xl font-semibold text-center mb-8">
                    Invoice Details
                  </h2>

                  {/* Details Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500">Client</p>
                      <p className="font-medium text-gray-800">
                        {selectedInvoiceId.clientTeam || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Freelancer</p>
                      <p className="font-medium text-gray-800">
                        {selectedInvoiceId.freelancer || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Transaction ID</p>
                      <p className="font-medium text-gray-800 break-all">
                        {selectedInvoiceId.transactionId || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Transaction Type</p>
                      <p className="font-medium text-gray-800">
                        {selectedInvoiceId.transactionType || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium text-gray-800">
                        {selectedInvoiceId.date
                          ? new Date(
                              selectedInvoiceId.date
                            ).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Amount ($)</p>
                      <p className="font-medium text-gray-800">
                        {selectedInvoiceId.amountDollar ?? "-"}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-8 border-t" />

                  {/* Descriptions Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Descriptions
                    </h3>

                    <div className="space-y-3">
                      {[
                        selectedInvoiceId.description1,
                        selectedInvoiceId.description2,
                        selectedInvoiceId.description3,
                      ]
                        .filter(Boolean)
                        .map((desc, index) => (
                          <div
                            key={index}
                            className="flex gap-4 bg-gray-50 border rounded-lg p-4"
                          >
                            <span className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                              {index + 1}
                            </span>
                            <p className="text-sm text-gray-700">{desc}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setIsModalOpen(false)}
                  >
                    ✕
                  </button>

                  <h2 className="text-lg font-semibold mb-3">
                    Contract / Details
                  </h2>

                  <p className="text-gray-700 whitespace-pre-wrap">
                    {fullSummary}
                  </p>
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
export default Bidding_transaction_details;
