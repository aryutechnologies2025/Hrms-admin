import React from "react";
import ReactDOM from "react-dom";
import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
DataTable.use(DT);
import { useEffect, useState } from "react";
import { BiSolidMessageAltAdd } from "react-icons/bi";
import sample from "../../assets/sample.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import zigzaglines_small from "../../assets/zigzaglines_small.svg";
import axios from "../../api/axiosConfig";
import { API_URL } from "../../config";
import { capitalizeFirstLetter } from "../../utils/StringCaps";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import Loader from "../Loader";
import { FaEye } from "react-icons/fa";
import { TfiPencilAlt } from "react-icons/tfi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useDateUtils } from "../../hooks/useDateUtils";

const Employees_Card = () => {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const formatDateTime = useDateUtils();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

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
  const [employees, setEmployees] = useState([]);
  console.log("employee checking", employees);
  const [allEmployees, setAllEmployees] = useState([]);
  const [filterInput, setFilterInput] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");


  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/employees/all-active-employees`,
        {
          limit: 20,
        }
      );

      console.log("response", response);

      const Employees = response.data.data;

      if (response.data.success) {
        const transformedData = Employees.map((employee) => ({
          id: employee._id,
          employeeId: employee.employeeId,

          employee_Image: employee.photo
            ? `${API_URL}/api/uploads/${employee.photo}`
            : sample,
          employee_Name: employee.employeeName,
          employee_Position: employee.employeeType,
          employee_mailId: employee.email,
          employee_dutyStatus: employee.dutyStatus,
          employee_dateofjoining: employee.dateOfJoining,
          // employee_role: employee.role?.department?.name,
          employee_role: employee.role?.name,
        }));
        const sortedData = transformedData.sort((a, b) =>
          a.employee_Name.localeCompare(b.employee_Name)
        );
        console.log("transformedData", transformedData);
        //  setEmployees(transformedData);
        // Sort before filtering

        // Filter only active
        const filterData = sortedData.filter(
          (data) => data.employee_dutyStatus == 1
        );

        setEmployees(filterData);
        setAllEmployees(sortedData);

        setLoading(false);
      } else {
        console.log("Failed to fetch employees.");
      }
    } catch (err) {
      setLoading(false);

      console.log("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  function onClickAddNewMember() {
    navigate("/createemployee");

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }

  // function onClickCard(employeeId) {
  //   navigate("/employeedetails", {
  //     state: { employeeId },
  //   });
  //   // console.log(employeeId)

  //   window.scrollTo({
  //     top: 0,
  //     behavior: "instant",
  //   });
  // }

  function onClickCard(employeeId) {
    navigate(`/employeedetails/${employeeId}`);

    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }

  useEffect(() => {
    let filtered = employees;

    // Text Search
    if (filterInput) {
      const lower = filterInput.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
          emp.employee_Name?.toLowerCase().includes(lower) ||
          emp.employee_mailId?.toLowerCase().includes(lower) ||
          emp.employeeId?.toString().includes(lower)
      );
    }

    // Role Filter
    if (roleFilter) {
      filtered = filtered.filter((emp) => emp.employee_role === roleFilter);
    }

    // Date of Joining Filter
    if (dateFilter) {
      filtered = filtered.filter(
        (emp) => emp.employee_dateofjoining?.slice(0, 10) === dateFilter
      );
    }

    setFilteredEmployees(filtered);
  }, [filterInput, employees, roleFilter, dateFilter]);

  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 12; // Adjust number of employees per page

  // Calculate total pages
  const totalPages = Math.ceil(
    (filteredEmployees?.length || 0) / employeesPerPage
  );

  // Get employees for the current page
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees
    ?.slice()
    .reverse()
    .slice(indexOfFirstEmployee, indexOfLastEmployee);

  const filterEmployee = (value) => {
    if (value) {
      const filterData = allEmployees.filter(
        (data) => data.employee_dutyStatus == value
      );
      setEmployees(filterData);
    } else {
      setEmployees(allEmployees); // reset
    }
  };

  const showUserDetails = (employee) => {
    navigate(`/employeedetails/${employee.id}`, {
      state: { employee },
    });

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  };

  const columns = [
    {
      title: "Sno",
      data: null,
      render: function (data, type, row, meta) {
        return meta.row + 1;
      },
    },

    {
      title: "Name",
      data: null,
      render: function (data, type, row) {
        const name = row.employee_Name || "-";
        const id = row.employeeId || "-";

        return `
      <div>
        <span style="font-weight:00">${name}</span><br/>
        <span>${id}</span>
      </div>
    `;
      },
    },

    {
      title: "Role",
      data: "employee_role",
      render: function (data) {
        return data || "-";
      },
    },
    // {
    //   title: "Current Part",
    //   data: "employee_Position",
    //   render: function (data) {
    //     return data || "-";
    //   },
    // },
    {
      title: "Current Part",
      data: "employee_Position",
      render: function (data) {
        if (!data) return "-";

        const map = {
          Intern: "Internship",
          "Full Time": "Employee",
        };

        return map[data] || data;
      },
    },

    {
      title: "Email",
      data: "employee_mailId",
      render: function (data) {
        return data || "-";
      },
    },

    {
      title: "Joining Date",
      data: "employee_dateofjoining",
      render: function (data) {
        if (!data) return "-";

        return formatDateTime(data)
      },
    },

    {
      title: "Status",
      data: "employee_dutyStatus",
      render: (data, type, row) => {
        const textColor =
          data === "1"
            ? "text-green-600 border rounded-full border-green-600"
            : "text-red-600 border rounded-full border-red-600";
        return `<div class="${textColor}" style="display: inline-block; border: 1px solid ${textColor}; text-align: center; width:100px; font-size: 12px; font-weight: 500">
                  ${data === "1" ? "ACTIVE" : "INACTIVE"}
                </div>`;
      },
    },

    {
      title: "Action",
      data: null,
      render: (data, type, row) => {
        const id = `actions-${row.id}`;

        setTimeout(() => {
          const container = document.getElementById(id);
          if (container && !container.hasChildNodes()) {
            ReactDOM.render(
              <div
                className="flex gap-3 justify-center items-center"
                style={{ fontSize: "18px" }}
              >
                <FaEye
                  className="cursor-pointer text-blue-600"
                  onClick={() => showUserDetails(row)}
                />
              </div>,
              container
            );
          }
        }, 0);

        return `<div id="${id}"></div>`;
      },
    },
  ];

  //   const showUserDetails = (employee) => {
  //   navigate(`/employeedetails/${employee.id}`, {
  //     state: { employee }
  //   });

  //   window.scrollTo({
  //     top: 0,
  //     behavior: "instant",
  //   });
  // };

  // const location = useLocation();
  // console.log(location.state.employee);

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-full min-h-screen px-3 md:px-5 pt-1 md:pt-5 overflow-x-auto">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>


            {/* header */}
            {/* date & timing */}
            {/* <div className="flex justify-between items-center bg-white ps-2 pe-4 py-2 mt-5  rounded-2xl">
              <input
                type="text"
                value={filterInput}
                onChange={(e) => setFilterInput(e.target.value)}
                className=" w-full md:w-full ps-2   placeholder-black border-none outline-none  py-2 "
                placeholder="Searching...."
              />

              <div className="font-medium text-sm lg:text-base text-center lg:text-left w-full flex justify-end">
                <span>{day}, </span>
                <span>{date} </span>
                <span>{month} </span>
                <span className="inline-block  text-center">
                  {hours}:{minutes}:{seconds} {amPm}
                </span>
              </div>
              
            </div> */}

            {/* breadcrumbs */}

            <div className="cursor-pointer">
              <Mobile_Sidebar />
            </div>
            <div className="flex justify-end mt-2 md:mt-0 gap-2 items-center">
              <p
                className="text-sm text-gray-500"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </p>
              <p>{">"}</p>

              <p className="text-sm text-blue-500">Employees</p>
            </div>

            <div className="flex flex-wrap  md:flex-row  justify-between ">
              <div>
                <p className="text-xl md:text-3xl  font-semibold mt-1 md:mt-4">
                  Employees
                </p>
              </div>
              <div className="flex justify-between gap-2 ">
                <button
                  onClick={() =>
                    navigate(-1)
                  }
                  className=" w-fit text-xs md:text-base text-center mt-1 md:mt-4  text-white bg-gray-500 hover:bg-gray-600 font-medium px-2 md:px-3 py-2 rounded-full "
                >
                  Back
                </button>
                <button
                  onClick={onClickAddNewMember}
                  className=" w-fit text-xs md:text-base text-center mt-1 md:mt-4  text-white bg-blue-500 hover:bg-blue-600 font-medium px-1 md:px-3 py-2 rounded-full "
                >
                  Add New Member{" "}
                  <BiSolidMessageAltAdd className="inline-block ms-1 md:ms-3" />
                </button>
              </div>
            </div>

            {/* {isLoading ? (
          <Loader />
        ) : (
          <>
            {filteredEmployees ? (
              <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-10">
                {filteredEmployees.slice().reverse().map((item, index) => (
                  <div
                    key={index}
                    onClick={() => onClickCard(item.employeeId)}
                    className="relative w-full h-80 bg-cover cursor-pointer hover:-translate-y-1 transition-transform rounded-2xl shadow-lg"
                  >
                    <img
                      src={zigzaglines_small}
                      alt=""
                      className="absolute inset-0 rounded-2xl object-cover w-full h-full"
                    />

                    <div className="flex flex-col items-center justify-center gap-4 absolute inset-0 p-4 ">
                      <img
                        src={item.employee_Image}
                        alt=""
                        className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
                      />
                      <div className="text-center">
                        <p className="text-lg font-semibold text-gray-900">
                          {capitalizeFirstLetter(item.employee_Name)}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {capitalizeFirstLetter(item.employee_Position)}
                        </p>
                        <p className="text-gray-700 text-sm ">
                          {item.employee_mailId}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center mt-20">
                <p className=" text-lg">No Data Found</p>
              </div>
            )} */}
            {/* </> */}
            {/* )} */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-10">
                {[...Array(employeesPerPage)].map((_, index) => (
                  <div
                    key={index}
                    className="relative w-full h-80 bg-gray-200 animate-pulse rounded-2xl shadow-lg"
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4">
                      <div className="w-28 h-28 bg-gray-300 rounded-full"></div>
                      <div className="w-32 h-6 bg-gray-300 rounded-md"></div>
                      <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                      <div className="w-28 h-4 bg-gray-300 rounded-md"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="flex flex-wrap justify-start md:justify-end gap-1 mt-6 md:space-x-3">
                  {/* STATUS FILTER */}
                  <select
                    className="px-3 py-2 w-full md:w-40 cursor-pointer rounded-md border"
                    onChange={(e) => filterEmployee(e.target.value)}
                  >
                    <option value="">Status</option>
                    <option value="1" selected>
                      Active
                    </option>
                    <option value="0">Relieved</option>
                  </select>

                  {/* ROLE FILTER */}
                  <select
                    className="px-3 py-2 w-full md:w-60 cursor-pointer rounded-md border"
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="">Role</option>

                    {[
                      ...new Set(
                        allEmployees
                          .map((emp) => emp.employee_role?.trim())
                          .filter((role) => role && role.length > 0)
                      ),
                    ]
                      .sort((a, b) => a.localeCompare(b))
                      .map((role, index) => (
                        <option key={index} value={role}>
                          {role}
                        </option>
                      ))}
                  </select>

                  {/* JOINING DATE FILTER */}
                  {/* <input
                    type="date"
                    className="px-3 py-2 w-full md:w-44 cursor-pointer rounded-md border"
                    onChange={(e) => setDateFilter(e.target.value)}
                  /> */}
                </div>

                {/* <div className="mt-3 md:mt-0 space-x-2">
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className="px-4 py-2 mb-3 sm:mb-0 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
                        >
                          Previous
                        </button>

                        {Array.from({ length: totalPages }, (_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`px-4 py-2 ${currentPage === index + 1
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-700"
                              } rounded-md`}
                          >
                            {index + 1}
                          </button>
                        ))}

                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                          }
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div> */}
                {/* </div> */}
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-10">
                  {currentEmployees.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        onClickCard(item.id);
                        console.log(item);
                      }}
                      className="relative w-full h-80 bg-cover cursor-pointer hover:-translate-y-1 transition-transform rounded-2xl shadow-lg bg-white"
                    >
                      <img
                        src={zigzaglines_small}
                        alt=""
                        className="absolute inset-0 rounded-2xl object-cover w-full h-full"
                      />
                      <div className="flex flex-col items-center justify-center gap-4 absolute inset-0 p-4">
                        <div className="relative">
                          <img
                            src={item.employee_Image}
                            alt=""
                            className="w-28 h-28 rounded-full object-cover border-white shadow-lg"
                          />
                          {item.employee_dutyStatus == 1 ? (
                            <span
                              className="w-[11px] h-[11px] rounded-full absolute top-3 right-3 
                            bg-gradient-to-r from-green-400 to-green-600 
                            shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                            ></span>
                          ) : (
                            <span
                              className="w-[11px] h-[11px] rounded-full absolute top-3 right-3 
                            bg-gradient-to-r from-orange-400 to-orange-600 
                             shadow-[0_0_8px_rgba(249,115,22,0.8)]"
                            ></span>
                          )}
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900 capitalize">
                            {item.employee_Name}
                          </p> */}
                {/* role */}
                {/* <p className="text-gray-500 text-sm capitalize">
                            {item.employee_role}
                          </p>
                          <p className="text-gray-500 text-sm capitalize">
                            {item.employee_Position}
                          </p>
                          <p className="text-gray-700 text-sm">
                            {item.employee_mailId}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div> */}

                {/* Pagination Controls */}
                {/* <div className="flex justify-center mt-6 space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-4 py-2 ${
                        currentPage === index + 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      } rounded-md`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
                  >
                    Next
                  </button>
                </div> */}

                <>
                  <div className="datatable-container">
                    {/* Responsive wrapper for the table */}
                    <div className="table-scroll-container" id="datatable">
                      <DataTable
                        data={filteredEmployees}
                        columns={columns}
                        options={{
                          paging: true,
                          searching: true,
                          ordering: true,
                          scrollX: true,
                          responsive: true,
                          autoWidth: false,
                          language: {
                            emptyTable: "No Data Available",
                          },
                        }}
                        className="display nowrap bg-white"
                      />
                    </div>
                  </div>
                </>
              </>
            )}
          </div>
        </>
      )}
      <Footer />
    </div>
  );
};

export default Employees_Card;
