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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Demo_invoice = () => {
  const navigate = useNavigate();

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
  console.log("errors::", errors);

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

  // client name deatails

  //
  const [clientOption, setClientOption] = useState(null);
  const [projectOption, setProjectOption] = useState(null);

  console.log("clientOption", clientOption);

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

      const clientName = response.data.data.map((emp) => emp.client_name);
      console.log("client name", clientName);
      setClientOption(clientName);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchaProjectList = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/invoice/get-project-name`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const clientName = response.data.data.map((emp) => emp.name);
      console.log("client name", clientName);
      setProjectOption(clientName);
    } catch (error) {
      console.log(error);
    }
  };

  const [status, setStatus] = useState("");

  useEffect(() => {
    // fetchData();
    // fetchEmployeeList();
    fetchaProjectList();
    fetchClientList();
  }, []);

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
    { description: "", qty: "", rate: "", total: "" },
  ]);

  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [currency, setCurreny] = useState("");
  const [subTotal, setSubTotal] = useState("");
  const [tax, setTax] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [notes, setNotes] = useState("");

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
  useEffect(() => {
    const subtotal = parseFloat(subTotal) || 0;
    const taxPercent = parseFloat(tax) || 0;
    const taxAmount = (subtotal * taxPercent) / 100;
    const total = subtotal + taxAmount;
    setTotalAmount(total.toFixed(2));
  }, [subTotal, tax]);

  const addItem = () => {
    setItems([...items, { description: "", qty: "", rate: "", total: "" }]);
  };

  const deleteItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  // const handlesubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const formData = {
  //       client: selectedClient,
  //       project: selectedProject,
  //       invoice_date: invoiceDate,
  //       due_date: dueDate,
  //       currency: currency.name,
  //       items: items.map((item) => ({
  //         description: item.description,
  //         quantity: item.qty,
  //         rate: item.rate,
  //         amount: item.total,
  //       })),
  //       sub_total: subTotal,
  //       tax: tax,
  //       total_amount: totalAmount,
  //       status: status,
  //       notes: notes,
  //     };

  //     const response = await axios.post(
  //       `${API_URL}/api/invoice/create-invoice`,
  //       formData
  //     );
  //     console.log("response:", response);

  //     setSelectedClient("");
  //     selectedProject("");
  //     setInvoiceDate("");
  //     setDueDate("");
  //     setCurreny("");
  //     setSubTotal("");
  //     setTax("");
  //     setTotalAmount("");
  //     setNotes("");

  //     setIsAddModalOpen(false);
  //     fetchProject();
  //     Swal.fire({
  //       icon: "success",
  //       title: "Client added successfully!",
  //       showConfirmButton: true,
  //       timer: 1500,
  //     });
  //     //   fetchProject();
  //     setErrors({});
  //   } catch (err) {
  //     if (err.response?.data?.errors) {
  //       setErrors(err.response.data.errors);
  //     } else {
  //       console.error("Error submitting form:", err);
  //     }
  //   }
  // };

  // edit invoice

  const handlesubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        client: selectedClient,
        project: selectedProject,
        invoice_date: invoiceDate,
        due_date: dueDate,
        currency: currency.name,
        items: items.map((item) => ({
          description: item.description,
          quantity: item.qty,
          rate: item.rate,
          amount: item.total,
        })),
        sub_total: subTotal,
        tax: tax,
        total_amount: totalAmount,
        status: status,
        notes: notes,
      };

      const response = await axios.post(
        `${API_URL}/api/invoice/create-invoice`,
        formData
      );

      console.log("response:", response);

      setIsAddModalOpen(false);

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
      setStatus("Draft");

      fetchProject();

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

  // const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [amountPaid, setAmountPaid] = useState(10);

  const [showDiscount, setShowDiscount] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [showtax, setShowtax] = useState(false);

  const subtotal = 10;
  const total = subtotal + (subtotal * tax) / 100 + shipping - discount;
  const balanceDue = total - amountPaid;

  const [selectedDate, setSelectedDate] = useState("");

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

          <p className="text-sm text-blue-500">Invoice List</p>
        </div>

        <div className="">
          <div className="bg-white p-5 rounded-xl  overflow-y-auto px-8 py-6 mt-8">
            <div className="flex justify-between items-center gap-2 "></div>
            <div className="flex  mt-4">
              {/* left */}
              <div className="w-[80%] border p-5 shadow-2xl rounded  pt-7">
                {" "}
                <div className="flex w-full gap-8">
                  {/* Left column */}
                  <div className="flex flex-col w-[70%]">
                    {/* Logo */}
                    <div className="border border-gray-300 rounded-md w-52 h-36 flex items-center justify-center text-gray-400">
                      + Add Your Logo
                    </div>

                    {/* From */}
                    <div className="mt-4">
                      <textarea
                        rows={3}
                        placeholder="   Who is this From?"
                        className="w-[60%] h-16 border border-gray-300 rounded-md p-2
             resize-none focus:outline-none
             hover:shadow-md hover:border-gray-400
                text-[13px] transition duration-200"
                      />
                    </div>

                    {/* Bill / Ship */}
                    <div className="flex  mt-3">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1 px-5">
                          Bill To
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Who is this to?"
                          className="w-[90%] border border-gray-300 rounded-md p-2 resize-none focus:outline-none hover:shadow-md hover:border-gray-400
                text-[13px] transition duration-200"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-500 mb-1 px-5">
                          Ship To
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Shipping address"
                          className="w-[90%] border border-gray-300 rounded-md p-2 resize-none focus:outline-none hover:shadow-md hover:border-gray-400
                text-[13px] transition duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right column */}
                  <div className="flex flex-col w-[30%] ">
                    <div className=" flex justify-end">
                      {/* <label className="block text-sm font-medium text-gray-500 mb-1 px-5">
                        Invoice #
                      </label> */}
                      <p className="text-black text-[35px]">INVOICE</p>
                    </div>
                    <div className=" flex justify-end ">
                      {/* <label className="block text-sm font-medium text-gray-500 mb-1 px-5">
                        Invoice #
                      </label> */}
                      <input
                        type="number"
                        placeholder=" # Invoice No"
                        className="w-[60%] border border-gray-300 rounded-md p-2 resize-none focus:outline-none hover:shadow-md hover:border-gray-400
                text-[13px] transition duration-200 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-appearance:textfield]"
                      />
                    </div>

                    <div className="flex justify-end items-center mt-10 gap-3 text-sm font-medium text-gray-400 w-full">
                      <label className="block">Date</label>

                    <div className="flex justify-end">
                          <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        className="w-44 border border-gray-300 rounded-md p-2 text-[13px] focus:outline-none hover:shadow-md hover:border-gray-400 transition duration-200"
                      />
                    </div>
                    </div>

                    <div className="flex justify-end items-center mt-3 gap-3 text-sm font-medium text-gray-400">
                      <label className="block ">Payment Terms</label>
                      <input
                        type="text"
                        className="w-44 border border-gray-300 rounded-md p-2 resize-none focus:outline-none hover:shadow-md hover:border-gray-400
                text-[13px] transition duration-200"
                      />
                    </div>

                    <div className="flex justify-end items-center mt-3  gap-3 text-sm font-medium text-gray-400">
                      <label className="block ">Due Date</label>
                      <div className="flex justify-end">
                          <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        className="w-44 border border-gray-300 rounded-md p-2 text-[13px] focus:outline-none hover:shadow-md hover:border-gray-400 transition duration-200"
                      />
                      </div>
                    </div>

                    <div className="flex justify-end items-center mt-3 gap-3 text-sm font-medium text-gray-400">
                      <label className="block ">PO Number</label>
                      <input
                        type="number"
                        className="w-44 border border-gray-300 rounded-md p-2 resize-none focus:outline-none hover:shadow-md hover:border-gray-400
                text-[13px] transition duration-200 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-appearance:textfield]"
                      />
                    </div>
                  </div>
                </div>
                {/* down */}
                <div className="mt-3">
                  <div className="flex justify-between">
                    <div className="text-lg font-medium  ">Items</div>
                  </div>
                  <div className="   mb-4 bg-[#132144] border-b border-gray-800 text-white py-2 mt-2 rounded  flex  gap-1 p-2">
                    <div className="flex flex-col w-full ">
                      <label className="text-sm font-medium mb-1">
                        Description
                      </label>
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
                      className="group items-start mb-4 border-b border-gray-800 pb-4 flex gap-1"
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

                      <div className="flex flex-col w-[15%] ">
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

                      <div className="flex flex-col w-[15%]  ">
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

                      <div className="flex flex-col w-[15%]">
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
                <div className="flex ">
                  {/* left */}
                  <div className="w-[50%]">
                    <div className="flex justify-between gap-5 mt-3">
                      <div className="w-full mt-3">
                        <label
                          htmlFor="notes"
                          className="block text-sm font-medium text-gray-400 mb-2 px-5"
                        >
                          Notes
                        </label>
                        <textarea
                          id="notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full px-3 h-16 py-2 border border-gray-300 rounded-md p-2 resize-none focus:outline-none hover:shadow-md hover:border-gray-400
                text-[13px] transition duration-200"
                          rows={4}
                        ></textarea>
                      </div>
                    </div>
                    <div className="flex justify-between gap-5 mt-2">
                      <div className="w-full mt-3">
                        <label
                          htmlFor="notes"
                          className="block text-sm font-medium text-gray-400 mb-2 px-5"
                        >
                          Terms
                        </label>
                        <textarea
                          id="notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder=""
                          className="w-full px-3 h-16 py-2 border border-gray-300 rounded-md p-2 resize-none focus:outline-none hover:shadow-md hover:border-gray-400
                text-[13px] transition duration-200 "
                          rows={4}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  {/* right */}
                  <div className="w-[50%] flex justify-end p-3">
                    <div className=" ">
                      <div className="w-64 space-y-4 text-gray-700 text-sm">
                        {/* Subtotal */}
                        <div className=" w-[90%] flex justify-between  text-sm font-medium text-gray-400">
                          <span className="text-sm font-medium text-gray-400">
                            Subtotal
                          </span>
                          <span>
                            {currency.symbol}
                            {subtotal.toFixed(2)}
                          </span>
                        </div>
                        {showtax && (
                          <div className="flex justify-between gap-4 items-center text-sm font-medium text-gray-400">
                            {" "}
                            <span>Tax</span>{" "}
                            <div className="flex items-center gap-2">
                              <div className="flex items-center border rounded-md px-2 hover:shadow-md hover:border-gray-400">
                                <span className="ml-1">{currency.symbol}</span>{" "}
                                <input
                                  type="number"
                                  value={tax}
                                  onChange={(e) =>
                                    setTax(Number(e.target.value))
                                  }
                                  className="w-16  border-r-2 p-1 border-gray-300 focus:outline-none text-right h-8 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-appearance:textfield]"
                                />{" "}
                                <span className="ml-1">%</span>{" "}
                              </div>{" "}
                              <button
                                type="button"
                                onClick={() => {
                                  setShowtax(false);
                                  //   setShipping(0);
                                }}
                                className="text-white hover:text-red-500 font-bold"
                              >
                                <MdClose className="w-5 h-6 mt-1" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Discount */}
                        {showDiscount && (
                          <div className="flex justify-between items-center text-sm font-medium text-gray-400">
                            <span>Discount</span>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center border  rounded-md px-2 hover:shadow-md hover:border-gray-400">
                                <span className="ml-1">{currency.symbol}</span>
                                <input
                                  type="number"
                                  value={discount}
                                  onChange={(e) =>
                                    setDiscount(Number(e.target.value))
                                  }
                                  className="w-16 border-r-2 p-1 border-gray-300 focus:outline-none text-right h-8 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-appearance:textfield]"
                                />
                                <span className="ml-1  ">%</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowDiscount(false);
                                  setDiscount(0);
                                }}
                                className="text-white hover:text-red-500 font-bold text-[20px]"
                              >
                                <MdClose className="w-5 h-6 mt-1" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Shipping */}
                        {showShipping && (
                          <div className="flex justify-between items-center text-sm font-medium text-gray-400 ">
                            <span>Shipping</span>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center border rounded-md px-2 hover:shadow-md hover:border-gray-400">
                                <span className="ml-1">{currency.symbol}</span>

                                <input
                                  type="number"
                                  value={shipping}
                                  onChange={(e) =>
                                    setShipping(Number(e.target.value))
                                  }
                                  className="w-16 border-r-2 p-1 border-gray-300 focus:outline-none text-right h-8 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-appearance:textfield]"
                                />
                                <span className="ml-1 ">%</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowShipping(false);
                                  setShipping(0);
                                }}
                                className="text-white hover:text-red-500 font-bold"
                              >
                                <MdClose className="w-5 h-6 mt-1" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* alldetails */}

                        <div className="flex flex-col space-y-2">
                          {/* Buttons Row */}
                          <div className="flex gap-4 text-emerald-600 font-medium">
                            {!showtax && (
                              <button
                                type="button"
                                onClick={() => setShowtax(true)}
                                className="text-emerald-900 hover:underline"
                              >
                                + Tax
                              </button>
                            )}
                            {!showDiscount && (
                              <button
                                type="button"
                                onClick={() => setShowDiscount(true)}
                                className="text-emerald-900 hover:underline"
                              >
                                + Discount
                              </button>
                            )}
                            {!showShipping && (
                              <button
                                type="button"
                                onClick={() => setShowShipping(true)}
                                className="text-emerald-900 hover:underline"
                              >
                                + Shipping
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Total */}

                        <div className=" w-[90%] flex justify-between  text-sm font-medium text-gray-400">
                          <span>Total</span>
                          <span>
                            {currency.symbol}
                            {total.toFixed(2)}
                          </span>
                        </div>

                        {/* Amount Paid */}
                        <div className=" w-[90%] flex justify-between items-center text-sm font-medium text-gray-400">
                          <span>Amount Paid</span>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center border rounded-md px-2 hover:shadow-md hover:border-gray-400">
                              <span className="mr-1">{currency.symbol}</span>
                              <input
                                type="number"
                                value={amountPaid}
                                onChange={(e) =>
                                  setAmountPaid(Number(e.target.value))
                                }
                                className="w-20 border-none focus:outline-none text-right h-8 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-appearance:textfield]"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Balance Due */}
                        <div className=" w-[90%] flex justify-between  text-sm font-medium text-gray-400">
                          <span>Balance Due</span>
                          <span>
                            {currency.symbol}
                            {balanceDue.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* right */}

              <div className="w-[20%] border-l-4 p-3">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 w-full h-10 font-semibold rounded"
                  onClick={handlesubmit}
                >
                  Save
                </button>
                <hr className="mt-5"></hr>

                <div>
                  {" "}
                  <div className="flex justify-between gap-5 mt-3 p-2">
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
                        className="w-full border border-gray-300  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
export default Demo_invoice;
