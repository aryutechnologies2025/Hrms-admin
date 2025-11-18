import React, { useEffect } from "react";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css"; // PrimeReact theme
import "primereact/resources/primereact.min.css"; // PrimeReact core CSS
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { API_URL } from "../../config";
import axios from "axios";
import Loader from "../Loader";
import Button_Loader from "../Button_Loader";
import { toast } from "react-toastify";
import { TfiPencilAlt } from "react-icons/tfi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Holidays_Mainbar = () => {
  const [holidaysList, setHolidaysList] = useState([]);
  const [holidayDate, setHolidayDate] = useState("");
  const [holidayReason, setHolidayReason] = useState("");
  const [rowData, setRowData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addUpcoimgHolidayError, setAddUpcoimgHolidayError] = useState("");
  const [editUpcoimgHolidayError, setEditUpcoimgHolidayError] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [deleteSelectedRow, setDeleteSelectedRow] = useState(null);

  const [globalFilter, setGlobalFilter] = useState("");
  const columns = [
    {
      field: "S.No",
      header: "S.No",
    },
    {
      field: "date",
      header: "Date",
      body: (rowData) =>
        rowData.date.split("T")[0].split("-").reverse().join("-"),
    },
    {
      field: "reason",
      header: "Reason",
    },
    {
      field: "",
      header: "Action",
      body: (rowData) => (
        <div className="flex justify-center gap-2">
          <button
            className="px-1 py-1 rounded text-white  "
            onClick={() => handleEditClick(rowData)}
          >
            <TfiPencilAlt className="text-blue-600 cursor-pointer hover:text-blue-800" />
          </button>
          <button
            className="px-1 rounded text-white text-xl"
            onClick={() => {
              setDeleteSelectedRow(rowData);
              setShowConfirmAlert(true);
            }}
          >
            <MdOutlineDeleteOutline className="text-red-600 cursor-pointer hover:text-red-800" />
          </button>
        </div>
      ),
    },
  ];

  const handleEditClick = async (rowData) => {
    setHolidayDate(rowData.date.split("T")[0]);
    setHolidayReason(rowData.reason);
    openEditHolidayModalOpen();
    setRowData(rowData);
  };

  const handleDeleteCLick = async (rowData) => {
    try {
      let response = await axios.delete(
        `${API_URL}/api/upcomingholiday/delete-upcomingholiday/${rowData._id}`
      );
      fetchHolidaysList();
      toast.success("Deleted Successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  const [addUpcomingHolidaysModalOpen, setAddUpcomingHolidaysModalOpen] =
    useState(false);
  const [editHolidayModalOpen, setEditHolidayModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const openUpcomingHolidaysModalOpen = () => {
    setAddUpcomingHolidaysModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10); // Delay to trigger animation
  };

  const closeUpcomingHolidaysModalOpen = () => {
    setHolidayDate("");
    setHolidayReason("");
    setAddUpcoimgHolidayError("");
    setIsAnimating(false);
    setTimeout(() => setAddUpcomingHolidaysModalOpen(false), 250); // Delay to trigger animation
  };

  const openEditHolidayModalOpen = () => {
    setEditHolidayModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10); // Delay to trigger animation
  };

  const closeEditHolidayModalOpen = () => {
    setHolidayDate("");
    setHolidayReason("");
    setEditUpcoimgHolidayError("");
    setIsAnimating(false);
    setTimeout(() => setEditHolidayModalOpen(false), 250); // Delay to trigger animation
  };

  const handleSaveUpcomingHoliday = async () => {
    setButtonLoading(true);
    try {
      let payload = {
        reason: holidayReason,
        date: holidayDate,
      };
      const response = await axios.post(
        `${API_URL}/api/upcomingholiday/create-upcomingholiday`,
        payload
      );

      setHolidayDate("");
      setHolidayReason("");
      fetchHolidaysList();
      closeUpcomingHolidaysModalOpen();
      setAddUpcoimgHolidayError("");
      setButtonLoading(false);
    } catch (error) {
      console.log(error.response.data.errors);
      setAddUpcoimgHolidayError(error.response.data.errors);
      setButtonLoading(false);
    }
  };

  const handleSaveEditHoliday = async () => {
    setButtonLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/api/upcomingholiday/edit-upcomingholiday/${rowData._id}`,
        {
          reason: holidayReason,
          date: holidayDate,
        }
      );

      setHolidayDate("");
      setHolidayReason("");
      fetchHolidaysList();
      closeEditHolidayModalOpen();
      fetchHolidaysList();
      setEditUpcoimgHolidayError("");
      setButtonLoading(false);
    } catch (error) {
      console.log(error.response.data.errors);
      setEditUpcoimgHolidayError(error.response.data.errors);
      setButtonLoading(false);
    }
  };

  const fetchHolidaysList = async () => {
    try {
      let response = await axios.get(
        `${API_URL}/api/upcomingholiday/view-upcomingholiday`
      );
      setHolidaysList(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidaysList();
  }, []);

  useEffect(() => {
    if (
      addUpcomingHolidaysModalOpen ||
      editHolidayModalOpen ||
      showConfirmAlert
    ) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Clean up on component unmount
    return () => document.body.classList.remove("overflow-hidden");
  }, [addUpcomingHolidaysModalOpen, editHolidayModalOpen, showConfirmAlert]);

  let navigate = useNavigate();
  return (
    <div className="flex flex-col justify-between overflow-x-hidden bg-gray-100 px-5 pt-2 md:pt-5 min-h-screen  w-screen">
      {loading ? (
        <Loader />
      ) : (
        <>
      <div>
        <Mobile_Sidebar />

        {/* breadcrumb */}
        <div className="flex gap-2 mt-5 text-sm items-center cursor-pointer">
          <p
            className="text-sm text-gray-500"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </p>
          <p>{">"}</p>

          <p className=" text-blue-500 ">Holidays</p>
          <p>{">"}</p>
        </div>

        {/* Heading */}
        <section className="flex flex-wrap md:flex-row justify-between ">
          <p className="text-2xl md:text-3xl font-semibold  mt-5 md:mt-8">
            Holidays
          </p>
          <button
            onClick={openUpcomingHolidaysModalOpen}
            className="px-4 py-1 mt-5 md:mt-8 w-fit cursor-pointer rounded-full  text-white bg-blue-500 hover:bg-blue-600 font-medium"
          >
            Add Upcoming Holidays
          </button>
        </section>

        <div className="w-full mx-auto relative">
          {/* Global Search Input */}
          <div className="mt-4 md:mt-8 flex md:justify-end">
            <InputText
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search"
              className="px-2 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Table Container with Relative Position */}
          <div className="relative mt-4">
            {/* Loader Overlay */}
            {loading && <Loader />}

            {/* DataTable */}
            <DataTable
              className="mt-8"
              value={holidaysList}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 20]}
              globalFilter={globalFilter}
              showGridlines
              resizableColumns
            >
              {columns.map((col, index) => (
                <Column
                  key={index}
                  field={col.field}
                  header={col.header}
                  //    body={col.body}
                  body={
                    col.field === "S.No"
                      ? (rowData, { rowIndex }) => rowIndex + 1
                      : col.body
                  }
                  style={{
                    minWidth: "150px",
                    wordWrap: "break-word",
                    overflow: "hidden",
                    whiteSpace: "normal",
                  }}
                />
              ))}
            </DataTable>
          </div>
        </div>

        {showConfirmAlert && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50">
            <div className="bg-white shadow-lg rounded-lg p-4 mx-3 sm:mx-0 sm:p-6 w-80">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Confirm Delete
              </h2>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this?
              </p>
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

        {addUpcomingHolidaysModalOpen && (
          <div className="fixed inset-0 top-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
            {/* Overlay */}
            <div
              className="absolute inset-0"
              onClick={closeUpcomingHolidaysModalOpen}
            ></div>
            <div
              className={`fixed top-0 right-0 h-screen overflow-y-scroll w-[80vw] md:w-[50vw] bg-white shadow-lg px-5 md:px-16 py-10 transform transition-transform duration-500 ease-in-out ${
                isAnimating ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                title="Toggle Sidebar"
                onClick={closeUpcomingHolidaysModalOpen}
              >
                <IoIosArrowForward className="w-3 h-3" />
              </div>
              <div className="flex flex-wrap flex-col md:flex-row justify-between">
                <p className="text-2xl md:text-3xl font-medium mt-8">
                  Add Upcoming Holiday
                </p>
                <div className="flex justify-end gap-5 mt-8">
                  <button
                    onClick={closeUpcomingHolidaysModalOpen}
                    className="bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-9 py-1 md:py-2 font-semibold rounded-full"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSaveUpcomingHoliday}
                    className={`bg-blue-600 hover:bg-blue-700 text-white px-5 md:px-9 py-1 md:py-2 font-semibold rounded-full flex items-center justify-center gap-2 ${
                      buttonLoading ? " cursor-not-allowed" : ""
                    }`}
                    disabled={buttonLoading}
                  >
                    <div className="w-8 h-4 flex items-center justify-center">
                      {buttonLoading ? <Button_Loader /> : "Save"}
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-8">
                {/* leave date */}
                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <div className="flex flex-col">
                    <label
                      className="font-medium text-sm"
                      htmlFor="holiday date"
                    >
                      HOLIDAY DATE
                    </label>
                    <p className="text-sm text-gray-500">Add Holiday Date</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <input
                      type="date"
                      id="holiday date"
                      className={`border-2  gray-300 rounded-xl px-4  outline-none h-10 w-full md:w-96`}
                      //    onKeyUp={handleKeyUp}
                      value={holidayDate}
                      onChange={(e) => setHolidayDate(e.target.value)}
                    />
                    {addUpcoimgHolidayError.date && (
                      <p className="text-red-500 text-sm">
                        {addUpcoimgHolidayError.date}
                      </p>
                    )}
                  </div>
                </div>

                {/* Department Name */}
                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <div className="flex flex-col">
                    <label
                      className="font-medium text-sm"
                      htmlFor="holiday reason"
                    >
                      HOLIDAY REASON
                    </label>
                    <p className="text-sm text-gray-500">Add Holiday Reason</p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      id="holiday reason"
                      placeholder="Enter Holiday Reason"
                      className={`border-2 rounded-xl px-4  outline-none h-10 w-full md:w-96 `}
                      value={holidayReason}
                      onChange={(e) => setHolidayReason(e.target.value)}
                    />
                    {addUpcoimgHolidayError.reason && (
                      <p className="text-red-500 text-sm">
                        {addUpcoimgHolidayError.reason}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {editHolidayModalOpen && (
          <div className="fixed inset-0 top-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
            {/* Overlay */}
            <div
              className="absolute inset-0"
              onClick={closeEditHolidayModalOpen}
            ></div>
            <div
              className={`fixed top-0 right-0 h-screen overflow-y-scroll w-[90vw] md:w-[70vw] bg-white shadow-lg px-5 md:px-16 py-10 transform transition-transform duration-500 ease-in-out ${
                isAnimating ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                title="Toggle Sidebar"
                onClick={closeEditHolidayModalOpen}
              >
                <IoIosArrowForward className="w-3 h-3" />
              </div>
              <div className="flex flex-wrap flex-col md:flex-row justify-between">
                <p className="text-3xl font-medium mt-8">Edit Holiday</p>
                <div className="flex justify-end gap-5 mt-8">
                  <button
                    onClick={closeEditHolidayModalOpen}
                    className="bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-9 py-1 md:py-2 font-semibold rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEditHoliday}
                    className={`bg-blue-600 hover:bg-blue-700 text-white px-5 md:px-9 py-1 md:py-2 font-semibold rounded-full flex items-center justify-center gap-2 ${
                      buttonLoading ? " cursor-not-allowed" : ""
                    }`}
                    disabled={buttonLoading}
                  >
                    <div className="w-8 h-4 flex items-center justify-center">
                      {buttonLoading ? <Button_Loader /> : "Save"}
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-8">
                {/* leave date */}
                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <div className="flex flex-col">
                    <label
                      className="font-medium text-sm"
                      htmlFor="holiday date"
                    >
                      HOLIDAY DATE
                    </label>
                    <p className="text-sm text-gray-500">Add Holiday Date</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <input
                      type="date"
                      id="holiday date"
                      className={`border-2  gray-300 rounded-xl px-4  outline-none h-10 w-full md:w-96`}
                      //    onKeyUp={handleKeyUp}
                      value={holidayDate}
                      onChange={(e) => setHolidayDate(e.target.value)}
                    />
                    {editUpcoimgHolidayError.date && (
                      <p className="text-red-500 text-sm">
                        {editUpcoimgHolidayError.date}
                      </p>
                    )}
                  </div>
                </div>

                {/* Department Name */}
                <div className="flex flex-col lg:flex-row gap-1 justify-between">
                  <div className="flex flex-col">
                    <label
                      className="font-medium text-sm"
                      htmlFor="holiday reason"
                    >
                      HOLIDAY REASON
                    </label>
                    <p className="text-sm text-gray-500">Add Holiday Reason</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      id="holiday reason"
                      placeholder="Enter Holiday Reason"
                      className={`border-2 rounded-xl px-4  outline-none h-10 w-full md:w-96 `}
                      //    className={`border-2 rounded-xl px-4  outline-none h-10 w-full md:w-96 ${
                      //      !educationTouched.DepartmentName
                      //        ? "border-red-400"
                      //        : "border-gray-300"
                      //    }`}
                      //    onKeyUp={handleKeyUp}
                      value={holidayReason}
                      onChange={(e) => setHolidayReason(e.target.value)}
                    />
                    {editUpcoimgHolidayError.reason && (
                      <p className="text-red-500 text-sm">
                        {editUpcoimgHolidayError.reason}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
         </>
      )}
      <Footer />
    </div>
  );
};

export default Holidays_Mainbar;
