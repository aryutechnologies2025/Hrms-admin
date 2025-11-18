import React from "react";
import Sidebar from "../components/Sidebar";
import Roles_Mainbar from "../components/roles components/Roles_Mainbar";
import Departments_Mainbar from "../components/departments/departments_mainbar";

const Departments = () => {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>
      <Departments_Mainbar/>
    </div>
  );
};

export default Departments;
