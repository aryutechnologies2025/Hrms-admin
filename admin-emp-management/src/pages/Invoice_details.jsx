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

const Invoice_details = () => {
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
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

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

  const handleDelete = async (id) => {
    console.log("editid", id);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this role?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.post(
          `${API_URL}/api/invoice/delete-invoice/${id}`
        );
        Swal.fire("Deleted!", "The role has been deleted.", "success");
        console.log("res", res);
        setClientdetails((prev) => prev.filter((item) => item._id !== id));
      } catch (err) {
        console.error("Failed to delete:", err);
        Swal.fire("Error", "There was an error deleting the role.", "error");
      }
    } else {
      Swal.fire("Cancelled", "Your role is safe :)", "info");
    }
  };

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
        return new Date(data).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
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
            ReactDOM.render(
              <div
                className="action-container"
                style={{
                  display: "flex",
                  gap: "15px",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                {/* <div className="cursor-pointer">
                  <FaEye
                    
                  />
                </div> */}
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

  const header = (
    <>
      <span className="ql-formats">
        <select className="ql-header" defaultValue="">
          <option value="1" />
          <option value="2" />
          <option value="" />
        </select>
      </span>
      <span className="ql-formats">
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
      </span>
      <span className="ql-formats">
        <select className="ql-color" />
        <select className="ql-background" />
      </span>
      <span className="ql-formats">
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
      </span>
      <span className="ql-formats">
        <button className="ql-link" />
      </span>
    </>
  );

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

  const [itemsedit, setItemsedit] = useState([
    { descriptionedit: "", qtyedit: "", rateedit: "", totaledit: "" },
  ]);

  const [selectedClientedit, setSelectedClientedit] = useState("");
  const [selectedProjectedit, setSelectedProjectedit] = useState(null);
  const [invoiceDateedit, setInvoiceDateedit] = useState("");
  // console.log("selectedClientedit", selectedClientedit);
  const [dueDateedit, setDueDateedit] = useState("");
  const [currencyedit, setCurrenyedit] = useState("");
  const [subTotaledit, setSubTotaledit] = useState("");
  const [taxedit, setTaxedit] = useState("");
  const [totalAmountedit, setTotalAmountedit] = useState("");
  const [editid, setEditid] = useState([]);
  const [statusedit, setStatusedit] = useState("");
  const [notesedit, setNotesedit] = useState("");

  const handleChangeedit = (index, field, value) => {
    const updatedItems = [...itemsedit];
    updatedItems[index][field] = value;

    // Auto-calculate total when qty or rate changes
    if (field === "qtyedit" || field === "rateedit") {
      const qty = parseFloat(updatedItems[index].qtyedit) || 0;
      const rate = parseFloat(updatedItems[index].rateedit) || 0;
      updatedItems[index].totaledit = (qty * rate).toFixed(2);
    }

    setItemsedit(updatedItems);

    const subTotal = updatedItems.reduce((acc, item) => {
      const itemTotal = parseFloat(item.totaledit) || 0;
      return acc + itemTotal;
    }, 0);

    setSubTotaledit(subTotal.toFixed(2));
  };

  useEffect(() => {
    const suballtotal = parseFloat(subTotaledit) || 0;
    const taxPercent = parseFloat(taxedit) || 0;
    const taxAmount = (suballtotal * taxPercent) / 100;
    const totaledit = suballtotal + taxAmount;
    setTotalAmountedit(totaledit.toFixed(2));
  }, [subTotaledit, taxedit]);

  const addItemedit = () => {
    setItemsedit([
      ...itemsedit,
      { descriptionedit: "", qtyedit: "", rateedit: "", totaledit: "" },
    ]);
  };

  const deleteItemedit = (index) => {
    const updatedItems = [...itemsedit];
    updatedItems.splice(index, 1);
    setItemsedit(updatedItems);
  };

  const openEditModal = (row) => {
    console.log("rowData", row);

    setEditid(row._id);

    setSelectedClientedit(row.client || "-");

    setSelectedProjectedit(row.project || "-");

    const selectedCurrencyObj = currencyOptions.find(
      (currency) => currency.name === row.currency
    );
    setCurrenyedit(selectedCurrencyObj || "-");

    setInvoiceDateedit(row.invoice_date || "");
    setDueDateedit(row.due_date || "");
    // setCurrenyedit(row.currency || "");
    setSubTotaledit(row.sub_total || 0);
    setTaxedit(row.tax || 0);
    setTotalAmountedit(row.total_amount || 0);
    setStatusedit(row.status || "");

    // If you have items array to edit
    if (row.items && Array.isArray(row.items)) {
      const mappedItems = row.items.map((item) => ({
        descriptionedit: item.description || "",
        qtyedit: item.quantity || "",
        rateedit: item.rate || "",
        totaledit: item.amount || "",
      }));
      setItemsedit(mappedItems);
    }
    setNotesedit(row.notes || "-");
    // Optional: set country if needed

    setIsEditModalOpen(true);
  };

  const validateStatusedit = (value) => {
    const newErrors = { ...errors };
    if (!value) {
      newErrors.statusedit = ["Status is required"];
    } else {
      delete newErrors.statusedit;
    }
    setErrors(newErrors);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handlesubmitedit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        client: selectedClientedit,
        project: selectedProjectedit,
        invoice_date: invoiceDateedit,
        due_date: dueDateedit,
        currency: currencyedit.name,
        items: itemsedit.map((item) => ({
          description: item.descriptionedit,
          quantity: item.qtyedit,
          rate: item.rateedit,
          amount: item.totaledit,
        })),
        sub_total: subTotaledit,
        tax: taxedit,
        total_amount: totalAmountedit,
        status: statusedit,
        notes: notesedit,
      };

      const response = await axios.put(
        `${API_URL}/api/invoice/edit-invoice/${editid}`,
        formData
      );
      console.log("response:", response);
      Swal.fire({
        icon: "success",
        title: "Invoice Update successfully!",
        showConfirmButton: true,
        timer: 1500,
      });

      setIsEditModalOpen(false);
      fetchProject();

      //   fetchProject();
      setErrors({});
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error("Error submitting form:", err);
      }
    }
  };

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

        {/* Add Button */}
        <div className="flex justify-between mt-8 mb-3">
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
        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-xl w-[800px] h-[580px] overflow-y-auto px-8 py-6">
              <div className="flex justify-between items-center gap-2 ">
                <h2 className="text-xl font-semibold mb-4">Add Invoice</h2>
                <div className="flex gap-2">
                  <button
                    onClick={closeAddModal}
                    className=" bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                    onClick={handlesubmit}
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* name and company */}
              <div className="flex justify-between gap-5">
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
                    optionLabel="name"
                    placeholder="Select a Client"
                    className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.client && (
                    <p className="text-red-500 text-sm mb-4">{errors.client}</p>
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
                    optionLabel="name"
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

              <div className="flex justify-between gap-5 mt-3">
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
              <div className="flex justify-between gap-5 mt-3">
                <div className="w-full">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium mb-2"
                  >
                    Curreny
                  </label>
                  <Dropdown
                    value={currency}
                    onChange={(e) => setCurreny(e.value)}
                    options={currencyOptions}
                    optionLabel="name"
                    placeholder="Select a Currency"
                    className="w-[48%] border border-gray-300  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* item */}

              <div className="mt-3">
                <div className="flex justify-between">
                  <div className="text-lg font-medium  ">Items</div>
                  <button
                    onClick={addItem}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <IoMdAdd />
                  </button>
                </div>

                {items.map((item, index) => (
                  <div
                    key={index}
                    className="  items-start mb-4  border-b border-gray-800 pb-4"
                  >
                    <div className="flex flex-col">
                      <label className="text-sm font-medium mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        placeholder="Description"
                        className="border p-2 rounded"
                        value={item.description}
                        onChange={(e) =>
                          handleChange(index, "description", e.target.value)
                        }
                      />
                    </div>

                    <div className="flex gap-2 align-center mt-3">
                      <div className="flex flex-col w-[20%] ">
                        <label className="text-sm font-medium mb-1">Qty</label>
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

                      <div className="flex flex-col w-[20%]  ">
                        <label className="text-sm font-medium mb-1">Rate</label>
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

                      <div className="flex flex-col w-[20%]">
                        <label className="text-sm font-medium mb-1">
                          Total
                        </label>
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

                      <div className="flex items-end ">
                        <button
                          onClick={() => deleteItem(index)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 my-1 rounded "
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* contact person and coantact person */}

              <div className="flex justify-between gap-5 mt-3">
                <div className="w-full">
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium mb-2"
                  >
                    SubTotal
                  </label>
                  <input
                    type="text"
                    value={`${currency?.symbol || ""}${parseFloat(
                      subTotal || 0
                    ).toFixed(2)}`}
                    onChange={(e) => setSubTotal(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {/* {errors.contact_person && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.contact_person}
                    </p>
                  )} */}
                </div>
                <div className="w-full">
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium mb-2"
                  >
                    Tax(%)
                  </label>
                  <input
                    type="text"
                    value={tax}
                    onChange={(e) => setTax(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* country and website */}

              <div className="flex justify-between gap-5 mt-3">
                <div className="w-full">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium mb-2"
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
                <div className="w-full">
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium mb-2"
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
                    <option value="">Select a status</option>
                    <option value="0">Paid</option>
                    <option value="1">Pending</option>
                    <option value="2">OverDue</option>
                  </select>
                  {errors.status && (
                    <p className="text-red-500 text-sm mb-4">{errors.status}</p>
                  )}
                </div>
              </div>
              {/* address and notes */}

              <div className="flex justify-between gap-5 mt-3">
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
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-xl w-[500px] h-[380px] md:w-[800px] md:h-[580px] overflow-y-auto px-8 py-6">
              <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-2 ">
                <h2 className="text-xl font-semibold mb-4">Add Invoice</h2>
                <div className="flex gap-2">
                  <button
                    onClick={closeEditModal}
                    className=" bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                    onClick={handlesubmitedit}
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* name and company */}
              <div className="flex flex-wrap md:flex-nowrap justify-between gap-5">
                <div className="w-full">
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium mb-2"
                  >
                    Client
                  </label>
                  <Dropdown
                    value={selectedClientedit}
                    onChange={(e) => setSelectedClientedit(e.value)}
                    options={clientOption}
                    optionLabel="name"
                    placeholder="Select a Client"
                    className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium mb-2"
                  >
                    Project
                  </label>
                  <Dropdown
                    value={selectedProjectedit}
                    onChange={(e) => setSelectedProjectedit(e.value)}
                    options={projectOption}
                    optionLabel="name"
                    placeholder="Select a Project"
                    className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    value={
                      invoiceDateedit
                        ? new Date(invoiceDateedit).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => setInvoiceDateedit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {/* {errors.email && (
                    <p className="text-red-500 text-sm mb-4">{errors.email}</p>
                  )} */}
                </div>
                <div className="w-full">
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium mb-2"
                  >
                    Due Date
                  </label>
                  <input
                    type="date"
                    // value={dueDateedit}
                    value={
                      dueDateedit
                        ? new Date(dueDateedit).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => setDueDateedit(e.target.value)}
                    className="w-full px-3 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {/* {errors.phone_number && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.phone_number}
                    </p>
                  )} */}
                </div>
              </div>
              <div className="flex justify-between gap-5 mt-3">
                <div className="w-full">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium mb-2"
                  >
                    Curreny
                  </label>
                  <Dropdown
                    value={currencyedit}
                    onChange={(e) => setCurrenyedit(e.value)}
                    options={currencyOptions}
                    optionLabel="name"
                    placeholder="Select a Currency"
                    className="w-full md:w-[48%] border border-gray-300  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* item */}

              <div className="mt-3">
                <div className="flex justify-between">
                  <div className="text-lg font-medium  ">Items</div>
                  <button
                    onClick={addItemedit}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <IoMdAdd />
                  </button>
                </div>

                {itemsedit.map((item, index) => (
                  <div
                    key={index}
                    className="  items-start mb-4  border-b border-gray-800 pb-4"
                  >
                    <div className="flex flex-col">
                      <label className="text-sm font-medium mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        placeholder="Description"
                        className="border p-2 rounded"
                        value={item.descriptionedit}
                        onChange={(e) =>
                          handleChangeedit(
                            index,
                            "descriptionedit",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 align-center mt-3">
                      <div className="flex flex-wrap md:flex-col w-full md:w-[20%] ">
                        <label className="w-full text-sm font-medium mb-1">Qty</label>
                        <input
                          type="number"
                          placeholder="Qty"
                          className="border p-2 rounded"
                          value={item.qtyedit}
                          onChange={(e) =>
                            handleChangeedit(index, "qtyedit", e.target.value)
                          }
                        />
                      </div>

                      <div className="flex flex-wrap md:flex-col w-full md:w-[20%]  ">
                        <label className="w-full text-sm font-medium mb-1">Rate</label>
                        <input
                          type="number"
                          placeholder="Rate"
                          className="border p-2 rounded"
                          value={item.rateedit}
                          onChange={(e) =>
                            handleChangeedit(index, "rateedit", e.target.value)
                          }
                        />
                      </div>

                      <div className="flex flex-wrap md:flex-col w-full md:w-[20%]">
                        <label className="w-full text-sm font-medium mb-1">
                          Total
                        </label>
                        <input
                          type="text"
                          placeholder="Total"
                          className="border p-2 rounded bg-gray-100"
                          value={`${currency?.symbol || ""}${parseFloat(
                            item.totaledit || 0
                          ).toFixed(2)}`}
                          readOnly
                        />
                      </div>

                      <div className="flex items-end ">
                        <button
                          onClick={() => deleteItemedit(index)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 my-1 rounded "
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* contact person and coantact person */}

              <div className="flex justify-between gap-5 mt-3">
                <div className="w-full">
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium mb-2"
                  >
                    SubTotal
                  </label>
                  <input
                    type="text"
                    value={`${currency?.symbol || ""}${parseFloat(
                      subTotaledit || 0
                    ).toFixed(2)}`}
                    onChange={(e) => setSubTotaledit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {/* {errors.contact_person && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.contact_person}
                    </p>
                  )} */}
                </div>
                <div className="w-full">
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium mb-2"
                  >
                    Tax(%)
                  </label>
                  <input
                    type="text"
                    value={taxedit}
                    display
                    onChange={(e) => setTaxedit(e.target.value)}
                    className="w-full px-3 py-2 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* country and website */}

              <div className="flex justify-between gap-5 mt-3">
                <div className="w-full">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium mb-2"
                  >
                    Total Amount
                  </label>
                  <input
                    type="text"
                    value={`${currency?.symbol || ""}${parseFloat(
                      totalAmountedit || 0
                    ).toFixed(2)}`}
                    disabled
                    onChange={(e) => setTotalAmountedit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium mb-2"
                  >
                    Status
                  </label>
                  <select
                    name="status"
                    id="status"
                    value={statusedit}
                    onChange={(e) => {
                      setStatusedit(e.target.value);
                      validateStatusedit(e.target.value);
                    }}
                    className="w-full h-11 px-2 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a status</option>
                    <option value="0">Paid</option>
                    <option value="1">Pending</option>
                    <option value="2">OverDue</option>
                  </select>
                </div>
              </div>
              {/* address and notes */}

              <div className="flex justify-between gap-5 mt-3">
                <div className="w-full">
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium mb-2"
                  >
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={notesedit}
                    onChange={(e) => setNotesedit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  ></textarea>
                </div>
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
