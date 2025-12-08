import progress from "../../assets/progress.png";
import chart from "../../assets/chart.png";
import calendar from "../../assets/calendar.png";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { BsCalendar4 } from "react-icons/bs";
import { CiDeliveryTruck, CiBoxList } from "react-icons/ci";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar_style.css";
import { Line, Circle } from "rc-progress";
import Footer from "../Footer";
import medics_logo from "../../assets/medics_logo.svg";
import { MdLogout } from "react-icons/md";
import Mobile_Sidebar from "../Mobile_Sidebar";
import axios from "axios";
import { format } from "date-fns";
import { DataTable } from "primereact/datatable";
import { API_URL } from "../../config";
import { Column } from "primereact/column";
import Loader from "../Loader";
import { useDateUtils } from "../../hooks/useDateUtils";
import Clock from "./Clock";




const Dashboard_Mainbar = () => {
  const navigate=useNavigate();
  const formatDateTime = useDateUtils();
  const [value, onChange] = useState(new Date());
  const [currentTime1, setCurrentTime1] = useState(new Date());
  const [upcomingHolidays, setUpcomingHolidays] = useState("");
  const [employeeRequests, setEmployeeRequests] = useState("");
  const [attendanceCount, setAttendanceCount] = useState("");
  const [absentlistIsOpen, setAbsentlistIsOpen] = useState(false);
  const [wfhlistIsOpen, setWfhlistIsOpen] = useState(false);
  const [presentlistIsOpen, setpresentlistIsOpen] = useState(false);
  const [absentlistData, setAbsentlistData] = useState("");


  const [wfhlistData, setWfhlistData] = useState("");
  const [presentlistData, setpresentlistData] = useState("");

  // console.log("presentlistData", presentlistData);
  const [selectedDate, setSelectedDate] = useState("");
  console.log("upcomingHolidays:", attendanceCount);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [emplopyeereliving, setEmplopyeereliving] = useState([]);
  const [interns, setinterns] = useState([]);

  const [announcements, setAnnouncements] = useState([]);

  console.log("announcements", announcements)
  // console.log("interns", interns);

 



  // const day = days[currentTime1.getDay()];
  // const month = months[currentTime1.getMonth()];
  // const date = currentTime1.getDate();
  // const hours = formatHours(currentTime1.getHours());
  // const minutes = formatNumber(currentTime1.getMinutes());
  // const seconds = formatNumber(currentTime1.getSeconds());
  // const amPm = currentTime1.getHours() >= 12 ? "PM" : "AM";
  //  const datetimeValues = useMemo(() => {
  //   return {
  //     day: DAYS[currentTime1.getDay()],
  //     month: MONTHS[currentTime1.getMonth()],
  //     date: currentTime1.getDate(),
  //     hours: formatHours(currentTime1.getHours()),
  //     minutes: formatNumber(currentTime1.getMinutes()),
  //     seconds: formatNumber(currentTime1.getSeconds()),
  //     amPm: currentTime1.getHours() >= 12 ? "PM" : "AM",
  //   };
  // }, [currentTime1]);

  // const getApiData = async () => {
  //   try {
  //     console.log("API_URL:", API_URL);
  //     console.log("Fetching data...");
  //     const token = localStorage.getItem("admin_token");
  //     // console.log("token",token);

  //     const response = await axios.get(`${API_URL}/api/employees/dashboard`);
  //     console.log("Response:", response.data.data);
  //     const {
  //       upcomingHolidays,
  //       employeeRequests,
  //       count,
  //       todayAttendanceDetails,
  //       todayBirthday,
  //       futureEmployees,
  //       interns,
  //     } = response.data?.data;
  //     setUpcomingHolidays(upcomingHolidays);
  //     setEmployeeRequests(employeeRequests);
  //     setAttendanceCount(count);
  //     setAbsentlistData(todayAttendanceDetails?.absent);
  //     setWfhlistData(todayAttendanceDetails?.wfh);
  //     setpresentlistData(todayAttendanceDetails?.present);
  //     setUpcomingBirthdays(todayBirthday);
  //     setEmplopyeereliving(futureEmployees);
  //     setinterns(interns);

  //     // const employeereleving =
  //     futureEmployees.map((emp) => emp);
  //     // setEmplopyeereliving(employeereleving);
  //   } catch (error) {
  //     console.error("API call failed:", error);
  //     if (error.response) {
  //       console.error("Server responded:", error.response.data);
  //     } else if (error.request) {
  //       console.error("No response received:", error.request);
  //     } else {
  //       console.error("Request error:", error.message);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };
   const getApiData = useCallback(async () => {
    try {

//       const response = await axios.get(`${API_URL}/api/employees/dashboard`,{
       
//       });

      // console.log("API_URL:", API_URL);
      // console.log("Fetching data...");
      const token = localStorage.getItem("admin_token");
      // console.log("token",token);

      const response = await axios.get(`${API_URL}/api/employees/dashboard`, {
        params: {
          role: "Admin",
        }
      });
      console.log("Response:", response.data.data);

      const {
        upcomingHolidays,
        employeeRequests,
        count,
        todayAttendanceDetails,
        todayBirthday,
        futureEmployees,
        interns,

        announcements,
      } = response.data?.data;

      setUpcomingHolidays(upcomingHolidays);
      setEmployeeRequests(employeeRequests);
      setAttendanceCount(count);
      setAbsentlistData(todayAttendanceDetails?.absent || []);
      setWfhlistData(todayAttendanceDetails?.wfh || []);
      setpresentlistData(todayAttendanceDetails?.present || []);
      setUpcomingBirthdays(todayBirthday);
      setEmplopyeereliving(futureEmployees);
      setinterns(interns);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getApiData();
    const date = new Date().toISOString().split("T")[0];
    setSelectedDate(date);
  }, [getApiData]);
  const buttonRef = useRef(null);
  const handleConfetti = () => {
    party.confetti(buttonRef.current, {
      count: party.variation.range(20, 100),
    });
  };
  const AbsemtDatacolumns = [
    {
      field: "sno",
      header: "S.No",
      body: (_rowData, { rowIndex }) => rowIndex + 1,
      style: { width: "10px !important", textAlign: "center" },
      bodyStyle: { textAlign: "center" },
    },
    {
      field: "employee_name",
      header: "Employee Name",
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
    {
      field: "login_time",
      header: "Login Time",
      body: (rowData) => {
        if (!rowData?.login) return "-";

        const iso = rowData.login; // "2025-12-08T10:43:41.655Z"
        const time = iso.substring(11, 16); // "10:43"

        let [hours, minutes] = time.split(":").map(Number);

        // Convert to AM/PM
        const ampm = hours >= 12 ? "PM" : "AM";
        const displayHours = hours % 12 || 12; // convert 0 → 12, 13 → 1 etc.
        const formattedTime = `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;

        let colorClass = "";

        // Orange for 10:05 to 10:29
        if (hours === 10 && minutes >= 5 && minutes < 30) {
          colorClass = "text-yellow-500 font-bold";
        }
        // Red for 10:30 onwards
        else if (hours > 10 || (hours === 10 && minutes >= 30)) {
          colorClass = "text-red-500";
        }

        return <p className={colorClass}>{formattedTime}</p>;
      },
    },






    // { field: "employeeId", header: "Employee ID" },
  ];

  const [show, setShow] = useState(true);


  return (
    <div className=" w-screen min-h-screen flex flex-col justify-between bg-gray-100 md:px-5 px-3 py-2 md:pt-5 ">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <div className=" ">
              <Mobile_Sidebar />

            </div>

            <p className="text-sm md:text-md mt-3  text-end text-blue-500">Dashboard</p>



            <div className="bg-white rounded-2xl px-2 py-2 md:px-5 md:py-5 flex justify-between mt-1 ">
              <p className="font-semibold">Dashboard</p>

              <div className="font-medium text-sm lg:text-base text-center lg:text-left">
                {/* <span>{day}, </span>
                <span>{date} </span>
                <span>{month} </span>
                <span className="inline-block  text-center">
                  {hours}:{minutes}:{seconds} {amPm}
                </span> */}
                 {/* <p>{datetimeValues.day} {datetimeValues.month} {datetimeValues.date}</p>
      <p>{datetimeValues.hours}:{datetimeValues.minutes}:{datetimeValues.seconds} {datetimeValues.amPm}</p> */}
      <Clock/>
      {/* <Clock/> */}
              </div>
            </div>
            {/* 
            <div
              className={`
        transition-all duration-500 
        ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"} 
        fixed top-4 left-1/2 transform -translate-x-1/2 
        w-[90%] md:w-[600px] z-50
      `}
            >
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-5 py-4 rounded-xl shadow-xl border border-white/20 backdrop-blur-md flex justify-between items-center">

                <p className="font-medium flex items-center gap-2">
                  <span className="text-2xl animate-pulse">📢</span>
                  <div
    className="font-medium flex items-center gap-2"
    dangerouslySetInnerHTML={{ __html: announcements?.message }}
  />
                </p>

                <button
                  onClick={() => setShow(false)}
                  className="text-white text-xl font-bold hover:scale-125 transition"
                >
                  ×
                </button>

              </div>
            </div> */}


            {/* {announcements.length > 0 &&
  announcements.map((item, index) => (
    console.log("announcementsxsxzczc",announcements),
  <div
        key={index}

    className={`
      transition-all duration-500 
      ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"} 
      fixed top-4 left-1/2 transform -translate-x-1/2 
      w-[90%] md:w-[600px] z-50
    `}
  >
    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-5 py-4 rounded-xl shadow-xl border border-white/20 backdrop-blur-md flex justify-between items-center">

      <div className="font-medium flex items-center gap-2">
        <span className="text-2xl animate-pulse">📢</span>

        <div
          className="font-medium"
          dangerouslySetInnerHTML={{ __html: item.message }}
        />
      </div>

      <button
        onClick={() => setShow(false)}
        className="text-white text-xl font-bold hover:scale-125 transition"
      >
        ×
      </button>

    </div>
  </div>
))}
   */}

{announcements.length > 0 && (
  <div
    className={`
      transition-all duration-500 
      ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"} 
      fixed top-4 left-1/2 transform -translate-x-1/2 
      w-[90%] md:w-[600px] z-50
    `}
  >
    <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-5 py-5 rounded-xl shadow-xl border border-white/20 backdrop-blur-md">

      {/* Close Button on TOP RIGHT */}
      <button
        onClick={() => setShow(false)}
        className="absolute top-2 right-3 text-white text-2xl font-bold hover:scale-125 transition"
      >
        ×
      </button>

      {/* Icon + Messages */}
      <div className="flex items-start gap-3 mt-3">
        <span className="text-3xl animate-pulse">📢</span>

        {/* BULLET POINTS - MAP */}
        <ul className="list-disc pl-6 space-y-1">
          {announcements.map((item, i) => {
            const cleanMessage = item.message.replace(/<\/?p>/g, "").trim();
            return <li key={i}>{cleanMessage}</li>;
          })}
        </ul>
      </div>

    </div>
  </div>
)}







            <div>

            </div>

            {/* upcoming holiday */}
            <div className="flex pt-1 md:pt-3 flex-wrap md:flex-nowrap gap-2 md:gap-4 md:mb-5 items-center justify-between">
              {/* employee requests */}
              <div className="w-full md:w-[32%] ">
                <div className="flex flex-col w-full mt-1 md:mt-5 h-auto md:h-[210px] rounded-2xl bg-[url('././assets/zigzaglines_large.svg')] bg-cover shadow-lg px-3 py-3 md:px-6 md:py-6">
                  <div className="flex justify-between items-center mb-1 md:mb-4">
                    <div>
                      <h2 className="text-md font-normal md:font-bold text-gray-800">
                        Request
                      </h2>
                      {/* <p className="text-xs text-gray-500">Recent requests</p> */}
                    </div>
                    <button
                      onClick={() => navigate("/requestdetails")}
                      className="text-sm text-blue-600 font-medium hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  {/* Employee List */}
                  <div className="max-h-52 overflow-y-auto pr-1.5 space-y-3 custom-scrollbar">
                    {employeeRequests && employeeRequests.length > 0 ? (
                      employeeRequests
                        .slice(-5) // ✅ Get the last 5 requests
                        .reverse() // Optional: to show latest first
                        .map((req) => {
                          const formattedDate = new Date(req.date)
                            .toISOString()
                            .slice(0, 10);
                          return (
                            <div
                              key={req._id}
                              className="flex justify-between items-start border-b border-gray-200 pb-2 last:border-0 hover:bg-gray-50 rounded-lg transition"
                            >
                              <div className="text-sm">
                                <p className="font-medium text-gray-800">
                                  {req.employeeId.employeeName}
                                </p>
                                {/* <p className="text-gray-600">{req.subject}</p> */}
                                <p className="text-xs text-gray-400">
                                  {formatDateTime(formattedDate)}
                                </p>
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-semibold
                ${req.status === "approved"
                                    ? "bg-green-100 text-green-700"
                                    : req.status === "pending"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                              >
                                {req.status.charAt(0).toUpperCase() +
                                  req.status.slice(1)}
                              </span>
                            </div>
                          );
                        })
                    ) : (
                      <p className="text-gray-500 text-sm text-center">
                        No recent employee requests
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* attendance */}
              <div className="w-full md:w-[32%]">
                <div className="flex flex-col w-full mt-1 md:mt-5 h-auto md:h-[210px] rounded-2xl bg-[url('././assets/zigzaglines_large.svg')] bg-cover shadow-lg px-3 py-3 md:px-6 md:py-6">
                  <div className="flex justify-between items-center mb-1 md:mb-2">
                    <div>
                      <h2 className="text-md font-normal md:font-bold text-gray-800">
                        Attendance
                      </h2>
                      {/* <p className="text-xs text-gray-500">Today Attendance</p> */}
                    </div>
                    <button
                      onClick={() => navigate("/attendance")}
                      className="text-sm text-blue-600 font-medium hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  {/* Employee List */}

                  <div className="max-h-52 overflow-y-auto pr-1.5 custom-scrollbar">
                    <div className="flex items-center space-x-14 mt-1">
                      {/* Present Box */}
                      <div
                        onClick={() => setpresentlistIsOpen(true)}
                        className="flex flex-grow w-full cursor-pointer sm:w-1/4 flex-col bg-white px-5 py-5  transition-all duration-100 rounded-xl"
                      >
                        <div className="text-gray-500 text-sm w-[50%]">
                          <p className="text-sm font-medium w-[50%] ">
                            Present
                          </p>
                          <div className="text-2xl font-bold text-green-600">
                            {attendanceCount.present}
                          </div>
                        </div>
                      </div>

                      {/* Absent Box */}
                      <div
                        onClick={() => setAbsentlistIsOpen(true)}
                        className="flex flex-grow w-full  transition-all duration-100 cursor-pointer sm:w-1/4 flex-col bg-white px-5 py-5 rounded-xl"
                      >
                        <div className="text-gray-500 text-sm w-[50%]">
                          <p className="text-sm font-medium  w-[50%]">Absent</p>
                          <div className="text-2xl font-bold text-red-600">
                            {attendanceCount.absent}
                          </div>
                        </div>
                      </div>

                      {/* WFH Box */}
                      <div
                        onClick={() => setWfhlistIsOpen(true)}
                        className="flex flex-grow w-full cursor-pointer sm:w-1/4 flex-col bg-white px-5 py-5  transition-all duration-100 rounded-xl"
                      >
                        <div className="text-gray-500 text-sm w-[50%]">
                          <p className="text-sm font-medium  w-[50%]">WFH</p>
                          <div className="text-2xl font-bold text-yellow-600">
                            {attendanceCount.wfh}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Upcoming Birthdays */}
              <div className="w-full md:w-[32%] ">
                {" "}
                {upcomingBirthdays.length > 0 ? (
                  <div
                    ref={buttonRef}
                    onMouseEnter={handleConfetti}
                    className="bg-[#e4e0f3] text-[#5c3e98] mt-1 md:mt-5 h-auto md:h-[190px] rounded-2xl px-3 py-3 md:px-5 md:py-4 cursor-pointer group"
                  >
                    <p className="flex justify-center gap-1 font-semibold px-1 text-1xl font-serif">
                      Birthday's Today{" "}
                      <div className="group-hover:animate-bounce duration-300">
                        🎉
                      </div>
                    </p>

                    <div className="flex flex-wrap ml-5 md:ml-2 h-[80%] w-[40%]">
                      {upcomingBirthdays.map((item, index) => (
                        <div
                          key={index}
                          className="flex text-center bg-white  shadow-md"
                        >
                          <img
                            src={`${API_URL}/api/uploads/${item.photo}`}
                            alt="Profile"
                            className="h-30 w-[260px] object-cover"
                          />

                          <div className="flex flex-col bg-white justify-center gap-1 px-6 py-2 ">
                            <p className=" text-[14px] capitalize">
                              {item.employeeName}
                            </p>
                            <p className="text-[12px]  text-gray-500 capitalize">
                              {item.role?.name}
                            </p>

                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>

            <section className="flex flex-wrap gap-2 md:gap-5">
              {" "}
              <div className="w-full md:w-[32%]">
                <div
                  className="relative flex flex-col w-full mt-1 md:mt-5 h-auto md:h-[260px] rounded-2xl
               bg-[url('././assets/zigzaglines_large.svg')] bg-cover shadow-lg px-3 py-3 md:px-6 md:py-6"
                >
                  {/* Heading */}
                  <div className="flex items-center justify-between mb-1 md:mb-4">
                    <h3 className="text-md font-normal md:font-bold text-gray-800">
                      Upcoming Relieving
                    </h3>
                    <span className="text-sm text-gray-500">
                      {emplopyeereliving?.length} Total
                    </span>
                  </div>

                  {/* Content */}
                  {emplopyeereliving?.length === 0 ? (
                    <div className="flex items-center justify-center flex-1">
                      <p className="text-gray-500 italic">No employees found</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 overflow-y-auto max-h-[180px] pr-1 custom-scrollbar">
                      {/* {emplopyeereliving?.map((emp) => {
                    const formattedDate = new Date(
                      emp.last_working_date
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }); */}

                      {emplopyeereliving
                        ?.slice() // make a copy so original array is not mutated
                        .sort(
                          (a, b) =>
                            new Date(a.last_working_date) -
                            new Date(b.last_working_date)
                        ) // ascending order
                        .map((emp) => {
                          const formattedDate = new Date(
                            emp.last_working_date
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          });

                          return (
                            <div
                              key={emp._id}
                              className="group bg-white/70 hover:bg-indigo-50 transition
                         rounded-xl shadow-sm border border-gray-200
                         p-3 flex flex-col"
                            >
                              <div className="flex items-center justify-between">
                                <p className="text-base font-semibold text-gray-800">
                                  {emp.employeeName}
                                </p>
                                {emp.roleId?.name && (
                                  <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                                    {emp.roleId.name}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                Last Working Day:
                                <span className="ml-1 font-medium text-gray-900">
                                  {formattedDate}
                                </span>
                              </p>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
              {/*Intern Duration */}
              <div className="w-full md:w-[32%]">
                <div
                  className="relative flex flex-col w-full mt-1 md:mt-5 h-auto md:h-[260px] rounded-2xl
               bg-[url('././assets/zigzaglines_large.svg')] bg-cover shadow-lg px-3 py-3 md:px-6 md:py-6"
                >
                  {/* Heading */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-md font-normal md:font-bold text-gray-800">
                      Intern List
                    </h3>
                    <span className="text-sm text-gray-500">
                      {interns?.length} Total
                    </span>
                  </div>

                  {/* Content */}
                  {interns?.length === 0 ? (
                    <div className="flex items-center justify-center flex-1">
                      <p className="text-gray-500 italic">No employees found</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 overflow-y-auto max-h-[180px] pr-1 custom-scrollbar">
                      {/* {emplopyeereliving?.map((emp) => {
                    const formattedDate = new Date(
                      emp.last_working_date
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }); */}

                      {interns
                        ?.slice() // make a copy so original array is not mutated
                        // .sort(
                        //   (a, b) =>
                        //     new Date(a.last_working_date) -
                        //     new Date(b.last_working_date)
                        // ) // ascending order
                        .map((emp) => {
                          const formattedDate = new Date(
                            emp.internshipEndDate
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          });
                          const formattedDates = new Date(
                            emp.dateOfJoining
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          });

                          return (
                            <div
                              key={emp._id}
                              className="group bg-white/70 hover:bg-indigo-50 transition
                         rounded-xl shadow-sm border border-gray-200
                         p-3 flex flex-col"
                            >
                              <div className="flex items-center justify-between">
                                <p className="text-base font-semibold text-gray-800">
                                  {emp.employeeName}
                                </p>
                                {emp.roleId?.name && (
                                  <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                                    {emp.roleId.name}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                Date Of Joining:
                                <span className="ml-1 font-medium text-gray-900">
                                  {formattedDates}
                                </span>
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                Intern Duration Period:
                                <span className="ml-1 font-medium text-gray-900">
                                  {formattedDate}
                                </span>
                              </p>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
              {/*uPCOMING holiday */}
              <div className="flex mt-5 gap-4 w-full md:w-[32%]">
                {upcomingHolidays?.length > 0 && (
                  <div className="bg-white rounded-2xl w-full px-5 py-5 shadow-md border border-gray-100">

                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      📅 Upcoming Holidays
                    </h2>

                    <div className="flex flex-col gap-6 mt-4">
                      {upcomingHolidays.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 w-full">

                          {/* DATE */}
                          <div className="flex flex-col items-center">
                            <p className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              {formatDateTime(item.date, "MMM")}
                            </p>

                          </div>

                          <div className="flex-grow border-b border-dashed border-gray-400"></div>

                          {/* REASON */}
                          <div className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium text-center">
                            {item.reason}
                          </div>

                        </div>
                      ))}
                    </div>

                  </div>
                )}
              </div>



            </section>
          </div>

          {absentlistIsOpen && (
            <div className="">
              <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 "
                onClick={() => setAbsentlistIsOpen(false)}
              >
                <div
                  className="bg-white p-6 rounded-lg shadow-lg w-[600px] h-[600px] overflow-y-auto relative"
                  onClick={(e) => e.stopPropagation()}
                >

                  <button
                    onClick={() => setAbsentlistIsOpen(false)}
                    className="absolute right-4 top-4 text-gray-600 hover:text-black"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  {/* <h2 className="text-md font-normal mb-2">
                    Absent List{" "}
                    <span className="text-gray-500 text-[16px]">
                      ({selectedDate})
                    </span>
                  </h2> */}

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
                  className="bg-white p-6 rounded-lg shadow-lg w-[600px] h-[600px] overflow-y-auto relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setWfhlistIsOpen(false)}
                    className="absolute right-4 top-4 text-gray-600 hover:text-black"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  {/* <h2 className="text-md font-normal mb-2">
                    WFH List{" "}
                    <span className="text-gray-500 text-[16px]">
                      ({selectedDate})
                    </span>
                  </h2> */}

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
          {presentlistIsOpen && (
            <div className="">
              <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 "
                onClick={() => setpresentlistIsOpen(false)}
              >
                <div
                  className="bg-white p-6 rounded-lg shadow-lg w-[600px] h-[600px] overflow-y-auto relative"
                  onClick={(e) => e.stopPropagation()}
                >

                  <button
                    onClick={() => setpresentlistIsOpen(false)}
                    className="absolute right-4 top-4 text-gray-600 hover:text-black"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  {/* <h2 className="text-md font-normal mb-2">
                    Present List{" "}
                    <span className="text-gray-500 text-[16px]">
                      ({selectedDate})
                    </span>
                  </h2> */}

                  <DataTable
                    className="mt-8"
                    value={presentlistData}
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
        </>
      )}
      <Footer />
    </div>
  );
};

export default Dashboard_Mainbar;
