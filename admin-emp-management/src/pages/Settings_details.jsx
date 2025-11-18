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
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Loader from "../components/Loader";
// import { toast } from "react-toastify";

const Settings_details = () => {
  const navigate = useNavigate();

  useEffect(() => {
    fetchProject();
  }, []);

  const [gst, setGst] = useState("");
  const [payrollBasic, setPayrollBasic] = useState("");
  const [payrollHra, setPayrollHra] = useState("");
  const [payrollMedicalAllowance, setPayrollMedicalAllowance] = useState("");
  const [payrollConveyanceAllowance, setPayrollConveyanceAllowance] =
    useState("");
  const [payrollEf, setPayrollEf] = useState("");
  const [payrollEeesi, setPayrollEeesi] = useState("");
  const [payrollEresi, setPayrollEresi] = useState("");
  const [payrollErf, setPayrollErf] = useState("");
  const [toggle, setToggle] = useState(false); // false = No, true = Yes
  const [unhappy_leave_option, setUnhappyLeaveOption] = useState(""); // default = No
  // console.log("unhappy_leave_option", unhappy_leave_option);
  // password

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // leave type
  const [loading, setLoading] = useState(true); 
  const [casualLeave, setCasualLeave] = useState("");
  const [wfh, setWfh] = useState("");
  const [compensatoryLeave, setCompensatoryLeave] = useState("");
  const [unhappyLeave, setUnhappyLeave] = useState("");
  const [permission, setPermission] = useState("");

  const fetchProject = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/setting/view-setting`);
      console.log("response", response);
      if (response.data.success) {
        setGst(response.data.data[0]?.gst_percent);
        setPayrollBasic(response.data.data[0]?.payroll_basic_percent);
        setPayrollHra(response.data.data[0]?.payroll_hra_percent);
        setPayrollMedicalAllowance(
          response.data.data[0]?.payroll_medicalAllowance
        );
        setPayrollConveyanceAllowance(
          response.data.data[0]?.payroll_conveyanceAllowance
        );
        setPayrollEeesi(response.data.data[0]?.payroll_eeesi_percent);
        setPayrollEresi(response.data.data[0]?.payroll_eresi_percent);
        setPayrollEf(response.data.data[0]?.payroll_eepf_percent);
        setPayrollErf(response.data.data[0]?.payroll_erpf_percent);
        setCasualLeave(response.data.data[0]?.casual_leave);
        setCompensatoryLeave(response.data.data[0]?.complementary_leave);
        setUnhappyLeave(response.data.data[0]?.unhappy_leave);
        setPermission(response.data.data[0]?.permission);
        setUnhappyLeaveOption(response.data.data[0]?.unhappy_leave_option);
        setWfh(response.data.data[0]?.wfh_leave);
        setLoading(false);
      } else {
        setErrors("Failed to fetch roles.");
      }
    } catch (err) {
      setErrors("Failed to fetch roles.");
      setLoading(false);
    }
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        gst_percent: gst,
        payroll_basic_percent: payrollBasic,
        payroll_hra_percent: payrollHra,
        payroll_medicalAllowance: payrollMedicalAllowance,
        payroll_conveyanceAllowance: payrollConveyanceAllowance,
        payroll_eepf_percent: payrollEf,
        payroll_erpf_percent: payrollErf,
        password: password,
        unhappy_leave: unhappyLeave,
        casual_leave: casualLeave,
        complementary_leave: compensatoryLeave,
        wfh_leave: wfh,
        permission: permission,
        unhappy_leave_option: unhappy_leave_option,
        payroll_eeesi_percent: payrollEeesi,
        payroll_eresi_percent: payrollEresi,
      };

      const response = await axios.post(
        `${API_URL}/api/setting/create-setting`,
        formData
      );
      console.log("response:", response);
      toast.success("Settings updated successfully!");

      //   fetchProject();
      setPassword("");
      setErrors({});
    } catch (err) {
      setErrors(err.response.data.errors);
      // if (err.response?.data?.errors) {
      //   setErrors(err.response.data.errors);
      // } else {
      //   console.error("Error submitting form:", err);
      // }
    }
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
            className="text-sm text-gray-500"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </p>
          <p>{">"}</p>

          <p className="text-sm text-blue-500">Settings</p>
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold mt-4">Settings</h1>

        <div className="py-4">
          <div className="bg-white rounded-2xl shadow-md p-6 w-full ">
            <div className="flex flex-col gap-4">
              {/* GST field */}
              <div className="flex flex-col gap-2 w-full md:w-[40%]">
                <label
                  htmlFor="gst"
                  className="block text-sm font-medium text-gray-700"
                >
                  GST(%)
                </label>
                <input
                  id="gst"
                  type="number"
                  value={gst}
                  onChange={(e) => setGst(e.target.value)}
                  placeholder="Enter GST amount"
                  className="border w-[50%] border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-2 text-sm outline-none transition"
                />
              </div>
              <hr class="border-t-2 border-gray w-full"></hr>

              {/* Payroll  field */}
              <div className="mt-4 ">
                <h2 className="text-lg md:text-2xl font-medium">
                  Payroll Components Configuration
                </h2>
                <p className="text-sm text-gray-600 mt-2 mb-6">
                  Configure the essential payroll components including basic
                  salary, allowances, and contributions to ensure accurate
                  salary processing.
                </p>
                <div className="flex flex-wrap gap-y-5 gap-x-14 ">
                  <div className="flex flex-col gap-2 w-full md:w-[40%]">
                    <label
                      htmlFor="basic"
                      className="block text-sm font-medium text-gray-700"
                    >
                      BASIC SALARY PERCENTAGE (%)
                    </label>
                    <input
                      id="basic"
                      type="number"
                      value={payrollBasic}
                      onChange={(e) => setPayrollBasic(e.target.value)}
                      placeholder="Enter the percentage for Basic Salary"
                      className="border w-[50%] border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-2 text-sm outline-none transition"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full md:w-[40%]">
                    <label
                      htmlFor="HRA"
                      className="block text-sm font-medium text-gray-700"
                    >
                      HOUSE RENT ALLOWANCE (HRA) PERCENTAGE (%)
                    </label>
                    <input
                      id="HRA"
                      type="number"
                      value={payrollHra}
                      onChange={(e) => setPayrollHra(e.target.value)}
                      placeholder="Enter the percentage for House Rent Allowance"
                      className="border w-[50%] border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-2 text-sm outline-none transition"
                    />
                  </div>

                  <div className="flex flex-col gap-2 w-full md:w-[40%]">
                    <label
                      htmlFor="medicalAllowance"
                      className="block text-sm font-medium text-gray-700"
                    >
                      MEDICAL ALLOWANCE AMOUNT (MONTHLY)
                    </label>
                    <input
                      id="medicalAllowance"
                      type="number"
                      value={payrollMedicalAllowance}
                      onChange={(e) =>
                        setPayrollMedicalAllowance(e.target.value)
                      }
                      placeholder="Enter the monthly Medical Allowance amount"
                      className="border w-[50%] border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-2 text-sm outline-none transition"
                    />
                  </div>

                  <div className="flex flex-col gap-2 w-full md:w-[40%]">
                    <label
                      htmlFor="conveyanceAllowance"
                      className="block text-sm font-medium text-gray-700"
                    >
                      CONVEYANCE ALLOWANCE AMOUNT (MONTHLY)
                    </label>
                    <input
                      id="conveyanceAllowance"
                      type="number"
                      value={payrollConveyanceAllowance}
                      onChange={(e) =>
                        setPayrollConveyanceAllowance(e.target.value)
                      }
                      placeholder="Enter the monthly Conveyance Allowance amount"
                      className="border w-[50%] border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-2 text-sm outline-none transition"
                    />
                  </div>

                  <div className="flex flex-col gap-2 w-full md:w-[40%]">
                    <label
                      htmlFor="ef"
                      className="block text-sm font-medium text-gray-700"
                    >
                      EMPLOYEE PROVIDENT FUND (PF) CONTRIBUTION PERCENTAGE (%)
                    </label>
                    <input
                      id="ef"
                      type="number"
                      value={payrollEf}
                      onChange={(e) => setPayrollEf(e.target.value)}
                      placeholder="Enter the Employee PF contribution percentage"
                      className="border w-[50%] border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-2 text-sm outline-none transition"
                    />
                  </div>

                  <div className="flex flex-col gap-2 w-full md:w-[40%]">
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
                  </div>
                </div>
              </div>
              <hr class="border-t-2 border-gray w-full"></hr>

              {/* password */}

              <div className="mt-4">
                <h2 className="text-lg md:text-2xl font-medium">SOCIAL MEDIA PASSWORD</h2>

                <div className="flex flex-col gap-2 w-full md:w-[40%] relative mt-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    PASSWORD
                  </label>
                  <div className="relative w-[50%]">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter Password"
                      autoComplete="new-password"
                      className="border w-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-2 pr-10 text-sm outline-none transition"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible className="h-5 w-5" />
                      ) : (
                        <AiOutlineEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* leave policy */}

              <hr class="border-t-2 border-gray w-full"></hr>

              {/* Payroll  field */}
              <div className="mt-4 ">
                <h2 className="text-lg md:text-2xl font-medium">LEAVE POLICY</h2>

                <div className="flex flex-wrap gap-y-5 gap-x-14 mt-5 ">
                  <div className="flex flex-col gap-2 w-full md:w-[40%]">
                    <label
                      htmlFor="Casual"
                      className="block text-sm font-medium text-gray-700"
                    >
                      CASUAL LEAVE COUNT
                    </label>
                    <input
                      id="Casual"
                      type="number"
                      value={casualLeave}
                      onChange={(e) => setCasualLeave(e.target.value)}
                      placeholder="Enter the Count"
                      className="border w-[50%] border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-2 text-sm outline-none transition"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full md:w-[40%]">
                    <label
                      htmlFor="Compensatory"
                      className="block text-sm font-medium text-gray-700"
                    >
                      COMPENSATORY LEAVE COUNT
                    </label>
                    <input
                      id="Compensatory"
                      type="number"
                      value={compensatoryLeave}
                      onChange={(e) => setCompensatoryLeave(e.target.value)}
                      placeholder="Enter the Count"
                      className="border w-[50%] border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-2 text-sm outline-none transition"
                    />
                  </div>

                  {/* <form onSubmit={handlesubmit}> */}
                    <div className="flex flex-col gap-2 w-full md:w-[40%]">
                      <label
                        htmlFor="Unhappy"
                        className="block text-sm font-medium text-gray-700"
                      >
                        UNHAPPY LEAVE COUNT
                      </label>

                      {/* Toggle Switch */}
                      <div
                        onClick={() =>
                          setUnhappyLeaveOption(
                            unhappy_leave_option === "Yes" ? "No" : "Yes"
                          )
                        }
                        value={unhappy_leave_option}
                        className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition ${
                          unhappy_leave_option === "Yes"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`bg-white w-6 h-6 rounded-full shadow-md transform transition ${
                            unhappy_leave_option === "Yes"
                              ? "translate-x-6"
                              : ""
                          }`}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {unhappy_leave_option}
                      </span>

                      {/* Input field (enabled only if Yes) */}
                      <input
                        id="Unhappy"
                        type="number"
                        value={
                          unhappy_leave_option === "Yes" ? unhappyLeave : ""
                        }
                        onChange={(e) => setUnhappyLeave(e.target.value)}
                        placeholder="Enter the Count"
                      className="border w-[50%] border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-2 text-sm outline-none transition"
                        disabled={unhappy_leave_option === "No"} // disable when No
                      />
                    </div>
                  {/* </form> */}
                  <div className="flex flex-col gap-2 w-full md:w-[40%]">
                    <label
                      htmlFor="WFH"
                      className="block text-sm font-medium text-gray-700"
                    >
                      WFH COUNT
                    </label>
                    <input
                      id="WFH"
                      type="number"
                      value={wfh}
                      onChange={(e) => setWfh(e.target.value)}
                      placeholder="Enter the Count"
                      className="border w-[50%] border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-2 text-sm outline-none transition"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full md:w-[40%]">
                    <label
                      htmlFor="WFH"
                      className="block text-sm font-medium text-gray-700"
                    >
                      PERMISSION COUNT
                    </label>
                    <input
                      id="WFH"
                      type="number"
                      value={permission}
                      onChange={(e) => setPermission(e.target.value)}
                      placeholder="Enter the Count"
                      className="border w-[50%] border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-2 text-sm outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Save button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow transition duration-200"
                  onClick={handlesubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
      )}
      <Footer />
    </div>
  );
};
export default Settings_details;
