import React, { useEffect, useState } from "react";
import DateRangePicker from "../../DateRangePicker";
import dayjs from "dayjs";
import axios from "axios";
import { API_URL } from "../../config";
import { CloudCog, Loader } from "lucide-react";

function BillingsAndEarnings() {

  const [clientsdetails, setClientsdetails] = useState([]);
  const [data, setData] = useState([]);

  console.log("data", data);

  const [errors, setErrors] = useState("");

  const [selectedClient, setSelectedClient] = useState("");
  // console.log("selectedClient", selectedClient);
  //  console.log("clientsdetails", clientsdetails);

  const [dates, setDates] = useState({
    fromDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    toDate: dayjs().endOf("month").format("YYYY-MM-DD"),
  });

    const [loadingClients, setLoadingClients] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // console.log("dates", dates);
  useEffect(() => {
    if (dates.fromDate && dates.toDate) {
      fetchAllTechList();
    }
  }, [dates.fromDate, dates.toDate]);

  const fetchAllTechList = async () => {
        setLoadingClients(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/bidder/get-bidding-client-name`,
        {
          withCredentials: true,
          params: {
            fromDate: dates.fromDate,
            toDate: dates.toDate,

          },
        }
      );

      // console.log("response",response)

      const clients = response?.data?.data || [];

      setClientsdetails(clients);

      //  Default select FIRST client (string)
      if (!selectedClient && clients.length > 0) {
        setSelectedClient(clients[0]);
      }



    } catch (err) {
      setErrors("Failed to fetch biddingList.");
    }finally {
      setLoadingClients(false);
    }
  };


  useEffect(() => {
    if (
      dates.fromDate &&
      dates.toDate &&
      selectedClient
    ) {
      fetchAlldetails();
    }
  }, [dates.fromDate, dates.toDate, selectedClient]);


  const fetchAlldetails = async () => {
      setLoadingData(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/bidder/get-bidding-transaction`,
        {
          withCredentials: true,
          params: {
            client: selectedClient,
            fromDate: dates.fromDate,
            toDate: dates.toDate,

          },
        }
      );

      // console.log("response",response)

      setData(response?.data)




    } catch (err) {
      setErrors("Failed to fetch biddingList.");
    }finally {
      setLoadingData(false);
    }
  };







  //  const [dates, setDates] = useState({ });


  return (
    <>
      {/* Date Filters */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        {/* <div className="flex gap-4">
          <div>
            <label className="text-xs text-gray-500">From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="block border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">To</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="block border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div> */}

        <DateRangePicker
          fromDate={dates.fromDate}
          toDate={dates.toDate}
          onChange={(range) => setDates(range)}
        />

        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
          Download CSV
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Client list */}
        {/* <div className="col-span-12 md:col-span-3 bg-white rounded-xl p-4 shadow-sm">
          <ul className="space-y-2 text-sm max-h-[420px] overflow-y-auto">
            {clientsdetails.map((client) => (
              <li
                key={client}
                onClick={() => setSelectedClient(client)}
                className={`px-3 py-2 rounded-lg cursor-pointer transition
    ${selectedClient === client
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {client}
              </li>
            ))}
          </ul>
        </div> */}

          <div className="col-span-12 md:col-span-3 bg-white rounded-xl p-4 shadow-sm">
          {loadingClients ? (
            <Loader />
          ) : (
            <ul className="space-y-2 text-sm max-h-[420px] overflow-y-auto">
              {clientsdetails.map((client) => (
                <li
                  key={client}
                  onClick={() => setSelectedClient(client)}
                  className={`px-3 py-2 rounded-lg cursor-pointer transition ${
                    selectedClient === client
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {client}
                </li>
              ))}
              {clientsdetails.length === 0 && (
                <li className="text-gray-400 px-3 py-2">No clients found</li>
              )}
            </ul>
          )}
        </div>

        {/* Right Content */}
         <div className="col-span-12 md:col-span-9 space-y-6">
          {loadingData ? (
            <div className="bg-white rounded-xl p-6 shadow-sm flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            <>
              {/* Summary */}
              <div className="bg-white rounded-xl p-6 shadow-sm flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    ${data?.overallNetTotal ?? "0.00"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Your earnings after fees & taxes
                  </p>
                  <div className="mt-4 space-y-1 text-sm text-gray-700">
                    <p>
                      <span className="text-gray-600">Total billed:</span>{" "}
                      <span className="font-medium text-gray-900">
                        ${Number(data?.overallEarnings || 0).toFixed(2)}
                      </span>
                    </p>

                    <p>
                      <span className="text-gray-600">Total fees &amp; taxes:</span>{" "}
                      <span className="font-medium text-gray-900">
                        {data?.overallDeductions != null
                          ? Number(data.overallDeductions) < 0
                            ? `-$${Math.abs(data.overallDeductions).toFixed(2)}`
                            : `$${Number(data.overallDeductions).toFixed(2)}`
                          : "$0.00"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-3xl">
                  💰
                </div>
              </div>

              {/* Jobs Table */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">Job name</th>
                      <th className="px-6 py-3 text-right">Billed</th>
                      <th className="px-6 py-3 text-right">Fees & taxes</th>
                      <th className="px-6 py-3 text-right">Earnings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.transactions?.map((job, index) => (
                      <tr key={index} className="border-t hover:bg-gray-50">
                        <td className="px-6 text-left py-4">{job.title}</td>
                        <td className="px-6 py-4 text-right align-top">
                          <p className="text-sm font-semibold text-gray-500">
                            ${Number(job.earnings).toFixed(0)}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right align-top">
                          <div className="leading-tight">
                            <p className="text-sm font-medium text-gray-500">
                              {job?.deductions != null
                                ? Number(job.deductions) < 0
                                  ? `-$${Math.abs(job.deductions).toFixed(2)}`
                                  : `$${Number(job.deductions).toFixed(2)}`
                                : "$0.00"}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-400 font-semibold">
                              ${job.serviceFee} Fees + ${job.wht} tax
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-right align-top">
                          <p className="text-sm font-semibold text-gray-500">
                            ${Number(job.netTotal)}
                          </p>
                        </td>

                        
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default BillingsAndEarnings;
