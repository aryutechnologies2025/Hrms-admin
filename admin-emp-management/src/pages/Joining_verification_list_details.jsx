import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import Mobile_Sidebar from "../components/Mobile_Sidebar";
import { useNavigate } from "react-router-dom";

export default function JoiningVerifyPage() {
  const [titles, setTitles] = useState([]);
  const [joiningList, setJoiningList] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [verifyList, setVerifyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const navigate = useNavigate();

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setErrors("");
  };

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resTitles, resJoining, resVerify] = await Promise.all([
          axios.get(`${API_URL}/api/joining-verify/get-title-joininglist`),
          axios.get(`${API_URL}/api/joining/view-joininglist`),
          axios.get(`${API_URL}/api/joining-verify/view-joininglistVerify`),
        ]);

        setTitles(resTitles.data.data || []);
        setJoiningList(resJoining.data.data || []);
        setVerifyList(resVerify.data.data || []);

        const prefilled = {};
        resJoining.data.data.forEach((j) => {
          if (j.radio === "yes") prefilled[j._id] = "yes";
          else if (j.checkbox === "yes") prefilled[j._id] = false;
          else if (j.dropdown?.length > 0)
            prefilled[j._id] = j.dropdown[0].option;
        });
        setFormValues(prefilled);
      } catch (err) {
        console.error("Error fetching data:", err);
        showNotification("Failed to load data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (id, value) => {
    setFormValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Save all permissions
  const handleSaveAll = async () => {
    try {
      setSaving(true);
      const payload = {
        verify: Object.entries(formValues).map(([id, value]) => {
          const titleObj =
            titles.find((t) => t._id === id) ||
            joiningList.find((j) => j._id === id);

          return {
            title: titleObj?.title || "",
            option: typeof value === "boolean" ? (value ? "yes" : "no") : value,
          };
        }),
      };

      await axios.post(
        `${API_URL}/api/joining-verify/create-joininglistVerify`,
        payload
      );
      setIsAddModalOpen(false);
      showNotification("All permissions saved successfully!");

      // Refresh verify list
      const resVerify = await axios.get(
        `${API_URL}/api/joining-verify/view-joininglistVerify`
      );
      setVerifyList(resVerify.data.data || []);
    } catch (err) {
      console.error("Error saving:", err);
      showNotification("Failed to save permissions", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 w-full">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-md shadow-md text-white ${
            notification.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <Mobile_Sidebar />
        <div className="flex gap-2 items-center cursor-pointer">
          <p
            className="text-sm text-gray-500"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </p>
          <p>{">"}</p>
          <p className="text-sm text-blue-500">Joining List</p>
        </div>
        {/* Add Button */}
        <div className="flex justify-between mt-8 mb-3">
          <h1 className="text-2xl md:text-3xl font-semibold">Joining List</h1>
          <button
            onClick={openAddModal}
            className="bg-blue-600 px-3 py-2 text-white w-20 rounded-2xl"
          >
            Add
          </button>
        </div>

        {/* Permission Assignment */}
        {isAddModalOpen && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden ">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permission
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {joiningList.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* Radio */}
                        {item.radio === "yes" && (
                          <div className="flex items-center space-x-4">
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name={item._id}
                                //   value="yes"
                                //   checked={formValues[item._id] === "yes"}
                                onChange={(e) =>
                                  handleChange(item._id, e.target.value)
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                Yes
                              </span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name={item._id}
                                value="no"
                                checked={formValues[item._id] === "no"}
                                onChange={(e) =>
                                  handleChange(item._id, e.target.value)
                                }
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                No
                              </span>
                            </label>
                          </div>
                        )}

                        {/* Checkbox */}
                        {item.checkbox === "yes" && (
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={!!formValues[item._id]}
                              onChange={(e) =>
                                handleChange(item._id, e.target.checked)
                              }
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              Grant permission
                            </span>
                          </label>
                        )}

                        {/* Dropdown */}
                        {item.dropdown?.length > 0 && (
                          <select
                            value={formValues[item._id] || ""} // keep it controlled
                            onChange={
                              (e) =>
                                handleChange(
                                  item._id,
                                  e.target.value === "" ? "-" : e.target.value
                                ) // if "" then save "-"
                            }
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 
               focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          >
                            <option value="">Select option</option>
                            {item.dropdown.map((opt) => (
                              <option key={opt._id} value={opt.option}>
                                {opt.option}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-6 py-4 bg-gray-50 flex justify-end">
                <button
                  onClick={closeAddModal}
                  className="bg-red-100 hover:bg-red-200 text-sm text-red-600 px-5 py-2 font-semibold rounded-full"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAll}
                  disabled={saving}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    saving ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {saving ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save All Permissions"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Saved Verify List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">
              Saved Verify List
            </h2>
            {/* <p className="text-sm text-gray-500">Previously saved verification records</p> */}
          </div>

          <div className="p-6">
            {verifyList.length === 0 ? (
              <div className="text-center py-8">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No verification records
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by saving your first set of permissions.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {verifyList.map((record) => (
                  <div
                    key={record._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-700">
                        Record ID: {record._id.slice(-6)}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {record.verify.map((v, idx) => (
                        <li key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-600">{v.title}:</span>
                          <span
                            className={`font-medium ${
                              v.option === "yes"
                                ? "text-green-600"
                                : v.option === "no"
                                ? "text-red-600"
                                : "text-blue-600"
                            }`}
                          >
                            {v.option}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
