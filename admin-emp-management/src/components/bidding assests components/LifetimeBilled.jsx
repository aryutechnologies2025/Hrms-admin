import React, { useState } from "react";

function LifetimeBilled() {
  const clientData = {
    "A Dark Cloud Creative": 2450.75,
    "Akash Sharma": 1800.0,
    "Bon Millar": 950.25,
    "Black Belt Marketing": 3200.5,
    "Blend Agency": 2750.0,
    "Brandon Weldes": 1120.75,
    "Caption Easy Inc": 4300.25,
    "CleverKickers Ltd": 1980.0,
    "CreativeMotion": 3650.5,
    "Darky Harry": 890.0,
    "David Read": 1540.25,
    "Drive Local Business": 2890.0,
    FUTUREPROOF: 4100.75,
    "Gadget Mart": 2240.5,
  };

  const clients = Object.keys(clientData);

  const [selectedClient, setSelectedClient] = useState(clients[0]);

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Client List */}
      <div className="col-span-12 md:col-span-3 bg-white rounded-xl p-4 shadow-sm">
        <ul className="space-y-2 text-sm max-h-[420px] overflow-y-auto">
          {clients.map((client) => (
            <li
              key={client}
              onClick={() => setSelectedClient(client)}
              className={`px-3 py-2 rounded-lg cursor-pointer transition
                ${
                  selectedClient === client
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
        <div className="flex justify-end mb-3">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
            Download CSV
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm flex flex-col items-center justify-center text-center p-16">
          {/* Icon */}
          <div className="text-6xl mb-4">🪙</div>

          {/* Amount */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            {selectedClient} lifetime billed amount is{" "}
            <span className="font-bold">
              ${clientData[selectedClient].toFixed(2)}
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
