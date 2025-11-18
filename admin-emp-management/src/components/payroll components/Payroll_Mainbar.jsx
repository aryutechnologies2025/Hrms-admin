import React, { useMemo } from "react";
import { useEffect, useState } from "react";
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
import { FiDownload } from "react-icons/fi"; // Import the download icon
import PayslipContent from "./PayslipContent";
import Swal from "sweetalert2";
import ReactDOM from "react-dom";
import html2pdf from "html2pdf.js";

const Payroll_Mainbar = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [payrollList, setPayrollList] = useState([]);
  console.log("payrollList", payrollList);

  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  console.log("selectedRows", selectedRows);

  const [openUpdateStatusModal, setOpenUpdateStatusModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedMonth, setSelectedMonth] = useState("");
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [statusError, setStatusError] = useState("");

  const salaryTotals = useMemo(() => {
    const initialTotals = {
      totalCTC: 0,
      grossSalary: 0,
      basic: 0,
      hra: 0,
      conveyanceAllowance: 0,
      medicalAllowance: 0,
      otherAllowance: 0,
      gross_actual_salary: 0,
      employerPF: 0,
      employeePF: 0,
      eps: 0,
      healthandEducationCess: 0,
      professionalTax: 0,
      monthlyTax: 0,
      netSalary: 0,

    };

    payrollList.forEach((row) => {
      initialTotals.basic += Number(row.data.basic) || 0;
      initialTotals.hra += Number(row.data.hra) || 0;
      initialTotals.conveyanceAllowance +=
        Number(row.data.conveyanceAllowance) || 0;
      initialTotals.medicalAllowance += Number(row.data.medicalAllowance) || 0;
      initialTotals.otherAllowance += Number(row.data.otherAllowance) || 0;
      initialTotals.gross_actual_salary += Number(row.data.actualGrossSalary) || 0;
      initialTotals.ActualCTC += Number(row.data.ActualCTC) || 0;
      initialTotals.employerEPS += Number(row.data.employerEPS) || 0;
      initialTotals.employerESI += Number(row.data.employerESI) || 0;
      initialTotals.employeeESI += Number(row.data.employeeESI) || 0;
      initialTotals.grossSalary += Number(row.data.grossSalary) || 0;
      initialTotals.employerPF += Number(row.data.employerPF) || 0;
      initialTotals.employeePF += Number(row.data.employeePF) || 0;
      initialTotals.eps += Number(row.data.employerEPS) || 0;
      initialTotals.healthandEducationCess +=
        Number(row.data.healthandEducationCess) || 0;
      initialTotals.professionalTax += Number(row.data.professionalTax) || 0;
      initialTotals.monthlyTax += Number(row.data.monthlyTax) || 0;
      initialTotals.netSalary += Number(row.data.netSalary) || 0;
      initialTotals.totalCTC += Number(row.data.totalCTC) || 0;
    });
    return initialTotals;
  }, [payrollList]);

  const columns = [
    // {
    //   field: "name",
    //   header: "Employee Name",
    //   body: (rowData) => rowData.employee.name,
    // },
    {
      field: "working_days",
      header: "No. of Days Working",
      body: (rowData) => rowData.data.totalDays,
    },
    {
      field: "present",
      header: "Present",
      body: (rowData) => rowData.data.workingDays,
    },
    // { field: "absent", header: "Absent" },
    // { field: "cl_utilized", header: "CL Utilized" },
    {
      field: "ctc_month",
      header: "CTC/ Month",
      body: (rowData) =>
        "₹" +
        Number(rowData.data.totalCTC).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      footer:
        "₹" +
        Number(salaryTotals.totalCTC).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },
    {
      field: "gross_salary",
      header: "Gross Salary",
      body: (rowData) => "₹" + Number(rowData.data.grossSalary).toLocaleString(),
      footer: "₹" + Number(salaryTotals.grossSalary).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    // { field: "gross_wages", header: "Gross Salary",
    //   body: (rowData) => rowData.data.grossSalary
    //  },
    {
      field: "basic",
      header: "Basic",
      body: (rowData) => "₹" + Number(rowData.data.basic).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      footer: "₹" + Number(salaryTotals.basic).toFixed(2).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    {
      field: "hra",
      header: "HRA",
      body: (rowData) => "₹" + Number(rowData.data.hra).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      footer: "₹" + Number(salaryTotals.hra).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    {
      field: "conveyance",
      header: "Conveyance Allowance",
      body: (rowData) => "₹" + Number(rowData.data.conveyanceAllowance).toLocaleString(),
      footer: "₹" + Number(salaryTotals.conveyanceAllowance).toFixed(2),
    },
    {
      field: "medical",
      header: "Medical Allowance",
      body: (rowData) => "₹" + Number(rowData.data.medicalAllowance).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      footer: "₹" + Number(salaryTotals.medicalAllowance).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    {
      field: "other_allowances",
      header: "Other Allowances",
      body: (rowData) => "₹" + Number(rowData.data.otherAllowance).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      footer: "₹" + Number(salaryTotals.otherAllowance).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    {
      field: "gross_actual_salary",
      header: "Gross Actual Salary",
      body: (rowData) => "₹" + Number(rowData.data.actualGrossSalary).toLocaleString(),
      footer: "₹" + Number(salaryTotals.actualGrossSalary).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    // {
    //   field: "er_pf",
    //   header: "ER PF",
    //   body: (rowData) => "₹" + Number(rowData.data.employerPF).toLocaleString(),
    //   footer: "₹" + Number(salaryTotals.employerPF).toLocaleString("en-IN", {
    //       minimumFractionDigits: 2,
    //       maximumFractionDigits: 2,
    //     }),
    // },
    {
      field: "epf",
      header: "EE PF",
      body: (rowData) => "₹" + Number(rowData.data.employeePF).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      footer: "₹" + Number(salaryTotals.employeePF).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    {
      field: "eps",
      header: "EPS",
      body: (rowData) => "₹" + Number(rowData.data.employerEPS).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      footer: "₹" + Number(salaryTotals.employerEPS).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    {
      field: "erEsi",
      header: "ER ESI",
      body: (rowData) => "₹" + Number(rowData.data.employerESI).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      footer: "₹" + Number(salaryTotals.employerESI).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    {
      field: "actual_ctc",
      header: "CTC - Actual",
      body: (rowData) => "₹" + Number(rowData.data.ActualCTC).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      footer: "₹" + Number(salaryTotals.ActualCTC).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    {
      field: "erPF",
      header: "ER PF",
      body: (rowData) => "₹" + Number(rowData.data.employerPF).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      footer: "₹" + Number(salaryTotals.employerPF).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    {
      field: "eeESI",
      header: "EE ESI",
      body: (rowData) => "₹" + Number(rowData.data.employeeESI).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      footer: "₹" + Number(salaryTotals.employeeESI).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    // { field: "eps", header: "EPS" },
    // { field: "ctc", header: "CTC" },

    {
      field: "healthandEducationCess",
      header: "Health and Education Cess",
      body: (rowData) => "₹" + Number(rowData.data.healthandEducationCess).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      footer: "₹" + Number(salaryTotals.healthandEducationCess).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    {
      field: "professionalTax",
      header: "Professional Tax",
      body: (rowData) => "₹" + Number(rowData.data.professionalTax).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      footer: "₹" + Number(salaryTotals.professionalTax).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    {
      field: "incomeTax",
      header: "TDS",
      body: (rowData) => "₹" + Number(rowData.data.monthlyTax).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      footer: "₹" + Number(salaryTotals.monthlyTax).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    {
      field: "netSalary",
      header: "Net Salary",
      body: (rowData) => "₹" + Number(rowData.data.netSalary).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      footer: "₹" + Number(salaryTotals.netSalary).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    },
    // { field: "esi", header: "ESI" },
    // { field: "pt", header: "PT" },
    // { field: "tds", header: "TDS" },
    // { field: "take_home", header: "Take Home" },
    // { field: "credited_amount", header: "Cr Amt in Bk" },
    // { field: "salary_paid_date", header: "Salary Paid Dt" },
    // { field: "emp_code", header: "Employee Code" },
    // { field: "notes", header: "Notes" },
    // {
    //   header: "Action",
    //   body: (rowData) => (
    //     <button
    //       onClick={() => handleDownload(rowData)}
    //       className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
    //     >
    //       <FiDownload size={16} />
    //     </button>
    //   ),
    // },
  ];

  const fetchData = async () => {
    const date = new Date();
    const month = date.toLocaleString("en-US", {
      month: "numeric",
      year: "numeric",
    });

    try {
      let response = await axios.get(
        `${API_URL}/api/employees/calculate-salary`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            month,
          },
        }
      );

      setPayrollList(response.data.data);
      setLoading(false);
      console.log("response", response.data.data);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error.response.data.error);
      setPayrollList("");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatusSubmitButtonClick = async () => {
    if (selectedMonth === "") {
      if (status) {
        try {
          let response = await axios.post(
            `${API_URL}/api/emp-attendances/markAspaid`,
            {
              employee_ids: selectedRows.map((row) => row.emp_id),
              month: currentDate.split("-")[1],
              year: currentDate.split("-")[0],
              status,
              note: notes,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setOpenUpdateStatusModal(false);
          fetchData();
          setStatus("");
          setNotes("");
        } catch (error) {
          console.log(error);
        }
      } else {
        setStatusError("Please Select Status");
      }
    } else {
      if (status) {
        try {
          let response = await axios.post(
            `${API_URL}/api/emp-attendances/markAspaid`,
            {
              employee_ids: selectedRows.map((row) => row.emp_id),
              month: selectedMonth.split("-")[1],
              year: selectedMonth.split("-")[0],
              status,
              note: notes,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          setOpenUpdateStatusModal(false);
          fetchData();
          setStatus("");
          setNotes("");
        } catch (error) {
          console.log(error);
        }
      } else {
        setStatusError("Please Select Status");
      }
    }
  };

  const onChangeMonth = async (e) => {
    setSelectedMonth(e.target.value);
    const selectedValue = e.target.value;
    const date = new Date(selectedValue);
    const month = date.toLocaleString("en-US", {
      month: "numeric",
      year: "numeric",
    });

    try {
      let response = await axios.get(
        `${API_URL}/api/employees/calculate-salary`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            month,
          },
        }
      );

      setPayrollList(response.data.data);
      setLoading(false);
      setError("");
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
      setPayrollList("");
    }
  };

  const handleGeneratePayslip = async (selectedRows) => {
    // Show loader
    // Swal.fire({
    //   title: "Generating Payslips...",
    //   html: "Please wait while payslips are being created and uploaded.",
    //   allowOutsideClick: false,
    //   didOpen: () => {
    //     Swal.showLoading();
    //   },
    // });

    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.top = "-9999px";
    document.body.appendChild(container);

    const errorMessages = [];

    for (let idx = 0; idx < selectedRows.length; idx++) {
      const employee = selectedRows[idx];

      const payslipElement = (
        <PayslipContent
          employee={employee}
          index={idx}
        // convertNumberToWords={convertNumberToWords}
        />
      );

      const tempDiv = document.createElement("div");
      container.appendChild(tempDiv);

      const root = ReactDOM.createRoot(tempDiv);
      root.render(payslipElement);

      await new Promise((r) => setTimeout(r, 300));

      const element = document.getElementById(`payslip-content-${idx}`);
      const filename = `Payslip_${employee.name}_${employee.period || "Month"
        }.pdf`;

      const worker = html2pdf()
        .set({
          margin: 0.5,
          filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        })
        .from(element);

      const pdfBlob = await worker.outputPdf("blob");
    }

    document.body.removeChild(container);

    // Hide loader
    Swal.close();

    // Final result popup
    if (errorMessages.length === 0) {
      Swal.fire({
        icon: "success",
        title: "Payslips Generated",
        text: "All payslips were successfully created and uploaded.",
        confirmButtonColor: "#3085d6",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Some Payslips Failed",
        html: `
          <div style="text-align: center; max-height: 250px; overflow-y: auto;">
            ${[...new Set(errorMessages)] // Remove duplicates
            .map((msg) => `<p>• ${msg}</p>`)
            .join("")}
          </div>
        `,
        confirmButtonColor: "#d33",
        width: 600,
      });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <div className="flex flex-col justify-between overflow-x-hidden bg-gray-100 min-h-screen px-3  md:px-5 py-2 md:py-5 w-screen ">
      {/* Loader Overlay */}
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <Mobile_Sidebar />
            <div className="flex gap-2 mt-5 text-sm items-center">
              <p className=" text-blue-500 ">Payroll</p>
              <p>{">"}</p>
            </div>

            <p className="text-2xl md:text-3xl mt-5 md:mt-8 font-semibold">
              Payroll
            </p>

            {/* data table */}
            <div className="bg-white mt-4 md:mt-8 px-5 py-5 rounded-2xl">
              <div
                className="overflow-x-hidden"
                style={{ width: "auto", margin: "0 auto" }}
              >
               
                <div className="md:mt-8 flex flex-wrap  justify-between">
                  <div className="flex flex-wrap gap-5 mt-4">
                    <button
                      onClick={() => {
                        if (
                          (selectedRows?.length || 0) === (payrollList?.length || 0)
                        ) {
                          setSelectedRows([]); 
                        } else {
                          setSelectedRows(payrollList || []); 
                        }
                      }}
                      className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-md text-white"
                    >
                      {(selectedRows?.length || 0) === (payrollList?.length || 0)
                        ? "Deselect All"
                        : "Select All"}
                    </button>

                    {selectedRows?.length > 0 && (
                      <>
                        <button
                          onClick={() =>
                            setOpenUpdateStatusModal(!openUpdateStatusModal)
                          }
                          className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-md text-white"
                        >
                          Update Status
                        </button>

                        {/* <button
                      onClick={() => handleGeneratePayslip(selectedRows)}
                      className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-md text-white"
                    >
                      Generate Payslip
                    </button> */}
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-5 justify-end mt-3 md:mt-0">
                    <input
                      type="month"
                      name="month"
                      id=""
                      onChange={(e) => onChangeMonth(e)}
                      className="border-2  rounded-xl w-full md:w-44 h-10 px-4 border-gray-300 outline-none"
                    />
                    <InputText
                      value={globalFilter}
                      onChange={(e) => setGlobalFilter(e.target.value)}
                      placeholder="Search"
                      className="border-2  rounded-xl w-full md:w-44 h-10 px-4 border-gray-300 outline-none"
                    />
                  </div>
                </div>

                {error !== "" && (
                  <div className="flex justify-center mt-5">
                    <p className="text-red-500">{error}</p>
                  </div>
                )}

                {/* Loader Overlay */}
                {loading && <Loader />}


                <div className="w-full overflow-x-auto overflow-y-hidden mt-4">
                  <div className="min-w-[900px]">
                    <DataTable
                      key={isMobile ? "mobile" : "desktop"}
                      value={payrollList}
                      selection={selectedRows}
                      onSelectionChange={(e) => setSelectedRows(e.value)}
                      dataKey="employee.id"
                      scrollable
                      scrollHeight="650px"
                      scrollDirection="both"
                      showGridlines
                      resizableColumns
                      className="mt-5 border rounded-md text-sm custom-table md:sticky-header-table w-full"
                      emptyMessage="No Data Found"
                    >

                      <Column
                        selectionMode="multiple"
                        headerStyle={{ width: "3rem" }}
                        bodyStyle={{ textAlign: "center" }}
                      />

                        <Column
                          field="name"
                          header="Employee Name"
                          body={(rowData) => rowData.employee.name}
                          footer="Total"
                          frozen={!isMobile}
                          style={{ minWidth: "200px", textAlign: "center" }}
                        />
                      

                      
                      {columns.map((col, index) => (
                        <Column
                          key={index}
                          field={col.field}
                          header={col.header}
                          body={col.body}
                          footer={col.footer}
                          style={{
                            textAlign: "center",
                            minWidth: "150px",
                            whiteSpace: "normal",
                          }}
                        />
                      ))}
                    </DataTable>
                  </div>
                </div>

              </div>
            </div>

            {openUpdateStatusModal && (
              <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50 px-4">
                <div className="bg-white flex flex-col space-y-4 shadow-lg rounded-lg p-6 w-full max-w-md sm:max-w-lg lg:w-[450px] max-h-[80vh] overflow-y-auto">
                  {/* Date Input */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <label className="mb-1 sm:mb-0">Date</label>
                    <input
                      value={currentDate}
                      type="text"
                      className="border-2 rounded-lg px-4 h-10 outline-none w-full sm:w-72 border-gray-300"
                    />
                  </div>

                  {/* Status Select */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <label className="mb-1 sm:mb-0">Status</label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          setStatusError("");
                          setStatus(e.target.value);
                        } else {
                          setStatusError(true);
                        }
                      }}
                      className={`border-2 rounded-lg px-4  h-10 outline-none w-full sm:w-72 border-gray-300 ${statusError && "border-red-500"
                        }`}
                    >
                      <option value="" disabled selected>
                        Select
                      </option>
                      <option value="Paid">Paid</option>
                      <option value="Unpaid">Unpaid</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>

                  {/* Notes Textarea */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <label className="mb-1 sm:mb-0">Notes</label>
                    <textarea
                      value={openUpdateStatusModal ? notes : ""}
                      onChange={(e) => setNotes(e.target.value)}
                      className="border-2 rounded-lg px-4 pt-1.5 h-10 outline-none w-full sm:w-72 border-gray-300 resize-none"
                    />
                  </div>

                  <div className="flex gap-5 justify-end">
                    <button
                      onClick={() => setOpenUpdateStatusModal(false)}
                      className="bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => handleUpdateStatusSubmitButtonClick()}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )
      }
      <Footer />
    </div >
  );
};

export default Payroll_Mainbar;
