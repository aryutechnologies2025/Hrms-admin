import React, { useState, useEffect, useRef } from "react";

import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
DataTable.use(DT);
import Swal from "sweetalert2";


import Footer from "../components/Footer";
import Mobile_Sidebar from "../components/Mobile_Sidebar";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Editor } from "primereact/editor";
import { createRoot } from "react-dom/client";


import axios from "../api/axiosConfig";
import { API_URL } from "../config";

import { toast, ToastContainer } from "react-toastify";
import { MdOutlineDeleteOutline } from "react-icons/md";

import { FaEdit } from "react-icons/fa";

import { FaTrashAlt } from "react-icons/fa";
import { InputText } from "primereact/inputtext";
import { FaEye } from "react-icons/fa";

// import { Column } from "primereact/column";
// import { DataTable } from "primereact/datatable";




const Client_note_details = () => {

    const { _id } = useParams();
    // console.log("id", _id)
    const location = useLocation();
    const row = location.state?.row;

    // console.log("row", row)
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");

    const [titleError, setTitleError] = useState("");
    const [descError, setDescError] = useState("");

    const [notes, setNotes] = useState([]);
    const handleSave = async () => {
        let hasError = false;

        if (!title.trim()) {
            setTitleError("Title is required");
            hasError = true;
        } else {
            setTitleError("");
        }

        if (!desc.trim()) {
            setDescError("Description is required");
            hasError = true;
        } else {
            setDescError("");
        }

        if (hasError) return;
        try {

            const formData = {
                title: title,
                description: desc,
                projectId: _id,
            };

            const response = await axios.post(`${API_URL}/api/projectNotes/create-projectNotes`, formData, { withCredentials: true });
            // console.log("response", response)
            toast.success("Notes Created Successfully!");
            fetchNotes();

            setTitle("");
            setDesc("");
            setOpen(false);
        } catch (err) {
            console.error("Failed to save note", err);
            toast.error("Failed to create notes");
        }
    };
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNotes();

    }, []);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const resp = await axios.get(`${API_URL}/api/projectNotes/projectNotes/${_id}`,
                { withCredentials: true }
            );

            // console.log("resp.data.data :", resp.data.data);
            setNotes(resp.data.data);

        } catch (err) {
            console.error("Error fetching clients:", err);
        } finally {
            setLoading(false);
        }
    };

    const [openedit, setOpenedit] = useState(false);
    const [titleedit, setTitleedit] = useState("");
    const [descedit, setDescedit] = useState("");
    // console.log("descedit", descedit)
    const [editid, setEditid] = useState("");

    const handleEdit = (row) => {

        // console.log("row", row)
        setEditid(row._id);
        setTitleedit(row.title);
        setDescedit(row?.description);
        setOpenedit(true);
    };


    const handleEditSave = async () => {

        try {

            const formData = {
                title: titleedit,
                description: descedit,
                // projectId: _id,
            };

            const response = await axios.put(`${API_URL}/api/projectNotes/edit-projectNotesdetails/${editid}`, formData, { withCredentials: true });
            // console.log("response", response)
            toast.success("Notes Edit Successfully!");
            fetchNotes();


            setOpenedit(false);
        } catch (err) {
            console.error("Failed to save note", err);
            toast.error("Failed to create notes");
        }
    };

    const [showPopup, setShowPopup] = useState(false);
    const [descView, setDescView] = useState("");
    const handleShow = (row) => {
        setDescView(row.description);
        setShowPopup(true);
    };

    // const columns = [
    //     { field: "sno", header: "S.NO" },
    //     { field: "title", header: "Title" },
    //     // { field: "description", header: "Description" },
    // {
    //   field: "description",
    //   header: "Description",
    //   body: (row) => (
    //     <div className="action-container flex gap-4 justify-center">
    //       <FaEye
    //         onClick={() => handleShow(row)}
    //         className="text-xl cursor-pointer text-gray-600"
    //         title="View Description"
    //       />
    //     </div>
    //   ),
    // },




    //     {
    //       field: "actions",
    //       header: "Action",
    //       body: (row) => (
    //         <div className="action-container flex gap-4 justify-center">

    //           <FaEdit
    //             onClick={() => handleEdit(row)}
    //             className="text-xl cursor-pointer mt-1"
    //             title="Edit"
    //           />
    //           <MdOutlineDeleteOutline
    //             onClick={() => deleteMom(row._id || row.id)}
    //             className="text-red-600 text-xl cursor-pointer mt-1"
    //             title="Delete"
    //           /> 
    //         </div>
    //       ),
    //     },
    //   ];


    const deleteProject = (roleId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete this Notes?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`${API_URL}/api/projectNotes/delete-projectNotesDelete/${roleId}`,
                        { withCredentials: true }
                    )
                    .then((response) => {
                        if (response.data.success) {
                            Swal.fire("Deleted!", "Project Notes has been deleted.", "success");
                            // fetchRoles(); // Refresh the roles list
                            fetchNotes();
                        } else {
                            Swal.fire("Error!", "Failed to delete Project Notes.", "error");
                        }
                    })
                    .catch((error) => {
                        console.error("Error Notes:", error);
                        Swal.fire("Error!", "Failed to Notes.", "error");
                    });
            }
        });
    };

    const columns = [
        {
            title: "S.No",
            data: null,
            render: (data, type, row, meta) => meta.row + 1, // AUTO NUMBERING
        },

        {
            title: "Title",
            data: "title",
        },

        {
            title: "Description",
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
                                    className="modula-icon-edit  flex gap-2"
                                    style={{
                                        color: "#000",
                                    }}
                                >
                                    <FaEye
                                        onClick={() => handleShow(row)}
                                        className="text-xl cursor-pointer text-gray-600 hover:text-black"
                                        title="View Description"
                                    />
                                    {/* <MdOutlineDeleteOutline
                      className="text-red-600 text-xl cursor-pointer"
                      onClick={() => {
                        deleteProject(row._id);
                      }}
                    /> */}
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
                                <div className="cursor-pointer">

                                </div>
                                <div
                                    className="modula-icon-edit  flex gap-2"
                                    style={{
                                        color: "#000",
                                    }}
                                >
                                    {/* <div>one</div> */}
                                    <FaEdit
                                        onClick={() => handleEdit(row)}
                                        className="text-xl cursor-pointer text-blue-600"
                                        title="Edit"
                                    />

                                    <MdOutlineDeleteOutline
                                        onClick={() => deleteProject(row._id)}
                                        className="text-xl cursor-pointer text-red-600"
                                        title="Delete"
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


    return (
        <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-2 md:pt-10">

            {/* HEADER */}

            <div>
                <div className=" cursor-pointer">
                    <Mobile_Sidebar />

                </div>
                <ToastContainer />


                <div className="flex justify-end gap-1 mt-3 md:mt-0 items-center">
                    <p
                        className="text-sm text-gray-500"
                        onClick={() => navigate("/dashboard")}
                    >

                        Dashboard
                    </p>
                    <p>{">"}</p>

                    <p className="text-sm text-blue-500" onClick={() => navigate("/project-list ")}
                    >Project List</p>
                    <p>{">"}</p>

                    <p className="text-sm text-blue-500">Project Notes</p>
                </div>
                <div className="flex justify-between mt-4 mb-3">
                    <h1 className="text-3xl font-semibold">Project Notes</h1>

                    <button
                        onClick={() => setOpen(true)}
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Add
                    </button>
                </div>

                <div className="flex justify-between mt-4 mb-3">
                    <h1 className="text-2xl font-normal">
                        Project Name: {row?.name}
                    </h1>
                </div>




                {/* POPUP */}
                {open && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-10 z-50">
                        <div className="bg-white w-[90%] md:w-[500px] rounded-xl shadow-lg p-5">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Add Note</h2>
                                <button onClick={() => setOpen(false)}>✕</button>
                            </div>

                            <div className="mt-4">
                                <label className="font-medium">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400"
                                    placeholder="Enter title..."
                                />
                                {titleError && <p className="text-red-500 text-sm mt-1">{titleError}</p>}


                                <label className="font-medium mt-4 block">Description</label>

                                <div className="w-full md:w-[100%] rounded-lg">

                                    <Editor
                                        style={{ height: "100px" }}
                                        id="description"
                                        name="description"
                                        text={desc}
                                        onTextChange={(e) => setDesc(e.htmlValue)}
                                        className="w-full border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {descError && <p className="text-red-500 text-sm mt-1">{descError}</p>}

                                </div>
                            </div>

                            {/* BUTTONS */}
                            <div className="flex justify-end gap-3 mt-5">
                                <button
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-2 rounded-lg border hover:bg-gray-200"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* edit */}

                {openedit && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-10 z-50">
                        <div className="bg-white w-[90%] md:w-[500px] rounded-xl shadow-lg p-5">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Edit Note</h2>
                                <button onClick={() => setOpenedit(false)}>✕</button>
                            </div>

                            <div className="mt-4">
                                <label className="font-medium">Title</label>
                                <input
                                    type="text"
                                    value={titleedit}
                                    onChange={(e) => setTitleedit(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400"
                                    placeholder="Enter title..."
                                />


                                <label className="font-medium mt-4 block">Description</label>

                                <div className="w-full md:w-[100%] rounded-lg">

                                    <Editor
                                        style={{ height: "100px" }}
                                        id="description"
                                        name="description"
                                        text={descedit}
                                        value={descedit}
                                        onTextChange={(e) => setDescedit(e.htmlValue)}
                                        className="w-full border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                </div>
                            </div>

                            {/* BUTTONS */}
                            <div className="flex justify-end gap-3 mt-5">
                                <button
                                    onClick={() => setOpenedit(false)}
                                    className="px-4 py-2 rounded-lg border hover:bg-gray-200"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleEditSave}
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* LIST OF NOTES (like Google Keep) */}


                <div className="w-full md:mx-auto relative">


                    <div className="relative mt-4">
                        {loading && (
                            <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center z-10">
                                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                            </div>
                        )}

                        <div className="table-scroll-container" id="datatable">
                            <DataTable
                                data={notes}
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

                    {showPopup && (
                        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
                            <div
                                className="
        bg-white rounded-xl shadow-xl relative
        w-full max-w-[450px]
        max-h-[90vh]
        flex flex-col
      "
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setShowPopup(false)}
                                    className="absolute right-3 top-3 text-gray-500 hover:text-black text-xl"
                                >
                                    ✕
                                </button>

                                {/* Title */}
                                <h2 className="text-xl font-semibold p-4 border-b">
                                    Description
                                </h2>

                                {/* Scrollable Content */}
                                <div
                                    className="p-4 text-gray-700 overflow-y-auto overflow-x-auto prose max-w-none "
                                    dangerouslySetInnerHTML={{ __html: descView }}
                                />
                            </div>
                        </div>
                    )}







                </div>

            </div>
            <Footer />
        </div>
    );
};
export default Client_note_details;
