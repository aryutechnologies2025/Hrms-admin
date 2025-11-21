import React from "react";
import Sidebar from "../components/Sidebar";
import Employees_Card from "../components/employees components/Employees_Card";
import Inter_card_details from "../components/employees components/Inter_card_details";

const Inter_card = () => {
  return (
    <div className="flex ">
      
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>

      <Inter_card_details />
    </div>
  );
};

export default Inter_card;