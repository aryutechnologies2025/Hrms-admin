import present from "../../assets/present.svg";
import not_present from "../../assets/not_present.svg";
import WFH from "../../assets/WFH.svg";
import { MdArrowForwardIos } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { BsBellFill } from "react-icons/bs";
import { IoMdMedkit, IoMdSettings } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose, IoPencil } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { BsCalendar4 } from "react-icons/bs";
import { CiDeliveryTruck, CiBoxList } from "react-icons/ci";
import { Line, Circle } from "rc-progress";
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
import { TiEdit } from "react-icons/ti";
import { ToastContainer, toast } from "react-toastify";
import { FaFileExport } from "react-icons/fa6";
import { useDateUtils } from "../../hooks/useDateUtils";

const Attendance_Mainbar = () => {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(true); // State to manage loading
  const [attendanceData, setAttendanceData] = useState({});
  // console.log("attendanceData",attendanceData)
  const [globalFilter, setGlobalFilter] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  const [attendanceCount, setAttendanceCount] = useState({});

  const [editIsOpen, setEditIsOpen] = useState(false);
  const [employeeAttendanceList, setEmployeeAttendanceList] = useState([]);

  const [selectedDate, setSelectedDate] = useState("");
  const [absentlistData, setAbsentlistData] = useState("");
  const [wfhlistData, setWfhlistData] = useState("");
  const [absentlistIsOpen, setAbsentlistIsOpen] = useState(false);
  const [wfhlistIsOpen, setWfhlistIsOpen] = useState(false);
  const [tooltipData, setTooltipData] = useState(null);

  const formatDateTime = useDateUtils();

  function onClickMonthlyDetails() {
    navigate("/monthlyattendancedetails");

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }
  function onClickMonthlytracker() {
    navigate("/attendance-tracker");

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }

  function onClickaddadtence() {
    navigate("/attendance-add");

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }

  function onClickCard(employeeId) {
    navigate(`/employeedetails/${employeeId}`);
  }

  const [employeeData, setEmployeeData] = useState({
    empName: "",
    empId: "",
  });

  const getEmployeeAttendance = async (
    attendanceId,
    empName,
    empId,
    entries,
    editTime
  ) => {
    // const response = await axios.get(
    //   `${API_URL}/api/attendance/attendancelist`,
    //   {
    //     params: {
    //       employeeId: attendanceId,
    //     },
    //   }
    // );

    // console.log("reson barthk", response?.data);
    setEmployeeAttendanceList([
      { entries: entries, _id: attendanceId, editTime },
    ]);
    setEmployeeData({
      empName: empName,
      empId: empId,
    });
    setEditIsOpen(true);
  };
  // console.log(employeeAttendanceList);
  const columns = [
    {
      field: "sno",
      header: "S.No",
      body: (_rowData, { rowIndex }) => rowIndex + 1, // display index starting from 1
      style: { width: "10px !important", textAlign: "center" }, // Narrow width
      bodyStyle: { textAlign: "center" },
    },
    // { field: "profile",
    //   header: "Profile",
    //   body: (rowData) => rowData.employeeId?.photo ? (<img src={`${API_URL}/api/uploads/${rowData.employeeId?.photo}`} className="w-14 h-14 mx-auto rounded-full"  />) : ( "-" )
    //  },

    {
      field: "employee_name",
      header: "Name",
      body: (rowData) =>
        rowData.employeeId ? (
          <>
            <div
              className="cursor-pointer"
              onClick={() => onClickCard(rowData.employeeId._id)}
            >
              {rowData.employeeId.employeeName}
              <br />
              <span className="text-blue-600 text-sm">
                {rowData.employeeId.roleId.name}
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
    // { field: "employeeId",
    //   header: "Employee ID",
    //   body: (rowData) => rowData.employeeId?.employeeId || "-"
    //  },

    // {
    //   field: "email",
    //   header: "Email",
    //   body: (rowData) => rowData.employeeId?.email || "-"
    // },
    // {
    //   field: "department", // Match the field to the data structure
    //   header: "Department",
    //    body: (rowData) => rowData.employeeId?.roleId.departmentId.name || "-"
    // },
    // {
    //   field: "role", // Match the field to the data structure
    //   header: "Role",
    //    body: (rowData) => rowData.employeeId?.roleId.name || "-"
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
        (
          <p
            className={`${rowData?.login.split(":")[0] > 10
              ? "text-red-500"
              : (rowData?.login.split(":")[0] == 10 &&
                rowData?.login.split(":")[1] >= 30) ||
                rowData?.login.split(" ")[1] == "pm"
                ? "text-red-500"
                : ""
              }`}
          >
            {rowData.login}
          </p>
        ) || "-",
    },
    { field: "logout", header: "Logout Time" },
    {
      field: "total_break_time",
      header: "Break",
      body: (rowData) =>
        rowData.result ? (
          <p
            className={`${rowData?.result?.breakTime?.hours >= 1 ? "text-red-500" : ""
              }`}
          >{`${rowData?.result?.breakTime?.hours}:${rowData?.result?.breakTime?.minutes}:${rowData?.result?.breakTime?.seconds} `}</p>
        ) : (
          "-"
        ),
    },

    // {
    //   field: "total_break_count",
    //   header: "Break Count",
    //   body: (rowData) =>
    //     rowData.result ? <p>{rowData.result.totalBreakInCount}</p> : "-",
    // },
    {
      field: "total_break_count",
      header: "Break Count",
      body: (rowData) => (
        <div
          className="cursor-pointer"
          onMouseEnter={(e) => {
            setTooltipData({
              data: rowData?.entries || [],
              x: e.pageX,
              y: e.pageY,
              date: rowData?.date,
              isHoveringTooltip: false,
            });
          }}
          onMouseLeave={() => {
            // Small delay before hiding, so user can move to tooltip
            setTimeout(() => {
              setTooltipData((prev) => {
                if (!prev?.isHoveringTooltip) return null;
                return prev;
              });
            }, 150);
          }}
        >
          {rowData?.result?.totalBreakInCount ?? 0}
        </div>
      ),
    },

    {
      field: "total_hours_worked",
      header: "Total Hours",
      body: (rowData) =>
        rowData.result ? (
          <p>{`${rowData.result.totalTime.hours}:${rowData.result.totalTime.minutes}:${rowData.result.totalTime.seconds}  `}</p>
        ) : (
          "-"
        ),
    },
    // {
    //   field: "payableTime",
    //   header: "Payable Time",
    //   body: (rowData) =>
    //     rowData.result ? (
    //       <p>{`${rowData.result.payableTime.hours}:${rowData.result.payableTime.minutes}:${rowData.result.payableTime.seconds}  `}</p>
    //     ) : (
    //       "-"
    //     ),
    // },
    // {
    //   field: "payableTime",
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
            className={`${rowData?.result?.payableTime?.hours >= 8
              ? "text-green-600"
              : "text-red-600"
              }`}
          >
            {`${String(rowData?.result?.payableTime?.hours).padStart(2, "0")}:${String(
              rowData?.result?.payableTime?.minutes
            ).padStart(2, "0")}:${String(rowData?.result?.payableTime?.seconds).padStart(
              2,
              "0"
            )}`}
          </p>
        ) : (
          "-"
        ),
    },

    {
      field: "action",
      header: "Action",
      body: (rowData) => (
        <div
          className="cursor-pointer "
          onClick={() =>
            getEmployeeAttendance(
              rowData._id,
              rowData.employeeId.employeeName,
              rowData.employeeId.employeeId,
              rowData.entries,
              rowData.editTime
            )
          }
        >
          <TiEdit className="mx-auto" />
        </div>
      ),
    },
  ];

  const AbsemtDatacolumns = [
    {
      field: "sno",
      header: "S.No",
      body: (_rowData, { rowIndex }) => rowIndex + 1, // display index starting from 1
      style: { width: "10px !important", textAlign: "center" }, // Narrow width
      bodyStyle: { textAlign: "center" },
    },
    {
      field: "employee_name",
      header: "Name",
      body: (rowData) =>
        rowData ? (
          <>
            <div
              className="cursor-pointer"
              onClick={() => onClickCard(rowData._id)}
            >
              {rowData.employeeName}
              <br />
              <span className="text-blue-600 text-sm">
                {rowData.roleId.name}
              </span>
            </div>
          </>
        ) : (
          "-"
        ),
    },
    { field: "employeeId", header: "ID" },
  ];

  // const wfhDatacolumns = [
  //   {
  //     field: "sno",
  //     header: "S.No",
  //     body: (_rowData, { rowIndex }) => rowIndex + 1, // display index starting from 1
  //     style: { width: "10px !important", textAlign: "center" }, // Narrow width
  //     bodyStyle: { textAlign: "center" },
  //   },
  //   {
  //     field: "employee_name",
  //     header: "Employee Name",
  //     body: (rowData) =>
  //       rowData ? (
  //         <>
  //           <div
  //             className="cursor-pointer"
  //             onClick={() => onClickCard(rowData._id)}
  //           >
  //             {rowData.employeeName}
  //             <br />
  //             <span className="text-blue-600 text-sm">
  //               {rowData.roleId.name}
  //             </span>
  //           </div>
  //         </>
  //       ) : (
  //         "-"
  //       ),
  //   },
  //   { field: "employeeId", header: "Employee ID" },
  // ];
  const [currentTime, setCurrentTime] = useState(new Date());
  // Update the currentTime every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const formatHours = (hours) =>
    hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  const formatNumber = (number) => (number < 10 ? `0${number}` : number);
  const day = days[currentTime.getDay()];
  const month = months[currentTime.getMonth()];
  const date = currentTime.getDate();
  const hours = formatHours(currentTime.getHours());
  const minutes = formatNumber(currentTime.getMinutes());
  const seconds = formatNumber(currentTime.getSeconds());
  const amPm = currentTime.getHours() >= 12 ? "PM" : "AM";

  const getAttendanceData = async (date) => {
    try {
      let response = await axios.get(
        `${API_URL}/api/employees/today-logs/${date} `,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAttendanceData(response?.data?.data);
      setAttendanceCount(response?.data?.count);
      setAbsentlistData(response?.data?.todayAttendanceDetails?.absent);
      setWfhlistData(response?.data?.todayAttendanceDetails?.wfh);

      // console.log(response);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const date = new Date().toISOString().split("T")[0];
    setSelectedDate(date);
    getAttendanceData(date);
  }, []);

  // this is the time update function
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const formattedDate = `${String(now.getDate()).padStart(
        2,
        "0"
      )} ${now.toLocaleString("en-US", {
        month: "short",
      })} ${now.getFullYear()}`;

      setCurrentDate(formattedDate);
    };

    updateTime(); // Initial call to set time immediately
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const onCLickCard = (cardName) => {
    navigate(cardName);

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  };

  const attendanceUpdate = async () => {
    try {
      const adminData = localStorage.getItem("hrmsuser");
      const email = JSON.parse(adminData).email;

      const payload = {
        updatedBy: email,
        attendanceId: employeeAttendanceList[0]._id,
        entries: employeeAttendanceList[0].entries,
      };
      const response = await axios.put(
        `${API_URL}/api/attendance/update-entry`,
        payload
      );

      toast.success("Attendance updated successfully!");
      setEditIsOpen(false);
      getAttendanceData(selectedDate);
    } catch (error) {
      console.log(error);
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
      ...attendanceData.map((row) => {
        const breakTime = row.result
          ? `${row.result.breakTime?.hours}:${row.result.breakTime?.minutes}:${row.result.breakTime?.seconds}`
          : "-";

        const totalHours = row.result
          ? `${row.result.totalTime?.hours}:${row.result.totalTime?.minutes}:${row.result.totalTime?.seconds}`
          : "-";

        const payableTime = row.result
          ? `${row.result.payableTime?.hours}:${row.result.payableTime?.minutes}:${row.result.payableTime?.seconds}`
          : "-";

        return [
          row.date?.split("T")[0] || "-",
          row.employeeId?.employeeName || "-",
          row.employeeId?.employeeId || "-",
          row.workType || "-",
          row.login || "-",
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

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col justify-between overflow-x-hidden bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-1 md:pt-5">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            
            
           
              <div className=" cursor-pointer ">
                <Mobile_Sidebar />
                
                
              </div>
              <div className="flex justify-end gap-1 items-center">
                <ToastContainer />
                <p
                  className="text-sm text-gray-500"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </p>
                <p>{">"}</p>

                <p className="text-sm text-blue-500">Attendance</p>
                </div>

              {/* <div className="font-medium text-md  lg:text-left mt-2 md:mt-5 w-full md:w-fit text-right bg-white px-3 py-1 md:px-4 md:py-2 rounded-full">
                
                <span>{day}, </span>
                <span>{date} </span>
                <span>{month} </span>
                <span className="inline-block  text-center">
                  {hours}:{minutes}:{seconds} {amPm}
                </span>
              </div> */}
            

            {/* Heading */}
            <section className="flex flex-wrap md:flex-row justify-between items-center mt-1 md:mt-4 ">
              <div className="flex flex-wrap md:flex-nowrap gap-1 md:gap-5">
                <p className="text-xl md:text-3xl font-semibold  ">
                  Attendance
                </p>
                <input
                  type="date"
                  value={selectedDate}
                  className="px-1 py-1 md:px-3 md:py-2 hidden md:block rounded-md shadow-sm cursor-pointer "
                  onChange={(e) => {
                    getAttendanceData(e.target.value);
                    setSelectedDate(e.target.value);
                    
                  }}
                />
              </div>
              {/* <div className="flex flex-wrap gap-4 mt-2">
                <button
                  onClick={onClickaddadtence}
                  className="px-2 py-1 md:px-4 md:py-2 w-fit md:w-fit cursor-pointer rounded-full text-white bg-blue-500 hover:bg-blue-600 sm:text-sm"
                >
                  Add Attendance
                </button>
                <button
                  onClick={onClickMonthlytracker}
                  className="px-2 py-1 md:px-4 md:py-2 w-fit md:w-fit cursor-pointer rounded-full text-white bg-blue-500 hover:bg-blue-600 sm:text-sm"
                >
                  Attendance Tracker
                </button>
                <button
                  onClick={onClickMonthlyDetails}
                  className="px-2 py-1 md:px-4 md:py-2 w-fit md:w-fit cursor-pointer rounded-full text-white bg-blue-500 hover:bg-blue-600 sm:text-sm"
                >
                  Monthly Details
                </button>
              </div> */}
              <div className="relative mt-2">
                {/* Desktop Buttons */}
                <div className="hidden md:flex gap-4">
                  <button
                    onClick={onClickaddadtence}
                    className="px-4 py-2 rounded-full text-white bg-blue-500 hover:bg-blue-600"
                  >
                    Add Attendance
                  </button>
                  <button
                    onClick={onClickMonthlytracker}
                    className="px-4 py-2 rounded-full text-white bg-blue-500 hover:bg-blue-600"
                  >
                    Attendance Tracker
                  </button>
                  <button
                    onClick={onClickMonthlyDetails}
                    className="px-4 py-2 rounded-full text-white bg-blue-500 hover:bg-blue-600"
                  >
                    Monthly Details
                  </button>
                </div>
              </div>

            </section>
            {/* Mobile Hamburger Menu */}
            <div className="md:hidden relative flex justify-between" ref={menuRef}>
              <input
                type="date"
                value={selectedDate}
                className="px-1 py-1 md:px-3 md:py-2  md:hidden rounded-md shadow-sm cursor-pointer "
                onChange={(e) => {
                  getAttendanceData(e.target.value);
                  setSelectedDate(e.target.value);
                }}
              />
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                {menuOpen ? <IoClose size={22} /> : <GiHamburgerMenu size={22} />}
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-3 flex flex-col gap-2 z-50">
                  <button
                    onClick={() => {
                      onClickaddadtence();
                      setMenuOpen(false);
                    }}
                    className="px-3 py-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 text-sm"
                  >
                    Add Attendance
                  </button>
                  <button
                    onClick={() => {
                      onClickMonthlytracker();
                      setMenuOpen(false);
                    }}
                    className="px-3 py-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 text-sm"
                  >
                    Attendance Tracker
                  </button>
                  <button
                    onClick={() => {
                      onClickMonthlyDetails();
                      setMenuOpen(false);
                    }}
                    className="px-3 py-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 text-sm"
                  >
                    Monthly Details
                  </button>
                </div>
              )}
            </div>

            {/* Cards */}
            <div className="flex flex-col sm:flex-row mt-5 flex-grow gap-3">
              <div
                className="hidden md:flex flex-grow gap-2 w-full sm:w-1/4  transition-all duration-100 flex-col justify-between bg-white px-5 py-5 rounded-xl"
              >
                <div className="flex items-center justify-between gap-3 text-4xl">
                  <img src={WFH} alt="" className="h-12 w-12" />
                  {attendanceCount?.present}
                </div>

                <p className="text-xl font-semibold text-gray-500 mt-3 md:mt-8 uppercase">
                  Present
                </p>

                <p className="hidden md:block text-gray-400 mt-2">
                  {selectedDate ? formatDateTime(selectedDate) : ""}
                </p>

                <p className="text-2xl font-semibold text-blue-500 mt-2">
                  {attendanceData?.summary?.present}
                </p>
              </div>


              <div
                onClick={() => setAbsentlistIsOpen(true)}
                className="flex flex-grow gap-2 w-full transition-all duration-100 cursor-pointer sm:w-1/4 md:flex-col justify-between bg-white px-5 py-5 rounded-xl"
              >
                <div className="flex items-center justify-between gap-3 text-4xl">
                  <img src={not_present} alt="" className="h-12 w-12" />
                  {/* <MdArrowForwardIos /> */}
                  {attendanceCount?.absent}
                </div>
                <p className="text-xl font-semibold  mt-3 md:mt-8 text-gray-500 uppercase">
                  Absent
                </p>
                <p className="hidden md:block text-gray-400 mt-2">
                  {selectedDate ? formatDateTime(selectedDate) : ""}

                </p>{" "}
                <p className="text-2xl font-semibold text-blue-500 mt-2">
                  {attendanceData?.summary?.absent}
                </p>
              </div>

              <div
                onClick={() => setWfhlistIsOpen(true)}
                className="flex flex-grow w-full gap-2 cursor-pointer sm:w-1/4 md:flex-col justify-between bg-white px-5 py-5 transition-all duration-100 rounded-xl"
              >
                <div className="flex items-center gap-3 justify-between text-4xl">
                  <img src={WFH} alt="" className="h-12 w-12" />
                  {/* <MdArrowForwardIos /> */}
                  {attendanceCount?.wfh}
                </div>
                <p className="text-xl font-semibold  mt-3 md:mt-8 text-gray-500 uppercase">
                  WFH
                </p>
                <p className="hidden md:block text-gray-400 mt-2">
                  {selectedDate ? formatDateTime(selectedDate) : ""}
                </p>{" "}
                <p className="text-2xl font-semibold text-blue-500 mt-2">
                  {attendanceData?.summary?.wfh}
                </p>
              </div>
            </div>

            {/* data table */}
            <div
              style={{ width: "auto", margin: "0 auto", overflowX: "hidden" }}
            >
              {/* Global Search Input */}

              <div className="flex flex-wrap gap-1 md:gap-4 items-center mt-2 md:mt-6 justify-between ">
                <InputText
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Search"
                  className="w-[50%] px-2 py-2 rounded-md"
                />
                <button
                  onClick={exportToCSV}
                  className=" flex flex-wrap bg-blue-500 hover:bg-blue-600 text-white font-semibold px-2 py-2 md:py-2 md:px-4 rounded-md items-center gap-2"
                >
                  Export CSV
                  <FaFileExport />
                </button>
              </div>

              {/* Table Container with Relative Position */}
              <div className="relative mt-4">
                {/* Loader Overlay */}

                <DataTable
                  className="mt-8"
                  value={attendanceData}
                  paginator
                  rows={10}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  filters={{
                    global: { value: globalFilter, matchMode: "contains" },
                  }}
                  globalFilterFields={[
                    "employeeId.employeeName",
                    "employeeId.roleId.name",
                    "workType",
                  ]}
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
                      style={col.style}
                      bodyStyle={col.bodyStyle}
                    />
                  ))}
                </DataTable>
              </div>
            </div>

            {editIsOpen && (
              <div className="">
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 "
                  onClick={() => setEditIsOpen(false)}
                >
                  <div
                    className="bg-white p-6 rounded-lg shadow-lg w-[430px] h-[400px] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2 className="text-xl font-semibold mb-2">
                      Edit Attendance{" "}
                    </h2>

                    <h2 className=" capitalize mb-2">
                      {employeeData.empName} - {employeeData.empId}
                    </h2>

                    {employeeAttendanceList[0]?.editTime.length > 0 && (
                      <div className="flex w-full mb-3">
                        <label
                          htmlFor=""
                          className="text-sm font-semibold w-full mt-1"
                        >
                          Last updated by:{" "}
                        </label>{" "}
                        <div className="">
                          <span className="text-sm font-medium">
                            {
                              employeeAttendanceList[0]?.editTime?.[
                                employeeAttendanceList[0]?.editTime.length - 1
                              ]?.updatedBy
                            }
                          </span>
                          <span className=" text-sm font-medium inline-block">
                            {employeeAttendanceList[0]?.editTime?.length > 0 &&
                              new Date(
                                employeeAttendanceList[0]?.editTime[
                                  employeeAttendanceList[0]?.editTime.length - 1
                                ]?.updatedTime
                              ).toLocaleString("en-IN", {
                                timeZone: "Asia/Kolkata",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                          </span>
                        </div>
                      </div>
                    )}
                    {employeeAttendanceList[0]?.entries.map((entry, index) => (
                      <div
                        className="mb-4 flex justify-between gap-4"
                        key={index}
                      >
                        <select
                          value={entry?.reason || ""}
                          className="w-full border-2 rounded-xl px-4 h-10 outline-none cursor-pointer"
                          onChange={(e) => {
                            // Clone the full array
                            const updatedList = [...employeeAttendanceList];
                            // Update the nested value
                            updatedList[0].entries[index].reason =
                              e.target.value;
                            // {"entryId:updatedList[0].entries[index]._id,"newReason": "Break Out"}
                            // Update state
                            setEmployeeAttendanceList(updatedList);
                            // attendanceUpdate(
                            //   updatedList[0].entries[index],
                            //   updatedList[0]._id
                            // );
                          }}
                        >
                          <option value="Login">Login</option>
                          <option value="Logout">Logout</option>
                          <option value="Break In">Break In</option>
                          <option value="Break Out">Break Out</option>
                        </select>

                        <label className="block text-lg font-medium mb-2">
                          <input
                            type="time"
                            value={new Date(entry.time)
                              .toLocaleTimeString("en-GB", { hour12: false })
                              .slice(0, 5)}
                            onChange={(e) => {
                              const timeValue = e.target.value;
                              if (!timeValue) return;

                              const originalDate = new Date(entry.time);
                              if (isNaN(originalDate.getTime())) return;

                              // Split the time input into hours and minutes
                              const [hours, minutes] = timeValue
                                .split(":")
                                .map(Number);

                              const newDate = new Date(originalDate);
                              newDate.setHours(hours, minutes, 0, 0);

                              if (isNaN(newDate.getTime())) return;

                              const updatedList = [...employeeAttendanceList];
                              updatedList[0].entries[index].time =
                                newDate.toISOString();

                              setEmployeeAttendanceList(updatedList);
                            }}
                          />
                        </label>
                      </div>
                    ))}

                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      onClick={attendanceUpdate}
                    >
                      Update Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {absentlistIsOpen && (
              <div className="">
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 "
                  onClick={() => setAbsentlistIsOpen(false)}
                >
                  <div
                    className="bg-white p-6 rounded-lg shadow-lg w-[600px] h-[600px] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2 className="text-xl font-semibold mb-2">
                      Absent List{" "}
                      <span className="text-gray-500 text-[16px]">
                        ({formatDateTime(selectedDate)})
                      </span>
                    </h2>

                    <DataTable
                      className="mt-8"
                      value={absentlistData}
                      paginator
                      rows={5}
                      rowsPerPageOptions={[5, 10, 20]}
                      showGridlines
                      resizableColumns
                    >
                      {AbsemtDatacolumns.map((col, index) => (
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
                          style={col.style}
                          bodyStyle={col.bodyStyle}
                        />
                      ))}
                    </DataTable>
                  </div>
                </div>
              </div>
            )}

            {wfhlistIsOpen && (
              <div className="">
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 "
                  onClick={() => setWfhlistIsOpen(false)}
                >
                  <div
                    className="bg-white p-6 rounded-lg shadow-lg w-[600px] h-[600px] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2 className="text-xl font-semibold mb-2">
                      WFH List{" "}
                      <span className="text-gray-500 text-[16px]">
                        ({formatDateTime(selectedDate)})
                      </span>
                    </h2>

                    <DataTable
                      className="mt-8"
                      value={wfhlistData}
                      paginator
                      rows={5}
                      rowsPerPageOptions={[5, 10, 20]}
                      showGridlines
                      resizableColumns
                    >
                      {AbsemtDatacolumns.map((col, index) => (
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
                          style={col.style}
                          bodyStyle={col.bodyStyle}
                        />
                      ))}
                    </DataTable>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* {tooltipData && (
            <div
              className="absolute bg-[#fafafa] border border-gray-300 shadow-lg px-5 py-5 rounded text-xs z-50"
              style={{
                top: tooltipData.y + 10,
                left: tooltipData.x + 10,
              }}
            >
              <div>
                <p className="text-[16px] mb-4">
                  {tooltipData?.date
                    ? `(${new Date(tooltipData.date).toLocaleDateString(
                        "en-GB"
                      )})`
                    : ""}
                </p>

                {tooltipData?.data.map(
                  (entries, index) =>
                    entries.reason !== "Login" &&
                    entries.reason !== "Logout" && (
                      <div className=" ">
                        <div className="mt-2 flex items-center text-[16px] justify-between gap-4">
                          <h2 className="text-[16px] ">{entries.reason}</h2>
                          <p className="text-gray-700">
                            {new Date(entries.time)
                              .toLocaleTimeString("en-GB", { hour12: false })
                              .slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>
          )} */}

          {tooltipData && (
            <div
              className="absolute bg-[#FAFAFA] border border-gray-300 shadow-lg px-5 py-5 rounded text-xs z-50"
              style={{
                top:
                  tooltipData.y + 10 + 200 > window.innerHeight
                    ? tooltipData.y - 100
                    : tooltipData.y + 10,
                left:
                  tooltipData.x + 10 + 250 > window.innerWidth
                    ? tooltipData.x - 250
                    : tooltipData.x + 10,
                maxWidth: "250px",
                maxHeight: "200px",
                overflowY: "auto",
              }}
              onMouseEnter={() =>
                setTooltipData((prev) => ({ ...prev, isHoveringTooltip: true }))
              }
              onMouseLeave={() => {
                setTooltipData(null);
              }}
            >
              <div>
                <p className="text-[16px] mb-4">
                  {tooltipData?.date
                    ? `(${new Date(tooltipData.date).toLocaleDateString("en-GB")})`
                    : ""}
                </p>
                {tooltipData?.data.map(
                  (entry, index) =>
                    entry.reason !== "Login" &&
                    entry.reason !== "Logout" && (
                      <div key={index}>
                        <div className="mt-2 flex items-center text-[16px] justify-between gap-4">
                          <h2 className="text-[16px]">{entry.reason}</h2>
                          <p className="text-gray-700">
                            {new Date(entry.time)
                              .toLocaleTimeString("en-GB", { hour12: false })
                              .slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>
          )}

          <Footer />
        </>
      )}
    </div>
  );
};

export default Attendance_Mainbar;
