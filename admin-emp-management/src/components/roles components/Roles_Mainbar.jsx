import React, { useState, useEffect } from "react";

import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
DataTable.use(DT);
import Loader from "../Loader";
import axios from "../../api/axiosConfig";
import { API_URL } from "../../config";
import { capitalizeFirstLetter } from "../../utils/StringCaps";
import { TfiPencilAlt } from "react-icons/tfi";
import { RiDeleteBin6Line } from "react-icons/ri";
import ReactDOM from "react-dom";
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

const Roles_Mainbar = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  // Fetch roles from the API
  useEffect(() => {
    fetchRoles();
  }, []);

  // console.log("roles", roles);

  const [rolename, setRoleName] = useState("");
  const [status, setStatus] = useState("");
  const storedDetatis = localStorage.getItem("hrmsuser");
  const parsedDetails = JSON.parse(null);
  const userid = parsedDetails ? parsedDetails.id : null;
  const [errors, setErrors] = useState({});

  const [employeeTypeIsOpen, setEmployeeTypeIsOpen] = useState(false);
  const [selectedEmployeeTypeId, setSelectedEmployeeTypeId] = useState(null);
  const [employeeTypeOptions, setEmployeeTypeOptions] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/roles/view-employeerole`,
        {withCredentials: true}
      );
      // console.log(response);
      if (response.data.success) {
        setRoles(response.data.data);
        setLoading(false);
      } else {
        setErrors("Failed to fetch roles.");
      }
    } catch (err) {
      setErrors("Failed to fetch roles.");
      setLoading(false);
    }
  };

  // Open and close modals
  const openAddModal = () => {
    setIsAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeAddModal = () => {
    setIsAnimating(false);
    setErrors({});
    setTimeout(() => setIsAddModalOpen(false), 250);
  };

  const [roleDetails, setRoleDetails] = useState({
    name: "",
    status: "",
    id: "",
    departmentId: "",
  });

  const openEditModal = (id, name, status, departmentId) => {
    // console.log("123", departmentId);
    setRoleDetails({
      name,
      status,
      id,
      departmentId,
    });
    setIsEditModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeEditModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsEditModalOpen(false), 250);
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const formdata = {
        name: rolename,
        status: status,
        departmentId: selectedEmployeeTypeId,
      };

      const response = await axios.post(
        `${API_URL}/api/roles/create-employeerole`,
        formdata, {withCredentials: true}
      );
      setIsAddModalOpen(false);
      fetchRoles(); // Refresh the table after adding a role
      setErrors({}); // Clear any previous errors
      setRoleName("");
      setSelectedEmployeeTypeId(null);
      setStatus("");
      toast.success("Role name created successfully.");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors); // Set validation errors from API
      } else {
        console.error("Error submitting form:", err);
      }
    }
  };

  const handleSave = async (roleId) => {
    const { name, status, departmentId } = roleDetails;
    // console.log(roleId);
    if (roleDetails.name.length <= 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: ["Role name is required"],
      }));
      return;
    }

    try {
      // Assuming you're sending a PUT request to update the role
      await axios.put(`${API_URL}/api/roles/edit-employeerole/${roleId}`, {
        name,
        status,
        departmentId,
        // created_by: userid,
      },{withCredentials: true});

      setRoleDetails({ name: "", status: "", id: "", departmentId: "" });

      // Close the modal after successful update
      setIsEditModalOpen(false);
      fetchRoles(); // Refresh the table after adding a role
      setErrors({});
      toast.success("Role name updated successfully.");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors); // Set validation errors from API
      } else {
        console.error("Error submitting form:", err);
      }
    }
  };

  // Validate Role Name dynamically
  const validateRoleName = (value) => {
    const newErrors = { ...errors };
    if (!value) {
      newErrors.name = ["Role name is required"];
    } else {
      delete newErrors.name;
    }
    setErrors(newErrors);
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

  // const handleDelete = async (roleId) => {
  //   // Show confirmation dialog
  //   // const isConfirmed = window.confirm('Are you sure you want to delete this role?');
  //   const result = await Swal.fire({
  //     title: "Are you sure?",
  //     text: "Do you want to delete this role?",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, delete it!",
  //     cancelButtonText: "Cancel",
  //   });

  //   // If user confirms, proceed with deletion
  //   if (result.isConfirmed) {
  //     // if (isConfirmed) {
  //     try {
  //       const response = await axios.delete(
  //         `${API_URL}/api/roles/delete/${roleId}?created_by=${userid}`
  //       );

  //       setRoles(roles.filter((role) => role.id !== roleId));
  //       fetchRoles();
  //     } catch (error) {
  //       console.error("Error deleting role:", error);
  //     }
  //   } else {
  //     Swal.fire("Cancelled", "Your document is safe :)", "info");
  //   }
  // };

  const rolesWithSno = roles.map((role, index) => ({
    ...role,
    Sno: index + 1, // Add Sno field
  }));

  const deleteRoles = (roleId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this role?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_URL}/api/roles/delete-employeerole/${roleId}`,
            {withCredentials: true}
          )
          .then((response) => {
            if (response.data.success) {
              toast.success("Role has been deleted.");
              fetchRoles(); // Refresh the roles list
            } else {
              Swal.fire("Error!", "Failed to delete role.", "error");
            }
          })
          .catch((error) => {
            console.error("Error deleting role:", error);
            Swal.fire("Error!", "Failed to delete role.", "error");
          });
      }
    });
  };

  const columns = [
    {
      title: "S.no",
      data: "Sno",
    },
    {
      title: "Role Name",
      data: "name",
    },
    {
      title: "Department",
      data: (row) => (row.departmentId ? row.departmentId.name : "-"),
      //  body: (row) => row.departmentId ? row.departmentId.name: "-",
    },
    {
      title: "Status",
      data: "status",
      render: (data, type, row) => {
        const textColor =
          data === "1"
            ? "text-green-600 border rounded-full border-green-600"
            : "text-red-600 border rounded-full border-red-600";
        return `<div class="${textColor}" style="display: inline-block; border: 1px solid ${textColor}; text-align: center; width:100px; font-size: 12px; font-weight: 500">
                  ${data === "1" ? "ACTIVE" : "INACTIVE"}
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
                        row._id,
                        row.name,
                        row.status,
                        row.departmentId?._id
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

  useEffect(() => {
    // Fetch Employee Types
    fetch(`${API_URL}/api/department/view-employeedepartment`)
      .then((res) => res.json())
      .then((data) => setEmployeeTypeOptions(data.data));
  }, []);

  let navigate = useNavigate();

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-2 md:pt-10">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>


            <div className="">
              <Mobile_Sidebar />
              
            </div>
            <div className="flex justify-end gap-2 mt-2 md:mt-0 items-center">
                <p
                  className="text-sm text-gray-500"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </p>
                <p>{">"}</p>

                <p className="text-sm md:text-md text-blue-500">Roles</p>
              </div>

            {/* Add Button */}
            <div className="flex justify-between mt-1 md:mt-4">
              <div className="">
                <h1 className="text-3xl  font-semibold">Roles</h1>
              </div>

              <button
                onClick={openAddModal}
                className="px-3 py-2  text-white bg-blue-500 hover:bg-blue-600 font-medium w-20 rounded-2xl"
              >
                Add
              </button>
            </div>

            <div className="datatable-container">
              {/* Responsive wrapper for the table */}
              <div className="table-scroll-container" id="datatable">
                <DataTable
                  data={rolesWithSno}
                  columns={columns}
                  options={{
                    paging: true,
                    searching: true,
                    ordering: true,
                    scrollX: true,
                    responsive: true,
                    autoWidth: false,
                    pageLength: 20,
                    lengthMenu: [
                      [10, 25, 50, 100, -1],
                      ["10", "25", "50", "100", "All"]
                    ],
                  }}
                  className="display nowrap bg-white"
                />
              </div>
            </div>
            {/* Add Modal */}
            {/* {isAddModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-xl w-96">
              <h2 className="text-lg font-semibold mb-4">Add Role</h2>
              <label className="block text-sm font-medium mb-2">
                Department
              </label>
              <div className="relative w-full lg:w-72">
                <button
                  onClick={() => setEmployeeTypeIsOpen(!employeeTypeIsOpen)}
                  className="w-full py-2 px-5 rounded-xl border-2 flex justify-between items-center shadow-sm border-gray-300"
                >
                  {selectedEmployeeTypeId
                    ? employeeTypeOptions.find(
                        (opt) => opt._id === selectedEmployeeTypeId
                      )?.name
                    : "Choose type"}
                  {employeeTypeIsOpen ? (
                                      <IoIosArrowUp />
                                    ) : (
                                      <IoIosArrowDown />
                                    )}
                </button>

                {employeeTypeIsOpen && (
                  <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {employeeTypeOptions.map((opt) => (
                      <li
                        key={opt._id}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setSelectedEmployeeTypeId(opt._id);
                          setEmployeeTypeIsOpen(false);
                        }}
                      >
                        {opt.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {errors.departmentId && (
                <p className="text-red-500 text-sm mb-4 mt-1">
                  {errors.departmentId}
                </p>
              )}
              <label
                htmlFor="roleName"
                className="block text-sm font-medium mb-2 mt-3"
              >
                Role Name
              </label>
              <input
                type="text"
                id="rolename"
                name="rolename"
                onChange={(e) => {
                  setRoleName(e.target.value);
                  validateRoleName(e.target.value); // Validate role name dynamically
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            
              {errors.name && (
                <p className="text-red-500 text-sm mb-4 mt-1">{errors.name}</p>
              )}
              <p>Status</p>
              <select
                name="status"
                id="status"
                onChange={(e) => {
                  setStatus(e.target.value);
                  validateStatus(e.target.value); // Validate status dynamically
                }}
                className="w-full h-10 rounded-lg px-1 outline border-0 border-gray-300 outline-gray-300"
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
              <div className="flex justify-end gap-2 mt-8">
                <button
                  onClick={closeAddModal}
                  className="bg-gray-400 px-4 py-2 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 px-4 py-2 text-white rounded-lg"
                  onClick={handlesubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )} */}

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

                  <div className="px-5 lg:px-14 py-2 md:py-10">
                    <p className="text-2xl md:text-3xl font-medium">Add Role</p>
                    <div className="mt-2 md:mt-10 flex justify-between items-center ">
                      <div className="">
                        <label className="block text-[15px] md:text-md font-medium mb-2">
                          Department <span className="text-red-500">*</span>
                        </label>

                      </div>
                      <div className="relative w-[60%] md:w-[50%]">
                        <button
                          onClick={() => setEmployeeTypeIsOpen(!employeeTypeIsOpen)}
                          className="flex justify-between items-center shadow-sm w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {selectedEmployeeTypeId
                            ? employeeTypeOptions.find(
                              (opt) => opt._id === selectedEmployeeTypeId
                            )?.name
                            : "Choose type"}
                          {employeeTypeIsOpen ? (
                            <IoIosArrowUp />
                          ) : (
                            <IoIosArrowDown />
                          )}
                        </button>

                        {employeeTypeIsOpen && (
                          <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {employeeTypeOptions.map((opt) => (
                              <li
                                key={opt._id}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                  setSelectedEmployeeTypeId(opt._id);
                                  setEmployeeTypeIsOpen(false);
                                }}
                              >
                                {opt.name}
                              </li>
                            ))}
                          </ul>
                        )}
                        {errors.departmentId && (
                          <p className="w-full text-red-500 text-sm  mb-4 mt-1">
                            {errors.departmentId}
                          </p>
                        )}
                      </div>
                    </div>


                    <div className="mt-2 md:mt-8 flex justify-between items-center ">
                      <div className="">
                        <label
                          htmlFor="roleName"
                          className="block text-[15px] md:text-md font-medium mb-2 mt-3"
                        >
                          Role Name <span className="text-red-500">*</span>
                        </label>

                      </div>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="text"
                          id="rolename"
                          name="rolename"
                          onChange={(e) => {
                            setRoleName(e.target.value);
                            validateRoleName(e.target.value); // Validate role name dynamically
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mb-4 mt-1">
                            {errors.name}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* {error.rolename && <p className="error">{error.rolename}</p>} */}

                    <div className="mt-2 md:mt-8 flex justify-between items-center">
                      <div className="">
                        <label
                          htmlFor="status"
                          className="block text-[15px] md:text-md font-medium mb-2 mt-3"
                        >
                          Status <span className="text-red-500">*</span>
                        </label>

                      </div>
                      <div className="w-[60%] md:w-[50%]">
                        <select
                          name="status"
                          id="status"
                          onChange={(e) => {
                            setStatus(e.target.value);
                            validateStatus(e.target.value); // Validate status dynamically
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

                    <div className="flex  justify-end gap-2 mt-5 md:mt-14">
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

            {/* Edit Modal */}
            {/* {isEditModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-xl w-96">
              <h2 className="text-lg font-semibold mb-4">Edit</h2>
              <label className="block text-sm font-medium mb-2">
                Department
              </label>
              <div className="relative w-full lg:w-72">
                <button
                  onClick={() => setEmployeeTypeIsOpen(!employeeTypeIsOpen)}
                  className="w-full py-2 px-5 rounded-xl border-2 flex justify-between items-center shadow-sm border-gray-300"
                >
                 
                  {roleDetails.departmentId
                    ? employeeTypeOptions.find(
                        (opt) => opt._id === roleDetails.departmentId
                      )?.name
                    : "Choose type"}
                  {employeeTypeIsOpen ? (
                                      <IoIosArrowUp />
                                    ) : (
                                      <IoIosArrowDown />
                                    )}
                </button>

                {employeeTypeIsOpen && (
                  <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {employeeTypeOptions.map((opt) => (
                      <li
                        key={opt._id}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setSelectedEmployeeTypeId(opt._id);
                          setEmployeeTypeIsOpen(false);
                          setRoleDetails({
                            ...roleDetails,
                            departmentId: opt._id,
                          });
                        }}
                      >
                        {opt.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <label className="block text-sm font-medium mb-2">
                Role Name
              </label>
              <input
                type="text"
                value={roleDetails.name}
                onChange={(e) => {
                  setRoleDetails({ ...roleDetails, name: e.target.value });
                  validateRoleName(e.target.value); // Validate dynamically
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors?.name && (
                <p className="text-red-500 text-sm mb-4">{errors?.name}</p>
              )}
              <p>Status</p>
              <select
                name="status"
                id="status"
                value={roleDetails.status}
                onChange={(e) => {
                  setRoleDetails({ ...roleDetails, status: e.target.value });
                  validateStatus(e.target.value); // Validate dynamically
                }}
                className="w-full h-10 rounded-lg px-1 outline border-0 border-gray-300 outline-gray-300"
              >
                <option value="1">Active</option>
                <option value="0">InActive</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm mb-4">{errors.status[0]}</p>
              )}

              <div className="flex justify-end gap-2 mt-8">
                <button
                  onClick={closeEditModal}
                  className="bg-gray-400 px-4 py-2 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave(roleDetails.id)}
                  className="bg-blue-600 px-4 py-2 text-white rounded-lg"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )} */}

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

                  <div className="px-5 lg:px-14 py-10">
                    <p className="text-2xl md:text-3xl font-medium">Edit Roles</p>

                    <div className="mt-10  rounded-lg ">
                      <div className="bg-white  rounded-xl w-full">
                        <div className="mt-8 flex justify-between items-center">
                          <label className="block text-[15px] md:text-md font-medium mb-2">
                            Department <span className="text-red-500">*</span>
                          </label>
                          <div className="relative w-[60%] md:w-[50%]">
                            <button
                              onClick={() =>
                                setEmployeeTypeIsOpen(!employeeTypeIsOpen)
                              }
                              className="flex justify-between items-center shadow-sm w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {/* {roleDetails.departmentId} */}
                              {roleDetails.departmentId
                                ? employeeTypeOptions.find(
                                  (opt) => opt._id === roleDetails.departmentId
                                )?.name
                                : "Choose type"}
                              {employeeTypeIsOpen ? (
                                <IoIosArrowUp />
                              ) : (
                                <IoIosArrowDown />
                              )}
                            </button>

                            {employeeTypeIsOpen && (
                              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                {employeeTypeOptions.map((opt) => (
                                  <li
                                    key={opt._id}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => {
                                      setSelectedEmployeeTypeId(opt._id);
                                      setEmployeeTypeIsOpen(false);
                                      setRoleDetails({
                                        ...roleDetails,
                                        departmentId: opt._id,
                                      });
                                    }}
                                  >
                                    {opt.name}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                        <div className="mt-8 flex justify-between items-center">
                          <label className="block text-[15px] md:text-md font-medium mb-2">
                            Role Name <span className="text-red-500">*</span>
                          </label>
                          <div className="w-[60%] md:w-[50%]">
                            <input
                              type="text"
                              value={roleDetails.name}
                              onChange={(e) => {
                                setRoleDetails({
                                  ...roleDetails,
                                  name: e.target.value,
                                });
                                validateRoleName(e.target.value); // Validate dynamically
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        {errors?.name && (
                          <p className="text-red-500 text-sm mb-4">
                            {errors?.name}
                          </p>
                        )}

                        <div className="mt-8 flex justify-between items-center">
                          <label className="block text-[15px] md:text-md font-medium mb-2">Status <span className="text-red-500">*</span></label>
                          <div className="w-[60%] md:w-[50%]">
                            <select
                              name="status"
                              id="status"
                              value={roleDetails.status}
                              onChange={(e) => {
                                setRoleDetails({
                                  ...roleDetails,
                                  status: e.target.value,
                                });
                                validateStatus(e.target.value); // Validate dynamically
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="1">Active</option>
                              <option value="0">InActive</option>
                            </select>
                          </div>
                        </div>
                        {errors.status && (
                          <p className="text-red-500 text-sm mb-4">
                            {errors.status[0]}
                          </p>
                        )}

                        <div className="flex justify-end gap-2 mt-14">
                          <button
                            onClick={closeEditModal}
                            className=" bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSave(roleDetails.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                          >
                            Update
                          </button>
                        </div>
                      </div>
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
export default Roles_Mainbar;
