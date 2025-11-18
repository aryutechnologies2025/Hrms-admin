import React, { useState, useEffect, useRef } from "react";

import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
DataTable.use(DT);

import axios from "../api/axiosConfig";
import { API_URL } from "../config";
// import { capitalizeFirstLetter } from "../../StringCaps";
import { TfiPencilAlt } from "react-icons/tfi";
import { RiDeleteBin6Line } from "react-icons/ri";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";
import Footer from "../components/Footer";
import Mobile_Sidebar from "../components/Mobile_Sidebar";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FileUpload } from "primereact/fileupload";
import { MultiSelect } from "primereact/multiselect";
import { FaEye } from "react-icons/fa";
import { Editor } from "primereact/editor";
import { FaTrash } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Client_details = () => {
  const navigate = useNavigate();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [roles, setRoles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Fetch roles from the API
  useEffect(() => {
    fetchProject();
  }, []);

  console.log("roles", roles);

  const [projectname, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  //   const [status, setStatus] = useState("");
  const storedDetatis = localStorage.getItem("hrmsuser");
  const parsedDetails = JSON.parse(null);
  const userid = parsedDetails ? parsedDetails.id : null;
  const [errors, setErrors] = useState({});

  const [clientdetails, setClientdetails] = useState([]);
  console.log("clientdetails", clientdetails);

  const fetchProject = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/client/view-clientdetails`
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

  // Open and close modals
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setErrors("");
  };

  //
  const [clientName, setClientName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactPersonRole, setContactPersonRole] = useState("");
  const [website, setWebsite] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [status, setStatus] = useState("");
  const [gst, setgst] = useState("");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  //   const [errors, setErrors] = useState({});

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        client_name: clientName,
        company_name: companyName,
        email: email,
        phone_number: phoneNumber,
        address: address,
        contact_person: contactPerson,
        password: password,
        contact_person_role: contactPersonRole,
        website: website,
        country: selectedCountry?.name,
        status: status,
        notes: notes,
        gst: gst,
      };

      const response = await axios.post(
        `${API_URL}/api/client/create-clientdetails`,
        formData
      );
      console.log("response:", response);
      Swal.fire({
        icon: "success",
        title: "Client added successfully!",
        showConfirmButton: true,
        timer: 1500,
      });
      setClientName("");
      setCompanyName("");
      setEmail("");
      setPhoneNumber("");
      setAddress("");
      setNotes("");
      setContactPerson("");
      setContactPersonRole("");
      setWebsite("");
      setPassword("");
      setSelectedCountry({ name: "" });
      setStatus("");
      setIsAddModalOpen(false);
      fetchProject();

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

  //
  const [clientNameedit, setClientNameedit] = useState("");
  const [companyNameedit, setCompanyNameedit] = useState("");
  const [emailedit, setEmailedit] = useState("");
  const [phoneNumberedit, setPhoneNumberedit] = useState("");
  const [addressedit, setAddressedit] = useState("");
  const [notesedit, setNotesedit] = useState("");
  const [contactPersonedit, setContactPersonedit] = useState("");
  const [contactPersonRoleedit, setContactPersonRoleedit] = useState("");
  const [websiteedit, setWebsiteedit] = useState("");
  const [selectedCountryedit, setSelectedCountryedit] = useState(null);
  const [statusedit, setStatusedit] = useState("");
  const [editid, setEditid] = useState([]);
  const [gstedit, setgstedit] = useState("");
  const [passwordedit, setPasswordedit] = useState("");

  // console.log("editid", editid);

  const openEditModal = (row) => {
    // console.log("rowData", row);

    setEditid(row._id);
    setClientNameedit(row.client_name || "");
    setCompanyNameedit(row.company_name || "");
    setEmailedit(row.email || "");
    setPhoneNumberedit(row.phone_number || "");
    setAddressedit(row.address || "");
    setNotesedit(row.notes || "");
    setContactPersonedit(row.contact_person || "");
    setContactPersonRoleedit(row.contact_person_role || "");
    setWebsiteedit(row.website || "");
    setPasswordedit("");
    const selectedCountryObj = countryOptions.find(
      (country) => country.name === row.country
    );
    setSelectedCountryedit(selectedCountryObj || null);

    // console.log(
    //   "Matched country object:",
    //   countryOptions.find((c) => c.name === row.country)
    // );
    setStatusedit(row.status || "");
    setgstedit(row.gst || "-");
    setIsEditModalOpen(true);
  };

  const validateStatusedit = (value) => {
    const newErrors = { ...errors };
    if (!value) {
      newErrors.statusedit = ["Status is required"];
    } else {
      delete newErrors.statusedit;
    }
    setErrors(newErrors);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setErrors("");
  };

  const handlesubmitedit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        client_name: clientNameedit,
        company_name: companyNameedit,
        email: emailedit,
        phone_number: phoneNumberedit,
        address: addressedit,
        contact_person: contactPersonedit,
        contact_person_role: contactPersonRoleedit,
        website: websiteedit,
        country: selectedCountryedit.name,
        status: statusedit,
        notes: notesedit,
        gst: gstedit,
       ...(passwordedit.length > 0 && { password: passwordedit }),
      };

      const response = await axios.put(
        `${API_URL}/api/client/edit-clientdetails/${editid}`,
        formData
      );
      console.log("response:", response);
      Swal.fire({
        icon: "success",
        title: "Client Update successfully!",
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
  const validateStatus = (value) => {
    const newErrors = { ...errors };
    if (!value) {
      newErrors.status = ["Status is required"];
    } else {
      delete newErrors.status;
    }
    setErrors(newErrors);
  };

  const handleDelete = async (id) => {
    console.log("editid", id);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this Client?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.post(
          `${API_URL}/api/client/delete-clientdetails/${id}`
        );
        Swal.fire("Deleted!", "The role has been deleted.", "success");
        console.log("res", res);
        setClientdetails((prev) => prev.filter((item) => item._id !== id));
      } catch (err) {
        console.error("Failed to delete:", err);
        Swal.fire("Error", "There was an error deleting the Client.", "error");
      }
    } else {
      Swal.fire("Cancelled", "Your Client is safe :)", "info");
    }
  };

  //   console.log("edit modal", roleDetails);

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
      title: "Company Name",
      data: "company_name",
    },
    {
      title: "Email",
      data: "email",
    },
    {
      title: "Phone Number",
      data: "phone_number",
    },

    {
      title: "Status",
      data: "status",
      render: (data, type, row) => {
        const textColor =
          data === "1"
            ? "text-green-600 border rounded-full border-green-600"
            : "text-red-600 border rounded-full border-red-600";
        return `<div class="${textColor}"  style="display: inline-block; padding: 2px;  text-align: center; width:100px; font-size: 12px; font-weight:500 ">
                  ${data === "1" ? "Active" : "InActive"}
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

  const header = (
    <>
      <span className="ql-formats">
        <select className="ql-header" defaultValue="">
          <option value="1" />
          <option value="2" />
          <option value="" />
        </select>
      </span>
      <span className="ql-formats">
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
      </span>
      <span className="ql-formats">
        <select className="ql-color" />
        <select className="ql-background" />
      </span>
      <span className="ql-formats">
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
      </span>
      <span className="ql-formats">
        <button className="ql-link" />
      </span>
    </>
  );

  const priorityOption = ["Low", "Medium", "High", "Critical"];

  // conutry list

  //   const [selectedCountry, setSelectedCountry] = useState(null);

  const countryOptions = [
    { name: "United States", code: "US" },
    { name: "India", code: "IN" },
    { name: "China", code: "CN" },
    { name: "Brazil", code: "BR" },
    { name: "Indonesia", code: "ID" },
    { name: "Pakistan", code: "PK" },
    { name: "Nigeria", code: "NG" },
    { name: "Bangladesh", code: "BD" },
    { name: "Russia", code: "RU" },
    { name: "Mexico", code: "MX" },
    { name: "United Kingdom", code: "UK" }, // added UK
  ];

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-2 md:pt-10">
      <div>
        <Mobile_Sidebar />

        <div className="flex gap-2 items-center cursor-pointer">
          <p
            className="text-sm text-gray-500"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </p>
          <p>{">"}</p>

          <p className="text-sm text-blue-500">Client List</p>
        </div>

        {/* Add Button */}
        <div className="flex justify-between mt-8 mb-3">
          <h1 className="text-2xl md:text-3xl font-semibold">Client List</h1>
          <button
            onClick={openAddModal}
            className=" px-3 py-2  text-white bg-blue-500 hover:bg-blue-600 font-medium w-20 rounded-2xl"
          >
            Add
          </button>
        </div>

        <div className="datatable-container">
          {/* Responsive wrapper for the table */}
          <div className="table-scroll-container" id="datatable">
            <DataTable
              data={clientdetails}
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
        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-xl w-[500px] h-[380px] md:w-[700px] md:h-[580px] overflow-y-auto px-8 py-6">
              <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-2 ">
                <h2 className="text-xl font-semibold mb-4">Add Client</h2>
                <div className="flex gap-2">
                  <button
                    onClick={closeAddModal}
                    className=" bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                    onClick={handlesubmit}
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* name and company */}
              <div className="flex flex-wrap md:flex-nowrap justify-between gap-5 mt-2 md:mt-0">
                <div className="w-full">
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium mb-2"
                  >
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.client_name && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.client_name}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium mb-2"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {/* {errors.contact_person && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.contact_person}
                    </p>
                  )} */}
                </div>
              </div>
              {/* email phonenumber */}

              <div className="flex flex-wrap md:flex-nowrap justify-between gap-5 mt-3">
                <div className="w-full">
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium mb-2"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mb-4">{errors.email}</p>
                  )}
                </div>
                <div className="w-full">
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium mb-2"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.phone_number && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.phone_number}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap md:flex-nowrap justify-between gap-5 mt-3">
                <div className="flex flex-col gap-2 w-full relative ">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium "
                  >
                    PASSWORD <span className="text-red-500">*</span>
                  </label>
                  <div className="relative w-full">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter Password"
                      autoComplete="new-password"
                      className="border w-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg px-3 py-2 text-sm outline-none transition"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible className="h-5 w-5" />
                      ) : (
                        <AiOutlineEye className="h-5 w-5" />
                      )}
                    </button>
                  
                  </div>
                    {errors.password && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium mb-2"
                  >
                    GST Number
                  </label>
                  <input
                    type="text"
                    value={gst}
                    onChange={(e) => setgst(e.target.value)}
                    className="w-full px-3 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {/* {errors.phone_number && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.phone_number}
                    </p>
                  )} */}
                </div>
              </div>

              {/* contact person and coantact person */}

              <div className="flex flex-wrap md:flex-nowrap justify-between gap-5 mt-3">
                <div className="w-full">
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium mb-2"
                  >
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.contact_person && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.contact_person}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium mb-2"
                  >
                    Contact Person Role
                  </label>
                  <input
                    type="text"
                    value={contactPersonRole}
                    onChange={(e) => setContactPersonRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* address and notes */}

              <div className="flex flex-wrap md:flex-nowrap justify-between gap-5 mt-3">
                <div className="w-full">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium mb-2"
                  >
                    Address
                  </label>
                  <textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  ></textarea>
                </div>
                <div className="w-full">
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium mb-2"
                  >
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  ></textarea>
                </div>
              </div>

              {/* country and website */}

              <div className="flex flex-wrap md:flex-nowrap justify-between gap-5 mt-3">
                <div className="w-full">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium mb-2"
                  >
                    Country <span className="text-red-500">*</span>
                  </label>
                  <Dropdown
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.value)}
                    options={countryOptions}
                    optionLabel="name"
                    placeholder="Select a Country"
                    className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.country && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.country}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium mb-2"
                  >
                    Website
                  </label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-3 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* {errors.name && (
                <p className="text-red-500 text-sm mb-4">{errors.name}</p>
              )} */}
              <div className="flex justify-between gap-5 mt-3">
                <div className="w-full">
                  <p className="block text-sm font-medium mb-2 ">
                    Status <span className="text-red-500">*</span>
                  </p>
                  <select
                    name="status"
                    id="status"
                    onChange={(e) => {
                      setStatus(e.target.value);
                      validateStatus(e.target.value);
                    }}
                    className="w-full h-11 px-2 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a status</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                  {errors.status && (
                    <p className="text-red-500 text-sm mb-4">{errors.status}</p>
                  )}
                </div>
                {/* {error.status && <p className="error">{error.status}</p>} */}
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-xl w-[500px] h-[380px] md:w-[700px] md:h-[580px] overflow-y-auto px-8 py-6">
              <div className="flex justify-between items-center gap-2 ">
                <h2 className="text-xl font-semibold mb-4">Edit Client</h2>
                <div className="flex gap-2">
                  <button
                    onClick={closeEditModal}
                    className=" bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                    onClick={handlesubmitedit}
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* name and company */}
              <div className="flex flex-wrap md:flex-nowrap justify-between gap-5 mt-2 md:mt-0">
                <div className="w-full">
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium mb-2"
                  >
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={clientNameedit}
                    onChange={(e) => setClientNameedit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.client_name && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.client_name}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium mb-2"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyNameedit}
                    onChange={(e) => setCompanyNameedit(e.target.value)}
                    className="w-full px-3 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {/* {errors.contact_person && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.contact_person}
                    </p>
                  )} */}
                </div>
              </div>
              {/* email phonenumber */}

              <div className="flex flex-wrap md:flex-nowrap justify-between gap-5 mt-3">
                <div className="w-full">
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium mb-2"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={emailedit}
                    onChange={(e) => setEmailedit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mb-4">{errors.email}</p>
                  )}
                </div>
                <div className="w-full">
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium mb-2"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={phoneNumberedit}
                    onChange={(e) => setPhoneNumberedit(e.target.value)}
                    className="w-full px-3 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.phone_number && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.phone_number}
                    </p>
                  )}
                </div>
              </div>
              

              {/* contact person and coantact person */}

              <div className="flex flex-wrap md:flex-nowrap justify-between gap-5 mt-3">
                <div className="w-full">
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium mb-2"
                  >
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={contactPersonedit}
                    onChange={(e) => setContactPersonedit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.contact_person && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.contact_person}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium mb-2"
                  >
                    Contact Person Role
                  </label>
                  <input
                    type="text"
                    value={contactPersonRoleedit}
                    onChange={(e) => setContactPersonRoleedit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* address and notes */}

              <div className="flex flex-wrap md:flex-nowrap justify-between gap-5 mt-3">
                <div className="w-full">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium mb-2"
                  >
                    Address
                  </label>
                  <textarea
                    id="address"
                    value={addressedit}
                    onChange={(e) => setAddressedit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  ></textarea>
                </div>
                <div className="w-full">
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium mb-2"
                  >
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={notesedit}
                    onChange={(e) => setNotesedit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  ></textarea>
                </div>
              </div>

              {/* country and website */}

              <div className="flex flex-wrap md:flex-nowrap justify-between gap-5 mt-3">
                <div className="w-full">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium mb-2"
                  >
                    Country <span className="text-red-500">*</span>
                  </label>
                  <Dropdown
                    value={selectedCountryedit}
                    onChange={(e) => setSelectedCountryedit(e.value)}
                    options={countryOptions}
                    optionLabel="name"
                    placeholder="Select a Country"
                    className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium mb-2"
                  >
                    Website
                  </label>
                  <input
                    type="text"
                    value={websiteedit}
                    onChange={(e) => setWebsiteedit(e.target.value)}
                    className="w-full px-3 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* {errors.name && (
                <p className="text-red-500 text-sm mb-4">{errors.name}</p>
              )} */}
              <div className="flex flex-wrap md:flex-nowrap justify-between gap-5 mt-3">
                <div className="w-full">
                  <p className="block text-sm font-medium mb-2 ">
                    Status <span className="text-red-500">*</span>
                  </p>
                  <select
                    name="status"
                    id="status"
                    value={statusedit}
                    onChange={(e) => {
                      setStatusedit(e.target.value);
                      validateStatusedit(e.target.value);
                    }}
                    className="w-full h-11 px-2 py-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a status</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                  {errors.status && (
                    <p className="text-red-500 text-sm mb-4">{errors.status}</p>
                  )}
                </div>

                <div className="w-full">
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium mb-2"
                  >
                    GST Number
                  </label>
                  <input
                    type="text"
                    value={gstedit}
                    onChange={(e) => setgstedit(e.target.value)}
                    className="w-full px-3 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {/* {errors.phone_number && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.phone_number}
                    </p>
                  )} */}
                </div>
                {/* {error.status && <p className="error">{error.status}</p>} */}
              </div>
              <div className="flex justify-between gap-5 mt-3">
                <div className="w-full">
                  <label
                    htmlFor="roleName"
                    className="block text-sm font-medium mb-2"
                  >
                    Change Password 
                  </label>
                  <input
                    type="text"
                    value={passwordedit}
                    onChange={(e) => setPasswordedit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                 
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {isViewModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 px-8 rounded-xl w-[800px] h-[500px] overflow-y-auto relative">
              <div className="flex justify-between items-center ">
                <h2 className="text-lg font-semibold mb-4 flex gap-4">
                  View Project
                  {roleDetails.status == "1" ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-600 font-semibold">InActive</span>
                  )}
                </h2>
                <div
                  className="flex mb-4 text-2xl text-red-600 cursor-pointer bg-gray-200 p-1 rounded-full absolute right-2 top-2"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  <IoMdClose />
                </div>
              </div>

              <div className="card flex justify-between gap-4">
                <div className="w-[40%]">
                  <label className="block text-md font-medium mb-2">
                    Project Name :
                  </label>
                  <input
                    disabled
                    type="text"
                    value={roleDetails.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="my-2">
                    <label
                      htmlFor="employee_name"
                      className="block text-md font-medium "
                    >
                      Add Employees to the project :
                    </label>

                    {roleDetails.teamMembers.map((email, index) => (
                      <div className="text-sm mt-3 p-1 px-3 bg-gray-200 rounded-2xl inline-block ">
                        {index + 1}. {email}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-[55%]">
                  <label htmlFor="" className="text-md font-medium ">
                    Project Description :
                  </label>
                  <Editor
                    value={roleDetails.projectDescription}
                    className="text-md font-medium w-full pb-2 mt-2 rounded-lg"
                    style={{ height: "200px" }}
                    headerTemplate={true}
                    modules={{
                      toolbar: false, // Hide toolbar
                    }}
                    readOnly={true} // Make editor read-only
                  />
                </div>
              </div>
              <label
                htmlFor="demo"
                className="block text-md font-medium mb-2 mt-4 "
              >
                Uploaded Files :
              </label>

              <div className="flex flex-wrap mt-2 gap-2">
                {roleDetails?.document?.map((doc, index) => (
                  <div
                    key={index}
                    className="relative w-28 h-24 border rounded overflow-hidden group"
                  >
                    <a
                      href={`${API_URL}/api/uploads/others/${doc.filepath}`}
                      target="_blank"
                    >
                      <img
                        src={`${API_URL}/api/uploads/others/${doc.filepath}`}
                        alt={doc.originalName}
                        className="w-full h-full object-cover"
                      />
                    </a>
                    <span className="text-[10px] absolute bottom-0 left-0 bg-black text-white px-1 truncate w-full">
                      {doc.originalName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};
export default Client_details;
