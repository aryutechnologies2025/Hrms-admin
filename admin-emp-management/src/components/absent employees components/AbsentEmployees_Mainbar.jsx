import React from "react";
import Mobile_Sidebar from "../Mobile_Sidebar";
import Footer from "../Footer";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css"; // PrimeReact theme
import "primereact/resources/primereact.min.css"; // PrimeReact core CSS
import { InputText } from "primereact/inputtext";
import Loader from "../Loader";

const AbsentEmployees_Mainbar = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [absentedEmployeesList, setAbsentedEmployeesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0] 
  );

  const getAbsentedEmployeesList = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/emp-attendances/present-employee`,
        {
          params: {
            filter: "absent",
          },
        }
      );
      setAbsentedEmployeesList(response.data.employees);
      
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getAbsentedEmployeesList();
  }, []);

  const columns = [
    { field: "emp_id", header: "Employee ID" },
    {
      field: "employee_name",
      header: "Employee Name",
    },
    {
      field: "email_address",
      header: "Email",
    },
    {
      field: "department", // Match the field to the data structure
      header: "Department",
    },
  ];

  const onChangeDate = async (e) => {
    setSelectedDate(e.target.value);

    const params = {
      filter: "absent",
      date: e.target.value,
    };

    try {
      const response = await axios.get(
        `${API_URL}/api/emp-attendances/present-employee`,
        {
          params,
        }
      );

      setAbsentedEmployeesList(response.data?.employees);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col justify-between overflow-x-hidden bg-gray-100 px-5 pt-2 md:pt-5 min-h-screen  w-screen">
      {loading ? (
        <Loader />
      ) : (
        <>
      <div>
        <Mobile_Sidebar />

        {/* breadcrumb */}
        <div className="flex gap-2 mt-5 text-sm items-center">
          <p className=" text-blue-500 ">Absent</p>
          <p>{">"}</p>
        </div>

        <p className="text-2xl md:text-3xl font-semibold mt-5 md:mt-8">
          Absent Employees
        </p>

        {/* data table */}
        <div style={{ width: "auto", margin: "0 auto", overflowX: "hidden" }}>
          {/* Global Search Input */}
          <div className="mt-5 gap-8 flex justify-end">
            <input
              type="date"
              name=""
              id=""
              className="px-3 rounded-md"
              value={selectedDate}
              onChange={(e) => onChangeDate(e)}
            />
            <InputText
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search"
              className="px-2 py-2 rounded-md"
            />
          </div>

          {/* Table Container with Relative Position */}
          <div className="relative mt-4">
            {/* Loader Overlay */}
            {loading && <Loader />}

            <DataTable
              className="mt-8"
              value={absentedEmployeesList}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 20]}
              globalFilter={globalFilter} // Global search filter
              showGridlines
              resizableColumns
            >
              {columns.map((col, index) => (
                <Column
                  key={index}
                  field={col.field}
                  header={col.header}
                  body={col.body}
                  style={{
                    minWidth: "150px",
                    wordWrap: "break-word", // Allow text to wrap
                    overflow: "hidden", // Prevent text overflow
                    whiteSpace: "normal", // Ensure that text wraps within the available space
                  }}
                />
              ))}
            </DataTable>
          </div>
        </div>
      </div>
       </>
      )}
      <Footer />
    </div>
  );
};

export default AbsentEmployees_Mainbar;
