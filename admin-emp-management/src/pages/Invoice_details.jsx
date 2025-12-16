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
import { useDateUtils  } from "../hooks/useDateUtils";
import { createRoot } from "react-dom/client";


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

  console.log("roles", roles);

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
      const response = await axios.get(`${API_URL}/api/invoice/view-invoice`);
      console.log(response);
      if (response.data.success) {
        setClientdetails(response.data.data);
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

  // client name deatails

  //



  //   console.log("edit modal", roleDetails);

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
      data: "client",
    },
    {
      title: "Project",
      data: "project",
    },
    {
      title: "Invoice Number",
      data: "invoice_number",
    },

    {
      title: "Invoice Date",
      data: "invoice_date",
      render: function (data) {
        return formatDateTime(data);
      },
    },

    {
      title: "Status",
      data: "status",
      render: (data, type, row) => {
        const textColor =
          data === "0" ? "text-green-600 border rounded-full border-green-600" : data === "1" ? "text-orange-600 border rounded-full border-orange-600" : "text-red-600 border rounded-full border-red-600";
        return `<div class="${textColor}" style="display: inline-block; padding: 2px 10px; text-align: center; font-size: 12px; font-weight:500">
                  ${
                    data === "0" ? "Paid" : data === "1" ? "Pending" : "OverDue"
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
          if (container && !container.hasChildNodes()) {
             const root = createRoot(container); 
        root.render(
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
                    onClick={() => openEditModal(row)}
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
              container
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

        {/* Add Button */}
        <div className="flex justify-between mt-1 md:mt-4 mb-2 md:mb-3">
          <h1 className="text-2xl md:text-3xl font-semibold">Invoice List</h1>
          <button
            // onClick={openAddModal}
            onClick={()=> navigate("/invoice-full")}
            className="px-3 py-2 text-white bg-blue-500 hover:bg-blue-600 font-medium w-20 rounded-2xl"
          >
            Add
          </button>
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
    
      </div>

      <Footer />
    </div>
  );
};
export default Invoice_details;
