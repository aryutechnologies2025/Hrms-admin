import { useState, useEffect, useRef } from "react";
import { IoAddCircleSharp } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import { useDropzone } from "react-dropzone";
import { IoCloudUploadOutline } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../../api/axiosConfig.js";
import { API_URL } from "../../config";
import { capitalizeFirstLetter } from "../../utils/StringCaps.js";
import { formatDate } from "../../utils/dateformate.js";
import Swal from "sweetalert2";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import Loader from "../Loader.jsx";
import Button_Loader from "../Button_Loader.jsx";

const EditEmployeeDetails_Mainbar = () => {
  const roleDropdownRef = useRef();
  const [selectedPosition, setSelectedPosition] = useState({}); // { id, name }

  const location = useLocation();
  const { employee_id } = location.state || {};
  const [data, setData] = useState([]);
  console.log("data", data);
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [employeeWorkType, setEmployeeWorkType] = useState("");
    const [internMonths, setInternMonths] = useState("");
  
  // const [driveLink, setDriveLink] = useState("");

  let navigate = useNavigate();

  const onClickCreateEmployeeCancelButton = () => {
    navigate("/employees");
  };

  const [searchedPosition, setSearchedPosition] = useState("");
  const [positionIsOpen, setPositionIsOpen] = useState(false);
  //roles

  const [roles, setRoles] = useState([]);
  const [department, setdepartment] = useState([]);

  const filteredPositionOptions = roles;

  const [searchedDepartment, setSearchedDepartment] = useState("");
  const [departmentIsOpen, setDepartmentIsOpen] = useState(false);

  const departmentOptions = [
    "Development",
    "SEO",
    "Digital Marketing",
    "Accounts",
  ];

  const filteredDepartmentOptions = departmentOptions.filter((option) =>
    option.toLowerCase().includes(searchedDepartment.toLowerCase())
  );

  //Employee Type
  const [searchedEmployeeType, setSearchedemployeetype] = useState("");
  const [employeeTypeIsOpen, setEmployeeTypeIsOpen] = useState(false);

  const employeeTypeOptions = ["freelancers", "full_time", "part_time"];

  const filteredEmployeeTypeOptions = employeeTypeOptions.filter((option) =>
    option.toLowerCase().includes(searchedEmployeeType.toLowerCase())
  );

  const [searchedBankName, setSearchedBankName] = useState("");
  const [bankNameIsOpen, setBankNameIsOpen] = useState(false);

  const bankNameOptions = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India",
    "IndusInd Bank",
    "Yes Bank",
    "Federal Bank",
    "IDFC FIRST Bank",
    "South Indian Bank",
    "RBL Bank",
    "UCO Bank",
    "Indian Bank",
    "Central Bank of India",
    "Punjab & Sind Bank",
    "AU Small Finance Bank",
  ];

  const filteredBankNametOptions = bankNameOptions.filter((option) =>
    option.toLowerCase().includes(searchedBankName.toLowerCase())
  );

  const [skillsInputValue, setSkillsInputValue] = useState("");

  const [selectedDocs, setSelectedDocs] = useState([]);

  const handleCheckboxChangeVerification = (event) => {
    const { name, checked } = event.target;

    if (checked) {
      setSelectedDocs((prev) => [...prev, name]);
    } else {
      setSelectedDocs((prev) => prev.filter((doc) => doc !== name));
    }
    setExperienceForm((prev) => ({
      ...prev,
      selectedDocs: selectedDocs,
    }));
  };

  const handleSkillsKeyPress = (e) => {
    if (e.key === "Enter" && skillsInputValue.trim()) {
      const updatedSkills = [...skills, skillsInputValue.trim()];
      setSkills(updatedSkills);
      setSkillsInputValue("");

      setFormData((prevData) => ({
        ...prevData,

        skills: updatedSkills, // Directly update skills array
      }));
    }
  };

  const handleDeleteSkill = (skillToDelete) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToDelete);
    setSkills(updatedSkills);

    setFormData((prevData) => ({
      ...prevData,

      skills: updatedSkills, // Ensure proper update
    }));
  };

  const [responsibilities, setResponsibilities] = useState([]);
  const [responsibilitiesInputValue, setResponsibilitiesInputValue] =
    useState("");

  const handleResponsibilitiesKeyPress = (e) => {
    if (e.key === "Enter" && responsibilitiesInputValue) {
      setResponsibilities([
        ...responsibilities,
        responsibilitiesInputValue.trim(),
      ]);
      setResponsibilitiesInputValue("");
    }
  };

  const handleDeleteResponsibilities = (skillToDelete) => {
    setSkills(skills.filter((skill) => skill !== skillToDelete));
  };

  const [hamburgerIconClicked, setHamburgerIconClicked] = useState(false);

  const onClickSidebarMenu = (label) => {
    navigate(`/${label.toLowerCase()}`);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const onClickHamburgerIcon = () => {
    setHamburgerIconClicked(!hamburgerIconClicked);
  };

  const [addWorkExperienceModalOpen, setAddWorkExperienceModalOpen] =
    useState(false);
  const [addEducationalInfoModalOpen, setAddEducationalInfoModalOpen] =
    useState(false);
  const [addEmployeeDocumentsModalOpen, setAddEmployeeDocumentModalOpen] =
    useState(false);

  const [isAnimating, setIsAnimating] = useState(false);

  const openWorkExperienceModal = () => {
    setAddWorkExperienceModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10); // Delay to trigger animation
  };

  const closeAddWorkExperienceModal = () => {
    setIsAnimating(false);
    setTimeout(() => setAddWorkExperienceModalOpen(false), 250);
  };

  const openAddEducationInfoModal = () => {
    setAddEducationalInfoModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeAddEducationInfoModal = () => {
    setIsAnimating(false);
    setTimeout(() => setAddEducationalInfoModalOpen(false), 250);
  };

  const openAddEmployeeDocumentsModal = () => {
    setAddEmployeeDocumentModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeAddEmployeeDocumentsModal = () => {
    setIsAnimating(false);
    setTimeout(() => setAddEmployeeDocumentModalOpen(false), 250);
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/roles/view-employeerole`
      );

      if (response.data.success) {
        const roleNames = response.data.data;
        setRoles(roleNames);
        setLoading(false);
      } else {
        setError("Failed to fetch roles.");
      }
    } catch (err) {
      setError("Failed to fetch roles.");
      setLoading(false);
    }
    //abcd
    try {
      const response = await axios.get(
        `${API_URL}/api/department/view-employeedepartment`
      );

      if (response.data.success) {
        const departmentNames = response.data.data;
        setdepartment(departmentNames);
      } else {
        setError("Failed to fetch roles.");
      }
    } catch (err) {
      setError("Failed to fetch roles.");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleDateChange = async (date) => {
    if (date) {
      const formattedDate = formatDate(date);
      setEmployeeDateOfJoin(formattedDate);
      setFormData((prevFormData) => ({
        ...prevFormData,

        dateOfJoining: formattedDate,
      }));
    } else {
      setEmployeeDateOfJoin(null);
    }

    try {
      const response = await axios.post(`${API_URL}/api/employees/customId`, {
        dateofjoining: date.toISOString().split("T")[0], // Format to YYYY-MM-DD
        empid: employee_id,
      });

      // console.log('check data', response);
      // setEmployeeId(response.data.employeeid);
      setFormData((prevFormData) => ({
        ...prevFormData,
        employee_details: {
          ...prevFormData.employee_details,
          employeeid: response.data.employeeid, // Use response data, not e.target.value
        },
      }));
    } catch (error) {
      console.error("Error generating custom ID:", error);
    }
  };

  const [employeestatus, setEmployeeStatus] = useState("");
  const [relivingdate, setRelivingDate] = useState(null);

  const handleEmployeeStatus = async (e) => {
    setEmployeeStatus(e.target.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      dutyStatus: e.target.value,
    }));
  };

  const handleRelivingDateChange = async (date) => {
    if (date) {
      // Format the date to "yyyy-mm-dd"
      const formattedDate = formatDate(date);
      setRelivingDate(formattedDate);
      setFormData((prevFormData) => ({
        ...prevFormData,
        relivingDate: formattedDate,
      }));
    } else {
      setRelivingDate(null);
    }
  };

  const handlepassportExpiryDate = (date) => {
    if (date) {
      // Format the date to "yyyy-mm-dd"
      const formattedDate = formatDate(date); // This gives you "yyyy-mm-dd"
      setPassportExpiryDate(formattedDate);
    } else {
      setPassportExpiryDate(null);
    }
  };

  const handleDateofBirth = (date) => {
    if (date) {
      // Format the date to "yyyy-mm-dd"
      const formattedDate = formatDate(date); // This gives you "yyyy-mm-dd"
      setEmployeeDob(formattedDate);
      setFormData({
        ...formData, // Spread the existing formData

        dateOfBirth: formattedDate, // Update only the passport_no field
      });
    } else {
      setEmployeeDob(null);
    }
  };

  // const handlePfJoinDate = (date) => {
  //   if (date) {
  //     const formattedDate = formatDate(date);
  //     setPfJoinDate(formattedDate);
  //   } else {
  //     setPfJoinDate(null);
  //   }
  // };

  // const handlePfExpDate = (date) => {
  //   if (date) {
  //     const formattedDate = formatDate(date);
  //     setPfExpiryDate(formattedDate);
  //   } else {
  //     setPfExpiryDate(null);
  //   }
  // };

  const handlePfJoinDate = (date) => {
    if (date) {
      const formattedDate = formatDate(date);
      setPfJoinDate(formattedDate);
      setFormData({
        ...formData, // Spread the existing formData

        pfJoinDate: formattedDate, // Update only the passport_no field
      });
    } else {
      setPfJoinDate(null);
    }
  };

  const handlePfExpDate = (date) => {
    if (date) {
      const formattedDate = formatDate(date);
      setPfExpiryDate(formattedDate);
      setFormData({
        ...formData, // Spread the existing formData

        pfExpDate: formattedDate, // Update only the passport_no field
      });
    } else {
      setPfExpiryDate(null);
    }
  };

  //verification doc

  const [checkedDocuments, setCheckedDocuments] = useState({
    Aadhar: false,
    Education: false,
    Salary: false,
    Experience: false,
  });

  // Handle checkbox change
  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    setCheckedDocuments((prevState) => ({
      ...prevState,
      [id]: checked,
    }));
  };

  // Function to get the verification documents with only checked items
  const getVerificationDocuments = () => {
    return Object.keys(checkedDocuments)
      .filter((key) => checkedDocuments[key]) // Only check the items where the value is true
      .map((key) => ({
        verfication_doc_name: key,
        verification_status: true,
      }));
  };

  //password
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  //upload images

  const [selectedImage, setSelectedImage] = useState(null);
  const [openImageModal, setOpenImageModal] = useState(false);

  //Education Info
  const [educationInfo, setEducationInfo] = useState([]);
  const [educationInfoS, setEducationInfoS] = useState([]);
  const [schoolName, setSchoolName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");

  const [educationTouched, setEducationTouched] = useState({
    //education info
    SchoolName: true,
    DepartmentName: true,
    YearOfPassing: true,
  });

  const handleSaveEducationInfo = () => {
    //education info
    const isSchoolNameValid = schoolName.trim() !== "" ? true : false;
    const isDepartmentNameValid = departmentName.trim() !== "" ? true : false;
    const isendYeadValid = endYear.trim() !== "" ? true : false;

    setEducationTouched({
      SchoolName: isSchoolNameValid,
      DepartmentName: isDepartmentNameValid,
      YearOfPassing: isendYeadValid,
    });

    if (schoolName && departmentName && endYear) {
      closeAddEducationInfoModal();
      const newEntry = {
        schoolName,
        departmentName,
        period_of_end: `${endYear}`,
      };
      const newEntrys = {
        schoolName,
        departmentName,

        endYear: endYear,
      };
      setFormData({
        ...formData, // Spread the existing formData

        education: [...educationInfo, newEntrys],
      });
      setEducationInfo([...educationInfo, newEntry]); // Add new entry to the array
      setEducationInfoS([...educationInfoS, newEntrys]);
      setSchoolName("");
      setDepartmentName("");
      setStartYear("");
      setEndYear("");
    } else {
      console.log("fill all the fields");
    }
  };

  const onClickEducationInfoDelete = (deleteIndex) => {
    const newEducationInfo = educationInfo.filter(
      (_, index) => index !== deleteIndex
    );
    console.log("helloqwerrr", newEducationInfo);

    setEducationInfo(newEducationInfo);
    setFormData({
      ...formData, // Spread the existing formData

      education: newEducationInfo, // Update only the passport_no field
    });
  };

  //experience

  const [workExperiences, setWorkExperiences] = useState([]);

  const [experienceForm, setExperienceForm] = useState({
    jobTitle: "",
    companyIndustry: "",
    companyName: "",
    previousSalary: "",
    startWork: "",
    endWork: "",
    responsibilities: "",
    selectedDocs: "",
  });

  const handleDeleteResponsibility = (index) => {
    setExperienceForm((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }));
  };

  const handleAddResponsibility = (e) => {
    if (e.key === "Enter" && responsibilityInput.trim() !== "") {
      setExperienceForm((prev) => ({
        ...prev,
        responsibilities: [...prev.responsibilities, responsibilityInput],
      }));
      setResponsibilityInput("");
    }
  };

  const [expTouched, setExpTouched] = useState({
    //experience
    jobTitle: true,
    companyIndustry: true,
    companyName: true,
    previousSalary: true,
    startWork: true,
    endWork: true,
    responsibilities: true,
  });
  const handleSaveExperience = () => {
    //experience
    const isexpJobTitleValid =
      experienceForm.jobTitle.trim() !== "" ? true : false;
    const isCompanyIndustryValid =
      experienceForm.companyIndustry !== "" ? true : false;
    const isCompanyNameValid = experienceForm.companyName !== "" ? true : false;
    const ispreviousSalary =
      experienceForm.previousSalary !== "" ? true : false;
    const isstartWork = experienceForm.startWork !== "" ? true : false;
    const isendWork = experienceForm.endWork !== "" ? true : false;
    const isresponsibilitiesInputValue =
      experienceForm.responsibilities !== "" ? true : false;

    setExpTouched({
      jobTitle: isexpJobTitleValid,
      companyIndustry: isCompanyIndustryValid,
      companyName: isCompanyNameValid,
      previousSalary: ispreviousSalary,
      startWork: isstartWork,
      endWork: isendWork,
      responsibilities: isresponsibilitiesInputValue,
    });

    const isValid =
      experienceForm.companyIndustry &&
      experienceForm.companyName &&
      experienceForm.endWork &&
      experienceForm.jobTitle &&
      experienceForm.previousSalary &&
      experienceForm.responsibilities.length > 0 &&
      experienceForm.startWork;

    if (isValid) {
      closeAddWorkExperienceModal();
      setWorkExperiences([...workExperiences, experienceForm]);
      setFormData({
        ...formData, // Spread the existing formData

        experience: [...workExperiences, experienceForm], // Update only the passport_no field
      });
      setExperienceForm({
        jobTitle: "",
        companyIndustry: "",
        companyName: "",
        previousSalary: "",
        startWork: "",
        endWork: "",
        responsibilities: [],
      });
      setResponsibilityInput("");
    } else {
      console.log("fill all the fields");
    }
  };

  const onClickWorkExperienceDelete = (deleteIndex) => {
    const newWorkExperience = workExperiences.filter(
      (_, index) => index !== deleteIndex
    );
    setWorkExperiences(newWorkExperience);
    setFormData({
      ...formData, // Spread the existing formData

      experience: newWorkExperience, // Update only the passport_no field
    });
  };

  //Documents

  const [title, setTitle] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  console.log("uploadedDocuments1111:", uploadedDocuments);

  const [getuploadedDocuments, getUploadedDocuments] = useState([]);
  const [docTitle, setDocTitle] = useState(true);

  const saveUploadedFile = (event) => {
    event.preventDefault();

    const isdocTitleValid = title.trim() !== "";
    setDocTitle(isdocTitleValid);
    if (!isdocTitleValid) return;

    setTitle(""); // Clear only after checking

    // Create merged documents list
    const updatedDocuments = (() => {
      const documentMap = new Map();
      uploadedDocuments.forEach((doc) => {
        documentMap.set(doc.title, {
          title: doc.title,
          files: [...(doc.files || [])],
        });
      });

      uploadedFiles.forEach((fileGroup) => {
        if (documentMap.has(fileGroup.title)) {
          const existingDoc = documentMap.get(fileGroup.title);
          documentMap.set(fileGroup.title, {
            ...existingDoc,
            files: [...existingDoc.files, ...(fileGroup.files || [])],
          });
        } else {
          documentMap.set(fileGroup.title, {
            title: fileGroup.title,
            files: fileGroup.files || [],
          });
        }
        closeAddEmployeeDocumentsModal();
      });

      return Array.from(documentMap.values());
    })();

    // Now update states using final updated array
    setUploadedDocuments(updatedDocuments);
    getUploadedDocuments(updatedDocuments); // Not sure why this is a setter-like function

    setFormData({
      ...formData,
      document: updatedDocuments,
    });

    setUploadedFiles([]);
  };

  const onDrop = (acceptedFiles) => {
    if (!title.trim()) {
      return;
    }

    setUploadedFiles((prevFiles) => {
      const filesWithDetails = acceptedFiles.map((file) => {
        const filePath = file.path || file.name;
        const cleanFilePath = filePath.replace(/^\.\/+/, "");
        return {
          id: Date.now() + Math.random(),
          selectedfile: file,
          file: {
            path: cleanFilePath,
            relativePath: cleanFilePath,
          },
          preview: URL.createObjectURL(file),
        };
      });
      const existingGroupIndex = prevFiles.findIndex(
        (group) => group.title === title
      );
      if (existingGroupIndex !== -1) {
        const existingFiles = prevFiles[existingGroupIndex].files;
        const uniqueFiles = filesWithDetails.filter((newFile) => {
          return !existingFiles.some(
            (existingFile) => existingFile.file.path === newFile.file.path
          );
        });
        prevFiles[existingGroupIndex].files = [
          ...existingFiles,
          ...uniqueFiles,
        ];
        return [...prevFiles];
      } else {
        return [
          ...prevFiles,
          {
            title: title || "Untitled",
            files: filesWithDetails,
          },
        ];
      }
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "application/pdf": [".pdf"],
    },

    // maxFiles: 1,
    disabled: !title.trim(), // Disable dropzone if title is empty
  });

  const handleDelete = (fileId, groupTitle) => {
    setUploadedFiles(
      (prevFiles) =>
        prevFiles
          .map((group) => {
            if (group.title === groupTitle) {
              return {
                ...group,
                files: group.files.filter((file) => file.id !== fileId),
              };
            }
            return group;
          })
          .filter((group) => group.files.length > 0) // Remove empty groups
    );
  };

  const onClickDocumentDeleteButton = async (clicked_index, files) => {
    // const id = files[0].doc_id;

    try {
      //Show a confirmation dialog before proceeding with deletion
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this document?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      // Proceed if the user confirms
      if (result.isConfirmed) {
        //   // Call the backend API to mark the document as deleted
        setUploadedDocuments(
          (prevDocuments) =>
            prevDocuments.filter((_, index) => index !== clicked_index) // Remove the document at the clicked index
        );
        try {
          await axios.delete(
            `${API_URL}/api/employees/delete-employee-file/${employee_id}/${clicked_index}`
          );
        } catch (error) {
          console.error("Error deleting document:", error);
        }

        // Show a success message
        Swal.fire({
          title: "Deleted!",
          text: "The document has been successfully deleted.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while deleting the document.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // const onClickDocumentDeleteButton = (clicked_index) => {
  //   console.log(clicked_index);

  //   setUploadedDocuments(
  //     (prevDocuments) =>
  //       prevDocuments.filter((_, index) => index !== clicked_index) // Remove the document at the clicked index
  //   );
  // };
  /*************************************** set Values *************************************************** */

  // console.log('postion', selectedPosition);
  // console.log('searchedDepartment', selectedDepartmentOption);

  //basic information
  const [employee_name, setEmployeeName] = useState("");
  // const [selectedPosition, setSelectedPosition] = useState([])
  const [selectedDepartmentOption, setSelectedDepartmentOption] =
    useState(null);
  const [selectedEmployeeOption, setSelectedEmployeeTypeOption] = useState({});

  const [employeeDateOfJoin, setEmployeeDateOfJoin] = useState(null);
  const [phone_number, setPhoneNumber] = useState("");

  const [emailaddress, setEmailAddress] = useState("");
  const [employeepassword, setEmployeePassword] = useState("");

  //personal info

  const [passport_number, setPassportNumber] = useState("");
  const [passportExpiryDate, setPassportExpiryDate] = useState(null);
  const [aadhar_no, setAadharNumber] = useState("");
  const [employeeDob, setEmployeeDob] = useState(null);
  const [maritalStatus, setMaritalStatus] = useState("");

  //pf details
  const [uan_number, setUANNumber] = useState("");
  const [pfJoinDate, setPfJoinDate] = useState(null);
  const [pfExpiryDate, setPfExpiryDate] = useState(null);

  //insurance
  const [insurance_number, setInsuranceNumber] = useState("");
  const [nominee_name, setNomineeName] = useState("");
  const [nomineeaadhar_no, setNomineeAadharNumber] = useState("");

  //emergency contact
  const [emergency_fullname, setEmergencyName] = useState("");
  const [emergencyContact, setemergencyContact] = useState(null);
  const [emergency_relationtype, setRelationType] = useState("");
  // const [pf, setPfExpiryDate] = useState(null);

  //bank
  const [account_number, setAccountNumber] = useState("");
  const [selectedBankNameOption, setSelectedBankNameOption] = useState(null);
  const [pan_number, setPanNumber] = useState("");
  const [ifsc_code, setIFSCCode] = useState("");
  const [bank_branch, setBankBranch] = useState("");

  //salray
  const [salary_basic, setSalaryBasic] = useState("");
  const [salary_amount, setSalaryAmount] = useState("");
  const [effectivedate, setEffectiveDATE] = useState(null);
  const [payment_type, setPaymentType] = useState("");

  //skills
  const [skills, setSkills] = useState([]);
  const [rolesId, setRolesId] = useState("");
  //verification doc

  const verificationDocuments = getVerificationDocuments();
  const [error, setError] = useState({});

  const [touched, setTouched] = useState({
    employeeId: true,
    fullName: true,
    phoneNum: true,
    email: true,
    dateOfJoin: true,
    relivingdate: true,
    passportNo: true,
    panNo: true,
    aadharNo: true,
    dob: true,
    MaritalStatus: true,
    SelectedPositiontype: true,
    uanNumber: true,
    pfJoinDate: true,
    pfExpiryDate: true,

    emergencyName: true,
    emergencyContact: true,
    emergencyRelationType: true,

    accountNumber: true,
    BankName: true,
    ifscCode: true,
    accountbranch: true,

    SalaryBasis: true,
    salaryAmount: true,
    EffectiveDate: true,
    PaymentType: true,

    //dropdown
    SelectedEmployeeTypeOption: true,
    SelectedPosition: true,
    SelectedDepartmentOption: true,

    UploadPhoto: true,
  });

  const handleKeyUp = (event) => {
    const inputElement = event.target; // Get the input element

    inputElement.classList.remove("border-red-400");
  };

  const fetchData = async () => {
    

    try {
      const response = await axios.get(
        `${API_URL}/api/employees/view-employee/${employee_id}`
      );
      const employee = response.data.data;
      setData(employee);
      setFormData(employee);

      setSelectedEmployeeTypeOption(employee?.employeeType);

      if (employee?.roleId && roles.length > 0) {
        const matchedRole = roles.find((role) => role._id === employee.roleId);
        if (matchedRole) {
          setSelectedPosition({
            id: matchedRole._id, // Set the roleId
            name: matchedRole.name, // Set the role name
          });
        }
      }

      if (employee?.departmentTypeId && department.length > 0) {
        const matchedDepartment = department.find(
          (department) => department._id === employee.departmentTypeId
        );
        if (matchedDepartment) {
          setSelectedEmployeeTypeOption({
            id: matchedDepartment._id, // Set the roleId
            name: matchedDepartment.name, // Set the role name
          });
        }
      }

      setEmployeeStatus(employee?.dutyStatus);
      setRelivingDate(employee?.relivingDate);
      setEmployeeDateOfJoin(employee?.dateOfJoining);
      setEmployeeDob(employee?.dateOfBirth);
      setPfJoinDate(employee?.pfJoinDate);
      setPfExpiryDate(employee?.pfExpDate);
      setSelectedBankNameOption(employee?.bank?.bankName);

      setMaritalStatus(employee?.maritalStatus);
      setRelationType(employee?.emergencyContact?.relation);
      setEducationInfo(employee?.education);
      setEducationInfoS(educationInfoS, employee?.education);
      setWorkExperiences(employee?.experience);
      setRelieveemaildate(employee?.resignation_email_date || "-");
      setSelectedDuration(employee?.notice_period || "-");
      setLastWorkdate(employee?.last_working_date || "-");

      if (employee?.skills?.length > 0) {
        const skillArray = employee?.skills.map((item) => item);
        setSkills(skillArray);
      }

      const profileImg = `${API_URL}/api/uploads/${employee?.photo}`;
      setSelectedImage(profileImg);

      //doucments
      const documents = employee?.document || [];

      const uploadedDocs = documents.map((doc) => ({
        title: doc.title,
        files: doc.files.map((file) => ({
          file: `${API_URL}/api/uploads/documents/${file.filepath}`,
          preview: file.originalName,
        })),
        // doc_id: doc.document_id,
      }));
      // Update uploaded documents state
      setUploadedDocuments(uploadedDocs);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (roles) {
      fetchData();
    }
  }, [roles, department]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;
  const aadharRegex = /^\d{12}$/;
  const pancardRegex = /^([A-Z]{5})(\d{4})([A-Z]{1})$/;

  const handleSubmit = async (id) => {
    // const position = selectedPosition.map((item) => item.id);
    setIsButtonLoading(true);

    // new add edit validation
    setErrorMessage("");
    setSuccessMessage("");
    // setButtonLoading(true);
    // let selectedRolesInArray = selectedRoles.map((item) => item.id);

    setError("");
    // Validate all fields
    const isFullNameValid = formData?.employeeName.trim() !== "" ? true : false;
    const isEmpoyeeIDValid = formData?.employeeId.trim() !== "" ? true : false;
    const isPhoneNumValid = phoneRegex.test(formData?.phoneNumber.trim());
    const isEmailValid = emailRegex.test(formData?.email.trim()); // Fixed validation

    // const isPasswordValid = employeepassword.trim() !== "" ? true : false;
    const isDateofJoinValid = employeeDateOfJoin !== null ? true : false;
    const ispassportNoValid = formData?.passportNo !== "" ? true : false;
    // // const isemployeeTypeValid = employeeType.trim() !== '' ? true :false;

    const ispanNumberValid = pancardRegex.test(formData?.panNo.trim());
    const isaadharNumberValid = aadharRegex.test(formData?.aadharNo);
    const isdobValid = employeeDob !== null ? true : false;

    const isuanNumber = formData?.uanNo.toString().trim() !== "" ? true : false;
    const ispfjoindateValid = pfJoinDate !== null ? true : false;
    const ispfExpdateValid = pfExpiryDate !== null ? true : false;
    // const ismaritalStatusValid = maritalStatus !== "" ? true : false;

    const isEmergencyNameValid =
      formData?.employeeName.trim() !== "" ? true : false;
    const isEmergencyContactValid = phoneRegex.test(
      formData?.emergencyContact?.contact
    );
    // const isRelationTypeValid = emergency_relationtype !== "" ? true : false;

    const isAccountNoValid = formData?.bank?.accountNo !== "" ? true : false;
    const isBankNameValid = selectedBankNameOption !== null ? true : false;

    const isIfscCodeValid =
      formData?.bank?.ifscCode.trim() !== "" ? true : false;
    const isbankBranchValid =
      formData.bank?.branch.trim() !== "" ? true : false;

    // const issalaryBasisValid = salary_basic.trim() !== "" ? true : false;
    const issalaryAmountValid = formData?.salaryAmount !== "" ? true : false;
    // const iseffectiveDateValid = effectivedate !== "" ? true : false;
    const ispaymentTypeValid = formData?.paymentType !== "" ? true : false;
    const isRelivingDateValid = employeestatus === "0" ? relivingdate !== null ? true : false : true;
    // const isselectedEmployeeOption =
    //   selectedEmployeeOption !== null ? true : false;
    // const isselectedRolesValid = selectedRoles.length > 0 ? true : false;
    // const isselectedDepartmentOptionValid =
    // selectedDepartmentOption !== null ? true : false;

    // //education info
    // const isSchoolNameValid = schoolName.trim() !== '' ? true : false;
    // const isDepartmentNameValid = departmentName.trim() !== '' ? true : false;
    // const isendYeadValid = endYear.trim() !== '' ? true : false;

    const isphotovalid = selectedImage !== null ? true : false;
    const touchedValues = {
      employeeId: isEmpoyeeIDValid,
      fullName: isFullNameValid,
      phoneNum: isPhoneNumValid,
      email: isEmailValid,
      // password: isPasswordValid,
      dateOfJoin: isDateofJoinValid,
      passportNo: true,
      panNo: true,
      aadharNo: true,
      dob: true,
      // MaritalStatus: ismaritalStatusValid,
      relivingdate:isRelivingDateValid,
      // SelectedPositiontype: isselectedRolesValid,
      uanNumber: true,
      pfJoinDate: true,
      pfExpiryDate: true,
      // Emergency
      emergencyName: true,
      emergencyContact: true,
      // emergencyRelationType: isRelationTypeValid,
      accountNumber: true,
      BankName: true,
      ifscCode: true,
      accountbranch: true,
      // SalaryBasis: issalaryBasisValid,
      salaryAmount: true,
      // EffectiveDate: iseffectiveDateValid,
      PaymentType: true,
      // SelectedEmployeeTypeOption: isselectedEmployeeOption,
      // SelectedRolestype: isselectedRolesValid,
      // SelectedDepartmentOption: isselectedDepartmentOptionValid,
      UploadPhoto: isphotovalid,
    };

    // Update touched state
    setTouched(touchedValues);

    // Check if all values are true
    const allValid = Object.values(touchedValues).every(
      (value) => value === true
    );

     if (!allValid) {
      setIsButtonLoading(false);
      setErrorMessage("Please fill all the fields.");
      return;
    }

    if (!isEmailValid) {
      setIsButtonLoading(false);
      setErrorMessage("Invalid email address.");
      return;
    }

   
    // If any field is invalid, return early
    

    try {
      // Assuming you're sending a PUT request to update the role

      console.log("employee details", formData);

      const updatedFormData = {
        ...formData,
        // employee_details: {
        // ...formData.employee_details,
        // position,
        reliving_date: relivingdate,
        // status: employeestatus,
        document: getuploadedDocuments,

        // },
      };

      console.log("updatedFormData:", updatedFormData);
      const educationData = formData;
      console.log(educationData.education);
      // educationData.education.length>0 ? educationData.education : [];
      //     setFormData({
      //        educationData
      //     })

      const response = await axios.put(
        `${API_URL}/api/employees/update-employee/${id}`,
        updatedFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("response", response);

      if (response.data) {
        setErrorMessage("");
        setSuccessMessage("Employee details updated successfully");
        // setTimeout(() => {
        //   navigate("/employees", { replace: true });
        // }, 1000);
        setTimeout(() => {
          setSuccessMessage("");
        }, 500);
      }
      setIsButtonLoading(false);
    } catch (error) {
      setIsButtonLoading(false);
      
      setSuccessMessage("");
       if (error.response && error.response.status) {
        console.log(error);
        

        setError(error.response.data.error || {});
      } else {
        console.error("An error occurred:", error.message);
       
      }
    }
  };

  // Function to handle file input change
  const handleImageChange = (event) => {
    const file = URL.createObjectURL(event.target.files[0]);
    if (file) {
      setSelectedImage(file);
      setFormData({
        ...formData, // Spread the existing formData

        photo: event.target.files[0],
      }); // Store the file itself
    }
  };

  useEffect(() => {
    if (
      addEducationalInfoModalOpen ||
      addWorkExperienceModalOpen ||
      addEmployeeDocumentsModalOpen
    ) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Clean up on component unmount
    return () => document.body.classList.remove("overflow-hidden");
  }, [
    addEducationalInfoModalOpen,
    addWorkExperienceModalOpen,
    addEmployeeDocumentsModalOpen,
  ]);

  // exit from
  // Duration options
  const durationOptions = ["1 months", "2 months", "3 months", "15days"];

  // Local states
  const [searchedDuration, setSearchedDuration] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [durationIsOpen, setDurationIsOpen] = useState(false);
  const [last_working_date, setLastWorkdate] = useState("");
  const [resignation_email_date, setRelieveemaildate] = useState("");
  console.log("resignation_email_date", resignation_email_date);

  // Filtered duration options for search
  const filteredDurationOptions = durationOptions.filter((option) =>
    option.toLowerCase().includes(searchedDuration.toLowerCase())
  );

  // Handle resignation email date
  const handlereievedate = (date) => {
    if (date) {
      const formattedDate = new Date(date).toISOString(); 

      setRelieveemaildate(formattedDate);

      setFormData((prevFormData) => ({
        ...prevFormData,
        resignation_email_date: formattedDate || "-",
      }));

      if (selectedDuration) {
        handleNoticePeriod(selectedDuration, formattedDate);
      }
    } else {
      setRelieveemaildate(null);
    }
  };

  // Handle last working date manually
const handleLastworkdate = (date) => {
  if (date) {
    const isoDate = new Date(date).toISOString(); 

    setLastWorkdate(isoDate);

    setFormData((prevFormData) => ({
      ...prevFormData,
      last_working_date: isoDate,
    }));
  } else {
    setLastWorkdate(null);
    setFormData((prevFormData) => ({
      ...prevFormData,
      last_working_date: "-",
    }));
  }
};


  // Handle notice period (supports months and days)
  const handleNoticePeriod = (option, baseDate) => {
    const resignationDate = baseDate || resignation_email_date;
    setSelectedDuration(option);
    setDurationIsOpen(false);

    // Update notice period in formData
    setFormData((prevFormData) => ({
      ...prevFormData,
      notice_period: option || "-",
    }));

    // Auto-calculate last working date if resignation date exists
    if (resignationDate) {
      const noticeStartDate = new Date(resignationDate);

      if (option.toLowerCase().includes("day")) {
        const daysToAdd = parseInt(option);
        if (!isNaN(daysToAdd)) {
          noticeStartDate.setDate(noticeStartDate.getDate() + daysToAdd);
        }
      } else if (option.toLowerCase().includes("month")) {
        const monthsToAdd = parseInt(option);
        if (!isNaN(monthsToAdd)) {
          noticeStartDate.setMonth(noticeStartDate.getMonth() + monthsToAdd);
        }
      }

      const formattedNoticeDate = noticeStartDate.toISOString().split("T")[0];
      setLastWorkdate(formattedNoticeDate);

      setFormData((prevFormData) => ({
        ...prevFormData,
        last_working_date: formattedNoticeDate || "-",
      }));

      console.log("Calculated Last Working Date:", formattedNoticeDate);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-gray-100 px-5 py-2 md:py-5">
      <Mobile_Sidebar />

      <div className="flex gap-2 mt-5 text-sm items-center">
        <p
          onClick={() => navigate("/employees")}
          className=" text-gray-500 cursor-pointer "
        >
          Employees
        </p>
        <p>{">"}</p>
        <p className=" text-blue-500 ">Edit Employees Details</p>
        <p>{">"}</p>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="">
          <div>
            <div className="flex flex-col sm:flex-row justify-between mt-5">
              <p className="text-xl md:text-3xl  font-semibold ">
                Edit Employee Details
              </p>

              {/* Heading */}
              <div className="flex justify-end gap-5 mt-3 md:mt-0 ">
                <button
                  onClick={onClickCreateEmployeeCancelButton}
                  className="bg-red-100  hover:bg-red-200  text-red-600 px-5 md:px-9 py-1 md:py-2 font-semibold rounded-full"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmit(employee_id)}
                  disabled={isButtonLoading}
                  className="bg-blue-600 text-white px-5 md:px-9 py-1 md:py-2 font-semibold rounded-full"
                >
                  <div className="w-12 h-6 flex items-center justify-center">
                    {isButtonLoading ? <Button_Loader /> : "Save"}
                  </div>
                </button>

                {/* <button
              onClick={handleSubmit}
              disabled={buttonLoading}
              className="bg-blue-600 text-white px-5 md:px-9 py-1 md:py-2 text-sm  md:text-base font-semibold rounded-full"
            >
              <div className="w-12 h-6 flex items-center justify-center">
                {buttonLoading ? <Button_Loader /> : "Save"}
              </div>
            </button> */}
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              {errorMessage ?? (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}
              {successMessage ?? (
                <p className="text-green-500 text-sm">{successMessage}</p>
              )}
            </div>

            {/*main flex */}
            <div className="flex flex-col  lg:flex-row gap-3 my-5">
              {/* leftside bar */}
              <div className="basis-[50vw] flex-grow flex flex-col gap-3 ">
                <div className="rounded-2xl border-2 border-gray-200 bg-white  py-4 px-4 lg:px-6">
                  <div className="flex items-center justify-between flex-wrap">
                    <p className="text-xl font-semibold">Basic Information</p>
                    <label
                      htmlFor="file"
                      className="text-xs text-end  md:text-sm mt-3 font-medium cursor-pointer"
                    >
                      {`${selectedImage ? "Change Photo" : "Upload Photo"}`}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    id="file"
                    type="file"
                    accept="image/*" // Allow only image files
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  {/* Display Selected Image */}
                  {selectedImage && (
                    <div className="mt-8 flex justify-center sm:justify-end">
                      <img
                        src={selectedImage}
                        alt="Selected"
                        onClick={() => setOpenImageModal(true)} // Open modal on click
                        className="w-36 h-32 object-fill cursor-pointer  rounded-md"
                      />
                    </div>
                  )}
                  <div className="flex justify-end">
                    {" "}
                    {!touched.UploadPhoto && (
                      <p className="text-red-400 text-sm">
                        Please choose a Profile Image.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 mt-4">
                    {/* name */}
                    <div className="flex flex-col xl:flex-row justify-between gap-1">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label
                          className="font-medium text-sm"
                          htmlFor="FULL NAME"
                          id="employee_name"
                          name="employee_name"
                          // value={employee_name}
                          // onChange={(e) => {
                          //   setEmployeeName(e.target.value);
                          // }}
                        >
                          FULL NAME <span className="text-red-500">*</span>
                        </label>
                        {/* <p className="text-sm">Add employee name</p> */}
                      </div>
                      <input
                        id="FULL NAME"
                        type="text"
                        placeholder="Employee Name"
                        value={formData?.employeeName || ""} // Display previous data
                        onChange={(e) =>
                          setFormData({
                            ...formData, // Spread the existing formData

                            employeeName: e.target.value, // Update only the employee_name field
                          })
                        }
                        className={`border-2 rounded-xl px-4 h-10 outline-none w-full  lg:w-72 ${
                          !touched.fullName
                            ? "border-red-400"
                            : "border-gray-300"
                        }`}
                        onKeyUp={handleKeyUp}
                      />
                    </div>
                    {/* Phone  */}
                    <div className="flex flex-col xl:flex-row justify-between gap-1">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label
                          className="font-medium text-sm"
                          htmlFor="PHONE NO & EMERGENCY"
                        >
                          PHONE NO <span className="text-red-500">*</span>
                        </label>
                        {/* <p className="text-sm">Contact number</p> */}
                      </div>
                      <div className="flex gap-1 w-full flex-col  lg:w-72">
                        <input
                          id="PHONE NO & EMERGENCY"
                          type="number"
                          value={formData?.phoneNumber || ""} // Display previous data
                          onChange={(e) =>
                            setFormData({
                              ...formData, // Spread the existing formData

                              phoneNumber: e.target.value, // Update only the employee_name field
                            })
                          }
                          placeholder="000-000-000"
                          className={`border-2 rounded-xl px-4 h-10 outline-none w-full lg:w-72 ${
                            !touched.phoneNum
                              ? "border-red-400"
                              : "border-gray-300"
                          }`}
                          onKeyUp={handleKeyUp}
                        />

                       {!touched.phoneNum && (
                      <p className="text-red-400 text-sm">
                        Phone Number must be 10 digits.
                      </p>
                    )}
                        {/* <input
                      type="number"
                      placeholder="000-000-000"
                      value={emergency_number}
                      onChange={(e) => {
                        setEmergenctNumber(e.target.value);
                      }}
                      className="border-2 h-10 rounded-xl px-4 border-gray-300 outline-none w-1/2"
                    /> */}
                      </div>
                    </div>
                    {/* Email Address */}
                    <div className="flex flex-col xl:flex-row justify-between gap-1">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label
                          className="font-medium text-sm"
                          htmlFor="EMAIL ADDRESS"
                        >
                          EMAIL ADDRESS <span className="text-red-500">*</span>
                        </label>
                        {error.email && (
                      <p className="text-red-500 text-sm">
                        {error.email}
                      </p>
                    )}
                      </div>
                      <input
                        id="EMAIL ADDRESS"
                        type="email"
                        
                        placeholder="@example.com"
                        value={formData?.email || ""} // Display previous data
                        onChange={(e) =>
                          setFormData({
                            ...formData, // Spread the existing formData

                            email: e.target.value, // Update only the employee_name field
                          })
                        }
                        className={`border-2 rounded-xl px-4 h-10 outline-none w-full lg:w-72 ${
                          !touched.email ? "border-red-400" : "border-gray-300"
                        }`}
                        onKeyUp={handleKeyUp}
                      />
                    </div>
                   

                    {/* create password */}
                    {/* <div className="flex flex-col xl:flex-row justify-between gap-1">
                    <div className="flex flex-col w-full sm:w-auto">
                      <label
                        className="font-medium text-sm"
                        htmlFor="CREATE PASSWORD"
                      >
                        CREATE PASSWORD
                      </label>
                      <p className="text-sm">Add employee password</p>
                    </div>
                    <div className="relative w-full lg:w-72">
                      <input
                        id="CREATE PASSWORD"
                        value={formData?.employee_details?.password || ""} // Display previous data
                        onChange={(e) =>
                          setFormData({
                            ...formData, // Spread the existing formData
                            employee_details: {
                              ...formData.employee_details, // Spread the existing employee_details
                              password: e.target.value, // Update only the employee_name field
                            },
                          })
                        }
                        type={showPassword ? "text" : "password"}
                        placeholder="#@ABCaba1214"
                        className={`border-2 h-10 rounded-xl px-4 border-gray-300 outline-none w-full pr-10 
                        ${!touched.password
                            ? "border-red-400"
                            : "border-gray-300"
                          }`}
                        onKeyUp={handleKeyUp}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                      </button>
                    </div>
                  </div> */}

                    <div className="flex flex-col xl:flex-row justify-between gap-1">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label className="font-medium text-sm">
                          Employe Type <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="relative w-full lg:w-72">
                        <select
                          name=""
                          id=""
                          className="w-full py-2 px-5 text-left border-2 border-gray-300 rounded-xl shadow-sm flex justify-between items-center cursor-pointer"
                          value={formData.employeeType}
                          onChange={(e) => {
                            setEmployeeWorkType(e.target.value);
                            setFormData({
                              ...formData,
                              employeeType: e.target.value,
                            });
                          }}
                        >
                          <option value="" selected disabled>
                            Choose Type
                          </option>
                          <option value="Intern">Intern</option>
                          <option value="Full Time">Full Time</option>
                          <option value="Part Time">Part Time</option>
                          <option value="Part Time">Freelancer</option>
                        </select>
                      </div>
                    </div>

           
                {formData.employeeType === "Intern" && (
                  <div className="flex flex-col xl:flex-row justify-between gap-1">
                    <div className="flex flex-col w-full sm:w-auto">
                      <label className="font-medium text-sm uppercase">
                        Intership Duration
                        <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <select
                      className={`lg:w-72 py-2 px-5 text-left border-2 border-gray-300 rounded-xl shadow-sm flex justify-between items-center cursor-pointer
                        `}
                      value={formData.internDuration}
                       onChange={(e) => {
                            setInternMonths(e.target.value);
                            setFormData({
                              ...formData,
                              internDuration: e.target.value,
                            });
                          }}
                    >
                      <option value="" disabled>
                        Choose Duration
                      </option>
                      {[...Array(7)].map((_, i) => (
                        <option key={i + 1} value={`${i + 1} Month`}>
                          {i + 1} Month{i + 1 > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                )}


                    {/* Employee Type */}

                    {/* position */}
                    {/* <div className="flex flex-col xl:flex-row justify-between gap-1">
                    <div className="flex flex-col w-full sm:w-auto">
                      <label
                        className="font-medium text-sm"
                        onClick={() => {
                          setPositionIsOpen(!positionIsOpen);
                          setDepartmentIsOpen(false);
                          setEmployeeTypeIsOpen(false);
                          setTouched({
                            ...touched,
                            SelectedPositiontype: true,
                          });
                        }}
                      >
                        POSITION
                      </label>
                      <p className="text-sm">Choose position</p>
                    </div>

                    <div
                      className={`relative border-2 rounded-xl px-4  outline-none w-full  lg:w-72 ${!touched.SelectedPositiontype
                        ? "border-red-400"
                        : "border-gray-300"
                        }`}
                      onKeyUp={handleKeyUp}
                    >
                      <button
                        onClick={() => {
                          setPositionIsOpen(!positionIsOpen);
                          setDepartmentIsOpen(false);
                          setEmployeeTypeIsOpen(false);
                          setTouched({
                            ...touched,
                            SelectedPositiontype: true,
                          });
                        }}
                        className={`w-full ${selectedPosition.name ? "text-black" : "text-gray-400"
                          } py-2 text-left bg-white rounded-lg shadow-sm focus:outline-none flex justify-between items-center`}
                      >
                        {capitalizeFirstLetter(selectedPosition.name) ||
                          "Choose position"}
                      </button>

                      {positionIsOpen && (
                        <div className="absolute left-0 z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                          <input
                            type="text"
                            value={searchedPosition}
                            onChange={(e) =>
                              setSearchedPosition(e.target.value)
                            }
                            placeholder="Search..."
                            className="w-full px-4 py-2 border-b border-gray-200 focus:outline-none"
                          />
                          <ul className="max-h-48 overflow-y-auto">
                            {filteredPositionOptions.length > 0 ? (
                              filteredPositionOptions.map((role) => (
                                <li
                                  key={role.id}
                                  onClick={() => {
                                    setSelectedPosition({
                                      id: role.id,
                                      name: role.name,
                                    });
                                    setPositionIsOpen(false);
                                    setFormData({
                                      ...formData,
                                      employee_details: {
                                        ...formData.employee_details,
                                        position: role.id,
                                      },
                                    });
                                  }}
                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                >
                                  {capitalizeFirstLetter(role.name)}
                                </li>
                              ))
                            ) : (
                              <li className="px-4 py-2 text-gray-500">
                                No results found
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div> */}

                    <div className="flex flex-col xl:flex-row justify-between gap-1">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label
                          className="font-medium text-sm"
                          onClick={() => {
                            setPositionIsOpen(!positionIsOpen);
                            setDepartmentIsOpen(false);
                            setEmployeeTypeIsOpen(false);
                            setTouched({
                              ...touched,
                              SelectedPositiontype: true,
                            });
                          }}
                        >
                          ROLES <span className="text-red-500">*</span>
                        </label>
                      </div>

                      <div
                        className={`relative border-2 rounded-xl px-3 outline-none w-full lg:w-72 border-gray-300`}
                        ref={roleDropdownRef}
                      >
                        <button
                          onClick={() => {
                            setPositionIsOpen(!positionIsOpen);
                            setDepartmentIsOpen(false);
                            setEmployeeTypeIsOpen(false);
                            setTouched({
                              ...touched,
                              SelectedPositiontype: true,
                            });
                          }}
                          className="w-full text-black py-2 text-left bg-white rounded-lg shadow-sm focus:outline-none flex justify-between items-center"
                        >
                          {selectedPosition?.name
                            ? capitalizeFirstLetter(selectedPosition.name)
                            : "Choose Position"}

                          {positionIsOpen ? (
                            <IoIosArrowUp className="text-black" />
                          ) : (
                            <IoIosArrowDown className="text-black" />
                          )}
                        </button>

                        {positionIsOpen && (
                          <div className="absolute left-0 z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                            {/* <input
          type="text"
          value={searchedPosition}
          onChange={(e) => setSearchedPosition(e.target.value)}
          placeholder="Search..."
          className="w-full px-4 py-2 border-b border-gray-200 focus:outline-none"
        /> */}
                            <ul className="max-h-48 overflow-y-auto">
                              {filteredPositionOptions.length > 0 ? (
                                filteredPositionOptions.map((role) => (
                                  <li
                                    key={role._id}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => {
                                      setSelectedPosition({
                                        id: role._id,
                                        name: role.name,
                                      });
                                      setFormData({
                                        ...formData, // Spread the existing formData
                                        roleId: role._id,
                                      });

                                      setPositionIsOpen(false);
                                    }}
                                  >
                                    {capitalizeFirstLetter(role.name)}
                                  </li>
                                ))
                              ) : (
                                <li className="px-4 py-2 text-gray-500">
                                  No results found
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Department */}
                    {/* <div className="flex flex-col xl:flex-row justify-between gap-1">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label
                          className="font-medium text-sm"
                          onClick={() => setDepartmentIsOpen(!departmentIsOpen)}
                        >
                          DEPARTMENT
                        </label>
                      
                      </div>

                      <div
                        className={`relative border-2 rounded-xl px-4 border-gray-300 outline-none w-full  lg:w-72 ${
                          !touched.SelectedDepartmentOption
                            ? "border-red-400"
                            : "border-gray-300"
                        }`}
                      >
                        <button
                          onClick={() => setDepartmentIsOpen(!departmentIsOpen)}
                          className={`w-full ${
                            selectedDepartmentOption
                              ? "text-black"
                              : "text-gray-400"
                          } py-2 text-left bg-white rounded-lg shadow-sm focus:outline-none`}
                        >
                          {selectedDepartmentOption || "Choose department"}
                        </button>

                        {departmentIsOpen && (
                          <div className="absolute left-0 z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                            <input
                              type="text"
                              value={searchedDepartment}
                              onChange={(e) =>
                                setSearchedDepartment(e.target.value)
                              }
                              placeholder="Search..."
                              className="w-full px-4 py-2 border-b border-gray-200 focus:outline-none"
                            />
                            <ul className="max-h-48 overflow-y-auto">
                              {filteredDepartmentOptions.length > 0 ? (
                                filteredDepartmentOptions.map(
                                  (option, index) => (
                                    <li
                                      key={index}
                                      onClick={() => {
                                        setSelectedDepartmentOption(option);
                                        setDepartmentIsOpen(false);
                                        setFormData({
                                          ...formData,
                                          employee_details: {
                                            ...formData.employee_details,
                                            department: option,
                                          },
                                        });
                                      }}
                                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    >
                                      {option}
                                    </li>
                                  )
                                )
                              ) : (
                                <li className="px-4 py-2 text-gray-500">
                                  No results found
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div> */}

                    {/* Date of Joining */}
                    <div className="flex flex-col xl:flex-row justify-between gap-1">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label
                          className="font-medium text-sm"
                          htmlFor="DATE OF JOINING"
                        >
                          DATE OF JOINING{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        {/* <p className="text-sm">employee's date of join</p> */}
                      </div>

                      <div className="relative">
                        <DatePicker
                          id="DATE OF JOINING"
                          placeholderText="Choose the employee date of join"
                          className={`border-2 rounded-xl h-10 px-4  outline-none w-full lg:w-72 ${
                            !touched.dateOfJoin
                              ? "border-red-400"
                              : "border-gray-300"
                          }`}
                          onKeyUp={handleKeyUp}
                          selected={employeeDateOfJoin}
                          onChange={handleDateChange}
                          //value={formData?.employee_details?.date_of_joining || ""} // Display previous data

                          // onChange={(e) =>
                          //   setFormData({
                          //     ...formData, // Spread the existing formData
                          //     employee_details: {
                          //       ...formData.employee_details, // Spread the existing employee_details
                          //       email_address : e.target.value, // Update only the employee_name field
                          //     },
                          //   })
                          // }
                          //dateFormat="MM/dd/yyyy"
                        />
                      </div>
                    </div>

                    {/* employeeid */}
                    <div className="flex flex-col xl:flex-row justify-between gap-1">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label
                          className="font-medium text-sm"
                          htmlFor="Employee ID"
                          id="employeeid"
                          name="employeeid"
                        >
                          EMPLOYEE ID <span className="text-red-500">*</span>
                        </label>
                        {/* <p className="text-sm">Add employee id</p> */}
                      </div>
                      <input
                        id="Employee ID"
                        type="text"
                        placeholder="Employee Id"
                        // disabled
                        value={formData?.employeeId || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            employeeId: e.target.value,
                          })
                        }
                        className={`border-2 rounded-xl px-4 h-10 outline-none w-full  lg:w-72 ${
                          !touched.employeeId
                            ? "border-red-400"
                            : "border-gray-300"
                        }`}
                        onKeyUp={handleKeyUp}
                      />
                    </div>

                     {/* Github Email Address */}
                    <div className="flex flex-col xl:flex-row justify-between gap-1">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label
                          className="font-medium text-sm"
                          htmlFor="githubEmail"
                          id="githubEmail"
                          name="githubEmail"
                        >
                          GITHUB EMAIL ADDRESS 
                        </label>
                        {/* <p className="text-sm">Add employee id</p> */}
                      </div>
                      <input
                        id="githubEmail"
                        type="text"
                        placeholder="Github Email Address"
                        // disabled
                        value={formData?.gitHubEmail || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gitHubEmail: e.target.value,
                          })
                        }
                        className={`border-2 rounded-xl px-4 h-10 outline-none w-full  lg:w-72 ${
                          !touched.employeeId
                            ? "border-red-400"
                            : "border-gray-300"
                        }`}
                        onKeyUp={handleKeyUp}
                      />
                    </div>

                    {/* employee status */}
                    <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                      <div className="flex flex-col">
                        <label className="font-medium text-sm">
                          EMPLOYEE STATUS
                        </label>
                        {/* <p className="text-sm">Employee Status</p> */}
                      </div>

                      <select
                        className="border-2 rounded-xl px-4 h-10 outline-none w-full  lg:w-72"
                        value={employeestatus}
                        onChange={handleEmployeeStatus}
                      >
                        <option value="" disabled>
                          Employee Status
                        </option>
                        <option value="1">On Duty</option>
                        <option value="0">Reliving</option>
                      </select>
                    </div>

                    {employeestatus === "0" && (
                      <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                        <div className="flex flex-col ">
                          <label className="font-medium text-sm">
                            RELIVING DATE
                          </label>
                          {/* <p className="text-sm">Reliving Date</p> */}
                        </div>
                        <div>
                          <DatePicker
                            id="Reliving date"
                            placeholderText="employee date of reliving"
                            className={`border-2 rounded-xl h-10 px-4  outline-none w-full lg:w-72 ${
                              !touched.relivingdate
                                ? "border-red-400"
                                : "border-gray-300"
                            }`}
                            onKeyUp={handleKeyUp}
                            selected={relivingdate}
                            onChange={handleRelivingDateChange}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <hr className="my-5" />

                  <p className="text-xl font-semibold">Personal Info</p>

                  <div className="flex flex-col gap-4 mt-4" id="personal-info">
                     {/* Gender*/}
                    <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                      <div className="flex flex-col">
                        <label className="font-medium text-sm">
                         GENDER
                        </label>
                        {/* <p className="text-sm">Employee Status</p> */}
                      </div>

                      <select
                        className="border-2 rounded-xl px-4 h-10 outline-none w-full  lg:w-72"
                       value={formData?.gender || ""} // Display previous data
                        onChange={(e) =>
                          setFormData({
                            ...formData, // Spread the existing formData

                            gender: e.target.value, // Update only the employee_name field
                          })
                        }
                      >
                        <option value="" disabled>
                          Gender
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    {/* Passport No. */}
                    <div className="flex flex-col xl:flex-row justify-between gap-1">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label
                          className="font-medium text-sm"
                          htmlFor="PASSPORT NO."
                        >
                          PASSPORT NO
                        </label>
                        {/* <p className="text-sm">Add passport No.</p> */}
                      </div>
                      <input
                        id="PASSPORT NO."
                        type="text"
                        placeholder="Passport No."
                        value={formData?.passportNo || ""} // Display previous data
                        onChange={(e) =>
                          setFormData({
                            ...formData, // Spread the existing formData

                            passportNo: e.target.value, // Update only the passport_no field
                          })
                        }
                        className={`border-2 h-10 rounded-xl px-4  outline-none w-full  lg:w-72 ${
                          !touched.passportNo
                            ? "border-red-400"
                            : "border-gray-300"
                        }`}
                        onKeyUp={handleKeyUp}
                      />
                    </div>

                     {/* Personal email id */}
                    <div className="flex flex-col xl:flex-row justify-between gap-1">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label
                          className="font-medium text-sm"
                          htmlFor="empEmail"
                        >
                          EMAIL ADDRESS
                        </label>
                        {/* <p className="text-sm">Add passport No.</p> */}
                      </div>
                      <input
                        id="empEmail"
                        type="email"
                        placeholder="Employee Personal Email"
                        value={formData?.personalEmail || ""} // Display previous data
                        onChange={(e) =>
                          setFormData({
                            ...formData, // Spread the existing formData

                            personalEmail: e.target.value, // Update only the passport_no field
                          })
                        }
                        className={`border-2 h-10 rounded-xl px-4  outline-none w-full  lg:w-72 ${
                          !touched.passportNo
                            ? "border-red-400"
                            : "border-gray-300"
                        }`}
                        onKeyUp={handleKeyUp}
                      />
                    </div>



                    {/*pan no */}
                    <div className="flex flex-col xl:flex-row justify-between gap-1">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label
                          className="font-medium text-sm"
                          htmlFor="PASSPORT EXP DATE"
                        >
                          PAN NO
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          className={`border-2 rounded-xl [&::-webkit-inner-spin-button]:appearance-none h-10 px-4 border-gray-300 outline-none w-full lg:w-72  ${
                            !touched.panNo
                              ? "border-red-400"
                              : "border-gray-300"
                          }`}
                          onKeyUp={handleKeyUp}
                          placeholder="Pan Number"
                          value={formData?.panNo || ""} // Display previous data
                          onChange={(e) =>
                            setFormData({
                              ...formData, // Spread the existing formData

                              panNo: e.target.value, // Update only the passport_no field
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Aadhar No */}
                    <div className="flex flex-col xl:flex-row justify-between gap-1">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label
                          className="font-medium text-sm"
                          htmlFor="AADHAR NO"
                        >
                          AADHAR NO
                        </label>
                        {/* <p className="text-sm">Add Aadhar No</p> */}
                      </div>
                      <input
                        id="AADHAR NO"
                        type="number"
                        placeholder="Aadhar No"
                        value={formData?.aadharNo || ""} // Display previous data
                        onChange={(e) =>
                          setFormData({
                            ...formData, // Spread the existing formData

                            aadharNo: e.target.value, // Update only the passport_no field
                          })
                        }
                        onKeyUp={handleKeyUp}
                        className={`border-2 h-10 [&::-webkit-inner-spin-button]:appearance-none rounded-xl px-4 border-gray-300 outline-none w-full  lg:w-72  ${
                          !touched.aadharNo
                            ? "border-red-400"
                            : "border-gray-300"
                        }`}
                      />
                    </div>

                    {/* Date of Birth */}
                    <div className="flex flex-col xl:flex-row justify-between gap-1">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label
                          className="font-medium text-sm"
                          htmlFor="DATE OF BIRTH"
                        >
                          DATE OF BIRTH
                        </label>
                        {/* <p className="text-sm">Choose employee's DOB</p> */}
                      </div>
                      <div className="relative">
                        <DatePicker
                          id="DATE OF BIRTH"
                          placeholderText="Date Of Birth"
                          className={`border-2 rounded-xl h-10 px-4 border-gray-300 outline-none w-full lg:w-72 ${
                            !touched.dob ? "border-red-400" : "border-gray-300"
                          }`}
                          onKeyUp={handleKeyUp}
                          selected={employeeDob}
                          onChange={handleDateofBirth}
                          // dateFormat="MM/dd/yyyy"
                        />
                      </div>
                    </div>
                    {error.date_of_birth && (
                      <p className="text-red-500 text-sm mt-2">
                        {error.date_of_birth[0]}
                      </p>
                    )}

                    {/* father name */}
                    <div className="flex flex-col xl:flex-row justify-between gap-1">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label
                          className="font-medium text-sm"
                          htmlFor="PASSPORT EXP DATE"
                        >
                          FATHER NAME
                        </label>
                        {/* <p className="text-sm">Add Pan No</p> */}
                      </div>
                      <div className="flex flex-col gap-1">
                        <input
                          type="text"
                          className={`border-2 rounded-xl h-10 px-4 border-gray-300  w-full lg:w-72 `}
                          value={formData?.fatherName || ""} // Display previous data
                          onChange={(e) =>
                            setFormData({
                              ...formData, // Spread the existing formData

                              fatherName: e.target.value, // Update only the passport_no field
                            })
                          }
                          onKeyUp={handleKeyUp}
                          placeholder="Father name"
                        />
                      </div>
                    </div>

                    {/* mother name */}

                    <div className="flex flex-col xl:flex-row justify-between gap-1">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label
                          className="font-medium text-sm"
                          htmlFor="PASSPORT EXP DATE"
                        >
                          MOTHER NAME
                        </label>
                        {/* <p className="text-sm">Add Pan No</p> */}
                      </div>
                      <div className="flex flex-col gap-1">
                        <input
                          type="text"
                          className={`border-2 rounded-xl h-10 px-4 border-gray-300  w-full lg:w-72  `}
                          onKeyUp={handleKeyUp}
                          placeholder="Mother name"
                          value={formData?.motherName || ""} // Display previous data
                          onChange={(e) =>
                            setFormData({
                              ...formData, // Spread the existing formData

                              motherName: e.target.value, // Update only the passport_no field
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* address1 */}

                    <div className="flex flex-col xl:flex-row justify-between gap-1">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label
                          className="font-medium text-sm"
                          htmlFor="PASSPORT EXP DATE"
                        >
                          ADDRESS 1
                        </label>
                        {/* <p className="text-sm">Add Pan No</p> */}
                      </div>
                      <div className="flex flex-col gap-1">
                        <input
                          type="text"
                          className={`border-2 rounded-xl h-10 px-4 border-gray-300  w-full lg:w-72  `}
                          onKeyUp={handleKeyUp}
                          placeholder="Enter Address"
                          value={formData?.address1 || ""} // Display previous data
                          onChange={(e) =>
                            setFormData({
                              ...formData, // Spread the existing formData

                              address1: e.target.value, // Update only the passport_no field
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* address2 */}

                    <div className="flex flex-col xl:flex-row justify-between gap-1">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label
                          className="font-medium text-sm"
                          htmlFor="PASSPORT EXP DATE"
                        >
                          ADDRESS 2
                        </label>
                        {/* <p className="text-sm">Add Pan No</p> */}
                      </div>
                      <div className="flex flex-col gap-1">
                        <input
                          type="text"
                          className={`border-2 rounded-xl h-10 px-4 border-gray-300  w-full lg:w-72 `}
                          onKeyUp={handleKeyUp}
                          placeholder="Enter Address"
                          value={formData?.address2 || ""} // Display previous data
                          onChange={(e) =>
                            setFormData({
                              ...formData, // Spread the existing formData

                              address2: e.target.value, // Update only the passport_no field
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex flex-col justify-between xl:flex-row relative">
                      <div className="flex flex-col  w-full sm:w-auto">
                        <label className="font-medium text-sm">
                          MARITAL STATUS
                        </label>
                        {/* <p className="text-sm">Choose option </p> */}
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="marital_status"
                            id="Single"
                            value="Single"
                            checked={maritalStatus === "Single"}
                            onChange={(e) => {
                              setMaritalStatus(e.target.value);
                              setFormData({
                                ...formData, // Spread the existing formData

                                maritalStatus: e.target.value, // Update only the passport_no field
                              });
                            }}
                          />
                          <label
                            htmlFor="Single"
                            className="tex-sm font-medium"
                          >
                            Single
                          </label>
                        </div>

                        <div className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="marital_status"
                            id="Married"
                            value="Married"
                            checked={maritalStatus === "Married"}
                            onChange={(e) => {
                              setMaritalStatus(e.target.value);
                              setFormData({
                                ...formData, // Spread the existing formData

                                maritalStatus: e.target.value,
                              });
                            }}
                          />
                          <label
                            htmlFor="Married"
                            className="tex-sm font-medium"
                          >
                            Married
                          </label>
                        </div>

                        {/* <div className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="marital_status"
                            id="Divorced"
                            value="Divorced"
                            checked={maritalStatus === "Divorced"}
                            onChange={(e) => {
                              setMaritalStatus(e.target.value);
                              setFormData({
                                ...formData, // Spread the existing formData
                                employee_details: {
                                  ...formData.employee_details, // Spread the existing employee_details
                                  personal_info: {
                                    ...formData.employee_details.personal_info, // Spread the existing personal_info
                                    marital_status: e.target.value, // Update only the passport_no field
                                  },
                                },
                              });
                            }}
                          />
                          <label
                            htmlFor="Divorced"
                            className="tex-sm font-medium"
                          >
                            Divorced
                          </label>
                        </div> */}
                      </div>
                      {/* <div className=" absolute right-16 top-6 p-2">
                        {!touched.MaritalStatus && (
                          <p className="text-red-400 text-sm">
                            Please Choose Marital Status.
                          </p>
                        )}
                      </div> */}
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 lg:px-6 "
                  id="pf-info"
                >
                  <p className="text-xl font-semibold ">PF Info</p>

                  <div className="flex flex-col gap-4 mt-4">
                    <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                      <div className="flex flex-col">
                        <label className="font-medium text-sm" htmlFor="UAN NO">
                          UAN NO
                        </label>
                        {/* <p className="text-sm">Add UAN NO.</p> */}
                      </div>

                      <input
                        id="UAN NO"
                        type="number"
                        placeholder="UAN No"
                        value={formData?.uanNo || ""} // Display previous data
                        onChange={(e) =>
                          setFormData({
                            ...formData, // Spread the existing formData

                            uanNo: e.target.value, // Update only the passport_no field
                          })
                        }
                        className={`border-2 rounded-xl [&::-webkit-inner-spin-button]:appearance-none px-4 h-10  outline-none w-full  lg:w-72 border-gray-300`}
                        onKeyUp={handleKeyUp}
                      />
                    </div>
                    {error.uan_number && (
                      <p className="text-red-500 text-sm mt-2">
                        {error.uan_number[0]}
                      </p>
                    )}
                    <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                      <div className="flex flex-col">
                        <label
                          className="font-medium text-sm"
                          htmlFor="PF JOIN DATE"
                        >
                          PF JOIN DATE
                        </label>
                      </div>
                      <div className="relative">
                        <DatePicker
                          id="PF JOIN DATE"
                          placeholderText="PF Join Date"
                          className={`border-2 rounded-xl h-10 px-4  outline-none w-full lg:w-72 border-gray-300`}
                          onKeyUp={handleKeyUp}
                          selected={pfJoinDate}
                          onChange={handlePfJoinDate}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                      <div className="flex flex-col">
                        <label
                          className="font-medium text-sm"
                          htmlFor="PF EXP DATE"
                        >
                          PF EXP DATE
                        </label>
                      </div>

                      <div className="relative">
                        <DatePicker
                          id="PF EXP DATE"
                          placeholderText="PF  Exp Date"
                          className={`border-2 rounded-xl h-10 px-4  outline-none w-full lg:w-72 border-gray-300`}
                          onKeyUp={handleKeyUp}
                          selected={pfExpiryDate}
                          onChange={handlePfExpDate}
                          minDate={pfJoinDate}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-2xl border-2 border-gray-200 bg-white px-5 lg:px-3 py-4"
                  id="emergencycontact"
                >
                  <p className="text-xl font-semibold">Emergency Contact</p>

                  <div className="flex flex-col gap-4 mt-4">
                    <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                      <div className="flex flex-col">
                        <label
                          className="font-medium text-sm"
                          htmlFor="INSURANCE NO"
                        >
                          FULL NAME
                        </label>
                        {/* <p className="text-sm">Add UAN NO.</p> */}
                      </div>
                      <input
                        id="INSURANCE NO"
                        type="text"
                        placeholder="Full name"
                        value={formData?.emergencyContact?.fullName || ""} // Display previous data
                        onChange={(e) =>
                          setFormData({
                            ...formData, // Spread the existing formData
                            emergencyContact: {
                              ...formData.emergencyContact, // Spread the existing employee_details
                              fullName: e.target.value, // Update only the passport_no field
                            },
                          })
                        }
                        className={`border-2 rounded-xl px-4  outline-none h-10 w-full  lg:w-72 ${
                          !touched.emergencyName
                            ? "border-red-400 "
                            : "border-gray-300"
                        }`}
                        onKeyUp={handleKeyUp}
                      />
                    </div>

                    {/* {error.insurance_number && (
                  <p className="text-red-500 text-sm mt-2">{error.insurance_number[0]}</p>
                )} */}

                    <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                      <div className="flex flex-col">
                        <label
                          className="font-medium text-sm"
                          htmlFor="NOMINEE NAME"
                        >
                          CONTACT
                        </label>
                        {/* <p className="text-sm">Nominal Name</p> */}
                      </div>
                      <div className="flex flex-col">
                        <input
                          id="NOMINEE NAME"
                          type="number"
                          placeholder="Contact Number"
                          value={formData?.emergencyContact?.contact || ""} // Display previous data
                          onChange={(e) =>
                            setFormData({
                              ...formData, // Spread the existing formData
                              emergencyContact: {
                                ...formData.emergencyContact, // Spread the existing employee_details
                                contact: e.target.value, // Update only the passport_no field
                              },
                            })
                          }
                          className={`border-2 rounded-xl px-4 border-gray-300 outline-none h-10 w-full  lg:w-72 ${
                            !touched.emergencyContact
                              ? "border-red-400 "
                              : "border-gray-300"
                          }`}
                          onKeyUp={handleKeyUp}
                        />
                        {error.emergency_contact && (
                          <p className="text-red-500 text-xs">
                            {error.emergency_contact[0]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col xl:flex-row gap-1 justify-between   relative pb-2">
                      <div className="flex flex-row justify-between w-full flex-wrap gap-1">
                        <label className="font-medium text-sm">
                          RELATION TYPE
                        </label>

                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                          <div className="flex items-center gap-1">
                            <input
                              type="radio"
                              name="RELATION"
                              id="Father"
                              value="Father"
                              checked={emergency_relationtype === "Father"}
                              onChange={(e) => {
                                setRelationType(e.target.value);
                                setFormData({
                                  ...formData, // Spread the existing formData
                                  emergencyContact: {
                                    ...formData.emergencyContact, // Spread the existing employee_details
                                    relation: e.target.value, // Update only the passport_no field
                                  },
                                });
                              }}
                            />
                            <label
                              htmlFor="Father"
                              className="tex-sm font-medium"
                            >
                              Father
                            </label>
                          </div>

                          <div className="flex items-center gap-1">
                            <input
                              type="radio"
                              name="RELATION"
                              id="Mother"
                              value="Mother"
                              checked={emergency_relationtype === "Mother"}
                              onChange={(e) => {
                                setRelationType(e.target.value);
                                setFormData({
                                  ...formData, // Spread the existing formData
                                  emergencyContact: {
                                    ...formData.emergencyContact, // Spread the existing employee_details
                                    relation: e.target.value, // Update only the passport_no field
                                  },
                                });
                              }}
                            />
                            <label
                              htmlFor="Mother"
                              className="tex-sm font-medium"
                            >
                              Mother
                            </label>
                          </div>

                          <div className="flex items-center gap-1">
                            <input
                              type="radio"
                              name="RELATION"
                              id="Friend"
                              value="Friend"
                              checked={emergency_relationtype === "Friend"}
                              onChange={(e) => {
                                setRelationType(e.target.value);
                                setFormData({
                                  ...formData, // Spread the existing formData
                                  emergencyContact: {
                                    ...formData.emergencyContact, // Spread the existing employee_details
                                    relation: e.target.value, // Update only the passport_no field
                                  },
                                });
                              }}
                            />
                            <label
                              htmlFor="Friend"
                              className="tex-sm font-medium"
                            >
                              Friend
                            </label>
                          </div>
                          <div className="flex items-center gap-1">
                            <input
                              type="radio"
                              name="RELATION"
                              id="Sibling"
                              value="Sibling"
                              checked={emergency_relationtype === "Sibling"}
                              onChange={(e) => {
                                setRelationType(e.target.value);
                                setFormData({
                                  ...formData, // Spread the existing formData
                                  emergencyContact: {
                                    ...formData.emergencyContact, // Spread the existing employee_details
                                    relation: e.target.value, // Update only the passport_no field
                                  },
                                });
                              }}
                            />
                            <label
                              htmlFor="Sibling"
                              className="tex-sm font-medium"
                            >
                              Sibling
                            </label>
                          </div>
                        </div>

                        {/* <p className="text-sm">Add Aadar</p> */}
                      </div>
                      {/* <div className=" absolute right-20 -bottom-6 p-2">
                        {!touched.emergencyRelationType && (
                          <p className="text-red-400 text-sm">
                            Please Choose Relation Type.
                          </p>
                        )}
                      </div> */}
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-2xl border-2 border-gray-200 bg-white px-5 lg:px-3 py-4"
                  id="educations"
                >
                  <p className="text-xl font-semibold">Education Info</p>

                  {/* List Education Info */}
                  <div className="mt-5">
                    {educationInfo?.map((info, index) => (
                      <div key={index} className="flex justify-between">
                        <div className="w-[90%] px-2 gap-2 flex flex-col ">
                          <div className="flex gap-1 flex-wrap items-center justify-between ">
                            <h1 className="text-sm ">Institute Name</h1>
                            <p className="text-sm font-medium ">
                              {info.schoolName ?? info.school_name}
                            </p>
                          </div>

                          <div className="flex gap-1 flex-wrap items-center justify-between">
                            <h1 className="text-sm ">Department Name</h1>
                            <p className="text-sm font-medium ">
                              {info.departmentName ?? info.department_name}
                            </p>
                          </div>

                          <div className="flex gap-1 flex-wrap items-center justify-between">
                            <h1 className="text-sm ">End Year</h1>
                            <p className="text-sm font-medium">
                              {info.endYear ?? info.period_of_end}
                            </p>
                          </div>

                          <hr className="my-3 w-full" />
                        </div>
                        <IoClose
                          onClick={() => onClickEducationInfoDelete(index)}
                          className="ms-12 text-red-500 text-2xl cursor-pointer "
                        />
                      </div>
                    ))}
                  </div>
                  <div
                    onClick={openAddEducationInfoModal}
                    className="flex items-center gap-4 mt-5 cursor-pointer"
                  >
                    <IoAddCircleSharp className="text-blue-500 text-3xl" />
                    <p className="font-medium">Add education info</p>
                  </div>
                </div>
              </div>

              {/* rightside bar */}
              <div className=" flex flex-grow basis-[30vw]  flex-col gap-3 ">
                <div
                  className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 lg:px-6"
                  id="bank-information"
                >
                  <p className="text-xl font-semibold">Bank information</p>

                  <div className="flex flex-col gap-3 mt-4">
                    <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                      <div className="flex flex-col">
                        <label
                          className="font-medium text-sm"
                          htmlFor="BANK ACCOUNT NO"
                        >
                          BANK ACCOUNT NO
                        </label>
                        {/* <p className="text-sm">Bank account NO.</p> */}
                      </div>
                      <div className="flex flex-col justify-end">
                        <input
                          id="BANK ACCOUNT NO"
                          type="number"
                          placeholder="Enter acc number"
                          value={formData?.bank?.accountNo || ""} // Display previous data
                          onChange={(e) =>
                            setFormData({
                              ...formData, // Spread the existing formData

                              bank: {
                                ...formData.bank, // Spread the existing personal_info
                                accountNo: e.target.value, // Update only the passport_no field
                              },
                            })
                          }
                          className={`border-2 h-10 lg:w-52 rounded-xl px-4 border-gray-300 outline-none w-full   ${
                            !touched.accountNumber
                              ? "border-red-400 "
                              : "border-gray-300"
                          }`}
                          onKeyUp={handleKeyUp}
                        />
                        {error.bank_account_no && (
                          <p className="text-red-500 text-xs ">
                            {error.bank_account_no[0]}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* gpay or phonepay */}

                    <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                      <div className="flex flex-col">
                        <label
                          className="font-medium text-sm text-transform: uppercase"
                          htmlFor="BANK gpay NO"
                        >
                          Gpay / phone pay number
                        </label>
                        {/* <p className="text-sm">Bank gpay NO.</p> */}
                      </div>
                      <div className="flex flex-col justify-end">
                        <input
                          id="BANK gpay NO"
                          type="number"
                          placeholder="Enter  number"
                          value={formData?.bank?.gpayNumber || ""}
                          onChange={(e) => {
                            // setGp(e.target.value);
                            setFormData({
                              ...formData, // Spread the existing formData

                              bank: {
                                ...formData.bank, // Spread the existing personal_info
                                gpayNumber: e.target.value, // Update only the passport_no field
                              },
                            });
                            setTouched({
                              ...touched,
                              accountNumber: true,
                            });
                          }}
                          className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 h-10 rounded-xl px-4 border-gray-300  w-full lg:w-52   ${
                            !touched.accountNumber
                              ? "border-red-400 "
                              : "border-gray-300"
                          }`}
                          onKeyUp={handleKeyUp}
                        />
                        {error.bank_account_no && (
                          <p className="text-red-500 text-xs ">
                            {error.bank_account_no[0]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                      <div className="flex flex-col">
                        <label
                          className="font-medium text-sm"
                          onClick={() => {
                            setBankNameIsOpen(!bankNameIsOpen);
                          }}
                        >
                          BANK NAME
                        </label>
                        {/* <p className="text-sm">Bank Name</p> */}
                      </div>

                      <div
                        className={`relative w-full lg:w-52 border-2 rounded-xl px-4 border-gray-300 outline-none ${
                          !touched.BankName
                            ? "border-red-400 "
                            : "border-gray-300"
                        }`}
                      >
                        <button
                          onClick={() => {
                            setBankNameIsOpen(!bankNameIsOpen);
                          }}
                          className={`w-full ${
                            selectedBankNameOption
                              ? "text-black"
                              : "text-gray-400"
                          } py-2 text-left bg-white  rounded-lg shadow-sm focus:outline-none`}
                        >
                          {selectedBankNameOption || "Choose bank"}{" "}
                        </button>

                        {bankNameIsOpen && (
                          <div className="absolute left-0 z-10 w-full  bg-white border border-gray-300 rounded-lg shadow-lg">
                            {/* Search box */}
                            <input
                              type="text"
                              value={searchedBankName}
                              onChange={(e) =>
                                setSearchedBankName(e.target.value)
                              }
                              placeholder="Search..."
                              className="w-full px-4 py-2 border-b border-gray-200 focus:outline-none"
                            />
                            {/* Dropdown options */}
                            <ul className="max-h-48 overflow-y-auto">
                              {filteredBankNametOptions.length > 0 ? (
                                filteredBankNametOptions.map(
                                  (option, index) => (
                                    <li
                                      key={index}
                                      onClick={() => {
                                        setSelectedBankNameOption(option); // Update selected option
                                        setBankNameIsOpen(false);
                                        setFormData({
                                          ...formData, // Spread the existing formData

                                          bank: {
                                            ...formData.bank, // Spread the existing personal_info
                                            bankName: option, // Update only the passport_no field
                                          },
                                        });
                                      }}
                                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    >
                                      {option}
                                    </li>
                                  )
                                )
                              ) : (
                                <li className="px-4 py-2 text-gray-500">
                                  No results found
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                      <div className="flex flex-col">
                        <label className="font-medium text-sm" htmlFor="PAN NO">
                          BANK BRANCH
                        </label>
                        {/* <p className="text-sm">BANK BRANCH</p> */}
                      </div>
                      <input
                        id="PAN NO"
                        type="text"
                        placeholder="Enter Branch Name"
                        value={formData?.bank?.branch || ""} // Display previous data
                        onChange={(e) =>
                          setFormData({
                            ...formData, // Spread the existing formData
                            // Spread the existing employee_details
                            bank: {
                              ...formData.bank, // Spread the existing personal_info
                              branch: e.target.value, // Update only the passport_no field
                            },
                          })
                        }
                        className={`border-2 rounded-xl h-10 px-4 w-full lg:w-52  outline-none ${
                          !touched.accountbranch
                            ? "border-red-400 "
                            : "border-gray-300"
                        }`}
                        onKeyUp={handleKeyUp}
                      />
                    </div>

                    <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                      <div className="flex flex-col">
                        <label
                          className="font-medium text-sm"
                          htmlFor="IFSC CODE"
                        >
                          IFSC CODE
                        </label>
                        {/* <p className="text-sm">IFSC CODE</p> */}
                      </div>
                      <input
                        id="IFSC CODE"
                        type="text"
                        placeholder="Ente IFSC code"
                        value={formData?.bank?.ifscCode || ""} // Display previous data
                        onChange={(e) =>
                          setFormData({
                            ...formData, // Spread the existing formData

                            bank: {
                              ...formData.bank, // Spread the existing personal_info
                              ifscCode: e.target.value, // Update only the passport_no field
                            },
                          })
                        }
                        className={`border-2 rounded-xl h-10 px-4 w-full lg:w-52 border-gray-300 outline-none  ${
                          !touched.ifscCode
                            ? "border-red-400 "
                            : "border-gray-300"
                        }`}
                        onKeyUp={handleKeyUp}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 lg:px-6"
                  id="salary-information"
                >
                  <p className="text-xl font-semibold">Salary Information</p>

                  <div className="flex flex-col gap-3 mt-4">
                    {/* <div className="flex flex-col xl:flex-row gap-1 justify-between">
                    <div className="flex flex-col">
                      <label
                        className="font-medium text-sm"
                        htmlFor="SALARY BASIS"
                      >
                        SALARY BASIS
                      </label>
                    </div>

                    <input
                      id="SALARY BASIS"
                      type="number"
                      placeholder="Enter salary basis"
                      value={
                        formData?.employee_details?.salary_information
                          ?.salary_basic || ""
                      } // Display previous data
                      onChange={(e) =>
                        setFormData({
                          ...formData, // Spread the existing formData
                          employee_details: {
                            ...formData.employee_details, // Spread the existing employee_details
                            salary_information: {
                              ...formData.employee_details.salary_information, // Spread the existing personal_info
                              salary_basic: e.target.value, // Update only the passport_no field
                            },
                          },
                        })
                      }
                      className={`border-2 rounded-xl px-4 h-10  outline-none w-full lg:w-52 ${!touched.SalaryBasis
                        ? "border-red-400 "
                        : "border-gray-300"
                        }`}
                      onKeyUp={handleKeyUp}
                    />
                  </div> */}

                    <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                      <div className="flex flex-col">
                        <label
                          className="font-medium text-sm"
                          htmlFor="SALARY AMOUNT"
                        >
                          SALARY AMOUNT
                        </label>
                        {/* <p className="text-sm">Per Month</p> */}
                      </div>
                      <input
                        id="SALARY AMOUNT"
                        type="text"
                        placeholder="Enter Salary"
                        value={formData?.salaryAmount || ""} // Display previous data
                        onChange={(e) =>
                          setFormData({
                            ...formData, // Spread the existing formData

                            salaryAmount: e.target.value, // Update only the passport_no field
                          })
                        }
                        className={`border-2 rounded-xl px-4 h-10 border-gray-300 outline-none w-full lg:w-52 ${
                          !touched.salaryAmount
                            ? "border-red-400 "
                            : "border-gray-300"
                        }`}
                      />
                    </div>

                    {/* <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                    <div className="flex flex-col">
                      <label
                        className="font-medium text-sm"
                        htmlFor="EFFECTIVE DATE"
                      >
                        EFFECTIVE DATE
                      </label>
                      <p className="text-sm">Effective Date</p>
                    </div>
                    {/* <input
                    type="text"
                    placeholder="Enter PAN NO"
                    className="border-2 rounded-xl px-4 h-10 border-gray-300 outline-none w-full lg:w-52"
                  /> */}

                    {/* <div className="relative">
                      <DatePicker
                        id="Exp date"
                        placeholderText="Effective Date"
                        className={`border-2 rounded-xl h-10 px-4 outline-none w-full lg:w-52 ${!touched.EffectiveDate
                          ? "border-red-400 "
                          : "border-gray-300"
                          }`}
                        onKeyUp={handleKeyUp}
                        selected={effectivedate}
                        onChange={handleEFffectiveDate}
                      />
                    </div>
                  </div> */}

                    <div className="flex flex-col xl:flex-row justify-between">
                      <div className="flex flex-col mb-2 xl:mb-0">
                        <label
                          className="font-medium text-sm"
                          htmlFor="payment_type"
                        >
                          PAYMENT TYPE
                        </label>
                      </div>

                      <select
                        id="payment_type"
                        value={formData?.paymentType || ""}
                        className={`border-2 rounded-xl px-4 h-10 outline-none w-full lg:w-52 ${
                          !touched.PaymentType
                            ? "border-red-400"
                            : "border-gray-300"
                        }`}
                        onChange={(e) =>
                          setFormData({
                            ...formData,

                            paymentType: e.target.value,
                          })
                        }
                      >
                        <option value="" disabled>
                          Select
                        </option>
                        <option value="UPI">UPI</option>
                        <option value="BANK">BANK</option>
                        <option value="CASH">CASH</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Experience */}
                <div
                  className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 lg:px-6"
                  id="experience"
                >
                  <p className="text-xl font-semibold"> Experience </p>
                  {workExperiences?.map((experience, index) => (
                    <div
                      key={index}
                      className="flex items-start  justify-between mt-4 border rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-1 flex-wrap items-center ">
                          <p className="text-sm ">Job Title:</p>
                          <p className="text-sm font-semibold">
                            {" "}
                            {experience.jobTitle ?? experience.job_tile}{" "}
                          </p>
                        </div>

                        <div className="flex gap-1 flex-wrap items-center ">
                          <p className="text-sm">Company Name:</p>
                          <p className="text-sm font-semibold">
                            {" "}
                            {experience.companyName ??
                              experience.company_name}{" "}
                          </p>
                        </div>

                        <div className="flex gap-1 flex-wrap items-center">
                          <h1 className="text-sm ">Start & End Date:</h1>
                          <p className="text-sm font-semibold">
                            {experience.startWork && experience.endWork
                              ? `${experience.startWork} - ${experience.endWork}`
                              : `${
                                  experience.period_of_work_start ?? "N/A"
                                } - ${experience.period_of_work_end ?? "N/A"}`}
                          </p>
                        </div>

                        <div className="flex gap-1 flex-wrap items-center">
                          <h1 className="text-sm">Responsibilities:</h1>
                          <p className="text-sm font-semibold">
                            {experience.responsibilities
                              ? experience.responsibilities
                              : "N/A."}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => onClickWorkExperienceDelete(index)}
                        className="text-xl text-red-500"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  <div
                    onClick={openWorkExperienceModal}
                    className="flex gap-3 cursor-pointer items-center mt-5"
                  >
                    <IoAddCircleSharp className="text-blue-500 text-3xl" />
                    <p>Add work experience </p>
                  </div>
                </div>

                {/* exit formn */}

                <div className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 lg:px-6">
                  <p className="text-xl font-semibold">Exit form</p>

                  <div className="flex flex-col gap-3 mt-4">
                    {/* Resignation Email Date */}
                    <div className="flex flex-col xl:flex-row gap-1 justify-between">
                      <div className="flex flex-col">
                        <label
                          className="font-medium text-sm uppercase"
                          htmlFor="Resignation Email Date"
                        >
                          Resignation Email Date
                        </label>
                      </div>
                      <div className="relative">
                        <DatePicker
                          id="Resignation Email Date"
                          placeholderText="Resignation Email Date"
                          className="border-2 rounded-xl px-4 h-10 border-gray-300 w-full lg:w-52"
                          onKeyUp={handleKeyUp}
                          selected={
                            resignation_email_date &&
                            !isNaN(new Date(resignation_email_date).getTime())
                              ? new Date(resignation_email_date)
                              : null
                          }
                          onChange={handlereievedate}
                          dateFormat="dd/MM/yyyy"
                          showYearDropdown
                        />
                      </div>
                    </div>

                    {/* Notice Period Dropdown */}
                    <div className="flex flex-col xl:flex-row gap-1 justify-between">
                      <div className="flex flex-col">
                        <label
                          className="font-medium text-sm uppercase"
                          onClick={() => setDurationIsOpen(!durationIsOpen)}
                        >
                          Notice Period
                        </label>
                      </div>
                      <div className="relative border-2 rounded-xl px-4 border-gray-300 w-full lg:w-52">
                        <button
                          onClick={() => setDurationIsOpen(!durationIsOpen)}
                          className={`w-full ${
                            selectedDuration ? "text-black" : "text-gray-400"
                          } py-2 text-left bg-white rounded-lg shadow-sm focus:outline-none`}
                        >
                          {selectedDuration || "Choose Duration"}
                        </button>

                        {durationIsOpen && (
                          <div className="absolute left-0 z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                            <input
                              type="text"
                              value={searchedDuration}
                              onChange={(e) =>
                                setSearchedDuration(e.target.value)
                              }
                              placeholder="Search..."
                              className="w-full px-4 py-2 border-b border-gray-200 focus:outline-none"
                            />
                            <ul className="max-h-48 overflow-y-auto">
                              {filteredDurationOptions.length > 0 ? (
                                filteredDurationOptions.map((option, index) => (
                                  <li
                                    key={index}
                                    onClick={() => handleNoticePeriod(option)}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                  >
                                    {option}
                                  </li>
                                ))
                              ) : (
                                <li className="px-4 py-2 text-gray-500">
                                  No results found
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Last Working Date */}
                    <div className="flex flex-col xl:flex-row gap-1 justify-between">
                      <div className="flex flex-col">
                        <label
                          className="font-medium text-sm uppercase"
                          htmlFor="Last working date"
                        >
                          Last Working Date
                        </label>
                      </div>
                      <div className="relative">
                        <DatePicker
                          id="Last working date"
                          placeholderText="Last working date"
                          className="border-2 rounded-xl px-4 h-10 border-gray-300 w-full lg:w-52"
                          onKeyUp={handleKeyUp}
                          selected={
                            last_working_date &&
                            !isNaN(new Date(last_working_date).getTime())
                              ? new Date(last_working_date)
                              : null
                          }
                          // selected={last_working_date}
                          onChange={handleLastworkdate}
                          dateFormat="dd/MM/yyyy"
                          showYearDropdown
                        />
                      </div>
                    </div>

                    {/* Reason for Relieving */}
                    <div className="flex flex-col xl:flex-row gap-1 justify-between">
                      <div className="flex flex-col">
                        <label
                          className="font-medium text-sm uppercase"
                          htmlFor="Reason for relieving"
                        >
                          Reason for Relieving
                        </label>
                      </div>
                      <textarea
                        id="Reason for relieving"
                        placeholder="Enter reason for relieving..."
                        value={formData?.relieving_reason || ""} // Access directly from root
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            relieving_reason: e.target.value, // Save directly at root level
                          })
                        }
                        onKeyUp={handleKeyUp}
                        rows={4}
                        className="border-2 rounded-xl px-4 py-2 border-gray-300 w-full lg:w-52 resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 lg:px-6"
                  id="skills"
                >
                  <p className="text-xl font-semibold">Skills</p>

                  <div className="bg-gray-100 p-4 rounded-xl mt-3">
                    <input
                      type="text"
                      placeholder="Add a skill and press Enter"
                      className="w-full  rounded-md bg-gray-100 h-5 border-none outline-none"
                      value={skillsInputValue}
                      onKeyUp={handleSkillsKeyPress}
                      onChange={(e) => {
                        setSkillsInputValue(e.target.value);
                      }}
                      onKeyPress={handleSkillsKeyPress}
                    />
                    <div className="mt-4 flex flex-wrap gap-2">
                      {skills.length > 0 ? (
                        skills.map((skill, index) => (
                          <div
                            key={index}
                            className="flex items-center bg-white text-gray-800 px-2 py-1 rounded-full"
                          >
                            <span className="mr-2">{skill}</span>
                            <button
                              className="text-black hover:text-red-600"
                              onClick={() => handleDeleteSkill(skill)}
                            >
                              &times;
                            </button>
                          </div>
                        ))
                      ) : (
                        <p>No skills available</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Document Section */}
                <div
                  className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 lg:px-6"
                  id="documents"
                >
                  <p className="text-xl font-semibold">Documents</p>
                  {/* Display Uploaded Files Outside Modal */}
                  <div className="mt-4">
                    <ul className="list-disc space-y-2">
                      {uploadedDocuments.map((fileWrapper, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between text-sm border-2 border-green-600 rounded-2xl px-4 py-3"
                        >
                          <div className=" w-full">
                            <div className="flex justify-between">
                              <p className="text-gray-500">
                                Title: {fileWrapper.title}
                              </p>
                              <p
                                className="text-red-500 cursor-pointer"
                                onClick={() =>
                                  onClickDocumentDeleteButton(
                                    index,
                                    fileWrapper.files
                                  )
                                }
                              >
                                x
                              </p>
                            </div>

                            {fileWrapper.files &&
                            fileWrapper.files.length > 0 ? (
                              fileWrapper.files.map((file, index1) => (
                                <div
                                  key={index1}
                                  className="mt-2 w-full flex justify-between "
                                >
                                  <button
                                    className="text-blue-500 hover:text-blue-700"
                                    onClick={() => {
                                      if (file.file) {
                                        window.open(file.file, "_blank");
                                      } else {
                                        alert("Preview not available");
                                      }
                                    }}
                                  >
                                    <p>{file.file.path || file.preview}</p>
                                  </button>
                                </div>
                              ))
                            ) : (
                              <p>Unknown file</p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div
                    onClick={openAddEmployeeDocumentsModal}
                    className="flex gap-3 items-center font-medium mt-5 cursor-pointer"
                  >
                    <IoAddCircleSharp className="text-blue-500 text-3xl" />
                    <p>Add employee documents</p>
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 lg:px-6">
                  <h2 className="text-xl font-semibold">Drive Link</h2>
                  <input
                    id="INSURANCE NO"
                    type="url"
                    placeholder="Paste drive link here.."
                    value={formData.driveLink}
                    onChange={(e) =>
                      setFormData({
                        ...formData, // Spread the existing formData

                        driveLink: e.target.value, // Update only the employee_name field
                      })
                    }
                    className={`border-2 mt-3 rounded-xl px-4 h-10 border-gray-300  w-full `}
                  />
                </div>

                {/* <div className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 lg:px-6">
              <p className="text-xl font-semibold">Verification Doc.</p>
              <div className="flex gap-5 flex-wrap items-center mt-5 cursor-pointer">
                <div className="flex gap-2">
                  <input type="checkbox" name="Aadhar" id="Aadhar" checked={checkedDocuments.Aadhar}
                    onChange={handleCheckboxChange} />
                  <label htmlFor="Aadhar" className="font-medium">
                    Aadhar
                  </label>
                </div>
                <div className="flex gap-2">
                  <input type="checkbox" name="Education" id="Education" checked={checkedDocuments.Education}
                    onChange={handleCheckboxChange} />
                  <label htmlFor="Education" className="font-medium">
                    Education
                  </label>
                </div>
                <div className="flex gap-2">
                  <input type="checkbox" name="Salary" id="Salary" checked={checkedDocuments.Salary}
                    onChange={handleCheckboxChange} />
                  <label htmlFor="Salary" className="font-medium">
                    Salary
                  </label>
                </div>
                <div className="flex gap-2">
                  <input type="checkbox" name="Experience" id="Experience"
                    checked={checkedDocuments.Experience}
                    onChange={handleCheckboxChange} />
                  <label htmlFor="Experience" className="font-medium">
                    Experience
                  </label>
                </div>
              </div>
            </div> */}
              </div>
            </div>
          </div>

          {addWorkExperienceModalOpen && (
            <div className="fixed inset-0 backdrop-blur-sm  z-50">
              {/* Overlay */}
              <div
                className="absolute inset-0 "
                onClick={closeAddWorkExperienceModal}
              >
                {" "}
              </div>
              <div
                className={`fixed top-0 right-0 h-full overflow-y-scroll w-screen sm:w-[90vw] md:w-[70vw] bg-white shadow-lg px-5 md:px-16 py-10 transform transition-transform duration-500 ease-in-out ${
                  isAnimating ? "translate-x-0" : "translate-x-full"
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                  title="Toggle Sidebar"
                  onClick={closeAddWorkExperienceModal}
                >
                  <IoIosArrowForward className="w-3 h-3" />
                </div>
                <div className="flex flex-col md:flex-row justify-between ">
                  <p className="text-3xl font-medium mt-8"> Experience </p>
                  <div className="flex gap-5 justify-end mt-8">
                    <button
                      onClick={closeAddWorkExperienceModal}
                      className="bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-9 py-1 md:py-2 font-semibold rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveExperience}
                      className="bg-blue-600 text-white px-4 md:px-9 py-2 font-semibold rounded-full"
                    >
                      Save
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-3 mt-8">
                  <div className="flex flex-col lg:flex-row gap-1 justify-between">
                    <div className="flex flex-col ">
                      <label className="font-medium text-sm" htmlFor="jobTitle">
                        JOB TITLE
                      </label>
                      {/* <p className="text-sm"> Job title </p> */}
                    </div>
                    <input
                      type="text"
                      id="jobTitle"
                      value={experienceForm.jobTitle}
                      onChange={(e) =>
                        setExperienceForm((prev) => ({
                          ...prev,
                          jobTitle: e.target.value,
                        }))
                      }
                      placeholder="Enter job title"
                      className={` border-2 rounded-xl px-4 py-2 h-10 outline-none w-full md:w-96  ${
                        !expTouched.jobTitle
                          ? "border-red-400"
                          : "border-gray-300 "
                      }`}
                      onKeyUp={handleKeyUp}
                    />
                  </div>
                  <div className="flex flex-col lg:flex-row gap-1 justify-between">
                    <div className="flex flex-col">
                      <label
                        className="font-medium text-sm"
                        htmlFor="companyIndustry"
                      >
                        COMPANY'S INDUSTRY
                      </label>
                      {/* <p className="text-sm"> Company's industry</p> */}
                    </div>
                    <input
                      type="text"
                      value={experienceForm.companyIndustry}
                      onChange={(e) =>
                        setExperienceForm((prev) => ({
                          ...prev,
                          companyIndustry: e.target.value,
                        }))
                      }
                      id="companyIndustry"
                      placeholder="Information Technology"
                      className={`border-2 rounded-xl px-4 h-10 border-gray-300 outline-none w-full md:w-96 ${
                        !expTouched.companyIndustry
                          ? "border-red-400"
                          : "border-gray-300 "
                      }`}
                      onKeyUp={handleKeyUp}
                    />
                  </div>
                  <div className="flex flex-col lg:flex-row gap-1 justify-between">
                    <div className="flex flex-col">
                      <label
                        className="font-medium text-sm"
                        htmlFor="companyName"
                      >
                        COMPANY NAME
                      </label>
                      {/* <p className="text-sm"> Company name </p> */}
                    </div>
                    <input
                      value={experienceForm.companyName}
                      onChange={(e) =>
                        setExperienceForm((prev) => ({
                          ...prev,
                          companyName: e.target.value,
                        }))
                      }
                      type="text"
                      id="companyName"
                      placeholder="Company name"
                      className={`border-2 rounded-xl px-4 h-10 border-gray-300 outline-none w-full md:w-96 ${
                        !expTouched.companyName
                          ? "border-red-400"
                          : "border-gray-300 "
                      }`}
                      onKeyUp={handleKeyUp}
                    />
                  </div>
                  <div className="flex flex-col lg:flex-row gap-1 justify-between">
                    <div className="flex flex-col">
                      <label
                        className="font-medium text-sm"
                        htmlFor="previousSalary"
                      >
                        PREVIOUS SALARY
                      </label>
                      {/* <p className="text-sm"> Previous salary </p> */}
                    </div>
                    <input
                      value={experienceForm.previousSalary}
                      onChange={(e) =>
                        setExperienceForm((prev) => ({
                          ...prev,
                          previousSalary: e.target.value,
                        }))
                      }
                      type="text"
                      id="previousSalary"
                      placeholder="Previous salary"
                      className={`border-2 rounded-xl px-4 h-10 border-gray-300 outline-none w-full md:w-96 ${
                        !expTouched.previousSalary
                          ? "border-red-400"
                          : "border-gray-300 "
                      }`}
                      onKeyUp={handleKeyUp}
                    />
                  </div>

                  <div className="flex flex-col lg:flex-row gap-1 justify-between">
                    <div className="flex flex-col">
                      <label
                        className="font-medium text-sm"
                        htmlFor="periodOfWork"
                      >
                        PERIOD OF WORK
                      </label>
                      {/* <p className="text-sm"> Period of work </p> */}
                    </div>

                    {/* <div className="flex gap-3 w-full md:w-96">
                    <input
                      value={experienceForm.startWork}
                      onChange={(e) =>
                        setExperienceForm((prev) => ({
                          ...prev,
                          startWork: e.target.value,
                        }))
                      }
                      type="text"
                      id="startWork"
                      placeholder="Start work"
                      className={`border-2 w-[50%] rounded-xl h-10  px-4 border-gray-300 outline-none ${
                        !expTouched.startWork
                          ? "border-red-400"
                          : "border-gray-300 "
                      }`}
                      onKeyUp={handleKeyUp}
                    />
                    <input
                      value={experienceForm.endWork}
                      onChange={(e) =>
                        setExperienceForm((prev) => ({
                          ...prev,
                          endWork: e.target.value,
                        }))
                      }
                      type="text"
                      id="endWork"
                      placeholder="End work"
                      className={`border-2 w-[50%] rounded-xl px-4 h-10 border-gray-300 outline-none ${
                        !expTouched.endWork
                          ? "border-red-400"
                          : "border-gray-300 "
                      }`}
                      onKeyUp={handleKeyUp}
                    />
                  </div> */}

                    <div className="flex flex-col md:flex-row flex-wrap gap-3 w-full md:w-96 overflow-hidden">
                      <DatePicker
                        id="DATE OF JOINING"
                        placeholderText="Start work"
                        selected={
                          experienceForm?.startWork
                            ? new Date(experienceForm?.startWork, 0)
                            : null
                        }
                        onChange={(date) =>
                          setExperienceForm((prev) => ({
                            ...prev,
                            startWork: date?.getFullYear(),
                          }))
                        }
                        className={`border-2  rounded-xl w-full md:w-44 h-10 px-4 border-gray-300 outline-none ${
                          !expTouched.startWork
                            ? "border-red-400"
                            : "border-gray-300 "
                        }`}
                        onKeyUp={handleKeyUp}
                        showYearDropdown
                        showYearPicker
                        dateFormat="yyyy"
                      />

                      <DatePicker
                        id="DATE OF JOINING"
                        placeholderText="End work"
                        selected={
                          experienceForm?.endWork
                            ? new Date(experienceForm?.endWork, 0)
                            : null
                        }
                        onChange={(date) =>
                          setExperienceForm((prev) => ({
                            ...prev,
                            endWork: date?.getFullYear(),
                          }))
                        }
                        className={`border-2 rounded-xl h-10 px-4 w-full md:w-44 border-gray-300 outline-none ${
                          !expTouched.startWork
                            ? "border-red-400"
                            : "border-gray-300 "
                        }`}
                        onKeyUp={handleKeyUp}
                        showYearDropdown
                        showYearPicker
                        dateFormat="yyyy"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-1 justify-between">
                    <div className="flex flex-col">
                      <label
                        className="font-medium text-sm"
                        htmlFor="responsibilities"
                      >
                        RESPONSIBILITIES
                      </label>
                      {/* <p className="text-sm"> Short description about job </p> */}
                    </div>

                    <textarea
                      type="text"
                      placeholder="Add responsibilities"
                      value={experienceForm.responsibilities}
                      onChange={(e) =>
                        setExperienceForm((prev) => ({
                          ...prev,
                          responsibilities: e.target.value,
                        }))
                      }
                      rows="3"
                      className={`  w-full md:w-96 pt-2 rounded-xl px-4   border-2 outline-none ${
                        !expTouched.responsibilities
                          ? "border-red-400"
                          : "border-gray-300 "
                      }`}
                      onKeyUp={handleKeyUp}
                    />

                    {/* <div className="  rounded-2xl  w-full md:w-96">
                    <div className=""> </div>
                    <input
                      type="text"
                      placeholder="Add responsibility and press Enter"
                      value={responsibilityInput}
                      onChange={(e) => setResponsibilityInput(e.target.value)}
                      onKeyDown={handleAddResponsibility}
                      className={`w-full  h-10 rounded-xl px-3 mt-3  border-2 outline-none ${
                        !expTouched.ResponsibilitiesInputValue
                          ? "border-red-400"
                          : "border-gray-300 "
                      }`}
                      onKeyUp={handleKeyUp}
                    />
                    <ul className="mt-2">
                      {experienceForm.responsibilities.map((res, index) => (
                        <div className="flex items-start justify-between pe-5">
                          <li key={index}>
                            <p className="">
                              {" "}
                              <GoDotFill className="mr-2  inline-flex" />
                              {res}
                            </p>
                          </li>
                          <button
                            onClick={() => handleDeleteResponsibility(index)}
                            className="ml-2 text-red-500"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </ul>
                  </div> */}
                  </div>
                </div>

                <div>
                  <p className="text-3xl font-medium mt-8">
                    Verification Process
                  </p>

                  <div className="flex mt-5 gap-5">
                    <div className="flex gap-2">
                      <input
                        type="checkbox"
                        name="Payslip 1"
                        id="Payslip 1"
                        onChange={handleCheckboxChangeVerification}
                      />
                      <label htmlFor="">Payslip 1</label>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="checkbox"
                        name="Payslip 2"
                        id="Payslip 2"
                        onChange={handleCheckboxChangeVerification}
                      />
                      <label htmlFor="">Payslip 2</label>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="checkbox"
                        name="Payslip 3"
                        id="Payslip 3"
                        onChange={handleCheckboxChangeVerification}
                      />
                      <label htmlFor="">Payslip 3</label>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-5">
                    <input
                      type="checkbox"
                      name="last company appointment letter"
                      id="last company appointment letter"
                      onChange={handleCheckboxChangeVerification}
                    />
                    <label htmlFor="">last company appointment letter</label>
                  </div>

                  <div className="flex gap-2 mt-5">
                    <input
                      type="checkbox"
                      name="last company experience letter"
                      id="last company experience letter"
                      onChange={handleCheckboxChangeVerification}
                    />
                    <label htmlFor="">last company experience letter</label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {addEducationalInfoModalOpen && (
            <div className="fixed inset-0 top-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
              {/* Overlay */}
              <div
                className="absolute inset-0"
                onClick={closeAddEducationInfoModal}
              ></div>
              <div
                className={`fixed top-0 right-0 h-screen overflow-y-scroll w-[90vw] md:w-[70vw] bg-white shadow-lg px-5 md:px-16 py-10 transform transition-transform duration-500 ease-in-out ${
                  isAnimating ? "translate-x-0" : "translate-x-full"
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                  title="Toggle Sidebar"
                  onClick={closeAddEducationInfoModal}
                >
                  <IoIosArrowForward className="w-3 h-3" />
                </div>
                <div className="flex flex-wrap flex-col md:flex-row justify-between">
                  <p className="text-3xl font-medium mt-8">Education Info</p>
                  <div className="flex justify-end gap-5 mt-8">
                    <button
                      onClick={closeAddEducationInfoModal}
                      className="bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-9 py-1 md:py-2 font-semibold rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEducationInfo}
                      className="bg-blue-600 text-white px-5 md:px-9 py-1 md:py-2 font-semibold rounded-full"
                    >
                      Save
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-3 mt-8">
                  {/* School Name */}
                  <div className="flex flex-col lg:flex-row gap-1 justify-between">
                    <div className="flex flex-col">
                      <label
                        className="font-medium text-sm"
                        htmlFor="school-name"
                      >
                        INSTITUTE NAME
                      </label>
                      {/* <p className="text-sm text-gray-500">Add School Name</p> */}
                    </div>
                    <input
                      type="text"
                      id="school-name"
                      placeholder="School name"
                      className={`border-2 rounded-xl px-4 py-2  outline-none h-10 w-full md:w-96 ${
                        !educationTouched.SchoolName
                          ? "border-red-400"
                          : "border gray-300"
                      }`}
                      onKeyUp={handleKeyUp}
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                    />
                  </div>
                  {/* Department Name */}
                  <div className="flex flex-col lg:flex-row gap-1 justify-between">
                    <div className="flex flex-col">
                      <label
                        className="font-medium text-sm"
                        htmlFor="department-name"
                      >
                        DEPARTMENT NAME
                      </label>
                      {/* <p className="text-sm text-gray-500">Add Department</p> */}
                    </div>
                    <input
                      type="text"
                      id="department-name"
                      placeholder="Department name"
                      className={`border-2 rounded-xl px-4 py-2  outline-none h-10 w-full md:w-96 ${
                        !educationTouched.DepartmentName
                          ? "border-red-400"
                          : "border-gray-300"
                      }`}
                      onKeyUp={handleKeyUp}
                      value={departmentName}
                      onChange={(e) => setDepartmentName(e.target.value)}
                    />
                  </div>
                  {/* Period of Year */}
                  <div className="flex flex-col lg:flex-row gap-1 justify-between">
                    <div className="flex flex-col">
                      <label
                        className="font-medium text-sm"
                        htmlFor="period-year"
                      >
                        YEAR OF PASSING
                      </label>
                      {/* <p className="text-sm text-gray-500">YEAR OF PASSING</p> */}
                    </div>
                    <div className="flex gap-2 h-10 w-full md:w-96">
                      {/* <input
                    type="text"
                    placeholder="Start year"
                    className="border-2 rounded-xl px-4 py-2 border-gray-300 outline-none w-full"
                    value={startYear}
                    onChange={(e) => setStartYear(e.target.value)}
                  /> */}
                      <input
                        type="month"
                        // placeholder="End year"
                        className={`border-2 rounded-xl px-4 py-2 outline-none w-full ${
                          !educationTouched.YearOfPassing
                            ? "border-red-400"
                            : "border-gray-300"
                        }`}
                        onKeyUp={handleKeyUp}
                        value={endYear}
                        onChange={(e) => setEndYear(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {addEmployeeDocumentsModalOpen && (
            <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50">
              <div
                className="absolute inset-0"
                onClick={closeAddEmployeeDocumentsModal}
              ></div>
              <div
                className={`fixed top-0 right-0 h-full  overflow-y-scroll w-[90vw] md:w-[70vw] bg-white  px-5 md:px-16 py-10 transform transition-transform duration-500 ease-in-out ${
                  isAnimating ? "translate-x-0" : "translate-x-full"
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                  title="Toggle Sidebar"
                  onClick={closeAddEmployeeDocumentsModal}
                >
                  <IoIosArrowForward className="w-3 h-3" />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-3xl font-medium mt-8">Documents</p>
                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={closeAddEmployeeDocumentsModal}
                      className="bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-9 py-1 md:py-2 font-semibold rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveUploadedFile}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 md:px-9 py-1 md:py-2 font-semibold rounded-full"
                    >
                      Save
                    </button>
                  </div>
                </div>
                {/* Title Input */}
                <div className="flex flex-col lg:flex-row gap-1  justify-between mt-8">
                  <div className="flex flex-col">
                    <label
                      className="font-medium text-sm"
                      htmlFor="school-name"
                    >
                      ENTER TITLE
                    </label>
                    {/* <p className="text-sm text-gray-500">Doc title</p> */}
                  </div>
                  <input
                    type="text"
                    id="school-name"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`border-2 rounded-xl px-4 py-2  outline-none w-full md:w-96 ${
                      !docTitle ? "border-red-400" : "border-gray-300"
                    }`}
                    onKeyUp={handleKeyUp}
                  />
                </div>
                {/* Drag and Drop Area */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed mt-5 rounded-lg py-10 px-5 text-center ${
                    isDragActive ? "border-blue-500" : "border-gray-300"
                  } ${!title.trim() ? "opacity-50 pointer-events-none" : ""}`} // Visual indicator when disabled
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className="text-blue-500">Drop your files here...</p>
                  ) : (
                    <div className="text-gray-500">
                      <IoCloudUploadOutline className="text-6xl text-blue-500 mx-auto" />
                      <p className="mt-3">
                        Drag & drop files here, or{" "}
                        <span className="text-blue-500 underline cursor-pointer">
                          browse
                        </span>
                      </p>
                      <p>Supported formats: JPEG, PNG, PDF</p>
                      {!title.trim() && (
                        <p className="text-red-500 mt-2">
                          Enter a title to enable file upload.
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-5">
                  {uploadedFiles.length > 0 ? (
                    <div>
                      {uploadedFiles.map((group) => (
                        <div key={group.title} className="mb-4">
                          <p className="font-medium text-lg text-gray-700">
                            {group.title}
                          </p>
                          <ul className="list-disc space-y-2 ml-4">
                            {group.files.map((fileWrapper) => (
                              <li
                                key={fileWrapper.id}
                                className="flex items-center justify-between text-sm border-2 border-green-600 rounded-2xl px-4 py-3"
                              >
                                <div>
                                  <button
                                    className="text-blue-500 hover:text-blue-700"
                                    onClick={() =>
                                      window.open(fileWrapper.preview, "_blank")
                                    }
                                  >
                                    {fileWrapper.file.path}
                                  </button>
                                </div>
                                <MdDeleteForever
                                  className="text-2xl text-red-400 hover:text-red-600 cursor-pointer"
                                  onClick={() =>
                                    handleDelete(fileWrapper.id, group.title)
                                  }
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No documents uploaded yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/*Image Popup  */}
          {/* Modal for Larger Image */}
          {openImageModal && (
            <div
              className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center"
              onClick={() => setOpenImageModal(false)} // Close modal on overlay click
            >
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Full Size"
                  className="max-w-full h-[70vh] object-contain"
                />
                <button
                  className="absolute top-2 right-2 bg-white rounded-full px-3 py-1"
                  onClick={() => setOpenImageModal(false)} // Close modal on button click
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditEmployeeDetails_Mainbar;
