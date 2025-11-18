import { Dropdown } from "primereact/dropdown";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { toast, ToastContainer } from "react-toastify";
import { IoIosArrowForward } from "react-icons/io";
import Loader from "../components/Loader";
import { InputText } from "primereact/inputtext";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { TfiPencilAlt } from "react-icons/tfi";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Swal from "sweetalert2";
import Mobile_Sidebar from "../components/Mobile_Sidebar";
import Footer from "../components/Footer";

export const AdminPrivileges = () => {
  const [employeeOption, setEmployeeOption] = useState(null);
  const [privilegesOption, setPrivilegesOption] = useState(null);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [selectedPrivileges, setSelectedPrivileges] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [addPrivilegesModalOpen, setAddPrivilegesModalOpen] = useState(false);
  const [editPrivilegesModalOpen, seteditPrivilegesModalOpen] = useState(false);

  const [getEmpPriviligiesList, setEmpPriviligiesList] = useState(null);
  const [editPrivilegesRowdata, setEditPrivilegesRowdata] = useState({
    _id: "",
    employeeName: null,
    module: [],
  });

  useEffect(() => {
    fetchEmployeeList();
    fetchPrivileges();
    fetchEmpPriviligiesList();
  }, []);

  const fetchEmployeeList = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/employees/all-employees`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const employeeemail = response.data.data.map((emp) => ({
        label: emp.employeeName,
        value: emp._id,
      }));

      setEmployeeOption(employeeemail);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchPrivileges = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/hr-permission/view-hr-permission`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPrivilegesOption(response.data.data);
      setLoading(false);
      console.log(response.data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchEmpPriviligiesList = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/hr-permission/get-hr-permission-list`
      );

      setEmpPriviligiesList(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handlesubmit = async () => {
    // e.preventDefault();
    console.log(selectedEmployee, selectedPrivileges);

    try {
      const response = await axios.post(
        `${API_URL}/api/employees/hr-permission`,
        {
          employeeId: selectedEmployee,
          module: selectedPrivileges,
        }
      );
      toast.success("Employee added to the admin section successfully.");
      closePrivilegesModal();
      fetchEmpPriviligiesList();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred.");
      closePrivilegesModal();
    }
  };

  const handleUpdate = async () => {
    // e.preventDefault();

    try {
      const response = await axios.put(
        `${API_URL}/api/hr-permission/edit-hr-permission-list/${editPrivilegesRowdata._id}`,
        {
          employeeId: editPrivilegesRowdata.employeeName,
          module: editPrivilegesRowdata.module,
        }
      );
      toast.success("Employee Updated to the admin section successfully.");
      closeEditPrivilegesModal();
      fetchEmpPriviligiesList();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred.");
      closeEditPrivilegesModal();
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the employee!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `${API_URL}/api/hr-permission/delete-hr-permission-list/${id}`
        );

        toast.success("Employee deleted successfully.");
        fetchEmpPriviligiesList();
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "An error occurred.");
      }
    }
  };

  const handleCheckboxChange = (title, isChecked) => {
    setSelectedPrivileges((prev) => {
      const updatedModules = isChecked
        ? [...prev, { title, permission: "yes" }]
        : prev.filter((item) => item.title !== title);

      return updatedModules;
    });
  };

  const closePrivilegesModal = () => {
    setIsAnimating(false);
    setTimeout(() => setAddPrivilegesModalOpen(false), 250); // Delay to trigger animation
  };

  const openPrivilegesModal = () => {
    setAddPrivilegesModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10); // Delay to trigger animation
  };

  const closeEditPrivilegesModal = () => {
    setIsAnimating(false);
    setTimeout(() => seteditPrivilegesModalOpen(false), 250); // Delay to trigger animation
  };

  const openEditPrivilegesModal = (rowData) => {
    console.log(rowData);

    const matchedEmployee = employeeOption.find(
      (emp) => emp.value == rowData.employeeId._id
    );

    setEditPrivilegesRowdata({
      _id: rowData._id,
      employeeName: matchedEmployee.value,
      module: rowData.module,
    });

    seteditPrivilegesModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10); // Delay to trigger animation
  };

  const columns = [
    {
      field: "sno",
      header: "S.No",
      body: (_rowData, { rowIndex }) => rowIndex + 1, // display index starting from 1
      style: { width: "10px !important", textAlign: "center" }, // Narrow width
      bodyStyle: { textAlign: "center" },
    },
    {
      field: "employeeName",
      header: "Employee Name",
      body: (rowData) => rowData.employeeId?.employeeName || "-",
    },
    // {
    //   field: "role_name",
    //   header: "Role",
    // },

    // {
    //   field: "priviliges",
    //   header: "Privileges",
    // },
    {
      field: "",
      header: "Action",
      body: (rowData) => (
        <div className="flex justify-center gap-4 text-xl">
          <TfiPencilAlt
            className="text-blue-600 cursor-pointer hover:text-blue-800"
            onClick={() => openEditPrivilegesModal(rowData)}
          />

          <MdOutlineDeleteOutline
            className="text-red-600 cursor-pointer hover:text-red-800"
            onClick={() => handleDelete(rowData.employeeId._id)}
          />
        </div>
      ),
    },
  ];

  const editHandleCheckboxChange = (title, isChecked) => {
    setEditPrivilegesRowdata((prevState) => {
      let updatedModules;

      if (isChecked) {
        updatedModules = [
          ...prevState.module,
          {
            title: title,
            permission: "yes",
          },
        ];
      } else {
        updatedModules = prevState.module.filter((mod) => mod.title !== title);
      }

      return {
        ...prevState,
        module: updatedModules,
      };
    });
  };

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-2 md:pt-10">
      {loading ? (
        <Loader />
      ) : (
        <>
      <div>
        <Mobile_Sidebar />
     

      <div className="flex gap-2 items-center cursor-pointer">
        <p
          className=" text-gray-500 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Dashboard
        </p>
        <p>{">"}</p>
        <p className=" text-blue-500">Admin Privileges</p>
        <p>{">"}</p>
      </div>

      <div className="flex flex-wrap justify-between mt-8 mb-3">
        <h2 className="text-2xl md:text-3xl mt-3 font-semibold">
          Manage User Privileges
        </h2>
        <button
          onClick={openPrivilegesModal}
                className=" px-6 py-2  text-white bg-blue-500 hover:bg-blue-600 font-medium mt-3 md:mt-0  rounded-2xl"
        >
          Add User to Admin Panel
        </button>
        </div>

        <div className="datatable-container">
          {/*DATA Table */}
          <div className="w-full mx-auto relative">
            {/* Global Search Input */}
            <div className="mt-4 md:mt-8 flex md:justify-end">
              <InputText
                // value={globalFilter}
                // onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search"
                className="px-2 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Table Container with Relative Position */}
            <div className="relative mt-4">
              {/* Loader Overlay */}
              {/* {loading && <Loader />} */}

              {/* DataTable */}
              <DataTable
                className="mt-8"
                value={getEmpPriviligiesList}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
                showGridlines
                emptyMessage="No privilege records found."
              >
                {columns.map((col, index) => (
                  <Column
                    key={index}
                    field={col.field}
                    header={col.header}
                    body={col.body}
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
          </div>
        </div>
    

      {/* modal for adding privileges  */}
      {addPrivilegesModalOpen && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 "
            onClick={closePrivilegesModal}
          ></div>

          <div
            className={`fixed top-0 right-0 overflow-y-auto w-full h-full md:w-[53vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${
              isAnimating ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div
              className="w-6 h-6 rounded-full  mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
              title="Toggle Sidebar"
              onClick={closePrivilegesModal}
            >
              <IoIosArrowForward className="w-3 h-3" />
            </div>

            <div className="px-5 lg:px-14 py-10">
              <p className="text-2xl md:text-3xl font-medium">
                Manage User Privileges
              </p>
              <p className="text-gray-600 mt-2 w-[250px]">
                Assign and manage access rights for user accounts based on their
                roles and responsibilities.
              </p>

              <div className="mt-10 md:mt-16  rounded-lg ">
                <div className="mt-10 flex flex-col gap-8">
                  {/* user dropdown */}
                  <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-14 items-center ">
                    <label
                      htmlFor="employee_name"
                      className="block text-md font-medium mb-2"
                    >
                      Employee Name
                    </label>

                    <Dropdown
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      options={employeeOption}
                      // optionLabel="email"
                      filter
                      placeholder="Select Employees"
                      className="w-[200px] md:w-[300px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      display="chip"
                    />
                  </div>

                  {/* user dropdown */}

                  {/* privileges checkbox */}
                  <div className=" flex flex-wrap md:flex-nowrap gap-3 md:gap-14 ">
                    <label
                      htmlFor="employee_name"
                      className="block text-md font-medium mb-2"
                    >
                      Select Privileges
                    </label>

                    <div className=" grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-10">
                      {privilegesOption &&
                        privilegesOption.map((privilege) => (
                          <div className=" flex gap-2 items-center">
                            <input
                              type="checkbox"
                              id={privilege._id}
                              onChange={(e) =>
                                handleCheckboxChange(
                                  privilege.module,
                                  e.target.checked
                                )
                              }
                              checked={selectedPrivileges.some(
                                (mod) => mod.title === privilege.module
                              )}
                            />

                            <label htmlFor={privilege._id} className="text-md ">
                              {privilege.module}{" "}
                            </label>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="flex md:justify-end gap-2 mt-4">
                    <button
                      onClick={closePrivilegesModal}
                      className="bg-red-100 hover:bg-red-200 text-sm text-red-600 px-5 py-2 font-semibold rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 font-semibold rounded-full"
                      onClick={handlesubmit}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* modal for Edit privileges  */}
      {editPrivilegesModalOpen && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 "
            onClick={closeEditPrivilegesModal}
          ></div>

          <div
            className={`fixed top-0 right-0 overflow-y-auto w-full h-full md:w-[53vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${
              isAnimating ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div
              className="w-6 h-6 rounded-full  mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
              title="Toggle Sidebar"
              onClick={closeEditPrivilegesModal}
            >
              <IoIosArrowForward className="w-3 h-3" />
            </div>

            <div className="px-5 lg:px-14 py-10">
              <p className="text-2xl md:text-3xl font-medium">
                Edit User Privileges
              </p>
              {/* <p className="text-gray-600 mt-2">
                Assign and manage access rights for user accounts based on their
                roles and responsibilities.
              </p> */}

              <div className="mt-10 md:mt-16  rounded-lg ">
                <div className="mt-3 md:mt-10 flex flex-col gap-8">
                  {/* user dropdown */}
                  <div className=" flex flex-wrap md:flex-nowrap md:gap-14 items-center">
                    <label
                      htmlFor="employee_name"
                      className="block text-md font-medium mb-2"
                    >
                      Employee Name
                    </label>

                    <Dropdown
                      value={editPrivilegesRowdata.employeeName} // ✅ pass the whole object
                      onChange={(e) => {
                        setEditPrivilegesRowdata({
                          ...editPrivilegesRowdata,
                          employeeName: e.value, // ✅ e.value is the selected object
                        });
                      }}
                      disabled
                      options={employeeOption}
                      optionLabel="label"
                      placeholder="Select Employees"
                      className="w-[200px] md:w-[300px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      display="chip"
                      filter
                    />
                  </div>

                  {/* user dropdown */}

                  {/* privileges checkbox */}
                  <div className="flex flex-wrap gap-3 md:gap-14 ">
                    <label
                      htmlFor="employee_name"
                      className="block text-md font-medium mb-2"
                    >
                      Select Privileges
                    </label>

                    <div className=" grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-10">
                      {privilegesOption &&
                        privilegesOption.map((privilege) => {
                          const isChecked = editPrivilegesRowdata.module.some(
                            (mod) => mod.title === privilege.module // or mod._id === privilege._id
                          );

                          return (
                            <div
                              key={privilege._id}
                              className="flex gap-2 items-center"
                            >
                              <input
                                type="checkbox"
                                id={privilege._id}
                                onChange={(e) =>
                                  editHandleCheckboxChange(
                                    privilege.module,
                                    e.target.checked
                                  )
                                }
                                checked={isChecked}
                              />
                              <label
                                htmlFor={privilege._id}
                                className="text-md"
                              >
                                {privilege.module}
                              </label>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  <div className="flex md:justify-end gap-2 mt-4  ">
                    <button
                      onClick={closeEditPrivilegesModal}
                      className="bg-red-100 hover:bg-red-200 text-sm text-red-600 px-5 py-2 font-semibold rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 font-semibold rounded-full"
                      onClick={handleUpdate}
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
