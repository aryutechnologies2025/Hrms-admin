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
import { MdClose } from "react-icons/md"; // nice rounded X icon
import { capitalizeFirstLetter } from "../utils/StringCaps";

const Invoice_full = () => {
  const navigate = useNavigate();


  // Fetch roles from the API
  useEffect(() => {
    fetchProject();
  }, []);

  // console.log("roles", roles);



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
        setClientdetails(response.data.data);
      } else {
        setErrors("Failed to fetch roles.");
      }
    } catch (err) {
      setErrors("Failed to fetch roles.");
    }
  };

  // Open and close modals

  // client name deatails

  //


  const [status, setStatus] = useState("");




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

  //   console.log("edit modal", roleDetails);

  const priorityOption = ["Low", "Medium", "High", "Critical"];

  // conutry list

  //   const [selectedCountry, setSelectedCountry] = useState(null);

  const countryOptions = [
    { name: "United States", code: "US" },
    { name: "India", code: "IN" },
    { name: "China", code: "CN" },
    { name: "Brazil", code: "BR" },
    { name: "Indonesia", code: "ID" },
    { name: "Pakistan", code: "PK" },
    { name: "Nigeria", code: "NG" },
    { name: "Bangladesh", code: "BD" },
    { name: "Russia", code: "RU" },
    { name: "Mexico", code: "MX" },
    { name: "United Kingdom", code: "UK" },
  ];

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

  const [selectedClient, setSelectedClient] = useState(null);
  // console.log("selectedClient", selectedClient);
  const [selectedProject, setSelectedProject] = useState(null);
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [currency, setCurreny] = useState("");
  const [subTotal, setSubTotal] = useState("");
  const [tax, setTax] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [notes, setNotes] = useState("");

  const [cgst, setCgst] = useState("");
  const [sgst, setSgst] = useState("");
  const [igst, setIgst] = useState("");
  const [selected, setSelected] = useState("Select Invoice Type");

  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState("");
  // const [paidDate, setPaidDate] = useState("");
  const [paidDate, setPaidDate] = useState(
    new Date().toISOString().split("T")[0]
  );


  const [open, setOpen] = useState(false);
  const [taxOpen, setTaxOpen] = useState(false);
  const [intraOpen, setIntraOpen] = useState(false);
  const [interOpen, setInterOpen] = useState(false);

  // console.log("selected", selected)

  const selectItem = (path) => {
    setSelected(path.join(" / "));
    setOpen(false);
    setTaxOpen(false);
    setIntraOpen(false);
    setInterOpen(false);
  };



  const isIntraInvoice =
    selected.includes("Tax Invoice") && selected.includes("Intra");


  const isInterInvoice =
    selected.includes("Tax Invoice") && selected.includes("Inter");




  const [clientOption, setClientOption] = useState(null);
  const [projectOption, setProjectOption] = useState(null);

  // console.log("clientOption", projectOption);


  useEffect(() => {
    fetchClientList();
  }, []);
  useEffect(() => {
    fetchaSettings();
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

  const fetchaSettings = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/setting/view-invoice-setting`,
        { withCredentials: true }

      );

      console.log("response", response)

      setIgst(response.data.data[0]?.igst || "");
      setCgst(response.data.data[0]?.cgst || "");
      setSgst(response.data.data[0]?.sgst || "");


    } catch (error) {
      console.log(error);
    }
  };


  // invoice details for client previous log

  const [logdetails, setLogdetails] = useState([]);

  // console.log("logdetails", logdetails)

  const fetchaLogs = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/invoice/client-invoice-by-project-wise`,
        {
          params: {
            clientId: selectedClient,
            project: selectedProject,
          },
          // headers: {
          //   Authorization: `Bearer ${localStorage.getItem("token")}`,
          // },

        }
      );

      // console.log("responselogssss", response)

      setLogdetails(response.data.data);



      // setProjectOption(ProjectOptions);


    } catch (error) {
      console.log(error);
    }
  };


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
  //   setTotalAmount(total.toFixed(2));
  // }, [subTotal, tax]);

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


  const addItem = () => {
    setItems([...items, { description: "", qty: "", rate: "", total: "" }]);
  };

  const deleteItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };


  const validateInvoiceForm = () => {
    let errors = {};

    // Client & Project
    if (!selectedClient) {
      errors.client = "Client is required";
    }

    if (!selectedProject) {
      errors.project = "Project is required";
    }

    // Dates
    if (!invoiceDate) {
      errors.invoice_date = "Invoice date is required";
    }

    if (!dueDate) {
      errors.due_date = "Due date is required";
    }

    if (invoiceDate && dueDate && new Date(dueDate) < new Date(invoiceDate)) {
      errors.due_date = "Due date cannot be before invoice date";
    }

    // Currency
    if (!currency || !currency.name) {
      errors.currency = "Currency is required";
    }

    // Items validation
    // if (!items || items.length === 0) {
    //   errors.items = "At least one item is required";
    // } else {
    //   items.forEach((item, index) => {
    //     if (!item.description) {
    //       errors[`item_description_${index}`] = "Description is required";
    //     }
    //     if (!item.qty || item.qty <= 0) {
    //       errors[`item_qty_${index}`] = "Quantity must be greater than 0";
    //     }
    //     if (!item.rate || item.rate <= 0) {
    //       errors[`item_rate_${index}`] = "Rate must be greater than 0";
    //     }
    //   });
    // }

    // // Invoice Type
    // if (!selected || selected === "Select Invoice Type") {
    //   errors.invoice_type = "Invoice type is required";
    // }

    // // GST validation
    // if (isIntraInvoice) {
    //   if (!cgst && cgst !== 0) errors.cgst = "CGST is required";
    //   if (!sgst && sgst !== 0) errors.sgst = "SGST is required";
    // }

    // if (isInterInvoice) {
    //   if (!igst && igst !== 0) errors.igst = "IGST is required";
    // }

    // Status
    if (!status) {
      errors.status = "Status is required";
    }

    // Paid Date (when status selected)
    if (status && !paidDate) {
      errors.paidDate = "Paid date is required";
    }

    // Amount (not completed)
    if (status && status !== "completed" && !amount) {
      errors.amount = "Amount is required";
    }

    // Payment Type
    if (status && !paymentType) {
      errors.paymentType = "Payment type is required";
    }

    return errors;
  };



  const handlesubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateInvoiceForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const formData = {
        clientId: selectedClient,
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
        paid_date: paidDate,
        notes: notes,
        invoice_type: selected,
        igst,
        cgst,
        sgst,
        amount,
        paidDate,
        paymentType,

      };


      const response = await axios.post(
        `${API_URL}/api/invoice/create-invoice`,
        formData, { withCredentials: true }
      );

      // console.log("response:", response);


      Swal.fire({
        icon: "success",
        title: "Invoice added successfully!",
        showConfirmButton: true,
        timer: 1500,
      }).then(() => {
        navigate("/invoice-details");
      });

      setSelectedClient("");
      setSelectedProject("");
      setInvoiceDate("");
      setDueDate("");
      setCurreny({});
      setItems([
        {
          description: "",
          qty: "",
          rate: "",
          total: "",
        },
      ]);
      setSubTotal(0);
      setTax(18);
      setTotalAmount(0);
      setNotes("");
      setPaidDate("");
      setStatus("");
      setAmount("");
      setPaidDate("");
      setPaymentType("");

      fetchProject();
      setSelected("Select Invoice Type");

      setErrors({});
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

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-2 md:pt-10">
      <div>
        <Mobile_Sidebar />

        <div className="flex gap-2 items-center cursor-pointer">
          <p
            className="text-sm text-gray-500"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </p>
          <p>{">"}</p>

          <p className="text-sm text-gray-500" onClick={() => navigate("/invoice-details")}>Invoice List</p>
          <p>{">"}</p>

          <p className="text-sm text-blue-500">Add Invoice</p>
        </div>

        <div className="">
          <div className="bg-white p-2 md:p-5 rounded-xl overflow-y-auto px-2 py-4 md:px-5 md:py-6">
            <div className="flex justify-between items-center gap-2 ">
              <h2 className="text-xl font-semibold mb-4">Add Invoice</h2>
            </div>
            <div className="flex flex-wrap md:flex-nowrap">
              {/* left */}
              <div className="w-full border p-5 shadow-2xl rounded ">
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
                            className="block text-sm font-medium mb-2 w-[50%]"
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
                        <div className="w-full flex flex-wrap md:flex-nowrap mt-3">
                          <label
                            htmlFor="roleName"
                            className="block text-sm font-medium mb-2 w-[50%]"
                          >
                            Status<span className="text-red-500">*</span>
                          </label>
                          <select
                            name="status"
                            id="status"
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
                            <option value="completed">Completed</option>
                            <option value="advance_pending">Advance Pending</option>
                            <option value="partial_payment_pending">
                              Partial payment pending
                            </option>
                            <option value="final_payment_pending">
                              Final payment pending
                            </option>
                            <option value="advance_received">Advance received</option>
                            <option value="partial_payment_received">
                              Partial payment received
                            </option>

                          </select>

                        </div>
                        {errors.status && (
                          <p className="text-red-500 text-sm mb-4 flex justify-end">
                            {errors.status}
                          </p>
                        )}
                        {status && (
                          <div className="w-full flex mt-3">
                            <label className="w-[50%] text-sm font-medium">
                              Date <span className="text-red-500">*</span>
                            </label>

                            <input
                              type="date"
                              value={paidDate}
                              onChange={(e) => setPaidDate(e.target.value)}
                              className="w-full h-11 px-3 border rounded-lg"
                            />
                          </div>
                        )}

                        {errors.paidDate && (
                          <p className="text-red-500 text-sm mt-1 text-end">{errors.paidDate}</p>
                        )}




                        {status && (
                          <div className="w-full flex flex-wrap md:flex-nowrap mt-3">
                            <label className="block text-sm font-medium mb-2 w-[50%]">
                              Amount <span className="text-red-500">*</span>
                            </label>

                            <input
                              type="number"
                              value={amount}
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



                        {status && (
                          <div className="w-full flex flex-wrap md:flex-nowrap mt-3">
                            <label className="block text-sm font-medium mb-2 w-[50%]">
                              Type <span className="text-red-500">*</span>
                            </label>

                            <select
                              value={paymentType}
                              onChange={(e) => {
                                setPaymentType(e.target.value);
                                setErrors((prev) => ({ ...prev, paymentType: "" }));
                              }}
                              className="w-full h-11 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="" disabled>
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

              <div className="w-full md:w-[35%] md:border-l-4 p-3">
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

                      {errors.currency && (
                        <p className="text-red-500 text-sm mb-4">
                          {errors.currency}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap md:flex-nowrap justify-between gap-5 mt-3 p-2">

                    <div className="w-[250px] ">
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
                        <div className="mt-2 border rounded-xl bg-white shadow-md">

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
                                    className="flex text-[16px] justify-between items-center cursor-pointer hover:bg-gray-50  py-2 rounded-lg"
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
                                        className=" py-2 text-[12px] px-2 hover:bg-blue-50 rounded cursor-pointer"
                                      >
                                        Proforma Invoice
                                      </div>
                                      <div
                                        onClick={() =>
                                          selectItem(["Tax Invoice", "Intra", "Tax Invoice"])
                                        }
                                        className=" py-2 text-[12px] px-2 hover:bg-blue-50 rounded cursor-pointer"
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

                                    className="flex text-[16px] justify-between items-center cursor-pointer hover:bg-gray-50  py-2 rounded-lg"
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
                                        className=" py-2 text-[12px] px-2 hover:bg-blue-50 rounded cursor-pointer"
                                      >
                                        Proforma Invoice
                                      </div>
                                      <div
                                        onClick={() =>
                                          selectItem(["Tax Invoice", "Inter", "Tax Invoice"])
                                        }
                                        className="py-2 text-[12px] px-2 hover:bg-blue-50 rounded cursor-pointer"
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

   <div className="p-2">
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











              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
export default Invoice_full;
