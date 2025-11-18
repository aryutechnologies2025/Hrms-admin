import React, { useEffect, useState } from "react";
import interview_logo from "../../../public/interview.png";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import axios from "../../api/axiosConfig";
import { API_URL } from "../../config";
import Loader from "../Loader";

const DashBoard_Details = () => {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [dashBoard, setDashBoard] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashBoard();
  }, []);

  const fetchDashBoard = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/job-type/recruitment-dashboard`
      );
      setDashBoard(response.data.result);
      setLoading(false);
    } catch (err) {
      setErrors("Failed to fetch Dashboard.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-between bg-gray-100 px-3 py-3 md:px-6 md:py-6 lg:px-10 lg:py-10">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            <Mobile_Sidebar />

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-3">
              <p
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={() => navigate("/dashboard-Recruitment")}
              >
                Dashboard
              </p>
              <span className="text-gray-400">›</span>
              <p className="text-gray-700 font-medium">Details</p>
            </div>

            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm px-5 py-4 flex justify-between items-center">
              <p className="font-semibold text-lg md:text-xl">Dashboard</p>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-6">
              {dashBoard?.map((item) => (
                <div
                  key={item?.interviewId}
                  className="bg-white border rounded-2xl px-5 py-4 cursor-pointer hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={interview_logo}
                      alt="interview"
                      className="w-10 h-10 object-contain"
                    />
                    <p className="font-medium text-sm md:text-base uppercase truncate">
                      {item?.interviewName}
                    </p>
                  </div>

                  <hr className="my-4" />

                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-semibold text-green-700">
                      {item.count}
                    </p>
                    <button
                      onClick={() =>
                        navigate("/Candidate-Recruitment", {
                          state: {
                            id: item?.interviewId,
                            name: item?.interviewName,
                          },
                        })
                      }
                      className="text-[11px] md:text-[12px] font-semibold bg-green-100 text-green-800 rounded-full px-4 py-2 hover:bg-green-200 transition"
                    >
                      OPEN
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default DashBoard_Details;
