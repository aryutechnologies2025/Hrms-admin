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
import Sidebar from "../Sidebar";
import Loader from "../Loader";

const Leave_Report = () => {
  let navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [globalFilter, setGlobalFilter] = useState("");
  const [monthlyReportList, setMonthlyReportList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState([]);
  const [tooltipData, setTooltipData] = useState(null);
  const [permissionTooltipData, setPermissionTooltipData] = useState(null);
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      field: "S.No",
      header: "S.No",
      body: (_rowData, { rowIndex }) => rowIndex + 1,
    },
    {
      field: "employeeName",
      header: "Employee Name",
      body: (rowData) => rowData?.employee?.name || "-",
    },
    {
      field: "Leave Count",
      header: "No. of leave",
      body: (rowData) => (
        <div
          className="cursor-pointer"
          onMouseEnter={(e) => {
            setTooltipData({
              data: rowData?.summary?.leaveData || [],
              x: e.pageX,
              y: e.pageY,
              isHoveringTooltip: false,
            });
          }}
          onMouseLeave={() => {
            // Add small delay before hiding (so user can move to tooltip)
            setTimeout(() => {
              setTooltipData((prev) => {
                if (!prev?.isHoveringTooltip) return null;
                return prev; // keep tooltip open if hovering tooltip
              });
            }, 150);
          }}
        >
          {rowData?.summary?.leaveCount ?? 0}
        </div>
      ),
    },

    // {
    //   field: "status",
    //   header: "Status",
    //   body: (rowData) =>
    //     rowData?.status == "Present" ? (
    //       <>
    //         <p className="text-green-600 bg-green-50">{rowData?.status}</p>
    //       </>
    //     ) : rowData?.status == "Holiday" ? (
    //       <p className="text-yellow-500 bg-yellow-50 ">{rowData?.status}</p>
    //     ) : (
    //       <p className="text-red-600 bg-red-50 ">{rowData?.status}</p>
    //     ),
    // },

    {
      field: "Permission Count",
      header: "Permission",
      body: (rowData) => (
        <div
          className="cursor-pointer"
          onMouseEnter={(e) => {
            setPermissionTooltipData({
              data: rowData?.summary?.permissionData || [],
              x: e.pageX,
              y: e.pageY,
              isHoveringTooltip: false,
            });
          }}
          onMouseLeave={() => {
            // Add small delay before hiding (so user can move from cell → tooltip)
            setTimeout(() => {
              setPermissionTooltipData((prev) => {
                if (!prev?.isHoveringTooltip) return null;
                return prev; // keep tooltip open if hovering tooltip
              });
            }, 150);
          }}
        >
          {rowData?.summary?.permissionCount ?? 0}
        </div>
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
      const response = await axios.get(
        `${API_URL}/api/employees/all-employees`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const employeeIds = response.data.data.map(
        (emp) => `${emp.employeeId} - ${emp.employeeName}`
      );
      const employeeName = response.data.data.map((emp) => emp.employeeName);

      setSelectedEmployee(employeeIds);
      setSelectedEmployeeName(employeeName);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSubmit();
    // fetchData();
    fetchEmployeeList();
  }, [selectedMonth]);

  const [selectedEmployeeDeatils, setSelectedEmployeeDetails] = useState(null);
  const [employeeData, setEmployeeData] = useState([]);

  const handleSubmit = async () => {
    const monthDate = new Date(selectedMonth);

    let month = `${monthDate.getMonth() + 1}-${monthDate.getFullYear()}`;

    // console.log(payload);

    try {
      const response = await axios.get(
        `${API_URL}/api/leave/leave-report/${month}`,
        {withCredentials: true}
      );

      setEmployeeData(response.data.data);
      // console.log(response.data.data);
      setLoading(false);
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
    <div className="flex">
      {loading ? (
        <Loader />
      ) : (
        <>
          <Sidebar />
          <div className="flex flex-col justify-between overflow-x-hidden bg-gray-100 min-h-screen px-5 pt-2 md:pt-5 w-screen ">
            <div>

              <div className="">
                <Mobile_Sidebar />

              </div>
              <div className="flex justify-end mt-2 md:mt-0 gap-1 items-center">
                <p
                  className=" text-gray-500 cursor-pointer"
                  onClick={() => navigate("/leaves")}
                >
                  Leaves
                </p>
                <p>{">"}</p>
                <p className=" text-blue-500">Leave Reports</p>
                <p>{">"}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-2xl md:text-3xl mt-2 md:mt-4 font-semibold">
                  Leave Reports
                </p>

              </div>

              <div className="bg-white mt-2 md:mt-4 px-5 py-5 rounded-2xl">
                {/* <p className="text-2xl font-bold text-gray-500">Attendance List</p> */}
                <div
                  style={{ width: "auto", margin: "0 auto" }}
                  className="overflow-x-hidden"
                >
                  <div className="flex flex-wrap gap-8 justify-between items-center md:mt-5 ">
                    {/* Global Search Input */}
                    <div className="card flex gap-4">
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

                      {/* <Dropdown
                    value={selectedEmployeeDeatils}
                    onChange={(e) => setSelectedEmployeeDetails(e.value)}
                    options={selectedEmployee}
                    optionLabel="name"
                    placeholder="Select a Employee"
                    filter
                    className="w-full md:w-16rem border-2 rounded-md border-gray-300"
                  /> */}

                      <button
                        onClick={handleSubmit}
                        className=" text-white bg-blue-500 hover:bg-blue-600 font-medium px-4 py-2 rounded-md hover:scale-105 duration-300"
                      >
                        Search
                      </button>
                      <button
                        onClick={() =>
                          navigate(-1)
                        }
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-2 py-1 md:py-2 md:px-4 rounded-md hover:scale-105 duration-300"
                      >
                        Back
                      </button>
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-4">
                      <InputText
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search"
                        className="border-2 rounded-xl w-full md:w-44 h-10 px-4 border-gray-300 outline-none"
                      />
                      <button
                        onClick={exportToCSV}
                        className="flex justify-center flex-wrap bg-blue-500 hover:bg-blue-600 text-white font-semibold w-full py-2 px-3 md:py-2 md:px-4 rounded-md items-center gap-2"
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
                    globalFilter={globalFilter}
                    globalFilterFields={["employee.name"]}
                    showGridlines
                    resizableColumns
                    emptyMessage="No result found"
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
            {tooltipData?.data?.length > 0 && (
              <div
                className={`absolute bg-[#FAFAFA] border border-gray-300 shadow-lg px-5 py-5 rounded text-xs z-50 max-h-[180px] overflow-y-auto transition-opacity duration-200`}
                style={{
                  top: tooltipData.y + 10,
                  left: tooltipData.x - 10,
                }}
                onMouseEnter={() =>
                  setTooltipData((prev) => ({
                    ...prev,
                    isHoveringTooltip: true,
                  }))
                }
                onMouseLeave={() => setTooltipData(null)}
              >
                {tooltipData.data.map((data, index) => (
                  <div
                    key={index}
                    className="mt-2 flex items-center text-[16px] justify-between gap-4"
                  >
                    <h2 className="text-[16px] font-medium text-gray-800">
                      {data?.status}
                    </h2>
                    <p className="text-gray-700">{data?.date}</p>
                  </div>
                ))}
              </div>
            )}

            {permissionTooltipData?.data?.length > 0 && (
              <div
                className="absolute bg-white border border-gray-300 shadow-lg px-5 py-4 rounded text-xs z-50 max-h-[180px] overflow-y-auto transition-opacity duration-200"
                style={{
                  top: permissionTooltipData.y + 10,
                  left: permissionTooltipData.x - 10,
                }}
                // when mouse enters the tooltip, mark it as hovered
                onMouseEnter={() =>
                  setPermissionTooltipData((prev) => ({
                    ...prev,
                    isHoveringTooltip: true,
                  }))
                }
                // when mouse leaves tooltip, close it
                onMouseLeave={() => setPermissionTooltipData(null)}
              >
                {permissionTooltipData.data.map((item, index) => (
                  <div
                    key={index}
                    className="mt-2 flex items-center justify-between gap-4 text-[14px]"
                  >
                    <h2 className="font-medium text-gray-800">
                      {item?.status}
                    </h2>
                    <p className="text-gray-600">{item?.date}</p>
                  </div>
                ))}
              </div>
            )}

            <Footer />
          </div>
        </>
      )}
    </div>
  );
};

export default Leave_Report;
