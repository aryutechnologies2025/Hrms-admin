import React, { useState, useEffect, useRef, useMemo } from "react";

import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
DataTable.use(DT);

import axios from "../../api/axiosConfig";
import { API_URL } from "../../config";
// import { capitalizeFirstLetter } from "../../StringCaps";
import { TfiPencilAlt } from "react-icons/tfi";
import { RiDeleteBin6Line } from "react-icons/ri";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FileUpload } from "primereact/fileupload";
import { MultiSelect } from "primereact/multiselect";
import { FaEye } from "react-icons/fa";
import { Editor } from "primereact/editor";
import { FaTrash } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import Loader from "../Loader";
import { FaLink } from "react-icons/fa";

const Bidding_reports_details = () => {
  const navigate = useNavigate();

  // const location = useLocation();

  const employeeIds = window.location.pathname.split("/")[2];
  console.log("window.location.pathname", employeeIds);

  //   const [status, setStatus] = useState("");
  const storedDetatis = localStorage.getItem("hrmsuser");
  const parsedDetails = JSON.parse(null);
  const userid = parsedDetails ? parsedDetails.id : null;
  const [errors, setErrors] = useState({});

  const [accounts, setAccounts] = useState([]);
  console.log("accounts", accounts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // const handleConnectClick = (row) => {
  //   navigate("/bidding-details", { state: { row } });
  // };

  function handleConnectClick(row) {
    navigate(`/bidding-all-details/${row}`);

    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/bidder/get-account-bidder-wise`
        );
        if (data.success) {
          setAccounts(data.data);
        } else {
          setError("Failed to fetch data.");
        }
      } catch {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const [searchText, setSearchText] = useState("");

  // Filter function for nested data
  const filteredAccounts = accounts
    .map((acc) => {
      const filteredData = acc.data
        .map((bidder) => {
          const filteredRows = bidder.data.filter((row) =>
            Object.values(row)
              .join(" ")
              .toLowerCase()
              .includes(searchText.toLowerCase())
          );
          if (filteredRows.length > 0) {
            return { ...bidder, data: filteredRows };
          }
          return null;
        })
        .filter(Boolean); // remove null bidders

      if (filteredData.length > 0) {
        return { ...acc, data: filteredData };
      }
      return null;
    })
    .filter(Boolean);

  // if (loading) return <div>Loading…</div>;
  // if (error) return <div className="text-red-600">{error}</div>;

  // filter

  const [filters, setFilters] = useState({
    account: "",
    bidder: "",
    date: "",
    technology: "",
    reply: "",
  });

  const [temp, setTemp] = useState(filters);
  const accountsall = [
    ...new Set(filteredAccounts.map((a) => a.account).filter(Boolean)),
  ];
  const bidders = [
    ...new Set(
      filteredAccounts.flatMap((a) => a.data.map((b) => b.name)).filter(Boolean)
    ),
  ];
  const technologies = [
    ...new Set(
      filteredAccounts
        .flatMap((a) =>
          a.data.flatMap((b) => b.data.map((r) => r.technology?.name))
        )
        .filter(Boolean)
    ),
  ];
  const replyOptions = [
    ...new Set(filteredAccounts.map((r) => r.reply).filter(Boolean)),
  ];
  const filteredAccountsData = useMemo(() => {
    return filteredAccounts
      .filter((acc) => !filters.account || acc.account === filters.account)
      .map((acc) => ({
        ...acc,
        data: acc.data.filter((b) => {
          return (
            (!filters.bidder || b.name === filters.bidder) &&
            (!filters.technology ||
              b.data.some((r) => r.technology?.name === filters.technology)) &&
            (!filters.date ||
              b.data.some(
                (r) =>
                  new Date(r.date).toLocaleDateString("en-GB") ===
                  new Date(filters.date).toLocaleDateString("en-GB")
              )) &&
            (!filters.reply ||
              b.data.some((r) =>
                r.reply?.toLowerCase().includes(filters.reply.toLowerCase())
              ))
          );
        }),
      }))
      .filter((acc) => acc.data.length > 0); // remove accounts with no matching bidders
  }, [filteredAccounts, filters]);

  const handleSubmit = () => setFilters(temp);
  const handleReset = () => {
    setTemp({ account: "", bidder: "", date: "", technology: "", reply: "" });
    setFilters({
      account: "",
      bidder: "",
      date: "",
      technology: "",
      reply: "",
    });
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
                className=" text-gray-500 cursor-pointer"
                onClick={() => navigate("/")}
              >
                Dashboard
              </p>
              <p>{">"}</p>
              <p className=" text-blue-500">Bidding Reports</p>
              <p>{">"}</p>
            </div>

            <div className="p-2 md:p-5">
              {/* Filters */}
              <div className="   flex flex-wrap gap-4 items-end ">
                {/* Account */}
                <div className="flex flex-col w-40 md:w-48">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Account
                  </label>
                  <select
                    value={temp.account}
                    onChange={(e) =>
                      setTemp({ ...temp, account: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Accounts</option>
                    {accountsall.map((a) => (
                      <option key={a}>{a}</option>
                    ))}
                  </select>
                </div>

                {/* Bidder */}
                <div className="flex flex-col w-40 md:w-48">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Bidder
                  </label>
                  <select
                    value={temp.bidder}
                    onChange={(e) =>
                      setTemp({ ...temp, bidder: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Bidders</option>
                    {bidders.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </div>
                {/* Technology */}
                <div className="flex flex-col w-40 md:w-48">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Technology
                  </label>
                  <select
                    value={temp.technology}
                    onChange={(e) =>
                      setTemp({ ...temp, technology: e.target.value })
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Technologies</option>
                    {technologies.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col w-40 md:w-48">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Reply
                  </label>
                  <input
                    type="text"
                    value={temp.reply}
                    onChange={(e) =>
                      setTemp({ ...temp, reply: e.target.value })
                    }
                    placeholder="Search reply"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Date */}
                <div className="flex flex-col w-40 md:w-48">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={temp.date}
                    onChange={(e) => setTemp({ ...temp, date: e.target.value })}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg"
                  >
                    Submit
                  </button>
                  <button
                    onClick={handleReset}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded-lg"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
            {/* Search Input */}
            <div className="overflow-x-auto rounded-xl  mt-2">
              {/* Search Input */}
              <div className="p-4 flex justify-end">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className=" w-[50%] md:w-[20%] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                <table className="min-w-full text-sm text-left border-separate border-spacing-0">
                  <thead className="sticky top-0 bg-gray-500 z-10">
                    <tr>
                      <th className="border-b px-4 py-2 font-semibold">Date</th>
                      <th className="border-b px-4 py-2 font-semibold">
                        Client
                      </th>
                      <th className="border-b px-4 py-2 font-semibold text-center">
                        Connects
                      </th>
                      <th className="border-b px-4 py-2 font-semibold text-center">
                        Reply
                      </th>
                      <th className="border-b px-4 py-2 font-semibold">
                        Employee
                      </th>
                      <th className="border-b px-4 py-2 font-semibold">
                        Technology
                      </th>
                      <th className="border-b px-4 py-2 font-semibold">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white ">
                    {filteredAccountsData.map((acc, aIdx) => (
                      <React.Fragment key={aIdx}>
                        {/* Account Row */}
                        <tr>
                          <td
                            colSpan={7}
                            className="px-4 py-4 font-bold text-left text-lg border-b border-gray-300"
                          >
                            {acc.account}
                          </td>
                        </tr>

                        {acc.data.map((bidder, bIdx) => (
                          <React.Fragment key={bIdx}>
                            {/* Bidder Row */}
                            <tr className="">
                              <td
                                colSpan={7}
                                className="px-4  py-4 font-semibold text-left border-b border-gray-200"
                              >
                                {bidder.name}
                              </td>
                            </tr>

                            {/* Records */}
                            {bidder.data.map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                className="hover:bg-gray-50 transition-colors duration-150"
                              >
                                <td className="border-b px-4 py-3">
                                  {new Date(row.date).toLocaleDateString(
                                    "en-GB"
                                  )}
                                </td>
                                <td className="border-b px-4 py-2">
                                  {row.client}
                                </td>

                                <td
                                  className="border-b px-4 py-2 text-center cursor-pointer clickable-blue"
                                  onClick={() =>
                                    handleConnectClick(row?.connects?.ids || "")
                                  }
                                >
                                  {row.connects?.count ?? 0}
                                </td>
                                <td className="border-b px-4 py-2">
                                  {row.reply}
                                </td>
                                <td className="border-b px-4 py-2">
                                  {row.employeeName}
                                </td>
                                <td className="border-b px-4 py-2">
                                  {row.technology?.name || "-"}
                                </td>
                                <td className="border-b px-4 py-2">
                                  {row.status}
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    ))}

                    {filteredAccountsData.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-4 text-gray-500"
                        >
                          No records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <Footer />
        </>
      )}
    </div>
  );
};
export default Bidding_reports_details;
