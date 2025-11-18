import React from "react";
import Sidebar from "../components/Sidebar";
import Task_view_All_client from "../components/taskList/Task_View_All_Client";

const Tasklist_main_client = () => {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>
      <Task_view_All_client />
    </div>
  );
};

export default Tasklist_main_client;