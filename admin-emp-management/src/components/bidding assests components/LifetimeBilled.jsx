import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";

function LifetimeBilled() {

  const [clientsdetails, setClientsdetails] = useState([]);
  const [data, setData] = useState([]);

  console.log("data", data);

  const [errors, setErrors] = useState("");

  const [selectedClient, setSelectedClient] = useState("");
  


  // console.log("dates", dates);
  useEffect(() => {
  
      fetchAllTechList();
    
  }, []);

  const fetchAllTechList = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/bidder/get-bidding-client-name`,
        {
          withCredentials: true,
        
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
    }
  };


  useEffect(() => {
    if (
      
      selectedClient
    ) {
      fetchAlldetails();
    }
  }, [ selectedClient]);


  const fetchAlldetails = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/bidder/get-bidding-transaction`,
        {
          withCredentials: true,
          params: {
            client: selectedClient,
       

          },
        }
      );

      // console.log("response",response)

      setData(response?.data)




    } catch (err) {
      setErrors("Failed to fetch biddingList.");
    }
  };




  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Client List */}
      <div className="col-span-12 md:col-span-3 bg-white rounded-xl p-4 shadow-sm">
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
      </div>

      {/* Right Content */}
      <div className="col-span-12 md:col-span-9">
        {/* Download */}
        {/* <div className="flex justify-end mb-3">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
            Download CSV
          </button>
        </div> */}

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm flex flex-col items-center justify-center text-center p-16">
          {/* Icon */}
          <div className="text-6xl mb-4">🪙</div>

          {/* Amount */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            {selectedClient} lifetime billed amount is{" "}
            <span className="font-bold">
              ${data?.overallEarnings}
            </span>
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-500 max-w-md">
            This is the total sum of invoices billed or pending to be paid,
            excluding taxes and fees.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LifetimeBilled;
