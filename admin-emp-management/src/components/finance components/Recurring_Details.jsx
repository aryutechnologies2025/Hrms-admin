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
import { FaEye, FaHistory, FaPlusCircle } from "react-icons/fa";
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
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");
  const [paymentLogs, setPaymentLogs] = useState([]);
  const [balanceAmount, setBalanceAmount] = useState("");
  const [viewData, setViewData] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  console.log("selectedRowData", selectedRowData);
  const [paymentList, setPaymentList] = useState([]);
  
  // Edit Payment Modal states
  const [isEditPaymentModalOpen, setIsEditPaymentModalOpen] = useState(false);
  const [editPaymentData, setEditPaymentData] = useState(null);
  const [editPaymentId, setEditPaymentId] = useState("");
  
  // Data states
  const [recurringPayments, setRecurringPayments] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [lenderOptions, setLenderOptions] = useState([]);
  const [accountDetails, setAccountDetails] = useState({});
  const [lenderDetails, setLenderDetails] = useState({});
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState("");

  // Filter states
  const [filters, setFilters] = useState({
    account: "",
    lenderName: "",
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
    dueDay: "",
    recurringType: "",
    totalEmi: "",
    totalAmount: "",
    monthlyInterest: "",
    monthlyPrincipal: "",
    loanStatus: "inprogress",
    payment_status: "unpaid",
    notes: "",
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
    dueDay: "",
    recurringType: "",
    totalEmi: "",
    totalAmount: "",
    monthlyInterest: "",
    monthlyPrincipal: "",
    loanStatus: "inprogress",
    payment_status: "",
    notes: "",
    status: "1",
  });

  // Form state for Add Payment
  const [paymentFormData, setPaymentFormData] = useState({
    parent_id: "",
    amount: "",
    payment_date: new Date().toISOString().split("T")[0],
    payment_status: "paid",
    notes: "",
    payment_method: "",
    // Additional fields for different payment types
    lenderName: "",
    totalAmount: "",
    interest_rate: "",
    totalEmi: "",
    dueDay: "",
    loanStatus: "",
    monthlyInterest: "",
    monthlyPrincipal: "",
    bank_name: "",
    cheque_number: "",
    transaction_id: "",
    card_number: "",
    upi_id: "",
  });

  // Payment type options
  const paymentTypeOptions = [
    { label: "Saving", value: "Saving" },
    { label: "Loan", value: "Loan" },
    { label: "Gold Loan", value: "Gold Loan" },
    { label: "Subscription", value: "Subscription" },
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

  // Loan status options
  const loanStatusOptions = [
    { label: "In Progress", value: "inprogress" },
    { label: "Completed", value: "completed" },
    { label: "Pending", value: "pending" },
  ];

  // Due day options (1-30)
  // const dueDayOptions = Array.from({ length: 30 }, (_, i) => ({
  //   label: `Day ${i + 1}`,
  //   value: i + 1,
  // }));
  const getOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const dueDayOptions = Array.from({ length: 30 }, (_, i) => ({
  label: getOrdinal(i + 1),
  value: i + 1,
}));

  // Fetch accounts and recurring payments
  useEffect(() => {
    fetchAccounts();
    fetchLender();
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
      setAccountOptions(accounts || []);

      const accountMap = {};
      response.data.getFinanceName?.forEach((acc) => {
        accountMap[acc._id] = acc;
      });
      setAccountDetails(accountMap);
    } catch (err) {
      console.error("Failed to fetch accounts:", err);
    }
  };

  const fetchLender = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/income/finance-lender-name`,
        {
          withCredentials: true,
        },
      );
      const lenders = response.data.getFinanceName?.map((emp) => ({
        label: emp.name,
        value: emp._id,
      }));
      setLenderOptions(lenders || []);

      const lenderMap = {};
      response.data.getFinanceName?.forEach((lender) => {
        lenderMap[lender._id] = lender;
      });
      setLenderDetails(lenderMap);
    } catch (err) {
      console.error("Failed to fetch lenders:", err);
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
      setPaymentLogs(response.data.data || []);
      setBalanceAmount(response.data.balanceAmount || 0);
      setIsLogModalOpen(true);
      setTimeout(() => setIsAnimating(true), 10);
    } catch (err) {
      console.error("Failed to fetch payment logs:", err);
      Swal.fire("Error", "Failed to fetch payment history", "error");
    }
  };

  const openAddPaymentModal = (row) => {
    setSelectedRowData(row);
    setPaymentFormData({
      parent_id: row._id,
      amount: "",
      payment_date: new Date().toISOString().split("T")[0],
      payment_status: "paid",
      notes: "",
      payment_method: "",
      // Initialize with existing row data
      lenderName: row.lenderName?._id || "",
      totalAmount: row.totalAmount || "",
      interest_rate: row.interest_rate || "",
      totalEmi: row.totalEmi || "",
      dueDay: row.dueDay || "",
      loanStatus: row.loanStatus || "",
      monthlyInterest: row.monthlyInterest || "",
      monthlyPrincipal: row.monthlyPrincipal || "",
      bank_name: "",
      cheque_number: "",
      transaction_id: "",
      card_number: "",
      upi_id: "",
    });
    fetchPaymentList(row._id);
    setIsAddPaymentModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const fetchPaymentList = async (parentId) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/recurring-payment/log?parent_id=${parentId}`,
        {
          withCredentials: true,
        },
      );
      setPaymentList(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch payment list:", err);
    }
  };

  const closeAddPaymentModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsAddPaymentModalOpen(false);
      setSelectedRowData(null);
      setPaymentList([]);
    }, 250);
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Function to render conditional payment fields based on payment type for ADD mode
  const renderConditionalPaymentFields = () => {
    if (!selectedRowData) return null;
    
    switch (selectedRowData.paymentType) {
      case "Saving":
        return (
          <>
            {/* <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Lender Name *</label>
              <div className="w-2/3">
                <Dropdown
                  name="lenderName"
                  value={paymentFormData.lenderName}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, lenderName: e.value })}
                  options={lenderOptions}
                  placeholder="Select Lender"
                  className="w-full border border-gray-300 rounded-lg"
                />
              </div>
            </div> */}
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Amount *</label>
              <input
                type="number"
                name="amount"
                value={paymentFormData.amount}
                onChange={handlePaymentInputChange}
                min="1"
                max={selectedRowData.balance_amount}
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Due Day (1-30) *</label>
              <Dropdown
                name="dueDay"
                value={paymentFormData.dueDay}
                onChange={(e) => setPaymentFormData({ ...paymentFormData, dueDay: e.value })}
                options={dueDayOptions}
                placeholder="Select Due Day"
                className="w-2/3 border border-gray-300 rounded-lg"
              />
            </div> */}
          </>
        );

      case "Loan":
        return (
          <>
           <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Amount *</label>
              <input
                type="number"
                name="amount"
                value={paymentFormData.amount}
                onChange={handlePaymentInputChange}
                min="1"
                max={selectedRowData.balance_amount}
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Lender Name *</label>
              <div className="w-2/3">
                <Dropdown
                  name="lenderName"
                  value={paymentFormData.lenderName}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, lenderName: e.value })}
                  options={lenderOptions}
                  placeholder="Select Lender"
                  className="w-full border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Total Amount *</label>
              <input
                type="number"
                name="totalAmount"
                value={paymentFormData.totalAmount}
                onChange={handlePaymentInputChange}
                min="1"
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Interest Rate (%) *</label>
              <input
                type="number"
                name="interest_rate"
                value={paymentFormData.interest_rate}
                onChange={handlePaymentInputChange}
                min="0"
                step="0.01"
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Number of EMI *</label>
              <input
                type="number"
                name="totalEmi"
                value={paymentFormData.totalEmi}
                onChange={handlePaymentInputChange}
                min="1"
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Due Day (1-30) *</label>
              <Dropdown
                name="dueDay"
                value={paymentFormData.dueDay}
                onChange={(e) => setPaymentFormData({ ...paymentFormData, dueDay: e.value })}
                options={dueDayOptions}
                placeholder="Select Due Day"
                className="w-2/3 border border-gray-300 rounded-lg"
              />
            </div> */}
            {/* <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Loan Status *</label>
              <div className="w-2/3">
                <Dropdown
                  name="loanStatus"
                  value={paymentFormData.loanStatus}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, loanStatus: e.value })}
                  options={loanStatusOptions}
                  placeholder="Select Loan Status"
                  className="w-full border border-gray-300 rounded-lg"
                />
              </div>
            </div> */}
          </>
        );

      case "Gold Loan":
        return (
          <>
            {/* <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Lender Name *</label>
              <div className="w-2/3">
                <Dropdown
                  name="lenderName"
                  value={paymentFormData.lenderName}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, lenderName: e.value })}
                  options={lenderOptions}
                  placeholder="Select Lender"
                  className="w-full border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Total Amount *</label>
              <input
                type="number"
                name="totalAmount"
                value={paymentFormData.totalAmount}
                onChange={handlePaymentInputChange}
                min="1"
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Interest Rate (%) *</label>
              <input
                type="number"
                name="interest_rate"
                value={paymentFormData.interest_rate}
                onChange={handlePaymentInputChange}
                min="0"
                step="0.01"
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div> */}
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Monthly Interest Amount *</label>
              <input
                type="text"
                name="monthlyInterest"
                value={paymentFormData.monthlyInterest}
                onChange={handlePaymentInputChange}
                min="0"
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Monthly Principal Amount *</label>
              <input
                type="text"
                name="amount"
                value={paymentFormData.amount}
                onChange={handlePaymentInputChange}
                min="0"
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Due Day (1-30) *</label>
              <Dropdown
                name="dueDay"
                value={paymentFormData.dueDay}
                onChange={(e) => setPaymentFormData({ ...paymentFormData, dueDay: e.value })}
                options={dueDayOptions}
                placeholder="Select Due Day"
                className="w-2/3 border border-gray-300 rounded-lg"
              />
            </div> */}
            {/* <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Loan Status *</label>
              <div className="w-2/3">
                <Dropdown
                  name="loanStatus"
                  value={paymentFormData.loanStatus}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, loanStatus: e.value })}
                  options={loanStatusOptions}
                  placeholder="Select Loan Status"
                  className="w-full border border-gray-300 rounded-lg"
                />
              </div>
            </div> */}
          </>
        );

      case "Subscription":
        return (
          <>
            {/* <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Lender Name *</label>
              <div className="w-2/3">
                <Dropdown
                  name="lenderName"
                  value={paymentFormData.lenderName}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, lenderName: e.value })}
                  options={lenderOptions}
                  placeholder="Select Lender"
                  className="w-full border border-gray-300 rounded-lg"
                />
              </div>
            </div> */}
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Amount *</label>
              <input
                type="number"
                name="amount"
                value={paymentFormData.amount}
                onChange={handlePaymentInputChange}
                min="1"
                max={selectedRowData.balance_amount}
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Due Day (1-30) *</label>
              <Dropdown
                name="dueDay"
                value={paymentFormData.dueDay}
                onChange={(e) => setPaymentFormData({ ...paymentFormData, dueDay: e.value })}
                options={dueDayOptions}
                placeholder="Select Due Day"
                className="w-2/3 border border-gray-300 rounded-lg"
              />
            </div> */}
          </>
        );

      default:
        return null;
    }
  };

  // Function to render conditional payment fields based on payment type for EDIT mode
  const renderEditConditionalPaymentFields = () => {
    if (!selectedRowData || !editPaymentData) return null;
    
    switch (selectedRowData.paymentType) {
      case "Saving":
        return (
          <>
            {/* <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Lender Name *</label>
              <div className="w-2/3">
                <Dropdown
                  name="lenderName"
                  value={editPaymentData.lenderName}
                  onChange={(e) => setEditPaymentData({ ...editPaymentData, lenderName: e.value })}
                  options={lenderOptions}
                  placeholder="Select Lender"
                  className="w-full border border-gray-300 rounded-lg"
                />
              </div>
            </div> */}
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Amount *</label>
              <input
                type="number"
                name="amount"
                value={editPaymentData.amount}
                onChange={handleEditPaymentInputChange}
                min="1"
                max={selectedRowData.balance_amount}
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Due Day (1-30) *</label>
              <Dropdown
                name="dueDay"
                value={editPaymentData.dueDay}
                onChange={(e) => setEditPaymentData({ ...editPaymentData, dueDay: e.value })}
                options={dueDayOptions}
                placeholder="Select Due Day"
                className="w-2/3 border border-gray-300 rounded-lg"
              />
            </div> */}
          </>
        );

      case "Loan":
        return (
          <>
          <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Amount *</label>
              <input
                type="number"
                name="amount"
                value={editPaymentData.amount}
                onChange={handleEditPaymentInputChange}
                min="1"
                max={selectedRowData.balance_amount}
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Lender Name *</label>
              <div className="w-2/3">
                <Dropdown
                  name="lenderName"
                  value={editPaymentData.lenderName}
                  onChange={(e) => setEditPaymentData({ ...editPaymentData, lenderName: e.value })}
                  options={lenderOptions}
                  placeholder="Select Lender"
                  className="w-full border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Total Amount *</label>
              <input
                type="number"
                name="totalAmount"
                value={editPaymentData.totalAmount}
                onChange={handleEditPaymentInputChange}
                min="1"
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Interest Rate (%) *</label>
              <input
                type="number"
                name="interest_rate"
                value={editPaymentData.interest_rate}
                onChange={handleEditPaymentInputChange}
                min="0"
                step="0.01"
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Number of EMI *</label>
              <input
                type="number"
                name="totalEmi"
                value={editPaymentData.totalEmi}
                onChange={handleEditPaymentInputChange}
                min="1"
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Due Day (1-30) *</label>
              <Dropdown
                name="dueDay"
                value={editPaymentData.dueDay}
                onChange={(e) => setEditPaymentData({ ...editPaymentData, dueDay: e.value })}
                options={dueDayOptions}
                placeholder="Select Due Day"
                className="w-2/3 border border-gray-300 rounded-lg"
              />
            </div> */}
            {/* <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Loan Status *</label>
              <div className="w-2/3">
                <Dropdown
                  name="loanStatus"
                  value={editPaymentData.loanStatus}
                  onChange={(e) => setEditPaymentData({ ...editPaymentData, loanStatus: e.value })}
                  options={loanStatusOptions}
                  placeholder="Select Loan Status"
                  className="w-full border border-gray-300 rounded-lg"
                />
              </div>
            </div> */}
          </>
        );

      case "Gold Loan":
        return (
          <>
            {/* <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Lender Name *</label>
              <div className="w-2/3">
                <Dropdown
                  name="lenderName"
                  value={editPaymentData.lenderName}
                  onChange={(e) => setEditPaymentData({ ...editPaymentData, lenderName: e.value })}
                  options={lenderOptions}
                  placeholder="Select Lender"
                  className="w-full border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Total Amount *</label>
              <input
                type="number"
                name="totalAmount"
                value={editPaymentData.totalAmount}
                onChange={handleEditPaymentInputChange}
                min="1"
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Interest Rate (%) *</label>
              <input
                type="number"
                name="interest_rate"
                value={editPaymentData.interest_rate}
                onChange={handleEditPaymentInputChange}
                min="0"
                step="0.01"
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div> */}
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Monthly Interest Amount *</label>
              <input
                type="text"
                name="monthlyInterest"
                value={editPaymentData.monthlyInterest}
                onChange={handleEditPaymentInputChange}
                min="0"
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Monthly Principal Amount *</label>
              <input
                type="text"
                name="amount"
                value={editPaymentData.amount}
                onChange={handleEditPaymentInputChange}
                min="0"
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Due Day (1-30) *</label>
              <Dropdown
                name="dueDay"
                value={editPaymentData.dueDay}
                onChange={(e) => setEditPaymentData({ ...editPaymentData, dueDay: e.value })}
                options={dueDayOptions}
                placeholder="Select Due Day"
                className="w-2/3 border border-gray-300 rounded-lg"
              />
            </div> */}
            {/* <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Loan Status *</label>
              <div className="w-2/3">
                <Dropdown
                  name="loanStatus"
                  value={editPaymentData.loanStatus}
                  onChange={(e) => setEditPaymentData({ ...editPaymentData, loanStatus: e.value })}
                  options={loanStatusOptions}
                  placeholder="Select Loan Status"
                  className="w-full border border-gray-300 rounded-lg"
                />
              </div>
            </div> */}
          </>
        );

      case "Subscription":
        return (
          <>
          
            {/* <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Lender Name *</label>
              <div className="w-2/3">
                <Dropdown
                  name="lenderName"
                  value={editPaymentData.lenderName}
                  onChange={(e) => setEditPaymentData({ ...editPaymentData, lenderName: e.value })}
                  options={lenderOptions}
                  placeholder="Select Lender"
                  className="w-full border border-gray-300 rounded-lg"
                />
              </div>
            </div> */}
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Amount *</label>
              <input
                type="number"
                name="amount"
                value={editPaymentData.amount}
                onChange={handleEditPaymentInputChange}
                min="1"
                max={selectedRowData.balance_amount}
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Due Day (1-30) *</label>
              <Dropdown
                name="dueDay"
                value={editPaymentData.dueDay}
                onChange={(e) => setEditPaymentData({ ...editPaymentData, dueDay: e.value })}
                options={dueDayOptions}
                placeholder="Select Due Day"
                className="w-2/3 border border-gray-300 rounded-lg"
              />
            </div> */}
          </>
        );

      default:
        return null;
    }
  };

  const openEditPaymentModal = (payment) => {
    setEditPaymentId(payment._id);
    setEditPaymentData({
      amount: payment.amount || "",
      payment_date: payment.payment_date 
        ? new Date(payment.payment_date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      payment_status: payment.payment_status || "paid",
      notes: payment.notes || "",
      payment_method: payment.payment_method || "",
      loanName: payment.loanName || selectedRowData?.loanName || "",
      // Additional fields for different payment types
      lenderName: payment.lenderName?._id || selectedRowData?.lenderName?._id || "",
      totalAmount: payment.totalAmount || selectedRowData?.totalAmount || "",
      interest_rate: payment.interest_rate || selectedRowData?.interest_rate || "",
      totalEmi: payment.totalEmi || selectedRowData?.totalEmi || "",
      dueDay: payment.dueDay || selectedRowData?.dueDay || "",
      loanStatus: payment.loanStatus || selectedRowData?.loanStatus || "",
      monthlyInterest: payment.monthlyInterest || selectedRowData?.monthlyInterest || "",
      monthlyPrincipal: payment.monthlyPrincipal || selectedRowData?.monthlyPrincipal || "",
      bank_name: payment.bank_name || "",
      cheque_number: payment.cheque_number || "",
      transaction_id: payment.transaction_id || "",
      card_number: payment.card_number || "",
      upi_id: payment.upi_id || "",
    });
    setIsEditPaymentModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeEditPaymentModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsEditPaymentModalOpen(false);
      setEditPaymentData(null);
      setEditPaymentId("");
    }, 250);
  };

  const handleEditPaymentInputChange = (e) => {
    const { name, value } = e.target;
    setEditPaymentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditPaymentSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.put(
        `${API_URL}/api/recurring-payment/update-log/${editPaymentId}`,
        editPaymentData,
        { withCredentials: true }
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Payment updated successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        
        // Refresh payment list
        fetchPaymentList(paymentFormData.parent_id);
        fetchRecurringPayments();
        // closeEditPaymentModal();
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        Swal.fire("Error", "Failed to update payment", "error");
      }
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(
        `${API_URL}/api/recurring-payment/add-payment`,
        paymentFormData,
        { withCredentials: true },
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Payment added successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        
        // Refresh payment list and balance
        fetchPaymentList(paymentFormData.parent_id);
        // closeAddPaymentModal();
        fetchRecurringPayments();
       
        
        // Reset form
        setPaymentFormData({
          ...paymentFormData,
          amount: "",
          notes: "",
          payment_method: "",
          bank_name: "",
          cheque_number: "",
          transaction_id: "",
          card_number: "",
          upi_id: "",
        });
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        Swal.fire("Error", "Failed to add payment", "error");
      }
    }
  };

  const handleDeletePayment = async (paymentId) => {
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
          `${API_URL}/api/recurring-payment/delete-payment/${paymentId}`,
          { withCredentials: true },
        );

        if (response.data.success) {
          Swal.fire("Deleted!", "Payment has been deleted.", "success");
          fetchPaymentList(paymentFormData.parent_id);
          fetchRecurringPayments();
        }
      } catch (err) {
        Swal.fire("Error", "Failed to delete payment", "error");
      }
    }
  };

  const openViewModal = (row) => {
    setViewData(row);
    setIsViewModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeViewModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsViewModalOpen(false);
      setViewData(null);
    }, 250);
  };

  const openAddModal = () => {
    setFormData({
      account: "",
      lenderName: "",
      paymentType: "",
      loanName:"",
      amount: "",
      dueDate: "",
      dueDay: "",
      recurringType: "",
      totalEmi: "",
      totalAmount: "",
      start_date: "",
      end_date: "",
      balance_amount: "",
      interest_rate: "",
      monthlyInterest: "",
      monthlyPrincipal: "",
      loanStatus: "inprogress",
      payment_status: "unpaid",
      notes: "",
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
    try {
      const response = await axios.get(
        `${API_URL}/api/recurring-payment/log?parent_id=${row._id}`,
        {
          withCredentials: true,
        },
      );

      setEditId(row._id);
      const accountBalance = response.data.balanceAmount || 0;

      setEditFormData({
        account: row.account?._id || "",
        lenderName: row.lenderName?._id || "",
        paymentType: row.paymentType || "",
        amount: row.amount || "",
        dueDate: row.dueDate
          ? new Date(row.dueDate).toISOString().split("T")[0]
          : "",
        dueDay: row.dueDay || "",
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
        loanName:row.loanName || "",
        interest_rate: row.interest_rate || "",
        monthlyInterest: row.monthlyInterest || "",
        monthlyPrincipal: row.monthlyPrincipal || "",
        loanStatus: row.loanStatus || "inprogress",
        payment_status: row.payment_status || "unpaid",
        notes: row.notes || "",
        status: row.status || "1",
      });
      setErrors({});
      setIsEditModalOpen(true);
      setTimeout(() => setIsAnimating(true), 10);
    } catch (err) {
      console.error("Failed to fetch payment logs for edit:", err);
      Swal.fire("Error", "Failed to load payment data for editing", "error");
    }
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

const handleInputChange = (e, isEdit = false) => {
  const { name, value } = e.target;

  const updateState = (prev) => {
    const updated = { ...prev, [name]: value };

    if (name === "totalAmount" || name === "interest_rate") {
      const total = Number(updated.totalAmount || 0);
      const rate = Number(updated.interest_rate || 0);

      updated.monthlyInterest = ((total * rate) / 1200).toFixed(2);
    }

    return updated;
  };

  if (isEdit) {
    setEditFormData(updateState);
  } else {
    setFormData(updateState);
  }
};

  const handleAccountChange = (value, isEdit = false) => {
    if (isEdit) {
      setEditFormData((prev) => ({ ...prev, account: value }));
      if (accountDetails[value]?.balance) {
        setEditFormData((prev) => ({
          ...prev,
          balance_amount: accountDetails[value].balance,
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, account: value }));
      if (accountDetails[value]?.balance) {
        setFormData((prev) => ({
          ...prev,
          balance_amount: accountDetails[value].balance,
        }));
      }
    }
  };

  const handleLenderChange = (value, isEdit = false) => {
    if (isEdit) {
      setEditFormData((prev) => ({ ...prev, lenderName: value }));
    } else {
      setFormData((prev) => ({ ...prev, lenderName: value }));
    }
  };

  const renderViewFields = () => {
    if (!viewData) return null;

    const getStatusColor = (status) => {
      return status === "1" ? "text-green-600" : "text-red-600";
    };

    const getPaymentStatusColor = (status) => {
      return status === "paid" ? "text-green-600" : "text-red-600";
    };

    const getLoanStatusColor = (status) => {
      switch (status) {
        case "completed":
          return "text-green-600";
        case "inprogress":
          return "text-blue-600";
        case "pending":
          return "text-yellow-600";
        default:
          return "text-gray-600";
      }
    };

    const formatCurrency = (value) => {
      if (!value) return "₹0";
      return `₹${parseFloat(value).toLocaleString("en-IN")}`;
    };

    return (
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <label className="text-xs text-gray-500">Account</label>
          <p className="font-medium text-sm break-words">
            {viewData.account?.name || "-"}
          </p>
        </div>
        
        {viewData.lenderName && (
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs text-gray-500">Lender Name</label>
            <p className="font-medium text-sm">
              {viewData.lenderName?.name || "-"}
            </p>
          </div>
        )}
        {viewData.loanName && (
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs text-gray-500">Loan Name</label>
            <p className="font-medium text-sm">
              {viewData.loanName || "-"}
            </p>
          </div>
        )}

        <div className="col-span-2 sm:col-span-1">
          <label className="text-xs text-gray-500">Payment Type</label>
          <p className="font-medium text-sm capitalize">
            {viewData.paymentType || "-"}
          </p>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="text-xs text-gray-500">Recurring Type</label>
          <p className="font-medium text-sm">
            {viewData.recurringType || "-"}
          </p>
        </div>

        {viewData.amount && (
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs text-gray-500">Amount</label>
            <p className="font-medium text-sm">
              {formatCurrency(viewData.amount)}
            </p>
          </div>
        )}

        {viewData.totalAmount && (
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs text-gray-500">Total Amount</label>
            <p className="font-medium text-sm">
              {formatCurrency(viewData.totalAmount)}
            </p>
          </div>
        )}

        {viewData.interest_rate && (
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs text-gray-500">Interest Rate</label>
            <p className="font-medium text-sm">
              {viewData.interest_rate}%
            </p>
          </div>
        )}

        {viewData.totalEmi && (
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs text-gray-500">Number of EMI</label>
            <p className="font-medium text-sm">{viewData.totalEmi}</p>
          </div>
        )}

        {viewData.monthlyInterest && (
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs text-gray-500">Monthly Interest</label>
            <p className="font-medium text-sm">
              {formatCurrency(viewData.monthlyInterest)}
            </p>
          </div>
        )}

        {viewData.monthlyPrincipal && (
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs text-gray-500">Monthly Principal</label>
            <p className="font-medium text-sm">
              {formatCurrency(viewData.monthlyPrincipal)}
            </p>
          </div>
        )}

        <div className="col-span-2 sm:col-span-1">
          <label className="text-xs text-gray-500">Due Day</label>
          <p className="font-medium text-sm">{viewData.dueDay || "-"}</p>
        </div>

        {viewData.loanStatus && (
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs text-gray-500">Loan Status</label>
            <p className={`font-medium text-sm capitalize ${getLoanStatusColor(viewData.loanStatus)}`}>
              {viewData.loanStatus}
            </p>
          </div>
        )}

        {viewData.balance_amount !== undefined && (
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs text-gray-500">Balance Amount</label>
            <p className="font-medium text-sm">
              {formatCurrency(viewData.balance_amount)}
            </p>
          </div>
        )}

        <div className="col-span-2 sm:col-span-1">
          <label className="text-xs text-gray-500">Payment Status</label>
          <p className={`font-medium text-sm capitalize ${getPaymentStatusColor(viewData.payment_status)}`}>
            {viewData.payment_status || "-"}
          </p>
        </div>

        {viewData.notes && (
          <div className="col-span-2">
            <label className="text-xs text-gray-500">Notes</label>
            <p className="font-medium text-sm bg-gray-50 p-2 rounded break-words">
              {viewData.notes}
            </p>
          </div>
        )}

        <div className="col-span-2 sm:col-span-1">
          <label className="text-xs text-gray-500">Status</label>
          <p className={`font-medium text-sm ${getStatusColor(viewData.status)}`}>
            {viewData.status === "1" ? "Active" : "Inactive"}
          </p>
        </div>
      </div>
    );
  };

  const renderConditionalFields = (formData, setFormData, isEdit = false) => {
    switch (formData.paymentType) {
      case "Saving":
        return (
          <>
          <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Lender Name *</label>
              <div className="w-2/3">
                <Dropdown
                  name="lenderName"
                  value={formData.lenderName}
                  onChange={(e) => handleLenderChange(e.value, isEdit)}
                  options={lenderOptions}
                  placeholder="Select Lender"
                  className="w-full border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Loan Name*</label>
              <input
                type="text"
                name="loanName"
                value={formData.loanName || ""}
                onChange={(e) => handleInputChange(e, isEdit)}
                min="1"
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Amount *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount || ""}
                onChange={(e) => handleInputChange(e, isEdit)}
                min="1"
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Due Date *</label>
              <Dropdown
                name="dueDay"
                value={formData.dueDay}
                onChange={(e) => {
                  if (isEdit) {
                    setEditFormData({ ...formData, dueDay: e.value });
                  } else {
                    setFormData({ ...formData, dueDay: e.value });
                  }
                }}
                options={dueDayOptions}
                placeholder="Select Due Day"
                className="w-2/3 border border-gray-300 rounded-lg"
              />
            </div>
          </>
        );

      case "Loan":
        return (
          <>
          <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Lender Name *</label>
              <div className="w-2/3">
                <Dropdown
                  name="lenderName"
                  value={formData.lenderName}
                  onChange={(e) => handleLenderChange(e.value, isEdit)}
                  options={lenderOptions}
                  placeholder="Select Lender"
                  className="w-full border border-gray-300 rounded-lg"
                />
              </div>
            </div>

          <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Loan Name*</label>
              <input
                type="text"
                name="loanName"
                value={formData.loanName || ""}
                onChange={(e) => handleInputChange(e, isEdit)}
                min="1"
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

           

            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Total Amount *</label>
              <input
                type="number"
                name="totalAmount"
                value={formData.totalAmount || ""}
                onChange={(e) => handleInputChange(e, isEdit)}
                min="1"
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Interest Rate (%) *</label>
              <input
                type="number"
                name="interest_rate"
                value={formData.interest_rate || ""}
                onChange={(e) => handleInputChange(e, isEdit)}
                min="0"
                step="0.01"
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Number of EMI *</label>
              <input
                type="number"
                name="totalEmi"
                value={formData.totalEmi || ""}
                onChange={(e) => handleInputChange(e, isEdit)}
                min="1"
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Due Date*</label>
              <Dropdown
                name="dueDay"
                value={formData.dueDay}
                onChange={(e) => {
                  if (isEdit) {
                    setEditFormData({ ...formData, dueDay: e.value });
                  } else {
                    setFormData({ ...formData, dueDay: e.value });
                  }
                }}
                options={dueDayOptions}
                placeholder="Select Due Day"
                className="w-2/3 border border-gray-300 rounded-lg"
              />
            </div>

            {/* <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Loan Status *</label>
              <div className="w-2/3">
                <Dropdown
                  name="loanStatus"
                  value={formData.loanStatus}
                  onChange={(e) => {
                    if (isEdit) {
                      setEditFormData({ ...formData, loanStatus: e.value });
                    } else {
                      setFormData({ ...formData, loanStatus: e.value });
                    }
                  }}
                  options={loanStatusOptions}
                  placeholder="Select Loan Status"
                  className="w-full border border-gray-300 rounded-lg"
                />
              </div>
            </div> */}
          </>
        );

      case "Gold Loan":
        return (
          <>
          
<div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Lender Name *</label>
              <div className="w-2/3">
                <Dropdown
                  name="lenderName"
                  value={formData.lenderName}
                  onChange={(e) => handleLenderChange(e.value, isEdit)}
                  options={lenderOptions}
                  placeholder="Select Lender"
                  className="w-full border border-gray-300 rounded-lg"
                />
              </div>
            </div>
             <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Loan Name*</label>
              <input
                type="text"
                name="loanName"
                value={formData.loanName || ""}
                onChange={(e) => handleInputChange(e, isEdit)}
                min="1"
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Total Amount *</label>
              <input
                type="number"
                name="totalAmount"
                value={formData.totalAmount || ""}
                onChange={(e) => handleInputChange(e, isEdit)}
                min="1"
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Interest Rate (%) *</label>
              <input
                type="number"
                name="interest_rate"
                value={formData.interest_rate || ""}
                onChange={(e) => handleInputChange(e, isEdit)}
                min="0"
                step="0.01"
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Monthly Interest Amount *</label>
              <input
                type="text"
                name="monthlyInterest"
                value={formData.monthlyInterest || ""}
                onChange={(e) => handleInputChange(e, isEdit)}
                min="0"
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Due Date*</label>
              <Dropdown
                name="dueDay"
                value={formData.dueDay}
                onChange={(e) => {
                  if (isEdit) {
                    setEditFormData({ ...formData, dueDay: e.value });
                  } else {
                    setFormData({ ...formData, dueDay: e.value });
                  }
                }}
                options={dueDayOptions}
                placeholder="Select Due Day"
                className="w-2/3 border border-gray-300 rounded-lg"
              />
            </div>

            {/* <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Loan Status *</label>
              <div className="w-2/3">
                <Dropdown
                  name="loanStatus"
                  value={formData.loanStatus}
                  onChange={(e) => {
                    if (isEdit) {
                      setEditFormData({ ...formData, loanStatus: e.value });
                    } else {
                      setFormData({ ...formData, loanStatus: e.value });
                    }
                  }}
                  options={loanStatusOptions}
                  placeholder="Select Loan Status"
                  className="w-full border border-gray-300 rounded-lg"
                />
              </div>
            </div> */}
          </>
        );

      case "Subscription":
        return (
          <>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Lender Name *</label>
              <div className="w-2/3">
                <Dropdown
                  name="lenderName"
                  value={formData.lenderName}
                  onChange={(e) => handleLenderChange(e.value, isEdit)}
                  options={lenderOptions}
                  placeholder="Select Lender"
                  className="w-full border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Loan Name*</label>
              <input
                type="text"
                name="loanName"
                value={formData.loanName || ""}
                onChange={(e) => handleInputChange(e, isEdit)}
                min="1"
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Amount *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount || ""}
                onChange={(e) => handleInputChange(e, isEdit)}
                min="1"
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between items-center">
              <label className="text-sm font-medium w-1/3">Due Date *</label>
              <Dropdown
                name="dueDay"
                value={formData.dueDay}
                onChange={(e) => {
                  if (isEdit) {
                    setEditFormData({ ...formData, dueDay: e.value });
                  } else {
                    setFormData({ ...formData, dueDay: e.value });
                  }
                }}
                options={dueDayOptions}
                placeholder="Select Due Day"
                className="w-2/3 border border-gray-300 rounded-lg"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Recurring Payment Data:", formData);

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
    console.log("Updating Recurring Payment Data:", editFormData);

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

  const filteredData = useMemo(() => {
    return recurringPayments.filter((row) => {
      const matchesAccount =
        !filters.account || row.account?._id === filters.account;
      const matchesLender =
        !filters.lenderName || row.lenderName?._id === filters.lenderName;
      const matchesStatus = !filters.status || row.status === filters.status;
      const matchesDueDate =
        !filters.dueDate ||
        (row.dueDate && new Date(row.dueDate).toLocaleDateString("en-GB") ===
          new Date(filters.dueDate).toLocaleDateString("en-GB"));
      return matchesAccount && matchesLender && matchesStatus && matchesDueDate;
    });
  }, [recurringPayments, filters]);

  const columns = [
    {
      title: "S.no",
      data: null,
      render: (data, type, row, meta) => meta.row + 1,
    },
   {
  title: "Account",
  data: null,
  render: (row) => {
    const name = row.account?.name;

    if (!name) return "-";

    return name.length > 12 ? name.slice(0, 12) + "..." : name;
  },
},
    {
      title: "Lender Name",
      data: null,
      render: (row) => row.lenderName?.name || "-",
    },
    // {
    //   title: "Payment Type",
    //   data: "paymentType",
    // },
    {
      title: "Total Amount",
      data: "totalAmount",
      render: (data) => {
        if (!data && data !== 0) return "₹0";
        return `₹${parseFloat(data).toLocaleString("en-IN")}`;
      },
    },
    {
      title: "Loan Status",
      data: "loanStatus",
      render: (data) => {
        if (!data) return "-";
        const colors = {
          inprogress: "text-blue-600 bg-blue-100",
          completed: "text-green-600 bg-green-100",
          pending: "text-yellow-600 bg-yellow-100",
        };
        const colorClass = colors[data] || "text-gray-600 bg-gray-100";
        return `<span class="${colorClass} px-2 py-1 rounded-full text-xs font-semibold capitalize">${data}</span>`;
      },
    },
    // {
    //   title: "Payment Status",
    //   data: "payment_status",
    //   render: (data) => {
    //     if (!data) return "-";
    //     const color = data === "paid" ? "text-green-600" : "text-red-600";
    //     const bgColor = data === "paid" ? "bg-green-100" : "bg-red-100";
    //     return `<span class="${color} ${bgColor} px-2 py-1 rounded-full text-xs font-semibold capitalize">${data}</span>`;
    //   },
    // },
    {
      title: "Status",
      data: "status",
      render: (data, type, row) => {
        const isActive = data === "1";
        return `<div class="${isActive ? "text-green-600 border-green-600" : "text-red-600 border-red-600"} border rounded-full text-center w-24 text-xs font-medium py-1">
                  ${isActive ? "ACTIVE" : "INACTIVE"}
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
              <div className="flex gap-2 items-center justify-center">
                <FaPlusCircle
                  className="cursor-pointer text-blue-500 text-base hover:text-blue-700"
                  onClick={() => openAddPaymentModal(row)}
                  title="Add Payment"
                />
                <FaEye
                  className="cursor-pointer text-green-600 text-base hover:text-green-800"
                  onClick={() => openViewModal(row)}
                  title="View Details"
                />
                <FaHistory
                  className="cursor-pointer text-purple-600 text-base hover:text-purple-800"
                  onClick={() => fetchPaymentLogs(row._id)}
                  title="View History"
                />
                <TfiPencilAlt
                  className="cursor-pointer text-blue-600 text-base hover:text-blue-800"
                  onClick={() => openEditModal(row)}
                />
                <MdOutlineDeleteOutline
                  className="cursor-pointer text-red-600 text-base hover:text-red-800"
                  onClick={() => handleDelete(row._id)}
                />
              </div>,
            );
          }
        }, 0);
        return `<div id="${id}"></div>`;
      },
    },
  ];

  const paymentListColumns = [
  {
    title: "S.no",
    data: null,
    render: (data, type, row, meta) => meta.row + 1,
  },
  {
    title: "Date",
    data: "payment_date",
    render: (data) => data ? formatDateTime(data) : "-",
  },
  {
    title: "Amount",
    data: "amount",
    render: (data) => {
      if (!data && data !== 0) return "₹0";
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
      if (!data && data !== 0) return "₹0";
      return `₹${parseFloat(data).toLocaleString("en-IN")}`;
    },
  },
  {
    title: "Notes",
    data: "notes",
    render: (data) => data || "-",
  },
  {
    title: "Action",
    data: null,
    render: (data, type, row) => {
      const id = `payment-actions-${row._id}`;
      setTimeout(() => {
        const container = document.getElementById(id);
        if (container) {
          if (!container._root) {
            container._root = createRoot(container);
          }
          container._root.render(
            <div className="flex gap-2 items-center justify-center">
              <TfiPencilAlt
                className="cursor-pointer text-blue-600 text-base hover:text-blue-800"
                onClick={() => openEditPaymentModal(row)}
                title="Edit Payment"
              />
              <MdOutlineDeleteOutline
                className="cursor-pointer text-red-600 text-base hover:text-red-800"
                onClick={() => handleDeletePayment(row._id)}
                title="Delete Payment"
              />
            </div>
          );
        }
      }, 0);
      return `<div id="${id}"></div>`;
    },
  },
];

  const logColumns = [
    {
      title: "S.no",
      data: null,
      render: (data, type, row, meta) => meta.row + 1,
    },
    {
      title: "Date",
      data: "createdAt",
      render: (data) => data ? formatDateTime(data) : "-",
    },
    {
      title: "Amount",
      data: "amount",
      render: (data) => {
        if (!data && data !== 0) return "₹0";
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
        if (!data && data !== 0) return "₹0";
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
      render: (data) => data ? formatDateTime(data) : "-",
    },
  ];

  // Global function for payment deletion
  window.handleDeletePayment = (paymentId) => {
    const result = Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_URL}/api/recurring-payment/delete-payment/${paymentId}`, {
            withCredentials: true,
          })
          .then((response) => {
            if (response.data.success) {
              Swal.fire("Deleted!", "Payment has been deleted.", "success");
              fetchPaymentList(paymentFormData.parent_id);
              fetchRecurringPayments();
            }
          })
          .catch((err) => {
            Swal.fire("Error", "Failed to delete payment", "error");
          });
      }
    });
  };

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-2 md:pt-4 overflow-x-hidden">
      <div>
        <div className="cursor-pointer">
          <Mobile_Sidebar />
        </div>

        <div className="flex justify-end mt-2 md:mt-0 gap-1 items-center">
          <p
            className="text-sm text-gray-500 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </p>
          <p>{">"}</p>
          <p className="text-sm text-blue-500">Recurring Payments</p>
        </div>

        <div className="flex justify-between mt-1 md:mt-4 mb-2 md:mb-3">
          <h1 className="text-2xl md:text-3xl font-semibold">
            Recurring Payments
          </h1>
          <button
            onClick={openAddModal}
            className="px-3 py-2 text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-2xl"
          >
            Add
          </button>
        </div>

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
            <label className="text-sm font-medium mb-1">Lender</label>
            <Dropdown
              value={tempFilters.lenderName}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, lenderName: e.value })
              }
              options={ lenderOptions}
              placeholder="All Lender"
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
              setTempFilters({
                account: "",
                lenderName: "",
                status: "",
                dueDate: "",
              });
              setFilters({
                account: "",
                lenderName: "",
                status: "",
                dueDate: "",
              });
            }}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Reset
          </button>
        </div>

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
              }}
              className="display nowrap bg-white"
            />
          </div>
        </div>

        {/* Add Payment Modal */}
        {isAddPaymentModalOpen && selectedRowData && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50">
            <div className="absolute inset-0" onClick={closeAddPaymentModal}></div>
            <div
              className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[50vw] bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${
                isAnimating ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full mt-2 ms-2 border-2 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                onClick={closeAddPaymentModal}
              >
                <IoClose className="w-3 h-3" />
              </div>
              <div className="p-5">
                <h2 className="text-xl font-semibold mb-4">
                  Add Payment - {selectedRowData.account?.name} ({selectedRowData.paymentType})
                </h2>
                
                {/* Payment Summary */}
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

                    <div>
                      <label className="text-xs text-gray-500">Account</label>
                      <p className="font-medium text-sm break-words">
                        {selectedRowData?.account?.name || "-"}
                      </p>
                    </div>

                    {selectedRowData?.lenderName?.name && (
                      <div>
                        <label className="text-xs text-gray-500">Lender Name</label>
                        <p className="font-medium text-sm">
                          {selectedRowData.lenderName.name}
                        </p>
                      </div>
                    )}
                    {selectedRowData?.loanName && (
                      <div>
                        <label className="text-xs text-gray-500">Loan Name</label>
                        <p className="font-medium text-sm">
                          {selectedRowData.loanName}
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="text-xs text-gray-500">Payment Type</label>
                      <p className="font-medium text-sm capitalize">
                        {selectedRowData?.paymentType || "-"}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500">Recurring Type</label>
                      <p className="font-medium text-sm">
                        {selectedRowData?.recurringType || "-"}
                      </p>
                    </div>

                    {selectedRowData?.amount && (
                      <div>
                        <label className="text-xs text-gray-500">Amount</label>
                        <p className="font-medium text-sm">
                          ₹{Number(selectedRowData.amount).toLocaleString("en-IN")}
                        </p>
                      </div>
                    )}

                    {selectedRowData?.totalAmount && (
                      <div>
                        <label className="text-xs text-gray-500">Total Amount</label>
                        <p className="font-medium text-sm">
                          ₹{Number(selectedRowData.totalAmount).toLocaleString("en-IN")}
                        </p>
                      </div>
                    )}

                    {selectedRowData?.interest_rate && (
                      <div>
                        <label className="text-xs text-gray-500">Interest Rate</label>
                        <p className="font-medium text-sm">
                          {selectedRowData.interest_rate}%
                        </p>
                      </div>
                    )}

                    {selectedRowData?.totalEmi && (
                      <div>
                        <label className="text-xs text-gray-500">Number of EMI</label>
                        <p className="font-medium text-sm">
                          {selectedRowData.totalEmi}
                        </p>
                      </div>
                    )}

                    {selectedRowData?.monthlyInterest && (
                      <div>
                        <label className="text-xs text-gray-500">Monthly Interest</label>
                        <p className="font-medium text-sm">
                          ₹{Number(selectedRowData.monthlyInterest).toLocaleString("en-IN")}
                        </p>
                      </div>
                    )}

                    {selectedRowData?.monthlyPrincipal && (
                      <div>
                        <label className="text-xs text-gray-500">Monthly Principal</label>
                        <p className="font-medium text-sm">
                          ₹{Number(selectedRowData.monthlyPrincipal).toLocaleString("en-IN")}
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="text-xs text-gray-500">Due Date</label>
                      <p className="font-medium text-sm">
                        {selectedRowData?.dueDay || "-"}
                      </p>
                    </div>

                    {selectedRowData?.loanStatus && (
                      <div>
                        <label className="text-xs text-gray-500">Loan Status</label>
                        <p className="font-medium text-sm">
                          {selectedRowData.loanStatus}
                        </p>
                      </div>
                    )}

                    {/* {selectedRowData?.balance_amount !== undefined && (
                      <div>
                        <label className="text-xs text-gray-500">Balance Amount</label>
                        <p className="font-medium text-sm">
                          ₹{Number(selectedRowData.balance_amount).toLocaleString("en-IN")}
                        </p>
                      </div>
                    )} */}

                    {/* <div>
                      <label className="text-xs text-gray-500">Payment Status</label>
                      <p
                        className={`font-medium text-sm capitalize ${
                          selectedRowData?.payment_status === "paid"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedRowData?.payment_status || "-"}
                      </p>
                    </div> */}

                    {selectedRowData?.notes && (
                      <div >
                        <label className="text-xs text-gray-500">Notes</label>
                        <p className="font-medium text-sm">
                          {selectedRowData.notes}
                        </p>
                      </div>
                    )}

                    {/* <div>
                      <label className="text-xs text-gray-500">Status</label>
                      <p
                        className={`font-medium text-sm ${
                          selectedRowData?.status === "1"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedRowData?.status === "1" ? "Active" : "Inactive"}
                      </p>
                    </div> */}

                  </div>
                </div>

                {/* Add Payment Form */}
                <form onSubmit={handlePaymentSubmit} className="mb-8">
                  <h3 className="text-lg font-medium mb-3">Add New Payment</h3>
                  <div className="space-y-4">
                  
                    {/* Conditional fields based on payment type */}
                    {renderConditionalPaymentFields()}

                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Payment Date *
                      </label>
                      <input
                        type="date"
                        name="payment_date"
                        value={paymentFormData.payment_date}
                        onChange={handlePaymentInputChange}
                        required
                        className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Payment Status
                      </label>
                      <div className="w-2/3">
                        <Dropdown
                          name="payment_status"
                          value={paymentFormData.payment_status}
                          onChange={(e) => setPaymentFormData({ ...paymentFormData, payment_status: e.value })}
                          options={statusPaymentOptions}
                          placeholder="Select Status"
                          className="w-full border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>

                    
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        value={paymentFormData.notes}
                        onChange={handlePaymentInputChange}
                        rows="2"
                        className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter any notes..."
                      />
                    </div>

                    {/* Loan Status field - Added below Notes */}
                    {/* <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Loan Status
                      </label>
                      <div className="w-2/3">
                        <Dropdown
                          name="loanStatus"
                          value={paymentFormData.loanStatus}
                          onChange={(e) => setPaymentFormData({ ...paymentFormData, loanStatus: e.value })}
                          options={loanStatusOptions}
                          placeholder="Select Loan Status"
                          className="w-full border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div> */}
                  </div>

                  <div className="flex gap-2 justify-end mt-4">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 font-semibold rounded-full"
                    >
                      Add Payment
                    </button>
                  </div>
                </form>

                {/* Payment List */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Payment History</h3>
                  {paymentList.length > 0 ? (
                    <div className="datatable-container">
                      <div className="table-scroll-container">
                        <DataTable
                          data={paymentList}
                          columns={paymentListColumns}
                          options={{
                            paging: true,
                            searching: true,
                            ordering: true,
                            scrollX: true,
                            pageLength: 5,
                            lengthMenu: [
                              [5, 10, 25, 50],
                              [5, 10, 25, 50],
                            ],
                          }}
                          className="display nowrap bg-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      No payments added yet
                    </p>
                  )}
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={closeAddPaymentModal}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 font-semibold rounded-full"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Payment Modal */}
        {isEditPaymentModalOpen && selectedRowData && editPaymentData && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-[60]">
            <div className="absolute inset-0" onClick={closeEditPaymentModal}></div>
            <div
              className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[50vw] bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${
                isAnimating ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full mt-2 ms-2 border-2 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                onClick={closeEditPaymentModal}
              >
                <IoClose className="w-3 h-3" />
              </div>
              <div className="p-5">
                <h2 className="text-xl font-semibold mb-4">
                  Edit Payment - {selectedRowData.account?.name} ({selectedRowData.paymentType})
                </h2>
                
                {/* Payment Summary */}
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">Account</label>
                      <p className="font-medium text-sm break-words">
                        {selectedRowData?.account?.name || "-"}
                      </p>
                    </div>

                    {selectedRowData?.lenderName?.name && (
                      <div>
                        <label className="text-xs text-gray-500">Lender Name</label>
                        <p className="font-medium text-sm">
                          {selectedRowData.lenderName.name}
                        </p>
                      </div>
                    )}
                    {selectedRowData?.loanName && (
                      <div>
                        <label className="text-xs text-gray-500">Loan Name</label>
                        <p className="font-medium text-sm">
                          {selectedRowData.loanName}
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="text-xs text-gray-500">Payment Type</label>
                      <p className="font-medium text-sm capitalize">
                        {selectedRowData?.paymentType || "-"}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500">Balance Amount</label>
                      <p className="font-medium text-sm">
                        ₹{Number(selectedRowData.balance_amount || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Edit Payment Form */}
                <form onSubmit={handleEditPaymentSubmit}>
                  <h3 className="text-lg font-medium mb-3">Edit Payment</h3>
                  <div className="space-y-4">
                    {/* Conditional fields based on payment type for edit mode */}
                    {renderEditConditionalPaymentFields()}

                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Payment Date *
                      </label>
                      <input
                        type="date"
                        name="payment_date"
                        value={editPaymentData.payment_date}
                        onChange={handleEditPaymentInputChange}
                        required
                        className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Payment Status
                      </label>
                      <div className="w-2/3">
                        <Dropdown
                          name="payment_status"
                          value={editPaymentData.payment_status}
                          onChange={(e) => setEditPaymentData({ ...editPaymentData, payment_status: e.value })}
                          options={statusPaymentOptions}
                          placeholder="Select Status"
                          className="w-full border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>

                    
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        value={editPaymentData.notes}
                        onChange={handleEditPaymentInputChange}
                        rows="2"
                        className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter any notes..."
                      />
                    </div>

                    {/* Loan Status field - Added below Notes */}
                    {/* <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Loan Status
                      </label>
                      <div className="w-2/3">
                        <Dropdown
                          name="loanStatus"
                          value={editPaymentData.loanStatus}
                          onChange={(e) => setEditPaymentData({ ...editPaymentData, loanStatus: e.value })}
                          options={loanStatusOptions}
                          placeholder="Select Loan Status"
                          className="w-full border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div> */}
                  </div>

                  <div className="flex gap-2 justify-end mt-6">
                    <button
                      type="button"
                      onClick={closeEditPaymentModal}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 font-semibold rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 font-semibold rounded-full"
                    >
                      Update Payment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

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
                <IoClose className="w-3 h-3" />
              </div>
              <div className="p-5">
                <h2 className="text-xl font-semibold mb-4">
                  Add Recurring Payment
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
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

                    <div className="flex justify-between items-start">
                      <label className="text-sm font-medium w-1/3">
                        Payment Type *
                      </label>
                      <div className="w-2/3">
                        <div className="flex flex-wrap gap-4">
                          {paymentTypeOptions.map((option) => (
                            <div
                              key={option.value}
                              className="flex items-center"
                            >
                              <input
                                type="radio"
                                name="paymentType"
                                id={`addPayment${option.value.replace(" ", "")}`}
                                value={option.value}
                                checked={formData.paymentType === option.value}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    paymentType: e.target.value,
                                  })
                                }
                                className="mr-2 w-4 h-4 text-blue-600"
                              />
                              <label
                                htmlFor={`addPayment${option.value.replace(" ", "")}`}
                                className="text-sm"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                        {errors.paymentType && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.paymentType}
                          </p>
                        )}
                      </div>
                    </div>

                    {renderConditionalFields(formData, setFormData, false)}

                    {formData.paymentType && (
                      <>
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium w-1/3">
                            Recurring Type *
                          </label>
                          <div className="w-2/3">
                            <Dropdown
                              name="recurringType"
                              value={formData.recurringType}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
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

                        {/* <div className="flex justify-between items-center">
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
                              }}
                              options={statusPaymentOptions}
                              placeholder="Select Payment Status"
                              className="w-full border border-gray-300 rounded-lg"
                            />
                          </div>
                        </div> */}

                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium w-1/3">
                            Notes
                          </label>
                          <textarea
                            name="notes"
                            value={formData.notes || ""}
                            onChange={(e) => handleInputChange(e, false)}
                            rows="3"
                            className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter any additional notes..."
                          />
                        </div>

                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium w-1/3">
                            Status
                          </label>
                          <div className="w-2/3">
                            <Dropdown
                              name="status"
                              value={formData.status}
                              onChange={(e) => {
                                setFormData({ ...formData, status: e.value });
                              }}
                              options={statusOptions}
                              placeholder="Select Status"
                              className="w-full border border-gray-300 rounded-lg"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

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
                <IoClose className="w-3 h-3" />
              </div>
              <div className="p-5">
                <h2 className="text-xl font-semibold mb-4">
                  Edit Recurring Payment
                </h2>
                <form onSubmit={handleEditSubmit}>
                  <div className="space-y-4">
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

                    <div className="flex justify-between items-start">
                      <label className="text-sm font-medium w-1/3">
                        Payment Type *
                      </label>
                      <div className="w-2/3">
                        <div className="flex flex-wrap gap-4">
                          {paymentTypeOptions.map((option) => (
                            <div
                              key={option.value}
                              className="flex items-center"
                            >
                              <input
                                type="radio"
                                name="paymentType"
                                id={`editPayment${option.value.replace(" ", "")}`}
                                value={option.value}
                                checked={
                                  editFormData.paymentType === option.value
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
                                htmlFor={`editPayment${option.value.replace(" ", "")}`}
                                className="text-sm"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                        {errors.paymentType && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.paymentType}
                          </p>
                        )}
                      </div>
                    </div>

                    {renderConditionalFields(
                      editFormData,
                      setEditFormData,
                      true,
                    )}

                    {editFormData.paymentType && (
                      <>
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
                              }}
                              options={statusPaymentOptions}
                              placeholder="Select Payment Status"
                              className="w-full border border-gray-300 rounded-lg"
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium w-1/3">
                            Balance Amount
                          </label>
                          <input
                            type="number"
                            name="balance_amount"
                            value={editFormData.balance_amount || ""}
                            onChange={(e) => handleInputChange(e, true)}
                            className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                            readOnly
                          />
                        </div>

                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium w-1/3">
                            Notes
                          </label>
                          <textarea
                            name="notes"
                            value={editFormData.notes || ""}
                            onChange={(e) => handleInputChange(e, true)}
                            rows="3"
                            className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter any additional notes..."
                          />
                        </div>

                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium w-1/3">
                            Status
                          </label>
                          <div className="w-2/3">
                            <Dropdown
                              name="status"
                              value={editFormData.status}
                              onChange={(e) => setEditFormData({ ...editFormData, status: e.value })}
                              options={statusOptions}
                              placeholder="Select Status"
                              className="w-full border border-gray-300 rounded-lg"
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                      <label className="text-sm font-medium w-1/3">
                        Loan Status
                      </label>
                      <div className="w-2/3">
                        <Dropdown
                          name="loanStatus"
                          value={editFormData.loanStatus}
                          onChange={(e) => setEditFormData({ ...editFormData, loanStatus: e.value })}
                          options={loanStatusOptions}
                          placeholder="Select Loan Status"
                          className="w-full border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                      </>
                    )}
                  </div>

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

        {/* View Modal */}
        {isViewModalOpen && viewData && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50">
            <div className="absolute inset-0" onClick={closeViewModal}></div>
            <div
              className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[35vw] bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${
                isAnimating ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  Payment Details
                </h2>
                <button
                  onClick={closeViewModal}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                >
                  <IoClose className="w-5 h-5" />
                </button>
              </div>

              <div
                className="p-4 overflow-y-auto"
                style={{ maxHeight: "calc(100vh - 80px)" }}
              >
                {renderViewFields()}

                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div>
                      <span className="block">Created</span>
                      <span className="font-medium text-gray-700">
                        {viewData.createdAt
                          ? formatDateTime(viewData.createdAt)
                          : "-"}
                      </span>
                    </div>
                    <div>
                      <span className="block">Last Updated</span>
                      <span className="font-medium text-gray-700">
                        {viewData.updatedAt
                          ? formatDateTime(viewData.updatedAt)
                          : "-"}
                      </span>
                    </div>
                  </div>
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