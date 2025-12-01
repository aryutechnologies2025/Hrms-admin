import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { CiBoxList } from "react-icons/ci";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import aryu_logo from "/Aryu.svg";
import { HiOutlineHome } from "react-icons/hi";
import { IoPeopleOutline } from "react-icons/io5";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import admin_icon from "../assets/admin_icon.png";
import { BiSolidHomeHeart } from "react-icons/bi";
import Button_Loader from "./Button_Loader";
import { VscGithubProject } from "react-icons/vsc";
import axios from "axios";
import { API_URL } from "../config";
import { FaLinkSlash } from "react-icons/fa6";
import { FaBusinessTime, FaRegAddressCard } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { FaBuildingUser } from "react-icons/fa6";
import { BsBank2 } from "react-icons/bs";
import { FaAmazonPay } from "react-icons/fa6";
import { MdOutlineHideImage } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { GiCrystalGrowth } from "react-icons/gi";
import { LuUserSearch } from "react-icons/lu";
import { BsFillCameraReelsFill } from "react-icons/bs";
import { MdManageAccounts } from "react-icons/md";
import { GrAnnounce } from "react-icons/gr";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  // console.log("currentPath", currentPath);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [onBoardOpen, setOnBoardOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [clientOpen, setClientOpen] = useState(false);
  const [finace, setFinace] = useState(false);
  const [arrowClicked, setArrowClicked] = useState(false);

  const [adminName, setAdminName] = useState(null);
  const [selectAnyOneClicked, setSelectAnyOneClicked] = useState(false);

  // const storedDetatis = localStorage.getItem('hrmsuser');
  // const parsedDetails = JSON.parse(storedDetatis);
  // const logingname = parsedDetails ? parsedDetails.name : null;

  let navigate = useNavigate();
  const [dropdownShow, setDropdownShow] = useState(false);

  const onClickArrow = () => {
    const newState = !arrowClicked;
    setArrowClicked(newState);
    localStorage.setItem("sidebarState", newState); // Persist the new state
  };

  const onClickSidebarMenu = (label) => {
    if (label === "/") {
      setButtonLoading(true);
      setTimeout(() => {
        localStorage.removeItem("hrmsuser");
        localStorage.removeItem("token");
        window.location.reload();

        // token remove

        localStorage.removeItem("token");
        localStorage.removeItem("hrmsuser");
        localStorage.removeItem("token_expiry");

        window.scrollTo({ top: 0, behavior: "instant" });
        setButtonLoading(false);
      }, 300);
      navigate("/");
    } else {
      navigate(`/${label.toLowerCase()}`);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  const onChangeSelect = (e) => {
    let value = e.target.value;
    let location = value.toLowerCase();
    navigate(`/${location}`);
  };

  // useEffect(() => {
  //   const storedDetatis = localStorage.getItem("hrmsuser");
  //   const parsedDetails = JSON.parse(storedDetatis);
  //   const logingname = parsedDetails ? parsedDetails.name : "";
  //   setAdminName(logingname);
  // }, []);

  const user = JSON.parse(localStorage.getItem("hrmsuser"));
  const email = user?.email ? user?.email : "";
  const id = user?._id ? user?._id : "";
  const client =
    user?.type === "client" || user?.type === "subuser" ? true : false;
  const name = user?.name ? user?.name : "";

  const clientView = (id) => {
    // console.log("idfyr", id);
    if (user?.subType) {
      navigate("/client-view-subUser", { state: { id: id } });
    } else {
      navigate("/client-view", { state: { id: id } });
    }
  };

  const [changePasswordIsOpen, setChangePasswordIsOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  const changePassword = () => {
    setChangePasswordIsOpen(true);
  };

  const changePasswordAdmin = async () => {
    const user = JSON.parse(localStorage.getItem("hrmsuser"));

    const id = user?._id ? user?._id : "";
    const payload = {
      id: id,
      newPassword: adminPassword,
    };
    try {
      const response = await axios.put(
        `${API_URL}/api/auth/change-password`,
        payload
      );
      setAdminPassword("");
      setChangePasswordIsOpen(false);
      toast.success("Admin Password changed successfully");
    } catch (error) {
      console.error("Error changing password", error);
    }
  };
  const [currentOpen, setCurrentOpen] = useState(null);

  const toggleMenu = (menu) => {
    setCurrentOpen(currentOpen === menu ? null : menu);
  };

  const hasPermission = (title) => {
    const user = JSON.parse(localStorage.getItem("hrmsuser"));
    const module = JSON.parse(localStorage.getItem("module"));
    const hrpermissions = module || [];

    if (user?.superUser) {
      return true;
    } else {
      return hrpermissions.find(
        (p) => p.title == title && p.permission === "yes"
      );
    }
  };

  return (
    <div>
      <section
        className={`bg-white max-md:hidden max-h-dvh  transition-all duration-500 flex flex-col  ${
          arrowClicked ? "w-[60px]" : "w-52"
        }`}
      >
        <ToastContainer />
        <div
          className={`fixed flex flex-col  h-full  ${
            arrowClicked ? "w-[50px]" : "w-48"
          }`}
        >
          {/* Toggle Button */}
          <div
            className="flex justify-end  mt-3 items-center"
            onClick={onClickArrow}
            title="Toggle Sidebar"
          >
            <div
              className={`${
                arrowClicked ? "-me-3" : "-me-8"
              } w-6 h-6 rounded-full   border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer`}
            >
              {arrowClicked ? (
                <IoIosArrowForward className="w-3 h-3 " />
              ) : (
                <IoIosArrowBack className="w-3 h-3" />
              )}
            </div>
          </div>

          {/* Logo */}
          {arrowClicked ? (
            <div className="h-12 mt-6 ms-2 text-xl font-semibold">
              <p className="text-[#1F98B5]">
                <img
                  src={aryu_logo}
                  alt=""
                  className=" h-14 w-10 cursor-pointer"
                  onClick={() => navigate("/")}
                />
              </p>
            </div>
          ) : (
            <img
              src={aryu_logo}
              alt=""
              className="h-20 w-24 ms-8 p-2 cursor-pointer"
              onClick={() => navigate("/")}
            />
          )}

          {/* Sidebar Menu */}
          <div
            className={`scroll-container flex-grow w-full pb-24 flex flex-col justify-start`}
            style={{
              scrollbarGutter: "stable",
            }}
          >
            <div
              className={`flex gap-1 mt-4 mx-2  flex-col ${
                arrowClicked ? "items-center" : "items-start"
              }  `}
            >
              {/* dashboard */}
              {!client && (
                <div
                  onClick={() => onClickSidebarMenu("Dashboard")}
                  className={`flex items-center h-10 w-full flex-grow ${
                    arrowClicked ? "justify-center  " : "justify-normal"
                  } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer ${
                    currentPath === "/dashboard"
                      ? "bg-blue-100 text-[#4F46E5]"
                      : "text-gray-500 hover:bg-blue-100 hover:text-[#4F46E5]"
                  }`}
                >
                  <CiBoxList />
                  {!arrowClicked && <p className="text-sm">Dashboard</p>}
                </div>
              )}

              {/* client dashboard */}

              {client && (
                <>
                  <div
                    onClick={() => onClickSidebarMenu("client-dashboard")}
                    className={`flex items-center h-10 w-full flex-grow ${
                      arrowClicked ? "justify-center  " : "justify-normal"
                    } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer ${
                      currentPath === "/client-dashboard"
                        ? "bg-blue-100 text-[#4F46E5]"
                        : "text-gray-500 hover:bg-blue-100 hover:text-[#4F46E5]"
                    }`}
                  >
                    <CiBoxList />
                    {!arrowClicked && <p className="text-sm">Dashboard</p>}
                  </div>

                  <div
                    onClick={() => onClickSidebarMenu("task-list-client")}
                    className={`flex items-center h-10 w-full flex-grow ${
                      arrowClicked ? "justify-center  " : "justify-normal"
                    } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer ${
                      currentPath === "/task-list-client"
                        ? "bg-blue-100 text-[#4F46E5]"
                        : "text-gray-500 hover:bg-blue-100 hover:text-[#4F46E5]"
                    }`}
                  >
                    <VscGithubProject />
                    {!arrowClicked && <p className="text-sm">Project</p>}
                  </div>

                  <div
                    onClick={() => onClickSidebarMenu("mom-details")}
                    className={`flex items-center h-10 w-full flex-grow ${
                      arrowClicked ? "justify-center  " : "justify-normal"
                    } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer ${
                      currentPath === "/mom-details"
                        ? "bg-blue-100 text-[#4F46E5]"
                        : "text-gray-500 hover:bg-blue-100 hover:text-[#4F46E5]"
                    }`}
                  >
                    <FaBusinessTime />
                    {!arrowClicked && <p className="text-sm">MOM</p>}
                  </div>
                </>
              )}
              {user.type === "client" && !user.subType && (
                <div
                  onClick={() => onClickSidebarMenu("client-subuser")}
                  className={`flex items-center h-10 w-full flex-grow ${
                    arrowClicked ? "justify-center" : "justify-normal"
                  } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer ${
                    currentPath === "/client-subuser"
                      ? "bg-blue-100 text-[#4F46E5]"
                      : "text-gray-500 hover:bg-blue-100 hover:text-[#4F46E5]"
                  }`}
                >
                  <LuUserSearch />
                  {!arrowClicked && <p className="text-sm">Users</p>}
                </div>
              )}

              {!client && (
                <>
                  {/* on Boarding    */}
                  {hasPermission("On Boarding") && (
                    <>
                      <div
                        // onClick={() => setOnBoardOpen(!onBoardOpen)}
                        onClick={() => toggleMenu("onboarding")}
                        className={`flex items-center h-10 w-full flex-grow ${
                          arrowClicked ? "justify-center  " : "justify-normal"
                        } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer
                 ${
                   [
                     "/employees",
                     "/roles",
                     "/departments",
                     "/joining-list",
                     "/releiving-letter",
                     "/Declaration-deatils",
                     "/letters-form",
                   ].includes(currentPath)
                     ? "bg-blue-100 text-[#4F46E5]"
                     : "text-gray-500 hover:bg-blue-100 hover:text-[#4F46E5]"
                 }`}
                      >
                        <FaRegAddressCard />
                        {!arrowClicked && (
                          <p className="text-sm flex items-center gap-2">
                            On Boarding
                            <span>
                              {currentOpen === "onboarding" ||
                              [
                                "/employees",
                                "/roles",
                                "/departments",
                                "/joining-list",
                                "/releiving-letter",
                                "/Declaration-deatils",
                                "/letters-form",
                              ].includes(currentPath) ? (
                                <IoIosArrowUp />
                              ) : (
                                <IoIosArrowDown />
                              )}
                            </span>
                          </p>
                        )}
                      </div>
                      <div
                        className={`overflow-hidden w-full transition-all duration-700 ease-in-out ${
                          currentOpen === "onboarding" ||
                          [
                            "/employees",
                            "/roles",
                            "/departments",
                            "/joining-list",
                            "/releiving-letter",
                            "/relieved-list",
                            "/Declaration-deatils",
                            "/letters-form",
                            "/inter",
                          ].includes(currentPath)
                            ? "max-h-72 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="flex gap-2  items-start  ms-8 flex-col text-sm font-medium text-gray-500">
                          <button
                            onClick={() => navigate("/departments")}
                            className={`px-2 py-1 rounded-full 
                        ${
                          currentPath === "/departments"
                            ? " text-[#4F46E5]"
                            : "hover:bg-blue-100 text-gray-500"
                        }`}
                          >
                            Departments
                          </button>

                          <button
                            onClick={() => navigate("/roles")}
                            className={`px-2 py-1 rounded-full 
                        ${
                          currentPath === "/roles"
                            ? " text-[#4F46E5]"
                            : "hover:bg-blue-100 text-gray-500"
                        }`}
                          >
                            Roles
                          </button>

                          <button
                            onClick={() => navigate("/employees")}
                            className={`px-2 py-1 rounded-full 
                        ${
                          currentPath === "/employees"
                            ? " text-[#4F46E5]"
                            : "hover:bg-blue-100 text-gray-500"
                        }`}
                          >
                            Employees
                          </button>

                          <button
                            onClick={() => navigate("/inter")}
                            className={`px-2 py-1 rounded-full 
                        ${
                          currentPath === "/inter"
                            ? " text-[#4F46E5]"
                            : "hover:bg-blue-100 text-gray-500"
                        }`}
                          >
                            Internship
                          </button>

                          <button
                            onClick={() => navigate("/Declaration-deatils")}
                            className={`px-2 py-1 rounded-full 
                        ${
                          currentPath === "/Declaration-deatils"
                            ? " text-[#4F46E5]"
                            : "hover:bg-blue-100 text-gray-500"
                        }`}
                          >
                            Declaration
                          </button>

                          <button
                            onClick={() => navigate("/releiving-letter")}
                            className={`px-2 py-1 rounded-full 
                        ${
                          currentPath === "/releiving-letter"
                            ? " text-[#4F46E5]"
                            : "hover:bg-blue-100 text-gray-500"
                        }`}
                          >
                            Relieving List
                          </button>

                          <button
                            onClick={() => navigate("/relieved-list")}
                            className={`px-2 py-1 rounded-full 
                        ${
                          currentPath === "/relieved-list"
                            ? " text-[#4F46E5]"
                            : "hover:bg-blue-100 text-gray-500"
                        }`}
                          >
                            Relieved List
                          </button>

                          <button
                            onClick={() => navigate("/letters-form")}
                            className={`px-2 py-1 rounded-full 
    ${
      currentPath === "/letters-form"
        ? " text-[#4F46E5]"
        : "hover:bg-blue-100 text-gray-500"
    }`}
                          >
                            Letter list
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Employee  */}
                  {hasPermission("Employee") && (
                    <>
                      <div
                        // onClick={() => setSelectAnyOneClicked(!selectAnyOneClicked)}
                        onClick={() => toggleMenu("employee")}
                        onMouseEnter={() => setDropdownShow(true)}
                        onMouseLeave={() => setDropdownShow(false)}
                        className={`flex items-center h-10 w-full flex-grow ${
                          arrowClicked ? "justify-center  " : "justify-normal"
                        } hover:bg-blue-100 hover:text-[#4F46E5] h-10  px-2 py-3 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer ${
                          [
                            "/attendance",
                            "/leaves",
                            "/wfh",
                            "/requestdetails",
                          ].includes(currentPath)
                            ? " text-[#4F46E5]"
                            : "text-gray-500 hover:bg-blue-100 hover:text-[#4F46E5]"
                        }`}
                      >
                        <IoPeopleOutline className="" />
                        {arrowClicked ? (
                          <></>
                        ) : (
                          // Regular select dropdown for expanded sidebar
                          <div className="">
                            <button className="  flex items-center gap-5 justify-between ">
                              <span>Employee</span>{" "}
                              <span>
                                {currentOpen === "employee" ||
                                [
                                  "/attendance",
                                  "/leaves",
                                  "/wfh",
                                  "/requestdetails",
                                ].includes(currentPath) ? (
                                  <IoIosArrowUp />
                                ) : (
                                  <IoIosArrowDown />
                                )}
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                      {!arrowClicked && (
                        <div
                          className={`overflow-hidden w-full transition-all duration-700 ease-in-out ${
                            currentOpen === "employee" ||
                            [
                              "/attendance",
                              "/leaves",
                              "/wfh",
                              "/requestdetails",
                            ].includes(currentPath)
                              ? "max-h-40 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="flex gap-2  items-start  ms-8 flex-col text-sm font-medium text-gray-500   ">
                            <button
                              onClick={() => navigate("/attendance")}
                              className={`px-2 py-1 rounded-full 
    ${
      currentPath === "/attendance"
        ? " text-[#4F46E5]"
        : "hover:bg-blue-100 text-gray-500"
    }`}
                            >
                              Attendance
                            </button>
                            <button
                              onClick={() => navigate("/leaves")}
                              className={`px-2 py-1 rounded-full 
    ${
      currentPath === "/leaves"
        ? " text-[#4F46E5]"
        : "hover:bg-blue-100 text-gray-500"
    }`}
                            >
                              Leaves
                            </button>
                            {/* <button
                      onClick={() => navigate("/permission")}
 className={`px-2 py-1 rounded-full 
    ${
      currentPath === "/employees"
        ? " text-[#4F46E5]"
        : "hover:bg-blue-100 text-gray-500"
    }`}                    >
                      Permission
                    </button> */}
                            <button
                              onClick={() => navigate("/wfh")}
                              className={`px-2 py-1 rounded-full 
    ${
      currentPath === "/wfh"
        ? " text-[#4F46E5]"
        : "hover:bg-blue-100 text-gray-500"
    }`}
                            >
                              WFH
                            </button>
                            <button
                              onClick={() => navigate("/requestdetails")}
                              className={`px-2 py-1 rounded-full 
    ${
      currentPath === "/requestdetails"
        ? " text-[#4F46E5]"
        : "hover:bg-blue-100 text-gray-500"
    }`}
                            >
                              Request
                            </button>

                            {/* <div
                      onClick={() => onClickSidebarMenu("requestdetails")}
                      className={`flex w-full items-center flex-grow ${
                        arrowClicked ? "justify-center  " : "justify-normal"
                      } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 h-10 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer`}
                    >
                      <CiMail />
                      {!arrowClicked && <p className="text-sm">Request</p>}
                    </div> */}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {email !== "hr@aryutechnologies.com" && (
                    <>
                      {/* Projects    */}
                      {hasPermission("Projects") && (
                        <>
                          <div
                            // onClick={() => setProjectOpen(!projectOpen)}
                            onClick={() => toggleMenu("projects")}
                            className={`flex items-center h-10 w-full flex-grow ${
                              arrowClicked
                                ? "justify-center  "
                                : "justify-normal"
                            } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer  ${
                              [
                                "/project-list",
                                "/task-list",
                                "/reports",
                              ].includes(currentPath)
                                ? " text-[#4F46E5]"
                                : "text-gray-500 hover:bg-blue-100 hover:text-[#4F46E5]"
                            }`}
                          >
                            <VscGithubProject />
                            {!arrowClicked && (
                              <p className="text-sm flex items-center gap-2">
                                Projects
                                {/* <span className="">
                         
                              {currentOpen === "projects" ? (
                                <IoIosArrowUp />
                              ) : (
                                <IoIosArrowDown />
                              )}
                            </span> */}
                                <span>
                                  {currentOpen === "projects" ||
                                  [
                                    "/project-list",
                                    "/task-list",
                                    "/reports",
                                  ].includes(currentPath) ? (
                                    <IoIosArrowUp />
                                  ) : (
                                    <IoIosArrowDown />
                                  )}
                                </span>
                              </p>
                            )}
                          </div>
                          <div
                            className={`overflow-hidden w-full transition-all  duration-700 ease-in-out ${
                              currentOpen === "projects" ||
                              [
                                "/project-list",
                                "/task-list",
                                "/reports",
                              ].includes(currentPath)
                                ? "max-h-40 opacity-100"
                                : "max-h-0 opacity-0"
                            }`}
                          >
                            <div className="flex gap-2  items-start  ms-10 flex-col text-sm font-medium text-gray-500">
                              <button
                                onClick={() => navigate("/project-list")}
                                className={`px-2 py-1 rounded-full 
    ${
      currentPath === "/project-list"
        ? " text-[#4F46E5]"
        : "hover:bg-blue-100 text-gray-500"
    }`}
                              >
                                Project
                              </button>
                              <button
                                onClick={() => navigate("/task-list")}
                                className={`px-2 py-1 rounded-full 
    ${
      currentPath === "/task-list"
        ? " text-[#4F46E5]"
        : "hover:bg-blue-100 text-gray-500"
    }`}
                              >
                                Task
                              </button>
                              <button
                                onClick={() => navigate("/reports")}
                                className={`px-2 py-1 rounded-full 
    ${
      currentPath === "/reports"
        ? " text-[#4F46E5]"
        : "hover:bg-blue-100 text-gray-500"
    }`}
                              >
                                Reports
                              </button>
                              {/* <div
                        onClick={() => onClickSidebarMenu("task-list")}
                        className={`flex w-full items-center flex-grow ${
                          arrowClicked ? "justify-center  " : "justify-normal"
                        } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 h-10 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer`}
                      >
                        <VscGithubProject />
                        <p className="text-sm">Project</p>
                      </div> */}
                              {/* <div
                        onClick={() => onClickSidebarMenu("task-list")}
                        className={`flex w-full items-center flex-grow ${
                          arrowClicked ? "justify-center  " : "justify-normal"
                        } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 h-10 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer`}
                      >
                        <GrTask />
                        <p className="text-sm">Task</p>
                      </div>
                      <div
                        onClick={() => onClickSidebarMenu("Reports")}
                        className={`flex w-full items-center flex-grow ${
                          arrowClicked ? "justify-center  " : "justify-normal"
                        } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 h-10 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer`}
                      >
                        <TbReportSearch />
                        {!arrowClicked && <p className="text-sm">Reports</p>}
                      </div> */}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Client    */}
                      {hasPermission("Clients") && (
                        <>
                          <div
                            // onClick={() => setClientOpen(!clientOpen)}
                            onClick={() => toggleMenu("clients")}
                            className={`flex items-center h-10 w-full flex-grow ${
                              arrowClicked
                                ? "justify-center  "
                                : "justify-normal"
                            } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer  ${
                              ["/client-details", "/invoice-details"].includes(
                                currentPath
                              )
                                ? " text-[#4F46E5]"
                                : "text-gray-500 hover:bg-blue-100 hover:text-[#4F46E5]"
                            }`}
                          >
                            <FaBuildingUser />
                            {!arrowClicked && (
                              <p className="text-sm flex items-center gap-2">
                                Clients
                                <span>
                                  {currentOpen === "clients" ||
                                  [
                                    "/client-details",
                                    "/invoice-details",
                                    "/mom-details",
                                    "/document-details",
                                    "/assect-document",
                                  ].includes(currentPath) ? (
                                    <IoIosArrowUp />
                                  ) : (
                                    <IoIosArrowDown />
                                  )}
                                </span>
                              </p>
                            )}
                          </div>
                          {/*  */}
                          <div
                            className={`overflow-hidden w-full transition-all duration-700 ease-in-out ${
                              currentOpen === "clients" ||
                              [
                                "/client-details",
                                "/invoice-details",
                                "/mom-details",
                                "/document-details",
                              ].includes(currentPath)
                                ? "max-h-50 opacity-100"
                                : "max-h-0 opacity-0"
                            }`}
                          >
                            <div className="flex gap-2  items-start  ms-8 flex-col text-sm font-medium text-gray-500">
                              <button
                                onClick={() => navigate("/client-details")}
                                className={`px-2 py-1 rounded-full 
    ${
      currentPath === "/client-details"
        ? "text-[#4F46E5]"
        : "hover:bg-blue-100 text-gray-500"
    }`}
                              >
                                Client List
                              </button>
                              <button
                                onClick={() => navigate("/invoice-details")}
                                className={`px-2 py-1 rounded-full 
                                    ${
                                      currentPath === "/invoice-details"
                                        ? " text-[#4F46E5]"
                                        : "hover:bg-blue-100 text-gray-500"
                                    }`}
                              >
                                Invoice List
                              </button>

                              <button
                                onClick={() => navigate("/mom-details")}
                                className={`px-2 py-1 rounded-full 
                                    ${
                                      currentPath === "/mom-details"
                                        ? " text-[#4F46E5]"
                                        : "hover:bg-blue-100 text-gray-500"
                                    }`}
                              >
                                MOM
                              </button>

                              <button
                                onClick={() => navigate("/document-details")}
                                className={`px-2 py-1 rounded-full 
                                    ${
                                      currentPath === "/document-details"
                                        ? " text-[#4F46E5]"
                                        : "hover:bg-blue-100 text-gray-500"
                                    }`}
                              >
                                Document
                              </button>
                               <button
                                onClick={() => navigate("/assect-document")}
                                className={`px-2 py-1 rounded-full 
                                    ${
                                      currentPath === "/assect-document"
                                        ? " text-[#4F46E5]"
                                        : "hover:bg-blue-100 text-gray-500"
                                    }`}
                              >
                                Assect Doc
                              </button>

                              {/* <div
                        onClick={() => onClickSidebarMenu("client-details")}
                        className={`flex w-full items-center flex-grow ${
                          arrowClicked ? "justify-center  " : "justify-normal"
                        } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 h-10 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer`}
                      >
                        <IoPersonAddSharp />
                        {!arrowClicked && (
                          <p className="text-sm">Client List</p>
                        )}
                      </div> */}

                              {/* <div
                      onClick={() => onClickSidebarMenu("invoice-details")}
                      className={`flex w-full items-center flex-grow ${
                        arrowClicked ? "justify-center  " : "justify-normal"
                      } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 h-10 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer`}
                    >
                      <IoPersonAddSharp />
                      {!arrowClicked && <p className="text-sm">Invoice List</p>}
                    </div> */}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Finance */}
                      {hasPermission("Finance") && (
                        <>
                          <div
                            // onClick={() => setFinace(!finace)}
                            onClick={() => toggleMenu("finance")}
                            className={`flex items-center h-10 w-full flex-grow ${
                              arrowClicked
                                ? "justify-center  "
                                : "justify-normal"
                            } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer  ${
                              [
                                "/finance-account",
                                "/income/details",
                                "/expense/details",
                                "/payment-type",
                                "/bankstatement",
                              ].includes(currentPath)
                                ? "bg-blue-100 text-[#4F46E5]"
                                : "text-gray-500 hover:bg-blue-100 hover:text-[#4F46E5]"
                            }`}
                          >
                            <BsBank2 />
                            {!arrowClicked && (
                              <p className="text-sm flex items-center gap-2">
                                Finance
                                <span>
                                  {currentOpen === "finance" ||
                                  [
                                    "/finance-account",
                                    "/income/details",
                                    "/expense/details",
                                    "/payment-type",
                                    "/bankstatement",
                                  ].includes(currentPath) ? (
                                    <IoIosArrowUp />
                                  ) : (
                                    <IoIosArrowDown />
                                  )}
                                </span>
                              </p>
                            )}
                          </div>
                          <div
                            className={`overflow-hidden w-full transition-all duration-700 ease-in-out ${
                              currentOpen === "finance" ||
                              [
                                "/finance-account",
                                "/income/details",
                                "/expense/details",
                                "/payment-type",
                                "/bankstatement",
                              ].includes(currentPath)
                                ? "max-h-50 opacity-100"
                                : "max-h-0 opacity-0"
                            }`}
                          >
                            <div className="flex gap-2  items-start  ms-8 flex-col text-sm font-medium text-gray-500">
                              <button
                                onClick={() => navigate("/finance-account")}
                                className={`px-2 py-1 rounded-full 
                            ${
                              currentPath === "/finance-account"
                                ? " text-[#4F46E5]"
                                : "hover:bg-blue-100 text-gray-500"
                            }`}
                              >
                                Account
                              </button>
                              <button
                                onClick={() => navigate("/income/details")}
                                className={`px-2 py-1 rounded-full 
                            ${
                              currentPath === "/income/details"
                                ? " text-[#4F46E5]"
                                : "hover:bg-blue-100 text-gray-500"
                            }`}
                              >
                                Income List
                              </button>
                              <button
                                onClick={() => navigate("/expense/details")}
                                className={`px-2 py-1 rounded-full 
                            ${
                              currentPath === "/expense/details"
                                ? " text-[#4F46E5]"
                                : "hover:bg-blue-100 text-gray-500"
                            }`}
                              >
                                Expense List
                              </button>
                              <button
                                onClick={() => navigate("/payment-type")}
                                className={`px-2 py-1 rounded-full 
    ${
      currentPath === "/payment-type"
        ? " text-[#4F46E5]"
        : "hover:bg-blue-100 text-gray-500"
    }`}
                              >
                                Payments
                              </button>
                              <button
                                onClick={() => navigate("/bankstatement")}
                                className={`px-2 py-1 rounded-full 
                            ${
                              currentPath === "/bankstatement"
                                ? " text-[#4F46E5]"
                                : "hover:bg-blue-100 text-gray-500"
                            }`}
                              >
                                Bank Statement
                              </button>
                              {/* <div
                        onClick={() => onClickSidebarMenu("client-details")}
                        className={`flex w-full items-center flex-grow ${
                          arrowClicked ? "justify-center  " : "justify-normal"
                        } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 h-10 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer`}
                      >
                        <IoPersonAddSharp />
                        {!arrowClicked && (
                          <p className="text-sm">Client List</p>
                        )}
                      </div> */}

                              {/* <div
                      onClick={() => onClickSidebarMenu("invoice-details")}
                      className={`flex w-full items-center flex-grow ${
                        arrowClicked ? "justify-center  " : "justify-normal"
                      } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 h-10 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer`}
                    >
                      <IoPersonAddSharp />
                      {!arrowClicked && <p className="text-sm">Invoice List</p>}
                    </div> */}
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {/* bidding */}

                  {hasPermission("Bidding") && (
                    <>
                      <div
                        // onClick={() => setClientOpen(!clientOpen)}
                        onClick={() => toggleMenu("bidding")}
                        className={`flex items-center h-10 w-full flex-grow ${
                          arrowClicked ? "justify-center  " : "justify-normal"
                        } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer  ${
                          [
                            "/account-bidding",
                            "/tech-bidding",
                            "/bidding-details",
                            "/connect-details",
                            "/bidding-reports",
                          ].includes(currentPath)
                            ? "bg-blue-100 text-[#4F46E5]"
                            : "text-gray-500 hover:bg-blue-100 hover:text-[#4F46E5]"
                        }`}
                      >
                        <GiCrystalGrowth />{" "}
                        {!arrowClicked && (
                          <p className="text-sm flex items-center gap-2">
                            Bidding
                            <span>
                              {currentOpen === "bidding" ||
                              [
                                "/account-bidding",
                                "/tech-bidding",
                                "/bidding-details",
                                "/connect-details",
                                "/bidding-reports",
                              ].includes(currentPath) ? (
                                <IoIosArrowUp />
                              ) : (
                                <IoIosArrowDown />
                              )}
                            </span>
                          </p>
                        )}
                      </div>
                      {/*  */}
                      <div
                        className={`overflow-hidden w-full transition-all duration-700 ease-in-out ${
                          currentOpen === "bidding" ||
                          [
                            "/account-bidding",
                            "/tech-bidding",
                            "/bidding-details",
                            "/connect-details",
                            "/bidding-reports",
                          ].includes(currentPath)
                            ? "max-h-52 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="flex gap-2  items-start  ms-8 flex-col text-sm font-medium text-gray-500">
                          <button
                            onClick={() => navigate("/account-bidding")}
                            className={`px-2 py-1 rounded-full 
    ${
      currentPath === "/account-bidding"
        ? " text-[#4F46E5]"
        : "hover:bg-blue-100 text-gray-500"
    }`}
                          >
                            Account
                          </button>
                          <button
                            onClick={() => navigate("/tech-bidding")}
                            className={`px-2 py-1 rounded-full 
    ${
      currentPath === "/tech-bidding"
        ? " text-[#4F46E5]"
        : "hover:bg-blue-100 text-gray-500"
    }`}
                          >
                            Technology
                          </button>
                          <button
                            onClick={() => navigate("/bidding-details")}
                            className={`px-2 py-1 rounded-full 
    ${
      currentPath === "/bidding-details"
        ? " text-[#4F46E5]"
        : "hover:bg-blue-100 text-gray-500"
    }`}
                          >
                            Bidding Details
                          </button>

                          <button
                            onClick={() => navigate("/connect-details")}
                            className={`px-2 py-1 rounded-full 
    ${
      currentPath === "/connect-details"
        ? " text-[#4F46E5]"
        : "hover:bg-blue-100 text-gray-500"
    }`}
                          >
                            Connects Details
                          </button>

                          <button
                            onClick={() => navigate("/bidding-reports")}
                            className={`px-2 py-1 rounded-full 
    ${
      currentPath === "/bidding-reports"
        ? " text-[#4F46E5]"
        : "hover:bg-blue-100 text-gray-500"
    }`}
                          >
                            Bidding Reports
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* media account */}

                  {hasPermission("socialmedia") && (
                    <>
                      <div
                        // onClick={() => setClientOpen(!clientOpen)}
                        onClick={() => toggleMenu("socialmedia")}
                        className={`flex items-center h-10 w-full flex-grow ${
                          arrowClicked ? "justify-center  " : "justify-normal"
                        } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer  ${
                          ["/social-account", "/social-credentials"].includes(
                            currentPath
                          )
                            ? "bg-blue-100 text-[#4F46E5]"
                            : "text-gray-500 hover:bg-blue-100 hover:text-[#4F46E5]"
                        }`}
                      >
                        <BsFillCameraReelsFill />{" "}
                        {!arrowClicked && (
                          <p className="text-sm flex items-center gap-2">
                            Social Media
                            <span>
                              {currentOpen === "socialmedia" ||
                              [
                                "/social-account",
                                "/social-credentials",
                              ].includes(currentPath) ? (
                                <IoIosArrowUp />
                              ) : (
                                <IoIosArrowDown />
                              )}
                            </span>
                          </p>
                        )}
                      </div>
                      {/*  */}
                      <div
                        className={`overflow-hidden w-full transition-all duration-700 ease-in-out ${
                          currentOpen === "socialmedia" ||
                          ["/social-account", "/social-credentials"].includes(
                            currentPath
                          )
                            ? "max-h-52 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="flex gap-2  items-start  ms-8 flex-col text-sm font-medium text-gray-500">
                          <button
                            onClick={() => navigate("/social-account")}
                            className={`px-2 py-1 rounded-full 
    ${
      currentPath === "/social-account"
        ? " text-[#4F46E5]"
        : "hover:bg-blue-100 text-gray-500"
    }`}
                          >
                            Social Account
                          </button>

                          <button
                            onClick={() => navigate("/social-credentials")}
                            className={`px-2 py-1 rounded-full 
    ${
      currentPath === "/social-credentials"
        ? " text-[#4F46E5]"
        : "hover:bg-blue-100 text-gray-500"
    }`}
                          >
                            Credentials
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* recruitment */}

                  {hasPermission("Recruitment") && (
                    <>
                      <div
                        // onClick={() => setClientOpen(!clientOpen)}
                        onClick={() => toggleMenu("Recruitment")}
                        className={`flex items-center h-10 w-full flex-grow ${
                          arrowClicked ? "justify-center  " : "justify-normal"
                        } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer  ${
                          [
                            "/jobtype-Recruitment",
                            "/jobopening-Recruitment",
                            "/interview-Recruitment",
                            "/technologies-Recruitment",
                            "/Candidate-Recruitment",
                            "/dashboard-Recruitment",
                          ].includes(currentPath)
                            ? "bg-blue-100 text-[#4F46E5]"
                            : "text-gray-500 hover:bg-blue-100 hover:text-[#4F46E5]"
                        }`}
                      >
                        <LuUserSearch />{" "}
                        {!arrowClicked && (
                          <p className="text-sm flex items-center gap-2">
                            Recruitment
                            <span>
                              {currentOpen === "Recruitment" ||
                              [
                                "/jobtype-Recruitment",
                                "/jobopening-Recruitment",
                                "/interview-Recruitment",
                                "/technologies-Recruitment",
                                "/Candidate-Recruitment",
                                "/dashboard-Recruitment",
                              ].includes(currentPath) ? (
                                <IoIosArrowUp />
                              ) : (
                                <IoIosArrowDown />
                              )}
                            </span>
                          </p>
                        )}
                      </div>
                      {/*  */}
                      <div
                        className={`overflow-hidden w-full transition-all duration-700 ease-in-out ${
                          currentOpen === "Recruitment" ||
                          [
                            "/jobtype-Recruitment",
                            "/jobopening-Recruitment",
                            "/interview-Recruitment",
                            "/technologies-Recruitment",
                            "/Candidate-Recruitment",
                            "/dashboard-Recruitment",
                          ].includes(currentPath)
                            ? "max-h-60 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="flex gap-2  items-start  ms-8 flex-col text-sm font-medium text-gray-500">
                          <button
                            onClick={() => navigate("/dashboard-Recruitment")}
                            className={`px-2 py-1 rounded-full 
    ${
      currentPath === "/dashboard-Recruitment"
        ? " text-[#4F46E5]"
        : "hover:bg-blue-100 text-gray-500"
    }`}
                          >
                            DashBoard
                          </button>

                          <button
                            onClick={() => navigate("/jobtype-Recruitment")}
                            className={`px-2 py-1 rounded-full 
    ${
      currentPath === "/jobtype-Recruitment"
        ? " text-[#4F46E5]"
        : "hover:bg-blue-100 text-gray-500"
    }`}
                          >
                            Job Type
                          </button>
                          <button
                            onClick={() => navigate("/jobopening-Recruitment")}
                            className={`px-2 py-1 rounded-full 
    ${
      currentPath === "/jobopening-Recruitment"
        ? " text-[#4F46E5]"
        : "hover:bg-blue-100 text-gray-500"
    }`}
                          >
                            Job Opening
                          </button>
                          <button
                            onClick={() => navigate("/interview-Recruitment")}
                            className={`px-2 py-1 rounded-full 
    ${
      currentPath === "/interview-Recruitment"
        ? " text-[#4F46E5]"
        : "hover:bg-blue-100 text-gray-500"
    }`}
                          >
                            Interview Status
                          </button>

                          <button
                            onClick={() =>
                              navigate("/technologies-Recruitment")
                            }
                            className={`px-2 py-1 rounded-full 
    ${
      currentPath === "/technologies-Recruitment"
        ? " text-[#4F46E5]"
        : "hover:bg-blue-100 text-gray-500"
    }`}
                          >
                            Technologies
                          </button>

                          <button
                            onClick={() => navigate("/platform-Recruitment")}
                            className={`px-2 py-1 rounded-full 
    ${
      currentPath === "/platform-Recruitment"
        ? " text-[#4F46E5]"
        : "hover:bg-blue-100 text-gray-500"
    }`}
                          >
                            Platform
                          </button>

                          <button
                            onClick={() => navigate("/Candidate-Recruitment")}
                            className={`px-2 py-1 rounded-full 
    ${
      currentPath === "/Candidate-Recruitment"
        ? " text-[#4F46E5]"
        : "hover:bg-blue-100 text-gray-500"
    }`}
                          >
                            Candidate
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* announcement */}

                  {hasPermission("Announcement") && (
                    <>
                      <div
                        onClick={() => onClickSidebarMenu("announcement")}
                        className={`flex items-center w-full flex-grow ${
                          arrowClicked ? "justify-center  " : "justify-normal"
                        } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 h-10 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer ${
                          currentPath === "/payroll"
                            ? "bg-blue-100 text-[#4F46E5]"
                            : "text-gray-500 hover:bg-blue-100 hover:text-[#4F46E5]"
                        }`}
                      >
                        <GrAnnounce />
                        {!arrowClicked && (
                          <p className="text-sm">Announcement</p>
                        )}
                      </div>
                    </>
                  )}

                  {/* payroll */}

                  {hasPermission("Payroll") && (
                    <>
                      <div
                        onClick={() => onClickSidebarMenu("payroll")}
                        className={`flex items-center w-full flex-grow ${
                          arrowClicked ? "justify-center  " : "justify-normal"
                        } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 h-10 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer ${
                          currentPath === "/payroll"
                            ? "bg-blue-100 text-[#4F46E5]"
                            : "text-gray-500 hover:bg-blue-100 hover:text-[#4F46E5]"
                        }`}
                      >
                        <FaAmazonPay />
                        {!arrowClicked && <p className="text-sm">Payroll</p>}
                      </div>
                    </>
                  )}

                  {hasPermission("Privileges") && (
                    <>
                      <div
                        onClick={() => onClickSidebarMenu("Privileges")}
                        className={`flex items-center w-full flex-grow ${
                          arrowClicked ? "justify-center  " : "justify-normal"
                        } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 h-10 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer ${
                          currentPath === "/privileges"
                            ? "bg-blue-100 text-[#4F46E5]"
                            : "text-gray-500 hover:bg-blue-100 hover:text-[#4F46E5]"
                        }`}
                      >
                        <MdOutlineHideImage />
                        {!arrowClicked && <p className="text-sm">Privileges</p>}
                      </div>
                    </>
                  )}

                  {hasPermission("Asset Management") && (
                    <>
                      <div
                        onClick={() => onClickSidebarMenu("assetmanagement")}
                        className={`flex items-center w-full flex-grow ${
                          arrowClicked ? "justify-center  " : "justify-normal"
                        } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 h-10 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer ${
                          currentPath === "/assetmanagement"
                            ? "bg-blue-100 text-[#4F46E5]"
                            : "text-gray-500 hover:bg-blue-100 hover:text-[#4F46E5]"
                        }`}
                      >
                        <MdManageAccounts />
                        {!arrowClicked && (
                          <p className="text-sm">Asset Management</p>
                        )}
                      </div>
                    </>
                  )}

                  {hasPermission("Links") && (
                    <div
                      onClick={() => onClickSidebarMenu("links")}
                      className={`flex w-full items-center flex-grow ${
                        arrowClicked ? "justify-center  " : "justify-normal"
                      } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 h-10 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer ${
                        currentPath === "/links"
                          ? "bg-blue-100 text-[#4F46E5]"
                          : "text-gray-500 hover:bg-blue-100 hover:text-[#4F46E5]"
                      }`}
                    >
                      <FaLinkSlash />
                      {!arrowClicked && <p className="text-sm">Links</p>}
                    </div>
                  )}

                  {hasPermission("Holidays") && (
                    <div
                      onClick={() => onClickSidebarMenu("Holidays")}
                      className={`flex items-center w-full flex-grow ${
                        arrowClicked ? "justify-center  " : "justify-normal"
                      } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 h-10 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer ${
                        currentPath === "/Holidays"
                          ? "bg-blue-100 text-[#4F46E5]"
                          : "text-gray-500 hover:bg-blue-100 hover:text-[#4F46E5]"
                      }`}
                    >
                      <BiSolidHomeHeart />
                      {!arrowClicked && <p className="text-sm">Holidays</p>}
                    </div>
                  )}

                  {hasPermission("Settings") && (
                    <div
                      onClick={() => onClickSidebarMenu("settings")}
                      className={`flex items-center w-full flex-grow ${
                        arrowClicked ? "justify-center  " : "justify-normal"
                      } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 h-10 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer ${
                        currentPath === "/settings"
                          ? "bg-blue-100 text-[#4F46E5]"
                          : "text-gray-500 hover:bg-blue-100 hover:text-[#4F46E5]"
                      }`}
                    >
                      <IoSettings />

                      {!arrowClicked && <p className="text-sm">Settings</p>}
                    </div>
                  )}
                </>
              )}

              {/* <div
                onClick={() => navigate("/leave-type")}
                className={`flex w-full items-center flex-grow ${
                  arrowClicked ? "justify-center  " : "justify-normal"
                } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 h-10 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer ${
                  currentPath === "/leave-type"
                    ? "bg-blue-100 text-[#4F46E5]"
                    : "text-gray-500 hover:bg-blue-100 hover:text-[#4F46E5]"
                }`}
              >
                <HiOutlineHome />
                {!arrowClicked && <>Leaves Type</>}
              </div> */}

              {/* <div
                onClick={() => navigate("/joining-verification-list")}
                className={`flex w-full items-center flex-grow ${
                  arrowClicked ? "justify-center  " : "justify-normal"
                } hover:bg-blue-100 hover:text-[#4F46E5] px-2 py-3 h-10 rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer ${
                  currentPath === "/joining-verification-list"
                    ? "bg-blue-100 text-[#4F46E5]"
                    : "text-gray-500 hover:bg-blue-100 hover:text-[#4F46E5]"
                }`}
              >
                <HiOutlineHome />
                {!arrowClicked && <>Joining Verification</>}
              </div> */}
              <hr className="my-2 mx-4 w-40 border-gray-300" />
              <div
                onClick={() => onClickSidebarMenu("/")}
                className={`flex mx-2 items-center ${
                  arrowClicked ? "justify-center" : "justify-normal w-44"
                } ${
                  buttonLoading ? "justify-center" : "justify-normal"
                } px-3 py-3 gap-3 items-center mt-1 h-10  bg-blue-600 hover:bg-blue-700  rounded-full cursor-pointer`}
              >
                {buttonLoading ? (
                  <Button_Loader />
                ) : (
                  <>
                    <div className="text-white flex items-center justify-center">
                      <MdLogout />
                    </div>
                    {!arrowClicked && (
                      <p className="text-sm font-medium text-white">Logout</p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* settings */}
            {/* <div className="flex flex-col gap-6 ">
              {[{ icon: <IoSettingsOutline />, label: "Settings" }].map(
                (item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center ${
                      arrowClicked ? "justify-center" : "justify-normal"
                    } hover:bg-blue-100 px-2 py-3 hover:text-[#4F46E5] rounded-full gap-3 text-gray-500 text-sm font-medium cursor-pointer`}
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      {item.icon}
                    </div>
                    {!arrowClicked && <p className="text-sm">{item.label}</p>}
                  </div>
                )
              )}
            </div> */}
            {/* logout */}
          </div>
          {/* User Section */}
          <div
            className={`fixed bottom-0  bg-white ${
              arrowClicked ? "w-[60px]" : "w-52"
            }`}
          >
            <hr className="border-gray-300" />
            <div className="flex items-center gap-1 px-2 py-4">
              {/* <div className="h-10 w-10 rounded-full bg-yellow-500"></div> */}
              <img src={admin_icon} alt="" className="h-8 w-8 rounded-full" />
              {!arrowClicked && (
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 ">
                    <p className="text-xs ml-2 font-medium text-gray-500">
                      Welcome back
                    </p>
                  </div>
                  {client && (
                    <span
                      className="font-medium text-sm ml-5 cursor-pointer hover:text-blue-600"
                      onClick={() => clientView(id)}
                    >
                      {name}
                    </span>
                  )}
                  {user.superUser && (
                    <div className="">
                      <button
                        onClick={changePassword}
                        className="p-1 px-2 rounded-full  items-center mt-2 mb-2 bg-[#e6f2fe] cursor-pointer text-[#4656b9]  text-xs"
                      >
                        Change Password
                      </button>
                    </div>
                  )}
                  {/* <p className="font-medium text-sm">{adminName}</p> */}
                </div>
              )}
              {!arrowClicked && (
                <IoIosArrowForward className="ml-auto text-gray-600 cursor-pointer" />
              )}
            </div>
          </div>
        </div>
      </section>

      {changePasswordIsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setChangePasswordIsOpen(false)}
        >
          <div
            className="bg-white p-5 px-8 rounded-xl w-[400px] h-[200px] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold">Change Password (Admin)</h2>
            <input
              type="text"
              onChange={(e) => setAdminPassword(e.target.value)}
              className=" border-2 rounded-md border-gray-300 px-3 py-2 outline-none w-full mt-4"
              placeholder="Change Password"
            />

            <div className="flex justify-end">
              <button
                onClick={changePasswordAdmin}
                className="bg-blue-600 px-4 py-2 text-white rounded-lg mt-5 "
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

export default Sidebar;
