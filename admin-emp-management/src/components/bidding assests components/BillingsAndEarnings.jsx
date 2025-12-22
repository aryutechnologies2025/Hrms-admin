import React, { useState } from "react";

function BillingsAndEarnings() {
  const clients = [
    "Ardit Kallaba",
    "Aventur Capital",
    "Gazelle Marketing ApS",
    "Otis Ferguson",
    "RYVR Interactive",
  ];

  const billingData = {
    "Ardit Kallaba": {
      earnings: 1248.5,
      totalBilled: 1380,
      fees: 131.5,
      jobs: [
        { name: "WordPress Plugin API Enhancement", fees: 25.25, billed: 250 },
        { name: "WooCommerce Customization", fees: 40, billed: 400 },
        { name: "Payment Gateway Integration", fees: 30.25, billed: 300 },
        { name: "Bug Fixes & Optimization", fees: 36, billed: 360 },
      ],
    },
    "Aventur Capital": {
      earnings: 2150,
      totalBilled: 2400,
      fees: 250,
      jobs: [
        { name: "React Dashboard UI", fees: 80, billed: 800 },
        { name: "API Integration", fees: 60, billed: 600 },
        { name: "Authentication Module", fees: 50, billed: 500 },
        { name: "Performance Optimization", fees: 60, billed: 500 },
      ],
    },
    "Gazelle Marketing ApS": {
      earnings: 890.75,
      totalBilled: 980,
      fees: 89.25,
      jobs: [
        { name: "Landing Page Redesign", fees: 30, billed: 300 },
        { name: "SEO Dashboard", fees: 25.5, billed: 255 },
        { name: "Google Analytics Integration", fees: 18.75, billed: 187.5 },
        { name: "Marketing Automation Setup", fees: 15, billed: 150 },
      ],
    },
    "Otis Ferguson": {
      earnings: 460,
      totalBilled: 500,
      fees: 40,
      jobs: [
        { name: "Portfolio Website", fees: 20, billed: 250 },
        { name: "Contact Form Integration", fees: 10, billed: 125 },
        { name: "Website Maintenance", fees: 10, billed: 125 },
      ],
    },
    "RYVR Interactive": {
      earnings: 3180.25,
      totalBilled: 3500,
      fees: 319.75,
      jobs: [
        { name: "SaaS Admin Panel", fees: 120, billed: 1200 },
        { name: "Role Based Access Control", fees: 75, billed: 750 },
        { name: "Subscription Billing System", fees: 85, billed: 850 },
        { name: "Email & Notification Service", fees: 39.75, billed: 397.5 },
        { name: "Bug Fixes & QA Support", fees: 0, billed: 302.5 },
      ],
    },
  };

  const [selectedClient, setSelectedClient] = useState(clients[0]);
  const [fromDate, setFromDate] = useState("2025-01-01");
  const [toDate, setToDate] = useState("2025-12-31");

  const data = billingData[selectedClient];

  return (
    <>
      {/* Date Filters */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div className="flex gap-4">
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
        </div>

        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
          Download CSV
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Client list */}
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
        <div className="col-span-12 md:col-span-9 space-y-6">
          {/* Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                ${data.earnings.toFixed(2)}
              </h2>
              <p className="text-sm text-gray-500">
                Your earnings after fees & taxes
              </p>

              <div className="mt-4 text-sm text-gray-600 space-y-1">
                <p>Total billed: ${data.totalBilled}</p>
                <p>Total fees & taxes: ${data.fees}</p>
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
                  <th className="px-6 py-3 text-right">Fees & taxes</th>
                  <th className="px-6 py-3 text-right">Billed</th>
                </tr>
              </thead>
              <tbody>
                {data.jobs.map((job, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{job.name}</td>
                    <td className="px-6 py-4 text-right">${job.fees}</td>
                    <td className="px-6 py-4 text-right font-semibold">
                      ${job.billed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default BillingsAndEarnings;
