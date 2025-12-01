import React, { useState, useEffect, useRef } from "react";

import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
DataTable.use(DT);
import axios from "../../api/axiosConfig";
import { API_URL } from "../../config";
import { TfiPencilAlt } from "react-icons/tfi";
import ReactDOM, { render } from "react-dom";
import Swal from "sweetalert2";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    IoIosArrowDown,
    IoIosArrowForward,
    IoIosArrowUp,
} from "react-icons/io";
import Loader from "../Loader";
import { Dropdown } from "primereact/dropdown";
import { AiFillDelete } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
import { FaEye } from "react-icons/fa";
import { useDateUtils } from "../../hooks/useDateUtils";


const AssetManagement_details = () => {
    const formDateTime = useDateUtils();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const storedDetatis = localStorage.getItem("hrmsuser");
    const parsedDetails = JSON.parse(storedDetatis || "{}");
    const userid = parsedDetails ? parsedDetails.id : null;
    const [errors, setErrors] = useState({});
    console.log("errors checking:", errors);
    const [isAnimating, setIsAnimating] = useState(false);
    const [assetManageDetails, setAssetManageDetails] = useState([])
    console.log("assetManageDetails check", assetManageDetails)
    const [loading, setLoading] = useState(true); // State to manage loading
    const [isInvoiceViewModalOpen, setIsInvoiceViewModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isInvoiceEditModalOpen, setIsInvoiceEditModalOpen] = useState(false);
    let navigate = useNavigate();
    const fileInputRef = useRef(null);
    const fileInputRefedit = useRef(null);
    const [attachmentedit, setAttachmentedit] = useState(null);
    const [attachments, setAttachments] = useState([]);
    
    const [existingFiles, setExistingFiles] = useState([]); 
    const [selectedDate, setSelectedDate] = useState(() => {
        return new Date().toISOString().split("T")[0];
    });

    //  view
    useEffect(() => {
        fetchAssetManagement();
    }, []);
    const fetchAssetManagement = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/api/asset-mannagement/view-asset`
            );
            console.log("asset get response", response);


            setAssetManageDetails(response?.data?.data)
            setLoading(false);


        } catch (err) {
            setErrors("Failed to fetch Asset.");
            setLoading(false);

        }
    };

    //fetch asset categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(
                    `${API_URL}/api/asset-mannagement-category/assetCategory`
                );
                console.log("asset category get response", res);
                const formatted = res.data?.data?.map((item) => ({
                    label: item?.name,
                    value: item?._id
                }));

                setAccountoption(formatted);
            } catch (err) {
                console.error(err);
            }
        };

        fetchCategories();
    }, []);

    //fetch asset subcategories
    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                const res = await axios.get(
                    `${API_URL}/api/sub-asset-category/subCategory`
                );
                console.log("asset subCategory get response", res);
                const formatted = res.data?.data?.map((item) => ({
                    label: item?.name,
                    value: item?._id
                }));

                setAssetSubCategoryOption(formatted);
            } catch (err) {
                console.error(err);
            }
        };

        fetchSubCategories();
    }, []);


    const getTodayDate = () => {
        return new Date().toISOString().split("T")[0];   // "2025-11-27"
    };

    const openAddModal = () => {
        setIsAddModalOpen(true);
        setPurchasedDate(getTodayDate());  //  set default date
        setDisposedDate(getTodayDate());  //  set default date
        setTimeout(() => setIsAnimating(true), 10);
    };

    const closeAddModal = () => {
        resetAll();
        setIsAnimating(false);
        setTimeout(() => setIsAddModalOpen(false), 250);
    };

    const closeEditModal = () => {
        setIsAnimating(false);
        setTimeout(() => setIsEditModalOpen(false), 250);
    };

    // const handleDeleteFile = () => {
    //     setAttachments(null);
    //     if (fileInputRef.current) {
    //         fileInputRef.current.value = "";
    //     }
    // };

    const handleDeleteNewFile = (fileToDelete) => {
    setAttachments((prev) => prev.filter((file) => file !== fileToDelete));
};

 const handleDeleteFile = (index) => {
    setAttachments((prev) => prev.filter((_,i) => i !== index));
};

const handleDeleteOldFile = (file) => {
    setExistingFiles(prev => prev.filter(f => f !== file));
};

    const handleDeleteFileedit = () => {
        setAttachmentedit(null);
        if (fileInputRefedit.current) {
            fileInputRefedit.current.value = "";
        }
    };
    const handleFileChangeEdit = (e) => {
        // if (e.target.files[0]) {
        //     setAttachment(e.target.files[0]);
        // }
        const files = Array.from(e.target.files);  

    setAttachments((prev) => [...prev, ...files]);
    };
    const handleFileChange = (e) => {
        // console.log("e 1233 :", e)
        // if (e.target.files[0]) {
        //     setAttachments(e.target.files[0]);
        // }
         const files = Array.from(e.target.files);
        setAttachments(prev => [...prev, ...files]);
    };

    const openInvoiceViewModal = (row) => {
        console.log("Invoice row data :", row)
       
        setSelectedInvoice(row)
        setIsInvoiceViewModalOpen(true)
    }

    const closeInvoiceViewModal = () => {
        setIsInvoiceViewModalOpen(false)
    }

    const openInvoiceEditModal = (row) => {
        console.log("Invoice row data :", row)
        setSelectedInvoice(row)
        setIsInvoiceEditModalOpen(true)
    }

    const closeInvoiceEditModal = () => {
        setIsInvoiceEditModalOpen(false)
    }

    const [assetCategory, setAssetCategory] = useState("");
    console.log("assetCategory", assetCategory)
    const [accountoption, setAccountoption] = useState([]);
    console.log("accountoption", accountoption)
    const [assetSubCategory, setAssetSubCategory] = useState("");
    console.log("assetSubCategory", assetSubCategory)
    const [assetSubCategoryOption, setAssetSubCategoryOption] = useState([]);
    const [ledger, setLedger] = useState("");
    const [title, setTitle] = useState("");
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [depreciationPercentage, setDepreciationPercentage] = useState("");
    const [quantity, setQuantity] = useState("");
    const [purchasedDate, setPurchasedDate] = useState("");
    const [rate, setRate] = useState("");
    const [taxable, setTaxable] = useState("");
    const [gst, setGst] = useState("");
    const [cgst, setCgst] = useState("");
    const [sgst, setSgst] = useState("");
    const [igst, setIgst] = useState("");
    const [invoiceValue, setInvoiceValue] = useState("");
    const [warrantyYear, setWarrantyYear] = useState("");
    const [disposedDate, setDisposedDate] = useState("");
    const [fileUpload, setFileUpload] = useState(null);


    
    const resetAll = () => {
        setLedger("");
        setAssetCategory("");
        setAssetSubCategory("");
        setTitle("");
        setInvoiceNumber("");
        setQuantity("");
        setPurchasedDate("");
        setDepreciationPercentage("");
        setRate("");
        setTaxable("");
        setGst("");
        setCgst("");
        setSgst("");
        setIgst("");
        setInvoiceValue("");
        setWarrantyYear("");
        setDisposedDate("");
        setFileUpload(null);
    }


    // console.log("chech:", nameEdit, statusEdit);


    // create
    const handlesubmit = async (e) => {
        console.log("fileUpload", fileUpload)
        e.preventDefault();

        const formdata = {
            invoiceNumber: String(invoiceNumber),
            purchasedDate,
            ledger,
            assetCategory,
            assetSubCategory,
            title,
            depreciationPercentage: Number(depreciationPercentage),
            quantity: Number(quantity),
            rate: Number(rate),
            gstRate: Number(gst),
            taxable: Number(taxable),
            cgst: Number(cgst),
            sgst: Number(sgst),
            igst: Number(igst),
            invoiceValue: Number(invoiceValue),
            warrantyYear: Number(warrantyYear),
            disposedDate,
            fileUpload: attachments
        };


        try {
            const response = await axios.post(
                `${API_URL}/api/asset-mannagement/create-asset`,
                formdata,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );


            toast.success("Asset created successfully");

            closeAddModal();
            fetchAssetManagement();

            // Reset fields
            resetAll();

        } catch (err) {
            console.log(err);
            toast.error("Failed to create asset");
        }
    };



    //  edit  
    const [assetCategoryEdit, setAssetCategoryEdit] = useState("");
    const [assetSubCategoryEdit, setAssetSubCategoryEdit] = useState("");
    const [titleEdit, setTitleEdit] = useState("");
    const [ledgerEdit, setLedgerEdit] = useState("");
    const [invoiceNumberEdit, setInvoiceNumberEdit] = useState("");
    const [quantityEdit, setQuantityEdit] = useState("");
    const [purchasedDateEdit, setPurchasedDateEdit] = useState("");
    const [depreciationPercentageEdit, setDepreciationPercentageEdit] = useState("");
    const [rateEdit, setRateEdit] = useState("");
    const [gstEdit, setGstEdit] = useState("");
    const [cgstEdit, setCgstEdit] = useState("");
    const [sgstEdit, setSgstEdit] = useState("");
    const [igstEdit, setIgstEdit] = useState("");
    const [taxableEdit, setTaxableEdit] = useState("");
    const [invoiceValueEdit, setInvoiceValueEdit] = useState("");
    const [warrantyYearEdit, setWarrantyYearEdit] = useState("");
    const [disposedDateEdit, setDisposedDateEdit] = useState("");
    const [fileUploadEdit, setFileUploadEdit] = useState(null);
    const [editId, setEditid] = useState("");

    const openEditModal = (row) => {

          // Convert backend string → array
    const files = Array.isArray(row.fileUpload)
        ? row.fileUpload
        : row.fileUpload
        ? [row.fileUpload]
        : [];

        setEditid(row._id);
        setAssetCategoryEdit(row.assetCategory?._id || "");
        setAssetSubCategoryEdit(row.assetSubCategory?._id || "");
        setLedgerEdit(row.ledger);
        setTitleEdit(row.title);
        setInvoiceNumberEdit(row.invoiceNumber);
        setQuantityEdit(row.quantity);
        setPurchasedDateEdit(row.purchasedDate?.slice(0, 10));
        setDisposedDateEdit(row.disposedDate?.slice(0, 10));
        setRateEdit(row.rate);
        setTaxableEdit(row.taxable);
        setGstEdit(row.gstRate);
        setCgstEdit(row.cgst);
        setSgstEdit(row.sgst);
        setIgstEdit(row.igst);
        setInvoiceValueEdit(row.invoiceValue);
        setWarrantyYearEdit(row.warrantyYear);
        setDepreciationPercentageEdit(row.depreciationPercentage);
        // setFileUploadEdit(row.fileUpload);
        setFileUploadEdit(row.fileUpload ? [row.fileUpload] : []);
        setExistingFiles(files);  // existing files
    setAttachments([]);       
        setIsEditModalOpen(true);
        setTimeout(() => setIsAnimating(true), 10);
    };



    // const handlesubmitedit = async (e) => {
    //     e.preventDefault();

    //     const formData = {
    //         assetCategory: assetCategoryEdit,
    //         assetSubCategory: assetSubCategoryEdit,
    //         ledger: ledgerEdit,
    //         title: titleEdit,
    //         invoiceNumber: invoiceNumberEdit,
    //         quantity: quantityEdit,
    //         depreciationPercentage: depreciationPercentageEdit,
    //         purchasedDate: purchasedDateEdit,
    //         rate: rateEdit,
    //         gst: gstEdit,
    //         taxable: taxableEdit,
    //         cgst: cgstEdit,
    //         sgst: sgstEdit,
    //         igst: igstEdit,
    //         invoiceValue: invoiceValueEdit,
    //         warrantyYear: warrantyYearEdit,
    //         disposedDate: disposedDateEdit,
    //         fileUpload: fileUploadEdit
    //     };

    //     try {
    //         await axios.put(
    //             `${API_URL}/api/asset-mannagement/edit-assetdetails/${editId}`,
    //             formData
    //         );

    //         toast.success("Asset updated successfully");

    //         closeEditModal();
    //         fetchAssetManagement();
    //     } catch (err) {
    //         console.log(err);
    //         toast.error("Failed to update asset");
    //     }
    // };





    // delete

const handleSubmitEdit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("assetCategory", assetCategoryEdit);
    formData.append("assetSubCategory", assetSubCategoryEdit);
    formData.append("ledger", ledgerEdit);
    formData.append("title", titleEdit);
    formData.append("invoiceNumber", invoiceNumberEdit);
    formData.append("quantity", quantityEdit);
    formData.append("rate", rateEdit);
    formData.append("gstRate", gstEdit);
    formData.append("taxable", taxableEdit);
    formData.append("cgst", cgstEdit);
    formData.append("sgst", sgstEdit);
    formData.append("igst", igstEdit);
    formData.append("invoiceValue", invoiceValueEdit);
    formData.append("disposedDate", disposedDateEdit);
    formData.append("warrantyYear", warrantyYearEdit);
    formData.append("depreciationPercentage", depreciationPercentageEdit);

    // Add existing files (strings)
    existingFiles.forEach(file => {
        formData.append("existingFiles", file);
    });

    // Add new uploaded files
    attachments.forEach(file => {
        formData.append("fileUpload", file);
    });

    try {
    await axios.put(
        `${API_URL}/api/asset-mannagement/edit-assetdetails/${editId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );

    toast.success("Asset Updated Successfully");
    closeEditModal();
    fetchAssetManagement();
    } catch (err) {
    console.log(err);
    toast.error("Failed to update asset");
    }
};

    const deleteRoles = (editId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete this Asset?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`${API_URL}/api/asset-mannagement/delete-asset/${editId}`)
                    .then((response) => {
                        if (response.data) {
                            toast.success("Asset has been deleted.");
                            fetchAssetManagement(); // Refresh
                        } else {
                            Swal.fire("Error!", "Failed to delete Asset.", "error");
                        }
                    })
                    .catch((error) => {
                        // console.error("Error deleting role:", error);
                        Swal.fire("Error!", "Failed to delete Asset.", "error");
                    });
            }
        });
    };

    const columns = [
        {
            title: "S.No",
            data: null,
            render: (data, type, row, meta) => meta.row + 1,
        },
        {
            title: "Asset Category",
            data: "assetCategory",
            render: function (data) {
                if (!data) return "-";
                return data.name || "-";
            }
        },
        {
            title: "Asset SubCategory",
            data: "assetSubCategory",
            render: function (data) {
                if (!data) return "-";
                return data.name || "-";
            }
        },
        {
            title: "Ledger",
            data: "ledger",
            defaultContent: "-"
        },
        {
            title: "Title",
            data: "title",
            defaultContent: "-"
        },
        {
            title: "Invoice Number",
            data: "invoiceNumber",
            defaultContent: "-"
        },
        {
            title: "Purchased Date",
            data: "purchasedDate",
            render: (data) => data ? formDateTime(data) : "-",

        },

        {
            title: "Quantity",
            data: "quantity",
            defaultContent: "-"
        },

        //         {
        //     title: "Depreciation Percentage(%)",
        //     data: "depreciationPercentage",
        //     render: function (data) {
        //         return data ? data + "%" : "-";
        //     },
        //     defaultContent: "-"
        // },


        {
            title: "Rate",
            data: "rate",
            render: function (data) {
                if (data === null || data === undefined || data === "") {
                    return "-";
                }
                return "₹" + Number(data).toFixed(2);
            },
            defaultContent: "-"
        },

        {

//             title: "Disposed Date",
//             data: "disposedDate",
//             render: (data) => data ? formatDateTime(data) : "-",

            title: "Invoice Value",
            data: "invoiceValue",
            render: function (data) {
                if (data === null || data === undefined || data === "") {
                    return "-";
                }
                return "₹" + Number(data).toFixed(2);
            },
            defaultContent: "-"

        },

        {
            title: "Invoice Details",
            data: "invoiceDetails",
            render: (data, type, row) => {
                const id = `invoice-${row._id}`;
                setTimeout(() => {
                    const container = document.getElementById(id);
                    if (container && !container.hasChildNodes()) {
                        ReactDOM.render(
                            <div className="flex items-center gap-2 justify-center">

                                <FaEye
                                    className="text-blue-500 cursor-pointer text-center"
                                    onClick={() => openInvoiceViewModal(row)}
                                />
                            </div>,
                            container
                        );
                    }
                }, 0);
                return `<div id="${id}"></div>`;

                // return `
                //     <button 
                //         class="p-button-text p-button-sm"
                //         onclick='window.openInvoiceViewModal(${JSON.stringify(row)})'
                //         style="background: none; border: none; cursor: pointer;"
                //     >
                //         <i class="fa fa-eye"></i>
                //     </button>
                // `;
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
                                <div
                                    className="modula-icon-edit flex gap-2"
                                    style={{
                                        color: "#000",
                                    }}
                                >
                                    <TfiPencilAlt
                                        className="cursor-pointer "
                                        onClick={() => {
                                            openEditModal(
                                                row
                                            );
                                        }}
                                    />
                                    <MdOutlineDeleteOutline
                                        className="text-red-600 text-xl cursor-pointer"
                                        onClick={() => {
                                            deleteRoles(row._id);
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



        //         {
        //             title: "GST Rate(%)",
        //             data: "gstRate",
        //              render: function (data) {
        //         return data ? data + "%" : "-";
        //     },
        //             defaultContent: "18%"
        //         },

        //         {
        //             title: "Taxable Amount",
        //             data: "taxable",
        //             render: function (data) {
        //     if (data === null || data === undefined || data === "") {
        //         return "-";
        //     }
        //     return "₹" + Number(data).toFixed(2);
        // },
        //             defaultContent: "-"
        //         },
        //         {
        //             title: "CGST Amount",
        //             data: "cgst",
        //             render: function (data) {
        //     if (data === null || data === undefined || data === "") {
        //         return "-";
        //     }
        //     return "₹" + Number(data).toFixed(2);
        // },   
        //             defaultContent: "-"
        //         },
        //         {
        //             title: "SGST Amount ",
        //             data: "sgst",
        //             render: function (data) {
        //     if (data === null || data === undefined || data === "") {
        //         return "-";
        //     }
        //     return "₹" + Number(data).toFixed(2);
        // } ,  
        //             defaultContent: "-"
        //         },
        //         {
        //             title: "IGST Amount",
        //             data: "igst",
        //             defaultContent: "-"
        //         },

        //         {
        //             title: "Warranty Years",
        //             data: "warrantyYear",
        //             defaultContent: "-"
        //         },
        //         {
        //             title: "Disposed Date",
        //             data: "disposedDate",
        //             render: (data) => data ? new Date(data).toLocaleDateString("en-GB") : "-",
        //         },

    ];



    console.log("fileIattachmentsInputRef 123", attachments);
    return (
        <div className="flex flex-col justify-between bg-gray-100 w-full min-h-screen px-3 md:px-5 pt-2 md:pt-10 overflow-x-auto">
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div>
                        

                        <div className="flex justify-between gap-2 text-sm items-center">
                            <Mobile_Sidebar />
                            <div className="flex gap-1 items-center">
                            <p
                                className="text-sm text-gray-500 cursor-pointer"
                                onClick={() => navigate("/dashboard")}
                            >
                                Dashboard
                            </p>
                            <p>{">"}</p>

                            <p className="text-sm text-blue-500">Assets</p>
                            </div>
                        </div>

                        {/* Add Button */}
                        <div className="flex justify-between mt-2 md:mt-4">
                            <div className=" ">
                                <h1 className="text-2xl md:text-3xl font-semibold">Assets</h1>
                            </div>

                            <div className="flex flex-wrap md:flex-nowrap justify-end items-center gap-1 md:gap-3">
                                <button
                                    onClick={() => navigate("/assetcategory")}
                                    className=" px-1 py-2  text-white bg-blue-500 hover:bg-blue-600 font-normal md:font-medium w-24 rounded-2xl"
                                >
                                    Category
                                </button>
                                <button
                                    onClick={() => navigate("/assetsubcategory")}
                                    className=" px-1 py-2  text-white bg-blue-500 hover:bg-blue-600 font-normal md:font-medium w-28 rounded-2xl"
                                >
                                    Subcategory
                                </button>
                                <button
                                    onClick={openAddModal}
                                    className=" px-1 py-2  text-white bg-blue-500 hover:bg-blue-600 font-normal md:font-medium w-20 rounded-2xl"
                                >
                                    Add
                                </button>
                            </div>
                        </div>


                        <div className="datatable-container mt-5">
                            {/* Responsive wrapper for the table */}
                            <div className="overflow-x-auto w-full" id="datatable">
                                <DataTable
                                    key={assetManageDetails.length}
                                    data={assetManageDetails}
                                    columns={columns}
                                    options={{
                                        paging: true,
                                        searching: true,
                                        ordering: true,
                                        scrollX: true,
                                        responsive: true,
                                        autoWidth: false,
                                    }}
                                    className="display nowrap bg-white w-full"
                                />
                            </div>
                        </div>

                       
                     {/* View Invoice Modal */}
{isInvoiceViewModalOpen && selectedInvoice && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-xl w-[450px] shadow-lg">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {selectedInvoice.title || selectedInvoice.ledger}
                    </h3>
                </div>
                <button
                    onClick={closeInvoiceViewModal}
                    className="text-gray-500 hover:text-red-500 transition"
                >
                    ✕
                </button>
            </div>

            {/* Convert fileUpload to array */}
            {(() => {
                var viewFiles = Array.isArray(selectedInvoice.fileUpload)
                    ? selectedInvoice.fileUpload
                    : selectedInvoice.fileUpload
                    ? [selectedInvoice.fileUpload]
                    : [];
                
                return (
                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                        <p><b>Asset Category : </b><br />{selectedInvoice.assetCategory?.name || "-"}</p>
                        <p><b>Asset Subcategory : </b><br />{selectedInvoice.assetSubCategory?.name || "-"}</p>
                        <p><b>Ledger : </b><br />{selectedInvoice.ledger}</p>
                        <p><b>Asset Invoice Number : </b><br />{selectedInvoice.invoiceNumber}</p>
                        <p><b>Purchased Date : </b><br />{selectedInvoice.purchasedDate ? formDateTime(selectedInvoice.purchasedDate) : "-"}</p>
                        <p><b>Quantity :</b><br />{selectedInvoice.quantity}</p>
                        <p><b>Rate(₹) :</b><br />₹{selectedInvoice.rate}</p>
                        <p><b>Depreciation Percentage(%) : </b><br />{selectedInvoice.depreciationPercentage ? `${selectedInvoice.depreciationPercentage}%` : "-"}</p>
                        <p><b>GST Rate(%) :</b><br />{selectedInvoice.gstRate}%</p>
                        <p><b>Taxable Amount :</b><br />₹{selectedInvoice.taxable}</p>
                        <p><b>CGST Amount :</b><br />₹{selectedInvoice.cgst}</p>
                        <p><b>SGST Amount :</b><br />₹{selectedInvoice.sgst}</p>
                        <p><b>IGST Amount :</b><br />₹{selectedInvoice.igst}</p>
                        <p><b>Total Amount :</b><br />₹{selectedInvoice.invoiceValue}</p>
                        <p><b>Warranty Years :</b><br />{selectedInvoice.warrantyYear}</p>
                        <p><b>Disposed Date :</b><br />{selectedInvoice.disposedDate ? formDateTime(selectedInvoice.disposedDate) : "-"}</p>

                        <h3 className="font-medium col-span-2 mt-2">Files</h3>

                        {viewFiles.length > 0 ? (
                            viewFiles.map((file, idx) => (
                                <p key={idx} className="col-span-2">
                                    <a 
                                        href={`${API_URL}/uploads/uploads/${file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        {file}
                                    </a>
                                </p>
                            ))
                        ) : (
                            <p className="col-span-2 text-gray-500">No files uploaded</p>
                        )}
                    </div>
                );
            })()}

        </div>
    </div>
)}


                        {/* Add Modal */}

                        {isAddModalOpen && (
                            <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
                                {/* Overlay */}
                                <div className="absolute inset-0 " onClick={closeAddModal}></div>

                                <div
                                    className={`fixed top-0 right-0 h-screen overflow-x-auto w-full sm:w-[90vw] md:w-[45vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
                                        }`}
                                >
                                    <div
                                        className="w-6 h-6 rounded-full  mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                                        title="Toggle Sidebar"
                                        onClick={closeAddModal}
                                    >
                                        <IoIosArrowForward className="w-3 h-3" />
                                    </div>

                                    <div className="p-2 md:p-5">
                                        <p className="text-2xl md:text-3xl font-medium">Asset</p>


                                        {/* assest category */}
                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Asset Category<span className="text-red-500">*</span>
                                            </label>

                                            <div className="w-[60%] md:w-[50%]">
                                                <Dropdown
                                                    value={assetCategory}
                                                    onChange={(e) => setAssetCategory(e.value)}
                                                    options={accountoption}
                                                    optionValue="value"
                                                    optionLabel="label"
                                                    filter
                                                    placeholder="Select Category"
                                                    maxSelectedLabels={3}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    display="chip"
                                                />
                                                {errors.assetCategory && (
                                                    <p className="text-red-500 text-sm mb-4">
                                                        {errors.assetCategory}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* assest subcategory */}
                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Asset SubCategory<span className="text-red-500">*</span>
                                            </label>

                                            <div className="w-[60%] md:w-[50%]">
                                                <Dropdown
                                                    value={assetSubCategory}
                                                    onChange={(e) => setAssetSubCategory(e.value)}
                                                    options={assetSubCategoryOption}
                                                    optionValue="value"
                                                    optionLabel="label"
                                                    filter
                                                    placeholder="Select subCategory"
                                                    maxSelectedLabels={3}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    display="chip"
                                                />
                                                {errors.assetSubCategory && (
                                                    <p className="text-red-500 text-sm mb-4">
                                                        {errors.assetSubCategory}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* ledger */}
                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Ledger <span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <select
                                                    name="asset"
                                                    type="text"
                                                    value={ledger}
                                                    onChange={(e) => setLedger(e.target.value)}
                                                    // placeholder="Enter Asset Name "
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Select Asset Type</option>
                                                    <option value="fixedAsset">Fixed Asset</option>
                                                    <option value="currentAsset">Current Asset</option>
                                                </select>
                                                {errors.ledger && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">{errors.ledger}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* asset name */}
                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Title <span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    name="assetName"
                                                    type="text"
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    placeholder="Enter Title "
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />

                                                {errors.title && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">{errors.title}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* invoice number */}

                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Invoice Number<span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="text"
                                                    value={invoiceNumber}
                                                    onChange={(e) => setInvoiceNumber(e.target.value)}
                                                    placeholder="Enter Invoice Number "
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.invoiceNumber && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors.invoiceNumber}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* purchased date */}
                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Purchased date<span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="date"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                                                    value={purchasedDate}
                                                    onChange={(e) => setPurchasedDate(e.target.value)}
                                                //   className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                                //     p.errorDate
                                                //       ? "border-red-500 focus:ring-red-500"
                                                //       : "border-gray-300 focus:ring-blue-500"
                                                //   }`}
                                                />
                                                {errors.purchasedDate && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.purchasedDate}
                                                    </p>
                                                )}
                                            </div>
                                        </div>


                                        {/* depreciation percentage */}

                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Depreciation Percentage(%)<span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="number"
                                                    value={depreciationPercentage}
                                                    onChange={(e) => setDepreciationPercentage(e.target.value)}
                                                    placeholder="Enter depreciation Percentage "
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />

                                                {errors.depreciationPercentage && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors.depreciationPercentage}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* quantity */}

                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Quantity<span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="number"
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(e.target.value)}
                                                    placeholder="Enter Quantity "
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.quantity && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors.quantity}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* rate */}

                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Rate<span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="number"
                                                    value={rate}
                                                    onChange={(e) => setRate(e.target.value)}
                                                    placeholder="Enter Rate "
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.rate && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors.rate}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* gst rate */}

                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                GST Rate(%)<span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="number"
                                                    value={gst}
                                                    onChange={(e) => setGst(e.target.value)}
                                                    placeholder="Enter GST Rate "
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.gst && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors.gst}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Taxable Amount */}

                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Taxable Amount<span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="number"
                                                    value={taxable}
                                                    onChange={(e) => setTaxable(e.target.value)}
                                                    placeholder="Enter Taxable Amount "
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.taxable && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors.taxable}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* cgst rate */}

                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                CGST Rate
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="number"
                                                    value={cgst}
                                                    onChange={(e) => setCgst(e.target.value)}
                                                    placeholder="Enter CGST Rate "
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.cgst && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors.cgst}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* sgst rate */}

                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                SGST Rate<span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="number"
                                                    value={sgst}
                                                    onChange={(e) => setSgst(e.target.value)}
                                                    placeholder="Enter SGST Rate "
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.sgst && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors.sgst}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* igst rate */}

                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                IGST Rate<span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="number"
                                                    value={igst}
                                                    onChange={(e) => setIgst(e.target.value)}
                                                    placeholder="Enter IGST Rate "
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.igst && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors.igst}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Invoice Amount */}

                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Invoice Value<span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="number"
                                                    value={invoiceValue}
                                                    onChange={(e) => setInvoiceValue(e.target.value)}
                                                    placeholder="Enter Invoice Amount "
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.invoiceValue && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors.invoiceValue}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Warrantly Years */}

                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-1 md:mb-2">
                                                Warrantly Years<span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="number"
                                                    value={warrantyYear}
                                                    onChange={(e) => setWarrantyYear(e.target.value)}
                                                    placeholder="Enter Warrantly Years"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.warrantyYear && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors.warrantyYear}
                                                    </p>
                                                )}
                                            </div>
                                        </div>


                                        {/* Disposed Date */}

                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Disposed Date<span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="date"
                                                    value={disposedDate}
                                                    onChange={(e) => setDisposedDate(e.target.value)}
                                                    placeholder="Enter Disposed Date "
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.disposedDate && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors.disposedDate}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* file upload */}
                                        <div className="mt-2 md:mt-3 flex justify-between">
                                            <label className="block text-md font-medium mb-2">
                                                File Upload
                                            </label>
                                            <input
                                                type="file"
                                                 multiple
                                                name="fileUpload"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                className="w-[60%] md:w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                       <div className="mt-3">
    {attachments.map((file, index) => (
        <div key={index} className="flex items-center gap-2 mb-1">
            <span className="text-sm">{file.name}</span>
            <button
                type="button"
                onClick={() => handleDeleteFile(index)}
                className="text-red-600 text-lg"
            >
                <AiFillDelete />
            </button>
        </div>
    ))}
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

                                    <div className="p-2 md:p-5">
                                        <p className="text-2xl md:text-3xl font-medium">Edit Asset</p>


                                        {/* assest category */}
                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Asset Category<span className="text-red-500">*</span>
                                            </label>

                                            <div className="w-[60%] md:w-[50%]">
                                                <Dropdown
                                                    value={assetCategoryEdit}
                                                    onChange={(e) => setAssetCategoryEdit(e.value)}
                                                    options={accountoption}
                                                    optionValue="value"
                                                    optionLabel="label"
                                                    filter
                                                    placeholder="Select Category"
                                                    maxSelectedLabels={3}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    display="chip"
                                                />
                                                {errors.assetCategoryEdit && (
                                                    <p className="text-red-500 text-sm mb-4">
                                                        {errors.assetCategoryEdit}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* assest subcategory */}
                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Asset SubCategory<span className="text-red-500">*</span>
                                            </label>

                                            <div className="w-[60%] md:w-[50%]">
                                                <Dropdown
                                                    value={assetSubCategoryEdit}
                                                    onChange={(e) => setAssetSubCategoryEdit(e.value)}
                                                    options={assetSubCategoryOption}
                                                    optionValue="value"
                                                    optionLabel="label"
                                                    filter
                                                    placeholder="Select subCategory"
                                                    maxSelectedLabels={3}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    display="chip"
                                                />
                                                {errors.assetSubCategoryEdit && (
                                                    <p className="text-red-500 text-sm mb-4">
                                                        {errors.assetSubCategoryEdit}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* ledger */}
                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Ledger <span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <select
                                                    name="asset"
                                                    type="text"
                                                    value={ledgerEdit}
                                                    onChange={(e) => setLedgerEdit(e.target.value)}
                                                    // placeholder="Enter Asset Name "
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Select Asset Type</option>
                                                    <option value="fixedAsset">Fixed Asset</option>
                                                    <option value="currentAsset">Current Asset</option>
                                                </select>
                                                {errors.ledgerEdit && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">{errors.ledgerEdit}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* asset name */}
                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Title <span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    name="assetName"
                                                    type="text"
                                                    value={titleEdit}
                                                    onChange={(e) => setTitleEdit(e.target.value)}
                                                    placeholder="Enter Title "
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />

                                                {errors.titleEdit && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">{errors.titleEdit}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* invoice number */}

                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Invoice Number<span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="text"
                                                    value={invoiceNumberEdit}
                                                    onChange={(e) => setInvoiceNumberEdit(e.target.value)}
                                                    placeholder="Enter Invoice Number "
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.invoiceNumberEdit && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors.invoiceNumberEdit}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* purchased date */}
                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Purchased date<span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="date"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                                                    value={purchasedDateEdit}
                                                    onChange={(e) => setPurchasedDateEdit(e.target.value)}
                                                //   className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                                //     p.errorDate
                                                //       ? "border-red-500 focus:ring-red-500"
                                                //       : "border-gray-300 focus:ring-blue-500"
                                                //   }`}
                                                />
                                                {errors.purchasedDateEdit && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.purchasedDateEdit}
                                                    </p>
                                                )}
                                            </div>
                                        </div>


                                        {/* depreciation percentage */}

                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Depreciation Percentage(%)<span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="number"
                                                    value={depreciationPercentageEdit}
                                                    onChange={(e) => setDepreciationPercentageEdit(e.target.value)}
                                                    placeholder="Enter depreciation Percentage "
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />

                                                {errors.depreciationPercentageEdit && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors.depreciationPercentageEdit}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* quantity */}

                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Quantity<span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="number"
                                                    value={quantityEdit}
                                                    onChange={(e) => setQuantityEdit(e.target.value)}
                                                    placeholder="Enter Quantity "
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.quantityEdit && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors.quantityEdit}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* rate */}

                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Rate<span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="number"
                                                    value={rateEdit}
                                                    onChange={(e) => setRateEdit(e.target.value)}
                                                    placeholder="Enter Rate "
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.rateEdit && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors.rateEdit}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* gst rate */}

                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                GST Rate(%)<span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="number"
                                                    value={gstEdit}
                                                    onChange={(e) => setGstEdit(e.target.value)}
                                                    placeholder="Enter GST Rate "
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.gstEdit && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors.gstEdit}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Taxable Amount */}

                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Taxable Amount<span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="number"
                                                    value={taxableEdit}
                                                    onChange={(e) => setTaxableEdit(e.target.value)}
                                                    placeholder="Enter Taxable Amount "
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.taxableEdit && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors.taxableEdit}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* cgst rate */}

                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                CGST Rate
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="number"
                                                    value={cgstEdit}
                                                    onChange={(e) => setCgstEdit(e.target.value)}
                                                    placeholder="Enter CGST Rate "
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.cgstEdit && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors.cgstEdit}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* sgst rate */}

                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                SGST Rate<span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="number"
                                                    value={sgstEdit}
                                                    onChange={(e) => setSgstEdit(e.target.value)}
                                                    placeholder="Enter SGST Rate "
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.sgstEdit && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors.sgstEdit}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* igst rate */}

                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                IGST Rate<span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="number"
                                                    value={igstEdit}
                                                    onChange={(e) => setIgstEdit(e.target.value)}
                                                    placeholder="Enter IGST Rate "
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.igstEdit && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors.igstEdit}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Invoice Amount */}

                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Invoice Value<span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="number"
                                                    value={invoiceValueEdit}
                                                    onChange={(e) => setInvoiceValueEdit(e.target.value)}
                                                    placeholder="Enter Invoice Amount "
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.invoiceValueEdit && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors.invoiceValueEdit}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Warrantly Years */}

                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-1 md:mb-2">
                                                Warrantly Years<span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="number"
                                                    value={warrantyYearEdit}
                                                    onChange={(e) => setWarrantyYearEdit(e.target.value)}
                                                    placeholder="Enter Warrantly Years"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.warrantyYearEdit && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors.warrantyYearEdit}
                                                    </p>
                                                )}
                                            </div>
                                        </div>


                                        {/* Disposed Date */}

                                        <div className="mt-2 md:mt-5 mb-1 md:mb-2 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Disposed Date<span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="date"
                                                    value={disposedDateEdit}
                                                    onChange={(e) => setDisposedDateEdit(e.target.value)}
                                                    placeholder="Enter Disposed Date "
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {errors.disposedDateEdit && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors.disposedDateEdit}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                 {/* file upload */}
                                        <div className="mt-2 md:mt-3 flex justify-between">
                                            <label className="block text-md font-medium mb-2">
                                                File Upload
                                            </label>
                                            <input
                                                type="file"
                                                 multiple
                                                name="fileUpload"
                                                ref={fileInputRef}
                                                onChange={handleFileChangeEdit}
                                                className="w-[60%] md:w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                       <div className="mt-3">
    {attachments.map((file, index) => (
        <div key={index} className="flex items-center gap-2 mb-1">
            <span className="text-sm">{file.name}</span>
            <button
                type="button"
                onClick={() => handleDeleteFile(index)}
                className="text-red-600 text-lg"
            >
                <AiFillDelete />
            </button>
        </div>
    ))}
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
                                                onClick={handleSubmitEdit}
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
export default AssetManagement_details;

