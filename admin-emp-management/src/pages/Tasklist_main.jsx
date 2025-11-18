import React from "react";
import Sidebar from "../components/Sidebar";
import Task_view_all from "../components/taskList/Task_view_all";

const Tasklist_main = () => {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>
      <Task_view_all />
    </div>
  );
};

export default Tasklist_main;