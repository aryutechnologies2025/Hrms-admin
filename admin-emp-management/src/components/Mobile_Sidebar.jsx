import React from "react";
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from "react-icons/io";
import medics_logo from "/Aryu.svg";
import { IoPeopleOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { useState, useEffect ,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { CiBoxList } from "react-icons/ci";
import admin_icon from "../assets/admin_icon.png";
import { BiSolidHomeHeart } from "react-icons/bi";
import { FaRegAddressCard } from "react-icons/fa";
import { VscGithubProject } from "react-icons/vsc";
import { FaBuildingUser } from "react-icons/fa6";
import { BsBank2 } from "react-icons/bs";
import { GiCrystalGrowth } from "react-icons/gi";
import { LuUserSearch } from "react-icons/lu";
import { BsFillCameraReelsFill } from "react-icons/bs";
import { FaAmazonPay } from "react-icons/fa6";
import { MdOutlineHideImage } from "react-icons/md";
import { FaLinkSlash } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import Button_Loader from "./Button_Loader";
import { MdManageAccounts } from "react-icons/md";
import { GrAnnounce } from "react-icons/gr";
import AdminImage from "../assets/Yuvaraj-CEO-Aryu-Academy.png"
import { GiDiscussion } from "react-icons/gi";

const Mobile_Sidebar = () => {
  let navigate = useNavigate();

  const [hamburgerIconClicked, setHamburgerIconClicked] = useState(false);

  const [buttonLoading, setButtonLoading] = useState(false);
  const [arrowClicked, setArrowClicked] = useState(false);

  const onClickSidebarMenu = (label) => {
    if (label === "/") {
      setButtonLoading(true);
      setTimeout(() => {
        localStorage.removeItem("hrmsuser");
        localStorage.removeItem("token");
        window.location.reload();

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

  const user = JSON.parse(localStorage.getItem("hrmsuser"));

  const client =
    user?.type === "client" || user?.type === "subuser" ? true : false;

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
        payload, {withCredentials: true}
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

  const onClickHamburgerIcon = () => {
    setHamburgerIconClicked(!hamburgerIconClicked);
  };

  useEffect(() => {
    if (hamburgerIconClicked) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Clean up on component unmount
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [hamburgerIconClicked]);

  const [openSection, setOpenSection] = useState(null);

  const [openMenu, setOpenMenu] = useState(false);

 const menuRef = useRef(null);

  // CLOSE MENU ON OUTSIDE CLICK
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <div className="flex md:my-3 justify-start items-center w-full md:hidden ">
 <div className="flex justify-between items-center w-full bg-white px-4 py-2 shadow-md">

  {/* LEFT - Hamburger */}
  <GiHamburgerMenu
    className="text-gray-700 text-2xl cursor-pointer"
    onClick={onClickHamburgerIcon}
  />

  {/* CENTER - LOGO */}
  <img
    src={medics_logo}
    alt="Medics"
    className="h-10 object-contain md:h-12"
    onClick={() => onClickSidebarMenu("Dashboard")}
  />

  {/* RIGHT - Profile Circle */}
  <div className="relative" ref={menuRef}>
   <img
  src={AdminImage}
  alt="profile"
  className="w-10 h-10 rounded-full border border-gray-300 cursor-pointer object-cover"
  onClick={() => setOpenMenu(!openMenu)}
/>


    {/* Dropdown Menu */}
    {openMenu && (
  <div className="absolute right-1 mt-3 w-44 bg-white shadow-lg rounded-xl py-3 z-50 animate-fadeIn border border-gray-100">

    {/* Settings */}
    <div
      onClick={() => onClickSidebarMenu("settings")}
      className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600 cursor-pointer rounded-lg transition"
    >
      <IoSettings className="text-lg" />
      <span className="text-sm font-medium">Settings</span>
    </div>

    {/* Divider */}
    <div className="border-t my-2"></div>

    {/* Logout Button */}
    <div
      onClick={() => onClickSidebarMenu("/")}
      className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer 
                 bg-red-50 text-red-600 hover:bg-red-100 transition"
    >
      {buttonLoading ? (
        <Button_Loader />
      ) : (
        <>
          <MdLogout className="text-lg" />
          <span className="text-sm font-medium">Logout</span>
        </>
      )}
    </div>

  </div>
)}

  </div>

</div>

      </div>

      {hamburgerIconClicked && (
        <div className="fixed block md:hidden h-screen inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 backdrop-blur-sm bg-opacity-25"
            onClick={() => setHamburgerIconClicked(false)}
          ></div>

          {/* Sidebar */}
          <div
            className={`fixed top-0 left-0 h-full w-[70vw] sm:w-[50vw] bg-white shadow-lg transform transition-transform duration-1000 ease-in-out${
              hamburgerIconClicked ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Close Button */}
              <div className="flex mt-2 ps-2">
                <IoClose
                  className="text-2xl"
                  onClick={() => setHamburgerIconClicked(false)}
                />
              </div>

              {/* Logo */}
              <div className="flex items-center justify-center">
                <img src={medics_logo} alt="" className="w-20 h-10" />
              </div>

              {/* Sidebar Menu */}
              <div className="flex-grow overflow-y-auto w-full flex flex-col justify-start">
                <div className="flex flex-col gap-1 mt-3 px-4">
                  {/* dashboard */}
                  {!client && (
                    <>
                      {" "}
                      <div
                        onClick={() => onClickSidebarMenu("Dashboard")}
                        className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                      >
                        <div className="flex items-center justify-center h-5 w-5">
                          <CiBoxList />
                        </div>
                        <p>Dashboard</p>
                      </div>
                      {/* links */}
                        <div
                        onClick={() => onClickSidebarMenu("links")}
                        className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                      >
                        <div className="flex items-center justify-center h-5 w-5">
                          <FaLinkSlash />
                        </div>
                        <p>Links</p>
                      </div>
                      {/*complaince*/}
                      <div
                        onClick={() => onClickSidebarMenu("complaince")}
                        className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                      >
                        <div className="flex items-center justify-center h-5 w-5">
                          <GiDiscussion />
                        </div>
                        <p>Complaince</p>
                      </div>
                       {/* onboarding */}
                      <div
                        onClick={() =>
                          setOpenSection(
                            openSection === "onboarding" ? null : "onboarding"
                          )
                        }
                        className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                      >
                        <div className="flex items-center justify-center h-5 w-5">
                          <FaRegAddressCard />
                        </div>
                        <p>On Boarding</p>
                        {openSection === "onboarding" ? (
                          <IoIosArrowUp />
                        ) : (
                          <IoIosArrowDown />
                        )}{" "}
                      </div>
                      {openSection === "onboarding" && (
                        <div
                          className={`transition-all duration-700 ease-in-out ${
                            openSection === "onboarding"
                              ? "max-h-70 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="flex gap-2 w-fit h-full items-start ms-10 flex-col text-sm font-medium text-gray-500">
                            <button
                              onClick={() => onClickSidebarMenu("departments")}
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Departments
                            </button>
                            <button
                              onClick={() => onClickSidebarMenu("roles")}
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Roles
                            </button>
                            <button
                              onClick={() => onClickSidebarMenu("employees")}
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Employees
                            </button>
                            <button
                              onClick={() => onClickSidebarMenu("inter")}
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Internship
                            </button>
                            <button
                              onClick={() =>
                                onClickSidebarMenu("Declaration-deatils")
                              }
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Declaration
                            </button>
                            <button
                              onClick={() =>
                                onClickSidebarMenu("releiving-letter")
                              }
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Relieving List
                            </button>


                              <button
                              onClick={() =>
                                onClickSidebarMenu("relieved-list")
                              }
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Relieved List
                            </button>
                            <button
                              onClick={() => onClickSidebarMenu("letters-form")}
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Letter list
                            </button>
                          </div>
                        </div>
                      )}
                      {/* employee */}
                      <div
                        // onClick={() => setSelectAnyOneEmployee(!selectAnyOneEmployee)}
                        onClick={() =>
                          setOpenSection(
                            openSection === "employee" ? null : "employee"
                          )
                        }
                        className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                      >
                        <div className="flex items-center justify-center h-5 w-5">
                          <IoPeopleOutline />
                        </div>
                        <p>Employee</p>
                        {openSection === "employee" ? (
                          <IoIosArrowUp />
                        ) : (
                          <IoIosArrowDown />
                        )}{" "}
                      </div>
                      {openSection === "employee" && (
                        <div
                          className={`overflow-hidden w-full transition-all duration-700 ease-in-out ${
                            openSection === "employee"
                              ? "max-h-50 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="flex gap-2  items-start  ms-10 flex-col text-sm font-medium text-gray-500">
                            <button
                              onClick={() => onClickSidebarMenu("attendance")}
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Attendance
                            </button>
                            <button
                              onClick={() => onClickSidebarMenu("leaves")}
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Leaves
                            </button>
                            <button
                              onClick={() => onClickSidebarMenu("wfh")}
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              WFH
                            </button>
                            <button
                              onClick={() =>
                                onClickSidebarMenu("requestdetails")
                              }
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Request
                            </button>
                          </div>
                        </div>
                      )}
                      {/* project */}
                      <div
                        // onClick={() => setSelectAnyOneProject(!selectAnyOneProject)}
                        onClick={() =>
                          setOpenSection(
                            openSection === "projects" ? null : "projects"
                          )
                        }
                        className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                      >
                        <div className="flex items-center justify-center h-5 w-5">
                          <VscGithubProject />
                        </div>
                        <p>Projects</p>
                        {openSection === "projects" ? (
                          <IoIosArrowUp />
                        ) : (
                          <IoIosArrowDown />
                        )}{" "}
                      </div>
                      {openSection === "projects" && (
                        <div
                          className={`overflow-hidden w-full transition-all duration-700 ease-in-out ${
                            openSection === "projects"
                              ? "max-h-40 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="flex gap-2  items-start  ms-10 flex-col text-sm font-medium text-gray-500">
                            <button
                              onClick={() => onClickSidebarMenu("project-list")}
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Project
                            </button>
                            <button
                              onClick={() => onClickSidebarMenu("task-list")}
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Task
                            </button>
                            <button
                              onClick={() => onClickSidebarMenu("reports")}
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Reports
                            </button>
                          </div>
                        </div>
                      )}
                      {/* clients */}
                      <div
                        // onClick={() => setSelectAnyOneClient(!selectAnyOneClient)}
                        onClick={() =>
                          setOpenSection(
                            openSection === "clients" ? null : "clients"
                          )
                        }
                        className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                      >
                        <div className="flex items-center justify-center h-5 w-5">
                          <FaBuildingUser />
                        </div>
                        <p>Clients</p>
                        {openSection === "clients" ? (
                          <IoIosArrowUp />
                        ) : (
                          <IoIosArrowDown />
                        )}{" "}
                      </div>
                      {openSection === "clients" && (
                        <div
                          className={`overflow-hidden w-full transition-all duration-700 ease-in-out ${
                            openSection === "clients"
                              ? "max-h-40 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="flex gap-2  items-start  ms-10 flex-col text-sm font-medium text-gray-500">
                            <button
                              onClick={() =>
                                onClickSidebarMenu("client-details")
                              }
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Client List
                            </button>
                            <button
                              onClick={() =>
                                onClickSidebarMenu("invoice-details")
                              }
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Invoice List
                            </button>
                            <button
                              onClick={() =>
                                onClickSidebarMenu("mom-details")
                              }
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              MOM
                            </button>
                          </div>
                        </div>
                      )}
                      {/* finance */}
                      <div
                        // onClick={() => setSelectAnyOneFinance(!selectAnyOneFinance)}
                        onClick={() =>
                          setOpenSection(
                            openSection === "finance" ? null : "finance"
                          )
                        }
                        className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                      >
                        <div className="flex items-center justify-center h-5 w-5">
                          <BsBank2 />
                        </div>
                        <p>Finance</p>
                        {openSection === "finance" ? (
                          <IoIosArrowUp />
                        ) : (
                          <IoIosArrowDown />
                        )}{" "}
                      </div>
                      {openSection === "finance" && (
                        <div
                          className={`overflow-hidden w-full transition-all duration-700 ease-in-out ${
                            openSection === "finance"
                              ? "max-h-50 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="flex gap-2  items-start  ms-10 flex-col text-sm font-medium text-gray-500">
                            <button
                              onClick={() =>
                                onClickSidebarMenu("finance-account")
                              }
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Account
                            </button>
                            <button
                              onClick={() =>
                                onClickSidebarMenu("income/details")
                              }
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Income List
                            </button>
                            <button
                              onClick={() =>
                                onClickSidebarMenu("expense/details")
                              }
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Expense List
                            </button>
                            <button
                              onClick={() => onClickSidebarMenu("payment-type")}
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Payments
                            </button>
                            <button
                              onClick={() => onClickSidebarMenu("bankstatement")}
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Bank Statement
                            </button>
                            <button
                              onClick={() => onClickSidebarMenu("recurring")}
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Recurring
                            </button>
                          </div>
                        </div>
                      )}
                      {/* bidding */}
                      <div
                        // onClick={() => setSelectAnyOneBidding(!selectAnyOneBidding)}
                        onClick={() =>
                          setOpenSection(
                            openSection === "bidding" ? null : "bidding"
                          )
                        }
                        className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                      >
                        <div className="flex items-center justify-center h-5 w-5">
                          <GiCrystalGrowth />
                        </div>
                        <p>Bidding</p>
                        {openSection === "bidding" ? (
                          <IoIosArrowUp />
                        ) : (
                          <IoIosArrowDown />
                        )}{" "}
                      </div>
                      {openSection === "bidding" && (
                        <div
                          className={`overflow-hidden w-full transition-all duration-700 ease-in-out ${
                            openSection === "bidding"
                              ? "max-h-50 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="flex gap-2  items-start  ms-10 flex-col text-sm font-medium text-gray-500">
                            <button
                              onClick={() =>
                                onClickSidebarMenu("account-bidding")
                              }
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Account
                            </button>
                            <button
                              onClick={() => onClickSidebarMenu("tech-bidding")}
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Technology
                            </button>
                            <button
                              onClick={() =>
                                onClickSidebarMenu("bidding-details")
                              }
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Bidding Details
                            </button>
                            <button
                              onClick={() =>
                                onClickSidebarMenu("connect-details")
                              }
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Connects Details
                            </button>
                            <button
                              onClick={() =>
                                onClickSidebarMenu("bidding-reports")
                              }
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Bidding Reports
                            </button>
                          </div>
                        </div>
                      )}
                      {/* socialmedia */}
                      <div
                        // onClick={() => setSelectAnyOneSocialMedia(!selectAnyOneSocialMedia)}
                        onClick={() =>
                          setOpenSection(
                            openSection === "socialmedia" ? null : "socialmedia"
                          )
                        }
                        className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                      >
                        <div className="flex items-center justify-center h-5 w-5">
                          <BsFillCameraReelsFill />
                        </div>
                        <p>Social Media</p>
                        {openSection === "socialmedia" ? (
                          <IoIosArrowUp />
                        ) : (
                          <IoIosArrowDown />
                        )}{" "}
                      </div>
                      {openSection === "socialmedia" && (
                        <div
                          className={`overflow-hidden w-full transition-all duration-700 ease-in-out ${
                            openSection === "socialmedia"
                              ? "max-h-40 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="flex gap-2  items-start  ms-10 flex-col text-sm font-medium text-gray-500">
                            <button
                              onClick={() =>
                                onClickSidebarMenu("social-account")
                              }
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Social Account
                            </button>
                            <button
                              onClick={() =>
                                onClickSidebarMenu("social-credentials")
                              }
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Credentials
                            </button>
                            <button
                              onClick={() =>
                                onClickSidebarMenu("social-contentmaster")
                              }
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Content Master
                            </button>
                          </div>
                        </div>
                      )}
                      {/* recruitment */}
                      <div
                        // onClick={() => setSelectAnyOneRecruitment(!selectAnyOneRecruitment)}
                        onClick={() =>
                          setOpenSection(
                            openSection === "Recruitment" ? null : "Recruitment"
                          )
                        }
                        className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                      >
                        <div className="flex items-center justify-center h-5 w-5">
                          <LuUserSearch />
                        </div>
                        <p>Recruitment</p>
                        {openSection === "Recruitment" ? (
                          <IoIosArrowUp />
                        ) : (
                          <IoIosArrowDown />
                        )}{" "}
                      </div>
                      {openSection === "Recruitment" && (
                        <div
                          className={`overflow-hidden w-full transition-all duration-700 ease-in-out ${
                            openSection === "Recruitment"
                              ? "max-h-60 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="flex gap-2  items-start  ms-10 flex-col text-sm font-medium text-gray-500">
                            <button
                              onClick={() =>
                                onClickSidebarMenu("dashboard-Recruitment")
                              }
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              DashBoard
                            </button>
                            <button
                              onClick={() =>
                                onClickSidebarMenu("jobtype-Recruitment")
                              }
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Job Type
                            </button>
                            <button
                              onClick={() =>
                                onClickSidebarMenu("jobopening-Recruitment")
                              }
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Job Opening
                            </button>
                            <button
                              onClick={() =>
                                onClickSidebarMenu("interview-Recruitment")
                              }
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Interview Status
                            </button>
                            <button
                              onClick={() =>
                                onClickSidebarMenu("technologies-Recruitment")
                              }
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Technologies
                            </button>
                            <button
                              onClick={() =>
                                onClickSidebarMenu("Candidate-Recruitment")
                              }
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Candidate
                            </button>
                            <button
                              onClick={() =>
                                onClickSidebarMenu("source-Recruitment")
                              }
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Source
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Lead management */}
                      <div
                        // onClick={() => setSelectAnyOneSocialMedia(!selectAnyOneSocialMedia)}
                        onClick={() =>
                          setOpenSection(
                            openSection === "leads" ? null : "leads"
                          )
                        }
                        className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                      >
                        <div className="flex items-center justify-center h-5 w-5">
                          <BsFillCameraReelsFill />
                        </div>
                        <p>Leads Management</p>
                        {openSection === "leads" ? (
                          <IoIosArrowUp />
                        ) : (
                          <IoIosArrowDown />
                        )}{" "}
                      </div>
                      {openSection === "leads" && (
                        <div
                          className={`overflow-hidden w-full transition-all duration-700 ease-in-out ${
                            openSection === "leads"
                              ? "max-h-40 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="flex gap-2  items-start  ms-10 flex-col text-sm font-medium text-gray-500">
                            <button
                              onClick={() =>
                                onClickSidebarMenu("leads")
                              }
                              className="hover:bg-blue-100 px-2 py-1 rounded-full"
                            >
                              Leads
                            </button>
                           
                          </div>
                        </div>
                      )}

                      {/* announcement */}
                      <div
                        onClick={() => onClickSidebarMenu("Announcement")}
                        className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                      >
                        <div className="flex items-center justify-center h-5 w-5">
                          <GrAnnounce />
                        </div>
                        <p>Announcement</p>
                      </div>
                      {/* payroll */}
                      <div
                        onClick={() => onClickSidebarMenu("Payroll")}
                        className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                      >
                        <div className="flex items-center justify-center h-5 w-5">
                          <FaAmazonPay />
                        </div>
                        <p>Payroll</p>
                      </div>
                      {/* privileges */}
                      <div
                        onClick={() => onClickSidebarMenu("Privileges")}
                        className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                      >
                        <div className="flex items-center justify-center h-5 w-5">
                          <MdOutlineHideImage />
                        </div>
                        <p>Privileges</p>
                      </div>
                      {/* asset management */}
                      <div
                        onClick={() => onClickSidebarMenu("assetmanagement")}
                        className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                      >
                        <div className="flex items-center justify-center h-5 w-5">
                          <MdManageAccounts />
                        </div>
                        <p>Asset</p>
                      </div>
                      {/* links */}
                    
                      {/* holiday */}
                      <div
                        onClick={() => onClickSidebarMenu("Holidays")}
                        className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                      >
                        <div className="flex items-center justify-center h-5 w-5">
                          <BiSolidHomeHeart />
                        </div>
                        <p>Holidays</p>
                      </div>
                      {/* links */}
                      <div
                        onClick={() => onClickSidebarMenu("settings")}
                        className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                      >
                        <div className="flex items-center justify-center h-5 w-5">
                          <IoSettings />
                        </div>
                        <p>Settings</p>
                      </div>
                    </>
                  )}
                  {/* client dashboard */}

                  {client && (
                    <>
                      <div
                        onClick={() => onClickSidebarMenu("client-dashboard")}
                        className="text-gray-500 hover:bg-blue-100 px-2 py-1 rounded-full flex gap-2 items-center"
                      >
                        <CiBoxList />
                        <p className="text-sm">Dashboard</p>
                      </div>

                      <div
                        onClick={() => onClickSidebarMenu("task-list-client")}
                        className="text-gray-500 hover:bg-blue-100 px-2 py-1 rounded-full  flex gap-2 items-center"
                      >
                        <VscGithubProject />
                        <p className="text-sm">Project</p>
                      </div>
                    </>
                  )}
                  {user.type === "client" && !user.subType && (
                    <div
                      onClick={() => onClickSidebarMenu("client-subuser")}
                      className="text-gray-500 hover:bg-blue-100 px-2 py-1 rounded-full  flex gap-2 items-center"
                    >
                      <LuUserSearch />
                      {!arrowClicked && <p className="text-sm">Users</p>}
                    </div>
                  )}
                </div>

                <hr className="my-3 mx-4 border-gray-300" />

                {/* Logout */}

                <div
                  onClick={() => onClickSidebarMenu("/")}
                  className={`flex items-center text-center ${
                    arrowClicked ? "justify-center" : "justify-normal w-36"
                  } ${
                    buttonLoading ? "justify-center" : "justify-normal"
                  } px-5 py-2 gap-3 items-center ml-5 h-10  bg-blue-600 hover:bg-blue-700  rounded-full cursor-pointer`}
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

              {/* User Section */}
              <div>
                <hr className="border-gray-300" />
                <div className="flex items-center gap-1 px-2 py-4">
                  {/* <div className="h-10 w-10 rounded-full bg-yellow-500"></div> */}
                  <img
                    src={admin_icon}
                    alt=""
                    className="h-8 w-8 rounded-full"
                  />
                  {!arrowClicked && (
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <p className="text-xs ml-2 font-medium text-gray-500">
                          Welcome back
                        </p>
                      </div>
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
          </div>
          {changePasswordIsOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-1 md:p-0"
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
      )}
    </div>
  );
};

export default Mobile_Sidebar;
