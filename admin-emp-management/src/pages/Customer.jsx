import React from "react";
import Sidebar from "../components/Sidebar";
import Customer_Mainbar from "../components/customer components/Customer_Mainbar";

const Customer = () => {
  return (
    <div className="flex">
      <div>
        <Sidebar />
      </div>
      <Customer_Mainbar/>
    </div>
  );
};

export default Customer;
