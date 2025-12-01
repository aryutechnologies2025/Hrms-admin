import React, { useState, useEffect, useRef, useMemo } from "react";

import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
DataTable.use(DT);

import axios from "../../api/axiosConfig";
import { API_URL } from "../../config";
import { capitalizeFirstLetter } from "../../utils/StringCaps";
import { TfiPencilAlt } from "react-icons/tfi";
import { RiDeleteBin6Line } from "react-icons/ri";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FileUpload } from "primereact/fileupload";
import { MultiSelect } from "primereact/multiselect";
import { FaEye } from "react-icons/fa";
import { Editor } from "primereact/editor";
import { FaTrash } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { AiFillDelete } from "react-icons/ai";
import { Calendar } from "primereact/calendar";
import { IoMdAdd } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import loader from "../Loader"
import { useDateUtils  } from "../../hooks/useDateUtils";

const Payment_type_details = () => {
  const navigate = useNavigate();
  const formatDateTime = useDateUtils();

  // const location = useLocation();

  const employeeIds = window.location.pathname.split("/")[2];
  console.log("window.location.pathname", employeeIds);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [isAnimating, setIsAnimating] = useState(false);

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10); // Delay to trigger animation
  };

  const closeAddModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAddModalOpen(false), 250); // Delay to trigger animation
  };

  const closeEditModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsEditModalOpen(false), 250);
    setErrors("");
  };

  // Fetch roles from the API
  useEffect(() => {
    fetchProject();
    fetchProjectListfilter();
  }, []);

  //   const [status, setStatus] = useState("");
  const storedDetatis = localStorage.getItem("hrmsuser");
  const parsedDetails = JSON.parse(null);
  const userid = parsedDetails ? parsedDetails.id : null;
  const [errors, setErrors] = useState({});

  const [clientdetails, setClientdetails] = useState([]);
  console.log("clientdetails", clientdetails);

  const [projectOptionfilter, setProjectOptionfilter] = useState([]);
  // console.log("projectOptionfilter", projectOptionfilter);

  const fetchProject = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/payment-type/view-paymenttype`
      );
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

  const fetchProjectListfilter = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/project/view-projects`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const projectName = response.data.data.map((emp) => ({
        label: emp.name,
        value: emp._id,
      }));

      setProjectOptionfilter(projectName);
    } catch (error) {
      console.error("Project fetch error:", error);
    }
  };

  // Open and close modals
  // const openAddModal = () => {
  //   setIsAddModalOpen(true);
  // };

  // const closeAddModal = () => {
  //   setIsAddModalOpen(false);
  //   setErrors("");
  // };
  const [clientOption, setClientOption] = useState(null);
  // console.log("clientOption", clientOption);
  const [projectOption, setProjectOption] = useState(null);

  const [gstno, setGstno] = useState([]);
  // foms values

  const [selectedClient, setSelectedClient] = useState(null);

  const [selectedProject, setSelectedProject] = useState(null);
  console.log("selectedProject", selectedProject);

  const [budget, setBudget] = useState("0");

  const [status, setStatus] = useState("");

  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true); 
  const [referenceNo, setReferenceNo] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [payments, setPayments] = useState([
    { date: "", value: "", errorDate: "", errorValue: "" },
  ]);
  const [fullpayment, setFullpayment] = useState(0);
  const [gst, setGst] = useState("");

  useEffect(() => {
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

        // const clientName = response.data.data.map((emp) => emp);
        const clientName = response.data.data.map((emp) => ({
          label: emp.client_name,
          value: emp._id,
        }));

        setClientOption(clientName);
        setLoading(false);
        setGstno(response.data?.setting?.[0]?.gst_percent || "");
      } catch (error) {
        console.error("Client fetch error:", error);
        setLoading(false);
      }
    };

    fetchClientList();
  }, [API_URL]);

  useEffect(() => {
    if (!selectedClient) {
      setProjectOption([]);
      setSelectedProject(null);
      return;
    }

    const fetchProjectList = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/invoice/get-project-name-with-client`,
          {
            params: { project: selectedClient },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        // const projectName = response.data.data.map((emp) => emp.name);

        setProjectOption(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Project fetch error:", error);
        setLoading(false);
      }
    };

    fetchProjectList();
  }, [selectedClient, API_URL]);

  // console.log("gst", gst);
  const fileInputRef = useRef(null);

  // gast total amount

  useEffect(() => {
    const budgetValue = Number(budget) || 0;
    const final =
      gst === "gst" ? budgetValue + (budgetValue * gstno) / 100 : budgetValue;

    setFullpayment(final);
  }, [budget, gst, gstno]);

  const handleChange = (index, field, newValue) => {
    const updated = [...payments];
    updated[index][field] = newValue;

    // Simple per-field validation
    if (field === "value") {
      updated[index].errorValue =
        !newValue || newValue <= 0 ? "Enter valid amount" : "";
      if (newValue && !updated[index].date) {
        updated[index].errorDate = "Enter date before amount";
      } else if (updated[index].date) {
        updated[index].errorDate = "";
      }
    }

    if (field === "date") {
      updated[index].errorDate = newValue ? "" : "Please select a date";
      // if there's already a value, re-validate it
      if (updated[index].value && newValue) {
        updated[index].errorValue =
          updated[index].value > 0 ? "" : "Enter  amount";
      }
    }

    setPayments(updated);
  };

  const validateLastRow = () => {
    // validate only the last payment row
    const updated = [...payments];
    const last = updated[updated.length - 1];

    if (!last.date && last.value) {
      last.errorDate = "Enter date before amount";
    } else if (!last.date) {
      last.errorDate = "Please select a date";
    }

    if (!last.value || last.value <= 0) {
      last.errorValue = "Enter amount";
    }

    setPayments(updated);

    // return true if valid
    return last.date && last.value && !last.errorDate && !last.errorValue;
  };

  const addPayment = () => {
    // run validation first
    if (!validateLastRow()) return;

    setPayments([
      ...payments,
      { date: "", value: "", errorDate: "", errorValue: "" },
    ]);
  };

  const removePayment = (index) =>
    setPayments(payments.filter((_, i) => i !== index));

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleDeleteFile = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (selectedProject?.gst_amount) {
      setBudget(selectedProject.gst_amount);
    } else {
      setBudget("0");
    }
  }, [selectedProject]);

  useEffect(() => {
    const total = payments.reduce((sum, p) => sum + Number(p.value || 0), 0);
    if (total >= budget) {
      setStatus("1");
    } else {
      setStatus("0");
    }
  }, [payments, budget]);

  //   filter

  const [selectedClientfillter, setSelectedClientfillter] = useState(null);
  const [selectedProjectfillter, setSelectedProjectfillter] = useState(null);
  //   const [errors, setErrors] = useState({});

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        client_name: selectedClient,
        project_name: selectedProject?._id,
        // budget: budget,
        // gst: gst,
        // gst_amount: fullpayment,

        payment_amount: payments.map((p) => ({
          date: p.date,
          payment: Number(p.value),
        })),
        reference_no: referenceNo,
        file: attachment,
        notes: note,
        status: status,
      };

      const response = await axios.post(
        `${API_URL}/api/payment-type/create-paymenttype`,
        formData
      );
      console.log("response:", response);
      Swal.fire({
        icon: "success",
        title: "Payment  added successfully!",
        showConfirmButton: true,
        timer: 1500,
      });

      setIsAddModalOpen(false);
      fetchProject();
      setErrors({});

      setSelectedClient(null);
      setSelectedProject(null);
      setBudget("0");
      setGst("");
      setFullpayment(0);
      setStatus("");

      setNote("");
      setReferenceNo("");
      setAttachment(null);
      setPayments([{ date: "", value: "", errorDate: "", errorValue: "" }]);

      //   fetchProject();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        // Network or unexpected error
        console.error("Error submitting form:", err);
        setErrors({ general: "Something went wrong. Please try again." });
      }
    }
  };

  //   edit

  //

  // foms values

  const [selectedClientedit, setSelectedClientedit] = useState(null);

  const [selectedProjectedit, setSelectedProjectedit] = useState(null);

  const [budgetedit, setBudgetedit] = useState("0");

  const [statusedit, setStatusedit] = useState("");

  const [noteedit, setNoteedit] = useState("");

  const [referenceNoedit, setReferenceNoedit] = useState("");
  const [attachmentedit, setAttachmentedit] = useState(null);
  const [paymentsedit, setPaymentsedit] = useState([
    { date: "", value: "", errorDate: "", errorValue: "" },
  ]);
  // console.log("paymentsedit",paymentsedit)
  const [fullpaymentedit, setFullpaymentedit] = useState(0);
  const [gstedit, setGstedit] = useState("");
  const [editid, setEditid] = useState([]);
  const [allrow, setAllrow] = useState([]);

  const openEditModal = (row) => {
    console.log("rowData", row);
    setAllrow(row);
    setEditid(row._id);
    setSelectedClientedit(row.client_name);
    setSelectedProjectedit(row.project_name?.name);
    setBudgetedit(row.project_name?.gst_amount);
    // setGstedit(row.gst);
    // setFullpaymentedit(Number(row.gst_amount) || 0);
    setStatusedit(row.status);
    if (Array.isArray(row.payment_amount)) {
      const mappedPayments = row.payment_amount.map((p) => ({
        date: p.date || "",
        value: p.payment || "",
        errorDate: "",
        errorValue: "",
      }));
      setPaymentsedit(mappedPayments);
    } else {
      setPaymentsedit([{ date: "", value: "", errorDate: "", errorValue: "" }]);
    }
    setReferenceNoedit(row.reference_no || "");
    setAttachmentedit(row.file || "");
    setNoteedit(row.notes);

    setIsEditModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const fileInputRefedit = useRef(null);
  useEffect(() => {
    const budgetValue = Number(budgetedit) || 0;
    const final =
      gstedit === "gst"
        ? budgetValue + (budgetValue * Number(gstno || 0)) / 100
        : budgetValue;

    setFullpaymentedit(final);
  }, [budgetedit, gstedit, gstno]);

  const handleChangeedit = (index, field, newValue) => {
    const updated = [...paymentsedit];
    updated[index][field] = newValue;

    // Simple per-field validation
    if (field === "value") {
      updated[index].errorValue =
        !newValue || newValue <= 0 ? "Enter valid amount" : "";
      if (newValue && !updated[index].date) {
        updated[index].errorDate = "Enter date before amount";
      } else if (updated[index].date) {
        updated[index].errorDate = "";
      }
    }

    if (field === "date") {
      updated[index].errorDate = newValue ? "" : "Please select a date";
      // if there's already a value, re-validate it
      if (updated[index].value && newValue) {
        updated[index].errorValue =
          updated[index].value > 0 ? "" : "Enter  amount";
      }
    }

    setPaymentsedit(updated);
  };

  const validateLastRowedit = () => {
    // validate only the last payment row
    const updated = [...paymentsedit];
    const last = updated[updated.length - 1];

    if (!last.date && last.value) {
      last.errorDate = "Enter date before amount";
    } else if (!last.date) {
      last.errorDate = "Please select a date";
    }

    if (!last.value || last.value <= 0) {
      last.errorValue = "Enter amount";
    }

    setPaymentsedit(updated);

    // return true if valid
    return last.date && last.value && !last.errorDate && !last.errorValue;
  };

  const addPaymentedit = () => {
    // run validation first
    if (!validateLastRowedit()) return;

    setPaymentsedit([
      ...paymentsedit,
      { date: "", value: "", errorDate: "", errorValue: "" },
    ]);
  };

  const removePaymentedit = (index) =>
    setPaymentsedit(paymentsedit.filter((_, i) => i !== index));

  const handleFileChangeedit = (e) => {
    if (e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleDeleteFileedit = () => {
    setAttachmentedit(null);
    if (fileInputRefedit.current) {
      fileInputRefedit.current.value = "";
    }
  };

  useEffect(() => {
    const total = paymentsedit.reduce(
      (sum, p) => sum + Number(p.value || 0),
      0
    );
    if (total >= budgetedit) {
      setStatusedit("1");
    } else {
      setStatusedit("0");
    }
  }, [paymentsedit, budgetedit]);

  const completedAmount = paymentsedit.reduce(
    (sum, p) => sum + Number(p.value || 0),
    0
  );
  const balanceAmount = Math.max(budgetedit - completedAmount, 0);

  const handlesubmitedit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        // client_name: selectedClientedit,
        // project_name: selectedProjectedit,
        // budget: budgetedit,
        // gst: gstedit,
        // gst_amount: fullpaymentedit,

        payment_amount: paymentsedit.map((p) => ({
          date: p.date,
          payment: Number(p.value),
        })),
        reference_no: referenceNoedit,
        file: attachmentedit,
        notes: noteedit,
        status: statusedit,
      };

      const response = await axios.put(
        `${API_URL}/api/payment-type/edit-paymenttype/${editid}`,
        formData
      );
      console.log("response:", response);
      Swal.fire({
        icon: "success",
        title: "Payment Update successfully!",
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

  // Validate Status dynamically

  const handleDelete = async (id) => {
    // console.log("editid", id);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this Payment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(
          `${API_URL}/api/payment-type/delete-paymenttype/${id}`
        );
        Swal.fire("Deleted!", "The Payment has been deleted.", "success");
        console.log("res", res);
        setClientdetails((prev) => prev.filter((item) => item._id !== id));
        // fetchProject();
      } catch (err) {
        console.error("Failed to delete:", err);
        Swal.fire("Error", "There was an error deleting the Payment.", "error");
      }
    } else {
      Swal.fire("Cancelled", "Your Payment is safe :)", "info");
    }
  };

  const [contentVisible, setContentVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");

  const [paymentVisible, setPaymentVisible] = useState(false);
  const [selectedPayments, setSelectedPayments] = useState([]);
  // console.log("selectedPayments", selectedPayments);

  const [paymentVisibleedit, setPaymentVisibleedit] = useState(false);
  const [selectedPaymentsedit, setSelectedPaymentsedit] = useState([]);

  // console.log("selectedPaymentsedit", selectedPaymentsedit);

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
      data: "client_name",
    },
    {
      title: "Project Name",
      data: null,
      render: (row) => row.project_name?.name || "-",
    },
    {
      title: "Budget",
      data: null,
      render: (row) => {
        const amount = row.project_name?.gst_amount;
        return amount != null
          ? `₹ ${Number(amount).toLocaleString("en-IN")}`
          : "-";
      },
    },

    // {
    //   title: "Gst",
    //   data: "gst",
    //   render: (gst) => (gst ? capitalizeFirstLetter(gst) : ""),
    // },

    // {
    //   title: "Full Payment",
    //   data: "gst_amount",
    // },
    // {
    //   title: "Payment",
    //   data: "payment_amount",
    //   render: (payments) => {
    //     if (!Array.isArray(payments) || payments.length === 0) return "-";

    //     return payments.map((p) => `${p.date} : ₹${p.payment}`).join(", ");
    //   },
    // },
    {
      title: "Payment",
      data: "payment_amount",
      render: (payments, type, row) => {
        const id = `payments-${row.sno || Math.random()}`;

        setTimeout(() => {
          const container = document.getElementById(id);
          if (container && !container.hasChildNodes()) {
            ReactDOM.render(
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FaEye
                  className="cursor-pointer text-black text-xl"
                  title="View Payments"
                  onClick={() => {
                    setSelectedPayments(row || []);
                    setPaymentVisible(true);
                  }}
                />
              </div>,
              container
            );
          }
        }, 0);

        return `<div id="${id}"></div>`;
      },
    },

    {
      title: "Note",
      data: null,
      render: (data, type, row) => {
        const id = `notes-${row.sno || Math.random()}`;

        setTimeout(() => {
          const container = document.getElementById(id);
          if (container && !container.hasChildNodes()) {
            ReactDOM.render(
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FaEye
                  className="cursor-pointer text-black text-xl"
                  title="Open"
                  onClick={() => {
                    setSelectedContent(row.notes);
                    setContentVisible(true);
                  }}
                />
              </div>,
              container
            );
          }
        }, 0);

        return `<div id="${id}"></div>`;
      },
    },
    {
      title: "Status",
      data: "status",
      render: (data, type, row) => {
        const textColor =
          data === "1"
            ? "text-green-600 border rounded-full border-green-600"
            : "text-red-600 border rounded-full border-red-600";

        return `<div class="${textColor}" style="display: inline-block; padding: 2px; color: ${textColor}; border: 1px solid ${textColor}; text-align: center; width:100px; font-size: 12px; font-weight:500">
                  ${data === "1" ? "Completed" : "Pending"}
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
  const [paymentType, setPaymentType] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const paymentTypeOptions = [
    { name: "Recurring", value: "recurring" },
    { name: "One Time", value: "one_time" },
  ];

  const paymentList = selectedPayments?.payment_amount ?? [];

  const totalReceived = paymentList.reduce(
    (acc, p) => acc + Number(p.payment || 0),
    0
  );

  const balance =
    Number(selectedPayments?.project_name?.gst_amount || 0) - totalReceived;

  // edit ahow

  const paymentListedit = selectedPaymentsedit?.payment_amount ?? [];

  const totalReceivededit = paymentListedit.reduce(
    (acc, p) => acc + Number(p.payment || 0),
    0
  );

  const balanceedit =
    Number(selectedPaymentsedit?.project_name?.gst_amount || 0) -
    totalReceivededit;

  const [filters, setFilters] = useState({
    client: "",
    project: "",
    date: "",
    status: "",
  });

  // Temporary filters for inputs before submit
  const [tempFilters, setTempFilters] = useState(filters);

  const clients = [
    ...new Set(clientdetails.map((r) => r.client_name).filter(Boolean)),
  ];

  const projects = [
    ...new Set(clientdetails.map((r) => r.project_name?.name).filter(Boolean)),
  ];

  // const statusOptions = ["1", "0"];

  const filteredData = useMemo(() => {
    return clientdetails.filter(
      (r) =>
        (!filters.client || r.client_name === filters.client) &&
        (!filters.project || r.project_name?.name === filters.project) &&
        (!filters.status || r.status === filters.status) &&
        (!filters.date ||
          new Date(r.date).toLocaleDateString("en-GB") ===
            new Date(filters.date).toLocaleDateString("en-GB"))
    );
  }, [clientdetails, filters]);
  const handleSubmit = () => setFilters(tempFilters);

  const handleReset = () => {
    setTempFilters({ client: "", project: "", date: "", status: "" });
    setFilters({ client: "", project: "", date: "", status: "" });
  };

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-2 md:pt-10">
      {loading ? (
        <loader />
      ) : (
        <>
      <div>
       

        <div className="flex justify-between gap-2 items-center cursor-pointer">
           <Mobile_Sidebar />
           <div className="flex gap-1 items-center">
          <p
            className="text-sm text-gray-500"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </p>
          <p>{">"}</p>
          <p className=" text-blue-500">Payment Type</p>
          <p>{">"}</p>
          </div>
        </div>

        <div className="flex justify-between mt-1 md:mt-4 mb-2 md:mb-3">
          <h1 className="text-2xl md:text-3xl font-semibold">Payment Type</h1>
          <button
            onClick={openAddModal}
            className=" px-3 py-2  text-white bg-blue-500 hover:bg-blue-600 font-medium w-20 rounded-2xl"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-4 mb-4 items-end ">
          {/* Client */}
          <div className="flex flex-col w-full md:w-48">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Client
            </label>
            <select
              value={tempFilters.client}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, client: e.target.value })
              }
              className="border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="">All Clients</option>
              {clients.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Project */}
          <div className="flex flex-col w-full md:w-48">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Project
            </label>
            <select
              value={tempFilters.project}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, project: e.target.value })
              }
              className="border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="flex flex-col w-full md:w-48">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={tempFilters.date}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, date: e.target.value })
              }
              className="border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col w-full md:w-48">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={tempFilters.status}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, status: e.target.value })
              }
              className="border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="1">Completed</option>
              <option value="0">Pending</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="datatable-container">
          {/* Responsive wrapper for the table */}
          <div className="table-scroll-container" id="datatable">
            <DataTable
              data={filteredData}
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

        {/* allpopup */}

        {contentVisible && (
          <div
            onClick={() => setContentVisible(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h2 className="text-2xl font-semibold text-gray-800">Notes</h2>
                <button
                  onClick={() => setContentVisible(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition"
                >
                  <IoClose className="text-xl" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
                <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
                  {selectedContent || "No reason provided."}
                </p>
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
                    ₹
                    {Number(
                      selectedPayments?.project_name?.gst_amount || 0
                    ).toLocaleString(2)}
                  </p>
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase text-gray-500">Received</p>
                  <p className="mt-1 text-lg font-semibold text-green-600">
                    ₹{totalReceived.toLocaleString(2)}
                  </p>
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase text-gray-500">Balance</p>
                  <p className="mt-1 text-lg font-semibold text-red-600">
                    ₹{balance.toLocaleString(2)}
                  </p>
                </div>
              </div>

              <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
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
                        {/* Show Payment 1, Payment 2, ... */}
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
              </div>
            </div>
          </div>
        )}

        {/* edit icon click */}

        {paymentVisibleedit && (
          <div
            onClick={() => setPaymentVisibleedit(false)}
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
                  onClick={() => setPaymentVisibleedit(false)}
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
                    {Number(
                      selectedPaymentsedit?.project_name?.gst_amount || 0
                    ).toLocaleString(2)}
                  </p>
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase text-gray-500">Received</p>
                  <p className="mt-1 text-lg font-semibold text-green-600">
                    ₹{totalReceivededit.toLocaleString(2)}
                  </p>
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase text-gray-500">Balance</p>
                  <p className="mt-1 text-lg font-semibold text-red-600">
                    ₹{balanceedit.toLocaleString(2)}
                  </p>
                </div>
              </div>

              <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
                <h3 className="mb-3 text-lg font-semibold text-gray-800">
                  Payment List
                </h3>

                {selectedPaymentsedit?.payment_amount?.length === 0 ? (
                  <p className="text-gray-700">No payments found.</p>
                ) : (
                  <ul className="space-y-2">
                    {selectedPaymentsedit.payment_amount.map((p, index) => (
                      <li
                        key={p._id}
                        className="flex justify-between border-b pb-1 text-sm text-gray-800"
                      >
                        {/* Show Payment 1, Payment 2, ... */}
                        <span className="font-medium">
                          Payment {index + 1} – {p.date}
                        </span>

                        {/* <span className="font-semibold">
                          ₹
                          {p.payment && p.value
                            ? `${p.payment} , ${p.value}`
                            : p.payment || p.value}
                        </span> */}
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
              </div>
            </div>
          </div>
        )}

        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
            {/* Overlay */}
            <div className="absolute inset-0 " onClick={closeAddModal}></div>

            <div
              className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[55vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${
                isAnimating ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full  mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                title="Toggle Sidebar"
                onClick={closeAddModal}
              >
                <IoIosArrowForward className="w-3 h-3" />
              </div>
              <div className="p-3 md:p-5">
                <h2 className="text-xl font-semibold mb-4">Add Payment</h2>

                {/* Leave Type */}
                <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-2">
                    Client name<span className="text-red-500">*</span>
                  </label>
                  <div className="w-[60%] md:w-[50%]">
                    <Dropdown
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.value)}
                      options={clientOption}
                      optionValue="value"
                      optionLabel="label"
                      filter
                      placeholder="Select a Client"
                      className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.client_name && (
                      <p className="text-red-500 text-sm mb-4">
                        {errors.client_name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Short Code */}
                <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-2">
                    Project Name<span className="text-red-500">*</span>
                  </label>
                  <div className="w-[60%] md:w-[50%]">
                    <Dropdown
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.value)}
                      options={projectOption}
                      optionLabel="name"
                      filter
                      placeholder="Select a Project"
                      className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.project_name && (
                      <p className="text-red-500 text-sm mb-4">
                        {errors.project_name}
                      </p>
                    )}
                  </div>
                </div>
                {/* buget */}

                <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-2">
                    Buget
                  </label>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="text"
                      value={budget}
                      disabled
                      className="w-full px-3 py-2 border border-gray-100 rounded-lg bg-gray-300"
                    />
                  </div>
                </div>

                {/* gstin  */}

                {/* <div className="mb-3 flex justify-end">
                  <div className="w-[50%] ">
                    <div className="flex gap-6">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="gstOption"
                          value="gst"
                          checked={gst === "gst"}
                          onChange={(e) => setGst(e.target.value)}
                          className="text-black cursor-pointer"
                        />
                        <span>With GST</span>
                      </label>

                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="gstOption"
                          value="without_gst"
                          checked={gst === "without_gst"}
                          onChange={(e) => setGst(e.target.value)}
                          className="text-black cursor-pointer"
                        />
                        <span>Without GST</span>
                      </label>
                    </div>

                    {errors.gst && (
                      <p className="text-red-500 text-sm mb-4">{errors.gst}</p>
                    )}
                  </div>
                </div> */}

                {/* full amount */}

                {/* <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-2">
                    Full Payment
                  </label>
                  <div className="w-[50%]">
                    <input
                      type="text"
                      value={fullpayment.toFixed(2)}
                      disabled
                      className="w-full px-3 py-2 border border-gray-100 rounded-lg bg-gray-300"
                    />
                  </div>
                </div> */}

                {/* date */}

                {/* <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-2">
                    Payment Date <span className="text-red-500">*</span>
                  </label>
                  <div className="w-[50%]">
                    {" "}
                    <input
                      type="date"
                      value={paymentDate}
                      placeholder="Enter Payment Date"
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full  px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.shotKey && (
                      <p className="text-red-500 text-sm mb-4">
                        {errors.shotKey}
                      </p>
                    )}
                  </div>
                </div>

           

                <div>
                  {payments.map((payment, index) => (
                    <div
                      key={index}
                      className=" group mb-3 flex justify-between items-center"
                    >
                      <label className="block text-sm font-medium mb-2 w-[40%]">
                        Payment {index + 1}
                        <span className="text-red-500">*</span>
                      </label>

                      <div className="w-[50%] flex gap-2">
                        <input
                          type="number"
                          min={1}
                          value={payment.value}
                          onChange={(e) => handleChange(index, e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2
                ${
                  payment.error
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                        />

                        {index !== 0 && (
                          <button
                            type="button"
                            onClick={() => removePayment(index)}
                            className="b text-white group-hover:text-[#e83b10]
                 transition-colors duration-200"
                          >
                            <MdCancel size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addPayment}
                    className="flex items-center gap-1 text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-600 hover:text-white"
                  >
                    <IoMdAdd /> Add Payment
                  </button>
                </div> */}

                {payments.map((p, index) => (
                  <div key={index} className="group mb-3 flex  justify-between">
                    <label className="block text-sm font-medium ">
                      Payment {index + 1}{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <div className="flex flex-col md:flex-row gap-2 w-[60%] md:w-[50%]">
                      {/* Date input */}
                      <div className="flex-1">
                        <input
                          type="date"
                          value={p.date}
                          onChange={(e) =>
                            handleChange(index, "date", e.target.value)
                          }
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            p.errorDate
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                          }`}
                        />
                        {p.errorDate && (
                          <p className="text-red-500 text-sm mt-1">
                            {p.errorDate}
                          </p>
                        )}
                      </div>

                      {/* Amount input */}
                      <div className="flex-1">
                        <input
                          type="number"
                          min={1}
                          value={p.value}
                          placeholder="Enter Amount"
                          onChange={(e) =>
                            handleChange(index, "value", e.target.value)
                          }
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            p.errorValue
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                          }`}
                        />
                        {p.errorValue && (
                          <p className="text-red-500 text-sm mt-1">
                            {p.errorValue}
                          </p>
                        )}
                      </div>

                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => removePayment(index)}
                          className="text-white group-hover:text-red-600 mb-0"
                        >
                          <MdCancel size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add button with validation */}
                <div className='flex justify-end md:justify-start'>
                <button
                  type="button"
                  onClick={addPayment}
                  className="flex items-center gap-1 text-blue-600 border border-blue-600 px-5 md:px-3 py-1 rounded hover:bg-blue-600 hover:text-white"
                >
                  <IoMdAdd /> Add Payment
                </button>
                </div>

                <div className="flex flex-wrap md:flex-row md:items-center md:justify-between gap- mt-1">
                  <label className="block w-[80%] text-sm font-medium text-gray-700">
                    Reference No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={referenceNo}
                    onChange={(e) => setReferenceNo(e.target.value)}
                    placeholder="Enter reference number"
                    className="w-full md:w-1/2 px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {errors.referenceNo && (
                  <p className="text-red-500 text-sm">{errors.referenceNo}</p>
                )}
                <div className="flex justify-center md:justify-end mt-1 md:mt-2 w-full text-black">
                  (or)
                </div>

                {/* Attachment */}
                <div className="flex flex-wrap md:flex-row md:items-center md:justify-between gap-3 md:mt-3 mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Attachment
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end w-full ">
                  {attachment && (
                    <div className=" px-3 py-2  flex justify-between">
                      <span className="text-sm text-gray-700 truncate">
                        {attachment.name}
                      </span>
                      <button
                        type="button"
                        onClick={handleDeleteFile}
                        title="Delete"
                        className="text-red-600 hover:text-red-800 text-[18px] font-medium ml-4"
                      >
                        <AiFillDelete />
                      </button>
                    </div>
                  )}
                </div>

                {/* Status Dropdown */}
                <div className="mb-3 flex justify-between ">
                  <label className="block text-sm font-medium mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <div className="w-[60%] md:w-[50%]">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2"
                    >
                      <option value="">Select Status</option>
                      <option value="1">Completed</option>
                      <option value="0">Pending</option>
                    </select>
                    {errors.status && (
                      <p className="text-red-500 text-sm mb-4">
                        {errors.status}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-2">
                    Notes
                  </label>
                  <div className="w-[60%] md:w-[50%]">
                    {" "}
                    <textarea
                      value={note}
                      placeholder="Enter Notes"
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full  px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.shotKey && (
                      <p className="text-red-500 text-sm mb-4">
                        {errors.shotKey}
                      </p>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={closeAddModal}
                    className="bg-red-100 hover:bg-red-200 text-sm text-red-600 px-5 py-2 font-semibold rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlesubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 font-semibold rounded-full"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-40">
            {/* Overlay */}
            <div className="absolute inset-0 " onClick={closeEditModal}></div>

            <div
              className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[55vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${
                isAnimating ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full  mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                title="Toggle Sidebar"
                onClick={closeEditModal}
              >
                <IoIosArrowForward className="w-3 h-3" />
              </div>
              <div className="p-5">
                <div className="flex justify-between">
                  <h2 className="text-xl font-semibold mb-4">Edit Payment</h2>
                  <FaEye
                    className="cursor-pointer text-black text-xl"
                    title="View Payments"
                    onClick={() => {
                      setSelectedPaymentsedit(allrow || []);
                      setPaymentVisibleedit(true);
                    }}
                  />
                </div>

                {/* Leave Type */}
                <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-2">
                    Client name<span className="text-red-500">*</span>
                  </label>
                  <div className="w-[60%] md:w-[50%]">
                    {/* <Dropdown
                      value={selectedClientedit}
                      onChange={(e) => setSelectedClientedit(e.value)}
                      options={clientOption}
                      optionLabel="name"
                      placeholder="Select a Client"
                      className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    /> */}
                    <input
                      type="text"
                      value={selectedClientedit}
                      disabled
                      className="w-full px-3 py-2 border border-gray-100 rounded-lg bg-gray-300"
                    />
                    {errors.type && (
                      <p className="text-red-500 text-sm mb-4">{errors.type}</p>
                    )}
                  </div>
                </div>

                {/* Short Code */}
                <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-2">
                    Project Name<span className="text-red-500">*</span>
                  </label>
                  <div className="w-[60%] md:w-[50%]">
                    {/* <Dropdown
                      value={selectedProjectedit?.name}
                      onChange={(e) => setSelectedProjectedit(e.value)}
                      options={projectOption}
                      optionLabel="name"
                      placeholder="Select a Project"
                      className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    /> */}
                    <input
                      type="text"
                      value={selectedProjectedit}
                      disabled
                      className="w-full px-3 py-2 border border-gray-100 rounded-lg bg-gray-300"
                    />
                  </div>
                </div>
                {/* buget */}

                <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-2">
                    Buget
                  </label>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="text"
                      value={budgetedit}
                      disabled
                      className="w-full px-3 py-2 border border-gray-100 rounded-lg bg-gray-300"
                    />
                  </div>
                </div>

                {/* gstin  */}

                {/* <div className="mb-3 flex justify-end">
                  <div className="w-[50%] flex gap-6">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="gstOption"
                        value="gst"
                        checked={gstedit === "gst"}
                        onChange={(e) => setGstedit(e.target.value)}
                        className="text-black cursor-pointer"
                      />
                      <span>With GST</span>
                    </label>

                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="gstOption"
                        value="without_gst"
                        checked={gstedit === "without_gst"}
                        onChange={(e) => setGstedit(e.target.value)}
                        className="text-black cursor-pointer"
                      />
                      <span>Without GST</span>
                    </label>
                  </div>
                </div> */}

                {/* full amount */}

                {/* <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-2">
                    Full Payment
                  </label>
                  <div className="w-[50%]">
                    <input
                      type="text"
                      value={
                        typeof fullpaymentedit === "number"
                          ? fullpaymentedit.toFixed(2)
                          : "0.00"
                      }
                      disabled
                      className="w-full px-3 py-2 border border-gray-100 rounded-lg bg-gray-300"
                    />
                  </div>
                </div> */}

                {paymentsedit.map((p, index) => (
                  <div key={index} className="group mb-3 flex  justify-between">
                    <label className="block text-sm font-medium ">
                      Payment {index + 1}{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <div className="flex flex-col md:flex-row gap-2  w-[60%] md:w-[50%]">
                      {/* Date input */}
                      <div className="flex-1">
                        <input
                          type="date"
                          value={p.date}
                          onChange={(e) =>
                            handleChangeedit(index, "date", e.target.value)
                          }
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            p.errorDate
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                          }`}
                        />
                        {p.errorDate && (
                          <p className="text-red-500 text-sm mt-1">
                            {p.errorDate}
                          </p>
                        )}
                      </div>

                      {/* Amount input */}
                      <div className="flex-1">
                        <input
                          type="number"
                          min={1}
                          placeholder="Enter Amount"
                          value={p.value}
                          onChange={(e) =>
                            handleChangeedit(index, "value", e.target.value)
                          }
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            p.errorValue
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-blue-500"
                          }`}
                        />
                        {p.errorValue && (
                          <p className="text-red-500 text-sm mt-1">
                            {p.errorValue}
                          </p>
                        )}
                      </div>

                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => removePaymentedit(index)}
                          className="text-white group-hover:text-red-600 mb-0"
                        >
                          <MdCancel size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addPaymentedit}
                  className="flex items-center gap-1 text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-600 hover:text-white"
                >
                  <IoMdAdd /> Add Payment
                </button>

                <div className="mt-3 flex justify-between">
                  <label className="block text-sm font-medium">
                    Total Amount Received
                  </label>
                  <div className="w-[50%]">
                    <input
                      type="text"
                      value={completedAmount.toFixed(2)}
                      disabled
                      className="w-full px-3 py-2 border border-gray-100 rounded-lg bg-green-100 text-green-800
"
                    />
                  </div>
                </div>

                {/* Balance */}
                <div className="mt-3 flex justify-between mb-3">
                  <label className="block text-sm font-medium">Balance</label>
                  <div className="w-[50%]">
                    <input
                      type="text"
                      value={balanceAmount.toFixed(2)}
                      disabled
                      className="w-full px-3 py-2 border border-gray-100 rounded-lg bg-amber-100 text-amber-800
"
                    />
                  </div>
                </div>

                {/* Add button with validation */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Reference No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={referenceNoedit}
                    onChange={(e) => setReferenceNoedit(e.target.value)}
                    placeholder="Enter reference number"
                    className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {errors.referenceNo && (
                  <p className="text-red-500 text-sm">{errors.referenceNo}</p>
                )}
                <div className="flex justify-end mt-2 w-[80%] text-black">
                  (or)
                </div>

                {/* Attachment */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-3 mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Attachment
                  </label>
                  <input
                    type="file"
                    ref={fileInputRefedit}
                    onChange={handleFileChangeedit}
                    className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end w-full ">
                  {attachmentedit && (
                    <div className=" px-3 py-2  flex justify-between">
                      <span className="text-sm text-gray-700 truncate">
                        {attachmentedit.name}
                      </span>
                      <button
                        type="button"
                        onClick={handleDeleteFileedit}
                        title="Delete"
                        className="text-red-600 hover:text-red-800 text-[18px] font-medium ml-4"
                      >
                        <AiFillDelete />
                      </button>
                    </div>
                  )}
                </div>

                {/* Status Dropdown */}
                <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <div className="w-[60%] md:w-[50%]">
                    <select
                      value={statusedit}
                      onChange={(e) => setStatusedit(e.target.value)}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2"
                    >
                      <option value="">Select Status</option>
                      <option value="1">Completed</option>
                      <option value="0">Pending</option>
                    </select>
                    {errors.status && (
                      <p className="text-red-500 text-sm mb-4">
                        {errors.status}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-3 flex justify-between">
                  <label className="block text-sm font-medium mb-2">
                    Notes
                  </label>
                  <div className="w-[60%] md:w-[50%]">
                    {" "}
                    <textarea
                      value={noteedit}
                      placeholder="Enter Notes"
                      onChange={(e) => setNoteedit(e.target.value)}
                      className="w-full  px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.shotKey && (
                      <p className="text-red-500 text-sm mb-4">
                        {errors.shotKey}
                      </p>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={closeEditModal}
                    className="bg-red-100 hover:bg-red-200 text-sm text-red-600 px-5 py-2 font-semibold rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlesubmitedit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 font-semibold rounded-full"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
         </>
      )}
      <Footer />
    </div>
  );
};
export default Payment_type_details;
