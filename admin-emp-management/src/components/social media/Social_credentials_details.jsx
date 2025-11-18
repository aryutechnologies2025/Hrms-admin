import React, { useState, useEffect, useRef } from "react";

import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
DataTable.use(DT);

import axios from "../../api/axiosConfig";
import { API_URL } from "../../config";
// import { capitalizeFirstLetter } from "../../StringCaps";
import { TfiPencilAlt } from "react-icons/tfi";

import ReactDOM from "react-dom";
import Swal from "sweetalert2";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { MdOutlineDeleteOutline } from "react-icons/md";

import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Dropdown } from "primereact/dropdown";
import { IoClose } from "react-icons/io5";
import { FaEye } from "react-icons/fa";

const Social_credentials_details = () => {
  const navigate = useNavigate();

  // const location = useLocation();

  const employeeIds = window.location.pathname.split("/")[2];
  console.log("window.location.pathname", employeeIds);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  //   popup password

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  // console.log("passwordInput", passwordInput);
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(true); // State to manage loading

  //   const handlePasswordSubmit = () => {
  //     if (passwordInput ) {
  //       setIsPasswordModalOpen(false);
  //       setPasswordInput("");
  //       setPasswordError("");
  //     } else {
  //       setPasswordError("Incorrect password. Try again!");
  //     }
  //   };

  const [isAnimating, setIsAnimating] = useState(false);

  const openAddModal = () => {
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

  // Fetch roles from the API
  useEffect(() => {
    // fetchProject();
    fetchAccount();
  }, []);

  //   const [status, setStatus] = useState("");
  const storedDetatis = localStorage.getItem("hrmsuser");
  const parsedDetails = JSON.parse(null);
  const userid = parsedDetails ? parsedDetails.id : null;
  const [errors, setErrors] = useState({});

  const [accountdetails, setAccountdetails] = useState([]);
  const [accountOption, setAccountOption] = useState(null);
  //   console.log("accountOption", accountOption);
  const fetchAccount = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/social-media/view-socialmedia-name`
      );
      //   console.log(response);
      if (response.data.success) {
        const projectName = response.data.data.map((emp) => ({
          label: emp.name,
          value: emp._id,
        }));
        setAccountOption(projectName);
      } else {
        setErrors("Failed to fetch roles.");
      }
    } catch (err) {
      setErrors("Failed to fetch roles.");
    }
  };

  console.log("accountdetails", accountdetails);

  //   const fetchProject = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${API_URL}/api/social-media/view-socialmedia-credential`,{
  //             params:{
  //                 password:passwordInput,
  //             }
  //         }
  //       );
  //       console.log(response);
  //       if (response.data.success) {
  //         setAccountdetails(response.data.data);

  //       } else {
  //         setErrors("Failed to fetch roles.");
  //       }
  //     } catch (err) {
  //       setErrors("Failed to fetch roles.");
  //     }
  //   };

  // Open and close modals
  // const openAddModal = () => {
  //   setIsAddModalOpen(true);
  // };

  // const closeAddModal = () => {
  //   setIsAddModalOpen(false);
  //   setErrors("");
  // };

  const handlePasswordSubmit = async () => {
    if (!passwordInput) {
      setPasswordError("Password is required!");
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/api/social-media/view-socialmedia-credential`,
        { params: { password: passwordInput } }
      );

      if (response.data.success) {
        setAccountdetails(response.data.data);
        setIsPasswordModalOpen(false);
        setPasswordError("");
        setPasswordInput("");
        setLoading(false);
      } else {
        setPasswordError("Incorrect password. Try again!");
      }
    } catch (err) {
      const backendMessage =
        err.response?.data?.message || "Something went wrong!";
      setPasswordError(backendMessage);
      setLoading(false);
    }
  };

  const [accountselect, setAccountselect] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryPhone, setRecoveryPhone] = useState("");
  const [backup, setBackup] = useState("");
  const [notes, setNotes] = useState("");

  //   const [errors, setErrors] = useState({});

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        account: accountselect,
        title: title,
        url: url,
        email: email,
        password: password,
        username: username,
        recovery_email: recoveryEmail,
        recovery_phone: recoveryPhone,
        recovery_backup_code: backup,
        note: notes,
      };

      const response = await axios.post(
        `${API_URL}/api/social-media/create-socialmedia-credential`,
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
      setAccountselect("");
      setTitle("");
      setUrl("");
      setEmail("");
      setPassword("");
      setUsername("");
      setRecoveryEmail("");
      setRecoveryPhone("");
      setBackup("");
      setNotes("");

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
  const [accountselectedit, setAccountselectedit] = useState("");
  const [titleedit, setTitleedit] = useState("");
  const [urledit, setUrledit] = useState("");
  const [emailedit, setEmailedit] = useState("");
  const [passwordedit, setPasswordedit] = useState("");
  const [usernameedit, setUsernameedit] = useState("");
  const [recoveryEmailedit, setRecoveryEmailedit] = useState("");
  const [recoveryPhoneedit, setRecoveryPhoneedit] = useState("");
  const [backupedit, setBackupedit] = useState("");
  const [notesedit, setNotesedit] = useState("");
  //

  const [editid, setEditid] = useState([]);

  console.log("editid", editid);

  const openEditModal = (row) => {
    console.log("rowData", row);

    setEditid(row._id);
    setAccountselectedit(row.account._id);
    setTitleedit(row.title);
    setUrledit(row.url);
    setEmailedit(row.email);
    setPasswordedit(row.password);
    setUsernameedit(row.username);
    setRecoveryEmailedit(row.recovery_email);
    setRecoveryPhoneedit(row.recovery_phone);
    setBackupedit(row.recovery_backup_code);
    setNotesedit(row.note);

    setIsEditModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const handlesubmitedit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        account: accountselectedit,
        title: titleedit,
        url: urledit,
        email: emailedit,
        password: passwordedit,
        username: usernameedit,
        recovery_email: recoveryEmailedit,
        recovery_phone: recoveryPhoneedit,
        recovery_backup_code: backupedit,
        note: notesedit,
      };

      const response = await axios.put(
        `${API_URL}/api/social-media/edit-socialmedia-credential/${editid}`,
        formData
      );
      console.log("response:", response);
      Swal.fire({
        icon: "success",
        title: "Status Update successfully!",
        showConfirmButton: true,
        timer: 1500,
      });

      setIsEditModalOpen(false);
      handlePasswordSubmit();

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

  const handleDelete = async (id) => {
    // console.log("editid", id);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this Status ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(
          `${API_URL}/api/social-media/delete-socialmedia-credential/${id}`
        );
        Swal.fire("Deleted!", "The Status has been deleted.", "success");
        console.log("res", res);
        setAccountdetails((prev) => prev.filter((item) => item._id !== id));
        // fetchProject();
      } catch (err) {
        console.error("Failed to delete:", err);
        Swal.fire("Error", "There was an error deleting the Status.", "error");
      }
    } else {
      Swal.fire("Cancelled", "Your Status is safe :)", "info");
    }
  };
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
      title: "Account",
      data: null,
      render: (row) => row.account?.name || "-",
    },
    {
      title: "Title",
      data: "title",
    },
    {
      title: "Email",
      data: "email",
    },
    {
      title: "Password",
      data: "password",
    },
    {
      title: "username",
      data: "username",
    },

    {
      title: "Url",
      data: "url",
      render: function (data, type, row) {
        if (data) {
          return `<a href="${data}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">Click Me</a>`;
        }
        return "";
      },
    },
    {
      title: "Note",
      data: null,
      render: (data, type, row) => {
        const id = `notes-${row.sno || Math.random()}`;

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
                    setSelectedContent(row.notes);
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

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-2 md:pt-10">
      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Enter Password</h2>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                autoComplete="off"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 pr-10"
              />
              <span
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <AiOutlineEye className="h-5 w-5" />
                ) : (
                  <AiOutlineEyeInvisible className="h-5 w-5" />
                )}
              </span>
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm mb-2">{passwordError}</p>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => navigate("/")}
                className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {!isPasswordModalOpen && (
        <>
          {loading ? (
            <Loader />
          ) : (
            <>
              <div>
                <Mobile_Sidebar />

                <div className="flex gap-2 items-center cursor-pointer text-sm">
                  <p
                    className=" text-gray-500 cursor-pointer"
                    onClick={() => navigate("/")}
                  >
                    Dashboard
                  </p>
                  <p>{">"}</p>
                  <p className=" text-blue-500"> Social Credentials</p>
                  <p>{">"}</p>
                </div>

                {/* Add Button */}
                <div className="flex justify-between mt-8 mb-3">
                  <h1 className="text-2xl md:text-3xl font-semibold">
                    {" "}
                    Social Credentials
                  </h1>
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
                      data={accountdetails}
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
                          <h2 className="text-2xl font-semibold text-gray-800">
                            Notes
                          </h2>
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
                            {selectedContent || "No Notes provided."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Add Modal */}
                {isAddModalOpen && (
                  <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
                    {/* Overlay */}
                    <div
                      className="absolute inset-0 "
                      onClick={closeAddModal}
                    ></div>

                    <div
                      className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${
                        isAnimating ? "translate-x-0" : "translate-x-full"
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
                        <h2 className="text-xl font-semibold mb-4">
                          Add Credentials
                        </h2>
                        {/* account name */}

                        <div className="mb-3 flex justify-between">
                          <label className="block text-sm font-medium mb-2">
                            Account name
                          </label>
                          <div className="w-[50%]">
                            <Dropdown
                              value={accountselect}
                              onChange={(e) => setAccountselect(e.value)}
                              options={accountOption}
                              optionValue="value"
                              optionLabel="label"
                              filter
                              placeholder="Select a Account"
                              className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.client_name && (
                              <p className="text-red-500 text-sm mb-4">
                                {errors.client_name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* title */}
                        <div className="mb-3 flex justify-between">
                          <label className="block text-sm font-medium mb-2">
                            Title
                          </label>
                          <div className="w-[50%]">
                            <input
                              type="text"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              placeholder="Enter Title "
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && (
                              <p className="text-red-500 text-sm mb-4">
                                {errors.name}
                              </p>
                            )}
                          </div>
                        </div>
                        {/* url */}
                        <div className="mb-3 flex justify-between">
                          <label className="block text-sm font-medium mb-2">
                            Url
                          </label>
                          <div className="w-[50%]">
                            <input
                              type="url"
                              value={url}
                              onChange={(e) => setUrl(e.target.value)}
                              placeholder="Enter Url "
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && (
                              <p className="text-red-500 text-sm mb-4">
                                {errors.name}
                              </p>
                            )}
                          </div>
                        </div>
                        {/* email */}
                        <div className="mb-3 flex justify-between">
                          <label className="block text-sm font-medium mb-2">
                            Email
                          </label>
                          <div className="w-[50%]">
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Enter Email "
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && (
                              <p className="text-red-500 text-sm mb-4">
                                {errors.name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* password */}

                        <div className="mb-3 flex justify-between">
                          <label className="block text-sm font-medium mb-2">
                            Password
                          </label>
                          <div className="w-[50%]">
                            <input
                              type="text"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Enter Password "
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && (
                              <p className="text-red-500 text-sm mb-4">
                                {errors.name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* username */}

                        <div className="mb-3 flex justify-between">
                          <label className="block text-sm font-medium mb-2">
                            UserName
                          </label>
                          <div className="w-[50%]">
                            <input
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              placeholder="Enter UserName "
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && (
                              <p className="text-red-500 text-sm mb-4">
                                {errors.name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* recovery email */}
                        <div className="mb-3 flex justify-between">
                          <label className="block text-sm font-medium mb-2">
                            Recovery Email
                          </label>
                          <div className="w-[50%]">
                            <input
                              type="email"
                              value={recoveryEmail}
                              onChange={(e) => setRecoveryEmail(e.target.value)}
                              placeholder="Enter Recovery Email "
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && (
                              <p className="text-red-500 text-sm mb-4">
                                {errors.name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* recovery phonr */}

                        <div className="mb-3 flex justify-between">
                          <label className="block text-sm font-medium mb-2">
                            Recovery Phone
                          </label>
                          <div className="w-[50%]">
                            <input
                              type="number"
                              value={recoveryPhone}
                              onChange={(e) => setRecoveryPhone(e.target.value)}
                              placeholder="Enter RecoveryPhone "
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && (
                              <p className="text-red-500 text-sm mb-4">
                                {errors.name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* backup */}

                        <div className="mb-3 flex justify-between">
                          <label className="block text-sm font-medium mb-2">
                            Recovery Backup Code
                          </label>
                          <div className="w-[50%]">
                            <input
                              type="text"
                              value={backup}
                              onChange={(e) => setBackup(e.target.value)}
                              placeholder="Enter Backup "
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && (
                              <p className="text-red-500 text-sm mb-4">
                                {errors.name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* notes */}

                        <div className="mb-3 flex justify-between">
                          <label className="block text-sm font-medium mb-2">
                            Notes
                          </label>
                          <div className="w-[50%]">
                            <textarea
                              type="text"
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder=" Enter Notes"
                              className="w-full  h-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && (
                              <p className="text-red-500 text-sm mb-4">
                                {errors.name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Buttons */}
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

                {/* Edit Modal */}
                {isEditModalOpen && (
                  <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
                    {/* Overlay */}
                    <div
                      className="absolute inset-0 "
                      onClick={closeEditModal}
                    ></div>

                    <div
                      className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${
                        isAnimating ? "translate-x-0" : "translate-x-full"
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
                        <h2 className="text-xl font-semibold mb-4">
                          Edit Credentials
                        </h2>
                        {/* account name */}

                        <div className="mb-3 flex justify-between">
                          <label className="block text-sm font-medium mb-2">
                            Account name
                          </label>
                          <div className="w-[50%]">
                            <Dropdown
                              value={accountselectedit}
                              onChange={(e) => setAccountselectedit(e.value)}
                              options={accountOption}
                              optionValue="value"
                              optionLabel="label"
                              filter
                              //   placeholder="Select a Account"
                              className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.client_name && (
                              <p className="text-red-500 text-sm mb-4">
                                {errors.client_name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* title */}
                        <div className="mb-3 flex justify-between">
                          <label className="block text-sm font-medium mb-2">
                            Title
                          </label>
                          <div className="w-[50%]">
                            <input
                              type="text"
                              value={titleedit}
                              onChange={(e) => setTitleedit(e.target.value)}
                              placeholder="Enter Title "
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && (
                              <p className="text-red-500 text-sm mb-4">
                                {errors.name}
                              </p>
                            )}
                          </div>
                        </div>
                        {/* url */}
                        <div className="mb-3 flex justify-between">
                          <label className="block text-sm font-medium mb-2">
                            Url
                          </label>
                          <div className="w-[50%]">
                            <input
                              type="url"
                              value={urledit}
                              onChange={(e) => setUrledit(e.target.value)}
                              placeholder="Enter Url "
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && (
                              <p className="text-red-500 text-sm mb-4">
                                {errors.name}
                              </p>
                            )}
                          </div>
                        </div>
                        {/* email */}
                        <div className="mb-3 flex justify-between">
                          <label className="block text-sm font-medium mb-2">
                            Email
                          </label>
                          <div className="w-[50%]">
                            <input
                              type="email"
                              value={emailedit}
                              onChange={(e) => setEmailedit(e.target.value)}
                              placeholder="Enter Email "
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && (
                              <p className="text-red-500 text-sm mb-4">
                                {errors.name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* password */}

                        <div className="mb-3 flex justify-between">
                          <label className="block text-sm font-medium mb-2">
                            Password
                          </label>
                          <div className="w-[50%]">
                            <input
                              type="text"
                              value={passwordedit}
                              onChange={(e) => setPasswordedit(e.target.value)}
                              placeholder="Enter Password "
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && (
                              <p className="text-red-500 text-sm mb-4">
                                {errors.name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* username */}

                        <div className="mb-3 flex justify-between">
                          <label className="block text-sm font-medium mb-2">
                            UserName
                          </label>
                          <div className="w-[50%]">
                            <input
                              type="text"
                              value={usernameedit}
                              onChange={(e) => setUsernameedit(e.target.value)}
                              placeholder="Enter UserName "
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && (
                              <p className="text-red-500 text-sm mb-4">
                                {errors.name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* recovery email */}
                        <div className="mb-3 flex justify-between">
                          <label className="block text-sm font-medium mb-2">
                            Recovery Email
                          </label>
                          <div className="w-[50%]">
                            <input
                              type="email"
                              value={recoveryEmailedit}
                              onChange={(e) =>
                                setRecoveryEmailedit(e.target.value)
                              }
                              placeholder="Enter Recovery Email "
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && (
                              <p className="text-red-500 text-sm mb-4">
                                {errors.name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* recovery phonr */}

                        <div className="mb-3 flex justify-between">
                          <label className="block text-sm font-medium mb-2">
                            Recovery Phone
                          </label>
                          <div className="w-[50%]">
                            <input
                              type="number"
                              value={recoveryPhoneedit}
                              onChange={(e) =>
                                setRecoveryPhoneedit(e.target.value)
                              }
                              placeholder="Enter RecoveryPhone "
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && (
                              <p className="text-red-500 text-sm mb-4">
                                {errors.name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* backup */}

                        <div className="mb-3 flex justify-between">
                          <label className="block text-sm font-medium mb-2">
                            Recovery Backup Code
                          </label>
                          <div className="w-[50%]">
                            <input
                              type="text"
                              value={backupedit}
                              onChange={(e) => setBackupedit(e.target.value)}
                              placeholder="Enter Backup "
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && (
                              <p className="text-red-500 text-sm mb-4">
                                {errors.name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* notes */}

                        <div className="mb-3 flex justify-between">
                          <label className="block text-sm font-medium mb-2">
                            Notes
                          </label>
                          <div className="w-[50%]">
                            <textarea
                              type="text"
                              value={notesedit}
                              onChange={(e) => setNotesedit(e.target.value)}
                              placeholder=" Enter Notes"
                              className="w-full  h-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && (
                              <p className="text-red-500 text-sm mb-4">
                                {errors.name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-2 mt-4">
                          <button
                            onClick={closeEditModal}
                            className="bg-red-100 hover:bg-red-200 text-sm text-red-600 px-5 py-2 font-semibold rounded-full"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handlesubmitedit}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 font-semibold rounded-full"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Footer />
            </>
          )}
        </>
      )}
    </div>
  );
};
export default Social_credentials_details;
