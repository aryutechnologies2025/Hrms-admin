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
import { FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import {
    IoIosArrowDown,
    IoIosArrowForward,
    IoIosArrowUp,
} from "react-icons/io";
import Loader from "../Loader";
import { Dropdown } from "primereact/dropdown";
import { IoClose } from "react-icons/io5";
import { AiFillDelete } from "react-icons/ai";
import { useDateUtils } from "../../hooks/useDateUtils";


const BankStatement_Detail = () => {
    const formDateTime=useDateUtils();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const storedDetatis = localStorage.getItem("hrmsuser");
    const parsedDetails = storedDetatis ? JSON.parse(storedDetatis) : null;

    const userid = parsedDetails ? parsedDetails.id : null;
    const [errors, setErrors] = useState({});
    // console.log("errors:", errors);
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
    // console.log("selectproject checking:", selectedAccount)
    const [accountOption, setAccountOption] = useState([]);
    // console.log("accountoption checking:", accountOption)

    const [openViewPopup, setOpenViewPopup] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    console.log("checking:", selectedRowData)

    const [selectedDate, setSelectedDate] = useState(() => {
        return new Date().toISOString().split("T")[0];
    });



    // Keep these (but not used as default)
    const today = new Date().toISOString().split("T")[0];
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

    // Set filters EMPTY by default
    const [filterType, setFilterType] = useState("");
    const [filterAccount, setFilterAccount] = useState("");
    const [filterStartDate, setFilterStartDate] = useState(()=>{
        return new Date().toISOString().split("T")[0];
    });
    const [filterEndDate, setFilterEndDate] = useState(()=>{
        return new Date().toISOString().split("T")[0];
    });







    //  view
    useEffect(() => {
        fetchBank();
    }, [filterType, filterAccount, filterStartDate, filterEndDate]);
    const fetchBank = async () => {
        try {
            let query = [];

            if (filterType) query.push(`type=${filterType}`);
            if (filterAccount) query.push(`account=${filterAccount}`);
            if (filterStartDate) query.push(`startDate=${filterStartDate}`);
            if (filterEndDate) query.push(`endDate=${filterEndDate}`);

            const finalURL = `${API_URL}/api/statement/getAllStatementDetails${query.length > 0 ? "?" + query.join("&") : ""
                }`;

            console.log("Final filter URL:", finalURL);

            const response = await axios.get(finalURL);
            console.log("API RESPONSE:", response.data);

            setBankStatementDetails(response.data.allStatementDetails);
            setLoading(false);

        } catch (err) {
            setErrors("Failed to fetch Bank Statement.");
            setLoading(false);
        }
    };


    // useEffect(() => {
    //     if (!selectedAllAccount) {
    //       setAccountOption([]);
    //       setSelectedAccount(null);
    //       return;
    //     }
    useEffect(() => {
        fetchAccountList();
    }, [isAddModalOpen]);


    const fetchAccountList = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/api/income/view-financecompany`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            setAccountOption(response.data.data);
            console.log("Account Options:", response.data.data);
        } catch (error) {
            console.error("Account list fetch error:", error);
        }
    };


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
            console.log("response post :", response);

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

    const [notesEdit, setNotesEdit] = useState("");
    const [editId, setEditid] = useState("");

    const openEditModal = (row) => {
        setEditid(row._id);
        setSelectedRowData(row);
        setNotesEdit(row.notes || "");
        setIsEditModalOpen(true);
        setTimeout(() => setIsAnimating(true), 10);
    };


    const handlesubmitedit = async () => {
        try {
            const formData = { notes: notesEdit };

            await axios.put(
                `${API_URL}/api/statement/editStatementDetails/${editId}`,
                formData
            );

            toast.success("Notes updated.");
            fetchBank();
            setIsEditModalOpen(false);
        } catch (err) {
            toast.error("Failed to update notes.");
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
            render: (data) => data ? formDateTime(data) : "-",
        },
        {
            title: "Account",
            data: "account.name",
            defaultContent: "-",
        },
        {
            title: "Narration",
            data: "narration",
            defaultContent: "-",
        },
        {
            title: "Ledger",
            data: "ledger",
            defaultContent: "-",
        },
        {
            title: "Amount",
            data: "amount",
            render: (data, type, row) => {
                const id = `amt-${row._id}`;
                setTimeout(() => {
                    const container = document.getElementById(id);
                    if (container && !container.hasChildNodes()) {
                        ReactDOM.render(
                            <div className="flex items-center justify-center gap-2">

                                <FaEye
                                    className="text-blue-500 cursor-pointer"
                                    onClick={() => {
                                        setSelectedRowData(row);
                                        setOpenViewPopup(true);
                                    }}
                                />
                                
                            </div>,
                            container
                        );
                    }
                }, 0);

                return `<div id="${id}"></div>`;
            }
        },

        {
            title: "Type",
            data: "type",
            defaultContent: "-",
        },
        {
            title: "Reason",
            data: "reason",
            defaultContent: "-",
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
                                <div
                                    className="modula-icon-edit  flex gap-2"
                                    style={{
                                        color: "#000",
                                    }}
                                >
                                    <TfiPencilAlt
                                        className=" cursor-pointer"
                                        onClick={() => {
                                            openEditModal(row);
                                        }}
                                    />

                                </div>

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
        <div className="flex flex-col justify-between bg-gray-100 w-full min-h-screen px-3 md:px-5 pt-2 md:pt-10 overflow-x-auto">
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div>
                        <Mobile_Sidebar />

                        <div className="flex justify-between gap-1">
                            <div className="">
                                <h1 className="text-xl md:text-3xl font-semibold">Bank Statement</h1>
                            </div>
                            <div className="flex justify-end gap-1 md:gap-2 text-sm items-center">
                            <p className="text-xs md:text-sm text-blue-500">Bank Statement</p>
                            <p>{">"}</p>
                            <p
                                className="text-xs md:text-sm text-gray-500"
                                onClick={() => navigate("/dashboard-Recruitment")}
                            >
                                Dashboard
                            </p>
                            </div>



                        </div>

                        {/* Add Button */}
                        <div className="flex flex-wrap justify-between mt-2 md:mt-8">
                            
                            <div className='flex flex-wrap items-end mb-1 md:mb-0 gap-3'>
                                <div className="flex gap-1 ">
                                <Dropdown
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.value)}
                                    options={[
                                        { label: "Credit", value: "credit" },
                                        { label: "Debit", value: "debit" }
                                    ]}
                                    placeholder="Select Type"
                                    className="w-full md:w-[150px]"
                                />

                                <Dropdown
                                    value={filterAccount}
                                    onChange={(e) => setFilterAccount(e.value)}
                                    options={accountOption}
                                    optionLabel="name"
                                    optionValue="_id"
                                    placeholder="Select Account"
                                    className="w-full md:w-[150px]"
                                />
                                </div>
                                <div className="flex gap-1 " >
                                 <div className="flex flex-col  ">
                                <lable>Start Date:</lable>
                                <input
                                    type="date"
                                    value={filterStartDate}
                                    onChange={(e) => {
                                        setFilterStartDate(e.target.value);
                                    }}
                                    className="w-[150px] md:w-[160px] border px-1 md:px-3 py-1 rounded"
                                />
                               </div>
                               <div className="flex flex-col  ">
                                <lable>End Date:</lable>
                                <input
                                    type="date"
                                    value={filterEndDate}
                                    onChange={(e) => {
                                        setFilterEndDate(e.target.value);
                                    }}
                                    className="w-[150px] md:w-[160px] border px-1 md:px-3 py-1 rounded"
                                />
                                </div>
                                </div>
                                
                                <button
                                    onClick={() => {
                                        fetchBank(); // Apply filters
                                    }}
                                    className="px-2 md:px-3 py-2  text-white bg-blue-500 hover:bg-blue-600 font-medium w-20 rounded-2xl"
                                >
                                    Submit
                                </button>

                                <button
                                    onClick={() => {
                                        setFilterType("");
                                        setFilterAccount("");
                                        setFilterStartDate("");
                                        setFilterEndDate("");

                                        fetchBank(); // Load all data again
                                    }}
                                    className="bg-gray-300 text-gray-800 px-2 md:px-3 py-2 font-medium w-20 rounded-2xl"
                                >
                                    Reset
                                </button>


                            </div>
                            <div className="flex items-center">
                            <button
                                onClick={openAddModal}
                                className="px-2 md:px-3 py-2  text-white bg-blue-500 hover:bg-blue-600 font-medium w-20 rounded-2xl"
                            >
                                Import
                            </button>
                            </div>
                        </div>

                        <div className="datatable-container">
                            {/* Responsive wrapper for the table */}
                            <div className="table-scroll-container" id="datatable">
                                <DataTable
                                    key={bankStatementDetails.length}   // 🔥 REQUIRED FIX
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
                                        {/* Date */}
                                        <div className="mt-3 flex justify-between items-center">
                                            <label className="block text-md font-medium">
                                                Date<span className="text-red-500">*</span>
                                            </label>

                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="date"
                                                    value={selectedDate}
                                                    onChange={(e) => {
                                                        setSelectedDate(e.target.value);
                                                        handleChange(index, "date", e.target.value);
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg 
               focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />

                                            </div>
                                        </div>

                                        {/* Account */}
                                        <div className="mt-3 flex justify-between items-center">
                                            <label className="block text-md font-medium">
                                                Account<span className="text-red-500">*</span>
                                            </label>

                                            <div className="w-[60%] md:w-[50%]">
                                                <Dropdown
                                                    value={selectedAccount}
                                                    onChange={(e) => setSelectedAccount(e.value)}
                                                    options={accountOption}
                                                    optionLabel="name"
                                                    placeholder="Select an Account"
                                                    filter
                                                    className="w-full border border-gray-300 rounded-lg"
                                                />
                                            </div>
                                        </div>

                                        {/* File Upload */}
                                        <div className="mt-3 flex justify-between items-center">
                                            <label className="block text-md font-medium">File Upload</label>

                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />

                                                {attachment && (
                                                    <div className="flex justify-between mt-2 items-center bg-gray-50 px-3 py-2 rounded-lg border">
                                                        <span className="text-sm text-gray-700 truncate w-[80%]">{attachment.name}</span>
                                                        <button
                                                            type="button"
                                                            onClick={handleDeleteFile}
                                                            title="Delete"
                                                            className="text-red-600 hover:text-red-800 text-[18px]"
                                                        >
                                                            <AiFillDelete />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
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
                                        <div className="mt-3">
                                            <label className="font-medium">Amount</label>
                                            <input
                                                type="text"
                                                value={selectedRowData?.amount}
                                                disabled
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <label className="font-medium">Account</label>
                                            <input
                                                type="text"
                                                value={selectedRowData?.account.name}
                                                disabled
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <label className="font-medium">Narration</label>
                                            <input
                                                type="text"
                                                value={selectedRowData?.narration}
                                                disabled
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                            />
                                        </div>

                                        <div className="mt-3">
                                            <label className="font-medium">Ledger</label>
                                            <input
                                                type="text"
                                                value={selectedRowData?.ledger}
                                                disabled
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                            />
                                        </div>

                                        <div className="mt-3">
                                            <label className="font-medium">Notes</label>
                                            <textarea
                                                value={notesEdit}
                                                onChange={(e) => setNotesEdit(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                rows={4}
                                                placeholder="Add notes..."
                                            />
                                        </div>



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
                        {openViewPopup && (
                            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                                <div className="bg-white p-5 rounded-lg w-[350px] relative shadow-lg">

                                    <IoClose
                                        className="absolute top-3 right-3 text-2xl cursor-pointer"
                                        onClick={() => setOpenViewPopup(false)}
                                    />

                                    <h2 className="text-xl font-semibold mb-2">Amount Details</h2>
                                    <hr />

                                    <div className="mt-3 space-y-2">
                                        <p><strong>Amount:</strong> ₹{selectedRowData?.amount}</p>
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


