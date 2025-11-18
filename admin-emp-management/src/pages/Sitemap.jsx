import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa";

const Sitemap = () => {
  const navigate = useNavigate();
  const [employeeButtonClicked, setEmployeeButtonClicked] = useState(false);

  const [menuItems, setMenuItems] = useState([
    { label: "Login", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Leaves", path: "/leaves" },
    { label: "Payroll", path: "/payroll" },
    // { label: "Finance", path: "/finance" },
    {
      label: "Attendance",
      children: [
        { label: "Monthly Details", path: "/monthlyattendancedetails" },
      ],
      path: "/attendance",
    },
    {
      label: "Employee",
      toggle: true,
      children: [
        { label: "Roles", path: "/roles" },
        // { label: "Permission", path: "/permission" },
        {
          label: "Employees",
          path: "/employees",
          children: [
            { label: "Employee Details", path: "/employeedetails" },
            { label: "Edit Employee Details", path: "/editemployeedetails" },
          ],
        },
        { label: "Add New Member", path: "/createemployee" },
        { label: "Holidays", path: "/holidays" },
        { label: "Working Days", path: "/workingdays" },
      ],
    },
  ]);

  const renderItems = (items, level = 0) => {
    return items.map((item, index) => {
      const color =
        level === 0 ? "bg-blue-500" : level === 1 ? "bg-gray-500" : "bg-slate-300";

      return (
        <div key={index} className="flex flex-col gap-1 ms-6">
          <div
            className="flex items-center gap-3 cursor-pointer hover:underline"
            onClick={() => item.path && window.open(item.path, "_blank")}
          >
            <div className={`h-3 w-3 rounded-full ${color}`}></div>
            <p>{item.label}</p>
            {item.toggle && <FaAngleDown />}
          </div>
          {item.children && renderItems(item.children, level + 1)}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen flex flex-col gap-4 items-start justify-start p-6">
      <h2 className="text-xl font-semibold mb-4">Sitemap</h2>
      {renderItems(menuItems)}
    </div>
  );
};

export default Sitemap;
