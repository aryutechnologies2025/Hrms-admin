import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css"; // PrimeReact theme
import "primereact/resources/primereact.min.css"; // PrimeReact core CSS
import { InputText } from "primereact/inputtext";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_URL } from "../../config";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { FaFileExport } from "react-icons/fa6";
import Loader from "../Loader";
import { useDateUtils  } from "../../hooks/useDateUtils";


const MonthlyAttendanceDetails_Mainbar = () => {
  let navigate = useNavigate();
  const formatDateTime = useDateUtils();
  
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [globalFilter, setGlobalFilter] = useState("");
  const [monthlyReportList, setMonthlyReportList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState([]);
  const [tooltipData, setTooltipData] = useState(null);
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      field: "date",
      header: "Date",
      body: (rowData) => formatDateTime(rowData?.date) || "-",
    },
    {
      field: "status",
      header: "Status",
      body: (rowData) =>
        rowData?.status == "Present" ? (
          <>
            <p className="text-green-600 bg-green-50">{rowData?.status}</p>
          </>
        ) : rowData?.status == "Holiday" ? (
          <p className="text-yellow-500 bg-yellow-50 ">{rowData?.status}</p>
        ) : (
          <p className="text-red-600 bg-red-50 ">{rowData?.status}</p>
        ),
    },
    {
      field: "employeeId",
      header: "Employee Name/Id",
      body: (rowData) =>
        rowData.employeeId ? (
          <>
            <div className="cursor-pointer">
              {rowData?.employeeId?.employeeName}
              <br />
              <span className="text-blue-600 text-sm">
                {rowData?.employeeId?.employeeId}
              </span>
            </div>
          </>
        ) : (
          "-"
        ),
    },
    {
      field: "worktype",
      header: "Work Type",
      body: (rowData) => rowData.workType || "-",
    },
    // {
    //   field: "employee_name",
    //   header: "Employee Name",
    //   body: (rowData) => rowData.employeeId?.employeeName || "-"
    // },
    // {
    //   field: "email",
    //   header: "Email",
    //   body: (rowData) => rowData.employeeId?.email || "-"
    // },
    // {
    //   field: "department", // Match the field to the data structure
    //   header: "Department",
    //   body: (rowData) => rowData.employeeId?.roleId.departmentId.name || "-"
    // },
    // {
    //   field: "role", // Match the field to the data structure
    //   header: "Role",
    //   body: (rowData) => rowData.employeeId?.roleId.name || "-"
    // },
    // {
    //   field: "entry_date_time",
    //   header: "Date",
    //   body: (rowData) => rowData.entry_date_time.split("-").reverse().join("-"),
    // },
    {
      field: "login_time",
      header: "Login Time",
      body: (rowData) =>
        rowData?.loginTime ? (
          <p
            className={`${
              rowData?.loginTime.split(":")[0] > 10
                ? "text-red-500"
                : (rowData?.loginTime.split(":")[0] == 10 &&
                    rowData?.loginTime.split(":")[1] >= 30) ||
                  rowData?.loginTime.split(" ")[1] == "pm"
                ? "text-red-500"
                : ""
            }`}
          >
            {rowData.loginTime}
          </p>
        ) : (
          "-"
        ),
    },
    {
      field: "logout",
      header: "Logout Time",
      body: (rowData) => rowData?.logout || "-",
      //   body: (rowData) => {
      // const logoutEntry = rowData?.entries?.find(
      //   (entry) => entry.reason?.toLowerCase() === "logout"
      // );

      // return logoutEntry?.time?.slice(12, 19) || "-";
      // }
    },
  {
      field: "total_break_time",
      header: "Break",
      body: (rowData) =>
        rowData?.result ? (
          <div
            className="cursor-pointer"
            onMouseEnter={(e) =>
              setTooltipData({
                data: rowData?.entries || [],
                x: e.pageX,
                y: e.pageY,
                date: rowData?.date,
                isHoveringTooltip: false,
              })
            }
            onMouseLeave={() => {
              // Add a short delay before hiding tooltip
              setTimeout(() => {
                setTooltipData((prev) => {
                  if (!prev?.isHoveringTooltip) return null;
                  return prev;
                });
              }, 150);
            }}
          >
            <p
              className={`${rowData?.result?.breakTime?.hours >= 1 &&
                  rowData?.result?.breakTime?.seconds >= 0
                  ? "text-red-500"
                  : ""
                }`}
            >
              {`${rowData?.result?.breakTime?.hours ?? 0}:${rowData?.result?.breakTime?.minutes ?? 0
                }:${rowData?.result?.breakTime?.seconds ?? 0}`}
            </p>
          </div>
        ) : (
          "-"
        ),
    },

    {
      field: "workTime",
      header: "Total Hours",
      body: (rowData) =>
        rowData.result ? (
          <p>{`${rowData?.result?.totalWorkTime?.hours}:${rowData?.result?.totalWorkTime?.minutes}:${rowData?.result?.totalWorkTime?.seconds} `}</p>
        ) : (
          "-"
        ),
    },

    // {
    //   field: "total_hours_worked",
    //   header: "Payable Time",
    //   body: (rowData) =>
    //     rowData?.result ? (
    //       <p
    //         className={`${
    //           rowData?.result?.payableTime?.hours >= 8 &&
    //           rowData?.result?.payableTime?.seconds >= 0
    //             ? "text-green-600"
    //             : ""
    //         }`}
    //       >
    //         {`${String(rowData?.result?.payableTime?.hours).padStart(
    //           2,
    //           "0"
    //         )}:${String(rowData?.result?.payableTime?.minutes).padStart(
    //           2,
    //           "0"
    //         )}:${String(rowData?.result?.payableTime?.seconds).padStart(
    //           2,
    //           "0"
    //         )}`}
    //       </p>
    //     ) : (
    //       "-"
    //     ),
    // },
    {
      field: "payableTime",
      header: "Payable Time",
      body: (rowData) =>
        rowData?.result ? (
          <p
            className={`${
              rowData?.result?.payableTime?.hours >= 8
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {`${String(rowData?.result?.payableTime?.hours).padStart(
              2,
              "0"
            )}:${String(rowData?.result?.payableTime?.minutes).padStart(
              2,
              "0"
            )}:${String(rowData?.result?.payableTime?.seconds).padStart(
              2,
              "0"
            )}`}
          </p>
        ) : (
          "-"
        ),
    },
  ];

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/emp-attendances/monthly-report`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            month: selectedMonth
              .toLocaleString("default", { month: "short" })
              .toLocaleLowerCase(),
            year: selectedMonth.getFullYear(),
          },
        }
      );

      setMonthlyReportList(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchEmployeeList = async () => {
    try {
       const monthDate = new Date(selectedMonth);
  
      const month = `${monthDate.getDate()}-${monthDate.getMonth() + 1}-${monthDate.getFullYear()}`
      const response = await axios.get(
        `${API_URL}/api/employees/all-employees-filterdate/${month}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const employeeemail = response.data.data.map((emp) => ({
        label: emp.employeeName,
        value: emp._id,
      }));
      
      const employeeName = response.data.data.map((emp) => emp.employeeName);

      setSelectedEmployee(employeeemail);
      setSelectedEmployeeName(employeeName);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchData();
    fetchEmployeeList();
  }, [selectedMonth]);

  const [selectedEmployeeDeatils, setSelectedEmployeeDetails] = useState(null);
  const [employeeData, setEmployeeData] = useState([]);

  const handleSubmit = async () => {
    const monthDate = new Date(selectedMonth);
    const payload = {
      month: `${monthDate.getMonth() + 1}-${monthDate.getFullYear()}`,
      employeeId: selectedEmployeeDeatils.split(" - ")[0],
    };
    console.log(payload);

    try {
      const response = await axios.get(
        `${API_URL}/api/attendance/particular-month-attendancelist`,
        { params: payload }
      );

      setEmployeeData(response.data.data);
     
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
      setEmployeeData("");
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const csvHeader = [
      "Date",
      "Employee Name",
      "Employee ID",
      "Work Type",
      "Login Time",
      "Logout",
      "Break",
      "Total Hours",
      "Payable Time",
    ];

    const csvRows = [
      csvHeader.join(","),
      ...employeeData.map((row) => {
        const breakTime = row.result
          ? `${row.result.breakTime?.hours}:${row.result.breakTime?.minutes}:${row.result.breakTime?.seconds}`
          : "-";

        const totalHours = row.result
          ? `${row.result.totalWorkTime?.hours}:${row.result.totalWorkTime?.minutes}:${row.result.totalWorkTime?.seconds}`
          : "-";

        const payableTime = row.result
          ? `${row.result.payableTime?.hours}:${row.result.payableTime?.minutes}:${row.result.payableTime?.seconds}`
          : "-";

        return [
          row.date?.split("T")[0] || "-",
          row.employeeId?.employeeName || "-",
          row.employeeId?.employeeId || "-",
          row.workType || "-",
          row.loginTime || "-",
          row.logout || "-",
          breakTime,
          totalHours,
          payableTime,
        ]
          .map((val) => `"${val}"`) // Escape commas
          .join(",");
      }),
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "monthly_attendance.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col justify-between overflow-x-hidden bg-gray-100 min-h-screen px-5 pt-2 md:pt-5 w-screen ">
      {loading ? (
        <Loader />
      ) : (
        <>
      <div>
        
        <div className="flex justify-between gap-2 mt-5 text-sm items-center">
          <Mobile_Sidebar />
          <div className="flex gap-1 items-center">
          <p
            className=" text-gray-500 cursor-pointer"
            onClick={() => navigate("/attendance")}
          >
            Attendance
          </p>
          <p>{">"}</p>
          <p className=" text-blue-500">Monthly Attendance</p>
          <p>{">"}</p>
          </div>
        </div>

        <p className="text-2xl md:text-3xl mt-2 md:mt-4 font-semibold">
          Monthly Report
        </p>

        <div className="bg-white mt-2 md:mt-4 px-5 py-5 rounded-2xl">
          {/* <p className="text-2xl font-bold text-gray-500">Attendance List</p> */}
          <div
            style={{ width: "auto", margin: "0 auto" }}
            className="overflow-x-hidden"
          >
            <div className="flex flex-wrap gap-8 justify-between items-center md:mt-5 ">
              {/* Global Search Input */}
              <div className="card flex flex-wrap md:flex-nowrap gap-4">
                <DatePicker
                  id="DATE OF JOINING"
                  placeholderText="Start work"
                  selected={selectedMonth}
                  onChange={(date) => setSelectedMonth(date)}
                  className="border-2 rounded-xl w-full md:w-44 h-10 px-4 border-gray-300 outline-none"
                  showMonthDropdown
                  showMonthYearPicker
                  dateFormat="MMM-YYYY"
                  dropdownMode="select" // This shows a select-style dropdown
                />
                {/* Global Search Input */}

                <Dropdown
                  value={selectedEmployeeDeatils}
                  onChange={(e) => setSelectedEmployeeDetails(e.value)}
                  options={selectedEmployee}
                  optionLabel="label"
                  placeholder="Select a Employee"
                  filter
                  className="w-full md:w-16rem border-2 rounded-md border-gray-300"
                />

                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:scale-105 duration-300"
                >
                  Search
                </button>
              </div>

              <div className="flex items-center justify-center gap-2">
                {/* <InputText
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Search"
                  className="px-2 py-2 bg-gray-200 rounded-md"
                /> */}
                <button
                  onClick={exportToCSV}
                  className="flex flex-wrap mb-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 py-1 md:py-2 md:px-4 rounded-mditems-center gap-2"
                >
                  Export CSV
                  <FaFileExport />
                </button>
              </div>
            </div>

            <DataTable
              className="mt-8"
              value={employeeData}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 20]}
              globalFilter={globalFilter} // Global search filter
              showGridlines
              resizableColumns
              emptyMessage="No Data Found"
            >
              {columns.map((col, index) => (
                <Column
                  key={index}
                  field={col.field}
                  header={col.header}
                  body={col.body}
                  // style={{
                  //   minWidth: "150px",
                  //   wordWrap: "break-word", // Allow text to wrap
                  //   overflow: "hidden", // Prevent text overflow
                  //   whiteSpace: "normal", // Ensure that text wraps within the available space
                  // }}
                />
              ))}
            </DataTable>
          </div>
        </div>
      </div>
      {/* {tooltipData && (
        <div
          className="absolute bg-[#fafafa] border border-gray-300 shadow-lg px-5 py-5 rounded text-xs z-50"
          style={{
            top: tooltipData.y + 10,
            left: tooltipData.x + 10,
          }}
        >
          <div className="">
            <p className="text-[16px] mb-4">({tooltipData.date.split("T")[0]})</p>
            {tooltipData?.data.map((entries, index) => (
              <div className=" ">
                <div className="mt-2 flex items-center text-[16px] justify-between gap-4">
                 
                  <h2 className="text-[16px] ">{entries.reason}</h2>
                <p className="text-gray-700">{new Date(entries.time)
                  .toLocaleTimeString("en-GB", { hour12: false })
                  .slice(0, 8)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )} */}

      {tooltipData?.data?.length > 0 && (
            <div
              className="absolute bg-[#FAFAFA] border border-gray-300 shadow-lg px-5 py-5 rounded text-xs z-50 max-w-[250px] max-h-[200px] overflow-y-auto transition-opacity duration-200"
              style={{
                top:
                  tooltipData.y + 10 + 200 > window.innerHeight
                    ? tooltipData.y - 200
                    : tooltipData.y + 10,
                left:
                  tooltipData.x + 10 + 250 > window.innerWidth
                    ? tooltipData.x - 250
                    : tooltipData.x + 10,
              }}
              onMouseEnter={() =>
                setTooltipData((prev) => ({ ...prev, isHoveringTooltip: true }))
              }
              onMouseLeave={() => setTooltipData(null)}
            >
              <p className="text-[16px] mb-4 font-medium text-gray-800">
                ({new Date(tooltipData.date).toLocaleDateString("en-GB")})
              </p>
              {tooltipData.data
                .filter(
                  (entry) => entry.reason !== "Login" && entry.reason !== "Logout"
                )
                .map((entry, index) => (
                  <div
                    key={index}
                    className="mt-2 flex items-center text-[16px] justify-between gap-4"
                  >
                    <h2 className="text-[16px]">{entry.reason}</h2>
                    <p className="text-gray-700">
                      {new Date(entry.time)
                        .toLocaleTimeString("en-GB", { hour12: false })
                        .slice(0, 8)}
                    </p>
                  </div>
                ))}
            </div>
          )}

        </>
      )}
      <Footer />
    </div>
  );
};

export default MonthlyAttendanceDetails_Mainbar;
