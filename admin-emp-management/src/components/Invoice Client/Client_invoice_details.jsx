import React, { useState, useEffect, useRef } from "react";

import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
DataTable.use(DT);
import { FaFileDownload } from "react-icons/fa";

import axios from "../../api/axiosConfig";
import { API_URL } from "../../config";
// import { capitalizeFirstLetter } from "../../StringCaps";
import { TfiPencilAlt } from "react-icons/tfi";
import { RiDeleteBin6Line } from "react-icons/ri";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";
import Footer from "../../components/Footer";
import Mobile_Sidebar from "../../components/Mobile_Sidebar";
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
import { useDateUtils } from "../../hooks/useDateUtils";
import { createRoot } from "react-dom/client";


const Client_invoice_details = () => {
  const navigate = useNavigate();
  const formatDateTime = useDateUtils();

  const storedDetails = localStorage.getItem("hrmsuser");
  const parsedDetails = storedDetails ? JSON.parse(storedDetails) : null;
  let user = parsedDetails ? parsedDetails : null;

  const userid = user ? user._id : null;

  //   console.log("user", userid);

  // Fetch roles from the API
  useEffect(() => {
    fetchProject();
  }, []);

  // console.log("roles", roles);




  const [errors, setErrors] = useState({});

  const [clientdetails, setClientdetails] = useState([]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/invoice/client-invoice-dashboard`,
        {
          params: { clientId: userid }
        },
        { withCredentials: true }
      );
      console.log(response);
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

  //   download PDF

  // const downloadPDF = (document) => {

  //     console.log("document", document);

  //   if (!document) return;
  // //   const link = document.createElement("a");
  //   link.href = `${API_URL}/api/uploads/clientInvoices/${document.filename}`; 
  //   link.download = document.originalName || "invoice.pdf";
  //   link.click();
  // };


  // const downloadPDF = (documents) => {
  //   if (!documents || documents.length === 0) return;

  //   const doc = documents[0];
  //   if (!doc.path) return; 


  // //   const url = `${API_URL}/api/uploads/clientInvoices/${doc.filename}`;

  //   const url = `http://192.168.0.110:5009/api/uploads/clientInvoices/${doc.filename}`;


  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = doc.originalName || "document.pdf";
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };
  // const downloadPDF = (documents) => {
  //   if (!documents || documents.length === 0) return;

  //   const doc = documents[0];
  //   if (!doc.path) return;

  //   const url = `${API_URL}/api/uploads/clientInvoices/${doc.filename}`;

  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.target = "_blank";
  //   link.rel = "noopener noreferrer";

  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };
const downloadPDF = (doc) => {

  // console.log("doc", doc);
  if (!doc || !doc.path) return;



  const url = `${API_URL}/api/uploads/clientInvoices/${doc.filename}`;

  const link = document.createElement("a");
  link.href = url;
  link.download = doc.originalName || "invoice.pdf";
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  const [isOpenClient, setIsOpenClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const handleOpenClientPopup = (documents) => {
    setSelectedClient({ documents });
    setIsOpenClient(true);
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
      title: "Client Name",
      data: "clientName",
      //   render: (data) => data?.client_name || "-"
    },

    {
      title: "Project",
      data: "projectName",

    },
    {
      title: "Invoice Number",
      data: "invoiceNumber",
      render: (data) => data ? (data) : "-"

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
      data: "invoiceDate",
      render: (data) => data ? formatDateTime(data) : "-"
    },

    {
      title: "Due Date",
      data: "due",
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
          data === "paid" ? "text-green-600 border rounded-full border-green-600" : data === "pending" ? "text-orange-600 border rounded-full border-orange-600" : "text-red-600 border rounded-full border-red-600";
        return `<div class="${textColor}" style="display: inline-block; padding: 2px 10px; text-align: center; font-size: 12px; font-weight:500">
                  ${data === "paid" ? "Paid" : data === "pending" ? "Pending" : "OverDue"
          }
                </div>`;
      },
    },

    {
      title: "Invoice View",
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
                <div
                  className="cursor-pointer"
                  title="View Invoice"
                  onClick={() => handleOpenClientPopup(row.document)}
                >
                  <FaEye />
                </div>
              </div>
            );
          }
        }, 0);
        return `<div id="${id}"></div>`;
      },
    },
  ];



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
      

{isOpenClient && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-[25%] p-6 relative max-h-[90vh] overflow-y-auto">

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
          Client Invoices
        </h2>
      </div>

      {/* Documents */}
      <div className="space-y-3">
        {selectedClient?.documents?.length > 0 ? (
          selectedClient.documents.map((doc, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
            >
              {/* Invoice Name */}
              <span className="text-gray-700 font-medium">
                {doc.invoice_document_type}
              </span>

              {/* Download Icon */}
              <button
                onClick={() => downloadPDF(doc)}
                className="text-blue-600 hover:text-blue-800 transition"
                title="Download Invoice"
              >
                <FaFileDownload />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">
            No documents available
          </p>
        )}
      </div>
    </div>
  </div>
)}






      </div>

      <Footer />
    </div>
  );
};
export default Client_invoice_details;
