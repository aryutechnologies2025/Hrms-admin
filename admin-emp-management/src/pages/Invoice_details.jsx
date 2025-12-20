import React, { useState, useEffect, useRef } from "react";

import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
DataTable.use(DT);

import axios from "../api/axiosConfig";
import { API_URL } from "../config";
// import { capitalizeFirstLetter } from "../../StringCaps";
import { TfiPencilAlt } from "react-icons/tfi";
import { RiDeleteBin6Line } from "react-icons/ri";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";
import Footer from "../components/Footer";
import Mobile_Sidebar from "../components/Mobile_Sidebar";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FileUpload } from "primereact/fileupload";
import { MultiSelect } from "primereact/multiselect";
import { FaEye } from "react-icons/fa";
import { Editor } from "primereact/editor";
import { FaTrash } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { use } from "react";
import { useDateUtils } from "../hooks/useDateUtils";
import { createRoot } from "react-dom/client";

import { FaFileInvoice } from "react-icons/fa";



const Invoice_details = () => {
  const navigate = useNavigate();
  const formatDateTime = useDateUtils();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [roles, setRoles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Fetch roles from the API
  useEffect(() => {
    fetchProject();
  }, []);

  // console.log("roles", roles);

  const [projectname, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  //   const [status, setStatus] = useState("");
  const storedDetatis = localStorage.getItem("hrmsuser");
  const parsedDetails = JSON.parse(null);
  const userid = parsedDetails ? parsedDetails.id : null;
  const [errors, setErrors] = useState({});

  const [clientdetails, setClientdetails] = useState([]);
  // console.log("errors::", errors);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/invoice/view-invoice`,
        { withCredentials: true }
      );
      // console.log(response);
      if (response.data.success) {
        const formattedData = response.data.data.map(item => ({
          ...item,
          invoice_date: item.invoice_date
            ? formatDateTime(item.invoice_date)
            : "-"
        }));

        setClientdetails(formattedData);
      } else {
        setErrors("Failed to fetch roles.");
      }
    } catch (err) {
      setErrors("Failed to fetch roles.");
    }
  };

  // Open and close modals
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };


  // edit page id passing
  const handleEdit = (row) => {
    navigate("/invoice-edit", {
      state: { rowData: row }
    });
  };



  //   console.log("edit modal", roleDetails);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  // console.log("selectedInvoiceId", selectedInvoiceId);


  const [isOpenClient, setIsOpenClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [checkedDocs, setCheckedDocs] = useState([]);

  const handleDocCheck = (docId) => {
    setCheckedDocs((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    );
  };

  useEffect(() => {
    if (selectedClient?.documents?.length > 0) {
      const preSelected = selectedClient.documents
        .filter((doc) => doc.select === true)
        .map((doc) => doc._id);

      setCheckedDocs(preSelected);
    }
  }, [selectedClient]);



  // console.log("checkedDocs", checkedDocs);




  const handlesubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Saving Selection",
      text: "Please wait while we update the invoice documents...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      background: "#ffffff",
      color: "#111827",
    });
    try {
      const formData = {
        invoiceId: selectedClient?._id,
        documentId: checkedDocs,

      };


      const response = await axios.post(
        `${API_URL}/api/invoice/select-invoice-document`,
        formData, { withCredentials: true }
      );

       Swal.fire({
      icon: "success",
      title: "Saved Successfully",
      text: "Invoice documents have been updated.",
      confirmButtonColor: "#2563EB",
      background: "#ffffff",
    }).then(() => {
      setIsOpenClient(false);
    });



      setErrors({});
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          err.response?.data?.message ||
          "Something went wrong. Please try again.",
        confirmButtonColor: "#DC2626",
        background: "#ffffff",
        color: "#111827",
      });

      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error("Error submitting form:", err);

      }
    }
  };


  const items = [
    { title: "Sales Invoice", path: "/invoice-sales" },
    { title: "Performa Invoice", path: "/invoice-performa" },
    { title: "Export Invoice", path: "/invoice-export" },
    { title: "Tax Invoice", path: "/invoice-pdf" },
  ];
