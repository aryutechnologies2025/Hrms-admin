import Sidebar from "../components/Sidebar";
import Settings_details from "./Settings_details";
import Settings_invoice_details from "./Settings_invoice_details";

const Setting_invoice_main = () => {
  return (
    <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>

      <Settings_invoice_details />
    </div>
  );
};

export default Setting_invoice_main;