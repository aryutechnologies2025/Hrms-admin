import React from "react";
import Mobile_Sidebar from "../components/Mobile_Sidebar";
import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { API_URL } from "../config";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import { FaFileExport } from "react-icons/fa6";
import { capitalizeFirstLetter } from "../utils/StringCaps";
import { dateUtils } from "../utils/dateUtils";

function Reports_details() {
  const formatDateTime = dateUtils();

  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  // console.log("selectedMonth", selectedMonth);
  const [globalFilter, setGlobalFilter] = useState("");
  const [monthlyReportList, setMonthlyReportList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState([]);

  const [selectedEmployeeName, setSelectedEmployeeName] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("selectedEmployeeName", selectedEmployeeName);

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
    } catch (error) {
      console.log(error);
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

      const employeeIds = response.data.data.map((emp) => ({
        label: emp.employeeName,
        value: emp._id,
      }));
      const employeeName = response.data.data.map((emp) => emp.email);

      setSelectedEmployee(employeeIds);
      setSelectedEmployeeName(employeeName);
    } catch (error) {
      console.log(error);
    }
  };

  const [tasklist, setTasklist] = useState([]);

  console.log("tasklist", tasklist);

  useEffect(() => {
    // fetchData();
    // fetchEmployeetask();
    fetchEmployeeList();
  }, [selectedMonth]);

  const [selectedEmployeeDeatils, setSelectedEmployeeDetails] = useState(null);

  console.log("selectedEmployeeDeatils", selectedEmployeeDeatils);
  // const [employeeData, setEmployeeData] = useState([]);

  const handleSubmit = async () => {
    setLoading(true);
    const monthDate = new Date(selectedMonth);
    const payload = {
      month: `${monthDate.getMonth() + 1}-${monthDate.getFullYear()}`,
      employeeId: selectedEmployeeDeatils.split(" - ")[0],
    };
    console.log(payload);

    try {
      const response = await axios.get(
        `${API_URL}/api/task/particularday-report`,
        { params: payload }
      );
      setTasklist(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
      setEmployeeData("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCurrentDateData = async () => {
      setLoading(true);

      const today = new Date();
      const formattedMonth = `${today.getMonth() + 1}-${today.getFullYear()}`;

      const payload = {
        month: formattedMonth,
        employeeId: selectedEmployeeName,
      };

      console.log("payload", payload);

      try {
        const response = await axios.get(
          `${API_URL}/api/task/particularday-report`,
          { params: payload }
        );
        setTasklist(response.data.data);
        console.log("All employees' data for today:", response.data.data);
      } catch (error) {
        console.log(error);
        setEmployeeData("");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentDateData();
  }, []);

  const [selectedTask, setSelectedTask] = useState(false);

  const handleClicklogs = () => {
    setSelectedTask(true);
  };

  const handleCloselogs = () => {
    setSelectedTask(false);
  };

  // Function to calculate overall time
  const exportToCSV = () => {
    if (!tasklist || tasklist.length === 0) {
      alert("No data available to export");
      return;
    }

    // Prepare CSV headers
    const headers = [
      "Date",
      "Project Name",
      "Task ID",
      "Task Title",
      "Status",
      // "End Time",
      "Total Duration",
      "Tester Duration",
    ];

    // Flatten tasklist into rows
    const rows = tasklist.flatMap((day) =>
      day.tasks.map((task) => [
        day.date,
        task.projectName,
        task.taskId,
        task.title,
        task.status,
        // task.endTime
        //   ? new Date(task.endTime).toLocaleString("en-GB", {
        //       day: "2-digit",
        //       month: "2-digit",
        //       year: "numeric",
        //       hour: "2-digit",
        //       minute: "2-digit",
        //       hour12: true,
        //     })
        //   : "",
        `${task.totalDuration.hours}h ${task.totalDuration.minutes}m ${task.totalDuration.seconds}s`,
        `${task.totalDurationTester.hours}h ${task.totalDurationTester.minutes}m ${task.totalDurationTester.seconds}s`,
      ])
    );

    // Combine headers + rows
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    // Create downloadable CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "tasks.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  function onClickCard(taskId) {
    window.open(`/tasklist-details/${taskId}`, "_blank");

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }

  return (
    <div className="flex  flex-col justify-between w-screen min-h-screen bg-gray-100 px-3 md:px-5 pt-2 md:pt-10 ">
      <div className="p-3 ">
        <Mobile_Sidebar />
        {/* breadcrumb */}
        <div className="flex gap-2  text-sm items-center">
          <p
            className="text-sm text-gray-500"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </p>
          <p>{">"}</p>
          <p className="text-sm text-blue-500 ">Reports</p>
        </div>
        <p className="text-2xl md:text-3xl mt-8 font-semibold">
          Monthly Report
        </p>
        <div className="bg-white mt-8 px-5 py-5 rounded-2xl">
          {/* <p className="text-2xl font-bold text-gray-500">Attendance List</p> */}
          <div
            style={{ width: "auto", margin: "0 auto" }}
            className="overflow-x-hidden"
          >
            <div className="flex flex-wrap md:flex-nowrap gap-3 md:gap-8 justify-between items-center md:mt-5 ">
              {/* Global Search Input */}
              <div className="card flex flex-wrap md:flex-nowrap gap-4 md:z-50">
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
                  className="flex justify-center flex-wrap bg-blue-500 hover:bg-blue-600 text-white font-semibold w-full py-2 px-3 md:py-2 md:px-4 rounded-md items-center gap-2"
                >
                  Export CSV
                  <FaFileExport />
                </button>
              </div>
            </div>
            {console.log("selectedEmployeeName 123", selectedEmployeeName)}
            {/* reports desgins */}
            <div className=" mt-4 md:mt-0 p-3 md:p-5 bg-gray-100 min-h-screen">
              <h1 className="text-2xl font-bold mb-6">Monthly Task Tracker</h1>
              {selectedEmployeeDeatils && selectedEmployeeDeatils.length > 0 ? (
                <div className="max-h-[800px] overflow-y-auto p-1 md:p-4 bg-gray-100 rounded-xl">
                  {loading ? (
                    <div className="flex items-center justify-center h-[500px]">
                      <div className="w-12 h-12 border-4  border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    (() => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const filteredTaskList = tasklist.filter((day) => {
                        const dayDate = new Date(day.date);
                        dayDate.setHours(0, 0, 0, 0);
                        return dayDate <= today;
                      });

                      return filteredTaskList.length > 0 ? (
                        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
                          <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse text-sm">
                              <thead>
                                <tr className="bg-gradient-to-r from-blue-100 to-blue-50 text-gray-700">
                                  <th className="px-6 py-3 font-semibold text-left md:sticky left-0 bg-gradient-to-r from-blue-100 to-blue-50 z-10 ">
                                    Date
                                  </th>
                                  <th className="px-6 py-3 font-semibold md:sticky  text-left">
                                    Project
                                  </th>
                                  <th className="px-6 py-3 font-semibold md:sticky  text-left">
                                    Task ID
                                  </th>
                                  <th className="px-6 py-3 font-semibold md:sticky  text-left">
                                    Status
                                  </th>
                                  <th className="px-6 py-3 font-semibold md:sticky  ">
                                    Details
                                  </th>
                                  <th className="px-6 py-3 font-semibold md:sticky  ">
                                    Start Time
                                  </th>
                                  <th className="px-6 py-3 font-semibold md:sticky  ">
                                    End Time
                                  </th>
                                  <th className="px-6 py-3 font-semibold md:sticky  text-left">
                                    Duration
                                  </th>
                                  <th className="px-6 py-3 font-semibold md:sticky  text-left">
                                    Tester Duration
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredTaskList
                                  .filter(
                                    (day) =>
                                      (day.tasks && day.tasks.length > 0) ||
                                      (day.attendanceResult &&
                                        day.attendanceResult.length > 0)
                                  )
                                  .map((day, dayIndex) => {
                                    const rowSpan = day.tasks.length || 1;
                                    const dayBg =
                                      dayIndex % 2 === 0
                                        ? "bg-white"
                                        : "bg-gray-50";

                                    return day.tasks.length > 0 ? (
                                      day.tasks.map((task, taskIndex) => (
                                        <tr
                                          key={`${day.date}-${taskIndex}`}
                                          className={`transition-colors hover:bg-blue-50 ${dayBg}`}
                                        >
                                          {/* Date + Attendance Column */}
                                          {taskIndex === 0 && (
                                            <td
                                              rowSpan={rowSpan}
                                              className="px-4 py-4 md:sticky left-0 border-r border-gray-200 align-top z-10"
                                            >
                                              <div className="flex flex-col items-center justify-start p-4 rounded-xl shadow-md bg-gradient-to-b from-white via-gray-50 to-gray-100 border border-gray-200 space-y-3">
                                                {/* Day Name */}
                                                <div className="text-xl font-bold text-blue-700">
                                                  {day.dayName || "-"}
                                                </div>

                                                {/* Date */}
                                                <div className="text-sm font-semibold text-white px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md">
                                                  {day.date ? formatDateTime(day.date) : "-"}
                                                </div>

                                                {/* Attendance Info */}
                                                {task?.attendanceResult?.[0] ? (
                                                  <div className="text-gray-700 text-sm text-center space-y-1">
                                                    <p>
                                                      <span className="font-semibold">
                                                        Status:
                                                      </span>{" "}
                                                      <span
                                                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                          task
                                                            .attendanceResult[0]
                                                            .status ===
                                                          "Present"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                        }`}
                                                      >
                                                        {task
                                                          .attendanceResult[0]
                                                          .status || "-"}
                                                      </span>
                                                    </p>

                                                    {task.attendanceResult[0]
                                                      .status === "Present" && (
                                                      <>
                                                        <p>
                                                          <span className="font-semibold">
                                                            Login:
                                                          </span>{" "}
                                                          {task
                                                            .attendanceResult[0]
                                                            .loginTime || "-"}
                                                        </p>
                                                        <p>
                                                          <span className="font-semibold">
                                                            Logout:
                                                          </span>{" "}
                                                          {task
                                                            .attendanceResult[0]
                                                            .logout || "-"}
                                                        </p>
                                                        <p>
                                                          <span className="font-semibold">
                                                            Work Time:
                                                          </span>{" "}
                                                          {task
                                                            .attendanceResult[0]
                                                            .payableTime
                                                            ? `${
                                                                task
                                                                  .attendanceResult[0]
                                                                  .payableTime
                                                                  .hours || 0
                                                              }h ${
                                                                task
                                                                  .attendanceResult[0]
                                                                  .payableTime
                                                                  .minutes || 0
                                                              }m ${
                                                                task
                                                                  .attendanceResult[0]
                                                                  .payableTime
                                                                  .seconds || 0
                                                              }s`
                                                            : "-"}
                                                        </p>
                                                      </>
                                                    )}
                                                  </div>
                                                ) : (
                                                  <div className="text-gray-400 italic text-sm">
                                                    No Tasks
                                                  </div>
                                                )}
                                              </div>
                                            </td>
                                          )}

                                          {/* Project */}
                                          <td className="px-6 py-4 font-semibold text-blue-600">
                                            {task?.projectId?.name || "-"}
                                          </td>

                                          {/* Task ID */}
                                          <td
                                            className="px-6 py-4 text-gray-500 cursor-pointer hover:text-blue-600 hover:underline"
                                            onClick={() =>
                                              onClickCard(task?.taskId)
                                            }
                                          >
                                            {task?.taskId
                                              ? `#${task.taskId}`
                                              : "-"}
                                          </td>

                                          {/* Status */}
                                          <td className="py-4 w-[100px]">
                                            <span
                                              className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                                                task.status === "done"
                                                  ? "bg-green-200 text-green-800"
                                                  : task.status === "in-review"
                                                  ? "bg-yellow-200 text-yellow-800"
                                                  : "bg-red-200 text-red-800"
                                              }`}
                                            >
                                              {task.status
                                                ? capitalizeFirstLetter(
                                                    task.status
                                                  )
                                                : "-"}
                                            </span>
                                          </td>

                                          {/* Task Title */}
                                          <td className="px-6 py-4">
                                            {task.title ? (
                                              <ul className="list-disc list-inside space-y-1 text-gray-700 text-xs">
                                                {task.title
                                                  .split(",")
                                                  .map((point, index) => (
                                                    <li key={index}>
                                                      {point.trim() || "-"}
                                                    </li>
                                                  ))}
                                              </ul>
                                            ) : (
                                              "-"
                                            )}
                                          </td>

                                          {/* Start Time */}
                                          <td className="px-6 py-4 text-gray-500 hover:text-blue-600 hover:underline">
                                            {task?.startTime
                                              ? (() => {
                                                  const d = new Date(
                                                    task.startTime
                                                  );
                                                  return isNaN(d)
                                                    ? "-"
                                                    : `${formatDateTime(task?.startTime)} ${d.toLocaleTimeString(
                                                        "en-IN",
                                                        {
                                                          timeZone:
                                                            "Asia/Kolkata",
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                          second: "2-digit",
                                                          hour12: true,
                                                        }
                                                      )}`;
                                                })()
                                              : "-"}
                                          </td>

                                          {/* End Time */}
                                          <td className="px-6 py-4 text-gray-500 hover:text-blue-600 hover:underline">
                                            {task?.endTime
                                              ? (() => {
                                                  const d = new Date(
                                                    task.endTime
                                                  );
                                                  return isNaN(d)
                                                    ? "-"
                                                    : `${formatDateTime(task?.endTime)} ${d.toLocaleTimeString(
                                                        "en-IN",
                                                        {
                                                          timeZone:
                                                            "Asia/Kolkata",
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                          second: "2-digit",
                                                          hour12: true,
                                                        }
                                                      )}`;
                                                })()
                                              : "-"}
                                          </td>

                                          {/* Total Duration */}
                                          <td
                                            className="px-6 py-4 text-blue-600 cursor-pointer hover:underline"
                                            onClick={() =>
                                              setSelectedTask(task?.logs)
                                            }
                                          >
                                            {task?.totalDuration
                                              ? `${
                                                  task.totalDuration.hours || 0
                                                }h ${
                                                  task.totalDuration.minutes ||
                                                  0
                                                }m ${
                                                  task.totalDuration.seconds ||
                                                  0
                                                }s`
                                              : "-"}
                                          </td>

                                          {/* Tester Duration */}
                                          <td
                                            className="px-6 py-4 text-blue-600 cursor-pointer hover:underline"
                                            onClick={() =>
                                              setSelectedTask(task?.logs)
                                            }
                                          >
                                            {task?.totalDurationTester
                                              ? `${
                                                  task.totalDurationTester
                                                    .hours || 0
                                                }h ${
                                                  task.totalDurationTester
                                                    .minutes || 0
                                                }m ${
                                                  task.totalDurationTester
                                                    .seconds || 0
                                                }s`
                                              : "-"}
                                          </td>
                                        </tr>
                                      ))
                                    ) : (
                                      // Only attendance row when no tasks
                                      <tr key={day.date} className={dayBg}>
                                        <td
                                          colSpan="11"
                                          className="px-6 py-4 text-center text-gray-600 italic"
                                        >
                                          <div className="flex flex-col items-center justify-center p-3 rounded-lg shadow-sm bg-white border border-gray-200">
                                            <div className="text-lg font-bold text-blue-700 mb-1">
                                              {day.dayName || "-"}
                                            </div>
                                            <div className="text-sm font-semibold text-white px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 shadow mb-2">
                                              {day.date
                                                ? new Date(
                                                    day.date
                                                  ).toLocaleDateString(
                                                    "en-GB",
                                                    {
                                                      day: "2-digit",
                                                      month: "2-digit",
                                                      year: "numeric",
                                                    }
                                                  )
                                                : "-"}
                                            </div>
                                            {day.attendanceResult?.[0] ? (
                                              <div className="text-gray-700 text-sm text-center">
                                                <p>
                                                  <strong>Status:</strong>{" "}
                                                  {day.attendanceResult[0]
                                                    .status || "-"}
                                                </p>
                                                {day.attendanceResult[0]
                                                  .status === "Present" && (
                                                  <>
                                                    <p>
                                                      <strong>Login:</strong>{" "}
                                                      {day.attendanceResult[0]
                                                        .loginTime || "-"}
                                                    </p>
                                                    <p>
                                                      <strong>Logout:</strong>{" "}
                                                      {day.attendanceResult[0]
                                                        .logout || "-"}
                                                    </p>
                                                  </>
                                                )}
                                              </div>
                                            ) : (
                                              <div className="text-gray-500 italic">
                                                No Tasks
                                              </div>
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <p className="text-center text-gray-500">
                          No data available
                        </p>
                      );
                    })()
                  )}
                </div>
              ) : (
                <p className="text-center">Select employee</p>
              )}
              {/* Popup Modal */}
              {selectedTask && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
                  onClick={handleCloselogs}
                >
                  <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Details</h2>
                      <button
                        className="text-gray-500 hover:text-red-500 text-2xl"
                        onClick={handleCloselogs}
                      >
                        &times;
                      </button>
                    </div>

                    <table className="min-w-full border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2 border">S.No</th>
                          <th className="p-2 border">Status</th>
                          <th className="p-2 border">Date</th>
                          <th className="p-2 border">Notes</th>
                          <th className="p-2 border">User</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedTask?.length > 0 ? (
                          selectedTask.map((item, index) => (
                            <tr
                              key={item._id}
                              className="text-sm text-gray-700"
                            >
                              <td className="p-2 border text-center">
                                {index + 1}
                              </td>
                              <td className="p-2 border text-center">
                                <span
                                  className={`px-2 py-1 rounded font-semibold ${
                                    item.status === "hold"
                                      ? "text-red-600"
                                      : item.status === "restart"
                                      ? "text-green-600"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {item.status === "start"
                                    ? "Tester Started"
                                    : capitalizeFirstLetter(
                                        item.status.replace(
                                          /[^a-zA-Z0-9 ]/g,
                                          " "
                                        )
                                      )}
                                </span>
                              </td>
                              <td className="p-2 border text-center">
                                {item.updatedAt
                                  ? new Date(item.updatedAt).toLocaleString(
                                      "en-GB",
                                      {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      }
                                    )
                                  : ""}
                              </td>
                              <td className="p-2 border">
                                {capitalizeFirstLetter(item.note || "-")}
                              </td>
                              <td className="p-2 border">
                                {capitalizeFirstLetter(item.updatedBy)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="5"
                              className="p-4 text-center text-gray-400"
                            >
                              No data available.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
}

export default Reports_details;
