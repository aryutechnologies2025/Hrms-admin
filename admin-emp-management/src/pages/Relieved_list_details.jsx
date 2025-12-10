import React, { useState, useEffect, useRef } from "react";

import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
DataTable.use(DT);

import axios from "../api/axiosConfig";
import { API_URL } from "../config";
import { capitalizeFirstLetter } from "../utils/StringCaps";

import { TfiPencilAlt } from "react-icons/tfi";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";
import Footer from "../components/Footer";
import Mobile_Sidebar from "../components/Mobile_Sidebar";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "primereact/checkbox";
import { IoIosArrowForward } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { FaClipboardList } from "react-icons/fa";
import Letters_download from "../components/releiving components/Letters_download";
import { createRoot } from "react-dom/client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Loader from "../components/Loader";
import { FiDownload, FiPrinter } from "react-icons/fi";

import { useDateUtils } from "../hooks/useDateUtils";

const Relieved_list_details = () => {
  const navigate = useNavigate();
  const formatDateTime = useDateUtils();
  // const location = useLocation();

  const employeeIds = window.location.pathname.split("/")[2];
  // console.log("window.location.pathname", employeeIds);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [alldatarow, setAlldatarow] = useState("");
  const EmpolyeeId = alldatarow.id;

  // console.log("EmpolyeeId",EmpolyeeId);


  const openAddModal = (row) => {
    setAlldatarow(row);
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

  const [dropdownTitle, setDropdownTitle] = useState("");
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState("");
  // Fetch roles from the API
  useEffect(() => {
    fetchProject();
    fetchletter();
  }, [EmpolyeeId]);

  //   const [status, setStatus] = useState("");
  const storedDetatis = localStorage.getItem("hrmsuser");
  const parsedDetails = JSON.parse(null);
  const userid = parsedDetails ? parsedDetails.id : null;
  const [errors, setErrors] = useState({});
  const [clientdetails, setClientdetails] = useState([]);
  // const [employeeid ,setEmployeeid] =useState([]);

  const [letterlistdetails, setLetterlistdetails] = useState([]);
  console.log("letterlistdetails", letterlistdetails);

  const fetchProject = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/employees/reliving-list`, {
        params: {
          type: "relieved",
        }

      }
      );
      console.log("re", response);
      if (response.data.success) {
        setClientdetails(response.data.data);
        setLoading(false);
        // setRelievingCheckList(response.data);
      } else {
        setErrors("Failed to fetch roles.");
      }
    } catch (err) {
      setErrors("Failed to fetch roles.");
      setLoading(false);
    }
  };

  const fetchletter = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/employees/reliving-list,${EmpolyeeId}`
      );
      // console.log("re", response);
      if (response.data.success) {
        setLetterlistdetails(response);
        setLoading(false);
        // setRelievingCheckList(response.data);
      } else {
        setErrors("Failed to fetch roles.");
      }
    } catch (err) {
      setErrors("Failed to fetch roles.");
      setLoading(false);
    }
  };

  // Open and close modals

  // const handleAddOption = () => {
  //   if (dropdownTitle.trim() !== "") {
  //     setOptions((prev) => [...prev, { option: dropdownTitle }]);
  //     setDropdownTitle("");
  //   }
  // };

  const [optionError, setOptionError] = useState("");

  const handleAddOption = () => {
    if (dropdownTitle.trim() === "") {
      setOptionError("Option cannot be empty");
      return;
    }
    setOptions((prev) => [...prev, { option: dropdownTitle }]);
    setDropdownTitle("");
    setOptionError(""); // clear error after adding
  };

  const [status, setStatus] = useState("");

  //   const [errors, setErrors] = useState({});

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const verification = Object.entries(values).map(([key, val]) => ({
        name: key,
        options: val,
      }));
      const formData = {
        // ...values,
        emp_id: alldatarow?.id,
        employeeName: alldatarow?.employeeName,
        employeeId: alldatarow?.employeeId,
        role: alldatarow?.role,
        dateOfJoining: alldatarow?.dateOfBirth
          ? new Date(alldatarow.dateOfBirth).toISOString()
          : null,
        lastRelivingDate: alldatarow?.lastDate
          ? new Date(alldatarow.lastDate).toISOString()
          : null,
        verification,
        status: alldatarow.status,
      };
      console.log("formData", formData);

      const response = await axios.post(
        `${API_URL}/api/reliving-verify/create-relivinglist-verify`,
        formData
      );
      console.log("response:", response);
      Swal.fire({
        icon: "success",
        title: "Status added successfully!",
        showConfirmButton: true,
        timer: 1500,
      });

      setIsAddModalOpen(false);
      fetchProject();

      setOptions([]);

      //   fetchProject();
      setErrors({});
    } catch (err) {
      setErrors(err.response.data.errors);
      // if (err.response?.data?.errors) {
      //   setErrors(err.response.data.errors);
      // } else {
      //   console.error("Error submitting form:", err);
      // }
    }
  };

  //   edit
  // states for edit

  // const closeEditModal = () => {
  //   setIsEditModalOpen(false);
  //   setErrors("");
  // };

  const [contentVisible, setContentVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");

  const columns = [
    {
      title: "Sno",
      data: null,
      render: function (data, type, row, meta) {
        return meta.row + 1;
      },
    },

    {
      title: "Employee",
      data: null,
      render: (row) => {
        
        return `${row.employeeName} <br/> <span class="text-blue-500 text-sm"> ${row.role}</span>`;
      },
    },
    {
      title: "Joining Date",
      data: "relievingCheckList.dateOfJoining",
      render: (data) => {
        if (!data) return "-";
        return formatDateTime(data);
      },
    },
    {
      title: "Last Resignation Email Date",
      data: "resignationEmailDate",
      render: (data) => {
        if (!data) return "-";
        return formatDateTime(data);
      },
    },

    {
      title: "Notice period",
      data: "noticePeriod",
      // render: (data) => {
      //   return data || "-";
      // },
    },

    {
      title: "Last working date",
      data: "lastDate",
      render: (data) => {
        if (!data) return "-";
        return formatDateTime(data);
      },
    },

    {
      title: "Reason",
      data: null,
      render: (data, type, row) => {
        const id = `reason-${row.sno || Math.random()}`;

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
                    setSelectedContent(row.reason);
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
      title: "Reliving List",
      data: null,
      render: (data, type, row) => {
        const id = `reason-${row.sno || Math.random()}`;

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
                <FaClipboardList
                  className="cursor-pointer text-black text-xl"
                  title="Open"
                  //   onClick={() => {
                  //     setSelectedContent(row.reason);
                  //     setContentVisible(true);
                  //   }}
                  onClick={() => openAddModal(row)}
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
      render: (data) => {
        const baseClass =
          data === "Completed"
            ? "text-green-600 border rounded-full border-green-600 "
            : "text-red-600 border rounded-full border-red-600";

        return `<div class="${baseClass} inline-block  text-center w-[100px] text-[16px] rounded font-size: 12px; font-weight: 500">
              ${data === "Completed" ? "Completed" : "PENDING"}
            </div>`;
      },
    },

    // {
    //   title: "Action",
    //   data: null,
    //   render: (data, type, row) => {
    //     const id = `actions-${row.sno || Math.random()}`;
    //     setTimeout(() => {
    //       const container = document.getElementById(id);
    //       if (container && !container.hasChildNodes()) {
    //         ReactDOM.render(
    //           <div
    //             className="action-container"
    //             style={{
    //               display: "flex",
    //               gap: "15px",
    //               alignItems: "flex-end",
    //               justifyContent: "center",
    //             }}
    //           >
    //             {/* <div className="cursor-pointer">
    //               <FaEye

    //               />
    //             </div> */}
    //             <div
    //               className="modula-icon-edit  flex gap-2"
    //               style={{
    //                 color: "#000",
    //               }}
    //             >
    //               <TfiPencilAlt
    //                 className="cursor-pointer"
    //                 title="Edit"
    //                 onClick={() => openEditModal(row)}
    //               />
    //               <MdOutlineDeleteOutline
    //                 className="text-red-600 text-xl cursor-pointer"
    //                 title="Delete"
    //                 onClick={() => handleDelete(row._id)}
    //               />
    //             </div>

    //             {/* <div className="modula-icon-del" style={{
    //               color: "red"
    //             }}>
    //               <RiDeleteBin6Line
    //                 onClick={() => handleDelete(row.id)}
    //               />
    //             </div> */}
    //           </div>,
    //           container
    //         );
    //       }
    //     }, 0);
    //     return `<div id="${id}"></div>`;
    //   },
    // },
  ];

  //   all buttons

  const step2Fields = [
    { type: "checkbox", name: "skills", options: ["React", "Node", "UI/UX"] },
    { type: "dropdown", name: "country", options: ["India", "USA", "UK"] },
    {
      type: "radio",
      name: "status",
      options: ["Active", "Inactive", "Pending"],
    },
    {
      type: "radio",
      name: "checktat",
      options: ["Active", "ksjkhnd", "Pending"],
    },
  ];

  const [fields, setFields] = useState();

  useEffect(() => {
    fetchReliving();
  }, []);

  const fetchReliving = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/reliving/view-relivinglist`
      );
      if (response.data.success) {
        // const list = response.data.data;
        setFields(response.data.data);
        // setFields(list);
      } else {
        setErrors("Failed to fetch checklist.");
      }
    } catch (err) {
      setErrors("Failed to fetch checklist.");
    }
  };

  //   const step2Field = {
  //     type: relievingCheckList.input.toLowerCase(),
  //     name: relievingCheckList.title,
  //     options: relievingCheckList.inputField.map((f) => f.option),
  //   };

  useEffect(() => {
    if (!alldatarow) return;

    if (alldatarow.relievingCheckList?.verification) {
      // Build filled object only if verification exists
      const filled = {};
      alldatarow.relievingCheckList.verification.forEach((item) => {
        filled[item.name] = item.options;
      });
      setValues(filled);
    } else {
      //  Important: clear old answers
      setValues({});
    }
  }, [alldatarow]);

  // console.log("fields:", fields);
  const [values, setValues] = useState({});

  const handleChange = (name, value) => {
    setValues((p) => ({ ...p, [name]: value }));
  };
  const handleCheckbox = (name, option) => {
    setValues((p) => {
      const arr = p[name] || [];
      return arr.includes(option)
        ? { ...p, [name]: arr.filter((v) => v !== option) }
        : { ...p, [name]: [...arr, option] };
    });
  };

  // handledowbload

  // const handleDownload = async (letterTitle, employeeId) => {
  //   // console.log("letterTitle", letterTitle, employeeId);
  //   // create hidden container
  //   const container = document.createElement("div");
  //   container.style.position = "absolute";
  //   container.style.left = "-9999px";
  //   document.body.appendChild(container);

  //   // const root = createRoot(container);

  //   // wait for component to finish rendering
  //   // await new Promise((resolve) => {
  //   ReactDOM.render(
  //     <Letters_download
  //       letterTitle={letterTitle._id}
  //       employeeId={employeeId.id}
  //       // onReady={resolve} // called after Letters_download mounts
  //     />,
  //     container
  //   );
  //   //   );
  //   // });

  //   await new Promise((resolve) => setTimeout(resolve, 100));

  //   // capture canvas
  //   // const canvas = await html2canvas(container, {
  //   //   scale: window.devicePixelRatio,
  //   //   backgroundColor: "#fff",
  //   //   useCORS: true,
  //   // });
  //   const canvas = await html2canvas(container, { scale: 1.5 }); // scale 1 is enough

  //   const imgData = canvas.toDataURL("image/jpeg", 0.7);
  //   const pdf = new jsPDF("p", "mm", "a4");
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  //   pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

  //   pdf.save(
  //     `${employeeId.employeeName || "Employee"}-${letterTitle.title}.pdf`
  //   );

  //   // clean up
  //   // root.unmount();
  //   ReactDOM.unmountComponentAtNode(container);

  //   document.body.removeChild(container);
  // };

  const handleDownload = async (letterTitle, employeeId) => {
    // create hidden container
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    document.body.appendChild(container);

    await new Promise((resolve) => {
      ReactDOM.render(
        <Letters_download
          letterTitle={letterTitle._id}
          employeeId={employeeId.id}
          onReady={resolve} // called after Letters_download mounts
        />,
        container
      );
    });

    // capture canvas
    const canvas = await html2canvas(container, { scale: 1.5 });

    const imgData = canvas.toDataURL("image/jpeg", 0.7);
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

    pdf.save(`${employeeId.employeeName || "Employee"}-${letterTitle.title}.pdf`);

    // clean up
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
  };


  // const handlePrint = async (letterTitle, employeeId) => {
  //   // 1️⃣ Create hidden container
  //   const container = document.createElement("div");
  //   container.style.position = "absolute";
  //   container.style.left = "-9999px";
  //   document.body.appendChild(container);

  //   // Render your letter component with props
  //   ReactDOM.render(
  //     <Letters_download letterTitle={letterTitle} employeeId={employeeId} />,
  //     container
  //   );

  //   // 2️⃣ Wait for render
  //   await new Promise((resolve) => setTimeout(resolve, 100));

  //   // 3️⃣ Capture container as canvas
  //   const canvas = await html2canvas(container, { scale: 1.5 });
  //   const imgData = canvas.toDataURL("image/jpeg", 0.7);

  //   // 4️⃣ Generate PDF in memory
  //   const pdf = new jsPDF("p", "mm", "a4");
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  //   pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

  //   const blob = pdf.output("blob");
  //   const url = URL.createObjectURL(blob);

  //   // 5️⃣ Hidden iframe for printing
  //   const iframe = document.createElement("iframe");
  //   iframe.style.display = "none";
  //   iframe.src = url;
  //   document.body.appendChild(iframe);

  //   iframe.onload = () => {
  //     const win = iframe.contentWindow;

  //     const cleanUp = () => {
  //       URL.revokeObjectURL(url);
  //       document.body.removeChild(iframe);
  //       ReactDOM.unmountComponentAtNode(container);
  //       document.body.removeChild(container);
  //       win.removeEventListener("afterprint", cleanUp);
  //     };

  //     win.addEventListener("afterprint", cleanUp);
  //     win.focus();
  //     win.print(); // opens printer dialog
  //   };
  // };

  // const handlePrint = async (letterTitle, employeeId) => {
  //   // console.log("letterTitle",letterTitle);
  //   const container = document.createElement("div");
  //   container.style.position = "absolute";
  //   container.style.left = "-9999px";
  //   document.body.appendChild(container);
  //   ReactDOM.render(
  //     <Letters_download
  //       letterTitle={letterTitle._id}
  //       employeeId={employeeId.id}
  //       onReady={resolve}
  //     />,
  //     container
  //   );
  //   // give React time to paint
  //   await new Promise((r) => setTimeout(r, 100));

  //   // 2️⃣ Capture to canvas
  //   const canvas = await html2canvas(container, { scale: 1.5 });
  //   const imgData = canvas.toDataURL("image/jpeg", 0.7);

  //   // 3️⃣ Create the PDF in memory
  //   const pdf = new jsPDF("p", "mm", "a4");
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  //   pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

  //   const blob = pdf.output("blob");
  //   const url = URL.createObjectURL(blob);

  //   // 4️⃣ Hidden iframe for printing
  //   const iframe = document.createElement("iframe");
  //   iframe.style.display = "none";
  //   iframe.src = url;
  //   document.body.appendChild(iframe);

  //   // 5️⃣ Print and clean up after user action
  //   iframe.onload = () => {
  //     const win = iframe.contentWindow;

  //     const cleanUp = () => {
  //       URL.revokeObjectURL(url);
  //       document.body.removeChild(iframe);
  //       ReactDOM.unmountComponentAtNode(container);
  //       document.body.removeChild(container);
  //       win.removeEventListener("afterprint", cleanUp);
  //     };

  //     // fires when user prints OR cancels
  //     win.addEventListener("afterprint", cleanUp);

  //     win.focus();
  //     win.print();
  //   };
  // };

  const handlePrint = async (letterTitle, employeeId) => {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    document.body.appendChild(container);

    // Wait for component to finish loading
    await new Promise((resolve) => {
      ReactDOM.render(
        <Letters_download
          letterTitle={letterTitle._id}
          employeeId={employeeId.id}
          onReady={resolve} // will resolve when data is loaded
        />,
        container
      );
    });

    // Capture the component
    const canvas = await html2canvas(container, { scale: 1.5 });
    const imgData = canvas.toDataURL("image/jpeg", 0.7);

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

    const blob = pdf.output("blob");
    const url = URL.createObjectURL(blob);

    // Hidden iframe for printing
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);

    iframe.onload = () => {
      const win = iframe.contentWindow;

      const cleanUp = () => {
        URL.revokeObjectURL(url);
        document.body.removeChild(iframe);
        ReactDOM.unmountComponentAtNode(container);
        document.body.removeChild(container);
        win.removeEventListener("afterprint", cleanUp);
      };

      win.addEventListener("afterprint", cleanUp);
      win.focus();
      win.print();
    };
  };


  const [downloadRow, setDownloadRow] = useState(null);

  // const handleDownload = (row) => {
  //   console.log("rowdd", row);
  //   setDownloadRow(row);
  // };
  // const handleDownload = (letterTitle, employeeId) => {
  //   navigate("/letter-download", {
  //     state: { letterTitle, employeeId },
  //   });
  // };

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-full min-h-screen px-3 md:px-5 pt-2 md:pt-5 overflow-x-auto">
      {loading ? (
        <Loader />
      ) : (
        <>
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

              <p className="text-sm text-blue-500">Relieved List</p>
            </div>
            {/* Add Button */}
            <div className="flex justify-between mt-2 mb-3">
              <h1 className="text-2xl md:text-3xl font-semibold">Relieved List</h1>
              <div className="flex gap-3">
                {" "}
                {/* <button
                  onClick={() =>
                    navigate(-1)
                  }
                  className="bg-gray-500 hover:bg-gray-600 px-3 py-2 text-white w-20 rounded-2xl"
                >
                  Back
                </button> */}
                {/* <button
              onClick={() => navigate("/reliving-list")}
              className="bg-blue-500 hover:bg-blue-600 px-5 py-2 text-white w-fit rounded-2xl"
            >
              Check List
            </button> */}
                {/* <button
            onClick={openAddModal}
            className="bg-blue-500 hover:bg-blue-600 px-3 py-2 text-white w-20 rounded-2xl"
          >
            Add
          </button> */}
              </div>
            </div>
            <div className="datatable-container">
              {/* Responsive wrapper for the table */}
              <div className="table-scroll-container" id="datatable">
                <DataTable
                  data={clientdetails}
                  columns={columns}
                  // sortable
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
                    <h2 className="text-2xl font-semibold text-gray-800">Reason</h2>
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
            {/* Add Modal */}

            {isAddModalOpen && (
              <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
                {/* Overlay */}
                <div className="absolute inset-0 " onClick={closeAddModal}></div>

                <div
                  className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                  <div
                    className="w-6 h-6 rounded-full  mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                    title="Toggle Sidebar"
                    onClick={closeAddModal}
                  >
                    <IoIosArrowForward className="w-3 h-3" />
                  </div>{" "}
                  <div className="p-10">
                    {/* emp name */}
                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        Employee Name
                      </label>
                      <input
                        type="text"
                        value={alldatarow?.employeeName}
                        disabled
                        className="w-[50%] px-3 py-2 border border-gray-300 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {/* emp id */}

                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        Employee ID
                      </label>
                      <input
                        type="text"
                        value={alldatarow?.employeeId}
                        disabled
                        className="w-[50%] px-3 py-2 border border-gray-300 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* role */}

                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">Role</label>
                      <input
                        type="text"
                        value={alldatarow?.role}
                        disabled
                        className="w-[50%] px-3 py-2 border border-gray-300 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {/* date of join */}
                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        Date of Joinig
                      </label>
                      <input
                        type="text"
                        // value={alldatarow?.dateOfBirth}
                        value={
                          formatDateTime(alldatarow?.dateOfBirth)
                        }
                        disabled
                        className="w-[50%] px-3 py-2 border border-gray-300 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {/* date of last */}
                    <div className="mb-3 flex justify-between">
                      <label className="block text-sm font-medium mb-2">
                        Last working Date
                      </label>
                      <input
                        type="text"
                        value={
                          formatDateTime(alldatarow?.lastDate)
                        }
                        disabled
                        className="w-[50%] px-3 py-2 border border-gray-300 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="">
                      {fields.map((f) => {
                        // console.log("fieldsdd:",fields)
                        switch (f.type) {
                          case "radio":
                            return (
                              <div
                                key={f.name}
                                className="mb-3 flex justify-between"
                              >
                                <label className="block text-sm font-medium mb-2">
                                  {capitalizeFirstLetter(f.name)}
                                </label>
                                <div className="w-[50%] flex gap-3 flex-wrap ">
                                  {" "}
                                  {f.options.map((opt) => (
                                    <label
                                      key={opt}
                                      className="flex items-center space-x-2 cursor-pointer"
                                    >
                                      <input
                                        type="radio"
                                        name={f.name}
                                        value={opt}
                                        checked={values[f.name] === opt}
                                        onChange={() => handleChange(f.name, opt)}
                                      />
                                      <span>{capitalizeFirstLetter(opt)}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            );

                          case "checkbox":
                            return (
                              <div
                                key={f.name}
                                className="mb-3 flex justify-between"
                              >
                                <label className="block text-sm font-medium mb-2 ">
                                  {capitalizeFirstLetter(f.name)}
                                </label>
                                <div className="w-[50%] flex gap-3 flex-wrap ">
                                  {f.options.map(
                                    (opt) => (
                                      console.log("opt", opt),
                                      (
                                        <label
                                          key={opt}
                                          className="flex items-center space-x-2 cursor-pointer"
                                        >
                                          <input
                                            type="checkbox"
                                            value={opt}
                                            checked={(
                                              values[f.name] || []
                                            ).includes(opt)}
                                            onChange={() =>
                                              handleCheckbox(f.name, opt)
                                            }
                                          />
                                          <span>{opt}</span>
                                        </label>
                                      )
                                    )
                                  )}
                                </div>
                              </div>
                            );

                          case "dropdown":
                            return (
                              <div
                                key={f.name}
                                className="flex justify-between mb-3"
                              >
                                <label className="block text-sm font-medium mb-2">
                                  {capitalizeFirstLetter(f.name)}
                                </label>
                                <select
                                  className="w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                  value={values[f.name] || ""}
                                  onChange={(e) =>
                                    handleChange(f.name, e.target.value)
                                  }
                                >
                                  <option value="">Select</option>
                                  {f.options.map((opt) => (
                                    <option key={opt} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            );
                          case "input":
                            return (
                              <div
                                key={f.name}
                                className="flex justify-between mb-3"
                              >
                                <label className="block text-sm font-medium mb-2">
                                  {capitalizeFirstLetter(f.name)}
                                </label>
                                <input
                                  type="text"
                                  className="w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={values[f.name] || ""}
                                  onChange={(e) =>
                                    handleChange(f.name, e.target.value)
                                  }
                                />
                              </div>
                            );

                          case "textarea":
                            return (
                              <div
                                key={f.name}
                                className="flex justify-between mb-3"
                              >
                                <label className="block text-sm font-medium mb-2">
                                  {capitalizeFirstLetter(f.name)}
                                </label>
                                <textarea
                                  className="w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={values[f.name] || ""}
                                  onChange={(e) =>
                                    handleChange(f.name, e.target.value)
                                  }
                                />
                              </div>
                            );

                          default:
                            return null;
                        }
                      })}
                    </div>

                    <div className="flex gap-4">
                      {/* TO Section */}
                      {alldatarow?.todoTasks?.length > 0 && (
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-sm font-semibold text-gray-700">
                              TO
                            </h3>
                            <span className="inline-flex items-center justify-center px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                              {alldatarow?.todoTasksCount}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {alldatarow?.todoTasks?.map((task) => (
                              <a
                                key={task?.taskId}
                                href={`/tasklist-details/${task?.taskId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium hover:bg-indigo-200 transition"
                              >
                                {task?.taskId}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* In-Progress Section */}
                      {alldatarow?.inProgressTasks?.length > 0 && (
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-sm font-semibold text-gray-700">
                              In-Progress
                            </h3>
                            <span className="inline-flex items-center justify-center px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                              {alldatarow?.inProgressTasksCount}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {alldatarow?.inProgressTasks?.map((task) => (
                              <a
                                key={task?.taskId}
                                href={`/tasklist-details/${task?.taskId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium hover:bg-yellow-200 transition"
                              >
                                {task?.taskId}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mb-3 flex justify-between mt-4 items-center">
                      <label className="block text-sm font-medium mb-2">
                        Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        disabled={alldatarow?.checkList === false}
                        className="w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="approval">Approval</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      {alldatarow?.letter?.length > 0 && (
                        <>
                          <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            Letters
                          </h3>
                          <div className="space-y-2">
                            {alldatarow.letter.map((item) => (
                              <div
                                key={item._id}
                                className="flex justify-between items-center p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition bg-white"
                              >
                                {/* Title */}
                                <span className="text-gray-800 font-semibold">
                                  {item.title}
                                </span>

                                <div className="flex gap-3">
                                  {/* Download Button */}
                                  <button
                                    onClick={() => handleDownload(item, alldatarow)}
                                    className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition"
                                  >
                                    <FiDownload className="w-4 h-4" /> Download
                                  </button>

                                  {/* Print Button */}
                                  <button
                                    onClick={() => handlePrint(item, alldatarow)}
                                    className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition"
                                  >
                                    <FiPrinter className="w-4 h-4" /> Print
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

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

            {/* View Modal */}
          </div>
        </>
      )}
      <Footer />
    </div>
  );
};
export default Relieved_list_details;
