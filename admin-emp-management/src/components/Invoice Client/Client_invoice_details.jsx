import React, { useState, useEffect, useRef } from "react";

import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
DataTable.use(DT);
import { FaFileDownload } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { FaMoneyCheckAlt } from "react-icons/fa";

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
import { capitalizeFirstLetter } from "../../utils/StringCaps";
import { useSearchParams } from "react-router-dom";

const Client_invoice_details = () => {
  const navigate = useNavigate();
  const formatDateTime = useDateUtils();

  const storedDetails = localStorage.getItem("hrmsuser");
  const parsedDetails = storedDetails ? JSON.parse(storedDetails) : null;
  let user = parsedDetails ? parsedDetails : null;

  const userid = user ? user._id : null;

  console.log("user", userid);

  // Fetch roles from the API
  useEffect(() => {
    fetchProject();
  }, []);

  // console.log("roles", roles);

  const [errors, setErrors] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  const [clientdetails, setClientdetails] = useState([]);
  const [projectOption, setProjectOption] = useState(null);
  console.log("projectOption", projectOption);
  const [projectFilter, setProjectFilter] = useState(
    searchParams.get("project") || ""
  );
  console.log("projectFilter", projectFilter);
  const [submittedProject, setSubmittedProject] = useState("");
  const handleSubmit = () => {
    // Set submitted labels separately
    setSubmittedProject(
      projectOption.find((p) => p.value === projectFilter)?.label || ""
    );

    fetchProject(projectFilter);
  };
  const fetchaProjectList = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/invoice/get-project-name-with-client`,
        {
          params: {
            project: userid,
          },
          // headers: {
          //   Authorization: `Bearer ${localStorage.getItem("token")}`,
          // },
        }
      );

      console.log("response123", response);

      const ProjectOptions = response.data.data.map((emp) => ({
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
  useEffect(() => {
    fetchaProjectList();
  }, []);

  const fetchProject = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/invoice/client-invoice-dashboard`,
        {
          params: { clientId: userid, project: projectFilter },
        },
        { withCredentials: true }
      );
      console.log("response", response);
      if (response.data.success) {
        // const formattedData = response.data.data.map(item => ({
        //   ...item,
        //   invoice_date: item.invoice_date
        //     ? formatDateTime(item.invoice_date)
        //     : "-"
        // }));

        setClientdetails(response.data.data);
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
  const downloadPDFOpen = (doc) => {
    if (!doc || !doc.path) return;

    const url = `${API_URL}/api/uploads/clientInvoices/${doc.filename}`;

    // Open in new tab
    window.open(url, "_blank", "noopener,noreferrer");
  };
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
  const [paymentVisible, setPaymentVisible] = useState(false);
  const [selectedPayments, setSelectedPayments] = useState([]);
  console.log("selectedPayments", selectedPayments);

  const columns = [
    {
      title: "Sno",
      data: null,
      render: function (data, type, row, meta) {
        return meta.row + 1;
      },
    },

    // {
    //   title: "Client Name",
    //   data: "clientName",
    //   //   render: (data) => data?.client_name || "-"
    // },

    {
      title: "Project",
      data: "projectName",
    },
    {
      title: "Invoice Number",
      data: "invoiceNumber",
      render: (data) => (data ? data : "-"),
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
      render: (data) => (data ? formatDateTime(data) : "-"),
    },

    {
      title: "Due Date",
      data: "due",
      render: (data) => (data ? formatDateTime(data) : "-"),
    },

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
                {/* ₹{totalAmount ?? 0} */}₹
                {Number(totalAmount ?? 0).toLocaleString("en-IN", {
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
                {/* ₹{totalPaymentAmount ?? 0} */}₹
                {Number(totalPaymentAmount ?? 0).toLocaleString("en-IN", {
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
      data: "balance",
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
                {/* ₹{(balance ?? 0) ? Number(balance).toLocaleString("en-IN", { minimumFractionDigits: 0 }) : 0} */}
                ₹
                {Number(balance ?? 0).toLocaleString("en-IN", {
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

    // {
    //   title: "Paid Date",
    //   data: "paid_date",
    //   render: (data) => data ? formatDateTime(data) : "-"
    // },

    //  {
    //       title: "Payment",
    //       data: null,
    //       render: (payments, type, row) => {
    //         const id = `payments-${row.sno || Math.random()}`;

    //         setTimeout(() => {
    //           const container = document.getElementById(id);
    //           if (container) {
    //             if (!container._root) {
    //               container._root = createRoot(container);
    //             }
    //             container._root.render(
    //               <div
    //                 style={{
    //                   display: "flex",
    //                   justifyContent: "center",
    //                   alignItems: "center",
    //                 }}
    //               >
    //                 <FaMoneyCheckAlt
    //                   className="cursor-pointer text-black text-xl"
    //                   title="View Payments"
    //                   onClick={() => {
    //                     setSelectedPayments(row || []);
    //                     setPaymentVisible(true);
    //                   }}
    //                 />
    //               </div>,

    //             );
    //           }
    //         }, 0);

    //         return `<div id="${id}"></div>`;
    //       },
    //     },

    {
      title: "Status",
      data: "status",
      render: capitalizeFirstLetter,
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

        <div className="flex flex-wrap gap-6 mb-6 items-end">
          {/* Project Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1 text-gray-700">
              Project
            </label>
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
              onClick={fetchProject}
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
                      <span
                        className="text-gray-700 font-medium"
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

        {paymentVisible && (
          <div
            onClick={() => setPaymentVisible(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[35%] bg-white rounded-2xl shadow-2xl overflow-hidden"
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
                    ₹
                    {Number(selectedPayments?.total_amount).toLocaleString(
                      "en-IN",
                      { maximumFractionDigits: 0 }
                    )}
                  </p>
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase text-gray-500">Received</p>
                  <p className="mt-1 text-lg font-semibold text-green-600">
                    ₹
                    {Number(
                      selectedPayments?.totalPaymentAmount
                    ).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase text-gray-500">Balance</p>
                  <p className="mt-1 text-lg font-semibold text-red-600">
                    ₹
                    {Number(selectedPayments?.balance).toLocaleString("en-IN", {
                      maximumFractionDigits: 0,
                    })}
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

              {/* <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
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
                      
                        <div>
                          <p className="font-medium text-gray-800">
                            Payment {index + 1}
                          </p>
                          <p className="text-xs text-gray-500">
                            {capitalizeFirstLetter(log.status)} •{" "}
                            {formatDateTime(log.paidDate || "-")} •{" "}
                            {capitalizeFirstLetter(log.paymentType)}
                          </p>
                        </div>

                      
                        <div className="font-semibold text-gray-900">
                          ₹ {Number(log.amount).toLocaleString("en-IN")}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div> */}
              <div className="px-6 py-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-800">
                  Payment History
                </h3>

                {selectedPayments?.invoiceLogs?.length > 0 ? (
                  <div className="max-h-[60vh] overflow-y-auto border border-gray-200 rounded-xl">
                    <table className="w-full text-sm">
                      {/* TABLE HEADER */}
                      <thead className="bg-blue-50 sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-600">
                            Payment Type
                          </th>
                          <th className="px-4 py-3 text-right font-semibold text-gray-600">
                            Amount
                          </th>
                        </tr>
                      </thead>

                      {/* TABLE BODY */}
                      <tbody>
                        {selectedPayments.invoiceLogs.map((log, index) => (
                          <tr
                            key={log._id}
                            className={`border-b transition ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            } hover:bg-blue-50`}
                          >
                            {/* DATE */}
                            <td className="px-4 py-3 text-gray-700">
                              {log.paidDate
                                ? formatDateTime(log.paidDate)
                                : "-"}
                            </td>

                            {/* STATUS */}
                            <td className="px-4 py-3 text-gray-800 font-medium">
                              {capitalizeFirstLetter(log.status)}
                            </td>

                            {/* PAYMENT TYPE */}
                            <td className="px-4 py-3 text-gray-700">
                              {capitalizeFirstLetter(log.paymentType)}
                            </td>

                            {/* AMOUNT */}
                            <td className="px-5 py-4 text-right font-semibold text-green-600">
                              ₹
                              {Number(log.amount).toLocaleString("en-IN", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-700">No payments found.</p>
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
