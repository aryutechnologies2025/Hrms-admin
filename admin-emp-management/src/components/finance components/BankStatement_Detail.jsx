import React, { useState, useEffect, useRef } from "react";
import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
DataTable.use(DT);
import axios from "../../api/axiosConfig";
import { API_URL } from "../../config";
import { TfiPencilAlt } from "react-icons/tfi";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import {
    IoIosArrowDown,
    IoIosArrowForward,
    IoIosArrowUp,
} from "react-icons/io";
import Loader from "../Loader";
import { Dropdown } from "primereact/dropdown";


const BankStatement_Detail = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const storedDetatis = localStorage.getItem("hrmsuser");
const parsedDetails = storedDetatis ? JSON.parse(storedDetatis) : null;

    const userid = parsedDetails ? parsedDetails.id : null;
    const [errors, setErrors] = useState({});
    console.log("errors:", errors);
    const [isAnimating, setIsAnimating] = useState(false);
    const [bankStatementDetails, setBankStatementDetails] = useState([])
    console.log("bank statement", bankStatementDetails)
    const [loading, setLoading] = useState(true); // State to manage loading
    let navigate = useNavigate();
    const [attachmentedit, setAttachmentedit] = useState(null);
    const [attachment, setAttachment] = useState(null);
    const fileInputRef = useRef(null);
    const fileInputRefedit = useRef(null);
    const [selectedAccount, setSelectedAccount] = useState("");
    console.log("selectproject checking:",selectedAccount)
    const [accountOption, setAccountOption] = useState([]);
    console.log("accountoption checking:",accountOption)
    const [selectedAllAccount, setSelectedAllAccount] = useState(null);
    


    //  view
    useEffect(() => {
        fetchBank();
    }, []);
    const fetchBank = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/api/statement/getAllStatementDetails`
            );
            console.log("response get:",response);


            setBankStatementDetails(response.data.allStatementDetails)
            setLoading(false);


        } catch (err) {
            setErrors("Failed to fetch Bank Statement.");
            setLoading(false);

        }
    };
    
    useEffect(() => {
        if (!selectedAllAccount) {
          setAccountOption([]);
          setSelectedAccount(null);
          return;
        }
    
    const fetchProjectList = async () => {
          try {
            const response = await axios.get(
                `${API_URL}/api/income/view-financecompany`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            console.log("account api:",response);

            setAccountOption(response.data.data); 
            setLoading(false);
          } catch (error) {
            console.error("Project fetch error:", error);
            setLoading(false);
          }
        };
    
        fetchProjectList();
      }, [selectedAllAccount, API_URL]);

    const openAddModal = () => {
        setIsAddModalOpen(true);
        setTimeout(() => setIsAnimating(true), 10);
    };

    const closeAddModal = () => {
        setIsAnimating(false);
        setTimeout(() => setIsAddModalOpen(false), 250);
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setAttachment(e.target.files[0]);
        }
    };

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

    const handleDeleteFile = () => {
        setAttachment(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };


    const closeEditModal = () => {
        setIsAnimating(false);
        setTimeout(() => setIsEditModalOpen(false), 250);
    };

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

    const [name, setName] = useState("");
    const [status, setStatus] = useState("");

    // console.log("chech:", nameEdit, statusEdit);


    // create
    const handlesubmit = async (e) => {
        e.preventDefault();
        try {
            const formdata = {
                name: name,
                status: status,

            };

            const response = await axios.post(
                `${API_URL}/api/statement/import`,
                formdata
            );
            console.log("response post :",response);

            setIsAddModalOpen(false);
            setName("");
            setStatus("");
            setErrors("");
            fetchBank();

            toast.success(" Bank Statement created successfully.");
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                setErrors(err.response.data.errors);
            } else {
                console.error("Error submitting form:", err);
            }
        }
    };


    //  edit  
    const [nameEdit, setNameEdit] = useState("");
    const [statusEdit, setStatusEdit] = useState("");
    const [editId, setEditid] = useState("");

    const openEditModal = (row) => {
        console.log("rowData", row);

        setEditid(row._id);
        setNameEdit(row.name);

        setStatusEdit(row.status);

        setIsEditModalOpen(true);
        setTimeout(() => setIsAnimating(true), 10);
    };


    const handlesubmitedit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Client-side validation
        const newErrors = {};
        if (!nameEdit.trim()) {
            newErrors.name = "Name is required.";
        }
        if (!statusEdit) {
            newErrors.status = "Status is required.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        try {
            const formData = {
                name: nameEdit,
                status: statusEdit,
            };

            const response = await axios.put(
                `${API_URL}/api/statement/editStatementDetails/${editId}`,
                formData
            );
            console.log("response:", response);


            setIsEditModalOpen(false);
            fetchBank();
            setErrors({});
            toast.success("Bank Statement updated successfully.");
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                console.error("Error submitting form:", err);
                toast.error("Failed to update Bank Statement.");
            }
        }
    };





    // delete

    const deleteRoles = (editId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete this Bank Statement?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`${API_URL}/api/statement/deleteStatementDetails/${editId}`)
                    .then((response) => {
                        if (response.data) {
                            toast.success("Bank Statement has been deleted.");
                            fetchBank(); // Refresh the job type
                        } else {
                            Swal.fire("Error!", "Failed to delete Bank Statement.", "error");
                        }
                    })
                    .catch((error) => {
                        // console.error("Error deleting role:", error);
                        Swal.fire("Error!", "Failed to delete Bank Statement.", "error");
                    });
            }
        });
    };

    const columns = [
    {
        title: "Sno",
        data: null,
        render: (data, type, row, meta) => meta.row + 1,
    },
    {
        title: "Date",
        data: "date",
        render: (data) => new Date(data).toLocaleDateString() 
    },
    {
        title: "Narration",
        data: "narration",
    },
    {
        title: "Ledger",
        data: "ledger",
    },
    {
        title: "Amount",
        data: "amount",
    },
    {
        title: "Type",
        data: "type",
    },
    {
        title: "Reason",
        data: "reason",
    }
];




    return (
        <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-2 md:pt-10">
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div>
                        <Mobile_Sidebar />

                        <div className="flex gap-2 text-sm items-center">
                            <p
                                className="text-sm text-gray-500"
                                onClick={() => navigate("/dashboard-Recruitment")}
                            >
                                Dashboard
                            </p>
                            <p>{">"}</p>

                            <p className="text-sm text-blue-500">Bank Statement</p>
                        </div>

                        {/* Add Button */}
                        <div className="flex justify-between mt-8">
                            <div className="">
                                <h1 className="text-2xl md:text-3xl font-semibold">Bank Statement</h1>
                            </div>

                            <button
                                onClick={openAddModal}
                                className=" px-3 py-2  text-white bg-blue-500 hover:bg-blue-600 font-medium w-20 rounded-2xl"
                            >
                                Import
                            </button>
                        </div>

                        <div className="datatable-container">
                            {/* Responsive wrapper for the table */}
                            <div className="table-scroll-container" id="datatable">
                                <DataTable
                                      data={bankStatementDetails}
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
                                    </div>

                                    <div className="p-5">
                                        <p className="text-2xl md:text-3xl font-medium">Bank Statement</p>
                                        <div className="mt-3 flex justify-between">
                                            <label className="block text-md font-medium mb-2">
                                                Date<span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="date"
                                                    // value={p.date}
                                                    onChange={(e) =>
                                                        handleChange(index, "date", e.target.value)
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                // className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${p.errorDate
                                                //         ? "border-red-500 focus:ring-red-500"
                                                //         : "border-gray-300 focus:ring-blue-500"
                                                //     }`}
                                                />
                                                {/* {p.errorDate && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {p.errorDate}
                                                    </p>
                                                )} */}
                                            </div>
                                        </div>
                                        {/* Each Cost */}

                                        <div className="mt-3 flex justify-between">
                                            <label className="block text-sm font-medium mb-2">
                                                Account<span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <Dropdown
                                                    value={selectedAccount}
                                                    onChange={(e) => setSelectedAccount(e.value)}
                                                    options={accountOption}
                                                    optionLabel="name"
                                                    filter
                                                    placeholder="Select a Account"
                                                    className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                
                                                {/* {errors.project_name && (
                                                    <p className="text-red-500 text-sm mb-4">
                                                        {errors.project_name}
                                                    </p>
                                                )} */}
                                            </div>
                                        </div>

                                        {/* Attachment */}
                                        <div className="mt-3 flex justify-between">
                                            <label className="block text-sm font-medium mb-2">
                                                File Upload
                                            </label>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                className="w-[60%] md:w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="mt-3 flex justify-between ">
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


                                        <div className="flex  justify-end gap-2 mt-6 md:mt-14">
                                            <button
                                                onClick={closeAddModal}
                                                className="bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                                                onClick={handlesubmit}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isEditModalOpen && (
                            <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
                                {/* Overlay */}
                                <div className="absolute inset-0 " onClick={closeEditModal}></div>

                                <div
                                    className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[53vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
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
                                        <p className="text-2xl md:text-3xl font-medium">Bank Statement Edit</p>
                                        <div className="mt-5 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Name <span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[70%] md:w-[50%]">
                                                <input
                                                    type="text"
                                                    value={nameEdit}
                                                    onChange={(e) => setNameEdit(e.target.value)}
                                                    placeholder="Enter Your Name "
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.name && (
                                                    <p className="text-red-500 text-sm mb-4">{errors.name}</p>
                                                )}
                                            </div>
                                        </div>


                                        {/* {error.rolename && <p className="error">{error.rolename}</p>} */}

                                        <div className="mt-5 flex justify-between items-center">
                                            <div className="">
                                                <label
                                                    htmlFor="status"
                                                    className="block text-md font-medium mb-2 mt-3"
                                                >
                                                    Status <span className="text-red-500">*</span>
                                                </label>

                                            </div>
                                            <div className="w-[70%] md:w-[50%]">
                                                <select
                                                    name="status"
                                                    id="status"
                                                    value={statusEdit}
                                                    onChange={(e) => {
                                                        setStatusEdit(e.target.value);
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Select a status</option>
                                                    <option value="1">Active</option>
                                                    <option value="0">InActive</option>
                                                </select>
                                                {errors.status && (
                                                    <p className="text-red-500 text-sm mb-4 mt-1">
                                                        {errors.status}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {/* {error.status && <p className="error">{error.status}</p>} */}

                                        <div className="flex  justify-end gap-2 mt-7 md:mt-14">
                                            <button
                                                onClick={closeEditModal}
                                                className="bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                                                onClick={handlesubmitedit}
                                            >
                                                Submit
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
export default BankStatement_Detail;


