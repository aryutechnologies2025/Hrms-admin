import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Mobile_Sidebar from "../Mobile_Sidebar";
import Footer from "../Footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from "react-icons/io";
import CompanyPaymentAccount from "./CompanyPaymentAccount";
import YuvarajPaymentAccount from "./YuvarajPaymentAccount";
import ArunaPaymentAccount from "./ArunaPaymentAccount";

function Recurring_Details() {
  const [activeTab, setActiveTab] = useState("company");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  let navigate = useNavigate();
  const openAddModal = () => {
    setIsAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };
  const closeAddModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAddModalOpen(false), 250);
  };

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen px-3 md:px-5 pt-2 md:pt-10">
      <div>
        <div className="cursor-pointer">
          <Mobile_Sidebar />
        </div>
        <div className="flex justify-end mt-2 md:mt-0 gap-1 items-center">
          <p
            className="text-sm text-gray-500 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Dashboard
          </p>
          <p>{">"}</p>
          <p className="text-sm text-blue-500">Company Payment</p>
          <p>{">"}</p>
        </div>
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              Company Payment
            </h1>
            
          </div>
          <div>
            <button
              onClick={openAddModal}
              className=" px-3 py-2 md:mt-2 text-white bg-blue-500 hover:bg-blue-600 font-medium w-20 rounded-2xl"
            >
              Add
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b mb-6">
          <button
            onClick={() => setActiveTab("company")}
            className={`pb-2 text-sm font-medium border-b-2 ${activeTab === "company"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            Company
          </button>

          <button
            onClick={() => setActiveTab("Yuvaraj")}
            className={`pb-2 text-sm font-medium border-b-2 ${activeTab === "Yuvaraj"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            Yuvaraj
          </button>
          <button
            onClick={() => setActiveTab("Aruna")}
            className={`pb-2 text-sm font-medium border-b-2 ${activeTab === "Aruna"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            Aruna
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "company" && <CompanyPaymentAccount />}
        {activeTab === "Yuvaraj" && <YuvarajPaymentAccount />}
        {activeTab === "Aruna" && <ArunaPaymentAccount />}


        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
            {/* Overlay */}
            <div className="absolute inset-0 " onClick={closeAddModal}></div>

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

              <div className="p-5">
                <p className="text-2xl md:text-3xl font-medium">Add Payment</p>
                <div className="mt-5 flex justify-between items-center">
                  <label className="block text-md font-medium mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <div className="w-[70%] md:w-[50%]">
                    <input
                      type="text"
                      // value={name}
                      // onChange={(e) => setName(e.target.value)}
                      placeholder="Enter Your Name "
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {/* {errors.name && (
                              <p className="text-red-500 text-sm mb-4">{errors.name}</p>
                            )} */}
                  </div>
                </div>


                <div className="mt-5 flex justify-between items-center">
                  <label className="block text-md font-medium mb-2">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="w-[70%] md:w-[50%]">
                    <input
                      type="text"
                      // value={name}
                      // onChange={(e) => setName(e.target.value)}
                      placeholder="Enter Amount "
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {/* {errors.name && (
                              <p className="text-red-500 text-sm mb-4">{errors.name}</p>
                            )} */}
                  </div>
                </div>

                {/* Date of Joining */}
                  <div className="mt-5 flex justify-between items-center">
                    <label
                      className="block text-md font-medium mb-2"
                      htmlFor="Date"
                    >
                      Date{" "}
                      <span className="text-red-500">*</span>
                    </label>

                  <div className=" w-[70%] md:w-[50%] relative">
                    <DatePicker
                      id="DATE OF JOINING"
                      placeholderText="Select Date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    // onKeyUp={handleKeyUp}
                    // selected={employeeDateOfJoin}
                    // onChange={handleDateChange}
                    />
                  </div>
                </div>


                {/* {error.rolename && <p className="error">{error.rolename}</p>} */}

                <div className="mt-5 flex justify-between items-center">
                  <div className="">
                    <label
                      htmlFor="status"
                      className="block text-md font-medium mb-2 mt-3"
                    >
                      Status <span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[70%] md:w-[50%]">
                    <select
                      name="status"
                      id="status"
                      // onChange={(e) => {
                      //   setStatus(e.target.value);
                      //   validateStatus(e.target.value); // Validate status dynamically
                      // }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a status</option>
                      <option value="2">Paid</option>
                      <option value="1">Pending</option>
                      <option value="0">Over Due</option>
                    </select>
                    {/* {errors.status && (
                              <p className="text-red-500 text-sm mb-4 mt-1">
                                {errors.status}
                              </p>
                            )} */}
                  </div>
                </div>
                {/* {error.status && <p className="error">{error.status}</p>} */}

                <div className="flex  justify-end gap-2 mt-6 md:mt-14">
                  <button
                    onClick={closeAddModal}
                    className="bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                  // onClick={handlesubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />

    </div>
  );
}

export default Recurring_Details;

