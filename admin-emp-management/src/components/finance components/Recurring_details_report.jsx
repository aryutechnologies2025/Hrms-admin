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

  // Helper functions
  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return `₹${amount.toLocaleString()}`;
  };

  const getLoanStatusColor = (status) => {
    switch(status) {
      case "active": return "text-green-600";
      case "completed": return "text-blue-600";
      case "defaulted": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch(status) {
      case "paid": return "text-green-600";
      case "pending": return "text-yellow-600";
      case "overdue": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusColor = (status) => {
    return status === "1" ? "text-green-600" : "text-red-600";
  };

  // Fetch loan names on component mount
//   useEffect(() => {
//     fetchLoanNames();
//   }, []);

// Fetch loan names when date range changes
useEffect(() => {
  fetchLoanNames();
}, [dateRange.from, dateRange.to]); // Add dependencies

const fetchLoanNames = async () => {
    try {
      const params = {};
      if (dateRange.from && dateRange.to) {
        params.from = dateRange.from;
        params.to = dateRange.to;
      }
        
      const response = await axios.get(
        `${API_URL}/api/recurring-payment/loan-name`,
        { params, withCredentials: true },
      );
      console.log("responseloanName", response);
      if (response.data.success) {
        setLoanNames(response.data.data);
        // Auto-select first loan if available
        if (response.data.data.length > 0) {
          setSelectedLoan(response.data.data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching loan names:", error);
    }
};

  const fetchReportData = async (loanName) => {
    console.log("loanName", loanName);
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
        { params, withCredentials: true },
      );
      console.log("response", response);
      if (response.data.success) {
        setReportData(response.data);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when selected loan changes
  useEffect(() => {
    if (selectedLoan) {
      fetchReportData(selectedLoan);
    }
  }, [selectedLoan]);

  const handleLoanClick = (loanName) => {
    setSelectedLoan(loanName);
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

  return (
    <div className="flex flex-col bg-gray-100 w-screen min-h-screen">
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
            onClick={() => {
              setDateRange({ from: "", to: "" });
              fetchLoanNames();
            }}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Reset
          </button>
          </div>
        </div>

        {/* Main Content - Split Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar - Loan Names */}
          <div className="md:w-1/4 bg-white rounded-lg shadow-sm p-4 h-fit">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Loans</h2>
            <div className="space-y-2">
              {loanNames.map((loanName, index) => (
                <div
                  key={index}
                  onClick={() => handleLoanClick(loanName)}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    selectedLoan === loanName
                      ? "bg-blue-50 border-l-4 border-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <p
                    className={`font-medium ${
                      selectedLoan === loanName
                        ? "text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    {loanName}
                  </p>
                </div>
              ))}
              {loanNames.length === 0 && (
                <p className="text-gray-500 text-sm">No loans available</p>
              )}
            </div>
          </div>
          

          {/* Right Side - Data Display */}
          <div className="md:w-3/4">
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : reportData ? (
              <div className="space-y-6">
                {/* Loan Details Card */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Loan Details
                  </h2>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs text-gray-500">Account</label>
                      <p className="font-medium text-sm break-words">
                        {reportData.data.account?.name || "-"}
                      </p>
                    </div>
                    
                    {reportData.data.lenderName && (
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs text-gray-500">Lender Name</label>
                        <p className="font-medium text-sm">
                          {reportData.data.lenderName?.name || "-"}
                        </p>
                      </div>
                    )}
                    

                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs text-gray-500">Payment Type</label>
                      <p className="font-medium text-sm capitalize">
                        {reportData.data.paymentType || "-"}
                      </p>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs text-gray-500">Recurring Type</label>
                      <p className="font-medium text-sm">
                        {reportData.data.recurringType || "-"}
                      </p>
                    </div>

                    {reportData.data.amount && (
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs text-gray-500">Amount</label>
                        <p className="font-medium text-sm">
                          {formatCurrency(reportData.data.amount)}
                        </p>
                      </div>
                    )}

                    {reportData.data.totalAmount && (
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs text-gray-500">Total Amount</label>
                        <p className="font-medium text-sm">
                          {formatCurrency(reportData.data.totalAmount)}
                        </p>
                      </div>
                    )}

                    {reportData.data.interest_rate && (
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs text-gray-500">Interest Rate</label>
                        <p className="font-medium text-sm">
                          {reportData.data.interest_rate}%
                        </p>
                      </div>
                    )}

                    {reportData.data.totalEmi && (
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs text-gray-500">Number of EMI</label>
                        <p className="font-medium text-sm">{reportData.data.totalEmi}</p>
                      </div>
                    )}

                    {reportData.data.monthlyInterest && (
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs text-gray-500">Monthly Interest</label>
                        <p className="font-medium text-sm">
                          {formatCurrency(reportData.data.monthlyInterest)}
                        </p>
                      </div>
                    )}

                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs text-gray-500">Monthly Principal</label>
                      <p className="font-medium text-sm">
                        {formatCurrency(reportData.data.monthlyPrincipal)}
                      </p>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs text-gray-500">Due Day</label>
                      <p className="font-medium text-sm">{reportData.data.dueDay || "-"}</p>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs text-gray-500">Loan Status</label>
                      <p className={`font-medium text-sm capitalize ${getLoanStatusColor(reportData.data.loanStatus)}`}>
                        {reportData.data.loanStatus || "-"}
                      </p>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs text-gray-500">Balance Amount</label>
                      <p className="font-medium text-sm">
                        {formatCurrency(reportData.data.balance_amount)}
                      </p>
                    </div>

                  

                    {reportData.data.notes && (
                      <div className="col-span-2">
                        <label className="text-xs text-gray-500">Notes</label>
                        <p className="font-medium text-sm bg-gray-50 p-2 rounded break-words">
                          {reportData.data.notes}
                        </p>
                      </div>
                    )}

                
                  </div>
                </div>

                {/* Logs Table */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Payment Logs
                  </h2>
                  {reportData.log && reportData.log.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Payment Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Loan Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Due Date
                            </th>
                            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Interest
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Principal
                            </th> */}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {reportData.log.map((log, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {log.payment_date
                                  ? new Date(
                                      log.payment_date,
                                    ).toLocaleDateString()
                                  : "-"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₹{log.amount?.toLocaleString() || "0"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    log.payment_status === "paid"
                                      ? "bg-green-100 text-green-800"
                                      : log.payment_status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {log.payment_status || "-"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    log.loanStatus === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : log.payment_status === "inprogress"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {log.loanStatus || "-"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {log.payment_type || "-"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {log.due_date || "-"}
                              </td>
                              {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₹{log.monthlyInterest?.toLocaleString() || "0"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₹{log.monthlyPrincipal?.toLocaleString() || "0"}
                              </td> */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No payment logs found
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500">Select a loan to view details</p>
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