import React, { useState, useEffect, useRef } from "react";

import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
DataTable.use(DT);
import axios from "../../api/axiosConfig";
import { API_URL } from "../../config";
import { TfiPencilAlt } from "react-icons/tfi";
import { createRoot } from "react-dom/client";
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
    // console.log("errors checking:", errors);
    const [isAnimating, setIsAnimating] = useState(false);
    const [assetManageDetails, setAssetManageDetails] = useState([])
    // console.log("assetManageDetails check", assetManageDetails)
    const [loading, setLoading] = useState(true); // State to manage loading
    const [isInvoiceViewModalOpen, setIsInvoiceViewModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isInvoiceEditModalOpen, setIsInvoiceEditModalOpen] = useState(false);
    let navigate = useNavigate();
    const fileInputRef = useRef(null);
    const fileInputRefedit = useRef(null);
    const [attachmentedit, setAttachmentedit] = useState(null);
    const [attachments, setAttachments] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [filesToDelete, setFilesToDelete] = useState([]);

    const [existingFiles, setExistingFiles] = useState([]);  // For URLs from DB
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
                `${API_URL}/api/asset-mannagement/view-asset`,
                {withCredentials: true}
            );
            // console.log("asset get response", response);


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
                    `${API_URL}/api/asset-mannagement-category/assetCategory`,
                    {withCredentials: true}
                );
                // console.log("asset category get response", res);
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
                    `${API_URL}/api/sub-asset-category/subCategory`,
                    {withCredentials: true}
                );
                // console.log("asset subCategory get response", res);
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

    // When you fetch asset data for editing
    const fetchAssetForEdit = async (id) => {
        try {
            const response = await axios.get(`${API_URL}/api/asset-mannagement/view-asset/${id}`,
                {withCredentials: true}
            );
            const asset = response.data;

            // Handle existing files
            if (asset.fileUpload && asset.fileUpload.length > 0) {
                // Store existing files as objects with type indicator
                const existingFileObjects = asset.fileUpload.map(url => ({
                    url: url,
                    name: url.split('/').pop(), // Extract filename from URL
                    isExisting: true,
                    type: 'url'
                }));

                setAttachments(existingFileObjects);
                setExistingFiles(row.fileUpload); // Store as separate array too
            }

        } catch (error) {
            console.error("Error fetching asset:", error);
        }
    };


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
        const fileToDelete = attachments[index];

        if (fileToDelete.isExisting) {
            // If it's an existing file, mark it for deletion
            setFilesToDelete(prev => [...prev, fileToDelete.url]);

            // Remove from display
            const updatedFiles = attachments.filter((_, i) => i !== index);
            setAttachments(updatedFiles);
        } else {
            // If it's a new file (File object), just remove it
            const updatedFiles = attachments.filter((_, i) => i !== index);
            setAttachments(updatedFiles);
        }
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
    // const handleFileChangeEdit = (e) => {
    //     // if (e.target.files[0]) {
    //     //     setAttachment(e.target.files[0]);
    //     // }
    //     const files = Array.from(e.target.files);

    //     setAttachments((prev) => [...prev, ...files]);
    // };
    // const handleFileChange = (e) => {
    //     // console.log("e 1233 :", e)
    //     // if (e.target.files[0]) {
    //     //     setAttachments(e.target.files[0]);
    //     // }
    //     const files = Array.from(e.target.files);
    //     setAttachments(prev => [...prev, ...files]);
    // };

    // For Add Mode
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        // Check for duplicates
        const newFiles = files.filter(file =>
            !attachments.some(existing =>
                existing.name === file.name &&
                existing.size === file.size
            )
        );

        const updatedFiles = [...attachments, ...newFiles];
        setAttachments(updatedFiles);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        // Clear file input error
        setErrors(prev => ({ ...prev, fileUpload: "" }));
    };

    // For Edit Mode - handles both new and existing files
    const handleFileChangeEdit = (e) => {
        const files = Array.from(e.target.files);

        // Combine existing files (strings/URLs) with new File objects
        const newFiles = files.filter(file =>
            !attachments.some(existing => {
                if (existing instanceof File) {
                    return existing.name === file.name && existing.size === file.size;
                }
                return false; // If it's a URL string, don't check for duplicates
            })
        );

        //  new files to attachments
        const updatedFiles = [...attachments, ...newFiles];
        setAttachments(updatedFiles);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        // Clear file input error
        setErrors(prev => ({ ...prev, fileUpload: "" }));
    };

    const openInvoiceViewModal = (row) => {
        // console.log("Invoice row data :", row)

        setSelectedInvoice(row)
        setIsInvoiceViewModalOpen(true)
    }

    const closeInvoiceViewModal = () => {
        setIsInvoiceViewModalOpen(false)
    }

    const openInvoiceEditModal = (row) => {
        // console.log("Invoice row data :", row)
        setSelectedInvoice(row)
        setIsInvoiceEditModalOpen(true)
    }

    const closeInvoiceEditModal = () => {
        setIsInvoiceEditModalOpen(false)
    }

    const [assetCategory, setAssetCategory] = useState("");
    // console.log("assetCategory", assetCategory)
    const [accountoption, setAccountoption] = useState([]);
    // console.log("accountoption", accountoption)
    const [assetSubCategory, setAssetSubCategory] = useState("");
    // console.log("assetSubCategory", assetSubCategory)
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
        setAttachments([]);
        setExistingFiles([]);
        setFilesToDelete([]);
        setIsEditMode(false);

        //fields
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
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };


    // console.log("chech:", nameEdit, statusEdit);


    // create
    const handlesubmit = async (e) => {
        e.preventDefault();
        // console.log("attachments", attachments);


        //form validation

        const newErrors = {};
        if (!assetCategory?.trim()) newErrors.assetCategory = ("Asset Category is required");
        if (!assetSubCategory?.trim()) newErrors.assetSubCategory = ("Asset SubCategory is required");
        if (!invoiceNumber?.trim()) newErrors.invoiceNumber = ("Invoice Number is required");
        if (ledger === "") newErrors.ledger = ("Please select a Ledger");
        if (!purchasedDate) newErrors.purchasedDate = ("Please select purchased date");
        if (!title?.trim()) newErrors.title = ("Title is required");
        if (!depreciationPercentage) newErrors.depreciationPercentage = ("Depreciation Percentage is required");
        if (!quantity) newErrors.quantity = ("Quantity is required");
        if (!rate) newErrors.rate = ("Rate is required");
        if (!gst) newErrors.gstRate = ("GST Rate is required");
        if (!taxable) newErrors.taxable = ("Taxable is required");
        if (!cgst) newErrors.cgst = ("CGST is required");
        if (!sgst) newErrors.sgst = ("SGST is required");
        if (!igst) newErrors.igst = ("IGST is required");
        if (!invoiceValue) newErrors.invoiceValue = ("Invoice Value is required");
        if (!warrantyYear) newErrors.warrantyYear = ("Warranty Year is required");
        if (!disposedDate) newErrors.disposedDate = ("Please select disposed date");
        if (!attachments || attachments.length === 0)
            newErrors.fileUpload = "Please select a file";

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        // Create FormData object
        const formData = new FormData();

        // Add all text fields
        formData.append("invoiceNumber", String(invoiceNumber));
        formData.append("purchasedDate", purchasedDate);
        formData.append("ledger", ledger);
        formData.append("assetCategory", assetCategory);
        formData.append("assetSubCategory", assetSubCategory);
        formData.append("title", title);
        formData.append("depreciationPercentage", Number(depreciationPercentage));
        formData.append("quantity", Number(quantity));
        formData.append("rate", Number(rate));
        formData.append("gstRate", Number(gst));
        formData.append("taxable", Number(taxable));
        formData.append("cgst", Number(cgst));
        formData.append("sgst", Number(sgst));
        formData.append("igst", Number(igst));
        formData.append("invoiceValue", Number(invoiceValue));
        formData.append("warrantyYear", Number(warrantyYear));

        //field only if it exists
        if (disposedDate) {
            formData.append("disposedDate", disposedDate);
        }


        // If attachments is an array of files
        if (attachments && attachments.length > 0) {
            if (Array.isArray(attachments)) {

                attachments.forEach((file, index) => {

                    formData.append("fileUpload", file);
                });
            } else if (attachments instanceof FileList) {
                // If it's a FileList from input type="file" multiple
                for (let i = 0; i < attachments.length; i++) {
                    formData.append("fileUpload", attachments[i]);
                }
            } else if (attachments instanceof File) {
                // Single file
                formData.append("fileUpload", attachments);
            }
        }

        try {
            const response = await axios.post(
                `${API_URL}/api/asset-mannagement/create-asset`,
                formData,{withCredentials: true}
                // {
                //     headers: {
                //         "Content-Type": "multipart/form-data",
                //     },
                // }
            );

            toast.success("Asset created successfully");
            closeAddModal();
            fetchAssetManagement();
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


        // // Convert backend string → array
        // const files = Array.isArray(row.fileUpload)
        //     ? row.fileUpload
        //     : row.fileUpload
        //         ? [row.fileUpload]
        //         : [];
        setIsEditMode(true);
        setEditid(row._id);
        setAssetCategoryEdit(row.assetCategory?._id || "");
        setAssetSubCategoryEdit(row.assetSubCategory?._id || "");
        setLedgerEdit(row.ledger || "");
        setTitleEdit(row.title || "");
        setInvoiceNumberEdit(row.invoiceNumber || "");
        setQuantityEdit(row.quantity || "");
        setPurchasedDateEdit(row.purchasedDate?.slice(0, 10));
        setDisposedDateEdit(row.disposedDate?.slice(0, 10));
        setRateEdit(row.rate || "");
        setTaxableEdit(row.taxable || "");
        setGstEdit(row.gstRate || "");
        setCgstEdit(row.cgst || "");
        setSgstEdit(row.sgst || "");
        setIgstEdit(row.igst || "");
        setInvoiceValueEdit(row.invoiceValue || "");
        setWarrantyYearEdit(row.warrantyYear || "");
        setDepreciationPercentageEdit(row.depreciationPercentage || "");
        // setFileUploadEdit(row.fileUpload);
        setFileUploadEdit(row.fileUpload ? [row.fileUpload] : []);


        // Reset files tracking
        setFilesToDelete([]);
        setAttachments([]);

        // Handle existing files - Convert to proper format
        if (row.fileUpload && row.fileUpload.length > 0) {
            // Convert string URLs to objects
            const existingFileObjects = row.fileUpload.map(url => ({
                url: url,
                name: url.split('/').pop().split('\\').pop(), // Handle both forward and backslashes
                isExisting: true,
                type: 'url'
            }));
// console.log("existingFileObjects",existingFileObjects);
            setAttachments(existingFileObjects);
            setExistingFiles(row.fileUpload); // Store as separate array too
        } else {
            setAttachments([]);
            setExistingFiles([]);
        }
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

        //form validation

        const newErrors = {};
        if (!assetCategoryEdit?.trim()) newErrors.assetCategoryEdit = ("Asset Category is required");
        if (!assetSubCategoryEdit?.trim()) newErrors.assetSubCategoryEdit = ("Asset SubCategory is required");
        if (!invoiceNumberEdit?.trim()) newErrors.invoiceNumberEdit = ("Invoice Number is required");
        if (ledgerEdit === "") newErrors.ledgerEdit = ("Please select a Ledger");
        if (!purchasedDateEdit) newErrors.purchasedDateEdit = ("Please select purchased date");
        if (!titleEdit?.trim()) newErrors.titleEdit = ("Title is required");
        if (!depreciationPercentageEdit) newErrors.depreciationPercentageEdit = ("Depreciation Percentage is required");
        if (!quantityEdit) newErrors.quantityEdit = ("Quantity is required");
        if (!rateEdit) newErrors.rateEdit = ("Rate is required");
        if (!gstEdit) newErrors.gstRate = ("GST Rate is required");
        if (!taxableEdit) newErrors.taxableEdit = ("Taxable is required");
        if (!cgstEdit) newErrors.cgstEdit = ("CGST is required");
        if (!sgstEdit) newErrors.sgstEdit = ("SGST is required");
        if (!igstEdit) newErrors.igstEdit = ("IGST is required");
        if (!invoiceValueEdit) newErrors.invoiceValueEdit = ("Invoice Value is required");
        if (!warrantyYearEdit) newErrors.warrantyYearEdit = ("Warranty Year is required");
        if (!disposedDateEdit) newErrors.disposedDateEdit = ("Please select disposed date");
        if (!attachments || attachments.length === 0)
            newErrors.fileUploadEdit = "Please select a file";

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

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

        // Separate new files from existing files
        const newFiles = attachments.filter(file => file instanceof File);
        const existingFileUrls = attachments
            .filter(file => file.isExisting && typeof file.url === 'string')
            .map(file => file.url);

        // new files
        newFiles.forEach(file => {
            formData.append("fileUpload", file);
        });

        //  existing files that should remain
        if (existingFileUrls.length > 0) {
            formData.append("existingFiles", JSON.stringify(existingFileUrls));
        }
        //  files to delete 
        if (filesToDelete.length > 0) {
            formData.append("filesToDelete", JSON.stringify(filesToDelete));
        }



        try {
            const response = await axios.put(
                `${API_URL}/api/asset-mannagement/edit-assetdetails/${editId}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true, }
            );
            // console.log("response:", response);


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
                    .delete(`${API_URL}/api/asset-mannagement/delete-asset/${editId}`,{withCredentials: true})
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
            data: "null",
            render: (data, type, row) => {
                const id = `invoice-${row._id}`;

                setTimeout(() => {
                    const container = document.getElementById(id);
                    if (container && !container.hasChildNodes()) {
                        //  const fullData = assetManageDetails.find(item => item._id === row._id);

                         const root = createRoot(container); 
        root.render(
                            <div className="flex items-center gap-2 justify-center">

                                <FaEye
                                    className="text-blue-500 cursor-pointer text-center"
                                    onClick={() => openInvoiceViewModal(row)}
                                />
                            </div>,
                            container
                        );
                    }
                });
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
                    if (container) {
            if (!container._root) {
              container._root = createRoot(container);
            }
            container._root.render(
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



    // console.log("fileIattachmentsInputRef 123", attachments);
    return (
        <div className="flex flex-col justify-between bg-gray-100 w-full min-h-screen px-3 md:px-5 pt-2 md:pt-10 overflow-x-auto">
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div>


                        <div className="">
                            <Mobile_Sidebar />
                            
                        </div>
                        <div className="flex justify-end mt-2 md:mt-0 gap-1 items-center">
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
                                {/* Overlay */}
                                <div className="absolute inset-0 z-40" onClick={closeInvoiceViewModal}></div>

                                <div className="relative z-50 bg-white p-6 rounded-xl w-[450px] shadow-lg">

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
                                    {/* {(() => {
                                        var viewFiles = Array.isArray(selectedInvoice.fileUpload)
                                            ? selectedInvoice.fileUpload
                                            : selectedInvoice.fileUpload
                                                ? [selectedInvoice.fileUpload]
                                                : []; */}


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


                                        {/* Files Section */}

                                        <div className="col-span-2 mt-4">
                                            <h4 className="font-semibold mb-2">Files:</h4>

                                            {(() => {
                                                const files = Array.isArray(selectedInvoice.fileUpload)
                                                    ? selectedInvoice.fileUpload
                                                    : selectedInvoice.fileUpload
                                                        ? [selectedInvoice.fileUpload]
                                                        : [];

                                                return files.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {files.map((file, idx) => {
                                                            const fileName = file.split('/').pop().split('\\').pop();
                                                            const fileUrl = `${API_URL}/uploads/assets/${fileName}`;


                                                            return (
                                                                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                                    <span className="text-sm truncate flex-1 mr-2">{fileName}</span>
                                                                    <a
                                                                        href={fileUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                                    >
                                                                        View
                                                                    </a>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500">No files uploaded</p>
                                                );
                                            })()}
                                        </div>
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
                                                    className={`w-full   rounded-lg px-3 py-2  focus:outline-none focus:ring-1 focus:ring-blue-500
                                                    border ${errors.assetCategory ? "border-red-500" : "border-gray-300"}`}
                                                    display="chip"
                                                />
                                                {errors?.assetCategory && (
                                                    <p className="text-red-500 text-sm mb-4">
                                                        {errors?.assetCategory}
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
                                                    className={`w-full   rounded-lg px-3 py-2  focus:outline-none focus:ring-1 focus:ring-blue-500
                                                    border ${errors.assetSubCategory ? "border-red-500" : "border-gray-300"}`}
                                                    display="chip"
                                                />
                                                {errors?.assetSubCategory && (
                                                    <p className="text-red-500 text-sm mb-4">
                                                        {errors?.assetSubCategory}
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
                                                    className={`w-full   rounded-lg px-3 py-2  focus:outline-none focus:ring-1 focus:ring-blue-500
                                                    border ${errors.ledger ? "border-red-500" : "border-gray-300"}`}
                                                >
                                                    <option value="">Select Asset Type</option>
                                                    <option value="fixedAsset">Fixed Asset</option>
                                                    <option value="currentAsset">Current Asset</option>
                                                </select>
                                                {errors?.ledger && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">{errors?.ledger}</p>
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
                                                    className={`w-full   rounded-lg px-3 py-2  focus:outline-none focus:ring-1 focus:ring-blue-500
                                                    border ${errors.title ? "border-red-500" : "border-gray-300"}`}
                                                />

                                                {errors?.title && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">{errors?.title}</p>
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
                                                    className={`w-full   rounded-lg px-3 py-2  focus:outline-none focus:ring-1 focus:ring-blue-500
                                                    border ${errors.invoiceNumber ? "border-red-500" : "border-gray-300"}`}
                                                />
                                                {errors?.invoiceNumber && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors?.invoiceNumber}
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
                                                    className={`w-full   rounded-lg px-3 py-2  focus:outline-none focus:ring-1 focus:ring-blue-500
                                                    border ${errors.purchasedDate ? "border-red-500" : "border-gray-300"}`}

                                                    value={purchasedDate}
                                                    onChange={(e) => setPurchasedDate(e.target.value)}
                                                //   className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                                //     p.errorDate
                                                //       ? "border-red-500 focus:ring-red-500"
                                                //       : "border-gray-300 focus:ring-blue-500"
                                                //   }`}
                                                />
                                                {errors?.purchasedDate && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors?.purchasedDate}
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
                                                    className={`w-full   rounded-lg px-3 py-2  focus:outline-none focus:ring-1 focus:ring-blue-500
                                                    border ${errors.depreciationPercentage ? "border-red-500" : "border-gray-300"}`}
                                                />

                                                {errors?.depreciationPercentage && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors?.depreciationPercentage}
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
                                                    className={`w-full   rounded-lg px-3 py-2  focus:outline-none focus:ring-1 focus:ring-blue-500
                                                    border ${errors.quantity ? "border-red-500" : "border-gray-300"}`}
                                                />
                                                {errors?.quantity && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors?.quantity}
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
                                                    className={`w-full   rounded-lg px-3 py-2  focus:outline-none focus:ring-1 focus:ring-blue-500
                                                    border ${errors.rate ? "border-red-500" : "border-gray-300"}`}
                                                />
                                                {errors?.rate && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors?.rate}
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
                                                    className={`w-full   rounded-lg px-3 py-2  focus:outline-none focus:ring-1 focus:ring-blue-500
                                                    border ${errors.gst ? "border-red-500" : "border-gray-300"}`}
                                                />
                                                {errors?.gst && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors?.gst}
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
                                                    className={`w-full   rounded-lg px-3 py-2  focus:outline-none focus:ring-1 focus:ring-blue-500
                                                    border ${errors.taxable ? "border-red-500" : "border-gray-300"}`}
                                                />
                                                {errors?.taxable && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors?.taxable}
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
                                                    className={`w-full   rounded-lg px-3 py-2  focus:outline-none focus:ring-1 focus:ring-blue-500
                                                    border ${errors.cgst ? "border-red-500" : "border-gray-300"}`}
                                                />
                                                {errors?.cgst && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors?.cgst}
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
                                                    className={`w-full   rounded-lg px-3 py-2  focus:outline-none focus:ring-1 focus:ring-blue-500
                                                    border ${errors.sgst ? "border-red-500" : "border-gray-300"}`}
                                                />
                                                {errors?.sgst && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors?.sgst}
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
                                                    className={`w-full   rounded-lg px-3 py-2  focus:outline-none focus:ring-1 focus:ring-blue-500
                                                    border ${errors.igst ? "border-red-500" : "border-gray-300"}`}
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
                                                    className={`w-full   rounded-lg px-3 py-2  focus:outline-none focus:ring-1 focus:ring-blue-500
                                                    border ${errors.invoiceValue ? "border-red-500" : "border-gray-300"}`}
                                                />
                                                {errors?.invoiceValue && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors?.invoiceValue}
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
                                                    className={`w-full   rounded-lg px-3 py-2  focus:outline-none focus:ring-1 focus:ring-blue-500
                                                    border ${errors.warrantyYear ? "border-red-500" : "border-gray-300"}`}
                                                />
                                                {errors?.warrantyYear && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors?.warrantyYear}
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
                                                    className={`w-full   rounded-lg px-3 py-2  focus:outline-none focus:ring-1 focus:ring-blue-500
                                                    border ${errors.disposedDate ? "border-red-500" : "border-gray-300"}`}
                                                />
                                                {errors?.disposedDate && (
                                                    <p className="text-red-500 text-sm mb-2 md:mb-4">
                                                        {errors?.disposedDate}
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
                                                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx" // Specify accepted file types
                                                className={`w-[60%] md:w-[50%] px-3 py-2 border ${errors.fileUpload ? "border-red-500" : "border-gray-300"}  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                            />
                                        </div>
                                        <div className="mt-3">
                                            {attachments.length === 0 ? (
                                                <p className="text-sm text-gray-500">No files selected</p>
                                            ) : (
                                                <>
                                                    <p className="text-sm mb-2">
                                                        Selected files ({attachments.length}/10):
                                                    </p>
                                                    {attachments.map((file, index) => (
                                                        <div key={index} className="flex items-center gap-2 mb-1 p-2 bg-gray-50 rounded">
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
                                                </>
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
                                                    className={`w-full   rounded-lg px-3 py-2  focus:outline-none focus:ring-1 focus:ring-blue-500
                                                    border ${errors.assetCategory ? "border-red-500" : "border-gray-300"}`}
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
                                                    className={`w-full   rounded-lg px-3 py-2  focus:outline-none focus:ring-1 focus:ring-blue-500
                                                    border ${errors.assetCategory ? "border-red-500" : "border-gray-300"}`}
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
                                                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                                className="w-[60%] md:w-[50%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="mt-3">
                                            {attachments.length === 0 ? (
                                                <p className="text-sm text-gray-500">No files selected</p>
                                            ) : (
                                                <>
                                                    <p className="text-sm mb-2">Selected files:</p>
                                                    {attachments.map((file, index) => {
                                                        // Handle both File objects and URL strings
                                                        const fileName = file.name || (typeof file === 'string' ? file.split('/').pop() : 'File');
                                                        const isExistingFile = file.isExisting || typeof file === 'string';

                                                        return (
                                                            <div key={index} className="flex items-center justify-between gap-2 mb-1 p-2 bg-gray-50 rounded">
                                                                <div className="flex items-center gap-2 flex-1">
                                                                    <span className="text-sm truncate">
                                                                        {fileName}
                                                                    </span>
                                                                    {isExistingFile && (
                                                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                                            Existing
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteFile(index)}
                                                                    className="text-red-600 text-lg hover:text-red-800"
                                                                    title="Remove file"
                                                                >
                                                                    <AiFillDelete />
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </>
                                            )}
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

