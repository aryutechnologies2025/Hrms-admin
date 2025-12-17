import { useState, useEffect, useContext } from "react";

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
import { SettingsContext } from "../App";
// import { toast } from "react-toastify";

const Settings_invoice_details = () => {
  const { setDynamicDateFormat } = useContext(SettingsContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSettings();
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
  const [dateFormat, setDateFormat] = useState("");

  const [wfh, setWfh] = useState("");
  const [compensatoryLeave, setCompensatoryLeave] = useState("");
  const [unhappyLeave, setUnhappyLeave] = useState("");
  const [permission, setPermission] = useState("");




  // Invoice (Left side)
  // Invoice (Left)
  const [invoiceAddress, setInvoiceAddress] = useState("");
  const [invoiceState, setInvoiceState] = useState("");
  const [invoiceCity, setInvoiceCity] = useState("");
  const [invoiceGstin, setInvoiceGstin] = useState("");
  const [invoiceEmail, setInvoiceEmail] = useState("");
  const [invoicePhone, setInvoicePhone] = useState("");

  // Company Bank Details (Right)
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [branchName, setBranchName] = useState("");
  const [invoiceTerms, setInvoiceTerms] = useState("");

  const [igst, setIgst] = useState("");
const [sgst, setSgst] = useState("");
const [cgst, setCgst] = useState("");





 const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/setting/view-setting`,
        {withCredentials: true}
      );
      console.log("response", response);
      // const response = await axios.get(`${API_URL}/api/setting/view-invoice-setting`);
      // console.log("response", response);
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
        setDateFormat(response.data.data[0]?.date_format);
        
        setCompensatoryLeave(response.data.data[0]?.complementary_leave);
        setUnhappyLeave(response.data.data[0]?.unhappy_leave);
        setPermission(response.data.data[0]?.permission);
        setUnhappyLeaveOption(response.data.data[0]?.unhappy_leave_option);
        setWfh(response.data.data[0]?.wfh_leave);

      // dynamic update date format in context
   
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
        date_format: dateFormat,
      };

      const response = await axios.post(
        `${API_URL}/api/setting/create-setting`,
        formData, {withCredentials: true}
        `${API_URL}/api/setting/create-invoice-setting`,
        formData
      );
      // console.log("response:", response);
      toast.success("Settings updated successfully!");

      
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

            <div className="cursor-pointer">
              <Mobile_Sidebar />

            </div>
            <div className="flex justify-end mt-2 md:mt-0 gap-1 items-center ">
              <p
                className="text-sm text-gray-500"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </p>
              <p>{">"}</p>

              <p className="text-sm text-blue-500"> Invoice Settings</p>
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold mt-2 md:mt-4">
              Invoice Settings
            </h1>

            <div className="py-2 md:py-4">
              <div className="bg-white rounded-2xl shadow-md p-3 md:p-6 w-full ">
                <div className="flex flex-col gap-4">


                  {/* Payroll  field */}
                  <div className="mt-4">
                    {/* <h2 className="text-lg md:text-2xl font-medium">
    Invoice & Company Bank Configuration
  </h2>
  <p className="text-sm text-gray-600 mt-2 mb-6">
    Configure invoice address details and company bank information for billing.
  </p> */}

                    {/* TWO COLUMN WRAPPER */}
                    <div className="flex flex-wrap md:flex-nowrap gap-14">

                      {/* LEFT SIDE – INVOICE */}
                      <div className="w-full md:w-1/2">
                        <h3 className="text-md font-semibold mb-4">Invoice</h3>

                        <div className="flex flex-wrap gap-y-5 gap-x-14">
                          <div className="flex flex-col gap-2 w-full">
                            <label className="block text-sm font-medium text-gray-700">
                              ADDRESS
                            </label>
                            <input
                              type="text"
                              value={invoiceAddress}
                              onChange={(e) => setInvoiceAddress(e.target.value)}
                              placeholder="Enter address"
                              className="border w-[50%] border-gray-300 rounded-lg p-2 text-sm"
                            />
                          </div>

                          <div className="flex flex-col gap-2 w-full">
                            <label className="block text-sm font-medium text-gray-700">
                              STATE
                            </label>
                            <input
                              type="text"
                              value={invoiceState}
                              onChange={(e) => setInvoiceState(e.target.value)}
                              placeholder="Enter state"
                              className="border w-[50%] border-gray-300 rounded-lg p-2 text-sm"
                            />
                          </div>

                          <div className="flex flex-col gap-2 w-full">
                            <label className="block text-sm font-medium text-gray-700">
                              CITY
                            </label>
                            <input
                              type="text"
                              value={invoiceCity}
                              onChange={(e) => setInvoiceCity(e.target.value)}
                              placeholder="Enter city"
                              className="border w-[50%] border-gray-300 rounded-lg p-2 text-sm"
                            />
                          </div>

                          <div className="flex flex-col gap-2 w-full">
                            <label className="block text-sm font-medium text-gray-700">
                              GSTIN
                            </label>
                            <input
                              type="text"
                              value={invoiceGstin}
                              onChange={(e) => setInvoiceGstin(e.target.value)}
                              placeholder="Enter GSTIN"
                              className="border w-[50%] border-gray-300 rounded-lg p-2 text-sm"
                            />
                          </div>

                          <div className="flex flex-col gap-2 w-full">
                            <label className="block text-sm font-medium text-gray-700">
                              EMAIL
                            </label>
                            <input
                              type="email"
                              value={invoiceEmail}
                              onChange={(e) => setInvoiceEmail(e.target.value)}
                              placeholder="Enter email"
                              className="border w-[50%] border-gray-300 rounded-lg p-2 text-sm"
                            />
                          </div>

                          <div className="flex flex-col gap-2 w-full">
                            <label className="block text-sm font-medium text-gray-700">
                              PHONE
                            </label>
                            <input
                              type="number"
                              value={invoicePhone}
                              onChange={(e) => setInvoicePhone(e.target.value)}
                              placeholder="Enter phone number"
                              className="border w-[50%] border-gray-300 rounded-lg p-2 text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* RIGHT SIDE – BANK DETAILS */}
                      <div className="w-full md:w-1/2">
                        <h3 className="text-md font-semibold mb-4">
                          Company Bank Details
                        </h3>

                        <div className="flex flex-wrap gap-y-5 gap-x-14">
                          <div className="flex flex-col gap-2 w-full">
                            <label className="block text-sm font-medium text-gray-700">
                              ACCOUNT NAME
                            </label>
                            <input
                              type="text"
                              value={accountName}
                              onChange={(e) => setAccountName(e.target.value)}
                              placeholder="Enter account name"
                              className="border w-[50%] border-gray-300 rounded-lg p-2 text-sm"
                            />
                          </div>

                          <div className="flex flex-col gap-2 w-full">
                            <label className="block text-sm font-medium text-gray-700">
                              BANK NAME
                            </label>
                            <input
                              type="text"
                              value={bankName}
                              onChange={(e) => setBankName(e.target.value)}
                              placeholder="Enter bank name"
                              className="border w-[50%] border-gray-300 rounded-lg p-2 text-sm"
                            />
                          </div>

                          <div className="flex flex-col gap-2 w-full">
                            <label className="block text-sm font-medium text-gray-700">
                              ACCOUNT NUMBER
                            </label>
                            <input
                              type="text"
                              value={accountNumber}
                              onChange={(e) => setAccountNumber(e.target.value)}
                              placeholder="Enter account number"
                              className="border w-[50%] border-gray-300 rounded-lg p-2 text-sm"
                            />
                          </div>

                          <div className="flex flex-col gap-2 w-full">
                            <label className="block text-sm font-medium text-gray-700">
                              IFSC CODE
                            </label>
                            <input
                              type="text"
                              value={ifscCode}
                              onChange={(e) => setIfscCode(e.target.value)}
                              placeholder="Enter IFSC code"
                              className="border w-[50%] border-gray-300 rounded-lg p-2 text-sm"
                            />
                          </div>

                          <div className="flex flex-col gap-2 w-full">
                            <label className="block text-sm font-medium text-gray-700">
                              BRANCH
                            </label>
                            <input
                              type="text"
                              value={branchName}
                              onChange={(e) => setBranchName(e.target.value)}
                              placeholder="Enter branch name"
                              className="border w-[50%] border-gray-300 rounded-lg p-2 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                  <hr class="border-t-2 border-gray w-full"></hr>

                  <div className="flex flex-wrap gap-y-5 gap-x-14">
                    <div className="flex flex-col gap-2 w-full">
                      <label className="block text-sm font-medium text-gray-700">
                        Terms & Conditions
                      </label>

                      <textarea
                        value={invoiceTerms}
                        onChange={(e) => setInvoiceTerms(e.target.value)}
                        placeholder="Enter terms & conditions"
                        rows={4}
                        className="border w-[50%] border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-2 text-sm outline-none transition resize-none"
                      />
                    </div>
                  </div>

                  <hr class="border-t-2 border-gray w-full"></hr>


                  <div className="flex flex-col gap-2 w-[50%]">
                    <label className="block text-sm font-medium text-gray-700">IGST (%)</label>
                    <input
                      type="text"
                      value={igst}
                      onChange={(e) => setIgst(e.target.value)}
                      placeholder="Enter IGST"
                      className="border w-[50%] border-gray-300 rounded-lg p-2 text-sm"
                    />
                  </div>

                  {/* SGST */}
                  <div className="flex flex-col gap-2 w-[50%]">
                    <label className="block text-sm font-medium text-gray-700">SGST (%)</label>
                    <input
                      type="text"
                      value={sgst}
                      onChange={(e) => setSgst(e.target.value)}
                      placeholder="Enter SGST"
                      className="border w-[50%] border-gray-300 rounded-lg p-2 text-sm"
                    />
                  </div>

                  {/* CGST */}
                  <div className="flex flex-col gap-2 w-[50%]">
                    <label className="block text-sm font-medium text-gray-700">CGST (%)</label>
                    <input
                      type="text"
                      value={cgst}
                      onChange={(e) => setCgst(e.target.value)}
                      placeholder="Enter CGST"
                      className="border w-[50%] border-gray-300 rounded-lg p-2 text-sm"
                    />
                  </div>



                  {/* password */}

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
export default Settings_invoice_details;
