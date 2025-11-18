// import React from "react";
// import Mobile_Sidebar from "../Mobile_Sidebar";
// import Footer from "../Footer";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { API_URL } from "../../config";
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import "primereact/resources/themes/saga-blue/theme.css"; // PrimeReact theme
// import "primereact/resources/primereact.min.css"; // PrimeReact core CSS
// import { InputText } from "primereact/inputtext";
// import Loader from "../Loader";

// const PresentedEmployees_Mainbar = () => {
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [presentedEmployeesList, setPresentedEmployeesList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedDate, setSelectedDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );
//   let [currentDate, setCurrentDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );

//   const getPresentedEmployeesList = async () => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/api/emp-attendances/present-employee`
//       );
//       setPresentedEmployeesList(response.data.employees);
//       setLoading(false);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getPresentedEmployeesList();
//   }, []);

//   const columns = [
//     { field: "emp_id", header: "Employee ID" },
//     {
//       field: "employee_name",
//       header: "Employee Name",
//     },
//     {
//       field: "email",
//       header: "Email",
//     },
//     {
//       field: "department", // Match the field to the data structure
//       header: "Department",
//     },
//     {
//       field: "entry_date_time",
//       header: "Date",
//       //  body: (rowData) => rowData.entry_date_time.split("-").reverse().join("-"),
//     },
//     { field: "login_time", header: "Login Time" },
//     { field: "logout_time", header: "Logout Time" },
//     { field: "total_break_time", header: "Break" },
//     { field: "total_hours_worked", header: "Total Hours" },
//   ];

//   const onChangeDate = async (e) => {
//     setSelectedDate(e.target.value);

//     const params = {
//       date: e.target.value,
//     };

//     if (currentDate !== e.target.value) {
//       params.is_deleted = "1";
//     }

//     try {
//       const response = await axios.get(
//         `${API_URL}/api/emp-attendances/attendance-list-filter`,
//         {
//           params,
//         }
//       );

//       setPresentedEmployeesList(response.data?.data?.employees);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="flex flex-col justify-between overflow-x-hidden bg-gray-100 px-5 pt-2 md:pt-5 min-h-screen  w-screen">
//       <div>
//         <Mobile_Sidebar />

//         {/* breadcrumb */}
//         <div className="flex gap-2 mt-5 text-sm items-center">
//           <p className=" text-blue-500 ">Present</p>
//           <p>{">"}</p>
//         </div>

//         <p className="text-2xl md:text-3xl font-semibold mt-5 md:mt-8">
//           Present Employees
//         </p>

//         {/* data table */}
//         <div style={{ width: "auto", margin: "0 auto", overflowX: "hidden" }}>
//           {/* Global Search Input */}
//           <div className="mt-5 flex gap-8 justify-end">
//             <input
//               type="date"
//               name=""
//               id=""
//               className="px-3 rounded-md"
//               value={selectedDate}
//               onChange={(e) => onChangeDate(e)}
//             />
//             <InputText
//               value={globalFilter}
//               onChange={(e) => setGlobalFilter(e.target.value)}
//               placeholder="Search"
//               className="px-2 py-2 rounded-md"
//             />
//           </div>

//           {/* Table Container with Relative Position */}
//           <div className="relative mt-4">
//             {/* Loader Overlay */}
//             {loading && <Loader />}

//             <DataTable
//               className="mt-8"
//               value={presentedEmployeesList}
//               paginator
//               rows={5}
//               rowsPerPageOptions={[5, 10, 20]}
//               globalFilter={globalFilter} // Global search filter
//               showGridlines
//               resizableColumns
//             >
//               {columns.map((col, index) => (
//                 <Column
//                   key={index}
//                   field={col.field}
//                   header={col.header}
//                   body={col.body}
//                   style={{
//                     minWidth: "150px",
//                     wordWrap: "break-word", // Allow text to wrap
//                     overflow: "hidden", // Prevent text overflow
//                     whiteSpace: "normal", // Ensure that text wraps within the available space
//                   }}
//                 />
//               ))}
//             </DataTable>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default PresentedEmployees_Mainbar;

import React, { useState, useEffect } from "react";
import Mobile_Sidebar from "../Mobile_Sidebar";
import Footer from "../Footer";
import axios from "axios";
import { API_URL } from "../../config";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import Loader from "../Loader";
import { saveAs } from "file-saver";
import Papa from "papaparse";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";

const PresentedEmployees_Mainbar = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [presentedEmployeesList, setPresentedEmployeesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [employeeName, setEmployeeName] = useState("");

  useEffect(() => {
    fetchPresentedEmployees();
  }, []);

  const fetchPresentedEmployees = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/emp-attendances/attendance-list-filter`
      );
      
      setPresentedEmployeesList(response.data.employees);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  const filterAttendanceList = async () => {
    const params = {};
    if (fromDate) params.from_date = formatDate(fromDate);
    if (toDate) params.to_date = formatDate(toDate);
    if (employeeName) params.employee_name = employeeName;

    console.log("params",params);
    
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/api/emp-attendances/attendance-list-filter`,
        { params }
      );
      setPresentedEmployeesList(response.data?.data?.employees || []);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const csvData = Papa.unparse(presentedEmployeesList);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "presented_employees.csv");
  };

  return (
    <div className="flex flex-col justify-between overflow-x-hidden bg-gray-100 px-5 pt-2 md:pt-5 min-h-screen w-screen">
      
      {loading ? (
              <Loader />
            ) : (
              <><div>
        <Mobile_Sidebar />
        <p className="text-2xl md:text-3xl font-semibold mt-5 md:mt-8">
          Present Employees
        </p>

        <div className="mt-5 flex gap-4 justify-end">
          <input
            type="date"
            className="px-3 py-2 rounded-md border"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <input
            type="date"
            className="px-3 py-2 rounded-md border"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <InputText
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            placeholder="Employee Name"
            className="px-2 py-2 rounded-md border"
          />
          <button
            onClick={filterAttendanceList}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Search
          </button>
          <button
            onClick={exportToCSV}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Export CSV
          </button>
        </div>

        <div className="relative mt-4">
          {loading && <Loader />}
          <DataTable
            className="mt-8"
            value={presentedEmployeesList}
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 20]}
            globalFilter={globalFilter}
            showGridlines
          >
            <Column field="employeeIds" header="Employee ID" />
            <Column field="employee_name" header="Employee Name" />
            <Column field="email" header="Email" />
            <Column field="department" header="Department" />
            <Column field="date" header="Date" />
            <Column field="login_time" header="Login Time" />
            <Column field="logout_time" header="Logout Time" />
            <Column field="total_break_time" header="Break" />
            <Column field="total_hours_worked" header="Total Hours" />
          </DataTable>
        </div>
      </div>
        </>
      )}
      <Footer />
    </div>
  );
};

export default PresentedEmployees_Mainbar;