const [clientFilter, setClientFilter] = useState("");
const [projectFilter, setProjectFilter] = useState("");
const [statusFilter, setStatusFilter] = useState("");


  const columns = [
    {
      title: "Sno",
      data: null,
      render: function (data, type, row, meta) {
        return meta.row + 1;
      },
    },

    {
      title: "Client Name",
      data: "clientId",
      render: (data) => data?.client_name || "-"
    },

    {
      title: "Project",
      data: "project",
      render: (data) => data?.name || "-"

    },
    {
      title: "Invoice Number",
      data: "invoice_number",
    },

    // {
    //   title: "Invoice Date",
    //   data: "invoice_date",
    //   render: function (data) {
    //     return formatDateTime(data);
    //   },
    // },
    {
      title: "Invoice Date",
      data: "invoice_date",
      // render: (data) => data ? formatDateTime(data) : "-"
    },

    {
      title: "Due Date",
      data: "due_date",
      render: (data) => data ? formatDateTime(data) : "-"
    },

    {
      title: "Paid Date",
      data: "paid_date",
      render: (data) => data ? formatDateTime(data) : "-"
    },

    {
      title: "Status",
      data: "status",
      render: (data, type, row) => {
        const textColor =
          data === "0" ? "text-green-600 border rounded-full border-green-600" : data === "1" ? "text-orange-600 border rounded-full border-orange-600" : "text-red-600 border rounded-full border-red-600";
        return `<div class="${textColor}" style="display: inline-block; padding: 2px 10px; text-align: center; font-size: 12px; font-weight:500">
                  ${data === "0" ? "Paid" : data === "1" ? "Pending" : "OverDue"
          }
                </div>`;
      },
    },

    {
      title: "Client View",
      data: null,
      render: (data, type, row) => {
        const id = `actions-${row.sno || Math.random()}`;
        setTimeout(() => {
          const container = document.getElementById(id);
          if (container) {
            if (!container._root) {
              container._root = createRoot(container);
            }

            container._root.render(
              <div
                className="action-container"
                style={{
                  display: "flex",
                  gap: "15px",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <div className="cursor-pointer">
                  <FaFileInvoice
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedClient(row);
                      setIsOpenClient(true);
                    }}
                  />

                </div>


                {/* <div className="modula-icon-del" style={{
                  color: "red"
                }}>
                  <RiDeleteBin6Line
                    onClick={() => handleDelete(row.id)}
                  />
                </div> */}
              </div>,
              // container
            );
          }
        }, 0);
        return `<div id="${id}"></div>`;
      },
    },

    {
      title: "Action",
      data: null,
      render: (data, type, row) => {
        const id = `actions-${row.sno || Math.random()}`;
        setTimeout(() => {
          const container = document.getElementById(id);
          if (container) {
            if (!container._root) {
              container._root = createRoot(container);
            }

            container._root.render(
              <div
                className="action-container"
                style={{
                  display: "flex",
                  gap: "15px",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <div className="cursor-pointer">
                  <FaEye
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedInvoiceId(row);
                      setIsOpen(true);
                    }}
                  />

                </div>
                <div
                  className="modula-icon-edit  flex gap-2"
                  style={{
                    color: "#000",
                  }}
                >
                  <TfiPencilAlt
                    className="cursor-pointer"
                    onClick={() => handleEdit(row)}
                  />
                  <MdOutlineDeleteOutline
                    className="text-red-600 text-xl cursor-pointer"
                    onClick={() => handleDelete(row._id)}
                  />
                </div>

                {/* <div className="modula-icon-del" style={{
                  color: "red"
                }}>
                  <RiDeleteBin6Line
                    onClick={() => handleDelete(row.id)}
                  />
                </div> */}
              </div>,
              // container
            );
          }
        }, 0);
        return `<div id="${id}"></div>`;
      },
    },
  ];

  const handleDelete = async (id) => {
    // console.log("editid", id);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this Invoice?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.post(
          `${API_URL}/api/invoice/delete-invoice/${id}`,
          { withCredentials: true }
        );
        Swal.fire("Deleted!", "The Invoice has been deleted.", "success");
        // console.log("res", res);
        // setNotedetails((prev) => prev.filter((item) => item._id !== _id));
        // fetchProject();
        fetchProject();

      } catch (err) {
        console.error("Failed to delete:", err);
        Swal.fire("Error", "There was an error deleting the Invoice.", "error");
      }
    } else {
      Swal.fire("Cancelled", "Your Invoice is safe :)", "info");
    }
  };


  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-2 md:pt-10">
      <div>


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

          <p className="text-sm text-blue-500">Invoice List</p>
        </div>

        {/* Add Button */}
        <div className="flex justify-between mt-1 md:mt-4 mb-2 md:mb-3">
          <h1 className="text-2xl md:text-3xl font-semibold">Invoice List</h1>
          <button
            // onClick={openAddModal}
            onClick={() => navigate("/invoice-full")}
            className="px-3 py-2 text-white bg-blue-500 hover:bg-blue-600 font-medium w-20 rounded-2xl"
          >
            Add
          </button>
        </div>

 <div className="flex flex-wrap gap-6 mb-6 items-end">
  {/* Client Filter */}
  <div className="flex flex-col">
    <label className="text-sm font-semibold mb-1 text-gray-700">Client</label>
    <select
      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48"
      value={clientFilter}
      onChange={(e) => setClientFilter(e.target.value)}
    >
      <option value="">All Clients</option>
      {/* {clientsList.map((c) => (
        <option key={c._id} value={c.client_name}>
          {c.client_name}
        </option>
      ))} */}
    </select>
  </div>

  {/* Project Filter */}
  <div className="flex flex-col">
    <label className="text-sm font-semibold mb-1 text-gray-700">Project</label>
    <select
      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48"
      value={projectFilter}
      onChange={(e) => setProjectFilter(e.target.value)}
    >
      <option value="">All Projects</option>
      {/* {projectsList.map((p) => (
        <option key={p._id} value={p.name}>
          {p.name}
        </option>
      ))} */}
    </select>
  </div>

  {/* Status Filter */}
  <div className="flex flex-col">
    <label className="text-sm font-semibold mb-1 text-gray-700">Status</label>
    <select
      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-40"
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <option value="">All</option>
      <option value="Paid">Paid</option>
      <option value="Pending">Pending</option>
      <option value="OverDue">OverDue</option>
    </select>
  </div>

  {/* Buttons */}
  <div className="flex gap-2 mt-5">
    <button
      // onClick={handleFilterSubmit}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium shadow"
    >
      Submit
    </button>
    <button
      // onClick={handleReset}
      className="border  px-6 py-2 rounded-lg hover:bg-gray-400 bg-gray-500 text-white text-sm font-medium"
    >
      Reset
    </button>
  </div>
