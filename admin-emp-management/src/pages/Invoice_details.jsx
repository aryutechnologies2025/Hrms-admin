import React, { useState, useEffect, useRef, useMemo } from "react";

import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
DataTable.use(DT);
import { IoClose } from "react-icons/io5";
import { FaFileDownload } from "react-icons/fa";

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
import { FaMoneyCheckAlt } from "react-icons/fa";

import { FaFileInvoice } from "react-icons/fa";
import { capitalizeFirstLetter } from "../utils/StringCaps";

import { useSearchParams } from "react-router-dom";
import Sales_invoice from "../components/invoice desgins/Sales_invoice";
import Export_invoice from "../components/invoice desgins/Export_invoice";
import Performa_invoice from "../components/invoice desgins/Performa_invoice";
import Invoice from "../components/invoice desgins/Invoice_download";
import Loader from "../components/Loader";


// customize table

// import { MultiSelect } from "primereact/multiselect";


const Invoice_details = () => {
  const navigate = useNavigate();
  const formatDateTime = useDateUtils();


  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [roles, setRoles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const [submittedClient, setSubmittedClient] = useState("");
  const [submittedProject, setSubmittedProject] = useState("");

  // console.log("submittedClient", submittedClient, "submittedProject", submittedProject);

  // Fetch roles from the API
  // useEffect(() => {
  //   fetchProject();
  // }, []);


  //   useEffect(() => {
  //   if (clientFilter || projectFilter || statusFilter) {
  //     fetchProject();
  //   }
  //   // eslint-disable-next-line
  // }, []);

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
  const [clientOption, setClientOption] = useState(null);
  // console.log("clientOption", clientOption);
  const [projectOption, setProjectOption] = useState(null);





  const [searchParams, setSearchParams] = useSearchParams();




  const [clientFilter, setClientFilter] = useState(searchParams.get("client") || "");

  const [projectFilter, setProjectFilter] = useState(searchParams.get("project") || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");



  useEffect(() => {
    fetchClientList();
  }, []);

  useEffect(() => {
    if (clientFilter) {
      fetchaProjectList(clientFilter);
    }
  }, [clientFilter]);


  useEffect(() => {
    const client = searchParams.get("client");
    const project = searchParams.get("project");
    const status = searchParams.get("status");

    if (client || project || status) {
      // Back / Refresh → filtered data
      fetchProject(client, project, status);
    } else {
      // First load → all data
      fetchAllProjects();
    }
  }, []);

  // useEffect(()=>{
  //   fetchProject();
  // },[])

  const handleClosePopup = async () => {
    setIsOpen(false);

    await fetchProject();
  };

  const handleSubmit = () => {
    // Set submitted labels separately
    setSubmittedClient(clientOption.find(c => c.value === clientFilter)?.label || "");
    setSubmittedProject(projectOption.find(p => p.value === projectFilter)?.label || "");

    fetchProject(clientFilter, projectFilter, statusFilter);
  };


  const fetchClientList = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/client/view-clientdetails`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const clientOptions = response.data.data.map(emp => ({

        label: emp.client_name,
        value: emp._id,
      }));

      setClientOption(clientOptions);

    } catch (error) {
      console.log(error);
    }
  };

  const fetchaProjectList = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/invoice/get-project-name-with-client`,
        {
          params: {
            project: clientFilter,
          },
          // headers: {
          //   Authorization: `Bearer ${localStorage.getItem("token")}`,
          // },

        }
      );

      console.log("response", response)

      const ProjectOptions = response.data.data.map(emp => ({

        label: emp.name,
        value: emp._id,
      }));

      setProjectOption(ProjectOptions);

      // const clientName = response.data.data.map((emp) => emp.name);
      // // console.log("client name", clientName);
      // setProjectOption(clientName);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllProjects = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/invoice/view-invoice`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setClientdetails(response.data.data);
      }
    } catch (err) {
      setErrors("Failed to fetch invoices.");
    }
  };


  const fetchProject = async (
    client = clientFilter,
    project = projectFilter,
    status = statusFilter
  ) => {

    setSearchParams({
      client: client || "",
      project: project || "",
      status: status || "",
    });

    try {
      const response = await axios.get(
        `${API_URL}/api/invoice/view-invoice`,
        {
          params: { client, project, status },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setClientdetails(response.data.data);
        setLoading(false);

      }

    } catch (err) {
      setErrors("Failed to fetch invoices.");
      setLoading(false);

    }
  };


  const handleReset = async () => {
    try {
      // Clear filters
      setClientFilter(null);
      setProjectFilter(null);
      setStatusFilter("");
      setSearchParams({});

      // Fetch all data without filters
      const response = await axios.get(
        `${API_URL}/api/invoice/view-invoice`,
        { withCredentials: true }
      );

      if (response.data.success) {
        const formattedData = response.data.data.map(item => ({
          ...item,
          invoice_date: item.invoice_date
            ? formatDateTime(item.invoice_date)
            : "-"
        }));

        setClientdetails(formattedData);
      }
    } catch (err) {
      setErrors("Failed to reset table data.");
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
  // const handleEdit = (row) => {
  //   navigate("/invoice-edit", {
  //     state: { rowData: row }
  //   });
  // };
  const handleEdit = (row) => {
    navigate(
      `/invoice-edit?client=${clientFilter || ""}&project=${projectFilter || ""}&status=${statusFilter || ""}`,
      {
        state: { rowData: row }
      }
    );
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

  // const handleClosePopup = () => {
  //   setIsOpen(false);
  //    await fetchProject(); 
  // };

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





  const [selectedInvoiceTitle, setSelectedInvoiceTitle] = useState(null);


  const items = [
    { title: "Sales Invoice" },
    { title: "Performa Invoice" },
    { title: "Export Invoice" },
    { title: "Tax Invoice" },
  ];



  const invoiceComponents = {
    "Sales Invoice": Sales_invoice,
    "Performa Invoice": Performa_invoice,
    "Export Invoice": Export_invoice,
    "Tax Invoice": Invoice,
  };

  const invoiceRef = useRef();

  const handleDownload = (title) => {
    setSelectedInvoiceTitle(title);

    // wait for render
    setTimeout(() => {
      if (invoiceRef.current?.downloadPDF) {
        invoiceRef.current.downloadPDF();
      }
    }, 50);
  };

  const CurrentInvoiceComponent = selectedInvoiceTitle
    ? invoiceComponents[selectedInvoiceTitle]
    : null;

  const [paymentVisible, setPaymentVisible] = useState(false);
  const [selectedPayments, setSelectedPayments] = useState([]);

  const [paymentVisible1, setPaymentVisible1] = useState(false);
  const [selectedPayments1, setSelectedPayments1] = useState([]);
  // console.log("selectedPayments", selectedPayments);

  const [isOpeninvoice, setIsOpeninvoice] = useState(false);
  const [selectedinvoice, setSelectedinvoice] = useState(null);


  const handleOpeninvoicePopup = (documents) => {
    // console.log("documents", documents);
    setSelectedinvoice({ documents });
    setIsOpeninvoice(true);
  };

  // const downloadPDF = (doc) => {

  //   // console.log("doc", doc);
  //   if (!doc || !doc.path) return;



  //   const url = `${API_URL}/api/uploads/clientInvoices/${doc.filename}`;

  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = doc.originalName || "invoice.pdf";
  //   link.target = "_blank";
  //   link.rel = "noopener noreferrer";

  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };


  const downloadPDF = async (doc) => {
    if (!doc || !doc.path) return;

    const url = `${API_URL}/api/uploads/clientInvoices/${doc.filename}`;

    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = doc.originalName || "invoice.pdf";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  const downloadPDFOpen = (doc) => {
    if (!doc || !doc.path) return;

    const url = `${API_URL}/api/uploads/clientInvoices/${doc.filename}`;

    // Open in new tab
    window.open(url, "_blank", "noopener,noreferrer");
  };




  const columns = [
    {
      key: "sno",
      title: "Sno",
      data: null,
      render: function (data, type, row, meta) {
        return meta.row + 1;
      },
    },

    {
      key: "client",
      title: "Client Name",
      data: "clientId",
      render: (data) => data?.client_name || "-"
    },

    {
      key: "project",
      title: "Project",
      data: "project",
      render: (data) => data?.name || "-"

    },
    {
      key: "invoice_no",
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
      key: "invoice_date",
      title: "Invoice Date",
      data: "invoice_date",
      render: (data) => data ? formatDateTime(data) : "-"


    },

    {
      key: "due_date",
      title: "Due Date",
      data: "due_date",
      render: (data) => data ? formatDateTime(data) : "-"
    },

    // {
    //   title: "Paid Date",
    //   data: "paid_date",
    //   render: (data) => data ? formatDateTime(data) : "-"
    // },

    // {
    //   title: "Payment",
    //   data: null,
    //   render: (payments, type, row) => {
    //     const id = `payments-${row.sno || Math.random()}`;

    //     setTimeout(() => {
    //       const container = document.getElementById(id);
    //       if (container) {
    //         if (!container._root) {
    //           container._root = createRoot(container);
    //         }
    //         container._root.render(
    //           <div
    //             style={{
    //               display: "flex",
    //               justifyContent: "center",
    //               alignItems: "center",
    //             }}
    //           >
    //             <FaMoneyCheckAlt
    //               className="cursor-pointer text-black text-xl"
    //               title="View Payments"
    //               onClick={() => {
    //                 setSelectedPayments(row || []);
    //                 setPaymentVisible(true);
    //               }}
    //             />
    //           </div>,

    //         );
    //       }
    //     }, 0);

    //     return `<div id="${id}"></div>`;
    //   },
    // },

    {
      key: "total",
      title: "Total Amount",
      data: "total_amount", // if value directly exists
      render: (totalAmount, type, row) => {
        const id = `payments-${row.sno || Math.random()}`;

        setTimeout(() => {
          const container = document.getElementById(id);
          if (container) {
            if (!container._root) {
              container._root = createRoot(container);
            }

            container._root.render(
              <span
                className=""
                title="View Payments"
                // onClick={() => {
                //   setSelectedPayments1(row || []);
                //   setPaymentVisible1(true);
                // }}
              >
                {/* ₹{totalAmount ?? 0} */}
                 ₹{Number(totalAmount ?? 0).toLocaleString("en-IN", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})}
              </span>
            );
          }
        }, 0);

        return `<div id="${id}"></div>`;
      },
    },


    // balance
    {
      key: "received",
      title: "Received Amount",
      data: "totalPaymentAmount", // if value directly exists
      render: (totalPaymentAmount, type, row) => {
        const id = `payments-${row.sno || Math.random()}`;

        setTimeout(() => {
          const container = document.getElementById(id);
          if (container) {
            if (!container._root) {
              container._root = createRoot(container);
            }

            container._root.render(
              <span
                className="cursor-pointer   hover:underline"
                title="View Payments"
                onClick={() => {
                  setSelectedPayments(row || []);
                  setPaymentVisible(true);
                }}
              >
                {/* ₹{totalPaymentAmount ?? 0} */}
                 ₹{Number(totalPaymentAmount ?? 0).toLocaleString("en-IN", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})}
              </span>
            );
          }
        }, 0);

        return `<div id="${id}"></div>`;
      },
    },

    {
      key: "balance",
      title: "Balance Amount",
      data: "balance", // if value directly exists
      render: (balance, type, row) => {
        const id = `payments-${row.sno || Math.random()}`;

        setTimeout(() => {
          const container = document.getElementById(id);
          if (container) {
            if (!container._root) {
              container._root = createRoot(container);
            }

            container._root.render(
              <span
                className="cursor-pointer   hover:underline"
                title="View Payments"
                onClick={() => {
                  setSelectedPayments(row || []);
                  setPaymentVisible(true);
                }}
              >
                {/* ₹{balance ?? 0} */}
                ₹{Number(balance ?? 0).toLocaleString("en-IN", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})}
              </span>
            );
          }
        }, 0);

        return `<div id="${id}"></div>`;
      },
    },

    {
      key: "status",
      title: "Status",
      data: "status",
      render: capitalizeFirstLetter
      // render: (data) => data === "paid" ? "Paid" : data === "pending" ? "Pending" : "OverDue"
      // title: "Status",
      // data: "status",
      // render: (data, type, row) => {
      //   const textColor =
      //     data === "paid" ? "text-green-600 border rounded-full border-green-600" : data === "pending" ? "text-orange-600 border rounded-full border-orange-600" : "text-red-600 border rounded-full border-red-600";
      //   return `<div class="${textColor}" style="display: inline-block; padding: 2px 10px; text-align: center; font-size: 12px; font-weight:500">
      //             ${data === "paid" ? "Paid" : data === "pending" ? "Pending" : "OverDue"
      //     }
      //           </div>`;
      // },
    },

    {
      key: "invoice",
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
                  onClick={() => handleOpeninvoicePopup(row.documents
                  )}
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

    {
      key: "clientView",
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
      key: "action",
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





  // const normalize = (val) =>
  //   typeof val === "string" ? val.trim() : val;

  // const isFilterApplied =
  //   Boolean(normalize(clientFilter)) ||
  //   Boolean(normalize(projectFilter)) ||
  //   Boolean(normalize(statusFilter));


  //   console.log("isFilterApplied", isFilterApplied);

  // const activeColumns = useMemo(() => (isFilterApplied ? columnsfilter : columns), [isFilterApplied]);

  // Force DataTable re-mount whenever filters change
  // const tableKey = `${clientFilter}-${projectFilter}-${statusFilter}-${isFilterApplied}`;


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
  const [showDropdown, setShowDropdown] = useState(false);
  // const [visibleCols, setVisibleCols] = useState(
  //     columns.reduce((acc, col) => ({ ...acc, [col.key]: true }), {})
  //   );
  const [visibleCols, setVisibleCols] = useState({
    sno: true,
    client: false,
    project: false,
    invoice_no: true,
    invoice_date: true,
    due_date: true,
    total: true,
    received: true,
    balance: true,
    status: true,
    invoice: true,
    clientView: true,
    action: true,
  });

  const filteredColumns = useMemo(() => {
    return columns.filter(col => visibleCols[col.key]);
  }, [visibleCols]);

  // Table force refresh
  const [tableKey, setTableKey] = useState(0);
  const handleToggleColumn = (key) => {
    setVisibleCols(prev => ({ ...prev, [key]: !prev[key] }));
    setTableKey(prev => prev + 1); // 🔥 Force DataTable remount
  };

  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-2 md:pt-10 overflow-x-auto">
      {/* {loading ? (
        <Loader />
      ) : (
        <> */}


      <div className="cursor-pointer">
        <Mobile_Sidebar />


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
            <Dropdown
              value={clientFilter}
              onChange={(e) => setClientFilter(e.value)}
              options={clientOption}
              filter
              optionLabel="label"
              placeholder="Select a Client"
              className="w-[300px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Project Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1 text-gray-700">Project</label>
            <Dropdown
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.value)}
              options={projectOption}
              filter
              optionLabel="label"
              placeholder="Select a Project"
              className="w-[300px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1 text-gray-700">Status</label>
            <select
              className="border w-[300px] border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="invoice_raised">Invoice Raised</option>

              <option value="advance_pending">Advance Pending</option>
              <option value="advance_received">Advance Received</option>
              <option value="partial_payment_pending">
                Partial Payment Pending
              </option>
              <option value="partial_payment_received">
                Partial Payment Received
              </option>
              <option value="final_payment_pending">
                Final payment Pending
              </option>


              <option value="completed">Completed</option>
               <option value="TDS">TDS</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-5">
            <button
              onClick={handleSubmit}

              // onClick={() => fetchProject()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium shadow"
            >
              Submit
            </button>
            <button
              onClick={handleReset}
              className="border  px-6 py-2 rounded-lg hover:bg-gray-400 bg-gray-500 text-white text-sm font-medium"
            >
              Reset
            </button>
          </div>
        </div>

        {/*        
        <div className="relative inline-block mb-3" ref={dropdownRef}>
          <button
            className="px-4 py-2 border rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Columns ⬇
          </button>

          {showDropdown && (
            <div className="absolute z-20 mt-2 w-60 bg-white border border-blue-500 rounded-lg shadow-lg p-3 transition-all duration-300">
              <h3 className="text-blue-600 font-semibold mb-2 text-sm">Toggle Columns</h3>
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                {columns.map((col) => (
                  <label
                    key={col.key}
                    className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 rounded px-2 py-1 transition-colors duration-150"
                  >
                    <input
                      type="checkbox"
                      checked={visibleCols[col.key]}
                      onChange={() => handleToggleColumn(col.key)}
                      className="accent-blue-600 w-4 h-4"
                    />
                    <span className="text-gray-700 text-sm">{col.title}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div> */}


        <div className="flex flex-wrap items-center gap-4 ">
          {/* Client Badge */}
          {submittedClient && (
            <div className="text-black px-6 py-3 rounded-xl shadow font-semibold text-lg bg-white">
              Client: {submittedClient}
            </div>
          )}

          {/* Project Badge */}
          {submittedProject && (
            <div className="text-black px-6 py-3 rounded-xl shadow font-semibold text-lg bg-white">
              Project: {submittedProject}
            </div>
          )}

          {/* Column Dropdown */}
          <div className="relative inline-block" ref={dropdownRef}>
            <button
              className="px-4 py-2 border rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Columns ⬇
            </button>

            {showDropdown && (
              <div className="absolute z-20 mt-2 w-60 bg-white border border-blue-500 rounded-lg shadow-lg p-3 transition-all duration-300">
                <h3 className="text-blue-600 font-semibold mb-2 text-sm">Toggle Columns</h3>
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                  {columns.map((col) => (
                    <label
                      key={col.key}
                      className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 rounded px-2 py-1 transition-colors duration-150"
                    >
                      <input
                        type="checkbox"
                        checked={visibleCols[col.key]}
                        onChange={() => handleToggleColumn(col.key)}
                        className="accent-blue-600 w-4 h-4"
                      />
                      <span className="text-gray-700 text-sm">{col.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>


        <div className="datatable-container">
          {/* Responsive wrapper for the table */}
          <div className="table-scroll-container" id="datatable">
            <DataTable
              // key={tableKey}
              key={tableKey}
              data={clientdetails}
              // columns={columns}
              columns={filteredColumns}

              // columns={activeColumns}

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
            <div className="bg-white rounded-2xl  shadow-2xl w-[100%] md:w-[25%] p-6 relative overflow-y-auto max-h-[90vh]">

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
                  Client Invoice
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
                Show Client
              </button>





            </div>
          </div>
        )}


        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-[100%] md:w-[50%] p-6 relative overflow-y-auto max-h-[90vh]">

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
                  <span className="text-gray-900 font-semibold">{capitalizeFirstLetter(selectedInvoiceId.status)}</span>


                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Invoice Date</span>
                  <span className="text-gray-900 font-semibold">{formatDateTime(selectedInvoiceId.invoice_date)}</span>
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
                    className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium cursor-pointer
               bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all duration-200
               shadow-sm"
                    onClick={() => handleDownload(item.title)}
                  >
                    {item.title}
                    <FaEye className="text-blue-600 text-xs" />
                  </div>
                ))}

              </div>

            </div>
            {CurrentInvoiceComponent && (
              <div style={{
                position: "absolute",
                top: "-9999px",
                left: "-9999px",
                width: "210mm",
                background: "#fff"
              }}>
                <CurrentInvoiceComponent
                  ref={invoiceRef}
                  invoiceId={selectedInvoiceId._id}
                  onSuccess={handleClosePopup}
                />
              </div>
            )}
          </div>
        )}

        {paymentVisible && (
          <div
            onClick={() => setPaymentVisible(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-blue-600">
                <h2 className="text-2xl font-semibold text-white">
                  Payment Details
                </h2>
                <button
                  onClick={() => setPaymentVisible(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition"
                >
                  <IoClose className="text-xl" />
                </button>
              </div>
              <div className="grid grid-cols-3 divide-x divide-gray-200 text-center bg-gray-50">
                <div className="p-4">
                  <p className="text-xs uppercase text-gray-500">Amount</p>
                  <p className="mt-1 text-lg font-semibold text-gray-800">

                    ₹{Number(selectedPayments?.total_amount).toLocaleString("en-IN",{ maximumFractionDigits: 0 })}

                  </p>
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase text-gray-500">Received</p>
                  <p className="mt-1 text-lg font-semibold text-green-600">
                    ₹{Number(selectedPayments?.totalPaymentAmount).toLocaleString("en-IN",{ maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase text-gray-500">Balance</p>
                  <p className="mt-1 text-lg font-semibold text-red-600">
                    ₹{Number(selectedPayments?.balance).toLocaleString("en-IN",{ maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>

              {/* <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
                        <h3 className="mb-3 text-lg font-semibold text-gray-800">
                          Payment List
                        </h3>
        
                        {selectedPayments?.payment_amount?.length === 0 ? (
                          <p className="text-gray-700">No payments found.</p>
                        ) : (
                          <ul className="space-y-2">
                            {selectedPayments.payment_amount.map((p, index) => (
                              <li
                                key={p._id}
                                className="flex justify-between border-b pb-1 text-sm text-gray-800"
                              >
                                <span className="font-medium">
                                  Payment {index + 1} – {formatDateTime(p.date)}
                                </span>
        
                                <span className="font-semibold">
                                  ₹
                                  {p.payment && p.value
                                    ? `${Number(p.payment).toLocaleString(
                                        "en-IN"
                                      )} , ${Number(p.value).toLocaleString("en-IN")}`
                                    : p.payment
                                    ? Number(p.payment).toLocaleString("en-IN")
                                    : Number(p.value).toLocaleString("en-IN")}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div> */}

              <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
                <h3 className="mb-3 text-lg font-semibold text-gray-800">
                  Payment History
                </h3>

                {selectedPayments?.invoiceLogs?.length === 0 ? (
                  <p className="text-gray-700">No payments found.</p>
                ) : (
                  <ul className="space-y-3">
                    {selectedPayments?.invoiceLogs.map((log, index) => (
                      <li
                        key={log._id}
                        className="flex justify-between items-center border-b pb-2 text-sm"
                      >
                        {/* LEFT */}
                        <div>
                          <p className="font-medium text-gray-800">
                            Payment {index + 1}
                          </p>
                          <p className="text-xs text-gray-500">
                            {capitalizeFirstLetter(log.status)} • {formatDateTime(log.paidDate || "-")} • {capitalizeFirstLetter(log.paymentType)}
                          </p>
                        </div>

                        {/* RIGHT */}
                        <div className="font-semibold text-gray-900">
                          ₹ {Number(log.amount).toLocaleString("en-IN")}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>
          </div>
        )}

        {paymentVisible1 && (
          <div
            onClick={() => setPaymentVisible1(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-blue-600">
                <h2 className="text-2xl font-semibold text-white">
                  Payment Details
                </h2>
                <button
                  onClick={() => setPaymentVisible1(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition"
                >
                  <IoClose className="text-xl" />
                </button>
              </div>
              <div className="grid grid-cols-3 divide-x divide-gray-200 text-center bg-gray-50">
                <div className="p-4">
                  <p className="text-xs uppercase text-gray-500">Amount</p>
                  <p className="mt-1 text-lg font-semibold text-gray-800">

                    ₹{selectedPayments1?.total_amount.toLocaleString(2)}

                  </p>
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase text-gray-500">Received</p>
                  <p className="mt-1 text-lg font-semibold text-green-600">
                    ₹{selectedPayments1?.totalPaymentAmount.toLocaleString(2)}
                  </p>
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase text-gray-500">Balance</p>
                  <p className="mt-1 text-lg font-semibold text-red-600">
                    ₹{selectedPayments1?.balance.toLocaleString(2)}
                  </p>
                </div>
              </div>

              {/* <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
                        <h3 className="mb-3 text-lg font-semibold text-gray-800">
                          Payment List
                        </h3>
        
                        {selectedPayments?.payment_amount?.length === 0 ? (
                          <p className="text-gray-700">No payments found.</p>
                        ) : (
                          <ul className="space-y-2">
                            {selectedPayments.payment_amount.map((p, index) => (
                              <li
                                key={p._id}
                                className="flex justify-between border-b pb-1 text-sm text-gray-800"
                              >
                                <span className="font-medium">
                                  Payment {index + 1} – {formatDateTime(p.date)}
                                </span>
        
                                <span className="font-semibold">
                                  ₹
                                  {p.payment && p.value
                                    ? `${Number(p.payment).toLocaleString(
                                        "en-IN"
                                      )} , ${Number(p.value).toLocaleString("en-IN")}`
                                    : p.payment
                                    ? Number(p.payment).toLocaleString("en-IN")
                                    : Number(p.value).toLocaleString("en-IN")}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div> */}
              {/*  */}

            </div>
          </div>
        )}



        {isOpeninvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-[100%] md:w-[25%] p-6 relative max-h-[90vh] overflow-y-auto">

              {/* Close button */}
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl transition"
                onClick={() => setIsOpeninvoice(false)}
              >
                ✖
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Invoices
                </h2>
              </div>

              {/* Documents */}
              <div className="space-y-3">
                {selectedinvoice?.documents?.length > 0 ? (
                  selectedinvoice.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
                    >
                      {/* Invoice Name */}
                      <span className="text-gray-700 font-medium"
                        onClick={() => downloadPDFOpen(doc)}
                      >
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
      {/* </> */}

      {/* )} */}


      <Footer />
    </div>
  );
};
export default Invoice_details;
