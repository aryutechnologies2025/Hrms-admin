import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { API_URL } from "../../config";
import axios from "../../api/axiosConfig.js";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { FaFileWord } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import { FaFileImage } from "react-icons/fa";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { capitalizeFirstLetter } from "../../utils/StringCaps.js";
import Loader from "../Loader.jsx";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import { IoIosLink } from "react-icons/io";
import { dateUtils } from "../../utils/dateUtils.js";

// import { formatDate } from "react-datepicker/dist/date_utils.js";
// import { formatDate } from "../../dateformate.js";

const EmployeeDetails_Mainbar = () => {
  let navigate = useNavigate();
  const location = useLocation();
   const formatDateTime = dateUtils();


  const employeeIds = window.location.pathname.split("/")[2];
  console.log("window.location.pathname", employeeIds);

  // const { employeeId } = location.state || {};
  // console.log("employeeId",employeeId)
  const [employee, setData] = useState([]);
  console.log("employee", employee);
  const [employeeDocuments, setEmployeeDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {

    try {
      const response = await axios.get(
        `${API_URL}/api/employees/view-employee/${employeeIds}`
      );
      setData(response.data.data);
      console.log(response);

      const employeeDocuments = response.data?.data?.document;

      const updatedEmployeeDocuments = employeeDocuments?.map((category) => {
        return {
          document_name: category.title,
          documents: category.files.map((doc) => {
            return {
              name: doc.originalName,
              url: doc.filepath,
              // id: doc.id,
            };
          }),
        };
      });

      setEmployeeDocuments(updatedEmployeeDocuments);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  console.log(employee);
  const openDocument = (fileName) => {
    const url = `${API_URL}/api/uploads/documents/${fileName}`;
    window.open(url, "_blank");
  };

  const deleteEmployee = (roleId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this employee?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_URL}/api/employees/delete-employees/${roleId}`)
          .then((response) => {
            if (response.data.success) {
              Swal.fire("Deleted!", "Employee has been deleted.", "success");
              // Refresh the roles list
              navigate("/employees");
            } else {
              Swal.fire("Error!", "Failed to delete Employee.", "error");
            }
          })
          .catch((error) => {
            console.error("Error deleting Employee:", error);
            Swal.fire("Error!", "Failed to delete Employee.", "error");
          });
      }
    });
  };

  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  setNewPassword;

  const changePassword = async (id) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/employees/change-password`,
        {
          id: id,
          newPassword: newPassword,
        }
      );
      setNewPassword("");
      setChangePasswordModal(false);
      toast.success("Password changed successfully");
    } catch (error) {
      console.error("Error changing password", error);
    }
  };

  function onClickCard(employeeId) {
    navigate(`/revision-details/${employeeId}`);

    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }

  // notes

  function onClickCardnotes(employeeId) {
    navigate(`/note-details/${employeeId}`);

    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }

  return (
    <div className="w-screen min-h-screen bg-gray-100 px-3 md:px-5 py-2 md:py-10">
      <Mobile_Sidebar />

      {/* breadcrumb */}
      <div className="flex gap-2  text-sm items-center">
        <p
          onClick={() => navigate("/employees")}
          className=" text-gray-500 cursor-pointer "
        >
          Employees
        </p>
        <p>{">"}</p>
        <p className=" text-blue-500 ">Employee Details</p>
        <p>{">"}</p>
      </div>
      <ToastContainer />
      <div className="flex flex-wrap md:flex-nowrap w-full sm:justify-between md:justify-end gap-3">
        <button
          className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 mt-2 md:mt-0 rounded-3xl"
          onClick={() => {
            onClickCardnotes(employee._id);
            // console.log(item);
          }}
        >
          Notes
        </button>

        <button
          className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 mt-2 md:mt-0 sm:mr-40 md:mr-0 rounded-3xl"
          onClick={() => {
            onClickCard(employee._id);
            // console.log(item);
          }}
        >
          Revision
        </button>
        <button
          className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 mt-2 md:mt-0 rounded-3xl"
          onClick={() => {
            setChangePasswordModal(true);
          }}
        >
          Change Password
        </button>
        <button
          className="text-sm bg-red-500 hover:bg-red-600 text-white px-5 py-2 mt-2 md:mt-0 rounded-3xl"
          onClick={() => {
            deleteEmployee(employee._id);
          }}
        >
          Delete
        </button>
        <button
          onClick={() =>
            navigate("/editemployeedetails", {
              state: {
                employee_id: employee._id, // Pass the employee ID here
              },
            })
          }
          className="text-sm bg-gray-200 hover:bg-gray-300 px-5 py-2 mt-2 md:mt-0 rounded-3xl"
        >
          Edit
        </button>
        <button
          onClick={() =>
            navigate("/employees", {
              state: {
                employee_id: employee._id, // Pass the employee ID here
              },
            })
          }
          className="text-sm bg-gray-200 hover:bg-gray-300 px-5 py-2 mt-2 md:mt-0 rounded-3xl"
        >
          Back
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col xl:flex-row md:gap-3 mt-3">
          {/* leftsidebar */}
          <div className="basis-[70%] pb-3 md:pb-0">
            <div className="flex flex-col lg:flex-row flex-grow gap-3">
              <div className="border-2 flex-grow rounded-2xl bg-white  px-5 md:px-7 py-5">
                <div className="flex gap-3">
                  <div>
                    <div className="flex">
                      <div className=" border-2  rounded-full h-16 w-16">
                        <img
                          className="rounded-full h-16 w-16"
                          src={`${API_URL}/api/uploads/${employee?.photo}`}
                          alt="Employee Profile"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col  gap-3">
                    <p className="font-semibold text-2xl">
                      {capitalizeFirstLetter(employee?.employeeName)}
                    </p>

                    {employee?.role && (
                      <p className="bg-orange-300 text-sm md:text-base  px-2 text-center py-1 rounded-full">
                        {capitalizeFirstLetter(employee.role.name)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start flex-wrap gap-5 mt-5">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-600">EMPLOYEE ID</p>
                    <p className="font-semibold">{employee?.employeeId}</p>
                  </div>
                  {/* 
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-600">DEPARTMENT</p>
                    <p className="font-semibold">
                      {employee?.department}
                    </p>
                  </div> */}

                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-600">DATE OF JOINING</p>
                    <p className="font-semibold">
                      {/* {employee?.employee_details?.date_of_joining} */}
                      {new Date(employee?.dateOfJoining)
                        .toLocaleDateString("en-IN")
                        .replaceAll("/", "-")}
                      {/* {employee?.dateOfJoining} */}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-600">EMPLOYEE TYPE</p>
                    <p className="font-semibold">{employee?.employeeType}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1 bg-gray-200 mt-5 px-4 md:px-8 rounded-2xl py-3">
                  <div className="flex flex-wrap gap-3 md:gap-8 text-sm">
                    <p className="">{employee?.email}</p>
                    <p className="">{employee?.phoneNumber}</p>
                  </div>

                  <hr className="w-full border-gray-300" />
                  <p
                    className={`mt-2 text-md  ${employee.dutyStatus === "1"
                        ? "text-green-500"
                        : "text-orange-600"
                      }`}
                  >
                    {employee.dutyStatus === "1" ? "On Duty" : "Relieved "}
                    <span className="ml-10 ">
                      {employee?.dutyStatus === "1"
                        ? ""
                        : employee?.relivingDate?.split("T")[0]}
                    </span>
                  </p>
                  {employee.employee_details?.status === "0" &&
                    employee.employee_details?.reliving_date && (
                      <p className="mt-1 text-sm text-gray-500">
                        Reliving Date: {employee?.reliving_date}
                      </p>
                    )}
                </div>
              </div>
              <div className="border-2 bg-white flex-grow rounded-2xl  px-5 md:px-7 py-5">
                {/* <div className="flex justify-between"> */}
                <p className="text-[18px] font-semibold">Personal Info 1</p>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap justify-between mt-3">
                    <p className="text-sm ">Email Address</p>
                    <p className=" text-sm ms-3 ">
                      {employee?.personalEmail || "-"}
                    </p>
                  </div>
                  <hr />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap justify-between mt-3">
                    <p className="text-sm ">Github Email Address</p>
                    <p className="text-sm ms-3 ">
                      {employee?.gitHubEmail ?? "-"}
                    </p>
                  </div>
                  <hr />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between mt-3">
                    <p className="text-sm ">Passport No</p>
                    <p className="text-sm ms-3">
                      {employee?.passportNo ?? "N/A"}
                    </p>
                  </div>
                  <hr />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between mt-3">
                    <p className="text-sm font-[400] text-gray-900">Pan No</p>
                    <p className=" text-sm">{employee?.panNo}</p>
                  </div>
                  <hr />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between mt-3">
                    <p className="text-sm ">Aadhar No</p>
                    <p className=" text-sm">{employee?.aadharNo}</p>
                  </div>
                  <hr />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between mt-3">
                    <p className="text-sm ">Birthday</p>
                    <p className=" text-sm">
                      {employee?.dateOfBirth ?
                        formatDateTime(employee?.dateOfBirth)
                        : ""}
                    </p>
                  </div>
                  <hr />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between mt-3">
                    <p className="text-sm ">Marital Status</p>
                    <p className=" text-sm">
                      {employee?.maritalStatus ?? "N/A"}
                    </p>
                  </div>
                  <hr />
                </div>
              </div>
            </div>

            <div className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl mt-3 ">
              {/* <div className="flex justify-between"> */}
              <p className="text-[18px] font-semibold">Skills</p>

              <div className="flex flex-wrap gap-2 mt-2">
                {Array.isArray(employee?.skills) ? (
                  employee.skills.map((item, index) => (
                    <p
                      key={item.id}
                      className="px-3 py-1 text-sm rounded-full border-2 w-fit"
                    >
                      {item}
                    </p>
                  ))
                ) : (
                  <p>No skills available</p>
                )}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex flex-col flex-grow gap-3">
                <div className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl mt-3 ">
                  {/* <div className="flex justify-between"> */}
                  <p className="text-[18px] font-semibold mb-5">Educations</p>

                  {employee?.education ? (
                    employee?.education.map((item, index) => (
                      <div className="flex gap-2 flex-col">
                        <div className="flex gap-2 justify-between flex-wrap items-center ">
                          <p className="text-sm ">Institute Name</p>
                          <p className="text-sm  ">
                            {item.schoolName ?? "N/A"}
                          </p>
                        </div>

                        <div className="flex gap-2 justify-between flex-wrap items-center ">
                          <p className="text-sm ">Department Name</p>
                          <p className=" text-sm">
                            {item.departmentName ?? "N/A"}
                          </p>
                        </div>

                        <div className="flex gap-2 justify-between flex-wrap items-center ">
                          <p className="text-sm ">End Year</p>
                          <p className="text-sm  ">
                            Graduated {item.endYear ?? "N/A"}
                          </p>
                        </div>

                        <hr className="my-3" />
                      </div>
                    ))
                  ) : (
                    <p>N/A</p>
                  )}
                </div>

                <div className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl ">
                  <p className="text-[18px] font-semibold">Emergency Contact</p>

                  <div className="flex justify-between mt-3">
                    <p className="text-sm ">Full Name</p>
                    <p className=" text-sm">
                      {employee?.emergencyContact?.fullName}
                    </p>
                  </div>
                  <hr className="my-3" />

                  <div className="flex justify-between mt-3">
                    <p className="text-sm ">Contact</p>
                    <p className=" text-sm">
                      {employee?.emergencyContact?.contact}
                    </p>
                  </div>
                  <hr className="my-3" />

                  <div className="flex justify-between mt-3">
                    <p className="text-sm ">Relation Type</p>
                    <p className=" text-sm">
                      {employee?.emergencyContact?.relation}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col flex-grow gap-3">
                <div className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl mt-0 md:mt-3">
                  <p className="text-[18px] font-semibold">PF Info</p>

                  <div className="flex justify-between mt-3">
                    <p className="text-sm ">UAN No</p>
                    <p className="text-sm ">{employee?.uanNo ?? "N/A"}</p>
                  </div>
                  <hr className="my-3" />
                  {/* <div className="flex justify-between mt-3">
                    <p className="text-sm ">PF join Date.</p>
                    
                    <p className="text-sm ">
                      {employee?.employee_details?.pf_info?.pf_joining_date
                        ? employee.employee_details.pf_info.pf_joining_date
                            .split("-")
                            .reverse()
                            .join("-")
                        : "N/A"}
                    </p>
                  </div>
                  <hr className="my-3" /> */}

                  <div className="flex justify-between mt-3">
                    <p className="text-sm ">PF Join Date.</p>
                    <p className="text-sm ">
                      {employee?.pfJoinDate
                        ? formatDateTime(employee.pfJoinDate)
                        : "N/A"}
                    </p>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between mt-3">
                    <p className="text-sm ">PF Exp Date.</p>
                    <p className="text-sm ">
                      {employee?.pfExpDate
                        ? formatDateTime(employee.pfExpDate)
                        : "N/A"}
                    </p>
                  </div>

                  {/* 
                <div className="flex justify-between mt-3">
                  <p className="text-sm">Phone Number</p>
                  <p className="text-sm ">(380)-322-4422</p>
                </div> */}
                </div>

                <div className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl ">
                  {/* <div className="flex justify-between"> */}
                  <p className="text-[18px] font-semibold">Documents</p>
                  {/* <button
                    onClick={() =>
                      navigate("/editemployeedetails", {
                        state: {
                          employee_id: employee.employee_details.id,
                          scrollTo: "documents",
                        },
                      })
                    }
                    className="text-sm h-fit bg-gray-200 px-5 py-2 rounded-3xl"
                  >
                    Edit
                  </button>
                </div> */}

                  <div className="grid grid-cols-2">
                    {employeeDocuments?.map((item) => (
                      <div className="mt-3" key={item.document_name}>
                        <p className="">{item.document_name}</p>
                        <div className=" gap-2 mt-1">
                          {item.documents.map((document, index) => (
                            <div
                              key={index}
                              className="w-fit mt-1 px-4 gap-1 bg-gray-100 flex items-center py-1 hover:bg-gray-200 rounded-xl  text-xl cursor-pointer"
                              onClick={() => openDocument(document.url)}
                            >
                              {document.url.includes(".pdf") && <FaFilePdf />}
                              {document.url.includes(".JPG") && <FaFileImage />}
                              {document.url.includes(".jpg") && <FaFileImage />}
                              {document.url.includes(".jpeg") && (
                                <FaFileImage />
                              )}
                              {document.url.includes(".webp") && (
                                <FaFileImage />
                              )}
                              {document.url.includes(".png") && <FaFileImage />}
                              {document.url.includes(".xlsx") && (
                                <PiMicrosoftExcelLogoFill />
                              )}
                              {document.url.includes(".docx") && <FaFileWord />}

                              <span className="text-[14px]">
                                {document?.url.split("-")[1]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {employee.driveLink ? (
                  <div className="border-2 bg-white px-4 py-3 md:px-7 md:py-5 rounded-2xl">
                    <p className="text-[18px] font-semibold mb-2">
                      Documents Drive Link
                    </p>
                    <a
                      href={employee.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 flex items-center gap-2 text-sm break-all md:text-base md:break-normal"
                    >
                      <IoIosLink className="text-lg shrink-0" />
                      <span className="truncate md:whitespace-normal md:truncate-none w-full">
                        {employee.driveLink}
                      </span>
                    </a>
                  </div>

                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          {/* rightsidebar */}
          <div className="flex flex-col gap-3 basis-[30%]">
            <div className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl">
              <p className="text-[18px] font-semibold">Personal Info 2</p>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between mt-3">
                  <p className="text-sm ">Father Name</p>
                  <p className=" text-sm">{employee?.fatherName ?? "N/A"}</p>
                </div>
                <hr />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between mt-3">
                  <p className="text-sm ">Mother Name</p>
                  <p className=" text-sm">{employee?.motherName ?? "N/A"}</p>
                </div>
                <hr />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between gap-2 mt-3">
                  <p className="text-sm inline-block w-1/3">
                    Address 1{" "}
                  </p>
                  <p className=" text-sm w-full text-end">
                    {employee?.address1 ?? "N/A"}
                  </p>

                </div>
                <hr />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between gap-2 mt-3">
                  <p className="text-sm inline-block w-1/3">Address 2</p>
                  <p className=" text-sm w-full text-end">{employee?.address2 ?? "N/A"}</p>
                </div>
                <hr />
              </div>
            </div>
            <div className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl ">
              {/* <div className="flex justify-between"> */}
              <p className="text-[18px] font-semibold">Bank information</p>
              {/* <button
                onClick={() =>
                  navigate("/editemployeedetails", {
                    state: {
                      employee_id: employee.employee_details.id, // Pass the employee ID here
                      scrollTo: "bank-information",
                    },
                  })
                }
                className="text-sm bg-gray-200 h-fit px-5 py-2 rounded-3xl"
              >
                Edit
              </button>
            </div> */}
              <div className="flex justify-between mt-3">
                <p className="text-sm ">Bank account No.</p>
                <p className=" text-sm">{employee?.bank?.accountNo}</p>
              </div>
              <hr className="my-3" />

              <div className="flex justify-between mt-3">
                <p className="text-sm ">GPay / PhonePe Number</p>
                <p className=" text-sm">{employee?.bank?.gpayNumber}</p>
              </div>
              <hr className="my-3" />

              <div className="flex justify-between mt-3">
                <p className=" text-sm ">Bank Name</p>
                <p className=" text-sm">{employee?.bank?.bankName}</p>
              </div>
              <hr className="my-3" />

              <div className="flex justify-between mt-3">
                <p className=" text-sm ">Bank Branch</p>
                <p className=" text-sm">{employee?.bank?.branch}</p>
              </div>
              <hr className="my-3" />

              <div className="flex justify-between mt-3">
                <p className=" text-sm ">IFSC Code</p>
                <p className=" text-sm">{employee?.bank?.ifscCode}</p>
              </div>
              <hr className="my-3" />
            </div>

            <div className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl ">
              {/* <div className="flex justify-between"> */}
              <p className="text-[18px] font-semibold">Salary information</p>
              {/* <button
                onClick={() =>
                  navigate("/editemployeedetails", {
                    state: {
                      employee_id: employee.employee_details.id, // Pass the employee ID here
                      scrollTo: "salary-information",
                    },
                  })
                }
                className="text-sm bg-gray-200 px-5 py-2 rounded-3xl"
              >
                Edit
              </button>
            </div> */}
              {/* <div className="flex justify-between mt-3">
              <p className="text-sm">Salary basis </p>
              <p className=" text-sm">
                {employee?.employee_details?.salary_information?.salary_basic}
              </p>
            </div> */}
              {/* <hr className="my-3" /> */}

              <div className="flex justify-between mt-3">
                <p className="text-sm ">Salary amount per month</p>
                <p className=" text-sm">{employee?.salaryAmount}</p>
              </div>
              <hr className="my-3" />

              {/* <div className="flex justify-between mt-3">
              <p className="text-sm">Effective Date</p>
              <p className=" text-sm">
                {employee?.employee_details?.salary_information?.effective_date}
              </p>
            </div>
            <hr className="my-3" /> */}

              <div className="flex justify-between mt-3">
                <p className="text-sm ">Payment type</p>
                <p className=" text-sm">{employee?.paymentType}</p>
              </div>
              <hr className="my-3" />

              {/* <div className="flex justify-between mt-3">
              <p className="text-sm">bill Rate</p>
              <p className=" text-sm">20%</p>
            </div> */}
            </div>

            <div className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl ">
              <p className="text-[18px] font-semibold">Experience</p>

              {employee?.experience ? (
                employee?.experience.map((item, index) => (
                  <div className="mt-3 flex flex-col gap-2">
                    <div className="grid grid-cols-2 ">
                      <h1 className="text-sm ">Job Title</h1>

                      <p className="text-sm  ">{item.jobTitle}</p>
                    </div>

                    <div className="grid grid-cols-2  ">
                      <p className="text-sm ">Start & End Date</p>
                      <p className="text-sm  ">
                        {item.startWork} - {item.endWork}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 ">
                      <h1 className="text-sm ">Company Industry</h1>
                      <p className="text-sm  ">{item.companyIndustry}</p>
                    </div>

                    <div className="grid grid-cols-2 ">
                      <h1 className="text-sm ">Company Name</h1>
                      <p className="text-sm  ">{item.companyName}</p>
                    </div>

                    <div className="grid grid-cols-2  ">
                      <h1 className="text-sm ">Responsibilities</h1>
                      <p className="text-sm  ">{item.responsibilities}</p>
                    </div>

                    <div className="grid grid-cols-2 ">
                      <h1 className="text-sm ">Previous Salary</h1>
                      <p className="text-sm ">{item.previousSalary}</p>
                    </div>

                    <div className="grid grid-cols-2 ">
                      <h1 className="text-sm ">selected Documents</h1>

                      <ul className="flex flex-wrap gap-x-6 mx-3 list-disc">
                        {item.selectedDocs.map((data) => (
                          <li className="text-sm  ">{data}</li>
                        ))}
                      </ul>
                    </div>

                    <hr className="my-3" />
                  </div>
                ))
              ) : (
                <p>N/A</p>
              )}
            </div>

            {/* exit form */}

            <div
              className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl 
          "
            >
              {/* <div className="flex justify-between"> */}
              <p className="text-[18px] font-semibold">Exit form</p>
              {/* <button
                onClick={() =>
                  navigate("/editemployeedetails", {
                    state: {
                      employee_id: employee.employee_details.id, // Pass the employee ID here
                      scrollTo: "salary-information",
                    },
                  })
                }
                className="text-sm bg-gray-200 px-5 py-2 rounded-3xl"
              >
                Edit
              </button>
            </div> */}
              {/* <div className="flex justify-between mt-3">
              <p className="text-sm">Salary basis </p>
              <p className=" text-sm">
                {employee?.employee_details?.salary_information?.salary_basic}
              </p>
            </div> */}
              {/* <hr className="my-3" /> */}

              <div className="flex justify-between mt-3">
                <p className="text-sm ">Resignation Email Date</p>
                <p className=" text-sm">
                  {employee?.resignation_email_date || "-"}
                </p>
              </div>
              <hr className="my-3" />

              {/* <div className="flex justify-between mt-3">
              <p className="text-sm">Effective Date</p>
              <p className=" text-sm">
                {employee?.employee_details?.salary_information?.effective_date}
              </p>
            </div>
            <hr className="my-3" /> */}

              <div className="flex justify-between mt-3">
                <p className="text-sm ">Notice period </p>
                <p className=" text-sm">{employee?.notice_period || "-"}</p>
              </div>
              <hr className="my-3" />

              {/* inspass */}
              <div className="flex justify-between mt-3">
                <p className="text-sm ">Last working date</p>
                <p className=" text-sm">
                  {employee?.last_working_date ? formatDateTime(employee?.last_working_date): "-"}{" "}
                </p>
              </div>
              <hr className="my-3" />

              {/* dater */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between mt-3 ">
                  <p className="text-sm "> Reason for relieving</p>
                  <p className=" text-sm break-words text-end">
                    {capitalizeFirstLetter(employee?.relieving_reason || "-")}
                  </p>
                </div>
              </div>
              <hr className="my-3" />

              {/* <div className="flex justify-between mt-3">
              <p className="text-sm">bill Rate</p>
              <p className=" text-sm">20%</p>
            </div> */}
            </div>

            {/* relevinig  */}
            <div
              className="border-2 bg-white px-5 md:px-7 py-5 rounded-2xl 
          "
            >
              {/* <div className="flex justify-between"> */}
              <div className="flex justify-between">
                {" "}
                <p className="text-[18px] font-semibold">Reliving</p>
                {/* <div className="cursor-pointer" onClick={handlpopup}>
                  <FaEdit />
                </div> */}
              </div>

              <div className="flex justify-between mt-3">
                <p className="text-sm ">Reliving Date</p>
                <p className=" text-sm">
                  {/* {employee?.relivingDate || "-"} */}

                  {employee?.relivingDate
                    ? formatDateTime(employee.relivingDate)
                    : "-"}
                </p>
              </div>
              <hr className="my-3" />

              {/* <div className="flex justify-between mt-3">
              <p className="text-sm">Effective Date</p>
              <p className=" text-sm">
                {employee?.employee_details?.salary_information?.effective_date}
              </p>
            </div>
            <hr className="my-3" /> */}

              <div className="flex justify-between mt-3 gap-2 flex-wrap">
                <p className="text-sm ">Reliving Reason </p>
                <p className=" text-sm">{employee?.relivingReason || "-"}</p>
              </div>
              <hr className="my-3" />

              {/* <div className="flex justify-between mt-3">
              <p className="text-sm">bill Rate</p>
              <p className=" text-sm">20%</p>
            </div> */}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {changePasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-xl w-96">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <label className="block text-sm  mb-2">Employee Id</label>
            <input
              type="text"
              disabled
              value={employee?.employeeId}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="block text-sm  mb-2">New Password</label>
            <input
              type="text"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value); // Validate dynamically
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setChangePasswordModal(false)}
                className="bg-gray-400 px-4 py-2 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => changePassword(employee._id)}
                className="bg-blue-600 px-4 py-2 text-white rounded-lg"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetails_Mainbar;
