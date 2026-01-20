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

  
  const storedDetails = localStorage.getItem("hrmsuser");
  const parsedDetails = storedDetails ? JSON.parse(storedDetails) : null;
  let user = parsedDetails ? parsedDetails : null;

//   console.log("user", user)

  // console.log("row", row)
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const [titleError, setTitleError] = useState("");
  const [descError, setDescError] = useState("");

  const [uploadedFiles, setUploadedFiles] = useState([]);

  const [notes, setNotes] = useState([]);
  const [noteType, setNoteType] = useState(""); 



  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setUploadedFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveFile = (indexToRemove) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove),
    );
  };

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
      const formData = new FormData();

    formData.append("title", title);
    formData.append("description", desc);
    formData.append("projectId", _id);
    formData.append("reporter", noteType);
    formData.append("createdBy", user._id);

    uploadedFiles.forEach((file) => {
      formData.append("projectDocuments", file);
    });

      const response = await axios.post(
        `${API_URL}/api/projectNotes/create-projectNotes`,
        formData,
        { withCredentials: true,
             headers: {
            "Content-Type": "multipart/form-data",
          },
         },
      );
      // console.log("response", response)
      toast.success("Notes Created Successfully!");
      fetchNotes();
 setUploadedFiles([]);
 setNoteType("");
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
      const resp = await axios.get(
        `${API_URL}/api/projectNotes/projectNotes-details`,{
          params: { id: _id },
        },
        { withCredentials: true },
      );

      console.log("resp.data.data :", resp.data.data);
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


   const [uploadedFilesedit, setUploadedFilesedit] = useState([]);

  const [noteTypeedit, setNoteTypeedit] = useState(""); 
  const handleFileChangeedit = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setUploadedFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveFileedit = (indexToRemove) => {
    setUploadedFilesedit((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleEdit = (row) => {
    console.log("row", row)
    setEditid(row._id);
    setTitleedit(row.title);
    setDescedit(row?.description);
    setOpenedit(true);
    setNoteTypeedit(row?.reporter);
    setUploadedFilesedit(row?.documents || []);
  };

  const handleEditSave = async () => {
    try {
        const formData = new FormData();

    formData.append("title", titleedit);
    formData.append("description", descedit);
    formData.append("reporter", noteTypeedit);

    //  append new uploaded files
    uploadedFilesedit.forEach((file) => {
      formData.append("projectDocuments", file);
    });


      const response = await axios.put(
        `${API_URL}/api/projectNotes/edit-projectNotesdetails/${editid}`,
        formData,
        { withCredentials: true,
                headers: {
            "Content-Type": "multipart/form-data",
          },
         },
      );
      // console.log("response", response)
      toast.success("Notes Edit Successfully!");
      fetchNotes();

      setOpenedit(false);
    } catch (err) {
      console.error("Failed to save note", err);
      toast.error("Failed to Edit notes");
    }
  };

  const [showPopup, setShowPopup] = useState(false);
  const [descView, setDescView] = useState("");
  const handleShow = (row) => {
    setDescView(row);
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
          .delete(
            `${API_URL}/api/projectNotes/delete-projectNotesDelete/${roleId}`,
            { withCredentials: true },
          )
          .then((response) => {
            if (response.data.success) {
              Swal.fire(
                "Deleted!",
                "Project Notes has been deleted.",
                "success",
              );
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
              container,
            );
          }
        }, 0);
        return `<div id="${id}"></div>`;
      },
    },

    {
      title: "Report",
      data: "reporter",
        render: (data) => data ? data : "-"

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
                <div className="cursor-pointer"></div>
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
              container,
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

          <p
            className="text-sm text-blue-500"
            onClick={() => navigate("/project-list ")}
          >
            Project List
          </p>
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
          <h1 className="text-2xl font-normal">Project Name: {row?.name}</h1>
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
                {titleError && (
                  <p className="text-red-500 text-sm mt-1">{titleError}</p>
                )}

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
                  {descError && (
                    <p className="text-red-500 text-sm mt-1">{descError}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 ">
                <label className="block text-md font-medium mb-2 mt-3">
                  Upload Files
                </label>

                <div className="w-[60%] md:w-[70%] rounded-lg">
                  <input type="file" multiple onChange={handleFileChange} />
                  {/* {errors.description && (
                        <p className="text-red-500 text-sm">
                          {errors.description}
                        </p>
                      )} */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center rounded-full border p-2 w-[80%] px-3"
                        >
                          <span className="truncate text-sm text-gray-800">
                            📄 {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="text-red-500 hover:text-red-700 font-semibold text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

           <div className="mt-4">
  <label className="block text-md font-medium mb-2">
  Reports
  </label>

  <div className="flex items-center gap-6">
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="noteType"
        value="yes"
        checked={noteType === "yes"}
        onChange={(e) => setNoteType(e.target.value)}
        className="h-4 w-4 accent-blue-600"
      />
      <span className="text-md font-medium">Yes</span>
    </label>

    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="noteType"
        value="no"
        checked={noteType === "no"}
        onChange={(e) => setNoteType(e.target.value)}
        className="h-4 w-4 accent-blue-600"
      />
      <span className="text-md font-medium">No</span>
    </label>
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

                        <div className="mt-4 ">
                <label className="block text-md font-medium mb-2 mt-3">
                  Upload Files
                </label>

                <div className="w-[60%] md:w-[70%] rounded-lg">
                  <input type="file" multiple onChange={handleFileChangeedit} />
                 
                  {uploadedFilesedit.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFilesedit.map((file, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center rounded-full border p-2 w-[80%] px-3"
                        >
                          <span className="truncate text-sm text-gray-800">
                            📄 {file.originalName}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFileedit(index)}
                            className="text-red-500 hover:text-red-700 font-semibold text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

           <div className="mt-4">
  <label className="block text-md font-medium mb-2">
  Reports
  </label>

  <div className="flex items-center gap-6">
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="noteType"
        value="yes"
        checked={noteTypeedit === "yes"}
        onChange={(e) => setNoteTypeedit(e.target.value)}
        className="h-4 w-4 accent-blue-600"
      />
      <span className="text-md font-medium">Yes</span>
    </label>

    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="noteType"
        value="no"
        checked={noteTypeedit === "no"}
        onChange={(e) => setNoteTypeedit(e.target.value)}
        className="h-4 w-4 accent-blue-600"
      />
      <span className="text-md font-medium">No</span>
    </label>
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

          {/* {showPopup && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
              <div
                className="
        bg-white rounded-xl shadow-xl relative
        w-full max-w-[450px]
        max-h-[90vh]
        flex flex-col
      "
              >
                <button
                  onClick={() => setShowPopup(false)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-black text-xl"
                >
                  ✕
                </button>

                <h2 className="text-xl font-semibold p-4 border-b">
                  Description
                </h2>

                <div
                  className="p-4 text-gray-700 overflow-y-auto overflow-x-auto prose max-w-none "
                  dangerouslySetInnerHTML={{ __html: descView?.description }}
                />
              </div>
            </div>
          )} */}

          {showPopup && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
    <div
      className="
        bg-white rounded-xl shadow-xl relative
        w-full max-w-[500px]
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
      <div className="p-4 space-y-4 overflow-y-auto overflow-x-auto">

        {/* Description */}
        <div
          className="text-gray-700 prose max-w-none"
          dangerouslySetInnerHTML={{ __html: descView?.description || "-" }}
        />

        {/* Documents Section */}
        {descView?.documents?.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Documents
            </h3>

            <div className="space-y-2">
              {descView.documents.map((doc) => (
                <div
                  key={doc._id}
                  className="flex items-center justify-between border rounded-lg px-3 py-2"
                >
                  <span className="text-sm truncate">
                    📄 {doc.originalName}
                  </span>

                  <a
                    href={`${API_URL}/api/uploads/projectDocuments/${doc.filepath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Documents */}
        {(!descView?.documents || descView.documents.length === 0) && (
          <p className="text-sm text-gray-400">No documents available</p>
        )}
      </div>
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
