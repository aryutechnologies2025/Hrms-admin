import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Editor } from "primereact/editor";
import Swal from "sweetalert2";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEdit, FaUpload } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import { MultiSelect } from "primereact/multiselect";
import { IoDocument } from "react-icons/io5";
import { API_URL } from "../../config";
import Mobile_Sidebar from "../Mobile_Sidebar";
import Footer from "../Footer";
import { use } from "react";
import { useDateUtils } from "../../hooks/useDateUtils";


const AssectDocument = () => {
  const navigate = useNavigate();
  const formatDateTime = useDateUtils();

  const storedDetails = localStorage.getItem("hrmsuser");
  const parsedDetails = storedDetails ? JSON.parse(storedDetails) : null;
  let user = parsedDetails ? parsedDetails : null;

  // --- UI state ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // --- lists & options ---
  const [momList, setMomList] = useState([]);
  // console.log("momList", momList); // list of MOM records
  const [clientOptions, setClientOptions] = useState([]);
  // console.log("clientOptions", clientOptions); // { label, value }
  const [projectOptions, setProjectOptions] = useState([]);
  // console.log("projectOptions", projectOptions); // project objects or {name, _id}

  // --- form state (used for both add & edit) ---
  const [formDate, setFormDate] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formClient, setFormClient] = useState(null); // client id
  // console.log("formClient", formClient);
  const [formProject, setFormProject] = useState(null);
  const [formAttendees, setFormAttendees] = useState(null);
  const [formDescription, setFormDescription] = useState("");
  const [formEmployee, setFormEmployee] = useState([]);
  const [employeeOption, setEmployeeOptions] = useState(null);
  const [formStatus, setFormStatus] = useState("");
  // console.log("employee", employeeOption);
  // --- edit-specific ---
  const [editingId, setEditingId] = useState(null);

  // --- view state ---
  const [viewData, setViewData] = useState(null);

  // Editor ref not strictly required — we use controlled state via onTextChange
  // const editorRef = useRef(null);

  // common headers with token
  const authHeaders = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("hrms_employee_token")}`,
    },
  };
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setUploadedFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveFile = (indexToRemove) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  useEffect(() => {
    fetchClients();
    fetchMoms();
    fetchEmployee();
  }, []);

  // fetch clients
  const fetchClients = async () => {
    try {
      setLoading(true);
      const resp = await axios.get(`${API_URL}/api/client/view-clientdetails`,
        {withCredentials: true}
      );

      // console.log("resp.data.data :", resp.data.data);
      const clientName = resp.data.data.map((emp) => ({
        label: emp.client_name,
        value: emp._id,
      }));

      setClientOptions(clientName);
    } catch (err) {
      console.error("Error fetching clients:", err);
      toast.error("Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  };

  // fetch projects for a given client id (used for add/edit when client selected)
  const fetchProjectsByClient = async () => {
    // console.log("fetchProject");
    try {
      setLoading(true);
      // you used a route earlier: /api/invoice/get-project-name-with-client with params.project = client
      const response = await axios.get(
        `${API_URL}/api/invoice/get-project-name-with-client`,
        {
          params: { project: formClient },
          withCredentials: true,
        }
      );
      // console.log("response for project", response);

      // adapt: server returns array of projects with name and _id
      const projects = response.data?.data || [];
      // console.log("projects", projects);
      setProjectOptions(projects);
    } catch (err) {
      console.error("Error fetching projects:", err);
      toast.error("Failed to fetch projects for client");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const resp = await axios.get(`${API_URL}/api/employees/all-employees`,
        {withCredentials: true}
      );
      // map to primereact dropdown options
      // const opts = resp.data?.data?.map((c) => ({ label: c.client_name, value: c._id })) || [];

      // // console.log("response1",resp)
      // console.log("response",opts)
      // setClientOptions(opts);
      // console.log("resp.data.data :", resp.data.data);

      const response = resp.data.data.map((emp) => ({
        label: emp.employeeName,
        value: emp._id,
      }));
      setEmployeeOptions(response);
    } catch (err) {
      console.error("Error fetching clients:", err);
      toast.error("Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  };

  // fetch MOM list
  const fetchMoms = async () => {
    try {
      let resp;
      setLoading(true);
      // if (user?.type === "client") {
      //   resp = await axios.get(
      //     `${API_URL}/api/mom/get-mom/`,
      //     { params: { clientId: user?._id } },
      //     authHeaders
      //   );
      // } else if (user?.type === "subuser") {
      //   resp = await axios.get(
      //     `${API_URL}/api/mom/get-mom/`,
      //     { params: { clientId: user?.client?._id, subUserId: user?._id } },
      //     authHeaders
      //   );
      // } else {
      resp = await axios.get(`${API_URL}/api/mom/get-document/`, authHeaders,
        {withCredentials: true}
      );
      // }
      setMomList(resp.data?.data || []);
    } catch (err) {
      console.error("Error fetching MOMs:", err);
      toast.error("Failed to fetch MOMs");
    } finally {
      setLoading(false);
    }
  };

  // Create
  // const handleCreate = async (e) => {
  //   e?.preventDefault?.();
  //   setErrors({});

  //   const newErrors = {};
  //   if (!formDate) newErrors.date = "Date is required.";
  //   if (!formClient) newErrors.client = "Client is required.";
  //   if (!formProject) newErrors.project = "Project is required.";
  //   if (!formStatus) newErrors.status = "Status is required.";

  //   if (!formDescription) newErrors.description = "Description is required.";
  //   if(formTitle.trim()==="") newErrors.title="Title is required.";

  //   if (Object.keys(newErrors).length > 0) {
  //     console.log(newErrors);
  //     setErrors(newErrors);
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     // build payload as your backend expects; this is an example
  //     const formData = new FormData();

  //     formData.append("date", formDate);
  //      formData.append("title",formTitle);
  //     formData.append("client", formClient);
  //     formData.append("project", formProject);
  //     // formData.append("employee", userid);
  //     formData.append("description", formDescription);
  //     formData.append("status", formStatus);
  //     //   formEmployee.forEach((file) => {
  //     //     formData.append("attendees[]", file);
  //     //   });
  //     uploadedFiles.forEach((file) => {
  //       formData.append("document[]", file);
  //     });
  //      formData.append("createdBy",user?._id );

  //     const resp = await axios.post(
  //       `${API_URL}/api/mom/create-document`,
  //      {project:formProject,client:formClient,date:formDate,title:formTitle,description:formDescription,status:formStatus,createdBy:user?._id},
  //     );
  //     console.log("create res", resp);
  //     toast.success("Asset Document Created Successfully!");
  //     setIsAddModalOpen(false);
  //     // clear form
  //     resetForm();
  //     fetchMoms();
  //   } catch (err) {
  //     console.error("Create Asset Document error", err);
  //     // if backend validations return err.response.data.errors
  //     if (err.response?.data?.errors) setErrors(err.response.data.errors);
  //     else toast.error("Failed to create Asset Document");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleCreate = async (e) => {
    e?.preventDefault?.();
    setErrors({});

    const newErrors = {};

    if (!formDate) newErrors.date = "Date is required.";
    if (!formClient) newErrors.client = "Client is required.";
    if (!formProject) newErrors.project = "Project is required.";
    if (!formStatus) newErrors.status = "Status is required.";
    if (!formDescription) newErrors.description = "Description is required.";
    if (formTitle.trim() === "") newErrors.title = "Title is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("date", formDate);
      formData.append("title", formTitle);
      formData.append("client", formClient);
      formData.append("project", formProject);
      formData.append("description", formDescription);
      formData.append("status", formStatus);
      formData.append("createdBy", user?._id);

      uploadedFiles.forEach((file) => {
        formData.append("document[]", file);
      });

      const resp = await axios.post(
        `${API_URL}/api/mom/create-document`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      toast.success("Asset Document Created Successfully!");
      setIsAddModalOpen(false);
      resetForm();
      fetchMoms();
    } catch (err) {
      console.error("Create Asset Document error", err);
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      else toast.error("Failed to create Asset Document");
    } finally {
      setLoading(false);
    }
  };


  // -------------------------
  // Open edit modal & populate fields
  // -------------------------
  const openEditModalWith = async (mom) => {
    // mom: record from momList
    // console.log("openEditModalWith mom:", mom);
    setEditingId(mom?._id);
    setFormDate(mom?.date ? mom.date.split("T")[0] : ""); // assume iso string
    setFormClient(mom?.client?._id);
    // fetch projects for that client and then set project
    // await fetchProjectsByClient(mom.client || mom.clientName);
    setFormProject(mom?.project?._id);
    setFormStatus(mom?.status);
    setFormTitle(mom?.title);
    // if (mom?.attendees) {
    //   const attendees = mom.attendees.map((emp) => emp._id);
    //   setFormAttendees(attendees);
    // }
    setFormDescription(mom?.description);
    setUploadedFiles(mom?.documents); // clear uploaded files on edit
    setIsEditModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeEditModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsEditModalOpen(false), 250);
    setEditingId("");
    setFormDate("");
    setFormClient("");
    setFormStatus("");
    setFormProject("");
    setFormAttendees([]);
    setFormDescription("");
    setUploadedFiles([]);
  };
  const closeAddModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAddModalOpen(false), 250);
    setFormDate("");

    setFormDate("");
    setFormClient("");
    setFormProject("");
    setFormEmployee([]);
    setFormDescription("");
    setUploadedFiles([]);
  };
  const handleUpdate = async (e) => {
    e?.preventDefault?.();
    setErrors({});
    // validations (same as create)
    const newErrors = {};
    if (!formDate) newErrors.date = "Date is required.";
    if (!formClient) newErrors.client = "Client is required.";
    if (!formProject) newErrors.project = "Project is required.";
    if (!formStatus) newErrors.status = "Status is required.";
    if (!formDescription) newErrors.description = "Description is required.";
    if (formTitle.trim() === "") newErrors.title = "Title is required.";



    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("date", formDate);
      formData.append("clientName", formClient);
      formData.append("projectName", formProject);
      // formData.append("employee", userid);
      formData.append("description", formDescription);
      formData.append("status", formStatus);
      formData.append("title", formTitle);
      formData.append("updatedBy", user?._id);
      // formData.append("createdBy", );

      // formAttendees.forEach((file) => {
      //   formData.append("attendees[]", file);
      // });

      if (uploadedFiles && uploadedFiles.length > 0) {
        uploadedFiles.forEach((file) => {
          formData.append("document[]", file);
        });
      } else {
        formData.append("document[]", "");
      }

      const resp = await axios.put(
        `${API_URL}/api/mom/update-document/${editingId}`,
        formData,
        authHeaders,
        {withCredentials: true}
      );
      toast.success("MOM Updated Successfully!");
      setIsEditModalOpen(false);
      resetForm();
      fetchMoms();
      setEditingId("");
      setFormDate("");
      setFormClient("");
      setFormProject("");
      setFormAttendees([]);
      setFormDescription("");
      setUploadedFiles([]);
    } catch (err) {
      console.error("Update Document error", err);
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      else toast.error("Failed to update Document");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Delete MOM
  // -------------------------
  const deleteMom = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the Document permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await axios.delete(
            `${API_URL}/api/mom/delete-Document/${id}`,
            authHeaders, {withCredentials: true}
          );
          toast.success("Document Deleted Successfully!");
          fetchMoms();
        } catch (err) {
          console.error("Delete error", err);
          toast.error("Failed to delete Document");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // -------------------------
  // View MOM details
  // -------------------------
  const showMomDetails = async (mom) => {
    try {
      setLoading(true);
      // if you have a get-by-id route, use it. Otherwise use the passed object.
      // Example endpoint: /api/mom/get-mom/:id
      // const resp = await axios.get(`${API_URL}/api/mom/get-mom/${mom._id}`, authHeaders);
      // setViewData(resp.data.data);

      // using passed mom object:

      setViewData(mom);
      // console.log("viewData ", mom);

      setIsViewModalOpen(true);
      setTimeout(() => setIsAnimating(true), 10);
    } catch (err) {
      console.error("Fetch mom detail error", err);
      toast.error("Failed to load MOM details");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // helpers
  // -------------------------
  const resetForm = () => {
    setFormDate("");
    setFormClient(null);
    setFormProject(null);
    setFormAttendees([]);
    setFormDescription("");
    setEditingId(null);
    setProjectOptions([]);
    setErrors({});
  };

  // When client changes in the add/edit form, load projects
  useEffect(() => {
    if (formClient) {
      // console.log("forClint :", formClient);
      fetchProjectsByClient(formClient);
    } else {
      setProjectOptions([]);
      setFormProject(null);
    }
  }, [formClient]);
  //   const columns = [
  //   { field: "sno", header: "S.NO" },

  //   {
  //     field: "date",
  //     header: "Date",
  //     body: (row) => formatDateTime(row?.date || row?.createdAt || ""),
  //   },

  //   {
  //     field: "title",
  //     header: "Title",
  //     body: (row) => row?.title || "-",
  //   },

  //   {
  //     field: "project",
  //     header: "Project Name",
  //     body: (row) => row?.project?.name || "-",
  //   },

  //   {
  //     field: "client",
  //     header: "Client",
  //     body: (row) => row?.client?.client_name || "-",
  //   },

  //   {
  //     field: "status",
  //     header: "Status",
  //     body: (row) => statusMap[row?.status] || row?.status || "-",
  //   },

  //   {
  //     field: "actions",
  //     header: "Action",
  //     body: (row) => (
  //       <div className="action-container flex gap-4 justify-center">
  //         <FaEye onClick={() => showMomDetails(row)} className="text-xl cursor-pointer mt-1" />

  //         {user?.type !== "client" && user?.type !== "subuser" && (
  //           <>
  //             <FaEdit
  //               onClick={() => openEditModalWith(row)}
  //               className="text-xl cursor-pointer mt-1"
  //             />
  //             <MdOutlineDeleteOutline
  //               onClick={() => deleteMom(row._id)}
  //               className="text-red-600 text-xl cursor-pointer mt-1"
  //             />
  //           </>
  //         )}
  //       </div>
  //     ),
  //   },
  // ];
  const columns = [
    { field: "sno", header: "S.NO" },
    {
      field: "date",
      header: "Date",
      body: (row) => {
        const d = row?.date || row?.createdAt || "";
        if (!d) return "";
        return formatDateTime(d);
      },
    },
    {
      field: "projectName",
      header: "Project Name",
      body: (row) => row?.project?.name || "-",
    },
    {
      field: "client",
      header: "Client",
      body: (row) => row?.createdBy?.name || "-",
    },

    {
      field: "status",
      header: "Status",
      body: (row) => row?.status == "1" ? "Active" : "Inactive" || "-",
    },
    // {
    //   field: "document",
    //   header: "Veiw Documnet",
    //   body: (row) =>
    //     row.documents.map((doc, index) => {
    //       return (
    //         <a
    //           href={`${API_URL}api/uploads/others/${doc.filepath}`}
    //           target="_blank"
    //           rel="noopener noreferrer"
    //           className="text-gray-500  text-xl"
    //         >
    //           <IoDocument />
    //         </a>
    //       );
    //     }),
    // },

    {
      field: "actions",
      header: "Action",
      body: (row) => (
        <div className="action-container flex gap-4 justify-center">
          <FaEye
            onClick={() => showMomDetails(row)}
            className="text-xl cursor-pointer mt-1"
            title="View"
          />
          {user?.type != "client" && user?.type != "subuser" ? (
            <>
              <FaEdit
                onClick={() => openEditModalWith(row)}
                className="text-xl cursor-pointer mt-1"
                title="Edit"
              />
              <MdOutlineDeleteOutline
                onClick={() => deleteMom(row._id || row.id)}
                className="text-red-600 text-xl cursor-pointer mt-1"
                title="Delete"
              />{" "}
            </>
          ) : (
            ""
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col justify-between overflow-x-hidden bg-gray-100 min-h-screen px-3  md:px-5 py-2 md:py-5 w-screen ">
      <div>
        <Mobile_Sidebar />

        <ToastContainer />

        <div className="flex gap-2 text-sm items-center mt-3">
          <p
            className="text-sm text-gray-500"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </p>
          <p>{">"}</p>
          <p className="text-sm text-blue-500">Asset Document</p>
        </div>

        <div className="flex justify-between mt-8">
          <div className="">
            <h1 className="text-2xl md:text-3xl font-semibold">
              Asset Document
            </h1>
          </div>

          <button
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
              setTimeout(() => setIsAnimating(true), 10);
            }}
            className=" px-3 py-2  text-white bg-blue-500 hover:bg-blue-600 font-medium w-20 rounded-2xl"
          >
            Add
          </button>
        </div>

        <div className="w-full md:mx-auto relative">
          <div className="mt-8 flex justify-end gap-2 md:gap-4">
            <InputText
              placeholder=" Search"
              className="md:px-2 py-2 rounded-md"
            />
          </div>

          <div className="relative mt-4">
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center z-10">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
              </div>
            )}

            <DataTable
              className="mt-8"
              value={momList}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 20]}
              showGridlines
              resizableColumns
              emptyMessage="No Data Found"
            >
              {columns.map((col, index) => (
                <Column
                  key={index}
                  field={col.field}
                  header={col.header}
                  body={
                    col.field === "sno"
                      ? (rowData, { rowIndex }) => rowIndex + 1
                      : col.body
                  }
                  style={{
                    minWidth: "150px",
                    wordWrap: "break-word",
                    overflow: "hidden",
                    whiteSpace: "normal",
                  }}
                />
              ))}
            </DataTable>
          </div>

          {/* ---------------- Add Modal ---------------- */}
          {isAddModalOpen && (
            <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
              <div className="absolute inset-0 " onClick={closeAddModal} />
              <div
                className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
                  }`}
              >
                <div
                  className="w-6 h-6 rounded-full  mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                  title="Toggle Sidebar"
                  onClick={closeAddModal}
                >
                  <IoIosArrowForward className="w-3 h-3" />
                </div>

                <div className="p-5 px-10">
                  <p className="text-2xl md:text-3xl font-medium">
                    Add Document
                  </p>
                  <div className="mt-5 flex justify-between items-center">
                    <label className="block text-md font-medium mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <div className="w-[60%] md:w-[70%] rounded-lg">
                      <input
                        type="date"
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.date && (
                        <p className="text-red-500 text-sm">{errors.date}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-5 flex justify-between items-center">
                    <label className="block text-md font-medium mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <div className="w-[60%] md:w-[70%] rounded-lg">
                      <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm">{errors.title}</p>
                      )}
                    </div>
                  </div>
                  {/* <div className="mt-5 flex flex-wrap md:flex-wrap justify-between items-center">
                    <label className="block text-md font-medium mb-2">
                      Client name<span className="text-red-500">*</span>
                    </label>
                    <div className="w-[60%] md:w-[70%] rounded-lg">
                      <Dropdown
                        value={formClient}
                        onChange={(e) => setFormClient(e.value)}
                        options={clientOptions}
                        optionValue="value"
                        optionLabel="label"
                        filter
                        placeholder="Select a Client"
                        className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.client && <p className="text-red-500 text-sm">{errors.client}</p>}
                    </div>
                  </div> */}
                  <div className="mt-5 flex justify-between items-center">
                    <label className="block text-md font-medium mb-2">
                      Client name<span className="text-red-500">*</span>
                    </label>
                    <div className="w-[60%] md:w-[70%] rounded-lg">
                      <Dropdown
                        value={formClient}
                        onChange={(e) => setFormClient(e.value)}
                        options={clientOptions}
                        optionValue="value"
                        optionLabel="label"
                        filter
                        placeholder="Select a Client"
                        className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {/* {errors.client_name && (
                                        <p className="text-red-500 text-sm mb-4">
                                          {errors.client_name}
                                        </p>
                                      )} */}
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap md:flex-wrap justify-between items-center">
                    <label className="block text-md font-medium mb-2">
                      Project Name<span className="text-red-500">*</span>
                    </label>
                    <div className="w-[60%] md:w-[70%] rounded-lg">
                      <Dropdown
                        value={formProject}
                        onChange={(e) => setFormProject(e.value)}
                        options={projectOptions}
                        optionValue={(opt) => opt._id ?? opt.name}
                        optionLabel="name"
                        filter
                        placeholder="Select a Project"
                        className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.project && (
                        <p className="text-red-500 text-sm">{errors.project}</p>
                      )}
                    </div>
                  </div>
                  {/* <div className="mt-5 flex flex-wrap md:flex-wrap justify-between items-center">
                    <label
                      htmlFor="status"
                      className="block text-md font-medium mb-2"
                    >
                      Attendees <span className="text-red-500">*</span>
                    </label>
                    <div className="w-[60%] md:w-[70%] rounded-lg">
                      <MultiSelect
                        value={formEmployee}
                        onChange={(e) => setFormEmployee(e.value)}
                        options={employeeOption}
                        optionLabel="label"
                        placeholder="Select Attendees"
                        maxSelectedLabels={3}
                        className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      {errors.attendees && (
                        <p className="text-red-500 text-sm">
                          {errors.attendees}
                        </p>
                      )}
                    </div>
                  </div> */}
                  <div className="mt-8 flex justify-between">
                    <div>
                      <label className="block text-md font-medium mb-2 mt-3">
                        Description <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="w-[60%] md:w-[70%] rounded-lg">
                      <Editor
                        onTextChange={(e) => setFormDescription(e.htmlValue)}
                        style={{ height: "220px" }}
                        id="description"
                        name="description"
                        text={formDescription}
                        className="w-full border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm">
                          {errors.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap md:flex-wrap justify-between items-center">

                    <label className="block text-md font-medium mb-2 mt-3">
                      Status <span className="text-red-500">*</span>
                    </label>

                    <div className="w-[60%] md:w-[70%] rounded-lg">
                      <select
                        className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 p-2"
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value)}
                      >
                        <option value="">Select Status</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </select>
                      {errors.status && (
                        <p className="text-red-500 text-sm">
                          {errors.status}
                        </p>
                      )}
                    </div>

                  </div>


                  <div className="mt-8 flex justify-between">
                    <div>
                      <label className="block text-md font-medium mb-2 mt-3">
                        Upload Files
                      </label>
                    </div>
                    <div className="w-[60%] md:w-[70%] rounded-lg">
                      <input type="file" multiple onChange={handleFileChange} />

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

                  <div className="flex justify-end gap-2 mt-14">
                    <button
                      onClick={closeAddModal}
                      className="bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                      onClick={handleCreate}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- Edit Modal ---------------- */}
          {isEditModalOpen && (
            <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
              <div
                className="absolute inset-0 "
                onClick={() => {
                  setIsAnimating(false);
                  setTimeout(() => setIsEditModalOpen(false), 250);
                }}
              />
              <div
                className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[53vw] bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
                  }`}
              >
                <div
                  className="w-6 h-6 rounded-full  mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                  title="Toggle Sidebar"
                  onClick={() => {
                    setIsAnimating(false);
                    setTimeout(() => setIsEditModalOpen(false), 250);
                  }}
                >
                  <IoIosArrowForward className="w-3 h-3" />
                </div>

                <div className="p-5 px-10">
                  <p className="text-2xl md:text-3xl font-medium">Asset Document - Edit</p>

                  <div className="mt-5 flex justify-between items-center">
                    <label className="block text-md font-medium mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <div className="w-[60%] md:w-[70%] rounded-lg">
                      <input
                        type="date"
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.date && (
                        <p className="text-red-500 text-sm">{errors.date}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-5 flex justify-between items-center">
                    <label className="block text-md font-medium mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <div className="w-[60%] md:w-[70%] rounded-lg">
                      <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm">{errors.title}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap md:flex-wrap justify-between items-center">
                    <label className="block text-md font-medium mb-2">
                      Client name<span className="text-red-500">*</span>
                    </label>
                    <div className="w-[60%] md:w-[70%] rounded-lg">
                      <Dropdown
                        value={formClient}
                        onChange={(e) => setFormClient(e.value)}
                        options={clientOptions}
                        optionValue="value"
                        optionLabel="label"
                        filter
                        placeholder="Select a Client"
                        className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.client && (
                        <p className="text-red-500 text-sm">{errors.client}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap md:flex-wrap justify-between items-center">
                    <label className="block text-md font-medium mb-2">
                      Project Name<span className="text-red-500">*</span>
                    </label>
                    <div className="w-[60%] md:w-[70%] rounded-lg">
                      <Dropdown
                        value={formProject}
                        onChange={(e) => setFormProject(e.value)}
                        options={projectOptions}
                        optionLabel="name"
                        optionValue="_id"
                        filter
                        placeholder="Select a Project"
                        className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.project && (
                        <p className="text-red-500 text-sm">{errors.project}</p>
                      )}
                    </div>
                  </div>

                  {/* <div className="mt-5 flex flex-wrap md:flex-wrap justify-between items-center">
                    <label
                      htmlFor="status"
                      className="block text-md font-medium mb-2"
                    >
                      Attendees <span className="text-red-500">*</span>
                    </label>
                    <div className="w-[60%] md:w-[70%] rounded-lg">
                      <MultiSelect
                        value={formAttendees}
                        onChange={(e) => setFormAttendees(e.value)}
                        options={employeeOption}
                        optionLabel="label"
                        placeholder="Select Attendees"
                        maxSelectedLabels={3}
                        className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.attendees && (
                        <p className="text-red-500 text-sm">
                          {errors.attendees}
                        </p>
                      )}
                    </div>
                  </div> */}

                  <div className="mt-8 flex justify-between">
                    <div>
                      <label className="block text-md font-medium mb-2 mt-3">
                        Description <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="w-[60%] md:w-[70%] rounded-lg">
                      <Editor
                        onTextChange={(e) => setFormDescription(e.htmlValue)}
                        style={{ height: "220px" }}
                        id="description_edit"
                        name="description_edit"
                        value={formDescription}
                        className="w-full border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm">
                          {errors.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap md:flex-wrap justify-between items-center">

                    <label className="block text-md font-medium mb-2 mt-3">
                      Status <span className="text-red-500">*</span>
                    </label>

                    <div className="w-[60%] md:w-[70%] rounded-lg">
                      <select
                        className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 p-2"
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value)}
                      >
                        <option value="">Select Status</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </select>
                      {errors.status && (
                        <p className="text-red-500 text-sm">
                          {errors.status}
                        </p>
                      )}
                    </div>

                  </div>

                  <div className="mt-8 flex justify-between">
                    <div>
                      <label className="block text-md font-medium mb-2 mt-3">
                        Upload Files
                      </label>
                    </div>
                    <div className="w-[60%] md:w-[70%] rounded-lg">
                      <input type="file" multiple onChange={handleFileChange} />
                      {errors.description && (
                        <p className="text-red-500 text-sm">
                          {errors.description}
                        </p>
                      )}
                      {uploadedFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center rounded-full border p-2 w-[80%] px-3"
                            >
                              <span className="truncate text-sm text-gray-800">
                                📄 {file.originalName}
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

                  <div className="flex justify-end gap-2 mt-14">
                    <button
                      onClick={closeEditModal}
                      className="bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                      onClick={handleUpdate}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- View Modal ---------------- */}
          {isViewModalOpen && viewData && (
            <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
              <div
                className="absolute inset-0 "
                onClick={() => {
                  setIsAnimating(false);
                  setTimeout(() => setIsViewModalOpen(false), 250);
                }}
              />
              <div
                className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
                  }`}
              >
                <div
                  className="w-6 h-6 rounded-full  mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                  title="Toggle Sidebar"
                  onClick={() => {
                    setIsAnimating(false);
                    setTimeout(() => setIsViewModalOpen(false), 250);
                  }}
                >
                  <IoIosArrowForward className="w-3 h-3" />
                </div>

                <div className="p-6 md:p-8 bg-white px-10 ">
                  <h2 className="flex justify-between text-2xl md:text-3xl font-semibold text-gray-800 pb-3 mb-6">
                    Document Overview
                    <span className="text-sm font-medium flex flex-col">Created by: {viewData?.createdBy?.name || "N/A"} {viewData?.updatedBy?.name != "Unknown" && <span> Last Updated by: {viewData?.updatedBy?.name || "N/A"}</span>}</span>
                    
                  </h2>


                  <div className="space-y-4 text-gray-700">
                    <div className="grid grid-cols-1 gap-y-5">
                      <div className="flex justify-between">
                        <span className="font-medium w-32 text-gray-900">
                          Date:
                        </span>
                        <span>{formatDateTime(viewData?.date || "") || "-"}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="font-medium w-32 text-gray-900">
                          Title:
                        </span>
                        <span>{viewData?.title || "-"}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="font-medium w-32 text-gray-900">
                          Client:
                        </span>
                        <span>{viewData?.createdBy?.name || "-"}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="font-medium w-32 text-gray-900">
                          Project:
                        </span>
                        <span>{viewData?.project?.name || "-"}</span>
                      </div>



                      <div className="flex justify-between">
                        <span className="font-medium w-32 text-gray-900">
                          Documents:
                        </span>
                        <div className="flex flex-wrap gap-3">
                          {viewData?.documents?.map((doc, index) => (
                            <a
                              key={index}
                              href={`${API_URL}/api/uploads/others/${doc.filepath}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 flex gap-1 hover:text-blue-600 text-xl"
                              title={doc.filename || "View Document"}
                            >
                              <IoDocument />
                              <span className="text-sm">
                                {doc.originalName}
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Description Section */}
                    <div className="mt-6">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Description:
                      </h3>
                      <div
                        className=" p-4  pr"
                        dangerouslySetInnerHTML={{
                          __html: viewData?.description || "-",
                        }}
                      />
                    </div>


                  </div>

                  {/* Footer Button */}
                  <div className="flex justify-end mt-8">
                    <button
                      onClick={() => {
                        setIsAnimating(false);
                        setTimeout(() => setIsViewModalOpen(false), 250);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-all"
                    >
                      Close
                    </button>
                  </div>
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

export default AssectDocument;
