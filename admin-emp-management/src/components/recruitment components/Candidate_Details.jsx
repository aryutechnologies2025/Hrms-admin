import React, { useState, useEffect } from "react";
import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
DataTable.use(DT);

import axios from "../../api/axiosConfig";
import { API_URL } from "../../config";
import { capitalizeFirstLetter } from "../../utils/StringCaps";
import { TfiPencilAlt } from "react-icons/tfi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import {
  IoIosArrowForward,
} from "react-icons/io";
import Loading from "../Loader";
import { Dropdown } from "primereact/dropdown";
import { useDateUtils } from "../../hooks/useDateUtils";

const Candidate_Details = () => {
  const formDateTime = useDateUtils();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  // console.log("errors:", errors);
  const [isAnimating, setIsAnimating] = useState(false);
  const [candidateDetails, setCandidateDetails] = useState([]);
  console.log("candidateDetails:", candidateDetails);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);
  const [filterInterviewStatus, setFilterInterviewStatus] = useState("");
  console.log("filterInterviewStatus",filterInterviewStatus)
  const [filterTechnology, setFilterTechnology] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("");

  const [accountOption, setAccountOption] = useState([]);
  const location = useLocation();
  const type = location.state || {};
  const [tableKey, setTableKey] = useState(0);


  const candidatetype = type?.name;
  const candidateid = type?.id;

  // console.log("Interview Name type:", candidatetype,candidateid);

  // view

  // Fetch roles from the API
  useEffect(() => {
    fetchCandidate();
    fetchInterviewName();
    fetchSourceName();
    fetchPlatformName();
  }, []);

  const [interviewDropDown, setInterviewDropDown] = useState("");
  const [sourceDropDown, setSourceDropDown] = useState("");
  const [platformDropDown, setPlatformDropDown] = useState("");

  console.log(interviewDropDown, sourceDropDown, platformDropDown);



  const fetchInterviewName = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/job-type/view-job-name`,
        {
          withCredentials: true,
          params: {
            type: "interview",
          },
        }
      );
      // console.log("response:", response)
      const projectName = response.data.getFinanceName.map((emp) => ({
        label: emp.name,
        value: emp._id,
      }));
      setInterviewDropDown(projectName);
    } catch (error) {
      console.error("Project fetch error:", error);
    }
  };

  const fetchSourceName = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/job-type/view-job-name`,
        {
          withCredentials: true,
          params: {
            type: "source",
          },
        }
      );
      // console.log("response:", response)
      const projectName = response.data.getFinanceName.map((emp) => ({
        label: emp.name,
        value: emp._id,
      }));
      setSourceDropDown(projectName);
    } catch (error) {
      console.error("Project fetch error:", error);
    }
  };

  const fetchPlatformName = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/job-type/view-source`,
        {
          withCredentials: true,
        }
      );
      // console.log("response:", response)
      const PlatformName = response.data.jobSource.map((emp) => ({
        label: emp.name,
        value: emp._id,
      }));
      setPlatformDropDown(PlatformName);
    } catch (error) {
      console.error("Project fetch error:", error);
    }
  };

  const fetchCandidate = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/job-type/view-candidate`,
        {
          params: {
            type: "candidate",
            id: candidateid,
            interviewStatus: filterInterviewStatus,
            technology: filterTechnology,
            platform: filterPlatform,
            search,
            fromDate: filterStartDate,
            toDate: filterEndDate,
            page,
            limit,
          },
          withCredentials: true,
        }
      );
      console.log("response",response)
      setCandidateDetails(response.data.data || []);
      setTableKey(prev => prev + 1); //  FORCE RELOAD
      setLoading(false);
    } catch (err) {
      setCandidateDetails([]);
      setLoading(false);
    }
  };



  const handleReset = () => {
    // const today = new Date().toISOString().split("T")[0];

    setFilterInterviewStatus("");
    setFilterTechnology("");
    setFilterPlatform("");
    setFilterStartDate(null);
    setFilterEndDate(null);
    setSearch("");
    setPage(1);

    setTimeout(fetchCandidate, 0);
  };





  // Open and close modals
  const openAddModal = () => {
    setIsAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeAddModal = () => {
    setErrors({});
    setIsAnimating(false);
    setTimeout(() => setIsAddModalOpen(false), 250);
  };

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [relocate, setRelocate] = useState("");
  const [employee, setEmployee] = useState("");
  // console.log("employee check:", employee);
  const [experience, setExperience] = useState("");
  const [current, setCurrent] = useState("");
  const [expected, setExpected] = useState("");
  const [interViewStatus, setInterViewStatus] = useState(null);
  const [platformsource, setPlatformSource] = useState(null);
  const [platform, setPlatform] = useState(null);

  const [note, setNote] = useState("");

  // console.log("checking:", firstName, lastName, phoneNumber, email, address, relocate, employee, experience, current, expected, note, interViewStatus, platformsource)

  // create

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("hrmsuser");
      const userIdParsed = userId ? JSON.parse(userId) : null;
      const formdata = {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        email: email,
        address: address,
        readyToRelocate: relocate,
        employeeType: employee,
        interviewStatus: interViewStatus,
        platform: platformsource,
        source: platform,
        expectedCtc: expected,
        currentCtc: current,
        yearOfExperience: experience,
        notes: note,
        createdBy: userIdParsed?._id,
      };

      const response = await axios.post(
        `${API_URL}/api/job-type/create-candidate`,
        formdata, { withCredentials: true }
      );

      // const validationErrors = validateForm(formValues);

      // if (Object.keys(validationErrors).length > 0) {
      //   setErrors(validationErrors); // show errors in UI
      //   return; // stop submit
      // }
      // console.log("candidate respons:", response);

      setIsAddModalOpen(false);

      fetchCandidate();

      setFirstName("");
      setLastName("");
      setPhoneNumber("");
      setEmail("");
      setAddress("");
      setRelocate("");
      setEmployee("");
      setExperience("");
      setCurrent("");
      setExpected("");
      setInterViewStatus("");
      setPlatformSource("");
      setNote("");
      setErrors({});

      toast.success("candidate name created successfully.");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error("Error submitting form:", err);
      }
    }
  };

  // edit

  const [firstNameEdit, setFirstNameEdit] = useState("");
  const [lastNameEdit, setLastNameEdit] = useState("");
  const [phoneNumberEdit, setPhoneNumberEdit] = useState("");
  const [emailEdit, setEmailEdit] = useState("");
  const [addressEdit, setAddressEdit] = useState("");
  const [relocateEdit, setRelocateEdit] = useState("");
  const [employeeEdit, setEmployeeEdit] = useState("");
  const [experienceEdit, setExperienceEdit] = useState("");
  const [currentEdit, setCurrentEdit] = useState("");
  const [expectedEdit, setExpectedEdit] = useState("");
  const [interViewStatusEdit, setInterViewStatusEdit] = useState("");
  const [platformSourceEdit, setPlatformSourceEdit] = useState("");
  const [platformEdit, setPlatformEdit] = useState("");

  const [noteEdit, setNoteEdit] = useState("");
  const [editId, setEditid] = useState("");

  const openEditModal = (row) => {
    // console.log("candidate row", row);

    setEditid(row._id);
    setFirstNameEdit(row.firstName);
    setLastNameEdit(row.lastName);
    setPhoneNumberEdit(row.phoneNumber);
    setEmailEdit(row.email);
    setAddressEdit(row.address);
    setRelocateEdit(row.readyToRelocate);
    setEmployeeEdit(row.employeeType);
    setExperienceEdit(row.experience);
    setCurrentEdit(row.current);
    setExpectedEdit(row.expected);
    setInterViewStatusEdit(row.interviewStatus?._id) || "-";
    setPlatformSourceEdit(row.platform?._id);
    setPlatformEdit(row.source?._id);
    setNoteEdit(row.notes);
    setIsEditModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const handlesubmitedit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        firstName: firstNameEdit,
        lastName: lastNameEdit,
        phoneNumber: phoneNumberEdit,
        email: emailEdit,
        address: addressEdit,
        readyToRelocate: relocateEdit,
        employeeType: employeeEdit,
        expectedCtc: expectedEdit,
        currentCtc: currentEdit,
        yearOfExperience: experienceEdit,
        interviewStatus: interViewStatusEdit,
        platform: platformSourceEdit,
        notes: noteEdit,
      };

      const response = await axios.put(
        `${API_URL}/api/job-type/edit-candidate/${editId}`,
        formData, { withCredentials: true }
      );
      // console.log("candidate edit response:", response);

      setIsEditModalOpen(false);
      fetchCandidate();
      setErrors({});
      toast.success("candidate updated successfully.");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error("Error submitting form:", err);
      }
    }
  };

  const closeEditModal = () => {
    setErrors({});
    setIsAnimating(false);
    setTimeout(() => setIsEditModalOpen(false), 250);
  };

  // delete

  const deleteCandidate = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this Candidate?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_URL}/api/job-type/delete-candidate/${id}`, { withCredentials: true })
          .then((response) => {
            if (response.data) {
              toast.success("candidate has been deleted.");
              fetchCandidate(); // Refresh the roles list
            } else {
              Swal.fire("Error!", "Failed to delete candidate.", "error");
            }
          })
          .catch((error) => {
            console.error("Error deleting candidate:", error);
            Swal.fire("Error!", "Failed to delete candidate.", "error");
          });
      }
    });
  };

  const [contentVisible, setContentVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");
  // console.log("selectedContent:",selectedContent)

  const columns = [
    {
      title: "S.no",
      data: null,
      render: function (data, type, row, meta) {
        return meta.row + 1;
      },
    },
    // {
    //   title: "Date",
    //   data: "date",
    //   render: (data) => data ? formDateTime(data) : "-",
    // },
    {
      title: "FirstName",
      data: null,
      render: (row) => row.firstName || "-",
    },
    {
      title: "LastName",
      data: null,
      render: (row) => row.lastName || "-",
    },
    {
      title: "Phone Number",
      data: null,
      render: (row) => row.phoneNumber || "-",
    },
    {
      title: "Email ",
      data: null,
      render: (row) => row.email || "-",
    },
    {
      title: "Address",
      data: null,
      render: (row) => row.address || "-",
    },
    {
      title: "Interview Status",
      data: null,
      render: (row) => row.interviewStatus?.name || "-",
    },
    {
      title: "Technology",
      data: null,
      render: (row) => row.platform?.name || "-",
    },
    // {
    //   title: "Platform",
    //   data: null,
    //   render: (row) => row.source?.name || "-",
    // },
    {
      title: "Created By",
      data: null,
      render: (row) => row?.createdBy?.name || "-",
    },
    {
      title: "Notes",
      data: null,
      render: (data, type, row) => {
        const id = `notes-${row.sno || Math.random()}`;

        setTimeout(() => {
          const container = document.getElementById(id);
          if (container) {
            if (!container._root) {
              container._root = createRoot(container);
            }
            container._root.render(
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
                      openEditModal(row);
                    }}
                  />
                  <MdOutlineDeleteOutline
                    className="text-red-600 text-xl cursor-pointer"
                    onClick={() => {
                      deleteCandidate(row._id);
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
  ];

  // const validateForm = (employee) => {
  //   const errors = {};

  //   // Experience validation
  //   if (employee === "Experience") {
  //     if (!employee.experience) {
  //       errors.experience = "Please provide years of experience";
  //     }
  //     if (!employee.current) {
  //       errors.current = "Please provide your current CTC";
  //     }
  //     if (!values.expected) {
  //       errors.expected = "Please provide your expected CTC";
  //     }
  //   }

  //   return errors;
  // };

  let navigate = useNavigate();

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-full min-h-screen px-3 md:px-5 pt-2 md:pt-10 overflow-x-auto">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div>


            <div className="">
              <Mobile_Sidebar />

            </div>
            <div className="flex justify-end mt-2 md:mt-0 gap-1 items-center">
              <p
                className="text-sm text-gray-500"
                onClick={() => navigate("/dashboard-Recruitment")}
              >
                Dashboard
              </p>
              <p>{">"}</p>

              <p className="text-sm text-blue-500">Candidate</p>
            </div>

            {/* Add Button */}
            <div className="flex flex-wrap justify-between mt-2 md:mt-4">
              <div className="">
                <h1 className="text-xl md:text-3xl  font-semibold">Candidate</h1>
              </div>
              <div className="flex flex-wrap justify-between mt-2 md:mt-8">
                <button
                  onClick={openAddModal}
                  className=" px-3 py-2  text-white bg-blue-500 hover:bg-blue-600 font-medium w-20 rounded-2xl"
                >
                  Add
                </button>
              </div>
            </div>
            <div className="flex flex-wrap items-end mb-1 md:mb-0 gap-2">

              {/* Dropdowns */}
              <div className="flex gap-1">
                <div className="flex flex-col">
                  <label>Interview Status</label>
                  <Dropdown
                    value={filterInterviewStatus}
                    onChange={(e) => setFilterInterviewStatus(e.value)}
                    options={interviewDropDown}
                    placeholder="Select Interview Status"
                    className="w-full md:w-[100%]"
                  />

                </div>

                <div className="flex flex-col">
                  <label>Technology</label>
                  <Dropdown
                    value={filterTechnology}
                    onChange={(e) => setFilterTechnology(e.value)}
                    options={sourceDropDown}
                    placeholder="Select Technology"
                    className="w-full md:w-[100%]"
                  />

                </div>

                <div className="flex flex-col">
                  <label>Platform</label>
                  <Dropdown
                    value={filterPlatform}
                    onChange={(e) => setFilterPlatform(e.value)}
                    options={platformDropDown}
                    placeholder="Select Platform"
                    className="w-full md:w-[100%]"
                  />

                </div>
              </div>

              {/* Date Filters */}
              <div className="flex gap-1">
                <div className="flex flex-col">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                    className="w-full md:w-[100%] border px-3 py-1.5 rounded"
                  />
                </div>

                <div className="flex flex-col">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                    className="w-full md:w-[100%] border px-3 py-1.5 rounded"
                  />
                </div>
              </div>

              {/* Buttons */}
              <button
                onClick={() => {
                  setPage(1);
                  fetchCandidate();
                }}
                className="px-3 py-2 text-white bg-blue-500 hover:bg-blue-600 font-medium w-20 rounded-2xl"
              >
                Submit
              </button>


              <button
                onClick={handleReset}
                className="bg-gray-300 text-gray-800 px-3 py-2 font-medium w-20 rounded-2xl"
              >
                Reset
              </button>

            </div>


            <div className="datatable-container">
              {/* Responsive wrapper for the table */}
              <div className="table-scroll-container" id="datatable">
                <DataTable
  key={tableKey}
  data={candidateDetails}
  columns={columns}
  options={{
    destroy: true,          // 🔥 REQUIRED
    paging: true,
    searching: false,
    ordering: true,
    scrollX: true,
    responsive: true,
    autoWidth: false,
  }}
  className="display nowrap bg-white"
/>


              </div>
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
                      {selectedContent || "No notes provided."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isAddModalOpen && (
              <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
                {/* Overlay */}
                <div
                  className="absolute inset-0 "
                  onClick={closeAddModal}
                ></div>

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

                  <div className="px-5 lg:px-14 py-3 md:py-10">

                    <p className="text-2xl md:text-3xl font-medium">
                      Add Candidate
                    </p>


                    <div className="mt-2 md:mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[50%]">
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Enter Your First name "
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm mb-2 md:mb-4">
                            {errors.firstName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 md:mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[50%]">
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Enter Your Lastname "
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm mb-2 md:mb-4">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* phonenumber */}

                    <div className="mt-2 md:mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[50%]">
                        <input
                          type="number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder=" "
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.phoneNumber && (
                          <p className="text-red-500 text-sm mb-2 md:mb-4">
                            {errors.phoneNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* email */}

                    <div className="mt-2 md:mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[50%]">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter Your Email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mb-2 md:mb-4">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* address */}

                    <div className="mt-2 md:mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[50%]">
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder=" "
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.address && (
                          <p className="text-red-500 text-sm mb-2 md:mb-4">
                            {errors.address}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* relocate */}

                    <div className="mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Ready to Relocate{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[50%]">
                        <div className="flex items-center w-[50%] gap-5 mb-2 md:mb-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="relocate"
                              value="Yes"
                              checked={relocate === "Yes"}
                              onChange={() => setRelocate("Yes")}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-gray-700">Yes</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="relocate"
                              value="No"
                              checked={relocate === "No"}
                              onChange={() => setRelocate("No")}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-gray-700">No</span>
                          </label>
                        </div>
                        {errors.readyToRelocate && (
                          <p className="flex justify-start text-red-500 text-sm ">
                            {errors.readyToRelocate}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* employee */}
                    <div className="mt-2 md:mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Employee{" "} <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center w-full md:w-[50%] gap-5 mb-2 md:b-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="employee"
                            value="Fresher"
                            checked={employee === "Fresher"}
                            onChange={() => setEmployee("Fresher")}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-gray-700">Fresher</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="employee"
                            value="Experience"
                            checked={employee === "Experience"}
                            onChange={() => setEmployee("Experience")}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-gray-700">Experience</span>
                        </label>
                      </div>
                      {errors.employeeType && (
                        <p className="flex justify-start text-red-500 text-sm ">
                          {errors.employeeType}
                        </p>
                      )}
                    </div>
                    {employee === "Experience" && (
                      <>
                        <div className="mt-2 md:mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                          <label className="block text-md font-medium mb-2">
                            How many years of experience{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="w-full md:w-[50%]">
                            <input
                              type="number"
                              value={experience}
                              onChange={(e) => setExperience(e.target.value)}
                              placeholder=" "
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.yearOfExperience && (
                              <p className="text-red-500 text-sm mb-2 md:mb-4">
                                {errors.yearOfExperience}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-2 md:mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                          <label className="block text-md font-medium mb-2">
                            Current CTC <span className="text-red-500">*</span>
                          </label>
                          <div className="w-full md:w-[50%]">
                            <input
                              type="number"
                              value={current}
                              onChange={(e) => setCurrent(e.target.value)}
                              placeholder=" "
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.expectedCtc && (
                              <p className="text-red-500 text-sm mb-2 md:mb-4">
                                {errors.currentCtc}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-2 md:mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                          <label className="block text-md font-medium mb-2">
                            Expected CTC <span className="text-red-500">*</span>
                          </label>
                          <div className="w-full md:w-[50%]">
                            <input
                              type="number"
                              value={expected}
                              onChange={(e) => setExpected(e.target.value)}
                              placeholder=" "
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.expectedCtc && (
                              <p className="text-red-500 text-sm mb-2 md:mb-4">
                                {errors.expectedCtc}
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {/* interview status */}

                    <div className="mt-2 first-letter:md:mt-5 flex flex-wrap md:flex-wrap justify-between items-center">
                      <div className="">
                        <label
                          htmlFor="status"
                          className="block text-md font-medium mb-2"
                        >
                          Interview Status{" "}
                          <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="w-full md:w-[50%]">
                        <Dropdown
                          value={interViewStatus}
                          onChange={(e) => setInterViewStatus(e.value)}
                          options={interviewDropDown}
                          optionValue="value"
                          optionLabel="label"
                          filter
                          placeholder="Select a interviewstatus"
                          className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.interviewStatus && (
                          <p className="text-red-500 text-sm mt-2 md:mb-4">
                            {errors.interviewStatus}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Technologies */}

                    <div className="mt-2 md:mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <div className="">
                        <label
                          htmlFor="Technologies"
                          className="block text-md font-medium mb-2 "
                        >
                          Technologies{" "}
                          <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="w-full md:w-[50%]">
                        <Dropdown
                          value={platformsource}
                          onChange={(e) => setPlatformSource(e.value)}
                          options={sourceDropDown}
                          optionValue="value"
                          optionLabel="label"
                          filter
                          placeholder="Select a Technologies"
                          className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.platform && (
                          <p className="text-red-500 text-sm mb-2 md:mb-4">
                            {errors.platform}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Platform */}

                    <div className="mt-3 md:mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <div className="">
                        <label
                          htmlFor="Platform"
                          className="block text-md font-medium mb-2 "
                        >
                          Platform{" "}
                          <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="w-full md:w-[50%]">
                        <Dropdown
                          value={platform}
                          onChange={(e) => setPlatform(e.value)}
                          options={platformDropDown}
                          optionValue="value"
                          optionLabel="label"
                          filter
                          placeholder="Select a Platform"
                          className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.source && (
                          <p className="text-red-500 text-sm mb-2 md:mb-4">
                            {errors.source}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* notes */}

                    <div className="mt-2 md:mt-5 flex flex-wrap md:flex-nowrap justify-between ">
                      <label
                        htmlFor="Platform"
                        className="block text-md font-medium mb-2 "
                      >
                        Notes

                      </label>
                      <div className="w-full md:w-[50%]">
                        <textarea
                          type="text"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="Enter Notes"
                          className="w-full h-[200px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* button */}

                    <div className="flex justify-end gap-2 mt-7 md:mt-14">
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
                <div
                  className="absolute inset-0 "
                  onClick={closeEditModal}
                ></div>

                <div
                  className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                  <div
                    className="w-6 h-6 rounded-full mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                    title="Toggle Sidebar"
                    onClick={closeEditModal}
                  >
                    <IoIosArrowForward className="w-3 h-3" />
                  </div>

                  <div className="px-5 lg:px-14 py-3 md:py-10">

                    <p className="text-2xl md:text-3xl font-medium">
                      Edit Candidate
                    </p>


                    <div className="mt-2 md:mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[50%]">
                        <input
                          type="text"
                          value={firstNameEdit}
                          onChange={(e) => setFirstNameEdit(e.target.value)}
                          placeholder="Enter Your First name "
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm mb-2 md:mb-4">
                            {errors.firstName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 md:mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[50%]">
                        <input
                          type="text"
                          value={lastNameEdit}
                          onChange={(e) => setLastNameEdit(e.target.value)}
                          placeholder="Enter Your Last name "
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm mb-2 md:mb-4">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* phonenumber */}

                    <div className="mt-2 md:mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[50%]">
                        <input
                          type="number"
                          value={phoneNumberEdit}
                          onChange={(e) => setPhoneNumberEdit(e.target.value)}
                          placeholder=" "
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.phoneNumber && (
                          <p className="text-red-500 text-sm mb-2 md:mb-4">
                            {errors.phoneNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* email */}

                    <div className="mt-2 md:mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[50%]">
                        <input
                          type="email"
                          value={emailEdit}
                          onChange={(e) => setEmailEdit(e.target.value)}
                          placeholder="Enter Your Email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mb-2 md:mb-4">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* address */}

                    <div className="mt-2 md:mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full md:w-[50%]">
                        <input
                          type="text"
                          value={addressEdit}
                          onChange={(e) => setAddressEdit(e.target.value)}
                          placeholder=" "
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.address && (
                          <p className="text-red-500 text-sm mb-2 md:mb-4">
                            {errors.address}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* relocate */}

                    <div className="mt-2 md:mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Ready to Relocate{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center w-[50%] gap-5 mb-2 md:mb-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="relocate"
                            value="Yes"
                            checked={relocateEdit === "Yes"}
                            onChange={() => setRelocateEdit("Yes")}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-gray-700">Yes</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="relocate"
                            value="No"
                            checked={relocateEdit === "No"}
                            onChange={() => setRelocateEdit("No")}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-gray-700">No</span>
                        </label>
                      </div>
                      {errors.readyToRelocate && (
                        <p className="text-red-500 text-sm mb-2 md:mb-4">
                          {errors.readyToRelocate}
                        </p>
                      )}
                    </div>

                    {/* employee */}

                    <div className="mt-2 md:mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <label className="block text-md font-medium mb-2">
                        Employee <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center w-full md:w-[50%] gap-5 mb-2 md:b-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="employee"
                            value="Fresher"
                            checked={employeeEdit === "Fresher"}
                            onChange={() => setEmployeeEdit("Fresher")}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-gray-700">Fresher</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="employee"
                            value="Experience"
                            checked={employeeEdit === "Experience"}
                            onChange={() => setEmployeeEdit("Experience")}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-gray-700">Experience</span>
                        </label>
                      </div>
                      {errors.employeeType && (
                        <p className="text-red-500 text-sm mb-2 md:mb-4">
                          {errors.employeeType}
                        </p>
                      )}
                    </div>

                    {employeeEdit === "Experience" && (
                      <>
                        <div className="mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                          <label className="block text-md font-medium mb-2">
                            How many years of experience{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="w-full md:w-[50%]">
                            <input

                              type="number"
                              value={experienceEdit}
                              onChange={(e) =>
                                setExperienceEdit(e.target.value)
                              }
                              placeholder=" "
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.yearOfExperience && (
                              <p className="text-red-500 text-sm mb-4">
                                {errors.yearOfExperience}
                              </p>

                            )}
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                          <label className="block text-md font-medium mb-2">
                            Current CTC <span className="text-red-500">*</span>
                          </label>
                          <div className="w-full md:w-[50%]">
                            <input

                              type="number"
                              value={currentEdit}
                              onChange={(e) => setCurrentEdit(e.target.value)}
                              placeholder=" "
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.currentCtc && (
                              <p className="text-red-500 text-sm mb-4">
                                {errors.currentCtc}
                              </p>

                            )}
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                          <label className="block text-md font-medium mb-2">
                            Expected CTC <span className="text-red-500">*</span>
                          </label>
                          <div className="w-full md:w-[50%]">
                            <input

                              type="number"
                              value={expectedEdit}
                              onChange={(e) => setExpectedEdit(e.target.value)}
                              placeholder=" "
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.expectedCtc && (
                              <p className="text-red-500 text-sm mb-4">
                                {errors.expectedCtc}
                              </p>

                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {/* interview status */}

                    <div className="mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <div className="">
                        <label
                          htmlFor="status"
                          className="block text-md font-medium mb-2"
                        >
                          InterView Status{" "}
                          <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="w-full md:w-[50%]">
                        <Dropdown
                          value={interViewStatusEdit}
                          onChange={(e) => setInterViewStatusEdit(e.value)}
                          options={interviewDropDown}
                          optionValue="value"
                          optionLabel="label"
                          filter
                          placeholder="Select a interviewstatus"
                          className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.interviewStatus && (
                          <p className="text-red-500 text-sm mb-4">
                            {errors.interviewStatus}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Technologies */}

                    <div className="mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <div className="">
                        <label
                          htmlFor="platform"
                          className="block text-md font-medium mb-2 "
                        >
                          Technologies{" "}
                          <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="w-full md:w-[50%]">
                        <Dropdown
                          value={platformSourceEdit}
                          onChange={(e) => setPlatformSourceEdit(e.value)}
                          options={sourceDropDown}
                          optionValue="value"
                          optionLabel="label"
                          filter
                          placeholder="Select a Technologies"
                          className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.platform && (
                          <p className="text-red-500 text-sm mb-4">
                            {errors.platform}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Platform */}

                    <div className="mt-5 flex flex-wrap md:flex-nowrap justify-between items-center">
                      <div className="">
                        <label
                          htmlFor="platform"
                          className="block text-md font-medium mb-2 "
                        >
                          Platform{" "}
                          <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="w-full md:w-[50%]">
                        <Dropdown
                          value={platformEdit}
                          onChange={(e) => setPlatformEdit(e.value)}
                          options={platformDropDown}
                          optionValue="value"
                          optionLabel="label"
                          filter
                          placeholder="Select a platform "
                          className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.platform && (
                          <p className="text-red-500 text-sm mb-4">
                            {errors.platform}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* notes */}

                    <div className="mt-5 flex flex-wrap md:flex-nowrap justify-between ">
                      <label className="w-full md:w-0 block text-sm font-medium mb-2">
                        Notes
                      </label>
                      <div className="w-full md:w-[50%]">
                        <textarea
                          type="text"
                          value={noteEdit}
                          onChange={(e) => setNoteEdit(e.target.value)}
                          placeholder="Enter Notes"
                          className="w-full h-[200px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* button */}

                    <div className="flex  justify-end gap-2 mt-14">
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
export default Candidate_Details;