</div>



        <div className="datatable-container">
          {/* Responsive wrapper for the table */}
          <div className="table-scroll-container" id="datatable">
            <DataTable
              data={clientdetails}
              columns={columns}
              options={{
                paging: true,
                searching: true,
                ordering: true,
                scrollX: true,
                responsive: true,
                autoWidth: false,
              }}
              className="display nowrap bg-white"
            />
          </div>
        </div>
        {/* {isOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <div className="bg-white p-6 rounded-xl w-96 relative">
              <button
                className="absolute top-3 right-3 text-gray-500"
                onClick={() => setIsOpen(false)}
              >
                ✖
              </button>

              <h2 className="text-xl font-semibold mb-4">Details</h2>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border p-2 rounded-md"
                  >
                    <span>{item.title}</span>
                    <FaEye
                      className="cursor-pointer text-blue-600"
                      onClick={() => {
                navigate(item.path, {
                  state: { invoiceId: selectedInvoiceId._id } 
                });
                      }}
                    />
                  </div>
                ))}
              </div>

            </div>
          </div>
        )} */}

        {isOpenClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
            <div className="bg-white rounded-2xl  shadow-2xl w-[25%] p-6 relative overflow-y-auto max-h-[90vh]">

              {/* Close button */}
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl transition"
                onClick={() => setIsOpenClient(false)}
              >
                ✖
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Client Summary
                </h2>
              </div>

              {/* Documents */}
              <div className="space-y-3">
                {selectedClient?.documents?.length > 0 ? (
                  selectedClient.documents.map((doc) => (
                    <label
                      key={doc._id}
                      className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={checkedDocs.includes(doc._id)}
                        onChange={() => handleDocCheck(doc._id)}
                        className="w-4 h-4"
                      />

                      <span className="text-gray-700 font-medium">
                        {doc.invoice_document_type}
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="text-gray-400 text-center">No documents available</p>
                )}
              </div>
              <button
                onClick={handlesubmit}
                className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Submit
              </button>





            </div>
          </div>
        )}


        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-[50%] p-6 relative overflow-y-auto max-h-[90vh]">

              {/* Close button */}
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl transition"
                onClick={() => setIsOpen(false)}
              >
                ✖
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Invoice Summary</h2>
                {/* <p className="text-gray-500 mt-1 text-sm">Quick overview of invoice details</p> */}
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Client</span>
                  <span className="text-gray-900 font-semibold">{selectedInvoiceId.clientId.client_name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Project</span>
                  <span className="text-gray-900 font-semibold">{selectedInvoiceId.project.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Invoice #</span>
                  <span className="text-gray-900 font-semibold">{selectedInvoiceId.invoice_number}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Status</span>
                  <span className={`font-semibold ${selectedInvoiceId.status === "0" ? "text-green-600" : selectedInvoiceId.status === "1" ? "text-yellow-600" : "text-red-600"}`}>
                    {selectedInvoiceId.status === "0" ? "Paid" : selectedInvoiceId.status === "1" ? "Pending" : "OverDue"}
                  </span>

                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Invoice Date</span>
                  <span className="text-gray-900 font-semibold">{selectedInvoiceId.invoice_date}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Due Date</span>
                  <span className="text-gray-900 font-semibold">{formatDateTime(selectedInvoiceId.due_date)}</span>
                </div>
              </div>

              {/* Items List */}
              <h3 className="text-gray-700 font-semibold mb-3">Invoice Types</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium cursor-pointer hover:bg-blue-200 transition"
                    onClick={() =>
                      navigate(item.path, { state: { invoiceId: selectedInvoiceId._id } })
                    }
                  >
                    {item.title}
                    <FaEye className="text-blue-500 text-xs" />
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}





      </div>

      <Footer />
    </div>
  );
};
export default Invoice_details;
