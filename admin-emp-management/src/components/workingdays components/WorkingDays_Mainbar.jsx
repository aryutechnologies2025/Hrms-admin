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
import { IoIosArrowForward } from "react-icons/io";
import Loader from "../Loader";
import Button_Loader from "../Button_Loader";

const WorkingDays_Mainbar = () => {
  const [month, setMonth] = useState("");
  const [workingDays, setWorkingDays] = useState("");
  const [noOfDaysInMonth, setNoOfDaysInMonth] = useState("");
  const [editMonth, setEditMonth] = useState("");
  const [editWorkingDays, setEditWorkingDays] = useState("");
  const [editNoOfDaysInMonth, setEditNoOfDaysInMonth] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [workingDaysList, setWorkingDaysList] = useState([]);
  const [rowData, setRowData] = useState("");
  const [error, setError] = useState("");
  const [editError, setEditError] = useState("");
  const [tableLoading, setTableLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [deleteSelectedRow, setDeleteSelectedRow] = useState(null);

  const handleMonthChange = (e) => {
    const selectedMonth = e.target.value;

    setMonth(selectedMonth);

    if (selectedMonth) {
      const [year, month] = selectedMonth.split("-").map(Number);

      const days = new Date(year, month, 0).getDate(); // Get days in the month
      setNoOfDaysInMonth(days);
      setWorkingDays("");
    }
  };

  const onChangeWorkingDays = (e) => {
    let value = e.target.value; // Convert to number
    if (value < 0) value = 0; // Ensure the value doesn't go below 0
    if (value > noOfDaysInMonth) value = noOfDaysInMonth; // Ensure the value doesn't exceed the number of days in the month

    setWorkingDays(value);
  };

  const handleEditMonthChange = (e) => {
    const selectedMonth = e.target.value;

    setEditMonth(selectedMonth);

    if (selectedMonth) {
      const [year, month] = selectedMonth.split("-").map(Number);

      const days = new Date(year, month, 0).getDate(); // Get days in the month
      setEditNoOfDaysInMonth(days);
      setEditWorkingDays("");
    }
  };

  const onChangeEditWorkingDays = (e) => {
    let value = e.target.value; // Convert to number
    if (value < 0) value = 0; // Ensure the value doesn't go below 0
    if (value > editNoOfDaysInMonth) value = editNoOfDaysInMonth; // Ensure the value doesn't exceed the number of days in the month

    setEditWorkingDays(value);
  };


  const columns = [
    { field: "S.No", header: "S.No" },
    {
      field: "month_year",
      header: "Month",
      body: (rowData) => rowData.month_year.split("-").reverse().join("-"),
    },

    {
      field: "days",
      header: "Total Working Days",
    },

    {
      field: "",
      header: "Action",
      body: (rowData) => (
        <div className="flex justify-center gap-2">
          <button
            className="px-3 py-1 rounded text-white bg-blue-500  hover:bg-blue-600"
            onClick={() => handleEditClick(rowData)}
          >
            Edit
          </button>
          <button
            className="px-3 py-1 rounded text-white bg-red-500  hover:bg-red-600"
            onClick={() => {
              setDeleteSelectedRow(rowData);
              setShowConfirmAlert(true);
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const fetchWorkingDaysList = async () => {
    try {
      let response = await axios.get(`${API_URL}/api/month`);
      setWorkingDaysList(response.data.data);
      setTableLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWorkingDaysList();
  }, []);

  const onClickSubmit = async () => {
    setButtonLoading(true);
    try {
      let response = await axios.post(`${API_URL}/api/month/create `, {
        month_year: month,
        days: workingDays,
      });
      setMonth("");
      setWorkingDays("");
      setNoOfDaysInMonth("");
      fetchWorkingDaysList();
      setError("");
      setButtonLoading(false);
    } catch (error) {
      console.log(error);
      setError(error.response.data.errors);
      setButtonLoading(false);
    }
  };

  const handleEditClick = async (rowData) => {
    setEditMonth(rowData.month_year);
    setEditWorkingDays(rowData.days);

    const [year, month] = rowData.month_year.split("-").map(Number);
    const days = new Date(year, month, 0).getDate(); // Get days in the month
    setEditNoOfDaysInMonth(days);
    openEditWorkingModalOpen();
    setRowData(rowData);
  };

  const handleDeleteCLick = async (rowData) => {
    try {
      let response = await axios.delete(
        `${API_URL}/api/month/delete/${rowData.id}`
      );
      fetchWorkingDaysList();
    } catch (error) {
      console.log(error);
    }
  };

  const [editWorkingModalOpen, setEditWorkingModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const openEditWorkingModalOpen = () => {
    setMonth("");
    setWorkingDays("");
    setNoOfDaysInMonth("");
    setError("");
    setEditWorkingModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10); // Delay to trigger animation
  };

  const closeEditWorkingModalOpen = () => {
    setIsAnimating(false);
    setTimeout(() => setEditWorkingModalOpen(false), 250); // Delay to trigger animation
    // setMonth("");
    // setWorkingDays("");
    // setNoOfDaysInMonth("");
    setEditMonth("");
    setEditWorkingDays("");
    setEditNoOfDaysInMonth("");
    setEditError("");

  };

  const handleSaveEditWorkingDays = async () => {
    setButtonLoading(true);
    try {
      let response = await axios.post(
        `${API_URL}/api/month/update/${rowData.id} `,
        {
          month_year: editMonth,
          days: editWorkingDays,
        }
      );
      setEditMonth("");
      setEditWorkingDays("");
      setEditNoOfDaysInMonth("");
      fetchWorkingDaysList();
      setEditError("");
      closeEditWorkingModalOpen();
      setButtonLoading(false);
    } catch (error) {
      console.log(error.response.data.errors);
      setEditError(error.response.data.errors);
      setButtonLoading(false);
    }
  };

  useEffect(() => {
    if (
      editWorkingModalOpen ||
      showConfirmAlert
    ) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Clean up on component unmount
    return () => document.body.classList.remove("overflow-hidden");
  }, [editWorkingModalOpen, showConfirmAlert]);

  return (
    <div className="flex flex-col justify-between overflow-x-hidden bg-gray-100 px-5 pt-2 md:pt-5 min-h-screen  w-screen">
      <div>
        <div>
          <Mobile_Sidebar />

          {/* breadcrumb */}
          <div className="flex gap-2 mt-5 text-sm items-center">
            <p className=" text-blue-500 ">Working Days</p>
            <p>{">"}</p>
          </div>

          <div className="flex flex-col bg-[url('././assets/zigzaglines_large.svg')] w-full  bg-no-repeat bg-cover bg-center rounded-3xl md:items-center md:justify-center bg-opacity-25 mt-8 px-5 py-3 ">
            <p className="text-2xl md:text-3xl w-full font-semibold">
              Total Working Days
            </p>

            <div className=" flex w-full md:w-auto flex-col justify-center ">
              <div className="flex    flex-col gap-5 mt-5">
                <div className="flex flex-col md:flex-row gap-5 justify-between">
                  <label
                    htmlFor="RESPONSIBILITIES"
                    className="font-medium text-sm"
                  >
                    Select Month
                  </label>

                  <div className="flex flex-col gap-1">
                    <input
                      type="month"
                      value={month}
                      onChange={(e) => handleMonthChange(e)}
                      placeholder="The concise explanation for leave, providing context for their absence"
                      className="border-2 h-10  border-gray-200 rounded-xl  w-full py-1  md:w-80 lg:w-[520px] xl:w-96 px-3  "
                    />
                    {error && (
                      <p className="text-red-500 text-sm">{error.month_year}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex    flex-col gap-5 mt-5">
                <div className="flex flex-col  md:flex-row gap-5 justify-between">
                  <label
                    htmlFor="noOfDaysInMonth"
                    className="font-medium text-sm"
                  >
                    Total Days in That Month
                  </label>

                  <input
                    value={noOfDaysInMonth}
                    className="border-2 h-10 border-gray-200 rounded-xl  w-full py-1  md:w-80 lg:w-[520px] xl:w-96 px-3  "
                    id="noOfDaysInMonth"
                  />
                </div>
              </div>

              <div className="flex    flex-col gap-5 mt-5">
                <div className="flex flex-col  md:flex-row gap-5 justify-between">
                  <label
                    htmlFor="totalworkingdays"
                    className="font-medium text-sm"
                  >
                    Total Working Days
                  </label>

                  <div className="flex flex-col gap-1">
                    <input
                      id="totalworkingdays"
                      type="number"
                      // max={30}
                      // max={noOfDaysInMonth}
                      // maxLength={noOfDaysInMonth}
                      value={workingDays}
                      readOnly={!month}
                      onChange={(e) => onChangeWorkingDays(e)}
                      className="border-2 h-10 border-gray-200 rounded-xl  w-full py-1  md:w-80 lg:w-[520px] xl:w-96 px-3  "
                    />
                    {error && (
                      <p className="text-red-500 text-sm">{error.days}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
               
                <button
                  onClick={() => onClickSubmit()}
                  className={`bg-blue-500 hover:bg-blue-600 text-white px-5 md:px-10 py-1 md:py-2.5 rounded-full flex items-center justify-center gap-2 ${
                    buttonLoading ? "cursor-not-allowed" : ""
                  }`}
                  disabled={buttonLoading}
                >
                  <div className="w-12 h-6 flex items-center justify-center">
                    {buttonLoading ? (
                      <Button_Loader />
                    ) : (
                      "Submit"
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ width: "auto", margin: "0 auto", overflowX: "hidden" }}>
          {/* Global Search Input */}
          <div className="mt-5 flex justify-end">
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
            {tableLoading && <Loader />}

            <DataTable
              className="mt-8"
              value={workingDaysList}
              paginator
              rows={20}
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
                  body={
                    col.field === "S.No"
                      ? (rowData, { rowIndex }) => rowIndex + 1
                      : col.body
                  }
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

        <Footer />

        {showConfirmAlert && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50">
          <div className="bg-white shadow-lg rounded-lg p-4 mx-3 sm:mx-0 sm:p-6 w-80">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Confirm Delete</h2>
            <p className="text-gray-600 mb-4">Are you sure you want to delete this?</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                onClick={() => setShowConfirmAlert(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
                onClick={() => {
                  handleDeleteCLick(deleteSelectedRow);
                  setShowConfirmAlert(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      {editWorkingModalOpen && (
        <div className="fixed inset-0 top-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0"
            onClick={closeEditWorkingModalOpen}
          ></div>
          <div
            className={`fixed top-0 right-0 h-screen overflow-y-scroll w-[90vw] md:w-[70vw] bg-white shadow-lg px-5 md:px-16 py-10 transform transition-transform duration-500 ease-in-out ${
              isAnimating ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div
              className="w-6 h-6 rounded-full border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
              title="Toggle Sidebar"
              onClick={closeEditWorkingModalOpen}
            >
              <IoIosArrowForward className="w-3 h-3" />
            </div>
            <div className="flex flex-wrap flex-col md:flex-row justify-between">
              <p className="text-3xl font-medium mt-8">Edit Working Days</p>
              <div className="flex justify-end gap-5 mt-8">
                <button
                  onClick={closeEditWorkingModalOpen}
                  className="bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-9 py-1 md:py-2 font-semibold rounded-full"
                >
                  Cancel
                </button>
               
                <button
                  onClick={handleSaveEditWorkingDays}
                  className={`bg-blue-600 hover:bg-blue-700 text-white px-5 md:px-9 py-1 md:py-2 font-semibold rounded-full flex items-center justify-center gap-2 ${
                    buttonLoading ? " cursor-not-allowed" : ""
                  }`}
                  disabled={buttonLoading}
                >
                  <div className="w-8 h-4 flex items-center justify-center">
                    {buttonLoading ? (
                      <Button_Loader />
                    ) : (
                      "Save"
                    )}
                  </div>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-8">
              {/* leave date */}
              <div className="flex flex-col lg:flex-row gap-1 justify-between">
                <label className="font-medium text-sm" htmlFor="holiday date">
                  SELECT MONTH
                </label>

                <div className="flex flex-col gap-1">
                  <input
                    type="month"
                    id="holiday date"
                    className={`border-2  gray-300 rounded-xl px-4  outline-none h-10 w-full md:w-96`}
                    value={editMonth}
                    onChange={(e) => handleEditMonthChange(e)}
                  />
                  {editError.month_year && (
                    <p className="text-red-500 text-sm">
                      {editError.month_year[0]}
                    </p>
                  )}
                </div>
              </div>

              {/*                      Total Days in That Month*/}
              <div className="flex flex-col lg:flex-row gap-1 justify-between">
                <label className="font-medium text-sm" htmlFor="holiday reason">
                  Total Days in That Month
                </label>

                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    id="holiday reason"
                    placeholder="Enter Holiday Reason"
                    className={`border-2 rounded-xl px-4  outline-none h-10 w-full md:w-96 `}
                    value={editNoOfDaysInMonth}
                  />
                  {/* {editUpcoimgHolidayError.holiday_name && (
                      <p className="text-red-500 text-sm">
                        {editUpcoimgHolidayError.holiday_name[0]}
                      </p>
                    )} */}
                </div>
              </div>

              {/* Total Working Days */}
              <div className="flex flex-col lg:flex-row gap-1 justify-between">
                <label className="font-medium text-sm" htmlFor="holiday reason">
                  Total Working Days
                </label>

                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    id="holiday reason"
                    placeholder="Enter Holiday Reason"
                    className={`border-2 rounded-xl px-4  outline-none h-10 w-full md:w-96 `}
                    value={editWorkingDays}
                    onChange={(e) => onChangeEditWorkingDays(e)}
                  />
                  {editError.days && (
                    <p className="text-red-500 text-sm">{editError.days[0]}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkingDays_Mainbar;
