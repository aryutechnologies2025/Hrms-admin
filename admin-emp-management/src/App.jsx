import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { createContext, lazy, useRef } from "react";
import Employees from "./pages/Employees";
import CreateEmployee from "./pages/CreateEmployee";
import EmployeeDetails from "./pages/EmployeeDetails";
import EditEmployeeDetails from "./pages/EditEmployeeDetails";
import Attendance from "./pages/Attendance";
import MonthlyAttendanceDetails from "./pages/MonthlyAttendanceDetails";
import Leaves from "./pages/Leaves";
import Finance from "./pages/Finance";
import Payroll from "./pages/Payroll";
import Dashboard from "./pages/Dashboard";
import DashboardClient from "./pages/DashboardClient";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import CreateVacancy from "./pages/CreateVacancy";
import Roles from "./pages/Roles";
import CustomerDashboard from "./pages/Customer";
import Permission from "./pages/Permission";
import Sitemap from "./pages/Sitemap";
import Income_History from "./pages/Income_History";
import Expense_History from "./pages/Expense_History";
import Job_Application from "./pages/Job_Application";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./auth/Protected_Route";
import Hoildays from "./pages/Hoildays";
import Backup from "./pages/Backup";
import WorkingDays from "./pages/WorkingDays";
import PresentedEmployees_Mainbar from "./components/presented employees components/PresentedEmployees_Mainbar";
import PresentedEmployees from "./pages/PresentedEmployees";
import AbsentEmployees from "./pages/AbsentEmployees";
import WorkFromHomeEmployees from "./pages/WorkFromHomeEmployees";
import Departments from "./pages/Departments";
import WorkFromHome from "./pages/WorkFromHome";
import Dummy from "./pages/Dummy";
import ProjectList from "./components/project list/ProjectList";
import ProjectListPage from "./pages/ProjectListPage";
import TaskListPage from "./pages/TaskListPage";
import TaskListClientPage from "./pages/TaskListClientPage";

import Tasklist_main from "./pages/Tasklist_main";

import Client_home from "./pages/Client_home";
import Invoice_details from "./pages/Invoice_details";
import Invoice_home from "./pages/Invoice_home";
import Task_home from "./components/taskList/Task_home";
import Task_homeClient from "./components/taskList/Task_homeClient";
import Reports_mainbar from "./pages/Reports_mainbar";
import Attendance_tracker from "./pages/Attendance_tarcker";
import Revision from "./pages/Revision";
import Leave_type from "./pages/Leave_type";
import Link_mainbar from "./pages/Link_mainbar";
import AddLink_mainbar from "./pages/AddLinks_mainbar";
import Addcategory_mainbar from "./pages/Addcategory_mainbar";
import Request_mainbar from "./components/work from home components/Request_mainbar";
import Leave_Report from "./components/leaves components/Leave_Report";
import Expense_icome_details from "./pages/Expense_icome_details";
import Expense_income_main from "./pages/Expense_icome_main";
import Income_main from "./pages/Income_main";
import Notes_main from "./pages/Notes_main";
import Invoice from "./components/invoice desgins/Invoice_download";
import Leave_option_main from "./pages/Leave_option_main";
import Close_home from "./components/taskList/Close_home";
import Close_homeClient from "./components/taskList/Close_homeClient";
import Joining_list from "./pages/Joining_list";
import Reliving_list from "./pages/Reliving_list";
import Joining_verification from "./pages/joining_verification";
import Declaration_main from "./pages/Declaration_main";

import { AdminPrivileges } from "./pages/AdminPrivileges";
import Declaration_pdf from "./pages/Declaration_pdf";
import axios from "axios";
import { API_URL } from "./config";
import Releiving from "./pages/Releiving";
import Payment_type_main from "./components/Payment Type/Payment_type_main";
import Letters_main from "./pages/Letters_main";
import Invoice_full from "./pages/Invoice_full";
import Invoice_full_main from "./pages/Invoice_full_main";
import Setting_main from "./pages/Setting_main";
import Client_view from "./pages/Client_view";
import Account_bidding_main from "./components/bidding assests components/Account_bidding_main";
import Tech_bidding_main from "./components/bidding assests components/Tech_bidding_main";
import Attendance_add_main from "./components/attendance components/Attendance_add_main";
import Bidding_main from "./components/bidding assests components/Bidding_main";
import Connect_main from "./components/bidding assests components/Connect_main";
import JobType_main from "./components/recruitment components/JobType_main";
import JobOpening_Main from "./components/recruitment components/JobOpening_Main";
import InterViewStatus_Main from "./components/recruitment components/InterViewStatus_Main";

