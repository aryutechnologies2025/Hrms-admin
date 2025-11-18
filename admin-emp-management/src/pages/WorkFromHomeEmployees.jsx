import React from "react";
import Sidebar from "../components/Sidebar";
import WorkFromHomeEmployees_Mainbar from "../components/work from home components/WorkFromHomeEmployees_Mainbar";

const WorkFromHomeEmployees = () => {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>
      <WorkFromHomeEmployees_Mainbar />
    </div>
  );
};

export default WorkFromHomeEmployees;
