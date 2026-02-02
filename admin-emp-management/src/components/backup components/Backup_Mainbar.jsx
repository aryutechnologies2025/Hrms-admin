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
import { useDateUtils } from "../../hooks/useDateUtils";
import { FaDownload } from "react-icons/fa";
const Backup_Mainbar = () => {
  const formatDateTime = useDateUtils();
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
      body: (_, options) => options.rowIndex + 1,
    },
    {
      field: "date",
      header: "Date",
      body: (rowData) => formatDateTime(rowData?.date),
    },
    {
      field: "type",
      header: "Type",
    },
    {
      field: "projectList.name",
      header: "Project",
      body: (rowData) => rowData?.projectList?.name || "-",
    },
    {
      field: "documents",
      header: "Documents",
      body: (rowData) =>
        rowData?.documents?.length
          ? rowData.documents.map((doc, i) => {
              // Format date folder
              const datePath = rowData?.date
                ? `/${new Date(rowData.date).toISOString().split("T")[0]}`
                : "";

              // Project folder
              const projectPath = rowData?.projectList?.name
                ? `/${rowData.projectList.name}`
                : "";

              // Folder type
              const folder = rowData.type === "db" ? "db" : "files";

              // Full URL using actual saved file path
              const href = `${API_URL}/api/uploads/backup${projectPath}/${folder}${datePath}/${doc.filepath}`;

              return (
                <div
                  key={i}
                  className="flex justify-center items-center w-full"
                >
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex justify-center items-center"
                  >
                    <FaDownload className="text-xl" />
                  </a>
                </div>
              );
            })
          : "-",
    },

    {
      field: "createdBy",
      header: "Created By",
      body: (rowData) => rowData?.createdBy?.employeeName || "-",
    },
    {
      header: "Action",
      body: (rowData) => (
        <div className="flex justify-center gap-2">
          <button
            className="px-1 rounded text-xl"
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

  // year
  const currentYear = new Date().getFullYear();

  // 🔹 generate years from 2020 → current year

  const [years, setYears] = useState(currentYear);

  useEffect(() => {
    try {
      setYears(new Date().getFullYear());
      axios.get(`${API_URL}/api/upcomingholiday/holidays/years`).then(
        (res) => {
          setYears(res.data.data || []);
        },
        [years],
      );
    } catch (error) {
      console.log(error);
    }
  }, []);
  //   const handleEditClick = async (rowData) => {
  //     setHolidayDate(rowData.date.split("T")[0]);
  //     setHolidayReason(rowData.reason);
  //     openEditHolidayModalOpen();
  //     setRowData(rowData);
  //   };

  const handleDeleteCLick = async (rowData) => {
    try {
      let response = await axios.delete(
        `${API_URL}/api/backup/delete-backup/${rowData._id}`,
        { withCredentials: true },
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

  //   const closeUpcomingHolidaysModalOpen = () => {
  //     setHolidayDate("");
  //     setHolidayReason("");
  //     setAddUpcoimgHolidayError("");
  //     setIsAnimating(false);
  //     setTimeout(() => setAddUpcomingHolidaysModalOpen(false), 250); // Delay to trigger animation
  //   };

  const openEditHolidayModalOpen = () => {
    setEditHolidayModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10); // Delay to trigger animation
  };

  const fetchHolidaysList = async () => {
    try {
      let response = await axios.get(`${API_URL}/api/backup/get-backup`, {
        withCredentials: true,
      });
      console.log("backup data", response.data.data);
      setHolidaysList(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidaysList();
  }, [years]);

  let navigate = useNavigate();
  return (
    <div className="flex flex-col justify-between overflow-x-hidden bg-gray-100 px-5 pt-2 md:pt-5 min-h-screen  w-screen">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            {/* breadcrumb */}
            <div className="cursor-pointer">
              <Mobile_Sidebar />
            </div>
            <div className="flex justify-end mt-2 md:mt-0 gap-1 items-center">
              <p
                className="text-sm text-gray-500"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </p>
              <p>{">"}</p>

              <p className="text-sm text-blue-500 ">Backup</p>
              <p>{">"}</p>
            </div>

            {/* Heading */}
            <div className="flex justify-between mt-8">
                <div>
                  <h1 className="text-3xl font-semibold">Backup Details</h1>
                </div>
              
              </div>
            <div className="w-full mx-auto relative">
              {/* Global Search Input */}
              <div className="mt-2 md:mt-8 flex md:justify-end">
                <InputText
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Search"
                  className="px-2 py-2 w-full md:w-fit rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
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
          </div>
        </>
      )}
      <Footer />
    </div>
  );
};

export default Backup_Mainbar;
