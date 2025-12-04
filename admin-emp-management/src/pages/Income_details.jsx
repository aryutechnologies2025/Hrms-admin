import React, { useState, useEffect, useRef, useMemo } from "react";

import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
DataTable.use(DT);

import axios from "../api/axiosConfig";
import { API_URL } from "../config";
import { capitalizeFirstLetter } from "../utils/StringCaps";
import { TfiPencilAlt } from "react-icons/tfi";
import { RiDeleteBin6Line } from "react-icons/ri";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";
import Footer from "../components/Footer";
import Mobile_Sidebar from "../components/Mobile_Sidebar";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FileUpload } from "primereact/fileupload";
import { MultiSelect } from "primereact/multiselect";
import { FaEye } from "react-icons/fa";
import { Editor } from "primereact/editor";
import { FaTrash } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import { Chart } from "chart.js/auto";
import "datatables.net-rowgroup-dt";
import { IoIosArrowForward } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useDateUtils  } from "../hooks/useDateUtils";


const Income_details = () => {
  const formatDateTime = useDateUtils();

  const navigate = useNavigate();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10); // Delay to trigger animation
  };

  const closeAddModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAddModalOpen(false), 250); // Delay to trigger animation
  };

  const closeEditModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsEditModalOpen(false), 250);
    setErrors("");
  };

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [roles, setRoles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Fetch roles from the API
  useEffect(() => {
    fetchProject();
    fetchAccount();
  }, []);

  console.log("roles", roles);

  //   const [status, setStatus] = useState("");
  const storedDetatis = localStorage.getItem("hrmsuser");
  const parsedDetails = JSON.parse(null);
  const userid = parsedDetails ? parsedDetails.id : null;
  const [errors, setErrors] = useState({});

  const [expensedetails, setExpensedetails] = useState([]);
  // console.log("clientdetails", expensedetails);

  const [accountOption, setAccountOption] = useState(null);
  // console.log("accountOption", accountOption);
  const fetchAccount = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/income/finance-name`);
      console.log("response", response);

      const projectName = response.data.getFinanceName?.map((emp) => ({
        label: emp.name,
        value: emp._id,
      }));
      setAccountOption(projectName);
    } catch (err) {
      setErrors("Failed to fetch roles.");
    }
  };

  const fetchProject = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/income/view-income`);
      console.log(response);
      if (response.data.success) {
        setExpensedetails(response.data.data);
      } else {
        setErrors("Failed to fetch roles.");
      }
    } catch (err) {
      setErrors("Failed to fetch roles.");
    }
  };

  // Open and close modals
  // const openAddModal = () => {
  //   setIsAddModalOpen(true);
  // };
  // const closeAddModal = () => {
  //   setIsAddModalOpen(false);
  //   setErrors("");
  // };

  //
  const [accountselect, setAccountselect] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  // const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [notes, setNotes] = useState("");

  //   const [errors, setErrors] = useState({});

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        financeName: accountselect,
        date: date,
        credit_amount: amount,
        source: source,
        notes: notes,
      };

      const response = await axios.post(
        `${API_URL}/api/income/create-income`,
        formData
      );
      console.log("response:", response);
      Swal.fire({
        icon: "success",
        title: "Income added successfully!",
        showConfirmButton: true,
        timer: 1500,
      });
      setDate("");
      setAmount("");
      setSource("");
      setNotes("");
      setAccountselect("");
      setIsAddModalOpen(false);
      fetchProject();
      fetchExpenses();
      fetchExpensesyear();

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
  const [accountselectedit, setAccountselectedit] = useState("");

  const [dateedit, setDateedit] = useState("");
  const [amountedit, setAmountedit] = useState("");
  const [sourceedit, setSourceedit] = useState("");
  const [notesedit, setNotesedit] = useState("");
  const [editid, setEditid] = useState([]);

  // console.log("editid", editid);

  const openEditModal = (row) => {
    console.log("rowData", row);
    setAccountselectedit(row.financeName._id);
    setEditid(row._id);
    setDateedit(row.date || "");
    setAmountedit(row.credit_amount);
    setSourceedit(row.source);
    setNotesedit(row.notes);

    setIsEditModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const handlesubmitedit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        financeName: accountselectedit,

        date: dateedit,
        credit_amount: amountedit,
        source: sourceedit,
        notes: notesedit,
      };

      const response = await axios.put(
        `${API_URL}/api/income/edit-income/${editid}`,
        formData
      );
      console.log("response:", response);
      Swal.fire({
        icon: "success",
        title: "Income Update successfully!",
        showConfirmButton: true,
        timer: 1500,
      });

      setIsEditModalOpen(false);
      fetchProject();
      fetchExpenses();
      fetchExpensesyear();

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
  const validateStatus = (value) => {
    const newErrors = { ...errors };
    if (!value) {
      newErrors.status = ["Status is required"];
    } else {
      delete newErrors.status;
    }
    setErrors(newErrors);
  };

  const handleDelete = async (id) => {
    console.log("editid", id);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this Income?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(
          `${API_URL}/api/income/delete-income/${id}`
        );
        Swal.fire("Deleted!", "The Income has been deleted.", "success");
        console.log("res", res);
        setExpensedetails((prev) => prev.filter((item) => item._id !== id));
        fetchExpenses();
        fetchExpensesyear();
      } catch (err) {
        console.error("Failed to delete:", err);
        Swal.fire("Error", "There was an error deleting the Income.", "error");
      }
    } else {
      Swal.fire("Cancelled", "Your Income is safe :)", "info");
    }
  };

  //   console.log("edit modal", roleDetails);
  const [contentVisible, setContentVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");


  const columns = [
    {
      title: "S.no",
      data: null,
      render: function (data, type, row, meta) {
        return meta.row + 1;
      },
    },

    {
      title: "Account Name",
      data: null,
      render: (row) => row.financeName?.name || "-",
    },

    {
      title: "Date",
      data: "date",
      render: function (data) {
        return formatDateTime(data)
      },
    },
    {
      title: "Amount",
      data: "credit_amount",
      render: function (data) {
        if (!data) return "₹0";
        return `₹${parseFloat(data).toLocaleString("en-IN")}`;
      },
    },

    {
      title: "Source",
      data: "source",
    },
    // {
    //   title: "Notes",
    //   data: "notes",
    // },

       {
          title: "Notes",
          data: null,
          render: (data, type, row) => {
            const id = `notes-${row.sno || Math.random()}`;
    
            setTimeout(() => {
              const container = document.getElementById(id);
              if (container && !container.hasChildNodes()) {
                ReactDOM.render(
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FaEye
                      className="cursor-pointer text-black text-xl"
                      title="Open"
                      onClick={() => {
                        setSelectedContent(row.notes);
                        setContentVisible(true);
                      }}
                    />
                  </div>,
                  container
                );
              }
            }, 0);
    
            return `<div id="${id}"></div>`;
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

  const sortedData = [...expensedetails].sort((a, b) => {
    return new Date(a.date).getFullYear() - new Date(b.date).getFullYear();
  });

  const header = (
    <>
      <span className="ql-formats">
        <select className="ql-header" defaultValue="">
          <option value="1" />
          <option value="2" />
          <option value="" />
        </select>
      </span>
      <span className="ql-formats">
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
      </span>
      <span className="ql-formats">
        <select className="ql-color" />
        <select className="ql-background" />
      </span>
      <span className="ql-formats">
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
      </span>
      <span className="ql-formats">
        <button className="ql-link" />
      </span>
    </>
  );

  const priorityOption = ["Low", "Medium", "High", "Critical"];

  // conutry list

  //   const [selectedCountry, setSelectedCountry] = useState(null);

  const chartRef = useRef(null);

  const chartInstance = useRef(null);
  const [chartData, setChartData] = useState(null);

  const chartRef1 = useRef(null);

  const chartInstance1 = useRef(null);
  const [chartData1, setChartData1] = useState(null);

  // Fetch data from API
  const fetchExpenses = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/income/get-monthly-total-credit`
      );

      const labels = res?.data?.data?.map((item) => item.month);
      const values = res?.data?.data?.map((item) => item.totalCredit);

      setChartData({ labels, values });
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    if (chartData) {
      const ctx = chartRef.current.getContext("2d");

      if (chartInstance.current) {
        chartInstance.current.destroy(); // destroy old chart before creating new
      }

      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: chartData.labels.map((lbl) => capitalizeFirstLetter(lbl)),
          datasets: [
            {
              label: "Income",
              data: chartData.values,
              borderColor: "blue",
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Current Year Month",
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  // Tooltip value with ₹ and commas
                  return `₹ ${context.raw.toLocaleString("en-IN")}`;
                },
              },
            },
          },
          scales: {
            x: { display: true },
            y: {
              display: true,
              type: "linear",
              ticks: {
                callback: function (value) {
                  // Y-axis values with ₹ and commas
                  return `₹ ${value.toLocaleString("en-IN")}`;
                },
              },
            },
          },
        },
      });
    }
  }, [chartData]);

  // Yearly

  const fetchExpensesyear = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/income/get-yearly-total-credit`
      );
      console.log("res", res.data.data);

      // sort by month id
      // const sorted = res.data.data.sort((a, b) => a._id - b._id);

      // const labels = res.data.data.map((item) => item.year);
      // const values = res.data.data.map((item) => item.totalCredit);
      const sorted = res.data.data.sort((a, b) => a.year - b.year);

      const labels = sorted.map((item) => item.year);
      const values = sorted.map((item) => item.totalCredit);

      setChartData1({ labels, values });
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchExpensesyear();
  }, []);

  useEffect(() => {
    if (chartData1) {
      const ctx = chartRef1.current.getContext("2d");

      if (chartInstance1.current) {
        chartInstance1.current.destroy(); // destroy old chart before creating new
      }

      chartInstance1.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: chartData1.labels,
          datasets: [
            {
              label: "Income",
              data: chartData1.values,
              borderColor: "orange",
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: " Year ",
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  // Tooltip value with ₹ and commas
                  return `₹ ${context.raw.toLocaleString("en-IN")}`;
                },
              },
            },
          },
          scales: {
            x: { display: true },
            y: {
              display: true,
              type: "linear",
              ticks: {
                callback: function (value) {
                  return `₹ ${value.toLocaleString("en-IN")}`;
                },
              },
            },
          },
        },
      });
    }
  }, [chartData1]);

  const [filters, setFilters] = useState({
    account: "",
    date: "",
  });

  // temporary state for input before submit
  const [tempFilters, setTempFilters] = useState(filters);
  const filteredData = useMemo(() => {
    return sortedData.filter((row) => {
      const matchesAccount =
        !filters.account || row.financeName?.name === filters.account;
      const matchesDate =
        !filters.date ||
        new Date(row.date).toLocaleDateString("en-GB") ===
          new Date(filters.date).toLocaleDateString("en-GB");
      return matchesAccount && matchesDate;
    });
  }, [sortedData, filters]);

  // months


  const filteredChartData = useMemo(() => {
  if (!filteredData) return null;

  const allMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  // Calculate totals
  const monthlyTotals = filteredData.reduce((acc, row) => {
    const month = new Date(row.date).toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + parseFloat(row.credit_amount || 0);
    return acc;
  }, {});

  // Fill missing months with 0
  const labels = allMonths;
  const values = allMonths.map(m => monthlyTotals[m] || 0);

  return { labels, values };
}, [filteredData]);


  useEffect(() => {
    if (filteredChartData) {
      const ctx = chartRef.current.getContext("2d");

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: filteredChartData.labels,
          datasets: [
            {
              label: "Income",
              data: filteredChartData.values,
              borderColor: "blue",
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: { display: true, text: "Current Year Month" },
            tooltip: {
              callbacks: {
                label: (context) => `₹ ${context.raw.toLocaleString("en-IN")}`,
              },
            },
          },
          scales: {
            y: {
              ticks: {
                callback: (v) => `₹ ${v.toLocaleString("en-IN")}`,
              },
            },
          },
        },
      });
    }
  }, [filteredChartData]);

  // yeraly

  const yearlyData = useMemo(() => {
  const totals = filteredData.reduce((acc, row) => {
    const year = new Date(row.date).getFullYear();
    acc[year] = (acc[year] || 0) + parseFloat(row.credit_amount || 0);
    return acc;
  }, {});

  return {
    labels: Object.keys(totals),
    values: Object.values(totals),
  };
}, [filteredData]);
useEffect(() => {
  if (yearlyData.labels.length > 0) {
    const ctx = chartRef1.current.getContext("2d");

    if (chartInstance1.current) {
      chartInstance1.current.destroy(); // destroy old chart
    }

    chartInstance1.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: yearlyData.labels,
        datasets: [
          {
            label: "Income",
            data: yearlyData.values,
            borderColor: "orange",
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: "Year" },
          tooltip: {
            callbacks: {
              label: (context) => `₹ ${context.raw.toLocaleString("en-IN")}`,
            },
          },
        },
        scales: {
          y: {
            ticks: {
              callback: (v) => `₹ ${v.toLocaleString("en-IN")}`,
            },
          },
        },
      },
    });
  }
}, [yearlyData]);


  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-2 md:pt-10">
      <div>
        

        <div className="flex justify-between gap-2 items-center cursor-pointer">
          <Mobile_Sidebar />
          <div className="flex gap-1 items-center ">
          <p
            className="text-sm text-gray-500"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </p>
          <p>{">"}</p>

          <p className="text-sm text-blue-500">Income</p>
          </div>
        </div>
        {/* Add Button */}
        <div className="flex justify-between mt-1 md:mt-4 mb-2 md:mb-3">
          <h1 className="text-2xl md:text-3xl font-semibold">Income List </h1>
          <button
            onClick={openAddModal}
            className=" px-3 py-2  text-white bg-blue-500 hover:bg-blue-600 font-medium w-20 rounded-2xl"
          >
            Add
          </button>
        </div>

        <div className="flex gap-4 flex-wrap mb-4 items-end">
          <div className="flex flex-col w-40 md:w-48">
            <label>Account Name</label>
            <select
              value={tempFilters.account}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, account: e.target.value })
              }
              className="border px-3 py-2 rounded focus:outline-none"
            >
              <option value="">All Accounts</option>
              {[
                ...new Set(
                  sortedData.map((r) => r.financeName?.name).filter(Boolean)
                ),
              ].map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-40 md:w-48">
            <label>Date</label>
            <input
              type="date"
              value={tempFilters.date}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, date: e.target.value })
              }
              className="border px-3 py-2 rounded focus:outline-none"
            />
          </div>

          <button
            onClick={() => setFilters(tempFilters)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Sumbit
          </button>

          <button
            onClick={() => {
              setTempFilters({ account: "", date: "" });
              setFilters({ account: "", date: "" });
            }}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            Reset
          </button>
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-4 ">
          <div className=" w-full md:w-[50%]">
            <canvas ref={chartRef1} className="bg-white rounded-xl"></canvas>
          </div>
          <div className="w-full md:w-[50%]">
            {" "}
            <canvas ref={chartRef} className="bg-white rounded-xl"></canvas>
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
                rowGroup: {
                  dataSrc: function (row) {
                    return new Date(row.date).getFullYear();
                  },
                  startRender: function (rows, group) {
                    let total = rows
                      .data()
                      .pluck("credit_amount")
                      .reduce((a, b) => a + (parseFloat(b) || 0), 0);

                    total = total.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                      minimumFractionDigits: 2,
                    });

                    return `
          <tr class="year-row">
            <td colspan="6" style="
              background:#f9fafb;
              color:#1f2937;
              font-weight:500;
              font-size:14px;
              padding:6px 10px;
              border-left:4px solid #6366f1;
            ">
              <div style="display:flex; justify-content:space-between; align-items:center ;">
                <span>📅 ${group} (${rows.count()} records)</span>
                <span style="font-weight:600; color:#2563eb;">Total: ${total}</span>
              </div>
            </td>
          </tr>
        `;
                  },
                },
              }}
              className="display nowrap bg-white"
            />
          </div>
        </div>


        {/* all popup */}
                {contentVisible && (
                  <div
                    onClick={() => setContentVisible(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                  >
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                        <h2 className="text-2xl font-semibold text-gray-800">Notes</h2>
                        <button
                          onClick={() => setContentVisible(false)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition"
                        >
                          <IoClose className="text-xl" />
                        </button>
                      </div>
        
                      {/* Body */}
                      <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
                        <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
                          {selectedContent || "No Notes provided."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
        {/* Add Modal */}

        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
            {/* Overlay */}
            <div className="absolute inset-0 " onClick={closeAddModal}></div>

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
                <div className="flex justify-between items-center gap-2 ">
                  <h2 className="text-xl font-semibold mb-4">Add Income</h2>
                </div>

                {/* name and company */}
                <div className=" gap-5">
                  <div className="mb-3 flex justify-between">
                    <label className="block text-sm font-medium mb-2">
                      Account name
                    </label>
                    <div className="w-[60%] md:w-[50%]">
                      <Dropdown
                        value={accountselect}
                        onChange={(e) => setAccountselect(e.value)}
                        options={accountOption}
                        optionValue="value"
                        optionLabel="label"
                        filter
                        placeholder="Select a Account"
                        className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.client_name && (
                        <p className="text-red-500 text-sm mb-4">
                          {errors.client_name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="w-full flex justify-between">
                    <label
                      htmlFor="roleName"
                      className="block text-sm font-medium mb-2"
                    >
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-[60%] md:w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.date && (
                      <p className="text-red-500 text-sm mb-4">{errors.date}</p>
                    )}
                  </div>
                  <div className="w-full flex justify-between mt-3">
                    <label
                      htmlFor="roleName"
                      className="block text-sm font-medium mb-2"
                    >
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={amount}
                      // onChange={(e) => setAmount(e.target.value)
                      min={1}
                      // onChange={(e) => setAmount(e.target.value)}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || Number(val) > 0) {
                          setAmount(val);
                        }
                      }}
                      className="w-[60%] md:w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                   
                  </div>
                   {errors.credit_amount && (
                      <p className="flex justify-end text-red-500 text-sm mb-4">
                        {errors.credit_amount}
                      </p>
                    )}
                </div>
                {/* email phonenumber */}

                {/* contact person and coantact person */}

                <div className=" gap-5 mt-3">
                  <div className="w-full flex  justify-between">
                    <label
                      htmlFor="roleName"
                      className="block text-sm font-medium mb-2"
                    >
                      Source <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      className="w-[60%] md:w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {errors.source && (
                      <p className="flex justify-end text-red-500 text-sm mb-4">
                        {errors.source}
                      </p>
                    )}
                  <div className="w-full flex justify-between mt-3">
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium mb-2"
                    >
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-[60%] md:w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    ></textarea>
                  </div>
                </div>

                {/* country and website */}

                {/* {errors.name && (
                <p className="text-red-500 text-sm mb-4">{errors.name}</p>
              )} */}
                <div className="flex gap-2 justify-end mt-3">
                  <button
                    onClick={closeAddModal}
                    className=" bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                    onClick={handlesubmit}
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
            <div className="absolute inset-0 " onClick={closeEditModal}></div>

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
                <div className="flex justify-between items-center gap-2 ">
                  <h2 className="text-xl font-semibold mb-4">Edit Income</h2>
                </div>

                {/* name and company */}
                <div className=" gap-5">
                  <div className="mb-3 flex justify-between">
                    <label className="block text-sm font-medium mb-2">
                      Account name
                    </label>
                    <div className="w-[60%] md:w-[50%]">
                      <Dropdown
                        value={accountselectedit}
                        onChange={(e) => setAccountselectedit(e.value)}
                        options={accountOption}
                        optionValue="value"
                        optionLabel="label"
                        filter
                        placeholder="Select a Account"
                        className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.client_name && (
                        <p className="text-red-500 text-sm mb-4">
                          {errors.client_name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="w-full flex justify-between">
                    <label
                      htmlFor="roleName"
                      className="block text-sm font-medium mb-2"
                    >
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      // value={dateedit}
                      value={
                        dateedit
                          ? new Date(dateedit).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => setDateedit(e.target.value)}
                      className="w-[60%] md:w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {/* {errors.client_name && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.client_name}
                    </p>
                  )} */}
                  </div>
                  
                  <div className="w-full flex justify-between mt-3">
                    <label
                      htmlFor="roleName"
                      className="block text-sm font-medium mb-2"
                    >
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={amountedit}
                      // onChange={(e) => setAmount(e.target.value)
                      min={1}
                      // onChange={(e) => setAmount(e.target.value)}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || Number(val) > 0) {
                          setAmountedit(val);
                        }
                      }}
                      className="w-[60%] md:w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                   {errors.credit_amount && (
                      <p className="flex justify-end text-red-500 text-sm mb-4">
                        {errors.credit_amount}
                      </p>
                    )}

                  
                </div>
                {/* email phonenumber */}

                {/* contact person and coantact person */}

                <div className=" gap-5 mt-3">
                  <div className="w-full flex justify-between">
                    <label
                      htmlFor="roleName"
                      className="block text-sm font-medium mb-2"
                    >
                      Source<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={sourceedit}
                      onChange={(e) => setSourceedit(e.target.value)}
                      className="w-[60%] md:w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {errors.source && (
                      <p className="flex justify-end text-red-500 text-sm mb-4">
                        {errors.source}
                      </p>
                    )}
                  <div className="w-full mt-3 flex justify-between">
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium mb-2"
                    >
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      value={notesedit}
                      onChange={(e) => setNotesedit(e.target.value)}
                      className="w-[60%] md:w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    ></textarea>
                  </div>
                </div>

                {/* country and website */}

                {/* {errors.name && (
                <p className="text-red-500 text-sm mb-4">{errors.name}</p>
              )} */}
                <div className="flex gap-2 justify-end mt-3">
                  <button
                    onClick={closeEditModal}
                    className=" bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                    onClick={handlesubmitedit}
                  >
                    Save
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
export default Income_details;