import Source_Details from "./components/recruitment components/Source_Details";
import Source_Main from "./components/recruitment components/Source_Main";
import Candidate_Main from "./components/recruitment components/Candidate_Main";
import DashBoard_Main from "./components/recruitment components/DashBoard_Main";
import Bidding_reports_main from "./components/bidding assests components/Bidding_reports_main";
import Demo_invoice from "./pages/Demo_invoice";
import Letters_download from "./components/releiving components/Letters_download";
import Social_account_main from "./components/social media/Social_account_main";
import Social_credentials_main from "./components/social media/Social_credentials_main";
import Finance_account_main from "./pages/Finance_account_main";
import Finance_lender_main from "./pages/Finance_lender_main";

import Messages from "./pages/Messages";
import Bidding_all_main from "./components/bidding assests components/Bidding_all_main";
import Tasklist_main_client from "./pages/Tasklist_main_client";
import Admin_privileges_main from "./pages/Admin_privileges_main";
import PayslipContent from "./components/payroll components/PayslipContent";
import SessionChecker from "./auth/SessionChecker";

import DashboardClientSubUserMain from "./pages/DashboardSubUserClient";
import Mom from "./pages/Mom";

import Client_view_SubUser_details from "./pages/client_view_subUser_details";
import Client_view_subuser from "./pages/client_subuser_view";
import Client_login from "./pages/Client_login";
import Client_subUser_login from "./pages/Client_subUser_login";
import AssetCategory_mainbar from "./components/Asset management components/AssetCategory_mainbar";
import Platform_Details from "./components/recruitment components/Platform_Details";
import Task_details_client from "./components/taskList/Task_details_client";
import AssetManagement_mainbar from "./pages/AssetManagement_mainbar";
import BankStatement_Mainbar from "./components/finance components/BankStatement_Mainbar";
import Relieved_main from "./pages/Relieved_main";
import Document_main from "./pages/Document_main";
import Inter_card from "./pages/Inter_card";
import Announcement from "./pages/Announcement";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.core.css";
import AssectDocument from "./components/Assect Document/AssectDocument";
import AssentDocumentPage from "./pages/AssentDocumentPage";
import AssetSubCategory_mainbar from "./components/Asset management components/AssetSubCategory_mainbar";
import Clients_note_main from "./pages/Clients_note_main";
import Complaince_Mainbar from "./components/complaince/Complaince_Mainbar";
import Recurring_Mainbar from "./components/finance components/Recurring_Mainbar";
import Slack_details from "./components/Slack Componenet/Slack_details";
import Slack_mainbar from "./components/Slack Componenet/Slack_mainbar";
import Setting_invoice_main from "./pages/Settings_invoice_main";
import Export_invoice from "./components/invoice desgins/Export_invoice";
import Performa_invoice from "./components/invoice desgins/Performa_invoice";
import Sales_invoice from "./components/invoice desgins/Sales_invoice";
import Invoice_edit_main from "./pages/Invoice_edit_main";
import Client_invoice_main from "./components/Invoice Client/Client_invoice_main";
import Bidding_transaction_main from "./components/bidding assests components/Bidding_transaction_main";
import Billing_details_main from "./components/bidding assests components/Billing_details.main";
import LeadManagement_Mainbar from "./pages/LeadManagement_Mainbar";
import Payslip_govt from "./components/payroll components/Payslip_govt";
import Social_ContentMaster_Main from "./components/social media/Social_ContentMaster_Main";
import Digital_list_main from "./components/digital team/Digital_list_main";
import Technology_Main from "./pages/Portfolio pages/Technology_Main";
import Portfolio_Main from "./pages/Portfolio pages/Portfolio_Main";
import { setSocket } from "./redux/socketSlice";
import { connectSocket } from "./services/socket";
import { useDispatch, useSelector } from "react-redux";
import useSocketNotifications from "./hooks/useSocketNotifications";
import useSocketConnection from "./hooks/useSocketConnection";
import useSocketEvents from "./hooks/useSocketEvents";
import { initNotificationSound, resetTabTitle } from "./notifications/notificationManager";

