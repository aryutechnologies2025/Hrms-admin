import { useState, useEffect } from "react";
import { IoAddCircleSharp } from "react-icons/io5";
import { isSession, useNavigate } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import { useDropzone } from "react-dropzone";
import { IoCloudUploadOutline } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { BsCalendar4 } from "react-icons/bs";
import { CiDeliveryTruck, CiBoxList } from "react-icons/ci";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../../api/axiosConfig.js";
import { API_URL } from "../../config";
import { capitalizeFirstLetter } from "../../utils/StringCaps.js";
import { formatDate } from "../../utils/dateformate.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import Button_Loader from "../Button_Loader";
import { useRef } from "react";
import Loader from "../Loader";

const CreateEmployee_Mainbar = () => {
  const [employeeWorkType, setEmployeeWorkType] = useState("");
  const [internMonths, setInternMonths] = useState("");
  const [employeeTypeOptions, setEmployeeTypeOptions] = useState([]);
  const [positionOptions, setPositionOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployeeTypeId, setSelectedEmployeeTypeId] = useState(null);
  const [selectedPositionId, setSelectedPositionId] = useState(null);

  const [selectedDocs, setSelectedDocs] = useState([]);
  const [githubEmailId, setGithubEmailId] = useState("");

  const [linkedIn, setLinkedIn] = useState("");


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

  useEffect(() => {
    // Fetch Employee Types
    fetch(`${API_URL}/api/department/view-employeedepartment`)
      .then((res) => res.json())
      .then((data) => setEmployeeTypeOptions(data.data));

    // Fetch Positions
    fetch(`${API_URL}/api/roles/view-employeerole`)
      .then((res) => res.json())
      .then((data) => setPositionOptions(data.data));
  }, []);

  const employeeTypeRef = useRef(null);
  const roleDropdownRef = useRef(null);

  let navigate = useNavigate();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onClickCreateEmployeeCancelButton = () => {
    navigate("/employees");
  };

  const [searchedPosition, setSearchedPosition] = useState("");
  const [positionIsOpen, setPositionIsOpen] = useState(false);
  //roles

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // EMPLOYEE TYPE dropdown
      if (
        employeeTypeRef.current &&
        !employeeTypeRef.current.contains(event.target)
      ) {
        setEmployeeTypeIsOpen(false);
      }

      // ROLES dropdown
      if (
        roleDropdownRef.current &&
        !roleDropdownRef.current.contains(event.target)
      ) {
        setPositionIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredPositionOptions = roles.filter((role) =>
    role.name.toLowerCase().includes(searchedPosition.toLowerCase())
  );

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

  // const filteredEmployeeTypeOptions = employeeTypeOptions.filter((option) =>
  //   option.toLowerCase().includes(searchedEmployeeType.toLowerCase())
  // );

  const [searchedBankName, setSearchedBankName] = useState("");
  const [bankNameIsOpen, setBankNameIsOpen] = useState(false);
  const bankNameOptions = [
    "State Bank of India",
    "Bank of Baroda",
    "Bank of India",
    "Bank of Maharashtra",
    "Canara Bank",
    "Central Bank of India",
    "Indian Bank",
    "Indian Overseas Bank",
    "Punjab & Sind Bank",
    "Punjab National Bank",
    "UCO Bank",
    "Union Bank of India",
    "Axis Bank Ltd.",
    "Bandhan Bank Ltd.",
    "CSB Bank Ltd.",
    "City Union Bank Ltd.",
    "DCB Bank Ltd.",
    "Dhanlaxmi Bank Ltd.",
    "Federal Bank Ltd.",
    "HDFC Bank Ltd.",
    "ICICI Bank Ltd.",
    "IDBI Bank Ltd.",
    "IDFC FIRST Bank Ltd.",
    "IndusInd Bank Ltd.",
    "Jammu & Kashmir Bank Ltd.",
    "Karnataka Bank Ltd.",
    "Karur Vysya Bank Ltd.",
    "Kotak Mahindra Bank Ltd.",
    "Nainital Bank Ltd.",
    "RBL Bank Ltd.",
    "South Indian Bank Ltd.",
    "Tamilnad Mercantile Bank Ltd.",
    "YES Bank Ltd.",
  ];

  const filteredBankNametOptions = bankNameOptions.filter((option) =>
    option.toLowerCase().includes(searchedBankName.toLowerCase())
  );

  const [skillsInputValue, setSkillsInputValue] = useState("");

  const handleSkillsKeyPress = (e) => {
    if (e.key === "Enter" && skillsInputValue) {
      setSkills([...skills, skillsInputValue.trim()]);
      setSkillsInputValue("");
    }
  };

  const handleDeleteSkill = (skillToDelete) => {
    setSkills(skills.filter((skill) => skill !== skillToDelete));
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

  // const [title, setTitle] = useState("");
  // const [uploadedFiles, setUploadedFiles] = useState([]);

  // console.log('uploadedFiles', uploadedFiles);

  // const onDrop = (acceptedFiles) => {
  //   const filesWithDetails = acceptedFiles.map((file) => ({
  //     id: Date.now() + Math.random(),
  //     file,
  //     title: title || "No title entered",
  //     preview: URL.createObjectURL(file),
  //   }));
  //   setUploadedFiles((prevFiles) => [...prevFiles, ...filesWithDetails]);
  //   // setTitle(""); // Reset the title after upload
  // };

  // const { getRootProps, getInputProps, isDragActive } = useDropzone({
  //   onDrop,
  //   accept: {
  //     "image/jpeg": [".jpeg", ".jpg"],
  //     "image/png": [".png"],
  //     "application/pdf": [".pdf"],
  //   },
  //   maxFiles: 1,
  // });

  // const handleDelete = (fileId) => {
  //   setUploadedFiles((prevFiles) =>
  //     prevFiles.filter((file) => file.id !== fileId)
  //   );
  // };

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
    setExpTouched({
      jobTitle: true,
      companyIndustry: true,
      companyName: true,
      previousSalary: true,
      startWork: true,
      endWork: true,
      responsibilities: true,
    });

    setExperienceForm({
      jobTitle: "",
      companyIndustry: "",
      companyName: "",
      previousSalary: "",
      startWork: "",
      endWork: "",
      responsibilities: "",
    });

    setIsAnimating(false);
    setTimeout(() => setAddWorkExperienceModalOpen(false), 250); // Matches animation duration
  };

  const openAddEducationInfoModal = () => {
    setAddEducationalInfoModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10); //
    // Delay to trigger animation
  };

  const closeAddEducationInfoModal = () => {
    setSchoolName("");
    setDepartmentName("");
    setEndYear("");

    setEducationTouched({
      SchoolName: true,
      DepartmentName: true,
      YearOfPassing: true,
    });
    setIsAnimating(false);
    setTimeout(() => setAddEducationalInfoModalOpen(false), 250); // Delay to trigger animation
    setSchoolName("");
    setDepartmentName("");
  };

  const openAddEmployeeDocumentsModal = () => {
    setAddEmployeeDocumentModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10); // Delay to trigger animation
  };

  const closeAddEmployeeDocumentsModal = () => {
    setTimeout(() => setAddEmployeeDocumentModalOpen(false), 250); // Delay to trigger animation

    setTimeout(() => {
      setTitle("");
      setUploadedFiles([]);
      setIsAnimating(false);
      setDocTitle(true);
    }, 500);
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
  };

  const handleDateChange = async (date) => {
    setTouched({
      ...touched,
      dateOfJoin: true,
    });

    if (date) {
      const formattedDate = formatDate(date);
      setEmployeeDateOfJoin(formattedDate);
    } else {
      setEmployeeDateOfJoin(null);
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/employees/generate-employeeid`,
        {
          dateofjoining: formatDate(date), // Format to YYYY-MM-DD
          empid: "",
        }
      );

      setEmployeeId(response.data.employeeid);
    } catch (error) {
      console.error("Error generating custom ID:", error);
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
    setTouched({
      ...touched,
      dob: true,
    });
    if (date) {
      // Format the date to "yyyy-mm-dd"
      const formattedDate = formatDate(date); // This gives you "yyyy-mm-dd"
      setEmployeeDob(formattedDate);
    } else {
      setEmployeeDob(null);
    }
  };

  const handlePfJoinDate = (date) => {
    if (date) {
      const formattedDate = formatDate(date);
      setPfJoinDate(formattedDate);
    } else {
      setPfJoinDate(null);
    }
  };

  const handlePfExpDate = (date) => {
    if (date) {
      const formattedDate = formatDate(date);
      setPfExpiryDate(formattedDate);
    } else {
      setPfExpiryDate(null);
    }
  };

  const handleEFffectiveDate = (date) => {
    setTouched({
      ...touched,
      EffectiveDate: true,
    });
    if (date) {
      const formattedDate = formatDate(date);
      setEffectiveDATE(formattedDate);
    } else {
      setEffectiveDATE(null);
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
  // Function to handle file input change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setTouched({
      ...touched,
      UploadPhoto: true,
    });
    if (file) {
      setSelectedImage(file); // Store the file itself
    }
  };

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
        period: `${endYear}`,
      };
      const newEntrys = {
        schoolName,
        departmentName,

        endYear: endYear,
      };
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
    setEducationInfo(newEducationInfo);
  };

  //Documents
  const [title, setTitle] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  const [docTitle, setDocTitle] = useState(true);

  const saveUploadedFile = (event) => {
    event.preventDefault();
    setTitle("");
    const isdocTitleValid = title.trim() != "" ? true : false;
    setDocTitle(isdocTitleValid);
    setUploadedDocuments((prev) => {
      // Use a map to track titles to prevent duplicates
      const documentMap = new Map();
      prev.forEach((doc) => {
        documentMap.set(doc.title, {
          title: doc.title,
          files: [...(doc.files || [])],
        });
      });
      // Merge the uploaded files into the map
      uploadedFiles.forEach((fileGroup) => {
        if (documentMap.has(fileGroup.title)) {
          // Merge files if the title already exists
          const existingDoc = documentMap.get(fileGroup.title);
          documentMap.set(fileGroup.title, {
            ...existingDoc,
            files: [...existingDoc.files, ...(fileGroup.files || [])],
          });
          closeAddEmployeeDocumentsModal();
        } else {
          // Add a new entry if the title doesn't exist
          documentMap.set(fileGroup.title, {
            title: fileGroup.title,
            files: fileGroup.files || [],
          });
          closeAddEmployeeDocumentsModal();
        }
      });
      // Convert the map back to an array for state
      return Array.from(documentMap.values());
    });
    // Reset the modal state and uploaded files
    // setIsAnimating(false);
    // setTimeout(() => setAddEmployeeDocumentModalOpen(false), 250); // Delay to trigger animation
    setUploadedFiles([]); // Clear the uploaded files after saving
  };

  const onDrop = (acceptedFiles) => {
    if (!title.trim()) {
      // If the title is empty, prevent the function from proceeding
      console.error(
        "Title cannot be empty. Please enter a title before uploading."
      );
      return;
    }

    setUploadedFiles((prevFiles) => {
      // Map the new files into the desired structure
      const filesWithDetails = acceptedFiles.map((file) => {
        // Remove './' from the file path if it exists
        const filePath = file.path || file.name;
        const cleanFilePath = filePath.replace(/^\.\/+/, ""); // Remove leading './'
        return {
          id: Date.now() + Math.random(), // Unique ID
          selectedfile: file,
          file: {
            path: cleanFilePath,
            relativePath: cleanFilePath,
          },
          preview: URL.createObjectURL(file),
        };
      });
      // Check if a group with the same title already exists
      const existingGroupIndex = prevFiles.findIndex(
        (group) => group.title === title
      );
      if (existingGroupIndex !== -1) {
        // If group exists, check for duplicate files before adding
        const existingFiles = prevFiles[existingGroupIndex].files;
        // Filter out duplicate files
        const uniqueFiles = filesWithDetails.filter((newFile) => {
          return !existingFiles.some(
            (existingFile) => existingFile.file.path === newFile.file.path
          );
        });
        // Update the group with the unique files
        prevFiles[existingGroupIndex].files = [
          ...existingFiles,
          ...uniqueFiles,
        ];
        return [...prevFiles]; // Return updated files array
      } else {
        // If no group exists, create a new group with the title
        return [
          ...prevFiles,
          {
            title: title || "Untitled", // Default title if not provided
            files: filesWithDetails, // Add new files to this group
          },
        ];
      }
    });
    // setTitle(""); // Reset the title after upload
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

  const onClickDocumentDeleteButton = (filePath) => {
    setUploadedDocuments(
      (prevDocuments) =>
        prevDocuments
          .map((doc) => ({
            ...doc,
            files: doc.files.filter((file) => file.file.path !== filePath),
          }))
          .filter((doc) => doc.files.length > 0) // Remove empty documents
    );
  };

  /*************************************** set Values *************************************************** */

  //basic information
  const [employee_name, setEmployeeName] = useState("");
  const [employeeid, setEmployeeId] = useState("");

  const [selectedRoles, setSelectedRoles] = useState([]);

  const [selectedDepartmentOption, setSelectedDepartmentOption] =
    useState(null);
  const [selectedEmployeeOption, setSelectedEmployeeTypeOption] =
    useState(null);

  const [employeeDateOfJoin, setEmployeeDateOfJoin] = useState(null);
  const [phone_number, setPhoneNumber] = useState("");

  const [emailaddress, setEmailAddress] = useState("");
  const [employeepassword, setEmployeePassword] = useState("");

  //personal info
  const [personalEmail, setPersonalEmail] = useState("");
  const [passport_number, setPassportNumber] = useState("");
  const [passportExpiryDate, setPassportExpiryDate] = useState(null);
  const [aadhar_no, setAadharNumber] = useState("");
  const [employeeDob, setEmployeeDob] = useState(null);
  const [maritalStatus, setMaritalStatus] = useState("");
  const [spouse_name, setSpouseName] = useState("");
  const [father_name, setFathername] = useState("");
  const [mother_name, setMothername] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  //pf details
  const [uan_number, setUANNumber] = useState("");
  const [pfJoinDate, setPfJoinDate] = useState(null);
  const [pfExpiryDate, setPfExpiryDate] = useState(null);

  //insurance
  const [insurance_number, setInsuranceNumber] = useState("");
  const [insurance_date, handleInsuranceDate] = useState("");
  const [nominee_name, setNomineeName] = useState("");
  const [nomineeaadhar_no, setNomineeAadharNumber] = useState("");

  //emergency contact
  const [emergency_fullname, setEmergencyName] = useState("");
  const [emergencyContact, setemergencyContact] = useState("");
  const [emergency_relationtype, setRelationType] = useState("");
  // const [pf, setPfExpiryDate] = useState(null);

  //bank
  const [account_number, setAccountNumber] = useState("");
  const [gpay_number, setGpayNumber] = useState("");
  const [selectedBankNameOption, setSelectedBankNameOption] = useState(null);
  const [pan_number, setPanNumber] = useState("");
  const [ifsc_code, setIFSCCode] = useState("");
  const [bank_branch, setBankBranch] = useState("");

  //salray
  const [salary_basic, setSalaryBasic] = useState("");
  const [salary_amount, setSalaryAmount] = useState("");
  const [effectivedate, setEffectiveDATE] = useState("");
  const [payment_type, setPaymentType] = useState("");
  const [gender, setGender] = useState("");

  //skills
  const [skills, setSkills] = useState([]);

  const [driveLink, setDriveLink] = useState("");
  //verification doc

  const verificationDocuments = getVerificationDocuments();
  const [error, setError] = useState({});

  const [touched, setTouched] = useState({
    employeeId: true,
    fullName: true,
    phoneNum: true,
    email: true,
    password: true,
    // employeeType:true,
    dateOfJoin: true,
    passportNo: true,
    panNo: true,
    aadharNo: true,
    dob: true,
    MaritalStatus: true,
    spousename: true,
    fathername: true,
    mothername: true,
    address1error: true,
    address2error: true,
    uanNumber: true,
    pfJoinDate: true,
    pfExpiryDate: true,

    emergencyName: true,
    emergencyContact: true,
    emergencyRelationType: true,
    gender: true,
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
    SelectedRolestype: true,
    SelectedDepartmentOption: true,
    UploadPhoto: true,
    employeeType: true,
  });

  // const handleDateChange = async (date) => {
  //   setEmployeeDateOfJoin(date);

  //   try {
  //     const response = await axios.post(`${API_URL}/api/customId`, {
  //       dateofjoining: date.toISOString().split("T")[0], // Format to YYYY-MM-DD
  //     });

  //     setEmployeeId(response.data.employeeid);
  //   } catch (error) {
  //     console.error("Error generating custom ID:", error);
  //   }
  // };

  // // const storedDetatis = localStorage.getItem("hrmsuser");
  // // const parsedDetails = JSON.parse(storedDetatis);
  // const userid = parsedDetails ? parsedDetails.id : null;

  const handleKeyUp = (event) => {
    const inputElement = event.target; // Get the input element

    inputElement.classList.remove("border-red-400");
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

  //experience
  const [workExperiences, setWorkExperiences] = useState([]);

  const [selectedPosition, setSelectedPosition] = useState([]);
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
      setExperienceForm({
        jobTitle: "",
        companyIndustry: "",
        companyName: "",
        previousSalary: "",
        startWork: "",
        endWork: "",
        responsibilities: [],
        selectedDocs: "",
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
  };

  // /////////////////////////////////////////////////
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;
  const aadharRegex = /^\d{12}$/;
  const pancardRegex = /^([A-Z]{5})(\d{4})([A-Z]{1})$/;

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setButtonLoading(true);
    let selectedRolesInArray = selectedRoles.map((item) => item.id);

    const requestBody = {
      photo: selectedImage,
      employeeId: employeeid,

      employeeName: employee_name,

      // position: [7,8],
      // roles: selectedRolesInArray,
      phoneNumber: phone_number,
      email: emailaddress,
      password: employeepassword,
      employeeType: selectedEmployeeOption,
      gender: gender,
      personalEmail: personalEmail,
      // department: selectedDepartmentOption,
      dateOfJoining: employeeDateOfJoin,
      passportNo: passport_number,
      passportExpDate: passportExpiryDate,
      panNo: pan_number,
      aadharNo: aadhar_no,
      internDuration: internMonths,

      dateOfBirth: employeeDob,
      maritalStatus: maritalStatus,
      //pf
      uanNo: uan_number,
      pfJoinDate: pfJoinDate,
      pfExpDate: pfExpiryDate,

      //emergecy contact
      emergencyContact: {
        contact: emergencyContact,
        fullName: emergency_fullname,
        relation: emergency_relationtype,
      },

      //bank details
      bank: {
        accountNo: account_number,
        bankName: selectedBankNameOption,
        gpayNumber: gpay_number,
        branch: bank_branch,
        ifscCode: ifsc_code,
      },

      //salary
      salaryAmount: salary_amount,
      paymentType: payment_type,

      spouseName: spouse_name,
      fatherName: father_name,
      motherName: mother_name,
      address1: address1,
      address2: address2,

      insuraceNo: insurance_number,
      insuraceDate: insurance_date,
      // nominee_name,
      // nominee_aadhar_no: nomineeaadhar_no,

      // salary_basic,

      // effective_date: effectivedate,

      skills: skills,
      // verification_documents: verificationDocuments,
      document: uploadedDocuments,
      experience: workExperiences,

      education: educationInfoS,
      // createdby: userid,

      // documents: uploadedFiles,
      // departmentTypeId: selectedEmployeeTypeId,
      roleId: selectedPositionId,
      employeeType: employeeWorkType,
      driveLink: driveLink,
      gitHubEmail: githubEmailId,
      linkedIn: linkedIn,
    };

    setError("");
    // Validate all fields

    const isFullNameValid = employee_name.trim() !== "" ? true : false;
    const isEmpoyeeIDValid = employeeid.trim() !== "" ? true : false;
    const isPhoneNumValid = phoneRegex.test(phone_number.trim());
    const isEmailValid = emailRegex.test(emailaddress.trim()); // Fixed validation

    const isPasswordValid = employeepassword.trim() !== "" ? true : false;
    const isDateofJoinValid = employeeDateOfJoin !== null ? true : false;
    const ispassportNoValid = passport_number !== "" ? true : false;
    // const isemployeeTypeValid = employeeType.trim() !== '' ? true :false;

    const ispanNumberValid = pancardRegex.test(pan_number.trim());
    const isaadharNumberValid = aadharRegex.test(aadhar_no);
    const isdobValid = employeeDob !== null ? true : false;

    // const isuanNumber = uan_number.trim() !== "" ? true : false;
    // const ispfjoindateValid = pfJoinDate !== null ? true : false;
    // const ispfExpdateValid = pfExpiryDate !== null ? true : false;
    //   const ismaritalStatusValid = maritalStatus !== "" ? true : false;
    //  const isSpouseNameValid =
    // maritalStatus === "Married" ? spouse_name.trim() !== "" : true;

    const ismaritalStatusValid = maritalStatus !== "";
    const isSpouseNameValid =
      maritalStatus === "Married" ? spouse_name.trim() !== "" : true;

    // father details

    const isFathernameValid = father_name !== "" ? true : false;
    const isMothernameValid = mother_name !== "" ? true : false;
    const isAddress1Valid = address1 !== "" ? true : false;
    const isAddress2Valid = address2 !== "" ? true : false;

    const isEmergencyNameValid =
      emergency_fullname.trim() !== "" ? true : false;
    const isEmergencyContactValid = phoneRegex.test(emergencyContact);
    const isRelationTypeValid = emergency_relationtype !== "" ? true : false;

    const isAccountNoValid = account_number !== "" ? true : false;
    const isBankNameValid = selectedBankNameOption !== null ? true : false;

    const isIfscCodeValid = ifsc_code.trim() !== "" ? true : false;
    const isbankBranchValid = bank_branch.trim() !== "" ? true : false;

    const issalaryBasisValid = salary_basic.trim() !== "" ? true : false;
    const issalaryAmountValid = salary_amount.trim() !== "" ? true : false;
    const iseffectiveDateValid = effectivedate !== "" ? true : false;
    const ispaymentTypeValid = payment_type !== "" ? true : false;
    const isselectedEmployeeOption =
      selectedEmployeeOption !== null ? true : false;
    // const isselectedRolesValid = selectedRoles.length > 0 ? true : false;
    const isselectedRolesValid = selectedPositionId !== null ? true : false;
    const isselectedDepartmentOptionValid =
      selectedDepartmentOption !== null ? true : false;

    const isselectedEmployeeTypeId = employeeWorkType !== "" ? true : false;

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
      password: isPasswordValid,
      dateOfJoin: isDateofJoinValid,
      // passportNo: ispassportNoValid,
      // panNo: ispanNumberValid,
      // aadharNo: isaadharNumberValid,
      // dob: isdobValid,
      // MaritalStatus: ismaritalStatusValid,
      // spousename: isSpouseNameValid,

      fathername: true,
      mothername: true,
      address1error: true,
      address2error: true,
      passportNo: true,
      panNo: true,
      aadharNo: true,
      dob: true,
      MaritalStatus: true,
      spousename: true,

      fathername: true,
      mothername: true,
      address1error: true,
      address2error: true,
      // uanNumber: isuanNumber,
      // pfJoinDate: ispfjoindateValid,
      // pfExpiryDate: ispfExpdateValid,
      // emergencyName: isEmergencyNameValid,
      // emergencyContact: isEmergencyContactValid,
      // emergencyRelationType: isRelationTypeValid,
      // accountNumber: isAccountNoValid,
      // BankName: isBankNameValid,
      // ifscCode: isIfscCodeValid,
      // accountbranch: isbankBranchValid,
      emergencyName: true,
      emergencyContact: true,
      emergencyRelationType: true,
      accountNumber: true,
      BankName: true,
      ifscCode: true,
      accountbranch: true,
      // SalaryBasis: issalaryBasisValid,
      salaryAmount: true,
      // EffectiveDate: iseffectiveDateValid,
      PaymentType: true,
      // SelectedEmployeeTypeOption: isselectedEmployeeOption,
      SelectedRolestype: isselectedRolesValid,
      // SelectedDepartmentOption: isselectedDepartmentOptionValid,
      UploadPhoto: isphotovalid,
      employeeType: isselectedEmployeeTypeId,
    };

    // Update touched state
    setTouched(touchedValues);

    // Check if all values are true
    const allValid = Object.values(touchedValues).every(
      (value) => value === true
    );

    // If any field is invalid, return early
    if (!allValid) {
      setButtonLoading(false);
      setErrorMessage("Please fill all the fields.");
      return;
    }

    if (!isEmailValid) {
      setErrorMessage("Invalid email address.");
      return;
    }

    try {
      setErrorMessage("");

      const response = await axios.post(
        `${API_URL}/api/employees/create-employee`,
        requestBody,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        // setSelectedImage(null);
        // setEmployeeId("");
        // setEmployeeName("");
        // setSelectedEmployeeOption("");
        // setSelectedRoles([]);
        // setSelectedRolesInArray([]);
        // setSelectedDepartmentOption("");
        // setEmployeeDateOfJoin("");
        // setPhoneNumber("");
        // setEmergencyContact("");
        // setEmergencyFullName("");
        // setEmergencyRelationType("");

        // setselectedDepartmentOption("");
        // setemployeeDateOfJoin("");
        // setphone_number("");
        // setemergencyContact("");
        // setemergency_fullname("");
        // setemergency_relationtype("");
        // setemailaddress("");
        // setemployeepassword("");
        // setpassport_number("");
        // setpassportExpiryDate("");
        // setaadhar_no("");
        // setemployeeDob("");
        // setmaritalStatus("");
        // setuan_number("");
        // setpfJoinDate("");
        // setpfExpiryDate("");
        // setinsurance_number("");
        // setnominee_name("");
        // setnominee_aadhar_no("");
        // setaccount_number("");
        // setselectedBankNameOption("");
        // setbank_branch("");
        // setpan_number("");
        // setIFSCCode("")
        // setsalary_amount("");
        // setpayment_type("");
        // setskills("");

        // // verification_documents: verificationDocuments,
        // setuploadedDocuments([]);
        // setworkExperiences([]);

        // seteducationInfo([]);
        // setcreatedby(userid);

        setSuccessMessage("Employee created successfully");

        // Navigate to the employees list page
        setTimeout(() => {
          navigate("/employees", { replace: true });
        }, 1000);
      }

      setButtonLoading(false);
    } catch (error) {
      setSuccessMessage("");
      setButtonLoading(false);
      if (error.response && error.response.status) {
        console.log(error);
        setErrorMessage("An error occurred please try again");

        setError(error.response.data.errors || {});
      } else {
        console.error("An error occurred:", error.message);
        setErrorMessage("An error occurred please try again");
      }
    }
  };

  const employeeTypeDropdownRef = useRef(null);
  const rolesDropdownRef = useRef(null);
  // const departmentDropdownRef = useRef(null);
  // const bankNameDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        employeeTypeDropdownRef.current &&
        !employeeTypeDropdownRef.current.contains(event.target)
      ) {
        setEmployeeTypeIsOpen(false);
      }
      if (
        rolesDropdownRef.current &&
        !rolesDropdownRef.current.contains(event.target)
      ) {
        setRolesIsOpen(false);
      }

      if (
        departmentDropdownRef.current &&
        !departmentDropdownRef.current.contains(event.target)
      ) {
        setDepartmentIsOpen(false);
      }
      if (
        bankNameDropdownRef.current &&
        !bankNameDropdownRef.current.contains(event.target)
      ) {
        setBankNameIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  ///////////// employee type/////////////

  const [focusedIndex, setFocusedIndex] = useState(-1);
  const optionsRef = useRef([]);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        employeeTypeDropdownRef.current &&
        !employeeTypeDropdownRef.current.contains(event.target)
      ) {
        setEmployeeTypeIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    const handleKeyDown = (event) => {
      if (!employeeTypeIsOpen) return;

      if (event.key === "ArrowDown" || event.key === "Tab") {
        event.preventDefault();
        moveFocus(1);
      } else if (
        event.key === "ArrowUp" ||
        (event.key === "Tab" && event.shiftKey)
      ) {
        event.preventDefault();
        moveFocus(-1);
      } else if (event.key === "Enter") {
        setEmployeeTypeIsOpen(false);
        event.preventDefault();
        if (focusedIndex !== -1) {
          handleSelect(filteredEmployeeTypeOptions[focusedIndex]); // ✅ Select and close dropdown
          setEmployeeTypeIsOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [employeeTypeIsOpen, focusedIndex]);

  const moveFocus = (direction) => {
    let newIndex = focusedIndex + direction;
    if (newIndex < 0) newIndex = filteredEmployeeTypeOptions.length - 1;
    if (newIndex >= filteredEmployeeTypeOptions.length) newIndex = 0;
    setFocusedIndex(newIndex);
    optionsRef.current[newIndex]?.focus();
  };

  // ✅ New function to handle selection
  const handleSelect = (option) => {
    setSelectedEmployeeTypeOption(option);
    setEmployeeTypeIsOpen(false);
    setFocusedIndex(-1);
    buttonRef.current?.focus(); // Return focus to button after selection
  };

  ////////////// bank name /////////////
  const bankNameDropdownRef = useRef(null);
  const [bankActiveIndex, setBankActiveIndex] = useState(-1);
  const listRef = useRef([]);

  const handleBankKeyDown = (e) => {
    if (!bankNameIsOpen) return;

    if (e.key === "ArrowDown" || e.key === "Tab") {
      e.preventDefault();
      setBankActiveIndex((prevIndex) =>
        prevIndex === filteredBankNametOptions.length - 1 ? 0 : prevIndex + 1
      );
    } else if (e.key === "ArrowUp" || (e.shiftKey && e.key === "Tab")) {
      e.preventDefault();
      setBankActiveIndex((prevIndex) =>
        prevIndex === 0 ? filteredBankNametOptions.length - 1 : prevIndex - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (bankActiveIndex !== -1) {
        handleSelectBankOption(filteredBankNametOptions[bankActiveIndex]);
      }
    }
  };

  useEffect(() => {
    if (bankActiveIndex !== -1 && listRef.current[bankActiveIndex]) {
      listRef.current[bankActiveIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [bankActiveIndex]);

  const handleSelectBankOption = (option) => {
    setSelectedBankNameOption(option);
    setBankNameIsOpen(false); // Close dropdown when option is selected
    setBankActiveIndex(-1);
  };

  const handleDropdownClick = (e) => {
    e.stopPropagation(); // Prevents event bubbling issues
    setBankNameIsOpen(!bankNameIsOpen);
    setTouched({
      ...touched,
      BankName: true,
    });
  };

  const handleEmployeeTypeDropdownClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEmployeeTypeIsOpen(!employeeTypeIsOpen);
  };

  /////////////////// department////////////
  const departmentDropdownRef = useRef(null);
  const [departmentActiveIndex, setDepartmentActiveIndex] = useState(null);
  const departmentListRef = useRef(null);

  // // Handle keyboard navigation inside the dropdown
  // const handleDepartmentKeyDown = (e) => {
  //   if (!departmentIsOpen) return;

  //   if (e.key === "ArrowDown" || e.key === "Tab") {
  //     e.preventDefault();
  //     setDepartmentActiveIndex((prevIndex) =>
  //       prevIndex === filteredDepartmentOptions.length - 1 ? 0 : prevIndex + 1
  //     );
  //   } else if (e.key === "ArrowUp" || (e.shiftKey && e.key === "Tab")) {
  //     e.preventDefault();
  //     setDepartmentActiveIndex((prevIndex) =>
  //       prevIndex === 0 ? filteredDepartmentOptions.length - 1 : prevIndex - 1
  //     );
  //   } else if (e.key === "Enter") {
  //     e.preventDefault();
  //     if (departmentActiveIndex !== -1) {
  //       handleSelectDepartment(filteredDepartmentOptions[departmentActiveIndex]);
  //     }
  //   }
  // };

  // // Scroll into view when navigating
  // useEffect(() => {
  //   if (
  //     departmentActiveIndex !== -1 &&
  //     departmentListRef.current[departmentActiveIndex]
  //   ) {
  //     departmentListRef.current[departmentActiveIndex].scrollIntoView({
  //       behavior: "smooth",
  //       block: "nearest",
  //     });
  //   }
  // }, [departmentActiveIndex]);

  // // Select department option
  // const handleSelectDepartment = (option) => {
  //   setSelectedDepartmentOption(option);
  //   setDepartmentIsOpen(false);
  //   setDepartmentActiveIndex(-1);
  // };

  // // // Handle dropdown click & focus
  // const handleDepartmentDropdownClick = (e) => {
  //   e.stopPropagation();
  //   setDepartmentIsOpen(!departmentIsOpen);
  // };

  //////////// roles //////////////

  const [rolesActiveIndex, setRolesActiveIndex] = useState(-1);
  const rolesListRef = useRef([]);

  const handleRolesKeyDown = (e) => {
    if (!rolesIsOpen) return;

    if (e.key === "ArrowDown" || e.key === "Tab") {
      e.preventDefault();
      setRolesActiveIndex((prevIndex) =>
        prevIndex === filteredRolesOptions.length - 1 ? 0 : prevIndex + 1
      );
    } else if (e.key === "ArrowUp" || (e.shiftKey && e.key === "Tab")) {
      e.preventDefault();
      setRolesActiveIndex((prevIndex) =>
        prevIndex === 0 ? filteredRolesOptions.length - 1 : prevIndex - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (rolesActiveIndex !== -1) {
        handleSelectRole(filteredRolesOptions[rolesActiveIndex]);
      }
    }
  };

  useEffect(() => {
    if (rolesActiveIndex !== -1 && rolesListRef.current[rolesActiveIndex]) {
      rolesListRef.current[rolesActiveIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [rolesActiveIndex]);

  const handleSelectRole = (role) => {
    setSelectedRoles((prev) => {
      const roleExists = prev.find((item) => item.id === role.id);
      if (roleExists) {
        return prev.filter((item) => item.id !== role.id); // Remove if exists
      } else {
        return [...prev, { id: role.id, name: role.name }]; // Add if doesn't exist
      }
    });
  };

  const handleRolesDropdownClick = (e) => {
    e.stopPropagation();
    setRolesIsOpen(!rolesIsOpen);
    setDepartmentIsOpen(false);
    setEmployeeTypeIsOpen(false);
    setTouched({
      ...touched,
      SelectedRolestype: true,
    });
  };

  // change first letter caps
  function formatOption(option) {
    return option
      .split("_") // Split by underscore
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize
      .join(" "); // Join with space
  }

  return (
    <div className="w-screen min-h-screen bg-gray-100 px-5 py-2 md:py-5">
      {loading ? (
        <Loader />
      ) : (
        <>



          <div className="">
            <Mobile_Sidebar />
            
          </div>
          <div className="flex justify-end mt-2 md:mt-0 gap-2 items-center">
              <p
                className="text-xs md:text-sm text-gray-500"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </p>
              <p>{">"}</p>
              <p
                onClick={() => navigate("/employees")}
                className="text-xs md:text-sm text-gray-500 cursor-pointer "
              >
                Employees
              </p>
              <p>{">"}</p>
              <p className="text-xs md:text-sm text-blue-500 ">Create Employees</p>
              {/* <p>{">"}</p> */}
            </div>

          <div>
            <div className="flex flex-col sm:flex-row justify-between mt-2 md:mt-5">
              <p className="text-xl md:text-3xl font-semibold ">Create Employee</p>

              {/* Heading */}
              <div className="flex justify-end gap-5 mt-3 md:mt-8">
                <button
                  onClick={onClickCreateEmployeeCancelButton}
                  className="bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-9 py-1 md:py-2 font-semibold rounded-full"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={buttonLoading}
                  className=" text-white bg-blue-500 hover:bg-blue-600 px-5 md:px-9 py-1 md:py-2 text-sm  md:text-base font-semibold rounded-full"
                >
                  <div className="w-12 h-6 flex items-center justify-center">
                    {buttonLoading ? <Button_Loader /> : "Save"}
                  </div>
                </button>
              </div>
            </div>

            <div className="flex flex-col items-end mt-2">
              {/* <p className="text-red-500 text-sm mt-2">{errorMessage}</p> */}
              <p className="text-red-500 text-sm mt-2">{error.error}</p>
              <p className="text-green-500 text-sm mt-2">{successMessage}</p>
            </div>

            {/*main flex */}
            <div className="flex flex-col  lg:flex-row gap-3 md:my-5">
              {/* leftside bar */}
              <div className="basis-[50vw] flex-grow flex flex-col gap-3 ">
                <div className="rounded-2xl border-2 border-gray-200 bg-white py-2 md:py-4 px-4 lg:px-6">
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
                        src={URL.createObjectURL(selectedImage)}
                        alt="Selected"
                        onClick={() => setOpenImageModal(true)} // Open modal on click
                        className="w-36 h-32 object-cover cursor-pointer  rounded-md"
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
                        value={employee_name}
                        autocomplete="off"
                        onChange={(e) => {
                          setEmployeeName(e.target.value);
                        }}
                        className={`border-2 rounded-xl px-4 h-10  w-full  lg:w-72 ${!touched.fullName ? "border-red-400" : "border-gray-300"
                          }`}
                        onKeyUp={handleKeyUp}
                      />
                    </div>
                    {/* <div className="flex justify-end">
                {" "}
                {!touched.fullName && (
                  <p className="text-red-400 text-sm">
                    Allow.
                  </p>
                )}
              </div> */}

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
                          value={phone_number}
                          onChange={(e) => {
                            setPhoneNumber(e.target.value);
                          }}
                          placeholder="00000-00000"
                          className={` [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 rounded-xl px-4 h-10 " w-full lg:w-72 ${!touched.phoneNum ? "border-red-400" : "border-gray-300"
                            }`}
                          onKeyUp={handleKeyUp}
                        />

                        {error.phone_number && (
                          <p className="text-red-500 text-xs ">
                            {error.phone_number[0]}
                          </p>
                        )}
                        {/* <div className="flex justify-end"> */}

                        {!touched.phoneNum && (
                          <p className="text-red-400 text-sm">
                            Phone Number must be 10 digits.
                          </p>
                        )}
                        {/* </div> */}
                        {/* <input
                      type="number"
                      placeholder="000-000-000"
                      value={emergency_number}
                      onChange={(e) => {
                        setEmergenctNumber(e.target.value);
                      }}
                      className="border-2 h-10 rounded-xl ps-4 border-gray-300 " w-1/2"
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
                        {/* <p className="text-sm">Add employee email</p> */}
                      </div>
                      <div className="flex flex-col gap-1">
                        <input
                          id="EMAIL ADDRESS"
                          type="email"
                          placeholder="@example.com"
                          value={emailaddress}
                          onChange={(e) => {
                            setEmailAddress(e.target.value);
                          }}
                          className={`border-2 rounded-xl px-4 h-10 " w-full lg:w-72 ${!touched.email ? "border-red-400" : "border-gray-300"
                            }`}
                          onKeyUp={handleKeyUp}
                        />

                        {!touched.email && (
                          <p className="text-red-400 text-sm">
                            Invalid Email Format.
                          </p>
                        )}
                      </div>
                    </div>
                    {error.email && (
                      <p className="text-red-500 text-sm ">{error.email}</p>
                    )}

                    {/* create password */}
                    <div className="flex flex-col xl:flex-row justify-between gap-1">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label
                          className="font-medium text-sm"
                          htmlFor="CREATE PASSWORD"
                        >
                          CREATE PASSWORD <span className="text-red-500">*</span>
                        </label>
                        {/* <p className="text-sm">Add employee password</p> */}
                      </div>
                      <div className="relative w-full lg:w-72">
                        <input
                          id="CREATE PASSWORD"
                          value={employeepassword}
                          onChange={(e) => {
                            setEmployeePassword(e.target.value);
                          }}
                          type={showPassword ? "text" : "password"}
                          placeholder="#@ABCaba1214"
                          className={`border-2 h-10 rounded-xl px-4 border-gray-300  w-full pr-10 
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
                    </div>

                    <div className="flex flex-col xl:flex-row justify-between gap-1">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label className="font-medium text-sm">
                          EMPLOYEE TYPE <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="relative w-full lg:w-72">
                        <select
                          name=""
                          id=""
                          className={`w-full py-2 px-5 text-left border-2 border-gray-300 rounded-xl shadow-sm flex justify-between items-center cursor-pointer
                         ${!touched.employeeType
                              ? "border-red-400"
                              : "border-gray-300"
                            }`}
                          value={employeeWorkType}
                          onChange={(e) => setEmployeeWorkType(e.target.value)}
                        >
                          <option value="" selected disabled>
                            Choose Type
                          </option>
                          <option value="Intern">Internship</option>
                          <option value="Full Time">Employee</option>
                          <option value="Part Time">Part Time</option>
                          <option value="Freelancer">Freelancer</option>
                        </select>
                      </div>
                    </div>

                    {employeeWorkType === "Intern" && (
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
                          value={internMonths}
                          onChange={(e) => setInternMonths(e.target.value)}
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

                    {/* <div className="flex flex-col xl:flex-row justify-between gap-1">
                  <label className="font-medium text-sm">Department</label>
                  <div
                    className="relative w-full lg:w-72"
                    ref={employeeTypeRef}
                  >
                    <button
                      onClick={() => setEmployeeTypeIsOpen(!employeeTypeIsOpen)}
                      className="w-full py-2 px-5 rounded-xl border-2 flex justify-between items-center shadow-sm border-gray-300"
                    >
                      {selectedEmployeeTypeId
                        ? employeeTypeOptions.find(
                            (opt) => opt._id === selectedEmployeeTypeId
                          )?.name
                        : "Choose Department"}
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
                </div> */}

                    <div className="flex flex-col xl:flex-row justify-between gap-1">
                      <label className="font-medium text-sm">
                        ROLES <span className="text-red-500">*</span>
                      </label>
                      <div
                        className="relative w-full lg:w-72"
                        ref={roleDropdownRef}
                      >
                        <button
                          onClick={() => setPositionIsOpen(!positionIsOpen)}
                          className={`w-full py-2 px-5 text-left border-2  rounded-xl shadow-sm flex justify-between items-center
                         ${!touched.SelectedRolestype
                              ? "border-red-400 "
                              : "border-gray-300"
                            }`}
                        >
                          {selectedPositionId
                            ? positionOptions.find(
                              (r) => r._id === selectedPositionId
                            )?.name
                            : "Choose Position"}
                          {positionIsOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                        </button>

                        {positionIsOpen && (
                          <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {positionOptions.map((role) => (
                              <li
                                key={role._id}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                  setSelectedPositionId(role._id);
                                  setPositionIsOpen(false);
                                }}
                              >
                                {role.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* Department */}

                    {/* <div className="flex flex-col xl:flex-row justify-between gap-1">
                  <div className="flex flex-col w-full sm:w-auto">
                    <label
                      className="font-medium text-sm"
                      onClick={() => {
                        setDepartmentIsOpen(!departmentIsOpen);
                        setEmployeeTypeIsOpen(false);
                        setRolesIsOpen(false);
                        setTouched({
                          ...touched,
                          SelectedDepartmentOption: true,
                        });
                      }}
                    >
                      DEPARTMENT
                    </label>
                    <p className="text-sm">Choose department</p>
                  </div>

                  <div
                    className={`relative border-2 rounded-xl px-4 border-gray-300 outline-none w-full  lg:w-72 ${
                      !touched.SelectedDepartmentOption
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                    ref={departmentDropdownRef}
                  >
                    <button
                      onClick={() => {
                        setDepartmentIsOpen(!departmentIsOpen);
                        setEmployeeTypeIsOpen(false);
                        setRolesIsOpen(false);
                        setTouched({
                          ...touched,
                          SelectedDepartmentOption: true,
                        });
                      }}
                      className={`w-full ${
                        selectedDepartmentOption
                          ? "text-black"
                          : "text-gray-400"
                      } py-2 text-left bg-white rounded-lg shadow-sm focus:outline-none flex justify-between items-center`}
                    >
                      {selectedDepartmentOption || "Choose department"}
                      {rolesIsOpen ? (
                        <IoIosArrowUp className=" text-black" />
                      ) : (
                        <IoIosArrowDown className=" text-black" />
                      )}
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
                            filteredDepartmentOptions.map((option, index) => (
                              <li
                                key={index}
                                onClick={() => {
                                  setSelectedDepartmentOption(option);
                                  setDepartmentIsOpen(false);
                                }}
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
                </div> */}

                    {/* <div className="flex flex-col xl:flex-row justify-between gap-1">
      <div className="flex flex-col w-full sm:w-auto">
        <label
          className="font-medium text-sm"
          onClick={() => setDepartmentIsOpen(true)}
        >
          DEPARTMENT
        </label>
       
      </div>

      <div
        className={`relative   w-full lg:w-72`}
        ref={departmentDropdownRef}
      >
        <button
          onFocus={() => setDepartmentIsOpen(!departmentIsOpen)}
          onMouseDown={() => handleDepartmentDropdownClick(e)}
          className={`w-full ${
            selectedDepartmentOption ? "text-black" : "text-gray-400"
          } py-2 text-left px-4 rounded-xl  border-2 ${departmentIsOpen && 'border-black' }  bg-white    flex justify-between items-center`}
          tabIndex={0}
        >
          {selectedDepartmentOption || "Choose department"}
          {departmentIsOpen ? (
            <IoIosArrowUp className="text-black" />
          ) : (
            <IoIosArrowDown className="text-black" />
          )}
        </button>

        {departmentIsOpen && (
          <div
            className="absolute mt-1 left-0 z-10 w-full bg-white border border-gray-300 shadow-lg"
            onKeyDown={handleDepartmentKeyDown} // ✅ Now the event listener is inside the dropdown
          >
            <input
              type="text"
              value={searchedDepartment}
              onChange={(e) => setSearchedDepartment(e.target.value)}
              placeholder="Search..."
              className="w-full px-4 py-2 border-b border-gray-200 focus:outline-none"
              tabIndex={0}
            />
            <ul className="max-h-48 overflow-y-auto">
              {filteredDepartmentOptions.length > 0 ? (
                filteredDepartmentOptions.map((option, index) => (
                  <li
                    key={index}
                    ref={(el) => (departmentListRef.current[index] = el)}
                    onClick={() => handleSelectDepartment(option)}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                      departmentActiveIndex === index ? "bg-gray-200" : ""
                    }`}
                    tabIndex={0}
                    onFocus={() => setDepartmentActiveIndex(index)}
                  >
                    {option}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500">No results found</li>
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
                          onClick={() => {
                            setTouched({
                              ...touched,
                              dateOfJoin: true,
                            });
                          }}
                        >
                          DATE OF JOINING <span className="text-red-500">*</span>
                        </label>
                        {/* <p className="text-sm">employee's date of join</p> */}
                      </div>

                      <div className="relative  lg:w-72">
                        <DatePicker
                          id="DATE OF JOINING"
                          placeholderText="Employee date of join"
                          className={`border-2 rounded-xl h-10 px-4 w-full lg:w-72  block  ${!touched.dateOfJoin
                              ? "border-red-400"
                              : "border-gray-300"
                            }`}
                          onKeyUp={handleKeyUp}
                          selected={employeeDateOfJoin}
                          onChange={handleDateChange}
                          dateFormat="dd/MM/yyyy"
                          showYearDropdown={true}
                        />
                      </div>
                    </div>

                    {/* employee id */}
                    <div className="flex flex-col xl:flex-row justify-between gap-1">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label
                          className="font-medium text-sm"
                          htmlFor="employeeid"
                          id="employeeid"
                          name="employeeid"
                          aria-readonly
                        >
                          EMPLOYEE ID <span className="text-red-500">*</span>
                        </label>
                        {/* <p className="text-sm">Add employee id</p> */}
                      </div>
                      <input
                        id="employeeid"
                        type="text"
                        placeholder="Employee ID"
                        value={employeeid}
                        onChange={(e) => {
                          setEmployeeId(e.target.value);
                        }}
                        className={`border-2 rounded-xl px-4 h-10  w-full  lg:w-72 ${!touched.employeeId ? "border-red-400" : "border-gray-300"
                          }`}
                        onKeyUp={handleKeyUp}
                      />
                    </div>

                    {/* Github email id */}
                    <div className="flex flex-col xl:flex-row justify-between gap-1">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label
                          className="font-medium text-sm"
                          htmlFor="githubemail"
                          id="githubemail"
                          name="githubemail"
                          aria-readonly
                        >
                          Github Email Address
                        </label>
                        {/* <p className="text-sm">Add employee id</p> */}
                      </div>
                      <input
                        id="githubemail"
                        type="email"
                        placeholder="Github Email Address"
                        value={githubEmailId}
                        onChange={(e) => {
                          setGithubEmailId(e.target.value);
                        }}
                        className={`border-2 rounded-xl px-4 h-10  w-full  lg:w-72 border-gray-300
                    `}
                        onKeyUp={handleKeyUp}
                      />
                    </div>
                    {/* linked in */}

                    <div className="flex flex-col xl:flex-row justify-between gap-1">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label
                          className="font-medium text-sm"
                          htmlFor="linkedIn"
                          id="linkedIn"
                          name="linkedIn"
                          aria-readonly
                        >
                          linkedIn Url
                        </label>
                        {/* <p className="text-sm">Add employee id</p> */}
                      </div>
                      <input
                        id="linkedIn"
                        type="email"
                        placeholder="Github Email Address"
                        value={linkedIn}
                        onChange={(e) => {
                          setLinkedIn(e.target.value);
                        }}
                        className={`border-2 rounded-xl px-4 h-10  w-full  lg:w-72 border-gray-300
                    `}
                        onKeyUp={handleKeyUp}
                      />
                    </div>
                  </div>

                  <hr className="my-5" />

                  <p className="text-xl font-semibold">Personal Info</p>
                  {/*Gender */}
                  <div className="flex flex-col gap-4 mt-4">
                    <div className="flex flex-col xl:flex-row justify-between gap-1">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label className="font-medium text-sm" htmlFor="GENDER">
                          GENDER
                        </label>
                      </div>
                      <select
                        id="GENDER"
                        name="GENDER"
                        className={`border-2 rounded-xl px-4 h-10  w-full lg:w-72 ${!touched.gender ? "border-red-400" : "border-gray-300"
                          }`}
                        onChange={(e) => {
                          setGender(e.target.value);
                          setTouched({
                            ...touched,
                            gender: true,
                          });
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            console.log("Enter pressed on:", e.target.value);
                          }
                          if (e.key === "Tab") {
                            console.log("Tab pressed, moving to the next element.");
                          }
                        }}
                      >
                        <option value="" disabled selected>
                          Select
                        </option>
                        <option value="male">MALE</option>
                        <option value="female">FEMALE</option>
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
                        {/* <p className="text-sm">Add passport No</p> */}
                      </div>
                      <input
                        id="PASSPORT NO."
                        type="text"
                        placeholder="Passport No."
                        value={passport_number}
                        onChange={(e) => {
                          setPassportNumber(e.target.value);
                        }}
                        className={` border-2 h-10 rounded-xl px-4   w-full  lg:w-72 ${!touched.passportNo ? "border-red-400" : "border-gray-300"
                          }`}
                        onKeyUp={handleKeyUp}
                      />
                    </div>

                    <div className="flex flex-col xl:flex-row justify-between gap-1">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label className="font-medium text-sm" htmlFor="empEmail">
                          EMAIL ADDRESS
                        </label>
                        {/* <p className="text-sm">Add passport No</p> */}
                      </div>
                      <input
                        id="empEmail"
                        type="email"
                        placeholder="Employee Personal Email"
                        value={personalEmail}
                        onChange={(e) => {
                          setPersonalEmail(e.target.value);
                        }}
                        className={` border-2 h-10 rounded-xl px-4   w-full  lg:w-72 border-gray-300`}
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
                        {/* <p className="text-sm">Add Pan No</p> */}
                      </div>
                      <div className="flex flex-col gap-1">
                        <input
                          type="text"
                          className={`border-2 rounded-xl h-10 px-4 border-gray-300  w-full lg:w-72  ${!touched.panNo ? "border-red-400" : "border-gray-300"
                            }`}
                          onKeyUp={handleKeyUp}
                          placeholder="Pan Number"
                          value={pan_number}
                          onChange={(e) => {
                            setPanNumber(e.target.value);
                          }}
                        />
                        {!touched.panNo && (
                          <p className="text-red-400 text-sm">
                            Invalid Pan Number Format.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Aadhar No */}
                    <div className="flex flex-col xl:flex-row justify-between gap-1">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label className="font-medium text-sm" htmlFor="AADHAR NO">
                          AADHAR NO
                        </label>
                        {/* <p className="text-sm">Add Aadhar No</p> */}
                      </div>

                      <div className="flex flex-col gap-1">
                        <input
                          id="AADHAR NO"
                          type="number"
                          placeholder="Aadhar No"
                          value={aadhar_no}
                          onChange={(e) => {
                            setAadharNumber(e.target.value);
                          }}
                          onKeyUp={handleKeyUp}
                          className={` [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 h-10 rounded-xl px-4 border-gray-300  w-full  lg:w-72  ${!touched.aadharNo ? "border-red-400" : "border-gray-300"
                            }`}
                        />
                        {!touched.aadharNo && (
                          <p className="text-red-400 text-sm">
                            Aadhar no must contain 12 digits.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="flex flex-col xl:flex-row justify-between gap-1">
                      <div className="flex flex-col w-full sm:w-auto">
                        <label
                          className="font-medium text-sm"
                          htmlFor="DATE OF BIRTH"
                          onClick={() =>
                            setTouched({
                              ...touched,
                              dob: true,
                            })
                          }
                        >
                          DATE OF BIRTH
                        </label>
                        {/* <p className="text-sm">Choose employee's DOB</p> */}
                      </div>
                      <div className="relative">
                        <DatePicker
                          id="DATE OF BIRTH"
                          placeholderText="Choose DOB"
                          className={`border-2 rounded-xl h-10 px-4 border-gray-300  w-full lg:w-72 ${!touched.dob ? "border-red-400" : "border-gray-300"
                            }`}
                          onKeyUp={handleKeyUp}
                          selected={employeeDob}
                          onChange={handleDateofBirth}
                          dateFormat="dd/MM/yyyy"
                          showYearDropdown={true}
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
                          className={`border-2 rounded-xl h-10 px-4 border-gray-300  w-full lg:w-72  ${!touched.fathername
                              ? "border-red-400"
                              : "border-gray-300"
                            }`}
                          onKeyUp={handleKeyUp}
                          placeholder="Father name"
                          value={father_name}
                          onChange={(e) => {
                            setFathername(e.target.value);
                          }}
                        />
                        {!touched.fathername && (
                          <p className="text-red-400 text-sm">Enter Father name</p>
                        )}
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
                          className={`border-2 rounded-xl h-10 px-4 border-gray-300  w-full lg:w-72  ${!touched.mothername
                              ? "border-red-400"
                              : "border-gray-300"
                            }`}
                          onKeyUp={handleKeyUp}
                          placeholder="Mother name"
                          value={mother_name}
                          onChange={(e) => {
                            setMothername(e.target.value);
                          }}
                        />
                        {!touched.mothername && (
                          <p className="text-red-400 text-sm">Enter Mother name</p>
                        )}
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
                          className={`border-2 rounded-xl h-10 px-4 border-gray-300  w-full lg:w-72  ${!touched.address1error
                              ? "border-red-400"
                              : "border-gray-300"
                            }`}
                          onKeyUp={handleKeyUp}
                          placeholder="Enter Address"
                          value={address1}
                          onChange={(e) => {
                            setAddress1(e.target.value);
                          }}
                        />
                        {!touched.address1error && (
                          <p className="text-red-400 text-sm">Enter Address1</p>
                        )}
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
                          className={`border-2 rounded-xl h-10 px-4 border-gray-300  w-full lg:w-72  ${!touched.address2error
                              ? "border-red-400"
                              : "border-gray-300"
                            }`}
                          onKeyUp={handleKeyUp}
                          placeholder="Enter Address"
                          value={address2}
                          onChange={(e) => {
                            setAddress2(e.target.value);
                          }}
                        />
                        {!touched.address2error && (
                          <p className="text-red-400 text-sm">Enter Address2</p>
                        )}
                      </div>
                    </div>

                    {/* marital status */}
                    <div className="flex flex-col xl:flex-row justify-between gap-1 ">
                      <div className="flex flex-col  w-full sm:w-auto">
                        <label className="font-medium text-sm">
                          MARITAL STATUS
                        </label>
                        {/* <p className="text-sm">Choose option </p> */}
                      </div>
                      <div className="flex flex-col gap-1">
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
                                setTouched({
                                  ...touched,
                                  MaritalStatus: true,
                                });
                              }}
                            />
                            <label htmlFor="Single" className="tex-sm font-medium">
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
                                setTouched({
                                  ...touched,
                                  MaritalStatus: true,
                                });
                              }}
                            />
                            <label htmlFor="Married" className="tex-sm font-medium">
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
                            setTouched({
                              ...touched,
                              MaritalStatus: true,
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

                        {!touched.MaritalStatus && (
                          <p className="text-red-400 text-sm">
                            Please Choose Marital Status.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* spouse */}

                    {/* {maritalStatus === "Married" && (
                  <div className="flex flex-col xl:flex-row justify-between gap-1 mt-4">
                    <div className="flex flex-col w-full sm:w-auto">
                      <label
                        className="font-medium text-sm"
                        htmlFor="SPOUSE_NAME"
                      >
                        SPOUSE NAME
                      </label>
                    </div>
                    <div className="flex flex-col gap-1">
                      <input
                        type="text"
                        id="SPOUSE_NAME"
                        className={`border-2 rounded-xl h-10 px-4 w-full lg:w-72 ${
                          !touched.spousename
                            ? "border-red-400"
                            : "border-gray-300"
                        }`}
                        placeholder="Spouse name"
                        value={spouse_name}
                        onChange={(e) => setSpouseName(e.target.value)}
                        onKeyUp={handleKeyUp}
                      />
                      {!touched.spousename && (
                        <p className="text-red-400 text-sm">
                          Enter Spouse name
                        </p>
                      )}
                    </div>
                  </div>
                )} */}
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 lg:px-6 ">
                  <p className="text-xl font-semibold ">PF Info</p>

                  <div className="flex flex-col gap-4 mt-4">
                    <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                      <div className="flex flex-col">
                        <label className="font-medium text-sm" htmlFor="UAN NO">
                          UAN NO
                        </label>
                        {/* <p className="text-sm">Add UAN NO.</p> */}
                      </div>

                      <div className="flex flex-col gap-1 ">
                        <input
                          id="UAN NO"
                          type="number"
                          placeholder="UAN No"
                          value={uan_number}
                          onChange={(e) => {
                            setUANNumber(e.target.value);
                          }}
                          className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 rounded-xl px-4 h-10   w-full  lg:w-72 border-gray-300`}
                          onKeyUp={handleKeyUp}
                        />

                        {error.uan_number && (
                          <p className="text-red-500 text-sm ">
                            {error.uan_number[0]}
                          </p>
                        )}
                      </div>
                    </div>

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
                          className={`border-2 rounded-xl h-10 px-4   w-full lg:w-72 border-gray-300`}
                          onKeyUp={handleKeyUp}
                          selected={pfJoinDate}
                          onChange={handlePfJoinDate}
                          dateFormat="dd/MM/yyyy"
                          showYearDropdown={true}
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
                          className={`border-2 rounded-xl h-10 px-4   w-full lg:w-72 border-gray-300`}
                          onKeyUp={handleKeyUp}
                          selected={pfExpiryDate}
                          onChange={handlePfExpDate}
                          dateFormat="dd/MM/yyyy"
                          showYearDropdown={true}
                          minDate={pfJoinDate}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 lg:px-6">
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
                        value={emergency_fullname}
                        onChange={(e) => {
                          setEmergencyName(e.target.value);
                        }}
                        className={`border-2 rounded-xl px-4   h-10 w-full  lg:w-72 ${!touched.emergencyName
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
                          value={emergencyContact}
                          onChange={(e) => {
                            setemergencyContact(e.target.value);
                          }}
                          className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 rounded-xl px-4 border-gray-300  h-10 w-full  lg:w-72 ${!touched.emergencyContact
                              ? "border-red-400"
                              : "border-gray-300"
                            }`}
                          onKeyUp={handleKeyUp}
                        />
                        {!touched.emergencyContact && (
                          <p className="text-red-400 text-sm">
                            Phone Number must be 10 digits.
                          </p>
                        )}
                      </div>
                    </div>{" "}
                    <div className="flex flex-col xl:flex-row gap-1 justify-between    relative">
                      <div className="flex flex-col sm:flex-row w-full gap-1 flex-wrap  justify-between">
                        <label className="font-medium text-sm">RELATION TYPE</label>
                        <div className="flex flex-col gap-1">
                          <div className="flex flex-wrap gap-x-4 gap-y-2">
                            <div className="flex items-center gap-1">
                              <input
                                type="radio"
                                name="RELATION"
                                id="Father"
                                value="Father"
                                onChange={(e) => {
                                  setRelationType(e.target.value);
                                  setTouched({
                                    ...touched,
                                    emergencyRelationType: true,
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
                                onChange={(e) => {
                                  setRelationType(e.target.value);
                                  setTouched({
                                    ...touched,
                                    emergencyRelationType: true,
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
                                onChange={(e) => {
                                  setRelationType(e.target.value);
                                  setTouched({
                                    ...touched,
                                    emergencyRelationType: true,
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
                                onChange={(e) => {
                                  setRelationType(e.target.value);
                                  setTouched({
                                    ...touched,
                                    emergencyRelationType: true,
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

                          {!touched.emergencyRelationType && (
                            <p className="text-red-400 text-sm">
                              Please Choose Relation Type.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 lg:px-6">
                  <p className="text-xl font-semibold">Education Info</p>

                  {/* List Education Info */}
                  <div className="mt-5">
                    {educationInfo.map((info, index) => (
                      <div key={index} className="flex justify-between">
                        <div className=" px-2  flex flex-col ">
                          <p className="font-semibold">{info.schoolName}</p>
                          <p className="text-sm font-medium text-gray-500">
                            {info.departmentName}
                          </p>
                          <p className="text-sm font-medium text-gray-500">
                            {info.period}
                          </p>
                          <hr className="my-3" />
                        </div>
                        <IoClose
                          onClick={() => onClickEducationInfoDelete(index)}
                          className="ms-20 text-red-500 text-2xl cursor-pointer "
                        />
                      </div>
                    ))}
                  </div>
                  {/* Add Work Education */}
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
                <div className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 lg:px-6">
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
                          placeholder="Enter account number"
                          value={account_number}
                          onChange={(e) => {
                            setAccountNumber(e.target.value);
                            setTouched({
                              ...touched,
                              accountNumber: true,
                            });
                          }}
                          className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 h-10 rounded-xl px-4 border-gray-300  w-full lg:w-52   ${!touched.accountNumber
                              ? "border-red-400 "
                              : "border-gray-300"
                            }`}
                          onKeyUp={handleKeyUp}
                        />

                        {error["bank.accountNo"] && (
                          <p className="text-red-500 text-xs ">
                            {error["bank.accountNo"]}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* bank name */}
                    {/* og code */}
                    {/* <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                  <div className="flex flex-col">
                    <label
                      className="font-medium text-sm"
                      onClick={() => {
                        setBankNameIsOpen(!bankNameIsOpen);
                      }}
                    >
                      BANK NAME
                    </label>
                    <p className="text-sm">Bank Name</p>
                  </div>

                  <div
                    className={`relative w-full lg:w-52 border-2 rounded-xl px-4 border-gray-300  ${
                      !touched.BankName ? "border-red-400 " : "border-gray-300"
                    }`}
                    ref={bankNameDropdownRef}
                  >
                    <button
                      onClick={() => {
                        setBankNameIsOpen(!bankNameIsOpen);
                        setTouched({
                          ...touched,
                          BankName: true,
                        });
                      }}
                      className={`w-full ${
                        selectedBankNameOption ? "text-black" : "text-gray-400"
                      } py-2 text-left bg-white  rounded-lg shadow-sm focus:outline-none flex justify-between items-center`}
                    >
                      {selectedBankNameOption || "Choose bank"}
                      {bankNameIsOpen ? (
                        <IoIosArrowUp className=" text-black" />
                      ) : (
                        <IoIosArrowDown className=" text-black" />
                      )}
                    </button>

                    {bankNameIsOpen && (
                      <div className="absolute left-0 z-10 w-full  bg-white border border-gray-300 rounded-lg shadow-lg">
                        <input
                          type="text"
                          value={searchedBankName}
                          onChange={(e) => setSearchedBankName(e.target.value)}
                          className="w-full px-4 py-2 border-b border-gray-200 focus:outline-none"
                        />
                        <ul className="max-h-48 overflow-y-auto">
                          {filteredBankNametOptions.length > 0 ? (
                            filteredBankNametOptions.map((option, index) => (
                              <li
                                key={index}
                                onClick={() => {
                                  setSelectedBankNameOption(option); // Update selected option
                                  setBankNameIsOpen(false);
                                }}
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
                </div> */}

                    {/* gpay or phonepay */}

                    <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                      <div className="flex flex-col">
                        <label
                          className="font-medium text-sm text-transform: uppercase"
                          htmlFor="BANK gpay NO"
                        >
                          Gpay number / phone pay number
                        </label>
                        {/* <p className="text-sm">Bank gpay NO.</p> */}
                      </div>
                      <div className="flex flex-col justify-end">
                        <input
                          id="BANK gpay NO"
                          type="number"
                          placeholder="Enter  number"
                          value={gpay_number}
                          onChange={(e) => {
                            setGpayNumber(e.target.value);
                            setTouched({
                              ...touched,
                              accountNumber: true,
                            });
                          }}
                          className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 h-10 rounded-xl px-4 border-gray-300  w-full lg:w-52   ${!touched.accountNumber
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

                    <div className="flex flex-col xl:flex-row gap-1 justify-between">
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
                        className={`relative w-full lg:w-52  xx`}
                        ref={bankNameDropdownRef}
                      >
                        <button
                          onFocus={() => setBankNameIsOpen(true)} // Open on focus
                          onMouseDown={handleDropdownClick}
                          onKeyDown={handleBankKeyDown}
                          className={`w-full ${selectedBankNameOption ? "text-black" : "text-gray-400"
                            } py-2 px-4  text-left rounded-xl  bg-white  focus:outline-black  outline-1 border-2  border-gray-300  flex justify-between items-center ${bankNameIsOpen ? "border-black" : ""
                            } ${!touched.BankName ? "border-red-400" : "border-gray-300"
                            } `}
                          tabIndex={0}
                          style={{
                            color: selectedBankNameOption ? "black" : "gray",
                          }}
                        >
                          {selectedBankNameOption || "Choose bank"}
                          {bankNameIsOpen ? (
                            <IoIosArrowUp className=" text-black" />
                          ) : (
                            <IoIosArrowDown className=" text-black" />
                          )}
                        </button>

                        {bankNameIsOpen && (
                          <div className="absolute mt-1 left-0 z-10 w-full bg-white border border-gray-300  shadow-lg">
                            <input
                              type="text"
                              value={searchedBankName}
                              onChange={(e) => setSearchedBankName(e.target.value)}
                              className="w-full px-4 py-2 border-b border-gray-200 focus:outline-none"
                              placeholder="Search..."
                              tabIndex={0}
                            />

                            <ul className="max-h-48 overflow-y-auto">
                              {filteredBankNametOptions.length > 0 ? (
                                filteredBankNametOptions.map((option, index) => (
                                  <li
                                    key={index}
                                    ref={(el) => (listRef.current[index] = el)} // Store the ref for each item
                                    onClick={() => handleSelectBankOption(option)}
                                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${bankActiveIndex === index ? "bg-gray-200" : ""
                                      }`}
                                    tabIndex={0}
                                    onKeyDown={handleBankKeyDown}
                                    onFocus={() => setBankActiveIndex(index)}
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
                        value={bank_branch}
                        onChange={(e) => setBankBranch(e.target.value)}
                        className={`border-2 rounded-xl h-10 px-4 w-full lg:w-52   ${!touched.accountbranch
                            ? "border-red-400 "
                            : "border-gray-300"
                          }`}
                        onKeyUp={handleKeyUp}
                      />
                    </div>

                    <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                      <div className="flex flex-col">
                        <label className="font-medium text-sm" htmlFor="IFSC CODE">
                          IFSC CODE
                        </label>
                        {/* <p className="text-sm">IFSC CODE</p> */}
                      </div>
                      <input
                        id="IFSC CODE"
                        type="text"
                        placeholder="Ente IFSC code"
                        value={ifsc_code}
                        onChange={(e) => {
                          setIFSCCode(e.target.value);
                        }}
                        className={`border-2 rounded-xl h-10 px-4 w-full lg:w-52 border-gray-300   ${!touched.ifscCode ? "border-red-400 " : "border-gray-300"
                          }`}
                        onKeyUp={handleKeyUp}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 lg:px-6">
                  <p className="text-xl font-semibold">Salary Information</p>

                  <div className="flex flex-col gap-3 mt-4">
                    {/* <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
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
                    value={salary_basic}
                    onChange={(e) => {
                      setSalaryBasic(e.target.value);
                    }}
                    className={` [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 rounded-xl px-4 h-10  outline-none w-full lg:w-52 ${
                      !touched.SalaryBasis
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
                        type="number"
                        placeholder="Enter Salary"
                        value={salary_amount}
                        onChange={(e) => {
                          setSalaryAmount(e.target.value);
                        }}
                        onKeyUp={handleKeyUp}
                        className={` [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 rounded-xl px-4 h-10 border-gray-300  w-full lg:w-52 ${!touched.salaryAmount
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
                    className="border-2 rounded-xl ps-4 h-10 border-gray-300 outline-none w-full lg:w-52"
                  /> */}
                    {/* 
                  <div className="relative">
                    <DatePicker
                      id="Exp date"
                      placeholderText="Effective Date"
                      className={`border-2 rounded-xl h-10 px-4 outline-none w-full lg:w-52 ${
                        !touched.EffectiveDate
                          ? "border-red-400"
                          : "border-gray-300"
                      }`}
                      onKeyUp={handleKeyUp}
                      selected={effectivedate}
                      onChange={handleEFffectiveDate}
                    />
                  </div>
                </div>  */}

                    <div className="flex flex-col xl:flex-row justify-between  ">
                      <div className="flex flex-col">
                        <label
                          className="font-medium text-sm"
                          htmlFor="PAYMENT TYPE"
                        >
                          PAYMENT TYPE
                        </label>
                        {/* <p className="text-sm">Payment Type</p> */}
                      </div>
                      {/* <input
                    id="PAYMENT TYPE"
                    type="text"
                    placeholder="Enter payment type"
                    value={payment_type}
                    onChange={(e) => {
                      setPaymentType(e.target.value);
                      setTouched({
                        ...touched,
                        PaymentType: true,
                      });
                    }}
                    className={`border-2 rounded-xl px-4 h-10 outline-none w-full lg:w-52 ${
                      !touched.PaymentType
                        ? "border-red-400 "
                        : "border-gray-300"
                    }`}
                  /> */}
                      {/* <select
                    name=""
                    id="PAYMENT TYPE"
                    className={`border-2 rounded-xl px-4 h-10 outline-none w-full lg:w-52   ${
                      !touched.PaymentType
                        ? "border-red-400 "
                        : "border-gray-300"
                    }`}
                    onChange={(e) => {
                      setPaymentType(e.target.value);
                      setTouched({
                        ...touched,
                        PaymentType: true,
                      });
                    }}
                  >
                    <option value="" disabled selected>
                      Select
                    </option>
                    <option value="UPI">UPI</option>
                    <option value="BANK">BANK</option>
                    <option value="CASH">CASH</option>
                  </select> */}
                      <select
                        id="PAYMENT TYPE"
                        name="PAYMENT TYPE"
                        className={`border-2 rounded-xl px-4 h-10  w-full lg:w-52 ${!touched.PaymentType
                            ? "border-red-400"
                            : "border-gray-300"
                          }`}
                        onChange={(e) => {
                          setPaymentType(e.target.value);
                          setTouched({
                            ...touched,
                            PaymentType: true,
                          });
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            console.log("Enter pressed on:", e.target.value);
                          }
                          if (e.key === "Tab") {
                            console.log("Tab pressed, moving to the next element.");
                          }
                        }}
                      >
                        <option value="" disabled selected>
                          Select
                        </option>
                        <option value="UPI">UPI</option>
                        <option value="BANK">BANK</option>
                        <option value="CASH">CASH</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 lg:px-6">
                  <p className="text-xl font-semibold">Insurance Information</p>

                  <div className="flex flex-col gap-3 mt-4">
                    <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                      <div className="flex flex-col">
                        <label
                          className="font-medium text-sm text-transform: uppercase"
                          htmlFor="INSURANCE NO"
                        >
                          Insurance No
                        </label>
                        {/* <p className="text-sm">Per Month</p> */}
                      </div>
                      <input
                        id="INSURANCE NO"
                        type="number"
                        placeholder="Enter Insurance"
                        value={insurance_number}
                        onChange={(e) => {
                          setInsuranceNumber(e.target.value);
                        }}
                        onKeyUp={handleKeyUp}
                        className={` [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 rounded-xl px-4 h-10 border-gray-300  w-full lg:w-52 ${!touched.salaryAmount
                            ? "border-red-400 "
                            : "border-gray-300"
                          }`}
                      />
                    </div>
                    <div className="flex flex-col xl:flex-row gap-1 justify-between  ">
                      <div className="flex flex-col">
                        <label
                          className="font-medium text-sm text-transform: uppercase"
                          htmlFor="INSURANCE DATE"
                        >
                          Insurance DATE
                        </label>
                      </div>

                      <div className="relative">
                        <DatePicker
                          id="INSURANCE DATE"
                          placeholderText="Insurance Date"
                          className={` [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 rounded-xl px-4 h-10 border-gray-300  w-full lg:w-52 ${!touched.salaryAmount
                              ? "border-red-400 "
                              : "border-gray-300"
                            }`}
                          onKeyUp={handleKeyUp}
                          selected={insurance_date}
                          onChange={handleInsuranceDate}
                          dateFormat="dd/MM/yyyy"
                          showYearDropdown={true}
                        />
                      </div>
                    </div>
                    {/* {error.insurance_number && (
                  <p className="text-red-500 text-sm mt-2">{error.insurance_number[0]}</p>
                )} */}
                  </div>
                </div>

                {/* Experience */}
                <div className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 lg:px-6">
                  <p className="text-xl font-semibold"> Experience </p>
                  {workExperiences.map((experience, index) => (
                    <div
                      key={index}
                      className="flex items-start  justify-between mt-4 border rounded-lg p-4 bg-gray-50"
                    >
                      <div>
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-1 flex-wrap items-center ">
                            <p className="text-sm ">Job Title:</p>
                            <p className="text-sm font-semibold">
                              {experience.jobTitle}
                            </p>
                          </div>

                          <div className="flex gap-1 flex-wrap items-center ">
                            <p className="text-sm">Company Name:</p>
                            <p className="text-sm font-semibold">
                              {experience.companyName}
                            </p>
                          </div>

                          <div className="flex gap-1 flex-wrap items-center">
                            <h1 className="text-sm ">Start & End Date:</h1>
                            <p className="text-sm font-semibold">
                              {experience.startWork} - ${experience.endWork}
                            </p>
                          </div>

                          <div className="flex gap-1 flex-wrap items-center">
                            <h1 className="text-sm">Responsibilities:</h1>
                            <p className="text-sm font-semibold">
                              {experience.responsibilities}
                            </p>
                          </div>

                          <div className="flex gap-1 flex-wrap items-center">
                            <h1 className="text-sm">Selected Documents:</h1>
                            <ul className="text-sm flex flex-wrap gap-x-4">
                              {experience.selectedDocs.map((res, idx) => (
                                <li key={idx} className="flex items-center">
                                  <p className="">
                                    {" "}
                                    <GoDotFill className="mr-2  inline-flex" />
                                    {res}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        {/* <p className="font-semibold"> {experience.jobTitle} </p>
                    <p className="font-medium"> {experience.companyName} </p>
                    <p> {experience.companyIndustry} </p>
                    <p> {experience.previousSalary} </p>
                    <p>
                      {experience.startWork} - {experience.endWork}
                    </p>
                    */}
                        {/* <ul className="mt-2">
                      {experience.responsibilities.map((res, idx) => (
                        <li key={idx} className="flex items-center">
                          <p className="">
                            {" "}
                            <GoDotFill className="mr-2  inline-flex" />
                            {res}
                          </p>
                        </li>
                      ))}
                    </ul> */}
                        {/* <p className="text-sm">{experience.responsibilities}</p> */}
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

                <div className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 lg:px-6">
                  <p className="text-xl font-semibold">Skills</p>

                  <div className="bg-gray-100 p-4 rounded-xl mt-3">
                    <input
                      type="text"
                      placeholder="Add a skill and press Enter"
                      className="w-full  rounded-md bg-gray-100 h-5 border-none outline-none "
                      value={skillsInputValue}
                      onChange={(e) => setSkillsInputValue(e.target.value)}
                      onKeyPress={handleSkillsKeyPress}
                    />
                    <div className="mt-4 flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
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
                      ))}
                    </div>
                  </div>
                </div>

                {/* Document Section */}
                <div className="rounded-2xl border-2 border-gray-200 bg-white py-4 px-4 lg:px-6">
                  <p className="text-xl font-semibold">Documents</p>
                  {/* Display Uploaded Files Outside Modal */}
                  <div className="mt-4">
                    <ul className="list-disc space-y-2">
                      {uploadedDocuments.map((fileWrapper) => (
                        <li
                          key={fileWrapper.id}
                          className="flex items-center justify-between text-sm border-2 border-green-600 rounded-2xl px-4 py-3"
                        >
                          <div className=" w-full">
                            <p className="text-gray-500">
                              Title: {fileWrapper.title}
                            </p>
                            {fileWrapper.files && fileWrapper.files.length > 0 ? (
                              fileWrapper.files.map((file) => (
                                <div
                                  key={file.id}
                                  className="mt-2 w-full flex justify-between "
                                >
                                  <button
                                    className="text-blue-500 hover:text-blue-700"
                                    onClick={() => {
                                      if (file.preview) {
                                        window.open(file.preview, "_blank");
                                      } else {
                                        alert("Preview not available");
                                      }
                                    }}
                                  >
                                    <p>{file.file.path}</p>
                                  </button>
                                  <p
                                    className="text-red-500 cursor-pointer"
                                    onClick={() =>
                                      onClickDocumentDeleteButton(file.file.path)
                                    }
                                  >
                                    x
                                  </p>
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
                    value={driveLink}
                    onChange={(e) => {
                      setDriveLink(e.target.value);
                    }}
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
                className={`fixed top-0 right-0 h-full overflow-y-scroll w-screen sm:w-[90vw] md:w-[70vw] bg-white shadow-lg px-5 md:px-16 py-5 md:py-10 transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
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
                  <p className="text-3xl font-medium mt-3 md:mt-8"> Experience </p>
                  <div className="flex gap-5 justify-end mt-4 md:mt-8">
                    <button
                      onClick={closeAddWorkExperienceModal}
                      className=" bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-9 py-1 md:py-2 font-semibold rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveExperience}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-9 py-2 font-semibold rounded-full"
                    >
                      Save
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-3 mt-4 md:mt-8">
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
                      className={` border-2 rounded-xl px-4 h-10  w-full md:w-96  ${!expTouched.jobTitle ? "border-red-400" : "border-gray-300 "
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
                      className={`border-2 rounded-xl px-4 h-10 border-gray-300  w-full md:w-96 ${!expTouched.companyIndustry
                          ? "border-red-400"
                          : "border-gray-300 "
                        }`}
                      onKeyUp={handleKeyUp}
                    />
                  </div>
                  <div className="flex flex-col lg:flex-row gap-1 justify-between">
                    <div className="flex flex-col">
                      <label className="font-medium text-sm" htmlFor="companyName">
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
                      className={`border-2 rounded-xl px-4 h-10 border-gray-300  w-full md:w-96 ${!expTouched.companyName
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
                      className={`border-2 rounded-xl px-4 h-10 border-gray-300  w-full md:w-96 ${!expTouched.previousSalary
                          ? "border-red-400"
                          : "border-gray-300 "
                        }`}
                      onKeyUp={handleKeyUp}
                    />
                  </div>

                  <div className="flex flex-col lg:flex-row gap-1 justify-between">
                    <div className="flex flex-col">
                      <label className="font-medium text-sm" htmlFor="periodOfWork">
                        PERIOD OF WORK
                      </label>
                      {/* <p className="text-sm"> Period of work </p> */}
                    </div>

                    <div className="flex flex-col md:flex-row flex-wrap gap-3 w-full md:w-96 overflow-hidden">
                      <DatePicker
                        id="DATE OF JOINING"
                        placeholderText="Start work"
                        selected={
                          experienceForm.startWork
                            ? new Date(experienceForm.startWork, 0)
                            : null
                        }
                        onChange={(date) =>
                          setExperienceForm((prev) => ({
                            ...prev,
                            startWork: date?.getFullYear(),
                          }))
                        }
                        className={`border-2  rounded-xl w-full md:w-44 h-10 px-4 border-gray-300  ${!expTouched.startWork
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
                          experienceForm.endWork
                            ? new Date(experienceForm.endWork, 0)
                            : null
                        }
                        onChange={(date) =>
                          setExperienceForm((prev) => ({
                            ...prev,
                            endWork: date?.getFullYear(),
                          }))
                        }
                        className={`border-2 rounded-xl h-10 px-4 w-full md:w-44 border-gray-300  ${!expTouched.startWork
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
                      className={`  w-full md:w-96 pt-2 rounded-xl px-4   border-2  ${!expTouched.responsibilities
                          ? "border-red-400"
                          : "border-gray-300 "
                        }`}
                      onKeyUp={handleKeyUp}
                    />
                    {/* <ul className="mt-2">
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
                  </ul> */}
                  </div>
                </div>

                <div>
                  <p className="text-3xl font-medium mt-8">Verification Process</p>

                  <div className="flex mt-5 gap-5">
                    <div className="flex gap-2 ">
                      <input
                        type="checkbox"
                        name="Payslip 1"
                        id="Payslip 1"
                        onChange={handleCheckboxChangeVerification}
                      />
                      <label htmlFor="Payslip 1">Payslip 1</label>
                    </div>

                    <div className="flex gap-2 ">
                      <input
                        type="checkbox"
                        name="Payslip 2"
                        id="Payslip 2"
                        onChange={handleCheckboxChangeVerification}
                      />
                      <label htmlFor="Payslip 2">Payslip 2</label>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="checkbox"
                        name="Payslip 3"
                        id="Payslip 3"
                        onChange={handleCheckboxChangeVerification}
                      />
                      <label htmlFor="Payslip 3">Payslip 3</label>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-5">
                    <input
                      type="checkbox"
                      name="last company appointment letter"
                      id="last company appointment letter"
                      onChange={handleCheckboxChangeVerification}
                    />
                    <label htmlFor="last company appointment letter">
                      last company appointment letter
                    </label>
                  </div>

                  <div className="flex gap-2 mt-5">
                    <input
                      type="checkbox"
                      name="last company experience letter"
                      id="last company experience letter"
                      onChange={handleCheckboxChangeVerification}
                    />
                    <label htmlFor="last company experience letter">
                      last company experience letter
                    </label>
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
                className={`fixed top-0 right-0 h-screen overflow-y-scroll w-[90vw] md:w-[70vw] bg-white shadow-lg px-5 md:px-16 py-5 md:py-10 transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
                  }`}
              >
                <div
                  className="w-6 h-6 rounded-full border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                  title="Toggle Sidebar"
                  onClick={closeAddEducationInfoModal}
                >
                  <IoIosArrowForward className="w-3 h-3" />
                </div>
                <div className="flex flex-col md:flex-row justify-between ">
                  <p className="text-3xl font-medium mt-3 md:mt-8">Education Info</p>
                  <div className="flex gap-5 justify-end mt-4 md:mt-8">
                    <button
                      onClick={closeAddEducationInfoModal}
                      className="bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-9 py-1 md:py-2 font-semibold rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEducationInfo}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 md:px-9 py-1 md:py-2 font-semibold rounded-full"
                    >
                      Save
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-8">
                  {/* School Name */}
                  <div className="flex flex-col lg:flex-row gap-1 justify-between">
                    <div className="flex flex-col">
                      <label className="font-medium text-sm" htmlFor="school-name">
                        Institute Name
                      </label>
                      {/* <p className="text-sm text-gray-500">Add School Name</p> */}
                    </div>
                    <input
                      type="text"
                      id="school-name"
                      placeholder="School name"
                      className={`border-2 rounded-xl px-4  h-10 w-full md:w-96 ${!educationTouched.SchoolName
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
                      className={`border-2 rounded-xl px-4  h-10 w-full md:w-96 ${!educationTouched.DepartmentName
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
                      <label className="font-medium text-sm" htmlFor="period-year">
                        YEAR OF PASSING
                      </label>
                      {/* <p className="text-sm text-gray-500">YEAR OF PASSING</p> */}
                    </div>

                    <input
                      type="month"
                      // placeholder="End year"
                      className={`border-2 rounded-xl px-4 h-10 w-full md:w-96 ${!educationTouched.YearOfPassing
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
          )}

          {addEmployeeDocumentsModalOpen && (
            <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50">
              <div
                className="absolute inset-0"
                onClick={closeAddEmployeeDocumentsModal}
              ></div>
              <div
                className={`fixed top-0 right-0 h-full  overflow-y-scroll w-[90vw] md:w-[100vw] bg-white  px-5 md:px-16 py-10 transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
                  }`}
              >
                <div
                  className="w-6 h-6 rounded-full border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                  title="Toggle Sidebar"
                  onClick={closeAddEmployeeDocumentsModal}
                >
                  <IoIosArrowForward className="w-3 h-3" />
                </div>
                <div className="flex flex-col md:flex-row justify-between ">
                  <p className="text-3xl font-medium mt-3 md:mt-8">Documents</p>
                  <div className="flex gap-5 justify-end mt-4 md:mt-8">
                    <button
                      onClick={closeAddEmployeeDocumentsModal}
                      className="bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-9 py-1 md:py-2 font-semibold rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveUploadedFile}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 md:px-9 py-1 md:py-2 text-sm  md:text-base font-semibold rounded-full"
                    >
                      Save
                    </button>
                  </div>
                </div>

                {/* Title Input */}
                <div className="flex flex-col lg:flex-row gap-1  justify-between mt-8">
                  <div className="flex flex-col">
                    <label className="font-medium text-sm" htmlFor="school-name">
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
                    className={`border-2 rounded-xl px-4 py-2   w-full md:w-96 ${!docTitle ? "border-red-400" : "border-gray-300"
                      }`}
                    onKeyUp={handleKeyUp}
                  />
                </div>
                {/* Drag and Drop Area */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed mt-5 rounded-lg py-10 px-5 text-center ${isDragActive ? "border-blue-500" : "border-gray-300"
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
                  src={URL.createObjectURL(selectedImage)}
                  alt="Full Size"
                  className="max-w-full h-[70vh] object-contain"
                />
                <button
                  className="absolute top-2 right-2 bg-white rounded-full px-4 py-1"
                  onClick={() => setOpenImageModal(false)} // Close modal on button click
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CreateEmployee_Mainbar;
