import React from "react";
import Mobile_Sidebar from "../components/Mobile_Sidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { API_URL } from "../config";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import { FaFileExport } from "react-icons/fa6";
import { capitalizeFirstLetter } from "../utils/StringCaps";
import { IoMdAdd } from "react-icons/io";
import { FaLink } from "react-icons/fa";
import Footer from "../components/Footer";
import Loader from "../components/Loader";

function Link_details() {
  const navigate = useNavigate();

  const [alllist, setAlllist] = useState([]);
  const [loading, setLoading] = useState(true); 
  console.log("alllist", alllist);

  const fetchProject = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/link/get-link-by-category`
      );
      console.log(response);
      if (response.data.success) {
        setAlllist(response.data.data);
        setLoading(false);
      } else {
        setErrors("Failed to fetch roles.");
      }
    } catch (err) {
      setErrors("Failed to fetch roles.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  return (
    <div className="flex  flex-col justify-between w-screen min-h-screen bg-gray-100 px-3 md:px-5 pt-2 md:pt-10 ">
      {loading ? (
        <Loader />
      ) : (
        <>
      <div className="p-3 ">
       

        {/* breadcrumb */}
        <div className="flex justify-between gap-2  text-sm items-center">
           <Mobile_Sidebar />
           <div className="flex gap-1  items-center">
          <p
            className="text-sm text-gray-500"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </p>
          <p>{">"}</p>
          <p className="text-sm text-blue-500 ">Links</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-between mt-2 md:mt-4 mb-1 md:mb-3">
          <h1 className="text-2xl md:text-3xl font-semibold">Links</h1>
          <div className="flex gap-3 ">
            <button
              // onClick={openAddModal}
              onClick={() => navigate("/addlinks")}
              className="flex justify-between px-7 py-1 md:py-2 text-white bg-blue-500 hover:bg-blue-600 font-normal md:font-medium items-center w-28 rounded-2xl"
            ><IoMdAdd className="text-white size-5" />
               Link
            </button>
            <button
              onClick={() => navigate("/addcategory")}
              className="flex justify-between px-3 py-1 md:py-2 text-white bg-blue-500 hover:bg-blue-600 font-normal md:font-medium items-center w-32 rounded-2xl"
            ><IoMdAdd className="text-white size-5" />
              Category
            </button>
          </div>
        </div>

        <div className="min-h-screen p-2 md:p-10 bg-white">
          <div className="p-2 md:p-8 bg-gray-200 shadow-lg rounded-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {Object.entries(
                alllist.reduce((acc, task) => {
                  const category = task.category || "Uncategorized";
                  if (!acc[category]) acc[category] = [];
                  acc[category].push(...task.links);
                  return acc;
                }, {})
              ).map(([category, links], index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 shadow hover:shadow-xl transition-all duration-300 p-6 flex flex-col"
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 tracking-wide capitalize leading-snug">
                      {category}
                    </h2>
                    <span className="flex-shrink-0 ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-xl self-start">
                      {links.length} links
                    </span>
                  </div>

                  {/* Scrollable Link List */}
                  <ul className="overflow-y-auto custom-scrollbar space-y-3  pr-1">
                    {links.map((link, i) => (
                      <li key={i}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 hover:underline transition"
                        >
                          <FaLink className="text-blue-700" />

                          {capitalizeFirstLetter(link.title)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </>
      )}
      <Footer />
    </div>
  );
}

export default Link_details;
