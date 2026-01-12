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
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { use } from "react";
import { MdClose } from "react-icons/md"; // nice rounded X icon
import { capitalizeFirstLetter } from "../utils/StringCaps";
import { useDateUtils } from "../hooks/useDateUtils";
// import { FaEdit, FaTrash } from "react-icons/fa";


const Invoice_edit = () => {
  const formatDateTime = useDateUtils();
  const { state } = useLocation();
  const rowData = state?.rowData;
  console.log("rowData", rowData)
const dropdownRef = useRef(null);

  // console.log("rowdata", rowData)

  const navigate = useNavigate();







  const [errors, setErrors] = useState({});






  //
  const [clientOption, setClientOption] = useState(null);
  const [projectOption, setProjectOption] = useState(null);

  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  // console.log("clientOption", clientOption);

  useEffect(() => {
    fetchClientList();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      fetchaProjectList(selectedClient);
    }
  }, [selectedClient]);

  useEffect(() => {
    if (selectedProject) {
      fetchaLogs(selectedProject);
    }
  }, [selectedProject]);

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
            project: selectedClient,
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


  const [logdetails, setLogdetails] = useState([]);

  console.log("logdetails", logdetails)

  const fetchaLogs = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/invoice/client-invoice-by-project-wise`,
        {
          params: {
            // clientId: selectedClient,
            // project: selectedProject,
            id:editid,
          },
          // headers: {
          //   Authorization: `Bearer ${localStorage.getItem("token")}`,
          // },

        }
      );

      // console.log("responselogssss", response)

      setLogdetails(response.data.data?.logs);



      // setProjectOption(ProjectOptions);


    } catch (error) {
      console.log(error);
    }
  };


  // Validate Status dynamically
  const validateStatus = (value) => {
    const newErrors = { ...errors };
    if (!value) {
      newErrors.status = ["Status is required"];
    } else {
      delete newErrors.status;
    }
    setErrors(newErrors);
  };


  //   currency

  const currencyOptions = [
    { code: "USD", name: "United States Dollar", symbol: "$" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound Sterling", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "BRL", name: "Brazilian Real", symbol: "R$" },
    { code: "ZAR", name: "South African Rand", symbol: "R" },
  ];

  //   add items

  const [items, setItems] = useState([
    { description: "", hsnCode: "", qty: "", rate: "", total: "" },
  ]);

  // console.log("items",items)

  const [status, setStatus] = useState("");
  console.log("status", status);
  const [invoiceDate, setInvoiceDate] = useState("");
  // console.log("invoiceDate", invoiceDate)
  const [dueDate, setDueDate] = useState("");
  // console.log("dueDate", dueDate)
  const [currency, setCurreny] = useState("");
  const [subTotal, setSubTotal] = useState("");
  const [tax, setTax] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

  const [notes, setNotes] = useState("");

  const[editid, setEditid] = useState("");

  // console.log("editid", editid)

  const [open, setOpen] = useState(false);
  const [taxOpen, setTaxOpen] = useState(false);
  const [intraOpen, setIntraOpen] = useState(false);
  const [interOpen, setInterOpen] = useState(false);
  const [selected, setSelected] = useState("Select Invoice Type");
  const [paidDate, setPaidDate] = useState("");

  const [invoiceNo, setInvoiceNo] = useState("");


  // console.log("selected", selected)

  const selectItem = (path) => {
    setSelected(path.join(" / "));
    setOpen(false);
    setTaxOpen(false);
    setIntraOpen(false);
    setInterOpen(false);
  };

  const [cgst, setCgst] = useState("");
  const [sgst, setSgst] = useState("");
  const [igst, setIgst] = useState("");

  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState("");

  const [balance, setBalance] = useState("");



  const isIntraInvoice =
    selected.includes("Tax Invoice") && selected.includes("Intra");


  const isInterInvoice =
    selected.includes("Tax Invoice") && selected.includes("Inter");

  useEffect(() => {
    const subtotal = parseFloat(subTotal) || 0;

    const cgstPercent = parseFloat(cgst) || 0;
    const sgstPercent = parseFloat(sgst) || 0;
    const igstPercent = parseFloat(igst) || 0;

    let total = subtotal;

    // Inter-state → IGST
    if (isInterInvoice && igstPercent > 0) {
      total = subtotal + (subtotal * igstPercent) / 100;
    }

    // Intra-state → CGST + SGST
    if (isIntraInvoice && (cgstPercent > 0 || sgstPercent > 0)) {
      total =
        subtotal +
        (subtotal * cgstPercent) / 100 +
        (subtotal * sgstPercent) / 100;
    }

    setTotalAmount(total.toFixed(2));
  }, [subTotal, cgst, sgst, igst, isInterInvoice, isIntraInvoice]);



  useEffect(() => {

    // console.log("rowsss",rowData)
    if (!rowData) return;

    setTotalAmount(rowData?.total_amount || "");
    setEditid(rowData._id);
    setSelectedClient(rowData.clientId?._id);
    setSelectedProject(rowData?.project?._id);

    // setInvoiceDate(rowData.invoice_date?.split("T")[0]);
    setDueDate(rowData.due_date?.split("T")[0]);
    setInvoiceDate(rowData.invoice_date?.split("T")[0]);

    const formattedItems = rowData?.items?.map(item => ({
      description: item.description,
      qty: item.quantity,
      rate: item.rate,
      total: item.amount,

      hsnCode: item.hsnCode

    }));

    const selectedCurrency = currencyOptions.find(
      (c) => c.name === rowData.currency
    );

    setCurreny(selectedCurrency || null);
    setItems(formattedItems || []);

    setSubTotal(rowData.sub_total || "");
    setTax(rowData.tax || "");
    setNotes(rowData.notes || "");
    // setStatus(rowData.status);
    setSelected(rowData.invoice_type);
    setIgst(rowData.igst);
    setCgst(rowData.cgst);
    setSgst(rowData.sgst);
    setPaidDate(rowData.paid_date?.split("T")[0]);
    // setAmount(rowData.amount);
    // setPaymentType(rowData?.paymentType);
    setBalance(rowData?.balance);
    setInvoiceNo(rowData?.invoice_number);
  }, [rowData]);



  // console.log("totalAmount", totalAmount);




  const handleChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    // Auto-calculate total when qty or rate changes
    if (field === "qty" || field === "rate") {
      const qty = parseFloat(updatedItems[index].qty) || 0;
      const rate = parseFloat(updatedItems[index].rate) || 0;
      updatedItems[index].total = (qty * rate).toFixed(2);
    }

    setItems(updatedItems);

    const subtotal = updatedItems.reduce((acc, item) => {
      const itemTotal = parseFloat(item.total) || 0;
      return acc + itemTotal;
    }, 0);

    setSubTotal(subtotal.toFixed(2));
  };

  // subtaotal to tax
  // useEffect(() => {
  //   const subtotal = parseFloat(subTotal) || 0;
  //   const taxPercent = parseFloat(tax) || 0;
  //   const taxAmount = (subtotal * taxPercent) / 100;
  //   const total = subtotal + taxAmount;
  //   // setTotalAmount(total);
  // }, [subTotal, tax]);

  useEffect(() => {
    const sum = items.reduce(
      (acc, item) => acc + Number(item.total || 0),
      0
    );
    setSubTotal(sum.toFixed(2));
  }, [items]);


  const addItem = () => {
    setItems([...items, { description: "", qty: "", rate: "", total: "" }]);
  };

  const deleteItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

const skipPaymentFields = [
  "invoice_raised",
  "advance_pending",
  "final_payment_pending",
  "partial_payment_pending",
  "completed",
];


  const handlesubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (status === "paid" && !paidDate) {
      newErrors.paidDate = "Paid date is required when status is Paid";
    }

    // if (!status) {
    //   newErrors.status = "Status is required";
    // }
   if (status && !skipPaymentFields.includes(status) && !amount) {
    newErrors.amount = "Amount is required";
  }

  // Payment Type
  // if (status && !skipPaymentFields.includes(status) && !paymentType) {
  //   newErrors.paymentType = "Payment type is required";
  // }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const formData = {
        client: selectedClient,
        project: selectedProject,
        invoice_date: invoiceDate,
        due_date: dueDate,
        currency: currency.name,
        items: items.map((item) => ({
          description: item.description,
          hsnCode: item.hsnCode,
          quantity: item.qty,
          rate: item.rate,
          amount: item.total,

        })),
        sub_total: subTotal,
        tax: tax,
        total_amount: totalAmount,
        status: status,
        notes: notes,
        amount,
        paidDate,
        paymentType,
        invoice_number: invoiceNo,

      };

      const response = await axios.put(
        `${API_URL}/api/invoice/edit-invoice/${rowData._id}`,
        formData, { withCredentials: true }
      );

      // console.log("response:", response);


      if (response.status === 200 && response.data?.success) {
        await Swal.fire({
          icon: "success",
          title: "Invoice edited successfully!",
          timer: 1500,
          showConfirmButton: true,
        });

        setErrors({});

        navigate(-1);
      }

    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        // console.log("errorss",err.response.data.error)
      } else {
        console.error("Error submitting form:", err);
        Swal.fire({
          icon: "error",
          title: "Submission failed!",
          text: "Please try again.",
        });
      }
    }
  };

  const [openlog, setOpenlog] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState([]);


  // edit payment

  const [isEditOpen, setIsEditOpen] = useState(false);
const [editingLog, setEditingLog] = useState(null);

const [editStatus, setEditStatus] = useState("");
const [editPaidDate, setEditPaidDate] = useState("");
const [editAmount, setEditAmount] = useState("");
const [editPaymentType, setEditPaymentType] = useState("");

const handleEdit = (log) => {
  setEditingLog(log);

  setEditStatus(log.status || "");
  setEditPaidDate(log.paidDate ? log.paidDate.split("T")[0] : "");
  setEditAmount(log.amount || "");
  setEditPaymentType(log.paymentType || "");

  setErrors({});
  setIsEditOpen(true);
};
const handleUpdate = async (e) => {
  e.preventDefault(); //  IMPORTANT

  if (!editStatus) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      title: "Status is required",
      showConfirmButton: false,
      timer: 2000,
      width: "300px",
    });
    return;
  }

  try {
    await axios.put(
      `${API_URL}/api/invoice/edit-invoice-log/${editingLog._id}`,
      {
        status: editStatus,
        paidDate: editPaidDate,
        amount: editAmount,
        paymentType: editPaymentType,
      }
    );

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Updated successfully",
      showConfirmButton: false,
      timer: 2000,
      width: "300px",
    });

    setIsEditOpen(false);
    fetchaLogs();
  } catch (err) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      title: "Update failed",
      showConfirmButton: false,
      timer: 2000,
      width: "300px",
    });
  }
};


const handleDelete = (id) => {
  Swal.fire({
    title: "Delete?",
    text: "This entry will be removed",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
    width: "400px",         
    padding: "1.2rem",
    customClass: {
      popup: "rounded-xl text-sm",
      confirmButton: "bg-red-600",
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(
          `${API_URL}/api/invoice/delete-invoice-log/${id}`
        );

        //  Small success toast
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Deleted successfully",
          showConfirmButton: false,
          timer: 2000,
          width: "280px",
        });

        fetchaLogs();
      } catch (error) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Delete failed",
          showConfirmButton: false,
          timer: 2000,
          width: "280px",
        });
      }
    }
  });
};


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
        setTaxOpen(false);
        setIntraOpen(false);
        setInterOpen(false);
      }
    };
  
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);
  

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen  min-h-screen px-3 md:px-5 pt-2 md:pt-10 overflow-x-auto">
      <div className="">
        <div>
          <Mobile_Sidebar />
        </div>

        <div className="flex gap-2 items-center cursor-pointer">
          <p
            className="text-sm text-gray-500"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </p>
          <p>{">"}</p>

          <p className="text-sm text-gray-500" onClick={() => navigate(-1)}>Invoice List</p>
          <p>{">"}</p>

          <p className="text-sm text-blue-500">Edit Invoice</p>
        </div>

        <div className="">
          <div className="bg-white p-2 md:p-5 rounded-xl overflow-y-auto px-2 py-4 md:px-5 md:py-6">
            <div className="flex justify-between items-center gap-2 ">
              <h2 className="text-xl font-semibold mb-4">Edit Invoice</h2>

              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium"
              >
                ← Back
              </button>

            </div>
            <div className="flex flex-wrap md:flex-nowrap">
              {/* left */}
              <div className="w-full border p-5 md:w-[70%] shadow-2xl rounded ">
                {" "}
                {/* name and company */}
                <div className="flex flex-wrap md:flex-nowrap justify-between gap-5">
                  <div className="w-full">
                    <label
                      htmlFor="roleName"
                      className="block text-sm font-medium mb-2"
                    >
                      Client<span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.value)}
                      options={clientOption}
                      filter
                      optionLabel="label"
                      placeholder="Select a Client"
                      className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.client && (
                      <p className="text-red-500 text-sm mb-4">
                        {errors.client}
                      </p>
                    )}
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="roleName"
                      className="block text-sm font-medium mb-2"
                    >
                      Project<span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.value)}
                      options={projectOption}
                      filter
                      optionLabel="label"
                      placeholder="Select a Project"
                      className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {/* {errors.client && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.client}
                    </p>
                  )} */}
                    {/* {errors.contact_person && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.contact_person}
                    </p>
                  )} */}
                  </div>
                </div>
                {/* email phonenumber */}
                <div className="flex flex-wrap md:flex-nowrap justify-between gap-5 mt-3">
                  <div className="w-full">
                    <label
                      htmlFor="roleName"
                      className="block text-sm font-medium mb-2"
                    >
                      Invoice Date<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"

                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.invoice_date && (
                      <p className="text-red-500 text-sm mb-4">
                        {errors.invoice_date}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="roleName"
                      className="block text-sm font-medium mb-2"
                    >
                      Due Date<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      min={invoiceDate}
                      className="w-full px-3 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.due_date && (
                      <p className="text-red-500 text-sm mb-4">
                        {errors.due_date}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap justify-between gap-5 mt-3">
                  <div className="w-[50%]">
                    <label className="block text-sm font-medium mb-2">
                      Invoice No <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      value={invoiceNo}
                      onChange={(e) => setInvoiceNo(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {errors.invoice_no && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.invoice_no}
                      </p>
                    )}
                  </div>
                </div>
                {/* item */}
                <div className="mt-3">
                  <div className="flex justify-between">
                    <div className="text-lg font-medium  ">Items</div>
                  </div>
                  <div className="mb-4 bg-[#132144] border-b border-gray-800 text-white py-2 mt-2 rounded  flex  gap-1 p-2">
                    <div className="flex flex-wrap w-[65%] ">
                      <label className="text-sm font-medium mb-1">
                        Description
                      </label>
                    </div>
                    <div className="flex flex-col w-[30%] ">
                      <label className="text-sm font-medium mb-1">HSN/SAC</label>
                    </div>
                    <div className="flex flex-col w-[30%] ">
                      <label className="text-sm font-medium mb-1">Qty</label>
                    </div>

                    <div className="flex flex-col w-[30%]  ">
                      <label className="text-sm font-medium mb-1">Rate</label>
                    </div>

                    <div className="flex flex-col w-[30%]">
                      <label className="text-sm font-medium mb-1">Total</label>
                    </div>
                  </div>
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="group items-start mb-4 border-b border-gray-800 pb-4 flex flex-wrap md:flex-nowrap gap-1"
                    >
                      <div className="flex flex-col w-full">
                        <input
                          type="text"
                          placeholder="Description"
                          className="border p-2 rounded w-full"
                          value={item.description}
                          onChange={(e) =>
                            handleChange(index, "description", e.target.value)
                          }
                        />
                      </div>

                      <div className="flex flex-col w-full md:w-[15%]">
                        <input
                          type="text"
                          placeholder="Hsn"
                          className="border p-2 rounded"
                          value={item.hsnCode}
                          onChange={(e) =>
                            handleChange(index, "hsnCode", e.target.value)
                          }
                        />
                      </div>

                      <div className="flex flex-col w-full md:w-[15%] ">
                        <input
                          type="number"
                          placeholder="Qty"
                          className="border p-2 rounded"
                          value={item.qty}
                          onChange={(e) =>
                            handleChange(index, "qty", e.target.value)
                          }
                        />
                      </div>

                      <div className="flex flex-col w-full md:w-[15%]  ">
                        <input
                          type="number"
                          placeholder="Rate"
                          className="border p-2 rounded"
                          value={item.rate}
                          onChange={(e) =>
                            handleChange(index, "rate", e.target.value)
                          }
                        />
                      </div>

                      <div className="flex flex-col w-full md:w-[15%]">
                        <input
                          type="text"
                          placeholder="Total"
                          className="border p-2 rounded bg-gray-100"
                          value={`${currency?.symbol || ""}${parseFloat(
                            item.total || 0
                          ).toFixed(2)}`}
                          readOnly
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          onClick={() => deleteItem(index)}
                          className="flex items-center justify-center w-8 h-8 rounded-full 
                                  text-white group-hover:text-[#1c8369]
                                  transition-colors duration-200"
                        >
                          <MdClose className="w-5 h-6 mt-1" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addItem}
                    className="flex items-center justify-center gap-1 w-28 text-[13px] rounded border-2 border-[#6fc8b1] text-[#6fc8b1] hover:bg-[#6fc8b1] hover:text-white px-3 py-2"
                  >
                    <IoMdAdd /> Line Item
                  </button>
                </div>
                {/* address and notes */}
                <div className="flex flex-wrap md:flex-nowrap ">
                  {/* left */}
                  <div className="w-full md:w-[50%]">
                    <div className="flex flex-wrap md:flex-nowrap justify-between gap-5 mt-3">
                      <div className="w-full">
                        <label
                          htmlFor="notes"
                          className="block text-sm font-medium mb-2"
                        >
                          Notes
                        </label>
                        <textarea
                          id="notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={4}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  {/* right */}
                  <div className="w-full md:w-[50%] flex justify-start md:justify-end p-3">
                    <div className=" ">
                      <div className=" mt-3">
                        <div className="w-full flex  justify-between">
                          <span className="block text-sm font-medium text-gray-400">
                            Subtotal
                          </span>
                          <span className="block text-sm font-medium text-gray-400">
                            {currency?.symbol || ""}
                            {parseFloat(subTotal || 0).toFixed(2)}
                          </span>
                        </div>

                        {/* <div className="w-full flex flex-wrap md:flex-nowrap mt-3">
                          <label
                            htmlFor="roleName"
                            className="block text-sm font-medium mb-2 w-[50%]"
                          >
                            Tax(%)
                          </label>
                          <input
                            type="text"
                            value={tax}
                            onChange={(e) => setTax(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div> */}
                        {isIntraInvoice && (
                          <div className="w-full mt-4 space-y-3">

                            {/* CGST */}
                            <div className="flex flex-wrap md:flex-nowrap items-center">
                              <label className="block text-sm font-medium w-[50%]">
                                CGST (%)
                              </label>
                              <input
                                type="number"
                                value={cgst}
                                onChange={(e) => setCgst(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            {/* SGST */}
                            <div className="flex flex-wrap md:flex-nowrap items-center">
                              <label className="block text-sm font-medium w-[50%]">
                                SGST (%)
                              </label>
                              <input
                                type="number"
                                value={sgst}
                                onChange={(e) => setSgst(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                          </div>
                        )}

                        {isInterInvoice && (
                          <div className="flex items-center mt-4">
                            <label className="block text-sm font-medium w-[50%]">
                              IGST (%)
                            </label>
                            <input
                              type="number"
                              value={igst}
                              onChange={(e) => setIgst(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                        )}



                        <div className="w-full flex flex-wrap md:flex-nowrap mt-3">
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium mb-2 w-[50%] mt-3"
                          >
                            Total Amount
                          </label>
                          <input
                            type="text"
                            value={`${currency?.symbol || ""}${parseFloat(
                              totalAmount || 0
                            ).toFixed(2)}`}
                            onChange={(e) => setTotalAmount(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        {/* bablance */}

                        {/* {status && ( */}
                          <div className="w-full flex flex-wrap md:flex-nowrap mt-3">
                            <label className="block text-sm font-medium mb-2 w-[50%] mt-3">
                              Balance
                            </label>

                            <input
                              type="number"
                              value={balance}

                              disabled

                              className="w-full h-11 px-3 border border-gray-300 rounded-lg bg-gray-100"
                            />


                          </div>
                        {/* /* )}  */}
                        <div className="w-full flex flex-wrap md:flex-nowrap mt-3">
                          <label
                            htmlFor="roleName"
                            className="block text-sm font-medium mb-2 w-[50%] mt-3"
                          >
                            Status
                          </label>
                          <select
                            name="status"
                            id="status"
                            // value={status}
                            onChange={(e) => {
                              setStatus(e.target.value);
                              validateStatus(e.target.value);
                            }}
                            className="w-full h-11 px-2 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {/* <option value="">Select a status</option> */}
                            <option value="" disabled selected>
                              Payment Status
                            </option>
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
                          {errors.status && (
                            <p className="text-red-500 text-sm mb-4">
                              {errors.status}
                            </p>
                          )}
                        </div>

                        {status && !["invoice_raised", "advance_pending", "final_payment_pending", "partial_payment_pending"].includes(status) && (
                          <div className="w-full flex mt-3">
                            <label className="w-[50%] text-sm font-medium mt-3" >
                              Date
                            </label>

                            <input
                              type="date"
                              value={paidDate}
                              onChange={(e) => setPaidDate(e.target.value)}
                              className="w-full h-11 px-3 border rounded-lg"
                            />
                          </div>
                        )}



                        {status && !["invoice_raised", "advance_pending", "final_payment_pending", "partial_payment_pending"].includes(status) && (
                          <div className="w-full flex flex-wrap md:flex-nowrap mt-3">
                            <label className="block text-sm font-medium mb-2 w-[50%] mt-3">
                              Amount
                            </label>

                            <input
                              type="number"
                              // value={amount}
                              onChange={(e) => {
                                setAmount(e.target.value);
                                setErrors((prev) => ({ ...prev, amount: "" }));
                              }}
                              className="w-full h-11 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            
                          </div>
                        )}
                        {errors.amount && (
                              <p className="text-red-500 text-sm mt-1 text-end">{errors.amount}</p>
                            )}


                        {status && !["invoice_raised", "advance_pending", "final_payment_pending", "partial_payment_pending"].includes(status) && (
                          <div className="w-full flex flex-wrap md:flex-nowrap mt-3">
                            <label className="block text-sm font-medium  w-[50%] mt-4">
                              Payment Type
                            </label>

                            <select
                              // value={paymentType}
                              onChange={(e) => {
                                setPaymentType(e.target.value);
                                setErrors((prev) => ({ ...prev, paymentType: "" }));
                              }}
                              className="w-full h-11 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="" disabled selected>
                                Select Payment Type
                              </option>
                              <option value="gpay">GPay</option>
                              <option value="bank">Bank Transfer</option>
                              <option value="cash">Cash</option>
                              <option value="upi">UPI</option>
                            </select>

                          
                          </div>
                          
                        )}
                          {errors.paymentType && (
                              <p className="text-red-500 text-sm mt-1 text-end">{errors.paymentType}</p>
                            )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* right */}

              <div className="w-full md:w-[30%] md:border-l-4 p-3">
                <div className=" w-[100%]">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 min-w-full h-10 font-semibold rounded"
                    onClick={handlesubmit}
                  >
                    Save
                  </button>
                  <hr className="mt-5"></hr>

                  <div>
                    {" "}
                    <div className="flex flex-wrap md:flex-nowrap justify-between gap-5 mt-3 p-2">
                      <div className="w-full">
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium mb-2 text-gray-500"
                        >
                          Curreny
                        </label>
                        <Dropdown
                          value={currency}
                          onChange={(e) => setCurreny(e.value)}
                          options={currencyOptions}
                          optionLabel="name"
                          placeholder="Select a Currency"
                          className="border w-full border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap justify-between gap-5 mt-3 p-2 ">

                      <div className="w-full">
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                          Invoice Type
                        </label>

                        {/* Trigger */}
                        <div
                          onClick={() => setOpen(!open)}
                          className="flex justify-between items-center border border-gray-300 rounded-xl px-4 py-3 cursor-pointer bg-white"
                        >
                          <span className="text-gray-700 truncate">{selected}</span>
                          <span className="text-gray-400">▾</span>
                        </div>

                        {/* Dropdown (DOWN-WISE) */}
                        {open && (
                          <div ref={dropdownRef} className="mt-2 border rounded-xl bg-white shadow-md">

                            {/* WITHOUT GST */}
                            <div
                              onClick={() => selectItem(["Without GST"])}
                              className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                            >
                              Without GST
                            </div>

                            {/* TAX INVOICE */}
                            <div className="px-4 py-2">
                              <div
                                onClick={() => setTaxOpen(!taxOpen)}
                                className="flex justify-between items-center cursor-pointer hover:bg-gray-50  py-2 rounded-lg"
                              >
                                <span>Tax Invoice</span>
                                <span>{taxOpen ? "▲" : "▼"}</span>
                              </div>

                              {/* INTRA / INTER */}
                              {taxOpen && (
                                <div className="ml-4 mt-2 space-y-1">

                                  {/* INTRA */}
                                  <div>
                                    <div
                                      onClick={() => {
                                        setIntraOpen(!intraOpen);
                                        setInterOpen(false);
                                      }}
                                      className="flex justify-between items-center cursor-pointer hover:bg-gray-50  py-2 rounded-lg"
                                    >
                                      <span>Intra</span>
                                      <span>{intraOpen ? "▲" : "▼"}</span>
                                    </div>

                                    {intraOpen && (
                                      <div className=" mt-2 space-y-1">
                                        <div
                                          onClick={() =>
                                            selectItem(["Tax Invoice", "Intra", "Proforma Invoice"])
                                          }
                                          className=" py-2 hover:bg-green-50 rounded cursor-pointer"
                                        >
                                          Proforma Invoice
                                        </div>
                                        <div
                                          onClick={() =>
                                            selectItem(["Tax Invoice", "Intra", "Tax Invoice"])
                                          }
                                          className=" py-2 hover:bg-green-50 rounded cursor-pointer"
                                        >
                                          Tax Invoice
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* INTER */}
                                  <div>
                                    <div
                                      onClick={() => {
                                        setInterOpen(!interOpen);
                                        setIntraOpen(false);
                                      }}

                                      className="flex justify-between items-center cursor-pointer hover:bg-gray-50  py-2 rounded-lg"
                                    >
                                      <span>Inter</span>
                                      <span>{interOpen ? "▲" : "▼"}</span>
                                    </div>

                                    {interOpen && (
                                      <div className=" mt-2 space-y-2">
                                        <div
                                          onClick={() =>
                                            selectItem(["Tax Invoice", "Inter", "Proforma Invoice"])
                                          }
                                          className=" py-2 hover:bg-green-50 rounded cursor-pointer"
                                        >
                                          Proforma Invoice
                                        </div>
                                        <div
                                          onClick={() =>
                                            selectItem(["Tax Invoice", "Inter", "Tax Invoice"])
                                          }
                                          className="py-2  hover:bg-green-50 rounded cursor-pointer"
                                        >
                                          Tax Invoice
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                </div>
                              )}
                            </div>

                            {/* EXPORT */}
                            <div
                              onClick={() => selectItem(["Export"])}
                              className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                            >
                              Export
                            </div>

                          </div>
                        )}
                      </div>
                    </div>


                  </div>
                  <hr className="mt-5"></hr>

                  {/* <div className="p-2">
                    <button
                      onClick={() => {
                        setSelectedLogs(logdetails);
                        setOpenlog(true);
                      }}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <FaEye size={18} />
                      <span>View Payment History</span>
                    </button>
                  </div> */}
                  <div className="p-2">
  {logdetails && logdetails.length > 0 ? (
    <div className="max-h-[500px] overflow-y-auto border border-gray-200 rounded-xl">
      <table className="w-full text-sm">
        <thead className="bg-blue-50 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">
              Date
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">
              Status
            </th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600">
              Amount
            </th>
            <th className="px-4 py-3 text-center font-semibold text-gray-600">
  Action
</th>

          </tr>
        </thead>

        <tbody>
          {logdetails.map((log, i) => (
            <tr
              key={i}
              className={`border-b transition ${
                i % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-blue-50`}
            >
              <td className="px-4 py-3 font-medium text-gray-800">
                <span className="text-gray-500 text-sm">
                  {log.paidDate ? formatDateTime(log.paidDate) : "-"}
                </span>
              </td>

              <td className="px-4 py-3 text-gray-800">
                {capitalizeFirstLetter(log.status)}
              </td>

              <td className="px-4 py-3 text-right font-semibold text-green-600">
                {log.amount ? `₹${log.amount}` : "-"}
              </td>
              <td className="px-4 py-3 text-center">
  <div className="flex justify-center gap-3">
    {/* Edit */}
    <button
      onClick={() => handleEdit(log)}
      className="text-blue-600 hover:text-blue-800 transition"
      title="Edit"
    >
      <TfiPencilAlt size={16} />
    </button>

    {/* Delete */}
    <button
      onClick={() => handleDelete(log._id)}
      className="text-red-500 hover:text-red-700 transition"
      title="Delete"
    >
      <MdOutlineDeleteOutline size={16} />
    </button>
  </div>
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="text-gray-500 font-medium text-lg mt-2">
      No transactions available
    </div>
  )}
</div>

                </div>




                {openlog && (
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setOpenlog(false)}
                  >
                    <div
                      className="bg-white rounded-2xl w-[60%] max-w-6xl h-[85vh] shadow-2xl flex flex-col"
                      onClick={(e) => e.stopPropagation()}
                    >

                      {/* Header */}
                      <div className="flex items-center justify-between px-6 py-4 border-b">
                        <h2 className="text-xl font-semibold text-gray-800">
                          Payment Log Details
                        </h2>
                        <button
                          onClick={() => setOpenlog(false)}
                          className="text-gray-400 hover:text-gray-700 text-2xl"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Table Wrapper */}
                      <div className="flex-1 overflow-y-auto px-6 py-4">
                        {selectedLogs && selectedLogs.length > 0 ? (
                          <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
                            {/* Table Head */}
                            <thead className="bg-blue-50 sticky top-0 z-10">
                              <tr>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                                  Invoice No
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                                  Status
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600">
                                  Paid Date
                                </th>
                                <th className="px-4 py-3 text-right font-semibold text-gray-600">
                                  Amount (₹)
                                </th>
                              </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody>
                              {selectedLogs.map((log, i) => (
                                <tr
                                  key={i}
                                  className={`border-b transition
                    ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    hover:bg-blue-50`}
                                >
                                  <td className="px-4 py-3 font-medium text-gray-800">
                                    #{log.invoice_number || "-"}
                                  </td>
                                  <td className="px-4 py-3 text-gray-800">
                                    {capitalizeFirstLetter(log.status)}
                                  </td>
                                  <td className="px-4 py-3 text-gray-600">
                                    {new Date(log.paidDate).toLocaleDateString("en-IN")}
                                  </td>
                                  <td className="px-4 py-3 text-right font-semibold text-green-600">
                                    ₹{log.amount}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500 font-medium text-lg">
                            No transactions available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

{isEditOpen && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Edit Payment
        </h2>
        <button
          onClick={() => setIsEditOpen(false)}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>
      </div>

      {/* STATUS */}
      <div className="w-full flex mt-3">
        <label className="w-[45%] text-sm font-medium mt-3">
          Status
        </label>

        <select
          value={editStatus}
          onChange={(e) => setEditStatus(e.target.value)}
          className="w-full h-11 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Payment Status</option>
          <option value="invoice_raised">Invoice Raised</option>
          <option value="advance_pending">Advance Pending</option>
          <option value="advance_received">Advance Received</option>
          <option value="partial_payment_pending">Partial Payment Pending</option>
          <option value="partial_payment_received">Partial Payment Received</option>
          <option value="final_payment_pending">Final Payment Pending</option>
          <option value="completed">Completed</option>
          <option value="TDS">TDS</option>
        </select>
      </div>

      {/* DATE */}
      {editStatus &&
        !["invoice_raised", "advance_pending", "final_payment_pending", "partial_payment_pending"].includes(editStatus) && (
          <div className="w-full flex mt-4">
            <label className="w-[45%] text-sm font-medium mt-3">
              Date
            </label>

            <input
              type="date"
              value={editPaidDate}
              onChange={(e) => setEditPaidDate(e.target.value)}
              className="w-full h-11 px-3 border border-gray-300 rounded-lg"
            />
          </div>
        )}

      {/* AMOUNT */}
      {editStatus &&
        !["invoice_raised", "advance_pending", "final_payment_pending", "partial_payment_pending"].includes(editStatus) && (
          <div className="w-full flex mt-4">
            <label className="w-[45%] text-sm font-medium mt-3">
              Amount
            </label>

            <input
              type="number"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              className="w-full h-11 px-3 border border-gray-300 rounded-lg"
            />
          </div>
        )}

      {/* PAYMENT TYPE */}
      {editStatus &&
        !["invoice_raised", "advance_pending", "final_payment_pending", "partial_payment_pending"].includes(editStatus) && (
          <div className="w-full flex mt-4">
            <label className="w-[45%] text-sm font-medium mt-4">
              Payment Type
            </label>

            <select
              value={editPaymentType}
              onChange={(e) => setEditPaymentType(e.target.value)}
              className="w-full h-11 px-3 border border-gray-300 rounded-lg"
            >
              <option value="">Select Payment Type</option>
              <option value="gpay">GPay</option>
              <option value="bank">Bank Transfer</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
            </select>
          </div>
        )}

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setIsEditOpen(false)}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdate}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Submit
        </button>
      </div>

    </div>
  </div>
)}


              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
export default Invoice_edit;
