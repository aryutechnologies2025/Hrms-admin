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
const downloadPDF = (documents) => {
  if (!documents || documents.length === 0) return;

  const doc = documents[0];
  if (!doc.path) return;

  const url = `${API_URL}/api/uploads/clientInvoices/${doc.filename}`;

  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank"; 
  link.rel = "noopener noreferrer"; 

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
          data === "0" ? "text-green-600 border rounded-full border-green-600" : data === "1" ? "text-orange-600 border rounded-full border-orange-600" : "text-red-600 border rounded-full border-red-600";
        return `<div class="${textColor}" style="display: inline-block; padding: 2px 10px; text-align: center; font-size: 12px; font-weight:500">
                  ${data === "0" ? "Paid" : data === "1" ? "Pending" : "OverDue"
          }
                </div>`;
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
              <div
                className="cursor-pointer"
                onClick={() => downloadPDF(row.document)}
              >
                <FaFileDownload />
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
  





      </div>

      <Footer />
    </div>
  );
};
export default Client_invoice_details;
