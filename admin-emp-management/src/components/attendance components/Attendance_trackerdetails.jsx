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

const Attendance_trackerdetails = () => {
  let navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [globalFilter, setGlobalFilter] = useState("");
  const [monthlyReportList, setMonthlyReportList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState([]);
  const [tooltipData, setTooltipData] = useState(null);

  const [loading, setLoading] = useState(true);

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${API_URL}/api/emp-attendances/monthly-report`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //         params: {
  //           month: selectedMonth
  //             .toLocaleString("default", { month: "short" })
  //             .toLocaleLowerCase(),
  //           year: selectedMonth.getFullYear(),
  //         },
  //       }
  //     );

  //     setMonthlyReportList(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchData();
    fetchEmployeeList();
  }, [selectedMonth]);

  const [employeeData, setEmployeeData] = useState([]);
  console.log("employeeData", employeeData);

  // const handleSubmit = async () => {
  //   const monthDate = new Date(selectedMonth);
  //   const payload = {
  //     month: `${monthDate.getMonth() + 1}-${monthDate.getFullYear()}`,
  //     employeeId: selectedEmployeeDeatils.split(" - ")[0],
  //   };
  //   console.log(payload);

  //   try {
  //     const response = await axios.get(
  //       `${API_URL}/api/attendance/particular-month-attendancelist-details`,
  //       { params: payload }
  //     );

  //     setEmployeeData(response.data.data);
  //     console.log(response.data.data);
  //   } catch (error) {
  //     console.log(error);
  //     setEmployeeData("");
  //   }
  // };

  const [dateColumns, setDateColumns] = useState([]);
  // const [employeeData, setEmployeeData] = useState([]);

  const statusMap = {
    Present: "P",
    Absent: "A",
    Holiday: "H",
    // Weekend: "WK",

  };

  // const attendanceTemplate = (value) => {
  //   let bgColor = "#666666";
  //   if (value === "P") bgColor = "rgb(3 135 8)"; // green
  //   else if (value === "A") bgColor = "#F44336"; // red
  //   else if (value === "H") bgColor = "#FFA000"; // amber
  //   else if (value === "WK") bgColor = "#1976D2"; // blue

  const attendanceTemplate = (value) => {
    let bgColor = "#666666";
    let textColor = "text-gray-600";

    if (value === "P") {
      bgColor = "bg-green-200"; // green
      textColor = "text-green-600"
    }
    else if (value === "A") {
      bgColor = "bg-red-200"; // red
      textColor = "text-red-600"
    }
    else if (value === "H") {
      bgColor = "bg-yellow-200"; // amber
      textColor = "text-yellow-600"
    }
    else if (value === "CO") {
      bgColor = "bg-purple-500";
      textColor = "text-white";
    }
    else if (value === "LOP") {
      bgColor = "bg-red-500";
      textColor = "text-white";
    }
    else if (value === "HD") {
      bgColor = "bg-blue-600";
      textColor = "text-white";
    }



    else if (value && value !== "-") {
      bgColor = "bg-gray-200";
      textColor = "text-gray-600"
    }



    return (
      <div
        className={`${bgColor} ${textColor} font-semibold w-8`}
        style={{

          textAlign: "center",
          padding: "2px",
          borderRadius: "4px",
        }}
      >
        {value || "-"}
      </div>
    );
  };

  // useEffect(() => {
  //   const now = new Date();
  //   setSelectedMonth(now.toISOString().slice(0, 7)); // format: yyyy-MM for input[type="month"]
  // }, []);

  // useEffect(() => {
  //   if (selectedMonth) {
  //     // handleSubmit();
  //   }
  // }, [selectedMonth]);

  useEffect(() => {
    const now = new Date();
    setSelectedMonth(now);

    // Fetch current month attendance once on mount
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    handleSubmitWithDate(now, month, year);
  }, []);

  // Create a helper so handleSubmit can be reused
  const handleSubmitWithDate = async (dateObj, month, year) => {
    const payload = { month: `${month}-${year}` };
    // console.log("payload", payload);

    try {
      const response = await axios.get(
        `${API_URL}/api/attendance/particular-month-attendancelist-details`,
        { params: payload }
      );


      const apiData = response.data.data;
      // console.log("response",apiData)

      const daysInMonth = new Date(year, month, 0).getDate();
      const today = new Date();
      const todayDay = today.getDate();
      const todayMonth = today.getMonth() + 1;
      const todayYear = today.getFullYear();

      const generatedColumns = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        return {
          field: `${day}/${month.toString().padStart(2, "0")}`,
          header: `${day}/${month.toString().padStart(2, "0")}`,
        };
      });
      setDateColumns(generatedColumns);

      const finalData = apiData.map((emp) => {
        const row = {
          employeeName: emp.employee?.name || "Unknown",
          noOfPresent: 0,
          employeeid: emp.employee?.id,
        };

        generatedColumns.forEach((col) => {
          const dayNum = parseInt(col.field.split("/")[0], 10);
          if (
            year > todayYear ||
            (year === todayYear && month > todayMonth) ||
            (year === todayYear && month === todayMonth && dayNum > todayDay)
          ) {
            row[col.field] = "-";
          } else {
            row[col.field] = "-";
          }
        });

        emp.data.forEach((att) => {
          const dateObj = new Date(att.date);
          const day = dateObj.getDate();
          const attMonth = dateObj.getMonth() + 1;
          const attYear = dateObj.getFullYear();

          if (
            attYear < todayYear ||
            (attYear === todayYear && attMonth < todayMonth) ||
            (attYear === todayYear &&
              attMonth === todayMonth &&
              day <= todayDay)
          ) {
            const key = `${day}/${month.toString().padStart(2, "0")}`;
            // const statusShort = statusMap[att.status] || "-";
            const statusShort = statusMap[att.status] || att.status || "-";
            row[key] = statusShort;
            if (att.status === "Present") {
              row.noOfPresent++;
            }
          }
        });

        return row;
      });

      setEmployeeData(finalData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setEmployeeData([]);
      setLoading(false);
    }
  };

  // Keep original handleSubmit for manual search
  const handleSubmit = async () => {
    if (!selectedMonth) {
      alert("Please select a month");
      return;
    }

    setLoading(true); // show loader

    const monthDate = new Date(selectedMonth);
    const month = monthDate.getMonth() + 1;
    const year = monthDate.getFullYear();

    try {
      await handleSubmitWithDate(monthDate, month, year);
    } finally {
      setLoading(false); // hide loader
    }
  };



  const exportToCSV = () => {
    if (!employeeData.length) {
      alert("No data to export");
      return;
    }

    // Build CSV header
    const headers = [
      "Employee Name",
      "No. of Present",
      ...dateColumns.map((col) => col.header),
    ];

    // Build CSV rows
    const rows = employeeData.map((emp) => {
      return [
        emp.employeeName,
        emp.noOfPresent,
        ...dateColumns.map((col) => emp[col.field] || "-"),
      ];
    });

    // Combine header + rows
    const csvContent =
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    // Download as file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "attendance.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  function onClickCard(employeeId) {
    // console.log("employeeId",employeeId)
    window.open(`/employeedetails/${employeeId}`, "_blank");

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }
  const [dataTable, setDataTable] = useState(false);

  return (
    <div className="flex flex-col justify-between overflow-x-hidden bg-gray-100 min-h-screen px-5 pt-2 md:pt-5 w-screen ">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <Mobile_Sidebar />

            <div className="flex gap-2 mt-5 text-sm items-center">
              <p
                className=" text-gray-500 cursor-pointer"
                onClick={() => navigate("/attendance")}
              >
                Attendance
              </p>
              <p>{">"}</p>
              <p className=" text-blue-500">Attendance Tracker</p>
              <p>{">"}</p>
            </div>

            <p className="text-2xl md:text-3xl mt-8 font-semibold">
              Monthly Tracker
            </p>

            <div className="bg-white mt-8 px-5 py-5 rounded-2xl">
              {/* <p className="text-2xl font-bold text-gray-500">Attendance List</p> */}
              <div
                style={{ width: "auto", margin: "0 auto" }}
                className="overflow-x-hidden"
              >
                <div className="flex flex-wrap gap-3 md:gap-8 justify-between items-center mt-2 md:mt-5 ">
                  {/* Global Search Input */}
                  <div className="card flex gap-4">
                    <DatePicker
                      id="DATE OF JOINING"
                      placeholderText="Start work"
                      selected={selectedMonth}
                      onChange={(date) => setSelectedMonth(date)}
                      className="border-2 rounded-xl w-28 md:w-44 h-10 px-4 border-gray-300 outline-none "
                      showMonthDropdown
                      showMonthYearPicker
                      popperClassName="!z-[9999]"
                      dateFormat="MMM-YYYY"
                      dropdownMode="select" // This shows a select-style dropdown
                    />
                    {/* Global Search Input */}

                    <button
                      onClick={handleSubmit}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:scale-105 duration-300"
                    >
                      search{" "}
                    </button>
                  </div>

                  <div className="flex items-center justify-center">

                    <button
                      onClick={exportToCSV}
                      className="flex flex-wrap mb-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold w-full px-2 py-1 md:py-2 md:px-4 rounded-md items-center gap-2"
                    >
                      Export CSV
                      <FaFileExport />
                    </button>
                  </div>
                </div>

                {/* <DataTable
              className="mt-8"
              value={employeeData}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 20]}
              globalFilter={globalFilter} // Global search filter
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
                  
                />
              ))}
            </DataTable> */}
                {loading ? (
                  <Loader />
                ) : (
                  <div className="z-2 w-full mt-4">
                    <div className="overflow-x-scroll overflow-y-hidden w-full">
                      <div className="min-w-[800px]">
                        <DataTable
                          value={employeeData}
                          scrollable
                          scrollDirection="both"
                          scrollHeight="80vh"
                          className="mt-4 sticky-header-table"
                          emptyMessage="No Data Found"
                        >
                          <Column
                            field="employeeName"
                            header="Employee Name"
                            frozen
                            style={{ minWidth: "200px" }}
                            body={(row) => (
                              <a
                                href="#"
                                className="text-blue-600 hover:underline cursor-pointer"
                                onClick={() => onClickCard(row.employeeid)}
                              >
                                {row.employeeName}
                              </a>
                            )}
                          />
                          <Column
                            field="noOfPresent"
                            header="No of Present"
                            frozen
                            alignFrozen="left"
                            style={{ minWidth: "150px" }}
                          />
                          {dateColumns.map((col, index) => (
                            <Column
                              key={index}
                              field={col.field}
                              header={col.header}
                              style={{ minWidth: "60px", textAlign: "center" }}
                              body={(rowData) => attendanceTemplate(rowData[col.field])}
                            />
                          ))}
                        </DataTable>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      <Footer />
    </div>
  );
};

export default Attendance_trackerdetails;
