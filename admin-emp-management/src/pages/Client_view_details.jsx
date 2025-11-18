import { useState, useEffect } from "react";

import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
DataTable.use(DT);

import axios from "../api/axiosConfig";
import { API_URL } from "../config";
import Swal from "sweetalert2";
import Footer from "../components/Footer";
import Mobile_Sidebar from "../components/Mobile_Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import { toast } from "react-toastify";

const Client_view_details = () =>{

  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.id || "";
  console.log("idempok", id);

  useEffect(() => {
    fetchProject();
  }, []);

  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const fetchProject = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/client/view-clientdetails-id/${id}`);
      console.log("response", response);
      if (response.data.success) {
        setName(response.data.data?.client_name || "");
        setCompanyName(response.data.data?.company_name || "");
        setEmail(response.data.data?.email || "");
        setPhone(response.data.data?.phone_number || "");
        setWebsite(response.data.data?.website || "");
        // Set other fields as needed
        
      } else {
        setErrors("Failed to fetch roles.");
      }
    } catch (err) {
      setErrors("Failed to fetch roles.");
    }
  };

//   const handlesubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = {
//         gst_percent: gst,
//         payroll_basic_percent: payrollBasic,
//         payroll_hra_percent: payrollHra,
//         payroll_medicalAllowance: payrollMedicalAllowance,
//         payroll_conveyanceAllowance: payrollConveyanceAllowance,
//         payroll_eepf_percent: payrollEf,
//         payroll_erpf_percent: payrollErf,
//         password: password,
//         unhappy_leave: unhappyLeave,
//         casual_leave: casualLeave,
//         complementary_leave: compensatoryLeave,
//         wfh_leave: wfh,
//         permission: permission,
//         unhappy_leave_option: unhappy_leave_option,
//         payroll_eeesi_percent: payrollEeesi,
//         payroll_eresi_percent: payrollEresi,
//       };

//       const response = await axios.post(
//         `${API_URL}/api/setting/create-setting`,
//         formData
//       );
//       console.log("response:", response);
//       toast.success("Settings updated successfully!");

//       //   fetchProject();
//       setPassword("");
//       setErrors({});
//     } catch (err) {
//       setErrors(err.response.data.errors);
//       // if (err.response?.data?.errors) {
//       //   setErrors(err.response.data.errors);
//       // } else {
//       //   console.error("Error submitting form:", err);
//       // }
//     }
//   };

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-2 md:pt-10">
      <div>
        <Mobile_Sidebar />
        <div className="flex gap-2 items-center cursor-pointer">
          <p
            className="text-sm text-gray-500"
            onClick={() => navigate("/client-dashboard")}
          >
            Dashboard
          </p>
          <p>{">"}</p>

          <p className="text-sm text-blue-500">Client view</p>
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold mt-4">Client View</h1>

        <div className="py-4">
          <div className="bg-white rounded-2xl shadow-md p-6 w-full ">
            <div className="flex flex-col gap-4">
             
              {/* Payroll  field */}
              <div className="mt-2 ">
                <h2 className="text-2xl font-medium mb-5">
                  Client Details
                </h2>
                
                <div className="flex flex-wrap gap-y-5 gap-x-14 ">
                  <div className="flex flex-col gap-2 w-full md:w-[40%]">
                    <label
                      htmlFor="basic"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Client Name
                    </label>
                    <input
                      id="basic"
                      type="text"
                      value={name}
                    //   onChange={(e) => setPayrollBasic(e.target.value)}
                      placeholder="Client Name"
                      disabled
                      className="border w-[50%] border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-2 text-sm outline-none transition"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full md:w-[40%]">
                    <label
                      htmlFor="HRA"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Company Name
                    </label>
                    <input
                      id="HRA"
                      type="text"
                      value={companyName}
                    //   onChange={(e) => setPayrollHra(e.target.value)}
                      placeholder="Company Name"
                      disabled
                      className="border w-[50%] border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-2 text-sm outline-none transition"
                    />
                  </div>

                  <div className="flex flex-col gap-2 w-full md:w-[40%]">
                    <label
                      htmlFor="medicalAllowance"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <input
                      id="medicalAllowance"
                      type="text"
                      value={email}
                    //   onChange={(e) =>
                    //     setPayrollMedicalAllowance(e.target.value)
                    //   }
                      placeholder="Email Address"
                      disabled
                      className="border w-[50%] border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-2 text-sm outline-none transition"
                    />
                  </div>

                  <div className="flex flex-col gap-2 w-full md:w-[40%]">
                    <label
                      htmlFor="conveyanceAllowance"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <input
                      id="conveyanceAllowance"
                      type="number"
                      value={phone}
                    //   onChange={(e) =>
                    //     setPayrollConveyanceAllowance(e.target.value)
                    //   }
                      placeholder="Phone Number"
                      disabled
                      className="border w-[50%] border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-2 text-sm outline-none transition"
                    />
                  </div>

                  {/* <div className="flex flex-col gap-2 w-full md:w-[80%]">
                    <label
                      htmlFor="ef"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Company Website URL
                    </label>
                    <input
                      id="ef"
                      type="url"
                      value={website}
                    //   onChange={(e) => setPayrollEf(e.target.value)}
                      placeholder="Website URL"
                      className="border w-[50%] border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-2 text-sm outline-none transition"
                    />
                  </div> */}

                  {/* <div className="flex flex-col gap-2 w-full md:w-[40%]">
                    <label
                      htmlFor="erf"
                      className="block text-sm font-medium text-gray-700"
                    >
                      EMPLOYEE PROVIDENT FUND (PF) CONTRIBUTION PERCENTAGE (%)
                    </label>
                    <input
                      id="erf"
                      type="number"
                      value={payrollErf}
                      onChange={(e) => setPayrollErf(e.target.value)}
                      placeholder="Enter the Employer PF contribution percentage"
                      className="border w-[50%] border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-2 text-sm outline-none transition"
                    />
                  </div>



                   <div className="flex flex-col gap-2 w-full md:w-[40%]">
                    <label
                      htmlFor="eeesi"
                      className="block text-sm font-medium text-gray-700"
                    >
                      EMPLOYEE EEESI
                    </label>
                    <input
                      id="eeesi"
                      type="number"
                      value={payrollEeesi}
                      onChange={(e) => setPayrollEeesi(e.target.value)}
                      placeholder="Enter the Employee PF contribution percentage"
                      className="border w-[50%] border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-2 text-sm outline-none transition"
                    />
                  </div>

                  <div className="flex flex-col gap-2 w-full md:w-[40%]">
                    <label
                      htmlFor="eresi"
                      className="block text-sm font-medium text-gray-700"
                    >
                      EMPLOYEE ERESI
                    </label>
                    <input
                      id="eresi"
                      type="number"
                      value={payrollEresi}
                      onChange={(e) => setPayrollEresi(e.target.value)}
                      placeholder="Enter the Employer PF contribution percentage"
                      className="border w-[50%] border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-2 text-sm outline-none transition"
                    />
                  </div> */}
                </div>
              </div>

              


             
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
export default Client_view_details;