export const SettingsContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const userDetails = localStorage.getItem("hrmsuser");
   
    return userDetails ? true : false;
  });
   const socketRef = useRef(null);

  const [dynamicDateFormat, setDynamicDateFormat] = useState("");
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.chat.selectedUser);

  const selectedChannel = useSelector((state) => state.chat.selectedChannel);

  const settingsApi = async () => {
    const response = await axios.get(`${API_URL}/api/setting/view-setting`);
    const dateFormat = response.data.data[0]?.date_format;
    setDynamicDateFormat(dateFormat);
  };

  useEffect(() => {
    settingsApi();
  }, []);

  //  const response = await axios.get(`${API_URL}/api/setting/view-setting`,
  //   {withCredentials: true}
  //  );
  //  const dateFormat = response.data.data[0]?.date_format;
  //  setDynamicDateFormat(dateFormat);

  // }
  // useEffect(() => {
  //   settingsApi();
  // },[]);

  useEffect(() => {
    const handleStorageChange = () => {
      const userDetails = localStorage.getItem("hrmsuser");
      setIsLoggedIn(userDetails ? true : false);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const user = JSON.parse(localStorage.getItem("hrmsuser") || "{}");

  // storing socket instance in redux to access across the app without prop drilling
  useEffect(() => {
    if (!user?._id) return;

    socketRef.current = connectSocket(user._id);

    dispatch(setSocket(socketRef.current));
  }, [user]);

  const fetchPermissionModule = async () => {
    const user = JSON.parse(localStorage.getItem("hrmsuser"));

    if (!user.superUser) {
      const response = await axios.get(
        `${API_URL}/api/hr-permission/get-employee-permission/${user?.employeeId}`,
      );
      localStorage.setItem(
        "module",
        JSON.stringify(response?.data?.data[0]?.module || []),
      );
    }
  };

  useEffect(() => {
    fetchPermissionModule();
  }, []);

  // const user = JSON.parse(localStorage.getItem("hrms_employee"));

    

    // storing socket instance in redux to access across the app without prop drilling
  useEffect(() => {
    if (!user?._id) return;

    socketRef.current = connectSocket(user._id);

    dispatch(setSocket(socketRef.current));
  }, [user]);

   //  useSocketNotifications(user);
  useSocketConnection(user);

  useSocketEvents({
    socket: socketRef.current,
    currentUser: user,
    selectedUser,
    selectedChannel,
  });
  useEffect(() => {

  const handleFocus = () => {
    resetTabTitle();
  };

  window.addEventListener("focus", handleFocus);

  return () => {
    window.removeEventListener("focus", handleFocus);
  };

}, []);

// calling sound 
useEffect(() => {
  initNotificationSound();
}, []);

// Asking permission for browser notifications on app load

useEffect(() => {
  if ("Notification" in window) {
    Notification.requestPermission();
  }
}, []); 


  const routesConfig = [
    /* -------------------------------------------
     PUBLIC ROUTES (NO ROLE, NO PERMISSION)
  --------------------------------------------*/
    {
      path: "/",
      element: isLoggedIn ? (
        user?.type === "client" || user?.type === "subuser" ? (
          <Navigate to="/client-dashboard" replace />
        ) : (
          <Navigate to="/dashboard" replace />
        )
      ) : (
        <Login setIsLoggedIn={setIsLoggedIn} />
      ),
    },

    {
      path: "/client",
      element: <Client_login setIsLoggedIn={setIsLoggedIn} />,
    },
    {
      path: "/client-user",
      element: <Client_subUser_login setIsLoggedIn={setIsLoggedIn} />,
    },

    {
      path: "/dashboard",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Dashboard />
        </ProtectedRoute>
      ),
    },

    /* -------------------------------------------
          CLIENT ROUTES
  --------------------------------------------*/
    {
      path: "/client-dashboard",
      requiredRole: "client",
      element: (
        <ProtectedRoute
          isLoggedIn={isLoggedIn}
          requiredRole={["client", "subuser"]}
        >
          <DashboardClient />
        </ProtectedRoute>
      ),
    },

    {
      path: "/task-list-client",
      element: (
        <ProtectedRoute
          isLoggedIn={isLoggedIn}
          requiredRole={["client", "subuser"]}
        >
          <TaskListClientPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/task-details-client",
      element: (
        <ProtectedRoute
          isLoggedIn={isLoggedIn}
          requiredRole={["client", "subuser"]}
        >
          <Task_homeClient />
        </ProtectedRoute>
      ),
    },
    {
      path: "/client-view",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="client">
          <Client_view />
        </ProtectedRoute>
      ),
    },
    {
      path: "/client-view-subUser",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="subuser">
          <Client_view_subuser />
        </ProtectedRoute>
      ),
    },

    {
      path: "/tasklist-details_client/:taskId",
      element: (
        <ProtectedRoute
          isLoggedIn={isLoggedIn}
          requiredRole={["client", "subuser"]}
        >
          <Tasklist_main_client />
        </ProtectedRoute>
      ),
    },

    {
      path: "/client-subuser",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="client">
          <DashboardClientSubUserMain />
        </ProtectedRoute>
      ),
    },

    /* -------------------------------------------
     ADMIN MODULE: ON BOARDING
  --------------------------------------------*/
    {
      path: "/employees",
      permissionTitle: "On Boarding",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Employees />
        </ProtectedRoute>
      ),
    },
    {
      path: "/inter",
      permissionTitle: "On Boarding",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Inter_card />
        </ProtectedRoute>
      ),
    },
    {
      path: "/createemployee",
      permissionTitle: "On Boarding",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <CreateEmployee />
        </ProtectedRoute>
      ),
    },
    {
      path: "/employeedetails/:id",
      permissionTitle: "On Boarding",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <EmployeeDetails />
        </ProtectedRoute>
      ),
    },
    {
      path: "/editemployeedetails",
      permissionTitle: "On Boarding",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <EditEmployeeDetails />
        </ProtectedRoute>
      ),
    },
    {
      path: "/note-details/:employeeId",
      permissionTitle: "On Boarding",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Notes_main />
        </ProtectedRoute>
      ),
    },
    {
      path: "/revision-details/:employeeId",
      permissionTitle: "On Boarding",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Revision />
        </ProtectedRoute>
      ),
    },
    {
      path: "/roles",
      permissionTitle: "On Boarding",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Roles />
        </ProtectedRoute>
      ),
    },
    {
      path: "/customer-dashboard",
      permissionTitle: "On Boarding",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <CustomerDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/departments",
      permissionTitle: "On Boarding",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Departments />
        </ProtectedRoute>
      ),
    },

    {
      path: "/Declaration-deatils",
      permissionTitle: "On Boarding",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Declaration_main />
        </ProtectedRoute>
      ),
    },

    {
      path: "/releiving-letter",
      permissionTitle: "On Boarding",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Releiving />
        </ProtectedRoute>
      ),
    },

    {
      path: "/letters-form",
      permissionTitle: "On Boarding",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Letters_main />
        </ProtectedRoute>
      ),
    },
    {
      path: "/reliving-list",
      permissionTitle: "On Boarding",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Reliving_list />
        </ProtectedRoute>
      ),
    },

    {
      path: "/relieved-list",
      permissionTitle: "On Boarding",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Relieved_main />
        </ProtectedRoute>
      ),
    },

    /* -------------------------------------------
     ADMIN MODULE: EMPLOYEE
  --------------------------------------------*/
    {
      path: "/attendance",
      permissionTitle: "Employee",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Attendance />
        </ProtectedRoute>
      ),
    },

    {
      path: "/attendance-tracker",
      permissionTitle: "Employee",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Attendance_tracker />
        </ProtectedRoute>
      ),
    },

    {
      path: "/attendance-add",
      permissionTitle: "Employee",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Attendance_add_main />
        </ProtectedRoute>
      ),
    },

    {
      path: "/monthlyattendancedetails",
      permissionTitle: "Employee",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <MonthlyAttendanceDetails />
        </ProtectedRoute>
      ),
    },

    {
      path: "/leave-type",
      permissionTitle: "Employee",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Leave_type />
        </ProtectedRoute>
      ),
    },

    {
      path: "/leaves",
      permissionTitle: "Employee",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Leaves />
        </ProtectedRoute>
      ),
    },

    {
      path: "/leave-report",
      permissionTitle: "Employee",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Leave_Report />
        </ProtectedRoute>
      ),
    },

    {
      path: "/leave-option",
      permissionTitle: "Employee",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Leave_option_main />
        </ProtectedRoute>
      ),
    },

    {
      path: "/wfh",
      permissionTitle: "Employee",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <WorkFromHome />
        </ProtectedRoute>
      ),
    },

    {
      path: "/requestdetails",
      permissionTitle: "Employee",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Request_mainbar />
        </ProtectedRoute>
      ),
    },

    /* -------------------------------------------
     PROJECTS
  --------------------------------------------*/
    {
      path: "/project-list",
      permissionTitle: "Projects",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <ProjectListPage />
        </ProtectedRoute>
      ),
    },

    {
      path: "/task-list",
      permissionTitle: "Projects",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <TaskListPage />
        </ProtectedRoute>
      ),
    },

    {
      path: "/task-details",
      permissionTitle: "Projects",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Task_home />
        </ProtectedRoute>
      ),
    },

    {
      path: "/close-details",
      permissionTitle: "Projects",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Close_home />
        </ProtectedRoute>
      ),
    },

    {
      path: "/tasklist-details/:taskId",
      permissionTitle: "Projects",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Tasklist_main />
        </ProtectedRoute>
      ),
    },

    {
      path: "/Reports",
      permissionTitle: "Projects",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Reports_mainbar />
        </ProtectedRoute>
      ),
    },

    {
      path: "/Reports",
      permissionTitle: "Projects",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Reports_mainbar />
        </ProtectedRoute>
      ),
    },

    /* -------------------------------------------
      CLIENTS
  --------------------------------------------*/
    {
      path: "/digital-details",
      permissionTitle: "Clients",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Digital_list_main />
        </ProtectedRoute>
      ),
    },
    {
      path: "/client-details",
      permissionTitle: "Clients",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Client_home />
        </ProtectedRoute>
      ),
    },

    {
      path: "/project-note-details/:_id",
      permissionTitle: "Clients",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Clients_note_main />
        </ProtectedRoute>
      ),
    },

    {
      path: "/invoice-details",
      permissionTitle: "Clients",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Invoice_home />
        </ProtectedRoute>
      ),
    },

    {
      path: "/invoice-full",
      permissionTitle: "Clients",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Invoice_full_main />
        </ProtectedRoute>
      ),
    },

    {
      path: "/invoice-edit",
      permissionTitle: "Clients",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Invoice_edit_main />
        </ProtectedRoute>
      ),
    },

    {
      path: "/invoice-pdf",
      permissionTitle: "Clients",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Invoice />
        </ProtectedRoute>
      ),
    },

    {
      path: "/invoice-export",
      permissionTitle: "Clients",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Export_invoice />
        </ProtectedRoute>
      ),
    },

    {
      path: "/invoice-performa",
      permissionTitle: "Clients",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Performa_invoice />
        </ProtectedRoute>
      ),
    },

    {
      path: "/invoice-sales",
      permissionTitle: "Clients",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Sales_invoice />
        </ProtectedRoute>
      ),
    },

    {
      path: "/play-slip",
      permissionTitle: "Clients",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <PayslipContent />
        </ProtectedRoute>
      ),
    },
    {
      path: "/play-slip-govt",
      permissionTitle: "Clients",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Payslip_govt />
        </ProtectedRoute>
      ),
    },

    /* -------------------------------------------
      FINANCE
  --------------------------------------------*/
    {
      path: "/finance/incomehistory",
      permissionTitle: "Finance",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Income_History />
        </ProtectedRoute>
      ),
    },

    {
      path: "/finance/expensehistory",
      permissionTitle: "Finance",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Expense_History />
        </ProtectedRoute>
      ),
    },

    {
      path: "/expense/details",
      permissionTitle: "Finance",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Expense_income_main />
        </ProtectedRoute>
      ),
    },

    {
      path: "/income/details",
      permissionTitle: "Finance",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Income_main />
        </ProtectedRoute>
      ),
    },

    {
      path: "/finance-account",
      permissionTitle: "Finance",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Finance_account_main />
        </ProtectedRoute>
      ),
    },
    {
      path: "/finance-lender",
      permissionTitle: "Lender",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Finance_lender_main />
        </ProtectedRoute>
      ),
    },

    {
      path: "/bankstatement",
      permissionTitle: "Finance",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <BankStatement_Mainbar />
        </ProtectedRoute>
      ),
    },

    {
      path: "/payment-type",
      permissionTitle: "Finance",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Payment_type_main />
        </ProtectedRoute>
      ),
    },

    {
      path: "/recurring",
      permissionTitle: "Finance",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Recurring_Mainbar />
        </ProtectedRoute>
      ),
    },

    /* -------------------------------------------
      COMPLAINENCE
  --------------------------------------------*/

    {
      path: "/complaince",
      permissionTitle: "Complaince",

      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Complaince_Mainbar />
        </ProtectedRoute>
      ),
    },

    /* -------------------------------------------
      LINKS MODULE
  --------------------------------------------*/
    {
      path: "/links",
      permissionTitle: "Links",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Link_mainbar />
        </ProtectedRoute>
      ),
    },

    {
      path: "/addlinks",
      permissionTitle: "Links",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <AddLink_mainbar />
        </ProtectedRoute>
      ),
    },

    {
      path: "/addcategory",
      permissionTitle: "Links",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Addcategory_mainbar />
        </ProtectedRoute>
      ),
    },

    /* -------------------------------------------
      PRIVILEGES
  --------------------------------------------*/
    {
      path: "/privileges",
      permissionTitle: "Privileges",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Admin_privileges_main />
        </ProtectedRoute>
      ),
    },

    /* -------------------------------------------
      ASSET MANAGEMENT
  --------------------------------------------*/
    {
      path: "/assetmanagement",
      permissionTitle: "Asset Management",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <AssetManagement_mainbar />
        </ProtectedRoute>
      ),
    },

    /* -------------------------------------------
      PAYROLL
  --------------------------------------------*/
    {
      path: "/payroll",
      permissionTitle: "Payroll",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Payroll />
        </ProtectedRoute>
      ),
    },
    /* -------------------------------------------
      Backup
  --------------------------------------------*/
    {
      path: "/backup",
      permissionTitle: "Backup",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Backup />
        </ProtectedRoute>
      ),
    },

    /* -------------------------------------------
      HOLIDAYS
  --------------------------------------------*/
    {
      path: "/holidays",
      permissionTitle: "Holidays",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Hoildays />
        </ProtectedRoute>
      ),
    },

    /* -------------------------------------------
      SOCIAL MEDIA
  --------------------------------------------*/
    {
      path: "/social-account",
      permissionTitle: "socialmedia",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Social_account_main />
        </ProtectedRoute>
      ),
    },

    {
      path: "/social-credentials",
      permissionTitle: "socialmedia",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Social_credentials_main />
        </ProtectedRoute>
      ),
    },

    {
      path: "/social-contentmaster",
      permissionTitle: "socialmedia",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Social_ContentMaster_Main />
        </ProtectedRoute>
      ),
    },

    /* -------------------------------------------
      Bidding
  --------------------------------------------*/
    {
      path: "/account-bidding",
      permissionTitle: "Bidding",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Account_bidding_main />
        </ProtectedRoute>
      ),
    },
    {
      path: "/tech-bidding",
      permissionTitle: "Bidding",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Tech_bidding_main />
        </ProtectedRoute>
      ),
    },
    {
      path: "/bidding-details",
      permissionTitle: "Bidding",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Bidding_main />
        </ProtectedRoute>
      ),
    },
    {
      path: "/connect-details",
      permissionTitle: "Bidding",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Connect_main />
        </ProtectedRoute>
      ),
    },

    {
      path: "/bidding-transaction_history",
      permissionTitle: "Bidding",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Bidding_transaction_main />
        </ProtectedRoute>
      ),
    },

    {
      path: "/billing_details",
      permissionTitle: "Bidding",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Billing_details_main />
        </ProtectedRoute>
      ),
    },
    {
      path: "/bidding-reports",
      permissionTitle: "Bidding",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Bidding_reports_main />
        </ProtectedRoute>
      ),
    },
    {
      path: "/bidding-all-details/:row",
      permissionTitle: "Bidding",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Bidding_all_main />
        </ProtectedRoute>
      ),
    },

    /* -------------------------------------------
      Portfolio-technology
  --------------------------------------------*/
    {
      path: "/technology",
      permissionTitle: "Portfolio-technology",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Technology_Main />
        </ProtectedRoute>
      ),
    },
    {
      path: "/portfolio",
      permissionTitle: "Portfolio-technology",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Portfolio_Main />
        </ProtectedRoute>
      ),
    },

    /* -------------------------------------------
      Recruitment
  --------------------------------------------*/
    {
      path: "/dashboard-Recruitment",
      permissionTitle: "Recruitment",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <DashBoard_Main />
        </ProtectedRoute>
      ),
    },
    {
      path: "/jobtype-Recruitment",
      permissionTitle: "Recruitment",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <JobType_main />
        </ProtectedRoute>
      ),
    },
    {
      path: "/jobopening-Recruitment",
      permissionTitle: "Recruitment",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <JobOpening_Main />
        </ProtectedRoute>
      ),
    },
    {
      path: "/interview-Recruitment",
      permissionTitle: "Recruitment",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <InterViewStatus_Main />
        </ProtectedRoute>
      ),
    },
    {
      path: "/technologies-Recruitment",
      permissionTitle: "Recruitment",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Source_Main />
        </ProtectedRoute>
      ),
    },
    {
      path: "/source-Recruitment",
      permissionTitle: "Recruitment",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Platform_Details />
        </ProtectedRoute>
      ),
    },
    {
      path: "/Candidate-Recruitment",
      permissionTitle: "Recruitment",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Candidate_Main />
        </ProtectedRoute>
      ),
    },

    {
      path: "/leads",
      permissionTitle: "leads",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <LeadManagement_Mainbar />
        </ProtectedRoute>
      ),
    },

    /* -------------------------------------------
      GENERAL ROUTES (NO PERMISSION)
  --------------------------------------------*/
    {
      path: "/mom-details",
      element: (
        <ProtectedRoute
          isLoggedIn={isLoggedIn}
          requiredRole={["client", "subuser", "admin"]}
        >
          <Mom />
        </ProtectedRoute>
      ),
    },

    {
      path: "/invoice_clients",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole={["client"]}>
          <Client_invoice_main />
        </ProtectedRoute>
      ),
    },
    {
      path: "/asset-document",
      element: (
        <ProtectedRoute
          isLoggedIn={isLoggedIn}
          requiredRole={["client", "subuser", "admin"]}
        >
          <AssentDocumentPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/document-details",
      element: (
        <ProtectedRoute
          isLoggedIn={isLoggedIn}
          requiredRole={["client", "subuser", "admin"]}
        >
          <Document_main />
        </ProtectedRoute>
      ),
    },

    {
      path: "/settings",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Setting_main />
        </ProtectedRoute>
      ),
    },

    {
      path: "/settings-invoice",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn} requiredRole="admin">
          <Setting_invoice_main />
        </ProtectedRoute>
      ),
    },

    // {
    //   path: "/message",
    //   element: <Messages />,
    // },

    {
      path: "/assetcategory",
      element: <AssetCategory_mainbar />,
    },

    {
      path: "/slack",
      element: <Slack_mainbar />,
    },

    {
      path: "/assetsubcategory",
      element: <AssetSubCategory_mainbar />,
    },
    {
      path: "/announcement",
      element: <Announcement />,
    },

    {
      path: "/sitemap.html",
      element: (
        <ProtectedRoute isLoggedIn={isLoggedIn}>
          <Sitemap />
        </ProtectedRoute>
      ),
    },

    /* -------------------------------------------
      404 Not Found
  --------------------------------------------*/
    {
      path: "*",
      element: <PageNotFound />,
    },
  ];

  return (
    <>
      <BrowserRouter>
        <SettingsContext.Provider
          value={{ dynamicDateFormat, setDynamicDateFormat }}
        >
          <SessionChecker />
          <Routes>
            {routesConfig.map((r, i) => (
              <Route key={i} path={r.path} element={r.element} />
            ))}
          </Routes>
        </SettingsContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
