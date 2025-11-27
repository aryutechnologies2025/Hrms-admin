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


const AssetManagement_details = () => {
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
    let navigate = useNavigate();
        const fileInputRef = useRef(null);
        const fileInputRefedit = useRef(null);
            const [attachmentedit, setAttachmentedit] = useState(null);
            const [attachment, setAttachment] = useState(null);
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
        setIsAnimating(false);
        setTimeout(() => setIsAddModalOpen(false), 250);
    };

    const closeEditModal = () => {
        setIsAnimating(false);
        setTimeout(() => setIsEditModalOpen(false), 250);
    };

       const handleDeleteFile = () => {
        setAttachment(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
        const handleDeleteFileedit = () => {
        setAttachmentedit(null);
        if (fileInputRefedit.current) {
            fileInputRefedit.current.value = "";
        }
    };
        const handleFileChangeedit = (e) => {
        if (e.target.files[0]) {
            setAttachment(e.target.files[0]);
        }
    };
        const handleFileChange = (e) => {
            console.log("e 1233 :",e)
        if (e.target.files[0]) {
            setAttachment(e.target.files[0]);
        }
    };


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
   



    // console.log("chech:", nameEdit, statusEdit);


    // create
    const handlesubmit = async (e) => {
        console.log("fileUpload",fileUpload)
        e.preventDefault();

        const formdata = {
            invoiceNumber: String(invoiceNumber),
            purchasedDate,
             ledger,
            assetCategory,
            assetSubCategory,
            title,
           depreciationPercentage,
            quantity: Number(quantity),
            rate: Number(rate),
            gst: Number(gst),
            taxable: Number(taxable),
            cgst: Number(cgst),
            sgst: Number(sgst),
            igst: Number(igst),
            invoiceValue: Number(invoiceValue),
            warrantyYear: Number(warrantyYear),
            disposedDate,
            fileUpload: attachment
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
    const [depreciationPercentageEdit, setDepreciationPercentageEdit ] = useState("");
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
        setGst(row.gst);
        setCgst(row.cgst);
        setSgst(row.sgst);
        setIgst(row.igst);
        setInvoiceValue(row.invoiceValue);
        setWarrantyYearEdit(row.warrantyYear);
        setDisposedDateEdit(row.disposedDate);
        setFileUploadEdit(row.fileUpload);
        setIsEditModalOpen(true);
        setTimeout(() => setIsAnimating(true), 10);
    };



    const handlesubmitedit = async (e) => {
        e.preventDefault();

        const formData = {
            assetCategory: assetCategoryEdit,
            assetSubCategory: assetSubCategoryEdit,
            ledger: ledgerEdit,
            title: titleEdit,
            invoiceNumber: invoiceNumberEdit,
            quantity: quantityEdit,
            depreciationPercentage: depreciationPercentageEdit,
            purchasedDate: purchasedDateEdit,
            rate: rateEdit,
            gst: gstEdit,
            taxable: taxableEdit,
            cgst: cgstEdit,
            sgst: sgstEdit,
            igst: igstEdit,
            invoiceValue: invoiceValueEdit,
            warrantyYear: warrantyYearEdit,
            disposedDate: disposedDateEdit,
            fileUpload: fileUploadEdit
        };

        try {
            await axios.put(
                `${API_URL}/api/asset-mannagement/edit-assetdetails/${editId}`,
                formData
            );

            toast.success("Asset updated successfully");

            closeEditModal();
            fetchAssetManagement();
        } catch (err) {
            console.log(err);
            toast.error("Failed to update asset");
        }
    };





    // delete

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
            render: (data) => data ? new Date(data).toLocaleDateString("en-GB") : "-",
        },
       
         {
            title: "Quantity",
            data: "quantity",
            defaultContent: "-"
        },

        {
    title: "Depreciation Percentage(%)",
    data: "depreciationPercentage",
    render: function (data) {
        return data ? data + "%" : "-";
    },
    defaultContent: "-"
},
      
        
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



console.log("fileIattachmentnputRef 123",attachment);
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
                                className="text-sm text-gray-500 cursor-pointer"
                                onClick={() => navigate("/dashboard")}
                            >
                                Dashboard
                            </p>
                            <p>{">"}</p>

                            <p className="text-sm text-blue-500">Assets</p>
                        </div>

                        {/* Add Button */}
                        <div className="flex justify-between mt-8">
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
                                    onClick={() => navigate("/assetcategory")}
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
                                                name="fileUpload"
                                                // ref={fileInputRef}
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
                                        <p className="text-2xl md:text-3xl font-medium">Asset Edit</p>
                                        <div className="mt-5 flex justify-between items-center">
                                            <label className="block text-md font-medium mb-2">
                                                Name <span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[70%] md:w-[50%]">
                                                <input
                                                    type="text"
                                                    value={ledgerEdit}
                                                    onChange={(e) => setLedgerEdit(e.target.value)}
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
export default AssetManagement_details;

