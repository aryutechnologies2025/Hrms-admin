import React from "react";
import Sidebar from "../components/Sidebar";
import Permission_Mainbar from "../components/permission components/Permission_Mainbar";

const Permission = () => {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>
      <Permission_Mainbar />
    </div>
  );
};

export default Permission;
