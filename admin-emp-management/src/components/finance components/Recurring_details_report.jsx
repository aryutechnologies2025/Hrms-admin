import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Mobile_Sidebar from "../Mobile_Sidebar";
import Footer from "../Footer";
import { API_URL } from "../../config";

function Recurring_details_report() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("billing");
  const [loanNames, setLoanNames] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });
  const [errorId, setErrorId] = useState(false);
  const [expandedPayments, setExpandedPayments] = useState([]);

  // Helper functions
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "₹0";
    return `₹${Number(amount).toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    })}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getLoanStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "text-green-600 bg-green-50";
      case "completed":
        return "text-blue-600 bg-blue-50";
      case "defaulted":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "text-green-700 bg-green-100";
      case "pending":
        return "text-yellow-700 bg-yellow-100";
      case "overdue":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  // Fetch loan names when date range changes
  useEffect(() => {
    fetchLoanNames();
  }, [dateRange.from, dateRange.to]);

  const fetchLoanNames = async () => {
    try {
      const params = {};
      if (dateRange.from && dateRange.to) {
        params.from = dateRange.from;
        params.to = dateRange.to;
      }

      const response = await axios.get(
        `${API_URL}/api/recurring-payment/loan-name`,
        {withCredentials: true }
      );
      
      if (response.data.success) {
        setLoanNames(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedLoan(response.data.data[0]?._id);
        }
      }
    } catch (error) {
      console.error("Error fetching loan names:", error);
    }
  };

  const fetchReportData = async (loanName) => {
    if (!loanName) return;

    setLoading(true);
    try {
      const params = { loanName };
      if (dateRange.from && dateRange.to) {
        params.from = dateRange.from;
        params.to = dateRange.to;
      }
      
      const response = await axios.get(
        `${API_URL}/api/recurring-payment/report`,
        { params, withCredentials: true }
      );
      
      if (response.data.success) {
        setReportData(response.data);
        setErrorId(false);
        // Initialize all payments as expanded
        setExpandedPayments(response.data.data.map(() => true));
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
      setErrorId(true);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedLoan) {
      fetchReportData(selectedLoan);
    }
  }, [selectedLoan]);

  const handleLoanClick = (loan) => {
    setSelectedLoan(loan?._id);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyDateFilter = () => {
    if (selectedLoan) {
      fetchReportData(selectedLoan);
    }
  };

  const resetFilters = () => {
    setDateRange({ from: "", to: "" });
    fetchLoanNames();
  };

  const togglePaymentExpansion = (index) => {
    setExpandedPayments(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const expandAllPayments = () => {
    setExpandedPayments(Array(reportData?.data?.length || 0).fill(true));
  };

  const collapseAllPayments = () => {
    setExpandedPayments(Array(reportData?.data?.length || 0).fill(false));
  };

  // Get logs for a specific payment
  const getLogsForPayment = (paymentId) => {
    return reportData?.logs?.filter(log => log.parent_id?.toString() === paymentId?.toString()) || [];
  };

  return (
    <div className="flex flex-col bg-gray-100 w-full min-h-screen">
      <div className="px-3 md:px-5 pt-2 md:pt-10 flex-1">
        <div className="cursor-pointer">
          <Mobile_Sidebar />
        </div>

        {/* Breadcrumb */}
        <div className="flex justify-end mt-2 md:mt-0 gap-1 items-center">
          <p
            className="text-sm text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={() => navigate("/")}
          >
            Dashboard
          </p>
          <span className="text-gray-400">{">"}</span>
          <p className="text-sm text-blue-500">Recurring Details Report</p>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Recurring Payment Report
        </h1>

        {/* Date Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                name="from"
                value={dateRange.from}
                onChange={handleDateChange}
                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                name="to"
                value={dateRange.to}
                onChange={handleDateChange}
                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={applyDateFilter}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
            >
              Apply Filter
            </button>
            <button
              onClick={resetFilters}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-gray-400 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Main Content - Split Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar - Loan Names */}
          <div className="md:w-1/4 bg-white rounded-lg shadow-sm p-4 h-fit">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Lenders</h2>
            <div className="space-y-2">
              {loanNames.map((loanName, index) => (
                <div
                  key={loanName._id || index}
                  onClick={() => handleLoanClick(loanName)}
                  className={`p-3 rounded-md cursor-pointer transition-all ${
                    selectedLoan === loanName?._id
                      ? "bg-blue-50 border-l-4 border-blue-600 shadow-sm"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <p
                    className={`font-medium ${
                      selectedLoan === loanName?._id
                        ? "text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    {loanName?.name || "Unknown Lender"}
                  </p>
                </div>
              ))}
              {loanNames.length === 0 && (
                <p className="text-gray-500 text-sm py-4 text-center">No lenders available</p>
              )}
            </div>
          </div>

          {/* Right Side - Data Display */}
          <div className="md:w-3/4">
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="text-gray-500 mt-4">Loading report data...</p>
              </div>
            ) : errorId ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-red-500 text-lg">Report Not Found</p>
                <p className="text-gray-400 text-sm mt-2">No data available for the selected criteria</p>
              </div>
            ) 
            : reportData ? (
              <div className="space-y-6">
                {/* Summary Cards */}
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-blue-600 font-medium">Total Loans</p>
                    <p className="text-2xl font-bold text-blue-800">{reportData.summary?.totalLoans || 0}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-green-600 font-medium">Total Amount</p>
                    <p className="text-2xl font-bold text-green-800">{formatCurrency(reportData.summary?.totalAmount)}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-purple-600 font-medium">Paid Amount</p>
                    <p className="text-2xl font-bold text-purple-800">{formatCurrency(reportData.summary?.paidAmount)}</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-yellow-600 font-medium">Pending Amount</p>
                    <p className="text-2xl font-bold text-yellow-800">{formatCurrency(reportData.summary?.pendingAmount)}</p>
                  </div>
                </div> */}

                {/* Filter Info */}
                {/* <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="font-medium text-gray-700">Applied Filters:</span>
                    {reportData.filterApplied?.loanName && (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        Lender: {loanNames.find(l => l._id === reportData.filterApplied.loanName)?.name || reportData.filterApplied.loanName}
                      </span>
                    )}
                    {reportData.filterApplied?.from && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                        From: {formatDate(reportData.filterApplied.from)}
                      </span>
                    )}
                    {reportData.filterApplied?.to && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                        To: {formatDate(reportData.filterApplied.to)}
                      </span>
                    )}
                  </div>
                </div> */}

                {/* Expand/Collapse Controls */}
                {reportData.data.length > 1 && (
                  <div className="flex gap-2">
                    <button
                      onClick={expandAllPayments}
                      className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                    >
                      Expand All
                    </button>
                    <button
                      onClick={collapseAllPayments}
                      className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                    >
                      Collapse All
                    </button>
                  </div>
                )}

                {/* Multiple Loan Details Cards */}
                {reportData.data.map((payment, index) => {
                  const paymentLogs = getLogsForPayment(payment._id);
                  const isExpanded = expandedPayments[index];

                  return (
                    <div key={payment._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      {/* Payment Header - Click to expand/collapse */}
                      <div 
                        onClick={() => togglePaymentExpansion(index)}
                        className="p-4 bg-gray-50 border-b cursor-pointer hover:bg-gray-100 transition-colors flex justify-between items-center"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500">{isExpanded ? "▼" : "▶"}</span>
                          <h3 className="font-semibold text-gray-800">
                             {payment.account?.name || "No Account"}
                          </h3>
                          {/* <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLoanStatusColor(payment.loanStatus)}`}>
                            {payment.loanStatus || "Active"}
                          </span> */}
                        </div>
                        {/* <div className="text-sm text-gray-600">
                          <span className="font-medium">{formatCurrency(payment.totalAmount)}</span>
                          <span className="mx-2">•</span>
                          <span>{paymentLogs.length} logs</span>
                        </div> */}
                      </div>

                      {/* Payment Details - Collapsible */}
                      {isExpanded && (
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-3 rounded">
                              <label className="text-xs text-gray-500 block">Account</label>
                              <p className="font-medium text-sm break-words">
                                {payment.account?.name || "-"}
                              </p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded">
                              <label className="text-xs text-gray-500 block">Lender Name</label>
                              <p className="font-medium text-sm">
                                {payment.lenderName?.name || "-"}
                              </p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded">
                              <label className="text-xs text-gray-500 block">Payment Type</label>
                              <p className="font-medium text-sm capitalize">
                                {payment.paymentType || "-"}
                              </p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded">
                              <label className="text-xs text-gray-500 block">Recurring Type</label>
                              <p className="font-medium text-sm">
                                {payment.recurringType || "-"}
                              </p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded">
                              <label className="text-xs text-gray-500 block">Amount</label>
                              <p className="font-medium text-sm">
                                {formatCurrency(payment.amount)}
                              </p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded">
                              <label className="text-xs text-gray-500 block">Total Amount</label>
                              <p className="font-medium text-sm">
                                {formatCurrency(payment.totalAmount)}
                              </p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded">
                              <label className="text-xs text-gray-500 block">Interest Rate</label>
                              <p className="font-medium text-sm">
                                {payment.interest_rate ? `${payment.interest_rate}%` : "-"}
                              </p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded">
                              <label className="text-xs text-gray-500 block">Total EMI</label>
                              <p className="font-medium text-sm">
                                {payment.totalEmi || "0"}
                              </p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded">
                              <label className="text-xs text-gray-500 block">Monthly Interest</label>
                              <p className="font-medium text-sm">
                                {formatCurrency(payment.monthlyInterest)}
                              </p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded">
                              <label className="text-xs text-gray-500 block">Monthly Principal</label>
                              <p className="font-medium text-sm">
                                {formatCurrency(payment.monthlyPrincipal)}
                              </p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded">
                              <label className="text-xs text-gray-500 block">Due Day</label>
                              <p className="font-medium text-sm">
                                {payment.dueDay || "-"}
                              </p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded">
                              <label className="text-xs text-gray-500 block">Balance Amount</label>
                              <p className="font-medium text-sm">
                                {formatCurrency(payment.balance_amount)}
                              </p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded">
                              <label className="text-xs text-gray-500 block">Start Date</label>
                              <p className="font-medium text-sm">
                                {formatDate(payment.start_date)}
                              </p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded">
                              <label className="text-xs text-gray-500 block">End Date</label>
                              <p className="font-medium text-sm">
                                {formatDate(payment.end_date)}
                              </p>
                            </div>
                          </div>

                          {payment.notes && (
                            <div className="mt-4 p-3 bg-gray-50 rounded">
                              <label className="text-xs text-gray-500 block">Notes</label>
                              <p className="text-sm mt-1">{payment.notes}</p>
                            </div>
                          )}

                          {/* Payment Logs for this specific payment */}
                          {paymentLogs.length > 0 && (
                            <div className="mt-6">
                              <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                                <span>Payment Logs</span>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                  {paymentLogs.length} entries
                                </span>
                              </h4>
                              <div className="overflow-x-auto border rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Amount</th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Type</th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Due Date</th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Interest</th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Principal</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {paymentLogs.map((log, idx) => (
                                      <tr key={log._id || idx} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                          {formatDate(log.payment_date)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                          {formatCurrency(log.amount)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(log.payment_status)}`}>
                                            {log.payment_status}
                                          </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                          {log.payment_type}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                          {log.due_date || "-"}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                          {formatCurrency(log.monthlyInterest)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                          {formatCurrency(log.monthlyPrincipal)}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) 
            : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-500 text-lg">Select a lender to view details</p>
                <p className="text-gray-400 text-sm mt-2">Choose from the lenders list on the left</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Recurring_details_report;