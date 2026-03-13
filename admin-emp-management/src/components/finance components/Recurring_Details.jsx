import React, { useState, useEffect, useRef, useMemo } from "react";
import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
DataTable.use(DT);
import axios from "../../api/axiosConfig.js";
import { API_URL } from "../../config";
import { TfiPencilAlt } from "react-icons/tfi";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import { Chart } from "chart.js/auto";
import "datatables.net-rowgroup-dt";
import { IoIosArrowForward } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FaEye, FaHistory } from "react-icons/fa";
import { useDateUtils } from "../../hooks/useDateUtils";

const Recurring_details = () => {
  const formatDateTime = useDateUtils();
  const navigate = useNavigate();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");
  const [paymentLogs, setPaymentLogs] = useState([]);
  const [balanceAmount, setBalanceAmount] = useState("");
  console.log("balanceAmount", balanceAmount);

  // Data states
  const [recurringPayments, setRecurringPayments] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [accountDetails, setAccountDetails] = useState({});
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState("");

  // Filter states
  const [filters, setFilters] = useState({
    account: "",
    status: "",
    dueDate: "",
  });
  const [tempFilters, setTempFilters] = useState(filters);

  // Chart refs
  const chartRef = useRef(null);
  const chartRef1 = useRef(null);
  const chartInstance = useRef(null);
  const chartInstance1 = useRef(null);

  // Form states for Add
  const [formData, setFormData] = useState({
    account: "",
    lenderName: "",
    paymentType: "",
    amount: "",
    start_date: "",
    end_date: "",
    balance_amount: "",
    interest_rate: "",
    dueDate: "",
    recurringType: "",
    totalEmi: "",
    totalAmount: "",
    payment_status: "unpaid",
    status: "1",
  });

  // Form states for Edit
  const [editFormData, setEditFormData] = useState({
    account: "",
    lenderName: "",
    paymentType: "",
    amount: "",
    start_date: "",
    end_date: "",
    balance_amount: "",
    interest_rate: "",
    dueDate: "",
    recurringType: "",
    totalEmi: "",
    totalAmount: "",
    payment_status: "",
    status: "1",
  });

  // Payment type options
  const paymentTypeOptions = [
    { label: "EMI", value: "EMI" },
    { label: "Subscription", value: "Subscription" },
    { label: "Rent", value: "Rent" },
    { label: "Loan", value: "Loan" },
    { label: "Saving", value: "Saving" },
    { label: "Utilities", value: "Utilities" },
    { label: "Other", value: "Other" },
  ];

  // Recurring type options
  const recurringTypeOptions = [
    { label: "One Time", value: "One Time" },
    { label: "Monthly", value: "Monthly" },
    { label: "Quarterly", value: "Quarterly" },
    { label: "Annual", value: "Annual" },
  ];

  // Status options
  const statusOptions = [
    { label: "Active", value: "1" },
    { label: "Inactive", value: "0" },
  ];

  const statusPaymentOptions = [
    { label: "Paid", value: "paid" },
    { label: "Unpaid", value: "unpaid" },
  ];

  // Fetch accounts and recurring payments
  useEffect(() => {
    fetchAccounts();
    fetchRecurringPayments();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/income/finance-name`, {
        withCredentials: true,
      });
      const accounts = response.data.getFinanceName?.map((emp) => ({
        label: emp.name,
        value: emp._id,
      }));
      setAccountOptions(accounts);

      // Store account details for balance lookup
      const accountMap = {};
      response.data.getFinanceName?.forEach((acc) => {
        accountMap[acc._id] = acc;
      });
      setAccountDetails(accountMap);
    } catch (err) {
      console.error("Failed to fetch accounts:", err);
    }
  };

  const fetchRecurringPayments = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/recurring-payment/get`, {
        withCredentials: true,
      });
      console.log("response", response);
      if (response.data.success) {
        setRecurringPayments(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch recurring payments:", err);
      Swal.fire("Error", "Failed to fetch recurring payments", "error");
    }
  };

  const fetchPaymentLogs = async (parentId) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/recurring-payment/log?parent_id=${parentId}`,
        {
          withCredentials: true,
        },
      );
      console.log("fetchPaymentLogs", response);
      // if (response.data.success) {
      setPaymentLogs(response.data.data);
      setBalanceAmount(response.data.balanceAmount);
      setIsLogModalOpen(true);
      setTimeout(() => setIsAnimating(true), 10);
      // }
    } catch (err) {
      console.error("Failed to fetch payment logs:", err);
      Swal.fire("Error", "Failed to fetch payment history", "error");
    }
  };

  // Modal handlers
  const openAddModal = () => {
    setFormData({
      account: "",
      lenderName: "",
      paymentType: "",
      amount: "",
      dueDate: "",
      recurringType: "",
      totalEmi: "",
      totalAmount: "",
      start_date: "",
      end_date: "",
      balance_amount: "",
      interest_rate: "",
      payment_status: "unpaid",
      status: "1",
    });
    setErrors({});
    setIsAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeAddModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAddModalOpen(false), 250);
    setErrors({});
  };

  const openEditModal = async (row) => {
     const response = await axios.get(
        `${API_URL}/api/recurring-payment/log?parent_id=${row._id}`,
        {
          withCredentials: true,
        },
      );

    setEditId(row._id);

    // Calculate balance amount based on account if available
    // const accountBalance = accountDetails[row.account?._id]?.balance_amount || row.balance_amount || "";
    const accountBalance = response.data.balanceAmount || 0; 
    setEditFormData({
      account: row.account?._id || "",
      lenderName: row.lenderName || "",
      paymentType: row.paymentType || "",
      amount: row.amount || "",
      dueDate: row.dueDate
        ? new Date(row.dueDate).toISOString().split("T")[0]
        : "",
      recurringType: row.recurringType || "",
      totalEmi: row.totalEmi || "",
      totalAmount: row.totalAmount || "",
      start_date: row.start_date
        ? new Date(row.start_date).toISOString().split("T")[0]
        : "",
      end_date: row.end_date
        ? new Date(row.end_date).toISOString().split("T")[0]
        : "",
      balance_amount: accountBalance,
      interest_rate: row.interest_rate || "",
      payment_status: row.payment_status || "unpaid",
      status: row.status || "1",
    });
    setErrors({});
    setIsEditModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeEditModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsEditModalOpen(false), 250);
    setErrors({});
  };

  const closeLogModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsLogModalOpen(false), 250);
    setPaymentLogs([]);
  };

  // Form handlers
  const handleInputChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditFormData((prev) => ({ ...prev, [name]: value }));

      // Log amount changes in edit mode
      if (name === "amount") {
        console.log("Edit - Amount changed to:", value);
      }
      if (name === "payment_status") {
        console.log("Edit - Payment status changed to:", value);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Log amount changes in add mode
      if (name === "amount") {
        console.log("Add - Amount changed to:", value);
      }
      if (name === "payment_status") {
        console.log("Add - Payment status changed to:", value);
      }
    }
  };

  const handleAccountChange = (value, isEdit = false) => {
    if (isEdit) {
      setEditFormData((prev) => ({ ...prev, account: value }));
      // Auto-fill balance amount when account is selected in edit mode
      if (accountDetails[value]?.balance) {
        setEditFormData((prev) => ({
          ...prev,
          balance_amount: accountDetails[value].balance,
        }));
        console.log(
          "Edit - Balance amount auto-filled:",
          accountDetails[value].balance,
        );
      }
    } else {
      setFormData((prev) => ({ ...prev, account: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log the data being submitted
    console.log("Submitting Recurring Payment Data:", formData);
    console.log("Amount:", formData.amount);
    console.log("Payment Status:", formData.payment_status);

    try {
      const response = await axios.post(
        `${API_URL}/api/recurring-payment/create`,
        formData,
        { withCredentials: true },
      );

      if (response.data.success) {
        console.log("Payment created successfully:", response.data);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Recurring payment added successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        closeAddModal();
        fetchRecurringPayments();
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        Swal.fire("Error", "Failed to add recurring payment", "error");
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Log the data being submitted for edit
    console.log("Updating Recurring Payment Data:", editFormData);
    console.log("Amount:", editFormData.amount);
    console.log("Payment Status:", editFormData.payment_status);
    console.log("Balance Amount:", editFormData.balance_amount);

    try {
      const response = await axios.put(
        `${API_URL}/api/recurring-payment/update/${editId}`,
        editFormData,
        { withCredentials: true },
      );

      if (response.data.success) {
        console.log("Payment updated successfully:", response.data);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Recurring payment updated successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        closeEditModal();
        fetchRecurringPayments();
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        Swal.fire("Error", "Failed to update recurring payment", "error");
      }
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `${API_URL}/api/recurring-payment/delete/${id}`,
          { withCredentials: true },
        );

        if (response.data.success) {
          Swal.fire(
            "Deleted!",
            "Recurring payment has been deleted.",
            "success",
          );
          fetchRecurringPayments();
        }
      } catch (err) {
        Swal.fire("Error", "Failed to delete recurring payment", "error");
      }
    }
  };

  // Filtered data
  const filteredData = useMemo(() => {
    return recurringPayments.filter((row) => {
      const matchesAccount =
        !filters.account || row.account?._id === filters.account;
      const matchesStatus = !filters.status || row.status === filters.status;
      const matchesDueDate =
        !filters.dueDate ||
        new Date(row.dueDate).toLocaleDateString("en-GB") ===
          new Date(filters.dueDate).toLocaleDateString("en-GB");
      return matchesAccount && matchesStatus && matchesDueDate;
    });
  }, [recurringPayments, filters]);

  // Columns for DataTable
  const columns = [
    {
      title: "S.no",
      data: null,
      render: (data, type, row, meta) => meta.row + 1,
    },
    {
      title: "Account",
      data: null,
      render: (row) => row.account?.name || "-",
    },
    {
      title: "Lender Name",
      data: "lenderName",
    },
    {
      title: "Payment Type",
      data: "paymentType",
    },
    {
      title: "Amount",
      data: "amount",
      render: (data) => {
        if (!data) return "₹0";
        return `₹${parseFloat(data).toLocaleString("en-IN")}`;
      },
    },
    {
      title: "Due Date",
      data: "dueDate",
      render: (data) => formatDateTime(data),
    },
    {
      title: "Recurring Type",
      data: "recurringType",
    },
    {
      title: "Total EMI",
      data: "totalEmi",
      render: (data) => data || "-",
    },
    {
      title: "Total Amount",
      data: "totalAmount",
      render: (data) => {
        if (!data) return "₹0";
        return `₹${parseFloat(data).toLocaleString("en-IN")}`;
      },
    },
    {
      title: "Balance Amount",
      data: "balance_amount",
      render: (data) => {
        if (!data) return "₹0";
        return `₹${parseFloat(data).toLocaleString("en-IN")}`;
      },
    },
    {
      title: "Payment Status",
      data: "payment_status",
      render: (data) => {
        if (!data) return "-";
        const color = data === "paid" ? "text-green-600" : "text-red-600";
        const bgColor = data === "paid" ? "bg-green-100" : "bg-red-100";
        return `<span class="${color} ${bgColor} px-2 py-1 rounded-full text-xs font-semibold capitalize">${data}</span>`;
      },
    },
    {
      title: "Status",
      data: "status",
      render: (data, type, row) => {
        const textColor =
          data === "1"
            ? "text-green-600 border rounded-full border-green-600"
            : "text-red-600 border rounded-full border-red-600";
        return `<div class="${textColor}" style="display: inline-block; border: 1px solid ${textColor}; text-align: center; width:100px; font-size: 12px; font-weight: 500">
                  ${data === "1" ? "ACTIVE" : "INACTIVE"}
                </div>`;
      },
    },
    {
      title: "Action",
      data: null,
      render: (data, type, row) => {
        const id = `actions-${row._id}`;
        setTimeout(() => {
          const container = document.getElementById(id);
          if (container) {
            if (!container._root) {
              container._root = createRoot(container);
            }
            container._root.render(
              <div className="flex gap-3 items-center justify-center">
                <FaHistory
                  className="cursor-pointer text-purple-600 text-lg"
                  onClick={() => fetchPaymentLogs(row._id)}
                  title="View History"
                />
                <TfiPencilAlt
                  className="cursor-pointer text-blue-600 text-lg"
                  // onClick={() => openEditModal(row)}
                  onClick={() => {
                    openEditModal(row);
                  }}
                />
                <MdOutlineDeleteOutline
                  className="cursor-pointer text-red-600 text-xl"
                  onClick={() =>
                    handleDelete(row._id)}
                  
                />
              </div>,
            );
          }
        }, 0);
        return `<div id="${id}"></div>`;
      },
    },
  ];

  // Log Columns
  const logColumns = [
    {
      title: "S.no",
      data: null,
      render: (data, type, row, meta) => meta.row + 1,
    },
    {
      title: "Date",
      data: "createdAt",
      render: (data) => formatDateTime(data),
    },
    {
      title: "Amount",
      data: "amount",
      render: (data) => {
        if (!data) return "₹0";
        return `₹${parseFloat(data).toLocaleString("en-IN")}`;
      },
    },
    {
      title: "Payment Status",
      data: "payment_status",
      render: (data) => {
        if (!data) return "-";
        const color = data === "paid" ? "text-green-600" : "text-red-600";
        return `<span class="${color} capitalize">${data}</span>`;
      },
    },
    {
      title: "Balance Amount",
      data: "balance_amount",
      render: (data) => {
        if (!data) return "₹0";
        return `₹${parseFloat(data).toLocaleString("en-IN")}`;
      },
    },
    {
      title: "Payment Type",
      data: "paymentType",
    },
    {
      title: "Due Date",
      data: "dueDate",
      render: (data) => formatDateTime(data),
    },
  ];

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-2 md:pt-10">
      <div>
        <div className="cursor-pointer">
          <Mobile_Sidebar />
        </div>

        {/* Breadcrumb */}
        <div className="flex mt-2 md:mt-0 gap-1 items-center">
          <p
            className="text-sm text-gray-500 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </p>
          <p>{">"}</p>
          <p className="text-sm text-blue-500">Recurring Payments</p>
        </div>

        {/* Header */}
        <div className="flex justify-between mt-1 md:mt-4 mb-2 md:mb-3">
          <h1 className="text-2xl md:text-3xl font-semibold">
            Recurring Payments
          </h1>
          <button
            onClick={openAddModal}
            className="px-3 py-2 text-white bg-blue-500 hover:bg-blue-600 font-medium w-20 rounded-2xl"
          >
            Add
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap mb-4 items-end">
          <div className="flex flex-col w-40 md:w-48">
            <label className="text-sm font-medium mb-1">Account</label>
            <Dropdown
              value={tempFilters.account}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, account: e.value })
              }
              options={accountOptions}
              placeholder="All Accounts"
              className="w-full border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex flex-col w-40 md:w-48">
            <label className="text-sm font-medium mb-1">Status</label>
            <Dropdown
              value={tempFilters.status}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, status: e.value })
              }
              options={statusOptions}
              placeholder="All Status"
              className="w-full border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex flex-col w-40 md:w-48">
            <label className="text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              value={tempFilters.dueDate}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, dueDate: e.target.value })
              }
              className="border px-3 py-2 rounded focus:outline-none"
            />
          </div>

          <button
            onClick={() => setFilters(tempFilters)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Apply Filters
          </button>

          <button
            onClick={() => {
              setTempFilters({ account: "", status: "", dueDate: "" });
              setFilters({ account: "", status: "", dueDate: "" });
            }}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Reset
          </button>
        </div>

        {/* DataTable */}
        <div className="datatable-container">
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
                pageLength: 10,
                lengthMenu: [
                  [10, 25, 50, -1],
                  [10, 25, 50, "All"],
                ],
              }}
              className="display nowrap bg-white"
            />
          </div>
        </div>

        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50">
            <div className="absolute inset-0" onClick={closeAddModal}></div>
            <div
              className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${
                isAnimating ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full mt-2 ms-2 border-2 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                onClick={closeAddModal}
              >
                <IoIosArrowForward className="w-3 h-3" />
              </div>
              <div className="p-5">
                <h2 className="text-xl font-semibold mb-4">
                  Add Recurring Payment
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {/* Account */}
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Account *
                      </label>
                      <div className="w-2/3">
                        <Dropdown
                          name="account"
                          value={formData.account}
                          onChange={(e) => handleAccountChange(e.value, false)}
                          options={accountOptions}
                          placeholder="Select Account"
                          className="w-full border border-gray-300 rounded-lg"
                        />
                        {errors.account && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.account}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Lender Name */}
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Lender Name
                      </label>
                      <input
                        type="text"
                        name="lenderName"
                        value={formData.lenderName}
                        onChange={(e) => handleInputChange(e)}
                        className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Payment Type */}
                    <div className="flex justify-between items-start">
                      <label className="text-sm font-medium w-1/3">
                        Payment Type *
                      </label>
                      <div className="w-2/3">
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="paymentType"
                              id="paymentLoan"
                              value="Loan"
                              checked={formData.paymentType === "Loan"}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  paymentType: e.target.value,
                                })
                              }
                              className="mr-2 w-4 h-4 text-blue-600"
                            />
                            <label htmlFor="paymentLoan" className="text-sm">
                              Loan
                            </label>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="paymentType"
                              id="paymentSaving"
                              value="Saving"
                              checked={formData.paymentType === "Saving"}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  paymentType: e.target.value,
                                })
                              }
                              className="mr-2 w-4 h-4 text-blue-600"
                            />
                            <label htmlFor="paymentSaving" className="text-sm">
                              Saving
                            </label>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="paymentType"
                              id="paymentSubscription"
                              value="Subscription"
                              checked={formData.paymentType === "Subscription"}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  paymentType: e.target.value,
                                })
                              }
                              className="mr-2 w-4 h-4 text-blue-600"
                            />
                            <label
                              htmlFor="paymentSubscription"
                              className="text-sm"
                            >
                              Subscription
                            </label>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="paymentType"
                              id="paymentUtilities"
                              value="Utilities"
                              checked={formData.paymentType === "Utilities"}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  paymentType: e.target.value,
                                })
                              }
                              className="mr-2 w-4 h-4 text-blue-600"
                            />
                            <label
                              htmlFor="paymentUtilities"
                              className="text-sm"
                            >
                              Utilities
                            </label>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="paymentType"
                              id="paymentEMI"
                              value="EMI"
                              checked={formData.paymentType === "EMI"}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  paymentType: e.target.value,
                                })
                              }
                              className="mr-2 w-4 h-4 text-blue-600"
                            />
                            <label htmlFor="paymentEMI" className="text-sm">
                              EMI
                            </label>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="paymentType"
                              id="paymentRent"
                              value="Rent"
                              checked={formData.paymentType === "Rent"}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  paymentType: e.target.value,
                                })
                              }
                              className="mr-2 w-4 h-4 text-blue-600"
                            />
                            <label htmlFor="paymentRent" className="text-sm">
                              Rent
                            </label>
                          </div>
                        </div>
                        {errors.paymentType && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.paymentType}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Conditional fields based on payment type */}
                    {formData.paymentType === "Loan" && (
                      <>
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium w-1/3">
                            Start Date *
                          </label>
                          <input
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleInputChange}
                            className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium w-1/3">
                            End Date *
                          </label>
                          <input
                            type="date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleInputChange}
                            className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </>
                    )}

                    {formData.paymentType === "Saving" && (
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium w-1/3">
                          Interest Rate
                        </label>
                        <input
                          type="number"
                          name="interest_rate"
                          value={formData.interest_rate}
                          onChange={(e) => handleInputChange(e)}
                          className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {/* Amount */}
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Amount *
                      </label>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={(e) => handleInputChange(e)}
                        min="1"
                        className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.amount && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.amount}
                        </p>
                      )}
                    </div>

                    {/* Due Date */}
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Due Date *
                      </label>
                      <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={(e) => handleInputChange(e)}
                        className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.dueDate && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.dueDate}
                        </p>
                      )}
                    </div>

                    {/* Recurring Type */}
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Recurring Type *
                      </label>
                      <div className="w-2/3">
                        <Dropdown
                          name="recurringType"
                          value={formData.recurringType}
                          onChange={(e) =>
                            setFormData({ ...formData, recurringType: e.value })
                          }
                          options={recurringTypeOptions}
                          placeholder="Select Recurring Type"
                          className="w-full border border-gray-300 rounded-lg"
                        />
                        {errors.recurringType && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.recurringType}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Total EMI */}
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Total EMI
                      </label>
                      <input
                        type="number"
                        name="totalEmi"
                        value={formData.totalEmi}
                        onChange={(e) => handleInputChange(e)}
                        min="1"
                        className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Total Amount */}
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Total Amount
                      </label>
                      <input
                        type="number"
                        name="totalAmount"
                        value={formData.totalAmount}
                        onChange={(e) => handleInputChange(e)}
                        min="1"
                        className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Balance Amount */}
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Balance Amount
                      </label>
                      <input
                        type="number"
                        name="balance_amount"
                        value={formData.balance_amount}
                        onChange={(e) => handleInputChange(e)}
                        className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Payment Status */}
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Payment Status
                      </label>
                      <div className="w-2/3">
                        <Dropdown
                          name="payment_status"
                          value={formData.payment_status}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              payment_status: e.value,
                            });
                            console.log("Payment status set to:", e.value);
                          }}
                          options={statusPaymentOptions}
                          placeholder="Select Payment Status"
                          className="w-full border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Status
                      </label>
                      <div className="w-2/3">
                        <Dropdown
                          name="status"
                          value={formData.status}
                          onChange={(e) =>
                            setFormData({ ...formData, status: e.value })
                          }
                          options={statusOptions}
                          placeholder="Select Status"
                          className="w-full border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Form Buttons */}
                  <div className="flex gap-2 justify-end mt-6">
                    <button
                      type="button"
                      onClick={closeAddModal}
                      className="bg-red-100 hover:bg-red-200 text-red-600 px-5 py-2 font-semibold rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 font-semibold rounded-full"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50">
            <div className="absolute inset-0" onClick={closeEditModal}></div>
            <div
              className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${
                isAnimating ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full mt-2 ms-2 border-2 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                onClick={closeEditModal}
              >
                <IoIosArrowForward className="w-3 h-3" />
              </div>
              <div className="p-5">
                <h2 className="text-xl font-semibold mb-4">
                  Edit Recurring Payment
                </h2>
                <form onSubmit={handleEditSubmit}>
                  <div className="space-y-4">
                    {/* Account */}
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Account *
                      </label>
                      <div className="w-2/3">
                        <Dropdown
                          name="account"
                          value={editFormData.account}
                          onChange={(e) => handleAccountChange(e.value, true)}
                          options={accountOptions}
                          placeholder="Select Account"
                          className="w-full border border-gray-300 rounded-lg"
                        />
                        {errors.account && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.account}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Lender Name */}
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Lender Name
                      </label>
                      <input
                        type="text"
                        name="lenderName"
                        value={editFormData.lenderName}
                        onChange={(e) => handleInputChange(e, true)}
                        className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Payment Type - Edit */}
                    <div className="flex justify-between items-start">
                      <label className="text-sm font-medium w-1/3">
                        Payment Type *
                      </label>
                      <div className="w-2/3">
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="paymentType"
                              id="editPaymentLoan"
                              value="Loan"
                              checked={editFormData.paymentType === "Loan"}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  paymentType: e.target.value,
                                })
                              }
                              className="mr-2 w-4 h-4 text-blue-600"
                            />
                            <label
                              htmlFor="editPaymentLoan"
                              className="text-sm"
                            >
                              Loan
                            </label>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="paymentType"
                              id="editPaymentSaving"
                              value="Saving"
                              checked={editFormData.paymentType === "Saving"}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  paymentType: e.target.value,
                                })
                              }
                              className="mr-2 w-4 h-4 text-blue-600"
                            />
                            <label
                              htmlFor="editPaymentSaving"
                              className="text-sm"
                            >
                              Saving
                            </label>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="paymentType"
                              id="editPaymentSubscription"
                              value="Subscription"
                              checked={
                                editFormData.paymentType === "Subscription"
                              }
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  paymentType: e.target.value,
                                })
                              }
                              className="mr-2 w-4 h-4 text-blue-600"
                            />
                            <label
                              htmlFor="editPaymentSubscription"
                              className="text-sm"
                            >
                              Subscription
                            </label>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="paymentType"
                              id="editPaymentUtilities"
                              value="Utilities"
                              checked={editFormData.paymentType === "Utilities"}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  paymentType: e.target.value,
                                })
                              }
                              className="mr-2 w-4 h-4 text-blue-600"
                            />
                            <label
                              htmlFor="editPaymentUtilities"
                              className="text-sm"
                            >
                              Utilities
                            </label>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="paymentType"
                              id="editPaymentEMI"
                              value="EMI"
                              checked={editFormData.paymentType === "EMI"}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  paymentType: e.target.value,
                                })
                              }
                              className="mr-2 w-4 h-4 text-blue-600"
                            />
                            <label htmlFor="editPaymentEMI" className="text-sm">
                              EMI
                            </label>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="paymentType"
                              id="editPaymentRent"
                              value="Rent"
                              checked={editFormData.paymentType === "Rent"}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  paymentType: e.target.value,
                                })
                              }
                              className="mr-2 w-4 h-4 text-blue-600"
                            />
                            <label
                              htmlFor="editPaymentRent"
                              className="text-sm"
                            >
                              Rent
                            </label>
                          </div>
                        </div>
                        {errors.paymentType && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.paymentType}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Conditional fields based on payment type for edit */}
                    {editFormData.paymentType === "Loan" && (
                      <>
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium w-1/3">
                            Start Date *
                          </label>
                          <input
                            type="date"
                            name="start_date"
                            value={editFormData.start_date}
                            onChange={(e) => handleInputChange(e, true)}
                            className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium w-1/3">
                            End Date *
                          </label>
                          <input
                            type="date"
                            name="end_date"
                            value={editFormData.end_date}
                            onChange={(e) => handleInputChange(e, true)}
                            className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </>
                    )}

                    {editFormData.paymentType === "Saving" && (
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium w-1/3">
                          Interest Rate
                        </label>
                        <input
                          type="number"
                          name="interest_rate"
                          value={editFormData.interest_rate}
                          onChange={(e) => handleInputChange(e, true)}
                          className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {/* Amount */}
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Amount *
                      </label>
                      <input
                        type="number"
                        name="amount"
                        value={editFormData.amount}
                        onChange={(e) => {
                          handleInputChange(e, true);
                        }}
                        min="1"
                        className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.amount && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.amount}
                        </p>
                      )}
                    </div>

                    {/* Due Date */}
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Due Date *
                      </label>
                      <input
                        type="date"
                        name="dueDate"
                        value={editFormData.dueDate}
                        onChange={(e) => handleInputChange(e, true)}
                        className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.dueDate && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.dueDate}
                        </p>
                      )}
                    </div>

                    {/* Recurring Type */}
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Recurring Type *
                      </label>
                      <div className="w-2/3">
                        <Dropdown
                          name="recurringType"
                          value={editFormData.recurringType}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              recurringType: e.value,
                            })
                          }
                          options={recurringTypeOptions}
                          placeholder="Select Recurring Type"
                          className="w-full border border-gray-300 rounded-lg"
                        />
                        {errors.recurringType && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.recurringType}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Total EMI */}
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Total EMI
                      </label>
                      <input
                        type="number"
                        name="totalEmi"
                        value={editFormData.totalEmi}
                        onChange={(e) => handleInputChange(e, true)}
                        min="1"
                        className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Total Amount */}
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Total Amount
                      </label>
                      <input
                        type="number"
                        name="totalAmount"
                        value={editFormData.totalAmount}
                        onChange={(e) => handleInputChange(e, true)}
                        min="1"
                        className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Balance Amount - Auto-filled from account */}
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Balance Amount
                      </label>
                      <input
                        type="number"
                        name="balance_amount"
                        value={editFormData.balance_amount || balanceAmount}
                        onChange={(e) => handleInputChange(e, true)}
                        className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                        readOnly
                      />
                   
                    </div>

                    {/* Payment Status */}
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Payment Status
                      </label>
                      <div className="w-2/3">
                        <Dropdown
                          name="payment_status"
                          value={editFormData.payment_status}
                          onChange={(e) => {
                            setEditFormData({
                              ...editFormData,
                              payment_status: e.value,
                            });
                            console.log(
                              "Edit - Payment status set to:",
                              e.value,
                            );
                          }}
                          options={statusPaymentOptions}
                          placeholder="Select Payment Status"
                          className="w-full border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Status
                      </label>
                      <div className="w-2/3">
                        <Dropdown
                          name="status"
                          value={editFormData.status}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              status: e.value,
                            })
                          }
                          options={statusOptions}
                          placeholder="Select Status"
                          className="w-full border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Form Buttons */}
                  <div className="flex gap-2 justify-end mt-6">
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="bg-red-100 hover:bg-red-200 text-red-600 px-5 py-2 font-semibold rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 font-semibold rounded-full"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Payment History Log Modal */}
        {isLogModalOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50">
            <div className="absolute inset-0" onClick={closeLogModal}></div>
            <div
              className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[60vw] bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${
                isAnimating ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full mt-2 ms-2 border-2 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                onClick={closeLogModal}
              >
                <IoClose className="w-4 h-4" />
              </div>
              <div className="p-5">
                <h2 className="text-xl font-semibold mb-4">
                  Payment History Log
                </h2>

                {paymentLogs.length > 0 ? (
                  <div className="datatable-container">
                    <div className="table-scroll-container">
                      <DataTable
                        data={paymentLogs}
                        columns={logColumns}
                        options={{
                          paging: true,
                          searching: true,
                          ordering: true,
                          scrollX: true,
                          pageLength: 10,
                          lengthMenu: [
                            [10, 25, 50, -1],
                            [10, 25, 50, "All"],
                          ],
                        }}
                        className="display nowrap bg-white"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No payment history available
                  </p>
                )}

                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={closeLogModal}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 font-semibold rounded-full"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Recurring_details;
